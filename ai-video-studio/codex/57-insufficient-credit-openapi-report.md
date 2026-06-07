# Codex R57 - Insufficient credit OpenAPI report

## Why

R56 added HTTP 402 handling for reserve-backed APIs, but the OpenAPI contract still documented only successful queue responses. API clients need the insufficient-credit response shape to handle top-up, downgrade, or retry UX without relying on undocumented runtime behavior.

## Implemented

- Added `InsufficientCreditsResponse` to the domain schema.
- Added contract validation coverage for the new schema definition.
- Documented HTTP 402 responses for reserve-backed operations:
  - image job creation
  - single shot generation
  - generate-all
  - regeneration
  - publishing-quality upgrades
  - render job creation
- Corrected the image job success response from `201` to `202` to match the route implementation.

## Notes

- This does not add payment or top-up APIs. It documents the failure contract those flows will consume.
- The response reuses `CostEstimate` so clients receive requested credits, available credits, affordability, and shortfall in one payload.

## Verification

- `npm run validate:contracts`
- `npm run build`
- `npm run typecheck`
- `npm run test:mock`
- `npm audit --omit=dev`
- Direct OpenAPI JSON smoke for all six reserve-backed operations with HTTP 402 response coverage.
