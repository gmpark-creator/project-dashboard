# Codex R55 - Cost estimate affordability report

## Why

The cost estimate API returned only projected credits and ETA. That is enough to show a price, but not enough for the UI or an API client to decide whether a reserve action is currently affordable before creating jobs.

## Implemented

- Added a `CostEstimate` domain type.
- Extended `CostEstimate` with:
  - `availableCredits`
  - `affordable`
  - `shortfallCredits`
- `estimateCost()` now evaluates affordability from the current mock credit state.
- Render preview estimates use the same `CostEstimate` shape.
- Updated the domain schema and contract validation coverage.
- Added mock-flow coverage for affordable and insufficient-credit estimate states.

## Notes

- This does not yet block reservation APIs. It creates the explicit estimate contract needed for insufficient-credit recovery UX and later server-side reservation guards.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP service smoke on port `3020`: `POST /api/cost/estimate` returned `credits`, `etaSec`, `availableCredits`, `affordable`, and `shortfallCredits`.
