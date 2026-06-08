# 212 · 외부 아키텍처 리뷰 반영 — 비용 정책 단일화 + mock/live 경계 정리

> 2026-06-08 · Claude(Opus 4.8, 1M) · 무인 자율 세션 · [[38-claude-overnight-handoff]] / design/35 후속
> 입력: `EXTERNAL_EXPERT_MESSAGE.md`(아키텍처 검토 요청) + 디렉터 지시(ChatGPT 1차 리팩토링 반영·검증).
> 비고: 리뷰 패키지(`..._architecture_review_2026-06-08.zip`)는 880196c 스냅샷 **입력**이며 ChatGPT의 patch/zip **출력은 없었다**. 지시대로 요약 기준으로 **직접 구현**했다.

## 1. 배경 / 기존 아키텍처 리스크

- **비용 모델 단일 출처 부재(최대 blocker).** `cost/estimate`, 실제 reservation, UI 표시값이 서로 다른 숫자를 냈다(design/35). 구체적으로 estimate가 generateShot에 takeCount를 한 번 더 곱하고(18→54), generateAll/generateImages/startRender는 컷·장수·렌더수와 무관한 flat 값(96/24/48)이었다. 실제 예약은 컷당/장당/렌더당 스케일(180/count·4/renderCount·16).
- **mock/live 경계 누수.** `CreditReservationError`가 `mock-service.ts`에 정의돼, live(Postgres) 어댑터가 mock 구현 파일을 import 했다.
- **프로덕션 비용 견적의 mock 의존.** `/api/cost/estimate`가 프로덕션에서도 전역 mock 상태의 사용 가능 credit을 참조했고, projectId 없이도 성공했다(과금 신뢰성 위험).
- **live render preview 과금 fail-open.** live 렌더 견적이 사용 가능 credit을 `balance - reserved`로 계산해(실제 예약 체크는 `balance - spent - reserved`) available을 과대표시했다.

## 2. 비용 정책 단일화 (2.1) — `studio-app/src/domain/cost-policy.ts`

사용자 청구 credit(⚡)의 **단일 출처**. 다음을 export 한다.
- `CREDIT_COST`: 단위 단가 — `videoTake 6`, `imageVariant 4`, `render 16`, `upgradeTake 22`.
- `creditCostForAction(action, params)`: 액션별 청구 credit. generateShot=takeCount·6, generateAll=shotCount·3·6, regenerate=2·6, generateImages=imageCount·4, upgradeTake=22, startRender=renderCount·16, registerExternalImage=0. 입력은 정책 안에서 클램프(take 1..3, image 1..4).
- `buildCostEstimate(action, params, availableCredits)`: 순수 함수로 완전한 `CostEstimate`(credits/eta/available/affordable/shortfall) 생성.
- `DEFAULT_EXPORT_RENDER_COUNT = 3`: 표준 내보내기 컷 수(6s/15s/30s). render preview/UI 전체 비용 기준.

이 모듈을 참조하도록 통합한 곳:
- `mock-service.ts`: estimate 테이블 제거→`buildCostEstimate`. 모든 reserve/capture/refund/cancel 비용을 `creditCostForAction`/`CREDIT_COST`로 교체(숫자 불변). previewRender=표준 3컷=48.
- `live-persistence-write-adapter.ts`: generateShot/generateAll/startRender/createImageJob/upgradeTake + capture/refund/cancel 비용을 정책으로 교체.
- `live-render-preview.ts`: 하드코딩 48 제거→정책. available을 `balance - spent - reserved`로 정정.

결과: estimate == 실제 reservation 차감액이 액션별로 일치(invariant 테스트로 고정, §6).

## 3. mock/live 경계 정리 (2.3) — `studio-app/src/server/credit-errors.ts`

`CreditReservationError` / `isCreditReservationError`를 공통 서버 에러 모듈로 분리. `mock-service`·`live-persistence-write-adapter`·`app/api/credit-error.ts`·관련 테스트가 모두 여기서 import 한다. live 어댑터가 더 이상 mock-service를 import 하지 않는다.

## 4. 프로덕션 비용 견적 fail-closed (2.2) — `studio-app/src/server/cost-estimate.ts` + route

`resolveCostEstimate(action, params, projectId?)`:
- **live reads ON**(`CUTPILOT_ENABLE_LIVE_READS=1`): projectId **필수**(없으면 400 `PROJECT_REQUIRED`). 실제 live 프로젝트 계정으로 available 계산(`getLiveProjectBundle`). 프로젝트 없으면 404.
- **production runtime인데 live reads OFF**(`CUTPILOT_RUNTIME_MODE=production`): mock 숫자로 폴백하지 않고 **503 `LIVE_PERSISTENCE_REQUIRED`** fail-closed.
- **mock/dev**: 전역 mock 사용 가능 credit으로 계산.

`/api/cost/estimate` route는 `shotCount/imageCount/renderCount/projectId`를 수용·검증하고 위 헬퍼에 위임한다.

## 5. OpenAPI 동기화 (2.4)

`codex/api/openapi.json`의 `estimateCost` operation에 입력 `projectId`(pattern `^prj_`) + `params.{takeCount,shotCount,imageCount,renderCount}`(min/max 포함)와 응답 `404`/`503`를 문서화. `validate:contracts`의 route↔OpenAPI 상태 일치 검사를 통과한다.

## 6. 검증 결과

게이트(`npm run verify`) GREEN — 커밋 `961b154`(R31), `44633aa`(R32), 그리고 invariant 테스트 추가분:
- `typecheck` ✅ · `validate:contracts` ✅(providers 4·routing 7·templates 6·ops 44·routes 40) · `test:mock` ✅(전 테스트) · `npm audit --omit=dev` ✅(0 vuln) · `build` ✅(19/19 static).
- 신규 `scripts/cost-policy-invariants.test.ts`: 정책 정준값(회귀 가드) + estimate==policy + **estimate==실제 mock reservation 차감액**(generateShot 18 / generateImages 16 / generateAll shot·18 / startRender 48) + 프로덕션 fail-closed(400/503).
- **테스트 무약화 원칙 유지.** 단 하나, `live-render-preview.test`의 shortfall 단언을 8→26으로 **정정**했다(약화 아님): 기존 단언이 `spent` 미차감(과금 fail-open) 버그를 인코딩하고 있었고, 실제 예약 체크(`balance - spent - reserved`)와 일치하는 보수적 정답으로 바꿨다.

## 7. 다음 작업자(Claude/Codex)가 이어받을 slice

1. **UI 비용 표시를 정책/estimate로 통합(Claude, 프론트)**: `StudioApp.tsx`의 하드코딩 비용 문자열을 `cost-policy` 또는 `/api/cost/estimate` 결과로. 특히 내보내기 버튼이 실제 3컷(48)을 반영하도록(현재 단일 컷 preview만).
2. **live 비용 정합성 통합 테스트(Codex)**: 실제 DB 없이 가능한 범위에서 live 어댑터 reserve 금액 == 정책 금액 단위 테스트 강화(FakeClient 기반 write-adapter 테스트 확장).
3. **provider cost/margin 단일화 검토**: `mockProviderCostUsd`(credits·0.035)와 `MARGIN_POLICY_VERSION`을 cost-policy 인접으로 모을지 검토.
4. **server-derived counts**: 프로덕션 estimate에서 generateAll/startRender의 count를 client param 대신 live bundle에서 도출해 신뢰도 강화(현재는 client param + 서버 available).

남은 리스크/외부 의존은 [[213-claude-unattended-continuation-report]] 참조.
