# R186 - Live Edit Audio Switch

## Scope

- Added live state mutations for project edit commands and audio/edit settings.
- Connected `POST /projects/{projectId}/edits` and `PUT /projects/{projectId}/audio` to the live write runtime switch.
- Kept default production behavior fail-closed.

## Behavior

- Default production edit/audio updates still return `MOCK_MUTATION_UNAVAILABLE`.
- When `CUTPILOT_ENABLE_LIVE_WRITES=1`, edit/audio routes call the live write adapter.
- Missing `DATABASE_URL` returns `LIVE_PERSISTENCE_UNAVAILABLE`.
- Live edit state updates lock the project row, lock or create the edit-state row, upsert `cutpilot_project_edit_states`, and commit in one transaction.
- Edit commands mark the project as `edited`; audio updates keep the project status and refresh its timestamp.
- Missing projects still normalize to `NOT_FOUND`.

## Verification

- Extended `scripts/live-persistence-write-adapter.test.ts`.
- Extended `scripts/live-persistence-runtime.test.ts`.
- Extended `scripts/production-state-mutation-boundary.test.ts`.
- Updated `npm run validate:contracts` to guard route linkage, live write switch handling, live persistence failure handling, and edit-state upsert behavior.
