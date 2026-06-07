# Codex R56 - Credit reservation guard report

## Why

R55 exposed affordability in cost estimates, but reserve-backed actions could still create jobs even when available credits were insufficient. Production needs reservation to fail before queue/job mutation so insufficient-credit recovery can be deterministic.

## Implemented

- Added `CreditReservationError` with an insufficient-credit `CostEstimate`.
- Added `assertCanReserveCredits()` before reserve-backed mutations.
- Guarded:
  - image job creation
  - single shot generation
  - generate-all
  - regeneration
  - publishing-quality upgrades
  - render job creation
- Reservation APIs now convert insufficient-credit failures into HTTP 402 responses:
  - `code: "INSUFFICIENT_CREDITS"`
  - `estimate` with `credits`, `availableCredits`, `affordable=false`, and `shortfallCredits`
- Added mock-flow coverage that insufficient credits fail before image jobs are queued.

## Notes

- This does not add payment or top-up flows. It creates the backend failure mode those UX flows need.
- Existing happy paths remain unchanged when credits are available.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Direct route-helper smoke: `CreditReservationError(48, 12)` converted to HTTP 402 with `code="INSUFFICIENT_CREDITS"` and `shortfallCredits=36`.
