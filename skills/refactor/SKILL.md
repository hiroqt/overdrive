---
name: refactor
description: >-
  Inspect and progressively improve an existing codebase's structure,
  readability, and maintainability across its detected languages and frameworks.
  Use for repository organization, module/component boundaries, architecture
  cleanup, and safe internal refactoring. Requires confirmation before API
  restructuring and protects sensitive files from changes.
---

# Refactor

## Outcome and scope

Make a codebase easier for another developer to understand and change through small, evidence-based structural improvements that preserve existing behavior and contracts. Reassess the current repository on each invocation, choose the next valuable bounded improvement, and leave a clear record of what changed and why.

This skill owns maintainability diagnosis and internal structure. Use the repository's existing implementation and conventions. For behavior-changing implementation, follow the available spec-first/TDD workflow. For retrieval, tool-output, or context optimization, use the token-efficiency workflow. Do not create background jobs or imply that the codebase will improve without a future invocation.

## Inputs and inspection

1. Identify the repository, branch, dirty and ignored files, applicable instructions, and existing architecture or codebase map. Read only the relevant source and caller paths; verify maps against the current checkout.
2. Inspect manifests, module boundaries, naming, dependency direction, tests, and established patterns before proposing a new structure. Search for callers and public entrypoints before moving or changing code.
3. Establish the current behavior and available checks before editing. Prefer existing tests, types, lint rules, and build commands; derive exact commands from repository documentation and manifests.
4. Protect the user's in-progress work. Do not overwrite unrelated changes or count ignored/local files as disposable merely because Git omits them.

## Dynamic codebase structure assessment

Discover the current repository on every invocation; never assume the stack from the user's profile, a previous task, or a top-level README alone. Triangulate manifests and lockfiles, build/project files, source extensions, imports, entrypoints, and repository documentation. Use those signals to identify languages, frameworks, versions, generated code, and subsystem boundaries. State confidence when signals disagree or a dependency cannot be verified. In a monorepo, inventory each app, library, service, and tooling area separately, then map cross-package dependencies; do not label the whole repository with a single stack.

Map the structures that are actually present, from entrypoints to consumers. A useful inventory normally covers relevant examples from these categories, adapted to the stack and task:

- **Composition and routing:** application startup, composition roots, dependency injection, routes, commands, event handlers, plugin registration, and build targets.
- **User-facing or domain components:** pages, UI components, controllers, handlers, jobs, actors, domain objects, aggregates, and state owners.
- **Reusable contracts:** props, schemas, DTOs, records, structs, enums, interfaces, traits, protocols, generics, exported symbols, and serialization boundaries.
- **Logic and collaboration:** hooks, state/context, services/use cases, repositories, stores, adapters, clients, middleware, and their call/ownership direction.
- **Helpers and cross-cutting code:** pure functions, utilities, extensions, decorators, macros, shared modules, validation, formatting, error handling, and duplicated logic.
- **Verification and generated boundaries:** unit/integration/component tests, fixtures, code generators, generated/vendor/build outputs, and the source that owns generated behavior.

For each important node, record its path and symbol, responsibility, who calls/renders/constructs/implements it, and what it depends on. Follow imports, registrations, constructor injection, props, function calls, trait/interface implementations, and tests as appropriate; do not infer dependency direction from directory names alone. Describe omissions only when checked. Keep the map proportional to the requested change; do not scan every file for an exhaustive catalog.

Use the repository's own vocabulary. Examples include:

- **React / TypeScript:** app and route entrypoints, pages and components, props, hooks and state/context, data clients or services, types, utilities, and component tests.
- **C#:** projects and namespaces, composition root and dependency injection, controllers/endpoints, application services, domain types, interfaces, repositories, extension methods, middleware, background workers, and tests.
- **Rust:** workspace and crates, `mod` tree and visibility, structs/enums/traits/`impl` blocks, services and adapters, helper functions, features/build scripts, and unit/integration tests.
- **Python:** packages and modules, command/app entrypoints, classes/functions/protocols, routers, services/repositories, decorators, helpers, and tests.

These are examples, not required layers. Adapt to the stack found, the project's conventions, and the task. For unfamiliar languages, inspect the actual module/import/type system and use available compiler, language-server, AST, symbol-search, or repository tools; if none are available, trace definitions and callers with targeted source searches. Distinguish handwritten code from generated, vendored, build, and fixture content before evaluating it.

Look beyond HTTP APIs: assess UI composition and state, package/module ownership, domain and data boundaries, dependencies, helper/extension placement, duplicated logic, cycles, unclear ownership, and test seams where those apply. Treat file length, abstraction count, and familiar architecture patterns as prompts to investigate, not defects by themselves. A helper or component is not inherently misplaced because of its name or language.

Use the inventory to choose a concrete improvement tied to a maintenance problem. When reporting, name each detected stack, the affected components/modules/helpers, their responsibility and relationship, the evidence for friction, and why the proposed change improves that relationship. For a no-edit assessment, provide the same evidence-backed map and rank findings without presenting a speculative redesign as implemented.

## Progressive improvement workflow

1. List specific structural problems with evidence from the stack-aware assessment: affected files/symbols/components, the maintenance cost, and any relevant dependency or behavior risk. Avoid subjective cleanup and style-only churn.
2. Select one small, high-value improvement that can be reviewed independently. State the intended structure and observable acceptance checks; batch only tightly coupled edits.
3. Before implementation, classify the change:
   - **Internal refactor:** preserve externally observable behavior and existing public interfaces; proceed within the user's task scope.
   - **API or contract restructuring:** stop before editing the API surface and ask the user to confirm the concrete proposal and compatibility impact (see gate below).
   - **Sensitive-file action:** never perform it (see protection below); ask first if the improvement cannot be completed without a protected change.
4. Make the smallest complete change using existing layers and dependencies. Prefer clarifying boundaries and ownership over adding abstractions, wrappers, or frameworks.
5. Run relevant checks and inspect the final diff. Confirm the structure is clearer, behavior and contracts remain intact where required, and no protected or unrelated files changed.
6. Report the evidence, commands and results, remaining structural findings, and the next useful improvement. On future invocations, inspect the then-current repository again rather than assuming prior recommendations remain valid.

## API confirmation gate

An API includes HTTP routes and payloads, RPC or event contracts, database schemas used as interfaces, exported library symbols, command-line flags, plugin hooks, and other interfaces used outside the implementation module.

When an API is unclear or poorly structured, document the concrete problem and propose the smallest correction. Before changing, renaming, removing, regrouping, or migrating any API surface, ask the user for explicit confirmation. Include affected consumers, compatibility or migration effects, and the planned validation. Continue only after confirmation. Tests passing, apparent internal ownership, or a belief that the change is harmless do not count as confirmation. If it's uncertain whether a surface is public, treat it as an API and ask.

Internal refactors may proceed when evidence shows the API and observable behavior remain unchanged. If that guarantee becomes uncertain, pause and request confirmation before the API-affecting edit.

## Sensitive-file protection

- Never delete, rename, move, overwrite, rewrite, or expose sensitive files. This includes `.env` and `.env.*`, credential or token stores, private keys, certificates, auth/session stores, secret configuration, and files containing personal, customer, or production data.
- Do not read or print secret values. If configuration structure matters, inspect only filenames and, when safe and necessary, key names or redacted examples; never copy values into output, logs, diffs, or reports.
- Do not use broad formatters, generators, cleanup commands, or moves that could modify protected files. Scope commands to known source paths and inspect their planned file set first.
- If a proposed improvement appears to require touching protected files, stop, explain why, and request explicit confirmation with the exact files and action. Confirmation does not override higher-priority policy or tool restrictions. Continue with a safe alternative where possible.

## Decision rules and verification

- Keep data, error handling, validation, permissions, and compatibility behavior intact during structure-only changes.
- For behavior changes, define acceptance first and use test-first development when the repository supports it. Do not describe a behavior change as a pure refactor.
- Do not delete code or files as generic cleanup. Establish ownership, usage, and impact first; request approval for destructive changes under applicable policy.
- If checks are missing, run the strongest existing relevant checks and state the coverage gap. Do not invent commands, claim unrun checks, or equate a passing build with maintainability.
- Update an existing architecture/codebase map only when the change materially affects navigation or structure; verify links and claims against source. Avoid duplicate architecture documents and no-op updates.
- Stop if the scope expands, a check reveals unrelated breakage, or an API/sensitive-file boundary is reached. Report the concrete blocker and a reversible next step.

## Definition of done and reporting

Done means a bounded maintainability improvement is present; the relevant behavior and API boundaries were reviewed; protected files and unrelated work remain untouched; applicable checks ran with honest results; and the report names the improved structure and any remaining risks. If no safe, worthwhile improvement is evident, provide the evidence-based findings and a prioritized proposal without making cosmetic edits.

Keep updates concise and technical. Include changed paths, reason, checks actually run, confirmation gates encountered, and the next recommended improvement. Do not claim automatic discovery, ongoing background maintenance, or measured maintainability gains without evidence.

For controlled behavior evaluation, use the [evaluation guide](references/evaluation.md); its cases are proposals until executed.
