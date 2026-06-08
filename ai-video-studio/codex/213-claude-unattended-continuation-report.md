# 213 · Claude 무인 연속작업 핸드오프 (Unattended Work Report)

> 2026-06-08 · Claude(Opus 4.8, 1M) · 무인 자율 세션 · [[212-external-architecture-refactor-report]] 후속
> 디렉터 부재 중 자율 진행. 위험 작업(배포/실결제/실 API/실 DB 마이그레이션/force push/secret)은 미수행.

## Summary
- 외부 아키텍처 리뷰(`EXTERNAL_EXPERT_MESSAGE.md`)의 1차 리팩토링을 **직접 구현·검증**했다. (리뷰 zip은 880196c 입력 스냅샷이고 ChatGPT의 patch/zip 출력은 동봉되지 않아, 디렉터 지시대로 요약 기준 직접 구현.)
- **비용/크레딧 단일 출처(`cost-policy.ts`)** 확립 → `estimate == reservation == UI 표시` 불일치(design/35) 제거.
- mock/live 경계 정리(`credit-errors.ts`), 프로덕션 estimate **fail-closed**, live/UI **과금 fail-open 버그 2건** 수정.
- 매 슬라이스 게이트 GREEN 후 commit + push.

## Applied Changes (commits, master)
| R | commit | 내용 |
|---|---|---|
| R31 | `961b154` | cost-policy 단일화 + credit-errors 분리 + estimate 프로덕션 fail-closed + OpenAPI |
| R32 | `44633aa` | live adapter/preview 비용 정책 통합 + render preview 과금 fail-open(available에 spent 미차감) 수정 |
| R33 | `9ffbb98` | 비용 invariant 테스트 신설 + codex/212 |
| R34 | `9081492` | UI 비용 정책화(이미지 24→16, generateAll 96→shot×18) + creditBalance spent 차감 + 잔여 하드코딩 정리 |
| (R30 `1f870fa`) | 이전 세션 | run() 실패 복구 한국어화(영어 raw 누출 제거) — 본 세션 직전 |

## Files Changed (핵심)
- 신규: `src/domain/cost-policy.ts`, `src/server/credit-errors.ts`, `src/server/cost-estimate.ts`, `scripts/cost-policy-invariants.test.ts`, `codex/212`, `codex/213`.
- 수정: `src/server/mock-service.ts`, `src/server/live-persistence-write-adapter.ts`, `src/server/live-render-preview.ts`, `src/server/live-project-builder.ts`, `app/api/cost/estimate/route.ts`, `app/api/credit-error.ts`, `src/features/studio/StudioApp.tsx`, `codex/api/openapi.json`, `scripts/live-persistence-write-adapter.test.ts`, `scripts/live-render-preview.test.ts`, `package.json`.

## Validation (매 슬라이스 `npm run verify`)
- [x] `npm run typecheck`
- [x] `npm run validate:contracts` (providers 4 · routing 7 · templates 6 · ops 44 · routes 40)
- [x] `npm run test:mock` (31개 — 신규 `cost-policy-invariants.test` 포함: 정책 정준값 + estimate==policy + estimate==실제 mock reservation 차감액 + 프로덕션 fail-closed 400/503)
- [x] `npm run build` (Compiled successfully, 19/19 static)
- [x] `npm audit --omit=dev` (0 vulnerabilities)

### 테스트 정직성 노트
- **테스트 무약화 원칙 유지.** 단 한 건 `live-render-preview.test`의 shortfall 단언을 8→26으로 **정정**(약화 아님): 기존 단언이 `available = balance - reserved`(spent 미차감, 과금 fail-open) 버그를 인코딩하고 있었고, 실제 예약 체크(`balance - spent - reserved`)와 일치하는 보수적 정답으로 교체. 사유를 테스트 주석과 커밋에 명시.

## Remaining Risks
- **provider cost margin**(`credits * 0.035`)과 `MARGIN_POLICY_VERSION`은 cost-policy 밖(mock-service·live-write-adapter에 각각). 사용자 credit과 **별개 개념**이라 이번 통합 범위에서 제외했고 두 곳이 일관(0.035)됨. 추후 cost-policy 인접 모듈로 모을지 검토.
- **프로덕션 estimate의 live 경로(projectId 有)**는 실제 Postgres 없이 단위 테스트 불가. fail-closed(projectId 無 → 400, production+live off → 503)만 테스트됨. 실 DB 통합 테스트는 환경 필요 → deferred.
- **generateAll/startRender의 count**는 client param 의존(서버 available은 권위). 프로덕션에서 client가 잘못된 count를 보내면 estimate 표시가 어긋날 수 있음(예약 자체는 서버 실제 데이터 기준이라 안전). 추후 server-derived count로 강화 권장.
- **live render preview**는 단일 spec 입력이지만 비용은 표준 3컷(`DEFAULT_EXPORT_RENDER_COUNT`) 가정. 내보내기 컷 구성이 가변이 되면 재검토.

## Deferred Unsafe Actions (지시상 금지 — 미수행)
- 프로덕션 배포 · 실 결제/유료 API/크레딧 구매 · 실 사용자 데이터 삭제 · 원격 DB 마이그레이션 · `git push --force` · secret 출력/커밋 · 대규모 파일 삭제.
- 실 provider/DB 연동 검증은 외부 계정·env 필요 → 환경 갖춰지면 진행.

## Next Recommended Slice
1. **내보내기 UI 컷 구성(Claude/프론트)**: 현재 내보내기 버튼은 표준 3컷(48) 고정. 사용자가 컷 구성을 고르면 `creditCostForAction("startRender", { renderCount })`로 실시간 반영하고, `previewRender`/`startRender`가 같은 spec 집합을 쓰게 통일.
2. **provider cost/margin 단일화(Codex/백엔드)**: `*0.035`·`MARGIN_POLICY_VERSION`을 cost-policy 인접으로 모아 단일 출처화.
3. **live 비용 정합성 테스트(Codex)**: `live-persistence-write-adapter.test`(FakeClient)에 `creditReserved == creditCostForAction(...)` 단언을 추가해 live 예약 금액의 정책 일치를 고정.
4. **server-derived counts(Codex)**: 프로덕션 estimate에서 generateAll/startRender의 count를 client param 대신 live bundle에서 도출.

## 경계 점검 결과 (backlog C)
live 어댑터 파일(`live-persistence-*`, `live-render-preview`, `live-project-builder`)은 더 이상 `mock-service`를 import 하지 않는다(credit-errors 분리로 해결). 나머지 mock-service import는 전부 정당한 mock-mode 코드(API 라우트 + mock 스냅샷 빌더)다.
