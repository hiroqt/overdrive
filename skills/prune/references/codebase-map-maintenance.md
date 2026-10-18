# Codebase Map Maintenance

Read this when using `prune` in a code repository, especially on first use, when no map exists, or after architecture, commands, interfaces, or important constraints change.

## Path and discovery

Use `docs/CODEBASE_MAP.md` as the default path so agents can find it predictably.

1. Inspect the root and existing docs navigation for `docs/`, architecture/design docs, setup guides, root instructions, and an equivalent codebase map.
2. If the docs directory does not exist, create it. If an equivalent maintained map already exists, refresh that document instead of creating a duplicate.
3. Otherwise create `docs/CODEBASE_MAP.md` from `../assets/CODEBASE_MAP.template.md`, removing irrelevant sections and filling each remaining item from inspected source.
4. Add one link to the map from the existing README, AGENTS file, or documentation index, choosing the least surprising location. Do not create a new index just to point to one file.

## What to include

Keep it a navigation map, not a copied source tree or second full architecture manual. Include only information that helps an agent find authoritative sources and avoid rediscovery:

- project purpose and source-controlled authority documents;
- major directories and their responsibilities, linked to source paths;
- application entrypoints and important data/API boundaries;
- commands for setup, lint, typecheck, tests, build, and migrations when confirmed in manifests or CI;
- high-value tests and special runtime/device/provider gates;
- known constraints, failure modes, and unresolved facts that could cause a wrong implementation;
- verification date and source revision or working-tree state.

For every non-obvious claim, link to the file that proves it. Label unverified or user-reported facts; do not turn assumptions into repository facts. Keep secrets and private data out. Environment variable names may be listed when useful, never their values.

## Refresh rules

- After each meaningful code change, update only the map sections affected by changed files, commands, contracts, or newly verified behavior.
- Before ending a session, handoff, or compaction, compare the map with the current working-tree changes and the session’s verified findings. Refresh its source revision/date when the repository state changed.
- If the map is still accurate and the source state is unchanged, leave bytes untouched; record in the response that it was checked. Avoid timestamp-only churn.
- Preserve user edits. Do not replace a manually maintained architecture document or reformat unrelated docs. Add a concise link or extend its existing navigation where needed.
- If the repository is read-only, generated, or governed by a rule that prevents documentation writes, do not force a change; provide the proposed map/update and state why it could not be saved.
- “Update” means write inside the repository. Do not upload, commit, push, publish, or send map contents to a remote service unless separately requested and authorized.

## Validation

Check that every linked path exists, commands still match the package/CI source, and no changed implementation invalidates the map. Keep the map short enough to be useful as a first-pass index; read referenced sources before relying on high-impact claims.
