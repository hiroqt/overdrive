#!/usr/bin/env python3
"""Check rendered HTML for a small set of accessibility and SEO signals."""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path


SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "vendor", "__pycache__"}


@dataclass(frozen=True)
class Finding:
    code: str
    severity: str
    path: str
    line: int
    message: str


@dataclass
class Control:
    tag: str
    line: int
    attrs: dict[str, str]
    text: list[str]


class PageInspector(HTMLParser):
    def __init__(self, path: str) -> None:
        super().__init__(convert_charrefs=True)
        self.path = path
        self.findings: list[Finding] = []
        self.has_html = False
        self.has_title = False
        self.title_parts: list[str] = []
        self.in_title = 0
        self.has_description = False
        self.has_viewport = False
        self.controls: list[Control] = []
        self.form_controls: list[tuple[int, dict[str, str], bool]] = []
        self.labelled_ids: set[str] = set()
        self.label_depth = 0

    def add(self, code: str, severity: str, line: int, message: str) -> None:
        self.findings.append(Finding(code, severity, self.path, line, message))

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key: value or "" for key, value in attrs}
        line = self.getpos()[0]

        if tag == "html":
            self.has_html = True
            if not attributes.get("lang", "").strip():
                self.add("E001", "error", line, "<html> is missing a non-empty lang attribute")
        elif tag == "title":
            self.has_title = True
            self.in_title += 1
        elif tag == "meta":
            name = attributes.get("name", "").strip().lower()
            content = attributes.get("content", "").strip()
            if name == "description" and content:
                self.has_description = True
            if name == "viewport" and "width=device-width" in content.lower():
                self.has_viewport = True
        elif tag == "label":
            self.label_depth += 1
            if attributes.get("for", "").strip():
                self.labelled_ids.add(attributes["for"].strip())
        elif tag == "img" and "alt" not in attributes:
            self.add("E003", "error", line, "<img> is missing alt; use alt=\"\" for decorative images")

        if tag in {"input", "select", "textarea"}:
            if tag != "input" or attributes.get("type", "").lower() != "hidden":
                self.form_controls.append((line, attributes, self.label_depth > 0))

        if tag in {"a", "button"}:
            self.controls.append(Control(tag, line, attributes, []))

        if tag == "img" and attributes.get("alt", "").strip():
            for control in self.controls:
                control.text.append(attributes["alt"])

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        for control in self.controls:
            control.text.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title" and self.in_title:
            self.in_title -= 1
        if tag == "label" and self.label_depth:
            self.label_depth -= 1
        for index in range(len(self.controls) - 1, -1, -1):
            control = self.controls[index]
            if control.tag == tag:
                attrs = control.attrs
                label_attrs = ("aria-label", "aria-labelledby", "title")
                has_label_attr = any(str(attrs.get(key, "")).strip() for key in label_attrs)
                has_text = " ".join(control.text).strip()
                if not has_label_attr and not has_text:
                    code = "E004" if tag == "a" else "E005"
                    self.add(code, "error", control.line, f"<{tag}> has no discernible text or label")
                self.controls.pop(index)
                break

    def finish(self) -> list[Finding]:
        if not self.has_html:
            self.add("E001", "error", 1, "document has no <html lang=...> element")
        if not self.has_title or not " ".join(self.title_parts).strip():
            self.add("E002", "error", 1, "document is missing a non-empty <title>")
        if not self.has_description:
            self.add("W001", "warning", 1, "document is missing a non-empty meta description")
        if not self.has_viewport:
            self.add("W002", "warning", 1, "document is missing a width=device-width viewport meta tag")
        for line, attrs, wrapped in self.form_controls:
            has_programmatic_name = any(
                attrs.get(key, "").strip() for key in ("aria-label", "aria-labelledby", "title")
            )
            if not wrapped and attrs.get("id", "") not in self.labelled_ids and not has_programmatic_name:
                self.add("E006", "error", line, "form control has no associated or programmatic label")
        return sorted(self.findings, key=lambda item: (item.line, item.code))


def audit_html(source: str, path: str = "<input>") -> list[Finding]:
    """Return static markup findings; this does not evaluate browser behavior."""
    parser = PageInspector(path)
    parser.feed(source)
    parser.close()
    return parser.finish()


def collect_html_files(paths: list[Path]) -> list[Path]:
    files: set[Path] = set()
    for path in paths:
        if not path.exists():
            raise ValueError(f"path does not exist: {path}")
        if path.is_file():
            if path.suffix.lower() not in {".html", ".htm"}:
                raise ValueError(f"not an HTML file: {path}")
            files.add(path)
            continue
        if path.is_dir():
            for candidate in path.rglob("*"):
                if any(part in SKIP_DIRS for part in candidate.parts):
                    continue
                if candidate.is_file() and candidate.suffix.lower() in {".html", ".htm"}:
                    files.add(candidate)
    return sorted(files)


def main(argv: list[str] | None = None) -> int:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--strict", action="store_true", help="return failure for warnings as well as errors")
    cli.add_argument("paths", nargs="+", type=Path, help="HTML file(s) or directories to inspect")
    args = cli.parse_args(argv)

    try:
        files = collect_html_files(args.paths)
    except ValueError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    if not files:
        print("error: no HTML files found", file=sys.stderr)
        return 2

    errors = warnings = 0
    for path in files:
        try:
            findings = audit_html(path.read_text(encoding="utf-8", errors="replace"), str(path))
        except OSError as error:
            print(f"error: could not read {path}: {error}", file=sys.stderr)
            return 2
        if not findings:
            print(f"OK {path}")
        for finding in findings:
            print(f"{finding.path}:{finding.line}: {finding.severity} {finding.code}: {finding.message}")
            errors += finding.severity == "error"
            warnings += finding.severity == "warning"

    print(f"Inspected {len(files)} HTML file(s): {errors} error(s), {warnings} warning(s)")
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
