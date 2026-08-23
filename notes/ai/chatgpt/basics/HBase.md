# HBase 是什么？适合什么场景？

Apache HBase 是建立在 **HDFS** 之上的分布式 **宽列（Wide-Column）NoSQL**，面向海量数据的随机读写与扫描，典型场景：用户画像、订单流水、监控指标、日志明细、时序类大表。

| 适合 | 不适合 |
|------|--------|
| 百亿/千亿行、TB～PB 级 | 复杂 SQL、多表 JOIN |
| 按 RowKey 点查、范围扫描 | 高频小事务、强 ACID |
| 稀疏列、列可动态增 | 频繁行级 UPDATE/DELETE |
| 写多读少、追加写为主 | 纯全文检索（更偏 ES） |

和 MySQL：HBase 换 **横向扩展 + 顺序写 HFile**，牺牲关系模型与事务。

---

## 架构：各组件干什么？

```text
Client
  ↓
ZooKeeper（集群协调：Master 选举、Region 元数据入口等）
  ↓
HMaster（管理：建删表、Region 分配、负载均衡、故障恢复协调）
  ↓
RegionServer × N（真正存数据、处理读写）
  ↓
HDFS（HFile、WAL 等文件持久化）
```

| 组件 | 职责 |
|------|------|
| **HMaster** | 表 DDL、Region 分配到 RS、宕机 Region 重新上线；**不处理客户端读写**（2.x 可多 Master 主备） |
| **RegionServer** | 托管多个 **Region**；写 MemStore、刷 HFile、读 BlockCache、执行 Compaction |
| **Region** | 表按 RowKey 范围切分的**水平分片**，是负载均衡与扩展的基本单位 |
| **ZooKeeper** | Master 选举、`.META.` 表位置、RS 心跳与协调 |
| **HDFS** | 底层存储；多副本容错 |

**扩展方式**：加 RegionServer；Region 随数据量 **Split** 分裂，由 Master 重新分布——**按 RowKey 范围分片**，不是 Redis 那种一致性哈希槽。

---

## 数据模型（面试必画）

逻辑结构：

```text
Table
 └─ Row（由 RowKey 唯一标识）
     └─ Column Family（列族，建表时定义，数量宜少）
         └─ Column Qualifier（列名，可动态）
             └─ Cell = { value, timestamp }   # 多版本
```

| 概念 | 说明 |
|------|------|
| RowKey | 行唯一键，**字典序**排序，决定数据落在哪个 Region |
| Column Family | 物理存储单元；列族不同 → 不同 HFile；一般 1～3 个 |
| Column Qualifier | 列标识，无需预建全部列 |
| Timestamp | 多版本时间戳；默认保留最新若干版本（`VERSIONS`） |
| Cell | 最小存储单元：RowKey + CF + CQ + TS → Value |

特点：

- **无固定 Schema**：不同行可有不同列（稀疏宽表）。
- **列族存储**：同一列族数据存一起，**不是** ClickHouse 那种纯列存分析引擎；常说「面向列族」而非「列式 OLAP」。
- **仅 RowKey 有序**：表全局按 RowKey 字典序；列族内按行存，**没有**面向任意列的全局二级索引（除非自建协处理器/二级索引方案）。

---

## 读写路径（高频）

### 写路径

```text
Client → RegionServer
  → 写 WAL（预写日志，顺序追加，崩溃恢复）
  → 写 MemStore（内存有序结构）
  → MemStore 达阈值 → Flush 成 HFile（落 HDFS，不可变）
  → 小 HFile 多了 → Compaction 合并成大 HFile
```

- **WAL**：先日志后内存，RS 宕机可从 WAL 重放未刷盘数据。
- **MemStore**：按 RowKey 排序；Flush 生成新 HFile。
- **HFile**：磁盘上的有序键值文件；读多写少，靠合并减少文件数。

### 读路径

```text
Client → 先查 META 表定位 RowKey 所在 Region/RS
  → RegionServer
  → BlockCache（读缓存）命中？
  → HFile（可能多个）+ MemStore 合并视图
  → Bloom Filter 跳过不含该 RowKey 的 HFile
  → 二分/索引块定位 Data Block → 返回 Cell
```

- **BlockCache**：缓存 HFile 的 Data Block，热点读加速。
- **Bloom Filter**：每个 StoreFile 布隆过滤器，**快速判断 RowKey 是否可能存在**，减少无效 IO。
- 一次读可能要合并 **多个 HFile + MemStore**（版本多的原因）。

### Compaction

| 类型 | 作用 |
|------|------|
| Minor | 合并少量小 HFile，减少文件数 |
| Major | 合并某列族全部 HFile，清理删除标记、过期版本；IO 重，常低峰调度 |

Compaction 类似 LSM 的 **merge**：用后台合并换写入吞吐，但 Major 时易打满磁盘 IO。

---

## 为什么能存海量数据还快？

1. **水平分片**：Region 按 RowKey 范围分布到多台 RS，并行读写。
2. **LSM 式写入**：顺序写 WAL + 批量刷 HFile，避免随机写磁盘。
3. **稀疏存储**：空列不占空间，适合宽表稀疏场景。
4. **按 RowKey 有序**：范围扫描连续读 HFile；配合 **BlockCache + Bloom** 加速点查。
5. **列族隔离**：查询只读涉及列族的 HFile（仍要扫该族内行，但不必读其他族）。
6. **压缩**：HFile 支持 SNAPPY/LZ4/GZ 等，减磁盘与网络。

**不是**：全表任意列都有索引；复杂分析聚合不如 ClickHouse/Spark SQL。

---

## RowKey 设计（核心考点）

原则：**散列、有序、短、符合访问模式**。

| 反例 | 问题 |
|------|------|
| 单调递增（时间戳前缀） | 所有新写打在同一 Region → **热点** |
| 过长 RowKey | 索引与缓存浪费 |
| 与查询模式无关 | 点查、范围扫都慢 |

常见技巧：

- **反转时间戳**、**加盐（前缀随机桶）**、**哈希前缀 + 业务键** 打散热点。
- 把 **最常过滤的维度** 放在 RowKey 前缀，支持高效 **Scan**（如 `userId + reverseTimestamp`）。

查询模式决定 RowKey，**先定访问模式再建表**。

---

## 按 RowKey 查 vs 按列查，效率为何不同？

| | 按 RowKey（Get/带前缀 Scan） | 按列值查（无 RowKey） |
|--|------------------------------|------------------------|
| 定位 | META → Region → Bloom → HFile 内按 RowKey 有序定位 | **无原生全局列索引**，只能全表/大范围 Scan |
| IO | 少量 HFile + 精准块读 | 扫大量 HFile，过滤列值 |
| 结论 | **主路径，快** | **极慢**，生产应避免 |

HBase **为 RowKey 访问优化**；按列查要靠：

- 业务侧 **二级索引**（如 Phoenix、协处理器建索引表，写放大与一致性要评估）
- 或同步到 **ES/Hive/ClickHouse** 做检索分析

之前说「列族之间按列存储、遍历列族」容易误导；准确说法是：**没有 RowKey 就无法利用有序性与 Bloom，只能扫描。**

---

## 水平扩展用什么算法？（纠正：不是一致性哈希）

| 系统 | 分片方式 |
|------|----------|
| **HBase** | RowKey **范围** → Region；过大则 **Split**；Master **负载均衡** 迁移 Region |
| Redis Cluster | 16384 **哈希槽** + 一致性哈希思想 |
| Elasticsearch | 文档 `_id` 路由到 **Shard**（`hash(routing) % num_shards`） |

HBase 扩展：

1. 加 RegionServer  
2. 大 Region 分裂成两个子 Region（按中间 RowKey）  
3. Master 把 Region 迁到空闲 RS  
4. 客户端通过 `.META.` / `hbase:meta` 查 RowKey 落在哪  

**热点 Region** 比「哈希不均」更常见——RowKey 设计问题，不是没用到一致性哈希。

与 ES 共同点：都靠 **分片 + 副本 + 协调服务（ZK）+ 自动迁移** 做水平扩展；**分片键算法不同**。

---

## 一致性：强一致还是最终一致？

- **单行 RowKey 级别**：同一 RowKey 的读写，在单 Region 内可视为 **强一致**（单 RS 串行处理该 Region）。
- **跨行/跨 Region**：无跨行事务（除非 Phoenix 等扩展）；**不是**关系库 ACID。
- **多副本**：HDFS 三副本；HBase **Replication** 跨集群是异步，**最终一致**。

面试答：**单行强一致，跨行弱/无事务，跨集群复制最终一致。**

---

## 容灾、备份与恢复

| 手段 | 说明 |
|------|------|
| **HDFS 多副本** | 节点/磁盘故障，块自动恢复 |
| **WAL + MemStore 恢复** | RS 宕机：未刷盘数据从 WAL 重放；Region 迁到其他 RS |
| **Replication** | 主集群 → 备集群异步复制，容灾切换 |
| **Snapshot** | 表级快照（HDFS 上），用于备份、迁移、恢复 |
| **Export/Import、CopyTable** | 数据导出导入、集群间拷贝 |
| **MOB / 冷热分离** | 大对象、冷数据策略（按版本） |

### WAL 恢复流程（口述）

1. 写请求先 append **WAL** 再写 MemStore。  
2. RS 故障，Region 由其他 RS 接管。  
3. 新 RS **重放 WAL** 中未持久化到 HFile 的 edits。  
4. RS 恢复后也可能回放本地残留 WAL。  

与 HDFS 关系：HFile/WAL 都是 HDFS 上的文件；**HBase 管逻辑表，HDFS 管块副本**。

---

## HDFS 里的数据是关系型吗？

**不是。** HBase 是 **宽列、稀疏、无模式** 的 NoSQL：

- 无 SQL 表连接；无固定列集。
- 按 **RowKey + 列族 + 列限定符 + 时间戳** 定位 Cell。
- 底层 HFile 是 KV 有序文件，不是 MySQL 那种行存页。

---

## 与相近技术对比

| | HBase | MySQL | ClickHouse | Elasticsearch | HDFS |
|--|-------|-------|------------|---------------|------|
| 模型 | 宽列 KV | 关系行存 | 列存 OLAP | 文档+倒排 | 文件系统 |
| 查询 | Get/Scan | SQL | SQL 聚合 | 全文/检索 | 读文件 |
| 扩展 | Region 水平拆 | 分库分表 | Shard | Shard | 加 DataNode |
| 事务 | 弱 | 强 | 弱 | 无 | 无 |
| 典型 | 海量明细、画像 | 交易 OLTP | 报表分析 | 搜索日志 | 存大文件 |

---

## 常见面试坑与排障

| 现象 | 可能原因 |
|------|----------|
| 写入抖动 | Region 热点、Split 频繁、MemStore 过大、Compaction 风暴 |
| 读延迟高 | 过多 HFile（Compaction 跟不上）、BlockCache 不够、RowKey 设计差导致大范围 Scan |
| Region 不均 | RowKey 单调递增、加盐不合理 |
| 磁盘涨 | 版本过多、删除未 Major Compact、TTL 未配 |
| Full GC | 大 Scan 返回过多数据、堆外/缓存配置不当 |

调优方向：RowKey、列族数量、`TTL`/`VERSIONS`、Compaction 策略、预分区（建表时指定 Region 边界避免单 Region 过大）、批量写 `BufferedMutator`。

---

## 口述题：HBase 读写流程

**写**：Client → 定位 Region → RS 写 WAL → MemStore → 触发 Flush → HFile → 后台 Compaction。

**读**：Client → `hbase:meta` 定位 Region → RS → BlockCache / Bloom → HFile + MemStore 合并 → 返回 Cell。

---

## 面试速记

| 主题 | 一句话 |
|------|--------|
| 架构 | Master 管 Region；RS 存数据；ZK 协调；HDFS 落盘 |
| 模型 | RowKey + 列族 + 列 + 时间戳；仅 RowKey 全局有序 |
| 写 | WAL → MemStore → HFile（LSM 思路） |
| 读 | Bloom + BlockCache + 多 HFile 合并 |
| RowKey | 决定 Region 与热点；设计比调参重要 |
| 扩展 | RowKey 范围 Region + Split，非一致性哈希 |
| 列查 | 无 RowKey 只能扫；用 ES/二级索引 |
| 一致 | 单行强一致；跨行弱；复制最终一致 |
| 容灾 | HDFS 副本 + WAL + Snapshot + Replication |
