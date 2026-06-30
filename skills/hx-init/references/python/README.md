# Python 配置

## 模式

- **init**: 全量安装（pyproject/pre-commit/CI + hooks + rules）
- **modify**: 仅 hooks + rules + check_arch（不碰已有 pyproject）

## hooks

| 文件 | 目标路径 |
|------|----------|
| `hooks/format_py.sh` | `.agents/hooks/format_py.sh` |
| `hooks/verify_py.sh` | `.agents/hooks/verify_py.sh` |
| `hooks.json` | `.agents/settings.json` (CodeBuddy) |
| `hooks-codex.json` | `.agents/hooks.json` (Codex) |

## 动态模板（init 模式，替换 `{{}}` 后写入）

| 文件 | 目标 | 占位符 |
|------|------|--------|
| `pyproject.toml` | `pyproject.toml` | `{{PY_VER}}` `{{RUFF_TARGET}}` `{{CHECKER_DEPS}}` `{{CHECKER_SECTION}}` `{{TEST_IGNORE}}` |
| `pre-commit-config.yaml` | `.pre-commit-config.yaml` | `{{CHECKER}}` `{{TYPE_CMD_PRECOMMIT}}` `{{SRC_DIR}}` |
| `verify.sh` | `scripts/verify.sh` | `{{CHECKER}}` `{{TYPE_CMD_VERIFY}}` `{{SRC_DIR}}` |
| `ci.yml` | `.github/workflows/ci.yml` | `{{PY_VER}}` |

### 占位符替换规则

- `{{PY_VER}}` → `3.11`
- `{{RUFF_TARGET}}` → `py311`（PY_VER 去点）
- `{{CHECKER}}` → `mypy` / `ty` / `none`
- `{{CHECKER_DEPS}}` → `"mypy>=1.14.1"` / `"ty>=0.0.1a1"` / 删除该项
- `{{SRC_DIR}}` → `src` 或 `.`
- `{{TEST_IGNORE}}` → `.` 时 `"tests/**" = ["ANN", "S101"]`，否则 `"**/tests/**" = ["ANN", "S101"]`
- `{{TYPE_CMD_PRECOMMIT}}` → `.` 时 `uv run mypy .`，否则 `bash -c 'cd SRC_DIR && uv run mypy .'`
- `{{TYPE_CMD_VERIFY}}` → `.` 时 `uv run mypy .`，否则 `(cd SRC_DIR && uv run mypy .)`
- `{{CHECKER_SECTION}}`: mypy → `[tool.mypy]` 段，ty → `[tool.ty.src]` 段，none → 空

## 静态文件

| 文件 | 目标 | 模式 |
|------|------|------|
| `CLAUDE.md` | `CLAUDE.md` | init |
| `check_arch.py` | `scripts/check_arch.py` | 始终 |
| `rules/architecture.md` | `.agents/rules/architecture.md` | 始终 |
| `rules/naming.md` | `.agents/rules/naming.md` | 始终 |

## 安装后

```bash
find . -name '*.py' -not -path './.venv/*' -not -path './ref/*' -exec sed -i'' 's/[ \t]\+$//g' {} \;
uv sync && uv run pre-commit install
```
