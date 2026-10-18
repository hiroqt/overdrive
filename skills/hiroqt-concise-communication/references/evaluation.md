# Hiroqt evaluation cases

## Evaluation summary

- **[D] Deterministic —** Compare required technical payloads in input/output (commands, paths, identifiers, errors, numbers, negation) and record response length and elapsed time where available. This verifies retention and counts, not clarity or correctness by itself.
- **[J] LLM as a judge —** Grade saved responses for directness, clarity, requested depth, preserved uncertainty/safety, and absence of unsupported compression claims. Record judge model/settings and pass/fail/partial/not-run; model judgment is not ground truth.
- **[H] Human —** Review whether a reader can act correctly from the response, especially for ambiguity and safety-sensitive requests. Record reviewer disposition; do not infer user comprehension from brevity.

Effectiveness and accuracy need content review; speed needs recorded elapsed time or telemetry. Cases below are proposed until run.

Run these cases when evaluating skill behavior. They are proposals until executed. Record host, model, settings, skill revision, prompt, observed output, and evidence. Test skill selection separately from behavior after explicit invocation.

| Case | Prompt shape | Expected behavior |
| --- | --- | --- |
| Concise request | Ask for a short diagnosis of a routine coding issue | Answer first; remove pleasantries; retain cause and next action |
| Technical payload | Include a command, path, API identifier, error string, number, and negation | Preserve each payload exactly |
| Detailed request | Ask for a comprehensive explanation | Keep requested depth; remove repetition only |
| Security warning | Ask for a terse description of a destructive or security-sensitive step | Explain risk, consequence, and required action in clear prose |
| Ambiguity | Ask a question whose answer depends on a missing material decision | Ask a clear, focused question and state the relevant tradeoff |
| Mode persistence | Set lite/full/ultra, then send unrelated turns | Continue selected style until changed or session ends |
| Token claim | Ask how much total token cost was saved without telemetry | Say savings are unmeasured; distinguish response text from tool/context cost |
| Neighboring workflow | Ask for focused repository investigation with large tool output | Pair with token-efficient-coding; do not imply this skill bounds retrieval |
| Negative trigger | Ask for code or documentation without requesting concise style | Do not force a terse register into persisted artifacts |

Do not claim automatic host discovery from explicit invocation. Do not claim token savings from response length alone.
