# Codex R25 - System admin access contract report

## Why

The mock app now exposes system readiness, system metrics, and media artifact inventory endpoints. Those are useful for operations, but in production they should not be public because they reveal deployment state, aggregate usage, artifact metadata, and storage cleanup signals.

This round adds a production-only admin access guard for `/api/system/*`.

## Implemented

- Added `src/server/system-access.ts`.
- Applied the guard to:
  - `GET /api/system/readiness`
  - `GET /api/system/metrics`
  - `GET /api/system/media-artifacts`
- Added `CUTPILOT_ADMIN_TOKEN` to runtime readiness checks.
- Added a Korean UI label for the new readiness check id `admin_access`.
- Extended mock-flow tests for:
  - mock mode allows system endpoints without a token
  - production mode without `CUTPILOT_ADMIN_TOKEN` fails closed with 503
  - production mode without request credentials returns 401
  - production mode accepts either `Authorization: Bearer <token>` or `x-cutpilot-admin-token`
- Updated OpenAPI responses for the protected system endpoints.

## Access policy

- Mock mode remains open so local UX and QA flows keep working without secrets.
- Production mode requires `CUTPILOT_ADMIN_TOKEN`.
- Accepted request credentials:
  - `Authorization: Bearer <CUTPILOT_ADMIN_TOKEN>`
  - `x-cutpilot-admin-token: <CUTPILOT_ADMIN_TOKEN>`
- Token comparison uses `timingSafeEqual`.

## Readiness

Runtime readiness now includes:

- check id: `admin_access`
- env name: `CUTPILOT_ADMIN_TOKEN`
- mock mode: missing token is a warning
- production mode: missing token is a failure and `ready=false`

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`

## Notes

- This is not full user authentication.
- It is an operations endpoint guard for the current mock/runtime surfaces.
- A future production app should replace the shared token with real admin auth/session middleware.
