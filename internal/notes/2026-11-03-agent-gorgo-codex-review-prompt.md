# Codex 검수 요청 — AGENT GORGO WORLD (부산 맵 + 2D 캐릭터) 1차 빌드

> 모드: RESIDENT (박사 수동 중계). 판정: PASS / BLOCK + 파일:라인 근거로 수정 지시.
> ⚠️ 파일에 한글 주석·문자열이 많음 → PowerShell로 읽을 때 반드시 `Get-Content -Encoding UTF8`.

## 0. 배경 (박사 지시 원문 요약, 2026-11-03)
- 바람의나라 같은 **장르의** 2D 탑다운 도트 RPG 형태로, 대한민국 지도 위를 캐릭터가 걸어 다니다가 업무 장소에 가면 해당 업무 화면이 뜨는 개인 업무 도구.
- **1단계 = 미적인 부분만**: 부산 지도 + 2D 캐릭터 「에이전트 고르고」. "가장 아기자기하고 귀여우면서 퀄리티 있게."
- 업무 기능은 박사가 나중에 순차 지시함. 지금은 업무 존 2곳만 위치를 잡아 둠:
  - 센텀시티 사무실 → 나중에 인보이스 작성
  - 부산출입국·외국인청(중앙동) → 나중에 EDI 전송 정정(삭제) 신청서, 본선 선원명부 양식
- Claude가 프론트 메인. 박사 지시로 Thesis 라운드 없이 바로 빌드에 들어갔음 → **이번 검수가 첫 적대 게이트**.

## 1. 현재 상태 (사실 그대로)
- 위치(커밋 안 됨, working tree): `C:\Users\User A\Desktop\새 폴더\project-dashboard\claude\previews\agent-gorgo\`
  - `js/mapgen.js` (246줄) — 부산 데포르메 지형 생성기. 순수 데이터, 노드에서도 돌아감
  - `js/art.js` (334줄) — 타일/나무/주택/아파트/유리타워/크레인/컨테이너/등대/부산타워/부산역/사무실/출입국청 스프라이트를 코드로 픽셀 생성 (외부 이미지 0)
  - `js/gorgo.js` (119줄) — 캐릭터 도트 16×21, 4방향 × 4프레임 + 눈 깜빡임, 왼쪽은 오른쪽 좌우반전
  - `js/game.js` (463줄) — 루프, 입력(키보드/클릭 이동/모바일 조이스틱), 충돌, 카메라, y정렬, 배·갈매기·구름그림자, 다리 케이블, DOM 지명 라벨, 미니맵, 업무 존 패널(현재는 "곧 추가" 자리표시)
  - `tools/ascii-map.cjs` — 지형을 ASCII로 찍는 확인 스크립트
- **아직 없는 것**: `index.html`(캔버스·HUD·패널·인트로 DOM과 CSS). 그래서 **브라우저 실행 검증은 아직 0회**. game.js가 참조하는 DOM id: `world, labels, joy, joy-knob, act-btn, loc-name, loc-coord, minimap, panel(.p-icon .p-title .p-en .p-intro .p-list .p-close), panel-dim, intro`.
- 대시보드(projects-data.js) 등록 아직 안 함.
- 지금까지 한 검증: `node tools/ascii-map.cjs <abs>/js/mapgen.js` 실행 → 지형 모양 육안 확인, 오브젝트 1094개 생성. 그 외 테스트 없음.

## 2. 판정해 줄 항목 (번호별로 PASS/BLOCK)
1. **도달 가능성**: 스폰(사무실 문 앞, game.js `player` 초기값) → 출입국청 문 트리거(`zones[].dx/dy`, 반경 26px)까지 걸어서 갈 수 있는가? 물(DEEP/SHALLOW/RIVER) 차단 + 나무·건물 solid 때문에 길이 끊기지 않는지. 특히 영도대교·북항 구간과 랜드마크 예약구역(`isReserved`). 가능하면 mapgen + solid 규칙으로 BFS를 직접 돌려서 확인.
2. **문 트리거 vs 충돌 박스**: office/immigration의 solid rect(game.js 랜드마크 블록)가 문 트리거 지점을 막아 영영 못 들어가는 경우가 있는지.
3. **gorgo.js 도트 행 폭**: 모든 행이 정확히 16자인지(validate가 console.warn만 하므로 조용히 깨질 수 있음). 눈(W/e) 열이 7·8행 사이에 맞물리는지, blinkify가 의도대로 동작하는지.
4. **game.js 버그 후보**: 배 좌우반전(`translate(sx*2+40)`) 좌표 계산, 모바일에서 touchstart와 pointerdown의 중복 처리, 키 입력(Space/E/Enter)과 패널 열림 상태, `positionDom`의 매 프레임 DOM 갱신 비용, dt 상한, 카메라 clamp(맵이 화면보다 작을 때).
5. **art.js 잔재**: `'#ffffff88'.slice(0,7)`(결국 흰색 불투명) 같은 의미 없는 코드, makeTree의 죽은 줄(`Math.random() < 0`) — 정리 대상 지정.
6. **IP 리스크**: 바람의나라(넥슨)의 캐릭터·도트·맵·UI를 재현한 부분이 없는지. 의도는 "장르 문법만 차용, 그림은 전부 오리지널"임. Galmuri 폰트(OFL) 사용 예정.
7. **지명·위치 정합**: 부산출입국·외국인청을 중구 중앙동 쪽(북항 서측)에 둔 것, 센텀시티를 수영강 동안에 둔 것 등 상대 배치가 박사가 보기에 어색하지 않을 수준인지. (정밀 좌표가 아니라 데포르메라는 전제)
8. **구조**: 앞으로 업무 모듈(인보이스, EDI 정정신청서, 선원명부)이 존마다 붙을 예정인데, 지금 `ZONE_CONTENT` 하드코딩 구조가 확장에 버틸지, 아니면 index.html 작성 전에 존 → 모듈 등록 방식을 바꿔야 하는지.

## 3. 반환 형식
- 항목별 PASS/BLOCK, BLOCK이면 Claude가 바로 고칠 수 있게 paste-ready 수정 지시(파일:라인).
- 다음 단계(index.html 작성 + 브라우저 실검증 + 대시보드 등록)로 넘어가도 되면 **"이제 구현해도 됨"** 명시.

## 4. 추가 (요청서 전달 후, 박사 지시로 진행)
- `index.html` 작성 완료 → 브라우저 실행 가능. 헤드리스 Chrome 1440×900 실검증: 콘솔 오류 0, 센텀/중앙동/광안대교/북항 4곳 촬영 확인.
- 실검증에서 발견해 고친 것: (a) 사무실 바로 앞에 유리 타워가 생성되어 캐릭터를 가림 → mapgen `clearAround` 예약 범위를 남쪽 `ly+5`까지 확대. (b) 상단 로고 HUD가 존 태그와 겹침 → 하단으로 이동. (c) 확대율 4배 → 3배(`game.js` resize 공식).
- 테스트용 URL 파라미터 추가: `?nointro`, `?at=x,y`(타일 좌표 스폰), `?open=office|immigration`. ⚠️ `at`은 물 위 스폰도 허용됨(검증용).
- 항목 1 사전 확인(Claude 자체): 타일 BFS(물 + 오브젝트 발밑 타일 차단)로 사무실 → 출입국청 문 도달 **가능**. 단, 픽셀 단위 solid rect 기준 검증은 아님 → Codex 재확인 요망.
- 대시보드 #14 등록(projects-data.js, 진행도 1%). 커밋·푸시는 Codex 판정 후.
