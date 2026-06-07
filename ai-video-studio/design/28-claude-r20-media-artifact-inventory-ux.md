# Claude R20 — Media Artifact Inventory UX

운영자가 **전체 프로젝트의 미디어 산출물/스토리지 인벤토리**(저장 vs 외부, 이미지/영상 구성, 정리
상태, 저장 용량·용량 미상 건수, 최근 산출물 목록)를 한눈에 볼 수 있는 읽기 전용 surface를 Studio
UI에 추가했다. 백엔드/스키마/도메인 타입/스크립트는 건드리지 않고, Codex가 제공한
`GET /api/system/media-artifacts` 계약(`MediaArtifactInventory`)을 UI에서 소비만 한다.

**삭제 기능이 아니다.** 이 화면은 운영 점검용 읽기 전용 인벤토리이며, 산출물 삭제·스토리지 정리
동작은 제공하지 않는다(가짜 정리 버튼도 두지 않는다).

## 무엇이 바뀌었나

- **Asset Library 뷰 상단에 `미디어 산출물 인벤토리` 패널을 추가**했다. 기존 외부 이미지 등록 /
  Reference Board 2열 그리드 위에 상주하는 전체 폭 단일 `.panel`이다(운영 지표 패널 `.metrics`의 블록
  구조를 재사용). 새 화면/탭/랜딩/히어로를 만들지 않았다.
- 패널 헤더: 제목 + 정리 주의 배지(`확인 권장 N건`(미참조+외부 확인 합) / 없으면 초록 `정리 양호`) +
  `HH:MM 기준` 시각.
- 본문은 카드 중첩 없이 **상단 구분선으로만 나뉜 블록 2개 + 최근 목록**으로 구성:
  1. **보관 현황** — 전체 / 저장됨 / 외부 연결 / 이미지 / 영상.
  2. **정리 상태 · 용량** — 보관(retain = 전체−미참조−외부 확인) / 외부 확인(reviewExternal) /
     미참조(orphaned) / 저장 용량(knownBytes를 사람이 읽는 단위로 축약) / 용량 미상(unknownBytes는
     **바이트 합이 아니라 bytes=null 산출물의 건수**라 `N건`으로 표기). 읽기 전용임을 명시하는 보조
     문구를 둔다.
  3. **최근 산출물** — `createdAt` 내림차순으로 최근 8건. 각 줄은 프로젝트 제목 / 보관 역할(이미지
     자산·썸네일·영상 테이크·포스터·내보내기 결과) / 종류(이미지·영상) / 저장 위치(저장됨·외부 연결)와,
     정리 상태 배지 + 참조 수(`참조 N`/`참조 없음`) · 용량 · 상대 시각을 보여준다.
- 톤 규칙: 미참조·외부 확인은 주의가 필요하므로 0보다 클 때 빨강(`warn`) 톤, 보관은 초록(`ok`),
  정리 상태 배지는 retain=초록/review_external=시안/orphaned=빨강으로 방향을 색으로만 읽게 한다.

## 위치 선택 이유

- 인벤토리는 **저장된 이미지/영상 산출물**을 다루므로, 자산을 분류·연결하는 운영자의 자리인
  **Asset Library**가 가장 자연스럽다(과제 권고: "Prefer the Asset Library view").
- 대시보드의 운영 지표 패널(R19)에는 이미 `미디어 산출물`의 집계 수치(전체/이미지/영상/외부)가 있다.
  R20은 거기서 한 발 더 들어간 **정리 상태·용량·최근 목록**을 자산 운영 화면에 둬, 두 surface가 역할을
  나눠 갖게 했다(요약은 대시보드, 상세 점검은 Asset Library).
- `bundle`이 있을 때만(=프로젝트를 열고 Asset Library에 들어온 운영 맥락) 패널을 렌더한다. 인벤토리
  자체는 전역(모든 프로젝트) 데이터다.

## 데이터 흐름 / 새로고침

- `src/features/studio/api.ts`에 UI 전용 클라이언트 메서드 `getMediaArtifactInventory()` 추가
  (`GET /api/system/media-artifacts` → `MediaArtifactInventory`).
- `StudioApp`의 `loadInventory()`가 조회 후 상태에 저장. 실패해도 패널만 숨기고 본 작업 흐름은 막지
  않는다(읽기 전용 부가 정보, 지표와 동일 정책).
- 갱신 시점(지표 `loadMetrics`와 같은 자리에 나란히 호출):
  - **마운트 시 1회**.
  - **액션 직후 즉시** — 산출물을 바꾸는 모든 경로가 `run()`(이미지/컷 생성·렌더 시작·후보 선택·
    업그레이드·외부 이미지 등록 등) 또는 `cancelJob()` / `cancelActiveJobs()`(작업 취소)를 거치므로,
    이 세 곳에서 `refresh()` 직후 `loadInventory()`를 호출한다.
  - **백그라운드 라이브 갱신** — 기존 1.2초 `tick`/`refresh` 루프에서 잡이 진행되며 take/렌더 산출물이
    생기므로, **약 5틱(~6초)마다 한 번** 갱신한다(지표와 같은 `tickCount` 카운터 공유).

## 프라이버시 / 리댁션 제약 (노출하지 않는 것)

- 계약(`MediaArtifactInventoryItem.artifact`)에는 백엔드/admin용으로 `id`, `ownerId`, `sourceJobId`,
  `url`, `storageKey`, `contentType`가 들어 있으나 **화면에는 어느 것도 렌더하지 않는다.**
- 노출하는 필드는 사용자/운영자 안전한 것만: 프로젝트 제목(`projectTitle`), 보관 역할(`role` → 한국어
  라벨), 종류(`kind`), 저장 상태(`status`), 정리 상태(`cleanup`), 참조 여부·수(`referenced`/
  `referenceCount`), 바이트(`bytes`, 사람이 읽는 단위로 축약), 생성 시각(`createdAt`, 상대 시각).
- 프로바이더/모델 이름, 원시 프롬프트, 환경변수 값, 원시 자산/잡/소유자 id, 스토리지 키 — 전부 미노출.
- React `key`에도 원시 id를 쓰지 않고 `createdAt`+인덱스 합성키를 사용한다(키는 DOM에 렌더되지 않지만
  보수적으로 원시 id를 코드에서도 피한다).
- 정리 상태는 안내일 뿐이며 **삭제/정리 동작·버튼은 없다.** 보조 문구로 읽기 전용임을 명시한다.

## 만진 파일

- `ai-video-studio/studio-app/src/features/studio/api.ts` — `getMediaArtifactInventory()` 추가,
  `MediaArtifactInventory` 타입 import.
- `ai-video-studio/studio-app/src/features/studio/StudioApp.tsx` — `MediaArtifactInventoryPanel` 및
  보조 컴포넌트(`ArtifactRow`)·헬퍼(`artifactRoleLabels`, `artifactKindLabels`, `artifactCleanupMeta`,
  `formatBytes`), `inventory` 상태·`loadInventory()`·갱신 훅(마운트/액션/취소/틱), Asset Library 상단
  렌더 및 `inventory` prop 전달.
- `ai-video-studio/studio-app/app/globals.css` — `.artifact-inventory`/`.artifact-list`/`.artifact-row`
  등 인벤토리 목록 스타일.
- `ai-video-studio/design/28-claude-r20-media-artifact-inventory-ux.md` — 본 리포트.

백엔드/서비스/계약 파일(`src/server/*`, `app/api/*`, `scripts/*`, `codex/schemas/*`, `codex/api/*`)과
`src/domain/types.ts`, `mock-service`, 패키지/깃 메타데이터는 건드리지 않았다(엔드포인트·
`MediaArtifactInventory` 타입은 Codex가 이미 정의).

## 레이아웃 노트 (가로 넘침 방지)

- 요약 블록은 운영 지표 패널과 동일한 `.metric-row { grid-template-columns: repeat(auto-fit,
  minmax(92px, 1fr)); }`를 재사용 — 좁은 폭에서 스탯 칸이 자동 줄바꿈된다. `.metric { min-width: 0 }`,
  `.metric-label { overflow-wrap: anywhere }`로 긴 라벨이 칸을 밀지 않는다.
- 최근 목록 `.artifact-row`는 `flex-wrap: wrap`이라 좁은 폭에서 우측 메타(`.artifact-side`)가 제목 아래로
  내려간다. `.artifact-main { min-width: 0; flex: 1 1 200px }`, `.artifact-title`/`.artifact-sub`/
  `.artifact-meta`에 `overflow-wrap: anywhere`로 긴 프로젝트 제목·메타가 가로로 넘치지 않는다.
- 목록은 중첩 카드/배경 박스 없이 `.ledger`와 동일하게 **상단 구분선(border-top)으로만** 행을 나눈다.
- 980px 이하에서 Asset Library의 `.image-grid`는 기존 미디어쿼리로 1열이 되고, 인벤토리 패널은 전체
  폭이라 영향 없음. 패널은 `.panel`(`min-width: 0`)을 재사용해 그리드 컬럼 안에서 넘치지 않는다.
- 중첩 카드·랜딩·히어로·마케팅 섹션 없음.

## 수행한 검증

`studio-app` 디렉터리에서 실행, 모두 통과:

| 명령 | 결과 |
| --- | --- |
| `npm run typecheck` | 통과 (tsc --noEmit, 에러 없음) |
| `npm run test:mock` | 통과 — `{ shots: 10, failed: 2, takes: 33, imageAssets: 5, renderJobs: 3 }` |
| `npm run validate:contracts` | 통과 — `{ providers: 4, routingRules: 7, templates: 6, visualMakerOps: 18 }` |
| `npm run build` | 통과 — `/api/system/media-artifacts` 포함 전체 라우트 빌드 |
| `npm audit --omit=dev` | `found 0 vulnerabilities` |

Codex 후속 브라우저 검증(Chrome CDP, Asset Library 진입, `http://127.0.0.1:3020`):

| 뷰포트 | 결과 |
| --- | --- |
| 390×900 | `.artifact-inventory` 렌더 확인, `documentScrollWidth=390`, `bodyScrollWidth=390`, `overflowX=0`, 패널 `left=14/right=376/width=362`, raw id/url/storage key 패턴 미노출 |
| 1366×900 | `.artifact-inventory` 렌더 확인, `documentScrollWidth=1351`, `bodyScrollWidth=1351`, 가로 넘침 없음, 패널 `left=274/right=1325/width=1051`, raw id/url/storage key 패턴 미노출 |

실제 렌더에서도 위 "레이아웃 노트"의 `auto-fit minmax`·`flex-wrap`·`overflow-wrap` 가드가 기대대로 동작했다.
