# Claude R18 — Runtime readiness UX

운영자가 앱이 **목업 모드**인지 **운영 모드**인지, 그리고 운영 전제 조건 중 무엇이 누락/주의 상태인지
한눈에 볼 수 있는 컴팩트한 상태 surface를 Studio UI에 추가했다. 백엔드/스키마/스크립트는 건드리지
않고, Codex가 제공한 `GET /api/system/readiness` 계약을 UI에서 소비만 한다.

## 무엇이 바뀌었나

- 상단 바(`.topbar-actions`)에 **런타임 점검 배지**를 상주시켰다. 크레딧 알약 왼쪽에 위치한다.
  - 배지: `● 모드라벨 [n]` 형태. 점(dot) 색으로 상태를, 숫자 칩으로 주의/실패 항목 수를 표시.
  - 누르면 펼침 패널이 열려 점검 항목별 상태와 누락 환경변수 이름을 보여준다.
- **모드 표기**: 운영 모드 / 목업 모드 (한국어 라벨만).
- **상태 톤**:
  - 운영 모드 → `ready` 이면 초록(준비됨), 아니면 빨강(점검 필요).
  - 목업 모드 → 항상 `ready=true`이므로, 점검에 주의가 있으면 금색(확인 권장), 없으면 초록(정상).
- **점검 항목**: `check.id`로 한국어 라벨을 직접 매핑하고(런타임 모드 / 목업 저장소 / 프로바이더 키 /
  오브젝트 스토리지 / 큐 워커), 상태는 정상·주의·실패로 표기. 백엔드의 영어 `label`/`detail`은
  화면에 렌더하지 않는다(미정의 id만 `check.label`로 폴백).
- **누락 환경변수**: `missingEnv`를 환경변수 **이름만** 칩으로 노출. 값은 절대 표시하지 않는다.
- 보안: 시크릿/원시 env 값 비노출. 운영에 필요한 변수 이름만 컴팩트하게 보여줌.
- 마케팅/랜딩 섹션 없음. 작업 밀도 유지.

## 위치 선택 이유

- 레일 푸터(`.rail-footer`)는 `@media (max-width: 980px)`에서 `display: none`으로 숨겨져 모바일에서
  접근 불가다. 반면 `.topbar`는 항상 상주하므로, 데스크톱·모바일 모두에서 보이도록 배지를
  `.topbar-actions`에 두었다. 별도 화면 전환 없이 모든 뷰에서 접근 가능.

## 데이터 흐름

- `src/features/studio/api.ts`에 UI 전용 클라이언트 메서드 `getReadiness()` 추가
  (`GET /api/system/readiness` → `RuntimeReadiness`). 최소·UI 전용.
- `StudioApp`에서 마운트 시 1회 조회(`useEffect`). 점검 결과는 환경변수 기반이라 거의 변하지 않아
  폴링하지 않는다. 조회 실패 시 배지를 숨기고 본 작업 흐름은 막지 않는다.
- 기존 1.2초 `tick`/`refresh` 루프에는 readiness를 끼워 넣지 않았다(불필요한 호출 방지).

## 만진 파일

- `ai-video-studio/studio-app/src/features/studio/api.ts` — `getReadiness()` 클라이언트 메서드 추가,
  `RuntimeReadiness` 타입 import.
- `ai-video-studio/studio-app/src/features/studio/StudioApp.tsx` — `RuntimeReadinessBadge` 컴포넌트,
  한국어 라벨/상태 매핑, readiness 상태·마운트 조회, 상단 바 렌더 추가.
- `ai-video-studio/studio-app/app/globals.css` — `.readiness*` 배지/패널 스타일 추가.
- `ai-video-studio/design/26-claude-r18-runtime-readiness-ux.md` — 본 리포트.

백엔드/서비스/계약 파일(`src/server/*`, `scripts/*`, `codex/schemas/*`, `codex/api/*`)과
`src/domain/types.ts`는 건드리지 않았다(`RuntimeReadiness` 타입은 Codex가 이미 정의해 둠).

## 레이아웃 노트 (가로 넘침 방지)

- `.readiness-panel { position: absolute; right: 0; width: min(280px, calc(100vw - 28px)); }`
  — 뷰포트 기준으로 폭을 캡해 좁은 화면에서 양옆 여백(28px)을 항상 남긴다. 우측 정렬이라 패널이
  화면 오른쪽 밖으로 밀리지 않는다.
- `.readiness-item-label { min-width: 0; }` — 긴 라벨이 flex 항목을 밀어내지 않도록 축소 허용.
- `.readiness-env-chip { max-width: 100%; word-break: break-all; }` — 긴 환경변수 이름도
  줄바꿈되어 칩 영역을 넘지 않는다. `.readiness-env-chips`는 `flex-wrap: wrap`.
- 모바일(≤980px)에서는 `.topbar-actions`가 세로 정렬(`flex-end`)이며 배지가 그대로 보인다. 펼침
  패널은 배지 아래에 우측 정렬로 떠 본문 위를 덮는다(`z-index: 12`).

## 수행한 검증

studio-app 디렉터리에서 실행, 모두 통과:

| 명령 | 결과 |
| --- | --- |
| `npm run typecheck` | 통과 (tsc --noEmit, 에러 없음) |
| `npm run test:mock` | 통과 — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | 통과 — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 16 }` |
| `npm run build` | 통과 — `/api/system/readiness` 포함 전체 라우트 빌드 |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

레이아웃 점검(390px / 1366px): 이 환경에 헤드리스 브라우저 도구가 없어 시각 캡처 대신 CSS 정적
분석으로 확인했다. 위 "레이아웃 노트"의 폭 캡(`min(280px, calc(100vw - 28px))`)·우측 정렬·
`word-break`·`min-width: 0` 가드로 390px에서도 readiness surface에 가로 스크롤이 발생하지 않으며,
1366px에서는 배지·패널 모두 상단 바 오른쪽 안에 안착한다.
