/* 2026 PRESIDENT KOREA (korea-gov-sim) standalone data — projects-data.js에서 추출, 단일 프로젝트 */
window.PROJECTS=[{
 "id": "korea-gov-sim",
 "name": "2026 PRESIDENT KOREA",
 "subtitle": "대통령 정치 시뮬레이션 게임 · 5년 단임 60개월",
 "icon": "landmark",
 "platform": "웹 게임 · Vite + React + TypeScript",
 "status": "in-progress",
 "start": "2026-05-26",
 "latest": "2026-05-31",
 "progress": 1,
 "link": "https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?lang=ko&v=kgs3",
 "preview": {
  "type": "embed",
  "height": 640,
  "items": [
   {
    "url": "https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?lang=ko&v=kgs3",
    "label": "2026 PRESIDENT KOREA — 플레이 가능한 vertical slice (Three.js 지도 + 국정현안·위기·국회·예산 엔진, Codex 진행)"
   },
   {
    "url": "https://gmpark-creator.github.io/project-dashboard/claude/previews/inauguration-cinematic/",
    "label": "대통령 취임 시네마틱 — 3D 카툰 실시간 컷신 (Three.js, Claude 제작 · 이벤트 트리거 영상 PoC)"
   }
  ]
 },
 "summary": "대한민국 대통령으로 5년 단임을 사는 정치 시뮬레이션 게임의 5번째 프로젝트.\n메뉴가 아니라 살아있는 지도가 통치판 —\n어두운 세계 위에 따뜻한 한지색 한국이 떠오르고,\n플레이어는 지도 위에 정책을 찍고 민심·예산·위기·외교를 굴린다.\n월 단위 결정론 엔진(60개월)을 LLM이 자연어 이벤트로 감싸는 구조로 설계되어 있으며,\nKGS-MAP-15까지 진행 — 다국어 라벨(6 locale) · 북한·MDL · 44 entity dataset ·\n정부·공공기관 건물 oid 게임 오브젝트화 완료.\n이후 Codex가 메인 개발을 인수(2026-05-29)해 게임플레이 엔진을 본격 구축 —\n월간 위기 생성·한국형 위기 템플릿, 세이브/로드, 월간 이벤트 덱,\n국회 의석 협상, 부처·참모 능력치, 탄핵 리스크, 예산 회계연도까지 연결되고\n엔진 테스트 35/35 통과.\n지금은 지도+국정현안+위기/이벤트/국회/예산이 도는 플레이 가능한 vertical slice.",
 "method": "설계 v0.1(20+ 섹션) + 구현 계획 v0.1(M1~M11) 박사 승인 후 M0 vertical slice 완성. Vite + React + Zustand로 단일 Ground Truth 스토어 구축, d3-geo Mercator projection으로 Natural Earth 1:110m(세계) + southkorea-maps(한국 17 광역시도) 실 GeoJSON 렌더링. 디자인 언어 「슬레이트 위의 한지」 — 한지·먹·단청 13색 자체 팔레트 + 인장형 POI 아이콘 + 명조 디스플레이/sans 본문/mono 수치 3계층 타이포. Paradox · Geopolitical Simulator · Google Earth 등 기존 게임/지도 서비스 모방 0건 검증.",
 "stack": [
  "Vite",
  "React 18",
  "TypeScript 5",
  "Zustand",
  "d3-geo",
  "SVG",
  "Natural Earth",
  "southkorea-maps"
 ],
 "stackDetail": [
  {
   "area": "프로젝트 빌드·개발 환경",
   "tech": "Vite, TypeScript 5",
   "how": "Vite로 단일 프로젝트를 부트하고 번들링하며 M0 vertical slice에서 vite build 858ms·gzip JS 62KB를 측정했다. TypeScript 5로 7종 데이터 스키마(Region·POI·Policy·Crisis·MapState·GameState)를 타입화하고 tsc 0 에러를 검증 기준으로 사용한다."
  },
  {
   "area": "게임 화면·UI 컴포넌트",
   "tech": "React 18",
   "how": "Header·MapViewport·RegionalGovernancePanel·POIDialog·LayerToggleSidebar 등 화면 컴포넌트를 React 18로 구성한다. 이후 풀스크린 게임 인터페이스(top status bar·left rail·center map·right inspector·bottom timeline)도 React 컴포넌트로 재구축했다."
  },
  {
   "area": "전역 상태·단일 Ground Truth 스토어",
   "tech": "Zustand",
   "how": "민심·예산·위기·외교·카메라 상태를 담는 단일 Ground Truth 스토어를 Zustand로 구축한다. 카메라 reset 동기화를 위해 cameraResetNonce 카운터를 두고, 매 wheel/drag tick 대신 idle·zoomLevel 변경 시점에만 commit하도록 갱신 시점을 제어한다."
  },
  {
   "area": "지도 투영·좌표 변환",
   "tech": "d3-geo",
   "how": "d3-geo Mercator projection을 중심 좌표(127.8E, 36.2N)로 도입해 GeoJSON을 화면 좌표로 투영한다. POI 10개를 픽셀 좌표에서 실 위경도(용산 대통령실 37.5326,126.9774 등)로 전환하는 데 사용한다."
  },
  {
   "area": "1차 지도 렌더링 레이어",
   "tech": "SVG",
   "how": "초기 지도판을 SVG로 렌더링하며 한국 외곽 골드 halo glow를 SVG filter로, selected region drop-shadow glow를 SVG로 표현했다. 이후 g transform transition 누적에 의한 렉 진단으로 Three.js 전환되며 옛 SVG 컴포넌트는 폐기됐다."
  },
  {
   "area": "세계지도 형상 데이터",
   "tech": "Natural Earth",
   "how": "손코딩 mock 폴리곤을 Natural Earth 1:110m countries(Public Domain, 177개국) 실 GeoJSON으로 교체해 진짜 대륙·국가 형상을 렌더한다. mapshaper 4% 단순화로 7.2MB를 452KB로 축소했다."
  },
  {
   "area": "대한민국 행정구역 데이터",
   "tech": "southkorea-maps",
   "how": "southkorea-maps kostat 2018(CC-BY) 행정안전부 광역시도 GeoJSON으로 17개 광역시도 진짜 경계를 렌더한다. 행안부 코드와 ISO 3166-2:KR 매핑 테이블을 두어 region 식별에 연결한다."
  },
  {
   "area": "게임플레이 엔진 (Codex)",
   "tech": "TypeScript, Zustand",
   "how": "src/game 독립 엔진 계층 + Zustand Ground Truth 스토어로 월 단위 결정론 시뮬을 돌린다. 정책 효과·월간 위기 생성(한국형 템플릿)·월간 이벤트 덱·국회 의석 통과확률·탄핵 리스크·부처/참모 능력치·예산 회계연도·세이브/로드를 구현하고, scripts/run-game-tests.mjs로 게임 테스트 35/35를 통과시킨다. (2026-05-29 Codex 메인 개발 인수)"
  },
  {
   "area": "취임 시네마틱 — 3D 카툰 컷신 (Claude)",
   "tech": "Three.js, WebGL, HTML5 Canvas, Vanilla JS, ES Modules (importmap), Playwright",
   "how": "three.module.js(r0.160)를 importmap ESM으로 로드해 빌드 없이 단일 self-contained HTML로 구동한다. MeshToonMaterial 셀셰이딩 + 3점 조명/림라이트로 카툰 톤을 내고, 태극기(태극·4괘)·하늘 그라데이션·toon 램프를 HTML5 Canvas 2D로 절차 생성해 CanvasTexture로 입힌다. 색종이 260개는 InstancedMesh, 태극기는 PlaneGeometry 정점 sin 파동으로 휘날린다. 카메라 smoothstep 돌리인 + CSS 레터박스/타이틀 페이드, 14초 루프. Playwright headless로 3컷 캡처해 콘솔 에러 0 검증. 게임 이벤트(취임·위기·선거)에 영상을 삽입하는 파이프라인 PoC."
  }
 ],
 "issues": [
  {
   "type": "완료",
   "title": "설계 문서 v0.1 작성 + 박사 승인",
   "desc": "A~T 20개 섹션 + 9개 Claude Code subagent 명세 + 17 광역시도 줌 7단계 + 인장형 아이콘 시스템 + 한지+슬레이트+단청 팔레트 + 데이터 스키마 5종(Region/POI/Policy/Crisis/MapState/GameState) + originality 14항 체크리스트."
  },
  {
   "type": "완료",
   "title": "구현 계획 v0.1 (M1~M11) 박사 승인",
   "desc": "리포 구조 · 정적 지도 · 줌 시스템 · 행정구역 · POI · 스키마 · mock store · 호버/클릭 패널 · 레이어 토글 · 정책 타게팅 · 테스트 — 11 마일스톤 의존성 그래프 + 추정 12주 + 소유권 행렬."
  },
  {
   "type": "완료",
   "title": "M0 vertical slice (Vite + React + 33 파일)",
   "desc": "package.json·tsconfig·vite.config 셋업 + 7 schema · 17 region mock · 10 POI mock · Zustand store · 13색 design tokens · MapViewport(휠 줌 + 드래그 팬) · WorldBackground · KoreaRegions · POIMarkers · SealIcon · CrisisOverlay · HoverTooltip · ZoomIndicator · RegionalGovernancePanel · POIDialog · LayerToggleSidebar(10토글) · Header · 9개 subagent self-review. tsc 0 에러, vite build 858ms, gzip JS 62KB."
  },
  {
   "type": "이슈",
   "title": "1차 슬라이스 지도 퀄리티 미달 (박사 지적)",
   "desc": "세계 6각형 blob + 한국 5-9 정점짜리 다각형으로 손코딩 — 박사가 「쓰레기같은 퀄리티」 지적. 박사 메시지: 「프론트엔드 디자인부터 대한민국 지도 및 세계지도 구현이 제일 중요한데」. 즉시 인정 후 복구 착수."
  },
  {
   "type": "핵심",
   "title": "실 GeoJSON 전면 교체 — Natural Earth + southkorea-maps (2026-05-26)",
   "desc": "손코딩 mock 폴리곤을 실데이터로 교체. (1) Natural Earth 1:110m countries(Public Domain, 177개국) — 진짜 대륙·국가 형상. (2) southkorea-maps kostat 2018(CC-BY) — 행정안전부 광역시도 GeoJSON. (3) mapshaper 4% 단순화로 7.2MB→452KB. (4) d3-geo Mercator projection 중심(127.8°E, 36.2°N) 도입. (5) POI 10개 모두 픽셀 좌표→실 위경도 전환(용산 대통령실 37.5326,126.9774 / 여의도 국회 / 부산항 / 인천공항 / 수원 삼성 / 울산 현대 / 나주 KEPCO / 대덕연구단지 / KAIST). (6) 행안부 코드↔ISO 3166-2:KR 매핑 테이블. tsc/build 통과, gzip JS 70KB."
  },
  {
   "type": "이슈",
   "title": "2차 시각 품질 미달 (박사 지적 — Frontend Quality Rescue 발동)",
   "desc": "박사 메시지: 「the visual quality is not acceptable」「looks like a developer placeholder, not a premium political simulation」. 디자인 디렉션 재지시 — 다크 네이비/그래파이트 base + 시안 정부 색조 + 골드/앰버 대통령 강조 + glass 패널 + 절제된 그라데이션. 풀스크린 게임 인터페이스로 재구축 지시(top status bar + left rail + center map + right inspector + bottom timeline)."
  },
  {
   "type": "핵심",
   "title": "Frontend Art Direction Rebuild — Presidential Situation Room (2026-05-26)",
   "desc": "시각 품질 전면 재구축. (1) 디자인 토큰 v0.2 — 한지 톤 폐기, dark navy(#0B0F1A) + 시안(#4ECDC4) + 골드(#D4A85A) 3원 + 한국 cream/ivory hero(#D8CFB8). (2) 풀스크린 CSS grid 게임 인터페이스 — top PresidentialStatusBar(임기 진행바 + 5종 metric + gold advance button) / left LayerControlRail(10개 토글 + 자체 제작 SVG 아이콘 + hover 슬라이드 툴팁) / center MapViewport(vignette + 미세 그리드 + corner crosshair) / right RegionInspectorPanel(빈 상태 + region 전용 + POI 전용 3 variant + DataBar + MetricBadge + chips + 섹션 위계) / bottom TimelineStrip(60턴 4 phase + 진행 cursor + 연도 마커). (3) UI 프리미티브 — GameGlassPanel(L자 corner glyph) / DataBar(linear-gradient fill) / MetricBadge(delta tone). (4) 지도 자체 — 한국 외곽 골드 halo glow(SVG filter) + selected region gold drop-shadow glow + 5종 한국 lng/lat 좌표 정확. (5) POI 마커 — 육각형 셸 + 한자 글리프(政立司公商港學) + 카테고리 색 + crisis pulse ring + importance dashed ring(★5) + 상태 닷. (6) 위기 — radial gradient bleed + 중간 dashed ring + 코어 dot. (7) 옛 컴포넌트 7개 + CSS 3개 삭제, 신규 11개 + CSS 10개. CSS gzip 3KB→7KB, JS gzip 70KB→73KB."
  },
  {
   "type": "이슈",
   "title": "Codex 1차 검수 — 렉 + 대시보드 톤 진단 (2026-05-26)",
   "desc": "Codex 검수 결과 두 가지 핵심 문제 진단: (1) SVG <g transform>에 80ms transition 누적 + Zustand 매 wheel/drag tick마다 전역 갱신 → 입력 누적 시 카메라 밀림 + 전체 앱 재렌더. (2) CSS grid hard-split(status/rail/map/inspector/timeline)이 「게임 위 HUD」가 아니라 「지도 옆 대시보드」로 보임. 처방: Three.js Ortho 2.5D + ref/RAF damped camera + Zustand commit은 idle/zoomLevel 변경 시점만 + full-bleed stage + floating HUD overlay. mojibake 의심 mock data는 콘솔 cp949 표시 문제일 뿐, UTF-8 정상 확인."
  },
  {
   "type": "핵심",
   "title": "KGS-MAP-2 — Three.js 2.5D + Floating HUD (2026-05-26)",
   "desc": "Codex 처방 전면 반영. (1) Three.js Orthographic Camera + ref/RAF damped CameraController — wheel/drag가 React state 우회, ref만 갱신, zoom level 변경 + 220ms idle 시점에만 Zustand commit. CSS transition 0건. (2) world 단일 ShapeGeometry mesh + Korea 17개 개별 mesh(raycast용) + POI 카테고리별 InstancedMesh 7개. pixelRatio Math.min(devicePixelRatio, 1.5) 제한. (3) Picker(raycaster) — InstancedMesh instance scale ≥ 0.01 검증으로 hidden POI 제외. 클릭 vs 드래그 5px threshold. (4) HUD 전면 재구성 — .stage-root full-bleed inset 0 + 5개 HUD overlay absolute (top status / left floating rail / right glass drawer / bottom compact dock / corner zoom + legend). CSS grid 폐기, layout.css 삭제. (5) hud-panels.css — backdrop-filter blur(16-18px) saturate(140-150%) glass + 1px border-gold. (6) 한국 cream(#D8CFB8) vs 외부 dark(#161B26) 명도 대비. selected region gold outline + 약한 raise(z) 애니메이션. (7) 옛 SVG 컴포넌트 10개 폐기, 신규 14개. JS gzip 73KB→209KB(+136 three core)."
  },
  {
   "type": "이슈",
   "title": "Codex 검수 #1 — BLOCK: 검은 화면 (2026-05-26)",
   "desc": "Codex가 commit 6e5e3fa 헤드리스 검수 결과 BLOCK 판정. 빌드는 PASS, GeoJSON fetch 200, HUD 렌더 OK이지만 지도 캔버스가 검은 배경만. 진단: initial-state.ts의 computeInitialCamera()가 SVG translate offset(viewportW/2 - KOREA*scale = -10160, -5630)을 반환하는데, Three 전환 후 그 값이 OrthographicCamera.position에 그대로 사용됨. 실제 한국 geometry는 (1370, -760) — 화면 밖. LayerControlRail reset 버튼도 store만 갱신, 실 Three 카메라 미동기. headless screenshot으로 정확히 재현됨."
  },
  {
   "type": "핵심",
   "title": "KGS-MAP-2 fix: Three convention + reset bridge (2026-05-26)",
   "desc": "Codex 처방 즉시 반영. (1) initial-state.ts 재작성 — computeInitialCamera() 폐기, INITIAL_CAMERA_X=1370 / INITIAL_CAMERA_Y=-760 / INITIAL_CAMERA_SCALE=8 export. SVG translate 변환 코드 전면 삭제. (2) store.ts — resetCameraToKorea(viewportW, viewportH) → resetCameraToKorea() 인자 제거. cameraResetNonce 카운터 추가, reset 호출 시 ++. (3) ThreeMapStage.tsx — useGameStore.subscribe로 cameraResetNonce 변화 감지 → CameraController.resetToKorea() 호출. imperative bridge 완성. (4) LayerControlRail.tsx — resetCameraToKorea() 인자 제거. (5) Chrome headless 1600×1000 screenshot 검증 — 한국 본토 cream/ivory 정확 표시 + 외부 navy dim + HUD 5종 위치 정확 + 강원 ink-bleed 정확. internal/notes/kgs-map-2-fix-screenshot.png 첨부. (6) BLOCK 해소 → Codex 재검수 trigger 대기."
  },
  {
   "type": "이슈",
   "title": "Codex 검수 #2 — 디자인/아트디렉션 BLOCK (2026-05-26)",
   "desc": "Codex가 c3d99b4 재검수 결과 기능 PASS, 디자인 BLOCK. 진단: 첫 화면이 「검은 배경 위 작은 한국 + 큰 우측 패널」 = 게임 메인 아닌 대시보드. 한국이 화면 주인공 아님. 우측 inspector 너무 큼. 모바일 390 inspector가 지도 덮음. 색·재질 평평. 처방: 최종 1개 고정 X — 박사 비교 선택용 4 variant 동시 빌드. (A 상황실 / B 전략 테이블 / C 민심 펄스 / D 위기 대응) + 모바일 bottom-sheet. Codex 1순위 추천: B Strategic Map Table."
  },
  {
   "type": "핵심",
   "title": "KGS-ART-3: 4 Variant 시스템 (박사 비교 선택 대기) (2026-05-26)",
   "desc": "4개 디자인 후보 동시 구현. (1) variants/{types, manifests, useVariant}.ts + VariantSwitcher 좌하단 4-버튼 + URL ?variant= 동기화. (2) Three theme override per variant — colorsFromVariant + poiCategoryColorFromVariant. sceneSetup이 variant bgColor / initialZoom / cameraRotationX 옵션 받음. (3) 4 manifest: A situation(navy+ivory+gold zoom 11) / B table(wood+brass+ivory zoom 10.5 tilt -0.08rad) / C pulse(data dark+cyan+opinion-default-ON zoom 10) / D crisis(rust+khaki+amber zoom 9.5 alarm ring). (4) POI marker shape per variant: hex/circle/circle/rounded-square. (5) variants.css — body[data-variant=X] 토큰 override + variant별 inspector 폭(340-380px) + 모바일 ≤640px bottom-sheet + 가로 rail. (6) Chrome headless 12 screenshot 캡처 — 4×3 (1600×1000 / 1366×768 / 390×844). internal/notes/screenshots/ 영속. (7) Claude 1순위 추천: B (Codex와 일치). 박사 결정 한 마디 대기."
  },
  {
   "type": "이슈",
   "title": "박사 + Codex #3 지시: 지도 디테일만 (HUD 금지) (2026-05-26)",
   "desc": "박사 명령: 「지도에 대한 디테일부터 잡고 들어가야만한다. 카툰 느낌의 3D로 아기자기한 대한민국 지형과 건물 등의 윤곽이 나타나도록」. Codex 영문 명세 전달: KGS-MAP-3 — Stylized 3D Korea Terrain + Zoom-Reveal Landmark Detail. 요구: ExtrudeGeometry province plate + bevel + 태백산맥 능선 + 내륙 언덕 + 도시 빌딩 클러스터 + 9 POI 미니어처 silhouette + zoom level별 reveal LOD + 카툰 머티리얼 + Lambert/directional light. 절대 금지: HUD 재디자인 / SVG 회귀 / 외부 타일 / postprocessing / decorative orb."
  },
  {
   "type": "핵심",
   "title": "KGS-MAP-3: 카툰 3D 미니어처 지도판 (2026-05-26)",
   "desc": "박사+Codex 명세 전면 반영. 7개 신규/수정 파일. (1) koreaLayer 입체화 — ShapeGeometry → ExtrudeGeometry depth 0.8 (제주 0.4) + bevel + top/side dual MeshLambertMaterial + 두꺼운 해안선 + 얇은 내부 경계. (2) terrainLayer 신규 — 태백/소백/차령/노령 4 산맥 ConeGeometry InstancedMesh ~60 + 내륙 14 hill SphereGeometry InstancedMesh (실제 위경도 spine 기반). (3) routeLayer 신규 — 4 도로 회랑(서울-부산/서울-인천/서울-춘천/대전-광주) + 한강 cyan curve + 8 도시 130 buildings InstancedMesh deterministic 시드. (4) landmarkLayer 신규 — 9 POI 각각 procedural 3D silhouette: 대통령실(dome+wing+gold marker) / 국회(반구) / 세종(blocks chain) / 부산항(pier+컨테이너+크레인 3개) / 인천공항(활주로 2개+터미널+관제탑) / 삼성수원(campus+chip blocks) / 현대울산(sheds 4) / KEPCO(송전탑 3) / 대덕(blocks+dome+antenna). (5) mapLod 신규 — zoom 3 silhouette / 4 terrain+route / 5 buildings / 6 landmarks. (6) cartoonMaterials 신규 — Lambert + ambient 0.65 + directional key 0.95 + fill 0.35. (7) ThreeMapStage 통합 + URL ?zoom/cx/cy override 검증용. 빌드 PASS 2.09s 220 modules JS gzip 219KB. Headless 5 screenshot 캡처 — zoom 4 미니어처 효과 분명. internal/notes/screenshots-map3/. 알려진 마이너: ortho 카메라 정사 시점이라 zoom 11 initial에서 plate 입체감 약함 (다음 슬라이스 카메라 살짝 기울이기 권장) / zoom 6 카메라 clamp 필요."
  },
  {
   "type": "핵심",
   "title": "Codex 메인 개발 인수 — 게임플레이 엔진 본격 구축 (2026-05-29)",
   "desc": "KGS handoff(9816287)로 Codex가 메인 개발 인수(Claude는 프론트엔드 별도). Phase 1 게임플레이 엔진 11커밋 — 정책 region 효과(economyIndex/infrastructureScore) 배선, 이벤트 만료를 다음 월 경계로, 국회 의석 점유율→통과확률 반영, 탄핵 리스크 월간 압력 경로, 부처 competence/loyalty·참모 능력치를 정책/위기 결과에 연결, 예산 회계연도 리셋, month 60 플레이 가능, 죽은 gameApi facade 제거. 월간 위기 생성 시스템 + 한국형 위기 템플릿 풀, 세이브/로드(박사 v1 승인) 추가. typecheck/build PASS, test:game 35/35."
  },
  {
   "type": "완료",
   "title": "Codex 검수 BLOCK → 위기 lifecycle 4건 해소 (2026-05-29)",
   "desc": "Codex 검수가 위기 생성이 엔진 월루프가 아닌 store에만 배선된 점 + contained/resolved 위기를 active로 오인하는 status-blind reader들을 BLOCK 지적. 후속 커밋(090e216)에서 canonical 월진행 + 활성위기 status 일관 + 2-step 정리 + 세이브 UI 검증(C1~C4)으로 해소. (Three.js 지도 NaN bounding-sphere 콘솔 경고 1건은 비치명적 — Codex 영역 후속 정리 대상.)"
  }
 ],
 "milestones": [
  {
   "date": "2026-05-26",
   "title": "설계 v0.1 — Map-first 정치 시뮬 명세 (20개 섹션)",
   "desc": "한지+슬레이트+단청 13색 + 인장 아이콘 + 6종 애니메이션 어휘 + 7단 줌 + 26 layer stack + 5 schema + 9 subagent harness + originality 14항 + Risks + M1~M10 일정."
  },
  {
   "date": "2026-05-26",
   "title": "구현 계획 v0.1 — M1~M11 마일스톤",
   "desc": "리포 구조 · 정적 지도 · 줌 · 행정구역 · POI · 스키마 · store · 패널 · 레이어 토글 · 정책 타게팅 · 테스트. 12주 추정 + newton/codex 트랙 분배."
  },
  {
   "date": "2026-05-26",
   "title": "M0 vertical slice — Vite + React + 33 파일",
   "desc": "설정 7 + 스키마 7 + mock 데이터 5 + state 2 + map components 9 + panels 2 + layers 1 + UI 1 + styles 3 + utils 2 + subagent review 1. tsc 0 에러, vite build 858ms, dev 부트 317ms."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "실 GeoJSON 전면 교체 — Natural Earth + southkorea-maps",
   "desc": "손코딩 mock 폴리곤 → 실 데이터. d3-geo Mercator projection 도입. 17 광역시도 진짜 경계 + 177국 진짜 형상 + POI 10개 실 위경도. 박사 지적 즉시 복구."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "Frontend Art Direction Rebuild — Presidential Situation Room",
   "desc": "박사 「visual quality not acceptable」 지적 즉시 복구. 한지 톤 폐기 → dark navy + 시안 + 골드 정부 톤. 풀스크린 5-영역 게임 그리드(top status + left rail + center map + right inspector + bottom timeline). 한국 cream hero + 골드 halo + 시안 selected glow. POI 육각형 셸 + 한자 글리프 + 펄스. 옛 컴포넌트 7개 폐기, 신규 11개 + CSS 10개 작성."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-MAP-2 — Three.js 2.5D + Floating HUD (Codex 처방 반영)",
   "desc": "박사 Codex 검수 패스. SVG → Three.js Ortho 전면 전환. ref/RAF damped camera로 React state 우회 → 렉 제거. CSS grid → full-bleed stage + glass HUD overlay → 게임 화면 일체감. World 단일 mesh + Korea 17개 mesh + POI InstancedMesh × 7 카테고리. Raycaster picking. 옛 SVG 10개 폐기."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-MAP-2 fix — Codex 검수 #1 BLOCK 해소",
   "desc": "SVG translate offset이 Three camera position에 누설되어 검은 화면 발생. Codex 진단 정확, 처방 즉시 반영. initial-state Three convention 재정의 + store cameraResetNonce + CameraController bridge subscribe. Chrome headless 1600×1000 검증 통과 — 한국 본토 정확 표시."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-ART-3 — 4 Visual Direction Candidates (박사 비교 선택)",
   "desc": "Codex 검수 #2 처방. 1개 고정 X — 4 variant 동시 빌드. A 상황실(navy+gold) / B 전략 테이블(wood+brass · Codex 1순위 추천) / C 민심 펄스(data+cyan opinion default ON) / D 위기 대응(rust+amber alarm ring). URL ?variant=switcher 좌하단. 모바일 bottom-sheet. Chrome headless 12 screenshot 캡처 영속. 박사 한 마디 발화로 1개 선택 + 나머지 폐기."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-MAP-3 — 카툰 3D 미니어처 지도판",
   "desc": "박사+Codex #3: 지도 디테일만. ExtrudeGeometry plate + 태백산맥 능선 + 한강 + 도시 빌딩 cluster + 9 POI 미니어처 silhouette + zoom 4/5/6 reveal LOD + Lambert+조명. zoom 4 screenshot에서 카툰 미니어처 효과 명확 확인."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-MAP-9/10/11 — Aerial map + Ground-Level (청와대만)",
   "desc": "Google-Earth 스타일 휠 줌 카메라(MapCameraRig). 박사 명시 승인 사이트만 ground-level view 진입 — 청와대 청기와 미니어처(prism+정원+wings). north-up 회전 X. block-scale 깊은 줌(distance 700→1.2). 모든 props 제거. URL ?descent/?cx/?cy/?ground=cheongwadae 검증."
  },
  {
   "isCore": true,
   "date": "2026-05-26",
   "title": "KGS-MAP-12 — Clean 2D Aerial + Ground-Level 3D 분리",
   "desc": "aerial 모드에서 청와대 3D building 강제 hide(우측 상단 GROUND-LEVEL VIEW 버튼만). 색 팔레트 자연 톤 — pale sage(#D8DCC4) + soft blue-gray + muted slate. ExtrudeGeometry depth 0.8→0.08 평면화. ground 모드 진입 시에만 입체."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-MAP-13 — 다국어 라벨 + 북한 + MDL",
   "desc": "CSS2DRenderer 라벨 layer. 6 locale(ko/en/ja/zh/es/pt). 17 시도 + 28 외부국가 + 25 서울 자치구 + 1 동 시드 + MDL 9-point APPROX. 박사 standing \"fake geographic data 금지\" 준수 — staged 완성도 README.md 영속화. LanguageSelector 우측 상단 토글 + URL ?lang=. fallback chain locale→en→ko→id. 8 screenshot."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "프로젝트 표시명 확정 — 2026 PRESIDENT KOREA",
   "desc": "박사 발화. 가칭 \"대한민국 60\" 폐기. 게임 헤더/title/README/tokens.css 주석/dashboard 카드 갱신. repo 폴더명·Git remote는 korea-gov-sim 그대로."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "Standing rule — ADDRESS & MAP PLACEMENT",
   "desc": "박사 standing. 모든 entity는 roadAddress + province + city + hubCluster(10-hub) 필수. lat/lng invent 금지 — 미보유 시 needGeocode=true + mapPlacementMode=address_based_cluster + coordinateStatus=not_generated. 동일 청사 공유 entity는 stacked/radial fan-out, overlap pins 금지. internal/notes/ADDRESS_MAP_PLACEMENT_RULE.md 영속화."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "Entity dataset 44 record 영속화 (박사 patch 직접 반영)",
   "desc": "박사 ADDRESS-INJECTED CORRECTION & EXPANSION PATCH 1·2. src/data/entities/ 신설 — types.ts + government.ts(19 중앙정부) + public-institutions.ts(25 공공기관) + registry.ts(KGS-CODEX-2 pattern 정합) + README.md + HUB_MAP.md. 좌표 0건 invent — 43건 needGeocode=true, 1건(NIS) secure_region. 14-hub primary axis."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-CODEX-1 — Codex map selection 복구",
   "desc": "Codex 직접 patch (commit 92670c9). picker=null 폐기 → 실제 Picker 인스턴스. picking.ts POILayer nullable. ground-level picking 차단. 첫 화면 ROK national(descentT 0.3). VariantSwitcher ?variants=1만 노출. 모바일 HUD 보정. CDP probe 검증 PASS."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-CODEX-2 — Codex 카메라 LOD 계약",
   "desc": "Codex 직접 patch (commit 4906880). CameraState에 descentT/detailLod/viewMode 추가, scale legacy. setCameraView() store action 신설. utils/zoom DEFAULT_KOREA_DESCENT_T + descentT↔scale/zoomLevel/detailLod 변환. data/labels/registry.ts + lodPolicy.ts 신설 — labelLayer 직접 import 폐기, registry 단일 진입. ZoomLevelBadge \"ZOOM 5 / PROVINCE / 30%\" detailLod 기반."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-MAP-14 — Codex entity building layer",
   "desc": "Codex 직접 patch (commit 0f33edc). 진단: entity dataset 44건 있는데 ThreeMapStage 연결 누락. hub-anchors.ts 신설(14-hub visual anchor, 좌표 invent 없이 address_based_cluster fallback). entityBuildingLayer.ts(490줄) 신설 — complexId/hub 기준 미니 청사 stacked/campus 렌더, S/A priority LOD threshold, ground-level hide. ThreeMapStage RAF에서 cameraRig.curT 기준 실시간 LOD. public_institution layer toggle 연결."
  },
  {
   "isCore": true,
   "date": "2026-05-31",
   "title": "취임 시네마틱 — 3D 카툰 실시간 컷신 (Claude, 이벤트 영상 PoC)",
   "desc": "박사 지시 「취임하는 이미지를 3D 카툰 느낌의 AI 시네마틱으로 구현해서 보여줘」. 게임 이벤트(취임·위기·선거 등)에 영상을 삽입하는 파이프라인의 첫 PoC로, 외부 AI 영상 모델 대신 결정론·자산0·동적 임베드가 가능한 Three.js 실시간 3D 카툰 컷신으로 구현. 청와대 톤 원형 무대 + 골드 카펫 + 연단(대통령 엠블럼·마이크) + 카툰 대통령 캐릭터(오른손 들어 취임 선서 제스처) + 휘날리는 태극기(canvas 태극·4괘 텍스처) + 환호하는 관중 실루엣 26 + 색종이 260 InstancedMesh + MeshToonMaterial 셀셰이딩 + 3점 조명+림라이트. 카메라는 와이드 오프닝→연단 3/4 돌리인(smoothstep 6s), 14s 루프, 시네마틱 레터박스+비네트, 상단 타이틀 「2026 · 대한민국 대통령 취임」 페이드인 + 선서 서브타이틀, 다시보기 버튼. 단일 self-contained HTML(three 0.160 importmap), Playwright headless 3컷 검증 콘솔 에러 0. claude/previews/inauguration-cinematic/. 추후 MP4 프리렌더 또는 실제 AI 클립으로 교체 가능. (게임 엔진=Codex 트랙 불변, 본 컷신은 Claude 프론트 자산.)"
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-MAP-15 — Codex 건물 inspector 연결 (게임 오브젝트화)",
   "desc": "Codex 직접 patch (commit 8bf55fa). 진단: #14에서 building이 scene에 보였지만 region/POI picker와 inspector contract에 미연결 → 장식처럼 보였음. entity-sites.ts 신설(44건을 complexId 또는 개별 site로 정규화 + label/priority/kind/기관목록 공유). entityBuildingLayer body/roof/window/trim/courtyard/shadow 디테일 보강 + hover/selected focus ring + 실제 mesh hit 우선(invisible hit padding fallback). picking.ts entitySite type 추가, building layer를 region/POI 앞단에 연결. ThreeMapStage hover cursor/tooltip/click selection/ESC clear/store subscription을 entity site까지 확장. HoverTooltip entity site tooltip(hub/기관수/priority/배치방식). RegionInspectorPanel entity site 전용 inspector(배치 계약/geocode 대기수/소속 기관/gameplay role/sector). schemas/map-state selection type에 entitySite 추가."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-NANO-2 — 최종 통합 지도 (외부 음영 + 북한·MDL + entity 데이터)",
   "desc": "박사 발화 \"최근에 만든 녹색 바탕 지도 느낌에다가 전세계 지도 어두운 색으로 대비 음영, 북한·군사분계선, 공공기관 데이터 넣어서 최종 완성\". NANO manifest worldLand 0xC8D89E→0x4A5C40 짙은 sage (한반도 라임과 강한 명도 대비). worldLayer clay early return 제거, 외부 land 정상 렌더(outline만 hide 유지). 박사 4요구 매트릭스: ✅ 녹색 라임 한반도 hero ✅ 전세계 외부 land 짙은 sage 음영 ✅ 북한 distinct + MDL 군사분계선 ✅ 44 entity record + 25 자치구 + 청와대 GROUND-LEVEL 버튼. screenshot: final-2-far-with-world (시야 멀리 한반도 + 외부 음영 + cloud), final-3-seoul-deep (Seoul 라임 + MDL + 중국 음영), final-5-seoul-buildings (25 자치구 + GROUND-LEVEL). 롤백 = ?variant=situation 또는 git checkout pre-nano-banana."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-NANO-1b — Nano Banana reference 정합 강화 (4영역)",
   "desc": "박사 발화: \"이미지 파일 예시용처럼 만들라니까? 그게 어려워?\" v1 약점 즉시 보강. commit afe571b. ① worldLayer clay 모드 early return → 외부 land 완전 hide (한반도 isolated). ② cloud scale 42~60→95~130 (2배 prominent) + LOD fade 임계 0.30/0.50→0.55/0.75 (더 오래 visible). ③ koreaLayer clay 모드 drop shadow plane 2단(메인+컨택, opacity 0.22/0.30). ④ halo line opacity 0 (부드러운 클레이는 outline 없음). 시도하고 롤백: koreaLayer.group.rotation.x=-0.22 (한반도 화면 밖 사라짐). 남은 약점: 카메라 정수직 두께 표현 / HUD 라이트 모드 / silhouette simplification."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-ENGINE-2 — Codex 게임 엔진 realtime clock hardening",
   "desc": "Codex 직접 patch (commit 19f1a41). src/game/tests/clock.test.ts 신규(105줄, 9 tests) — paused initial state, pause/resume, valid/invalid timeScale, paused tick blocking, forced tick, day advancement, daily/weekly/monthly/quarterly hooks, term finish, full 5-year accelerated simulation 검증. ScheduledUpdateSystem.ts weekly trigger deterministic 7-day interval 보정 (calendar rollover 아닌 누적 days). shared/validation.ts GameClockState 검증 범위 확장 — elapsedDays/remainingDays/termProgress + 5 last update dates. scripts/run-game-tests.mjs 신규 — esbuild + Node test runner. package.json npm run test:game 추가. 검증: 9/9 PASS + 5-year accelerated 완주 term_finished."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-NANO-1 — Gemini Nano Banana variant 신설 (롤백 안전망)",
   "desc": "박사 발화 \"지금 지도 모습으로 롤백할 수 있게 준비해놓고, 설계대로 만들어서 보여줘\". commit cd63af6 + tag pre-nano-banana(e1d891a) 롤백 baseline push. 신규 NANO manifest(5번째 variant): 라임 #A5C946 land / 청록 #9CD8E8 bg / 옅은 라임 외부 land / koreaEdgeWidth 0 / koreaTextureMode \"clay\". koreaLayer textureMode 분기 — clay 모드는 depth 0.55 + bevel 0.18 두꺼운 클레이, outline LineSegments / innerEdge 제거. worldLayer 외곽선 hide. cartoonMaterials setupCartoonLighting clay 분기 — ambient 0xE8F4F8 0.85, keyLight 0xFFF5DC 0.55 (soft sun), HemisphereLight 0xE8F4F8↔0xA5C946 추가. cloudLayer 신규(296줄) — 6개 미소 cloud sprite(canvas texture: 흰body+얼굴+pink cheek+smile), descentT < 0.30 visible / 0.30~0.50 fade / >0.50 invisible, gentle drift. 백엔드 영향 없음 — KGS-ENGINE / entity dataset 44건 / labelLayer / picker 모두 그대로 작동. 롤백 = ?variant=situation 또는 git reset --hard pre-nano-banana."
  },
  {
   "isCore": true,
   "date": "2026-05-27",
   "title": "KGS-ENGINE-1 — Codex 게임 엔진 backend foundation",
   "desc": "Codex 직접 patch (commit 4b81f0e). src/game/ 독립 엔진 계층 신설(1646 lines, 13 파일). core/GameState.ts: 2026 PRESIDENT KOREA Ground Truth 계약(대통령·clock·approval·economy·budget·media·liveFeed·cabinet·ministries·국회·judiciary·local governments·policies·events·crises·diplomacy·security·social metrics·election·notifications·schedule). core/GameInitializer.ts: createInitialGameState/cloneGameState/getGamePhase/isGameOver/migrateGameStateIfNeeded. core/GameClock.ts: pauseGame/resumeGame/setTimeScale/advanceClockByDays + term progress selectors. shared/* engine constants·types·utils·validation. selectors/* dashboard·map view-model. api/gameApi.ts in-memory facade(frontend 직접 engine state 조작 금지). 박사 standing: Phase 1은 UI 비침습 엔진 골격 — 정책 30개, 이벤트 40개, region/ministry dataset, full simulation loop는 후속 Phase."
  },
  {
   "type": "핵심",
   "title": "Nano Banana Korea — 전면 미학 전환 설계 + mockup 2종 (2026-05-27)",
   "desc": "박사 발화: \"지금 구현된 한반도 지도가 아닌, 이 느낌의 이미지대로 한반도 지도를 싸그리 뜯어 고쳐서 구현. 구현에는 박사 오더 전까지 실행하지마. 설계 진행한 다음에 결과물부터 보여줘.\" 박사 reference: Gemini Nano Banana 10 시야 한반도 (라임 #A5C946 + 청록 #5CB0CC + 미소 cloud + 클레이 토이). internal/notes/REDESIGN_NANO_BANANA.md 영속화 — 10 시야 분석, 현 구현 충돌 매트릭스, 결정 트리 A(variant 신설) / B(default 교체, 권장) / C(별도 mode), 변경 영향 영역, KGS-NANO-1~8 단계. sample-nano-1-national.html(한반도 클레이 3D + 4 미소 cloud) + sample-nano-10-street.html(isometric 카툰 도시 + ranch 집 + 강 + 다리). production 코드 미수정 (박사 standing 명시). 박사 결정 트리 발화 대기."
  },
  {
   "type": "완료",
   "title": "세션 종료 — Codex 핸드오프 영속화 (2026-05-27)",
   "desc": "박사 발화 \"멈추고 했던곳까지 저장, 코덱스가 확인할 수 있게 준비\". internal/notes/HANDOFF_TO_CODEX_2026-05-27.md 신설 — 현재 위치(KGS-NANO-3 HEAD, 박사 만족 미확인) / standing rules 8건 인덱스 / Vite+React+Three.js+Engine 스택 cheat-sheet / receipt 인덱스 / screenshots-map14 untracked dir 플래그 / 박사 결정 대기 4건(NANO-3 OK여부, nano default 여부, NANO-4~8 우선순위, ENGINE Phase 3) / 트랙 분리(engine=Codex, map=Claude) / 로컬 검증 명령. commit b800cb8 push. Codex가 git pull 한 번이면 컨텍스트 잡힘."
  },
  {
   "isCore": true,
   "date": "2026-05-28",
   "title": "KGS-ENGINE — 게임플레이 엔진 시스템군 (Codex)",
   "desc": "월간 이벤트 덱·국회 협상·부처/참모 friction·정책 region 효과·예산 회계연도 등 게임 시스템을 src/game 엔진 계층에 구축. 결정론 월루프 + dashboard/map selector + 검증/어댑터."
  },
  {
   "isCore": true,
   "date": "2026-05-29",
   "title": "Codex 메인 개발 인수 + 위기/세이브 + 테스트 35/35",
   "desc": "handoff 9816287로 Codex 메인 인수. 월간 위기 생성+한국형 템플릿, 세이브/로드, 탄핵 리스크, month 60 플레이 가능. Codex 검수 BLOCK 위기 lifecycle 4건 해소(090e216). test:game 35/35 PASS. 대시보드 VIEW LIVE 미리보기를 이 최신 빌드로 갱신(progress 1%→35%)."
  }
 ]
}];
window.STATUS={"completed":{"label":"완성","en":"Completed","dot":"bg-emerald-500","badge":"bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200","bar":"from-emerald-500 to-teal-400"},"in-progress":{"label":"진행 중","en":"In Progress","dot":"bg-amber-500","badge":"bg-amber-50 text-amber-700 ring-1 ring-amber-200","bar":"from-amber-500 to-orange-400"},"paused":{"label":"보류","en":"Paused","dot":"bg-violet-500","badge":"bg-violet-50 text-violet-700 ring-1 ring-violet-200","bar":"from-violet-500 to-fuchsia-400"}};
window.ITYPE={"완료":{"cls":"bg-emerald-50 text-emerald-700 ring-emerald-200","icon":"check-circle-2"},"이슈":{"cls":"bg-rose-50 text-rose-700 ring-rose-200","icon":"alert-circle"},"보류":{"cls":"bg-slate-100 text-slate-600 ring-slate-300","icon":"pause-circle"},"핵심":{"cls":"bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-100 text-fuchsia-700 ring-fuchsia-300","icon":"sparkles"}};
window.STACK_ATLAS={"categories":[{"key":"lang","label":"프로그래밍 언어"},{"key":"frontend","label":"프론트엔드 프레임워크·UI"},{"key":"graphics3d","label":"3D·그래픽·WebGL"},{"key":"maps","label":"지도·지리 GIS"},{"key":"state","label":"상태관리"},{"key":"animation","label":"애니메이션·모션"},{"key":"backend","label":"백엔드·서버"},{"key":"aiml","label":"AI·ML·데이터"},{"key":"build","label":"빌드·번들·패키지"},{"key":"testing","label":"테스트·품질"},{"key":"devops","label":"배포·인프라·CI/CD"},{"key":"assets","label":"폰트·아이콘·자산"}],"techs":[{"canonical":"HTML5","category":"lang","aliases":["HTML5"],"note":"웹 페이지 구조를 정의하는 마크업 언어. 정적 사이트·앱 화면의 골격을 작성한다."},{"canonical":"CSS3","category":"lang","aliases":["CSS3 (custom vars + Grid)","CSS3 (custom vars)","CSS3 (Grid)"],"note":"스타일시트 언어. 커스텀 변수와 Grid 레이아웃으로 디자인 토큰·반응형 화면을 구성한다."},{"canonical":"JavaScript","category":"lang","aliases":["JavaScript","Vanilla JS"],"note":"웹 표준 스크립트 언어. 프레임워크 없이 인터랙션·재생 로직·DOM 제어를 직접 구현한다."},{"canonical":"TypeScript","category":"lang","aliases":["TypeScript","TypeScript 5","TypeScript 6"],"note":"정적 타입을 더한 JavaScript 상위 언어. 데이터 스키마·컴포넌트를 타입 기반으로 안전하게 작성한다."},{"canonical":"Python","category":"lang","aliases":["Python 3.12"],"note":"범용 프로그래밍 언어. ML 백엔드 서버와 오디오 처리 파이프라인을 작성한다."},{"canonical":"GLSL","category":"lang","aliases":["GLSL"],"note":"OpenGL 셰이딩 언어. WebGL 셰이더에서 셀셰이딩·노이즈·프레넬 등 픽셀 단위 렌더링을 작성한다."},{"canonical":"React","category":"frontend","aliases":["React","React 18"],"note":"컴포넌트 기반 UI 라이브러리. 화면 전체를 선언적 컴포넌트로 구성한다."},{"canonical":"Next.js","category":"frontend","aliases":["Next.js"],"note":"React 기반 풀스택 프레임워크. 라우팅·SSR을 포함한 웹앱 골격을 구성한다."},{"canonical":"Tailwind CSS","category":"frontend","aliases":["Tailwind CSS","Tailwind"],"note":"유틸리티-퍼스트 CSS 프레임워크. 클래스 조합으로 레이아웃·스타일을 빠르게 구성한다."},{"canonical":"Three.js","category":"graphics3d","aliases":["Three.js","Three.js (R3F)"],"note":"WebGL 기반 3D 렌더링 라이브러리. 우주·지도·캐릭터 등 실시간 3D 씬을 그린다."},{"canonical":"WebGL","category":"graphics3d","aliases":["WebGL"],"note":"브라우저 GPU 그래픽 API. Three.js·셰이더가 화면을 하드웨어 가속으로 렌더링한다."},{"canonical":"HTML5 Canvas","category":"graphics3d","aliases":["HTML5 Canvas"],"note":"2D 픽셀 드로잉 API. 경기장 트래킹·태극기/조석 텍스처 등을 직접 그린다."},{"canonical":"@react-three/fiber","category":"graphics3d","aliases":["@react-three/fiber"],"note":"Three.js를 React 컴포넌트로 선언하는 렌더러. 3D 씬을 JSX로 구성한다."},{"canonical":"@react-three/drei","category":"graphics3d","aliases":["@react-three/drei"],"note":"react-three-fiber 헬퍼 모음. OrbitControls·Billboard·Environment 등 3D 유틸을 제공한다."},{"canonical":"earcut","category":"graphics3d","aliases":["earcut"],"note":"폴리곤 삼각분할 라이브러리. GeoJSON 영역을 3D 메시로 변환할 때 사용한다."},{"canonical":"troika-three-text","category":"graphics3d","aliases":["troika-three-text"],"note":"Three.js용 고품질 SDF 텍스트 렌더러. 3D 씬 안의 라벨·문자를 선명하게 표시한다."},{"canonical":"Leaflet","category":"maps","aliases":["Leaflet"],"note":"경량 인터랙티브 지도 라이브러리. 지도 위에 선박 마커를 실시간 렌더링한다."},{"canonical":"d3-geo","category":"maps","aliases":["d3-geo"],"note":"지리 투영·좌표 변환 라이브러리. GeoJSON을 화면 좌표(Mercator 등)로 투영한다."},{"canonical":"Natural Earth","category":"maps","aliases":["Natural Earth"],"note":"퍼블릭 도메인 세계 지리 데이터셋. 실제 대륙·국가 형상 GeoJSON을 제공한다."},{"canonical":"southkorea-maps","category":"maps","aliases":["southkorea-maps"],"note":"대한민국 행정구역 GeoJSON 데이터셋. 17개 광역시도 실 경계를 렌더링한다."},{"canonical":"Zustand","category":"state","aliases":["Zustand"],"note":"경량 전역 상태관리 라이브러리. 게임 엔진의 단일 Ground Truth 스토어를 구축한다."},{"canonical":"framer-motion","category":"animation","aliases":["framer-motion"],"note":"React 모션 라이브러리. 패널 슬라이드·스프링 트랜지션 등 UI 애니메이션을 구현한다."},{"canonical":"FastAPI","category":"backend","aliases":["FastAPI"],"note":"Python 비동기 웹 프레임워크. 업로드·추출 API 엔드포인트와 라우팅을 제공한다."},{"canonical":"Demucs","category":"aiml","aliases":["Demucs"],"note":"음원 분리 딥러닝 모델. 곡에서 보컬을 제거하고 반주 스템을 추출한다."},{"canonical":"PyTorch CUDA","category":"aiml","aliases":["PyTorch CUDA"],"note":"GPU 가속 딥러닝 프레임워크. Demucs 모델을 CUDA로 실행해 음원을 분리한다."},{"canonical":"EPTS 트래킹 데이터","category":"aiml","aliases":["EPTS 트래킹 데이터"],"note":"선수·공의 시계열 위치 추적 데이터 표준. 2D 매치 시각화의 입력 데이터로 쓴다."},{"canonical":"Vite","category":"build","aliases":["Vite"],"note":"빠른 프론트엔드 빌드·개발 서버. 번들링과 핫리로드 개발 환경을 제공한다."},{"canonical":"ES Modules (importmap)","category":"build","aliases":["ES Modules (importmap)"],"note":"브라우저 네이티브 모듈 로딩. importmap으로 CDN의 Three.js 등을 빌드 없이 로드한다."},{"canonical":"Node ESM 스크립트","category":"build","aliases":["Node ESM 스크립트"],"note":"Node.js ESM(.mjs) 스크립트. 외부 공식 소스에서 데이터를 수집·생성하는 파이프라인을 돌린다."},{"canonical":"Playwright","category":"testing","aliases":["Playwright"],"note":"헤드리스 브라우저 자동화·테스트 도구. 렌더 결과 스크린샷·콘솔 에러를 검증한다."},{"canonical":"Vercel","category":"devops","aliases":["Vercel"],"note":"프론트엔드 호스팅·배포 플랫폼. 웹앱을 노선별 버전으로 배포·운영한다."},{"canonical":"GitHub Pages","category":"devops","aliases":["GitHub Pages"],"note":"정적 사이트 호스팅 서비스. 단일 HTML/빌드 산출물을 무료로 배포한다."},{"canonical":"Pretendard","category":"assets","aliases":["Pretendard"],"note":"한글 웹폰트. 한국어·영문 병기 본문·타이틀 타이포그래피에 적용한다."},{"canonical":"SVG","category":"assets","aliases":["SVG"],"note":"벡터 그래픽 포맷. 히어로 일러스트·아이콘·필터 효과를 해상도 독립적으로 그린다."},{"canonical":"lucide-react","category":"assets","aliases":["lucide-react"],"note":"React용 오픈소스 아이콘 세트. 대시보드 UI의 시각 요소 아이콘을 제공한다."},{"canonical":"simple-icons","category":"assets","aliases":["simple-icons"],"note":"브랜드 로고 SVG 아이콘 모음. 기업 앰블럼 배지 텍스처로 활용한다."},{"canonical":"@fontsource","category":"assets","aliases":["@fontsource"],"note":"npm 기반 셀프호스트 폰트 패키지. Google Fonts 대신 Inter 등을 self-host한다."}],"unused":[{"key":"lang","label":"언어 (Programming Languages)","items":[{"name":"Rust","recommendation":"고성능 네이티브/WASM 계산. 3번 Solar의 케플러·N체 섭동 계산이나 8번 반도체의 대규모 노드 레이아웃·force-directed 연산을 Rust→wasm-bindgen으로 빼면 메인스레드 프레임드랍을 없앤다. 4번 INST의 오디오 DSP 전처리도 후보.","fitProjects":["Solar System Simulator","Knowledgeverse (반도체 유니버스)"]},{"name":"Go","recommendation":"동시성·실시간 데이터 수집 백엔드. 1번 AIS 실시간 위치 폴링/스트리밍 게이트웨이, 7번 Premarket의 FRED·ECOS·시세 멀티소스 수집기를 단일 바이너리로 상주. 현재 7번은 빌드타임 스크립트뿐이라 상시 수집 데몬으로 격상하기 좋다.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"SQL","recommendation":"구조화 데이터 영속화·집계. 1번 AIS 항적 이력, 7번 Premarket 시계열 시세, 2번 DDUIM 트래킹 프레임을 테이블로 적재하고 시간 윈도우 집계. 현재 전 프로젝트가 mock/static이라 DB 도입 시 1순위.","fitProjects":["US-KR Premarket Signal","AIS Ship Tracker","DDUIM"]},{"name":"WGSL (WebGPU Shading Language)","recommendation":"차세대 GPU 셰이더. 3번 Solar의 GLSL 셰이더 자산을 WebGPU/WGSL로 포팅하면 compute shader로 입자(카이퍼·트로이 2400×2) 시뮬을 GPU에서 직접. 8번 대량 노드 인스턴싱에도 유리.","fitProjects":["Solar System Simulator","Knowledgeverse (반도체 유니버스)"]},{"name":"Pandas / NumPy (데이터 분석)","recommendation":"데이터 분석 스택. 7번 Premarket의 매크로·테마 상관 분석, 2번 DDUIM 트래킹 통계(스프린트·점유율)를 Pandas/NumPy로. 4번 INST가 이미 Python 3.12라 분석 노트북 라인을 같은 생태계로 통일 가능. (GLSL·Python 자체는 이미 사용 중)","fitProjects":["US-KR Premarket Signal","DDUIM"]},{"name":"Swift / Kotlin","recommendation":"네이티브 모바일 앱. 1번 AIS를 현장 운영자용 iOS/Android 네이티브(백그라운드 위치·푸시)로, 3번 Solar를 ARKit/ARCore 천체 AR로. 웹 우선이면 React Native/Flutter가 더 현실적이라 보조 옵션.","fitProjects":["AIS Ship Tracker"]},{"name":"C++","recommendation":"초고성능 물리/렌더/DSP 코어. 단 3번 Solar는 importmap 단일 HTML 교육용이고 케플러를 이미 JS로 오차 0.22% 달성(WASM 불필요). 쓴다면 4번 INST의 DSP 병목(리샘플·STFT) 한정 PoC로 좁히되, PyTorch가 이미 C++ 커널을 쓰므로 torch.compile/ONNX 최적화가 먼저. (우선순위 최하)","fitProjects":["INST Extractor"]},{"name":"C# / .NET","recommendation":"본격 게임/시뮬 확장 시 .NET·Unity 옵션이나 디렉터의 웹 릴레이 워크플로와 충돌해 적합도 낮음. 5번 PRESIDENT는 이미 Vite+React+Zustand 결정론 월루프(테스트 35/35)로 잘 도므로, C#보다 \"엔진 로직을 순수 TS 모듈로 두고 Web Worker로 분리해 메인스레드 프레임 보호\"가 같은 목표를 웹 안에서 달성하는 현실적 대안. (우선순위 최하)","fitProjects":["2026 PRESIDENT KOREA"]}]},{"key":"frontend","label":"프론트엔드 프레임워크·UI","items":[{"name":"Svelte / SvelteKit","recommendation":"가벼운 정적·콘텐츠 사이트. 6번 JP Global(현재 Vanilla JS)을 SvelteKit으로 재구축하면 번들이 작고 트랜지션 내장이라 디자인 톤 실험에 적합. 보일러플레이트가 적어 1인 워크플로에 효율적.","fitProjects":["Frontend & Tone Atelier (JP Global)"]},{"name":"Astro","recommendation":"콘텐츠 중심 정적 + Islands. 6번 JP Global과 이 대시보드 자체(보고서/포트폴리오)를 Astro로 만들면 기본 0-JS로 빠르고 필요한 위젯만 React island로. 8개 프로젝트 쇼케이스 허브에 이상적.","fitProjects":["Frontend & Tone Atelier (JP Global)"]},{"name":"shadcn/ui + Radix UI","recommendation":"접근성 갖춘 헤드리스 컴포넌트. 5·7·8번의 패널·다이얼로그·드로어·툴팁을 Radix 기반 shadcn으로 표준화하면 직접 만든 인터랙션 UI의 접근성·키보드 내비를 한 번에 확보. Tailwind를 이미 써 궁합 최상.","fitProjects":["2026 PRESIDENT KOREA","Knowledgeverse (반도체 유니버스)","US-KR Premarket Signal"]},{"name":"Vue 3 / Nuxt","recommendation":"대안 SPA/SSR. 신규 대시보드형 프로젝트에서 React 비교 실험용. 7번 Premarket을 Nuxt SSR로 만들면 SEO·초기 로딩 개선. (React 자산이 많아 신규 라인 한정)","fitProjects":["US-KR Premarket Signal"]},{"name":"Next.js App Router (RSC/SSR 본격)","recommendation":"1번 AIS는 이미 Next.js지만 단순 CSR 수준. App Router의 Server Components·Route Handler·streaming으로 선박 데이터 서버 패칭·SEO·엣지 캐싱까지 한 프레임워크로. 7번을 Next로 옮기면 수집 스크립트를 Route Handler로 흡수.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]}]},{"key":"graphics3d","label":"3D·그래픽·WebGL/WebGPU","items":[{"name":"WebGPU (WebGPURenderer)","recommendation":"Three.js 차세대 렌더 백엔드. 3번 Solar의 입자계(카이퍼·오르트·트로이)와 8번 반도체의 대량 노드/엣지를 compute shader로 가속. Three.js를 이미 써 WebGPURenderer 전환만으로 미래 대비.","fitProjects":["Solar System Simulator","Knowledgeverse (반도체 유니버스)"]},{"name":"Three.js 후처리 (postprocessing / EffectComposer)","recommendation":"후처리 파이프라인. 3·5·8번 3D 씬에 SMAA/FXAA 안티앨리어싱 + 톤매핑 + 절제된 약한 Bloom(임계값 가드)을 적용. 단 8번에서 Bloom 과다로 제거한 이력이 있으니 과다 글로우 금지 — 3번 Solar 태양/블랙홀 글로우를 통제된 후처리로 대체하는 수준.","fitProjects":["Solar System Simulator","Knowledgeverse (반도체 유니버스)"]},{"name":"Babylon.js","recommendation":"기능 풍부한 대안 3D 엔진. 5번 PRESIDENT의 3D 시네마틱이나 신규 인터랙티브 시뮬을 Babylon으로 시도하면 내장 GUI·물리·노드 머티리얼 에디터 활용. (Three.js 자산이 많아 신규 실험 한정)","fitProjects":["2026 PRESIDENT KOREA"]},{"name":"PixiJS","recommendation":"고성능 2D WebGL 렌더러. 2번 DDUIM의 2D 매치 트래커(현재 Canvas 2D)를 PixiJS로 옮기면 선수22+공+잔상 다수를 WebGL 가속으로 25Hz 부드럽게·줌·히트맵. 1번 AIS 다중 마커에도.","fitProjects":["DDUIM","AIS Ship Tracker"]},{"name":"Cesium / CesiumJS","recommendation":"사실적 3D 지구본 GIS. 1번 AIS를 진짜 3D 글로브(지형·해양·시간축)로, 8번 반도체 글로벌 공급망 지구를 실측 지구본으로. 위경도를 이미 다뤄 데이터 호환성 높음.","fitProjects":["AIS Ship Tracker","Knowledgeverse (반도체 유니버스)"]},{"name":"deck.gl","recommendation":"대규모 지오데이터 GPU 시각화. 1번 AIS 수백~수천 척을 ScatterplotLayer/TripsLayer로, 8번 공급망 흐름을 ArcLayer로 그리면 수동 구현보다 성능·인터랙션 우수. MapLibre/Mapbox 위에 얹는 구조.","fitProjects":["AIS Ship Tracker","Knowledgeverse (반도체 유니버스)"]},{"name":"Blender","recommendation":"3D 에셋 제작 파이프라인. 3번 Solar의 탐사선 모델을 코드 프리미티브 대신 Blender→glTF로 만들면 디테일 비약. 5번 PRESIDENT 3D 카툰 시네마틱의 캐릭터·소품 제작에도 직결.","fitProjects":["Solar System Simulator","2026 PRESIDENT KOREA"]},{"name":"Spline","recommendation":"노코드 3D 디자인 툴. 6번 JP Global 히어로 3D 오브제나 이 대시보드 랜딩의 인터랙티브 3D 데코를 코드 없이 빠르게 임베드. 디자인 톤 실험 성격과 맞음.","fitProjects":["Frontend & Tone Atelier (JP Global)"]}]},{"key":"dataviz","label":"데이터 시각화·차트","items":[{"name":"D3.js (full: scale·shape·force)","recommendation":"현재 d3-geo만 사용. 7번 Premarket 시세 라인·캔들·히트맵을 d3-scale/shape로, 8번 지식 그래프 평면 뷰를 d3-force로 그리면 풀 D3 역량 확보. 2번 DDUIM 궤적·점유율 차트에도.","fitProjects":["US-KR Premarket Signal","Knowledgeverse (반도체 유니버스)","DDUIM"]},{"name":"ECharts","recommendation":"고밀도 인터랙티브 차트. 7번 Premarket의 매크로/테마 히트맵·캔들·줌·브러시를 즉시 풍부하게. 2번 DDUIM 선수별 통계 대시보드에도. mock UI를 실제 분석 대시보드로 끌어올리는 핵심.","fitProjects":["US-KR Premarket Signal","DDUIM"]},{"name":"Recharts","recommendation":"React 친화 선언형 차트. 7번 Premarket(React 18) 패널에 가장 빠르게 차트를 꽂는 옵션 — OvernightMacro·Theme Heatmap을 실데이터화. shadcn 차트 프리셋과 호환.","fitProjects":["US-KR Premarket Signal"]},{"name":"visx (airbnb)","recommendation":"D3 + React 저수준 빌딩블록. 7번·8번에서 완전 커스텀 차트/그래프가 필요할 때 D3 수학과 React 렌더를 깔끔히 결합. Recharts로 부족한 맞춤 시각화에 단계적 도입.","fitProjects":["US-KR Premarket Signal","Knowledgeverse (반도체 유니버스)"]},{"name":"Observable Plot","recommendation":"탐색적 분석용 간결 그래머. 7번 데이터 파이프라인 단계의 빠른 EDA·리포트 차트에 적합. 2번 DDUIM 트래킹 데이터 탐색에도 한 줄 차트로 유용.","fitProjects":["US-KR Premarket Signal","DDUIM"]}]},{"key":"maps","label":"지도·지리 GIS","items":[{"name":"MapLibre GL / Mapbox GL JS","recommendation":"벡터 타일 기반 GPU 지도. 1번 AIS의 Leaflet(래스터)을 MapLibre GL로 교체하면 부드러운 줌·회전·기울기·다크 베이스맵·실시간 선박 레이어. 오픈소스 MapLibre면 토큰 비용 0 — AIS 화면 격상 1순위.","fitProjects":["AIS Ship Tracker"]},{"name":"Turf.js","recommendation":"지오공간 연산. 1번 AIS에서 선박 간 거리·근접 경보(geofence)·항로 버퍼·교차 판정을 클라이언트에서. 위경도를 이미 다뤄 실시간 충돌/접근 알림 추가에 즉효.","fitProjects":["AIS Ship Tracker"]},{"name":"deck.gl + 지도 베이스","recommendation":"지도 위 대규모 데이터 레이어. 1번 AIS 선단 전체 항적(TripsLayer 애니메이션)과 밀집 마커를 MapLibre 베이스 위에 GPU로.","fitProjects":["AIS Ship Tracker"]},{"name":"OpenLayers","recommendation":"기능 방대한 오픈소스 지도 엔진. 1번 AIS에서 해상 차트(WMS/WMTS)·좌표계 변환·복잡 벡터 편집이 필요할 때 Leaflet 대안. 해도 오버레이가 중요하면 강점.","fitProjects":["AIS Ship Tracker"]},{"name":"Cesium 3D Tiles (글로브)","recommendation":"3D 지구본 GIS. 1번 AIS를 시간축 3D 글로브 항적 재생으로, 8번 공급망을 3D 지구 호(arc) 흐름으로, 5번 한반도 지도를 실측 지형 3D로.","fitProjects":["AIS Ship Tracker","Knowledgeverse (반도체 유니버스)"]}]},{"key":"state","label":"상태관리·데이터 패칭","items":[{"name":"TanStack Query (React Query)","recommendation":"서버 상태 캐싱·동기화. 1번 AIS 실시간 폴링, 7번 Premarket 시세/매크로 패칭에 도입하면 캐시·재시도·폴링·stale이 자동화. mock→실API 전환 시 1순위. (Zustand=클라이언트 상태, Query=서버 상태로 역할 분리)","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"Redux Toolkit","recommendation":"복잡한 결정론 상태·타임트래블. 5번 PRESIDENT 선거 시뮬 턴처럼 액션 로그·되돌리기·리플레이가 중요한 게임 엔진에 적합. 디버깅·추적성이 Zustand보다 강함.","fitProjects":["2026 PRESIDENT KOREA"]},{"name":"XState","recommendation":"상태 머신·시나리오 제어. 5번 게임 페이즈(유세→투표→개표→취임)와 3번 Solar의 시네마틱/투어 시퀀스를 명시적 FSM으로 모델링하면 엣지케이스가 줄고 흐름이 견고.","fitProjects":["2026 PRESIDENT KOREA","Solar System Simulator"]},{"name":"Jotai","recommendation":"원자 단위 상태관리. 5번이 Zustand 단일 스토어인데 지역·정책 파생 상태가 많아지면 Jotai 아톰으로 세분화해 리렌더 범위를 좁힘. 8번 선택/하이라이트 상태에도 가벼움.","fitProjects":["2026 PRESIDENT KOREA","Knowledgeverse (반도체 유니버스)"]},{"name":"SWR","recommendation":"경량 데이터 패칭 훅. 7번·1번에서 TanStack Query까지 무겁다 싶을 때 stale-while-revalidate만 가볍게. Next.js(1번)와 같은 Vercel 생태계라 궁합 좋음.","fitProjects":["US-KR Premarket Signal","AIS Ship Tracker"]}]},{"key":"animation","label":"애니메이션·모션","items":[{"name":"GSAP","recommendation":"고성능 타임라인 애니메이션. 6번 JP Global 스크롤 연출(ScrollTrigger)과 5번 취임 시네마틱의 정교한 카메라/UI 시퀀스를 프레임 단위로. framer-motion이 못 잡는 복잡 타임라인을 보완.","fitProjects":["Frontend & Tone Atelier (JP Global)","2026 PRESIDENT KOREA"]},{"name":"Lottie","recommendation":"AE 기반 벡터 애니메이션 재생. 6번 JP Global·이 대시보드의 마이크로 인터랙션/로딩/아이콘 모션을 디자이너 제작 그대로 가볍게. 3번 Solar 로딩 스피너 고급화에도.","fitProjects":["Frontend & Tone Atelier (JP Global)"]},{"name":"Motion One / Web Animations API","recommendation":"경량 네이티브 애니메이션. 6번 JP Global의 Vanilla JS 인터랙션을 의존성 거의 없이 부드럽게. framer-motion을 안 쓰는 바닐라 프로젝트의 표준 모션 도구.","fitProjects":["Frontend & Tone Atelier (JP Global)"]}]},{"key":"backend","label":"백엔드·서버","items":[{"name":"Node.js + Express / Fastify","recommendation":"범용 JS 백엔드. 1번 AIS 데이터 프록시/캐시 API, 7번 Premarket 시세 집계 API를 가볍게. 현재 7번은 빌드타임 스크립트뿐이라 런타임 API가 생기면 실시간 갱신 가능.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"Hono","recommendation":"엣지 우선 초경량 웹 프레임워크. 1번·7번 데이터 API를 Cloudflare Workers/Vercel Edge에 배포하면 글로벌 저지연. 번들이 작아 서버리스에 이상적이며 Cloudflare Workers와 직결.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"NestJS","recommendation":"구조화된 TS 백엔드. AIS·Premarket·DDUIM 데이터 API를 하나의 모듈러 백엔드로 통합 운영할 때. DI·모듈·가드 구조라 1인 운영에도 유지보수성 높음.","fitProjects":["US-KR Premarket Signal","AIS Ship Tracker"]},{"name":"Django / DRF","recommendation":"관리 기능 포함 풀 백엔드(Python). 4번 INST가 이미 Python — FastAPI 단일 엔드포인트를 넘어 사용자·작업 이력·결과 관리가 필요해지면 Django Admin 유용. 7번 분석 결과 영속화에도.","fitProjects":["INST Extractor","US-KR Premarket Signal"]}]},{"key":"aiml","label":"AI·ML·데이터","items":[{"name":"OpenCV","recommendation":"컴퓨터 비전. 2번 DDUIM 보류의 핵심 이유가 트래킹 데이터 수급 — OpenCV로 경기 영상에서 선수/공을 직접 검출·추적(호모그래피 좌표 변환)하면 유료 EPTS 없이 자체 트래킹 파이프라인을 만들 수 있다. 보류 해제의 열쇠.","fitProjects":["DDUIM"]},{"name":"Whisper (faster-whisper)","recommendation":"음성 인식(STT). 4번 INST에 보컬 분리 후 자동 가사 추출/자막을 추가하면 \"반주 추출 + 가사 싱크\"까지 한 툴로. 이미 Demucs·PyTorch CUDA를 써 GPU 자원 그대로 활용.","fitProjects":["INST Extractor"]},{"name":"Hugging Face Transformers","recommendation":"사전학습 모델 허브. 7번 Premarket에 뉴스/공시 감성분석·요약 모델을 붙여 매크로 시그널에 텍스트 신호 추가. 4번 INST(Python)와 통합해 오디오·텍스트 모델 실험 라인으로.","fitProjects":["US-KR Premarket Signal","INST Extractor"]},{"name":"TensorFlow.js / MediaPipe","recommendation":"브라우저 내 ML 추론. 2번 DDUIM에 MediaPipe pose/object detection으로 클라이언트 선수 추적, 5번 PRESIDENT에 간단 정책 예측 모델을 온디바이스로. 서버 없이 추론하는 경량 라인.","fitProjects":["DDUIM","2026 PRESIDENT KOREA"]},{"name":"ONNX Runtime (Web)","recommendation":"프레임워크 중립 모델 실행. 4번 INST 분리 모델이나 7번 예측 모델을 ONNX로 변환해 웹/엣지에서 일관 추론. PyTorch 모델을 배포 환경에 맞춰 최적화 실행하는 표준 런타임.","fitProjects":["INST Extractor","US-KR Premarket Signal"]},{"name":"LangChain / Vercel AI SDK","recommendation":"LLM 오케스트레이션. 8번 반도체에 \"자연어로 노드/관계 질문→그래프 하이라이트\"하는 RAG 비서를, 7번 Premarket에 매크로 자연어 브리핑을. 디렉터의 지식 시각화 컨셉과 LLM이 직결.","fitProjects":["Knowledgeverse (반도체 유니버스)","US-KR Premarket Signal"]},{"name":"text-to-video (Runway / Sora / Veo)","recommendation":"실사풍 AI 영상 생성. 단 5번 취임 시네마틱은 의도적으로 \"외부 AI 영상 대신 결정론·자산0·동적 Three.js 실시간 컷신\"으로 설계(2026-05-31)됐으므로 핵심 라인 아님 — 보조 인서트 컷으로만. 더 적합한 확장은 그 PoC를 이벤트별(취임·위기·선거) Three.js 컷신 템플릿화 + (용량 이슈 시) Playwright headless로 MP4 프리렌더. 생성영상은 라이선스·결정성·동적 주입 한계.","fitProjects":["2026 PRESIDENT KOREA"]}]},{"key":"database","label":"데이터베이스·스토리지","items":[{"name":"PostgreSQL","recommendation":"관계형 주력 DB. 1번 AIS 항적, 7번 Premarket 시계열, 2번 DDUIM 트래킹 프레임의 영속 저장소. PostGIS 확장이면 AIS 지리 쿼리(반경/항로)까지 한 DB에서. 전 프로젝트가 무DB라 도입 1순위.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal","DDUIM"]},{"name":"SQLite / libSQL (Turso)","recommendation":"파일 기반 경량 DB. 4번 INST 작업 이력·캐시(어떤 파일을 어떤 모델로), 7번 로컬 시세 스냅샷에 적합. 집 데스크탑 상주 서버(INST)와 궁합 좋고 별도 DB 서버 불필요.","fitProjects":["INST Extractor","US-KR Premarket Signal"]},{"name":"Supabase","recommendation":"Postgres + Auth + Realtime + Storage BaaS. 1번 AIS 실시간 위치를 Realtime 채널로, 5번 PRESIDENT 멀티플레이/리더보드, 인증이 필요한 모든 프로젝트 백엔드를 한 번에. 1인 디렉터에게 가성비 최고.","fitProjects":["AIS Ship Tracker","2026 PRESIDENT KOREA"]},{"name":"DuckDB","recommendation":"분석용 임베디드 OLAP. 7번 Premarket 대량 시세/매크로 집계·조인을 인메모리로 초고속(브라우저용 DuckDB-Wasm도). 2번 DDUIM 트래킹 통계 집계에도 분석 엔진으로.","fitProjects":["US-KR Premarket Signal","DDUIM"]},{"name":"Redis","recommendation":"인메모리 캐시·pub/sub. 1번 AIS 최신 위치 캐시와 실시간 fan-out, 7번 시세 캐시·레이트리밋에. 외부 API 호출을 줄이고 실시간 응답을 빠르게 하는 계층.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"Firebase","recommendation":"실시간 DB·인증·호스팅 BaaS(NoSQL). 단 디렉터 스택이 Postgres 친화·React/TS·정적호스팅이라 정합도는 Supabase가 더 높고 중복됨 — 클라우드 동기화가 실제 필요해질 때 Supabase 단일 선택 권장(2번 DDUIM은 보류, 5번 세이브/로드는 이미 로컬). 모바일 SDK가 강해 추후 네이티브 확장 시에만 고려.","fitProjects":["2026 PRESIDENT KOREA"]}]},{"key":"realtime","label":"실시간·통신","items":[{"name":"WebSocket","recommendation":"양방향 실시간 스트림. 1번 AIS 위치를 폴링 대신 WebSocket 푸시로 받으면 갱신 지연·트래픽이 크게 준다. 7번 프리마켓 실시간 틱에도 핵심. 현재 실시간이 폴링 추정이라 1순위 업그레이드.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"SSE (Server-Sent Events)","recommendation":"단방향 서버 푸시(경량). 7번 시세/매크로 업데이트나 4번 INST 처리 진행률 스트리밍처럼 서버→클라이언트 단방향이면 WebSocket보다 단순. HTTP 위라 프록시·배포가 쉬움.","fitProjects":["US-KR Premarket Signal","INST Extractor"]},{"name":"Socket.IO","recommendation":"재연결·룸 포함 실시간 레이어. 5번 PRESIDENT 멀티플레이 룸이나 2번 DDUIM 재생 동기 관전(여러 명이 같은 타임라인)에. 끊김 복원·폴백 내장으로 운영 안정성 높음.","fitProjects":["2026 PRESIDENT KOREA","DDUIM"]},{"name":"WebRTC","recommendation":"P2P 미디어·데이터 채널. 2번 DDUIM 영상 분석용 라이브 영상 송수신이나 5번 저지연 멀티플레이 데이터 채널에. 서버 부하 없이 직접 연결이 필요한 시나리오.","fitProjects":["DDUIM","2026 PRESIDENT KOREA"]}]},{"key":"mobile","label":"모바일·크로스플랫폼","items":[{"name":"React Native + Expo","recommendation":"React 자산 재사용 네이티브 앱. 1번 AIS를 현장 운영자용 모바일(백그라운드 위치·푸시)로 내는 데 최적 — React/TS를 이미 써 학습비용 최저. Expo로 빌드·배포 간소화.","fitProjects":["AIS Ship Tracker"]},{"name":"Capacitor / PWA","recommendation":"웹앱을 앱처럼 래핑. 기존 웹 자산(2번 DDUIM, 7번 Premarket, 이 대시보드)을 코드 거의 그대로 설치형 PWA/앱스토어 앱으로. 가장 적은 노력으로 모바일 배포를 얻는 현실적 1순위.","fitProjects":["DDUIM","US-KR Premarket Signal"]},{"name":"Tauri","recommendation":"경량 데스크탑 앱(Rust+웹). 4번 INST 추출기를 로컬 GPU 서버 없이 설치형 데스크탑 앱으로 패키징(Electron보다 가볍고 빠름). 집 데스크탑 상주 구조를 일반 사용자용 앱으로 배포할 때.","fitProjects":["INST Extractor"]},{"name":"Flutter","recommendation":"단일 코드 고성능 크로스플랫폼. 3번 Solar 모바일 천체 앱이나 5번 PRESIDENT 모바일 게임처럼 부드러운 커스텀 UI/애니메이션이 중요할 때. 웹과 별개 네이티브 라인을 팔 경우 후보.","fitProjects":["Solar System Simulator","2026 PRESIDENT KOREA"]}]},{"key":"build","label":"빌드·번들·런타임·패키지","items":[{"name":"pnpm + 모노레포 workspace","recommendation":"디스크 효율·엄격한 의존성 + 워크스페이스. Vite/React 프로젝트가 다수(5·7·8)이고 공유 UI·타입이 생기면 pnpm workspace로 모노레포화해 중복 설치 제거·일괄 빌드. 멀티프로젝트 구조에 최적.","fitProjects":["Knowledgeverse (반도체 유니버스)","US-KR Premarket Signal","2026 PRESIDENT KOREA"]},{"name":"Vite (바닐라 프로젝트로 확대)","recommendation":"3번 Solar(importmap+CDN, 빌드 없음)·6번 JP Global(Vanilla, 빌드 없음)에 Vite를 도입해 CDN importmap 의존(런타임 외부호출)을 self-host 번들로 전환. 8번에서 @fontsource self-host로 런타임 외부호출 0을 만든 선례와 동일 방향.","fitProjects":["Solar System Simulator","Frontend & Tone Atelier (JP Global)"]},{"name":"Bun","recommendation":"올인원 초고속 런타임·패키지매니저·번들러. 7번 Premarket의 Node ESM 데이터 스크립트를 Bun으로 돌리면 실행·설치가 크게 빨라지고 신규 백엔드(Hono 등) 런타임으로도. 1인 반복 속도 향상.","fitProjects":["US-KR Premarket Signal"]},{"name":"Turborepo","recommendation":"모노레포 빌드 캐시·태스크 오케스트레이션. pnpm workspace와 함께 8개 프로젝트를 한 레포에서 증분 빌드·원격 캐시. 이 대시보드가 사실상 멀티프로젝트 허브이므로 빌드 파이프라인 통합에 직결.","fitProjects":["Knowledgeverse (반도체 유니버스)","US-KR Premarket Signal"]},{"name":"Deno","recommendation":"보안·TS 네이티브 런타임. 7번 외부 API 수집 스크립트를 권한 명시적 Deno로 실행하면 안전성이 높고 의존성 관리가 간결. Deno Deploy 엣지 배포와도 연결.","fitProjects":["US-KR Premarket Signal"]}]},{"key":"testing","label":"테스트·품질","items":[{"name":"Vitest","recommendation":"Vite 네이티브 단위 테스트. 5번 PRESIDENT의 Zustand 게임 엔진(민심·예산·위기 로직)과 3번 Solar 케플러 계산처럼 결정론 순수 함수에 단위 테스트를 붙이면 회귀 방지. Vite를 이미 써 설정이 거의 없음.","fitProjects":["2026 PRESIDENT KOREA","Solar System Simulator"]},{"name":"Testing Library (React)","recommendation":"컴포넌트 동작 테스트. 7번·8번의 React 패널/인터랙션을 사용자 관점으로 테스트. Vitest와 결합해 UI 회귀를 잡는 표준 조합.","fitProjects":["US-KR Premarket Signal","Knowledgeverse (반도체 유니버스)"]},{"name":"Storybook","recommendation":"컴포넌트 카탈로그·시각 문서. 6번 JP Global의 디자인 톤 실험과 8·7번 UI 컴포넌트를 격리 환경에서 variant·톤별로 비교. 디렉터의 \"톤 실험\" 성격과 정확히 맞고 시각 회귀 테스트로도 확장.","fitProjects":["Frontend & Tone Atelier (JP Global)","Knowledgeverse (반도체 유니버스)"]},{"name":"ESLint + Prettier / Biome","recommendation":"정적 분석·포맷 표준화. 8개 프로젝트 코드 스타일 통일. 특히 Biome는 ESLint+Prettier를 단일 고속 도구로 대체해 1인 멀티프로젝트 유지보수 부담을 줄임. 6번 Vanilla JS·신규 프로젝트 품질 기준선.","fitProjects":["Frontend & Tone Atelier (JP Global)"]}]},{"key":"devops","label":"배포·인프라·CI/CD","items":[{"name":"GitHub Actions (CI/CD)","recommendation":"자동 빌드·테스트·배포. 가장 직접적 적용: ① 이 대시보드의 미리보기 빌드(dist→previews/) 자동 동기화 ② 7번 Premarket refresh-data.mjs(FRED·ECOS)를 일일 cron 자동 갱신 ③ lint·typecheck·build·Playwright 시각 회귀 게이트 + 자동 커밋·푸시. 디렉터의 \"AI 릴레이 후 자동 커밋·푸시·배포\" 루틴을 파이프라인화.","fitProjects":["US-KR Premarket Signal","Solar System Simulator","DDUIM"]},{"name":"Docker","recommendation":"환경 재현·컨테이너 배포. 4번 INST의 Python 3.12 + PyTorch CUDA 환경을 Docker로 고정하면 다른 머신/서버에서도 동일 GPU 추론 재현. 신규 백엔드(Express/NestJS/Go) 표준 배포 단위로도.","fitProjects":["INST Extractor"]},{"name":"Cloudflare Workers / Pages","recommendation":"엣지 서버리스 + 정적 호스팅. 1번·7번 데이터 프록시 API를 Workers로 글로벌 저지연 배포하고 Pages로 프론트 호스팅. Hono와 결합하면 비용 거의 0의 풀 엣지 스택.","fitProjects":["AIS Ship Tracker","US-KR Premarket Signal"]},{"name":"Fly.io / Railway / Render","recommendation":"상시 컨테이너 호스팅. 4번 INST의 GPU 서버나 신규 Node/Python 백엔드를 집 데스크탑 의존 없이 클라우드 상주. WebSocket 같은 장기 연결 서버 호스팅에 GitHub Pages/Vercel보다 적합.","fitProjects":["INST Extractor","AIS Ship Tracker"]},{"name":"Sentry","recommendation":"런타임 에러·성능 모니터링. 3번 Solar처럼 복잡한 셰이더/런타임의 TDZ·WebGL 에러(실제 디버깅 이력 있음)를 배포 환경에서 자동 수집. 1인 운영에서 사용자 측 오류를 놓치지 않게.","fitProjects":["Solar System Simulator","2026 PRESIDENT KOREA"]}]},{"key":"gamedev","label":"게임엔진·인터랙티브","items":[{"name":"Phaser","recommendation":"2D 웹 게임 프레임워크. 5번 PRESIDENT의 미니게임(유세·토론 이벤트)이나 2번 DDUIM을 인터랙티브 전술 보드로 확장할 때. 입력·씬·물리·스프라이트 내장으로 Canvas 수작업보다 빠른 게임화.","fitProjects":["2026 PRESIDENT KOREA","DDUIM"]},{"name":"Godot (웹 export)","recommendation":"오픈소스 게임엔진. 5번 PRESIDENT를 본격 정치 시뮬 게임으로 키울 때 씬·노드·GDScript로 로직을 구조화하고 HTML5로 export. 웹 배포 워크플로를 유지하며 게임 깊이 확보.","fitProjects":["2026 PRESIDENT KOREA"]},{"name":"Rapier (물리엔진, Rust/WASM)","recommendation":"고성능 물리 시뮬. 5번 PRESIDENT 인터랙션이나 3번 Solar에 충돌/물리 효과를 추가할 때 R3F와 결합(@react-three/rapier). WASM 기반이라 성능이 좋고 Rust 도입과 시너지.","fitProjects":["2026 PRESIDENT KOREA","Solar System Simulator"]}]},{"key":"audio","label":"오디오","items":[{"name":"Web Audio API","recommendation":"브라우저 오디오 처리·분석. 4번 INST에 분리 결과를 브라우저에서 실시간 재생·믹싱·파형/스펙트럼 시각화로 결과 확인 UX 강화. 3번 Solar·5번 PRESIDENT의 인터랙션 사운드/앰비언트에도. (현재 4번 오디오 처리는 전부 서버측이라 브라우저 Web Audio는 미사용)","fitProjects":["INST Extractor","Solar System Simulator","2026 PRESIDENT KOREA"]},{"name":"Tone.js","recommendation":"음악적 오디오 프레임워크. 4번 INST에서 추출한 반주에 메트로놈·키/템포 조절·간단 시퀀싱을 얹어 \"반주 활용\" 기능으로. Web Audio 위 음악 추상화라 노래방/연습 도구로 발전 가능.","fitProjects":["INST Extractor"]},{"name":"WaveSurfer.js","recommendation":"파형 시각화·구간 편집 UI. 4번 INST 결과물(보컬/반주 스템)의 파형을 그려 구간 재생·비교·트리밍 UI를 빠르게. 오디오 툴 UX를 즉각 끌어올리는 실용 라이브러리.","fitProjects":["INST Extractor"]},{"name":"librosa (Python)","recommendation":"오디오 분석 라이브러리. 4번 INST(Python)에서 분리 전후 BPM·키·온셋·스펙트럼 분석으로 메타데이터를 풍부하게. Whisper 가사 추출과 결합하면 종합 음원 분석 백엔드가 된다.","fitProjects":["INST Extractor"]}]},{"key":"assets","label":"폰트·아이콘·자산","items":[{"name":"Iconify (15만+ 통합 아이콘)","recommendation":"여러 아이콘 세트를 단일 API로 온디맨드 로드. 8개 프로젝트가 제각각 아이콘 라이브러리를 쓰는 것을 Iconify로 통일해 번들·관리 부담을 줄임.","fitProjects":["US-KR Premarket Signal","Knowledgeverse (반도체 유니버스)"]},{"name":"glTF 압축 (DRACO / KTX2)","recommendation":"3D 에셋 최적화 파이프라인. 8·3·5번에서 Blender로 만든 glTF 모델을 DRACO(지오메트리)·KTX2(텍스처)로 압축해 로딩 가속. 3D 프로젝트 다수라 자산 최적화 표준으로.","fitProjects":["Knowledgeverse (반도체 유니버스)","Solar System Simulator"]},{"name":"Variable Fonts (Noto Sans KR 등)","recommendation":"가변 폰트 타이포 자산. 6번 JP Global의 한·일·영 다국어 톤 실험과 5번 UI에 굵기/폭을 동적 제어. Pretendard 외 가변폰트·서브셋팅으로 로딩과 표현력을 동시에.","fitProjects":["Frontend & Tone Atelier (JP Global)","2026 PRESIDENT KOREA"]}]}]};
