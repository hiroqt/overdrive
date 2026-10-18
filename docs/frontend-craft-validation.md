# Hiroqt Frontend Craft — Brief and Validation

## Brief

Create a personalized, portable skill for building, redesigning, and reviewing web interfaces. Hiroqt Frontend Craft prioritizes product-fit design, semantic icon use, purposeful motion, accessibility, responsive behavior, technical SEO, and evidence-backed production review.

### Decisions

- Preserve the target repository’s product requirements, design system, framework, component library, content, and behavior. User and repository direction overrides aesthetic defaults.
- Treat common AI-generated patterns as warning signs to evaluate in context, not universally banned elements. Do not force a palette, font, layout, image, card system, animation library, or arbitrary creativity score.
- Make direction explicit before implementation, then inspect a real browser render at relevant viewports where tools permit.
- Apply SEO checks to public, indexable web surfaces; admin and private app screens may correctly be `noindex` or require no public SEO treatment.
- Include a no-dependency static HTML checker for concrete markup signals. It must report its limited coverage and leave subjective design, runtime accessibility, responsive layout, and SEO indexing to browser/tool validation.
- Keep the guidance centered on Hiroqt’s stated preferences: avoid generic decorative patterns, preserve real product identity, prefer useful semantics, and report only verified production evidence.

### Acceptance

- Installable `skills/hiroqt-frontend-craft/SKILL.md` with a discriminating trigger, a concise inspect → shape → build → audit → refine procedure, and progressive references.
- Supporting references cover visual direction, motion/interaction, quality/SEO/accessibility, sources, and evaluation.
- A zero-dependency Python HTML inspector reports concrete accessibility/metadata issues, supports files/directories, preserves warning versus error severity, and has valid/invalid fixture tests.
- User-facing production claims distinguish static checks, browser/device evidence, field metrics, and launch authorization.
- Package metadata, links, script tests, and whitespace checks pass; automatic discovery and comparative design benefit remain explicitly unmeasured.

## Validation record

The package is structurally validated; automatic discovery and cross-model consistency remain pending. Proposed behavior cases are in `skills/hiroqt-frontend-craft/references/evaluation.md`.

### Checks run

- `python3 -m unittest skills.hiroqt-frontend-craft.tests.test_inspect_html` — 12 tests passed for valid markup, missing metadata, image alt behavior, basic link/button/form label signals, recursive scanning, and CLI exit codes.
- The bundled `skill-creator/scripts/quick_validate.py` was attempted but could not start because this Python environment does not have `PyYAML`; portable YAML parsing is checked separately with Ruby’s standard YAML library.
- Local Markdown links, package names/frontmatter, placeholders, whitespace, and `git diff --check` are checked during final review.
- No application browser/device validation was run: this task adds a reusable skill and static inspector, not a product UI.

### Not measured

- Automatic skill discovery by a live host.
- Whether the personalized workflow improves UI quality across products and models.
- Production accessibility conformance, rendered UI quality, search visibility, or Core Web Vitals for any particular site.

### Frontend design-choice and WCAG 2.0 E2E — 2026-10-18

- Added a paired synthetic case, `hiroqt-frontend-craft-design-choice-wcag20`, to the local skill E2E harness. The fixture contains two route components, a shared header, and design tokens. It requests a next design improvement without telling the agent to ask a design-direction question, and asks for a WCAG 2.0 Level AA assessment. It is review-only.
- Run: Codex CLI 0.162.1, run ID `run-20261018-135616`; raw transcripts, final responses, and deterministic report are in `/private/tmp/frontend-craft-e2e-final/run-20261018-135616/`.
- Result: control **failed** the design-choice check; explicitly invoked Frontend Craft treatment **passed** all deterministic checks. Treatment cited all four fixture files, found no clear generic AI-template signals (while disclosing missing runtime context), requested a choice between refining and exploring a new direction before dependent design work, outlined WCAG 2.0 Level A and AA assessment across complete pages/processes, avoided claiming conformance, and made no workspace edits.
- Elapsed time was 36.41 seconds (control) and 38.05 seconds (treatment). One trial does not support a general speed or reliability claim, and these times are not a performance comparison.
- The synthetic repository has no runnable app or browser. This verifies source-review behavior and honest WCAG evidence boundaries; it does not verify rendered UI, assistive-technology behavior, or WCAG conformance. Automatic host discovery remains untested.

Harness regression tests: `python3 -m unittest benchmarks/skills-e2e/test_run.py -v` — 12 passed. `git diff --check` passed.

### Source references checked

- [Agent Skills specification](https://agentskills.io/specification)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google Search Central SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Web Vitals](https://web.dev/articles/vitals)
