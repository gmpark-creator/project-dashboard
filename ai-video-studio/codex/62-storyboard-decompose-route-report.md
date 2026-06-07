# Codex R62 - Storyboard decompose route report

## Why

OpenAPI documented `POST /api/storyboard/decompose`, and the mock service already had `decomposeIdea()`, but the Next route was missing. That left clients unable to preview a structured storyboard without creating a project.

## Implemented

- Added `POST /api/storyboard/decompose`.
- Added request validation for:
  - missing idea
  - missing or invalid intent
- Added `studioApi.decomposeIdea()`.
- Added OpenAPI 400 response documentation.
- Added mock-flow coverage for preview scene/shot output.

## Notes

- This endpoint is read-only and does not create a project or mutate mock state.
- `script` and `attachments` remain accepted by the OpenAPI request shape for future decomposer adapters; the current mock implementation only uses `idea` and `intent`.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- OpenAPI route implementation smoke.
- HTTP smoke for `POST /api/storyboard/decompose` success and 400 behavior.
