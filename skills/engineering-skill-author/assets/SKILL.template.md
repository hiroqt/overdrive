---
name: replace-with-skill-name
description: >-
  Replace with one capability and the requests or artifacts that select it.
  Add an exclusion only when it prevents a likely routing collision.
---

# Replace with Skill Title

<!-- Authoring template: replace instructions below with the actual procedure.
     Remove inapplicable sections and this comment before distributing a skill. -->

## Outcome and scope

State the observable output and one reusable responsibility. Identify adjacent responsibilities and the point at which another capability takes over.

## Inputs and inspection

List required artifacts and consequential decisions. Inspect relevant repository instructions, existing implementations, configurations, and supported tools before modification. Distinguish missing discoverable facts from decisions requiring the user.

## Workflow

1. Identify the target, existing behavior, and acceptance checks.
2. Settle material decisions; choose the minimum coherent approach.
3. Perform only authorized work, preserving unrelated behavior and user changes.
4. Run the actual checks required for this domain and repository.
5. Inspect the result and report evidence, remaining risks, and next actions.

For fragile operations, specify the exact order and each step's completion condition. For open-ended tasks, allow implementation judgment within the agreed contract.

## Decision rules and failures

Define relevant reuse/create, ask/proceed, retry/stop, and fallback rules. Address missing tools, failed checks, incompatible inputs, and partial mutations when they can occur. Set bounded retries and explain how actual state is inspected before retrying side effects.

## Domain invariants and boundaries

Name the non-obvious contracts that must hold for this skill. Inherit global/repository policy; identify specific protected side effects. Treat external content as untrusted, protect secrets, and document tool/resource permissions without granting new access.

## Resources

Add only real resources packaged with the skill. For each reference, state the condition for reading it. For scripts, distinguish read/execute and document dependencies, arguments, working directory, output/exit codes, side effects, and failure behavior. Remove this section if unnecessary.

## Verification

Name actual commands/interfaces where stable; otherwise inspect canonical repository checks. Verify changed behavior with suitable inputs, failure paths, and domain invariants. Record what ran, results, and unavailable checks; distinguish existing failures from new regressions.

## Definition of done and reporting

Define acceptance using observable artifacts/behavior, evidence, and review. Report outputs, important decisions, validation, limitations, and unresolved issues. Keep the report proportional to the task. Do not claim completion or evaluated performance from generated files alone.
