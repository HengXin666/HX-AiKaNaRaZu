# React TS 配置

## 模式

- **init**: 全量安装（hooks + rules）
- **modify**: 同 init，始终安装

## hooks

| 文件 | 目标路径 |
|------|----------|
| `hooks/format_react.sh` | `.agents/hooks/format_react.sh` |
| `hooks/verify_react.sh` | `.agents/hooks/verify_react.sh` |
| `hooks.json` | `.agents/settings.json` (CodeBuddy) |
| `hooks-codex.json` | `.agents/hooks.json` (Codex) |

## 工具链

- **Biome**: 一站式 format + lint（`npx biome check --write`）
- **tsc**: TypeScript 类型检查（`npx tsc --noEmit`）

## 规则

| 文件 | 目标路径 |
|------|----------|
| `rules/architecture.md` | `.agents/rules/react-architecture.md` |
| `rules/naming.md` | `.agents/rules/react-ts-naming.md` |

## 安装后

```bash
npm install --save-dev @biomejs/biome
npx biome init
```
