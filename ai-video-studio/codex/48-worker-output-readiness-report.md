# Codex R48 - Worker output readiness report

## Why

R47 made production worker completions fail closed when successful output payloads are missing. Runtime readiness should expose that policy so operators can distinguish mock-mode permissiveness from production-mode worker callback requirements.

## Implemented

- Added `worker_output_policy` to `getRuntimeReadiness()`.
- Mock mode reports the policy as `warn` because successful completions may omit outputs.
- Production mode reports the policy as `pass` because successful completions require output payloads.
- Extended `mock-flow.test.ts` readiness assertions for both modes.

## Notes

- This check does not add new environment variables.
- It documents active runtime behavior rather than testing object storage connectivity.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Runtime smoke check: `GET /api/system/readiness` returned `worker_output_policy=warn` in mock mode.
