# Codex R63 - OpenAPI route validation report

## Why

R61 and R62 found OpenAPI paths that did not have matching Next route implementations. Contract validation checked operation IDs and schemas, but it did not verify that documented paths and methods actually existed under `app/api`.

## Implemented

- Extended `npm run validate:contracts` to map each OpenAPI path to its expected Next route file.
- Validates every documented HTTP method has a matching exported route function.
- Validates every documented operation has an `operationId`.
- Added route count reporting to the validation summary.

## Notes

- The mapper converts OpenAPI parameters like `{jobId}` to Next route folders like `[jobId]`.
- This is a contract guard only; it does not inspect response behavior.

## Verification

- `npm run validate:contracts`
- `npm run typecheck`
- `npm run test:mock`
- `npm run build`
- `npm audit --omit=dev`
