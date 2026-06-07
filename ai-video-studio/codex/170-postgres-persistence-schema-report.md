# R170 - Postgres Persistence Schema Contract

## Scope

- Added `codex/persistence/postgres-schema.sql` as the first live persistence schema contract.
- Kept this as a contract and verification increment; no production route is switched to live DB reads or writes yet.

## Contract Shape

- Core storyboard and production state is table-backed: projects, scenes, shots, takes, generation jobs, render jobs, image assets, image jobs, credit transactions, media artifacts, worker leases, and retry records.
- Provider attempt telemetry is split into `cutpilot_provider_attempts`.
- Asset/reference usage is represented through `cutpilot_reference_boards` and `cutpilot_asset_usages`.
- Complex structured payloads stay in JSONB where the TypeScript domain already models nested provider/render data, such as SAEC, direction specs, prompt packages, routing decisions, render plans, and rights review.

## Guardrails

- The schema intentionally does not introduce a single `StudioState` blob table.
- Child records are anchored to `cutpilot_projects` with cascade behavior.
- Worker-facing queues are indexed by status and due time.
- Selected/default references use deferrable constraints because dependent rows can be created in one transaction.

## Verification

- Added `scripts/persistence-schema-boundary.test.ts`.
- Added the persistence schema test to `npm run test:mock`.
- Updated `npm run validate:contracts` to require the schema contract and key live-persistence tables.
