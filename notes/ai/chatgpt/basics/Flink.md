# Flink 面试笔记

流批一体计算引擎。前半 **基础必背**，后半补充、水平扩容、Blink 专题。

---

## 有界流 vs 无界流

| | 有界（Bounded） | 无界（Unbounded） |
|--|-----------------|-------------------|
| 数据 | 有限，可结束 | 持续产生，理论上不结束 |
| 例 | 文件、历史库表 | Kafka、埋点、传感器 |
| 处理 | 批 / 有界流作业 | 长驻流作业 |

Flink **同一套 API** 可处理两者；批常当作「有界流」执行。

---

## 窗口：滚动 / 滑动 / 会话

把无界流切成一块块再算：

| 窗口 | 特点 | 例子 |
|------|------|------|
| **滚动 Tumbling** | 大小 = 步长，**不重叠** | 每 5 分钟汇总一次 |
| **滑动 Sliding** | 步长 < 大小，**重叠** | 每 1 分钟算最近 5 分钟 |
| **会话 Session** | 按 **gap 无数据** 切会话 | 用户活跃区间 |

另有 CountWindow（按条数）、全局窗口（少用，靠自定义 Trigger）。  
`keyBy` 后 → Keyed Window（可并行）；不 key → 并行度常为 1。

---

## 三种时间

| 类型 | 含义 | 选用 |
|------|------|------|
| **Processing Time** | 机器处理时刻 | 低延迟、可近似 |
| **Event Time** | 事件自带时间戳 | **生产指标/对账**，配合 Watermark |
| **Ingestion Time** | 进入 Source 的时间 | 介于两者之间的折中 |

---

## Watermark（水位线）

**Watermark = 事件时间进度声明**：「≤ 该时间的事件大体到齐了」。

```text
Watermark ≈ 当前最大事件时间 - 乱序容忍度
当 Watermark ≥ windowEnd → 触发/关闭窗口
```

- 解决：**乱序 + 无界流下何时关窗**。  
- 容忍度 ↑ → 更准、延迟 ↑。  
- 迟到：`allowedLateness`；太迟 → **侧输出**。  
- 某分区长期无数据会卡住水位 → 配置 **idleness**。  
- **怎么定：** 见下文「实时任务的 Watermark 怎么设置」。

---

## Flink 重要特点（口述）

- **流批统一** API  
- **Event Time + 窗口**，可处理乱序  
- **Exactly-Once**（Checkpoint + 可重放源 + 事务/幂等 Sink）  
- 低延迟、高吞吐，大规模 **状态**  
- Checkpoint / Savepoint 容错与迁移  
- DataStream + Table/SQL（Blink 规划器）

---

## Exactly-Once

| 环节 | 做法 |
|------|------|
| 状态 | Barrier 对齐做 **Checkpoint** 一致性快照 |
| 故障 | 从最近 Checkpoint 恢复，源可重放 |
| 端到端 | Source 可重放 + Sink 事务（两阶段）或幂等写入 |

**注意：** 仅引擎内部 EOS 不够；Kafka→Flink→Kafka 要端到端配置齐全。

---

## Checkpoint vs Savepoint

| | Checkpoint | Savepoint |
|--|------------|-----------|
| 触发 | 引擎定期自动 | **人为**触发 |
| 用途 | 故障恢复 | 改并行度、升级、迁移、停机维护 |
| 生命周期 | 新的覆盖旧的（可配保留） | 用户管理，显式删除 |

---

## 状态（State）

| 类型 | 说明 |
|------|------|
| **Keyed State** | 跟 key 绑定（ValueState、ListState、MapState…） |
| **Operator State** | 跟算子并行实例绑定（如 Kafka offset 列表） |

状态后端：堆内存 / **RocksDB**（大状态常用）。  
Checkpoint 把状态持久化；TTL 防状态无限涨。

---

## 容错机制（组合拳）

- 定期 **Checkpoint**  
- 任务 **重启策略**  
- 可靠 **State Backend**  
- JobManager **HA**（ZK / K8s）  
- 外部系统配合（幂等、事务 Sink）

---

## 运行时组件

![Flink 架构](../../../images/flink架构图)

| 组件 | 职责 |
|------|------|
| **Dispatcher** | 提交入口、提供 Web UI |
| **JobManager** | 作业主控：调度、Checkpoint 协调 |
| **ResourceManager** | 申请 / 管理 Slot 等资源 |
| **TaskManager** | Worker：跑 Task，提供 Slot |

```text
Client → Dispatcher → JobManager → 向 RM 要 Slot → TaskManager 执行
```

---

## 常用优化参数（速查）

| 参数 | 作用 |
|------|------|
| `taskmanager.numberOfTaskSlots` | 每 TM 的 Slot 数 |
| `parallelism.default` | 默认并行度 |
| `taskmanager.memory.*` | 任务堆/托管内存 |
| `state.backend` / RocksDB 相关 | 大状态后端 |
| `execution.checkpointing.interval` | Checkpoint 周期 |
| `buffer.timeout` | 网络缓冲刷出延迟（吞吐 vs 延迟） |
| `network.memory.fraction` | 网络缓冲内存占比 |

调参先看：**反压、Checkpoint 时长、状态大小、倾斜**，再拧旋钮。

---

# Flink 面试题补充

## 时间语义再问一遍：Processing / Event / Ingestion 怎么选？

| 类型 | 含义 | 适用 |
|------|------|------|
| Processing Time | 算子本地处理时刻 | 低延迟、可接受近似；不关心乱序 |
| Event Time | 事件自带时间戳 | 对账、指标、窗口统计要正确；乱序/延迟常见 |
| Ingestion Time | 进入 Flink Source 的时间 | 折中：比 Processing 稳一点，比 Event 实现简单 |

面试结论：**生产统计多用 Event Time + Watermark**；监控大盘可 Processing Time。

---

## 窗口怎么理解？滚动 / 滑动 / 会话 / 全局有何区别？

- **滚动（Tumbling）**：窗口大小 = 滑动步长，窗口互不重叠。例：每 5 分钟统计一次。
- **滑动（Sliding）**：窗口大小 > 滑动步长，窗口重叠。例：每 1 分钟算一次最近 5 分钟。
- **会话（Session）**：按 gap（一段时间无数据）切分；适合用户会话、活跃区间。
- **全局（Global）**：一个 key 一个大窗口，通常配合自定义 Trigger，少用。

按 key：`keyBy` 后是 **Keyed Window**（状态按 key 隔离，可并行）；不 keyBy 是 **Non-Keyed Window**（并行度多为 1，慎用）。

还可以分：

- **CountWindow**：按条数；**TimeWindow**：按时间。
- **Window Function**：`ReduceFunction` / `AggregateFunction`（增量，省内存）vs `ProcessWindowFunction`（能拿到全窗口元素和窗口元信息，贵）。

触发相关：

- **Trigger**：决定何时计算/清空；默认事件时间窗口在 Watermark 越过窗口 end 时触发。
- **Evictor**：触发前后踢掉部分元素（少用）。
- **Allowed Lateness**：允许迟到数据；迟到仍可能更新结果，并可用侧输出拿“太迟”的数据。

---

## Watermark（水位线）是什么？乱序怎么处理？

**Watermark = 事件时间进度的全局声明**：表示「小于等于该时间的事件，大概率都到了」。

常见生成方式：

1. **周期性（Periodic）**：每隔一段时间根据当前最大事件时间生成，如 `maxEventTime - maxOutOfOrderness`。
2. **标记性（Punctuated）**：某些特殊事件自带水位（少见）。

乱序处理套路：

```text
事件时间戳 t
Watermark ≈ max(t) - 乱序容忍度
当 Watermark >= windowEnd 时，关闭/触发窗口
```

要点：

- Watermark **单调不减**（多并行度取最小的上游 Watermark 向下游传播）。
- 容忍度越大：结果越准、延迟越大；越小：延迟低、易丢迟到数据。
- 迟到数据：`allowedLateness` 内可再更新；之外走 **side output**。
- 空闲分片：某 Kafka 分区长时间无数据会卡住 Watermark → 用 **watermark 空闲检测（idleness）**。

一句话：**窗口按 Event Time 切，Watermark 决定何时关窗。**

---

## Flink 的 Watermark 解决了什么问题？

核心就一个问题：**在 Event Time 下，怎么知道「某个时间窗口的数据可以开始算了」**。

无界流 + 乱序到达时会出现：

1. **不知道何时关窗**：按事件时间切的窗口，总可能还有更早时间戳的数据在路上；若无限等，窗口永不触发。
2. **乱序无法处理**：后发先至时，若按到达顺序立刻关窗，结果会少算/错算。
3. **延迟与正确性的权衡无从落地**：系统需要一个可配置的「最多再等多久」的信号。

Watermark 提供的就是这个信号：

- 声明「事件时间已推进到 W」→ 认为时间戳 ≤ W 的数据基本到齐。
- 窗口在 `Watermark >= windowEnd` 时触发计算。
- 用 **乱序容忍度** 换正确性；再用 **allowedLateness / side output** 兜底真正迟到的数据。

它不解决的问题：外部系统事务、状态容错（那是 Checkpoint）、数据倾斜等。  
**对比 Processing Time**：用本地时钟，无需 Watermark，但遇到乱序/延迟事件时窗口边界与业务时间不一致。

---

## 实时任务的 Watermark 怎么设置？（实战高频）

核心不是背 API，而是：**乱序容忍多久、空闲分区怎么办、延迟与正确性怎么取舍**。

### 1. 设置放在哪？

| 位置 | 建议 |
|------|------|
| **Source 之后立刻**（推荐） | Kafka/Pulsar 接入后 `assignTimestampsAndWatermarks`，时间戳从消息字段取 |
| 中间算子后再打 | 仅当前面还有打乱事件时间的逻辑；一般越早越好 |
| 多流 Join | **每条流各自**有合理 Watermark；下游取 **min** 推进 |

必须是 **Event Time** 语义：`env.setStreamTimeCharacteristic` 在新版已弱化，DataStream 用 `WatermarkStrategy` 即表示按事件时间。

### 2. 常用三种策略（怎么选）

| 策略 | API 思路 | 适用 |
|------|----------|------|
| **有界乱序** | `forBoundedOutOfOrderness(Duration.ofSeconds(N))` | **实时业务默认**：允许迟到 N |
| **单调递增** | `forMonotonousTimestamps()` | 源已全局有序（少见）；乱序会直接丢正确性 |
| **自定义** | `WatermarkGenerator` | 按业务水位、特殊心跳、分段容忍 |

公式（有界乱序）：

```text
Watermark = 当前观测到的最大事件时间 - maxOutOfOrderness
```

### 3. `maxOutOfOrderness`（乱序容忍）怎么定？

```text
1. 抽样：事件时间 vs 处理时间 的延迟分布（P50/P95/P99）
2. 取 P95～P99 作为候选 N（再加一点余量）
3. 看 SLA：窗口结果可接受延迟 ≈ 窗口长度 + N + 链路耗时
4. 压测/灰度：迟到率、侧输出量、窗口触发延迟
```

| 量级经验（口述，需用自家监控校准） | 场景 |
|-------------------------------------|------|
| **3～10s** | 埋点较齐、Kafka 分区均匀、机房内 |
| **30s～2min** | 跨地域、弱网、端上时钟漂、重试多 |
| **数分钟** | 对账类强正确、可接受结果晚出 |

**越大：** 更准、窗口关得晚、状态占更久。  
**越小：** 延迟低，更多数据变「迟到」。

### 4. 代码骨架（Kafka 实时）

```java
WatermarkStrategy<Event> ws = WatermarkStrategy
    .<Event>forBoundedOutOfOrderness(Duration.ofSeconds(10))  // 乱序容忍 10s
    .withTimestampAssigner((event, recordTimestamp) -> event.getEventTime())
    .withIdleness(Duration.ofSeconds(30));  // 分区空闲 30s 不再拖水位

DataStream<Event> stream = env
    .fromSource(kafkaSource, ws, "kafka-source");
// 或：kafkaSource 后再 assignTimestampsAndWatermarks(ws)
```

Flink SQL：

```sql
-- 表 DDL / 动态表里常见
WATERMARK FOR event_time AS event_time - INTERVAL '10' SECOND
```

### 5. 必须配套：idleness（空闲）

Kafka **某分区长时间无数据** → 该并行实例水位不涨 → 全局取 **min** → **整作业窗口卡住**。

```text
.withIdleness(Duration.ofSeconds(30))
```

含义：超过该时间无事件，视为空闲，**不再用它的水位拖后腿**。  
**设置：** 通常 ≥ 业务最大静默间隔；过小会在「真的稀疏流量」时误推进导致关窗过早。

### 6. 与窗口、迟到的组合拳

```text
Watermark 容忍 N
  + 窗口大小 W
  + allowedLateness L（可选）
  + 侧输出（太迟）
```

| 配置 | 作用 |
|------|------|
| Watermark N | 决定 **首次** 关窗时机 |
| `allowedLateness` | 关窗后仍接受一段迟到，更新结果（状态多留一会） |
| Side Output | 超过 lateness 的数据单独流，可补数/告警 |

**实时大盘：** N 小 + 可不要 lateness，要速度。  
**对账/金额：** N 取 P99 + 适量 lateness，侧输出人工/补算。

### 7. 常见误区

| 误区 | 正解 |
|------|------|
| 用 Processing Time 却纠结 Watermark | PT 不需要 WM |
| N 拍脑袋写 0 | 有乱序会严重少算 |
| N 设很大「绝对准」 | 延迟和状态爆炸，实时变准实时 |
| 时间戳用处理时间字段 | 失去 Event Time 意义 |
| 多源 Join 只给一条流打 WM | 另一条卡住或行为难料 |
| 忽略空闲分区 | 窗口长期不触发 |
| 时间单位错（秒当毫秒） | 水位飞或永不推进 |

### 8. 卡住 / 乱飞怎么查？

1. UI 看 **Watermark** 是否推进、是否远落后于墙钟。  
2. 有无空闲 Source / 空分区 → 加 **idleness**。  
3. N 是否过大 → 关窗太晚。  
4. 事件时间是否回拨、脏数据极大未来时间戳 → 过滤或纠正。  
5. 反压导致输入慢 → 水位推进慢。

### 9. 面试 30～60 秒

「实时任务用 Event Time，Source 上 `WatermarkStrategy.forBoundedOutOfOrderness`，N 按延迟 **P95/P99** 定；Kafka 多分区必配 **idleness** 防空闲拖死水位。窗口结果要更准就加 **allowedLateness + 侧输出**。本质是用可配置的等待换乱序正确性，再靠监控调 N。」

---

## 状态（State）面试常问

### 状态分类

| 类型 | 特点 | 例子 |
|------|------|------|
| Keyed State | 绑定 key，随 `keyBy` 分区 | `ValueState` / `ListState` / `MapState` / `ReducingState` / `AggregatingState` |
| Operator State | 绑定并行子任务 | Source 的 offset 列表、Broadcast 前的缓冲 |

Broadcast State：广播流状态，常用于动态规则下发。

### 状态后端

- **HashMapStateBackend**：堆内存，快；状态大易 OOM；适合小状态 + 改 Checkpoint 到文件系统。
- **EmbeddedRocksDBStateBackend**：本地 RocksDB，状态可很大；序列化/IO 有开销；生产大数据量常用。

### 状态生命周期

- **TTL**：超时清理，防状态无限涨。
- **Checkpoint**：自动、周期性，用于故障恢复。
- **Savepoint**：手动，用于停机扩缩容、版本升级、迁移。

Keyed State 访问必须在 **keyed context**（`keyBy` 后的算子）里。

---

## Checkpoint / Barrier / Exactly-Once

**Checkpoint 流程（简化）**：

1. JobManager 向 Source 注入 **Checkpoint Barrier**。
2. Barrier 随数据在拓扑中对齐（对齐模式）或近似对齐。
3. 算子收到 Barrier 后把状态快照到 State Backend。
4. 全部完成 → Checkpoint 成功；失败可从最近成功点恢复。

**Barrier 对齐**：多输入要等所有通道 Barrier 到齐再拍快照，保证 Exactly-Once；可能引入延迟。  
**非对齐 Checkpoint（Unaligned）**：反压严重时减少对齐等待，仍可 Exactly-Once（实现更复杂）。

端到端 Exactly-Once 还要求：

- Source 可重放（如 Kafka）。
- Sink 支持事务 / 幂等（两阶段提交 `TwoPhaseCommitSinkFunction`，Kafka 事务等）。

对比：

| | Checkpoint | Savepoint |
|--|------------|-----------|
| 触发 | 自动周期 | 用户手动 |
| 目的 | 容错恢复 | 运维变更、升级 |
| 格式 | 可更短命 | 更强调兼容、可移植 |

---

## Checkpoint 同步和异步有什么区别？

这里说的「同步 / 异步」主要指 **状态快照写到持久化存储时，是否阻塞主数据处理线程**（State Backend 的 snapshot 方式），不是指 Barrier 对齐本身。

| | 同步快照（Synchronous） | 异步快照（Asynchronous） |
|--|-------------------------|--------------------------|
| 做法 | 暂停（或阻塞）处理，把状态完整写完再继续 | 先快速拿到状态的一致性视图（如 copy-on-write / 增量句柄），**后台线程**再慢慢写存储 |
| 对作业影响 | Checkpoint 期间处理停顿明显，易拉高延迟、加重反压 | 主线程停顿短，吞吐更稳，生产默认更倾向这种方式 |
| 实现成本 | 实现简单 | 需要 COW、增量 Checkpoint 等支持 |
| 典型场景 | 小状态、调试、或后端不支持异步 | RocksDB 增量 Checkpoint、大状态作业 |

结合 State Backend 理解：

- **Heap（HashMapStateBackend）**：同步时往往要把堆上状态拷出去再写；也可配合异步机制，但大状态时拷贝贵、易 GC。
- **RocksDB**：常用 **异步 + 增量 Checkpoint**——同步阶段 mainly 做 RocksDB 快照/文件引用，真正上传 SST 在异步阶段完成，对主链路影响小。

注意区分容易混的几组概念：

1. **同步 vs 异步快照**：快照 IO 是否挡住 processElement（本题）。
2. **对齐 vs 非对齐 Checkpoint**：多输入 Barrier 是否等齐（反压场景）。
3. **全量 vs 增量 Checkpoint**：每次传全部状态还是只传变化（RocksDB 增量）。

面试一句话：**同步快照 = 写盘时卡住算子；异步快照 = 先打轻量一致点，写盘放到后台，用短暂同步换长时间不阻塞。**

---

## 反压（Backpressure）是什么？怎么排查？

**反压**：下游处理慢 → 上游发送阻塞 → 压力沿链路向上游传递，最终拖慢 Source 消费。

常见原因：

- 某算子逻辑重（复杂 JSON、大状态、热点 key）。
- 数据倾斜（某 key 流量巨大）。
- 网络 / 磁盘（RocksDB、Checkpoint IO）瓶颈。
- Sink 外部系统慢（Kafka/DB 写不动）。
- 窗口/状态过大导致 GC。

排查：

1. Flink UI：**BackPressure** 面板看 high/low；看各 Task 的 `busy` / `backpressured` 时间占比。
2. 看哪一级开始反压 → 瓶颈通常在 **第一个忙且被反压的下游**。
3. Metrics：`outPoolUsage`、`inPoolUsage`、checkpoint 时长、GC、反压时长。
4. 热点：打日志 / key 采样；用 `rescale`、加盐 key、拆分算子。

缓解：

- 提高并行度、优化热点 key（加盐再聚合）。
- 换 RocksDB、调内存与块缓存；减少状态大小、开 TTL。
- 异步 IO（`AsyncFunction`）打外部系统。
- 调网络缓冲、checkpoint 间隔；必要时非对齐 checkpoint。
- Sink 侧批量写、限流、隔离慢下游。

---

## 并行度、Slot、Chain 关系？

- **并行度（Parallelism）**：算子子任务个数。
- **Task Slot**：TaskManager 资源槽；一个 Slot 可跑多个算子的子任务（资源共享）。
- **Operator Chain**：一对一、同并行度的算子可链进同一线程，减序列化/网络开销。
- `disableChaining` / `startNewChain` / `slotSharingGroup` 用于隔离资源或打断链式。

---

## Flink 与 Spark Streaming / Storm 对比（口述版）

| | Flink | Spark Streaming(DStream) | 结构化流 / Micro-batch |
|--|-------|--------------------------|-------------------------|
| 模型 | 真正流（事件驱动） | 微批 | 微批为主 |
| 延迟 | 可达毫秒～秒级 | 通常秒级 | 秒级 |
| 状态 / 窗口 | 原生强 | 有，但历史包袱重 | 增强中 |
| 容错 | Checkpoint + Barrier | RDD 血缘 / WAL 等 | Checkpoint |

---

## 数据倾斜怎么处理？

- key 加盐（`key + random`）局部聚合，再去盐全局聚合。
- 热点 key 单独分流。
- 调整并行度；避免 `Non-Keyed` 大窗口。
- 两阶段聚合：`pre-agg → shuffle → final-agg`。

---

## Watermark 卡住 / 窗口不触发怎么查？

1. 是否设置了 Event Time 与 TimestampAssigner。
2. 是否有空闲源/空闲 Kafka 分区拖住最小 Watermark。
3. 乱序阈值是否过大导致迟迟达不到 `windowEnd`。
4. 上游反压导致事件/Watermark 推进慢。
5. 时间戳单位是否搞错（秒 vs 毫秒）。

---

## 常见代码级问题（口述）

**滚动事件时间窗口示例：**

```java
data.assignTimestampsAndWatermarks(
        WatermarkStrategy
            .<Event>forBoundedOutOfOrderness(Duration.ofSeconds(5))
            .withTimestampAssigner((e, ts) -> e.getEventTime()))
    .keyBy(Event::getKey)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .aggregate(new MyAgg());
```

**ValueState 计数：**

```java
public class CountFn extends KeyedProcessFunction<String, Event, String> {
    private ValueState<Long> cnt;
    @Override public void open(Configuration conf) {
        cnt = getRuntimeContext().getState(new ValueStateDescriptor<>("cnt", Long.class));
    }
    @Override public void processElement(Event e, Context ctx, Collector<String> out) throws Exception {
        Long c = cnt.value();
        if (c == null) c = 0L;
        cnt.update(c + 1);
        out.collect(e.getKey() + ":" + (c + 1));
    }
}
```

---

## 面试速记

| 主题 | 一句话 |
|------|--------|
| 三种时间 | 处理时间本地钟；事件时间业务钟；摄取时间进站钟 |
| 窗口 | 滚动不重叠；滑动重叠；会话靠 gap |
| Watermark | 解决 Event Time「何时关窗/如何容忍乱序」；时间进度信号 |
| WM 怎么设 | Source 上有界乱序；N≈延迟 P99；Kafka 配 idleness；配 lateness/侧输出 |
| 状态 | Keyed / Operator；堆 or RocksDB；TTL 防膨胀 |
| Checkpoint | Barrier 对齐拍状态；容错；Savepoint 给人用 |
| 同步/异步 Checkpoint | 同步写盘阻塞处理；异步先打一致点再后台上传 |
| Exactly-Once | Checkpoint + 可重放 Source + 事务/幂等 Sink |
| 反压 | 下游慢向上传；UI 看反压；治热点与慢 Sink |
| 倾斜 | 加盐、两阶段聚合、拆热点 |
| 水平扩容 | 加 TM/Slot、提 parallelism；Savepoint rescale |
| Blink | 已并入 Flink；默认 SQL 规划器；changelog/MiniBatch/流批一体 |

---

## 水平扩容（面试专题）

Flink 水平扩展 = **加 TaskManager（Slot）+ 提高算子并行度**；状态随 key 分区，扩容时要考虑 **状态迁移与 rescale**。

### 运行时与并行度

```text
JobManager（调度、Checkpoint 协调）
TaskManager × N（每个提供若干 Slot）
算子 Parallelism = 子任务（SubTask）个数
```

| 概念 | 含义 |
|------|------|
| **Slot** | TM 上资源槽；一个 Slot 跑一条任务链 |
| **Parallelism** | 算子并行度，默认常 ≤ 总 Slot 数 |
| **Operator Chain** | 链内算子共享线程，减网络开销 |

### 怎么扩？

| 目标 | 做法 |
|------|------|
| **提高吞吐** | 加 TM 节点 / 每 TM slot 数；提高 `parallelism.default` 或算子 `setParallelism` |
| **治反压** | 先找瓶颈算子，只扩该算子并行度 |
| **扩集群资源** | `taskmanager.numberOfTaskSlots`、内存、网络 |
| **作业升级** | **Savepoint** 停作业 → 改并行度 → 从 Savepoint 启（支持 rescale） |

### Keyed 状态与扩容

- `keyBy` 后状态按 **key 的 hash % parallelism** 分到 subtask。  
- **改并行度** → key 到 subtask 映射变 → 需 **状态 rescale**（从 Savepoint/Checkpoint 恢复时指定新并行度）。  
- 状态大（RocksDB）：rescale 耗时长，占磁盘 IO。

### 与 Kafka 分区对齐（常见架构）

```text
Kafka Partition 数 P
Flink Source 并行度 ≈ P（或 P 的约数）
  → 一个 subtask 消费若干分区，避免过多空闲
```

- Source 并行度 **> Kafka 分区** → 部分 subtask 无分区可读。  
- Source **< 分区** → 一 subtask 消费多分区，可接受但单 subtask 更重。

### 不能线性扩的情况

- **Non-Keyed Window** 并行度常为 1。  
- **全局聚合**、**单点状态** → 瓶颈在单并行度。  
- **数据倾斜**：某 key 过大，加并行度无效 → 加盐、两阶段聚合。  
- Checkpoint 过大：并行度上去，状态总量不变但 rescale/对齐开销变。

### K8s / YARN 弹性（了解）

- 原生 on K8s 可 **主动扩缩 TM**（需配合调度与 Savepoint 策略）。  
- 批作业：并行度按数据量估；流作业：按峰值 lag 与反压调。

**30 秒收口：** Flink 水平扩靠 **加 TaskManager/Sslot 和提高 parallelism**；有状态作业用 Savepoint rescale；Source 并行度宜与 Kafka 分区对齐；倾斜 key 加并行度没用。

---

## Blink 是什么？和 Flink 什么关系？（面试高频）

**Blink** 是阿里巴巴基于 Flink 深度改造并开源的 **流计算引擎**，在 **TPC-DS 等基准** 上做过大量 SQL 与运行时优化。  
**2019 年捐赠并入 Apache Flink**；核心能力逐步成为 Flink 主线，而不是独立产品。

```text
Blink（阿里内部流引擎）
  → 捐赠 Apache Flink
  → Flink 1.9  可选 blink planner
  → Flink 1.11 blink 成为默认 SQL 规划器，old planner 废弃
  → Flink 1.14 移除 old planner
  → 今天「Flink SQL / Table API」默认就是 Blink 规划器路线
```

面试一句话：**Blink 不是单独部署的组件，而是已融入 Flink 的 Table/SQL 规划器与流批一体优化。**

---

## Blink 给 Flink 带来了什么？

| 能力 | 说明 |
|------|------|
| **Blink Planner** | 新一代 SQL 优化器：流/批统一逻辑计划、规则与代价优化 |
| **流批一体** | 同一套 Table API / SQL，批可当「有界流」在流运行时执行 |
| **Changelog 语义** | 表以 `+I/-U/+U/-D` 变更流表示，支撑 SQL 聚合、Join 正确性 |
| **MiniBatch 聚合** | 微批缓冲再计算，换延迟换吞吐，大流量 GROUP BY 常用 |
| **Local-Global 聚合** | 本地预聚合 + 全局汇总，减少 Shuffle 数据量 |
| **异步 Lookup Join** | 维表关联异步 IO，减轻同步查库反压 |
| **运行时优化** | 算子链、状态访问、序列化等，SQL 整体性能提升 |

---

## Blink Planner vs 老 Planner（old planner）

| 维度 | Old Planner（已移除） | Blink Planner（现默认） |
|------|----------------------|-------------------------|
| 状态 | Flink 1.14 前已废弃 | **默认且唯一** |
| 流/批 | 两套计划差异大 | **统一优化框架** |
| SQL 能力 | 功能弱、优化少 | 窗口、TopN、维表 Join、CDC 等更完整 |
| 性能 | 一般 | TPC 类场景明显更好 |
| 开启方式 | 1.9～1.10：`table.planner: blink` | 1.11+ **无需配置** |

---

## Changelog / Retract（变更流）

Blink SQL 里表不仅是「插入行」，而是 **带变更类型的流**：

| 类型 | 含义 |
|------|------|
| `+I` | Insert，新增 |
| `-U` | Update Before，更新前旧值 |
| `+U` | Update After，更新后新值 |
| `-D` | Delete，删除 |

**为什么需要？**  
流上 SQL 聚合、Join 会产生 **结果修正**（计数从 10→11 要先撤回 10 再发 11）。Changelog 让下游正确更新状态。

面试答：**流式 SQL 结果会更新，Blink 用 changelog 表达行的增删改。**

---

## MiniBatch 聚合（经典优化）

**问题**：逐条聚合 → 状态读写频繁、吞吐低。  
**做法**：缓冲一小批（条数或时间阈值）再触发计算。

```sql
SET 'table.exec.mini-batch.enabled' = 'true';
SET 'table.exec.mini-batch.allow-latency' = '5s';
SET 'table.exec.mini-batch.size' = '5000';
```

| 项 | 说明 |
|----|------|
| 优点 | 吞吐高、状态访问少 |
| 代价 | 延迟增加（最多到 allow-latency） |
| 场景 | 大流量 `GROUP BY`、窗口聚合 |

---

## Local-Global 两阶段聚合

```text
Local 聚合（各 subtask 预聚合）→ Shuffle → Global 聚合
```

类似 Combiner + Reduce，减少 Shuffle 量；与 **加盐两阶段** 治倾斜思路相通。

---

## 流批一体

| | 流 | 批 |
|--|-----|-----|
| 数据 | 无界 | 有界 |
| Blink | 同一套 Table API / SQL 逻辑计划，批当有界流优化执行 |

一套 SQL 可复用于离线 + 实时；批作业注意并行度与 Checkpoint 策略（批常可关或稀疏）。

---

## 异步 Lookup Join

同步维表 Join 每条事件查一次外部库 → 易反压。  
**Async Lookup**：并发请求维表 + 回调输出，常配合 LRU 缓存。适合事实流关联缓慢变化维表。

---

## Blink 面试追问

| 问题 | 答法 |
|------|------|
| 还要单独学 Blink 吗？ | 不用单独部署；掌握并入 Flink 的 SQL 优化、changelog、MiniBatch |
| SQL vs DataStream？ | SQL 做指标/ETL/维表 Join；DataStream 做复杂 CEP、细粒度状态 |
| CDC 常见链路？ | MySQL CDC → Flink SQL → Kafka / OLAP |
| MiniBatch vs 窗口？ | MiniBatch 是算子微批优化；窗口是时间边界；可并存 |
| vs Spark 结构化流？ | Flink 更低延迟、原生状态强；Spark 离线生态统一强 |

---

## Blink 速记

| 主题 | 一句话 |
|------|--------|
| 定位 | 阿里流引擎，已捐赠合并进 Flink |
| Planner | 现今默认 Flink SQL 引擎 |
| Changelog | +I/-U/+U/-D，流式结果可更新 |
| MiniBatch | 微批聚合，换延迟换吞吐 |
| Local-Global | 本地预聚合减 Shuffle |
| 流批一体 | 同一 SQL，批当有界流 |
| Lookup | 异步维表 Join 减反压 |
