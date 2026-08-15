import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const roadmap = arraySidebar([
  {
    text: "学习路线",
    icon: ICONS.ROADMAP,
    children: [
      { text: "学习路线合集（2026）", link: "/学习路线/" },
      {
        text: "Java 后端学习路线（2026）",
        link: "Java 后端学习路线（2026 最新版）",
      },
      {
        text: "Java/Go 转 AI 路线（2026）",
        link: "Java与Go 开发者 AI 应用开发与 Agent 学习路线（2026 最新版）",
      },
      {
        text: "后端转 AI Agent 建议（2026）",
        link: "后端开发者转型 AI Agent 学习建议（2026 最新版）",
      },
      {
        text: "后端全栈学习路线（2026）",
        link: "后端开发者全栈学习路线（2026 最新版）-AI 时代如何补齐前端和交付能力",
      },
      {
        text: "测试开发学习路线（2026）",
        link: "测试开发学习路线（2026 最新版）-AI 时代如何从测试走向质量工程",
      },
    ],
  },
]);
