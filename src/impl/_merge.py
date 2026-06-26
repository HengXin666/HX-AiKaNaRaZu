"""Smart merge for config files: add missing sections/lines, preserve user content."""

from __future__ import annotations

import re
from pathlib import Path


# ---------------------------------------------------------------------------
# TOML merge (pyproject.toml)
# ---------------------------------------------------------------------------

def _toml_sections(text: str) -> dict[str, str]:
    """Split TOML text into [section] blocks."""
    sections: dict[str, str] = {}
    current_key: str = ""
    current_lines: list[str] = []
    for line in text.splitlines():
        m = re.match(r'^\[([^\]]+)\]\s*$', line)
        if m:
            if current_lines or current_key:
                sections[current_key] = "\n".join(current_lines).strip()
            current_key = m.group(1)
            current_lines = [line]
        else:
            current_lines.append(line)
    if current_lines:
        sections[current_key] = "\n".join(current_lines).strip()
    return sections


def _merge_deps_list(existing: str, template: str) -> str:
    """Merge [dependency-groups] dev list: keep existing, add missing from template."""
    existing_deps: set[str] = set(re.findall(r'"([^"]+)"', existing))
    template_deps: set[str] = set(re.findall(r'"([^"]+)"', template))
    missing: set[str] = template_deps - existing_deps
    if not missing:
        return existing
    m = re.search(r'(dev\s*=\s*\[)([^\]]*)\]', existing)
    if not m:
        return existing
    prefix, body = m.group(1), m.group(2)
    indent: str = "    "
    insert: str = ",\n".join(f'{indent}"{d}"' for d in sorted(missing))
    new_body: str = body.rstrip().rstrip(",") + ",\n" + insert if body.strip() else "\n" + insert
    return existing[: m.start()] + prefix + new_body + "\n]" + existing[m.end() :]


def write_merge_toml(path: Path, template: str, *, force: bool = False) -> bool:
    """Add missing [sections], merge dev-deps. Preserve user content."""
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(template, encoding="utf-8")
        print(f"  write: {path}")
        return True

    existing_text: str = path.read_text(encoding="utf-8")
    existing_secs: dict[str, str] = _toml_sections(existing_text)
    template_secs: dict[str, str] = _toml_sections(template)

    to_append: list[str] = []
    for sec_name, sec_body in template_secs.items():
        if sec_name == "":
            continue
        if sec_name not in existing_secs:
            to_append.append(sec_body)
        elif sec_name == "dependency-groups":
            merged: str = _merge_deps_list(existing_secs[sec_name], sec_body)
            if merged != existing_secs[sec_name]:
                existing_text = existing_text.replace(existing_secs[sec_name], merged)

    if not to_append:
        print(f"  skip (up-to-date): {path}")
        return False
    if not force:
        print(f"  skip (可追加 {len(to_append)} 个新 section, 选\"合并\"): {path}")
        return False

    merged_text: str = existing_text.rstrip() + "\n\n" + "\n\n".join(to_append) + "\n"
    path.write_text(merged_text, encoding="utf-8")
    print(f"  merge (+{len(to_append)} sections): {path}")
    return True


# ---------------------------------------------------------------------------
# markdown merge (CLAUDE.md)
# ---------------------------------------------------------------------------

def write_merge_md(path: Path, template: str, *, force: bool = False) -> bool:
    """Add missing ## sections, preserve user content."""
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(template, encoding="utf-8")
        print(f"  write: {path}")
        return True

    existing_text: str = path.read_text(encoding="utf-8")
    existing_headings: set[str] = set(re.findall(r'^##\s+(.+)', existing_text, re.MULTILINE))
    template_headings: set[str] = set(re.findall(r'^##\s+(.+)', template, re.MULTILINE))
    missing_headings: set[str] = template_headings - existing_headings

    if not missing_headings:
        print(f"  skip (up-to-date): {path}")
        return False

    to_append: list[str] = []
    current_heading: str = ""
    current_lines: list[str] = []
    in_section: bool = False
    for line in template.splitlines():
        m = re.match(r'^##\s+(.+)', line)
        if m:
            if in_section and current_heading in missing_headings:
                to_append.append("\n".join([f"## {current_heading}"] + current_lines))
            current_heading = m.group(1)
            current_lines = []
            in_section = True
        elif in_section:
            current_lines.append(line)
    if in_section and current_heading in missing_headings:
        to_append.append("\n".join([f"## {current_heading}"] + current_lines))

    if not to_append:
        print(f"  skip (up-to-date): {path}")
        return False
    if not force:
        print(f"  skip (可追加 {len(to_append)} 个 section, 选\"合并\"): {path}")
        return False

    merged: str = existing_text.rstrip() + "\n\n" + "\n\n".join(to_append) + "\n"
    path.write_text(merged, encoding="utf-8")
    print(f"  merge (+{len(to_append)} sections): {path}")
    return True


# ---------------------------------------------------------------------------
# line-append (generic: .gitignore, .yaml, etc.)
# ---------------------------------------------------------------------------

def write_additive(path: Path, content: str, *, force: bool = False) -> bool:
    """Append missing lines, never remove existing ones."""
    if path.exists():
        existing_lines: set[str] = set(path.read_text(encoding="utf-8").splitlines())
        new_lines: list[str] = content.splitlines()
        missing: list[str] = [ln for ln in new_lines if ln not in existing_lines]
        if not missing:
            print(f"  skip (up-to-date): {path}")
            return False
        if not force:
            print(f"  skip (可追加 {len(missing)} 行, 选\"合并\"): {path}")
            return False
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as f:
            f.write("\n".join(missing) + "\n")
        print(f"  merge (+{len(missing)} 行): {path}")
        return True
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content + "\n", encoding="utf-8")
    print(f"  write: {path}")
    return True


# ---------------------------------------------------------------------------
# dispatch
# ---------------------------------------------------------------------------

_MERGE_DISPATCH = {
    ".toml": write_merge_toml,
    ".md": write_merge_md,
}


def write_smart(path: Path, content: str, *, force: bool = False) -> bool:
    """Smart merge based on file type: .toml→sections, .md→headings, else→lines."""
    merge_fn = _MERGE_DISPATCH.get(path.suffix)
    if merge_fn is not None:
        return merge_fn(path, content, force=force)
    return write_additive(path, content, force=force)
