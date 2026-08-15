import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const openSourceProject = arraySidebar([
  {
    text: "技术教程",
    link: "Java 优质开源技术教程",
    icon: ICONS.BOOK,
  },
  {
    text: "实战项目",
    link: "Java 优质开源实战项目",
    icon: ICONS.PROJECT,
  },
  {
    text: "AI",
    link: "Java 优质开源 AI 项目",
    icon: ICONS.MACHINE_LEARNING,
  },
  {
    text: "系统设计",
    link: "Java 优质开源系统设计项目",
    icon: ICONS.DESIGN,
  },
  {
    text: "工具类库",
    link: "Java 优质开源工具类",
    icon: ICONS.LIBRARY,
  },
  {
    text: "开发工具",
    link: "Java 优质开源开发工具",
    icon: ICONS.TOOL,
  },
  {
    text: "大数据",
    link: "Java 优质开源大数据项目",
    icon: ICONS.BIG_DATA,
  },
]);
