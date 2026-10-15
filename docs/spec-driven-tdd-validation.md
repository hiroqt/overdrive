# Spec-Driven TDD Skill Validation

## Package reviewed

- Skill: `skills/spec-first-tdd/SKILL.md` (renamed from `spec-driven-tdd-engineering` for clearer routing)
- Supporting files: `agents/openai.yaml`, `assets/spec-template.md`, and `references/evaluation.md`
- Existing skill checked for overlap: `skills/engineering-skill-author/SKILL.md`
- Intended trigger: coding requests that change software behavior, including features, bug fixes, and refactors.
- Boundary: review-only, explanation-only, and documentation-only work does not select this workflow.

## Design decisions

- Keep one general engineering skill rather than duplicating instructions across Flutter, web, backend, and AI stacks. Repository-specific SDD artifacts, harnesses, and runtime gates determine the details.
- Scale the written spec to the task while retaining spec-before-code ordering.
- Apply TDD to behavior changes; allow a documented no-test case when behavior does not change or the repository has no usable harness.
- Preserve the existing skill-authoring capability; it authors and reviews skills, while this new skill governs code changes.

## Structural checks

- The bundled `skill-creator/scripts/quick_validate.py` was attempted for both skills but could not start because this Python environment has no `yaml` module.
- Ruby's standard YAML parser successfully parsed required frontmatter for the existing and new skill; both names match their folders.
- A local Markdown-link check passed for the README, validation record, and both skill entrypoints.
- `git diff --check` passed.
- No custom helper scripts or code tests are part of this instruction-only skill package.

## Behavioral evaluation status

Not run. Planned probes are also documented in `skills/spec-first-tdd/references/evaluation.md`:

| Case | Expected behavior |
| --- | --- |
| Feature request | Brief and acceptance criteria precede test and implementation; focused test is red then green |
| Bug report | Inspect all callers and establish a failing regression before fixing shared root cause |
| Small refactor | Define preserved behavior, write/capture tests first, keep contract stable |
| Docs-only request | Skill does not take over; no coding test loop is forced |
| Missing harness | Use repository-native safe checks, disclose gap, avoid unsolicited framework addition |
| External runtime gate | Distinguish local/mock evidence from device or hosted proof |

Explicit invocation would evaluate execution only. Automatic discovery and comparative benefit against a no-skill baseline remain unmeasured.
