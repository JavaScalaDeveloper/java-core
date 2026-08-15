import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const aboutTheAuthor = arraySidebar([
  {
    text: "个人经历",
    icon: ICONS.EXPERIENCE,
    collapsible: false,
    children: [
      "我曾经也是网瘾少年",
      "害，毕业三年了！",
      "JavaGuide 开源项目 100K Star 了！",
      "入职培训一个月后的感受",
      "从毕业到入职半年的感受",
    ],
  },
  {
    text: "杂谈",
    icon: ICONS.CHAT,
    collapsible: false,
    children: [
      "坚持写技术博客六年了!",
      "已经淘汰的 Java 技术，不要再学了！",
      "某培训机构盗我文章做成视频还上了B站热门",
      "抄袭狗，你冬天睡觉脚必冷！！！",
      "JavaGuide 知识星球介绍-Java 面试资料、简历修改与实战项目",
    ],
  },
]);
