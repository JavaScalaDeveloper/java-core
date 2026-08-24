# ClickHouse 是什么？适合什么场景？

ClickHouse 是开源的**列式 OLAP** 数据库，面向分析型查询：大表聚合、报表、日志/埋点、时序指标等。

- 适合：写多读少偏分析、宽表扫描聚合、高压缩比、近实时报表（秒～分钟级）。
- 不适合：高频小事务、复杂多表强一致 OLTP、大量点更新删除、高并发短连接事务（这些更该用 MySQL/TiDB 等）。

# 列存相对行存有什么优势？

- **只读需要的列**：聚合 `sum(amount)` 不必读整行，IO 大幅下降。
- **同列数据类型一致**：压缩率高（LZ4/ZSTD 等），磁盘与内存更省。
- **向量化执行**：按列块（block）SIMD/批处理，吞吐高。
- 代价：整行更新、点查主键、事务语义弱于行存 OLTP。

# MergeTree 是什么？为什么叫 MergeTree？

MergeTree 是 ClickHouse 最核心的表引擎家族。数据以**有序 part** 落盘，后台把小 part **合并（merge）**成更大 part，类似 LSM 思想。

建表时关键子句：

- `ORDER BY`：数据在 part 内的排序键，决定稀疏索引与多数查询效率。
- `PARTITION BY`：分区键（常按天/月），便于裁剪与 TTL 删分区。
- `PRIMARY KEY`：默认与 `ORDER BY` 前缀相同，用于稀疏索引；**不是** MySQL 那种唯一约束。

# MergeTree 的数据结构是怎样的？

从目录到文件，可以分层理解：

```
表目录
 └─ 分区目录（如 20260820）
     └─ part 目录（如 all_1_1_0）
         ├─ checksums.txt / columns.txt / count.txt   # 元信息
         ├─ primary.idx                               # 稀疏主键索引
         ├─ 列名.bin + 列名.mrk2（或 .mrk）           # 每列一份数据 + 标记
         └─ 可选：二级跳数索引、投影、压缩信息等
```

**1. 分区（Partition）**  
按 `PARTITION BY` 切成多个分区目录。查询带分区条件时可直接丢掉无关分区（分区裁剪）。

**2. Part（不可变数据片）**  
一次 INSERT（或一次 merge 产物）形成一个 part。Part 内数据按 `ORDER BY` **全局有序**，写入后只读不改；变更靠「写新 part + 后台 merge / mutation」。多个小 part 后台合并成更大 part，减少文件数、提高顺序读效率——这就是 MergeTree 名字的由来。

**3. Granule（粒度块）**  
Part 内按 `index_granularity`（默认约 8192 行）切成若干 granule。稀疏索引的最小定位单位就是 granule，而不是单行。

**4. 列存文件（`.bin`）**  
每个列单独一个（或一组）压缩二进制文件。同列连续存放 → 压缩率高、聚合时只读相关列。

**5. 标记文件（`.mrk` / `.mrk2`）**  
记录每个 granule 在对应 `.bin` 中的偏移，实现「索引定位 → 随机打开列文件某一段 → 顺序读」。Wide part 下常见一列一个 mark；Compact 等形态会略有差异，面试答「mark 映射 granule 到列文件偏移」即可。

**6. 稀疏主键索引（`primary.idx`）**  
只存每个 granule 的主键（`PRIMARY KEY` / `ORDER BY` 前缀）边界值，**不是**每行一棵 B+Tree。内存里可加载，用于判断哪些 granule 可能命中条件，再配合 mark 去读列数据。

**7. 可选：跳数索引 / 投影**  
minmax、set、bloom_filter、ngrambf 等跳数索引进一步跳过 granule；Projection 可存另一套排序/预聚合副本，加速特定查询。

**一次典型点查/过滤路径：**  
分区裁剪 → 打开若干 part → 用 `primary.idx` 找候选 granule → mark 定位列偏移 → 解压读列块 → 向量化过滤/聚合。

和 InnoDB 对比一句话：InnoDB 是行式 B+Tree 精确到行；MergeTree 是 **有序列存 part + 稀疏索引到 granule**，为扫表聚合而生。

# MergeTree 与 LSM 树：数据结构与原理

MergeTree 常被说成「类似 LSM」——面试要把 **经典 LSM 是什么** 和 **ClickHouse 怎么落地** 分开讲清楚。

## 经典 LSM 树是什么？

**LSM（Log-Structured Merge Tree）** 是一种面向 **高吞吐写入** 的存储结构，核心思想：

```text
写：先追加（append），尽量不原地改
读：可能扫多个有序层
后台：把小有序文件合并成大文件（Compaction / Merge）
```

典型分层（以 RocksDB / LevelDB 为例）：

```text
写入
  ↓
MemTable（内存有序结构，如跳表）
  ↓ 刷盘
L0：多个不可合并重叠的 SST 文件（刚落盘的小文件）
  ↓ Compaction
L1 / L2 / L3 …：层内有序、层间键范围划分，越往下文件越大、越冷
```

| LSM 概念 | 作用 |
|----------|------|
| WAL | 写前先记日志，崩溃可恢复 |
| MemTable | 内存缓冲，吸收随机写 |
| Immutable SST | 落盘后的只读有序文件 |
| Compaction | 多路归并合并，减少文件数、清理删除标记 |
| 读放大 | 要查多层 / 多个文件才能拼出最新值 |
| 写放大 | Compaction 时同一份数据可能被重写多次 |

LSM 换的是：**随机写改顺序追加 + 后台合并**，适合写多读少、批量导入；代价是合并压力、读放大、更新/删除要特殊处理（墓碑标记等）。

## ClickHouse MergeTree 如何对应 LSM？

MergeTree **不是** 把 RocksDB 原样搬进 CH，而是 **LSM 思想 + 列存 part** 的工程实现：

| 经典 LSM | MergeTree 对应 |
|----------|----------------|
| MemTable | 内存中攒批的 Block；一次 INSERT 缓冲后落盘 |
| SST / Sorted Run | **Part**（一次写入或一次 merge 产出的有序数据片） |
| 按 Key 有序 | Part 内按 `ORDER BY` 全局有序 |
| Compaction | 后台 **Merge**（`merge` 线程把多个 part 归并成一个） |
| 分层（L0/L1…） | 没有固定 L0/L1 命名，但表现为 **大量小 part → 少量大 part** |
| 删除/更新 | 不原地改：Mutation 重写 part，或 Replacing/Collapsing 合并时折叠 |
| 索引 | 稀疏主键索引 + mark，不是 B+Tree 页级索引 |

可画成：

```text
INSERT 批次
  ↓
新 Part（列存 .bin + primary.idx + marks）  ← 只追加，不可变
  ↓ 后台 Merge（多路归并，按 ORDER BY 排序键合并）
更大 Part
  ↓ TTL / DROP PARTITION / Mutation
旧 Part 删除或重写
```

**写入路径简述：**

1. 客户端批量 INSERT → 服务端按分区路由。  
2. 内存排序/组块 → 写成 **一个新 part**（每列压缩 `.bin`）。  
3. 查询时同时打开 **多个 part**（像 LSM 读多层），用分区裁剪 + 稀疏索引跳过无关 granule。  
4. 后台 merge 选若干大小相近的 part，**多路归并**成更大 part，旧 part 标记删除。  

所以叫 **MergeTree**：树状不是指针父子，而是 **「多 part 层级 + 合并成更大 part」** 的演进关系。

## Merge 原理（Compaction 在 CH 里干什么）

- **触发**：part 数量过多、总大小到阈值、定时任务等（`system.merge_tree_settings`）。  
- **选择**：常选大小相近的 part 合并，控制写放大；part 太碎 → merge 跟不上 → 查询要打开很多文件变慢。  
- **过程**：按 `ORDER BY` 键 **多路归并**各 part 的行（逻辑上按行对齐各列）；合并后可顺带做 Replacing/Summing 等引擎逻辑。  
- **结果**：生成新 part，旧 part 异步移除；**读路径逐渐从「很多小文件」变成「较少大文件」**。  

和经典 LSM 一样要权衡：

| 现象 | 原因 |
|------|------|
| 小批量频繁 INSERT | part 爆炸，merge 压力大（类似 L0 堆满） |
| 查询变慢 | 打开 part 过多，读放大 |
| 磁盘 IO 飙高 | 后台 merge 写放大 |
| `FINAL` / 去重慢 | 查询时临时归并多个 part，类似在线 compaction |

## 与经典 LSM（RocksDB 等）的主要差异

| 维度 | 经典 LSM（行存 KV） | ClickHouse MergeTree |
|------|---------------------|----------------------|
| 数据形态 | 行存 SST | **列存 part**（每列独立压缩文件） |
| 典型场景 | OLTP 点查、范围扫 | OLAP 列扫描、聚合 |
| 内存表 | 常驻 MemTable | 批量写为主，强调 INSERT 攒批 |
| 分层 | 明确 L0～Ln | 以 part 大小/数量管理，无固定层号 |
| 点查 | 布隆过滤 + 块索引 | 稀疏索引到 granule，适合扫而非单行 |
| 更新 | 墓碑 + compaction 清理 | Mutation 重写；或引擎合并时折叠 |
| 读优化 | Block cache、Bloom | 列存压缩 + 向量化 + 分区裁剪 |

**面试一句话：**  
MergeTree 是 **LSM 的 append + 多路归并合并** 思路，落在 **列存不可变 part** 上；用 merge 换写入吞吐和顺序 IO，用稀疏索引和列裁剪换分析查询，而不是做行级原地更新的 B+Tree。

## 和「为什么插入要批量」的关系

这正是 LSM 写路径的必然结果：

- 每次 INSERT ≈ 一个新 sorted run（新 part）  
- part 越碎 → merge 队列越长 → 读放大越大  
- 所以 CH 推荐 **大批量写入**，让单次 part 够大，减轻 LSM 典型的「小文件过多」问题  

Buffer 表、Kafka 引擎、应用侧攒批，都是在 **MemTable 层** 做聚合，再一次性刷成 part。

# ClickHouse 的主键/索引和 MySQL 有何不同？

- MySQL InnoDB：B+Tree，主键唯一，二级索引回表。
- ClickHouse：**稀疏索引**——每隔 N 行（如 `index_granularity=8192`）记一个标记，定位到 granule，再顺序读列数据。
- 主键**不保证唯一**；重复键可存在，靠 `ReplacingMergeTree` 等在合并时去重。
- 查询要尽量带上 `ORDER BY` 前缀条件，才能有效跳过 granule。

# 常见 MergeTree 变体有哪些？

- **MergeTree**：基础有序存储。
- **ReplacingMergeTree**：合并时按版本列保留「最新」一行，用于最终去重（查询时仍可能看到未合并的重复，可用 `FINAL` 或自行 `GROUP BY`）。
- **CollapsingMergeTree / VersionedCollapsingMergeTree**：用符号列（1/-1）折叠更新删除，适合状态变更流。
- **SummingMergeTree / AggregatingMergeTree**：合并时预聚合，适合指标汇总。
- **ReplicatedMergeTree**：多副本复制，依赖 ZooKeeper/ClickHouse Keeper。
- **Distributed**：逻辑分布式表，把查询路由到各分片本地表。

# 分区、分片、副本分别是什么？

- **分区（Partition）**：单表内按表达式切开的数据目录，利于按时间删除、分区裁剪。
- **分片（Shard）**：水平拆到多台机器，通常用 Distributed + 各分片本地 ReplicatedMergeTree。
- **副本（Replica）**：同一分片多副本，保证高可用与读扩展；写入需同步到副本（异步复制语义需了解）。

# 单机模式 vs 集群模式有什么区别？

ClickHouse「集群」不是强绑定的一体式集群（不像很多 NewSQL 自动分片），而是 **多节点 + 分片/副本约定 + Distributed 逻辑表 +（可选）Keeper**。单机也能跑完整 MergeTree；上集群主要是为了 **容量、吞吐、高可用**。

## 对比总表

| 维度 | 单机模式 | 集群模式 |
|------|----------|----------|
| 节点 | 1 个 ClickHouse Server | 多 Server，按 `remote_servers` 配分片/副本 |
| 数据存放 | 全在本机磁盘 | 按 **分片** 打散到多机；每分片可有 **多副本** |
| 表引擎 | `MergeTree` 等即可 | 本地表常用 `ReplicatedMergeTree`；对外再挂 `Distributed` |
| 协调服务 | 可不配 Keeper | 复制表几乎必备 **ClickHouse Keeper / ZK** |
| 写入 | 直写本地表 | 可写 Distributed（自动路由）或直写各分片本地表 |
| 查询 | 本机扫描 | Distributed 下发到各分片并行算，再汇总 |
| 扩展 | 垂直扩容（加 CPU/盘） | 水平加节点/分片 |
| 高可用 | 单点，挂了就停 | 副本可顶上；注意 **不完全等同强一致金融库** |
| 运维复杂度 | 低 | 高：分片规划、副本、DDL、分布式 DDL、倾斜治理 |
| 适用 | 开发、中小数据、单机盘够用 | PB 级、高并发分析、要冗余 |

## 单机模式

```text
Client → ClickHouse Server → 本地 MergeTree（磁盘上的 part）
```

- 架构简单，Merge、查询、写入路径都清晰。  
- 瓶颈：单机 CPU、内存、磁盘 IO、容量。  
- 没有「分片并行」：再大的表也只能这一台扫（除非自己应用层拆库）。  
- 备份：靠备份盘、文件系统快照、`BACKUP`/`RESTORE` 等，无多机副本自动切换。

## 集群模式（常见形态）

```text
                    ┌─ Shard1: Replica A / Replica B ─┐
Client → Distributed ─┼─ Shard2: Replica C / Replica D ─┤→ 各节点本地 ReplicatedMergeTree
                    └─ Shard3: ...                    ┘
                              ↑
                     ClickHouse Keeper（复制元数据/队列）
```

### 三个关键概念（别和「分区」混）

| 概念 | 作用 |
|------|------|
| **Shard（分片）** | 水平切数据，提高容量与并行扫描 |
| **Replica（副本）** | 同一分片的冗余，提高可用与读扩展 |
| **Partition** | **单表内** 按日期等切目录，两模式都有，与是否集群无关 |

### 两张表如何配合

1. **本地表**（每台真实存数据）：`ReplicatedMergeTree(...)`  
2. **分布式表**（逻辑入口）：`Distributed(cluster, db, local_table, sharding_key)`  

应用通常 **查 Distributed**；写入可：

- 写 Distributed，由 `sharding_key` 路由到分片；或  
- 应用/ETL **直写各分片本地表**（生产常见，可控、避免分布式写的坑）。

## 核心差异拆开讲

### 1. 扩展方式

- **单机**：加 CPU、内存、更快盘；到顶就拆业务或上集群。  
- **集群**：加 Shard 加容量与查询并行；加 Replica 加可用与读流量。

### 2. 查询执行

- **单机**：一个节点完成过滤、聚合。  
- **集群**：Distributed 把 SQL 改写/下推到各分片，**并行**执行后在发起节点（或随机节点）做合并（如 `GROUP BY` 二次聚合）。网络与合并阶段可能成为新瓶颈。

### 3. 写入与一致性

- **单机**：写成功即落本机 part。  
- **集群**：  
  - 副本间靠复制队列同步，可能有 **短暂落后**；  
  - `insert_quorum` 等可要求多副本确认，换延迟；  
  - 分布式写失败、重复、 precisely-once 都要按语义设计（常不如单机直观）。

### 4. DDL / 运维

- **单机**：建表即本地生效。  
- **集群**：要对集群所有分片建本地表 + Distributed；可用 **ON CLUSTER** 分布式 DDL；还要管 Keeper、副本修复、分片倾斜。

### 5. 分片键

集群才需要认真选 **sharding_key**（如 `cityHash64(user_id)`）：

- 不均 → 某分片热点；  
- 与查询条件无关 → 容易 **打到所有分片**（全局聚合仍可并行，但省不了跨片）。

单机没有跨机 sharding，只有 `PARTITION BY` / `ORDER BY`。

## 怎么选？

| 场景 | 建议 |
|------|------|
| 开发、数据量小、单盘够 | **单机** |
| 要机器级容灾、读扩展 | **至少 1 分片多副本**（复制集群） |
| 单机扫不动、要水平扩展 | **多分片 + Distributed** |
| 只要 HA、数据量仍单机可扛 | 优先 **复制**，不必急着多分片 |

**面试一句话：**  
单机 = 一个 Server 存全量，简单但有容量与单点上限；集群 = 多分片打散 + 多副本冗余，靠 Distributed 并行查、Keeper 协调复制，换来扩展与可用，但运维和分布式写/查更复杂。ClickHouse 的 Partition 是表内目录概念，两种模式都有；Shard/Replica 才是集群才有的水平切分与冗余。

# 单机模式 vs 集群模式有什么区别？

ClickHouse「集群」不是强绑定的一体式集群（不像很多 NewSQL 自动分片），而是 **多节点 + 分片/副本约定 + Distributed 逻辑表 +（可选）Keeper**。单机也能跑完整 MergeTree；上集群主要是为了 **容量、吞吐、高可用**。

## 对比总表

| 维度 | 单机模式 | 集群模式 |
|------|----------|----------|
| 节点 | 1 个 ClickHouse Server | 多 Server，按 `remote_servers` 配分片/副本 |
| 数据存放 | 全在本机磁盘 | 按 **分片** 打散到多机；每分片可有 **多副本** |
| 表引擎 | `MergeTree` 等即可 | 本地表常用 `ReplicatedMergeTree`；对外再挂 `Distributed` |
| 协调服务 | 可不配 Keeper | 复制表几乎必备 **ClickHouse Keeper / ZK** |
| 写入 | 直写本地表 | 可写 Distributed（自动路由）或直写各分片本地表 |
| 查询 | 本机扫描 | Distributed 下发到各分片并行算，再汇总 |
| 扩展 | 垂直扩容（加 CPU/盘） | 水平加节点/分片 |
| 高可用 | 单点，挂了就停 | 副本可顶上；注意 **不完全等同强一致金融库** |
| 运维复杂度 | 低 | 高：分片规划、副本、DDL、分布式 DDL、倾斜治理 |
| 适用 | 开发、中小数据、单机盘够用 | PB 级、高并发分析、要冗余 |

## 单机模式

```text
Client → ClickHouse Server → 本地 MergeTree（磁盘上的 part）
```

- 架构简单，Merge、查询、写入路径都清晰。  
- 瓶颈：单机 CPU、内存、磁盘 IO、容量。  
- 没有「分片并行」：再大的表也只能这一台扫（除非自己应用层拆库）。  
- 备份：靠备份盘、文件系统快照、`BACKUP`/`RESTORE` 等，无多机副本自动切换。

## 集群模式（常见形态）

```text
                    ┌─ Shard1: Replica A / Replica B ─┐
Client → Distributed ─┼─ Shard2: Replica C / Replica D ─┤→ 各节点本地 ReplicatedMergeTree
                    └─ Shard3: ...                    ┘
                              ↑
                     ClickHouse Keeper（复制元数据/队列）
```

### 三个关键概念（别和「分区」混）

| 概念 | 作用 |
|------|------|
| **Shard（分片）** | 水平切数据，提高容量与并行扫描 |
| **Replica（副本）** | 同一分片的冗余，提高可用与读扩展 |
| **Partition** | **单表内** 按日期等切目录，两模式都有，与是否集群无关 |

### 两张表如何配合

1. **本地表**（每台真实存数据）：`ReplicatedMergeTree(...)`  
2. **分布式表**（逻辑入口）：`Distributed(cluster, db, local_table, sharding_key)`  

应用通常 **查 Distributed**；写入可：

- 写 Distributed，由 `sharding_key` 路由到分片；或  
- 应用/ETL **直写各分片本地表**（生产常见，可控、避免分布式写的坑）。

## 核心差异拆开讲

### 1. 扩展方式

- **单机**：加 CPU、内存、更快盘；到顶就拆业务或上集群。  
- **集群**：加 Shard 加容量与查询并行；加 Replica 加可用与读流量。

### 2. 查询执行

- **单机**：一个节点完成过滤、聚合。  
- **集群**：Distributed 把 SQL 改写/下推到各分片，**并行**执行后在发起节点（或随机节点）做合并（如 `GROUP BY` 二次聚合）。网络与合并阶段可能成为新瓶颈。

### 3. 写入与一致性

- **单机**：写成功即落本机 part。  
- **集群**：  
  - 副本间靠复制队列同步，可能有 **短暂落后**；  
  - `insert_quorum` 等可要求多副本确认，换延迟；  
  - 分布式写失败、重复、 precisely-once 都要按语义设计（常不如单机直观）。

### 4. DDL / 运维

- **单机**：建表即本地生效。  
- **集群**：要对集群所有分片建本地表 + Distributed；可用 **ON CLUSTER** 分布式 DDL；还要管 Keeper、副本修复、分片倾斜。

### 5. 分片键

集群才需要认真选 **sharding_key**（如 `cityHash64(user_id)`）：

- 不均 → 某分片热点；  
- 与查询条件无关 → 容易 **打到所有分片**（全局聚合仍可并行，但省不了跨片）。

单机没有跨机 sharding，只有 `PARTITION BY` / `ORDER BY`。

## 怎么选？

| 场景 | 建议 |
|------|------|
| 开发、数据量小、单盘够 | **单机** |
| 要机器级容灾、读扩展 | **至少 1 分片多副本**（复制集群） |
| 单机扫不动、要水平扩展 | **多分片 + Distributed** |
| 只要 HA、数据量仍单机可扛 | 优先 **复制**，不必急着多分片 |

**面试一句话：**  
单机 = 一个 Server 存全量，简单但有容量与单点上限；集群 = 多分片打散 + 多副本冗余，靠 Distributed 并行查、Keeper 协调复制，换来扩展与可用，但运维和分布式写/查更复杂。ClickHouse 的 Partition 是表内目录概念，两种模式都有；Shard/Replica 才是集群才有的水平切分与冗余。

# 为什么插入要批量？小批量插入有什么问题？

- 每次 INSERT 会产生新 part；过碎则合并压力大、文件句柄多、查询变慢。
- 推荐：应用侧攒批（数千～数十万行）、或用 Buffer 引擎、Kafka 引擎异步写入。
- 避免：逐行 INSERT、高频小事务式写入。

# ClickHouse 如何做更新和删除？

- 设计上偏 **append-only**：不擅长行级频繁 UPDATE/DELETE。
- 轻量方式：`ALTER TABLE ... UPDATE/DELETE`（Mutation）异步改 part，适合低频批量修正。
- 业务上去重/变更：更推荐 Replacing/Collapsing 引擎 + 追加写入。
- 按分区过期：`TTL` 删旧分区，比逐行删高效得多。

# ClickHouse 速度快的原因？

面试可按「存储 → 索引裁剪 → 执行引擎 → 工程实现」回答：

**1. 列式存储**  
分析查询通常只涉及少量列；CH 只读这些列的压缩块，IO 比行存整行扫描小一个数量级很常见。

**2. 高压缩率**  
同列类型相近、有序后局部性更好，LZ4/ZSTD 等压缩后磁盘与内存带宽占用更低，「解压 + 算」往往仍快于读未压缩的宽行。

**3. 稀疏索引 + 分区裁剪**  
先扔分区，再用主键稀疏索引跳过大量无关 granule，避免真·全表解压。ORDER BY 选对时，过滤几乎只碰热数据段。

**4. 有序 + 顺序 IO**  
Part 内按键排序，范围条件变成连续 granule 顺序读，磁盘/页缓存更友好；merge 后大 part 进一步减少随机打开小文件。

**5. 向量化执行**  
按列块（block，常成千上万行）批处理，CPU 缓存友好，可走 SIMD；比「一行一行解释执行」吞吐高得多。

**6. 并行与多核**  
单机多线程切分 granule/流水线；分布式下多 shard 并行算再汇总，天然适合 OLAP。

**7. 引擎与预计算**  
Summing/Aggregating、物化视图、Projection 把「查时算」变成「写时/合时算」，交互查询只扫更小结果集。

**8. 工程向的取舍**  
弱化行级事务与频繁更新，换来 append、批量写、简单并发模型；CPU 密集压缩与向量化被吃满，而不是耗在锁与随机写页上。

**一句话：**  
快，是因为 **少读（列存+裁剪）+ 读得省（压缩+顺序 IO）+ 算得猛（向量化+并行）+ 能预聚合**，而不是因为有比 InnoDB 更细的行锁索引。

# 查询侧还要注意什么？

- 避免 `SELECT *`、无过滤扫超大宽表、滥用 `FINAL`。
- 大 JOIN、大排序注意内存限制；维表优先字典/小表广播。
- ORDER BY、分区与查询条件对齐，否则稀疏索引「形同虚设」。

# JOIN 有什么注意点？

- 大表 JOIN 大表成本高；常见做法是「大表 LEFT JOIN 小维表」，维表可放内存（`Join` 引擎 / dictionary）。
- 分布式 JOIN 语义与 MySQL 不同，计划可能本地 JOIN 或全局，需看执行计划。
- 复杂多表关联、强一致事务关联更适合放到上游数仓建模成宽表再查 CH。

# 物化视图怎么用？

- ClickHouse 物化视图常在 **INSERT 时触发**，把增量写入目标表（预聚合/转换）。
- 适合：实时汇总指标、清洗字段、写入多份模型。
- 注意：对已有历史数据不会自动回刷；改逻辑常需重建；源表引擎与写入路径要匹配。

# 和 MySQL / Elasticsearch / Hive 怎么对比？

| | ClickHouse | MySQL | ES | Hive/Spark 数仓 |
|--|------------|-------|----|-----------------|
| 定位 | 实时/近实时 OLAP | OLTP | 检索/日志检索 | 离线批处理 |
| 存储 | 列存 | 行存 | 倒排+文档 | 列存文件 |
| 事务 | 弱 | 强 | 无传统事务 | 批语义 |
| 点查/更新 | 弱 | 强 | 一般 | 弱 |
| 大聚合 | 极强 | 弱 | 一般 | 强但延迟高 |

选型：在线交易 → MySQL；全文检索 → ES；离线大作业 → Hive/Spark；交互式分析报表 → ClickHouse。

# 数据如何保证不丢？副本一致性怎样？

- 本地：写盘成功的 part；可配置同步落盘策略。
- 复制表：写入需多数副本确认（取决于配置），元数据/复制队列由 Keeper 协调。
- 仍可能出现副本短暂落后；读「最新」与写确认策略要按业务配置，不能默认当成银行级同步事务库。

# 常见性能问题怎么排查？

- `system.query_log` / `system.parts`：看慢查询、part 数量是否爆炸。
- 是否命中分区/主键前缀；是否 `FINAL` 滥用。
- 是否小文件过多（写入过碎）。
- 内存：大排序、大 JOIN、聚合是否超 `max_memory_usage`。
- 网络：Distributed 是否打满、分片是否倾斜。

# 建表时 ORDER BY 怎么选？

- 选过滤最频繁、基数合适、常一起出现的列前缀（如 `user_id, event_time`）。
- 时间字段常放后面或配合分区；高基数列过早放入可能导致索引效果差或写入放大。
- 与分区键配合：分区负责粗裁剪，ORDER BY 负责分区内定位。

# TTL、压缩、磁盘策略常见用法？

- `TTL`：按时间删行或整分区，或把冷数据 `TO DISK/VOLUME` 到慢盘。
- 压缩编解码按列指定，平衡 CPU 与磁盘。
- 多磁盘策略：热数据 SSD、冷数据 HDD，配合 TTL 移动。

# ClickHouse Keeper / ZooKeeper 干什么用？

- 复制表的副本协调、DDL 任务、选举与复制日志路径等依赖协调服务。
- 新版本推荐 **ClickHouse Keeper**（兼容 ZK 协议，更轻），生产复制集群几乎必备。

# 写入链路（Kafka）常见怎么做？

- Kafka Engine 表消费 → 物化视图写入 MergeTree；或外部 Flink/Spark 批量写 HTTP/Native 协议。
- 保证：**至少一次** 投递 + 下游去重（Replacing / 业务唯一键聚合），而不是强依赖 exactly-once 单行事务。

---

## 水平扩容（面试专题）

单机 → 集群的本质：**加 Shard 扩容量与并行，加 Replica 扩可用与读**；Partition 是表内逻辑切分，两种模式都有。

### 扩容做什么？

| 动作 | 效果 | 注意 |
|------|------|------|
| **加节点 + 新 Shard** | 数据 rebalance 到新分片 | 会触发 part 迁移，占磁盘/网络 |
| **加 Replica** | 读扩展、故障切换 | 写路径仍到主副本，复制有延迟 |
| **加 Distributed 查询节点** | 只扩 SQL 入口（若独立部署 TiDB 式无此层） | CH 通常 TiDB 无，扩的是带数据的节点 |
| **调大分片数（新建表时）** | 提高并行上限 | **已有表主分片数难改**，规划前置 |

### 写入与查询如何随扩容变化？

- **写**：路由到各 Shard 本地表；并行度 ≈ Shard 数（各 Shard 内仍批量写 part）。  
- **查**：Distributed 下发到各 Shard 并行扫，协调节点合并结果。  
- **瓶颈**：单 Shard 热点、merge 跟不上、Distributed 合并阶段、ZK/Keeper。

### 扩容步骤（口述）

1. 新节点加入集群配置（`remote_servers`）。  
2. 新 Shard 或从现有 Shard **迁移 part**（`SYSTEM MOVE PART` / 自动均衡策略）。  
3. 副本补齐，观察复制队列与磁盘。  
4. 验证查询是否仍带分区条件、分片是否倾斜。

### 和「只加 CPU」区别

| | 垂直扩容 | 水平扩容 |
|--|----------|----------|
| 手段 | 单机加核加盘 | 加机器/Shard |
| 上限 | 单机磁盘与 merge | 集群总容量 |
| 适用 | 分片数已够、单分片重 | 总量/总 QPS 超单机 |

### 常见坑

- 小批量写 + 多分片 → part 爆炸，merge 更凶。  
- sharding_key 单调 → 单 Shard 热点，加节点无效。  
- 以为加 Replica 就能线性扩写 → **写仍走主副本**。

**30 秒收口：** ClickHouse 水平扩靠 **多分片 + Distributed 并行**；副本保 HA 和读；Partition 不是 Shard；扩容前规划分片数与 sharding_key，写入仍要批量。

# 面试速记：一句话总结

ClickHouse = **列存 + LSM 式 MergeTree（append part + 后台 merge）+ 稀疏索引 + 向量化**，用追加写和预聚合换极致分析性能；别拿它当 MySQL 用。

**单机 vs 集群：** 单机简单有容量/单点上限；集群靠 **Shard 扩容 + Replica 高可用 + Distributed 并行查**，运维与分布式语义更重；Partition 两模式都有，勿与 Shard 混淆。

**水平扩容：** 加 Shard 迁 part；Replica 扩读/HA；主分片数建表前规划；防 sharding_key 热点与小批量写。