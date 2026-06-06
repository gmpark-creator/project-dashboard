# Codex R8 - Provider routing contract report

## Scope

실제 provider API를 붙이기 전, mock 영상 생성 잡이 `routing.config.json`과 `provider-capabilities.json`을 기반으로 내부 라우팅 결정을 남기도록 보강했다. UI는 수정하지 않았고, provider/model 이름은 계속 `Take.engineUsed`와 `GenerationJob.routing`의 내부/debug 데이터로만 유지한다.

## Implemented

- `ProviderRouteTarget`, `ProviderRoutingDecision` 도메인 타입 추가
- `GenerationJob.routing` 추가
  - 선택된 provider/model
  - 적용된 rule id
  - 후보 목록
  - capability filter로 제외된 후보와 사유
  - split take index
  - fallback/hidden-from-user flags
- `src/server/provider-routing.ts` 추가
  - `codex/config/routing.config.json` rule 순서 기반 매칭
  - `provider-capabilities.json` 기반 필터
    - input type
    - aspect ratio
    - resolution
    - duration
    - audio capability
  - fast take는 routing policy에 따라 후보 provider로 분산
- mock generation 연결
  - `generateShot`이 각 Take별 라우팅 결정을 생성
  - `Take.engineUsed`를 config 기반 `provider:model` 내부 문자열로 기록
  - `upgradeTake`는 final tier route를 사용
  - 오래된 dev state의 generation job은 `normalizeState`에서 routing snapshot 보정
- schema/test 보강
  - `domain.schema.json`에 Provider routing defs 추가
  - `validate-contracts.ts`가 `ProviderRoutingDecision` def 존재를 확인
  - `mock-flow.test.ts`가 image-to-video fast, style-only fast routing과 provider split을 검증

## Verification

- `npm run typecheck`
- `npm run test:mock`
- `npm run validate:contracts`
- `npm run build`

## Notes

- 라우팅 결정은 사용자 UI에 노출하지 않는다. Claude UI는 계속 목적/티어/역할 언어만 보여야 한다.
- 다음 provider 구현 라운드는 `GenerationJob.promptPackage` + `GenerationJob.routing.selected`를 실제 adapter request로 변환하면 된다.
