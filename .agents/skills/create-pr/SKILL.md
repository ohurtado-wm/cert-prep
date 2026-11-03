---
name: create-pr
description: Prepare or create a Cert Prep pull request when the user explicitly asks, connecting the approved plan to the diff and real validation evidence.
---

# Create a pull request

## Workflow

1. Inspect repository instructions, PR template, branch conventions, Git state, diff, approved plan, related issue/ADR, and required checks.
2. Identify scope deviations and uncommitted or unrelated changes before drafting.
3. Summarize purpose, changes, references, actual validation, risks, and follow-up in the repository's format.
4. Distinguish passed, failed, pending, and unrun checks. Never infer results.
5. Create or publish a PR only when the user explicitly requests it and the destination is clear.

## Limits

- Do not commit, push, create a PR, or post external messages unless specifically requested.
- Never merge a PR.
- Do not conceal scope drift or make an unapproved plan appear approved.
