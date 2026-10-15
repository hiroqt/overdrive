# Motion and Interaction Craft

Read this when adding or changing transitions, gestures, animated feedback, or complex controls.

## Give every motion a job

Motion may explain a state change, preserve spatial continuity, show hierarchy, or create one authored moment that fits the visual direction. If removing it does not reduce understanding, feedback, or the intended experience, omit it.

- Keep common actions immediate. Do not delay navigation, keyboard actions, or task completion for choreography.
- Prefer animating properties that do not trigger expensive layout or paint when the platform and effect allow it. Measure complex effects instead of assuming they are cheap.
- Reuse the installed motion library when it provides a real benefit; CSS transitions and the Web Animations API may be enough. Do not add a dependency for a simple transition.
- Make interactions resilient to interruption, repeated input, loading, and reduced-motion preferences.
- Respect `prefers-reduced-motion`; preserve the information and state change while reducing nonessential movement.
- Check pointer, touch, keyboard, and focus behavior. Hover must not be the only way to reveal an action or information.

## Interaction states

For each meaningful control, verify its default, hover (if useful), focus-visible, active, disabled, pending, success, and error behavior as applicable. Use direct feedback: a control should communicate that it was activated, accepted, failed, or is still working. Avoid adding motion to every element to make a surface feel polished.

## Review questions

- Does the movement clarify what changed or where the content went?
- Can users still act while animation is running?
- Does rapid input leave the UI in a correct state?
- Does reduced motion retain usable transitions and status feedback?
- Is the effect performant on a representative lower-powered device?

For current browser support or framework/library APIs, verify the official documentation for the target stack rather than assuming the API is unchanged.
