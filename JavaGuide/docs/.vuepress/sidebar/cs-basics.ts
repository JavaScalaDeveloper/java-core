import { ICONS, createImportantSection } from "./constants.js";

export const csBasics = [
  {
    text: "网络",
    prefix: "计算机网络/",
    icon: ICONS.NETWORK,
    children: [
      {
        text: "面试题",
        icon: ICONS.INTERVIEW,
        children: [
          {
            text: "⭐️计算机网络常见面试题总结（上）",
            link: "计算机网络常见面试题总结（上）",
          },
          {
            text: "⭐️计算机网络常见面试题总结（下）",
            link: "计算机网络常见面试题总结（下）",
          },
          // { text: "计算机网络知识总结", link: "《计算机网络》（谢希仁）内容总结" },
        ],
      },
      {
        text: "基础",
        icon: ICONS.STAR,
        collapsible: true,
        children: [
          {
            text: "OSI 七层模型与 TCP/IP 四层模型详解",
            link: "OSI 七层模型与 TCPIP 四层模型详解",
          },
          {
            text: "从输入 URL 到页面展示到底发生了什么？",
            link: "从输入 URL 到页面展示到底发生了什么？",
          },
        ],
      },
      {
        text: "应用层",
        icon: ICONS.CODE,
        collapsible: true,
        children: [
          { text: "⭐️应用层常见协议总结", link: "常见应用层协议总结-HTTP、WebSocket、SMTP、FTP、SSH、DNS 等" },
          { text: "⭐️HTTP vs HTTPS", link: "HTTP vs HTTPS-区别在哪里、HTTPS 为什么更安全（应用层）" },
          { text: "⭐️有了HTTP，为什么还要RPC？", link: "有了 HTTP 协议，为什么还要 RPC？HTTP 与 RPC 区别对比" },
          {
            text: "HTTPS 握手里的 RSA 和 ECDHE",
            link: "HTTPS 握手里的 RSA 和 ECDHE，到底差在哪？（应用层）",
          },
          { text: "HTTP 1.0 vs HTTP 1.1", link: "HTTP 1.0 vs HTTP 1.1-长连接、缓存、Host 头等核心差异（应用层）" },
          { text: "HTTP 常见状态码总结", link: "HTTP 常见状态码总结（应用层）" },
          { text: "DNS 域名系统详解", link: "DNS 域名系统详解（应用层）" },
        ],
      },
      {
        text: "传输层",
        icon: ICONS.NETWORK,
        collapsible: true,
        children: [
          {
            text: "⭐️TCP 三次握手和四次挥手",
            link: "TCP 三次握手和四次挥手（传输层）",
          },
          { text: "TCP TIME_WAIT 详解", link: "TCP TIMEWAIT 详解-为什么要等、会不会出问题、能不能复用？" },
          {
            text: "TCP Keepalive和HTTP Keep-Alive有什么区别？",
            link: "TCP Keepalive 和 HTTP Keep-Alive 有什么区别？",
          },
          {
            text: "TCP 字节流 vs UDP 报文",
            link: "为什么 TCP 是面向字节流，UDP 是面向报文？（传输层）",
          },
          {
            text: "⭐️TCP 如何保证可靠传输？",
            link: "TCP 如何保证可靠传输？重传、滑动窗口与拥塞控制详解",
          },
          {
            text: "能 Ping 通，TCP 就一定能连通吗？",
            link: "能 Ping 通，TCP 就一定能连通吗？",
          },
          {
            text: "TCP 和 UDP 可以使用同一个端口吗？",
            link: "TCP 和 UDP 可以使用同一个端口吗？",
          },
          {
            text: "一台主机最多能保持多少个 TCP 连接？",
            link: "一台主机上只能保持最多 65535 个 TCP 连接吗？",
          },
        ],
      },
      {
        text: "网络层",
        icon: ICONS.NETWORK,
        collapsible: true,
        children: [
          { text: "ARP 协议详解", link: "ARP 协议详解（网络层）" },
          { text: "NAT 协议详解", link: "NAT 协议详解（网络层）" },
        ],
      },
      {
        text: "安全",
        icon: ICONS.SECURITY,
        collapsible: true,
        children: [
          { text: "网络攻击常见手段总结", link: "网络攻击常见手段总结（安全）" },
        ],
      },
    ],
  },
  {
    text: "操作系统",
    prefix: "操作系统/",
    icon: ICONS.OS,
    children: [
      {
        text: "面试题",
        icon: ICONS.INTERVIEW,
        children: [
          {
            text: "⭐️操作系统常见面试题总结（上）",
            link: "操作系统常见面试题总结（上）",
          },
          {
            text: "⭐️操作系统常见面试题总结（下）",
            link: "操作系统常见面试题总结（下）",
          },
        ],
      },
      {
        text: "面试必考",
        icon: ICONS.STAR,
        children: [
          { text: "⭐️虚拟内存详解", link: "虚拟内存详解-地址转换、TLB、缺页异常与页面置换" },
          { text: "⭐️I/O 多路复用详解", link: "IO 多路复用详解-select、poll、epoll 原理与区别" },
          { text: "⭐️零拷贝详解", link: "零拷贝详解-mmap、sendfile 与 splice" },
        ],
      },
      {
        text: "内存与文件系统",
        icon: ICONS.OS,
        collapsible: true,
        children: [
          { text: "内存管理详解", link: "操作系统内存管理详解-分页、分段、页面置换、Swap 与 OOM" },
          { text: "文件系统详解", link: "操作系统文件系统详解-inode、VFS、Page Cache 与日志机制" },
        ],
      },
      {
        text: "进程与线程",
        icon: ICONS.STAR,
        collapsible: true,
        children: [
          { text: "⭐️进程与线程详解", link: "进程与线程详解-区别、状态、通信、上下文切换与虚拟线程" },
          { text: "⭐️锁与同步机制", link: "操作系统锁与同步机制详解-mutex、semaphore、condition variable、spinlock 与 futex" },
          { text: "⭐️死锁详解", link: "死锁详解-四个必要条件、Java 死锁排查与数据库死锁处理" },
          {
            text: "中断、异常与系统调用",
            link: "中断、异常与系统调用详解-从内核入口到缺页异常",
          },
          { text: "CPU 调度与系统负载", link: "CPU 调度与系统负载详解" },
          { text: "进程间通信（IPC）详解", link: "进程间通信（IPC）详解-管道、消息队列、共享内存、Socket 与 Binder" },
        ],
      },
      {
        text: "Linux",
        icon: ICONS.LINUX,
        children: [
          { text: "Linux 基础知识总结", link: "Linux 基础知识总结" },
          { text: "Shell 编程基础知识总结", link: "Shell 编程基础知识总结" },
        ],
      },
    ],
  },
  {
    text: "数据结构",
    prefix: "数据结构/",
    icon: ICONS.DATA_STRUCTURE,
    collapsible: true,
    children: [
      {
        text: "知识体系",
        link: "/计算机基础/数据结构/",
      },
      {
        text: "基础结构",
        collapsible: true,
        children: [
          { text: "线性数据结构", link: "线性数据结构详解（数组、链表、栈、队列）" },
          { text: "⭐️哈希表", link: "哈希表面试题总结-哈希冲突、扩容与 Java HashMap" },
        ],
      },
      {
        text: "树与堆",
        collapsible: true,
        children: [
          { text: "⭐️树结构", link: "树结构详解（二叉树、AVL、BB+树）" },
          { text: "⭐️堆", link: "堆详解（最大堆、最小堆、优先队列）" },
          { text: "红黑树", link: "红黑树详解（性质、旋转、应用）" },
        ],
      },
      {
        text: "图与集合",
        collapsible: true,
        children: [
          { text: "图", link: "图详解（DFS、BFS、最短路径）" },
          { text: "⭐️并查集", link: "并查集面试题总结-路径压缩、连通性与 Java 模板" },
        ],
      },
      {
        text: "字符串与有序索引",
        collapsible: true,
        children: [
          { text: "Trie 前缀树", link: "Trie 前缀树面试题总结-字典树原理、前缀匹配与 Java 实现" },
          { text: "跳表", link: "跳表面试题总结-多级索引、范围查询与 Redis ZSet" },
        ],
      },
      {
        text: "工程型结构",
        collapsible: true,
        children: [
          { text: "⭐️布隆过滤器", link: "布隆过滤器详解（原理、实现、应用场景）" },
          { text: "⭐️LRU 缓存", link: "LRU 缓存面试题总结-哈希表、双向链表与 LinkedHashMap" },
        ],
      },
    ],
  },
  {
    text: "算法",
    prefix: "算法/",
    icon: ICONS.ALGORITHM,
    collapsible: true,
    children: [
      { text: "复杂度分析", link: "时间复杂度和空间复杂度面试指南-Big O、递归复杂度与常见误区" },
      { text: "二分查找", link: "二分查找面试题总结-左右边界、答案二分与 Java 模板" },
      { text: "双指针与滑动窗口", link: "双指针与滑动窗口面试题总结-数组、链表、字符串高频模板" },
      { text: "DFS 与 BFS", link: "DFS 与 BFS 面试题总结-树、图、矩阵搜索与最短路径模板" },
      { text: "回溯算法", link: "回溯算法面试题总结-组合、排列、子集、剪枝与 Java 模板" },
      { text: "动态规划", link: "动态规划面试题总结-状态转移、背包、子序列与 Java 模板" },
      { text: "贪心算法", link: "贪心算法面试题总结-区间贪心、跳跃游戏与证明思路" },
      { text: "Top K 问题", link: "Top K 问题面试题总结-堆、快排分区、桶计数与数据流" },
      {
        text: "经典算法思想",
        link: "经典算法思想总结（含 LeetCode 题目推荐）",
      },
      {
        text: "数据结构 LeetCode",
        link: "常见数据结构经典 LeetCode 题目推荐",
      },
      { text: "字符串算法题", link: "几道常见的字符串算法题" },
      { text: "链表算法题", link: "几道常见的链表算法题" },
      { text: "剑指 Offer", link: "剑指offer部分编程题" },
      { text: "经典排序算法", link: "十大经典排序算法总结" },
    ],
  },
];
