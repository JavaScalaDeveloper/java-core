---
title: 数据库 AI优化汇总
---

# 数据库 AI优化汇总

> AI 优化索引（目录原文较大）：补充体系化内容 + 重点篇 TOC（不含正文；全文见同目录 `0-ALL.md`）。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- MySQL：索引、事务隔离、MVCC、undo/redo/binlog、执行计划
- Redis：数据结构、持久化、过期淘汰、穿透击穿雪崩、集群
- SQL：连接/分组/子查询/索引友好写法

### 常漏追问
1. **为什么要覆盖索引？** 减少回表；注意选择性与维护成本。
2. **RR 下如何避免幻读？** Next-Key Lock；结合业务幂等与唯一约束。
3. **缓存与 DB 一致性？** Cache Aside 最常见；强一致需额外方案。
4. **大 Key / 热 Key？** 拆分、本地缓存、热点发现与限流。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

> 正文请到同目录 [0-ALL.md](./0-ALL.md) 中按 source 注释检索对应章节。

1. MongoDB常见面试题总结（上） (`mongodb/MongoDB常见面试题总结（上）.md`)
2. MongoDB常见面试题总结（下） (`mongodb/MongoDB常见面试题总结（下）.md`)
3. InnoDB存储引擎对MVCC的实现 (`mysql/InnoDB存储引擎对MVCC的实现.md`)
4. MySQL备份与恢复详解：mysqldump、XtraBackup、binlog和PITR (`mysql/MySQL备份与恢复详解-mysqldump、XtraBackup、binlog和PITR.md`)
5. MySQL查询缓存详解 (`mysql/MySQL查询缓存详解.md`)
6. MySQL常见面试题总结 (`mysql/MySQL常见面试题总结.md`)
7. MySQL高性能优化规范建议总结 (`mysql/MySQL高性能优化规范建议总结.md`)
8. MySQL日期类型选择建议 (`mysql/MySQL日期类型选择建议.md`)
9. MySQL三大日志(binlog、redo log和undo log)详解 (`mysql/MySQL三大日志(binlog、redo log和undo log)详解.md`)
10. MySQL事务隔离级别详解 (`mysql/MySQL事务隔离级别详解.md`)
11. MySQL索引失效场景总结 (`mysql/MySQL索引失效场景总结.md`)
12. MySQL索引详解 (`mysql/MySQL索引详解.md`)
13. MySQL隐式转换造成索引失效 (`mysql/MySQL隐式转换造成索引失效.md`)
14. MySQL执行计划分析 (`mysql/MySQL执行计划分析.md`)
15. MySQL自增主键一定是连续的吗？ (`mysql/MySQL自增主键一定是连续的吗？.md`)
16. SQL语句在MySQL中的执行过程 (`mysql/SQL语句在MySQL中的执行过程.md`)
17. 一千行 MySQL 学习笔记 (`mysql/一千行 MySQL 学习笔记.md`)
18. NoSQL基础常见面试题总结 (`NoSQL基础常见面试题总结.md`)
19. 3种常用的缓存读写策略详解 (`redis/3种常用的缓存读写策略详解.md`)
20. Redis 3 种特殊数据类型详解 (`redis/Redis 3 种特殊数据类型详解.md`)
21. Redis 5 种基本数据类型详解 (`redis/Redis 5 种基本数据类型详解.md`)
22. Redis常见面试题总结(上) (`redis/Redis常见面试题总结(上).md`)
23. Redis常见面试题总结(下) (`redis/Redis常见面试题总结(下).md`)
24. Redis常见阻塞原因总结 (`redis/Redis常见阻塞原因总结.md`)
25. Redis持久化机制详解 (`redis/Redis持久化机制详解.md`)
26. Redis内存碎片详解 (`redis/Redis内存碎片详解.md`)
27. Redis为什么用跳表实现有序集合 (`redis/Redis为什么用跳表实现有序集合.md`)
28. 缓存基础常见面试题总结 (`redis/缓存基础常见面试题总结.md`)
29. 如何基于Redis实现消息队列？ (`redis/如何基于Redis实现消息队列？.md`)
30. 如何基于Redis实现延时任务？ (`redis/如何基于Redis实现延时任务？.md`)
31. SQL常见面试题总结（1） (`sql/SQL常见面试题总结（1）.md`)
32. SQL常见面试题总结（2） (`sql/SQL常见面试题总结（2）.md`)
33. SQL常见面试题总结（3） (`sql/SQL常见面试题总结（3）.md`)
34. SQL常见面试题总结（4） (`sql/SQL常见面试题总结（4）.md`)
35. SQL常见面试题总结（5） (`sql/SQL常见面试题总结（5）.md`)
36. SQL语法基础知识总结 (`sql/SQL语法基础知识总结.md`)
37. 数据库基础常见面试题总结 (`数据库基础常见面试题总结.md`)
38. 字符集详解：字符集是什么？怎么用？ (`字符集详解-字符集是什么？怎么用？.md`)

