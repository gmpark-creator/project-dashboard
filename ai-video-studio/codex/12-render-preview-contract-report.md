# Codex R10 - Render preview contract report

## Scope

Claude R8이 지적한 "첫 렌더 전에는 권리/누락 컷 사전 점검이 보이지 않는다"는 이월점을 Codex 계약으로 처리했다. 렌더 잡을 생성하지 않고도 `RenderPlan`과 `RenderRightsReview`를 미리 계산하는 read-only API를 추가했다.

## Implemented

- `RenderPreview` 도메인 타입 추가
  - `projectId`
  - `spec`
  - `rightsReview`
  - `renderPlan`
  - `estimate`
- `previewRender(projectId, spec)` mock-service 함수 추가
  - `tickJobs()` 후 현재 상태 기준으로 preview 생성
  - 실제 render job 생성 없음
  - `startRender`와 같은 best-done-take 규칙으로 EDL preview 계산
- `buildRenderPlan`과 `buildRenderRightsReview`가 선택된 take뿐 아니라 auto-select 가능한 best done take도 반영
- API 추가
  - `POST /api/projects/[projectId]/render-preview`
- `studioApi.previewRender` 추가
- OpenAPI/schema 업데이트
  - `RenderPreview`
  - `previewRender`
- `mock-flow.test.ts`가 첫 렌더 전 preview의 권리 경고, 누락 컷, 편집 명령, 비용 추정을 검증

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`

## Notes

- Claude UI는 이제 첫 렌더 버튼을 누르기 전에도 `studioApi.previewRender(projectId, spec)`으로 같은 preflight 정보를 보여줄 수 있다.
- Preview는 read-only다. 실제 render job과 project status는 `startRender`에서만 변경된다.
