# Codebase Map

> Navigation aid, not source of truth. Verify relevant claims against linked files and the current checkout before relying on them.

## Identity and status

- **Project:** Arnel’s Agent Engineering Toolkit, a documentation and installable-skill repository.
- **Last verified:** 2026-10-17.
- **Revision / working tree:** base revision `41c4d10d1336a6aa6c4f1f2dbc80d7689cee76d9`; working tree contains README, ignore-rule, benchmark, installer, and documentation changes.
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
| Concise communication style | Compact answers and progress updates while preserving evidence, technical payloads, uncertainty, and safety clarity | [Hiroqt Concise Communication](../skills/hiroqt-concise-communication/SKILL.md) |
| Frontend design workflow | Hiroqt’s product-first visual direction, purposeful motion, semantic icon use, accessibility, responsive checks, technical SEO, static HTML inspection, and applied UX concepts | [Hiroqt Frontend Craft](../skills/hiroqt-frontend-craft/SKILL.md), [Laws of UX guide](../skills/hiroqt-frontend-craft/references/laws-of-ux.md) |

## Entrypoints and boundaries

- Repository overview, skill usage, and install examples: [README.md](../README.md).
- Animated interactive installer: [scripts/install_skills.py](../scripts/install_skills.py); real project/global install runs and terminal banner capture: [cross-agent installability results](cross-agent-skill-installability-results.md).
- Authoring guide and package checklist: [SKILLS.md](../SKILLS.md).
- Installable capabilities live in `skills/<name>/SKILL.md`; optional Codex UI metadata is in that package’s `agents/openai.yaml`.
- Concise response style and tool/context efficiency are separate capabilities; the former must not suppress useful retrieval, verification, or exact evidence.
- Hiroqt Frontend Craft no-dependency HTML inspector and fixtures are in `skills/hiroqt-frontend-craft/scripts/` and `skills/hiroqt-frontend-craft/tests/`.
- Evaluation records and package-specific validation notes live in `docs/`.
- Actual outcomes from the paired Codex benchmark and cross-agent installation checks are recorded in the [Codex benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md). Local benchmark scripts and synthetic fixtures are excluded by `.gitignore`.
- [Hiroqt Concise Communication validation](hiroqt-concise-communication-validation.md) records seven in-session behavior probes and separates them from untested host discovery and telemetry claims.
- Skills provide workflow guidance; they do not install themselves, grant authorization, publish changes, or prove automatic host selection.

## Commands

This is primarily a Markdown/YAML toolkit with small standard-library Python utilities and tests for Frontend Craft. Local benchmark scripts and fixtures are ignored by Git; previous E2E outcomes are retained in [the skill benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md). Install examples are in [README.md](../README.md); see [skill-author validation evidence](skill-author-validation.md) for evidence boundaries.

## High-value checks and constraints

- Check skill frontmatter, folder/name agreement, resource links, and placeholders; validate local Markdown links and run `git diff --check` after documentation changes.
- Keep behavioral skill evaluation distinct from structural validation. Existing records label unrun evaluations rather than presenting them as proof.
- Do not copy sensitive personal history into distributable skill packages. Review the policy in [AGENTS.md](../AGENTS.md).
- For Token-Efficient Coding’s behavior and validation limits, see [its validation record](token-efficient-coding-validation.md).
- For Hiroqt Frontend Craft scope and test evidence, see [its validation record](frontend-craft-validation.md); automatic skill discovery and cross-model consistency remain unmeasured.

## Update notes

- Initial map created on 2026-10-15 from the root instructions, README, skill handbook, package entrypoints, and current Git status.
- Updated on 2026-10-15 to include Hiroqt Frontend Craft and its static inspection harness.
- Updated on 2026-10-15 to include Hiroqt Concise Communication and clarify its boundary with Token-Efficient Coding.
- Updated on 2026-10-15 with the in-session Hiroqt behavior probe and its evaluation limits.
- Updated on 2026-10-15 with the paired Codex CLI skill benchmark and actual five-skill results.
- Updated on 2026-10-16 with individual Laws of UX application notes and concept links in the Frontend Craft reference.
- Updated on 2026-10-17 with host-specific Agent Skills installation guidance and cross-agent installability E2E.
- Updated on 2026-10-17 with the animated, interactive Hiroqt installer and actual project/global E2E runs.
- Updated on 2026-10-17 to exclude local benchmark scripts and fixtures from Git while retaining recorded outcomes.
