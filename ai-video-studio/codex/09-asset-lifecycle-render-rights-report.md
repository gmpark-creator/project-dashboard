# Codex R7 - Asset lifecycle and render rights report

## Scope

Claude R7 UX 작업과 겹치지 않도록 UI/CSS는 수정하지 않고, Visual Maker의 Asset Library와 Video Maker 연결 뒤쪽 계약을 보강했다. 이번 범위는 자산 참조 해제, 사용 중 자산 삭제 가드, 내보내기 시 권리 점검 스냅샷이다.

## Implemented

- `RenderJob.rightsReview` 추가
  - selected shot의 `referenceImageIds` 중 `rights.status="needs_review"`인 이미지 자산을 수집
  - 각 렌더 잡에 `required`, `assetIds`, `items[]` 스냅샷 저장
- `AssetDeleteResult` 타입 추가
- mock-service에 자산 생명주기 함수 추가
  - `detachImageFromShot(shotId, assetId)`
  - `deleteImageAsset(projectId, assetId, { force })`
- 삭제 정책
  - 사용 중인 `ImageAsset`은 기본 삭제 차단
  - `force=true`면 board bucket, `AssetUsage`, `Shot.referenceImageIds`, image variant 연결을 정리한 뒤 삭제
  - 참조 해제 후 `imageToVideo` / `characterLock` 요구사항을 남은 참조 기준으로 재계산
- API 추가
  - `DELETE /api/shots/[shotId]/references/[assetId]`
  - `DELETE /api/projects/[projectId]/assets/[assetId]?force=true`
- OpenAPI/schema 업데이트
  - `RenderRightsReview`
  - `AssetDeleteResult`
  - `deleteImageAsset`
  - `detachImageFromShot`
- `validate-contracts.ts`가 새 schema defs와 operationId를 검사하도록 확장
- `mock-flow.test.ts`에 삭제 가드, 참조 해제, 강제 삭제, 렌더 권리 스냅샷 검증 추가

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`

## Notes

- Claude UI는 `RenderJob.rightsReview.required`와 `items[]`만 읽으면 내보내기 전 권리 경고를 표시할 수 있다.
- 실제 스토리지 구현이 붙으면 `deleteImageAsset`의 force delete 지점에 원본/썸네일 객체 삭제를 연결하면 된다.
