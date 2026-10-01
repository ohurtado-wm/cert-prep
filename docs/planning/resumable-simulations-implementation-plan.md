# Implementation Plan: Resume Pending Simulations

**Status:** In Progress  
**Last Updated:** 2026-10-01

## Source Materials

- [FEATURE_IMPLEMENTATION_PLAN.md](../../FEATURE_IMPLEMENTATION_PLAN.md) - establishes the session, history, study-plan, and weak-topic capabilities already present in the local `main` checkout.
- [PostgreSQL migration plan](postgresql-migration-implementation-plan.md) - shares the `simulation_sessions` schema and must follow this work or include its final schema.
- Current product request - exiting a simulation should preserve it so the same user can continue later.

## Status

- Baseline available on local `main`: PR-05 session/history flow, PR-06 study plans, and PR-07 weak-topic simulations and the latest compact weak-topic UI.
- Pending from earlier PR plans: PR-05's dedicated E2E validation and PR-06's authorized live AI canary; these do not block this feature's implementation baseline.
- Implementation on `codex/pr-08-resumable-simulations`: service, persistence, API, UI, migration, tests, and documentation are in the working tree. Typecheck, full test suite, and production build passed. Browser E2E/manual flow remains unverified. GitHub PR state could not be verified because `gh` authentication/API access failed; baseline status above describes the local checkout only.

## PR Status

| PR | Scope | Status | Depends On | Validation Gate |
|---|---|---|---|---|
| `PR-08` | Preserve, resume, and replace the user's single pending simulation | In Progress | PR-05 session baseline present on `main` | Owner-scoped resume and atomic replacement flow pass integration and UI validation |

## Goal

Let a user leave an unfinished simulation, return later from the home screen, and continue at the same question with the server-stored question set and progress. Keep exactly one pending simulation per user indefinitely; creating a new simulation replaces the previous pending one. Resuming must not generate new questions or consume additional AI tokens.

## Scope and Constraints

- In scope: preserving the signed-in user's one pending session on exit, restoring it after reload, replacing it when a new simulation is successfully created, and restoring practice attempts/resolution.
- Out of scope: changing completed-result history, study-plan generation, weak-topic analysis, or question generation. Both standard and weak-topic simulation starts use the same pending-session replacement policy.
- Keep exactly one pending simulation per user, replacing the existing two-active-session cap. New-start attempts continue to follow the existing three-per-hour rate-limit behavior; resuming does not consume that limit. A successfully created standard or weak-topic simulation replaces the prior pending session. Preserve it if analysis, generation, eligibility, or validation fails.
- Keep session data on the backend under the verified `gatewayUserId`; do not put questions or answers in `localStorage`.
- A pending session has no inactivity expiry and remains until it is completed, explicitly discarded, or replaced by a successfully created new simulation. Preserve the current two-hour retention for completed session rows and the existing completed-result history.
- Existing users may have up to two active rows at rollout. The migration retains the most recently created active session per user and removes older active rows before enforcing the single-pending invariant.

## Implementation Shape

- Execution seam: extend `simulation-service` with an owner-scoped lookup for the user's single pending session; expose it through a static `GET /simulations/active` route registered before `GET /simulations/:sessionId`.
- Exit behavior: stop calling the existing delete route when the user leaves a quiz. Return to the home screen and show one saved-session card with **Continuar** and **Descartar** actions.
- Resume behavior: fetch the single pending session and continue from its stored `currentIndex` and question state without calling the question generator.
- Replacement behavior: apply to both `POST /simulations` and `POST /simulations/weak-topics`. Complete analysis, generation, and validation first; then atomically replace the old pending row with the new session. If analysis, generation, eligibility, or validation fails, keep the old pending session intact. Warn the user before replacing saved progress.
- Snapshot/UI contract: include enough safe state to restore the current question number and practice attempts/resolution. Do not expose the correct answer or explanation for an unanswered question; resolved/revealed practice state may be restored for its owner.
- Persistence: represent pending sessions without an expiry and completed sessions with the existing short retention. Add a database-enforced single-active-session-per-user invariant using a lifecycle field/index (or equivalent supported by both SQLite and PostgreSQL); update lifecycle and serialized state together when a session completes.
- Concurrency: retain the current per-process generation lock for the existing single-instance deployment; do AI work before opening a short transaction that replaces the session. Enforce the single-pending invariant in the database. This PR does not claim cross-process generation coordination; `PR-DB-01` must add shared reservation/rate-limit coordination before multiple instances run.

## Codebase Touchpoints

| Area / File | Planned Change | Test Impact |
|---|---|---|
| `server/use-cases/simulation-service.ts` | Look up the user's single pending session, resume it, and atomically replace it only after a new set is valid | Service integration coverage for ownership, replacement, state restoration, and rate limits |
| `server/routes/simulations.ts` | Add `GET /simulations/active`; keep it ahead of the parameter route; retain DELETE for explicit discard | Route/authentication coverage |
| `server/db/schema.ts`, `drizzle/` | Represent pending/completed lifecycle and nullable expiry; enforce one active row per user, backfill existing duplicates, and preserve completed-row cleanup | SQLite migration and invariant coverage; document the resulting schema for PostgreSQL `PR-DB-01` |
| `src/api/simulation-contracts.ts`, `src/api/simulations.ts` | Define the nullable active-session response and API client; extend resume snapshot with safe current-question state | Contract and client parsing coverage |
| `pages/index/+Page.tsx` | Load the user's pending session, preserve instead of cancel on exit, warn before standard or weak-topic replacement, and hydrate state on resume | UI flow coverage and user-cache isolation |
| `pages/index/+Page.tsx`, `src/components/SimulationScreens.tsx` | Add one pending-session card with **Continuar** and confirmed **Descartar**, integrated into the existing home layout with recent history, study plans, and compact weak-topic practice; render the restored question from the server snapshot | Reload/resume and replacement scenarios |
| `server/simulations/state.ts` | Preserve or derive the minimal practice attempt/resolution metadata needed to restore the current question safely | State-schema compatibility coverage |
| `tests/simulations.test.ts` | Add service, route, and end-to-end wiring cases for the complete resumable flow | Primary integration validation |

## PR / Review Strategy

- `PR-08`: one follow-up PR on `main`; the PR-05 session/history baseline and PR-06/07 features are already present locally. Previous dependency: PR-05. No PR-06/07 follow-up is in this sequence.
- Schema ordering: complete PR-08 before `PR-DB-01`. The PostgreSQL migration must use the final lifecycle/expiry invariant from PR-08. Do not run schema work for these plans concurrently; if `PR-DB-01` starts first, it must absorb the agreed PR-08 schema and become a prerequisite instead.
- Merge guidance: land the API contract, owner-scoped service behavior, and persistence invariant with coverage before the UI uses the resume flow. UI changes must preserve the latest compact weak-topic layout.

## Parallel Execution Notes

- Critical path: freeze the lifecycle/expiry and safe resume-snapshot contracts, implement the backend lookup/replacement behavior for both start routes, then wire the home and quiz UI.
- Parallel lane: visual treatment for the one pending-session card can be prepared once the snapshot fields are agreed.
- Serialization point: the resume snapshot must preserve practice attempts and resolved/revealed state without exposing answers early; UI work depends on that contract.

## PR-08: Resume Pending Simulations

**Status:** Implementation complete; browser validation pending  
**Objective:** Preserve one incomplete simulation across exit and reload, and let the authenticated owner resume, discard, or replace it.  
**Depends On:** PR-05 session baseline (present on local `main`)  
**Parallelism:** Backend contract/state work must land before end-to-end UI wiring; styling can proceed after the summary contract is agreed.

### Tasks

- [x] `P8-T01` Add an owner-scoped endpoint that returns the user's single pending session, or `null`, including certification, mode, language, question progress, and creation time; register the static route before `GET /simulations/:sessionId`.
- [x] `P8-T02` Extend the snapshot so a resumed practice question restores attempts and resolved/revealed feedback while keeping unanswered answer keys private.
- [x] `P8-T03` Replace the two-active cap with a database-enforced one-pending invariant; migrate existing duplicates by retaining the newest active session; remove expiry only for pending rows while preserving two-hour completed-row cleanup/history behavior.
- [x] `P8-T04` Change **Salir** to preserve the session; add home-screen **Continuar** and confirmed **Descartar** actions, plus a replacement warning for standard and weak-topic starts.
- [x] `P8-T05` Restore the active session from the API after app reload and clear/refetch pending-session cache when identity changes or signs out.
- [x] `P8-T06` Extend `tests/simulations.test.ts` to cover owner isolation, no question regeneration on resume, practice/real progress, pending vs completed retention, discard, single-pending concurrency, both replacement entry points, failed-start preservation, and rate limits.

### Validation Criteria

- [ ] A session left and reopened by the same user resumes at the same question and uses the same generated question set; no AI generation call occurs on resume.
- [ ] Practice resumes with the correct remaining attempts and any already resolved or revealed feedback; unanswered questions do not leak their answer key.
- [ ] A different user cannot list, read, resume, or discard the session.
- [ ] **Descartar** removes only the selected pending session; completion still writes the existing history result.
- [ ] A pending session remains resumable until completion, explicit discard, or successful replacement, including after long inactivity.
- [ ] Only one pending session exists per user; successful new creation replaces it atomically, while failed generation leaves the existing session intact.
- [ ] Standard and weak-topic starts follow the same confirmation and replacement rules; a weak-topic eligibility/analysis failure does not discard pending progress.
- [ ] Concurrent starts cannot leave two pending rows for one user. The invariant works on SQLite and its agreed representation is carried into `PR-DB-01`.
- [ ] Resuming does not consume the new-start rate limit; standard and weak-topic start attempts retain the existing limit behavior, including failed generation attempts.

## Cross-Cutting Validation

- [x] Service and route tests verify gateway-user ownership and prevent answer-key disclosure before a question is resolved.
- [ ] The API client and home/quiz UI complete the start → answer → exit → reload → continue flow using a fake question generator, within the current history, study-plan, and compact weak-topic home composition.
- [ ] A successful standard or weak-topic start replaces pending progress; a generation or eligibility failure does not delete it.
- [ ] Practice retry/reveal and real-mode single-attempt state survive a reload at the current question.
- [ ] Existing completed history and result calculations remain unchanged.

## Open Questions

- None. For the existing single-instance deployment, the current per-process generation lock serializes starts; generation happens before the short replacement transaction. `PR-DB-01` must replace that local coordination with a shared reservation before multi-instance deployment.

## Review History

- 2026-10-01: Integrating review against local `main` and the PostgreSQL plan. Updated completed dependency context, standard/weak-topic replacement scope, existing two-session/expiry behavior, migration ordering, and current home UI touchpoints. GitHub PR state was unavailable during review.
- 2026-10-01: Implemented PR-08 and passed typecheck, full tests, and production build. Browser E2E/manual validation remains pending; GitHub PR state and creation are blocked by invalid `gh` credentials.
