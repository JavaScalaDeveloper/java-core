import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const highQualityTechnicalArticles = arraySidebar([
  {
    text: "练级攻略",
    icon: ICONS.PERFORMANCE,
    prefix: "进阶程序员/",
    collapsible: false,
    children: [
      "程序员如何快速学习新技术",
      "程序员的技术成长战略",
      "十年大厂成长之路",
      "美团三年，总结的10条血泪教训",
      "给想成长为高级别开发同学的七条建议",
      "糟糕程序员的 20 个坏习惯",
      "工作五年之后，对技术和业务的思考",
    ],
  },
  {
    text: "个人经历",
    icon: ICONS.EXPERIENCE,
    prefix: "个人经验/",
    collapsible: false,
    children: [
      "从校招入职腾讯的四年工作总结",
      "滴滴和头条两年后端工作经验分享",
      "一个中科大差生的 8 年程序员工作总结",
      "华为 OD 275 天后，我进了腾讯！",
    ],
  },
  {
    text: "程序员",
    icon: ICONS.CODE,
    prefix: "程序员/",
    collapsible: false,
    children: [
      "程序员职业方向怎么选？",
      "程序员最该拿的几种高含金量证书",
      "程序员怎样出版一本技术书",
      "程序员高效出书避坑和实践指南",
    ],
  },
  {
    text: "面试",
    icon: ICONS.INTERVIEW,
    prefix: "面试/",
    collapsible: true,
    children: [
      "斩获 20+ 大厂 offer 的面试经验分享",
      "一位大龄程序员所经历的面试的历炼和思考",
      "从面试官和候选者的角度谈如何准备技术初试",
      "如何甄别应聘者的包装程度",
      "普通人的春招总结（阿里、腾讯offer）",
      "校招进入飞书的个人经验",
      "如何在技术初试中考察程序员的技术能力",
      "阿里技术面试的一些秘密",
    ],
  },
  {
    text: "工作",
    icon: ICONS.WORK,
    prefix: "工作/",
    collapsible: true,
    children: [
      "新入职一家公司如何快速进入工作状态",
      "32条总结教你提升职场经验",
      "聊聊大厂的绩效考核",
    ],
  },
]);
