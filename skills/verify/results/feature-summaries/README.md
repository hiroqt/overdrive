# Feature unit-test summaries

Create one run folder per verification run and one child folder per feature:

```text
<run-id>/
├── summary.md
└── <feature-id>/
    ├── summary.md
    ├── result.json
    └── evidence/       # sanitized logs or reports, when useful
```

`summary.md` at the run level is the concise aggregate shared with the user
after all parallel unit workers finish and before E2E starts. Each feature
summary records the feature, covered cases, exact command, exit code, target
revision, worker result, and evidence paths. Keep `result.json` machine-readable
with equivalent fields. Never save credentials, cookies, tokens, or real
personal/customer data here. Treat these run artifacts as local evidence; do not
commit them unless the user explicitly requests it.
