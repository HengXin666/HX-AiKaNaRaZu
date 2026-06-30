# 通用配置（所有语言共享）

以下文件对所有语言类型都生效，始终安装。

## hooks

| 文件 | 目标路径 |
|------|----------|
| `hooks/strip_emoji.sh` | `.agents/hooks/strip_emoji.sh` |
| `hooks/clean_chars.sh` | `.agents/hooks/clean_chars.sh` |

## 静态文件

| 文件 | 目标路径 | 模式 |
|------|----------|------|
| `.gitignore` | `.gitignore` | init |

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
