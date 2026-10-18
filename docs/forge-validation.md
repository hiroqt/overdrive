# Forge — Validation Record

This validation record predates the package rename. Its recorded checks used the previous package ID; no behavioral E2E was rerun under the new ID.

Date: 2026-10-06 (Asia/Manila).

Skill entrypoint SHA-256: `266e22464bce3aef6b57e0e355a4ee9c3353aa3b2c9f50993ed79847f9fbf147`.

## Executed checks

| Check | Result | Evidence and limit |
| --- | --- | --- |
| Bundled skill-creator validator | Pass | Parsed frontmatter and checked required format/scaffold constraints |
| Additional package checks | Pass | YAML parser checked names/limits and Codex UI prompt; all local Markdown resource links resolved |
| Installer discovery | Pass | `npx --yes skills@latest add ./work/github-agents --list` found exactly `forge`; no installation performed |
| Independent document review | No actionable findings | Reviewed handbook, package, README, and consistency with global agreements |
| Metadata-only selection probe | Expected boundaries observed | Six requests separated authoring, installation, frontend implementation, migration review, and ambiguity; this was a simulation, not host automatic discovery |
| Isolated explicit authoring invocation | Pass for the supplied task | Independent worker created a focused API-contract-review package from synthetic OpenAPI conventions, with local reporting and read-only boundaries |
| Generated package checks | Pass | YAML, name/folder agreement, lengths, references, and completed template inspected; fixture’s narrow contract syntax validator ran successfully |

The authoring fixture supplied settled scope, a synthetic OpenAPI 3.1 contract with empty paths, repository conventions, and a read-only syntax checker. Writes were restricted to isolated generated artifacts. Network access, global installation, publication, credential access, and production operations were excluded.

The generated package preserved compatibility review and server/tenant authorization as separate responsibilities, documented evidence gaps, and excluded implementation/deployment/publication. Its artifacts were inspected after the worker returned.

## What remains unmeasured

- Automatic selection by a live Codex host.
- Comparative improvement against a no-skill authoring baseline.
- Performance across other models or agent products; evaluators used inherited session settings rather than a pinned cross-model matrix.
- Live MCP/computer workflows or long-running worker behavior.
- Other planned adversarial, partial-failure, and review-only cases in the evaluation protocol.
- Substantive execution of the newly generated API-contract-review skill: empty paths and no baseline cannot exercise compatibility or authorization changes.

This record establishes structural checks and one explicit authoring exercise. It does not establish broad reliability, security guarantees, or measured performance improvement. Use the [evaluation protocol](../skills/forge/references/evaluation.md) to add evidence from actual use.
