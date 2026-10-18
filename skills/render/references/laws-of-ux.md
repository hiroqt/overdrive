# Laws of UX: concept notes for frontend craft

This guide translates the 30 concepts currently listed on [Laws of UX](https://lawsofux.com/) into practical frontend design prompts. Use it during Render's UX pass: inspect the user's task, select only relevant concepts, turn them into specific interface decisions, and check the result against the task and available evidence.

These concepts are heuristics and descriptions of tendencies. They are not deterministic laws, accessibility standards, or substitutes for usability research. A principle should never override user intent, accessibility, safety, data integrity, or the product's actual requirements. Each section ends with a direct link to its Laws of UX concept page, where examples, origins, and further reading are maintained.

## 1. Aesthetic-Usability Effect

**What it describes:** People can judge an attractive interface as easier to use, even when its underlying usability has not improved. Visual quality also affects trust and willingness to engage.

**How to apply:** Use coherent typography, spacing, hierarchy, and finish to make the interface feel intentional and readable. Evaluate visual impression separately from task completion, comprehension, and error rates. Test the working interface, not only a polished mockup.

**Caution:** Aesthetic polish can conceal confusing flows or defects during review. Do not present style as evidence that the interface works.

**Supporting link:** [Aesthetic-Usability Effect — Laws of UX](https://lawsofux.com/aesthetic-usability-effect/)

## 2. Choice Overload

**What it describes:** A large or poorly differentiated set of options can make choosing harder and reduce confidence.

**How to apply:** Group related options, explain meaningful differences, and provide search, filters, or comparison views when a large catalog must remain available. Surface a recommendation only when its basis is clear.

**Caution:** Do not hide relevant choices, make cancellation difficult, or disguise a commercial preference as a neutral recommendation. Check that reducing visible options improves the whole task rather than adding steps.

**Supporting link:** [Choice Overload — Laws of UX](https://lawsofux.com/choice-overload/)

## 3. Chunking

**What it describes:** People understand and remember information more easily when related details are grouped into meaningful units.

**How to apply:** Break dense content, long forms, and complex settings into labeled groups. Establish hierarchy with headings, spacing, and consistent layout. Keep context visible when a task spans several steps.

**Caution:** Arbitrary sections and excessive accordions can increase effort. Group by user meaning and task flow, not by implementation structure.

**Supporting link:** [Chunking — Laws of UX](https://lawsofux.com/chunking/)

## 4. Cognitive Bias

**What it describes:** Systematic mental shortcuts can influence how people interpret information and make decisions, often without noticing.

**How to apply:** Review interface framing, defaults, ordering, and evidence for ways they may steer a decision. Make important tradeoffs visible and use user research or representative evidence to challenge the design team's assumptions.

**Caution:** Do not exploit bias to pressure users or treat a named bias as proof of how a particular audience will behave. Bias awareness is a prompt for scrutiny, not a predictive model.

**Supporting link:** [Cognitive Bias — Laws of UX](https://lawsofux.com/cognitive-bias/)

## 5. Cognitive Load

**What it describes:** Users have limited mental resources for understanding information and operating an interface. Unnecessary processing competes with the effort required by the task itself.

**How to apply:** Remove irrelevant choices and decoration, use clear labels, show relevant help near the point of use, and keep necessary task context available. Separate complex work into understandable stages when that reduces mental bookkeeping.

**Caution:** The goal is not to hide necessary complexity. Concealing consequences, requirements, or system state can make a screen look simpler while making the task less safe.

**Supporting link:** [Cognitive Load — Laws of UX](https://lawsofux.com/cognitive-load/)

## 6. Doherty Threshold

**What it describes:** Responsive interaction helps people stay engaged and work without unnecessary interruption. The site describes a historical 400 ms benchmark for computer response.

**How to apply:** Return clear feedback quickly after actions. For longer operations, show that work is underway, communicate progress when it can be measured, and allow cancellation or continued work where appropriate. Use optimistic updates only when failures can be handled clearly.

**Caution:** 400 ms is not a universal performance target or an excuse to fake completion. Match performance goals to the task and communicate delays truthfully.

**Supporting link:** [Doherty Threshold — Laws of UX](https://lawsofux.com/doherty-threshold/)

## 7. Fitts's Law

**What it describes:** The time and effort to acquire a target depend in part on its size and distance. Small or distant targets are harder to select accurately.

**How to apply:** Make frequent and consequential controls easy to reach and activate. Provide adequate touch target size and spacing; place actions near the content or decision they affect. Check layouts on actual narrow viewports and input modes.

**Caution:** Target geometry does not replace accessible names, keyboard support, visible focus, or sufficient contrast. Do not assume every person uses a pointer or touch screen.

**Supporting link:** [Fitts's Law — Laws of UX](https://lawsofux.com/fittss-law/)

## 8. Flow

**What it describes:** Flow is focused involvement in an activity, supported by an appropriate challenge and clear feedback about what is happening and what has been accomplished.

**How to apply:** Keep the next step discoverable, give useful feedback, and remove interruptions that do not serve the task. Make advanced capabilities findable without overwhelming users who are focused on a basic task.

**Caution:** Do not confuse engagement with user benefit. Preserve exits, undo, help, and clear control over notifications or repeated prompts.

**Supporting link:** [Flow — Laws of UX](https://lawsofux.com/flow/)

## 9. Goal-Gradient Effect

**What it describes:** Motivation to approach a goal may increase as a person perceives that they are closer to completing it.

**How to apply:** Show accurate progress and remaining work in multi-step tasks when that information helps users plan or finish. Make completion criteria understandable and let users return to unfinished work.

**Caution:** Never invent progress or imply that users are closer to completion than they are. Avoid guilt, coercion, and reward mechanics that conflict with user interests.

**Supporting link:** [Goal-Gradient Effect — Laws of UX](https://lawsofux.com/goal-gradient-effect/)

## 10. Hick's Law

**What it describes:** Decision time tends to increase as the number and complexity of choices increase.

**How to apply:** Clarify the differences among choices, group related options, and split genuinely complex decisions into understandable steps. Highlight a recommended path when it is appropriate and explain why it is recommended.

**Caution:** Removing choices can reduce user control, and splitting one task into many steps can add friction. Evaluate the complete journey and retain access to meaningful options.

**Supporting link:** [Hick's Law — Laws of UX](https://lawsofux.com/hicks-law/)

## 11. Jakob's Law

**What it describes:** People bring expectations from other products and sites they have already used.

**How to apply:** Use familiar conventions for common interactions when those conventions fit users' expectations, such as recognizable navigation, form behavior, and feedback. If an interaction differs, make the new behavior clear and learnable.

**Caution:** Familiarity is not a reason to copy harmful, inaccessible, or unsuitable conventions. Check the expectations of this product's audience rather than assuming one universal mental model.

**Supporting link:** [Jakob's Law — Laws of UX](https://lawsofux.com/jakobs-law/)

## 12. Law of Common Region

**What it describes:** Elements inside a clearly bounded visual area tend to be perceived as a group.

**How to apply:** Use a shared background, border, or container to connect content that belongs together, such as a form section or a card's title, details, and action. Ensure the grouping remains understandable in responsive layouts and at zoom.

**Caution:** A border can imply a relationship that does not exist. Too many nested surfaces make hierarchy harder to scan; use grouping only when it expresses real structure.

**Supporting link:** [Law of Common Region — Laws of UX](https://lawsofux.com/law-of-common-region/)

## 13. Law of Proximity

**What it describes:** Items placed close together are more likely to be perceived as related.

**How to apply:** Keep labels close to their fields, errors close to the inputs they explain, and related values together. Use spacing to distinguish separate groups. Recheck visual grouping after content reflows on narrow screens.

**Caution:** Proximity alone may not communicate relationships to assistive technology or survive zoom and responsive rearrangement. Pair visual layout with semantic markup and clear labels.

**Supporting link:** [Law of Proximity — Laws of UX](https://lawsofux.com/law-of-proximity/)

## 14. Law of Prägnanz

**What it describes:** When a visual pattern is ambiguous or complex, people tend to interpret it as a simpler, more regular form.

**How to apply:** Prefer clear shapes, predictable hierarchy, and a readable structure. Reduce visual noise so users can understand the information pattern without decoding decoration.

**Caution:** Simplicity can erase meaningful differences or create ambiguous icons and diagrams. Preserve the distinctions users need to make accurate decisions.

**Supporting link:** [Law of Prägnanz — Laws of UX](https://lawsofux.com/law-of-pr%C3%A4gnanz/)

## 15. Law of Similarity

**What it describes:** Elements that look alike tend to be perceived as related or as sharing a role.

**How to apply:** Keep controls with the same purpose visually consistent. Make different states or behaviors distinguishable, and align repeated patterns across routes.

**Caution:** Similar appearance can imply identical behavior where none exists. Never make color, shape, or styling the only way to communicate meaning; add labels, semantics, and state cues.

**Supporting link:** [Law of Similarity — Laws of UX](https://lawsofux.com/law-of-similarity/)

## 16. Law of Uniform Connectedness

**What it describes:** Elements that are visually connected are perceived as more related than elements with no visible connection. Connection may be shown with a line, shared surface, or continuous visual treatment.

**How to apply:** Use a clear connector when users need to understand a relationship or sequence, such as a stepper, a timeline, a chart annotation, or a control linked to its resulting content. Keep the connection consistent across states and screen sizes.

**Caution:** A decorative line or surface can suggest a false relationship. Visual connection does not establish an accessible programmatic relationship; use semantic structure, text, and accessible names as needed.

**Supporting link:** [Law of Uniform Connectedness — Laws of UX](https://lawsofux.com/law-of-uniform-connectedness/)

## 17. Mental Model

**What it describes:** People build an internal working understanding of how a system behaves and use it to predict what will happen next.

**How to apply:** Match common expectations when they fit the product, label actions by their outcomes, and provide feedback that confirms what the system did. Explain unfamiliar behavior at the point where it matters.

**Caution:** A team's assumptions are not user research. Mental models differ across experience, culture, abilities, and context; investigate when a mismatch would make the task confusing or risky.

**Supporting link:** [Mental Model — Laws of UX](https://lawsofux.com/mental-model/)

## 18. Miller's Law

**What it describes:** The site presents the familiar idea that working memory can hold a limited amount of information at once and connects this concept with chunking.

**How to apply:** Organize content into meaningful groups and reduce the need to remember details across screens. Use comparisons, summaries, and visible context where they help users complete a task.

**Caution:** Do not use the popular "7 ± 2" phrase as a fixed capacity for every user or as a rule limiting navigation, options, or list length. Memory varies by information, person, and situation.

**Supporting link:** [Miller's Law — Laws of UX](https://lawsofux.com/millers-law/)

## 19. Occam's Razor

**What it describes:** When explanations fit equally well, prefer the one that requires fewer assumptions. In design, it encourages removing unnecessary complexity.

**How to apply:** Question every element: does it help the user understand, decide, or act? Remove redundant controls and visual noise while preserving the function and information required by the task.

**Caution:** The simplest-looking interface is not automatically the easiest to use. Do not hide complexity users need to understand or remove capabilities required by different user needs.

**Supporting link:** [Occam's Razor — Laws of UX](https://lawsofux.com/occams-razor/)

## 20. Paradox of the Active User

**What it describes:** Users often start using a product to achieve an immediate goal instead of reading a manual first, even when early exploration leads to mistakes.

**How to apply:** Make first actions understandable and provide contextual hints, examples, and recovery when users need them. Keep documentation and deeper guidance findable without requiring it before basic use.

**Caution:** Do not remove onboarding or documentation when users need it for safety, complexity, or infrequent tasks. Contextual help should not interrupt or obscure the task.

**Supporting link:** [Paradox of the Active User — Laws of UX](https://lawsofux.com/paradox-of-the-active-user/)

## 21. Pareto Principle

**What it describes:** In many systems, effects are unevenly distributed; the site uses the common shorthand that a smaller share of causes can account for a larger share of effects.

**How to apply:** Use product analytics, support patterns, or research to identify high-impact tasks and fix the biggest sources of user friction first. Keep critical and accessibility needs in scope even when they are less frequent.

**Caution:** Do not assume an 80/20 split without measuring it. Frequency alone does not determine importance, harm, or who should be served.

**Supporting link:** [Pareto Principle — Laws of UX](https://lawsofux.com/pareto-principle/)

## 22. Parkinson's Law

**What it describes:** A task can expand to consume the time available for it. In interface design, unnecessary steps and delays can make tasks feel longer.

**How to apply:** Remove repeated entry and avoidable waiting. Use autofill, saved preferences, and sensible defaults when they are safe and users can review or change them.

**Caution:** Faster is not always better. Preserve time for careful review, informed consent, accurate data entry, and reversibility where those matter.

**Supporting link:** [Parkinson's Law — Laws of UX](https://lawsofux.com/parkinsons-law/)

## 23. Peak-End Rule

**What it describes:** People may remember an experience especially through its most intense moment and its ending, rather than averaging every moment.

**How to apply:** Identify moments of uncertainty, stress, value, or success. Make important transitions and completion states clear, helpful, and emotionally appropriate; communicate failures and recovery with care.

**Caution:** A polished confirmation cannot compensate for a poor or harmful journey. Do not prioritize a delightful ending over fixing systemic friction.

**Supporting link:** [Peak-End Rule — Laws of UX](https://lawsofux.com/peak-end-rule/)

## 24. Postel's Law

**What it describes:** The original robustness principle calls for tolerant input handling and precise output. In UX, this suggests accommodating reasonable variation while responding clearly.

**How to apply:** Accept harmless formatting variations when meaning remains unambiguous, such as whitespace or common phone-number separators. Validate at the appropriate boundary and explain how to correct invalid input.

**Caution:** Do not silently reinterpret ambiguous input, discard user data, or weaken security and server-side validation. User-friendly input handling must retain explicit constraints and truthful feedback.

**Supporting link:** [Postel's Law — Laws of UX](https://lawsofux.com/postels-law/)

## 25. Selective Attention

**What it describes:** People focus on a subset of available information, often the information relevant to their current goal, and may overlook competing signals.

**How to apply:** Establish a clear hierarchy around the primary task. Make important changes noticeable with appropriate feedback, and avoid competing animation or interruptions.

**Caution:** Users can miss notices that resemble ads or sit in expected ad locations. Do not rely on attention alone for critical information; make it findable, perceivable, and available in the right context.

**Supporting link:** [Selective Attention — Laws of UX](https://lawsofux.com/selective-attention/)

## 26. Serial Position Effect

**What it describes:** People may recall the first and last items in a series more readily than items in the middle.

**How to apply:** Make high-priority actions and information easy to locate. Use clear labels, meaningful order, and appropriate placement in navigation or lists.

**Caution:** Do not bury important content in the middle based on a memory heuristic. Task relevance, readable labels, keyboard order, and assistive technology behavior matter more than a positional trick.

**Supporting link:** [Serial Position Effect — Laws of UX](https://lawsofux.com/serial-position-effect/)

## 27. Tesler's Law

**What it describes:** Some complexity is inherent to a system or task; it cannot simply be removed, only shifted between the system and the user.

**How to apply:** Let the system handle repetitive mechanics where safe, and present meaningful decisions in language users can understand. Design guidance into the workflow and expose detail when it is needed.

**Caution:** Automation can obscure consequential decisions or remove user control. Do not optimize for fewer visible steps at the cost of transparency or recovery.

**Supporting link:** [Tesler's Law — Laws of UX](https://lawsofux.com/teslers-law/)

## 28. Von Restorff Effect

**What it describes:** Among similar items, a distinctive item may be more likely to attract attention and be remembered.

**How to apply:** Use visual emphasis sparingly for the primary action, a meaningful status, or a genuinely important difference. Pair emphasis with clear text and interaction semantics.

**Caution:** When too many elements stand out, none does. Do not rely on color or motion alone, and consider low vision, color vision, and motion sensitivity.

**Supporting link:** [Von Restorff Effect — Laws of UX](https://lawsofux.com/von-restorff-effect/)

## 29. Working Memory

**What it describes:** Working memory temporarily holds and manipulates information needed to complete an activity; it is limited and affected by context.

**How to apply:** Keep needed values, choices, and progress visible or recoverable across steps. Prefer recognition over recall with clear state, breadcrumbs, comparison views, and summaries where useful.

**Caution:** Do not persist sensitive information without a clear need and appropriate user control. Persistent context should reduce effort without cluttering the interface.

**Supporting link:** [Working Memory — Laws of UX](https://lawsofux.com/working-memory/)

## 30. Zeigarnik Effect

**What it describes:** Unfinished or interrupted tasks may be remembered more readily than completed ones.

**How to apply:** For work that can be resumed, show accurate completion state, what remains, and a clear way to continue. Save progress when appropriate and explain what will be retained.

**Caution:** Never fabricate progress or use unfinished tasks to create guilt or pressure. Let users dismiss reminders and control saved work where appropriate.

**Supporting link:** [Zeigarnik Effect — Laws of UX](https://lawsofux.com/zeigarnik-effect/)

## Apply the concepts in Render

For each frontend task:

1. Identify the user goal, context, and observed friction before selecting a concept.
2. Choose the few concepts that directly inform the task. Record each as a concrete design choice, such as grouping related fields, increasing a frequent control's hit area, or showing truthful progress.
3. Check the counter-risk in the relevant section. A heuristic can help one task while hurting another.
4. Inspect or test the interface in its real states and relevant input modes. Validate consequential choices with users or product evidence when available.
5. In the handoff, state which concepts informed the work and what evidence supports the result. If none materially applied, say so briefly rather than forcing a principle.

## Source and scope

The concept inventory is based on the English [Laws of UX homepage](https://lawsofux.com/), checked 2026-10-16. Each supporting link leads to its concept page, which maintains the original explanation, examples, origins, and further-reading links. This guide paraphrases the concepts for frontend practice; it does not reproduce the site's prose or illustrations.
