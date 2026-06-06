# Claude R17 — Job cancellation UX

## Goal

Codex added a job-cancellation contract — `studioApi.cancelJob(jobId)` →
`POST /api/jobs/[jobId]/cancel` returning `CancelJobResult`, and jobs can now end in a new
`"cancelled"` `JobStatus` (with reserved credits refunded). Until now the Studio UI had no way for
an operator to stop an active queued/running job: an image candidate batch, a shot's video
generation, or a render version would run to completion (or burn credits) with no off-switch, and a
cancelled job had no defined visual treatment.

This round wires `studioApi.cancelJob` into the Studio UI and adds compact, operator-facing cancel
affordances wherever active jobs naturally appear, plus a neutral (not error-toned) rendering for
cancelled jobs.

UI-only change. No Codex-owned server / service / schema / OpenAPI / script / contract files were
touched (`mock-service.ts`, `scripts/*`, `codex/schemas/*`, `codex/api/*`, `api.ts`,
`domain/types.ts` all unchanged).

## Changed UI

`studio-app/src/features/studio/StudioApp.tsx`

- Imported the `JobStatus` type (UI typing only — no contract change).
- **`statusLabel`** — added `cancelled` → "취소됨" so any job/take status badge reads cleanly.
- **`jobBadgeTone(status)`** (new helper) — maps a `JobStatus` to a badge tone: `done` → `ok`
  (green), `failed` → `warn` (red), `cancelled` → `""` (neutral default grey badge), else `fast`
  (cyan). This is what keeps **cancelled visually distinct from failed** — cancelled is a calm
  neutral chip, not a red provider-error chip.
- **`CancelJobButton`** (new small component) — a compact, reusable cancel button. While any cancel
  request is in flight (`busy`) every cancel button is disabled to prevent double-submits; the
  pressed one shows "취소 중…", others show "작업 취소". Korean title explains it stops the job and
  refunds reserved credits. Takes only a `jobId` for its handler — no id/model text is rendered.
- **`StudioApp` state + handlers**:
  - `cancelingJobId` state — the in-flight job id (or, for batch cancel, the first id); non-null =
    "a cancel is running", which is what disables all cancel buttons.
  - `cancelJob(jobId)` — cancels one job: sets in-flight, calls `studioApi.cancelJob`, toasts the
    outcome (`cancelled` → "작업을 취소했습니다." plus "예약한 N⚡를 돌려드렸습니다." when
    `refundedCredits > 0`; not-active → "이미 끝난 작업이라 취소할 수 없습니다."), and **always
    refreshes the bundle** in `finally` so the UI reflects reality even on the 409/404 race (an
    already-finished job is absorbed into a friendly "…이미 끝났을 수 있어 화면을 새로고침합니다.").
  - `cancelActiveJobs(jobIds[])` — batch cancel for the storyboard "전체 생성 중" case: cancels each
    active generation job, skips ones that already finished, and toasts a single summary with the
    count and total refund. Reuses `cancelingJobId` (first id) for the busy lock.
- **Wiring** — `cancelJob` / `cancelingJobId` passed to `ImageMaker`, `Compare`, and `ExportView`;
  `cancelActiveJobs` + `canceling` passed to `Storyboard`.

Per-surface affordances:

- **Image Maker** (`ImageMaker`, active image jobs): each job row (`.row-card`) now puts its status
  badge (via `jobBadgeTone`) and — for `queued`/`running` jobs — a "작업 취소" button in a
  `.row-card-side` cluster. Cancelled rows show the neutral "취소됨" badge and no button.
- **Compare** (`Compare` / `TakeCard`, shot-level active generation jobs): `Compare` builds a
  `take.id → active generationJob.id` map; each `TakeCard` for a pending (`queued`/`running`) take
  gets a full-width "작업 취소" button (`.take-cancel`) under its meta row. `TakeCard` also now
  renders the `cancelled` state neutrally — fallback label "취소됨" (not "생성 중"), no animated
  progress bar, no `.failed` red border.
- **Storyboard** (`Storyboard` head): when a generation batch is active, a compact "생성 취소" ghost
  button appears next to the disabled "생성 중" button and cancels the whole active batch via
  `cancelActiveJobs`.
- **Export** (`RenderVersions`, active render versions): the in-progress version body now shows a
  "작업 취소" button (`.render-version-cancel`) for `queued`/`running` render jobs. A cancelled
  version renders neutrally — status "취소됨", **no** progress bar and **no** stale stage label
  (e.g. "마무리 인코딩 중"), and the seg-tab "working" dot now shows only for `queued`/`running`
  (so failed/cancelled versions no longer look active).

`studio-app/app/globals.css`

- Gave `.row-card` a real flex row layout (`display:flex; justify-content:space-between; gap;
  padding:12px`) with the text block as `flex:1; min-width:0` so the hint shrinks/wraps instead of
  pushing the badge/button out — it previously had only border/background.
- Added `.row-card-side` (badge + button cluster, `flex-shrink:0`), `.cancel-job` (compact 32px,
  12px, `white-space:nowrap`), `.take-cancel` (full-width button under the take meta),
  `.render-version-cancel` (34px button in the render progress block). All reuse existing
  `.ghost` / `.secondary` button styling — no new colors.

## Consumed contract

- `studioApi.cancelJob(jobId)` → `CancelJobResult` — uses `cancelled` (success toast vs not-active
  message), `refundedCredits` (refund line in the toast). `jobId` / `kind` / `projectId` / `status`
  / `reason` are **not** rendered; `reason` is English backend phrasing and the others are internal
  identifiers. The bundle refresh after cancel surfaces the resulting `"cancelled"` state on the
  affected take/job/render.
- The shared `api.ts` `json()` helper throws on the 409 (not-active) / 404 (not-found) responses;
  `cancelJob` catches that, shows a neutral Korean message, and refreshes — so a tick that finishes
  a job a split-second before the click never shows a raw "Request failed: 409".

## Layout notes

- Cancel affordances live exactly where the active job is already shown — Image Maker job rows,
  Compare take cards, the Storyboard generate header, and the Export render-version progress block —
  so nothing new competes for space; each is a compact 12px button.
- At ≤980px the `image-grid` / `two` / `export-grid` / `take-grid` already collapse to a single
  column, so the cancel buttons sit in full-width panels. `.row-card-side` is `flex-shrink:0` and
  the text block is `min-width:0`, so the badge + button never get pushed off-panel; the take and
  render cancel buttons are block/inline within their card.

## Verification

All run in `studio-app`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:mock` | pass — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | pass — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 15 }` |
| `npm run build` | pass — all routes incl. `ƒ /api/jobs/[jobId]/cancel`, optimization finalized |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

**Headless layout check** (Chrome `--headless=new`, real `globals.css` linked against the actual DOM
nesting `.shell > .main > .view > {image-grid, two/take-grid, export-grid}` for all four affected
surfaces — Image Maker active + cancelled job rows, a pending Compare take card with cancel, the
Storyboard head with "생성 취소", and an in-progress Export render version with cancel):

- **390px** (forced true 390px content box; Chrome on Windows clamps the min viewport to ~484px,
  which already activates the ≤980 mobile single-column layout): `.shell` / `.view` and every
  affected surface report `scrollWidth - clientWidth = 0`; all right edges ≤ 390. No horizontal
  overflow. `.row-card-side` measured 138px (badge + "작업 취소") and stayed inside the panel with
  the text block shrinking.
- **1366px**: two-column grids; cancel buttons sit inline with the status/progress of each active
  job. All measured overflow = 0, all right edges within the 1335px document width. No overflow.

(The temporary measurement harness was removed after the check; no app files reference it.)

**Preserved unchanged:** generate / regenerate / select / upgrade flows, render preview/preflight,
render version playback / download / share / set-default, credit ledger, rights review, the toast +
`run`/`refresh` patterns. Cancellation reuses the existing toast + bundle-refresh idiom.

No raw ids, `jobId`, `projectId`, provider/model names, request ids, internal hashes, or backend
terminology (`reason`, stage codes) are exposed — only derived Korean labels, refund credit amounts,
and the neutral "취소됨" status.

## Residual risks

- **Race on a just-finished job**: between render and click a `tick` can complete/​fail a job; the
  cancel then returns 409/404. Handled — the not-active path and the thrown-error path both show a
  neutral Korean message and refresh, so the operator immediately sees the real state.
- **Batch cancel partial outcome** (Storyboard "생성 취소"): individual job cancels can race to
  completion; those are skipped and the summary toast reports only the count actually cancelled
  ("취소할 진행 중 작업이 없습니다." when none remained). Reserved-credit refunds are summed from the
  results, not assumed.
- **Single in-flight lock**: `cancelingJobId` disables *all* cancel buttons while one request runs.
  This is intentional (prevents double-submits and keeps the credit-refund accounting unambiguous);
  the requests are fast and the bundle refresh re-enables the rest immediately.
- Cancellation is offered only on the three live job surfaces named in scope; the Dashboard and Edit
  views don't list active jobs, so no off-switch was added there.
