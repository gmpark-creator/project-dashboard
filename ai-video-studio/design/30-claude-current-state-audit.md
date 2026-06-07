# 30 · Claude 현황 감사 (Current-State Audit)

> **R22 / 야간 자율 모드 착수 감사** · 2026-06-08 · Claude(Opus 4.8, 1M)
> 목적: Codex가 10시간+ 자율 구현(리포트 211번까지)을 진행한 시점에서, **이미 구현됨 / 문서만 있음 / 미구현 / Codex 차단 / 외부 차단**을 실제 코드 기준으로 정리하고, 남은 **Claude-owned 프론트/UX 작업** 중 가장 가치 높은 것을 고른다.

## 0. 감사 방법

- 실제 repo(`project-dashboard`, HEAD `5bf030d` "ai-video-studio mark live persistence ready") 기준.
- 백엔드 라우트 표면: `studio-app/app/api/**` 50+ 라우트 + `studio-app/src/server/**` 31파일을 병렬 에이전트로 전수 카탈로그화.
- 프론트 표면: `studio-app/src/features/studio/StudioApp.tsx`(121KB), `api.ts`, `app/globals.css` 직접 정독.
- 도메인 계약: `studio-app/src/domain/types.ts`(Codex 소유, 읽기 전용)에서 각 스냅샷 타입의 **안전 필드 vs 금지 필드** 식별.
- 베이스라인: `npm run typecheck` ✅ / `npm run validate:contracts` ✅ (providers 4 · routing 7 · templates 6 · operations 44 · routes 40).

## 1. 최신 라운드 위치

| 영역 | 최신 | 내용 |
|---|---|---|
| Codex 리포트 | **211** (`live-persistence-readiness-report`) | 200~211에서 라이브 영속성 레이어 완성: 큐/워커-디스패치/워커-리스 스냅샷(read), 리스 라이프사이클(create/renew/release/complete), 워커 완료·재시도 실행, R2 오브젝트 스토리지 delete/ingest, PostgreSQL 영속성 readiness. `CUTPILOT_ENABLE_LIVE_READS/WRITES`로 fail-closed 프로덕션 모드. |
| Claude 설계문서 | **29** (`r21-job-queue-snapshot-ux`) | R16~R21: 크레딧 원장 UX, 잡 취소 UX, 런타임 readiness 배지, 운영 지표 패널, 미디어 산출물 인벤토리 패널, 작업 큐 스냅샷 패널. |
| 이 문서 | **30** | 현황 감사 + 다음 슬라이스 선정 |

## 2. 백엔드 엔드포인트 표면 (44개) — 상태 분류

### 2-1. 운영자(operator/system) 표면

| 엔드포인트 | 메서드 | 종류 | 프론트 상태 | 비고 |
|---|---|---|---|---|
| `/api/system/readiness` | GET | read | ✅ **구현됨** | `RuntimeReadinessBadge`(상단 바) |
| `/api/system/metrics` | GET | read | ✅ **구현됨** | `SystemMetricsPanel`(Dashboard) |
| `/api/system/media-artifacts` | GET | read | ✅ **구현됨** | `MediaArtifactInventoryPanel`(Asset Library) |
| `/api/system/queue` | GET | read | ✅ **구현됨** | `JobQueueSnapshotPanel`(Dashboard) |
| `/api/system/provider-health` | GET | read | ⛔ **미구현(Claude 갭)** | 엔진 가용성 스냅샷. provider/model명은 **노출 금지** → 집계만 |
| `/api/system/worker-dispatch` | GET | read | ⛔ **미구현(Claude 갭)** | 디스패치 대기/진행 스냅샷 |
| `/api/system/worker-leases` | GET | read | ⛔ **미구현(Claude 갭)** | 리스 active/released/expired 스냅샷 |
| `/api/system/worker-completions` | GET | read | ⛔ **미구현(Claude 갭)** | 완료 수령증 스냅샷 |
| `/api/system/worker-retries` | GET | read | ⛔ **미구현(Claude 갭)** | 실패 잡 재시도 계획 |
| `/api/system/worker-retries/executions` | GET | read | ⛔ **미구현(Claude 갭)** | 재시도 실행 스냅샷 |
| `/api/system/storage-cleanup` | GET | read | ⛔ **미구현(Claude 갭)** | 정리 계획(삭제 후보) |
| `/api/system/storage-cleanup/executions` | GET | read | ⛔ **미구현(Claude 갭)** | 정리 실행 이력 |
| `/api/jobs/tick` | POST | (mock 진행) | ✅ **구현됨** | 백그라운드 tick 루프 |
| `/api/system/worker-leases` (POST), `.../[leaseId]/complete·release·renew` | POST | write | 🚫 **Codex 차단** | 워커 전용 mutating 동작. token/leaseId 노출·실데이터 변경 → UI 비노출(아래 §5) |
| `/api/system/worker-retries/[jobId]/execute` | POST | write | 🚫 **Codex 차단** | 실패 잡 강제 재시도(실비용/실데이터) |
| `/api/system/storage-cleanup` (POST) | POST | write | 🚫 **Codex 차단** | 산출물 실삭제(파괴적) |

### 2-2. 스튜디오(end-user) 표면 — 전부 ✅ 구현됨

`listProjects/createProject/decomposeIdea/getBundle/updateStoryboard/generateAll/generateShot/createImageJob/registerExternalImage/attachImageToShot/updateShotDirection/selectTake/regenerate/upgradeTake/applyEdit/setAudio/previewRender/startRender/setDefaultRender/getJob/cancelJob` — `studioApi`(api.ts)에 전부 래핑됨.

**문서만 있고 미연결인 스튜디오 read 엔드포인트(낮은 우선순위):**
- `POST /api/cost/estimate` (사전 비용 추정) — 현재 프론트는 사용 안 함. 렌더/생성 버튼 위 비용 표시는 번들 기반으로 처리 중. (후속 후보)
- `DELETE /api/projects/[projectId]/assets/[assetId]`, `DELETE /api/shots/[shotId]/references/[assetId]` — 자산/참조 해제. UI에 해제 버튼 미노출. (후속 후보, write라 보수적)

## 3. 핵심 갭 결론

**가장 가치 높은 Claude-owned 미구현 = 운영자 read-only 스냅샷 8종의 UI 부재.**
백엔드는 워커 파이프라인(디스패치→리스→완료→재시도) + 엔진 헬스 + 스토리지 정리까지 완전 관측 가능하지만, 프론트는 그중 readiness/metrics/queue/media-artifacts 4종만 노출하고, 그것도 Dashboard·Asset Library에 **분산**돼 있다. 운영자가 "지금 워커가 돌고 있나, 리스가 새는가, 재시도 계획이 뭔가, 정리할 스토리지가 있나"를 볼 단일 화면이 없다.

→ **결정: 전용 「운영 콘솔(Operations Console)」 뷰 신설** + 미연결 8종 read-only 스냅샷 패널 추가. 기존 4개 패널 컴포넌트는 콘솔에서 재사용(코드 중복 없음). 기존 Dashboard/Asset Library 패널은 글랜스용으로 보존(비파괴).

## 4. 안전 필드 분석 (도메인 계약 기준)

각 스냅샷은 `summary`(집계) + 항목 배열을 준다. **항목 배열엔 raw id·token·provider명·storageKey·url·workerId·dispatchKey가 섞여 있으므로**, 기존 패널과 동일하게 **집계 + 안전 라벨만** 노출한다.

| 스냅샷 | 노출(안전) | 절대 비노출(금지) |
|---|---|---|
| ProviderHealthSnapshot | summary{total/healthy/degraded/down}, 입력타입·오디오지원 **개수 집계** | `targets[].provider`, `.model`, `.reason` |
| WorkerDispatchSnapshot | summary(종류별·대기/진행/기한초과/다음마감), 항목: kind·status·stage·eta·priority | `dispatchKey`,`jobId`,`projectId`,`invocation` |
| WorkerLeaseSnapshot | summary(active/released/expired), 항목: kind·status·만료까지 상대시간 | `id`,`token`,`dispatchKey`,`jobId`,`projectId`,`workerId` |
| WorkerCompletionSnapshot | summary(성공/실패/취소·산출물수·크레딧), 항목: kind·status·산출물수·확정/환불 | `completionKey`,`jobId`,`projectId`, 원시 `error`,`artifacts[]` |
| WorkerRetryPlan | summary(실패/재시도가능/보류·종류별), 항목: action·retryable·fallback·kind | `receipt`의 id들 |
| WorkerRetryExecutionSnapshot | summary(종류별·교체있음/없음), 항목: action·교체kind·교체누락·시각 | `record`/`receipt`/`replacement`의 id들 |
| StorageCleanupPlan | summary(보관/외부확인/삭제후보·회수가능용량), 항목: role·kind·정리상태·action·참조수 | `artifact` id, `storageKey` |
| StorageCleanupExecutionSnapshot | summary(삭제수·회수용량), 항목: 회수용량·상대시각·사유 | `id`,`artifactId`,`projectId`,`storageKey` |

## 5. 차단/대기 항목 (blocker)

- **워커 mutating 동작(lease create/complete/release/renew, retry execute, cleanup execute)**: UI 비노출 결정. 사유 = (a) token/leaseId 등 secret성 식별자 입력 필요, (b) 실 데이터 변경·파괴적, (c) 프롬프트 금지(파괴적 git/실비용/실삭제). 운영 콘솔은 **읽기 전용 점검**으로 한정. 실제 워커 제어는 Codex 백엔드/운영 런북 영역.
- **provider/model 실명 노출 불가**: provider-health는 이름 대신 집계·상태 분포만. 이는 제품 원칙 P1(모델명 숨김)과도 일치.
- **외부 차단(API key/결제/배포)**: 실 provider 연동, R2/Postgres 실연결은 환경변수·계정 영역 → Claude 작업 아님.

## 6. 다음 슬라이스 (선정)

1. **R23 — 운영 콘솔 신설 + 워커/엔진 파이프라인 패널** (이 감사 직후 착수): 새 `ops` 뷰 + 네비, api.ts에 8종 read-only 래퍼 추가, 패널 = readiness 상세 / 디스패치 / 리스 / 완료 / 재시도 계획 / 재시도 실행 / 엔진 헬스(+기존 metrics·queue 재사용). → design/31.
2. **R24 — 스토리지 운영 패널**: 정리 계획 + 정리 실행 이력 패널을 콘솔에 통합(+미디어 인벤토리 재사용). → design/32.
3. **R25 — 전체 Studio 플로우 모바일(390)/데스크톱(1366) QA + 문구·상태 라벨 마감**. → design/33.
4. (후속) cost/estimate 사전 비용 표시, 자산/참조 해제 UX 등 스튜디오 잔여 read 연결.

**검증 게이트(매 슬라이스):** typecheck → validate:contracts → test:mock → (가능 시) build/audit → 1366×900·390×900 브라우저 QA → 보고서.
