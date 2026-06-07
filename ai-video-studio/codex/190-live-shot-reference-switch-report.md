# R190 - Live Shot Reference Switch

## Scope

- Added live state mutation support for shot reference attach/detach.
- Connected `POST /shots/{shotId}/references` and `DELETE /shots/{shotId}/references/{assetId}` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production reference attach/detach still returns `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, the routes call the live reference write adapter.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Attach locks the shot and image asset, inserts `cutpilot_asset_usages`, upserts the reference board, updates `reference_image_ids`, refreshes reference-related shot requirements, and commits in one transaction.
- Detach locks the shot and image asset, removes shot-level `cutpilot_asset_usages`, removes the shot reference id, refreshes reference-related shot requirements, and commits in one transaction.
- Missing shots/assets still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, asset usage inserts/deletes, and shot reference persistence.
