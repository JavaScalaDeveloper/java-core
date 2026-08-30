# 大数据面试：OLAP 选型与常见题

> Presto/Trino、ClickHouse、Doris/StarRocks 同属 **分析查询** 阵营，定位不同：联邦即席、极致单表扫、实时数仓服务层。  
> ClickHouse 细节见同目录 `DB-Clickhouse.md`；离线平台见下文「自建 DataWorks」。

---

## 一、Presto / ClickHouse / Doris 对比（高频）

### 1. 一句话定位

| 引擎 | 定位 | 存储 |
|------|------|------|
| **Presto / Trino** | **联邦查询引擎**：跨 Hive/Iceberg/MySQL/Kafka 等即席 SQL | **不存数**，读外部 Catalog |
| **ClickHouse** | **列式 OLAP 库**：宽表扫、高压缩、高吞吐聚合 | **自管存储**（MergeTree） |
| **Doris / StarRocks** | **实时数仓 / MPP OLAP**：导入+明细+聚合，MySQL 协议友好 | **自管**（副本、分片） |

> 现网常说 Presto，实际多已迁 **Trino**（社区 fork）；面试可并称「Presto/Trino」。Doris 与 **StarRocks**（从 Doris 衍生）面试常一起答，国内报表层二者都很热。

### 2. 优缺点对比表

| 维度 | Presto/Trino | ClickHouse | Doris / StarRocks |
|------|--------------|------------|-------------------|
| **优点** | 标准 SQL、Connector 多、跨源联查；加 Worker 扩读 | 列存+向量化极快；压缩高；单表/宽表聚合顶尖；部署相对轻 | 导入+查询一体；高并发点查/报表；Join/更新相对完善；MySQL 协议易接 BI |
| **缺点** | **无自有存储**；复杂查询吃内存；运维/调优门槛高 | **Join/事务弱**；高并发短查询不如 MPP；更新删除靠 mutation；生态偏分析 | 运维/内存成本高于「纯引擎」；相对 ClickHouse 极致扫表略逊（场景依赖） |
| **写入** | 不负责写仓（写靠 Spark/Flink） | 批量/准实时插入强；极高并发小事务弱 | Stream Load / Routine Load 强，偏实时入仓 |
| **典型角色** | 湖仓 **Ad-hoc / 联邦** | **日志/指标/宽表 OLAP** | **Serving 层**（看板、明细、用户侧查询） |

### 3. 口述选型

```text
跨源即席、不想搬数     → Trino/Presto
埋点/日志/宽表秒级聚合 → ClickHouse
高并发报表、实时数仓服务 → Doris / StarRocks
离线重加工（ETL）       → Spark（不是这三个）
```

**30 秒收口：**  
「Presto/Trino 是查询引擎不存数，擅长联邦；ClickHouse 是列存 OLAP，扫表聚合极致；Doris/StarRocks 是实时数仓服务层，导入查询一体、并发和 Join 更均衡。」

---

## 二、ClickHouse 适用场景（与不适用）

### 适合

| 场景 | 原因 |
|------|------|
| **大规模分析 / 宽表聚合** | 列存只读相关列 + 压缩 + 向量化 |
| **实时/近实时看板** | 插入后秒～分钟级可查；并发读可接受 |
| **日志 / 埋点 / 行为明细** | 追加写为主，按天分区 + TTL |
| **时序 / 指标** | `PARTITION BY` 时间、物化视图、简单窗口 |
| **百亿级批量入仓后分析** | 高吞吐 INSERT；配合 Kafka 引擎 / 攒批 |

### 不适合 / 慎用

| 场景 | 原因 |
|------|------|
| **OLTP 小事务** | 无完整行级事务、点更新贵 |
| **高频随机点查主键** | 稀疏索引按 granule，非 B+Tree |
| **复杂多表强一致 Join** | Join 弱于 MPP 数仓；宜宽表/预聚合 |
| **大量 UPDATE/DELETE** | mutation 异步、重 merge |
| **极高并发短 SQL（像 MySQL）** | 更偏向 Doris/StarRocks 或加缓存 |

**注意：** 「写入弱」是相对 OLTP 说的；**批量/准实时追加写** 是 ClickHouse 强项。面试别说成「不能写」。

**关联：** MergeTree、稀疏索引、part 合并见 `DB-Clickhouse.md`。

---

## 三、其他高频面试题

### 1. OLTP vs OLAP？

| | OLTP | OLAP |
|--|------|------|
| 目标 | 交易、增删改查 | 聚合、报表、分析 |
| 模型 | 范式、多表 | 宽表、星型/雪花、预聚合 |
| 引擎例 | MySQL、TiDB、PostgreSQL | ClickHouse、Doris、Hive+Spark |
| 特征 | 低延迟、事务、行级 | 高吞吐扫、列存、最终一致可接受 |

### 2. 行存 vs 列存？

- **行存**：整行连续，适合点查/更新。  
- **列存**：同列连续，适合 `SUM/COUNT/GROUP BY`，压缩好、IO 少。  
- 代价：还原整行、更新单行成本高。

### 3. 数仓分层（口述）

```text
ODS  原始贴源
DWD  明细清洗、统一维度
DWS  主题轻度汇总
ADS  应用层指标 / 报表
DIM  维度表
```

实时常另有 **DWD/DWS 流表**（Flink + Paimon/Kafka）。

### 4. Hive / Spark / Flink / Trino / CH / Doris 怎么分工？

| 组件 | 职责 |
|------|------|
| **Hive** | 元数据 + 表管理（常 + Iceberg）；批 SQL 入口 |
| **Spark** | 离线重计算、ETL、复杂批处理 |
| **Flink** | 实时流、CDC、窗口、入湖 |
| **Trino** | 湖仓联邦即席，跨源 SQL |
| **ClickHouse** | 分析型明细/指标仓，极致扫表 |
| **Doris/SR** | 面向业务的实时查询服务 |

### 5. 湖仓一体是什么？和传统数仓区别？

- **数据湖**：对象存储存原始/半结构化，灵活便宜，治理弱。  
- **数仓**：结构化建模、治理强，历史偏封闭格式。  
- **湖仓**：Iceberg/Hudi/Paimon 等 **开放表格式** 在湖上提供 ACID、快照、时间旅行；Spark/Flink/Trino 同表读写。

### 6. Spark 和 Flink 怎么选？

| | Spark | Flink |
|--|-------|-------|
| 强项 | 批、交互、机器学习、大规模 shuffle | 流、低延迟、状态、Exactly-Once 链路 |
| 批流 | Structured Streaming（微批为主） | 流批统一，真流处理 |
| 选型 | 离线日批、大表 Join | 实时指标、CDC、CEP |

可并存：离线 Spark，实时 Flink，表格式统一。

### 7. Doris 和 StarRocks 区别？（简答）

同源演进；StarRocks 强化向量化、CBO、物化视图、湖仓外表等。面试：**同属 MPP 实时数仓，选型看团队生态与压测**，不必死磕品牌。

### 8. 数据倾斜怎么处理？（批处理）

- 现象：某 reduce/task 特别慢。  
- 手段：加盐打散、两阶段聚合、倾斜 key 单独处理、调整并行度、小表广播 Join、过滤脏数据。  
- Spark：AQE、倾斜 Join 提示等。

### 9. 小文件问题？

- HDFS/对象存储小文件多 → NameNode/元数据压力、作业启动慢。  
- 治理：合并（Spark coalesce/repartition、Compaction）、合理分区粒度、Iceberg/Paimon 定期 compact。

### 10. 实时数仓常见架构？

```text
业务库 → Flink CDC → Kafka → Flink →
  ├─ Paimon/Iceberg（湖）
  └─ Doris/ClickHouse（Serving）
离线：Spark 补数 / 对账
查询：Trino 联邦湖表 + Doris 扛看板
```

### 11. Lambda vs Kappa？

| | Lambda | Kappa |
|--|--------|-------|
| 结构 | 批层 + 速度层 + 服务层合并 | 以流为主，重放补历史 |
| 优点 | 批可纠错、成熟 | 一套代码，运维简单 |
| 缺点 | 两套逻辑易不一致 | 重放成本、状态复杂度 |

现多 **湖仓 + 流批一体**，弱化教条对立。

### 12. 血缘 / 质量 / 权限各解决什么？

| 能力 | 解决 |
|------|------|
| **血缘** | 改表/坏数影响谁；追责上下游 |
| **质量** | 空值、重复、波动、延迟分区 |
| **权限** | 表/列/行谁能看；审计 |

平台组件见下文 OpenMetadata、Ranger 等。

### 13. 即席查询慢怎么排查？

1. 引擎选错（大表 Join 丢 Trino 扫湖 vs 预聚合进 Doris）。  
2. 分区裁剪失效、选错排序键（CH）。  
3. 小文件、无统计信息、CBO 失效。  
4. 数据倾斜、内存 spill。  
5. 并发打满 → 队列/限流/物化视图。

### 14. 百亿级写入分析库注意点？

- **禁止逐条 INSERT**；Kafka 攒批 / Stream Load / 官方批量协议。  
- 控制 part/分片膨胀（CH merge、Doris 导入并行）。  
- 主键/排序键服务查询；TTL 控生命周期。  
- 详见 `MQ-Kafka-Pulsar.md` 百亿写 CH、`DB-Clickhouse.md`。

### 15. Trino 和 Spark SQL 区别？

| | Trino | Spark SQL |
|--|-------|-----------|
| 场景 | 交互式即席、秒～分钟 | 批处理、分钟～小时 |
| 模型 | MPP 管道，偏内存 | DAG + shuffle，可落盘 |
| 失败 | 查询失败常整查重跑 | Stage 可重试 |
| 适合 | Ad-hoc、联邦 | ETL、大 Join、重算 |

### 16. 维度表变更、事实表怎么关联？

- **拉链表 / SCD2**：维度历史版本 + 生效时间。  
- **快照维**：按天全量维表，事实按分区日期 Join。  
- 实时：维表广播 / Redis 旁路，注意延迟与一致性。

---

## 四、速记

| 题 | 一句 |
|----|------|
| 三引擎 | Trino 联邦；CH 列存扫表；Doris 实时服务 |
| CH 场景 | 日志埋点宽表看板；非 OLTP |
| 湖仓 | Iceberg/Paimon + 多引擎同表 |
| 批流 | Spark 批；Flink 流 |
| 分层 | ODS→DWD→DWS→ADS |

---

# 自建离线大数据平台技术方案（对标 DataWorks / MaxCompute）

> 目标：企业内自建 **数据采集 → 开发调度 → 数仓建模 → 资产治理 → 质量权限 → 查询服务** 全链路。  
> 下面按 **2024～2026 国内主流开源选型** 写；三年前常见的 DolphinScheduler、Atlas、DataX **仍可用，但角色有变化**。

## 一、和云产品怎么对应？

| 阿里云 DataWorks 能力 | 自建常见落点 |
|----------------------|--------------|
| 数据集成 | SeaTunnel / DataX / Flink CDC |
| 数据开发（SQL/脚本） | Hive/Spark SQL + DolphinScheduler / Airflow |
| 任务调度 | **DolphinScheduler**（国内）/ **Airflow**（国际） |
| 数据地图 / 元数据 | **OpenMetadata** / **DataHub** |
| 数据血缘 | OpenMetadata / DataHub / Atlas（存量） |
| 数据质量 | Griffin / Great Expectations / OpenMetadata Tests |
| 数据权限 | **Apache Ranger** + LDAP/Kerberos |
| 数仓 / 计算 | Hive + Spark；湖仓 Iceberg/Hudi/**Paimon** |
| 即席查询 / OLAP | Trino/Presto、**StarRocks/Doris**、ClickHouse |
| 资源队列 | YARN / **Kubernetes** + 队列隔离 |

ODPS（MaxCompute）是 **闭源托管数仓**；自建一般用 **Hive/Iceberg + Spark/Flink + OLAP 引擎** 组合替代，用调度 + 元数据平台拼出「DataWorks 体验」。

---

## 二、推荐总体架构（分层）

```text
┌─────────────────────────────────────────────────────────────┐
│  门户：数据地图 / 血缘 / 质量报告 / 权限申请（OpenMetadata 等） │
├─────────────────────────────────────────────────────────────┤
│  调度编排：DolphinScheduler / Airflow（依赖、补数、告警）       │
├─────────────────────────────────────────────────────────────┤
│  数据开发：Spark SQL / Hive SQL / Flink SQL / dbt（可选）     │
├─────────────────────────────────────────────────────────────┤
│  数据集成：SeaTunnel（主）+ DataX（存量）+ Flink CDC（实时）    │
├─────────────────────────────────────────────────────────────┤
│  存储计算：HDFS/OSS + Iceberg/Hudi/Paimon + Spark/Flink       │
├─────────────────────────────────────────────────────────────┤
│  查询服务：Trino + StarRocks/Doris（报表/Ad-hoc）             │
├─────────────────────────────────────────────────────────────┤
│  安全：Ranger（表/列/行级）+ 审计日志 + 密钥管理               │
└─────────────────────────────────────────────────────────────┘
```

**两条常见路线：**

| 路线 | 特点 |
|------|------|
| **Hadoop 存量升级** | Hive + YARN + Ranger + Atlas（可保留）+ DataX + DolphinScheduler |
| **湖仓 + 云原生（新平台首选）** | Iceberg/Paimon + K8s + SeaTunnel + OpenMetadata + DolphinScheduler/Airflow |

---

## 三、三年前热门组件，现在什么情况？

| 组件 | 当年角色 | 2024～2026 现状 | 建议 |
|------|----------|-----------------|------|
| **DolphinScheduler** | 任务调度 | **仍是国内首选之一**，Apache 顶级项目，3.x 可视化、多租户、Spark/Flink/SeaTunnel 节点丰富 | **继续用**，新平台优先 |
| **DataX** | 离线同步 | **仍大量在用**，稳定、运维熟；阿里维护，偏 **离线批量** | 存量保留；**新项目更倾向 SeaTunnel** |
| **Apache Atlas** | 元数据+血缘 | **仍在 Hadoop 体系**，但社区热度不如 OpenMetadata/DataHub；与 Hive/Ranger 集成成熟 | 老集群可留；**新建设选 OpenMetadata/DataHub** |
| **Waterdrop** | ETL | 已演进为 **Apache SeaTunnel**（**顶级项目**） | 用 SeaTunnel，勿新开 Waterdrop |
| **Oozie / Azkaban** | 调度 | 逐步被 DS / Airflow 替代 | 仅维护遗留 |
| **Sqoop** | DB↔Hadoop | 基本退役 | Flink CDC / SeaTunnel |

**结论：** DolphinScheduler **依然热门**；DataX **没死但不再是唯一答案**；Atlas **被新一代元数据平台挤压**；集成层 **SeaTunnel 是当下增量主流**。

---

## 四、分模块选型（当前主流）

### 1. 数据同步 / 集成

| 工具 | 适用 | 说明 |
|------|------|------|
| **Apache SeaTunnel** | 批+流、CDC、多源同步 | 160+ 连接器；可跑 Zeta/Flink/Spark；**新项目首选** |
| **DataX** | 离线全量/增量（DB→Hive/HDFS） | 配置 JSON，运维简单，国内案例多 |
| **Flink CDC** | 实时入湖/入仓 | MySQL/Postgres 等 binlog → Kafka/Iceberg/Paimon |
| **Airbyte** | 国际化、SaaS 连接器多 | 国外常见；国内政企更常 SeaTunnel+DataX |

面试答：**离线批同步 DataX 仍常见；要 CDC、流批一体、入湖，用 SeaTunnel + Flink CDC。**

### 2. 数据开发

- **SQL 开发**：Hive SQL、Spark SQL（离线）；Flink SQL（实时/入湖）。  
- **IDE**：DolphinScheduler 内置脚本节点；或 **Apache Zeppelin**、DataSphere Studio（部分公司）、自研 Web SQL。  
- **建模规范**：分层 ODS → DWD → DWS → ADS；表格式 **Iceberg / Apache Paimon**（Flink 友好）或 Hudi。  
- **转换工具（可选）**：**dbt**（在 Trino/Spark 上做 transform），国外 DataOps 常见。

开发产物 = **SQL/脚本 + 调度工作流 + 表 DDL**，由 Git 做版本管理（平台侧 DS 3.x 也支持工作流版本）。

### 3. 任务调度（编排）

| | DolphinScheduler | Airflow |
|--|------------------|---------|
| 国内采用 | 极高 | 外企/云原生团队多 |
| UI | 国产友好、运维面板全 | 强生态、DAG 即代码 |
| 集成 | Spark/Flink/SeaTunnel/Shell/SQL | 插件极多 |
| 适用 | 离线数仓日批、依赖复杂 | 混合云、Python 重度 |

**离线平台**：**DolphinScheduler + Spark SQL 节点 + SeaTunnel 任务** 是常见组合。

### 4. 数据地图（元数据目录）

| 工具 | 特点 |
|------|------|
| **OpenMetadata** | **当前很热**：统一 Catalog、搜索、血缘、质量测试、RBAC；连接器持续增加 |
| **DataHub** | LinkedIn 开源，** ingestion 框架强**，血缘/搜索体验好，大厂案例多 |
| **Apache Atlas** | Hadoop 原生，Hive/Ranger 集成深；**新项目少选** |

数据地图要解决：**库表字段说明、负责人、标签、分区、存储量、最近更新时间、去哪查**。

### 5. 数据血缘

血缘 = **表/字段从哪来、经过哪些任务、影响到哪些下游**。

| 实现方式 | 说明 |
|----------|------|
| **OpenMetadata / DataHub** | 解析 SQL、调度任务、JDBC 元数据，**平台级血缘图**（首选） |
| **Atlas** | Hook 监听 Hive/Spark，Hadoop 体系成熟 |
| **Marquez + OpenLineage** | 开放血缘标准，Airflow/Spark/Flink 可发 lineage 事件 |
| **自研** | 解析调度 DAG + SQL parser（成本高） |

实践：**调度（DS）+ 元数据（OpenMetadata）+ Spark/Flink SQL 血缘插件** 打通。

### 6. 数据质量

| 工具 | 说明 |
|------|------|
| **Apache Griffin** | Hadoop 时代质量框架，**仍可用但热度下降** |
| **Great Expectations** | Python 规则、报告好看，偏分析团队 |
| **Deequ** | Spark 上质量检查（Amazon） |
| **OpenMetadata Data Quality** | 与元数据一体，**规则+调度+告警** 统一 |
| **自研 DQC** | 空值率、重复、波动、主键唯一；结果写 MySQL + 钉钉告警 |

常见规则：完整性、唯一性、及时性（分区是否到）、一致性（与业务库对账）、波动监控。

### 7. 数据权限与安全

| 能力 | 方案 |
|------|------|
| 认证 | LDAP / AD / **Kerberos**（Hadoop 集群）/ OIDC |
| 授权 | **Apache Ranger**（Hive/Trino/Spark/HDFS 表列级策略） |
| 脱敏 | Ranger 掩码 / 自研 UDF / 查询层脱敏 |
| 审计 | Ranger Audit + 调度/查询日志入 ES |
| 平台 RBAC | OpenMetadata / DS 多租户项目权限 |

**行级权限** 较难，常靠视图、维度表过滤或 OLAP 引擎自带（StarRocks/Doris）。

### 8. 存储与数仓计算（离线核心）

| 层 | 主流 |
|----|------|
| 文件/对象 | HDFS、**S3/OSS/MinIO** |
| 表格式 | **Apache Iceberg**、**Paimon**、Hudi（三选一或组合） |
| 离线计算 | **Spark 3.x**（批）、Hive on Spark |
| 实时入湖 | Flink + Paimon/Iceberg |
| SQL 网关 | **Apache Kyuubi**（多租户 Spark SQL 服务） |
| OLAP 服务 | **StarRocks / Doris**（MySQL 协议，报表快） |

---

## 五、一套可落地的「开源 DataWorks 精简版」组合

**适合：国内中大型公司自建离线为主、实时为辅**

```text
集成：SeaTunnel（批/CDC）+ DataX（兼容老任务）
调度：DolphinScheduler 3.x
计算：Spark on YARN/K8s + Hive/Iceberg
实时：Flink CDC → Paimon/Kafka
元数据+地图+血缘：OpenMetadata（或 DataHub）
质量：OpenMetadata Tests + 自研对账脚本
权限：Ranger + LDAP
查询：Trino（联邦）+ StarRocks（Serving）
监控：Prometheus + Grafana + DS/任务告警
```

**实施顺序建议：**

1. 存储 + Spark/Hive 跑通 ODS  
2. SeaTunnel/DataX 入仓 + DolphinScheduler 日批  
3. 上 OpenMetadata 做资产与血缘  
4. Ranger 权限 + 质量规则  
5. StarRocks/Doris 服务层 + Trino 即席  

---

## 六、与仅「Hadoop 三件套」的差异

| 只有 Hive+Spark+YARN | 完整数据平台 |
|----------------------|--------------|
| 能跑 SQL | 能 **治理、发现、追责** |
| 人工记表含义 | **数据地图** 搜索 |
| 出问题不知影响面 | **血缘** 看上下游 |
| 同步脚本散落 | **集成平台** 统一监控 |
| 权限靠 hdfs chmod | **Ranger** 表列级 |
| 数据坏了事后发现 | **质量** 前置拦截 |

---

## 七、面试 / 方案评审怎么说？

**问：三年前 DolphinScheduler、Atlas、DataX 还能用吗？**  
能。DS 仍是国内调度主力；DataX 离线同步仍多；Atlas 适合 Hadoop 存量。新平台建议 **SeaTunnel 补集成、OpenMetadata/DataHub 补元数据血缘**，别只堆老组件。

**问：和 DataWorks 最大差距？**  
云产品 **托管、开箱、与 MaxCompute 深度集成**；自建要强在 **运维、标准统一、组件联调**，用 OpenMetadata + DS + Ranger 缩小「体验差」。

**问：实时和离线要不要两套？**  
调度可统一（DS 支持 Flink）；存储推荐 **湖仓一体**（Iceberg/Paimon），离线 Spark 与实时 Flink 同表。

**30 秒收口：**  
「自建离线平台：SeaTunnel/DataX 集成，DolphinScheduler 调度，Spark+Iceberg 计算，OpenMetadata 做地图血缘，Ranger 管权限，StarRocks 做查询加速；Atlas/Griffin 可维护存量，新建设优先 OpenMetadata + SeaTunnel。」

---

## 八、速记表

| 模块 | 首选（2025～2026） | 存量/备选 |
|------|-------------------|-----------|
| 调度 | DolphinScheduler / Airflow | Oozie |
| 同步 | SeaTunnel、Flink CDC | DataX、Sqoop |
| 元数据+地图+血缘 | OpenMetadata、DataHub | Atlas |
| 质量 | OpenMetadata、Deequ、自研 DQC | Griffin |
| 权限 | Ranger | Sentry（已废弃） |
| 湖仓表 | Iceberg、Paimon | Hive 外表 |
| OLAP | StarRocks、Doris | ClickHouse、Presto |
| 开发 | Spark SQL、Flink SQL | dbt（可选） |
