---
name: pr-code-review
description: Review a Cert Prep pull-request diff for correctness, regressions, security, contract, and plan risks without changing files.
---

# PR code review

## Workflow

1. Confirm the PR, diff, base, and review scope before inspecting findings.
2. Read the approved plan, acceptance criteria, and enough surrounding code to verify behavior.
3. Review behavior and edge cases, security/privacy, data ownership, contracts, migrations, and scope compliance.
4. Report only actionable defects with priority, file/line, evidence, impact, and a suggested correction or check.
5. State the reviewed scope and which checks have real evidence.

## Cert Prep checks

Pay attention to owner-scoped PostgreSQL access, answer-key privacy, Zod contract compatibility, same-origin API routes, workspace imports, migration paths, and bilingual flows.

## Limits

This skill is read-only. Do not edit code, post PR comments, approve, or merge. Do not claim a CI check passed without observing its result; avoid style-only findings unless they affect behavior.
