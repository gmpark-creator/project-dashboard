# Codex R65 - OpenAPI error response shapes report

## Why

R64 standardized several runtime API errors to return full `ErrorResponse` bodies. The OpenAPI contract still omitted those response bodies on some 400/404 paths, leaving clients without a documented schema for common validation failures.

## Implemented

- Added `ErrorResponse` body schemas for:
  - project creation 400
  - project bundle 404
  - take selection 400
  - cost estimate 400
  - render creation 400
  - default render 400
  - render preview 400

## Notes

- No runtime behavior changed in this round.
- Job cancellation 404 remains documented separately because that route returns `CancelJobResult`, not `ErrorResponse`.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm run build`
- `npm audit --omit=dev`
- Direct OpenAPI JSON smoke for the documented `ErrorResponse` refs.
