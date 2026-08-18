---
title: 并发 AI优化汇总
---

# 并发 AI优化汇总

> AI 优化索引（目录原文较大）：补充体系化内容 + 重点篇 TOC（不含正文；全文见同目录 `0-ALL.md`）。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- 基础：类型/集合/异常/反射/泛型/SPI
- 并发：JMM、锁、AQS、线程池、ThreadLocal、CompletableFuture、虚拟线程
- JVM：内存区域、GC、类加载、排查调优
- IO：BIO/NIO/多路复用与零拷贝直觉

### 常漏追问
1. **HashMap 为什么线程不安全？** 扩容与并发写可能导致丢数据；并发用 ConcurrentHashMap。
2. **线程池如何拒绝？** Abort/CallerRuns/Discard/DiscardOldest；生产要监控队列与拒绝。
3. **GC 怎么选？** 吞吐 vs 延迟；先监控再调参。
4. **happens-before 能解决什么？** 可见性与有序性约束，不替代业务锁设计。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

> 正文请到同目录 [0-ALL.md](./0-ALL.md) 中按 source 注释检索对应章节。

1. AQS 详解 (`AQS 详解.md`)
2. Atomic 原子类总结 (`Atomic 原子类总结.md`)
3. CAS 详解 (`CAS 详解.md`)
4. CompletableFuture 详解 (`CompletableFuture 详解.md`)
5. Java 常见并发容器总结 (`Java 常见并发容器总结.md`)
6. Java 锁详解：互斥锁、读写锁、自旋锁与 synchronized 锁优化 (`Java 锁详解-互斥锁、读写锁、自旋锁与 synchronized 锁优化.md`)
7. Java 线程池详解 (`Java 线程池详解.md`)
8. Java 线程池最佳实践 (`Java 线程池最佳实践.md`)
9. Java并发常见面试题总结（上） (`Java并发常见面试题总结（上）.md`)
10. Java并发常见面试题总结（下） (`Java并发常见面试题总结（下）.md`)
11. Java并发常见面试题总结（中） (`Java并发常见面试题总结（中）.md`)
12. JMM（Java 内存模型）详解 (`JMM（Java 内存模型）详解.md`)
13. ThreadLocal 详解 (`ThreadLocal 详解.md`)
14. 从ReentrantLock的实现看AQS的原理及应用 (`从ReentrantLock的实现看AQS的原理及应用.md`)
15. 乐观锁和悲观锁详解 (`乐观锁和悲观锁详解.md`)
16. 虚拟线程常见问题总结 (`虚拟线程常见问题总结.md`)

