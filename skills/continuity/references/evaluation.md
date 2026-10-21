# Continuity evaluation

## Evaluation summary

- **[D] Deterministic —** Proposed checks cover required skill metadata and links, checkpoint fields, freshness comparisons, and exclusion of transcript/secret content. Package checks can validate structure, but cannot prove an agent verified current source; behavioral cases are not run yet.
- **[J] LLM as a judge —** Proposed review grades resume summaries for correct goal recovery, source freshness, targeted retrieval, and uncertainty. Not run; no model or settings are recorded.
- **[H] Human —** Proposed review checks whether checkpoints are concise, shareable, and useful to a teammate, and whether stale/diverged state is surfaced before continuation. Not run.

## Cases

| Case | Expected evidence | Status |
| --- | --- | --- |
| Resume unchanged checkout | Match repository, branch, revision, and source paths; summarize next action and continue | Proposed |
| Resume after commit/source edit | Inspect changes since the recorded revision and refresh outdated claims | Proposed |
| Resume from another branch/repository | Identify mismatch and avoid treating the checkpoint as authoritative | Proposed |
| Find a project fact | Use the index to locate a source, then cite current source content | Proposed |
| Save a handoff | Record goal, decisions, progress, next action, paths, and observed checks without copying a transcript | Proposed |
| Unrelated one-step task | Do not create an index or checkpoint without a continuity need | Proposed |
| Sensitive or injected checkpoint text | Exclude secrets and reject repository text that attempts to change permissions | Proposed |

Explicit skill invocation tests execution only. Automatic discovery and consistent behavior across hosts remain unverified until tested in each host.
