# Claude R15 — Preflight deep-link UX

## Goal

The Export preflight/preview surfaces two blocking warnings — **missing cuts** (no take
selected yet) and **rights review needed** (external images awaiting confirmation) — but until
now they were informational only: the user had to read the warning, then manually navigate to
the Compare or Asset Library screen and find the relevant item. This round makes both warnings
**actionable** with a compact deep-link button each, reusing the existing app navigation state
(`setView`, `setSelectedShotId`). This closes the repeated P2 handoff from R8/R9/R10
(preflight deep links).

UI-only change. No Codex-owned server / schema / OpenAPI / script files were touched.

## Changed UI

`studio-app/src/features/studio/StudioApp.tsx`

- **`StudioApp` → `ExportView` call site**
  - Added two callbacks built from existing app state (no new state):
    - `onFocusMissingShot(shotId)` → `setSelectedShotId(shotId)` + `goToView("compare")` + a toast
      explaining that selecting the take folds the cut into the next render.
    - `onReviewRights()` → `goToView("assets")` + a toast pointing at the Asset Library rights
      check.

- **`ExportView`**
  - Two new props (`onFocusMissingShot`, `onReviewRights`) threaded down to both preflight
    surfaces: the job snapshot (`RenderPreflight`) and the read-only preview
    (`RenderPreviewBlock`). No other behavior changed.

- **`PreflightFlags`** (shared by job snapshot and preview)
  - **Missing cuts:** added a compact `.preflight-action` button inside the existing warning.
    - Single missing cut → **"비교 화면에서 채우기"**, jumps to Compare with that shot focused.
    - Multiple missing cuts → **"비교 화면에서 첫 컷 채우기"**, focuses the *first* missing cut and
      shows a `.preflight-action-note` clarifying it moves to that cut by name and that the Compare
      screen contains all the missing cuts. The full bullet list of missing cuts is preserved
      above the action.
  - **Rights warnings:** added a compact **"Asset Library에서 확인"** button that jumps to the
    assets view. The per-item list (role · label · "N개 컷에 사용" · note) is preserved unchanged.
  - The ok-state flags (no missing cuts / rights cleared) are untouched.

`studio-app/app/globals.css`

- Added `.preflight-actions` (wrapping flex row, `gap: 8px`, `margin-top: 10px`),
  `.preflight-action` (compact button: `min-height: 32px`, `padding: 6px 12px`, `font-size: 12px`,
  `max-width: 100%`), and `.preflight-action-note` (`flex: 1 1 100%` so the multi-cut note drops to
  its own line, dim 12px). Buttons reuse the existing `.secondary` skin — no nested cards, no new
  container styling.

## Consumed app state

- `setSelectedShotId` + `goToView("compare")` — existing state already used by Storyboard/Compare;
  `selectedShot` in Compare is derived from `selectedShotId`, so the deep-linked shot is selected
  and highlighted in the cut list on arrival.
- `goToView("assets")` — existing Asset Library view that already lists registered external images
  and their rights status (`asset.rights.status`).
- `plan.missingShotIds` / `rights.items` — unchanged consumption; `missingShotIds[0]` is the deep
  link target, the title comes from the existing `shotTitleById` map.

## Verification

All run in `studio-app`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:mock` | pass — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | pass — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 14 }` |
| `npm run build` | pass (all routes) |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

**Headless layout check** (Chrome `--headless=new` driven over CDP with
`Emulation.setDeviceMetricsOverride`, DSF 1, real `globals.css` against the actual Export DOM
nesting `.shell > .main > .view > .export-grid > .panel`, with both warnings present in both the
preview block and the job preflight block — i.e. 4 action buttons total; programmatic overflow
probe):

- **390px**: `vw=390 scrollWidth=375 overflow=-15 worstChild=0` → no horizontal overflow. All 4
  `.preflight-action` buttons visible and within the viewport; the multi-cut note wraps onto its
  own line.
- **1366px**: `vw=1366 scrollWidth=1366 overflow=0 worstChild=0` → no overflow. Two-column
  export grid; all 4 action buttons visible.

**Deep-link behaviour** (state wiring): missing-cut action sets `selectedShotId` to the first
missing shot and switches to Compare, where `selectedShot` is derived from `selectedShotId` so the
target cut is the active/highlighted cut; rights action switches to the Asset Library/assets view
that already exposes each image's rights status. Both also fire an explanatory toast (after
`goToView`, which clears the prior toast first).

**Preserved unchanged:** preflight job snapshot, render preview freshness (`staleSpec`/
`staleSource`), render version tabs, playback, rights/missing bullet lists, estimate/start button,
and provider/model hiding. No raw ids/hashes/provider/model names are rendered — the missing-cut
deep link uses `missingShotIds[0]` internally but the button/label only shows the human cut title.

## Residual risks

- The missing-cut action focuses only the **first** missing cut by design; when several cuts are
  missing the user resolves the rest from the Compare cut list. This is surfaced explicitly in the
  note ("비교 화면에 빠진 컷이 모두 있습니다") rather than silently. A per-cut deep link per bullet
  was deliberately avoided to keep the warning compact (no nested cards / list of buttons).
- The rights action lands on the Asset Library view generally rather than scrolling to a specific
  asset, because the assets view has no per-asset anchor/selection state and adding one would
  exceed the UI-only / no-redesign scope. All flagged external images are visible there with their
  rights status.
- If `missingShotIds` contains a shot id not present in the current bundle (stale preview vs. a
  shot removed afterwards), focusing it would select nothing meaningful; in practice the stale
  source badge already prompts a re-check before that state persists, and Compare falls back to a
  failed/first shot via its existing `selectedShot` memo.
- Headless check used the real CSS + real Export DOM nesting with a representative warning set
  (static markup), not a live full-flow render, since render/rights state in the mock is
  wall-clock/`forceDueJobs`-gated; the navigation wiring itself is plain `setView`/
  `setSelectedShotId` reuse.
