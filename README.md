<h1 align="center">Overdrive</h1>

<p align="center">
  <strong>Adaptive engineering skills for coding agents</strong><br>
  Eleven focused workflows, one task-aware router, and repository-first guidance.
</p>

<p align="center">
  <a href="#install-and-use-by-host">Install by host</a> ·
  <a href="#contents">Contents</a> ·
  <a href="#evidence">Evidence</a>
</p>

## Install and use by host

Run the command from any IDE's integrated terminal to install into native agent locations. For a user-level install, start with `npx overdrive-skills install --scope global`; select the supported agent(s) and skills when prompted. The picker selects all available skills by default, including the optional `overdrive` task router. Destinations and selected-host guidance are previewed before writing, and existing skills/rules are skipped. Use `--skill assert,review` to select specific skills. There is no separate initialization step.

`overdrive-skills` installs native packages for Claude Code, Codex IDE/CLI, Kiro, Antigravity, and Grok Build. VS Code and other IDEs can run the same command in their integrated terminals when one of those agents is available; this package does not install an IDE extension. Node.js 18+ and npm are required. Interactive color terminals show the cyan-to-violet `HIROQT` wordmark; `NO_COLOR`, `TERM=dumb`, and redirected output stay plain.

The examples below use `npx`, which runs the published `overdrive-skills` package without a separate global CLI install. To install the package's `overdrive` command globally and reuse it, run:

```bash
npm install --global overdrive-skills
overdrive install --scope global
```

Afterward, use `overdrive install` in place of `npx overdrive-skills install` in the examples below.

```bash
npx overdrive-skills install --scope global
```

To install only selected skills in a project, run this from the project root:

```bash
npx overdrive-skills install --host codex --skill assert,review
```

### Claude Code (IDE and CLI)

```bash
npx overdrive-skills install --host claude-code
```

Project bundle: `.claude/skills/overdrive/`; global bundle: `~/.claude/skills/overdrive/`.

In an already-open session, run `/reload-plugins`. Route a task with `/overdrive:overdrive <task>` or invoke a skill directly, for example `/overdrive:assert <task>`. Claude Code namespaces plugin skills with the plugin name. See [Claude Code plugin docs](https://code.claude.com/docs/en/plugins/create).

### Codex (IDE and CLI)

```bash
npx overdrive-skills install --host codex
```

Project install: CLI plugin in `.codex/plugins/overdrive/` and IDE skills in `.agents/skills/`. Global CLI plugin follows `$CODEX_HOME`; global IDE skills go to `~/.agents/skills/`.

The installer registers and activates the Codex CLI plugin when `codex` is available; otherwise, it prints the activation command to run after installing the CLI. Start a new Codex session after CLI activation. In Codex chat, use `$overdrive <task>` to route or `$assert <task>` to invoke a skill directly; `/skills` lists available skills. Restart Codex if new skills do not appear. See [Codex skills](https://developers.openai.com/codex/skills) and [plugins](https://developers.openai.com/codex/plugins).

### Kiro (IDE and CLI)

```bash
npx overdrive-skills install --host kiro
```

Project skills: `.kiro/skills/`; global Power: `~/.kiro/powers/overdrive/`.

Open the project in Kiro IDE, or start a Kiro CLI V3 session from the project with `kiro-cli --v3`. Project skills are slash commands: `/overdrive <task>` routes a task and `/<skill> <task>` invokes a specific skill, such as `/assert <task>`. For a global install, add `--scope global`; this installs an Overdrive Power. In Kiro CLI V3, use `/powers` to check installed Powers. Global Power slash aliases are not guaranteed. See [Kiro Agent Skills](https://kiro.dev/docs/skills/) and [CLI slash commands](https://kiro.dev/docs/reference/slash-commands/).

### Antigravity IDE and CLI

```bash
npx overdrive-skills install --host antigravity
```

Project plugin: `.agents/plugins/overdrive/`. Global IDE and CLI installs use `~/.gemini/config/plugins/overdrive/` and `~/.gemini/antigravity-cli/plugins/overdrive/`, respectively.

The project plugin is shared by Antigravity IDE and CLI. In the IDE, open the project and check **Customizations → Skills** in the agent panel; invoke `/overdrive <task>` or a direct skill such as `/assert <task>`. In the CLI, start `agy`, use `/skills` to inspect available skills, then route with `/overdrive <task>` or invoke a plugin skill with its native `/overdrive:<skill>` name, such as `/overdrive:assert <task>`.

For a global install, choose the target surface explicitly:

```bash
npx overdrive-skills install --scope global --host antigravity --surface ide
```

Use `--surface cli` or `--surface both` for the CLI or both surfaces. See [Antigravity Agent Skills](https://www.antigravity.google/docs/skills?tab=ide) and [CLI commands](https://www.antigravity.google/docs/cli/reference/).

### Grok Build CLI

```bash
npx overdrive-skills install --host grok
```

Project plugin: `.grok/plugins/overdrive/`; global plugin: `~/.grok/plugins/overdrive/`.

From the project root, run `grok inspect` to check discovered skills and plugins, then start `grok`. Use `/overdrive <task>` to route or `/<skill> <task>` to invoke a skill directly, such as `/assert <task>`. See [Grok Build](https://docs.x.ai/build/overview) and [skills, plugins, and marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces).

Overdrive adapts to the current task, repository instructions, stack, and available checks. The router only considers installed skills, selects one primary skill, and may suggest a useful handoff without automatically chaining skills. Host command syntax differs; use the examples above for each host.

### Publish npm updates

Pushes and pull requests run package checks, but do not publish to npm. To release an update, bump the `version` in `package.json`, merge the change, and publish a GitHub Release with a tag matching that version (for example, `v0.1.1`). The `npm-publish.yml` workflow reruns package checks and publishes only when the tag matches the package version.

Before the first automated release, configure npm Trusted Publishing for `overdrive-skills`: select GitHub Actions, repository `hiroqt/agents.md`, and workflow file `.github/workflows/npm-publish.yml`, with direct publishing allowed. This uses GitHub OIDC instead of an npm token. Each npm version can be published only once, so release a new version for every package update. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

### Continuity

Select `continuity` during installation to add a short always-loaded reminder in that host's native project or user guidance location. Invoke it using host syntax: `$continuity` in Codex, `/continuity` for flat Kiro project skills, or `/overdrive:continuity` in namespaced plugin hosts such as Claude Code and Antigravity. It resumes a task from `.overdrive/continuity/checkpoint.md`, retrieves project facts through a compact `.overdrive/continuity/index.md`, and checks both against the current branch and source before relying on them. The index is created on first substantial use if missing; there is no separate init command. Checkpoints are project-local and shareable, contain no transcript or personal preferences, and are never committed automatically. Kiro custom agents may need the steering file added to their configured resources. Grok's global plugin can install, but documented global always-loaded guidance is unavailable.

## Contents

The router is optional and can be selected like any other skill. If omitted, only the selected skills are installed and can be invoked directly. Each package follows the [Agent Skills format](https://agentskills.io/specification) and includes its `SKILL.md` plus supporting references, scripts, or assets.

| Skill | Use it to… |
| --- | --- |
| [Overdrive](skills/overdrive/SKILL.md) | Route a task to the best matching installed skill. |
| [Continuity](skills/continuity/SKILL.md) | Resume long-running work and retrieve verified project context quickly. |
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
