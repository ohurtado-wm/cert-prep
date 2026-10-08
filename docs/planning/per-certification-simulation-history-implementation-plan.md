# Implementation Plan: Per-Certification Simulation History

**Status:** In Review  
**Last Updated:** 2026-10-08

## Status

- Completed: `PR-01` implementation, focused tests, typecheck, and build.
- Completed: PR publication.
- In Review: Review of PR #22.

## PR Status

| PR | Scope | Status | Depends On | Validation Gate |
|---|---|---|---|---|
| `PR-01` | Retain up to five results per certification and show history for the selected certification | [Open: #22](https://github.com/ohurtado-wm/cert-prep/pull/22) | - | Retention/API/client coverage, typecheck, and build; full-suite finding documented below |

## Goal

For each user, retain the five most recent completed simulations **per certification** and show only the selected certification's results in “Simulaciones recientes.” Weak-topic analysis continues to use that certification's own history. Keep the configured cap at five by default; do not raise it to ten.

## Scope and Constraints

- In scope: Per-certification retention, certification-filtered history reads for the UI, clear history wording, focused validation, and current documentation updates.
- Out of scope: Changing the hourly simulation-start limit, weak-topic threshold or ranking, adding certification management, and deleting history or study plans for only one certification.
- Constraint: Keep `MAX_SIMULATION_HISTORY_ITEMS` configurable and set its default and example value to `5`.
- Assumption: “Borrar historial” remains a user-wide action that deletes results and study plans across certifications; the UI will state this clearly.
- Deployment model: All-at-once; no database migration is expected.

## Implementation Shape

- On simulation completion, prune only older results with the same `gatewayUserId` and `certificationId` as the completed simulation.
- Add an optional `certificationId` filter to the history read path. Preserve the current unfiltered API behavior for callers that omit it; have the application request the selected certification and include it in the React Query key.
- Keep weak-topic analysis scoped to the selected certification. It currently queries up to ten results, but with the default retention policy it will have at most five available for that certification.
- Keep the clear-history API global and make its UI label/confirmation say it clears history and study plans across certifications.

## Codebase Touchpoints

| Area / File | Planned Change | Test Impact |
|---|---|---|
| `server/use-cases/simulation-service.ts` | Scope result pruning by user and certification; retain five by default. | Verify one certification reaching its cap does not prune another's results. |
| `server/use-cases/simulation-history-service.ts`, `server/routes/simulations.ts`, `src/api/simulations.ts` | Support an optional certification filter while preserving unfiltered behavior. | Verify user and certification filters and response limits. |
| `pages/index/+Page.tsx` | Query and display history for the selected certification; make the global clear action explicit. | Verify switching certifications changes the displayed results. |
| `server/config/runtime-limits.ts`, `.env.example`, `README.md` | Align the fallback/example and document that the configured cap applies per certification. | Verify configuration defaults and docs agree. |
| `tests/simulations.test.ts`, `tests/weak-topic-simulation.test.ts`, `tests/certification-ui-data.test.ts` | Cover retention boundaries, cross-certification isolation, and the selected-certification API query. | Automated regression coverage. |
| `src/i18n/messages.ts` | Clarify in Spanish and English that clearing removes history across certifications and study plans. | Verify both locales communicate the global effect. |

## PR / Review Strategy

- `PR-01`: Deliver per-certification retention and selected-certification history together so the storage and display limits agree. Previous PR: none. Next PR: none.
- Stacking: Single PR.
- Merge guidance: Validate retention and API behavior before review; no schema migration or staged rollout is needed.

## Parallel Execution Notes

- Critical path: Retention and history API behavior must be decided together because the endpoint currently applies the same limit as the storage cleanup.
- Parallel lane: Documentation and bilingual wording can be prepared alongside the backend changes.
- Serialization point: UI query keys and API filtering must use the same optional `certificationId` contract.
- Coordination note: Keep the global clear-history behavior explicit while the displayed list is certification-specific.

## PR 1: Certification-Scoped Simulation History

**PR ID:** `PR-01`  
**Status:** Open: [PR #22](https://github.com/ohurtado-wm/cert-prep/pull/22)  
**Objective:** Keep five recent results per certification and show only the selected certification's results.  
**Depends On:** None  
**Parallelism:** Documentation and translations can proceed alongside backend work; API and UI wiring must agree on the certification filter.

### Tasks

- [x] `P1-T01` Scope result pruning to `gatewayUserId` and `certificationId`; keep the configured cap at five by default and preserve environment overrides.
- [x] `P1-T02` Add an optional certification filter to history reads and ensure the selected-certification query can return its retained results without a global five-item truncation.
- [x] `P1-T03` Include the selected certification in the history query key and request; render only matching history items.
- [x] `P1-T04` Clarify that the existing clear action deletes all certification histories and study plans for the user.
- [x] `P1-T05` Update `.env.example`, `README.md`, and focused tests for retention, filtered reads, cross-certification isolation, and weak-topic history.

### Validation Criteria

- [x] Completing a sixth simulation for certification A retains A's five newest results and does not remove results for certification B or another user.
- [x] A filtered history request returns only the requested certification's results; an unfiltered request retains its existing behavior.
- [x] The selected-certification query key and API call include the selected certification; client and route tests cover the filter.
- [x] Weak-topic analysis for A uses only A's retained history; results for B have no effect even when topic IDs overlap.
- [x] The clear-history confirmation identifies its cross-certification effect and the existing global deletion behavior remains intact.
- [x] Typecheck, focused tests, and build pass.
- [ ] Full suite is fully green: 75 tests pass; one unchanged baseline assertion in `tests/guide-generator.test.ts` expects prompt wording absent from `server/catalog/guide-generator.ts` on `origin/main`.

### Risks / Open Questions

- Per-certification retention increases the maximum number of stored results per user as the catalog grows. With six catalog entries and the default cap of five, up to 30 results may be retained per user.
- Results already pruned by the former user-wide cap cannot be recovered; the per-certification policy applies to future completions.
- The full suite has one unrelated baseline failure in the guide-generator prompt wording assertion; the prompt and test files match `origin/main` and are out of scope for this PR.
- Keep the API's unfiltered behavior for compatibility; the application UI will use the filtered path.
