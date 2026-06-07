# R205 - Live Worker Completion Snapshot

## Scope

- Added live worker completion snapshot reads for `GET /api/system/worker-completions`.
- Split `buildWorkerCompletionSnapshotFromJobs(...)` so persisted job rows can use the same receipt builder as mock state.
- Kept production mock completion reads fail-closed unless live reads are enabled.

## Behavior

- When `CUTPILOT_ENABLE_LIVE_READS=1`, the route calls `getLiveWorkerCompletionSnapshot()`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Default production completion reads now return `MOCK_READ_UNAVAILABLE` after system access succeeds.
- Live completion snapshots read terminal generation, image, and render jobs plus persisted media artifacts and credit transactions.

## Verification

- Extended `scripts/live-persistence-read-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-read-boundary.test.ts`.
- Updated `npm run validate:contracts` guards for route linkage, live runtime export, persisted snapshot builder, live persistence failure handling, and production mock read failure.
- Passed `npm run typecheck`.
- Passed `npx tsx scripts/live-persistence-read-adapter.test.ts`.
- Passed `npx tsx scripts/live-persistence-runtime.test.ts`.
- Passed `npx tsx scripts/production-read-boundary.test.ts`.
- Passed `npm run validate:contracts`.
