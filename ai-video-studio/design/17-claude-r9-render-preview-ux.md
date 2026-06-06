# 17 · Claude R9 — Render preview · 사전 점검(preflight) UX

Codex R10이 추가한 read-only `RenderPreview` 계약([codex/12](../codex/12-render-preview-contract-report.md))을 ExportView에 처음 노출한 라운드. R8([16](16-claude-r8-render-rights-ux.md))이 P2로 이월한 "첫 렌더 *전*에는 권리/누락 경고가 안 보인다"를 해결한다. base = `d9c34c4`(master) 위, Codex 계약 반영 상태.

- `RenderPreview`(`estimate{credits,etaSec}` · `rightsReview` · `renderPlan` · `spec`) — 렌더 잡 생성 없이 현재 상태 기준 사전 점검
- `studioApi.previewRender(projectId, spec)` → `POST /api/projects/[projectId]/render-preview`
- `GenerationJob.routing`(provider 라우팅, [codex/10](../codex/10-provider-routing-contract-report.md)) — **UI 비노출 계약 유지**(provider/model 언어 노출 0)

> **영역 분리:** 프론트 UI/카피/CSS만 좁게. 편집 = `studio-app/src/features/studio/StudioApp.tsx`, `studio-app/app/globals.css`, 본 문서뿐. **`types.ts`·`mock-service.ts`·`provider-routing.ts`·OpenAPI/schema·scripts·codex 리포트(Codex 소유) 미수정.** `claude/previews/ai-invest-board/`(무관 작업 트리) 미접촉.

> **검증 방식:** 소스 정독 + 4종 게이트 + `npm audit` + 헤드리스 레이아웃 실측(Edge `--headless=new` + CDP, 실제 앱을 띄워 프로젝트 생성 → 내보내기 화면 진입 → preview 자동 산출 → 설정 변경으로 stale 강제, 각 단계에서 `documentElement.scrollWidth ≤ innerWidth` & `.export-grid` 하위 모든 노드 `scrollWidth-clientWidth ≤ 0` 확인). 임시 probe는 커밋 전 제거.

---

## 1. 검증 게이트 (전 PASS)

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | **green**(0건) |
| `npm run test:mock` | **OK** `{ shots:10, failed:2, takes:33, imageAssets:5, renderJobs:3 }` |
| `npm run validate:contracts` | **OK** `{ providers:4, routingRules:7, templates:6, visualMakerOps:9 }` |
| `npm run build` | **성공** — 전 라우트(`/api/projects/[projectId]/render-preview` 포함) |
| `npm audit --omit=dev` | **found 0 vulnerabilities** |

레이아웃 실측(헤드리스 CDP, 긴 프로젝트 제목 = 헤드 줄바꿈 최악 케이스):

| 뷰 | innerWidth | documentElement.scrollWidth | `.export-grid` 하위 최대 오버플로 | 가로 오버플로 |
|---|---|---|---|---|
| 모바일 390px | 390 | 375 | 0 | **0** |
| 데스크탑 1366px | 1366 | 1351 | 0 | **0** |
| 모바일 390px · **stale 상태** | 390 | 375 | 0 | **0** |

- preview 자동 산출 확인: 내보내기 진입 시 `예상 비용 · 시간 48⚡ · 약 90초` 노출(`estimate.credits=48`, `estimate.etaSec=90` — `estimateCost("startRender")`와 일치, 잡 3개 예약분 `3×16=48`과도 정합).
- stale 확인: 진입 후 해상도·자막을 바꾸면 `.render-preview.is-stale`로 전환되고 "설정이 바뀌었습니다" 플래그 + "다시 점검" 버튼 노출.

---

## 2. 변경 로그

| ID | 목표 | 파일 | 변경 |
|---|---|---|---|
| **R9-1** | 1 (사전 점검 노출) | StudioApp.tsx | ExportView에 `studioApi.previewRender` 호출 추가. 진입 시(또는 projectId 변경 시) `useEffect`로 1회 자동 산출. `RenderPreviewBlock`이 **예상 비용/시간**(`estimate`) + **예상 결과**(연결 컷 수·전체 길이) + **위험 경고**(빠지는 컷·권리) + **추천 한 줄**(부분 내보내기 가능 vs. 지금 내보내도 좋음)을 노출 |
| **R9-2** | 2 (잡 점검과 구분) | StudioApp.tsx | preview = "예상" 배지 + "렌더 시작 전 미리 점검" 제목으로 **내보내기 형식 패널(좌)** 에 배치. 기존 잡 스냅샷 점검(`RenderPreflight`)은 **렌더 잡 패널(우)** 에 그대로 유지. 두 점검의 공통 플래그(빠지는 컷/권리)는 `PreflightFlags`로 추출해 표현 일원화하되, 컨테이너·헤더·카피로 *예상(미확정)* 과 *잡(확정)* 을 시각 분리 |
| **R9-3** | 3 (stale 처리) | StudioApp.tsx | 마지막 점검한 `preview.spec`(해상도·자막·비율)과 현재 선택을 비교해 `previewStale` 산출. stale이면 `.is-stale` 컨테이너 + 경고 플래그로 "직전 설정 기준" 명시하고 "다시 점검" 유도. 렌더 버튼 비용 배지도 stale이면 정적 `48⚡`로 폴백(낡은 수치 단정 회피) |
| **R9-4** | 4 (provider/model 비노출) | — | `RenderPreview`에는 routing 데이터가 없고, 노출 항목은 비용·시간·컷·권리뿐. provider/model 언어 **노출 0** 유지 |
| **R9-5** | 5 (반응형) | globals.css | `.render-preview`(예상 컨테이너, cyan 톤)/`.is-stale`(gold 톤)/`.render-preview-head`(flex-wrap, 배지+제목+우측 정렬 "다시 점검")/`.preview-badge`/`.render-preview-title`(`min-width:0`·`word-break`)/`.preview-refresh`(`margin-left:auto`)/`.render-preview-empty`/`.render-preview-tip`/`.stale-flag`. 기존 `.preflight`·`.preflight-row`·`.warn/ok-flag` 토큰 재사용 |

> **계약 무파괴:** 읽기 전용으로 `RenderPreview`만 소비(`previewRender`는 render job·project status 미변경). `roleLabels` 재사용으로 권리 `items[].role` 표시. `types.ts`/서버/스크립트 미수정 → 커밋은 3파일.

---

## 3. 설계 판단 (의도적 결정)

- **preview의 spec = `cut:"full"` 고정**: `startRender`는 6s/15s/30s 3개 잡을 만들지만 `buildRenderPlan`의 컷 선택·권리·전체 길이는 길이별로 갈리지 않는다(같은 소스 타임라인). 그래서 preview는 "전체 타임라인 1회 점검"으로 잡고 cut을 `full`로 고정, 사용자가 만지는 **해상도·자막·비율만** spec에 반영했다. R8이 지적한 "6s 잡인데 전체 23초" 혼동을 preview에도 반복하지 않기 위함.
- **차단하지 않고 안내(R8 계승)**: missing 컷/권리 경고가 있어도 렌더 버튼은 활성. 추천 카피로 "지금도 부분 내보내기 가능, 다만 보완하면 더 좋음"을 안내(하드 게이트 미도입). `startRender`가 미선택 컷에 best done take를 자동 채우는 동작과 정합.
- **자동 1회 + 수동 재점검**: 진입 시 자동 산출로 "버튼을 눌러야만 보이는" 마찰을 없애고, 설정 변경 후에는 stale 배지 + "다시 점검"으로 사용자가 갱신을 통제한다. `projectId`에만 반응하는 `useEffect`라 1.2초 새로고침 루프의 bundle 갱신에도 재호출되지 않는다.
- **stale 판정 기준 = spec 일치**: 현재 mock은 비용/플랜이 spec과 무관하게 동일하지만, 사용자에게 보이는 `preview.spec`이 현재 선택과 다르면 "이 예상은 지금 설정 기준이 아님"이 사실이므로 정직하게 stale로 표기한다. (프로젝트 상태 변경에 따른 *내용* 드리프트는 §4 참고.)

---

## 4. 미수정 노트 (P2 — 이월)

- **내용 드리프트(P2)**: stale은 spec 변경만 감지한다. 점검 후 비교 화면에서 컷을 선택/생성하면 plan·rights 내용이 바뀌지만 자동 stale 표기는 안 된다(언제든 "다시 점검"으로 갱신 가능). 서버 산출물에 버전/해시가 없어 정확 감지는 계약 확장이 필요 → 다음 Codex 라운드 후보.
- **딥링크 이월(R8에서 계속)**: 빠지는 컷 → 비교 화면 점프, 권리 items → Asset Library 점프, R4 재생기 3종(real `<video>`·다듬기 토글·렌더 미리보기).

## 5. 커밋·핸드오프
- **Claude 커밋 = 3파일만**: `studio-app/app/globals.css`, `studio-app/src/features/studio/StudioApp.tsx`, `design/17-…md`. 두 코드 파일엔 R9 변경만 존재(Codex 미접촉) → 커밋 정합.
- 임시 헤드리스 probe(`scripts/r9-layout-probe.mjs`)·Edge 프로파일은 커밋 전 제거 완료.

## 6. 통과 요약
사전 점검 비용·시간·결과·경고·추천 노출 ✓ · 잡 점검(확정) vs preview(예상) 시각 분리 ✓ · 설정 변경 stale 명시 + 재점검 유도 ✓ · provider/model 노출 0 ✓ · 390/1366 + stale 가로 오버플로 0 ✓ · 4종 게이트 + audit 0 PASS.
