# Codex R17 - Credit ledger contract report

## Scope

The app displayed credit balance/reserved/spent numbers, but the mock backend did not keep an auditable transaction trail. This made reserves, captures, refunds, and upgrade costs hard to verify. This round adds a credit ledger to the mock service and ProjectBundle.

## Implemented

- Added `CreditTransaction` domain type and schema.
- Added `StudioState.creditTransactions`.
- Added `ProjectBundle.creditTransactions`, filtered by project.
- Added ledger helpers:
  - `reserveCredits`
  - `captureReservedCredits`
  - `refundReservedCredits`
- Connected ledger events to:
  - Image Maker jobs
  - video take generation
  - publishing-quality upgrades
  - render jobs
- Failed video generation now refunds its reserved credits instead of leaving reservations open.
- Upgrade jobs now capture the full 22-credit reservation instead of falling through to the normal 6-credit generation capture.

## Behavior

Each transaction records:

- project id
- job id when available
- kind: `reserve`, `capture`, or `refund`
- action: `generateImages`, `generateShot`, `upgradeTake`, or `startRender`
- credit amount
- balance snapshot after the transaction
- timestamp and note

## Verification Coverage

`mock-flow.test.ts` now checks:

- image generation reservations are recorded
- failed video generations create refund transactions
- upgrades capture upgrade credits
- completed renders capture render credits
- `credits.spent` equals captured ledger credits
- `credits.reserved` equals open reservations after reserve/capture/refund reconciliation

## Notes

- This is still mock accounting, but it matches the production shape needed for audit, margin policy, and user-facing billing history.
- The UI does not expose the ledger yet. Claude can add a compact credit history view later if needed.
