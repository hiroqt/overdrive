# Automatic skill routing validation

## Result — current Codex CLI only

One current-ID routing probe ran on 2026-10-19 with Codex CLI `0.163.0`, using its configured default model (not pinned). Each fresh temporary project contained all eight current packages under `.agents/skills/`. Prompts were realistic and did not name or invoke the intended skill. The run included one unrelated negative control. Workspaces were read-only and synthetic.

| Request | Intended skill | Entrypoint read in trace | Other skill entrypoints read | Result |
| --- | --- | --- | --- | --- |
| Create a release-note skill with version and publishing boundaries | `forge` | Yes | None | Match observed |
| Inventory a React/TypeScript codebase and identify a structure risk | `refactor` | Yes | `prune` | Target match plus related retrieval skill |
| Summarize an auth test failure with exact payloads in at most 45 words | `signal` | **No** | None | Selection not observed; response still met the task constraints |
| Review a public signup page for accessibility and responsive behavior | `render` | Yes | None | Match observed |
| Plan a bug fix with a failing regression test first | `assert` | Yes | None | Match observed |
| Trace why an exempt invoice receives tax, using the codebase map | `prune` | Yes | None | Match observed |
| Run unit groups then browser E2E on the local notes app | `verify` | Yes | None | Match observed; task stopped at environment gates in this read-only probe |
| Review an invoice fix for tenant, TLS, error, and key risks | `guard` | Yes | None | Match observed |
| Unrelated Python `len` question | None | No skill entrypoint read | None | Correct non-match |

**Observed:** the intended entrypoint was read for 7/8 positive prompts; the no-skill control read none. Refactor also read Prune, a related overlap. Signal’s request content passed, but this trace did not show Signal selection. Because Codex does not emit a dedicated skill-selection event here, “not observed” is not definitive proof the prompt excluded hidden skill context. Treat Signal routing as a miss/unknown requiring a host-native selection trace or repeated probe, not as a behavior failure.

The Verify route probe chose the intended entrypoint, then reported that server startup/browser execution was unavailable under its read-only CLI sandbox. The separately approved current-ID Verify run completed the local browser E2E; see [Verify validation](verify-validation.md). The Guard route probe did not change its workspace and did not print the fake credential.

## Evidence and boundaries

- Raw JSONL, stderr, workspace snapshots, and summary: `/private/tmp/overdrive-auto-routing-current/`.
- Current revision: `f70b28e0f946f10f458419f6375d59445ebe7f85`; package SHA-256 values are in the run summary.
- Entrypoint reads and first-response acknowledgements were recorded separately. Entrypoint reads are stronger evidence than self-reported skill names; no dedicated host selection event was exposed.
- This is one unblinded run, not a reliability estimate. It tests only Codex CLI. Claude Code, Gemini CLI, Antigravity, Cursor, and Kiro package copies passed installability checks, but those hosts were not launched for automatic-selection tests.
- Host routing may change with CLI/model versions, package descriptions, user instructions, and competing installed skills. The result does not establish cross-host discovery or consistent behavior.
