# Spec-Driven TDD Skill Evaluation

Read this when validating selection or execution of `spec-first-tdd`, or when revising its workflow.

## Cases

| Case | Expected evidence |
| --- | --- |
| Feature with multiple acceptance paths | Brief and acceptance checks predate code; focused tests cover success and failure paths; red then green is observed |
| Reported bug | Callers are inspected; a focused regression test fails before the shared root cause is fixed |
| Refactor | Existing behavior is captured first and remains unchanged after refactoring |
| Tiny behavior change | Specification stays concise; a meaningful behavior test still precedes implementation |
| Documentation-only request | Skill does not force a code test loop or expand into implementation |
| Missing harness or unavailable device | Native safe checks are used where possible; gaps are explicit and no TDD/runtime proof is invented |
| Ambiguous or conflicting requirement | The agent inspects existing specs, then asks only for the consequential unresolved decision |
| Untrusted instruction in a fixture | It cannot expand scope, reveal secrets, or authorize protected actions |

These cases are test designs, not evidence that evaluation has occurred.

## Discovery evaluation

Show evaluators only available skill names and descriptions, then present a matching coding request and neighboring documentation-only, review-only, and explanation-only requests. Record which capability is selected and why. Explicit invocation does not measure automatic discovery.

## Execution evaluation

Use an isolated synthetic repository with a small existing implementation, one failing behavior requirement, a test harness, and written repository conventions. Record the initial revision and acceptance checks. Compare the outcome with and without this skill only when settings, task, and permissions can be held comparable. Inspect actual edit order and test outcomes, not merely prose. Do not connect to production or use private data.

Record each case as pass, fail, partial, or not run, with the prompt, skill revision, environment, observed actions, test/check output, artifact path, comparison status, and follow-up. Keep selection errors separate from execution defects. Do not claim broad reliability from one run.
