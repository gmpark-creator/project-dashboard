# Contract And Role Checkpoint

## Scope

Checkpoint for the Codex autonomous pass from R121 through R126.

## Codex Completed

- Added reverse OpenAPI coverage for every implemented Next API route.
- Documented `POST /jobs/tick` and changed its public response to `JobQueueSnapshot`.
- Aligned the frontend tick client with the documented queue snapshot response.
- Added route-level production system access tests.
- Added contract validation that every mock test file is wired into `npm run test:mock`.
- Aligned `Saec` naming between TypeScript and the domain schema.
- Added `AssetSource` and `StudioState` schema definitions.
- Added contract validation requiring every exported TypeScript domain type to have a schema definition.

## Verification

Each implementation commit in this pass was verified locally with `npm run verify` before push.

GitHub Actions completed successfully through R126.

## Claude Coordination

Claude-owned work should stay focused on browser UX QA, visual polish, interaction review, copy review, and preview artifacts.

Claude should not modify Codex-owned API contracts, route behavior, schema definitions, provider routing config, or verification scripts unless explicitly coordinated.

## Current Codex Surface

The Codex-owned mock-production surface now has automated guards for:

- OpenAPI to route coverage and route to OpenAPI coverage.
- Operation ID coverage and uniqueness.
- Request body parser usage and request schema closure.
- Response schema closure and error response schema families.
- Path parameter, query parameter, and system access runtime behavior.
- Service error, credit error, tick route, and system route runtime behavior.
- Domain schema reference resolution, object closure, enum uniqueness, required-property integrity, and TypeScript type coverage.
- Test command inclusion for every mock test file.

## Remaining Production Work

- Real provider adapters require credentials, entitlement checks, provider-specific request/response mapping, and failure taxonomy.
- Production persistence still needs database, queue, object storage, retention, and migration choices.
- User auth, billing, usage limits, and organization/workspace boundaries remain product and service decisions.
- Worker deployment topology, retry runbooks, and observability dashboards remain outside the mock contract.
- Claude UX QA should continue validating the actual browser workflow against the stabilized API surface.
