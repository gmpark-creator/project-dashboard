# Claude R21 — Job Queue Snapshot UX

운영자가 **전체 프로젝트의 작업 큐/워커 현황**(대기·진행·진행 중·취소 가능·실패·취소·기한 초과·다음
마감과 최근·진행 작업 목록)을 한눈에 볼 수 있는 읽기 전용 surface를 Studio UI에 추가했다. 백엔드/
스키마/도메인 타입/스크립트는 건드리지 않고, Codex가 제공한 `GET /api/system/queue` 계약
(`JobQueueSnapshot`)을 UI에서 소비만 한다.

**워커 제어 surface가 아니다.** 이 화면은 운영 점검용 읽기 전용 스냅샷이며, 큐 일시정지/재개/재시도/
삭제 같은 동작은 제공하지 않는다(가짜 제어 버튼도 두지 않는다).

## 무엇이 바뀌었나

- **대시보드의 운영 지표 패널(R19) 바로 아래에 `작업 큐 스냅샷` 패널을 추가**했다. 운영 지표 패널
  `.metrics`의 블록 구조를 재사용한 전체 폭 단일 `.panel`이다. 새 화면/탭/랜딩/히어로를 만들지 않았다.
- 패널 헤더: 제목 + 진행 상태 배지(`진행 중 작업 N건`(summary.active) / 없으면 초록 `진행 중 작업 없음`)
  + `HH:MM 기준` 시각.
- 본문은 카드 중첩 없이 **상단 구분선으로만 나뉜 블록 2개 + 최근·진행 목록**으로 구성:
  1. **작업 현황** — 전체(total) / 대기(queued) / 진행(running) / 진행 중(active) / 취소 가능(cancelable).
  2. **상태 · 마감** — 실패(failed) / 취소됨(cancelled) / 기한 초과(overdue) / 다음 마감(nextDueAt을
     `지금 / N초 후 / N분 후 / N시간 후`의 상대 시간으로, null이면 `—`). 읽기 전용·비제어임을 명시하는
     보조 문구를 둔다.
  3. **최근·진행 작업** — 진행 중(대기/진행) 잡을 먼저(마감 임박 `dueAt` 오름차순), 그다음 최근 갱신
     (`updatedAt` 내림차순) 순으로 정렬해 상위 8건만. 각 줄은 작업 종류(영상 생성·이미지·내보내기) /
     진행 단계(stage 한국어 라벨) · 진행률(%) · (진행 중일 때) 예상 시간과, 상태 배지 + 마감/갱신 상대
     시각 · (해당 시) `취소 가능` 표시를 보여준다.
- 톤 규칙: 실패·기한 초과는 0보다 클 때 빨강(`warn`) 톤. 상태 배지는 기존 `jobBadgeTone`을 재사용해
  완료=초록 / 실패=빨강 / 취소됨=중립 / 대기·진행=활성(시안)으로 방향을 색으로만 읽게 한다(취소됨을
  실패와 구분).

## 위치 선택 이유

- 과제 권고대로 **대시보드의 기존 운영 지표 패널 근처**에 두었다. 운영 지표 패널(R19)은 잡을
  종류별 상태 **집계 수치**로 보여주는 반면, R21은 같은 잡을 **큐 관점**(마감/기한 초과/취소 가능과
  실제 진행 중 작업의 단계·진행률)으로 한 발 더 들어가 보여줘 두 surface가 역할을 나눠 갖는다(집계는
  지표, 큐 운영 점검은 스냅샷).
- 큐 스냅샷은 전역(모든 프로젝트) 데이터이고 대시보드는 프로젝트가 하나라도 있으면 진입하는 운영
  허브이므로, `queue`가 있을 때만 지표 패널 바로 아래에 렌더한다.

## 데이터 흐름 / 새로고침

- `src/features/studio/api.ts`에 UI 전용 클라이언트 메서드 `getJobQueueSnapshot()` 추가
  (`GET /api/system/queue` → `JobQueueSnapshot`).
- `StudioApp`의 `loadQueue()`가 조회 후 상태에 저장. 실패해도 패널만 숨기고 본 작업 흐름은 막지 않는다
  (읽기 전용 부가 정보, 지표·인벤토리와 동일 정책).
- 갱신 시점(지표 `loadMetrics`·인벤토리 `loadInventory`와 같은 자리에 나란히 호출):
  - **마운트 시 1회**.
  - **액션 직후 즉시** — 잡을 바꾸는 모든 경로가 `run()`(이미지/컷 생성·렌더 시작·후보 선택·업그레이드
    등) 또는 `cancelJob()` / `cancelActiveJobs()`(작업 취소)를 거치므로, 이 세 곳에서 `refresh()` 직후
    `loadQueue()`를 호출한다.
  - **백그라운드 라이브 갱신** — 기존 1.2초 `tick`/`refresh` 루프에서 잡이 진행되며 단계·진행률·마감이
    바뀌므로, **약 5틱(~6초)마다 한 번** 갱신한다(지표·인벤토리와 같은 `tickCount` 카운터 공유).

## 프라이버시 / 리댁션 제약 (노출하지 않는 것)

- 계약(`QueueJobSnapshot`)에는 백엔드/admin용으로 `id`(잡 id), `projectId`가 들어 있으나 **화면에는
  어느 것도 렌더하지 않는다.**
- 노출하는 필드는 사용자/운영자 안전한 것만: 작업 종류(`kind` → 한국어 라벨), 상태(`status`), 진행
  단계(`stage` → 한국어 라벨, 워크플로 단계일 뿐 식별자가 아님), 진행률(`progress`), 예상 시간
  (`etaSec`), 마감/갱신 시각(`dueAt`/`updatedAt`, 상대 시간), 취소 가능 여부(`cancelable`)와 요약 집계.
- 프로바이더/모델 이름, 원시 프롬프트, request id, 테이크/자산 id, 스토리지 키, url, 환경값 — 계약에
  애초에 없고 화면에도 전부 미노출.
- React `key`에도 원시 id를 쓰지 않고 `kind`+`updatedAt`+인덱스 합성키를 사용한다(키는 DOM에 렌더되지
  않지만 보수적으로 원시 id를 코드에서도 피한다).
- 큐 상태는 점검용 안내일 뿐이며 **일시정지/재개/재시도/삭제 동작·버튼은 없다.** 보조 문구로 읽기
  전용·비제어임을 명시한다.

## 만진 파일

- `ai-video-studio/studio-app/src/features/studio/api.ts` — `getJobQueueSnapshot()` 추가,
  `JobQueueSnapshot` 타입 import.
- `ai-video-studio/studio-app/src/features/studio/StudioApp.tsx` — `JobQueueSnapshotPanel` 컴포넌트와
  헬퍼(`queueKindLabels`, `queueStageLabels`/`queueStageLabel`, `formatDueIn`), `queue` 상태·
  `loadQueue()`·갱신 훅(마운트/액션/취소/틱), 대시보드 지표 패널 아래 렌더 및 `queue` prop 전달.
- `ai-video-studio/studio-app/app/globals.css` — 큐 목록 행 스타일. 인벤토리 목록과 동일한 행 레이아웃을
  쓰므로 기존 `.artifact-*` 규칙에 `.queue-list`/`.queue-row`/`.queue-main`/`.queue-title`/`.queue-sub`/
  `.queue-side`/`.queue-meta` 선택자를 함께 묶어 한 곳에서 관리한다(요약 블록은 `.metrics` 구조를 클래스
  추가 없이 그대로 재사용).
- `ai-video-studio/design/29-claude-r21-job-queue-snapshot-ux.md` — 본 리포트.

백엔드/서비스/계약 파일(`src/server/*`, `app/api/*`, `scripts/*`, `codex/schemas/*`, `codex/api/*`)과
`src/domain/types.ts`, `mock-service`, 패키지/깃 메타데이터는 건드리지 않았다(엔드포인트·
`JobQueueSnapshot` 타입은 Codex가 이미 정의).

## 레이아웃 노트 (가로 넘침 방지)

- 요약 블록은 운영 지표 패널과 동일한 `.metric-row { grid-template-columns: repeat(auto-fit,
  minmax(92px, 1fr)); }`를 재사용 — 좁은 폭에서 스탯 칸이 자동 줄바꿈된다. `.metric { min-width: 0 }`,
  `.metric-label { overflow-wrap: anywhere }`로 긴 라벨이 칸을 밀지 않는다.
- 최근·진행 목록 `.queue-row`는 `flex-wrap: wrap`이라 좁은 폭에서 우측 메타(`.queue-side`)가 제목 아래로
  내려간다. `.queue-main { min-width: 0; flex: 1 1 200px }`, `.queue-title`/`.queue-sub`/`.queue-meta`에
  `overflow-wrap: anywhere`로 긴 라벨·메타가 가로로 넘치지 않는다.
- 목록은 중첩 카드/배경 박스 없이 인벤토리(`.artifact-row`)·`.ledger`와 동일하게 **상단 구분선
  (border-top)으로만** 행을 나눈다.
- 패널은 `.panel`(`min-width: 0`)을 재사용해 그리드/뷰 안에서 넘치지 않는다. 980px 이하에서도 전체
  폭 단일 패널이라 영향 없음. 중첩 카드·랜딩·히어로·마케팅 섹션 없음.

## 수행한 검증

`studio-app` 디렉터리에서 실행, 모두 통과:

| 명령 | 결과 |
| --- | --- |
| `npm run typecheck` | 통과 (tsc --noEmit, 에러 없음) |
| `npm run test:mock` | 통과 — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | 통과 — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 19 }` |
| `npm run build` | 통과 — `/api/system/queue` 포함 전체 라우트 빌드 |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

레이아웃은 위 "레이아웃 노트"의 `auto-fit minmax`·`flex-wrap`·`overflow-wrap` 가드로 390px 모바일 /
1366px 데스크톱 가로 넘침을 막도록 설계했다(인벤토리 패널 R20에서 동일 가드가 실측 검증된 패턴 재사용).

## Codex 후속 브라우저 검증

Codex가 headless Edge/CDP로 `http://127.0.0.1:3020`에서 실측 검증했다.

| 뷰포트 | 결과 |
| --- | --- |
| 390x900 | `.queue-snapshot` 렌더 확인, `scrollWidth=390`, `clientWidth=390`, `overflowX=false`, 패널 폭 362px |
| 1366x900 | `.queue-snapshot` 렌더 확인, `scrollWidth=1351`, `clientWidth=1351`, `overflowX=false`, 패널 폭 1051px |

DOM 텍스트 검사에서 `gen_`, `ijob_`, `rnd_`, `prj_`, `tak_`, `img_`, `projects/prj_`, `http://`,
`https://`, `requestId`, `storageKey`, `sourceJobId`, `projectId`, `jobId` 노출 없음.
