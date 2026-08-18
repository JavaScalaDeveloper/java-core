---
title: 实践 AI优化汇总
---

# 实践 AI优化汇总

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

1. 10 道 AI 编程相关的开放性面试问题 (`10 道 AI 编程相关的开放性面试问题.md`)
2. AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计 (`AI 编程 Skills 选型清单-需求澄清、TDD、代码审查与 UI 设计.md`)
3. AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流 (`AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流.md`)
4. Claude Code Agent View：多会话并行管理实战 (`Claude Code Agent View-多会话并行管理实战.md`)
5. Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify (`Claude Code 核心命令详解-code-review、loop、goal、batch、run、verify.md`)
6. Claude Code 使用指南：配置、工作流与进阶技巧 (`Claude Code 使用指南-配置、工作流与进阶技巧.md`)
7. CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆 (`CLAUDE.md 最佳实践-该写什么、不该写什么、项目变大后怎么拆.md`)
8. Codex 使用指南：配置、AGENTS.md 与 Agentic 工作流 (`Codex 使用指南-配置、AGENTS.md 与 Agentic 工作流.md`)
9. JavaGuide 专属 draw.io 绘图 Skill 开源：用 Agent 自动生成可编辑的 draw.io 技术图 (`JavaGuide 专属 draw.io 绘图 Skill 开源-用 Agent 自动生成可编辑的 draw.io 技术图.md`)
10. mattpocock/skills：我最推荐的 4 个 AI 编程 Skill (`mattpocockskills-我最推荐的 4 个 AI 编程 Skill.md`)
11. oh-my-pi 开源终端 AI 编码代理体验 (`oh-my-pi 开源终端 AI 编码代理体验.md`)
12. Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范 (`Spec Coding 规范驱动编程实战-从 Vibe Coding 到 AI 代码规范.md`)
13. Vibe Coding 实用技巧总结：Git、Spec、上下文管理与多 Agent 协作 (`Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作.md`)
14. 比 iTerm2 更适合 Claude Code/Codex 的终端，我换成 Ghostty 了 (`比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了.md`)
15. 强模型时代，AI 编程 Skills 还有必要装吗？ (`强模型时代，AI 编程 Skills 还有必要装吗？.md`)

