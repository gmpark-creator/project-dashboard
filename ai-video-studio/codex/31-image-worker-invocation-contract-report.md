# Codex R31 - Image worker invocation contract report

## Why

Video generation jobs have a provider invocation contract, and render jobs have a render worker invocation contract. Image Maker jobs still only existed as UI/mock job state, which left a gap before a production queue can dispatch all job kinds through typed worker handoffs.

This round adds the Image Maker worker invocation contract. It does not call a real image provider.

## Implemented

- Added `ImageWorkerInvocation` domain type.
- Added `src/server/image-worker-invocation.ts`.
- Added JSON Schema definition and root schema property for `ImageWorkerInvocation`.
- Extended `validate-contracts.ts` to require the new schema definition.
- Extended `mock-flow.test.ts` to verify:
  - image worker invocation keeps job/project identity
  - prompt, style, count, purpose, role, and aspect are preserved
  - every requested variant has a declared output
  - variant ids are preserved
  - image and thumbnail storage keys are production-shaped
  - generated rights, asset library registration, and storage ingest policies are explicit
  - response contract declares image outputs and copy-to-storage ingest

## Invocation shape

The worker handoff includes:

- `jobId`
- `projectId`
- request
  - prompt
  - purpose
  - asset role
  - aspect
  - style
  - count
- outputs
  - variant id
  - variant label
  - score label
  - image storage key
  - thumbnail storage key
- policy
  - generated rights
  - asset library registration
  - storage ingest required
- response contract
  - expected image output
  - `image_asset` and `image_thumbnail` artifact roles
  - copy-to-storage ingest
  - async polling progress

## Notes

- This is a worker/adapter contract, not a public API and not UI data.
- Storage keys are reserved before final `ImageAsset` ids exist, so they are scoped by image job and variant id.
- A future ingest worker can copy provider images to these keys, then create `ImageAsset` and `MediaArtifact` records using the existing asset/artifact lifecycle.
- With provider, image, render, and queue snapshot contracts in place, the next backend step can add a read-only worker dispatch snapshot or real lease API.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
