# Codex R78 - Public JSON body parsing report

## Why

Some public generation routes still parsed JSON bodies through casts. JSON `null`, arrays, or primitive bodies could bypass the intended validation path and potentially fail as route exceptions.

## Implemented

- `POST /api/projects` now requires an object body before reading project fields.
- Project creation now rejects non-string optional `title` values.
- `POST /api/storyboard/decompose` now requires an object body and validates optional `projectId` type.
- `POST /api/projects/{projectId}/image-jobs` now requires an object body before validating image job fields.

## Notes

- Existing valid request behavior is unchanged.
- These routes already documented 400 responses; this round makes malformed JSON body shapes use those responses consistently.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for non-object project create body returning 400 with a full `ErrorResponse`.
- HTTP smoke for non-object storyboard decompose body returning 400 with a full `ErrorResponse`.
- HTTP smoke for non-object image job body returning 400 with a full `ErrorResponse`.
