---
title: agent AI优化汇总
---

# agent AI优化汇总

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

1. AI Agent 核心概念：Agent Loop、Plan-and-Execute、A2A、Agentic Workflows、Tools 注册 (`agent基础.md`)
2. AI Agent 记忆系统：短期记忆、长期记忆与记忆演化机制 (`agent记忆.md`)
3. Harness Engineering：六层检查框架、上下文管理与工程实践 (`harness工程.md`)
4. Loop Engineering 是什么？为什么说它是新瓶装旧酒？ (`loop工程.md`)
5. 什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？ (`mcp.md`)
6. 大模型提示词工程（Prompt Engineering）是什么？提示词技巧有哪些？ (`prompt工程.md`)
7. Agent Skills 是什么？和 Prompt、MCP 到底差在哪？ (`skills.md`)
8. AI 工作流中的 Workflow、Graph 与 Loop：从概念到实现 (`工作流图循环.md`)
9. 上下文工程(Context Engineering) 是什么？和 Prompt Engineering 有什么区别？ (`上下文工程.md`)

