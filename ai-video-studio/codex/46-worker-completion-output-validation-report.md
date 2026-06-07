# Codex R46 - Worker completion output validation report

## Why

R45 allowed workers to send output URLs, but production workers also need a way to make successful completion fail closed when required outputs are missing or malformed. Without that guard, a worker could mark a job done without usable artifacts.

## Implemented

- Added `WorkerLeaseCompletionInput.requireOutputs`.
- Added `invalid_outputs` to `WorkerLeaseCompletionResult.reason`.
- Validates supplied output URLs before mutating job state.
- When `requireOutputs=true`, successful completions require:
  - image workers: at least one `imageVariants[]` item
  - provider generation workers: a valid `videoUrl`
  - render workers: a valid `renderOutputUrl` or `videoUrl`
- Updated the complete-lease route to return `422` for invalid output payloads.
- Extended JSON Schema.
- Extended `mock-flow.test.ts` to verify missing required image outputs are rejected before a later valid output completion succeeds.

## Notes

- Mock-only completion remains supported when `requireOutputs` is not set.
- URL validation accepts `http:`, `https:`, `data:`, and `mock:` schemes so existing mock assets and real stored assets both work.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `POST /api/system/worker-leases/[leaseId]/complete` returned `422 invalid_outputs` for missing required outputs, then accepted a valid output payload on the same lease.
