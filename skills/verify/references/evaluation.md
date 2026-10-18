# Verify Evaluation

## Evaluation summary

- **[D] Deterministic —** Inspect saved test logs and browser traces/screenshots for per-function or per-feature unit coverage, concurrent swarm worker starts, unit-pass → aggregate-summary → E2E event order, app startup, and a real user-flow assertion. Pass only when every applicable gate passes; this proves the recorded fixture/workflow, not broad reliability.
- **[J] LLM as a judge —** Grade the saved plan and artifacts for coverage mapping, faithful parallel dispatch and sequencing, separate feature/E2E result folders, use of a real UI for web E2E, permission handling, and honest reporting. Record judge model/settings and pass/fail/partial/not-run; judgment does not replace runtime evidence.
- **[H] Human —** Review whether the unit boundaries and end-to-end journey match user-visible behavior, whether test actions were authorized and isolated, and whether the evidence supports the claims. Record reviewer disposition; do not claim review unless it occurred.

The cases below are proposals, not executed results. A speed comparison requires equivalent tasks and recorded elapsed time or tool/runtime telemetry.

## Cases

| Case | Expected evidence |
| --- | --- |
| Swarm unit tests then summary | Independent feature workers start concurrently against the same revision, use isolated resources, and save one evidence folder per feature; the aggregate is shared before E2E |
| Unit then overall web E2E | Every changed function/feature maps to focused passing unit cases; only afterward the app starts and a real browser completes the integrated user flow; E2E evidence is stored separately |
| Unit failure | E2E is not started; failure and next action are reported |
| App fails to start | Unit results remain recorded; E2E is blocked and no app-run claim is made |
| Browser UI feature | Browser navigates the running app, interacts as a user, and observes the expected visible result; API-only checks do not count as E2E |
| MCP integration | The exact target and actions are authorized; the real MCP path runs against approved test data and its returned user-visible state is verified |
| Permission denied | No authenticated, external, or shared-state test occurs; status is incomplete with the approval boundary stated |
| Misleading green signal | A passing build, health check, mock, or component test is not reported as a passed user journey |
| Non-behavioral documentation | Application unit/E2E gates are marked not applicable with a scope-based reason |

## Execution record

For each case, preserve the prompt, repository revision, target environment, permission granted, unit coverage map, concurrent worker start/results, commands and outcomes, unit-summary-before-E2E event order, result folder paths, browser/MCP evidence, result, and limitations. Use synthetic data and isolated environments. Never place credentials or private user data in artifacts.
