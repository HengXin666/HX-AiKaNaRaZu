#!/usr/bin/env bash
# Stop: Agent 准备结束时强制跑全量校验。
# 校验失败时输出 JSON {continue:false, reason:"精简摘要"} 到 stdout + exit 0，
# 仅注入精简摘要到 AI 上下文，完整日志保留在文件中。
set -uo pipefail

# 自动定位项目根目录并构建 scripts/verify.sh 路径
if [[ -n "${CODEBUDDY_PROJECT_DIR:-}" ]]; then
  PROJECT_DIR="${CODEBUDDY_PROJECT_DIR}"
elif [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
  PROJECT_DIR="${CLAUDE_PROJECT_DIR}"
else
  PROJECT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
fi

VERIFY_SCRIPT="${PROJECT_DIR}/scripts/verify.sh"

# 如果 verify.sh 不存在或 uv 不可用，直接放行
if [[ ! -f "$VERIFY_SCRIPT" ]]; then
  echo "[hooks] scripts/verify.sh 不存在，跳过校验" >&2
  exit 0
fi

if ! command -v uv &>/dev/null; then
  echo "[hooks] uv 未安装，跳过校验" >&2
  exit 0
fi

# 运行校验
cd "$PROJECT_DIR"
LOG_FILE="/tmp/cc_verify.log"

if bash "$VERIFY_SCRIPT" >"$LOG_FILE" 2>&1; then
  # 校验通过，放行
  exit 0
fi

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
error_lines = [l for l in lines if any(k in l.lower() for k in ('error', 'fail', 'traceback'))]
error_cnt = len(error_lines)
# 摘取前几行错误
sample = '; '.join((l[:120] + ('...' if len(l) > 120 else '')) for l in error_lines[:3])
checks = []
if 'ruff check' in log: checks.append('ruff')
if 'mypy' in log: checks.append('mypy')
if 'arch-check' in log: checks.append('arch-check')
check_str = ', '.join(checks) if checks else '?'
if sample:
    reason = f'Python 校验被拦截 ({check_str}): {error_cnt} 条错误. {sample}. 日志: {log_path}'
else:
    reason = f'Python 校验被拦截 ({check_str}): {error_cnt} 条错误. 日志: {log_path}'
print(json.dumps({'continue': False, 'reason': reason, 'systemMessage': f'Python 校验失败 ({error_cnt} errors). 完整日志: {log_path}'}))
"
exit 0
