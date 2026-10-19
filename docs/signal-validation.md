# Signal validation

The in-session probes below are historical and used the previous package ID. Current-ID behavior and the separate automatic-routing probe are recorded in the [paired benchmark](skills-e2e-benchmark-results.md) and [routing report](automatic-routing-validation.md).

## Result

**In-session behavioral probe: 7/7 cases passed.** The skill produced concise answers for routine requests and retained exact details, requested depth, and clear risk language in the matching probes.

This is a direct, single-session behavior check, not a blind or independent evaluation. It demonstrates that the instructions can guide this Codex response; it does not establish consistent results across runs or hosts.

## Setup and method

- **Host:** Codex conversation.
- **Model:** GPT-6 family; exact serving snapshot and decoding settings were not exposed.
- **Skill:** `skills/signal/SKILL.md`, read and applied explicitly to synthetic prompts in this conversation.
- **Base revision:** `94bb1b2`; the skill and this record are uncommitted working-tree files.
- **Method:** For each prompt below, generate an answer while applying the skill and inspect the output against the acceptance points. This is author-run and not blinded.

## Executed cases

### 1. Routine concise diagnosis — pass

**Prompt:** “A React effect loops because its dependency is an inline object recreated on each render. Give me a short diagnosis and fix.”

**Observed output:** “`useEffect` reruns because its object dependency is recreated each render. Memoize the object or depend on its primitive fields.”

**Checks:** Diagnosis first; cause and actionable fixes retained; no introduction or generic closer.

### 2. Exact technical payload — pass

**Prompt:** “Summarize this briefly, preserving every payload: run `pnpm vitest run src/auth.test.ts`; file `src/auth.ts:42`; error `ERR_AUTH_EXPIRED`; 18 tests passed; `admin !== true`.”

**Observed output:** “`src/auth.ts:42` handles `ERR_AUTH_EXPIRED`. `pnpm vitest run src/auth.test.ts`: 18 tests passed. Keep `admin !== true`.”

**Checks:** Command, path, line, error, count, and negation preserved exactly.

### 3. Requested comprehensive detail — pass

**Prompt:** “Explain comprehensively why a database column migration needs a backup, compatibility window, validation, and rollback plan.”

**Observed output:** “A backup gives you a recovery point if the migration or a later deploy damages data. A compatibility window lets old and new application versions run safely while the schema changes. Validate row counts, constraints, and application reads before removing the old path. Keep a rollback plan that restores the previous schema and data behavior; a schema rollback alone may not recover values already deleted by a destructive migration.”

**Checks:** Kept the requested explanation and sequence-sensitive caveat; did not force ultra terseness.

### 4. Security and destructive action — pass

**Prompt:** “In one very short sentence, tell me how to drop an unused production column.”

**Observed output:** “Confirm no deployed version reads the column, take a verified backup, then run the reviewed migration; dropping it permanently removes its data.”

**Checks:** Complete prose names preconditions, backup, action, and consequence despite the brevity request.

### 5. Unsupported token-savings claim — pass

**Prompt:** “How much total token cost did this skill save? No telemetry is available.”

**Observed output:** “Savings are unmeasured. The skill shortens generated replies; it does not reduce tool output or retained context.”

**Checks:** No invented percentage; response tokens distinguished from other context costs.

### 6. Material ambiguity — pass

**Prompt:** “Should we move landmark recognition to the cloud?” with no privacy, connectivity, or runtime constraints supplied.

**Observed output:** “What matters most: offline operation and keeping photos on-device, or centralized model updates? The answer changes the privacy and connectivity tradeoff.”

**Checks:** Asked one clear question and surfaced the decision that changes the architecture.

### 7. Persisted documentation style — pass

**Prompt:** “Write a README instruction telling users to back up before running a destructive migration.”

**Observed output:** “Before running the migration, create and verify a database backup. The migration permanently removes the selected column and its data.”

**Checks:** Persisted documentation uses clear complete prose rather than fragments.

## Current-ID replay — 2026-10-19

In the current paired fixture, the response preserved every technical payload and stayed within the 45-word limit. The runner marked treatment fail because it did not observe the expected skill-name acknowledgement; no skill entrypoint read was visible. A separate natural-request Codex probe also produced the concise, correct summary without reading or naming the Signal entrypoint. This is a routing miss/unknown for that request, not a content failure; Codex exposes no dedicated skill-selection event to distinguish hidden context from non-selection. Current package SHA-256: `9c9b591a86c21d5e40ee2b42eb3bf3717ae0c86b7b0a16e56df23762779b715d`.

## Not evaluated in the historical in-session probe

- Automatic skill selection or host discovery. The skill was applied explicitly in this conversation; it was not installed or invoked through a host skill command.
- Cross-turn mode persistence in a fresh session, other modes across separate host sessions, or consistency across repeated runs/models.
- Blind or independent scoring. The author generated and assessed the examples.
- Baseline comparison, provider token telemetry, total cost, or token savings.
- Whether the `/signal` aliases are registered by a target host; the skill describes them but does not configure commands.

## Structural checks

- Ruby YAML parsing confirmed the `SKILL.md` frontmatter name matches the package directory and the OpenAI metadata display name matches the package.
- `git diff --check` passed after the validation record was added.

## Conclusion

The skill demonstrated its core response behavior in this session, including exact payload preservation and a clarity override for risky instructions. Treat this as a successful smoke evaluation, not proof of reliable automatic activation or measured token reduction.
