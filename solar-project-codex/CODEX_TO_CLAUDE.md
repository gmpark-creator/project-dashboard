# CODEX_TO_CLAUDE - Solar Project Codex Handoff

Claude가 Codex 태양계 공개본을 리뷰할 때 이 파일을 먼저 읽으면 된다. Codex는 Claude 폴더를 수정하지 않고, Claude가 2026-05-24에 확장한 기능 범위를 Codex 구조로 별도 구현했다.

## 최신 상태

- 기준 날짜: 2026-05-24 KST
- 공개 앱: `solar-project-codex/index.html`
- Codex 보고서: `solar-project-codex/report.html`
- 진행 단계: Step 9
- Codex 구현 커밋: `3822b6f Enhance Codex solar project with Claude parity layers`
- Claude 기준 HEAD: `7e67296`
- 핵심 변경: 주요 위성, 탐사선, 라그랑주점/공궤도체, 오무아무아/제9행성/EHT, 웜홀/가르강튀아/인터스텔라 행성, 모바일 패널 닫기/복원 dock, 보고서 feature matrix/evidence 섹션 추가

## Step 9 구현 내용

- Focus 메뉴를 `주요 위성`, `인류 탐사선`, `라그랑주/공궤도체`, `특수/성간 천체` 그룹으로 확장했다.
- 11개 주요 위성: Phobos, Deimos, Io, Europa, Ganymede, Callisto, Titan, Rhea, Titania, Oberon, Triton.
- 5개 탐사선/망원경: Voyager 1, Voyager 2, New Horizons, Parker Solar Probe, JWST.
- L1-L5 지점, 목성 트로이 소행성군, 카모오알레와를 별도 Lagrange 레이어로 구현했다.
- 오무아무아 경로, 제9행성 가설 궤도, EHT M87* 블랙홀 장면을 Exotic 레이어로 구현했다.
- 토성 근처 웜홀, 가르강튀아, 밀러/맨/에드먼즈 행성을 Interstellar 레이어로 구현했다.
- HUD, 정보 패널, 부산 달·조석 패널에 닫기 버튼과 복원 chip dock을 추가해 Claude 최신 모바일 UX 작업을 Codex 방식으로 맞췄다.
- 모든 신규 객체는 기존 `solar-project-codex`의 모듈식 구조에 맞춰 데이터, 위치 계산, 렌더링, 포커스 카메라, 정보 패널을 분리했다.
- Claude의 단일 HTML 파일 코드를 직접 병합하지 않았다. 기능 범위만 참고했고 구현은 Codex lane에서 새로 작성했다.

## 기존 Step 5-8 유지 사항

- 카이퍼 벨트와 오르트 구름은 기본 화면에서 숨김이며, 해당 Focus 항목을 선택했을 때만 경계/라벨이 표시된다.
- `태양계 전체` Focus는 행성계 전체를 프레이밍하지만 카이퍼/오르트 경계를 자동으로 켜지 않는다.
- Sagittarius A* `사건의 지평선`은 선택 시에만 accretion disk, 렌즈 링, 헤일로, 제트 레이어가 표시된다.
- 부산 조석표와 실시간 달 위상 위젯은 기본 부산 설정을 유지한다.

## 직접 확인 URL

- 전체 앱: `solar-project-codex/index.html`
- Codex 보고서: `solar-project-codex/report.html`
- 사건의 지평선: `solar-project-codex/index.html?focus=event-horizon`
- 가니메데: `solar-project-codex/index.html?focus=ganymede`
- 보이저 1호: `solar-project-codex/index.html?focus=voyager1`
- EHT M87*: `solar-project-codex/index.html?focus=eht-blackhole`
- 가르강튀아: `solar-project-codex/index.html?focus=gargantua`

## 검증 포인트

- 포커스 메뉴에 신규 그룹과 항목이 존재한다.
- `Moons`, `Probes`, `Lagrange`, `Exotic`, `Interstellar` 토글이 각각 신규 레이어 표시 상태를 제어한다.
- 신규 객체를 클릭하거나 Focus로 선택하면 기존 정보 패널에 거리, 설명, 분류가 표시된다.
- `?focus=ganymede`, `?focus=voyager1`, `?focus=eht-blackhole`, `?focus=gargantua` 직접 URL이 nonblank WebGL 장면으로 열린다.
- 보고서에는 Claude parity map, 검증 evidence, lane separation 설명이 표시된다.
- 상태/정보/달·조석 패널을 닫은 뒤 restore chip으로 다시 띄울 수 있다.
- `solar-project-claude` 폴더는 Codex 작업에서 수정되지 않아야 한다.

## 남은 주의점

- 탐사선, 제9행성, 오무아무아, 인터스텔라 장면은 교육용/시각화용 간소 모델이다. 실제 항법·관측용 정밀 궤도 자료로 설명하면 안 된다.
- 저사양 모바일에서는 신규 레이어를 모두 켰을 때 성능 저하가 있을 수 있으므로 계속 스크린샷/프레임 검증이 필요하다.
- 왕먀오 박사 피드백이 오면 Codex와 Claude lane을 각각 따로 비교하고, 한쪽 코드를 다른 쪽에 직접 덮어쓰지 않는다.
