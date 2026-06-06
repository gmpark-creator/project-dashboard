# Claude R12 — Playback UX pass

## Goal

Codex R13 made mock media browser-playable (`Take.videoUrl`/`posterUrl`, `RenderJob.outputUrl`/`shareUrl`,
`project.thumbUrl`). This round replaces the text-only placeholders with real `<video>` playback across
Compare, Edit, and Export, while keeping the UI compact, operational, and free of provider/model exposure.

UI-only: no server, schema, OpenAPI, or script changes. Mock media values are consumed as-is.

## Changed UI

### Compare — `TakeCard`
- `done` takes with a `videoUrl` now render a native player:
  `<video controls playsInline muted preload="metadata" poster={posterUrl} src={videoUrl}>`.
- `failed` / `generating` takes stay non-playable and show a Korean state label
  (`다시 시도 필요` / `생성 중`) in a `.media-fallback` placeholder.
- Selection no longer wraps the whole card in a `<button>` (which would have nested the video
  controls inside a button). It is now a dedicated footer button (`이걸로 선택` / `선택됨`), so
  scrubbing the video never triggers selection. Selection state, tier label, and quality label
  (`추천`/`안정적`/`확인 필요`) are preserved.
- Each take frame follows the project aspect ratio via inline `aspect-ratio` and is capped with
  `max-height: 360px` + `object-fit: contain` so a 9:16 take never becomes a ~640–1000px block on mobile.

### Edit — `EditPreview`
- The empty `다듬기` preview placeholder is replaced by a compact stitched/playlist preview:
  - a single "current shot" `<video>` player in an aspect-correct, height-capped frame, and
  - an ordered segment list of the selected takes (`order · title · duration`), with the active
    segment highlighted.
- Segments are built from `bundle.shots` (in order) filtered to those with a `selectedTakeId`,
  resolved to `bundle.takes` and limited to takes that have a `videoUrl`.
- Selecting a segment loads + plays it; when a segment ends, playback auto-advances to the next
  (muted autoplay). No complex timeline editor was added.
- When nothing is selected yet, a clear Korean empty state is shown instead of a player.

### Export — `ExportView` render jobs
- `done` jobs now use real affordances instead of toast-only buttons:
  - **미리보기 / 미리보기 닫기** toggles an inline `<video>` player using `outputUrl` (poster = `project.thumbUrl`).
  - **다운로드** is a real `<a href={outputUrl} download>` (not a toast).
  - **공유 링크 복사** copies `shareUrl` via `navigator.clipboard`; the opened preview also exposes the
    `shareUrl` as a visible link, so sharing never reduces to a toast when a URL exists.
- The existing preflight (`RenderPreflight`) and preview-freshness (`RenderPreviewBlock`, stale spec/source
  badges) UX is untouched.

### CSS (`app/globals.css`)
- New `.take-media` / `.edit-preview-stage` / `.take-video` / `.media-fallback` rules implement the
  aspect-correct, `max-height`-capped, letterboxed video frame shared by all three views.
- New `.segment-list` / `.segment-index` / `.segment-title` / `.segment-dur` for the Edit playlist.
- New `.render-player` / `.share-link` for the inline export preview, plus `a.secondary` styling so the
  download anchor matches the existing button look.

## Consumed fields (all pre-existing, R13)
- `Take.videoUrl`, `Take.posterUrl`, `Take.status`, `Take.durationSec`, `Take.tier`
- `Shot.selectedTakeId`, `Shot.order`, `Shot.title`
- `RenderJob.outputUrl`, `RenderJob.shareUrl`, `RenderJob.status`
- `Project.aspect`, `Project.thumbUrl`

No domain type or API change. Provider/model/internal routing remain hidden.

## Verification
- `npm run typecheck` — pass
- `npm run test:mock` — pass (`shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3`)
- `npm run validate:contracts` — pass (`providers: 4, routingRules: 7, templates: 6, visualMakerOps: 12`)
- `npm run build` — pass
- `npm audit --omit=dev` — 0 vulnerabilities
- Headless Chrome (CDP) layout check after driving the mock flow (generate → select → render),
  at **390px (mobile)** and **1366px (desktop)** for Compare, Edit, Export:
  - no horizontal overflow (`scrollWidth ≤ innerWidth` at both widths in all three views)
  - `<video>` elements rendered: Compare 3, Edit 1, Export 1 (preview opened)
  - screenshots confirmed: failed takes show the non-playable Korean fallback, the Edit playlist
    plays a letterboxed segment, and the Export done job plays inline with a visible share link.

## Residual risks
- The mock sample video is an external HTTPS asset (MDN `flower.mp4`); offline/blocked-network
  environments will show the poster but cannot play. This is mock-data behavior, not a UI bug.
- Segment auto-advance relies on muted autoplay; if a browser blocks it, playback simply stops at the
  segment boundary (the user can click the next segment). Controls remain functional.
- The Edit preview plays takes one segment at a time (playlist), not a single concatenated stream —
  intentional for a mock; true stitching belongs to the render pipeline.
- Clipboard copy can be denied by browser permissions; the share URL is also shown as a link so the
  user can copy it manually.
