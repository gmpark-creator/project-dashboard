# Codex R75 - Edit and audio input validation report

## Why

Edit commands and audio settings were accepted through request body casts. Invalid values could be merged directly into `EditState`, especially through the audio route's shallow patch behavior.

## Implemented

- Added `isEditAudioPatch()` to validate audio patch objects against the `EditAudioPatch` schema.
- Validates edit command request bodies:
  - body must be a JSON object
  - only `command` is allowed
  - optional `command` must be a string
- Validates audio patch request bodies:
  - only `captions`, `bgm`, `voiceover`, and `transitions` are allowed
  - nested objects must include the required fields with valid enum/boolean/string types
- Documents 400 `ErrorResponse` bodies for both routes.

## Notes

- Valid UI edit and audio setting updates are unchanged.
- Empty edit/audio objects remain valid and return the current edit state.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid edit command returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid edit command returning 200 with the command recorded.
- HTTP smoke for invalid audio patch returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid audio patch returning 200 with the requested settings.
