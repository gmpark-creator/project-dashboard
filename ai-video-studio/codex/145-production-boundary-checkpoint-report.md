# Codex R145 - Production boundary checkpoint report

## Scope

Checkpoint for the Codex autonomous pass from R138 through R144.

## Codex Completed

- Added a story decomposer adapter boundary; mock remains usable, while live `openai` and `anthropic` decomposers fail closed until implemented.
- Added readiness coverage for `DECOMPOSER_PROVIDER` and story decomposer availability.
- Required production worker completions to provide app-managed storage keys for image, provider-generation, and render outputs.
- Added route-level coverage for production worker completion storage-key enforcement.
- Added a mock-only object storage deletion boundary so production storage cleanup cannot delete metadata before live object deletion is implemented.
- Added contract validation that keeps the storage cleanup object deletion boundary, route 503 mapping, OpenAPI docs, and readiness status in sync.
- Closed the public mock tick route in production and handled tick failures in the frontend interval to avoid unhandled runtime errors.

## Verification

Each implementation commit in this pass was verified locally with `npm run verify` before push.

GitHub Actions completed successfully through R144.

This checkpoint report was also verified locally with `npm run verify` before commit.

## Current Production Boundary State

- Production readiness intentionally remains not ready until live story decomposer and live object deletion adapters are implemented.
- Successful production worker completions now require HTTPS output URLs and the expected app-owned storage keys.
- Storage cleanup can still run in mock mode, but production cleanup fails closed with `OBJECT_STORAGE_UNAVAILABLE` before metadata mutation.
- `/api/jobs/tick` remains available for mock preview, but production receives `MOCK_TICK_UNAVAILABLE`.

## Codex Remaining Work

- Implement real story decomposer adapters after provider choice, API keys, request shape, response schema, and cost policy are finalized.
- Implement real object storage upload/delete adapters after R2/S3 target, signing method, retention policy, and audit semantics are finalized.
- Implement provider/image/render worker execution adapters after provider credentials, account entitlements, webhook or polling model, and failure taxonomy are finalized.
- Replace mock persistence with production database, queue, migration, backup, and retention decisions.
- Continue adding narrow contract guards before widening any production adapter surface.

## Claude Coordination

- Claude should continue browser UX QA, visual review, flow ergonomics, copy review, and preview artifact review.
- Claude can verify that production-boundary failures do not create confusing UI states, but should report findings rather than changing Codex-owned contracts directly.
- Claude should not modify API schemas, OpenAPI routes, route status behavior, verification scripts, CI, provider routing, or production readiness semantics unless explicitly coordinated.

## User-Facing Summary

The app is now safer as a mock-verified MVP: it clearly separates mock preview behavior from production execution and fails closed where live adapters are not yet implemented. The remaining completion work is real production integration, not more mock contract hardening.
