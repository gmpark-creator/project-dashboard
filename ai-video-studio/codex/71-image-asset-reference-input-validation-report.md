# Codex R71 - Image asset reference input validation report

## Why

External image registration and shot reference attachment trusted request body casts. Missing labels or URLs reached service exceptions, while invalid image roles, aspect ratios, asset ids, or reference modes could diverge from the documented API contract.

## Implemented

- Validates `POST /api/projects/{projectId}/assets` before registering an external image:
  - requires non-empty `label` and `url`
  - requires `role` to be a domain `ImageAssetRole`
  - validates optional `aspect`
  - validates optional `prompt` and `rightsConfirmed` types
- Validates `POST /api/shots/{shotId}/references` before attaching an image:
  - requires an `img_` asset id shape
  - requires a domain `AssetUsageMode`
- Documents 400 `ErrorResponse` bodies for both routes.

## Notes

- Valid external image and shot reference requests are unchanged.
- Entity lookup failures are still handled by the existing mock-service behavior; this round only validates malformed request input.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid external image role returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid shot reference mode returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid external image registration returning 201 with the requested role/aspect.
- HTTP smoke for valid shot reference attachment returning 202 with the asset linked to the shot.
