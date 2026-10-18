# Production UI Quality Gates

Read this when a request includes production readiness, a public launch, accessibility, SEO, performance, or responsive audit.

## Accessibility

- Use native HTML semantics and controls first. Associate labels and instructions with fields; expose names, roles, values, errors, and status updates to assistive technology.
- Use [WCAG 2.0](https://www.w3.org/TR/WCAG20/) as the normative reference when the project, contract, or user explicitly requires WCAG 2.0. Otherwise follow the currently applicable WCAG version for the project. Do not label a WCAG 2.0 review as WCAG 2.2 (or vice versa).
- For a WCAG 2.0 Level AA review, assess all applicable Level A and AA success criteria across the complete page flows and states, not just the changed component. In particular verify text alternatives, captions where media requires them, semantic structure and relationships, keyboard access and visible focus, sufficient text/non-text contrast, resize/text-spacing/reflow behavior, understandable labels and errors, predictable navigation, accessible name/role/value and status messages, and error identification/suggestions. Use the official normative criteria and techniques; this summary is a navigation aid, not a substitute for the full standard.
- Verify logical keyboard order, visible focus, keyboard operation, contrast, zoom/reflow, and non-color status cues.
- Automated checks cover only a subset; manually review keyboard paths and screen-reader output where supported. Record criteria checked, pages/states, tools, results, and exceptions; do not claim WCAG conformance from a scanner or partial sample.
- Test motion alternatives under `prefers-reduced-motion`. Do not remove useful state feedback as a shortcut.
- Use meaningful alternative text for informative images and empty `alt` for decorative images.

## Responsive behavior

- Check the actual design at the repository’s supported breakpoints and a narrow viewport; do not assume one desktop and one phone width cover every layout.
- Verify no horizontal overflow, clipped controls, broken sticky elements, inaccessible menus, or content hidden behind safe areas/overlays.
- Ensure long text, localization, validation errors, zoom, and realistic content density do not break layout.
- Use the project’s responsive test/browser tooling when available. CSS source inspection alone does not prove layout behavior.

## SEO for public, indexable routes

- Confirm the route is intended to be indexed before adding SEO. Private, authenticated, staging, and utility routes may correctly be excluded.
- Verify unique, accurate page titles and descriptions, canonical URLs, crawlable links, correct robots/indexing behavior, and server-rendered or otherwise crawlable primary content where the framework requires it.
- Check Open Graph/social metadata when sharing is in scope. Include structured data only when it accurately represents visible page content and matches current search-engine documentation.
- Keep route metadata in the framework’s established mechanism and avoid duplicating hardcoded metadata across components.
- Do not promise rankings, invent keywords or business facts, use keyword stuffing, or add deprecated/unsupported schema for a score.

## Performance

- Identify the user-visible bottleneck and measure before optimizing. Inspect images, fonts, scripts, layout shifts, and interaction work as relevant.
- Use the current Core Web Vitals guidance for public site measurement. web.dev currently defines good field targets at the 75th percentile as LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1; segment field results by mobile and desktop.
- Distinguish lab audits, local device observations, and field data. A Lighthouse score or build success alone is not evidence of real-user Core Web Vitals.

## Packaged static HTML inspector

The package script `scripts/inspect_html.py` checks a small set of rendered markup signals: a document language, non-empty title, description and responsive viewport metadata, `img` alt attributes, basic link/button labels, and form-control labels. It accepts HTML files or directories, skips common dependency directories, and is read-only.

```bash
python3 <skill-directory>/scripts/inspect_html.py dist
python3 <skill-directory>/scripts/inspect_html.py --strict dist
```

Exit codes: `0` no errors (or warnings without `--strict`), `1` findings include errors (or warnings in strict mode), `2` invalid path, unreadable input, or no HTML files. The inspector does not execute JavaScript, calculate accessible names as a browser does, test visual design/responsiveness, validate links/schema, or establish full WCAG/SEO compliance. Use project-native browser, accessibility, and SEO tooling for those checks.
