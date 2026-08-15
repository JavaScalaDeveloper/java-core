---
title: 专栏 重点汇总
---

# 专栏 重点汇总

> 从 0-ALL.md 筛选：面试常问与企业开发常用内容。

## TOC

1. Java 必读源码系列 | Dubbo + Netty + Spring Boot 源码解析 (`Java 必读源码系列 Dubbo + Netty + Spring Boot 源码解析.md`)
2. Java 面试指北 | Java 后端面试指南 | Java 八股文面试题大全 (`Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md`)
3. 大模型实战项目 + Agent实战项目：Spring AI 面试平台与 RAG 知识库 (`大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库.md`)
4. 后端高频系统设计面试题 | 场景题 | 秒杀系统 | 短链系统（含答案） (`后端高频系统设计面试题 场景题 秒杀系统 短链系统（含答案）.md`)
5. 手写 RPC 框架 | Netty + Kryo + Zookeeper 实战教程 (`手写 RPC 框架 Netty + Kryo + Zookeeper 实战教程.md`)

---

<!-- source: Java 必读源码系列 Dubbo + Netty + Spring Boot 源码解析.md -->

## [1] Java 必读源码系列 | Dubbo + Netty + Spring Boot 源码解析

---
title: Java 必读源码系列 | Dubbo + Netty + Spring Boot 源码解析
description: Java 主流框架源码解析专栏，涵盖 Dubbo、Netty、Spring Boot 等框架的源码深入解读，助力后端开发者理解底层原理与设计思想。
category: 知识星球
star: true
head:
  - - meta
    - name: keywords
      content: Java源码,源码解析,Dubbo源码,Netty源码,Spring Boot源码,框架源码,源码阅读,Java源码学习,开源框架源码
---

## 介绍

**《Java 必读源码系列》** 是我的[知识星球](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)的一个内部小册，目前已经整理了 Dubbo 2.6.x、Netty 4.x、Spring Boot 2.1 等框架/中间件的源码。后续还会整理更多值得阅读的优质源码，持续完善中。

结构清晰，内容详细，非常适合想要深入学习框架/中间件源码的同学阅读。

## 内容概览

![](https://oss.javaguide.cn/xingqiu/image-20220621091832348.png)

<!-- @include: @planet2.snippet.md -->

## 更多专栏

除了《Java 必读源码系列》之外，我的知识星球还有 [《Java 面试指北》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247536358&idx=2&sn=a6098093107d596d3c426c9e71e871b8&chksm=cea1012df9d6883b95aab61fd815a238c703b2d4b36d78901553097a4939504e3e6d73f2b14b&token=710779655&lang=zh_CN#rd)、[《后端面试高频系统设计&场景题》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247536451&idx=1&sn=5eae2525ac3d79591dd86c6051522c0b&chksm=cea10088f9d6899e0aee4146de162a6de6ece71ba4c80c23f04d12b1fd48c087a31bc7d413f4&token=710779655&lang=zh_CN#rd)、[《手写 RPC 框架》](./手写 RPC 框架 Netty + Kryo + Zookeeper 实战教程.md)等多个专栏。进入星球之后，统统都可以免费阅读。

![](https://oss.javaguide.cn/xingqiu/image-20220211231206733.png)


---

---

<!-- source: Java 面试指北 Java 后端面试指南 Java 八股文面试题大全.md -->

## [2] Java 面试指北 | Java 后端面试指南 | Java 八股文面试题大全

---
title: Java 面试指北 | Java 后端面试指南 | Java 八股文面试题大全
description: 四年打磨的 Java 后端面试指南，涵盖 Java 核心、并发、JVM、Spring、MySQL、Redis、系统设计等高频面试题系统讲解，适合校招/社招 Java 后端面试复习。
category: 知识星球
star: 5
head:
  - - meta
    - name: keywords
      content: Java面试,Java面试指南,Java八股文,Java面试题,Java后端面试,Java面试指北,Java核心面试题,JVM面试题,并发面试题,Spring面试题,MySQL面试题,系统设计面试
---

**四年磨一剑，只为打造最优质的 Java 面试指南。**

这本《Java 面试指北》（后端面试通用）的内容经过反复打磨，质量极高，旨在帮助每一位 Java/后端求职者从容应对面试挑战。

**用数据说话：** 截至目前，专栏累计阅读量已突破 **477.1W**，收获点赞 **5,118** 个，评论互动 **1,657** 条。值得一提的是，评论区不仅仅是留言板，更是答疑区——几乎每一条提问，我都会用心回复，确保无疑问遗留。

![](https://oss.javaguide.cn/xingqiu/java-interview-guide-statistics-2025.png)

📅 **增长见证：** 下图记录了 2024 年时的成绩。对比当下，你会发现其增长速度可以用“惊人”来形容，这不仅是数据的攀升，更是无数读者认可的证明！

![](https://oss.javaguide.cn/xingqiu/java-interview-guide-statistics.png)

## 介绍

**《Java 面试指北》** 是我的[知识星球](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)的一个内部小册，和 [JavaGuide 开源版](https://javaguide.cn/) 的内容互补。相比于开源版本来说，《Java 面试指北》添加了下面这些内容（不仅仅是这些内容）：

- 17+ 篇文章手把手教你如何准备面试，50+ 准备面试过程中的常见问题详细解读，让你更高效地准备 Java 面试。
- 更全面的八股文面试题（系统设计、场景题、常见框架、分布式&微服务、高并发 ……）。
- 优质面经精选（相比于牛客网或者其他网站的面经，《Java 面试指北》中整理的面经质量更高，并且，我会提供优质的参考资料）。
- 技术面试题自测（高效准备技术八股文的技巧之一在于多多自测，查漏补缺）。
- 练级攻略（有助于个人成长的经验分享）。

《Java 面试指北》 会根据每一年的面试情况对内容进行更新完善，保证内容质量的时效性。并且，只需要加入[知识星球](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)一次，即可永久获取《Java 面试指北》的访问权限，持续同步更新完善。

下面是《Java 面试指北》 收到的部分球友的真实反馈：

![《Java 面试指北》 收到的部分球友的真实反馈](https://oss.javaguide.cn/xingqiu/praise-that-the-mianshizhibei-received.png)

## 内容概览

![《Java 面试指北》内容概览](https://oss.javaguide.cn/javamianshizhibei/javamianshizhibei-content-overview.png)

### 面试准备篇

在 **「面试准备篇」** ，我写了 17+ 篇文章手把手教你如何准备面试，50+ 准备面试过程中的常见问题详细解读。准备面试过程中常见的疑问这里都有解答，内容涵盖项目经验、简历编写、源码学习、算法准备、面试资源等等。

![《Java 面试指北》面试准备篇](https://oss.javaguide.cn/javamianshizhibei/preparation-for-interview.png)

其中的 **「⭐Java 面试准备常见问题解答（补充）」** 和 **「⭐ 项目经验常见问题解答（补充）」** 强烈建议必看，信息密度非常高！

![](https://oss.javaguide.cn/javamianshizhibei/java-project-experience-and-interview-faq.png)

另外，考虑到很多同学项目经历不足，我还专门整理了一批**小众但优质的实战项目**：既有配套视频，也有高质量开源仓库，既包含完整业务系统，也有技术含量很高的轮子类项目，方便你快速补齐项目短板。

![《Java面试指北》-实战项目推荐](https://oss.javaguide.cn/javamianshizhibei/practical-project-recommendation.png)

### 技术面试题篇

**「技术面试题篇」** 的内容和 JavaGuide 开源版本互补，不仅仅包括最基本的 Java、常见框架等八股文，还包括系统设计、分布式、高并发等进阶内容。

![《Java 面试指北》技术面试题篇](https://oss.javaguide.cn/javamianshizhibei/technical-interview-questions.png)

### 面经篇

古人云：“**他山之石，可以攻玉**”。善于学习借鉴别人的面试的成功经验或者失败的教训，可以让自己少走许多弯路。

**「面经篇」** 主打高质量 Java 后端真实面经：校招 / 社招全覆盖，大厂、中小厂、央国企、外企，连大厂内包都有，不管你是哪种求职方向，都能找到适配的面经参考。

![《Java 面试指北》面经篇](https://oss.javaguide.cn/javamianshizhibei/real-interview-experience.png)

**为何选择《Java 面试指北》的面经？**

相比于网络上海量但杂乱的面经信息，《Java 面试指北》中提供的面经在质量筛选和价值挖掘上投入了更多精力。每一份收录的面经均力求做到：

- **内容真实、有启发性**： 优先选择那些能反映实际面试场景、考察重点和面试官思路的经验。
- **提供深度学习资源**： 拒绝“只有问题没有答案”的焦虑。针对面经中的高频/核心难题，我精心关联了高质量的参考资料（通常是我撰写的深度解析文章）或直接提供核心参考答案，助你知其然更知其所以然。

另外，[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)还有专门分享面经和面试题的专题，持续更新优质的面经和面试题。

![](https://oss.javaguide.cn/javamianshizhibei/xingqiu-real-interview-experience.png)

### 技术面试题自测篇

为了让小伙伴们自测以检查自己的掌握情况，我还推出了 **「技术面试题自测」** 系列。目前已经覆盖 Java 后端的核心高频考点，并在持续迭代更新中。

![《Java 面试指北》技术面试题自测篇](https://oss.javaguide.cn/javamianshizhibei/self-test.png)

每道题我都会给出**提示与思路**，并用 ⭐ 标注重要程度：⭐ 越多，说明面试越爱问，就越值得多花一些时间准备。

![](https://oss.javaguide.cn/javamianshizhibei/self-test-key-points.png)

高效准备技术八股文的技巧之一在于多多自测，查漏补缺。

### 练级攻略篇

**「练级攻略篇」** 这个系列主要分享一些有助于个人成长的经验。

![《Java 面试指北》练级攻略篇](https://oss.javaguide.cn/javamianshizhibei/training-strategy-articles.png)

每一篇内容都非常干货，不少球友看了之后表示收获满满。不过，最重要的还是知行合一。

### 工作篇

**「工作篇」** 这个系列主要分享有助于个人及职场发展的内容，以及在工作中经常会遇到的问题。

![《Java 面试指北》工作篇](https://oss.javaguide.cn/javamianshizhibei/gongzuopian.png)

<!-- @include: @planet2.snippet.md -->


---

---

<!-- source: 大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库.md -->

## [3] 大模型实战项目 + Agent实战项目：Spring AI 面试平台与 RAG 知识库

---
title: 大模型实战项目 + Agent实战项目：Spring AI 面试平台与 RAG 知识库
description: 基于 Spring Boot 4.0 + Java 21 + Spring AI 2.0 的大模型实战项目和 Agent实战项目，集成 RAG 知识库、AI 模拟面试、简历分析、语音面试等功能，适合后端开发者学习 AI 应用开发、Spring AI 框架实战和 RAG/Agent 工程落地。
category: 知识星球
star: 5
head:
  - - meta
    - name: keywords
      content: Spring AI实战,Spring AI项目,Spring Boot AI,RAG知识库,AI面试平台,大模型实战项目,Agent实战项目,大模型项目,Agent项目,AI应用开发实战,Spring Boot 4,AI模拟面试,RAG实战,Java AI项目,大模型落地项目,AI简历项目,Spring AI 2.0
---

很多后端同学准备简历项目时都会遇到同一个问题：项目里全是增删改查（CRUD），技术栈看起来不少，但面试官很难继续深挖，也很难体现你对 **大模型应用开发、RAG 知识库、Agent 工程落地** 这些新方向的理解。

这篇要介绍的就是一个面向 Java 后端的 **大模型实战项目 + Agent 实战项目**：基于 **Spring Boot 4.0、Java 21、Spring AI 2.0** 构建 AI 智能面试辅助平台，把简历分析、AI 模拟面试、RAG 知识库问答、语音面试、异步任务处理、分布式限流等能力串成一个完整项目。

如果你想找一个能写进简历、能用于面试讲解、也能系统学习 Spring AI 和 RAG/Agent 实战的项目，这个项目会比单纯堆业务表的 CRUD 项目更适合你。

## 项目介绍

这是一个基于 Spring Boot 4.0 + Java 21 + Spring AI 2.0 的 AI 智能面试辅助平台。系统提供三大核心功能：

1. **智能简历分析**：上传简历后，AI 自动进行多维度评分并给出改进建议
2. **模拟面试系统**：基于简历内容生成个性化面试题，支持实时问答和答案评估
3. **RAG 知识库问答**：上传技术文档构建私有知识库，支持向量检索增强的智能问答

![效果展示](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-resume-history.png)

**项目地址** （欢迎 star 鼓励）：

- Github：<https://github.com/Snailclimb/interview-guide>
- Gitee：<https://gitee.com/SnailClimb/interview-guide>

完整代码完全免费开源，没有 Pro 版本或者付费版！

## 简历写法

**如何将《SpringAI 智能面试平台+RAG知识库》实战项目写进简历？**我一共提供了五大方向版本任选，精准匹配岗位需求：

1. **后端方向**：提供“架构与分布式能力侧重”、“AI 应用与响应式编程侧重”、“工程化与基础设施侧重”三个版本，无论你面试的是后端、大模型应用还是架构岗位，都能找到最合适的切入点。
2. **测试/测开方向**：专门设计了“单元测试与 TDD”以及“功能/异常场景覆盖”两个版本，突出测试工程师在 AI 质量保障中的核心竞争力。

![《SpringAI 智能面试平台+RAG知识库》简历写法](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/project-on-resume.png)

每一条描述都紧扣项目真实逻辑，严格遵守项目介绍规范。不仅教你怎么写，更教你怎么补，例如针对本项目未涉及的“用户认证与鉴权”给出补充建议，教你如何基于 SpringSecurity/Sa-Token 包装主流的认证授权方案。

并且，我还补充了面试官可深挖的技术难点（如 Redis Stream vs 传统消息队列、分布式限流的实现细节）以及项目难点与解决方案模板。

## 教程概览

带大家看看我写的配套教程，用心程度一切都在文字中！整个项目教程，我手绘了几十张技术配图帮助理解。

例如，RAG 面试题总结这篇，耗时一周终于完成了第一版，一共 **3.4 万字**，包含 **35 道高频 RAG 面试题**，光校对都进行了三次。而且，这还只是第一版，后续还会继续完善优化！

![RAG 面试题](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/rag-interview-questions.png)

这篇是对应的 RAG 知识库详细开发思路的介绍。

![RAG 知识库详细开发思路](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/rag-knowledge-base-coding.png)

不仅教你“如何写出代码”，更教你“为什么这么设计”以及“在企业真实场景中如何应对复杂挑战”。

## 配套教程内容安排

这个项目当前实现的功能比较简单，学习门槛极低，但涉及到的知识点比较丰富。通过保姆级教程，我们将从零构建一个融合了 **LLM 集成、RAG（检索增强生成）、向量数据库、分布式限流及异步处理**的完整后端架构。

无论你是想学习 **Spring AI** 的前沿应用，还是需要一个**高含金量的简历项目**，本项目都将为你提供从基建搭建、业务攻坚到面试话术复盘的全方位指导。

配套项目教程需要付费（**后文/文末**有加入方法），但请大家理解，主要是想覆盖一些时间成本。而且，收费和提供的服务相比绝对是超级良心了。这辈子不可能干割韭菜的事！

**内容安排如下（已经更完，一共 13w+ 字）**：

![配套教程内容概览](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/tutorial-overview.png)

### 环境搭建

- 本地搭建 PostgreSQL + PGvector 向量数据库
- Spring Boot + RustFS 构建高性能 S3 兼容的对象存储服务
- ⭐大模型 API 申请和 Ollama 部署本地模型
- 环境搭建终章与项目启动

### 核心功能开发

- 基于 Tika 实现多格式内容提取与解析
- ⭐Spring AI 与大模型集成
- ⭐Spring AI + pgvector 实现 RAG 知识库问答
- 基于 SSE 实现打字机效果输出
- 手把手教你写出生产级结构化 Prompt
- AI 模拟面试功能
- 基于 iText 8 实现 PDF 报告导出

### 进阶优化

- MapStruct 实体映射最佳实践
- ⭐基于 Redis Stream 的异步任务处理实现
- 封装 Redis + Lua 多维度分布式限流组件
- ⭐Skill 架构设计
- Spring Boot 4.0 升级指南
- Docker Compose 一键部署

### 面试

- ⭐简历编写与项目经历深度包装指南
- 面试官问“这个项目哪里来的”时，如何回答？
- ⭐Spring AI 面试问题挖掘
- ⭐知识库 RAG 面试问题挖掘
- Redis 面试问题挖掘
- 文件上传解析与 PDF 导出面试问题挖掘

## 加入学习

**本项目为 [JavaGuide 知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html) 内部专属实战项目，通过语雀文档在线阅读学习，不单独对外开放。**

之所以选择在星球内部发布，是为了确保每一位学习者都能获得**深度的技术答疑**和**完整的求职配套服务**。

整个项目教程预计在 **1-2** 个月内更完。每一篇文章（不提供视频，浪费时间且不利于学习能力提高）都经过反复推敲，确保**高质量、零门槛**，即便是基础薄弱的同学也能跟着文档从零跑通。

这只是开始。后续星球还会持续推出更多贴合企业真实业务场景的 **Java 实战项目**，带你始终站在技术前沿（预告一下，下一个项目是**企业级智能客服系统**，会带大家实践更多AI能力）。

并且，我的星球还有很多其他服务，比如**一对一提问、简历修改、后端系统面试资料（包含高频系统设计&场景题）、学习打卡**等，其中任何一项服务单独拎出来的价值都已远超星球门票。欢迎详细了解我的[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)！

已经坚持维护**六年**，内容持续更新，虽白菜价（**0.4 元/天**）但质量很高，主打一个良心！

目前星球正在做活动，两本书的价格，就能让你拥有上万培训班的服务！这里再提供一张 **30 元** 的优惠券（价格马上上调，老用户扫码续费半价）：

![知识星球 30 元优惠券](https://oss.javaguide.cn/xingqiu/xingqiuyouhuijuan-30.jpg)

用心做内容，坚持本心，不割韭菜，其他交给时间！共勉！

## 系统架构

**提示**：架构图采用 draw.io 绘制，导出为 svg 格式，在 Dark 模式下的显示效果会有问题。

系统采用前后端分离架构，整体分为三层：前端展示层、后端服务层、数据存储层。

![系统架构图](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/interview-guide-architecture-diagram.png)

**后端层**：

- REST Controllers：统一的 API 入口，处理 HTTP 请求
- 业务服务层：
  - Resume Service：简历上传、解析、AI 分析
    - Interview Service：面试会话管理、问题生成、答案评估
    - Knowledge Service：知识库上传、文本分块、向量化
    - RAG Chat Service：检索增强生成，流式问答
- 异步处理层：基于 Redis Stream 的消费者，异步处理耗时的 AI 任务（如简历分析、向量化、面试评估）
- AI 集成层：Spring AI + DashScope（通义千问）。统一的 LLM 调用接口，支持对话生成和文本向量化。

**数据存储层**：

- PostgreSQL + pgvector：
  - 关系数据：简历、面试记录、知识库元数据
  - 向量检索：存储文档向量，支持相似度搜索
- Redis：

  - 会话缓存：面试会话状态
  - 消息队列：Redis Stream 实现异步任务队列

- RustFS/MinIO (S3)：原始文件（简历 PDF、知识库文档）

**异步处理流程**：

简历分析、知识库向量化和面试报告生成采用 Redis Stream 异步处理，这里以简历分析和知识库向量化为例介绍一下整体流程：

```
上传请求 → 保存文件 → 发送消息到 Stream → 立即返回
                              ↓
                      Consumer 消费消息
                              ↓
                    执行分析/向量化任务
                              ↓
                      更新数据库状态
                              ↓
                   前端轮询获取最新状态
```

状态流转： `PENDING` → `PROCESSING` → `COMPLETED` / `FAILED`

**知识库问答处理流程**：

```
知识库问答 → 问题向量化 → pgvector 相似度搜索 → 检索相关文档
                                                      ↓
                                构建 Prompt → LLM 生成回答 → SSE 流式返回
```

## 技术栈

### 后端技术

| 技术                  | 版本       | 说明                           |
| --------------------- | ---------- | ------------------------------ |
| Spring Boot           | 4.0.1      | 应用框架                       |
| Java                  | 21         | 开发语言（虚拟线程）           |
| Spring AI             | 2.0.0-M4   | AI 集成框架                    |
| PostgreSQL + pgvector | 14+        | 关系数据库 + 向量存储          |
| Redis + Redisson      | 6+ / 4.0.0 | 缓存 + 消息队列（Stream）      |
| Apache Tika           | 2.9.2      | 文档解析                       |
| iText 8               | 8.0.5      | PDF 导出                       |
| MapStruct             | 1.6.3      | 对象映射                       |
| SpringDoc OpenAPI     | 3.0.2      | API 接口文档                   |
| DashScope SDK         | 2.22.7     | 语音识别/合成（Qwen3 ASR/TTS） |
| spring-ai-agent-utils | 0.7.0      | Spring AI Agent Skills 工具库  |
| WebSocket             | -          | 语音面试实时双向通信           |
| Gradle                | 8.14       | 构建工具                       |

技术选型常见问题解答：

1. 数据存储为什么选择 PostgreSQL + pgvector？PG 的向量数据存储功能够用了，精简架构，不想引入太多组件。
2. 为什么引入 Redis？
   - Redis 替代 `ConcurrentHashMap` 实现面试会话的缓存。
   - 基于 Redis Stream 实现简历分析、知识库向量化等场景的异步（还能解耦，分析和向量化可以使用其他编程语言来做）。不使用 [Kafka](https://javaguide.cn/高性能/消息队列/kafka-questions-01.html) 这类成熟的消息队列，也是不想引入太多组件。
3. 构建工具为什么选择 Gradle？个人更喜欢用 Gradle，也写过相关的文章：[Gradle核心概念总结](https://javaguide.cn/开发工具/gradle/gradle-core-concepts.html)。

### 前端技术

| 技术               | 版本  | 说明          |
| ------------------ | ----- | ------------- |
| React              | 18.3  | UI 框架       |
| TypeScript         | 5.6   | 开发语言      |
| Vite               | 5.4   | 构建工具      |
| Tailwind CSS       | 4.1   | 样式框架      |
| React Router       | 7.11  | 路由管理      |
| Framer Motion      | 12.23 | 动画库        |
| Recharts           | 3.6   | 图表库        |
| Lucide React       | 0.468 | 图标库        |
| React Big Calendar | 1.19  | 面试日历组件  |
| React Markdown     | 9.0   | Markdown 渲染 |
| React Virtuoso     | 4.18  | 虚拟滚动列表  |

## 技术选型常见问题解答

这里只是简单介绍，后续我会分享文章详细拷打技术选型。

### 为什么选择 Spring AI？

Spring AI 是 Spring 官方推出的 AI 集成框架，提供了统一的 LLM 调用抽象。选择它的原因：

1. 统一抽象：一套代码支持多种 LLM 提供商（OpenAI、阿里云 DashScope、Ollama 等），切换模型只需修改配置
2. Spring 生态集成：与 Spring Boot 无缝集成，支持自动配置、依赖注入、声明式调用
3. 内置向量存储支持：原生支持 pgvector、Milvus、Pinecone 等向量数据库，简化 RAG 开发
4. 结构化输出：通过 `BeanOutputConverter` 将 LLM 输出直接映射为 Java 对象，无需手动解析 JSON

```java
// 示例：Spring AI 结构化输出
var converter = new BeanOutputConverter<>(ResumeAnalysisDTO.class);
String result = chatClient.prompt()
    .system(systemPrompt)
    .user(userPrompt + converter.getFormat())
    .call()
    .content();
return converter.convert(result);  // 直接得到 Java 对象
```

### 数据存储为什么选择 PostgreSQL + pgvector？

本项目需要同时存储结构化数据（简历、面试记录）和向量数据（文档 Embedding）。方案对比：

| 方案                  | 优点                     | 缺点                       |
| --------------------- | ------------------------ | -------------------------- |
| PostgreSQL + pgvector | 一套数据库搞定，运维简单 | 向量检索性能不如专业向量库 |
| PostgreSQL + Milvus   | 向量检索性能更好         | 多一个组件，运维复杂度增加 |
| PostgreSQL + Pinecone | 云托管，无需运维         | 成本高，数据在第三方       |

**选择 pgvector 的理由**：

- 架构简单：不引入额外组件，降低部署和运维复杂度
- 性能够用：HNSW 索引支持毫秒级检索，万级文档场景完全够用
- 事务一致性：向量数据和业务数据在同一数据库，天然支持事务
- SQL 查询：可以结合 WHERE 条件过滤，比如“只在某个分类的知识库中检索”

```sql
-- pgvector 相似度搜索示例
SELECT content, 1 - (embedding <=> \$1) as similarity
FROM vector_store
WHERE metadata->>'category' = 'Java'
ORDER BY embedding <=> \$1
LIMIT 5;
```

**为什么不选择 MySQL 搭配向量数据库呢？**

PostgreSQL 最大的优势，也是它在 AI 时代甩开对手的“王牌”，就是其强大的可扩展性。开发者可以在不修改内核的情况下，像“即插即用”一样为数据库安装各种功能强大的插件，这让 PostgreSQL 变成了一个无所不能的“数据瑞士军刀”。

- **AI 向量检索？** 有官方推荐的 **pgvector** 扩展，性能强大，生态成熟，足以媲美专业的向量数据库。
- **全文搜索？** 内置支持（能满足基础需求），或使用 **pg_bm25** 等扩展。
- **时序数据？** 有顶级的 **TimescaleDB** 扩展。
- **地理信息？** 有行业标准的 **PostGIS** 扩展。

这种“一站式”解决能力，正是其魅力所在。它意味着许多项目不再需要依赖 Elasticsearch、Milvus 等大量外部中间件，仅凭一个增强版的 PostgreSQL 即可满足多样化需求，从而极大地简化了技术栈，降低了开发和运维的复杂度与成本。

关于 MySQL 和 PostgreSQL 的详细对比，可以参考我写的这篇文章：[MySQL vs PostgreSQL，如何选择？](https://mp.weixin.qq.com/s/APWD-PzTcTqGUuibAw7GGw)。

### 为什么引入 Redis？

本项目主要有两个场景用到了 Redis：

1. Redis 替代 `ConcurrentHashMap` 实现会话的缓存。
2. 基于 Redis Stream 实现简历分析、知识库向量化等场景的异步（还能解耦，分析和向量化可以使用其他编程语言来做）。

**为什么引入 Redis Stream？为何不选择 Kafka、RabbitMQ 等更成熟的消息队列？**

简历分析、知识库向量化等 AI 任务耗时较长（10-60 秒），不适合同步处理。需要消息队列实现异步解耦。

| 维度             | Redis Stream                      | RabbitMQ                       | Kafka                        | 内存队列                           |
| :--------------- | :-------------------------------- | :----------------------------- | :--------------------------- | :--------------------------------- |
| **吞吐量**       | 高（十万级 QPS）                  | 中（万级 QPS）                 | 极高（百万级，水平扩展）     | 极高（千万级/秒，受限于 CPU/内存） |
| **延迟**         | 极低（亚毫秒级）                  | 低（毫秒级）                   | 中（毫秒到十毫秒级）         | 极低（纳秒/微秒级）                |
| **持久化**       | 支持（RDB/AOF）                   | 支持（Mnesia/磁盘）            | 强支持（原生分段日志）       | 无（进程终止即失）                 |
| **消息堆积能力** | 一般（受限于内存）                | 中（磁盘堆积，性能下降明显）   | 极强（TB 级磁盘存储）        | 差（受限于堆内存）                 |
| **消费模式**     | 发布订阅 / 消费者组               | 灵活路由 / 多种交换机模式      | 发布订阅 / 消费者组          | 点对点 / 多消费者（取决于实现）    |
| **消息回溯**     | 支持（按 ID / 时间范围）          | 不支持                         | 强支持（按 Offset / 时间戳） | 不支持                             |
| **消息顺序性**   | 单 Stream 有序                    | 单队列有序                     | 单 Partition 有序            | 有序（单队列）                     |
| **可靠性**       | 中（异步复制可能丢失）            | 高（Publisher Confirm / 事务） | 极高（多副本 ISR + acks）    | 低（无持久化、无确认）             |
| **运维复杂度**   | 低                                | 中                             | 高（KRaft 模式已简化）       | 极低                               |
| **适用场景**     | 轻量级流处理、已有 Redis 基础设施 | 复杂路由、企业级集成           | 大数据流、事件溯源、日志聚合 | 进程内解耦、极致性能场景           |

选择 Redis Stream 的理由：

- 复用现有组件：Redis 已用于会话缓存，无需引入新中间件。
- 功能满足需求：支持消费者组、消息确认（ACK）、持久化。
- 运维简单：对于中小型项目，Redis Stream 完全够用。

### 构建工具为什么选择 Gradle？

Spring Boot 官方现在用的就是 Gradle，加上国内现在都是 Maven 更多，换个 Gradle 还更新颖一些。

个人也更喜欢用 Gradle，也写过相关的文章：[Gradle 核心概念总结](https://javaguide.cn/开发工具/gradle/gradle-core-concepts.html)。

### 为什么使用 MapStruct？

项目中有大量 Entity ↔ DTO 转换需求，MapStruct 是编译时代码生成的对象映射框架：

| 方案        | 性能         | 类型安全   | 使用复杂度   |
| ----------- | ------------ | ---------- | ------------ |
| MapStruct   | 零反射，最快 | 编译时检查 | 定义接口即可 |
| BeanUtils   | 反射，慢     | 运行时报错 | 一行代码     |
| ModelMapper | 反射，较慢   | 运行时报错 | 配置复杂     |
| 手写转换    | 最快         | 编译时检查 | 重复代码多   |

### 为什么使用 Apache Tika？

系统需要解析多种格式的文档（PDF、Word、TXT），Apache Tika 是 Apache 基金会的文档解析库：

- 格式支持全：PDF、DOCX、DOC、TXT、HTML、Markdown 等上百种格式
- 自动识别：根据文件内容自动检测格式，无需依赖文件扩展名
- 文本提取：统一的 API 提取纯文本，屏蔽格式差异

```java
// Tika 解析示例
Tika tika = new Tika();
String content = tika.parseToString(inputStream);  // 自动识别格式并提取文本
```

### 为什么使用 SSE 而不是 WebSocket？

知识库问答需要流式输出（像 ChatGPT 那样逐字显示），有两种技术选择：

| 方案      | 优点                      | 缺点                       |
| --------- | ------------------------- | -------------------------- |
| SSE       | 简单，基于 HTTP，单向推送 | 仅支持服务端 → 客户端      |
| WebSocket | 双向通信，功能强大        | 协议复杂，需要维护连接状态 |

选择 SSE 的理由：

- 场景匹配：LLM 流式输出是单向的（服务端 → 客户端），不需要双向通信
- 实现简单：基于 HTTP，天然支持重连、跨域
- Spring 支持好：`Flux<ServerSentEvent<String>>` 一行代码搞定

### 前端为什么选择 React + TypeScript + Tailwind CSS？

| 技术         | 选择理由                                   |
| ------------ | ------------------------------------------ |
| React        | 生态最成熟，组件化开发，社区资源丰富       |
| TypeScript   | 类型安全，IDE 智能提示，减少运行时错误     |
| Vite         | 开发服务器启动快（秒级），HMR 热更新体验好 |
| Tailwind CSS | 原子化 CSS，快速开发，无需写 CSS 文件      |

## 功能特性

### 简历管理模块

- **多格式解析**：支持 PDF、DOCX、DOC、TXT 等多种简历格式。
- **异步处理流**：基于 Redis Stream 实现异步简历分析，支持实时查看处理进度（待分析/分析中/已完成/失败）。
- **稳定性保障**：内置分析失败自动重试机制（最多 3 次）与基于内容哈希的重复检测。
- **分析报告导出**：支持将 AI 分析结果一键导出为结构化的 PDF 简历分析报告。

### 模拟面试模块

- **Skill 驱动出题**：内置 10+ 面试方向（Java 后端、阿里/字节/腾讯专项、前端、Python、算法、系统设计、测开、AI Agent 等），每个方向由 `SKILL.md` 定义考察范围、难度分布和参考知识库。基于 `spring-ai-agent-utils` 的 Progressive Disclosure 机制实现按需加载。
- **并行双路出题**：有简历时，60% 简历项目深挖题（独立 Prompt）+ 40% 方向基础题（Skill 驱动），使用 Java 21 虚拟线程并行生成后合并，物理隔离避免 Prompt 冲突。
- **自定义 JD 解析**：粘贴职位描述（JD），LLM 动态提取面试分类并匹配共享题库，无需预设方向即可开始面试。
- **简历推荐方向**：上传简历后，LLM 通过 Semantic Matching 自动推荐最匹配的面试方向，降低用户选择成本。
- **历史题目去重**：出题时自动排除已有会话中问过的题目，避免重复考察。
- **面试阶段时长联动**：总时长滑块拖动后，各阶段（自我介绍、技术考察、项目深挖、反问环节）按时比自动分配。
- **智能追问流**：支持配置多轮智能追问（默认 1 条），模拟多轮问答场景。
- **统一评估架构**：文字面试和语音面试共用同一套评估引擎（分批评估 + 结构化输出 + 二次汇总 + 降级兜底），评估结果可对比。
- **报告一键导出**：支持异步生成并导出详细的 PDF 模拟面试评估报告。
- **面试中心入口**：面试中心页整合文字面试和语音面试入口，支持继续面试和重新面试。

### 面试安排模块

- **邀请解析**：规则 + AI 双引擎，支持飞书/腾讯会议/Zoom 格式，自动提取公司、岗位、时间、会议链接
- **日历管理**：日/周/月视图 + 拖拽调整 + 列表视图
- **状态流转**：定时任务自动过期，手动标记待面试/已完成/已取消
- **面试提醒**：可配置提醒，避免错过面试

### 语音面试模块

实时语音对话面试，WebSocket + 千问3 语音模型（ASR/TTS/LLM 统一 API Key）：

- **实时流式对话**：句子级并发 TTS，边生成边合成边播放，首包延迟 200ms
- **服务端 VAD**：自动断句，实时字幕（含中间结果）
- **回声防护 + 手动提交**：避免 AI 语音被误录入
- **多轮上下文记忆 + 暂停/恢复**：超时自动暂停
- **Micrometer 埋点**：TTS/ASR 延迟、会话时长等指标

> **已知问题**：端到端延迟偏高（服务端音频中转）、无耳机时回声泄漏、TTS 音色单一、弱网音频断续。后续计划探索 WebRTC、客户端 VAD 降噪、端到端语音模型等方案。

### 知识库管理模块

- **文档智能处理**：支持 PDF、DOCX、Markdown 等多种格式文档的自动上传、分块与异步向量化。
- **RAG 检索增强**：集成向量数据库，通过检索增强生成（RAG）提升 AI 问答的准确性与专业度。
- **流式响应交互**：基于 SSE（Server-Sent Events）技术实现打字机式流式响应。
- **智能问答对话**：支持基于知识库内容的智能问答，并提供直观的知识库统计信息。

## 效果展示

### 简历与面试

面试中心：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-interview-hub.png)

Skill 出题 + JD 解析：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-skill-jd-parse.png)

简历库：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-resume-history.png)

简历上传分析：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-resume-upload-analysis.png)

简历分析详情：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-resume-analysis-detail.png)

面试记录：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-interview-history.png)

面试详情：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-interview-detail.png)

模拟面试：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-mock-interview.png)

面试安排

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-interview-schedule-list.png)

### 知识库

知识库管理：

![](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-knowledge-base-management.png)

问答助手：

![page-qa-assistant](https://oss.javaguide.cn/xingqiu/pratical-project/大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库/page-qa-assistant.png)

## 学习本项目你将获得什么？

本项目采用行业最前沿的 Java 21 + Spring Boot 4.0 技术栈，是市面上首个深度集成 Spring AI 2.0 的全栈实战项目。我们不仅提供高质量的代码，更配套了详尽的架构解析教程。

项目整体设计遵循“由浅入深”原则。即使你的编程基础尚浅，只需跟随我们的保姆级教程，也能顺利从零搭建出一套生产级别的 AI 大模型应用。

### 深度掌握 AI 应用开发的核心范式

本项目是你从传统后端转型 AI 应用开发工程师的最佳敲门砖：

- **Spring AI 2.0 工业级实战**：深入理解 Spring 官方的 AI 抽象层，掌握如何通过统一的声明式接口对接通义千问、OpenAI 等主流模型。

- **Prompt Engineering（提示词工程）深度应用**：告别简单的字符串拼接。学习如何构建结构化的 System/User Prompt，并利用 BeanOutputConverter 实现 LLM 输出向 Java 对象的自动化映射，彻底终结繁琐的 JSON 手动解析。

- **Query Rewrite（查询重写）技术**：学习如何利用 LLM 对用户原始查询进行智能改写，补充语义、优化检索词，显著提升 RAG 系统的召回率。掌握“原问题→改写问题→回退原问题”的级联检索策略。

- **动态检索参数调优**：深入理解如何根据查询长度、语义密度等特征，动态调整 topK 与相似度阈值，实现短查询、中长查询、长查询的差异化检索策略。

- **RAG（检索增强生成）全链路闭环**：深度拆解“文档解析 → 文本分块 → 向量化 (Embedding) → 向量数据库存储 → 相似度检索 → 上下文增强生成”的完整技术链条。学习“有效命中判定”机制，避免弱相关片段触发生效模型的长篇“信息不足”回复。

- **结构化输出可靠性与重试策略**：掌握 `StructuredOutputInvoker` 统一封装模式，学习如何通过自动重试、错误注入、严格 JSON 指令等方式，大幅提升 LLM 结构化输出的解析成功率。

### 现代化的 Java 后端架构思维

你可以学习到优秀的工程实践：

- **拥抱 Java 21 与 Spring Boot 4.0**：抢先布局虚拟线程 (Virtual Threads)、Record 类等高性能特性。针对 Spring Boot 4.0 的模块化设计进行深度适配，让你的技术栈领先市场。

- **模块化单体架构**：学习如何通过清晰的层级（Modules + Infrastructure + Common）组织代码。这种设计既具备微服务的解耦优势，又极大降低了单体应用的运维心智负担。

- **极致的对象转换性能**：通过 MapStruct 在编译期生成映射代码。学习如何在追求极致响应速度的场景下，优雅、安全地处理 Entity 与 DTO 之间的复杂映射。

### 务实的数据存储与中间件选型

我们拒绝盲目堆砌中间件，而是教你如何基于业务场景做出“最理智”的选择：

- **PostgreSQL + pgvector 的“一站式”存储方案**：掌握如何在同一套数据库中高效处理关系型业务数据与高维向量数据。深入学习 HNSW 索引在万级文档场景下的性能调优实践。

- **Redis + Lua 分布式限流体系**：实战封装高性能分布式限流组件。基于 Lua 脚本保证限流逻辑的原子性，支持按用户、IP 或全局维度的精准流量控制，有效防御恶意刷接口行为，保障高价值 AI API 的配额安全。

- **Redis Stream 异步任务处理**：深入探讨在简历分析等耗时场景（10-60s）下，为什么选择轻量级的 Redis Stream 而非 Kafka。实战演示如何通过消息队列实现系统解耦与流量削峰。

- **企业级文件处理与清洗优化**：不仅利用 Apache Tika 构建通用的文档解析引擎，还配套实现了 TextCleaningService。通过正则清洗、空行标准化及文本去噪（如剔除图片链接、非法控制字符），显著提升 RAG 的召回质量；同时集成内容哈希检测，从源头拦截重复上传，节省存储与 Token 成本。

### 高级 AI 功能设计模式

- **Skill 架构与 Agent Skills**：学习如何将面试方向配置从代码中解耦，基于 `SKILL.md` + `skill.meta.yml` 的双层配置设计。掌握 `spring-ai-agent-utils` 的 Discovery → Semantic Matching → Execution 三层 Progressive Disclosure 机制，以及文字面试（单次调用预加载）与语音面试（多轮 ReAct 按需加载）的差异化资源加载策略。

- **并行双路出题架构**：深入理解”单次调用无法兼顾简历和方向”的 Prompt 冲突问题，学习如何通过物理隔离（两套独立 Prompt 模板 + 两路并行 AI 调用）实现 60% 简历题 + 40% 方向题的混合出题，以及索引合并和降级策略的设计。

- **多轮追问生成机制**：学习如何在面试问题生成场景中，通过多层 Prompt 设计实现”主问题 + 追问”的树形结构。掌握可配置追问数量、问题类型权重分配、历史去重等实战技巧。

- **流式输出智能处理**：掌握 SSE 流式场景下的”探测窗口”技术——在保持首字响应速度的同时，快速识别”无信息”输出并统一为固定模板，避免用户看到长篇拒答文字。

- **统一无结果策略**：学习如何在 RAG 系统中设计一致的用户无结果体验，包括命中判定、输出归一化、流式截断等全链路优化。

### 标准化的工程化交付与部署

- **Gradle 现代构建体系**：摆脱 Maven 的繁琐配置，掌握 Gradle 8.14 及其版本目录 (Version Catalog) 的灵活性，学习如何优雅地管理大型项目依赖。

- **生产级容器化部署**：通过 Docker Compose 一键搭建包含数据库扩展、缓存、对象存储在内的全套运行环境，理解云原生时代下的基础设施配置规范。

### 丝滑的前端工程化与交互体验

对于后端开发者，这更是一次补齐“全栈视野”的绝佳机会：

- **SSE (Server-Sent Events) 流式渲染**：掌握像 ChatGPT 一样逐字输出回答的底层技术，理解其在单向推送场景下相比 WebSocket 的架构优势。

- **响应式 UI 与动效设计**：利用 Tailwind CSS 极简构建美观界面，结合 Framer Motion 实现高级交互动效。

- **AI 数据可视化**：通过 Recharts 将 AI 分析后的简历评分、多维对比以直观的雷达图形式呈现，让数据“会说话”。

## 如何加入学习？

很多 AI 项目只停留在调用一个 API。而本项目带你解决的是**真实工程问题**：

- 如何处理大模型响应慢的问题？（**异步处理 + Redis Stream**）
- 如何让大模型输出格式固定的数据？（**结构化 Prompt + MapStruct**）
- 如何让大模型基于私有文档回答？（**RAG + pgvector**）

**本项目为 [JavaGuide 知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html) 内部专属实战项目，通过语雀文档在线阅读学习，不单独对外开放。**

之所以选择在星球内部发布，是为了确保每一位学习者都能获得**深度的技术答疑**和**完整的求职配套服务**。

这只是开始。后续星球还会持续推出更多贴合企业真实业务场景的 **Java 实战项目**，带你始终站在技术前沿（预告一下，下一个项目是**企业级智能客服系统**，会带大家实践更多AI能力）。

并且，我的星球还有很多其他服务，比如**一对一提问、简历修改、后端系统面试资料（包含高频系统设计&场景题）、学习打卡**等，其中任何一项服务单独拎出来的价值都已远超星球门票。欢迎详细了解我的[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)！

已经坚持维护**六年**，内容持续更新，虽白菜价（**0.4 元/天**）但质量很高，主打一个良心！

目前星球正在做活动，两本书的价格，就能让你拥有上万培训班的服务！这里再提供一张 **30 元** 的优惠券（价格马上上调，老用户扫码续费半价）：

![知识星球 30 元优惠券](https://oss.javaguide.cn/xingqiu/xingqiuyouhuijuan-30.jpg)

用心做内容，坚持本心，不割韭菜，其他交给时间！共勉！


---

---

<!-- source: 后端高频系统设计面试题 场景题 秒杀系统 短链系统（含答案）.md -->

## [4] 后端高频系统设计面试题 | 场景题 | 秒杀系统 | 短链系统（含答案）

---
title: 后端高频系统设计面试题 | 场景题 | 秒杀系统 | 短链系统（含答案）
description: 后端面试高频系统设计与场景题解析，涵盖秒杀系统、短链系统、海量数据处理、分布式 ID 等 30+ 道经典面试题，适合中大厂后端面试准备。
category: 知识星球
head:
  - - meta
    - name: keywords
      content: 系统设计面试题,场景题,后端面试系统设计,秒杀系统设计,短链系统设计,海量数据处理面试题,分布式系统设计,高频面试题,系统设计案例,后端场景面试题
---

## 介绍

**《后端面试高频系统设计&场景题》** 是我的[知识星球](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)的一个内部小册，系统性地总结了后端面试中高频出现的系统设计案例和场景题。

### 为什么你需要这份小册？

近年来，国内技术面试“越来越卷”。越来越多的公司（阿里、美团、字节、腾讯等）开始在面试中考察 **系统设计** 和 **场景问题**，以此来更全面地考察求职者的综合能力——不论是校招还是社招。

> 很多同学八股文背得滚瓜烂熟，但一遇到“如何设计一个秒杀系统？”这类开放性问题就懵了。

**系统设计和场景题的考察特点**：

- ✅ 没有标准答案，重点考察思维过程和架构能力
- ✅ 考察对高并发、高可用、分布式等技术的综合运用
- ✅ 考察解决实际问题的能力和工程经验
- ⚠️ 正常面试不会全是场景题，一般会穿插 1-2 道来考察你

于是，**《后端面试高频系统设计&场景题》** 小册就诞生了！

### 这份小册能带给你什么？

**1. 面试加分项**

系统设计和场景题回答得好，面试官会对你印象非常好！这类问题稍微准备就能脱颖而出。

**2. 提升系统设计思维**

即使不是准备面试，这份小册也能帮助你建立系统设计的思维框架，提升解决实际问题的能力。

**3. 实战落地参考**

涉及到的很多案例都可以直接用到自己的项目上，比如：

- 第三方授权登录（微信/QQ 登录）
- Redis 实现延时任务的正确方式
- 动态线程池的设计与实现
- 分布式锁的多种实现方案

## 内容概览

### 📐 系统设计案例

| 主题                                   | 核心知识点                                         |
| -------------------------------------- | -------------------------------------------------- |
| ⭐ **如何设计一个动态线程池？**        | 线程池参数动态调整、监控告警、拒绝策略、优雅停机   |
| **如何设计一个站内消息系统？**         | 消息推送、未读数统计、WebSocket、消息队列          |
| **如何设计微博 Feed 流/信息流系统？**  | 推拉模型、Timeline、智能推荐、读写扩散、缓存策略   |
| **如何设计一个排行榜？**               | Redis Sorted Set、实时更新、分页查询、海量数据排序 |
| **几种典型的系统设计案例（整理补充）** | 点赞、优惠券、红包等综合案例分享                   |

### 🎯 高频场景题

| 主题                                    | 核心知识点                                            |
| --------------------------------------- | ----------------------------------------------------- |
| ⭐ **订单超时自动取消如何实现？**       | 延时队列、定时任务、状态机、幂等性保障                |
| **如何基于 Redis 实现延时任务？**       | 过期事件监听 vs Redisson DelayedQueue、时效性、可靠性 |
| ⭐ **如何解决大文件上传问题？**         | 分片上传、断点续传、秒传、并发上传、文件校验          |
| **如何实现 IP 归属地功能？**            | IP 库选择、离线库 vs 在线接口、性能优化               |
| **如何统计网站 UV？**                   | PV/UV/VV/IP 概念、HyperLogLog、去重统计               |
| ⭐ **几种典型的后端面试场景题（补充）** | 限流、幂等、缓存穿透等综合场景                        |

### 🔐 认证安全与风控

| 主题                                | 核心知识点                                   |
| ----------------------------------- | -------------------------------------------- |
| ⭐ **项目敏感词脱敏是如何实现的？** | 脱敏策略、正则匹配、性能优化、动态配置       |
| ⭐ **如何安全传输和存储密码？**     | 加盐哈希、BCrypt、HTTPS、防重放攻击          |
| **如何实现第三方授权登录？**        | OAuth 2.0 协议、授权码模式、Token 机制、JWT  |
| **验证码登录场景怎么设计？**        | 验证码生成、存储、校验、防刷、有效期管理     |
| **多次输错密码后如何限制登录？**    | 限流策略、Redis 计数器、滑动窗口、分布式限流 |

### 📊 大数据量场景

| 主题                                           | 核心知识点                                |
| ---------------------------------------------- | ----------------------------------------- |
| ⭐ **40 亿个 QQ 号，限制 1G 内存，如何去重？** | 位图、布隆过滤器、分治思想、外部排序      |
| ⭐ **日活上亿，如何保证推荐视频不重复？**      | 布隆过滤器、Redis Set、去重策略、空间优化 |
| ⭐ **大数据 Top K 问题**                       | 堆排序、快速选择、分治、MapReduce         |

### 🔄 并发控制与分布式一致性

| 主题                                   | 核心知识点                              |
| -------------------------------------- | --------------------------------------- |
| **多位骑手抢一个订单如何保证不重复？** | 分布式锁、乐观锁、Redis SETNX、并发控制 |
| **发生提现失败（退单）时怎么处理？**   | 补偿机制、幂等设计、状态回滚、对账系统  |

## 内容预览

![《后端面试高频系统设计&场景题》](https://oss.javaguide.cn/xingqiu/back-end-interview-high-frequency-system-design-and-scenario-questions-fengmian.png)

## 适合人群

- 🎓 **校招求职者**：应对大厂系统设计面试
- 👨‍💻 **社招跳槽者**：提升架构设计能力，拿到更好的 offer
- 🔧 **初中级工程师**：学习系统设计思维，提升解决实际问题的能力
- 📚 **技术爱好者**：了解常见系统的设计原理

<!-- @include: @planet2.snippet.md -->


---

---

<!-- source: 手写 RPC 框架 Netty + Kryo + Zookeeper 实战教程.md -->

## [5] 手写 RPC 框架 | Netty + Kryo + Zookeeper 实战教程

---
title: 手写 RPC 框架 | Netty + Kryo + Zookeeper 实战教程
description: 从零开始基于 Netty + Kryo + Zookeeper 手写实现一个 RPC 框架，深入理解 RPC 底层原理与核心组件，适合后端开发者提升分布式编程能力。
category: 知识星球
head:
  - - meta
    - name: keywords
      content: 手写RPC,RPC框架,RPC实战,Netty实战,Zookeeper,Kryo,RPC原理,分布式RPC,手写框架,RPC教程,Java RPC
---

## 介绍

**《手写 RPC 框架》** 是我的[知识星球](../关于作者/JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目.md)的一个内部小册，我写了 12 篇文章来讲解如何从零开始基于 Netty + Kryo + Zookeeper 实现一个简易的 RPC 框架。

麻雀虽小五脏俱全，项目代码注释详细，结构清晰，并且集成了 Check Style 规范代码结构，非常适合阅读和学习。

## 内容概览

![](https://oss.javaguide.cn/github/javaguide/image-20220308100605485.png)

通过这个简易的轮子，你可以学到 RPC 的底层原理以及各种 Java 编码实践的运用。你甚至可以把它当做你的毕设或项目经验，这是非常不错的选择！对比其他求职者的项目经验都是各种系统，造轮子肯定是更加能赢得面试官的青睐。

- GitHub 地址：[https://github.com/Snailclimb/guide-rpc-framework](https://github.com/Snailclimb/guide-rpc-framework) 。
- Gitee 地址：[https://gitee.com/SnailClimb/guide-rpc-framework](https://gitee.com/SnailClimb/guide-rpc-framework) 。

<!-- @include: @planet2.snippet.md -->

