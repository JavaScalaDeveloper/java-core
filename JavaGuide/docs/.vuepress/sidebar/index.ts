import { sidebar } from "vuepress-theme-hope";

import { aboutTheAuthor } from "./about-the-author.js";
import { ai } from "./ai.js";
import { aiCoding } from "./ai-coding.js";
import { books } from "./books.js";
import { csBasics } from "./cs-basics.js";
import { highQualityTechnicalArticles } from "./high-quality-technical-articles.js";
import { openSourceProject } from "./open-source-project.js";
import { roadmap } from "./roadmap.js";
import { zhuanlan } from "./zhuanlan.js";
import {
  ICONS,
  createImportantSection,
  createSourceCodeSection,
} from "./constants.js";

export default sidebar({
  // 应该把更精确的路径放置在前边
  "/AI编程/": aiCoding,
  "/ai/": ai,
  "/学习路线/": roadmap,
  "/计算机基础/": csBasics,
  "/开源项目/": openSourceProject,
  "/书籍/": books,
  "/关于作者/": aboutTheAuthor,
  "/优质技术文章/": highQualityTechnicalArticles,
  "/专栏/": zhuanlan,
  // 必须放在最后面
  "/": [
    {
      text: "项目介绍",
      icon: ICONS.STAR,
      collapsible: true,
      prefix: "javaguide/",
      children: ["项目介绍", "使用建议", "贡献指南", "常见问题"],
    },
    {
      text: "面试准备（必看）",
      icon: ICONS.INTERVIEW,
      collapsible: true,
      prefix: "面试准备/",
      children: [
        {
          text: "面试准备知识体系",
          link: "/面试准备/",
        },
        { text: "Java 后端面试通关计划", link: "2026 最新版 Java 后端面试通关计划（涵盖后端通用体系）" },
        "如何高效准备Java面试？",
        "程序员简历编写指南",
        { text: "Java 后端面试重点总结", link: "2026最新版Java后端面试重点总结" },
        {
          text: "Java 面试 + 后端面试 PDF 资料",
          link: "2026最新Java面试+后端面试PDF资料",
        },
        { text: "Java 学习路线", link: "Java 后端学习路线（2026 最新版）" },
        "项目经验指南",
        "面试太紧张怎么办？",
        "校招没有实习经历怎么办？实习经历怎么写？",
      ],
    },
    {
      text: "Java",
      icon: ICONS.JAVA,
      collapsible: true,
      prefix: "java/",
      children: [
        {
          text: "Java 知识体系",
          link: "/java/",
        },
        {
          text: "基础",
          prefix: "基础/",
          icon: ICONS.BASIC,
          children: [
            "Java基础常见面试题总结(上)",
            "Java基础常见面试题总结(中)",
            "Java基础常见面试题总结(下)",
            createImportantSection([
              "Java 值传递详解",
              "Java 序列化详解",
              "泛型&通配符详解",
              "Java 反射机制详解",
              "Java 代理模式详解",
              "BigDecimal 详解",
              {
                text: "Java 金额类型选择",
                link: "Java 金额用 long 还是 BigDecimal？",
              },
              "Java 魔法类 Unsafe 详解",
              "Java SPI 机制详解",
              "Java 语法糖详解",
            ]),
          ],
        },
        {
          text: "集合",
          prefix: "集合/",
          icon: ICONS.CONTAINER,
          children: [
            "Java集合常见面试题总结(上)",
            "Java集合常见面试题总结(下)",
            "Java集合使用注意事项总结",
            createSourceCodeSection([
              "ArrayList 源码分析",
              "LinkedList 源码分析",
              "HashMap 源码分析",
              "ConcurrentHashMap 源码分析",
              "LinkedHashMap 源码分析",
              "CopyOnWriteArrayList 源码分析",
              "ArrayBlockingQueue 源码分析",
              "DelayQueue 源码分析",
            ]),
          ],
        },
        {
          text: "并发编程",
          prefix: "并发/",
          icon: ICONS.PERFORMANCE,
          children: [
            "Java并发常见面试题总结（上）",
            "Java并发常见面试题总结（中）",
            "Java并发常见面试题总结（下）",
            createImportantSection([
              { text: "Java 锁详解", link: "Java 锁详解-互斥锁、读写锁、自旋锁与 synchronized 锁优化" },
              "乐观锁和悲观锁详解",
              "CAS 详解",
              "JMM（Java 内存模型）详解",
              "Java 线程池详解",
              "Java 线程池最佳实践",
              "Java 常见并发容器总结",
              "AQS 详解",
              "Atomic 原子类总结",
              "ThreadLocal 详解",
              "CompletableFuture 详解",
              "虚拟线程常见问题总结",
            ]),
          ],
        },
        {
          text: "IO",
          prefix: "io/",
          icon: ICONS.CODE,
          collapsible: true,
          children: ["Java IO 基础知识总结", "Java IO 设计模式总结", "Java IO 模型详解", "Java NIO 核心知识总结"],
        },
        {
          text: "JVM",
          prefix: "jvm/",
          icon: ICONS.VIRTUAL_MACHINE,
          collapsible: true,
          children: [
            {
              text: "JVM常见面试题总结",
              link: "https://interview.javaguide.cn/java/java-jvm.html",
            },
            "Java内存区域详解（重点）",
            "JVM垃圾回收详解（重点）",
            "类文件结构详解",
            "类加载过程详解",
            "类加载器详解（重点）",
            "最重要的JVM参数总结",
            "JDK监控和故障处理工具总结",
            "JVM线上问题排查和性能调优案例",
          ],
        },
        {
          text: "新特性",
          prefix: "新特性/",
          icon: ICONS.FEATURED,
          collapsible: true,
          children: [
            "Java8 新特性实战",
            "《Java8 指南》中文翻译",
            "Java 9 新特性概览",
            "Java 10 新特性概览",
            "Java 11 新特性概览（重要）",
            "Java 12 & 13 新特性概览",
            "Java 14 & 15 新特性概览",
            "Java 16 新特性概览",
            "Java 17 新特性概览（重要）",
            "Java 18 新特性概览",
            "Java 19 新特性概览",
            "Java 20 新特性概览",
            "Java 21 新特性概览(重要)",
            "Java 22 & 23 新特性概览",
            "Java 24 新特性概览",
            "Java 25 新特性概览",
          ],
        },
      ],
    },
    {
      text: "数据库",
      icon: ICONS.DATABASE,
      prefix: "数据库/",
      collapsible: true,
      children: [
        {
          text: "数据库知识体系",
          link: "/数据库/",
        },
        {
          text: "基础",
          icon: ICONS.BASIC,
          children: [
            "数据库基础常见面试题总结",
            "NoSQL基础常见面试题总结",
            {
              text: "字符集详解",
              link: "字符集详解-字符集是什么？怎么用？",
            },
            {
              text: "SQL",
              icon: ICONS.SQL,
              prefix: "sql/",
              collapsible: true,
              children: [
                "SQL语法基础知识总结",
                "SQL常见面试题总结（1）",
                "SQL常见面试题总结（2）",
                "SQL常见面试题总结（3）",
                "SQL常见面试题总结（4）",
                "SQL常见面试题总结（5）",
              ],
            },
          ],
        },
        {
          text: "MySQL",
          prefix: "mysql/",
          icon: ICONS.MYSQL,
          children: [
            "MySQL常见面试题总结",
            "MySQL高性能优化规范建议总结",
            createImportantSection([
              "MySQL索引详解",
              "MySQL索引失效场景总结",
              {
                text: "MySQL三大日志详解",
                link: "MySQL三大日志(binlog、redo log和undo log)详解",
              },
              {
                text: "MySQL备份与恢复",
                link: "MySQL备份与恢复详解-mysqldump、XtraBackup、binlog和PITR",
              },
              "MySQL事务隔离级别详解",
              "InnoDB存储引擎对MVCC的实现",
              "SQL语句在MySQL中的执行过程",
              "MySQL查询缓存详解",
              "MySQL执行计划分析",
              "MySQL自增主键一定是连续的吗？",
              "MySQL日期类型选择建议",
              "MySQL隐式转换造成索引失效",
            ]),
          ],
        },
        {
          text: "Redis",
          prefix: "redis/",
          icon: ICONS.REDIS,
          children: [
            "缓存基础常见面试题总结",
            "Redis常见面试题总结(上)",
            "Redis常见面试题总结(下)",
            createImportantSection([
              "如何基于Redis实现延时任务？",
              "如何基于Redis实现消息队列？",
              "3种常用的缓存读写策略详解",
              "Redis 5 种基本数据类型详解",
              "Redis 3 种特殊数据类型详解",
              "Redis为什么用跳表实现有序集合",
              "Redis持久化机制详解",
              "Redis内存碎片详解",
              "Redis常见阻塞原因总结",
            ]),
          ],
        },
        {
          text: "MongoDB",
          prefix: "mongodb/",
          icon: ICONS.MONGODB,
          collapsible: true,
          children: ["MongoDB常见面试题总结（上）", "MongoDB常见面试题总结（下）"],
        },
      ],
    },
    {
      text: "开发工具",
      icon: ICONS.TOOL,
      prefix: "开发工具/",
      collapsible: true,
      children: [
        {
          text: "开发工具知识体系",
          link: "/开发工具/",
        },
        {
          text: "Maven",
          icon: ICONS.MAVEN,
          prefix: "maven/",
          children: [
            { text: "Maven 核心概念总结", link: "Maven 核心概念总结" },
            { text: "Maven 最佳实践", link: "Maven 最佳实践" },
          ],
        },
        {
          text: "Gradle",
          icon: ICONS.GRADLE,
          prefix: "gradle/",
          children: ["Gradle 核心概念总结"],
        },
        {
          text: "Git",
          icon: ICONS.GIT,
          prefix: "git/",
          children: ["Git 核心概念总结", "GitHub 实用小技巧总结"],
        },
        {
          text: "Docker",
          icon: ICONS.DOCKER,
          prefix: "docker/",
          children: ["Docker 核心概念总结", "Docker 实战"],
        },
        {
          text: "IDEA",
          icon: ICONS.IDEA,
          link: "https://gitee.com/SnailClimb/awesome-idea-tutorial",
        },
      ],
    },
    {
      text: "常用框架",
      prefix: "系统设计/框架/",
      icon: ICONS.COMPONENT,
      collapsible: true,
      children: [
        {
          text: "Spring&Spring Boot",
          icon: ICONS.SPRING_BOOT,
          prefix: "spring/",
          children: [
            "Spring常见面试题总结",
            "Spring&SpringMVC&SpringBoot常用注解总结",
            createImportantSection([
              "IoC & AOP详解（快速搞懂）",
              "Spring 事务详解",
              "Spring 中的设计模式详解",
              "SpringBoot 自动装配原理详解",
              "Async 注解原理分析",
            ]),
          ],
        },
        "mybatis/MyBatis常见面试题总结",
      ],
    },
    {
      text: "系统设计",
      icon: ICONS.DESIGN,
      prefix: "系统设计/",
      collapsible: true,
      children: [
        {
          text: "系统设计知识体系",
          link: "/系统设计/",
        },
        {
          text: "基础知识",
          prefix: "基础/",
          icon: ICONS.BASIC,
          collapsible: true,
          children: [
            "RestFul API 简明教程",
            "软件工程简明教程",
            "代码命名指南",
            "代码重构指南",
            {
              text: "单元测试指南",
              link: "单元测试到底是什么？应该怎么做？",
            },
          ],
        },
        {
          text: "认证授权",
          prefix: "安全/",
          icon: ICONS.SECURITY,
          collapsible: true,
          children: [
            "认证授权基础概念详解",
            "JWT 基础概念详解",
            "JWT 身份认证优缺点分析",
            "SSO 单点登录详解",
            "权限系统设计详解",
          ],
        },
        {
          text: "数据安全",
          prefix: "安全/",
          icon: ICONS.SECURITY,
          collapsible: true,
          children: [
            "常见加密算法总结",
            "敏感词过滤方案总结",
            "数据脱敏方案总结",
            "为什么前后端都要做数据校验？",
            "为什么忘记密码时只能重置，不能告诉你原密码？",
          ],
        },
        {
          text: "⭐设计模式常见面试题总结",
          link: "https://interview.javaguide.cn/系统设计/design-pattern.html",
        },
        "Java 定时任务详解",
        "Web 实时消息推送详解",
      ],
    },
    {
      text: "分布式",
      icon: ICONS.DISTRIBUTED,
      prefix: "分布式/",
      collapsible: true,
      children: [
        {
          text: "分布式系统知识体系",
          link: "/分布式/",
        },
        {
          text: "分布式系统入门",
          link: "分布式系统详解-核心概念、架构演进、典型特征与学习路线",
        },
        {
          text: "⭐分布式高频面试题",
          link: "2026 最新分布式系统面试题总结-CAP、Raft、RPC、分布式锁、事务与 ID",
        },
        {
          text: "理论&算法&协议",
          icon: ICONS.ALGORITHM,
          prefix: "协议/",
          collapsible: true,
          children: [
            {
              text: "理论&算法&协议专题",
              link: "/分布式/协议/",
            },
            { text: "CAP定理与BASE理论详解", link: "CAP 定理与 BASE 理论详解-一致性、可用性、分区容错与最终一致性" },
            {
              text: "分布式协调详解",
              link: "分布式协调详解-Leader、Quorum、Lease、Fencing Token 与 Gossip",
            },
            { text: "拜占庭将军问题", link: "拜占庭将军问题详解-分布式共识、3m+1 节点与 BFT 容错" },
            { text: "Paxos算法详解", link: "Paxos 算法详解-Basic Paxos、Multi-Paxos、角色流程与 Raft 对比" },
            { text: "Raft算法详解", link: "Raft 算法详解-Leader 选举、日志复制、安全性与成员变更" },
            { text: "ZAB协议详解", link: "ZAB 协议详解-ZooKeeper 原子广播、消息广播、崩溃恢复与 Leader 选举" },
            { text: "Gossip协议详解", link: "Gossip 协议详解-反熵、谣言传播、SWIM 与最终一致性" },
            { text: "一致性哈希算法详解", link: "一致性哈希算法详解-哈希环、虚拟节点、数据倾斜与分布式缓存应用" },
          ],
        },
        {
          text: "API网关",
          icon: ICONS.GATEWAY,
          children: [
            { text: "API网关基础知识总结", link: "API 网关详解-核心功能、工作原理与 Spring Cloud Gateway Kong APISIX 选型" },
            {
              text: "Spring Cloud Gateway面试题总结",
              link: "Spring Cloud Gateway 面试题总结-路由、Predicate、Filter、限流熔断与工作原理",
            },
          ],
        },
        {
          text: "分布式ID",
          icon: ICONS.ID,
          children: [
            { text: "分布式ID生成方案详解", link: "分布式 ID 生成方案详解-UUID、Snowflake、号段模式、Leaf 与 Tinyid 对比" },
            { text: "分布式ID设计实战指南", link: "分布式 ID 设计实战-订单号、优惠券、一码付与业务 ID 生成策略" },
          ],
        },
        {
          text: "分布式锁",
          icon: ICONS.LOCK,
          children: [
            { text: "分布式锁入门介绍", link: "分布式锁入门-为什么需要分布式锁、锁粒度、超时续约与应用场景" },
            {
              text: "分布式锁常见实现方案总结",
              link: "分布式锁实现方案详解-Redis、Redlock、ZooKeeper 与 Redisson 看门狗",
            },
          ],
        },
        {
          text: "分布式事务",
          icon: ICONS.TRANSACTION,
          children: [
            { text: "分布式事务解决方案总结", link: "分布式事务解决方案详解-XA、AT、TCC、Saga、本地消息表与事务消息" },
          ],
        },
        {
          text: "分布式配置中心",
          icon: ICONS.MAVEN,
          children: [
            {
              text: "分布式配置中心面试题总结",
              link: "分布式配置中心详解-Apollo、Nacos、Spring Cloud Config 与 K8s ConfigMap 对比",
            },
          ],
        },
        {
          text: "RPC",
          prefix: "rpc/",
          icon: ICONS.RPC,
          collapsible: true,
          children: [
            { text: "RPC专题", link: "/分布式/rpc/" },
            { text: "RPC基础知识总结", link: "RPC 远程过程调用详解-原理、调用流程、序列化协议与框架选型" },
            { text: "Dubbo面试题总结", link: "Dubbo 面试题总结-架构原理、SPI、负载均衡、服务治理与集群容错" },
          ],
        },
        {
          text: "ZooKeeper",
          prefix: "分布式流程协调/zookeeper/",
          icon: ICONS.FRAMEWORK,
          collapsible: true,
          children: [
            {
              text: "ZooKeeper专题",
              link: "/分布式/分布式流程协调/zookeeper/",
            },
            { text: "ZooKeeper入门指南", link: "ZooKeeper 入门指南-核心概念、ZNode、Watcher、ACL 与典型应用场景" },
            { text: "ZooKeeper进阶详解", link: "ZooKeeper 进阶详解-ZAB 协议、Leader 选举、集群部署与会话机制" },
            { text: "ZooKeeper实战教程", link: "ZooKeeper 实战教程-Docker 部署、zkCli 命令、四字命令与 Curator 客户端" },
          ],
        },
      ],
    },
    {
      text: "高性能",
      icon: ICONS.PERFORMANCE,
      prefix: "高性能/",
      collapsible: true,
      children: [
        {
          text: "高性能系统知识体系",
          link: "/高性能/",
        },
        {
          text: "⭐高性能系统设计高频面试题",
          link: "高性能系统设计面试题总结-缓存、读写分离、分库分表、负载均衡、消息队列",
        },
        {
          text: "CDN",
          icon: ICONS.CDN,
          children: ["CDN工作原理详解"],
        },
        {
          text: "负载均衡",
          icon: ICONS.LOAD_BALANCING,
          children: [
            { text: "负载均衡原理及算法详解", link: "负载均衡原理及算法详解" },
          ],
        },
        {
          text: "数据库优化",
          icon: ICONS.MYSQL,
          children: [
            "读写分离和分库分表详解",
            "数据冷热分离详解",
            "常见SQL优化手段总结",
            "深度分页介绍及优化建议",
          ],
        },
        {
          text: "消息队列",
          prefix: "消息队列/",
          icon: ICONS.MQ,
          collapsible: true,
          children: [
            "消息队列基础知识总结",
            "Disruptor常见问题总结",
            "Kafka常见问题总结",
            "RocketMQ 常见问题总结",
            "RabbitMQ 常见问题总结",
          ],
        },
      ],
    },
    {
      text: "高可用",
      icon: ICONS.HIGH_AVAILABLE,
      prefix: "高可用/",
      collapsible: true,
      children: [
        {
          text: "高可用系统知识体系",
          link: "/高可用/",
        },
        {
          text: "⭐高可用系统面试题总结",
          link: "高可用系统设计面试题总结-限流、熔断、重试、幂等、容灾与压测",
        },
        {
          text: "高可用系统设计指南",
          link: "高可用系统设计详解-SLA、限流熔断、降级容灾、缓存与灰度发布",
        },
        {
          text: "⭐接口幂等方案总结",
          link: "接口幂等性设计详解-幂等键、Token、唯一索引、去重表与支付回调",
        },
        {
          text: "⭐服务限流详解",
          link: "服务限流详解-固定窗口、滑动窗口、令牌桶、漏桶与分布式限流",
        },
        {
          text: "⭐超时和重试机制详解",
          link: "超时和重试机制详解-超时设置、指数退避、随机抖动、重试风暴与幂等",
        },
        {
          text: "服务降级与熔断详解",
          link: "服务降级与熔断详解-Fallback、熔断器状态机与 Sentinel Hystrix Resilience4j 选型",
        },
        {
          text: "冗余设计详解",
          link: "冗余设计详解-RTORPO、高可用集群、同城灾备与异地多活",
        },
        {
          text: "性能测试入门",
          link: "性能测试和压力测试入门-RPS、QPS、TPS、P99 与压测工具",
        },
      ],
    },
  ],
});
