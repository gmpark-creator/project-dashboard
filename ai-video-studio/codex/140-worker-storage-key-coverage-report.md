# Worker Storage Key Coverage

## Scope

Extended mock-flow coverage for the production worker storage-key policy across all worker kinds.

## Changes

- Added production provider-generation completion coverage for URL-only rejection and expected take-video storage key acceptance.
- Added production render completion coverage for URL-only rejection and expected render output storage key acceptance.
- Kept the existing production image completion coverage for image and thumbnail storage keys.
- Relaxed the later metrics assertion to allow the extra completed render created by this coverage.

## Result

The storage-key policy now has direct coverage for image, provider-generation, and render worker completions.
