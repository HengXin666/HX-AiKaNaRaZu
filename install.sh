#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${HX_AIKANARAZU_REPO:-https://github.com/HengXin666/HX-AiKaNaRaZu.git}"
REF="${HX_AIKANARAZU_REF:-main}"
SKILL_NAME="hx-init"
SCOPE="global"
FORCE=0

usage() {
  cat <<'EOF'
Usage:
  ./install.sh [--global|--project] [--force] [--skill NAME] [--repo URL] [--ref REF]
  ./install.sh hx-libs-sentaku [--global|--project] [--force]

Installs a HX-AiKaNaRaZu skill for Codex.

Options:
  --global      Install to ${CODEX_HOME:-$HOME/.codex}/skills/NAME (default)
  --project     Install to ./.codex/skills/NAME for the current repository
  --skill NAME  Skill to install: hx-init or hx-libs-sentaku (default: hx-init)
  --force       Replace an existing skill install
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
    --skill)
      SKILL_NAME="${2:?missing value for --skill}"
      shift 2
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
    hx-init|hx-libs-sentaku)
      SKILL_NAME="$1"
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$SKILL_NAME" in
  hx-init|hx-libs-sentaku)
    ;;
  *)
    echo "Unsupported skill: $SKILL_NAME" >&2
    echo "Supported skills: hx-init, hx-libs-sentaku" >&2
    exit 2
    ;;
esac

SKILL_PATH="skills/$SKILL_NAME"

if [[ "$SCOPE" = "global" ]]; then
  DEST_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
else
  DEST_ROOT="$PWD/.codex/skills"
fi
DEST="$DEST_ROOT/$SKILL_NAME"

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

SOURCE_SKILL=""
SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
if [[ -n "$SCRIPT_SOURCE" && -f "$SCRIPT_SOURCE" ]]; then
  SOURCE_ROOT="$(script_dir)"
  SOURCE_SKILL="$SOURCE_ROOT/$SKILL_PATH"
fi

if [[ -z "$SOURCE_SKILL" || ! -f "$SOURCE_SKILL/SKILL.md" ]]; then
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
    echo "$SKILL_NAME is already installed at $DEST"
    echo "No changes made. Re-run with --force to replace it."
    exit 0
  fi
  rm -rf "$DEST"
fi

mkdir -p "$DEST_ROOT"
TMP_DEST="$DEST_ROOT/.$SKILL_NAME.tmp.$$"
rm -rf "$TMP_DEST"
cp -R "$SOURCE_SKILL" "$TMP_DEST"
find "$TMP_DEST" -type f -name '*.sh' -exec chmod 755 {} +
mv "$TMP_DEST" "$DEST"

echo "Installed $SKILL_NAME -> $DEST"
if [[ "$SCOPE" = "project" ]]; then
  echo "Project install is ready to commit: git add .codex/skills/$SKILL_NAME"
fi
