# R191 - Live Image Asset Delete

## Scope

- Added live state mutation support for image asset deletion.
- Connected `DELETE /projects/{projectId}/assets/{assetId}` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production image asset deletion still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the route calls `deleteLiveImageAsset(...)`.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Used assets return a blocked delete result without mutation unless `force=true`.
- Forced deletes remove asset usages, remove shot reference ids, refresh reference-related shot requirements, remove reference board buckets, clear image-job variant pointers, delete related media artifacts, delete the image asset row, and commit in one transaction.
- Missing assets still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, blocked/forced delete behavior, and image asset deletion.
