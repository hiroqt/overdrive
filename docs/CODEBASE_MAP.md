# Codebase Map

> Navigation aid, not source of truth. Verify relevant claims against linked files and the current checkout before relying on them.

## Identity and status

- **Project:** Arnel’s Agent Engineering Toolkit, a documentation and installable-skill repository.
- **Last verified:** 2026-10-23.
- **Revision / working tree:** eleven domain skill IDs plus the `overdrive` router use the portable `skills/<name>/` layout. `overdrive-skills@0.1.0` is published and registry metadata matches the reviewed tarball. Future releases use `.github/workflows/npm-publish.yml` after npm Trusted Publishing is configured and a matching GitHub Release is published; pushes and pull requests run checks only. Continuity adds a selected-host always-loaded rule and project-local index/checkpoint workflow; behavior evaluation is proposed, not run. Current-ID synthetic evaluations cover six paired cases, focused Guard checks, Verify’s concurrent unit/browser-E2E sequence, and a Codex-only automatic-routing probe. Review and Trace evaluation cases are proposed, not run. Guard judge/human evaluation is still pending; Signal routing was not observed. The previously published `@hiroqt/overdrive@0.1.0` package was installed for Antigravity CLI and IDE: strict plugin validation passed, all ten direct skills returned task-appropriate output in the CLI, and a natural `/overdrive` security prompt selected `guard`. The CLI picker confirmed `/overdrive:<skill>` namespacing, though only four direct skills were tested with that exact form. Antigravity IDE listed all ten skills and `/assert` returned the test-first procedure; later IDE test invocation was blocked by a system npm configuration error and an unapproved command prompt. Temporary project-scoped command rules were removed after use. The Codex plugin is installed and enabled in an isolated custom `CODEX_HOME`, but a post-activation chat returned HTTP 401 in the credential-free test home. Kiro CLI, Claude Code, and Grok Build were unavailable; the Codex IDE extension was absent. Earlier flat-layout IDE evidence is historical. See the [cross-agent results](cross-agent-skill-installability-results.md) for details and limits.
- **Primary instructions:** [AGENTS.md](../AGENTS.md).

## Purpose and architecture

The repository packages global engineering guidance, a skill-authoring handbook, reusable agent skills, and a small npm CLI that copies skills into host-specific discovery folders. It contains no hosted application or service implementation.

| Area | Responsibility | Source of truth |
| --- | --- | --- |
| Global workflow and permissions | Engineering defaults, SDD/TDD, token/context efficiency, documentation refresh, verification and side-effect boundaries | [AGENTS.md](../AGENTS.md) |
| Skill authoring standard | Package structure, trigger design, validation and behavioral evaluation expectations | [SKILLS.md](../SKILLS.md) |
| Automated package quality | Required skill metadata/names, source Markdown links, evaluation labels, README catalog coverage, and CI workflow | [checker](../scripts/check_skill_packages.py), [checker tests](../scripts/tests/test_package_quality.py), [GitHub Actions](../.github/workflows/package-quality.yml) |
| npm skill installer | Interactive project/global selection, VS Code and project-marker host detection, optional host picker when context is ambiguous, optional router, host-specific skill destinations, and collision-safe copies | [specification](npm-installable-skills-spec.md), [CLI](../bin/overdrive.js), [package metadata](../package.json), [Node tests](../scripts/tests/installer.test.js) |
| Current-ID skill evaluations | Paired execution cases, Guard security fixture, Verify browser flow, and separate host-routing evidence | [paired benchmark](skills-e2e-benchmark-results.md), [Guard evaluation](../skills/guard/references/evaluation.md), [Verify evaluation](verify-validation.md), [routing probe](automatic-routing-validation.md) |
| Skill authoring capability | Create, revise, or review focused engineering skills, including source-grounded handling of comments in code-related skills | [Forge](../skills/forge/SKILL.md) |
| Long-session continuity and targeted retrieval | Resume from repository-local checkpoints after verifying branch/revision/source freshness; navigate from a compact project index | [Continuity](../skills/continuity/SKILL.md), [evaluation](../skills/continuity/references/evaluation.md) |
| AI-assisted application security review | Read the repository before judging; inspect eight threat families, rank evidence-based findings, and require explicit approval before changing reviewed application files or environments | [Guard](../skills/guard/SKILL.md), [threat review](../skills/guard/references/threat-review.md), [evaluation](../skills/guard/references/evaluation.md) |
| Spec-first coding workflow | Specify behavior before code, then test-first implementation; verify comment claims against code and contracts | [Assert](../skills/assert/SKILL.md) |
| Unit-first application verification | Prefer concurrent feature tests with safe non-swarm fallbacks; save/share aggregate before E2E, then prove the integrated journey with browser/MCP evidence | [Verify](../skills/verify/SKILL.md), [evaluation](../skills/verify/references/evaluation.md), [executed evaluation](verify-validation.md) |
| Prune workflow | Targeted retrieval, MCP consideration, bounded outputs, source inspection beyond comment matches, and persistent codebase map maintenance | [Prune](../skills/prune/SKILL.md) |
| Concise communication style | Compact answers and progress updates while preserving evidence, technical payloads, uncertainty, and safety clarity | [Signal](../skills/signal/SKILL.md) |
| Codebase maintainability workflow | Dynamically inventory language-specific components, modules, helpers, tests, and monorepo boundaries; improve structure with explicit API confirmation and sensitive-file protection; resolve comment conflicts against verified code, contracts, and project conventions | [Refactor](../skills/refactor/SKILL.md) |
| Agent/LLM architecture audit | Source-linked newcomer map plus fast, evidence-led trace across six conditional system planes spanning host, context, orchestration, tools, delivery, data, and operations; read-only reports with ranked fixes | [Trace](../skills/trace/SKILL.md), [system map](../skills/trace/references/agent-stack.md), [proposed evaluation](../skills/trace/references/evaluation.md) |
| Code-change review | Read-only change-to-outcome trace across diffs, callers, relevant callees, tests, README, and deployment assumptions; findings require a concrete trigger, bad outcome, and smallest fix | [Review](../skills/review/SKILL.md), [proposed evaluation](../skills/review/references/evaluation.md) |
| Refactor E2E evidence | Paired Codex control/treatment results for refactoring, API approval, sensitive-file protection, and React/C#/Rust/Python/mixed-monorepo structure assessment | [Validation results](refactor-validation.md) |
| Frontend design workflow | Hiroqt’s product-first visual direction, whole-codebase existing-design review and user choice, source-grounded comment handling, purposeful motion, semantic icon use, WCAG-version-aware accessibility, responsive checks, technical SEO, static HTML inspection, and applied UX concepts | [Render](../skills/render/SKILL.md), [Production quality](../skills/render/references/production-quality.md), [Laws of UX guide](../skills/render/references/laws-of-ux.md) |

## Entrypoints and boundaries

- Repository overview, skill usage, and install examples: [README.md](../README.md).
- Guard's threat-specific checks and evaluation cases are in `skills/guard/references/`; one current-ID synthetic deterministic case ran, while independent judge/human review and other threat families remain open.
- npm installer: [package command](../bin/overdrive.js) and [specification](npm-installable-skills-spec.md). `npx overdrive-skills install --scope global` runs from any IDE terminal and asks which supported agents and skills to install; the `overdrive` router is optional. Package metadata targets the unscoped `overdrive-skills` name, alongside the earlier scoped `@hiroqt/overdrive` release. The old Python installer has been retired while Python remains for package-validation scripts.
- Authoring guide and package checklist: [SKILLS.md](../SKILLS.md).
- Installable capabilities live in `skills/<name>/SKILL.md`; optional Codex UI metadata is in that package’s `agents/openai.yaml`.
- Continuity stores the compact project index and active checkpoint in `.overdrive/continuity/`; the installer adds selected-host always-loaded guidance from [its asset](../skills/continuity/assets/always-on.md).
- Every skill package includes a linked `references/evaluation.md` with distinct [D] deterministic, [J] LLM-as-a-judge, and [H] human evaluation summaries; see [the authoring standard](../SKILLS.md#evaluation-summaries-for-every-skill).
- Concise response style and tool/context efficiency are separate capabilities; the former must not suppress useful retrieval, verification, or exact evidence.
- Refactor discovers and maps each language/framework's real constructs—entrypoints, components, contracts, collaborators, helpers, and tests—and traces dependency direction before improving structure. Mixed monorepos are assessed per app/package. It requires confirmation before API restructuring and protects sensitive files. It does not imply scheduled or background work.
- Trace maps the repository for a new developer, then follows one representative agent request through relevant checkpoints in six system planes. Its map retains all 14 supplied labels and adds conditional host, product, identity, data, model, orchestration, tool, output, operations, evaluation, and release checkpoints. “ArCs” remains undefined; behavioral evaluation is proposed, not run.
- Review uses a read-only Change-to-Outcome Trace: identify the requested diff, inspect changed code and discoverable callers/callees, follow a concrete input through state and output, and verify each finding's trigger before reporting it. It states an evidenced load assumption and uses concise, numbered severity groups. Behavioral evaluation is proposed, not run.
- Render no-dependency HTML inspector and fixtures are in `skills/render/scripts/` and `skills/render/tests/`.
- Evaluation records and package-specific validation notes live in `docs/`, including [Verify's synthetic evaluation](verify-validation.md); isolated subprocesses overlapped, while a separate worker dispatch did not demonstrate swarm concurrency.
- Verify writes new run evidence to OS temporary storage by default, cleans it after reporting, and uses `.overdrive/verify/results/` only when persistent project evidence is required; see [Verify's workflow](../skills/verify/SKILL.md).
- Current and historical outcomes from the paired Codex benchmark, cross-agent installation, and one-host routing checks are recorded in the [benchmark results](skills-e2e-benchmark-results.md), [installability results](cross-agent-skill-installability-results.md), and [automatic-routing results](automatic-routing-validation.md). The npm checks establish package installability and ten skill invocations in Antigravity CLI, plus `/assert` invocation in Antigravity IDE; they do not prove every skill is followed or automatically selected on every host. Local benchmark scripts and synthetic fixtures are excluded by `.gitignore`.
- [Signal validation](signal-validation.md) records seven historical in-session behavior probes and a current paired case; automatic selection was not observed for the realistic concise-summary prompt.
- Skills provide workflow guidance; they do not install themselves, grant authorization, publish changes, or prove automatic host selection.

## Commands

Run `npm test`, `npm pack --dry-run`, `python3 -m unittest discover -s scripts/tests -v`, and `python3 scripts/check_skill_packages.py` for installer and package checks; GitHub Actions runs them on pushes and pull requests, and repeats them before a gated npm release publish. The Node tests verify terminal color fallback, IDE/project host detection, VS Code project/global paths, host paths/manifests, optional router and selected-skill behavior, default selection, copying, Codex marketplace/TOML registration and activation, collisions, and Claude's plugin namespace. IDE/project detection is advisory and may be overridden with `--host`. Installer E2E evidence, publication verification, and current host limitations are in the [cross-agent results](cross-agent-skill-installability-results.md).

## High-value checks and constraints

- The package-quality gate checks skill names/frontmatter, local links, required evaluation labels, and README catalog coverage; run `git diff --check` after documentation changes.
- Keep behavioral skill evaluation distinct from structural validation. Existing records label unrun evaluations rather than presenting them as proof.
- Do not copy sensitive personal history into distributable skill packages. Review the policy in [AGENTS.md](../AGENTS.md).
- For Prune’s behavior and validation limits, see [its validation record](prune-validation.md).
- For Render scope and test evidence, see [its validation record](render-validation.md); one Codex routing probe is recorded; repeated selection and non-Codex host behavior remain unmeasured.
- Its 2026-10-18 paired synthetic E2E passed the explicitly invoked design-choice/WCAG 2.0 treatment and failed the control's choice check; see the validation record for fixture scope and limitations.
- For Refactor's executed control/treatment evidence and limits, see [its E2E validation record](refactor-validation.md).
- Trace's deterministic, judge, and human cases are proposals; no behavioral run or automatic-routing check is claimed.
- Review's deterministic, judge, and human cases are proposals; no behavioral run or automatic-routing check is claimed.

## Update notes

- Initial map created on 2026-10-15 from the root instructions, README, skill handbook, package entrypoints, and current Git status.
- Updated on 2026-10-15 to include Render and its static inspection harness.
- Updated on 2026-10-15 to include Signal and clarify its boundary with Prune.
- Updated on 2026-10-15 with the in-session Hiroqt behavior probe and its evaluation limits.
- Updated on 2026-10-15 with the paired Codex CLI skill benchmark and actual five-skill results.
- Updated on 2026-10-16 with individual Laws of UX application notes and concept links in the Render reference.
- Updated on 2026-10-17 with host-specific Agent Skills installation guidance and cross-agent installability E2E.
- Updated on 2026-10-21 with the npm installer, interactive cyan-to-violet wordmark, project marker suggestions, and public package verification; the legacy Python installer was retired.
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
- Updated on 2026-10-19 with current package-ID paired, Guard, Verify, installer, and Codex automatic-routing evaluations; Signal selection remains unobserved and other hosts remain untested.
- Updated on 2026-10-20 by renaming Agent Architecture Audit to Trace and expanding its layer checklist into six conditional system planes; proposed evaluation cases remain unrun.
- Updated on 2026-10-20 with Review, a read-only change-to-outcome process, concrete-finding output, and proposed evaluations; no behavioral evaluation has run.
- Updated on 2026-10-21 with the npm installer, five-host path matrix, package checks, and host smoke-test limits; live invocation is recorded separately from file-copy evidence.
- Updated on 2026-10-21 with Continuity routing, compact project-local checkpoints, and selected-host native always-loaded guidance; behavioral evaluation remains proposed.
- Updated on 2026-10-21 with packed npm-shim E2E: Antigravity CLI plugin validation and `/assert` path citation passed; Codex installation/registration passed but chat activation was inconclusive. Earlier flat-layout IDE results are labeled historical in the cross-agent results.
- Updated on 2026-10-21 with current grouped-plugin Antigravity IDE `/assert` invocation, Codex external `CODEX_HOME` marketplace registration, and TOML comment-preserving regression coverage.
- Updated on 2026-10-21 with all-ten Antigravity CLI direct skill probes, four native namespaced command probes, the natural `/overdrive` to `guard` route, and cleanup of temporary project permissions; IDE coverage remains `/assert` plus discovery listing.
- Updated on 2026-10-23 with the any-IDE global terminal entry point, independently selectable skills, an optional router, npm package smoke checks, and current host limits.
- Updated on 2026-10-23 with the public `overdrive-skills@0.1.0` release, registry checksum verification, and version-matched GitHub Release publishing workflow; npm Trusted Publishing configuration is required before the first automated update.
- Updated on 2026-10-23 with VS Code Copilot project/global skill paths and dynamic host inference from the active VS Code terminal or a single project marker.
