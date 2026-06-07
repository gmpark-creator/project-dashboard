# AI Video Studio App

Next.js/TypeScript implementation shell for the AI Video Studio product.

This is not connected to real video providers yet. It ports the static `mock-app` vertical slice into a typed app with API route handlers, a mock provider service, domain types, and contract validation scripts.

## Commands

```bash
npm install
npm run verify
npm run dev
```

Individual verification commands:

```bash
npm run validate:contracts
npm run test:mock
npm run typecheck
npm run build
```

`npm run verify` is also run by the repository GitHub Actions workflow for `ai-video-studio/**` changes.

## Scope

- Typed domain model: Project, Scene, Shot, Take, GenerationJob, RenderJob
- API routes for create/generate/select/regenerate/upgrade/render/tick
- Mock provider with deterministic partial failure
- UI with no user-visible provider/model names
- Contract validation against `../codex/config`

Real provider adapters, persistent DB, queue, auth, billing, and Remotion/FFmpeg render workers remain next phases.
