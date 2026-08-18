---
title: ai AI优化汇总
---

# ai AI优化汇总

> AI 优化索引（目录原文较大）：补充体系化内容 + 重点篇 TOC（不含正文；全文见同目录 `0-ALL.md`）。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 知识地图
- 大模型调用：Token / 上下文窗口 / 采样参数 / 结构化输出 / Function Calling
- Agent：Loop、Memory、Tool、MCP、Skills、Harness、评测
- RAG：切分、Embedding、向量库、召回、重排、GraphRAG、知识更新
- 系统设计：网关、可观测、成本、安全（注入/越权）、多模型路由

### 常漏追问
1. **为什么说只调 API 不够？** 要补齐超时重试、限流降级、JSON 校验、兜底话术、Trace。
2. **RAG 答非所问先查什么？** 先查召回（切分/Query 改写/混合检索/重排），再考虑换更大模型。
3. **Agent 与 Workflow 怎么选？** 步骤固定用 Workflow；路径依赖实时证据再用 Agent。
4. **如何做评测？** Golden Set + 人工抽检 + LLM-as-Judge；上线后要回归与灰度。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

> 正文请到同目录 [0-ALL.md](./0-ALL.md) 中按 source 注释检索对应章节。

1. AI Agent 核心概念：Agent Loop、Plan-and-Execute、A2A、Agentic Workflows、Tools 注册 (`agent/agent基础.md`)
2. AI Agent 记忆系统：短期记忆、长期记忆与记忆演化机制 (`agent/agent记忆.md`)
3. Harness Engineering：六层检查框架、上下文管理与工程实践 (`agent/harness工程.md`)
4. Loop Engineering 是什么？为什么说它是新瓶装旧酒？ (`agent/loop工程.md`)
5. 什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？ (`agent/mcp.md`)
6. 大模型提示词工程（Prompt Engineering）是什么？提示词技巧有哪些？ (`agent/prompt工程.md`)
7. Agent Skills 是什么？和 Prompt、MCP 到底差在哪？ (`agent/skills.md`)
8. AI 工作流中的 Workflow、Graph 与 Loop：从概念到实现 (`agent/工作流图循环.md`)
9. 上下文工程(Context Engineering) 是什么？和 Prompt Engineering 有什么区别？ (`agent/上下文工程.md`)
10. AI 核心概念总览：LLM、Agent、RAG、MCP、Skills 与 ReAct (`ai核心概念.md`)
11. 大模型 API 调用工程实践：流式输出、重试、限流与结构化返回 (`llm基础/llm-api工程.md`)
12. AI 应用评测体系：从 Golden Set 构建到线上灰度闭环 (`llm基础/llm评测.md`)
13. LLM 运行机制：Token、上下文窗口与采样参数怎么影响输出 (`llm基础/llm运行机制.md`)
14. 大模型结构化输出：从 JSON 契约到 Function Calling 落地 (`llm基础/结构化输出与函数调用.md`)
15. GraphRAG：用图结构补充向量检索 (`rag/graphrag.md`)
16. RAG 基础概念：检索、生成与工程取舍 (`rag/rag基础.md`)
17. RAG 文档处理与切分策略：从解析、清洗、Chunking 到多模态内容处理 (`rag/rag文档处理.md`)
18. RAG 向量索引算法和向量数据库 (`rag/rag向量存储.md`)
19. RAG 优化：从召回、重排到上下文工程 (`rag/rag优化.md`)
20. RAG 知识库文档如何更新：增量更新、版本控制、去重与全量重建 (`rag/rag知识更新.md`)
21. AI Agent 面试题总结 (`面试题/agent面试题.md`)
22. 2026 大模型面试题 | Agent 面试题 | RAG 面试题 | AI 应用开发面试指南（含答案与图解） (`面试题/ai面试指南.md`)
23. AI 系统设计面试题总结 (`面试题/ai系统设计面试题.md`)
24. 大模型基础面试题总结 (`面试题/llm面试题.md`)
25. RAG 面试题总结 (`面试题/rag面试题.md`)
26. AI 应用系统设计：从 Prompt Demo 到生产级架构 (`系统设计/ai应用架构.md`)
27. AI 语音技术详解：从 ASR、TTS 到实时语音 Agent 的工程化落地 (`系统设计/ai语音.md`)
28. 大模型网关详解：多模型路由、Fallback、限流与成本控制 (`系统设计/llm网关.md`)

