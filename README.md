# Arnel’s Agent Engineering Toolkit

Global Codex instructions and a focused skill-authoring toolkit for adaptive engineering workflows, security, AI evaluation, and durable project context.

## Contents

| File | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Global engineering defaults, permissions, delegation, harnesses, and private project memory |
| [SKILLS.md](SKILLS.md) | Skill-writing standard, the 30-point release checklist, and evaluation guidance |
| [Engineering Skill Author](skills/engineering-skill-author/SKILL.md) | Installable skill for creating, revising, or reviewing engineering skills |
| [Spec-First TDD](skills/spec-first-tdd/SKILL.md) | Personalized coding workflow: specify behavior, then implement test-first |
| [Spec template](skills/spec-first-tdd/assets/spec-template.md) | Lightweight SDD artifact for multi-part changes without an existing spec |
| [Spec-First TDD evaluation guide](skills/spec-first-tdd/references/evaluation.md) | Proposed selection and behavior cases for validating the coding workflow |
| [Token-Efficient Coding](skills/token-efficient-coding/SKILL.md) | Reduce avoidable context and tool-output overhead without limiting useful investigation |
| [Hiroqt Concise Communication](skills/hiroqt-concise-communication/SKILL.md) | Concise coding-agent replies with evidence, technical detail, and safety clarity preserved |
| [Hiroqt Frontend Craft](skills/hiroqt-frontend-craft/SKILL.md) | Product-first visual design, interaction, accessibility, SEO, and production workflow |
| [Laws of UX guide](skills/hiroqt-frontend-craft/references/laws-of-ux.md) | Practical notes on applying 30 UX concepts, with cautions and a direct source link for each concept |
| [Frontend inspection script](skills/hiroqt-frontend-craft/scripts/inspect_html.py) | Dependency-free static checks for rendered HTML metadata and basic link, button, and form label signals |
| [Frontend skill brief and validation](docs/frontend-craft-validation.md) | Scope, decisions, and package verification status |
| [Current codebase map](docs/CODEBASE_MAP.md) | Source-linked guide to this toolkit repository’s instructions, packages, and validation boundaries |
| [Hiroqt Concise Communication validation](docs/hiroqt-concise-communication-validation.md) | In-session behavioral probes, outcomes, and evaluation limits |
| [Skill E2E benchmark](benchmarks/skills-e2e/README.md) | Paired, synthetic Codex CLI benchmark for all installable skills |
| [Skill E2E benchmark results](docs/skills-e2e-benchmark-results.md) | Actual run outcomes, usage telemetry, and limitations |
| [Skill template](skills/engineering-skill-author/assets/SKILL.template.md) | Adaptable starting point for a new skill |
| [Evaluation protocol](skills/engineering-skill-author/references/evaluation.md) | Separate discovery and execution testing with evidence records |

## Global instructions

1. Copy [AGENTS.md](AGENTS.md) into `~/.codex/AGENTS.md`, or `$CODEX_HOME/AGENTS.md` when configured.
2. Check whether an `AGENTS.override.md` is active; it takes precedence.
3. Start a fresh Codex session and verify the loaded instructions.

Keep project commands and specialized constraints in each repository’s own instruction files. The global defaults are local reviews, private project memory, and approval for destructive or shared-environment changes.

## Skill authoring guide

Read [SKILLS.md](SKILLS.md) when creating or reviewing a capability. It distinguishes global policy, reusable skill procedures, supporting resources, and private context. The release checklist adapts the supplied 30-point quality guide.

`SKILLS.md` is a handbook. It is not an installable skill and should not be pasted into every skill’s entrypoint. Each installable capability lives in its own folder with an exact `SKILL.md` filename.

## Install the authoring skill

This repository is private. Authenticate with GitHub and clone it into a chosen directory:

```bash
gh repo clone hiroqt/agents.md
cd agents.md
npx skills@latest add . --global --agent codex --skill engineering-skill-author
```

Review any existing skill with the same name before approving an overwrite. Alternatively, copy the complete `skills/engineering-skill-author` folder into a supported skill directory without overwriting existing work. Codex documents user skills under `~/.agents/skills` and repository skills under `.agents/skills`; see [local skill discovery](https://learn.chatgpt.com/docs/build-skills).

Invoke it with a focused request:

```text
Use $engineering-skill-author to create a review-only API-contract skill
using this repository’s existing contracts and validation commands.
```

```text
Use $engineering-skill-author to review this skill package without modifying it.
```

## Spec-driven, test-first engineering

Use the [spec-first-tdd skill](skills/spec-first-tdd/SKILL.md) for coding requests. It turns the request into a proportionate spec with acceptance checks before implementation, then uses a red-green-refactor loop for behavior changes. It carries Arnel’s preferences for small diffs, existing conventions, preserved unrelated work, and honest verification reports. The skill is guidance; it does not replace higher-priority instructions, repository rules, or task-specific authorization.

Install this skill to Codex with:

```bash
npx skills@latest add . --global --agent codex --skill spec-first-tdd
```

```text
Use $spec-first-tdd to implement the requested behavior.
```

## Token-efficient coding

Use [token-efficient-coding](skills/token-efficient-coding/SKILL.md) to reduce repeated searches, oversized tool results, and unnecessary context retention while preserving the investigation needed for a correct solution. On first use in a codebase, it creates or extends a source-linked `docs/CODEBASE_MAP.md`; after meaningful code changes and before session handoff, it refreshes that map. It explicitly considers relevant MCP tools and schemas as part of the efficiency decision; it does not optimize token count by skipping useful sources, checks, or domain knowledge.

Install this skill to Codex with:

```bash
npx skills@latest add . --global --agent codex --skill token-efficient-coding
```

```text
Use $token-efficient-coding to investigate and implement this task efficiently.
```

## Concise communication

Use [Hiroqt Concise Communication](skills/hiroqt-concise-communication/SKILL.md) for compact answers and progress updates that retain technical details, evidence, and uncertainty. It covers response wording; use Token-Efficient Coding for search, tool-output, and context overhead.

Install this skill to Codex with:

```bash
npx skills@latest add . --global --agent codex --skill hiroqt-concise-communication
```

Invoke it with `$hiroqt-concise-communication`, or ask for `/concise lite`, `/concise full`, or `/concise ultra`. `/concise off` returns to the host's normal response style. Commands and aliases work only when the host exposes the installed skill; they do not configure host commands by themselves.

The Engineering Skill Author package includes its template, evaluation reference, and optional Codex UI metadata; it has no custom executable helpers. Hiroqt Frontend Craft includes scoped references and a read-only static HTML inspector. Follow each target host’s discovery and invocation rules; portable metadata does not guarantee identical behavior across products.

## Frontend design and production checks

Use [Hiroqt Frontend Craft](skills/hiroqt-frontend-craft/SKILL.md) for new web surfaces, redesigns, visual critiques, or frontend implementation. It prioritizes product-fit visual direction, useful icons and motion, practical accessibility, responsive inspection, technical SEO for public pages, and measured performance guidance. Familiar patterns are critique signals, not blanket bans.

Install it to Codex with:

```bash
npx skills@latest add . --global --agent codex --skill hiroqt-frontend-craft
```

For static or server-rendered HTML, the packaged inspector can be run with `python3 skills/hiroqt-frontend-craft/scripts/inspect_html.py <html-file-or-directory>`. It checks a small set of markup signals; browser interaction, visual quality, accessibility, and field performance still need appropriate project-level validation.

## Validation and limits

See the [executed validation record](docs/skill-author-validation.md) for checks performed and remaining limits.

Packaging validation checks syntax and resources. Behavioral evaluation checks actual decisions and outputs; explicit invocation does not prove automatic discovery. Run realistic cases using the [evaluation protocol](skills/engineering-skill-author/references/evaluation.md), and distinguish executed tests from planned scenarios.

These files define behavior. They do not grant access, configure MCP connections, install themselves, create scheduled workers, or enable GitHub automatic reviews. Keep sensitive history and credentials outside distributed skill packages.
