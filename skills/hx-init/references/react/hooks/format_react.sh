#!/usr/bin/env bash
# PostToolUse: 文件改动后自动 format + lint（Biome 一站式）。
# 设计为不阻断(exit 0): 真正的红线交给 Stop hook。
set -uo pipefail

if ! command -v npx &>/dev/null; then
  exit 0
fi

npx biome check --write ./src 2>/dev/null || true
exit 0
