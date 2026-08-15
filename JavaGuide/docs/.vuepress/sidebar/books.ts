import { arraySidebar } from "vuepress-theme-hope";
import { ICONS } from "./constants.js";

export const books = arraySidebar([
  {
    text: "计算机基础",
    link: "计算机基础必读经典书籍",
    icon: ICONS.COMPUTER,
  },
  {
    text: "数据库",
    link: "数据库必读经典书籍",
    icon: ICONS.DATABASE,
  },
  {
    text: "搜索引擎",
    link: "搜索引擎必读经典书籍",
    icon: ICONS.SEARCH,
  },
  {
    text: "Java",
    link: "Java 必读经典书籍",
    icon: ICONS.JAVA,
  },
  {
    text: "软件质量",
    link: "软件质量必读经典书籍",
    icon: ICONS.HIGH_AVAILABLE,
  },

  {
    text: "分布式",
    link: "分布式必读经典书籍",
    icon: ICONS.DISTRIBUTED,
  },
]);
