<h1 align="center">Overdrive</h1>

<p align="center">
  <strong>Adaptive engineering skills for coding agents</strong><br>
  Ten focused workflows, one task-aware router, and repository-first guidance.
</p>

<p align="center">
  <a href="#install-and-use-by-host">Install by host</a> ·
  <a href="#contents">Contents</a> ·
  <a href="#evidence">Evidence</a>
</p>

## Install and use by host

The examples below install into the current project and explicitly select one host. The installer asks which skills to include; press Enter to select all ten. The `overdrive` task router is always included, destinations are previewed before writing, and existing skills are skipped. Add `--scope global` to install for your user, or `--skill assert,review` to select specific domain skills. There is no separate initialization step.

The published package is currently `@hiroqt/overdrive`. This repository has been renamed to `overdrive-skills`, which is not published yet; use `npx overdrive-skills install` after that package is released. Node.js 18+ and npm are required. Interactive color terminals show the cyan-to-violet `HIROQT` wordmark; `NO_COLOR`, `TERM=dumb`, and redirected output stay plain.

### Claude Code (IDE and CLI)

```bash
npx @hiroqt/overdrive install --host claude-code
```

Project bundle: `.claude/skills/overdrive/`; global bundle: `~/.claude/skills/overdrive/`.

In an already-open session, run `/reload-plugins`. Route a task with `/overdrive:overdrive <task>` or invoke a skill directly, for example `/overdrive:assert <task>`. Claude Code namespaces plugin skills with the plugin name. See [Claude Code plugin docs](https://code.claude.com/docs/en/plugins/create).

### Codex (IDE and CLI)

```bash
npx @hiroqt/overdrive install --host codex
```

Project install: CLI plugin in `.codex/plugins/overdrive/` and IDE skills in `.agents/skills/`. Global CLI plugin follows `$CODEX_HOME`; global IDE skills go to `~/.agents/skills/`.

The installer registers and activates the Codex CLI plugin when `codex` is available; otherwise, it prints the activation command to run after installing the CLI. Start a new Codex session after CLI activation. In Codex chat, use `$overdrive <task>` to route or `$assert <task>` to invoke a skill directly; `/skills` lists available skills. Restart Codex if new skills do not appear. See [Codex skills](https://developers.openai.com/codex/skills) and [plugins](https://developers.openai.com/codex/plugins).

### Kiro (IDE and CLI)

```bash
npx @hiroqt/overdrive install --host kiro
```

Project skills: `.kiro/skills/`; global Power: `~/.kiro/powers/overdrive/`.

Open the project in Kiro IDE, or start a Kiro CLI V3 session from the project with `kiro-cli --v3`. Project skills are slash commands: `/overdrive <task>` routes a task and `/<skill> <task>` invokes a specific skill, such as `/assert <task>`. For a global install, add `--scope global`; this installs an Overdrive Power. In Kiro CLI V3, use `/powers` to check installed Powers. Global Power slash aliases are not guaranteed. See [Kiro Agent Skills](https://kiro.dev/docs/skills/) and [CLI slash commands](https://kiro.dev/docs/reference/slash-commands/).

### Antigravity IDE and CLI

```bash
npx @hiroqt/overdrive install --host antigravity
```

Project plugin: `.agents/plugins/overdrive/`. Global IDE and CLI installs use `~/.gemini/config/plugins/overdrive/` and `~/.gemini/antigravity-cli/plugins/overdrive/`, respectively.

The project plugin is shared by Antigravity IDE and CLI. In the IDE, open the project and check **Customizations → Skills** in the agent panel; invoke `/overdrive <task>` or a direct skill such as `/assert <task>`. In the CLI, start `agy`, use `/skills` to inspect available skills, then route with `/overdrive <task>` or invoke a plugin skill with its native `/overdrive:<skill>` name, such as `/overdrive:assert <task>`.

For a global install, choose the target surface explicitly:

```bash
npx @hiroqt/overdrive install --scope global --host antigravity --surface ide
```

Use `--surface cli` or `--surface both` for the CLI or both surfaces. See [Antigravity Agent Skills](https://www.antigravity.google/docs/skills?tab=ide) and [CLI commands](https://www.antigravity.google/docs/cli/reference/).

### Grok Build CLI

```bash
npx @hiroqt/overdrive install --host grok
```

Project plugin: `.grok/plugins/overdrive/`; global plugin: `~/.grok/plugins/overdrive/`.

From the project root, run `grok inspect` to check discovered skills and plugins, then start `grok`. Use `/overdrive <task>` to route or `/<skill> <task>` to invoke a skill directly, such as `/assert <task>`. See [Grok Build](https://docs.x.ai/build/overview) and [skills, plugins, and marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces).

Overdrive adapts to the current task, repository instructions, stack, and available checks. The router only considers installed skills, selects one primary skill, and may suggest a useful handoff without automatically chaining skills. Host command syntax differs; use the examples above for each host.

## Contents

The router is installed automatically. Choose any domain skills; each package follows the [Agent Skills format](https://agentskills.io/specification) and includes its `SKILL.md` plus supporting references, scripts, or assets.

| Skill | Use it to… |
| --- | --- |
| [Overdrive](skills/overdrive/SKILL.md) | Route a task to the best matching installed skill. |
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
