# 18 · Claude R10 — Render preview · 소스 변경(stale source) UX

Codex R11이 추가한 서버 소유 freshness 토큰([codex/13](../codex/13-render-source-hash-contract-report.md))을 ExportView에 처음 소비한 라운드. R9([17](17-claude-r9-render-preview-ux.md)) §4가 P2로 이월한 **"점검 후 컷·편집·권리 등 *내용* 이 바뀌어도 stale로 안 잡힌다"** 를 해결한다. base = `e0ff72f`(master) 위, Codex 계약 반영 상태.

소비한 계약 필드(읽기 전용):

- `ProjectBundle.renderSourceHash` — 현재 프로젝트의 렌더 영향 상태 해시(서버 산출, 읽기 타임스탬프 제외)
- `RenderPreview.sourceHash` — preview 계산 시점의 동일 해시
- (참고) `RenderPlan.sourceHash` — 잡 스냅샷 freshness. 이번 UI에선 비교에 직접 사용하지 않음

> **영역 분리:** 프론트 UI만 좁게. 편집 = `studio-app/src/features/studio/StudioApp.tsx`, 본 문서뿐. CSS도 신규 추가 없이 기존 토큰(`.is-stale`·`.stale-flag`·`.preflight-flag`) 재사용 → **globals.css 무수정**. `types.ts`·`mock-service.ts`·OpenAPI/schema·scripts·codex 리포트(Codex 소유) 미수정. `claude/previews/ai-invest-board/`(무관 작업 트리) 미접촉.

> **검증 방식:** 소스 정독 + 4종 게이트 + `npm audit` + 헤드리스 레이아웃 실측(Edge `--headless=new` + CDP, Node 글로벌 `WebSocket`). 실제 프로덕션 빌드를 `next start`로 띄워 프로젝트 생성 → 내보내기 진입 → preview 자동 산출 → 실제 select 조작으로 spec-stale 유발 → source-stale 플래그(동일 마크업) 렌더, 각 단계에서 `documentElement.scrollWidth ≤ innerWidth` & `.export-grid` 하위 모든 노드 `scrollWidth−clientWidth ≤ 0` 확인. 임시 probe는 커밋 전 제거.

---

## 1. 검증 게이트 (전 PASS)

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | **green**(0건) |
| `npm run test:mock` | **OK** `{ shots:10, failed:2, takes:33, imageAssets:5, renderJobs:3 }` |
| `npm run validate:contracts` | **OK** `{ providers:4, routingRules:7, templates:6, visualMakerOps:10 }` |
| `npm run build` | **성공** — 전 라우트(`/api/projects/[projectId]` · `/render-preview` 포함) |
| `npm audit --omit=dev` | **found 0 vulnerabilities** |

레이아웃 실측(헤드리스 CDP, 실제 생성 흐름 통과 후):

| 뷰 | innerWidth | documentElement.scrollWidth | `.export-grid` 하위 최대 노드 오버플로 | 가로 오버플로 | 표시 플래그 |
|---|---|---|---|---|---|
| 모바일 390px · 기본 | 390 | 390 | 0 | **0** | — |
| 모바일 390px · **spec-stale**(실제 select 조작) | 390 | 390 | 0 | **0** | 설정이 바뀌었습니다 |
| 모바일 390px · **+source-stale** | 390 | 390 | 0 | **0** | 프로젝트가 바뀌었습니다 · 설정이 바뀌었습니다 |
| 데스크탑 1366px · 기본 | 1366 | 1351 | 0 | **0** | — |
| 데스크탑 1366px · **spec-stale** | 1366 | 1351 | 0 | **0** | 설정이 바뀌었습니다 |
| 데스크탑 1366px · **+source-stale** | 1366 | 1351 | 0 | **0** | 프로젝트가 바뀌었습니다 · 설정이 바뀌었습니다 |

- spec-stale은 내보내기 화면의 해상도 `<select>` 값을 실제 `change` 이벤트로 바꿔 React 상태 경유로 유발 → `.render-preview.is-stale` 전환 + "설정이 바뀌었습니다" 플래그 확인.
- source-stale은 동일 `.preflight-flag.stale-flag` 마크업(`<strong>` + 줄바꿈 `<p>`)을 라이브 preview 컨테이너에 주입해 줄바꿈/오버플로 최악 케이스를 실측(결정적 실유발은 §3 참고). 두 플래그 공존 시에도 가로 오버플로 0.

---

## 2. 변경 로그

| ID | 목표 | 파일 | 변경 |
|---|---|---|---|
| **R10-1** | 1 (소스 freshness 비교) | StudioApp.tsx | ExportView에서 `staleSpec`(기존 spec 비교)과 `staleSource`(`preview.sourceHash !== bundle.renderSourceHash`)를 분리 산출. `previewStale = staleSpec || staleSource`로 합쳐 기존 `.is-stale` 보더·렌더 버튼 비용 폴백(`48⚡`)을 그대로 재사용 |
| **R10-2** | 2 (소스 변경 안내 카피) | StudioApp.tsx | `RenderPreviewBlock`에 `staleSpec`·`staleSource` prop 추가. source-stale이면 **"프로젝트가 바뀌었습니다 · 미리 점검한 뒤 컷·편집·권리 등 프로젝트 내용이 바뀌었습니다. '다시 점검'을 눌러 지금 상태로 다시 확인하세요."** 플래그 노출. **원시 해시는 UI 텍스트에 일절 노출하지 않음**(freshness 신호로만 사용) |
| **R10-3** | 3 (R9 동작 보존) | StudioApp.tsx | 첫 진입 자동 점검(`useEffect` on `projectId`)·수동 "다시 점검"·spec-stale 플래그·빠지는 컷/권리 경고(`PreflightFlags`)·provider/model 비노출 전부 유지. spec-stale 플래그 카피·동작 무변경 |
| **R10-4** | 4 (비차단 유지) | StudioApp.tsx | stale은 freshness **경고**일 뿐 하드 게이트 아님. 렌더 버튼은 기존대로 `activeRender`(진행 중 잡)일 때만 비활성. source/spec stale은 버튼을 막지 않음 |

> **계약 무파괴:** 읽기 전용으로 `renderSourceHash`/`sourceHash`만 비교. `previewRender`·서버·스크립트 미변경. `types.ts` 미수정 → 커밋은 코드 1파일 + 본 문서.

---

## 3. 설계 판단 (의도적 결정)

- **stale 사유 2종을 분리 표기**: spec-stale("설정이 바뀌었습니다")과 source-stale("프로젝트가 바뀌었습니다")은 원인·해결 맥락이 달라 별 플래그로 노출한다. 둘 다 stale이면 두 플래그가 함께 뜨고, "다시 점검" 한 번으로 모두 해소된다. 동시 노출 시 source를 위에 둬 더 큰 변화(내용 드리프트)를 먼저 알린다.
- **해시 비노출**: `sourceHash`/`renderSourceHash`는 `sha256:…` 기술 토큰이라 사용자에게 의미가 없다. "프로젝트가 바뀌었다"는 사실만 자연어로 전하고 값은 코드 비교에만 쓴다(Codex 핸드오프 의도와 정합).
- **비차단(R8/R9 계승)**: 내용이 바뀌어도 부분 내보내기는 여전히 가능하므로 freshness는 안내로만 처리. `startRender`가 미선택 컷에 best done take를 자동 채우는 동작과 정합.
- **CSS 무신설**: source-stale도 spec-stale과 동일한 `.stale-flag`/`.is-stale` 토큰을 재사용해 시각 일관성을 유지하고 표면적을 코드 1파일로 좁혔다.

---

## 4. 미수정 노트 (P2 — 이월)

- **결정적 source-stale 실유발(P2)**: 내보내기 화면은 view 전환 시 언마운트→재마운트되며 진입마다 preview를 새로 산출하므로, "편집 후 복귀" 경로로는 source-stale이 거의 안 잡힌다. 실사용 시나리오는 **화면에 머무는 동안** 1.2초 tick로 in-flight 잡이 effective take/상태를 바꿔 `renderSourceHash`가 갱신되는 경우다. probe에서 이 타이밍을 결정적으로 재현하긴 어려워 레이아웃은 동일 마크업 주입으로 실측했다(동작 로직은 §2 R10-1 비교식으로 단순·명확). 결정적 e2e는 잡 틱 주입 훅이 생기면 후속 후보.
- **딥링크 이월(R8/R9 계속)**: 빠지는 컷 → 비교 화면 점프, 권리 items → Asset Library 점프, real `<video>` 재생기 3종.

## 5. 커밋·핸드오프
- **Claude 커밋 = 2파일**: `studio-app/src/features/studio/StudioApp.tsx`, `design/18-…md`. 코드 파일엔 R10 변경만 존재(Codex 미접촉) → 커밋 정합.
- 임시 헤드리스 probe(`scripts/r10-layout-probe.mjs`·`scripts/r10-debug.mjs`)·Edge 프로파일은 커밋 전 제거 완료.

## 6. 통과 요약
소스 freshness 비교(해시 비노출) ✓ · 소스/설정 stale 분리 안내 + 재점검 유도 ✓ · R9 자동/수동 점검·경고·provider 비노출 보존 ✓ · 비차단 유지 ✓ · 390/1366 + spec/source stale 가로 오버플로 0 ✓ · 4종 게이트 + audit 0 PASS.
