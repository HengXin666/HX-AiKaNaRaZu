#!/usr/bin/env bash
# Stop: Agent 准备结束时强制前端全量校验 (biome ci + tsc --noEmit + knip)。
# 校验失败时输出 JSON {continue:false, reason:"精简摘要"} 到 stdout + exit 0，
# 仅注入精简摘要到 AI 上下文，完整日志保留在文件中。
set -uo pipefail

if [[ -n "${CODEBUDDY_PROJECT_DIR:-}" ]]; then
  PROJECT_DIR="${CODEBUDDY_PROJECT_DIR}"
elif [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
  PROJECT_DIR="${CLAUDE_PROJECT_DIR}"
else
  PROJECT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
fi

cd "$PROJECT_DIR"
LOG_FILE="/tmp/web_verify.log"
PASS=true

# 1. biome ci
if command -v npx &>/dev/null; then
  echo "==> biome ci" >"$LOG_FILE"
  npx @biomejs/biome ci 2>>"$LOG_FILE" >>"$LOG_FILE" || PASS=false
fi

# 2. tsc 类型检查
if [[ -f "tsconfig.json" ]] && command -v npx &>/dev/null; then
  echo "==> tsc --noEmit" >>"$LOG_FILE"
  npx tsc --noEmit 2>>"$LOG_FILE" >>"$LOG_FILE" || PASS=false
fi

# 3. knip 死代码检测
if command -v npx &>/dev/null && npx knip --version &>/dev/null 2>&1; then
  echo "==> knip" >>"$LOG_FILE"
  npx knip --no-progress 2>>"$LOG_FILE" >>"$LOG_FILE" || PASS=false
fi

if $PASS; then
  exit 0
fi

# 校验失败 — 生成精简摘要，避免全量日志注入 AI 上下文

# 校验失败 — 生成精简摘要，避免全量日志注入 AI 上下文
python3 -c "
import json
log_path = '${LOG_FILE}'
try:
    with open(log_path) as f:
        log = f.read()
except Exception:
    log = ''
lines = [l.strip() for l in log.split('\n') if l.strip()]
error_lines = [l for l in lines if any(k in l.lower() for k in ('error', 'fail', 'unused', '✖'))]
error_cnt = len(error_lines)
# 摘取前几行错误
sample = '; '.join((l[:150] + ('...' if len(l) > 150 else '')) for l in error_lines[:3])
checks = []
if 'biome ci' in log: checks.append('biome')
if 'tsc' in log: checks.append('tsc')
if 'knip' in log: checks.append('knip')
check_str = ', '.join(checks) if checks else '?'
if sample:
    reason = f'React 校验被拦截 ({check_str}): {error_cnt} 条错误. {sample}. 日志: {log_path}'
else:
    reason = f'React 校验被拦截 ({check_str}): {error_cnt} 条错误. 日志: {log_path}'
print(json.dumps({'continue': False, 'reason': reason, 'systemMessage': f'React 校验失败 ({error_cnt} errors). 完整日志: {log_path}'}))
"
exit 0
