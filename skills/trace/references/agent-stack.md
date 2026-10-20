# Agent application system map

Use this as a broad source-navigation checklist for agent/LLM products. It is neither a fixed architecture nor a claim that every application needs every checkpoint. Select the checkpoints implicated by the request and observed code, and record unchecked areas. Keep components, data flows, and runtime behavior distinct: a code path proves implementation, while only an executed trace proves runtime behavior.

The original request called its list a “12-layer stack” but supplied 14 labels. Retain their wording below for traceability. “ArCs” has no defined meaning in the request; leave it unresolved unless the user clarifies. The additional checkpoints widen coverage across host/runtime, product integration, identity, data, reliability, and release operations.

## 1. Host and product boundary

| Checkpoint | Trace in source/config |
| --- | --- |
| Host/runtime lifecycle | Coding-agent or application host, framework/version, process startup/shutdown, callback lifecycle, event loop, and capability limits |
| User entrypoints | UI, API, webhook, CLI, scheduled job, queue consumer, or IDE action that starts a run |
| Identity and tenancy | User, organization, session, and tenant identity creation and propagation across async and service boundaries |
| Product workflow | Business states, ownership rules, prerequisites, idempotency, and domain invariants around an agent action |

## 2. Instruction and context assembly

| Checkpoint | Trace in source |
| --- | --- |
| Conflicting instruction | Host, developer, project, user, and retrieved instruction sources; actual precedence and override behavior |
| Instruction bloat | Duplicate, stale, conflicting, irrelevant, or oversized instructions and their context/token cost |
| Prompt construction/versioning | Templates, variable interpolation, prompt versions, system/developer composition, escaping, and request snapshots |
| Session history staleness | Turn selection, timestamps, truncation, summaries, ordering, and cross-request state |
| Prior-turn context injection | User/assistant/tool history, retrieved text, trust boundaries, delimiters, and tenant/session isolation |
| Long-term memory distillation | Memory writes, summaries, provenance, update/conflict rules, expiry, deletion, and scope |
| Active recall and retrieval | Query construction, search/index, filtering, ranking, freshness, citations, and relevance/fallback behavior |
| Context and data provenance | Source identifiers, ownership/access filters, transformation history, and whether claims retain supporting evidence |
| Context budget and prioritization | Token counting, truncation policy, recency/relevance priorities, reserved output space, and behavior at limits |

## 3. Model and orchestration

| Checkpoint | Trace in source/config |
| --- | --- |
| Model/provider routing | Provider, model/version, routing/fallback policy, region, environment selection, and version drift |
| Request contract | Parameters, message/tool schemas, structured output, multimodal inputs, token limits, and serialization |
| Provider response handling | Streaming/non-streaming adapters, finish reasons, refusal/error mapping, partial responses, and malformed output |
| Orchestration state machine | Run/turn states, planner/controller transitions, state ownership, concurrency, cancellation, and termination |
| Planning and task decomposition | Plan generation, step limits, dependency ordering, replanning, and validation against user intent |
| Multi-agent handoffs | Worker selection, delegated context, shared state, ownership, result merge, conflict resolution, and cancellation |
| ArCs | Unresolved user-supplied label; preserve as an open question and do not infer a technical meaning |

## 4. Tools and external actions

| Checkpoint | Trace in source |
| --- | --- |
| Tool discovery and registry | Tool definitions, descriptions, registration, schemas, availability, and versioning |
| Tool selection | Planner/model choice, routing conditions, ambiguity handling, and decision traces |
| Tool authorization | User/tenant checks, scopes, policy enforcement, approval gates, and least privilege at execution time |
| Tool argument validation | Schema parsing, semantic constraints, untrusted arguments, defaults, and rejection behavior |
| Tool execution/isolation | Dispatch, process/container boundary, network/filesystem access, timeouts, cancellation, and side effects |
| Tool result interpretation | Parsing, normalization, truncation, errors, provenance, and reinsertion into model context |
| Retries and hidden repair loops | Retry/backoff, self-correction, validation repair, fallback, loop bounds, duplicate side effects, and stop conditions |

## 5. Answer and user-facing delivery

| Checkpoint | Trace in source |
| --- | --- |
| Answer shaping | Synthesis, grounding, citations, uncertainty, refusal/policy paths, and omission of internal reasoning or secrets |
| Output validation | JSON/schema validation, domain constraints, escaping, sanitization, and safe handling of invalid output |
| Streaming and transport | Chunk framing, ordering, reconnect, cancellation, backpressure, API/SSE/WebSocket adaptation, and terminal states |
| Platform rendering | Client state, markdown/UI rendering, code blocks, links, accessibility, escaping, and display transformations |
| Human approval and handoff | Review queues, confirmation state, edit/accept/reject paths, and ensuring approvals bind to the reviewed action |

## 6. Data, operations, and learning

| Checkpoint | Trace in source/config |
| --- | --- |
| Persistence and consistency | Conversation/run/tool records, transaction boundaries, ordering, deduplication, reload behavior, and recovery |
| Memory and feedback writes | User ratings, outcomes, summary updates, prompt/config changes, contamination controls, and deletion propagation |
| Observability and trace correlation | Request/run/step IDs, spans, tool/provider logs, metrics, redaction, retention, and async correlation |
| Evaluation and regression | Unit/contract/integration tests, task-quality evals, adversarial cases, baselines, release gates, and drift checks |
| Resource and reliability limits | Rate limits, concurrency, queueing, budgets, timeouts, backoff, circuit breakers, and exhaustion behavior |
| Configuration and secrets | Environment/config precedence, secret storage/rotation, unsafe defaults, and accidental client/log exposure |
| Deployment and release | Build artifacts, infrastructure/policies, migrations, feature flags, rollout, compatibility, rollback, and environment drift |
| Dependency and supply chain | Model SDKs, tool/runtime packages, lockfiles, generated clients, provenance, and update policy |

## Retained labels from the request

These exact labels are covered above; use the table to retain their original wording in reports: **Conflicting instruction; Instruction bloat; Session history stale; Context injection from previous turns; Long-term memory distillation; Active recall; Tool selection; Tool execution; Tool interpretation; ArCs; Answer shaping; Platform rendering; Hidden repair loops; Persistence.**

Do not mark an absent component as a defect solely because it appears in this checklist. Explain the expected property, affected user journey, source evidence, and failure mode. If code cannot establish deployed configuration or real model behavior, report that as an evidence gap and name the runtime check needed.
