# 214 · [Claude → Codex 인계] Claude가 건드린 Codex 영역 — 검토·재정렬 요청

> 2026-06-08 · 작성: Claude(Opus 4.8, 1M) · 수신: Codex
> 박사 지시로 작성. **Codex가 이 문서를 먼저 읽고, 아래 항목을 검토해 Codex 설계/스타일대로 재정렬한 뒤 작업을 이어가라.**

## 0. 왜 이 문서가 있나 (솔직한 맥락)

- 박사의 무인 리팩토링 지시로 **Claude가 외부 아키텍처 리뷰 1차(비용 모델)를 구현**했다.
- 그런데 이 비용 모델은 `design/35`·`design/38`에 **"Codex 소유 blocker"로 명시된 Codex 영역**이었다. Codex의 인계/동의를 받고 한 게 아니라, **박사 지시를 따랐더니 결과적으로 Codex 영역(`src/server/`·`app/api/`·`src/domain/`·`codex/`·openapi)을 침범**한 것이다.
- ai-video-studio는 worktree/브랜치 격리 없이 **master 단일 + "영역 분리"로만** 충돌을 막는 구조인데, Claude가 그 경계를 넘었다.
- **현재 전부 `npm run verify` GREEN(테스트 통과)**이지만, **Codex의 스타일/설계와 다를 수 있다.** 그 부분을 Codex가 검토해 자기 방식대로 고치라는 게 박사 지시다.

## 1. 먼저 (안전 — 충돌 방지)

1. `git pull`로 master 받기. Claude 비용 작업은 master에 있다(커밋 `961b154`~`b143fcc`).
2. **Codex가 비용 모델을 병렬로(다른 PC/세션, 미push) 작업해둔 게 있으면 그것부터 확인하라.** 같은 파일(mock-service·openapi·비용 로직)이라 **중복/충돌** 위험이 크다. 어느 쪽을 살릴지(또는 어떻게 합칠지) Claude 결과를 갈아엎기 전에 정할 것.

## 2. 변경 인벤토리 (Codex 영역만)

| 파일 | 상태 | 변경 요약 | Codex 검토 포인트 |
|---|---|---|---|
| `src/domain/cost-policy.ts` | **신규** | 비용 단일 출처. exports: `CREDIT_COST`(videoTake6/imageVariant4/render16/upgradeTake22), `creditCostForAction(action,params)`, `buildCostEstimate(action,params,available)`, `isCostAction`, `CostAction`/`CostParams`, `DEFAULT_EXPORT_RENDER_COUNT=3`, `TYPICAL_PROJECT_CREDIT_BUDGET=180`, 외 상수 | **위치/형태 결정**: domain/에 코드 상수로 둠. routing/provider처럼 **config JSON으로 데이터화**(예: `codex/config/cost.config.json`)하는 게 Codex 설계에 맞나? 숫자 정책 자체도 확정 필요 |
| `src/server/credit-errors.ts` | **신규** | `CreditReservationError`/`isCreditReservationError`를 mock-service에서 떼어 공통화 | 네이밍/위치가 Codex 에러 모듈 컨벤션과 맞나(`app/api/error-response.ts` 등과 정합?) |
| `src/server/cost-estimate.ts` | **신규** | `resolveCostEstimate(action,params,projectId?)` + `CostEstimateError`. 프로덕션 fail-closed 로직 | fail-closed 셈(`liveProjectReadsEnabled()`→projectId 필수·404 / `CUTPILOT_RUNTIME_MODE=production`+live off→503)이 Codex의 productionMode/liveReads 패턴과 정합하나? 위치(server/)·에러 스타일 |
| `src/server/mock-service.ts` | 수정 | `CreditReservationError` 정의 제거(→credit-errors), `estimateCost` 테이블 제거→`buildCostEstimate`, **시그니처 `(action: string)`→`(action: CostAction)`**, `availableMockCredits()` export 추가, 모든 reserve/capture/refund/cancel 비용을 `creditCostForAction`/`CREDIT_COST` 참조, `estimateRemaining` 180→`TYPICAL_PROJECT_CREDIT_BUDGET`, `previewRender`=`DEFAULT_EXPORT_RENDER_COUNT` | estimateCost 시그니처 변경 영향, availableMockCredits export 적정성, 비용 참조 정확성 |
| `src/server/live-persistence-write-adapter.ts` | 수정 | `CreditReservationError` import를 mock-service→credit-errors로, 모든 reserve/capture/refund/cancel·`requiredCredits`를 `creditCostForAction`/`CREDIT_COST` 참조 | live 예약 금액의 정책 일치(숫자 불변), import 경계 |
| `src/server/live-render-preview.ts` | 수정 | `estimateLiveRenderCost` 하드코딩 48 제거→`buildCostEstimate("startRender",{renderCount:DEFAULT_EXPORT_RENDER_COUNT})`. **available 계산 변경: `balance - reserved` → `balance - spent - reserved`** | ⚠️**동작 변경**(아래 §3-2). 실제 live 계정 셈과 일치시킨 것 — Codex 의도와 맞는지 확정 |
| `src/server/live-project-builder.ts` | 수정 | `estimateRemaining` 180→`TYPICAL_PROJECT_CREDIT_BUDGET` | 사소. 상수화만 |
| `app/api/cost/estimate/route.ts` | 수정(재작성) | `shotCount/imageCount/renderCount/projectId` 수용·검증→`resolveCostEstimate` 위임. 400/404/503 매핑 | 라우트 스타일·입력검증·에러 매핑이 Codex 라우트 컨벤션과 맞나 |
| `app/api/credit-error.ts` | 수정 | `isCreditReservationError` import를 mock-service→credit-errors로 | 사소 |
| `codex/api/openapi.json` | 수정 | `estimateCost` operation에 `projectId`(`^prj_`)+`params.{takeCount,shotCount,imageCount,renderCount}`(min/max)+응답 `404`/`503` 추가 | 계약 정확성·스키마 스타일. route 상태와 일치(validate-contracts 통과) |
| `scripts/cost-policy-invariants.test.ts` | **신규** | 정책 정준값 + estimate==policy + estimate==실제 mock reservation + fail-closed(400/503) | Codex 테스트 스타일과 맞나 |
| `scripts/api-cost-estimate.test.ts` | **신규** | cost/estimate 라우트 HTTP 레벨(입력검증+fail-closed) | 동일 |
| `scripts/live-persistence-write-adapter.test.ts` | 수정 | `CreditReservationError` import 경로만 변경 | 사소 |
| `scripts/live-render-preview.test.ts` | 수정 | **단언 변경: `shortfallCredits` 8→26** (§3-1) | ⚠️**Codex 테스트를 Claude가 고침** — 반드시 확인 |
| `package.json` | 수정 | `test:mock`에 위 신규 테스트 2개 추가 | 사소 |
| `codex/212`, `codex/213`, `codex/214(이 문서)` | **신규** | Claude가 Codex 리포트 번호대에 작성 | 번호 충돌 시 Codex가 재번호 가능 |

## 3. 우선 검토 항목 (판단/행동 필요 — 높은 것부터)

### 3-1. [높음] `live-render-preview.test`의 단언을 Claude가 고침 (8→26)
- Claude 주장: 기존 단언 `shortfallCredits===8`은 `available = balance - reserved`(spent 미차감) **과금 fail-open 버그**를 인코딩하고 있었다. 실제 live 예약 체크(`live-persistence-write-adapter`의 availableCredits)는 `balance - spent - reserved`다.
- 그래서 preview도 `balance - spent - reserved`로 맞추고, 테스트를 `26`(=48-(40-18-0))으로 **정정**했다(약화 아님이라 판단).
- **Codex 확인 요청:** 이 정정이 Codex 설계 의도와 맞나? live preview의 available 정의가 정말 `balance - spent - reserved`가 맞나(어댑터와 일치)? 아니라면 되돌리고 Claude에게 알려달라.

### 3-2. [높음] `live-render-preview.ts` available 계산 동작 변경
- 위와 연동. 어댑터의 `availableCredits`(balance-spent-reserved)와 일치시킨 보수적 변경. Codex의 live 정산 모델 기준으로 맞는지 확정.

### 3-3. [중] `cost-policy`를 코드 상수로 둘지 / config 데이터로 뺄지
- 리뷰/박사 방침은 "라우팅 테이블은 **데이터로 분리**"(provider-capabilities.json·routing.config.json). 비용도 같은 논리로 `codex/config/`의 JSON으로 빼서 Codex가 코드 수정 없이 갱신하게 하는 게 맞을 수 있다. **Claude는 일단 domain/ 코드 상수로 둠.** Codex가 데이터화하려면 cost-policy의 함수 표면은 유지하고 내부 값만 config에서 읽게 바꾸길 권함(프론트가 함수 표면에 의존 — §5).

### 3-4. [중] 모듈 위치/네이밍 컨벤션
- `cost-estimate.ts`(server/), `credit-errors.ts`(server/), `cost-policy.ts`(domain/)의 위치·네이밍이 Codex 구조와 맞나. fail-closed 로직을 별도 server 모듈로 둘지, 기존 패턴(예: `live-persistence-runtime` 옆)에 둘지.

### 3-5. [중] `estimateCost` 시그니처 변경 + 라우트 재작성
- `estimateCost(action: string)` → `(action: CostAction)`. 라우트가 `isCostAction`으로 좁힌다. Codex 계약/스타일에 맞게.

## 4. 불변식 (재정렬해도 깨지면 안 되는 것)

- **비용 단일 출처 = `cost-policy.ts`.** mock 예약·live 예약·`/api/cost/estimate`·UI 표시가 전부 이 한 곳을 참조하도록 통일됨 → **estimate == reservation == UI 표시** 불변식(`design/35`의 3중 불일치 해소). 재정렬 시 출처를 다시 흩뜨리지 말 것.
- **프로덕션 fail-closed:** 프로덕션 비용 견적이 mock 전역 상태로 폴백하지 않게(projectId 필수 / live 없으면 503).
- **누출 안전:** raw id/provider·model명/token/url/storageKey 비노출.

## 5. 프론트(Claude 영역) 의존성 — 변경 시 알릴 것

- `StudioApp.tsx`(Claude 영역)가 **`@/domain/cost-policy`의 `creditCostForAction`·`DEFAULT_EXPORT_RENDER_COUNT`를 직접 import**해 버튼 비용을 표시한다(R34).
- 따라서 **cost-policy의 export 시그니처(함수명·인자·반환)를 바꾸면 프론트가 깨진다.** 내부 구현/위치는 자유롭게 바꿔도 되지만, **공개 표면을 바꾸면 Claude에게 알려달라 — 프론트는 Claude가 맞춘다.**

## 6. 게이트

재정렬은 `npm run verify` GREEN 유지하며 진행할 것: typecheck · validate:contracts(ops 44/routes 40) · test:mock(현재 **32개**, 신규 2개 포함) · audit(0 vuln) · build.

## 7. 한 줄 요약

Claude가 박사 지시로 Codex 영역의 비용 모델을 구현했고 전부 GREEN이다. **Codex는 §1(병렬 작업 충돌 먼저 확인) → §3(높음 2건: 테스트 단언/available 변경 확정, 그 다음 cost-policy 데이터화 여부) 순으로 검토해, 자기 설계대로 재정렬하면 된다. 단 §4 불변식과 §5 프론트 표면 의존은 지켜달라.**
