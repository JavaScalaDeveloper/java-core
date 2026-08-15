---
title: 面试准备 ALL
---

# 面试准备


---

<!-- source: 2026 最新版 Java 后端面试通关计划（涵盖后端通用体系）.md -->

---
title: 2026 最新版 Java 后端面试通关计划（涵盖后端通用体系）
description: Java 后端面试通关计划：严格按照面试考察真实优先级编排，涵盖项目经历、Java核心、MySQL/Redis、框架、系统设计、计算机基础、分布式与JVM，适合校招/社招准备。
category: 面试准备
icon: mdi:star-outline
head:
  - - meta
    - name: keywords
      content: Java后端面试,面试准备计划,面试指南,八股文,校招,社招,项目经验,Java面试
---

<!-- markdownlint-disable MD033 -->

本计划严格按照面试考察的**真实优先级**进行编排，顺序为：
**「 项目经历与简历深挖 → Java核心/MySQL/Redis → 框架应用 → 系统设计与场景题 → 计算机基础 → 分布式/高并发 → JVM」**

每一阶段都对应了本站具体的精选文章，方便你按图索骥，逐个击破。

- **建议总周期**：4～8 周（请根据目标公司是中小厂还是大厂，以及自身的脱产时间灵活压缩或拉长）。
- **适用人群**：准备秋招/春招的计算机专业学生，以及 0-5 年经验准备跳槽的 Java 开发者。
- **面试突击**：下文中推荐的技术文章以 [JavaGuide](https://javaguide.cn/) 为主，非常全面且详细，如果突击面试，可以选择阅读 [JavaGuide 面试突击版](https://interview.javaguide.cn/) 中对应的文章。

### 计划总览

| 阶段                               | 建议时长              | 核心产出                                       | 自测标准                                                                      |
| ---------------------------------- | --------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| **第 0 步** 前期准备               | 1～2 天               | 简历定稿、复习节奏、心态准备                   | 任选一项目，30 秒内讲清业务+你的角色，不卡壳、有重点                          |
| **第一阶段** 项目与简历深挖        | 约 1 周               | 项目卡片、必会题清单、1/3 分钟话术稿           | 脱稿讲清每项目背景+难点+你的贡献；必会题清单随机抽 3 题能答出要点             |
| **第二阶段** Java + MySQL + Redis  | 2～3 周               | 八股理解与关键词记忆（基础+集合+并发+库）      | 本站文章随机抽题，能用自己的话讲清原理与关键词，不依赖逐字背                  |
| **第三阶段** 框架                  | 1～2 周               | Spring/IoC/AOP/事务、设计模式、权限与安全      | 能说清项目对框架的使用、吃透IoC 和 AOP、事务失效场景等等                      |
| **系统设计与场景题**（接在框架后） | 按需 0.5～1 周        | 系统设计题与场景题思路（短链/秒杀/海量数据等） | 无提示口述经典设计（如短链/秒杀）的整体流程与关键取舍（存储、限流、一致性等） |
| **第四阶段** 计算机基础            | 按需 0.5～2 周        | 计网、OS、数据结构；面中大厂等加算法           | 能手写常见算法/手写题；本站文章随机抽题能答出核心机制                         |
| **第五阶段** 分布式与高并发        | 按需 1～2 周          | 分布式理论、RPC、MQ、高可用                    | 能讲清项目里用到的分布式方案（锁/ID/MQ 等）及选型理由                         |
| **第六阶段** JVM                   | 大厂/部分中厂 3～5 天 | 内存、GC、类加载、调优与排查                   | 能说清内存区域、GC 过程、类加载；能口述一次 GC 调优或 OOM 排查思路            |
| **面试前冲刺**                     | 1～2 天               | 必会题过一遍、项目话术再练、心态与设备         | 必会题清单过一遍能复述要点；每项目 1 分钟版话术练一遍不卡壳                   |

**📌 阶段调整说明：**

- 标「按需」的阶段可根据目标公司调整：面字节、快手、腾讯等**重算法厂**，请务必加强第四阶段（算法与数据结构）；
- 如果你的简历或应聘岗位明确涉及**分布式/微服务**，请系统性死磕第五阶段；
- 如果目标是阿里、美团、京东等**大厂核心部门**，请重点攻克第六阶段（JVM 底层与线上排查）。

### 第 0 步：前期准备（建议 1～2 天）

在系统刷八股前，先把「怎么准备、怎么写简历、怎么稳住心态」搞定，避免方向跑偏。

| 事项       | 说明                                    | 对应文章                                                                                                                                                                                                                                 |
| ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 准备方法   | 明确复习节奏、自测方式、时间分配        | [如何高效准备 Java 面试？](https://javaguide.cn/面试准备/teach-you-how-to-prepare-for-the-interview-hand-in-hand.html)<br />[Java后端面试重点总结](https://javaguide.cn/面试准备/key-points-of-interview.html) |
| 简历       | 一到两页纸、项目 STAR、技术栈与岗位匹配 | [程序员简历编写指南](https://javaguide.cn/面试准备/resume-guide.html)                                                                                                                                                       |
| 学习路线   | 查漏补缺，确定自己当前所处阶段          | [Java 学习路线（最新版，4w+ 字）](https://javaguide.cn/面试准备/java-roadmap.html)                                                                                                                                          |
| 项目与经历 | 没有项目/实习时如何包装、怎么讲         | [项目经验指南](https://javaguide.cn/面试准备/project-experience-guide.html)<br />[校招没有实习经历怎么办？实习经历怎么写？](https://javaguide.cn/面试准备/internship-experience.html)                          |
| 心态       | 减少紧张、发挥更稳                      | [面试太紧张怎么办？](https://javaguide.cn/面试准备/how-to-handle-interview-nerves.html)                                                                                                                                     |

**核心要点**：

- **技术好≠面试能过**，必须系统准备——尽早以求职为导向学习，根据招聘要求制定技能清单。
- **掌握投递简历的黄金时间**：秋招 7-9 月，春招 3-4 月；多渠道获取招聘信息（官网、招聘网站、牛客网、内推等）。
- **花 2-3 天完善简历**，重视项目经历描述；**校招简历不超过 2 页，社招不超过 3 页**。一定要把包装润色，但也要避免简历夸大事实，面试时易被深挖暴露。
- **八股文很有意义**，日常开发也会用到；不要抱侥幸心理，打铁还需自身硬。
- **提前准备 1-2 分钟自我介绍话术**，能流畅讲出个人背景、技术栈和求职意向。
- **多多自测**，可以用 AI 辅助模拟面试，找同学朋友互相模拟面试。

### 第一阶段：项目与简历深挖（约 1 周）

**目标**：能清晰讲出每个项目的背景、你的角色、技术选型与难点，并能推导出「可能被问的面试题」。

**产出物**：

- **项目卡片**：按简历逐条过项目，为每个项目写清——业务背景、技术栈、你负责的模块、1～2 个难点与解决方式、可量化的成果（如 QPS、耗时、节省成本）。
- **必会题清单**：根据项目用到的技术，列出「必会题」（例如：用了 Redis 缓存→ Redis 常见数据结构、持久化机制、线程模型等；用了 MySQL → 索引、事务、慢 SQL 优化等）。可参考 [JavaGuide](https://javaguide.cn/) 网站中的面试题总结按项目拓展。
- **话术稿**：每个项目准备 1～2 分钟版本（自我介绍用）和 3～5 分钟版本（深挖用），能流畅讲出「为什么这么选、遇到什么问题、怎么解决的」。

**每日建议**：每天至少梳理 1 个项目 + 对应必会题，周末做一次脱稿自测（录音或对着镜子讲）。

**自测**：能脱稿讲清每个项目的背景、难点和你的贡献；必会题清单里的题能答出要点，对于大厂面试要能抗住深挖，做到举一反三。

**没有项目经验怎么办？**

1. **实战项目视频/专栏**：慕课网、哔哩哔哩、拉勾、极客时间等；选择适合自己能力的项目，不必强求微服务项目。[JavaGuide 官方知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)已经推出[⭐AI 智能面试辅助平台 + RAG 知识库](https://javaguide.cn/专栏/interview-guide.html)和[手写 RPC 框架](https://javaguide.cn/专栏/handwritten-rpc-framework.html)。并且，还分享了很多高频项目经历（如博客、外卖、线程池、短连接）的优化版介绍和面试准备。
2. **实战类开源项目**：JavaGuide 推荐的[优质开源实战项目](https://javaguide.cn/开源项目/practical-project.html)；在理解基础上改进或增加功能。
3. **参加大公司组织的比赛**：阿里云天池大赛等；获奖项目含金量高。

**项目经历写作要点（STAR 法则）**：

- **Situation（情景）**：项目背景是什么？要解决什么问题？
- **Task（任务）**：你在项目中负责什么？你的角色是什么？
- **Action（行动）**：你具体做了什么？用了什么技术？遇到了什么问题？如何解决的？
- **Result（结果）**：取得了什么成果？最好量化（QPS 从 xxx 提高到 xxx，响应时间降低 xx%）

**项目介绍高频问题**：

- 技术架构直接写技术名词，不需要解释。
- 减少纯业务描述，多挖掘技术亮点，结合具体业务场景描述。
- 优化成果要量化（QPS、响应时间、成本节省等），非真实项目包装合理数值即可。
- 工作内容介绍控制在 6~8 条左右比较好，多了少了都有影响，一定要至少有 3-4 条是有技术亮点的，能吸引到面试官。
- 避免模糊性描述（如“负责开发”），要具体（技术+场景+效果）。
- 一定要包装项目，但也不要过度包装，准备时多想“如果面试官问为什么”，确保逻辑自洽。

### 第二阶段：Java 核心 + MySQL + Redis （约 2～3 周）

**优先级**：最重要的部分，面试高频考点，MySQL + Redis ≥ Java 基础/集合/并发 > 框架知识，大厂会深挖并发与底层。

**Java 基础**

- [Java 基础常见面试题总结（上）](https://javaguide.cn/java/基础/java-basic-questions-01.html)、[（中）](https://javaguide.cn/java/基础/java-basic-questions-02.html)、[（下）](https://javaguide.cn/java/基础/java-basic-questions-03.html)：语法与面向对象、字符串与拷贝、异常/泛型/反射/SPI/序列化/注解

**Java 集合**

- [Java 集合常见面试题（上）](https://javaguide.cn/java/集合/java-collection-questions-01.html)、[（下）](https://javaguide.cn/java/集合/java-collection-questions-02.html)：List/Set/Queue、HashMap、ConcurrentHashMap

**Java 并发**（大厂必深挖）

- [Java 并发常见面试题（上）](https://javaguide.cn/java/并发/java-concurrent-questions-01.html)、[（中）](https://javaguide.cn/java/并发/java-concurrent-questions-02.html)、[（下）](https://javaguide.cn/java/并发/java-concurrent-questions-03.html)：线程与锁、synchronized/ReentrantLock、ThreadLocal/线程池/Future/AQS/虚拟线程
- [JMM](https://javaguide.cn/java/并发/jmm.html)、[线程池详解](https://javaguide.cn/java/并发/java-thread-pool-summary.html)与[最佳实践](https://javaguide.cn/java/并发/java-thread-pool-best-practices.html)
- [ThreadLocal](https://javaguide.cn/java/并发/threadlocal.html)、[AQS](https://javaguide.cn/java/并发/aqs.html)、[CompletableFuture](https://javaguide.cn/java/并发/completablefuture-intro.html)、[常见并发容器](https://javaguide.cn/java/并发/java-concurrent-collections.html)

**MySQL**（必看）

- [MySQL 常见面试题总结](https://javaguide.cn/数据库/mysql/mysql-questions-01.html)（基础、引擎、事务、索引、锁、优化）
- [MySQL 索引详解](https://javaguide.cn/数据库/mysql/mysql-index.html)、[三大日志](https://javaguide.cn/数据库/mysql/mysql-logs.html)、[事务隔离级别](https://javaguide.cn/数据库/mysql/transaction-isolation-level.html)
- [InnoDB 对 MVCC 的实现](https://javaguide.cn/数据库/mysql/innodb-implementation-of-mvcc.html)、[SQL 执行过程](https://javaguide.cn/数据库/mysql/how-sql-executed-in-mysql.html)

**Redis**（必看）

- [Redis 常见面试题总结（上）](https://javaguide.cn/数据库/redis/redis-questions-01.html)、[Redis 常见面试题总结（下）](https://javaguide.cn/数据库/redis/redis-questions-02.html)
- [Redis 延时任务](https://javaguide.cn/数据库/redis/redis-delayed-task.html)、[Redis 做消息队列](https://javaguide.cn/数据库/redis/redis-stream-mq.html)
- [5 种基本数据类型](https://javaguide.cn/数据库/redis/redis-data-structures-01.html)、[3 种特殊类型](https://javaguide.cn/数据库/redis/redis-data-structures-02.html)、[跳表实现有序集合](https://javaguide.cn/数据库/redis/redis-skiplist.html)
- [持久化](https://javaguide.cn/数据库/redis/redis-persistence.html)、[内存碎片](https://javaguide.cn/数据库/redis/redis-memory-fragmentation.html)、[常见阻塞原因](https://javaguide.cn/数据库/redis/redis-common-blocking-problems-summary.html)

**自测**：随机抽题，能用自己的话讲出来，不死记硬背，理解记忆，重点记关键词。尤其是要重点测试 MySQL 和 Redis 部分，面试考察重点中的重点。

### 第三阶段：框架和系统设计（约 1～3 周）

#### 设计模式

- [设计模式常见面试题总结](https://interview.javaguide.cn/系统设计/design-pattern.html)

**自测**：掌握单例模式至少两种常见写法；代理模式、责任链模式、策略模式一定要搞懂，最好能够结合你的项目经历或者开源框架中的运用讲出来。

#### 框架

**Spring / Spring Boot**

- [Spring 常见面试题](https://javaguide.cn/系统设计/框架/spring/spring-knowledge-and-questions-summary.html)、[SpringBoot 常见面试题](https://javaguide.cn/系统设计/框架/spring/springboot-knowledge-and-questions-summary.html)
- [常用注解](https://javaguide.cn/系统设计/框架/spring/spring-common-annotations.html)、[IoC 与 AOP](https://javaguide.cn/系统设计/框架/spring/ioc-and-aop.html)、[Spring 事务](https://javaguide.cn/系统设计/框架/spring/spring-transaction.html)
- [Spring 中的设计模式](https://javaguide.cn/系统设计/框架/spring/spring-design-patterns-summary.html)、[SpringBoot 自动装配](https://javaguide.cn/系统设计/框架/spring/spring-boot-auto-assembly-principles.html)、[Async 原理](https://javaguide.cn/系统设计/框架/spring/async.html)（原理性知识，时间不够可跳过）
- [MyBatis 常见面试题](https://javaguide.cn/系统设计/框架/mybatis/mybatis-interview.html)（不重要，可跳过，考查不多）、[Netty 常见面试题](https://javaguide.cn/系统设计/框架/netty.html)（用到才需要准备）

**自测**：能说清项目里用到的 Spring 注解、IoC/AOP 在项目中的体现、事务失效场景。

**权限与安全**

- [认证授权基础](https://javaguide.cn/系统设计/安全/basis-of-authority-certification.html)、[JWT](https://javaguide.cn/系统设计/安全/jwt-intro.html) 与[优缺点](https://javaguide.cn/系统设计/安全/advantages-and-disadvantages-of-jwt.html)、[权限系统设计](https://javaguide.cn/系统设计/安全/design-of-authority-system.html)、[SSO](https://javaguide.cn/系统设计/安全/sso-intro.html)、[常见加密算法](https://javaguide.cn/系统设计/安全/encryption-algorithms.html)

#### 系统设计与场景题

面试官常会穿插一两道系统设计或场景题，考察整体思路和方案权衡。

- **系统设计 / 场景题汇总**：[系统设计常见面试题总结](https://javaguide.cn/系统设计/system-design-questions.html)（付费内容在 [《后端面试高频系统设计&场景题》](https://javaguide.cn/专栏/back-end-interview-high-frequency-system-design-and-scenario-questions.html) 专栏，含短链、秒杀、海量数据处理等 30+ 道）。
- **本站可参考的设计类文章**（思路可迁移到面试口述）：[定时任务](https://javaguide.cn/系统设计/schedule-task.html)、[Web 实时消息推送](https://javaguide.cn/系统设计/web-real-time-message-push.html)。

![《后端面试高频系统设计&场景题》](https://oss.javaguide.cn/xingqiu/back-end-interview-high-frequency-system-design-and-scenario-questions-fengmian.png)

**自测**：能口述 1～2 个经典系统设计（如短链、秒杀、限流）的整体思路与关键取舍；场景题（如海量数据去重、第三方登录）能说出常见方案。

### 第四阶段：计算机基础（按目标公司安排）

**目标字节、腾讯等重算法/基础的厂**：适当多留时间，算法与代码题要单独刷（LeetCode 热题、剑指 Offer 等等）；**目标中小厂**：可压缩或后置。

- **算法与代码题**（面字节、快手等必留时间）：先过 [算法专题](https://javaguide.cn/计算机基础/算法/) 建立路线，再重点手写 [二分查找](https://javaguide.cn/计算机基础/算法/binary-search.html)、[双指针与滑动窗口](https://javaguide.cn/计算机基础/算法/two-pointers-and-sliding-window.html)、[DFS/BFS](https://javaguide.cn/计算机基础/算法/dfs-bfs.html)、[回溯](https://javaguide.cn/计算机基础/算法/backtracking.html)、[动态规划](https://javaguide.cn/计算机基础/算法/dynamic-programming.html)、[Top K](https://javaguide.cn/计算机基础/算法/top-k.html) 这些模板；配合 [剑指 Offer 题解](https://javaguide.cn/计算机基础/算法/the-sword-refers-to-offer.html)、LeetCode 热题 100 和常见手写（如 LRU、生产者消费者、单例等）。建议每天至少 1 道，保持手感。
- **网络**：[计网常见面试题（上）](https://javaguide.cn/计算机基础/计算机网络/other-network-questions.html)、[（下）](https://javaguide.cn/计算机基础/计算机网络/other-network-questions2.html)、[访问网页全过程](https://javaguide.cn/计算机基础/计算机网络/the-whole-process-of-accessing-web-pages.html)、[应用层常见协议](https://javaguide.cn/计算机基础/计算机网络/application-layer-protocol.html)、[HTTP/HTTPS](https://javaguide.cn/计算机基础/计算机网络/http-vs-https.html)、[HTTP 1.0 vs 1.1](https://javaguide.cn/计算机基础/计算机网络/http1.0-vs-http1.1.html)、[DNS](https://javaguide.cn/计算机基础/计算机网络/dns.html)、[TCP 三次握手与四次挥手](https://javaguide.cn/计算机基础/计算机网络/tcp-connection-and-disconnection.html)、[TCP 可靠性](https://javaguide.cn/计算机基础/计算机网络/tcp-reliability-guarantee.html)、[ARP](https://javaguide.cn/计算机基础/计算机网络/arp.html)
- **操作系统**：[操作系统常见面试题（上）](https://javaguide.cn/计算机基础/操作系统/operating-system-basic-questions-01.html)、[（下）](https://javaguide.cn/计算机基础/操作系统/operating-system-basic-questions-02.html)、[Linux 基础](https://javaguide.cn/计算机基础/操作系统/linux-intro.html)
- **数据结构**：先过 [数据结构专题](https://javaguide.cn/计算机基础/数据结构/)，再重点复盘 [数组/链表/栈/队列](https://javaguide.cn/计算机基础/数据结构/linear-data-structure.html)、[哈希表](https://javaguide.cn/计算机基础/数据结构/hash-table.html)、[树](https://javaguide.cn/计算机基础/数据结构/tree.html)、[图](https://javaguide.cn/计算机基础/数据结构/graph.html)、[堆](https://javaguide.cn/计算机基础/数据结构/heap.html)、[Trie](https://javaguide.cn/计算机基础/数据结构/trie.html)、[并查集](https://javaguide.cn/计算机基础/数据结构/union-find.html)、[跳表](https://javaguide.cn/计算机基础/数据结构/skip-list.html)、[红黑树](https://javaguide.cn/计算机基础/数据结构/red-black-tree.html)、[布隆过滤器](https://javaguide.cn/计算机基础/数据结构/bloom-filter.html)、[LRU](https://javaguide.cn/计算机基础/数据结构/lru-cache.html)。

算法与数据结构建议合并复习，不要只背概念或只刷题。时间紧时按 7 天路线走：复杂度和排序、数组/链表、二分/双指针/滑动窗口、树和图、回溯和动态规划、哈希/堆/Top K、错题复盘。时间充足时按 30 天路线走：先打牢线性结构和哈希表，再刷树图、回溯、动态规划、贪心、Top K，最后只复盘错题和边界样例。

**自测**：能画访问网页全过程、TCP 握手挥手等等；算法题能手写常见套路；OS 进程/线程、内存、死锁能说清概念与例子。

### 第五阶段：分布式与高并发（按简历与岗位）

若简历或岗位涉及分布式/微服务/高并发，再系统过一遍；否则可只过「项目会用到的点」。

- **分布式理论**：[CAP 与 BASE](https://javaguide.cn/分布式/协议/cap-and-base-theorem.html)、[Paxos](https://javaguide.cn/分布式/协议/paxos-algorithm.html)、[Raft](https://javaguide.cn/分布式/协议/raft-algorithm.html)、[ZAB](https://javaguide.cn/分布式/协议/zab.html)、[Gossip](https://javaguide.cn/分布式/协议/gossip-protocol.html)、[一致性哈希](https://javaguide.cn/分布式/协议/consistent-hashing.html)
- **RPC**：[RPC 基础](https://javaguide.cn/分布式/rpc/rpc-intro.html)、[Dubbo](https://javaguide.cn/分布式/rpc/dubbo.html)（目前问的很少，可跳过）
- **分布式 ID / 网关 / 锁 / 事务**（项目涉及再重点看）：[分布式 ID](https://javaguide.cn/分布式/distributed-id.html)、[设计指南](https://javaguide.cn/分布式/distributed-id-design.html)、[API 网关](https://javaguide.cn/分布式/api-gateway.html)、[Spring Cloud Gateway](https://javaguide.cn/分布式/spring-cloud-gateway-questions.html)、[分布式锁](https://javaguide.cn/分布式/distributed-lock-implementations.html)、[分布式事务](https://javaguide.cn/分布式/distributed-transaction.html)
- **高并发**（项目涉及再重点看）：[CDN](https://javaguide.cn/高性能/cdn.html)、[读写分离与分库分表](https://javaguide.cn/高性能/read-and-write-separation-and-library-subtable.html)、[冷热分离](https://javaguide.cn/高性能/data-cold-hot-separation.html)、[SQL 优化](https://javaguide.cn/高性能/sql-optimization.html)、[深度分页](https://javaguide.cn/高性能/deep-pagination-optimization.html)、[负载均衡](https://javaguide.cn/高性能/load-balancing.html)
- **高可用**（项目涉及再重点看）：[高可用系统设计](https://javaguide.cn/高可用/high-availability-system-design.html)、[限流](https://javaguide.cn/高可用/limit-request.html)、[熔断与降级](https://javaguide.cn/高可用/fallback-and-circuit-breaker.html)、[超时与重试](https://javaguide.cn/高可用/timeout-and-retry.html)、[幂等设计](https://javaguide.cn/高可用/idempotency.html)、[冗余设计](https://javaguide.cn/高可用/redundancy.html)
- **消息队列**（项目涉及再重点看）：[MQ 基础](https://javaguide.cn/高性能/消息队列/message-queue.html)、[Disruptor](https://javaguide.cn/高性能/消息队列/disruptor-questions.html)、[RabbitMQ](https://javaguide.cn/高性能/消息队列/rabbitmq-questions.html)、[RocketMQ](https://javaguide.cn/高性能/消息队列/rocketmq-questions.html)、[Kafka](https://javaguide.cn/高性能/消息队列/kafka-questions-01.html)

**自测**：能讲清项目里用到的分布式方案（如分布式锁、ID、MQ）及选型理由；CAP/BASE、一致性哈希等能举例说明。

### 第六阶段：JVM（大厂 / 部分中厂）

目标阿里、美团、携程、顺丰、招银等可重点看；面国企或小厂可跳过。

- [Java 内存区域](https://javaguide.cn/java/jvm/memory-area.html)、[JVM 垃圾回收](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)
- [类文件结构](https://javaguide.cn/java/jvm/class-file-structure.html)、[类加载过程](https://javaguide.cn/java/jvm/class-loading-process.html)、[类加载器](https://javaguide.cn/java/jvm/classloader.html)
- 结合[星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)的 [常见线上问题案例](https://t.zsxq.com/0bsAac47U) 理解调优与排查（也可以参考这篇 [JVM 线上问题排查和性能调优案例](https://javaguide.cn/java/jvm/jvm-in-action.html)）

**自测**：能说清内存区域、常见 GC 器与回收过程、类加载与双亲委派；能结合项目或案例讲一次 GC 调优或 OOM 排查思路。

**Java 新特性**（按岗位要求选读）：[Java 11](https://javaguide.cn/java/新特性/java11.html)、[Java 17](https://javaguide.cn/java/新特性/java17.html)、[Java 21](https://javaguide.cn/java/新特性/java21.html)

### 面试前 1～2 天冲刺清单

临近面试时优先做这几件事，避免临时抱佛脚方向散乱：

| 事项              | 说明                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 过一遍必会题      | 重点看你第一阶段整理的「项目相关必会题」+ 简历上写的「熟练掌握」对应的考点，能口头复述要点即可。                                                        |
| 练一遍项目话术    | 每个项目 1 分钟版、3 分钟版各讲一遍，卡壳的地方记下来再顺一遍。                                                                                         |
| 目标公司/岗位倾向 | 翻一下该公司或同类型岗位的面经，看有没有偏重（如算法、计网、项目深挖），针对性过一眼。                                                                  |
| 心态与状态        | 早睡、准备好设备（线上面试）或路线（现场），可看 [面试太紧张怎么办？](https://javaguide.cn/面试准备/how-to-handle-interview-nerves.html)。 |

面试结束后建议做一次简短复盘：哪些题答得不好、哪些没准备到，补充进必会题清单，下一场前重点过一遍。


---

<!-- source: 2026最新Java面试+后端面试PDF资料.md -->

---
title: 2026最新Java面试+后端面试PDF资料
description: 2026 版后端面试 PDF 资料整理（JavaGuide）：梳理校招/社招高频考点与复习优先级，覆盖 Java 基础、集合、并发、MySQL、Redis、Spring/Spring Boot、JVM、系统设计与项目经验准备，帮你抓重点高效备战。
category: 面试准备
icon: mdi:file-pdf-box
head:
  - - meta
    - name: keywords
      content: 后端面试PDF,Java面试PDF,PDF面试资料,Java八股文PDF,面试突击PDF,校招社招,Java后端面试,Java基础,Java集合,Java并发,JVM,MySQL,Redis,Spring Boot,系统设计,项目经验
---

大家好，我是 Guide。

**2026 版后端 PDF 面试资料终于搞定了！这次的更新量大得惊人，熬了几个通宵，总算能拿出来见人了。**

在上一版的基础上，我把内容又往深里挖了挖。目前这份资料已经涵盖了 **Java 核心、计算机基础、数据库、缓存、分布式、设计模式、智力题、学习路线、面经**等全方位内容。毫不夸张地说，你备战后端面试需要的硬核干货，这一份全包了！

为了让大家看得更爽，我对其中大部分 PDF 进行了“推倒重来式”的优化：

- **重构面试突击系列**：将原先臃肿的内容拆分成多篇，逻辑更清晰。
- **重写设计模式总结**：新增多道高频设计模式面试题，优化内容表达。
- **全方位细节完善**：每一个知识点都反复推敲，确保没有逻辑断层。

![](https://oss.javaguide.cn/github/javaguide/项目介绍/pdf-interview-javaguide.png)

这些 PDF 面试资料的质量都非常高，绝大部分都是 Guide 的原创，也会有一些其他优质技术博主分享的原创资料。

之所以一直坚持出 PDF 版，是因为有一些朋友比较喜欢看 PDF 资料，甚至把 PDF 资料打印出来学习。

![](https://oss.javaguide.cn/github/javaguide/项目介绍/pdf-interview-javaguide-chat.png)

截止到目前，这套资料在各个渠道的汇总下载量已经突破了 **35w+** 。 说实话，这个数字对我来说不只是流量，更是沉甸甸的信任和责任。

老规矩，没有任何花里胡哨的套路，直接**白嫖**： 在 **JavaGuide** 公众号后台回复 **PDF** 即可获取。

<img src="https://oss.javaguide.cn/github/javaguide/gongzhonghao-javaguide.png" alt="JavaGuide 公众号"  style="zoom: 43%; display: block; margin: 0 auto;" />

由于 PDF 的时效性问题，如果想要更完美的体验，个人其实还是更建议大家去 [JavaGuide](https://javaguide.cn/) 网站上在线阅读，内容更新，一直在持续完善。

## 部分内容概览

**《JavaGuide 面试突击》— Java 集合**：

![《JavaGuide 面试突击》— Java 集合面试题总结](https://oss.javaguide.cn/github/javaguide/项目介绍/javaguide-mianshituji-java-collection.png)

**《JavaGuide 面试突击》— JVM**：

![《JavaGuide 面试突击》— JVM面试题总结](https://oss.javaguide.cn/github/javaguide/项目介绍/javaguide-mianshituji-jvm.png)

**《JavaGuide 面试突击》—设计模式**：

![《JavaGuide 面试突击》—设计模式面试题总结](https://oss.javaguide.cn/github/javaguide/项目介绍/javaguide-mianshituji-design-pattern.png)

**Java 学习路线**：

![Java 学习路线 PDF 概览 - 亮色板](https://oss.javaguide.cn/github/javaguide/面试准备/java-road-map-pdf.png)

## 如何获取？

老规矩，没有任何花里胡哨的套路，直接**白嫖**： 在 **JavaGuide** 公众号后台回复 **PDF** 即可获取。

<img src="https://oss.javaguide.cn/github/javaguide/gongzhonghao-javaguide.png" alt="JavaGuide 公众号"  style="zoom: 43%; display: block; margin: 0 auto;" />


---

<!-- source: 2026最新版Java后端面试重点总结.md -->

---
title: 2026最新版Java后端面试重点总结
description: Java后端面试重点总结：梳理校招/社招高频考点与复习优先级，覆盖Java基础、集合、并发、MySQL、Redis、Spring/Spring Boot、JVM与项目经验准备，帮你抓重点高效备战。
category: 面试准备
icon: mdi:star-outline
head:
  - - meta
    - name: keywords
      content: Java后端面试,面试重点,八股文,Java基础,Java集合,Java并发,MySQL,Redis,Spring Boot,项目经验
---

<!-- @include: @small-advertisement.snippet.md -->

::: tip 友情提示
本文节选自 **[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)**。这是一份教你如何更高效地准备面试的专栏，内容和 JavaGuide 互补，涵盖常见八股文（系统设计、常见框架、分布式、高并发 ……）、优质面经等内容。
:::

## Java 后端面试哪些知识点是重点？

**准备面试的时候，具体哪些知识点是重点呢？如何把握重点？**

先看下面这张全局图（后续会详细解读）：

![Java 后端面试重点](https://oss.javaguide.cn/github/javaguide/面试准备/back-end-interview-focus.png)

给你几点靠谱的建议：

1. Java 基础、集合、并发、MySQL、Redis 、Spring、Spring Boot 这些 Java 后端开发必备的知识点（MySQL + Redis >= Java > Spring + Spring Boot）。大厂以及中小厂的面试问的比较多的就是这些知识点。Spring 和 Spring Boot 这俩框架类的知识点相对前面的知识点来说重要性要稍低一些，但一般面试也会问一些，尤其是中小厂。并发知识一般中大厂提问更多也更难，尤其是大厂喜欢深挖底层，很容易把人问倒。计算机基础相关的内容会在下面提到。
2. 你的项目经历涉及到的知识点是重中之重，有水平的面试官都是会根据你的项目经历来问的。举个例子，你的项目经历使用了 Redis 来做限流，那 Redis 相关的八股文（比如 Redis 常见数据结构）以及限流相关的八股文（比如常见的限流算法）你就应该多花更多心思来搞懂吃透！你把项目经历上的知识点吃透之后，再把你简历上哪些写熟练掌握的技术给吃透，最后再去花时间准备其他知识点。
3. 针对自身找工作的需求，你又可以适当地调整复习的重点。像中小厂一般问计算机基础比较少一些，有些大厂比如字节比较重视计算机基础尤其是算法。这样的话，如果你的目标是中小厂的话，计算机基础就准备面试来说不是那么重要了。如果复习时间不够的话，可以暂时先放放，腾出时间给其他重要的知识点。
4. 一般校招的面试不会强制要求你会分布式/微服务、高并发的知识（不排除个别岗位有这方面的硬性要求），所以到底要不要掌握还是要看你个人当前的实际情况。如果你会这方面的知识的话，对面试相对来说还是会更有利一些（想要让项目经历有亮点，还是得会一些性能优化的知识。性能优化的知识这也算是高并发知识的一个小分支了）。如果你的技能介绍或者项目经历涉及到分布式/微服务、高并发的知识，那建议你尽量也要抽时间去认真准备一下，面试中很可能会被问到，尤其是项目经历用到的时候。不过，也还是主要准备写在简历上的那些知识点就好。
5. JVM 相关的知识点，一般是大厂（例如美团、阿里）和一些不错的中厂（例如携程、顺丰、招银网络）才会问到，面试国企、差一点的中厂和小厂就没必要准备了。JVM 面试中比较常问的是 [Java 内存区域](https://javaguide.cn/java/jvm/memory-area.html)、[JVM 垃圾回收](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)、[类加载器和双亲委派模型](https://javaguide.cn/java/jvm/classloader.html) 以及 JVM 调优和问题排查（我之前分享过一些[常见的线上问题案例](https://t.zsxq.com/0bsAac47U)，里面就有 JVM 相关的）。
6. 不同的大厂面试侧重点也会不同。比如说你要去阿里这种公司的话，项目和八股文就是重点，阿里笔试一般会有代码题，进入面试后就很少问代码题了，但是对原理性的问题问的比较深，经常会问一些你对技术的思考。再比如说你要面试字节这种公司，那计算机基础，尤其是算法是重点，字节的面试十分注重代码功底，有时候开始面试就会直接甩给你一道代码题，写出来再谈别的。也会问面试八股文，以及项目，不过，相对来说要少很多。
7. 多去找一些面经看看，尤其你目标公司或者类似公司对应岗位的面经。这样可以实现针对性的复习，还能顺便自测一波，检查一下自己的掌握情况。

看似 Java 后端八股文很多，实际把复习范围一缩小，重要的东西就是那些。考虑到时间问题，你不可能连一些比较冷门的知识点也给准备了。这没必要，主要精力先放在那些重要的知识点即可。

## 如何更高效地准备八股文？

<img src="https://oss.javaguide.cn/github/javaguide/面试准备/preparation-for%20eight-part%20essay.png" style="zoom:50%;" />

对于技术八股文来说，尽量不要死记硬背，这种方式非常枯燥且对自身能力提升有限！但是！想要一点不背是不太现实的，只是说要结合实际应用场景和实战来理解记忆。

我一直觉得面试八股文最好是和实际应用场景和实战相结合。很多同学现在的方向都错了，上来就是直接背八股文，硬生生学成了文科，那当然无趣了。

举个例子：你的项目中需要用到 Redis 来做缓存，你对照着官网简单了解并实践了简单使用 Redis 之后，你去看了 Redis 对应的八股文。你发现 Redis 可以用来做限流、分布式锁，于是你去在项目中实践了一下并掌握了对应的八股文。紧接着，你又发现 Redis 内存不够用的情况下，还能使用 Redis Cluster 来解决，于是你就又去实践了一下并掌握了对应的八股文。

**一定要记住你的主要目标是理解和记关键词，而不是像背课文一样一字一句地记下来，这样毫无意义！效率最低，对自身帮助也最小！**

还要注意适当“投机取巧”，不要单纯死记八股，有些技术方案的实现有很多种，例如分布式 ID、分布式锁、幂等设计，想要完全记住所有方案不太现实，你就重点记忆你项目的实现方案以及选择该种实现方案的原因就好了。当然，其他方案还是建议你简单了解一下，不然也没办法和你选择的方案进行对比。

想要检测自己是否搞懂或者加深印象，记录博客或者用自己的理解把对应的知识点讲给别人听也是一个不错的选择。

另外，准备八股文的过程中，强烈建议你花个几个小时去根据你的简历（主要是项目经历部分）思考一下哪些地方可能被深挖，然后把你自己的思考以面试问题的形式体现出来。面试之后，你还要根据当下的面试情况复盘一波，对之前自己整理的面试问题进行完善补充。这个过程对于个人进一步熟悉自己的简历（尤其是项目经历）部分，非常非常有用。这些问题你也一定要多花一些时间搞懂吃透，能够流畅地表达出来。面试问题可以参考 [Java 面试常见问题总结（2024 最新版）](https://t.zsxq.com/0eRq7EJPy)，记得根据自己项目经历去深入拓展即可！

最后，准备技术面试的同学一定要定期复习（自测的方式非常好），不然确实会遗忘的。

## 详细面试准备计划（后端通用）

[Java 后端面试重点和详细准备计划](https://javaguide.cn/面试准备/backend-interview-plan.html)


---

<!-- source: 2026最新版Java学习路线(4w+字).md -->

---
title: 2026最新版Java学习路线(4w+字)
description: Java学习路线最新版：结合当下 Java 后端招聘要求，提供从基础到进阶的系统学习路径与资料建议，覆盖Java核心、数据库、缓存、中间件、框架与面试重点，帮助高效规划与提速上岸。
category: 面试准备
icon: mdi:map-marker-path
head:
  - - meta
    - name: keywords
      content: Java学习路线,Java后端路线,Java学习计划,校招准备,面试路线,Spring Boot,MySQL,Redis,JVM
---

::: tip 重要说明

本学习路线保持**年度系统性修订**，严格同步 Java 技术生态与招聘市场的最新动态，**确保内容时效性与前瞻性**。

:::

历时一个月精心打磨，笔者基于当下 Java 后端开发岗位招聘的最新要求，对既有学习路线进行了全面升级。本次升级涵盖技术栈增删、学习路径优化、配套学习资源更新等维度，力争构建出更符合 Java 开发者成长曲线的知识体系。

亮色板概览：

![Java 学习路线 PDF 概览 - 亮色板](https://oss.javaguide.cn/github/javaguide/面试准备/java-road-map-pdf.png)

暗色板概览：

![Java 学习路线 PDF 概览 - 暗色版](https://oss.javaguide.cn/github/javaguide/面试准备/java-road-map-pdf-dark.png)

这可能是你见过的最用心、最全面的 Java 后端学习路线。这份学习路线共包含 **4w+** 字，但你完全不用担心内容过多而学不完。我会根据学习难度，划分出适合找小厂工作必学的内容，以及适合逐步提升 Java 后端开发能力的学习路径。

![Java 学习路线图](https://oss.javaguide.cn/github/javaguide/面试准备/java-road-map.png)

对于初学者，你可以按照这篇文章推荐的学习路线和资料进行系统性的学习；对于有经验的开发者，你可以根据这篇文章更一步地深入学习 Java 后端开发，提升个人竞争力。

在看这份学习路线的过程中，建议搭配 [Java 面试重点总结(重要)](https://javaguide.cn/面试准备/key-points-of-interview.html)，可以让你在学习过程中更有目的性。

由于这份学习路线内容太多，因此我将其整理成了 PDF 版本（共 **55** 页），方便大家阅读。这份 PDF 有黑夜和白天两种阅读版本，满足大家的不同需求。

这份学习路线的获取方法很简单：直接在公众号「**JavaGuide**」后台回复“**路线**”即可获取。

![JavaGuide 官方公众号](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)


---

<!-- source: 程序员简历编写指南.md -->

---
title: 程序员简历编写指南
description: 程序员简历编写指南：从筛选逻辑出发讲清简历结构、项目经历与技能描述写法，提供简历模板与避坑建议，帮助你提高简历通过率并让面试官更好地深挖你的亮点。
category: 面试准备
icon: "mdi:account-tie-outline"
head:
  - - meta
    - name: keywords
      content: 程序员简历,Java简历,简历优化,项目经历写法,简历模板,校招简历,社招简历,面试准备
---

::: tip 友情提示
本文节选自 **[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)**。这是一份教你如何更高效地准备面试的小册，涵盖常见八股文（系统设计、常见框架、分布式、高并发 ……）、优质面经等内容。
:::

## 前言

一份好的简历可以在整个申请面试以及面试过程中起到非常重要的作用。

**为什么说简历很重要呢？** 我们可以从下面几点来说：

**1、简历就像是我们的一个门面一样，它在很大程度上决定了是否能够获得面试机会。**

- 假如你是网申，你的简历必然会经过 HR 的筛选，一张简历 HR 可能也就花费 10 秒钟左右看一下，然后决定你能否进入面试。
- 假如你是内推，如果你的简历没有什么优势的话，就算是内推你的人再用心，也无能为力。

另外，就算你通过了第一轮的筛选获得面试机会，后面的面试中，面试官也会根据你的简历来判断你究竟是否值得他花费很多时间去面试。

**2、简历上的内容很大程度上决定了面试官提问的侧重点。**

- 一般情况下你的简历上注明你会的东西才会被问到（Java 基础、集合、并发、MySQL、Redis 、Spring、Spring Boot 这些算是每个人必问的），比如写了你熟练使用 Redis,那面试官就很大概率会问你 Redis 的一些问题，再比如你写了你在项目中使用了消息队列，那面试官大概率问很多消息队列相关的问题。
- 技能熟练度在很大程度上也决定了面试官提问的深度。

在不夸大自己能力的情况下，写出一份好的简历也是一项很棒的能力。一般情况下，技术能力和学习能力比较厉害的，写出来的简历也比较棒！

## 简历模板

简历的样式真的非常非常重要！！！如果你的简历样式丑到没朋友的话，面试官真的没有看下去的欲望。一天处理上百份的简历的痛苦，你不懂！

我这里的话，推荐大家使用 Markdown 语法写简历，然后再将 Markdown 格式转换为 PDF 格式后进行简历投递。如果你对 Markdown 语法不太了解的话，可以花半个小时简单看一下 Markdown 语法说明: <http://www.markdown.cn/>。

下面是我收集的一些还不错的简历模板：

- 适合中文的简历模板收集（推荐，开源免费）：<https://github.com/dyweb/awesome-resume-for-chinese>
- 木及简历（推荐，部分免费） ： <https://www.mujicv.com/>
- 简单简历（推荐，部分免费）：<https://easycv.cn/>
- 极简简历（免费）： <https://www.polebrief.com/index>
- Markdown 简历排版工具（开源免费）：<https://resume.mdnice.com/>
- 站长简历（收费，支持 AI 生成）：<https://jianli.chinaz.com/>
- typora+markdown+css 自定义简历模板 ：<https://github.com/Snailclimb/typora-markdown-resume>
- 超级简历（部分收费） ： <https://www.wondercv.com/>

上面这些简历模板大多是只有 1 页内容，很难展现足够的信息量。如果你不是顶级大牛（比如 ACM 大赛获奖）的话，我建议还是尽可能多写一点可以突出你自己能力的内容（校招生 2 页之内，社招生 3 页之内，记得精炼语言，不要过多废话）。

再总结几点 **简历排版的注意事项**：

- 尽量简洁，不要太花里胡哨。
- 技术名词最好规范大小写比较好，比如 java->Java ，spring boot -> Spring Boot 。这个虽然有些面试官不会介意，但是很多面试官都会在意这个细节的。
- 中文和数字英文之间加上空格的话看起来会舒服一点。

另外，知识星球里还有真实的简历模板可供参考，地址：<https://t.zsxq.com/12ypxGNzU> （需加入[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)获取）。

![](https://oss.javaguide.cn/javamianshizhibei/image-20230918073550606.png)

## 简历内容

### 个人信息

- 最基本的 ：姓名（身份证上的那个）、年龄、电话、籍贯、联系方式、邮箱地址
- 潜在加分项 ： Github 地址、博客地址（如果技术博客和 Github 上没有什么内容的话，就不要写了）

示例：

![](https://oss.javaguide.cn/zhishixingqiu/20210428212337599.png)

**简历要不要放照片呢？** 很多人写简历的时候都有这个问题。

其实放不放都行，影响不大，完全不用在意这个问题。除非，你投递的岗位明确要求要放照片。 不过，如果要放的话，不要放生活照，还是应该放正规一些的照片比如证件照。

### 求职意向

你想要应聘什么岗位，希望在什么城市。另外，你也可以将求职意向放到个人信息这块写。

示例：

![](https://oss.javaguide.cn/zhishixingqiu/20210428212410288.png)

### 教育经历

教育经历也不可或缺。通过教育经历的介绍，你要确保能让面试官就可以知道你的学历、专业、毕业学校以及毕业的日期。

示例：

> 北京理工大学 硕士，软件工程 2019.09 - 2022.01
> 湖南大学 学士，应用化学 2015.09 ~ 2019.06

### 专业技能

先问一下你自己会什么，然后看看你意向的公司需要什么。一般 HR 可能并不太懂技术，所以他在筛选简历的时候可能就盯着你专业技能的关键词来看。对于公司有要求而你不会的技能，你可以花几天时间学习一下，然后在简历上可以写上自己了解这个技能。

下面是一份最新的 Java 后端开发技能清单，你可以根据自身情况以及岗位招聘要求做动态调整，核心思想就是尽可能满足岗位招聘的所有技能要求。

![Java 后端技能模板](https://oss.javaguide.cn/zhishixingqiu/jinengmuban.png)

我这里再单独放一个我看过的某位同学的技能介绍，我们来找找问题。

![](https://oss.javaguide.cn/zhishixingqiu/up-a58d644340f8ce5cd32f9963f003abe4233.png)

上图中的技能介绍存在的问题：

- 技术名词最好规范大小写比较好，比如 java->Java ，spring boot -> Spring Boot 。这个虽然有些面试官不会介意，但是很多面试官都会在意这个细节的。
- 技能介绍太杂，没有亮点。不需要全才，某个领域做得好就行了！
- 对 Java 后台开发的部分技能比如 Spring Boot 的熟悉度仅仅为了解，无法满足企业的要求。

### 实习经历/工作经历（重要）

工作经历针对社招，实习经历针对校招。

工作经历建议采用时间倒序的方式来介绍。实习经历和工作经历都需要简单突出介绍自己在职期间主要做了什么。

示例：

> **XXX 公司 （201X 年 X 月 ~ 201X 年 X 月 ）**
>
> - **职位**：Java 后端开发工程师
> - **工作内容**：主要负责 XXX

### 项目经历（重要）

简历上有一两个项目经历很正常，但是真正能把项目经历很好的展示给面试官的非常少。

很多求职者的项目经历介绍都会面临过于啰嗦、过于简单、没突出亮点等问题。

项目经历介绍模板如下：

> 项目名称（字号要大一些）
>
> 2017-05~2018-06 淘宝 Java 后端开发工程师
>
> - **项目描述** : 简单描述项目是做什么的。
> - **技术栈** ：用了什么技术（如 Spring Boot + MySQL + Redis + Mybatis-plus + Spring Security + Oauth2）
> - **工作内容/个人职责** : 简单描述自己做了什么，解决了什么问题，带来了什么实质性的改善。突出自己的能力，不要过于平淡的叙述。
> - **个人收获（可选）** : 从这个项目中你学会了那些东西，使用到了那些技术，学会了那些新技术的使用。通常是可以不用写个人收获的，因为你在个人职责介绍中写的东西已经表明了自己的主要收获。
> - **项目成果（可选）** :简单描述这个项目取得了什么成绩。

**1、项目经历应该突出自己做了什么，简单概括项目基本情况。**

项目介绍尽量压缩在两行之内，不需要介绍太多，但也不要随便几个字就介绍完了。

另外，个人收获和项目成果都是可选的，如果选择写的话，也不要花费太多篇幅，记住你的重点是介绍工作内容/个人职责。

**2、技术架构直接写技术名词就行，不要再介绍技术是干嘛的了，没意义，属于无效介绍。**

![](https://oss.javaguide.cn/github/javaguide/面试准备/46c92fbc5160e65dd85c451143177144.png)

**3、尽量减少纯业务的个人职责介绍，对于面试不太友好。尽量再多挖掘一些亮点（6~8 条个人职责介绍差不多了，做好筛选），最好可以体现自己的综合素质，比如你是如何协调项目组成员协同开发的或者在遇到某一个棘手的问题的时候你是如何解决的又或者说你在这个项目优化了某个模块的性能。**

即使不是你做的功能模块或者解决的问题，你只要搞懂吃透了就能拿来自己用，适当润色即可！

像性能优化方向上的亮点面试之前也比较容易准备，但也不要都是性能优化相关的，这种也算是一个极端。

另外，技术优化取得的成果尽量要量化一下：

- 使用 xxx 技术解决了 xxx 问题，系统 QPS 从 xxx 提高到了 xxx。
- 使用 xxx 技术了优化了 xxx 接口，系统 QPS 从 xxx 提高到了 xxx。
- 使用 xxx 技术解决了 xxx 问题，查询速度优化了 xxx，系统 QPS 达到 10w+。
- 使用 xxx 技术优化了 xxx 模块，响应时间从 2s 降低到 0.2s。
- ……

个人职责介绍示例（这里只是举例，不要照搬，结合自己项目经历自己去写，不然面试的时候容易被问倒） ：

- 基于 Spring Cloud Gateway + Spring Security OAuth2 + JWT 实现微服务统一认证授权和鉴权，使用 RBAC 权限模型实现动态权限控制。
- 参与项目订单模块的开发，负责订单创建、删除、查询等功能，基于 Spring 状态机实现订单状态流转。
- 商品和订单搜索场景引入 Elasticsearch，并且实现了相关商品推荐以及搜索提示功能。
- 整合 Canal + RabbitMQ 将 MySQL 增量数据（如商品、订单数据）同步到 Elasticsearch。
- 利用 RabbitMQ 官方提供的延迟队列插件实现延时任务场景比如订单超时自动取消、优惠券过期提醒、退款处理。
- 消息推送系统引入 RabbitMQ 实现异步处理、削峰填谷和服务解耦，最高推送速度 10w/s，单日最大消息量 2000 万。
- 使用 MAT 工具分析 dump 文件解决了广告服务新版本上线后导致大量的服务超时告警的问题。
- 排查并解决扣费模块由于扣费父任务和反作弊子任务使用同一个线程池导致的死锁问题。
- 基于 EasyExcel 实现广告投放数据的导入导出，通过 MyBatis 批处理插入数据，基于任务表实现异步。
- 负责用户统计模块的开发，使用 CompletableFuture 并行加载后台用户统计模块的数据信息，平均相应时间从 3.5s 降低到 1s。
- 基于 Sentinel 对核心场景(如用户登入注册、收货地址查询等)进行限流、降级，保护系统，提升用户体验。
- 热门数据（如首页、热门博客）使用 Redis+Caffeine 两级缓存，解决了缓存击穿和穿透问题，查询速度毫秒级，QPS 30w+。
- 使用 CompletableFuture 优化购物车查询模块，对获取用户信息、商品详情、优惠券信息等异步 RPC 调用进行编排，响应时间从 2s 降低为 0.2s。
- 搭建 EasyMock 服务，用于模拟第三方平台接口，方便了在网络隔离情况下的接口对接工作。
- 基于 SkyWalking + Elasticsearch 搭建分布式链路追踪系统实现全链路监控。

**4、如果你觉得你的项目技术比较落后的话，可以自己私下进行改进。重要的是让项目比较有亮点，通过什么方式就无所谓了。**

项目经历这部分对于简历来说非常重要，[《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html)的面试准备篇有好几篇关于优化项目经历的文章，建议你仔细阅读一下，应该会对你有帮助。

![](https://oss.javaguide.cn/zhishixingqiu/4e11dbc842054e53ad6c5f0445023eb5~tplv-k3u1fbpfcp-zoom-1.png)

**5、避免个人职责介绍都是围绕一个技术点来写，非常不可取。**

![](https://oss.javaguide.cn/zhishixingqiu/image-20230424222513028.png)

**6、避免模糊性描述，介绍要具体（技术+场景+效果），也要注意精简语言（避免堆砌技术词，省略不必要的描述）。**

![](https://oss.javaguide.cn/github/javaguide/面试准备/project-experience-avoiding-ambiguity-descriptio.png)

### 荣誉奖项（可选）

如果你有含金量比较高的竞赛（比如 ACM、阿里的天池大赛）的获奖经历的话，荣誉奖项这块内容一定要写一下！并且，你还可以将荣誉奖项这块内容适当往前放，放在一个更加显眼的位置。

### 校园经历（可选）

如果有比较亮眼的校园经历的话就简单写一下，没有就不写！

### 个人评价

**个人评价就是对自己的解读，一定要用简洁的语言突出自己的特点和优势，避免废话！** 像勤奋、吃苦这些比较虚的东西就不要扯了，面试官看着这种个人评价就烦。

我们可以从下面几个角度来写个人评价：

- 文档编写能力、学习能力、沟通能力、团队协作能力
- 对待工作的态度以及个人的责任心
- 能承受的工作压力以及对待困难的态度
- 对技术的追求、对代码质量的追求
- 分布式、高并发系统开发或维护经验

列举 3 个实际的例子：

- 学习能力较强，大三参加国家软件设计大赛的时候快速上手 Python 写了一个可配置化的爬虫系统。
- 具有团队协作精神，大三参加国家软件设计大赛的时候协调项目组内 5 名开发同学，并对编码遇到困难的同学提供帮助，最终顺利在 1 个月的时间完成项目的核心功能。
- 项目经验丰富，在校期间主导过多个企业级项目的开发。

## STAR 法则和 FAB 法则

### STAR 法则（Situation Task Action Result）

相信大家一定听说过 STAR 法则。对于面试，你可以将这个法则用在自己的简历以及和面试官沟通交流的过程中。

STAR 法则由下面 4 个单词组成（STAR 法则的名字就是由它们的首字母组成）：

- **Situation：** 情景。 事情是在什么情况下发生的？
- **Task：** 任务。你的任务是什么？
- **Action：** 行动。你做了什么？
- **Result：** 结果。最终的结果怎样？

### FAB 法则（Feature Advantage Benefit）

除了 STAR 法则，你还需要了解在销售行业经常用到的一个叫做 FAB 的法则。

FAB 法则由下面 3 个单词组成（FAB 法则的名字就是由它们的首字母组成）：

- **Feature：** 你的特征/优势是什么？
- **Advantage：** 比别人好在哪些地方；
- **Benefit：** 如果雇佣你，招聘方会得到什么好处。

简单来说，**FAB 法则主要是让你的面试官知道你的优势和你能为公司带来的价值。**

## 建议

### 避免页数过多

精简表述，突出亮点。校招简历建议不要超过 2 页，社招简历建议不要超过 3 页。如果内容过多的话，不需要非把内容压缩到一页，保持排版干净整洁就可以了。

看了几千份简历，有少部分同学的简历页数都接近 10 页了，让我头皮发麻。

![简历页数过多](https://oss.javaguide.cn/zhishixingqiu/image-20230508223646164.png)

### 避免语义模糊

尽量避免主观表述，少一点语义模糊的形容词。表述要简洁明了，简历结构要清晰。

举例：

- 不好的表述：我在团队中扮演了很重要的角色。
- 好的表述：我作为后端技术负责人，领导团队完成后端项目的设计与开发。

### 注意简历样式

简历样式同样很重要，一定要注意！不必追求花里胡哨，但要尽量保证结构清晰且易于阅读。

### 其他

- 一定要使用 PDF 格式投递，不要使用 Word 或者其他格式投递。这是最基本的！
- 不会的东西就不要写在简历上了。注意简历真实性，适当润色没有问题。
- 工作经历建议采用时间倒序的方式来介绍，实习经历建议将最有价值的放在最前面。
- 将自己的项目经历完美的展示出来非常重要，重点是突出自己做了什么（挖掘亮点），而不是介绍项目是做什么的。
- 项目经历建议以时间倒序排序，另外项目经历不在于多（精选 2~3 即可），而在于有亮点。
- 准备面试的过程中应该将你写在简历上的东西作为重点，尤其是项目经历上和技能介绍上的。
- 面试和工作是两回事，聪明的人会把面试官往自己擅长的领域领，其他人则被面试官牵着鼻子走。虽说面试和工作是两回事，但是你要想要获得自己满意的 offer ，你自身的实力必须要强。

## 简历修改

到目前为止，我至少帮助 **6000+** 位球友提供了免费的简历修改服务。由于个人精力有限，修改简历仅限加入星球的读者，需要帮看简历的话，可以加入 [**JavaGuide 官方知识星球**](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html#%E7%AE%80%E5%8E%86%E4%BF%AE%E6%94%B9)（点击链接查看详细介绍）。

![img](https://oss.javaguide.cn/xingqiu/%E7%AE%80%E5%8E%86%E4%BF%AE%E6%94%B92.jpg)

虽然收费只有培训班/训练营的百分之一，但是知识星球里的内容质量更高，提供的服务也更全面，非常适合准备 Java 面试和学习 Java 的同学。

下面是星球提供的部分服务（点击下方图片即可获取知识星球的详细介绍）：

[![星球服务](https://oss.javaguide.cn/xingqiu/xingqiufuwu.png)](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)

这里再提供一份限时专属优惠卷：

![知识星球30元优惠卷](https://oss.javaguide.cn/xingqiu/xingqiuyouhuijuan-30.jpg)


---

<!-- source: 面试太紧张怎么办？.md -->

---
title: 面试太紧张怎么办？
description: 面试太紧张影响发挥怎么办？从心态调整、提前准备到模拟面试与表达训练，提供一套可落地的方法，帮助你降低焦虑、提升临场表现，更稳定地通过技术面试。
category: 面试准备
icon: "mdi:shield-lock-outline"
head:
  - - meta
    - name: keywords
      content: 面试紧张,技术面试,面试心态,临场发挥,模拟面试,表达训练,面试准备,校招
---

很多小伙伴在第一次技术面试时都会感到紧张甚至害怕，遇到稍微刁钻的问题大脑就一片空白，面试结束后还会有种“懵懵的”感觉。我也经历过类似的状况，对这种手心出汗、语无伦次的窘境深有体会。

其实，**紧张是非常正常的生理和心理反应**——它代表你对这次机会的重视，也源于人类对未知结果的天然担忧。但如果任由过度紧张蔓延，绝对会大幅折损你的临场发挥水平。

下面，我将结合自己的实战经验，从**心态重塑、战术准备、临场应对、面后复盘**四个维度，分享一套可落地的“抗紧张”指南。

## 试着接受紧张情绪，调整心态

首先要明白，紧张是正常情绪，特别是初次或前几次面试时，多少都会有点忐忑。不要过分排斥这种情绪，可以适当地“拥抱”它：

- **搞清楚面试的本质**：面试本质上是一场与面试官的深入交流，是一个双向选择的过程。面试失败并不意味着你的价值和努力被否定，而可能只是因为你与目标岗位暂时不匹配，或者仅仅是一次 KPI 面试，这家公司可能压根就没有真正的招聘需求。失败的原因也可能是某些知识点、项目经验或表达方式未能充分展现出你的能力。即便这次面试未通过，也不妨碍你继续尝试其他公司，完全不慌！
- **不要害怕面试官**：很多求职者平时和同学朋友交流沟通的蛮好，一到面试就害怕了。面试官和求职者双方是平等的，以后说不定就是同事关系。也不要觉得面试官就很厉害，实际上，面试官的水平也参差不齐。他们提出的问题，可能自己也没有完全理解。
- **给自己积极的心理暗示**：告诉自己“有点紧张没关系，这只能让我更专注，心跳加快是我在给自己打气，我一定可以回答的很好！”。

## 提前准备，减少不确定性

**不确定性越多，越容易紧张。** 如果你能够在面试前做充分的准备，很多“未知”就会消失，紧张情绪自然会减轻很多。

### 认真准备技术面试

- **优先梳理核心知识点**：比如计算基础、数据库、Java 基础、Java 集合、并发编程、SpringBoot（这里以 Java 后端方向为例）等。如果时间不够，可以分轻重缓急，有重点地复习。如果你想要系统准备 Java 后端面试但又不知道如何开始的，可以参考 [Java 后端面试通关计划（后端通用）](https://javaguide.cn/面试准备/backend-interview-plan.html)。
- **精心准备项目经历**：认真思考你简历上最重要的项目（面试以前两个项目为主，尤其是第一个），它们的技术难点、业务逻辑、架构设计，以及可能被面试官深挖的点。把你的思考总结成可能出现的面试问题，并尝试回答。

### 模拟面试和自测

- **约朋友或同学互相提问**：以真实的面试场景来进行演练，并及时对回答进行诊断和反馈。
- **线上练习**：直接利用 AI 来进行模拟面试即可，免费且高效。把自己的简历投喂给它，让它根据你的简历，尤其是项目经历生成面试问题。
- **面经**：平时可以多看一些前辈整理的面经，尤其是目标岗位或目标公司的面经，总结高频考点和常见问题。
- **技术面试题自测**：在 [《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html) 的 「技术面试题自测篇」 ，我总结了 Java 面试中最重要的知识点的最常见的面试题并按照面试提问的方式展现出来。其中，每一个问题都有提示和重要程度说明，非常适合用来自测。

[《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html) 的 「技术面试题自测篇」概览：

![技术面试题自测篇](https://oss.javaguide.cn/javamianshizhibei/technical-interview-questions-self-test.png)

### 多表达

平时要多说，多表达出来，不要只是在心里面想，不然真正面试的时候会发现想的和说的不太一样。

我前面推荐的模拟面试和自测，有一部分原因就是为了能够多多表达。

### 多面试

- **先小厂后大厂**：可以先去一些规模较小或者对你来说压力没那么大的公司试试手，积累一些实战经验，增加一些信心；等熟悉了面试流程、能够更从容地回答问题后，再去挑战自己心仪的大厂或热门公司。
- **积累“失败经验”**：不要怕被拒，有些时候被拒绝却能从中学到更多。多复盘，多思考到底是哪个环节出了问题，再用更好的状态迎接下一次面试。

### 保证休息

- **留出充裕时间**：面试前尽量不要排太多事情，保证自己能有个好状态去参加面试。
- **保证休息**：充足睡眠有助于情绪稳定，也能让你在面试时更清晰地思考问题。

## 遇到不会的问题不要慌

一场面试，不太可能面试官提的每一个问题你都能轻松应对，除非这场面试非常简单。

在面试过程中，遇到不会的问题，首先要做的是快速回顾自己过往的知识，看是否能找到突破口。如果实在没有思路的话，可以真诚地向面试要一些提示比如谈谈你对这个问题的理解以及困惑点。一定不要觉得向面试官要提示很可耻，只要沟通没问题，这其实是很正常的。最怕的就是自己不会，还乱回答一通，这样会让面试官觉得你技术态度有问题。

## 面试结束后的复盘

很多人关注面试前的准备，却忽略了面试后的复盘，这一步真的非常非常非常重要：

1. **记录面试中的问题**：无论回答得好坏，都把它们写下来。如果问到了一些没想过的问题，可以认真思考并在面试后补上答案。
2. **反思自己的表现**：有没有遇到卡壳的地方？是知识没准备到还是过于紧张导致表达混乱？下次如何改进？
3. **持续完善自己的“面试题库”**：把新的问题补充进去，不断拓展自己的知识面，也逐步降低对未知问题的恐惧感。


---

<!-- source: 如何高效准备Java面试？.md -->

---
title: 如何高效准备Java面试？
description: 如何高效准备Java面试：从求职导向学习、技能清单制定到简历优化与面试冲刺，提供系统化备战方法，帮助你少走弯路、提高面试通过率。
category: 知识星球
icon: "mdi:map-marker-path"
head:
  - - meta
    - name: keywords
      content: Java面试准备,高效备战面试,求职导向学习,面试冲刺,简历优化,项目准备,校招,Java后端
---

::: tip 友情提示
本文节选自 **[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)**。这是一份教你如何更高效地准备面试的专栏，内容和 JavaGuide 互补，涵盖常见八股文（系统设计、常见框架、分布式、高并发 ……）、优质面经等内容。
:::

你身边是否有这样的朋友：编程能力比你强，求职结果却不如你？其实**技术好≠面试能过** —— 如今的面试早已不是 “会写代码就行”，不做准备就去面，大概率是 “撞枪口”。

我们大多是普通开发者，没有顶会论文或竞赛大奖加持，面对 “面试造火箭，工作拧螺丝钉” 的常态，只能靠扎实准备突围。但准备面试不等于耍小聪明或者死记硬背面试题。 **一定不要对面试抱有侥幸心理。打铁还需自身硬！** 千万不要觉得自己看几篇面经，看几篇面试题解析就能通过面试了。一定要静下心来深入学习！

这篇文章就从宏观视角，带你搞懂程序员该如何系统准备面试：从求职导向学习，到简历优化、面试冲刺，帮你少走弯路，高效拿下心仪 offer。

## 尽早以求职为导向来学习

我是比较建议还在学校的同学尽可能早一点以求职为导向来学习的。

**这样更有针对性，并且可以大概率减少自己处在迷茫的时间，很大程度上还可以让自己少走很多弯路。**

但是！不要把“以求职为导向学习”理解为“我就不用学课堂上那些计算机基础课程了”！

我在之前的很多次分享中都强调过：**一定要用心学习计算机基础知识！操作系统、计算机组成原理、计算机网络真的不是没有实际用处的学科！！！**

你会发现大厂面试你会用到，以后工作之后你也会用到。我分别列举 2 个例子吧！

- **面试中**：像字节、腾讯这些大厂的技术面试以及几乎所有公司的笔试都会考操作系统相关的问题。
- **工作中**：在实际使用缓存的时候，软件层次而言的缓存思想，则是源自数据库速度、Redis（内存中间件）速度、本地内存速度之间的不匹配；而在计算机存储层次结构设计中，我们也能发现同样的问题及缓存思想的使用：内存用于解决磁盘访问速度过慢的问题，CPU 用三级缓存缓解寄存器和内存之间的速度差异。它们面临的都是同一个问题（速度不匹配）和同一个思想，那么计算机先驱者在存储层次结构设计上对缓存性能的优化措施，同样也适用于软件层次缓存的性能优化。

**如何求职为导向学习呢？** 简答来说就是：根据招聘要求整理一份目标岗位的技能清单，然后按照技能清单去学习和提升。

1. 你首先搞清楚自己要找什么工作
2. 然后根据招聘岗位的要求梳理一份技能清单
3. 根据技能清单写好最终的简历
4. 最后再按照简历的要求去学习和提升。

这其实也是 **以终为始** 思想的运用。

**何为以终为始？** 简单来说，以终为始就是我们可以站在结果来考虑问题，从结果出发，根据结果来确定自己要做的事情。

你会发现，其实几乎任何领域都可以用到 **以终为始** 的思想。

## 了解投递简历的黄金时间

面试之前，你肯定是先要搞清楚春招和秋招的具体时间的。

正所谓金三银四，金九银十，错过了这个时间，很多公司都没有 HC 了。

**秋招一般 7 月份就开始了，大概一直持续到 9 月底。**

**春招一般 3 月份就开始了，大概一直持续到 4 月底。**

很多公司（尤其大厂）到了 9 月中旬(秋招)/3 月中旬（春招），很可能就会没有 HC 了。面试的话一般都是至少是 3 轮起步，一些大厂比如阿里、字节可能会有 5 轮面试。**面试失败话的不要紧，某一面表现差的话也不要紧，调整好心态。又不是单一选择对吧？你能投这么多企业呢! 调整心态。** 今年面试的话，因为疫情原因，有些公司还是可能会还是集中在线上进行面试。然后，还是因为疫情的影响，可能会比往年更难找工作（对大厂影响较小）。

## 知道如何获取招聘信息

下面是常见的获取招聘信息的渠道：

- **目标企业的官网/公众号**：最及时最权威的获取招聘信息的途径。
- **招聘网站**：[BOSS 直聘](https://www.zhipin.com/)、[智联招聘](https://www.zhaopin.com/)、[拉勾招聘](https://www.lagou.com/)……。
- **牛客网**：每年秋招/春招，都会有大批量的公司会到牛客网发布招聘信息，并且还会有大量的公司员工来到这里发内推的帖子。地址：<https://www.nowcoder.com/jobs/recommend/campus> 。
- **超级简历**：超级简历目前整合了各大企业的校园招聘入口，地址：<https://www.wondercv.com/jobs/。如果你是校招的话，点击“校招网申”就可以直接跳转到各大企业的校园招聘入口的整合页面了。>
- **认识的朋友**：如果你有认识的朋友在目标企业工作的话，你也可以找他们了解招聘信息，并且可以让他们帮你内推。
- **宣讲会**：宣讲会也是一个不错的途径，不过，好的企业通常只会去比较好的学校，可以留意一下意向公司的宣讲会安排或者直接去到一所比较好的学校参加宣讲会。像我当时校招就去参加了几场宣讲会。不过，我是在荆州上学，那边没什么比较好的学校，一般没有公司去开宣讲会。所以，我当时是直接跑到武汉来了，参加了武汉理工大学以及华中科技大学的几场宣讲会。总体感觉还是很不错的！
- **其他**：校园就业信息网、学校论坛、班级 or 年级 QQ 群。

校招的话，建议以官网为准，有宣讲会的话更好。社招的话，可以多留意一下各大招聘网站比如 BOSS 直聘、拉勾上的职位信息。

不论校招和社招，如果能找到比较靠谱的内推机会的话，获得面试的机会的概率还是非常大的。而且，你可以让内推你的人定向地给你一些建议。找内推的方式有很多，首选比较熟悉的朋友、同学，还可以留意技术交流社区和公众号上的内推信息。

一般是只能投递一个岗位，不过，也有极少数投递不同部门两个岗位的情况，这个应该不会有影响，但你的前一次面试情况可能会被记录，也就是说就算你投递成功两个岗位，第一个岗位面试失败的话，对第二个岗位也会有影响，很可能直接就被 pass。

## 多花点时间完善简历

一定一定一定要重视简历啊！朋友们！至少要花 2~3 天时间来专门完善自己的简历。

最近看了很多份简历，满意的很少，我简单拿出一份来说分析一下（欢迎在评论区补充）。

**1.个人介绍没太多实用的信息。**

![](https://oss.javaguide.cn/github/javaguide/面试准备/format,png.png)

技术博客、GitHub 以及在校获奖经历的话，能写就尽量写在这里。 你可以参考下面 👇 的模板进行修改：

![](https://oss.javaguide.cn/github/javaguide/面试准备/format,png-20230309224235808.png)

**2.项目经历过于简单，完全没有质量可言**

![](https://oss.javaguide.cn/github/javaguide/面试准备/format,png-20230309224240305.png)

每一个项目经历真的就一两句话可以描述了么？还是自己不想写？还是说不是自己做的，不敢多写。

如果有项目的话，技术面试第一步，面试官一般都是让你自己介绍一下你的项目。你可以从下面几个方向来考虑：

1. 你对项目整体设计的一个感受（面试官可能会让你画系统的架构图）
2. 你在这个项目中你负责了什么、做了什么、担任了什么角色。
3. 从这个项目中你学会了那些东西，使用到了那些技术，学会了那些新技术的使用。
4. 你在这个项目中是否解决过什么问题？怎么解决的？收获了什么？
5. 你的项目用到了哪些技术？这些技术你吃透了没有？举个例子，你的项目经历使用了 Seata 来做分布式事务，那 Seata 相关的问题你要提前准备一下吧，比如说 Seata 支持哪些配置中心、Seata 的事务分组是怎么做的、Seata 支持哪些事务模式，怎么选择？
6. 你在这个项目中犯过的错误，最后是怎么弥补的？

**3.计算机二级这个证书对于计算机专业完全不用写了，没有含金量的。**

![](https://oss.javaguide.cn/github/javaguide/面试准备/format,png-20230309224247261.png)

**4.技能介绍问题太大。**

![](https://oss.javaguide.cn/github/javaguide/面试准备/93da1096fb02e19071ba13b4f6a7471c.png)

- 技术名词最好规范大小写比较好，比如 java->Java ，spring boot -> Spring Boot 。这个虽然有些面试官不会介意，但是很多面试官都会在意这个细节的。
- 技能介绍太杂，没有亮点。不需要全才，某个领域做得好就行了！
- 对 Java 后台开发的部分技能比如 Spring Boot 的熟悉度仅仅为了解，无法满足企业的要求。

详细的程序员简历编写指南请参考：[程序员简历到底该怎么写？](https://javaguide.cn/面试准备/resume-guide.html)。

## 岗位匹配度很重要

校招通常会对你的项目经历的研究方向比较宽容，即使你的项目经历和对应公司的具体业务没有关系，影响其实也并不大。

社招的话就不一样了，毕竟公司是要招聘可以直接来干活的人，你有相关的经验，公司会比较省事。社招通常会比较重视你的过往工作经历以及项目经历，HR 在筛选简历的时候会根据这两方面信息来判断你是否满足他们的招聘要求。就比如说你投递电商公司，而你之前的并没有和电商相关的工作经历以及项目经历，那 HR 在筛简历的时候很可能会直接把你 Pass 掉。

不过，这个也并不绝对，也有一些公司在招聘的时候更看重的是你的过往经历，较少地关注岗位匹配度，优秀公司的工作经历以及有亮点的项目经验都是加分项。这类公司相信你既然在某个领域（比如电商、支付）已经做的不错了，那应该也可以在另外一个领域（比如流媒体平台、社交软件）很快成为专家。这个领域指的不是技术领域，更多的是业务方向。横跨技术领域（比如后端转算法、后端转大数据）找工作，你又没有相关的经验，几乎是没办法找到的。即使找到了，也大概率会面临 HR 压薪资的问题。

## 提前准备技术面试

面试之前一定要提前准备一下常见的面试题也就是八股文：

- 自己面试中可能涉及哪些知识点、那些知识点是重点。
- 面试中哪些问题会被经常问到、面试中自己该如何回答。(强烈不推荐死记硬背，第一：通过背这种方式你能记住多少？能记住多久？第二：背题的方式的学习很难坚持下去！)

Java 后端面试复习的重点请看这篇文章：[Java 面试重点总结(重要)](https://javaguide.cn/面试准备/key-points-of-interview.html)。

不同类型的公司对于技能的要求侧重点是不同的比如腾讯、字节可能更重视计算机基础比如网络、操作系统这方面的内容。阿里、美团这种可能更重视你的项目经历、实战能力。

一定不要抱着一种思想，觉得八股文或者基础问题的考查意义不大。如果你抱着这种思想复习的话，那效果可能不会太好。实际上，个人认为还是很有意义的，八股文或者基础性的知识在日常开发中也会需要经常用到。例如，线程池这块的拒绝策略、核心参数配置什么的，如果你不了解，实际项目中使用线程池可能就用的不是很明白，容易出现问题。而且，其实这种基础性的问题是最容易准备的，像各种底层原理、系统设计、场景题以及深挖你的项目这类才是最难的！

八股文资料首推我的 [《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html) (配合 JavaGuide 使用，会根据每一年的面试情况对内容进行更新完善)和 [JavaGuide](https://javaguide.cn/) 。里面不仅仅是原创八股文，还有很多对实际开发有帮助的干货。除了我的资料之外，你还可以去网上找一些其他的优质的文章、视频来看。

![《Java 面试指北》内容概览](https://oss.javaguide.cn/javamianshizhibei/javamianshizhibei-content-overview.png)

## 提前准备手撕算法

很明显，国内现在的校招面试开始越来越重视算法了，尤其是像字节跳动、腾讯这类大公司。绝大部分公司的校招笔试是有算法题的，如果 AC 率比较低的话，基本就挂掉了。

社招的话，算法面试同样会有。不过，面试官可能会更看重你的工程能力，你的项目经历。如果你的其他方面都很优秀，但是算法很菜的话，不一定会挂掉。不过，还是建议刷下算法题，避免让其成为自己在面试中的短板。

社招往往是在技术面试的最后，面试官给你一个算法题目让你做。

关于如何准备算法面试[《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html) 的面试准备篇有详细介绍到。

![《Java 面试指北》面试准备篇](https://oss.javaguide.cn/javamianshizhibei/preparation-for-interview.png)

## 提前准备自我介绍

自我介绍一般是你和面试官的第一次面对面正式交流，换位思考一下，假如你是面试官的话，你想听到被你面试的人如何介绍自己呢？一定不是客套地说说自己喜欢编程、平时花了很多时间来学习、自己的兴趣爱好是打球吧？

我觉得一个好的自我介绍至少应该包含这几点要素：

- 用简洁的话说清楚自己主要的技术栈于擅长的领域；
- 把重点放在自己在行的地方以及自己的优势之处；
- 重点突出自己的能力比如自己的定位的 bug 的能力特别厉害；

简单来说就是用简洁的语言突出自己的亮点，也就是推销自己嘛！

- 如果你去过大公司实习，那对应的实习经历就是你的亮点。
- 如果你参加过技术竞赛，那竞赛经历就是你的亮点。
- 如果你大学就接触过企业级项目的开发，实战经验比较多，那这些项目经历就是你的亮点。
- ……

从社招和校招两个角度来举例子吧！我下面的两个例子仅供参考，自我介绍并不需要死记硬背，记住要说的要点，面试的时候根据公司的情况临场发挥也是没问题的。另外，网上一般建议的是准备好两份自我介绍：一份对 hr 说的，主要讲能突出自己的经历，会的编程技术一语带过；另一份对技术面试官说的，主要讲自己会的技术细节和项目经验。

**社招：**

> 面试官，您好！我叫独秀儿。我目前有 1 年半的工作经验，熟练使用 Spring、MyBatis 等框架、了解 Java 底层原理比如 JVM 调优并且有着丰富的分布式开发经验。离开上一家公司是因为我想在技术上得到更多的锻炼。在上一个公司我参与了一个分布式电子交易系统的开发，负责搭建了整个项目的基础架构并且通过分库分表解决了原始数据库以及一些相关表过于庞大的问题，目前这个网站最高支持 10 万人同时访问。工作之余，我利用自己的业余时间写了一个简单的 RPC 框架，这个框架用到了 Netty 进行网络通信， 目前我已经将这个项目开源，在 GitHub 上收获了 2k 的 Star! 说到业余爱好的话，我比较喜欢通过博客整理分享自己所学知识，现在已经是多个博客平台的认证作者。 生活中我是一个比较积极乐观的人，一般会通过运动打球的方式来放松。我一直都非常想加入贵公司，我觉得贵公司的文化和技术氛围我都非常喜欢，期待能与你共事！

**校招：**

> 面试官，您好！我叫秀儿。大学时间我主要利用课外时间学习了 Java 以及 Spring、MyBatis 等框架 。在校期间参与过一个考试系统的开发，这个系统的主要用了 Spring、MyBatis 和 shiro 这三种框架。我在其中主要担任后端开发，主要负责了权限管理功能模块的搭建。另外，我在大学的时候参加过一次软件编程大赛，我和我的团队做的在线订餐系统成功获得了第二名的成绩。我还利用自己的业余时间写了一个简单的 RPC 框架，这个框架用到了 Netty 进行网络通信， 目前我已经将这个项目开源，在 GitHub 上收获了 2k 的 Star! 说到业余爱好的话，我比较喜欢通过博客整理分享自己所学知识，现在已经是多个博客平台的认证作者。 生活中我是一个比较积极乐观的人，一般会通过运动打球的方式来放松。我一直都非常想加入贵公司，我觉得贵公司的文化和技术氛围我都非常喜欢，期待能与你共事！

## 减少抱怨

就像现在的技术面试一样，大家都说内卷了，抱怨现在的面试真特么难。然而，单纯抱怨有用么？你对其他求职者说：“大家都不要刷 Leetcode 了啊！都不要再准备高并发、高可用的面试题了啊！现在都这么卷了！”

会有人听你的么？**你不准备面试，但是其他人会准备面试啊！那你是不是傻啊？还是真的厉害到不需要准备面试呢？**

因此，准备 Java 面试的第一步，我们一定要尽量减少抱怨。抱怨的声音多了之后，会十分影响自己，会让自己变得十分焦虑。

## 面试之后及时复盘

如果失败，不要灰心；如果通过，切勿狂喜。面试和工作实际上是两回事，可能很多面试未通过的人，工作能力比你强的多，反之亦然。

面试就像是一场全新的征程，失败和胜利都是平常之事。所以，劝各位不要因为面试失败而灰心、丧失斗志。也不要因为面试通过而沾沾自喜，等待你的将是更美好的未来，继续加油！

## 总结

这篇文章内容有点多，如果这篇文章只能让你记住 7 句话，那请记住下面这 7 句：

1. 一定要提前准备面试！技术面试不同于编程，编程厉害不代表技术面试就一定能过。
2. 一定不要对面试抱有侥幸心理。打铁还需自身硬！千万不要觉得自己看几篇面经，看几篇面试题解析就能通过面试了。一定要静下心来深入学习！尤其是目标是大厂的同学，那更要深挖原理！
3. 建议大学生尽可能早一点以求职为导向来学习的。这样更有针对性，并且可以大概率减少自己处在迷茫的时间，很大程度上还可以让自己少走很多弯路。 但是，不要把“以求职为导向学习”理解为“我就不用学课堂上那些计算机基础课程了”！
4. 一定不要抱着一种思想，觉得八股文或者基础问题的考查意义不大。如果你抱着这种思想复习的话，那效果可能不会太好。实际上，个人认为还是很有意义的，八股文或者基础性的知识在日常开发中也会需要经常用到。例如，线程池这块的拒绝策略、核心参数配置什么的，如果你不了解，实际项目中使用线程池可能就用的不是很明白，容易出现问题。
5. 手撕算法是当下技术面试的标配，尽早准备！
6. 岗位匹配度很重要。校招通常会对你的项目经历的研究方向比较宽容，即使你的项目经历和对应公司的具体业务没有关系，影响其实也并不大。社招的话就不一样了，毕竟公司是要招聘可以直接来干活的人，你有相关的经验，公司会比较省事。

7. 面试之后及时复盘。面试就像是一场全新的征程，失败和胜利都是平常之事。所以，劝各位不要因为面试失败而灰心、丧失斗志。也不要因为面试通过而沾沾自喜，等待你的将是更美好的未来，继续加油！


---

<!-- source: 项目经验指南.md -->

---
title: 项目经验指南
description: 项目经验指南：针对没有项目/项目平淡的求职者，给出获取实战项目经验的方法与选择建议，并讲清如何做出项目亮点、如何复盘与表达，提升简历与面试竞争力。
category: 面试准备
icon: "mdi:projector-screen-outline"
head:
  - - meta
    - name: keywords
      content: 项目经验,校招项目,实战项目,项目亮点,简历项目描述,后端项目,面试项目准备,项目复盘
---

::: tip 友情提示
本文节选自 **[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)**。这是一份教你如何更高效地准备面试的专栏，内容和 JavaGuide 互补，涵盖常见八股文（系统设计、常见框架、分布式、高并发 ……）、优质面经等内容。
:::

## 没有项目经验怎么办?

没有项目经验是大部分应届生会碰到的一个问题。甚至说，有很多有工作经验的程序员，对自己在公司做的项目不满意，也想找一个比较有技术含量的项目来做。

说几种我觉得比较靠谱的获取项目经验的方式，希望能够对你有启发。

### 实战项目视频/专栏

在网上找一个符合自己能力与找工作需求的实战项目视频或者专栏，跟着老师一起做。

你可以通过慕课网、哔哩哔哩、拉勾、极客时间、培训机构（比如黑马、尚硅谷）等渠道获取到适合自己的实战项目视频/专栏。

![慕课网实战课](https://oss.javaguide.cn/javamianshizhibei/mukewangzhiazhanke.png)

尽量选择一个适合自己的项目，没必要必须做分布式/微服务项目，对于绝大部分同学来说，能把一个单机项目做好就已经很不错了。

我面试过很多求职者，简历上看着有微服务的项目经验，结果随便问两个问题就知道根本不是自己做的或者说做的时候压根没认真思考。这种情况会给我留下非常不好的印象。

我在 **[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)** 的「面试准备篇」中也说过：

> 个人认为也没必要非要去做微服务或者分布式项目，不一定对你面试有利。微服务或者分布式项目涉及的知识点太多，一般人很难吃透。并且，这类项目其实对于校招生来说稍微有一点超标了。即使你做出来，很多面试官也会认为不是你独立完成的。
>
> 其实，你能把一个单体项目做到极致也很好，对于个人能力提升不比做微服务或者分布式项目差。如何做到极致？代码质量这里就不提了，更重要的是你要尽量让自己的项目有一些亮点（比如你是如何提升项目性能的、如何解决项目中存在的一个痛点的），项目经历取得的成果尽量要量化一下比如我使用 xxx 技术解决了 xxx 问题，系统 qps 从 xxx 提高到了 xxx。

跟着老师做的过程中，你一定要有自己的思考，不要浅尝辄止。对于很多知识点，别人的讲解可能只是满足项目就够了，你自己想多点知识的话，对于重要的知识点就要自己学会去深入学习。

### 实战类开源项目

GitHub 或者码云上面有很多实战类别项目，你可以选择一个来研究，为了让自己对这个项目更加理解，在理解原有代码的基础上，你可以对原有项目进行改进或者增加功能。

你可以参考 [Java 优质开源实战项目](https://javaguide.cn/开源项目/practical-project.html "Java 优质开源实战项目") 上面推荐的实战类开源项目，质量都很高，项目类型也比较全面，涵盖博客/论坛系统、考试/刷题系统、商城系统、权限管理系统、快速开发脚手架以及各种轮子。

![Java 优质开源实战项目](https://oss.javaguide.cn/javamianshizhibei/javaguide-practical-project.png)

一定要记住：**不光要做，还要改进，改善。不论是实战项目视频或者专栏还是实战类开源项目，都一定会有很多可以完善改进的地方。**

### 从头开始做

自己动手去做一个自己想完成的东西，遇到不会的东西就临时去学，现学现卖。

这个要求比较高，我建议你已经有了一个项目经验之后，再采用这个方法。如果你没有做过项目的话，还是老老实实采用上面两个方法比较好。

### 参加各种大公司组织的各种大赛

如果参加这种赛事能获奖的话，项目含金量非常高。即使没获奖也没啥，也可以写简历上。

![阿里云天池大赛](https://oss.javaguide.cn/xingqiu/up-673f598477242691900a1e72c5d8b26df2c.png)

### 参与实际项目

通常情况下，你有如下途径接触到企业实际项目的开发：

1. 老师接的项目；
2. 自己接的私活；
3. 实习/工作接触到的项目；

老师接的项目和自己接的私活通常都是一些偏业务的项目，很少会涉及到性能优化。这种情况下，你可以考虑对项目进行改进，别怕花时间，某个时间用心做好一件事情就好比如你对项目的数据模型进行改进、引入缓存提高访问速度等等。

实习/工作接触到的项目类似，如果遇到一些偏业务的项目，也是要自己私下对项目进行改进优化。

尽量是真的对项目进行了优化，这本身也是对个人能力的提升。如果你实在是没时间去实践的话，也没关系，吃透这个项目优化手段就好，把一些面试可能会遇到的问题提前准备一下。

## 有没有还不错的项目推荐？

**[《Java 面试指北》](../专栏/Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md)** 的「面试准备篇」中有一篇文章专门整理了一些比较高质量的实战项目，包含业务项目、轮子项目、国外公开课 Lab 和视频类实战项目教程推荐，非常适合用来学习或者作为项目经验。

![优质 Java 实战项目推荐](https://oss.javaguide.cn/javamianshizhibei/project-experience-guide.png)

这篇文章一共推荐了 15+ 个实战项目，有业务类的，也有轮子类的，有开源项目、也有视频教程。对于参加校招的小伙伴，我更建议做一个业务类项目加上一个轮子类的项目。

## 我跟着视频做的项目会被面试官嫌弃不？

很多应届生都是跟着视频做的项目，这个大部分面试官都心知肚明。

不排除确实有些面试官不吃这一套，这个也看人。不过我相信大多数面试官都是能理解的，毕竟你在学校的时候实际上是没有什么获得实际项目经验的途径的。

大部分应届生的项目经验都是自己在网上找的或者像你一样买的付费课程跟着做的，极少部分是比较真实的项目。 从你能想着做一个实战项目来说，我觉得初衷是好的，确实也能真正学到东西。 但是，究竟有多少是自己掌握了很重要。看视频最忌讳的是被动接受，自己多改进一下，多思考一下！就算是你跟着视频做的项目，也是可以优化的！

**如果你想真正学到东西的话，建议不光要把项目单纯完成跑起来，还要去自己尝试着优化！**

简单说几个比较容易的优化点：

1. **全局异常处理**：很多项目这方面都做的不是很好，可以参考我的这篇文章：[《使用枚举简单封装一个优雅的 Spring Boot 全局异常处理！》](https://mp.weixin.qq.com/s/Y4Q4yWRqKG_lw0GLUsY2qw) 来做优化。
2. **项目的技术选型优化**：比如使用 Guava 做本地缓存的地方可以换成 **Caffeine** 。Caffeine 的各方面的表现要更加好！再比如 Controller 层是否放了太多的业务逻辑。
3. **数据库方面**：数据库设计可否优化？索引是否使用使用正确？SQL 语句是否可以优化？是否需要进行读写分离？
4. **缓存**：项目有没有哪些数据是经常被访问的？是否引入缓存来提高响应速度？
5. **安全**：项目是否存在安全问题？
6. ……

另外，我在星球分享过常见的性能优化方向实践案例，涉及到多线程、异步、索引、缓存等方向，强烈推荐你看看：<https://t.zsxq.com/06EqfeMZZ> 。

最后，**再给大家推荐一个 IDEA 优化代码的小技巧，超级实用！**

分析你的代码：右键项目-> Analyze->Inspect Code

![](https://oss.javaguide.cn/xingqiu/up-651672bce128025a135c1536cd5dc00532e.png)

扫描完成之后，IDEA 会给出一些可能存在的代码坏味道比如命名问题。

![](https://oss.javaguide.cn/xingqiu/up-05c83b319941995b07c8020fddc57f26037.png)

并且，你还可以自定义检查规则。

![](https://oss.javaguide.cn/xingqiu/up-6b618ad3bad0bc3f76e6066d90c8cd2f255.png)


---

<!-- source: 校招没有实习经历怎么办？实习经历怎么写？.md -->

---
title: 校招没有实习经历怎么办？实习经历怎么写？
description: 校招没有实习经历也能上岸：从补强项目经验、持续优化简历到系统准备技术面试，给出可执行的提升路径与注意事项，帮助你在没有大厂实习的情况下提高面试通过率。
category: 面试准备
icon: "mdi:chart-timeline-variant"
head:
  - - meta
    - name: keywords
      content: 校招,实习经历,没有实习怎么办,项目经验,简历优化,技术面试准备,Java后端,秋招
---

<!-- @include: @small-advertisement.snippet.md -->

由于目前的面试太卷，对于犹豫是否要找实习的同学来说，个人建议不论是本科生还是研究生都应该在参加校招面试之前，争取一下不错的实习机会，尤其是大厂的实习机会，日常实习或者暑期实习都可以。当然，如果大厂实习面不上，中小厂实习也是可以接受的。

不过，现在的实习是真难找，这两年有非常多的同学没有找到实习，有一部分甚至是 211/985 名校的同学。实习难找是一方面原因，国内很多学校的导师压根不放实习，这也是很棘手的问题。

## 没有实习经历怎么办？

如果实在是找不到合适的实习的话，那也没办法，我们应该多花时间去把下面这三件事情给做好：

1. 补强项目经历
2. 持续完善简历
3. 准备技术面试

### 补强项目经历

校招没有实习经历的话，找工作比较吃亏（没办法，太卷了），需要在项目经历部分多发力弥补一下。

建议你尽全力地去补强自己的项目经历，完善现有的项目或者去做更有亮点的项目，尽可能地通过项目经历去弥补一些。

你面试中的重点就是你的项目经历涉及到的知识点，如果你的项目经历比较简单的话，面试官直接不知道问啥了。另外，你的项目经历中不涉及的知识点，但在技能介绍中提到的知识点也很大概率会被问到。像 Redis 这种基本是面试 Java 后端岗位必备的技能，我觉得大部分面试官应该都会问。

推荐阅读一下网站的这篇文章：[项目经验指南](https://javaguide.cn/面试准备/project-experience-guide.html)。

### 完善简历

一定一定一定要重视简历啊！建议至少花 2~3 天时间来专门完善自己的简历。并且，后续还要持续完善。

对于面试官来说，筛选简历的时候会比较看重下面这些维度：

1. **实习/工作经历**：看你是否有不错的实习经历，大厂且与面试岗位相关的实习/工作经历最佳。
2. **获奖经历**：如果有含金量比较高（知名度较高的赛事比如 ACM、阿里云天池）的获奖经历的话，也是加分点，尤其是对于校招来说，这类求职者属于是很多大厂争抢的对象（但不是说获奖了就能进大厂，还是要面试表现还可以）。对于社招来说，获奖经历作用相对较小，通常会更看重过往的工作经历和项目经验。
3. **项目经验**：项目经验对于面试来说非常重要，面试官会重点关注，同时也是有水平的面试提问的重点。
4. **技能匹配度**：看你的技能是否满足岗位的需求。在投递简历之前，一定要确认一下自己的技能介绍中是否缺少一些你要投递的对应岗位的技能要求。
5. **学历**：相对其他行业来说，程序员求职面试对于学历的包容度还是比较高的，只要你在其他方面有过人之出的话，也是可以弥补一下学历的缺陷的。你要知道，很多行业比如律师、金融，学历就是敲门砖，学历没达到要求，直接面试机会都没有。不过，由于现在面试越来越卷，一些大厂、国企和研究所也开始卡学历了，很多岗位都要求 211/985，甚至必须需要硕士学历。总之，学历很难改变，学校较差的话，就投递那些对学历没有明确要求的公司即可，努力提升自己的其他方面的硬实力。

对于大部分求职者来说，实习/工作经历、项目经验、技能匹配度更重要一些。不过，不排除一些公司会因为学历卡人。

详细的程序员简历编写指南可以参考这篇文章：[程序员简历编写指南(重要)](https://javaguide.cn/面试准备/resume-guide.html)。

### 准备技术面试

面试之前一定要提前准备一下常见的面试题也就是八股文：

- 自己面试中可能涉及哪些知识点、那些知识点是重点。
- 面试中哪些问题会被经常问到、面试中自己该如何回答。(强烈不推荐死记硬背，第一：通过背这种方式你能记住多少？能记住多久？第二：背题的方式的学习很难坚持下去！)

不同类型的公司对于技能的要求侧重点是不同的比如腾讯、字节可能更重视计算机基础比如网络、操作系统这方面的内容。阿里、美团这种可能更重视你的项目经历、实战能力。

一定不要抱着一种思想，觉得八股文或者基础问题的考查意义不大。如果你抱着这种思想复习的话，那效果可能不会太好。实际上，个人认为还是很有意义的，八股文或者基础性的知识在日常开发中也会需要经常用到。例如，线程池这块的拒绝策略、核心参数配置什么的，如果你不了解，实际项目中使用线程池可能就用的不是很明白，容易出现问题。而且，其实这种基础性的问题是最容易准备的，像各种底层原理、系统设计、场景题以及深挖你的项目这类才是最难的！

八股文资料首推我的 [《Java 面试指北》](https://javaguide.cn/专栏/java-mian-shi-zhi-bei.html) 和 [JavaGuide](https://javaguide.cn/home.html) 。里面不仅仅是原创八股文，还有很多对实际开发有帮助的干货。除了我的资料之外，你还可以去网上找一些其他的优质的文章、视频来看。

如果你想要系统准备 Java 后端面试但又不知道如何开始的，可以参考 [Java 后端面试通关计划（后端通用）](https://javaguide.cn/面试准备/backend-interview-plan.html)。

## 实习经历在简历上一般怎么写比较出彩？

实习经历的描述一定要避免空谈，尽量列举出你在实习期间取得的成就和具体贡献，使用具体的数据和指标来量化你的工作成果。

示例（这里假设项目细节放在实习经历这里介绍，你也可以选择将实习经历参与的项目放到项目经历中）：

1. 负责订单模块核心流程开发，实现订单状态的精确流转，并保障与库存、支付等模块的数据一致性。
2. 负责行为风控黑名单看板的开发，支持查看拉黑用户、批量拉黑以及取消拉黑。
3. 基于 Redisson + AOP 封装限流组件，实现对核心接口（如付费、课程搜索）的限流，有效防止恶意请求冲击。
4. 优化用户统计模块性能，利用 CompletableFuture 并行加载多维度数据（如用户增长、课程活跃度），，平均相应时间从 3.5s 降低到 1s。
5. 封装通用数据脱敏组件，通过自定义 Jackson 注解实现对手机号、邮箱等敏感信息的自动、无侵入式脱敏。
6. 优化文件上传模块，基于 MinIO 实现了文件的分片上传、断点续传以及极速秒传功能。
7. 排查并解决扣费模块由于扣费父任务和反作弊子任务使用同一个线程池导致的死锁问题，通过线程池隔离策略根除该隐患。
8. 实习期间独立负责 7 个功能需求与 3 个线上问题修复，代码均一次性通过评审与测试。

下面是[星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)一位球友分享的实习经历介绍，整体写的还是非常不错的：

![实习经历模板](https://oss.javaguide.cn/github/javaguide/面试准备/qiuyou-shixijingli-demo.png)

📌关于实习经历这块再多提一点：很多同学实习期间可能接触不到什么实际的开发任务，大部分时间可能都是在熟悉和维护项目。

对于这种情况，应对思路是一套组合拳：首先，你肯定是要和 mentor 沟通继续争取做一些有价值的工作，这样你的实习经历才更有价值，简历上自然就能够有东西可写。记得找一个 mentor 不那么忙的时候沟通，放低姿态，真诚一些，表明自己现有的工作已经认真完成，想要承担更多责任的意愿。其次，不管是否能够争取到这种机会，你都要自己有意识地寻找项目中适合自己研究的功能点（比如同组其他实习生干的活），进行深度挖掘。重点关注以下几个方面：

1. **这个功能是干嘛的？** 它解决了什么业务痛点？给哪个业务方用的？整个流程是怎样的？
2. **它是怎么实现的？** 用了哪些关键技术、框架或者设计模式？核心代码的逻辑是怎样的？
3. **为什么要这么设计？** 当初设计的时候有没有别的方案？现在这个方案好在哪，又有什么潜在的坑？如果让你来做，你会怎么设计？

只要你把具体的功能点彻底搞懂，那就可以在简历上合理包装成自己的成果。除了功能点开发之外，也可以包装一些合适的问题排查解决经历，这样能够体现你解决问题的能力。 面试时也不用太担心自己“露馅”，只要你选择的内容不属于那些显然不会交给实习生完成的高难度任务，并且能清晰地讲明白，就不会有问题。

