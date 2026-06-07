# R176 - Postgres Migration Runner

## Scope

- Added a live persistence migration runner for `cutpilot_postgres_v1`.
- Added `pg` as the runtime Postgres client dependency and `@types/pg` for TypeScript.
- Kept route behavior unchanged; production public APIs still fail closed until live adapters are wired.

## Implementation

- `src/server/live-persistence-migrations.ts`
  - reads `codex/persistence/postgres-schema.sql`
  - computes a SHA-256 checksum
  - splits SQL into statements
  - applies the migration in a transaction
  - records version/checksum in `cutpilot_schema_migrations`
  - skips replay when the same checksum is already recorded
  - rolls back on checksum mismatch or apply failure
- `scripts/apply-persistence-migrations.ts`
  - supports `--dry-run`
  - requires `DATABASE_URL` for live execution
  - supports optional `DATABASE_SSL=1`

## Commands

- `npm run db:migrate:dry-run`
- `npm run db:migrate`

## Verification

- Added `scripts/persistence-migration-runner.test.ts`.
- Added migration runner coverage to `npm run test:mock`.
- Updated `npm run validate:contracts` to guard the migration runner, dry-run command, and migration record table.
