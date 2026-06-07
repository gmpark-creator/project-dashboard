# Contract Verification Checkpoint

## Scope

Checkpoint for the Codex autonomous pass from R128 through R136.

## Codex Completed

- Added TypeScript string literal union to JSON Schema enum parity validation.
- Added route success status to OpenAPI response parity validation.
- Added route path/query parameter parity validation.
- Added explicit route status documentation validation.
- Added an allowlist for intentional schema-only domain helper definitions.
- Closed and validates the root domain schema object.
- Added OpenAPI JSON-only content type validation.
- Added required OpenAPI response description validation.
- Added a guard that keeps the local `verify` command and CI workflow on the full validation chain.

## Verification

Each implementation commit in this pass was verified locally with `npm run verify` before push.

GitHub Actions completed successfully through R136.

## Current Codex Surface

The Codex-owned mock-production contract surface now has automated guards for:

- OpenAPI path, operation, method, status, parameter, request body, response schema, content type, and response description coverage.
- Next route to OpenAPI coverage and OpenAPI to Next route coverage.
- Runtime guard usage for JSON bodies, path params, boolean query params, system access, service errors, credit errors, and explicit route statuses.
- Domain schema reference resolution, root closure, object closure, enum uniqueness, required-property integrity, TypeScript type coverage, TypeScript string-union enum parity, and schema-only helper allowlisting.
- Test command inclusion for every mock test file.
- Local and CI verification chain completeness.

## Claude Coordination

Claude-owned work should stay focused on browser UX QA, visual polish, interaction review, copy review, and preview artifacts.

Claude should not modify Codex-owned API contracts, route behavior, schema definitions, provider routing config, verification scripts, or CI workflow unless explicitly coordinated.

## Remaining Production Work

- Real provider adapters require credentials, entitlement checks, provider-specific request/response mapping, polling/webhook handling, and failure taxonomy.
- Production persistence still needs database, queue, object storage, retention, backup, and migration choices.
- User auth, billing, usage limits, workspace boundaries, and admin roles remain product and service decisions.
- Worker deployment topology, retry runbooks, production observability, and incident operations remain outside the mock contract.
- Claude UX QA should continue validating the actual browser workflow against the stabilized API surface.
