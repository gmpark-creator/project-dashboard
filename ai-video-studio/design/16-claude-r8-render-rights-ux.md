# 16 · Claude R8 — Render rights · EDL 내보내기 UX

Codex R7/R8/R9가 백엔드 계약으로 고정한 세 스냅샷을 ExportView 사용자 화면에 처음으로 노출한 라운드. base = `90b816d`(master) 위, Codex 계약 반영 상태.

- `RenderJob.rightsReview`(자산 생명주기/렌더 권리, [09](../codex/09-asset-lifecycle-render-rights-report.md))
- `RenderJob.renderPlan`(렌더 plan EDL, [11](../codex/11-render-plan-edl-contract-report.md))
- `GenerationJob.routing`(provider 라우팅, [10](../codex/10-provider-routing-contract-report.md)) — **UI 비노출 계약 유지**(사용자에게 provider/model 언어 노출 0)

> **영역 분리:** 프론트 UI/카피/CSS만 좁게. 편집 = `studio-app/src/features/studio/StudioApp.tsx`, `studio-app/app/globals.css`, 본 문서뿐. **`types.ts`·`mock-service.ts`·`provider-routing.ts`·OpenAPI/schema·scripts·codex 리포트(Codex 소유) 미수정.** `claude/previews/ai-invest-board/`(무관 작업 트리) 미접촉.

> **검증 방식:** 소스 정독 + mock-service 실측(실제 플로우로 `RenderPreflight` 산출물 확인, 대기/해제 양쪽) + 헤드리스 레이아웃 실측(Edge new headless, export-grid 2-col @넓은 뷰 / 단일 컬럼 스택 @좁은 뷰, `documentElement.scrollWidth === innerWidth`로 가로 오버플로 0 확인) + 4종 게이트 + `npm audit`.

---

## 1. 검증 게이트 (전 PASS)

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | **green**(0건) |
| `npm run test:mock` | **OK** `{ shots:10, failed:2, takes:33, imageAssets:5, renderJobs:3 }` |
| `npm run validate:contracts` | **OK** `{ providers:4, routingRules:7, templates:6, visualMakerOps:8 }` |
| `npm run build` | **성공** — 전 라우트 |
| `npm audit --omit=dev` | **found 0 vulnerabilities** |

데이터 실측(mock 플로우 2종):
- **대기 상태**(미확인 외부 참조 + 실패 컷 존재): `렌더 구성 8컷 연결 · 전체 약 23초` · `[warn] 빠지는 컷 2개: 디테일 인서트, 최종 제안` · `[warn] 권리 확인 필요 1건: style · 무드 스타일 참조 (1개 컷)` + note 노출.
- **해제 상태**(권리 확인 완료): 권리 블록이 `[ok] 권리 확인 완료 · 별도 점검 외부 이미지 없음`으로 전환.
- 계약 정합: `renderPlan.shots.length(8) + missingShotIds.length(2) = storyboard shots(10)`, `totalDurationSec > 0`, `rightsReview.required`가 items 유무와 일치.

레이아웃 실측: export-grid 2-col(넓은 뷰)·단일 컬럼 스택(좁은 뷰) 모두 가로 오버플로 0. preflight-row 우측 정렬 요약·warn/ok flag 텍스트 줄바꿈·불릿 리스트 들여쓰기 정상.

---

## 2. 변경 로그

| ID | 목표 | 파일 | 변경 |
|---|---|---|---|
| **R8-1** | 1 (rights review) | StudioApp.tsx | `RenderPreflight`가 `RenderJob.rightsReview.required`로 분기. `required=true`면 `items[]`를 `역할 · 라벨 · N개 컷에 사용` + `note`로 나열(warn flag), `false`면 "권리 확인 완료" ok flag. **해제/대기 2상태 명시** |
| **R8-2** | 2 (missing shots) | StudioApp.tsx | `renderPlan.missingShotIds`를 `shotTitleById` 역참조로 컷 제목 리스트화. "선택된 결과가 없어 이번 내보내기에 빠진다 → 비교 화면에서 선택 시 다음 렌더에 합쳐진다"로 **차단 대신 안내**(codex 11 §Notes의 partial 허용 결정) |
| **R8-3** | 3 (plan totals) | StudioApp.tsx | preflight-row에 `renderPlan.shots.length`(연결 컷 수) + `formatSeconds(totalDurationSec)`(전체 길이) 동반 노출. `formatSeconds`로 60초↑는 `분 초` 포맷 |
| **R8-4** | 1·2·3 배치 | StudioApp.tsx | 스냅샷은 렌더 잡에만 존재(startRender 시점) → 같은 배치 잡이 공유하므로 **가장 최근 잡 1건**(`renderJobs[last]`)을 "렌더 잡" 패널 상단 요약으로 단일 노출(3중 반복 회피). 잡 없으면 미표시 |
| **R8-5** | 4 (반응형) | globals.css | `.preflight`/`.preflight-row`(flex-wrap·우측 요약)/`.preflight-flag`/`.warn-flag`·`.ok-flag`(기존 rose/green 토큰 재사용)/`.preflight-item-head`(inline-flex wrap)/`.preflight-shotcount`. `min-width:0`·`flex-wrap`·`word-break:break-word`로 좁은 뷰 오버플로 차단 |

> **계약 무파괴:** 읽기 전용으로 `RenderJob.rightsReview`·`renderPlan`만 소비. `roleLabels`(기존 8역할 완전 매핑) 재사용으로 `items[].role` 표시. `provider/model` 등 `GenerationJob.routing` 내부 데이터는 **노출 0**. `types.ts`/서버/스크립트 미수정.

---

## 3. 설계 판단 (의도적 결정)

- **요약 단일화 vs 잡별 반복**: `rightsReview`/`renderPlan`은 startRender 스냅샷이라 한 배치의 3개 잡이 동일 스냅샷을 공유한다. `spec.cut`(6s/15s/30s)은 잡별로 다르지만 plan의 컷 선택·권리 점검은 동일하므로, 잡별 반복 대신 **최근 잡 1건 요약**으로 노출해 중복과 "6s 잡인데 전체 23초" 혼동을 피했다.
- **차단하지 않고 안내**: `startRender`가 미선택 컷에 best done take를 자동 채우므로 `missingShotIds`는 *쓸 수 있는 결과 자체가 없는* 컷이다. codex 11 §Notes가 "막을지/partial 허용은 제품 라운드 결정"으로 남겨 둔 지점 → 이번엔 **부분 내보내기 허용 + 명확 고지**를 택했다(하드 게이트 미도입).

## 4. 미수정 노트 (P2 — 이월)

- **사전 점검(pre-flight) 부재(P2)**: `rightsReview`/`renderPlan`이 잡에만 존재해, 첫 렌더 *전*에는 권리/누락 경고가 보이지 않는다. bundle에서 UI가 직접 재계산할 수 있으나 서버 계약 로직 중복·드리프트 우려로 보류. 사전 점검을 원하면 Codex가 `previewRenderPlan(projectId, spec)` 류 read-only 계약을 추가하는 편이 정합적(다음 라운드 제안).
- **이월(다음 라운드)**: 누락 컷에서 비교 화면으로 점프하는 딥링크, 권리 items에서 Asset Library로 점프, R4 재생기 3종(real `<video>`·다듬기 토글·렌더 미리보기).

## 5. 커밋·핸드오프
- **Claude 커밋 = 3파일만**: `studio-app/app/globals.css`, `studio-app/src/features/studio/StudioApp.tsx`, `design/16-…md`. 두 코드 파일엔 R8 변경만 존재(Codex 미접촉) → 커밋 정합.
- 임시 검증 스크립트/probe는 커밋 전 제거 완료.

## 6. 통과 요약
권리 점검 해제/대기 노출 ✓ · 누락 컷 컷제목 고지(차단 대신 안내) ✓ · 연결 컷 수 + 전체 길이 동반 ✓ · provider/model 노출 0 ✓ · 좁은/넓은 뷰 오버플로 0 ✓ · 4종 게이트 + audit 0 PASS.
