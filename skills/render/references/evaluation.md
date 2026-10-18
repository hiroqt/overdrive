# Render Evaluation

## Evaluation summary

- **[D] Deterministic —** Run repository tests, static HTML inspection, and available accessibility/build checks against fixed fixtures; record pass/fail and duration where available. These checks cover coded rules only, not visual usability, full accessibility, or field performance.
- **[J] LLM as a judge —** Grade saved implementation/screenshots and evidence against task fit, design-system consistency, interaction states, accessibility/responsive evidence, and truthful claims. Record judge model/settings and pass/fail/partial/not-run; visual model grading is subjective.
- **[H] Human —** Inspect rendered pages at supported viewport/device sizes and review keyboard, reduced-motion, and task usability where applicable. Record reviewer, environment, observations, and disposition; do not claim browser/device checks unless performed.

Effectiveness and accuracy require task and rendered evidence; speed requires measured timings. Cases below are proposed until run.

Read this when checking that the skill is selected for relevant tasks and that its working preferences improve the delivered interface.

## Selection cases

| Request | Expected routing |
| --- | --- |
| New marketing page or public website | Select Render |
| Dashboard visual refinement | Select Render, emphasize operational clarity and responsive/accessibility checks |
| Backend-only API work | Do not select |
| Pure SEO audit with no UI change | Route to SEO capability; this skill may assist only if rendering/metadata implementation is requested |
| Native Flutter screen | Do not force web patterns; use native UI capability |

## Execution cases

| Case | Expected evidence |
| --- | --- |
| Existing branded product refinement | Existing design tokens/components and behavior are preserved; change fixes named issues |
| Existing design is coherent and product-fit | Whole-codebase review is evidenced; user is offered continue/refine versus explore-new choice before dependent design work |
| Existing design has clear generic AI-template patterns | Evidence is cited; targeted requested improvements proceed without unnecessary direction-choice friction |
| Review covers only one route | Skill discloses the partial scope and does not claim the whole existing design is AI-slop-free |
| New page with sparse brief | Concise design direction fits user/task; no invented product claims or fake proof |
| Generic-looking screen | Critique calls out specific repeated patterns and chooses context-fit changes, not a new fixed template |
| Feature grid with generic icons | Icons map to actual product actions or concepts; decorative repetition and unsupported generic claims are removed without banning useful familiar symbols |
| Routine dashboard interaction | Motion is purposeful and reduced-motion/keyboard behavior remains usable |
| Public page launch request | Route metadata, accessibility, responsive rendering, and performance checks use available tools; evidence boundaries are explicit |
| Private application route | Public SEO checklist is not blindly applied; indexing behavior remains intentional |
| Static HTML inspector | Valid markup is clean; representative missing metadata and accessible-name fixtures produce documented severities and exit codes |
| Existing framework lacks static HTML output | Use framework/browser tooling; do not force static export just to run the inspector |

## Personalization checks

- Does the interface fit the actual product, users, and content rather than follow a reusable AI-looking template?
- Was the codebase-level design review broad enough to justify the design-choice prompt or the decision to proceed directly?
- When a sound existing system was found, was the user offered a clear continue/refine or explore-new choice?
- Are icons, motion, cards, and decoration helping people understand or act?
- Were existing brand choices and working product behavior preserved unless the brief required a change?
- Are claims about accessibility, SEO, responsiveness, and performance tied to checks that actually ran?
- If WCAG 2.0 was requested, were applicable Level A and AA criteria evaluated across relevant flows and states, with version and coverage stated accurately?
- Did the report distinguish code checks, browser observations, field data, and unknowns?

Automatic discovery and cross-model consistency remain unmeasured. Explicitly invoking this skill does not prove automatic selection.
