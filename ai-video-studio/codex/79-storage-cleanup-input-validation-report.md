# Codex R79 - Storage cleanup input validation report

## Why

`POST /api/system/storage-cleanup` accepted untrusted request bodies and let invalid `limit` values reach the service, where they could be floored or clamped instead of matching the OpenAPI contract.

## Implemented

- Validates the request body is a JSON object.
- Allows optional `limit`, but only as an integer of 0 or greater.
- Documents the route's 400 `ErrorResponse`.

## Notes

- Valid cleanup requests are unchanged.
- System access checks still run before request body validation.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid storage cleanup body returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid cleanup limit returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid cleanup limit returning 200 with execution summary.
