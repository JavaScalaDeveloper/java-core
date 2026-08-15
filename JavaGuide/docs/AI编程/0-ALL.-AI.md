---
title: AI编程 AI优化汇总
---

# AI编程 AI优化汇总

> 基于 0-ALL.md 的 AI 优化版（原文较大）：正文收录重点篇并补充体系化内容；完整原文见 0-ALL.md。

## AI 补充：体系化梳理与易漏考点

> 本节在汇总原文基础上，补充面试追问、对比项与工程落地注意点。

### 补充要点
- 原则：上下文管理、可复现、小步提交、测试护栏。
- 实践：命令/规则/记忆如何组织；CLI 与 IDE 分工。
- 案例：把“能跑”提升到“可维护、可评审、可回滚”。

### 工程落地检查清单
- [ ] 是否有明确指标（延迟、吞吐、错误率、积压）？
- [ ] 失败是否可重试且幂等？
- [ ] 是否有限流/超时/降级？
- [ ] 是否有日志、链路追踪与告警？
- [ ] 配置变更与回滚是否可操作？


## TOC

1. Claude Code 接入第三方模型实战：JVM 智能诊断与慢查询治理 (`案例/Claude Code 接入第三方模型实战-JVM 智能诊断与慢查询治理.md`)
2. DeepSeek V4 + Claude Code 实战：代码能力深度测评 (`案例/DeepSeek V4 + Claude Code 实战-代码能力深度测评.md`)
3. IDEA + Qoder 插件多场景实战：接口优化与代码重构 (`案例/IDEA + Qoder 插件多场景实战-接口优化与代码重构.md`)
4. Kimi K3 实战：全栈项目、Java 项目改造与 3A 游戏 Demo (`案例/Kimi K3 实战-全栈项目、Java 项目改造与 3A 游戏 Demo.md`)
5. MiniMax M3 + Claude Code 实战：Redis 故障排查、SCAN 算法复刻与监控面板搭建 (`案例/MiniMax M3 + Claude Code 实战-Redis 故障排查、SCAN 算法复刻与监控面板搭建.md`)
6. Trae + MiniMax 多场景实战：Redis 故障排查与跨语言重构 (`案例/Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构.md`)
7. 10 道 AI 编程相关的开放性面试问题 (`实践/10 道 AI 编程相关的开放性面试问题.md`)
8. AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计 (`实践/AI 编程 Skills 选型清单-需求澄清、TDD、代码审查与 UI 设计.md`)
9. AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流 (`实践/AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流.md`)
10. Claude Code Agent View：多会话并行管理实战 (`实践/Claude Code Agent View-多会话并行管理实战.md`)
11. Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify (`实践/Claude Code 核心命令详解-code-review、loop、goal、batch、run、verify.md`)
12. Claude Code 使用指南：配置、工作流与进阶技巧 (`实践/Claude Code 使用指南-配置、工作流与进阶技巧.md`)
13. CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆 (`实践/CLAUDE.md 最佳实践-该写什么、不该写什么、项目变大后怎么拆.md`)
14. Codex 使用指南：配置、AGENTS.md 与 Agentic 工作流 (`实践/Codex 使用指南-配置、AGENTS.md 与 Agentic 工作流.md`)
15. JavaGuide 专属 draw.io 绘图 Skill 开源：用 Agent 自动生成可编辑的 draw.io 技术图 (`实践/JavaGuide 专属 draw.io 绘图 Skill 开源-用 Agent 自动生成可编辑的 draw.io 技术图.md`)
16. mattpocock/skills：我最推荐的 4 个 AI 编程 Skill (`实践/mattpocockskills-我最推荐的 4 个 AI 编程 Skill.md`)
17. oh-my-pi 开源终端 AI 编码代理体验 (`实践/oh-my-pi 开源终端 AI 编码代理体验.md`)
18. Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范 (`实践/Spec Coding 规范驱动编程实战-从 Vibe Coding 到 AI 代码规范.md`)
19. Vibe Coding 实用技巧总结：Git、Spec、上下文管理与多 Agent 协作 (`实践/Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作.md`)
20. 比 iTerm2 更适合 Claude Code/Codex 的终端，我换成 Ghostty 了 (`实践/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了.md`)
21. 强模型时代，AI 编程 Skills 还有必要装吗？ (`实践/强模型时代，AI 编程 Skills 还有必要装吗？.md`)
22. 在 IDEA 中使用 Claude Code 和 Codex：CC GUI 上手指南 (`项目/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南.md`)
23. Claude Code Hooks 详解：生命周期钩子与自动化工作流 (`原则/Claude Code Hooks 详解-生命周期钩子与自动化工作流.md`)
24. Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams (`原则/Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams.md`)
25. Claude Code Skills 技术实现细节与运行方式 (`原则/Claude Code Skills 技术实现细节与运行方式.md`)
26. Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选 (`原则/Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选.md`)
27. Claude Code 上下文管理详解：窗口预算、压缩与长任务治理 (`原则/Claude Code 上下文管理详解-窗口预算、压缩与长任务治理.md`)

---

<!-- source: 案例/Claude Code 接入第三方模型实战-JVM 智能诊断与慢查询治理.md -->

## [1] Claude Code 接入第三方模型实战：JVM 智能诊断与慢查询治理

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

---

<!-- source: 案例/DeepSeek V4 + Claude Code 实战-代码能力深度测评.md -->

## [2] DeepSeek V4 + Claude Code 实战：代码能力深度测评

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

---

<!-- source: 案例/IDEA + Qoder 插件多场景实战-接口优化与代码重构.md -->

## [3] IDEA + Qoder 插件多场景实战：接口优化与代码重构

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

---

<!-- source: 案例/Kimi K3 实战-全栈项目、Java 项目改造与 3A 游戏 Demo.md -->

## [4] Kimi K3 实战：全栈项目、Java 项目改造与 3A 游戏 Demo

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

---

<!-- source: 案例/MiniMax M3 + Claude Code 实战-Redis 故障排查、SCAN 算法复刻与监控面板搭建.md -->

## [5] MiniMax M3 + Claude Code 实战：Redis 故障排查、SCAN 算法复刻与监控面板搭建

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

---

<!-- source: 案例/Trae + MiniMax 多场景实战-Redis 故障排查与跨语言重构.md -->

## [6] Trae + MiniMax 多场景实战：Redis 故障排查与跨语言重构

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


---

---

<!-- source: 实践/10 道 AI 编程相关的开放性面试问题.md -->

## [7] 10 道 AI 编程相关的开放性面试问题

---
title: 10 道 AI 编程相关的开放性面试问题
description: 涵盖 Cursor、Claude Code、Trae 等 AI 编程 IDE 使用技巧，Spec Coding 与 Vibe Coding 区别，以及 AI 对后端开发影响等高频面试问题。
category: AI 应用开发
icon: "mdi:code-tags"
head:
  - - meta
    - name: keywords
      content: AI 编程,Cursor,Claude Code,Spec Coding,Vibe Coding,AI IDE,编程工具,后端开发
---

腾讯面试的时候，面试官问我：“用过什么 AI 编程工具？”。我说：“Trae。”

空气突然安静了两秒。我搞不清楚为什么面试官沉默了，当时我还在想：“是不是我回答得不够高级？”。

面试被挂后才意识到：Trae 是字节的，腾讯家的是 CodeBuddy，阿里家的是 Qoder。

段子归段子！今天小 G 分享 9 道当下校招和社招技术面试中经常会被问到的 AI 编程开放性问题，希望对你有帮助。

1. ⭐ **AI 编程 IDE**：Cursor、Claude Code 等工具的使用技巧
2. ⭐ **AI 对后端开发的影响**：AI 会淘汰初级程序员吗？最大风险是什么？
3. ⭐ **未来核心竞争力**：3 年后端工程师的核心竞争力是什么？

## AI 编程 IDE 使用技巧

### 用过什么 AI 编程 IDE 吗？什么感觉？

目前整体感觉是：AI 编程能力进步很快。它已经从几年前简单的代码补全，进化成了一个可以深度协作的工程助手。

我总结了一套自己的使用方法论：

1. 在接手复杂项目或模块时，我不会直接让 AI 写代码，而是先让 Cursor 分析整个代码库，生成一份包含核心架构、模块职责和数据流的文档。这一步非常关键，因为它决定了后续协作的质量。只有当我和 AI 对项目有一致理解时，后续产出才会稳定、高质量。
2. 对于每个独立的开发任务，开启一个新的对话，并提供必要的上下文，包括需求背景、涉及模块和约束条件。这种方式能减少上下文污染，让 AI 生成的代码更精准。
3. 定期删除冗余实现和废弃代码。旧代码会误导 AI 的判断，增加上下文噪音。

### AI 编程的核心原则

AI 是一个强大的知识库和辅助工具，可以帮我们快速实现功能、学习新知识。但如果完全依赖 AI 写代码而不理解其原理，个人技术能力可能会退化。

几个原则：

- AI 生成代码之后必须人工 Review。
- 关键逻辑必要时自己重写。
- 核心路径必须做压测和边界测试。

我希望效率提升，但不以牺牲技术能力为代价。

### ⭐ Cursor 实战技巧

> 这里是以 Cursor 为例，其他 AI IDE 都是类似的。

1. **先理架构再动手**：无论是自己写代码还是让 AI 生成代码，都必须先明确需求、整体架构和模块边界。如果在架构模糊的情况下直接编码，很容易出现重复实现或职责冲突，后期修改成本反而更高。
2. **单 Chat 专注单功能**：新功能或大改动开启新的 Chat，并在开头引入项目结构说明或关键文档作为上下文。这样可以避免历史对话干扰。
3. **功能落地后写指南**：让 AI 总结实现过程，抽象出通用步骤。比如新增接口的标准流程、文件导出的统一实现方式等。这些内容可以在后续类似需求中快速复用。
4. **不依赖 AI，主动复盘**：AI 仅作辅助，代码生成后需认真 Review，理解原理、优化不合理处。
5. **定期删无用代码**：清理冗余代码，减少对 AI 的误导和上下文干扰，提升开发效率。
6. **用好配置文件**：`.cursorrules` 定义 AI 生成代码的规则、风格和常用片段；`.cursorignore` 指定不允许 AI 修改的文件 / 目录，保护核心代码。
7. **持续维护文档**：项目重大变更后，让 AI 同步更新文档、记录 “踩坑” 经验。
8. **让 AI 先“学”项目**：大型项目先让 Cursor 分析代码库，生成含架构、目录职责、核心类的结构文档，作为后续开发的基础上下文。

### ⭐Claude Code 使用技巧

1. **上下文窗口是你最贵的资源**——所有技巧本质上都在帮你把这块白板用得更高效。
2. **先规划后执行**——Plan Mode 投资的是后面的时间。
3. **`CLAUDE.md` 自我进化**——把纠正转化为规则，让 AI 越用越顺手。
4. **并行是最大的效率杠杆**——多实例 + Worktree + 子代理。
5. **验证优于信任**——给 Claude 验收标准，让它自己检查。
6. **`/compact` 比反复纠正更有效**——上下文被污染后，压缩或清空重来更好。

Claude Code 详细内容我单独分享过：[Claude Code 使用指南](https://javaguide.cn/AI编程/claudecode-tips.html)。

## AI 编程对程序员的影响

### 你如何看待 AI 对后端开发的影响

AI 不会取代后端工程师，但会改变后端工程师的工作方式和能力结构。

AI 能帮我们处理重复的、模式化的工作：

- **在编码层面**：AI 工具在生成**模式化代码（Boilerplate）**方面表现不错，CRUD、单元测试、胶水代码的编写效率可提升 50%~70%。但在**分布式约束**（如分布式锁的超时续租、消息队列的 Exactly-once 语义、接口幂等性设计）上，AI 存在显著的**“幻觉”风险**——它往往只给出 Happy Path 代码，忽略了生产环境中的异常补偿逻辑、竞态条件处理和分布式事务边界控制。
- **在架构层面**：AI 正在催生新的应用范式，比如智能体（Agent）驱动的自动化业务流程，后端需要提供更灵活、更原子化的能力接口。传统的“大而全”接口正逐步拆解为可被 AI 调用的原子化能力。
- **在运维与排障层面**：AI 可以辅助分析日志、监控告警，甚至预测系统瓶颈。例如，基于 AIOps 的工具可以自动分析异常日志模式，定位根因。

AI 让后端工程师能更专注于业务建模、复杂系统设计和架构决策这些更具创造性的核心工作。

拿我自己来说，我经常会和 AI 讨论业务和技术方案，它总能给我不错的启发——尤其是在需求拆解和技术选型时，AI 能提供多角度的思考。

从实战经验来看，AI 辅助编程的能力可以归纳为两个维度：

- **从 0 到 1 的规划与交付**：给出需求描述，AI 可以自主完成技术选型和架构设计，适合快速验证构想，但方案仍需人工评审。
- **既有代码的增量优化**：在已有复杂度的代码库中，AI 能够理解既有架构、定位问题、完成优化。但 AI 给出的方案“看起来对”，上生产就翻车的情况并不少见。

### 前后端开发者的核心竞争力已经变了

说句实话，前后端开发者的核心竞争力已经变了。

以前前端拼手速和还原度，后端拼 CRUD 和八股文。现在这些东西 AI 全能做，而且又快又不喊累，就废点 Token。你花半天切的页面，AI 十分钟搞定；你写两小时的增删改查，AI 三分钟交卷。不是说这些技能没用了，而是不稀缺了，就不值钱。

前端受冲击最直接。页面还原、组件编写、样式调整，模式化程度太高，大模型最擅长这类活。但死掉的不是前端这个岗位，是“只会写页面”的前端。

有竞争力的前端往两个方向走：要么往深扎——性能优化、渲染管线分析、工程化基建，AI 替代不了；要么往难走——WebGL、大规模可视化、跨端底层原理，AI 生成质量差，反而是护城河。

后端稍好，但也别乐观。AI 写单个接口已经很强了，它的短板是系统级思考——服务怎么拆、数据模型怎么设计、缓存一致性怎么保证、容量瓶颈在哪。这些需要结合业务场景和技术债综合判断，AI 给的方案“看起来对”，上生产就翻车。

后端的核心竞争力在往系统设计、稳定性治理、复杂业务建模转。

不管前端后端，有一件事已经是基本功：高效跟 AI 协作。不是会用 ChatGPT 就行，而是能拆解问题、引导输出、判断结果靠不靠谱、识别安全隐患。你从“写代码的人”变成了“AI 的技术审核官”。

那些生成代码不看逻辑的人，短期效率高，长期在给自己埋雷——线上出问题只会反复问 AI，自己毫无排查思路。

### AI 会淘汰初级程序员吗

短期内不会淘汰，但会彻底改变初级程序员的能力结构。

以前初级工程师的价值在于：

- 写 CRUD 增删改查
- 写基础接口
- 写 SQL 查询语句
- 写基础工具类/配置

现在这些工作 AI 都能做得很好，甚至更高效、更少出错。但初级程序员不会被淘汰，只是价值创造点发生了迁移。

未来初级工程师需要具备：

- **需求拆解能力**：将模糊的业务需求转化为清晰的技术任务。
- **业务理解能力**：理解领域模型和业务规则，而不仅是“翻译需求”。
- **架构感知能力**：理解系统整体架构，知道自己代码在系统中的位置。
- **Prompt 表达能力**：能精准地描述问题，从 AI 获取高质量答案。

AI 让编程门槛变低，但对“理解能力”的要求反而更高。未来的初级工程师更像是一个“AI 协调者”，而非单纯的“代码编写者”。

从企业招聘角度看，纯编码能力的需求会减少，但对“能利用 AI 快速交付业务价值”的工程师需求会增加。

### AI 带来的最大风险是什么

我认为主要有三个层面：

**1. 技术能力退化**

过度依赖 AI 会导致工程师自身技术能力的退化，尤其是：

- **调试能力下降**：习惯让 AI 排查问题，自身对底层原理的理解变浅。
- **代码敏感度下降**：对“好代码”和“坏代码”的判断能力变弱，甚至不知道什么是好代码。
- **架构思维退化**：长期只关注功能实现，忽视架构设计和扩展性。

**2. 架构失控**

AI 生成的代码往往关注“当前功能可用”，容易忽视长期架构健康度。这很大程度上源于 **Vibe Coding（氛围编程）**——依赖模糊意图让 AI“自由发挥”。

- **模块边界模糊**：AI 倾向于“快速完成功能”，可能将多个职责混入同一模块。建议在编码前明确模块职责（DDD 风格的 Context Boundary），通过预先定义的接口契约约束 AI 生成范围。

- **技术债务累积**：为快速实现功能，AI 可能使用硬编码、绕过标准异常处理、引入不必要的循环依赖等反模式。这些债务在项目规模增长后会显著增加重构成本。

- **风格一致性缺失**：不同 Chat 会话中生成的代码可能采用不同的命名规范、错误处理模式和日志格式。建议通过 **Spec Coding** 的方式，预先定义统一的技术规范和代码风格（如 `.cursorrules`），让 AI 始终在同一套规则下工作。

- **资源治理缺失**：AI 不会自动考虑连接池大小、线程池队列长度、缓存过期策略等资源约束。例如，生成的代码可能创建大量线程但无界队列，在流量激增时导致内存溢出；或使用默认数据库连接池配置，在高并发下成为瓶颈。

- **工程规范适配**：AI 生成的代码架构虽然合理，但与既有工程规范的适配往往需要人工把关。比如文件名组织、代码风格差异、依赖管理策略——这些“看起来没问题”的代码，可能在团队协作中制造麻烦。

**3. 安全风险（尤其需要重视）**

- **代码漏洞**：AI 可能生成包含安全漏洞的代码，常见问题包括：
  - **SQL 注入**：使用字符串拼接而非参数化查询
  - **XSS**：未对用户输入进行 HTML 转义
  - **权限校验缺失**：缺少接口级/方法级权限检查
  - **敏感信息泄露**：日志中打印密钥、Token 或密码
  - **依赖漏洞**：引入存在已知 CVE 的第三方库
- **数据泄露**：不当使用可能泄露公司代码、业务逻辑给外部模型（尤其是云端托管的 AI 服务）。
- **供应链风险**：AI 推荐的依赖包可能存在已知漏洞或恶意代码。
- **密钥泄露**：AI 生成的代码可能硬编码密钥、Token 等敏感信息。

**4. 分布式场景下的失效模式（尤其危险）**

AI 生成的代码在分布式环境中极易忽略关键约束，导致生产事故：

| 失效模式               | AI 常见问题                    | 生产风险                               |
| ---------------------- | ------------------------------ | -------------------------------------- |
| **幂等性缺失**         | 未考虑接口幂等，直接插入或更新 | 网络超时重试导致重复数据、资金重复扣款 |
| **并发竞态**           | 缺乏分布式锁或 CAS 机制        | 库存超卖、并发修改覆盖、统计口径错误   |
| **分布式事务边界模糊** | 未明确事务边界和回滚策略       | 数据不一致、部分成功部分失败、难以追溯 |
| **超时与降级缺失**     | 仅设置默认超时，无熔断降级逻辑 | 级联故障、雪崩效应、服务整体不可用     |
| **连接池泄漏**         | 未及时释放连接或连接数配置不当 | 连接池耗尽、服务假死、重启才能恢复     |

**典型案例**：AI 生成“扣减库存”代码时，通常只写 `UPDATE stock SET count = count - 1 WHERE id = ?`，而忽略：

- 并发场景下的行锁或分布式锁
- 库存不足时的幂等性保证（同一请求多次扣减不应重复）
- 下游服务超时时的补偿机制
- 数据库连接超时与熔断策略

**应对策略**：

- 在 Spec 中**显式约束**：要求 AI 生成分布式锁、幂等校验、补偿逻辑的代码模板
- **强制 Code Review**：重点关注跨服务调用、事务边界、异常处理分支
- **混沌工程验证**：通过故障注入测试分布式场景下的容错能力

企业必须建立配套的安全治理体系：

- **强制代码审查**：AI 生成的代码必须经过人工 Review。
- **自动化扫描**：集成 SAST/SCA 工具，并增加针对 AI 特有风险的扫描（如 git-secrets, TruffleHog）。
- **架构守护**：配合 Spec Coding，使用 ArchUnit 等工具进行架构约束的自动化测试。

### AI 编程正在让程序员更累、更卷？

有人说：“以为有了 AI 提效就能轻松点？清醒点，它没让你变轻松，它只是让老板觉得你一个人能顶三个人用。”

这话听着扎心，但确实是很多人的真实感受。

AI 把你的能力放大了，以前一天写三个接口就觉得自己挺能干，现在一天能写十个，还能顺手把架构设计、测试用例、文档全部搞定。多巴胺疯狂分泌，你会忍不住接更多的活儿，因为“我能搞定”的信心被 AI 撑大了。

但问题来了：效率越高，老板欲望膨胀得越快。“一人即团队”的幻觉让招聘名额先砍一半，剩下的兄弟往死里用。以前你只需深耕一个模块，现在要同时应付前后端、多线程任务、甚至一堆 Agent。

更魔幻的是岗位少了，活多了。你不仅要写代码，还要审 AI 的代码、改 AI 的 Bug，最后还得给领导解释为什么 AI 生成的代码上线就崩。有时候分不清楚是自己用 AI 还是 AI 用自己。

### ⭐ 未来 3 年后端工程师的核心竞争力是什么

我认为核心竞争力的焦点会从“写代码能力”转向以下四个维度：

**1. 系统设计能力**

AI 非常擅长生成单个功能的代码，但**系统级设计**仍需工程师主导：

- 服务拆分与模块边界划分
- 微服务与单体架构权衡
- 数据模型设计与一致性策略
- 接口版本演进策略
- 分布式事务与幂等设计

**2. 复杂业务建模能力**

过去我们说 AI 不擅长领域建模，但现在情况已经变了。AI 在需求拆解、规则梳理、场景推演等方面已经很强。

不过，还是需要工程师配合将业务规则转化为适合当前项目可执行的设计：

- 领域驱动设计（DDD）建模
- 业务流程抽象与状态机设计
- 边界上下文划分

**3. 性能与稳定性治理能力**

AI 生成的代码往往只关注功能正确性，而忽视生产环境的性能特征：

- **P99 延迟**：AI 可能生成 N+1 查询、未加索引的 SQL、同步阻塞调用，导致长尾延迟激增
- **内存逃逸**：不恰当的对象创建和闭包使用可能导致频繁的 GC 甚至 OOM
- **连接池膨胀**：未限制并发数、未设置超时可能导致连接池耗尽，引发级联故障

工程师需要具备**性能度量与调优**能力：

- SQL 慢查询优化与索引设计（EXPLAIN 分析执行计划）
- 缓存策略设计与一致性保障（本地缓存 vs 分布式缓存）
- 异步化改造与线程池参数调优（核心线程数、队列容量、拒绝策略）
- 服务降级、熔断、限流方案（Sentinel、Hystrix 应用）
- 容量规划与弹性伸缩（压测评估 QPS 水位、自动扩缩容）

**验证手段**：AI 生成代码后，必须通过压测（JMeter、Gatling）验证 P95/P99 延迟，通过 JVM 监控（MAT、Arthas）排查内存泄漏，而非仅依赖功能测试。

**4. AI 协作能力**

如何高效地与 AI 协作本身就是一种核心竞争力：

- **精准表达需求（Prompt 能力）**：使用结构化 Prompt（背景-任务-约束-输出格式），避免模糊指令
- **拆分问题并引导 AI**：将复杂任务拆解为可独立验证的子任务，利用 Chain-of-Thought 引导推理
- **判断 AI 输出质量**：建立代码 Review checklist，关注正确性、安全性、性能、可维护性
- **代码安全与合规校验**：熟悉 OWASP Top 10，能够识别 AI 生成代码中的安全风险
- **结合 AI 工具链**：掌握 `.cursorrules`、自定义 Skills、IDE 插件的配置与使用

这本质上是从“代码编写者”向“AI 协作工程师”的角色转变。

未来竞争的关键不再是“代码产出速度”，而是“系统设计质量”和“业务价值交付能力”。

## 总结

AI 编程工具正在深刻改变开发者的工作方式。Cursor、Claude Code、Trae 等工具，已经从代码补全进化到了可以深度协作的工程助手。

从 Prompt 到 Harness，短短四年，写代码这件事正在从程序员的“手艺”变成 Agent 的“标准操作”。有人说：“未来可能一个 CTO 就能管所有 Agent，让它产出所有代码、部署、改 bug。”这话听着激进，但你仔细想想，好像也不是完全没可能。

**真正决定你职业发展的，是你如何使用这些工具，以及你在使用过程中是否保持了对技术的深度思考。**

说实话，从去年这个时候开始就挺焦虑 AI 发展，尤其是 Coding 方向。到今天，进化速度这么快，我反而有些释然了。会写代码正在从核心技能变成基础素养，就像会用 Excel 不算竞争力一样。真正值钱的是定义问题、设计方案、把控质量、交付业务价值。

最后给正在准备面试的几点建议：

1. **实际使用过才能回答好**：面试官问 AI 编程工具，最怕的就是“听说过没用过”。哪怕只是用 Cursor 写过几个小项目，也比只看过教程强。
2. **建立自己的方法论**：不要只是“会用”，要有自己的使用心得和最佳实践，这是面试中的加分项。
3. **保持批判性思维**：AI 生成代码后必须 Review，这是基本素养。面试中展示这种态度，会让面试官觉得你是一个靠谱的工程师。
4. **关注技术趋势但不要焦虑**：AI 会改变很多，但系统设计、架构思维、业务理解这些核心能力不会过时。

用好 AI 工具 + 保持独立思考，这两者缺一不可。AI 时代，程序员的未来说不定会在各行各业发光。共勉！


---

---

<!-- source: 实践/AI 编程 Skills 选型清单-需求澄清、TDD、代码审查与 UI 设计.md -->

## [8] AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计

---
title: AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计
description: 按任务场景整理 AI 编程 Skills 选型清单，覆盖需求澄清、TDD、代码审查、UI 设计、React 性能优化、PostgreSQL、Claude API 与 Skill 开发，并说明哪些工具适合按需安装。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: AI编程,Skills,Superpowers,mattpocock,grilling,Claude Code,Cursor,代码审查,TDD,UI设计,React,Next.js,PostgreSQL,Claude API,Skill开发
---

你好，我是小 G。最近有朋友问我：“你平时常用的有哪些 Skills？能不能给兄弟们分享一波？”

那当然可以啊！Skill 刚出来那会儿我就开始用了，后来也在公司内部定制过不少 Skill，同事朋友用了都说不错。

按理说，列份清单应该挺简单的。可真开始整理，我发现能入选的 Skill 其实并不多。而且，在整理 Skill 的过程中我再次感叹 AI 时代技术发展的太快了！有点顶不住啊！

Skill 刚出来那会，模型能力还没那么强。项目还没读明白就动手，代码写完不补测试，聊久了又忘掉前面的要求，这些情况都很常见。

于是我们把开发步骤一条条塞进 Skill：先澄清需求，再拆计划，测试要先写，改完还得审查。规则越细，心里越踏实。

可模型变强得太快了。

现在把同样的任务交给 Codex 或 Claude Code，大多数时候它们会自己读项目、查调用链、改文件、补测试、跑验证。以前需要在 `SKILL.md` 里反复叮嘱的事情，很多已经成了基础动作。

这时候还把 Skills 一股脑装满，就像给一个已经会干活的人塞了一摞操作手册。小改动也要写计划、走审查、跑完整验证，最后时间全花在流程上，多少有点折腾。

所以这份清单会收得比较克制。我现在愿意留下的，通常能补上模型猜不到的项目约定，或者自带专业流程、脚本、模板和参考资料。只会提醒“先读代码、再修改、最后跑测试”的 Skill，我基本不会再推荐了。

之前的[万字详解 Agent Skills](https://javaguide.cn/ai/agent/skills.html)讲过 Skill 和 Prompt、MCP 的区别；如果你想知道我为什么开始删减 Skills，可以接着看最新写的这篇 [强模型时代，AI 编程 Skills 还有必要装吗？](./强模型时代，AI 编程 Skills 还有必要装吗？.md)。

## Superpowers

Superpowers 把需求澄清、计划、TDD、Git Worktree、子 Agent 协作、代码审查和完成前验证串成一套开发方法。它适合陌生代码库、复杂功能和高风险改动；改文案、补空值判断、调整一条校验逻辑时，这套流程通常太重。

Superpowers 会依次调用这些 Skill：

| Skill                                             | 主要动作                               |
| ------------------------------------------------- | -------------------------------------- |
| `brainstorming`                                   | 编码前澄清需求、比较方案并保存设计     |
| `using-git-worktrees`                             | 创建隔离工作区，检查测试基线           |
| `writing-plans`                                   | 把设计拆成带文件位置和验证步骤的小任务 |
| `subagent-driven-development` / `executing-plans` | 分派子 Agent 或按批次执行计划          |
| `test-driven-development`                         | 执行 RED-GREEN-REFACTOR                |
| `requesting-code-review`                          | 按严重程度审查实现                     |
| `verification-before-completion`                  | 在宣布完成前检查证据                   |
| `finishing-a-development-branch`                  | 验证测试并处理合并、PR 或保留分支      |

这套流程已经适配 Claude Code、Codex、Cursor 和 OpenCode。Claude Code 对应的插件安装命令是：

```text
/plugin install superpowers@claude-plugins-official
```

Codex App 可以在侧边栏的 Plugins 中搜索 Superpowers；Codex CLI 则可以输入 `/plugins` 后搜索安装。不同 Agent 的安装方式并不互通，使用多个 Agent 时需要分别安装。

Claude Code 安装界面会让你选择作用范围：

![Superpowers 下载](https://oss.javaguide.cn/github/javaguide/ai/superpowers/superpowers-download.png)

| 选项                               | 作用范围         | 建议                                           |
| ---------------------------------- | ---------------- | ---------------------------------------------- |
| Install for you                    | 所有项目生效     | 已经确认自己愿意长期使用整套流程时再选         |
| Install for all collaborators      | 项目成员共享     | 团队已经约定采用同一开发方法时再提交           |
| Install for you, in this repo only | 只在当前仓库生效 | 第一次体验时优先选择，方便观察它是否拖慢小任务 |

我不再建议新手一上来全局安装。先在一个仓库里跑两三个真实任务，看看需求澄清、TDD 和审查流程是否真的减少返工，再决定要不要扩大范围。

项目地址：<https://github.com/obra/superpowers>

## mattpocock/skills

如果你只想加强开发流程里的某一个环节，可以看看 [mattpocock/skills](https://github.com/mattpocock/skills)。这个项目把工程经验拆成较小、容易修改、可以组合的 Skills，不会要求每个任务都走完同一套流程。

目前比较适合程序员的模块包括：

| Skill                    | 适合解决的问题                                             |
| ------------------------ | ---------------------------------------------------------- |
| `grill-me` / `grilling`  | 开工前持续追问，把需求、决策和依赖关系确认清楚             |
| `diagnosing-bugs`        | 按复现、缩小范围、提出假设、插桩、修复和回归测试的顺序排查 |
| `tdd`                    | 用 RED-GREEN-REFACTOR 循环开发功能或修复 Bug               |
| `code-review`            | 分别检查代码规范和实现是否符合原始需求                     |
| `to-spec` / `to-tickets` | 把已有讨论整理成规格说明，再拆成带依赖关系的任务           |
| `domain-modeling`        | 统一领域术语，并把关键决策写进 `CONTEXT.md` 和 ADR         |

跨 Agent 安装可以使用：

```bash
npx skills@latest add mattpocock/skills
```

安装器会让你选择需要的 Skills 和目标 Agent。按照项目当前的安装说明，还要勾选 `/setup-matt-pocock-skills`，然后在目标仓库运行一次，完成 Issue Tracker 和文档存放位置等配置。

第一次使用时，不必把整套都装上。需求经常没聊清楚，可以先选 `grill-me` 和 `grilling`；难定位的 Bug 多，再补 `diagnosing-bugs`。

这套 Skills 适合已经有基本开发习惯、只想补几个薄弱环节的人。如果项目里已经有稳定的需求模板、TDD 规范和代码审查流程，重复安装对应 Skill 不会带来多少帮助。

这几个 Skill 的实际用法和适用边界，我单独写了一篇：[mattpocock/skills：我最推荐的 4 个 AI 编程 Skill](https://javaguide.cn/AI编程/实践/mattpocock-skills.html)。

项目地址：<https://github.com/mattpocock/skills>

## ECC（原 Everything Claude Code）

Everything Claude Code 现在已经更名为 **ECC**。

项目已经从一套 Claude Code 配置扩展为跨 Agent 的 Harness 系统，覆盖 Codex、Claude Code、Cursor、OpenCode 等工具。

ECC 仓库同时放了 Skills、Agents、Hooks、Rules，以及记忆管理、安全扫描、持续学习和多语言工程规则。仓库里的 Skills 已经达到数百个，更像一套团队级 Harness 配置库。团队需要统一 Agent 的工作方式、记忆策略和安全检查时，集中管理会省去不少重复配置。

![上下文腐化](https://oss.javaguide.cn/github/javaguide/ai/harness/context-rot-diagram.png)

组件一多，选择成本也会跟着上来。项目只缺代码审查或 TDD 时，可以用 ECC 的选择性安装，只取 Java 代码审查、上下文持久化或安全扫描等对应组件，不必把整套系统塞进每个仓库。

项目地址：<https://github.com/affaan-m/ECC>

## Doc Co-Authoring

程序员写代码之前，最容易被低估的一步其实是：把需求讲清楚。

需求没讲清楚时，AI 编程 Agent 会很努力地往前冲，但冲的方向不一定对。它可能把一个还没定边界的想法直接写成实现，最后代码、测试、文档都很完整，只是和真实需求差了一截。

Anthropic 官方 Skills 仓库里的 **doc-coauthoring** 就是为这类场景准备的。它关注的重点很具体：把写 PRD、技术方案、决策文档、RFC 这类工作拆成一套协作流程，先处理上下文、结构和读者理解，句子润色只是后面的事。

doc-coauthoring 用三个阶段处理一份文档：

| 阶段                       | 做什么                                                       |
| -------------------------- | ------------------------------------------------------------ |
| **Context Gathering**      | 先收集背景、约束、历史讨论、架构依赖和利益相关方关注点       |
| **Refinement & Structure** | 按章节迭代，先提问和发散，再筛选内容，最后写成可读段落       |
| **Reader Testing**         | 用一个全新上下文的 Claude 测试文档，检查读者是否会误解或遗漏 |

拿订单退款模块举例。Coding Agent 开工前，可以先让 doc-coauthoring 整理一份短技术方案，把退款状态机、接口幂等、库存和优惠券回滚、失败后的人工补偿逐项写清楚。

文档定下来后，小任务可以直接把技术方案和验收标准交给 Agent；改动涉及多个模块时，再接 Superpowers 拆计划、写测试和审查代码。这样做主要是为了把分歧留在文档阶段解决，免得实现完成后再改范围。

Claude Code 的安装命令如下：

```bash
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
```

`example-skills` 是一组示例 Skill，doc-coauthoring 只是其中之一。装过这组插件后，后面提到的 skill-creator 也会一起提供，不用重复安装。

项目地址：<https://github.com/anthropics/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/doc-coauthoring>

## UI UX Pro Max

这是一个专为 AI 编程 Agent（Claude Code、Cursor、Windsurf 等）设计的专业 UI/UX 设计智能 Skill。

![UI UX Pro Max](https://oss.javaguide.cn/github/javaguide/ai/harness/ui-ux-pro-max-skill.png)

它会根据产品类型和行业特性生成设计系统，再把配色、字体、布局、动效和反模式交给 Agent 执行。与只有几段审美提示词的轻量 Skill 相比，它带了一套可以检索的设计资料。

当前公开版本提供的主要数据包括：

| 资源类型       | 数量   | 说明                                                    |
| -------------- | ------ | ------------------------------------------------------- |
| UI 风格        | 84 种  | Glassmorphism、Neumorphism、Bento Grid、AI-Native UI 等 |
| 产品类型与色板 | 192 组 | 按 SaaS、金融、医疗、电商等产品场景匹配                 |
| 字体搭配       | 74 组  | 包含 Google Fonts 组合                                  |
| 图表类型       | 25 种  | 面向仪表盘和分析页面                                    |
| 推理规则       | 161 条 | 按行业生成设计系统                                      |
| UX 准则        | 98 条  | 覆盖反模式、交互和可访问性                              |
| 支持技术栈     | 22 种  | React、Next.js、Vue、Nuxt、SwiftUI、Flutter、JavaFX 等  |

以“帮我做一个美容 SPA 的落地页”为例，生成结果会先把页面归到健康养生场景，再给出 Soft UI 方向，配色采用淡粉、鼠尾草绿和金色点缀，字体选择 Cormorant Garamond。同一份结果还会列出反模式，例如避免常见的紫粉渐变。

Claude Code 可以从插件市场安装：

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Codex、Cursor、Windsurf 等工具更适合使用当前官方 CLI。包名是 `ui-ux-pro-max-cli`，旧的 `uipro-cli` 已经不再更新：

```bash
npx ui-ux-pro-max-cli init --ai codex
npx ui-ux-pro-max-cli init --ai cursor
```

它的检索脚本依赖 Python 3。安装完成后，直接描述页面类型和行业即可触发：

```text
帮我做一个 SaaS 产品的落地页
设计一个医疗分析仪表盘
做一个深色主题的金融 App
```

交付检查会继续检查图标、hover 状态、文本对比度和 `reduced-motion`，其中包括“不用 emoji 充当图标”这类明确规则。已有设计系统的项目要谨慎使用自动推荐，否则新生成的色板、字体和组件规范可能与现有规则冲突。这种情况下，把团队已有的设计规范写成项目级 Skill 会更合适。

项目地址：<https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>

不需要完整设计知识库时，可以换成 Anthropic 官方的 **frontend-design** Skill。

当前版本更强调先确定鲜明的视觉方向，再通过字体、配色、布局、动效和细节把方向落实，同时避免模板化的“AI 页面”观感。它不再把禁用 Inter、Roboto 或紫白渐变写成固定规则；是否使用某种字体和配色，应由品牌规范、内容类型和既有设计系统决定。

## Vercel React Best Practices

现在让 Agent 写出一个能跑的 React 页面并不难，容易被忽略的是后面的性能问题：几个本来可以并行的请求被写成串行，客户端收到一大坨用不到的数据，组件因为依赖项处理不当反复渲染，随手引入一个包又把 Bundle 撑大了。

Vercel 官方维护的 **vercel-react-best-practices** 就盯着这些问题。截至 2026 年 7 月，它在 [skills.sh](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) 上的累计安装量约为 57 万次，包含 70 条 React 和 Next.js 性能规则，并按影响程度分成 8 类。

| 优先级     | 主要检查内容                                                                |
| ---------- | --------------------------------------------------------------------------- |
| CRITICAL   | 消除请求瀑布、控制 Bundle 体积                                              |
| HIGH       | 服务端缓存与请求去重、并行获取数据、减少 React Server Components 序列化开销 |
| MEDIUM     | 客户端请求去重、依赖项管理、减少无效重渲染、处理 Hydration 问题             |
| LOW-MEDIUM | DOM 批处理、缓存重复计算、用 Set 或 Map 优化高频查找                        |

每条规则都带有错误代码、修改后的代码和适用条件。写新页面、做性能审查或者重构 React 代码时，让 Agent 按这些规则逐项检查，比临时提醒一句“帮我优化性能”更具体。

安装命令如下：

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

这套规则只适合 React 和 Next.js 项目，Vue、Svelte 或后端项目没必要安装。性能优化也不能只看规则清单，涉及缓存、序列化和渲染的问题，最后还是要结合构建产物、React Profiler 和真实请求链路验证。

项目地址：<https://github.com/vercel-labs/agent-skills/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/react-best-practices>

## sanyuan-skills

`sanyuan-skills` 当前收录 6 个独立 Skill，安装时可以按目录选择。只想在提交前补一轮代码审查，就装 Code Review Expert，不会同时引入需求澄清、TDD 等流程。

| Skill              | 适用场景                                               |
| ------------------ | ------------------------------------------------------ |
| Code Review Expert | 从 SOLID、安全、性能、错误处理和边界条件等维度审查代码 |
| Sigma              | 通过苏格拉底式追问学习技术概念                         |
| Skill Review       | 检查 Skill 的结构、描述、流程和 Token 使用             |
| Skill Forge        | 创建新的 Skill                                         |
| Wiki Ingest        | 把文章、文档或笔记整理成可交叉引用的 Wiki              |
| Book Study         | 阅读辅导、掌握度测试和间隔复习                         |

Java 开发者最容易直接用起来的是 Code Review Expert。它适合在提交前补一轮独立审查，但不能替代项目自己的检查规则。事务边界、错误码约定、日志字段和兼容性要求仍然要放进仓库的 `AGENTS.md`、审查说明或测试里。

每个 Skill 都可以单独安装：

```bash
npx skills add sanyuan0704/sanyuan-skills --skill code-review-expert
npx skills add sanyuan0704/sanyuan-skills --skill sigma
npx skills add sanyuan0704/sanyuan-skills --skill skill-review
npx skills add sanyuan0704/sanyuan-skills --skill skill-forge
```

安装后可以直接调用：

```text
/code-review-expert    # 审查当前 git 变更
/sigma <主题>          # 启动学习辅导，如 /sigma React Hooks
/skill-review          # 检查已有 Skill
/skill-forge           # 创建新技能
```

项目地址：<https://github.com/sanyuan0704/sanyuan-skills>

## Supabase Postgres Best Practices

**supabase-postgres-best-practices** 由 Supabase 官方维护，内容主要围绕 PostgreSQL，普通 PostgreSQL 项目也能用。截至 2026 年 7 月，它在 [skills.sh](https://skills.sh/supabase/agent-skills/supabase-postgres-best-practices) 上的累计安装量约为 30 万次。

它把 PostgreSQL 相关规则分成 8 类：查询性能、连接管理、安全与 RLS、表结构设计、并发与锁、数据访问模式、监控诊断和高级特性。每条规则会说明问题出现的原因，再给出错误 SQL、修改后的 SQL、`EXPLAIN` 分析和性能指标。

比如让 Agent 审查一条“按用户、状态和创建时间查询订单”的 SQL，它会继续检查组合索引的字段顺序、查询条件是否命中索引、连接池是否合理，以及这个改动会不会影响写入和锁竞争，不会只留下一句“加个索引”。

安装命令如下：

```bash
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
```

Java 后端项目只要使用 PostgreSQL，也可以直接拿来检查 SQL、表结构和数据库配置。MySQL 项目不要照搬其中的 RLS、索引和数据库参数；涉及建索引、改字段或调整连接池时，还要结合数据量、`EXPLAIN ANALYZE` 和压测结果判断，不能让 Agent 直接改生产库。

项目地址：<https://github.com/supabase/agent-skills/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/supabase-postgres-best-practices>

## Claude API

Claude API 这个 Skill 面向的是 AI 应用开发。只在 IDE 里使用 Coding Agent 时可以跳过；做智能客服、代码生成平台、文档分析工具或内部 Agent 平台时，它可以用来核对 SDK 和 API 细节。

模型名称、参数和流式事件都可能随版本变化，凭记忆写调用代码容易用到旧接口。Anthropic 官方的 **claude-api** Skill 覆盖模型选择、价格、参数、流式输出、工具调用、MCP、Agent、缓存、Token 计算和模型迁移，并按语言拆分文档：

| 语言 / 接入方式 | 说明                             |
| --------------- | -------------------------------- |
| **Python**      | 使用官方 Python SDK              |
| **TypeScript**  | 使用官方 TypeScript SDK 和 Zod   |
| **Java**        | Java / Kotlin / Scala 项目可参考 |
| **Go**          | Go 服务端应用可参考              |
| **Ruby / PHP**  | 适合对应语言栈项目               |
| **C#**          | .NET 项目可参考                  |
| **cURL**        | 原始 HTTP、Shell 脚本或调试用    |

遇到 SDK 方法名、参数、流式事件或工具调用结构时，这个 Skill 会先查对应文档，再生成代码。它的主要作用就是减少 Agent 凭旧版本记忆猜接口的情况。

项目地址：<https://github.com/anthropics/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-api>

## skill-creator

这是 Anthropic 官方 Skills 仓库中的一个元技能，用来创建、修改和评估 Skill。

它提供了一套 Skill 开发工作流：

| 阶段              | 工作内容                                               |
| ----------------- | ------------------------------------------------------ |
| **意图捕获**      | 理解你想让 Skill 做什么，明确边界和目标                |
| **起草 SKILL.md** | 编写 Skill 的核心指令文件，包含 frontmatter 和指令内容 |
| **测试验证**      | 创建测试用例，运行对比实验（有 Skill vs 无 Skill）     |
| **迭代优化**      | 根据测试反馈持续改进指令                               |
| **描述优化**      | 优化 Skill 的 description，提高触发准确性              |

它还带有评估工具，可以对比“使用 Skill”和“不使用 Skill”的输出，记录时间、Token 和断言结果，再生成可视化报告。如果没有 Skill 时模型已经能稳定完成任务，就没有必要继续维护一份额外流程。

适合想给团队做专属 Skill 的开发者作为起点。

项目地址：<https://github.com/anthropics/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skill-creator>

## 怎么选

| 你反复遇到的问题                         | 优先考虑                         | 不建议安装的情况                           |
| ---------------------------------------- | -------------------------------- | ------------------------------------------ |
| 复杂功能容易漏需求、漏测试               | Superpowers                      | 主要处理小改动，现有 Agent 已能稳定完成    |
| 只想补需求澄清、Bug 诊断、TDD 或代码审查 | mattpocock/skills                | 项目已经有稳定的等价流程                   |
| 团队要统一 Agents、Hooks、记忆和安全策略 | ECC                              | 只缺一项代码审查或 TDD 流程                |
| PRD、技术方案经常写不清楚                | Doc Co-Authoring                 | 只是改一小段已有文档                       |
| 没有设计系统，AI 生成页面经常千篇一律    | UI UX Pro Max                    | 项目已经有成熟的组件库和设计规范           |
| React / Next.js 页面能跑但性能问题多     | Vercel React Best Practices      | 项目没有使用 React                         |
| 提交前想补一轮通用代码审查               | Code Review Expert               | 项目风险主要来自内部规则，通用检查帮不上忙 |
| PostgreSQL 查询和表结构经常需要返工      | Supabase Postgres Best Practices | 项目使用 MySQL 或其他数据库                |
| 正在开发 Claude API 应用                 | Claude API                       | 只在 IDE 里使用 Coding Agent               |
| 想把反复失败的任务沉淀成 Skill           | skill-creator                    | 没做过无 Skill 基线测试                    |

我的做法是先不用 Skill 跑一次同类任务。模型本来就能稳定完成，就不装；同一个问题反复出现，再去看候选项目的 `SKILL.md`、`scripts/` 和 `references/`，确认它确实补上了缺口，也没有危险命令或过宽权限。

第一次安装尽量限定在当前仓库。连续跑两三个真实任务后，再比较返工次数、执行时间和结果稳定性。没有明显改善就删掉，确认长期有用再考虑全局启用。

具体从哪个开始，取决于最近哪类问题最常返工：代码审查总漏同一类风险，可以试 Code Review Expert；需求还没定清楚 Agent 就开工，可以试 Doc Co-Authoring，或者更轻量的 [`grilling`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/productivity/grilling/SKILL.md)。

这份清单没有默认必装项。能说清一个 Skill 解决什么问题、什么时候触发，以及失效后怎么删，它才值得留在列表里。


---

---

<!-- source: 实践/AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流.md -->

## [9] AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流

---
title: AI 编程选 CLI 还是 IDE？按任务选择更合适的工作流
description: 深度对比 Claude Code、Cursor、Kiro、TRAE 等主流 AI 编程工具，解析 CLI 与 IDE 的核心差异、适用场景与选型建议。
category: AI 编程技巧
head:
  - - meta
    - name: keywords
      content: AI编程,CLI,IDE,Claude Code,Cursor,Kiro,TRAE,AI工具对比,AI编程选型
---

说实话，这个话题我酝酿很久了。很早就想聊聊，但一直拖着没有抽出时间写（其实就是懒！）。

每次在群里聊 AI Coding 或者公众号分享 AI Coding 技巧，总有人问：“Claude Code 那个黑窗口到底好在哪？我 Cursor 用得好好的为什么要换？” 然后另一边马上有人回：“都 2026 年了还在用 IDE？你落后了啊，CLI 才是正解！”。

两边都有道理，但两边说的又都不全面。今天我把自己这大半年从 IDE 到 CLI 再到两者混用的经历，结合最近行业里几款重磅产品的实际体验，一次性讲清楚。

## 先搞清楚：CLI 和 IDE 到底是什么

这里说的 CLI 和 IDE，除了界面形态不同，也对应两种常见的人机协作方式。

**AI IDE 工具**把代码编辑、运行调试和 AI 对话放进同一个图形界面。Cursor、Kiro、Qoder、TRAE、Windsurf 都属于这一类，其中 Cursor、Windsurf、Kiro、TRAE 基于 VS Code 二次开发，界面和操作习惯对 VS Code 用户比较友好。Zed 走的是原生 IDE 路线；JetBrains + Qoder 插件则是在现有 IDE 里接入 Agent 能力。

![Qoder 主界面](https://oss.javaguide.cn/github/javaguide/ai/coding/qoder-view.png)

**AI CLI 工具**把主要交互放在终端里，Claude Code、Codex、Qwen Code、OpenCode 都是常见选择。你输入一段自然语言指令，Agent 会自己读仓库、改代码、跑测试，再根据报错继续调整。任务跑起来之后，开发者不必一直盯着每一行代码，更多时候是在定目标、补充约束和验收结果。

![Claude Code 运行 /simplify 命令](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-command-run.png)

![Claude Code 开启优化代码](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-optimization-start.png)

粗略地说，CLI 更适合把目标和验收条件交给 Agent，让它连续执行；IDE 更适合开发者盯着代码，随时插手修改。不过，这条线已经越来越模糊了，后面会专门讲到。

| 维度     | AI IDE 工具                      | AI CLI 工具                        |
| -------- | -------------------------------- | ---------------------------------- |
| 交互方式 | 图形界面（鼠标 + 键盘）          | 以终端命令和文字指令为主           |
| 常见协作 | 边写边审，随时插手               | 先定目标，中途检查，最后验收       |
| 主要特点 | Diff、补全和调试集中在同一个界面 | 适合连续执行长任务，也方便接入脚本 |
| 典型场景 | 日常编码、UI 调试、小功能修改    | 大规模重构、多文件变更、CI/CD 集成 |
| 代表产品 | Cursor、Kiro、TRAE、Qoder        | Claude Code、Codex、Qwen Code      |

## 这场争论是怎么开始的

Vibe Coding 比 Claude Code 早了三周多。

2025 年 2 月 2 日，Andrej Karpathy 在 X 上提出了 [Vibe Coding](https://x.com/karpathy/status/1886192184808149383)。他描述的是一种很随性的编程方式：用自然语言让 AI 改代码，接受改动，遇到报错再把错误丢回去继续修，甚至可以不仔细阅读 Diff。接受改动却不仔细看 Diff，让它和常规 AI 辅助开发拉开了距离。后者仍然要求人理解关键改动、检查测试结果，并为最终交付负责。

![前 Tesla AI 主管 Andrej Karpathy 提出了“Vibe Coding”](https://oss.javaguide.cn/github/javaguide/ai/coding/karpathy-vibe-coding.png)

2 月 24 日，Anthropic 又以限量研究预览的形式发布了 [Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet)。它把 Agent 直接放进终端，可以读取文件、执行命令、修改代码并运行测试。讨论的单位随之变了：过去大家比较一次补全准不准，现在开始追问 Agent 能不能独立完成一整个任务。

3 月初，YC 在一场名为 [Vibe Coding Is The Future](https://www.youtube.com/watch?v=IACHfKmZMr8) 的对谈中又披露了一组很抓眼球的数据：2025 年冬季批次中，四分之一的初创团队有 95% 的代码由 AI 生成。讨论随即从“AI 能写多少代码”滑到了“一个人能不能顶过去一支团队”。

不过，95% 只是代码生成比例，不能说明这些代码无需理解、测试和返工，更不能直接换算成节省了多少人力。社交平台上那些“1 小时完成团队 1 年工作量”的案例，任务范围和验收口径都不一样，拿来证明产品能力并不靠谱。

Claude Code 后续加入了 `/compact`、`/code-review`、`/simplify`、Hooks、Agent Teams 等能力。这些功能让 CLI 的工作单位越来越接近一条完整任务链：读代码、修改、验证，再继续迭代。

IDE 产品则从另一条路补齐 Agent 工作流。Kiro 用 Requirements-First、Design-First 和 Quick Spec 等流程给 Agent 补上需求、设计和验收依据；TRAE 把浏览器调试、数据库连接和部署收进 SOLO 流程。详见 [Kiro Specs 文档](https://kiro.dev/docs/specs/feature-specs/)。

CLI 工具也在补界面。Claude Code 和 Codex 后来都推出了 VS Code 插件，把 Agent 状态、代码 Diff 和结果审查带回编辑器。

今天再看，CLI 和 IDE 的区别主要留在入口：一个从终端开始，一个从编辑器开始；任务规划、Agent 执行和结果审查已经越做越像。

## 各有什么产品值得关注

### CLI 阵营

**1. Claude Code —— 面向 Claude 模型的 CLI Agent**

Claude Code 是 Anthropic 在 2025 年 2 月发布的 CLI Agent。模型、权限控制和工具调用都由同一家公司维护，几部分可以跟着产品一起调整。本文更新于 2026 年 7 月 24 日，示例按 Claude Fable 5 模型家族表述；具体型号、上下文长度和可用功能，还是要以账户里的实际显示为准。

2026 年 1 月的一次大更新包含 1096 次提交。创始人 Boris Cherny 当时展示了让 Claude Code 参与自身开发的过程，他把这种做法称为“用 AI 加速 AI”。

几项常用能力：

- 四 Agent cleanup 审查（`/simplify`，偏清理，不负责找 correctness bug）
- diff 正确性审查（`/code-review`）
- 上下文压缩（`/compact`）
- Hooks 机制（代码变更后自动触发验证）
- Agent Teams（多 Agent 点对点通信协作）
- Skills/Plugins 生态

现实门槛：需要接入 Claude Max 订阅才能发挥最大能力。不过可以通过 CC Switch 工具接入国内的 MiniMax 或 GLM 等模型作为替代方案，借此控制使用成本。

**2. Codex —— OpenAI 的编码 Agent**

OpenAI 提供的编码 Agent，支持 CLI、App 等形态。截至 2026-07-24，示例按 GPT-5.6 模型家族表述；模型和功能受账户、运行环境与配置影响。Harness Engineering 更准确的含义是为 Agent 设计环境、约束和反馈回路，并不等于人类不再读或写代码。

**3. Qwen Code —— 国内模型厂商入局**

阿里出品，贴着 Qwen 模型优化。代表了国内模型厂商亲自下场做 AI Coding 产品的趋势。

**4. OpenCode —— 开源社区的 CLI 选择**

轻量级开源 CLI 工具，可以接入多种模型后端，适合想要自定义和二次开发的开发者。

### IDE 阵营

**1. Cursor —— AI IDE 的代表产品**

Cursor 基于 VS Code 二次开发，很早就把 AI 补全、对话和 Agent 操作塞进了编辑器。Tab 补全、可视化 Diff、Agent Mode 都是它的强项。套餐和用量规则的变化影响过用户口碑，但只看编辑和审查体验，Cursor 依然经常被拿来和其他 AI IDE 比较。

**2. Kiro —— Spec 工作流的探索者**

Kiro 由 AWS 推出，提供 Requirements-First、Design-First 和 Quick Spec 等多种 Spec 工作流。需求还比较模糊时，可以先把 Requirements 写清楚；已经有设计方案，也可以从 Design 或 Quick Spec 开始，不需要每个任务都走完全相同的流程。

我更看重 Spec 带来的两个检查点：动手前，人可以先看需求和设计有没有跑偏；执行时，Agent 也有现成的任务说明和验收依据。做复杂 Feature 时这套流程很省返工，换成改文案、调样式之类的小需求，完整走一遍就有点重了。

**3. TRAE —— 一站式体验的代表**

TRAE 是字节推出的 AI 原生 IDE。它的 SOLO 模式把需求实现、浏览器调试、数据库连接和部署放进一条流程里，很多配置不需要用户自己来回切工具。对于想先把想法做成可运行原型的人，这种一站式体验确实省事。

**4. Qoder —— CLI 内核 + IDE 外壳的混合体**

Qoder 采用了“IDE 外壳 + CLI 内核”的组合。Editor 模式偏人机协同，你写代码，AI 在旁边补全和修改；Quest 模式更接近把整个任务交给 Agent，底层由 Qoder CLI 驱动。两种模式放在同一个 IDE 里，需要时直接切换。

需要边写边改时留在 Editor，碰到多文件任务再交给 Quest，这样可以少换一次工具。不过，CLI 能力能否同步到 IDE、相关协议是否完整兼容，仍取决于具体版本，不能默认新能力会第一时间全部接入。

### 原生 IDE 阵营（非 VS Code）

**1. Zed —— 高性能原生 IDE**

Zed 由 Atom 原班人马打造，底层使用 Rust 编写，采用了不同于 VS Code 扩展体系的原生架构。它主打启动速度和编辑响应，也内置了 AI 功能，比较适合已经厌倦 VS Code 系产品，又不想放弃 Agent 能力的开发者。

**2. JetBrains + Qoder 插件 —— 老牌 IDE 的 AI 升级**

JetBrains 系列（IntelliJ IDEA、PyCharm、WebStorm 等）在 Java/Kotlin、Python、JavaScript 等语言和框架上积累了很深的索引、重构和调试能力。Qoder 插件把 CLI 内核的 Agent 能力接进 JetBrains。已经习惯这些 IDE 的开发者，不必为了使用 Agent 整套迁移到另一个编辑器。

### 产品全景图

| 产品              | 形态           | 模型绑定            | 主要特点                         | 更适合                                      |
| ----------------- | -------------- | ------------------- | -------------------------------- | ------------------------------------------- |
| Claude Code       | CLI            | Claude Fable 5 家族 | 与 Claude 模型和工具调用一起迭代 | 习惯终端、经常处理长任务的开发者            |
| Codex             | CLI + App      | GPT-5.6 家族        | 多环境 Agent 与任务管理          | OpenAI 生态用户                             |
| Qwen Code         | CLI            | Qwen                | 围绕 Qwen 模型适配               | 想使用国内模型的开发者                      |
| Cursor            | IDE            | 多模型              | Tab 补全、可视化 Diff            | 日常开发离不开 IDE 的开发者                 |
| Kiro              | IDE            | Claude（Opus）      | 多种 Spec 起始工作流             | 复杂 Feature 和团队协作                     |
| TRAE              | IDE            | 多模型              | SOLO 一站式流程                  | 快速制作和验证原型                          |
| Qoder             | IDE + CLI      | 多模型              | Editor、Quest 两种模式可以切换   | 想在一个产品里兼顾编辑和 Agent 任务的开发者 |
| Zed               | 原生 IDE       | 多模型              | Rust 编写，启动和编辑响应快      | 更看重编辑器性能的开发者                    |
| JetBrains + Qoder | 原生 IDE + CLI | 多模型              | 语言与框架支持结合 Agent 能力    | 已经习惯 JetBrains 的 Java/Python/JS 开发者 |

## CLI 到底强在哪

我从 IDE 切到 CLI 之后，最先改变的是任务颗粒度。以前更多是让 AI 补下一段代码，或者在当前文件里改几行；到了 CLI 里，我会直接交代一个完整目标，让它读仓库、改代码、跑测试，再根据报错继续修改。

任务一长，这种差别就出来了。Agent 跑上几十分钟时，我可以先去做别的，过一会儿再回来检查进度。IDE 继续拿来读代码、查资料，CLI 就放在旁边干活，两边互不耽误。那种“去喝杯咖啡，回来它还在跑”的感觉，确实很容易让人上瘾。

CLI 也容易接进现有的工程流程。同一套命令可以在本地终端、远程主机或 CI 里调用，退出码和文本输出也方便交给脚本处理。

不过，所谓 Run Everywhere 只能说明交互方式容易迁移，不代表换个环境就能原样运行。文件系统、凭据、网络、沙箱、审批方式和可用工具都可能不同，该配的权限和验证一项也少不了。

很多 Agent 功能会先放到 CLI 里试验。命令和工具协议改起来快，不用先设计一整套图形交互。但这个顺序并不固定，可视化编辑、交互调试一类能力，IDE 往往更早做出来，用起来也更顺手。

## IDE 的不可替代之处

CLI 用得多了以后，我也没有把 IDE 扔掉。平时写一小段代码、调试接口或者看 Diff，IDE 依然更顺手。

一次改动跨了十几个文件时，可视化 Diff 可以直接列出改了哪些行、哪些文件需要回退。Claude Code 和 Codex 也提供 `/diff`、Review 等能力，CLI 并非只能靠 `git diff` 硬翻；只是文件导航、类型信息、断点和 Diff 全放在一个界面里，审查起来确实省事。

Tab 补全则是另一种工作节奏。实现思路已经比较明确时，我并不想把整个任务都交给 Agent，自己写几行、按一下 Tab 接受补全，反而更快。CLI 可以完全绕过补全这一步，但不是每个小改动都值得启动一次完整任务。

前端和 UI 问题经常要边看页面渲染，边查网络请求、打断点，这些本来就是 IDE 擅长的事情。CLI 可以再接 Agent Browser 等工具，能做归能做，配置和操作链路还是会多一层。

对于刚接触 AI 编程的人，IDE 也友好得多。终端环境、命令、权限和 Git 操作都被收进按钮和面板里，至少不会刚开始就卡在工具配置上。

## 到底怎么选

我的结论是：**不存在哪个更好，只存在哪个更适合当前场景。** 一个成熟的工作流，应该能根据任务、背景、团队自如切换。

### 按任务粒度选

| 任务类型                       | 推荐工具                           | 理由                     |
| ------------------------------ | ---------------------------------- | ------------------------ |
| 小修小补（改函数、修样式）     | IDE（Tab 补全 + 可视化 Diff）      | 速度快、反馈即时         |
| 中等任务（加接口、改模块）     | Plan 模式（CLI 或 IDE Agent 均可） | 平衡规划与执行           |
| Feature 级别（新功能，大重构） | Spec 模式 或 CLI 长时运行          | 自主性强、适合长时间迭代 |

### 按个人背景选

| 你的情况                | 推荐                                | 理由                                       |
| ----------------------- | ----------------------------------- | ------------------------------------------ |
| 资深后端，习惯终端操作  | CLI 为主                            | 能把 CLI 的效率优势发挥到极致              |
| 前端开发，频繁调试 UI   | IDE 为主                            | 浏览器集成和可视化是刚需                   |
| 非科班背景、AI 创业者   | IDE（Cursor / TRAE / Kiro）         | 门槛低、一站式体验                         |
| 想兼顾两种形态          | 选择同时提供编辑与 Agent 模式的工具 | 在同一产品中切换交互方式                   |
| 追求编辑器性能          | Zed                                 | Rust 编写，启动极快，对 VS Code 疲劳者友好 |
| Java 项目，用 JetBrains | JetBrains + Qoder                   | 深度语言支持 + AI Agent 能力，升级成本最低 |

### 按团队协作选

- 团队已经在做需求和设计评审，可以把 Spec 文档当成版本化资产提交到 Git，先过 Spec Review，再进入 Code Review。客户端不必强制统一，文件格式和验收流程统一就够了。
- 如果团队更看重工具自由，可以把项目约束写进 AGENTS.md 和 Rules。有人用 CLI，有人留在 IDE，只要最后执行的是同一套测试、检查和提交规范，就不会因为客户端不同而失控。

## 行业趋势：CLI 和 IDE 正在快速融合

再争论 CLI 和 IDE 谁会取代谁，意义已经不大了。两边都在补自己缺的那部分体验。

Claude Code 推出了官方 VS Code 插件，Codex 做了独立桌面 App，Gemini CLI 也在向编辑器延伸。另一边，Cursor 的 Agent Mode、TRAE 的 SOLO 模式、Kiro 的 Spec 长时运行、Qoder 的 Quest 模式，都开始支持把一整个任务交给 Agent。

Anthropic 做 Claude Code 时有过一个很激进的判断：“随着 AI 能力提升，人们完全不需要关注代码本身。大篇幅展示代码的重型 GUI 自然也就没必要了。” 部分产品确实在弱化编辑区，把 Agent 面板、任务进度和结果验收放到了更显眼的位置。

但我不太认同“以后完全不用看代码”这个判断。代码仍然是最终可审计的资产，关键实现、Diff、测试结果和生产风险也得有人看。编辑区可能会往后退一点，代码审查和结果验收反而会占用更多注意力。

模型厂商自己做 Agent 时，一次工具调用失败，可以同时排查模型、提示策略、权限系统和 Agent 运行时。Anthropic 有 Claude Code，OpenAI 有 Codex，Google 有 Gemini CLI，阿里有 Qoder，模型和产品团队之间少隔了一层。

第三方 IDE 厂商需要跟着模型更新做适配，偶尔会慢半拍；好处是可以同时接入多种模型，不必把所有体验押在一家模型上。所以，这两类产品谁一定走得更快，现在还下不了结论。

## 总结

| 如果你…                  | 选                                  |
| ------------------------ | ----------------------------------- |
| 习惯终端、需要脚本化任务 | CLI                                 |
| 看重可视化、需要调试     | IDE                                 |
| 任务混合、想灵活切换     | 两者兼用                            |
| 希望减少工具切换         | 评估同时提供编辑与 Agent 模式的产品 |

我现在没打算给 CLI 和 IDE 固定主次。写一小段代码、调 UI、看 Diff 时，我留在 IDE；任务跨多个文件，还要反复跑测试时，就交给 CLI 或 IDE 里的 Agent 模式。

团队里也可以有人用 Cursor，有人用 Claude Code。需要统一的是 Spec 格式、AGENTS.md、测试、CI 和 Code Review 的验收标准，没必要强迫所有人盯着同一个客户端。


---

---

<!-- source: 实践/Claude Code Agent View-多会话并行管理实战.md -->

## [10] Claude Code Agent View：多会话并行管理实战

---
title: Claude Code Agent View：多会话并行管理实战
description: Anthropic 发布的 Agent View 为 Claude Code 提供终端内的多会话管理能力，可集中查看 Agent 状态、处理输入并管理后台会话。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Claude Code,Agent View,多会话管理,Agent并行,AI编程,CLI工具,会话编排
---

大家好，我是小 G。

我平时用 Claude Code，经常会同时开几个会话：一个开发新功能，一个重构，一个跑测试，一个看报错，另一个整理 PR 评论或补文档。

![开启多个命令行窗口，让多个 Agent 在不同会话中并行](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/multi-agent-parallel-sessions.png)

以前这么用其实挺累。我一般会在 Ghostty 里开多个分屏，再配上几个终端标签页。窗口铺得满满当当，看起来像是把并行效率拉满了，脑子里却一直要记着：哪个会话还在跑？哪个已经完成？哪个卡在权限确认？哪个报错了？

最烦的是，有些 Agent 其实早就在等你确认了，但你根本没注意到。等你切回去一看，它已经停在那里十几分钟了。

Anthropic 前段时间推出的 **Agent View**，正好接手了这件麻烦事。它把后台会话集中到一个列表里，正在工作、等待输入、已经完成还是运行失败，扫一眼就知道。Claude 还是那个 Claude，但我终于不用靠脑子维护那张“会话状态表”了。

我在 [AI 编程选 CLI 还是 IDE？](https://mp.weixin.qq.com/s/6a3f2U6ZAJa2N7Cp10S01Q) 里提到过，AI Coding 的一些新工作流经常先在 CLI 里试水。Agent View 算是一个例子。不过，它更接近“后台会话管理器”，还不是会自动拆任务、分工和协调冲突的多 Agent 编排平台。

如果你还不熟悉 Claude Code，可以先看看下面两篇：

- [《Claude Code 使用指南》](https://javaguide.cn/AI编程/实践/claudecode-tips.html)：Sub-Agent 子代理、多实例协作（Multi-Claude）、CLAUDE.md 配置等
- [《Claude Code 核心命令详解》](https://javaguide.cn/AI编程/实践/claudecode-commands.html)：`/simplify`、`/loop`、`/batch` 等命令的实战用法

## 怎么打开 Agent View

Agent View 目前还是 Research Preview（研究预览版），需要 Claude Code `v2.1.139` 或更高版本。可以先检查一下版本：

```bash
claude --version
```

最直接的打开方式是在终端运行：

```bash
claude agents
```

![终端直接运行 claude agents 即可进入](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-agents-list-view.png)

打开后，每个后台会话占一行。左边是状态图标，中间是会话名和最近的执行摘要，右边是运行时长。会话默认按状态分组，需要你处理的会排在前面。

已经打开的普通 Claude Code 会话不会自动出现在这里。想把当前会话转到后台，可以输入：

```text
/bg
```

也可以在输入框为空时按左方向键 `←`。这两个操作都是把会话分离到后台，不会结束任务。之后用方向键选中会话，再按 `Enter` 或 `→`，就能重新进入完整对话。

![进入指定的 Agent 会话](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/enter-agent-session.png)

## 先看黄色，再看红色

Agent View 打开后，我通常先扫一遍左侧的状态图标。它比会话名更值得看，因为它直接告诉你哪里需要介入。

![Claude Code Agent View](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-agents-list-view-20260518102539932.png)

| 状态          | 界面表现 | 怎么处理                                      |
| ------------- | -------- | --------------------------------------------- |
| `Needs Input` | 黄色     | 正在等回答、权限确认或登录操作，优先处理      |
| `Working`     | 动画     | 仍在调用工具或生成回复，可以先放着            |
| `Completed`   | 绿色     | 任务正常结束，接下来检查 Diff、测试和执行结果 |
| `Failed`      | 红色     | 运行出错，打开摘要或日志定位原因              |
| `Idle`        | 变暗     | 当前没有任务，可以继续发消息                  |
| `Stopped`     | 灰色     | 会话已被手动停止，或者进程被外部结束          |

这里有个容易误判的地方：界面里的 `Completed` 分组也会收纳失败和已停止的会话，分组名不等于所有任务都成功了。是否真的完成，还是要看图标颜色和执行结果。

黄色最有用。以前我以为某个会话还在跑，切回去才发现它早就停在“是否允许执行这个命令？”那里等我。现在看到黄色就处理，没有黄色就先做别的。

## 不用切换，也能回复

选中会话后按空格键 `Space`，底部会弹出 Peek Panel，显示最近一次输出，或者 Claude 正在等待的问题。

![Agent View 选中一个会话后按空格键弹出 Peek Panel](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/peek-panel-reply.png)

如果只是确认“是否允许修改这个文件”或者“要不要继续跑测试”，直接在面板里回复就行。会话收到消息后继续执行，不需要进入完整对话。

以前要先找到对应的终端标签页，看它在等什么，回复完再切回来。现在按一下空格就能处理，这种小地方用久了很省心。

如果要看完整上下文，按 `Enter` 或 `→` 进入会话；看完按 `←` 返回 Agent View。

快捷键不用专门背，界面底部会显示提示，按 `?` 还能查看完整列表。日常常用的主要是下面这些：

| 快捷键            | 功能                                 |
| ----------------- | ------------------------------------ |
| `↑` / `↓`         | 在会话列表中移动                     |
| `Space`           | 打开或关闭 Peek Panel                |
| `Enter`           | 进入会话，或在输入框有内容时派发任务 |
| `Shift+Enter`     | 派发任务并立即进入新会话             |
| `Alt+1` ~ `Alt+9` | 直接进入第 N 个会话                  |
| `Ctrl+T`          | 置顶或取消置顶当前会话               |
| `Ctrl+R`          | 重命名当前会话                       |
| `Ctrl+X`          | 停止会话；2 秒内再按一次删除         |

`Ctrl+X` 连按两次要谨慎。如果会话使用了 Claude Code 自动创建的 Worktree，删除会话时，里面尚未提交的修改也可能一起被删掉。

## 把任务甩到后台跑

在已有会话里输入 `/bg`，可以直接把当前任务放到后台：

```text
/bg
```

这会把当前会话后台化，然后返回 Agent View。

![/bg 把任务甩到后台里跑](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/bg-background-session.png)

也可以顺手补一条指令再转入后台：

```text
/bg 跑完测试并修复失败用例
```

如果任务还没开始，从 Shell 直接创建后台会话更省事：

```bash
claude --bg "修复 auth 模块里所有失败的单元测试，直到全部通过"
```

这类“耗时，但不需要全程盯着”的任务很适合放到后台：

- 跑一整组失败测试并尝试修复
- 检查某个模块的类型错误
- 批量整理文档
- 分析 PR 评论并给出修改建议
- 对多个仓库同时做小范围改动

Mitchell Hashimoto（HashiCorp 联合创始人、Ghostty 作者）在 [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey) 里分享过一个挺有意思的习惯：每天最后 30 分钟，把深度调研、模糊想法探索、Issue 和 PR 分拣交给 Agent，第二天上班直接看结果。

他也写得很克制：理想状态是始终有 Agent 在处理有用的工作，实际只有大约 10%～20% 的工作时间能做到，而且通常只跑一个 Agent。这个比例反倒更接近日常开发，不需要为了“并行”硬凑一排任务。

## Shell 命令

不想打开 Agent View，也可以直接在 Shell 里管理后台会话：

```bash
claude agents          # 打开 Agent View

claude attach <id>     # 切换到指定会话

claude logs <id>       # 打印指定会话的最近输出

claude stop <id>       # 停止会话，也可以用 claude kill

claude respawn <id>    # 重启指定会话，保留对话历史

claude respawn --all   # 重启所有正在运行的后台会话

claude rm <id>         # 从列表中移除会话
```

这里面我用得比较少、但很容易理解错的是 `respawn`：

```bash
claude respawn <id>
```

它会重启指定的 Session，原来的对话记录还在。Claude Code 更新以后想让某个后台会话使用新版本，或者会话进程异常退出时，都可以用它。

`respawn` 不是 Context Reset，也不会生成一份干净上下文。如果旧会话已经塞满无关日志和过期方案，重启进程也解决不了上下文污染。遇到这种情况，另开会话，再带入一份核对过的任务摘要更稳妥。

另外，`claude rm <id>` 主要是从后台列表中移除会话。对话记录仍保存在本机，可以通过 `claude --resume` 找回；Claude Code 自动创建的 Worktree 只有在确认安全时才会一并清理。

## 从 Agent View 里直接派发任务

Agent View 底部有一个输入框。输入任务并按 `Enter`，会新建一个后台 Session；再输入一条任务，会继续新建 Session，而不是追问上一个会话。想给已有会话补充信息，要用 Peek Panel 回复，或者先进入该会话。

输入框还支持一些特殊写法：

| 输入格式                | 效果                                             |
| ----------------------- | ------------------------------------------------ |
| `<agent-name> <prompt>` | 第一个词匹配自定义 Subagent 时，用它作为主 Agent |
| `@<agent-name>`         | 在 Prompt 中指定一个自定义 Subagent              |
| `@<repo>`               | 选择另一个仓库或目录，在那里启动会话             |
| `/<command>`            | 搜索并使用可派发的 Skill 或命令                  |
| `! <command>`           | 直接启动后台 Shell 任务，不调用模型              |
| `#<number>` 或 PR URL   | 已有会话在处理该 PR 时，直接选中原会话           |

自定义 Subagent 通常放在项目的 `.claude/agents/` 或用户目录的 `~/.claude/agents/` 下。给代码审查、测试分析这类重复任务准备一个专用 Agent，派发时就不用每次重新交代工具和边界。

`#<number>` 和 PR URL 也挺实用。如果已经有一个 Session 在处理同一个 PR，Agent View 会选中原会话，避免两个会话重复修改。

关于 Skills 的使用，可以继续看[推荐 6 个 Skills](https://mp.weixin.qq.com/s/55YhKrMAHsbrAgf4P2ezRA)和[万字详解 Agent Skills](https://mp.weixin.qq.com/s/5iaTBH12VTH55jYwo4wmwA)。

## 什么场景适合用

判断一个任务要不要放进 Agent View，我主要看两点：它能不能暂时离开我独立推进，回来后又能不能通过 Diff、测试或日志验收。两点都满足，放到后台通常比较省心。

### 同时处理几件互不依赖的小事

比如手上有 5 个小需求，可以分别交给 5 个 Session：一个修测试，一个查类型错误，一个整理文档，另外两个处理互不相关的 Bug。任务发出去以后先忙自己的，回来再看状态：黄色的先回复，红色的查日志，绿色的集中验收。

前提是这些任务真的能分开做。五个 Session 同时修改同一批文件，即使有 Worktree 隔离，最后仍然要处理实现冲突和重复修改。省下来的时间，很可能又花在合并代码上。

[Nicholas Carlini 的 C 编译器实验](https://www.anthropic.com/engineering/building-c-compiler) 把并行规模拉到了另一个量级：16 个 Claude Opus 4.6 实例在两周内跑了近 2000 个 Claude Code Session，产出约 10 万行代码，花费接近 2 万美元。这个实验使用的是 Agent Teams 和自定义执行框架，并非 Agent View 的能力展示。

落到日常开发，能借鉴的是任务拆分、角色分工和测试约束。没有这些准备，多开几个 Session 只会更快地产生冲突。`/simplify` 和 `/batch` 等并行工作流的具体用法，可以看 [《Claude Code 核心命令详解》](https://javaguide.cn/AI编程/实践/claudecode-commands.html)。

### 需要等待的 CI、测试和 PR

CI、集成测试和 PR Review 经常要等外部结果。一直把 Session 留在前台，人会忍不住隔几分钟看一眼；放到后台，等状态变黄、变红或完成后再回来处理就行。

每隔一段时间检查一次 CI，可以用 `/loop`；任务有明确的结束条件，例如“持续修复，直到测试全部通过”，用 `/goal` 更合适。Agent View 只负责展示 Session 状态，实际的定时检查和持续执行仍由这些命令完成。

[Stripe 的 Minions](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents) 已经把这条链路做成了一套内部系统：开发者从 Slack 派发任务，Agent 负责编码、验证和创建 PR，每周有超过 1000 个这类 PR 被合并，代码仍然由人审查。Minions 和 Agent View 是两套东西，但都绕不开测试、CI 和 Code Review。少了这些环节，列表显示绿色，也不能说明代码已经可以合并。

### 多仓库并行

`@<repo>` 可以把任务派到另一个仓库或目录。一个 Session 改后端接口，一个改前端页面，再开一个更新文档，状态仍然放在同一张列表里，不用分别维护几组终端窗口。

在 Git 仓库中，后台 Session 第一次准备修改文件时，Claude Code 默认会把它移到 `.claude/worktrees/` 下的独立 Worktree，避免几个 Session 直接写同一份工作区。非 Git 目录、已经处在 Worktree 中，或者项目关闭了后台 Worktree 隔离时，行为会有所不同。

前后端任务如果依赖同一份接口约定，最好先把请求参数、响应结构和验收标准定下来。Agent View 不会替两个 Session 同步这些变化。

## 哪些场景别硬用

### 多个任务需要频繁同步

每个 Session 都有自己的上下文，只向你汇报进度。一个 Session 刚改完接口，另一个不会自动知道；两个 Session 同时调整同一个核心模块，也不会主动商量由谁负责。

临时查资料、跑测试这类支线任务，可以交给 Subagent；需要多个 Agent 共享任务列表并互相通信，可以考虑 Agent Teams。Agent View 更适合由人来分配独立任务，再统一检查结果。

并行 Session 还会分别消耗订阅额度。任务开得越多，Token 消耗和触发限额的速度也越快。如果几件事本来就互相等待，串行处理可能更省事。

### 任务必须脱离本机持续运行

后台 Session 由本机 Supervisor 进程管理。关闭 Agent View、Shell 或终端窗口以后，任务可以继续；机器休眠时会保留 Session，唤醒后重新连接。

关机或重启会停止正在运行的任务。下次打开 Agent View 时，这些 Session 会显示为失败，进入、预览或回复后可以接着原来的对话继续。需要机器离线后照常运行的任务，应放到云端环境。详见 [Agent View 官方文档](https://code.claude.com/docs/en/agent-view)。

想进一步了解几种并行方式的区别，可以看 [Claude Code 并行 Agent 官方说明](https://code.claude.com/docs/en/agents)、[《上下文工程实战指南》](https://javaguide.cn/ai/agent/context-engineering.html) 和 [《Harness Engineering》](https://javaguide.cn/ai/agent/harness-engineering.html)。

## Research Preview 期间别写死流程

Agent View 仍处于 Research Preview 阶段，界面、状态分组和快捷键都可能变化。准备把它接进团队流程时，升级 Claude Code 后最好检查一次官方文档，不要把当前快捷键写死在长期规范里。

如果暂时不想用，可以在 `.claude/settings.json` 里关闭：

```json
{
  "disableAgentView": true
}
```

## 总结

我更愿意把 Agent View 理解成 Claude Code 的任务面板。它把散落在终端里的后台 Session 放到同一个列表，让我知道哪个还在运行、哪个正在等回复、哪个已经可以验收。

任务怎么拆、多个 Agent 怎么同步、最终结果是否可靠，仍然要靠 Worktree、测试、CI 和人来处理。

对我来说，它最实用的变化还是文章开头那个小问题：不用再去五六个终端标签页里，寻找已经等了十几分钟的权限确认。


---

---

<!-- source: 实践/Claude Code 核心命令详解-code-review、loop、goal、batch、run、verify.md -->

## [11] Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify

---
title: Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify
description: 深入解析 Claude Code 核心命令，涵盖 /simplify、/code-review、/review、/loop、/goal、/batch、/run、/verify、/debug 等实用命令的使用方法与实战技巧。
category: AI 编程技巧
head:
  - - meta
    - name: keywords
      content: Claude Code,命令,slash commands,/simplify,/code-review,/review,/loop,/goal,/batch,/run,/verify,/debug,AI编程,AI辅助开发
---

你好，我是小 G。Claude Code 里其实有不少好用的命令，例如代码审查、代码简化、定时任务，但我发现很多每天经常用的朋友并不知道，也不知道如何用。

很多朋友认为用了 Cluade Code 直接对话就够了，不需要了解这些命令。但站在我用了这么久的角度来看，你了解一下肯定还是更好的。

当然了，了解不是说得死记硬背这些命令。你知道大概有这个东西就足够了！真需要用的时候，直接输入 `/`，再从命令列表里选即可。

> **版本说明**：本文按 Claude Code v2.1.218（2026-07-25）的官方文档和客户端行为整理。命令更新很快，最终以 `/help`、`/` 命令列表和官方 Commands 页面为准。

## `/` 菜单里不只有内置命令

在 Claude Code 中输入 `/`，看到的是当前环境里所有可以直接调用的入口。除了 Claude Code 自带的内置命令，这里还会列出 Bundled Skills、用户自己编写的 Skills，以及插件和 MCP Server 提供的命令。具体能看到哪些条目，还会受版本、平台、套餐和当前环境影响。

[官方 Commands 文档](https://code.claude.com/docs/en/commands)把大多数内置命令描述为“行为直接写在 CLI 中”的命令，例如 `/clear`、`/compact`、`/model`、`/diff`、`/context` 和 `/permissions`。[Bundled Skills](https://code.claude.com/docs/en/slash-commands#bundled-skills) 则基于 Prompt 工作：Claude 会加载对应指令，再调用工具或组织子代理完成任务。`/simplify`、`/batch`、`/debug`、`/loop`、`/run`、`/verify`、`/code-review` 和 `/claude-api` 都属于这一类。官方命令表会在这类条目后标注 `Skill`；少数会并行调度多个子代理并在后台运行的能力则标注为 `Workflow`。

`/review` 是内置命令，用来对 GitHub Pull Request 做一次快速、只读的单轮审查；不带参数时会先列出可选的 Open PR。要检查当前 diff 的正确性问题和清理机会，使用 `/code-review`；要对 PR 做可调节强度的多 Agent 审查，可以执行 `/code-review <level> <PR 编号>`。需要云端深度审查时使用 `/code-review ultra`，`/ultrareview` 目前是它的别名。

## /simplify：代码简化与重构

一份改动已经能正常运行，但里面可能留着重复 helper、绕得过深的分支，或者放错层级的业务逻辑。这时再跑 `/simplify`。它会检查当前改动，并尝试应用清理类修复。

从 Claude Code v2.1.154 开始，官方把 `/simplify` 定位为 **cleanup-only review**。复用、简化、效率和抽象层级归它处理；逻辑 Bug 交给 `/code-review`。

### 它怎样处理一份改动

不带参数时，`/simplify` 通常从 `git diff` 读取增量变更。工作区没有未提交修改时，它会转而检查最近一次 commit。也可以指定类名，例如 `/simplify MarketDataService`，让它把注意力放到整个文件。具体取值范围仍以当前版本的客户端行为为准。

拿到改动后，四个 Agent 会并行读取同一份 diff：

```mermaid
flowchart TB
    Diff["git diff<br/>完整差异"] --> A1["Agent 1: Code Reuse<br/>看有没有重复造轮子"]
    Diff --> A2["Agent 2: Simplification<br/>看能不能删复杂度"]
    Diff --> A3["Agent 3: Efficiency<br/>看跑起来会不会卡"]
    Diff --> A4["Agent 4: Abstraction Level<br/>看改动放的位置对不对"]
    A1 --> Fix["Phase 3: 汇总发现<br/>应用清理类修复"]
    A2 --> Fix
    A3 --> Fix
    A4 --> Fix
```

Code Reuse Agent 会先在项目里寻找现成实现。比如新写的 `requireNonBlank()` 与 `InputValidator.requireNonBlank()` 重复，它会建议复用后者。Simplification Agent 处理相似方法、冗余临时状态和过深分支；Efficiency Agent 会留意循环内重复创建对象、无必要的并发容器和重复计算。

Abstraction Level Agent 关注代码放置位置。业务规则进入 Controller、通用校验散落在多个 Service、底层工具反向依赖业务对象，都属于这一类。四份结果返回后，Claude Code 会过滤误报并应用它判断为安全的清理。

> **风险提示**：`/simplify` 会改代码，却不负责保证业务正确。事务、安全、并发和资金链路先跑 `/code-review` 或 `/security-review`，之后仍要检查 diff 并执行测试。

### 指定关注方向

参数里可以直接写关注方向：

```bash
/simplify duplicate helpers
/simplify SQL performance
/simplify unnecessary abstraction
/simplify MarketDataService
```

已经知道问题大致落在哪个文件或哪类代码味道时，带参数比裸跑更容易得到有针对性的结果。

### 案例：Spring 事务失效

这个案例来自早期 `/simplify` 行为，当时它会更积极地查 correctness bug。按现在的官方定位，这类问题更应该交给 `/code-review` 或 `/security-review`，再用 `/simplify` 做清理和重构。

有一次我写了一个用户认证模块，自测通过就准备提交了。习惯性地先跑了一遍审查命令，它直接帮我找到了 6 个潜在问题，经过确认，确实都是实际存在的问题。

![直接运行 /simplify 命令](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-command-run.png)

![扫描到的问题](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-issues-found.png)

其中一个问题落在 **Spring 事务失效** 上，多个审查视角都指向了同一处代码。

`WatchlistService` 的外层方法先获取 Redis 分布式锁并做 double-check，再调用一个 `protected` 方法写数据库：

```java
public void initializeDefaultWatchlist(Long userId) {
    // Redis 分布式锁 + double-check（幂等）
    // ...
    doInitializeDefaultWatchlist(userId);  // 同一类内部调用
    // ...
}

@Transactional(rollbackFor = Exception.class)
protected void doInitializeDefaultWatchlist(Long userId) {
    groupService.save(defaultGroup);        // INSERT 分组
    stockService.saveBatch(initialStocks);  // INSERT 5 只股票
}
```

`@Transactional` 放在这个方法上没有解决事务问题。Spring 默认采用代理式 AOP，同一个类内部直接调用 `doInitializeDefaultWatchlist()` 会绕过代理，事务拦截器收不到这次调用。

如果 `saveBatch` 中途抛出异常，`save` 已经写入的分组记录不会回滚，数据库里会留下一个没有股票的分组。

> **前提条件**：在 Spring 默认代理式 AOP 下，同类内部直接调用会绕过代理，`@Transactional` 不会生效；如果使用 AspectJ weaving 或通过代理对象调用，结论不同。

- **Quality / correctness 视角** 标记了自调用导致 `@Transactional` 失效，评为高严重性。
- **Efficiency Agent** 排除了锁 TTL 不足的可能，把问题收敛到事务失效。
- **Code Reuse Agent** 确认手写的分布式锁没有可复用替代，实现合理。

当时给出的修复方案是把声明式事务换成**编程式事务**，用 `TransactionTemplate` 直接控制事务边界。其他修复方式包括：把事务方法移动到另一个 Spring Bean、通过代理对象调用、调整事务边界到外层 public 方法。

```java
@RequiredArgsConstructor
public class WatchlistService {

    private final TransactionTemplate transactionTemplate;

    private void doInitializeDefaultWatchlist(Long userId) {
        transactionTemplate.executeWithoutResult(status -> {
            groupService.save(defaultGroup);
            stockService.saveBatch(initialStocks);
        });
    }
}
```

![开启优化](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-optimization-start.png)

![所有修改完成](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-all-fixes-done.png)

这次扫描还发现了另外 5 个问题，涵盖代码复用、安全性和效率：

| 发现                                                                                       | Agent                | 修复方式                                              |
| ------------------------------------------------------------------------------------------ | -------------------- | ----------------------------------------------------- |
| 两个 Controller 各自定义了 `requireNonBlank()`，和已有的 `InputValidator` 重复             | Reuse                | 删除私有方法，改用 `InputValidator.requireNonBlank()` |
| 异常处理器的 regex 每次 `replaceAll` 都重新编译，且字符类不含 `+/=`，base64 token 会漏脱敏 | Quality + Efficiency | 提取为 `static final Pattern`，扩展字符类覆盖 base64  |
| 用 `ConcurrentHashMap` + `@Scheduled` 手动清理 30 秒过期的 Ticket                          | Efficiency           | 替换为项目已有的 Caffeine 缓存（自带 TTL 淘汰）       |
| `@Bean` 方法里的局部 `Map` 用了 `ConcurrentHashMap`                                        | Efficiency           | 改为 `HashMap`（单线程填充，不需要并发安全）          |
| 注释笔误：“兖底” 应为 “兜底”                                                               | Quality              | 修正                                                  |

最终结果：5 个文件修改，净减少 38 行代码，修复 6 个问题，编译一次通过。

### 案例：指定模块审查

`/simplify` 还可以指定具体的类或模块做审查：

![直接审查具体的类](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/simplify-class-review.png)

```bash
/simplify MarketDataService
```

我之前对项目的行情数据服务 `MarketDataService`（约 570 行）跑过一次专项审查。这个类聚合多个数据源，提供 Caffeine 本地缓存 + Redis 分布式缓存 + 熔断降级。当时的审查找到了 8 个问题，其中有两个高严重性的 correctness bug。按现在的命令定位，这类问题应该优先交给 `/code-review`。

**Bug：`year` 周期被静默降级为 `month`。** `normalizePeriod` 方法里有一个 switch：

```java
case "year", "yearly", "y" -> "month";  // Bug！应该是 "year"
```

其他周期都正确映射（`day → "day"`、`week → "week"`、`month → "month"`），唯独 `year` 被映射到了 `month`。调用方请求年度 K 线，实际拿到的是月度 K 线，没有任何报错或提示。

### 什么时候用 `/simplify`

提交 PR 前，或者刚完成一轮多文件重构，可以先用 `/code-review` 检查逻辑，再让 `/simplify` 清理重复实现和局部复杂度。它会结合项目现有代码给建议，例如改用已有 helper，或者把误放在 Controller 的业务逻辑移回 Service。

它不适合代替全项目审计。裸跑时主要检查当前增量；代码风格交给 formatter，正确性和安全问题则交给 `/code-review`、`/security-review` 与 SAST 工具。

## /code-review 和 /review：代码审查

本地工作区有一份尚未提交的 diff，先用 `/code-review` 查正确性、边界条件和潜在 Bug。已经提交为 Pull Request，则用 `/review` 选择或指定 PR。涉及登录、支付、权限和上传等敏感模块时，还需要 `/security-review`。

`/simplify` 解决的是另一类问题：代码逻辑已经确认可用，还想继续清理重复、低效实现和抽象层级。常见顺序是先 `/code-review`，再 `/simplify`。

### `/code-review` 如何产出报告

`/code-review` 先读取 `git diff` 或指定 PR 的变更，再并行分析并按置信度过滤结果。报告按 Critical、High、Medium、Low 分级，每条问题会指向具体行号，并附原因和修复建议。默认情况下它只报告；传入 `--fix` 后，才会尝试修改其中一部分问题。

### 怎么用

```bash
/code-review high    # 只看高严重性问题
/code-review --fix   # 审查并自动修复部分问题
/code-review ultra   # 云端深度审查
```

如果要审查具体 PR，用 `/review`：

```bash
/review              # 列出当前仓库的 Open PR，供你选择
/review 123          # 审查指定 PR
```

文件级审查建议写成自然语言：比如“review src/auth/login.service.ts”。

报告出来后，可以继续输入“修复所有 Critical 问题”，让 Claude 按审查结果修改。

### /code-review、/review、/security-review 怎么选

- 当前 diff 或本地变更：`/code-review`
- 已经创建的 Pull Request：`/review 123`
- 登录、支付、权限、上传、Webhook 等敏感模块：`/security-review`
- 核心 PR 合并前需要更重的云端审查：`/code-review ultra`

### /code-review ultra：云端深度审查

`/code-review ultra` 把审查放到云端沙箱中，由多个 Agent 分析同一个 PR。它适合核心 PR 合并前再加一轮检查。旧命令 `/ultrareview` 仍然保留为别名，但当前官方更推荐 `/code-review ultra`。

```bash
/code-review ultra        # 深度审查当前 diff / PR 语境
/code-review ultra 123    # 深度审查指定目标（具体支持以 /help 为准）
```

云端执行不依赖本地环境，代价是等待时间和 Token 消耗都会增加。官方目前仍将其标记为 research preview，功能与价格以官方文档和本地 `/help` 为准。

### `/code-review` 和 `/simplify` 怎么排顺序

对一份还不敢确认正确的改动，先跑 `/code-review`。等逻辑错误、边界条件和安全问题处理完，再用 `/simplify` 删除冗余代码。若只是刚写完原型，已经有测试证明行为没变，也可以直接让 `/simplify` 做一轮清理。

### 实战案例

有一次我写了一个用户认证模块，自测通过就准备提交了。顺手跑了一遍 `/code-review`，它标出了三个问题：

**Critical：密码重置接口没做速率限制。** 攻击者可以无限次调用重置接口轰炸用户邮箱。这个我自己测试的时候根本想不到——测试环境只有我一个用户，哪来的速率限制需求。

**High：Token 过期时间从配置读取但没兜底。** 配置项没设的话，过期时间会变成 0，意味着 Token 一生成就过期。`/code-review` 建议加一个 `Math.max(config.tokenExpiry, 3600)` 做保底。

**Medium：日志里把 userId 明文打印了。** 虽然不算敏感信息，但在合规要求严格的场景下还是脱敏比较好。

三个问题里有两个与安全性有关。单靠我当时的自测，密码重置频率和空配置这两种情况都没有覆盖到。

### 不要用它替代静态检查

`/code-review` 默认只给建议，明确传入 `--fix` 才会改代码。它还会读取 `CLAUDE.md`：项目的编码规范、技术选型和安全要求写得越具体，审查时可用的项目约束就越多。

SonarQube 这类工具按规则稳定扫描，`/code-review` 则会结合上下文分析 Spring 代理、事务边界和权限链路。两者覆盖的问题不同，不能相互替代。

## `/loop` 与 `/goal`：定时重复和完成条件

Boris Cherny 曾多次分享 `/loop` 的用法。

![Claude Code 推荐使用 loop 命令](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudecode-father-loop.png)

每隔半小时检查一次 PR，关注的是触发时间，用 `/loop`。现在开始修复失败测试，并持续做到全部通过，关注的是验收条件，用 `/goal`。

`/loop` 创建当前会话中的重复任务；`/goal` 会立即开始工作，围绕完成条件连续规划、执行和验证。把迁移任务错交给 `/loop`，容易得到一个周期性运行、却没有明确停止点的任务。

### 三种调度方案怎么选

当前可用的调度入口有 Cloud 任务、Desktop 任务和 `/loop`：

|                  | **Cloud 任务**     | **Desktop 任务** | **/loop**                                                                                                     |
| ---------------- | ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| 运行位置         | Anthropic 云端     | 你的机器         | 你的机器                                                                                                      |
| 需要开机吗       | 不需要             | 需要             | 需要                                                                                                          |
| 需要存活会话吗   | 不需要             | 不需要           | **需要，可保持前台或交给 supervisor 后台托管**                                                                |
| 重启后还在吗     | 在                 | 在               | 会话级；关闭期间不会执行；使用 `--resume` / `--continue` 恢复同一会话时，7 天内未过期的 recurring task 可恢复 |
| 能访问本地文件吗 | 不能（重新 clone） | 能               | 能                                                                                                            |
| MCP 服务器       | 每个任务单独配置   | 配置文件和连接器 | 继承当前会话                                                                                                  |
| 最小间隔         | 1 小时             | 1 分钟           | 1 分钟                                                                                                        |

机器不能保持在线时，选 Cloud 任务。本地文件和 MCP 配置必须参与时，Desktop 任务更合适。`/loop` 留给当前会话里的临时轮询，不适合要求长期可靠执行的任务。

### `/loop`：按间隔重复执行

Prompt 里写清执行内容和间隔：

```bash
/loop 30m "审查当前 diff，列出正确性问题"       # 每 30 分钟执行一次审查 Prompt
/loop 1h "跑一遍单元测试，看看有没有失败的"  # 每小时检查测试
/loop 5m "检查 GitHub 上开放的 PR 状态"    # 每 5 分钟看 PR 动态
```

不要写 `/loop 30m /code-review`。`/code-review` 禁止由模型调用，进入 recurring task 后只会被当成普通文本。需要定时审查时，直接描述要检查的内容，或者改用该环境允许调用的工具。

间隔既可以放在前面，如 `/loop 30m 检查构建状态`；也可以写在 Prompt 后面，如 `/loop 检查构建状态 every 2 hours`。省略间隔后，Claude 会动态选择下一次执行时间，通常落在 1 分钟到 1 小时之间；Bedrock、Vertex AI、Microsoft Foundry 场景固定为 10 分钟。

### `/goal`：持续工作到验收条件满足

需要“现在开始，持续修到测试通过”时使用 `/goal`。它会围绕完成条件持续规划、执行和验证；仍要写清停止条件、权限边界以及哪些情况必须停下来请人确认：

```bash
/goal "修复 auth 模块里所有失败的单元测试，直到全部通过；涉及生产配置时停止并询问"
/goal "把 src/legacy 下组件迁移到 Tailwind CSS，以现有视觉回归测试通过为完成条件"
/goal "完成 ESM 迁移，以构建和测试全部通过为完成条件"
```

可执行的验收标准决定了 `/goal` 何时结束。付款、部署、删除数据、修改生产配置等高风险动作不能混进默认授权，应在 Prompt 中写明“停止并询问”。

### 放到实际任务里

PR 状态、测试结果、文档同步都适合按时间检查。定时任务最好先保持只读，发现问题后汇报：

```bash
/loop 5m "用 gh 命令检查开放 PR 的状态，标记有冲突的和可以安全合并的"
/loop 2h "运行测试套件，汇报新增失败及相关提交，不修改代码"
/loop 2h "检查最近的代码变更，更新对应的公开文档"
```

发现测试失败后，如果希望 Claude 立刻修复，再单独启动 `/goal`。大规模技术迁移也按同样方式处理，把构建和测试结果写成结束条件：

```bash
/goal "把项目里所有 CommonJS 的 require/module.exports 改成 ESM 的 import/export，以构建和测试全部通过为完成条件"
```

项目里有多项固定检查时，可以把 `/loop` 命令收进自定义命令文件，启动项目后统一创建。

### 怎么管理任务

任务创建后，可以直接用自然语言查询和停止：

```bash
我现在有哪些定时任务？
停掉那个检查部署的任务
```

底层对应三个工具：

| 工具         | 干什么                                                |
| ------------ | ----------------------------------------------------- |
| `CronCreate` | 创建任务，接收 cron 表达式、要执行的 prompt、是否循环 |
| `CronList`   | 列出所有在跑的任务，显示 ID、调度时间、prompt         |
| `CronDelete` | 按 ID 删任务                                          |

### 运行限制

调度器每秒检查到期任务，但 Claude 忙于当前对话时不会立刻执行，任务会排队。Recurring Task 还有 jitter：当前最多延迟 30 分钟；间隔小于 1 小时时，延迟上限为半个 interval。要求精确到分钟的调度不要交给 `/loop`。

循环任务创建 7 天后自动过期，并在删除前执行最后一次。它依赖当前 Session；Session 由 supervisor 托管时，关闭终端后仍能继续，否则关闭期间不会执行，也不会补跑。使用 `--resume` 或 `--continue` 恢复同一会话时，尚未过期的任务可以恢复。

高频 `/loop` 和长时间 `/goal` 都会持续消耗 Token。关键路径先提交一份可回滚的版本，定时检查默认只汇报；`/goal` 还要写明验收标准、审批动作和无法继续时的退出方式。需要长期可靠运行时，改用 Cloud 或 Desktop Scheduled Tasks，不要把 `/loop` 当成 CI/CD。

## /debug：排查 Claude Code 运行时问题

MCP Server 连不上、Hook 没有触发、工具调用被拒绝，这些问题通常出在 Claude Code 的配置或当前会话。先用对应命令查看实际状态：`/mcp` 检查连接和授权，`/hooks` 查看已经载入的 Hook，`/permissions` 查看生效的权限规则及其来源。状态信息仍解释不了问题时，再运行 `/debug`。

`/debug` 是一个 Bundled Skill。它会为当前会话启用调试日志，读取日志和相关设置路径，再根据你提供的描述分析原因：

```bash
/debug MCP Server 显示已连接，但没有可用工具
/debug 为什么这个工具调用被权限规则拒绝
/debug Hook 为什么没有触发
```

调试日志默认不会提前开启。如果启动 Claude Code 时没有传入 `--debug`，执行 `/debug` 后需要把问题再复现一次，它才能从新日志里找原因；执行前已经发生的错误不会被补记。MCP 初始化这类发生在启动阶段的问题，可以退出后用 `claude --debug "什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？"` 重新启动，拿到更完整的日志。

`/debug` 解决的是 Claude Code 自身的运行和配置问题。业务代码的 Bug 仍然要用项目的调试器、应用日志和测试排查。

## /run 和 /verify：把改动跑起来

Claude Code v2.1.145+ 提供了 `/run` 和 `/verify` 两个 Bundled Skills。前者启动应用并观察结果，后者侧重构建与运行检查。

### /run：启动应用并观察

```bash
/run
```

`/run` 会尝试识别项目的启动方式并拉起应用。改完登录逻辑后，可以让它启动服务，再检查登录流程是否按预期工作。

### /verify：构建或运行来验证改动

```bash
/verify
```

`/verify` 不要求完整走一遍交互流程，主要执行构建和运行检查，适合先排除编译错误与明显的运行时问题。

### /run-skill-generator：记录项目的启动方式

```bash
/run-skill-generator
```

Claude 通常会从 README、`package.json`、`Makefile` 等文件推断启动方式。多模块项目、特殊环境变量或自定义启动脚本容易让它判断错误。先运行一次 `/run-skill-generator`，确认并记录正确流程，后续 `/run` 和 `/verify` 会复用这份配置。

## /batch：多任务并行编排

`/batch` 适合一次交付多项、彼此相对独立的改动。这组需求同时涉及页面、组件、提示词管理和历史记录：

```bash
/batch  1、移除自选股界面，直接通过分析界面来管理，每一行股票的最右侧展示选项，支持删除和分组。
  2、自选股提取一个组件、K线展示和讨论室都单独提取一个组件出来。
  3、优化提示词管理，例如支持删除和重命名。
  4、历史记录目前支持10条记录，这块的设计优化一下。
```

Claude 会先把需求拆成多个 Unit（工作单元），通常为 5～30 个，等你确认计划后再启动后台 Worker。每个 Worker 使用独立的 Git Worktree，分别修改对应模块，避免多个 Agent 直接写同一个工作区。

![Claude Code 运行 /batch 命令](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudecode-batch-run.png)

Worker 完成后，主进程会逐个检查改动，每个单元通常对应一个独立 PR。

> **风险提示**：`/batch` 适合边界清晰、模块相对独立的大任务；不适合强耦合核心链路一次性大改。共享文件（如 package.json、路由表、公共类型、数据库迁移脚本）容易冲突。使用前建议先 commit 干净工作区。

![Claude Code 合并改动](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudecode-batch-create-pr.png)

## 执行前后的辅助命令

`/context`、`/permissions` 和 `/diff` 分别回答三个问题：当前上下文还剩多少，Claude 被允许执行哪些操作，它刚才实际修改了什么。

### 长会话先看 /context

长任务开始遗漏约束或重复读取文件时，先检查上下文占用：

```bash
/context
```

`/context` 会列出工具输出、历史对话和规则文件占用的空间。如果当前会话仍值得继续，再带着保留要求执行 `/compact`：

```bash
/compact 只保留当前重构目标、已完成改动、剩余 TODO、关键约束
```

裸跑 `/compact` 容易把仍在使用的约束一起压缩。示例中明确保留重构目标、已完成改动、剩余 TODO 和关键约束，后续更容易接着做。

### 自动化任务前先收紧 /permissions

`/loop`、`/goal` 和 `/batch` 会让 Claude 在较长时间内持续执行。开始前运行：

```bash
/permissions
```

这个交互界面会列出当前生效的权限规则，以及每条规则来自哪个配置文件。规则分为三类：

- `allow`：匹配后直接执行，不再询问。
- `ask`：每次匹配时都请求确认。
- `deny`：直接阻止操作。

规则按照 `deny → ask → allow` 的顺序匹配，`deny` 的优先级最高。构建、测试等确定且低风险的操作可以按需加入 `allow`；推送远程分支、执行部署脚本等动作更适合设为 `ask`；生产数据库写入和任务范围外的破坏性操作则应设为 `deny`。

权限由 Claude Code 客户端执行，不依赖模型是否记得你的要求。因此，“不要部署”这类 Prompt 只能作为行为提醒；必须禁止的操作，应落实为 `deny` 规则或 PreToolUse Hook。

### 改完先看 /diff

Claude 的文字总结可能漏掉顺手修改的文件。执行：

```bash
/diff
```

交互式 diff viewer 会展示工作区里真实变化的文件和行。`/simplify`、`/batch` 跑完后，以这里的改动为准，再决定保留、继续修改还是回滚。

另外，`/statusline` 可以把模型、目录、上下文和成本常驻显示在状态栏；长任务前后用 `/usage` 或 `/cost` 查看消耗即可。

## 按任务规模组合命令

普通功能改动不需要把所有命令跑一遍。先用 `/code-review` 检查当前 diff；确认逻辑后执行 `/simplify`；接着用 `/verify` 跑构建和必要的运行检查，最后通过 `/diff` 人工确认。

多模块需求才考虑 `/batch`。开始前检查 `/permissions`，各个 Worker 完成后分别审查；敏感模块追加 `/security-review`，形成 PR 后再用 `/review` 做合并前检查。

`/loop` 和 `/goal` 也不属于固定流水线。前者只处理周期性检查，后者处理有明确验收条件的连续任务。会话变长时再看 `/context`，必要时带保留范围执行 `/compact`。

## 非交互模式：脚本和 CI 里用 Claude Code

脚本和 CI 通常只需要执行一次 Prompt，拿到结果后退出，不必保持交互会话。

### `claude -p`：非交互模式

```bash
claude -p "summarize this diff" --output-format json
```

`-p` 接收 Prompt 并在执行后直接输出结果。加上 `--output-format json`，脚本可以直接解析结构化响应。

### `--bare`：跳过自动加载

一次性分析不依赖 Hooks、Skills、MCP、Auto Memory 和 `CLAUDE.md` 时，可以加 `--bare`：

```bash
claude --bare -p "explain this function"
```

`--bare` 少了自动加载过程，启动更快，同时也拿不到这些项目上下文，不适合复杂代码修改。

### `--teleport`：网页端会话拉回本地

```bash
claude --teleport
```

Claude Code on the web 中的任务需要访问本地仓库或命令行时，可以用 `--teleport` 把网页会话接到本地终端继续处理。

## 附录：Claude Code 接入第三方模型

部分服务商提供 Anthropic API 兼容端点，Claude Code 因而可以连接 MiniMax、GLM 等第三方模型。这里要求的是 Anthropic API 兼容性，工具调用、流式响应和长上下文等能力还要逐项验证。接入前还需确认服务条款、数据处理位置与密钥保存方式，来源不明的代理不要使用。

### 1. 获取 API Key

- MiniMax 开放平台：[https://platform.minimaxi.com/user-center/basic-information/interface-key](https://platform.minimaxi.com/user-center/basic-information/interface-key)
- GLM 开放平台：[https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys](https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys)

![MiniMax Key 获取](https://oss.javaguide.cn/github/javaguide/ai/coding/minimax-key.png)

![GLM Key 获取](https://oss.javaguide.cn/github/javaguide/ai/coding/glm-key.png)

### 2. 使用供应商配置工具

**CC Switch** 是一个社区配置管理工具，可以管理 Claude Code 供应商配置、Skills、MCP 和提示词。是否采用取决于团队对第三方工具、密钥存储和代理日志的安全要求。

项目地址：[https://github.com/farion1231/cc-switch](https://github.com/farion1231/cc-switch)

![CC Switch 主界面](https://oss.javaguide.cn/github/javaguide/ai/coding/cc-switch-main-interface.png)

启动 CC Switch，点击右上角的 `+`，选择预设的 MiniMax/GLM 供应商，填写 API Key 和模型后添加。

![CC Switch 配置 MiniMax/GLM API Key](https://oss.javaguide.cn/github/javaguide/ai/coding/cc-switch-add-provider.png)

![CC Switch 配置模型](https://oss.javaguide.cn/github/javaguide/ai/coding/cc-switch-model-config.png)

### 3. 验证是否生效

在任意目录下输入 `claude` 命令即可启动 Claude Code，选择**信任此文件夹（Trust This Folder）**。

![验证是否生效](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-trust-folder.png)

### 4. 接入验证清单

对话成功只能证明基础请求可用。Claude Code 还依赖工具调用和多步执行，建议在测试仓库逐项验证：

- [ ] 是否能稳定 stream 输出
- [ ] 是否能调用 Bash / Read / Edit / Write
- [ ] 是否能跑 subagent
- [ ] 是否能处理长上下文和压缩
- [ ] 是否支持 MCP 工具调用
- [ ] 是否能完成真实项目的“改代码 → 跑测试 → 修复”闭环

## 几组命令怎么选

`/code-review` 检查当前 diff，`/review` 检查已经创建的 PR。逻辑确认后仍有重复和复杂代码，再运行 `/simplify`。

`/loop` 按时间间隔触发，`/goal` 围绕验收条件持续执行。前者适合定时检查，后者适合修复失败测试或完成技术迁移。

`/run` 用来启动应用并观察实际行为，`/verify` 先做构建和运行检查。复杂项目先让 `/run-skill-generator` 记录正确的启动方式。

`/batch`、`/simplify`、`/goal` 都可能带来较大范围的修改。执行前检查 `/permissions`，执行后看 `/diff`、跑测试。会话过长时，先用 `/context` 找出占用来源，再决定是否执行 `/compact`。

## 参考资料

- [Claude Code commands](https://code.claude.com/docs/en/commands)
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)
- [Debug your configuration](https://code.claude.com/docs/en/debug-your-config)
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Configure permissions](https://code.claude.com/docs/en/permissions)
- [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Automate with hooks](https://code.claude.com/docs/en/hooks)


---

---

<!-- source: 实践/Claude Code 使用指南-配置、工作流与进阶技巧.md -->

## [12] Claude Code 使用指南：配置、工作流与进阶技巧

---
title: Claude Code 使用指南：配置、工作流与进阶技巧
description: 结合 Anthropic 官方文档和真实项目用法，讲清 Claude Code 的配置、权限、MCP、Skills、Sub-Agent、上下文管理和常见工作流。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: Claude Code,AI编程,CLAUDE.md,MCP,Skills,Sub-Agent,Agentic Coding,AI辅助开发
---

你好，我是小 G。前几天那篇 [Vibe Coding 实用技巧总结](./Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作.md)，公众号阅读两天时间到了 6w+，评论区里问 Claude Code 的朋友不少。

这篇就来单独聊聊 Claude Code。

不知道大家和我是不是有同样的感觉，刚开始用的时候真挺别扭，甚至有点抵触：已经习惯了 Cursor、IDEA 里的侧边栏、文件树、diff 面板，再回到终端里跟 AI 协作，真心不顺手。

后来用多了，反而觉得 CLI 这层很适合长任务。它能在本地跑，也能搬到远程机器、临时环境、CI/CD 里跑；同一套命令、权限和验证方式可以复用，不用为了 GUI 再改一遍步骤。

现在我用 Claude Code，直接先把目录、目标和验收方式说清楚，让它自己去读代码、跑命令，最后我再看 diff 和测试结果。

麻烦也在这里。`CLAUDE.md` 写太满、权限放太宽、上下文塞爆、Sub-Agent 拆错边界，都会让它越跑越偏。

下面这些内容基本来自我这一年多的使用记录，偏实战，不追求把官方文档重新讲一遍。

PS：Claude Code 迭代非常快，本文按 v2.1.218（2026-07-24）的官方文档和个人使用经验整理。命令、权限模式、插件、Auto Mode、Sub-Agent 和 Worktree 行为，可能受版本、平台、账号套餐、provider 和安装渠道影响。实际使用前，最好先看 `claude --version`、`claude --help`、`/help` 和官方文档。比如 `/run`、`/verify` 需要 v2.1.145+；`/code-review` 支持 effort 等级、`--comment` 和 `--fix`；`/simplify` 当前更适合理解成 cleanup-only review，不是完整的 correctness bug review。

国内使用还要考虑账号、网络、成本和第三方中转稳定性。GLM、MiniMax、Kimi、DeepSeek 这类国产模型可以作为替代或补充；但碰到大规模代码修改、复杂重构、长链路排错，Claude 目前仍然值得单独研究。

## `CLAUDE.md` 非常重要

`CLAUDE.md` 最好别写成第二份 README。它更像是写给 Claude Code 的项目备忘录：哪些规则代码里看不出来、哪些命令经常被它猜错、哪些目录不要碰、改完某类代码必须跑哪条测试。

![多智能股票分析项目中的 CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

我的项目文件里通常只留这些东西：**Claude 容易猜错的规则、代码里读不出来的约定、团队必须遵守的规范，以及技术栈版本、常用命令、架构取舍、项目坑点。**

官方文档建议每份 `CLAUDE.md` 目标控制在 200 行以内。文件太长会消耗更多上下文，也可能降低规则遵守度。内容继续膨胀时，再拆到带 `paths` 的 `.claude/rules/`，低频参考内容放进 Skills。

![Claude Code 官方文档对 CLAUDE.md 的建议](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudemd-claude-docs.png)

我判断一条规则该不该留，会问一句：

> 这行删掉后，Claude 会不会更容易犯错？

如果会，就保留；如果不会，直接删掉。

### 放在哪里

`CLAUDE.md` 可以放在多个位置。官方的加载顺序大致从全局到局部，别只盯着项目根目录那一份：

![CLAUDE.md 层级与优先级](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-file-hierarchy.png)

最外层是组织级文件，通常给 IT 或 DevOps 统一下发规范。macOS 路径是 `/Library/Application Support/ClaudeCode/CLAUDE.md`，Linux/WSL 是 `/etc/claude-code/CLAUDE.md`，Windows 是 `C:\Program Files\ClaudeCode\CLAUDE.md`。这类规则一般不是个人项目里要动的东西。

再往下是用户级 `~/.claude/CLAUDE.md`，适合放自己的通用偏好。项目级文件放在 `./CLAUDE.md` 或 `./.claude/CLAUDE.md`，应该提交到 Git，让团队都看到。本地级 `./CLAUDE.local.md` 只留个人配置，记得加进 `.gitignore`。子目录里的 `CLAUDE.md` 不会一开局就全塞进上下文，Claude 访问到对应目录时才按需加载。

这些文件会一起进入上下文，后加载的文件不会把前面的内容整块覆盖掉。只是越靠近当前项目、作用范围越具体的规则，会排在更后面，Claude 通常也更容易采纳。

比如用户级规则写“统一用空格缩进”，项目级规则写“这个仓库使用 Tab”，那在这个项目里，Claude 通常会优先按项目规则来。官方文档里的加载顺序也是从组织级、用户级，一直到项目级和本地级。

我的习惯是把项目级 `CLAUDE.md` 提交到 Git，只写团队共同遵守的规则。只和自己有关的偏好，比如某个项目里想让提交信息用中文，放进 `CLAUDE.local.md`，再加到 `.gitignore`。

项目规模大时，可以拆开：

```text
my-project/
├── CLAUDE.md
├── backend/
│   └── CLAUDE.md
├── frontend/
│   └── CLAUDE.md
└── .claude/
    ├── rules/
    ├── skills/
    └── agents/
```

根目录放全局约定，子目录放局部规则。Claude 读取到某个子目录文件时，会按需加载对应目录下的说明。这个机制对 monorepo 很友好，后端、前端、管理台不用挤在一份文件里。

`@path` 引用也别误会。它不会凭空省上下文，被引用的内容最终还是会进来，只是维护起来更清楚。某些规则只对特定目录生效时，优先考虑 `.claude/rules/` 这类按路径加载的规则，别继续往根目录文件里塞。

### 初始化和维护

新项目可以先运行：

```bash
/init
```

Claude 会读仓库，生成一份初始 `CLAUDE.md`。这份文件只能当草稿，别直接提交。它可能猜错 build 命令，也可能把 README 里已经写清楚的内容又抄一遍。

维护时最容易失控的是越写越多。

Claude 偶尔犯一次错，先别急着加规则。等同类问题出现两三次、你也能用一句明确指令挡住它，再写进去。反过来，代码里一眼能读出来的事实、模型本来就会做的事、已经过时的历史约定，都应该删掉。规则太多时，最该看的几句会被冲淡。

如果 Claude 明明读到了规则却没照做，先看规则写得是否太软。“尽量保持测试完整”就很虚；“修改 Service 后必须运行对应单测，并贴出命令和结果”更好执行。同一条规则在多个会话里反复失效，再去检查文件太长，或者规则放错了位置。

我会把规则分成两类：团队级、长期有效、必须共享的要求写进 `CLAUDE.md`；个人偏好、阶段性调试经验、临时提醒，交给 Auto Memory 或本地配置。`CLAUDE.md` 最好来自真实错误，也要定期删掉失效内容。

写完规则后，也别默认它已经生效。用 `/context` 查看当前会话实际加载了哪些 `CLAUDE.md`、`CLAUDE.local.md` 和 rules 文件；`/memory` 主要用于查看和编辑规则、记忆的配置位置。如果某个文件不在 `/context` 结果里，Claude 这轮就看不到。复杂项目里用了带 `paths` 的 `.claude/rules/`，还可以用 `InstructionsLoaded` Hook 记录规则文件什么时候被加载、为什么被加载。

## 权限管理要重视

### 分层授权

Claude Code 默认会对敏感操作弹确认，比如写文件、执行 Bash、调用 MCP 工具。刚开始会觉得麻烦，但在你还不熟悉它的执行习惯时，先保留确认更安全。

我一般先只放开那些看了也不会出事、跑了也不会破坏现场的命令。比如 `git diff`、`git status`、`rg` 这类只读命令，可以少拦一点；`mvn test`、`pnpm test`、`npm run lint` 这类固定验证命令，也可以按项目情况放行。

反过来，`rm -rf`、`git push --force`、修改 `.git/` 这类操作默认不要放。`.env`、`secrets/`、生成产物、证书目录和各种 dump 文件，也尽量用 deny 规则先挡住。

权限可以通过 `/permissions` 配，也可以写进 `.claude/settings.json`：

```json
{
  "permissions": {
    "allow": ["Bash(git status*)", "Bash(git diff*)", "Bash(rg *)"],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf *)"
    ]
  }
}
```

规则会被 Claude Code 的执行层处理。也就是说，就算 prompt 里写了“请一定不要读 `.env`”，那仍然只是建议；deny 规则才会拦住对应操作。

Auto Mode 的分类器也会参考你在对话里写下的边界，但这不是硬保证。不能丢的边界，最好写进 `permissions.deny`，或者用 Hook 在工具调用前拦住。长会话压缩以后，聊天里临时说过的限制也可能被压掉。

### Auto Mode

如果频繁确认已经影响节奏，可以考虑 Auto Mode。

当前官方文档里，CLI 会通过 `Shift+Tab` 切换权限模式；当账号、模型、provider 和组织设置都满足要求时，`auto` 才会出现在模式循环里。Team / Enterprise 环境下，管理员还可能把它打开或锁掉。

它的原理是用一个单独的分类器判断操作风险，低风险操作自动放行；下载并执行陌生代码、向外部端点发送敏感内容、生产部署、强推、直接 push 到 `main` 这类动作，会被阻断或转人工确认。

不过 Auto Mode 不提供安全沙箱，也不保证不会误判。它解决的是“少点确认”，不负责隔离文件系统、网络和凭据。高风险任务还是要靠容器、临时账号、最小权限、deny 规则、Hooks 和人工 Review。

想默认进入 Auto Mode，也别把 `"defaultMode": "auto"` 写到项目级 `.claude/settings.json` 或 `.claude/settings.local.json` 里。v2.1.142+ 会忽略这些来源里的 `auto` 设置，避免仓库自己给自己打开 Auto Mode。应该放到用户级 `~/.claude/settings.json` 或组织 managed settings。Bedrock、Vertex AI、Microsoft Foundry 这类 provider 还可能需要额外设置 `CLAUDE_CODE_ENABLE_AUTO_MODE=1`。

启动参数也不要写死。不同版本、安装渠道和 provider 对 permission mode 的支持可能不同，脚本里最好先用 `claude --help` 或官方文档确认当前可用值。交互使用时，我更倾向于在会话里用 `Shift+Tab` 切换模式，而不是把高权限模式写进脚本。

`--dangerously-skip-permissions` 我不建议在日常项目里用。除非你已经把文件系统、网络、凭据都隔离好了，否则一次误操作就可能改到不该改的文件，或者读到不该读的凭据。

## 安全边界

生产凭据、数据库密码、云厂商长期 token，不要直接暴露给 Claude；生产环境也别让它直接碰，除非这件事本来就有审批和审计。

Git 这边也要收紧。不要允许它默认 push 到 `main`，更不要让强推远端分支变成一个随手能执行的动作。来源不明的远程脚本，尤其是 `curl | bash` 这种写法，最好只在隔离环境里试。

文件读取范围同样要管住。`.env`、`secrets/`、证书目录、SSH key、数据库 dump、生产日志，这些都不该默认进 Claude 的可读范围。

不只是 `.env`。像 `~/.aws/`、`~/.gcp/`、`~/.kube/`、`~/.ssh/`、Maven `settings.xml`、npm token、生产日志和数据库 dump，都不应该随便暴露给 Claude。真要让它看日志，也尽量先脱敏、截取和限定范围。

真的需要自动化高权限任务时，放进容器、临时凭据、最小权限账号里跑。这样即使命令执行错了，影响范围也更可控。

## MCP、Skills、Sub-Agent 和插件怎么分

Claude Code 周边东西很多，刚接触时确实容易混在一起。我自己的分法大概是这样：

| **机制**    | **解决什么问题**       | **适合放什么**                         | **不适合放什么**       |
| ----------- | ---------------------- | -------------------------------------- | ---------------------- |
| `CLAUDE.md` | 每次会话都要知道的背景 | 构建命令、目录约定、团队规则           | 多步骤任务流程         |
| Rules       | 按路径加载局部规则     | 前端规则、后端规则、安全规则           | 全项目都要看的核心约定 |
| Skills      | 可复用任务步骤         | TDD、Code Review、写文章、前端实现     | 永久背景知识           |
| MCP         | 连接外部系统           | GitHub、Sentry、Notion、Figma、数据库  | 本地普通文件规则       |
| Sub-Agent   | 隔离支线任务上下文     | 代码搜索、专项审查、并行研究           | 边界很小的一次性修改   |
| Hooks       | 固定执行动作           | 禁止危险命令、编辑后格式化、结束前测试 | 仅供参考的建议         |
| 插件        | 打包分发一组扩展       | Skills、MCP、Hooks、脚本的组合         | 没审查过的第三方权限包 |

比如“每次编辑后必须跑 formatter”，写进 `CLAUDE.md` 只能提醒 Claude 记得，写成 Hook 才能在文件改完后触发。再比如“修 GitHub Issue 的步骤”，放进 `CLAUDE.md` 会污染所有会话，做成 Skill 更合适。

### Code Intelligence：让 Claude 少靠全文搜索硬读

项目能用 Code Intelligence 的话，尽量配上。它相当于给 Claude 接了一套语言服务器：看类型错误、找符号定义、查引用关系，不必每次都靠 `rg` 搜一大片文件。

拿 Java 或 TypeScript 项目来说，Claude 想知道某个类在哪里定义、被谁调用，不一定非得先搜关键词，再挨个打开文件确认。借助 LSP，它可以直接跳到定义、查看引用，改完代码后还能马上发现类型错误。

它不能替代全文搜索，但能少读很多无关文件。项目一大，上下文会干净不少，Claude 也不容易被一堆候选文件带偏。Claude Code 官方也建议类型化语言安装 Code Intelligence 插件，因为一次符号跳转，往往能省掉一次搜索加多文件读取。

不过，Code Intelligence 插件不是“装上就完事”。它还需要本机有对应的 language server binary，比如 Java 对应 `jdtls`，TypeScript 对应 `typescript-language-server`。如果 `/plugin` 的 Errors 页里出现 `Executable not found in $PATH`，通常就是这个依赖没装好。

### MCP：让 Claude 接上真实世界

MCP（Model Context Protocol，模型上下文协议）管连接外部系统。外部系统提供一个 MCP Server，Claude Code 这类客户端连上来后，就能看到并调用里面的工具。

![MCP 图解](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/mcp-simple-diagram.png)

这是 Claude Code 接外部工具的主要方式。查数据库、读 Sentry 报错、访问浏览器、拉 Notion 文档、取 Figma 设计稿，都属于这一类。

添加远程 MCP 服务器的命令大概长这样：

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp \
  --header "Authorization: Bearer your-token"
```

这里的 `your-token` 只是示意。真实项目里尽量别直接把 token 写进 shell history。

团队项目里，能共享的 MCP 配置可以放到 `.mcp.json`，再提交到仓库。比如某个项目统一要接 Notion、Sentry、内部文档系统，就把 server 名称、URL、transport 这些公共配置沉淀下来。

带 token、密钥、数据库连接串的配置，不要提交到 `.mcp.json`。更稳的做法是放用户级配置、本地环境变量、密钥管理系统，或者使用对应 MCP server 支持的 OAuth 流程。

MCP Server 要克制。工具越多，Claude 越容易选错，也越难审计。平时可以用 `/mcp` 看当前连接状态，启用或禁用 server；成本和用量拆分更适合看 `/usage`，它会展示 skill、subagent、plugin、MCP server 等维度的使用情况。不常用的 server 先断开。

### Skills：把重复动作存下来

规则文件和 Skill 不要混着用。

规则文件放长期约束，比如技术栈版本、启动命令、目录结构、错误码格式、哪些文件不能碰。

Skill 放任务步骤，比如代码审查、写测试、改前端页面、网页调研、写技术文章。这些任务每次走法都差不多，不必在聊天里反复提醒。

小 G 之前写过两篇相关的文章：[Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html) 和 [AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)。

Skill 就是一份按需加载的任务说明。某类任务怎么做、有哪些约束、要检查哪些点、踩过哪些坑，都写进 `SKILL.md`。

它和 `CLAUDE.md` 的一个区别在于加载时机。Claude 默认只看到 Skill 的名称和描述，用来判断是否该调用；调用这个 Skill 时，`SKILL.md` 正文和相关资源才会进入上下文。用户级 Skill 放在 `~/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/`，项目级 Skill 放在 `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/`。

还有一个版本变化要注意：Claude Code 里 custom commands 已经合并进 Skills。`.claude/commands/deploy.md` 和 `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/deploy/SKILL.md` 都能创建 `/deploy` 这类命令；旧的 `.claude/commands/` 还能用，新内容更推荐按 Skill 组织。

![Agent 执行链路](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skills-agent-execution-link.png)

重复性很强的步骤都可以沉淀成 Skill。写功能前固定走 TDD，先写失败测试再实现；代码审查时固定检查安全、事务、性能和边界条件；写技术文章时固定核对事实来源、引用、标题层级和 AI 味。

这比每次在 prompt 里补一长串提醒稳定得多。官方对 Skill 的定义也接近这个意思：一组可复用的指令、脚本和资源，让 Claude 按固定步骤处理某类任务。

现成 Skill 也可以用，比如 Superpowers 把 TDD、Code Review、Spec-Driven、Git Worktree、子 Agent 协作这些步骤封装好了。

我在 [AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html) 这篇文章中有详细推荐。

第三方 Skill 不要拿来就跑。`SKILL.md` 本身就是指令，里面如果带了危险命令、奇怪脚本、过宽权限，Agent 可能会照着做。装之前至少看一眼正文、`scripts/` 和 `references/`，确认它没有越权操作。

### 插件：先看官方 marketplace

不想自己从零配 Skills、MCP、Hooks，可以先去 Claude Code 的官方插件市场 [`claude-plugins-official`](https://github.com/anthropics/claude-plugins-official) 翻一翻。

安装也很直接：

```bash
/plugin install <name>@claude-plugins-official
```

插件省的是组装时间。一个插件里可能已经打包好了 Skill、MCP Server、Hooks 和一些辅助脚本，装完 Claude 就多了一套现成工作流。

但插件最终还是会在你本地跑，有些还会碰文件系统、浏览器、GitHub、数据库或第三方服务。装之前至少看一眼说明、权限和源码来源；不用了就卸掉，减少不必要的工具入口。具体安装和发现方式可以看官方的 [Discover plugins](https://code.claude.com/docs/en/discover-plugins) 文档。

### Sub-Agent：让主会话保持干净

Sub-Agent 我用得比较多。

![Claude Code Sub-Agent：让主对话保持干净](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode-sub-agent.png)

排查复杂问题时，Claude 经常要读几十个文件、搜一堆代码、跑几条命令。主会话很快被日志、搜索结果和文件内容塞满，后面再继续写代码，就容易飘。

这种支线任务可以丢给 Sub-Agent。它有自己的上下文，可以单独读代码、查日志、分析问题，结束后只把结论汇报回主会话。

Claude Code 内置的 subagent 里，我最常见到的是 Explore、Plan 和 general-purpose。这些内置 subagent 都继承父会话权限，但会叠加各自的工具限制：

| **子代理**          | **模型**            | **工具/权限**                    | **用途**                       |
| ------------------- | ------------------- | -------------------------------- | ------------------------------ |
| **Explore**         | Haiku，偏快速低延迟 | 只读，无 Write / Edit            | 文件发现、代码搜索、代码库探索 |
| **Plan**            | 继承主对话模型      | 只读，无 Write / Edit            | Plan Mode 下的代码库研究       |
| **general-purpose** | 继承主对话模型      | 继承主会话可用工具，仍受权限约束 | 复杂研究、多步骤操作、代码修改 |

Explore 和 Plan 更偏只读研究，不负责直接改代码。官方文档里还有个细节：Explore 和 Plan 会跳过 `CLAUDE.md` 文件和父会话的 git status，所以更适合快速做代码搜索和上下文收集；其他内置 subagent 和自定义 subagent 会加载这些内容。

general-purpose 边界更宽，可能会探索、执行命令、修改代码。用它之前最好明确哪些目录可读、哪些文件不能改、是否允许写入、最终只需要结论还是要直接动手实现。真要做强约束，不能只靠提示词，要配合 subagent 的 `tools` / `disallowedTools`、权限模式、`permissions.deny` 或 Hooks。

你也可以创建自己的 subagent。项目级配置放在 `.claude/agents/`，给团队共享；用户级配置放在 `~/.claude/agents/`，自己跨项目复用。每个 subagent 都可以配置系统提示词、工具权限、模型，以及触发条件。

我比较常用的场景是让 subagent 跑测试套件，只把失败用例和错误信息带回来；或者让不同 subagent 分别研究认证、数据库、API 模块，最后把结论合并到主会话。更复杂的任务，也可以先让 code-reviewer subagent 找性能问题，再让 optimizer subagent 尝试修复。

任务太小、边界不清、代码还在剧烈变化时，不一定要拆 subagent。主会话保留目标、决策和验收，subagent 只处理局部、明确、能汇报结果的专项任务。

后续用到 Agent teams 时，可以把它看成多会话协作的玩法。Sub-Agent 用来隔离支线任务，Agent teams 用来让多个独立会话围绕共享任务协作。刚上手不用急，先把 Worktree、小步提交和验证节奏跑顺。

一个自定义安全审查子代理可以这么写：

```markdown
---
name: security-reviewer
description: Reviews Java and Spring Boot code for security risks.
tools: Read, Grep, Glob, Bash
model: opus
---

Review the target diff for:

- SQL injection and unsafe dynamic queries.
- Authentication and authorization bypass.
- Secrets or credentials committed to code.
- Unsafe deserialization or command execution.

Return concrete file and line references. Do not rewrite code unless explicitly asked.
```

实际项目里，subagent 的 tools 尽量收窄。如果只做代码审查，通常不需要 `Edit` / `Write`。同时设置 `tools` 和 `disallowedTools` 时，`disallowedTools` 会先应用；同一个工具同时出现在两边，最后会被移除。

### Hooks：处理必须执行的规则

Hooks 很容易被忽略，但真实项目里很有用。它能在 Claude Code 的生命周期节点上执行动作，比如工具调用前、文件编辑后、会话结束前、上下文压缩前后。

举个例子，假设 Claude Code 准备执行：

```bash
rm -rf /tmp/build
```

`PreToolUse` Hook 会先拿到这次 Bash 调用，判断它是否危险；命中规则后返回 `deny`，Claude Code 会取消这次工具调用，并把拒绝原因反馈给 Claude。

下面这张图来自 Claude Code 官方 Hooks 文档，展示的就是这条链路。

![Claude Code PreToolUse Hook](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-runs-rm-rf-tmp-build-what-happens.svg)

我会把几类动作交给 Hook：编辑后自动格式化，会话结束前跑测试，禁止改 `migrations/` 或 `.github/workflows/`，拦截 `curl | bash`、`rm -rf`、向外部端点发送敏感内容，或者在 Sub-Agent 启动时注入额外上下文。

需要固定执行的动作适合放进 Hook；只作为背景参考的内容，再写进 `CLAUDE.md`。

如果写的是 HTTP Hook，还要注意一个坑：不能靠返回 4xx / 5xx 阻断工具调用。HTTP Hook 的非 2xx、连接失败和超时都会被当成非阻塞错误，执行会继续。要拦住工具调用，需要返回 2xx，并在 JSON 里写 `decision: "block"`，或者在 `hookSpecificOutput` 里写 `permissionDecision: "deny"`。

## 最常用的工作流

### 探索、计划、执行、验证

复杂任务别一上来就让 Claude 写代码。先让它读仓库，暂时不要修改文件：

```text
进入 plan mode。先阅读 src/auth 和相关测试，搞清楚登录态刷新链路。
不要写代码，只汇报当前链路、相关文件和可能的修改点。
```

读完以后再让它给计划：

```text
我要修复用户 session 超时后刷新 token 失败的问题。
基于刚才的阅读，列出要改的文件、测试策略和风险点。
```

你确认计划后再执行：

```text
按这个计划实现。优先补一个能复现问题的测试，再改实现。
完成后运行相关测试，把命令和结果贴出来。
```

这个节奏前面会慢一点，但后面省返工。尤其是你不熟悉代码库，或者改动跨多个模块时，先让 Claude 把调用链、风险点和测试策略说清楚，后面少很多“改完才发现方向错了”的尴尬。

小改动可以跳过计划。比如改一个文案、加一条日志、补一个一眼能看出来的空指针判断，直接让它做就行。过度规划也会浪费上下文。

### TDD 测试驱动开发

AI 写代码最麻烦的地方在于，它很会写“看起来合理”的代码。TDD 能先把预期行为钉住，再让实现往测试上靠。

提示词不用绕：

```text
先不要改实现。为 TokenRefreshService 写一个失败测试，
覆盖 session 已过期但 refresh token 仍有效的场景。
测试失败后再修改实现，直到测试通过。
```

如果测试没有先失败过，就很难确认后面的实现到底修到了哪个问题。否则它可能直接改一堆代码，然后告诉你“已修复”。

[AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)中推荐的 Superpowers 就把 TDD 给封装好了。

### 让 Claude 自己验证

Anthropic 官方最佳实践里有一句我很认同：**给 Claude 一个能运行的检查。测试、build、lint、截图对比、脚本输出都可以。**

比如别只说：

```text
写一个邮箱校验函数。
```

写成下面这样会少很多猜测：

```text
写一个邮箱校验函数。测试用例：

- hello@gmail.com 应该通过
- hello@ 应该失败
- @domain.com 应该失败
- a@b.co 应该通过

写完后运行测试，把命令和结果贴出来。
```

验收标准越具体，Claude 越不容易停在“看起来完成了”。

如果任务会跑很久，可以再加一句“最多尝试 3 轮，仍失败就停下来汇报阻塞点”，避免它在错误方向上消耗太多 Token。

### 代码库问答

接手陌生项目时，我会先把 Claude Code 当临时向导用。别急着让它改文件，先问调用链：

```text
用户登录的完整链路是什么？从 HTTP 请求进来到 session 写入为止，
列出相关类和方法，不要修改文件。
```

或者：

```text
这个项目里订单状态机在哪里定义？每个状态之间怎么流转？
如果有隐式约束，也一起指出来。
```

但它总结出来的内容仍然要抽查。跨服务调用、配置开关、历史兼容逻辑这几类地方，最容易被它说得很顺，实际漏掉一条分支。

### Bug 修复需要提供错误信息

修 Bug 时最怕只丢一句：

```text
登录有 bug，帮我修一下。
```

这基本是在让 Claude 猜。把原始材料贴上去会稳很多：

```text
下面是线上报错日志、复现步骤和相关请求参数。
请先定位可能原因，不要马上改代码。
找到根因后，补一个能复现的测试，再修复。
```

日志、堆栈、Slack 讨论、Docker 输出、失败测试结果，都比你转述“好像是缓存问题”更有用。转述越多，Claude 越容易被你的猜测带偏。

### 多实例和 Worktree

不要让一个 Claude 做所有事。互相独立的任务，可以拆到不同会话里并行跑。

Claude Code 支持用 Git Worktree 隔离不同会话：

```bash
claude --worktree feature-auth
claude --worktree bugfix-payment
```

`--worktree` 是 Claude Code 官方支持的参数，会在仓库下创建隔离 worktree 并启动会话；默认目录在 `.claude/worktrees/<name>/`，分支名通常是 `worktree-<name>`。如果你想完全自己控制目录和分支，也可以先用 Git 原生命令创建：

```bash
git worktree add ../project-auth -b feature-auth
cd ../project-auth
claude
```

每个 Worktree 有独立目录和分支。一个会话改认证模块，另一个会话修支付 bug，文件不会互相踩。官方桌面应用也会为新会话自动创建 Worktree，这个方向和 CLI 是一致的。

![Claude Code Git Worktree](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-git-worktree.png)

如果你已经有多个后台会话，可以用：

```bash
claude agents
```

Agent View 会把后台 session 放在一个界面里，看哪些在运行、哪些需要你确认、哪些已经完成。多会话用久了以后，比开一排终端窗口清爽很多。

这里有个容易踩的点：后台会话在动手改文件前，会自动把自己挪进 `.claude/worktrees/` 下的独立 worktree，避免几个会话踩同一份工作区。但如果项目带大量生成产物，或者 pre-commit hook 很挑路径，反复隔离反而成了负担。这种情况可以在 `.claude/settings.json` 里把 `worktree.bgIsolation` 设成 `"none"`（需要 v2.1.143+），让后台会话直接改工作区。代价也摆在那儿：并发会话有概率互相踩，按项目情况权衡。

如果你用了 `.worktreeinclude` 把 `.env`、`.env.local`、`config/secrets.json` 这类 gitignore 文件复制到新 worktree，一定要确认里面只是本地开发凭据，不是生产凭据。Worktree 隔离的是文件改动，不等于隔离密钥风险。

### Commit 和 PR 别一次塞太大

不要让 Claude 一次性提交一大坨改动。

我倾向于把它拆成小步提交。一个 commit 只做一件事，提交前让 Claude 给出 diff 摘要、验证命令和剩余风险，自己再过一遍 `git diff --stat` 和重点文件的 `git diff`。

Claude 写 commit message 和 PR 描述很快，但最后别只看它的总结。它说“只改了认证逻辑”，不如你自己看一眼 diff 可信。PR 描述写清三件事就够了：改了什么、怎么测的、还有哪些地方没完全兜住。

## 常用命令

命令不用背，真用的时候打 `/` 翻一下就行。我平时按两类记。

第一类是基础命令。`/help` 看当前环境到底有哪些命令；`/diff` 看 Claude 改了哪些文件、哪些行；长任务变慢、变飘时，先看 `/context`，上下文太满再用 `/compact`；权限相关看 `/permissions`，规则和记忆的配置位置看 `/memory`，MCP 连接看 `/mcp`，用量拆分看 `/usage`。

第二类是 bundled skills / workflow 相关命令。`/code-review` 用来扫当前改动里的 correctness bug、边界条件和潜在风险，可以指定 effort，比如 `/code-review high`；加 `--comment` 可以把发现发成 GitHub PR 行内评论；加 `--fix` 会把 review findings 应用到工作区。

`/simplify` 当前更适合当成 cleanup-only review，用来处理复用、简化、效率这类清理项，并自动应用修复。它不是完整的 bug-hunting review。老版本里 `/simplify` 和 `/code-review --fix` 的关系变过，如果你看到的命令行为和本文不一致，优先看当前 `/help` 和官方 commands 文档。

`/batch` 用在边界清晰的多模块大改上，会把需求拆成多个工作单元，开后台 Worker 在隔离 worktree 里并行干。`/loop` 用来按间隔重复执行 Prompt，适合轮询 CI 或定时维护；需要立即持续修复直到满足测试全绿、迁移完成等条件时，使用 `/goal`，并写清验收与停止条件。`/run` 用来把应用启动起来，看改动是否生效；`/verify` 更轻，主要做 build 和运行验证，快速确认有没有编译或运行时问题。

这些命令和 bundled skills 迭代很快，不同版本、平台和套餐看到的列表可能不一样。写文章可以介绍经验，真到自己机器上用，还是先看 `/help` 和官方 commands 文档。某个版本里的行为不一定长期保持不变。

`/compact` 还有一个容易忽略的点：压缩之后，有些规则不会立刻回到上下文里。根目录的 `CLAUDE.md` 会重新注入，但子目录里的嵌套规则不一定马上回来。长任务压缩后，最好让 Claude 先复述一遍当前目标、已改文件、剩余风险和下一步验证命令，再继续往下跑。

命令细节我在 [Claude Code 核心命令详解：code-review、loop、goal、batch、run、verify](https://javaguide.cn/AI编程/实践/claudecode-commands.html) 这篇里展开写过，这里就不重复铺太长了。

## 提示词怎么写

### 英文和中文各用在合适位置

编程任务里，英文通常稳一些。我不会把这件事上升成“中文不行”，只是代码、库名、错误信息、API 文档本来就大量使用英文。像 `modal`、`debounce`、`retry policy`、`transaction boundary` 这类词，硬翻成中文反而容易变味。

但业务背景、产品规则、中文文案，当然还是中文更准。我的习惯是：代码动作、技术约束和术语尽量用英文；业务语义、验收标准和中文文案用中文讲清楚。

### 限制范围

还要小心一句话：“调查一下这个项目”。Claude 会很认真地到处搜文件，读着读着，上下文就被填满了。

可以这样写：

```text
只调查 src/payment 和 src/order 目录。
目标是确认订单支付成功后库存扣减在哪里触发。
不要修改文件，只列出调用链和相关类。
```

范围、目标、禁止动作写清楚后，它搜索文件和修改代码的范围会收窄很多。

### 给金标准范例

让 Claude 按项目风格写代码，别只说“参考最佳实践”。这个范围太宽，它很容易写出一套看起来不错、但和你项目完全不搭的东西。

给它一份现有样板，效果通常更好：

```text
阅读 UserController.java、UserService.java 和 UserDTO.java。
参考它们的分层方式、构造器注入、Result<T> 返回格式和异常处理。
为订单查询补一个 OrderController，不要引入新的返回结构。
```

项目里的既有风格，往往比外面那套“最佳实践”更有约束力。尤其是老项目，分层、返回结构、异常处理、日志格式，很多都带着历史包袱和团队习惯。让 Claude 先读样板，再让它照着补，输出会更贴近当前仓库。

### 前端别只说“做得好看”

如果让 Claude 写前端，别只说“现代、简洁、高级”。

这类词太空，最后很容易得到一套熟悉的组合：Inter 字体、紫色渐变、大圆角卡片、满屏营销页味道。后台系统尤其容易翻车，本来是给运营同学高频使用的页面，结果做成了产品官网。

我一般会写得更硬一点：

```text
使用现有 Ant Design 组件，不新增 UI 库。
页面是后台运营工具，信息密度优先，不要营销页风格。
主色沿用项目 CSS 变量，不要新增紫色渐变背景。
参考 src/pages/UserList.tsx 的筛选区和表格布局。
```

设计规范也可以做成 Skill，让 Claude 每次写前端前先读项目视觉约束。先把不该出现的套路挡住。后台工具就按后台工具来，信息密度、可扫描性、操作反馈，比“氛围感”重要得多。

[AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)中也有推荐前端相关的开源 Skills。

## 常见失败模式

我自己踩得最多的是会话太杂。一个会话里同时聊需求、排错、重构、发版，Claude 很快就开始带着前一个话题的惯性做下一个任务。切任务时直接 `/clear`，必要时写一份 `HANDOFF.md`，不要硬撑着同一个上下文继续聊。

第二种是纠正死循环。同一处错误纠正 3 次还不对，就别继续在原上下文里磨了。停下来，重新写起始 prompt，把目标、证据和禁止动作说清楚。

`CLAUDE.md` 膨胀也很常见。规则很多，Claude 反而不遵守，这时不要继续加规则，先删掉代码里能读出来的内容，只保留真实犯错后总结出的约束。

还有一种是无边界调查。让 Claude “看一下这个项目”，它可能一次读几百个文件，上下文很快耗尽。限定目录、目标和禁止动作，或者交给 Sub-Agent。

测试全绿也不代表行为正确。让 Claude 展示证据，对比 main 和 feature 分支，该看日志就看日志，该跑手工验证就跑手工验证。

权限过宽最危险。为了省确认直接 bypass，后面排查误操作会很麻烦。allow/deny、Auto Mode、容器隔离、临时凭据，尽量按风险分层配置。

## 总结

一开始很容易只盯着“让它多写点代码”。用久了会发现，影响结果的反而是那些很普通的工程习惯：`CLAUDE.md` 写清项目规矩，复杂任务先 plan，改动后必须 verify，长调查丢给 Sub-Agent，多任务用 Worktree 隔离，权限别一次放太开。

实际项目里，可以先从一个目录、一个模块、一条可验证的任务链开始，让 Claude 在小范围内稳定完成任务，再逐步增加任务复杂度。


---

---

<!-- source: 实践/CLAUDE.md 最佳实践-该写什么、不该写什么、项目变大后怎么拆.md -->

## [13] CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆

---
title: CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆
description: 说明 CLAUDE.md 适合记录哪些项目规则，以及如何配合 .claude/rules、Auto Memory 管理和维护这些规则。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: CLAUDE.md,Claude Code,AI编程,AI项目规范,Agentic Coding,AI辅助开发,CLAUDE.md最佳实践,.claude/rules
---

你好，我是小 G。前几天分享 [Claude Code 使用技巧](https://javaguide.cn/AI编程/实践/claudecode-tips.html) 时，我简单介绍了 `CLAUDE.md`。有 G 友在评论区问，这个文件能不能单独写一篇。

很多朋友第一次看到 `CLAUDE.md`，会把它当成另一份 README。README 主要给人介绍项目，`CLAUDE.md` 则给 Claude Code 提供工作指令，例如项目怎么启动、哪些文件不能改、接口返回格式是什么、改完代码要运行哪些检查。

这些内容当然可以在每次新会话里重新说明，但很容易漏。长期有效、Claude 又无法从代码中准确推断的规则，更适合提前写进 `CLAUDE.md`。

本文结合 [Claude Code 官方文档](https://code.claude.com/docs/en/best-practices)和自己的使用经验，介绍 `CLAUDE.md` 该写什么、怎样拆分以及后续如何维护。

还有个小提醒：Claude Code 迭代很快，`.claude/rules/` 和 Auto Memory 这两块尤其容易随版本变化。本文按 2026-07-24 的官方文档核对。实际落地前，先用 `claude --version` 确认版本，再用 `/context` 查看本会话实际加载的指令；`/memory` 主要用于查看和编辑规则、记忆的配置位置与文件。

## 什么是 CLAUDE.md？

`CLAUDE.md` 是 Claude Code 的持久指令文件，可以放在用户级、项目级等不同位置。Claude Code 读取它之后，会根据其中的命令、约定和限制处理当前项目。

适合写入的内容包括：

- Claude 容易猜错的规则
- 代码里读不出来的约定
- 团队必须遵守的规范
- 技术栈版本、常用命令、架构取舍、项目坑点

判断一条内容是否有必要保留，可以问：

> 这行删掉后，Claude 会不会更容易犯错？

如果会，就保留；如果不会，它大概率只是在浪费上下文。

## CLAUDE.md 和其他规则文件有什么区别？

![CLAUDE.md 与其他规则文件怎么分工](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-rule-files-relationship.png)

### CLAUDE.md vs AGENTS.md

|          | CLAUDE.md                  | AGENTS.md                                                   |
| -------- | -------------------------- | ----------------------------------------------------------- |
| **谁读** | Claude Code 专属           | 跨工具开放标准，OpenAI Codex、Cursor、Google Jules 等也采用 |
| **定位** | Claude Code 的项目规则文件 | 跨工具通用的 Agent 指令文件                                 |

![CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

**AGENTS.md** 面向多个编码 Agent，**CLAUDE.md** 是 Claude Code 的专属入口。仓库同时使用两种文件时，可以让它们复用同一份基础指令。

`AGENTS.md` 也可以由团队约定一块“已确认的常见错误”区域，但 Agent 不会因为文件存在就自动记录错误，更不能保证写入一条规则后下次不再犯。是否写入、谁来评审、何时删除，都要在工作流里明确。

如果仓库已经用 `AGENTS.md` 给其他编码 Agent 提供指令，可以创建一个导入 `AGENTS.md` 的 `CLAUDE.md`，让两个工具复用同一份基础指令，不用重复维护。

```markdown
@AGENTS.md

## Claude Code 特定指令

- 使用 plan mode 处理 `src/billing/` 下的改动
```

我的 [一文搞懂 Harness Engineering](https://javaguide.cn/ai/agent/harness-engineering.html) 还介绍过一个例子：OpenAI 的 `AGENTS.md` 大约只有 100 行，主要用于指向 docs/ 目录下更具体的设计文档、架构图、执行计划和质量评级。Agent 先读取入口文件，处理到相关任务时再加载详细资料，避免一开始就把所有内容放进上下文。

### CLAUDE.md vs .claude/rules/

|                | CLAUDE.md                                                                 | `.claude/rules/`                                                             |
| -------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **加载方式**   | 根目录/项目级文件通常在会话启动时加载；子目录文件在读取对应目录时按需加载 | 不带 `paths` 的规则启动时加载；带 `paths` 的规则在 Claude 读取匹配文件时加载 |
| **适用场景**   | 全局通用规则                                                              | 只针对特定文件/目录的规则                                                    |
| **上下文消耗** | 根目录/项目级规则会持续消耗上下文                                         | 只有 path-scoped rules 按需消耗；全局 rules 仍会持续消耗上下文               |

后端 API 规范、测试配置等只对特定目录生效的规则，可以放进 `.claude/rules/`，不必继续写进根目录 `CLAUDE.md`。

要注意两点：

1. `.claude/rules/` 不是 Claude Code 安装后默认一定会出现的目录，需要时可以手动创建。
2. 带 `paths` frontmatter 的路径规则会按匹配结果加载；没有 `paths` 的规则仍会作为全局规则进入上下文。因此，创建 `.claude/rules/` 目录本身并不能减少上下文占用。

### CLAUDE.md vs SPEC.md

| ​        | CLAUDE.md                              | SPEC.md                                          |
| -------- | -------------------------------------- | ------------------------------------------------ |
| **用途** | 项目规则（怎么干活）                   | 需求规格（做什么）                               |
| **内容** | 编码规范、常用命令、踩坑记录、团队约定 | 需求边界、功能定义、验收标准，类似面向 AI 的 PRD |
| **谁用** | AI 编码助手（日常编码）                | Spec Coding 流程（需求驱动开发）                 |

`SPEC.md` 是一些团队在 **Spec Coding** 中使用的文件名，`Specify → Design → Implement → Test` 也是本文采用的一种组织方式。不同工具可能使用 requirements、design、tasks、plan 等文件和阶段，不存在统一强制的四阶段标准。

![Spec Coding 规范驱动编程流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-pipeline-flow.png)

上图中的 `requirements.md` 是该工作流在 `Specify` 阶段生成的需求文件；其他团队也可能把同类任务规格集中写在 `SPEC.md`，两者不是通用的固定别名。

我在[Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范](https://javaguide.cn/AI编程/实践/spec-coding.html)这篇文章中有详细介绍。

可以这样区分：**CLAUDE.md 管长期行为规范，Spec 管当次任务约束。**

### 实际怎么选？

- **CLAUDE.md**：Claude Code 专属的行为规范；根目录/用户级通常在会话开始时加载，子目录规则按需生效。
- **AGENTS.md**：跨工具通用的“怎么干”规则，可被 `CLAUDE.md` 导入复用。
- **`.claude/rules/`**：局部规则目录；不带 `paths` 更像全局规则，带 `paths` 才会在处理匹配文件时生效。
- **SPEC.md**：需求规格文件，定义这次做什么，属于 Spec Coding 流程中的一环。

## CLAUDE.md 到底该写什么？

先看一个我经常见到的写法。很多人跑完 `/init`，看到 Claude 生成了一份 `CLAUDE.md`，觉得“有总比没有好”，于是基本没改就提交了：

```markdown
# 项目说明

这是一个 Spring Boot 项目，使用 Java 17 和 Maven。

# 代码风格

- 写干净的代码
- 遵循最佳实践
- 确保代码可读性

# 工作流

- 提交前运行测试
- 保持良好的代码组织
```

这几条要求本身没有错，但很难改变 Claude 的行为。以“写干净的代码”为例，删掉这句话以后，Claude 依然会尽量生成可读的代码。它留在文件里，只会继续占用上下文。

`CLAUDE.md` 会和系统指令、对话记录、读取的文件共同占用上下文。Anthropic 在官方文档中指出：**随着上下文窗口被填满，Claude 的整体表现会下降。**

![上下文为什么会失效](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/why-does-the-following-content-fail.png)

文件越长，留给后续对话和代码的空间越少，真正重要的规则也更容易被其他内容淹没。

Anthropic 建议保持 `CLAUDE.md` 精简不超过 200 行，只保留 Claude 无法轻易从代码中推断的信息。如果内容继续膨胀，可以拆到带 `paths` 的 `.claude/rules/`，或者把不是每次会话都需要的参考内容放到 Skills 里。

![Claude Code 官方文档对 CLAUDE.md 的建议](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudemd-claude-docs.png)

检查 `CLAUDE.md` 时，可以逐行问：“删掉这行以后，Claude 是否更容易犯同类错误？”有明确影响的规则留下；看不出行为差异的内容先删除，后面遇到实际问题再补。

### 该写的东西

值得写进 `CLAUDE.md` 的内容主要有五类。

**1\. 技术栈和版本信息。**

框架版本差异经常直接影响生成结果。例如，Spring Boot 2 和 3 的部分配置方式不同；没有明确版本时，Claude 可能生成与当前项目不一致的用法。MyBatis-Plus 这类依赖可以从 `pom.xml` 读到，选择它而没有使用 JPA 的原因，则需要额外说明。

**2\. 常用命令。**

在 `CLAUDE.md` 中直接给出项目编译、测试、lint 和启动命令。使用代码块或行内代码保留原始参数，Claude 执行时不需要再把自然语言转换成命令。

```markdown
# Commands

- 构建：`mvn clean package -DskipTests`
- 测试：`mvn test -pl module-name`
- 启动：`mvn spring-boot:run -pl bootstrap`
- 代码检查：`mvn checkstyle:check`
```

**3\. 架构决策和背后的理由。**

规则背后的原因会影响 Claude 如何处理相邻场景。之前我的项目里只写了“不要直接写 SQL，使用 QueryWrapper”，Claude 仍会在部分查询中写 SQL。后来补充原因：“SQL 审计系统依赖 Wrapper 的解析来记录操作日志。”这条约束的适用范围就清楚了，其他查询也应该使用 Wrapper。

**4\. 团队约定和项目特有的坑。**

提交信息格式（如 `feat(scope): message`）、分支命名规范、环境变量依赖，都很难只靠阅读代码确定。这类新成员接手项目时需要询问的信息，也适合写进 `CLAUDE.md`。

**5\. 需要跨会话保留的任务信息。**

任务描述、验收标准、优先级、依赖关系和阻塞问题需要跨会话保留时，可以单独建立任务文件，再由 `CLAUDE.md` 或 `AGENTS.md` 指向它。这样既能保留当前任务的进度，也不会把经常变化的内容和长期规则混在一起。

### 不该写的东西

**1\. 代码风格规则。**

缩进用几个空格、import 怎么排序、要不要尾分号——这类事交给格式化工具。

项目里没配 Checkstyle 或者 Prettier 的，先配工具，别用自然语言去干代码格式化的活。

**2\. 语言或框架的默认行为。**

例如：

- “Vue 用 `ref` / `reactive` 管理响应式状态。”
- “JPA 实体类对应数据库表。”
- “SQL 用 `WHERE` 做条件过滤。”

这些纯是废话，写下来只会给 AI 增加理解负担。

**3\. 大段参考文档。**

外部 API 文档、SDK 参数表这种内容，不要整段塞进来。放链接就够了，Claude 真用到时再读。

### 好的 CLAUDE.md 示例

#### 用户级示例：先管住通用坏习惯

[andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) 是一个第三方整理的 Claude Code 规则/Skills 项目，灵感来自 Andrej Karpathy 对 LLM 编码问题的公开观察。里面的规则不依赖具体仓库，更适合放在用户级，用来限制编码过程中常见的跑偏行为。

下图是这个仓库里的 `CLAUDE.md` 示例：

![andrej-karpathy-claudemd](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/andrej-karpathy-claudemd.png)

这份文件只处理几个高频问题：编码前检查假设，避免过度抽象，把修改限制在任务范围内，完成后运行测试并对照验收标准。规则数量不多，每条都对应一种可以观察到的行为。

建议直接去 GitHub 读原文，这里不再整段引用。

#### 项目级示例：把仓库规矩写成速查卡

我的 [interview-guide](https://javaguide.cn/专栏/interview-guide.html) 使用的是项目级 `CLAUDE.md`。根目录文件保留技术栈、常用命令、分层边界、异常处理、事务规则和禁止清单，详细规范再交给 `.claude/rules/`。

精简后的根目录文件可以这样写：

```markdown
# AI Interview Platform Rules

Spring Boot 4.0 + Java 21 + Spring AI 2.0 + React 面试平台。

## Tech Stack

- Backend: Spring Boot 4.0 / Java 21 / Gradle / Spring AI 2.0
- Database: PostgreSQL + pgvector（1024 维 COSINE）
- Cache & MQ: Redis / Redisson / Redis Stream
- Frontend: React 18 + TypeScript + Vite + TailwindCSS 4（`frontend/`）
- Mapping & Docs: MapStruct / OpenAPI / iText 8 / Apache Tika

## Commands

- 构建：`./gradlew build`
- 测试：`./gradlew test`
- 后端启动：`./gradlew bootRun`
- 前端启动：`cd frontend && npm run dev`
- 前端检查：`cd frontend && npm run lint`

## Architecture

- 单模块 Gradle 项目，按功能分包。
- 后端遵循 `Controller -> Service -> Repository` 分层。
- 基础设施能力放在 `common/`，包括限流、AI 调用、异步任务、配置、异常、统一响应。
- 前端代码放在 `frontend/`。
- 详细项目结构见 `docs/architecture.md`。

## Must Follow

- Controller 只做参数校验和响应包装，不写业务逻辑。
- Service 承担业务编排，`@Transactional` 只放 Service 层。
- Repository 只负责数据访问，不写业务逻辑。
- 对外响应统一使用 `Result<T>`。
- 业务异常必须使用 `BusinessException(ErrorCode.XXX, "描述信息")`。
- Entity 映射使用 MapStruct，禁止手写重复转换逻辑。
- LLM、S3、外部 HTTP 调用不得放在数据库事务内。
- 统一通过 `LlmProviderRegistry` 获取 `ChatClient`。
- 结构化输出统一使用 `StructuredOutputInvoker` 做重试包装。
- Redis Stream 生产/消费使用 `AbstractStreamProducer` / `AbstractStreamConsumer` 模板。
- 限流使用 `@RateLimit`，不要手写散落的 Redis 限流逻辑。
- 数据库向量搜索使用 PostgreSQL + pgvector，维度为 1024，距离类型为 COSINE。

## Never Do

- 不要 `throw new RuntimeException(...)`，必须用 `BusinessException`。
- 不要直接返回 Entity 给前端。
- 不要把 `@Value` 散落在 Service 中，配置集中到 `@ConfigurationProperties`。
- 不要内联全限定类名，使用 import。
- 不要事务内调用 LLM、S3 或外部 HTTP。
- 不要同类内部调用 `@Transactional` 方法。
- 不要 `catch (Exception e) {}` 静默忽略。
- 不要循环调用 DB，优先批量操作。
- 不要硬编码密钥。
- 不要使用 `Executors.newXxxThreadPool()`，使用显式 `ThreadPoolExecutor`。

## More Rules

- 错误码规范：`.claude/rules/error-handling.md`
- 限流规范：`.claude/rules/rate-limit.md`
- Redis Stream 规范：`.claude/rules/redis-stream.md`
- AI 服务调用规范：`.claude/rules/ai-service.md`
- 数据库规范：`.claude/rules/数据库必读经典书籍.md`
- 前端规范：`.claude/rules/frontend.md`
```

## 怎么写才能让 Claude 真正遵守？

规则需要对应明确动作，并且能够检查执行结果。

### 规则要具体可验证

“注意代码可读性”没有给出可检查的标准。换成“函数名使用动词开头、单个函数不超过 40 行”，Claude 才知道具体要做什么，代码审查时也能直接核对。

### 禁令要搭配替代方案

禁令最好同时给出替代方案：不要做 X，遇到这种情况使用 Y。

举个我自己项目里的例子。之前 Claude 经常写 `@Autowired` 字段注入，但团队规范是构造器注入。

一开始我只写了“不要用 `@Autowired` 字段注入”。效果很一般：它确实不用字段注入了，但有时改成手写构造器，有时又绕到别的注入方式上。后来我把规则补完整：

```markdown
# 依赖注入

- 不要使用 @Autowired 字段注入
- 使用构造器注入，配合 Lombok 的 @RequiredArgsConstructor
- 参考示例：UserController.java 中的写法
```

补全后的规则同时给出了推荐写法和项目内的参考文件，Claude 处理同类代码时有了可以直接遵循的样板。

### 善用标记词但别滥用

Claude 反复违反某条规则时，可以在前面加 `IMPORTANT:` 或 `YOU MUST:`。这类标记只用于少数关键规则；如果每条都有标记，强调就失去了区分度。

如果 Claude 反复忽略某条规则的话，这个时候就要检查文件是否过长、规则是否放错位置。继续增加强调词，通常不能解决这两个问题。

### 标题用常规名字

Commands、Structure、Conventions、Testing 这类常见标题已经能准确说明内容。Claude 更容易按这些标题找到命令、目录结构和测试要求，项目成员阅读时也省得重新理解一套命名。

### Hooks

`CLAUDE.md` 只能提供指令，无法强制阻止一次工具调用。修改敏感文件、执行危险命令等操作，可以交给 Hook 检查。例如，`PreToolUse` 会在工具执行前接收调用信息，再根据权限和风险决定是否放行。

Claude Code 官方文档给出的执行过程如下：

![Claude Code PreToolUse Hook](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-runs-rm-rf-tmp-build-what-happens.svg)

能机械检查的要求，优先交给 Linter、Hook 或 CI。比如要阻止 Claude 修改 `.env`，可以让 `PreToolUse` Hook 检查目标路径并拒绝操作；只在 `CLAUDE.md` 中提醒，仍然可能漏掉。

适合做 Hook 的事情：

- 编辑后自动格式化。
- 会话结束前跑测试。
- 禁止改 `migrations/` 或 `.github/workflows/`。
- 拦截 `curl | bash`、`rm -rf`、向外部端点发送敏感内容。
- 在 Sub-Agent 启动时注入额外上下文。

漏掉一次就会产生明显风险的要求，适合用 Hook 强制检查。仅用于帮助 Claude 理解项目的约定，继续写在 `CLAUDE.md` 中。

## CLAUDE.md 放在哪里？

Claude Code 支持在多个位置放置 `CLAUDE.md`，各自的影响范围如下：

![CLAUDE.md 层级与优先级](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-file-hierarchy.png)

| 位置       | 路径                                                                                                                                                  | 用途                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **组织级** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`，Linux/WSL: `/etc/claude-code/CLAUDE.md`，Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | IT/DevOps 统一下发的编码规范、合规要求和数据处理说明，不能通过个人配置排除。 |
| **用户级** | `~/.claude/CLAUDE.md`                                                                                                                                 | 你的个人偏好，对所有项目生效                                                 |
| **项目级** | `./CLAUDE.md` 或 `./.claude/CLAUDE.md`                                                                                                                | 团队共享规范，提交至 Git                                                     |
| **本地级** | `./CLAUDE.local.md`                                                                                                                                   | 个人的项目特定配置，加入 `.gitignore`                                        |
| **子目录** | `./subdir/CLAUDE.md`                                                                                                                                  | Claude 访问该目录文件时按需加载，不在会话开始时注入                          |

不同层级的 `CLAUDE.md` 会一起加载，后面的文件不会直接覆盖前面的全部内容。越靠近当前项目、作用范围越具体的规则，越贴近当前任务。

例如，用户级规则要求统一用空格缩进，项目级规则却要求使用 Tab，Claude 在该项目里更可能采用项目规则。不过，冲突指令会增加不确定性，发现后应该直接清理。

我的做法比较简单：项目级 `CLAUDE.md` 提交到 Git，放团队都要遵守的规则；只和自己有关的偏好，比如当前项目里希望提交信息用中文，就放进 `CLAUDE.local.md`，再加到 `.gitignore`，别把个人习惯混进团队文件。

## 项目变大了，CLAUDE.md 怎么管？

中小项目通常只需要一份 `CLAUDE.md`。模块增多以后，所有规则继续挤在根目录文件里，会让每个会话都加载一批与当前任务无关的内容。

![CLAUDE.md 组织方式演进](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-scaling-evolution.png)

### 项目不大时：只保留一份文件

技术栈、常用命令和架构边界等全局信息留在根目录文件中。大部分中小项目用这一层就够了，我自己的 `CLAUDE.md` 通常也不会超过 50 行。

### 内容变多时：让主文件负责路由

根目录 `CLAUDE.md` 保留项目概述和常用命令，架构规范、API 约定、测试要求放在独立文件中，再用 `@path/to/file` 引用：

```markdown
## Project

Spring Boot 3.2 + MyBatis-Plus + MySQL 8.0 的订单管理服务。

## Commands

- 构建：`mvn clean package`
- 测试：`mvn test`

## Rules

- API 约定：@docs/api-conventions.md
- 数据库规范：@docs/database-rules.md
```

### 规则只对部分代码生效时：按路径加载

在 `.claude/rules/` 中使用 frontmatter 匹配文件路径：

```markdown
---
paths:
  - "src/main/java/**/controller/**/*.java"
---

# Controller 规范

- 统一使用 Result<T> 包装返回值
- 所有接口必须添加 Swagger 注解
```

编辑 Controller 时会加载 Controller 规则，处理 Service 时则不会一直占用这部分上下文。实际使用时，加载时机还会带来三个边界。

**新建文件时，路径规则可能尚未加载。** path-scoped rules 在 Claude **读取**匹配文件时注入，不会在每次工具调用前检查。直接新建一个匹配路径的文件时，创建期规则可能还没有进入上下文。“新建 Controller 必须带某个文件头”这类要求应该放到无 `paths` 的全局 rules、根目录 `CLAUDE.md`，或者交给 Hook 检查。

**压缩上下文后，局部规则需要重新触发。** `/compact` 之后，根目录 `CLAUDE.md` 会重新注入；子目录 `CLAUDE.md` 和路径规则要等 Claude 再次读取匹配文件才会加载。继续修改文件前，可以先用 `/context` 检查当前会话中的指令。

**规则是否加载需要实际检查。** `/context` 可以查看当前会话加载的 `CLAUDE.md`、`CLAUDE.local.md` 和 rules 文件；`/memory` 用于查看和编辑配置位置。需要记录详细加载过程时，可以配置 `InstructionsLoaded` Hook。

我目前在用的就是主文件 + 按路径匹配的规则文件这一层级。更高阶的玩法（比如引入 Skills 和 MCP 做动态能力加载）还在探索中。

> **工程提示**：`@path/to/file` 会把整个文件嵌入上下文。引用几百行的文件，会让每个会话一开始就占用较多指令空间。官方文档目前限制递归导入最多 4 层。对于大文件，可以改写成“架构细节参见 `docs/architecture.md`”，让 Claude 在需要时读取。

## 怎么维护？

项目结构、命令和工作流发生变化后，`CLAUDE.md` 中的旧规则也要跟着清理。

`CLAUDE.md` 用于保存主动维护的长期指令，例如团队必须遵守的规则和每个会话都要知道的项目事实。Auto Memory 是 Claude Code v2.1.59+ 内置的自动记忆机制，可以记录协作过程中出现的调试结论、偏好和工作习惯。

我的习惯是：会影响团队协作、每次会话都应该遵守的，写进 `CLAUDE.md`；只是在排查过程中学到的小经验，就交给 Auto Memory。

比如“所有接口返回 `Result<T>`”应该写进 `CLAUDE.md`；“这个项目的 Redis Stream 测试需要本地先启动 Redis”这种调试发现，让 Auto Memory 记住就够了。Auto Memory 默认开启，可以在 `/memory` 里查看、编辑、关闭；它会为每个项目维护独立的 memory 目录，但它不是团队共享规范，不能替代提交到仓库里的 `CLAUDE.md`。

![CLAUDE.md 维护决策流程](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-maintenance-flow.png)

### 什么时候添加规则？

Claude 已经出现过某类错误，而且一句明确的规则能够降低重复出错的概率，这时再考虑添加。规则文件只能提供指令；可以机械校验的要求，还要交给测试、Linter、Hook 或 CI。

### 什么时候删除规则？

规则对应的项目约束已经失效，或者移除后 Claude 的行为没有变化，就可以删除。代码中已经能够直接读出的事实，也不需要在规则文件里重复维护。

### 怎么判断规则需要调整？

Claude 如果说“抱歉，我刚才忽略了 XX 规则”，先确认该文件是否已经加载，再检查规则是否给出了明确动作。只有“注意”“尽量”这类要求时，可以换成可执行、可验证的表述。

同一条规则在不同会话中反复被违反，还要排查文件是否过长、多个规则是否冲突、规则是否放在正确的作用域。继续加粗或加感叹号，通常不会改变这些问题。

### 怎么做定期检查？

可以定期选几条规则，问 Claude：“删除这条规则后，你会改变哪些行为？”这个回答只能用于初步筛选，因为 Claude 对自身行为的预判并不完全可靠。拿不准时，可以在两个平行会话中分别使用包含和不包含该规则的 `CLAUDE.md`，给出相同 prompt，再比较结果。

遇到错误时，也不要立即让 Claude 把教训写进 `CLAUDE.md`。先判断它是否长期有效、是否影响团队成员、以后是否还会遇到。同类错误重复出现后，再归纳成一条规则；只与本机有关的偏好或一次调试结论，可以留在 Auto Memory。

## 常见踩坑

- **只知道加规则，不记得删。** 每次出错就往 `CLAUDE.md` 里补一句，旧规则却一直留着，文件很快就会越写越长。等 Claude 开始漏规则时，再加粗、加感叹号意义不大，先把过期、重复的内容删掉。
- **用 `@` 一口气导入大文件。** `@` 引用会把整个文件放进上下文。几百行的文档直接导入，会话还没开始就先占掉一块空间。低频资料写成“架构细节见 `docs/architecture.md`”就够了，需要时再让 Claude 自己读。
- **把新建文件的要求全放在 path-scoped rules 里。** 路径规则要等 Claude 读取匹配文件后才会加载。直接新建文件时，这些规则可能还没有进入上下文。创建阶段必须遵守的要求，放到全局 rules、根目录 `CLAUDE.md` 或 Hook 里更合适。
- **几个规则文件各说各话。** 用户级、项目级和目录级规则一旦冲突，Claude 不一定会提醒你，也不一定每次都做出同样的选择。项目规则改动后，顺手检查一下其他层级，把重复和冲突的内容一起清掉。
- **Claude 偶尔出错，就马上补一条永久规则。** 一次罕见问题换来一条长期规则，后面的每个会话都要为它占用上下文。同类问题反复出现，而且确实能用一句明确指令约束时，再写进去也不迟。

## 总结

写 `CLAUDE.md` 时，不用想着把项目里的所有规矩都塞进去，这样完全没意义。

我自己平时经常用的一个判断是：这条信息，Claude 光看代码能不能猜准？看不出来，猜错后又容易把活干偏，这类信息就该写。

技术栈版本、启动和测试命令、架构边界、项目里那些不太显眼的限制，通常都值得留。至于缩进、import 排序这些，交给格式化工具更省心。

项目还小时，也别急着搭一套复杂的规则体系。先在根目录放一份短一点的 `CLAUDE.md`，够用就行。等内容真的多了，再把局部规则拆到 `.claude/rules/` 或独立文档里。拆完用 `/context` 看一眼，别以为文件放对了，Claude 就一定已经读到了。

`CLAUDE.md` 也不是写完就封存的说明书。Claude 反复犯同一个错，就补一条；项目改了，旧规则就删；能靠测试、Linter、Hook 或 CI 卡住的，直接交给工具。文件短一点、规则准一点，往往比面面俱到更有用。


---

---

<!-- source: 实践/Codex 使用指南-配置、AGENTS.md 与 Agentic 工作流.md -->

## [14] Codex 使用指南：配置、AGENTS.md 与 Agentic 工作流

---
title: Codex 使用指南：配置、AGENTS.md 与 Agentic 工作流
description: 结合 OpenAI 官方文档和 Codex CLI 社区实践，讲清 Codex 的任务描述、计划阶段、AGENTS.md、config.toml、权限控制、MCP、Skills、Subagents、Hooks 和 Scheduled Tasks。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: OpenAI Codex,Codex CLI,AI编程,AGENTS.md,Agent Skills,MCP,Subagents,Hooks,Scheduled Tasks,AI辅助开发
---

你好，我是小 G。前面写过一篇 [Claude Code 使用指南：配置、工作流与进阶技巧](./Claude Code 使用指南-配置、工作流与进阶技巧.md)，发出去之后，有同学在后台问：Claude Code 讲了这么多，那 Codex 怎么用更稳？

我最开始用 Codex 的时候，对它的预期其实不高。

毕竟从名字上看，很容易以为它就是一个更会写代码的命令行助手。真正用了一段时间之后，感受不太一样：Codex 更像一个能自己读仓库、改文件、跑命令、回来交差的工程助手。它不适合只拿来补几行代码，反而更适合处理那些有明确目标、能验证、边界也说得清的任务。

但这里面有个前提。

你得先把工作台摆好：任务边界、权限、项目规则和验收标准，都要提前说清楚。

任务描述太虚，它就会到处猜；权限给得太宽，它可能顺手做出你没授权的动作；`AGENTS.md` 写成项目宣传稿，它每轮还是得重新理解仓库；验收标准不给，它很容易停在“看起来已经改完了”。

这篇文章不打算按产品发布史来介绍 Codex，也不围着某个模型名展开。模型、套餐、命令细节变得很快，写死很容易过期。更值得留下来的，是几条在真实项目里比较抗折腾的经验：任务怎么交代，什么时候先进计划阶段（Plan），`AGENTS.md` 放什么，`config.toml` 管什么，权限、Rules、Hooks 怎么分层，MCP、Skills、Subagents、Scheduled Tasks 又分别适合什么场景。

先说个边界：本文主要面向 **Codex CLI + Codex App** 的日常使用。IDE Extension、Web/Cloud 端能看到的命令和能力不一定完全一致。

## 任务别只写一句话

很多人第一次把任务丢给 Codex，会这么写：

```text
帮我优化一下登录逻辑。
```

这句话对人都不够用，对 Codex 当然也不够用。登录逻辑在哪里？优化的是性能、可读性、安全性，还是线上 Bug？哪些文件不能动？改完后用什么证明它真的好了？

OpenAI 官方最佳实践里有个很实在的框架：Goal、Context、Constraints、Done when。翻成日常写法，就是把“要做什么、看哪里、别碰什么、做到什么程度算完”说清楚。Done when 不要只写“功能正常”，最好写清楚测试、构建、lint、截图、日志或命令输出这类可验证证据。

比如同样是修登录问题，我会改成这样：

```text
目标：修复用户 session 过期后 refresh token 仍有效但刷新失败的问题。
上下文：重点阅读 src/auth、src/session 和 AuthControllerTest。
约束：不要改数据库表结构，不要引入新依赖，保持现有 Result<T> 返回格式。
完成标准：补一个能复现问题的测试，修改实现后运行相关测试，并汇报命令和结果。
```

这样可以减少 Codex 的猜测空间。

小任务可以简单一点。比如改一处文案、补一条日志、把某个参数名统一掉，直接说明目标就行。可一旦任务碰到权限、支付、订单状态、数据迁移、并发、兼容性这些东西，最好别省那几行说明。你前面多写 2 分钟，后面少看很多奇怪 diff。

还有一个习惯很有用：**把原始材料给 Codex，别只给自己的判断。**

比如线上报错，不要只说“应该是缓存没清”。把堆栈、请求参数、复现步骤、失败测试、浏览器控制台输出贴进去，让它自己定位。你先下一个结论，它很容易顺着你的猜测往下走，最后把一个配置问题修成了业务逻辑问题。

## 复杂任务先让它看路

Codex 能直接改代码，但不代表每次都应该直接改。

我现在会先看任务风险。改文案、补字段、加一条明显的空值保护，这类事情直接让它做。它读文件、改文件、跑一下测试，效率很高。

另一类任务就不一样了。比如你要改订单状态机，或者把一个 600 多行的函数拆开，又或者排查一个偶发超时。你自己都还没完全摸清调用链，这时候让 Codex 上来就写代码，很容易越修越绕。

这类任务我会先让它进入计划阶段：

```text
先进入计划阶段，不要修改文件。
阅读 src/payment、src/order 和相关测试，搞清楚支付成功后库存扣减的调用链。
请输出关键文件、当前流程、可能修改点、风险点和建议验证命令。
```

等它读完仓库，再让它把计划拆出来：

```text
基于刚才的分析，给出一个分阶段计划。
每个阶段写清楚要改哪些文件、补哪些测试、怎么验证。
不要开始实现，等我确认。
```

这个流程慢在前 10 分钟，快在后面。

老项目真正麻烦的地方，往往不是某一段代码难写，而是历史兼容逻辑、灰度开关、配置兜底和不敢动的边界混在一起。计划阶段（Plan）的价值，就是先把这些东西捞出来。

计划阶段的输出只是候选方案，不是最终事实。高风险改动仍然要人工确认关键调用链、事务边界和兼容性。

不过也别把计划阶段（Plan）当仪式。任务足够小、验收足够明确时，直接执行反而更好。社区里有个观点我挺认同：普通 Codex 配小任务，比复杂 workflow 更容易稳定产出。

## AGENTS.md 非常重要

### 不要写成第二份 README

它有点像 Claude Code 里的 `CLAUDE.md`，都是给 Agent 看的项目级指令文件。更直白一点说，`AGENTS.md` 是一份 **Agent 工作说明**：告诉 Codex 这个项目怎么启动、怎么测试、哪些目录别碰、改完后要给出什么证据。

![多智能股票分析项目中的 CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

不过两者的定位不完全一样。

`CLAUDE.md` 是 Claude Code 专属入口，主要给 Claude Code 读；`AGENTS.md` 是一个面向 coding agents 的开放指令文件格式，OpenAI Codex 官方支持它。其他工具是否读取、如何读取，要以各自文档为准，不要默认所有 Agent 都会按同一套规则加载。

如果仓库里已经有 `AGENTS.md`，通常没必要再维护一份内容几乎一样的 `CLAUDE.md`。可以让 `CLAUDE.md` 导入 `AGENTS.md`，再补 Claude Code 特有的要求：

```markdown
@AGENTS.md

## Claude Code 特定指令

- 使用 plan mode 处理 `src/billing/` 下的改动。
```

这样基础规则只维护一份，Claude Code 和 Codex 都能复用。反过来，如果团队原来只有 `CLAUDE.md`，现在想让 Codex、Cursor 这类工具也读到同一套约定，可以把通用部分抽到 `AGENTS.md`，把 Claude Code 专属命令留在 `CLAUDE.md`。

我建议 `AGENTS.md` 只放 Agent 真会用到的信息：

- Codex 容易猜错的规则
- 代码里读不出来的约定
- 团队必须遵守的规范
- 技术栈版本、常用命令、架构取舍、项目坑点

### 分层怎么放

Codex 启动时会构建一条 instruction chain。当前官方文档里的发现顺序是：先读 Codex home 下的 `AGENTS.override.md`，如果没有再读 `AGENTS.md`；然后从项目根目录一路走到当前目录。每个目录按 `AGENTS.override.md`、`AGENTS.md`、fallback filenames 的顺序最多读取一个文件。越靠近当前工作目录的说明越靠后，也越容易影响本轮任务。

`AGENTS.override.md` 适合临时覆盖同目录下的 `AGENTS.md`。如果你只是想短期改一条规则，不想动基础文件，可以用它。

还有个不太起眼但很实际的限制：`project_doc_max_bytes` 默认限制的是 Codex 合并后的项目指令大小，官方默认是 32 KiB。即便能调大，也不建议把规则写成大而全的 README。文件太胖以后，重要规则会被淹掉，Codex 也不一定更听话。

我的判断标准很简单：

> 这行删掉以后，Codex 会不会更容易犯错？

会，就留；不会，就删。

有些团队还会把 `AGENTS.md` 当成 Agent 的错误笔记。比如 Codex 在某类任务里反复改错测试命令、误动生成目录、忘记跑某个检查，就把原因和正确做法沉淀进去。这个思路是对的，但别把每次失败都原样粘进去。最好压成一条可执行规则，否则文件会很快变成流水账。

`/init` 可以生成一份初始 `AGENTS.md`，但它只能当草稿。自动生成的内容经常会把 README 里的东西搬进来，也可能猜错测试命令。生成后最好人工删一轮，只保留会影响 Codex 行为的部分。

还有一种更适合大项目的写法：让 `AGENTS.md` 只做目录。

我在 [一文搞懂 Harness Engineering](https://javaguide.cn/ai/agent/harness-engineering.html) 里也提到过，OpenAI 自己的 `AGENTS.md` 大约只有 100 行，更像一个索引：先告诉 Agent 最关键的仓库规则，再指向 `docs/` 下面更细的设计文档、架构图、执行计划和质量评级。Agent 真的需要深入某个模块时，再顺着链接去读。

这就是渐进式披露。

不要把所有背景一次性塞进上下文。根目录 `AGENTS.md` 放最关键的工作规则；模块级 `AGENTS.md` 放局部约定；更长的设计说明、迁移背景、架构取舍，放到单独文档里，通过链接让 Agent 按需加载。这样既不浪费上下文，也更容易维护。

## `config.toml` 管客户端行为

`AGENTS.md` 是项目说明，`config.toml` 是 Codex 客户端自己的配置。

常见位置有几个：用户级配置在 `~/.codex/config.toml`，项目级配置在 `.codex/config.toml`，不同 profile 可以放到 `~/.codex/<profile>.config.toml`，系统级配置在 Unix 上通常是 `/etc/codex/config.toml`。

按当前官方配置文档，优先级从高到低是：CLI flags 和 `--config` 覆盖、项目级 `.codex/config.toml`、通过 `--profile` 选择的 profile、用户级 `~/.codex/config.toml`、系统级 `/etc/codex/config.toml`、内置默认值。项目级配置只有在项目被信任后才会加载；如果项目被标记为 untrusted，项目内的 `.codex/` 配置、Hooks 和 Rules 都会被跳过。

日常最值得关心的不是某个模型名，而是权限和沙箱。

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

这组配置比较适合日常开发：Codex 可以在工作区里改文件、跑验证，但遇到更敏感的命令会停下来问你。

`approval_policy = "never"` 或者更宽的沙箱，不是不可以用，只是要放在隔离好的环境里。比如临时 worktree、容器、一次性脚本、CI、测试账号、最小权限凭据。为了少点几次确认就把权限全放开，真实项目里不太划算。

Hooks 当前默认启用。如果你确实要关闭，再在 `config.toml` 里设置：

```toml
[features]
hooks = false
```

这个方向也更符合安全直觉：别人仓库里带的配置、Rules、Hooks 都可能影响本地执行，不能默认全信。

这几个文件和机制的分工可以先这么记：

| 能力               | 主要解决什么                   | 适合放什么                                   |
| ------------------ | ------------------------------ | -------------------------------------------- |
| `AGENTS.md`        | Agent 工作说明                 | 项目规则、常用命令、目录约定、验收标准       |
| `config.toml`      | Codex 客户端配置               | 模型、sandbox、approval、profile、MCP 等配置 |
| Rules              | 命令级 allow / prompt / forbid | 哪些命令可放行、哪些必须确认、哪些禁止       |
| Hooks              | 生命周期脚本                   | 检查、审计、格式化、上下文注入               |
| sandbox / approval | 最终执行边界                   | 文件系统、网络、命令执行和人工确认策略       |

## 权限、Rules 和 Hooks 各管各的

Codex 的安全控制有好几层，刚上手时容易全写到 `AGENTS.md` 里。

这种做法不够可靠，因为 `AGENTS.md` 只是指令，不是执行层面的硬约束。

`AGENTS.md` 是软提醒；sandbox 和 approval 管运行边界；Rules 管命令能不能跑；Hooks 管某个生命周期节点必须做什么。

比如“不要执行 `rm -rf`”，只写在 `AGENTS.md` 里，还是一条建议。写进 Rules，Codex 执行前就会被拦住。Rules 当前仍是实验能力，语法和成熟度可能变化；下面写法以当前 Codex Rules 文档为准。如果你的本机版本不支持，先用 `/permissions`、sandbox、approval 或 Hooks 做替代控制。

```python
prefix_rule(
    pattern = ["rm", "-rf"],
    decision = "forbidden",
    justification = "不要让 Codex 执行递归强删；请人工确认具体目录后手动处理。",
    match = [
        "rm -rf dist",
    ],
)
```

Hooks 解决的是另一类问题。

如果你希望 Codex 停止前跑一段校验脚本，或者在工具调用前检查 prompt 里有没有误贴 API key，或者编辑后自动跑格式化，就适合放到 Hook 里。Codex Hooks 当前支持的事件以官方文档为准，比如 `PreToolUse`、`PermissionRequest`、`PostToolUse`、`PreCompact`、`PostCompact`、`UserPromptSubmit`、`SessionStart`、`SubagentStart`、`SubagentStop`、`Stop` 等。

不过 Hook 最后跑的还是本地脚本，写坏了一样麻烦。官方文档里也提到，非托管命令 Hook 需要 Review 和信任，变更后会重新等待确认。多个匹配同一事件的 command hooks 会并发启动，不能依赖 Hook 之间的执行顺序来做安全拦截。这个限制看着啰嗦，但挺有必要。

## 让 Codex 证明它真的改对了

AI 写代码最麻烦的地方，不是它写不出来，而是它很会写“看起来合理”的代码。

所以我很少只说“改完告诉我”。我更愿意把验证写进任务里：

```text
先补一个失败测试复现这个问题。
确认测试失败后再改实现。
改完运行相关测试。
如果连续两三轮仍失败，停止并汇报当前阻塞点和证据，不要继续盲改。
```

这个顺序能挡住很多假修复。它必须先把问题复现出来，再改实现，最后用测试证明。

Codex 结束时，我一般会看 3 件事：改了哪些文件，跑了哪些命令，还有哪些风险没覆盖。`/diff` 用来快速看改动，`/review` 可以审当前未提交改动、某个 commit，或者按你的自定义要求做检查。

更细一点，AI Coding 的验证证据可以按这个清单要：

- 失败测试先红后绿。
- `git diff` 摘要和关键文件说明。
- 测试、lint、build 命令和结果。
- 没覆盖到的风险点。
- 需要人工 Review 的重点。
- 出问题时怎么回滚。

社区实践里有两个提示词也挺好用：

```text
Prove to me this works. Compare the diff against main and show the evidence.
```

```text
Knowing everything you know now, scrap this approach and propose the simpler implementation.
```

前一句是让它拿证据，不要只写结论。后一句适合在第一版方案能跑但很绕的时候用。Codex 已经读过一轮上下文，再让它重新想一次，往往能把实现收得更干净。

不过最后还是要自己看 diff。Codex 的总结不能代替 Review。它说“只改了测试”，你也得打开关键文件看一眼；它说“没有风险”，你也要自己想想事务、并发、权限、兼容性有没有漏。

## MCP 只接真正能省事的工具

MCP（Model Context Protocol，模型上下文协议）像一套接线规范：**外部系统把能力封装成 MCP Server，支持 MCP 的 AI 应用连接上来之后，就能发现这些能力并调用。**

![MCP 图解](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/mcp-simple-diagram.png)

真实开发里的上下文，不只在仓库里。

报错在 Sentry，需求在 Linear，接口说明在内部文档，设计稿在 Figma，复现步骤在浏览器，PR 讨论在 GitHub。你当然可以一段段复制给 Codex，但次数多了就很烦。

MCP 适合解决这种问题。按当前 Codex MCP 文档，Codex 支持 STDIO MCP Server 和 Streamable HTTP Server，Streamable HTTP Server 支持 Bearer token 或 OAuth 认证。具体 server 类型、认证字段和配置方式，还是以当前 MCP 文档为准。

比如添加 Context7 文档 MCP：

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

加完之后，可以在 TUI 里用 `/mcp` 看当前服务器状态。

这里有个取舍：**MCP 不是越多越好。**

我更建议只接高频、明确、最好先只读的工具。经常查线上错误，就接 Sentry 或日志平台；经常改前端，就接浏览器、Playwright、Figma；经常处理 PR，就接 GitHub。带写权限、带 token、能操作外部系统的 MCP，先克制一点。

可以按风险分三层：

- 只读 MCP：查文档、查错误日志、读 Sentry、看 PR 信息。
- 半写 MCP：创建 issue、评论 PR、生成草稿、更新非生产文档。
- 高危 MCP：发版、改生产配置、删除资源、操作云平台或数据库。

默认先接只读工具。半写工具要限定 scope，高危工具单独审批和审计，token 尽量用最小权限和短期凭据。

工具越多，Codex 的选择空间越大，误用概率也会变高。

自己写 MCP Server 时，别只暴露工具参数。当前 Codex MCP 文档里提到，Codex 会读取 MCP 初始化时返回的 `instructions` 字段，并建议把最重要的说明放在前 512 个字符里。什么时候该用、什么时候不该用、返回内容怎么理解，这些都值得写清楚。

## Skills 用来存重复流程

规则文件和 Skill 解决的问题不太一样。

规则文件更适合放这个项目一直要遵守什么，比如：技术栈版本、启动命令、目录结构、错误码格式、哪些文件不能碰。

Skill 更适合放遇到某类任务时应该怎么做。比如做代码审查、写测试、改前端页面、网页调研、写技术文章，这些任务每次流程都差不多，就没必要每次都在聊天里重新提醒一遍。

小 G 之前写过两篇相关的文章：[Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html) 和 [AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)。

简单说，Skill 就是一份能被 Agent 按需加载的任务说明。它不是插件，也不是 MCP 工具本身，而是把某类任务的流程、约束、检查项和踩坑经验写进 `SKILL.md`。

Skill 不像 `AGENTS.md` 那样把全文每次都塞进上下文。默认情况下，Codex 会先看到 Skill 的名称和描述，用来判断是否该调用；只有真正用到这个 Skill 时，`SKILL.md` 正文和相关资源才会进入上下文。

![Agent 执行链路](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skills-agent-execution-link.png)

这些重复性很强的流程，都适合沉淀成 Skill。比如写功能前固定走 TDD，先写失败测试再实现；代码审查时固定检查安全、事务、性能和边界条件；写技术文章时固定核对事实来源、引用、标题层级和 AI 味。

Skill 的价值就在这里：把重复提醒变成可复用的工作手册。Codex 的 Skills 和 Claude 的 Skills 在理念上接近，都是把重复任务流程沉淀成可复用能力；但两者的文件结构、触发方式、可用平台和安全模型，要分别以各自官方文档为准。

一份最小可用的 `SKILL.md`，可以先写到这个粒度：

```markdown
---
name: java-service-review
description: Review Java service-layer changes for transaction boundaries, null handling, logging, and regression tests.
---

Use this skill when reviewing Java service-layer changes.

Input materials:

- Current diff or target files.
- Related tests and error logs, if available.

Steps:

1. Read the changed service methods and related tests.
2. Check transaction boundaries, null handling, logging, and regression coverage.
3. Return findings with file and line references.

Do not rewrite code unless the user explicitly asks.

Done when:

- Findings are ordered by severity.
- Each finding explains the risk and a concrete fix direction.
```

现成 Skill 也可以直接用，比如 Superpowers 把 TDD、Code Review、Spec-Driven、Git Worktree、子 Agent 协作这些流程封装好了。

我在 [AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html) 这篇文章中有详细推荐。

但第三方 Skill 不要拿来就跑。`SKILL.md` 也是指令，里面如果带了危险命令、奇怪脚本、过宽权限，Agent 会照着做。装之前至少看一眼正文、`scripts/` 和 `references/`，确认它没有越权操作。

## Subagents 适合处理支线调查

长任务里，最占上下文的往往不是最终方案，而是中间调查过程。

比如排查一个复杂 Bug，Codex 可能要读几十个文件、翻一堆日志、试几个假设。最后真正有用的结论只有几条，但主会话已经被搜索结果和中间推理塞满了。

这种时候可以用 Subagents。

按当前 Codex 文档，Subagent workflow 默认启用，但 Codex 只有在你明确要求时才会 spawn subagents。每个 subagent 都会执行自己的模型和工具工作，因此会比单 agent 更耗 token。

当前文档里列出的内置 agent 包括：`default` 做通用兜底，`worker` 更偏执行和修复，`explorer` 更偏只读探索。自定义 agent 配置格式、内置 agent 名称和可见入口都可能随版本变化，实际以 `/agent`、官方 Subagents 文档和本机版本为准。你也可以在 `~/.codex/agents/` 或 `.codex/agents/` 里放自定义 TOML Agent。

比较适合拆出去的任务长这样：

```text
Review current branch against main.
Spawn one subagent for each topic: security, concurrency, tests, maintainability.
Wait for all agents, then summarize findings with file references and severity.
Do not modify files.
```

这类任务边界清楚，也天然并行。

不适合拆的是很小的改动。改一个 DTO 字段还开 4 个 subagent，沟通成本可能比修改本身还高。我的习惯是：主会话负责目标、取舍和最后验收；subagent 只处理局部、明确、能独立汇报的事。

还有一点要留意：Subagents 继承当前 sandbox 策略。交互式 CLI 里，非当前 thread 的 approval 请求也可能弹出来，批准前看清楚是哪个 agent 发起的请求。

## Scheduled Tasks 别一上来就全自动

Codex App 里原先常被称为 Automations 的能力，当前 UI 主要称为 **Scheduled Tasks**。它适合跑重复任务，比如每天扫近期提交、每周生成 release note、定时检查 CI 失败、汇总未处理告警。

它不是拿来“自动修复一切”的。

Scheduled Tasks 要区分运行方式。绑定当前任务的计划适合回到同一上下文继续检查；独立或项目级计划可以按 schedule 启动运行。项目级任务执行时，本地 Codex App 所在机器要开机，Codex 要运行，项目路径也要还在磁盘上。Git 仓库任务可以在本地项目里跑，也可以在 dedicated background worktree 里跑。Scheduled Tasks 使用默认 sandbox 设置，如果给了 full access，后台任务风险也会变高。

我觉得比较稳的顺序是：先把流程写成普通 prompt，手动跑几次；如果每次都在复制同一套步骤，就沉淀成 Skill；等 Skill 稳定之后，再做成 Scheduled Task。

也就是说，Skill 定方法，Scheduled Task 定时间。任务 Prompt 也要写成可独立运行的 durable prompt，不要依赖上一次对话里的隐含上下文。

比如“每天自动修复所有 Bug 并提交 PR”，听起来很省事，真实项目里大概率制造一堆要人收拾的 diff。更靠谱的是“每天扫描最近 24 小时的 CI 失败并汇总原因”。先让它报告，再决定要不要改。

## 常用命令记几类就够了

Codex CLI 的 slash command 会变，CLI、Codex App、IDE Extension 看到的命令也不一定完全一致。下面这些命令只作为当前使用经验，实际以你所在 surface 的 `/` 弹窗和 `/help` 为准。

我一般记几类：

- 控制会话与计划：`/permissions`、`/model`、`/fast`、`/status`、`/clear`、`/plan`、`/goal`。
- 看上下文、记忆和改动：`/diff`、`/compact`、`/copy`、`/memories`。
- 扩展能力：`/agent`、`/mcp`、`/hooks`、`/plugins`、`/apps`、`/skills`。
- Review 和恢复：`/review`、`/fork`、`/resume`。

命令只是入口，不是工作流本身。真正决定结果的，还是任务边界、项目规则、验证标准和权限设置。

## 几个我常用的工作流

接手陌生项目时，我会先让 Codex 当临时向导：

```text
不要修改文件。
请解释用户登录流程，从 HTTP 请求进入到 session 写入为止。
列出关键类、方法、配置项，以及你认为需要人工确认的隐式约束。
```

它总结出来的内容要抽查，尤其是跨服务调用、灰度配置、历史兼容逻辑。让它列文件和方法名，比只听自然语言总结可靠。

修 Bug 时，不要只说“帮我修一下”。我更愿意把材料摊开：

```text
下面是失败测试、错误日志和复现步骤。
先定位根因，不要马上改代码。
找到根因后，先补一个能复现的测试，再修改实现。
完成后运行相关测试，并说明为什么这个测试能覆盖问题。
```

如果它连续两轮都在同一个错误方向上打转，别继续追问“再试试”。停下来，让它复盘已经知道什么、哪些假设被证伪、下一步还缺什么证据。

TDD 对 AI 编程也很有用：

```text
先不要改实现。
为 OrderStatusService 写一个失败测试，覆盖已支付订单重复回调时不能重复扣库存的场景。
测试失败后再改实现，直到测试通过。
```

这个顺序能先固定期望行为，再让 Codex 去实现。

前端任务要更具体一点。别只说“现代、简洁、高级”，这类词太空，最后很容易得到紫色渐变、大圆角卡片、营销页布局。后台系统尤其容易翻车。

```text
这是后台运营页面，信息密度优先，不要营销页风格。
使用现有 Ant Design 组件，不新增 UI 库。
参考 src/pages/UserList.tsx 的筛选区、表格和分页布局。
主色沿用 CSS 变量，不要新增渐变背景。
完成后启动本地页面，检查移动端和桌面端是否有文本重叠。
```

PR Review 也一样，范围越窄越好：

```text
Review current branch against main.
Focus only on correctness, transaction boundaries, null handling, and missing tests.
Return findings ordered by severity with file and line references.
Do not comment on style unless it can cause a bug.
```

Codex 有时会把“可能更好”说得像“必须修”。Review 结果里真正要优先处理的，是会导致 Bug、安全问题、数据不一致、兼容性破坏和测试缺口的发现。

## 安全边界

Codex 能读文件、写文件、跑命令、接 MCP、调浏览器。能力越强，边界越要清楚。

我建议至少守住几条线：

- 不把生产数据库密码、云厂商长期 token、SSH key 暴露给 Codex。
- 不让它默认读取 `.env`、证书、数据库 dump、生产日志和私钥目录。
- 不让它直接操作生产环境，除非有临时凭据、审批和审计。
- 不允许默认 push 到主分支或强推远端分支。
- 不在无隔离环境里执行来源不明的远程脚本。
- 不把写权限 MCP 一次性全接上。

真的要跑高权限自动化，就放进容器、临时账号、最小权限凭据和独立 worktree 里。AI 写错代码还能 Review，AI 拿错权限就麻烦多了。高权限自动化还要保留操作日志、命令输出、diff 和审批记录，并确保能快速回滚。

## 容易翻车的地方

任务太虚，是最常见的问题。你只说“优化一下”，Codex 就只能自己猜，最后很可能搜一堆文件、改一堆边缘代码。把目标、上下文、限制和完成标准补齐，通常能少掉很多无效探索。

过度规划也会浪费时间。小改动不需要长计划，直接做、看 diff、跑验证就行。计划阶段（Plan）更适合跨模块、风险高、调用链不清楚的任务。

`AGENTS.md` 太胖时，效果反而会变差。规则很多，但真正关键的几条被冲淡了。它应该从真实错误里长出来：Codex 反复踩过的坑，写进去；代码里一眼能读出来的事实，删掉。

工具和权限也别一次放太开。MCP 接太多，Codex 会选错；权限给太宽，后台任务能做的事就超出你的心理预期。高权限任务放隔离环境，日常开发保持最小权限。

最后是验证缺失。代码看着合理，不代表行为对。测试、lint、构建、截图、日志，这些东西至少要有一种。长会话开始变慢、变飘时，就 `/compact`，必要时 `/fork` 或新开 thread。多 agent 也一样，主会话做决策，subagent 只处理局部研究。

## 按风险分层使用

小任务不用复杂化。改文案、补日志、改一个明显的字段映射，直接让 Codex 执行，结束后看 `/diff`，跑对应单测就行。

中等任务先走计划阶段（Plan），再执行，再验证。比如改一个模块内的业务流程、补一个接口、重构一个局部服务，最好先让 Codex 读相关文件，列出修改点和验证命令，你确认后再动手。

高风险任务先只读分析。支付、权限、数据迁移、生产配置、并发一致性这类改动，先让 Codex 找调用链、风险点和测试缺口；人工确认关键判断后，再用 TDD 或小步提交推进。环境上尽量用 worktree、容器、临时凭据和更收紧的权限。

自动化任务也别一步到位。先手动跑通一两次，再沉淀成 Skill；等 Skill 稳定，再做成 Scheduled Task。高权限自动化要额外保留审计记录和回滚方案。

## 总结

Codex 用顺之后，感觉会从“让 AI 写代码”变成“调度一个能自己读仓库、跑命令、交付 diff 的工程助手”。

但越是这样，越不能只盯着 prompt。

任务边界、项目规则、权限控制、验证标准、外部工具、可复用流程，这些东西一起决定了 Codex 最后交出来的质量。我的建议还是那句：先让它在一个小范围里稳定做对，再慢慢把边界往外推。

别一上来就全自动。


---

---

<!-- source: 实践/JavaGuide 专属 draw.io 绘图 Skill 开源-用 Agent 自动生成可编辑的 draw.io 技术图.md -->

## [15] JavaGuide 专属 draw.io 绘图 Skill 开源：用 Agent 自动生成可编辑的 draw.io 技术图

---
title: JavaGuide 专属 draw.io 绘图 Skill 开源：用 Agent 自动生成可编辑的 draw.io 技术图
description: 分享 drawio-chart Skill 的设计思路、安装方式和使用流程，说明为什么技术文章配图更适合保留 draw.io 源文件，以及如何让 Agent 生成可维护的流程图、架构图和模块关系图。
category: AI 编程实战
tag:
  - AI 编程
  - Skills
  - draw.io
  - Codex
  - 技术写作
head:
  - - meta
    - name: keywords
      content: draw.io,drawio-chart,Agent Skills,AI编程,技术文章配图,Codex,diagrams.net
---

你好，我是小 G。很多时候我感叹 AI 时代给我带来的冲击，是从一些小事引起的。

在过去，我写一篇技术文章最少需要花费一周，长一点的甚至要一个月。其中，有 1/3 的时间都花费在了枯燥的配图上。

熟悉我的读者朋友应该知道，[JavaGuide](https://mp.weixin.qq.com/s/MP8_Td9h72jAhTntVV4DxQ) 上的很多配图都是用 draw.io 手动绘制的。每一篇文章都有大量的图解，帮助理解。

![Java 基础常见面试题](https://oss.javaguide.cn/github/javaguide/项目介绍/java-basic-questions-01-overview.png)

![MySQL 常见面试题总结](https://oss.javaguide.cn/github/javaguide/项目介绍/mysql-questions-01.png)

但是到了 AI 时代就彻底变了，尤其是对于 draw.io 配图来说。

在去年 Skill 还没火的时候，我是用 AI 直接生成对应的 XML，然后导入到 draw.io 中。

到了今天，得益于 Skill 的诞生，生成 draw.io 配图变得更加自动化了。

这篇文章会分享我平时用的自定义 draw.io 绘图 Skill：[`drawio-chart`](https://github.com/Snailclimb/AIGuide/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart)，也会顺带聊聊为什么我没有完全转向图片生成模型，而是继续保留 `.drawio` 这种可编辑源文件。

## 为什么选择 draw.io？

图不能只看生成时漂不漂亮，后面能不能改也很重要。

技术文章发出去以后，标题、节点、箭头、术语经常会调整。如果手里只剩一张 PNG，要么重新生成，要么硬改图片，最后风格还不一定能对上。

所以我现在更愿意保留一份可编辑源文件。

比如我本地会把这些 `.drawio` 源文件单独留在素材目录里，后面要改某张图，直接打开对应文件就行。

![本地留存的 draw.io 配图源文件](https://oss.javaguide.cn/github/javaguide/ai/coding/local-drawio-source-files.png)

`draw.io` 的好处就在这里：`.drawio` 可以继续在 diagrams.net 或 draw.io 桌面版里改，导出 PNG、SVG、PDF 也方便。流程图、架构图、状态图这些技术图，源文件通常不大，放进仓库或素材目录也没什么压力。

导出时也不用额外折腾，菜单里可以直接选 PNG、JPEG、WebP、SVG、PDF 等常见格式。

![draw.io 导出格式选择](https://oss.javaguide.cn/github/javaguide/ai/coding/drawio-export-format-options.png)

Skill 刚诞生那会，我就把这套流程整理成了一个 Skill：[`drawio-chart`](https://github.com/Snailclimb/AIGuide/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart)。

现在你在 [javaguide.cn](https://javaguide.cn/) 上看到的不少 AI 编程、Spec Coding、Claude Code 相关文章配图，基本都是这套思路做出来的：

- 先让 Agent 抽结构、排节点、生成 `.drawio`，再按文章需要导出图片；
- 需要更强视觉表现时，再搭配 GPT-IMG2 做进一步处理。

## 为什么不只用图片生成？

我之前也试过几个方向。

[`tt-a1i/archify`](https://github.com/tt-a1i/archify) 更像是用自然语言生成自包含的 HTML 技术图，支持主题切换和多格式导出，也有校验、渲染流程。

[`coleam00/excalidraw-diagram-skill`](https://github.com/coleam00/excalidraw-diagram-skill) 走 Excalidraw 风格，适合白板感和观点表达，还会用 Playwright 检查文字重叠、箭头错位、间距失衡这些问题。

[`DayuanJiang/next-ai-draw-io`](https://github.com/DayuanJiang/next-ai-draw-io) 更像一套 AI 绘图产品，把 AI 接进 draw.io，支持在线 Demo、桌面应用、Docker、本地安装、MCP Server 和多模型配置。我当时用起来体感有点卡，画图效率也不高。不过这个项目现在还在更新，我没有重新压测，就不评价当前性能了。

这几个项目各有侧重。Archify 成品感更强，Excalidraw 更适合白板表达，next-ai-draw-io 更像独立产品。

但放到 JavaGuide 的技术文章里，我更常遇到的是这些需求：

- 图里有很多中文术语，后续经常要微调。
- 同一批文章里的配色、字体、节点风格要尽量统一。
- 图要能插进 Markdown、公众号、网页和仓库文档。
- 文章更新后，最好只改几个节点，而不是整张重来。

这时候 `.drawio` 源文件更顺手。

单独打开一个绘图系统，对文章配图来说有点重。Coding Agent 本来就在读文章、改文件、跑命令、整理素材，让它顺手调用 Skill 生成 `.drawio`，再批量导出，链路会短很多。

图片生成模型适合增强视觉表现，但不太适合长期维护。今天改一个词，明天加一个分支，你很难只让它精准动那一小块，还保持整张图不变形。

draw.io 没有那么“生成即大片”，但节点、连线、容器、文字都能继续改。对技术图来说，这点很值钱。

## 我现在的绘图流程

我现在更常用的流程大概是这样：

1. 先写文章，或者至少把文章的主线、流程、概念关系整理出来。
2. 让 Agent 判断这篇文章里哪些地方值得画图。
3. 用 `$drawio-chart` 生成 `.drawio` 源文件。
4. 需要发布时导出 PNG / SVG / PDF。
5. 如果某张图需要更强的视觉表现，再搭配 GPT-IMG2 做进一步处理。

我更在意的是把结构和表现拆开。

`drawio-chart` 负责结构化图表：流程怎么走，模块怎么连，状态怎么迁移，哪些节点属于一组。GPT-IMG2 更适合处理位图层面的表达，比如让一张图更像文章配图、更有视觉完整度。

结构还留在 `.drawio` 里，后面要改就能改。

下面这张就是一次实际生成 `.drawio` 的过程。Agent 读完需求后直接写出源文件，最后返回文件路径和结构说明。

![Codex 使用 drawio-chart 生成 draw.io 源文件](https://oss.javaguide.cn/github/javaguide/ai/coding/codex-generate-drawio-source.png)

打开以后，它仍然是标准 draw.io 文件。节点、连线、文字都能继续手动调，不会被锁死在一张图片里。

![draw.io 中打开生成的 SKILL.md 结构图](https://oss.javaguide.cn/github/javaguide/ai/coding/drawio-open-generated-source.png)

这就是绘图之后没有改动的原图，可以看到线条还是有一些小细节需要手动调整优化。这也是比较正常的。

下面来看看用这个 Skill 画的一些图片。

这张 `CLAUDE.md` 维护决策流程图，就是典型的流程判断类配图：

![CLAUDE.md 维护决策流程](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-maintenance-flow.png)

Multi-Agent 协作这种内容，如果只用文字写，读者很容易看成一堆角色名。画成流水线后，每个 Agent 负责什么、信息怎么流转，会直观很多。

![Multi-Agent 三代理协作流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-multi-agent-pipeline.png)

Spec Coding 这类文章也类似。它讲的是一套工作流，不是一个孤立概念。图里把需求、Spec、实现、验证串起来，读者就能先抓住整体，再回到正文看细节。

![Spec Coding 规范驱动编程流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-pipeline-flow.png)

还有 Spec 管理策略这种图，文字解释会比较绕。分层过滤、精准召回、上下文控制这些词放到一张图里，反而更容易理解。

![Spec 管理策略：分层过滤 + 精准召回](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-spec-management-strategy.png)

这些图不一定每张都要靠 AI 一次性做完。省时间的地方主要在前半段：Agent 先帮你搭出结构，后续人再按文章语境修。

技术文章配图一旦和文章脱节，就会很麻烦。图里的节点、标题、箭头如果不能和正文对上，再漂亮也没用。

## `drawio-chart` 这个 Skill 做了什么？

我之前在 [《Agent Skills 是什么？和 Prompt、MCP 到底差在哪？》](https://javaguide.cn/ai/agent/skills.html) 里讲过，Skill 更像一份按需加载的任务说明。

它不负责发明一个新工具，也不等同于 Function Calling 或 MCP。它解决的是：某类任务怎么做、什么时候做、哪些步骤不能漏、需要哪些参考资料。

`drawio-chart` 就是把“给技术文章画 draw.io 图”这件事沉淀成了 Skill。

它的主文件是 [`SKILL.md`](https://github.com/Snailclimb/AIGuide/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart/SKILL.md)，里面只放几类信息：

- 什么时候应该用它，比如 draw.io、diagrams.net、流程图、架构图、时序图、ER 图、状态机图、思维导图。
- 什么时候不该用它，比如用户只想要 Mermaid 代码，或者要的是位图插画、海报、白板风配图。
- 绘图前要收集什么信息，比如主题、图表类型、关键节点、节点关系、是否导出。
- 生成 `.drawio` 时按什么顺序走，比如标题、容器、核心节点、连线、标签。
- 交付前检查什么，比如节点是否齐全、关系是否画对、连线标签是否过长、文件名是否规范。

更细的东西没有全塞进 `SKILL.md`。

它拆了几个 `references/` 文件：

| 文件                  | 放什么                                         |
| --------------------- | ---------------------------------------------- |
| `style-spec.md`       | 配色、字体、节点语义、连线风格                 |
| `xml-and-layout.md`   | draw.io XML 结构、节点模板、连线模板、布局建议 |
| `export-and-files.md` | PNG / SVG / PDF 导出命令、文件命名、交付规则   |
| `use-cases.md`        | 常见 prompt、多图文章配图模式、页面命名建议    |

这个拆法和 Skills 的设计思路是一致的。

主文件不要写成超长 README。Agent 先知道这个 Skill 能干什么；命中任务以后，再根据当前需求读取对应参考文件。

比如只是生成一张流程图，不一定要读完整导出规范。如果用户明确要求导出 PNG，再去看 `export-and-files.md` 就够了。需要控制样式时，再读 `style-spec.md`。

这样上下文不会被无关细节挤满，执行也更稳定。

## 我给它加了哪些约束？

画图这件事很容易失控。

Agent 生成图时，常见问题有几个：节点文字太长，连线标签压在箭头上；一张图里颜色乱用，看起来像随机上色；流程图里每条线都带很长的解释；XML 里混进 HTML 标签，后面渲染或编辑时容易出问题。

所以 `drawio-chart` 里写了不少很具体的约束。

比如样式上，Agent 不需要现场随便选颜色。规则会按语义分配：入口、业务服务、基础设施、客户端、外部依赖、数据库、缓存、消息队列、异常状态分别有对应色值。这样同一批图放在一起时，读者不会每张都重新理解颜色。

文字上，它要求 `mxCell.value` 默认使用纯文本，需要换行时用 XML 换行实体，不在节点值里塞 `<br>`、`<b>` 这类 HTML 标签。

连线标签也要短。短连接线不要放长说明，能写进节点就写进节点，能放旁注就放旁注。技术图里很多凌乱感，都是从“每条线都想解释一句”开始的。

导出上，它默认先保留 `.drawio`，再按需要导出。即使导出失败，也不能删源文件。

## 怎么安装和使用？

我已经把这个 Skill 放到了 [AIGuide：AI 应用开发、AI 编程实战与面试指南](https://github.com/Snailclimb/AIGuide) 仓库里：

- 仓库入口：**<https://github.com/Snailclimb/AIGuide/tree/main/skills>**
- Skill 目录：**<https://github.com/Snailclimb/AIGuide/tree/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart>**

如果你在用 `npx skills` 生态，可以这样安装：

```bash
npx skills add Snailclimb/AIGuide/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart
```

如果只想安装给 Codex，也可以直接指定 agent：

```bash
npx -y skills add Snailclimb/AIGuide/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart --agent codex --yes
```

如果你主要在 Codex 里用，也可以从 GitHub 安装：

```bash
python3 ~/.codex/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo Snailclimb/AIGuide \
  --path skills/drawio-chart
```

这里要注意一下，`skills@1.5.15` 这类版本里，`npx skills add Snailclimb/AIGuide --path skills/drawio-chart` 可能仍会先扫描到仓库里的全部 Skill。更稳的写法是把 `skills/drawio-chart` 直接写进 source，也就是上面的 `Snailclimb/AIGuide/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/drawio-chart`。

安装时会看到它识别仓库来源、找到 `drawio-chart`，再让你选择安装到哪个 agent 和作用范围。

![使用 Skills CLI 安装 drawio-chart](https://oss.javaguide.cn/github/javaguide/ai/coding/skills-cli-install-drawio-chart.png)

Codex 有时不会立刻重新扫描新装的 Skill，我一般会重启一下再用。

刚开始别让 Agent 猜。直接点名 `$drawio-chart`，它更容易进到正确的工作流里。比如画一个登录流程图，我会这么写：

```text
使用 $drawio-chart 画一个用户登录流程图，包含：
输入账号密码 -> 验证账号密码 -> 成功跳转首页 -> 失败提示错误并允许重试。
要求导出 PNG。
```

给整篇文章配图时，我通常不会先规定“必须画几张”。更顺的做法是把文章路径交给它，让它先从文章里挑真正值得画的结构，再把格式要求补上：

```text
使用 $drawio-chart 读取这篇文章，为文章生成几张合适的技术配图。
所有配图放到同一个 draw.io 文件里，每张子图作为一个 diagram page。
主文件名和文章文件名保持一致，页面名用英文小写中横线。
配图风格遵循 drawio-chart 的统一规范。
```

这里不要只丢一句“帮我画个架构图”。微服务架构图至少要说清楚有哪些服务、哪些存储、哪些外部依赖，请求从哪里进来，哪些调用是同步的，哪些链路走异步消息。

你给它的是一段明确的图表需求，它产出的才更接近可用稿。只给一个很虚的标题，后面大概率还是要人手动返工。

## 哪些图适合 draw.io？

我现在主要把三类图交给 `drawio-chart`。

一类是文章里的流程图。比如 Spec Coding、CLAUDE.md 维护策略、Agent 协作流水线，这些图都有清晰的步骤和分支，draw.io 很适合后续微调。

一类是架构图和模块关系图。这里最烦的是风格不统一：同一篇文章里，服务节点一个颜色，存储节点一个颜色，外部依赖再单独区分，读者看起来会轻松很多。

还有一类是会反复改的图。文章上线后，标题、节点名、箭头方向、导出尺寸都可能调整。只要 `.drawio` 还在，改起来就不算麻烦。

我不太会拿它做封面图、海报、产品氛围图，这些交给 GPT-IMG2 更合适。想要白板手绘风，Excalidraw 那套更贴近；想要带主题切换、自包含 HTML 和网页交互，Archify 也值得看看。


---

---

<!-- source: 实践/mattpocockskills-我最推荐的 4 个 AI 编程 Skill.md -->

## [16] mattpocock/skills：我最推荐的 4 个 AI 编程 Skill

---
title: mattpocock/skills：我最推荐的 4 个 AI 编程 Skill
description: 深入介绍 mattpocock/skills 中的 grilling、research、diagnosing-bugs 和 code-review，结合真实项目案例说明它们适合解决哪些 AI 编程失败点，以及如何按需安装和使用。
category: AI 编程实战
tag:
  - AI 编程
  - Skills
  - Codex
  - Claude Code
head:
  - - meta
    - name: keywords
      content: AI编程,Agent Skills,mattpocock skills,grilling,research,diagnosing-bugs,code-review,Codex,Claude Code,AI辅助开发,代码审查,需求澄清,Bug诊断
---

你好，我是小 G。

我在 [AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html) 和 [强模型时代，AI 编程 Skills 还有必要装吗？](https://javaguide.cn/AI编程/实践/skill-selection-and-pruning.html) 这两篇文章中，都提到了 [mattpocock/skills](https://github.com/mattpocock/skills)，`grilling` 还专门拿了实际项目举例。

有不少读者朋友对 `grilling` 感兴趣。不过，回头看，这两篇都写得太简略了。文章只留下“让 Agent 持续追问”这个印象，一次只问一个问题、哪些信息该让 Agent 自己查、什么时候才能开始执行，都没有展开。

所以我重新读了一遍仓库里的 `SKILL.md`。`mattpocock/skills` 把常见工程问题拆成了较小、方便修改、可以组合的 Skill：需求含糊就补需求澄清，Bug 难查就补诊断流程，准备交付再补代码审查。

这种拆法很合我的使用习惯。Codex、Claude Code 已经能稳定完成的基础动作，无须每次重教；哪个环节经常返工，就给哪个环节加一小段流程。

群里讨论时，大家提到的也是类似问题：完整套件容易让小任务背上过重的流程，`grilling` 虽然会连续追问，但需求确实能收得更清楚。

![群友讨论 Superpowers 流程过重以及 Grilling 减少返工](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/group-chat-superpowers-grilling-feedback.png)

除了 `grilling` 之外，`research`、`diagnosing-bugs` 和 `code-review` 这三个也非常不错，这篇文章都会分享。

## `grilling` 不只是让 Agent 多问几句

我在前两篇文章里，其实也把 `grilling` 写简单了：让 Agent 别急着写代码，先多问几个问题。普通 Prompt 加上这句话也能做到。

当前版本的 [`grilling`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/productivity/grilling/SKILL.md) 很短，里面把访谈怎么往下走规定得很细。

![grilling Skill 的完整访谈规则](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/grilling-skill-content.png)

它会沿着决策树往下问，一次只处理一个决定。前面的答案可能改变后面的分支，所以不能一口气扔出十几个问题，让用户像填问卷一样回答。

它还把事实和决定分开。项目用了什么框架、现有接口怎么设计、数据库里有没有某个字段，Agent 应该自己读代码和文档。首期做哪个方案、要不要兼容旧行为、愿意承担多少复杂度，则交给用户。

双方没有确认已经达成共同理解之前，Agent 也不能照着自己的判断开工。

## `grilling`、`grill-me` 和 `grill-with-docs` 有什么区别？

`grilling` 是可复用的底层访谈 Skill，模型可以主动调用，用户也可以直接调用，其他 Skill 同样能复用。`/grill-me` 是更明确的人工入口，本身只负责启动一次 `/grilling` 会话。

讨论会产生长期使用的领域术语或架构决定时，可以换成 [`/grill-with-docs`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/engineering/grill-with-docs/SKILL.md)。它还会调用 `domain-modeling`：术语确定后写入 `CONTEXT.md`，少量难以撤销、以后看起来可能奇怪的决定再记录为 ADR。

![grill-with-docs Skill 的调用关系](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/grill-with-docs-skill-content.png)

![domain-modeling Skill 的领域建模规则](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/domain-modeling-skill-content.png)

三者的关系可以理解为：

```text
grill-me ──────────> grilling
grill-with-docs ───> grilling + domain-modeling
```

访谈规则集中在 `grilling` 里，其他 Skill 直接复用。

[v1.1.0](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/releases/tag/v1.1.0) 又把确认步骤改成显式停止条件，并区分环境事实和用户决定。旧规则可能让组合调用它的 Agent 顺手替用户做产品决定，现在这类决定必须逐个问人。

## 我用 grilling 确认了一次知识库面试需求

这次真实使用来自我的开源项目 [SpringAI 智能面试平台](https://javaguide.cn/专栏/interview-guide.html)。

当时我准备把模拟面试和知识库打通，直接选择了 `grilling`，给出的任务只有一句：帮我把这件事想清楚。

现有实现其实已经打通了一部分：普通模拟面试和知识库面试都使用 `InterviewSession`，作答、异步评估和部分前端页面也已经复用。此时继续设计底层，可能改掉本来可以保留的代码，首期产品范围反而还没确定。

![使用 Grilling 确认模拟面试与知识库的打通方案](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/grilling-springai-interview-platform-case.png)

`grilling` 问的第一个决定，是知识库在面试里扮演什么角色。

一种方案是完全根据用户资料生成定向面试；另一种是照常选择 Java、系统设计等 Skill，知识库只补充上下文。我选了前者，现有的题库生成、分类、难度、固定追问和评分规则都能继续使用。后一种还会引出两类题目的混合比例、实时 RAG、题目去重、来源冲突和评估依据。

这个决定确认后，它才进入下一个分支：一场面试绑定一个知识库，还是允许组合多个知识库？

请求参数、会话字段和题库筛选都围绕单个 `knowledgeBaseId` 设计。多知识库还要处理召回结果合并、权重、重复内容和权限校验。首期因此限制为单库，没有提前改关联表和接口结构。

第三个决定是入口。知识库面试已经有独立页面，普通模拟面试则从“模拟面试中心”进入。最后保留两个入口，但底层继续复用 `InterviewSession`，配置组件和创建接口也尽量共用，避免以后维护两套相似逻辑。

代码还没有开始改，首期范围已经收成三个选择：纯知识库面试、单个 `knowledgeBaseId`、双入口共用会话与创建能力。

`grilling` 没有替我写产品方案。它给出推荐答案和代码依据，取舍仍然由我确认。第一个答案如果换成“通用 Skill + 知识库上下文”，后面要问的也不会是单库还是多库，而会转向两类题目的混合与评估方式。

现在的模型写代码已经够快了。需求范围没定时，Agent 也能很快交出代码、测试和文档。方向偏了，这些产物都要跟着返工。

当然，不是每个任务都要先接受一轮“拷问”。改一处文案、补一个明确的空值判断、按现成模式增加字段，验收标准已经写得很具体，直接做通常更省时间。`grilling` 也替代不了测试和代码审查，它只负责把动手前还没定下来的问题暴露出来。

当前的 `grilling` 也没有问题数量上限，复杂需求可能聊得很久。如果担心访谈拉得太长，可以给它设置每轮 3～5 个问题的预算。一轮结束后先整理已经确认和仍未确认的决定，再由用户选择是否继续。

不要只写“最多问 5 个问题”。额度用完后，Agent 仍然不能自行补齐剩余决定或直接开工。

## `research`：把查资料这条支线交出去

给项目升级某个 SDK 时，当前版本支持哪些参数、旧接口何时弃用、流式事件怎么变化，不该靠用户凭记忆回答，也不适合让主 Agent 一边改代码一边翻长文档。

[`research`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/engineering/research/SKILL.md) 会把问题交给后台 Agent，只查官方文档、源码、规范和第一方 API。结论写进仓库里的一个 Markdown 文件并标明来源，主 Agent 可以继续处理其他工作。

![research Skill 的资料检索和结果保存规则](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/research-skill-content.png)

我看中的是它把资料来源和交付物钉死了：不拿二手教程替代官方资料，也不把几十页搜索过程塞回主会话，只留下可复查的结论。

使用它有两个前提：Agent 支持后台或 Subagent 调查，项目也接受多一个研究文档。只查一个方法签名时，直接打开官方文档更快；涉及版本迁移、协议差异或陌生依赖，再把这条支线交出去。

## `diagnosing-bugs`：先做出一个会变红的反馈环

Agent 排查 Bug 时很容易过早形成判断。看到一个可疑分支，马上改代码，再跑一遍测试；没修好，就继续换下一个猜测。改动越来越多，最初的故障现象反而没有被稳定复现。

[`diagnosing-bugs`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/engineering/diagnosing-bugs/SKILL.md) 把最多精力放在第一阶段：先做出一个能准确捕获当前 Bug 的反馈环。

![diagnosing-bugs Skill 的 Bug 诊断流程](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/diagnosing-bugs-skill-content.png)

反馈环可以是一条失败测试、一段 `curl`、带固定输入的 CLI、Playwright 脚本或线上请求回放。它要能捕获原故障，运行稳定、足够快，并且 Agent 可以独立执行。

确实无法复现时，它会列出尝试过的办法，再向用户申请可复现环境、HAR、日志、`core dump` 或临时生产插桩权限。

反馈环准备好后，再重复复现并缩小输入。接着列出 3～5 个可以证伪的假设，说明“如果它是原因，改变什么之后现象会如何变化”，再根据预测增加断点或定向日志。

修复阶段会把最小复现转成回归测试，在正确的模块接口处看它先失败，再应用修复。结束前重跑原始场景，清掉带唯一前缀的临时日志和调试程序，并把最终根因写进提交或 PR。

这套流程适合难复现的 Bug、性能退化和已经猜错几轮的问题。编译错误、明显的字段拼写错误，没必要先建一套诊断流程。项目没有合适的测试接缝时，最小复现也无法变成可靠测试。这个 Skill 会记录下架构问题，不会硬写一个和真实调用方式不一致的单元测试。

## `code-review`：代码规范和需求实现分开审

代码审查经常只看实现质量：命名是否清楚、有没有重复逻辑、异常处理是否合理、测试够不够。代码本身可能挑不出大问题，却实现错了需求。

[`code-review`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/engineering/code-review/SKILL.md) 把审查分为 `Standards` 和 `Spec` 两条线。

![code-review Skill 的双轴代码审查流程](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/code-review-skill-content.png)

`Standards` 会读取仓库自己的 `CONTRIBUTING.md` 和编码规范，再检查变更是否遵守约定。当前版本还内置了一组 `Fowler Code Smells`。仓库明文规则优先，Smell 只能作为判断线索，不能直接算违规。

`Spec` 则回到最初的 Issue、PRD 或技术方案，检查交付内容是否真的覆盖了原需求。两条审查由并行 Subagent 分别完成，最后再合并结果，避免负责代码风格的上下文影响需求检查。

审查前还要固定 `commit`、分支、`tag` 或 `main` 作为比较基点。Skill 基于 `merge base` 查看 `HEAD` 以来的 `diff`，不会把整个仓库泛泛看一遍。

项目没有 PRD、Issue 或验收标准时，`Spec` 这条线只能跳过；仓库没有编码约定，`Standards` 更多依赖通用 Code Smells。并行审查还要求宿主 Agent 支持 Subagent。CI、静态检查和人工领域审查仍然要保留。

## 怎么安装

这个仓库可以通过 `skills.sh` 的安装器接入 Codex、Claude Code 等支持 Agent Skills 的工具：

```bash
npx skills@latest add mattpocock/skills
```

安装器会让你选择具体 Skill 和目标 Agent。只想体验需求访谈，可以先选 `grill-me` 和 `grilling`。需要在讨论过程中维护 `CONTEXT.md` 和 ADR，再选择 `grill-with-docs` 与 `domain-modeling`。

按照项目当前说明，使用工程链路前还要在目标仓库运行一次 `/setup-matt-pocock-skills`，确认 GitHub、Linear 或本地任务管理方式，并确定 `Triage` 标签和 Agent 文档目录。

也可以直接让 Coding Agent 帮你安装，这里以 Codex 为例：

```text
请帮我从 mattpocock/skills 仓库安装 4 个 Agent Skill：grilling、research、diagnosing-bugs、code-review。
```

![Codex 使用 skill-installer 安装 mattpocock skills](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/codex-install-mattpocock-skills.png)

安装完成后，通常要到下一轮对话才会出现在可用 Skill 列表里。

`tdd`、`to-spec` 和 `to-tickets` 没有单列。TDD、规格说明和任务拆分已经是常见工程方法，不少 Agent 也能完成基础版本。项目采用“讨论 → Spec → Tickets → 实现 → 审查”的整条链路时，再组合它们。

这篇文章挑的 4 个，对应的是我现在更在意的几个失败点：开工前方向没定，资料来源不可靠，Bug 没复现就开始猜，代码写完却没有对照原始需求。

第一次安装不用全局启用。先限定在一个仓库，拿两三个真实任务观察返工次数、执行时间和产物质量。模型没有 Skill 也能稳定完成，就删掉；同一个问题反复出现，再留下那一小段流程。

第三方 Skill 是交给 Agent 的指令。安装前读一遍 `SKILL.md`，再检查 `scripts/`、`references/` 和权限要求。列表短一点没关系，知道每个 Skill 为什么还在，使用时反而更省心。


---

---

<!-- source: 实践/oh-my-pi 开源终端 AI 编码代理体验.md -->

## [17] oh-my-pi 开源终端 AI 编码代理体验

---
title: oh-my-pi 开源终端 AI 编码代理体验
description: 介绍 oh-my-pi 的核心能力，包括 Hashline 补丁机制、LSP 与 DAP 集成、内置工具、多模型路由、安装配置和使用建议。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: oh-my-pi,omp,AI编程,终端AI编码代理,Claude Code替代,OpenCode,Codex CLI,Hashline,LSP,DAP,多模型路由
---

和阿里的朋友确认了一下，从 7 月 10 日起，阿里会把 Claude Code 列入高风险软件名单，并推荐内部员工使用 Qoder 作为替代。

这事就不展开讨论了。

虽然 A 社经常不干人事，但 Claude 模型和 Claude Code 确实做的好。和同类产品相比，依然是最稳的那一个。毕竟是商业化项目，团队都是大牛，产品发布节奏非常快。

同类型项目，知名一点的有 OpenCode、Codex CLI、Cline、Trae、Qoder，之前 DeepSeek TUI 后来还改名成了 CodeWhale。

前两天群里有朋友丢了一个 **oh-my-pi** 的 GitHub 链接，说最近用着还挺舒服。

我一开始也没太当回事，内心 OS：**又一个终端 Agent？它和 Claude Code、OpenCode、Codex CLI 的区别在哪？**

用了几天之后，我的态度转变了。

## 它是什么

oh-my-pi 是一个开源的终端 AI 编码代理。

安装成功之后，你在项目目录里执行 `omp` 命令，然后就可以让它读代码、改代码、跑命令、解释报错、生成提交说明。

这和 Claude Code、Codex CLI 这些工具都差不多。

差异主要在 **工具层**。

LSP、DAP、Hashline、browser、GitHub、子 Agent、多模型路由这些东西，它都塞进了终端里。

比如重命名函数时，它可以用语言服务器查引用，少靠 `grep` 硬猜；调一个崩溃时，它可以进调试器看栈帧和变量；看 PR 时，也可以把 PR 当成一种可读取的资源。

还有个很主观的小点，它的终端 UI 我还挺喜欢，很符合我的品味。

这个不算核心能力，但天天盯着终端干活的人应该懂，界面顺眼真的会影响心情。

## Hashline

很多 Agent 改文件，实际还是 `old_string -> new_string`。

先读一段文件，再让模型把原文复述出来，然后工具拿这段原文去匹配替换。

这个方案的问题，大家应该都遇到过。

少一个空格，多一个换行，缩进差一点，补丁就找不到位置。更麻烦的是，你刚手动改过文件，模型还拿旧上下文去改，新旧内容一混，现场直接乱掉。

oh-my-pi 的 `edit` 工具里有个东西，叫 **Hashline**。

`@oh-my-pi/hashline` 把它描述成一种 compact、line-anchored patch language。大概意思是，读文件的时候，每一行会带一个内容 hash；模型改文件时围绕 hash 做修改，少复述整段原文。

![oh-my-pi Hashline 官方说明截图](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-hashline-doc.png)

如果文件中途变了，hash 对不上，补丁会先被拒掉。

这不只是为了把 patch 写短，更重要的是多了一层稳定定位和校验。模型不可能永远把原文背得一字不差，所以工具层先加一道保险。

官方 benchmark 里提到，Grok 4 Fast 在同类任务中输出 token 少了 61%。这个数字我没有复现实验，所以这里只当成项目方口径，看趋势就行。

相比省 token，我更在意坏补丁能不能早点被挡下来。真在项目里用，少一次乱改，比少几百个 token 更重要。

## 最像 IDE 的地方

oh-my-pi 最像 IDE 的地方，在于它把 LSP 和 DAP 这两套 IDE 常用能力直接接进了 Agent 工具面。

官方将其拆分成两类：

- `lsp` 负责 diagnostics、navigation、symbols、renames、code actions、raw requests；
- `debug` 负责 DAP 会话里的 breakpoints、stepping、threads、stack、variables。

这两个词听着偏底层，放到日常编码里其实很好理解。

**LSP 负责回答代码结构是什么。** 比如一个函数在哪里定义、被哪些地方引用、当前文件有哪些诊断、某个重命名会牵动哪些导入和 re-export。

以前 Agent 想改函数名，很多时候只能先 `grep`，再让模型判断这些命中是不是同一个符号。这个过程很容易混进注释、字符串、同名变量，尤其是 TypeScript 这种项目里，barrel export、路径别名、重导出一多，纯文本搜索就开始不够用了。

如果它能走 LSP 的 rename、references、diagnostics，至少拿到的是语言服务器眼里的代码关系。模型还是会判断错，但它不再完全站在文本外面猜。

这点对我挺重要。

让 Agent 写代码，我最担心它一本正经地猜调用关系，猜错了还继续往下写。LSP 至少给它一张更接近 IDE 的地图。

**DAP 负责另一件事：运行时。**

以前让 Agent 调试，它很容易走到一个套路：加日志，运行，看输出，再加日志。这个办法当然有用，但遇到 native 崩溃、Go 服务 hang 住、Python 进程卡住这种问题，只靠日志很慢。

有了 DAP，它至少可以打断点、单步执行、看线程、看调用栈、读变量。这里拿到的是运行时状态，不只是文本匹配结果。

当然，这不代表它就一定能把 bug 修好。只是它调试时看的东西，开始接近一个真人开发者会看的东西：先看停在哪，再看变量怎么变，最后再决定补丁怎么写。

所以我更愿意把这一块理解成“终端里的 IDE 能力”。它和后面的工具数量不是同一个维度。

后面那些 `eval`、`task`、`browser`、`github` 更像是 Agent 工作台；LSP 和 DAP 才是它最像 IDE 的核心。

## 工具非常丰富

多数 Agent 的内置工具都比较克制：读文件、搜文本、改文件、跑命令。再重一点的活儿，通常交给 MCP server。

omp 走的是另一条路。一共 32 个内置工具，看起来有点重，但也确实有几个工具挺有代表性。

先说 `eval`。它内置常驻 Python 和 Bun JS 内核，不是跑完就扔的一次性沙箱。更关键的是，这两个内核还能反过来调用 omp 自己的工具，比如 `read`、`search`、`task`。Agent 可以在 Python cell 里读 CSV，再切到 JavaScript cell 里处理数据，过程中不用离开会话。

当前的多 Agent 协调工具是 `task`、`hub`、`todo` 和 `ask`，不是旧资料里的 `task` / `irc`。`task` 负责 fan-out 子 Agent，每个 worker 可以使用自己的工具面，也可以隔离到单独 worktree；`hub` 用于 live Agent 的协作与消息，`todo` 管任务状态，`ask` 用于发起结构化询问。具体字段变化较快，以当前工具描述为准。

`browser` 基于 Puppeteer，也提供 stealth 相关处理，并能通过 CDP 驱动 Electron 应用。Stealth 只能减少部分常见自动化特征，不能保证网站把它识别为普通用户，更不能绕过网站条款、登录限制或反自动化策略。

`github` 是我更喜欢的一块。它没有让模型再学一堆 `gh_issue_view`、`gh_pr_view`、`gh_search`，而是把 PR 当文件系统路径读。`read pr://1428` 拿到的结构，和 `read src/foo.ts` 是同一个思路；`search` 也能像遍历目录一样遍历 diff。这个抽象还延伸出了 `pr://`、`issue://`、`agent://`、`skill://`、`rule://`、`conflict://` 等内部 scheme。

我顺手拿 JavaGuide 的一个 issue 试了下。它先读 issue，再去仓库里找对应 Markdown，接着顺着图片链接继续读。

![oh-my-pi 读取 GitHub issue 并追踪仓库文件](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-github-issue-read.png)

还有个 `advisor`，可以挂一个 reviewer 模型。它每轮都看主 Agent 的输出，然后把提醒 inline 注入回来。它跑自己的上下文和自己的模型，专门挑主 Agent 漏掉的东西。这个设计有点像旁边坐了个只负责挑刺的人。

这些工具单独看不一定都新鲜，放在同一个工具面里就有点不一样了。读本地文件、读 PR、读子 Agent 结果，都尽量收敛到“读取资源”这个动作上，模型少学一堆奇怪接口。

但工具多也有另一面：路由层会更复杂，误调用工具的机会也会变多。所以我不建议第一次就全配上。

多模型、多工具、多记忆，听起来很爽，但配置、成本和权限都会跟着上来。尤其是 `bash`、`write`、`edit`、`browser`、`github`、`ssh` 这种工具，开之前最好想清楚它能碰到什么。

部分工具默认关闭，清单会随版本变化，建议直接查看当前 `/tools` 或帮助信息，不在文章里维护静态名单。

真要收窄工具面，可以用 `--tools read,edit,bash,...` 只暴露一部分。当前隐藏能力通过 `xd://` 资源发现机制按需暴露，不再使用旧资料里的 `search_tool_bm25`。

这个默认策略是对的。终端 Agent 最麻烦的地方往往不在能力少，而在权限给太多之后，自己也记不清它能碰哪里。

## 多模型提供商与角色路由

模型列表我一开始没想到会这么满。

不仅仅是 OpenAI、Anthropic、Gemini 这三家国外比较火的，像 Cursor、Copilot、Kimi Code、Moonshot、通义、Qwen Portal、GLM、小米 MiMo、Qianfan 这类编码订阅也能看到；本地模型这边，Ollama、LM Studio、llama.cpp、vLLM、LiteLLM 等等也有。

另外，它还支持 5 个角色路由，`default`、`smol`、`slow`、`plan`、`commit`。

我会把 `default` 当主力模型，平时读代码、改代码、问问题都先走它。`smol` 更适合丢给子 Agent 做批量查文件、扫信息这种小活儿，便宜一点、快一点就行，不指望它做复杂判断。

真遇到架构判断、难 bug、长上下文推理，再让 `slow` 上更强也更贵的模型。`plan` 用来先想清楚改哪几个文件、步骤怎么拆，`commit` 则留给 changelog、提交说明这种固定格式的文字活儿。

![oh-my-pi 在模型面板里把同一个模型设置为不同角色](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-model-role-actions.png)

这样日常对话、子 Agent、深度推理、规划和提交说明就不用挤在一个模型上。它更像成本和质量分流，不会让模型本身凭空变强。主会话里按 `Ctrl+P` 就能轮着切，也可以用 `/model` 手动换。

我不会一上来就把这些都配满。先让 `default` 跑稳，再考虑 `smol` 和 `slow`。fallback chain、按路径 scope 模型、多 key 轮询这些东西看着很香，但第一天就全开，出问题时很难判断是哪一层在抽风。

## 怎么上手

安装就是一行命令的事，很简单。

macOS / Linux：

```sh
curl -fsSL https://omp.sh/install | sh
```

Homebrew：

```sh
brew install can1357/tap/omp
```

Bun：

```sh
bun install -g @oh-my-pi/pi-coding-agent
```

Windows PowerShell：

```powershell
irm https://omp.sh/install.ps1 | iex
```

项目要求 `bun >= 1.3.14`，仓库根目录的 `package.json` 也写着 `packageManager: bun@1.3.14`。如果你用 Bun 安装，先看一下版本，别卡在环境上。

装好之后，找一个不那么重要的项目试就行。

```sh
cd your-project
omp
```

第一次进去不会马上开始聊天，它会先让你做一个 setup。

先选要登录的 provider。这里可以连多个，比如 ChatGPT Plus/Pro、Anthropic、Z.AI、Kimi Code、OpenRouter、Copilot、Cursor 这些都会列出来。你已经配过环境变量的 provider，也会直接显示 logged in。

![oh-my-pi 第一次启动选择模型 provider](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-setup-provider-login-kimi.png)

![Kimi Code 会员权益页面](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-kimi-code-home.png)

然后切到 Web search，选择 `web_search` 工具优先使用哪个搜索后端。当前项目已扩展到约 25 个后端，静态列出名称很快会过期；选 `Auto` 时会从已经配置好的后端中选择，手动模式以当前 Setup 页面为准。

![oh-my-pi 第一次启动选择 Web search provider](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-setup-web-search.png)

这一步不用纠结太久。先把一个主模型和一个搜索 provider 跑通，比一上来把所有账号都接进去更稳。

配置完回到主界面后，我这里模型已经直接选好了，左侧显示的是 `DeepSeek V4 Flash`。

![oh-my-pi 启动后自动选中默认模型](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-welcome-default-model.png)

我一开始还愣了一下：我刚才好像没手动选 DeepSeek，为什么它自己配好了？

于是顺手问了它。它的解释大概是：oh-my-pi 内置了一份模型目录，启动时会按顺序找可用凭据，比如命令行参数、`models.yml`、之前 `/login` 保存的 key / OAuth、环境变量和几个 `.env` 文件。只要它发现 `DEEPSEEK_API_KEY` 这类变量能匹配上，就会把对应 provider 下的模型标成可用，再自动挑一个初始模型。

![oh-my-pi 解释模型为什么会自动配置](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-model-auto-config-reason.png)

后面想换模型也不用重启，直接用 `/model`。它只会展示已经有可用凭据的模型，上面还能按 provider 切 tab。我这里能看到 DeepSeek、Z.AI、Ollama、LM Studio、llama.cpp 这些入口。

![oh-my-pi 使用 model 命令切换模型](https://oss.javaguide.cn/github/javaguide/ai/coding/oh-my-pi 开源终端 AI 编码代理体验/oh-my-pi-model-switch.png)

如果要看当前版本有哪些命令和参数，直接跑：

```sh
omp --help
```

如果你之前用过 Claude Code、Codex CLI、Cursor、Windsurf、Gemini、Cline 这些工具，它还会去读磁盘上已有的 rules、skills 和 MCP servers。像 `.claude`、`.cursor`、`.windsurf`、`.gemini`、`.codex`、`.cline`、`.github/copilot`、`.vscode` 这些目录，都在它会看的范围里。

## 总结

oh-my-pi 的特点主要集中在工具层：Hashline 用于提高补丁定位的稳定性，LSP 和 DAP 提供代码结构和运行时状态，`github`、`browser`、`task`、`eval` 等工具把不同资源接入同一会话。

工具多也意味着权限面更大。`github`、`browser`、`memory`、`ssh` 等能力建议按任务逐项启用；涉及账户、私信、仓库写操作和远程主机时，先确认权限范围、审计记录和服务条款。

对于已经习惯终端工作流、愿意折腾模型、工具和权限的人，可以拿一个个人项目玩一下。只想要一个少配置、打开就能用的稳定工具，那 Claude Code 还是更省心。

oh-my-pi 现在最吸引我的地方，是它把开源 Agent 的工具层往前推了一步。东西多，野心大，亮点也很明确，但信任得一点点试出来。

项目地址：[https://github.com/can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)

官网：[https://omp.sh](https://omp.sh)


---

---

<!-- source: 实践/Spec Coding 规范驱动编程实战-从 Vibe Coding 到 AI 代码规范.md -->

## [18] Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范

---
title: Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范
description: 系统梳理 Spec Coding 规范驱动编程的核心思路与落地流程，涵盖 Vibe Coding 与 Spec Coding 的区别、四步落地方法、AI IDE 规范文件配置、三色标签权限控制、Spec 分层管理和多代理协作避坑经验。
category: AI 编程技巧
head:
  - - meta
    - name: keywords
      content: Spec Coding,Vibe Coding,规范驱动编程,AI代码规范,AI编程,Cursor,Claude Code,Copilot,多代理协作,AI辅助开发
---

你好，我是小 G。拖了蛮久，来填坑了。

Spec Coding 很早之前就有群友提到说建议写一下。确实还蛮重要的，工作中能用到，面试也开始问了。

![spec coding 被读者催写](https://oss.javaguide.cn/github/javaguide/计算机基础/计算机网络/readers-urging-spec-coding-to-be-written.png)

上周和同事聊到 Spec Coding，他问：“Claude Code 都能自己写代码了，为什么还要花时间写规范？”

这个问题很实际。AI 写代码确实快，Demo、脚本、一次性页面可以用较轻的约束快速验证。

但把同样的玩法搬到多人协作、长期维护的项目里，缺失信息就会变成风险：需求没写清的部分由模型补全，边界条件按常见模式推断，团队自己的错误码和权限约定也可能没有进入上下文。输出是基于模型学到的模式和当前上下文生成的，不是对项目真实约束的自动发现。

这篇文章主要说明三个问题：

1. Vibe Coding 和 Spec Coding 的实际差别，以及什么时候该用哪个
2. 完整的 Spec Coding 落地流程，从写需求到让 AI 按规矩执行
3. Spec 在主流 AI IDE（Cursor、Claude Code、Copilot 等）里怎么配、怎么管、怎么防止 AI 越界

## Vibe Coding 不是不能用

Vibe Coding（氛围编程），凭感觉走。给 AI 一句模糊的意图，它就直接开始输出代码。

Karpathy 最早提这个词时，说的也是那种把需求丢给 AI、顺着感觉不断调整、甚至暂时不太管代码细节的写法。

Vibe Coding 不是原罪。下面这些场景，用它反而很合适：

- 验证一个想法，先写个 Demo 看看效果
- 写一次性脚本，跑完就扔
- 做内部小工具，影响面很小
- AI 写完后，有完整测试兜底，而且不直接暴露给外部用户

这些情况下，硬写一大堆 Spec 反而是浪费时间。

真正的问题是：很多人验证完想法之后，顺手就把 Vibe 出来的代码推上了生产。

这就不一样了。

Demo 阶段你可以靠感觉走，因为错了就改，坏了就删。生产代码不行，它后面会接数据库、接支付、接用户数据、接别人的维护成本。你今天省下来的半小时，可能会变成后面几天的排查时间。

我的判断标准就一条： **这段代码要活多久？**

- **两天就扔掉**的脚本，Vibe 够了。写 Spec 反而拖效率。
- **3-5 天**这种中间地带，可以写轻量 Spec。不用展开完整设计，只写关键约束和验收标准，半小时差不多能搞定。
- **超过一周**的代码，只要需要别人维护、涉及数据持久化、接入外部接口，就别裸 Vibe。至少要把约束、边界和验收标准写清楚。

而且，很多时候搭配轻量级 Spec 也没问题，不需要太死板。

轻量 Spec 可以简单到这种程度：

```markdown
## 任务目标

实现一个订单导出接口，支持按时间范围导出 CSV。

## 关键约束

- 单次导出最多 5000 条
- 时间范围不能超过 31 天
- 必须校验用户权限，只能导出当前租户的数据
- 查询必须命中 order_tenant_time_idx 联合索引
- 导出失败要记录失败原因，不能只返回 unknown error

## 验收标准

- 正常导出 CSV，字段顺序符合产品约定
- 超过 5000 条时返回明确错误
- 越权租户数据不能被导出
- 单元测试覆盖空时间、越界时间、无权限、无数据四种场景
```

## Spec Coding 到底是什么

Spec Coding，直译过来叫规范驱动编程。简单来说就是：先把规范写清楚，再让 AI 干活。

平时让 AI 写代码，很多人会直接丢一句：

> 帮我做一个用户系统。

AI 当然能写，而且看起来还挺像那么回事。但问题也在这里：你没告诉它用户系统到底长什么样，它就只能自己猜。

用户怎么注册？邮箱能不能重复？密码怎么存？接口失败时返回什么格式？哪些功能这期不做？管理员有没有禁用用户的能力？这些东西如果一开始没写清楚，AI 不会停下来反问你，它大概率会先补一套自己觉得合理的方案。

Spec Coding 做的事情，就是把这些规则提前写下来。

这里的 Spec 不是随便写两句需求，而是一份 AI 能照着执行的技术约定。接口、数据结构、错误码、边界条件、安全要求、技术栈限制，甚至哪些操作不允许碰，都要写在里面。

它和 Vibe Coding 的差别，也就在这。

Vibe Coding 更像是你给 AI 一个大方向，然后让它自由发挥。代码生成出来以后，你再去验收、改 bug、补细节。短平快的小脚本这么干没啥问题，甚至很爽。

但项目稍微复杂一点，就容易出事。等你发现 AI 理解错了，代码已经写了一堆。你回头查，也很难说清楚到底是需求没讲明白，还是 AI 自己乱发挥。

简单总结下 Spec Coding 和 Vibe Coding 的差别：**AI 的行为是由你定义的，还是由它猜的？**

## 一种四步落地方式

本文采用 GitHub [Spec Kit](https://github.github.com/spec-kit/index.html) 示例中的 Specify、Plan、Tasks、Implement 四步来说明。它是一种可操作的工作流，不是所有 Spec Coding 工具统一遵循的标准；有的团队会合并设计与任务阶段，有的工具还会增加澄清、验证或变更管理阶段。

| 阶段          | 干什么   | 产出              | 关键动作                         |
| ------------- | -------- | ----------------- | -------------------------------- |
| **Specify**   | 产品定义 | `requirements.md` | 明确功能、用户、痛点，定“做什么” |
| **Plan**      | 技术规划 | `design.md`       | 定技术栈、架构、契约，定“怎么做” |
| **Tasks**     | 任务拆解 | `tasks.md`        | 拆成原子任务，写验收标准         |
| **Implement** | AI 执行  | -                 | AI 按 Spec 干活，人验收          |

理解起来其实很简单，核心就是**先写清楚要做什么，再写清楚怎么做，然后拆任务，最后交给 AI 执行**。

![Spec Coding 规范驱动编程流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-pipeline-flow.png)

### Specify：先搞清楚做什么

第一步是 `Specify`，产出一般是 `requirements.md`，或者叫 `spec.md`。

这一步有点像写 PRD，但面向的使用者是 AI。

所以，它不能只写方向，得把边界也写出来。

比如你写一句：

> 做一个用户系统。

人看着没问题，AI 看了就开始猜了：用户怎么注册？邮箱能不能重复？密码有啥要求？第三方登录做不做？管理员能不能禁人？被禁了数据怎么办？

你不写，它就自己定。

更稳一点的写法是：

> 支持邮箱注册和登录；邮箱必须唯一；单因素密码至少 15 个字符；暂不支持第三方登录；管理员可以禁用用户；用户被禁用后不能登录，但历史数据保留。

这句话让 AI 知道哪些能做，哪些不能做，哪些边界不能碰。

### Plan：敲定技术方案

第二步是 `Plan`，一般会落到 `design.md` 或 `plan.md` 里。

这一步很多人会跳过，觉得反正 AI 会写代码，让它自己发挥就行。

然后问题就来了。

你没说用哪个 Java 版本，它可能给你写 Java 8 的代码；你没说 Spring Boot 版本，它可能按旧写法来；你没说错误码格式，它就每个接口返回一套；你没说分层方式，它可能 Controller 里直接写业务逻辑；你没说表字段怎么命名，它也会按自己的习惯来。

所以 `design.md` 不用写得特别重，但几个关键约束得先定下来。

比如先写成这样就够用：

```markdown
## 技术栈

- 语言: Java 21 (LTS)
- 框架: Spring Boot 3.2.x（现有旧项目快照；新项目按当时的支持矩阵选版本）
- 数据库: PostgreSQL 16
- 缓存: Redis 7.x

## 架构设计

- 分层: Controller → Service → Repository
- 通信: REST API + gRPC（内部服务）
- 部署: Docker + Kubernetes

## 接口约定

- API 规范: OpenAPI 3.0
- 错误码: 统一格式 {"code": "USER_NOT_FOUND", "message": "..."}
- 日志格式: JSON，必须包含 trace_id
```

你可能会想：这不就是设计文档吗？

确实有点像。

但区别在于，传统设计文档主要是给人看的。人看完知道大方向，剩下很多细节可以靠团队习惯补上。比如密码不能明文存、错误码要统一、日志里要带 trace_id，这些东西在成熟团队里通常不用反复强调。

AI 不一样。

你没写，它就猜。猜对了还好，猜错了就得你回来返工。

拿密码存储举个例子。你只写一句“登录要安全”，范围太宽，模型可能选择已经过期或不适合当前系统的方案。

新系统可以把规则写成下面这样，再根据服务器基准测试确定参数：

```text
密码使用 Argon2id 哈希存储，参数通过目标服务器基准测试确定，并记录算法版本以便后续迁移。
如果现有系统必须兼容 bcrypt，保留旧哈希校验，并在用户成功登录后逐步迁移到 Argon2id。
数据库只保存带盐哈希，不保存明文密码；使用经过维护的密码库生成随机盐。
单因素密码最少 15 个字符，最大长度至少支持 64 个字符，不强制大小写、数字或特殊字符组合。
注册和改密时检查泄露密码 Blocklist，登录接口设置速率限制。
```

这些要求来自 [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)和 [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)。安全参数仍要经过架构评审和实测，不能只把示例数字复制进 Spec。

错误处理也一样。别写“接口失败时返回友好提示”，这句话基本没约束力。AI 可能这个接口返回 `error`，那个接口返回 `message`，还有的地方直接抛异常。

直接写清楚：

```json
{
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "trace_id": "xxx"
}
```

再补一段状态码约定：

```text
参数错误返回 400。
未登录返回 401。
无权限返回 403。
资源不存在返回 404。
邮箱重复、用户名重复这类冲突返回 409。
```

这样 AI 至少知道该往哪个方向写。

说到底，`design.md` 主要是为了减少 AI 自己补设定。你把技术栈、接口格式、错误码、日志、并发、安全这些规则提前写好，后面让 AI 写代码时，它就不太容易跑偏。

### Tasks：任务要小到能验收

第三步是 `Tasks`，一般会写到 `tasks.md` 里。

这里不要一上来就让 AI “完成用户模块”。这个范围太大了。注册、登录、查询、禁用、权限、参数校验、异常处理、单元测试，全都塞在一个任务里，AI 很容易写着写着漏东西。最后你看代码时，还得一项一项往回补。

但也别拆得太碎。创建 UserDTO、添加 email 字段、写一个空的 Service 方法——这种任务看起来很细，实际会把人折腾死。你维护任务列表的时间，可能比让 AI 写代码还长。

我比较喜欢的粒度是：一个 Task 对应一个 API、一张表的核心操作，或者一个能独立验收的小功能。

比如用户注册接口，可以这么写：

```markdown
### Task-001: 用户注册接口

描述：实现用户注册，包含参数校验、密码哈希和用户入库。

验收标准：

- [ ] POST /api/v1/users 成功时返回 201
- [ ] 新密码使用经过基准测试的 Argon2id 参数哈希后存储
- [ ] 单因素密码至少 15 个字符，最大长度支持至少 64 个字符，并检查泄露密码 Blocklist
- [ ] 登录与注册相关接口有速率限制
- [ ] 邮箱唯一，重复注册返回 409
- [ ] 返回体必须包含 user_id、email、created_at
- [ ] 分支覆盖率达到项目约定基线（本示例为 80%），且关键安全分支均有断言

预估工时：2h
```

这里真正值钱的是验收标准。“保证安全”“代码优雅”“性能要好”——这种话写了跟没写差不多，AI 不知道你心里的安全到底指什么，优雅要优雅到什么程度。

但密码使用经过基准测试的 Argon2id 参数、重复邮箱返回 `409`、返回体包含 `user_id`、`email`、`created_at`，以及关键分支有测试——这些东西都能验证，不用靠感觉。

覆盖率阈值别机械套。团队应根据模块风险、历史缺陷和测试类型确定基线；比单个百分比更重要的是权限、金额、状态迁移、重试和异常补偿等关键分支有没有有效断言。

### Implement：让 AI 干活

提示词不用搞得很玄学，直接把相关 Spec 塞进去就行：

```text
请根据以下 Spec 实现 Task-001。

需求说明：
[粘贴 requirements.md 相关段落]

技术约束：
[粘贴 design.md 相关段落]

任务验收标准：
[粘贴 tasks.md 里的 Task-001]
```

这里有个坑：不要把所有 Spec 一股脑塞进上下文。

单次会话里，我会优先放三类内容：

- 全局约束，比如代码风格、错误码格式、日志规范；
- 当前任务的需求说明；
- 当前任务的验收标准。

其他内容按需补，不要为了“完整”把所有文档都贴进去。

单次应该放多少 Token，没有跨模型和跨任务通用的 3000–8000 阈值。更实用的做法是先放全局硬约束、当前任务和验收标准，再通过索引或文件路径按需读取证据；当无关材料开始干扰判断，或任务可以独立拆分时再拆会话。

别指望模型在一个特别长的上下文里什么都顾得上。上下文越长，关键信息越可能被淹在中间，最后反而漏掉最重要的约束。

我自己会遵守三条原则：

第一，约定写进文档，不要只写在聊天里。聊天记录下次很可能接不上，文档才是可以复用的上下文。

第二，验收标准能量化就量化。“高性能”没法验收，`QPS > 1000`、`P95 < 200 ms`、`branch coverage >= 80%` 才能验收。

第三，Spec 要进 Git，跟代码一起走。代码变了，Spec 也要改。不然后面继续让 AI 开发，它拿到的就是一份过期说明。

这一步走通后，AI 不会突然变聪明，但乱猜的空间会小很多。

接下来还有个很现实的问题：这些 Spec 到底放哪里，怎么让工具每次都读到？

## Spec 在 AI IDE 里怎么落地

写完 Spec 之后，有个问题经常被忽略：**这些文件到底放哪里？怎么让 AI 自动读到？**

主流工具都有自己的规范文件机制：

| 工具               | 规范文件位置                                                                             | 作用域          | 加载方式                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| **Cursor**         | `.cursor/rules/*.mdc`（当前）或 `.cursorrules`（Legacy）                                 | 项目级 / 全局   | Rules 可设 Always apply，也可按 glob 附加                                  |
| **Claude Code**    | `CLAUDE.md`、`.claude/rules/*.md`                                                        | 项目级 / 目录级 | 根规则常驻，子目录或带 `paths` 的规则按文件访问加载                        |
| **GitHub Copilot** | `.github/copilot-instructions.md`、`.github/instructions/*.instructions.md`、`AGENTS.md` | 仓库级 / 路径级 | 仓库级说明、路径级 Instructions 和 Agent 指令分别按当前客户端能力加载      |
| **Windsurf**       | `.windsurf/rules/*.md`、`AGENTS.md`（旧项目可能仍有 `.windsurfrules`）                   | 项目级 / 目录级 | Workspace Rules 与目录级 `AGENTS.md` 按作用域加载                          |
| **Aider**          | `CONVENTIONS.md`（仓库根目录）                                                           | 项目级          | 通过 `--read CONVENTIONS.md`，或在 `.aider.conf.yml` 里用 `read:` 自动加载 |

到这里，另一个问题也会冒出来：Cursor、Claude Code、Copilot 这些是日常写代码的入口，那 Superpowers、Spec-Kit、Open Spec、Kiro、BMAD-METHOD 这些专门围绕 Spec Coding 的工具，到底该怎么选？

这个问题展开会比较长，我准备放到下一篇单独聊。这里先把 Spec 怎么写、怎么放、怎么管住 AI 说清楚。

知道放哪之后，还有一个问题：**哪些 Spec 每次都注入，哪些按需带上？**

实际操作中，我一般分成两层。

**几乎每个会话都要带上的（必须注入）：**

- **技术栈**：版本和关键库写明，比如 Go 1.21 + Gin + GORM + PostgreSQL 14。别让 AI 自己猜版本号。
- **代码风格**：给出少量“金标准”文件路径或短代码片段，展示命名、错误处理和返回格式。不要把 150–200 行代码固定塞进 every-session 上下文。
- **边界条件**：用三色标签（后面会说）划清楚什么能做、什么要问、什么绝不能碰。

这些放工具的 always-on 规则文件里，每次会话自动注入。

**当前任务相关时才带的（按需注入）：**

- **项目愿景**：一两句话说清为啥做这个项目，比如“把用户服务从单体拆出来，用 Go 重写，API 兼容”。新任务开始时带一次就行。
- **命令清单**：列出 build、test、run 命令，比如 `make build`、`go test ./...`。有执行任务时带上。
- **目录结构**：树状图说清代码、测试、文档分别放哪。涉及新增文件时才需要。
- **Git 规范**：分支名、commit message、PR 要求。涉及 Git 操作时带上。

这么分看的是使用频率：全局约束几乎每次都要遵守，值得常驻。其他的按任务加，避免上下文里堆太多不相关的内容。Spec 塞越多，AI 反而越容易漏掉真正重要的那几条。

## 三色标签：AI 能干什么、不能干什么

AI 遇到拿不准的操作时，到底该自己决定还是停下来问你？

三种颜色，三种权限。

![三色标签：AI 决策权限的风险控制机制](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-three-color-labels.png)

- ✅ **Always（自动执行）**：代码检查、测试、格式化这些，AI 自己拍板就行。比如提交前自动跑 `make lint`。
- ⚠️ **Ask first（需确认）**：可能影响其他模块的变更，AI 出方案等你审。改数据库索引、改 API 路由这种就属于这类。
- 🚫 **Never（绝对禁止）**：直连生产库、提交密钥、删线上数据。AI 碰到就必须停，报错。

落地的时候有几件事容易忽略。

**刚开始宁严勿松。** Ask First 多放点，跑一周后看哪些操作 AI 每次都做对了，再放到 Always。

**规则必须写具体。** “重要变更需确认”这句话 AI 没法执行，它不知道什么算“重要”。得写成“修改已有 API 的 URL 路径需确认”。“小心操作数据库”也不行，要写“ALTER TABLE 操作需确认”。

**Never 规则不能只靠 AI 自觉。** 只在文档里写“禁止直连生产库”，并不能真的拦住它。AI 不会主动检查自己的输出是否违规。Never 规则需要多层防线：

1. **Spec 声明**：影响 AI 生成倾向，但拦不住
2. **配置模板**：`.env.example` 里不放真实密钥，AI 就没东西可复制
3. **Pre-commit hook**：正则扫密钥硬编码、生产环境连接串，提交时自动拦截
4. **AI IDE 配置**：用权限规则和沙箱限制读取范围；`.cursorignore` 可减少索引和上下文访问，但不是完整安全边界
5. **密钥隔离**：生产凭据不落在 Agent 可访问的工作区，使用短期、最小权限凭据

越重要的 Never 规则，越要推进到 CI 层做硬性检查。停在“文档里有写”这一步，迟早出事。

**每周回头看一次**。AI 是不是动不动就停下来问？那 Ask First 里有些操作可以放行了。AI 有没有偷偷干不该干的事？有就补 Never。项目里有没有冒出新的敏感操作？加进去。

## 项目大了，Spec 怎么管

小项目 Spec 少，手动往上下文里丢就行。模块多了之后全塞上下文就废了，AI 看着一堆和当前任务无关的约束，反而更容易跑偏。

按规模选策略。

![Spec 管理策略：分层过滤 + 精准召回](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-spec-management-strategy.png)

### 规则不多时：分文件存储

按领域拆就行：

```text
specs/
├── global/              # 全局约束
│   ├── conventions.md   # 代码规范
│   └── architecture.md  # 架构概览
├── backend/             # 后端规格
│   ├── api/
│   ├── service/
│   └── persistence/
├── frontend/            # 前端规格
└── shared/              # 共享契约
    └── dto.md
```

每次只把当前任务相关的两三个文件丢进去，别贪多。

### 人工选择开始吃力时：摘要索引

手动挑文件开始累了，就让 AI 先生成一份目录加关键词索引：

```markdown
## Spec 索引

- [数据库设计](specs/db/schema.md) - 关键词: PostgreSQL, 索引优化
- [用户 API](specs/backend/api/user.md) - 关键词: REST, JWT, 鉴权
- [订单服务](specs/backend/service/order.md) - 关键词: 事务, 幂等
```

需要细节时让 AI 主动来要，不用全量灌进去。

### 关键词索引频繁漏召回时：评估 RAG

模块数不能直接决定是否要上 RAG。先观察几个信号：同一概念分散在大量文档中、关键词检索经常漏掉同义表达、人工选择上下文已经影响交付，而且团队能够维护权限、索引更新和评测集。满足这些条件后，再评估全文检索、向量检索或两者混合。

Chunk 大小、Top-K 和相似度阈值都要根据 Embedding 模型、文档结构与任务评测调优。不同模型的相似度分布不同，`Top-K 3–5`、`> 0.7` 不能跨模型直接复用。上线前至少准备一组真实问题，评估召回率、误召回、延迟和成本，并确保权限过滤发生在结果进入模型之前。

### 不分规模都管用的一条：单会话单任务

```text
Session 1: 数据库设计
├── 输入: global/conventions.md + backend/db/
├── 输出: 完成实体设计
└── 关闭会话

Session 2: API 实现
├── 输入: Session 1 产出 + backend/api/
├── 输出: 完成 Controller
└── 关闭会话
```

上下文干净，AI 就不会被前面任务的边角料带跑。这条比什么花哨的检索策略都管用。

## 领域知识为什么这么重要

AI 训练数据再多，也不知道你项目里那些特定的规则，你得主动告诉它。

举个例子：你做了一个商城项目，其中有一个规则是优惠券和秒杀不能叠加。这个规则你不写进 Spec，AI 很可能就把两个折扣都算上了。代码能跑，测试也可能过，但业务直接错了。

这类知识一般可以分成几种：

- **业务规则**：优惠券和秒杀不能叠加，同一用户每天只能领取一次奖励
- **技术约束**：订单分页必须走指定联合索引；深分页（> 100 页）改用游标，禁止全表扫描
- **历史债务**：第三方上传接口只支持 5 MB，超过就会报错，所以代码里要提前校验
- **性能基线**：单表查询控制在 50 ms 内；关键接口超过 200 ms 要考虑降级或兜底

这些东西是 AI 写代码时的边界。

现在很多 Spec-Driven Development 的思路就是把 Spec 从“写给人看的文档”变成“约束 AI 生成代码的规则”。

不要认为 Spec 只是前期用用，后续实现、校验和维护时都需要。

不过，只把规则写进去还不够，最好再加一段自检清单。因为 AI 很容易写完功能就结束，不会主动回头确认这些隐含约束。

## 完成自检清单

任务写完之后，不要让 AI 直接说一句“已完成”。

至少让它按清单自己过一遍。比如完成 `Task-001` 后，必须逐项确认：

- [ ] 所有 API 错误返回都符合统一格式
- [ ] 数据库查询命中了指定联合索引
- [ ] 优惠券和秒杀的互斥逻辑已正确实现
- [ ] 单元测试覆盖了空值、越界、并发等边界场景
- [ ] 分支覆盖率达到项目约定基线，关键边界分支均有断言
- [ ] 圈复杂度未超过项目静态检查阈值；例外有评审记录

如果有哪一项没法确认，不能糊弄过去，要把原因写出来。

AI 很容易把代码写完当成任务完成。可真实项目里，功能能跑只是第一步，错误格式、索引命中、边界测试、复杂度控制，这些才是后面少背锅的地方。

## 多代理协作的坑

有人会问：一个 AI 不够用，多搞几个行不行？

可以，但坑比你想的多。

![Multi-Agent 三代理协作流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-multi-agent-pipeline.png)

三代理协作的思路是代码、测试、审查各管一段，流水线推进。代码代理接到 Task 写功能，写完交给测试代理出用例跑测试，通过后再交给审查代理看代码质量，最后人类终审合并。

有个坑必须提前说清：测试代理在自己的分支上写测试，但被测代码在代码代理的分支上。这两个分支是平行的，测试代理要么先 merge 代码分支，要么根本跑不起来。

两种能跑通的模式：

**串行同分支（推荐起步）。** 三个代理在同一个 feature 分支上按顺序 commit，用 commit message 前缀区分角色。简单，没有合并冲突，适合大多数项目。

```bash
git commit -m "[code] implement user registration API"
git commit -m "[test] add unit tests for user registration"
git commit -m "[review] fix null check in email validation"
```

**链式继承（代理能力已验证后）。** 测试代理从代码分支 checkout，审查代理从测试分支 checkout，最后从审查分支 merge 回主线。分支之间是继承关系而不是平行关系，每个代理都能看到前一个代理的产出。

多代理翻车的场景不少：死锁（A 等 B、B 等 A，设计时确保依赖是 DAG）、无限循环（代理自我迭代停不下来，设最大轮次 Max 3）、输出格式错误（JSON 解析失败，加校验和重试，最多 3 次）。提前设好这些兜底，能避开大部分问题。

老实说，多代理这块我自己也还在摸索，目前的经验是串行同分支模式能覆盖八成场景，复杂编排除非团队有人专门维护，否则翻车概率不低。

## Spec 不是写完就扔的

跑了几个项目后，有几个习惯固定下来了。

**渐进细化。** 别想着一口气写出完美 Spec。先写高层大纲，让 AI 把骨架跑起来，再一个模块一个模块补细节。

**模块化组织。** API、数据库、样式规范、错误码、权限规则各一个文件。每次只给 AI 当前任务用得到的上下文。

**持续迭代。** 每次 Code Review 发现问题，或者 AI 又把同一个坑踩了一遍，回去改 Spec。只改代码不改规范，下次照样犯。

这里有个高频翻车场景值得特别说一下：Task-001 完成时 Spec 规定错误格式是 `{"code": "USER_NOT_FOUND", "message": "..."}`，两周后 Spec 更新加了 `trace_id` 字段，但 Task-001 的代码已经没人管了。规范和实现就这么悄悄跑偏了。

应对办法：Spec 变更时做影响范围评估。可以在每个 Spec 文件里维护一个“依赖此文件的模块”列表，Spec 更新时主动触发受影响模块的回归测试。CI 流水线里加一条判断：Spec 文件有变动，自动跑相关模块的测试。

## 分享几套 Spec 模板

我常用的就这三种，按场景选一个就行。

**模板一：OpenAPI 风格，适合 API 开发**

````markdown
## API：POST /api/v1/users

### 基本信息

- **端点**：`/api/v1/users`
- **方法**：POST

### 请求参数

| 字段     | 类型   | 必填 | 约束                                                         | 示例             |
| -------- | ------ | ---- | ------------------------------------------------------------ | ---------------- |
| email    | string | 是   | 邮箱格式                                                     | user@example.com |
| password | string | 是   | 单因素密码至少 15 字符，最大支持至少 64 字符；不强制字符组合 | -                |

### 响应格式

- **201 Created**：用户创建成功

  ```json
  { "id": "uuid", "email": "user@example.com", "created_at": "..." }
  ```

- **409 Conflict**：邮箱已存在
  ```json
  { "code": "EMAIL_ALREADY_EXISTS", "message": "Email already exists" }
  ```

### 验收标准

- [ ] 新密码使用经过目标服务器基准测试的 Argon2id 参数
- [ ] 密码经过泄露密码 Blocklist 检查，注册和登录接口有速率限制
- [ ] 邮箱唯一性由数据库唯一索引保证
- [ ] 分支覆盖率达到项目约定基线（示例：80%），且关键安全分支有断言
````

**模板二：Gherkin 风格，适合 BDD**

```gherkin
Feature: 用户登录

  Scenario: 使用有效凭据登录
    Given 用户已注册邮箱 "test@example.com" 和密码 "CorrectHorse123!"
    When 用户提交登录请求
    Then 返回 200 状态码和 JWT token
    And token 有效期 24 小时

  Scenario: 使用无效密码登录
    Given 用户已注册邮箱 "test@example.com"
    When 用户用错误密码提交登录
    Then 返回 401
    And 错误信息为 "Invalid credentials"
    And 不暴露具体是邮箱还是密码错
```

**模板三：Checklist 风格，适合代码审查**

```markdown
## Code Review Checklist

### 功能性

- [ ] 实现符合 Spec 描述
- [ ] 边界条件已处理：空值、越界、并发
- [ ] 错误处理完善

### 质量

- [ ] 函数长度 <= 50 行
- [ ] 圈复杂度符合项目静态检查阈值，例外有评审记录
- [ ] 无重复代码（DRY）

### 安全

- [ ] 无敏感信息硬编码
- [ ] 输入已验证/转义
- [ ] 权限检查已加
```

## 踩过的坑

说几个我自己踩过的。

约束写太死了，AI 连正常的灵活性都没有。比如你把 Service 层每个方法签名都定好，AI 连个参数名都不敢改。Spec 定的是边界，不是逐行伪代码。

反过来，约束写少了更常见。关键边界没定义，AI 就自己猜。猜对了算运气，猜错了算日常。我有一个项目，AI 用了 MD5 存密码，就是因为 Spec 里没写用什么加密算法。

Spec 改了没同步，这个最隐蔽。代码和文档慢慢就跑偏了，AI 下次拿到的还是旧版规范，写出来的代码自然也对不上。

还有一个：只写不验。Spec 写了一大堆，但没接到 CI 里，最后变成形式主义。写完没人检查，跟没写差不多。

那个合并按钮，永远应该握在你自己手里。


---

---

<!-- source: 实践/Vibe Coding 实用技巧总结-Git、Spec、上下文管理与多 Agent 协作.md -->

## [19] Vibe Coding 实用技巧总结：Git、Spec、上下文管理与多 Agent 协作

---
title: Vibe Coding 实用技巧总结：Git、Spec、上下文管理与多 Agent 协作
description: 结合 Spec、Skills、上下文管理、Git 版本控制、多模型分工、测试验证、代码 Review 和多 Agent 协作，整理 Vibe Coding 在真实项目里更可控的用法。
category: AI 编程技巧
tag:
  - Vibe Coding
  - AI 编程
  - Claude Code
  - Codex
head:
  - - meta
    - name: keywords
      content: Vibe Coding,AI 编程技巧,Agent Skills,Claude Code,Codex,Spec Coding,Git 版本管理,AI 代码审查,多模型协作
---

你好，我是小 G。上个周末，我通过文字消息分享了一些 Vibe Coding 的小技巧。这篇文章把当时没展开的内容补完整，也顺便整理一下这几年实际用 AI 编程时踩过的坑。

![ Vibe Coding 技巧分享读者评论](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/vibe-coding-practices-comments.png)

正文开始之前，想问问大家：你还记得自己第一次 Vibe Coding 的感觉吗？

我反正是特别上头，24 年第一次接触 Cursor，真是惊为天人。那种感觉就像小时候刚接触游戏一样，但比游戏还爽一些。每天最开心的事情就是 Vibe Coding，看着代码一行一行被自动写出来。就感觉自己一天做的事情比过去一周还要多。

那段时间是真的游戏都不想碰了，就想着 AI 能帮我多干点活。

但爽完之后，翻车情况也越来越多，经常会遇到一些莫名其妙的问题。这让我意识到，单纯凭感觉去 Vibe Coding 是不太可行的。

下面这些，是小 G 这几年用 AI 编码踩出来的一些经验。不花哨，但都挺管用。

## 先把 Git 准备好

如果只选一个最重要的 Vibe Coding 技巧，小 G 会选 Git。

原因很简单：AI 写错一行代码不可怕，可怕的是它一口气改了 20 个文件，等你发现方向不对，已经不知道哪一块该留、哪一块该扔。Git 不是写完代码之后再补的仪式，它应该站在 AI 动手之前。

让 Agent 改代码前，先看工作区：

```bash
git status --short
```

如果当前目录里已经有改动，先弄清楚这些改动是谁的、要不要保留。多人协作或多 Agent 并行时，这一步尤其重要。不要让 AI 回滚它没写的东西，也不要把别人的半成品混进自己的任务里。

确认干净后，再给当前任务单独开分支：

```bash
git switch -c feat/order-export
```

任务很小也建议开分支。主分支上裸跑 Vibe Coding，心理负担会越来越大；分支隔离之后，AI 就算写歪了，也只是当前任务分支的问题。

AI 改完后，别急着看它的总结，先看仓库自己怎么说：

```bash
git diff --stat
git diff
```

`git diff --stat` 看影响面，`git diff` 看细节。确认没问题之后，再分块暂存和提交：

```bash
git add -p
git commit -m "feat: add order export"
```

一个提交只做一件事。能分块提交就分块提交，后面 Review、回滚、定位问题都会轻很多。AI 说“我只改了导出逻辑”，不如 diff 可信。

改坏了也尽量用可控回滚：

```bash
# 丢弃某个未提交文件的修改
git restore path/to/file

# 撤销已经暂存的文件
git restore --staged path/to/file

# 已经提交并推送过，优先生成反向提交
git revert <commit>
```

`git reset --hard` 不是什么禁术，但别随手交给 Agent。除非当前分支就是一次性实验分支，否则它很容易把没保存好的改动一起抹掉。

并行任务可以用 `git worktree` 隔离：

```bash
git worktree add ../project-order-export -b feat/order-export
git worktree add ../project-refactor-user -b feat/refactor-user
```

一个 Agent 一个目录、一个分支、一个任务。这样它们即使乱改，也只会乱在自己的工作区里。

![Claude Code Git Worktree](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-git-worktree.png)

## 开工前先把范围写窄

你需要让 AI 做什么，尽量说得具体一些，不要让它自己猜。

以订单场景为例，你说一句：帮我实现导出订单功能。

这句话太宽泛了，AI 不知道每次导出几条，导出什么格式，导出哪些字段，字段顺序是怎样的。

信息没给够，它就会自己猜。猜出来的结果能跑，但未必是你想要的。

不如在开工前花几分钟写轻量 Spec，通常比后面返工便宜得多：

```markdown
## 目标

实现订单导出接口，支持按时间范围导出 CSV。

## 约束

- 单次最多导出 5000 条
- 时间范围不能超过 31 天
- 只能导出当前租户的数据
- 查询必须走 order_tenant_time_idx
- 导出失败要记录失败原因，不能只返回 unknown error

## 验收

- 正常导出 CSV，字段顺序为 order_no、amount、status、created_at
- 超过 5000 条返回明确错误
- 越权租户数据不能被导出
- 单元测试覆盖无数据、越权、超过条数、超过时间范围 4 种情况
```

这份东西不用写得像方案评审文档。

![Spec Coding 四步流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-pipeline-flow.png)

小任务写清楚目标、约束和验收就够了；中等任务再补接口格式、错误码、表结构；大一点的需求，再拆成 `requirements.md`、`design.md`、`tasks.md`。没必要一上来就把流程拉满，不然你会先被文档劝退。

关于 Spec Coding 的详细介绍，可以参考：[Spec Coding 规范驱动编程实战：从 Vibe Coding 到 AI 代码规范](https://javaguide.cn/AI编程/实践/spec-coding.html)。

还有一招，比抽象规范更管用：给 AI 看项目里写得好的代码。

```text
先阅读 UserController、UserService、UserRepository 和对应测试。参考它们的分层方式、异常处理、返回体包装、日志风格和测试写法。然后实现 OrderExportController。

不要引入新的响应格式。
不要新增全局异常处理器。
不要绕过现有权限校验逻辑。
```

“代码要优雅、可维护、符合最佳实践”这种话，放在 Prompt 里看着很认真，实际约束力很弱。

模型更擅长模仿具体样板。你让它看一段项目里真正合格的代码，它反而更容易写出同一套风格。

## 把项目坑点写进规则文件

长期项目可以把这些规则放到 AI 工具能稳定读取的位置。比如：

- Claude Code：`CLAUDE.md`
- Codex：`AGENTS.md`
- Cursor：Project Rules、`.cursor/rules/*.mdc`，也可以配合 `AGENTS.md`
- GitHub Copilot / VS Code：仓库级 `.github/copilot-instructions.md`、路径级 `.github/instructions/*.instructions.md`，也支持 `AGENTS.md`

千万别写成项目说明书！应该写 Claude 容易猜错、代码里读不出来、团队又必须遵守的规则。重点放技术栈版本、常用命令、架构取舍、团队约定和项目坑点；别塞空话、默认行为和大段文档。

判断标准很简单：这行删掉后，Claude 会不会更容易犯错？

![多智能股票分析项目中的 CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

每次 AI 犯了重复错误，也别只在聊天里训它一句。

聊天记录会散，规则文件会跟着仓库走。你把坑补进规则里，下一次它才更可能绕过去。

## 善用 Skill，把套路沉淀下来

规则文件和 Skill 解决的问题不太一样。

规则文件更适合放这个项目一直要遵守什么，比如：技术栈版本、启动命令、目录结构、错误码格式、哪些文件不能碰。

Skill 更适合放遇到某类任务时应该怎么做。比如做代码审查、写测试、改前端页面、网页调研、写技术文章，这些任务每次流程都差不多，就没必要每次都在聊天里重新提醒一遍。

小 G 之前写过两篇相关的文章：[Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html) 和 [AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)。

简单说，Skill 就是一份能被 Agent 按需加载的任务说明。它不是插件，也不是 MCP 工具本身，而是把某类任务的流程、约束、检查项和踩坑经验写进 `SKILL.md`。

![Agent 执行链路](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skills-agent-execution-link.png)

比如这些事情，就很适合沉淀成 Skill：

- 写功能前走 TDD：先写失败测试，再写实现。
- 做代码审查时固定检查安全、事务、性能、边界条件和项目约定。
- 写前端页面时固定检查响应式、hover 状态、可访问性和设计系统。
- 做网页调研时固定选择搜索、抓取、浏览器自动化这些工具的顺序。
- 写技术文章时固定检查事实来源、引用、标题层级和 AI 味。

**为什么要用 Skill？** 因为这些流程每次靠聊天提醒都很烦。你今天提醒它先写测试，明天换个会话它又忘了；你这次让它 Review 权限风险，下次它可能只看命名和格式。Skill 的价值就在这里：把重复提醒变成可复用的工作手册。

不过，Skill 也别写成 README。

README 是给人看的，可以讲背景、原理和安装说明；Skill 是给 Agent 执行任务时看的，重点是：什么时候用、按什么顺序做、哪些情况别做、失败了怎么兜底。

正文越长，越容易占上下文。写 Skill 时可以问自己一句：这段话会不会直接影响 Agent 下一步怎么做？不会，就别塞进去。

Anthropic 的建议是，`SKILL.md` 正文最好控制在 500 行以内；如果超过这个长度，就把细节拆到单独文件里，通过渐进式披露的方式让 Agent 按需读取。

![SKILL.md 正文最好控制在 500 行以内](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/keep-skill-md-content-under-500-lines-for-best-performance.png)

现成 Skill 也可以直接用，比如 Superpowers 把 TDD、Code Review、Spec-Driven、Git Worktree、子 Agent 协作这些流程封装好了。

我在 [AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html) 这篇文章中有详细推荐。

但第三方 Skill 不要拿来就跑。`SKILL.md` 也是指令，里面如果带了危险命令、奇怪脚本、过宽权限，Agent 会照着做。装之前至少看一眼正文、`scripts/` 和 `references/`，确认它没有越权操作。

## 贵模型别拿来搬砖

不要什么事都丢给最贵的模型。

这就像请了一个资深架构师，结果天天让他改字段名、补 getter、调 CSS，钱花了，价值没用出来。反过来也一样，为了省钱把系统设计、安全边界、复杂重构全交给便宜模型硬扛，最后返工成本可能更高。

小 G 更常用的是“强推理模型把方向定清楚，低成本模型去干边界明确的活，最后再用独立模型验一遍”。

```text
第一步，让推理和代码审查能力较强的模型读需求和代码库。
只让它做方案、列风险、拆任务，不让它急着写代码。

第二步，方案确认后，把一个个 Task 交给成本和延迟更合适的实现模型。
让它按任务编码、补测试、跑命令，做完之后给出 diff 摘要。

第三步，把 git diff 交给独立的审查模型。
这次只让它 Review：Bug、越权风险、事务边界、性能问题、测试缺口。
```

具体模型变化很快。截至 2026-07-24，可选模型家族包括 Claude Fable 5、GPT-5.6、DeepSeek V4、GLM-5.2、MiniMax M3 和 Kimi K3。这里列的是时间快照，不是固定搭配；实际选择还要看账户可用性、任务实测、价格、上下文限制和工具兼容性。

代码审计也可以这么干。先让便宜模型扫一遍项目，把疑似问题列出来；再让强模型复核这些问题到底成不成立。直接让高价模型全量扫，当然也不是不行，就是钱烧得快，收益未必成比例。

![DeepSeek V4 Benchmark 数据](https://oss.javaguide.cn/github/javaguide/ai/coding/deepseek-v4/v4-benchmark.png)

## 别听它说修好了，看证据

AI 最爱说“已修复”“已优化”“没问题”。

听听就行，别直接信。

小 G 更愿意看三样东西：测试、命令输出、diff。

比如你让它修一个订单导出 Bug，不要只问“修好了吗？”。可以直接这样要求：

```text
先不要改实现。
先根据 Spec 补测试，覆盖正常路径、参数非法、权限不足、无数据、并发重复请求。
测试一开始应该失败。
我确认测试合理之后，你再改实现，直到测试通过。
```

这个做法有点像 TDD，但不用搞得很教条。重点是别让 AI 一边改代码、一边补一个永远会通过的测试。先让测试失败，再让实现通过，心里会踏实很多。

不想完整 TDD，至少也要让它列清楚验收项：

```markdown
- [ ] 新增接口有权限校验
- [ ] 错误返回符合统一格式
- [ ] 数据库查询命中指定索引
- [ ] 空值、越界、重复请求都有测试
- [ ] 日志不打印 token、password、api key
- [ ] 所有测试通过
```

还要让它贴运行过的命令和结果：

```bash
mvn test
npm test
go test ./...
pnpm lint
```

没跑就写“未运行”，并说明原因。比如依赖没装、数据库没起、测试环境缺配置，都可以接受；最怕的是它没跑，但写一句“已验证”糊弄过去。

性能优化更不能只听它说。它说“速度提升明显”，你就让它把证据贴出来：优化前后的 SQL、`EXPLAIN`、测试数据量、P95/P99 或接口耗时。没有真实压测结果，就只写预期收益和待验证项，别让它编数字。

## 上下文别越堆越乱

小 G 之前写过一篇 [Context Engineering](https://javaguide.cn/ai/agent/context-engineering.html)，里面有个观点放到 Vibe Coding 里也很适用：**上下文窗口大不等于效果好——窗口能装更多东西，但模型能不能稳定找到重点，是另一回事。**

![上下文为什么会失效](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/why-does-the-following-content-fail.png)

一个会话里先写登录，再改支付，再重构缓存，最后又问为什么测试挂了，模型迟早把旧约束、失败尝试和废弃方案混在一起。你以为自己给了它完整历史，它拿到的可能是一堆噪声。

Vibe Coding 里，上下文要管三件事。

**第一，别把仓库一股脑塞进去。** 当前任务只需要 Spec、相关文件、报错日志、验收命令和少量参考实现。其他内容先用路径、文件名、目录结构挂着，等需要时再让 Agent 去读。Claude Code 分析大仓库时也是这种思路：先用搜索和目录定位，再逐步读具体文件，而不是上来吞全量代码。

**第二，长任务要及时压缩。** Claude Code 可以用 `/compact` 压缩上下文，用 `/clear` 清空上下文（详细用法参考 [Claude Code 核心命令详解](https://javaguide.cn/AI编程/实践/claudecode-commands.html)）；Codex 或其他 Agent 也有类似的摘要、压缩、重开机制。压缩是为了保留重点（如：架构决策、已改文件、未解决问题、失败命令和下一步任务），丢掉重复对话和已经消化过的工具输出。

**第三，关键进展要落到文件里。** 比如让 Agent 在长任务中维护一份 `NOTES.md` 或任务 handoff，记录：

```markdown
## 已完成

- 修改了哪些文件
- 哪些测试已经跑过
- 哪些问题已经确认不是 Bug

## 剩余任务

- 还没修的失败用例
- 还没确认的边界场景
- 下一个 Agent 需要先读哪些文件
```

这样就算开新会话，也不用重新解释半天。聊天记录会变长、变乱、变旧，结构化笔记反而更稳定。

小 G 的习惯是：一个会话只处理一个任务；超过两次纠正还不对，就开新会话；新会话只带当前 Spec、相关文件、失败日志、验收命令和上一轮 handoff。上下文包该多大没有通用阈值，应以模型能否稳定找到约束、完成任务并通过验收为准；可以从最少必要材料开始，不够再补。

上下文包可以写得很简单：

```markdown
## 当前任务

实现订单导出接口。

## 必读文件

- src/main/java/.../UserController.java
- src/main/java/.../OrderRepository.java
- docs/spec/order-export.md

## 禁止修改

- 数据库已有字段名
- 全局异常格式
- 登录鉴权逻辑

## 验收命令

- mvn test
- mvn -Dtest=OrderExportServiceTest test
```

文档也可以当上下文用。AI 改了多个模块后，让它补一份变更说明：新增了什么接口，改了哪些表或索引，关键业务规则是什么，如何验证，如何回滚。这样就可以下次继续开发时能直接喂给 AI。

历史包袱多的项目里，哪个字段不能改、哪个接口兼容老客户端、哪个枚举值被外部系统写死，这些口口相传的规则都该进文档。

## 多 Agent 先串行再并行

多 Agent 分工协作的玩法，确实很香，但真心不建议大家上来就尝试多 Agent 并行（例如，一个写代码，一个补测试，一个做 Review，一个写文档），很容易把项目搞乱。

你刚开始就串行着跑就好了：

1. Plan Agent 只读代码，输出方案和任务拆分；
2. Code Agent 只负责一个 Task，不碰其他任务；
3. Test Agent 补测试并运行验证；
4. Review Agent 只看 diff，找问题，不直接大改。

一定不要一上来就让多个 Agent 同时改代码，让们在同一个 feature 分支上按顺序提交：

```bash
git commit -m "[plan] add order export design"
git commit -m "[code] implement order export api"
git commit -m "[test] add order export tests"
git commit -m "[review] fix tenant permission check"
```

等流程跑顺以后，也比较熟练之后，再考虑 **worktree 并行、[Agent View](https://javaguide.cn/AI编程/实践/claudecode-agentview.html)** 这类玩法。

![多 Agent 并行会话](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/multi-agent-parallel-sessions.png)

![Claude Code Agent View](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-agents-list-view-20260518102539932.png)

并行最怕的不是 Git 冲突，那种至少能看到。真正麻烦的是不冲突——两个 Agent 同时改同一个公共 DTO，一个为了导出加字段，一个为了查询删字段，合并时看起来没问题，但接口语义、序列化结果、前端依赖可能已经变了。

所以多 Agent 不能靠运气，要靠任务边界、分支隔离和验收项管住。哪些文件能改、哪些模块不能碰、改完要跑哪些测试、哪些 diff 必须人工看，都要提前写清楚。

## subagent 适合做专项任务

这里也可以顺手提一下 subagent。

以 Claude Code 为例，subagent 可以理解成一个“专门干某类活的小助手”。它有自己的上下文、系统提示词和工具权限，适合处理边界比较清楚的任务，比如代码审查、测试补齐、日志分析、文档整理。官方文档里也提到，subagent 可以在独立上下文中运行，减少主会话的上下文压力，并且可以为不同任务配置不同的工具访问权限。

![Claude Code Sub-Agent：让主对话保持干净](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode-sub-agent.png)

它和前面说的多 Agent 并行不是一回事。多 Agent 更偏协作方式，subagent 更偏任务委派。比如主会话正在实现订单导出功能，你可以把“检查这次 diff 有没有权限绕过风险”交给 Review subagent，把“根据当前代码补单元测试”交给 Test subagent。它们各自做完后，把结论返回给主会话。

但 subagent 也别滥用。任务太小、边界不清、代码还在剧烈变化时，拆出去反而容易增加沟通成本。比较稳的用法是：主 Agent 负责整体上下文和决策，subagent 负责局部、明确、可验收的任务。

## 权限控制很重要

AI Coding 不能只靠 Prompt 里写一句：“请你谨慎一点，别做危险操作”。

Claude Code 这类工具已经不只是回答问题了，它会读文件、改代码、执行命令，也可能通过 MCP 调内部工具或外部服务。风险自然也不再只是代码写错，更严重的问题可能误删文件、改坏配置、跑错迁移、推送到远程，甚至碰到密钥、证书、生产配置这类敏感信息。

所以权限要提前收住。

`.env.production`、密钥、证书这类文件，默认就不应该让 AI 读取或修改；删除文件、数据库迁移、推送远程、改 CI 配置这类操作，必须人工确认；登录、支付、权限、上传、Webhook 这类模块，改完要单独做安全 Review。

Claude Code 官方其实也提供了对应的权限机制。比如可以用 `/permissions` 查看和管理工具权限；权限规则里可以配置 `allow`、`ask`、`deny`，分别表示允许执行、执行前询问、直接拒绝。像 `git diff`、跑单测这类低风险命令，可以放得宽一点；`git push`、删除文件、读取 `.env`、访问 `secrets/**` 这类操作，就应该放到 `ask` 或 `deny` 里。

如果只是配置权限规则还不放心，可以继续加 Hooks 和 Sandbox。Hooks 可以在工具调用前后执行自定义检查，比如拦截危险命令、检查是否改了敏感路径、在提交前跑格式化和测试；Sandbox 则更偏执行环境隔离，用来限制 Bash 命令能访问的文件系统和网络范围。

举个例子，假设 Claude Code 准备执行：

```bash
rm -rf /tmp/build
```

`PreToolUse` Hook 会先拿到这次 Bash 调用，判断它是不是危险命令；如果命中规则，就返回 `deny`，Claude Code 会取消这次工具调用，并把拒绝原因反馈给 Claude。

下面这张图展示了整个过程，图源 Claude Code 官方文档对 Hooks 的介绍。

![Claude Code PreToolUse Hook](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-runs-rm-rf-tmp-build-what-happens.svg)

更稳的做法，是把这些规则固化到工程里：

- 哪些命令可以自动执行；
- 哪些命令必须人工确认；
- 哪些路径禁止读取或修改；
- 哪些 MCP 工具不能随便调用；
- 哪些 CI 任务必须人工审批；
- 哪些测试不过就不能合并。

这里还有一个容易忽略的点：权限规则不是万能的。比如你只拦了 `rm *`，不代表一定拦得住 `/bin/rm`、`find -delete` 这类变体。所以高风险操作不能只靠一条命令黑名单兜底，最好结合路径限制、Hooks、Sandbox、CI 和人工 Review 一起管。

工程上的谨慎，肯定不能写在 Prompt 里，要落到命令、脚本、权限、测试、CI 和审批流程里。

## 分享下我常用的一套流程

日常写需求时，小 G 一般按这个节奏走：

1. 新建分支，先确认工作区是干净的。
2. 写一份轻量 Spec，把目标、约束、验收标准说清楚。
3. 看看有没有合适的 Skill，比如 TDD、Code Review、前端设计、网页调研。
4. 先让能力较强的模型出方案，只讨论方案，不急着写代码。
5. 方案确认后，再让低价模型按 Task 一步步实现。
6. 每完成一个 Task，就跑测试、看 diff，然后小步提交。
7. 当前 diff 稳住后，再让独立模型做一次 Review。
8. 修掉 Review 里合理的问题，再跑一遍测试。
9. 合并前，人工看关键 diff。涉及数据、权限、支付、定时任务这类改动时，再补一下文档、回滚方案或者灰度说明。

这个流程比“一句话生成代码”慢一点。

但慢的这点时间，通常会在后面赚回来。至少能少很多返工、回滚和线上排雷。

短期原型可以大胆 Vibe，先把东西跑起来再说；但只要代码要长期维护，还是得回到工程流程里。GitHub Flow 本身也是围绕分支、Pull Request、Review 和合并来组织协作，不是让人直接往主分支怼代码。Codex 这类工具也支持通过 `AGENTS.md` 放项目级规则，让 AI 按仓库里的约定做事，而不是每次都靠聊天临时提醒。

说白了，AI 写代码越快，Git、测试、Review、Spec 这些老东西越不能丢。

以前它们是为了约束人，现在还得顺手约束 AI。


---

---

<!-- source: 实践/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了.md -->

## [20] 比 iTerm2 更适合 Claude Code/Codex 的终端，我换成 Ghostty 了

---
title: 比 iTerm2 更适合 Claude Code/Codex 的终端，我换成 Ghostty 了
description: 介绍 Ghostty 终端的安装、配置文件位置、字体主题、Starship、分屏快捷键、Quick Terminal、Shell Integration、SSH 和常见问题，适合 Claude Code 与 Codex CLI 用户搭建顺手的终端工作台。
category: AI 编程技巧
tag:
  - Ghostty
  - Claude Code
  - Codex
  - 终端工具
head:
  - - meta
    - name: keywords
      content: Ghostty,Ghostty安装,Ghostty配置,Ghostty教程,Claude Code终端,Codex CLI,AI编程终端,终端工具,Starship,Shell Integration
---

你好，我是小 G。我把终端从 iTerm2 换到 Ghostty 已经有三个月了。

整体体验还不错，这篇文章来分享一下。

Ghostty 不是 Claude Code 的官方指定终端，但确实被 Claude Code 带火了一把。Claude Code 创始人 Boris Cherny 在聊团队使用习惯时提到，他们的开发团队程序员非常喜欢 Ghostty。

![Boris Cherny 提到 Claude Code 团队喜欢 Ghostty](https://oss.javaguide.cn/github/javaguide/ai/coding/boris-ghostty-x.png)

我自己也是看了这个分享，后来被 iTerm2 搞烦了之后转去的。

用 Claude Code 或 Codex CLI 跑久了，终端会变成一个小工作台：一边看 Agent 输出，一边跑测试、看日志、处理 Git。iTerm2 当然也能做，但要调到顺手，通常得花不少时间配字体、主题、快捷键和分屏。Ghostty 的好处是下载下来就已经比较能用，后面只是按自己的习惯微调。

Ghostty 做的事情就是把终端模拟器这件事做好，没有什么花里花哨的。它没有内置 AI，也不是服务器管理器。

当然了，iTerm2、Warp、Kitty 等等，都是不错的，我希望看到这篇文章的朋友不要因为这些争论，你自己用着顺手才是最重要的！

![Ghostty 官网首页](https://oss.javaguide.cn/github/javaguide/ai/coding/ghostty-homepage.png)

## 安装

macOS 直接用 Homebrew：

```bash
brew install --cask ghostty
```

也可以去官网下载 `.dmg`，拖到 Applications。官方 macOS 包是 Ghostty 项目签名并经过 notarize 的；Homebrew cask 用的也是官方 `.dmg`。

装完看一下版本：

```bash
/Applications/Ghostty.app/Contents/MacOS/ghostty +version
```

如果 CLI 已经进 PATH：

```bash
ghostty +version
```

![Ghostty 版本检查输出](https://oss.javaguide.cn/github/javaguide/ai/coding/ghostty-version.png)

> 版本说明：本文配置按我本机的 Ghostty 1.3.1（1.3.x 系列）校对。Ghostty 更新挺快，配置项以你本机的 `ghostty +show-config --default --docs` 为准。Ghostty 1.4.0 计划提供 `ghostty +ssh`；下文保留 1.3.x 的 SSH 处理方式，1.4 用户请先看 [Ghostty SSH 文档](https://ghostty.org/docs/features/ssh)，不要直接照抄旧配置。

Linux 安装方式要看发行版。Arch Linux 可以直接：

```bash
sudo pacman -S ghostty
```

其他发行版优先看官方安装页。Ghostty 官方直接分发的是 macOS 预构建包，Linux 包多由发行版维护者或社区维护；工作机、公司机器上别随手跑来路不明的安装脚本。

## 先用默认值跑一天

其实你不需要做任何配置都能用，已经能够满足大部分朋友的需求了。

Ghostty 默认内置 JetBrains Mono，也带 Nerd Fonts 能力。大多数人不配字体也能直接用。

刚开始用，别一上来复制几百行配置。先打开跑一天，再改字体、主题、窗口内边距、透明度、剪贴板、Shell Integration 和分屏快捷键。终端配置越长，出问题越难查；Ghostty 值得用的一点，就是可以少配。

## 配置文件在哪里

Ghostty 配置就是 `key = value`。当前推荐文件名是 `config.ghostty`，旧文件名 `config` 仍会被读取。常见路径：

```text
~/.config/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了/config.ghostty
~/.config/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了/config
```

macOS 还会读：

```text
~/Library/Application Support/com.mitchellh.ghostty/config.ghostty
~/Library/Application Support/com.mitchellh.ghostty/config
```

两个地方都有配置时，macOS 的 Application Support 路径后加载，冲突项会覆盖前面的值。配置不生效，先查这个。

常用检查命令：

```bash
ghostty +list-fonts
ghostty +list-themes
ghostty +list-keybinds --default
ghostty +validate-config
```

改完配置后，macOS 按 `Cmd + Shift + ,` 重载，Linux 按 `Ctrl + Shift + ,`。透明度这类窗口项不一定热更新，没变化就重启 Ghostty。

## 我的最小配置

先建目录：

```bash
mkdir -p ~/.config/ghostty
```

编辑配置：

```bash
nano ~/.config/比 iTerm2 更适合 Claude CodeCodex 的终端，我换成 Ghostty 了/config.ghostty
```

可直接用这一份：

```ini
# 字体
font-family = "JetBrainsMono Nerd Font Mono"
font-size = 14
font-thicken = true
font-thicken-strength = 80
font-codepoint-map = U+2E80-U+9FFF,U+F900-U+FAFF,U+FF00-U+FFEF=PingFang SC

# 主题
theme = Catppuccin Mocha

# 窗口
window-padding-x = 12
window-padding-y = 10
window-save-state = always
background-opacity = 0.95
background-blur = 20

# 光标和滚动
cursor-style = bar
cursor-style-blink = true
scrollback-limit = 10000000
scrollbar = never

# Shell Integration
shell-integration = detect
shell-integration-features = cursor,sudo,title

# macOS
macos-option-as-alt = left
macos-titlebar-style = transparent
macos-titlebar-proxy-icon = hidden

# 分屏
split-divider-color = #45475a
unfocused-split-opacity = 0.92

# 剪贴板
copy-on-select = false
clipboard-paste-protection = true
clipboard-paste-bracketed-safe = true
```

字体这里用的是 JetBrainsMono Nerd Font Mono，主要是为了让 Git 分支符号、Starship prompt、Powerline 图标别变成方块。没装的话：

```bash
brew install --cask font-jetbrains-mono-nerd-font
```

中文不要直接把 `PingFang SC` 当第二个 `font-family` 乱塞。主字体没命中时，英文可能也落到中文字体上，字距会很怪。`font-codepoint-map` 只把中文码位交给 `PingFang SC`，更稳。

`copy-on-select = false` 是我的习惯。Ghostty 默认选中文本会复制，Linux 用户可能喜欢；在 macOS 上，我更愿意手动 `Cmd + C`，避免剪贴板被误覆盖。

`clipboard-paste-protection = true` 建议留着。从网页复制多行命令进终端，本来就应该多一道提醒。

`scrollback-limit` 的单位是字节，不是行数；`10000000` 大约是 10 MB，而且每个分屏、标签页都会单独算。

![Ghostty 配合 Catppuccin Mocha、JetBrainsMono Nerd Font 和 Starship 的效果](https://oss.javaguide.cn/github/javaguide/ai/coding/ghostty-terminal-demo.png)

## 主题

列出内置主题：

```bash
ghostty +list-themes
```

换主题只要一行：

```ini
theme = TokyoNight
```

我一般用：

```ini
theme = Catppuccin Mocha
```

想跟随系统明暗模式：

```ini
theme = dark:Catppuccin Mocha,light:Catppuccin Latte
```

Ghostty 内置主题已经够多。自定义主题本质上也是一段会被 Ghostty 加载的配置片段，大多数只改颜色；从陌生来源下载时，打开看一眼，确认它没有顺手改字体、透明度或 keybind。

## Starship 可选

Ghostty 管终端窗口、字体、主题和协议；Starship 管 shell prompt。

想让 prompt 和 Catppuccin 风格一致，可以装：

```bash
brew install starship
```

`~/.zshrc` 末尾加：

```bash
command -v starship >/dev/null && eval "$(starship init zsh)"
```

想确认 Starship 到底显示了哪些模块，可以在 Git 仓库里跑：

```bash
starship explain
```

![Starship explain 展示 prompt 中的路径、分支和 Git 状态](https://oss.javaguide.cn/github/javaguide/ai/coding/starship-explain.png)

我不建议一开始就把 Starship 模块全开。目录、Git 分支、Git 状态、耗时够用；Kubernetes、云账号、容器这些东西，用到再加。prompt 每次回车都要计算，信息太满反而慢。

## 分屏和常用快捷键

macOS 下先记这些：

| 快捷键                  | 作用               |
| ----------------------- | ------------------ |
| `Cmd + T`               | 新标签页           |
| `Cmd + W`               | 关闭当前终端或分屏 |
| `Cmd + D`               | 向右分屏           |
| `Cmd + Shift + D`       | 向下分屏           |
| `Cmd + [` / `Cmd + ]`   | 前后切换分屏       |
| `Cmd + Option + 方向键` | 按方向切换分屏     |
| `Cmd + Shift + Enter`   | 放大/恢复当前分屏  |
| `Cmd + F`               | 搜索历史输出       |
| `Cmd + Shift + ,`       | 重载配置           |
| `Cmd + Shift + P`       | 命令面板           |

跑 Claude Code 时，三块布局最顺手：

1. `Cmd + D` 左右分屏。
2. 光标放到右侧，`Cmd + Shift + D` 再上下分屏。
3. 左侧跑 Claude Code，右上跑测试，右下看日志或 Git。
4. Claude 输出太长，按 `Cmd + Shift + Enter` 临时放大。

这个布局不用 tmux，也不用多个窗口来回摆。

![Ghostty 分屏运行 Claude Code、开发服务和日志](https://oss.javaguide.cn/github/javaguide/ai/coding/ghostty-split-claude-code.png)

想自己绑快捷键，用这个格式：

```ini
keybind = trigger=action
```

例如：

```ini
keybind = cmd+shift+e=equalize_splits
keybind = cmd+shift+f=toggle_split_zoom
```

## Quick Terminal

Quick Terminal 是从屏幕上方滑下来的临时终端。适合临时跑命令，不适合承载整天的主工作流。

配置：

```ini
quick-terminal-position = top
quick-terminal-screen = main
quick-terminal-autohide = true
quick-terminal-animation-duration = 0.15
keybind = global:ctrl+grave_accent=toggle_quick_terminal
```

Quick Terminal 没有默认快捷键，必须自己绑定 `toggle_quick_terminal`。`global:` 不是所有平台都能用：macOS 需要给 Ghostty 辅助功能权限；Linux Quick Terminal 只支持 Wayland，并要求 compositor 提供 `wlr-layer-shell-v1`，X11 不支持。Linux 的滑入动画目前只支持 KDE，还要启用 KWin 的 “Sliding Popups” 插件并完整重启 Ghostty；GNOME 等环境即使配置了 `quick-terminal-animation-duration` 也不会出现该动画。配置没问题但快捷键没反应时，先查显示协议、桌面环境能力、系统权限和快捷键冲突。

另外，macOS 上改 `quick-terminal-position` 后需要完整重启 Ghostty。

## Shell Integration

这一项我会留着：

```ini
shell-integration = detect
```

Ghostty 会给 zsh、fish、bash、nushell、elvish 加一段集成脚本。开了以后，新分屏会跟着当前目录走；比如你在项目根目录里开右侧分屏，右边不会又回到 home 目录。复杂 prompt 换行和 resize 也少一点错位，历史输出还能按 prompt 跳。

有两个小坑。

macOS 自带 `/bin/bash` 太老，官方文档说它不支持自动注入；默认 zsh 用户一般不用管。另一个是你在 Ghostty 里手动切 shell，比如进 `nix-shell`，集成能力可能会丢，需要手动加载对应脚本。

## SSH 不急着配

Ghostty 1.3.x 有自己的 terminfo 和协议能力。远程主机不认识时，Neovim、htop 这类 TUI 可能显示异常。

如果你只是偶尔 SSH，先别动。真遇到远程显示问题，再考虑：

```ini
shell-integration-features = cursor,title,ssh-env,ssh-terminfo
```

SSH 环境本来就复杂，没问题时少加一层包装。

Ghostty 1.4.0 发布后，优先评估 `ghostty +ssh` 提供的集成方式，再决定是否保留上述 1.3.x 配置。

## 常见问题

配置不生效，先查两个目录，再跑校验：

```bash
ls -la ~/.config/ghostty
ls -la "$HOME/Library/Application Support/com.mitchellh.ghostty"
ghostty +validate-config
```

网上有些配置会写 `=== 字体 ===` 这种分隔符，Ghostty 不认。注释要写成 `# 字体`。

英文字距很怪，先看字体名有没有命中：

```bash
ghostty +list-fonts | rg -i "JetBrains|Mono|Nerd"
```

如果你写了 `font-family = JetBrains Mono`，但本机没这个字体，Ghostty 会 fallback。fallback 到中文字体时，英文就容易变丑。装字体，或者改成 Ghostty 实际识别到的 family 名。

主题名以 `ghostty +list-themes` 输出为准。看到 `Catppuccin Mocha`，配置里就原样写：

```ini
theme = Catppuccin Mocha
```

透明度没变化，先完整重启 Ghostty。还有一种情况是 Neovim、tmux 自己画了背景色；Ghostty 默认只让窗口背景透明，不保证所有显式背景色的单元格都透明。真要连这些 cell 也一起透明，再看 `background-opacity-cells`。

选中文本把剪贴板覆盖了，就关掉：

```ini
copy-on-select = false
```

Quick Terminal 全局快捷键没反应，查三件事：配置里有没有 `global:`，系统权限或桌面环境是否支持，快捷键是不是被其他软件占了。

## 总结

如果只是想换个好看的终端，iTerm2 也能调主题和透明度。对我来说，Ghostty 在原生窗口、默认分屏、可读配置和长输出时的体感更轻；这属于个人机器和使用方式下的感受，不是统一性能结论。

建议先用默认值跑一天，再按实际问题调整字体、主题和快捷键；分屏用顺后，再决定是否启用 Quick Terminal。也可以让 Coding Agent 根据本文生成候选配置，但写入前要先确认本机 Ghostty 版本、平台和已有配置，避免覆盖个人快捷键。


---

---

<!-- source: 实践/强模型时代，AI 编程 Skills 还有必要装吗？.md -->

## [21] 强模型时代，AI 编程 Skills 还有必要装吗？

---
title: 强模型时代，AI 编程 Skills 还有必要装吗？
description: 从 Codex、Superpowers 和 grilling 的实际使用出发，讨论强模型时代哪些 Skill 可以删除，哪些工作流仍然值得长期保留。
category: AI 编程实战
tag:
  - AI 编程
  - Codex
  - Skills
  - Superpowers
head:
  - - meta
    - name: keywords
      content: AI编程,Codex,Skills,Superpowers,grilling,AGENTS.md,Subagent,Plugin
---

前几天在知乎看到一个问题：**Codex 用上 GPT-5.6 后，Skills 还有多少必要？**

![关于 Codex 使用 GPT-5.6 后是否仍需要 Skills 的提问](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/zhihu-codex-gpt56-skills-question.png)

一条提问和我自己的使用变化不能代表行业趋势。更准确地说，我发现手里一部分开发类 Skill 的收益正在下降，所以想重新检查哪些该留、哪些该删。

我现在看到一个 Skill，会先看它到底能提供什么能力。如果没有确切作用的话，肯定是不会装的。

前两年，模型干活经常漏步骤，Skill 写得越细越让人安心。现在 GPT-5.6、Kimi K3、Claude Fable 5 等模型已经能完成不少基础动作，我也开始重新检查手里的 Skill。

> 下面我会以 Codex 作为 Coding Agent 为例来谈，其他都是类似的。

## 很多基础步骤已经不用单独教了

以前的开发类 Skill 经常写成一张操作清单：怎么读项目，怎么找调用链，改完代码跑哪些测试，提交 PR 前再检查什么。模型能力还不够稳定时，这些提醒确实有用。

现在让 Codex 修一处 Bug，只要现象、预期和验收标准比较清楚，它通常能自行阅读相关代码、沿着调用链定位问题，再完成实现和基础验证。项目结构复杂、测试入口特殊或者改动风险较高时，仍然要明确告诉它跑哪些检查，不能把验证完全交给模型猜。

长任务、审批和多 Agent 协作，Codex 本身也提供了对应能力。需要扩展任务流程或外部能力时，还可以使用 Skills、Plugins、MCP 和 Hooks。过去那种“不把每一步写满就容易跑偏”的情况少了很多。

![Claude Code PreToolUse Hook](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-runs-rm-rf-tmp-build-what-happens.svg)

一份 `SKILL.md` 如果没有项目特有的约束，也没有脚本、模板和检查项，只是在重复常规开发步骤，我通常不会留。它没有给模型增加多少新信息，却可能让一个小任务多走几道流程。

## Skill 装多了也有成本

Codex 不会在会话开始时读取所有 `SKILL.md` 的全文。它先拿到每个 Skill 的名称、描述和路径，任务匹配后才加载正文，这套机制叫渐进式披露。

按照 [Codex 的 Skills 文档](https://learn.chatgpt.com/docs/build-skills)，初始 Skill 列表最多使用模型上下文窗口的 2%；无法确定窗口大小时，上限是 8,000 个字符。超出预算后，Codex 会先缩短描述。数量继续增加，部分 Skill 可能被移出初始列表。

装到 100 个时，Agent 开工前看到的可能已经不是 100 份完整描述。

描述写得太宽，一个普通改动就可能命中好几份 Skill。规则发生冲突时，Codex 还要判断当前该执行哪套流程。再混进几份长期没有维护的说明，任务跑偏后很难马上找到原因。

上下文窗口变大也没有消除这个问题。旧对话、工具说明和 Skill 描述都能放进去，但项目真正重要的约束往往只有几句。内容越杂，关键要求越容易被淹没。

![上下文为什么会失效](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/why-does-the-following-content-fail.png)

Skill 和浏览器书签挺像。刚开始看到什么都想存，总觉得以后用得上。半年后回头一看，常用的还是那几个。

从 Skill 出来到现在，我经常使用、愿意长期维护的不到 20 个。比如写作时常用的 [draw.io 绘图 Skill](https://mp.weixin.qq.com/s/rAKCSFHB407v6fe35ix0rg)，它能固定图表样式，也能避开我反复遇到的排版问题。这类 Skill 沉淀的是个人偏好和具体经验，模型临场发挥很难一直保持同样的结果。

## 规则应该放在哪

很多 Skill 越写越大，是因为大家把所有规则都往里面塞。我现在会按规则的作用范围来分：

- 每轮任务都要遵守的项目约定，放进 `AGENTS.md` 或项目规则文件。
- 只在特定任务中使用的流程，写成 Skill。
- 耗时较长、会制造大量中间信息的支线调查，交给 Subagent。
- 需要把 Skills、Hooks、MCP 和连接器统一分发给团队，再打包成 Plugin。
- 漏一次就可能出问题的机械约束，交给 Hook、CI、linter 或测试。

规则文件管这个项目一直怎么做，Skill 管遇到某类任务时怎么做。两者混在一起，最后往往会得到一个很长、什么都想管、又很难维护的 `SKILL.md`。

Skill 可以携带脚本、参考资料和模板，在命中任务后按需加载。团队需要统一安装和分发时，再用 Plugin 把这些能力打包起来。

![渐进式披露（三层模型）](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skills-progressive-disclosure-three-layer-model.png)

如果想系统了解 Skill 和 Prompt、MCP、Function Calling 的分工，可以看 [Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html)。这篇文章只讨论怎么选和怎么删，不重复展开技术实现。

## 为什么我很少再用 Superpowers

像 [Superpowers](https://github.com/obra/superpowers) 这类覆盖完整开发流程的 Skills 套件，我现在用得少了。

我把这个问题丢到群里聊，大家的反馈也很接近：**Superpowers 容易让小任务背上过重的流程；`grilling` 虽然会连续追问，但需求确实能收得更清楚。**

![群友讨论 Superpowers 流程过重以及 Grilling 减少返工](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/group-chat-superpowers-grilling-feedback.png)

Superpowers 提供的是一套完整的软件开发方法：先通过 brainstorming 澄清需求，再用 writing-plans 拆任务，按 test-driven-development 写测试和实现，通过 Git worktree 隔离开发，交给 Subagent 分段执行，最后做代码审查和完成前验证。

复杂项目、陌生代码库和高风险改动仍然适合这套流程。

如果只是改一处校验逻辑或者补一个很小的测试，上来就走完“需求澄清 → 设计 → 计划 → 执行 → 审查 → 验证”，时间很容易被流程本身吃掉。流程越完整，越考验启用时机；任务不够复杂时，它会从保护变成负担。

现在的 Codex 能在执行过程中调整步骤，也会在缺少关键信息时请求确认。很多小任务只需要补几条项目约束，没有必要每次都套上一整本操作手册。

第三方 Skill 还有安全风险。`SKILL.md` 本身就是给 Agent 的指令，里面如果藏了危险命令、异常脚本或过宽的权限要求，Agent 可能真的会照着做。安装前至少看一遍 `SKILL.md`、`scripts/` 和 `references/`；套件越大，越要先弄清楚它会让 Agent 做什么。

## 我更喜欢 mattpocock/skills 这种轻量组合

Superpowers 用一套完整方法覆盖开发过程，[mattpocock/skills](https://github.com/mattpocock/skills) 更像一个可以拆开使用的工具箱。

这个仓库里的 Skill 被设计成较小、容易修改、可以组合的模块。需求还没想清楚，可以用 `grilling` 追问；Bug 很难定位，再启用 `diagnosing-bugs`；需要严格走红绿重构时，单独使用 `tdd`；准备合并代码，再让 `code-review` 检查。它们不会默认要求每个任务都走完同一条流程。

这套拆法很适合现在的强模型。Codex 已经能完成的步骤，不需要再教一遍；哪个环节反复出错，就只补哪一块。任务变复杂时，再把几个 Skill 组合起来。

![群友讨论轻量 Skills 与 Superpowers 的使用体验](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/group-chat-lightweight-skills-feedback.png)

这里面我尤其喜欢 [`grilling`](https://github.com/mattpocock/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/blob/main/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/productivity/grilling/SKILL.md)。

它的规则很短：动手前持续追问，把计划、决策和依赖关系问清楚；一次只问一个问题，等用户回答后再继续；能从环境中查到的事实自己查，需要取舍的决定再交给用户。

## 哪些 Skill 还值得留

我现在会优先保留三类 Skill。

第一类是模型很难凭空猜到的个人偏好和固定产物，例如文章风格、图表规范、公司内部模板和特定代码库的发布流程。有了这些约束，每次交付才能尽量保持同一套标准。

第二类是带有专业判断、脚本或参考资料的任务。安全审查、复杂文档处理、特定框架迁移和生产检查，只靠一句 Prompt 很难覆盖所有细节。Skill 可以把检查项、工具脚本和证据来源放在一起，用到时再加载。

第三类是能减少方向错误的流程。`grilling` 就属于这一类：它没有替 Codex 写代码，只是把开工前的需求确认固定下来。模型执行得越快，这类“先确认方向”的流程越值得保留。

## 我用 grilling 澄清了一次真实需求

这个案例来自我的开源项目 [《SpringAI 智能面试平台》（2.0 版本已开源）](https://javaguide.cn/专栏/interview-guide.html)。当时我准备把模拟面试和知识库打通，给 `grilling` 的任务也很直接：帮我把这件事想清楚。

现有实现比我预想的更接近“打通”：知识库面试和普通模拟面试都在使用 `InterviewSession`，作答、评估和部分前端页面也已经复用。这次没有必要先改底层，得先确定首期产品范围。

![使用 Grilling 确认模拟面试与知识库的打通方案](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/grilling-springai-interview-platform-case.png)

它问的第一个问题，是首期做“完全基于用户资料的定向面试”，还是让用户照常选择 Java、系统设计等 Skill，知识库只负责补充上下文。

它建议先做前者。现有的题库生成、分类、难度、固定追问和评分规则都更贴近这条链路，只要统一入口和历史记录就能跑通。后一种方案还会引出 Skill 题目与知识库题目的混合比例、实时 RAG、来源冲突、评估依据和题目去重，改造范围会大很多。

我确认首期目标后，它才继续问：一场面试只选一个知识库，还是允许组合多个知识库？当前请求、会话字段和题库筛选都只有一个 `knowledgeBaseId`，所以它建议首期先限制单库，等流程稳定后再考虑多库关联。

接着是入口。知识库面试已经有独立页面，普通模拟面试从“模拟面试中心”进入。最后确定双入口共存，但共用同一套配置组件和创建接口，避免维护两套交互逻辑。

代码还没开始改，产品范围、数据模型和入口复用方式已经定下来了。

我愿意保留 `grilling`，是因为模型写代码已经够快了，返工多半发生在开工太早的时候：需求范围没定，异常处理没聊，用户场景和技术取舍还很含糊。Agent 按自己的理解一口气做完，最后可能还得推倒重来。

**模型越强，执行越快，走错方向的代价也会跟着变大。**

`grilling` 没有教模型怎么写代码，它只是把“动手前先问清楚”固定成一套可重复执行的流程。强模型不会自动消除这种流程的价值。

## 我的 Skill 删减标准

现在每装一个 Skill，我都会多问几句：

- 这件事模型原本就会做吗？
- 没有它时，我是否反复在同一个地方翻车？
- 它有没有沉淀脚本、模板、专业资料或个人偏好？
- 规则过期之后，我能否及时发现并删掉？

只会提醒“先读项目、再写代码、最后跑测试”的 Skill，我现在基本直接删。项目里真有特殊要求，写进 `AGENTS.md` 会更合适；测试、格式化和安全限制能够机械执行的部分，则交给 CI、Hook 或 linter。

同一个地方连续翻车，才值得单独写一个 Skill，尤其是出错代价不低的任务。里面只留关键判断和验证动作，够解决问题就停，不顺手扩成一套大而全的工作流。

想了解目前有哪些现成 Skill，以及它们分别适合什么任务，可以继续看 [AI 编程 Skills 选型清单](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)。关于 Codex 里的 `AGENTS.md`、权限、MCP、Skills 和 Scheduled Tasks 分工，则可以参考 [OpenAI Codex 最佳实践指南](https://javaguide.cn/AI编程/实践/codex-best-practices.html)。

这篇文章题目里虽然写了“还有必要吗”，但我没准备把 Skill 全删掉。我只是不会再看到一个就装一个。

现在遇到新 Skill，我会先不用它跑一次。能跑好，就不装；如果同一个问题反复出现，再把那一小段流程留下来。这样清理完，列表可能短了不少，但每个 Skill 为什么还在，我心里有数。


---

---

<!-- source: 项目/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南.md -->

## [22] 在 IDEA 中使用 Claude Code 和 Codex：CC GUI 上手指南

---
title: 在 IDEA 中使用 Claude Code 和 Codex：CC GUI 上手指南
description: CC GUI 是一款开源 JetBrains 插件，为 Claude Code 和 OpenAI Codex 提供可视化界面。本文以 v0.4.7 为快照，介绍安装、认证、Diff、Agent 与 MCP 等常用能力及其边界。
category: AI 编程实战
head:
  - - meta
    - name: keywords
      content: CC GUI,Claude Code,Codex,IDEA插件,JetBrains,AI编程,Agent,MCP,可视化编程
---

大家好，我是小 G。前面分享过 [IDEA 搭配 Qoder 插件的实战](https://mp.weixin.qq.com/s/vz5A7fQh8WxqVBHscqHzQA)，这篇文章再看一个 JetBrains 插件：**CC GUI**。

> **版本说明**：下文功能和截图按 CC GUI v0.4.7（2026-07-24）整理。插件迭代较快，安装和认证方式以项目 README 与当前界面为准。

## CC GUI 是什么

**CC GUI**（原名 Claude Code GUI）是一个采用 MIT 协议的开源 JetBrains 插件，为 Claude Code 和 OpenAI Codex 提供 GUI 界面。

![CC GUI Github 项目界面](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/cc-gui-github-project.png)

项目地址：[zhukunpenglinyutong/jetbrains-cc-gui](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui)。

如果你看过我之前的文章，应该对 **ACP（Agent Client Protocol）**协议比较熟悉了。它为 Agent 与 IDE 之间定义了一套交互接口；实际能否对接，还取决于双方实现的协议版本、能力和认证方式。

JetBrains 内置 Agent 集成、ACP Registry 中的 Agent 和用户手动配置的 ACP Agent 是不同层次的能力，不能统称为“官方插件”。可用 Agent 也会随 IDE 版本、插件和账户变化。

CC GUI 和 ACP 是两种不同的路线：

- **JetBrains/ACP 路线**：使用 IDE 内置集成、Registry Agent 或自定义 ACP Agent，重点是复用 JetBrains 的 AI Chat、Diff 和上下文能力；功能取决于具体 Agent 实现。
- **CC GUI 路线**：使用独立社区插件为 Claude Code 和 Codex 增加会话管理、图片输入、Agent、MCP 等 GUI 能力；支持范围以 CC GUI 当前版本为准。

两者不冲突，可以按偏好选择。

以 v0.4.7 为快照，本文使用到的能力包括：

- **双引擎支持**：同时接入 Claude Code 和 OpenAI Codex，供应商设置中按需切换。
- **可视化对话**：支持 `@file` 引用、图片发送、对话回退，比 CLI 直观得多。
- **Agent + MCP**：内置 Agent 系统和 Slash 命令（如 [/loop 调度](https://mp.weixin.qq.com/s/apkuuxHmC1c6bR0kWhgmUA)、[/simplify 代码审查](https://mp.weixin.qq.com/s/Np3oaBmdJAE319wuT7zHBw)），支持 MCP 扩展。
- **Diff 对比**：代码修改直接在 IDEA 内展示 Diff，支持文件导航和代码跳转。
- **会话管理**：历史记录、搜索、收藏、导出。

## 安装与配置

### 第一步：安装插件和 SDK

打开 IDEA，进入 **Settings → Plugins**（快捷键 `Cmd + ,`），搜索 **CC GUI** 安装即可。

![IDEA 插件 CC GUI](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/idea-plugin-cc-gui.png)

安装完成之后，你可以在 IDEA 右侧工具栏找到 CC GUI 入口，点击图标即可打开。

![IDEA CC GUI 入口](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/idea-cc-gui-entry.png)

首次使用会提示安装 Claude Code/Codex SDK。这是 Agent 运行的基础，点击后按界面完成安装。耗时取决于网络和本机环境。

![成功安装 Claude Code/Codex SDK](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/sdk-installed-success.png)

**遇到黑屏？** 部分用户在 IDEA 2026.1 上打开 CC GUI 面板时会出现黑屏。

可以先尝试清除 IDE 内置浏览器缓存。若仍无效，项目 Issue 中有人通过 Help → Edit Custom VM Options 添加以下参数绕过：

```bash
-Dide.browser.jcef.out-of-process.enabled=false
-Dide.browser.jcef.gpu.disable=true
```

添加后重启 IDEA 再验证。这个参数只是在部分 JCEF/显卡环境下有效的 workaround，关联 Issue 截至 2026-07-24 仍未关闭，不应把它当成确定修复；参数也可能影响 JCEF 隔离或硬件加速。详见：<https://github.com/zhukunpenglinyutong/jetbrains-cc-gui/issues/813>。

### 第二步：配置模型供应商

点击供应商设置，按插件当前支持的认证方式配置：

- **Claude.ai OAuth 登录**：Claude 订阅通过 Claude.ai 账户授权使用 Claude Code。
- **Anthropic API Key**：API Key 来自 Anthropic Console，按 API 用量单独计费；Claude.ai 订阅不会自动提供 API Key。
- **复用 Claude Code CLI 登录态**：如果插件当前版本支持，可以复用既有 Claude.ai OAuth 登录状态；这不等于从 `settings.json` 读取认证信息。
- **导入本地 Provider 配置**：`settings.json` 是配置载体，可能包含模型、端点或 API 相关设置。导入前要确认插件实际读取的字段和密钥存储方式。
- **导入 cc-switch 配置**：cc-switch 是社区常用的 Claude Code 供应商管理工具，CC GUI 兼容其配置，导入即可直接使用。
- **第三方代理端点**：可以配置自定义端点，但兼容性、数据处理和密钥安全由代理服务决定。

Claude Code 的认证方式可参考[官方认证文档](https://code.claude.com/docs/en/authentication)。Codex 官方同时支持 ChatGPT 登录和 API Key，两者的套餐与计费不同；CC GUI 是否支持对应登录流程，以当前插件版本为准，详见 [Codex 认证文档](https://developers.openai.com/codex/auth)。

本文截图使用导入 cc-switch 配置的方式。

![直接导入 cc-switch 配置](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/cc-switch-config-import.png)

### 第三步：开始使用

配置完成后，在右侧面板直接开始对话。建议先试试简单的任务，比如“分析一下当前项目的目录结构”，感受一下上下文感知能力。

这里我们以一个日常开发中的高频场景为例：**审查已有代码是否符合规范，并批量修复问题**。这种事手动做极其枯燥——打开文件、逐行对照规范、发现问题、手动改、下一个文件……

CC GUI 支持 **Skill（斜杠命令）**，可以把特定的审查流程整理成可复用说明。比如我配置了一个 `java-coding-standards` Skill，其中包含 Java 与 Spring Boot 的项目审查规则。

这里我们直接以 [AI 智能面试平台](https://javaguide.cn/专栏/interview-guide.html)项目为例，用的时候，直接在对话框输入：

```
/java-coding-standards 检查一下 @infrastructure 下的代码
```

`/java-coding-standards` 加载审查规则，`@infrastructure` 指定检查范围。在这次演示中，Agent 读取了目录下的 14 个 Java 文件，并输出一份结构化报告：

| 严重度 | 问题                                                 | 涉及文件                      | 数量 |
| ------ | ---------------------------------------------------- | ----------------------------- | ---- |
| 高     | 日志 `log.error("xxx: {}", e.getMessage())` 丢失堆栈 | FileHashService               | 3 处 |
| 高     | BusinessException 缺少 ErrorCode                     | RedisService                  | 1 处 |
| 中     | 内联全限定类名（`java.util.function.Function`）      | InterviewMapper、ResumeMapper | 7 处 |
| 中     | 返回 `Map<String, Object>` 而非专用 DTO              | InterviewMapper               | 2 处 |
| 低     | 字体资源未用 try-with-resources                      | PdfExportService              | 1 处 |
| 低     | DateTimeFormatter 每次调用重复创建                   | FileStorageService            | 1 处 |

![java-coding-standards 结构化的审查报告](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/java-coding-standards-structured-review-report.png)

拿到报告后，可以让 AI 逐文件生成候选修复，并在 Diff 面板逐项审查改动和原因。

这次演示涉及 9 个文件、20 多处改动，从审查到生成修复和完成一次编译验证用了不到五分钟。这个耗时只代表本次样例；代码规模、模型、缓存状态和验收要求不同，结果也会不同。

**Skill 的价值**：它把“审查什么、按什么步骤审”整理成可复用入口，减少每次重复说明。它可以提高检查口径的一致性，但不能保证不同模型、不同上下文下的结果完全一致；团队标准仍应落在可版本化的规则、静态检查和 Review 流程里。

好用的 Vibe Coding Skills 推荐以及 Skills 常见问题解答，可以阅读笔者写的这两篇文章：

1. [AI 编程 Skills 选型清单：需求澄清、TDD、代码审查与 UI 设计](https://javaguide.cn/AI编程/实践/programmer-essential-skills.html)
2. [Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://mp.weixin.qq.com/s/5iaTBH12VTH55jYwo4wmwA)

## CC GUI 内置功能

CC GUI 还内置了使用统计功能，可以清晰看到 Token 消耗、费用统计和使用趋势分析。

![CC GUI 使用统计](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/cc-gui-usage-stats.png)

还支持 Commit AI、自定义智能体、维护提示词库、添加 MCP 服务器等功能。

![CC GUI Commit AI](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/cc-gui-commit-ai.png)

并且，你还可以看到历史消息，支持搜索和删除：

![Claude Code 历史消息](https://oss.javaguide.cn/github/javaguide/ai/在 IDEA 中使用 Claude Code 和 Codex-CC GUI 上手指南/claude-code-history.png)

## CC GUI 和 Qoder 怎么选？

这两款插件定位不同，简单对比一下：

| 维度          | CC GUI                                  | Qoder                 |
| ------------- | --------------------------------------- | --------------------- |
| **定位**      | Claude Code / Codex 的 GUI 壳           | 独立的 AI 编程 Agent  |
| **开源**      | MIT 协议，完全开源                      | 闭源，阿里出品        |
| **模型**      | Claude Code + Codex，支持范围以版本为准 | 内置及当前可选模型    |
| **上下文**    | `@file` 引用 + 图片输入                 | `@database` + `@file` |
| **适合场景**  | 希望在 JetBrains 中使用现有 CLI 工作流  | 希望使用一体化 Agent  |
| **Java 优化** | 通用                                    | 对 Java 生态优化较好  |

**我的建议：**

- **已有 Claude Code 或 Codex 工作流** → 可以评估 CC GUI，但先确认插件支持的认证方式和功能映射；GUI 不保证完整继承 CLI 的全部能力
- **想要开箱即用、不想折腾 API 配置** → 选 Qoder，注册即可使用
- **两个都装也行** → 它们不冲突，可以按场景切换使用

## 总结

CC GUI 的核心价值是**补齐 JetBrains 用户的可视化工作流**。它把原来分散在终端、编辑器、截图工具、文件管理器里的操作，尽量压回到 IDE 内一个地方完成。

如果你主要使用 JetBrains，又希望在 IDE 中管理 Claude Code 或 Codex 会话，可以在测试项目里试用 CC GUI，再根据认证、功能兼容性和团队安全要求决定是否进入日常流程。


---

---

<!-- source: 原则/Claude Code Hooks 详解-生命周期钩子与自动化工作流.md -->

## [23] Claude Code Hooks 详解：生命周期钩子与自动化工作流

---
title: Claude Code Hooks 详解：生命周期钩子与自动化工作流
description: 从 Claude Code 生命周期出发，讲清 Hooks 的触发时机、handler 类型、输入输出、安全拦截、自动格式化和通知提醒，帮助你用 Hooks 把提示词里的软约束变成可审计、可复用的自动化动作。
category: AI 编程原理
tag:
  - Claude Code
  - Hooks
  - AI Agent
  - AI 编程
head:
  - - meta
    - name: keywords
      content: Claude Code,Hooks,生命周期钩子,AI编程,自动化工作流,PreToolUse,PostToolUse,UserPromptSubmit,SessionStart,权限控制
---

用 Claude Code 写代码到一定阶段之后，很多人会遇到同一个问题。

问题通常不在模型能力上。

恰恰相反，是它太能干了。它能改文件、跑命令、查项目结构、生成脚本，也能一口气处理一串很长的任务。于是你会很自然地开始把更多动作交给它。

然后问题就来了。

改完文件，它这次会不会忘了格式化？

准备跑 Bash 命令时，它会不会不小心带上 `rm -rf`？

它会不会顺手改到 `.env`、`.git/` 或生产配置？

它卡在权限弹窗时，我能不能不用一直盯着终端？

上下文压缩之后，那些项目规矩能不能自动补回来？

这些问题有个共同点，它们都不适合只靠提示词解决。

提示词解决的是“尽量记得”。Hooks 解决的是“到了这个时刻，就一定执行”。

这两者的差别，可以先用一张图概括：

![Prompt 提醒依赖上下文和模型记忆，Hooks 卡点通过自动触发、脚本审计和风险阻断保证动作发生](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/hooks-vs-prompts-guarantee.webp)

我喜欢把 Hooks 理解成 Claude Code 工作流里的固定卡点：在会话开始、用户提交 Prompt、工具调用前、工具调用后、任务停止前、上下文压缩前后这些生命周期节点上，按配置执行你写好的动作。

这篇文章我不太想写太多，重点帮你搞清楚这些问题：Hooks 到底是什么、解决了什么问题；什么场景改用 Hooks；Hooks 和 Skills 如何选择？

## Hooks 到底是什么

官方文档对 Hooks 的定义是：**Hooks 是用户定义的 shell commands、HTTP endpoints 或 LLM prompts，会在 Claude Code 生命周期的特定点自动执行。**

这句话你只需要抓住两个词就行：**生命周期节点和自动执行** 。

前者决定 Hook 什么时候触发，后者决定它不是靠 Claude 临场想起来，而是按你写好的命令或脚本跑。尤其是 `command` hook，它不依赖模型临场判断，所以更稳定，也更容易审计。

如果把这些触发点摊开，Hooks 更像分布在 Claude Code 生命周期里的固定卡点：

![Claude Code Hooks 围绕 SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、PermissionRequest 和 PreCompact 等生命周期节点自动执行](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-code-hooks-lifecycle-map.webp)

Hook handler 主要有五类：

| 类型       | 做什么                               | 适合场景                               |
| ---------- | ------------------------------------ | -------------------------------------- |
| `command`  | 执行 shell command                   | 格式化、日志、安全拦截、通知           |
| `http`     | 把事件 JSON POST 到一个 URL          | 团队审计服务、远程通知、集中化策略     |
| `mcp_tool` | 调用已连接 MCP server 上的工具       | 复用现有 MCP 能力                      |
| `prompt`   | 用一次模型判断返回 yes/no 风格 JSON  | 轻量判断，比如 Stop 前检查任务是否完成 |
| `agent`    | 启动带工具访问能力的 subagent 做验证 | 需要读文件、搜代码、跑命令的验证       |

日常项目里，先把 `command` 当默认选项就行。规则能写成脚本，就别急着让模型判断；脚本更好测，也更容易 review。

`agent` hooks 目前在官方文档里仍标注为 experimental。它能做更复杂的验证，但调试成本也会跟着上来。

我会更倾向于先用 `command`，只有确实需要模型读代码、跑测试、综合判断时，再考虑 `prompt` 或 `agent`。

把这五类 handler 放到一起看，选择顺序会更清楚：

![Hook handler 包括 command、http、mcp_tool、prompt 和 agent，优先使用稳定可审计的 command 脚本](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/hook-handler-types.webp)

## Hooks 到底解决了什么问题

Claude Code 确实已经很强，但它不一定每次都在正确时机做同一件事。

比如格式化。

你可以在 `CLAUDE.md` 里写“改完代码请运行 Prettier”。大多数时候它会照做。但上下文长了、任务绕了几圈、中途又插入了新要求，它仍然可能漏掉。

如果项目规则还没整理清楚，可以先看 [CLAUDE.md 最佳实践](https://javaguide.cn/AI编程/实践/claude-md-best-practices.html)。但要注意，`CLAUDE.md` 更像软约束；能被脚本、Hook、Linter 或 CI 机械化验证的规则，最好不要只停留在自然语言提醒里。

再比如敏感文件保护。

你当然可以告诉 Claude Code “不要改 `.env`”。但这条规则一旦被埋在几十轮对话里，或者某个任务看起来必须改配置，模型就可能把它当成普通建议处理。

这就是 Hooks 该出场的地方。

格式化、危险命令检查、权限通知、压缩后补规则，这些动作不应该靠 Claude 每次自己想起来。

放到工程里看，它和 pre-commit、CI、lint-staged、CODEOWNERS、branch protection 是一类东西：把必须发生的动作从记忆里拿出来，放进流程里。它们存在的原因很简单，再聪明的人也会累、会忘、会手滑。

Claude Code 也是一样。

AI 编程越深入，问题越会从“模型能不能写代码”，转向“谁来保证那些必须发生的动作真的发生”。

Hooks 就是这套保证机制的一部分。

## Hooks 最小配置

Hook 配在 Claude Code 的 settings 文件里。常用位置有三个：

| 位置                          | 作用范围             | 适合放什么                   |
| ----------------------------- | -------------------- | ---------------------------- |
| `~/.claude/settings.json`     | 当前用户所有项目     | 个人通知、个人习惯           |
| `.claude/settings.json`       | 当前项目，可提交仓库 | 团队共享规则、项目级安全限制 |
| `.claude/settings.local.json` | 当前项目本机私有     | 不适合提交的个人配置         |

官方还支持 managed policy、插件的 `hooks/hooks.json`，以及 skill 或 agent frontmatter 里的 hooks。

日常写项目，先记住上面三个就够了。

一个最小配置长这样：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

拆开看，其实就是三层：

- `PostToolUse` 是事件名，表示工具调用成功之后触发。
- `matcher` 是过滤条件。这里写 `Edit|Write`，只在 Claude Code 使用 `Edit` 或 `Write` 改文件之后触发。官方也提到，在较新的 Claude Code 版本里，工具名 matcher 可以用 `|` 或 `,` 分隔列表。
- `hooks` 数组里是真正执行的 handler。这里是一个 `command`，会从 stdin 的 JSON 里取出刚编辑的文件路径，再交给 Prettier。

示例为了短，把命令直接写进了 JSON。实际项目里，只要命令开始变长，或者要引用项目里的脚本，我更建议写成独立文件，再用 `${CLAUDE_PROJECT_DIR}` 指过去：

```json
{
  "type": "command",
  "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/format-after-edit.sh",
  "args": []
}
```

这里的 `args` 不是摆设。官方文档建议，引用项目路径、插件路径这类占位符时优先用 exec form；每个 `args` 元素都会作为一个独立参数传给脚本，不再经过 shell 分词。路径里有空格、括号或特殊字符时，这比自己在一长串 shell command 里补引号稳得多。

如果你省略 `matcher`、写空字符串，或者写成 `.*` 这样的全匹配正则，这个 hook group 会在对应事件的每一次发生时触发。

这听起来省事，但通常不是好事。

格式化 hook 写得太宽，可能每次工具调用后都跑 formatter。权限 hook 写得太宽，可能每个授权弹窗都被自动处理。安全拦截写得太宽，调试起来也很烦。

Hooks 的第一原则就是收窄。

能写 `Edit|Write`，就别写全匹配。

能只拦 `Bash` 里的危险命令，就别让所有工具都进同一个脚本。

## Hook 输入输出怎么工作

Hook 触发时，Claude Code 会把事件上下文作为 JSON 传给 handler。

如果是 `command` hook，这段 JSON 走 stdin。

如果是 `http` hook，这段 JSON 会作为 POST body 发给服务端。

所有事件都会有一些公共字段，比如：

| 字段              | 含义                       |
| ----------------- | -------------------------- |
| `session_id`      | 当前会话 ID                |
| `transcript_path` | 会话 JSONL 文件路径        |
| `cwd`             | 触发 hook 时的工作目录     |
| `permission_mode` | 当前权限模式，部分事件才有 |
| `hook_event_name` | 触发的事件名               |

工具相关事件还会带 `tool_name` 和 `tool_input`。

比如 Claude Code 准备执行 `npm test` 时，`PreToolUse` 可能收到这样的输入：

```json
{
  "session_id": "abc123",
  "cwd": "/Users/example/project",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

所以 Hook 脚本里很常见的一段就是：

```bash
INPUT="$(cat)"
TOOL_NAME="$(echo "$INPUT" | jq -r '.tool_name // empty')"
COMMAND="$(echo "$INPUT" | jq -r '.tool_input.command // empty')"
```

这里建议用 `jq` 解析 JSON，不要自己用 grep 拼字段。

这里别按普通脚本的习惯乱写。

`stdout` 在 `exit 0` 时可能会被 Claude Code 当成结构化输出解析，所以不要往里面塞调试日志。错误原因写 `stderr`。想阻断，大多数事件用 `exit 2`；普通非 0 错误很多时候只是 hook 报错，流程还会继续。

最容易踩的坑是 `exit 1`。

在普通 shell 脚本里，`exit 1` 经常表示失败。但在 Claude Code Hooks 里，如果你想强制拦住一个动作，大多数事件要用 `exit 2`。官方 Reference 明确说，`exit 1` 对多数 hook event 是非阻断错误，流程会继续。

再说 JSON 输出。

如果你想更精细地控制，比如 `PreToolUse` 里返回 `allow`、`deny`、`ask`、`defer`，就要 `exit 0`，然后 stdout 只输出一个 JSON 对象。

例如拒绝一次工具调用：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Database writes are not allowed"
  }
}
```

如果是 `PermissionRequest`，结构又不一样，重点在 `decision.behavior`：

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow"
    }
  }
}
```

别把 stdout 当日志打。

如果你要输出 JSON，stdout 就只放 JSON。调试信息写 stderr，或者写到日志文件。否则很容易遇到 `JSON validation failed`，然后盯着配置怀疑人生。

还有一点，JSON 只在 `exit 0` 时处理。如果脚本 `exit 2`，stdout 里的 JSON 会被忽略，Claude Code 会使用 stderr 作为反馈。

把输入、输出和返回码放在一起看，大概是这条决策链：

![Hook 从事件 JSON 获取输入，根据 stdout JSON、stderr 日志以及 exit 0、exit 1、exit 2 决定继续、报错或阻断](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/hook-input-output-decision.webp)

同一个事件下，如果有多个 Hook 同时命中，Claude Code 会让它们都跑完再合并结果。一个 Hook 返回 deny，不会阻止旁边那个 Hook 写日志、发 HTTP 请求或改文件；`PreToolUse` 里多个决策合并时，会采用更严格的结果。

所以，只要 Hook 会写日志、发请求、改文件，就应该自己判断要不要执行。不要假设另一个安全 Hook 会先跑、会先拦住风险。

改工具输入也一样要克制。官方文档特别提醒过，**如果多个 Hook 都尝试改同一个工具输入，最后生效的是最后完成的那个；但 Hook 是并行执行的，谁最后完成并不稳定。**

## 常用生命周期事件怎么理解

官方文档里列出的事件不少，从会话、工具、权限、子 agent、任务、配置变化、工作树，到 MCP elicitation 都有。

事件名很多，但刚开始真正常用的就几类：会话开始、用户提交 Prompt、工具执行前、工具执行后、权限弹窗、停止响应、上下文压缩。

| 事件                | 触发时机                          | 适合做什么                             |
| ------------------- | --------------------------------- | -------------------------------------- |
| `SessionStart`      | 会话开始或恢复时                  | 注入动态上下文、加载环境、压缩后补规则 |
| `UserPromptSubmit`  | 用户提交 Prompt 后，Claude 处理前 | Prompt 审计、轻量拦截、补动态上下文    |
| `PreToolUse`        | 工具调用执行前                    | 拦危险命令、保护敏感文件、修改工具输入 |
| `PermissionRequest` | 权限确认框出现时                  | 审计权限，或非常窄地自动批准           |
| `PostToolUse`       | 工具调用成功后                    | 格式化、记录日志、lint、补充上下文     |
| `Notification`      | Claude Code 发送通知时            | 桌面通知、手机推送                     |
| `Stop`              | Claude 完成一轮响应时             | 完成通知、质量门禁、提醒继续处理       |
| `PreCompact`        | 上下文压缩前                      | 备份状态、阻止不合适的压缩             |
| `PostCompact`       | 上下文压缩后                      | 记录摘要、同步外部状态                 |

再往下，是一批进阶事件。知道有它们就行，用到时查官方 Reference或者直接问 AI。

| 类别              | 事件                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------- |
| 会话和配置        | `Setup`、`InstructionsLoaded`、`ConfigChange`、`CwdChanged`、`FileChanged`、`SessionEnd` |
| 提示词和展示      | `UserPromptExpansion`、`MessageDisplay`、`TeammateIdle`                                  |
| 工具和权限        | `PermissionDenied`、`PostToolUseFailure`、`PostToolBatch`                                |
| 子 agent 和任务   | `SubagentStart`、`SubagentStop`、`TaskCreated`、`TaskCompleted`                          |
| 工作树和 MCP 表单 | `WorktreeCreate`、`WorktreeRemove`、`Elicitation`、`ElicitationResult`                   |
| 停止补充          | `StopFailure`                                                                            |

几个事件需要单独提醒。

`PreToolUse` 是安全拦截的核心，因为它发生在工具真正执行之前。想拦 Bash 命令，想保护 `.env`，想阻止写生产配置，都优先放这里。

`PostToolUse` 发生在工具成功之后，所以它适合收尾，不适合做第一道安全门。比如格式化可以放这里，但敏感文件保护不能只靠它，因为文件已经被改了。它仍然可以用 JSON 给 Claude 提供反馈，或者替换工具输出，只是无法撤销刚刚发生的工具调用。

`PermissionRequest` 可以自动批准或拒绝权限请求。它的触发前提是 Claude Code 准备展示权限对话框，所以脚本化、无头或不同 permission mode 下要按实际会不会出现权限请求来判断。自动化权限最好格外谨慎，别用它全局放行。

这三个事件最容易混，可以先按触发时机和用途这样记：

![PreToolUse 适合在工具执行前拦截风险，PostToolUse 适合工具成功后格式化和记录日志，PermissionRequest 适合权限弹窗时做审计或窄范围批准](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/pretooluse-posttooluse-permission.webp)

`Stop` 不等于“任务完成”，它只是 Claude 准备结束本轮响应时触发。如果你用 Stop hook 做质量门禁，要防止循环。官方提供了 `stop_hook_active` 一类字段帮助判断当前是否已经由 Stop hook 继续过。

`PreCompact` 可以阻止压缩，`PostCompact` 不能改变已经完成的压缩结果。压缩后重新注入规则，更常见的做法是用 `SessionStart` 搭配 `compact` matcher。上下文压缩和规则补回属于 Context Engineering 的一部分，想继续展开可以看 [上下文工程实战指南](https://javaguide.cn/ai/agent/context-engineering.html)。

## 三个最小可用示例

真要上手，我建议大家从三个例子开始：一个只负责通知，一个负责改完文件后的收尾，一个放在工具执行前做拦截。

它们刚好覆盖低风险、自动化收益和安全底线三种场景。

### Notification，Claude 需要你时弹个通知

这个适合第一个配，因为它几乎不碰代码，风险最低。

macOS 上可以写到 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "permission_prompt",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

这里 `matcher` 写 `permission_prompt`，表示只有 Claude 需要你批准工具调用时才通知。如果想所有通知都触发，可以省略 matcher 或写空字符串。官方列出的 Notification matcher 还包括 `idle_prompt`、`auth_success`、`elicitation_dialog` 等。

如果 macOS 没弹通知，先在终端手动跑：

```bash
osascript -e 'display notification "test"'
```

然后去系统设置里给 Script Editor 打开通知权限。这个坑很常见，Hook 可能已经触发，只是系统没让通知显示。

### PostToolUse，改完文件自动格式化

前端项目里，最常见的是改完 `Edit` 或 `Write` 后跑 Prettier：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

这段配置有三个关键信息。

`matcher` 只匹配 `Edit|Write`，所以读文件、跑 Bash、调用 MCP 工具都不会触发格式化。

`command` 从 stdin JSON 里拿 `.tool_input.file_path`，再交给 `npx prettier --write`。

这个 Hook 在 `PostToolUse` 上，所以它是“工具执行后收尾”。formatter 失败时，你可以让错误暴露出来，也可以改成脚本，按文件后缀选择不同 formatter。

比如更稳一点的脚本：

```bash
#!/usr/bin/env bash
set -euo pipefail

file="$(jq -r '.tool_input.file_path // empty')"

case "$file" in
  *.js|*.jsx|*.ts|*.tsx|*.json|*.md)
    npx prettier --write "$file"
    ;;
esac
```

Hook 没有魔法。如果你是 Java 项目，应该换成 `spotlessApply`、`google-java-format` 或项目里已有的格式化命令。如果你是 Python 项目，可能是 `ruff format`。先贴着项目现有工具走，不要为了写 Hook 新造一套格式化体系。

### PreToolUse，阻止危险命令和敏感文件

真正的安全拦截要放在 `PreToolUse`。

先写一个脚本，比如 `.claude/hooks/guard.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
tool="$(jq -r '.tool_name // empty' <<<"$input")"
command="$(jq -r '.tool_input.command // empty' <<<"$input")"
file="$(jq -r '.tool_input.file_path // empty' <<<"$input")"

if [[ "$tool" == "Bash" ]] && [[ "$command" =~ rm[[:space:]]+-rf|chmod[[:space:]]+-R[[:space:]]+777 ]]; then
  echo "Blocked risky shell command: $command" >&2
  exit 2
fi

if [[ "$tool" == "Edit" || "$tool" == "Write" ]]; then
  case "$file" in
    *.env|*.env.*|*/.env|*/.git/*|*id_rsa*|*id_ed25519*)
      echo "Blocked sensitive file edit: $file" >&2
      exit 2
      ;;
  esac
fi

exit 0
```

给它执行权限：

```bash
chmod +x .claude/hooks/guard.sh
```

再挂到项目级 `.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/guard.sh"
          }
        ]
      }
    ]
  }
}
```

这个例子的重点不是那几条规则写得多全。

重点是位置和返回。

它在工具执行前检查，所以能真正拦住。命中风险后，脚本把原因写到 stderr，然后 `exit 2`。Claude Code 会阻止这次工具调用，并把原因反馈给 Claude，Claude 通常会换一种做法。

实际项目里，敏感清单要按自己的情况改。生产配置、凭证文件、迁移脚本、锁文件、CI 配置，都可以逐步加进去。

这里别只靠一条命令黑名单兜底。比如只拦 `rm *`，不代表能拦住 `/bin/rm`、`find -delete` 这类变体。高风险操作最好同时结合路径限制、权限配置、Hooks、Sandbox、CI 和人工 Review。

## 非 command Hook 怎么选

前面的示例都用 `command`，不是因为其他类型不重要，而是因为脚本最稳定、最好调试，也最适合放进工程流程。

`http` 适合接团队审计系统、远程通知或集中化策略。服务端返回的 JSON body 会按 command hook 的 JSON 输出格式处理。这里有个容易误会的点：HTTP 状态码本身不负责阻断工具调用；真要做决策，需要返回 2xx，并在 response body 里带上符合 schema 的字段。

`mcp_tool` 适合复用已经接好的 MCP 能力，但它不会触发 OAuth，也不会帮你建立连接。`SessionStart`、`Setup` 这类事件发生得很早，MCP server 可能还没准备好，第一次调用失败并不奇怪。

`prompt` 和 `agent` 都会把判断交给模型。前者适合 Hook 输入本身已经足够判断的轻量场景，比如 Stop 前检查“任务是否真的完成”；后者可以启动 subagent 读文件、搜代码、跑命令，但官方仍标了 experimental。

所以我的选择顺序很简单：规则能写成脚本，就先用 `command`；需要集中审计，再接 `http`；已有稳定 MCP 能力、连接时机也合适，再用 `mcp_tool`；只有判断确实需要模型参与时，才考虑 `prompt` 或 `agent`。

Hooks 是为了把确定的动作固定下来。能不把判断交回模型，就先别交回去。

## Hooks 和 Skills 到底怎么分

这个问题特别容易混。

官方 Skills 文档说，Skills 通过 `SKILL.md` 扩展 Claude 的能力。Claude 会在相关时使用 skill，你也可以用 `/skill-name` 显式调用。Skill 的正文只有在使用时才加载进上下文，所以很适合沉淀长流程、检查清单、项目知识、脚本和参考资料。

如果想系统理解 Skills 和 Prompt、MCP、Function Calling 的分工，可以看 [Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html)。

![Agent 执行链路](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skill-agent-execution-link.webp)

Hooks 则完全不同。

Hooks 不负责给 Claude 一份说明，它负责在生命周期节点上自动执行动作。

可以这样分：

| 维度             | Hooks                                                        | Skills                                                   |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 触发方式         | Claude Code 生命周期事件自动触发                             | Claude 判断相关时加载，或用户手动 `/skill-name`          |
| 核心价值         | 让固定动作稳定发生                                           | 给 Claude 增加某类能力或流程知识                         |
| 适合场景         | 格式化、危险命令拦截、权限审计、通知、日志、质量门禁         | 代码审查流程、部署 SOP、故障排查、资料检索、复杂任务处理 |
| 对模型判断的依赖 | 低，尤其是 `command` hook                                    | 更高，Claude 需要理解并执行 skill 指令                   |
| 是否适合阻断     | 适合，尤其是 `PreToolUse`、`UserPromptSubmit`、`Stop` 等事件 | 不适合作为硬拦截机制                                     |
| 常见风险         | matcher 写太宽、脚本慢、自动批准过度                         | 描述不清、触发不准、流程太长                             |

一句话判断：

如果这件事必须每次发生，放 Hooks。

如果这件事需要 Claude 理解上下文、做选择、按步骤完成，放 Skills。

比如“每次改完 TypeScript 文件都跑 Prettier”，这是 Hooks。

比如“按团队标准做一次 PR review”，这是 Skills。

比如“任何时候都不能改 `.env`”，这是 Hooks。

比如“排查线上接口超时，先看日志，再看指标，再给回滚建议”，这是 Skills。

它们也可以配合。

Skill 教 Claude 怎么做代码审查，Hook 保证它改完文件后格式化、遇到危险命令前被拦、结束前检查有没有测试结果。

一个管能力。

一个管纪律。

放到这个场景里就好理解了。

## 实际落地，先配 2 到 3 个

很多人第一次看到 Hooks，会想把所有生命周期都挂满。

先别急。

Hooks 越多，调试成本越高。你会很快遇到一种问题：Claude 为什么没继续？是 `Stop` hook 拦了？是 `PreToolUse` deny 了？是 `PermissionRequest` 自动处理了？还是某个 `PostToolUse` 脚本超时了？

小 G 会建议从三个高收益 Hook 开始。

第一个，`Notification`。

等待授权、等待输入时提醒你。这个不碰代码，风险低，收益直接。

第二个，`PostToolUse` 自动格式化。

只对你确定有 formatter 的文件类型启用。前端就 Prettier，Python 就 Ruff，Java 就项目现有格式化工具。别全仓库乱跑。

第三个，`PreToolUse` 安全拦截。

先拦最危险的：删除命令、递归提权、`.env`、`.git/`、私钥、生产配置。这些一旦出事，后果比少跑一次格式化严重得多。

再往后，可以考虑：

- 用 `SessionStart` 的 `compact` matcher，在压缩后重新注入关键规则。
- 用 `PreCompact` 在压缩前记录当前任务和摘要。
- 用 `ConfigChange` 审计 Claude Code 配置变化。
- 用 `CwdChanged` / `FileChanged` 配合 `CLAUDE_ENV_FILE` 重新加载环境。
- 用 `Stop` 做完成通知或轻量质量门禁。

权限自动批准要单独拎出来说。

`PermissionRequest` 确实能自动批准权限请求，官方示例里就自动批准了 `ExitPlanMode`。但这个能力很锋利。

matcher 要窄。

输入要检查。

能继续保留人工确认的，就保留。

尤其是删除、生产环境、凭证文件、外部 API 写操作，不要为了少点几次确认把门锁拆了。

## 常见问题

**Hook 会消耗很多 token 吗？**

普通 `command` Hook 不会让模型参与，成本主要是本机命令耗时、外部服务调用和脚本自身副作用。`prompt` 和 `agent` Hook 会用模型，才需要考虑 token、超时和返回不稳定。

**stdout 写什么都会进 Claude 上下文吗？**

不会。`UserPromptSubmit`、`UserPromptExpansion`、`SessionStart` 这类事件的 stdout 更容易被当成 Claude 可见上下文处理；多数事件里，stdout 主要用于 JSON 输出或结构化决策。要返回 JSON 时，stdout 里就只放一个 JSON 对象，调试日志写 stderr 或文件。

**能不能用 Hook 触发 slash command 或工具调用？**

`command` Hook 只能通过 stdout、stderr 和 exit code 和 Claude Code 通信，不能直接触发 `/` commands 或 tool calls。要调用 MCP 工具，用 `type: "mcp_tool"`；要让模型参与判断，用 `prompt` 或 `agent`。

**为什么我的 Hook 没生效？**

先跑 `/hooks` 看它有没有注册到正确事件。`/hooks` 是只读浏览器，用来看配置来源、事件、matcher、handler 类型、命令或 URL，它不负责编辑配置。

然后检查配置文件位置和 JSON。用户级是 `~/.claude/settings.json`，项目共享是 `.claude/settings.json`，本机私有是 `.claude/settings.local.json`。再看 matcher，它不总是匹配工具名：`Notification` 匹配通知类型，`SessionStart` 匹配启动来源，`PreCompact` 和 `PostCompact` 匹配 `manual` 或 `auto`。

还有一种情况容易忽略：`PermissionRequest` 依赖权限确认流程，非交互模式下未必会出现权限弹窗。这类自动化如果要稳定拦截，通常应该优先放到 `PreToolUse`。

**想阻断工具调用，用 `exit 1` 行吗？**

大多数情况下不行。想拦住动作，通常要用 `exit 2`，或者 `exit 0` 后输出符合要求的结构化 JSON。普通非 0 错误很多时候只会显示 hook error，然后流程继续。

**`PostToolUse` 能不能做安全门？**

不适合。它发生在工具执行之后，已经晚了。保护敏感文件、拦危险命令，要用 `PreToolUse`。`PostToolUse` 更适合格式化、记录日志、补充上下文或把工具结果整理后反馈给 Claude。

**Hook 和权限规则冲突时谁更硬？**

`PreToolUse` 发生在权限检查前，可以把风险动作提前拦下来。更适合把它理解成“加严”机制：Hook 返回 deny 可以挡住危险调用，但 Hook 返回 allow 不能绕过 settings 里的 deny 规则。项目里的 deny、权限模式、沙箱和人工确认，仍然应该按最高风险来设计。

## 小结

Hooks 最适合处理那些“时机固定、动作明确、最好能记录或阻断”的事情。比如改完文件格式化、执行前拦危险命令、保护 `.env` 和私钥、等待权限时通知你、压缩前后记录状态，这些都属于 Hooks 的舒适区。

反过来看，如果一件事需要 Claude 读上下文、理解任务目标、自己选择执行路径，那就不要硬塞进 Hook。它更适合放进 Skill，或者留在当前任务里让 Claude 判断。Hooks 管固定时刻的动作，Skills 管可复用的做事方法。

起步也不用复杂。先配一个通知、一个格式化、一个安全拦截，把这三个跑稳，你就能明显感觉到 Claude Code 不再只是一个聪明的聊天框，而是开始有了一点“开发系统”的样子。

我觉得 Hooks 最有意思的地方也在这儿。它不是给 AI 编程再加一层魔法，而是把那些本来就该稳定发生的动作，放回工程流程里。

如果想继续补 Agent、Context Engineering、MCP、Skills 和 AI 编程实践，可以从 [AIGuide：AI 应用开发、AI 编程实战与面试指南](https://mp.weixin.qq.com/s/le3RzJsaAH22auUoB05y1Q) 开始。


---

---

<!-- source: 原则/Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams.md -->

## [24] Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams

---
title: Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams
description: 结合 Claude Code 官方文档和社区源码分析，梳理 Subagent、Subtask、Fork Session、Agent Teams、任务协作、权限回流和成本控制，帮助理解 Claude Code 多 Agent 机制如何拆分任务、隔离上下文并管理协作。
category: AI 编程原理
tag:
  - Claude Code
  - Multi-Agent
  - AI Agent
  - AI 编程
head:
  - - meta
    - name: keywords
      content: Claude Code,Multi-Agent,Subagent,Subtask,Fork Session,Agent Teams,AI Agent,上下文隔离,任务协作,AI编程
---

你好，我是小 G。最近有 G 友问我一个问题：Claude Code 里的 Subagent、Fork、Agent Teams 到底是不是一回事？如果面试里被问到 Claude Code Multi-Agent 机制，应该如何回答？

这个问题我一开始也以为只是几个名字绕来绕去。真把官方文档、changelog 和社区源码分析放在一起看，才发现差别不小。

Claude Code 单 Agent 已经能干不少活，日常改代码、查问题、补测试，大部分时候都够用。

问题是，真实项目里的任务往往没那么干净。一个会话既要搜索、阅读、试错，又要最后产出修改，聊着聊着上下文就脏了。

比如排查一个接口性能问题，它可能先搜接口，再读 Mapper、看日志、查索引，中间还试几条 SQL。等真正要改代码时，聊天记录里已经塞满无关文件、旧猜测和被推翻的方案。

人看着都累，模型也容易被这些过程信息带偏。

Claude Code Multi-Agent 盯着的，正是这类**上下文和任务拆分问题**。

它不会把所有工作都塞给一个会话，而是按任务性质拆开：

- 一次性搜索交给 Subagent；
- 已经有上下文的支线探索交给 `/subtask`，需要独立继续时用 `/fork`；
- 需要多人协作的任务，再上 Agent Teams。

于是我把 Claude Code 里和 Multi-Agent 相关的几块放在一起整理了一下。本文会参考社区整理的 Claude Code 源码分析来深入到原理层面，但当前用法以官方文档和 changelog 为准。

这些功能迭代很快。本文版本信息核对到 Claude Code v2.1.218（2026-07-24）：v2.1.212 起，正常情况下，当前会话内的 forked subagent 使用 `/subtask`，`/fork` 则复制当前对话并创建独立后台 Session。关闭 Agent View 后是个例外：`/subtask` 不可用，`/fork` 会继续启动 forked subagent。旧文章把这两种行为都叫 Fork，容易混淆。

## Claude Code 为什么需要多个 Agent？

写一个小函数、改一个配置、补一段测试，单 Agent 通常够用。

不过，在执行跨模块任务时，可能就不够用了。比如，你让 Claude Code 排查一个线上慢查询，它可能要连续做这些事：

- 搜索相关接口和 SQL；
- 阅读 ORM / Mapper 层代码；
- 查看索引和执行计划；
- 修改查询逻辑；
- 补测试或压测脚本；
- 最后再总结原因和改动。

这些步骤如果都让一个 Agent 来做，全塞在主会话里，麻烦主要卡在两处：

- 过程信息太多。搜索命中的无关文件、旧日志、失败方案、临时猜测，都会留在上下文里。后面继续写代码时，模型还得从这些过期材料里捞当前重点。
- 任务惯性。刚排查完数据库问题，下一轮又让它审前端组件，它可能还会带着上一轮的判断方式继续看问题。

所以，我理解的 Multi-Agent，**先要保护好主会话。主会话负责判断和落地，脏活、杂活、支线活能拆就拆。至于并行提速，那只是拆分合理之后的副产品。**

这个思路和上下文工程里常说的“隔离支线过程”是一回事：主会话保留判断、计划和最终决策，把搜索、验证、审查这些容易膨胀的过程交给独立 worker。

![Sub-agent 拆分任务，隔离上下文](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/sub-agent-task-splitting-context-isolation%20.png)

先放一张我自己整理的表。看 Claude Code 里的多 Agent，可以先按几类问题来区分：

| 问题                             | 适合的机制  | 说明                                                            |
| -------------------------------- | ----------- | --------------------------------------------------------------- |
| 支线搜索太多，污染主会话         | Subagent    | 子代理自己读文件、查资料，主会话只拿结果                        |
| 需要继承当前上下文做支线探索     | `/subtask`  | 当前会话内的 forked subagent 继承上下文并返回结果               |
| 需要复制对话并独立继续           | `/fork`     | 创建可独立恢复、管理的后台 Session                              |
| 多个角色需要协作、通信和认领任务 | Agent Teams | 每个 teammate 是独立 Claude Code 实例，有共享任务列表和消息机制 |

> **环境差异**：这张表按 Agent View 已启用的默认情况整理。关闭 Agent View 后，`/subtask` 不可用，`/fork` 会启动当前会话内的 forked subagent。

名字都带 Agent，干的活差得还挺远：

- Subagent 的用法接近“你去查一下，查完告诉我”。
- `/subtask` 在当前会话内复制上下文做支线任务；`/fork` 创建独立后台 Session。
- Agent Teams 则让几个独立实例一起做项目，可以发消息、领任务、最后再汇总。

![Subagents 和 Agent Teams 对比](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-subagents-vs-agent-teams.png)

这里还有个细节：Subagent 不一定要你手动点名。官方文档里说，Claude 会根据 Subagent 的 `description` 判断什么时候委派；内置的 Explore、Plan、general-purpose 等 Subagent，也会在合适任务里自动用上。

看完这张表，再问一个更实际的问题：到底要不要显式指定 Subagent，什么时候又该升级到 Agent Teams。

选的时候先问一句：**这些 worker 之间要不要互相沟通？**

如果只需要查完回报，用 Subagent 就够了。代码审查、日志分析、单点调研，都属于这类。

如果几个 worker 需要互相发消息、认领任务、交换中间结果，才考虑 Agent Teams。比如一个 teammate 看后端接口，一个看前端页面，一个专门做测试和验收。

成本这块也很实在：每个 teammate 都有自己的上下文窗口，token 用量会跟着活跃 teammate 数量一起涨。研究、审查、新功能拆分这类任务通常值得；日常小改动，单会话反而更省。

## Subagent：主会话里的轻量委派

### Subagent 是什么？

Subagent 是 Claude Code 里最常用、也最不容易用过头的一种委派机制。

你可以把它理解成主会话临时派出去的 worker。它有自己的上下文窗口，可以使用指定工具。任务结束后，它把结果返回给主会话，不会把完整搜索过程一股脑倒回来。

很多时候，Agent 多读几个文件不是问题。麻烦的是，它把搜索过程、临时判断和最后被推翻的猜测都带回主会话。Subagent 的好处就在这儿：让它自己查，主会话只拿整理后的结果。

这块我觉得挺香：主会话不用跟着一起外耗。

![Claude Code Explore Subagent：支线搜索在后台执行](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-explore-subagent-demo.png)

上图里，主会话只是把登录、鉴权、权限校验相关搜索交给 Explore subagent。搜索过程在后台跑，主线继续保持干净，等子代理结束后再拿整理后的文件列表、调用链和后续关注点。

![Claude Code Sub-Agent：让主对话保持干净](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode-sub-agent.png)

什么时候需要自定义 Subagent？

我的判断是：同一类 worker 反复出现，而且每次都要给它同一套指令时，再沉淀成自定义 Subagent。比如你经常让它做只读代码审查、数据库查询检查、安全扫描、日志归因，这些任务的角色、工具权限和输出格式都比较稳定，就值得单独配一个。

如果只是偶尔查一次文件、临时看一段日志，直接让 Claude Code 用内置 Subagent 或手动委派就够了，没必要为了“看起来专业”专门建文件。

自定义文件通常放在：

```text
~/.claude/agents/
.claude/agents/
```

这两个目录不一定默认存在。你没看到很正常，说明本机或当前项目还没有创建过自定义 Subagent。

新版文档里的创建方式更直接：让 Claude 帮你写，或者自己建目录写 Markdown 文件。`/agents` 在 v2.1.198 起不再打开交互创建向导，只会提醒你找 Claude 创建，或者直接编辑 `.claude/agents/`。如果是本次会话里第一次新建 `agents` 目录，Claude Code 可能需要重启后才能发现。

用户级 Subagent 对所有项目生效，项目级 Subagent 适合和团队共享。

Subagent 文件就是 Markdown + YAML frontmatter，里面可以配置名称、描述、工具、模型、权限模式、hooks 和 skills。`name` 和 `description` 是必填项，其中 `description` 很关键，Claude 会靠它判断什么时候自动委派。

### Subagent 怎么跑起来？

从运行日志或社区源码分析里看，`Agent` 工具的这几个单次调用参数最值得注意：

| 参数                | 作用                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| `description`       | 给主会话看的任务简述                                                       |
| `prompt`            | 交给子代理执行的具体任务                                                   |
| `subagent_type`     | 指定使用哪类 Subagent；省略时仍是 `general-purpose`，不会自动变成 fork     |
| `model`             | 指定子代理使用的模型别名                                                   |
| `run_in_background` | 是否后台运行；新版未显式配置时，Claude 会自己选择，v2.1.198 起默认后台运行 |
| `name`              | 给后台 Subagent 或 Agent Teams teammate 设置可寻址名称                     |
| `team_name`         | 旧版本 Agent Teams 使用的字段；新版本仍接受但会被忽略                      |

这张表展示的是 `Agent` 工具的调用参数，不是 `.claude/agents/*.md` 的 YAML frontmatter。Subagent 文件里对应的后台和工作区配置是 `background`、`isolation` 等字段。

这张表不用背。重点是不要依赖“省略 `subagent_type` 就隐式 fork”的旧实现说法。普通 Agent 调用在未指定类型时使用 `general-purpose`；需要继承上下文，应显式使用当前版本提供的 `/subtask` 或对应 fork 配置。

内部实现中，`AgentTool` 负责入口和路由，真正把子代理跑起来的是 `runAgent()`。

`runAgent()` 会先做一批运行时准备：

- 初始化 agent 自己需要的 MCP Server；
- 创建子代理专用的 `ToolUseContext`；
- 执行 `SubagentStart` 相关 hooks；
- 写入 sidechain transcript 和 agent metadata；
- 进入 `query()` 主循环。

这些细节说明一件事：Subagent 不是主会话里的普通函数调用。它复用了 Claude Code 的 Agent runtime，有工具、权限、上下文、消息流和 transcript。

所以，它适合承担完整一点的支线任务。让它读一批文件、做一轮审查、给出结论，都比把这些过程塞进主会话干净。

### 哪些任务适合交给 Subagent？

我一般会把这类任务交给 Subagent：

- 只读审查某个模块，最后给出问题列表；
- 搜索某类错误日志，主会话只拿结论；
- 汇总某个外部库的用法，不把搜索过程带回来；
- 对一次改动做独立验证，失败了也能重新派一次。

需要主会话持续参与判断的任务，最好别拆出去。

比如正在改一个核心文件，主会话和子代理同时动手，最后很可能没提速，反而制造冲突。我的习惯是让 Subagent 多做只读和验证，少让它直接参与主线修改。

## `/subtask`、`/fork` 和后台 Agent：什么时候继承上下文？

### `/subtask` 和普通 Subagent 的区别

普通 Subagent 通常靠主会话给一段明确 prompt 开始工作。默认不要继承主会话的完整历史，否则“隔离过程信息”的意义就没了。

`/subtask` 走的是另一条路：它在当前会话内启动 forked subagent，继承父会话已经形成的对话上下文，再把结果返回当前主线。必须显式选择这条路径；省略 `subagent_type` 不会触发 implicit fork。

这适合一种比较特殊的时刻：主会话刚好有一份高质量上下文，你不想浪费它，又想分几个方向试。

比如主会话已经读完了整个支付模块，现在你想顺手分几个方向查：

- 查状态机设计问题；
- 查幂等逻辑问题；
- 查测试覆盖缺口。

这时 `/subtask` 比普通 Subagent 更合适。每个 child 都能拿到父会话刚刚建立好的上下文，不用重新读一遍项目。

![Claude Code Fork：基于当前上下文启动后台分支](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-fork-subagent-demo.png)

上图记录的是旧版 `/fork` 行为。按 v2.1.212 之后的命名，启用 Agent View 时，当前会话内做这种上下文分支应使用 `/subtask`；现在的 `/fork` 会复制整个对话到独立后台 Session，可单独查看、恢复和继续。关闭 Agent View 后，`/subtask` 不可用，`/fork` 仍保持旧的 forked subagent 行为。

### 两种复制方式的适用时机和限制

社区对内部实现的分析显示，当前会话内的 forked subagent 会复用父会话已经渲染的 system prompt 和消息历史。这有利于复用 prompt cache，但它属于实现观察，不应当作外部稳定 API。

这么做主要是为了 prompt cache。

如果每个 fork child 都重新调用一遍 system prompt 生成逻辑，哪怕内容看起来一样，也可能因为动态配置、工具列表、实验开关等细节导致字节不一致。

字节不一致，prompt cache 命中就会受影响。

复用父会话上下文会影响 prompt cache，也把 Multi-Agent 和上下文、工具注册这些底层机制绑在了一起。

这也是 `/subtask` 适合“上下文刚准备好、立刻补一条支线”的原因。若支线需要独立管理、稍后继续或单独恢复，更适合使用现在的 `/fork`。如果担心文件修改互相影响，可以为 Agent 配置 `isolation: "worktree"`，把改动放到独立 Git Worktree 里。

**后台 Agent 解决的是等待问题。**

比如你让一个 Agent 去跑完整代码审查，另一个 Agent 去分析日志，主会话可以继续做设计和拆任务。等后台 Agent 完成后，再把结果回流回来。

如果后台任务开多了，管理成本会立刻上来。当前会话里的 `/subtask` 和其他后台 Subagent 用 `/tasks` 查看、接管或停止；`/fork` 创建的独立后台 Session 则用 `claude agents` 打开 Agent View 统一管理。两者都在后台运行，但不是同一层任务。

![Claude Code Agent View](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-agents-list-view-20260518102539932.png)

但后台不等于免费。后台 Agent 仍然会消耗 token、占用上下文和任务状态。开太多以后，主会话虽然没被卡住，人反而要开始管理一堆任务。

Claude Code 也设置了默认上限：Claude 通过 `Agent` 工具在每个 Session 最多生成 200 个 Subagent，默认最多并发运行 20 个。前者可通过 `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` 调整，后者可通过 `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` 调整；Ultracode Session 不执行默认并发上限。

这两个上限主要阻止 `Agent` 工具继续生成新 Subagent。手动执行的 `/subtask` 仍会计入配额并占用并发槽位，但达到上限后依然可以启动；`/fork` 创建的是独立 Session，不计入当前会话的 200 个配额，并拥有自己的预算。

Subagent 默认不能再创建 Subagent；需要嵌套委派时，可以通过 `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 设置层级。Agent Teams 里，in-process teammate 不能继续生成 teammate，它自己的 Subagent 也只能在前台运行。这些限制是保护措施，不是建议目标，日常任务通常远用不到。

`/subtask` 和 `/fork` 的共同代价是：它们都会复制父会话历史。

父会话越干净，复制上下文越有价值。刚读完一个模块、整理完任务计划、讲清关键文件和约束时，再开 `/subtask` 或 `/fork`，能省掉重复阅读成本。

反过来，如果主会话已经聊了很久，里面塞满无关文件、旧猜测、失败方案和临时判断，再继续 fork，就等于把这团乱麻复制给每个 child。

这种情况下，复制会话不是在分担任务，而是在复制混乱。

## Agent Teams：一组独立 Claude Code 实例

### Agent Teams 和 Subagent 的区别

Agent Teams 是 Claude Code 里更重的一套多 Agent 机制，别把它当成 Subagent 的增强版。

一个 session 作为 team lead，后面简称 lead，负责协调工作、分配任务和综合结果；teammates 独立工作，每个 teammate 都有自己的 context window，并且可以互相通信。

这点很容易搞错：teammate 不会继承 lead 的聊天历史。它像一个新开的 Claude Code session，会加载当前项目的 `CLAUDE.md`、MCP servers 和 Skills，也会收到 lead 发过去的 spawn prompt，但前面那些来回讨论、临时猜测、被推翻的方案，不会自动带过去。

spawn prompt 也就不能只写“你去看一下后端”。关键路径、已知限制、希望输出什么，都要写进去。否则 teammate 拿到的是一个干净窗口，但也可能干净到不知道你刚刚讨论过什么。

Subagent 通常是“干完回来汇报”。teammate 则会通过共享 task list 和 mailbox 协作：有人领任务，有人补信息，lead 最后汇总。

teammate 也可以复用已有的 Subagent 定义。比如你已经写了一个 `security-reviewer`，spawn teammate 时可以指定这个 agent type。它会沿用这个定义里的 `tools` 和 `model`，并把定义正文追加到 teammate 的 system prompt 里。注意，`skills` 和 `mcpServers` 这两个 frontmatter 字段不会通过这条路径生效；teammate 还是按普通 session 的项目和用户设置加载 Skills / MCP servers。

使用前还要先开实验开关。目前 Agent Teams 还是 experimental，默认关闭，需要设置：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

或者在 shell 里设置同名环境变量。

### shared task list、mailbox 和 teammate mode

Agent Teams 不是让几个 teammate 在一个大聊天框里刷消息。它主要靠两套东西来协作：

| 组件             | 作用                                      |
| ---------------- | ----------------------------------------- |
| shared task list | 记录团队任务，teammate 可以认领和完成任务 |
| mailbox          | teammate 之间发消息、请求信息、同步状态   |

这里多出来的，不只是结果回报。Agent Teams 会维护 shared task list 和 mailbox，让 teammate 能认领任务、同步状态、互相补信息。

把 shared task list 当普通 TODO 会低估这套机制。任务有 `pending`、`in progress`、`completed` 三种状态，也可以设置依赖；依赖没完成时，后面的任务不能被认领。多个 teammate 抢同一个任务时，Claude Code 会用文件锁避免并发认领冲突。

消息这块也一样。lead 会给每个 teammate 分配名字，后续可以按名字发消息。teammate 空闲或失败时，也会自动通知 lead，不需要 lead 一直轮询。

源码分析里能看到更底层的实现：mailbox 是文件式 inbox，写入时会考虑并发锁；task list 则让 teammate 不只是接收 prompt，还能 claim work item。

普通 Subagent 更像一次性委派。Agent Teams 会维护共享任务和消息，味道更像一个小型工作队列。

prompt 怎么写也会跟着变。用 Subagent 时，任务最好一次讲清楚；用 Agent Teams 时，lead 可以先把大任务拆到 shared task list 里，teammate 再围绕任务列表和消息往前推。

![Claude Code Agent Teams：多个 teammate 围绕完整分析链路协作审查](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-agent-teams-agentinvest-review.png)

上图是一个更接近真实项目的例子：team lead 先把 AgentInvest 的完整分析链路拆成后端 SSE、Agent 编排、前端渲染、测试与韧性风险四条线，再 spawn 4 个 teammate 分别认领。这里的重点不是多开几个搜索任务，而是 teammate 围绕同一份 shared task list 分工推进，最后由 lead 汇总跨模块问题。

`--teammate-mode` 用来控制 teammate 怎么显示：

| 模式         | 含义                                               |
| ------------ | -------------------------------------------------- |
| `in-process` | 默认模式，在当前进程里展示 teammates               |
| `auto`       | 在 tmux / iTerm2 可用时用分屏，否则回退 in-process |
| `tmux`       | 使用 tmux 或 iTerm2 分屏                           |
| `iterm2`     | 使用 iTerm2 native split panes，v2.1.186 加入      |

`teammateMode` 的默认值在 v2.1.179 从 `auto` 改成了 `in-process`。

这类版本变化在写脚本和团队文档时要注意。网上不少教程还会默认推荐 tmux，或者沿用旧的 team 创建流程，照搬容易和当前版本对不上。

### v2.1.178 之后的版本变化

旧实现里能看到 `TeamCreate` / `TeamDelete`、`team file`、`team_name` 等细节。这些内容对理解 Agent Teams 的演进有帮助，但不能直接写成当前稳定用法。

v2.1.178 之后，启用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 后，第一个 teammate 生成时会自动组成当前 Session 的 Agent Team，不再需要单独的创建步骤。一个 Session 同一时间只有一个 Team，不能再创建其他命名 Team。

`TeamCreate` 和 `TeamDelete` 工具已经移除，运行态 Team 配置会在 Session 结束时自动清理。

`Agent` 工具里的 `team_name` 参数仍然接受，但会被忽略。`TaskCreated`、`TaskCompleted`、`TeammateIdle` hook payload 里的 `team_name` 也属于兼容字段。

Agent Team 运行期间会使用两类本地目录：Team runtime config 在 `~/.claude/teams/{team-name}/config.json`，Task list 在 `~/.claude/tasks/{team-name}/`。

这两个目录由 Claude Code 自动生成和更新。Config 里是 Session ID、Pane ID、Members 这类运行态信息，Session 结束后会被删除；Task list 会保留在本地，恢复 Session 后还能继续使用，清理周期由 `cleanupPeriodDays` 控制。不要手工修改这些文件，也不要在项目里写 `.claude/teams/teams.json` 期待它生效。

所以读旧源码时，我会分开看：

- 旧实现帮助理解 Agent Teams 为什么会有 task list、mailbox 和 team 目录；
- 当前使用方式要以官方文档为准，不要再教用户调用 `TeamCreate`。

## 权限、成本和版本变化

**权限请求先回到 lead**

多 Agent 最怕的一件事，是 worker 绕过主会话权限，自己去改文件、跑命令。

Claude Code 没让 teammate 自己拍板。需要用户确认的权限请求，还是会回到 lead。

源码分析里可以看到 leader permission bridge：in-process teammate 如果需要用户确认，会优先把请求塞回 leader 的 ToolUseConfirmQueue，UI 上带 worker 标识。bridge 不可用时，再退到 mailbox 路径。

用户仍然在一个地方做权限判断，不需要在多个 teammate 里分别盯着确认弹窗。

Subagent 也可以配置自己的工具范围和 hooks。

官方 Subagent 文档里给过只允许只读数据库查询的例子：用 `PreToolUse` hook 检查 Bash 命令，如果发现 `INSERT`、`UPDATE`、`DELETE` 等写操作，就退出并阻止执行。

这类设计和工具调用安全分层是同一个方向：低风险操作可以放宽，高风险操作要确认，涉及文件删除、提交、部署、数据库写入时，不能只靠一句 prompt 约束。

![工具调用安全风险分层：按风险等级匹配不同的控制策略](https://oss.javaguide.cn/github/javaguide/ai/llm/structured-output-function-calling-tool-call-security.png)

**成本主要花在多个独立上下文上**

Agent Teams 贵，主要是因为每个 teammate 都是独立 Claude Code 实例。

我会把成本控制压成几条使用习惯：

- teammate 的模型要显式指定，或者在 `/config` 里设置 `Default teammate model`；它不一定自动跟随 lead 的 `/model`；
- 大多数工作流先从 3-5 个 teammate 开始，三个聚焦的 teammate 往往比五个分散的 teammate 更好用；
- task 不要拆得太碎，也不要大到长时间没有 check-in，最好是一个函数、一个测试文件、一次审查这类自包含交付物；
- 新手先从研究、审查、bug 排查这种不写代码的任务试起；
- 如果要并行改代码，尽量让每个 teammate 负责不同文件，避免两个 teammate 同时改同一个文件。

说到底，这还是上下文管理。

开三个 teammate，相当于同时维护多个窗口，不会把一个窗口拆成三份。任务真的能并行时，这个成本值得；任务本身强依赖、要反复等对方结果时，就不一定划算，最后很容易变成自己给自己加外耗。

**版本信息只能当快照看**

本文按 Claude Code v2.1.218（2026-07-24）核对。版本信息会变，具体功能还是以官方文档和 changelog 为准。尤其是 Agent Teams、Subagent、Skills 这类快速迭代的功能，旧文章里的命令和工具名不一定继续有效。

## 实际使用时怎么选？

**小任务用单 Agent**

任务清楚、改动范围小、上下文不复杂，就用单 Agent，不用想太复杂。

比如：

- 改一个函数；
- 补一个单元测试；
- 调整一个配置；
- 解释一段代码。

这类任务上来就开 Subagent 或 Agent Teams，只会增加调度成本。小改动让一个会话做完，反而最稳。

**支线任务用 Subagent**

我会把 Subagent 当成“出去跑一趟”的人。

比如让它只读审查一个模块、搜一批错误日志、理清某个模块的上下文，或者帮刚改完的代码做一次独立验证。

这些活有个共同点：过程不一定重要，结论重要。主会话只需要知道哪里有问题、证据在哪、下一步怎么改，不需要把所有搜索命中、临时猜测和失败路径都塞进来。

真要动核心代码，我还是更愿意留在主会话里做。Subagent 负责找线索和验结果，主会话负责判断和落地。

**需要协作再上 Agent Teams**

Agent Teams 我会更谨慎一点。它适合那种单靠“查完回来汇报”不够的任务。

比如一个新功能同时牵到后端接口、前端交互、测试策略和反向审查。几个 teammate 不只是各看各的，还要互相问一句：这个接口字段变了，前端要不要跟？测试要不要补？谁现在手里有空可以认领下一块？

这时候 shared task list 和消息机制才有价值。否则只是多开几个 worker，各自跑完一段总结回来，Subagent 就够了。

这些场景就别硬拆：同一个文件里的连续修改、强顺序依赖的任务、需要一个人持续掌握全部上下文的任务。强行拆开，最后只会增加协调开销。

如果多个 Agent 都要改代码，最好先把工作区隔开。比较稳的做法是一个 Agent 一个 Git Worktree，一个分支只承载一个清晰任务，最后再由人或 lead 做合并和验收。

![Claude Code Git Worktree](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-git-worktree.png)

**先拆清任务，再增加 Agent**

任务边界不清时，多个 Agent 只会生成更多方向不一致的中间结果。先用单 Agent 明确目标和依赖；能独立验证的交给 Subagent；当前上下文值得复用时选择 `/subtask` 或 `/fork`；确实需要角色间通信时，再启用 Agent Teams。

更具体一点，可以先跑成串行流水线：Plan 只读方案，Code 做单个任务，Test 补验证，Review 只看 diff。等这套流程稳定后，再把其中能独立执行的环节拆给不同 Agent。

![Multi-Agent 三代理协作流水线](https://oss.javaguide.cn/github/javaguide/ai/coding/spec-coding-multi-agent-pipeline.png)

## 总结

写到这里，再回到开头那个问题：Claude Code 里的 Subagent、Fork、Agent Teams 到底怎么选？

别先盯着“多 Agent 会不会更快”。我更愿意把它看成一种上下文治理方式：主会话负责判断、计划和落地，支线搜索、审查、验证这些容易把上下文弄脏的活，能拆出去就拆出去。

Subagent 适合隔离过程。让它自己读文件、查日志、做只读审查，主会话只拿结论和证据。

`/subtask` 适合在当前会话里复用已经整理好的上下文，完成一次支线并回传结果；启用 Agent View 时，`/fork` 适合把整段对话复制成独立后台 Session，后续单独管理。主会话已经很乱时，两者都只会复制混乱。

Agent Teams 再重一层。只有任务真的需要多个 teammate 认领任务、互相通信、共享 task list 时，才值得上。它花的是多个独立上下文的钱，也会带来协调成本。

我的使用顺序是：小任务单 Agent；干净的支线用普通 Subagent；需要复用上下文时在 `/subtask` 和 `/fork` 之间选择；真正跨模块协作时再开 Agent Teams。它的主要价值是隔离过程和明确责任，并行只是任务可独立拆分后的结果。

延伸阅读可以看 [AIGuide：AI 应用开发、AI 编程实战与面试指南](https://mp.weixin.qq.com/s/le3RzJsaAH22auUoB05y1Q) 的 [上下文工程实战指南](https://javaguide.cn/ai/agent/context-engineering.html) 和 [Spec Coding 规范驱动编程](https://javaguide.cn/AI编程/实践/spec-coding.html)，前者更偏上下文隔离，后者更偏多代理协作流水线。

## 参考资料

- [Claude Code Commands](https://code.claude.com/docs/en/commands)
- [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- [Run agents in parallel](https://code.claude.com/docs/en/agents)
- [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Claude Code Source Code Deep Research Report（社区源码分析，非官方）](https://claudeai.dev/docs/mechanics/development/claude-code-source-deep-research/)


---

---

<!-- source: 原则/Claude Code Skills 技术实现细节与运行方式.md -->

## [25] Claude Code Skills 技术实现细节与运行方式

---
title: Claude Code Skills 技术实现细节与运行方式
description: 从 Claude Code Skills 的文件结构、发现加载、Front Matter、动态上下文、安全限制和 Subagent 配合方式入手，讲清 Skills 如何把可复用工作流变成按需加载的 Agent 能力。
category: AI 编程原理
tag:
  - Claude Code
  - Skills
  - AI Agent
  - AI 编程
head:
  - - meta
    - name: keywords
      content: Claude Code,Skills,Agent Skills,SKILL.md,Front Matter,动态上下文,Subagent,Plugin,AI编程
---

不少读者反馈 Skills 在现在的面试中经常会碰到，于是在前面已经写过两篇的基础上，我又肝了一篇。

下面是正文。

还记得刚用 Claude Code 那会，我很容易把各种规则都往 `CLAUDE.md` 里塞。

代码风格，目录约定，测试命令，这些放进去没问题。可后来一些代码审查 checklist、PR 总结流程、UI 验收步骤，也开始往里面堆。

这时候问题就来了。

这些流程确实有用，但它们不是每一轮任务都要用。每次带上的话，会增加很多无用的信息，反而会干扰模型的判断。

这类内容就别继续塞进 `CLAUDE.md` 了。如果你总是在对话里复制同一段 instructions、checklist 或多步骤流程，或者 `CLAUDE.md` 的某一节已经像操作手册，就可以把它拆出来。

差别主要在加载方式上。`CLAUDE.md` 通常会在会话开始时作为持久上下文加载；Skill 平时只暴露名称和描述，真正命中时才加载完整内容。长参考材料、检查清单、脚本说明，不用一开始就挤进上下文。

这篇文章主要讲 Claude Code Skills 的技术实现和运行方式。我会参考社区源码分析材料看实现细节，但当前用法以官方文档和 changelog 为准。

如果你想先系统了解 Agent Skills 和 Prompt、MCP、Function Calling 的区别，可以看我之前写的 [Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html)。如果更关心有哪些现成 Skill 值得装，可以直接看 [AI 编程必备 Skills 推荐：TDD、代码审查、网页自动化与 MCP 实战](https://javaguide.cn/AI编程/programmer-essential-skills.html)。

## Skills 解决了什么问题

先看 `CLAUDE.md` 和 Skill 的分工。

`CLAUDE.md` 适合放每轮都要用到的项目事实和长期规则，比如代码风格、目录约定、常用命令、架构说明。

Skill 适合放有明确触发场景的流程。它们需要被复用，但不需要每次都跟着会话启动。

最典型的是这些：

- 一套代码审查 checklist；
- 一套排查线上问题的步骤；
- 一个生成 PR 总结的流程；
- 一个只在改 UI 时才需要的设计规范；
- 一个只在写测试时才用到的 TDD 工作流。

它们的共同点是：步骤固定、篇幅不短，但只在特定任务里出现。如果全部写进 `CLAUDE.md`，启动时就会变成额外的上下文成本，越堆越重。

你可以把 Skill 理解成一份按需打开的操作手册：平时只让 Claude 知道有这项能力，真用到的时候，再把完整说明拿出来。

![Skill 和 Prompt、MCP、Function Calling 对比](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skill-prompt-function-calling-mcp-comparison.webp)

`CLAUDE.md` 则反过来。官方建议把它留给每轮都要知道的内容，比如构建命令、项目约定、目录结构，以及必须一直遵守的规则。

如果一段内容已经是多步骤流程，或者只影响代码库里的某个局部，就更适合移到 Skill 或 path-scoped rule。

真到项目里拆的时候，我一般不会先纠结名字，而是先看这段内容到底卡在哪。

- 如果卡在“规则每轮都要生效”，那更像 `CLAUDE.md` 的问题。如果卡在“一段流程反复复制”，那更像 Skill 的问题。
- 如果卡在“任务太长，完整过程会挤占主会话上下文”，才考虑 Subagent。如果卡在“团队里每个人都要装一套”，再考虑 Plugin。

我用了一张表格总结了一下上面提到的概念：

| 机制        | 主要解决的问题                             |
| ----------- | ------------------------------------------ |
| `CLAUDE.md` | 常驻项目规则和长期约定                     |
| Skill       | 只有特定任务才会用到的流程和清单           |
| Subagent    | 把长任务或支线任务委派给另一个 Agent       |
| Plugin      | 分发 Skills、Agents、Hooks、MCP 等扩展能力 |

Claude Code 里的 Skill 可以理解成“prompt-based command”。

自定义命令这块也已经并到 Skills 体系里了。现在 `.claude/commands/deploy.md` 和 `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/deploy/SKILL.md` 都能创建 `/deploy`；旧的 `.claude/commands/` 不用马上迁移，仍然兼容。

Subagent 解决的是“谁来做”；Skill 解决的是“怎么做”。

Plugin 负责分发。一个 Plugin 可以带 Skills、Agents、Hooks 和 MCP Servers。企业或团队如果要统一发放能力，Plugin 会比单独复制 Skill 文件更适合。

如果项目里同时有 `CLAUDE.md`、`AGENTS.md`、局部规则、SPEC 和 Skills，也可以按这个思路拆：常驻规则放在规则文件里，可复用流程交给 Skill，本次任务的验收标准放到 SPEC。

![CLAUDE.md 与其他规则文件怎么分工](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-rule-files-relationship.png)

适合变成 Skill 的内容，通常有几个特点：经常复用，有明确触发场景，步骤比较固定，内容比较长，不适合常驻上下文，最好还能配 supporting files 或脚本（例如 `scripts/`、`references/`、`templates/`）。

代码审查、TDD、PR 总结、数据库变更检查、UI 验收、日志排查，都属于这类任务。

不适合做成 Skill 的，是项目里永远要遵守的硬规则。比如“所有 Java 代码使用 Google Java Style”，这种更适合放 `CLAUDE.md` 或项目规则里。

关于 `CLAUDE.md` 的详细介绍和最佳实践，可以参考我写的这篇 [CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆](https://javaguide.cn/AI编程/实践/claude-md-best-practices.html)。

## `SKILL.md` 怎么写

一个文件系统 Skill 通常是这样的目录结构：

```text
.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/
  pr-summary/
    SKILL.md
    scripts/
      collect-pr-info.sh
    references/
      review-checklist.md
```

`SKILL.md` 由两部分组成：

1. YAML frontmatter：描述名字、触发条件、工具权限、模型、执行上下文等元数据。
2. Markdown body：真正发给 Claude 的操作说明。

一个最小例子：

```md
---
name: pr-summary
description: Summarize a pull request and list key risks
allowed-tools: Bash(gh *)
---

Read the pull request diff and comments, then summarize:

1. Main changes
2. Risky files
3. Missing tests
4. Suggested follow-up
```

当你执行 `/pr-summary`，Claude Code 会把这个 Skill 渲染成 prompt，再交给模型。

源码里的 `parseSkillFrontmatterFields()` 支持的字段比较多，常见字段可以先看下面这些：

| 字段                       | 作用                                       |
| -------------------------- | ------------------------------------------ |
| `name`                     | 展示名；目录名通常决定命令名               |
| `description`              | 给模型判断何时使用                         |
| `when_to_use`              | 更细的触发说明                             |
| `allowed-tools`            | 预批准该 Skill 可用的工具                  |
| `model`                    | 指定模型别名                               |
| `effort`                   | 指定推理/努力等级                          |
| `user-invocable`           | 是否允许用户通过 `/skill-name` 直接调用    |
| `disable-model-invocation` | 禁止模型自动调用，只允许用户手动调用       |
| `paths`                    | 条件触发路径                               |
| `context`                  | 支持 `fork`，让 Skill 在子代理上下文中运行 |
| `agent`                    | 绑定指定 Agent                             |
| `shell`                    | 指定动态上下文命令使用 bash 或 powershell  |

这里别一上来就把字段全堆上。大多数 Skill 只需要 `description`、`allowed-tools` 和正文说明。字段越多，维护成本越高。

这里有几个字段容易混：

| 字段            | 更适合解决什么问题                             |
| --------------- | ---------------------------------------------- |
| `allowed-tools` | 收窄当前 Skill 可以直接使用的工具范围          |
| `context: fork` | 让长流程、调研类、审查类任务在 fork 上下文里跑 |
| `agent`         | 指定由哪个 Agent 执行这个 Skill                |

例如：

```yaml
context: fork
agent: Explore
allowed-tools: Bash(gh *)
```

这类配置适合 PR 总结、模块审查、文档汇总这类任务。主会话不一定要背完整过程，只拿结果就够。

Skills 还支持参数替换。最简单的是 `$ARGUMENTS`：

```md
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.
```

执行：

```bash
/fix-issue 123
```

Claude 收到的内容里，`$ARGUMENTS` 会被替换成 `123`。

如果要按位置取参数，可以用 `$ARGUMENTS[0]`，也可以用短写 `$0`：

```md
Migrate the $0 component from $1 to $2.
```

执行：

```bash
/migrate-component SearchBar React Vue
```

`$0`、`$1`、`$2` 会分别替换成 `SearchBar`、`React`、`Vue`。

## Claude Code 怎么发现 Skills

Claude Code 会从多个来源加载 Skills。常见位置包括：

```text
~/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/
.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/
```

用户级 Skills 放在 `~/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/`，所有项目都能用。项目级 Skills 放在项目的 `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/`，适合和团队共享。

![项目里的 .claude/skills 目录示例](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-project-skills-folder.png)

从源码看，Skills 目录采用的是：

```text
skill-name/SKILL.md
```

也就是说，`/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/` 目录下单独一个 `.md` 文件不是标准 Skill 格式，目录里要有 `SKILL.md`。

Claude Code 的 Skill 来源大致可以分几类：

| 类型           | 来源                | 说明                                      |
| -------------- | ------------------- | ----------------------------------------- |
| 用户级 Skills  | `~/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/` | 个人长期复用                              |
| 项目级 Skills  | `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/`   | 项目或团队共享                            |
| Managed Skills | 管理策略目录        | 组织统一下发                              |
| Bundled Skills | Claude Code 内置    | 例如 `/code-review`、`/debug`、`/loop` 等 |
| Plugin Skills  | 插件提供            | 跟随 plugin 安装和启用                    |
| MCP Skills     | MCP Server 映射能力 | 来自 MCP Server                           |

Claude Code 包含一些 bundled skills，比如 `/code-review`、`/batch`、`/debug`、`/loop` 和 `/claude-api`。它们和普通内置命令不一样，属于 prompt-based skill。

![Claude Code 官方文档中的 Bundled skills 说明](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-code-bundled-skills-docs.png)

嵌套 `.claude/skills` 目录也要留意。

v2.1.178 后，嵌套 `.claude/skills` 目录在处理对应文件时也会加载。发生名称冲突时，嵌套 Skill 会以 `<dir>:<name>` 的形式出现，避免覆盖外层同名 Skill。

这和项目规则的思路接近：**越靠近当前工作目录的配置，越能表达局部上下文。**

不过，不建议滥用嵌套 Skills。只有当子目录确实有独立工作流时才拆，比如：

- `frontend/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/ui-review/SKILL.md`
- `backend/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/api-contract-check/SKILL.md`
- `docs/.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/article-review/SKILL.md`

如果只是为了分类，普通目录和文件名就够了。

旧版 `.claude/commands/` 仍然兼容。源码里也能看到 legacy commands loader：如果旧命令目录里存在 `SKILL.md`，会按 Skill 方式处理；否则继续按 Markdown command 加载。

官方文档里已经写明：custom commands 已经合并进 Skills，但已有 `.claude/commands/` 文件会继续工作。新写能力时，建议直接用 `.claude/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/<name>/SKILL.md`。

## Skill 被调用后发生什么

Skill 平时不会把完整正文塞进上下文。

Claude Code 主要通过 Skill 的名称、描述、`when_to_use` 等 frontmatter 信息，让模型知道有哪些能力可用。

源码里还有一个 `estimateSkillFrontmatterTokens()`，只估算 name、description、whenToUse 的 token，因为完整内容只在调用时加载。

当用户执行 `/skill-name`，或者模型判断某个 Skill 适合当前任务时，Claude Code 才会调用 `getPromptForCommand()`，把 Skill body 渲染出来。

这也是 Skills 比长 `CLAUDE.md` 更省上下文的主要原因。

![Agent 执行链路](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skill-agent-execution-link.webp)

Skill 被调用后，Claude Code 会先拿到 Markdown body，然后依次做几件事：

1. 展开参数，比如 `$ARGUMENTS`、`$0`。
2. 替换 `${CLAUDE_SKILL_DIR}`。
3. 替换 `${CLAUDE_SESSION_ID}`。
4. 如果不是 MCP 来源，再执行内嵌 shell 命令。
5. 返回最终 prompt 给模型。

`createSkillCommand()` 里对应的实现就是 `getPromptForCommand()`。它会等到真正调用时才处理，不会在启动阶段把所有 Skill 都渲染好。

Skill 可以带 supporting files，比如脚本、参考文档、模板。目录结构可以是：

```text
my-skill/
  SKILL.md
  scripts/
  references/
  templates/
```

如果正文里需要引用脚本路径，可以用 `${CLAUDE_SKILL_DIR}`：

```md
Run this helper:

!`${CLAUDE_SKILL_DIR}/scripts/collect-context.sh`
```

这样 Skill 移动目录后也不容易坏。

不过，支持文件不应该全量塞进正文。更好的写法是：在 `SKILL.md` 里告诉 Claude 什么时候读取哪个文件。用得到再读，用不到就别进上下文。

这就是渐进式披露：先让模型知道“有这个能力”，命中后再读正文，正文里只放流程骨架，真正长的材料继续放到 supporting files。

![渐进式披露（三层模型）](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/skills-progressive-disclosure-three-layer-model.png)

所以 `SKILL.md` 不适合写成超长 README。正文里优先写什么时候用、按什么顺序做、哪些情况别做、失败怎么兜底；长清单、模板和脚本说明放到 `references/`、`templates/`、`scripts/` 里。

![SKILL.md 正文最好控制在 500 行以内](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/keep-skill-md-content-under-500-lines-for-best-performance.png)

`CLAUDE.md` 和 Skill 的区别，也可以回到加载策略上理解：

| 内容              | 更适合放哪里             |
| ----------------- | ------------------------ |
| 项目编码规范      | `CLAUDE.md`              |
| 目录结构说明      | `CLAUDE.md`              |
| 代码审查流程      | Skill                    |
| PR 总结流程       | Skill                    |
| UI 验收 checklist | Skill                    |
| 线上故障排查脚本  | Skill + supporting files |

不要把 Skill 当成另一个更长的 `CLAUDE.md`。Skill 的价值在于按需加载，而不是换个目录继续堆规则。

## 动态上下文和安全限制

Skills 支持动态上下文注入，语法是：

```md
当前 Git 状态：
!`git status --short`
```

也支持代码块形式：

````md
```!
git log --oneline -5
```
````

这些命令会在 Skill 内容发送给 Claude 之前执行。命令输出会替换原来的占位符，模型看到的是最终结果，不是命令本身。

官方文档里也强调：这是 preprocessing。Claude 只看到渲染后的 prompt。

它和 Claude 调用 Bash 的区别很大。

Claude 调用 Bash，是模型在 agent loop 里决定使用工具。它会产生一次工具调用，工具结果进入对话历史。

Skill 里的动态命令是 prompt 预处理。命令先执行，输出被塞进 Skill prompt。模型不会看到“我要执行这条命令”的过程。

适合放在动态上下文里的内容，通常是稳定、只读、低风险的上下文采集，比如：

- `git status --short`
- `git diff --name-only`
- `gh pr view --comments`
- 项目自带的只读脚本

不要把会修改文件、提交代码、删除资源的命令写进动态上下文。动态上下文应该负责“收集材料”，不负责“执行改动”。

MCP 来源的 Skill 更特殊。源码里的判断条件是：`loadedFrom !== '什么是 Model Context Protocol (MCP)？和 Function Calling、Agent 什么关系？'` 时才执行内嵌 shell。

MCP Skill 来自远程 MCP Server，不一定可信。如果允许远程服务器返回一个带动态命令的 Skill，再在本机执行，就会变成远程代码执行风险。

所以 MCP 来源的 Skill 会跳过内嵌 shell。文件系统、本地项目、受信任来源的 Skill 才能走这条预处理链路。

同时，即使是本地 Skill，命令执行前也会走同一套工具权限检查。`allowed-tools` 可以给当前 Skill 放行一部分命令，但不是无条件执行。

第三方 Skill 也要按这个思路检查。安装前至少看一遍 `SKILL.md`、`scripts/`、`references/`，确认里面没有危险命令、异常脚本或过宽权限。安装 Skill，等于把一套流程交给 Agent 执行，来源不清楚时，别急着让它进项目。

企业环境里，官方 settings 文档有一个和治理相关的配置：`strictPluginOnlyCustomization`。

它可以限制 skills、agents、hooks、MCP servers 的来源。比如设置：

```json
{
  "strictPluginOnlyCustomization": ["Agent Skills 是什么？和 Prompt、MCP 到底差在哪？", "hooks"]
}
```

被锁定后，用户级和项目级来源会被跳过，只加载 plugin 提供的、managed settings 提供的，或者内置的能力。

这类配置适合团队或企业环境。个人项目一般用不上，但如果公司要统一管理 AI 编程工具的扩展来源，就不能只靠口头约定。

## Skills 怎么和 Agent 配合

Skill 可以跑在 Subagent 里。

官方文档里有“Run skills in a subagent”相关说明，Skill frontmatter 也支持 `context: fork` 和 `agent`。

例如一个 PR 总结 Skill，可以让 Explore agent 在 fork 上下文里跑：

```yaml
context: fork
agent: Explore
allowed-tools: Bash(gh *)
```

这样主会话不用自己背完整 PR diff、评论和文件列表，只拿总结结果。

`context: fork` 适合三类场景：

1. Skill 过程很长；
2. Skill 需要读很多文件或外部信息；
3. 主会话只关心结果，不关心完整过程。

比如生成 PR 风险摘要、对一个模块做只读审查、汇总文档和 issue、生成迁移计划，都可以考虑 fork。

不适合放到 fork 里的，是那些必须和主会话持续互动的任务。比如你正在手动调整某个核心设计，Skill 每一步都要你确认，那就不要 fork 出去。

Agent Teams 也会带来额外上下文开销。官方成本文档提醒过：teammates 会自动加载 `CLAUDE.md`、MCP servers 和 Skills。也就是说，Agent Teams 不是只多了几个 prompt，每个 teammate 都有自己的启动开销。

这并不代表不要用 Skills，而是要控制 Skill 描述和触发范围：

- `description` 写清楚，不要让模型误触发；
- 长内容放 supporting files，不要全塞 `SKILL.md`；
- 用 `disable-model-invocation` 限制只允许手动调用的 Skill；
- 大型团队项目用 `strictPluginOnlyCustomization` 控制来源。

Skill 的设计目标是按需加载。如果描述太泛、触发太频繁，它就会从“节省上下文”变成“额外开销”。

实际项目里，我一般按下面这个规则拆：

| 内容                   | 放哪里                                 |
| ---------------------- | -------------------------------------- |
| 每轮都要遵守的规则     | `CLAUDE.md`                            |
| 特定路径下才生效的规则 | `.claude/rules/` 或带 `paths` 的 Skill |
| 可复用操作流程         | Skill                                  |
| 长参考材料             | Skill supporting files                 |
| 搜索、审查、验证支线   | Subagent                               |
| 多角色协作任务         | Agent Teams                            |

举个例子：你要做一次后端接口重构。

`CLAUDE.md` 里放项目编码规范和测试命令；`api-contract-check` Skill 里放接口兼容性检查流程；`code-review` Skill 里放审查 checklist；搜索旧调用方交给 Subagent；如果前端、后端、测试要并行推进，再考虑 Agent Teams。

这样拆的好处是，规则、流程、执行者各自清楚。别把所有东西都塞进主会话，也别为了显得高级到处开 Agent。

## 总结

我更愿意把 Skill 当成一种 **按需加载的操作手册**。

每轮都要遵守的，继续放规则文件；只有特定任务才会用到的流程，拆成 Skill；流程里很长的 checklist、模板和脚本说明，再继续拆到 supporting files。

判断标准也很简单：如果你已经开始反复复制同一段提示词，或者 `CLAUDE.md` 里某一节长到读起来像手册，那它大概率该变成 Skill 了。

反过来，如果只是代码风格、测试命令、目录约定这类每轮都要遵守的硬规则，就别为了用 Skill 而写 Skill。放在 `CLAUDE.md` 里，反而更直接。


---

---

<!-- source: 原则/Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选.md -->

## [26] Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选

---
title: Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选
description: 从 Claude Code 记忆机制出发，拆解 CLAUDE.md、.claude/rules、Auto Memory、Subagent Memory、Agent Teams 和第三方记忆插件的分工，说明哪些信息值得长期保存，以及 Markdown、claude-mem、memsearch、向量检索各自适合什么场景。
category: AI 编程原理
tag:
  - Claude Code
  - Auto Memory
  - Agent Memory
  - AI 编程
head:
  - - meta
    - name: keywords
      content: Claude Code,Auto Memory,CLAUDE.md,MEMORY.md,Agent Memory,Subagent Memory,Agent Teams,claude-mem,memsearch,向量检索
---

新开一个 Claude Code 会话，它居然知道这个项目怎么跑测试、代码风格是什么、哪些目录不要乱动，甚至还记得你之前纠正过一句：“集成测试别用 H2，要连真实 MySQL”。

难道说模型把上次聊天都记住了？

大概率不是。LLM 每次推理看到的还是本轮输入。Claude Code 能跨会话接上，靠的是模型外面那套文件和加载逻辑：哪些规则常驻，哪些经验先放索引里，哪些内容等任务相关时再读进来。

本文和 [《AI Agent 记忆系统》](https://javaguide.cn/ai/agent/agent-memory.html) 这篇互为补充。那篇讲通用 Agent 记忆：短期记忆、长期记忆和记忆演化机制。放到 Claude Code 里，问题就更具体了：`CLAUDE.md` 到底放什么？Auto Memory 记下来的又是什么？`.claude/rules/` 和第三方的 `claude-mem`、`memsearch` 该怎么分工？

![AI Agent 记忆系统架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-arch.png)

## LLM 自己不保存跨会话状态

先把这个点说清楚：模型本身不会在两次请求之间偷偷保存状态。

一次调用里，客户端把系统提示词、历史对话、工具返回、用户新问题拼到一起，模型根据这些内容生成下一段输出。下一轮还能想起来，只是应用层又把相关内容带回来了。

普通聊天不太容易暴露这个问题。你连续聊几十轮，客户端把前文带上，模型自然能接话。Agent 场景就麻烦多了：它会读文件、跑命令、调用工具、拿日志，每一步返回都在吃上下文。几轮下来，窗口里塞满临时材料，长期规则反而混在里面。

![LLM 自己不保存跨会话状态](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/llm-no-cross-session-state.webp)

如果打个工程类比，Context Engineering 有点像给 LLM 做“内存管理”：上下文窗口容量有限，真正要管的是哪些信息常驻、哪些按需读取、哪些过期后淘汰。Token 紧张时，摘要、压缩、检索、优先级取舍，本质上都在处理同一个问题：**别让低价值内容挤掉当前任务真正需要的上下文。**

上下文该怎么组织、什么时候按需加载、什么时候压缩，我在 [《上下文工程(Context Engineering) 是什么？和 Prompt Engineering 有什么区别？》](https://javaguide.cn/ai/agent/context-engineering.html) 里单独讲过，篇幅问题这里就不重复介绍了。

回到 Claude Code，长期记忆要先回答这几个问题：

1. 哪些信息值得长期保存？
2. 保存到哪里，谁能看见？
3. 启动时加载多少，任务中再怎么补？
4. 记忆过期、冲突或者被代码库推翻时，怎么发现和清理？

很多问题都卡在第一项：**到底什么值得写入**。

![Claude Code 记忆分层](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-memory-layers.webp)

## 规则和经验别搞混了

Claude Code 的长期上下文可以先分成两类：**人写给 Claude 的规则，以及 Claude 工作时自己攒下来的经验。**

`CLAUDE.md` 是第一类。它更像会话开始前的工作说明书：编码规范、常用命令、目录约束、团队流程、不要碰的区域，都应该写在这里。官方文档把它归到 instructions and rules。

![CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

Auto Memory 是第二类。它记录的是 Claude 在项目里遇到的模式，比如 build 命令、调试经验、用户偏好、一些反复出现的坑。官方文档把它归到 learnings and patterns。

两者都会进入会话，但职责不一样：

| 机制        | 谁写   | 适合存什么                   | 默认加载方式                              |
| ----------- | ------ | ---------------------------- | ----------------------------------------- |
| `CLAUDE.md` | 人     | 稳定规则、项目约定、协作流程 | 每次会话加载                              |
| Auto Memory | Claude | 工作中发现的经验、偏好、模式 | 每次会话加载 `MEMORY.md` 前 200 行或 25KB |

这两类最好分清楚。规则尽量由人维护，因为它更接近团队约定；经验可以让 Claude 记，但使用前最好回到当前代码里核对一下。

### `CLAUDE.md`：放每次都要看的规则

`CLAUDE.md` 的具体写法，我之前在 [《CLAUDE.md 最佳实践：该写什么、不该写什么、项目变大后怎么拆》](https://javaguide.cn/AI编程/实践/claude-md-best-practices.html) 里已经单独讲过。这篇不重复模板和示例，只看它在 memory 体系里的位置。

官方文档里这些位置分散在不同段落里看，我更建议直接按五层来记：

![CLAUDE.md 层级与优先级](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-file-hierarchy.png)

| 位置     | 路径                                                                                                                                                  | 适合内容                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 组织级   | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`；Linux/WSL: `/etc/claude-code/CLAUDE.md`；Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | IT/DevOps 统一下发的编码规范、安全策略、合规要求            |
| 用户级   | `~/.claude/CLAUDE.md`                                                                                                                                 | 个人所有项目通用的偏好和工具习惯                            |
| 项目级   | `./CLAUDE.md` 或 `./.claude/CLAUDE.md`                                                                                                                | 团队共享的项目架构、命令、代码标准                          |
| 本地级   | `./CLAUDE.local.md`                                                                                                                                   | 当前项目里的个人配置，例如沙箱 URL、测试数据偏好            |
| 子目录级 | `./subdir/CLAUDE.md`，以及同目录下的 `CLAUDE.local.md`                                                                                                | 某个模块或子目录的规则，Claude 读取该目录文件时才会按需加载 |

这些文件不是谁覆盖谁。Claude 会把启动路径上能看到的 `CLAUDE.md` 和 `CLAUDE.local.md` 拼进上下文，范围越大越先加载，越靠近当前目录越后加载；子目录里的文件不在启动时加载，要等 Claude 读到那个目录下的文件才会补进来。组织级 managed policy 不能被个人配置排除。

每份 `CLAUDE.md` 最好控制在 200 行以内。文件一长，模型就容易只记住一部分。

![Claude Code 官方文档对 CLAUDE.md 的建议](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claudemd-claude-docs.png)

这就是我们常说的上下文腐化（Context Rot）问题。**上下文越长，信息越杂，模型利用上下文的稳定性就越可能变差。**

![上下文腐化](https://oss.javaguide.cn/github/javaguide/ai/harness/context-rot-diagram.png)

`CLAUDE.md` 很容易被误用，尤其是下面这几种情况。

1. `CLAUDE.md` 不是强制配置。

`CLAUDE.md` 会作为 user message 注入到系统提示词之后。它很有用，但规则写得模糊、过期，或者不同文件之间互相冲突，模型照样可能选错。

1. 块级 HTML 注释只是在注入上下文前被剥离。

你可以在 `CLAUDE.md` 里写维护说明：

```markdown
<!-- 这段给维护者看，注入上下文时会被剥离 -->
```

但如果 Claude 用文件读取工具直接打开它，注释仍然可见。

1. `@path/to/file` 能引入外部文件，但不会省 token。

被引用文件会在启动时展开进上下文，递归最多四跳，首次引用外部文件还可能需要审批。大段规则不要指望靠 `@` 拆文件来“省窗口”。

真正适合按需加载规则的，是 `.claude/rules/`。

![CLAUDE.md 与其他规则文件怎么分工](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode/claude-md-best-practices-rule-files-relationship.png)

### `.claude/rules/`：放按文件触发的规则

假设你有一份前端规则，只在处理 `src/**/*.tsx` 时才需要。后端任务每次都把它加载进来，就是在浪费上下文。

`.claude/rules/` 适合放这类条件规则。每条规则是一个 Markdown 文件，可以在 frontmatter 里写 `paths`：

```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
  - "tests/**/*.test.ts"
---

# TypeScript Rules

- API 入参必须做校验。
- 测试文件优先复用已有 fixture。
```

带 `paths` 的规则不会在启动时全量塞进去。Claude 读取匹配 glob 的文件时，才会触发对应规则。这样一来，那些长期有效、但只在某类任务里有用的内容，就不用全塞进 `CLAUDE.md`。

放到项目里时，我一般按用途拆开：

- 每次会话都要看到的规则，放 `CLAUDE.md`；
- 只在某类文件或目录下才有用的规则，放 `.claude/rules/`；
- 多步骤、可复用的操作流程，做成 skill，按需触发；
- 必须硬拦的行为，用 hook 或权限配置，不要只写在 Markdown 里。

“禁止执行 `rm -rf`”“提交前必须跑某个脚本”这类要求，写在 `CLAUDE.md` 里只能算提醒。真要拦住工具调用，还是得靠 hook、permissions 或外层 CI。

### Auto Memory：放 Claude 工作中记下的经验

Auto Memory 是 Claude Code 官方提供的自动记忆机制。它的自动，主要体现在 Claude 会在工作中自己写 notes：比如构建命令、调试经验、架构信息、代码风格偏好和工作习惯。

不过，它不是每轮会话都写，而是由 Claude 判断哪些内容以后还会用到。你可以用 `/memory` 直接打开对应的文件夹。

![Claude Code  /memory](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claudecode-memory-command.png)

按官方文档，Auto Memory 从 Claude Code v2.1.59 开始可用，并且默认开启。它会把项目记忆放到 `~/.claude/projects/<project>/memory/`，启动时先读 `MEMORY.md` 的前 200 行或 25KB。更细的内容不会一次性全塞进来，而是放在 topic files 里，需要时再打开；`/memory` 可以查看和编辑。

![Claude Code Auto Memory](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-auto-memory.png)

也可以直接关掉它：

```json
{
  "autoMemoryEnabled": false
}
```

或者用环境变量：

```bash
CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

默认存储目录是：

```text
~/.claude/projects/<project>/memory/
```

官方文档给出的典型结构是：

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md
├── debugging.md
├── api-conventions.md
└── ...
```

`MEMORY.md` 只做入口索引，启动时自动加载前 200 行或 25KB，哪个先到就停。更细的说明放在 topic files 里，Claude 需要时再读。

这个设计很像我前面写过的 Skill 渐进式披露：先让模型知道“有什么”，别一上来就把“全部内容”塞满上下文。

![Skill 渐进式披露](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/agent-skills-progressive-disclosure.webp)

官方文档没有要求 topic file 一定使用某个 schema，也没有公开承诺“记忆类型必须是 user / feedback / project / reference”。

下面这四类是根据之前的源码泄露分析得出的：

| 类型        | 适合保存                         | 不适合保存                           |
| ----------- | -------------------------------- | ------------------------------------ |
| `user`      | 用户长期偏好、技术背景、沟通习惯 | 用户刚才说的一次性临时想法           |
| `feedback`  | 用户明确纠正过的做法             | Agent 自己猜出来的偏好               |
| `project`   | 项目阶段、决策原因、短期冻结规则 | 当前代码结构、文件行号这类会变的事实 |
| `reference` | 信息去哪查、哪个文档是权威来源   | 大段复制的文档正文                   |

Auto Memory 会自动写 notes，但不等于可以完全不管。你让 Claude “记住某件事”、事后用 `/memory` 审核自动写入的内容，或者自己做类似系统时，都要有一套筛选标准。我的原则是宁可少记几条，也不要堆无用的内容。

重点关注这三点：

1. 下次做决定会不会用到？
2. 是不是用户明确确认过？
3. 过期了有没有人能发现？

答不上来，就让它留在当前会话里，没必要写进长期记忆。

真要保留下来，也不要只在 topic file 里塞一句结论。至少把事实、当时这么定的原因、记录时间/失效时间、用之前是否要核对都写上。以后 Agent 再读到这条记忆，看到的就不是一条死规则，而是一条有边界的记录。

![记忆写入治理](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-memory-write-governance.webp)

例如：

```markdown
---
type: feedback
created_at: 2026-06-17
updated_at: 2026-06-17
---

# 集成测试连接真实 MySQL

集成测试只要验证数据库行为，就连接真实 MySQL，不使用 H2 内存库替代。

原因：之前有用例在 H2 上通过，但上线后因为 MySQL 的事务和 SQL 方言差异暴露问题。

适用范围：参数校验、纯分支逻辑测试可以继续使用更轻的替代方案；涉及事务、索引、SQL 方言和并发行为时，必须回到 MySQL。
```

只写“集成测试不用 H2”当然也能起作用，但 Agent 很容易机械执行。补上原因和适用范围，后面遇到参数校验、纯分支逻辑这类场景，它才有机会做出正确取舍。

## 哪些东西别放进长期记忆

前面说的是哪些值得记。反过来，还有一些内容最好只留在本轮会话里。

下面这些我一般不会建议放进 Auto Memory：

- 某个文件现在有多少行、某个函数现在在哪；
- 本轮命令输出、临时日志、一次性报错和排查中间状态；
- Git 里能查到的修改历史，README、接口文档里已有的稳定内容；
- Agent 自己推出来、但用户没有确认过的偏好或判断。

它们放在当前上下文里很有用，放进 memory 里就没任何意义了，反而会影响 Agent 的判断。

时间最好也落到具体日期。用户说“月底前别动订单模块”，如果这句话要进 memory，就写成“2026-06-30 前不要修改订单模块”。“月底”“下周”“昨天”这种说法只在当场成立，隔几天再读，Claude 很难知道它指的是哪一天。

一条 memory 写进去以后，成本就不只是几十个 token。它还要被复查、改掉或删除；没人管时，Agent 可能会拿着这条旧前提继续做决定。

## Auto Memory 怎么读回来，不要写死

官方文档中只提到了 `MEMORY.md` 和 topic files 这一层：启动时先加载索引，更细的内容按需读取。

再往里，Auto Memory 到底用 grep、LLM picker、向量检索，还是别的策略，官方并没有展开。

![Auto Memory 召回流程](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-memory-recall-flow.webp)

根据网上流出的源码片段和反编译分析来看：Claude 可能会先读 `MEMORY.md` 和各文件摘要，再按当前任务挑相关文件；也有人认为它更偏关键词匹配。

实际落地时，先抓住几条就够了：索引短一点，正文拆出去，同一轮已经注入过的记忆不要重复塞。读回来也不是越多越好，错塞一条过期记忆，比少塞一条更容易把 Agent 带偏。

## 读到 memory 后，先判断它是哪类信息

Auto Memory 被读回上下文后，先按带时间戳的线索处理：它能告诉你以前为什么这么做、可以从哪里开始查，但不能证明现在仍然如此。

比如 memory 里写“订单超时任务在 `order-job` 模块”。这条记录在写入当天可能是对的；后来代码拆了模块，任务可能已经搬家，也可能改了名字。如果 Agent 直接按旧记忆去改文件，大概率会偏。更稳的顺序是：先用 memory 找方向，再回到当前仓库、当前文档或命令输出里确认。

读到不同类型的 memory，信任方式也不一样。

用户长期偏好可以优先采用，但本轮明确指令永远更近。历史决策原因可以参考，不过它解释的是当时为什么这么选，不代表现在还必须这么做。文件路径、模块位置、命令参数这类内容，只能当线索，用之前一定要回到当前仓库核对。项目冻结、上线窗口、排期要看绝对日期，过期了就更新或删除。第三方文档结论也一样，最后还是要回到当前官方文档或实际版本确认。

Auto Memory 的价值是减少重复解释，让 Agent 少从零开始摸索。真正动手前，当前代码、当前文档和当前命令输出的优先级仍然最高。

## Subagent Memory 和 Agent Teams 分别解决什么问题

多 Agent 相关文档里，Subagent Memory 和 Agent Teams 很容易被放到一起看。前者管某个 subagent 自己的长期经验，后者管多个 Claude Code session 在一次任务里怎么配合。

Subagent Memory 仍然是文件式长期记忆，只是记忆主体从主会话换成了某个 subagent。官方 subagent 文档里的 `memory` 字段支持 `user`、`project`、`local` 三种 scope。

按 scope 不同，Claude Code 会使用下面这些目录：

```text
~/.claude/agent记忆/<agent-name>/
.claude/agent记忆/<agent-name>/
.claude/agent-memory-local/<agent-name>/
```

这些目录按需创建或使用。没有给 subagent 配 `memory` 时，在 `~/.claude/` 里看不到 `agent-memory/` 很正常。

启用后，subagent 启动时会读取对应目录里 `MEMORY.md` 的前 200 行或 25KB，哪个先到就停。它也会拿到读写 memory 目录所需的文件工具，用来维护自己的经验。

这类 memory 适合放专用 worker 的经验。比如一个只负责数据库迁移的 subagent，可以沉淀迁移脚本规范、常见失败原因、项目里的历史取舍。下次处理同类任务，它至少知道先查哪里、哪些坑别重复踩。

Agent Teams 走的是协作调度路线。官方文档里提到的 team lead、teammates、shared task list、mailbox，解决的是多个独立 Claude Code session 如何分工、通信、同步任务状态，和共享长期记忆不是一回事。

Agent Teams 可以引用某个 subagent definition 来生成 teammate，但这只说明 teammate 会复用 definition 里的部分配置。官方明确写到的是 `tools`、`model` 会被使用，正文会追加到 teammate 的 system prompt；`skills`、`mcpServers` 不会沿这条路径生效。`memory` 在 teammate 场景下怎么处理，最好按当前版本单独验证，别顺手外推成团队共享长期记忆。

所以我会把两者分开用：Subagent Memory 用来沉淀专用 worker 的长期经验；Agent Teams 用来做一次任务里的并行协作。真要让团队角色带上长期经验，先验证它启动时加载什么、写到哪里、能不能跨 session 保留，再放进正式流程。

## 第三方记忆插件解决了什么问题

内置 Auto Memory 让 Claude Code 在本地文件里记住以后还可能用到的偏好、命令和项目经验。它省心，但没有打算把每次会话过程完整存下来，也没有把多台机器、多名开发者、多种 Agent 的历史统一到一个搜索入口。

第三方插件主要解决的就是这两个问题。

**[`claude-mem`](https://github.com/thedotmack/claude-mem) 关心的是会话过程。** 它通过 Lifecycle Hooks 记录会话和工具观察，再交给本地 Worker 处理。

它有几个关键组件：默认端口 `37777` 的 Worker Service、SQLite 里的 sessions / observations / summaries、Chroma 向量库、`mem-search` skill 和 MCP Tools。

这种方案适合回看历史过程，比如：上次为什么暂停支付模块合入？、之前哪个命令查过慢查询？。

代价也跟着上来：worker、数据库、索引、权限都要维护。

**[`memsearch`](https://github.com/zilliztech/memsearch) 更像外置 Memory Store。** 它用每日 Markdown 保存原始内容，Milvus 做向量索引缓存，检索时结合语义向量、BM25 和 RRF。

它适合多工具、多成员、长周期项目，比如 Claude Code、OpenClaw、OpenCode、Codex CLI 共用一套记忆。

这类方案比本地 Markdown 重得多。索引、嵌入模型、Milvus Lite 或云端 Zilliz、同步策略、数据权限，都要有人负责。记忆还只有几十条时，通常没必要上到这一层。

**如何选择呢？**

单人项目想让 Claude 记住测试命令、提交习惯和项目偏好，先用 `CLAUDE.md` 加 Auto Memory。团队共享稳定规则，就放进仓库里的 `CLAUDE.md`、`.claude/rules/` 或正式文档，让改动走 review。

需要自动保存会话过程，再看 `claude-mem` 这类 Hooks 加本地数据库的方案。

多个 Agent、多台机器、多名开发者共享长期记忆，才考虑 `memsearch`、Mem0 或自建数据库。

至于 BM25、向量检索和 reranker，更适合几万条文档、工单、Wiki 混在一起查的场景。

## 如何做一套轻量级记忆系统

如果你想给团队做一套轻量记忆系统，可以先定文件结构和写入规则。

`CLAUDE.md` 只放每次会话都必须知道的内容，比如测试命令、提交规范、禁改目录。目录或文件类型相关的规则，不要继续往这个文件里塞，放进 `.claude/rules/`，再用 `paths` 控制加载范围。

长期记忆单独放到 `memory/` 目录。刚开始别分太细，四类够用：`user` 放用户长期偏好，`feedback` 放用户明确纠正过的做法，`project` 放阶段性决策和短期冻结规则，`reference` 放资料入口。每个 topic file 里写 `created_at`、`updated_at`、记录原因和适用范围；依赖当前代码状态的内容，打开以后先核对再用。

![轻量记忆系统落地](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-lightweight-memory-system.webp)

这个版本可以先手工维护。它不酷，但脏数据少，团队能审阅，删错了也能从 Git 里找回来。等人工索引真的开始拖慢使用，再加自动摘要、全文检索或向量检索也不迟。

目录不用一开始就设计得很复杂。先让索引、用户偏好、明确反馈、项目决策和资料入口各有位置就够了：

```text
memory/
├── MEMORY.md
├── feedback/
│   └── integration-test-real-mysql.md
├── project/
│   └── payment-freeze-before-2026-06-30.md
├── reference/
│   └── slow-query-wiki.md
└── user/
    └── backend-preferences.md
```

`MEMORY.md` 不负责解释来龙去脉，只做入口。它告诉 Claude 现在有哪些记忆，以及需要细看时该打开哪个文件：

```markdown
# Memory Index

- [Integration tests use real MySQL](feedback/integration-test-real-mysql.md): 数据库行为相关集成测试必须连接真实 MySQL。
- [Payment freeze before 2026-06-30](project/payment-freeze-before-2026-06-30.md): 2026-06-30 前支付模块暂停合入新需求。
- [Slow query wiki](reference/slow-query-wiki.md): 线上慢查询排查入口在内部 Wiki 的 db-slow-log 页面。
```

解释、背景和适用范围放到 topic file 里。这样 `MEMORY.md` 可以一直很短，适合常驻；后面要改、要删、要 review，也能直接看对应文件的 diff。

## 总结

Claude Code 的记忆靠外部文件、索引和加载规则起作用，不是模型自己把历史存在脑子里。

`CLAUDE.md` 适合写稳定规则，`.claude/rules/` 适合写按路径触发的规则，Auto Memory 适合留下 Claude 工作中发现的偏好和经验。`MEMORY.md` 别写成小作文，做索引就够了；原因、适用范围、过期时间这些细节，放到 topic file 里。

比起怎么搜得更准，我更在意什么东西别写进去。临时日志、当前文件行数、一次性报错、Agent 自己猜出来的偏好，留在本轮上下文里就行。长期记忆一旦写进去，后面就要有人核对、更新和删除。

第三方工具按需求再加，千万别为了用而用，能保持简单就是最好的。想保存会话过程，`claude-mem` 更贴近；想让多工具、多成员共用一套记忆，再看 `memsearch`、Mem0 或自建库。记忆只有几十条时，先别急着上向量库，文件索引通常已经够用。

我的建议很简单：先把 `CLAUDE.md` 和 `.claude/rules/` 写清楚，再让 Auto Memory 或手工 `memory/` 只留下少量高价值经验。等记忆真的多到人工索引拖不动、协作角色也变复杂了，再考虑数据库、BM25、向量检索和 reranker。

让 Agent 记住一切没什么意义。更可靠的做法，是让它知道下一步该去哪里核对。

## 参考资料

- Claude Code 官方文档：[How Claude remembers your project](https://code.claude.com/docs/en/memory)
- Claude Code 官方文档：[Subagents](https://code.claude.com/docs/en/sub-agents)
- Claude Code 官方文档：[Agent Teams](https://code.claude.com/docs/en/agent-teams)
- Claude Code 官方文档：[Hooks guide](https://code.claude.com/docs/en/hooks-guide)
- GitHub：[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- MindStudio：[Claude Code Memory Systems Explained](https://www.mindstudio.ai/blog/claude-code-memory-systems-compared)
- Milvus：[Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix](https://milvus.io/zh/blog/claude-code-memory-memsearch.md)


---

---

<!-- source: 原则/Claude Code 上下文管理详解-窗口预算、压缩与长任务治理.md -->

## [27] Claude Code 上下文管理详解：窗口预算、压缩与长任务治理

---
title: Claude Code 上下文管理详解：窗口预算、压缩与长任务治理
description: 从 Claude Code 的上下文窗口出发，讲清固定与动态开销、Context Rot、工具结果清理、AutoCompact、Context Reset、Sub-agent 隔离和 handoff，帮助你管理长任务中的信息流与任务状态。
category: AI 编程原理
tag:
  - Claude Code
  - 上下文工程
  - Context Management
  - AI 编程
head:
  - - meta
    - name: keywords
      content: Claude Code,上下文管理,Context Engineering,上下文窗口,Context Rot,AutoCompact,/compact,Sub-agent,Context Reset,长任务,AI编程
---

大家好，我是小 G。最近星球里有不少 G 友分享 Agent 岗位的面经，我看了一下，发现问到上下文管理的次数比较多。

![Claude Code、Skills 与上下文工程面试题记录](https://oss.javaguide.cn/github/javaguide/ai/claude-code/claude-code-context-management-interview-questions.png)

我在之前的文章中已经分享过一篇： [上下文工程(Context Engineering) 是什么？和 Prompt Engineering 有什么区别？](https://javaguide.cn/ai/agent/context-engineering.html)，介绍了上下文管理的核心内容。

所以，这篇想结合最顶级的 Coding Agent——Claude Code，进一步挖掘一下底层思想。

它不只是怎么压缩聊天记录，还关系到任务目标、工具输出、文件记录和交接信息分别该留在哪里。

Claude Code 执行 `/compact` 后，会用结构化摘要替换此前的会话历史，并重新加载部分持久化指令。

摘要通常会保留任务目标、重要约束、关键决策、当前进度和相关代码线索，但不保证保留完整的文件内容、检索结果及测试输出。后续如果需要这些材料的精确内容，应重新读取或重新执行。

长任务真正要解决的，是把信息放在合适的位置：窗口只保留眼下要用的材料；可复查、可复用的内容写入文件；切换会话时，只交接下一步所需的结论和线索。清理工具输出、压缩历史、持久化文件、使用子代理和进行会话交接，都是为此服务。

本文涉及两类材料。官方文档能确认的行为按文档描述；文中提到的“逆向观察”和“源码里能看到”，主要来自 Claude Code 2.1.x 附近的非公开源码材料与社区整理，不属于官方稳定接口。

## Claude Code 架构全景

![Claude Code 架构全景](https://oss.javaguide.cn/github/javaguide/ai/claude-code/ctx-mgmt-arch-arch.png)

窗口承压时，可以直接清理工具结果、压缩历史、重置上下文，或者把支线隔离到子代理。Skills 的按需加载、任务状态写入文件系统，以及后台任务的独立执行，也会改变可用预算。

运行中的 Claude Code 需要直接访问系统提示词、工具定义、项目规则、对话历史、工具结果和最近读过的文件。上下文窗口就是承载这些材料的工作内存。

其中混入过期日志、重复搜索结果或互相冲突的旧判断后，Agent 更容易漏约束、重复探索或过早收尾。

在 `Agent = Model + Harness` 这个公式里，模型提供推理能力，Harness 负责信息获取、工具调用和任务推进。上下文管理属于 Harness：它决定当前窗口保留哪些状态，清理哪些临时结果，以及哪些内容应写到窗口外。

![Agent = Model + Harness](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-agent-equals-model-harness-arch.png)

面试中问到这类问题，考察的通常是能否把 Agent 看作一个有状态系统。它和传统后端系统有一些相似之处（以下类比用于帮助理解，不是机制等价）：

| Agent 概念     | 后端类比              | 共同点                       |
| -------------- | --------------------- | ---------------------------- |
| 上下文窗口     | JVM 堆内存            | 容量有限，塞满后质量下降     |
| Compaction     | GC                    | 回收旧内容，保留还活着的状态 |
| Context Reset  | 进程重启 + 检查点恢复 | 丢掉脏历史，从交接状态继续   |
| Sub-agent 隔离 | 微服务拆分            | 独立上下文处理局部任务       |
| Context Rot    | 缓存污染 / 内存泄漏   | 旧信息越积越多，拖慢判断     |
| 工具结果清理   | LRU 缓存淘汰          | 近期内容保留，过期内容清掉   |

Prompt Engineering 和 Context Engineering 的区别也在这里。前者关心单次输入怎么写，后者关心整个会话里的信息怎么流动。

你把 System Prompt 写得再详细，也没办法搞定上下文管理。这反而会起到反作用，增加固定开销，让窗口更早进入高压区/危险区。

![Context Engineering 和 Prompt Engineering 差别](https://oss.javaguide.cn/github/javaguide/ai/上下文工程/context-engineering-vs-context-engineering-dimension-comparison.png)

## 窗口预算与信息加载

### 窗口里有哪些开销

普通聊天里，用户通常一轮发一段话，偶尔贴一段代码。Claude Code 不一样。它启动时就带着工具和规则，执行任务时还会自己读文件、跑测试、查 Git 历史、调用 MCP。

文件内容、命令输出和对话历史会持续进入窗口。一次只讨论一个问题，和一次读取几十个文件、跑完整测试，带来的上下文增量完全不同；后者更容易让 Claude 漏掉早期约束、重复搜索，或在已经排除的方向上继续打转。

更强的模型只能推迟这类退化，并不改变输入持续增长的事实。

窗口占用可以分为两部分：启动时就存在的 System Prompt、规则和工具注册，以及任务中不断追加的工具结果和对话历史。前者决定会话起步时的余量；读文件、跑命令和收集日志会不断推高后者。

![上下文窗口（Context Window）= LLM 的工作记忆](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-context-window.png)

启动开销主要来自 System Prompt、`CLAUDE.md`、Skills 描述和部分工具信息。观察到的实现会尽量延迟加载一部分 MCP 工具定义：

- 在 ToolSearch 启用、且工具没有被配置成“启动时强制加载”时，部分 MCP 工具会先只暴露名称；
- 等模型真的选中这个工具，再把完整 JSON Schema 拉进来；
- 也有一些工具会在启动时就加载完整描述。

规则文件写得越长、Skills 和 MCP Server 越多，起步时剩下的空间就越少。

想看当前会话实际占用，可以使用 `/context` 命令。它会把当前模型窗口、已用 Token、剩余空间，以及 System Prompt、工具、Skills、消息等分类占用列出来。

![Claude Code /context 命令运行结果](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-context-command-result.png)

动态内容里，工具调用通常是大头。一个几百行的源文件可能就是几千 Token；搜索结果和测试日志可能更长。工具调用参数和结果会进入当前会话，文件内容、命令输出和搜索结果会随着任务推进不断累积。接近窗口上限时，Claude Code 会先清理较旧的工具结果，空间仍然不够时再压缩会话。

上下文变长还会影响信息利用效果。输入越多，延迟和成本通常也会增加。模型也不一定能同等利用窗口里的每段内容，相关信息位于长上下文中间时，模型的检索和问答表现可能下降，这类位置敏感现象通常被称为 Lost in the Middle。窗口变大能装下更多信息，但不能保证这些信息都会被稳定使用。

这就是我们常说的上下文腐化（Context Rot）问题。**上下文越长，信息越杂，模型利用上下文的稳定性就越可能变差。**

![上下文腐化](https://oss.javaguide.cn/github/javaguide/ai/harness/context-rot-diagram.png)

Claude Code 每次调用 LLM 时，窗口里通常有这些内容：

| 组成部分         | 内容                                                             | 性质               |
| ---------------- | ---------------------------------------------------------------- | ------------------ |
| 会话初始化上下文 | System Prompt、`CLAUDE.md`、无条件 `.claude/rules/`、Auto Memory | 固定开销           |
| 路径规则         | 带 `paths` 的 `.claude/rules/`                                   | 读取匹配文件时加载 |
| MCP 和工具描述   | 内置工具定义、MCP 工具名称及已加载的 Schema                      | 固定或按需         |
| Hook 注入内容    | Hook 显式返回的 additionalContext、提示或工具反馈                | 动态注入           |
| Skills           | 默认加载简短描述；正文在调用后进入上下文                         | 按需加载           |
| 对话历史         | 用户消息、Claude 回复                                            | 持续增长           |
| 工具调用及结果   | 调用参数、返回值、日志、文件内容                                 | 持续增长           |
| 环境和 IDE 状态  | 工作区、选中代码等客户端或集成提供的信息                         | 按配置注入         |
| 子代理汇报       | Sub-agent 返回的摘要和少量元数据                                 | 按需               |

固定开销通常不会随着对话轮次增长，但它决定了任务开始时还剩多少空间。动态内容才是长任务里的主要增量。同样是 20 轮对话，只聊天和每轮都读文件、跑测试，最终占用可能差很多，因此不能单纯用轮数判断上下文压力。

Prompt Caching 能省成本和延迟，但不能释放上下文空间。即使 System Prompt、工具定义和 `CLAUDE.md` 命中缓存，它们仍然属于当前请求的输入内容。

Extended Thinking 也要算进这笔账。当前轮的 thinking budget 属于 `max_tokens` 的一部分，会按输出 Token 计费，也会计入速率限制。

更容易被忽略的是历史 Thinking Blocks。按当前 API 文档，Opus 4.5 及之后的 Opus、Sonnet 4.6 及之后的 Sonnet、Fable 5、Mythos 5 和 Mythos Preview 默认会保留历史 Thinking Blocks。

更早的 Opus / Sonnet 和 Haiku 模型会自动从上下文里剥离这些历史块。所以，长会话里的 Thinking 是否持续占窗口，取决于具体模型和配置。

如果同时使用工具，规则更严格：返回 `tool_result` 时必须把本轮工具调用对应的 Thinking Block 原样带回，包括 `signature`。工具循环结束后，是否继续保留，再按模型默认行为或 context editing 配置处理。

### 有效窗口和触发阈值

概念上，有效窗口可以这么估：

```text
有效上下文 ≈ 总窗口容量 - 固定开销 - 历史开销
```

源码大概是这样的逻辑：

```typescript
function getEffectiveContextWindowSize(
  modelWindowSize: number,
  maxOutputTokens: number,
): number {
  const reservedForSummary = Math.min(maxOutputTokens, 20000);
  return modelWindowSize - reservedForSummary;
}
```

这里的返回值用于后续警告、自动压缩、阻塞等判断。`getEffectiveContextWindowSize()` 只负责从模型窗口中扣除摘要输出预留。System Prompt、规则、消息历史和工具结果已经包含在实际 Token 使用量中，不会在这个函数里逐项扣除。

这些阈值同样来自上述材料，不属于公开稳定接口，后续版本可能调整。

几个常量值：

| 常量                              | 值     | 用途                                                                |
| --------------------------------- | ------ | ------------------------------------------------------------------- |
| `AUTOCOMPACT_BUFFER_TOKENS`       | 13,000 | 相对有效窗口再提前触发 AutoCompact 的缓冲带，让压缩在仍有余量时启动 |
| `WARNING_THRESHOLD_BUFFER_TOKENS` | 20,000 | 请求前预警，提示可以手动 `/compact`                                 |
| `ERROR_THRESHOLD_BUFFER_TOKENS`   | 20,000 | 标记上下文进入危险区                                                |
| `MANUAL_COMPACT_BUFFER_TOKENS`    | 3,000  | 手动压缩时的最小安全余量                                            |

这里有两个数字容易混。

`reservedForSummary = min(maxOutputTokens, 20000)` 负责**预留摘要输出空间**。源码注释里提到摘要 p99.99 约 17.3K，所以 20K 上限能覆盖这类极端输出。

`AUTOCOMPACT_BUFFER_TOKENS`（13K）在有效窗口上限前留出缓冲带，并在仍有余量时启动 AutoCompact。摘要输出空间由 20K 预留承担。

13K 只是 AutoCompact 的 buffer；摘要 p99.99 注释对应的是 20K 摘要输出预留。这样设计的好处是可预测：模型窗口从 200K 扩到 500K 时，摘要侧输出预算不会跟着等比例膨胀。

真正独立的阶段主要是预警、AutoCompact 和阻塞上限。`isAboveAutoCompactThreshold` 触发 AutoCompact；`isAtBlockingLimit` 阻止新请求，强制压缩或重置。

参考实现里还保留了 `isAboveWarningThreshold` 和 `isAboveErrorThreshold` 两个状态字段。观察到的版本中，两者使用相同的 20K 阈值，所以 Token 触发点一致。它们可能在不同 UI 或调用路径里承担不同用途，但不代表两个独立的占用区间。

请求发出前的判断链大概是（以下为社区提取的源码镜像中的实现，不是 Anthropic 承诺稳定的 API）。这条链路默认按 AutoCompact 开启时理解；如果 AutoCompact 关闭，warning / error 会退回以有效窗口为基准：

```typescript
reservedForSummary = min(maxOutputTokens, 20_000)
effectiveWindow = modelWindow - reservedForSummary

autoCompactThreshold = effectiveWindow - 13_000
warningThreshold = autoCompactThreshold - 20_000
errorThreshold = autoCompactThreshold - 20_000
blockingLimit = effectiveWindow - 3_000

if currentUsageEstimate >= warningThreshold:
  给出上下文预警

if currentUsageEstimate >= autoCompactThreshold:
  触发 AutoCompact

if currentUsageEstimate >= blockingLimit:
  阻止新请求，要求手动 compact 或重置
```

以 200K 窗口和 20K 摘要预留为例，有效窗口为 180K。AutoCompact 在 167K 触发，预警 / 错误线为 147K，阻塞线为 177K；预警和错误线都由 AutoCompact 线继续减去 20K 得出。

### 信息怎么进上下文

定位 `TokenRefreshService` 的调用方时，先用 `Grep` 找到符号，再根据 `tests/test_utils.py` 与 `src/core_logic/test_utils.py` 这类路径判断文件角色。确认相关后才用 `Read` 打开片段；`ls`、`find`、`git log` 和测试命令在需要补证据时执行。

Read、Glob、Grep、Bash 和子代理沿着任务逐步取材，开始时不需要为整个仓库建立向量索引。路径、符号、导入关系和最新文件状态用于缩小范围；调用关系仍以源码和验证结果为准。

自然语言问答或概念检索可以通过 MCP、插件或自定义 Skill 接入 RAG（Retrieval-Augmented Generation）。代码探索时，RAG 返回的片段还要和关键词搜索、符号分析、直接读取一起验证。

这类定位先看目录和文件名，再落到关键行；确认需要时才展开完整内容：

| 设计决策       | 具体做法                                                 | 好处                                               |
| -------------- | -------------------------------------------------------- | -------------------------------------------------- |
| 元数据即信息   | 文件路径、目录结构、时间戳、文件大小本身就是有价值的信号 | 不读内容就能做初步判断                             |
| 按需加载       | 只在需要时读具体文件，不预加载全部内容                   | 上下文始终只装必要信息                             |
| 迭代深入       | 先粗后细：目录 → 文件名 → 关键行 → 完整内容              | 减少无效探索的上下文消耗                           |
| 直接探索工作区 | 使用 Glob、Grep、Read、Git 和测试工具逐步定位            | 无需提前维护独立索引，读取结果通常与当前工作区一致 |

我们之前聊过很多的 Skill，也是类似的顺序：启动时只加载元数据，模型决定调用后才取具体文档。详细机制可以看我写的这篇：[Agent Skills 是什么？和 Prompt、MCP 到底差在哪？](https://javaguide.cn/ai/agent/skills.html "Agent Skills 是什么？和 Prompt、MCP 到底差在哪？")。

文档、知识库和历史记录适合先经 RAG 召回。路径、配置、依赖和测试结果持续变化的代码仓库，则需要边搜索、边读取、边验证；搜索词选错时会多走几轮，跨仓库检索、概念检索或大型单体项目也可能更适合语义索引。

| 场景                         | 更适合的方式           |
| ---------------------------- | ---------------------- |
| 查知识库、文档、历史记录     | RAG                    |
| 探索代码仓库、配置、目录结构 | Progressive Disclosure |
| 既有文档又有代码的大项目     | 两者结合               |

Cursor 这类 AI IDE 会做 Codebase Indexing，用索引辅助低延迟补全和快速问答。Claude Code 的任务还要经过读取、判断和验证，因此工具驱动的多轮探索占比更高。

## 上下文为什么会退化

长任务里，窗口扩大后会同时装入更多约束、日志和旧判断，当前决策所需的材料因此更难被稳定取用。一些社区实践把 40% 左右当作清理或压缩的提醒线；模型、任务类型和上下文结构不同，出现波动的位置也会变化。

![社区经验中的上下文利用率管理线](https://oss.javaguide.cn/github/javaguide/ai/harness/context-utilization-40-percent-threshold-phenomenon.svg)

第 3 轮写下“不要改数据库 schema”，到第 30 轮时，这条限制可能被搜索结果和测试日志夹在中间。这类开头与结尾更容易被注意、中间内容容易遗漏的现象，通常称为 **Lost in the Middle**。

根级 `CLAUDE.md` 和无路径限制规则会在压缩后重新注入；当前用户输入与最近工具结果位于消息末尾；旧工具返回值和过时对话会优先被清理。三者共同降低关键限制被旧内容淹没的概率。规则仍是模型指令，安全限制应交给权限规则、Sandbox 或 `PreToolUse` Hook。

窗口接近上限时，剩余空间还要留给输出和错误恢复。历史继续增长，模型可能在任务未完成前提前收束；Anthropic 将这种现象称为 **Context Anxiety**。

[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps "Harness design for long-running application development")这篇文章中的完整描述如下：

![context-anxiety-harness-design-long-running-apps](https://oss.javaguide.cn/github/javaguide/ai/claude-code/context-anxiety-harness-design-long-running-apps.png)

旧判断、重复搜索结果、已解决问题和无用日志也会消耗注意力，即使窗口还没有临界。它们在每轮请求里反复出现，新决策却可能只有一句；这种信噪比下降的状态称为 **Context Rot**。窗口变大只能延后压力，信息过多仍会让中间位置的限制被遗漏，最后还可能进入 Context Anxiety。

## Claude Code 怎么治理上下文

工具结果可以重新获取，就不用一直占着窗口。Claude Code 会先处理这一层，再压缩历史；仍接不上任务时，才重置上下文或把支线交给子代理。

### 先清工具结果

一次 `Read` 可能返回 500 行，一次测试也可能刷出几千行日志。它们很占空间，但原始内容可以再次读取，先处理这部分的信息损失相对较低，也不需要额外调用模型。

在本文参考的 2.1.x 附近实现里，大工具结果会写入会话存储里的 `tool-results`，通常位于 `~/.claude/projects/...` 对应的会话数据下；窗口里只保留预览和文件引用。

默认阈值是约 50,000 字符，不是 50KB。不同工具还可能有更低阈值，比如 Bash / PowerShell 约 30,000 字符，Grep 约 20,000 字符。同一条消息里的工具结果合计超过约 200,000 字符时，也会优先把最大的结果写盘。

这里有个例外：`Read` 工具结果豁免 `maxResultSizeChars = Infinity`。这类没有有限阈值的工具，通常不会被 Tool Result Budget 当作大结果处理。否则会出现“读文件 -> 太大写盘 -> 摘要看到路径 -> 又读回来”的循环。

工具结果还可能由 Tool Result Budget 处理。这条路径受版本和实验开关影响，并非所有环境都会启用。其状态可分为 `mustReapply`、`frozen` 和 `fresh`。

`mustReapply` 表示之前已经被持久化或替换过的工具结果，需要重新应用替换内容；`frozen` 是已经见过、暂不再处理的结果；`fresh` 是新近产生的工具结果，在单消息预算超限时可能被挑出来写盘替换。

参考实现还包含 Snip 和 MicroCompact。Snip 删除一段历史 range 后会重连消息链，并将释放的 Token 数交给后续 AutoCompact 判断，避免刚释放空间就再次过度压缩。

MicroCompact 会把旧工具结果替换为 `[Old tool result content cleared]`。调用和引用关系仍留在消息链中，大段返回内容则被移除。

**为什么不直接删整条消息？**

后续消息可能仍引用前面的 `tool_use` ID。若直接删除调用记录，消息链会断开，模型也无法判断哪些操作已经完成。代价是丢失具体内容；后续需要精确行号时，仍要重新读取文件。

请求发出前或出现上下文压力提示时，MicroCompact 会保留最近的若干工具结果，并替换更早的结果。如果当前环境、模型或 Sub-agent 路径不支持它，流程会跳过该步骤，后续由 AutoCompact 继续处理。

另一条入口与 Prompt Cache 过期有关。两次 API 调用相隔较久、服务端缓存可能失效时，发送前清掉旧工具结果可避免全量重传继续膨胀。这条路径默认关闭，并受 GrowthBook gate 控制。

参考实现中还出现 cache prefix / cache sharing 路径：压缩时会尝试复用缓存前缀，失败后回退到常规压缩。它属于版本相关的缓存优化，不应视作稳定能力。

这层清理的边界要看信息能不能重新获取。Read、Grep、Glob、日志查询这类输出，后续需要时大多能重新跑；Edit、Write 这类有副作用的工具，不应该靠重放输出来恢复状态，而要回到文件系统里核对。子代理分析结果、任务状态快照这类一次性产物也不能随便清，因为丢了就真丢了，只能靠摘要或附件保住。

### 再压缩历史

工具结果清理完还不够，才轮到历史压缩。AutoCompact 不是唯一的压缩手段。接近窗口上限前，Claude Code 会先尝试清理较旧的工具输出；释放空间仍然不够时，才需要把会话压缩成摘要。

工具结果清掉以后，对话历史还在涨。到一定程度，就需要把旧历史改写成状态摘要。在本文观察的实现里，这件事会走一条多级流水线。官方文档能确认的是：接近上限时会先清旧工具结果，不够再摘要会话。

![五级渐进压缩流水线](https://oss.javaguide.cn/github/javaguide/ai/claude-code/ctx-mgmt-pipeline-flow.png)

| 级别 | 名称         | 动作                                       | 信息损失   | API 成本 |
| ---- | ------------ | ------------------------------------------ | ---------- | -------- |
| 0    | 大结果存磁盘 | 超过阈值的工具输出写入会话存储             | 极低       | 无       |
| 1    | Snip         | 删除一段历史 range，并重连消息链           | 极低       | 无       |
| 2    | MicroCompact | 清掉旧工具结果内容，或走 API 层 cache edit | 低到中     | 无       |
| 3    | Collapse     | 把已完成消息组折叠成状态快照               | 中         | 低       |
| 4    | AutoCompact  | 调度 Session Memory 或 LLM 全量摘要        | 取决于路径 | 高       |

大结果写盘、Snip 和 MicroCompact 能处理一部分会话。窗口占用继续上升时，流程才会进入 Collapse 或 AutoCompact。

Collapse 也属于这部分实现，比 AutoCompact 更轻。调用 API 时，它动态生成压缩视图：完整历史留在本地，模型接收折叠后的版本。

这个思路可以理解成 **视图与存储分离** 。按该实现观察到的阈值，约 90% 利用率时，Collapse 开始处理已完成消息组；约 95% 利用率时，会阻止新的 Sub-agent spawn，避免继续给上下文加压。

因为 Collapse 的信息损失更小，它通常会先于 AutoCompact 激活。折叠后仍然不够，才进入更重的全量摘要。Collapse 这类分层细节不要当成公开稳定接口。

AutoCompact 会用一份新的状态摘要替换旧聊天记录。目标、进度、决策和待办会被保留，读过哪些文件、搜过哪些关键词以及测试输出全文通常不会；需要这些细节时，Agent 需重新从文件系统读取。

![AutoCompact 压缩前后对比](https://oss.javaguide.cn/github/javaguide/ai/claude-code/ctx-mgmt-compare.png)

手动 `/compact` 与自动压缩使用同类能力，但输入参数不同。手动调用可以明确指定摘要必须保留的内容；自动调用会打开 `suppressFollowUpQuestions`，避免摘要器在中途追问。

阶段结束、`/context` 显示占用明显升高，或工具调用开始重复时，可以主动执行 `/compact` 并指定保留重点：

```text
/compact 保留数据库 schema、支付状态机和当前失败用例
```

### 压缩恢复和兜底

第三层处理压缩后的恢复和失败兜底。

**Session Memory** 是 Full Compact 前的一条快速路径。这里说的 Session Memory，是内部实现里用于压缩的会话辅助状态，不是 Claude Code 官方文档里的 Auto Memory。它会按 Token 增长和工具调用节奏刷新结构化会话笔记；触发 AutoCompact 时，如果这份笔记加上近期消息、附件和 Hook 结果已经能压到阈值以下，就可以跳过 Full Compact。

这两个名字容易混，可以先拆开看：

| 对比 | Session Memory                              | Auto Memory                                                |
| ---- | ------------------------------------------- | ---------------------------------------------------------- |
| 定位 | 当前会话里的压缩辅助笔记                    | 跨会话的项目经验记忆                                       |
| 来源 | 内部流程按 Token 增长和工具调用节奏刷新     | Claude 根据纠正、偏好和项目经验写入                        |
| 作用 | 给 AutoCompact 复用，减少 Full Compact 概率 | 会话启动时加载，给 Agent 提供长期偏好和经验                |
| 存储 | 内部实现细节，版本相关                      | `~/.claude/projects/<project>/memory/`，`MEMORY.md` 是索引 |

它也有成本，Session Memory 的更新本身需要后台模型调用。它减少的是临近窗口上限时再做一次大规模摘要的概率，同时把压缩工作分摊到了会话执行过程中。

在本文观察的实现里，Session Memory 不是会话一开始就启动。首次达到约 10,000 Token 后才初始化。

后续更新也有节奏：通常要再增长约 5,000 Token，并且累计一定数量的工具调用，或者刚好处于没有工具调用的自然断点，才会刷新笔记。

笔记模板按固定章节组织，比如 Current State、Task specification、Files and Functions、Errors & Corrections 等。每个 section 的软上限约 2,000 Token，全文硬上限是 12,000 Token；超过硬上限时，会提示模型 `MUST condense`。

在 Session Memory compact 开启、且已有有效 Session Memory 时，AutoCompact 会优先尝试复用它：用笔记、近期消息、附件和 Hook 结果组装新消息链，估算 Token 是否低于阈值。如果能降到阈值以下就跳过 Full Compact；如果笔记为空、消息边界找不到，或者组装后仍然太大，则退回完整摘要。

**Full Compact** 自己也可能因为输入太长而报 `prompt_too_long`。在手动 `/compact` 或 AutoCompact 触发 Full Compact 时，如果摘要请求自身报 `prompt_too_long`，系统会进入 **PTL（Prompt Too Long）** 兜底路径。

按 API round 分组的目的，是保证 `tool_use` 和 `tool_result` 不被拆散。如果错误里带了 `tokenGap`，系统可以按超出的 Token 量更精确地丢弃；没有 `tokenGap` 时，就会按更粗的比例处理，比如先丢掉约 20% 的旧消息组。Reactive Compact 是另一条从 API `prompt_too_long` 错误恢复的路径，也会截断消息后重试；具体截断方向和策略属于版本相关实现，不建议统一写死。

这套实现里的 **Partial Compact** 同时解决两个问题：只压缩一段历史以减少状态损失，以及在某些方向上尽可能保留缓存前缀。Full Compact 通常会重建主要消息链，原缓存前缀基本失效；Partial Compact 只压缩一段历史，尽量保留一端消息以复用缓存。压缩不能只看压缩率，还要看压完以后缓存、接续、信息损失三件事怎么平衡。

Partial Compact 有两个方向：

1. `from`：压缩 pivot 之后的消息，保留更早的部分。适合已经有一段早期摘要的长会话，同时更有利于复用缓存前缀；
2. `up_to`：压缩 pivot 之前的消息，保留最近的部分。适合 Agent 正在处理某个文件或 Bug，中间状态不应被摘要打断。但由于摘要插到了保留消息之前，原缓存前缀通常会失效。

Full Compact 使用的是一份结构化摘要 Prompt，不是简单要求模型“总结一下”。

Full Compact 的摘要 Prompt 会在首尾限制工具调用：该步骤只应产出文字，不应再执行 `Read`、`Write` 或 `Bash`，否则会引入新的工具结果。模型先在 `<analysis>` 中整理信息，再把后续会话需要的内容写入 `<summary>`；只有后者会成为接续材料。

`<summary>` 按固定章节组织，包括 Primary Request and Intent、Key Technical Concepts、Files and Code Sections、Errors and fixes、Problem Solving、All user messages、Pending Tasks、Current Work 和 Optional Next Step。

`All user messages` 记录的不只是历史：用户补充的需求、方向和限制会改变后续判断，遗漏后 Agent 可能接错任务。`Current Work` 也应写明文件名、函数名、失败用例和下一条命令；“正在排查模块问题”不足以让压缩后的 Agent 直接继续。

参考实现还显示，不同模型版本对压缩 Prompt 的遵循程度可能不同。例如在特定配置下，新版模型尝试调用工具的比例明显高于旧版。也就是说，压缩规则要随模型版本重新验证，不能假设一句“不要调用工具”在所有模型上都同样管用。

压缩完成后，Claude Code 会在本地会话事件 / JSONL 中写入 `subtype: "compact_boundary"` 的 system 记录。样例里的 `compactMetadata` 主要记录 `trigger`、`preTokens` 等信息，部分路径还会带 `preservedSegment`。压缩后的 Token 数可能出现在压缩结果或 telemetry 里，不适合当成 boundary metadata 的稳定字段。边界标记告诉后续加载器：历史在这里已经被摘要替换，别把它当成普通对话继续拼。

本地记录里能看到类似这样的结构，字段会随版本变化：

```json
{
  "type": "system",
  "subtype": "compact_boundary",
  "content": "Conversation compacted",
  "compactMetadata": {
    "trigger": "manual",
    "preTokens": 160442,
    "preservedSegment": {
      "headUuid": "...",
      "anchorUuid": "...",
      "tailUuid": "..."
    }
  }
}
```

Full / Partial Compact 结束后，新的消息链通常包含边界标记、摘要消息、附件和 Hook 结果。Session Memory compact 的恢复范围更窄，主要围绕 summary、保留消息、plan 和 hook。最近访问的文件、活跃计划、当前 Skill、后台任务状态会受到数量和 Token 预算限制；System Prompt 则不参与摘要，压缩后会重新组装最新的工具列表、权限设置和 MCP Server 列表。

压缩后不应把此前读过的文件全量重新加载，否则很容易回到“压缩 -> 膨胀 -> 再压缩”的循环。恢复当前任务必需的文件即可。

系统会重新估算边界标记、摘要、恢复附件和 Hook 结果构成的实际消息载荷；若其仍接近阈值，下一轮可能立刻再次压缩。部分临时状态和缓存也会按实现路径重置，具体清理项随版本变化。

附件恢复需要按相关性取舍。最近访问的文件、活跃 Plan、正在使用的 Skill 和后台任务状态都可能帮助 Agent 接续任务，但也会占用窗口。源码路径常按最近访问、文件数 / Token 预算、排除规则和 preserved tail 去重约束筛选；例如处理支付状态机时，应恢复状态机文件、失败测试和相关计划，而非此前顺手读过的日志或无关模块。

项目根级 `CLAUDE.md` 与无路径限制规则会在压缩后从磁盘重新注入，无需重复写入摘要。子目录 `CLAUDE.md` 和带 `paths` 的规则则会等到再次读取匹配文件时才重新加载。

为压缩选择更便宜的模型时，要同时评估摘要保真度、额外探索成本和缓存命中情况。模型价格只是一个变量，判断标准仍是压缩后能否准确接续任务。

### 重置、隔离和断路器

第四层就不再执着于“把旧窗口救回来”了。Compaction 是在旧上下文上修补，修补次数多了，细节损失会叠加。到了某个点，继续压不如直接重开。Context Reset 的做法是清空窗口，把当前状态写成交接文档，新的 Agent 从交接文档恢复。

![上下文重置交接流程](https://oss.javaguide.cn/github/javaguide/ai/claude-code/ctx-mgmt-reset-flow.png)

Anthropic 在基于 Sonnet 4.5 的特定长任务 Harness 中观察到，模型接近上下文上限时会草草收尾，也就是 Context Anxiety。这个场景下，单靠 Compaction 不够。

Reset 配合结构化 handoff 的作用，是丢掉旧上下文，只用 handoff 留住关键信息，让新的 Agent 接着干。

但这不是长任务的固定必选步骤。后来切换到 Opus 4.5 后，同一个 Harness 已经可以移除 Reset，只依赖自动压缩。因此 Reset 更像模型和任务相关的工程手段，而不是通用流程。

Reset 的风险也清楚，交接材料是主要桥梁。它不一定只有一份 Markdown，也可以包括进度文件、失败测试记录、Git diff、任务列表和关键日志。漏了边界条件、临时决策、失败原因，新 Agent 就会在缺信息的状态下继续跑。

新会话要从上一次执行点继续，handoff 至少保存目标和完成标准、已完成工作、当前文件与函数、排除方案、失败用例或错误日志，以及接手后的第一步：

```text
1. 当前任务目标：一句话说明最终要交付什么
2. 已完成工作：列出已经改完和验证过的部分
3. 当前断点：写到文件、函数、测试用例或命令
4. 关键约束：不能改什么、必须兼容什么、用户特别强调过什么
5. 排除记录：试过哪些方案，为什么放弃
6. 当前故障：失败日志、报错栈、复现步骤
7. 启动动作：新会话接手后先看哪个文件或先跑哪条命令
```

只有“继续完成剩余任务”这一句时，改过的文件、失败测试和已排除的方案都不会随新会话出现。

分析几千行日志、跨文件定位或独立审查时，主会话通常不需要看到全部过程。Sub-agent 在独立窗口完成这些支线后，只回传摘要和必要证据；全文日志与中间试错留在子代理历史中。

![Claude Code Sub-Agent：让主对话保持干净](https://oss.javaguide.cn/github/javaguide/ai/coding/claudecode-sub-agent.png)

主会话只需根因和证据的日志任务适合拆出。任务小到几步就能完成、子任务频繁相互等待，或边界本身说不清时，调度和摘要反而会带来额外成本。

子代理启动时获得的上下文也不同：

| 模式                      | 上下文行为                                                                              | 适合场景                                 |
| ------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| Named / non-fork Subagent | 不继承父会话消息历史；但仍会加载工具 / 权限、`CLAUDE.md` / memory、Git 状态等运行上下文 | 隔离搜索噪声、日志分析、独立审查         |
| Fork                      | 继承父会话上下文，而不是从空窗口启动                                                    | 背景依赖重、需要沿用父会话状态的支线任务 |

两种模式都只把结果返回主会话。拥有 `Agent` 工具的子代理可以继续派生，深度到 5 层后不再提供该工具；Fork 不能继续生成 Fork。

主会话压缩后不会重新载入子代理的完整 transcript，只恢复摘要和少量元数据。

### 断路器

Circuit Breaker 是自动压缩的硬保护。官方文档说明：某个大文件或工具输出导致每次摘要后窗口迅速再次填满时，Claude Code 会在多次尝试后停止自动压缩，避免重复消耗 API 调用。

参考实现使用连续失败计数：AutoCompact 成功后清零，连续失败达到 `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES`（3）时，后续请求跳过 AutoCompact。

```text
自动压缩
  -> 摘要后很快再次填满，或者压缩失败
连续失败计数增加
  -> 达到 3 次后跳过 AutoCompact
```

没有这层保护，会话会陷入“压缩 -> 立刻膨胀 -> 再压缩”的循环。若 AutoCompact 未及时执行、API 已返回 `prompt_too_long`，Reactive Compact 会从错误中恢复，截断消息后重试。

### 总结

可以按信息是否可重新获取来安排处理顺序：

| 上下文压力来自哪里     | 优先处理方式                             | 代价                                 |
| ---------------------- | ---------------------------------------- | ------------------------------------ |
| 工具输出太长           | 写盘、MicroCompact，必要时 Snip 历史片段 | 信息损失低，通常不需要额外模型调用   |
| 对话历史太长           | Collapse、AutoCompact、Full Compact      | 会丢一部分过程细节，需要摘要质量兜底 |
| 主会话被搜索和日志拖脏 | Sub-agent 隔离支线任务                   | 多一次调度，主会话只接收摘要         |
| 压缩后仍然接不住任务   | handoff + Context Reset                  | 交接文档写漏了，新会话就会缺信息     |

日常使用时，先清理可重新获取的工具结果；历史过长再压缩；搜索、审查和日志分析交给 Sub-agent；压缩后仍无法稳定接续，再写 handoff 并重开会话。处理越靠后，信息损失和调度成本越高，因此不应一开始就 Reset。

## 长任务怎么落地

### 两个极端案例

Anthropic Labs 团队在 2026 年发了一个受 **GAN（Generative Adversarial Network，生成对抗网络）** 思路启发的三智能体架构：

![Anthropic 三智能体架构](https://oss.javaguide.cn/github/javaguide/ai/claude-code/ctx-mgmt-triagent-arch.png)

Planner 把 1-4 句话的产品描述扩成完整规格，Generator 按 Sprint 实现功能，Evaluator 再用 Playwright MCP 实际操作运行中的应用，并按产品设计深度、功能性、视觉设计和代码质量打分。角色分工让规划、实现和评估各自保有独立上下文。

早期基于 Sonnet 4.5 的 long-running Harness 用 Context Reset 缓解 Context Anxiety。到 Opus 4.5 的三智能体 Harness，Anthropic 改用连续会话，由 Claude Agent SDK 的自动压缩控制上下文增长。

- Planner 只做规划，不背实现细节；
- Generator 每个 Sprint 后借助自动压缩控制历史长度，避免历史拖住后续实现；
- Evaluator 独立评估，不受 Generator 的上下文污染。

两种配置的成本与结果如下：

| 配置                                | 耗时    | 花费  | 效果             |
| ----------------------------------- | ------- | ----- | ---------------- |
| Solo Harness，单 Agent + 最少工具   | 20 分钟 | \$9   | 跑不起来的半成品 |
| Full Harness，三 Agent + 完整工具链 | 6 小时  | \$200 | 完整可用的应用   |

Carlini 的案例更极端：16 个并行 Claude Opus 实例、约 2,000 个独立会话，持续约 2 周。

最后产出 10 万行 Rust 代码，GCC torture test 通过率 99%，API 成本约 2 万美元。

这里的关键是把工作分到大量独立会话中并行推进。日志写入文件而不刷到控制台，测试也做子采样：每个 Agent 只跑 1%-10% 用例，避免测试输出占满窗口。

Carlini 后来在 [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler "Building a C compiler with a team of parallel Claudes") 里说过一句话：

> “I had to constantly remind myself that I was writing this test harness for Claude and not for myself.”

在 Carlini 的分工中，核心编译器、去重、性能优化、代码质量和文档逐渐由不同角色负责。LLM 容易重复实现已有功能，单独安排去重角色能减少主 Agent 同时编码、查重复和维护历史的负担。

模型升级也会改变 Harness 的取舍。Anthropic 从 Opus 4.5 升到 Opus 4.6 后，移除了原有 Sprint 机制，并把逐 Sprint 的强约束评估收敛为末尾集中 QA / 少量评估轮。拆分、检查和重置都依赖模型能力假设，版本变化后需要重新验证。

日常项目当然不需要三智能体，也不需要 2,000 个独立会话。先判断任务会消耗多少代码上下文。

### 日常项目怎么选

我自己在面试平台项目里踩过一次坑。一个任务跨了好几个模块，我当时觉得单 Agent 能扛住。结果跑到中途 Claude Code 自己停了，上下文撑爆。后来改成 Sub-agent 并行：每个子任务只看自己负责的模块，最后把摘要交回主 Agent，才一次完成。

| 任务规模                   | 推荐策略                                             | 上下文管理方式                                  |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| 小：单文件修改、补一个函数 | 单 Agent                                             | 工具结果自动清理足够                            |
| 中：一个模块或一个功能     | 单 Agent + 主动 Compaction                           | 阶段结束或 `/context` 显示占用升高时 `/compact` |
| 大：跨模块重构、新子系统   | 主 Agent + Sub-agent                                 | 搜索、审查、日志分析交给子代理                  |
| 超大：长期迭代或独立系统   | 多 Agent + handoff / Reset，或连续会话 + AutoCompact | 阶段切换写 handoff，是否 Reset 取决于模型和任务 |

`/compact`、Sub-agent、`/context` 的命令细节，可以看之前的 [Claude Code 使用指南](https://javaguide.cn/AI编程/claudecode-tips.html "Claude Code 使用指南") 和 [Claude Code 核心命令详解](https://javaguide.cn/AI编程/claudecode-commands.html "Claude Code 核心命令详解")。

我一般不会等 AutoCompact 贴线才动。`/context` 到七成左右，或者已经出现重复搜索、忘约束的苗头时，手动 `/compact` 并告诉它要保留什么，摘要器手里会有更清楚的重点。等系统被动触发，窗口里往往已经混进旧日志、旧判断和一堆临时探索结果。

探索阶段结束时，可以把模块边界、关键文件、排除方案和失败测试写入压缩指令：

```text
/compact 保留模块边界、关键文件、已排除方案、当前失败测试
```

数据库问题则应把需要接续的 Schema、迁移和失败 SQL 写明：

```text
/compact 保留所有数据库 schema、迁移脚本、实体关系和当前失败 SQL
```

跨模块任务读完文件并确认模块边界后，可以先执行一次压缩；方案、约束和风险确定后，再压缩一次；代码改完并完成验证后更新状态。`PLAN.md` 或 `design.md` 保存关键状态，摘要传递目标、取舍和下一步，行号、失败 SQL、接口细节仍留在文件中。

多文件项目可以按场景选策略：

| 场景                 | 推荐做法                                            |
| -------------------- | --------------------------------------------------- |
| 一次性读了大量文件   | 用 MicroCompact / Snip / 压缩清掉已完成分析的旧内容 |
| 中断很久后继续       | 让系统清理过期工具结果，必要时重新读关键文件        |
| 连续推进多个独立功能 | 每完成一个功能就压缩一次                            |
| 横跨多个模块大改     | 按阶段拆分，阶段末压缩并更新笔记文件                |
| 大量日志或测试输出   | 只保留失败摘要、复现命令和关键栈，不保留全量输出    |
| 需要并行搜索或审查   | 派给 Sub-agent，主 Agent 只接收摘要                 |

探索阶段读过的大量文件，后续通常只需保留结论；设计阶段的约束和取舍需要留下；可复现的失败日志不必长期保留全文。信息稳定到这个程度时，再执行压缩更合适。

### 状态外化、记忆和 Hooks

`TaskCreate`、`TaskUpdate` 等 Tasks API 把大目标拆成任务节点，记录 `pending`、`in_progress`、`completed` 等状态与依赖关系，并持久化为结构化任务列表（内部存储格式不属于稳定接口）。Agent 通过 Task Tools 读取当前进度，不必依赖对话历史回忆“做到哪了”。

多个 Agent 同时写同一仓库时，worktree 隔离能让各自的 `git status` 只显示本人的改动。全量测试、跨文件搜索和大模块分析可以放到后台，完成后只回传摘要；压缩时仍在运行的任务状态会作为附件重新注入新上下文。

同样的原则也用于记忆：只记录源码无法推导的内容。

| 该记                             | 不该记                                    |
| -------------------------------- | ----------------------------------------- |
| 用户偏好，比如编码风格和语言习惯 | 项目目录结构，执行 `glob` 能查到          |
| 项目特有约定，比如 API 前缀      | 接口函数签名，源码里有                    |
| 某次技术决策的原因               | 依赖版本，`package.json` / `pom.xml` 里有 |
| 踩过的坑和修复方法               | Git 提交历史，`git log` 能查到            |

会话历史只服务当前会话，之后可能被压缩。用户或项目写入的持久指令放在 `CLAUDE.md` / Rules；Auto Memory 按 Git 仓库保存经验笔记，默认路径为 `~/.claude/projects/<project>/memory/`，可由 `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` 或可信 settings 中的 `autoMemoryDirectory` 覆盖。会话启动时只加载 `MEMORY.md` 的前 200 行或 25KB。

![Claude Code Auto Memory](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claude-code-auto-memory.png)

记忆文件变多后，启动时只加载索引；需要具体细节再打开对应文件。

有些 Agent 项目也会把 `AGENTS.md` 当索引用。

![CLAUDE.md 和 AGENTS.md](https://oss.javaguide.cn/github/javaguide/ai/coding/claude-agents-md.png)

可以参考 [Harness Engineering: Why Coding Agents Need Infrastructure](https://alexlavaee.me/blog/harness-engineering-why-coding-agents-need-infrastructure/ "Harness Engineering: Why Coding Agents Need Infrastructure")。这类文件负责告诉 Agent “资料在哪、什么时候读”，不是把所有资料提前塞进上下文。

官方 Auto Memory 按 Git 仓库存储，同一仓库的不同 worktree 共享同一份记忆。

个人规则、项目规则、组织规则会叠加进窗口，不要指望后加载的那条自动盖掉前面的偏好。项目里如果一定要压过个人习惯，就在项目规则里写明优先级。

面试时问“Agent 怎么实现跨会话记忆”，回答“存到文件里”太薄了。更完整的答法是：只存源码里查不到的信息，按作用范围分层，启动时先加载轻量索引，需要时再读细节，别把整份记忆塞进窗口。

按官方文档看，三类持久化信息可以这样放：

| 类型              | 作用                             | 存储                                                                                                                                                    |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 会话历史          | 当前任务临时状态，可能被压缩     | 内存中的 `messages[]`                                                                                                                                   |
| CLAUDE.md / Rules | 用户、项目、组织写入的持久指令   | 项目 `.claude/` 或 `~/.claude/`                                                                                                                         |
| Auto Memory       | Claude 按 Git 仓库维护的经验笔记 | 默认在 `~/.claude/projects/<project>/memory/`，可被 `CLAUDE_COWORK_MEMORY_PATH_OVERRIDE` 或可信 settings 覆盖；`MEMORY.md` 是索引入口，跨 worktree 共享 |

![Claude Code  /memory](https://oss.javaguide.cn/github/javaguide/ai/Agent Skills 是什么？和 Prompt、MCP 到底差在哪？/claudecode-memory-command.png)

临时绕过 Bug 的方案一旦写入项目记忆，后续会话可能继续沿用错误前提。文件路径、依赖版本和函数签名可直接从源码查询，无需重复记录；条目增加会抬高固定开销，错误条目还会持续影响判断。

还有一部分固定开销来自配置。Claude Code 的普通配置键遵循这条优先级：

```text
Managed（组织托管）> CLI 参数 > 项目本地 > 项目共享 > 用户配置
```

权限、Sandbox 路径等数组类型配置是例外，可能采用合并和去重规则，而不是简单覆盖。

项目配置新增 5 条规则、用户配置新增 3 条、MCP 再增加 2 个服务时，规则、权限和工具定义合起来可能占用几千 Token。通用规则放在全局，项目特有规则放在项目级，可以减少重复注入。

Hook 用于在指定节点干预上下文：`SessionStart` 注入记忆，`PreCompact` 追加压缩指令，`PostCompact` 负责通知或展示；`PostToolUse` 调整 MCP 工具输出，`PreToolUse` 判断工具是否允许执行。

Hook 输出会进入上下文，因此并非没有成本。外部网页、脚本输出或临时文件混入脏指令时，也可能带来 prompt injection。普通编码项目通常使用内置清理、压缩和断路器即可。

下表列出这些 Hook 介入上下文的时机：

| 事件                         | 触发时机       | 上下文管理作用                   |
| ---------------------------- | -------------- | -------------------------------- |
| `SessionStart`               | 会话开始       | 注入记忆、环境信息               |
| `InstructionsLoaded`         | 规则加载后     | 通知、审计观察                   |
| `PreToolUse`                 | 工具调用前     | 判断工具是否允许执行             |
| `PostToolUse`                | MCP 工具返回后 | 调整 MCP 工具输出                |
| `PreCompact` / `PostCompact` | 压缩前后       | 压缩前追加指令，摘要后通知或展示 |

每多一个 Hook，就多一份可能进入上下文的输出。团队项目存在强领域约束、合规审计或工具输出清洗需求时，再为这些场景配置 Hook。

## 面试回答版本

我们可以把上下文管理看成有限工作内存的治理。Agent 做长任务时，要同时带着任务目标、项目规则、已读代码、工具输出、计划和中间结论继续推理。窗口一直累积，旧日志、重复搜索结果和已经解决的问题就会挤占注意力；接近上限时，模型还可能因为可用输出空间不足而过早收束任务。

我会先区分两类信息。一次搜索搜到的几十条结果、全量测试日志、已经确认过的长文件原文，之后都能再取，不值得一直占着窗口。任务目标、业务约束、关键决策、失败用例、已修改文件和下一步则必须留下来；这些信息会被压成能继续执行的摘要，再写进 `PLAN.md`、设计文档或任务文件，避免只存在某一轮对话里。

放到 Claude Code 里，我会让它先处理可重新获取的工具结果，历史过长时再执行 `/compact`，保留目标、约束、决策和待办。如果压缩后仍需要换会话，handoff 至少会写清当前改动、失败测试、已排除的方案和下一步验证方式。对于日志分析、跨文件搜索、独立审查这类支线，我会交给 Sub-agent，主会话只接收结论和必要证据，不把完整过程重新塞回来。

所以判断上下文管理是否做好，不看窗口里存了多少信息，而看任务能不能在压缩、换会话或拆分后继续接上：窗口服务当前推理，文件系统保存可复用、可追溯的任务状态。

## 总结

窗口被占满时，先处理工具结果、测试日志和搜索输出等可重新获取的临时材料；阶段结束后再压缩过长的对话历史。搜索、审查和日志分析等支线放到 Sub-agent，主会话只保留结论。

若压缩后的会话仍无法接续，handoff 要交代失败用例、临时约束、正在修改的文件和已排除的方案，再由新会话处理。Plan、Spec、失败 SQL 和设计取舍等后续仍会使用的信息，写入 `PLAN.md`、`design.md`、`NOTES.json` 或项目自己的任务文件。这样，窗口只保留临时材料，文件系统负责保存任务状态。

