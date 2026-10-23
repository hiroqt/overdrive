# npm installer specification

## Outcome

Install selected skills into the native user-level locations of supported coding agents. The terminal-based npm command can be run from any IDE terminal; it is not a VS Code extension and does not claim to support unlisted agents. The `overdrive` task router is an optional skill, and domain skills install independently without it.

## Scope and behavior

- `npx overdrive-skills install` uses Node built-ins and prompts for scope, host(s), skills, and any host-specific surface choice. `npx overdrive-skills install --scope global` is the global entry point from any IDE terminal.
- Project scope is preselected; global scope must be chosen explicitly. The installer scans the current project for known host markers, suggests likely hosts, and requires confirmation or manual replacement. With no matching markers, the user selects hosts from the full list. `--host <id>` supports repeatable/comma-separated explicit selection. Antigravity global installs allow IDE, CLI, or both.
- Print the existing cyan-to-violet `HIROQT` type-on wordmark in interactive color terminals. Respect `NO_COLOR` and `TERM=dumb`; do not emit ANSI control sequences to redirected/non-TTY output.
- Copy only selected skill packages, including references, assets, scripts, and tests. The interactive picker selects all available skills, including `overdrive`, by default; users can choose any nonempty subset. Include host-specific metadata only for the selected host: `agents/openai.yaml` is Codex-only and must not appear in other hosts' bundles.
- Treat grouped plugin/Power folders as atomic destinations: if the bundle already exists, skip that host bundle without merging or changing it. Flat Kiro project and Codex IDE skills are individually skipped on collision.
- Show every bundle/skill destination and host registration/config path before writing. Registration merges preserve unrelated keys and refuse malformed marketplace JSON or malformed/conflicting Overdrive registration. Cancel means no file writes.
- When `continuity` is selected, preview and write a compact host-native always-loaded rule: Claude project/global `.claude/rules/overdrive-continuity.md` / `~/.claude/rules/overdrive-continuity.md`; Codex project/global `AGENTS.md` / `$CODEX_HOME/AGENTS.md`; Kiro `.kiro/steering/overdrive-continuity.md` / `~/.kiro/steering/overdrive-continuity.md`; Antigravity `.agents/rules/overdrive-continuity.md` / `~/.gemini/config/rules/overdrive-continuity.md`; Grok project `AGENTS.md`. Merge one marked block into an existing `AGENTS.md`, preserve all surrounding text, skip an existing managed block or standalone rule file, and reject malformed markers. Grok global plugin installation has no documented global always-loaded guidance path and must report that limitation.
- For a new Codex CLI bundle, preview the `$CODEX_HOME/config.toml` marketplace registration path, local marketplace root, and plugin-cache activation destination. After confirmation and file registration, run `codex plugin marketplace add <root>` before `codex plugin add overdrive@<marketplace>`; if the CLI is missing, print both commands for later, and if either step fails, report completed writes and the failure.
- Do not remember project preferences. Adaptation comes only from the current conversation and repository instructions.

## Host layout and command contract

| Host/surface | Project install | Global install | Invocation |
| --- | --- | --- | --- |
| Claude Code IDE/CLI | `.claude/skills/overdrive/` plugin bundle | `~/.claude/skills/overdrive/` plugin bundle | `/overdrive:<skill>` |
| Codex CLI | `.codex/plugins/overdrive/` plus `.agents/plugins/marketplace.json` and `.codex/config.toml` registration; register the repo marketplace, then run `codex plugin add` | `$CODEX_HOME/plugins/overdrive/` and `$CODEX_HOME/config.toml` registration (default `$CODEX_HOME=~/.codex`); marketplace goes under `~/.agents` when CODEX_HOME is within the user home, and under CODEX_HOME otherwise; register the marketplace, then populate its plugin cache | `$<skill>` or `/skills` |
| Codex IDE extension | `.agents/skills/<skill>/` | `~/.agents/skills/<skill>/` | Codex native skill invocation; grouped plugins are unsupported by this surface |
| Kiro IDE/CLI | Flat `.kiro/skills/<skill>/` | `~/.kiro/powers/overdrive/` Power bundle | `/overdrive` routes and `/skill` invokes a project skill; global Power slash aliases are not promised unless verified |
| Antigravity IDE | `.agents/plugins/overdrive/` | `~/.gemini/config/plugins/overdrive/` | Host-native skill command, normally `/<skill>` |
| Antigravity CLI | `.agents/plugins/overdrive/` | `~/.gemini/antigravity-cli/plugins/overdrive/` | Host-native skill command, normally `/<skill>` |
| Grok Build CLI | `.grok/plugins/overdrive/` | `~/.grok/plugins/overdrive/` | `/<skill>`; use any documented qualified command for a collision |

Every grouped bundle contains a host-supported manifest and only selected skills at `skills/<name>/`. Claude's `.claude/skills/overdrive` is a skills-directory plugin, which provides `/overdrive:<skill>` without a separate marketplace registration. Codex keeps its CLI plugin under `$CODEX_HOME/plugins/overdrive` so its metadata stays separate from Antigravity's plugin folder. For a default or home-nested CODEX_HOME, its marketplace entry remains under `~/.agents/plugins/marketplace.json`; an external CODEX_HOME gets a marketplace root there and a corresponding local-marketplace entry in its config. After confirmation, the installer registers the marketplace with `codex plugin marketplace add` and then runs `codex plugin add` so the Codex CLI copies the plugin into its native cache; it previews the CODEX_HOME config path touched by that registration. Antigravity uses its strict native plugin manifest; Grok uses its documented Claude-compatible plugin format. Kiro's project skills and Codex IDE skills remain flat because those surfaces do not document grouped plugin discovery. Selecting Codex installs both its CLI plugin and IDE skill folders; selecting Antigravity project scope uses the shared workspace plugin location, while global scope asks which surface(s) to target.

## Optional Overdrive task router

- The installable `overdrive` skill is the collection's task-fit router. A bare host-native invocation routes a natural-language task to the single best matching installed skill; `/overdrive <skill> <task>` explicitly selects a skill and passes the remaining request through.
- The router reads its generated `references/installed-skills.md` list and never dispatches to a skill excluded from that install. It is a normal selectable skill: when selected, its generated list contains only selected domain skills; when omitted, install only selected domain skills and create no router files or installed-skill list.
- Route using the user's requested outcome and relevant repository context. State the selected skill and a brief reason. If no installed skill fits, say so and handle the request normally where appropriate. Ask only if a consequential decision remains unresolved.
- Do not automatically chain skills. Name a useful handoff only when a distinct next task remains, and do not claim it ran.
- Keep each domain skill's instructions authoritative. The router identifies and loads the selected skill's own `SKILL.md`; it does not duplicate or replace that workflow.
- Preserve each host's native invocation form. Use a bare `/overdrive` only where that host exposes the skill under that name; otherwise document and test the host-native equivalent. Keep native per-skill invocations available.
- Test the automatic router, explicit override, installed-skill filtering, and every domain skill separately. Report discovery, invocation, and behavioral evidence as distinct results per host.

## Adaptive skill behavior

Each of the eleven `SKILL.md` files must tell the agent to:

1. Inspect only the current task's relevant repository instructions, stack, conventions, state, tools, and tests before choosing a workflow.
2. Scale steps and checks to the task and risk, use only tools/checks actually available, and keep the skill's existing specialty and safety boundaries.
3. Ask only when a consequential decision cannot be resolved from the request or repository; otherwise use a reversible, stated assumption.
4. Mention a relevant handoff when it helps, without chaining skills automatically or claiming another skill ran.
5. Use only current conversation/repository context for adaptation; do not write or retain preferences for future sessions.

The guidance must be tailored to each skill, not pasted as a generic replacement for its workflow. Continuity creates a compact project index on first substantial use only when one is missing; there is no init command, and checkpoint files are never committed automatically.

## Constraints and invariants

- Preserve Agent Skills package structure and all selected package resources.
- Use Node built-ins only; do not add runtime dependencies.
- Do not overwrite existing files or bundle roots. Do not silently merge an existing bundle.
- If a copy fails after creating a new folder, preserve non-empty partial content and report the exact cleanup needed; remove only a newly created empty folder.
- Merge only the selected host's registration. Preserve unknown existing JSON/TOML content; fail before writes on malformed marketplace JSON or malformed/conflicting Overdrive registration.
- A project install resolves from the invocation directory. A global install uses the selected host's documented user locations and relevant host home override when documented.
- Host format/path documentation proves compatibility shape, not live discovery or invocation. Report host availability and runtime checks separately.
- Prepare and verify the package before the first public `overdrive-skills@0.1.0` release; do not commit or push without direct authorization.
- Retire the legacy Python installer; retain Python only for package validation tools that still use it.

## Acceptance checks

- [ ] The CLI requires explicit host selection interactively or accepts explicit `--host`; it never defaults to every host.
- [ ] Project scope is preselected and global scope requires an explicit user choice.
- [ ] Recognized project host markers are shown as suggestions and require user confirmation; unknown or ambiguous markers do not trigger implicit host installation.
- [ ] The original cyan-to-violet wordmark is animated only for an interactive color TTY; non-TTY, `NO_COLOR`, and `TERM=dumb` output contains no ANSI sequences.
- [ ] Package metadata declares public access for `overdrive-skills` and links to the canonical GitHub repository; review the package file set before its first public `0.1.0` release.
- [ ] Installer/package checks run on pushes and pull requests; npm publishing runs only for a published GitHub Release whose `vX.Y.Z` tag matches `package.json`, using npm Trusted Publishing and OIDC.
- [ ] Project/global selections produce only selected-host paths; Antigravity global surface selection is IDE, CLI, or both.
- [ ] Each grouped host bundle has its correct host manifest, `skills/<name>/SKILL.md`, and all nested resources.
- [ ] The router is selectable and copied only when selected; domain skills install without it.
- [ ] When selected, the router's installed-skill list exactly matches selected domain skills and excludes the router itself.
- [ ] `/overdrive` routes by task and repo context; `/overdrive <skill>` forces that installed skill; partial installs never route to uninstalled skills; native direct skill commands remain available.
- [ ] Codex IDE gets flat skills; Codex CLI receives a grouped plugin, previewed collision-safe marketplace/config registration, and native plugin-cache activation; non-Codex bundles omit Codex-only `agents/openai.yaml` metadata.
- [ ] Global Codex CLI paths honor `CODEX_HOME`; local marketplace source paths stay within their root, and external CODEX_HOME uses a marketplace registered from that root.
- [ ] Kiro project scope is flat and global scope uses the Power bundle format.
- [ ] Claude Code uses `/overdrive:<skill>` plugin namespacing and no longer rewrites `review` as an alias.
- [ ] Preview lists bundle/skill and registration/config paths; declining creates or changes nothing.
- [ ] Existing bundle collisions skip as a unit; existing flat skills skip individually; unrelated config survives a registration merge.
- [ ] Continuity installs only selected-host always-loaded guidance, previews all paths, preserves existing `AGENTS.md` content, skips rule collisions, and reports Grok's global-guidance limitation.
- [ ] Tests cover the user-visible selection, layout, reference preservation, registration, collision, and cancellation behavior.
- [ ] `npm test`, package-quality tests/checker, `npm pack --dry-run`, and `git diff --check` pass.
- [ ] Host chat/CLI smoke tests run only where available. Any unavailable surface, invocation mismatch, or unverified automatic selection is reported without extrapolation.

## Affected surfaces

- npm CLI, package metadata and installer tests.
- The optional `overdrive` router skill, generated installed-skill catalog, and global terminal quick start; preserve all eleven domain workflows and their reference files.
- All eleven skill E2E results, plus router selection and partial-install filtering results.
- README host-selection/install, any-IDE global entry point, and invocation guidance.
- `docs/CODEBASE_MAP.md` and cross-agent E2E evidence.
- Package-quality workflow only if needed to run the focused installer/package checks.
- Preserve unrelated `.vscode/` files.

## Decisions

- User confirmed this brief on 2026-10-21. Hosts in scope: Claude Code, Codex IDE/CLI, Kiro IDE/CLI, Antigravity IDE/CLI, and Grok Build CLI.
- User confirmed on 2026-10-23: use the supported hosts' native user-level locations from any IDE terminal; keep all skills selected by default; make the router optional; limit the change to install/selection; and publish the initial public `overdrive-skills@0.1.0` package after validation.
- User requested branch commits and push on 2026-10-23. Future npm publication is gated on a matching versioned GitHub Release; regular pushes run checks only.
- Use grouped host-native plugin bundles where documented; use flat native skills where a surface requires them. Prefer native slash/invocation names, including namespaces, and report unsupported commands.
- Require explicit host choice. Add `--host`; never create unselected host roots.
- Antigravity project installs use its shared plugin root. Global installs let the user choose IDE, CLI, or both.
- Kiro project skills are flat; global Kiro uses a grouped Power.
- Preview and confirm selected-host registration/configuration before writing it.
- Adapt all eleven skills to current task/repository context with lightweight, optional handoffs. Continuity uses project-local shareable checkpoints and no personal preference writes.
- Skip existing destinations; updates/uninstall are out of scope. User authorized the initial npm release after preparation and package review.
