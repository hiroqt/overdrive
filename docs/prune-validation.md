# Prune Skill Validation

The structural checks below are historical. A current-ID paired behavior case is recorded in [the current benchmark](skills-e2e-benchmark-results.md).

## Package and intent

- Skill: `skills/prune/SKILL.md`
- Supporting files: `assets/CODEBASE_MAP.template.md`, `references/codebase-map-maintenance.md`, and `references/evaluation.md`
- Purpose: reduce repeated exploration, oversized outputs, unnecessary schema/context loading, and stale history while preserving useful knowledge and task success.
- User-supplied research is treated as motivation and a list of hypotheses, not as independently verified evidence. No numerical findings or universal tool rankings are asserted by this skill.

## Safeguards

- MCP tools are explicitly part of the efficiency decision. The skill calls for relevant on-demand schema discovery where supported, while preserving use of authoritative or high-value MCP sources.
- Search scope and output size may expand when evidence is incomplete or risk is high.
- Full logs remain available when a bounded summary is returned; arbitrary tool/test limits are prohibited.
- Claims of savings require actual usage telemetry and comparable task evidence.

## Overlap review

Related installed skills were checked by name and entrypoint: `tokenwise` focuses on Claude Code model routing and cost logging; several context optimization/pruning skills cover general context management. This skill stays focused on coding-agent repository retrieval, tool-output handling, and MCP choice. It does not route models, install tools, configure a harness, or claim measured savings.

## Structural checks

The skill creates or refreshes a concise, source-linked `docs/CODEBASE_MAP.md` in each code repository where it is used. It checks this map after meaningful code changes and at session wrap-up, avoids duplicate docs and no-op writes, and links it from existing navigation. “Upload” is defined as a repository-local update; remote upload or publication requires a separate request.

- This toolkit repository’s initial [codebase map](CODEBASE_MAP.md) was created from its instructions, README, skill packages, validation records, and current Git state.
- Ruby's standard YAML parser checked skill metadata and Codex UI metadata; Markdown local-link checks passed across the repository; `git diff --check` passed.
- The bundled Python validator was not rerun in this turn. Its previous attempt failed because this environment lacks PyYAML.
- The existing `docs/` folder meant first-use creation of a missing `docs/` directory was not exercised.

## Behavioral evaluation status

Not run. Proposed cases are documented in `skills/prune/references/evaluation.md`. Automatic host discovery, measured token savings, and comparative task success remain unverified.
