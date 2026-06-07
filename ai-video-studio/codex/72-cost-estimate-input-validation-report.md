# Codex R72 - Cost estimate input validation report

## Why

`POST /api/cost/estimate` accepted any action string and untrusted params. Unknown actions fell back to an arbitrary default cost, and invalid `takeCount` values could produce nonsensical estimates.

## Implemented

- Validates the request body is a JSON object.
- Restricts `action` to the known cost estimate actions used by the mock service.
- Allows optional `params`, but requires it to be an object when present.
- Validates optional `params.takeCount` as an integer of 1 or greater.
- Updates OpenAPI to document the action enum and typed optional params.

## Notes

- Valid estimates for known actions are unchanged.
- The OpenAPI request body now matches the route behavior: `action` is required, while `params` is optional.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid cost action returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid `takeCount` returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid `generateShot` estimate returning 200 with expected credits.
