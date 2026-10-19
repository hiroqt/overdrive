# Verify skill evaluation record

**Date:** 2026-10-19
**Scope:** One synthetic local web app; this agent explicitly followed the skill. Automatic discovery, independent judging, and human review were not tested.

## Results

| Case | Outcome | Evidence |
| --- | --- | --- |
| Concurrent feature units without swarm dispatch | PASS, 4/4 across two groups; command intervals overlapped | Local run artifacts under `skills/verify/results/feature-summaries/20261019-ns-verify/` |
| Summary before end-to-end | PASS; aggregate saved and shared before server/browser launch | Aggregate event recorded in the local run summary |
| Browser end-to-end | PASS; Firefox created a note, then showed it persisted after reload | Local accessibility evidence under `skills/verify/results/e2e/20261019-ns-verify/` |
| Unit failure gate | Expected behavior PASS; injected test exited 1 and no E2E started for that run | Local artifacts under `skills/verify/results/feature-summaries/20261019-unit-failure-gate/` |
| App startup failure | Expected behavior PASS; injected startup command exited 17 and no browser journey started | Local artifacts under `skills/verify/results/e2e/20261019-startup-failure/` |
| Dispatched-worker concurrency | NOT PROVEN; both worker checks passed 2/2, but recorded intervals did not overlap | Local timing record under `skills/verify/results/feature-summaries/20261019-swarm-dispatch/` |

The no-swarm case used concurrent isolated subprocesses; the coordinator host itself had agent-coordination capability, so this is a simulated no-swarm capability profile, not a separate host compatibility test. The startup fault was injected. These results do not establish behavior across other hosts or arbitrary applications.

## Recorded observations

- Feature `normalize-title`: 2/2 passed. Feature `create-note`: 2/2 passed. Both subprocesses started within 3 microseconds of each other; observed intervals overlapped.
- Before E2E, the user-visible aggregate reported 4/4 unit tests passed and progression to the local synthetic fixture.
- After submitting `Verify E2E result`, Firefox showed `Note saved` and the note in the list. After reload, the note remained visible. Server requests returned 200 initially and 304 on reload; the nonessential favicon request returned 404.
- A separate injected unit run returned 1 with 0/1 passing; no app or browser was started for that run. A separate injected startup command returned 17; no browser journey was started for that run.
- A separate worker dispatch passed the title group at `11:33:34.147039–11:33:34.380139 UTC` and the notes group at `11:33:35.834–11:33:36.002 UTC`; the intervals did not overlap. Worker dispatch alone is not evidence of parallelism.

## Limits

- One synthetic app, one explicit skill-following run, and one browser.
- Generated run folders are local-only and ignored by Git; this page summarizes their observed results.
- No proven concurrent swarm run, separate no-swarm host, MCP journey, auth/permission scenario, automatic discovery, LLM judge, or independent human review.
- The sandbox initially denied localhost binding. The server started after permission was granted for the local-only fixture.
- Accessibility-tree output is retained as browser evidence; no screenshot file was saved.
- No speed or broad reliability claim is supported.
- One separate worker-dispatch attempt did not establish swarm concurrency. The complete passing sequence is the overlapping isolated-subprocess run above.
