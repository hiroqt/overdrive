# Guard threat review guide

Use these checks after mapping the repository's actual entrypoints, trust boundaries, and controls. Skip irrelevant families with a short reason; absence of evidence is not proof of safety.

## Eight threat families

| Threat | Inspect | Strong evidence of a problem |
| --- | --- | --- |
| 1. Protections disappear during error repair | Compare the current diff or proposed fix with the prior behavior. Trace TLS verification, CORS, authentication/authorization middleware, input validation, error handling, rate limits, and infrastructure rules. | A security control was removed, made permissive, or replaced by a catch-all that hides failures to make a bug disappear. TLS verification is disabled; CORS is treated as access control; errors fail open. |
| 2. Broken access control | Trace identity from authentication to server-side authorization for every read/write. Check object ownership, tenant scope, role/action policies, nested resources, background jobs, and direct API calls. | A user can access another user's record by changing an ID, changing a role claim, or calling an endpoint directly. Authentication is mistaken for permission. |
| 3. Hard-coded or exposed secrets | On every generation/repair pass, run an available regex and entropy-based scanner over the proposed diff/output. For an audit, inspect relevant diffs, frontend source/bundles, build-time variables, config, logs, and tracked files. Report when no scanner is available; never echo matches. | A live credential or privileged key is committed, bundled into frontend output, or logged. Public client identifiers are not automatically secrets; verify privilege and exposure. |
| 4. Hallucinated, typosquatted, or malicious dependencies | Check exact names and versions against the authoritative registry and upstream repository; inspect publisher identity, provenance/signatures where available, release history, lockfile integrity, and known advisories. | Name confusion, unexpected publisher/source, unexplained install scripts, suspicious recent ownership/version changes, or unresolved advisory. Low popularity or recent registration alone is only a signal. |
| 5. Uncontrolled infrastructure or shadow deployment | Inspect IaC, Kubernetes manifests, workflows, cloud policies, container images, and deployment scripts. Trace who can deploy, where, and with which identity. | Unreviewed public exposure, wildcard privileges, long-lived credentials, unpinned images/actions, secrets in manifests, or a workflow that deploys outside the approved environment. |
| 6. Business-logic gaps | Read the product's stated workflow, domain rules, adjacent handlers, and tests. Trace state transitions and invariants across multiple requests, not just input shape. | Individually valid requests can violate ownership, payment/order/state transitions, limits, or required sequencing because no server-side invariant enforces them. Ask for missing business rules instead of inventing them. |
| 7. Direct frontend-to-AI endpoint abuse | Trace browser/mobile calls to model providers and internal AI routes. Inspect key placement, authentication, quotas, rate/concurrency limits, input size, tool permissions, output handling, and spend limits. | A privileged provider key ships to clients, a costly endpoint is unauthenticated/unbounded, or model/tool access bypasses server authorization. Prefer a server-side gateway with per-user limits and safe error handling. |
| 8. Missing traceability and security verification | Inspect ownership, meaningful security events, CI checks, dependency/secret/IaC scans, test coverage for denied access, review gates, and deployment records. Ensure logs avoid secrets and unnecessary personal data. | Security-sensitive changes have no attributable review/check evidence, critical access denials are unobservable, or deploys cannot be traced to an approved revision. Missing a particular tool is a gap to report, not proof of exploitable code. |

## Risk levels

- **High:** credible unauthenticated or cross-tenant access, privilege escalation, secret exposure with meaningful privileges, disabled core transport/security enforcement, or an externally reachable high-impact path with no effective limit. State exploit conditions and likely blast radius. Escalate first.
- **Medium:** a bounded weakness requiring meaningful prerequisites, incomplete defense-in-depth, or a security control whose failure has limited reach. State the prerequisite and affected scope.
- **Low:** hardening, maintainability, or audit gaps with no demonstrated direct exploit path; or a weak signal needing confirmation. Do not present speculative package reputation or absent tooling as a confirmed vulnerability.

Severity depends on reachability, required privileges, exploit complexity, data sensitivity, and impact. Use the repository's established severity model when it exists and map findings to it. Keep confidence separate from severity.

## Safe handling patterns

- **Temporary test access:** use local-only mock identity or seeded synthetic users while retaining the same authentication middleware and server-side object authorization. Add an explicit environment guard and tests that prove the mode cannot be enabled in production. Do not skip login or return all records.
- **Errors:** return a safe, useful response while retaining validation, cleanup, and failure telemetry. Do not swallow exceptions or loosen TLS/CORS/security policy as a repair shortcut.
- **Secrets:** report file and secret type, redact the value, and avoid copying it into reports. Rotation and history rewriting are separate, approval-gated operations.
- **Dependencies:** do not install a package just to check it. Use registry metadata and source review; report unavailable data and avoid invented download/age cutoffs.
- **AI routes:** enforce user/resource authorization, request validation, bounded payloads, rate/concurrency and spend limits server-side. CORS alone does not stop non-browser callers.
- **Audit trail:** record security-relevant actor, action, target, outcome, and correlation/revision where appropriate; minimize or redact sensitive payloads.
