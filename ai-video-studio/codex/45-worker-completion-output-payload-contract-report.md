# Codex R45 - Worker completion output payload contract report

## Why

Worker lease completion could mark jobs as succeeded or failed, but it could not accept the URLs produced by a real worker. The mock service generated placeholder URLs internally, leaving a gap before provider, image, and render workers can report their actual stored outputs.

## Implemented

- Added `WorkerLeaseCompletionOutput`.
- Extended `WorkerLeaseCompletionInput.outputs`.
- Passed completion `outputs` through the worker lease API route and service.
- Image worker completion now preserves supplied image and thumbnail URLs.
- Provider generation completion now preserves supplied `videoUrl` and `posterUrl`.
- Render completion now preserves supplied `renderOutputUrl` or `videoUrl`, plus optional `shareUrl`.
- Added `requireOutputs` so production worker callbacks can reject missing or invalid successful output payloads before mutating jobs.
- Extended JSON Schema and `validate-contracts.ts`.
- Extended `mock-flow.test.ts` to verify image worker output URLs are retained in completion receipts.

## Notes

- Output payloads are optional unless `requireOutputs=true`; existing mock-only completion behavior still works.
- This is still mock-backed and does not validate object-store ownership or signed URL provenance.
- Production workers can now use the completion endpoint shape without relying on generated mock URLs.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `POST /api/system/worker-leases/[leaseId]/complete` preserved supplied image and thumbnail output URLs in the completion receipt.
