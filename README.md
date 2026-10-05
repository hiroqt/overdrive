# Arnel’s Agent Engineering Toolkit

Global Codex instructions and a focused skill-authoring toolkit for adaptive engineering workflows, security, AI evaluation, and durable project context.

## Contents

| File | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Global engineering defaults, permissions, delegation, harnesses, and private project memory |
| [SKILLS.md](SKILLS.md) | Skill-writing standard, the 30-point release checklist, and evaluation guidance |
| [Engineering Skill Author](skills/engineering-skill-author/SKILL.md) | Installable skill for creating, revising, or reviewing engineering skills |
| [Skill template](skills/engineering-skill-author/assets/SKILL.template.md) | Adaptable starting point for a new skill |
| [Evaluation protocol](skills/engineering-skill-author/references/evaluation.md) | Separate discovery and execution testing with evidence records |

## Global instructions

1. Copy [AGENTS.md](AGENTS.md) into `~/.codex/AGENTS.md`, or `$CODEX_HOME/AGENTS.md` when configured.
2. Check whether an `AGENTS.override.md` is active; it takes precedence.
3. Start a fresh Codex session and verify the loaded instructions.

Keep project commands and specialized constraints in each repository’s own instruction files. The global defaults are local reviews, private project memory, and approval for destructive or shared-environment changes.

## Skill authoring guide

Read [SKILLS.md](SKILLS.md) when creating or reviewing a capability. It distinguishes global policy, reusable skill procedures, supporting resources, and private context. The release checklist adapts the supplied 30-point quality guide.

`SKILLS.md` is a handbook. It is not an installable skill and should not be pasted into every skill’s entrypoint. Each installable capability lives in its own folder with an exact `SKILL.md` filename.

## Install the authoring skill

This repository is private. Authenticate with GitHub and clone it into a chosen directory:

```bash
gh repo clone hiroqt/agents.md
cd agents.md
npx skills@latest add . --global --agent codex --skill engineering-skill-author
```

Review any existing skill with the same name before approving an overwrite. Alternatively, copy the complete `skills/engineering-skill-author` folder into a supported skill directory without overwriting existing work. Codex documents user skills under `~/.agents/skills` and repository skills under `.agents/skills`; see [local skill discovery](https://learn.chatgpt.com/docs/build-skills).

Invoke it with a focused request:

```text
Use $engineering-skill-author to create a review-only API-contract skill
using this repository’s existing contracts and validation commands.
```

```text
Use $engineering-skill-author to review this skill package without modifying it.
```

The package includes its template, evaluation reference, and optional Codex UI metadata. It requires no custom executable helpers. Follow the target host’s discovery and invocation rules; portable metadata does not guarantee identical behavior across products.

## Validation and limits

See the [executed validation record](docs/skill-author-validation.md) for checks performed and remaining limits.

Packaging validation checks syntax and resources. Behavioral evaluation checks actual decisions and outputs; explicit invocation does not prove automatic discovery. Run realistic cases using the [evaluation protocol](skills/engineering-skill-author/references/evaluation.md), and distinguish executed tests from planned scenarios.

These files define behavior. They do not grant access, configure MCP connections, install themselves, create scheduled workers, or enable GitHub automatic reviews. Keep sensitive history and credentials outside distributed skill packages.
