# Codex R152 - Production persistence readiness report

## Scope

- Added a production readiness boundary for real persistence/database integration.
- Kept this as a readiness and verification increment; no database adapter implementation was added.

## Changes

- Added `DATABASE_URL` to runtime readiness env validation.
- Added URL-shape validation for supported database schemes: `postgres`, `postgresql`, `mysql`, and `sqlserver`.
- Added a `persistence` readiness check that fails in production until a live persistence adapter exists.
- Added `scripts/production-persistence-readiness.test.ts`.
- Wired the new test into `npm run test:mock`.

## Verified Behavior

- Missing `DATABASE_URL` is reported in production readiness.
- Invalid `DATABASE_URL` is reported in production readiness.
- Valid-shaped `DATABASE_URL` clears env validation but production still fails because live persistence is not implemented.
- Mock mode remains usable and only warns about missing persistence env.

## Verification

- Passed: `npm run test:mock`
- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
