# Codex R26 - Provider invocation contract report

## Why

Generation jobs already preserve a prompt package, routing decision, and provider attempt telemetry. The next production step is converting that internal state into the exact unit a worker can hand to a provider adapter, while keeping provider/model details out of the end-user UI.

This round adds a provider invocation contract. It does not call any live provider.

## Implemented

- Added `ProviderInvocationInputKind` and `ProviderInvocation` domain types.
- Added `GenerationPromptPackage.durationSec`, so adapter requests snapshot the shot duration instead of deriving it later.
- Added `src/server/provider-invocation.ts`.
- Added schema definitions for `ProviderInvocationInputKind` and `ProviderInvocation`.
- Added `providerInvocation` to the root schema examples.
- Extended `validate-contracts.ts` to require the new schema definitions.
- Extended `mock-flow.test.ts` to verify:
  - image-to-video jobs become `inputKind: "image"`
  - text draft jobs remain `inputKind: "text"`
  - selected provider/model and routing rule are preserved
  - first-frame URLs are carried into the invocation
  - duration is snapped from the shot into the prompt package and invocation
  - `hiddenFromUser`, `fallbackEnabled`, rights review, and storage ingest policy are preserved

## Invocation shape

The invocation includes:

- job, take, project, and shot ids
- selected provider/model and routing rule
- input kind: `text`, `image`, or `first_last_frames`
- normalized request:
  - prompt text
  - negative prompt text
  - aspect
  - duration
  - tier
  - references
  - start/last frame URLs
- policy:
  - hidden from user
  - fallback enabled
  - rights review required
  - storage ingest required
- response contract:
  - expected video output
  - output role `take_video`
  - copy result to storage
  - async polling progress

## Notes

- This is a worker/adapter contract, not a public API and not UI data.
- Provider/model names remain internal.
- The request is provider-agnostic; live provider adapters will still need provider-specific request mapping and official API re-verification before launch.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
