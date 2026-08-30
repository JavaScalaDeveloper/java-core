# 怎样解决 Maven 依赖冲突？

同一坐标被引入多个版本时会发生冲突（近者优先、路径短者优先等调解规则）。处理思路：

1. **看清冲突**：`mvn dependency:tree`（或 `-Dverbose` / IDEA 依赖分析）定位谁拉了哪个版本。
2. **排除**：在直接依赖上 `<exclusions>` 去掉不想要的传递依赖。
3. **统一版本**：父 POM `dependencyManagement` 或 `<properties>` 锁定版本；Spring 系优先用 BOM（如 `spring-boot-dependencies`）。
4. **必要时显式声明**：自己在当前模块声明目标版本，覆盖传递依赖。

优先用 BOM / `dependencyManagement` 管版本，排除作补充；改完再跑一遍 tree 确认只剩一个版本。

# Spring Cloud Alibaba 生态组件详解

> 国内微服务主流栈：**Nacos + Gateway + OpenFeign + Sentinel**（+ Seata / RocketMQ 按需）。  
> 依赖：`spring-cloud-alibaba-dependencies` BOM，与 Spring Boot / Spring Cloud 版本对齐。

## 生态全景

```text
                    ┌─────────────────────────────────────┐
  客户端 / App ────►│  Spring Cloud Gateway（路由/鉴权）   │
                    │  + Sentinel 网关限流 / 熔断           │
                    └──────────────┬──────────────────────┘
                                   │ lb://service-name
                    ┌──────────────▼──────────────────────┐
                    │  OpenFeign + LoadBalancer           │
                    │  + Sentinel（Feign 降级/限流）        │
                    └──────────────┬──────────────────────┘
           ┌──────────────────────┼──────────────────────┐
           ▼                      ▼                      ▼
    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │  业务服务 A  │        │  业务服务 B  │        │  业务服务 C  │
    └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
           │                      │                      │
           └──────────────────────┼──────────────────────┘
                                  ▼
              ┌───────────────────────────────────────────┐
              │  Nacos（注册发现 + 配置中心）               │
              │  Sentinel（限流/熔断/降级/热点/系统保护）     │
              │  Seata（分布式事务，按需）                   │
              │  RocketMQ（异步解耦，按需）                  │
              │  SkyWalking / Sleuth（链路追踪）            │
              └───────────────────────────────────────────┘
```

| 组件 | 依赖（示例） | 职责 |
|------|--------------|------|
| Nacos Discovery | `spring-cloud-starter-alibaba-nacos-discovery` | 服务注册与发现 |
| Nacos Config | `spring-cloud-starter-alibaba-nacos-config` | 动态配置 |
| Sentinel | `spring-cloud-starter-alibaba-sentinel` | 流量治理 |
| Gateway | `spring-cloud-starter-gateway` | API 网关 |
| OpenFeign | `spring-cloud-starter-openfeign` | 声明式 HTTP 调用 |
| Seata | `spring-cloud-starter-alibaba-seata` | 分布式事务 |
| RocketMQ | `spring-cloud-starter-stream-rocketmq` 等 | 消息 |

---

## 1. Nacos — 注册中心

### 解决什么问题？

微服务实例 IP/端口动态变化，调用方不能写死地址；需要 **注册、发现、健康摘除、元数据路由**（版本、权重、集群）。

### 核心概念

| 概念 | 含义 |
|------|------|
| Namespace | 环境隔离（dev/test/prod） |
| Group | 配置或服务分组，默认 `DEFAULT_GROUP` |
| Service | 逻辑服务名，如 `order-service` |
| Instance | 具体实例：ip、port、weight、healthy、metadata |
| 临时实例 | 心跳维持，宕机超时剔除（默认，类似 Eureka） |
| 持久实例 | 运维注册，不随心跳消失（特殊场景） |

### 工作流程

1. 服务启动 → `spring.application.name` 作为服务名 → 向 Nacos Server **注册实例**  
2. 定时 **心跳**（默认约 5s）维持存活  
3. 消费方通过 Discovery Client **订阅/拉取** 实例列表，**本地缓存**  
4. 实例超时未心跳 → 标记不健康并剔除  
5. 调用时 **LoadBalancer** 从列表选实例（可结合权重、集群、metadata 灰度）

### 一致性模式（面试常问）

- Nacos 2.x 集群基于 **Raft/Distro** 等实现数据同步  
- 注册发现场景偏 **AP**（可用优先，短暂不一致可接受）  
- 配置中心可强调 **CP** 能力（配置强一致）  
- 与 Eureka：Eureka 已停更；Nacos **注册+配置一体**、控制台、国内生态更好

### 常用配置

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        namespace: dev
        group: DEFAULT_GROUP
        cluster-name: HZ
        metadata:
          version: v2   # 灰度路由用
```

### 踩坑

- 多网卡注册错 IP → `spring.cloud.nacos.discovery.ip` 指定  
- 本地缓存未刷新仍调已死实例 → 靠心跳摘除 + **调用超时/熔断** 兜底  
- Namespace 不一致导致「找不到服务」

---

## 2. Nacos — 配置中心

### 解决什么问题？

配置与代码分离；多环境统一管理；**运行期改开关、阈值、下游地址** 而不重启。

### 核心概念

| 概念 | 含义 |
|------|------|
| DataId | 配置文件 ID，常 `${spring.application.name}.yaml` |
| Group | 配置分组 |
| Namespace | 环境隔离，与注册可共用 |
| 配置格式 | properties / yaml / json / xml |

### 动态刷新原理

1. 客户端启动 **长轮询** Nacos Server（带本地 md5）  
2. 配置变更 → Server 立即返回新配置  
3. 客户端更新本地缓存 → 触发 **RefreshEvent**  
4. `@RefreshScope` Bean 销毁重建；或 `@NacosConfigListener` 自定义处理  

与 Spring Cloud Config 对比：**无需 Git + Bus**；控制台改配置即生效（配合 Refresh）。

### 常用写法

```yaml
spring:
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
        namespace: dev
        group: DEFAULT_GROUP
        refresh-enabled: true
```

```java
@RefreshScope
@RestController
public class ConfigController {
    @Value("${feature.switch:false}")
    private boolean featureSwitch;
}
```

### 注意

- `@Value` 注入到 **非 RefreshScope 单例** 不会自动更新  
- 数据源、连接池等复杂 Bean 改配置需专门监听重建  
- 敏感配置用 Nacos 加密或外部密钥管理

---

## 3. Spring Cloud Gateway — 网关

### 解决什么问题？

统一入口：**路由、鉴权、限流、灰度、日志、跨域**；隐藏内部服务拓扑。

### 核心模型

- **Route**：id + 断言（Predicates）+ 过滤器（Filters）+ 目标 uri  
- **Predicate**：Path、Host、Header、Method、Cookie 等匹配  
- **Filter**：GlobalFilter / GatewayFilter；改请求头、鉴权、限流、重试  

### 与 Nacos 集成

```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true   # 自动根据服务名路由：/serviceId/**
      routes:
        - id: order-route
          uri: lb://order-service    # 走 LoadBalancer + Nacos 发现
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=1
```

### 与 Sentinel 集成（网关限流）

依赖 `spring-cloud-alibaba-sentinel-gateway`，在 Gateway 层对 **routeId** 或 **API 分组** 做 QPS/线程数限流、熔断；规则可在 **Sentinel Dashboard** 可视化配置，也可持久化到 Nacos。

### 与 Nginx 分工

| | Gateway | Nginx |
|--|---------|-------|
| 层 | 应用层，Java 生态 | 接入层，高性能静态/反向代理 |
| 动态路由 | 对接 Nacos 服务名 | 需额外配置 |
| 常见部署 | Nginx/SLB → Gateway → 微服务 | |

---

## 4. Sentinel — 限流、熔断、降级

### 解决什么问题？

高并发与故障场景下 **防雪崩**：限制流量、快速失败、兜底返回、隔离资源。

### 核心概念

- **资源（Resource）**：被保护的代码块——接口、方法、Feign 调用、Gateway 路由等  
- **规则（Rule）**：流控、熔断、热点、系统、授权  

### 五大规则

| 规则 | 作用 | 典型场景 |
|------|------|----------|
| **流控 Flow** | QPS / 并发线程数上限 | 秒杀、热点接口 |
| **熔断 Degrade** | 慢调用/异常比例/异常数超阈 → 熔断 | 下游故障快速失败 |
| **热点 HotSpot** | 对参数值限流（如商品 id） | 热点商品 |
| **系统 System** | 整机 load、RT、线程数、入口 QPS | 最后一道防线 |
| **授权 Authority** | 黑白名单调用方 | 内部接口隔离 |

### 流控模式与效果

- **直接**：当前资源  
- **关联**：关联资源满则限当前（如写满限读）  
- **链路**：只限从某入口进来的调用  
- **效果**：快速失败、Warm Up（预热）、排队等待（匀速）  

### 熔断策略（Degrade）

1. **慢调用比例**：RT 超阈且比例达线 → 熔断一段时间  
2. **异常比例**：异常占比达线  
3. **异常数**：窗口内异常次数达线  
4. 熔断后 **半开** 探测，成功则恢复  

### 与 Feign / Gateway / Dubbo 集成

```yaml
feign:
  sentinel:
    enabled: true   # Feign 调用纳入 Sentinel，可配 fallback
```

- **@SentinelResource**：方法级资源 + `blockHandler` / `fallback`  
- **OpenFeign fallback**：降级返回默认值或缓存  
- **Gateway**：路由级限流熔断  

### 单机限流原理

```text
请求进入 → SlotChain（责任链）
  NodeSelectorSlot   选上下文 Node
  ClusterBuilderSlot 构建/选择集群 Node
  StatisticSlot      统计 pass/block/RT/异常
  FlowSlot           匹配 FlowRule，超限则 block
  DegradeSlot        熔断规则
  ...
```

**核心数据结构：LeapArray（滑动窗口）**

- 把时间轴切成多个 **bucket**（如 1s 内 2 个 bucket，每个 500ms）。  
- 每个 bucket 存 passQps、blockQps、RT、异常数等；窗口 **向前滑动**，统计近 N 秒。  
- **Node 树**：`EntranceNode → DefaultNode → ClusterNode`，同一资源在不同入口可分开统计（链路限流）。

**QPS 限流判断（直接模式）**

```text
当前窗口 pass + 1 <= threshold → 通过
否则 → 按 controlBehavior 处理（快速失败 / WarmUp / 匀速排队）
```

**并发线程数限流**：用 `CurThreadCounter` 记录当前占用线程，acquire/release，超阈值 block。

### 集群限流原理

**问题**：单机限流 threshold=1000，10 台实例 → 集群实际可过 **10000**，入口总流量仍可能打垮下游。

**Sentinel 集群模式**

| 模式 | 说明 |
|------|------|
| **集群限流（Token Server）** | 指定一台（或独立部署）为 **Token Server**，各 Client 向它 **申请 token**；全局 threshold 在 Server 统一扣减 |
| **Client 模式** | 普通实例，发请求前向 Token Server 拿许可 |
| **Server 模式** | 维护全局计数/令牌，返回是否允许 |

```text
Gateway/Service 实例 A ──┐
Service 实例 B ─────────┼──► Token Server（全局 QPS=5000）
Service 实例 C ─────────┘         │
                                  ▼
                            全集群共享 5000，而非每机 5000
```

- 规则里 `clusterMode=true`，配置 **flowId**、**单机均摊 fallback**（Token Server 不可用时降级为本地限流或失败）。  
- 适用：**网关入口**、**共享稀缺资源**（DB、第三方 API）的全局配额。

### 限流算法：漏桶 vs 令牌桶 vs Sentinel

| 算法 | 机制 | 突发流量 | 典型用途 |
|------|------|----------|----------|
| **固定窗口** | 每窗口计数 | 窗口边界双倍突刺 | 简单计数 |
| **滑动窗口** | 多 bucket 滑动求和 | 较平滑 | **Sentinel 统计底层** |
| **漏桶（Leaky Bucket）** | 请求进桶，**固定速率**出水处理 | **不允许**超过出水速率的突发（排队或丢弃） | 下游处理速率固定、要绝对平滑 |
| **令牌桶（Token Bucket）** | **固定速率**放令牌，有令牌才过 | **允许**一定突发（桶内预存令牌） | 允许短峰、限制长期均值 |

**漏桶 vs 令牌桶（面试必背）**

```text
漏桶：  进水任意 → 出水恒定     「削峰填谷」，突发进来也要排队等匀速出
令牌桶：发令牌恒定 → 有令牌就过  「允许合理突发」，桶满时可瞬间消耗存量令牌
```

| 对比项 | 漏桶 | 令牌桶 |
|--------|------|--------|
| 突发 | 强平滑，突发被排队/拒绝 | 可消化有限突发 |
| 形象 | 漏斗，出水速度固定 | 地铁闸机，有票（令牌）就能进 |
| Gateway Redis | 部分实现偏漏桶思想 | `RequestRateLimiter` 常用令牌桶 |

**Sentinel 流控效果与算法对应**

| controlBehavior | 行为 | 接近 |
|-----------------|------|------|
| **直接拒绝** | 超 QPS 立即 block | 滑动窗口 + 阈值 |
| **Warm Up** | 冷启动 gradually 升到 threshold | 令牌桶预热（冷系统逐步放量） |
| **匀速排队** | 超阈值请求排队，**匀速通过** | **漏桶**（Leaky Bucket / Rate Limiter） |

### 规则持久化

默认规则在内存，重启丢失；生产常 **持久化到 Nacos**，Dashboard 改规则同步到各节点。

### vs Hystrix

| | Hystrix | Sentinel |
|--|---------|----------|
| 维护 | Netflix 停更 | Alibaba 活跃 |
| 隔离 | 线程池/信号量 | 信号量为主，更轻 |
| 限流 | 弱 | 流控/热点/系统规则强 |
| 控制台 | Turbine/Dashboard | Sentinel Dashboard |
| 规则 | 多为代码/配置 | Dashboard + Nacos 动态 |

---

## 5. OpenFeign + LoadBalancer — 服务调用

### 调用链

`@FeignClient("order-service")` → 解析服务名 → **LoadBalancer** 从 Nacos 取实例列表 → 选一个（轮询/随机/权重）→ HTTP 调用。

### 超时与重试（必配）

```yaml
spring:
  cloud:
    openfeign:
      client:
        config:
          default:
            connectTimeout: 3000
            readTimeout: 5000
```

**原则**：网关超时 ≥ Feign 读超时 ≥ 下游业务处理时间；非幂等接口慎用重试。

### 与 Sentinel 结合

开启 `feign.sentinel.enabled=true` 后，Feign 方法可作为 Sentinel 资源限流熔断；`fallback` / `fallbackFactory` 实现降级。

---

## 6. 链路追踪

### 为什么需要？

一次请求经 Gateway → A → B → C，没有 TraceId 无法定位慢在哪、错在哪。

### 常见方案

| 方案 | 说明 |
|------|------|
| **SkyWalking** | Java Agent 无侵入，国内常用；与 Nacos 服务名关联 |
| **Sleuth + Zipkin** | Spring 生态；traceId/spanId 写日志，Zipkin 展示 |
| **Micrometer Tracing** | Spring Boot 3 新链路抽象，可接 Zipkin/OTel |

### 关键概念

- **TraceId**：整条链路唯一 ID  
- **SpanId**：每个调用段  
- 日志 pattern 打印 `%X{traceId}`，便于 ELK 检索  

### 与 SLA / 超时联动

追踪数据看 P99 延迟 → 调整 Feign/网关超时、Sentinel 慢调用熔断阈值。

---

## 7. Seata — 分布式事务（按需）

跨服务强一致成本高，**优先最终一致**（消息、幂等、补偿）；确需时用 Seata。

| 模式 | 说明 |
|------|------|
| **AT** | 自动补偿，基于 undo_log，对业务侵入小，常用 |
| **TCC** | Try/Confirm/Cancel，手写三阶段，性能好、开发重 |
| **Saga** | 长事务，正向+补偿 |
| **XA** | 强一致，性能差，少用 |

角色：TC（事务协调器）、TM（发起方）、RM（资源方）。配置 `seata.registry` / `seata.config` 常用 Nacos。

---

## 8. RocketMQ（异步解耦，按需）

Spring Cloud Stream 或 `spring-cloud-starter-stream-rocketmq` 做事件驱动、削峰、最终一致（配合本地消息表）。

---

## 9. 典型生产组合与面试答法

**推荐栈**：Nacos（注册+配置）+ Gateway（入口）+ OpenFeign + Sentinel（治理）+ SkyWalking（追踪）+ Seata/RocketMQ（按业务）。

**高可用四件套在 Alibaba 栈的落点**：

| 手段 | 落点 |
|------|------|
| 超时 | Feign、Gateway、RestTemplate 分层配置 |
| 限流 | Sentinel Flow + Gateway 限流 |
| 熔断 | Sentinel Degrade |
| 降级 | Feign fallback、@SentinelResource fallback |
| 隔离 | Sentinel 并发线程数、舱壁思路 |
| 注册摘除 | Nacos 心跳 + 调用失败感知 |

**30 秒收口**：  
“我们用 Spring Cloud Alibaba：Nacos 做注册发现和配置动态刷新；Gateway 统一入口并接 Sentinel 做网关限流；服务间 OpenFeign + LoadBalancer 调用，Sentinel 做接口级限流熔断和降级；链路用 SkyWalking；分布式事务能避免就避免，必要时 Seata AT。”

---

## 10. 面试补充专题（SLA / RPC / 感知 / 对比）

> 与前文组件章节衔接；以 **Sentinel + Nacos + OpenFeign** 为准，Hystrix 仅作历史背景。

### 日志与监控看哪些指标？

| 类别 | 指标 | 用途 |
|------|------|------|
| **请求** | RT、P95/P99、QPS、错误率 | 慢接口、容量 |
| **调用链** | TraceId、上下游服务、Feign 耗时 | 定位哪一跳慢/错 |
| **业务** | 订单量、支付成功率 | 与 SLA 对齐 |
| **资源** | CPU、堆、GC、线程池队列、连接池 | 是否逼近瓶颈 |
| **治理** | Sentinel block 数、熔断状态、降级次数 | 限流熔断是否过紧 |
| **安全** | 登录/鉴权失败、异常 IP、敏感操作审计 | 风控 |

日志里务必打 **traceId**；指标用 Prometheus + Grafana，追踪用 SkyWalking，与「只看日志文件」互补。


### SLA 与高可用 / 超时怎么落地？

**SLA** = 对延迟、可用性、错误率的承诺；在微服务里落实为 **可配置 + 可观测 + 可降级**：

| 手段 | Alibaba 栈落点 |
|------|----------------|
| **超时** | Gateway、Feign `connectTimeout` / `readTimeout` 分层；**网关 ≥ Feign ≥ 下游** |
| **限流** | Sentinel Flow（接口/网关）；集群限流 Token Server |
| **熔断** | Sentinel Degrade（慢调用/异常比例/异常数） |
| **降级** | `@SentinelResource` fallback、Feign `fallbackFactory` |
| **负载均衡** | LoadBalancer + Nacos 权重/元数据灰度 |
| **动态调参** | 超时/阈值放 **Nacos 配置** + `@RefreshScope` 或 Sentinel 规则持久化到 Nacos |

老资料写 Hystrix Dashboard 动态改超时；现网等价做法：**Nacos 改 Feign 超时 + Sentinel 规则热更新**，用链路 P99 反推阈值。



### RPC 超时怎么兜底？

| 策略 | 说明 | 注意 |
|------|------|------|
| **超时** | 先设合理 readTimeout，避免线程长期占用 | 分层超时 |
| **有限重试** | 仅 **幂等读**；带退避 | 写操作慎重重试 |
| **降级** | 返回默认值、缓存、静态页 | Feign fallback |
| **熔断** | 连续失败/慢调用 → 快速失败 | Sentinel Degrade |
| **异步化** | 非核心路径 MQ 解耦 | Stream / RocketMQ |
| **缓存** | 读多写少接口短时缓存 | Caffeine/Redis |

**口述**：「超时释放连接；熔断防雪崩；降级保主链路；重试只给幂等读。」


### 动态修改超时时间

1. **配置中心**：Feign 超时、`spring.cloud.gateway.httpclient.response-timeout` 放 Nacos，`@RefreshScope` 或 `@ConfigurationProperties` 刷新。  
2. **Sentinel**：Degrade 的 **maxRt**、Flow 的 **count** 通过 Dashboard → Nacos 数据源推送，**无需重启**。  
3. **网关路由**：Gateway 路由与过滤器配置可 Nacos 动态加载。

不建议运行时改 JVM 内散落常量；统一 **配置外置 + 监听**。


### Sentinel 实现服务高可用（步骤）

1. 引入 `spring-cloud-starter-alibaba-sentinel`，接 Dashboard（可选）。  
2. **定义资源**：Controller 方法、Feign（`feign.sentinel.enabled=true`）、Gateway 路由、Dubbo 接口。  
3. **配规则**：Flow / Degrade / System / HotSpot；生产 **持久化 Nacos**。  
4. **入口集群限流**：网关或核心接口开 **clusterMode**，部署 Token Server。  
5. **降级**：blockHandler / fallback；配合 Nacos 注册摘除与超时。

单机/集群限流与漏桶令牌桶详见 **§4 Sentinel**。

参考：[Sentinel 文档](https://sentinelguard.io/zh-cn/docs/basic-api-resource-rule.html)


### SOA 与微服务区别

| 维度 | SOA | 微服务 |
|------|-----|--------|
| 范围 | 企业级系统整合 | 单应用拆细粒度服务 |
| 粒度 | 较粗，偏 ESB 总线 | 细，单职责有界上下文 |
| 技术栈 | 常统一中间件/ESB | 可异构，轻量 HTTP/gRPC |
| 协议 | SOAP/WS-* 常见 | REST/gRPC 为主 |
| 数据 | 常共享企业服务总线 | 倾向 **每服务独立库** |
| 适用 | 遗留系统集成 | 云原生、独立部署扩缩 |

### Spring Cloud RPC 核心流程（现栈）

```text
1. @FeignClient("order-service") 发起调用
2. LoadBalancer 从 Nacos 拉实例列表（本地缓存 + 订阅推送）
3. 按策略选实例（轮询/随机/权重/metadata）
4. HTTP 请求目标实例
5. Sentinel 统计 RT/异常 → 触发限流/熔断
6. 失败 → 重试（可选）/ fallback / 向上抛错
7. SkyWalking 等携带 TraceId 写日志
```

与老式「Eureka + Ribbon + Hystrix」同构，组件已换 **Nacos + LoadBalancer + Sentinel**。

### 被调用方挂掉，调用方如何感知？

**多通道叠加，不只靠注册中心：**

| 通道 | 机制 |
|------|------|
| **注册中心** | Nacos 心跳超时 → 实例 unhealthy → 剔除；消费者订阅后列表更新 |
| **调用失败** | 连接拒绝、读超时 → 客户端立即感知 |
| **熔断** | Sentinel 统计异常/慢调用 → OPEN → 后续快速失败 |
| **负载均衡** | 剔除仍可能因 **本地缓存延迟** 调到死实例 → 靠超时+熔断兜底 |
| **健康检查** | K8s readiness、Actuator `/actuator/health` 配合摘流 |

**口述**：「注册中心异步摘除 + 调用超时/连接失败同步感知 + Sentinel 熔断防重试风暴。」

### SOFAStack 相对 Dubbo / Spring Cloud（简述）

蚂蚁 **SOFAStack**：偏金融级，**SOFARPC**、**SOFATracer**、**SOFABoot**、与 **Seata** 同源生态；强调模块化、类隔离（Ark）、分布式事务与运维控制台。Dubbo 偏 RPC 框架；Spring Cloud 偏完整微服务套件；SOFA 偏 **企业金融一体化平台**。

### Nacos 动态配置原理（与 §2 互补）

```text
发布：控制台/API 写配置 → Nacos Server 持久化（Derby/MySQL）→ 集群 Raft/Distro 同步
拉取：Client 启动全量拉取 → 本地缓存 + md5
监听：Client 长轮询（带 md5）→ 变更则立即返回新内容
刷新：Spring 发布 RefreshEvent → @RefreshScope 重建 Bean / @NacosConfigListener 回调
```

### @RefreshScope vs @NacosConfigListener

| | @RefreshScope | @NacosConfigListener |
|--|---------------|----------------------|
| 归属 | Spring Cloud 通用 | Nacos 专用 |
| 触发 | `/actuator/refresh` 或 Nacos 触发的 Refresh | Nacos 配置变更 **推送** |
| 行为 | 销毁并重建标注 Bean | 执行监听方法，自定义逻辑 |
| 适用 | 简单 `@Value` 注入字段 | 复杂对象、连接池重建、规则热加载 |

可组合：Nacos 变更 → Refresh → RefreshScope Bean 更新；特殊资源用 Listener 手动处理。

### Nacos 注册中心原理（与 §1 互补）

```text
服务注册：Instance(ip, port, weight, metadata) → Server 内存注册表 + 持久化（可选）
健康：客户端定时心跳；超时 mark unhealthy 并剔除（临时实例）
发现：Subscribe 推送 / 定时拉取；Client 本地 ServiceInfo 缓存
一致性：集群间 Distro（临时实例 AP 同步）/ Raft（持久数据 CP）
```

限流熔断在 **Sentinel**；Nacos 负责 **地址与配置**，不做 RPC 层面的熔断。

---

# Spring Cloud 常用组件面试题

> 覆盖 Netflix 系与 Spring Cloud Alibaba；面试按「干什么 → 原理 → 对比 → 踩坑」答。

## 组件全景（先画一张图）

```text
客户端 → Gateway（路由/鉴权/限流）
           ↓
     负载均衡（Ribbon / LoadBalancer）
           ↓
     服务发现（Eureka / Nacos / Consul）
           ↓
     业务服务 ←→ 配置中心（Config / Nacos）
           ↓
     熔断限流降级（Hystrix / Sentinel / Resilience4j）
           ↓
     链路追踪（Sleuth+Zipkin / SkyWalking）  调用：OpenFeign
```

| 能力 | Netflix / 原生 | Alibaba 常见 |
|------|----------------|--------------|
| 注册发现 | Eureka、Consul | Nacos |
| 配置中心 | Spring Cloud Config | Nacos |
| 网关 | Gateway（Zuul 1 已老） | Gateway + Sentinel |
| 负载均衡 | Ribbon → Spring Cloud LoadBalancer | 同左 + Nacos 权重 |
| 熔断限流 | Hystrix（停更）→ Resilience4j | Sentinel |
| RPC 声明式 | OpenFeign | OpenFeign / Dubbo |
| 分布式事务 | — | Seata |

---

## 注册中心：解决什么问题？原理？

**解决**：服务实例动态增减时，调用方如何找到可用地址（服务发现），并摘除宕机节点。

**通用流程**：

1. 服务启动 → 注册（ip/port/metadata）到注册中心  
2. 定时心跳 / 健康检查维持「存活」  
3. 消费方拉取或订阅服务列表 → 本地缓存  
4. 结合负载均衡选实例发起调用  

### Eureka vs Nacos vs ZooKeeper / Consul

| | Eureka | Nacos | ZK（当注册中心） | Consul |
|--|--------|-------|------------------|--------|
| 定位 | 服务发现 | 发现 + 配置 | CP 协调为主 | 发现 + 健康检查等 |
| 一致性 | AP（自我保护） | CP/AP 可切（命名空间/集群模式相关） | CP | 偏 CP |
| 健康检查 | 客户端心跳 | 心跳 + 可主动探测 | 会话 | 丰富检查 |
| 国内现状 | 少用、Netflix 停更 | 主流之一 | 仍见，偏中间件协调 | 有，不如 Nacos 普及 |

**Nacos 注册原理（口述）**：客户端向 Nacos Server 注册实例；Server 持久化/内存管理实例；消费者订阅或轮询拉取；实例心跳超时被剔除；支持临时实例与持久实例。

**Eureka 自我保护**：短时间大量心跳失败时，保护注册表不大量剔除（宁可保留「可能已死」的实例，避免网络分区误杀）→ 偏 AP。

**调用方如何感知挂掉**：注册中心摘除 + 本地缓存刷新；同时还有超时、重试、熔断。不只靠注册中心。

---

## 配置中心：解决什么问题？怎样动态刷新？

**解决**：配置与代码分离；多环境/多集群统一管理；运行期变更（开关、限流阈值、下游地址等）。

### Spring Cloud Config

- Config Server 拉 Git/SVN/本地仓库配置  
- 客户端启动时拉取；变更常靠 **Spring Cloud Bus**（Kafka/Rabbit）广播 `/actuator/busrefresh`  
- `@RefreshScope`：刷新时销毁并重建 scope 内 Bean  

### Nacos 配置

- DataId / Group / Namespace 隔离  
- 客户端长轮询监听配置变更（推改感）  
- `@NacosConfigListener` 或 `@RefreshScope` + `nacos.config` 刷新  
- 可加密、灰度、历史版本回滚  

**面试对比**：Config 强依赖 Git 与 Bus；Nacos 一体（注册+配置）、控制台友好、国内更常见。

**注意**：不是所有 Bean 改配置都会生效；`@Value` 注入到无 RefreshScope 的单例可能不更新；连接池等需专门处理。

---

## 网关：Gateway 做什么？和 Nginx 区别？

**Spring Cloud Gateway**（WebFlux）：统一入口——路由、鉴权、限流、灰度、日志、协议转换。

核心概念：

- **Route**：断言（Path/Host/Header…）+ 过滤器 + 目标 uri  
- **Predicate**：是否匹配  
- **Filter**：全局/局部；如鉴权、改请求头、限流  

与 Nginx：

| | Gateway | Nginx |
|--|---------|-------|
| 位置 | 应用层，易与注册中心/鉴权集成 | 更偏流量入口、静态、反向代理 |
| 动态路由 | 易对接服务发现 | 需额外模块/配置中心 |
| 语言生态 | Java 过滤器、与 Spring Security 集成方便 | 高性能、运维成熟 |

常一起用：Nginx/SLB → Gateway → 微服务。

---

## 负载均衡：Ribbon 与 LoadBalancer、常见策略

老项目：**Ribbon**（停更）；新项目：**Spring Cloud LoadBalancer**。

常见策略：轮询、随机、加权、最少并发（视实现）、重试。

与注册中心关系：从服务列表选实例；可结合 Nacos 权重、集群就近路由。

**Feign / RestTemplate / WebClient** 通过 `@LoadBalanced` 或 Feign 集成实现「服务名」调用，而不是写死 IP。

---

## OpenFeign 调用链路（口述）

1. 接口 + `@FeignClient(name="user-service")`  
2. 启动时生成代理  
3. 解析服务名 → LoadBalancer 选实例  
4. HTTP 发请求（可配超时、日志、编码器）  
5. 失败：重试（慎用非幂等）、解码异常、走降级（Sentinel/Resilience4j）

超时要分层：连接超时、读超时；网关超时 ≥ Feign 超时 ≥ 下游处理时间，避免误杀。

---

## 限流 / 熔断 / 降级 / 隔离（高可用四件套）

| 手段 | 目的 | 典型实现 |
|------|------|----------|
| 限流 | 保护系统不被打满 | Sentinel QPS/线程数、Gateway RequestRateLimiter、Nginx |
| 熔断 | 故障快速失败，防雪崩 | Sentinel、Resilience4j；Hystrix 已停更 |
| 降级 | 兜底返回，保主链路 | fallback 方法、默认值、缓存 |
| 隔离 | 故障隔离资源 | 线程池隔离 / 信号量；舱壁 |

### Sentinel 常问

- **资源**：接口、方法、或自定义 resource name  
- **规则**：流量控制、熔断降级、热点参数、系统规则、授权规则  
- **流控模式**：直接、关联、链路  
- **流控效果**：快速失败、Warm Up、排队等待  
- **熔断策略**：慢调用比例、异常比例、异常数；半开探测恢复  
- **单机限流**：LeapArray 滑动窗口 + SlotChain；Entrance/Default/Cluster Node  
- **集群限流**：Token Server 统一发 token，全集群共享 threshold  
- 与 Gateway、Feign、Dubbo 有适配器  

### 限流算法（漏桶 / 令牌桶 / Sentinel）

| 算法 | 特点 | 突发 |
|------|------|------|
| 固定窗口 | 实现简单 | 窗口边界突刺 |
| 滑动窗口 | 多 bucket 平滑 | 较平滑；**Sentinel 统计底层** |
| **漏桶** | 进水任意、**出水恒定**；可排队 | **不允许**超出水速率的突发 |
| **令牌桶** | **恒定放令牌**；有令牌才过 | **允许**桶内存量带来的突发 |

**对比**：漏桶「削峰填谷、绝对平滑」；令牌桶「限制长期均值、允许合理短峰」。  
Sentinel **匀速排队 ≈ 漏桶**；**Warm Up ≈ 令牌桶预热**；Gateway Redis 限流常用 **令牌桶**。

### Hystrix → Sentinel / Resilience4j

Hystrix 停更；Spring Cloud 推荐 **Resilience4j** 或 Alibaba **Sentinel**。面试说明项目选型与迁移点即可。

---

## 链路追踪与监控

- **Sleuth + Zipkin / Brave**：traceId / spanId 贯穿日志  
- **Micrometer + Prometheus + Grafana**：QPS、延迟、错误率  
- **Spring Boot Admin**：实例健康  
- Alibaba：**Sentinel Dashboard**、Nacos 控制台；也可 SkyWalking  

没有追踪时排障难：一次请求跨多少服务、慢在哪一跳。

---

## 分布式事务（常挂在 Spring Cloud 体系下问）

微服务避免强事务；需要时：

- **Seata**：AT / TCC / Saga / XA  
- 可靠消息、本地消息表、Outbox  
- 尽量 **最终一致**，幂等 + 补偿  

详见同目录 `分布式事务.md`。

---

## 服务雪崩怎么形成？怎么防？

形成：下游慢/挂 → 上游线程打满 → 层层拖垮。

防护组合：超时、限流、熔断、降级、隔离、舱壁、缓存、异步化、合理重试（指数退避 + 幂等）、隔离线程池。

---

## 灰度发布 / 金丝雀怎么做？

- Gateway 按 header/userId 路由到新版本实例  
- Nacos/注册中心 metadata 打版本标签，LoadBalancer 过滤  
- 配置中心开关控制新逻辑  

---

## 面试速记

| 组件 | 一句话 |
|------|--------|
| 注册中心 | 实例注册、心跳、发现、摘除 |
| 配置中心 | 配置外置、动态推送/刷新 |
| Gateway | 统一入口：路由、鉴权、限流 |
| LoadBalancer | 从服务列表选实例 |
| OpenFeign | 声明式 HTTP 客户端 |
| Sentinel | 限流熔断降级；单机 LeapArray + 集群 Token Server |
| Seata | 分布式事务（慎用，优先业务方案） |
| 追踪 | Trace 把调用链串起来 |

**选型口述**：国内常见 **Nacos + Gateway + OpenFeign + Sentinel + Seata(按需)**；老项目可能仍见 Eureka/Ribbon/Hystrix，需说明迁移点。
