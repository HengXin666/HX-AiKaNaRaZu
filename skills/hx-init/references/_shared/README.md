# 通用配置（所有语言共享）

以下文件对所有语言类型都生效, 但仍然要先扫描并让用户确认。不要在用户确认前写盘。

## 安装策略

- `.agents/` 是共享源: Claude 和 Codex 通过软链复用同一份规则和 hooks。
- 已存在的真实文件不覆盖。若已有 `.claude/settings.json` 或 `.codex/hooks.json`, 先读内容, 再选择合并、跳过或提示用户。
- 软链只在目标路径不存在时创建; 若目标路径存在但指向不同, 不强改。
- 写 `.agents/.install-manifest.json`, 记录本次 `created`, `modified`, `skipped`, `commands`, `logs`。
- 大项目默认 baseline: hooks 只给摘要, 完整日志进 `.git/hx-init/logs` 或用户 cache。
- 兼容旧版本时, 将 `.agents/logs/` 加入 `.gitignore`, 防止历史 hook 日志污染工作区。

## hooks

| 文件 | 目标路径 |
|------|----------|
| `hooks/strip_emoji.sh` | `.agents/hooks/strip_emoji.sh` |
| `hooks/clean_chars.sh` | `.agents/hooks/clean_chars.sh` |
| `hooks/check_commit_msg.sh` | `.agents/hooks/check_commit_msg.sh` |
| `hooks/install_commit_msg_hook.sh` | `.agents/hooks/install_commit_msg_hook.sh` |

## 可选 Git commit-msg hook

这个 hook 是 opt-in, 不默认安装。启用后, `git commit` 的第一行必须匹配:

```text
[type] subject
```

默认允许:

```text
feat fix docs style refactor perf test build ci chore revert release deps security
```

安装规则:

- 安装前先询问用户是否启用。
- 复制 `check_commit_msg.sh` 和 `install_commit_msg_hook.sh` 到 `.agents/hooks/`。
- 运行 `bash .agents/hooks/install_commit_msg_hook.sh`。
- 若已有非 hx-init 管理的 `.git/hooks/commit-msg`, 默认跳过, 不覆盖。
- 用户明确要求替换时才运行 `bash .agents/hooks/install_commit_msg_hook.sh --force`。
- 自定义类型可设置 `HX_COMMIT_TYPES="feat fix wip"`。

失败时 hook 会阻止提交, 并提示用户用 `git commit -m "[feat] ..."` 或 `git commit --amend -m "[fix] ..."` 修正。

## 静态文件

| 文件 | 目标路径 | 模式 |
|------|----------|------|
| `.gitignore` | `.gitignore` | init 时审阅式合并; modify 时通常跳过 |

## 软链（始终创建）

```
AGENTS.md → CLAUDE.md
.claude/settings.json → ../.agents/settings.json
.claude/rules → ../.agents/rules
.claude/hooks.json → ../.agents/hooks.json
.claude/hooks → ../.agents/hooks
.codex/hooks.json → ../.agents/hooks.json
.codex/hooks → ../.agents/hooks
```

## 用户确认预览

安装前展示:

- 检测到的语言、包管理器、源码目录、已有工具。
- 将创建、将修改、将跳过的路径。
- 将执行的命令。
- hooks 的严格度和日志位置。

用户没有明确确认时, 只输出提案。
