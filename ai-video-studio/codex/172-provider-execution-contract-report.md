# R172 - Provider Execution Result Contract

## Scope

- Added `src/server/provider-execution-contract.ts`.
- Kept this as a provider adapter contract increment; no live provider SDK call is introduced.

## Contract

- Contract version: `provider_execution_v1`.
- Adapter results are normalized as:
  - `submitted` or `polling` with provider request id and retry timing.
  - `succeeded` with provider source video/poster URLs that still require storage ingest.
  - `failed` with stable provider error codes.
- Added `PROVIDER_UNAVAILABLE` as the fail-closed result for the not-yet-implemented live adapter.

## Verification

- Added `scripts/provider-execution-contract.test.ts`.
- Added provider execution contract coverage to `npm run test:mock`.
- Updated `npm run validate:contracts` to guard the result contract, unavailable error code, and readiness linkage.
