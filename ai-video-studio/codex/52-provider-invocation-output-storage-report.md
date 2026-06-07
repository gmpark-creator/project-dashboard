# Codex R52 - Provider invocation output storage report

## Why

Image and render worker invocations already include the exact storage locations workers should write to. Provider generation invocations only declared the output role, while R50 completion validation can now verify `videoStorageKey` and `posterStorageKey`. The dispatch contract should give provider workers those expected paths up front.

## Implemented

- Added `ProviderInvocation.outputs`.
- Provider invocations now include:
  - `outputs.video.role = "take_video"`
  - `outputs.video.container = "mp4"`
  - `outputs.video.storageKey = projects/{projectId}/take/{takeId}/take_video`
  - `outputs.poster.role = "take_poster"`
  - `outputs.poster.contentType = "image/jpeg"`
  - `outputs.poster.storageKey = projects/{projectId}/take/{takeId}/take_poster`
  - `outputs.poster.required = false`
- Updated the domain schema and mock-flow coverage.

## Notes

- This still does not call a live provider.
- Completion payloads may omit storage keys in mock mode, but when workers provide them the R50 validator now has a matching invocation contract to follow.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP service smoke on port `3020`: generated a provider job, fetched `GET /api/system/worker-dispatch`, and verified the provider invocation exposed the expected take video and poster storage keys.
