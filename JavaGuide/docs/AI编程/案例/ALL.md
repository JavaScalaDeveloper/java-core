---
title: 案例 ALL
---

# 案例

> Aggregate of markdown under this directory (excludes README.md, TODO.md).


---

<!-- source: Claude Code 接入第三方模型实战-JVM 智能诊断与慢查询治理.md -->

---
title: Claude Code 接入第三方模型实战：JVM 智能诊断与慢查询治理
description: 通过 Claude Code 接入 GLM-5.1 模型，完成 JVM 智能诊断助手从零搭建和百万级数据量慢查询治理两个实战任务，分享 AI 辅助编程的工作方法与踩坑经验。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Claude Code,AI编程,GLM-5.1,JVM诊断,慢查询优化,AI辅助开发,Arthas,Agent,Spring AI
---

大家好，我是小 G。前面分享过 [IDEA 搭配 Qoder 插件的实战](./IDEA + Qoder 插件多场景实战-接口优化与代码重构.md)和 [Trae 接入大模型的实战](./Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构.md)，分别覆盖了 JetBrains 体系和 VS Code 体系下的 AI 辅助编码。这篇换个角度，聊聊 **Claude Code 接入第三方模型** 的实战体验。

Claude Code 本身是 Anthropic 官方的 CLI 编码工具。部分服务商通过 Anthropic 兼容接口和环境变量提供第三方模型接入，但兼容程度、可用功能和数据处理方式由服务商决定，不能默认与 Claude 模型完全一致。本文记录的是 GLM-5.1 当时的使用过程。

目前，GLM-5.2 也发布了，后续还会发布更新的模型。不过，接入方法以及编码实战都是一致的，不受模型影响。

我选了两个比较有代表性的复杂场景来验证：

- **场景一**：从零搭建一个基于 Arthas 的 JVM 智能诊断 Agent，涵盖技术选型、架构设计、编码落地的完整流程
- **场景二**：在百万级数据量的既有订单系统中定位并治理慢查询，考验 AI 对现有代码库的理解和增量优化能力

一个是从零开始的工程交付，另一个是面对既有系统的性能治理，正好覆盖 AI 辅助编程的两种典型工作模式。

## 环境准备：Claude Code 接入第三方模型

在正式开始之前，需要完成 Claude Code 与第三方模型的对接。整个配置过程分三步：

**第一步**：安装 Claude Code

```bash
npm i -g @anthropic-ai/claude-code@latest
```

**第二步**：安装 cc-switch 完成模型切换（macOS 用户可通过 homebrew 安装，详情参考 cc-switch 官方文档：<https://github.com/farion1231/cc-switch/blob/main/README_ZH.md>）

**第三步**：按照模型提供方的说明，完成 Claude Code 内部模型环境变量与目标模型的对应关系配置。以 GLM-5.1 为例，参考：<https://docs.bigmodel.cn/cn/coding-plan/tool/claude>

配置过程截图如下：

点击加号添加模型：

![点击添加模型](https://oss.javaguide.cn/ai/coding/glm5.1-cc/add-model-entry.png)

选择对应的模型：

![选择模型](https://oss.javaguide.cn/ai/coding/glm5.1-cc/select-model.png)

配置参数：

![配置参数](https://oss.javaguide.cn/ai/coding/glm5.1-cc/config-params.png)

Claude Code 内部模型环境变量与目标模型对应关系的 JSON 配置：

![Claude Code 内部模型环境变量与模型对应关系 JSON 配置](https://oss.javaguide.cn/ai/coding/glm5.1-cc/model-env-json-config.png)

如果你更偏向页面开发，推荐通过 VSCode + Claude Code for VS Code 方式进行交互和编码验收。完成插件安装之后，可以直接在 IDE 中与模型对话和代码审查，相对于 CLI 界面会更直观一些：

![VSCode + Claude Code for VS Code](https://oss.javaguide.cn/ai/coding/glm5.1-cc/vscode-claude-code.png)

## 场景一：从零搭建 JVM 智能诊断 Agent

### 为什么需要 JVM 智能诊断助手？

JVM 线上诊断一直以来都是 Java 开发最棘手的问题。在传统开发模式下，面对性能瓶颈或线上故障，研发人员的排查路径基本固定：

1. 查看 Grafana 监控面板，初步定位异常方向
2. 登录线上服务器，排查 CPU、内存、GC 等各项指标
3. 明确 Java 应用层面的问题后，启动 Arthas 执行一系列诊断指令，逐步缩小问题范围
4. 定位到具体代码段，分析根因并制定修复方案

在 AI 出现以前，这套流程虽然繁琐，但确实是最直接有效的手段。但随着业务越来越复杂，故障响应时效要求也越来越高，传统模式的弊端越来越明显：

- **监控指标过于主观**：面对 CPU 飙升、内存泄漏、OOM 等千奇百怪的问题，监控面板上的指标繁多，研发人员往往依赖经验做主观推断，缺乏系统化的诊断方法论
- **诊断链路过于冗长**：从 Grafana 面板到线上服务器再到 Arthas 诊断，整个排查链路涉及多个工具的切换和衔接，不仅耗时，对于紧急的线上故障止血来说显得非常低效
- **高度依赖工程师经验**：Arthas 确实是一款强大的 JVM 诊断利器，内置各种增强指令可以深入字节码查看运行时细节。但代价是开发人员必须熟悉各种指令参数和推理路径，才能准确完成问题定位

随着 Agent 和 Skill 等能力逐渐成熟，笔者有了一个工程化构想：把诊断经验整理成可审计的步骤，让 AI 根据故障现象选择只读诊断流程，收集证据并生成候选原因。连接生产实例、执行命令和确认根因仍需要明确的权限与人工控制，不能只由“服务名 + 故障表象”驱动。

### 需求交付与架构设计

有了构想之后，接下来就是技术选型和方案落地。笔者将完整的需求描述交给 AI：

```bash
研发一款基于Arthas的智能体诊断工具，该工具需实现以下核心功能：
1. 当用户输入线上故障服务名称及具体故障现象后，系统能够自动定位至目标故障服务器，主动对目标服务进行实时监控与深度分析。
2. 通过集成Arthas的反编译功能，精准定位到引发故障的具体代码段
3. 基于分析结果生成包含问题根因、代码修复建议及实施步骤的完整解决思路。

请提供该工具的技术选型方案，包括但不限于开发语言（优先考虑Java技术栈）、核心框架、数据库表设计、部署架构等，并设计详细的系统实现方案，涵盖功能模块划分、数据流程设计、关键技术难点及解决方案等内容。
```

AI 收到需求后，没有立刻开始写代码，而是先根据空项目整理出一份分阶段技术方案。它适合用来生成待评审的路径，但方案是否安全、是否符合现有运维体系，仍要由开发和运维人员确认。

![AI 自主完成技术方案规划](https://oss.javaguide.cn/ai/coding/glm5.1-cc/ai-tech-plan.png)

AI 结合需求，针对 Agent 拆解出技术选型和 Arthas 集成方案的检索。从检索关键字可以看出，它在方案选取上优先考虑成熟稳定的解决方案：

![AI 检索 Agent 技术选型和 Arthas 集成方案](https://oss.javaguide.cn/ai/coding/glm5.1-cc/agent-arthas-integration-research.png)

AI 检索 Arthas 官方文档后，输出了下面这份系统架构设计图。从上到下分三层：用户层输入服务名和故障现象，Agent 层由 Skill 引擎、Arthas HTTP Client 和 AI 分析引擎协同工作，最底层通过 Arthas HTTP API 对接目标服务实例。这张图覆盖了主要业务模块，但没有画出认证、审批、命令策略和审计等生产控制面，后文会单独补充：

![AI 输出的系统架构设计图](https://oss.javaguide.cn/ai/coding/glm5.1-cc/system-architecture-design.png)

AI 给出了架构图之后，还进一步拆解了 6 个核心组件的职责分工——从 AI Agent Server 的流程编排，到 Arthas HTTP Client 的会话管理，到 Skill 引擎的诊断步骤链定义，再到 AI 分析引擎的报告生成，每个组件的边界和协作关系都交代得比较清楚：

![AI 输出的核心角色分工表](https://oss.javaguide.cn/ai/coding/glm5.1-cc/core-component-roles.png)

最后看数据流设计。AI 结合一个常见的 RT 超时场景，给出了从 Skill 匹配、诊断步骤执行到报告输出的链路。这里采用的 `init_session → async_exec → pull_results → interrupt_job → close_session` 会话流程与 [Arthas HTTP API](https://arthas.aliyun.com/doc/http-api.html) 的异步作业模型一致，可以管理持续输出的异步命令。`watch`、`trace` 等命令会增强目标类，不能因为“不修改业务数据”就当作普通只读查询。评审重点不应停留在“这个 API 是否由 AI 编造”，而应继续检查命令分级、会话清理、超时和安全控制：

![AI 输出的数据流设计](https://oss.javaguide.cn/ai/coding/glm5.1-cc/data-flow-design.png)

Arthas HTTP API 可以直接接收诊断命令，官方也提供了[认证配置](https://arthas.aliyun.com/doc/auth.html)。因此，这个 Agent 在进入生产环境前至少需要补齐以下控制：

1. **身份与网络边界**：启用 Arthas 认证，把诊断入口放在隔离网络内；Agent 使用独立服务身份和最小权限凭据，不能把账号、口令交给模型。
2. **目标实例白名单**：服务名只能解析到经过登记的实例，禁止用户或模型传入任意 IP、端口和 URL；生产与测试环境使用不同凭据和策略。
3. **命令白名单**：默认只开放经过评审、不会做字节码增强的只读诊断模板。类名、方法名等动态参数必须按类型和长度校验，禁止把模型生成的字符串直接作为 Arthas 命令执行。
4. **高风险操作审批**：`watch`、`trace`、`tt` 等动态增强命令默认禁用。确需执行时使用受审模板并走人工审批，限制执行次数、最大运行时间、采样范围和输出量；OGNL 表达式只能从白名单模板生成，任务结束后确认增强已撤销。其他可能改变运行状态、产生高负载或暴露敏感数据的操作同样需要短时授权和双人复核。
5. **资源保护**：为每个实例设置超时、并发上限、速率限制和熔断；持续型命令必须设置最大运行时间，并保证 `interrupt_job` 与 `close_session` 在异常路径也会执行。
6. **审计与脱敏**：记录发起人、目标实例、模板、实际参数、开始/结束时间和结果摘要；日志、反编译代码和报告进入模型前先做密钥、个人信息和业务数据脱敏。

扩展方向也应受同一边界约束。比如“告警联动”可以自动创建诊断任务，但不应绕过审批自动执行任意命令；“自动修复补丁”只能生成候选 Diff，不能直接修改生产实例。

![AI 给出的后续扩展建议](https://oss.javaguide.cn/ai/coding/glm5.1-cc/extension-suggestions.png)

### 编码交付与工程结构

确认方案没有问题后，笔者直接下达开发指令：

```bash
整体方案没有问题，请完成开发工作吧
```

AI 收到指令后，开始自主编码。按照之前的架构设计，逐模块推进——从父 POM 和 Maven 多模块骨架搭建，到通用工具类、数据模型、数据访问层、Arthas 客户端封装、Skill 引擎、AI 分析引擎、业务逻辑层、Web 控制器，直到启动模块和部署配置，11 个子步骤全部完成：

![AI 自主编码过程](https://oss.javaguide.cn/ai/coding/glm5.1-cc/ai-coding-process.png)

片刻之后，AI 生成了 9 个模块、46 个文件的候选实现，覆盖通用工具类、7 个诊断 Skill、Arthas HTTP API 客户端和 Spring AI Alibaba 分析器。文件数量只能说明交付范围，不能说明安全性和正确性：

![AI 完成编码后输出的交付清单](https://oss.javaguide.cn/ai/coding/glm5.1-cc/delivery-checklist.png)

先看整体模块结构，AI 按照 Java 多模块的标准规范完成了工程划分，从上到下严格遵循 common→model→dal→client→skill→ai→service→web→bootstrap 的依赖层级，命名规范统一。

agent-skill 模块值得关注，AI 设计了 Skill 引擎的抽象接口，并内置了 7 个覆盖常见 JVM 故障场景的诊断技能（CPU 飙高、OOM、死锁、慢接口、GC 异常、线程泄漏、类找不到），每个 Skill 都定义了完整的诊断步骤链。这种“框架 + 内置实现”的设计思路，扩展性不错：

```bash
jvm-ai-agent/
├── jvm-ai-agent-server/                 # 智能体服务端（核心）
│   ├── agent-common/                    # 通用模块：工具类、常量、DTO
│   ├── agent-model/                     # 数据模型：实体、数据库映射
│   ├── agent-dal/                       # 数据访问层：Mapper、Repository
│   ├── agent-arthas-client/             # Arthas HTTP API 客户端封装
│   ├── agent-skill/                     # Skill 引擎（诊断方法论）
│   ├── agent-ai/                        # AI 分析引擎
│   ├── agent-service/                   # 业务逻辑层（含服务实例查询）
│   ├── agent-web/                       # Web 层：REST API、WebSocket
│   └── agent-server-bootstrap/          # 启动模块
│
└── pom.xml                              # 父 POM
```

再看诊断核心逻辑，`executeDiagnosis` 按照 Skill 匹配、实例定位、诊断链执行、结果分析和报告生成推进。原实现还允许从 Arthas 输出提取变量并拼接后续命令；生产实现必须把命令固定在受审模板中，只允许校验后的变量替换。所谓“非关键步骤失败后继续”也要逐项定义，认证失败、目标不在白名单、超时和审计失败都不能静默跳过：

1. **Skill 匹配**：通过`DefaultSkillMatcher`根据故障现象关键词匹配最佳诊断技能
2. **实例定位**：通过`ServiceInstanceLocator`根据服务名解析目标实例 IP 和 Arthas 端口
3. **诊断链执行**：遍历经过审批的只读诊断模板，依次执行 Arthas 命令并收集结果
4. **受限参数替换**：从结果中提取类名、方法名等变量，完成格式、长度和允许范围校验后，才能注入后续模板
5. **AI 分析报告**：将全部诊断数据交给 AI 分析引擎，生成包含根因、修复建议、严重程度的结构化报告

```java
private void executeDiagnosis(DiagnosisRecord record, DiagnosisRequest request) {
    try {
        // 1. 匹配 Skill
        Optional<SkillDefinition> skillOpt = skillMatcher.findBestMatch(request.getSymptom());
        if (skillOpt.isEmpty()) {
            failDiagnosis(record, "无法匹配到合适的诊断技能");
            return;
        }
        SkillDefinition skill = skillOpt.get();
        // ......

        // 2. 定位目标实例
        ServiceRegistry instance = instanceLocator.resolveInstance(
                request.getServiceName(), request.getInstanceIp());
        // ......

        // 3. 执行诊断步骤链
        List<DiagnosticStep> chain = skill.getDiagnosticChain();
        StringBuilder allDiagnosticData = new StringBuilder();
        String decompiledCode = "";
        Map<String, String> contextVars = new HashMap<>();

        for (int i = 0; i < chain.size(); i++) {
            DiagnosticStep step = chain.get(i);
            // ...... 初始化步骤实体

            try {
                // 只解析预先审核的命令模板；变量必须经过类型和白名单校验
                String command = resolveCommand(step, contextVars);
                // ......

                // 执行Arthas命令并记录耗时
                String result = executeStep(host, port, step, command);

                // 如果是 jad 结果，记录为反编译代码
                if ("jad".equals(step.getResultType())) {
                    decompiledCode = result;
                }

                // 从结果中提取上下文变量供后续步骤使用
                extractContextVars(result, contextVars);
            } catch (Exception e) {
                // 仅允许明确标记为非关键的只读步骤失败后继续
                // ......
            }
        }

        // 4. AI 分析
        String report = diagnosisAnalyzer.analyze(
                request.getSymptom(), allDiagnosticData.toString(), decompiledCode, skill);

        // 5. 保存报告（从Markdown报告中提取根因、严重程度等结构化字段）
        // ......

        // 6. 更新诊断记录状态
        record.setStatus(DiagnosisStatus.COMPLETED.getCode());
        // ......
    } catch (Exception e) {
        failDiagnosis(record, e.getMessage());
    }
}
```

### Agent 交互页面集成

在 AI 编码期间，笔者查阅了 Spring AI Alibaba 的官方文档，发现它提供了现成的 Agent Chat UI。与其让 AI 从头生成前端页面，不如直接集成这个交互组件，实现 SSE 流式输出的诊断体验。于是笔者给了一条简短的指令：

```bash
根据 Spring AI Alibaba 官方文档（参考链接 https://java2ai.com/docs/frameworks/studio/quick-start/），实现 Agent 智能体交互页面开发工作
```

只给了一个文档链接和一句话，AI 就自己去读官方文档、理解集成步骤、完成了页面开发。这也是使用 AI 辅助编程的一个实用技巧：当你只需要集成某个现成组件时，直接给出文档链接往往比详细描述需求更高效。

![AI 完成 Agent Chat UI 页面集成](https://oss.javaguide.cn/ai/coding/glm5.1-cc/agent-chat-ui-integration.png)

到这里，本地演示所需的主要链路已经生成。它还不是可以直接部署到生产的诊断平台；除了功能测试，还要补齐前述安全控制、故障注入和负载保护。为了验证基本流程，笔者在本地起了一个 CPU 飙升的测试接口：

```java
@Slf4j
@RestController
public class TestController {
    @RequestMapping("cpu-100")
    public  void cpu() {
        while (true){
        }
    }
}
```

启动 Agent 服务，访问 `http://localhost:{应用端口}/chatui/index.html`，在聊天框输入：`order-service 程序CPU飙升,请协助排查`。在这个本地受控样例中，Agent 先通过 Dashboard 获取概览，再根据线程栈定位代码，并用 `jad` 输出反编译结果，最后生成诊断报告。报告是待复核结论，不能仅凭模型输出直接处置线上故障：

![Agent 诊断效果演示](https://oss.javaguide.cn/ai/coding/glm5.1-cc/agent-diagnosis-demo.png)

## 场景二：百万级数据量下的慢查询治理

场景一验证的是 AI“从 0 到 1 的规划与交付能力”，那场景二要验证的就是另一个维度：**在一个已有一定复杂度的代码库中，AI 能否准确理解既有架构、定位问题、并完成增量优化。**

### 问题定位：搜索接口耗时 18 秒

这是一个基于 Spring Boot + MyBatis 的订单查询服务（glm-testing-service），核心业务围绕订单的查询和分析展开，包含四个接口：

| 接口         | 路径                           | 说明                                 |
| ------------ | ------------------------------ | ------------------------------------ |
| 用户订单查询 | POST /api/orders/user          | 按用户 ID 查询订单列表，支持状态筛选 |
| 订单搜索     | POST /api/orders/search        | 按时间区间+金额+商品关键词搜索订单   |
| 品类销售统计 | GET /api/orders/category-stats | 按订单状态统计各品类销售汇总         |
| 组合条件筛选 | POST /api/orders/filter        | 按用户+多状态+多品类组合筛选         |

数据库中灌入了百万级测试数据，对应的表结构如下：

```sql
CREATE TABLE `orders` (
    `id`           BIGINT PRIMARY KEY AUTO_INCREMENT,
    `order_no`     VARCHAR(64)  NOT NULL,
    `user_id`      BIGINT       NOT NULL,
    `status`       TINYINT      NOT NULL DEFAULT 0,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `product_name` VARCHAR(256) NOT NULL,
    `category`     VARCHAR(64)  NOT NULL,
    `create_time`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_category` (`category`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

项目通过 AOP 切面自动记录每个接口的执行耗时，用于快速定位性能瓶颈：

```java
@Around("controllerPointcut()")
public Object printExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
    long startTime = System.currentTimeMillis();
    Object result = joinPoint.proceed();
    long costTime = System.currentTimeMillis() - startTime;
    log.info("[{}] {}.{} 耗时: {}ms", Thread.currentThread().getName(), className, methodName, costTime);
    return result;
}
```

向数据库灌入百万级测试数据后，对搜索订单接口进行压测。该接口涉及关键词模糊匹配+时间区间+金额过滤的组合查询，例如下面这个搜索请求：

```bash
curl -X POST http://localhost:8080/api/orders/search \
  -H "Content-Type: application/json" \
  -d '{"startTime": "2025-01-01", "endTime": "2026-12-31", "minAmount": 500, "productName": "蓝牙", "pageNum": 1, "pageSize": 10}'
```

系统日志直接输出了刺眼的慢查询告警：

```bash
[http-nio-8080-exec-1] OrderController.searchOrders 耗时: 18375ms
```

`LIKE '%蓝牙%'`的全表扫描导致接口耗时近 18 秒，当前业务接口的实现性能完全无法满足线上要求：

![搜索接口耗时 18 秒的调测结果](https://oss.javaguide.cn/ai/coding/glm5.1-cc/search-api-18s-result.png)

### 分析与优化方案设计

笔者直接将系统日志中的慢查询告警丢给 AI，让其结合项目既有代码完成推理分析和优化方案设计：

```bash
针对系统日志中记录的"[http-nio-8080-exec-1] OrderController.searchOrders 耗时: 18375ms"这一慢查询接口问题，对订单业务进行全面梳理分析并提供优化建议。
```

AI 定位到目标业务代码，结合 SQL 和表结构，从索引设计维度给出了系统性的解决方案：

![AI 给出的慢查询解决方案](https://oss.javaguide.cn/ai/coding/glm5.1-cc/slow-query-solution.png)

同时给出了分阶段优化建议和预期效果：

![AI 给出的分阶段优化建议](https://oss.javaguide.cn/ai/coding/glm5.1-cc/phased-optimization-suggestions.png)

确认方向没问题后，笔者给出最终优化指令：

```bash
请结合项目现有技术栈，对慢查询模块进行系统性优化
```

AI 逐个梳理了每个接口的业务逻辑和查询细节。优化步骤自底向上，从数据库层面推进到应用层面，方案涵盖以下几个关键点：

**数据库层面**——AI 给出的 5 个候选索引：

- 全文索引`ft_product_name`（ngram 解析器，支持中文分词）替代`LIKE '%xxx%'`全表扫描
- 复合索引`idx_create_time_amount`尝试支持时间、金额过滤与排序
- 候选覆盖索引`idx_search_covering`尝试减少 COUNT 查询的回表
- 组合索引`idx_user_status_category`优化多条件筛选
- 覆盖索引`idx_status_category_amount`优化品类聚合统计

```sql
ALTER TABLE `orders` ADD FULLTEXT INDEX `ft_product_name` (`product_name`) WITH PARSER ngram;
ALTER TABLE `orders` ADD INDEX `idx_create_time_amount` (`create_time` DESC, `total_amount`);
ALTER TABLE `orders` ADD INDEX `idx_search_covering` (`create_time`, `total_amount`, `product_name`);
ALTER TABLE `orders` ADD INDEX `idx_user_status_category` (`user_id`, `status`, `category`);
ALTER TABLE `orders` ADD INDEX `idx_status_category_amount` (`status`, `category`, `total_amount`);
```

**应用层面**——SQL 和 Service 层同步优化：

- 将`LIKE '%xxx%'`搜索语义迁移为`MATCH ... AGAINST`全文检索
- 深分页场景自动切换延迟关联（Deferred Join），通过覆盖索引子查询先定位主键再回表
- 按需 COUNT：默认不查总数，仅前端显式传`needTotal=true`时才执行

下面是 AI 输出的索引优化方案。复合索引是否有效取决于最左前缀、过滤选择性、排序方式和优化器选择；全文索引也会增加写入与存储成本。执行 DDL 前应使用真实 SQL 和数据分布运行 `EXPLAIN ANALYZE`，并删除功能重叠或收益不足的索引。可参考 [MySQL 多列索引](https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html)与 [ngram 全文索引](https://dev.mysql.com/doc/refman/8.4/en/fulltext-search-ngram.html)文档：

![AI 输出的索引优化 SQL 脚本](https://oss.javaguide.cn/ai/coding/glm5.1-cc/index-optimization-sql.png)

从代码 diff 可以看到，AI 在既有代码中将`LIKE`模糊查询替换为全文检索。这不是透明的性能替换：分词、停用词、短词、子串匹配和默认排序都可能变化。上线前要用真实搜索样本验收中文分词、短词、特殊字符和排序结果，并为需要保留的旧语义设计兼容路径：

![AI 在既有代码中完成增量优化](https://oss.javaguide.cn/ai/coding/glm5.1-cc/incremental-code-optimization.png)

对于深分页的问题，AI 结合当前百万级数据量给出了具体的分页阈值——当 offset 超过 1000 时自动切换为延迟关联查询（Deferred Join），浅分页走普通查询，深分页走覆盖索引子查询先定位主键再回表：

```java
/** 深分页阈值：offset 超过此值时自动切换为延迟关联查询 */
private static final int DEEP_PAGE_THRESHOLD = 1000;

// 深分页（offset > 1000）走延迟关联，浅分页走普通查询
boolean isDeepPage = offset > DEEP_PAGE_THRESHOLD;
List<Order> orders;
if (isDeepPage) {
    orders = orderMapper.searchOrdersDeepPage(...);
} else {
    orders = orderMapper.searchOrders(...);
}
```

`1000` 只是这次生成的初始阈值，不能因为数据量是百万级就认定它合理。行宽、过滤选择性、索引覆盖、排序方式和接口 SLO 都会影响拐点；应分别压测不同 offset，观察扫描行数和 p95/p99，再确定是否切换延迟关联。若产品允许，基于稳定排序键的游标分页通常更值得优先评估。

![AI 针对深分页场景基于阈值自动切换查询策略的代码实现](https://oss.javaguide.cn/ai/coding/glm5.1-cc/deep-pagination-threshold-code.png)

全部优化完成后，AI 输出了最终的优化效果总结，涵盖各接口的优化前后对比：

![AI 输出的最终优化效果总结](https://oss.javaguide.cn/ai/coding/glm5.1-cc/optimization-summary.png)

### 优化效果验证

完成改造后再次请求接口，这张截图记录到一次预热后的耗时低于 300ms；与原先的 18375ms 相比，这一次请求约快 60 倍。单个前后截图不能证明“稳定低于 300ms”：要形成可复现结论，还需说明硬件、MySQL 版本与配置、数据分布、缓存冷热、并发量和样本数，并报告 p50/p95/p99 与错误率。

![优化后接口耗时降至 300ms 以内](https://oss.javaguide.cn/ai/coding/glm5.1-cc/optimized-api-300ms.png)

## 实战总结

通过两个场景的实战，总结一下 Claude Code + 第三方模型辅助编程的经验和思考。

### AI 辅助编程能做什么

| 能力维度         | 场景表现                                            | 说明                                     |
| ---------------- | --------------------------------------------------- | ---------------------------------------- |
| 需求到架构的规划 | 场景一：给出需求描述，AI 自主完成技术选型和架构设计 | 适合快速验证构想，但方案仍需人工评审     |
| 端到端编码交付   | 场景一：9 个模块 46 个文件自主交付                  | 从骨架搭建到业务逻辑，减少重复编码工作量 |
| 既有代码增量优化 | 场景二：在百万级数据量的项目中定位慢查询并优化      | 能结合表结构和 SQL 给出分阶段优化方案    |
| 参数候选生成     | 场景二：结合数据量给出分页阈值初值                  | 阈值仍需基准测试和执行计划验证           |

### 实战中需要注意的地方

**做得好的地方**：

- **快速形成评审材料**：场景一中，模型较快生成了技术方案和架构草图，适合作为评审起点
- **多层级方案输出**：慢查询场景中，数据库层面的索引优化和应用层面的 SQL 重构同步推进，覆盖比较全面
- **给出可测试的参数**：场景二给出了深分页阈值初值，后续可以据此设计基准测试

**需要注意的地方**：

- **生产安全需要单独设计**：Arthas 会话流程本身有官方依据，真正不能遗漏的是认证、实例与命令白名单、审批、限流和审计
- **长链路执行中偶尔断链**：在复杂的持续编码任务中，AI 有时会在后半程遗忘前面的设计约束。建议将复杂任务拆分成明确的阶段，每个阶段独立确认
- **代码风格与工程规范**：生成的代码结构合理，但与个人/团队既有规范的契合度需要磨合。场景一中有部分命名和文件组织就需要手动调整
- **方案选择的权衡**：AI 会给出多个方案，但不会替你做权衡。比如场景二中全文索引 vs ES 的选择、延迟关联 vs 游标分页的取舍，这些需要根据业务场景判断

### 使用 Claude Code + 第三方模型的一些建议

1. **需求描述要具体**：场景一中完整的需求 prompt 直接决定了架构方案的质量，模糊的需求只会得到模糊的方案
2. **分阶段确认**：复杂项目不要一次性让 AI 从头到尾生成，技术选型 → 架构设计 → 编码实现，每个阶段独立评审
3. **关键决策人工把控**：架构层面的选择（如缓存策略、分页方案）需要根据业务场景判断，AI 无法替你做
4. **善用文档链接**：当需要集成某个现成组件时（如场景一的 Spring AI Alibaba），直接给出文档链接比详细描述需求更高效

## 写在最后

Claude Code 接入第三方模型后，在 Agent 模式下的上下文理解、任务拆解、代码生成形成了比较完整的工作流。两个场景跑下来，AI 辅助编程确实能缩短“从想法到代码”的时间。

但工具终究只是工具。回顾本文的两个场景：

- **场景一中的 JVM 智能诊断 Agent**，需要理解 Arthas 会话生命周期和 JVM 诊断方法论，更要把生产权限边界设计清楚。模型只能生成候选步骤，不能获得任意目标和任意命令的执行权。

- **场景二中的慢查询治理**，需要对 MySQL 索引原理、全文检索机制、深分页优化策略有深入理解，才能判断 AI 给出的优化方案是否适用于你的业务场景——比如全文索引在写入频繁的场景下可能带来性能损耗，延迟关联的阈值需要根据实际数据量调整。

AI 编程工具正在改变开发者的工作方式——从“写代码的人”变成“评审代码的人”。用好 AI 的前提，是比 AI 更懂你在做什么。

## 参考

- GLM Coding Plan 模型切换说明：<https://docs.bigmodel.cn/cn/coding-plan/using5-1>
- Claude Code 安装指南：<https://docs.anthropic.com/en/docs/claude-code>
- cc-switch 模型切换工具：<https://github.com/farion1231/cc-switch>
- Spring AI Alibaba Agent Chat UI 文档：<https://java2ai.com/docs/frameworks/studio/quick-start/>
- Arthas 官方文档：<https://arthas.aliyun.com/doc/>
- Arthas HTTP API：<https://arthas.aliyun.com/doc/http-api.html>
- Arthas 认证配置：<https://arthas.aliyun.com/doc/auth.html>


---

<!-- source: DeepSeek V4 + Claude Code 实战-代码能力深度测评.md -->

---
title: DeepSeek V4 + Claude Code 实战：代码能力深度测评
description: 深入体验 DeepSeek V4 与 Claude Code 的集成，实测代码审计、数据库迁移、模型升级等多个场景，评估 V4-Pro 和 V4-Flash 的真实代码能力。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: DeepSeek V4,Claude Code,AI编程,代码审计,Agent Coding,V4-Pro,V4-Flash
---

<!-- @include: @article-header.snippet.md -->

2026 年 4 月 24 日，DeepSeek 发布并开源了 V4 Preview。技术报告和社区测试很多，但我更关心它放进真实代码库后的表现。

开源模型在对话和写作上已经做得相当成熟，各家你追我赶，迭代速度肉眼可见。但 Agent Coding 是另一回事。

让模型自主分析项目结构、理解多文件依赖、给出能落地的工程方案，对代码能力和工具调用稳定性都有要求。

之前各家模型在这个方向上一直在进步，但实际用过就知道，离“放心交给它独立完成”始终还差那么一点。

所以这次 V4 发布，小 G 第一反应就是直接接入 Claude Code 上手干活。

这篇文章记录四部分内容：

1. **Claude Code 接入 DeepSeek V4 的两种方式**：配置文件法 + CC Switch 可视化切换
2. **五个真实开发任务的实战记录**：V4-Pro 干起活来到底怎么样
3. **DeepSeek V4-Pro 和 Flash 的核心参数与定价**：值不值得切
4. **场景建议**：什么时候该用，什么时候先观望

## Claude Code 接入 DeepSeek V4

Claude Code 的工具链比较成熟，但官方模型的 API 成本不低。DeepSeek V4 提供了 **Anthropic 兼容接口**，Claude Code 可以直接对接，不需要额外的协议转换服务。不过，兼容接口不等于完整复刻 Anthropic 模型能力，工具调用、上下文和新功能仍要按实际任务验证。

### 方式一：配置文件法（推荐）

如果你本机没有安装 Claude Code 的话，先运行下面这行命令安装（Node.js 18+）：

```bash
npm install -g @anthropic-ai/claude-code
```

编辑或新增 Claude Code 配置文件 `~/.claude/settings.json`，添加 `env` 字段，把后端地址、模型和 API Key 都写进去：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_deepseek_api_key",
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

注意替换 `your_deepseek_api_key` 为你的 DeepSeek API Key。

API Key 创建地址：<https://platform.deepseek.com/> 。

![DeepSeek 创建 API Key](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-api-keys.png)

这里的 `[1m]` 用于请求 V4 Pro 的 1M 上下文版本。日常任务如果想优先使用 Flash，可以把 `ANTHROPIC_MODEL` 改为 `deepseek-v4-flash`；模型 ID 和映射方式以 [DeepSeek 官方接入文档](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)为准。

配置完成后启动 Claude Code：

```bash
claude
```

首次启动需要选择信任当前文件夹。

### 方式二：CC Switch（可视化切换）

如果你想在 DeepSeek、Claude、MiniMax 等多个 Provider 之间灵活切换，推荐安装 **CC Switch**。这是一个专门管理 Claude Code 模型切换的小工具，支持一键横跳，还支持管理 Skills、MCP 和提示词。

![CC Switch 主界面](https://oss.javaguide.cn/github/javaguide/ai/coding/cc-switch-main-interface.png)

启动 CC Switch，点击右上角 **"+"** ，选择自定义供应商，Base URL 填写 `https://api.deepseek.com/anthropic`，API Key 填写你的 DeepSeek API Key。

![CC Switch 添加 DeepSeek Provider](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/cc-switch-add-deepseek-provider.png)

将模型名称改为 `deepseek-v4-pro[1m]`（或 `deepseek-v4-flash`），完成后点击右下角的“添加”。

### 验证是否生效

直接在命令行输入 `claude`，进入 Claude Code 后再输入 `/status` 确认。model 显示 `deepseek-v4-pro[1m]` 或 `deepseek-v4-flash`，说明路由已经生效。

![验证是否生效](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/verify-deepseek-v4-ready.png)

之后就可以通过 Claude Code 调用 DeepSeek V4。第三方模型是否支持 Claude Code 的某项新能力，还要以兼容接口和实际测试结果为准。

## 实战一：升级 LLM 多 Provider 预设模型列表

我手头有一个多智能体股票分析项目，已经快一个月没启动了。这次重新启动，第一件事就是把过时的模型配置更新掉。

项目 Settings 页面之前只有一个纯文本输入框让用户手动填写模型名，不够友好。

我需要做两件事：**搜索各家 LLM 的最新模型版本**，然后**给前端加一个下拉选择**。

提示词很简单：

> /tavily-search 搜索当前 deepseek、glm 和 openai 最新的模型，然后调整全局配置中默认模型推荐和示例。并且，当前这几个 LLM 图标太 AI 味了，帮我换一个上档次点。

任务不大，但有个细节值得说——如果不配 `/tavily-search` Skill，单纯靠大模型的训练数据截止日期来猜最新版本，大概率会出错。我之前用其他模型没配 Tavily 的时候，反复提示了好几遍才把各家最新模型版本搞对。

关于 Tavily 的使用可以参考：[Claude Code 对接 AI Agent 搜索引擎 Tavily 实现高质量搜索](https://mp.weixin.qq.com/s/kAk7lLVgYzZrD9xJs3AUkQ)。

这次 V4-Pro 一轮就完成了修改。

![搜索并更新最新 LLM 模型](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/search-and-update-latest-models.png)

模型配置全部更新成功，各家推荐的模型示例都切到了最新版本。改了三个文件：

1. **`application.yml`**——新增 DeepSeek 预设 Provider，GLM 默认模型升级到 `glm-5`
2. **`.env.example`**——补上 DeepSeek 环境变量，Kimi 默认改为 `kimi-k2.6`
3. **`SettingsPage.tsx`**——加了 `PROVIDER_PRESETS` 常量，Model 和 Embedding Model 改成 combo box

最终四个 Provider 的推荐模型列表（截至 2026.04.25）：

| Provider  | 推荐模型                                                        |
| --------- | --------------------------------------------------------------- |
| DashScope | `qwen3.6-flash`、`qwen3.5-plus`、`qwen3-max`、`qwq-32b` 等 8 款 |
| DeepSeek  | `deepseek-v4-flash`、`deepseek-v4-pro`                          |
| GLM       | `glm-5.1`、`glm-5`、`glm-4.7-flash` 等 8 款                     |
| Kimi      | `kimi-k2.6`、`kimi-k2.5`、`kimi-k2-thinking` 等 5 款            |

![编辑 DeepSeek 模型配置](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/edit-deepseek-model-config.png)

## 实战二：数据库迁移方案诊断与 Flyway 集成

第二个任务更有挑战性。

因为换了新电脑，所有环境都是重新搭建的。项目有两个 SQL 文件，一个在项目启动时自动执行了，另一个没有。这块逻辑我也忘了，需要让模型帮我诊断。

![技能管理界面报错](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/skill-management-error.png)

提示词：

> 当前项目有两个 SQL 文件，`sql/init.sql` 在项目启动自动执行了，`sql/V2__knowledge_skill.sql` 没有自动执行。请你帮我分析一下是什么原因，然后用合理的方式优化现存的问题。

V4-Pro 找到的直接原因是：**`V2__knowledge_skill.sql` 没有被挂载到 Docker 容器中，项目也没有引入数据库迁移工具**，而 `init.sql` 的执行来自 Docker Compose 中的固定挂载。

![数据库表未执行原因分析](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/database-table-analysis.png)

它给出的解决方案是**集成 Flyway 作为数据库迁移工具**。

Flyway 是 Java 生态中最成熟的数据库迁移方案之一，用文件命名约定（如 `V1__init.sql`、`V2__knowledge_skill.sql`）自动管理迁移顺序。

整个过程 DeepSeek V4-Pro 完成了以下工作：

1. 分析了 Docker Compose 配置中 `init.sql` 的挂载逻辑
2. 发现 `V2__knowledge_skill.sql` 缺失的原因
3. 引入 Flyway 依赖，编写迁移配置
4. 重构 SQL 文件命名，确保迁移顺序正确

> 这里踩了个坑：我中途不小心调整了 iTerm2 的窗口大小，导致终端里的对话历史突然错乱了。

第一次运行后，Flyway 没有成功执行。我把错误日志贴过去，经过两轮调教后修复成功。

![DeepSeek 完成 Flyway 集成后的总结](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/deepseek-flyway-integration-summary.png)

这个问题值得单独拿出来讲——因为 DeepSeek V4-Pro 在第一次集成时也踩到了这个坑，经过两轮调试才找到根因。

**Spring Boot 4.x 对自动配置模块做了大规模拆分**，`FlywayAutoConfiguration` 已从 `spring-boot-autoconfigure` 中移除，迁移到了独立模块 `spring-boot-flyway`。

如果你只引入了 `flyway-core` 这个第三方库，Spring Boot **不会自动触发任何迁移**。最坑的是，**启动日志里也不会有任何 Flyway 相关输出**——完全没有报错，只是静默地什么都不做。这个坑特别容易迷惑人，让你怀疑是配置写错了，然后在 `yml` 文件里反复折腾。

使用官方 Starter，它会将自动配置模块一并带入：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-flyway</artifactId>
</dependency>
<!-- PostgreSQL 方言支持仍需单独引入 -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

这个案例里的结论很具体：Spring Boot 4.x 集成 Flyway 时，应使用对应的官方 Starter，不能只引入 `flyway-core` 就假定迁移会自动执行。其他第三方库是否需要独立 Starter，要分别查对应版本的 Spring Boot 文档，不能由这个案例一概而论。

## 实战三：AI 面试平台对接 DeepSeek

我们的 AI 智能面试辅助平台目前已经新增了多模型切换和配置功能，DeepSeek 也已经支持了。

和实战一一样，对接最新模型整个过程是一遍过的，就不重复贴过程了。我们直接看效果。

通过配置界面，将默认模型切换到 DeepSeek，选择 **deepseek-v4-flash**。

![将面试平台的模型切换到 deepseek-v4-flash](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/interview-guide-model-deepseek-v4-flash.png)

然后上传一份简历，基于这份简历生成一次模拟面试，来看看效果。

面试题是通过 deepseek-v4-flash 生成的，答案也是让 DeepSeek 在快速非思考模式下给出的（有两个问题没有回答）。

![模拟面试评估结果](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/interview-guide-model-deepseek-v4-flash-interview.png)

在这次简历面试题生成任务中，Flash 的非思考模式可以完成主要问题，仍有两个问题没有回答。它适合对成本敏感、允许人工检查的批量生成任务。

## 实战四：项目代码审计与多模型协同

我手头的多智能体股票分析项目，MVP 版本已经跑起来了，支持股票分析、多策略、告警、技能、多模型、通知等功能。但开发过程中赶进度，代码质量没顾上好好把关。

这次我试了一个思路：**用便宜的模型做审计，用贵的模型做决策和修复**。

在 Claude Code 里直接让 DeepSeek V4-Pro 启动多个 Agent，从安全性、功能正确性、代码质量等不同维度扫描整个项目，把发现的问题汇总写入文档。

![DeepSeek V4-Pro 扫描分析代码](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/deepseek-v4-pro-scan-analyze-code.png)

V4-Pro 确实找出来不少问题，最紧急的 TOP 5：

1. **API Key 明文存储** — 加密器已实现但未接入
2. **系统管理接口无权限控制** — 普通用户可修改 LLM 配置
3. **Redis 反序列化漏洞** — `activateDefaultTyping` 允许任意类实例化
4. **硬编码第三方 API Key** — Bocha 真实密钥提交在代码中
5. **功能 Bug** — History 页“重新分析”按钮因路由参数未读取而失效

我大概过了一遍，基本都是合理的。安全类问题尤其值得重视，第 3 条 Redis 反序列化漏洞如果被利用，后果很严重。

接下来我把 V4-Pro 找出来的问题直接丢给当时账户可用的 **GPT-5.5** 复核。

![GPT5.5 对 DeepSeek V4-Pro 找出的问题进行修复](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/gpt5-5-fix-problems-found-by-deepseek-v4-pro.png)

**为什么不让 V4-Pro 自己修？** 因为代码审计和代码修复是两种能力，用不同模型交叉验证更靠谱——一个负责找问题，一个负责确认问题并执行修复。

GPT-5.5 复核后执行了修复。这里记录的是案例发生时的模型选择，不代表当前推荐；最终仍要以测试、代码审查和密钥轮换结果为准，不能把第二个模型的确认当成证据闭环。

这个案例采用的是**低成本模型初筛、能力更强的模型复核、最后由测试和人工验收**的分工。具体能省多少取决于输入长度、缓存命中、输出量和当时的模型价格；没有完整调用记录时，不适合给出“至少两个数量级”的结论。

## 实战五：全项目扫描分析

这个就简单了，我主要是想验证一下 V4-Pro 的分析质量，顺便看看最后的 Token 消耗。

![让 V4-Pro 扫描分析 agent-invest](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/claudecode-deepseek-v4-pro%5B1m%5D.png)

![V4-Pro 扫描分析 agent-invest 的结果](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/v4-pro-scan-analyze-result-of-agent-invest.png)

这是 V4-Pro 最终输出的文档，覆盖了项目结构、主要模块和待处理问题：

![V4-Pro 最终输出的 agent-invest 文档](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/v4-pro-final-output-agent-invest-document.png)

## DeepSeek V4 一览：看完实战再看数字

看完上面几个实战任务，再来补一下 DeepSeek V4 的硬参数，会更有体感。

V4 Preview 同时提供两款模型。下表参数和 Benchmark 来自 DeepSeek 官方报告，属于厂商公布结果，不等同于本文任务的独立评测：

| 规格              | `deepseek-v4-pro`               | `deepseek-v4-flash`             |
| ----------------- | ------------------------------- | ------------------------------- |
| 总参数            | **1.6T**                        | **284B**                        |
| 每 token 激活参数 | 49B                             | 13B                             |
| 上下文窗口        | **1M tokens**                   | **1M tokens**                   |
| 推理模式          | 非思考 / Think High / Think Max | 非思考 / Think High / Think Max |
| 开源协议          | MIT                             | MIT                             |

官方报告列出的几个数据：

- **V4-Pro 的 Codeforces 评分 3206**，在报告选取的对照模型中排第一
- **SWE-bench Verified 80.6%**，报告中的 Claude Opus 4.6 对照结果为 80.8%；这组分数不能直接推出两者在具体代码库中的能力或成本等价
- **1M 上下文场景下**，V4-Pro 的单 token 推理 FLOPs 只有 V3.2 的 **27%**，KV 缓存用量只有 **10%**

这里的竞品名称和分数是 V4 Preview 发布报告的历史快照，不是截至本文核验日的模型排行榜。

![V4 Benchmark 数据](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/v4-benchmark.png)

再看定价：

| API 定价（每百万 token，截至 2026-07-24） | `deepseek-v4-flash` | `deepseek-v4-pro` |
| ----------------------------------------- | ------------------- | ----------------- |
| 输入（缓存未命中）                        | $0.14               | $0.435            |
| 输入（缓存命中）                          | $0.0028             | $0.003625         |
| 输出                                      | $0.28               | $0.87             |

实际账单取决于缓存命中率、上下文长度和输出规模。跨厂商成本对比还要统一输入、输出、缓存和重试口径，本文没有完整调用记录，因此不再给出固定倍数。价格会变化，使用前应再查 [DeepSeek 官方定价页](https://api-docs.deepseek.com/quick_start/pricing/)。

按这张价格表看，Flash 更适合成本敏感、结果容易校验的任务；是否适合日常对话、内容生成或简单问答，还要结合质量和延迟实测。

模型名迁移本身改动不大，但还要回归上下文长度、工具调用和错误处理，不能按“零成本”处理。官方给出的旧模型停用节点是 **2026-07-24 15:59 UTC（北京时间 23:59）**；阅读本文时如果已经过了这个时间，应先通过模型列表确认旧 ID 是否仍可用。

## 场景建议

| 场景                               | 建议                                    | 验证重点                                   |
| ---------------------------------- | --------------------------------------- | ------------------------------------------ |
| 日常对话、内容生成、简单问答       | 先试 `deepseek-v4-flash`                | 质量、延迟和缓存命中率                     |
| Agent Coding、代码重构、全项目分析 | 先试 `deepseek-v4-pro`                  | 工具调用、跨文件修改、测试通过率和实际成本 |
| 高风险复杂编码与独立复核           | 对比 Claude Fable 5、GPT-5.6 等当前家族 | 账户可用性、任务成功率、安全边界和总成本   |

最后一行是截至 2026-07-24 的模型家族快照，具体型号与可用性以账户和官方文档为准。

## 总结

从本文几个任务看，V4-Pro 已能完成模型配置更新、迁移诊断和代码审计初筛。官方报告中的 SWE-bench Verified 80.6% 和 Codeforces 3206 可以作为参考，但不能替代团队自己的代码库评测。

V4-Pro 是否划算要看缓存命中率和任务长度。V4-Flash 更便宜，但在本文的面试任务中仍出现了漏答，不适合不经检查就作为开发主力。

复杂编码、复杂问答和前沿科学推理仍要按任务对比不同模型。我的选择会是：低风险批量任务先试 Flash，跨文件改动和关键修复交给更强模型，并保留测试与人工验收。


---

<!-- source: IDEA + Qoder 插件多场景实战-接口优化与代码重构.md -->

---
title: IDEA + Qoder 插件多场景实战：接口优化与代码重构
description: 通过两个真实实战案例，展示 IDEA 搭配 Qoder 插件在深分页优化、祖传代码重构等场景下的实际效果，分享从执行者到指挥者的工作模式转变。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Qoder,IDEA插件,AI编程,AI辅助开发,代码重构,深分页优化,JetBrains,智能编码
---

大家好，我是小 G。如果你是 JetBrains IDE 的重度用户，大概率有过这样的纠结：想用 AI 辅助编程，但主流工具——Cursor、Trae、Qoder——大多基于 VS Code。切过去？舍不得 JetBrains 调试和重构体验。不切？又感觉错过了 AI 的效率红利。

有朋友会说：Claude Code、Gemini CLI 这些终端工具不是挺香的吗？确实香，但说实话，CLI 模式也有明显的短板：没有原生 UI 交互，看代码、审 diff 都不够直观。虽然可以通过一些开源项目（如 vibe kanban、1Code）来缓解，但在做复杂项目时，还是存在一些局限性。

现在的后端开发者，大致分成了四大阵营：

| 阵营           | 工具组合                                        | 特点                         |
| -------------- | ----------------------------------------------- | ---------------------------- |
| **CLI 派**     | Claude Code/Gemini CLI/Codex                    | 终端操作，效率高但 UI 交互弱 |
| **VS Code 派** | VS Code + 插件                                  | 轻量灵活，功能受限           |
| **混合派**     | CLI/AI 编程IDE（如 Cursor） 写 → JetBrains 验收 | AI 辅助 + IDEA 兜底          |
| **一体派**     | **JetBrains + Qoder 插件**                      | **心流专注，一个窗口搞定**   |

我目前属于“混合使用派”：Claude Code 与 IDEA + Qoder 插件是主要组合。

对于很多逻辑复杂的项目，IDEA 的掌控感能让人更安心。

这篇文章我会通过两个真实场景的实战案例，看看 IDEA 搭配 Qoder 在实际开发中的效果，并且分享一些实用的小技巧。

## Qoder JetBrains 插件上手教程

### 安装与配置

**第一步**：点击 **Settings | Plugins** 搜索 **"qoder"**，选择 Qoder - Agentic AI Coding Platform 并安装。

![插件安装界面](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/plugin-install-interface.png)

**第二步**：安装完成后，点击 Sign In 登录注册。

![登录界面](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/login-interface.png)

**第三步（可选）**：默认界面为英文，习惯中文可点击右上角 Plugin Settings，将 Display Language 设为简体中文。

![语言设置界面](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/language-settings-interface.png)

**第四步（可选）**：配置数据库连接。Qoder 支持 `@database` 上下文，可直接引用数据库表结构。建议提前配置项目相关数据库。

以 MySQL 为例，打开右侧 Database 工具窗口，点击 **+** 号，选择 **Data Source | MySQL**：

![添加数据源](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/add-data-source.png)

填写连接信息，测试通过后点击 OK。

![数据库配置完成](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/database-config-complete.png)

至此，前期准备工作完成。

### 任务一：订单查询频繁报错？用 Qoder 辅助排查深分页

#### 背景说明

这是一个电商后台管理系统，运营部门每月生成经营分析报表。由于数据量较大（订单表 1000 万+），且开发时间紧张，代码存在多个性能隐患。

运营反馈订单查询频繁报错，定位到接口：

```bash
curl -X POST http://localhost:8080/api/report/orders \
  -H "Content-Type: application/json" \
  -d '{"page": 1000000, "size": 10}'
```

这是一个典型的深分页请求。接口代码逻辑如下：

```java
@Transactional(readOnly = true)
public OrderListResponse getOrderList(OrderListRequest request) {
    int pageNum = request.getPage() == null ? 1 : request.getPage();
    int pageSize = request.getSize() == null ? 10 : request.getSize();

    // 问题核心：深分页查询
    Page<Order> pageParam = new Page<>(pageNum, pageSize);

    LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
    if (request.getStatus() != null && !request.getStatus().isEmpty()) {
        wrapper.eq(Order::getStatus, request.getStatus());
    }
    if (request.getShopId() != null) {
        wrapper.eq(Order::getShopId, request.getShopId());
    }

    // 排序字段可能无索引，触发全表扫描
    wrapper.orderByDesc(Order::getCreatedAt);

    // 深分页：LIMIT 9999990, 10
    IPage<Order> orderPage = orderMapper.selectPage(pageParam, wrapper);

    // 关联查询用户、店铺信息...
}
```

当 `page=1000000` 时，MySQL 执行 `LIMIT 9999990, 10`，需要扫描前 1000 万行后丢弃，性能急剧下降。

#### 传统方式的困境

按照传统流程，接口调优需要：

1. 阅读梳理代码逻辑
2. 分析代码优化空间
3. 结合日志分析 SQL 执行计划
4. 输出解决方案并实施
5. 回归测试与部署上线

如果从代码、SQL 执行计划一路排查到回归与上线，这类问题通常不是改一行 SQL 就能结束。具体耗时取决于项目熟悉度、数据规模和验证要求。

#### Qoder 解法：从执行者到指挥者

有了 Qoder 后，我把更多时间放在任务拆解、方案评审和结果验收上。

只需整理思路，给出明确目标：

```bash
针对订单列表查询接口出现的"java.net.SocketTimeoutException: Read timed out"超时问题，需要从接口代码逻辑和数据库层面进行分析并提供解决方案。

接口信息：POST http://localhost:8080/api/report/orders
请求参数：{"page": 1000000, "size": 10}

请从以下方面给出解决方案：
1. 分析接口代码逻辑中可能导致超时的因素
2. 检查数据库层面的问题（索引、查询性能、数据量）
3. 提出具体的优化措施
```

为了让 Qoder 更好地完成任务，添加数据库上下文：

1. 点击 **+Add Context** 按钮
2. 选择 **@database**，选择对应的数据库 Schema

![添加数据库上下文](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/add-database-context-1.png)

#### 问题分析与方案输出

**定位代码入口和候选原因**

Qoder 很快定位到了代码入口，并列出深分页、排序索引等候选原因。这里的结论仍需结合慢查询日志和 `EXPLAIN ANALYZE` 验证：

![代码分析结果](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/code-analysis-result.png)

**独到之处：代码与数据库联合诊断**

结合数据库 Schema，Qoder 给出了综合分析报告。`@database` 是 Qoder 当前提供的数据库上下文能力，适合用来补充表结构和索引信息，但它不能替代线上执行计划和真实数据分布：

![综合分析报告](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/comprehensive-analysis-report.png)

**代码层面优化**

Qoder 给出了三套方案，包括延迟关联查询（子查询只返回 ID，利用覆盖索引快速定位）：

![代码优化方案](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/code-optimization-solution.png)

**值得注意的方案**

分页查询总记录计算，Qoder 还给出了一个估算方案：通过主键索引页数和页内平均行数估算总量。它只适合允许近似结果的场景，误差会受空洞、页填充率和数据分布影响；账务、结算等要求精确计数的业务不能直接采用：

![数据库优化建议](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/database-optimization-suggestion.png)

#### 方案实施与验收

审核评估后，选定延迟关联 + 索引优化方案：

```bash
基于审核评估结果，执行以下优化：
1. 实施延迟关联查询策略，重构深分页查询逻辑
2. 根据索引建议创建优化索引结构
3. 编写单元测试，覆盖核心功能点，建立性能基准
```

Qoder 完成实施后，`getOrderList` 方法的改造：

- 结合生产故障，完成最大页码配置和逻辑限制
- 按不同策略完成分页统计和列表查询

从截图看，重构后的命名和方法拆分更规整。是否完整符合团队规范，还需要通过项目自己的静态检查和 Code Review 确认：

![重构后代码](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/refactored-code.png)

索引脚本可直接在 IDE 中执行，整个工作流无需切换窗口：

![索引执行](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/index-execution.png)

**回归测试**：Qoder 完成代码分支梳理，并针对不同场景生成单元测试：

![单元测试](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/unit-test-1.png)

**压测环节**：Qoder 生成了压测代码并加入 JIT 预热。预热只能减少冷启动和即时编译对结果的干扰，并不意味着测试已经贴近生产。要判断优化是否有效，还需要记录硬件、JDK 与 GC、数据分布、缓存状态、并发模型、样本量以及 p95/p99 延迟：

![压力测试](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/stress-test.png)

最后，Qoder 输出了完整的工作总结，包括技术方案和沟通汇报建议：

![工作总结](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/work-summary.png)

在代码提交窗口点击 Qoder，可以根据当前 Diff 生成提交说明。本次演示中，从输入上下文到生成候选改动大约用了 10 分钟；执行计划复核、压测、Code Review 和上线验证不包含在这个时间里。

![提交说明](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/commit-message.png)

### 任务二：梳理并重构一段遗留退款代码

#### 背景：一坨不敢动的“祖传代码”

退款模块的 `applyRefund` 方法，**150+ 行代码，无注释，魔法值遍地，重复逻辑冗余**。新需求来了：新增风控规则——**72 小时内存在未完成订单的用户禁止申请退款**。

**传统方式的困境**：

- 代码逻辑复杂，不敢轻易改动
- 新增规则需要全量回归测试
- 如果补齐特征测试、重构和回归，工作量通常要按项目实际情况评估

#### 逻辑梳理：让 Agent 替你读懂祖传代码

借助 Qoder 背后模型的上下文推理能力和 Agent 的任务规划与执行能力，可以让它完成业务功能的阅读并重构：

```bash
请结合一个简单的数据流，详细介绍退款申请的完整业务流程，并在代码中补充相应注释
```

为了减少 Agent 对表结构的猜测，把存量 Schema 作为上下文提交给 Qoder。Schema 只能补充数据库结构，不能保证它对业务规则的理解一定正确：

![添加数据库上下文](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/add-database-context-2.png)

Qoder 收到任务后，从整体概述开始，通过逐个分支梳理注释的方式执行任务：

![逻辑梳理过程](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/logic-analysis-process.png)

对应注释代码更容易阅读，但注释和数据流仍需逐项对照原实现、测试与产品规则：

![注释代码示例](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/commented-code-example.png)

任务结束后，Qoder 清晰地归纳了接口逻辑和特殊规则点：

![摘要总结](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/summary-conclusion.png)

#### 代码重构：先建立回归基线

完成逻辑梳理后，下达第二条指令，完成功能重构与回归：

```bash
请按照团队编码规范，并参考《重构：改善既有代码的设计》中的重构方法，对退款申请功能模块进行系统性重构。重构前先为现有行为补充特征测试；重构后执行单元测试、集成测试和关键功能测试，覆盖已识别的业务分支与边界条件。输出未覆盖分支和需要人工确认的行为，不得用覆盖率代替新旧实现等价性验证。
```

在此期间，Qoder 依次完成：

1. 目标文件查看：定位重构代码段
2. 代码问题分析：指出魔法值、重复代码、方法过长等问题
3. 系统重构：依次完成常量创建、重复代码提取、领域建模设计和职责分离
4. 编写测试代码完成逻辑回归

最终生成的代码如下。Qoder 没有直接修改原来的 `RefundService`，而是新建了 `RefundServiceRefactored`。这给新旧实现对照留出了空间，但新建一个类本身不等于“安全重构”：还需要明确调用路由、灰度或特性开关，使用同一批输入比较新旧结果，并约定旧实现的下线时间，否则两份逻辑很容易长期漂移。

```java
/**
 * 退款申请（重构后）
 */
@Transactional(rollbackFor = Exception.class)
public RefundResponse applyRefund(RefundApplyRequest request) {
    log.info("【退款申请】开始处理: orderId={}, userId={}, amount={}",
            request.getOrderId(), request.getUserId(), request.getRefundAmount());

    // 1. 查询并校验订单
    Order order = getAndValidateOrder(request.getOrderId(), request.getUserId());

    // 2. 判断退款类型并处理
    if (request.getOrderItemId() != null) {
        return processPartialRefund(request, order);   // 部分退款
    } else {
        return processFullRefund(request, order);      // 全额退款
    }
}

/**
 * 处理部分退款
 */
private RefundResponse processPartialRefund(RefundApplyRequest request, Order order) {
    log.info("【退款申请】处理部分退款: orderItemId={}", request.getOrderItemId());

    // 查询并校验订单明细
    OrderItem orderItem = orderItemMapper.selectById(request.getOrderItemId());
    refundValidator.validateOrderItemBelongsToOrder(orderItem, order.getId());

    // 校验退款数量与金额
    Integer refundQuantity = getRefundQuantity(request.getQuantity());
    refundValidator.validateRefundQuantity(refundQuantity, orderItem.getRefundableQuantity());
    BigDecimal itemRefundableAmount = refundCalculator.calculateItemRefundableAmount(orderItem, refundQuantity);
    refundValidator.validateRefundAmount(request.getRefundAmount(), itemRefundableAmount);

    // 执行风控检查 + 创建退款记录
    performRiskCheck(order, request.getRefundAmount(), request.getUserId());
    Refund refund = createRefundRecord(request, order, refundQuantity);

    log.info("【退款申请】部分退款成功: refundId={}", refund.getId());
    return RefundResponse.success(refund.getId());
}
```

**重构亮点**：

| 亮点         | 说明                                                     |
| ------------ | -------------------------------------------------------- |
| **方法拆分** | 主方法仅 15 行，部分退款/全额退款逻辑分离                |
| **职责分离** | `refundValidator`、`refundCalculator` 独立处理校验与计算 |
| **注释清晰** | 每个步骤都有对应说明                                     |
| **日志规范** | 使用【】标注关键节点，便于追踪                           |
| **异常处理** | 为受检异常配置事务回滚策略                               |

这里的单元测试报告显示分支覆盖率约为 80%。它能说明部分路径被执行过，但不能证明重构前后行为完全一致。金额、状态迁移、并发请求和外部依赖失败等关键路径，还需要特征测试、集成测试或新旧结果对照：

![单元测试验收](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/unit-test-verification.png)

#### 功能迭代：一行指令，规则上线

完成结构调整和回归基线后，可以定位到风控逻辑 `validateRiskMaxAmount`，再向 Qoder 下达最后一条指令：

```bash
在风控系统中新增一条退款限制规则：当用户在最近 72 小时（3 天）内存在任何未完成状态的订单记录时，系统应自动拒绝该用户提交的退款申请。
```

对应实现代码如下。可以看到，完成既有逻辑的梳理后，职责单一的校验框架和配套的单元测试已经就位，后续的增量迭代也变得容易处理和回归：

![功能迭代实现](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/feature-iteration-implementation.png)

#### 记忆沉淀：越用越懂你的编程习惯

完成任务后，Qoder 形成了针对该项目的记忆。Memory 是当前官方能力，但能否在后续任务中生效，仍取决于记忆是否被正确保存、召回以及是否与现状冲突：

- **项目特点记忆**：延迟关联查询优于游标分页、接口优化需配套性能测试
- **编码规范记忆**：遵循《阿里巴巴 Java 开发手册》、BigDecimal 使用 `compareTo` 比较
- **业务规则记忆**：退款风控规则（72 小时未完成订单拦截、单笔金额上限等）

在这次演示里，退款规则和编码约定被写入了记忆列表。后续使用时仍要审查召回内容，及时清理已经失效的规则：

![记忆沉淀](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder/idea-plugin/memory-accumulation.png)

## 能力拆解：Qoder 在这个示例中做了什么

通过上面两个实战案例，来拆解一下 Qoder 在实际开发 workflow 中发挥了哪些作用。

### 1. 工程感知与上下文理解

Qoder 对大型工程项目的理解能力：

- **数据库 Schema 感知**：在任务一中，Qoder 结合 `@database` 上下文分析订单表结构和现有索引，给出了候选索引方案。是否采用仍要看完整 SQL、选择性和执行计划。

- **代码逻辑溯源**：在任务二中，面对没有注释的冗长退款代码，Qoder 通过静态分析梳理出业务流程：订单校验 → 金额计算 → 风控检查 → 数据持久化，并标出重复代码、魔法值等代码坏味道。

- **跨文件关联**：Qoder 能够自动感知任务所需的关联文件，如从 `RefundService` 自动追踪到 `OrderMapper`、`RefundValidator` 等依赖组件，无需手动添加上下文。

### 2. 端到端的任务执行能力

Qoder 不只做代码补全，在这个示例中还参与了分析、改动和测试生成：

| 能力维度     | 本文观察到的表现                | 仍需人工验证的部分                 |
| ------------ | ------------------------------- | ---------------------------------- |
| **工程感知** | 分析数据库 Schema、代码依赖关系 | SQL 执行计划、数据分布和业务规则   |
| **任务执行** | 参与分析、设计、编码和测试生成  | 测试有效性、代码评审与上线验证     |
| **重构辅助** | 保留原实现并生成新的实现        | 路由切换、新旧对照和旧代码下线     |
| **项目记忆** | 保存项目规范与部分业务规则      | 记忆召回是否准确、内容是否仍然有效 |

### 3. 渐进式重构与增量迭代

任务二保留了原实现并生成新实现，可以把它作为渐进迁移的起点。

- **增量式重构**：Qoder 没有直接修改原有的 `RefundService`，而是创建了新的 `RefundServiceRefactored` 类。只有补上迁移方案后，这种做法才有以下价值：

  - 保留原实现用于行为对照
  - 通过特性开关或灰度路由逐步切换
  - 验证通过后删除旧实现，避免双份逻辑长期并存

- **职责分离**：Qoder 按照单一职责原则（SRP），将原本混杂在一起的校验逻辑、金额计算、单号生成抽离到独立组件：

  - `RefundValidator`：统一业务校验
  - `RefundCalculator`：金额计算逻辑
  - `RefundNoGenerator`：退款单号生成

- **事务边界**：`rollbackFor = Exception.class` 只有在方法通过 Spring 代理调用、异常继续抛出且资源参与同一事务时才会生效。自调用、捕获后吞掉异常或跨服务操作，需要另外处理。

### 4. 记忆感知与持续学习

这些记忆可以在后续交互中被召回。涉及业务规则时，建议把正式规则放在可评审、可版本化的项目文档中，Memory 只作为辅助上下文。

## 总结

Qoder JetBrains 插件给后端开发者提供了一种新的工作方式：**在保持 JetBrains IDE 使用习惯的同时，利用 AI Agent 的推理分析与编码落地能力**。

回头看这两个案例：

| 维度     | Qoder 可以提供的帮助     | 不能省略的工程环节           |
| -------- | ------------------------ | ---------------------------- |
| **分析** | 搜索代码、关联 Schema    | 日志、执行计划和业务规则核对 |
| **改动** | 生成候选实现与测试       | Code Review、新旧行为对照    |
| **体验** | 在 IDEA 内完成大部分交互 | 真实环境压测、灰度和上线观察 |
| **沉淀** | 保存部分项目记忆         | 规则版本管理和过期内容清理   |

## 写在最后

现在的技术环境很像是在盖大楼。AI 和新框架帮你把脚手架搭得飞快，像 Qoder 这样的插件让你在熟悉的 IDE 环境中就能完成这一切，无需切换窗口打断思路。但如果你缺乏底层原理知识和软件架构设计思维，即使 AI 能帮你完成功能落地，你也把控不了系统的交付质量。

回顾本文的两个案例：

- **任务一中的延迟关联查询**，基于对数据库索引原理的理解，才能判断 Qoder 给出的方案是否合理。

- **任务二中的代码重构**，熟悉《重构：改善既有代码的设计》和《阿里巴巴 Java 开发手册》中的 SRP、DRY 等原则，才能准确评估 Qoder 重构的质量。

- **性能基准测试中的 JIT 预热**，只能解决基准测试的一部分干扰因素；不了解 JVM、数据与负载模型，结果依然可能失真。

- **方案选择与权衡**，对业务场景和技术边界的把握。比如选择延迟关联查询而非游标分页，是因为后者会影响用户体验——这种判断，AI 无法替你做。

使用 Qoder 处理这类任务时，有三点建议：

1. **保持对底层原理的学习**：数据库索引、JVM 内存模型、并发编程原理——这些“地基”知识不会因 AI 而贬值。

2. **阅读经典书籍**：《重构》《设计模式》《高性能 MySQL》《深入理解 Java 虚拟机》——这些经典帮助你建立判断 AI 输出质量的“标尺”。

3. **培养架构思维**：把省下来的时间投入到对系统架构、业务本质的思考上。

如果你主要使用 JetBrains IDE，可以把 Qoder 插件作为一个备选方案。它减少了编辑器切换，但最终交付质量仍取决于执行计划、测试、评审和上线验证。


---

<!-- source: Kimi K3 实战-全栈项目、Java 项目改造与 3A 游戏 Demo.md -->

---
title: Kimi K3 实战：全栈项目、Java 项目改造与 3A 游戏 Demo
description: 通过热点追踪系统、Java 项目改造和第三人称动作游戏 Demo 三个真实案例，实测 Kimi K3 在长程 Agent 编程、多模态理解和复杂工程任务中的表现。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Kimi K3,Kimi Code,AI编程,Agent Coding,全栈开发,Java项目改造,多模态,长程任务,游戏开发
---

你好，我是小 G。Kimi K3 上周五正式发布了！

这两天被问得最多的，基本都是同一个问题：K3 能力到底怎么样？写代码体感如何？

国内外已经有很多大佬把 K3 拿去和一线 Coding 模型对比，反馈都很不错。数据也不会骗人，这几天 K3 的订阅和使用量暴增，算力都快顶不住了。

我还是更想看它在真实项目里的表现，我觉得这才是最实际的。

所以，这次我准备了三个非常典型的案例：一个全栈项目、一个现有 Java 项目改造，再加一个从零做游戏 Demo。

K3 这次带来了：**2.8T 参数、1M 上下文、原生多模态，以及面向长程 Agent 编程的架构优化。**

可以看到，它要的核心就是让 Agent 在更长任务里持续读代码、看截图、跑工具、修问题。

![Kimi K3 官方发布信息](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-official-announcement.png)

这篇还是按我的老办法来：先看怎么接入，再看它在几个工程任务里的实际表现，最后回头聊 K3 这次更新的亮点。

## 接入 Kimi K3

K3 支持几乎所有主流的 Coding Agent 和通用 Agent 框架，例如 Claude Code、Roo Code、OpenCode、OMP、OpenClaw、Hermes。

这里先以 Kimi 官方的 Kimi Code CLI 为例介绍最短接入路径。已经在用 Claude Code、Roo Code、OpenCode 或 CC Switch 的话，也可以继续沿用原来的工具链。

### Kimi Code CLI 接入

这是 Kimi 官方的终端 Coding Agent，和 Claude Code 类似。

安装成功之后，你在项目目录里执行 `kimi` 命令，然后就可以让它读代码、改代码、跑命令、解释报错、生成提交说明。

macOS 和 Linux 的安装命令如下：

```bash
curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash
```

Windows PowerShell 使用：

```powershell
irm https://code.kimi.com/kimi-code/install.ps1 | iex
```

安装完成后，可以用 `kimi --version` 看一下版本号：

![Kimi Code CLI 安装完成并查看版本号](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-kimi-cli-install.png)

装好后，切到准备测试的项目目录，运行：

```bash
kimi
```

第一次启动会要求登录 Kimi 账号。进入 Kimi Code CLI 后输入 `/model`，选择 `k3` 即可。

![使用 kimi -y 启动后在模型列表中选择 k3](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-kimi-y-model-list.png)

对于我个人来说，我一般在正式用之前会做一个只读小测试：

```text
阅读当前项目的目录结构和核心代码，说明各模块的职责。先不要修改文件，也不要执行有副作用的命令。
```

![Kimi 先读取 Java 项目的目录结构和核心代码](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-read-java-project.png)

### 已有 Coding Agent 也能继续用

Claude Code、Roo Code 或 OpenCode 已经用顺手的话，不用为了 K3 重搭工作流。创建 Kimi Code API Key 后，可以通过兼容接口把 K3 接进去。

OpenClaw、Hermes 等通用 Agent 框架也能调用 Kimi Code。K3 负责模型推理，具体怎么读文件、调用工具和管理权限，仍然由外面的 Agent 框架处理。

以 CC Switch 为例，新增供应商时可以直接选择 Kimi For Coding：

![新增供应商时选择 Kimi For Coding](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-provider-select.png)

然后填入 API Key 和请求地址，API 格式默认即可：

![配置 Kimi For Coding API Key 和请求地址](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-provider-config.png)

点击获取模型列表，把模型角色映射到 `k3`：

![Kimi For Coding 模型映射中选择 k3](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-provider-model-mapping.png)

这里不需要额外开路由：

![CC Switch 中直接选择 Kimi For Coding](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-cc-switch-direct-provider.png)

实际测试一下：

![Claude Code 接入 Kimi ](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-claude-code-read-project.png)

## 案例一：搭建热点追踪系统

第一个案例，我让 K3 搭一个**热点追踪系统**，项目名叫 **HotPulse**。

这次我没有只让它做一个好看的前端页面。前端当然要看，但我更想看它能不能把后端链路、数据库、队列、测试、错误恢复这些东西串起来。

这次的验收目标是一套能跑起来的 MVP：用户创建关键词 Monitor，系统定时或手动抓取 Hacker News / RSS，把原始内容落成 Observation，再经过 analyze 阶段生成 Entry，最后走 Notify 投递。前端要能看 Feed、Monitor Run、Delivery 状态，还要支持阅读、收藏和归档。

我在给 K3 的系统设计方案中重点做了这些约束：后端用 Hono、SQLite、Drizzle，前端用 React 19、React Router、TanStack Query，再加 Socket.IO。测试不能依赖真实公网，通知用 fake webhook server，数据库用临时 SQLite。

为了跳过文件写入和命令执行的人工审批，我们可以使用 `kimi -y` 命令。

任务推进用到了 `/goal` 命令。为了看模型本身在长任务里的能力，我没有启用任何 Skills，也没有给它额外的项目专用外挂。

![Kimi Code CLI 中使用 goal 推进 HotPulse 任务](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-goal-active.png)

这里有个小细节：图里出现了 8 小时多，不代表模型实际连续工作了这么久。我是昨晚 12 点左右开始跑的，中途卡住后就放着了，早上继续推进。实际有效完成时间大概在 1 小时左右。

### 它先把后端链路跑通

K3 的推进顺序还挺稳：先做 shared 契约、Zod schema 和单测，再补服务端配置、数据库、队列、领域服务，最后把抓取、分析、通知、定时调度、后台 Worker 和维护任务串起来。

中间也不是一路绿灯。K3 会自己跑 TypeScript 检查和测试，看到报错后再回去修 helper、handler 和测试。

![Kimi 修复服务端测试和 TypeScript 报错](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-server-tests.png)

### 后端全绿后再做前端

服务端这边中途先跑到了 `94/94` 全绿，然后 K3 才开始处理 client 侧。

![服务端测试通过后切到前端 SPA](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-client-stage.png)

前端部分补了 Monitor、Feed、Targets、Deliveries、System 这些页面。

下面是 HotPulse MVP 最终交付报告：

![HotPulse MVP 最终交付报告](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-goal-complete.png)

最终交付的功能范围，基本覆盖了我给它的 MVP 验收条件。

不过，第一版能跑，但确实比较粗，只能算 MVP 版本。

Monitor 编辑页能配置名称、关键词、运行间隔、启用状态和来源：

![HotPulse Monitor 编辑页](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-monitor-edit.png)

Feed 页能展示抓取和分析后的 Entry，也支持按状态、Monitor、排序和收藏过滤：

![HotPulse Feed 页面](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-feed.png)

### 继续优化

后面，我又让 Kimi 继续优化了几轮。

![HotPulse MVP 进一步优化后的最终报告](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-optimization-report.png)

这轮主要是把第一版「能用」的地方继续往产品形态上推了一步。比如默认首页、新手引导、手动运行反馈、按钮 pending、防重复提交、toast、删除确认弹窗，还有更统一的中文文案。

再进一步，我还让它做了 **多源扩展** 。

这次就不是单纯修界面了。HotPulse 不再只看 Hacker News / RSS，而是把 RSS、Webpage、GitHub、Twitter 都接进同一条 scrape → analyze → notify 管线里。

![HotPulse V1.1 多源扩展完成并通过验证](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-hotpulse-v11-multisource-complete.png)

这块最有意思的不是多写了几个抓取器，而是 K3 把这些来源统一到了 `source_items` 中间层，用 `(monitorId, externalId)` 做唯一键，再用 `contentFingerprint` 做内容变化检测。

真正的监控系统，难点在于某个来源挂了、页面结构变了、接口变慢了之后，整条链路还能不能稳住，能不能自动降级，能不能继续跑，并且把问题位置暴露出来。

这是现在跑出来的效果，已经接近一个产品形态了。

演示视频地址：<https://www.zhihu.com/pin/2062834508802569097>

这个案例最有价值的地方在于， **K3 在一个比较长的任务里能持续抓住目标：读需求、拆模块、改代码、跑测试、修报错，最后交出可验证的结果。**

## 案例二：现有项目改造

第二个案例，我准备放两个在现有项目上修问题或加功能的小任务。

这类任务和第一个全栈 MVP 不太一样。重点是先读懂已有代码，再沿着现象去找调用链、数据源和实现细节。对 Coding Agent 来说，这种任务更贴近日常开发：线上或本地发现一个问题，把它定位清楚，改最小范围，然后跑验证。

这里我们以星球的下一个多智能体股票分析实战项目为例，这段时间依然在持续完善和补充教程中。

先放第一个：修复股票搜索乱码。

### 修复股票搜索乱码

问题现象一眼就能看出来：股票搜索结果里的中文名称全变成了乱码，只剩股票代码还能看。

![股票搜索结果出现乱码](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-stock-garbled-before.png)

我把截图和现象丢给 K3 后，它先顺着搜索入口找到 `marketDataService.searchStock`，再继续追到数据源回退逻辑。

最后问题落在 `HttpBodyFetcher` / `HttpUtils` 这条链路上：新浪的 `suggest3.sinajs.cn` 搜索接口和 `hq.sinajs.cn` 行情接口返回 GBK 编码，而项目里的 `SinaDataSource` 默认走 `HttpUtils.get`，固定按 UTF-8 解码，中文名就在这里被解坏了。

修复核心就是让新浪数据源按 GBK 解码，并补上支持 `Referer` 请求头的请求方法。

![Kimi 定位并修复股票搜索乱码](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-stock-garbled-fixed.png)

修完后，K3 跑了 `mvn -pl stock-crawler -am install`，重启后端，并实测 `GET /api/market/search?keyword=开`，确认返回“神开股份、开立医疗、经纬辉开、开开 B 股、开发科技”等正常中文名。

这个小任务看起来不大，但比“给我写个工具类”更能看出模型的工程习惯：它从入口、数据源、HTTP 解码工具一路追到外部接口编码，最后也没有扩大到无关模块。

### 开发持仓收益看板

第二个任务是在这个股票项目里加一个 **持仓收益看板** 。

它要做的是基于已有自选股的成本价、持仓量和实时行情，算出总市值、浮动盈亏、今日盈亏、最大仓位等信息。并且，样式需要和现有的保持一致。

![K3 接到持仓收益看板的开发任务](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-task.png)

这个需求看着像一张页面，实际要同时把后端计算、接口分层、前端展示和测试补齐。

K3 先读了项目的自选股字段、行情接口和现有分层，再开始实现。金额计算统一用 `BigDecimal`，行情缺失时让单只股票降级，避免一条异常把整页带崩。

![K3 完成持仓收益看板并给出验证结果](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-complete.png)

最后交付的是一个能直接访问的看板：上面是总市值、总成本、浮动盈亏等汇总卡片，下面能看到每只股票的成本、现价、仓位和收益。后端接口、前端路由和测试也一起补上了。

![持仓收益看板最终页面](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-dashboard.png)

到这一步，其实已经能用了。

但我后来想了一下，真实项目里很多问题不是「页面有没有」这么简单，而是口径能不能对齐，异常能不能兜住，指标能不能继续往下钻。

所以我又让 K3 在这个看板基础上做了一版 V2。

这一版会继续补业务口径和风险指标。比如修复部分行情不可用时汇总口径不一致的问题，增加收益贡献排行、前三大持仓占比、HHI 集中度、年化波动率、最大回撤。

![K3 继续优化持仓收益看板 V2](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-v2-task.png)

这里我觉得比较有意思的是，它没有直接在前端堆字段，而是先回到后端确认 K 线服务字段、交易日期对齐、停牌和数据不足时怎么降级，再把计算逻辑放进独立的 `PortfolioRiskCalculator` 里。

这就很像一个正常工程师干活的节奏。

![K3 完成持仓收益看板 V2 并通过验证](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-v2-complete.png)

最后 V2 页面里，原来的持仓明细还在，下面多了收益贡献和风险概览。

收益贡献能看到哪只股票真正贡献了组合盈亏，风险概览里也能看到年化波动率、最大回撤、VaR、HHI 集中度和前三大持仓占比。

![持仓收益看板 V2 页面](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-case2-portfolio-v2-dashboard.png)

这个案例中，它能在已有项目的约束里把完整链路接起来：先复用数据，再补计算和接口，最后跑测试、验页面。更关键的是，第二轮继续优化时，它还能顺着业务口径往下追，把「能展示」推进到「数据口径更靠谱」。

另外，完成之后，我还用 GPT 5.6 Sol 审核了一下代码，整体实现逻辑和代码质量都是没问题的，可以直接提交。

## 案例三：从零做一个 3A 质感游戏 Demo

第三个案例，我一开始其实纠结过。

前面已经有一个全栈项目，也有一个现有 Java 项目改造。如果再放一个普通 Bug 修复，信息量会有点重复。

后来我决定换一个更直观的。

做游戏。

这个方向有点不一样。业务系统看的是分层、接口、测试和数据口径，游戏看的是另一套能力：画面、物理、输入手感、镜头、战斗反馈、音效、UI、性能，还有最重要的，能不能真的玩起来。

而且 K3 做游戏这块，真的挺离谱的。

我在海外社区也刷到不少类似反馈，有人直接说 K3 一句话 prompt 做小游戏很猛，甚至拿它去复刻《我的世界》风格的 3D Demo。

![海外社区对 K3 做游戏能力的反馈](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-game-community-feedback.png)

那我就想，行，别只看别人玩。

我自己也来试一下。

我的提示词很简单，要求它在当前空目录里，从零开发一款有 3A 质感的第三人称科幻动作游戏 Demo。背景是一座废弃的未来工业基地，玩家要进入基地，击败沿途敌人，取得能源核心，最后打机械 Boss 并撤离。

技术上，我要求它用 Vite、TypeScript、Three.js 和 Rapier。不要手写物理引擎，角色移动、碰撞、重力都交给 Rapier。游戏里必须有移动、奔跑、闪避、瞄准、射击、受击、死亡重开、普通敌人、精英敌人、多阶段 Boss、完整任务循环、PBR 材质、动态光影、阴影、雾效、粒子、Bloom、命中反馈和镜头震动。

![让 K3 从零开发 3A 质感第三人称动作游戏 Demo](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-game-steel-haven-prompt.jpg)

说实话，我写这个 prompt 的时候，心里预期也没那么高。

因为游戏不是普通网页。

一个网页按钮歪一点还能看，一个游戏的镜头、碰撞、射击、敌人 AI、Boss 阶段、特效和音效只要有一个环节不对，玩家马上就能感觉到。

K3 先给了游戏设计和技术方案。项目叫《STEEL HAVEN · 钢铁庇护所》，完整流程是降落平台、突破基地大门、中央庭院精英守卫、夺取能源核心、唤醒 WARDEN-9 Boss、三阶段 Boss 战、撤离点坚守，死亡后从检查点重开。

![K3 给出的游戏设计和目录结构](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-game-steel-haven-design.jpg)

然后它开始直接写项目。

第一步交付出来之后，已经不是那种「贴几块方块然后说这是游戏」的程度了。

它真的把游戏循环做出来了：第三人称角色控制、WASD 移动、Shift 奔跑、空格闪避、右键瞄准、左键射击、R 换弹、E 交互、普通敌人、精英敌人、三阶段 Boss、任务目标、Boss 血条、死亡重开、胜利结算，甚至还有 PBR 材质、环境反射、阴影、雾效、Bloom、枪口火光、爆炸粒子、命中标记和屏幕震动。

![STEEL HAVEN 第一版交付报告](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-game-steel-haven-report-v1.jpg)

当然，第一版不是没有问题。

它自己在交付报告里也写了几个已知问题，比如无跳跃、Boss 正对玩家时会被自身模型短暂遮挡、构建产物偏大。更关键的是，我实际玩下来能明显感觉到，射击手感还可以继续打磨。

这就进入第二步。

我让它重点优化射击动作和战斗体验，不要重新做一套游戏，而是基于现有项目继续修。它先看截图和代码，列出了 7 个影响手感的问题：左手不参与持枪、枪口和准星对不齐、瞄准时角色挡画面、枪口火光被身体挡住、连射扩散和真实 spread 没有对应、命中反馈层次不够、换弹音效和动作脱节。

然后它开始改 Player、PlayerController、CameraRig、Weapon、Game、Physics、AudioManager、HUD 和敌人模块。

![K3 第二轮优化射击动作和战斗手感](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-game-steel-haven-report-v2.jpg)

这轮改完之后，变化就更像游戏了。

瞄准时角色从画面中心移到右下，准星前方更干净；开火有枪体后顿和镜头上抬；连射会积累扩散；换弹有下沉内倾、弹匣弹出、插入和拉机柄的分段动作；命中、暴击、击杀有不同标记和音效；墙面火花也沿着法线喷出来，不再像贴在墙上的硬编码贴花。

演示视频地址：<https://www.zhihu.com/pin/2062833196090275836>

这个案例为什么我觉得必须放进来？

因为它特别能体现 K3 的多模态和长程 Agent 能力。

第一轮，它要从一句需求里拆出玩法、关卡、敌人、Boss、物理、视觉、音频、UI 和测试。第二轮，它又要根据截图和实际体验回头修手感，把「能玩」推进到「更像一个游戏」。

这不是简单生成一个前端页面。

这是把很多主观体验翻译成代码细节。

射击手感这种东西很难用一个单元测试定义。准星有没有被身体挡住，开火有没有顿挫，命中有没有反馈，换弹有没有节奏，Boss 战有没有压迫感，这些都要靠视觉和体验来判断。

它说明 K3 不只是能写业务代码，也能处理更综合的创意工程任务。只要目标足够清楚，验收条件写得足够具体，它可以从玩法设计一路跑到可玩的浏览器游戏 Demo，再继续根据体验反馈做第二轮优化。

这块真的有点超出我的预期。

## K3 这次更新有什么亮点

几个 Coding 榜单里，K3 基本都站到了第一梯队，有些项目甚至直接排到第一。尤其是 Terminal Bench、Program Bench、SWE Marathon 这类更接近日常开发和长任务的测试，表现都挺亮眼。

![Kimi K3 Coding benchmark 对比](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-coding-benchmarks.png)

当然了，benchmark 只能当参考。

实际项目中，Agent 接触到的场景会更复杂：任务越跑越长，需求、代码、日志、测试输出全挤在一起。

所以，1M 上下文就很关键。它至少能让更多需求、代码和终端输出留在现场，不至于跑几轮之后前面发生过什么都被压没了。

不过，1M 只解决能放多少，不能自动解决会不会用。所以 K3 这次还提了 Kimi Delta Attention 和 Attention Residuals。百万级 token 上下文里最高 6.3 倍更快解码，小于 2% 的额外成本下带来大约 25% 的训练效率提升。

你不用记这些名词，简单来说就是：**K3 的长任务场景得到了质的提升，更稳了！**

Agent 和多模态这块也挺有意思。通用 Agent、表格、浏览器任务里，K3 基本都在第一梯队，部分项目直接排第一。视觉任务也没有掉队，整体看下来很均衡。

![Kimi K3 General Agents 和 Visual Agents benchmark 对比](https://oss.javaguide.cn/github/javaguide/ai/coding/k3/k3-agent-visual-benchmarks.png)

不过普通开发者最后看的还是三件事：**效果够不够，成本扛不扛得住，速度快不快。**

K3 这块给我的感觉是，速度很快，价格放到同类模型里也比较低，可以说是接近 Sonnet 的价格，同时在复杂任务里达到 Opus 级的体验，性价比确实非常高。

**⭐️推荐阅读：**

- [后端开发学习 + 面试指南](https://javaguide.cn/home.html)：覆盖 Java、计算机基础、数据库、框架、系统设计等后端开发核心知识与面试内容。
- [AI 应用开发学习 + 面试指南](https://javaguide.cn/ai/)：覆盖 LLM、RAG、Agent、MCP、Prompt、评测、系统设计等 AI 应用开发知识与面试内容。
- [AI 编程实战指南](https://javaguide.cn/AI编程/)：覆盖 Claude Code、Cursor、Codex、Trae 等工具的使用技巧与面试内容。

## 小结

这几个案例跑完后，相信大家和我一样对 K3 的能力有了更直观的认识，而不仅仅是依赖参数和榜单。

Kimi 在前端能力上一直是最顶的那一档。这次的 K3 发布，能力更加全面了。

全栈 MVP 里，`/goal` 能把长任务往前推；现有项目修问题时，它能沿着入口、服务层、数据源、工具类一路追下去；到了游戏案例里，它又能把玩法、物理、镜头、射击手感和反馈系统串起来。

我会更愿意把它放在目标清楚、验收条件明确、允许它持续执行命令和修复的任务里。比如搭一个 MVP、修一个跨模块 Bug，或者做一个可玩的交互 Demo，这类任务比单纯生成页面更能看出 Coding Agent 的水平。

这次比较打动我的地方在于，K3 确实能在长任务里稳得住，而且完成任务的效果很赞，这几个案例完成之后几乎都没有 bug。

如果后续价格、速度和可用性都能稳住，K3 会是性价比和能力都很能打的第一梯队模型。

我这里就不写「超越谁」「吊打谁」了。

开发者最后看的其实很简单：任务能不能跑完，报错能不能修掉，代码能不能过 review，价格能不能让自己日常用得起。

K3 最近在国内讨论得很热，也有不少人给了差评。我的建议还是，别急着跟风吹，也别急着跟风踩，最好自己拿真实项目跑一跑，用实践和体感去评价一个模型。


---

<!-- source: MiniMax M3 + Claude Code 实战-Redis 故障排查、SCAN 算法复刻与监控面板搭建.md -->

---
title: MiniMax M3 + Claude Code 实战：Redis 故障排查、SCAN 算法复刻与监控面板搭建
description: 通过 MiniMax M3 接入 Claude Code，完成线上 Redis SCAN 故障排查与降级、SCAN 游标算法从 C 到 Go 的跨语言复刻、以及前后端 Redis 监控面板搭建三个实战案例。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: MiniMax M3,Claude Code,AI编程,Redis SCAN,故障排查,监控面板,跨语言复刻,Agent Coding,cc-switch
---

你好，我是小 G。MiniMax M3 前几天发布了，不少朋友第一时间用上，反馈都还不错，也有不少朋友留言让我实测一波。

不是不想测，前几天确实太忙了，想赶在秋招之前对 JavaGuide 进行一波优化，这是每一年都会做的事情。

![读者留言希望实测 MiniMax M3](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/image-20260604122811898.png)

根据 MiniMax 官方介绍，M3 是其首个同时提供 1M 上下文、原生多模态和前沿 Coding 能力的开放权重模型。这是厂商对产品的定位，是否适合具体代码库仍要靠任务验证。

官方公布的基准结果包括：SWE-Bench Pro 59.0%、Terminal-Bench 2.1 66.0%、MCP Atlas 74.2%。这些数字对应指定评测集和评测配置，不是本文独立复测结果。

![MiniMax M3 官方能力介绍：Coding Frontier/SOTA + 1M 上下文 + 原生多模态](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/HJsWydIbIAAFAZL.jpeg)

我更关心它进入真实工程后的表现。

因此，我用一个过去遇到的线上故障来检验。已知现象是业务高峰期前台请求受影响，排查线索指向后台异步任务中的完整 Redis `SCAN` 循环；它是否因长期占用连接而构成主因，还要结合监控和复现验证。

该案例涉及复杂业务链路推理和全局诊断。同时，我会在完成故障定位和止血后，继续用 M3 尝试 Redis 源码（C）到 Go 的功能复刻、以及前后端 Redis 监控面板搭建，从异构语言重构和全链路交付两个维度继续观察。

文章按三个任务展开：

1. 故障排查
2. 底层复刻
3. 监控落地

## 准备工作

小 G 日常使用 Claude Code 开发，通过 cc-switch 统一管理模型。以下为 MiniMax M3 的配置步骤。首先打开 cc-switch 点击加号添加模型配置：

![cc-switch 点击加号添加模型配置](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/cc-switch-add-model.png)

选择 MiniMax M3，将自己的 key 填充到 api key 选项中：

![选择 MiniMax M3 并填入 API Key](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/cc-switch-select-minimax-m3.png)

最后点击获取模型列表，完成模型的配置，以我的为例，直接将主模型设置为 MiniMax M3：

![获取模型列表并将主模型设置为 MiniMax M3](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/cc-switch-set-main-model.png)

配置完成后打开 Claude Code，通过对话面板验证当前模型是否生效：

![在 Claude Code 中验证 MiniMax M3 模型已生效](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/claude-code-verify-model.png)

## 故障排查：围绕应用层 SCAN 循环验证性能问题

第一个案例复刻自我过去经历过的一次线上故障。为降低理解负担，这里用一个经典的电商场景来还原：该场景是大促期间“超时订单自动取消”的异步任务在跑，同时大量用户正在浏览商品。某一刻，页面大面积超时——已售、库存、浏览、收藏，所有热点数据全加载不出来：

![大促期间页面大面积超时，商品热点数据加载失败](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/ecommerce-page-timeout.png)

为了评测 MiniMax M3 对于这类复杂业务链路的排查能力，我将系统表象的截图（Claude Code 中可通过 Ctrl+V 粘贴截图，Win 系统为 Alt+V）和错误描述一并提交：

![将故障表象截图和错误描述一并提交给 M3](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/submit-error-to-m3.png)

经过片刻分析，MiniMax M3 将问题定位到后台任务中的完整 `SCAN` 循环。它最初把原因概括成“SCAN 导致 Redis 服务端阻塞”，这个说法不够准确：`SCAN` 单次调用是增量迭代，设计目的正是避免 `KEYS` 一类长时间阻塞；真正需要检查的是循环次数、`COUNT`、Keyspace 大小、单次延迟，以及应用是否长期占用连接。

![M3 定位到根因：SCAN 操作导致 Redis 阻塞，引发读写排队](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/m3-root-cause-scan-blocking.png)

为进一步核对业务链路，我要求 MiniMax M3 用 ASCII 图画出故障过程。图里从超时订单任务进入 `SCAN` 循环，再到连接池可用连接下降和页面请求排队。这里应把“Keyspace 遍历阻塞主线程”理解为需要验证的假设，而不是 `SCAN` 的固定行为：

![M3 绘制的故障流转链路 ASCII 图：从 SCAN 触发到页面超时的端到端因果链](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/fault-chain-ascii-diagram.png)

M3 随后给出数据结构调整、原子操作、降级和监控四类建议：

![M3 从数据结构、原子性、降级、监控四个维度同时给出修复建议](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/m3-four-dimension-fix.png)

针对受影响的业务接口，M3 将串行 Redis 指令优化为一条原子操作，并附上降级策略，以控制极端情况下的影响面：

![串行 Redis 指令优化为一条原子操作，并附上降级策略](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/atomic-operation-optimization.png)

在工程侧，M3 还给出了监控埋点建议，并把 200 ms 作为示例告警值。这个数字不能用“人类感知停顿”来证明；Redis 后台任务的阈值应根据接口 SLO、连接池容量、任务频率和历史分位延迟确定：

![监控埋点建议与告警阈值：SCAN 操作红线设为 200ms](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/monitoring-alert-thresholds.png)

以下是本次修改的 diff：

![修复代码的 diff，M3 在实现中体现了降级和监控的设计理念](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/fix-code-diff.png)

以下为核心降级代码。M3 使用并发原子类处理了部分并发状态，但这只能保证对应变量或单次操作的原子性，不能证明 Redis、本地缓存和数据库回源组成的整条链路线程安全或一致。缓存击穿、重复回源和旧值覆盖仍要通过同步协议、限流以及并发测试验证：

![核心降级代码：使用并发原子类保障多级缓存操作的线程安全](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/degradation-code-atomic.png)

M3 同时生成了覆盖正常降级、异常回退和并发竞态的测试。截图显示相关用例编译通过、单测全绿；“100% 逻辑覆盖”只代表被统计代码的覆盖率，不能证明所有故障场景都已验证：

![M3 附带的测试用例：覆盖正常降级、异常回退和并发竞态，编译通过、单测全绿](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/test-cases-all-pass.png)

## 深入底层：复刻 Redis SCAN 游标算法，理解 rev 二进制翻转

近期 Google 技术总监 Addy Osmani 在《Don't Outsource the Learning》一文中提出了一个值得警惕的现象：让 AI 写代码而自己跳过学习太容易了——错误被修复，但你的心智模型没有进步。他引用了 Anthropic 的一项随机实验：同样是学习新库，AI 辅助组完成任务的速度与手动组持平，但后续理解测试中得分仅为 50%，远低于手动组的 67%。有趣的是，AI 组内部也存在分化——用 AI 提问概念问题的工程师得分超过 65%，直接复制粘贴代码的则不到 40%。Osmani 的结论是：工具不会替你学习，区别在于你的使用方式：

![Addy Osmani《Don't Outsource the Learning》核心观点：工具不会替你学习，区别在于你的使用方式](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/addy-osmani-dont-outsource-learning.png)

回到本次事故。故障排查和降级止血是第一步，但要理解 `SCAN` 如何遍历 dict、`COUNT` 的真实含义，以及 rev 二进制翻转如何推进游标，还得继续读文档和源码。官方文档已经说明 `COUNT` 只是工作量提示，源码则能解释具体版本如何实现。我借助 MiniMax M3 复刻 `SCAN` 的核心算法，再把结果放进好友 sharkchili 维护的 mini-redis 学习项目中验证。

为了提供充足的上下文，我直接将 Redis SCAN 相关的源码文件通过 add-dir 传入 mini-redis 项目：

![通过 add-dir 将 Redis SCAN 相关源码文件传入 mini-redis 项目](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/add-dir-redis-source.png)

然后直接键入需求。M3 扫描传入的 Redis 源码后，判断这是一个长任务，调用了 plan-with-files 技能进行任务拆解和规划：

![M3 自主调用 plan-with-files 技能进行任务拆解和规划](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/m3-plan-with-files-skill.png)

规划完成后，M3 主动发起澄清。第一点是确认需求范围，我选择复刻 SCAN 指令：

![M3 主动发起需求澄清，确认复刻 SCAN 指令的范围](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/m3-clarify-requirements.png)

第二点是算法选型。M3 发现 mini-redis 已经复刻了 Redis 的 dict 数据结构，而不是直接使用 Go 原生 map，于是建议在现有 dict 上复刻游标推进。这能保留 Redis 算法的主要行为和学习价值。至于哈希桶顺序、内存局部性和性能是否一致，还取决于 Go 实现的数据布局和运行时，不能直接由数据结构名称推出：

![M3 推荐完整复刻 Redis SCAN 游标实现，基于已有 dict 而非另起 Go map](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/algorithm-selection-dict-vs-map.png)

经过多轮的交互和澄清之后，我们得出如下规划：

![多轮澄清后的最终复刻规划](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/final-replication-plan.png)

方案对齐后，M3 自底向上逐层完成函数实现，先搭好 dict 遍历的基础框架，再衔接游标推进和参数解析，最后更新了项目的 README 计划表：

![M3 自底向上逐层完成函数实现，并主动更新项目 README 计划表](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/m3-bottom-up-implementation.png)

最终交付的代码结构如下。SCAN 实现覆盖了 match、count 参数解析以及游标循环逻辑：

![M3 生成的 SCAN 实现代码结构：覆盖 match、count 参数解析和游标循环逻辑](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/scan-implementation-code.png)

通过这次复刻结合代码注释，我看到了 `SCAN` 的一个实现细节：当前 Redis 源码在 `scanGenericCommand` 中将 `count × 10` 设为最大迭代次数，用于限制稀疏哈希表上的单次工作量。它不是把“实际遍历桶数量固定扩大十倍”，也不保证凑够 `COUNT` 个返回值：

![dictScan 将实际遍历桶数量扩大到 count × 10 的细节](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/dict-scan-count-detail.png)

其中一个值得注意的细节：Go 语言中 `^` 同时承担异或（XOR）和按位取反（NOT）两种语义，而 C 语言中两者分别是 `^` 和 `~`。rev 算法涉及大量二进制翻转操作，每一步都必须精确区分“翻转某一位”和“翻转整个二进制数”——语义搞混一步，游标推进就会全部跑偏。这部分需要重点 Review，确认 M3 有没有把 `~` 机械替换为 `^`：

![M3 手写 rev 算法时精确区分 Go 语言 ^ 运算符的异或和取反两种语义](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/go-xor-not-semantics.png)

基于上述实现质量，编译和单测均一次通过：

![SCAN 复刻代码编译和单测均一次通过](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/scan-test-pass.png)

## 学以致用：构建轻量级 Redis 监控面板

完成止血和复盘之后，还需要针对既有架构补上监控能力，确保后续能实时观测 Redis 运行状态，并在问题复发时快速定位和止血。

这个环节我把既有工程作为上下文传入一个新项目，让 M3 从零设计并实现一套可视化的 Redis 监控面板，看看它在前后端全链路交付上的表现。

![将既有工程作为上下文传入新项目，让 M3 从零设计 Redis 监控面板](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/build-redis-monitor.png)

经过简单的问题澄清后，M3 给出了监控系统的架构 ASCII 图，理清了数据流向：

1. 采集层（埋点上报）
2. 缓冲层（环形缓冲区削峰）
3. 展示层（HTTP 接口 + 前端面板）

三层之间职责清晰，耦合度低：

![M3 给出的监控系统三层架构 ASCII 图：采集层、缓冲层、展示层](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/monitor-three-layer-architecture.png)

代码结构：

![监控面板项目的代码目录结构](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/monitor-code-structure.png)

尽管是 MVP 快速原型，底层监控埋点的环形缓冲区数据结构设计值得一看——包括预分配的固定大小数组、互斥锁保护的并发读写，以及缓冲区满时自动覆盖最旧数据：

![环形缓冲区数据结构设计：预分配固定数组、互斥锁并发保护、满时自动覆盖最旧数据](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/ring-buffer-design.png)

最终生成的监控面板如下。整体采用深色主题，布局上分成了多个面板：Redis 实例的实时状态（内存占用、连接数、QPS）、命令类型的分布统计图、以及慢查询的时间线排列：

![最终生成的 Redis 监控面板：实时状态、命令分布统计和慢查询时间线](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/monitor-dashboard-final.png)

对于 Redis 服务端，面板也针对慢查询和 key 分布进行了详尽的输出与展示，可直接用于日常观测：

![Redis 服务端慢查询和 key 分布的详细展示](https://oss.javaguide.cn/github/javaguide/ai/coding/m3/monitor-slow-query-detail.png)

## 小结

这次用 M3 做了三个任务：分析 Redis 连接池故障、把 `SCAN` 游标算法从 C 复刻到 Go，以及搭建 Redis 监控面板。真正值得保留的是任务证据和暴露出的边界：

1. 故障排查时，它给出了数据结构、原子性、降级和监控等候选方向，但对 `SCAN` 阻塞机制的最初解释不准确。
2. 底层复刻时，它识别出项目使用了自研 dict，并区分了 Go 中 `^` 的异或与取反语义；实现仍要靠源码和测试验证。
3. 监控面板覆盖了采集、缓冲和展示层，但环形缓冲区等设计取舍没有经过充分论证。

在 Redis SCAN 从 C 到 Go 的复刻中，M3 识别出项目复刻了 dict 而非使用 Go map，并在此基础上推荐完整复刻 SCAN 游标；Go 语言 `^` 运算符兼具异或和取反两种语义，这部分也做了逐行区分。

而在监控面板场景中，M3 暴露了一个值得注意的边界：from-0-to-1 阶段，它给出的架构选择是“能跑的稳妥方案”而非“经过权衡的最优方案”。以环形缓冲区为例，为什么是环形缓冲区而不是无锁队列？缓冲区满了覆盖最旧数据在高 QPS 下会不会丢关键指标？这些决策点 M3 默认了一个标准答案，没有主动提出 trade-off。如果开发者不具备相关领域的知识储备，就没法在头脑风暴阶段完成最佳方案决策——最终拿到的只是一个“能跑”的原型，而非“设计合理”的原型。

这也回到了 Addy Osmani 的观点：工具不会替你学习。M3 生成了降级代码和 rev 算法，但模型对 `SCAN` 阻塞和 `count × 10` 的解释仍需要文档、源码和压测来校正。对我来说，这次实测的价值就在这里——它能加快阅读和实现，工程结论仍要自己验。


---

<!-- source: Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构.md -->

---
title: Trae + MiniMax 多场景实战：Redis 故障排查与跨语言重构
description: 使用 Trae IDE 接入 MiniMax 大模型，通过 Redis 连接池故障排查和 Redis C 源码到 Go 跨语言重构两个真实场景，分享 AI 辅助编程的实战经验与工作技巧。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Trae,AI编程,AI编程IDE,Redis故障排查,跨语言重构,Go语言,AI辅助开发,大模型编程
---

大家好，我是小 G。前面分享过一篇 [IDEA 搭配 Qoder 插件的实战](./IDEA + Qoder 插件多场景实战-接口优化与代码重构.md)，那篇主要讲在 JetBrains 体系内用 AI 辅助编码。这篇换个角度，聊聊 **Trae IDE 接入大模型** 的实战体验。

Trae 是字节跳动推出的 AI 编程 IDE，基于 VS Code 生态，支持接入多种大模型。本文使用 MiniMax M2.7 作为示例，但 Trae 的接入方式是通用的——换成 Claude、GPT 等其他模型，流程基本一致。

我这里使用 MiniMax 是因为我刚好订阅了 MiniMax Code Plan 想要实际测试一些，并非广告，你可以换成其他模型，思路都是一样的。

我选了两个比较有代表性的复杂场景来实际验证：

- **场景一**：接口突然大量超时，日志只指向 Redis，但项目里多处都在用 Redis，很难快速定位根因。
- **场景二**：把 Redis 的慢查询指令从 C 语言源码完整复刻到 Go 实现，考验跨语言重构和上下文理解能力。

## 快速上手：Trae 接入大模型

Trae 支持接入多种大模型，下面以接入自定义模型为例，演示通用配置流程。

**第一步**：到 Trae 官网下载安装并完成初始化，同时到对应模型平台完成注册和 API Key 创建（本文示例使用 MiniMax 平台）：

<https://platform.minimaxi.com/subscribe/token-plan>

**第二步**：在 Trae 中点击"Add Model"添加自定义模型：

![Trae添加模型入口](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/trae-add-model-entry.png)

**第三步**：选择"Other Models"并手动输入模型 ID 和 API Key：

![选择Other Models](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/select-other-models.png)

**第四步**：输入模型 ID（如 `MiniMax-M2.7`）和申请的 API Key，点击"Add Model"。若无报错提示，即表示接入成功：

![输入模型ID和API Key](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/input-minimax-m2.7-api-key.png)

接入完成后，就可以在 Trae 中使用该模型进行 AI 辅助编程了。接下来通过两个实战场景，分享具体的使用方式和技巧。

## 场景一：接口超时问题快速止血与根因定位

### 问题定位

第一个案例是某次真实线上故障的复现（已脱敏）。当时部门同学反馈某列表查询接口报错，页面无数据。线上监控系统定位到接口信息如下：

接口：`GET http://localhost:8080/api/rbac/user/list`

返回结果：

```
{
    "code": 500,
    "message": "系统繁忙，请稍后重试",
    "data": null,
    "timestamp": "2026-03-19T10:11:02.632242"
}
```

结合异常堆栈信息关键字`Read timed out`，以及对应代码段的`get(key)`操作，我们可以初步认为该报错只是表象并非根因。

```java
@Override
public String getConfigValue(String configKey, String environment) {
    String cacheKey = CONFIG_CACHE_PREFIX + configKey + ":" + environment;
    String value = stringRedisTemplate.opsForValue().get(cacheKey);
    if (value != null) {
        return value;
    }
    // 后续逻辑省略
}
```

按照常规处理流程，我们需要快速定位问题根因、完成止血，再联系运维深入排查。但项目中多处用到Redis，逐一排查耗时长，期间可能影响业务稳定性。

为了验证 AI 辅助排查的实际效果，笔者复刻了该故障场景（已脱敏），让模型接手处理。按照企业级线上故障处理流程，首先需要定位根因并完成止血。于是向模型下达了第一条指令：

```
针对访问 http://localhost:8080/api/rbac/user/list 接口时出现的500错误（错误信息："系统繁忙，请稍后重试"），请执行以下操作：
1. 分析提供的异常堆栈信息，准确定位导致服务器内部错误的根本原因；
2. 提供详细的线上紧急止血方案，包括但不限于：临时回滚策略、流量限制措施、服务降级方案或紧急重启流程；
3. 解释错误产生的技术原因，指出具体的代码模块或配置问题；

...... 异常堆栈关键信息：`java.net.SocketTimeoutException: Read timed out`
```

![向M2.7下达的诊断指令截图](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-diagnostic-instruction.png)

模型收到请求后，很快定位到指定代码的上下文，并推理出4种可能的根因：

- Redis 服务器宕机或无响应
- 连接池配置太小，高并发下耗尽
- Redis 连接泄漏（连接未正确关闭）
- Redis 服务器负载过高

![M2.7推理结果截图](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-inference-result.png)

到这一步，模型已经把问题空间从“N处Redis调用”压缩到了“4种可能根因”——这种**快速收敛问题范围**的能力，是 AI 辅助排查的核心价值。接下来看它的止血思路。

### 止血

模型针对既定异常栈帧快速梳理了代码调用逻辑，准确地指出：列表查询接口被切面拦截，连接池耗尽是500错误的根因。另外一个关键点，它指出了这段代码缺乏降级策略——这一点笔者是在复盘会上才意识到的。

![M2.7代码调用链路分析截图](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-call-chain-analysis.png)

针对线上问题，止血策略是最关键的环节。模型给出了几个解决方案，第一个就是临时关闭权限校验开关——原因在于方案一需要清除Redis缓存数据。虽然方案有些激进，不过，它详细指出了代码的调用链路和表结构信息，这也能很好地辅助我通过业务语义猜测可能的场景和原因。

![M2.7调用链路分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-call-chain-analysis-2.png)

基于模型提供的调用链路信息，笔者进一步询问方案一的技术依据，确保业务理解上快速对齐：

```bash
结合代码开发的完整工作流程，详细阐述方案一的技术依据、设计思路及实施合理性。
```

这也是让笔者比较满意的地方，模型给出了问题代码的调用链路图，让我快速了解到列表查询期间所经过的完整切面和具体故障所处位置，帮助理解当前问题的影响面以及本次异常的直接原因。

经过不到10分钟的交互，笔者不仅迅速获得一个宏观的架构视角，理解了当前复杂架构的故障和各解决方案的依据，例如方案一：通过修改数据库配置重启刷新缓存来规避权限校验。

![M2.7调用链路图截图](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-call-chain-diagram.png)

我们再来看看方案三的思路：当Redis不可用时，使用本地缓存或默认值，避免级联失败。模型结合当前工程代码段给出了修改建议：

![M2.7方案三代码片段](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-solution-3-code.png)

模型分析后，我们对问题有了初步的判断：Redis客户端连接池耗尽，导致日常业务接口基于缓存开关查询逻辑崩溃，进而引发雪崩效应。综合模型的多个建议，本着保守、快速止血、业务高峰期不压垮数据库的原则，得出以下hotfix方案：

```bash
根据提供的方案，创建一个hotfix止血分支，用于紧急修复Redis异常问题。具体实施步骤如下：
1. 基于当前生产环境代码创建hotfix分支，命名规范为"hotfix/redis-exception-handler"
2. 按照方案三实现Redis异常捕获机制，在所有Redis操作处添加try-catch块
3. 当捕获到Redis异常时，自动降级为直接查询数据库获取数据
4. 实现JVM本地缓存机制，将查询结果缓存至内存中，设置合理的缓存过期时间
5. 完成单元测试和集成测试，覆盖率需达到80%以上
6. 准备回滚方案，确保在紧急情况下能够快速恢复到上一版本

```

![hotfix方案指令](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/hotfix-instruction.png)

模型收到指令后，准确理解了问题，完成任务拆解并逐步执行：

![M2.7任务拆解过程](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-task-breakdown.png)

最终输出的代码结果如下：模型在原有权限校验逻辑中整合了数据库降级查询，对权限校验逻辑的理解和复杂设计的整合做得比较到位。

```java
@Around("permissionCheck()")
public Object checkPermission(ProceedingJoinPoint joinPoint) throws Throwable {
    try {
        // 从配置中心读取权限校验开关
        String checkEnabled = configService.getConfigValue("permission.check.enabled", "PROD");
        if (!"true".equalsIgnoreCase(checkEnabled)) {
            return joinPoint.proceed();
        }

        // ... 原有权限校验逻辑 ...

        // 尝试从Redis缓存获取权限信息
        Boolean hasPermission = checkPermissionFromCache(redisKey);

        if (hasPermission != null) {
            // ... 命中缓存处理 ...
        }

        // 降级：从数据库查询权限
        boolean hasPermissionFromDB = checkPermissionFromDatabase(userId, apiPath, httpMethod);
        // ... 降级逻辑处理 ...

    } catch (Exception e) {
        if (e instanceof RuntimeException && "无权限访问".equals(e.getMessage())) {
            throw e;
        }
        // 发生异常时，触发监控告警并采用保守策略放行
        AlertManager.notify("PERMISSION_CHECK_ERROR", e.getMessage());
        return joinPoint.proceed();
    }
}
```

getConfigValue同样补充了本地缓存逻辑，多级缓存设计在容错处理上做得不错。

```java
/**
 * 获取配置值（指定环境）
 */
@Override
public String getConfigValue(String configKey, String environment) {
    String cacheKey = CONFIG_CACHE_PREFIX + configKey + ":" + environment;

    // 【第一步：尝试从本地缓存获取】
    String localValue = localCacheManager.get(cacheKey);
    if (localValue != null) {
        return localValue;
    }

    // 【第二步：尝试从Redis获取】
    try {
        if (isRedisAvailable()) {
            String value = stringRedisTemplate.opsForValue().get(cacheKey);
            if (value != null) {
                localCacheManager.put(cacheKey, value, LOCAL_CACHE_TTL);
                return value;
            }
        }
    } catch (Exception e) {
        // Redis异常，降级到数据库
        handleRedisFailure(e);
    }

    // 【第三步：降级到数据库】
    // ... 其他逻辑 ...
    return getConfigValueFromDatabaseWithFallback(configKey, environment);
}
```

这其中值得注意的一个细节是本地缓存的设计：模型采用开闭原则，基于ConcurrentHashMap完成了本地缓存工具类的封装，考虑到了堆内存溢出风险，配合LRU算法实现缓存清理：

```java
@Component
public class LocalCacheManager {
    // 核心存储：ConcurrentHashMap保证线程安全
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupExecutor;

    // 缓存配置
    private static final long DEFAULT_TTL_MILLIS = 300000; // 5分钟
    private static final long MAX_CACHE_SIZE = 10000;

    public LocalCacheManager() {
        // 守护线程执行定时清理
        this.cleanupExecutor = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "local-cache-cleanup");
            t.setDaemon(true);
            return t;
        });
        this.cleanupExecutor.scheduleAtFixedRate(this::cleanupExpiredEntries, 1, 1, TimeUnit.MINUTES);
    }

    public void put(String key, String value) {
        put(key, value, DEFAULT_TTL_MILLIS);
    }

    public void put(String key, String value, long ttlMillis) {
        // 容量满时触发LRU清理
        if (cache.size() >= MAX_CACHE_SIZE) {
            cleanupExpiredEntries();
            if (cache.size() >= MAX_CACHE_SIZE) {
                evictOldestHalf();
            }
        }
        cache.put(key, new CacheEntry(value, System.currentTimeMillis() + ttlMillis));
    }

    public String get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry == null || entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        return entry.getValue();
    }

    // ... 其他方法省略 ...

    // LRU清理：删除最老的50%数据
    private void evictOldestHalf() {
        // ...... 省略排序和清理逻辑 ......
    }

    // 缓存条目
    private static class CacheEntry {
        private final String value;
        private final long expirationTime;

        public CacheEntry(String value, long expirationTime) {
            this.value = value;
            this.expirationTime = expirationTime;
        }

        public String getValue() {
            return value;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expirationTime;
        }
    }
}
```

### 根因定位

通过hotfix分支针对线上故障止血之后，我们再来深入排查Redis连接池耗尽的原因。按照模型的输出结果和推断，一个常规的get指令操作按照Redis 10w qps的性能表现来看，10个连接（平均每个指令1~2ms），理想情况下每秒处理约6600条指令，远低于Redis的极限处理能力，所以问题可能出在代码层面，我们需要进一步推断项目中是否存在不合理的Redis操作：

```bash
结合本次发生的具体故障现象和表现特征，对项目进行全面的系统性全局分析。分析范围应覆盖项目架构、代码实现、依赖管理、环境配置、数据交互等多个维度，重点识别并输出可能导致生产故障的直接原因。
```

![M2.7全局分析指令](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-global-analysis-instruction.png)

此时模型开始基于全局项目结构和上下文进行详细的阅读和推理分析：

![M2.7项目结构分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-project-structure-analysis.png)

最终模型给出了详细的故障分析报告，指出根因：不当的Redis数据结构设计使用scan操作导致连接池夯死。同时，还结合上下文给出了该操作的业务流程，便于我们迅速理解这条故障链路：

![M2.7故障根因分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-root-cause-analysis.png)

而解决方案也是非常干净利落，通过优化数据结构的方式降低Redis读写操作的时间复杂度，避免连接池夯死：

![M2.7优化方案建议](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-optimization-suggestion.png)

场景一整体体验不错。从N处Redis调用中精准定位根因，到给出完整止血方案，整个推理链条清晰完整。

不过也发现了一些问题：它给出的方案一（清除Redis缓存）略显激进，实际生产环境可能需要更保守的策略。另外，部分边界条件的防御性代码还是需要人工补充——AI能帮你走到90%，剩下的10%还得靠自己。

## 场景2：从Redis C源码到Go实现的跨语言重构

### 背景说明

接下来我们再来一个高难度场景——复刻Redis慢查询指令。mini-redis是采用Go语言goroutine-per-connection理念提升吞吐量，并以C语言的风格实现符合RESP协议的缓存中间件，由于语言在设计理念上存在偏差，涉及复杂逻辑梳理和异构方案落地。用于验证大模型的跨语言架构设计能力再合适不过。

### 需求梳理与方案设计

针对项目重构类需求，按传统开发流程，我们需要大量时间阅读源代码梳理逻辑，期间因历史原因代码无注释，需结合上下文推理调试。了解原有逻辑后，还需结合新项目架构制定实施步骤，并设计单元测试确保既有逻辑稳定运行。整个流程（研发、测试到发布）保守估计需要3个工作日。抱着试试看的心态，笔者将源代码阅读和技术文档整理工作交给 AI 负责。

```bash
我现在需要通过Go语言复刻Redis慢查询指令的实现。请你详细阅读Redis源代码，深入理解慢查询功能的完整实现原理、数据结构设计、处理流程和关键步骤。具体包括但不限于：慢查询日志的存储机制、慢查询阈值的配置与调整、慢查询命令的收集与记录流程、相关API接口的设计与实现，以及慢查询信息的查询与展示方式。请基于这些理解，整理出清晰的技术文档，包括核心原理说明、关键数据结构分析、实现步骤分解以及可能的性能优化考量。
```

等待片刻后，模型明确指出技术要求，自底向上地介绍数据结构到执行链路，进行了详尽的分析和介绍：

![M2.7慢查询数据结构分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-slowlog-data-structure.png)

查看其对慢查询切面逻辑的定位非常准确，在主流程上输出了必要的注释，让我快速了解慢查询的整体处理流程：

![M2.7慢查询切面逻辑](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-slowlog-aspect-logic.png)

再看其对slot get指令的理解，也非常到位，思路和资深开发一样，抓大放小，明确核心逻辑，在主流程上输出必要的注释：

![M2.7 slot get指令分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-slot-get-instruction.png)

确认模型对慢查询有了准确的理解后，接下来让它以开发专家的视角进行功能拆解、落地、测试回归的完整设计文档：

```bash
按照测试驱动开发(TDD)方法论，使用Go语言创建一个全面详细的开发教程文档，指导复刻Redis的实现。该教程必须符合以下规范：

1. 开发方法：
   - 严格执行测试驱动开发工作流程：先编写会失败的测试，然后实现最简代码以通过测试，最后进行重构
   - 采用类似于原始Redis C语言实现的面向过程的编程风格
   - 尽可能使用纯Go语法和标准库

2. 教程结构：
   - 从项目设置和环境配置说明开始
   - 按Redis功能拆分为逻辑模块进行开发
   - 针对每个模块/特性，提供：
     a. 明确的测试用例定义，包含预期输入和输出
     b. 逐步的代码实现，附带逐行解释
     c. 明确的测试命令和验证流程
     d. 预期测试结果和成功标准

3. 技术要求：
   - 包含所有组件的完整代码片段
   - 指定确切的文件结构和命名规范
   - 详细说明编译和测试命令
   - 解释常见问题的调试流程
   - 在适用时参考相关的Redis C源代码模式

4. 实现细节：
   - 从核心数据结构（字符串、列表、哈希等）开始
   - 逐步推进到命令处理和协议实现
   - 包含网络层和客户端-服务器通信
   - 涵盖持久化机制（RDB/AOF）
   - 按照相同的行为模式实现基本的Redis命令

5. 测试要求：
   - 为每个组件提供完整的测试代码
   - 解释测试断言和验证方法
   - 包含单元测试和集成测试
   - 指定如何运行测试并解读结果
   - 详细说明如何根据Redis规范验证正确行为

该教程应足够全面，让具备中级Go知识的开发者能够按照指定方法成功构建一个功能类似的Redis系统。
```

等待片刻后，我们收到一份设计文档。模型结合Redis源代码上下文，梳理出慢查询的核心脉络和关键定义，并规划出完整的开发步骤：
![慢查询设计文档](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-slowlog-design-doc.png)

### 编码实现

我们从Redis源代码中抽取设计文档后，为确保C语言工程的设计思路能在个人Go语言项目工程规范中准确落地，将其复制到mini-redis项目，让模型分析方案的可行性和修改建议：

![M2.7可行性分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-feasibility-analysis.png)

等待片刻后模型完成文档最后的可行性分析和整理，我们开始对其设计方案进行进一步的复核确认。从项目概述上可以看到，模型针对mini-redis项目结构进行了分析，准确地定位到慢查询可以直接复用的链表结构体并完成文档微调：

![M2.7链表结构体分析](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-linked-list-structure.png)

再来看看最关键的数据结构实现思路，模型也结合mini-redis的编码规范，生成了Go语言风格的结构体：

![M2.7 Go风格结构体](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-go-style-struct.png)

针对慢查询时间测量，有个细节值得提一下。个人实现的指令处理入口和原生Redis有些设计上的出入：由于Go语言语法糖特性，笔者对指针、指针函数以及文件编排做了特殊处理。模型准确地基于笔者的协程模型定位到时间测量的切面，完成前置计时和后置统计，实现慢查询监控。

![M2.7时间测量切面](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-time-measurement-aspect.png)

最后就是核心的慢查询指令实现，无论是参数解析还是指令查询和响应处理函数，模型都结合笔者的当前项目封装的逻辑给出了明确的编码方案：

![M2.7慢查询指令实现](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-slowlog-command-implementation.png)

经过仔细复核设计文档，整体开发思路基本一致，但在代码组织细节上仍有调优空间——例如模型将`slowlog`指令独立成文件，而未遵循项目惯例统一放入`command.go`。考虑到慢查询功能并非核心内存读写指令，且其日志管理逻辑相对独立，这一处理也算合理折中。权衡之后，我们决定保留模型的实现方式，同时手动调整部分文件布局以符合既有工程规范，随后推进剩余开发工作。

这一细节也说明：AI生成的代码架构虽然合理，但与既有工程规范的适配仍然需要人工把关。

另外提一句，整个慢查询功能的实现过程中，模型有两次生成了不符合项目风格的代码（比如错误处理方式），需要手动调整。这不是大问题，但说明完全依赖AI生成还是不行的。

### 验收

因为笔者明确指定了TDD的开发模型，所以模型在这期间结合输出反馈和文档说明完成自循环修复，最终结合mini-redis的项目风格完成了慢查询指令的复刻。

得益于 AI 的推理和重构能力，在验收过程中我们有了更多的构思空间。之前一直因为源代码梳理总结和技术验收成本过大，导致 redis.conf 配置加载逻辑一直没有实现。

因为笔者需要将慢查询时间设置为0，方便对慢查询指令做最后的验收工作，所以笔者索性再次对其提出加载配置的需求：

![M2.7配置加载实现](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/m2.7-config-loading.png)

整个逻辑梳理和开发工作不到1小时，笔者顺利完成了慢查询指令复刻和验收，为了演示慢查询功能，将mini-redis的慢查询阈值设置为0：

```bash
# 慢查询阈值（微秒）
# 执行时间超过此值的命令会被记录到慢查询日志中
# 负值表示禁用慢查询日志，0 表示记录所有命令
# 默认值：10000（10毫秒）
slowlog-log-slower-than 0
```

启动mini-redis服务端后，键入slowlog get 默认返回空：

![slowlog get初始状态](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/slowlog-get-initial-state.png)

执行简单的set操作后，键入slowlog get，这条指令如预期被判定为慢查询指令并输出：

![slowlog get记录set命令](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/slowlog-get-record-set-command.png)

同理，我们依次键入后续几条指令，也都准确按照链表头插法入队，实现按照时间降序排列输出：

![slowlog get多条记录](https://oss.javaguide.cn/github/javaguide/ai/coding/m2.7/slowlog-get-multiple-records.png)

## 实战总结：AI 辅助编程的工作流思考

通过两个典型场景的实战，总结一下使用 Trae + 大模型辅助编程的一些经验和思考。

### AI 辅助编程能做什么

在上述两个场景中，AI 辅助编程体现了几个核心能力：

| 能力维度       | 场景表现                                 | 说明                                     |
| -------------- | ---------------------------------------- | ---------------------------------------- |
| 故障诊断与止血 | 场景一：快速定位连接池问题，提供降级方案 | 推理链条完整，能从异常栈帧梳理到调用链路 |
| 代码上下文理解 | 场景一：结合数据库 Schema 分析查询瓶颈   | 不局限于单文件，能关联跨模块的依赖关系   |
| 跨语言代码迁移 | 场景二：C 到 Go 的慢查询复刻             | 核心逻辑准确，工程规范适配有优化空间     |
| 复杂系统理解   | 场景二：Redis 源码分析                   | 能把握设计意图，输出结构化技术文档       |

### 实战中的经验与踩坑

**做得好的地方**：

- **快速收敛问题范围**：场景一中，模型从 N 处 Redis 调用快速定位到 4 种可能根因，再到最终确认 scan 操作导致连接池夯死，整个推理链条清晰
- **多层级方案输出**：止血方案、根因分析、长期优化建议分层给出，符合实际排障流程
- **TDD 自循环修复**：场景二中，指定 TDD 模式后，模型能根据测试反馈自我修复，减少人工干预

**需要注意的地方**：

- **方案激进**：模型给出的某些方案（如清除 Redis 缓存）可能过于激进，生产环境需要更保守的策略，这一点必须人工把关
- **工程规范适配**：生成的代码结构虽合理，但与个人/团队既有规范的契合度需要磨合。比如场景二中 `slowlog` 指令的文件组织就需要手动调整
- **边界情况处理**：部分极端场景的防御性代码建议人工补充——AI 能帮你走到 90%，剩下的 10% 还得靠自己
- **长流程一致性**：在复杂项目的持续迭代中，需要关注上下文记忆的衰减问题

### 使用 Trae + 大模型的一些建议

1. **提供完整上下文**：明确约束条件、编码规范、项目结构，模型输出质量会好很多
2. **分阶段确认**：复杂架构不要一次性让 AI 生成过多代码，分阶段确认和调整更可控
3. **关键决策人工把控**：架构层面的选择（如缓存策略、降级方案）需要开发者根据业务场景判断，AI 无法替你做
4. **善用 TDD 模式**：指定测试驱动开发流程，让模型在测试反馈中自我修复，效率更高

## 写在最后

Trae 作为 AI 编程 IDE，在接入大模型后体验比较流畅——Agent 模式下的上下文理解、任务拆解、代码生成、测试验收形成了完整的工作流。

但工具终究只是工具。回顾本文的两个场景：

- **场景一的 Redis 故障排查**，需要对 Redis 连接池机制、scan 命令的时间复杂度有清晰认知，才能判断模型给出的分析是否合理。
- **场景二的跨语言重构**，需要对 Redis 源码的设计理念、Go 语言的工程规范有深入理解，才能评估重构方案的质量。

AI 编程工具能缩短“从想法到代码”的时间，但对底层原理的掌握、对系统架构的判断力，依然需要开发者自身去积累。用好 AI 的前提，是比 AI 更懂你在做什么。

