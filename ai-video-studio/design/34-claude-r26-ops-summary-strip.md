# 34 · Claude R26 — 운영 콘솔 건강 요약 스트립

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #4 · [[33]] 후속
> 영역: 프론트 UX (Claude-owned). 백엔드/계약/스키마 무수정.

## 목표

운영 콘솔이 R23/R24로 12패널까지 커지면서, 운영자가 "지금 이상 있나?"를 보려면 스크롤이 필요해졌다. 상단에 **at-a-glance triage 스트립**을 두어 핵심 이상 징후를 한 줄로 보여주고, 타일을 누르면 해당 패널로 스크롤한다.

## 한 일 — `OpsSummaryStrip`

콘솔 헤더 바로 아래 `운영 요약` 패널. 로드된 스냅샷에서 다음 타일을 동적 구성(소스 없으면 타일 생략, 타일이 하나도 없으면 스트립 자체를 렌더 안 함):

| 타일 | 값 | tone | 이동 대상 |
|---|---|---|---|
| 운영/목업 모드 | 점검 N (또는 정상) | warn/ok | 런타임 점검 |
| 진행 중 작업 | queue.active | — | 작업 큐 스냅샷 |
| 실패 작업(있을 때) | queue.failed | warn | 작업 큐 스냅샷 |
| 재시도 가능(실패 있을 때) | retryable/totalFailed | ok/warn | 재시도 계획 |
| 엔진 점검 | degraded+down (또는 정상) | warn/ok | 엔진 상태 |
| 삭제 후보(있을 때) | deleteCandidates | warn | 스토리지 정리 계획 |

- 클릭 → `document.querySelector('section[aria-label="…"]').scrollIntoView({behavior:"smooth"})`. 패널마다 고유 aria-label이 이미 있어 **재사용 컴포넌트(metrics/queue 등)를 건드리지 않고** 스크롤 타깃으로 연결.
- 집계 수치만 노출, raw 식별자 없음.

## CSS

`.ops-summary` / `.ops-summary-grid`(auto-fit minmax(120px,1fr) → 390px 자동 줄바꿈) / `.ops-tile`(+`.tone-ok`/`.tone-warn`) 신규 블록 추가. 기존 디자인 토큰(`--panel-2`·`--line`·톤 색) 재사용. 신규 CSS ~50줄(새 인터랙션 패턴이라 정당).

## 검증

| 게이트 | 결과 |
|---|---|
| `npm run typecheck` | ✅ 에러 0 |
| `npm run validate:contracts` | ✅ |
| `npm run test:mock` | ✅ 전 테스트 OK |
| `npm run build` | ✅ Compiled successfully (19/19 static) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| 운영 콘솔 QA 1366×900 / 390×900 | ✅ 요약 스트립 + 12패널 렌더·가로 오버플로 없음·**누출 0**·콘솔 에러 favicon 404뿐 |

## 다음

- 백로그(#4) — generate-all 사전 비용(cost/estimate) 표시 검토, 자산/참조 해제(write라 보수적).
- 또는 운영 콘솔 외 추가 Claude-owned UX 갭 재탐색(완료성 점검).
