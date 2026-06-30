#!/usr/bin/env bash
set -euo pipefail
echo "==> [1/4] ruff check (含 PLC2401 中文命名拦截)"
uv run ruff check .
echo "==> [2/4] ruff format --check"
uv run ruff format --check .
echo "==> [3/4] type-check ({{CHECKER}})"
{{TYPE_CMD_VERIFY}}
echo "==> [4/4] arch-check (300行/文件数/_前缀/中文命名)"
uv run python scripts/check_arch.py {{SRC_DIR}}
echo "ALL PASS"
