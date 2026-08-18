---
title: 分布式 AI优化汇总
---

# 分布式 AI优化汇总

> AI 优化索引（目录原文较大）：补充体系化内容 + 重点篇 TOC（不含正文；全文见同目录 `0-ALL.md`）。

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

1. 2026 最新分布式系统面试题总结：CAP、Raft、RPC、分布式锁、事务与 ID (`2026 最新分布式系统面试题总结-CAP、Raft、RPC、分布式锁、事务与 ID.md`)
2. API 网关详解：核心功能、工作原理与 Spring Cloud Gateway / Kong / APISIX 选型 (`API 网关详解-核心功能、工作原理与 Spring Cloud Gateway Kong APISIX 选型.md`)
3. Dubbo 面试题总结：架构原理、SPI、负载均衡、服务治理与集群容错 (`rpc/Dubbo 面试题总结-架构原理、SPI、负载均衡、服务治理与集群容错.md`)
4. RPC 远程过程调用详解：原理、调用流程、序列化协议与框架选型 (`rpc/RPC 远程过程调用详解-原理、调用流程、序列化协议与框架选型.md`)
5. Spring Cloud Gateway 面试题总结：路由、Predicate、Filter、限流熔断与工作原理 (`Spring Cloud Gateway 面试题总结-路由、Predicate、Filter、限流熔断与工作原理.md`)
6. 分布式 ID 设计实战：订单号、优惠券、一码付与业务 ID 生成策略 (`分布式 ID 设计实战-订单号、优惠券、一码付与业务 ID 生成策略.md`)
7. 分布式 ID 生成方案详解：UUID、Snowflake、号段模式、Leaf 与 Tinyid 对比 (`分布式 ID 生成方案详解-UUID、Snowflake、号段模式、Leaf 与 Tinyid 对比.md`)
8. ZooKeeper 进阶详解：ZAB 协议、Leader 选举、集群部署与会话机制 (`分布式流程协调/zookeeper/ZooKeeper 进阶详解-ZAB 协议、Leader 选举、集群部署与会话机制.md`)
9. ZooKeeper 入门指南：核心概念、ZNode、Watcher、ACL 与典型应用场景 (`分布式流程协调/zookeeper/ZooKeeper 入门指南-核心概念、ZNode、Watcher、ACL 与典型应用场景.md`)
10. ZooKeeper 实战教程：Docker 部署、zkCli 命令、四字命令与 Curator 客户端 (`分布式流程协调/zookeeper/ZooKeeper 实战教程-Docker 部署、zkCli 命令、四字命令与 Curator 客户端.md`)
11. 分布式配置中心详解：Apollo、Nacos、Spring Cloud Config 与 K8s ConfigMap 对比 (`分布式配置中心详解-Apollo、Nacos、Spring Cloud Config 与 K8s ConfigMap 对比.md`)
12. 分布式事务解决方案详解：XA、AT、TCC、Saga、本地消息表与事务消息 (`分布式事务解决方案详解-XA、AT、TCC、Saga、本地消息表与事务消息.md`)
13. 分布式锁入门：为什么需要分布式锁、锁粒度、超时续约与应用场景 (`分布式锁入门-为什么需要分布式锁、锁粒度、超时续约与应用场景.md`)
14. 分布式锁实现方案详解：Redis、Redlock、ZooKeeper 与 Redisson 看门狗 (`分布式锁实现方案详解-Redis、Redlock、ZooKeeper 与 Redisson 看门狗.md`)
15. 分布式系统详解：核心概念、架构演进、典型特征与学习路线 (`分布式系统详解-核心概念、架构演进、典型特征与学习路线.md`)
16. CAP 定理与 BASE 理论详解：一致性、可用性、分区容错与最终一致性 (`协议/CAP 定理与 BASE 理论详解-一致性、可用性、分区容错与最终一致性.md`)
17. Gossip 协议详解：反熵、谣言传播、SWIM 与最终一致性 (`协议/Gossip 协议详解-反熵、谣言传播、SWIM 与最终一致性.md`)
18. Paxos 算法详解：Basic Paxos、Multi-Paxos、角色流程与 Raft 对比 (`协议/Paxos 算法详解-Basic Paxos、Multi-Paxos、角色流程与 Raft 对比.md`)
19. Raft 算法详解：Leader 选举、日志复制、安全性与成员变更 (`协议/Raft 算法详解-Leader 选举、日志复制、安全性与成员变更.md`)
20. ZAB 协议详解：ZooKeeper 原子广播、消息广播、崩溃恢复与 Leader 选举 (`协议/ZAB 协议详解-ZooKeeper 原子广播、消息广播、崩溃恢复与 Leader 选举.md`)
21. 拜占庭将军问题详解：分布式共识、3m+1 节点与 BFT 容错 (`协议/拜占庭将军问题详解-分布式共识、3m+1 节点与 BFT 容错.md`)
22. 分布式协调详解：Leader、Quorum、Lease、Fencing Token 与 Gossip (`协议/分布式协调详解-Leader、Quorum、Lease、Fencing Token 与 Gossip.md`)
23. 一致性哈希算法详解：哈希环、虚拟节点、数据倾斜与分布式缓存应用 (`协议/一致性哈希算法详解-哈希环、虚拟节点、数据倾斜与分布式缓存应用.md`)

