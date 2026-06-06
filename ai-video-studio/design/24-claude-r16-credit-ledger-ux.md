# Claude R16 — Credit ledger UX

## Goal

Codex added a domain credit ledger contract — `ProjectBundle.creditTransactions` carries
`CreditTransaction` records for every credit `reserve` / `capture` / `refund` tied to a project's
`generateImages` / `generateShot` / `upgradeTake` / `startRender` actions. Until now the Studio UI
only showed a single live **balance** (the rail credit box and the topbar pill); operators had no
way to see *why* the balance moved — what was held, what was actually charged, and what was
refunded after a failed take.

This round consumes `bundle.creditTransactions` and adds a compact, operator-facing **credit
activity surface** ("크레딧 사용 내역") to the Export view — the project's operations-review hub,
where the credit-spending flow culminates and where a bundle is always loaded. It is rendered
full-width below the export grid so it is visible at every width (the rail credit box / footer is
hidden on mobile, so the rail was not a viable home for a mobile-visible surface).

UI-only change. No Codex-owned server / service / schema / OpenAPI / script files were touched.

## Changed UI

`studio-app/src/features/studio/StudioApp.tsx`

- Imported the `CreditTransaction` type (UI typing only — no contract change).
- **New label maps / helper** (module scope, next to the other label helpers):
  - `creditActionLabels` — maps the four internal `action` ids to Korean operator names
    (`generateImages` → "이미지 후보 생성", `generateShot` → "영상 컷 생성",
    `upgradeTake` → "게시용 품질 업그레이드", `startRender` → "영상 내보내기"). The raw action
    id is never rendered.
  - `creditKindMeta` — maps `kind` to a Korean label + badge tone: `reserve` → "예약" (`fast`,
    cyan = held/pending), `capture` → "사용 확정" (`spend`, gold = actually charged), `refund` →
    "환불" (`ok`, green = returned). Tone alone reads direction, avoiding misleading +/− signs
    (at capture time `available` is unchanged because the credits were already reserved).
  - `formatLedgerTime(iso)` — renders `createdAt` as a short relative time ("방금 / N분 전 /
    N시간 전 / N일 전"). The exact timestamp is not exposed.
- **New `CreditLedger` component** — takes `transactions: CreditTransaction[]`, shows the most
  recent up to 8 entries newest-first (`slice(-8).reverse()`; the server array is oldest→newest).
  Each row shows: a kind badge, the readable action name, the credit amount (`+` only on refunds,
  green; otherwise gold), and a running-context line "남은 {balanceAfter.available}⚡ ·
  {relative time}". Empty state: "아직 크레딧 사용 내역이 없습니다." `tx.id` is used only as a
  React `key`, never rendered.
- **`ExportView` return** wrapped in a fragment so `<CreditLedger transactions=
  {bundle.creditTransactions} />` renders full-width directly below the existing
  `.export-grid`. No other Export behavior changed.

`studio-app/app/globals.css`

- Added `.ledger` (`margin-top: 14px`), `.ledger-list` (borderless grid), `.ledger-row` (flex
  space-between, `flex-wrap`, thin top-border divider — no nested cards, consistent with the
  `.edit-control` divider idiom), `.ledger-main` (badge + action, `flex: 1 1 auto`, `min-width: 0`),
  `.ledger-action`, `.ledger-side` (amount + meta, right-aligned), `.ledger-amount`
  (gold; `.is-refund` → green), `.ledger-meta` (dim 12px), and a `.badge.spend` gold variant for
  the capture badge (reserve reuses `.fast`, refund reuses `.ok`).
- Extended the existing `@media (max-width: 520px)` block: `.ledger-row` items stack to
  `flex-basis: 100%` so the amount/balance/time line drops below the action name and stays
  left-aligned — preventing the running-context text from being pushed past the panel edge on
  narrow screens.

## Consumed contract

- `bundle.creditTransactions` — already filtered to the open project server-side
  (`transaction.projectId === project.id`) and ordered oldest→newest.
- Per record: `kind`, `action`, `credits`, `balanceAfter.available`, `createdAt`, and `id`
  (key only). `projectId` / `jobId` / the English `note` field are intentionally **not** rendered —
  the note carries internal phrasing ("Image Maker variants reserved", provider-style wording), so
  the UI derives its own Korean labels from `kind` + `action` instead.

## Layout notes

- Placed on the Export view because credit churn from all four actions lands there as an
  operations summary, a bundle is always present, and the surface is then visible at 390px (the
  rail credit box / `.rail-footer` is `display: none` below 980px).
- Dense and divider-based (no nested panels), matching the Cutpilot `.edit-control` / `.preflight`
  idiom. Wide screens: action left / amount+context right on one row. ≤520px: the two halves stack.

## Verification

All run in `studio-app`:

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run test:mock` | pass — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | pass — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 14 }` |
| `npm run build` | pass (all routes, `✓ Compiled successfully`) |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

**Headless layout check** (Chrome `--headless=new`, real `globals.css` linked against the actual
Export DOM nesting `.shell > .main > .view > .export-grid` + the full-width `.ledger` panel, with a
representative 4-row set including a refund row and the longest action label
"게시용 품질 업그레이드"):

- **390px**: rows stack — action name on the first line, "{amount}⚡ · 남은 {N}⚡ · {time}" on the
  second, all within the panel. No horizontal clipping (an earlier nowrap meta clipped at the
  viewport edge; fixed by letting the meta wrap and stacking the row ≤520px).
- **1366px**: full-width ledger panel below the two-column export grid; action left, amount +
  running context right-aligned; "최근 N건" badge in the panel head. No overflow.

**Preserved unchanged:** rail credit box, topbar credit pill, render preview/preflight, render
version tabs, playback, estimate/start button. No raw ids, `jobId`, `projectId`, provider/model
names, internal `note` text, or hashes are rendered — only derived Korean labels, credit amounts,
the resulting available balance, and a relative time.

## Residual risks

- The relative time uses `Date.now()` at render; the app polls/refreshes (~1.2s tick) so labels
  stay current without extra timers.
- Only the most recent 8 entries are shown by design (a compact operational summary, not a full
  audit log). The count is surfaced as "최근 N건" rather than implying the full history; a
  paginated/full ledger view was deliberately out of scope for a compact surface.
- The surface lives on the Export view only. Credit reservations also occur from the Compare/Images
  flows, but a single operations-review home keeps scope tight and the bundle's `creditTransactions`
  already spans all four actions, so the Export ledger reflects the whole project regardless of
  where the spend originated.
- Headless check used the real CSS against representative static markup (not a live full-flow
  render), since credit transactions accrue through wall-clock/`tick`-gated mock jobs; the markup
  mirrors the component's exact class structure.
