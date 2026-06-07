# Codex R80 - Worker lease request validation report

## Why

Worker lease create, release, and renew routes accepted cast request bodies. Invalid worker kinds, TTLs, or missing tokens reached service-level fallback behavior instead of returning the documented request validation response.

## Implemented

- Validates `POST /api/system/worker-leases`:
  - body must be an object
  - optional `workerId` must be a string
  - optional `kind` must be a worker dispatch kind or `any`
  - optional `ttlSec` must be an integer from 5 through 600
- Validates lease release requires a string `token`.
- Validates lease renew requires a string `token` and optional bounded `ttlSec`.
- Adds 400 `ErrorResponse` docs for create, release, and renew.
- Aligns `WorkerLeaseRequest` schema with route behavior by making `workerId` optional.

## Notes

- Valid worker lease behavior is unchanged.
- System access checks still run before request validation.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid worker lease kind returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid lease release token returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid lease renew TTL returning 400 with a full `ErrorResponse`.
