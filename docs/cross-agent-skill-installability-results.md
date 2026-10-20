# Cross-agent skill installability E2E

## Current npm package E2E — 2026-10-21

Packed the local `@hiroqt/overdrive@0.1.0` checkout to a temporary tarball, then ran the package's `overdrive install` executable through npm in isolated project directories. No registry publish or global install was used. The selected-host Antigravity install validated the grouped plugin, and a separate isolated all-ten-skill bundle was used for direct chat checks. Codex was tested separately.

| Host surface | Live evidence | Limit |
| --- | --- | --- |
| Antigravity CLI | `agy plugin validate --strict` passed for the grouped plugin. Each of the ten Overdrive skills was invoked in an isolated project chat. Outputs covered spec-first procedure (`assert`), skill-package inspection (`forge`), a high-severity authorization bypass (`guard` and `review`), targeted auth-only retrieval (`prune`), a test-boundary suggestion (`refactor`), a 3.54:1 contrast issue and color remedy (`render`), a concise rewrite (`signal`), an auth execution trace (`trace`), and `npm test` with 2 passing tests (`verify`). The native namespace `/overdrive:<skill>` was confirmed by the CLI picker; `prune`, `refactor`, `render`, and `trace` were exercised with that form. A natural `/overdrive` security prompt selected `guard` and returned evidence-backed findings. | The remaining six direct invocations used the earlier bare skill spelling or task prompt before the native namespace was inspected. This is live invocation evidence, not proof that every prompt routes correctly. The project-only `rg`, `git diff`, and `npm test` allow rules used for blocked read-only probes were removed and the project allowlist returned to zero. |
| Antigravity IDE | In the isolated project, `/assert` returned the specification-first/test-first procedure. After installing the all-ten bundle and reloading the IDE, `/overdrive list` displayed all ten skill names, descriptions, and installed `SKILL.md` paths. | Other nine skills were not individually invoked in the IDE. A later `/assert` probe failed while invoking `npm test` because Node reported `ERR_INVALID_PACKAGE_CONFIG` in the system npm installation; the IDE then waited for approval to run `node --test`, which was not approved. The earlier successful `/assert` response remains the live invocation evidence. |
| Codex CLI | The npm package shim installed the grouped plugin and Codex IDE skill, registered the local marketplace, then ran `codex plugin add`. In an isolated custom `CODEX_HOME`, `codex plugin list` reported `overdrive@local-repo` as installed and enabled. | An earlier `$assert` chat probe ran before `codex plugin add` and was inconclusive because the global skill scan exceeded the context budget. A later read-only chat probe in the isolated Codex home reached the API without credentials and returned HTTP 401, so no post-activation model response was verified. |
| Codex IDE extension | Not tested. | The available VS Code profile has no Codex extension. |
| Kiro IDE/CLI | Not re-run against the current package layout. | Earlier IDE invocation exercised flat project skills; it does not validate the new Kiro global Power bundle. Kiro CLI is absent. |
| Claude Code IDE/CLI | Not tested. | Claude Code CLI is absent; the installed Claude Desktop app is not Claude Code, and its IDE integration was not inspected. |
| Grok Build CLI | Not tested. | Grok Build CLI is absent. |

The earlier live E2E tarball contained 52 files (87.6 kB compressed). The final local `npm pack --dry-run --json` check contains 56 files (90,828 bytes compressed; 274,188 unpacked); the live host checks were not repeated from that final pack. The selected-host Antigravity install reported one installed and zero skipped. Custom Codex installation reported two copied destinations, two registrations, and plugin-cache activation; `codex plugin list` showed the plugin as installed and enabled. Package installs displayed their previews and were confirmed in isolated temporary projects. All ten skills returned task-appropriate output in Antigravity CLI, including four checks using the native `/overdrive:<skill>` namespace; the `/overdrive` router selected `guard` for a security task. Antigravity IDE listed all ten skills and returned the expected `/assert` procedure. The package was prepared locally and remains unpublished. See [README](../README.md#install-skills-across-coding-agents) for the host layouts and linked official format documentation.

The prior all-host npm smoke test immediately below used the earlier flat-skill installer layout. Its file-copy and live invocation outcomes are historical and do not validate the current grouped bundles or registration behavior. These checks establish package packing, selected-host placement, Antigravity CLI plugin validation, all-ten direct skill invocation in Antigravity CLI, `/overdrive` routing to `guard`, all-ten Antigravity IDE slash-menu discovery, `/assert` invocation in the Antigravity IDE, and Codex CLI plugin-cache activation. They do not establish a post-activation Codex chat response, individual invocation behavior for the other nine Antigravity IDE skills, behavior across unavailable hosts, or automatic routing beyond the one observed security prompt.

## Final local validation — 2026-10-21

- `npm test`: 21/21 installer tests passed.
- `python3 -m unittest discover -s scripts/tests -v`: 13/13 package-checker tests passed.
- `python3 scripts/check_skill_packages.py`: passed, 11 packages and 265 Markdown link targets.
- `npm pack --dry-run --json`: passed, 56 entries for `@hiroqt/overdrive@0.1.0` (90,828 bytes compressed; 274,188 unpacked).
- `git diff --check`: passed.

The first pack dry-run using the default npm cache failed because that cache contains root-owned files; rerunning with a temporary task-local npm cache passed. No global cache ownership or permissions were changed.

## Historical all-host npm smoke checks — earlier installer layout

The local package was launched through npm's `overdrive install` shim in an isolated temporary project. That earlier version installed all five hosts and all ten skills into flat skill folders, renaming Claude Code's `review` to `overdrive-review`. Antigravity CLI and IDE, Kiro IDE, and Codex CLI each received one explicit `/assert` or `$assert` prompt. That test predates the selected-host plugin/Power layouts now described in the specification; use the current package E2E above for the present implementation. The old IDE/CLI evidence and its limits remain below as a historical record.

| Host surface | Historical live evidence | Limit |
| --- | --- | --- |
| Antigravity CLI | `agy --print '/assert …'` returned the test-first behavior-change sequence from the earlier flat install. | Not evidence for current plugin loading. |
| Antigravity IDE | Selected `/assert` from chat suggestions; the response cited the earlier flat installed `.agents/skills/assert/SKILL.md`. | Not evidence for current plugin loading. |
| Codex CLI | An explicit `$assert` request returned the requested procedure. | A budget-limited scan of `~/.agents/skills` made the source of the response uncertain. |
| Codex IDE in VS Code | Inspected the Installed extensions list. | No Codex extension was installed in that profile. |
| Kiro IDE | The picker listed all ten skills; `/assert` loaded after trust/approval and returned the expected procedure. | Not evidence for the new global Power bundle; Kiro CLI absent. |
| Claude Code | No live check. | Claude Code CLI absent; Claude Desktop was not treated as Claude Code. |
| Grok Build | No live check. | Grok Build CLI absent. |

Only `/assert` was invoked in those earlier chats; Claude's alias was verified by installer tests, not in a Claude chat. The old run does not establish broad activation, automatic routing, or identical behavior across host versions.

## Current package-ID installability refresh — 2026-10-19

The current eight package IDs (`assert`, `forge`, `guard`, `prune`, `refactor`, `render`, `signal`, `verify`) were copied into six isolated project workspaces using `npx --yes skills@latest`. Each copied package tree matched the source byte-for-byte.

| Installer target | Result | Destination |
| --- | ---: | --- |
| `claude-code` | 8/8 | `.claude/skills/` |
| `codex` | 8/8 | `.agents/skills/` |
| `gemini-cli` | 8/8 | `.agents/skills/` |
| `antigravity` | 8/8 | `.agents/skills/` |
| `cursor` | 8/8 | `.agents/skills/` |
| `kiro-cli` | 8/8 | `.kiro/skills/` |

**Total:** 48 package copies and 468 package-file comparisons passed with zero differences. The results are under `/private/tmp/overdrive-current-installability-escalated/`; the `skills@latest` tag was not pinned. This validates installer placement and copied-file integrity only. It does not launch the six hosts or verify discovery, activation, or task behavior. Current Codex CLI automatic-routing observations are recorded separately in [automatic-routing validation](automatic-routing-validation.md).

The historical installation runs below predate the package rename and exercised five packages under their previous IDs. The current-ID installation refresh is recorded above.

## Historical installability outcome (pre-rename)

Passed: all five installable skill packages were installed by the Vercel Skills CLI into six isolated project workspaces and every source package file was present and byte-identical in its target folder.

## Run details

- **Date:** 2026-10-17 (UTC)
- **Repository revision:** `41c4d10d1336a6aa6c4f1f2dbc80d7689cee76d9`
- **Installer:** `npx --yes skills@latest`; the tag was not pinned, so its resolved CLI version is not captured.
- **Method:** project-scope copies (`--copy`), one fresh workspace and temporary `HOME` per installer target; no global installation and no agent credentials.
- **Packages:** all five folders containing `SKILL.md` under `skills/`.
- **Artifacts:** `/private/tmp/hiroqt-skill-install-e2e/summary.json`, per-agent stdout/stderr, and the installed workspaces.
- **Duration:** approximately 9 seconds for installation and verification after the CLI was available.

| Installer target | Destination | Packages | Source files checked | Result |
| --- | --- | ---: | ---: | --- |
| `claude-code` | `.claude/skills/` | 5/5 | 29 | Pass |
| `codex` | `.agents/skills/` | 5/5 | 29 | Pass |
| `gemini-cli` | `.agents/skills/` | 5/5 | 29 | Pass |
| `antigravity` | `.agents/skills/` | 5/5 | 29 | Pass |
| `cursor` | `.agents/skills/` | 5/5 | 29 | Pass |
| `kiro-cli` | `.kiro/skills/` | 5/5 | 29 | Pass |

Total: **30 package installations and 174 source-file copies checked** (29 unique source files across all five packages, copied to six targets), with zero installer errors, missing files, or byte mismatches.

## Hiroqt interactive installer E2E

Ran [`scripts/install_skills.py`](../scripts/install_skills.py) with the real Skills CLI twice, supplying the menu selection and final confirmation through stdin. Each run used a fresh project directory and an isolated temporary `HOME`/npm cache:

| Scope choice | Prompt and confirmation | Agent-skill mappings | Unique file copies | Result |
| --- | --- | ---: | ---: | --- |
| Project (`1`) | Both displayed and accepted | 30 | 87 | Pass |
| Global (`2`) | Both displayed and accepted | 30 | 87 | Pass |

The CLI wrote to its selected shared roots (`.claude/skills`, `.agents/skills`, and `.kiro/skills` under the isolated destination). The four targets using the common `.agents/skills` root share one physical copy. All five complete skill folders matched byte-for-byte; zero files were missing or different. The captured output also showed the scope menu, agent list, success message, and successful CLI completion. Logs and machine-readable checks: `/private/tmp/hiroqt-installer-flow-e2e-approved/summary.json`.

This validates both scope choices, the confirmation gate, actual package installation, and file integrity. It does not launch the six coding agents or prove each host activates and follows the skills. A separate pseudo-terminal run invoked the actual CLI with a local `npx` stub and confirmed the full cyan-to-violet ANSI wordmark appeared before the scope prompt and installation call. Its captured terminal output and argument checks are at `/private/tmp/hiroqt-terminal-banner-proof-3/summary.json`. The pseudo-terminal verifies emitted terminal sequences; it does not capture how a specific physical terminal renders them.

## What the historical run proves

The Skills CLI can locate all five repository packages and copy their complete file trees, including references and scripts, to these six target paths. This validates package installability and path mapping for the installer version resolved during this run.

## Limits

This did not launch Claude Code, Codex, Gemini CLI, Antigravity, Cursor, or Kiro. It does not prove automatic discovery, correct skill selection, slash-command behavior, script execution, or that each host follows the instructions. `kiro-cli` verifies the `.kiro/skills/` destination used by Kiro; it does not test the Kiro IDE import UI. Antigravity and Gemini CLI were tested as separate installer targets. Repeat with a pinned Skills CLI version and host-specific discovery probes for stronger compatibility evidence.
