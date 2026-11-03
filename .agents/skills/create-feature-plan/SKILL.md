---
name: create-feature-plan
description: Turn a Cert Prep feature or architecture request into a reviewable plan in docs/plans before implementation.
---

# Create a feature plan

## Inputs

Use the user's request, current source, `AGENTS.md`, contracts, relevant accepted ADRs, and existing plan format.

## Workflow

1. Inspect the repository and related plans before proposing changes.
2. Separate confirmed facts, assumptions, alternatives, and open questions.
3. Define objective, scope, exclusions, observable acceptance criteria, affected packages/contracts, dependencies, risks, validation, and rollback when relevant.
4. Save a plan as **Draft** in `docs/plans/` only when the user has authorized creating that file.
5. Present the plan for human review. Do not write implementation code or treat a proposal as an accepted decision until the user approves it.
6. After approval, keep implementation within the plan and update its status with evidence.

## Cert Prep constraints

- Preserve same-origin `/api/*` and the single Vike/Hono process unless an approved plan changes that architecture.
- Shared HTTP schemas belong in `packages/contracts`; database details stay in `apps/api`.
- Derive current product facts from code and `README.md`; `PROJECT_PROPOSAL.md` describes the original PoC.
- Do not invent tests, CI results, dependencies, or team decisions.

## Output

A concise plan with scope, criteria, repository analysis, affected files, sequence, risks, validation, deployment/reversal, assumptions, and approval status.
