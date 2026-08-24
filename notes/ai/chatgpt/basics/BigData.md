# presto、clickhouse、doris有哪些优缺点？
Presto、ClickHouse和Doris都是在大数据领域中使用的分布式数据处理和查询引擎，它们具有一些共同点和不同之处。下面是它们的优缺点：

Presto:

优点：

- 高性能：Presto具有分布式架构和内存计算能力，能够快速处理大规模数据，并支持低延迟的交互式查询。
- SQL兼容性：Presto支持标准SQL语法，易于学习和使用，并且与大多数SQL工具和应用程序兼容。
- 弹性扩展：Presto可以通过添加更多的节点来扩展集群，以满足不断增长的数据和查询负载。

缺点：

- 配置和维护复杂：Presto的配置和维护相对较为复杂，需要专业知识和经验来优化和管理集群。
- 存储依赖：Presto本身不提供存储功能，需要依赖外部存储系统（如HDFS、S3等）来存储数据。

ClickHouse:

优点：

- 高吞吐量：ClickHouse基于列式存储和压缩技术，能够以高吞吐量处理海量数据。
- 实时查询：ClickHouse支持实时数据插入和快速查询，适用于需要快速分析实时数据的场景。
- 易于部署和使用：ClickHouse具有简单的部署和使用方式，可以快速搭建分布式集群。

缺点：

- 缺少完整的生态系统：相比其他一些大数据处理引擎，ClickHouse的周边工具和生态系统相对较少，可能需要自行开发或集成其他组件来满足特定需求。
- 查询灵活性有限：ClickHouse在一些高级查询操作上的支持有限，相对于Presto和Doris来说，功能上略显不足。

Doris（原名为Palo）:

优点：

- 实时数据写入：Doris支持实时数据写入和查询，能够快速响应实时业务需求。
- 数据可靠性：Doris具有高可靠性和冗余机制，可确保数据的持久性和可用性。

缺点：

- 学习曲线较陡峭：相对于Presto和ClickHouse来说，Doris相对较新，文档和资源相对有限，学习成本较高。
- 功能相对较少：Doris在某些高级功能上的支持可能还不如Presto和ClickHouse丰富。

# clickhouse适用在哪些场景？

ClickHouse 是一个用于联机分析处理（OLAP）的列式数据库管理系统。它在以下场景中非常适用：

- 大规模数据分析：ClickHouse 在处理海量数据时表现出色。它的列式存储和高度压缩的特性使得它能够快速地执行复杂的分析查询，包括聚合、过滤、排序和连接操作。

- 实时数据仪表盘：由于 ClickHouse 的高查询性能，它非常适合用于实时数据仪表盘或监控系统。它可以处理大量的并发查询，并且能够在秒级内提供最新的数据分析结果。

- 日志处理：ClickHouse 可以有效地处理大量的日志数据。它的高吞吐量和并行查询能力使得它成为处理和分析日志数据的理想选择。

- 时间序列数据分析：ClickHouse 提供了一些用于时间序列数据分析的专用功能，例如支持按时间范围进行数据分区和进行时间窗口函数运算等。这使得它成为处理传感器数据、物联网数据和金融时间序列数据的好选择。

需要注意的是，ClickHouse 在写入性能方面相对较弱，更适合于大规模数据的批量写入和低频率的实时写入。因此，在高写入频率和事务处理方面，ClickHouse 可能不是最佳选择。

综上所述，ClickHouse 是一个在大规模数据分析和实时查询方面表现出色的列式数据库管理系统，特别适用于需要高性能和快速查询的场景。

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
