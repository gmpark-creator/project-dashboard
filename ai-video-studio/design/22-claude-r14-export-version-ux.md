# Claude R14 — Export version tabs & default render UX

## Goal

Codex R15 added a persisted default render version contract (`Project.defaultRenderJobId`,
`studioApi.setDefaultRender`, `POST /api/projects/[id]/default-render`). This round turns the
flat render-job stack in Export into familiar **length-version tabs** (6초 / 15초 / 30초 / 전체),
surfaces the persisted default, and lets the user promote any completed version to default.

UI-only change. No Codex-owned server / schema / OpenAPI / script files were touched.

## Changed UI

`studio-app/src/features/studio/StudioApp.tsx`

- **`ExportView`**
  - New `onSetDefault(renderJobId)` prop, wired in the parent to
    `run(() => studioApi.setDefaultRender(project.id, renderJobId), …)` so the bundle refreshes
    through the existing run/refresh flow (same path as every other mutation).
  - Removed the per-row `playerJobId` toggle and the inline `copyShare` (moved into the new
    component). The right panel now renders `<RenderVersions>` instead of a flat
    `bundle.renderJobs.map(...)` stack. Panel heading: `렌더 잡` → `렌더 버전`.
  - Preserved untouched: render preflight (`RenderPreflight` on `latestJob`), render preview
    freshness (`RenderPreviewBlock`, `staleSpec`/`staleSource`), rights/missing-cut warnings
    (`PreflightFlags`), the resolution/caption form, and the start/re-render button with its
    estimate. Provider/model are still never rendered.

- **New `RenderVersions` component**
  - Groups `renderJobs` by `spec.cut` and renders a segmented tab strip in fixed
    `6s → 15s → 30s → full` order, showing only cuts that have at least one job.
  - Per-cut representative job = ① the default job if it belongs to that cut → ② latest completed
    → ③ latest job. This keeps the default marker and the active player pointing at the same
    version.
  - Active tab shows the existing inline `<video>` player (poster = project thumb, `key` reset
    per job), **다운로드** link, **공유 링크 복사** button + share URL line, and a
    **기본으로 설정 / 기본 버전** button (disabled when already default).
  - In-progress versions show progress bar + `statusLabel`/`renderStageLabel` inside the tab body,
    and a small dot on their tab.
  - Default is marked from `bundle.project.defaultRenderJobId`: a `기본` chip on the owning tab
    plus a `기본 버전` badge in the active body.
  - User-facing labels only (`6초`/`15초`/`30초`/`전체`, `1080p`). No hashes, IDs, provider, or
    model names.

`studio-app/app/globals.css`

- Added `.render-versions`, `.seg-tabs`, `.seg-tab(.is-active)`, `.seg-tab-default`,
  `.seg-tab-dot`, `.render-version-body`, `.render-version-head`, `.render-version-progress`.
  Segmented control is a wrapping flex row (familiar pattern, not nested cards); player reuses the
  existing `.edit-preview-stage` / `.take-video` and `.render-actions` / `.share-link` styling.

## Consumed API

- `bundle.project.defaultRenderJobId` — read to mark the default version.
- `studioApi.setDefaultRender(projectId, renderJobId)` → refreshed `ProjectBundle` — called via the
  parent run/refresh flow. Only completed jobs expose the set-default action.
- `RenderJob.spec.cut` / `.resolution` / `.status` / `.progress` / `.outputUrl` / `.shareUrl` —
  unchanged consumption.

## Verification

All run in `studio-app`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:mock` | pass — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | pass — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 14 }` |
| `npm run build` | pass (all routes incl. `/api/projects/[projectId]/default-render`) |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

**Headless layout check** (Chrome via CDP `Emulation.setDeviceMetricsOverride`, DSF 1, real
`globals.css` against the new markup with a completed-render set; programmatic overflow probe +
screenshot):

- **390px**: `vw=390 docScroll=390 docOverflow=0 worstChild=0` → no horizontal overflow.
  `export-grid` collapses to a single column (`362px`); tab strip on one row; active player,
  `기본`/`기본 버전` markers, and 다운로드/공유 링크 복사/기본 버전 actions all visible.
- **1366px**: `vw=1366 docOverflow=0`, two-column `380px 672px`; same markers, player, and actions
  visible, no overflow.

Set-default behaviour: button disabled when the active version is already default; otherwise calls
`setDefaultRender` through run/refresh. Persistence of `defaultRenderJobId` after selection is
covered by `mock-flow.test.ts` (auto-default on first completed render + explicit 15s selection).

## Residual risks

- When one cut has multiple completed jobs and the default points at an older one, the tab prefers
  the default job as representative; the newest completed job for that cut is then only reachable
  after the user re-renders or re-sets default. Acceptable for the mock (re-render appends a fresh
  batch and the user can re-promote), but worth revisiting if per-cut version history is wanted.
- The active player uses the base `.edit-preview-stage` `max-height: 360px`; for a 9:16 source on a
  wide desktop panel the stage becomes a letterboxed landscape box (`object-fit: contain`), not a
  tall portrait frame. Matches prior behaviour and avoids excessive panel height.
- Headless check used a representative static render set (real CSS + markup), not a live full-flow
  render, because render completion in the mock is wall-clock/`forceDueJobs`-gated. Functional
  set-default correctness is covered by the contract test rather than a click-through.
- The unused legacy `.render-row` / `.render-actions` flex rules remain in `globals.css`
  (`.render-actions` is still used); the old `.render-row` block is now dead but left in place to
  avoid unrelated churn.
