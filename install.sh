#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${HX_AIKANARAZU_REPO:-https://github.com/HengXin666/HX-AiKaNaRaZu.git}"
REF="${HX_AIKANARAZU_REF:-main}"
SUPPORTED_SKILLS=("hx-init" "hx-libs-sentaku")
SKILL_NAMES=("hx-init")
SCOPE="project"
FORCE=0

usage() {
  cat <<'EOF'
Usage:
  ./install.sh [--global|--project] [--force] [--all] [--skill NAME] [--repo URL] [--ref REF]
  ./install.sh hx-libs-sentaku [--global|--project] [--force]

Installs HX-AiKaNaRaZu skill(s) for Codex.

Options:
  --project     Install to ./.codex/skills/NAME for the current repository (default)
  --global      Install to ${CODEX_HOME:-$HOME/.codex}/skills/NAME
  --skill NAME  Skill to install: hx-init or hx-libs-sentaku (default: hx-init)
  --all         Install all supported skills
  --force       Replace an existing skill install
  --repo URL    Git repository URL to install from when not run inside a checkout
  --ref REF     Git branch/tag/commit to install from (default: main)
EOF
}

set_skill_names() {
  SKILL_NAMES=("$@")
}

is_supported_skill() {
  local skill="$1"
  local supported
  for supported in "${SUPPORTED_SKILLS[@]}"; do
    [[ "$skill" = "$supported" ]] && return 0
  done
  return 1
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
    --all)
      set_skill_names "${SUPPORTED_SKILLS[@]}"
      shift
      ;;
    --skill)
      set_skill_names "${2:?missing value for --skill}"
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
      set_skill_names "$1"
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

for skill_name in "${SKILL_NAMES[@]}"; do
  if ! is_supported_skill "$skill_name"; then
    echo "Unsupported skill: $skill_name" >&2
    echo "Supported skills: hx-init, hx-libs-sentaku" >&2
    exit 2
  fi
done

if [[ "$SCOPE" = "global" ]]; then
  DEST_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
else
  DEST_ROOT="$PWD/.codex/skills"
fi

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

SOURCE_ROOT=""
SCRIPT_SOURCE="${BASH_SOURCE[0]:-}"
if [[ -n "$SCRIPT_SOURCE" && -f "$SCRIPT_SOURCE" ]]; then
  SOURCE_ROOT="$(script_dir)"
fi

needs_clone=0
for skill_name in "${SKILL_NAMES[@]}"; do
  if [[ -z "$SOURCE_ROOT" || ! -f "$SOURCE_ROOT/skills/$skill_name/SKILL.md" ]]; then
    needs_clone=1
    break
  fi
done

if [[ "$needs_clone" -eq 1 ]]; then
  command -v git >/dev/null 2>&1 || {
    echo "git is required when installing without a local checkout." >&2
    exit 1
  }
  TMP_DIR="$(mktemp -d)"
  git clone --filter=blob:none --sparse --branch "$REF" "$REPO_URL" "$TMP_DIR/repo" >/dev/null
  sparse_paths=()
  for skill_name in "${SKILL_NAMES[@]}"; do
    sparse_paths+=("skills/$skill_name")
  done
  git -C "$TMP_DIR/repo" sparse-checkout set "${sparse_paths[@]}" >/dev/null
  SOURCE_ROOT="$TMP_DIR/repo"
fi

mkdir -p "$DEST_ROOT"

installed=()
skipped=()
for skill_name in "${SKILL_NAMES[@]}"; do
  skill_path="skills/$skill_name"
  source_skill="$SOURCE_ROOT/$skill_path"
  dest="$DEST_ROOT/$skill_name"

  [[ -f "$source_skill/SKILL.md" ]] || {
    echo "Could not find $skill_path/SKILL.md in source." >&2
    exit 1
  }

  if [[ -e "$dest" ]]; then
    if [[ "$FORCE" -ne 1 ]]; then
      echo "$skill_name is already installed at $dest"
      echo "No changes made for $skill_name. Re-run with --force to replace it."
      skipped+=("$skill_name")
      continue
    fi
    rm -rf "$dest"
  fi

  tmp_dest="$DEST_ROOT/.$skill_name.tmp.$$"
  rm -rf "$tmp_dest"
  cp -R "$source_skill" "$tmp_dest"
  find "$tmp_dest" -type f -name '*.sh' -exec chmod 755 {} +
  mv "$tmp_dest" "$dest"

  echo "Installed $skill_name -> $dest"
  installed+=("$skill_name")
done

if [[ "$SCOPE" = "project" ]]; then
  if [[ "${#installed[@]}" -gt 0 ]]; then
    echo "Project install is ready to commit: git add .codex/skills"
  fi
fi
