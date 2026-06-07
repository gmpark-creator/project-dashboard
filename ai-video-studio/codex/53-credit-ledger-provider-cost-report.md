# Codex R53 - Credit ledger provider cost report

## Why

The credit ledger records reserve, capture, and refund events, but it did not carry the internal provider cost basis or margin policy version called out in the production architecture notes. That leaves billing history useful for user credits, but incomplete for operations, margin analysis, and provider cost dashboards.

## Implemented

- Added `providerCostUsd` and `marginPolicyVersion` to `CreditTransaction`.
- Added `sandbox-v1` as the current mock margin policy version.
- Capture transactions now include a deterministic mock provider cost basis.
- Reserve and refund transactions use `providerCostUsd: null` because they do not represent newly incurred mock provider cost.
- Existing persisted mock transactions are backfilled during state normalization.
- Updated the domain schema and mock-flow ledger invariants.

## Notes

- The provider cost is mock cost basis, not live provider billing.
- Real provider adapters should replace this with actual provider cost and margin policy inputs when live generation is connected.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP service smoke on port `3020`: created an image job and verified the reserve transaction returned `providerCostUsd=null`, then after mock completion verified the capture transaction returned a positive `providerCostUsd` and `marginPolicyVersion="sandbox-v1"`.
