# npm installer specification

## Outcome

Install only the selected host's native Overdrive package shape so its skills and supporting references are discoverable and invocable in supported agent chats. Every install includes the `/overdrive` task router, which only routes to selected skills actually installed in that destination.

## Scope and behavior

- `npx @hiroqt/overdrive install` uses Node built-ins and prompts for scope, at least one host, skills, and any host-specific surface choice.
- Hosts are never selected implicitly. Project scope and all ten skills remain the defaults; host choice is required. `--host <id>` supports repeatable/comma-separated explicit selection. Antigravity global installs allow IDE, CLI, or both.
- Copy selected skill packages, including references, assets, scripts, and tests. Include host-specific metadata only for the selected host: `agents/openai.yaml` is Codex-only and must not appear in other hosts' bundles.
- Treat grouped plugin/Power folders as atomic destinations: if the bundle already exists, skip that host bundle without merging or changing it. Flat Kiro project and Codex IDE skills are individually skipped on collision.
- Show every bundle/skill destination and host registration/config path before writing. Registration merges preserve unrelated keys and refuse malformed marketplace JSON or malformed/conflicting Overdrive registration. Cancel means no file writes.
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

## Overdrive task router

- The installable `overdrive` skill is the collection's task-fit router. A bare host-native invocation routes a natural-language task to the single best matching installed skill; `/overdrive <skill> <task>` explicitly selects a skill and passes the remaining request through.
- The router reads its generated `references/installed-skills.md` list and never dispatches to a skill excluded from that install. The installer includes the router automatically even when the user selects a subset; the router is not offered as a selectable domain skill.
- Route using the user's requested outcome and relevant repository context. State the selected skill and a brief reason. If no installed skill fits, say so and handle the request normally where appropriate. Ask only if a consequential decision remains unresolved.
- Do not automatically chain skills. Name a useful handoff only when a distinct next task remains, and do not claim it ran.
- Keep each domain skill's instructions authoritative. The router identifies and loads the selected skill's own `SKILL.md`; it does not duplicate or replace that workflow.
- Preserve each host's native invocation form. Use a bare `/overdrive` only where that host exposes the skill under that name; otherwise document and test the host-native equivalent. Keep native per-skill invocations available.
- Test the automatic router, explicit override, installed-skill filtering, and every domain skill separately. Report discovery, invocation, and behavioral evidence as distinct results per host.

## Adaptive skill behavior

Each of the ten `SKILL.md` files must tell the agent to:

1. Inspect only the current task's relevant repository instructions, stack, conventions, state, tools, and tests before choosing a workflow.
2. Scale steps and checks to the task and risk, use only tools/checks actually available, and keep the skill's existing specialty and safety boundaries.
3. Ask only when a consequential decision cannot be resolved from the request or repository; otherwise use a reversible, stated assumption.
4. Mention a relevant handoff when it helps, without chaining skills automatically or claiming another skill ran.
5. Use only current conversation/repository context for adaptation; do not write or retain preferences for future sessions.

The guidance must be tailored to each skill, not pasted as a generic replacement for its workflow.

## Constraints and invariants

- Preserve Agent Skills package structure and all selected package resources.
- Use Node built-ins only; do not add runtime dependencies.
- Do not overwrite existing files or bundle roots. Do not silently merge an existing bundle.
- If a copy fails after creating a new folder, preserve non-empty partial content and report the exact cleanup needed; remove only a newly created empty folder.
- Merge only the selected host's registration. Preserve unknown existing JSON/TOML content; fail before writes on malformed marketplace JSON or malformed/conflicting Overdrive registration.
- A project install resolves from the invocation directory. A global install uses the selected host's documented user locations and relevant host home override when documented.
- Host format/path documentation proves compatibility shape, not live discovery or invocation. Report host availability and runtime checks separately.
- Prepare the package and verify it; do not publish, commit, or push.
- Keep the existing Python source-checkout installer available.

## Acceptance checks

- [ ] The CLI requires explicit host selection interactively or accepts explicit `--host`; it never defaults to every host.
- [ ] Project/global selections produce only selected-host paths; Antigravity global surface selection is IDE, CLI, or both.
- [ ] Each grouped host bundle has its correct host manifest, `skills/<name>/SKILL.md`, and all nested resources.
- [ ] Every install includes the `overdrive` router plus only the selected domain skills; its generated installed-skill list exactly matches the selected set.
- [ ] `/overdrive` routes by task and repo context; `/overdrive <skill>` forces that installed skill; partial installs never route to uninstalled skills; native direct skill commands remain available.
- [ ] Codex IDE gets flat skills; Codex CLI receives a grouped plugin, previewed collision-safe marketplace/config registration, and native plugin-cache activation; non-Codex bundles omit Codex-only `agents/openai.yaml` metadata.
- [ ] Global Codex CLI paths honor `CODEX_HOME`; local marketplace source paths stay within their root, and external CODEX_HOME uses a marketplace registered from that root.
- [ ] Kiro project scope is flat and global scope uses the Power bundle format.
- [ ] Claude Code uses `/overdrive:<skill>` plugin namespacing and no longer rewrites `review` as an alias.
- [ ] Preview lists bundle/skill and registration/config paths; declining creates or changes nothing.
- [ ] Existing bundle collisions skip as a unit; existing flat skills skip individually; unrelated config survives a registration merge.
- [ ] Tests cover the user-visible selection, layout, reference preservation, registration, collision, and cancellation behavior.
- [ ] `npm test`, package-quality tests/checker, `npm pack --dry-run`, and `git diff --check` pass.
- [ ] Host chat/CLI smoke tests run only where available. Any unavailable surface, invocation mismatch, or unverified automatic selection is reported without extrapolation.

## Affected surfaces

- npm CLI, package metadata and installer tests.
- The `overdrive` router skill and generated installed-skill catalog; preserve all ten domain workflows and their reference files.
- All ten skill E2E results, plus router selection and partial-install filtering results.
- README host-selection/install and invocation guidance.
- `docs/CODEBASE_MAP.md` and cross-agent E2E evidence.
- Package-quality workflow only if needed to run the focused installer/package checks.
- Preserve unrelated `.vscode/` files.

## Decisions

- User confirmed this brief on 2026-10-21. Hosts in scope: Claude Code, Codex IDE/CLI, Kiro IDE/CLI, Antigravity IDE/CLI, and Grok Build CLI.
- Use grouped host-native plugin bundles where documented; use flat native skills where a surface requires them. Prefer native slash/invocation names, including namespaces, and report unsupported commands.
- Require explicit host choice. Add `--host`; never create unselected host roots.
- Antigravity project installs use its shared plugin root. Global installs let the user choose IDE, CLI, or both.
- Kiro project skills are flat; global Kiro uses a grouped Power.
- Preview and confirm selected-host registration/configuration before writing it.
- Adapt all ten skills to current task/repository context with lightweight, optional handoffs. Do not persist preferences.
- Skip existing destinations; updates/uninstall and npm publishing are out of scope.
