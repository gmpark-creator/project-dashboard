# Codex R13 - Playable mock media contract report

## Scope

R4/R11 follow-ups need real playback UI, but mock generation still returned `mock://` URLs that browsers cannot play. This round changes mock media outputs to browser-playable URLs and inline posters without changing the public domain model.

## Implemented

- Done `Take.videoUrl` now points to a playable MP4 sample URL.
- Done `Take.posterUrl` now uses an inline SVG data URI poster.
- Done `RenderJob.outputUrl` now points to the same playable MP4 sample URL family.
- Done `RenderJob.shareUrl` now uses a stable HTTPS share URL shape.
- Done project `thumbUrl` now uses an inline SVG data URI poster.
- Poster labels are XML-escaped before encoding.

## Contract Notes

- No domain type changes were needed: existing `videoUrl`, `posterUrl`, `outputUrl`, `shareUrl`, and `thumbUrl` fields remain authoritative.
- The external sample video is a mock playback stand-in only. Provider/model names remain internal and are not exposed.
- Mock URLs now let Claude safely replace text placeholders with `<video>` elements in compare and export views.

## Verification Coverage

`mock-flow.test.ts` now checks:

- done takes expose browser-playable video URLs
- done takes expose inline SVG poster URLs
- done render jobs expose browser-playable output URLs
- done render jobs expose share URLs
- completed projects keep a poster thumbnail

## Claude Handoff

Claude can implement the R4 player UI using existing fields:

- `Take.videoUrl` / `Take.posterUrl` for compare cards
- selected take URLs from `ProjectBundle.takes` for edit preview
- `RenderJob.outputUrl` / `shareUrl` for export preview, download, and share actions

The media values are still mock data, but they are now valid for browser playback and layout QA.
