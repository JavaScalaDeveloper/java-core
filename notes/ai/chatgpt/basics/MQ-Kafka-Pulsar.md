# Kafka

## Kafka 架构一句话

Topic 按 Partition 并行，Partition 内有序；Producer 写 Leader，Follower 同步；Consumer Group 内同一 Partition 同一时刻只被一个消费者消费，靠 Offset 记进度。

| 概念 | 作用 |
|------|------|
| Topic | 逻辑主题 |
| Partition | 物理并行单元，决定吞吐与局部顺序 |
| Offset | 消费进度指针 |
| Replica / ISR | 副本冗余；ISR 为与 Leader 同步的副本集 |
| Consumer Group | 水平扩展消费 |
| Coordinator | 管理组成员、分区分配、Rebalance |

---

## 消息顺序如何保证？

- **分区内有序**：同一 Partition 追加写入，单线程消费该分区即可保序。
- **跨分区无序**：多 Partition 之间没有全局顺序。
- **局部有序做法**：业务键（如 `orderId`）作为 Key，哈希到同一分区；该 Key 下消息有序。
- **全局有序**：只能 **单分区**（吞吐差），一般不推荐。
- **消费侧破坏顺序**：同分区若多线程并发处理，仍会乱序 → 要么单线程处理，要么按 Key 再哈希到有序工作队列。

面试答法：Kafka **不保证全局有序，保证分区内有序**；业务用 Key 路由做局部有序。

---

## 事务消息 / Exactly-Once 怎么做？

Kafka「事务」主要指 **Producer 事务**（幂等 + 事务 ID）：

- **幂等生产者**（`enable.idempotence=true`）：同一 Producer 对同一分区去重，防网络重试导致重复写。
- **事务生产者**：跨多分区、多 Topic 原子写入；配合 `read_committed` 消费，读不到未提交消息。
- 常见场景：consume-transform-produce（读 Topic A、写 Topic B）纳入同一事务，做到链路内 EOS。

注意：

- 保证的是 **Kafka 内部** 精确一次叙事，**不等于**「写 MySQL + 发 Kafka」自动 Exactly-Once。
- 跨 DB：本地消息表、Outbox、或业务幂等；不要以为开了事务 Producer 库表就不会重复。

投递语义对比：

| 语义 | 含义 | 典型做法 |
|------|------|----------|
| At-Most-Once | 最多一次，可能丢 | 先提交 Offset 再处理；acks 过弱 |
| At-Least-Once | 至少一次，可能重复 | 先处理再提交；生产重试 |
| Exactly-Once | 精确一次 | 幂等/事务 + 输出也纳入事务，或业务幂等 |

---

## Kafka 怎么保证幂等性？

面试要先分清：**Kafka 自带的幂等** 和 **业务幂等** 不是一回事，分别解决生产重复写和消费重复读。

### 三层幂等，各管一段

| 层级 | 手段 | 解决什么问题 | 管不管消费重复 |
|------|------|--------------|----------------|
| 生产端幂等 | `enable.idempotence=true` | 同一 Producer 重试导致分区里 **重复消息** | 否 |
| 事务 | `transactional.id` + 事务 Producer | 跨分区/Topic **原子写** + 与消费位点联动（EOS 链路） | 部分场景 |
| 消费端幂等 | 业务唯一键、去重表、状态机 | Rebalance、重复投递、先处理后提交 | 是（必做） |

**结论：** 生产开幂等 ≠ 消费不重复；**至少一次消费下，业务幂等仍然必须**。

### 生产端幂等：原理（`enable.idempotence=true`）

开启后，Broker 会对 **同一个 Producer 实例、同一个分区** 上的重复批次去重。

**核心机制：**

1. **PID（Producer ID）**：Producer 初始化时向 Broker 申请，标识一个生产者实例（进程级，有生命周期）。  
2. **Sequence Number**：对每个 `(PID, Partition)` 维护单调递增序号；每条消息批次带序号发送。  
3. **Broker 去重**：若收到 **相同 PID + 分区 + 序号 ≤ 已写入的最大序号** 的重复批次（典型是 `retries` 重试、网络超时后重发），Broker **丢弃重复**，只保留一份。

```text
Producer(PID=1005) → Partition-0: seq=1,2,3...
网络超时重发 seq=3 → Broker 发现 3 已写过 → 丢弃，仍返回成功
```

**能防：**

- 发送超时后客户端重试造成的 **重复写入同一分区**  
- 与 `acks=all`、适当 `retries` 配合，生产侧「至少一次发送」在 Broker 侧收成 **单条落盘**

**不能防：**

| 场景 | 原因 |
|------|------|
| 应用主动发两次 | 两次独立发送，序号不同，不是重试 |
| Producer 重启后新 PID | 新实例无旧序号，可能再写一条 |
| 跨分区 | 幂等按 **分区维度** 去重，不保证跨分区全局唯一 |
| 消费重复 | 与消费者 Offset、Rebalance 无关 |
| 写 MySQL + 发 Kafka | 跨系统，要靠 Outbox/本地消息表/业务幂等 |

**常用配置（开启幂等后多项会自动收紧）：**

```properties
enable.idempotence=true
# 通常自动：acks=all, retries>0, max.in.flight.requests.per.connection<=5
```

`max.in.flight.requests.per.connection` 过大且未开幂等时，重试可能导致 **乱序**；开幂等后 Broker 按序号保证分区内顺序。

### 事务与 Exactly-Once（生产幂等的延伸）

- **事务 Producer**：在幂等基础上加 `transactional.id`，支持 `beginTransaction` / `commitTransaction`。  
- **跨分区原子写**：一次事务里写多个分区，要么都可见（`read_committed`），要么都不可见。  
- **consume-transform-produce**：读 A、写 B 时，把 **消费 Offset 提交** 和 **生产写入** 放进同一事务，实现 Kafka 链路内 EOS。  

仍 **不自动** 保证「消费一次 + 写库一次」；库侧还要唯一约束或幂等更新。

### 消费端幂等：Kafka 不提供，必须业务做

消费侧默认 **至少一次**（见下文 Rebalance、未提交 Offset）。常见做法：

**1. 数据库唯一键 / 去重表**

```sql
-- 消息表或业务表带 message_id 唯一索引
INSERT INTO order_done (msg_id, ...) VALUES (?, ...)
ON DUPLICATE KEY UPDATE ...;  -- 或捕获唯一键冲突当已处理
```

**2. Redis 去重**

`SET msg_id 1 NX EX 86400`，已存在则跳过（注意过期与持久化策略）。

**3. 状态机**

`CREATED → PAID → SHIPPED`，仅允许合法跃迁；重复消息落在同一状态无副作用。

**4. 业务天然幂等**

`UPDATE account SET balance = balance - 100 WHERE id = 1 AND version = ?`（乐观锁）；或「设置最终状态」型操作。

**5. 消费位点与业务同一事务（强一致场景）**

本地 DB 事务里：写业务表 + 写「已消费 msg_id」表，再提交 Kafka Offset（或事务性消费）；失败则回滚，消息会再投。

### 生产幂等 vs 消费幂等（对口面试）

| 问题 | 答法 |
|------|------|
| Kafka 怎么保证幂等？ | 生产端 `enable.idempotence` 用 PID+序号在 Broker 去重；消费端无内置幂等，靠业务 |
| 开了生产幂等还会重复消费吗？ | **会**，Rebalance、提交失败、崩溃重投都会重复 |
| 和事务消息区别？ | 幂等防 **重试重复写**；事务防 **多分区原子写** + 可与消费位点绑定做 EOS |
| 和 RocketMQ 事务消息？ | RMQ 半消息解决 **本地事务与发消息**；Kafka 事务偏 **Topic 间原子写与 EOS 链路** |

**30 秒收口：**  
生产幂等 = Broker 对 `(PID, 分区, 序号)` 去重，防发送重试重复；消费幂等 = 唯一键/状态机/去重表，防至少一次下的重复处理；跨库还要 Outbox 或分布式事务方案。

---

## 延迟消息怎么做？

Kafka **原生没有** RocketMQ 那种多级延迟队列。常见方案：

1. **时间轮 / 应用层延时**：业务自己存延迟任务，到点再发 Kafka。
2. **多级 Topic**：`delay-5s`、`delay-1m` 等，消费者到点转发到业务 Topic（运维成本高）。
3. **Kafka + 外部调度**：DB/Redis 延迟队列、时间轮中间件。
4. **上层框架**：部分云产品或周边组件封装延迟投递。

若强依赖延迟/定时消息，选型上更常看 RocketMQ / Pulsar / RabbitMQ。

---

## Consumer Group 与 Rebalance

**模型**：组内消费者共同消费订阅 Topic；**一个 Partition 同一时刻只分配给组内一个消费者**。

**Rebalance 触发**：

- 组成员加减（扩缩容、宕机、重启）
- 订阅 Topic / 分区数变化
- 会话超时（`session.timeout.ms`）、处理超时（`max.poll.interval.ms`）导致被踢出

**影响**：Rebalance 期间分区回收，消费暂停；易出现重复消费（已处理未提交 Offset）或短暂积压。

**优化：**

- 合理 `max.poll.interval.ms` / `session.timeout.ms` / `heartbeat.interval.ms`
- 控制 `max.poll.records`，避免单次处理过久
- **静态成员**（`group.instance.id`）减少无谓 Rebalance
- **协作式再均衡**（Cooperative Sticky）降低 Stop-The-World 停顿
- 消费逻辑幂等，扛住 Rebalance 带来的重复

---

## 消息没 ACK（未提交 Offset）且处理超时后，怎样 Rebalance、又怎样被重复消费？

这里的「ACK」在 Kafka 消费侧通常指 **提交 Offset**（不是生产者的 `acks`）。流程可以串成一条因果链：

### 1. 正常路径

`poll` 拉到一批消息 → 业务处理 → **提交 Offset** → 组协调器/Broker 记下「该分区已消费到此处」。

### 2. 处理太慢、迟迟不提交会发生什么？

消费者在两次 `poll` 之间如果卡太久（业务阻塞、下游超时、本地线程池打满），会踩到两类超时：

| 参数 | 作用 | 超时后果 |
|------|------|----------|
| `max.poll.interval.ms` | 两次 poll 允许的最大间隔 | 被认为消费能力不足，**踢出组** → 触发 Rebalance |
| `session.timeout.ms` | 心跳会话超时（配合 `heartbeat.interval.ms`） | 心跳跟不上 → **踢出组** → Rebalance |

常见坑：主线程在处理大消息，超过 `max.poll.interval.ms` 还没再次 `poll`，即使心跳线程还在跳，仍可能被踢（取决于客户端版本与配置，面试抓住「处理过久会丢成员资格」即可）。

### 3. Rebalance 之后进度从哪续？

- 被踢出的消费者：**未成功提交的 Offset 不算数**。  
- 分区被重新分配给组内其他（或重新加入后的）实例。  
- 新主人从 **上次成功提交的 Offset** 继续拉。  
- 于是：上一轮已经处理过、但 **还没 commit** 的那一段消息，会被 **再拉一遍** → **重复消费**。

```
已提交 Offset = 100
poll 到 101～120，正在处理，尚未 commit
处理过久 → 被踢出 → Rebalance
新消费者从 100 之后再读 → 101～120 再次投递
```

### 4. 和「自动提交」叠加时更危险

- 自动提交可能在「还没处理完」时就推进 Offset → **假丢**（消息没处理却当作消费过）。  
- 手动提交但提交太晚 + Rebalance → **重复**。  
- 推荐：**处理成功后再手动提交**；批处理接受批内重复，用幂等消化。

### 5. 怎么避免「慢处理 → 踢出 → 重复」放大？

- 减小 `max.poll.records`，单次少拉，尽快再次 poll。  
- 调大 `max.poll.interval.ms`（治标，别无限加大掩盖慢 SQL）。  
- 重活异步化：poll 线程只投递本地队列，另队处理（注意顺序与提交位点设计）。  
- 静态成员降低无谓 Rebalance；业务 **幂等** 兜底重复。

**一句话**：没 ACK（未提交）的消息在 Rebalance 后会按旧 Offset **重新投递**；处理延迟越容易触发踢出，重复窗口越大。

---

## 消息积压（Lag）怎么处理？

1. **确认现象**：看各分区 `Lag = LogEndOffset - ConsumerOffset`，区分生产突增还是消费变慢。
2. **消费侧排查**：GC、慢 SQL、下游超时、线程池打满、反序列化过重、同步调远程。
3. **扩容**：增加消费者实例（有效上限 ≈ 分区数）；长期不够再 **加分区**（注意 Key 哈希映射变化）。
4. **降载**：限流生产、丢弃/降级非关键消息、批量写下游。
5. **应急**：临时跳过坏消息（死信/隔离 Topic）；慎用重置 Offset（会丢或重复）。
6. **架构**：热点分区打散 Key；重活异步化；预聚合减少单条处理成本。

---

## 怎样避免重复消费 / 消息丢失？

**重复（至少一次常态）：**

- **原因**：Offset 提交失败、Rebalance、消费成功但提交前崩溃、自动提交时机不对 → 同一条消息再次投递。  
- **Kafka 生产幂等管不到这里**（`enable.idempotence` 只防 Producer 重试重复 **写入**，不防消费侧重复 **读取**）。  
- **处理：业务幂等（必做）**  
  - 唯一键 / 去重表（`msg_id`）  
  - Redis `SETNX` 短期去重  
  - 状态机（仅允许合法状态跃迁）  
  - 乐观锁、`INSERT ... ON DUPLICATE KEY`  
- **配合**：处理成功后再手动提交 Offset；接受批内重复，用幂等消化（详见上文「Kafka 怎么保证幂等性」）。

**丢失：**

- 生产：`acks=all` + `min.insync.replicas` + 幂等；需要时用事务
- 消费：**先处理成功再提交 Offset**（先提交后处理 = 假丢）
- Broker：多副本、关闭 unclean leader election（高可靠场景）

---

## ACK、ISR、HW、LEO（高频）

| acks | 含义 |
|------|------|
| 0 | 发出即不管，可能丢 |
| 1 | Leader 写入成功即确认 |
| all/-1 | ISR 满足同步要求后确认，最稳 |

- **LEO**：副本日志末端位移  
- **HW**：对消费者可见的最高位移  
- **ISR**：跟上 Leader 的副本集；Leader 挂了优先从 ISR 选主  

---

## Kafka 为什么快？

顺序追加写磁盘 + Page Cache + 零拷贝（sendfile）+ 批量/压缩 + 分区并行。

---

## Kafka 零拷贝原理？

传统「读磁盘文件再发给 Socket」通常要多次拷贝与上下文切换：

1. 磁盘 → 内核 Page Cache（DMA）  
2. Page Cache → 用户态缓冲区（read，CPU 拷贝）  
3. 用户态 → Socket 缓冲区（write，CPU 拷贝）  
4. Socket 缓冲区 → 网卡（DMA）  

Kafka Broker 把分区日志以 **顺序文件** 形式放在磁盘上，热点又大量命中 **Page Cache**。对消费者拉取时，用 Linux **`sendfile`**（或类似 `transferTo`）做 **零拷贝**：

- 数据在内核态从 **文件 Page Cache** 直接转到 **Socket 相关缓冲区/网卡描述**，**绕过用户态应用缓冲区**。  
- 少了 2 次用户态 CPU 拷贝和对应的切换，吞吐更高、CPU 更省。  

前提与边界：

- 适合「磁盘（或 Page Cache）里已有的连续日志 → 网络发出」这条路径。  
- 若 Broker 侧要 **解压/转换/过滤后再发**，往往走不了完整零拷贝，仍可能回用户态处理。  
- 「零拷贝」指少拷到用户态，并非完全没有内核内拷贝；面试说到 **sendfile + PageCache + 顺序读** 即可。

和「快」的关系：零拷贝是消费拉取加速手段之一，还需配合顺序写、批量、压缩、分区并行一起答。

---

## 分区数量怎么定？

越多吞吐上限越高，但元数据、文件句柄、Rebalance 成本上升；**消费者数 > 分区数** 时多余实例空闲。按峰值吞吐、消费者并行度、单分区流速综合估，并预留余量。

---

## 日志清理：delete vs compact

- **delete**：按时间/大小删旧段（日志类）  
- **compact**：按 Key 保留最新值（changelog / 状态类）  

---

## ZooKeeper vs KRaft

老集群元数据靠 ZK；新版本走向 **KRaft**（内建 Raft），运维更统一。

---

## Kafka 面试速答：丢、重、乱、积压、延迟、事务

- **丢**：acks 弱；先提交后处理；unclean 选举  
- **重**：至少一次 + Rebalance → **幂等**  
- **乱**：跨分区无序；同分区多线程乱序  
- **积压**：先查 Lag，再优化消费/加实例/加分区  
- **延迟**：原生弱，靠应用或多级 Topic  
- **事务**：幂等+事务 Producer 保 Kafka 内 EOS，跨 DB 另案  
- **幂等**：生产 `enable.idempotence`（PID+序号 Broker 去重）；消费靠业务唯一键/状态机  
- **零拷贝**：sendfile，PageCache → Socket，少经用户态  
- **未提交就 Rebalance**：从旧 Offset 重读 → 重复消费  

---

# Pulsar

## Pulsar 架构：为什么说计算存储分离？

- **Broker**：协议接入、订阅、分发 —— 更偏无状态服务层  
- **BookKeeper Bookie**：消息持久化（Ledger）—— 存储层  
- **ZooKeeper / 元数据存储**：协调与元数据  

对比 Kafka「Broker 本地存日志」：Pulsar 扩 Broker、故障转移更轻；存盘扩容扩 Bookie。

| 概念 | 含义 |
|------|------|
| Tenant / Namespace | 多租户与策略单元 |
| Topic / Partitioned Topic | 消息通道与并行 |
| Subscription | 订阅是一等公民；Cursor 在服务端 |

---

## 消息顺序如何保证？

- **单分区 Topic**：分区内有序。  
- **Key_Shared 订阅**：同 Key 路由到同一消费者，**Key 级有序**且可并行。  
- **Shared 订阅**：消息级竞争，**不保证顺序**。  
- Exclusive / Failover：单活跃消费者，顺序取决于 Topic 分区模型。

---

## 事务消息？

- Pulsar 支持 **事务**（Transaction）：可把多个发送、Ack 纳入事务，用于流处理式 EOS 场景（版本与开启配置需确认）。  
- 与 Kafka 类似：主要强化 **消息系统内** 原子性；跨 DB 仍要 Outbox / 幂等。  
- 若面试对比「业务事务消息半消息」，RocketMQ 的事务消息模型往往更常被问到。

---

## 延迟消息、重试、死信

- 支持 **延迟 / 定时投递**（DeliverAfter / 延迟消息能力，按客户端与版本）。  
- **Nack** 或超时未 Ack → 重投，可配置延迟重试。  
- 超过最大重试进入 **死信 Topic（DLQ）**。  

对比 Kafka：延迟/重试/DLQ 更「产品化」；Kafka 多靠应用层。

---

## 订阅与“Rebalance”怎么理解？

Pulsar 不以 Kafka Consumer Group Rebalance 为中心，而是 **Subscription + 订阅模式**：

| 模式 | 特点 |
|------|------|
| Exclusive | 一订阅一消费者 |
| Failover | 主备切换 |
| Shared | 同订阅多消费者消息级竞争（队列语义） |
| Key_Shared | 同 Key 同消费者，局部有序 + 并行 |

消费者上下线时，Broker 重新分配消费许可/哈希范围，会有短暂影响；Cursor 在服务端，进度不绑死在某个客户端进程。

---

## Pulsar：消息没 Ack 且消费延迟后，会怎样重投 /「再均衡」？

Pulsar 的进度权威在 **服务端 Cursor**，确认靠 **Ack**（单个或累积）。

### 未 Ack + 处理慢

1. Broker 把消息发给消费者，记入该消费者的 **inflight / unacked** 集合。  
2. 若迟迟不 Ack：  
   - 可能触发 **Ack 超时** → Broker **重新投递**（Redelivery），可带延迟；或  
   - 消费者 **Nack** → 按策略重投。  
3. 超过最大重投次数 → 进 **重试 Topic / DLQ**（视配置）。

### 消费者挂了或离开订阅（类似 Rebalance）

- Shared / Key_Shared 下实例减少时，未 Ack 消息会 **释放回订阅**，由仍在线的消费者再次领取。  
- Cursor **不会**因为「曾经发给已挂掉的实例」就前进；只有 Ack 才推进（或按确认模式累积前进）。  
- 因此：**处理中未 Ack 的消息一定会被别人或自己再次消费** → 必须幂等。

### 和 Kafka 对比记

| | Kafka | Pulsar |
|--|-------|--------|
| 进度 | 客户端提交 Offset | 服务端 Cursor + Ack |
| 慢处理典型后果 | 超过 poll/会话超时被踢出组 → Rebalance → 从旧 Offset 重读 | Ack 超时 / 消费者离开 → 未确认消息重投 |
| 重复原因 | 已处理未 commit | 已处理未 Ack |

---

## Pulsar 零拷贝 / 读路径怎么理解？

Pulsar 数据在 **BookKeeper**，Broker 更偏代理，和 Kafka「Broker 本地日志 sendfile」不完全同一套故事：

- 热路径上 Broker / Bookie 仍尽量减少用户态拷贝，利用 **网卡 DMA、池化缓冲、缓存命中** 降低开销。  
- 读可能命中 Bookie 缓存或从磁盘读 Ledger Entry，再经 Broker 发给客户端；是否走类似 sendfile 取决于实现与是否需要协议封装。  
- 面试对比口径：  
  - **Kafka**：本地日志文件 + **sendfile 零拷贝** 是经典考点；  
  - **Pulsar**：重点讲 **存算分离** 与 Bookie 读缓存；「零拷贝」不如 Kafka 典型，可答「尽量内核态/直接缓冲转发，但路径多一层 Bookie」。  

性能同样靠：批量读写、缓存、分区并行、避免热 Key，而不是单押零拷贝四个字。

---

## 消息积压怎么处理？

1. 看 Subscription backlog（积压条目/大小）、消费速率。  
2. 扩消费者：Shared / Key_Shared 可加实例分摊；分区 Topic 提高并行。  
3. 优化单条处理；排查 Bookie / Broker 磁盘与写入延迟。  
4. 必要时跳过/DLQ 毒消息；调整 TTL / retention 防磁盘打满。  
5. 生产限流；热点 Key 打散（Key_Shared 场景）。

---

## 不丢与重复

- **生产**：写多 Bookie 法定人数（ensemble / write / ack quorum）。  
- **消费**：未 Ack 不推进 Cursor，宕机后重投未确认消息。  
- **重复**：至少一次下仍可能 → **业务幂等**。

---

## Pulsar 面试速答

- 架构：Broker 无状态 + BookKeeper 存盘  
- 顺序：分区 / Key_Shared；Shared 不保序  
- 延迟/重试/DLQ：原生能力强于 Kafka  
- 进度：服务端 Cursor + Ack  
- 积压：扩订阅消费者 + 查 backlog + 治毒消息  
- 未 Ack：超时重投或消费者离开后由他人再消费  
- 零拷贝：不如 Kafka sendfile 典型；强调 Bookie 缓存与少拷贝转发  

---

# Kafka vs Pulsar（对比速记）

| 维度 | Kafka | Pulsar |
|------|-------|--------|
| 存储 | Broker 本地日志 | BookKeeper |
| 消费进度 | Group Offset | Subscription Cursor |
| 并行 | 分区级独占 | 分区 + Shared 消息竞争 + Key_Shared |
| 延迟/DLQ | 弱（多靠应用） | 较强 |
| 事务 | 幂等+事务 Producer 成熟 | 有事务能力，业务半消息不如 RMQ 常考 |
| 典型 | 日志、流计算、大数据 | 云上多租户、队列+流、灵活订阅 |
