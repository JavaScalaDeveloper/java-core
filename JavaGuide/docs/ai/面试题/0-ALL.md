---
title: 面试题 ALL
---

# 面试题

> Aggregate of markdown under this directory (excludes README.md, TODO.md).


---

<!-- source: agent面试题.md -->

---
title: AI Agent 面试题总结
description: 系统整理 AI Agent 高频面试题，覆盖 Agent 核心概念、Agent Loop、Memory、Prompt Engineering、Context Engineering、MCP、Agent Skills、Harness Engineering、Workflow、Graph、Loop 等核心考点，并附对应参考文章。
category: AI
tag:
  - Agent面试
  - AI Agent
  - AI面试
head:
  - - meta
    - name: keywords
      content: AI Agent面试题,Agent面试题,AI Agent面试,Agent Loop面试,Agent Memory面试题,MCP面试题,Prompt工程面试题,Context Engineering面试,Harness Engineering面试,Agent Skills面试题
---

Agent 接到任务后，需要读取上下文、决定下一步动作、调用工具、观察结果，再判断继续、结束还是交给人工。AI Agent 面试题基本沿着这条执行链路展开，Memory、MCP、Skills、Harness 和 Workflow 都可以放回链路中理解。

题目按 JavaGuide AI Agent 专题的章节分组。每组都附有详细文章，这里只整理考点和问题，不重复展开答案。

## Agent 基础

相关内容：[《AI Agent 核心概念：Agent Loop、Plan-and-Execute、A2A、Agentic Workflows、Tools 注册》](../agent/agent基础.md)

这部分通常从 Agent 的定义开始，随后追问运行循环和编排方式。准备时要能分清 Chatbot、Workflow 与 Agent 在任务路径、状态和工具使用上的差别。

常见面试题：

- AI Agent 是什么？和普通 Chatbot 有什么区别？
- Agent = LLM + Planning + Memory + Tools 这条公式怎么理解？
- Agent Loop 的完整流程是什么？
- Agent 和传统编程、Workflow 的核心区别是什么？
- ReAct、Plan-and-Execute、Reflection、Multi-Agent 分别适合什么场景？
- Tools 注册时，工具 description 为什么很关键？
- 什么时候用纯 Agent，什么时候用 Workflow 或 Agentic Workflow？
- Multi-Agent 协作的主要问题是什么？为什么生产里不能盲目上多 Agent？

![AI Agent 核心架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-core-arch.png)

![Agent Loop 工作流程](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-loop-flow.png)

## Agent Memory

相关内容：[《AI Agent 记忆系统：短期记忆、长期记忆与记忆演化机制》](../agent/agent记忆.md)

Memory 题会追到信息从哪里来、保存多久、什么时候读取，以及出现过期或冲突后怎么处理。聊天记录、当前任务状态和跨会话记忆需要分别讨论。

常见面试题：

- Agent 的短期记忆和长期记忆有什么区别？
- Agent 记忆系统要解决哪些核心问题？
- 向量记忆和 Markdown 记忆分别适合什么场景？
- Auto Memory 是什么？它为什么不能无限自动写入？
- 哪些团队共享记忆适合走 Git 和 Code Review，哪些更适合数据库？
- 记忆压缩、记忆过期、记忆冲突应该怎么处理？
- 如何避免长期记忆污染上下文？
- 面试里怎么讲“有记忆”不是简单保存聊天记录？

![Agent 记忆分类全景图](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-memory-taxonomy.svg)

## Prompt 与 Context Engineering

相关内容：[《大模型提示词工程（Prompt Engineering）是什么？提示词技巧有哪些？》](../agent/prompt工程.md)、[《上下文工程(Context Engineering) 是什么？和 Prompt Engineering 有什么区别？》](../agent/上下文工程.md)

Prompt 题关注指令如何表达，Context 题还会涉及历史状态、工具结果、检索证据和任务计划的装载。长任务中的裁剪、压缩和隔离也是常见追问。

常见面试题：

- Prompt Engineering 和 Context Engineering 有什么区别？
- Prompt 四要素 Role、Task、Context、Format 分别解决什么问题？
- Few-Shot、CoT、任务分解、结构化输出分别适合什么场景？
- Prompt 注入攻击是什么？常见防护方式有哪些？
- 为什么 Agent 场景下只优化 Prompt 不够？
- Context Engineering 要解决哪些问题？
- 静态规则、动态信息、工具结果、记忆应该如何进入上下文？
- 长任务上下文溢出时，Compaction、结构化笔记、Sub-agent 分别怎么用？

![Prompt engineering vs. context engineering](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/context-engineering-vs-prompt-engineering.png)

## MCP 与 Agent Skills

相关内容：[《什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？》](../agent/什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？.md)、[《Agent Skills 是什么？和 Prompt、MCP 到底差在哪？》](../agent/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？.md)

Function Calling、MCP 和 Skills 位于不同环节：模型需要表达调用意图，宿主需要接入工具，Agent 还要加载完成任务所需的流程与资料。这组题经常继续追问权限、参数校验、超时和审计。

常见面试题：

- MCP 解决什么问题？为什么常被类比成 AI 领域的 USB-C？
- MCP Client、MCP Server、Host 分别是什么？
- MCP 的 Tools、Resources、Prompts 分别解决什么问题？
- MCP 和 Function Calling 有什么区别？
- 生产级 MCP Server 要做哪些安全治理？
- Agent Skills 是什么？它和 Prompt、MCP、Function Calling 的边界是什么？
- Skills 为什么要延迟加载？
- Skill 路由怎么做？为什么它和 RAG 相似但目标不同？
- 写一个 `SKILL.md` 最容易踩哪些坑？

## Harness Engineering

相关内容：[《Harness Engineering：六层检查框架、上下文管理与工程实践》](../agent/harness工程.md)

Harness Engineering 把注意力放到模型外部的执行环境，包括任务管理、上下文供给、工具反馈、验证和错误恢复。相关问题通常要求把这些抽象概念落到具体组件。

常见面试题：

- Harness Engineering 是什么？它和 Prompt Engineering、Context Engineering 有什么关系？
- 为什么说 Agent = Model + Harness？
- JavaGuide AI Agent 专题归纳的 Harness 六层检查框架分别解决什么问题？
- 模型能力升级后，Harness 里的某些机制为什么需要重新验证？
- 上下文污染、代码熵积累、工具调用可靠性分别怎么治理？
- Agent 工程里为什么需要评测器、验证器和任务状态管理？
- 一线团队做 Agent 工程化时，共同遇到的难点是什么？

![Harness 和 Prompt/Context Engineering 的关系](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-engineering-layers-arch.png)

## Workflow、Graph 与 Loop

相关内容：[《AI 工作流中的 Workflow、Graph 与 Loop：从概念到实现》](../agent/工作流图循环.md)

工作流题主要检查流程结构、状态保存和循环控制。除了解释 Node、Edge、State，还要准备中断恢复、并行更新和停止条件等工程问题。

常见面试题：

- 为什么 AI 系统需要工作流？
- Workflow、Graph、Loop 三者是什么关系？
- Graph Loop 和 Agent Loop 有什么区别？
- Loop 如何防止死循环？
- State 的更新策略怎么选？Replace、Append、Reducer 分别适合什么字段？
- 条件边和动态路由有什么区别？
- 工具调用失败时，哪些错误适合重试？认证失败和非幂等写操作怎么处理？
- 工作流中断后怎么恢复？
- 工作流有哪些特有的安全风险？

## 综合设计题

综合题会把前面的组件放进同一个任务里，重点检查选型和故障处理：

- 如果让 Agent 完成一次需要调用多个工具的长任务，你会如何拆分执行步骤？
- 哪些节点适合交给模型判断，哪些节点应该由规则或代码控制？
- Agent 的计划、工具结果和中间状态如何保存？中断后怎样恢复？
- 工具包含写操作时，权限、参数校验、二次确认和审计怎么设计？
- 什么情况下需要 Multi-Agent？如何控制通信成本和状态一致性？
- 你会记录哪些 Trace，并用哪些指标评估任务完成率、工具调用和执行轨迹？


---

<!-- source: ai面试指南.md -->

---
title: 2026 大模型面试题 | Agent 面试题 | RAG 面试题 | AI 应用开发面试指南（含答案与图解）
description: 2026 AI 应用开发面试指南，系统整理大模型面试题、AI Agent 面试题、RAG 面试题、AI 系统设计面试题、MCP 面试题、Prompt 工程面试题等高频考点，包含答案思路、图解和参考文章。
category: AI
tag:
  - AI面试
  - 大模型面试
  - Agent面试
  - RAG面试
head:
  - - meta
    - name: keywords
      content: 2026大模型面试题,大模型面试题,Agent面试题,RAG面试题,AI应用开发面试指南,AI面试题,AI面试,AI应用开发面试,大模型面试,LLM面试题,Agent面试,RAG面试,AI系统设计面试题,MCP面试题,Prompt工程面试题,向量数据库面试题
  - - meta
    - property: og:title
      content: 2026 大模型、Agent、RAG 与 AI 系统设计面试指南
  - - meta
    - property: og:description
      content: 按大模型基础、AI Agent、RAG 和 AI 系统设计整理常见面试问题，并链接到对应专题文章。
---

<!-- @include: @article-header.snippet.md -->

AI 应用开发面试通常从一次模型调用问起，再延伸到 RAG、Agent、工具调用和系统设计。除了概念，面试中还会检查你能否解释完整链路，定位效果问题，并处理成本、稳定性和权限风险。

这篇文章是 AI 面试题的总入口。四篇题目页负责集中列出问题，详细原理、代码、图解和工程方案放在对应专题文章中。

## 面试题目录

| 面试题模块                                                         | 主要内容                                                                                                                   | 适合重点复习的人群                       |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [大模型基础面试题总结](./llm面试题.md)               | Token、上下文窗口、采样参数、API 调用、流式输出、结构化输出、Function Calling、AI 应用评测                                 | 所有准备 AI 应用开发面试的人             |
| [AI Agent 面试题总结](./agent面试题.md)              | Agent Loop、Memory、Prompt Engineering、Context Engineering、MCP、Agent Skills、Harness Engineering、Workflow、Graph、Loop | 准备 Agent、工具调用和工作流相关岗位的人 |
| [RAG 面试题总结](./rag面试题.md)                     | RAG 基础、Embedding、向量数据库、文档处理、Hybrid Search、Query Rewrite、Rerank、GraphRAG、知识库更新与评测                | 准备知识库问答和搜索增强生成相关岗位的人 |
| [AI 系统设计面试题总结](./ai系统设计面试题.md) | 生产级架构、模型网关、调用治理、可观测、评测、安全合规、实时语音 Agent                                                     | 有项目经验或需要准备系统设计面试的人     |

## 四个模块怎么串起来

大模型基础决定一次调用如何运行。Token 和上下文窗口影响容量与成本，采样参数影响输出波动，Streaming、重试、限流和结构化输出决定后端能否稳定接住模型结果。这部分可以先看 [大模型基础面试题总结](./llm面试题.md)。

RAG 和 Agent 处理的是两类不同问题。RAG 从外部知识源中检索证据，Agent 根据任务状态决定下一步动作并调用工具。企业知识库、智能客服和数据分析助手通常会同时使用二者，对应题目在 [RAG 面试题总结](./rag面试题.md) 和 [AI Agent 面试题总结](./agent面试题.md) 中。

模型调用、检索和工具进入真实业务后，还要补上模型网关、权限、审计、评测、灰度和回滚。这些内容会在 [AI 系统设计面试题总结](./ai系统设计面试题.md) 中集中出现。

## 按经验选择复习深度

| 经验阶段        | 复习重点                                         | 回答需要达到的程度                                           |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| 应届生、0～1 年 | 大模型基础、RAG 链路、Agent Loop、简单的应用架构 | 能解释主要概念，并说清一次模型调用或知识库问答的完整流程     |
| 2～3 年         | API 调用工程、RAG 排查、工具治理、状态与可观测   | 能根据失败现象定位环节，说明方案选择和异常处理               |
| 3 年以上        | 模型网关、成本、安全、评测、灰度、回滚和架构演进 | 能设计完整系统，说明容量、权限、故障恢复、质量验证和后续演进 |

工作年限只影响追问深度。简历里写了企业知识库、Agent 平台或 AI 客服，面试官通常会沿着项目继续问数据来源、权限、效果指标、异常处理和上线后的维护方式。

## 面试题页和专题文章怎么配合

可以先快速过一遍题目页，把暂时讲不清的问题标出来，再进入对应专题文章查看完整上下文。例如：

- Token、上下文窗口和采样参数可以回到 [大模型基础专题](../llm基础/)；
- Agent Loop、Memory、MCP 和 Skills 可以回到 [AI Agent 专题](../agent/)；
- Chunk、向量检索、Rerank 和知识库更新可以回到 [RAG 专题](../rag/)；
- 模型网关、实时语音和生产架构可以回到 [AI 系统设计专题](../系统设计/)。

看完原文后，再回到题目复述一遍。答案需要包含具体机制、适用场景和限制，涉及项目时还要补上当时的业务约束、数据规模和故障处理方式。

## 项目经历常见追问

- 项目为什么选择当前模型？更换模型需要比较哪些指标？
- RAG 出现召回不到、排序错误或答案不忠实时，分别怎么排查？
- Agent 调错工具、参数不合法或写操作超时时，系统如何处理？
- 如何证明一次 Prompt、模型或检索配置调整带来了改善？
- 模型供应商限流或不可用时，如何排队、降级和切换？
- 知识库和工具调用如何做租户隔离、权限校验与审计？
- 项目上线后记录了哪些质量、成本、延迟和错误指标？

这些问题都能在四篇题目页中找到对应模块。准备项目经历时，优先使用自己项目里的真实约束和处理过程，专题文章中的方案用于补充原理与备选做法。


---

<!-- source: ai系统设计面试题.md -->

---
title: AI 系统设计面试题总结
description: 系统整理 AI 应用系统设计高频面试题，覆盖生产级 AI 应用架构、模型网关、Prompt 管理、RAG、Memory、Tool Calling、可观测、评测、安全合规、实时语音 Agent 等核心考点，并附对应参考文章。
category: AI
tag:
  - AI系统设计
  - AI面试
  - 大模型应用
head:
  - - meta
    - name: keywords
      content: AI系统设计面试题,AI应用架构面试题,大模型应用系统设计,LLM网关面试题,AI可观测面试题,AI评测面试题,语音Agent面试题,AI安全面试题
---

AI 系统设计题通常从一个具体场景开始，例如企业知识库、智能客服、Agent 平台或实时语音助手。随着问题展开，面试官会继续追问模型调用、上下文、检索、工具、安全、成本和评测如何放进同一条生产链路。

题目按 JavaGuide AI 系统设计专题的内容分组。每组都附有详细文章，这里只整理常见问题，具体方案和实现细节放在对应原文中。

## 生产级 AI 应用架构

相关内容：[《AI 应用系统设计：从 Prompt Demo 到生产级架构》](../系统设计/ai应用架构.md)

架构题会从一次请求的完整链路问起，随后检查各个模块的职责，以及同步、流式和异步任务应该如何选择。Prompt、RAG、Memory 和 Tool 也需要放在各自负责的环节中讨论。

常见面试题：

- Prompt Demo 到生产系统之间有哪些工程差距？
- 如何设计一个生产级 AI 应用的整体架构？
- 一次 AI 请求从接入到返回结果，会经过哪些模块？
- 入口层、编排层、Prompt/Context、RAG/Memory/Tool、模型网关和评测观测分别负责什么？
- 同步返回、流式返回和异步任务分别适合什么场景？
- Prompt 为什么要做版本管理？模板、变量和模型版本应该如何关联？
- RAG、Memory 和 Tool 分别管理什么信息？为什么要分开治理？
- 长任务的中间状态如何保存？服务重启后怎么恢复？
- 为了支持问题回放，一次请求至少要记录哪些数据？

## 模型网关与调用治理

相关内容：[《大模型网关详解：统一接入、模型路由、限流配额与成本治理》](../系统设计/llm网关.md)、[《大模型 API 调用工程实践：流式输出、重试、限流与结构化返回》](../llm基础/llm-api工程.md)

模型网关题主要检查多供应商接入、模型路由和故障处理。限流除了请求数，还会涉及 Token、并发、租户预算和上游配额。

常见面试题：

- 为什么生产环境需要 LLM Gateway？业务服务直接调用模型 API 有哪些问题？
- LLM Gateway 和 LLM Router 有什么区别？
- 模型网关通常要承担哪些能力？
- 多个模型供应商的请求参数、响应格式和错误码如何统一？
- 模型路由可以参考哪些信息？如何避免把请求分配给不合适的模型？
- 大模型限流为什么要同时看 RPM、TPM、并发数和租户预算？
- 哪些模型调用错误适合重试？哪些错误应该直接失败？
- 如何设计模型 fallback？哪些任务不能自动降级？
- Token 成本如何归因到租户、用户、功能、模型和 Prompt 版本？
- 模型网关会增加多少延迟？哪些处理适合放在网关中？
- 语义缓存适合哪些请求？如何处理数据时效和权限隔离？
- 如果让你设计一个生产级 LLM Gateway，你会如何拆分模块？

## 安全、权限与审计

相关内容：[《AI 应用系统设计：从 Prompt Demo 到生产级架构》](../系统设计/ai应用架构.md)、[《大模型结构化输出：从 JSON 契约到 Function Calling 落地》](../llm基础/结构化输出与函数调用.md)

模型可以生成工具调用意图和参数，真正的业务操作仍由后端执行。这组题会继续追问身份、资源、参数、操作风险和审计记录应该在哪里校验。

常见面试题：

- Tool Calling 的安全边界在哪里？
- 为什么工具 description 和 Prompt 不能替代后端权限校验？
- 高风险工具调用为什么需要二次确认？
- 写操作如何处理幂等、超时和结果不确定的问题？
- Prompt 注入攻击在系统设计层面怎么防？
- RAG 检索如何避免召回当前用户无权查看的内容？
- PII 脱敏应该放在输入、日志、模型调用还是输出环节？
- 工具调用审计日志应该记录哪些字段？
- 模型生成的结构化参数通过 Schema 校验后，为什么还不能直接执行？

## 可观测、评测与发布

相关内容：[《AI 应用评测体系：从 Golden Set 构建到线上灰度闭环》](../llm基础/llm评测.md)、[《AI 应用系统设计：从 Prompt Demo 到生产级架构》](../系统设计/ai应用架构.md)

AI 应用的发布检查除了接口是否成功，还要覆盖答案质量、检索结果、工具轨迹和结构化输出。模型、Prompt、检索配置和代码发生变化时，都需要能够比较和回滚。

常见面试题：

- AI 应用的可观测指标应该包括哪些内容？
- 为什么没有评测集就很难判断一次改动是否有效？
- Golden Set 如何覆盖正常路径、边缘场景、对抗样本和高风险失败？
- 离线评测、Trace 回放和线上灰度分别解决什么问题？
- RAG、Agent 和结构化输出为什么不能共用一套评测指标？
- LLM-as-Judge 有哪些偏差？如何用人工抽样和规则校验进行校准？
- CI 中的 AI 评测如何控制成本和运行时间？
- 评测记录为什么要绑定模型、Prompt、检索配置和代码版本？
- 线上质量下降时，如何区分模型、Prompt、检索、工具和数据分布问题？
- AI 应用如何设计灰度、回滚和失败样本回流？

## 实时语音 Agent

相关内容：[《AI 语音技术详解：从 ASR、TTS 到实时语音 Agent 的工程化落地》](../系统设计/ai语音.md)

实时语音系统把音频采集、VAD、ASR、LLM、工具调用、TTS 和播放串在一起。相关问题主要集中在端到端延迟、打断处理、状态管理和端云选型。

常见面试题：

- 如何设计一个实时语音 Agent？
- ASR、LLM、TTS 和 VAD 在语音系统中分别负责什么？
- 实时语音 Agent 的端到端延迟主要来自哪些环节？
- 用户打断时，系统如何取消播放、停止生成并更新上下文？
- `listening`、`thinking`、`speaking`、`interrupted` 等状态如何管理？
- 级联式 ASR + LLM + TTS 和原生 Speech-to-Speech 模型各有什么优缺点？
- 云端 API、本地模型和端云混合方案怎么选？
- 浏览器端音频前处理会影响哪些指标？
- 语音 Agent 的可观测数据应该包括哪些内容？

## 综合设计题

- 如何设计一个带权限控制、引用溯源和知识库更新能力的企业 RAG 系统？
- 如何设计一个支持长任务、工具调用、中断恢复和人工接管的 Agent 平台？
- 智能客服流量突然增加，同时模型供应商开始限流，系统应该如何排队、降级和保护核心请求？
- 模型或 Prompt 升级后，结构化输出成功率和答案质量下降，如何定位并回滚？
- Agent 可以查询订单并发起退款时，权限、参数校验、二次确认、幂等和审计怎么设计？
- 如何设计一个支持实时打断、低延迟和故障降级的语音客服系统？


---

<!-- source: llm面试题.md -->

---
title: 大模型基础面试题总结
description: 系统整理大模型/LLM 高频面试题，覆盖 Token、上下文窗口、采样参数、API 调用、流式输出、结构化输出、Function Calling、MCP、AI 应用评测等核心考点，并附对应参考文章。
category: AI
tag:
  - 大模型面试
  - LLM面试
  - AI面试
head:
  - - meta
    - name: keywords
      content: 大模型面试题,LLM面试题,大模型面试,LLM面试,Token面试题,上下文窗口面试题,Function Calling面试题,结构化输出面试题,AI应用评测面试题
---

一次大模型调用从 Token 化开始，经过上下文组装和采样生成，再由后端处理流式返回、限流、重试、结构化解析和日志。基础面试题会沿着这条调用链路追问成本、延迟、稳定性和安全问题。

题目按 JavaGuide 大模型基础专题的章节分组，详细原理和工程示例放在对应文章中。这里保留考点和问题，方便集中复习。

## LLM 运行机制

相关内容：[《LLM 运行机制：Token、上下文窗口与采样参数怎么影响输出》](../llm基础/llm运行机制.md)

Token、上下文窗口和采样参数共同影响一次调用能放入多少信息、花费多少资源，以及输出会有多大波动。这组题经常结合长对话、RAG 证据和结构化输出继续追问。

常见面试题：

- Token 是什么？为什么中文、英文、代码消耗的 Token 不一样？
- 上下文窗口是什么？上下文窗口越大，效果一定越好吗？
- 什么是 Lost in the Middle 问题？长上下文场景下怎么缓解？
- Temperature、Top-P、Top-K 分别控制什么？生产环境怎么设置更稳？
- 为什么 Temperature 设置为 0，模型输出仍然可能不完全一致？
- 大模型为什么会产生幻觉？常见缓解方案有哪些？
- Token 预算怎么估算？输入、输出、历史消息、RAG 证据如何取舍？
- 长上下文窗口会不会取代 RAG？二者分别适合什么场景？

![Token 化过程示例](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-token-process.png)

## API 调用工程

相关内容：[《大模型 API 调用工程实践：流式输出、重试、限流与结构化返回》](../llm基础/llm-api工程.md)

模型 API 的响应时间、计费方式和错误类型都与普通业务接口有所不同。面试中通常会把 Streaming、重试、幂等、限流和模型网关放在一条调用链里考察。

常见面试题：

- 大模型 API 调用的完整链路是什么？
- Streaming 为什么能改善用户体验？它能减少总耗时和 Token 成本吗？
- SSE、WebSocket、HTTP Chunked 在流式输出场景下怎么选？
- 哪些大模型 API 错误可以重试？哪些错误不能重试？
- 为什么大模型调用必须做幂等？
- 大模型限流为什么不能只按 QPS 做？
- 模型网关通常要承担哪些能力？
- AI 应用的调用日志里至少要记录哪些字段？

## 结构化输出与工具调用

相关内容：[《大模型结构化输出：从 JSON 契约到 Function Calling 落地》](../llm基础/结构化输出与函数调用.md)

模型输出只要进入业务系统，就要处理格式校验、字段约束和执行权限。这里容易混淆 JSON Mode、Structured Outputs、Function Calling、MCP Tool 与普通 HTTP API。

常见面试题：

- 为什么只写“请返回 JSON”不可靠？
- JSON Mode 和 Structured Outputs 有什么区别？
- JSON Schema 在大模型应用里解决什么问题？
- Function Calling 的完整链路是什么？
- Function Calling 和 MCP 有什么区别？
- MCP Tool 和普通 HTTP API 有什么关系？
- Agent Skill 和 Function Calling 是一回事吗？
- 结构化输出失败后怎么处理？
- 工具调用为什么必须做安全治理？
- 面试里怎么一句话概括结构化输出？

## AI 应用评测

相关内容：[《AI 应用评测体系：从 Golden Set 构建到线上灰度闭环》](../llm基础/llm评测.md)

评测题关注如何证明一次模型、Prompt 或系统改动确实带来了改善。Golden Set、LLM-as-Judge、Trace 回放和线上灰度分别覆盖不同阶段，不能只看公开榜单或少量演示样例。

常见面试题：

- 为什么不能只靠公开 benchmark 评估 AI 应用质量？
- Golden Set 应该怎么构建？冷启动阶段没有生产日志怎么办？
- LLM-as-Judge 有哪些主要偏差？怎么缓解？
- RAG 评测为什么必须分检索和生成两段？
- Agent 评测为什么比普通问答和 RAG 更复杂？
- 离线评测、Trace 回放、线上灰度分别解决什么问题？
- CI 里的 AI 评测如何平衡速度和覆盖度？
- 如果 LLM-as-Judge 和人工评测结果不一致，应该怎么处理？

## 综合场景题

- 客服机器人历史会话持续增长时，如何分配 Token 预算并保留关键业务状态？
- 流式响应中途断开后，服务端如何处理重试、续传和重复计费问题？
- 上游模型触发 RPM 或 TPM 限制时，模型网关如何排队、降级或切换模型？
- 模型生成退款工具的调用参数后，业务系统还需要执行哪些校验？
- 更换模型或修改 Prompt 后，如何用离线评测、Trace 回放和线上灰度验证效果？


---

<!-- source: rag面试题.md -->

---
title: RAG 面试题总结
description: 系统整理 RAG 高频面试题，覆盖 RAG 基础、Embedding、向量数据库、Chunk 策略、文档处理、Hybrid Search、Query Rewrite、Rerank、GraphRAG、知识库更新与 RAG 评测等核心考点，并附对应参考文章。
category: AI
tag:
  - RAG面试
  - 向量数据库
  - AI面试
head:
  - - meta
    - name: keywords
      content: RAG面试题,RAG面试,检索增强生成面试题,Embedding面试题,向量数据库面试题,GraphRAG面试题,RAG优化面试题,Chunk面试题,Hybrid Search面试题,Rerank面试题
---

一条 RAG 链路要处理文档解析、Chunk、Embedding、索引、召回、重排、上下文组装和生成。系统运行一段时间后，还会遇到文档版本、权限变化、索引重建和效果评测等问题。题目按 JavaGuide RAG 专题的章节分组，每组都附有详细文章。

## RAG 基础

相关内容：[《RAG 基础概念：检索、生成与工程取舍》](../rag/rag基础.md)

基础题围绕 RAG 的工作流程和适用场景展开，也会与传统搜索、微调和长上下文做比较。幻觉、引用和拒答通常会作为后续追问。

常见面试题：

- 什么是 RAG？为什么需要 RAG？
- RAG 和传统搜索引擎有什么区别？
- RAG 和微调怎么选？什么时候用 RAG，什么时候微调，什么时候两者结合？
- RAG 系统中 Embedding 模型怎么选？为什么？
- 余弦相似度、内积和欧氏距离有什么区别？
- RAG 的幻觉问题怎么解决？RAG 一定不会产生幻觉吗？
- 什么是 Lost in the Middle 问题？怎么应对？
- 长上下文窗口是否会取代 RAG？
- RAG 系统的评估指标有哪些？
- RAG 的优势和局限性是什么？
- 什么场景适合用 RAG？什么场景不适合？

## 向量数据库与索引

相关内容：[《RAG 向量索引算法和向量数据库》](../rag/rag向量存储.md)

向量检索题会从 Embedding 和距离度量问到 ANN 索引，再落到数据规模、查询延迟、过滤条件和运维成本。只记产品名称很难应对后续的选型追问。

常见面试题：

- 什么是 Embedding？为什么需要把文本转成向量？
- RAG 场景为什么需要向量数据库？
- ANN 算法为什么可以接受不是 100% 精确的结果？
- 有哪些向量索引算法？各自优缺点是什么？
- Flat、HNSW、IVFFLAT、IVF-PQ 分别适合什么场景？
- HNSW 和 IVFFLAT 有什么区别？
- HNSW 的 `ef_search` 参数怎么调？调大和调小分别会怎样？
- 向量数据库和传统数据库最核心的区别是什么？
- 如果向量数据从 100 万增长到 1 亿，架构上需要做什么调整？
- 为什么选择 PostgreSQL + pgvector？什么时候应该换专业向量数据库？

## 文档处理与 Chunk 策略

相关内容：[《RAG 文档处理与切分策略：从解析、清洗、Chunking 到多模态内容处理》](../rag/rag文档处理.md)

文档进入索引前要经过解析、清洗、结构化、切分和元数据补全。Chunk 的大小只是其中一个参数，标题层级、表格、代码、页码、版本和权限同样会影响后面的召回。

常见面试题：

- RAG 文档处理管线通常包含哪些步骤？
- 文档解析、清洗、结构化分别解决什么问题？
- Chunk 切分为什么不能只按固定长度切？
- Chunk 大小、Overlap、语义边界应该怎么取舍？
- 表格、代码块、图片、多模态内容进入 RAG 前怎么处理？
- 文档处理阶段如何保留标题层级、页码、来源和权限元数据？
- Chunk 质量差会带来哪些召回和生成问题？
- 如何从零搭建一套企业级文档处理管线？

## RAG 检索优化

相关内容：[《RAG 优化：从召回、重排到上下文工程》](../rag/rag优化.md)

检索优化题要先区分召回、排序、上下文和生成问题。Hybrid Search、Query Rewrite、Rerank 和上下文压缩处理的故障位置不同，不能用同一个手段解决所有失败样本。

常见面试题：

- RAG 召回率低应该怎么排查？
- Chunk 策略、Metadata、Hybrid Search、Query Rewrite、Rerank 分别解决什么问题？
- Hybrid Search 是什么？BM25 和向量检索怎么融合？
- Query Rewrite、HyDE、Self-Query 分别适合什么场景？
- Rerank 解决什么问题？为什么不能只依赖向量相似度排序？
- 上下文压缩有什么价值？什么时候会伤害答案质量？
- RAG 优化为什么必须先建立失败样本集？
- 线上 RAG 出现“答非所问”，应该按什么路径定位？

## GraphRAG

相关内容：[《GraphRAG：用图结构补充向量检索》](../rag/GraphRAG-用图结构补充向量检索.md)

GraphRAG 题集中在实体关系、多跳推理和全局问题，也会追问实体关系如何抽取、社区摘要如何生成、权限如何过滤，以及后续更新需要多少成本。选型时还要对照业务问题和现有检索链路。

常见面试题：

- GraphRAG 解决什么问题？和标准向量 RAG 有什么区别？
- 为什么说 Chunk 是信息孤岛？
- 向量相似度为什么不擅长多跳推理？
- GraphRAG 中实体、关系、社区发现分别是什么？
- 全局检索和局部检索有什么区别？
- GraphRAG 的社区摘要有什么价值？它的成本在哪里？
- GraphRAG 如何做权限过滤？
- 什么场景适合 GraphRAG？什么场景不适合？
- 成熟系统为什么会组合关键词检索、向量检索、多向量检索和图检索？

## 知识库更新与评测

相关内容：[《RAG 知识库文档如何更新：增量更新、版本控制、去重与全量重建》](../rag/rag知识更新.md)、[《AI 应用评测体系：从 Golden Set 构建到线上灰度闭环》](../llm基础/llm评测.md)

知识库上线后，文档、权限、Embedding 模型和 Chunk 策略都会变化。更新题关注数据与索引如何保持一致，评测题则要求把检索质量和生成质量分开观察。

常见面试题：

- RAG 知识库为什么不能只新增不删除？
- 增量更新和全量重建怎么选？
- Embedding 模型升级后，为什么通常需要重建索引？
- Chunk 策略变更会影响哪些历史数据？
- 如何避免同一文档多个版本同时被召回？
- 知识库更新如何做灰度、回滚和审计？
- RAG 评测为什么要分检索质量和生成质量？
- MRR、NDCG、Recall@K、Context Precision、Faithfulness 分别衡量什么？

## 综合排查题

- 原始文档已经入库，但相关问题始终召回不到正确 Chunk，你会从哪些环节开始检查？
- 正确文档进入了候选池，却总是排在 TopK 之外，应该调整召回还是引入 Rerank？
- 检索结果正确，模型仍然引用了错误片段，如何检查上下文顺序、截断和指令约束？
- 同一份文档的新旧版本被同时召回，数据和索引更新链路可能出了什么问题？
- 只有最终答案好坏的评分时，如何判断问题出在检索还是生成？
- 某类问题需要跨多篇文档查关系，如何判断应该优化向量 RAG，还是引入 GraphRAG？

