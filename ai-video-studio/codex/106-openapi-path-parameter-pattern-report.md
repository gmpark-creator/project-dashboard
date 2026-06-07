# OpenAPI Path Parameter Pattern Guard

## Scope

Added explicit ID prefix patterns to OpenAPI path parameters and a contract guard for future routes.

## Changes

- Added `^prj_`, `^sht_`, `^tak_`, and `^(gen_|ijob_|rnd_)` patterns where they were missing.
- Added validation that every templated path parameter is declared, required, string typed, and uses the expected ID prefix pattern when one is known.
- Kept existing `assetId` and `leaseId` path parameter patterns covered by the new guard.

## Result

OpenAPI paths now carry the same ID-shape expectations that the application routes and domain schemas already use.
