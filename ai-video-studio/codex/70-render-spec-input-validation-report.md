# Codex R70 - Render spec input validation report

## Why

Render preview and render start routes accepted `ExportSpec` through TypeScript casts. Runtime clients could send unsupported resolution, cut, aspect, or caption values, even though the domain schema and OpenAPI contract define strict enum values.

## Implemented

- Exported `isJsonObject()` from the JSON body helper.
- Added `isExportSpec()` to validate render export specs against domain enum values.
- Validates `POST /api/projects/{projectId}/render-preview` before calling `previewRender()`.
- Validates every item in `POST /api/projects/{projectId}/renders` before calling `startRender()`.
- Updates OpenAPI 400 descriptions to cover missing or invalid render specs.

## Notes

- Valid render preview and start requests are unchanged.
- Credit reservation failures for render start still return the existing 402 insufficient-credit response.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- HTTP smoke for invalid render preview spec returning 400 with a full `ErrorResponse`.
- HTTP smoke for invalid render start spec returning 400 with a full `ErrorResponse`.
- HTTP smoke for valid render preview returning 200 with the requested spec.
