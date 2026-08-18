---
title: 分布式流程协调 AI优化汇总
---

# 分布式流程协调 AI优化汇总

> AI 优化索引：知识地图、易漏考点与工程清单 + 篇目 TOC（不含正文；全文见同目录 `0-ALL.md`）。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- 理论：CAP/BASE、一致性哈希、Raft/Paxos 直觉
- 工程：分布式锁、分布式 ID、事务、配置中心、RPC

### 常漏追问
1. **Redis 锁为何要续期？** 避免业务未完成锁过期；Redisson 看门狗常见。
2. **分布式事务优先什么？** 能避免则避免；本地消息表/Outbox 往往更稳。
3. **RPC 比 HTTP 多解决什么？** 服务发现、负载、序列化、治理。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

> 正文请到同目录 [0-ALL.md](./0-ALL.md) 中按 source 注释检索对应章节。

1. ZooKeeper 进阶详解：ZAB 协议、Leader 选举、集群部署与会话机制 (`zookeeper/ZooKeeper 进阶详解-ZAB 协议、Leader 选举、集群部署与会话机制.md`)
2. ZooKeeper 入门指南：核心概念、ZNode、Watcher、ACL 与典型应用场景 (`zookeeper/ZooKeeper 入门指南-核心概念、ZNode、Watcher、ACL 与典型应用场景.md`)
3. ZooKeeper 实战教程：Docker 部署、zkCli 命令、四字命令与 Curator 客户端 (`zookeeper/ZooKeeper 实战教程-Docker 部署、zkCli 命令、四字命令与 Curator 客户端.md`)

