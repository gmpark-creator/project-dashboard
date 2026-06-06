# Codex R11 - Render source hash contract report

## Scope

Claude R9 left one P2 gap: a render preview can become stale when the project source changes after the preview is calculated. This round adds a server-owned render source hash so the UI can compare the current bundle against a preview without duplicating render-plan logic in the client.

## Implemented

- Added `RenderSourceHash` schema contract: `sha256:<64 hex chars>`.
- Added `ProjectBundle.renderSourceHash`.
- Added `RenderPreview.sourceHash`.
- Added `RenderPlan.sourceHash`, so queued render jobs keep the exact source snapshot used at job creation.
- Added `GET /projects/{projectId}` to OpenAPI with `ProjectBundle` response.
- Added formal schema defs for `ProjectBundle`, `ReferenceBoard`, `AssetUsage`, and studio credit balance.
- Updated mock service hash generation to include render-affecting state:
  - storyboard shot order/title/status/duration
  - effective selected take, including auto-selectable best done take
  - take output/duration/tier/metrics
  - referenced image rights labels/status/notes
  - edit state and edit commands
- Excluded volatile read timestamps, so simple bundle reads do not create false stale states.

## Verification Coverage

- `mock-flow.test.ts` now checks:
  - edit changes produce a different `renderSourceHash`
  - `previewRender().sourceHash` matches the current bundle hash
  - `RenderPreview.renderPlan.sourceHash` matches the preview hash
  - render jobs snapshot the same source hash used by the preview
- `validate-contracts.ts` now requires `ProjectBundle`, `RenderSourceHash`, and `getProjectBundle`.

## Claude Handoff

Claude can mark a render preview stale when:

- `preview.sourceHash !== bundle.renderSourceHash`
- or `preview.spec` no longer matches the export controls

The provider/model routing data remains internal only. The new hash is a source freshness token, not a user-facing technical detail.
