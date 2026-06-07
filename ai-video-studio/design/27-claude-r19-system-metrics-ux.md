# Claude R19 — System Metrics UX

운영자가 **전체 프로젝트의 운영 상태**(프로덕션 건수·작업 현황·크레딧·엔진 시도 결과·미디어
산출물)를 한눈에 볼 수 있는 컴팩트한 운영 지표 surface를 Studio UI에 추가했다. 백엔드/스키마/
스크립트는 건드리지 않고, Codex가 제공한 `GET /api/system/metrics` 계약(`SystemMetrics`)을 UI에서
소비만 한다.

## 무엇이 바뀌었나

- **대시보드 상단에 `운영 지표` 패널을 추가**했다. 프로젝트 목록(`이어서 작업하기`) 바로 위에
  상주하는 단일 `.panel`이다. 새 화면/탭을 만들지 않고, 운영자의 홈인 대시보드에 얹었다.
- 패널 헤더: 제목 + `진행 중 작업 N건` 배지(없으면 초록 `진행 중 작업 없음`) + `HH:MM 기준` 시각.
- 본문은 카드 중첩 없이 **상단 구분선으로만 나뉜 블록 5개**로 구성:
  1. **프로덕션** — 프로젝트 총수 / 진행 중(active) / 완료 / 실패 / 진행 중 작업(in-flight). 진행 중
     작업 수는 generation·image·render 잡의 `queued + running` 합으로, readiness-adjacent한
     "지금 돌고 있는 일" 신호다.
  2. **크레딧 ⚡** — 사용 가능 / 예약 / 사용 / 사용 확정(capture) / 환불(refund).
  3. **작업 현황** — 영상 생성·이미지·내보내기 3종 잡의 상태 분포(진행/대기/완료/실패/취소). 0이
     아닌 상태만 톤 칩으로 노출해 컴팩트하게 유지(활성=시안, 완료=초록, 실패=빨강, 취소=중립).
  4. **엔진 시도 결과** — 시도 / 성공 / 실패 / 재시도 가능 / 대체 권장 / 평균 응답. **엔진·모델
     이름 없이** 시도 결과 집계만 표시. 평균 응답은 ms/초로 포맷, 데이터 없으면 `—`.
  5. **미디어 산출물** — 전체 / 이미지 / 영상 / 외부 연결 수.
- 톤 규칙: 수치 방향은 색(초록=양호/완료·환불, 빨강=실패)으로만 읽게 해 부호 혼동을 피한다.

## 위치 선택 이유

- 지표는 특정 프로젝트가 아니라 **전체 운영**을 요약하므로, 단일 프로젝트 흐름(스토리보드/비교/
  내보내기)이 아닌 **대시보드**가 자연스러운 자리다.
- 프로젝트가 하나도 없을 때(온보딩 빈 상태)는 모든 수치가 0이라 패널이 비어 보이므로, **프로젝트가
  있을 때만** 렌더한다. 빈 상태의 온보딩 메시지는 그대로 깔끔하게 유지된다.

## 데이터 흐름 / 새로고침

- `src/features/studio/api.ts`에 UI 전용 클라이언트 메서드 `getSystemMetrics()` 추가
  (`GET /api/system/metrics` → `SystemMetrics`).
- `StudioApp`의 `loadMetrics()`가 조회 후 상태에 저장. 실패해도 패널만 숨기고 본 작업 흐름은 막지
  않는다(읽기 전용 부가 정보).
- 갱신 시점:
  - **마운트 시 1회**.
  - **액션 직후 즉시** — 잡/크레딧/산출물을 바꾸는 모든 경로가 `run()` 또는 `cancelJob()` /
    `cancelActiveJobs()`를 거치므로, 이 세 곳에서 `refresh()` 직후 `loadMetrics()`를 호출한다
    (생성·이미지 잡·렌더 시작, 후보 선택/업그레이드, 작업 취소 등).
  - **백그라운드 라이브 갱신** — 기존 1.2초 `tick`/`refresh` 루프에서 잡 상태가 진행되며 지표가
    바뀌므로, 매 틱 호출은 과해서 **약 5틱(~6초)마다 한 번** 갱신한다(`tickCount` ref로 카운트).
    readiness(R18, 환경변수 기반 정적)와 달리 지표는 동적이라 라이브 유지가 운영자에게 유용하다.

## 프라이버시 제약 (노출하지 않는 것)

- 엔진/프로바이더 이름, 모델 이름 — `엔진 시도 결과` 블록은 결과 집계만 보여주고, 패널에 보조
  문구(`엔진·모델 이름은 표시하지 않고 시도 결과만 집계합니다.`)를 명시.
- 잡 id, 자산 id, 프로젝트 내부 id — 어떤 수치에도 id를 쓰지 않는다.
- 원시 프롬프트, 환경변수 값, 백엔드 구현 디테일 — 전부 미노출. `SystemMetrics` 계약 자체가
  집계 수치만 담고 있어, UI는 그 필드만 렌더한다.

## 만진 파일

- `ai-video-studio/studio-app/src/features/studio/api.ts` — `getSystemMetrics()` 추가,
  `SystemMetrics` 타입 import.
- `ai-video-studio/studio-app/src/features/studio/StudioApp.tsx` — `SystemMetricsPanel` 및 보조
  컴포넌트(`Metric`, `MetricJobRow`)·헬퍼(`formatAvgLatency`, `metricJobStatusMeta`), `metrics`
  상태·`loadMetrics()`·갱신 훅(마운트/액션/틱), 대시보드 상단 렌더 추가.
- `ai-video-studio/studio-app/app/globals.css` — `.metrics*` / `.metric*` 패널·스탯·작업행 스타일.
- `ai-video-studio/design/27-claude-r19-system-metrics-ux.md` — 본 리포트.

백엔드/서비스/계약 파일(`src/server/*`, `app/api/*`, `scripts/*`, `codex/schemas/*`, `codex/api/*`)과
`src/domain/types.ts`는 건드리지 않았다(`SystemMetrics` 타입·엔드포인트는 Codex가 이미 정의).

## 레이아웃 노트 (가로 넘침 방지)

- `.metric-row { grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); }` — 스탯 칸이 좁은
  폭에서 자동 줄바꿈된다. 390px(뷰 패딩 14px×2 → 본문 ~362px)에서 3칸 내외로 접히며 가로 스크롤이
  없다. 1366px에서는 한 줄에 펼쳐진다.
- `.metric { min-width: 0; }` + `.metric-label { overflow-wrap: anywhere; }` — 긴 라벨이 칸을
  밀어내지 않는다.
- `.metric-job-counts { flex-wrap: wrap; min-width: 0; }`, `.metric-job-count { white-space: nowrap; }`
  — 상태 칩은 한 칩 단위로 줄바꿈되어 행을 넘지 않는다.
- 패널 자체는 기존 `.panel`(`min-width: 0`)을 재사용해 그리드 컬럼 안에서 넘치지 않는다. 헤더의
  `.metrics-meta`는 `flex-shrink: 0`으로 우측 정렬, 배지는 짧아 좁은 폭에서도 안전하다.
- 중첩 카드·랜딩·히어로·마케팅 섹션 없음. 블록은 상단 구분선으로만 구분해 작업 밀도를 유지한다.

## 수행한 검증

`studio-app` 디렉터리에서 실행, 모두 통과:

| 명령 | 결과 |
| --- | --- |
| `npm run typecheck` | 통과 (tsc --noEmit, 에러 없음) |
| `npm run test:mock` | 통과 — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | 통과 — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 17 }` |
| `npm run build` | 통과 — `/api/system/metrics` 포함 전체 라우트 빌드 |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

Codex 후속 브라우저 검증(Chrome CDP, `http://127.0.0.1:3020`):

| 뷰포트 | 결과 |
| --- | --- |
| 390×900 | `.metrics` 렌더 확인, `documentScrollWidth=390`, `bodyScrollWidth=390`, `overflowX=0`, 패널 `left=14/right=376/width=362` |
| 1366×900 | `.metrics` 렌더 확인, `documentScrollWidth=1351`, `bodyScrollWidth=1351`, 가로 넘침 없음, 패널 `left=274/right=1325/width=1051` |

레이아웃은 실제 렌더에서도 위 "레이아웃 노트"의 `auto-fit minmax(92px,1fr)` 줄바꿈·`min-width: 0`·
`overflow-wrap` 가드가 기대대로 동작했다.
