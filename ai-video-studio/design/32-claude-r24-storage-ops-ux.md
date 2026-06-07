# 32 · Claude R24 — 스토리지 운영 패널

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #2 · [[31]] 후속
> 영역: 프론트 UX (Claude-owned). 백엔드/계약/스키마 무수정.

## 목표

운영 콘솔(R23)에 **스토리지 관측**을 추가해 운영자가 저장 산출물의 정리 후보·실제 정리 이력을 한곳에서 본다.

## 한 일 — 운영 콘솔에 패널 3종 통합

| 패널 | 출처 | 핵심 노출(안전) |
|---|---|---|
| 미디어 산출물 인벤토리 | media-artifacts | (기존 `MediaArtifactInventoryPanel` 재사용) 저장/외부·정리 상태·용량 |
| 스토리지 정리 계획 | storage-cleanup (GET) | 보관/외부 확인/삭제 후보·회수 가능 용량 + 후보별 보관 역할·종류·참조·용량 |
| 스토리지 정리 실행 | storage-cleanup/executions | 삭제 건수·회수 용량 + 정리별 회수 용량·시각 |

- `cleanupActionMeta`로 `StorageCleanupAction`(retain/review_external/delete_object)을 한국어 배지로.
- 정리 계획은 삭제 후보 → 외부 확인 → 보관 순으로 정렬해 점검 우선순위가 위로 오게 함.
- `OperationsConsole`에 `inventory·cleanupPlan·cleanupExecutions` prop 추가, `loadOps()`가 두 스냅샷 + 인벤토리도 함께 조회.

## 노출 안전성

- 정리 계획 항목: `artifact.role/kind`(계약상 분류값, 노출 안전) + 정리 분류 + 참조 수 + 용량만. **`storageKey`·artifact id·`reason` 비노출.**
- 정리 실행 기록: 회수 용량·시각만. **`id·artifactId·projectId·storageKey·reason` 비노출.**
- 실제 삭제(POST storage-cleanup)는 파괴적이라 UI 비노출 — "실제 삭제는 운영 런북에서" 문구로 읽기 전용 한계를 명시.
- CSS는 기존 `.artifact-list`/`.artifact-row` 패턴 재사용 → **신규 CSS 0줄.**

## 검증

| 게이트 | 결과 |
|---|---|
| `npm run typecheck` | ✅ 에러 0 |
| `npm run validate:contracts` | ✅ ops 44·routes 40 |
| `npm run test:mock` | ✅ 전 테스트 OK |
| `npm run build` | ✅ Compiled successfully (19/19 static) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| 브라우저 QA 1366×900 / 390×900 | ✅ **운영 콘솔 12패널 전부 렌더**·가로 오버플로 없음·**금지 문자열 누출 0**·콘솔 에러는 favicon 404뿐 |

운영 콘솔 패널 최종 12종: 런타임 점검 · 운영 지표 · 작업 큐 · 워커 디스패치 · 워커 리스 · 워커 완료 · 재시도 계획 · 재시도 실행 · 엔진 상태 · 미디어 산출물 인벤토리 · 스토리지 정리 계획 · 스토리지 정리 실행.

## 다음

R25 — 전체 Studio 플로우(대시보드→Image/Asset→Video→스토리보드→비교→다듬기→내보내기) 모바일(390)/데스크톱(1366) QA + 문구·상태 라벨 마감.
