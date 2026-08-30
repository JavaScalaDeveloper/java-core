# ElasticSearch 面试笔记

分布式 **搜索 + 分析** 引擎，倒排索引，近实时（NRT）。口述：查询 → 分片 → 写入 → HA → Mapping → 分词 → 水平扩容。

---

## 常用查询方式

| 查询 | 作用 | 注意 |
|------|------|------|
| **Match** | 全文检索，先分词再匹配 | 走 analyzer |
| **Term** | **精确**匹配，不分词 | keyword / 精确值；别对 text 乱用 |
| **Range** | 数值/日期范围 | `gt/gte/lt/lte` |
| **Bool** | 组合：`must` / `should` / `must_not` / `filter` | filter 不打分、可缓存 |
| **Wildcard / Prefix** | 通配、前缀 | 前导 `*` 很慢 |
| **Fuzzy** | 模糊（编辑距离） | 代价高，慎用 |
| **Aggregation** | 聚合统计 | bucket / metric / pipeline |

**口述：** 全文用 Match；精确过滤用 Term + filter；复杂条件用 Bool。

---

## 能存多大？怎么存海量？

**没有固定「最大条数」上限**，容量看 **节点磁盘 × 分片规划 × 硬件**。上亿～百亿文档常见，靠分布式扩展，不是单机堆。

| 手段 | 说明 |
|------|------|
| **主分片** | 数据切开并行读写 |
| **副本** | 冗余 + 读扩展 |
| **多节点** | 分片分布到多机，自动均衡 |
| **压缩 / 冷热** | 压缩编解码；热温冷架构降成本 |

**不要答「无限」：** 单分片过大、分片过多、堆内存不够都会先顶不住。

---

## 分片存储原理

```text
Index
  ├─ Primary Shard 0..N-1   （创建时定死个数）
  └─ 每个 Primary 可有 R 个 Replica
文档路由：shard = hash(routing) % num_primary_shards
```

| 类型 | 作用 |
|------|------|
| **Primary** | 写入口；文档先写主分片再同步副本 |
| **Replica** | 读扩展、故障切换；**个数可动态改** |

- 主分片数 **创建后原则上不能改**（要改 → reindex）。  
- 单分片建议控制在 **十几～几十 GB**；过多小分片浪费 heap、拖慢集群状态。

---

## 写入吞吐与「会不会限流」

**没有统一「每秒 X 条就不会挂」的官方数。** 取决于：节点规格、分片数、文档大小、mapping、refresh、磁盘、副本数。

| 实践 | 说明 |
|------|------|
| **Bulk API** | 批量写入，降网络往返 |
| 合理 refresh | `refresh_interval` 调大可提吞吐（牺牲近实时可见） |
| 副本写入期 | 建索引时可先 0 副本，灌完再加 |
| 压测 | 用真实文档大小压；看拒绝、队列、GC、磁盘 IO |

写太猛会出现：队列堆积、`es_rejected_execution`、节点 load 打满——要 **扩节点 / 加主分片（新索引）/ 降刷新 / 限流客户端**，不是调一个魔法阈值。

---

## 与 HBase 如何保持一致？

两者模型不同：**HBase 行存 OLTP 向，ES 倒排搜索向**。通常 **HBase（或 DB）为权威源，ES 为索引副本**，追求 **最终一致**，而非跨系统强事务。

| 环节 | 做法 |
|------|------|
| 同步 | Canal/Flink CDC、Logstash、自研双写（双写难保证） |
| 更新 | 变更流驱动 ES upsert/delete；幂等 + 版本字段 |
| 查询 | 搜走 ES，明细可回源 HBase；避免强依赖双查合并 |
| 对账 | 定时抽检、按业务键比对条数/版本 |
| 故障 | ES 可重建索引；以源系统为准回灌 |

**口述：** 权威在源库；ES 异步同步 + 对账；接受秒～分钟级延迟。

---

## 高可用怎么做？

| 手段 | 要点 |
|------|------|
| **多节点集群** | 至少 3 master 候选防脑裂（`minimum_master_nodes` 旧版；现用投票配置） |
| **副本 ≥ 1** | 节点挂了还有副本可提升 |
| **角色分离** | Master / Data / 协调节点按规模拆分 |
| **跨机架/可用区** | 分片分配感知，避免副本同挂 |
| **备份** | Snapshot 到共享存储（HDFS/S3/OSS） |
| **接入层** | 多节点 VIP / SLB，客户端 sniff |

---

## 监控告警指标

| 类别 | 指标 |
|------|------|
| 集群 | **status** green/yellow/red；未分配分片 |
| 节点 | CPU、heap、disk、load |
| 分片 | relocation、recovery、超大分片 |
| 写入 | indexing rate、reject、bulk 队列 |
| 查询 | 延迟 P99、慢查询 |
| JVM | GC 次数/耗时、old gen |
| 其他 | 线程池拒绝、circuit breaker |

**yellow** = 主分片齐、副本未齐；**red** = 有主分片丢失，需优先处理。

---

## 常用数据类型（Mapping）

| 类型 | 场景 |
|------|------|
| **text** | 全文检索；会分词 |
| **keyword** | 精确过滤、聚合、排序；不分词 |
| **数值** | long/integer/double…；范围、度量聚合 |
| **date** | 时间范围、直方图 |
| **boolean / ip** | 开关、IP 过滤 |
| **geo_point / geo_shape** | 距离、地图检索 |
| **object / nested** | 对象；嵌套数组用 nested 防扁平误匹配 |
| **dense_vector** | 向量检索（版本相关） |

**经典坑：** 要聚合的字段用 **keyword**（或 text + keyword 多字段），别只建 text。

---

## 节点挂了以后数据怎么办？

有副本时：

```text
1. 集群变 yellow/red，Master 把丢失的主分片在副本上 promote
2. 在其他节点上重建缺失副本（recovery）
3. 换新节点加入 → rebalance 迁部分分片过来
```

**一般不需要手抄数据目录**（除非单节点无副本灾难恢复）。  
单节点挂掉且无备份 → 只能从 Snapshot / 源系统重建。

---

## 分词器（Analyzer）

分析链：**Character Filter → Tokenizer → Token Filter**。

| 分词器 | 特点 |
|--------|------|
| **standard** | 默认；按词切、小写等 |
| **whitespace** | 只按空白切 |
| **simple** | 非字母切分 + 小写 |
| **keyword** | **整段一个 token**（不分词） |
| **pattern** | 正则切分 |
| **语言相关** | english 等；中文常用 **IK**、smartcn 等插件 |

自定义 analyzer 在 index settings 里组合 char_filter / tokenizer / filter。  
**索引分词与查询分词要一致**，否则搜不准。

---

## 水平扩容（面试专题）

ES 水平扩展靠 **加节点 + 分片 rebalance**；**主分片数创建索引时确定，原则上不能改**（只能 reindex 到新索引）。

### 核心概念

| 概念 | 扩容角色 |
|------|----------|
| **Primary Shard** | 并行读写的基本单位；**个数固定** |
| **Replica** | 副本可 **动态增加** → 读扩展 + HA |
| **Node** | 承载分片；加节点 → 集群可装更多分片副本 |

```text
索引 12 主分片 × 1 副本 = 24 个分片副本
加 Data 节点 → 集群把分片迁到新节点（recovery / rebalance）
```

### 怎么扩？

| 目标 | 做法 |
|------|------|
| **扩读 / 高可用** | `number_of_replicas++`（无需改主分片数） |
| **扩总容量与写吞吐** | **新建索引** 更多主分片 + reindex/别名切换 |
| **加机器** | 新节点加入集群，等分片自动均衡 |

### 为什么不能随意加主分片？

- 文档 → 分片路由：`shard = hash(routing) % num_primary_shards`。  
- 改主分片数 → 路由规则全变 → 必须 **reindex**。  
- 规划：单分片建议 **十几～几十 GB**；过多小分片浪费 heap。

### 扩容时注意

- **Rebalance** 占磁盘与网络；高峰期限流迁移。  
- **分片倾斜**：routing/key 不均 → 某分片过大。  
- **主节点 / 协调节点**：数据节点多了，必要时 **专用 master、协调分离**。  
- **写入**：Bulk + 适当 refresh；加节点不能替代坏 mapping。

### 面试对比

| | ES | Kafka |
|--|-----|-------|
| 扩并行写 | 新索引加主分片 + 迁移 | `add partitions`（下游消费要感知） |
| 扩读 | 加 replica | 加 consumer（≤ 分区） |
| 自动均衡 | 集群 rebalance | 分区 reassignment |

**30 秒收口：** ES 水平扩 = 加 Data 节点 + 分片迁移；读和 HA 靠 **加副本**；要写吞吐上去得 **规划足够主分片**（通常新索引 reindex），不能在线改主分片数。

---

## 面试速记

| 主题 | 一句话 |
|------|--------|
| 查询 | Match 全文；Term 精确；Bool 组合；聚合 Aggregation |
| 分片 | 主分片定并行；副本定 HA/读；路由 hash%N |
| 写入 | Bulk；无固定「安全 QPS」；压测+监控 reject |
| 一致 | 源系统权威；ES 异步索引 + 对账 |
| HA | 多节点 + 副本 + Snapshot + 监控 green/yellow/red |
| Mapping | text 搜、keyword 聚；中文 IK |
| 扩容 | 加节点；加副本易；加主分片要 reindex |
