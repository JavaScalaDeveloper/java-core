---
title: 原则 AI优化汇总
---

# 原则 AI优化汇总

> 基于 0-ALL.md 的 AI 优化版：保留原文并补充知识地图、易漏考点与工程清单。

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

1. Claude Code Hooks 详解：生命周期钩子与自动化工作流 (`Claude Code Hooks 详解-生命周期钩子与自动化工作流.md`)
2. Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams (`Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams.md`)
3. Claude Code Skills 技术实现细节与运行方式 (`Claude Code Skills 技术实现细节与运行方式.md`)
4. Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选 (`Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选.md`)
5. Claude Code 上下文管理详解：窗口预算、压缩与长任务治理 (`Claude Code 上下文管理详解-窗口预算、压缩与长任务治理.md`)

---

<!-- source: Claude Code Hooks 详解-生命周期钩子与自动化工作流.md -->

## [1] Claude Code Hooks 详解：生命周期钩子与自动化工作流

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

<!-- source: Claude Code Multi-Agent 机制详解-Subagent、Subtask、Fork 与 Agent Teams.md -->

## [2] Claude Code Multi-Agent 机制详解：Subagent、Subtask、Fork 与 Agent Teams

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

<!-- source: Claude Code Skills 技术实现细节与运行方式.md -->

## [3] Claude Code Skills 技术实现细节与运行方式

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

<!-- source: Claude Code 记忆系统详解-Markdown、Auto Memory 与向量检索怎么选.md -->

## [4] Claude Code 记忆系统详解：Markdown、Auto Memory 与向量检索怎么选

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

<!-- source: Claude Code 上下文管理详解-窗口预算、压缩与长任务治理.md -->

## [5] Claude Code 上下文管理详解：窗口预算、压缩与长任务治理

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

