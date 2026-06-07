# Codex R59 - Production worker output URL policy report

## Why

Production worker completions already require output payloads, but the URL validator still accepted mock-only schemes. That is useful for local development, but production completions should fail closed unless worker outputs use durable HTTPS URLs suitable for ingest into app-managed storage.

## Implemented

- Tightened worker completion URL validation in production mode:
  - production accepts `https:` output URLs only
  - mock mode keeps accepting `http:`, `https:`, `data:`, and `mock:`
- Applied the policy to:
  - provider video/poster URLs
  - render output/share URLs
  - image variant image/thumbnail URLs
- Added mock-flow coverage proving production rejects `mock:` output URLs before accepting a later valid `https:` output on the same lease.

## Notes

- This does not implement R2/S3 upload or object deletion. It closes a production validation gap before those adapters are added.
- Storage key ownership validation from R50 remains separate and still runs after URL shape validation.

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`
- `npm audit --omit=dev`
- Direct production-mode worker completion smoke for non-HTTPS rejection and HTTPS acceptance.
