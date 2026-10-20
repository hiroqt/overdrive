# Overdrive skill workflows

Overdrive skills are small, independent procedures. The [`overdrive` router](../skills/overdrive/SKILL.md) filters to installed skills and picks one primary skill for a task; direct per-skill commands remain available. Combine skills only for deliberate multi-step work. These workflow bundles are invocation guides, not installer profiles or automatic orchestration. A skill can recommend a next step, but it cannot invoke another skill unless the host explicitly supports that behavior.

## Workflow bundles

| Workflow | Invoke in order | Use when | Stop or branch |
| --- | --- | --- | --- |
| **Feature delivery** | [Prune](../skills/prune/SKILL.md) → [Assert](../skills/assert/SKILL.md) → implement → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | A feature changes user-visible or system behavior | Add [Render](../skills/render/SKILL.md) for frontend work; add [Guard](../skills/guard/SKILL.md) before security-sensitive generation or repair. Review is read-only and comes last. |
| **Bug repair** | [Prune](../skills/prune/SKILL.md) → [Assert](../skills/assert/SKILL.md) → implement → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | A defect needs a code change | Add [Guard](../skills/guard/SKILL.md) before implementation when the proposed fix touches a security control or security-sensitive path. If the failure's cause is unknown in an agent/LLM system, use [Trace](../skills/trace/SKILL.md) before choosing a fix. |
| **Frontend delivery** | [Prune](../skills/prune/SKILL.md) → [Assert](../skills/assert/SKILL.md) → [Render](../skills/render/SKILL.md) → implement → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | A new or changed UI flow needs design and implementation | Render owns product-fit UI guidance; Assert defines observable behavior; Verify checks the actual journey where the environment permits. |
| **Security audit and repair** | [Guard](../skills/guard/SKILL.md) → (approval) → [Assert](../skills/assert/SKILL.md) → implement → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | Reviewing security or applying an approved security fix | Guard is read-only until the user approves a concrete change plan. Add [Trace](../skills/trace/SKILL.md) when the issue spans unknown agent/LLM layers. Never treat this sequence as permission to edit. |
| **Codebase orientation or agent diagnosis** | [Prune](../skills/prune/SKILL.md) → [Trace](../skills/trace/SKILL.md) → ([Guard](../skills/guard/SKILL.md) or [Refactor](../skills/refactor/SKILL.md), if needed) → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | A new developer needs a map, or an agent/LLM failure has no known layer | Trace is read-only. Guard handles security; Refactor handles a maintainability change within its confirmation gates. Verify and Review apply only when changes are made. |
| **Maintainability improvement** | [Prune](../skills/prune/SKILL.md) → [Refactor](../skills/refactor/SKILL.md) → ([Assert](../skills/assert/SKILL.md) if behavior changes) → [Verify](../skills/verify/SKILL.md) → [Review](../skills/review/SKILL.md) | Structure is hard to understand or maintain | Refactor protects APIs and sensitive files; follow its confirmation gates. Use Trace first only when the problem is an unknown agent/LLM execution path. |
| **Skill authoring** | [Forge](../skills/forge/SKILL.md) → package-quality check → [Verify](../skills/verify/SKILL.md) (when executable behavior needs evaluation) | Creating or revising an Overdrive skill | Forge owns the package. The package check proves packaging only; Verify or a domain-specific evaluation is needed for behavioral claims. |

**[Signal](../skills/signal/SKILL.md)** can shape progress updates and final answers alongside any workflow. It does not replace source inspection, checks, or evidence. **Prune** is included at the start when repository discovery or tool-output efficiency matters; skip it when the task needs no repository exploration. **Overdrive** chooses one task-fit entrypoint; use a workflow bundle only when the requested work needs an intentional sequence.

## Handoff contract

When a skill reaches work owned by another capability, it should:

1. State the specific next task and name the relevant skill.
2. Preserve the current findings, acceptance criteria, constraints, and evidence needed for that task.
3. Explain any gate that must be satisfied first, especially approval before edits or shared-state changes.
4. Continue only if the current host exposes the next skill and the user's request authorizes that work. Otherwise give the user a ready-to-use prompt or proceed within the current skill's boundary.

Do not claim that a handoff ran, that an uninstalled skill is available, or that skills activate one another automatically. Keep each skill's local safety rules authoritative for its own work; this guide only describes task sequencing.

## Host and installation limits

The npm installer always includes the router and installs all ten domain skills or the selected subset. The router reads the generated installed-skill list so it cannot route to an omitted skill. Workflow bundles describe explicit sequences; they do not change package installation, agent discovery, tool permissions, or host behavior. Verify activation in the target coding agent before relying on a skill.
