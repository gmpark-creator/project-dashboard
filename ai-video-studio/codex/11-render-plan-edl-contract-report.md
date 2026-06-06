# Codex R9 - Render plan EDL contract report

## Scope

실제 Remotion/FFmpeg 렌더 파이프라인으로 넘어가기 전, `RenderJob`이 어떤 컷과 Take를 어떤 편집 설정으로 합칠지 고정하는 EDL(Edit Decision List) 스냅샷을 추가했다. UI는 수정하지 않았다.

## Implemented

- `RenderPlan` 도메인 타입 추가
  - `projectId`
  - `spec`
  - `totalDurationSec`
  - `missingShotIds`
  - ordered `shots[]`
  - edit snapshot(`captions`, `bgm`, `voiceover`, `transitions`, `commands`)
- `RenderJob.renderPlan` 추가
- `startRender`가 렌더 잡 생성 시점에 selected take와 edit state를 스냅샷
- 아직 선택 가능한 완료 Take가 없는 컷은 `missingShotIds`에 기록
- 오래된 dev state의 render job은 `normalizeState`에서 render plan 보정
- `domain.schema.json`에 `RenderPlan`과 `EditState` defs 추가
- `validate-contracts.ts`가 `RenderPlan` def 존재를 확인
- `mock-flow.test.ts`에 render plan 검증 추가
  - 선택/누락 컷 총합이 storyboard 컷 수와 일치
  - 누락 failed shot 보존
  - total duration 계산
  - edit command 스냅샷
  - selected shots order 보존

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`

## Notes

- 실제 렌더러는 `RenderJob.renderPlan`을 입력으로 받아 EDL을 구성하면 된다.
- `missingShotIds`가 비어 있지 않은 렌더를 UI에서 막을지, partial preview로 허용할지는 Claude/제품 라운드에서 결정하면 된다.
