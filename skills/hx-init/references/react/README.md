# Web 前端配置(npm/Next/Vite/React 通用)

## 核心原则: 审阅优先, 不做覆盖

**所有配置文件采用审阅式安装**, 不直接覆盖:

1. 先 `Read` 目标项目已有配置文件(package.json, lefthook.yml, biome.json, tsconfig.json)
2. 分析已有内容
3. 决定操作: **新增文件** / **添加 section** / **修改字段** / **跳过**
4. 绝不做 `ln -s` 链接配置文件

## 模式

- **init**: 全量(lefthook + hooks + rules + deps 安装建议)
- **modify**: 仅 hooks(.agents/)+ deps 安装建议

## 工具链(三层门禁)

| 层级 | 工具 | 触发时机 |
|------|------|----------|
| AI 实时 | biome(单文件) | PostToolUse: Write/Edit |
| git pre-commit | biome + prettier | lefthook pre-commit |
| git pre-push | tsc + knip | lefthook pre-push |

## 模板文件

| 文件 | 目标 | 方式 |
|------|------|------|
| `lefthook.yml` | `lefthook.yml` | 审阅: 不存在则新建, 存在则对比差异、提示合并 |
| `hooks.json` | `.agents/settings.json` | 直接写入(纯新增) |
| `hooks-codex.json` | `.agents/hooks.json` | 直接写入(纯新增) |
| `hooks/format_react.sh` | `.agents/hooks/format_react.sh` | 直接写入 |
| `hooks/verify_react.sh` | `.agents/hooks/verify_react.sh` | 直接写入 |
| `rules/architecture.md` | `.agents/rules/react-architecture.md` | 直接写入 |
| `rules/naming.md` | `.agents/rules/react-ts-naming.md` | 直接写入 |

## lefthook.yml 审阅规则

读已有 `lefthook.yml`, 检查是否已有 `pre-commit` / `pre-push`:

- **不存在** → 直接写入模板内容
- **存在但无 biome** → 在 `pre-commit.commands` 下追加 biome + prettier 段
- **存在且已有 biome** → 跳过, 提示用户核对版本
- **存在 pre-push** → 追加 typecheck + deadcode(如无)

## 依赖安装

审阅 `package.json` 的 devDependencies, 按需建议安装:

```bash
# 核心
npm install --save-dev @biomejs/biome prettier lefthook
# 类型检查 + 死代码
npm install --save-dev typescript knip
# 初始化
npx biome init
npx lefthook install
```
