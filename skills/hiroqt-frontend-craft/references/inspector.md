# Static HTML Inspector

Read this when running or changing `scripts/inspect_html.py`.

## Usage

```bash
python3 <skill-directory>/scripts/inspect_html.py <file-or-directory> [...]
python3 <skill-directory>/scripts/inspect_html.py --strict <built-html-directory>
```

The script uses only the Python standard library and reads files without modifying them. Directories are scanned recursively for `.html` and `.htm`, skipping `.git`, `node_modules`, Python virtual environments, `vendor`, and `__pycache__`.

## Findings

| Code | Severity | Check |
| --- | --- | --- |
| E001 | Error | `<html>` has a non-empty `lang` attribute |
| E002 | Error | Document has a non-empty `<title>` |
| E003 | Error | Each `<img>` has an `alt` attribute; `alt=""` is valid for decorative imagery |
| E004 | Error | Each anchor has text or a non-empty label attribute |
| E005 | Error | Each button has text or a non-empty label attribute |
| E006 | Error | Each non-hidden form control has a wrapping label, matching `label[for]`, or a non-empty programmatic label attribute |
| W001 | Warning | Document has a non-empty meta description |
| W002 | Warning | Document has a viewport meta tag with `width=device-width` |

Warnings do not fail the default command; `--strict` makes warnings fail. Exit code `2` means invalid input, unreadable files, or no HTML found. Other HTML parsing errors are handled by Python’s tolerant `HTMLParser`; malformed documents may therefore require a separate validator.

The checker is a triage aid only. It does not render client UI or compute browser accessible names, validate complex label references, check semantics, contrast, keyboard interaction, reduced motion, link status, canonical URLs, structured data, content truth, or Core Web Vitals. Always pair it with project-native tests and browser/tool review where relevant.
