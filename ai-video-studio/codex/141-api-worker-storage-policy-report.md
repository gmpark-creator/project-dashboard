# Codex R141 - API worker storage policy report

## Scope

- Added route-level coverage for production worker lease completion storage key enforcement.
- Kept this in the Codex contract/backend lane; no frontend UX changes were made.

## Changes

- Added `scripts/api-worker-storage-policy.test.ts`.
- Wired the new test into `npm run test:mock`.
- The test creates a production-mode image worker lease through `/api/system/worker-leases`, then completes it through `/api/system/worker-leases/[leaseId]/complete`.

## Verified Behavior

- Missing image output storage keys return HTTP 422 with `reason: "invalid_outputs"`.
- Mismatched image output storage keys return HTTP 422 with `reason: "invalid_outputs"`.
- Matching app-managed image and thumbnail storage keys return HTTP 200 and include the worker-provided image and thumbnail artifacts in the completion receipt.

## Verification

- Passed: `npm run test:mock`
- Passed: `npm run validate:contracts`
- Passed: `npm run verify`
