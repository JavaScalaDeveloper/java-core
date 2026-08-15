import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "后端开发", icon: "mdi:language-java", link: "/home.md" },
  { text: "计算机基础", icon: "mdi:desktop-classic", link: "/计算机基础/" },
  { text: "AI应用开发", icon: "mdi:robot-outline", link: "/ai/" },
  { text: "AI编程", icon: "mdi:code-tags", link: "/AI编程/" },
  {
    text: "推荐阅读",
    icon: "mdi:book-open-page-variant-outline",
    children: [
      { text: "学习路线", icon: "mdi:map-outline", link: "/学习路线/" },
      { text: "开源项目", icon: "mdi:github", link: "/开源项目/" },
      {
        text: "技术书籍",
        icon: "mdi:book-open-page-variant-outline",
        link: "/书籍/",
      },
      {
        text: "程序人生",
        icon: "mdi:code-tags",
        link: "/优质技术文章/",
      },
    ],
  },
  {
    text: "网站相关",
    icon: "mdi:information-outline",
    children: [
      {
        text: "关于作者",
        icon: "mdi:account-edit-outline",
        link: "/关于作者/",
      },
      {
        text: "PDF下载",
        icon: "mdi:file-pdf-box",
        link: "/面试准备/2026最新Java面试+后端面试PDF资料.md",
      },
      {
        text: "面试突击",
        icon: "mdi:file-pdf-box",
        link: "https://interview.javaguide.cn/home.html",
      },
      {
        text: "更新历史",
        icon: "mdi:history",
        link: "/timeline/",
      },
    ],
  },
]);
