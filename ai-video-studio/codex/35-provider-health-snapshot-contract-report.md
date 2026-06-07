# Codex R35 - Provider health snapshot contract report

## Why

Provider health overrides already affect routing, but the current mock runtime had no admin-readable health snapshot. That made it hard to verify which provider/model targets are healthy, degraded, or down before a route is selected.

This round adds a read-only provider health snapshot contract.

## Implemented

- Added `ProviderHealthStatus`, `ProviderHealthTarget`, and `ProviderHealthSnapshot` domain types.
- Moved provider health status typing into the domain contract.
- Added `getProviderHealthSnapshot()` to `provider-routing.ts`.
- Added admin-protected `GET /api/system/provider-health`.
- Added JSON Schema definitions and root schema property for provider health.
- Added `getProviderHealthSnapshot` to OpenAPI.
- Extended `validate-contracts.ts` to require the new definitions and operation.
- Extended `mock-flow.test.ts` to verify:
  - baseline health covers configured provider models
  - baseline health is all healthy
  - down overrides are reflected with reason and checked timestamp
  - down summary counts update
  - reset clears down health
  - routing still rejects down targets with `provider_health`

## Snapshot response

The response includes:

- `generatedAt`
- `summary`
  - total
  - healthy
  - degraded
  - down
- `targets`
  - provider
  - model
  - health status
  - reason
  - checked timestamp
  - supported input kinds
  - audio capability

## Access

`GET /api/system/provider-health` uses the existing production-only system admin guard:

- mock mode: open for local QA
- production mode: requires `CUTPILOT_ADMIN_TOKEN`

## Notes

- This is an internal operations contract. Provider/model names remain hidden from end-user UI.
- Health overrides are still in-memory in the mock runtime.
- A production implementation can feed this snapshot from provider polling, operator configuration, request failure telemetry, or a dedicated health table.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/provider-health` returned provider/model health counts from the dev server.
