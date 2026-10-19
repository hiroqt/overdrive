---
name: verify
description: >-
  Validate application changes with feature-level unit tests followed by a real
  end-to-end run. Use when asked to test a feature, verify a web app, or prove
  that an application runs. Covers parallel execution where supported,
  per-feature summaries, browser or MCP workflows, and honest fallback reporting.
---

# Verify

## Outcome

Show that changed features pass focused unit checks, then that the running application completes the user journey. Run independent checks concurrently when a safe mechanism exists. Save and share the unit summary before E2E. A missing swarm is not itself a blocker. Do not report application behavior verified unless applicable unit and E2E gates pass; source inspection, mocks, builds, and health checks are not E2E proof.

This skill coordinates validation. Use the repository's conventions and test tools; use [Assert](../assert/SKILL.md) when implementing a behavior change with its specification-first, test-first workflow.

## Workflow

1. **Map acceptance and outputs.** Inspect the request, instructions, repository, manifests, tests, and available app/browser tools. Map each changed feature to focused success, boundary, and failure cases plus the overall user journey. Avoid arbitrary coverage quotas. Create a run folder in the operating system's temporary directory, with `feature-summaries/<run-id>/<feature-id>/` and `e2e/<run-id>/` subfolders. Never assume an installed skill package is writable. Keep sanitized summaries and necessary evidence there through review and reporting, then remove the run folder when the task is complete. If the user or project requires persistent evidence, copy sanitized summaries and necessary evidence to `.overdrive/verify/results/<run-id>/` in the project; apply the project's retention rules, or retain until the related change is accepted and then remove. Use only task-local temporary or project paths by default; ask before writing to shared, external, or otherwise consequential locations.
2. **Check safety.** Inspect test/setup commands and fixture effects. Prefer isolated local services and synthetic disposable data; never use production or real customer data. Get specific approval before authenticated accounts, external services, shared state, or non-disposable mutations. If approval is absent, skip that path and report why.
3. **Run feature unit checks.** Prefer host swarm/parallel agents when available; otherwise use test-runner parallelism or independent isolated subprocesses, choosing the safest method that preserves per-feature results. Start independent groups against the same revision and record the actual mechanism. Isolate databases, ports, temp paths, and fixtures. Give each feature its own summary folder; prevent workers from making overlapping code edits. If no safe parallel method exists, run serially when testing was requested and safe, label it serial, and state that parallel execution was unavailable. Ask first only when the user or repository explicitly requires concurrency. Never describe serial runs as parallel.
4. **Aggregate and gate.** Save each feature's `summary.md` and machine-readable result, plus a run-level aggregate under `results/feature-summaries/<run-id>/`. Include cases, commands, exit codes, revision, execution mode, and evidence. Share the concise unit summary before E2E. If a result fails, is missing, or refers to another revision, do not start E2E; fix within scope and rerun affected unit groups.
5. **Run real E2E second.** Start the actual app with repository-defined commands and exercise the integrated journey. For web apps, use a browser to act as a user and verify visible outcomes and relevant persisted state. For MCP workflows, use the authorized MCP path; direct API checks do not prove UI coverage. Save the summary and available screenshots/traces/logs under `results/e2e/<run-id>/`, with sensitive data removed. If startup, browser, or the journey fails, record the failure and do not claim E2E passed.
6. **Report.** Mark behavior verified only when applicable unit and real E2E checks pass. Otherwise report incomplete status, execution mode, failures, evidence, and next step. For documentation-only work, mark app tests not applicable with the scope reason.

## Evidence standards

- A unit result names the behavior, case, command, exit code, revision, and actual execution mode (swarm, runner parallelism, concurrent processes, or serial).
- Call work parallel only when independent execution intervals overlap or the runner reports parallel scheduling; dispatching multiple workers alone is not proof.
- A web E2E result shows that the application launched and a browser completed the actual user flow with the expected visible result. Keep screenshot, trace, or equivalent browser evidence when available.
- An MCP E2E result names the authorized environment and operation, and verifies the response/state visible to the user. Do not claim browser/UI coverage from a direct MCP call.
- A passing build, static check, mocked endpoint, isolated component test, or health endpoint is supporting evidence only.
- If the app cannot start or the browser/MCP capability is unavailable, record the observed blocker; never manufacture a screenshot, successful state, or pass.
- Keep each feature's unit summary and raw/sanitized evidence in its dedicated run folder; keep overall E2E artifacts in the separate E2E run folder. Never store credentials, cookies, tokens, or real personal/customer data in evidence.
- Temporary storage is the default and needs no extra approval. Persistent project-local storage is allowed when required by the project or user; do not write evidence into the installed skill package. Ask before using shared or external storage, or a path with other meaningful side effects.

## Boundaries

- User permission and higher-priority instructions govern all test actions. This skill never grants credentials, account access, production access, or permission to mutate shared systems.
- Do not send messages, make purchases, publish content, or alter existing user data as a test. Use an approved sandbox and disposable fixtures.
- Keep the unit-before-E2E order. E2E is not a substitute for missing unit coverage, and passing unit tests do not waive the E2E gate for an application behavior change.
- Prefer parallel unit execution, but do not block safe testing solely because swarm is unavailable. Use another safe concurrency mechanism or clearly disclose a serial fallback. Never claim parallel completion when checks ran serially.
- Explicit invocation proves only that this workflow was requested; it does not prove automatic skill routing.

## Evaluation

For proposed behavioral cases and evaluation limits, read [the Verify evaluation guide](references/evaluation.md). Its cases are proposals until actually run and recorded.
