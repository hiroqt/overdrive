# Review evaluation

The cases below are proposals, not executed results. Use small synthetic repositories with known source and caller maps. Do not send private code or pull request content to an external judge.

## Evaluation summary

- **[D] Deterministic — proposed, not run.** Check that cited paths/lines exist in the selected diff, each finding names a trigger and outcome, caller references match the fixture map, groups and continuous numbering are valid, and no files change during review. Structural checks do not prove the defect is real; a reviewer must reproduce or reason from the concrete code path.
- **[J] LLM as a judge — proposed, not run.** Blindly compare reports against planted defects and verified no-finding controls. Score evidence accuracy, reproduced case, severity/group, smallest-fix quality, caller/data-flow coverage, false-positive rate, and adherence to the requested output. Record judge version/rubric and disagreements; judge scores are not ground truth.
- **[H] Human — proposed, not run.** Ask an independent developer to follow each cited path and reproduce the trigger, then assess whether the verdict and fix are useful. Record accepted/rejected findings, missed defects, inspected revision, and rationale.

## Proposed cases

| Case | Expected evidence |
| --- | --- |
| Changed function signature has two callers; one still passes old arguments | Both callers are found; a concrete failing input/call is cited; smallest contract correction proposed |
| Boundary bug on empty input or final list item | Exact value and branch reproduce the wrong result; test need and fix are tied to the changed path |
| Shared function is fixed at one caller but remains wrong for another | Shared root cause and all discoverable callers are traced before reporting |
| Error path writes data before validation or swallows a failed write | Ordering and failure case show actual corruption/loss; transactional or ordering remedy is minimal |
| Concurrent deployment has check-then-write race | README/deploy config establish concurrent load and path demonstrates duplicate/lost state; otherwise no scale finding |
| Small script has no concurrency evidence | Report states the one-process/one-user assumption or missing target; no unsupported many-user claim |
| Risky new parser/authorization/data-write branch has no regression test | Names one triggering case the missing test would catch; does not demand broad coverage |
| Unused option is referenced only in a comment, not executable code | Search and callers establish it is unused before a deletion suggestion |
| Clean, behavior-preserving change with no issue | Two/three-sentence change summary, concise checked line, `Looks good. Ship.`, no invented finding |
| README or deployment setup conflicts with implementation | Concrete user/deployment scenario and relevant source are cited; stale documentation is distinguished from a runtime defect |
| No diff target is named; working tree is dirty | Review chooses and names the uncommitted changes instead of silently switching to the last commit |

Record repository fixture/revision, target-selection result, exact report, case disposition, files changed (expected none), checks actually run, elapsed time if measured, and limitations. Compare against a no-skill baseline before making effectiveness claims. Explicit invocation is not automatic-routing evidence.
