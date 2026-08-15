import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const ai = arraySidebar([
  {
    text: "入门总览",
    icon: ICONS.BASIC,
    children: [{ text: "⭐️AI 核心概念总览", link: "ai核心概念" }],
  },
  {
    text: "面试题",
    icon: ICONS.INTERVIEW,
    prefix: "面试题/",
    children: [
      { text: "⭐️AI 应用开发面试指南", link: "ai面试指南" },
      { text: "大模型基础面试题总结", link: "llm面试题" },
      { text: "AI Agent 面试题总结", link: "agent面试题" },
      { text: "RAG 面试题总结", link: "rag面试题" },
      {
        text: "AI 系统设计面试题总结",
        link: "ai系统设计面试题",
      },
    ],
  },
  {
    text: "大模型基础",
    icon: ICONS.MACHINE_LEARNING,
    prefix: "llm基础/",
    children: [
      { text: "万字拆解 LLM 运行机制", link: "llm运行机制" },
      { text: "大模型 API 调用工程实践", link: "llm-api工程" },
      {
        text: "大模型结构化输出详解",
        link: "结构化输出与函数调用",
      },
      { text: "AI 应用评测体系", link: "llm评测" },
    ],
  },
  {
    text: "AI Agent",
    icon: ICONS.CHAT,
    prefix: "agent/",
    children: [
      { text: "⭐️AI Agent 核心概念详解", link: "agent基础" },
      { text: "⭐️AI Agent 记忆系统详解", link: "agent记忆" },
      { text: "提示词工程实战指南", link: "prompt工程" },
      { text: "上下文工程实战指南", link: "上下文工程" },
      { text: "万字详解 Agent Skills", link: "skills" },
      { text: "万字拆解 MCP 协议", link: "mcp" },
      { text: "Harness Engineering 详解", link: "harness工程" },
      { text: "AI 工作流详解", link: "工作流图循环" },
      { text: "Loop Engineering 详解", link: "loop工程" },
    ],
  },
  {
    text: "RAG",
    icon: ICONS.SEARCH,
    prefix: "rag/",
    children: [
      { text: "⭐️RAG 基础概念详解", link: "rag基础" },
      {
        text: "RAG 文档处理与切分策略",
        link: "rag文档处理",
      },
      {
        text: "⭐️RAG 向量索引算法和向量数据库",
        link: "rag向量存储",
      },
      {
        text: "RAG 知识库文档更新策略",
        link: "rag知识更新",
      },
      { text: "GraphRAG 详解", link: "graphrag" },
      { text: "RAG 检索优化", link: "rag优化" },
    ],
  },
  {
    text: "AI 系统设计",
    icon: ICONS.DESIGN,
    prefix: "系统设计/",
    children: [
      {
        text: "AI 应用系统设计",
        link: "ai应用架构",
      },
      { text: "大模型网关详解", link: "llm网关" },
      { text: "AI 语音技术详解", link: "ai语音" },
    ],
  },
]);
