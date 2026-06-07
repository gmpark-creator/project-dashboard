# Codex R54 - System metrics provider cost report

## Why

R53 added provider cost basis to individual credit transactions. Operations still need a summary-level view so `/api/system/metrics` can feed an admin cost dashboard without scanning every project bundle.

## Implemented

- Added `credits.providerCostUsd` to `SystemMetrics`.
- Added `credits.marginPolicyVersions` to `SystemMetrics`.
- System metrics now roll up provider cost from credit ledger entries.
- System metrics now expose the sorted set of margin policy versions observed in the ledger.
- Updated the domain schema and mock-flow metrics assertions.

## Notes

- This is an operations-only metric surface.
- Provider cost values are still mock cost basis until live provider adapters provide actual billing data.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP service smoke on port `3020`: `GET /api/system/metrics` returned a positive `credits.providerCostUsd` and included `sandbox-v1` in `credits.marginPolicyVersions`.
