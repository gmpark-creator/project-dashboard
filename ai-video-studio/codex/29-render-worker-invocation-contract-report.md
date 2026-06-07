# Codex R27 - Render worker invocation contract report

## Why

Render jobs already keep a `RenderPlan`, source hash, export spec, edit state, and rights review. The next production step is converting that snapshot into the exact unit a render worker can execute with FFmpeg, Remotion, or another renderer.

This round adds a render worker invocation contract. It does not run a real renderer.

## Implemented

- Added `RenderWorkerInvocation` domain type.
- Added `src/server/render-worker-invocation.ts`.
- Added JSON Schema for `RenderWorkerInvocation`.
- Added `renderWorkerInvocation` to the root schema examples.
- Extended `validate-contracts.ts` to require the new definition.
- Extended `mock-flow.test.ts` to verify:
  - job id and source hash are preserved
  - renderable inputs match the render plan shots
  - storyboard order is preserved
  - missing shot ids are carried to the worker request
  - missing shots use `skip_with_notice`
  - burn-in caption policy is derived from `ExportSpec.caption`
  - audio mix policy is derived from the snapped edit state
  - output declares `render_output`, `mp4`, and a production-shaped storage key

## Invocation shape

The invocation includes:

- render job id
- project id
- render source hash
- export spec
- ordered renderable inputs with take URLs
- missing shot ids
- snapped edit state
- output contract:
  - `render_output`
  - `mp4`
  - storage key
  - share URL required
- policy:
  - `missingShotPolicy: "skip_with_notice"`
  - burn captions
  - emit SRT
  - audio mix
  - voiceover
  - transitions

## Notes

- This is a worker contract, not a public API and not UI data.
- The current mock renderer still completes jobs with playable sample media.
- A production worker can use this contract as the handoff boundary before replacing the mock completion path.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
