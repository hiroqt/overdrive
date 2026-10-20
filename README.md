<h1 align="center">Overdrive</h1>

<p align="center">
  <strong>Adaptive engineering skills for coding agents</strong><br>
  Ten focused workflows, one task-aware router, and repository-first guidance.
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#skills">Skills</a> ·
  <a href="#host-support">Host support</a> ·
  <a href="#evidence">Evidence</a>
</p>

## Quick start

Run the installer from the project where you want the skills:

```bash
npx @hiroqt/overdrive install
```

> **npm package status:** `@hiroqt/overdrive` is the current published package. This repository now uses the name `overdrive-skills`, which is not published yet. After its release, the command will be `npx overdrive-skills install`.

Requires Node.js 18+ and npm. There is no separate Overdrive initialization step: select your host and skills, confirm the preview, then invoke them using that host’s native command. Reload the host if it does not pick up newly installed skills.

The interactive installer defaults to project scope, suggests hosts from project markers, and asks you to confirm every selection and destination before writing. Press Enter at the skill picker to choose all ten domain skills; the `overdrive` router is always included. Existing destinations are skipped. The installer does not update or uninstall skills.

Interactive color terminals show the cyan-to-violet `HIROQT` wordmark; `NO_COLOR`, `TERM=dumb`, and redirected output stay plain.

For scripted installs, choose hosts explicitly:

```bash
npx @hiroqt/overdrive install --host antigravity --skill assert
npx @hiroqt/overdrive install --scope global --host antigravity --surface cli
```

Host IDs: `claude-code`, `codex`, `kiro`, `antigravity`, `grok`. Use `--scope project|global`, repeatable or comma-separated `--host` and `--skill` values, and `--surface ide|cli|both` for global Antigravity.

## Use Overdrive

Give the router a task to choose one primary skill, or name a skill to select it directly:

```text
/overdrive Add request validation to this API endpoint
/overdrive assert Add request validation to this API endpoint
```

These examples use slash-command syntax; Claude Code prefixes the router with its plugin namespace, while Codex uses `$overdrive`. The router adapts to the current request, repository instructions, stack, and available checks. It only considers skills installed in that bundle, may suggest one useful handoff, and does not chain skills automatically. See [Host support](#host-support) for exact commands.

## Skills

The router is installed automatically. Choose any domain skills; each package follows the [Agent Skills format](https://agentskills.io/specification) and includes its `SKILL.md` plus supporting references, scripts, or assets.

| Skill | Use it to… |
| --- | --- |
| [Forge](skills/forge/SKILL.md) | Create, improve, or review reusable agent skills. |
| [Refactor](skills/refactor/SKILL.md) | Map real project structure and make safe maintainability changes. |
| [Signal](skills/signal/SKILL.md) | Write concise updates without losing evidence or technical detail. |
| [Render](skills/render/SKILL.md) | Design and verify product-fit frontend experiences. |
| [Assert](skills/assert/SKILL.md) | Specify behavior, then implement it test-first. |
| [Prune](skills/prune/SKILL.md) | Explore efficiently without cutting useful investigation. |
| [Verify](skills/verify/SKILL.md) | Run focused tests, then verify the full user flow. |
| [Review](skills/review/SKILL.md) | Trace changes and report concrete, source-verified findings. |
| [Guard](skills/guard/SKILL.md) | Audit AI-assisted code for security risks and unsafe changes. |
| [Trace](skills/trace/SKILL.md) | Map a codebase or diagnose an agent/LLM failure across its system. |

## Host support

Project installs are local to a repository; global installs use the host's user-level location. Codex CLI and Codex IDE use different package layouts. Kiro's global Power is activated contextually and does not promise slash aliases.

<details>
<summary>Show install paths and native commands</summary>

| Host / surface | Project install | Global install | Router / direct skill |
| --- | --- | --- | --- |
| Claude Code IDE/CLI | `.claude/skills/overdrive/` | `~/.claude/skills/overdrive/` | `/overdrive:overdrive` / `/overdrive:<skill>` |
| Codex CLI | `.codex/plugins/overdrive/` plus local marketplace registration | `$CODEX_HOME/plugins/overdrive/` (default `~/.codex`) | `$overdrive` / `$<skill>`; `/skills` lists skills |
| Codex IDE | `.agents/skills/<skill>/` | `~/.agents/skills/<skill>/` | `$overdrive` / `$<skill>`; `/skills` lists skills |
| Kiro IDE/CLI | `.kiro/skills/<skill>/` | `~/.kiro/powers/overdrive/` | Project: `/overdrive` / `/<skill>`; global Power: contextual activation |
| Antigravity IDE | `.agents/plugins/overdrive/` | `~/.gemini/config/plugins/overdrive/` | `/overdrive` / `/<skill>` |
| Antigravity CLI | `.agents/plugins/overdrive/` | `~/.gemini/antigravity-cli/plugins/overdrive/` | `/overdrive` / `/<skill>` |
| Grok Build CLI | `.grok/plugins/overdrive/` | `~/.grok/plugins/overdrive/` | `/overdrive` / `/<skill>` |

For Codex CLI, the installer previews and registers the selected local marketplace before activating the plugin. A marker match is only a suggestion; it does not detect which IDE window is active. Non-Codex bundles omit Codex-only metadata. See the [npm installer specification](docs/npm-installable-skills-spec.md) for registration and host details.

</details>

## Evidence

Overdrive separates package checks, host installation, command invocation, and automatic routing. Passing one does not prove the others. The records below include setup, results, and limits:

- [Cross-agent installation and chat checks](docs/cross-agent-skill-installability-results.md)
- [Automatic router selection probe](docs/automatic-routing-validation.md)
- [Paired skill behavior benchmark](docs/skills-e2e-benchmark-results.md)
- [Render](docs/render-validation.md), [Refactor](docs/refactor-validation.md), and [Verify](docs/verify-validation.md) evaluations

## Project links

| Guide | What it covers |
| --- | --- |
| [Skill workflows](docs/SKILL_WORKFLOWS.md) | Task sequences and useful handoffs. |
| [Skill handbook](SKILLS.md) | Authoring, package quality, and release guidance; not an installable skill. |
| [Installer specification](docs/npm-installable-skills-spec.md) | Host layouts, prompts, safety, and acceptance criteria. |
| [AGENTS.md](AGENTS.md) | Optional repository and engineering guidance; not copied by the npm installer. |

<details>
<summary>Checks for contributors</summary>

Run from the repository root with Node.js 18+ and Python 3:

```bash
npm test
npm pack --dry-run
python3 -m unittest discover -s scripts/tests -v
python3 scripts/check_skill_packages.py
```

These validate installer behavior, package contents, skill metadata, and local links. They do not establish automatic selection or consistent behavior across every agent and version. [GitHub Actions](.github/workflows/package-quality.yml) runs the package checks on pushes and pull requests.

</details>

---

Overdrive adapts to the active conversation and repository instructions; it does not save learned preferences. Skills provide guidance and do not grant permissions, install themselves, or guarantee that a host selects or follows them.

[MIT License](LICENSE)
