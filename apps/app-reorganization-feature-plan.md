# Feature plan: App organization, errors, and logging

**Status:** Approved — implementation in progress; production and manual verification outstanding  
**Scope decision:** Web first, then API. Standardize and improve English and Spanish error messages. Use structured application logs collected by the existing hosting platform.

## Objective

Make Cert Prep easier to maintain and production failures easier to diagnose. Organize the web application into cohesive React components and hooks; make errors understandable and actionable in both languages; and improve server error handling and safe, structured diagnostics. Preserve existing product behavior, data, identity, and public API compatibility during the refactor.

## Current evidence

- `apps/web/pages/index/+Page.tsx` has 1,389 lines, with state and request orchestration alongside the header, settings, home screen, topic card and other UI. `SimulationScreens.tsx` has 503 lines and combines quiz, question, results and error mapping. The stylesheet has 2,783 lines. Size alone is not the extraction rule: responsibilities and state ownership determine boundaries.
- The three web API clients independently parse responses and define error classes; message selection appears in the page and multiple components. Some screens already expose accessible alert and retry states. Inventory all routes and states before consolidating them.
- `apps/api/src/app.ts` emits structured request failure events with status and code. Its request-completion events are `info`, which the current logger suppresses in production. Some service errors lose their underlying cause before the handler logs them. Existing error detail helpers need review for accidental disclosure of provider output and sensitive data.
- Advanced practice collapses file loading, mapping, compatibility and selection failures into `ADVANCED_BANK_UNAVAILABLE`. The API loads six files and a mapping from disk. A changed guide can invoke an AI compatibility check. The actual production cause remains unknown; the deployed image, working directory, files, mapping and production guide must be checked before claiming a root cause. A local Docker build-context check successfully copied the advanced bank data directory despite the `.dockerignore` entry; this does not establish what production deployed.
- `packages/contracts/src/contracts.ts` defines the existing `{ error: { code, message } }` response. Accepted ADR 0001 preserves separate workspaces and one same-origin Vike/Hono process; ADR 0003 governs the advanced bank, compatibility checks, confidentiality and review lifetime.

## Boundaries and decisions

- Modify files only under `apps/`, including any new tests and this plan. Existing root tests and commands may be run without changing them. Do not edit root deployment files, shared contracts, docs, lockfiles or external configuration. If a required fix or decision needs those files, document the blocker and obtain a change in scope before implementing it.
- Keep existing HTTP response shape, status codes and externally observable error codes compatible. Use internal diagnostic classifications for more precise logs. Any proposal to alter public contracts must be separately approved and would require authorization to edit `packages/contracts`.
- Keep `/api/*` same origin, Vike and Hono in one process, gateway identity and PostgreSQL behavior. Preserve stored session compatibility, answer secrecy, question quotas, advanced-bank behavior and localization. No new monitoring vendor or dependency is assumed.
- Improve wording in English and Spanish, including a meaningful fallback for unknown errors. Preserve existing recovery behavior and add recovery actions only where safe and supported by the actual operation; never automatically retry a non-idempotent action or overwrite an active session.
- Architectural, data, security, operational or dependency decisions require an ADR under `docs/decisions/` according to repository instructions. Since the user restricts edits to `apps/`, flag any such decision in this draft for separate approval and authorization to record it; do not silently treat it as accepted. A solution requiring no new such decision may proceed after plan approval within the existing ADRs.

## Proposed design and work sequence

### 1. Establish the baseline and error inventory

- Trace all user journeys: identity, catalog and guide, start/resume/answer/finish simulations, review and explanations, history, weak topics, study plans and settings. Record error code, HTTP status, owning operation, English and Spanish wording, recovery action and whether existing state survives.
- Map request parsing, error conversions, swallowed causes, logging and operation boundaries. Identify whether errors can leak secrets, prompt/model output, private questions or answer keys. Inspect current tests and build before moving code.
- Investigate the advanced-bank production path: compare deployed revision and packaging method, presence/readability of all six files and mapping from the process working directory, then assess fingerprint/guide compatibility, quota and AI failures. Compare identifiers or fingerprints only, never print bank contents. Actual production diagnosis is contingent on access; no production changes are implied.

### 2. Web: organize flows and components

- Keep the Vike page as a composition entry point. Extract the header, settings, dashboard/home, guide display, processing state and reusable alert/loading elements to focused components under `apps/web/src/`, grouping feature-specific pieces with their flows. Split quiz, question and results views in `SimulationScreens.tsx` into separately owned components. Extract hooks or controllers for certification selection, session lifecycle and associated queries when they own a cohesive state transition.
- Keep state at the lowest common owner that preserves transitions and async behavior; avoid moving logic into presentation components or introducing a global store without a demonstrated need. Preserve query cache keys, cancellation, error boundaries, session ownership, accessibility, focus, keyboard behavior, loading and responsive styles. Split styles by feature if it clarifies ownership without changing cascade or visuals.
- Centralize HTTP response parsing and a typed internal client error abstraction while preserving fetch injection, validation with existing Zod schemas, status and abort semantics. Migrate clients incrementally and preserve public function signatures where possible. Treat intentional cancellation distinctly from an actionable failure.
- Centralize mapping of known codes and operation context to bilingual messages and recovery guidance. A shared accessible error presentation should support inline, panel and page contexts without forcing every failure into the same UI. Maintain distinct error, empty and loading states; avoid displaying raw server/provider messages.

### 3. API: diagnostics and error boundaries

- Inventory routes and service catches, then define an internal, stable taxonomy for failure category and operation. Keep the existing public envelope and codes while preserving safe internal causes through service boundaries. Unanticipated failures receive a generic public response.
- Use one consistent structured event per failure at an appropriate ownership boundary, and define when request completion events are enabled to limit noise. Record only explicitly allowed fields such as event, operation, safe category, code, status, duration and a server-generated correlation ID where supported. Do not trust incoming IDs without validation. Normalize route names rather than logging dynamic user/session paths or query strings. Avoid duplicate error reports.
- Do not log credentials, authorization headers, user identifiers, prompts, model responses, question text, choices, correct answers, full request/response bodies, or arbitrary provider exception messages/stacks. Audit existing logging paths and use allowlisted diagnostic reason codes; redaction alone is not a guarantee. Confirm the hosting platform's actual collection, retention and access controls before claiming observability is in place.
- For advanced-bank failures, distinguish safe internal reasons: asset read/parse, mapping or fingerprint, guide compatibility/provider failure, and selection/coverage. Preserve the existing public error code and privacy boundaries. If production assets are absent because of deployment configuration outside `apps`, document the evidence and request scope authorization for that fix; do not claim improved logs alone repair availability.

### 4. Integration and release review

- Integrate web and API in small, reviewable changes. Review behavior against the baseline and accepted ADRs. Do not add services, alter persistence, or migrate data as part of this plan. Record actual checks and unresolved failures in the plan as work proceeds.
- Verify a real deployed instance separately after release, if access is available: platform receives structured diagnostics, the advanced bank loads, and failures are distinguishable without sensitive content. A successful local build alone cannot establish production availability.

## Acceptance criteria

1. The Vike page composes focused components and state owners; quiz, results, dashboard and settings have clear ownership. Existing flows, navigation, session resumption, responsive behavior and accessibility remain intact.
2. Known errors across identity, guides, simulations, history, study plans and advanced practice show consistent, understandable English and Spanish messages; unknown/network/invalid-response errors have safe fallbacks. Applicable retry actions preserve existing data and sessions.
3. Existing API consumers receive compatible HTTP statuses, error codes and response shape; Zod validation and gateway authentication remain intact. No keys or private answers reach the browser before their existing authorized point.
4. For a representative failure in each major server operation, structured production error logs identify the operation and safe failure category without exposing protected content. Advanced bank failures distinguish asset, mapping, compatibility/provider and coverage causes in server diagnostics. Production collection is verified independently or explicitly reported as unverified.
5. The actual production bank issue is either evidenced and resolved within the permitted scope, or recorded with the necessary out-of-scope deployment change and evidence. A diagnosis is not inferred from the generic message alone.
6. Changes and any new tests are confined to `apps/`; no dependency, shared contract, infrastructure, database migration or externally visible API change is introduced without separate authorization. Relevant decisions are recorded through the repository ADR process when the user authorizes the necessary path.

## Validation plan

- Run `bun run typecheck`, `bun run build`, and relevant existing unit and route tests; run `bun test` when the integration database is available. PostgreSQL integration tests require `TEST_DATABASE_URL` with permission to create temporary databases; report any unavailable checks accurately.
- Add focused tests under `apps/` where needed: client network/invalid JSON/unknown code/cancellation behavior; bilingual mapping and accessible alerts; server compatibility and safe logging; bank failures for absent assets, malformed mapping, changed guide and insufficient coverage using fictional data and mocked AI. Check logs contain no injected secrets or question/answer content. Do not make paid AI calls in tests.
- Exercise critical flows manually in both languages and at mobile and desktop widths: sign-in failure/recovery, guide refresh failure, starting and resuming a simulation, answering and results, history, weak topics, study plans, and advanced practice. Check keyboard, focus and screen-reader announcements. Verify pending sessions are preserved when starting fails.
- Inspect the actual production image or equivalent artifact and its runtime path if available; a Docker build may require the external deployment context. Use safe file existence checks without printing bank content. Confirm collection of sanitized logs on the platform when access permits.

## Risks and rollback

- Refactoring asynchronous session state can lose in-progress work or change retries. Move one flow at a time, keep existing public interfaces, and verify state transitions and ownership.
- Consolidating errors can hide specific recovery guidance or change `instanceof` handling. Audit callers and use compatibility adapters while migrating.
- Logging can disclose sensitive content or become noisy. Restrict fields by allowlist, use synthetic privacy checks, and agree on event volume and platform access before release.
- Production guide changes and AI compatibility checks can still reject an advanced bank even when assets exist. Preserve ADR 0003 checks and exact quotas.
- Roll back the relevant app change or deploy the previous known-good image if regressions occur. Keep existing error response and persisted formats compatible to support rollback; no database migration is planned. A production fix requiring root deployment changes needs a separately authorized rollout and rollback plan.

## Approval and open items

This is a draft for human review, not authorization to implement. Confirm the plan before code changes as required by the repository's `AGENTS.md` and the `create-feature-plan` skill. The user requested edits only within `apps/`, so this draft is stored here instead of `docs/plans/`. Confirm production deployment access and whether the repository's ADR location may be edited if a new architecture, security or operations decision becomes necessary.


## Implementation progress (2026-11-25)

- Extracted app shell, home, resources, weak-topic, quiz, question and results components and the certification query hook. Centralized shared JSON request parsing and reusable bilingual error selection; maintained client-specific error classes and the existing API error envelope.
- Added safe request failure categories and generated request identifiers. Advanced-bank failures identify asset, mapping, compatibility, provider and coverage categories internally. Removed raw exception text, stacks and citation URLs from guide error diagnostics. Production collection is not verified.
- `bun run typecheck`, `bun run build` and `git diff --check` passed. `bun test` passed with 145 tests, including PostgreSQL integration tests. A local Docker build-context COPY confirmed the bank data directory is included. These checks do not verify the production image or deployment.
- Remaining: confirm the production bank failure and log collection using deployment access; perform the planned manual bilingual, responsive and accessibility checks; complete a comprehensive journey/error inventory and review remaining large state owners and duplicate guide failure events. No production changes have been made.

## Browser-accessible production diagnostics

- Added a server-generated request ID to API error response headers and an allowlisted diagnostic header for advanced-bank failures. The browser console logs only a fixed operation, safe error code, HTTP status, request ID and allowed reason; it does not log URLs, response bodies, credentials, question content, answers or provider text.
- Advanced-bank reasons distinguish asset reads, invalid assets, mapping, guide compatibility, provider configuration, timeout, request failure, invalid provider output and coverage. Diagnosis requires deploying the change and reproducing the failure; proxies must pass the headers through.
- Validation: `bun run typecheck`, `bun run build`, `git diff --check` and `bun test` passed; the full suite reported 147 passing tests, including PostgreSQL integration tests. Production deployment and diagnostics have not been verified.
