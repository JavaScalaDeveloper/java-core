---
title: AI编程 AI优化汇总
---

# AI编程 AI优化汇总

> AI 优化索引（目录原文较大）：补充体系化内容 + 重点篇 TOC（不含正文；全文见同目录 `0-ALL.md`）。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 补充要点
- 原则：上下文管理、可复现、小步提交、测试护栏。
- 实践：命令/规则/记忆如何组织；CLI 与 IDE 分工。
- 案例：把“能跑”提升到“可维护、可评审、可回滚”。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

> 正文请到同目录 [0-ALL.md](./0-ALL.md) 中按 source 注释检索对应章节。

1. Claude Code 接入第三方模型实战：JVM 智能诊断与慢查询治理 (`案例/Claude Code 接入第三方模型实战-JVM 智能诊断与慢查询治理.md`)
2. DeepSeek V4 + Claude Code 实战：代码能力深度测评 (`案例/DeepSeek V4 + Claude Code 实战-代码能力深度测评.md`)
3. IDEA + Qoder 插件多场景实战：接口优化与代码重构 (`案例/IDEA + Qoder 插件多场景实战-接口优化与代码重构.md`)
4. Kimi K3 实战：全栈项目、Java 项目改造与 3A 游戏 Demo (`案例/Kimi K3 实战-全栈项目、Java 项目改造与 3A 游戏 Demo.md`)
5. MiniMax M3 + Claude Code 实战：Redis 故障排查、SCAN 算法复刻与监控面板搭建 (`案例/MiniMax M3 + Claude Code 实战-Redis 故障排查、SCAN 算法复刻与监控面板搭建.md`)
6. Trae + MiniMax 多场景实战：Redis 故障排查与跨语言重构 (`案例/Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构.md`)
7. 10 道 AI 编程相关的开放性面试问题 (`实践/10 道 AI 编程相关的开放性面试问题.md`)
8. AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计 (`实践/AI 编程 Skills 选型清单-需求澄清、TDD、代码审查与 UI 设计.md`)
9. AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流 (`实践/AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流.md`)
10. Claude Code Agent View：多会话并行管理实战 (`实践/Claude Code Agent View-多会话并行管理实战.md`)
11. Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify (`实践/Claude Code 核心命令详解-code-review、loop、goal、batch、run、verify.md`)
12. Claude Code 使用指南：配置、工作流与进阶技巧 (`实践/Claude Code 使用指南-配置、工作流与进阶技巧.md`)
13. CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆 (`实践/CLAUDE.md 最佳实践-该写什么、不该写什么、项目变大后怎么拆.md`)
14. Codex 使用指南：配置、AGENTS.md 与 Agentic 工作流 (`实践/Codex 使用指南-配置、AGENTS.md 与 Agentic 工作流.md`)
15. JavaGuide 专属 draw.io 绘图 Skill 开源：用 Agent 自动生成可编辑的 draw.io 技术图 (`实践/JavaGuide 专属 draw.io 绘图 Skill 开源-用 Agent 自动生成可编辑的 draw.io 技术图.md`)
16. mattpocock/skills：我最推荐的 4 个 AI 编程 Skill (`实践/mattpocockskills-我最推荐的 4 个 AI 编程 Skill.md`)
17. oh-my-pi 开源终端 AI 编码代理体验 (`实践/oh-my-pi 开源终端 AI 编码代理体验.md`)
18. Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范 (`实践/Spec Coding 规范驱动编程实战-从 Vibe Coding 到 AI 代码规范.md`)
19. Vibe Coding 实用技巧总结：Git、Spec、上下文管理与多 Agent 协作 (`实践/Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作.md`)
20. 比 iTerm2 更适合 Claude Code/Codex 的终端，我换成 Ghostty 了 (`实践/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了.md`)
21. 强模型时代，AI 编程 Skills 还有必要装吗？ (`实践/强模型时代，AI 编程 Skills 还有必要装吗？.md`)
22. 在 IDEA 中使用 Claude Code 和 Codex：CC GUI 上手指南 (`项目/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南.md`)
23. Claude Code Hooks 详解：生命周期钩子与自动化工作流 (`原则/Claude Code Hooks 详解-生命周期钩子与自动化工作流.md`)
24. Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams (`原则/Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams.md`)
25. Claude Code Skills 技术实现细节与运行方式 (`原则/Claude Code Skills 技术实现细节与运行方式.md`)
26. Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选 (`原则/Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选.md`)
27. Claude Code 上下文管理详解：窗口预算、压缩与长任务治理 (`原则/Claude Code 上下文管理详解-窗口预算、压缩与长任务治理.md`)

