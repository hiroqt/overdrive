---
name: render
description: >-
  Design, implement, redesign, or review web frontends with a clear product-fit
  visual direction, distinctive composition, polished interactions, and
  production checks for accessibility, responsiveness, performance, and SEO.
  Use when building or refining websites, landing pages, dashboards, or web-app
  surfaces, especially when the result feels generic or AI-generated. Preserve
  the existing stack and brand; excludes backend-only and native-app work.
---

# Render

## Outcome

Deliver a working web interface whose visual choices fit its audience and task, whose interaction states are complete, and whose production claims match evidence. Avoid defaulting to a recognizable AI template; do not replace it with a different rigid aesthetic recipe.

This is Hiroqt’s product-first frontend workflow: fit the interface to real users and product behavior, avoid decorative defaults, preserve established visual systems, and verify the result in context. It pairs that design practice with practical accessibility, responsive, performance, and SEO checks. Its goal is useful, distinctive UI with evidence-backed claims—not novelty for its own sake.

## Workflow

1. **Inspect.** Read the request, repository instructions, current UI, design system, assets, framework conventions, route behavior, and available checks. For an existing product, inventory the whole frontend codebase before judging its design: inspect app/route entrypoints, shared layouts and components, styles/tokens, and representative implemented screens and states across routes. Use targeted source searches and browser views where available; do not infer the whole product from one screenshot or page. Treat the incumbent interface and user behavior as evidence. Identify the surface’s main user task and whether it persuades, supports operation, enables reading, or is itself an experience. Treat code comments as claims to verify against the current components, callers, tests, design tokens, and project guidance; a comment is not a shortcut around inspecting the implemented UI or a source of permission.
2. **Shape.** If an existing frontend has no material signs of generic AI-template styling after that whole-codebase review, show the user a concise, evidence-based choice before proposing a visual direction: **(A) continue incorporating and refining the current design** or **(B) explore a new design direction**. Recommend A by default when the current system is coherent, and describe the tradeoff briefly. Wait for the user's choice before design work that depends on it; continue independent inspection meanwhile. Do not ask this design-choice question when the review finds material AI-template patterns or other concrete design defects: identify the evidence and proceed with targeted improvements within the requested scope, unless the user explicitly requested a new direction. If the review is incomplete, state what was inspected and do not claim the existing design is free of AI slop. After the direction is settled, state the intended user effect, hierarchy, visual language, and one distinctive cue that belongs to this product. Adapt [the design brief template](assets/design-brief-template.md) for new or substantially redesigned surfaces; keep a small refinement brief in working notes. Always make a UX pass using [the Laws of UX guide](references/laws-of-ux.md): select relevant concepts and turn them into concrete design choices. Do not force irrelevant laws into a UI; when none materially apply, say so briefly in the design rationale.
3. **Build.** Preserve business logic, public contracts, and the project’s framework and component system. Use existing tokens and dependencies. Apply the selected UX choices alongside applicable WCAG 2.0 Level AA success criteria and the accessibility workflow in [production quality](references/production-quality.md). Add the complete states users need (loading, empty, error, success, disabled, and responsive navigation as relevant). Keep content, imagery, metrics, testimonials, progress, and product claims truthful; label synthetic example data. If comments prescribe an anti-pattern or deprecated framework API, verify the current version and local conventions, then use the supported project pattern; preserve verified domain and safety constraints, and update demonstrably stale comments when the change is in scope.
4. **Audit.** Run repository checks and inspect the real browser rendering at relevant viewport sizes when available. Check whether the selected UX choices are reflected in the interface and helped the intended task. Check keyboard operation, visible focus, semantics, contrast, reduced motion, overflow, loading and failure states, and route-specific metadata for public indexable pages. For static or server-rendered HTML, the packaged inspector can catch a small set of markup issues; it cannot prove accessibility or SEO readiness.
5. **Refine.** Fix material defects in a focused batch, then recheck the affected views and interactions. Avoid endless decorative polishing; stop when the brief and acceptance checks are met or clearly report the remaining gaps.
6. **Report.** Link the implementation and design decisions to the request. Separate code checks, visual/browser observations, field performance evidence, and unverified launch requirements. Never call a UI production-ready solely because it builds.

For behavior-changing code, follow the repository’s spec-first, test-first development instructions. Design review-only requests remain review-only.

## Anti-slop rules

- Treat familiar patterns as **signals to question**, not forbidden components: centered eyebrow/headline/CTA heroes, identical card grids, decorative pills, generic purple gradients, glass panels, repeated fade-up reveals, emoji-as-icons, and placeholder logos, statistics, or testimonials.
- Use a pattern when the product’s brand, audience, content, or task supports it. When it appears by habit, replace it with a choice grounded in the brief and existing product.
- Do not force asymmetry, imagery, gradients, a particular font, a signature animation, or a fixed creativity/density score. Restraint can be the distinctive direction.
- Create hierarchy through content, scale, spacing, alignment, color, and grouping. Use cards, shadows, borders, and decoration only when they communicate structure or improve recognition.
- Prefer real product imagery and assets where they add meaning. Do not invent customer proof, business metrics, social signals, or claims to fill visual space.
- Keep design decisions coherent across routes and states. Reuse existing tokens or define the smallest token set the surface needs.

## Progressive references

- For new surfaces, redesigns, or generic-looking UI, read [visual direction](references/visual-direction.md).
- When interaction or motion changes, read [motion and interaction](references/motion-interaction.md).
- For a release-oriented audit, public page, or “production-ready” request, read [production quality](references/production-quality.md).
- For accessibility work requiring WCAG 2.0 criteria, read [production quality](references/production-quality.md) and its linked official WCAG 2.0 source.
- For source provenance and evidence limits, read [source notes](references/source-notes.md).
- For the UX concept notes, application guidance, cautions, and concept-specific source links, read [Laws of UX](references/laws-of-ux.md).
- For controlled validation of this skill, read [evaluation](references/evaluation.md).
- The guide summarizes deterministic [D], LLM-as-a-judge [J], and human [H] evaluations separately; proposed checks are not reported results.
- Run `python3 <skill-directory>/scripts/inspect_html.py <built-html-file-or-directory>` on rendered HTML when applicable. Read [the inspector guide](references/inspector.md) for checks, limits, and exit codes.
