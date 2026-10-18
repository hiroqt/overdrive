---
name: verify
description: >-
  Validate application changes with focused unit tests followed by a real
  end-to-end run. Use when asked to test a feature, verify a web app, or prove
  that an application runs. Covers per-function/feature evidence, browser or
  MCP workflows, permission gates, and completion reporting.
---

# Verify

## Outcome

Show that each changed function or feature behaves as required in isolation, then show that the running application completes a real user journey. Do not report an application change as complete until every applicable unit-test and end-to-end gate passes. Source inspection, mocks, a successful build, or a server health response alone do not prove end-to-end behavior.

This skill coordinates validation. Use the repository's conventions and test tools; use [Assert](../assert/SKILL.md) when implementing a behavior change with its specification-first, test-first workflow.

## Workflow

1. **Define coverage.** Inspect the request, active instructions, repository state, manifests, existing tests, and available app/browser tools. Convert acceptance criteria into a compact matrix that maps each changed function or distinct feature behavior to focused unit cases and at least one end-to-end user journey. Include relevant success, boundary, and failure behavior. Test public behavior at the appropriate unit boundary; do not add brittle tests for private implementation details or arbitrary coverage quotas.
2. **Check permission and safety.** Inspect test commands, setup scripts, environment configuration, and fixture behavior before running them. Prefer isolated local services and synthetic disposable data. Never test against production or use real customer data. Before using an authenticated browser/MCP account, an external service, shared/staging data, or actions that create, change, send, purchase, publish, or delete non-disposable state, ask the user to approve the specific target, account/data, and actions. A general request to test does not authorize those side effects. If permission is absent or declined, stop that test path and report the blocker.
3. **Run unit tests first.** Add or locate focused unit coverage for every changed function or distinct feature behavior, then run those cases and the relevant unit suite. Inspect failures and fix the cause; rerun affected unit checks. Do not start E2E until all applicable unit tests pass. If a test harness is unavailable, a test cannot be isolated safely, or unit tests still fail, stop before E2E and report incomplete status with the exact gap.
4. **Run end-to-end second.** Start the actual application using commands discovered from the repository. Verify it reaches a ready state, then exercise the changed workflow through the real user-facing surface. For web apps, use an available browser/UI automation tool to navigate to the running app and interact with it as a user; assert the visible outcome and any relevant persisted result. API requests, mocks, component tests, and health checks may support diagnosis but cannot replace the browser journey. For a workflow whose actual user surface is an MCP client, use that MCP path; direct MCP/API calls are appropriate only for integration behavior that has no relevant UI or when explicitly requested.
5. **Capture proof.** Record the revision, exact unit and E2E commands or tool actions, results, app URL/environment, and observable journey outcome. Preserve useful test reports, browser screenshots/traces, or logs when the tools provide them; sanitize credentials and private data. Distinguish “app started” from “user journey passed.” Retry a suspected transient failure only after inspecting state, and report both attempts.
6. **Apply the completion gate.** Mark the application change complete only when its unit matrix and relevant unit suite pass and the real E2E journey passes. If a gate fails, is blocked by permission, or cannot be executed, do not present a completion summary or imply the app is verified; give a concise incomplete-status report with failures, evidence, and the smallest next step. For documentation-only or otherwise non-behavioral work, mark application tests not applicable and explain why rather than fabricating a pass.

## Evidence standards

- A unit result names the changed behavior or function, test case, command, and pass/fail outcome.
- A web E2E result shows that the application launched and a browser completed the actual user flow with the expected visible result. Keep screenshot, trace, or equivalent browser evidence when available.
- An MCP E2E result names the authorized environment and operation, and verifies the response/state visible to the user. Do not claim browser/UI coverage from a direct MCP call.
- A passing build, static check, mocked endpoint, isolated component test, or health endpoint is supporting evidence only.
- If the app cannot start or the browser/MCP capability is unavailable, record the observed blocker; never manufacture a screenshot, successful state, or pass.

## Boundaries

- User permission and higher-priority instructions govern all test actions. This skill never grants credentials, account access, production access, or permission to mutate shared systems.
- Do not send messages, make purchases, publish content, or alter existing user data as a test. Use an approved sandbox and disposable fixtures.
- Keep the unit-before-E2E order. E2E is not a substitute for missing unit coverage, and passing unit tests do not waive the E2E gate for an application behavior change.
- Explicit invocation proves only that this workflow was requested; it does not prove automatic skill routing.

## Evaluation

For proposed behavioral cases and evaluation limits, read [the Verify evaluation guide](references/evaluation.md). Its cases are proposals until actually run and recorded.
