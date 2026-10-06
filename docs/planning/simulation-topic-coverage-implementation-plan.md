# Implementation Plan: Simulation Topic Coverage and Variety

**Status:** Ready for review
**Last Updated:** 2026-10-06

## Source Materials

- [FEATURE_IMPLEMENTATION_PLAN.md](../../FEATURE_IMPLEMENTATION_PLAN.md) - establishes owner-scoped history and aggregate-only retention.
- Current simulation pipeline: `server/use-cases/simulation-service.ts`, `server/simulations/question-generator.ts`, and `server/simulations/question-validation.ts`.
- Q1/Q2 comparison in the current request - provides examples of recurring question objectives to guide the bounded quality check.

## Status

- Completed: Compared the two 20-question simulations and traced guide, prompt, allocation, validation, and stored history behavior.
- Completed in this branch: History-aware topic allocation, generator scope, exact topic validation, focused regressions, API rotation flow, and a bounded rubric fixture from the Q1/Q2 comparison.
- Completed in this follow-up: Include an unfinished active simulation in the rotation using only topics shown through its current question; preserve the two-exposure maximum.
- Completed: Reviewed the user-provided post-change simulation output as the bounded live-output canary; no additional model call was made.
- Remaining: No implementation tasks. Two question-completeness findings from the sample are called out for reviewer awareness.

## PR Status

| PR | Scope | Status | Depends On | Validation Gate |
|---|---|---|---|---|
| `PR-01` | Allocate full simulations across guide topics and rotate under-covered topics across recent sessions | Ready for review; bounded output canary reviewed | - | Unit, service integration, weak-topic regression, and bounded generation-quality checks pass |

## Goal

Keep the certification's domain-weight distribution while spreading each user's standard 20-question simulations across the topics in the current guide. Select topics using up to two recent exposures for that user, certification, and guide version, and pass exact per-topic quotas through generation and validation.

## Scope and Constraints

- In scope: standard full simulations, per-domain topic allocation, rotation based on recent topic coverage, and generation-quality validation.
- Preserve the domain quotas calculated from official exam weights. The topic quotas must sum to each domain's existing question quota.
- Use at most two exposures for the same user, certification, and `guideVersion`: when a matching active simulation exists, count the topics shown through `currentIndex` (including the currently displayed question) plus the latest completed result; otherwise use the two latest completed results. A new simulation can therefore replace an unfinished one while rotating away from what the user already saw. Only aggregate topic IDs and counts reach allocation; question content is not sent as history. Count completed standard and weak-topic results because both represent prior exposure. The database retains up to 20 completed results.
- Reuse `simulationResults.topicBreakdown` and `guideVersion`. Do not add a migration or store completed question text, options, answers, or embeddings.
- Keep weak-topic simulations' existing requested topic counts and prioritization behavior intact.
- Start with the guide's current topic inventory. This plan improves coverage of those generated topics; it does not certify that the inventory exhaustively represents every official exam objective or redesign the five-step study path.
- Exact semantic deduplication against completed question text is out of scope because completed history intentionally stores aggregates only. Reduce repeated objectives by rotating topic coverage and checking generated-set quality.
- Deployment model: all-at-once.

## Implementation Shape

- Execution seam: in `startInternal`, after loading the certification guide and before calling the question generator, read a matching active session and recent result aggregates for the authenticated user. Convert only the active session's already-shown questions into topic counts.
- Allocation: preserve `allocateQuestionsByWeight`; within each domain, assign its quota to the least-covered guide topics in the two-session window, breaking ties by stable topic ID. This makes the first run deterministic and moves later runs toward topics selected less often. When the guide version changes, ignore older topic counts.
- Generation: pass `requiredQuestionsByTopic` for standard simulations as well as focused simulations. Represent scope explicitly (all guide topics versus selected weak topics), so the presence of topic quotas alone does not label a standard simulation as focused. Ask the model to follow the counts, assess distinct decisions, and vary scenario context and service where the topic allows it.
- Validation and persistence: enforce both domain and topic quotas in the existing validator. Continue storing only the resulting aggregate `topicBreakdown` and current `guideVersion` on completion so the next run can rotate from that evidence.

## Codebase Touchpoints

| Area / File | Planned Change | Test Impact |
|---|---|---|
| `server/use-cases/simulation-service.ts` | Load the matching active session and latest matching result aggregates; compute standard-simulation topic quotas; pass them to generation and validation | Service integration proves owner, certification, and guide-version filters; active replacement; and completed-run rotation |
| `server/simulations/question-validation.ts` or a focused allocation module | Add deterministic per-topic allocation from history while preserving domain quotas | Unit tests for weighted totals, tie-breaking, empty history, and guide changes |
| `server/simulations/question-generator.ts` | Separate full-guide coverage quotas from focused-only scope; include topic counts and strengthen instructions for distinct objectives and varied scenarios | Prompt-scope contract tests and bounded quality evaluation |
| `tests/simulations.test.ts`, `tests/api.test.ts`, `tests/guide-weights.test.ts` | Cover allocation, exact quota enforcement, the production API path, and a completed-run-to-next-run flow | Unit, service integration, and API contract coverage |
| `tests/weak-topic-simulation.test.ts` | Preserve focused simulation behavior and exact topic quotas | Regression coverage |
| `tests/evaluation/simulation-topic-coverage/` | Add a small rubric/fixture for comparing topic coverage and recurring objective families across generated runs | Bounded, claim-matched generation-quality check; no full-catalog or always-on paid run |

## PR / Review Strategy

- `PR-01`: deliver history-aware topic quotas, generator wiring, validation, and the bounded quality check together; previous PR: none; next PR: none planned.
- Keep allocation, generation contract, and validation in one review boundary because a quota is useful only when the production path passes and enforces it end to end.
- Do not add completed question text to history as part of this PR. A future requirement for item-level semantic no-repeat needs a separate data-retention and similarity design decision.

## Parallel Execution Notes

- Critical path: settle the topic-allocation contract first; service wiring and exact validation depend on it.
- Parallel lane: after the allocator input/output shape is agreed, unit tests and prompt wording can be prepared independently.
- Serialization point: the final topic quota contract must be shared by allocator, generator input, and validator; no database migration is expected.
- The service integration and live-model quality canary must follow the finalized topic-selection behavior.

## PR 1: Topic Coverage and Rotation for Standard Simulations

**PR ID:** `PR-01`
**Status:** Ready for review
**Objective:** Use each standard simulation's existing domain-weight budget to cover less-recently-tested guide topics for that user, then enforce the selected topic counts throughout generation.
**Depends On:** None
**Parallelism:** Allocation tests and prompt edits can proceed after agreeing on the quota contract; service wiring and end-to-end validation follow that contract.

### Tasks

- [x] `P1-T01` Add history queries filtered by authenticated `gatewayUserId`, certification, and current `guideVersion`; use up to two exposures total, preferring the active session's shown-topic counts plus one completed aggregate when active, otherwise two completed `topicBreakdown` values.
- [x] `P1-T02` Allocate each domain's existing integer question quota across its topics by least recent coverage, with a deterministic topic-ID tie-break and a defined empty-history behavior.
- [x] `P1-T03` Pass the resulting `requiredQuestionsByTopic` through the ordinary simulation prompt and validator. Add an explicit scope flag so standard simulations use all guide topics subject to quotas, while weak-topic simulations keep their selected-topics-only instructions and counts.
- [x] `P1-T04` Strengthen the generation prompt to follow exact topic quotas, test a distinct decision per question, and vary scenario contexts where the topic permits; keep the existing answer-position balancing behavior.
- [x] `P1-T05` Add unit, service integration, and API-path coverage for exact domain/topic totals, owner/certification/version isolation, guide-version changes, empty or sparse history, completion followed by rotation, and weak-topic regression.
- [x] `P1-T06` Add a bounded quality rubric/fixture in `tests/evaluation/simulation-topic-coverage/`, using objective-family labels from the observed repeats without checking in the full PDFs or retaining question text. Record the current behavior as the baseline and require the updated topic coverage to pass the rubric.

### Validation Criteria

- [x] For the current 25/20/20/20/15 domain weights, domain allocations remain 5/4/4/4/3 and topic counts sum exactly to those values.
- [x] With six available topics in a domain and fewer questions than topics, the allocator selects the least-covered topics; subsequent completed runs select the previously under-covered topics before repeating equally covered ones.
- [x] Standard simulation service calls pass exact topic quotas, and `validateGeneratedQuestions` rejects missing, extra, or out-of-scope topic assignments.
- [x] Prompt tests prove that standard simulations receive full-guide coverage instructions and weak-topic simulations retain focused-only instructions; topic-quota presence alone cannot select the focused wording.
- [x] An API-level flow starts and completes a standard simulation, verifies the returned questions use the allocated topic IDs, then starts another simulation for the same user and confirms the stored topic breakdown affects the next allocation.
- [x] An API-level flow starts a simulation and replaces it before completion; only topics shown through the active question affect the next allocation, and the new session replaces the old one.
- [x] History from another user, certification, or guide version cannot affect allocation; an empty compatible history produces a deterministic valid allocation.
- [x] Weak-topic simulation still uses its existing exact focus counts and passes its regression suite.
- [x] Bounded live-output canary reviewed from the user's prior and post-change simulations for the same guide: domain weights stayed 5/4/4/4/3; the incomplete run's shown `topic-1-1` was replaced by `topic-1-5`; `topic-5-5` rotated to `topic-5-6`; the new run used distinct focus labels for all shared topics and showed no obvious repeated objective within the run. The outputs still share 18/20 topic IDs, and two technical completeness findings are recorded below. No additional paid model call was made.
- [x] `bun run typecheck`, the focused Bun tests, the full `bun test` suite, and `bun run build` pass before merge.

### Risks / Open Questions

- The rotation depends on the guide's topic names and IDs. The service must ignore results from older `guideVersion`s so regenerated or reordered topics do not distort current coverage.
- Topic rotation improves breadth relative to the current AI-generated guide; it cannot prove that the guide itself contains every official objective.
- Aggregate history cannot detect a paraphrased repeat within an already-covered topic across completed sessions. The live-model canary checks this qualitatively; a hard cross-session semantic no-repeat guarantee would require a separate retention decision.

## Cross-Cutting Validation

- [x] Prove the full API path from authenticated user and current guide through history lookup, quota allocation, AI generator input, validation, and persisted completion breakdown.
- [x] Verify normal and weak-topic simulations remain distinct paths with their current domain/eligibility behavior.
- [x] Confirm existing history remains aggregate-only and owner-scoped.
- [x] Review the bounded generation canary against the repeated objective families identified in Q1/Q2; record the reviewed topic allocations and remaining same-topic overlap above.

## Open Questions

- The supplied sample's high topic-ID overlap (18/20) shows that the bounded two-exposure rotation changes only a small part of each run; topic allocation does not promise item-level semantic deduplication.
- The sample's Cloud Run regional-failover question omits explicit automated service-health/outlier configuration, and its private-IP Cloud SQL question omits the required VPC egress path. These are deferred generation-quality refinements; no question content is retained in history.
- If item-level semantic deduplication across completed simulations becomes a requirement, decide separately whether retaining privacy-preserving fingerprints or embeddings is acceptable; do not store question text by default.
