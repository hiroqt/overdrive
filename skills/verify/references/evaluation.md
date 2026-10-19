# Verify evaluation

## Evaluation summary

- **[D] Deterministic — current package-ID runs executed:** the current `verify` package completed two concurrent unit groups (4/4 assertions), shared the aggregate before a local Chromium E2E, and observed the saved item after reload. The unit-failure and startup-failure gates behaved as required. An earlier dispatched-worker check passed both groups but showed no overlap, so it did not prove swarm parallelism. These results cover only the recorded paths.
- **[J] LLM as a judge — not run:** no independent judge graded the plan or artifacts.
- **[H] Human — not run:** no independent human review was performed.

This was a single agent following the skill, not an automatic-discovery or cross-host study. The repository-level record is `docs/verify-validation.md` when available. Do not generalize it to other agents, projects, or test runners. Speed improvement was not evaluated.

## Evaluated cases

| Case | Status and evidence |
| --- | --- |
| No-swarm full sequence | **PASS, simulated capability profile:** no swarm worker dispatched; two feature commands ran as overlapping isolated subprocesses. Aggregate saved/shared before real browser E2E. Not a separate host compatibility test. |
| Current package-ID sequence | **PASS, 2026-10-19:** current `verify` SHA recorded in `docs/verify-validation.md`; two groups passed 4/4 and overlapped; Chromium added a note and confirmed it remained after reload. Evidence under `results/feature-summaries/20261019-current-id/` and `results/e2e/20261019-current-id/`. |
| Dispatched-worker concurrency | **NOT PROVEN:** two workers each passed 2/2, but recorded intervals did not overlap. Local timing record: `skills/verify/results/feature-summaries/20261019-swarm-dispatch/summary.md`. |
| Real app E2E | **PASS, synthetic local app:** Firefox submitted a note, showed saved state, reloaded, and showed the persisted note. Accessibility state and server requests are recorded. |
| Unit failure gate | **PASS, expected failure:** synthetic unit command exited 1; its run was marked failed and E2E was not started for that run. |
| App startup failure | **PASS, injected failure:** synthetic startup command exited 17; status was blocked and browser testing was not attempted. |
| Authenticated/external/shared-state permission gate | **Not run:** fixture required none of these permissions. |
| MCP workflow | **Not run:** no MCP-backed app was in scope. |
| Automatic skill discovery | **Separate probe:** current Verify entrypoint was read for a natural Verify request in one Codex CLI run; see `docs/automatic-routing-validation.md`. This does not establish repeated or cross-host routing. |

## Reproduction record

The run paths below are historical artifacts created before the current temporary-directory default. For new runs, follow `SKILL.md`: use OS temporary storage and clean it after reporting, unless persistent evidence is requested or required by project policy.

- Fixture: `/private/tmp/overdrive-verify-eval` (synthetic note-list app; no external services or user data).
- Revision: repository HEAD `7e213be108b77cb52815ea29c189b7d20cc97828` plus the Verify skill edit in the working tree; final skill SHA-256 `c82bcc44ce6548426aaf1c101b39a5e62343c245ea9e9f7fba1f8b8af6af954c`.
- Unit commands: `node --test --test-reporter=tap test/title.test.mjs` and `node --test --test-reporter=tap test/notes.test.mjs`; each passed 2/2. Their recorded time intervals overlap. Local feature artifacts are under `skills/verify/results/feature-summaries/20261019-ns-verify/`.
- Aggregate: the run summary was saved and shared before E2E. Generated run folders are ignored by Git; the repository-level outcome is summarized in `docs/verify-validation.md` when available.
- E2E: `python3 -m http.server 8765 --bind 127.0.0.1`; Firefox via CUA at `http://127.0.0.1:8765/`; note creation and reload persistence observed. Local evidence is under `skills/verify/results/e2e/20261019-ns-verify/`.
- Failure runs: local artifacts are under `skills/verify/results/feature-summaries/20261019-unit-failure-gate/` and `skills/verify/results/e2e/20261019-unit-failure-gate/`; injected startup failure is under `skills/verify/results/e2e/20261019-startup-failure/`.
- The first local server attempt was blocked by sandbox socket policy; it started after an explicit local-only permission grant. This was an environment restriction, not an application failure.

Future evaluation should use an independent agent and at least one host without swarm support. Preserve the event order, target revision, commands, exit codes, execution mode, and UI evidence for every run. Proposed cases are not results.
