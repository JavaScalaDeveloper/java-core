import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const zhuanlan = arraySidebar([
  {
    text: "实战项目",
    icon: ICONS.PROJECT,
    collapsible: false,
    children: [
      { text: "Spring AI 智能面试平台", link: "大模型实战项目 + Agent实战项目-Spring AI 面试平台与 RAG 知识库" },
      { text: "手写 RPC 框架", link: "手写 RPC 框架 Netty + Kryo + Zookeeper 实战教程" },
    ],
  },
  {
    text: "面试资料",
    icon: ICONS.INTERVIEW,
    collapsible: false,
    children: [
      { text: "Java 面试指北", link: "Java 面试指北 Java 后端面试指南 Java 八股文面试题大全" },
      {
        text: "后端高频系统设计&场景题",
        link: "后端高频系统设计面试题 场景题 秒杀系统 短链系统（含答案）",
      },
      { text: "Java 必读源码系列", link: "Java 必读源码系列 Dubbo + Netty + Spring Boot 源码解析" },
    ],
  },
]);
