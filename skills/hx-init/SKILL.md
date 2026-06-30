---
name: hx-init
description: >
  为当前项目配置 AI Coding 强约束。支持 Python/React, 初始化/改造两种模式。
  纯新增零副作用。触发词: hx-init, 强约束, 脚手架, ruff配置.
---

# hx-init

你是 AI, 在当前工作目录配置强约束套件。

- Python: **纯新增**, 已存在文件不动
- Web (React): **审阅式**, 先读已有配置, 再决定新增/追加/跳过(见 README)
- 所有 `.sh` 写盘后 chmod 755

## 流程

### 0. 自动分析

扫描当前目录推断 `py_ver`、`src_dir`、项目类型(含 `.py` → Python, 有 `package.json`+`tsconfig.json` → React)。

### 1. 三问

用 AskUserQuestion 依次提问:

**Q1 — 语言/框架**

- Python(推荐)
- React TS
- Python + React

**Q2 — 模式**

- 初始化 — 全量(pyproject/pre-commit/CI/hooks/rules)
- 改造 — 仅 hooks + rules, 不碰已有 pyproject 等

**Q3 — 类型检查器**(仅 Q1 含 Python 时)

- mypy(推荐) / ty(Astral 极速) / 跳过

### 2. 读取参考文件

始终读 `_shared/README.md`, 然后按 Q1 读各语言 README:

- `references/python/README.md`
- `references/react/README.md`

### 3. 组装 + 预览

**共享**(`_shared/README.md`): 复制 hooks/rules/.gitignore + 6 个软链。

**Python**(`python/README.md`): 动态模板替换占位符 + 静态文件复制。

**Web**(`react/README.md`): **先审阅**——Read 目标项目的 `package.json` / `lefthook.yml` / `biome.json` / `tsconfig.json`, 判断已有内容。`lefthook.yml` 不存在则新建, 存在则追加缺失 section(biome/prettier/typecheck/deadcode), 不覆盖已有。hooks 文件直接安装。展示差异预览让用户确认。

hooks.json 多语言时合并所有语言的 hook 列表。

### 4. 安装

`.agents/` 下文件纯新增(`test -e` skip)。`lefthook.yml` / `pyproject.toml` 等工程配置按 README 审阅规则处理。写入 `.agents/.install-manifest.json`。

### 5. 安装后

**Python**: `uv sync && uv run pre-commit install`
**Web**: `npm install --save-dev @biomejs/biome prettier lefthook typescript knip && npx biome init && npx lefthook install`
**共用**: 对全仓库去一次存量空白字符

## 扩展

加新语言: `references/` 下新建目录 → 写 README.md + 模板 → Q1 加选项。
