# Codex R50 - Worker output storage key validation report

## Why

R49 made successful worker completions carry complete output URLs, but production workers also need to bind those outputs to the storage locations assigned by the dispatch invocation. A completion payload with a mismatched storage key should be rejected before mutating the job.

## Implemented

- Added optional storage key fields to `WorkerLeaseCompletionOutput`:
  - provider outputs: `videoStorageKey`, `posterStorageKey`
  - render outputs: `renderStorageKey`
  - image outputs: `imageStorageKey`, `thumbnailStorageKey`
- Worker completion now validates any supplied storage key against the expected job-owned path:
  - `projects/{projectId}/take/{takeId}/take_video`
  - `projects/{projectId}/take/{takeId}/take_poster`
  - `projects/{projectId}/renderJob/{jobId}/render_output`
  - `projects/{projectId}/imageJob/{jobId}/variants/{variantId}/image_asset`
  - `projects/{projectId}/imageJob/{jobId}/variants/{variantId}/image_thumbnail`
- Mismatched or cross-kind storage key fields are rejected with `invalid_outputs` before completion mutates state.
- Image output coverage now maps supplied outputs to distinct requested variants by `variantId` or position, preventing one output payload from covering multiple requested variants.
- Updated `domain.schema.json` and `mock-flow.test.ts` for the new completion contract.

## Notes

- Storage keys remain optional so existing mock-mode worker completions without storage ingestion metadata keep working.
- In production mode or `requireOutputs=true`, URL output requirements from R47-R49 still apply in addition to storage key validation.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP service smoke on port `3020`: image worker completion rejected a mismatched `imageStorageKey` with HTTP 422 `invalid_outputs`, then completed successfully with the invocation-provided `imageStorageKey` and `thumbnailStorageKey`.
