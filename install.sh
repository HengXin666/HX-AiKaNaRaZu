#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${HX_AIKANARAZU_REPO:-https://github.com/HengXin666/HX-AiKaNaRaZu.git}"
REF="${HX_AIKANARAZU_REF:-main}"
SKILL_PATH="skills/hx-init"
SCOPE="global"
FORCE=0

usage() {
  cat <<'EOF'
Usage:
  ./install.sh [--global|--project] [--force] [--repo URL] [--ref REF]

Installs hx-init for Codex.

Options:
  --global      Install to ${CODEX_HOME:-$HOME/.codex}/skills/hx-init (default)
  --project     Install to ./.codex/skills/hx-init for the current repository
  --force       Replace an existing hx-init install
  --repo URL    Git repository URL to install from when not run inside a checkout
  --ref REF     Git branch/tag/commit to install from (default: main)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      SCOPE="global"
      shift
      ;;
    --project)
      SCOPE="project"
      shift
      ;;
    --force)
      FORCE=1
      shift
      ;;
    --repo)
      REPO_URL="${2:?missing value for --repo}"
      shift 2
      ;;
    --ref)
      REF="${2:?missing value for --ref}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ "$SCOPE" = "global" ]]; then
  DEST_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
else
  DEST_ROOT="$PWD/.codex/skills"
fi
DEST="$DEST_ROOT/hx-init"

TMP_DIR=""
cleanup() {
  [[ -z "$TMP_DIR" ]] || rm -rf "$TMP_DIR"
}
trap cleanup EXIT

script_dir() {
  local source="${BASH_SOURCE[0]}"
  while [[ -L "$source" ]]; do
    local dir
    dir="$(cd -P "$(dirname "$source")" >/dev/null 2>&1 && pwd)"
    source="$(readlink "$source")"
    [[ "$source" = /* ]] || source="$dir/$source"
  done
  cd -P "$(dirname "$source")" >/dev/null 2>&1 && pwd
}

SOURCE_ROOT="$(script_dir)"
SOURCE_SKILL="$SOURCE_ROOT/$SKILL_PATH"

if [[ ! -f "$SOURCE_SKILL/SKILL.md" ]]; then
  command -v git >/dev/null 2>&1 || {
    echo "git is required when installing without a local checkout." >&2
    exit 1
  }
  TMP_DIR="$(mktemp -d)"
  git clone --filter=blob:none --sparse --branch "$REF" "$REPO_URL" "$TMP_DIR/repo" >/dev/null
  git -C "$TMP_DIR/repo" sparse-checkout set "$SKILL_PATH" >/dev/null
  SOURCE_SKILL="$TMP_DIR/repo/$SKILL_PATH"
fi

[[ -f "$SOURCE_SKILL/SKILL.md" ]] || {
  echo "Could not find $SKILL_PATH/SKILL.md in source." >&2
  exit 1
}

if [[ -e "$DEST" ]]; then
  if [[ "$FORCE" -ne 1 ]]; then
    echo "hx-init is already installed at $DEST"
    echo "No changes made. Re-run with --force to replace it."
    exit 0
  fi
  rm -rf "$DEST"
fi

mkdir -p "$DEST_ROOT"
TMP_DEST="$DEST_ROOT/.hx-init.tmp.$$"
rm -rf "$TMP_DEST"
cp -R "$SOURCE_SKILL" "$TMP_DEST"
find "$TMP_DEST" -type f -name '*.sh' -exec chmod 755 {} +
mv "$TMP_DEST" "$DEST"

echo "Installed hx-init -> $DEST"
if [[ "$SCOPE" = "project" ]]; then
  echo "Project install is ready to commit: git add .codex/skills/hx-init"
fi
