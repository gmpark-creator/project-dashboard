# Codex R15 - Default render version contract report

## Scope

R4/R12 export playback work still lacked a persisted "default version" for 6s/15s/30s render outputs. This round adds a small contract so the UI can offer version tabs and let the user choose which completed render is the default.

## Implemented

- Added `Project.defaultRenderJobId`.
- Existing in-memory projects are normalized with `defaultRenderJobId: null`.
- New projects start with no default render.
- The first completed render job becomes the default automatically.
- Added `setDefaultRender(projectId, renderJobId)` in mock service.
- Added `POST /api/projects/[projectId]/default-render`.
- Added `studioApi.setDefaultRender(projectId, renderJobId)`.
- Updated OpenAPI and domain schema.
- Updated contract validation to require `setDefaultRender`.

## Behavior

- Only completed render jobs can become the default.
- The selected default render must belong to the project.
- Selecting a default render also refreshes the project thumbnail poster.
- The API returns a refreshed `ProjectBundle`.

## Verification Coverage

`mock-flow.test.ts` now checks:

- completed projects auto-select a default render version
- the 15s render can be selected as the default
- `Project.defaultRenderJobId` persists after selection

## Claude Handoff

Claude can implement export version tabs with:

```ts
studioApi.setDefaultRender(projectId, renderJobId)
```

Use `bundle.project.defaultRenderJobId` to mark the active/default version. Keep download/share/player behavior on existing `RenderJob.outputUrl` and `shareUrl`.
