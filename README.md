# HX-AiKaNaRaZu

交互式「AI Coding 强约束」脚手架 — 一键把一整套约束装进任意 Python 工程。

零第三方依赖（纯 stdlib），由 [uv](https://github.com/astral-sh/uv) 驱动。

## 核心承诺：纯新增，零副作用

- **只创建不存在的文件/软链**；任何已存在的路径原样不动，绝不覆盖、合并、备份。
- 不产生任何 `.bak` 文件。
- 安装写 `.agents/.install-manifest.json`，`--uninstall` 据此精确删除新建项（因为从未改过别的）。

## 用法

```bash
# 交互模式（推荐）
uv run python main.py

# 预览将新建什么，不写盘
uv run python main.py --dry-run

# 无头模式（适合 CI / 测试）
uv run python main.py --non-interactive --python 3.11 --checker mypy --target . --src-dir src

# 删除本工具新建的文件
uv run python main.py --uninstall

# 一键清理历史遗留的 *.bak_<时间戳> 文件
uv run python main.py --clean-backups
```

交互流程：Python 版本 → 类型检查器（mypy / ty）→ 目标目录 → 源码子目录 → 预览确认 →
[安装依赖 / 校验 / 卸载] 菜单。

## 装进目标工程的内容

| 类别 | 文件 |
|---|---|
| 构建配置 | `pyproject.toml`（ruff + mypy/ty + ANN/PLC2401 中文命名拦截）、`.pre-commit-config.yaml`、`.gitignore` |
| Agent 规则 | `CLAUDE.md`、`.agents/rules/*.md`、`AGENTS.md`（软链） |
| 验证闭环 | `scripts/verify.sh`、`scripts/check_arch.py`、`.github/workflows/ci.yml` |
| Hook | `.agents/hooks/*.sh` + `.claude/` `.codex/` 软链 |

`check_arch.py` 强制：单文件 ≤300 行、目录 `.py` 数 2~5、`_` 前缀仅限 `impl/`、禁止中文标识符。

## 架构

深模块设计：`main.py` 薄包装 → `src/bootstrap.py`（交互/无头入口）→ `src/impl/`（私有实现）。

```
src/
  bootstrap.py        # 入口：交互 + 无头
  impl/
    _files.py         # 组装文件/软链 spec
    _install.py       # 安装引擎：plan → apply → manifest → uninstall
    _templates.py     # pyproject / pre-commit / verify / CI 模板生成
    _checkers.py      # mypy / ty 配置常量
  content/            # 外置模板与文档（发给目标工程的原文）
```

## 测试

```bash
python -m unittest discover -s tests -v
```

全部在临时目录跑 `plan → apply → uninstall`，不依赖 uv 或真实工程。
