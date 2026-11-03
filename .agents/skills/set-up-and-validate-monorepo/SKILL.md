---
name: set-up-and-validate-monorepo
description: Review or initialize the Cert Prep monorepo, agent context, shared contracts, and agreed repository documents. Use when checking or changing repository structure.
---

# Set up and validate the monorepo

## Purpose

Compare the repository with the team's approved structure and report evidence before initializing missing pieces.

## Workflow

1. Read `AGENTS.md`, `README.md`, relevant plans in `docs/plans/`, and decisions in `docs/decisions/`.
2. Inspect the real workspace tree, package manifests, shared contracts, scripts, and runtime entry points.
3. Classify each agreed item as **Present**, **Missing**, **Incomplete**, or **Not applicable**. Cite paths and explain uncertain findings.
4. Separate evidence, assumptions, and decisions. Ask before creating or moving a missing item unless the user has already approved that exact change.
5. If initialization is approved, change only approved items; preserve existing behavior and files not included in the approved plan.
6. Validate workspace discovery, root commands, imports, migrations, and container configuration. Report checks actually run.

## Cert Prep boundaries

- Keep `apps/web` (Vike/React), `apps/api` (Bun/Hono), and `packages/contracts` (shared Zod) as separate ownership boundaries.
- The accepted topology composes Vike and Hono in one Bun process with same-origin `/api/*` routes.
- PostgreSQL migrations live in `apps/api/drizzle/postgresql/`; the SQLite history is reference only.
- Do not require optional example files, duplicate existing plans, or overwrite current docs without approval.

## Output

Return the inventory, evidence, gaps, decisions needed, approved changes made, and validation results. Do not implement unapproved gaps.
