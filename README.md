# Overdrive

**Hiroqt’s portable AI coding-agent toolkit: source-grounded, stack-aware, test-first, and built for product-fit interfaces.** Overdrive combines seven focused skills with shared guidance for maintainable code, efficient exploration, and evidence-based delivery.

## Contents

| Area | Name | Purpose |
| --- | --- | --- |
| Toolkit | [Engineering instructions](AGENTS.md) | Shared workflow, permissions, verification, and context guidance |
| Toolkit | [Skill handbook](SKILLS.md) | Skill-authoring standard, release checklist, and evaluation guidance |
| Overdrive skill | [Forge](skills/forge/SKILL.md) | Create, revise, and review focused engineering skills |
| Overdrive skill | [Refactor](skills/refactor/SKILL.md) | Map repository-specific structures and improve maintainability safely |
| Overdrive skill | [Signal](skills/signal/SKILL.md) | Communicate concisely while preserving technical detail and evidence |
| Overdrive skill | [Render](skills/render/SKILL.md) | Craft product-fit frontend experiences and verify production quality |
| Overdrive skill | [Assert](skills/assert/SKILL.md) | Specify behavior, then implement test-first |
| Overdrive skill | [Prune](skills/prune/SKILL.md) | Reduce avoidable search, output, and context overhead |
| Overdrive skill | [Verify](skills/verify/SKILL.md) | Run feature-level unit tests concurrently through swarm, summarize results, then prove the overall app flow end to end |

## Global instructions

1. Copy [AGENTS.md](AGENTS.md) into `~/.codex/AGENTS.md`, or `$CODEX_HOME/AGENTS.md` when configured.
2. Check whether an `AGENTS.override.md` is active; it takes precedence.
3. Start a fresh Codex session and verify the loaded instructions.

Keep project commands and specialized constraints in each repository’s own instruction files. The global defaults are local reviews, private project memory, and approval for destructive or shared-environment changes.

## Skill authoring guide

Read [SKILLS.md](SKILLS.md) when creating or reviewing a capability. It distinguishes global policy, reusable skill procedures, supporting resources, and private context. The release checklist adapts the supplied 30-point quality guide.

`SKILLS.md` is a handbook. It is not an installable skill and should not be pasted into every skill’s entrypoint. Each installable capability lives in its own folder with an exact `SKILL.md` filename.

## The Overdrive skills

Overdrive is the name of this seven-skill collection. Each package is independently installable and follows the standard `skills/<name>/SKILL.md` layout:

```text
skills/
├── forge/     # create and review skills
├── refactor/  # evolve code structure across stacks
├── signal/    # concise, evidence-preserving communication
├── render/    # product-fit frontend craft
├── assert/    # specification-first, test-first coding
├── prune/     # efficient repository and context exploration
└── verify/    # parallel feature unit tests, summaries, and real app E2E proof
```

The package IDs and invocation names are `forge`, `refactor`, `signal`, `render`, `assert`, `prune`, and `verify`. Existing installations under the previous IDs do not migrate automatically; remove any old copies from the target agent before using the renamed package.

## What makes Overdrive different

Overdrive is built to keep agents grounded in the real codebase and the user's actual requirements. Its skills reinforce each other across discovery, implementation, and review:

| Bottleneck | Overdrive response | Skill |
| --- | --- | --- |
| A stale comment dictates a new implementation | Treat comments as claims. Trace the symbol, callers, tests/contracts, maintained docs, supported APIs, and local patterns. Follow verified architecture and project standards over stale or deprecated recipes; preserve proven domain and safety constraints, and correct stale comments when appropriate. | [Refactor](skills/refactor/SKILL.md), [Assert](skills/assert/SKILL.md), [Render](skills/render/SKILL.md), [Prune](skills/prune/SKILL.md) |
| A refactor assumes every repository uses the same stack | Identify languages and frameworks from project files, then map real entrypoints, components, services, types, helpers, tests, and package boundaries before proposing a bounded improvement. | [Refactor](skills/refactor/SKILL.md) |
| Code is written before the behavior is clear | Define observable acceptance first, then use test-first implementation and report only checks that actually ran. | [Assert](skills/assert/SKILL.md) |
| Test results are serial, fragmented, or confused with app proof | Dispatch independent feature unit suites concurrently, save and share their aggregate before E2E, then verify the integrated user journey. | [Verify](skills/verify/SKILL.md) |
| Progress updates bury decisions in filler | Keep communication concise while retaining technical payloads, evidence, uncertainty, and safety details. | [Signal](skills/signal/SKILL.md) |
| A frontend looks generic or ignores user context | Fit the design to the product, apply relevant Laws of UX concepts, inspect responsive and accessible states, and distinguish source checks from browser evidence. | [Render](skills/render/SKILL.md) |
| Token saving cuts out useful investigation | Bound searches and tool output while expanding retrieval when evidence, risk, or uncertainty requires it. | [Prune](skills/prune/SKILL.md) |
| New skills make unsupported quality claims | Define triggers, boundaries, verification, and evaluation evidence before packaging a reusable workflow. | [Forge](skills/forge/SKILL.md) |

This is **comment-aware, code-first guidance**, not a rule to ignore comments. Comments can document valid constraints; agents verify them against the implementation and other authoritative project evidence before relying on them.

## Evidence behind the workflows

Overdrive keeps measured results separate from product claims. The linked records describe the exact setup and limitations:

- [Paired skill benchmark](docs/skills-e2e-benchmark-results.md): the recorded run passed all five treatment cases; four controls also passed and one passed only with its skill. It was one unblinded Codex run with explicit skill invocation, so it does not establish broad reliability or automatic routing.
- [Refactor stack evaluation](docs/refactor-validation.md): the synthetic React/TypeScript, C#/ASP.NET Core, Rust, Python, and mixed-monorepo treatment cases passed 5/5; controls passed 4/5. Each stack used a small fixture, so this is evidence for those cases, not every codebase.
- [Render design-review evaluation](docs/render-validation.md): treatment passed the deterministic design-choice and WCAG 2.0 review checks while control missed the design-choice check. The fixture had no runnable browser, so this is not proof of rendered UI or accessibility conformance.
- [Cross-agent installation checks](docs/cross-agent-skill-installability-results.md): the recorded CLI runs verified installation paths and copied files, but did not prove that each host automatically selects or follows the skills.

The source-grounded comment policy is newly added and has **not yet had a dedicated behavioral E2E benchmark**. The results above are historical runs from before the package rename and this policy update; see each record for details.

Verify is newly added. Its concurrent feature-level unit sequence, pre-E2E aggregate summary, separate result folders, real-app E2E gate, and permission behavior are specified in the skill and evaluation guide, but have not yet been independently behaviorally evaluated.

## Install skills across coding agents

Installable folders under [`skills/`](skills/) use the open [Agent Skills format](https://agentskills.io/specification): each contains `SKILL.md` metadata and instructions, with optional bundled references, scripts, or assets. The [Vercel Skills CLI](https://github.com/vercel-labs/skills) installs packages into host-specific directories. A shared format makes packages portable; discovery, activation, slash commands, script execution, and permissions still depend on each host and version.

This repository is private. Authenticate with GitHub CLI, clone the skill source once, then run the installer from the root of the project where you want to use the skills. It shows an animated Hiroqt wordmark, asks whether to install to that project or your user-wide agent folders, then displays the destination and agent list for confirmation. It installs all skill packages to Claude Code, Codex, Gemini CLI, Google Antigravity, Cursor, and Kiro CLI.

```bash
gh repo clone hiroqt/overdrive ~/hiroqt-skills
cd /path/to/your/project
python3 ~/hiroqt-skills/scripts/install_skills.py
```

Requirements: Python 3, Node.js/npm, and GitHub CLI authentication for this private repository. The selected project is the current working directory. Choose `1` for project-local skill files or `2` for user-wide skill locations, then type `y` to confirm. `Ctrl+C` cancels. In terminals without ANSI color support, or when `NO_COLOR` is set, the logo prints without animation. Update the cloned source with `git -C ~/hiroqt-skills pull` and rerun the installer when you want newer versions.

The installer copies files to avoid skills depending on the source clone after installation. It targets the six listed agents as a set; the Skills CLI controls their host-specific directories. To install a single skill or a different agent set, use the direct Skills CLI command below and replace the skill/agent options as needed.

| Host | Skills CLI target | Common project location | Host-specific discovery check |
| --- | --- | --- | --- |
| Claude Code | `claude-code` | `.claude/skills/<name>/SKILL.md` | Run `/skills`; see [Claude skill locations](https://code.claude.com/docs/en/skills). |
| OpenAI Codex CLI | `codex` | `.agents/skills/<name>/SKILL.md` | Check Codex's available skills; see [Codex skill locations](https://learn.chatgpt.com/docs/build-skills). |
| Gemini CLI | `gemini-cli` | `.agents/skills/` or `.gemini/skills/` | Run `/skills list`; see [Gemini skill management](https://geminicli.com/docs/cli/using-agent-skills/). |
| Google Antigravity IDE | `antigravity` | `.agents/skills/<name>/SKILL.md` | Check the agent's Customizations/skills UI; see [Antigravity skill locations](https://antigravity.google/docs/skills). |
| Cursor | `cursor` | `.agents/skills/` or `.cursor/skills/` | Check Agent skills in Cursor; see [Cursor skill locations](https://cursor.com/help/customization/skills). |
| Kiro CLI | `kiro-cli` | `.kiro/skills/<name>/SKILL.md` | Check discovered skills in the CLI; see [Kiro Agent Skills](https://kiro.dev/docs/skills/). |

Gemini CLI and Antigravity are separate Google products with different global paths and lifecycle behavior. The installer uses each selected host's supported project path; Antigravity IDE also documents `~/.gemini/config/skills/` for global skills. Kiro IDE supports `.kiro/skills/` and can import a skill folder through its UI; the E2E below tests only the `kiro-cli` installer target, not the IDE import UI. For targets not listed, use only the host's documented Agent Skills folder or import flow. Do not assume a `SKILL.md` file alone enables discovery in every AI coding tool. See the [installer's current supported-agent list](https://github.com/vercel-labs/skills#supported-agents).

### Direct install with the Skills CLI

Run this from the destination project if you need a single skill or a custom agent selection:

```bash
npx skills@latest add ~/hiroqt-skills --skill render --agent codex
```

Add `--global` for user-wide installation. See [the Skills CLI options](https://github.com/vercel-labs/skills#options).

### Recorded installation checks

The [cross-agent installation results](docs/cross-agent-skill-installability-results.md) record actual Skills CLI package copies, project/global scope runs, and a pseudo-terminal check of the animated installer banner. These results verify installation paths and copied file contents; they do not prove each coding agent activates or follows the skills.

## Install Forge

After cloning the repository, install only the authoring skill to a supported host with:

```bash
npx skills@latest add . --skill forge --agent <agent-id>
```

Review existing skills with the same name before confirming an overwrite. Alternatively, import or copy the complete `skills/forge` folder using the target host's documented skill flow.

Invoke it with a focused request:

```text
Use $forge to create a review-only API-contract skill
using this repository’s existing contracts and validation commands.
```

```text
Use $forge to review this skill package without modifying it.
```

## Assert: specification-first, test-first engineering

Use the [assert skill](skills/assert/SKILL.md) for coding requests. It turns the request into a proportionate spec with acceptance checks before implementation, then uses a red-green-refactor loop for behavior changes. It carries Arnel’s preferences for small diffs, existing conventions, preserved unrelated work, and honest verification reports. The skill is guidance; it does not replace higher-priority instructions, repository rules, or task-specific authorization.

```text
Use $assert to implement the requested behavior.
```

## Verify: parallel unit tests, then real app E2E

Use [Verify](skills/verify/SKILL.md) when you need evidence that changed functions/features pass focused unit tests and the running app completes a real user journey. It dispatches independent feature test groups concurrently through the host's swarm/parallel-agent facility, saves per-feature results and an aggregate summary, and shares that summary before E2E. Run artifacts live in separate `skills/verify/results/feature-summaries/` and `skills/verify/results/e2e/` folders. For web apps, it requires browser interaction with the running app; mocked API calls, component tests, a successful build, or a health check do not count as E2E proof. It asks before tests involving authenticated accounts, external services, or shared state, and reports incomplete status when a gate fails or permission is unavailable.

```text
Use $verify to test every changed feature concurrently through swarm, share the unit summary, then launch the app and prove the overall user flow in a browser.
```

## Prune: efficient repository exploration

Use [prune](skills/prune/SKILL.md) to reduce repeated searches, oversized tool results, and unnecessary context retention while preserving the investigation needed for a correct solution. On first use in a codebase, it creates or extends a source-linked `docs/CODEBASE_MAP.md`; after meaningful code changes and before session handoff, it refreshes that map. It explicitly considers relevant MCP tools and schemas as part of the efficiency decision; it does not optimize token count by skipping useful sources, checks, or domain knowledge.

```text
Use $prune to investigate and implement this task efficiently.
```

## Refactor: codebase structure and maintainability

Use [Refactor](skills/refactor/SKILL.md) to identify each repository's languages/frameworks and map the structures they actually use: composition roots and entrypoints, UI/domain components, contracts and types, state and services, data adapters, helpers/extensions, and tests. Examples include React components/hooks/services, C# projects/DI/controllers/domain types/extensions, Rust crates/modules/traits/helpers, Python packages/classes/protocols, and equivalent constructs in other stacks. For monorepos, it maps each app/package separately and traces boundaries between them. It makes incremental, evidence-based maintainability improvements while preserving behavior and local conventions. Sensitive files such as `.env` files stay protected; API or contract restructuring needs your explicit confirmation. Each invocation reassesses the current codebase; the skill does not run continuously in the background.

```text
Use $refactor to assess this repository and make the next safe, high-value maintainability improvement.
```

## Signal: concise communication

Use [Signal](skills/signal/SKILL.md) for compact answers and progress updates that retain technical details, evidence, and uncertainty. It covers response wording; use Prune for search, tool-output, and context overhead.

Invoke it with `$signal`, or ask for `/signal lite`, `/signal full`, or `/signal ultra`. `/signal off` returns to the host's normal response style. Commands and aliases work only when the host exposes the installed skill; they do not configure host commands by themselves.

Forge includes its template, evaluation reference, and optional Codex UI metadata; it has no custom executable helpers. Render includes scoped references and a read-only static HTML inspector. Follow each target host’s discovery and invocation rules; portable metadata does not guarantee identical behavior across products.

## Frontend design and production checks

Use [Render](skills/render/SKILL.md) for new web surfaces, redesigns, visual critiques, or frontend implementation. It prioritizes product-fit visual direction, useful icons and motion, practical accessibility, responsive inspection, technical SEO for public pages, and measured performance guidance. Familiar patterns are critique signals, not blanket bans.

For static or server-rendered HTML, the packaged inspector can be run with `python3 skills/render/scripts/inspect_html.py <html-file-or-directory>`. It checks a small set of markup signals; browser interaction, visual quality, accessibility, and field performance still need appropriate project-level validation.

## Validation and limits

See the [executed validation record](docs/forge-validation.md) for checks performed and remaining limits.

Packaging validation checks syntax and resources. Behavioral evaluation checks actual decisions and outputs; explicit invocation does not prove automatic discovery. Run realistic cases using the [evaluation protocol](skills/forge/references/evaluation.md), and distinguish executed tests from planned scenarios.

These files define behavior. They do not grant access, configure MCP connections, install themselves, create scheduled workers, or enable GitHub automatic reviews. Keep sensitive history and credentials outside distributed skill packages.
