# Story Decomposer Adapter Boundary

## Scope

Added a production-facing story decomposer adapter boundary while preserving the existing mock storyboard behavior.

## Changes

- Added `src/server/story-decomposer.ts` with supported provider selection for `mock`, `openai`, and `anthropic`.
- Kept `mock` as the default local provider and routed it through the existing deterministic storyboard generator.
- Made unimplemented or invalid live decomposer providers fail closed with `StoryDecomposerUnavailableError`.
- Updated `POST /api/storyboard/decompose` to return a documented `503` when the configured decomposer is unavailable.
- Added runtime readiness coverage for `DECOMPOSER_PROVIDER` and live decomposer availability.
- Added route-level coverage for default mock decomposition and live-provider fail-closed behavior.

## Result

The app now has an explicit story-decomposer integration boundary. Production mode no longer appears ready unless this boundary is replaced by a real live decomposer adapter.
