#!/usr/bin/env python3
"""Check Overdrive skill package metadata, references, and README catalog entries."""

from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


SKILL_NAME = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*\Z')
ROOT_FIELD = re.compile(r'([A-Za-z][A-Za-z0-9_-]*):(?:[ \t]*(.*))?\Z')
INLINE_LINK = re.compile(r'!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))')
REFERENCE_LINK = re.compile(r'^\s{0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?', re.MULTILINE)
CATALOG_LINK = re.compile(r'\[[^\]]+\]\((skills/([a-z0-9-]+)/SKILL\.md)\)')
BLOCK_MARKERS = {'|', '|-', '|+', '>', '>-', '>+'}
IGNORED_MARKDOWN_PARTS = {'.git', '.venv', '__pycache__', 'benchmarks', 'node_modules'}


def _source_markdown(root):
    for path in root.rglob('*.md'):
        relative = path.relative_to(root)
        if any(part in IGNORED_MARKDOWN_PARTS for part in relative.parts):
            continue
        if 'results' in relative.parts and path.name != 'README.md':
            continue
        yield path


def _frontmatter(path):
    """Validate the flat Agent Skills metadata subset used by this repository."""
    lines = path.read_text(encoding='utf-8').splitlines()
    if not lines or lines[0] != '---':
        return None, ['missing opening YAML frontmatter delimiter']
    try:
        end = lines.index('---', 1)
    except ValueError:
        return None, ['missing closing YAML frontmatter delimiter']

    fields = {}
    errors = []
    current_key = None
    current_value = None
    for line_number, line in enumerate(lines[1:end], start=2):
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        if '\t' in line[:len(line) - len(line.lstrip())]:
            errors.append(f'line {line_number}: tabs are not valid indentation')
            continue
        if line[0].isspace():
            if current_key is None or not (
                current_value is None or current_value in BLOCK_MARKERS
            ):
                errors.append(f'line {line_number}: unexpected indented frontmatter content')
            elif current_key in {'name', 'description'}:
                fields[current_key] += ' ' + line.strip()
            continue
        match = ROOT_FIELD.fullmatch(line)
        if not match:
            errors.append(f'line {line_number}: expected a YAML key and value')
            current_key = None
            current_value = None
            continue
        key, value = match.group(1), match.group(2)
        if key in fields:
            errors.append(f'line {line_number}: duplicate frontmatter key {key!r}')
        value = (value or '').strip()
        if value.startswith(('"', "'")) and not value.endswith(value[0]):
            errors.append(f'line {line_number}: unclosed quoted value for {key!r}')
        fields[key] = value
        current_key, current_value = key, fields[key]

    for required in ('name', 'description'):
        if not fields.get(required, '').strip():
            errors.append(f'missing required frontmatter field {required!r}')
    return fields, errors


def _unquote(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def _markdown_links(text):
    in_fence = False
    links = []
    for line in text.splitlines():
        fence = re.match(r'^\s{0,3}(```+|~~~+)', line)
        if fence:
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        for match in INLINE_LINK.finditer(line):
            links.append(match.group(1) or match.group(2))
        links.extend(REFERENCE_LINK.findall(line))
    return links


def validate_repository(root):
    root = Path(root).resolve()
    errors = []
    skills_root = root / 'skills'
    if not skills_root.is_dir():
        return ['missing skills/ directory']

    packages = sorted(path for path in skills_root.iterdir() if path.is_dir())
    if not packages:
        errors.append('no skill package directories found under skills/')

    package_names = set()
    for package in packages:
        name = package.name
        package_names.add(name)
        skill_path = package / 'SKILL.md'
        if not skill_path.is_file():
            errors.append(f'{skill_path.relative_to(root)}: missing skill entrypoint')
            continue
        if len(name) > 64 or not SKILL_NAME.fullmatch(name):
            errors.append(f'{skill_path.relative_to(root)}: invalid skill folder name {name!r}')
        fields, frontmatter_errors = _frontmatter(skill_path)
        errors.extend(f'{skill_path.relative_to(root)}: {error}' for error in frontmatter_errors)
        if fields:
            declared_name = _unquote(fields.get('name', ''))
            if not SKILL_NAME.fullmatch(declared_name) or len(declared_name) > 64:
                errors.append(f'{skill_path.relative_to(root)}: invalid frontmatter name {declared_name!r}')
            if declared_name != name:
                errors.append(
                    f'{skill_path.relative_to(root)}: name {declared_name!r} does not match folder {name!r}'
                )
            description = fields.get('description', '')
            if len(description) > 1024:
                errors.append(f'{skill_path.relative_to(root)}: description exceeds 1,024 characters')
            compatibility = fields.get('compatibility', '')
            if len(compatibility) > 500:
                errors.append(f'{skill_path.relative_to(root)}: compatibility exceeds 500 characters')
            if description in BLOCK_MARKERS:
                body = skill_path.read_text(encoding='utf-8').splitlines()
                start = next((i + 1 for i, line in enumerate(body)
                              if line.startswith('description:')), len(body))
                end = next((i for i in range(start, len(body))
                            if body[i] == '---' or ROOT_FIELD.match(body[i])), len(body))
                if not any(line.strip() for line in body[start:end]):
                    errors.append(f'{skill_path.relative_to(root)}: description must not be empty')

        evaluation = package / 'references/evaluation.md'
        if not evaluation.is_file():
            errors.append(f'{evaluation.relative_to(root)}: required evaluation reference is missing')
        else:
            evaluation_text = evaluation.read_text(encoding='utf-8')
            for label in ('D', 'J', 'H'):
                if not re.search(rf'^\s*-\s*\*\*\[{label}\]', evaluation_text, re.MULTILINE):
                    errors.append(f'{evaluation.relative_to(root)}: missing evaluation summary entry [{label}]')

    markdown_files = list(_source_markdown(root))
    checked_links = 0
    for markdown in markdown_files:
        for target in _markdown_links(markdown.read_text(encoding='utf-8')):
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or target.startswith('#'):
                continue
            local_target = unquote(parsed.path)
            if not local_target:
                continue
            checked_links += 1
            resolved = (markdown.parent / local_target).resolve()
            try:
                resolved.relative_to(root)
            except ValueError:
                errors.append(f'{markdown.relative_to(root)}: local link escapes repository: {target!r}')
                continue
            if not resolved.exists():
                relative = markdown.relative_to(root)
                errors.append(f'{relative}: broken local link {target!r}')

    readme = root / 'README.md'
    if not readme.is_file():
        errors.append('missing README.md')
    else:
        readme_text = readme.read_text(encoding='utf-8')
        contents = re.search(r'^## Contents\s*$([\s\S]*?)(?=^## |\Z)', readme_text, re.MULTILINE)
        if not contents:
            errors.append('README.md: missing ## Contents catalog')
        else:
            listed = {match.group(2) for match in CATALOG_LINK.finditer(contents.group(1))}
            for name in sorted(package_names - listed):
                errors.append(f'README.md: skill {name!r} missing from README Contents')

    if errors:
        return errors
    return []


def main():
    root = Path(__file__).resolve().parents[1]
    errors = validate_repository(root)
    if errors:
        print('Skill package quality gate: FAIL')
        for error in errors:
            print(f'- {error}')
        return 1
    packages = sum(1 for path in (root / 'skills').iterdir() if path.is_dir())
    links = sum(len(_markdown_links(path.read_text(encoding='utf-8')))
                for path in _source_markdown(root))
    print(f'Skill package quality gate: PASS ({packages} packages; {links} Markdown link targets scanned)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
