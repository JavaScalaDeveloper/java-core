---
title: 开源项目 AI优化汇总
---

# 开源项目 AI优化汇总

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

1. Java 优质开源 AI 项目 (`Java 优质开源 AI 项目.md`)
2. Java 优质开源大数据项目 (`Java 优质开源大数据项目.md`)
3. Java 优质开源工具类 (`Java 优质开源工具类.md`)
4. Java 优质开源技术教程 (`Java 优质开源技术教程.md`)
5. Java 优质开源开发工具 (`Java 优质开源开发工具.md`)
6. Java 优质开源实战项目 (`Java 优质开源实战项目.md`)
7. Java 优质开源系统设计项目 (`Java 优质开源系统设计项目.md`)

---

<!-- source: Java 优质开源 AI 项目.md -->

## [1] Java 优质开源 AI 项目

---
title: Java 优质开源 AI 项目
description: Java优质开源AI项目推荐，涵盖Spring AI、LangChain4j、Deeplearning4j等Java人工智能和机器学习框架介绍。
category: 开源项目
icon: "mdi:robot-outline"
---

很多小伙伴私下问我：现在 AI 这么火，咱们写 Java 的是不是只能在旁边看戏？

**说实话，以前确实有点难受。** 毕竟主流的 AI 框架大多是 Python 的天下。但现在，时代变了！随着 Spring AI 以及各种 Java AI 框架的爆发，咱们 Java 开发者完全可以像平时写 CRUD 一样，优雅地把大模型集成到应用里。

今天就带大家盘点一下，目前 Java 生态里最硬核的几个 AI 框架。

## 基础框架

### Spring AI

[Spring AI](https://github.com/spring-projects/spring-ai) 是 Spring 官方亲自下场打造的 AI 应用开发框架 。它的核心哲学非常直观：**将 AI 能力无缝集成到 Spring 生态中** 。

对于习惯了 Spring Boot 的开发者来说，这玩意儿几乎没有学习门槛。它提供了一套构建 AI 应用所需的“底层原子能力抽象” ：

- **模型通信 (ChatClient):** 提供了统一的接口与不同的大语言模型（如 OpenAI GPT、Ollama、Google Gemini）进行对话。
- **提示词 (Prompt):** 结构化地管理和构建发送给模型的提示词。
- **检索增强生成 (RAG):** 通过 `VectorStore` 等抽象，方便地实现 RAG 模式，将外部知识库与模型结合，提升回答的准确性和时效性。
- **工具调用 (Function Calling):** 允许模型调用 Java 应用中定义好的方法，实现与外部世界的交互。
- **记忆 (ChatMemory):** 管理多轮对话的上下文历史。

官方文档：<https://spring.io/projects/spring-ai#learn>。

### Spring AI Alibaba

[Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba) 集成 Spring AI 生态，它是一个专为多智能体系统和工作流编排设计的项目。项目从架构上包含如下三层：

![Spring AI Alibaba 架构](https://oss.javaguide.cn/github/javaguide/开源项目/ai/springai-alibaba-architecture-new.png)

- **Agent Framework**：以 ReactAgent 设计理念为核心的 Agent 开发框架，构建具备自动上下文工程和人机交互能力的 Agent。
- **Graph**：低级别的工作流和多代理协调框架，是 Agent Framework 的底层运行时基座，帮助实现复杂的应用程序编排。
- **Augmented LLM**：基于 Spring AI 底层抽象，提供模型、工具、多模态组件（MCP）、向量存储等基础支持。

另外它还有非常“工程化”的组件：

- **Admin**：一站式 Agent 平台，支持可视化开发、可观测、评估、MCP 管理，甚至与 Dify 等低代码平台集成，支持 DSL 迁移。
- **A2A（Agent-to-Agent）**：支持 Agent 间通信，并可与 Nacos 集成做分布式协调。

官方文档：<https://java2ai.com/>。

### LangChain4j

如果说 Spring AI 是官方正规军，那 [LangChain4j](https://github.com/langchain4j/langchain4j) 就是目前社区里非常强势的 Java LLM 框架，它是 LangChain 的 Java 版本。

它的优势在于功能全面，各种大模型的适配速度快得离谱，但在 Spring 体系里总有一种“外来客”的违和感。

如果你追求“多模型快速切换 + 能力覆盖面广 + 原型推进快”，LangChain4j 通常是第一梯队选择；代价是你需要自己在工程结构、治理、可观测、平台化上多做一点“工程化拼装”。

官方文档：<https://docs.langchain4j.dev/>。

### AgentScope

[AgentScope](https://github.com/agentscope-ai/agentscope-java) 是一个多智能体框架，旨在提供一种简单高效的方式来构建基于大语言模型的智能体应用程序。

如果说大模型（LLM）是 AI 应用的大脑，那么 AgentScope 就是它的“中枢神经系统”和“手脚”。它不仅提供了多智能体协作的架构，还内置了 ReAct 推理、工具调用、记忆管理等核心能力。

AgentScope 提供了 Python 和 Java 版本，二者核心能力完全对齐！

**AgentScope 也是阿里开源的，那和 Spring AI Alibaba 有何不同呢？**

- **AgentScope Java**：原生为 **Agentic（智能体）范式**设计。它的核心是“Agent”，强调的是自主性、推理循环（ReAct）和多智能体之间的复杂博弈与协作。
- **Spring AI Alibaba**：更侧重于 **Workflow（工作流）编排**。它基于 Spring AI 生态，擅长将 AI 能力作为工具融入到预定义的业务流中。

官方文档：<https://java.agentscope.io/zh/intro.html>。

### 其他

- [Solon-AI](https://github.com/opensolon/solon-ai)：Java AI 应用开发框架（支持 LLM，RAG，MCP，Agent），同时兼容 Java8 ~ Java25，支持 SpringBoot、jFinal、Vert.x、Quarkus 等框架。
- [Agent-Flex](https://github.com/agents-flex/agents-flex)：一个优雅的 LLM（大语言模型）应用开发框架，对标 LangChain、使用 Java 开发、简单、轻量。
- [Deeplearning4j](https://github.com/eclipse/deeplearning4j)：Deeplearning4j 是第一个为 Java 和 Scala 编写的商业级，开源，分布式深度学习库。
- [Smile](https://github.com/haifengl/smile)：基于 Java 和 Scala 的机器学习库。
- [GdxAI](https://github.com/libgdx/gdx-ai)：完全用 Java 编写的人工智能框架，用于使用 libGDX 进行游戏开发。

### 对比

| **框架名称**          | **核心特点**                                                                                                       | **适用场景**                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Spring AI**         | Spring 官方底座：模型/向量库/工具调用/记忆/RAG/可观测/结构化输出；强调可移植与模块化                               | 现有 Spring Boot 企业应用 AI 化                            |
| **Spring AI Alibaba** | 面向 Agentic/Workflow/Multi-agent 的生产级体系：Agent Framework + Graph Runtime + Admin/Studio；支持 MCP/A2A/Nacos | 多智能体编排、复杂工作流、平台化治理与迁移（含可视化）     |
| **LangChain4j**       | 社区强势：统一 API 连接多模型/多向量库；Agents/Tools/RAG；支持 MCP；可集成 Spring/Quarkus/Helidon                  | 快速原型、强灵活性、多模型快速切换                         |
| **Solon-AI**          | Java 8~25 兼容；LLM/RAG/MCP/Agent/Ai Flow 全链路；可嵌入多框架                                                     | 历史系统/多框架场景、追求兼容性与全链路能力                |
| **Agent-Flex**        | 轻量优雅：LLM/Prompt/Tool/MCP/Memory/Embedding/VectorStore/文档处理；OpenTelemetry 可观测                          | 追求简洁上手、可观测的 LLM 应用开发                        |
| **AgentScope Java**   | Agentic 原生：ReAct + Tool + Memory + 多 Agent；MCP+A2A（Nacos）；Reactor 响应式 + GraalVM Serverless              | 自主智能体、分布式多 Agent、对生产可控性与性能要求高的场景 |

## 实战

### 智能面试平台

[interview-guide](https://github.com/Snailclimb/interview-guide) 基于 Spring Boot 4.0 + Java 21 + Spring AI + PostgreSQL + pgvector + RustFS + Redis，实现简历智能分析、AI 模拟面试、知识库 RAG 检索等核心功能。非常适合作为学习和简历项目，学习门槛低。

**系统架构如下**：

> **提示**：架构图采用 draw.io 绘制，导出为 svg 格式，在 Github Dark 模式下的显示效果会有问题。

![系统架构图](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/interview-guide-architecture-diagram.png)

### AI 工作流编排系统

[PaiAgent](https://github.com/itwanger/PaiAgent) 是一个**企业级的 AI 工作流可视化编排平台**，让 AI 能力的组合和调度变得简单高效。通过直观的拖拽式界面，开发者和业务人员都能快速构建复杂的 AI 处理流程，无需编写代码即可实现多种大模型的协同工作。

**系统架构如下**：

![](https://oss.javaguide.cn/github/javaguide/开源项目/ai/paiagent-architecture-diagram.jpg)


---

---

<!-- source: Java 优质开源大数据项目.md -->

## [2] Java 优质开源大数据项目

---
title: Java 优质开源大数据项目
description: Java优质开源大数据项目推荐，涵盖Spark、Flink、HBase、Storm等主流大数据处理框架介绍与对比。
category: 开源项目
icon: "mdi:database-search-outline"
---

- **[Spark](https://github.com/apache/spark)** :Spark 是用于大规模数据处理的统一分析引擎。
- **[Flink](https://github.com/apache/flink "flink")**：Apache Flink 是一个框架和分布式处理引擎，用于在*无边界和有边界*数据流上进行有状态的计算。Flink 能在所有常见集群环境中运行，并能以内存速度和任意规模进行计算。
- **[HBase](https://hbase.apache.org/)**：HBase – Hadoop Database，是一个高可靠性、高性能、面向列、可伸缩的分布式存储系统，利用 HBase 技术可在廉价 PC Server 上搭建起大规模结构化存储集群。
- **[Flume](https://flume.apache.org/)** :Apache Flume 是一个分布式的、可靠的、可用的，从多种不同的源收集、聚集、移动大量日志数据到集中数据存储的系统。
- **[Storm](https://storm.apache.org/)** : 一个分布式，高容错的实时计算系统。


---

---

<!-- source: Java 优质开源工具类.md -->

## [3] Java 优质开源工具类

---
title: Java 优质开源工具类
description: Java优质开源工具类库推荐，涵盖Lombok、Guava、Hutool、Arthas等提升开发效率和代码质量的常用工具。
category: 开源项目
icon: "mdi:library-outline"
---

## 代码质量

- [Lombok](https://github.com/rzwitserloot/lombok) :一个能够简化 Java 代码的强大工具库。通过使用 Lombok 的注解，我们可以自动生成常用的代码逻辑，例如 `getter`、`setter`、`equals`、`hashCode`、`toString` 方法，以及构造器、日志变量等内容。
- [Guava](https://github.com/google/guava "guava")： Google 开发的一组功能强大的核心库，扩展了 Java 的标准库功能。它提供了许多有用的工具类和集合类型，例如 `Multimap`（多值映射）、`Multiset`（多重集合）、`BiMap`（双向映射）和不可变集合，此外还包含图形处理库和并发工具。Guava 还支持 I/O 操作、哈希算法、字符串处理、缓存等多种实用功能。
- [Hutool](https://github.com/looly/hutool "hutool") : 一个全面且用户友好的 Java 工具库，旨在通过最小的依赖简化开发任务。它封装了许多实用的功能，例如文件操作、缓存、加密/解密、日志、文件操作。

## 问题排查和性能优化

- [Arthas](https://github.com/alibaba/arthas "arthas")：Alibaba 开源的 Java 诊断工具，可以实时监控和诊断 Java 应用程序。它提供了丰富的命令和功能，用于分析应用程序的性能问题，包括启动过程中的资源消耗和加载时间。
- [Async Profiler](https://github.com/async-profiler/async-profiler)：低开销的异步 Java 性能分析工具，用于收集和分析应用程序的性能数据。
- [Spring Boot Startup Report](https://github.com/maciejwalkowiak/spring-boot-startup-report)：用于生成 Spring Boot 应用程序启动报告的工具。它可以提供详细的启动过程信息，包括每个 bean 的加载时间、自动配置的耗时等，帮助你分析和优化启动过程。
- [Spring Startup Analyzer](https://github.com/linyimin0812/spring-startup-analyzer/blob/main/README_ZH.md)：采集 Spring 应用启动过程数据，生成交互式分析报告(HTML)，用于分析 Spring 应用启动卡点，支持 Spring Bean 异步初始化，减少优化 Spring 应用启动时间。UI 参考[Spring Boot Startup Report](https://github.com/maciejwalkowiak/spring-boot-startup-report)实现。

## 文档处理

### 文档解析

- [Tika](https://github.com/apache/tika)：Apache Tika 工具包能够检测并提取来自超过一千种不同文件类型（如 PPT、XLS 和 PDF）的元数据和文本内容。

### Excel

- [EasyExcel](https://github.com/alibaba/easyexcel) :快速、简单避免 OOM 的 Java 处理 Excel 工具。不过，这个个项目不再维护，迁移至了 [FastExcel](https://github.com/fast-excel/fastexcel)。
- [Excel Spring Boot Starter](https://github.com/pig-mesh/excel-spring-boot-starter)：基于 FastExcel 实现的 Spring Boot Starter，用于简化 Excel 的读写操作。
- [Excel Streaming Reader](https://github.com/monitorjbl/excel-streaming-reader)：Excel 流式代码风格读取工具（只支持读取 XLSX 文件），基于 Apache POI 封装，同时保留标准 POI API 的语法。
- [MyExcel](https://github.com/liaochong/myexcel)：一个集导入、导出、加密 Excel 等多项功能的工具包。

### Word

- [poi-tl](https://github.com/Sayi/poi-tl)：基于 Apache POI 的 Word 模板引擎，可以根据 Word 模板和数据生成 Word 文档，所见即所得！

### JSON

- [JsonPath](https://github.com/json-path/JsonPath)：处理 JSON 数据的工具库。

### PDF

对于简单的 PDF 创建需求，OpenPDF 是一个不错的选择，它开源免费，API 简单易用。对于需要解析、转换和提取文本等操作的复杂场景，可以选择 Apache PDFBox。当然了，复杂场景如果不介意 LGPL 许可也可以选择 iText。

- [x-easypdf](https://gitee.com/dromara/x-easypdf)：一个用搭积木的方式构建 PDF 的框架（基于 pdfbox/fop），支持 PDF 导出和编辑，适合简单的 PDF 文档生成场景。
- [iText](https://github.com/itext/itext7)：一个用于创建、编辑和增强 PDF 文档的 Java 库。iText 7 社区版采用 AGPL 许可证，如果你的项目是闭源商业项目，需要购买商业许可证。 iText 5 仍然是 LGPL 许可，可以免费用于商业用途，但已经停止维护。
- [OpenPDF](https://github.com/LibrePDF/OpenPDF)：完全开源免费 (LGPL/MPL 双重许可)，基于 iText 的一个分支，可以作为 iText 的替代品，简单易用，但功能相比于 iText 更少一些（对于大多数场景已经足够）。
- [Apache PDFBox](https://github.com/apache/pdfbox) :完全开源免费 (Apache 许可证)，功能强大，支持 PDF 的创建、解析、转换和提取文本等。不过，由于其功能过于丰富，因此 API 设计相对复杂，学习难度会大一些。
- [FOP](https://xmlgraphics.apache.org/fop/) : Apache FOP 用于将 XSL-FO（Extensible Stylesheet Language Formatting Objects）格式化对象转换为多种输出格式，最常见的是 PDF。

## 图片处理

- [Thumbnailator](https://github.com/coobird/thumbnailator)：一个图像处理工具库，主要功能是缩放图像、添加水印、旋转图像、调整图片大小以及区域裁剪。
- [Imglib](https://github.com/nackily/imglib)：一个轻量级的 JAVA 图像处理库，致力于简化对图像的常见处理，主要提供三部分的能力：图像收集、图像处理（基于 Thumbnailator 实现）、聚合与分裂。

## 验证码

- [EasyCaptcha](https://gitee.com/whvse/EasyCaptcha)：Java 图形验证码，支持 gif、中文、算术等类型，可用于 Java Web、JavaSE 等项目。
- [AJ-Captcha](https://gitee.com/anji-plus/captcha)：行为验证码(滑动拼图、点选文字)，前后端(java)交互。
- [tianai-captcha](https://gitee.com/tianai/tianai-captcha)：好看又好用的滑块验证码。

## 短信&邮件

- [SMS4J](https://github.com/dromara/SMS4J)：短信聚合框架，解决接入多个短信 SDK 的繁琐流程。
- [Simple Java Mail](https://github.com/bbottema/simple-java-mail)：最简单的 Java 轻量级邮件库，同时能够发送复杂的电子邮件。

## 在线支付

- [Jeepay](https://gitee.com/jeequan/jeepay)：一套适合互联网企业使用的开源支付系统，已实现交易、退款、转账、分账等接口，支持服务商特约商户和普通商户接口。已对接微信，支付宝，云闪付官方接口，支持聚合码支付。
- [YunGouOS-PAY-SDK](https://gitee.com/YunGouOS/YunGouOS-PAY-SDK)：YunGouOS 微信支付接口、微信官方个人支付接口、非二维码收款，非第四方清算。个人用户可提交资料开通微信支付商户，完成对接。
- [IJPay](https://gitee.com/javen205/IJPay)：聚合支付，IJPay 让支付触手可及，封装了微信支付、QQ 支付、支付宝支付、京东支付、银联支付、PayPal 支付等常用的支付方式以及各种常用的接口。

## 其他

- [oshi](https://github.com/oshi/oshi "oshi")：一款为 Java 语言提供的基于 JNA 的（本机）操作系统和硬件信息库。
- [ip2region](https://github.com/lionsoul2014/ip2region) :最自由的 ip 地址查询库，ip 到地区的映射库，提供 Binary,B 树和纯内存三种查询算法，妈妈再也不用担心我的 ip 地址定位。
- [agrona](https://github.com/real-logic/agrona)：Java 高性能数据结构（`Buffers`、`Lists`、`Maps`、`Scalable Timer Wheel`……）和实用方法。


---

---

<!-- source: Java 优质开源技术教程.md -->

## [4] Java 优质开源技术教程

---
title: Java 优质开源技术教程
description: Java优质开源技术教程推荐，涵盖Java核心知识、计算机基础、算法、系统设计等领域的高质量学习资源汇总。
category: 开源项目
icon: "mdi:book-open-page-variant-outline"
---

## Java

- [JavaGuide](https://github.com/Snailclimb/JavaGuide "JavaGuide") :【Java 学习+面试指南】 一份涵盖大部分 Java 程序员所需要掌握的核心知识。
- [toBeBetterJavaer](https://github.com/itwanger/toBeBetterJavaer)：一份通俗易懂、风趣幽默的 Java 学习指南，内容涵盖 Java 基础、Java 集合框架、Java 并发编程、JVM、Java 企业级开发（Git、SSM、Spring Boot）等知识点。
- [interview-guide](https://github.com/csguide-dabai/interview-guide)：总结了后端面试八股文中的重点，希望能帮助各位准备互联网开发岗校招面试的同学。
- [advanced-java](https://github.com/doocs/advanced-java "advanced-java") :互联网 Java 工程师进阶知识完全扫盲：涵盖高并发、分布式、高可用、微服务、海量数据处理等领域知识。
- [toBeTopJavaer](https://github.com/hollischuang/toBeTopJavaer "toBeTopJavaer")：Java 工程师成神之路 。
- [technology-talk](https://github.com/aalansehaiyang/technology-talk) : 汇总 java 生态圈常用技术框架、开源中间件，系统架构、数据库、大公司架构案例、常用三方类库、项目管理、线上问题排查、个人成长、思考等知识
- [JCSprout](https://github.com/crossoverJie/JCSprout) :处于萌芽阶段的 Java 核心知识库。
- [bestJavaer](https://github.com/crisxuan/bestJavaer) : 这是一个成为更好的 Java 程序员的系列教程。
- [java-design-patterns](https://github.com/iluwatar/java-design-patterns "java-design-patterns")：用 Java 实现的设计模式。

## 计算机基础

- [cs-self-learning](https://github.com/PKUFlyingPig/cs-self-learning)：计算机自学指南，汇总欧美众多名校高质量计算机课程。
- [CS-Notes](https://github.com/CyC2018/CS-Notes "CS-Notes")：技术面试必备基础知识、Leetcode 题解、后端面试、Java 面试、春招、秋招、操作系统、计算机网络、系统设计。
- [Waking-Up](https://github.com/wolverinn/Waking-Up)：计算机基础（计算机网络/操作系统/数据库/Git...）面试问题全面总结。

## 系统设计

### SpringBoot

- [springboot-guide](https://github.com/Snailclimb/springboot-guide)：SpringBoot 核心知识点总结。 基于 Spring Boot 2.19+。
- [SpringAll](https://github.com/wuyouzhuguli/SpringAll "SpringAll")：循序渐进，学习 Spring Boot、Spring Boot & Shiro、Spring Cloud、Spring Security & Spring Security OAuth2，博客 Spring 系列源码。
- [Springboot-Notebook](https://github.com/chengxy-nds/Springboot-Notebook) :一系列以 Spring Boot 为基础开发框架，整合 Redis、 Rabbitmq、ES、MongoDB、Spring Cloud、Kafka、Skywalking 等互联网主流技术，实现各种常见功能点的综合性案例。
- [springboot-learning-example](https://github.com/JeffLi1993/springboot-learning-example "springboot-learning-example")：Spring Boot 实践学习案例，是 Spring Boot 初学者及核心技术巩固的最佳实践。
- [spring-boot-demo](https://github.com/xkcoding/spring-boot-demo "spring-boot-demo")：spring boot demo 是一个用来深度学习并实战 spring boot 的项目，目前总共包含 63 个集成 demo，已经完成 52 个。
- [SpringBoot-Labs](https://github.com/YunaiV/SpringBoot-Labs)：Spring Boot 系列教程。

相关文章：[GitHub 点赞接近 100k 的 SpringBoot 学习教程+实战推荐！牛批！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247488298&idx=3&sn=0a8fd88ec5a050de131c2a3305482ac4&chksm=cea25ce1f9d5d5f7f53a0237d27489326bce4546353b038085c03b086d91ef396bf824d3a155&token=496868067&lang=zh_CN#rd)

### SpringCloud

- [SpringCloudLearning](https://github.com/forezp/SpringCloudLearning "SpringCloudLearning") : 方志朋的《史上最简单的 Spring Cloud 教程源码》。
- [springcloud-learning](https://github.com/macrozheng/springcloud-learning) : 一套涵盖大部分核心组件使用的 Spring Cloud 教程。
- [SpringCloud](https://github.com/zhoutaoo/SpringCloud "SpringCloud")：基于 SpringCloud2.1 的微服务开发脚手架，整合了 spring-security-oauth2、nacos、feign、sentinel、springcloud-gateway 等。

相关文章：[GitHub 点赞接近 70k 的 Spring Cloud 学习教程+实战项目推荐！牛批！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247488377&idx=1&sn=0fb33ef330159db5a9c8bc0f029cd739&chksm=cea25cb2f9d5d5a4c7bacc9dcfc90ed86e89f4262e32b40c7aa47af84c747cb6c0429f753e1d&token=496868067&lang=zh_CN#rd)

### Nginx

- [nginx-tutorial](https://github.com/dunwu/nginx-tutorial)：一系列 Nginx 极简教程，包含 HTTP 反向代理、HTTPS 反向代理、负载均衡、静态站点、文件服务器搭建等实战内容。

## 大数据

- [juicy-bigdata](https://github.com/datawhalechina/juicy-bigdata)：妙趣横生大数据，大数据技术相关内容的导论课程。
- [flink-learning](https://github.com/zhisheng17/flink-learning "flink-learning")：含 Flink 入门、概念、原理、实战、性能调优、源码解析等内容。

## 开源书籍

- [《高并发的哲学原理》](https://github.com/johnlui/PPHC)：本书的目标是在作者有限的认知范围内，讨论一下高并发问题背后隐藏的一个哲学原理——找出单点，进行拆分。
- [《Effective Java（第 3 版）》中英对照版](https://github.com/clxering/Effective-Java-3rd-edition-Chinese-English-bilingual)：《Effective Java（第 3 版）各章节的中英文学习参考。
- [《DDIA（设计数据密集型应用）》中文版](https://github.com/Vonng/ddia)：《Designing Data-Intensive Application》DDIA 中文翻译。
- [《凤凰架构》](https://github.com/fenixsoft/awesome-fenix)：讨论如何构建一套可靠的大型分布式系统。
- [《分布式系统模式》中文版](https://github.com/dreamhead/patterns-of-distributed-systems)：《Patterns of Distributed Systems》中文翻译。


---

---

<!-- source: Java 优质开源开发工具.md -->

## [5] Java 优质开源开发工具

---
title: Java 优质开源开发工具
description: Java优质开源开发工具推荐，涵盖代码质量检查、代码安全分析、项目构建、测试框架、容器化部署等开发必备工具精选。
category: 开源项目
icon: "mdi:tools"
---

## 代码质量

- [SonarQube](https://github.com/SonarSource/sonarqube "sonarqube")：静态代码检查工具，，帮助检查代码缺陷，可以快速的定位代码中潜在的或者明显的错误，改善代码质量，提高开发速度。
- [Spotless](https://github.com/diffplug/spotless)：Spotless 是支持多种语言的代码格式化工具，支持 Maven 和 Gradle 以 Plugin 的形式构建。
- [CheckStyle](https://github.com/checkstyle/checkstyle "checkstyle") : 类似于 Spotless，可帮助程序员编写符合编码标准的 Java 代码。
- [PMD](https://github.com/pmd/pmd "pmd") : 可扩展的多语言静态代码分析器。
- [SpotBugs](https://github.com/spotbugs/spotbugs "spotbugs") : FindBugs 的继任者。静态分析工具，用于查找 Java 代码中的错误。
- [P3C](https://github.com/alibaba/p3c "p3c")：Alibaba Java Coding Guidelines pmd implements and IDE plugin。Eclipse 和 IDEA 上都有该插件。

## 代码安全

- [OpenTaint](https://github.com/seqra/opentaint/blob/main/docs/translations/README.zh.md "opentaint")：面向 Java、Kotlin 和 Spring Boot 应用的开源污点分析/SAST 工具，可用于检测 SQL 注入、XSS、SSRF 等安全风险。

## 项目构建

- [Maven](https://maven.apache.org/)：一个软件项目管理和理解工具。基于项目对象模型 (Project Object Model，POM) 的概念，Maven 可以从一条中心信息管理项目的构建、报告和文档。详细介绍：[Maven 核心概念总结](https://javaguide.cn/开发工具/maven/maven-core-concepts.html)。
- [Gradle](https://gradle.org/) ：一个开源的构建自动化工具，它足够灵活，可以构建几乎任何类型的软件。Gradle 对你要构建什么或者如何构建它做了很少的假设，这使得 Gradle 特别灵活。详细介绍：[Gradle 核心概念总结](https://javaguide.cn/开发工具/gradle/gradle-core-concepts.html)。

## 反编译

- [JADX](https://github.com/skylot/jadx)：用于从 Android Dex 和 Apk 文件生成 Java 源代码的命令行和 GUI 工具。
- [JD-GUI](https://github.com/java-decompiler/jd-gui):一个独立的 GUI 工具，可显示 CLASS 文件中的 Java 源代码。

## 数据库

### 数据库建模

- [CHINER](https://gitee.com/robergroup/chiner)：开源免费的国产数据库建模工具。目标是做一款丰富数据库生态，独立于具体数据库之外的，数据库关系模型设计平台。前生是 [PDMan](https://gitee.com/robergroup/pdman)，定位为 PowerDesigner 的免费替代方案。

开源的数据库建模工具比较少，以下是一些非开源的数据库建模工具（部分需要付费才能使用） :

- [MySQL Workbench](https://www.mysql.com/products/workbench/) : MySQL 官方为数据库架构师、开发人员和 DBA 提供的一个可视化工具。 MySQL Workbench 支持数据建模，SQL 开发以及服务器配置、用户管理、性能优化、数据库备份以及迁移等功能，支持 Windows、Linux 和 Mac OS X 平台。
- [Navicat Data Modeler](https://www.navicat.com.cn/products/navicat-data-modeler) : 一款强大的和符合成本效益的数据库设计工具，它能帮助用户创建高质素的概念、逻辑和物理数据模型。让你可视化地设计数据库结构、执行逆向或正向工程程序、从 ODBC 数据源导入模型、生成复杂的 SQL/DDL 和打印模型到文件等。付费。
- [DbSchema](https://dbschema.com/) : 一款功能强大的数据库设计和管理的可视化工具，支持几乎所有的关系型和 NoSQL 数据库。付费。
- [dbdiagram.io](https://dbdiagram.io/home) : 是一款简单免费的在线 ER 图绘制工具，通过编写代码创建模型，专为开发人员和数据分析师而设计。它通过一个简单的自定义语言来生成数据模型，支持 MySQL、PostgreSQL、SQL Server 数据库 DDL 文件的正向工程和逆向工程、版本历史、在线共享、导出图片或者 PDF 等功能。dbdiagram.io 提供了免费版。

### 数据库管理

- [Chat2DB](https://github.com/alibaba/Chat2DB)：阿里巴巴开源的一款智能的通用数据库工具和 SQL 客户端，支持 Windows、Mac 本地安装，也支持服务器端部署，Web 网页访问。和传统的数据库客户端软件 Navicat、DBeaver 相比 Chat2DB 集成了 AIGC 的能力，支持自然语言生成 SQL、SQL 性能优化等功能。
- [Beekeeper Studio](https://github.com/beekeeper-studio/beekeeper-studio)：跨平台数据库管理工具，颜值高，支持 SQLite、MySQL、MariaDB、Postgres、CockroachDB、SQL Server、Amazon Redshift。
- [Sequel Pro](https://github.com/sequelpro/sequelpro)：适用于 macOS 的 MySQL/MariaDB 数据库管理工具。
- [DBeaver](https://github.com/dbeaver/dbeaver)：一个基于 Java 开发 ，并且支持几乎所有的数据库产品的开源数据库管理工具。DBeaver 社区版不光支持关系型数据库比如 MySQL、PostgreSQL、MariaDB、SQLite、Oracle、Db2、SQL Server，还比如 SQLite、H2 这些内嵌数据库。还支持常见的全文搜索引擎比如 Elasticsearch 和 Solr、大数据相关的工具比如 Hive 和 Spark。
- [Kangaroo](https://gitee.com/dbkangaroo/kangaroo)：袋鼠是一款为热门数据库系统打造的管理客户端(SQLite / MySQL / PostgreSQL / ...) ，支持建表、查询、模型、同步、导入导出等功能，支持 Windows / Mac / Linux 等操作系统，力求打造成好用、好玩、开发友好的 SQL 工具。
- [Arctype](https://arctype.com/)：一个桌面的数据库查询工具，可以连接各种数据库，在其中执行 SQL 语句，以可视化形式展示数据。
- [Mongood](https://github.com/RenzHoly/Mongood) : MongoDB 图形化的管理工具。基于微软 Fluent UI，支持自动黑暗模式。

### Redis

- [Another Redis Desktop Manager](https://github.com/qishibo/AnotherRedisDesktopManager/blob/master/README.zh-CN.md)：更快、更好、更稳定的 Redis 桌面(GUI)管理客户端，兼容 Windows、Mac、Linux。
- [Tiny RDM](https://github.com/tiny-craft/tiny-rdm)：一个更现代化的 Redis 桌面(GUI)管理客户端，基于 Webview2，兼容 Windows、Mac、Linux。
- [Redis Manager](https://github.com/ngbdf/redis-manager)：Redis 一站式管理平台，支持集群（cluster、master-replica、sentinel）的监控、安装（除 sentinel）、管理、告警以及基本的数据操作功能。
- [CacheCloud](https://github.com/sohutv/cachecloud)：一个 Redis 云管理平台，支持 Redis 多种架构(Standalone、Sentinel、Cluster)高效管理、有效降低大规模 Redis 运维成本，提升资源管控能力和利用率。
- [RedisShake](https://github.com/tair-opensource/RedisShake)：一个用于处理和迁移 Redis 数据的工具。

## Docker

- [Portainer](https://github.com/portainer/portainer)：可视化管理 Docker，Web 应用的形式。
- [lazydocker](https://github.com/jesseduffield/lazydocker)：适用于 docker 和 docker-compose 的简单终端 UI。

## ZooKeeper

- [PrettyZoo](https://github.com/vran-dev/PrettyZoo)：一个基于 Apache Curator 和 JavaFX 实现的 ZooKeeper 图形化管理客户端，颜值非常高，支持 Mac / Windows / Linux 。你可以使用 PrettyZoo 来实现对 ZooKeeper 的可视化增删改查。
- [zktools](https://zktools.readthedocs.io/en/latest/#installing)：一个低延迟的 ZooKeeper 图形化管理客户端，颜值非常高，支持 Mac / Windows / Linux 。你可以使用 zktools 来实现对 ZooKeeper 的可视化增删改查。

## Kafka

- [Kafka UI](https://github.com/provectus/kafka-ui)：免费的开源 Web UI，用于监控和管理 Apache Kafka 集群。
- [Kafdrop](https://github.com/obsidiandynamics/kafdrop) : 一个用于查看 Kafka 主题和浏览消费者组的 Web UI。
- [EFAK](https://github.com/smartloli/EFAK) （Eagle For Apache Kafka，以前叫做 Kafka Eagle）：一个简单的高性能监控系统，用于对 Kafka 集群进行全面的监控和管理。


---

---

<!-- source: Java 优质开源实战项目.md -->

## [6] Java 优质开源实战项目

---
title: Java 优质开源实战项目
description: Java优质开源实战项目推荐，涵盖快速开发平台、电商系统、权限管理等可用于学习和简历的实战项目精选。
category: 开源项目
icon: "mdi:projector-screen-outline"
---

## AI

- [interview-guide](https://github.com/Snailclimb/interview-guide)：基于 Spring Boot 4.0 + Java 21 + Spring AI + PostgreSQL + pgvector + RustFS + Redis，实现简历智能分析、AI 模拟面试、知识库 RAG 检索等核心功能。非常适合作为学习和简历项目，学习门槛低。
- [PaiAgent](https://github.com/itwanger/PaiAgent)：一个企业级的 AI 工作流可视化编排平台，让 AI 能力的组合和调度变得简单高效。通过直观的拖拽式界面，开发者和业务人员都能快速构建复杂的 AI 处理流程，无需编写代码即可实现多种大模型的协同工作。

## 快速开发平台

- [Snowy](https://gitee.com/xiaonuobase/snowy)：国内首个国密前后端分离快速开发平台。详细介绍：[5.1k！这是我见过最强的前后端分离快速开发脚手架！！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247534316&idx=1&sn=69938397674fc33ecda43c8c9d0a4039&chksm=cea10927f9d68031bc862485c6be984ade5af233d4d871d498c38f22164a84314678c0c67cd7&token=1464380539&lang=zh_CN#rd)。
- [eladmin](https://github.com/elunez/eladmin) : 前后端分离的后台管理系统，项目采用分模块开发方式， 权限控制采用 RBAC，支持数据字典与数据权限管理，支持一键生成前后端代码，支持动态路由。
- [RuoYi](https://gitee.com/y_project/RuoYi)：RuoYi 一款基于基于 SpringBoot 的权限管理系统 易读易懂、界面简洁美观，直接运行即可用 。
- [AgileBoot-Back-End](https://github.com/valarchie/AgileBoot-Back-End)：基于 Ruoyi 做了大量重构优化的基础快速开发框架。
- [SmartAdmin](https://gitee.com/lab1024/smart-admin) : 一套简洁、易用的低代码中后台解决方案。
- [EuBackend](https://gitee.com/zhaoeryu/eu-backend)：基于 SpringBoot 开发的轻量级快速开发平台。
- [RuoYi-Vue-Pro](https://github.com/YunaiV/ruoyi-vue-pro)：RuoYi-Vue 全新 Pro 版本，优化重构所有功能，支持数据权限、SaaS 多租户、Flowable 工作流、三方登录、支付等功能。
- [RuoYi-Vue-Plus](https://gitee.com/dromara/RuoYi-Vue-Plus)：RuoYi-Vue 全新 Plus 版本，重写了 RuoYi-Vue 所有功能，集成了 Sa-Token、Mybatis-Plus、Jackson、SpringDoc、Hutool、OSS 定期同步等。
- [pig](https://gitee.com/log4j/pig "pig")：基于 Spring Boot + Spring Cloud + OAuth2 的 RBAC 权限管理系统。
- [Guns](https://gitee.com/stylefeng/guns)：现代化的 Java 应用开发基础框架。
- [JeecgBoot](https://github.com/zhangdaiscott/jeecg-boot)：一款基于代码生成器的 J2EE 低代码快速开发平台，支持生成前后端分离架构的项目。
- [Erupt](https://gitee.com/erupt/erupt) : 低代码全栈类框架，它使用 Java 注解 动态生成页面以及增、删、改、查、权限控制等后台功能。
- [BallCat](https://github.com/ballcat-projects/ballcat)：一个功能完善的快速开发脚手架！除了最基本的权限管理，定时任务功能之外，还额外支持 XSS 过滤，SQL 防注入、数据脱敏等多种功能
- [JHipster](https://github.com/jhipster/generator-jhipster) :开源应用程序平台，可在几秒钟内创建 Spring Boot + Angular / React 项目。

## 博客/论坛系统

下面这几个项目都是非常适合 Spring Boot 初学者学习的，下面的大部分项目的总体代码架构我都看过，个人觉得还算不错，不会误导没有实际做过项目的朋友。

- [paicoding](https://github.com/itwanger/paicoding)：一款好用又强大的开源社区，基于 Spring Boot 系列主流技术栈，附详细的教程。
- [forest](https://github.com/rymcu/forest)：下一代的知识社区系统，可以自定义专题和作品集。后端基于 SpringBoot + Shrio + MyBatis + JWT + Redis，前端基于 Vue + NuxtJS + Element-UI。
- [community](https://github.com/codedrinker/community)：开源论坛、问答系统，现有功能提问、回复、通知、最新、最热、消除零回复功能。功能持续更新中…… 技术栈 Spring、Spring Boot、MyBatis、MySQL/H2、Bootstrap。
- [OneBlog](https://gitee.com/yadong.zhang/DBlog)：简洁美观、功能强大并且自适应的博客系统，支持广告位、SEO、实时通讯等功能。
- [VBlog](https://github.com/lenve/VBlog)：V 部落，Vue+SpringBoot 实现的多用户博客管理平台!
- [My-Blog](https://github.com/ZHENFENG13/My-Blog)： SpringBoot + Mybatis + Thymeleaf 等技术实现的 Java 博客系统，页面美观、功能齐全、部署简单及完善的代码，一定会给使用者无与伦比的体验。

## Wiki/文档系统

- [zyplayer-doc](https://gitee.com/dromara/zyplayer-doc)：适合团队和个人私有化部署使用的知识库、笔记、WIKI 文档管理工具，同时还包含数据库管理、Api 接口管理等模块。
- [kkFileView](https://gitee.com/kekingcn/file-online-preview)：文档在线预览解决方案，支持几乎所有主流文档格式预览，例如 doc、docx、ppt、pptx、wps、xls、xlsx、zip、rar、ofd、xmind、bpmn 、eml 、epub、3ds、dwg、psd 、mp4、mp3 等等。

## 文件管理系统/网盘

- [cloud-drive](https://gitee.com/SnailClimb/cloud-drive)：一个极简的现代化云存储系统，基于阿里云 OSS，提供文件上传、下载、分享等功能。系统采用前后端分离架构，提供安全可靠的文件存储服务。
- [qiwen-file](https://gitee.com/qiwen-cloud/qiwen-file)：基于 SpringBoot+Vue 实现的分布式文件系统，支持本地磁盘、阿里云 OSS 对象存储、FastDFS 存储、MinIO 存储等多种存储方式，支持 office 在线编辑、分片上传、技术秒传、断点续传等功能。
- [free-fs](https://gitee.com/dh_free/free-fs)：基于 SpringBoot + MyBatis Plus + MySQL + Sa-Token + Layui 等搭配七牛云， 阿里云 OSS 实现的云存储管理系统。 包含文件上传、删除、在线预览、云资源列表查询、下载、文件移动、重命名、目录管理、登录、注册、以及权限控制等功能。
- [zfile](https://github.com/zfile-dev/zfile)：基于 Spring Boot + Vue 实现的在线网盘，支持对接 S3、OneDrive、SharePoint、Google Drive、多吉云、又拍云、本地存储、FTP、SFTP 等存储源，支持在线浏览图片、播放音视频，文本文件、Office、obj（3d）等文件类型。

## 考试/刷题系统

- [PlayEdu](https://github.com/PlayEdu/PlayEdu)：一款适用于搭建内部培训平台的开源系统，旨在为企业/机构打造自己品牌的内部培训平台。
- [HOJ](https://gitee.com/himitzh0730/hoj)：分布式架构的在线测评平台 OJ ，功能非常全面，支持刷题、训练、比赛、评测等功能。
- [VOJ](https://github.com/simplefanC/voj)：基于微服务架构的高性能在线评测系统。拥有本地判题服务，同时支持其它知名 OJ (HDU、POJ...) 的远程判题。采用现阶段流行技术实现，采用 Docker 容器化部署。
- [OnlineJudge](https://github.com/SDUOJ/OnlineJudge)：基于微服务架构的在线评测系统，支持多种国际赛制支持（ICPC/OI/IOI），采用 Docker 容器化部署。
- [sg-exam](https://gitee.com/wells2333/sg-exam)：方便易用、高颜值的教学管理平台，提供多租户、权限管理、考试、练习、在线学习等功能。
- [uexam](https://gitee.com/mindskip/uexam)：功能全面的在线考试系统，开发部署简单快捷、界面设计友好、代码结构清晰。相关阅读：[好一个 Spring Boot 开源在线考试系统！解决了我的燃眉之急](http://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s%3F__biz%3DMzg2OTA0Njk0OA%3D%3D%26mid%3D2247491585%26idx%3D1%26sn%3D8d3c6768c22e72d6bfcbeee9624886a7%26chksm%3Dcea1afcaf9d626dc918760289c37025ad526f6255786bc198d2402203df64c873ad7934f58df%26scene%3D178%26cur_album_id%3D1345382825083895808%23rd) 。
- [PassJava-Platform](https://github.com/Jackson0714/PassJava-Platform)：基于微服务架构的面试刷题小程序！相关阅读：[一个基于 Spring Cloud 的面试刷题系统。面试、毕设、项目经验一网打尽](http://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s%3F__biz%3DMzg2OTA0Njk0OA%3D%3D%26mid%3D2247497045%26idx%3D1%26sn%3D577175bfd6c040a0df5a494fce6f9758%26chksm%3Dcea1ba9ef9d633883a2e213c0fb9a88bdc87051347d4b3fad2c2befb65d8b16e1ea81d8146dd%26scene%3D178%26cur_album_id%3D1345382825083895808%23rd)。

## 商城系统

下面的商城系统大多比较复杂比如 mall ,如果没有 Java 基础和 Spring Boot 都还没有摸熟的话不推荐过度研究下面几个项目或者使用这些项目当作毕业设计。

- [congomall](https://gitee.com/nageoffer/congomall)：不一样的 TOC 商城系统，SpringCloud-Alibaba 微服务架构设计，基于 DDD 领域驱动模型开发，代码设计优雅，涵盖商城核心业务。
- [mall](https://github.com/macrozheng/mall "mall")：mall 项目是一套电商系统，包括前台商城系统及后台管理系统，基于 SpringBoot+MyBatis 实现。
- [mall-swarm](https://github.com/macrozheng/mall-swarm "mall-swarm") : mall-swarm 是一套微服务商城系统，采用了 Spring Cloud Greenwich、Spring Boot 2、MyBatis、Docker、Elasticsearch 等核心技术，同时提供了基于 Vue 的管理后台方便快速搭建系统。
- [litemall](https://github.com/linlinjava/litemall "litemall")：又一个小商城。litemall = Spring Boot 后端 + Vue 管理员前端 + 微信小程序用户前端 + Vue 用户移动端。
- [newbee-mall](https://github.com/newbee-ltd/newbee-mall) :newbee-mall 项目（新蜂商城）是一套电商系统，包括 newbee-mall 商城系统及 newbee-mall-admin 商城后台管理系统，基于 Spring Boot 2.X 及相关技术栈开发。

## 售票系统

- [12306](https://gitee.com/nageoffer/12306) ：基于 JDK17 + SpringBoot3 + SpringCloud 微服务架构的高并发 12306 购票服务。
- [大麦](https://gitee.com/java-up-up/damai)：提供热门演唱会的购票功能，并且对如何解决高并发下的抢票而产生的各种问题，从而设计出了实际落地的解决方案。

## 造轮子

- [guide-rpc-framework](https://github.com/Snailclimb/guide-rpc-framework)：一款基于 Netty+Kyro+Zookeeper 实现的自定义 RPC 框架-附详细实现过程和相关教程。
- [mini-spring](https://github.com/DerekYRC/mini-spring)：简化版的 Spring 框架，能帮助你快速熟悉 Spring 源码和掌握 Spring 的核心原理。代码极度简化，保留了 Spring 的核心功能，如 IoC 和 AOP、资源加载器等核心功能。
- [mini-spring-cloud](https://github.com/DerekYRC/mini-spring-cloud)：一个手写的简化版的 Spring Cloud，旨在帮助你快速熟悉 Spring Cloud 源码及掌握其核心原理。相关阅读：[手写一个简化版的 Spring Cloud！](https://mp.weixin.qq.com/s/v3FUp-keswE2EhcTaLpSMQ) 。
- [haidnorJVM](https://github.com/FranzHaidnor/haidnorJVM)：使用 Java 实现的简易版 Java 虚拟机，介绍：<https://www.zhihu.com/question/28125278/answer/3137240457>。
- [itstack-demo-jvm](https://github.com/fuzhengwei/itstack-demo-jvm)：通过 Java 代码来实现 JVM 的基础功能（搜索解析 class 文件、字节码命令、运行时数据区等。相关阅读：[《zachaxy 的手写 JVM 系列》](https://zachaxy.github.io/tags/JVM/)。
- [Freedom](https://github.com/alchemystar/Freedom)：自己 DIY 一个具有 ACID 的数据库。相关项目：[MYDB](https://github.com/CN-GuoZiyang/MYDB)（一个简单的数据库实现）、[toyDB](https://github.com/erikgrinaker/toydb)（Rust 实现的分布式 SQL 数据库）。
- [lu-raft-kv](https://github.com/stateIs0/lu-raft-kv)：一个 Java 版本的 Raft(CP) KV 分布式存储实现，非常适合想要深入学习 Raft 协议的小伙伴研究。lu-raft-kv 已经实现了 Raft 协议其中的两个核心功能：leader 选举和日志复制。如果你想要学习这个项目的话，建议你提前看一下作者写的项目介绍，比较详细，地址：<http://thinkinjava.cn/2019/01/12/2019/2019-01-12-lu-raft-kv/> 。


---

---

<!-- source: Java 优质开源系统设计项目.md -->

## [7] Java 优质开源系统设计项目

---
title: Java 优质开源系统设计项目
description: Java优质开源系统设计项目推荐，涵盖Web框架、微服务、消息队列、搜索引擎、数据库等基础架构组件精选。
category: 开源项目
icon: "mdi:palette-swatch-outline"
---

## 基础框架

### Web 框架

- [Spring Boot](https://github.com/spring-projects/spring-boot "spring-boot")：Spring Boot 可以轻松创建独立的生产级基于 Spring 的应用程序，内置 web 服务器让你可以像运行普通 Java 程序一样运行项 目。另外，大部分 Spring Boot 项目只需要少量的配置即可，这有别于 Spring 的重配置。
- [SOFABoot](https://github.com/sofastack/sofa-boot)：SOFABoot 基于 Spring Boot ，不过在其基础上增加了 Readiness Check，类隔离，日志空间隔离等等能力。 配套提供的还有：SOFARPC（RPC 框架）、SOFABolt（基于 Netty 的远程通信框架）、SOFARegistry（注册中心）...详情请参考：[SOFAStack](https://github.com/sofastack) 。
- [Solon](https://gitee.com/opensolon/solon)：国产面向全场景的 Java 企业级应用开发框架。
- [Javalin](https://github.com/tipsy/javalin)：一个轻量级的 Web 框架，同时支持 Java 和 Kotlin，被微软、红帽、Uber 等公司使用。
- [Play Framework](https://github.com/playframework/playframework)：面向 Java 和 Scala 的高速 Web 框架。
- [Blade](https://github.com/lets-blade/blade)：一款追求简约、高效的 Web 框架，基于 Java8 + Netty4。

### 微服务/云原生

- [Armeria](https://github.com/line/armeria)：适合任何情况的微服务框架。你可以用你喜欢的技术构建任何类型的微服务，包括[gRPC](https://grpc.io/)、 [Thrift](https://thrift.apache.org/)、[Kotlin](https://kotlinlang.org/)、 [Retrofit](https://square.github.io/retrofit/)、[Reactive Streams](https://www.reactive-streams.org/)、 [Spring Boot](https://spring.io/projects/spring-boot)和[Dropwizard](https://www.dropwizard.io/)
- [Quarkus](https://github.com/quarkusio/quarkus) : 用于编写 Java 应用程序的云原生和容器优先的框架。
- [Helidon](https://github.com/helidon-io/helidon)：一组用于编写微服务的 Java 库，支持 Helidon MP 和 Helidon SE 两种编程模型。

### API 文档

- [Swagger](https://swagger.io/) ：较主流的 RESTful 风格的 API 文档工具，提供了一套工具和规范，让开发人员能够更轻松地创建和维护可读性强、易于使用和交互的 API 文档。
- [Knife4j](https://doc.xiaominfo.com/)：集 Swagger2 和 OpenAPI3 为一体的增强解决方案。

### Bean 映射

- [MapStruct](https://github.com/mapstruct/mapstruct)（推荐）：满足 JSR269 规范的一个 Java 注解处理器，用于为 Java Bean 生成类型安全且高性能的映射。它基于编译阶段生成 get/set 代码，此实现过程中没有反射，不会造成额外的性能损失。
- [MapStruct Plus](https://github.com/linpeilie/mapstruct-plus)：MapStruct 增强版本，支持自动生成 Mapper 接口。
- [JMapper](https://github.com/jmapper-framework/jmapper-core) : 一个高性能且易于使用的 Bean 映射框架。

### 其他

- [Guice](https://github.com/google/guice)：Google 开源的一个轻量级依赖注入框架，相当于一个功能极简化的轻量级 Spring Boot。在某些情况下非常实用，就比如说我们的项目只需要使用依赖注入，不需要 AOP 等功能特性。
- [Spring Batch](https://github.com/spring-projects/spring-batch) : Spring Batch 是一个轻量级但功能又十分全面的批处理框架，主要用于批处理场景比如从数据库、文件或队列中读取大量记录。不过，需要注意的是：Spring Batch 不是调度框架。商业和开源领域都有许多优秀的企业调度框架比如 Quartz、XXL-JOB、Elastic-Job。它旨在与调度程序一起工作，而不是取代调度程序。

## 认证授权

### 权限认证

- [Sa-Token](https://github.com/dromara/sa-token)：轻量级 Java 权限认证框架。支持认证授权、单点登录、踢人下线、自动续签等功能。相比于 Spring Security 和 Shiro 来说，Sa-Token 内置的开箱即用的功能更多，使用也更简单。
- [Spring Security](https://github.com/spring-projects/spring-security)：Spring 官方安全框架，能够用于身份验证、授权、加密和会话管理，是目前使用最广泛的 Java 安全框架。
- [Shiro](https://github.com/apache/shiro)：Java 安全框架，功能和 Spring Security 类似，但使用起来更简单。

### 第三方登录

- [WxJava](https://github.com/Wechat-Group/WxJava) : WxJava （微信开发 Java SDK），支持包括微信支付、开放平台、小程序、企业微信/企业号和公众号等的后端开发。
- [JustAuth](https://github.com/justauth/JustAuth)：小而全而美的第三方登录开源组件。目前已经集成了诸如：GitHub、Gitee、支付宝、新浪微博、微信、Google、Facebook、Twitter、StackOverflow 等国内外数十家第三方平台。

### 单点登录（SSO）

- [CAS](https://github.com/apereo/cas)：企业多语言网络单点登录解决方案。
- [MaxKey](https://gitee.com/dromara/MaxKey)：单点登录认证系统，提供安全、标准和开放的用户身份管理(IDM)、身份认证(AM)、单点登录(SSO)、RBAC 权限管理和资源管理等。
- [Keycloak](https://github.com/keycloak/keycloak)：免费、开源身份认证和访问管理系统，支持高度可配置的单点登录功能。

## 网络通讯

- [Netty](https://github.com/netty/netty) : 一个基于 NIO 的 client-server(客户端服务器)框架，使用它可以快速简单地开发网络应用程序。
- [Retrofit](https://github.com/square/retrofit)：适用于 Android 和 Java 的类型安全的 HTTP 客户端。Retrofit 的 HTTP 请求使用的是 [OkHttp](https://square.github.io/okhttp/) 库（一款被广泛使用网络框架）。
- [Forest](https://gitee.com/dromara/forest)：轻量级 HTTP 客户端 API 框架，让 Java 发送 HTTP/HTTPS 请求不再难。它比 OkHttp 和 HttpClient 更高层，是封装调用第三方 restful api client 接口的好帮手，是 retrofit 和 feign 之外另一个选择。
- [netty-websocket-spring-boot-starter](https://github.com/YeautyYE/netty-websocket-spring-boot-starter) :帮助你在 Spring Boot 中使用 Netty 来开发 WebSocket 服务器，并像 spring-websocket 的注解开发一样简单。

## 数据库

### 数据库连接池

- [Druid](https://github.com/alibaba/druid) : 阿里巴巴数据库事业部出品，为监控而生的数据库连接池。
- [HikariCP](https://github.com/brettwooldridge/HikariCP) : 一个可靠的高性能 JDBC 连接池。Springboot 2.0 选择 HikariCP 作为默认数据库连接池。

### 数据库框架

- [MyBatis-Plus](https://github.com/baomidou/mybatis-plus) : [MyBatis](http://www.mybatis.org/mybatis-3/) 增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。
- [MyBatis-Flex](https://gitee.com/mybatis-flex/mybatis-flex)：一个优雅的 MyBatis 增强框架，无其他任何第三方依赖，支持 CRUD、分页查询、多表查询、批量操作。
- [jOOQ](https://github.com/jOOQ/jOOQ)：用 Java 编写 SQL 的最佳方式。
- [Redisson](https://github.com/redisson/redisson "redisson")：Redisson 是一款架设在 Redis 基础之上的 Java 驻内存数据网格 (In-Memory Data Grid)，它充分利用了 Redis 键值数据库的优势，为 Java 开发者提供了一系列具有分布式特性的常用工具类。例如，分布式 Java 对象（`Set`，`SortedSet`，`Map`，`List`，`Queue`，`Deque` 等）、分布式锁等。详细介绍请看：[Redisson 项目介绍](https://github.com/redisson/redisson/wiki/Redisson%E9%A1%B9%E7%9B%AE%E4%BB%8B%E7%BB%8D "Redisson项目介绍")。

### 数据同步

- [Canal](https://github.com/alibaba/canal "canal") [kə'næl] : Canal 译意为水道/管道/沟渠，主要用途是基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费。
- [DataX](https://github.com/alibaba/DataX "DataX")：DataX 是阿里巴巴集团内被广泛使用的离线数据同步工具/平台，实现包括 MySQL、Oracle、SqlServer、Postgre、HDFS、Hive、ADS、HBase、TableStore(OTS)、MaxCompute(ODPS)、DRDS 等各种异构数据源之间高效的数据同步功能。相关项目：[DataX-Web](https://github.com/WeiYe-Jing/datax-web) （DataX 集成可视化页面，选择数据源即可一键生成数据同步任务）。

其他：[Flinkx](https://github.com/DTStack/flinkx) （基于 Flink 的分布式数据同步工具）。

### 时序数据库

- [IoTDB](https://github.com/apache/iotdb)：一款 Java 语言编写的国产时序数据库，为用户提供数据收集、存储和分析等服务。与 Hadoop、Spark 和可视化工具(如 Grafana)无缝集成，满足了工业 IoT 领域中海量数据存储、高吞吐量数据写入和复杂数据查询分析的需求。
- [KairosDB](https://github.com/kairosdb/kairosdb)：一个基于 Cassandra 的快速分布式可扩展时间序列数据库。

## 搜索引擎

- [Elasticsearch](https://github.com/elastic/elasticsearch "elasticsearch") （推荐）：开源，分布式，RESTful 搜索引擎。
- [Meilisearch](https://github.com/meilisearch/meilisearch)：一个功能强大、快速、开源、易于使用和部署的搜索引擎，支持中文搜索（不需要添加额外的配置）。
- [Solr](https://lucene.apache.org/solr/) : Solr（读作“solar”）是 Apache Lucene 项目的开源企业搜索平台。
- [Easy-ES](https://gitee.com/dromara/easy-es)：傻瓜级 ElasticSearch 搜索引擎 ORM 框架。

## 测试

### 测试框架

- [JUnit](http://junit.org/) : Java 测试框架。
- [Mockito](https://github.com/mockito/mockito)：Mockito 是一个模拟测试框架，可以让你用优雅，简洁的接口写出漂亮的单元测试。（对那些不容易构建的对象用一个虚拟对象来代替，使其在调试期间用来作为真实对象的替代品）
- [PowerMock](https://github.com/powermock/powermock)：编写单元测试仅靠 Mockito 是不够。因为 Mockito 无法 mock 私有方法、final 方法及静态方法等。PowerMock 这个 framework，主要是为了扩展其他 mock 框架，如 Mockito、EasyMock。它使用一个自定义的类加载器，纂改字节码，突破 Mockito 无法 mock 静态方法、构造方法、final 类、final 方法以及私有方法的限制。
- [WireMock](https://github.com/tomakehurst/wiremock)：模拟 HTTP 服务的工具（Mock your APIs）。
- [Testcontainers](https://github.com/testcontainers/testcontainers-java)：一个支持 JUnit 的测试工具库，提供轻量级的且一次性的常见数据库测试支持、Selenium Web 浏览器或者其他任何可以在 Docker 容器中运行的实例支持。

相关阅读：

- [The Practical Test Pyramid- Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html) (很赞的一篇文章，不过是英文的)
- [浅谈测试之 PowerMock](https://juejin.im/post/6844903982058618894)

### 测试平台

- [MeterSphere](https://github.com/metersphere/metersphere) : 一站式开源持续测试平台，涵盖测试跟踪、接口测试、性能测试、团队协作等功能，全面兼容 JMeter、Postman、Swagger 等开源、主流标准。
- [Apifox](https://www.apifox.cn/)：API 文档、API 调试、API Mock、API 自动化测试。

### API 调试

- [Reqable](https://reqable.com/zh-CN/)：新一代开源 API 开发工具。Reqable = Fiddler + Charles + Postman, 让 API 调试更快。
- [Insomnia](https://insomnia.rest/) :像人类而不是机器人一样调试 API。我平时经常用的一款 API 开发工具，界面美观且轻量，总之很喜欢。
- [RapidAPI](https://paw.cloud/)：一款功能齐全的 HTTP 客户端，但仅支持 Mac。
- [Postcat](https://github.com/Postcatlab/postcat)：一个可扩展的开源 API 工具平台。
- [Postman](https://www.getpostman.com/)：开发者最常用的 API 测试工具之一。
- [Hoppscotch](https://github.com/liyasthomas/postwoman "postwoman")（原 Postwoman）：开源 API 测试工具。官方定位是 Postman、Insomnia 等产品的开源替代品。
- [Restful Fast Request](https://gitee.com/dromara/fast-request)：IDEA 版 Postman，API 调试工具 + API 管理工具 + API 搜索工具。

## 任务调度

- [Quartz](https://github.com/quartz-scheduler/quartz)：一个很火的开源任务调度框架，Java 定时任务领域的老大哥或者说参考标准， 很多其他任务调度框架都是基于 `quartz` 开发的，比如当当网的`elastic-job`就是基于`quartz`二次开发之后的分布式调度解决方案
- [XXL-JOB](https://github.com/xuxueli/xxl-job) :XXL-JOB 是一个分布式任务调度平台，其核心设计目标是开发迅速、学习简单、轻量级、易扩展。现已开放源代码并接入多家公司线上产品线，开箱即用。
- [Elastic-Job](http://elasticjob.io/index_zh.html)：Elastic-Job 是当当网开源的一个基于 Quartz 和 Zookeeper 的分布式调度解决方案，由两个相互独立的子项目 Elastic-Job-Lite 和 Elastic-Job-Cloud 组成，一般我们只要使用 Elastic-Job-Lite 就好。
- [EasyScheduler](https://github.com/analysys/EasyScheduler "EasyScheduler") （已经更名为 DolphinScheduler，已经成为 Apache 孵化器项目）：分布式易扩展的可视化工作流任务调度平台，主要解决“复杂任务依赖但无法直接监控任务健康状态”的问题。
- [PowerJob](https://gitee.com/KFCFans/PowerJob)：新一代分布式任务调度与计算框架，支持 CRON、API、固定频率、固定延迟等调度策略，提供工作流来编排任务解决依赖关系，使用简单，功能强大，文档齐全，欢迎各位接入使用！<http://www.powerjob.tech/> 。

## 工作流

1. [Flowable](https://github.com/flowable/flowable-engine) ：Activiti5 的一个分支发展而来，功能丰富，在 Activiti 的基础上，引入了更多高级功能，如更强大的 CMMN（案例管理模型与符号）、DMN（决策模型与符号）支持，以及更灵活的集成选项。
2. [Activiti](https://github.com/Activiti/Activiti)：功能扩展相对保守，适合需要稳定 BPMN 2.0 工作流引擎的传统企业应用。
3. [Warm-Flow](https://gitee.com/dromara/warm-flow)：国产开源工作流引擎，其特点简洁轻量但又不简单，五脏俱全，组件独立，可扩展。
4. [FlowLong](https://gitee.com/aizuda/flowlong)：国产开源工作流引擎，专门中国特色流程审批打造。

## 分布式

### API 网关

- [Kong](https://github.com/Kong/kong "kong")：Kong 是一个云原生、快速的、可伸缩的分布式微服务抽象层(也称为 API 网关、API 中间件或在某些情况下称为服务网格)。2015 年作为开源项目发布，其核心价值是高性能和可扩展性。
- [ShenYu](https://github.com/Dromara/soul "soul")：适用于所有微服务的可伸缩、高性能、响应性 API 网关解决方案。
- [Spring Cloud Gateway](https://github.com/spring-cloud/spring-cloud-gateway) : 基于 Spring Framework 5.x 和 Spring Boot 2.x 构建的高性能网关。
- [Zuul](https://github.com/Netflix/zuul) : Zuul 是一个 L7 应用程序网关，它提供了动态路由，监视，弹性，安全性等功能。

### 配置中心

- [Apollo](https://github.com/ctripcorp/apollo "apollo")（推荐）：Apollo（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。
- [Nacos](https://github.com/alibaba/nacos)（推荐）：Nacos 是 Spring Cloud Alibaba 提供的服务注册发现组件，类似于 Consul、Eureka。并且，提供了分布式配置管理功能。
- [Spring Cloud Config](https://github.com/spring-cloud/spring-cloud-config)：Spring Cloud Config 是 Spring Cloud 家族中最早的配置中心，虽然后来又发布了 Consul 可以代替配置中心功能，但是 Config 依然适用于 Spring Cloud 项目，通过简单的配置即可实现功能。
- [Consul](https://github.com/hashicorp/consul)：Consul 是 HashiCorp 公司推出的开源软件，提供了微服务系统中的服务治理、配置中心、控制总线等功能。这些功能中的每一个都可以根据需要单独使用，也可以一起使用以构建全方位的服务网格，总之 Consul 提供了一种完整的服务网格解决方案。

### 链路追踪

- [Skywalking](https://github.com/apache/skywalking "skywalking") : 针对分布式系统的应用性能监控，尤其是针对微服务、云原生和面向容器的分布式系统架构。
- [Zipkin](https://github.com/openzipkin/zipkin "zipkin")：Zipkin 是一个分布式跟踪系统。它有助于收集解决服务体系结构中的延迟问题所需的时序数据。功能包括该数据的收集和查找。
- [CAT](https://github.com/dianping/cat "cat")：CAT 作为服务端项目基础组件，提供了 Java, C/C++, Node.js, Python, Go 等多语言客户端，已经在美团点评的基础架构中间件框架（MVC 框架，RPC 框架，数据库框架，缓存框架等，消息队列，配置系统等）深度集成，为美团点评各业务线提供系统丰富的性能指标、健康状况、实时告警等。

相关阅读：[Skywalking 官网对于主流开源链路追踪系统的对比](https://skywalking.apache.org/zh/blog/2019-03-29-introduction-of-skywalking-and-simple-practice.html)

### 分布式锁

- [Lock4j](https://gitee.com/baomidou/lock4j)：支持 Redisson、ZooKeeper 等不同方案的高性能分布式锁。
- [Redisson](https://github.com/redisson/redisson "redisson")：Redisson 在分布式锁方面提供全面且强大的支持，超越了简单的 Redis 锁实现。

## 高性能

### 多线程

- [Hippo4j](https://github.com/opengoofy/hippo4j)：异步线程池框架，支持线程池动态变更&监控&报警，无需修改代码轻松引入。支持多种使用模式，轻松引入，致力于提高系统运行保障能力。
- [Dynamic Tp](https://github.com/dromara/dynamic-tp)：轻量级动态线程池，内置监控告警功能，集成三方中间件线程池管理，基于主流配置中心（已支持 Nacos、Apollo，Zookeeper、Consul、Etcd，可通过 SPI 自定义实现）。
- [asyncTool](https://gitee.com/jd-platform-opensource/asyncTool) : 京东的一位大佬开源的多线程工具库，里面大量使用到了 `CompletableFuture` ，可以解决任意的多线程并行、串行、阻塞、依赖、回调的并行框架，可以任意组合各线程的执行顺序，带全链路执行结果回调。

### 缓存

#### 本地缓存

- [Caffeine](https://github.com/ben-manes/caffeine) : 一款强大的本地缓存解决方案，性能非常强大。
- [Guava](https://github.com/google/guava)：Google Java 核心库，内置了比较完善的本地缓存实现。
- [OHC](https://github.com/snazy/ohc) ：Java 堆外缓存解决方案（项目从 2021 年开始就不再进行维护了）。

#### 分布式缓存

- [Redis](https://github.com/redis/redis)：一个使用 C 语言开发的内存数据库，分布式缓存首选。
- [Dragonfly](https://github.com/dragonflydb/dragonfly)：一种针对现代应用程序负荷需求而构建的内存数据库，完全兼容 Redis 和 Memcached 的 API，迁移时无需修改任何代码，号称全世界最快的内存数据库。
- [KeyDB](https://github.com/Snapchat/KeyDB)： Redis 的一个高性能分支，专注于多线程、内存效率和高吞吐量。

#### 多级缓存

- [J2Cache](https://gitee.com/ld/J2Cache)：基于本地内存和 Redis 的两级 Java 缓存框架。
- [JetCache](https://github.com/alibaba/jetcache)：阿里开源的缓存框架，支持多级缓存、分布式缓存自动刷新、 TTL 等功能。

### 消息队列

**分布式队列**：

- [RocketMQ](https://github.com/apache/rocketmq "RocketMQ")：阿里巴巴开源的一款高性能、高吞吐量的分布式消息中间件。
- [Kafka](https://github.com/apache/kafka "Kafka"): Kafka 是一种分布式的，基于发布 / 订阅的消息系统。
- [RabbitMQ](https://github.com/rabbitmq "RabbitMQ") :由 erlang 开发的基于 AMQP（Advanced Message Queue 高级消息队列协议）协议实现的消息队列。

**内存队列**：

- [Disruptor](https://github.com/LMAX-Exchange/disruptor)：Disruptor 是英国外汇交易公司 LMAX 开发的一个高性能队列，研发的初衷是解决内存队列的延迟问题（在性能测试中发现竟然与 I/O 操作处于同样的数量级）。

### 读写分离和分库分表

- [ShardingSphere](https://github.com/apache/shardingsphere)：ShardingSphere 是一套开源的分布式数据库中间件解决方案组成的生态圈，它由 Sharding-JDBC、Sharding-Proxy 和 Sharding-Sidecar（计划中）这 3 款相互独立的产品组成。
- [MyCat](https://github.com/MyCatApache/MyCat2) : MyCat 是数据库分库分表的中间件，MyCat 使用最多的两个功能是：读写分离和分库分表。MyCat 是一些社区爱好者在阿里 Cobar 的基础上进行二次开发，解决了 Cobar 当时存 在的一些问题，并且加入了许多新的功能在其中。
- [dynamic-datasource-spring-boot-starter](https://github.com/baomidou/dynamic-datasource-spring-boot-starter)：一个基于 Spring Boot 的快速集成多数据源的启动器，支持多数据源、动态数据源、主从分离、读写分离和分布式事务。

## 高可用

### 限流

分布式限流：

- [Sentinel](https://github.com/alibaba/Sentinel)（推荐）：面向分布式服务架构的高可用防护组件，主要以流量为切入点，从流量控制、熔断降级、系统自适应保护等多个维度来帮助用户保障微服务的稳定性。
- [Hystrix](https://github.com/Netflix/Hystrix)：类似于 Sentinel 。

相关阅读：[Sentinel 与 Hystrix 的对比](https://sentinelguard.io/zh-cn/blog/sentinel-vs-hystrix.html)。

单机限流：

- [Bucket4j](https://github.com/vladimir-bukhtoyarov/bucket4j)：一个非常不错的基于令牌/漏桶算法的限流库。
- [Resilience4j](https://github.com/resilience4j/resilience4j)：一个轻量级的容错组件，其灵感来自于 Hystrix。

### 监控

- [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin)：管理和监控 Spring Boot 应用程序。
- [Metrics](https://github.com/dropwizard/metrics)：捕获 JVM 和应用程序级别的指标。所以你知道发生了什么事。

### 日志

- EKL 老三件套 : 最原始的时候，ELK 是由 3 个开源项目的首字母构成，分别是 Elasticsearch、Logstash、Kibana。
- 新一代 ELK 架构 : Elasticsearch+Logstash+Kibana+Beats。
- EFK : EFK 中的 F 代表的是 [Fluentd](https://github.com/fluent/fluentd)。
- [TLog](https://gitee.com/dromara/TLog)：一个轻量级的分布式日志标记追踪神器，10 分钟即可接入，自动对日志打标签完成微服务的链路追踪。

## 字节码操作

- [ASM](https://asm.ow2.io/)：通用 Java 字节码操作和分析框架。它可用于直接以二进制形式修改现有类或动态生成类。
- [Byte Buddy](https://github.com/raphw/byte-buddy)：Java 字节码生成和操作库，用于在 Java 应用程序运行时创建和修改 Java 类，无需使用编译器
- [Javassist](https://github.com/jboss-javassist/javassist)：动态编辑 Java 字节码的类库。
- [Recaf](https://github.com/Col-E/Recaf)：现代 Java 字节码编辑器，基于 ASM（Java 字节码操作框架） 来修改字节码，可简化编辑已编译 Java 应用程序的过程。

