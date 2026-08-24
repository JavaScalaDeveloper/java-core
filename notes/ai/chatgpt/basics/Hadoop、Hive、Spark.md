# Hadoop / Hive / Spark 面试笔记

离线数仓三件套：**HDFS 存** → **Hive SQL 管** → **Spark 算**。口述按架构 → 原理 → 对比 → 调优 → 倾斜。

---

# 一、Hadoop

## 是什么？解决什么问题？

**分布式存储 + 分布式计算** 基础平台。单机放不下、算不动的大数据集，切分多节点并行处理。

| 组件 | 作用 |
|------|------|
| **HDFS** | 分布式文件系统，高吞吐、大文件 |
| **YARN** | 资源调度（CPU/内存容器） |
| **MapReduce** | 计算模型（现多被 Spark 替代，概念仍考） |

## HDFS 架构（必画）

```text
Client
  ↓
NameNode（元数据：目录树、块→DataNode 映射）
  ↓
DataNode × N（存 Block，默认 128MB/256MB）
```

| 角色 | 职责 |
|------|------|
| **NameNode** | 管元数据；**不存块数据** |
| **DataNode** | 存 Block；定期心跳 + Block 报告 |
| **Secondary NN / Standby NN** | 辅助/热备；HA 用 QJM + ZKFC |

### 写流程

1. Client 向 NN 申请创建文件。  
2. NN 分配 DN 列表（默认 3 副本，机架感知）。  
3. Client 以 **Packet** 流水线写：DN1 → DN2 → DN3。  
4. 全部副本 ACK 后 NN 确认。

### 读流程

1. Client 问 NN 块位置。  
2. 就近读 DN（同机架优先）。  
3. 校验 checksum。

### 面试追问

| 问题 | 答法 |
|------|------|
| 块大小为何 128MB？ | 减少元数据量、适合大文件顺序读；太小元数据多，太大并行度低 |
| 副本放哪？ | 机架感知：不同机架容错 |
| NN 挂了？ | HA：Standby + 共享 edits；非 Secondary 实时热备 |
| 小文件问题？ | NN 内存压力大；合并小文件或 SequenceFile/ORC |

## YARN 架构

```text
ResourceManager（全局调度）
  ├─ Scheduler（分配容器）
  └─ ApplicationsManager
NodeManager × N（本机容器生命周期）
ApplicationMaster（每个作业一个，申请容器、监控任务）
```

**MapReduce on YARN：** MRAppMaster 代替旧 JobTracker。

## MapReduce 原理（Shuffle 必考）

```text
Map：读 Split → map() → 分区 Partitioner → 排序 → 溢写磁盘
Shuffle：Map 端 merge → Reducer 拉取 Copy → merge → reduce()
Reduce：聚合输出 → HDFS
```

| 概念 | 说明 |
|------|------|
| **Split** | 逻辑切分，通常 ≈ 一个 Block |
| **Partition** | 决定进哪个 Reduce；默认 `hash(key)%reduceNum` |
| **Combiner** | Map 端预聚合（如 sum），减轻 Shuffle |

**瓶颈常在 Shuffle**（磁盘 IO + 网络）。

## Hadoop 调优（常考参数）

| 方向 | 参数/手段 |
|------|-----------|
| 并行度 | `mapreduce.job.maps` / `reduces`；split 大小 |
| 内存 | `mapreduce.map.memory.mb`、`reduce.memory.mb` |
| Shuffle | `io.sort.mb`、`io.sort.factor` |
| 副本 | `dfs.replication` |
| 压缩 | Map 输出压缩、最终输出 Snappy 等 |
| 数据本地性 | 尽量 computation local |
| 倾斜 | 自定义 Partitioner、Combiner、两阶段聚合 |

---

# 二、Hive

## 是什么？

**基于 HDFS 的数据仓库工具**：用 **SQL（HQL）** 描述离线分析，底层转成 **MapReduce / Tez / Spark** 执行。  
**不是** 在线事务库；高延迟、大批量扫描。

## 架构

```text
Hive CLI / Beeline
  ↓
Driver（编译 SQL → 逻辑/物理计划）
  ↓
Metastore（表/分区/列元数据，常 MySQL 存）
  ↓
执行引擎：MR / Tez / Spark
  ↓
HDFS（表数据：Text/ORC/Parquet 等）
```

| vs MySQL | Hive |
|----------|------|
| 引擎 | MR/Spark，分钟级 | InnoDB，毫秒级 |
| 事务 | 早期弱；ACID 分区表有限支持 | 强事务 |
| 索引 | 有限（ORC 索引、布隆等） | B+Tree |
| 适用 | 离线分析、ETL | OLTP |

## 内外部表

| | 内部表 | 外部表 `EXTERNAL` |
|--|--------|-------------------|
| 删表 | 元数据 + **HDFS 数据** | 只删元数据，**保留路径数据** |

## 分区 vs 分桶

| | 分区 Partition | 分桶 Bucket |
|--|----------------|-------------|
| 目的 | 按目录裁剪（日期等） | 同分区内再 hash 分文件 |
| 目录 | `dt=20240101/` | 文件内 hash |
| 场景 | 按时间过滤 | 大表 Join、采样 |

## Hive 优化（面试）

| 手段 | 说明 |
|------|------|
| **分区/分桶** | 减少扫描量 |
| **列式存储** | ORC/Parquet + 压缩 |
| **Map Join** | 小表进内存 `/*+ MAPJOIN */` |
| **谓词下推** | `hive.optimize.ppd` |
| **CBO** | `hive.cbo.enable` |
| **倾斜 Join** | `hive.optimize.skewjoin` |
| **并行** | `hive.exec.parallel` |
| **向量化** | `hive.vectorized.execution.enabled` |
| **避免** | `SELECT *`、大表全扫、过多小文件 |

### 常考参数

`hive.exec.reducers.bytes.per.reducer`、`hive.auto.convert.join`、`hive.exec.dynamic.partition.mode=nonstrict` 等。

---

# 三、Spark

## 是什么？

**内存计算** 的分布式计算框架，比 MR **少落盘、DAG 调度更灵活**。批处理、SQL、流（Structured Streaming）、ML。

## 架构

```text
Driver（main、SparkContext、DAG 调度、Stage 划分）
  ↓ 发任务
Executor × N（每个有若干 Core + 堆内存）
  ├─ 计算 Task
  └─ 缓存 RDD/分区数据
```

| 概念 | 说明 |
|------|------|
| **Application** | 用户程序 |
| **Job** | 一个 Action 触发 |
| **Stage** | 宽依赖切分；Stage 内流水线 |
| **Task** | 每个分区一个 Task |

## RDD / DataFrame / Dataset

| | RDD | DataFrame/Dataset |
|--|-----|-------------------|
| 抽象 | 分布式对象集合 | 结构化表 + Catalyst 优化 |
| API | 函数式 map/filter | SQL + DSL |
| 优化 | 弱 | Catalyst + Tungsten |

**面试：** 生产多用 **Spark SQL / Dataset**；RDD 用于细粒度控制或老代码。

## 宽窄依赖与 Shuffle

| | 窄依赖 | 宽依赖 |
|--|--------|--------|
| 例 | map、filter、union(同分区) | groupByKey、reduceByKey、join |
| Shuffle | 不需要 | **需要**（跨分区重分区） |
| Stage | 同 Stage 流水线 | 切新 Stage |

**Shuffle 过程：** Map 端分区写文件 → Reducer 拉取 → merge → 下游算子。  
**优化：** `reduceByKey` 优于 `groupByKey`（Map 端 combine）；合理 `partition` 数。

## Spark vs MapReduce

| | MR | Spark |
|--|-----|-------|
| 中间结果 | 多落 HDFS | **内存 + 磁盘溢写** |
| 迭代 | 多次 Job，慢 | 同一 DAG 缓存，快 |
| API | 仅 MR | SQL、Streaming、ML |
| 延迟 | 高 | 相对低 |

## Spark SQL 执行（了解）

SQL → **Unresolved Logical Plan** → Analyzer → Optimizer（Catalyst）→ Physical Plan → 执行。

## 数据倾斜（三框架共通）

| 现象 | 某 key/分区数据量远大于其他 |
|------|------------------------------|
| Spark | 加盐、两阶段聚合、`repartition`、AQE（`spark.sql.adaptive.enabled`） |
| Hive | skew join、单独处理热点 key |
| MR | 自定义 Partitioner、Combiner |

## Spark 调优参数

| 参数 | 作用 |
|------|------|
| `spark.executor.memory` / `cores` / `instances` | 资源 |
| `spark.default.parallelism` | 默认分区数 |
| `spark.sql.shuffle.partitions` | Shuffle 分区（默认 200，常要调大） |
| `spark.sql.autoBroadcastJoinThreshold` | 小表广播 Join |
| `spark.serializer` | Kryo |
| `spark.memory.fraction` | 执行/存储内存占比 |
| 流 | `backpressure`、`maxRatePerPartition` |

---

# 四、综合对比（面试一张表）

| | Hadoop MR | Hive | Spark |
|--|-----------|------|-------|
| 定位 | 计算模型 | SQL 数仓 | 通用计算引擎 |
| 速度 | 慢 | 慢（取决于引擎） | 快（内存） |
| 延迟 | 高 | 高 | 中低 |
| 场景 | 已渐少 | 离线 SQL ETL | 离线 + 准实时 + 迭代 |

**Hive on Spark：** Hive 元数据 + Spark 作执行引擎，比 Hive on MR 快。  
**Spark 读 Hive 表：** 通过 Metastore 共享元数据。

---

## 面试速记

| 主题 | 一句话 |
|------|--------|
| HDFS | NN 元数据 + DN 块；写流水线三副本 |
| YARN | RM 调度 + NM 容器 + AM 管作业 |
| MR | Map → Shuffle → Reduce；瓶颈在 Shuffle |
| Hive | HQL → MR/Spark；Metastore；分区裁剪 |
| Spark | Driver 划 DAG；宽依赖 Shuffle；内存迭代 |
| 倾斜 | 加盐、两阶段、AQE、skew join |
| 调优 | 并行度、Shuffle 分区、列存、Map Join |

**收口：** Hadoop 是底座；Hive 用 SQL 管离线表；Spark 是更快更通用的计算引擎，现代数仓常 Hive 元数据 + Spark/Flink 执行。
