# Codebase Map

> Navigation aid, not source of truth. Verify relevant claims against linked files and the current checkout before relying on them.

## Identity and status

- **Project:** Arnel’s Agent Engineering Toolkit, a documentation and installable-skill repository.
- **Last verified:** 2026-10-19.
- **Revision / working tree:** eight skill package IDs use the portable `skills/<name>/` layout. Guard adds approval-gated AI-assisted security review across eight threat families; Verify dispatches independent feature unit tests concurrently, shares a run summary before real app E2E, and stores unit and E2E evidence in separate result folders. Local benchmark harness and fixtures remain ignored.
- **Primary instructions:** [AGENTS.md](../AGENTS.md).

## Purpose and architecture

The repository packages global engineering guidance, a skill-authoring handbook, and reusable agent skills. It contains no application runtime or service implementation.

| Area | Responsibility | Source of truth |
| --- | --- | --- |
| Global workflow and permissions | Engineering defaults, SDD/TDD, token/context efficiency, documentation refresh, verification and side-effect boundaries | [AGENTS.md](../AGENTS.md) |
| Skill authoring standard | Package structure, trigger design, validation and behavioral evaluation expectations | [SKILLS.md](../SKILLS.md) |
| Skill authoring capability | Create, revise, or review focused engineering skills, including source-grounded handling of comments in code-related skills | [Forge](../skills/forge/SKILL.md) |
| AI-assisted application security review | Read the repository before judging; inspect eight threat families, rank evidence-based findings, and require explicit approval before changing reviewed application files or environments | [Guard](../skills/guard/SKILL.md), [threat review](../skills/guard/references/threat-review.md), [evaluation](../skills/guard/references/evaluation.md) |
| Spec-first coding workflow | Specify behavior before code, then test-first implementation; verify comment claims against code and contracts | [Assert](../skills/assert/SKILL.md) |
| Parallel unit-first application verification | Dispatch isolated feature unit suites concurrently, save and share an aggregate before E2E, then prove the integrated app journey with browser/MCP evidence; separate run folders hold unit summaries and E2E artifacts | [Verify](../skills/verify/SKILL.md), [evaluation](../skills/verify/references/evaluation.md) |
| Prune workflow | Targeted retrieval, MCP consideration, bounded outputs, source inspection beyond comment matches, and persistent codebase map maintenance | [Prune](../skills/prune/SKILL.md) |
| Concise communication style | Compact answers and progress updates while preserving evidence, technical payloads, uncertainty, and safety clarity | [Signal](../skills/signal/SKILL.md) |
| Codebase maintainability workflow | Dynamically inventory language-specific components, modules, helpers, tests, and monorepo boundaries; improve structure with explicit API confirmation and sensitive-file protection; resolve comment conflicts against verified code, contracts, and project conventions | [Refactor](../skills/refactor/SKILL.md) |
| Refactor E2E evidence | Paired Codex control/treatment results for refactoring, API approval, sensitive-file protection, and React/C#/Rust/Python/mixed-monorepo structure assessment | [Validation results](refactor-validation.md) |
| Frontend design workflow | Hiroqt’s product-first visual direction, whole-codebase existing-design review and user choice, source-grounded comment handling, purposeful motion, semantic icon use, WCAG-version-aware accessibility, responsive checks, technical SEO, static HTML inspection, and applied UX concepts | [Render](../skills/render/SKILL.md), [Production quality](../skills/render/references/production-quality.md), [Laws of UX guide](../skills/render/references/laws-of-ux.md) |

## Entrypoints and boundaries

- Repository overview, skill usage, and install examples: [README.md](../README.md).
- Guard's threat-specific checks and proposed evaluation cases are in `skills/guard/references/`; the behavioral evaluation is proposed and has not been run.
- Animated interactive installer: [scripts/install_skills.py](../scripts/install_skills.py); real project/global install runs and terminal banner capture: [cross-agent installability results](cross-agent-skill-installability-results.md).
- Authoring guide and package checklist: [SKILLS.md](../SKILLS.md).
- Installable capabilities live in `skills/<name>/SKILL.md`; optional Codex UI metadata is in that package’s `agents/openai.yaml`.
- Every skill package includes a linked `references/evaluation.md` with distinct [D] deterministic, [J] LLM-as-a-judge, and [H] human evaluation summaries; see [the authoring standard](../SKILLS.md#evaluation-summaries-for-every-skill).
- Concise response style and tool/context efficiency are separate capabilities; the former must not suppress useful retrieval, verification, or exact evidence.
- Refactor discovers and maps each language/framework's real constructs—entrypoints, components, contracts, collaborators, helpers, and tests—and traces dependency direction before improving structure. Mixed monorepos are assessed per app/package. It requires confirmation before API restructuring and protects sensitive files. It does not imply scheduled or background work.
- Render no-dependency HTML inspector and fixtures are in `skills/render/scripts/` and `skills/render/tests/`.
- Evaluation records and package-specific validation notes live in `docs/`.
- Actual outcomes from the paired Codex benchmark and cross-agent installation checks are recorded in the [Codex benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md). Local benchmark scripts and synthetic fixtures are excluded by `.gitignore`.
- [Signal validation](signal-validation.md) records seven in-session behavior probes and separates them from untested host discovery and telemetry claims.
- Skills provide workflow guidance; they do not install themselves, grant authorization, publish changes, or prove automatic host selection.

## Commands

This is primarily a Markdown/YAML toolkit with small standard-library Python utilities and tests for Render. Verify is an instruction-only testing workflow; its behavioral evaluation cases are proposed, not executed. Local benchmark scripts and fixtures are ignored by Git; previous E2E outcomes are retained in [the skill benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md). Install examples are in [README.md](../README.md); see [Forge validation evidence](forge-validation.md) for evidence boundaries.

## High-value checks and constraints

- Check skill frontmatter, folder/name agreement, resource links, and placeholders; validate local Markdown links and run `git diff --check` after documentation changes.
- Keep behavioral skill evaluation distinct from structural validation. Existing records label unrun evaluations rather than presenting them as proof.
- Do not copy sensitive personal history into distributable skill packages. Review the policy in [AGENTS.md](../AGENTS.md).
- For Prune’s behavior and validation limits, see [its validation record](prune-validation.md).
- For Render scope and test evidence, see [its validation record](render-validation.md); automatic skill discovery and cross-model consistency remain unmeasured.
- Its 2026-10-18 paired synthetic E2E passed the explicitly invoked design-choice/WCAG 2.0 treatment and failed the control's choice check; see the validation record for fixture scope and limitations.
- For Refactor's executed control/treatment evidence and limits, see [its E2E validation record](refactor-validation.md).

## Update notes

- Initial map created on 2026-10-15 from the root instructions, README, skill handbook, package entrypoints, and current Git status.
- Updated on 2026-10-15 to include Render and its static inspection harness.
- Updated on 2026-10-15 to include Signal and clarify its boundary with Prune.
- Updated on 2026-10-15 with the in-session Hiroqt behavior probe and its evaluation limits.
- Updated on 2026-10-15 with the paired Codex CLI skill benchmark and actual five-skill results.
- Updated on 2026-10-16 with individual Laws of UX application notes and concept links in the Render reference.
- Updated on 2026-10-17 with host-specific Agent Skills installation guidance and cross-agent installability E2E.
- Updated on 2026-10-17 with the animated, interactive Hiroqt installer and actual project/global E2E runs.
- Updated on 2026-10-17 to exclude local benchmark scripts and fixtures from Git while retaining recorded outcomes.
- Updated on 2026-10-17 with Refactor and its API confirmation and sensitive-file protections.
- Updated on 2026-10-18 with stack-neutral structure assessment guidance and paired Codex E2E evidence across React/TypeScript, C#/ASP.NET Core, Rust, Python, and a mixed React/C# monorepo.
- Updated on 2026-10-18 with paired Render design-choice and WCAG 2.0 source-review evidence.
- Updated on 2026-10-18 with the Overdrive collection label and renamed package IDs; prior validation records remain explicitly historical.
- Updated on 2026-10-18 with source-grounded comment conflict handling across code-authoring, refactoring, frontend, and repository-retrieval skills.
- Updated on 2026-10-18 with Verify, a unit-first workflow for permission-aware real-app end-to-end evidence.
- Updated on 2026-10-18 with Verify's concurrent swarm unit phase, pre-E2E aggregate summary, and separate feature-summary and E2E result folders.
