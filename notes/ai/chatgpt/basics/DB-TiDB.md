# TiDB 面试题

> TiDB = **开源分布式 NewSQL**，兼容 MySQL 协议；**计算存储分离**（TiDB / TiKV / PD），可选 **TiFlash** 做 HTAP。  
> 定位：想摆脱 MySQL 分库分表，又要强一致 OLTP + 一定分析能力。

---

## TiDB 是什么？适合什么场景？

| 适合 | 不适合 / 慎用 |
|------|----------------|
| 超大库、单机 MySQL 撑不住 | 超简单小库（杀鸡用牛刀） |
| 不想业务层分库分表 | 强依赖 MySQL 冷门特性/插件 |
| 分布式事务、水平扩展 | 极致单机延迟（多一跳网络） |
| HTAP（TiFlash）实时分析 | 纯离线数仓（更宜 Spark/ClickHouse） |

一句话：**MySQL 兼容的分布式数据库，存算分离，Region + Raft 做分片与高可用。**

---

## 架构：三大核心组件

```text
App / MySQL 客户端
        ↓  MySQL 协议
   ┌─────────────┐
   │  TiDB Server │  无状态 SQL 层：解析、优化、分布式执行
   └──────┬──────┘
          │ 问元数据 / 要 TSO
   ┌──────▼──────┐
   │     PD      │  Placement Driver：调度、TSO、Region 元数据
   └──────┬──────┘
          │
   ┌──────▼──────┐     ┌──────────┐
   │    TiKV     │ ←── │ TiFlash  │（可选，列存副本，OLAP）
   │ 行存 + Raft │     └──────────┘
   └─────────────┘
```

| 组件 | 职责 | 是否存数据 |
|------|------|------------|
| **TiDB Server** | SQL、优化器、执行器；无状态，可水平扩 | 否 |
| **PD** | 集群大脑：Region 位置、负载调度、分配 **TSO**、配置 | 元数据 |
| **TiKV** | KV 存储，Region 分片，**Raft** 多副本 | 是（行存） |
| **TiFlash** | Raft learner 列存副本，加速分析 | 是（列存） |

**数据流口述：** 客户端 → TiDB 解析优化 → 向 PD 取 Region 路由与 TSO → 读写 TiKV；分析查询可走 TiFlash。

---

## Region、Raft、副本

### Region

- TiKV 把数据按 **Key 范围**切成 Region（默认约 96MB 量级，可调）。  
- Region 是调度、复制、迁移的基本单位。  
- 过大 → **Split**；过小或热点 → **Merge / 打散**。

### Raft

- 每个 Region 一组 Raft：Leader 处理读写（读也可 follower，看配置），Follower 复制日志。  
- Leader 挂 → 自动选新 Leader，对应用透明。  
- **多数派提交** → 强一致（偏 CP）。

### 和 MySQL 主从对比

| | MySQL 主从 | TiDB/TiKV |
|--|------------|-----------|
| 单元 | 整库/实例 | Region |
| 切换 | MHA/Orchestrator 等 | Raft 自动 |
| 扩展 | 读扩展易，写要分库 | TiKV 加节点自动均衡 |

---

## PD 干什么？TSO 是什么？

**PD（Placement Driver）：**

1. 维护 Region → 节点拓扑。  
2. 调度：迁移 Region、打散热点、控制副本数。  
3. 分配全局时间戳 **TSO（Timestamp Oracle）**。

**TSO：** 全局递增时间戳，支撑分布式事务的 **start_ts / commit_ts**，实现跨节点 MVCC 与事务排序。  
没有全局时钟就很难做「像单机一样」的快照隔离。

---

## 事务模型（高频）

TiDB 默认 **快照隔离（SI）**，乐观/悲观事务都支持（悲观更接近 MySQL 体验）。

### Percolator 思想（口述）

基于 Google Percolator 改进：

1. 事务开始拿 **start_ts**（快照）。  
2. 预写（Prewrite）：锁住要改的 Key，写意图。  
3. 拿 **commit_ts**，提交主键；再异步清锁/写最终值。  
4. 冲突则回滚重试。

| 点 | 说明 |
|----|------|
| 原子性 | 主键提交成功即事务成功（原子提交） |
| 隔离 | MVCC + start_ts 读快照 |
| 和 2PC | 分布式两阶段思想，但落在 TiKV 上，对 SQL 层透明 |

**悲观事务：** 执行时加锁，减少提交阶段冲突，兼容更多 MySQL 写法。  
**乐观事务：** 提交时检测冲突，冲突少时更轻。

---

## 和 MySQL 对比有哪些优点？

| 维度 | MySQL | TiDB |
|------|-------|------|
| 扩展 | 垂直 / 分库分表 | 存算分离，加 TiDB 或 TiKV 节点 |
| 分片 | 业务/中间件感知 | Region 自动分裂合并，SQL 更透明 |
| HA | 主从、MGR 等 | Raft 自动选主 |
| 事务 | 单机强；跨库难 | 原生分布式事务 |
| HTAP | 通常拆库 | TiFlash 行转列副本 |
| 兼容 | 生态最全 | 高度兼容 MySQL 协议与多数语法 |

**代价：** 架构组件多；单次查询可能跨节点，延迟与调优心智和单机 InnoDB 不同；极个别 MySQL 行为有差异（需回归）。

---

## TiFlash 与 HTAP

- TiFlash：TiKV 的 **列存 learner 副本**，Raft 异步同步。  
- 优化器可把聚合/分析下推到 TiFlash，OLTP 仍走 TiKV。  
- **同一份逻辑数据**：行存扛交易，列存扛分析，减少「导出到数仓」延迟。

面试：**HTAP = TiKV + TiFlash，不是把 CH 和 MySQL 拼在一个进程里。**

---

## 热点问题怎么处理？

| 热点类型 | 原因 | 手段 |
|----------|------|------|
| 写热点 | 单调自增主键、时间序 Key | **自增改随机/分段**；shard 位；业务打散 |
| 读热点 | 热点行 | 缓存；Follower Read；调度打散 |
| Region 热点 | 单 Region QPS 高 | PD 调度、拆 Region、调整 split |

**经典坑：** 用自增 ID 当主键 → 所有写入打在最大 Key 所在 Region → 单点打满。

---

## 索引与执行计划

- 支持主键、二级索引（全局索引语义由分布式实现）。  
- `EXPLAIN` / `EXPLAIN ANALYZE` 看是否 TableFullScan、索引是否命中。  
- 统计信息：`ANALYZE TABLE`；过期统计会导致坏计划。  
- 大表 DDL：在线 DDL，注意与业务并发。

---

## 高可用与容灾

- **副本数**：通常 3 副本，可丢 1 副本仍多数派。  
- **跨机房**：按 label 调度副本分布；多中心要评估网络 RTT 对 Raft 的影响。  
- **备份：** BR（Backup & Restore）、TiCDC 同步下游（Kafka/MySQL 等）。  
- **PD / TiDB** 无状态或可重建；数据在 TiKV。

---

## TiCDC / 生态工具（加分）

| 工具 | 作用 |
|------|------|
| **TiCDC** | 增量同步到 Kafka、MySQL、对象存储等 |
| **BR** | 备份恢复 |
| **Dumpling / Lightning** | 导出 / 高速导入 |
| **Dashboard / Grafana** | 监控热点、慢查询、Region |

---

## 和 OceanBase、分库分表怎么选？

| | TiDB | OceanBase | MySQL 分库分表 |
|--|------|-----------|----------------|
| 架构 | 存算分离 | 多为存算一体 + 分区 | 中间件/业务拆分 |
| 开源 | 开源活跃 | 有社区版/商业 | 生态成熟 |
| HTAP | TiFlash 清晰 | 有分析能力 | 弱 |
| 迁移 | MySQL 协议友好 | MySQL/Oracle 兼容路线 | 改动最大往往在业务 |

口述：要 **开源 + 自动分片 + TiFlash** → TiDB；金融级一体商业支持与多租户 → 看 OceanBase；已有成熟分片中间件且团队熟 → 可继续分库分表。

---

## 常见面试追问

**1. TiDB 是不是把数据存在 TiDB 进程里？**  
否，数据在 **TiKV**；TiDB 只是 SQL 计算层。

**2. 为什么要 PD？**  
没人管 Region 放哪、怎么搬、TSO 从哪来，集群无法自动均衡与做分布式事务。

**3. 强一致如何保证？**  
Raft 多数派持久化 + 事务提交协议；读已提交/SI 靠 MVCC 与 TSO。

**4. 兼容 MySQL 100% 吗？**  
高度兼容，非 100%。存储过程、部分函数/优化器行为、运维体系有差异，要做兼容性测试。

**5. 延迟比 MySQL 高？**  
跨节点与 Raft 有开销；点查优化好时可接近；复杂分布式计划需调优。

**6. 能替换所有分库分表吗？**  
多数 OLTP 可以评估；超大单行热点、特殊分片策略、极致成本场景仍要单独设计。

---

## 面试速记

| 主题 | 一句话 |
|------|--------|
| 定位 | MySQL 兼容的分布式 NewSQL |
| 架构 | TiDB 计算 + TiKV 存储 + PD 调度/TSO |
| 分片 | Region 按 Key 范围，自动分裂合并 |
| 副本 | Raft 多数派，自动选主 |
| 事务 | TSO + Percolator 系分布式事务；乐观/悲观 |
| HTAP | TiFlash 列存副本 |
| 热点 | 避免单调 Key；靠打散 + PD 调度 |
| vs MySQL | 免分库分表、原生分布式事务与扩展 |

**30 秒收口：**  
「TiDB 存算分离：TiDB 解析执行 SQL，TiKV 用 Region+Raft 存数据，PD 做调度和发 TSO。兼容 MySQL，适合替代分库分表；分布式事务靠全局时间戳和两阶段预写提交。分析可上 TiFlash。注意主键热点和与 MySQL 的兼容性差异。」
