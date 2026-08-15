---
home: true
icon: "mdi:home-outline"
title: JavaGuide（Java 面试 & 后端通用知识体系）
description: JavaGuide 是 GitHub 156K+ Star 的 Java 面试与后端知识体系指南，免费开源，系统覆盖 Java、计算机基础、数据库、分布式、高并发、高可用、系统设计与 AI 应用开发，适合校招、社招、跳槽和后端能力体系化复习。
heroImage: /logo.svg
heroText: JavaGuide
tagline: GitHub 156K+ Star 的 Java 面试与后端知识体系，覆盖计算机基础、数据库、分布式、高并发、系统设计与 AI 应用开发
sitemap:
  changefreq: weekly
  priority: 0.9
head:
  - - meta
    - name: keywords
      content: JavaGuide,Java面试,Java面试指南,Java八股文,后端面试,后端开发,数据库面试,MySQL面试,Redis面试,分布式,高并发,高性能,高可用,系统设计,消息队列,缓存,计算机网络,Linux,AI面试,AI应用开发,Agent,RAG,MCP,LLM,AI编程
  - - meta
    - property: og:image
      content: https://javaguide.cn/logo.png
actions:
  - text: 开始阅读
    link: /home.md
    type: primary
footer: |-
  <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2020015769号-1</a> | 主题: <a href="https://theme-hope.vuejs.press/" target="_blank">VuePress Theme Hope</a>
---

<!-- markdownlint-disable MD033 -->

## 核心入口

- **后端面试主线**：[后端面试指南](./home.md)（⭐网站核心）：系统整理 Java 面试八股文和后端高频面试题，覆盖 Java 基础、集合、并发、JVM、Spring、MySQL、Redis、分布式、高并发、高可用和系统设计。
- **计算机基础**：[计算机基础面试指南](./计算机基础/)：系统梳理计算机网络、操作系统、数据结构与算法等后端面试底层基础，适合补齐基础短板。
- **AI 应用开发**：[AI 应用开发面试指南](./ai/)（⭐新增）：面向后端开发者梳理大模型基础、Prompt、Agent、RAG、MCP、LLM API 工程和 AI 系统设计等高频知识；系统学习可配合 [学习路线](./学习路线/)。
- **AI 编程实战**：[AI 编程实践指南](./ai编程/)（⭐新增）：聚焦 Claude Code、Codex、AI IDE、CLI Agent、上下文管理和 AI 辅助开发工作流。
- **学习路线**：[学习路线合集](./学习路线/)：整理 Java 后端、AI 应用开发、AI Agent 和全栈开发等方向的系统学习建议。

## `0-ALL.md` / `0-ALL-Cursor.md` / `0-ALL-重点.md` 的区别

各一级、二级内容目录下提供三类汇总文件（文件名以 `0-` 开头，方便排在目录最前）：

| 文件 | 定位 | 内容来源 | 适合做什么 |
|------|------|----------|------------|
| **`0-ALL.md`** | **原文汇总存档** | 将该目录（及一级目录下子目录）文章 **按原文拼接**；排除 `README.md`、`TODO.md` | 需要完整原文、对照单篇、全文检索 |
| **`0-ALL-Cursor.md`** | **Cursor 精整复习版** | 基于 `0-ALL.md`：去广告、理顺导读；**一级目录**文末有补充清单 | 日常复习、串讲、丢给 AI 当上下文 |
| **`0-ALL-重点.md`** | **面试重点精简版** | 基于 `0-ALL.md` **只保留面试高频**：问答向小节、核心原理与对比；软文、次要新特性、低优先级内容会省略 | **冲刺面试、快速过考点** |

补充说明：

1. 推荐路径：`0-ALL-重点.md` 扫考点 → 不懂再看 `0-ALL-Cursor.md` / 单篇 → 需要逐字原文再回 `0-ALL.md`。  
2. 部分目录（如优质技术文章、专栏、技术书籍等）未生成重点版，因其面试硬核价值较低。  
3. 三类文件都会尽量去掉知识星球 / 公众号等营销内容。

示例（AI / 消息队列）：

- [ai/0-ALL-重点.md](./ai/0-ALL-重点.md) — AI 面试重点  
- [高性能/消息队列/0-ALL-重点.md](./高性能/消息队列/0-ALL-重点.md) — MQ 重点（含 Kafka / Pulsar）  
- [高性能/消息队列/Pulsar常见面试题总结.md](./高性能/消息队列/Pulsar常见面试题总结.md) — Pulsar 与 Kafka 对比专题  

## 精选文章

- **冲刺面试**：优先打开各目录 [`0-ALL-重点.md`](./java/0-ALL-重点.md)（例如 [java](./java/0-ALL-重点.md)、[数据库](./数据库/0-ALL-重点.md)、[分布式](./分布式/0-ALL-重点.md)、[消息队列](./高性能/消息队列/0-ALL-重点.md)）。
- **系统复习**：[面试准备/0-ALL-Cursor.md](./面试准备/0-ALL-Cursor.md)、[计算机基础/0-ALL-Cursor.md](./计算机基础/0-ALL-Cursor.md)、[ai/0-ALL-Cursor.md](./ai/0-ALL-Cursor.md)、[ai编程/0-ALL-Cursor.md](./ai编程/0-ALL-Cursor.md)。

## 关于 JavaGuide

JavaGuide 是面向 Java / 后端开发者的开源知识库（GitHub **156K+ Star**），从面试复习扩展为覆盖后端核心技术、工程实践与 AI 应用开发的学习指南。自 2018 年开源以来持续维护。

网站内容覆盖：

- **后端面试**：Java 基础、集合、并发、JVM、MySQL、Redis、分布式、系统设计等。
- **AI 应用开发**：LLM 基础、Agent、RAG、MCP 等。

- [项目介绍](./javaguide/项目介绍.md)
- [贡献指南](./javaguide/贡献指南.md)
- [常见问题](./javaguide/常见问题.md)

开源仓库：[GitHub](https://github.com/Snailclimb/JavaGuide) | [Gitee](https://gitee.com/SnailClimb/JavaGuide)
