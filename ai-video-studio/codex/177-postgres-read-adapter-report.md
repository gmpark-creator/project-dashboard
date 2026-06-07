# R177 - Postgres Read Adapter

## Scope

- Added the first live Postgres read adapter for project listing and project bundle retrieval.
- Kept public production read routes fail-closed until the live adapter is wired and integration-tested against a migrated database.

## Implementation

- `src/server/live-persistence-read-adapter.ts`
  - maps Postgres snake_case rows to current domain types
  - supports `listProjects()`
  - supports `getProjectBundle(projectId)`
  - assembles scenes, shots, takes, generation jobs, provider attempts, render jobs, image assets, image jobs, reference board usages, edit state, credit transactions, and media artifacts
  - computes `renderSourceHash` for live bundles

## Verification

- Added `scripts/live-persistence-read-adapter.test.ts` with a fake Postgres client and representative rows.
- Added the adapter test to `npm run test:mock`.
- Updated `npm run validate:contracts` to guard the read adapter surface.
