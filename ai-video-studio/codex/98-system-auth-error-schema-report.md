# Codex R98 - System auth error schema report

## Why

System routes return full `ErrorResponse` bodies for production admin failures, but OpenAPI documented many 401 and 503 responses without JSON content schemas.

## Implemented

- Added `ErrorResponse` content schemas to every `/system/*` 401 and 503 OpenAPI response.
- Extended `validate-contracts.ts` so system 401 and 503 responses must reference `ErrorResponse`.

## Notes

- Runtime behavior is unchanged.
- Result-shaped worker conflict responses such as 404/409 are left as their existing route contracts.

## Verification

- `npm run verify`
- Direct OpenAPI scan for error statuses without schemas.
- `git diff --check`
