---
name: verify
description: >-
  Validate application changes with concurrent feature-level unit tests,
  followed by a real end-to-end run. Use when asked to test a feature, verify a
  web app, or prove that an application runs. Covers swarm dispatch, per-feature
  evidence summaries, browser or MCP workflows, permission gates, and reporting.
---

# Verify

## Outcome

Show that each changed function or feature behaves as required in isolation, then show that the running application completes the overall user journey. Dispatch independent feature-level unit checks through the host's swarm/parallel-agent capability and run them concurrently. Save and share the aggregated unit summary before starting E2E. Do not report an application change as complete until every applicable unit-test and end-to-end gate passes. Source inspection, mocks, a successful build, or a server health response alone do not prove end-to-end behavior.

This skill coordinates validation. Use the repository's conventions and test tools; use [Assert](../assert/SKILL.md) when implementing a behavior change with its specification-first, test-first workflow.

## Workflow

1. **Define coverage and output.** Inspect the request, active instructions, repository state, manifests, existing tests, and available app/browser tools. Convert acceptance criteria into a matrix mapping every changed function or distinct feature behavior to focused unit cases and an overall end-to-end user journey. Include relevant success, boundary, and failure behavior. Test public behavior at the appropriate unit boundary; avoid brittle private-implementation tests and arbitrary coverage quotas. Create a unique run ID and output folders inside this skill package: `results/feature-summaries/<run-id>/<feature-id>/` and `results/e2e/<run-id>/`. If the package folder is not writable, do not silently write elsewhere; ask the user to approve a project-local evidence path or permission to use the package folder.
2. **Check permission and safety.** Inspect test commands, setup scripts, environment configuration, and fixture behavior before running them. Prefer isolated local services and synthetic disposable data. Never test against production or use real customer data. Before using an authenticated browser/MCP account, an external service, shared/staging data, or actions that create, change, send, purchase, publish, or delete non-disposable state, ask the user to approve the specific target, account/data, and actions. A general request to test does not authorize those side effects. If permission is absent or declined, stop that test path and report the blocker.
3. **Dispatch unit tests in parallel.** Use the host's available swarm or parallel-agent facility. Assign every changed feature, or each independent unit-test group when a feature spans distinct units, to a separate worker and launch all independent workers concurrently against the same target revision. Within each worker, enable the test runner's parallel-case mode when available and safe. Give each worker clear file/test ownership, the relevant acceptance cases, safe commands, and its feature-summary folder. Workers report exact commands, exit codes, cases, revision, and sanitized evidence. Isolate ports, databases/schemas, temp directories, and mutable fixtures so workers cannot race or corrupt each other's results. Do not let workers make overlapping production-code edits. If the host has no swarm, capacity prevents the requested parallel run, or shared state cannot be isolated, report the limitation and ask before substituting a serial run; never claim serial work was parallel.
4. **Aggregate and gate.** Wait for all unit workers. Check that every changed function/feature has focused coverage, all worker results refer to the intended revision, and every applicable unit test passes. Save an individual `summary.md` and machine-readable result in each feature folder, plus a run-level unit summary under `results/feature-summaries/<run-id>/`. Share the concise aggregate with the user now, before E2E. If any test fails, is missing, or has an invalid/inconsistent result, do not begin E2E. Fix only within the authorized scope, then rerun affected unit groups in parallel and issue an updated summary.
5. **Run overall E2E second.** Start the actual application using commands discovered from the repository, then exercise an end-to-end journey that covers the changed features working together. For web apps, use an available browser/UI automation tool to navigate to the running app and act as a user; assert the visible outcome and relevant persisted result. API requests, mocks, component tests, and health checks may support diagnosis but cannot replace the browser journey. For an MCP-based user workflow, use that MCP path; direct MCP/API calls are appropriate only for integration behavior with no relevant UI or when explicitly requested. Save the E2E summary and available browser screenshots/traces/logs under `results/e2e/<run-id>/`. Sanitize credentials and private data.
6. **Apply the completion gate.** Mark the application change complete only when parallel unit coverage and the overall real E2E journey both pass. If a gate fails, is blocked by permission, or cannot be executed, do not claim completion or verified app behavior; give an incomplete-status report with failures, evidence, and the smallest next step. For documentation-only or otherwise non-behavioral work, mark application tests not applicable with a scope-based reason instead of fabricating a pass.

## Evidence standards

- A unit result names the changed behavior or function, test case, command, and pass/fail outcome.
- A web E2E result shows that the application launched and a browser completed the actual user flow with the expected visible result. Keep screenshot, trace, or equivalent browser evidence when available.
- An MCP E2E result names the authorized environment and operation, and verifies the response/state visible to the user. Do not claim browser/UI coverage from a direct MCP call.
- A passing build, static check, mocked endpoint, isolated component test, or health endpoint is supporting evidence only.
- If the app cannot start or the browser/MCP capability is unavailable, record the observed blocker; never manufacture a screenshot, successful state, or pass.
- Keep each feature's unit summary and raw/sanitized evidence in its dedicated run folder; keep overall E2E artifacts in the separate E2E run folder. Never store credentials, cookies, tokens, or real personal/customer data in the skill package.
- The shared skill folder may be global or read-only. Do not modify it or redirect result files to an unrequested location without the user's approval.

## Boundaries

- User permission and higher-priority instructions govern all test actions. This skill never grants credentials, account access, production access, or permission to mutate shared systems.
- Do not send messages, make purchases, publish content, or alter existing user data as a test. Use an approved sandbox and disposable fixtures.
- Keep the unit-before-E2E order. E2E is not a substitute for missing unit coverage, and passing unit tests do not waive the E2E gate for an application behavior change.
- Parallel unit execution is a required part of this workflow. Use isolated workers and shared-resource boundaries; do not claim parallel completion when tests ran serially.
- Explicit invocation proves only that this workflow was requested; it does not prove automatic skill routing.

## Evaluation

For proposed behavioral cases and evaluation limits, read [the Verify evaluation guide](references/evaluation.md). Its cases are proposals until actually run and recorded.
