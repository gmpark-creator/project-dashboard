# Codex R77 - Storyboard update input validation report

## Why

`PUT /api/projects/{projectId}/storyboard` accepted scene and shot patch arrays through casts. Invalid patch fields could be silently ignored or merged into shot state, and the OpenAPI schema described full `Scene`/`Shot` objects even though the route uses partial patches.

## Implemented

- Added `isStoryboardUpdatePatch()` to validate storyboard update request bodies.
- Validates scene patches:
  - requires `scn_` ids
  - validates optional order/title/setting/time fields
- Validates shot patches:
  - requires `sht_` ids
  - validates optional scene id, order, title, and duration
  - validates optional `saec`, `requirements`, and `directionSpec` patch objects
- Updates `StoryboardUpdateInput` to use patch-specific schema defs instead of full `Scene`/`Shot` defs.
- Documents the route's 400 `ErrorResponse`.

## Notes

- Valid storyboard patch behavior is unchanged.
- Existing project/scene/shot lookup behavior for well-formed ids is unchanged.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid storyboard patch returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid storyboard patch returning 200 with the requested scene and shot changes.
