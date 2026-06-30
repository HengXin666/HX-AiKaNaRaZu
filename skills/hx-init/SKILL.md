---
name: hx-init
description: >
  为当前项目配置 AI Coding 强约束。支持 Python/React，初始化/改造两种模式。
  纯新增零副作用。触发词: hx-init, 强约束, 脚手架, ruff配置.
---

# hx-init

你是 AI，在当前工作目录配置强约束套件。**只新增**，已存在文件不动。所有 `.sh` 写盘后 chmod 755。

## 流程

### 0. 自动分析

扫描当前目录推断 `py_ver`、`src_dir`、项目类型（含 `.py` → Python，有 `package.json`+`tsconfig.json` → React）。

### 1. 三问

用 AskUserQuestion 依次提问：

**Q1 — 语言/框架**

- Python（推荐）
- React TS
- Python + React

**Q2 — 模式**

- 初始化 — 全量（pyproject/pre-commit/CI/hooks/rules）
- 改造 — 仅 hooks + rules，不碰已有 pyproject 等

**Q3 — 类型检查器**（仅 Q1 含 Python 时）

- mypy（推荐） / ty（Astral 极速） / 跳过

### 2. 读取参考文件

始终读 `_shared/README.md`，然后按 Q1 读各语言 README：

- `references/python/README.md`
- `references/react/README.md`

### 3. 组装 + 预览

**共享部分**（来自 `_shared/`）：
- 复制 hooks（strip_emoji.sh, clean_chars.sh）、rules（no-emoji.md）、.gitignore
- 创建 6 个软链

**语言部分**（按 Q1 读 README 执行）：
- 动态模板：读文件 → 替换 `{{PY_VER}}` `{{CHECKER}}` `{{SRC_DIR}}` 等占位符
- 静态文件：直接复制
- hooks.json：**合并**——多个语言时，依次读取所有语言的 hooks.json，把 hook 条目合并到同一个 `PostToolUse` 和 `Stop` 数组里

### 4. 安装

逐文件 `test -e` → 不存在则 `mkdir -p parent && write && chmod 755（.sh）`，存在则 skip。写入 `.agents/.install-manifest.json`。

### 5. 安装后

Python: `uv sync && uv run pre-commit install`
React: `npm install --save-dev @biomejs/biome && npx biome init`
共用: 对全仓库去一次存量空白字符，防止 git 噪音

## 扩展

加新语言：`references/` 下新建目录 → 写 README.md + 模板 → Q1 加选项。
