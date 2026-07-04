---
name: hx-init
description: >
  为当前项目配置 AI Coding 强约束。使用前必须扫描仓库并按用户环境定制方案,
  支持 Python/React、改造模式和 [init] 初始化模式。适用于 hx-init、强约束、
  Claude/Codex hooks、AGENTS.md/CLAUDE.md、ruff/biome/lefthook/pre-commit 配置。
---

# hx-init

你是 AI, 在当前工作目录配置强约束套件。目标是"适配这个项目", 不是复制模板。

## 不可跳过的原则

- 先扫描, 再提案; 用户确认前不得安装。
- 优先复用现有工具链、脚本、版本、包管理器和 CI; 只补缺口。
- 已存在文件先读懂再最小 patch; 无法安全合并时跳过并说明。
- `.agents/` 下新增文件可以纯新增; 工程配置文件必须审阅式修改。
- hooks 不得把全量告警灌进上下文; 只输出摘要和日志路径。
- 所有 `.sh` 写盘后 `chmod 755`。

## 流程

### 1. 读取必要参考

始终读 `references/_shared/README.md`。扫描后按需读:

- Python: `references/python/README.md`
- React/Web: `references/react/README.md`

### 2. 自动扫描

先收集事实, 不要先下结论:

- Git: 当前分支、`git status --short`、是否已有未提交改动。
- 项目类型: `pyproject.toml`/`requirements*.txt`/`setup.cfg`/`.py`, `package.json`/`tsconfig.json`/锁文件。
- 源码边界: `src/`, `app/`, `packages/*`, `apps/*`, `server/`, `client/`, tests 目录, monorepo workspace。
- 现有工具: ruff/black/isort/mypy/pyright/ty/pytest/tox/nox/pre-commit; eslint/biome/prettier/tsc/knip/lefthook/husky/lint-staged。
- 包管理器: uv/poetry/pdm/pip, npm/pnpm/yarn/bun, 从锁文件和脚本判断。
- 规模风险: 文件数、明显生成目录、是否可能出现 10w+ 历史告警。
- Agent 配置: `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.codex/`, `.agents/` 是否已存在。

可用命令示例: `git status --short --branch`, `rg --files`, `find . -maxdepth 3`, `python --version`, `node --version`, `uv --version`, `jq '.scripts' package.json`。不要在提案前跑全量 lint/typecheck。

### 3. 生成安装提案并让用户选择

输出一个短提案:

- 检测结果: 语言、源码目录、包管理器、已有质量工具、风险点。
- 推荐模式: `modify` / `[init]` / custom, 以及理由。
- 将新增/修改/跳过的文件列表。
- 将运行的安装命令和验证命令。
- 严格度: changed-files、baseline、strict 三选一; 大项目默认 baseline。

必须让用户选择是否安装。若用户没有明确说"安装/初始化/应用", 只给提案不写盘。

### 4. 模式

**modify (默认)**: 在现有项目上补 hooks/rules。只对缺失配置做最小 patch, 不强行启用会产生大量历史告警的规则。

**[init]**: 用户明确要求"初始化"或写了 `[init]` 时使用。

1. 先检查 Git。若不是 Git 仓库, 询问是否 `git init`。
2. 新建分支 `hx-init/<YYYYMMDD-HHMM>`。若工作区已有改动, 记录这些路径, 不要 stage 它们; 如无法区分, 先询问用户。
3. 安装并运行必要的轻量验证。
4. 只 stage 本次新增/修改的文件, 提交: `chore: initialize ai coding guardrails`。
5. 提交后汇报告警摘要和日志路径, 询问用户哪些告警要继续修, 不要自动修完整历史债。

**custom**: 用户选定语言、工具或严格度时, 尊重用户选择; 若会破坏现有流程, 先指出风险再执行。

### 5. 安装规则

- `.agents/`、`.claude/`、`.codex/` 优先通过共享 `.agents` + 软链安装; 若目标路径已存在, 不覆盖, 改为合并配置或跳过。
- Python 和 React 同时存在时, 合并 hook 列表: PostToolUse 可连续执行清理和对应 formatter; Stop hook 调用一个适配后的 verify 脚本或多个语言 verify。
- 写 `.agents/.install-manifest.json`, 至少记录 `mode`, `created`, `modified`, `skipped`, `commands`, `logs`。
- 配置文件不要整文件替换。优先使用结构化编辑; TOML/YAML/JSON 无可靠解析器时, 做清晰的局部 patch 并展示 diff。
- 安装依赖前确认包管理器; 不要在 pnpm/yarn/bun 项目里直接使用 npm。

### 6. 告警和日志策略

- Stop hooks 必须把完整输出写入 `.git/hx-init/logs` 或用户 cache, 不污染工作区。
- 注入给 AI 的内容只允许是摘要: 检查项、失败数量估计、前 3-5 条样例、日志路径、查看命令。
- 面对 10w+ 告警, 先归类和抽样, 不要粘贴全量输出。
- 需要查详情时, 使用 `sed -n`, `rg`, `head`, `tail` 针对日志文件定位; 一次读取不超过约 200 行。

### 7. 安装后

根据提案运行命令。若验证失败, 只汇报摘要和下一步选择:

- 修本次引入的问题
- 建立 baseline 后继续
- 暂时降低严格度
- 用户指定某类告警继续修

## 扩展

加新语言: `references/` 下新建目录 -> 写参考说明和模板 -> 在本文件的扫描和安装规则中加入选择逻辑。
