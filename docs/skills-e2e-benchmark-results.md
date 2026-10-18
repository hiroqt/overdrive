# Skill E2E benchmark results

## Outcome

This run predates the package rename. Package IDs and entrypoint labels below are normalized to current names for navigation; the recorded runs, hashes, and outcomes came from the previous package names and have not been rerun as part of the rename.

The five treatment runs passed their case acceptance checks. Four matching controls also passed; one passed only with the skill. That demonstrates that each skill can execute its targeted workflow in this Codex setup. It does not show that every skill improves results over the existing host instructions.

## Run details

- **Date:** 2026-10-15
- **CLI:** `codex-cli 0.162.1`
- **Model:** configured Codex default; not pinned by this run.
- **Cases:** all five installable packages under `skills/`.
- **Treatment:** fresh synthetic Git workspace with the target skill available under `.agents/skills/` and explicit `$skill-name` invocation.
- **Control:** same task and fixture in a fresh workspace without the target package.
- **Scoring:** deterministic response/artifact checks plus trace inspection. The scorer was corrected and the saved run regraded without additional model calls.
- **Run artifacts:** `/private/tmp/skill-e2e-benchmark/run-20261015-194041/` (JSONL transcripts, stderr, final messages, fixture workspaces, JSON summary, and generated report).

## Reproduction fingerprints

| Artifact | SHA-256 |
| --- | --- |
| Benchmark runner | `bcd3ff2b5dafab325930b2776e1894c4f67473174eac5d1ed6a1a640a98e219d` |
| Case manifest | `ce85ce71aa5a135e2762b9181db18fe90ba140f1dbd4b53fbc8243df12892e76` |
| `forge/SKILL.md` | `266e22464bce3aef6b57e0e355a4ee9c3353aa3b2c9f50993ed79847f9fbf147` |
| `signal/SKILL.md` | `9b6a8e9471a0fb17fa7611e91526b2f868ee62e988ff50d597de3e1dd1415acf` |
| `render/SKILL.md` | `eb3e2d47668420761f455561fa7a62e7de986812b28a998bdff4865ed1d0d1b4` |
| `assert/SKILL.md` | `ce1b6bb4410300e15da9a5d9fcb92aadf1ad3af9b5daa87887c47ecb7c529a19` |
| `prune/SKILL.md` | `bbb98ad2189542dd4237f06213b1440d412cbea74d1dd1df8360e4657e1ef962` |

| Skill | Activated | Control | Skill | Result evidence |
| --- | --- | --- | --- | --- |
| `signal` | Yes | Pass | Pass | Retained all six exact payloads, stated the integration suite was not run, stayed under 45 words, and made no edits. |
| `prune` | Yes | Pass | Pass | Used the map, verified `src/invoice.py:2`, explained the unused `tax_exempt` flag, ran the existing tests, and made no edits. |
| `assert` | Yes | Pass | Pass | Trace shows test file edit → failing test → source edit → passing test; both runs ended with 2 tests passing. |
| `render` | Yes | Pass | Pass | Both runs preserved copy, added a labeled field and responsive rule, and passed the static inspector. Both disclosed that Brave exited before rendering; visual and keyboard behavior remain unverified. |
| `forge` | Yes | Fail | Pass | Both created the requested skill package. Only the treatment put a usable trigger and explicit publishing boundary in the skill description, as required by the deterministic checks. |

**Paired task result:** skill treatment 5/5; control 4/5; treatment-only advantage 1/5; parity 4/5.

## Resource telemetry

Codex usage telemetry was present. Values below are input/output tokens for this single run; they include host context and are not stable savings estimates.

| Skill | Control input/output | Skill input/output |
| --- | ---: | ---: |
| `signal` | 17,487 / 54 | 19,020 / 125 |
| `prune` | 78,448 / 595 | 104,971 / 619 |
| `assert` | 91,610 / 904 | 104,864 / 1,123 |
| `render` | 200,087 / 2,105 | 134,363 / 1,809 |
| `forge` | 107,041 / 1,651 | 118,582 / 2,320 |

The output does not support a general token-savings claim: four skill runs used more output tokens, while frontend used fewer. Input counts also vary substantially with tool activity and carried context. Repeat trials with pinned model/settings and comparable traces before comparing efficiency.

The ten paired runs reported 976,473 input and 11,305 output tokens combined. Three preliminary model-backed probes, excluded from the paired results, reported another 65,496 input and 245 output tokens. Input totals include the CLI's cached-input field and are not a direct monetary cost figure.

## Limits

- Skills were explicitly invoked, so this tests execution and workflow artifacts, not automatic skill routing.
- This was one unblinded run per condition, without an independent evaluator. The control omitted the target package but retained the active Codex host/system context.
- The first unisolated preflight hit Codex's skill-context budget because it scanned 1,339 global skills; that call was excluded. The actual benchmark used a temporary `HOME`, then ran explicit target-skill treatments.
- Frontend browser rendering failed with process exit `134`; static HTML checks do not prove visual, keyboard, or device behavior.
- The benchmark does not establish behavior across different models, hosts, or repositories.
