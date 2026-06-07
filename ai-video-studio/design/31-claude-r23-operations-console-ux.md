# 31 · Claude R23 — 운영 콘솔(Operations Console) 신설

> 2026-06-08 · Claude(Opus 4.8) · 야간 자율 슬라이스 #1 (감사 [[30]] 후속)
> 영역: 프론트 UX (Claude-owned). 백엔드/계약/스키마 무수정.

## 목표

감사(design/30)에서 식별한 **미연결 운영자 read-only 엔드포인트**를 단일 화면에 노출. 운영자가 워커 파이프라인·엔진·런타임 상태를 한곳에서 점검할 수 있게 한다. 기존엔 readiness/metrics/queue/media-artifacts 4종만, 그것도 Dashboard·Asset Library에 분산.

## 한 일

### 1) 새 뷰 `ops` = 「운영」 콘솔
- `View`에 `"ops"` 추가, `titles.ops = ["운영", "워커·큐·엔진·스토리지 상태를 읽기 전용으로 점검합니다"]`.
- 네비는 `Object.keys(titles)` 자동 순회 → 좌측 레일/모바일 가로 네비에 "운영" 자동 노출(추가 코드 불필요).
- `OperationsConsole` 컴포넌트: 로드된 패널만 렌더, 전부 실패 시 안내 빈 상태. **어떤 작업도 변경·중단하지 않는 읽기 전용 surface.**

### 2) api.ts — read-only 운영자 래퍼 8종 추가 (기존 엔드포인트만)
`getProviderHealth · getWorkerDispatch · getWorkerLeases · getWorkerCompletions · getWorkerRetryPlan · getWorkerRetryExecutions · getStorageCleanupPlan · getStorageCleanupExecutions`. (뒤 2개는 R24에서 사용.) 모두 admin-guard라 실패 시 호출부에서 흡수.

### 3) 신규 패널 6종 + 런타임 패널 1종 (이번 콘솔에 통합)
| 패널 | 출처 | 핵심 노출(안전) |
|---|---|---|
| 런타임 점검 | readiness | 모드·점검 항목(한국어)·누락 env **이름**만 |
| 워커 디스패치 | worker-dispatch | 종류별 분포·대기/진행·기한초과·진행 작업 목록 |
| 워커 리스 | worker-leases | active/released/expired·만료 상대시간 |
| 워커 완료 | worker-completions | 성공/실패/취소·산출물·확정/환불 크레딧 |
| 재시도 계획 | worker-retries | 재시도 가능/보류·종류별·항목별 동작 |
| 재시도 실행 | worker-retries/executions | 교체 있음/누락·교체 종류·시각 |
| 엔진 상태 | provider-health | 정상/주의/중단 분포 + 기능(오디오·입력타입) **개수만** |
+ 기존 `SystemMetricsPanel`·`JobQueueSnapshotPanel` 재사용(코드 중복 없음).

### 4) 데이터 로딩
`ops` 뷰에 있는 동안에만 `loadOps()`가 8종을 병렬 조회하고 4초마다 갱신, 화면을 떠나면 인터벌 정리. 다른 화면에선 호출 안 함(운영자 API 부하 최소화).

### 5) QA가 잡은 폴리시 1건 수정
`readinessCheckLabels`에 Codex가 R18 이후 추가한 점검 id 4종(`persistence·provider_execution·story_decomposer·worker_output_policy`)이 없어 영어 폴백되던 것을 한국어로 보강. **공유 맵이라 상단 RuntimeReadinessBadge도 함께 개선.**

## 노출 안전성 (핵심 제약 준수)

모든 패널은 계약상 섞여 오는 **raw id·token·provider/model 실명·storageKey·url·workerId·dispatchKey·completionKey를 렌더하지 않고** summary 집계 + 안전 라벨(종류·상태·단계·상대시간·집계 수치)만 그린다. 특히 `엔진 상태`는 제품 원칙 P1(모델명 숨김)에 맞춰 provider/model 실명 대신 상태 분포·기능 개수만 노출.
- 예외: 런타임 점검의 **누락 환경변수 "이름"**(RUNWAY_API_KEY 등)은 디렉터 금지목록(=env "값") 대상이 아니며, 기존 RuntimeReadinessBadge와 동일한 허용 표시다(값은 절대 비노출).

CSS는 기존 디자인 시스템(`.panel.metrics`·`.metric-block`·`.metric-row`·`<Metric>`·`.queue-row` 리스트)을 100% 재사용 → **신규 CSS 0줄**.

## 검증

| 게이트 | 결과 |
|---|---|
| `npm run typecheck` | ✅ 에러 0 |
| `npm run validate:contracts` | ✅ providers 4·routing 7·templates 6·ops 44·routes 40 |
| `npm run test:mock` | ✅ 전 테스트 OK (mock-flow shots 10·takes 33 등) |
| `npm run build` | ✅ 운영 빌드 성공(신규 라우트 포함 매니페스트 정상) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| 브라우저 QA 1366×900 | ✅ 9패널 렌더·가로 오버플로 없음·**금지 문자열 누출 0**·콘솔 에러는 favicon 404뿐 |
| 브라우저 QA 390×900 | ✅ 9패널 렌더·가로 오버플로 없음·**금지 문자열 누출 0**·콘솔 에러 0 |

QA 하니스: Playwright(msedge), 로컬 dev `:3020` mock 모드. populate(프로젝트 생성→generate-all→tick×10)로 큐·워커 스냅샷에 실데이터를 채운 뒤 누출 스캔(provider명/model id/raw id/storageKey, `.readiness-env` 칩 제외). 스크린샷: `_qa_shots/ops-1366.png`, `ops-390.png`.

## blocker / 비고

- **favicon 404 (P1, 비차단)**: Next dev에 favicon 미구성. 기존 dev 노이즈이며 내 변경과 무관(운영 엔드포인트 8종 전부 200 확인). 앱 설정은 Codex 영역이라 미수정.
- **워커 mutating 동작**(lease complete/release/renew, retry execute, cleanup execute): 의도적 UI 비노출 유지 — token/leaseId 입력·실데이터 변경·파괴적이라 읽기 전용 콘솔 범위 밖(감사 §5).

## 다음

R24 — 스토리지 운영 패널(정리 계획 + 정리 실행 이력)을 콘솔에 통합(+미디어 인벤토리 재사용). api 래퍼는 이미 추가됨.
