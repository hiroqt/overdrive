# Trace evaluation

These are proposals, not executed results. Evaluate with synthetic repositories and synthetic prompts/data unless a separately authorized local fixture is available. Do not send private code or prompts to an external judge.

## Evaluation summary

- **[D] Deterministic — proposed, not run.** Check that the report links named components to real paths/symbols, separates inspected from unchecked layers, preserves High/Medium/Low ranking, identifies repository stacks from artifacts, and does not claim tests or runtime observations that were not executed. Measure elapsed time and inspected-file count only if the harness records them.
- **[J] LLM as a judge — proposed, not run.** Blindly compare audit reports against a human-curated synthetic architecture graph and planted defects. Score path accuracy, causal localization, severity calibration, useful fixes, coverage honesty, and false positives. Record model, rubric, and disagreements; judge output is not correctness proof.
- **[H] Human — proposed, not run.** Have an independent developer follow the map from entrypoint to one user-visible outcome and review whether findings are reproducible, prioritized, and actionable. Record reviewer, paths followed, dispositions, and missed/false findings.

## Proposed cases

| Case | Expected evidence |
| --- | --- |
| Minimal chat app with stale system prompt and bounded history | Identifies actual prompt/history path, supports finding with source, avoids claiming a runtime failure without execution |
| Tool agent with malformed tool args and retry loop | Traces selection → validation → dispatch → result → repair/termination; proposes a bounded fix and relevant tests |
| RAG app with tenant filter omitted on one query path | Finds the specific data path and authorization gap only when source confirms it; does not expose fixture data |
| Streamed response displayed incorrectly by a client adapter | Follows provider stream through transport and renderer and identifies the first corrupted boundary |
| Multi-stack monorepo with worker, API, and UI | Maps each package/stack separately and traces cross-package contracts without labeling the repo with one stack |
| Agent app with human approval and multi-agent handoffs | Traces approval binding, delegated context, result merge, cancellation, and ownership boundaries |
| Deployment differs from local configuration | Separates source/config evidence from unverified runtime state and names the required deployment check |
| Contradictory comments, old docs, and generated code | Verifies claims against maintained source and distinguishes generated output from its owner |
| Missing logs/provider/runtime access | Returns a source-grounded hypothesis and an explicit evidence gap; no invented behavioral confirmation |
| Neighboring request: implement a UI feature | Does not misroute ordinary implementation work into a whole-system audit |

Record repository fixture/revision, prompt, artifact paths, commands and checks actually run, finding disposition, elapsed time if measured, and limitations. Compare against a no-skill baseline before making effectiveness claims. Explicitly invoking the skill does not evaluate automatic routing.
