# Codex R58 - API client credit error report

## Why

R56 and R57 created an explicit insufficient-credit failure contract, but the studio API client still flattened every failed response into a plain `Error`. That lost the HTTP status, error code, and estimate fields needed by top-up, downgrade, and retry UX.

## Implemented

- Added `InsufficientCreditsResponse` to the TypeScript domain types.
- Added an `ApiError` class for client requests.
- Preserved failed response metadata:
  - HTTP status
  - response code
  - retry and fallback flags
  - `CostEstimate` when present
- Formatted insufficient-credit messages with requested, available, and shortfall credits while keeping the server `userMessage`.

## Notes

- Existing success responses and `studioApi` method signatures are unchanged.
- The current UI already displays `Error.message` through the shared toast path, so reserve-backed actions now surface shortfall details without per-button rewiring.

## Verification

- `npm run typecheck`
- Direct API helper smoke with mocked HTTP 402 insufficient-credit response.
- `npm run test:mock`
- `npm run build`
- `npm audit --omit=dev`
- Local HTTP load check against the Next app.
