import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const aiCoding = arraySidebar([
  {
    text: "入门",
    icon: ICONS.BASIC,
    children: [
      {
        text: "AI 编程开放性面试题",
        link: "实践/10 道 AI 编程相关的开放性面试问题",
      },
      {
        text: "AI 编程选 CLI 还是 IDE？",
        link: "实践/AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流",
      },
    ],
  },
  {
    text: "Claude Code 与 Codex",
    icon: ICONS.CODE,
    children: [
      {
        text: "⭐️Claude Code 使用指南",
        link: "实践/Claude Code 使用指南-配置、工作流与进阶技巧",
      },
      {
        text: "Claude Code 核心命令详解",
        link: "实践/Claude Code 核心命令详解-code-review、loop、goal、batch、run、verify",
      },
      {
        text: "⭐️OpenAI Codex 最佳实践指南",
        link: "实践/Codex 使用指南-配置、AGENTS.md 与 Agentic 工作流",
      },
      {
        text: "高颜值 Claude Code 替代 OMP",
        link: "实践/oh-my-pi 开源终端 AI 编码代理体验",
      },
      {
        text: "Ghostty 安装、配置和常见技巧",
        link: "实践/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了",
      },
      {
        text: "Claude Code Agent View 多会话管理",
        link: "实践/Claude Code Agent View-多会话并行管理实战",
      },
    ],
  },
  {
    text: "Claude Code 原理",
    icon: ICONS.CODE,
    prefix: "原则/",
    children: [
      {
        text: "Claude Code 上下文管理",
        link: "Claude Code 上下文管理详解-窗口预算、压缩与长任务治理",
      },
      {
        text: "Claude Code 记忆系统",
        link: "Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选",
      },
      {
        text: "Claude Code Skills 原理",
        link: "Claude Code Skills 技术实现细节与运行方式",
      },
      {
        text: "Claude Code Hooks 原理",
        link: "Claude Code Hooks 详解-生命周期钩子与自动化工作流",
      },
      {
        text: "Claude Code 多 Agent 机制",
        link: "Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams",
      },
    ],
  },
  {
    text: "规范与提效",
    icon: ICONS.PERFORMANCE,
    children: [
      {
        text: "⭐️Vibe Coding 实用技巧总结",
        link: "实践/Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作",
      },
      {
        text: "Spec Coding 规范驱动编程",
        link: "实践/Spec Coding 规范驱动编程实战-从 Vibe Coding 到 AI 代码规范",
      },
      {
        text: "⭐️CLAUDE.md 最佳实践",
        link: "实践/CLAUDE.md 最佳实践-该写什么、不该写什么、项目变大后怎么拆",
      },
      {
        text: "⭐️AI 编程必备 Skills 推荐",
        link: "实践/AI 编程 Skills 选型清单-需求澄清、TDD、代码审查与 UI 设计",
      },
      {
        text: "AI 编程 Skills 选型与精简",
        link: "实践/强模型时代，AI 编程 Skills 还有必要装吗？",
      },
      {
        text: "mattpocock/skills 深度使用指南",
        link: "实践/mattpocockskills-我最推荐的 4 个 AI 编程 Skill",
      },
      {
        text: "一个好用的 AI 绘图 Skill",
        link: "实践/JavaGuide 专属 draw.io 绘图 Skill 开源-用 Agent 自动生成可编辑的 draw.io 技术图",
      },
    ],
  },
  {
    text: "AI 编程实战",
    icon: ICONS.PROJECT,
    children: [
      {
        text: "IDEA + Qoder 插件多场景实战",
        link: "案例/IDEA + Qoder 插件多场景实战-接口优化与代码重构",
      },
      {
        text: "Trae + MiniMax 多场景实战",
        link: "案例/Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构",
      },
      {
        text: "Claude Code 接入第三方模型实战",
        link: "案例/Claude Code 接入第三方模型实战-JVM 智能诊断与慢查询治理",
      },
      {
        text: "DeepSeek V4 + Claude Code 实战",
        link: "案例/DeepSeek V4 + Claude Code 实战-代码能力深度测评",
      },
      {
        text: "MiniMax M3 + Claude Code 实战",
        link: "案例/MiniMax M3 + Claude Code 实战-Redis 故障排查、SCAN 算法复刻与监控面板搭建",
      },
      {
        text: "Kimi K3 多场景实战",
        link: "案例/Kimi K3 实战-全栈项目、Java 项目改造与 3A 游戏 Demo",
      },
      {
        text: "IDEA + CC GUI 插件实战",
        link: "项目/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南",
      },
    ],
  },
]);
