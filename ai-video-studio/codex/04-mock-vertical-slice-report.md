# 04 - Mock Vertical Slice Report

## 완료 범위

Codex R1 구현 착수로 `ai-video-studio/mock-app/`를 추가했다. 이 앱은 GitHub Pages에서 바로 열 수 있는 정적 vertical slice이며, 내부 `CutpilotMockApi`가 OpenAPI 의미 계약을 브라우저 localStorage 위에서 mock 구현한다.

## 구현된 엔드포인트 의미

| 의미 API | mock 구현 |
|---|---|
| `createProject` | 프로젝트 생성 + 4씬/10컷 스토리보드 생성 |
| `decomposeIdea` | 아이디어를 Scene/Shot 구조로 변환 |
| `generateShot` | 컷별 1~3개 Take와 GenerationJob 생성 |
| `generateAll` | 전체 컷 독립 생성 잡 큐잉 |
| `selectTake` | 선택 Take를 Shot 기준 후보로 저장 |
| `regenerate` | 기존 Take 보존 후 새 후보 생성 |
| `upgradeTake` | 게시용 품질 후보 생성 잡 큐잉 |
| `applyEdit` | Magic Box 명령 저장 |
| `setAudio` | 자막/BGM/보이스 상태 저장 |
| `startRender` | 6s/15s/30s RenderJob 병렬 생성 |
| `tickJobs` | queued/running/done/failed 상태 진행 |

## QA 의도

- 첫 전체 생성에서는 10컷 중 2컷이 실패하도록 mock 주입한다.
- 실패는 해당 컷에만 표시되고 다른 컷 진행을 막지 않는다.
- 재시도/승급은 기존 Take를 삭제하지 않는다.
- 사용자 화면에는 provider/model 이름을 표시하지 않는다.
- 모든 비용 발생 액션은 `⚡` 비용을 버튼 근처에 표시한다.

## 검증 결과

- `node --check ai-video-studio/mock-app/mock-api.js` 통과.
- `node --check ai-video-studio/mock-app/app.js` 통과.
- Codex JSON 계약 파일 10개 `ConvertFrom-Json` 파싱 통과.
- Node VM 기반 mock API flow 통과: 10컷 생성, 2컷 실패 주입, 실패 컷 재시도, Take 보존, 승급, 3개 RenderJob 생성/완료.
- `mock-app` 사용자 UI 파일(`index.html`, `app.js`, `styles.css`)에서 `Runway|Veo|Luma|Gen-4|gen4|ray-2|provider|model` 검색 결과 0건.
- 로컬 정적 서버에서 `/ai-video-studio/mock-app/` HTTP 200 확인.

## 다음 구현 작업

1. 정적 mock service를 실제 Next.js/TypeScript app의 `mock provider` 패키지로 이동.
2. JSON Schema validation을 API boundary에 연결.
3. Playwright E2E로 `create -> generate -> fail -> regenerate -> select -> edit -> render` 경로 자동화.
4. 첫 실제 provider는 API access/쿼터 확인 후 Luma 또는 Runway 중 하나만 연결.
