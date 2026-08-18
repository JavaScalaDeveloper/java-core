---
title: java AI优化汇总
---

# java AI优化汇总

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

1. Java IO 基础知识总结 (`io/Java IO 基础知识总结.md`)
2. Java IO 模型详解 (`io/Java IO 模型详解.md`)
3. Java IO 设计模式总结 (`io/Java IO 设计模式总结.md`)
4. Java NIO 核心知识总结 (`io/Java NIO 核心知识总结.md`)
5. Java内存区域详解（重点） (`jvm/Java内存区域详解（重点）.md`)
6. JDK监控和故障处理工具总结 (`jvm/JDK监控和故障处理工具总结.md`)
7. JVM垃圾回收详解（重点） (`jvm/JVM垃圾回收详解（重点）.md`)
8. JVM线上问题排查和性能调优案例 (`jvm/JVM线上问题排查和性能调优案例.md`)
9. 大白话带你认识 JVM (`jvm/大白话带你认识 JVM.md`)
10. 类加载过程详解 (`jvm/类加载过程详解.md`)
11. 类加载器详解（重点） (`jvm/类加载器详解（重点）.md`)
12. 类文件结构详解 (`jvm/类文件结构详解.md`)
13. 最重要的JVM参数总结 (`jvm/最重要的JVM参数总结.md`)
14. AQS 详解 (`并发/AQS 详解.md`)
15. Atomic 原子类总结 (`并发/Atomic 原子类总结.md`)
16. CAS 详解 (`并发/CAS 详解.md`)
17. CompletableFuture 详解 (`并发/CompletableFuture 详解.md`)
18. Java 常见并发容器总结 (`并发/Java 常见并发容器总结.md`)
19. Java 锁详解：互斥锁、读写锁、自旋锁与 synchronized 锁优化 (`并发/Java 锁详解-互斥锁、读写锁、自旋锁与 synchronized 锁优化.md`)
20. Java 线程池详解 (`并发/Java 线程池详解.md`)
21. Java 线程池最佳实践 (`并发/Java 线程池最佳实践.md`)
22. Java并发常见面试题总结（上） (`并发/Java并发常见面试题总结（上）.md`)
23. Java并发常见面试题总结（下） (`并发/Java并发常见面试题总结（下）.md`)
24. Java并发常见面试题总结（中） (`并发/Java并发常见面试题总结（中）.md`)
25. JMM（Java 内存模型）详解 (`并发/JMM（Java 内存模型）详解.md`)
26. ThreadLocal 详解 (`并发/ThreadLocal 详解.md`)
27. 从ReentrantLock的实现看AQS的原理及应用 (`并发/从ReentrantLock的实现看AQS的原理及应用.md`)
28. 乐观锁和悲观锁详解 (`并发/乐观锁和悲观锁详解.md`)
29. 虚拟线程常见问题总结 (`并发/虚拟线程常见问题总结.md`)
30. BigDecimal 详解 (`基础/BigDecimal 详解.md`)
31. Java SPI 机制详解 (`基础/Java SPI 机制详解.md`)
32. Java 代理模式详解 (`基础/Java 代理模式详解.md`)
33. Java 反射机制详解 (`基础/Java 反射机制详解.md`)
34. Java 关键字总结 (`基础/Java 关键字总结.md`)
35. Java 金额用 long 还是 BigDecimal？ (`基础/Java 金额用 long 还是 BigDecimal？.md`)
36. Java 魔法类 Unsafe 详解 (`基础/Java 魔法类 Unsafe 详解.md`)
37. Java 序列化详解 (`基础/Java 序列化详解.md`)
38. Java 语法糖详解 (`基础/Java 语法糖详解.md`)
39. Java 值传递详解 (`基础/Java 值传递详解.md`)
40. Java基础常见面试题总结(上) (`基础/Java基础常见面试题总结(上).md`)
41. Java基础常见面试题总结(下) (`基础/Java基础常见面试题总结(下).md`)
42. Java基础常见面试题总结(中) (`基础/Java基础常见面试题总结(中).md`)
43. 泛型&通配符详解 (`基础/泛型&通配符详解.md`)
44. ArrayBlockingQueue 源码分析 (`集合/ArrayBlockingQueue 源码分析.md`)
45. ArrayList 源码分析 (`集合/ArrayList 源码分析.md`)
46. ConcurrentHashMap 源码分析 (`集合/ConcurrentHashMap 源码分析.md`)
47. CopyOnWriteArrayList 源码分析 (`集合/CopyOnWriteArrayList 源码分析.md`)
48. DelayQueue 源码分析 (`集合/DelayQueue 源码分析.md`)
49. HashMap 源码分析 (`集合/HashMap 源码分析.md`)
50. Java集合常见面试题总结(上) (`集合/Java集合常见面试题总结(上).md`)
51. Java集合常见面试题总结(下) (`集合/Java集合常见面试题总结(下).md`)
52. Java集合使用注意事项总结 (`集合/Java集合使用注意事项总结.md`)
53. LinkedHashMap 源码分析 (`集合/LinkedHashMap 源码分析.md`)
54. LinkedList 源码分析 (`集合/LinkedList 源码分析.md`)
55. 《Java8 指南》中文翻译 (`新特性/《Java8 指南》中文翻译.md`)
56. Java 10 新特性概览 (`新特性/Java 10 新特性概览.md`)
57. Java 11 新特性概览（重要） (`新特性/Java 11 新特性概览（重要）.md`)
58. Java 12  & 13 新特性概览 (`新特性/Java 12 & 13 新特性概览.md`)
59. Java 14  & 15 新特性概览 (`新特性/Java 14 & 15 新特性概览.md`)
60. Java 16 新特性概览 (`新特性/Java 16 新特性概览.md`)
61. Java 17 新特性概览（重要） (`新特性/Java 17 新特性概览（重要）.md`)
62. Java 18 新特性概览 (`新特性/Java 18 新特性概览.md`)
63. Java 19 新特性概览 (`新特性/Java 19 新特性概览.md`)
64. Java 20 新特性概览 (`新特性/Java 20 新特性概览.md`)
65. Java 21 新特性概览(重要) (`新特性/Java 21 新特性概览(重要).md`)
66. Java 22 & 23 新特性概览 (`新特性/Java 22 & 23 新特性概览.md`)
67. Java 24 新特性概览 (`新特性/Java 24 新特性概览.md`)
68. Java 25 新特性概览 (`新特性/Java 25 新特性概览.md`)
69. Java 26 新特性概览 (`新特性/Java 26 新特性概览.md`)
70. Java 9 新特性概览 (`新特性/Java 9 新特性概览.md`)
71. Java8 新特性实战 (`新特性/Java8 新特性实战.md`)

