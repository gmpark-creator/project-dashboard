# Codex R74 - OpenAPI response validation report

## Why

The OpenAPI file had a duplicated `400` response under `createImageJob`, while `generateShot` was missing its documented 400 response. Because JSON parsing keeps only the last duplicate key, the existing contract validator could not catch this class of mistake.

## Implemented

- Removed the duplicated `400` response from `POST /projects/{projectId}/image-jobs`.
- Added the missing `400` `ErrorResponse` to `POST /shots/{shotId}/generate`.
- Extended `validate-contracts.ts` to scan raw OpenAPI JSON and fail on duplicate response status codes inside a `responses` object.

## Notes

- This is a contract/documentation correction; route behavior is unchanged.
- The duplicate-key check runs before parsing OpenAPI JSON so future duplicate response keys are caught.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm run build`
- `npm audit --omit=dev`
- OpenAPI smoke confirmed `createImageJob` and `generateShot` each expose one `400` response.
