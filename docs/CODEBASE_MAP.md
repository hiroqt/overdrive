# Codebase Map

> Navigation aid, not source of truth. Verify relevant claims against linked files and the current checkout before relying on them.

## Identity and status

- **Project:** Arnel’s Agent Engineering Toolkit, a documentation and installable-skill repository.
- **Last verified:** 2026-10-15.
- **Revision / working tree:** base revision `a441758`; working tree contains uncommitted documentation and skill-package changes.
- **Primary instructions:** [AGENTS.md](../AGENTS.md).

## Purpose and architecture

The repository packages global engineering guidance, a skill-authoring handbook, and reusable agent skills. It contains no application runtime or service implementation.

| Area | Responsibility | Source of truth |
| --- | --- | --- |
| Global workflow and permissions | Engineering defaults, SDD/TDD, token/context efficiency, documentation refresh, verification and side-effect boundaries | [AGENTS.md](../AGENTS.md) |
| Skill authoring standard | Package structure, trigger design, validation and behavioral evaluation expectations | [SKILLS.md](../SKILLS.md) |
| Skill authoring capability | Create, revise, or review focused engineering skills | [Engineering Skill Author](../skills/engineering-skill-author/SKILL.md) |
| Spec-first coding workflow | Specify behavior before code, then test-first implementation | [Spec-First TDD](../skills/spec-first-tdd/SKILL.md) |
| Token-efficient coding workflow | Targeted retrieval, MCP consideration, bounded outputs, and persistent codebase map maintenance | [Token-Efficient Coding](../skills/token-efficient-coding/SKILL.md) |
| Frontend design workflow | Hiroqt’s product-first visual direction, purposeful motion, semantic icon use, accessibility, responsive checks, technical SEO, and static HTML inspection | [Hiroqt Frontend Craft](../skills/hiroqt-frontend-craft/SKILL.md) |

## Entrypoints and boundaries

- Repository overview, skill usage, and install examples: [README.md](../README.md).
- Authoring guide and package checklist: [SKILLS.md](../SKILLS.md).
- Installable capabilities live in `skills/<name>/SKILL.md`; optional Codex UI metadata is in that package’s `agents/openai.yaml`.
- Hiroqt Frontend Craft no-dependency HTML inspector and fixtures are in `skills/hiroqt-frontend-craft/scripts/` and `skills/hiroqt-frontend-craft/tests/`.
- Evaluation records and package-specific validation notes live in `docs/`.
- Skills provide workflow guidance; they do not install themselves, grant authorization, publish changes, or prove automatic host selection.

## Commands

This is primarily a Markdown/YAML toolkit with a small standard-library Python HTML inspector and unittest suite under Hiroqt Frontend Craft. Its focused check is `python3 -m unittest skills.hiroqt-frontend-craft.tests.test_inspect_html`; install examples are in [README.md](../README.md). The skill-authoring guide documents package validation; see [skill-author validation evidence](skill-author-validation.md) for prior checks and their limits.

## High-value checks and constraints

- Check skill frontmatter, folder/name agreement, resource links, and placeholders; validate local Markdown links and run `git diff --check` after documentation changes.
- Keep behavioral skill evaluation distinct from structural validation. Existing records label unrun evaluations rather than presenting them as proof.
- Do not copy sensitive personal history into distributable skill packages. Review the policy in [AGENTS.md](../AGENTS.md).
- For Token-Efficient Coding’s behavior and validation limits, see [its validation record](token-efficient-coding-validation.md).
- For Hiroqt Frontend Craft scope and test evidence, see [its validation record](frontend-craft-validation.md); automatic skill discovery and cross-model consistency remain unmeasured.

## Update notes

- Initial map created on 2026-10-15 from the root instructions, README, skill handbook, package entrypoints, and current Git status.
- Updated on 2026-10-15 to include Hiroqt Frontend Craft and its static inspection harness.
