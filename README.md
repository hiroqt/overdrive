# Arnel’s Global Engineering Instructions

Global Codex guidance for repository-aware planning, implementation, security, AI evaluation, review, and durable project context.

## Use

1. Open [AGENTS.md](AGENTS.md) and copy its contents into `~/.codex/AGENTS.md` (or `$CODEX_HOME/AGENTS.md` when configured).
2. Check whether an `AGENTS.override.md` is active; it takes precedence.
3. Start a fresh Codex session and verify the loaded instructions.

Keep project-specific commands and constraints in each repository’s own instruction files. The global policy defaults to local reviews, private project memory, and approval for destructive or shared-environment changes.

The document defines agent behavior. Skills, MCP connections, scheduled workers, and GitHub automatic reviews require separate configuration.
