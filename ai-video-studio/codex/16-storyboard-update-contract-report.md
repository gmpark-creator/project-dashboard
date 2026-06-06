# Codex R14 - Storyboard update contract report

## Scope

R4 left storyboard shot editing as a P2 gap, and OpenAPI already described `updateStoryboard` without a matching Next route or mock-service implementation. This round closes that contract so Claude can build storyboard edit UX without touching server code.

## Implemented

- Added `updateStoryboard(projectId, input)` in mock service.
- Added `PUT /api/projects/[projectId]/storyboard`.
- Added `studioApi.updateStoryboard(projectId, input)`.
- Added `StoryboardUpdateInput` schema def.
- Updated OpenAPI `updateStoryboard` request and response:
  - request: `StoryboardUpdateInput`
  - response: `ProjectBundle`
- Updated contract validation to require `updateStoryboard` and `StoryboardUpdateInput`.

## Behavior

- Existing scenes are updated by id.
- Existing shots are updated by id.
- Editable shot fields include order, scene, title, duration, SAEC, requirements, and direction spec.
- If a shot's render-affecting content changes, the selected take is cleared and quality flags are reset so old generations are not mistaken for the new prompt.
- Existing take history is preserved.
- The returned bundle includes the refreshed `renderSourceHash`.

## Verification Coverage

`mock-flow.test.ts` now checks:

- scene title changes persist
- shot title changes persist
- SAEC action changes persist
- storyboard edits change `ProjectBundle.renderSourceHash`

## Claude Handoff

Claude can implement R4-07 storyboard editing by calling:

```ts
studioApi.updateStoryboard(projectId, { shots: [updatedShot] })
```

The UI should reload/use the returned `ProjectBundle` so storyboard cards, compare state, and export preview freshness stay in sync.
