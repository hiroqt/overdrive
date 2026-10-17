# Cross-agent skill installability E2E

## Outcome

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

## What this proves

The Skills CLI can locate all five repository packages and copy their complete file trees, including references and scripts, to these six target paths. This validates package installability and path mapping for the installer version resolved during this run.

## Limits

This did not launch Claude Code, Codex, Gemini CLI, Antigravity, Cursor, or Kiro. It does not prove automatic discovery, correct skill selection, slash-command behavior, script execution, or that each host follows the instructions. `kiro-cli` verifies the `.kiro/skills/` destination used by Kiro; it does not test the Kiro IDE import UI. Antigravity and Gemini CLI were tested as separate installer targets. Repeat with a pinned Skills CLI version and host-specific discovery probes for stronger compatibility evidence.
