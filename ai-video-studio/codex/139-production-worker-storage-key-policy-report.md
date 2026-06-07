# Production Worker Storage Key Policy

## Scope

Tightened production worker completion policy so successful outputs must include app-managed storage keys, not only HTTPS URLs.

## Changes

- Production image completions now require every requested image variant to include matching `imageStorageKey` and `thumbnailStorageKey`.
- Production provider-generation completions now require the expected take-video storage key and require a poster storage key when a poster URL is supplied.
- Production render completions now require the expected render output storage key.
- Mock mode behavior remains unchanged unless `requireOutputs=true` is explicitly requested.
- Extended mock-flow coverage so production image, provider-generation, and render completions reject URL-only outputs before accepting matching storage keys.

## Result

Production worker completions now align with the existing invocation contracts that require output ingest into app-managed storage.
