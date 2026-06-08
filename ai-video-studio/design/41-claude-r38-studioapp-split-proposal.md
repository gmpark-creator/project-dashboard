# 41 · Claude R38 — StudioApp.tsx 분리 리팩터 제안 (책임을 무너뜨리지 않는 순서)

> 2026-06-08 · Claude(Opus 4.8, 1M) · 영역: 프론트엔드 아키텍처(Claude 트랙) · 외부 리뷰 요청 #6 답변
> 성격: **제안서(실행 전)**. 1660줄 단위 추출을 무인 string-편집으로 강행하면 회귀 위험이 커서, 안전한 순서·경계·게이트를 먼저 확정한다. 실행은 박사 인지 하에(또는 단계별 PR로) 진행 권장.

## 현황

`studio-app/src/features/studio/StudioApp.tsx` ≈ **3700줄** 단일 파일. 한 파일에 (a) 순수 포매터/라벨, (b) 운영 콘솔(operator), (c) 크리에이터 플로우(end-user) 뷰, (d) 최상위 앱 상태/오케스트레이션이 모두 들어있다. 컴포넌트 약 35개.

## 책임별 그룹 (실측 라인 기준)

| 그룹 | 라인 | 내용 |
|---|---|---|
| **포매터/라벨**(순수) | 23–287 군데 | statusLabel·jobBadgeTone·tierLabel·scoreBadgeClass·imageJobStageLabel·shotStatusLabel·qualityLabel·aspectRatioCss·formatSeconds·renderStageLabel·progress·formatLedgerTime·readinessTime·formatAvgLatency·formatBytes·queueStageLabel·formatDueIn·expiresInLabel·withCurrent·referenceModeForRole + describeFailure·nextViewForBundle |
| **운영 콘솔**(operator) | 288–1949 (~1660줄) | RuntimeReadinessBadge·Metric·MetricJobRow·SystemMetricsPanel·ArtifactRow·MediaArtifactInventoryPanel·JobQueueSnapshotPanel·Worker{Dispatch,Lease,Completion,RetryPlan,RetryExecution}Panel·ProviderHealthPanel·ReadinessConsolePanel·StorageCleanup{Plan,Execution}Panel·OpsSummaryStrip·**OperationsConsole** |
| **크리에이터 뷰**(end-user) | 1983–3702 | Dashboard·ImageMaker·AssetLibrary·AssetGrid·NewProject·Storyboard·ShotEditor·Compare·DirectionPanel·TakeCard·EditPreview·Edit·ExportView·CreditLedger·RenderVersions·RenderPreflight·RenderPreviewBlock·PreflightFlags·NoProject |
| **앱 셸/오케스트레이션** | 메인 컴포넌트 | useState·run()·refresh·loadOps·view 스위치·nav·toast·failureNotice·pending |

## 추천 분리 순서 (안전한 것부터, 각 단계 독립 게이트)

리뷰가 요청한 "책임을 무너뜨리지 않는 실제적 순서". 의존성 역방향(잎→줄기)으로, 매 단계 `npm run verify` GREEN을 게이트로.

1. **`studio/format.ts`** — 순수 포매터/라벨/상수(creditActionLabels·creditKindMeta·readinessCheckLabels 등)를 먼저 추출. JSX·React 의존 없음 → 가장 안전. StudioApp과 이후 분리될 모듈이 공통으로 import. **선행 1순위**(다른 모든 추출의 토대).
2. **`studio/CancelJobButton.tsx`** + 작은 잎 컴포넌트(Metric·MetricJobRow·ArtifactRow). props-in/JSX-out 순수 표현. format.ts만 의존.
3. **`studio/ops/` (운영 콘솔 전체)** — 최대 단일 이득(~1660줄). 각 *Panel + OpsSummaryStrip + OperationsConsole을 `studio/ops/OperationsConsole.tsx`(필요시 패널별 파일)로 이동. 입력은 스냅샷 props뿐이라 창작 흐름과 결합 낮음. 운영 콘솔은 R23~R29에서 이미 자기완결적이라 경계가 깨끗하다.
4. **크리에이터 뷰를 화면별 파일로** — `studio/views/` 아래 Dashboard / ImageMaker(+AssetLibrary,AssetGrid) / NewProject / Storyboard(+ShotEditor) / Compare(+TakeCard,DirectionPanel) / Edit(+EditPreview) / Export(+RenderVersions,RenderPreflight,RenderPreviewBlock,PreflightFlags) / CreditLedger / NoProject. 한 번에 하나씩, 콜백 props 시그니처는 그대로 유지.
5. **`StudioApp.tsx`는 셸만 남긴다** — 상태·run()·refresh/loadOps·view 스위치·nav. 목표 300~500줄.

## 경계 원칙 (책임 안 무너뜨리기)

- **run()/상태는 셸에 유지.** 뷰는 콜백 props로 행동을 위임받는다(현재 구조 그대로). 뷰가 직접 studioApi를 호출하지 않게 한다(현재도 대부분 그렇다).
- **누출 안전 불변식 유지.** 분리해도 패널은 집계/안전 라벨만 그린다(raw id/provider·model/token/url/storageKey 금지). 이동은 렌더 출력 무변경이어야 한다.
- **cost-policy 단일 출처 유지.** 비용 표시는 `@/domain/cost-policy`만 참조(R34 반영분).
- **순수 함수 우선 이동** → 컴포넌트는 그 다음. 순환 import 금지(format.ts는 어떤 컴포넌트도 import 안 함).

## 단계별 수용 게이트

매 단계: `npm run typecheck` · `npm run validate:contracts` · `npm run test:mock` · `npm run build` GREEN + 브라우저 스모크(해당 뷰 렌더·오버플로 0·**금지 문자열 누출 0**). 렌더 출력/동작은 **무변경**(behavior-preserving) 이어야 하며, diff는 "이동+import"만 포함(로직 변경 동반 금지).

## 권고

1순위 = `format.ts`(저위험·토대), 2순위 = **운영 콘솔 추출**(최대 줄수 이득·경계 깨끗). 이 둘만 해도 StudioApp.tsx가 ~1900줄로 줄어 가독·리뷰성이 크게 개선된다. 무인 세션에서는 string-편집의 대용량 이동 위험 때문에 보류했고, 박사 신호 시 단계별로 실행하겠다.
