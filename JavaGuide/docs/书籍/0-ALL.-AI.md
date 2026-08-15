---
title: 书籍 AI优化汇总
---

# 书籍 AI优化汇总

> 基于 0-ALL.md 的 AI 优化版：保留原文并补充知识地图、易漏考点与工程清单。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 复习方法
- 先看本目录重点篇，再按项目需要深挖。
- 对每个主题准备：是什么 / 为什么 / 怎么做 / 对比 / 坑。
- 结合线上问题（超时、容量、一致性）反推知识点。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

1. java (`Java 必读经典书籍.md`)
2. 分布式必读经典书籍 (`分布式必读经典书籍.md`)
3. 计算机基础必读经典书籍 (`计算机基础必读经典书籍.md`)
4. 软件质量必读经典书籍 (`软件质量必读经典书籍.md`)
5. 数据库必读经典书籍 (`数据库必读经典书籍.md`)
6. 搜索引擎必读经典书籍 (`搜索引擎必读经典书籍.md`)

---

<!-- source: Java 必读经典书籍.md -->

## [1] java

---
title: java
description: Java程序员必读书籍推荐，Java基础、并发编程、JVM虚拟机、Spring/SpringBoot框架、Netty网络编程、性能调优等经典书籍精选。
category: 计算机书籍
icon: "mdi:language-java"
---

## Java 基础

**[《Head First Java》](https://book.douban.com/subject/2000732/)**

![《Head First Java》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424103035793.png)

《Head First Java》这本书的内容很轻松有趣，可以说是我学习编程初期最喜欢的几本书之一了。同时，这本书也是我的 Java 启蒙书籍。我在学习 Java 的初期多亏了这本书的帮助，自己才算是跨进 Java 语言的大门。

我觉得我在 Java 这块能够坚持下来，这本书有很大的功劳。我身边的很多朋友学习 Java 初期都是看的这本书。

有很多小伙伴就会问了：**这本书适不适合编程新手阅读呢？**

我个人觉得这本书还是挺适合编程新手阅读的，毕竟是 “Head First” 系列。

**[《Java 核心技术卷 1 + 卷 2》](https://book.douban.com/subject/34898994/)**

![《Java 核心技术卷 1》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424101217849.png)

这两本书也非常不错。不过，这两本书的内容很多，全看的话比较费时间。我现在是把这两本书当做工具书来用，就比如我平时写文章的时候，碰到一些 Java 基础方面的问题，经常就翻看这两本来当做参考！

我当时在大学的时候就买了两本放在寝室，没事的时候就翻翻。建议有点 Java 基础之后再读，介绍的还是比较深入和全面的，非常推荐。

**[《Java 编程思想》](https://book.douban.com/subject/2130190/)**

![《Java 编程思想》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424103124893.png)

另外，这本书的作者去年新出版了[《On Java》](https://book.douban.com/subject/35751619/)，我更推荐这本，内容更新，介绍了 Java 的 3 个长期支持版（Java 8、11、17）。

![](https://oss.javaguide.cn/github/javaguide/书籍/on-java/6171657600353_.pic_hd.jpg)

毕竟，这是市面上目前唯一一本介绍了 Java 的 3 个长期支持版（Java 8、11、17）的技术书籍。

**[《Java 8 实战》](https://book.douban.com/subject/26772632/)**

![《Java 8实战》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424103202625.png)

Java 8 算是一个里程碑式的版本，现在一般企业还是用 Java 8 比较多。掌握 Java 8 的一些新特性比如 Lambda、Stream API 还是挺有必要的。这块的话，我推荐 **[《Java 8 实战》](https://book.douban.com/subject/26772632/)** 这本书。

**[《Java 编程的逻辑》](https://book.douban.com/subject/30133440/)**

![《Java编程的逻辑》](https://oss.javaguide.cn/github/javaguide/书籍/image-20230721153650488.png)

一本非常低调的好书，相比于入门书来说，内容更有深度。适合初学者，同时也适合大家拿来复习 Java 基础知识。

## Java 并发

**[《Java 并发编程之美》](https://book.douban.com/subject/30351286/)**

![《Java 并发编程之美》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424112413660.png)

这本书还是非常适合我们用来学习 Java 多线程的，讲解非常通俗易懂，作者从并发编程基础到实战都是信手拈来。

另外，这本书的作者加多自身也会经常在网上发布各种技术文章。这本书也是加多大佬这么多年在多线程领域的沉淀所得的结果吧！他书中的内容基本都是结合代码讲解，非常有说服力！

**[《实战 Java 高并发程序设计》](https://book.douban.com/subject/30358019/)**

![《实战 Java 高并发程序设计》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424112554830.png)

这个是我第二本要推荐的书籍，比较适合作为多线程入门/进阶书籍来看。这本书内容同样是理论结合实战，对于每个知识点的讲解也比较通俗易懂，整体结构也比较清。

**[《深入浅出 Java 多线程》](https://github.com/RedSpider1/concurrent)**

![《深入浅出 Java 多线程》在线阅读](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424112927759.png)

这本开源书籍是几位大厂的大佬开源的。这几位作者为了写好《深入浅出 Java 多线程》这本书阅读了大量的 Java 多线程方面的书籍和博客，然后再加上他们的经验总结、Demo 实例、源码解析，最终才形成了这本书。

这本书的质量也是非常过硬！给作者们点个赞！这本书有统一的排版规则和语言风格、清晰的表达方式和逻辑。并且每篇文章初稿写完后，作者们就会互相审校，合并到主分支时所有成员会再次审校，最后再通篇修订了三遍。

在线阅读：<https://redspider.gitbook.io/并发/>。

**[《Java 并发实现原理：JDK 源码剖析》](https://book.douban.com/subject/35013531/)**

![《Java 并发实现原理：JDK 源码剖析》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/0b1b046af81f4c94a03e292e66dd6f7d.png)

这本书主要是对 Java Concurrent 包中一些比较重要的源码进行了讲解，另外，像 JMM、happen-before、CAS 等等比较重要的并发知识这本书也都会一并介绍到。

不论是你想要深入研究 Java 并发，还是说要准备面试，你都可以看看这本书。

## JVM

**[《深入理解 Java 虚拟机》](https://book.douban.com/subject/34907497/)**

![《深入理解 Java 虚拟机》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/20210710104655705.png)

这本书就一句话形容：**国产书籍中的战斗机，实实在在的优秀！** （真心希望国内能有更多这样的优质书籍出现！加油！💪）

这本书的第 3 版 2019 年底已经出来了，新增了很多实在的内容比如 ZGC 等新一代 GC 的原理剖析。目前豆瓣上是 9.5 的高分，🐂 不 🐂 我就不多说了！

不论是你面试还是你想要在 Java 领域学习的更深，你都离不开这本书籍。这本书不光要看，你还要多看几遍，里面都是干货。这本书里面还有一些需要自己实践的东西，我建议你也跟着实践一下。

类似的书籍还有 **[《实战 Java 虚拟机》](https://book.douban.com/subject/26354292/)**、**[《虚拟机设计与实现:以 JVM 为例》](https://book.douban.com/subject/34935105/)** ，这两本都是非常不错的！

![《实战 Java 虚拟机》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113158144.png)

![《虚拟机设计与实现:以 JVM 为例》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113210153.png)

如果你对实战比较感兴趣，想要自己动手写一个简易的 JVM 的话，可以看看 **[《自己动手写 Java 虚拟机》](https://book.douban.com/subject/26802084/)** 这本书。

![《自己动手写 Java 虚拟机》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113445246.png)

书中的代码是基于 Go 语言实现的，搞懂了原理之后，你可以使用 Java 语言模仿着写一个，也算是练练手！ 如果你当前没有能力独立使用 Java 语言模仿着写一个的话，你也可以在网上找到很多基于 Java 语言版本的实现，比如[《zachaxy 的手写 JVM 系列》](https://zachaxy.github.io/tags/JVM/) 。

这本书目前在豆瓣有 8.2 的评分，我个人觉得张秀宏老师写的挺好的，这本书值得更高的评分。

另外，R 大在豆瓣发的[《从表到里学习 JVM 实现》](https://www.douban.com/doulist/2545443/)这篇文章中也推荐了很多不错的 JVM 相关的书籍，推荐小伙伴们去看看。

## 常用工具

非常重要！非常重要！特别是 Git 和 Docker。

- **IDEA**：熟悉基本操作以及常用快捷。相关资料： [《IntelliJ IDEA 简体中文专题教程》](https://github.com/judasn/IntelliJ-IDEA-Tutorial) 。
- **Maven**：强烈建议学习常用框架之前可以提前花几天时间学习一下**Maven**的使用。（到处找 Jar 包，下载 Jar 包是真的麻烦费事，使用 Maven 可以为你省很多事情）。相关阅读：[Maven 核心概念总结](https://javaguide.cn/开发工具/maven/maven-core-concepts.html)。
- **Git**：基本的 Git 技能也是必备的，试着在学习的过程中将自己的代码托管在 Github 上。相关阅读：[Git 核心概念总结](https://javaguide.cn/开发工具/git/git-intro.html)。
- **Docker**：学着用 Docker 安装学习中需要用到的软件比如 MySQL ,这样方便很多，可以为你节省不少时间。相关资料：[《Docker - 从入门到实践》](https://yeasy.gitbook.io/docker_practice/) 。

除了这些工具之外，我强烈建议你一定要搞懂 GitHub 的使用。一些使用 GitHub 的小技巧，你可以看[Github 实用小技巧总结](https://javaguide.cn/开发工具/git/github-tips.html)这篇文章。

## 常用框架

框架部分建议找官方文档或者博客来看。

### Spring/SpringBoot

**Spring 和 SpringBoot 真的很重要！**

一定要搞懂 AOP 和 IOC 这两个概念。Spring 中 bean 的作用域与生命周期、SpringMVC 工作原理详解等等知识点都是非常重要的，一定要搞懂。

企业中做 Java 后端，你一定离不开 SpringBoot ，这个是必备的技能了！一定一定一定要学好！

像 SpringBoot 和一些常见技术的整合你也要知识怎么做，比如 SpringBoot 整合 MyBatis、 ElasticSearch、SpringSecurity、Redis 等等。

下面是一些比较推荐的书籍/专栏。

**[《Spring 实战》](https://book.douban.com/subject/34949443/)**

![《Spring 实战》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113512453.png)

不建议当做入门书籍读，入门的话可以找点国人的书或者视频看。这本定位就相当于是关于 Spring 的一个概览，只有一些基本概念的介绍和示例，涵盖了 Spring 的各个方面，但都不够深入。就像作者在最后一页写的那样：“学习 Spring，这才刚刚开始”。

**[《Spring 5 高级编程》](https://book.douban.com/subject/30452637/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210328171223638.png)

对于 Spring5 的新特性介绍的比较详细，也说不上好。另外，感觉全书翻译的有一点蹩脚的味道，还有一点枯燥。全书的内容比较多，我一般拿来当做工具书参考。

**[《Spring Boot 编程思想（核心篇）》](https://book.douban.com/subject/33390560/)**

![《Spring Boot 编程思想（核心篇）》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113546513.png)

_稍微有点啰嗦，但是原理介绍的比较清楚。_

SpringBoot 解析，不适合初学者。我是去年入手的，现在就看了几章，后面没看下去。书很厚，感觉很多很多知识点的讲解过于啰嗦和拖沓，不过，这本书对于 SpringBoot 内部原理讲解的还是很清楚。

**[《Spring Boot 实战》](https://book.douban.com/subject/26857423/)**

![《Spring Boot 实战》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113614768.png)

比较一般的一本书，可以简单拿来看一下。

### MyBatis

MyBatis 国内用的挺多的，我的建议是不需要花太多时间在上面。当然了，MyBatis 的源码还是非常值得学习的，里面有很多不错的编码实践。这里推荐两本讲解 MyBatis 源码的书籍。

**[《手写 MyBatis：渐进式源码实践》](https://book.douban.com/subject/36243250/)**

![《手写MyBatis：渐进式源码实践》](https://oss.javaguide.cn/github/javaguide/书籍/image-20230724123402784.png)

我的好朋友小傅哥出版的一本书。这本书以实践为核心，摒弃 MyBatis 源码中繁杂的内容，聚焦于 MyBaits 中的核心逻辑，简化代码实现过程，以渐进式的开发方式，逐步实现 MyBaits 中的核心功能。

这本书的配套项目的仓库地址：<https://github.com/fuzhengwei/small-mybatis> 。

**[《通用源码阅读指导书――MyBatis 源码详解》](https://book.douban.com/subject/35138963/)**

![《通用源码阅读指导书――MyBatis源码详解》](https://oss.javaguide.cn/github/javaguide/书籍/image-20230724123416741.png)

这本书通过 MyBatis 开源代码讲解源码阅读的流程和方法！一共对 MyBatis 源码中的 300 多个类进行了详细解析，包括其背景知识、组织方式、逻辑结构、实现细节。

这本书的配套示例仓库地址：<https://github.com/yeecode/MyBatisDemo> 。

### Netty

**[《Netty 实战》](https://book.douban.com/subject/27038538/)**

![《Netty 实战》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113715369.png)

这本书可以用来入门 Netty ，内容从 BIO 聊到了 NIO、之后才详细介绍为什么有 Netty、Netty 为什么好用以及 Netty 重要的知识点讲解。

这本书基本把 Netty 一些重要的知识点都介绍到了，而且基本都是通过实战的形式讲解。

**[《Netty 进阶之路：跟着案例学 Netty》](https://book.douban.com/subject/30381214/)**

![《Netty 进阶之路：跟着案例学 Netty》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113747345.png)

内容都是关于使用 Netty 的实践案例比如内存泄露这些东西。如果你觉得你的 Netty 已经完全入门了，并且你想要对 Netty 掌握的更深的话，推荐你看一下这本书。

**[《跟闪电侠学 Netty：Netty 即时聊天实战与底层原理》](https://book.douban.com/subject/35752082/)**

![](https://oss.javaguide.cn/github/javaguide/开源项目/image-20220503085034268.png)

2022 年 3 月出版的一本书。这本书分为上下两篇，上篇通过一个即时聊天系统的实战案例带你入门 Netty，下篇通过 Netty 源码分析带你搞清 Netty 比较重要的底层原理。

## 性能调优

**[《Java 性能权威指南》](https://book.douban.com/subject/26740520/)**

![《Java 性能权威指南》-豆瓣](https://oss.javaguide.cn/github/javaguide/书籍/image-20220424113809644.png)

_希望能有更多这 Java 性能优化方面的好书！_

O'Reilly 家族书，性能调优的入门书，我个人觉得性能调优是每个 Java 从业者必备知识。

这本书介绍的实战内容很不错，尤其是 JVM 调优，缺点也比较明显，就是内容稍微有点老。市面上这种书很少。这本书不适合初学者，建议对 Java 语言已经比价掌握了再看。另外，阅读之前，最好先看看周志明大佬的《深入理解 Java 虚拟机》。

## 网站架构

看过很多网站架构方面的书籍，比如《大型网站技术架构：核心原理与案例分析》、《亿级流量网站架构核心技术》、《架构修炼之道——亿级网关、平台开放、分布式、微服务、容错等核心技术修炼实践》等等。

目前我觉得能推荐的只有李运华老师的 **[《从零开始学架构》](https://book.douban.com/subject/30335935/)** 和 余春龙老师的 **[《软件架构设计：大型网站技术架构与业务架构融合之道》](https://book.douban.com/subject/30443578/ "《软件架构设计：大型网站技术架构与业务架构融合之道》")** 。

![](https://oss.javaguide.cn/github/javaguide/书籍/20210412224443177.png)

《从零开始学架构》这本书对应的有一个极客时间的专栏—《从零开始学架构》，里面的很多内容都是这个专栏里面的，两者买其一就可以了。我看了很小一部分，内容挺全面的，是一本真正在讲如何做架构的书籍。

![](https://oss.javaguide.cn/github/javaguide/书籍/20210412232441459.png)

事务与锁、分布式（CAP、分布式事务……）、高并发、高可用 《软件架构设计：大型网站技术架构与业务架构融合之道》 这本书都有介绍到。

## 面试

**《JavaGuide 面试突击版》**

![](https://oss.javaguide.cn/github/javaguide-mianshituji/image-20220830103023493.png)

![](https://oss.javaguide.cn/github/javaguide-mianshituji/image-20220830102925775.png)

[JavaGuide](https://javaguide.cn/) 的面试版本，涵盖了 Java 后端方面的大部分知识点比如 集合、JVM、多线程还有数据库 MySQL 等内容。

公众号后台回复：“**面试突击**” 即可免费获取，无任何套路。

![JavaGuide 官方公众号](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)


---

---

<!-- source: 分布式必读经典书籍.md -->

## [2] 分布式必读经典书籍

---
title: 分布式必读经典书籍
description: 分布式系统书籍推荐，DDIA、分布式事务、共识算法、微服务架构等经典书籍，掌握分布式系统设计核心知识。
category: 计算机书籍
icon: "mdi:transit-connection-variant"
---

## 《深入理解分布式系统》

![](https://oss.javaguide.cn/github/javaguide/书籍/deep-understanding-of-distributed-system.png)

**[《深入理解分布式系统》](https://book.douban.com/subject/35794814/)** 是 2022 年出版的一本分布式中文原创书籍，主要讲的是分布式领域的基本概念、常见挑战以及共识算法。

作者用了大量篇幅来介绍分布式领域中非常重要的共识算法，并且还会基于 Go 语言带着你从零实现了一个共识算法的鼻祖 Paxos 算法。

实话说，我还没有开始看这本书。但是！这本书的作者的博客上的分布式相关的文章我几乎每一篇都认真看过。作者从 2019 年开始构思《深入理解分布式系统》，2020 年开始动笔，花了接近两年的时间才最终交稿。

![](https://oss.javaguide.cn/github/javaguide/书籍/image-20220706121952258.png)

作者专门写了一篇文章来介绍这本书的背后的故事，感兴趣的小伙伴可以自行查阅：<https://zhuanlan.zhihu.com/p/487534882> 。

最后，放上这本书的代码仓库和勘误地址：<https://github.com/tangwz/DistSysDeepDive> 。

## 《数据密集型应用系统设计》

![](https://oss.javaguide.cn/github/javaguide/书籍/ddia.png)

强推一波 **[《Designing Data-Intensive Application》](https://book.douban.com/subject/30329536/)** （DDIA，数据密集型应用系统设计），值得读很多遍！豆瓣有接近 90% 的人看了这本书之后给了五星好评。

这本书主要讲了分布式数据库、数据分区、事务、分布式系统等内容。

书中介绍的大部分概念你可能之前都听过，但是在看了书中的内容之后，你可能会豁然开朗：“哇塞！原来是这样的啊！这不是某技术的原理么？”。

这本书我之前专门写过知乎回答介绍和推荐，没看过的朋友可以看看：[有哪些你看了以后大呼过瘾的编程书？](https://www.zhihu.com/question/50408698/answer/2278198495) 。另外，如果你在阅读这本书的时候感觉难度比较大，很多地方读不懂的话，我这里推荐一下《深入理解分布式系统》作者写的[《DDIA 逐章精读》小册](https://ddia.qtmuniao.com)。

## 《深入理解分布式事务》

![](https://oss.javaguide.cn/github/javaguide/书籍/In-depth-understanding-of-distributed-transactions-xiaoyu.png)

**[《深入理解分布式事务》](https://book.douban.com/subject/35626925/)** 这本书的其中一位作者是 Apache ShenYu（incubating）网关创始人、Hmily、RainCat、Myth 等分布式事务框架的创始人。

学习分布式事务的时候，可以参考一下这本书。虽有一些小错误以及逻辑不通顺的地方，但对于各种分布式事务解决方案的介绍，总体来说还是不错的。

## 《从 Paxos 到 Zookeeper》

![](https://oss.javaguide.cn/github/javaguide/书籍/image-20211216161350118.png)

**[《从 Paxos 到 Zookeeper》](https://book.douban.com/subject/26292004/)** 是一本带你入门分布式理论的好书。这本书主要介绍几种典型的分布式一致性协议，以及解决分布式一致性问题的思路，其中重点讲解了 Paxos 和 ZAB 协议。

PS：Zookeeper 现在用的不多，可以不用重点学习，但 Paxos 和 ZAB 协议还是非常值得深入研究的。

## 《深入理解分布式共识算法》

![](https://oss.javaguide.cn/github/javaguide/书籍/deep-dive-into-distributed-consensus-algorithms.png)

**[《深入理解分布式共识算法》](https://book.douban.com/subject/36335459/)** 详细剖析了 Paxos、Raft、Zab 等主流分布式共识算法的核心原理和实现细节。如果你想要了解分布式共识算法的话，不妨参考一下这本书的总结。

## 《微服务架构设计模式》

![](https://oss.javaguide.cn/github/javaguide/书籍/microservices-patterns.png)

**[《微服务架构设计模式》](https://book.douban.com/subject/33425123/)** 的作者 Chris Richardson 被评为世界十大软件架构师之一、微服务架构先驱。这本书汇集了 44 个经过实践验证的架构设计模式，这些模式用来解决诸如服务拆分、事务管理、查询和跨服务通信等难题。书中的内容不仅理论扎实，还通过丰富的 Java 代码示例，引导读者一步步掌握开发和部署生产级别的微服务架构应用。

## 《凤凰架构》

![](https://oss.javaguide.cn/github/javaguide/书籍/f5bec14d3b404ac4b041d723153658b5.png)

**[《凤凰架构》](https://book.douban.com/subject/35492898/)** 这本书是周志明老师多年架构和研发经验的总结，内容非常干货，深度与广度并存，理论结合实践！

正如书名的副标题“构建可靠的大型分布式系统”所说的那样，这本书的主要内容就是讲：“如何构建一套可靠的分布式大型软件系统” ，涵盖了下面这些方面的内容：

- 软件架构从单体到微服务再到无服务的演进之路。
- 架构师应该在架构设计时应该注意哪些问题，有哪些比较好的实践。
- 分布式的基石比如常见的分布式共识算法 Paxos、Multi Paxos。
- 不可变基础设施比如虚拟化容器、服务网格。
- 向微服务迈进的避坑指南。

这本书我推荐过很多次了。详见历史文章：

- [周志明老师的又一神书！发现宝藏！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247505254&idx=1&sn=04faf3093d6002354f06fffbfc2954e0&chksm=cea19aadf9d613bbba7ed0e02ccc4a9ef3a30f4d83530e7ad319c2cc69cd1770e43d1d470046&scene=178&cur_album_id=1646812382221926401#rd)
- [Java 领域的又一神书！周志明老师 YYDS！](https://mp.weixin.qq.com/s/9nbzfZGAWM9_qIMp1r6uUQ)

## 其他

- [《分布式系统 : 概念与设计》](https://book.douban.com/subject/21624776/)：偏教材类型，内容全而无趣，可作为参考书籍；
- [《分布式架构原理与实践》](https://book.douban.com/subject/35689350/)：2021 年出版的，没什么热度，我也还没看过。


---

---

<!-- source: 计算机基础必读经典书籍.md -->

## [3] 计算机基础必读经典书籍

---
title: 计算机基础必读经典书籍
description: 计算机基础书籍推荐，操作系统、计算机网络、算法与数据结构、编译原理等核心课程经典教材和学习资源汇总。
category: 计算机书籍
icon: "mdi:desktop-classic"
head:
  - - meta
    - name: keywords
      content: 计算机基础书籍精选
---

考虑到很多同学比较喜欢看视频，因此，这部分内容我不光会推荐书籍，还会顺便推荐一些我觉得不错的视频教程和各大高校的 Project。

## 操作系统

**为什么要学习操作系统？**

**从对个人能力方面提升来说**，操作系统中的很多思想、很多经典的算法，你都可以在我们日常开发使用的各种工具或者框架中找到它们的影子。比如说我们开发的系统使用的缓存（比如 Redis）和操作系统的高速缓存就很像。CPU 中的高速缓存有很多种，不过大部分都是为了解决 CPU 处理速度和内存处理速度不对等的问题。我们还可以把内存可以看作外存的高速缓存，程序运行的时候我们把外存的数据复制到内存，由于内存的处理速度远远高于外存，这样提高了处理速度。同样地，我们使用的 Redis 缓存就是为了解决程序处理速度和访问常规关系型数据库速度不对等的问题。高速缓存一般会按照局部性原理（2-8 原则）根据相应的淘汰算法保证缓存中的数据是经常会被访问的。我们平常使用的 Redis 缓存很多时候也会按照 2-8 原则去做，很多淘汰算法都和操作系统中的类似。既说了 2-8 原则，那就不得不提命中率了，这是所有缓存概念都通用的。简单来说也就是你要访问的数据有多少能直接在缓存中直接找到。命中率高的话，一般表明你的缓存设计比较合理，系统处理速度也相对较快。

**从面试角度来说**，尤其是校招，对于操作系统方面知识的考察是非常非常多的。

**简单来说，学习操作系统能够提高自己思考的深度以及对技术的理解力，并且，操作系统方面的知识也是面试必备。**

如果你要系统地学习操作系统的话，最硬核最权威的书籍是 **[《操作系统导论》](https://book.douban.com/subject/33463930/)** 。你可以再配套一个 **[《深入理解计算机系统》](https://book.douban.com/subject/1230413/)** 加深你对计算机系统本质的认识，美滋滋！

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201012191645919.png)

另外，去年新出的一本国产的操作系统书籍也很不错：**[《现代操作系统：原理与实现》](https://book.douban.com/subject/35208251/)** （夏老师和陈老师团队的力作，值得推荐）。

![](https://oss.javaguide.cn/github/javaguide/书籍/20210406132050845.png)

如果你比较喜欢动手，对于理论知识比较抵触的话，我推荐你看看 **[《30 天自制操作系统》](https://book.douban.com/subject/11530329/)** ，这本书会手把手教你编写一个操作系统。

纸上学来终觉浅 绝知此事要躬行！强烈推荐 CS 专业的小伙伴一定要多多实践！！！

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123802972.png)

其他相关书籍推荐：

- **[《自己动手写操作系统》](https://book.douban.com/subject/1422377/)**：不光会带着你详细分析操作系统原理的基础，还会用丰富的实例代码，一步一步地指导你用 C 语言和汇编语言编写出一个具备操作系统基本功能的操作系统框架。
- **[《现代操作系统》](https://book.douban.com/subject/3852290/)**：内容很不错，不过，翻译的一般。如果你是精读本书的话，建议把课后习题都做了。
- **[《操作系统真象还原》](https://book.douban.com/subject/26745156/)**：这本书的作者毕业于北京大学，前百度运维高级工程师。因为在大学期间曾重修操作系统这一科，后对操作系统进行深入研究，著下此书。
- **[《深度探索 Linux 操作系统》](https://book.douban.com/subject/25743846/)**：跟着这本书的内容走，可以让你对如何制作一套完善的 GNU/Linux 系统有了清晰的认识。
- **[《操作系统设计与实现》](https://book.douban.com/subject/2044818/)**：操作系统的权威教学教材。
- **[《Orange'S:一个操作系统的实现》](https://book.douban.com/subject/3735649/)**：从只有二十行的引导扇区代码出发，一步一步地向读者呈现一个操作系统框架的完成过程。配合《操作系统设计与实现》一起食用更佳！

如果你比较喜欢看视频的话，推荐哈工大李治军老师主讲的慕课 [《操作系统》](https://www.icourse163.org/course/HIT-1002531008)，内容质量吊打一众国家精品课程。

课程的大纲如下：

![课程大纲](https://oss.javaguide.cn/github/javaguide/书籍/image-20220414144527747.png)

主要讲了一个基本操作系统中的六个基本模块：CPU 管理、内存管理、外设管理、磁盘管理与文件系统、用户接口和启动模块 。

课程难度还是比较大的，尤其是课后的 lab。如果大家想要真正搞懂操作系统底层原理的话，对应的 lab 能做尽量做一下。正如李治军老师说的那样：“纸上得来终觉浅，绝知此事要躬行”。

![](https://oss.javaguide.cn/github/javaguide/书籍/image-20220414145210679.png)

如果你能独立完成几个 lab 的话，我相信你对操作系统的理解绝对要上升几个台阶。当然了，如果你仅仅是为了突击面试的话，那就不需要做 lab 了。

说点心里话，我本人非常喜欢李治军老师讲的课，我觉得他是国内不可多得的好老师。他知道我们国内的教程和国外的差距在哪里，也知道国内的学生和国外学生的差距在哪里，他自己在努力着通过自己的方式来缩小这个差距。真心感谢，期待李治军老师的下一个课程。

![](https://oss.javaguide.cn/github/javaguide/书籍/image-20220414145249714.png)

还有下面这个国外的课程 [《深入理解计算机系统 》](https://www.bilibili.com/video/av31289365?from=search&seid=16298868573410423104) 也很不错。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201204140653318.png)

## 计算机网络

计算机网络是一门系统性比较强的计算机专业课，各大名校的计算机网络课程打磨的应该都比较成熟。

要想学好计算机网络，首先要了解的就是 OSI 七层模型或 TCP/IP 五层模型，即应用层（应用层、表示层、会话层）、传输层、网络层、数据链路层、物理层。

![osi七层模型](https://oss.javaguide.cn/github/javaguide/booksosi%E4%B8%83%E5%B1%82%E6%A8%A1%E5%9E%8B2.png)

关于这门课，首先强烈推荐参考书是**机械工业出版社的《计算机网络——自顶向下方法》**。该书目录清晰，按照 TCP/IP 五层模型逐层讲解，对每层涉及的技术都展开了详细讨论，基本上高校里开设的课程的教学大纲就是这本书的目录了。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123250570.png)

如果你觉得上面这本书看着比较枯燥的话，我强烈推荐+安利你看看下面这两本非常有趣的网络相关的书籍：

- [《图解 HTTP》](https://book.douban.com/subject/25863515/ "《图解 HTTP》")：讲漫画一样的讲 HTTP，很有意思，不会觉得枯燥，大概也涵盖也 HTTP 常见的知识点。因为篇幅问题，内容可能不太全面。不过，如果不是专门做网络方向研究的小伙伴想研究 HTTP 相关知识的话，读这本书的话应该来说就差不多了。
- [《网络是怎样连接的》](https://book.douban.com/subject/26941639/ "《网络是怎样连接的》")：从在浏览器中输入网址开始，一路追踪了到显示出网页内容为止的整个过程，以图配文，讲解了网络的全貌，并重点介绍了实际的网络设备和软件是如何工作的。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201011215144139.png)

除了理论知识之外，学习计算机网络非常重要的一点就是：“**动手实践**”。这点和我们编程差不多。

GitHub 上就有一些名校的计算机网络试验/Project：

- [哈工大计算机网络实验](https://github.com/rccoder/HIT-Computer-Network)
- [《计算机网络－自顶向下方法(原书第 6 版)》编程作业，Wireshark 实验文档的翻译和解答。](https://github.com/moranzcw/Computer-Networking-A-Top-Down-Approach-NOTES)
- [计算机网络的期末 Project，用 Python 编写的聊天室](https://github.com/KevinWang15/network-pj-chatroom)
- [CMU 的计算机网络课程](https://computer-networks.github.io/sp19/lectures.html)

我知道，还有很多小伙伴可能比较喜欢边看视频边学习。所以，我这里再推荐几个顶好的计算机网络视频讲解。

**1、[哈工大的计算机网络课程](http://www.icourse163.org/course/HIT-154005)**：国家精品课程，截止目前已经开了 10 次课了。大家对这门课的评价都非常高！所以，非常推荐大家看一下！

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201218141241911.png)

**2、[王道考研的计算机网络](https://www.bilibili.com/video/BV19E411D78Q?from=search&seid=17198507506906312317)**：非常适合 CS 专业考研的小朋友！这个视频目前在哔哩哔哩上已经有 1.6w+ 的点赞。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20201218141652837.png)

## 算法

先来看三本入门书籍。 这三本入门书籍中的任何一本拿来作为入门学习都非常好。

1. [《我的第一本算法书》](https://book.douban.com/subject/30357170/)
2. [《算法图解》](https://book.douban.com/subject/26979890/)
3. [《啊哈!算法》](https://book.douban.com/subject/25894685/)

![](https://oss.javaguide.cn/java-guide-blog/image-20210327104418851.png)

我个人比较倾向于 **[《我的第一本算法书》](https://book.douban.com/subject/30357170/)** 这本书籍，虽然它相比于其他两本书集它的豆瓣评分略低一点。我觉得它的配图以及讲解是这三本书中最优秀，唯一比较明显的问题就是没有代码示例。但是，我觉得这不影响它是一本好的算法书籍。因为本身下面这三本入门书籍的目的就不是通过代码来让你的算法有多厉害，只是作为一本很好的入门书籍让你进入算法学习的大门。

再推荐几本比较经典的算法书籍。

**[《算法》](https://book.douban.com/subject/19952400/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409123422140.png)

这本书内容非常清晰易懂，适合数据结构和算法小白阅读。书中把一些常用的数据结构和算法都介绍到了！

我在大二的时候被我们的一个老师强烈安利过！自己也在当时购买了一本放在宿舍，到离开大学的时候自己大概看了一半多一点。因为内容实在太多了！另外，这本书还提供了详细的 Java 代码，非常适合学习 Java 的朋友来看，可以说是 Java 程序员的必备书籍之一了。

> **下面这些书籍都是经典中的经典，但是阅读起来难度也比较大，不做太多阐述，神书就完事了！**
>
> **如果你仅仅是准备算法面试的话，不建议你阅读下面这些书籍。**

**[《编程珠玑》](https://book.douban.com/subject/3227098/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145334093.png)

经典名著，ACM 冠军、亚军这种算法巨佬都强烈推荐的一本书籍。这本书的作者也非常厉害，Java 之父 James Gosling 就是他的学生。

很多人都说这本书不是教你具体的算法，而是教你一种编程的思考方式。这种思考方式不仅仅在编程领域适用，在其他同样适用。

**[《算法设计手册》](https://book.douban.com/subject/4048566/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145411049.png)

这是一本被 GitHub 上的爆火的计算机自学项目 [Teach Yourself Computer Science](https://link.zhihu.com/?target=https%3A//teachyourselfcs.com/) 强烈推荐的一本算法书籍。

类似的神书还有 [《算法导论》](https://book.douban.com/subject/20432061/)、[《计算机程序设计艺术（第 1 卷）》](https://book.douban.com/subject/1130500/) 。

**如果说你要准备面试的话，下面这几本书籍或许对你有帮助！**

**[《剑指 Offer》](https://book.douban.com/subject/6966465/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145506482.png)

这本面试宝典上面涵盖了很多经典的算法面试题，如果你要准备大厂面试的话一定不要错过这本书。

《剑指 Offer》 对应的算法编程题部分的开源项目解析：[CodingInterviews](https://link.zhihu.com/?target=https%3A//github.com/gatieme/CodingInterviews) 。

**[《程序员代码面试指南（第 2 版）》](https://book.douban.com/subject/30422021/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145622758.png)

《程序员代码面试指南（第 2 版）》里的大部分题目相比于《剑指 offer》 来说要难很多，题目涵盖面相比于《剑指 offer》也更加全面。全书一共有将近 300 道真实出现过的经典代码面试题。

视频的话，推荐北京大学的国家精品课程—**[程序设计与算法（二）算法基础](https://www.icourse163.org/course/PKU-1001894005)**，讲的非常好！

![](https://oss.javaguide.cn/github/javaguide/书籍/22ce4a17dc0c40f6a3e0d58002261b7a.png)

这个课程把七种基本的通用算法（枚举、二分、递归、分治、动态规划、搜索、贪心）都介绍到了。各种复杂算法问题的解决，都可能用到这些基本的思想。并且，这个课程的一部分的例题和 ACM 国际大学生程序设计竞赛中的中等题相当，如果你能够解决这些问题，那你的算法能力将超过绝大部分的高校计算机专业本科毕业生。

## 数据结构

其实，上面提到的很多算法类书籍（比如 **《算法》** 和 **《算法导论》**）都详细地介绍了常用的数据结构。

我这里再另外补充基本和数据结构相关的书籍。

**[《大话数据结构》](https://book.douban.com/subject/6424904/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145803440.png)

入门类型的书籍，读起来比较浅显易懂，适合没有数据结构基础或者说数据结构没学好的小伙伴用来入门数据结构。

**[《数据结构与算法分析：Java 语言描述》](https://book.douban.com/subject/3351237/)**

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409145823973.png)

质量很高，介绍了常用的数据结构和算法。

类似的还有 **[《数据结构与算法分析：C 语言描述》](https://book.douban.com/subject/1139426/)**、**[《数据结构与算法分析：C++ 描述》](https://book.douban.com/subject/1971825/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/d9c450ccc5224a5fba77f4fa937f7b9c.png)

视频的话推荐你看浙江大学的国家精品课程—**[《数据结构》](https://www.icourse163.org/course/ZJU-93001#/info)** 。

姥姥的数据结构讲的非常棒！不过，还是有一些难度的，尤其是课后练习题。

## 计算机专业基础课

数学和英语属于通用课，一般在大一和大二两学年就可以全部修完，大二大三逐渐接触专业课。通用课作为许多高中生升入大学的第一门课，算是高中阶段到本科阶段的一个过渡，从职业生涯重要性上来说，远不及专业课重要，但是在本科阶段的学习生活规划中，有着非常重要的地位。由于通用课的课程多，学分重，占据了本科阶段绩点的主要部分，影响到学生在前两年的专业排名，也影响到大三结束时的推免资格分配，也就是保研。而从升学角度来看，对于攻读研究生和博士生的小伙伴来说，数学和英语这两大基础课，还是十分有用的。

### 数学

#### 微积分（高等数学）

微积分，即传说中的高数，成为了无数新大一心中的痛。但好在，大学的课程考核没那么严格，期末想要拿高分，也不至于像高中那样刷题刷的那么狠。微积分对于计算机专业学生的重要性，主要体现在计算机图形学中的函数变换，机器学习中的梯度算法，信号处理等领域。

微积分的知识体系包括微分和积分两部分，一般会先学微分，再学积分，也有的学校把高数分为两个学期。微分就是高中的导数的升级版，对于大一萌新来说还算比较友好。积分恰好是微分的逆运算，思想上对大一萌新来说比较新，一时半会可能接受不了。不过这门课所有的高校都有开设，而且大部分的名校都有配套的网课，教材也都打磨的非常出色，结合网课和教材的“啃书”学习模式，这门课一定不会落下。

书籍的话，推荐《普林斯顿微积分读本》。这本书详细讲解了微积分基础、极限、连续、微分、导数的应用、积分、无穷级数、泰勒级数与幂级数等内容。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155056751.png)

#### 线性代数（高等代数）

线性代数的思维模式就更加复杂了一些，它定义了一个全新的数学世界，所有的符号、定理都是全新的，唯一能尝试的去理解的方式，大概就是用几何的方式去理解线性代数了。由于线性代数和几何学有着密不可分的关系，比如空间变换的理论支撑就是线性代数，因此，网上有着各种“可视化学习线性代数”的学习资源，帮助理解线性代数的意义，有助于公式的记忆。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409153940473.png)

书籍的话，推荐中科大李尚志老师的 **[《线性代数学习指导》](https://book.douban.com/subject/26390093/)** 。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155325251.png)

#### 概率论与数理统计

对于计算机专业的小伙伴来说，这门课可能是概率论更有用一点，而非数理统计。可能某些学校只开设概率论课程，也可能数理统计也教，但仅仅是皮毛。概率论的学习路线和微积分相似，就是一个个公式辅以实例，不像线性代数那么抽象，比较贴近生活。在现在的就业形势下，概率论与数理统计专业的学生，应该是数学专业最好就业的了，他们通常到岗位上会做一些数据分析的工作，因此，**这门课程确实是数据分析的重要前置课程，概率论在机器学习中的重要性也就不言而喻了。**

书籍的话，推荐 **[《概率论与数理统计教程》](https://book.douban.com/subject/34897672/)** 。这本书共八章，前四章为概率论部分，主要叙述各种概率分布及其性质，后四章为数理统计部分，主要叙述各种参数估计与假设检验。

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409155738505.png)

#### 离散数学（集合论、图论、近世代数等）

离散数学是计算机专业的专属数学，但实际上对于本科毕业找工作的小伙伴来说，离散数学还并没有发挥它的巨大作用。离散数学的作用主要在在图研究等领域，理论性极强，需要读研深造的小伙伴尽可能地扎实掌握。

### 英语

英语算是大学里面比较灵活的一项技能了，有的人会说，“英语学的越好，对个人发展越有利”，此话说的没错，但是对于一些有着明确发展目标的小伙伴，可能英语技能并不在他们的技能清单内。接下来的这些话只针对计算机专业的小伙伴们哦。

英语课在大学本科一般只有前两年开设，小伙伴们可以记住，**想用英语课来提升自己的英语水平的，可以打消这个念头了。** 英语水平的提高全靠自己平时的积累和练习，以及有针对性的刷题。

**英语的大学四六级一定要过。** 这是必备技能，绝大部分就业岗位都要看四六级水平的，最起码要通过的。四级比高中英语稍微难一些，一般的小伙伴可能会卡在六级上，六级需要针对性的训练一下，因为大学期间能接触英语的实在太少了，每学期一门英语课是不足以保持自己的英语水平的。对于一些来自于偏远地区，高中英语基础薄弱的，考四六级会更加吃力。建议考前集中训练一下历年真题，辅以背一下高频词汇，四六级通过只需要 425 分，这个分数线还是比较容易达到的。稍微好一点的小伙伴可能冲一下 500 分，要是能考到 600 分的话，那是非常不错的水平了，算是简历上比较有亮点的一项。

英语的雅思托福考试只限于想要出国的小伙伴，以及应聘岗位对英语能力有特殊要求的。雅思托福考试裸考不容易通过，花钱去比较靠谱的校外补课班应该是一个比较好的选择。

对于计算机专业的小伙伴来说，英语能力还是比较重要的，虽然应聘的时候不会因为没有雅思托福成绩卡人，但是你起码要能够：

- **熟练使用英文界面的软件、系统等**
- **对于外网的一些博客、bug 解决方案等，阅读无压力**
- **熟练阅读英文文献**
- **具备一定的英文论文的撰写能力**

毕竟计算机语言就是字符语言，听说读写中最起码要满足**读写**这两项不过分吧。

### 编译原理

编译原理相比于前面介绍的专业课，地位显得不那么重要了。编译原理的重要性主要体现在：

- 底层语言、引擎或高级语言的开发，如 MySQL，Java 等
- 操作系统或嵌入式系统的开发
- 词法、语法、语义的思想，以及自动机思想

**编译原理的重要前置课程就是形式语言与自动机，自动机的思想在词法分析当中有着重要应用，学习了这门课后，应该就会发现许多场景下，自动机算法的妙用了。**

总的来说，这门课对于各位程序员的职业发展来说，相对不那么重要，但是从难度上来说，学习这门课可以对编程思想有一个较好的巩固。学习资源的话，除了课堂上的幻灯片课件以外，还可以把 《编译原理》 这本书作为参考书，用以辅助自己学不懂的地方（大家口中的龙书，想要啃下来还是有一定难度的）。

![](https://oss.javaguide.cn/github/javaguide/书籍/20210406152148373.png)

其他书籍推荐:

- **[《现代编译原理》](https://book.douban.com/subject/30191414/)**：编译原理的入门书。
- **[《编译器设计》](https://book.douban.com/subject/20436488/)**：覆盖了编译器从前端到后端的全部主题。

我上面推荐的书籍的难度还是比较高的，真心很难坚持看完。这里强烈推荐[哈工大的编译原理视频课程](https://www.icourse163.org/course/HIT-1002123007)，真心不错，还是国家精品课程，关键还是又漂亮有温柔的美女老师讲的！

![](https://oss.javaguide.cn/github/javaguide/书籍/20210406152847824.png)


---

---

<!-- source: 软件质量必读经典书籍.md -->

## [4] 软件质量必读经典书籍

---
title: 软件质量必读经典书籍
description: 软件质量与代码整洁书籍推荐，重构、Clean Code、Effective Java、架构整洁之道等经典书籍，提升代码质量和架构设计能力。
category: 计算机书籍
icon: "mdi:check-network-outline"
head:
  - - meta
    - name: keywords
      content: 软件质量书籍精选
---

下面推荐都是我看过并且我觉得值得推荐的书籍。

不过，这些书籍都比较偏理论，只能帮助你建立一个写优秀代码的意识标准。 如果你想要编写更高质量的代码、更高质量的软件，还是应该多去看优秀的源码，多去学习优秀的代码实践。

## 代码整洁之道

**[《重构》](https://book.douban.com/subject/30468597/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210328174841577.png)

必看书籍！无需多言。编程书籍领域的瑰宝。

世界顶级、国宝级别的 Martin Fowler 的书籍，可以说是软件开发领域最经典的几本书之一。目前已经出了第二版。

这是一本值得你看很多遍的书籍。

**[《Clean Code》](https://book.douban.com/subject/4199741/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210328174824891.png)

《Clean Code》是 Bob 大叔的一本经典著作，强烈建议小伙伴们一定要看看。

Bob 大叔将自己对整洁代码的理解浓缩在了这本书中，真可谓是对后生的一大馈赠。

**[《Effective Java 》](https://book.douban.com/subject/30412517/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/82d510c951384383b325080428af6c0a.png)

《Effective Java 》这本书是 Java 领域国宝级别的书，非常经典。Java 程序员必看！

这本书主要介绍了在 Java 编程中很多极具实用价值的经验规则，这些经验规则涵盖了大多数开发人员每天所面临的问题的解决方案。这篇文章能够非常实际地帮助你写出更加清晰、健壮和高效的代码。本书中的每条规则都以简短、独立的小文章形式出现，并通过例子代码加以进一步说明。

**[《代码大全》](https://book.douban.com/subject/1477390/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210314173253221.png)

其实，《代码大全（第 2 版）》这本书我本身是不太想推荐给大家了。但是，看在它的豆瓣评分这么高的份上，还是拿出来说说吧！

这也是一本非常经典的书籍，第二版对第一版进行了重写。

我简单地浏览过全书的内容，感觉内容总体比较虚，对于大部分程序员的作用其实不大。如果你想要切实地提高自己的代码质量，《Clean Code》和 《编写可读代码的艺术》我觉得都要比《代码大全》这本书更好。

不过，最重要的还是要多看优秀的源码，多学习优秀的代码实践。

**[《编写可读代码的艺术》](https://book.douban.com/subject/10797189/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210314175536443.png)

《编写可读代码的艺术》这本书要表达的意思和《Clean Code》很像，你看它俩的目录就可以看出来了。

![](https://oss.javaguide.cn/github/javaguide/书籍/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0MzM3Mjcy,size_16,color_FFFFFF,t_70-20230309230739963.png)

在我看来，如果你看过 《Clean Code》 的话，就不需要再看这本书了。当然，如果你有时间和精力，也可以快速过一遍。

另外，我这里还要推荐一个叫做 **[write-readable-code](https://github.com/biezhi/write-readable-code)** 的仓库。这个仓库的作者免费分享了一系列基于《编写可读代码的艺术》这本书的视频。这一系列视频会基于 Java 语言来教你如何优化咱们的代码。

在实践中学习的效果肯定会更好！推荐小伙伴们都抓紧学起来啊！

![](https://oss.javaguide.cn/github/javaguide/书籍/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0MzM3Mjcy,size_16,color_FFFFFF,t_70-20230309230743258.png)

## 程序员职业素养

**[《The Clean Coder》](https://book.douban.com/subject/26919457/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/20210314191210273.png)

《 The Clean Coder》是 Bob 大叔的又一经典著作。

《Clean Code》和《 The Clean Coder》这两本书在国内都翻译为 《代码整洁之道》，我觉得这个翻译还是不够优雅的。

另外，两者的内容差异也很大。《Clean Code》这本书从代码层面来讲解如何提高自己的代码质量。而《The Clean Coder》这本书则是从如何成为一名更优秀的开发者的角度来写的，比如这书会教你如何在自己的领域更专业、如何说不、如何做时间管理、如何处理压力等等。

## 架构整洁之道

**[《架构整洁之道》](https://book.douban.com/subject/30333919/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/2021031412342771.png)

你没看错，《架构整洁之道》这本书又是 Bob 大叔的经典之作。

这本书我强烈安利！认真读完之后，我保证你对编程本质、编程语言的本质、软件设计、架构设计可以有进一步的认识。

国内的很多书籍和专栏都借鉴了《架构整洁之道》 这本书。毫不夸张地说，《架构整洁之道》就是架构领域最经典的书籍之一。

正如作者说的那样：

> 如果深入研究计算机编程的本质，我们就会发现这 50 年来，计算机编程基本没有什么大的变化。编程语言稍微进步了一点，工具的质量大大提升了，但是计算机程序的基本构造没有什么变化。
>
> 虽然我们有了新的编程语言、新的编程框架、新的编程范式，但是软件架构的规则仍然和 1946 年阿兰·图灵写下第一行机器代码的时候一样。
>
> 这本书就是为了把这些永恒不变的软件架构规则展现出来。

## 项目管理

**[《人月神话》](https://book.douban.com/subject/1102259/)**

![](https://oss.javaguide.cn/2021/03/8ece325c-4491-4ffd-9d3d-77e95159ec40.png)

这本书主要描述了软件开发的基本定律：**一个需要 10 天才能干完的活，不可能让 10 个人在 1 天干完！**

看书名的第一眼，感觉不像是技术类的书籍。但是，就是这样一个看似和编程不沾边的书名，却成了编程领域长久相传的经典。

**这本书对于现代软件尤其是复杂软件的开发的规范化有深刻的意义。**

**[《领域驱动设计:软件核心复杂性应对之道》](https://book.douban.com/subject/5344973/)**

![](https://oss.javaguide.cn/2021/03/7e80418d-20b1-4066-b9af-cfe434b1bf1a.png)

这本领域驱动设计方面的经典之作一直被各种推荐，但是我还来及读。

## 其他

- [《代码的未来》](https://book.douban.com/subject/24536403/)：这本书的作者是 Ruby 之父松本行弘，算是一本年代比较久远的书籍（13 年出版），不过，还是非常值得一读。这本书的内容主要介绍是编程/编程语言的本质。我个人还是比较喜欢松本行弘的文字风格，并且，你看他的文章也确实能够有所收获。
- [《深入浅出设计模式》](https://book.douban.com/subject/1488876/)：比较有趣的风格，适合设计模式入门。
- [《软件架构设计:大型网站技术架构与业务架构融合之道》](https://book.douban.com/subject/30443578/)：内容非常全面。适合面试前突击一些比较重要的理论知识，也适合拿来扩充/完善自己的技术广度。
- [《微服务架构设计模式》](https://book.douban.com/subject/33425123/)：这本书是世界十大软件架构师之一、微服务架构先驱 Chris Richardson 亲笔撰写，豆瓣评分 9.6。示例代码使用 Java 语言和 Spring 框架。帮助你设计、实现、测试和部署基于微服务的应用程序。

最后再推荐两个相关的文档：

- **阿里巴巴 Java 开发手册**：<https://github.com/alibaba/p3c>
- **Google Java 编程风格指南**：<http://www.hawstein.com/posts/google-java-style.html>


---

---

<!-- source: 数据库必读经典书籍.md -->

## [5] 数据库必读经典书籍

---
title: 数据库必读经典书籍
description: 数据库书籍推荐，MySQL、PostgreSQL、Redis等数据库经典书籍，涵盖入门教程、原理剖析、性能优化等内容。
category: 计算机书籍
icon: "mdi:database-outline"
head:
  - - meta
    - name: keywords
      content: 数据库书籍精选
---

## 数据库基础

数据库基础这块，如果你觉得书籍比较枯燥，自己坚持不下来的话，我推荐你可以先看看一些不错的视频，北京师范大学的[《数据库系统原理》](https://www.icourse163.org/course/BNU-1002842007)、哈尔滨工业大学的[《数据库系统（下）：管理与技术》](https://www.icourse163.org/course/HIT-1001578001)就很不错。

[《数据库系统原理》](https://www.icourse163.org/course/BNU-1002842007)这个课程的老师讲的非常详细，而且每一小节的作业设计的也与所讲知识很贴合，后面还有很多配套实验。

![](https://oss.javaguide.cn/github/javaguide/书籍/up-e113c726a41874ef5fb19f7ac14e38e16ce.png)

如果你比较喜欢动手，对于理论知识比较抵触的话，推荐你看看[《如何开发一个简单的数据库》](https://cstack.github.io/db_tutorial/) ，这个 project 会手把手教你编写一个简单的数据库。

![](https://oss.javaguide.cn/github/javaguide/书籍/up-11de8cb239aa7201cc8d78fa28928b9ec7d.png)

GitHub 上也已经有大佬用 Java 实现过一个简易的数据库，介绍的挺详细的，感兴趣的朋友可以去看看。地址：[https://github.com/alchemystar/Freedom](https://github.com/alchemystar/Freedom) 。

除了这个用 Java 写的之外，**[db_tutorial](https://github.com/cstack/db_tutorial)** 这个项目是国外的一个大佬用 C 语言写的，朋友们也可以去瞅瞅。

**只要利用好搜索引擎，你可以找到各种语言实现的数据库玩具。**

![](https://oss.javaguide.cn/github/javaguide/书籍/up-d32d853f847633ac7ed0efdecf56be1f1d2.png)

**纸上学来终觉浅 绝知此事要躬行！强烈推荐 CS 专业的小伙伴一定要多多实践！！！**

### 《数据库系统概念》

[《数据库系统概念》](https://book.douban.com/subject/10548379/)这本书涵盖了数据库系统的全套概念，知识体系清晰，是学习数据库系统非常经典的教材！不是参考书！

![](https://oss.javaguide.cn/github/javaguide/booksimage-20220409150441742.png)

### 《数据库系统实现》

如果你也想要研究 MySQL 底层原理的话，我推荐你可以先阅读一下[《数据库系统实现》](https://book.douban.com/subject/4838430/)。

![](https://oss.javaguide.cn/github/javaguide/书籍/database-system-implementation.png)

不管是 MySQL 还是 Oracle ，它们总体的架子是差不多的，不同的是其内部的实现比如数据库索引的数据结构、存储引擎的实现方式等等。

这本书有些地方还是翻译的比较蹩脚，有能力看英文版的还是建议上手英文版。

《数据库系统实现》 这本书是斯坦福的教材，另外还有一本[《数据库系统基础教程》](https://book.douban.com/subject/3923575/)是前置课程，可以带你入门数据库。

## MySQL

我们网站或者 APP 的数据都是需要使用数据库来存储数据的。

一般企业项目开发中，使用 MySQL 比较多。如果你要学习 MySQL 的话，可以看下面这 3 本书籍：

- **[《MySQL 必知必会》](https://book.douban.com/subject/3354490/)**：非常薄！非常适合 MySQL 新手阅读，很棒的入门教材。
- **[《高性能 MySQL》](https://book.douban.com/subject/23008813/)**：MySQL 领域的经典之作！学习 MySQL 必看！属于进阶内容，主要教你如何更好地使用 MySQL 。既有有理论，又有实践！如果你没时间都看一遍的话，我建议第 5 章（创建高性能的索引）、第 6 章（查询性能优化） 你一定要认真看一下。
- **[《MySQL 技术内幕》](https://book.douban.com/subject/24708143/)**：你想深入了解 MySQL 存储引擎的话，看这本书准没错！

![](https://oss.javaguide.cn/github/javaguide/书籍/up-3d31e762933f9e50cc7170b2ebd8433917b.png)

视频的话，你可以看看动力节点的 [《MySQL 数据库教程视频》](https://www.bilibili.com/video/BV1fx411X7BD)。这个视频基本上把 MySQL 的相关一些入门知识给介绍完了。

另外，强推一波 **[《MySQL 是怎样运行的》](https://book.douban.com/subject/35231266/)** 这本书，内容很适合拿来准备面试。讲的很细节，但又不枯燥，内容非常良心！

![](https://oss.javaguide.cn/github/javaguide/csdn/20210703120643370.png)

## PostgreSQL

和 MySQL 一样，PostgreSQL 也是开源免费且功能强大的关系型数据库。PostgreSQL 的 Slogan 是“**世界上最先进的开源关系型数据库**” 。

![](https://oss.javaguide.cn/github/javaguide/书籍/image-20220702144954370.png)

最近几年，由于 PostgreSQL 的各种新特性过于优秀，使用 PostgreSQL 代替 MySQL 的项目越来越多了。

如果你还在纠结是否尝试一下 PostgreSQL 的话，建议你看看这个知乎话题：[PostgreSQL 与 MySQL 相比，优势何在？ - 知乎](https://www.zhihu.com/question/20010554) 。

### 《PostgreSQL 指南：内幕探索》

[《PostgreSQL 指南：内幕探索》](https://book.douban.com/subject/33477094/)这本书主要介绍了 PostgreSQL 内部的工作原理，包括数据库对象的逻辑组织与物理实现，进程与内存的架构。

刚工作那会需要用到 PostgreSQL ，看了大概 1/3 的内容，感觉还不错。

![](https://oss.javaguide.cn/github/javaguide/书籍/PostgreSQL-Guide.png)

### 《PostgreSQL 技术内幕：查询优化深度探索》

[《PostgreSQL 技术内幕：查询优化深度探索》](https://book.douban.com/subject/30256561/)这本书主要讲了 PostgreSQL 在查询优化上的一些技术实现细节，可以让你对 PostgreSQL 的查询优化器有深层次的了解。

![《PostgreSQL 技术内幕：查询优化深度探索》](https://oss.javaguide.cn/github/javaguide/书籍/PostgreSQL-TechnologyInsider.png)

## Redis

**Redis 就是一个使用 C 语言开发的数据库**，不过与传统数据库不同的是 **Redis 的数据是存在内存中的** ，也就是它是内存数据库，所以读写速度非常快，因此 Redis 被广泛应用于缓存方向。

如果你要学习 Redis 的话，强烈推荐下面这两本书：

- [《Redis 设计与实现》](https://book.douban.com/subject/25900156/) ：主要是 Redis 理论知识相关的内容，比较全面。我之前写过一篇文章 [《7 年前，24 岁，出版了一本 Redis 神书》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247507030&idx=1&sn=0a5fd669413991b30163ab6f5834a4ad&chksm=cea1939df9d61a8b93925fae92f4cee0838c449534e60731cfaf533369831192e296780b32a6&token=709354671&lang=zh_CN&scene=21#wechat_redirect) 来介绍这本书。
- [《Redis 核心原理与实践》](https://book.douban.com/subject/26612779/)：主要是结合源码来分析 Redis 的重要知识点比如各种数据结构和高级特性。

![《Redis 设计与实现》和《Redis 设计与实现》](https://oss.javaguide.cn/github/javaguide/书籍/redis-books.png)

另外，[《Redis 开发与运维》](https://book.douban.com/subject/26971561/) 这本书也非常不错，既有基础介绍，又有一线开发运维经验分享。

![《Redis 开发与运维》](https://oss.javaguide.cn/github/javaguide/书籍/redis-kaifa-yu-yunwei.png)


---

---

<!-- source: 搜索引擎必读经典书籍.md -->

## [6] 搜索引擎必读经典书籍

---
title: 搜索引擎必读经典书籍
description: 搜索引擎书籍推荐，Lucene入门、Elasticsearch核心技术与实战、源码解析与优化实战等经典书籍精选。
category: 计算机书籍
icon: "mdi:magnify"
---

## Lucene

Elasticsearch 在 Apache Lucene 的基础上开发而成，学习 ES 之前，建议简单了解一下 Lucene 的相关概念。

**[《Lucene 实战》](https://book.douban.com/subject/6440615/)** 是国内为数不多的中文版本讲 Lucene 的书籍，适合用来学习和了解 Lucene 相关的概念和常见操作。

![《Lucene实战》-实战](https://oss.javaguide.cn/github/javaguide/书籍/vAJkdYEyol4e6Nr.png)

## Elasticsearch

**[《一本书讲透 Elasticsearch：原理、进阶与工程实践》](https://book.douban.com/subject/36716996/)**

![](https://oss.javaguide.cn/github/javaguide/书籍/one-book-guide-to-elasticsearch.png)

基于 8.x 版本编写，目前全网最新的 Elasticsearch 讲解书籍。内容覆盖 Elastic 官方认证的核心知识点，源自真实项目案例和企业级问题解答。

**[《Elasticsearch 核心技术与实战》](http://gk.link/a/10bcT "《Elasticsearch 核心技术与实战》")**

极客时间的这门课程基于 Elasticsearch 7.1 版本讲解，还算比较新。并且，作者是 eBay 资深技术专家，有 20 年的行业经验，课程质量有保障！

![《Elasticsearch 核心技术与实战》-极客时间](https://oss.javaguide.cn/github/javaguide/csdn/20210420231125225.png)

**[《Elasticsearch 源码解析与优化实战》](https://book.douban.com/subject/30386800/)**

![《Elasticsearch 源码解析与优化实战》-豆瓣](https://oss.javaguide.cn/p3-juejin/f856485931a945639d5c23aaed74fb38~tplv-k3u1fbpfcp-zoom-1.png)

如果你想进一步深入研究 Elasticsearch 原理的话，可以看看张超老师的这本书。这是市面上唯一一本写 Elasticsearch 源码的书。

