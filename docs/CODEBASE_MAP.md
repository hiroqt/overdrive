# Codebase Map

> Navigation aid, not source of truth. Verify relevant claims against linked files and the current checkout before relying on them.

## Identity and status

- **Project:** Arnel’s Agent Engineering Toolkit, a documentation and installable-skill repository.
- **Last verified:** 2026-10-19.
- **Revision / working tree:** eight skill package IDs use the portable `skills/<name>/` layout. Guard adds approval-gated AI-assisted security review across eight threat families. Verify prefers concurrent feature checks, supports safe non-swarm and disclosed serial fallbacks, shares a summary before real app E2E, and stores evidence in separate result folders. Synthetic evaluation passed for the no-swarm sequence; a separate worker dispatch did not demonstrate overlapping execution. Cross-host behavior remains untested.
- **Primary instructions:** [AGENTS.md](../AGENTS.md).

## Purpose and architecture

The repository packages global engineering guidance, a skill-authoring handbook, and reusable agent skills. It contains no application runtime or service implementation.

| Area | Responsibility | Source of truth |
| --- | --- | --- |
| Global workflow and permissions | Engineering defaults, SDD/TDD, token/context efficiency, documentation refresh, verification and side-effect boundaries | [AGENTS.md](../AGENTS.md) |
| Skill authoring standard | Package structure, trigger design, validation and behavioral evaluation expectations | [SKILLS.md](../SKILLS.md) |
| Automated package quality | Required skill metadata/names, source Markdown links, evaluation labels, README catalog coverage, and CI workflow | [checker](../scripts/check_skill_packages.py), [checker tests](../scripts/tests/test_package_quality.py), [GitHub Actions](../.github/workflows/package-quality.yml) |
| Skill authoring capability | Create, revise, or review focused engineering skills, including source-grounded handling of comments in code-related skills | [Forge](../skills/forge/SKILL.md) |
| AI-assisted application security review | Read the repository before judging; inspect eight threat families, rank evidence-based findings, and require explicit approval before changing reviewed application files or environments | [Guard](../skills/guard/SKILL.md), [threat review](../skills/guard/references/threat-review.md), [evaluation](../skills/guard/references/evaluation.md) |
| Spec-first coding workflow | Specify behavior before code, then test-first implementation; verify comment claims against code and contracts | [Assert](../skills/assert/SKILL.md) |
| Unit-first application verification | Prefer concurrent feature tests with safe non-swarm fallbacks; save/share aggregate before E2E, then prove the integrated journey with browser/MCP evidence | [Verify](../skills/verify/SKILL.md), [evaluation](../skills/verify/references/evaluation.md), [executed evaluation](verify-validation.md) |
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
- Evaluation records and package-specific validation notes live in `docs/`, including [Verify's synthetic evaluation](verify-validation.md); isolated subprocesses overlapped, while a separate worker dispatch did not demonstrate swarm concurrency.
- Actual outcomes from the paired Codex benchmark and cross-agent installation checks are recorded in the [Codex benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md). Local benchmark scripts and synthetic fixtures are excluded by `.gitignore`.
- [Signal validation](signal-validation.md) records seven in-session behavior probes and separates them from untested host discovery and telemetry claims.
- Skills provide workflow guidance; they do not install themselves, grant authorization, publish changes, or prove automatic host selection.

## Commands

Run `python3 -m unittest discover -s scripts/tests -v` and `python3 scripts/check_skill_packages.py` for package self-tests and repository validation; GitHub Actions runs both on pushes and pull requests. The gate checks package structure and documentation links, not skill behavior. Verify remains an instruction-only workflow; the no-swarm synthetic sequence and injected failure paths are recorded, while one dispatched-worker attempt did not demonstrate overlapping execution. Automatic discovery and cross-host behavior remain untested. Local run artifacts are ignored by Git; the concise result is retained in [Verify's evaluation record](verify-validation.md). Previous skill and installability outcomes are in [the benchmark results](skills-e2e-benchmark-results.md) and [cross-agent installability results](cross-agent-skill-installability-results.md).

## High-value checks and constraints

- The package-quality gate checks skill names/frontmatter, local links, required evaluation labels, and README catalog coverage; run `git diff --check` after documentation changes.
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
- Updated on 2026-10-18 with Verify's concurrent unit phase, pre-E2E aggregate summary, and separate feature-summary and E2E result folders.
- Updated on 2026-10-19 with safe non-swarm parallel/serial fallbacks, one synthetic browser E2E plus injected unit/startup failure evaluation, and observed worker-dispatch intervals that did not overlap; separate no-swarm host compatibility remains untested.
- Updated on 2026-10-19 with the Python package-quality checker and push/pull-request workflow.
