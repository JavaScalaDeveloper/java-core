---
title: 基础 AI优化汇总
---

# 基础 AI优化汇总

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

1. BigDecimal 详解 (`BigDecimal 详解.md`)
2. Java SPI 机制详解 (`Java SPI 机制详解.md`)
3. Java 代理模式详解 (`Java 代理模式详解.md`)
4. Java 反射机制详解 (`Java 反射机制详解.md`)
5. Java 关键字总结 (`Java 关键字总结.md`)
6. Java 金额用 long 还是 BigDecimal？ (`Java 金额用 long 还是 BigDecimal？.md`)
7. Java 魔法类 Unsafe 详解 (`Java 魔法类 Unsafe 详解.md`)
8. Java 序列化详解 (`Java 序列化详解.md`)
9. Java 语法糖详解 (`Java 语法糖详解.md`)
10. Java 值传递详解 (`Java 值传递详解.md`)
11. Java基础常见面试题总结(上) (`Java基础常见面试题总结(上).md`)
12. Java基础常见面试题总结(下) (`Java基础常见面试题总结(下).md`)
13. Java基础常见面试题总结(中) (`Java基础常见面试题总结(中).md`)
14. 泛型&通配符详解 (`泛型&通配符详解.md`)

