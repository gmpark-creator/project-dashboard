# Codex R16 - File-backed mock state report

## Scope

The app UI presents the project as auto-saved, but the mock service previously kept state only in `globalThis`. A dev server restart could lose projects and media state. This round adds file-backed local persistence for the mock service while keeping the same API surface.

## Implemented

- Added disk load/save around the existing `StudioState`.
- Default state file:
  - `studio-app/data/cutpilot-mock-state.json` when running from the app directory
- Added environment controls:
  - `CUTPILOT_MOCK_PERSIST=0` disables disk writes/reads
- `write()` now atomically writes JSON through a temporary file and rename.
- `state()` now loads the persisted JSON on first access, then runs existing normalization/migration.
- `resetMockState()` writes the reset state only when persistence is enabled.
- Added `reloadMockStateFromDisk()` for tests and diagnostics.
- Added `.cutpilot-mock-state*.json` to `.gitignore`.
- Added `data/cutpilot-mock-state*.json` to `.gitignore`.

## Verification Coverage

`mock-flow.test.ts` now includes a focused persistence check:

- create project with persistence enabled against the default local state file
- back up any existing local mock state before the check
- clear the in-memory cache via `reloadMockStateFromDisk()`
- verify the project reloads from disk
- restore the previous local mock state after the check
- disable persistence for the main mock flow so tests do not overwrite a developer's app state

## Notes

- This is still a mock/local persistence layer, not production storage.
- It materially improves the current "auto-save" development experience and keeps the path open for a real database-backed repository later.
- No UI contract changes were needed.
