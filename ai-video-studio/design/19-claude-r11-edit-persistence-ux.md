# Claude R11 — 다듬기(Edit) 컨트롤 저장 UX

> **역할:** Claude(UX 구현/리뷰). Codex R12가 깐 실제 edit/audio API(`POST /edits`, `PUT /audio`) 위에 다듬기 화면의 실동작 컨트롤을 얹는 라운드.
>
> **베이스:** HEAD `51e6646` ("ai-video-studio edit audio api contract"). 무관한 untracked 폴더 `claude/previews/ai-invest-board/`는 건드리지 않음.
>
> **검증 방식:** 소스 정독 + 4종 게이트(`typecheck`/`test:mock`/`validate:contracts`/`build`) + `npm audit --omit=dev` + Playwright 헤드리스 레이아웃 실측. 실제 프로덕션 빌드를 `next start`로 띄워 프로젝트 생성 → 다듬기 진입 → 자막 토글 OFF(저장·새로고침 왕복 후 상태 반영 확인) → 편집 명령 저장(명령 로그 렌더 확인), 각 단계에서 `documentElement.scrollWidth ≤ innerWidth` & `.edit-grid` 하위 전 노드 `scrollWidth − clientWidth ≤ 0` 측정. 임시 probe는 커밋 전 제거.

## 바뀐 UI

다듬기 화면은 그동안 자리표시 입력 한 칸뿐이었다. 이번 라운드에 실제 저장되는 조작 컨트롤로 교체했다.

- **편집 명령** — 입력 + "명령 저장" 버튼(Enter 제출). 빈 값이면 버튼 비활성. 제출 시 입력은 비워지고 최근 명령 3개를 작은 목록(`.command-log`)으로 노출해 "저장됐다"를 즉시 보여준다.
- **자막** — `자막 넣기` 체크박스 + `자막 형식`(영상에 새기기 / 파일로 따로 받기 / 새기기+파일) · `자막 기준`(대본 기준 / 음성 인식 기준) 셀렉트. 자막을 끄면 하위 셀렉트는 비활성.
- **배경 음악** — `배경 음악` 체크박스 + `음악 선택` 셀렉트 · `말할 때 음악 줄이기`(ducking) 체크박스. 음악을 끄면 하위 컨트롤 비활성.
- **보이스(내레이션)** — `보이스(내레이션)` 체크박스 + `보이스 선택` 셀렉트 · `보이스 소스`(기본 제공 보이스 / 직접 업로드) 셀렉트. 끄면 하위 비활성.
- **컷 전환 부드럽게** — 단일 토글(`transitions` soft/none). 헤더 카피("자막, 사운드, 보이스, 전환을 저장합니다")와 일치시키기 위해 포함.

### 동작 모델 — "변경 즉시 저장 + 서버 상태 직접 반영"

모든 오디오/전환 컨트롤은 로컬 사본 없이 `bundle.editState`를 그대로 controlled value로 쓴다. onChange가 즉시 해당 그룹 패치를 보내고, 부모 `run()`이 저장 후 `bundle`을 새로고침한다.

- 별도 "저장" 버튼 없이도 화면은 **항상 저장된 상태**를 보여준다(요구사항: editState 표시).
- 1200ms 폴링 새로고침이 미저장 로컬값을 덮어쓰는 race가 구조적으로 존재하지 않는다(로컬 미저장 상태가 없으므로).
- `setAudio`는 얕은 병합이라 하위 객체(`captions`/`bgm`/`voiceover`)를 통째로 교체한다. 그래서 패치 때 `{ ...captions, enabled }`처럼 **현재 그룹 전체**를 함께 보낸다.
- `track`/`voice`는 자유 문자열이라 과거 저장값이 프리셋에 없을 수 있어, 현재 값을 항상 선택지에 포함(`withCurrent`)시켜 빈 셀렉트를 방지.

### 레이아웃

- 카드 중첩/마케팅 레이아웃을 피하기 위해 각 그룹은 얇은 구분선(`.edit-control` `border-top`)으로만 묶음. 첫 그룹은 구분선 없음.
- 셀렉트 2열은 기존 `.two-compact`(≤980px에서 1열). 편집 명령 줄(`.command-row`)은 입력 `flex:1; min-width:0` + 버튼 `nowrap`로 390px에서도 가로 넘침 없음.

## 소비한 API (Codex 소유, 서버/스키마 무수정)

- 편집 명령: `studioApi.applyEdit(projectId, { command })` → `POST /api/projects/[projectId]/edits`
- 자막/BGM/보이스/전환: `studioApi.setAudio(projectId, patch)` → `PUT /api/projects/[projectId]/audio`
- 저장 직후 부모 `run()`이 `refresh()`로 번들을 다시 받아 `editState`·`renderSourceHash`를 최신화. 덕분에 내보내기 화면의 "프로젝트가 바뀌었습니다"(source-stale) 안내가 다듬기 변경 후에도 정상 동작.

역할 경계 유지: 서버 라우트/OpenAPI/스키마/스크립트 무수정. 변경은 프론트 UI 2개 파일뿐.

## 변경 파일

- `studio-app/src/features/studio/StudioApp.tsx` — `Edit` 컴포넌트 실동작 컨트롤로 교체, 부모에서 `onApplyCommand`/`onSetAudio`를 `run()`으로 배선, `EditState` 타입 import 추가, 라벨 맵/`withCurrent` 헬퍼 추가.
- `studio-app/app/globals.css` — `.command-row`, `.command-log`, `.edit-controls`, `.edit-control`(구분선), `.check-inline` 추가.
- `design/19-claude-r11-edit-persistence-ux.md` — 본 보고서.

## 검증 결과

| 항목 | 결과 |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run test:mock` | PASS (`shots:10 failed:2 takes:33 imageAssets:5 renderJobs:3`) |
| `npm run validate:contracts` | PASS (`providers:4 routingRules:7 templates:6 visualMakerOps:12`) |
| `npm run build` | PASS (`/api/projects/[projectId]/edits`·`/audio` 라우트 포함) |
| `npm audit --omit=dev` | 0 vulnerabilities |

### 헤드리스 레이아웃 실측 (Playwright, 프로덕션 빌드)

| 뷰 | innerWidth | documentElement.scrollWidth | `.edit-grid` 하위 최대 노드 오버플로 | 가로 오버플로 | 비고 |
| --- | --- | --- | --- | --- | --- |
| 모바일 390px · 기본 | 390 | 390 | 0 | **0** | — |
| 모바일 390px · 자막 OFF | 390 | 390 | 0 | **0** | 토글 저장 반영 확인(persisted) |
| 모바일 390px · 명령 저장 후 | 390 | 390 | 0 | **0** | 명령 로그 1건 렌더 |
| 데스크탑 1366px · 기본 | 1366 | 1366 | 0 | **0** | — |
| 데스크탑 1366px · 자막 OFF | 1366 | 1366 | 0 | **0** | 토글 저장 반영 확인(persisted) |
| 데스크탑 1366px · 명령 저장 후 | 1366 | 1366 | 0 | **0** | 명령 로그 1건 렌더 |

→ 6개 상태 모두 가로 오버플로 0, 컨트롤 4그룹·체크박스 5개 정상 렌더. 자막 토글은 저장·새로고침 왕복 뒤 OFF로 반영(서버 상태 직접 반영 모델 검증), 편집 명령은 저장 후 로그에 노출(영속화 검증).

## 잔여 리스크 / 후속

- **저장 반영 지연:** controlled 값이 서버 상태라, 토글 클릭 후 `setAudio` 왕복(+다음 폴링)까지 짧게 직전 값을 보일 수 있다. 목 환경에선 체감 거의 없으나, 실제 백엔드 지연이 커지면 낙관적 업데이트(optimistic)나 in-flight 비활성 처리가 필요할 수 있음.
- **토스트 빈도:** 모든 토글이 즉시 저장 → 매 변경마다 토스트가 뜬다. 빠른 연속 조작 시 다소 잦을 수 있음. 필요 시 오디오 저장은 토스트를 디바운스/축약 검토.
- **`track`/`voice` 프리셋:** 표시용 이름은 프론트 고정 목록. 라이선스 음원/보이스 카탈로그가 백엔드에서 오게 되면 목록 소스를 API로 옮겨야 함(프리셋 외 저장값은 현재도 안전하게 표시됨).
- **명령 효과 비가시:** 편집 명령은 저장·이력 노출까지만(목). 명령이 실제 타임라인에 어떻게 반영되는지의 미리보기는 후속 라운드 범위.
- **전환(transitions) 포함 범위:** 과제 스코프 1번엔 명시되지 않았으나 화면 헤더 카피·`EditState` 일관성을 위해 단일 토글로 포함. 불필요 판단 시 제거 가능.
