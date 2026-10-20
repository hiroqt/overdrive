# Overdrive router evaluation

## Evaluation summary

- **[D] Deterministic —** Verify the installer-generated skill list equals the selected domain skills, every route-map entry names an installable skill, the router never dispatches to excluded skills, and command help/list behavior is truthful. These checks establish catalog and routing-contract consistency, not model judgment.
- **[J] LLM as a judge —** Grade saved router traces for correct primary-skill choice, adherence to the selected entrypoint, restraint on irrelevant skills, and useful but unexecuted handoffs. Record model, host, prompt, and rubric; a judge cannot prove the host loaded the installed package.
- **[H] Human —** Review ambiguous and multi-skill cases for a sensible primary owner, concise explanation, preserved permission gates, and truthful limits. Record the reviewed cases and disposition; do not infer broad routing reliability from a small sample.

Test automatic selection separately from explicit skill execution and host discovery. Record host, surface, model, package revision, installed skill set, prompt, selected skill, evidence that its procedure was followed, and limitations. Keep private code and user data out of synthetic evaluations.

## Cases

| Case | Expected result |
| --- | --- |
| Natural-language behavior change | Select Assert and follow its test-first procedure. |
| Explicit `/overdrive review` on a security-related diff | Honor Review as the explicit primary skill; do not silently substitute Guard. |
| Partial install containing only Assert and Overdrive | Route behavior-change work to Assert; report other skills as unavailable. |
| UI redesign with a behavior requirement | Choose the skill that owns the immediate user outcome and mention one optional handoff, without running a chain. |
| Request unrelated to the installed skill set | Do not force a skill selection. |
| Ambiguous outcome with meaningful permission impact | Ask the smallest consequential question before dispatch. |

## Execution record

Live host and per-skill results are recorded in `docs/cross-agent-skill-installability-results.md`. Results from older package revisions and earlier installer layouts remain historical.
