# End-to-end evidence

Create one run folder after the run's parallel unit tests pass and their
aggregate summary has been shared:

```text
<run-id>/
├── summary.md
├── result.json
└── evidence/           # sanitized screenshots, traces, or logs
```

Record the target revision and environment, app startup command and outcome,
user journey steps, observable expected result, persistence check when relevant,
browser or authorized MCP evidence, and any limitations. Keep this folder
separate from feature-level unit results. Never save credentials, cookies,
tokens, or real personal/customer data here. Treat run artifacts as local
evidence; do not commit them unless the user explicitly requests it.
