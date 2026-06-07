# R174 - Queue Worker Envelope Contract

## Scope

- Added `src/server/queue-worker-contract.ts`.
- Kept this as a queue adapter contract increment; no external queue is introduced yet.

## Contract

- Contract version: `queue_worker_v1`.
- `buildQueueWorkerEnvelope()` wraps a `WorkerDispatchItem` into a stable live-queue message envelope.
- The envelope includes message id, dedupe key, dispatch/job/project ids, priority, due time, and lease requirements.
- `validateQueueWorkerEnvelope()` guards that queue messages still match the dispatch item they carry.

## Verification

- Added `scripts/queue-worker-contract.test.ts`.
- Added queue worker contract coverage to `npm run test:mock`.
- Updated `npm run validate:contracts` to guard the queue contract, version, and readiness linkage.
