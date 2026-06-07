# Mock Test Script Coverage

## Scope

Guarded the mock verification command against omitted test files.

## Changes

- Added contract validation that every `scripts/*.test.ts` file appears in `npm run test:mock`.

## Result

New mock or route-level tests now fail contract validation if they are added to the repository but not wired into the verification command.
