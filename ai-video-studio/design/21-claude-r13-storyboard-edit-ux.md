# Claude R13 - Storyboard edit UX

## Goal

Close the long-standing storyboard editing gap (R4 P2) now that Codex R14 shipped the
`updateStoryboard` contract. Users can open any storyboard shot and adjust its practical fields
(title, length, scene description, direction) without leaving the Storyboard screen, and the edit
flows back through the existing parent refresh so compare/export stay in sync.

UI-only change. No server/schema/OpenAPI/script edits.

## Changed UI

`ai-video-studio/studio-app/src/features/studio/StudioApp.tsx`

- **Storyboard shot cards are now selectable.** Each shot card is wrapped in a full-card button
  (`.shot-open`) that toggles an inline editor for that shot. The card shows a small `다듬기` /
  `편집 중` cue and the selected card gets a cyan accent border. The existing thumbnail, status
  badge, tier, reference count, and SAEC action preview are unchanged.
- **New `ShotEditor` inline panel** rendered above the scene list when a shot is selected. Compact,
  not a redesign. Editable fields:
  - 제목 (title)
  - 길이(초) (duration, clamped 1–16 to match the server)
  - 장면 묘사: 동작·연기(action), 배경·환경(environment), 카메라(camera), 구도(framing),
    조명(lighting), 스타일(style), 피할 요소(negative). Long fields (action, negative) use
    textareas spanning both columns; the rest are single inputs.
  - 연출: 움직임(motion), 연출 메모(notes)
  - `닫기` / `취소` close the editor; `컷 내용 저장` saves.
- **Gentle regeneration hint (Korean).** When the edited shot already has a generated/selected
  result, a non-modal `.notice` line appears: "이 컷은 이미 생성한 결과가 있어요. 내용을 바꾸면
  결과와 달라질 수 있어, 저장 뒤 이 컷만 다시 생성하면 됩니다." For not-yet-generated shots the
  notice stays hidden (nothing to regenerate). This matches server behavior: editing
  render-affecting content clears the selected take and resets quality flags.
- The existing Storyboard generate flow (전체 생성 / 남은 컷 생성 / 비교 화면) is untouched.

`ai-video-studio/studio-app/app/globals.css`

- Added `.shot-open` (full-card button reset + hover), `.shot.editing` accent, `.shot-edit-cue`,
  `.shot-editor` (accent border + textarea sizing), and `.span-2` (full-width field inside the
  `two-compact` grid). On narrow viewports `two-compact` already collapses to one column, so the
  editor stacks safely.

## Consumed API

- `studioApi.updateStoryboard(projectId, { shots: [patch] })` → `ProjectBundle`
  (PUT `/api/projects/[projectId]/storyboard`), from Codex R14.
- The save handler sends a single shot patch `{ id, title, durationSec, saec, directionSpec }` and
  routes through the existing `run()` helper, which reuses the returned bundle via `refresh()` so
  storyboard cards, compare state, and export-preview freshness (`renderSourceHash`) stay current.
- No new provider/model names, hashes, or internal contract names are exposed in the UI.

## Verification

- `npm run typecheck` — pass
- `npm run test:mock` — pass (`shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3`)
- `npm run validate:contracts` — pass (`providers: 4, routingRules: 7, templates: 6, visualMakerOps: 13`)
- `npm run build` — pass
- `npm audit --omit=dev` — 0 vulnerabilities
- Headless Chrome (CDP) layout check against `next start`, Storyboard view at **390px (mobile)** and
  **1366px (desktop)**:
  - no horizontal overflow before or after opening the editor (`scrollWidth ≤ innerWidth` at both
    widths)
  - 10 shot cards render; editor opens with 11 input/textarea fields + save button; editor and all
    fields stay within the viewport (no field overflow); `닫기` closes the editor
- Save round-trip smoke (CDP, live mock): editing title + SAEC action then saving persists to the
  server bundle (`/api/projects/:id`) and the new title appears on the storyboard card, confirming
  the parent refresh consumes the returned bundle.

## Residual risks

- The regeneration `.notice` was not exercised by an automated screenshot because a freshly created
  project has no takes yet; the gating logic (`selectedTakeId` or any take for the shot) is the same
  condition the server uses to clear a take, and it is covered by typecheck. Manual generate→edit
  confirms the copy appears once a shot has results.
- The editor saves the full SAEC object on every save (merged server-side). If two edits race within
  the 1.2s polling tick, the later save wins; this is acceptable for single-user mock usage and
  matches the existing direction-save behavior in Compare.
- Scene-level editing (title/setting/timeOfDay) is supported by the contract but intentionally left
  out of this pass to keep the interaction compact; it can be added later without contract changes.
- Duration is clamped client-side to 1–16s to mirror the server; values outside the range are
  silently corrected rather than rejected with an error, consistent with the rest of the mock UI.
