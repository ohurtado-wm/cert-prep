---
name: record-adr
description: Document a Cert Prep decision that affects architecture, contracts, data, security, operations, or dependencies.
---

# Record an ADR

## Workflow

1. Read `AGENTS.md`, the relevant approved plan, and existing ADRs in `docs/decisions/`.
2. Use the established numbering and status vocabulary. If no convention exists, use a numbered Markdown ADR with context, criteria, options, decision, consequences, validation, and references.
3. Explain alternatives and trade-offs from repository evidence; keep proposals separate from accepted decisions.
4. Create or update an ADR only when the user authorized that document. Mark it **Propuesto** unless an authorized decision maker explicitly accepts it.
5. Link the ADR from its plan and architecture document when appropriate.

## Limits

- Never invent consensus, approval, or evidence.
- Do not change an ADR from **Propuesto** to **Aceptado** without explicit approval.
- Do not use an ADR to replace the feature plan's scope or acceptance criteria.

## Output

The ADR path, status, decision context, options, consequences, and any validation or follow-up still needed.
