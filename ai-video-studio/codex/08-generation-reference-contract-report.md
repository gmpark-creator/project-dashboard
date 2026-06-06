# Codex R6 - Generation reference contract report

## Scope

R5 Visual Maker 구현 뒤에 남아 있던 "이미지 참조와 컷별 연출 지시가 영상 생성 어댑터 입력에 실제로 반영되는가"를 계약과 mock 검증으로 고정했다. Claude R6가 볼 UI/카피 영역과 겹치지 않도록 `StudioApp.tsx`와 CSS는 수정하지 않았다.

## Implemented

- `GenerationJob.promptPackage` 타입 추가
- `GenerationPromptPackage`에 아래 스냅샷 포함
  - `saec`
  - `directionSpec`
  - `requirements`
  - 참조 이미지 목록(`assetId`, `role`, `mode`, `url`, `rightsStatus`)
  - 라우팅 힌트(`startFrameAssetId`, `styleReferenceAssetIds`, `characterReferenceAssetIds` 등)
- `attachImageToShot`의 역할별 요구사항 매핑 보정
  - `first_frame` / `last_frame`만 `requirements.imageToVideo=true`
  - `character_reference`는 `requirements.characterLock=true`와 `characterId` 생성
  - `style_reference`는 style-only로 유지하고 image-to-video를 강제로 켜지 않음
- `generateShot` / `upgradeTake`가 참조 요구사항을 적용한 뒤 prompt package를 생성하도록 변경
- OpenAPI에 R5 이미지/참조 API 반영
  - `GET/POST /projects/{projectId}/assets`
  - `POST /projects/{projectId}/image-jobs`
  - `POST /shots/{shotId}/references`
  - `PATCH /shots/{shotId}/direction`
- `domain.schema.json`에 Visual Maker 이미지/참조/프롬프트 패키지 계약 추가
- `validate-contracts.ts`가 새 schema defs와 operationId 누락을 검사하도록 확장
- `mock-flow.test.ts`에 AC-8/9/10 성격의 검증 추가

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`

## Notes

- 실제 provider 어댑터가 붙을 때는 `GenerationJob.promptPackage`를 그대로 입력 패키지의 권위 소스로 사용하면 된다.
- 권리 미확인 참조는 `promptPackage.routingHints.rightsReviewRequired=true`로 전달된다. UI에서 최종 내보내기 경고를 강화하는 작업은 Claude R6 QA 결과에 맞춰 후속 반영하면 된다.
