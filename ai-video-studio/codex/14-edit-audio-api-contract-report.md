# Codex R12 - Edit and audio API contract report

## Scope

The app already had mock-service functions and OpenAPI entries for edit/audio state, but the Next routes were missing and the frontend API kept `setAudio` as a no-op. This round connects the contract end to end so Claude can build the Edit UX on real app APIs.

## Implemented

- Added `POST /api/projects/[projectId]/edits`
  - Calls `applyEdit(projectId, command)`
  - Returns `EditState`
- Added `PUT /api/projects/[projectId]/audio`
  - Calls `setAudio(projectId, patch)`
  - Returns `EditState`
- Added `studioApi.applyEdit(projectId, { command })`
- Replaced `studioApi.setAudio` no-op with a real `PUT /audio` request.
- Added schema defs:
  - `EditCommandInput`
  - `EditAudioPatch`
- Updated OpenAPI request/response bodies for edit/audio state.
- Updated contract validation to require `applyEdit`, `setAudio`, and the new edit/audio schema defs.

## Verification Coverage

- `mock-flow.test.ts` now checks that:
  - `setAudio` persists caption enabled/mode values
  - audio changes alter `ProjectBundle.renderSourceHash`
  - render preview source hash matches the bundle after edit/audio changes

## Claude Handoff

Claude can now wire the Edit view controls without touching Codex-owned server code:

- text command submit -> `studioApi.applyEdit(projectId, { command })`
- caption/BGM/voiceover controls -> `studioApi.setAudio(projectId, patch)`
- reload bundle after each successful mutation to refresh `editState` and `renderSourceHash`

The audio/edit endpoints still operate in mock mode, but they are now real Next API routes with typed contract coverage.
