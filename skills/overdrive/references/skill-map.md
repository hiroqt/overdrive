# Overdrive skill routing map

Use this map to pick one primary skill based on the requested outcome. Apply the selected skill's own instructions after routing.

| Skill | Route here when the main outcome is |
| --- | --- |
| `forge` | Create, revise, or review an installable agent skill and its package. |
| `refactor` | Map repository structure or make an approved maintainability improvement. |
| `signal` | Shape a response or progress update for directness while preserving technical detail. |
| `render` | Design, critique, or implement a product-fit frontend experience. |
| `assert` | Specify or implement a behavior change test-first. |
| `prune` | Reduce unnecessary repository search, tool output, or context overhead without skipping needed evidence. |
| `verify` | Run focused feature tests and prove an app flow with appropriate end-to-end evidence. |
| `review` | Review a named diff or change read-only and report concrete, reproducible findings. |
| `guard` | Audit AI-assisted code or a repository for security regressions and risky behavior. |
| `trace` | Map a codebase or diagnose an agent/LLM failure across its execution path. |

## Tie-breaking

- An explicitly named installed skill always wins.
- For security-risk review, use Guard; for a source-grounded diff review, use Review.
- For a requested behavior change, use Assert; for structure-only maintainability work, use Refactor.
- For frontend work, use Render when design or user experience is central; use Assert when the request is primarily a non-visual behavior change.
- For an unknown agent/LLM failure, use Trace; use Review when the changed code path and concrete trigger are already known.
- Use Prune as the primary skill only when the requested outcome is efficient repository/tool exploration. Do not add it automatically to every route.
- Use Signal as the primary skill only when communication itself is the requested outcome. It can still shape concise updates without becoming the task's primary skill.
- If two skills still appear equally relevant, choose the one that owns the user's immediate requested outcome and mention one optional handoff.
