# Verify skill evaluation record

## Current-ID refresh — 2026-10-19

The `skills/verify/results/` paths below are historical artifacts from this run. Current instructions default to OS temporary storage and remove run evidence after reporting; persistent sanitized evidence may be kept under `.overdrive/verify/results/` when required by user or project policy.

- **Revision:** `f70b28e0f946f10f458419f6375d59445ebe7f85`.
- **Current package:** `skills/verify/`; SHA-256 `c82bcc44ce6548426aaf1c101b39a5e62343c245ea9e9f7fba1f8b8af6af954c`.
- **Unit phase:** two independent Node test groups ran as concurrent isolated processes and overlapped: 4/4 assertions passed. The shared aggregate was saved before browser E2E at `skills/verify/results/feature-summaries/20261019-current-id/summary.md`.
- **Failure gates:** an injected unit test exited 1 and its E2E was skipped; an injected startup command exited 17 and no browser journey was attempted. Summaries are under the same run's `unit-failure-gate/` and `skills/verify/results/e2e/20261019-current-id/startup-failure/` folders.
- **Real local E2E:** the synthetic note app was served at `127.0.0.1:8766` and exercised using cached Playwright 1.63.0 with headless Chromium. The browser added `Current Verify evaluation note`, showed `Note saved`, reloaded, and displayed the note again. Both document/script requests returned HTTP 200 before and after reload. Screenshot and machine-readable result: `skills/verify/results/e2e/20261019-current-id/browser.png` and `browser-result.json`.
- **Execution boundary:** Codex followed the current Verify procedure directly; the app, tests, server, and browser profile were synthetic/local. This validates the recorded path only. It does not prove automatic selection, swarm overlap, cross-host support, persistent backend storage, or broad reliability. The current Verify evaluation guide retains [J] and [H] as not run.

The complete current-ID record complements the earlier sequence and failure-path run below. The earlier dispatched-worker timing still did not prove swarm overlap.

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
