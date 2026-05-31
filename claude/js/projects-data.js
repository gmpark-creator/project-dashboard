/* PROJECT DATA — 보존: 원본 dashboard에서 추출, 한 글자도 안 바뀜.
   STATUS/ITYPE의 Tailwind 클래스는 더 이상 사용 안 함 (vanilla CSS 토큰으로 대체).
   원본 보존 목적상 그대로 둠. */

const PROJECTS = [
  {
    id: 'ais',
    name: 'AIS Ship Tracker',
    subtitle: '실시간 선박 위치 추적 웹 앱',
    icon: 'ship',
    platform: '웹 앱 · Vercel 배포',
    status: 'completed',
    start: '2025-09-15',          // ← 예시 날짜 (실제 값으로 수정)
    latest: '2025-12-20',         // ← 예시 날짜 (실제 값으로 수정)
    progress: 100,
    link: 'https://ais.vercel.co.kr/ops-main',
    preview: { type:'embed', items:[
      { url:'https://ais.vercel.co.kr/ops-main',       label:'ops-main — PEL · MAGE · OCEAN ACE' },
      { url:'https://ais.vercel.co.kr/kyowa-line-ops', label:'kyowa-line-ops — KYOWA LINE' }
    ]},
    summary: '관리 대상 선단의 선박들을 지도 위에 실시간으로 추적·표시하는 웹 앱. '
           + '운영 노선에 따라 두 가지 버전으로 배포돼 있다.',
    method: 'Next.js·React로 UI를 구성하고 Leaflet 지도 위에 선박을 마커로 렌더링한다. '
          + '선박 선택 시 MMSI·속도(SOG)·침로(COG)·항행 상태를 사이드바에 표시하며, '
          + 'Vercel에 두 노선 버전(ops-main / kyowa-line-ops)으로 배포했다.',
    stack: ['Next.js', 'React', 'TypeScript', 'Leaflet', 'Vercel'],
    stackDetail: [
      { area: '전체 UI 구성·화면 구조', tech: 'Next.js, React', how: 'Next.js와 React로 선박 추적 웹 앱의 UI를 구성한다. 지도와 사이드바를 포함한 화면 전체를 React 컴포넌트 기반으로 만든다.' },
      { area: '지도·선박 마커 렌더링', tech: 'Leaflet', how: 'Leaflet 지도 위에 관리 대상 선단의 선박들을 마커로 렌더링해 실시간 위치를 표시한다.' },
      { area: '선박 상세 정보 사이드바', tech: 'React, Leaflet', how: '선박 마커 선택 시 MMSI, 속도(SOG), 침로(COG), 항행 상태를 사이드바 패널에 표시한다.' },
      { area: '실시간 위치 자동 갱신', tech: 'React', how: '선박별 정보 패널과 함께 주기적으로 위치를 갱신해 지도상 선박을 실시간으로 추적한다.' },
      { area: '타입 안정성', tech: 'TypeScript', how: '선언 스택에 포함된 TypeScript로 선박 데이터 구조와 UI 컴포넌트를 타입 기반으로 작성한다.' },
      { area: '두 노선 버전 배포·운영', tech: 'Vercel, Next.js', how: 'ops-main(PEL·MAGE·OCEAN ACE 선단)과 kyowa-line-ops(KYOWA LINE) 두 노선 버전을 Vercel에 배포해 웹에서 운영한다.' },
    ],
    versions: [
      { name: 'ops-main', desc: 'PEL · MAGE · OCEAN ACE 선단 추적 — ais.vercel.co.kr/ops-main' },
      { name: 'kyowa-line-ops', desc: 'KYOWA LINE 선박 추적 — ais.vercel.co.kr/kyowa-line-ops' }
    ],
    issues: [
      { type:'완료', title:'지도 기반 실시간 선박 추적 구현', desc:'Leaflet 지도에 선박 마커·항행 정보를 실시간 표시.' },
      { type:'완료', title:'2개 노선 버전 Vercel 배포', desc:'ops-main / kyowa-line-ops 두 버전을 웹에 배포해 운영 중.' },
      { type:'이슈', title:'위치 데이터 소스 정식화 검토', desc:'추후 정식 서비스로 다듬을 경우 합법적 AIS 데이터 API 연동을 함께 검토 예정.' },
      { type:'이슈', title:'수정 작업엔 레포 접근 권한 필요', desc:'왕먀오 박사가 Vercel로 배포한 구조 — 코드 수정 시 연결된 GitHub 저장소 협업자 권한 확보가 선행되어야 함을 확인(2026-05-22).' }
    ],
    milestones: [
      { date:'2025-09-15', title:'프로젝트 시작', desc:'선단 선박 목록·데이터 구조 정의' },
      { date:'2025-10-10', title:'지도 + 선박 마커', desc:'Leaflet 지도에 선박 렌더링' },
      { date:'2025-11-15', title:'상세 사이드바 + 자동 갱신', desc:'선박별 정보 패널·주기적 위치 갱신' },
      { date:'2025-12-20', title:'2개 노선 버전 배포', desc:'ops-main / kyowa-line-ops Vercel 배포' }
    ]
  },
  {
    id: 'sports',
    name: 'DDUIM',
    subtitle: '뜀 — 스포츠 하이라이트 자동 생성 엔진 · 트래킹 데이터 기반 2D 매치 시각화',
    icon: 'trophy',
    platform: '웹 애플리케이션',
    status: 'paused',
    start: '2026-02-20',          // ← 예시 날짜 (실제 값으로 수정)
    latest: '2026-05-22',
    progress: 78,
    link: 'https://gmpark-creator.github.io/project-dashboard/match-tracker/',
    preview: { type:'embed', height:600, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/match-tracker/', label:'2D 매치 트래커' }
    ]},
    summary: '경기 종료 후 확보되는 선수·공의 시계열 위치 데이터를 2D 경기장 위에 재생하는 '
           + '매치 시뮬레이터. 이를 토대로 하이라이트 장면을 자동 추출하는 것이 최종 목표.',
    method: '웨어러블 센서(EPTS/GPS) 트래킹 데이터 — 선수 22명과 공의 시간대별 X·Y 좌표 — 를 '
          + '파싱해 HTML5 Canvas 경기장에 렌더링한다. AIS Ship Tracker가 선박 좌표를 지도에 '
          + '뿌린 것과 동일한 메커니즘이며, 재생·타임라인·선수별 분석 UI를 갖췄다.',
    stack: ['HTML5 Canvas', 'JavaScript', 'Tailwind CSS', 'EPTS 트래킹 데이터'],
    stackDetail: [
      { area: '2D 경기장 렌더링', tech: 'HTML5 Canvas', how: '선수 22명과 공의 시간대별 X·Y 좌표를 HTML5 Canvas 경기장 위에 점으로 렌더링한다. AIS Ship Tracker가 선박 좌표를 지도에 뿌리는 것과 동일한 메커니즘으로 위치 데이터를 시각화한다.' },
      { area: '트래킹 데이터 파싱·재생 로직', tech: 'JavaScript', how: 'EPTS·GPS 웨어러블 센서의 시계열 위치 데이터를 JavaScript로 파싱하고, 경기 장면을 시간 순으로 재생하는 재생 엔진과 타임라인 제어 로직을 구현한다.' },
      { area: '선수별 분석·인터랙션 UI', tech: 'JavaScript, HTML5 Canvas', how: '재생·타임라인·득점 마커 표시와 선수 클릭 시 개별 분석을 제공하는 인터랙션 UI를 Canvas 위 좌표 데이터와 JavaScript 이벤트 처리로 구성한다.' },
      { area: '화면 레이아웃·스타일링', tech: 'Tailwind CSS', how: '2D 매치 트래커 웹 애플리케이션의 화면 레이아웃과 UI 컴포넌트 스타일을 Tailwind CSS 유틸리티 클래스로 구성한다.' },
      { area: '실측 트래킹 데이터 연동', tech: 'EPTS 트래킹 데이터', how: 'Metrica Sports가 공개한 25Hz 광학 트래킹 실측 경기 데이터를 EPTS 형식으로 연동해, 재구성이 아닌 실제 선수·공 위치 데이터로 시뮬레이터를 구동한다.' },
    ],
    directorNote: {
      author: 'G.M.PARK',
      date: '2026-05-22',
      text: '본 프로젝트는 「실제 경기의 선수·공 위치 데이터를 확보해 2D로 재현한다」는 목표 아래 진행해 왔다. '
          + '기획 초기 자문(GPT) 단계에서는 경기 데이터 수집이 가능하다는 전제로 출발했고, 디렉터는 이 데이터 확보 문제의 해결을 요구했다. '
          + '그러나 실제 개발 단계에서 다음 장벽이 확인됐다 — 선수·공의 연속 광학 트래킹 데이터는 리그 공식 트래킹 업체가 '
          + '구단·방송사에 유료로만 판매하는 비공개 상업 데이터이며, 웹상에 공개돼 있지 않다. 따라서 무료·합법 경로로 확보 가능한 '
          + '연속 트래킹은 Metrica Sports가 연구용으로 공개한 익명 샘플 몇 경기(및 SkillCorner 공개 소수 경기)에 한정되며, '
          + '임의의 최신 경기를 경기 종료 직후 트래킹 데이터로 확보하는 것은 유료 라이선스 없이는 구조적으로 불가능함이 드러났다. '
          + '즉 초기 GPT 자문이 가능하다고 본 「데이터 수집」은 실제로는 Metrica 기본 샘플을 벗어나는 순간 성립하지 않는다. '
          + '이에 디렉터 판단으로, 데이터 수급 경로(유료 트래킹 라이선스 도입 또는 이벤트 데이터 기반 재설계)가 정해질 때까지 본 프로젝트의 개발을 잠정 보류한다.'
    },
    issues: [
      { type:'완료', title:'2D 매치 트래커 프로토타입 완성', desc:'트래킹 데이터를 2D 경기장에 시각화 — 재생·타임라인·득점 마커·선수 클릭 분석.' },
      { type:'완료', title:'데이터 기반 방식으로 방향 전환', desc:'영상 CV 추출 대신 웨어러블 위치 데이터 기반으로 전환 — 구현 난도·라이선스 부담 감소.' },
      { type:'완료', title:'실측 25Hz 광학 트래킹 적용', desc:'Metrica Sports 공개 실측 경기 데이터를 연동 — 재구성이 아닌 실제 트래킹. (임의 최신 경기의 연속 트래킹은 비공개 상업데이터)' },
      { type:'보류', title:'데이터 수급 장벽 — 개발 잠정 보류', desc:'임의 최신 경기의 선수 연속 광학 트래킹은 비공개 상업 데이터로 웹에 존재하지 않음. 무료·합법 확보 범위는 Metrica 기본 공개 샘플 몇 경기에 한정. 데이터 수급 경로 확정 시까지 디렉터 결정으로 보류.' }
    ],
    milestones: [
      { date:'2026-02-20', title:'프로젝트 시작', desc:'스포츠 하이라이트 엔진 컨셉 정의' },
      { date:'2026-04-22', title:'설계 수렴', desc:'데이터 기반 2D 점 시각화 방향으로 정리' },
      { date:'2026-05-22', title:'트래킹 데이터 방식 확정', desc:'영상 CV → 웨어러블/EPTS 위치 데이터 기반으로 전환' },
      { date:'2026-05-22', title:'2D 매치 트래커 프로토타입', desc:'경기장·재생·타임라인·선수 분석 UI 완성' },
      { date:'2026-05-22', title:'실측 트래킹 데이터 적용', desc:'Metrica Sports 공개 25Hz 광학 트래킹 — 실측 경기 데이터로 구동' },
      { date:'2026-05-22', title:'개발 잠정 보류 (디렉터 결정)', desc:'데이터 수급 장벽 확인 — 광학 트래킹 데이터 확보 경로 미정으로 개발 잠정 중단' }
    ]
  },
  {
    id: 'solar',
    name: 'Solar System Simulator',
    subtitle: '3D 실시간 태양계 시뮬레이터',
    icon: 'orbit',
    platform: '웹 애플리케이션',
    status: 'in-progress',
    start: '2026-05-21',
    latest: '2026-05-24',
    progress: 99,
    link: 'https://gmpark-creator.github.io/project-dashboard/solar-project-claude/?v=final',
    preview: { type:'embed', height:520, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/solar-project-claude/?v=final', label:'태양계 시뮬레이터' }
    ]},
    summary: '실제 시각을 기준으로 태양·8행성·달이 케플러 궤도력대로 움직이는 3D 시뮬레이터. '
           + '초기엔 Claude·Codex 듀얼 트랙으로 동일 설계를 독립 구현해 비교 공개했으나, '
           + 'WebGL/GLSL 셰이더·프론트엔드 비주얼 분야에서 Claude 결과물이 더 우수하다고 디렉터가 판단해 '
           + 'Claude 단일 설계·구현 체제로 일원화. Codex는 런타임 오류·TDZ 진단 등 디버깅 서포트 역할로 전환. '
           + '외태양계 영역(카이퍼·오르트)·외계 항성계·인터스텔라 영화 시스템·부산 실시간 달 위젯까지 확장.',
    method: 'Three.js + 커스텀 GLSL ShaderMaterial로 3D 우주를 렌더링하고, 케플러 궤도요소로 임의의 날짜로부터 '
          + '각 천체 위치를 수학적으로 역산한다. Step 1~4에 걸쳐 천체력 엔진 → 8행성 → 조석 계산 → 인터랙션·비주얼 순으로 '
          + '고도화. 협업 체제 전환 후 Claude는 메인 구현 라인(텍스처·셰이더·UI·인터랙션)을 담당하고, '
          + 'Codex는 정밀 코드 진단(예: 3단 TDZ 에러를 GPT가 정확히 짚어 Claude가 즉시 fix)으로 '
          + '문제 발생 시 보조 라인에서 빠른 해결 — AI 협업의 강점 분리·역할 분담 모델.',
    stack: ['HTML5', 'JavaScript', 'Three.js', 'WebGL', 'GitHub Pages'],
    stackDetail: [
      { area: '3D 우주 렌더링·카메라 조작', tech: 'Three.js, WebGL, JavaScript', how: 'WebGLRenderer(antialias·logarithmicDepthBuffer)로 씬을 그리고 PerspectiveCamera와 OrbitControls(드래그 회전·휠 줌·damping)로 시점을 조작한다. PointLight 태양빛 + PCFSoftShadowMap 그림자, AmbientLight를 함께 쓴다.' },
      { area: '날짜 기반 천체력 엔진(8행성·달)', tech: 'JavaScript', how: '케플러 궤도요소(2000.0 기준값과 1일당 변화율)로 임의 날짜의 각 천체 위치를 수학적으로 역산하고, 달은 섭동항 12개를 더해 정밀 계산한다. 공전주기를 실제값 대비 오차 최대 0.22퍼센트로 재현한다.' },
      { area: '행성·위성 표면 텍스처', tech: 'Three.js, JavaScript', how: '7행성에 NASA 출처 디퓨즈·범프 텍스처(jsDelivr threex.planets)를 TextureLoader로 적용하고 토성 고리도 실제 색 텍스처를 쓴다. 텍스처가 없는 가스행성·암석행성은 Canvas 2D로 띠·크레이터 패턴을 절차적으로 생성한다.' },
      { area: '지구·태양·위성 GLSL 셰이더', tech: 'Three.js, WebGL, GLSL', how: '태양은 ShaderMaterial로 fbm 노이즈 granulation·흑점·limb darkening을 실시간 렌더하고, 가스행성은 Fresnel 기반 atmospheric halo, 11개 위성은 CRATERED·VOLCANIC·ICY·HAZY 4종 절차적 ShaderMaterial로 고유 표면을 그린다. 지구는 normalMap·구름·야경 emissiveMap 레이어를 쓴다.' },
      { area: '인터스텔라·블랙홀 셰이더 시스템', tech: 'Three.js, WebGL, GLSL', how: '가르강튀아 강착원반은 커스텀 GLSL ShaderMaterial로 케플러 회전·fBm 플라즈마·도플러 빔잉·view-dependent UV warp을 표현하고, EHT(M87) 블랙홀과 웜홀도 각각 별도 ShaderMaterial로 photon ring·중력렌즈·별 분광형 분포를 렌더한다.' },
      { area: '조석·실시간 달 위젯 UI', tech: 'JavaScript, HTML5', how: '부산 기준 이론 평형조석을 천체 인력으로 계산해 물때·조석곡선을 Canvas 2D로 그리고, 달 위젯은 NASA moon 텍스처를 Canvas 2D globalCompositeOperation multiply로 합성해 위상별 그림자만 정확히 변화시킨다. 한국어 8단계 위상명과 조명률을 표시한다.' },
      { area: '인터랙션·라벨·탐사선 마커', tech: 'Three.js, JavaScript, HTML5', how: '천체를 클릭하면 raycaster로 선택해 사이드바에 정보를 띄우고 카메라를 트윈 추적한다. 이름표는 Sprite 빌보드, 탐사선(보이저·뉴호라이즌스·파커·JWST)은 Mesh 그룹과 LineDashedMaterial 항적으로 표시한다.' },
      { area: '배포·로딩', tech: 'GitHub Pages, HTML5', how: '단일 index.html을 GitHub Pages로 배포하고, importmap으로 jsDelivr CDN의 three.module.js와 OrbitControls를 ES module로 로드한다. CDN 텍스처를 받는 동안 로딩 스피너 화면을 표시한다.' },
    ],
    issues: [
      { type:'완료', title:'날짜 기반 천체력 엔진', desc:'8행성 공전주기를 실제값 대비 오차 최대 0.22%로 재현.' },
      { type:'완료', title:'지구–달 정밀 동기화 + 조석 계산', desc:'달 섭동항 12개 반영, 그 위에 조석(물때) 계산을 구축.' },
      { type:'완료', title:'AI 협업 체제 전환 — Claude 단일 구현 + Codex 디버깅 서포트', desc:'프로젝트 초기: Claude·Codex 듀얼 트랙으로 동일 설계 독립 구현 → /claude/ /codex/ 분리 배포. 진행 중 WebGL·GLSL 셰이더·프론트엔드 비주얼 분야에서 Claude 결과물이 더 우수하다고 디렉터가 판단 → Claude 단일 설계·구현 체제로 일원화. Codex는 런타임 오류 진단·TDZ 분석 등 디버깅 서포트 역할로 전환 (AI 강점 분리 모델).' },
      { type:'완료', title:'시간 흐름 재생 타임머신 (Claude 버전)', desc:'«1년/1년» 이동을 즉시 점프가 아니라 1년치를 약 3초에 걸쳐 연속 재생하도록 변경 — 과거·미래로 무제한 진행.' },
      { type:'완료', title:'외태양계 영역 시각화 (Claude · 2026-05-23 / 24 정밀화)', desc:'카이퍼 메인 벨트(30~50 AU) + 산란 원반 Scattered Disk(50~1,000 AU) 입자 + 외곽 윤곽선 + 반투명 평면 띠. 오르트 구름(2,000~100,000 AU) 입자 구형 쉘 + 반투명 sphere shell. 「초점」 메뉴 선택 시에만 표시. NASA 카이퍼 영역 분류(메인+산란)를 전부 반영.' },
      { type:'완료', title:'외계 항성계 추가 (Claude · 2026-05-23 / 24 정밀화)', desc:'「프로젝트 헤일메리」 40 에리다니 A — Gaia DR3 측정값 16.340 ± 0.010 광년(5.010 pc · 약 1,033,359 AU · 154.6조 km). 「삼체」 α Centauri AB 4.344 광년(1.3319 pc · 약 274,719 AU · 41.1조 km), Proxima C 4.2465 광년. 항성간 거리는 visual 모드에서 L^0.35로 압축, real 모드에서는 camera.far 동적 확장.' },
      { type:'완료', title:'고해상 행성 텍스처 + 주요 위성 시스템 (Claude · 2026-05-24)', desc:'7행성(수성·금성·화성·목성·토성·천왕성·해왕성)에 NASA 출처 디퓨즈·범프 텍스처 적용(jsDelivr/threex.planets). 토성 고리도 실제 색상 텍스처. 주요 위성 11개 추가 — Phobos·Deimos·Io·Europa·Ganymede·Callisto·Titan·Rhea·Titania·Oberon·Triton. parent.group→pivot→mesh 계층으로 행성 이동 자동 추적. 이중 가시성 로직: (A) 행성 포커스 시 그 행성 위성만 fade-in (B) 「🌙 위성」 토글로 전체 동시 표시. opacity 트윈으로 0.25초 부드러운 전환.' },
      { type:'완료', title:'위성 셀렉터 계층화 + 클릭 정보 + 라벨 보정 (Claude · 2026-05-24)', desc:'「초점」 메뉴 위성 11개를 모행성 아래에 「└ 위성명」 형식으로 계층 표시. INFO 객체에 모든 위성의 천문학 정보 등록 — 셀렉터/mesh/라벨 어느 곳을 클릭해도 사이드바에 지름·모행성·공전주기·모행성과 거리·특징·해설이 「달」과 동일하게 표시. 위성 라벨이 본체에서 멀어 보이던 문제 해결 — 라벨 위치를 meshR×1.6 위로, 크기를 meshR×3.2로 본체 비례 산정해 위성에 근접하게 표시. opacity 0인 위성은 raycaster 자동 제외.' },
      { type:'완료', title:'부산 기준 실시간 달 모양 위젯 (Claude · 2026-05-24)', desc:'조석 패널 위에 신설 — Canvas 2D + NASA moon_1024.jpg 텍스처를 globalCompositeOperation 「multiply」로 합성. 표면 디테일(크레이터·바다·고지)을 유지하면서 위상별 그림자만 정확히 변화. 한국어 8단계 위상명 + 조명률(%) + 달 나이 표시.' },
      { type:'완료', title:'조석 기본 지점을 부산으로 (Claude · 2026-05-24)', desc:'curLoc 초기값을 인천 → 부산으로 변경, 셀렉터 selected 속성도 부산. 달 위젯 관측 지점과 일관성 확보.' },
      { type:'핵심', title:'GPT 협업 — 3단 TDZ 에러 진단·해결기록', desc:'2026-05-24 Phase 2 대규모 패치 직후 시뮬레이터 검은 화면 다운. Claude(나)가 첫 에러만 잡고 캐시 의심에 빠져 헛수고하던 중 GPT가 정확히 진단 — JavaScript TDZ(Temporal Dead Zone) 3단 연쇄. ①1차: buildProbes의 PR.direction.normalize() — Parker/JWST는 direction 필드 없는데 호출. Claude가 if 가드로 해결. ②2차 (GPT 진단): const moonSphereGeo가 line 1703 선언인데 line 1233 카모오알레와에서 먼저 참조 → unitGeo·earthGeo·moonSphereGeo 세 공용 geometry를 신규 코드 위로 이동. ③3차 (GPT 재진단): 화성 로버 즉시 실행 for문이 bodyObjs 선언 전 실행 → buildMarsRovers() 함수로 감싸고 PLANETS 빌드 후 호출. 3단 모두 해결 후 정상 복귀. AI 협업의 모범 사례 — Claude는 구현, GPT는 정밀 진단.' }
    ],
    milestones: [
      { date:'2026-05-21', title:'Step 1 — 태양·지구·달 실시간', desc:'우주 배경·카메라 조작·실시간 자전/공전' },
      { date:'2026-05-21', title:'Step 2 — 8행성 + 케플러 천체력', desc:'전 행성 확장, 토성 고리, 지구 NASA 텍스처' },
      { date:'2026-05-22', title:'Step 3 — 조석(물때) 계산', desc:'조석 팽대부 3D, 물때 패널, 48h 조석곡선' },
      { date:'2026-05-22', title:'Step 4 — 인터랙션·비주얼 고도화', desc:'타임머신, 클릭 포커싱, 정보 UI, 그림자' },
      { date:'2026-05-22', title:'AI 협업 체제 전환 — Claude 단일 구현 라인 + Codex 디버깅 서포트', desc:'프론트엔드 비주얼 우위로 Claude 일원화, Codex는 코드 진단 서포트로 역할 분담' },
      { date:'2026-05-22', title:'시간 흐름 재생 타임머신', desc:'Claude 버전 — 연 단위 이동을 연속 재생 방식으로 개선' },
      { date:'2026-05-23', title:'외태양계 영역 시각화', desc:'카이퍼 벨트·오르트 구름 입자 + 윤곽선·반투명 메시 + 거리 라벨, 「초점」 메뉴 연동' },
      { date:'2026-05-23', title:'외계 항성계 (헤일메리·삼체)', desc:'40 에리다니 A + 알파 센타우리 실제 거리 반영, 카메라 인터스텔라 줌' },
      { date:'2026-05-23', title:'부산 기준 실시간 달 위젯', desc:'조석 패널 위 신설 — NASA 텍스처 + multiply 합성으로 사실적 달 표면, 한국어 8단계 위상명' },
      { date:'2026-05-23', title:'조석 기본 지점 → 부산', desc:'관측 지점 일관성 확보, 달 위젯·조석곡선 모두 부산 기준' },
      { date:'2026-05-24', title:'NASA/Gaia DR3 팩트체크 정밀화', desc:'40 에리다니 A 16.45 → 16.340 ly(Gaia DR3), α Cen 4.37 → 4.344 ly. 카이퍼 영역에 NASA 분류상 산란 원반(Scattered Disk, 50~1,000 AU) 입자·윤곽 추가. 데이터 정확도 97% → ~99.5%' },
      { date:'2026-05-24', title:'고해상 행성 텍스처 + 위성 시스템', desc:'7행성에 NASA 출처 디퓨즈·범프 텍스처(jsDelivr/threex.planets) 적용. 주요 위성 11개 추가 — 화성(포보스·데이모스), 목성(갈릴레오 4), 토성(타이탄·레아), 천왕성(티타니아·오베론), 해왕성(트리톤). 부모-자식 계층(planet→pivot→moon), 가시성 이중 로직(focus 자동 표시 + 「🌙 위성」 전역 토글), opacity 페이드 트윈.' },
      { date:'2026-05-24', title:'위성 셀렉터 계층화 + 클릭 정보 + 라벨 보정', desc:'「초점」 셀렉터에 행성 아래 위성 들여쓰기 (└ 표기). 위성 11개 모두 INFO 등록 — 셀렉터 또는 mesh/라벨 직접 클릭 시 사이드바에 천문학 정보 표시(지름·공전주기·모행성 거리·특징·설명). 위성 라벨 위치/크기를 mesh 본체 크기 비례로 재산정(meshR×1.6 위, meshR×3.2 크기), 본체에 근접하게 표시. 보이지 않는 위성은 raycaster에서 자동 제외.' },
      { date:'2026-05-24', title:'인류 탐사선·라그랑주·공궤도·성간/미지 천체 통합 레이어', desc:'대규모 천체 추가 — 보이저 1·2호(169·141 AU), 뉴 호라이즌스호(58 AU), 파커 솔라 프로브(코로나 타원 궤도), JWST(L2). 지구-태양 라그랑주 L1~L5 매 프레임 동적 갱신(홀로그래픽 십자 마커). 목성 트로이 소행성군 2,400 입자×2(L4·L5). 카모오알레와 1:1 공명 궤도. 오무아무아 쌍곡선 궤도 + 미리 그린 path. Planet Nine 가상 행성 점선 궤도(a=600 AU). 「🛰 탐사선」「⚖ 라그랑주」「👽 미지」 3개 UI 토글로 카테고리별 표시. 셀렉터 구분자(──)로 그룹화.' },
      { date:'2026-05-24', title:'Phase 1 정리 — 화성 로버 제거 + 라그랑주/JWST 가시성 강화', desc:'디렉터님 지시로 화성 로버(퍼서비어런스·큐리오시티) 데이터·코드·셀렉터 완전 제거. 라그랑주 L1~L5 마커에 depthTest:false + renderOrder 999 적용해 지구 뒤에 있어도 가려지지 않음. sprite 크기 50% 강화로 멀리서도 명확. JWST는 황금 6각형 CylinderGeometry mesh + 진한 halo sprite로 차별화된 3D 마커 적용, 천천히 자전.' },
      { date:'2026-05-24', title:'Phase 2 — 인터스텔라 영화 시스템 (가르강튀아 GLSL + 웜홀 + 3행성)', desc:'영화 「인터스텔라」 시스템 통합 추가. 가르강튀아 초대질량 블랙홀: Event Horizon(검은 구) + 커스텀 GLSL Accretion Disk(케플러 회전·fBm 플라즈마 노이즈·Doppler 빔잉) + 위·아래 휘어진 Lensing Halo Torus(영화 시그니처) — 모두 GLSL ShaderMaterial로 실시간 렌더. 웜홀(토성 근처 발광 sphere, 홀로그래픽 격자 셰이더). 가르강튀아 주위 공전하는 3행성: 밀러(물·시간 지연 1시간=지구 7년) · 맨(얼음·거짓 신호) · 에드먼즈(사막·거주가능). 셀렉터 「🎬 인터스텔라 영화 시스템」 섹션 신설, 「👽 미지」 토글에 통합. 카메라 far 1.2e6까지 동적 확장.' },
      { isCore:true, date:'2026-05-24', title:'핵심 디버깅 스토리 — GPT 협업으로 3단 TDZ 에러 해결', desc:'Phase 2 대규모 패치(인터스텔라 시스템) 직후 시뮬레이터가 검은 화면 + 「실행에 실패했습니다」로 완전 다운. Claude(나)가 첫 에러만 잡고 캐시 의심으로 빠져 헛수고하던 중, GPT가 정확히 진단 — JavaScript의 TDZ(Temporal Dead Zone, const 선언 전 접근 불가) 문제가 3단으로 누적돼 있었음. (1차) buildProbes 안 PR.direction.normalize() — Parker/JWST가 direction 필드 없는데 호출 → 「Cannot read properties of undefined」. Claude가 if 가드로 1차 해결. (2차) GPT 진단: const moonSphereGeo가 line 1703에 선언됐는데 line 1233 카모오알레와에서 먼저 참조 → 「Cannot access before initialization」. unitGeo·earthGeo·moonSphereGeo 세 공용 geometry를 신규 코드 블록 시작 위로 이동해 해결. (3차) GPT 재진단: 화성 로버 즉시 실행 for문이 bodyObjs 선언 전 실행되어 「Cannot access bodyObjs before initialization」. 로버 빌드 코드를 buildMarsRovers() 함수로 감싸고 PLANETS 빌드 직후 호출하도록 재구조. 3단 모두 해결 후 시뮬레이터 정상 동작 복귀. 캐시 진단용 [BUILD-vN-FIX] 마커를 로딩 화면에 임시 표시했다가 해결 후 제거. AI 협업의 모범 사례 — 각 AI 강점 활용.' },
      { date:'2026-05-24', title:'Phase 3a — 「외계 항성계」 메뉴 재편 + 가르강튀아 셰이더 강화', desc:'디렉터님 지시 사양 반영: 셀렉터의 외계 항성계 항목을 「외계 항성계」 메인 카테고리 + 3개 optgroup 서브로 재편 — (1) 인터스텔라(웜홀·가르강튀아·밀러·맨·에드먼즈) (2) 삼체(알파 센타우리) (3) 프로젝트 헤일메리(40 에리다니 A). 가르강튀아 강착원반 셰이더 강화: view-dependent UV warp(카메라가 옆에서 볼수록 디스크가 휘어 보임) + 6단계 fBm 노이즈 + Einstein Ring 추가(가장 안쪽 강한 빛) + Doppler 청색편이 강화(밝은 쪽에 청색 가산) + 초고온 안쪽 청백색 그라데이션.' },
      { date:'2026-05-24', title:'Phase 3b — 목성 트로이 영역 시각화 (선택 시 바운딩)', desc:'디렉터님 지시: 「목성 트로이 소행성군」 선택 시 시각적으로 범위를 표현. L4(그리스 진영, 황갈색)·L5(트로이 진영, 연보라색) 위치에 60° 반폭의 반투명 호 + 외곽 LineLoop + 라벨 두 개(그리스 진영/트로이 진영). 입자 분포와 동일한 baseAng/회전 보정 사용해 입자와 정확히 겹침. 셀렉터 「목성 트로이 소행성군」 선택 시에만 표시(다른 선택 시 자동 숨김). 카메라는 목성 거리의 1.8배에서 호 전체 조망.' },
      { date:'2026-05-24', title:'Phase 3c — 「사건의 지평선 (과학적 실증)」 EHT 블랙홀 신규', desc:'디렉터님 지시: 가르강튀아(영화)와 별개로 EHT 관측 기반 두 번째 블랙홀 추가. M87* 발표(2019-04) 사진의 톤을 모티브 — 따뜻한 오렌지 ring + Photon Ring 강조(가장 안쪽 가는 빛) + 약한 Doppler(30% 비대칭, 가르강튀아 7배의 1/20) + view-warp 없음(정면 관측 사진 그대로) + 4단계 fBm 부드러운 노이즈. 가르강튀아와 완전 별도 GLSL ShaderMaterial. INFO에 EHT 협력단·M87*·관측 방식·VLBI 8개 망원경·Sgr A* 후속 등 천문학 사실 등록. 셀렉터 「⚫ 블랙홀」 카테고리 신설. 위치 (400000, -50000, 200000) — 가르강튀아와 별도 좌표.' },
      { date:'2026-05-24', title:'Phase 4 — 위성 PBR 텍스처 절충 적용', desc:'디렉터님 지시: 위성을 평면 sphere가 아닌 PBR 텍스처로 강화. 무료 CDN 위성 전용 텍스처가 사실상 없어(검색: jeromeetienne/threex.planets·solarsystemscope.com 모두 행성·달·명왕성만 제공) 절충안 적용 — NASA 달 텍스처(moon_1024.jpg)를 map+bumpMap으로 공유 + 위성별 color tint로 고유 색감(이오 노란·유로파 흰·가니메데 갈색·칼리스토 어두운회·타이탄 오렌지 등). bumpScale은 포보스/데이모스 같은 작은 위성에 더 강하게(0.05), 큰 위성은 약하게(0.022). 진짜 위성별 PBR은 디렉터님이 NASA 텍스처를 직접 폴더에 제공해주시면 즉시 적용 가능.' },
      { date:'2026-05-24', title:'Phase 5 — 위성별 GLSL 셰이더 (옵션 B 완전 구현)', desc:'디렉터님 선택 「B 절차적 셰이더」 진행. 4종 카테고리 ShaderMaterial 작성 — (1) CRATERED: 3D fbm 노이즈 + smoothstep 크레이터 패턴 (포보스·데이모스·칼리스토·레아·티타니아·오베론), (2) VOLCANIC: 황 화산 노랑/주황/검은 얼룩 (이오), (3) ICY: 얼음 + 갈라진 라인(abs sin pattern) (유로파·가니메데·트리톤), (4) HAZY: 두꺼운 오렌지 대기 + Fresnel 가장자리 발광 (타이탄). 각 위성에 surface:{type, color params, scale} 추가. 공통 hash3·noise3·fbm3 헬퍼 + MOON_VERTEX_SHADER + makeMoonShaderMaterial() 팩토리. uOpacity uniform으로 페이드 트윈 완벽 통합. 더 이상 단색 sphere 아님 — 11개 위성 모두 고유 표면 패턴.' },
      { date:'2026-05-24', title:'Phase 6 — 태양 GLSL 셰이더 + 가스 행성 atmospheric halo + EHT 강화', desc:'디렉터님 지시 「태양·토성·천왕성·해왕성도 최대 퀄리티」 + EHT 셰이더 보강. (1) 태양: MeshBasicMaterial → ShaderMaterial 전환. 3D fbm 노이즈로 표면 granulation(시간에 따라 흐름) + sunspot(어두운 흑점) + limb darkening(가장자리 어둠) + 코로나 떨림. (2) 가스 행성(목성·토성·천왕성·해왕성) atmospheric halo: 행성 외곽 unitGeo halo + Fresnel 셰이더 + BackSide + AdditiveBlending. 각 행성 palette 첫 색을 발광 색으로 적용. (3) EHT 셰이더 강화: Doppler 0.30→0.58 진폭(3.5배 차이), brightCore crescent 강조 ring(EHT 사진의 초승달 시그니처), gravitational lens edge 가장자리 빛, photon ring 1.1배 강화.' },
      { date:'2026-05-24', title:'후속 fix #1 — 위성 라벨이 본체 반대편에 표시되던 버그', desc:'디렉터님 지적: 위성 라벨이 위성 본체에 안 붙고 반대편에 떠 있음. 원인 분석: Three.js의 Y축 회전 매트릭스 R_y(θ) × (1,0,0) = (cos(θ), 0, -sin(θ)). 기존 라벨 코드는 (cos(θ), 0, +sin(θ))로 Z 부호 반대였음 → 라벨이 mesh 정반대 방향에 위치. 수정: mesh.getWorldPosition() → label.parent.worldToLocal() 변환으로 mesh의 실제 위치를 라벨 좌표로 직접 복사. 회전 매트릭스 부호 계산 자체를 안 함 → 버그 원천 차단. Y 오프셋 1.6 → 1.4로 더 가깝게.' },
      { date:'2026-05-24', title:'후속 fix #2 — 웜홀 회전·셰이더 흐름 대폭 감속 (디렉터님 눈 피로)', desc:'디렉터님: 「웜홀 빙빙 돌아 눈 아프다」. 단계별 감속: 1차 회전 0.02→0.0028 + 진동 줄임 + 셰이더 흐름 0.30→0.04. 2차 더 강하게: 회전 0.0006(거의 정지), 진동 완전 제거(= 0), 셰이더 흐름 0.008/0.005로 사실상 정적. 격자 패턴 유지하되 매우 천천히 흐름.' },
      { date:'2026-05-24', title:'후속 fix #5 — NASA Eyes 공식 실사 임베드 (JPL 자산 직접 참조)', desc:'디렉터님: 「실사로 반영」. 우리 시뮬레이터 자체에 NASA Eyes 자산 직접 가져오기는 라이센스·엔진 차이로 어려움 → 두 가지로 절충 — (1) 보고서 Solar 프로젝트 preview에 NASA Eyes iframe 항목 추가 「공식 실사 참조 (JPL)」, (2) 시뮬레이터 컨트롤바에 「📡 NASA Eyes」 토글 버튼 신설. 클릭 시 전체 화면 오버레이로 NASA Eyes iframe 표시 + 현재 focusKey에 따라 NASA Eyes의 해당 객체 자동 이동(NASA_EYES_MAP 매핑 — voyager1·voyager2·newhorizons·parker·jwst·sun·mercury~neptune·moon·갈릴레오 위성·titan·rhea·티타니아·오베론·트리톤·phobos·deimos). ✕ 닫기 버튼으로 iframe src 초기화(메모리 해제). Claude 자체 구현 + NASA 공식 실사 두 자산을 한 사용자 흐름에서 비교 가능.' },
      { date:'2026-05-24', title:'후속 fix #4 — 인류 탐사선 3D 모델 + 항적·예상 궤적·방향 화살표', desc:'디렉터님 지적: 「탐사선이 소행성같은 점」. sprite 점 → 실제 NASA 사양 기반 3D Group of Mesh로 교체. Voyager: BoxGeometry 황금 MLI 본체 + CylinderGeometry 큰 접시 안테나(3.7m) + TorusGeometry 림 + RTG 붐(2.4 길이) + RTG 모듈 + Magnetometer 붐(반대편 3.0). NewHorizons: 사다리꼴 본체 + 작은 접시(2.1m) + 측면 RTG. Parker Solar Probe: 어두운 본체 + 큰 흰 태양 가리개(1.6 반경, emissive) + 양옆 푸른 태양 패널 2개. JWST: 황금 6각형 거울(기존 유지). 각 탐사선 진행 방향으로 lookAt 회전. 포커스 시 항적 표시 — 과거(태양→현재, 옅은 청 LineDashedMaterial dashSize 60 gapSize 40, opacity 0.65) + 미래 예상(현재→1.55배, 주황 LineDashedMaterial dashSize 50 gapSize 55, opacity 0.60) + 현재 위치 +8 unit 앞에 ConeGeometry 화살표 (lookAt 방향). applyScales에서 스케일 모드 변경 시 line geometry 재생성.' },
      { date:'2026-05-24', title:'후속 fix #3 — 웜홀 천문학 사실 기반 셰이더 완전 재작성', desc:'디렉터님: 「푸른 sphere는 현실성 없음」. 이론물리 사실 반영 — 웜홀 자체는 시공간 통로(자체 빛 없음), 우리가 보는 건 반대편 우주의 빛이 강한 중력렌즈로 표면에 비친 모습. 새 셰이더: (1) 배경 검은 deep space(0.005,0.010,0.020) + 가장자리 옅은 푸른 lensTint, (2) Procedural Star Field 3 레이어 — 작은·중간·매우 큰 별, (3) 별 분광형 4종 — O/B 청색 5% · G 노랑 7% · K/M 적색 6% · 흰빛 82%(실제 천문학 분포), (4) Gravitational Lensing — starP += vNormal × fresnel × 4.5로 가장자리에서 별 휨, (5) Einstein Ring 청록 발광 ring(0.45,0.72,1.00), (6) AdditiveBlending → NormalBlending(검은 우주가 진짜 검정으로). Kip Thorne 자문 영화 인터스텔라 + 천문학 사실 충실.' }
    ]
  },
  {
    id: 'inst',
    name: 'INST EXTRACTOR',
    subtitle: '고음질 반주(Inst) 추출기 · 음원 보컬 제거',
    icon: 'music',
    platform: '웹 앱 + 로컬 GPU 서버',
    status: 'completed',
    start: '2026-05-22',
    latest: '2026-05-26',
    progress: 100,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/inst-extractor/',
    preview: { type:'embed', height:560, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/inst-extractor/', label:'INST Extractor — 믹싱 콘솔 UI (드래그앤드롭 데모 모드)' }
    ]},
    summary: '음원에서 보컬을 제거하고 고음질 반주(Inst) 트랙을 추출하는 4번째 프로젝트. '
           + '믹싱 콘솔 콘셉트 UI(Claude) + demucs AI 분리 엔진(Codex/GPT 주도)으로 구성된다. '
           + '디렉터 지시로 공개 웹 보고서(/inst-app/)에 드래그앤드롭 UI를 배포했고, 실제 GPU 추출은 백엔드가 필요해 '
           + '구조상 외부인 실사용은 불가 — 디렉터 본인 데스크탑 전용 도구로 운영하기로 합의하고 디렉터 실음원 분리 확인까지 통과해 100% 마무리됐다.',
    method: '프론트엔드(Claude 영역)는 믹싱 콘솔 다크 UI + 데모 모드 토글, 백엔드(Codex 영역)는 FastAPI + Demucs. '
          + 'AI 릴레이(HANDOFF.md 로그)로 인수인계하며 진행 — Claude 1차 UI·API 골격 → Codex 2차 demucs 핵심 엔진 → '
          + 'Claude 홈 PC 세팅·GPU 검증 → Codex 일본어 파일명 500 에러 협업 수정 → Claude 공개 보고서 UI 페이지 배포 → 디렉터 실음원 분리 확인으로 완주.',
    stack: ['Python 3.12', 'FastAPI', 'Demucs', 'PyTorch CUDA', 'HTML5 · Tailwind'],
    stackDetail: [
      { area: '백엔드 API 서버·라우팅', tech: 'Python 3.12, FastAPI', how: 'main.py에서 FastAPI 앱을 만들어 루트(/)로 index.html 서빙, /health 상태 점검, /extract 추출 엔드포인트를 라우팅한다. CORS 미들웨어와 UploadFile 업로드·Form 모델 파라미터를 처리한다.' },
      { area: '보컬 제거·반주 분리 엔진', tech: 'Demucs, PyTorch CUDA', how: 'separate_instrumental() 함수에서 demucs의 get_model로 모델을 로드하고 apply_model(split True, overlap 0.25, shifts 1)로 스템을 분리한다. vocals 스템을 제외한 나머지를 합산해 반주를 만든다.' },
      { area: 'GPU 자동 디바이스 분기·모델 캐시', tech: 'PyTorch CUDA', how: 'torch.cuda.is_available()로 CUDA 가능 시 cuda, 아니면 cpu로 디바이스를 자동 분기한다. (model_name, device) 키로 _MODEL_CACHE에 로드한 모델을 캐시해 재호출 비용을 줄인다.' },
      { area: '결과 오디오 WAV 출력', tech: 'Demucs, PyTorch CUDA', how: '분리·합산한 반주 텐서를 clamp(-1,1) 후 numpy로 변환하고 soundfile로 PCM_16 WAV 파일로 OUTPUT_DIR에 저장한다.' },
      { area: '믹싱 콘솔 프론트엔드 UI', tech: 'HTML5 · Tailwind', how: 'index.html에서 Tailwind CDN으로 다크 믹싱 콘솔 카드를 구성한다. 드래그앤드롭 드롭존, 모델 선택, 진행바(shimmer), VU 미터, 완료 팝업, Lucide 아이콘으로 화면을 만든다.' },
      { area: '데모 모드·실제 추출 분기 로직', tech: 'HTML5 · Tailwind', how: '사무실 데모 모드 토글이 켜지면 백엔드 없이 브라우저에서 5초 가상 처리 후 무음 WAV를 만들고, 꺼지면 FormData로 /extract에 POST해 실제 백엔드 분리를 호출한다.' },
      { area: '업로드 검증·모델 화이트리스트', tech: 'Python 3.12, FastAPI', how: 'ALLOWED_SUFFIXES 확장자 검증과 SUPPORTED_MODELS 화이트리스트로 모델명을 제한하고, 청크 단위 저장 중 MAX_UPLOAD_BYTES 초과 시 413 에러를 반환한다.' },
      { area: '비ASCII 파일명 헤더 처리', tech: 'Python 3.12, FastAPI', how: '응답 시 원본 파일명을 X-Original-Filename-Encoded 헤더에 urllib.parse.quote로 percent-encoding해 일본어 등 비ASCII 파일명의 Latin-1 헤더 인코딩 500 에러를 회피한다.' },
    ],
    issues: [
      { type:'완료', title:'Claude 1차 빌드 — UI + FastAPI 골격', desc:'믹싱 콘솔 다크 UI(드래그앤드롭·진행바·VU 미터·데모 모드 토글·완료 팝업) + FastAPI /extract·/health 라우팅 + 업로드 검증 + 모델 화이트리스트. 프론트엔드 전체는 Claude 영역으로 완성·고정.' },
      { type:'완료', title:'Claude — 홈 PC 자동 세팅 일체', desc:'집 데스크탑(RTX 4060 Ti)용 입문자 가이드(SETUP_HOME_PC.md) + 더블클릭 자동 세팅(setup_home.bat / scripts/setup_windows_desktop.ps1) + 서버 실행(start_server.bat / scripts/run_server.ps1) + AI 릴레이 로그 시스템 설계.' },
      { type:'완료', title:'Claude — 집 데스크탑 RTX 4060 Ti 풀스택 GPU 검증', desc:'verify_gpu.py + verify_http.py 검증 스크립트 2종 작성·실행. PyTorch 2.11+cu128 / CUDA True / Demucs 직호출 1.86초 / VRAM 543MB / HTTP /extract 200 OK 0.81초 확인. 카드 사양 8GB로 확정(4-소스 크로스체크).' },
      { type:'완료', title:'Claude — 공개 보고서 UI 페이지 (/inst-app/) 배포', desc:'디렉터 지시 「웹에서 다른 사람도 드래그하면 inst 생성」 반영. GitHub Pages에 데모 모드 기본 ON으로 드래그앤드롭 UI 즉시 체험 가능. 실제 추출 모드 토글 시 본인 백엔드 주소 입력란 노출, HTTPS 페이지에서 http:// 호출 시 mixed-content 차단 안내까지 포함. ※ 구조상 GPU 백엔드 없는 외부인은 데모 UI만 체험 가능 — 디렉터 본인 PC 전용 도구로 운영하기로 합의.' },
      { type:'핵심', title:'Codex(GPT) 주도 — 백엔드 핵심 엔진 separate_instrumental()', desc:'프로젝트의 본질적 가치(보컬 제거 자체)는 Codex 영역. main.py의 separate_instrumental()을 Codex가 전적으로 구현 — get_model() 로드 + (model_name, device) 메모리 캐시 + torch.cuda.is_available() 자동 디바이스 분기 + AudioFile read + apply_model(split=True, overlap=0.25, shifts=1) + vocals stem 제외 후 나머지 합산 + soundfile PCM_16 WAV 출력. requirements.txt의 demucs/torch/torchaudio/soundfile 의존성도 Codex가 활성화. 즉 이 프로젝트는 GPT 위주로 만들어졌다.' },
      { type:'핵심', title:'AI 협업 — 일본어/비ASCII 파일명 500 에러 진단·수정', desc:'2026-05-24 디렉터가 일본어 MP3(Hysteric Blue「今見える明日_戒める今日」)를 업로드하니 분리 자체는 성공해 outputs/에 WAV가 생성됨에도 응답은 500 Internal Server Error. Codex가 정밀 진단 — main.py의 X-Original-Filename 헤더에 비ASCII가 들어가 HTTP 헤더 Latin-1 인코딩 제한에 걸려 Starlette가 500을 내던 문제. Codex가 X-Original-Filename-Encoded로 헤더명 변경 + urllib.parse.quote() percent-encoding 적용으로 즉시 수정. 재검증: 235.519초 / 41.5MB WAV / 200 OK. AI 협업의 모범 사례 — Claude는 UI·인프라, Codex는 백엔드 정밀 진단·수정.' },
      { type:'완료', title:'디렉터 실음원 분리 확인 — 100% 완료 처리 (2026-05-26)', desc:'디렉터(G.M.PARK)가 본인 데스크탑에서 실음원으로 보컬 제거가 성공적으로 작동함을 확인. 분리 품질·처리 흐름 모두 통과. 프로젝트 #4 INST EXTRACTOR 100% 완료 처리.' }
    ],
    milestones: [
      { date:'2026-05-22', title:'Claude 1차 — 레포 초기 빌드 (UI + API 골격)', desc:'프로젝트 #4 신설 — 믹싱 콘솔 UI · FastAPI 골격 · 인수인계 문서 시스템(HANDOFF.md)' },
      { isCore:true, date:'2026-05-22', title:'Codex(GPT) 2차 — Demucs 분리 엔진 구현 (프로젝트 핵심 가치)', desc:'AI 릴레이로 인수 — main.py separate_instrumental() 전체 구현. Demucs 모델 로드·캐시·디바이스 분기·stem 분리·vocals 제외 합산·WAV 저장까지. 이 프로젝트의 본질적 변환 능력은 전적으로 Codex(GPT) 작업.' },
      { date:'2026-05-22', title:'Claude — 홈 PC 자동 세팅 일체', desc:'SETUP_HOME_PC.md + setup_home.bat + start_server.bat + Codex 구현 검수' },
      { date:'2026-05-24', title:'Claude — 집 데스크탑 RTX 4060 Ti 풀스택 GPU 검증', desc:'verify_gpu.py / verify_http.py 작성·실행. CUDA True, 직호출 1.86초/543MB VRAM, HTTP 0.81초. 카드 사양 8GB 확정.' },
      { isCore:true, date:'2026-05-24', title:'AI 협업 — 일본어 파일명 500 에러 진단·수정 (Codex)', desc:'디렉터 일본어 MP3 업로드 시 분리는 성공하나 응답 500. Codex가 X-Original-Filename 헤더의 Latin-1 인코딩 제한을 정밀 진단 → percent-encoded 헤더로 즉시 패치. 재검증 235.519초 41.5MB WAV 200 OK. Claude는 UI·인프라, GPT는 백엔드 정밀 진단 — 역할 분담 협업 모델 재확인.' },
      { date:'2026-05-24', title:'Claude — 공개 보고서 UI 페이지 (/inst-app/) 배포', desc:'디렉터 지시 「웹에서 다른 사람도 드래그하면 inst 생성」 반영. GitHub Pages에 드래그앤드롭 UI 공개. 단 실제 추출은 GPU 백엔드 필요 — 외부인 실사용은 구조상 불가, 디렉터 본인 PC 전용 도구로 운영 합의.' },
      { isCore:true, date:'2026-05-26', title:'디렉터 실음원 분리 확인 — 100% 완료', desc:'디렉터(G.M.PARK)가 본인 데스크탑에서 실음원 보컬 제거가 성공적으로 작동함을 확인. 프로젝트 #4 100% 완료 처리.' }
    ]
  },
  {
    id: 'korea-gov-sim',
    name: '2026 PRESIDENT KOREA',
    subtitle: '대통령 정치 시뮬레이션 게임 · 5년 단임 60개월',
    icon: 'landmark',
    platform: '웹 게임 · Vite + React + TypeScript',
    status: 'in-progress',
    start: '2026-05-26',
    latest: '2026-05-31',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?lang=ko&v=kgs3',
    preview: { type:'embed', height:640, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?lang=ko&v=kgs3', label:'2026 PRESIDENT KOREA — 플레이 가능한 vertical slice (Three.js 지도 + 국정현안·위기·국회·예산 엔진, Codex 진행)' },
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/inauguration-cinematic/', label:'대통령 취임 시네마틱 — 3D 카툰 실시간 컷신 (Three.js, Claude 제작 · 이벤트 트리거 영상 PoC)' }
    ]},
    summary: '대한민국 대통령으로 5년 단임을 사는 정치 시뮬레이션 게임의 5번째 프로젝트. '
           + '메뉴가 아니라 살아있는 지도가 통치판 — 어두운 세계 위에 따뜻한 한지색 한국이 떠오르고, '
           + '플레이어는 지도 위에 정책을 찍고 민심·예산·위기·외교를 굴린다. '
           + '월 단위 결정론 엔진(60개월)을 LLM이 자연어 이벤트로 감싸는 구조로 설계되어 있으며, '
           + 'KGS-MAP-15까지 진행 — 다국어 라벨(6 locale) · 북한·MDL · 44 entity dataset · '
           + '정부·공공기관 건물 oid 게임 오브젝트화 완료. 이후 Codex가 메인 개발을 인수(2026-05-29)해 게임플레이 엔진을 본격 구축 — 월간 위기 생성·한국형 위기 템플릿, 세이브/로드, 월간 이벤트 덱, 국회 의석 협상, 부처·참모 능력치, 탄핵 리스크, 예산 회계연도까지 연결되고 엔진 테스트 35/35 통과. 지금은 지도+국정현안+위기/이벤트/국회/예산이 도는 플레이 가능한 vertical slice.',
    method: '설계 v0.1(20+ 섹션) + 구현 계획 v0.1(M1~M11) 박사 승인 후 M0 vertical slice 완성. '
          + 'Vite + React + Zustand로 단일 Ground Truth 스토어 구축, '
          + 'd3-geo Mercator projection으로 Natural Earth 1:110m(세계) + southkorea-maps(한국 17 광역시도) 실 GeoJSON 렌더링. '
          + '디자인 언어 「슬레이트 위의 한지」 — 한지·먹·단청 13색 자체 팔레트 + 인장형 POI 아이콘 + 명조 디스플레이/sans 본문/mono 수치 3계층 타이포. '
          + 'Paradox · Geopolitical Simulator · Google Earth 등 기존 게임/지도 서비스 모방 0건 검증.',
    stack: ['Vite', 'React 18', 'TypeScript 5', 'Zustand', 'd3-geo', 'SVG', 'Natural Earth', 'southkorea-maps'],
    stackDetail: [
      { area: '프로젝트 빌드·개발 환경', tech: 'Vite, TypeScript 5', how: 'Vite로 단일 프로젝트를 부트하고 번들링하며 M0 vertical slice에서 vite build 858ms·gzip JS 62KB를 측정했다. TypeScript 5로 7종 데이터 스키마(Region·POI·Policy·Crisis·MapState·GameState)를 타입화하고 tsc 0 에러를 검증 기준으로 사용한다.' },
      { area: '게임 화면·UI 컴포넌트', tech: 'React 18', how: 'Header·MapViewport·RegionalGovernancePanel·POIDialog·LayerToggleSidebar 등 화면 컴포넌트를 React 18로 구성한다. 이후 풀스크린 게임 인터페이스(top status bar·left rail·center map·right inspector·bottom timeline)도 React 컴포넌트로 재구축했다.' },
      { area: '전역 상태·단일 Ground Truth 스토어', tech: 'Zustand', how: '민심·예산·위기·외교·카메라 상태를 담는 단일 Ground Truth 스토어를 Zustand로 구축한다. 카메라 reset 동기화를 위해 cameraResetNonce 카운터를 두고, 매 wheel/drag tick 대신 idle·zoomLevel 변경 시점에만 commit하도록 갱신 시점을 제어한다.' },
      { area: '지도 투영·좌표 변환', tech: 'd3-geo', how: 'd3-geo Mercator projection을 중심 좌표(127.8E, 36.2N)로 도입해 GeoJSON을 화면 좌표로 투영한다. POI 10개를 픽셀 좌표에서 실 위경도(용산 대통령실 37.5326,126.9774 등)로 전환하는 데 사용한다.' },
      { area: '1차 지도 렌더링 레이어', tech: 'SVG', how: '초기 지도판을 SVG로 렌더링하며 한국 외곽 골드 halo glow를 SVG filter로, selected region drop-shadow glow를 SVG로 표현했다. 이후 g transform transition 누적에 의한 렉 진단으로 Three.js 전환되며 옛 SVG 컴포넌트는 폐기됐다.' },
      { area: '세계지도 형상 데이터', tech: 'Natural Earth', how: '손코딩 mock 폴리곤을 Natural Earth 1:110m countries(Public Domain, 177개국) 실 GeoJSON으로 교체해 진짜 대륙·국가 형상을 렌더한다. mapshaper 4% 단순화로 7.2MB를 452KB로 축소했다.' },
      { area: '대한민국 행정구역 데이터', tech: 'southkorea-maps', how: 'southkorea-maps kostat 2018(CC-BY) 행정안전부 광역시도 GeoJSON으로 17개 광역시도 진짜 경계를 렌더한다. 행안부 코드와 ISO 3166-2:KR 매핑 테이블을 두어 region 식별에 연결한다.' },
      { area: '게임플레이 엔진 (Codex)', tech: 'TypeScript, Zustand', how: 'src/game 독립 엔진 계층 + Zustand Ground Truth 스토어로 월 단위 결정론 시뮬을 돌린다. 정책 효과·월간 위기 생성(한국형 템플릿)·월간 이벤트 덱·국회 의석 통과확률·탄핵 리스크·부처/참모 능력치·예산 회계연도·세이브/로드를 구현하고, scripts/run-game-tests.mjs로 게임 테스트 35/35를 통과시킨다. (2026-05-29 Codex 메인 개발 인수)' },
      { area: '취임 시네마틱 — 3D 카툰 컷신 (Claude)', tech: 'Three.js, WebGL, HTML5 Canvas, Vanilla JS, ES Modules (importmap), Playwright', how: 'three.module.js(r0.160)를 importmap ESM으로 로드해 빌드 없이 단일 self-contained HTML로 구동한다. MeshToonMaterial 셀셰이딩 + 3점 조명/림라이트로 카툰 톤을 내고, 태극기(태극·4괘)·하늘 그라데이션·toon 램프를 HTML5 Canvas 2D로 절차 생성해 CanvasTexture로 입힌다. 색종이 260개는 InstancedMesh, 태극기는 PlaneGeometry 정점 sin 파동으로 휘날린다. 카메라 smoothstep 돌리인 + CSS 레터박스/타이틀 페이드, 14초 루프. Playwright headless로 3컷 캡처해 콘솔 에러 0 검증. 게임 이벤트(취임·위기·선거)에 영상을 삽입하는 파이프라인 PoC.' },
    ],
    issues: [
      { type:'완료', title:'설계 문서 v0.1 작성 + 박사 승인', desc:'A~T 20개 섹션 + 9개 Claude Code subagent 명세 + 17 광역시도 줌 7단계 + 인장형 아이콘 시스템 + 한지+슬레이트+단청 팔레트 + 데이터 스키마 5종(Region/POI/Policy/Crisis/MapState/GameState) + originality 14항 체크리스트.' },
      { type:'완료', title:'구현 계획 v0.1 (M1~M11) 박사 승인', desc:'리포 구조 · 정적 지도 · 줌 시스템 · 행정구역 · POI · 스키마 · mock store · 호버/클릭 패널 · 레이어 토글 · 정책 타게팅 · 테스트 — 11 마일스톤 의존성 그래프 + 추정 12주 + 소유권 행렬.' },
      { type:'완료', title:'M0 vertical slice (Vite + React + 33 파일)', desc:'package.json·tsconfig·vite.config 셋업 + 7 schema · 17 region mock · 10 POI mock · Zustand store · 13색 design tokens · MapViewport(휠 줌 + 드래그 팬) · WorldBackground · KoreaRegions · POIMarkers · SealIcon · CrisisOverlay · HoverTooltip · ZoomIndicator · RegionalGovernancePanel · POIDialog · LayerToggleSidebar(10토글) · Header · 9개 subagent self-review. tsc 0 에러, vite build 858ms, gzip JS 62KB.' },
      { type:'이슈', title:'1차 슬라이스 지도 퀄리티 미달 (박사 지적)', desc:'세계 6각형 blob + 한국 5-9 정점짜리 다각형으로 손코딩 — 박사가 「쓰레기같은 퀄리티」 지적. 박사 메시지: 「프론트엔드 디자인부터 대한민국 지도 및 세계지도 구현이 제일 중요한데」. 즉시 인정 후 복구 착수.' },
      { type:'핵심', title:'실 GeoJSON 전면 교체 — Natural Earth + southkorea-maps (2026-05-26)', desc:'손코딩 mock 폴리곤을 실데이터로 교체. (1) Natural Earth 1:110m countries(Public Domain, 177개국) — 진짜 대륙·국가 형상. (2) southkorea-maps kostat 2018(CC-BY) — 행정안전부 광역시도 GeoJSON. (3) mapshaper 4% 단순화로 7.2MB→452KB. (4) d3-geo Mercator projection 중심(127.8°E, 36.2°N) 도입. (5) POI 10개 모두 픽셀 좌표→실 위경도 전환(용산 대통령실 37.5326,126.9774 / 여의도 국회 / 부산항 / 인천공항 / 수원 삼성 / 울산 현대 / 나주 KEPCO / 대덕연구단지 / KAIST). (6) 행안부 코드↔ISO 3166-2:KR 매핑 테이블. tsc/build 통과, gzip JS 70KB.' },
      { type:'이슈', title:'2차 시각 품질 미달 (박사 지적 — Frontend Quality Rescue 발동)', desc:'박사 메시지: 「the visual quality is not acceptable」「looks like a developer placeholder, not a premium political simulation」. 디자인 디렉션 재지시 — 다크 네이비/그래파이트 base + 시안 정부 색조 + 골드/앰버 대통령 강조 + glass 패널 + 절제된 그라데이션. 풀스크린 게임 인터페이스로 재구축 지시(top status bar + left rail + center map + right inspector + bottom timeline).' },
      { type:'핵심', title:'Frontend Art Direction Rebuild — Presidential Situation Room (2026-05-26)', desc:'시각 품질 전면 재구축. (1) 디자인 토큰 v0.2 — 한지 톤 폐기, dark navy(#0B0F1A) + 시안(#4ECDC4) + 골드(#D4A85A) 3원 + 한국 cream/ivory hero(#D8CFB8). (2) 풀스크린 CSS grid 게임 인터페이스 — top PresidentialStatusBar(임기 진행바 + 5종 metric + gold advance button) / left LayerControlRail(10개 토글 + 자체 제작 SVG 아이콘 + hover 슬라이드 툴팁) / center MapViewport(vignette + 미세 그리드 + corner crosshair) / right RegionInspectorPanel(빈 상태 + region 전용 + POI 전용 3 variant + DataBar + MetricBadge + chips + 섹션 위계) / bottom TimelineStrip(60턴 4 phase + 진행 cursor + 연도 마커). (3) UI 프리미티브 — GameGlassPanel(L자 corner glyph) / DataBar(linear-gradient fill) / MetricBadge(delta tone). (4) 지도 자체 — 한국 외곽 골드 halo glow(SVG filter) + selected region gold drop-shadow glow + 5종 한국 lng/lat 좌표 정확. (5) POI 마커 — 육각형 셸 + 한자 글리프(政立司公商港學) + 카테고리 색 + crisis pulse ring + importance dashed ring(★5) + 상태 닷. (6) 위기 — radial gradient bleed + 중간 dashed ring + 코어 dot. (7) 옛 컴포넌트 7개 + CSS 3개 삭제, 신규 11개 + CSS 10개. CSS gzip 3KB→7KB, JS gzip 70KB→73KB.' },
      { type:'이슈', title:'Codex 1차 검수 — 렉 + 대시보드 톤 진단 (2026-05-26)', desc:'Codex 검수 결과 두 가지 핵심 문제 진단: (1) SVG <g transform>에 80ms transition 누적 + Zustand 매 wheel/drag tick마다 전역 갱신 → 입력 누적 시 카메라 밀림 + 전체 앱 재렌더. (2) CSS grid hard-split(status/rail/map/inspector/timeline)이 「게임 위 HUD」가 아니라 「지도 옆 대시보드」로 보임. 처방: Three.js Ortho 2.5D + ref/RAF damped camera + Zustand commit은 idle/zoomLevel 변경 시점만 + full-bleed stage + floating HUD overlay. mojibake 의심 mock data는 콘솔 cp949 표시 문제일 뿐, UTF-8 정상 확인.' },
      { type:'핵심', title:'KGS-MAP-2 — Three.js 2.5D + Floating HUD (2026-05-26)', desc:'Codex 처방 전면 반영. (1) Three.js Orthographic Camera + ref/RAF damped CameraController — wheel/drag가 React state 우회, ref만 갱신, zoom level 변경 + 220ms idle 시점에만 Zustand commit. CSS transition 0건. (2) world 단일 ShapeGeometry mesh + Korea 17개 개별 mesh(raycast용) + POI 카테고리별 InstancedMesh 7개. pixelRatio Math.min(devicePixelRatio, 1.5) 제한. (3) Picker(raycaster) — InstancedMesh instance scale ≥ 0.01 검증으로 hidden POI 제외. 클릭 vs 드래그 5px threshold. (4) HUD 전면 재구성 — .stage-root full-bleed inset 0 + 5개 HUD overlay absolute (top status / left floating rail / right glass drawer / bottom compact dock / corner zoom + legend). CSS grid 폐기, layout.css 삭제. (5) hud-panels.css — backdrop-filter blur(16-18px) saturate(140-150%) glass + 1px border-gold. (6) 한국 cream(#D8CFB8) vs 외부 dark(#161B26) 명도 대비. selected region gold outline + 약한 raise(z) 애니메이션. (7) 옛 SVG 컴포넌트 10개 폐기, 신규 14개. JS gzip 73KB→209KB(+136 three core).' },
      { type:'이슈', title:'Codex 검수 #1 — BLOCK: 검은 화면 (2026-05-26)', desc:'Codex가 commit 6e5e3fa 헤드리스 검수 결과 BLOCK 판정. 빌드는 PASS, GeoJSON fetch 200, HUD 렌더 OK이지만 지도 캔버스가 검은 배경만. 진단: initial-state.ts의 computeInitialCamera()가 SVG translate offset(viewportW/2 - KOREA*scale = -10160, -5630)을 반환하는데, Three 전환 후 그 값이 OrthographicCamera.position에 그대로 사용됨. 실제 한국 geometry는 (1370, -760) — 화면 밖. LayerControlRail reset 버튼도 store만 갱신, 실 Three 카메라 미동기. headless screenshot으로 정확히 재현됨.' },
      { type:'핵심', title:'KGS-MAP-2 fix: Three convention + reset bridge (2026-05-26)', desc:'Codex 처방 즉시 반영. (1) initial-state.ts 재작성 — computeInitialCamera() 폐기, INITIAL_CAMERA_X=1370 / INITIAL_CAMERA_Y=-760 / INITIAL_CAMERA_SCALE=8 export. SVG translate 변환 코드 전면 삭제. (2) store.ts — resetCameraToKorea(viewportW, viewportH) → resetCameraToKorea() 인자 제거. cameraResetNonce 카운터 추가, reset 호출 시 ++. (3) ThreeMapStage.tsx — useGameStore.subscribe로 cameraResetNonce 변화 감지 → CameraController.resetToKorea() 호출. imperative bridge 완성. (4) LayerControlRail.tsx — resetCameraToKorea() 인자 제거. (5) Chrome headless 1600×1000 screenshot 검증 — 한국 본토 cream/ivory 정확 표시 + 외부 navy dim + HUD 5종 위치 정확 + 강원 ink-bleed 정확. internal/notes/kgs-map-2-fix-screenshot.png 첨부. (6) BLOCK 해소 → Codex 재검수 trigger 대기.' },
      { type:'이슈', title:'Codex 검수 #2 — 디자인/아트디렉션 BLOCK (2026-05-26)', desc:'Codex가 c3d99b4 재검수 결과 기능 PASS, 디자인 BLOCK. 진단: 첫 화면이 「검은 배경 위 작은 한국 + 큰 우측 패널」 = 게임 메인 아닌 대시보드. 한국이 화면 주인공 아님. 우측 inspector 너무 큼. 모바일 390 inspector가 지도 덮음. 색·재질 평평. 처방: 최종 1개 고정 X — 박사 비교 선택용 4 variant 동시 빌드. (A 상황실 / B 전략 테이블 / C 민심 펄스 / D 위기 대응) + 모바일 bottom-sheet. Codex 1순위 추천: B Strategic Map Table.' },
      { type:'핵심', title:'KGS-ART-3: 4 Variant 시스템 (박사 비교 선택 대기) (2026-05-26)', desc:'4개 디자인 후보 동시 구현. (1) variants/{types, manifests, useVariant}.ts + VariantSwitcher 좌하단 4-버튼 + URL ?variant= 동기화. (2) Three theme override per variant — colorsFromVariant + poiCategoryColorFromVariant. sceneSetup이 variant bgColor / initialZoom / cameraRotationX 옵션 받음. (3) 4 manifest: A situation(navy+ivory+gold zoom 11) / B table(wood+brass+ivory zoom 10.5 tilt -0.08rad) / C pulse(data dark+cyan+opinion-default-ON zoom 10) / D crisis(rust+khaki+amber zoom 9.5 alarm ring). (4) POI marker shape per variant: hex/circle/circle/rounded-square. (5) variants.css — body[data-variant=X] 토큰 override + variant별 inspector 폭(340-380px) + 모바일 ≤640px bottom-sheet + 가로 rail. (6) Chrome headless 12 screenshot 캡처 — 4×3 (1600×1000 / 1366×768 / 390×844). internal/notes/screenshots/ 영속. (7) Claude 1순위 추천: B (Codex와 일치). 박사 결정 한 마디 대기.' },
      { type:'이슈', title:'박사 + Codex #3 지시: 지도 디테일만 (HUD 금지) (2026-05-26)', desc:'박사 명령: 「지도에 대한 디테일부터 잡고 들어가야만한다. 카툰 느낌의 3D로 아기자기한 대한민국 지형과 건물 등의 윤곽이 나타나도록」. Codex 영문 명세 전달: KGS-MAP-3 — Stylized 3D Korea Terrain + Zoom-Reveal Landmark Detail. 요구: ExtrudeGeometry province plate + bevel + 태백산맥 능선 + 내륙 언덕 + 도시 빌딩 클러스터 + 9 POI 미니어처 silhouette + zoom level별 reveal LOD + 카툰 머티리얼 + Lambert/directional light. 절대 금지: HUD 재디자인 / SVG 회귀 / 외부 타일 / postprocessing / decorative orb.' },
      { type:'핵심', title:'KGS-MAP-3: 카툰 3D 미니어처 지도판 (2026-05-26)', desc:'박사+Codex 명세 전면 반영. 7개 신규/수정 파일. (1) koreaLayer 입체화 — ShapeGeometry → ExtrudeGeometry depth 0.8 (제주 0.4) + bevel + top/side dual MeshLambertMaterial + 두꺼운 해안선 + 얇은 내부 경계. (2) terrainLayer 신규 — 태백/소백/차령/노령 4 산맥 ConeGeometry InstancedMesh ~60 + 내륙 14 hill SphereGeometry InstancedMesh (실제 위경도 spine 기반). (3) routeLayer 신규 — 4 도로 회랑(서울-부산/서울-인천/서울-춘천/대전-광주) + 한강 cyan curve + 8 도시 130 buildings InstancedMesh deterministic 시드. (4) landmarkLayer 신규 — 9 POI 각각 procedural 3D silhouette: 대통령실(dome+wing+gold marker) / 국회(반구) / 세종(blocks chain) / 부산항(pier+컨테이너+크레인 3개) / 인천공항(활주로 2개+터미널+관제탑) / 삼성수원(campus+chip blocks) / 현대울산(sheds 4) / KEPCO(송전탑 3) / 대덕(blocks+dome+antenna). (5) mapLod 신규 — zoom 3 silhouette / 4 terrain+route / 5 buildings / 6 landmarks. (6) cartoonMaterials 신규 — Lambert + ambient 0.65 + directional key 0.95 + fill 0.35. (7) ThreeMapStage 통합 + URL ?zoom/cx/cy override 검증용. 빌드 PASS 2.09s 220 modules JS gzip 219KB. Headless 5 screenshot 캡처 — zoom 4 미니어처 효과 분명. internal/notes/screenshots-map3/. 알려진 마이너: ortho 카메라 정사 시점이라 zoom 11 initial에서 plate 입체감 약함 (다음 슬라이스 카메라 살짝 기울이기 권장) / zoom 6 카메라 clamp 필요.' },
      { type:'핵심', title:'Codex 메인 개발 인수 — 게임플레이 엔진 본격 구축 (2026-05-29)', desc:'KGS handoff(9816287)로 Codex가 메인 개발 인수(Claude는 프론트엔드 별도). Phase 1 게임플레이 엔진 11커밋 — 정책 region 효과(economyIndex/infrastructureScore) 배선, 이벤트 만료를 다음 월 경계로, 국회 의석 점유율→통과확률 반영, 탄핵 리스크 월간 압력 경로, 부처 competence/loyalty·참모 능력치를 정책/위기 결과에 연결, 예산 회계연도 리셋, month 60 플레이 가능, 죽은 gameApi facade 제거. 월간 위기 생성 시스템 + 한국형 위기 템플릿 풀, 세이브/로드(박사 v1 승인) 추가. typecheck/build PASS, test:game 35/35.' },
      { type:'완료', title:'Codex 검수 BLOCK → 위기 lifecycle 4건 해소 (2026-05-29)', desc:'Codex 검수가 위기 생성이 엔진 월루프가 아닌 store에만 배선된 점 + contained/resolved 위기를 active로 오인하는 status-blind reader들을 BLOCK 지적. 후속 커밋(090e216)에서 canonical 월진행 + 활성위기 status 일관 + 2-step 정리 + 세이브 UI 검증(C1~C4)으로 해소. (Three.js 지도 NaN bounding-sphere 콘솔 경고 1건은 비치명적 — Codex 영역 후속 정리 대상.)' }
    ],
    milestones: [
      { date:'2026-05-26', title:'설계 v0.1 — Map-first 정치 시뮬 명세 (20개 섹션)', desc:'한지+슬레이트+단청 13색 + 인장 아이콘 + 6종 애니메이션 어휘 + 7단 줌 + 26 layer stack + 5 schema + 9 subagent harness + originality 14항 + Risks + M1~M10 일정.' },
      { date:'2026-05-26', title:'구현 계획 v0.1 — M1~M11 마일스톤', desc:'리포 구조 · 정적 지도 · 줌 · 행정구역 · POI · 스키마 · store · 패널 · 레이어 토글 · 정책 타게팅 · 테스트. 12주 추정 + newton/codex 트랙 분배.' },
      { date:'2026-05-26', title:'M0 vertical slice — Vite + React + 33 파일', desc:'설정 7 + 스키마 7 + mock 데이터 5 + state 2 + map components 9 + panels 2 + layers 1 + UI 1 + styles 3 + utils 2 + subagent review 1. tsc 0 에러, vite build 858ms, dev 부트 317ms.' },
      { isCore:true, date:'2026-05-26', title:'실 GeoJSON 전면 교체 — Natural Earth + southkorea-maps', desc:'손코딩 mock 폴리곤 → 실 데이터. d3-geo Mercator projection 도입. 17 광역시도 진짜 경계 + 177국 진짜 형상 + POI 10개 실 위경도. 박사 지적 즉시 복구.' },
      { isCore:true, date:'2026-05-26', title:'Frontend Art Direction Rebuild — Presidential Situation Room', desc:'박사 「visual quality not acceptable」 지적 즉시 복구. 한지 톤 폐기 → dark navy + 시안 + 골드 정부 톤. 풀스크린 5-영역 게임 그리드(top status + left rail + center map + right inspector + bottom timeline). 한국 cream hero + 골드 halo + 시안 selected glow. POI 육각형 셸 + 한자 글리프 + 펄스. 옛 컴포넌트 7개 폐기, 신규 11개 + CSS 10개 작성.' },
      { isCore:true, date:'2026-05-26', title:'KGS-MAP-2 — Three.js 2.5D + Floating HUD (Codex 처방 반영)', desc:'박사 Codex 검수 패스. SVG → Three.js Ortho 전면 전환. ref/RAF damped camera로 React state 우회 → 렉 제거. CSS grid → full-bleed stage + glass HUD overlay → 게임 화면 일체감. World 단일 mesh + Korea 17개 mesh + POI InstancedMesh × 7 카테고리. Raycaster picking. 옛 SVG 10개 폐기.' },
      { isCore:true, date:'2026-05-26', title:'KGS-MAP-2 fix — Codex 검수 #1 BLOCK 해소', desc:'SVG translate offset이 Three camera position에 누설되어 검은 화면 발생. Codex 진단 정확, 처방 즉시 반영. initial-state Three convention 재정의 + store cameraResetNonce + CameraController bridge subscribe. Chrome headless 1600×1000 검증 통과 — 한국 본토 정확 표시.' },
      { isCore:true, date:'2026-05-26', title:'KGS-ART-3 — 4 Visual Direction Candidates (박사 비교 선택)', desc:'Codex 검수 #2 처방. 1개 고정 X — 4 variant 동시 빌드. A 상황실(navy+gold) / B 전략 테이블(wood+brass · Codex 1순위 추천) / C 민심 펄스(data+cyan opinion default ON) / D 위기 대응(rust+amber alarm ring). URL ?variant=switcher 좌하단. 모바일 bottom-sheet. Chrome headless 12 screenshot 캡처 영속. 박사 한 마디 발화로 1개 선택 + 나머지 폐기.' },
      { isCore:true, date:'2026-05-26', title:'KGS-MAP-3 — 카툰 3D 미니어처 지도판', desc:'박사+Codex #3: 지도 디테일만. ExtrudeGeometry plate + 태백산맥 능선 + 한강 + 도시 빌딩 cluster + 9 POI 미니어처 silhouette + zoom 4/5/6 reveal LOD + Lambert+조명. zoom 4 screenshot에서 카툰 미니어처 효과 명확 확인.' },
      { isCore:true, date:'2026-05-26', title:'KGS-MAP-9/10/11 — Aerial map + Ground-Level (청와대만)', desc:'Google-Earth 스타일 휠 줌 카메라(MapCameraRig). 박사 명시 승인 사이트만 ground-level view 진입 — 청와대 청기와 미니어처(prism+정원+wings). north-up 회전 X. block-scale 깊은 줌(distance 700→1.2). 모든 props 제거. URL ?descent/?cx/?cy/?ground=cheongwadae 검증.' },
      { isCore:true, date:'2026-05-26', title:'KGS-MAP-12 — Clean 2D Aerial + Ground-Level 3D 분리', desc:'aerial 모드에서 청와대 3D building 강제 hide(우측 상단 GROUND-LEVEL VIEW 버튼만). 색 팔레트 자연 톤 — pale sage(#D8DCC4) + soft blue-gray + muted slate. ExtrudeGeometry depth 0.8→0.08 평면화. ground 모드 진입 시에만 입체.' },
      { isCore:true, date:'2026-05-27', title:'KGS-MAP-13 — 다국어 라벨 + 북한 + MDL', desc:'CSS2DRenderer 라벨 layer. 6 locale(ko/en/ja/zh/es/pt). 17 시도 + 28 외부국가 + 25 서울 자치구 + 1 동 시드 + MDL 9-point APPROX. 박사 standing "fake geographic data 금지" 준수 — staged 완성도 README.md 영속화. LanguageSelector 우측 상단 토글 + URL ?lang=. fallback chain locale→en→ko→id. 8 screenshot.' },
      { isCore:true, date:'2026-05-27', title:'프로젝트 표시명 확정 — 2026 PRESIDENT KOREA', desc:'박사 발화. 가칭 "대한민국 60" 폐기. 게임 헤더/title/README/tokens.css 주석/dashboard 카드 갱신. repo 폴더명·Git remote는 korea-gov-sim 그대로.' },
      { isCore:true, date:'2026-05-27', title:'Standing rule — ADDRESS & MAP PLACEMENT', desc:'박사 standing. 모든 entity는 roadAddress + province + city + hubCluster(10-hub) 필수. lat/lng invent 금지 — 미보유 시 needGeocode=true + mapPlacementMode=address_based_cluster + coordinateStatus=not_generated. 동일 청사 공유 entity는 stacked/radial fan-out, overlap pins 금지. internal/notes/ADDRESS_MAP_PLACEMENT_RULE.md 영속화.' },
      { isCore:true, date:'2026-05-27', title:'Entity dataset 44 record 영속화 (박사 patch 직접 반영)', desc:'박사 ADDRESS-INJECTED CORRECTION & EXPANSION PATCH 1·2. src/data/entities/ 신설 — types.ts + government.ts(19 중앙정부) + public-institutions.ts(25 공공기관) + registry.ts(KGS-CODEX-2 pattern 정합) + README.md + HUB_MAP.md. 좌표 0건 invent — 43건 needGeocode=true, 1건(NIS) secure_region. 14-hub primary axis.' },
      { isCore:true, date:'2026-05-27', title:'KGS-CODEX-1 — Codex map selection 복구', desc:'Codex 직접 patch (commit 92670c9). picker=null 폐기 → 실제 Picker 인스턴스. picking.ts POILayer nullable. ground-level picking 차단. 첫 화면 ROK national(descentT 0.3). VariantSwitcher ?variants=1만 노출. 모바일 HUD 보정. CDP probe 검증 PASS.' },
      { isCore:true, date:'2026-05-27', title:'KGS-CODEX-2 — Codex 카메라 LOD 계약', desc:'Codex 직접 patch (commit 4906880). CameraState에 descentT/detailLod/viewMode 추가, scale legacy. setCameraView() store action 신설. utils/zoom DEFAULT_KOREA_DESCENT_T + descentT↔scale/zoomLevel/detailLod 변환. data/labels/registry.ts + lodPolicy.ts 신설 — labelLayer 직접 import 폐기, registry 단일 진입. ZoomLevelBadge "ZOOM 5 / PROVINCE / 30%" detailLod 기반.' },
      { isCore:true, date:'2026-05-27', title:'KGS-MAP-14 — Codex entity building layer', desc:'Codex 직접 patch (commit 0f33edc). 진단: entity dataset 44건 있는데 ThreeMapStage 연결 누락. hub-anchors.ts 신설(14-hub visual anchor, 좌표 invent 없이 address_based_cluster fallback). entityBuildingLayer.ts(490줄) 신설 — complexId/hub 기준 미니 청사 stacked/campus 렌더, S/A priority LOD threshold, ground-level hide. ThreeMapStage RAF에서 cameraRig.curT 기준 실시간 LOD. public_institution layer toggle 연결.' },
      { isCore:true, date:'2026-05-31', title:'취임 시네마틱 — 3D 카툰 실시간 컷신 (Claude, 이벤트 영상 PoC)', desc:'박사 지시 「취임하는 이미지를 3D 카툰 느낌의 AI 시네마틱으로 구현해서 보여줘」. 게임 이벤트(취임·위기·선거 등)에 영상을 삽입하는 파이프라인의 첫 PoC로, 외부 AI 영상 모델 대신 결정론·자산0·동적 임베드가 가능한 Three.js 실시간 3D 카툰 컷신으로 구현. 청와대 톤 원형 무대 + 골드 카펫 + 연단(대통령 엠블럼·마이크) + 카툰 대통령 캐릭터(오른손 들어 취임 선서 제스처) + 휘날리는 태극기(canvas 태극·4괘 텍스처) + 환호하는 관중 실루엣 26 + 색종이 260 InstancedMesh + MeshToonMaterial 셀셰이딩 + 3점 조명+림라이트. 카메라는 와이드 오프닝→연단 3/4 돌리인(smoothstep 6s), 14s 루프, 시네마틱 레터박스+비네트, 상단 타이틀 「2026 · 대한민국 대통령 취임」 페이드인 + 선서 서브타이틀, 다시보기 버튼. 단일 self-contained HTML(three 0.160 importmap), Playwright headless 3컷 검증 콘솔 에러 0. claude/previews/inauguration-cinematic/. 추후 MP4 프리렌더 또는 실제 AI 클립으로 교체 가능. (게임 엔진=Codex 트랙 불변, 본 컷신은 Claude 프론트 자산.)' },
      { isCore:true, date:'2026-05-27', title:'KGS-MAP-15 — Codex 건물 inspector 연결 (게임 오브젝트화)', desc:'Codex 직접 patch (commit 8bf55fa). 진단: #14에서 building이 scene에 보였지만 region/POI picker와 inspector contract에 미연결 → 장식처럼 보였음. entity-sites.ts 신설(44건을 complexId 또는 개별 site로 정규화 + label/priority/kind/기관목록 공유). entityBuildingLayer body/roof/window/trim/courtyard/shadow 디테일 보강 + hover/selected focus ring + 실제 mesh hit 우선(invisible hit padding fallback). picking.ts entitySite type 추가, building layer를 region/POI 앞단에 연결. ThreeMapStage hover cursor/tooltip/click selection/ESC clear/store subscription을 entity site까지 확장. HoverTooltip entity site tooltip(hub/기관수/priority/배치방식). RegionInspectorPanel entity site 전용 inspector(배치 계약/geocode 대기수/소속 기관/gameplay role/sector). schemas/map-state selection type에 entitySite 추가.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-2 — 최종 통합 지도 (외부 음영 + 북한·MDL + entity 데이터)', desc:'박사 발화 "최근에 만든 녹색 바탕 지도 느낌에다가 전세계 지도 어두운 색으로 대비 음영, 북한·군사분계선, 공공기관 데이터 넣어서 최종 완성". NANO manifest worldLand 0xC8D89E→0x4A5C40 짙은 sage (한반도 라임과 강한 명도 대비). worldLayer clay early return 제거, 외부 land 정상 렌더(outline만 hide 유지). 박사 4요구 매트릭스: ✅ 녹색 라임 한반도 hero ✅ 전세계 외부 land 짙은 sage 음영 ✅ 북한 distinct + MDL 군사분계선 ✅ 44 entity record + 25 자치구 + 청와대 GROUND-LEVEL 버튼. screenshot: final-2-far-with-world (시야 멀리 한반도 + 외부 음영 + cloud), final-3-seoul-deep (Seoul 라임 + MDL + 중국 음영), final-5-seoul-buildings (25 자치구 + GROUND-LEVEL). 롤백 = ?variant=situation 또는 git checkout pre-nano-banana.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-1b — Nano Banana reference 정합 강화 (4영역)', desc:'박사 발화: "이미지 파일 예시용처럼 만들라니까? 그게 어려워?" v1 약점 즉시 보강. commit afe571b. ① worldLayer clay 모드 early return → 외부 land 완전 hide (한반도 isolated). ② cloud scale 42~60→95~130 (2배 prominent) + LOD fade 임계 0.30/0.50→0.55/0.75 (더 오래 visible). ③ koreaLayer clay 모드 drop shadow plane 2단(메인+컨택, opacity 0.22/0.30). ④ halo line opacity 0 (부드러운 클레이는 outline 없음). 시도하고 롤백: koreaLayer.group.rotation.x=-0.22 (한반도 화면 밖 사라짐). 남은 약점: 카메라 정수직 두께 표현 / HUD 라이트 모드 / silhouette simplification.' },
      { isCore:true, date:'2026-05-27', title:'KGS-ENGINE-2 — Codex 게임 엔진 realtime clock hardening', desc:'Codex 직접 patch (commit 19f1a41). src/game/tests/clock.test.ts 신규(105줄, 9 tests) — paused initial state, pause/resume, valid/invalid timeScale, paused tick blocking, forced tick, day advancement, daily/weekly/monthly/quarterly hooks, term finish, full 5-year accelerated simulation 검증. ScheduledUpdateSystem.ts weekly trigger deterministic 7-day interval 보정 (calendar rollover 아닌 누적 days). shared/validation.ts GameClockState 검증 범위 확장 — elapsedDays/remainingDays/termProgress + 5 last update dates. scripts/run-game-tests.mjs 신규 — esbuild + Node test runner. package.json npm run test:game 추가. 검증: 9/9 PASS + 5-year accelerated 완주 term_finished.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-1 — Gemini Nano Banana variant 신설 (롤백 안전망)', desc:'박사 발화 "지금 지도 모습으로 롤백할 수 있게 준비해놓고, 설계대로 만들어서 보여줘". commit cd63af6 + tag pre-nano-banana(e1d891a) 롤백 baseline push. 신규 NANO manifest(5번째 variant): 라임 #A5C946 land / 청록 #9CD8E8 bg / 옅은 라임 외부 land / koreaEdgeWidth 0 / koreaTextureMode "clay". koreaLayer textureMode 분기 — clay 모드는 depth 0.55 + bevel 0.18 두꺼운 클레이, outline LineSegments / innerEdge 제거. worldLayer 외곽선 hide. cartoonMaterials setupCartoonLighting clay 분기 — ambient 0xE8F4F8 0.85, keyLight 0xFFF5DC 0.55 (soft sun), HemisphereLight 0xE8F4F8↔0xA5C946 추가. cloudLayer 신규(296줄) — 6개 미소 cloud sprite(canvas texture: 흰body+얼굴+pink cheek+smile), descentT < 0.30 visible / 0.30~0.50 fade / >0.50 invisible, gentle drift. 백엔드 영향 없음 — KGS-ENGINE / entity dataset 44건 / labelLayer / picker 모두 그대로 작동. 롤백 = ?variant=situation 또는 git reset --hard pre-nano-banana.' },
      { isCore:true, date:'2026-05-27', title:'KGS-ENGINE-1 — Codex 게임 엔진 backend foundation', desc:'Codex 직접 patch (commit 4b81f0e). src/game/ 독립 엔진 계층 신설(1646 lines, 13 파일). core/GameState.ts: 2026 PRESIDENT KOREA Ground Truth 계약(대통령·clock·approval·economy·budget·media·liveFeed·cabinet·ministries·국회·judiciary·local governments·policies·events·crises·diplomacy·security·social metrics·election·notifications·schedule). core/GameInitializer.ts: createInitialGameState/cloneGameState/getGamePhase/isGameOver/migrateGameStateIfNeeded. core/GameClock.ts: pauseGame/resumeGame/setTimeScale/advanceClockByDays + term progress selectors. shared/* engine constants·types·utils·validation. selectors/* dashboard·map view-model. api/gameApi.ts in-memory facade(frontend 직접 engine state 조작 금지). 박사 standing: Phase 1은 UI 비침습 엔진 골격 — 정책 30개, 이벤트 40개, region/ministry dataset, full simulation loop는 후속 Phase.' },
      { type:'핵심', title:'Nano Banana Korea — 전면 미학 전환 설계 + mockup 2종 (2026-05-27)', desc:'박사 발화: "지금 구현된 한반도 지도가 아닌, 이 느낌의 이미지대로 한반도 지도를 싸그리 뜯어 고쳐서 구현. 구현에는 박사 오더 전까지 실행하지마. 설계 진행한 다음에 결과물부터 보여줘." 박사 reference: Gemini Nano Banana 10 시야 한반도 (라임 #A5C946 + 청록 #5CB0CC + 미소 cloud + 클레이 토이). internal/notes/REDESIGN_NANO_BANANA.md 영속화 — 10 시야 분석, 현 구현 충돌 매트릭스, 결정 트리 A(variant 신설) / B(default 교체, 권장) / C(별도 mode), 변경 영향 영역, KGS-NANO-1~8 단계. sample-nano-1-national.html(한반도 클레이 3D + 4 미소 cloud) + sample-nano-10-street.html(isometric 카툰 도시 + ranch 집 + 강 + 다리). production 코드 미수정 (박사 standing 명시). 박사 결정 트리 발화 대기.' },
      { type:'완료', title:'세션 종료 — Codex 핸드오프 영속화 (2026-05-27)', desc:'박사 발화 "멈추고 했던곳까지 저장, 코덱스가 확인할 수 있게 준비". internal/notes/HANDOFF_TO_CODEX_2026-05-27.md 신설 — 현재 위치(KGS-NANO-3 HEAD, 박사 만족 미확인) / standing rules 8건 인덱스 / Vite+React+Three.js+Engine 스택 cheat-sheet / receipt 인덱스 / screenshots-map14 untracked dir 플래그 / 박사 결정 대기 4건(NANO-3 OK여부, nano default 여부, NANO-4~8 우선순위, ENGINE Phase 3) / 트랙 분리(engine=Codex, map=Claude) / 로컬 검증 명령. commit b800cb8 push. Codex가 git pull 한 번이면 컨텍스트 잡힘.' },
      { isCore:true, date:'2026-05-28', title:'KGS-ENGINE — 게임플레이 엔진 시스템군 (Codex)', desc:'월간 이벤트 덱·국회 협상·부처/참모 friction·정책 region 효과·예산 회계연도 등 게임 시스템을 src/game 엔진 계층에 구축. 결정론 월루프 + dashboard/map selector + 검증/어댑터.' },
      { isCore:true, date:'2026-05-29', title:'Codex 메인 개발 인수 + 위기/세이브 + 테스트 35/35', desc:'handoff 9816287로 Codex 메인 인수. 월간 위기 생성+한국형 템플릿, 세이브/로드, 탄핵 리스크, month 60 플레이 가능. Codex 검수 BLOCK 위기 lifecycle 4건 해소(090e216). test:game 35/35 PASS. 대시보드 VIEW LIVE 미리보기를 이 최신 빌드로 갱신(progress 1%→35%).' }
    ]
  },
  {
    id: 'jpglobal-web',
    name: 'Frontend & Tone Atelier',
    subtitle: '프론트엔드 웹디자인 + 색감 톤 시범 워크숍 · 부산 거점 글로벌 해운 기업 JP GLOBAL 사이트로 테스트',
    icon: 'building',
    platform: '정적 웹사이트 · HTML/CSS/Vanilla JS',
    status: 'in-progress',
    start: '2026-05-27',
    latest: '2026-05-27',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/jpglobal-web/',
    preview: { type:'embed', items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/jpglobal-web/',            label:'Home — 화사한 톤 + 풀스크린 SVG 히어로(부산항) + 11섹션 (Brand Promises / About / Services / What We Do / Projects / Capabilities / Testimonials / Join / Contact / Partners / Footer)' },
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/jpglobal-web/about.html',  label:'About Us — page hero + Company Profile + Mission Statement + History timeline 5건 + Values 4 + Reference 4' }
    ]},
    summary: 'G.M.PARK이 프론트엔드 웹사이트 디자인 + 색감 톤 구현 워크플로우를 점검하는 시범 프로젝트. '
           + '시범 대상으로 부산에 위치한 글로벌 해운 기업 JP GLOBAL CO.,LTD의 웹사이트(jpglobal.kr)를 채택 — '
           + 'G.M.PARK 본인이 소속된 회사가 아니라 외부 디자이너 입장에서 실사이트를 test subject로 사용. '
           + '같은 도메인의 동일 콘텐츠를 두고 코퍼레이트 톤(HMM21·COENS) → 라이트 클린 톤 → '
           + 'Plus X 미니멀 다크 톤까지 다중 시안을 영속화하며 디자인 언어를 단계별로 실험.',
    method: '(1) jpglobal.kr 콘텐츠 전량 추출 → 진짜 회사 정보(사명·슬로건·사업 3종·프로젝트 4종·부산 연락처)와 '
          + '버려진 워드프레스 건설 테마 데모 잔재(Construction Management / Mining Infrastructure / '
          + 'Lorem ipsum 증언글 / © Seven Construction 2016 푸터) 분리. '
          + '(2) 디자인 토큰 — deep navy #0a2540 (HMM21 기조) + bronze #b88a3e (한국적 모던 럭셔리 큐) + Pretendard 한글 폰트. '
          + '(3) 풀스크린 SVG 히어로(부산항 컨테이너선·크레인 실루엣) + About 분할 + Services 3카드 + Projects 4카드 + '
          + 'Capabilities 다크 밴드 + Contact CTA + 5컬럼 푸터. '
          + '(4) 반응형 + 스티키 헤더 + 모바일 nav 클론 + IntersectionObserver 리빌. '
          + '(5) ../jpglobal-web 신규 폴더, git init, 로컬 http.server 5050 띄움.',
    stack: ['HTML5', 'CSS3 (custom vars + Grid)', 'Vanilla JS', 'Pretendard', 'SVG'],
    stackDetail: [
      { area: '전체 정적 사이트 구조·페이지', tech: 'HTML5', how: 'index.html(11섹션)과 about.html을 직접 작성하고, GNB의 About Us 링크를 about.html로 연결해 is-current 표기까지 마크업으로 구성했다.' },
      { area: '색감 톤·디자인 토큰 시스템', tech: 'CSS3 (custom vars)', how: 'deep navy·bronze 토큰을 시작으로 화이트·스카이·크림 라이트 톤, 이후 검정·화이트·orange의 Plus X 톤까지 커스텀 변수 기반으로 단계별 시안을 교체했다.' },
      { area: '섹션·카드 레이아웃', tech: 'CSS3 (Grid)', how: 'Services 3카드, Projects 4카드, What We Do 6카드, Values·Reference 4카드 등 다중 카드 영역과 5컬럼 푸터를 그리드 레이아웃으로 배치했다.' },
      { area: '풀스크린 히어로 일러스트', tech: 'SVG', how: '부산항 컨테이너선·크레인 실루엣을 SVG 히어로로 그리고, v2에서 화이트·스카이·크림 그라데이션과 컬러풀 컨테이너 야드로 톤을 재조정했다.' },
      { area: '반응형·인터랙션 동작', tech: 'Vanilla JS', how: '스티키 헤더, 모바일 nav 클론, IntersectionObserver 기반 리빌을 바닐라 JS로 구현했다.' },
      { area: 'v3 Plus X 톤 인터랙션', tech: 'Vanilla JS, CSS3 (custom vars)', how: 'corner fixed UI 4종, mix-blend-mode difference 자동 invert, 풀스크린 오버레이 nav, IntersectionObserver 단어 단위 텍스트 마스크 reveal, RAF lerp 커서 follow dot, 좌하 KST 실시간 시계를 직접 작성했다.' },
      { area: '한글 타이포그래피', tech: 'Pretendard', how: '한국어·영문 병기 콘텐츠 전반에 Pretendard 한글 폰트를 적용해 본문·타이틀 텍스트를 표시한다.' },
    ],
    issues: [
      { type:'핵심', title:'기존 사이트의 워드프레스 건설 테마 데모 잔재 발견 (2026-05-27)', desc:'jpglobal.kr 분석 중 진짜 회사 콘텐츠 외에 The7 워드프레스 건설 테마 데모가 그대로 남아있는 흔적 다수 발견 — Construction Management / Facility Maintenance / Mining Infrastructure / Pavement Preservation / Residential Construction / Site Location 6개 placeholder 카드, Lorem ipsum 증언글(Gregor Blackwod 등) 3건, "© Seven Construction 2016" 푸터, hello@dream-theme.com 이메일, 011-987-65-43 전화 등. 로지스틱스 회사인데 건설 테마 데모가 라이브 상태로 노출 중. 새 사이트엔 전부 제거. 박사가 "다 살려" 지시 시 복구 가능.' },
      { type:'완료', title:'v1 첫페이지 빌드 — 6섹션 풀 코딩 (2026-05-27)', desc:'index.html(530줄) + css/style.css(약 750줄) + js/main.js. 히어로(2014 부산 설립 강조 + 4 stat) / About(EST.2014 배지 + 3 pillar) / Services(Port Operations·Shipping Agency·Support Services) / Projects(TCO·Martin Linge·Wind Resource·SR Input SVC) / Capabilities 밴드 / Contact + 5컬럼 푸터. 한국어/영문 병기.' },
      { type:'이슈', title:'박사 브라우저 시각 확인 대기 (2026-05-27)', desc:'로컬 http://127.0.0.1:5050/ 서빙 확인(HTTP 200, 18.5KB). Claude는 CLI 환경이라 실 브라우저 렌더링은 직접 못 봄. 박사가 브라우저로 열어 톤·디테일 확인 후 수정 지시 필요. 깃허브 push는 박사 결정 대기.' },
      { type:'핵심', title:'v2 톤 라이트닝 — 박사 피드백 "조금 더 밝고 화사하게" 반영 (2026-05-27)', desc:'deep navy(#0a2540) + bronze 베이스 → 화이트/스카이/크림 베이스 + golden honey + soft coral 액센트로 전면 교체. 히어로 SVG 어두운 navy → 화이트→스카이→크림 그라데이션 + sunset glow + 컬러풀 컨테이너 야드(coral/gold/sky/navy 믹스). 푸터·utility bar·band 섹션 톤 동시 조정. 카드 hover shadow 더 부드럽게.' },
      { type:'핵심', title:'v2 원본 jpglobal.kr 잔재 풀 복원 (걷어낼 거는 _curate-list.md로 영속) (2026-05-27)', desc:'박사 지시 "기존 jpglobal.kr 문구로 우선 진행, 나중 정리할 용어 따로 간추림" 반영. 5개 섹션 신설: Brand Promises 3-row(Highly Skilled Team / People Technology / Large to Small) + What We Do 6 카드(Construction Management / Facility Maintenance / Mining Infrastructure / Pavement Preservation / Residential Construction / Site Location) + Testimonials 3건(Gregor Blackwod / Tiffany White / Charles Dug) + Join Our Team CTA + Partners 6(Design & Build 외). 모두 원본 Lorem ipsum 그대로 보존. 정리 대상 카탈로그는 _curate-list.md 영속화(워드프레스 The7 건설 테마 잔재 분류 + 박사 결정 대기 4항목).' },
      { type:'핵심', title:'v2 About Us 페이지(about.html) 신설 (2026-05-27)', desc:'다음 페이지 진입 — 메뉴 트리 첫 항목. page hero(breadcrumb + 큰 타이틀 + lead) + Company Profile 재구성 + Mission Statement(label + 큰 카피 + pull quote) + History Timeline 5건(2014/2015-17 TCO/2018-20 Martin Linge/2021-23 풍력+산업/2024 10주년) + Values 4 카드(Client First/Tailor-Made/Specialist Team/Busan Roots) + Reference 4 카드 + Contact band + 푸터. GNB About Us 링크 about.html로 연결, is-current 표기. 브라우저 200 OK 18KB 확인.' },
      { type:'완료', title:'GitHub repo 생성 + push — gmpark-creator/jpglobal-web (private) (2026-05-27)', desc:'박사 지시 "커밋 푸쉬 레포저장도 프로젝트 6번에 따로 빼서 진행" 반영. gh repo create로 private 리포 생성. v1+v2 commit 2건 push 완료. URL: https://github.com/gmpark-creator/jpglobal-web (private). 박사 다른 프로젝트(DDuim/korea-gov-sim 등)와 동일 패턴.' },
      { type:'완료', title:'세션 종료 — Codex 핸드오프 영속화 + 로컬 서버 종료 (2026-05-27)', desc:'박사 발화 "멈추고 했던곳까지 저장, 코덱스가 확인할 수 있게 준비". internal/notes/HANDOFF_TO_CODEX_2026-05-27.md 신설(왜 존재 / v1+v2 ground truth / 11+6섹션 인벤토리 with WP 데모 ⚠️ / 박사 standing rules / pending 5건 / Codex가 cross-check할 7항목 / out-of-scope / 검증 명령 / 트랙 분리 프로토콜) + commit 9b321f6 push. 로컬 5050 dev 서버 PID 28268 정상 종료. Codex가 git pull 한 번이면 컨텍스트 잡힘.' },
      { type:'핵심', title:'v3 Plus X 톤 인터프리테이션 — monochrome + orange + 극대형 타이포 (2026-05-27)', desc:'박사 발화 "plus-ex.com/about 효과·스택·언어 모방, 톤·분위기 카피, 콘텐츠는 jpglobal 그대로 유지" 반영. 디자인 토큰 전면 교체: 라이트 cream → 검정 #0a0a0a + 화이트 #fafafa + orange #ff4f00. 헤더+nav 폐기 → corner fixed UI 4종(좌상 로고/우상 햄버거/좌하 KST 실시간 시계/우하 섹션 인덱스). mix-blend-mode: difference로 다크↔라이트 섹션마다 corner UI 자동 invert. 풀스크린 오버레이 nav + stagger fade-up. IntersectionObserver 텍스트 마스크 reveal(단어 단위 splitting + per-word stagger). RAF lerp cursor follow dot. 11 섹션 모두 data-index + data-theme 마킹. About 페이지도 6 인덱스 동일 톤 재구성. 콘텐츠 100% 동일 보존(원본 WP Lorem 잔재 포함). IP 안전: plus-ex 코드 미참조(SPA 셸만 옴), 디자인 언어 reinterpretation만, HTML/CSS/JS 처음부터 직접 작성. 롤백 안전망 v2-bright tag.' },
      { type:'완료', title:'v3 commit ceb22b8 push + dashboard previews 동기화 (2026-05-27)', desc:'jpglobal-web/master 푸시 완료. dashboard previews/jpglobal-web/ 폴더의 v2 파일 → v3로 교체. CSS 36KB / index 24KB / about 15KB. GitHub Pages 1-2분 후 라이브 데모 갱신.' }
    ],
    milestones: [
      { isCore:true, date:'2026-05-27', title:'프로젝트 신설 — JP GLOBAL 홈페이지 자체 리빌드 결정', desc:'박사 발화: 기존 jpglobal.kr이 워드프레스 외주로 운영비를 과하게 청구당하고 있어 자체 리빌드. coens.com + hmm21.com 톤 레퍼런스 지정. ../jpglobal-web 폴더 신설, git init.' },
      { isCore:true, date:'2026-05-27', title:'v1 첫페이지 빌드 완료 — deep navy 베이스', desc:'딥네이비+브론즈 디자인 토큰 + 풀스크린 SVG 히어로(부산항 컨테이너선) + 6섹션 + 반응형 + 모바일 nav. 로컬 5050 서빙 시작.' },
      { isCore:true, date:'2026-05-27', title:'v2 톤 라이트닝 + 원본 문구 풀 복원 + About 페이지 신설', desc:'박사 피드백 "조금 더 밝고 화사하게" 즉시 반영 → 화이트/스카이/크림 + golden honey + soft coral 팔레트 전면 교체. 원본 jpglobal.kr 5섹션(Promises/WhatWeDo/Testimonials/Join/Partners) 풀 복원. 워드프레스 데모 잔재 정리 후보는 _curate-list.md로 영속. About Us 페이지(about.html) 신설 — page hero + Mission + History 5 + Values 4 + Reference 4. index 32KB + about 18KB.' },
      { isCore:true, date:'2026-05-27', title:'GitHub repo 생성 + 푸시 — gmpark-creator/jpglobal-web (private)', desc:'박사 지시 "커밋 푸쉬 레포저장도 프로젝트 6번에 따로 빼서 진행". gh repo create로 private 리포 생성 + v1/v2 commit 2건 push. 박사 다른 프로젝트 패턴과 동일.' }
    ]
  },
  {
    id: 'us-kr-premarket',
    name: 'US-KR Premarket Signal',
    subtitle: '증권 — 미국 시장 종가가 한국 프리마켓에 미치는 영향 신호 대시보드',
    icon: 'trending-up',
    platform: '웹 앱 · Vite + React + TypeScript · Codex 트랙',
    status: 'in-progress',
    start: '2026-05-28',
    latest: '2026-05-28',
    progress: 30,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/us-kr-premarket/',
    preview: { type:'embed', height:600, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/us-kr-premarket/', label:'US-KR Premarket Signal — Phase 1 (Codex 빌드 dist, vite assets path 상대경로 변환)' }
    ]},
    summary: '미국 증시의 종가·매크로·테마 신호가 한국 프리마켓 시간대(KST 새벽~오전)에 미치는 영향을 분석·시각화하는 연구용 대시보드. '
           + 'Codex가 단독 트랙으로 설계+Phase 1 mock UI 완성 후, official 매크로 데이터 refresh 파이프라인까지 추가 — '
           + 'GitHub repo 생성·push 완료 (gmpark-creator/us-to-kr-premarket-impact-dashboard). '
           + 'safety 가드레일 유지 — "For research only. Not investment advice." 자동 주문·브로커리지·라이브 단일종목 데이터 금지. '
           + 'progress 30% (박사 발화 픽스).',
    method: 'Codex가 master 단일 트랙. Phase 1은 static fixture data 기반 mock UI만 — live provider, backend, DB migration, order routing 일체 미포함. '
          + 'Vite + React 18 + TypeScript + lucide-react. Dark report-dashboard 시각 언어 — "G.M.PARK dashboard reference" 명시 참조(near-black bg + paper text + orange accent + fixed corner UI + left nav + KST clock + report footer). '
          + 'UI 섹션: OverviewHero / OvernightMacroPanel / US Theme Heatmap / Theme Detail Drawer / KRX Pre-Market Signal Table / KRX Ticker Detail Panel / Data Quality·Run Audit Panel. '
          + 'docs/DESIGN.md + docs/PHASE1_RECEIPT.md 영속화 — Codex 특유의 receipt 패턴.',
    stack: ['Vite', 'React 18', 'TypeScript 6', 'lucide-react'],
    stackDetail: [
      { area: '프로젝트 골격·빌드', tech: 'Vite, TypeScript 6', how: 'Vite + React 18 + TypeScript 골격으로 Phase 1 정적 mock 대시보드를 셋업하고, npm install · typecheck · build · audit를 모두 PASS시켰다. Codex 빌드 산출물 dist를 vite assets path 상대경로로 변환해 미리보기 배포했다.' },
      { area: '대시보드 UI 섹션 구성', tech: 'React 18, TypeScript 6', how: 'src 아래 App · data · types · styles 구조로 OverviewHero, OvernightMacroPanel, US Theme Heatmap, Theme Detail Drawer, KRX Pre-Market Signal Table, KRX Ticker Detail Panel, Data Quality·Run Audit Panel 등 7개 UI 섹션을 mock data로 wiring했다.' },
      { area: '아이콘·시각 요소', tech: 'lucide-react', how: 'lucide-react 아이콘으로 다크 report-dashboard 시각 언어(near-black 배경 + paper text + orange accent + fixed corner UI + left nav + KST clock + report footer)를 구성했다.' },
      { area: '한국어 UI·도움말', tech: 'React 18, TypeScript 6', how: '한국어 라벨과 도움말 가이드를 추가하고 G.M.PARK dashboard 톤(dark + orange + corner UI) 시각 언어로 정렬했다. docs PHASE1_RECEIPT.md에 영속화했다.' },
      { area: '공식 매크로 데이터 refresh 파이프라인', tech: 'TypeScript 6, Node ESM 스크립트', how: 'scripts refresh-data.mjs를 신설해 FRED와 Bank of Korea ECOS 등 traceable 공식 소스를 우선 수집하고, data.generated.ts를 자동 생성해 USD/KRW · S&P500 · Nasdaq · Dow · VIX · US 10Y를 매핑했다. 소스 미확보 시 missing/delayed로 표시한다.' },
      { area: '정적 데이터·타입 정의', tech: 'TypeScript 6', how: 'Phase 1은 static fixture data 기반 mock UI만으로, live provider · backend · DB · order routing 없이 types로 데이터 형태를 정의하고 mock fixture로 각 섹션을 채웠다.' },
    ],
    issues: [
      { type:'완료', title:'Initial design — US-KR premarket signal 컨셉 정의 (Codex, 2026-05-28)', desc:'commit c613660. docs/DESIGN.md 영속화. 라이브 데이터 미사용·자동 주문 금지·연구 전용 safety rule 합의.' },
      { type:'완료', title:'Phase 1 — static mock dashboard UI 구현 (Codex, 2026-05-28)', desc:'commit da2284a. Vite+React+TS 셋업. src/ App·data·types·styles. lucide-react 아이콘. 7개 UI 섹션 mock data로 wiring. npm install / typecheck / build / audit 모두 PASS.' },
      { type:'핵심', title:'Phase 1 — Korean UI + help guide (Codex, 2026-05-28)', desc:'commit d62170c. 한국어 라벨 + 도움말 가이드 추가. docs/PHASE1_RECEIPT.md 영속 — 박사 dashboard 톤("G.M.PARK reference") 명시 참조로 dark + orange + corner UI 시각 언어 정렬.' },
      { type:'완료', title:'GitHub repo 생성 + push 완료 (Codex, 2026-05-28)', desc:'gmpark-creator/us-to-kr-premarket-impact-dashboard remote 등록 + master push. 박사 standing(다른 프로젝트와 동일 패턴) 충족.' },
      { type:'핵심', title:'Official 매크로 데이터 refresh 파이프라인 (Codex, commit f218f32)', desc:'scripts/refresh-data.mjs (+388줄) 신설. FRED + Bank of Korea ECOS 등 traceable 공식 소스 우선. data.generated.ts(+162줄) 자동 생성. docs/DATA_SOURCES.md 영속화 — USD/KRW · S&P500 · Nasdaq · Dow · VIX · US 10Y 매핑. 박사 standing "fake/guessed 데이터 금지" 준수 — 소스 미확보 시 missing/delayed로 표시.' },
      { type:'이슈', title:'박사 dashboard 등록 + 30% 픽스 (2026-05-28)', desc:'Claude가 폴더 발견 → 박사 "대시보드 7번으로 추가, 구현율은 30%로 고정" 발화로 정식 등록 + progress 1% → 30% 갱신. 향후 progress 변경은 박사 직접 발화 대기(standing).' }
    ],
    milestones: [
      { date:'2026-05-28', title:'Initial design — US-KR Premarket 컨셉 (Codex)', desc:'commit c613660. docs/DESIGN.md 영속. safety: 연구 전용 · 자동주문·브로커리지·라이브데이터 금지 명시.' },
      { date:'2026-05-28', title:'Phase 1 — static mock dashboard UI (Codex)', desc:'commit da2284a. Vite + React + TS 골격. mock fixture 데이터. typecheck/build/audit PASS.' },
      { isCore:true, date:'2026-05-28', title:'Phase 1 — Korean UI + help guide (Codex)', desc:'commit d62170c. 한국어 라벨 + 도움말 가이드. docs/PHASE1_RECEIPT.md 영속. G.M.PARK dashboard 톤 정렬.' },
      { isCore:true, date:'2026-05-28', title:'박사 dashboard #7 정식 등록', desc:'Claude가 폴더 발견 → 박사 발화 "대시보드 7번으로 추가" → projects-data.js에 등록. Codex 트랙 standing 유지.' },
      { isCore:true, date:'2026-05-28', title:'GitHub repo 생성 + push (Codex)', desc:'gmpark-creator/us-to-kr-premarket-impact-dashboard remote 등록 + master push. 박사 다른 프로젝트와 동일 패턴.' },
      { isCore:true, date:'2026-05-28', title:'Official 매크로 데이터 refresh (Codex, commit f218f32)', desc:'FRED + BoK ECOS 공식 소스 우선 + scripts/refresh-data.mjs + data.generated.ts + docs/DATA_SOURCES.md. 박사 "fake 데이터 금지" standing 준수 — missing/delayed 명시.' },
      { isCore:true, date:'2026-05-28', title:'박사 progress 30% 픽스', desc:'박사 발화 "구현율은 30퍼센트로 고정". 향후 갱신은 박사 직접 발화 대기.' }
    ]
  },
  {
    id: 'knowledge',
    name: 'Knowledge Atlas',
    subtitle: '여러 분야의 지식을 3D·인터랙티브로 묶어 시각화하는 상위 아카이브 — 영역 선택기로 「반도체 유니버스」·「전력 유니버스」 전환(영역 누적 확장) · A Curated Atlas of Interactive Knowledge',
    icon: 'book',
    platform: '웹 · 지식 시각화 모음 (영역별 분류)',
    status: 'in-progress',
    start: '2026-05-29',
    latest: '2026-05-31',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/semiconductor-universe/',
    preview: { type:'embed', height:620, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/semiconductor-universe/', label:'Knowledge Atlas — 좌상단 영역 선택기로 반도체·전력 유니버스 전환 (분류/공급망 3D, React + Three.js/R3F)' }
    ]},
    summary: '하나의 큰 틀 아래 여러 분야의 지식을 모아 시각화하는 8번째 프로젝트. 좌상단 「영역 선택기」로 지식 영역을 전환하며, 같은 3D 엔진(분류·공급망 두 모드)을 데이터만 바꿔 무한 확장한다(영역을 수십·수백 개까지 누적 예정). '
           + '영역 1 「반도체 유니버스」 — 칩 분류(실사풍 3D 칩 모델)와 글로벌 공급망(기업 앰블럼 + 본사 지구 핀·관계 호). '
           + '영역 2 「전력 유니버스」(2026-05-31 추가) — 대한민국 전력 부문: 발전원 14분류(원자력·석탄·LNG·태양광·풍력·수력·양수·ESS·연료전지·송배전·전력시장 등 전력 3D 아이콘)와 전력 공급망(KEPCO·한수원·발전5사·KPX·KOGAS·두산에너빌리티 등 23개 기업/기관을 본사 좌표로 한반도 지도에 핀하고 연료·발전·송배전·기자재 관계를 호로 연결).',
    method: '영역별로 독립된 인터랙티브 시각화를 만들고, 이 「Knowledge Atlas」가 그것들을 한데 묶는 상위 분류 틀이 된다. '
          + '반도체 영역은 Vite + React + TypeScript + Three.js(@react-three/fiber)로 구현 — NASA 지구 텍스처 + 프레넬 대기광 위에 칩/기업 노드가 궤도를 돈다. '
          + '기업 노드는 실제 로고(simple-icons 8개사) + 브랜드 워드마크 배지(8개사), 데이터·텍스처·로고는 전부 로컬. 전체 UI 한글화. '
          + 'GitHub: gmpark-creator/semiconductor-universe (main). 로컬에서 npm install && npm run dev 로 실행.',
    stack: ['Vite', 'React', 'TypeScript', 'Three.js (R3F)', 'react-spring', 'earcut', 'southkorea-maps', 'Tailwind', 'simple-icons'],
    stackDetail: [
      { area: '지구 지도 (공급망 모드 전용)', tech: 'Three.js, @react-three/fiber, @react-three/drei', how: 'Earth.tsx가 sphereGeometry에 8K day/night 텍스처(solarsystemscope CC-BY) + 노멀맵을 useTexture로 입혀 meshStandardMaterial로 그리고(anisotropy 16 → 확대 시 선명), shaderMaterial GLSL 프레넬 림으로 대기광을 가산한다. 본사 핀이 대륙과 정합되도록 자전·축기울기 없이 정적. 칩 분류 모드에서는 숨기고 공급망 모드에서만 표시.' },
      { area: '칩 분류 — 카툰 배경 + 실사풍 3D 아이콘 그리드', tech: 'Three.js, @react-three/fiber, @react-three/drei', how: 'TaxonomyBackdrop.tsx가 깔끔한 그라데이션/보케 카툰 배경(chip-bg.svg)을 안쪽 구면에 입히고, CategoryNode.tsx가 카테고리별 실사풍 3D 모델(IC 패키지·DIMM·SOIC·TO-247 전력·카메라 렌즈·RF 실드·FPGA 셀격자·실리콘 웨이퍼)을 PBR 재질 + 3/4 시점으로 그려 패밀리별 행 그리드로 가지런히 정렬한다. drei Environment(Lightformer) IBL로 금속이 반사돼 입체로 보인다. 휠 줌 지원, Html 라벨은 pointer-events:none.' },
      { area: '공급망 앰블럼 — 클릭 시 본사 핀·확대', tech: 'simple-icons, Three.js, @react-three/drei', how: 'CompanyEmblem.tsx가 simple-icons 로고/워드마크를 CanvasTexture 배지로 만들어 drei Billboard로 띄운다. 평소엔 떠 있다가 회사를 클릭하면 본사 위경도 좌표로 지구 위에 핀되며 확대되고, 선택과 무관한 회사는 페이드아웃한다. 배지 크기는 루트(시가총액)에 비례.' },
      { area: '공급망 관계 — 지구 위 호(arc)', tech: 'Three.js, @react-three/fiber', how: 'SupplyArrow.tsx가 회사를 클릭하면 그 회사에 연계된 엣지만 본사 좌표 사이를 잇는다. 지표에 밀착한 대권(great-circle) 곡선을 TubeGeometry로 그리고 도착지 coneGeometry 화살촉으로 방향을 또렷이 표시하며, 화살표마다 연계 기업명 라벨을 붙인다.' },
      { area: '공급망 벡터 지도 + 지명 라벨', tech: 'Three.js, @react-three/fiber, earcut, troika-three-text, Natural Earth', how: '래스터 위성 텍스처를 벡터로 교체 — Natural Earth 국가/주/도시 GeoJSON을 earcut으로 구면 적응 삼각분할해 단색 카툰색 폴리곤으로 채우고, 국경·행정경계·위경도 격자를 라인으로 그려 무한 확대해도 선명하다. 국가/주/도시 지명은 troika-three-text(SDF) 빌보드 라벨로 카메라 거리 LOD·전면 컬링해 표시한다.' },
      { area: '카메라·인터랙션·배치', tech: '@react-three/fiber, @react-three/drei, Three.js', how: 'Scene.tsx의 OrbitControls는 자동회전 없이 댐핑·줌만 두고, 휠/드래그 시 fly-to를 즉시 중단해 휠 줌이 항상 작동한다(고정 방지). 공급망에서 회사 선택 시 본사 상공으로, 칩 분류에서 노드 정면으로 카메라가 비행한다. 반짝임 방지를 위해 Bloom 후처리는 제거. companyLayout.ts의 COMPANY_HQ가 본사 위경도를 좌표로 변환한다.' },
      { area: 'UI 패널·범례·모드 토글', tech: 'React, TypeScript, Tailwind, framer-motion', how: 'InfoPanel.tsx가 framer-motion의 AnimatePresence와 motion.aside 스프링 트랜지션으로 상세 패널을 슬라이드 인하고, Tailwind 유틸 클래스로 글래스 스타일을 입힌다. App.tsx가 React useState로 모드·선택 상태를 관리하며 ViewToggle·Legend를 배치한다.' },
      { area: '빌드·타입·배포 환경', tech: 'Vite, TypeScript, @fontsource', how: 'package.json에서 dev는 vite, build는 tsc -b 후 vite build로 타입체크와 번들을 함께 돌린다. 전 컴포넌트를 TypeScript 타입드 Props로 작성했고, Earth.tsx는 import.meta.env.BASE_URL로 서브패스 배포에 대응하며 폰트는 @fontsource로 self-host(Inter)한다.' },
      { area: '멀티영역 아키텍처 (Knowledge Atlas)', tech: 'TypeScript, React', how: 'AtlasArea 인터페이스 하나로 한 지식 영역(분류·기업·공급망·라벨·색·본사좌표)을 표현하고, 3D 엔진/UI는 영역에 무관하게 area prop으로 구동된다(데이터 주도). data/areas/에 영역 모듈을 추가해 레지스트리(AREAS[])에 등록만 하면 영역이 늘어나며, 좌상단 AreaSelector 드롭다운으로 전환한다. companyLayout 좌표 계산은 영역 데이터를 인자로 받는 순수함수로 일반화했다. 현재 반도체·전력 2영역.' },
      { area: '전력 유니버스 — 카툰 대한민국 지도 (세계지도 없음)', tech: 'react-spring, southkorea-maps, earcut, Three.js', how: '전력 영역 공급망은 지구본 대신 KoreaCartoonMap이 한반도만 그린다. southkorea-maps GeoJSON으로 17개 광역시도를 earcut 삼각분할해 파스텔 카툰색으로 채우고 다크 외곽선을 입힌다. 핵심은 react-spring(@react-three/three) — 각 시도가 자기 중심에서 아래→위로 통통 튀어 오르며(config.wobbly·스태거 delay) 지도가 조립되듯 등장하고, animated 머티리얼 opacity로 페이드인한다. 좌표는 본사 핀과 같은 좌표계라 기업이 시도 위 실제 위치에 박힌다.' },
      { area: '구글어스식 도시 딥줌 — 행정구(시군구) LOD', tech: 'Three.js, @react-three/fiber, southkorea-maps', how: '기업을 클릭하면 카메라가 본사 도시까지 깊게 날아들어가(구글어스식 줌인), 카메라 거리(LOD)에 따라 시군구(행정구, 251개) 경계가 페이드인한다(동 단위는 과밀해 생략, 구 단위까지). 경계는 피처 전체를 단일 라인 지오메트리로 병합해 한 번에 그리고, 시군구 영문 라벨은 화면 중앙 좁은 콘 안의 것만 거리 비례(화면 고정 크기)로 표시해 과밀을 막는다. near plane·minDistance를 낮춰 더 깊이 확대 가능. 멀리서는 시도만 보이는 깔끔한 개요, 줌인하면 어느 구에 있는지 드러난다.' },
    ],
    issues: [
      { type:'핵심', title:'영역 2 — 전력 (전력 유니버스, 2026-05-31)', desc:'대한민국 전력 부문을 반도체 유니버스와 동일 스타일로 구현. 발전원·계통 14분류(원자력 1위 ≈32%·석탄 3위·LNG·태양광·육상/해상풍력·수력·양수·ESS·바이오·연료전지·송전·배전·전력시장) 3D 아이콘 그리드 + 전력 공급망(발전5사·한수원·KEPCO·KPX·KOGAS·두산에너빌리티·효성/HD현대 변압기·한화큐셀·씨에스윈드·산업부 등 23 기업/기관). 회사 클릭 시 본사 실좌표로 한반도 딥줌·핀 + 연료/발전/송배전/기자재/규제 관계 호. 데이터는 워크플로 5에이전트 수집·적대적 사실검증(2024 발전믹스 원자력 1위·석탄 3위·설비·본사좌표 교정). 앱을 데이터 주도 멀티영역 구조로 일반화 + 좌상단 영역 선택기 추가. semiconductor-universe push(08db798).' },
      { type:'핵심', title:'영역 1 — 반도체 (반도체 유니버스)', desc:'반도체 산업 3D 시각화 웹앱 — 두 모드: ① 칩 분류(깔끔한 카툰 배경 위 실사풍 3D 칩 모델 그리드, 휠 줌) ② 공급망(회사 아이콘 → 클릭하면 8K 지구 위 본사 위치로 핀·확대되고 연계사·화살표 연동). 노드 크기 ∝ √시가총액, 전체 한글화. GitHub gmpark-creator/semiconductor-universe (main).' },
      { type:'완료', title:'반도체 영역 — 지구 배경 + 기업 앰블럼 + 한글화 라운드 완료', desc:'우주 배경 → NASA 지구(낮/구름/노멀/야간조명) + 프레넬 대기광. 동그라미 노드 → 실제 기업 앰블럼(공식 로고 8개사 + 워드마크 8개사). 데이터·UI 전체 한국어. tsc + vite build 통과, dev 정상.' },
      { type:'완료', title:'반도체 영역 — 검수 체크리스트 수정 완료 + ESLint 0', desc:'HANDOFF 체크리스트(#1~#8)를 9개 에이전트 적대적 검증 후 마감 — 자동회전 버그·Designer 클러스터 지구앞 겹침·Bloom 과다·aria-label 한글화·Google Fonts 제거(@fontsource self-host)·README 현행화 모두 수정. ESLint 14건→0(컴포넌트 모듈 호이스팅·레이아웃 모듈 분리·텍스처 colorSpace onLoad). 워드마크 8개사 진짜 로고는 P3로 보류. tsc+vite build 통과, push 완료(b8d6be7).' },
      { type:'완료', title:'반도체 영역 — 시각화 전면 재설계 (2026-05-30)', desc:'디렉터 지시 반영 — 반짝임/깨짐 제거(Bloom·가산 글로우·halo 펄스 제거), 자동회전·부유 제거, 클릭 후 휠 줌 고정 해제. 칩 분류는 자체 생성 카툰 회로 배경 위 가지런한 그리드로, 공급망은 회사 클릭 시 지구 위 본사 위치(28사 위경도)로 핀·확대 + 연계사·화살표(지구 위 호) 연동으로 재구성. build·eslint 통과, push e38ce50.' },
      { type:'완료', title:'반도체 영역 — 수정 라운드 (UI/아이콘/지도 고도화, 2026-05-30)', desc:'디렉터 피드백 5건 반영 — ① 칩 분류 휠 줌 활성 + 배경을 깔끔한 그라데이션 카툰으로 교체, ② 칩 아이콘을 실사풍 3D 모델(IC 패키지·DIMM·전력 모듈·렌즈·실리콘 웨이퍼 등)로 고도화 + IBL 조명, ③ 공급망 클러스터 겹침 해소(같은 도시 회사 링 정렬·핀 축소), ④ 지구 2K→8K(solarsystemscope CC-BY)로 확대 디테일 향상, ⑤ 전체 조명·재질 폴리시. Playwright 헤드리스 검증 통과(에러 0). push 7519aa0.' },
      { type:'완료', title:'반도체 영역 — 좌측 목록 패널 + 기업 세계시장 점유율 (2026-05-30)', desc:'칩분류·공급망 둘 다 좌측 중단에 클릭 가능한 목록 추가 — 항목 클릭 시 해당 아이콘으로 이동·선택·우측 상세 열림(아이콘 클릭과 동일), 선택 항목 하이라이트. 기업 28사의 분야별 세계시장 점유율(COMPANY_SHARES)을 데이터화해 목록 부제 + 우측 상세 「세계시장 점유」 섹션에 표시(예: NVIDIA AI가속기 ≈90%, TSMC 파운드리 ≈70%, ASML EUV 100%). Playwright 검증·재배포. push 5df1623.' },
      { type:'완료', title:'반도체 영역 — 공급망 도시 줌 + 화면이동(pan) (2026-05-30)', desc:'공급망에서 회사 클릭 시 본사 도시 상공까지 더 깊게 확대 + 선택 회사를 정확한 본사 좌표에 작은 지도 핀으로 표시(라벨 화면 고정 크기). 마우스 드래그 화면 이동(pan) 추가, 근접 줌 허용. 버튼 매핑은 기본과 반대 — 좌클릭=화면이동 / 우클릭=각도조절(휠=줌). push 9b20978 · c39afc5.' },
      { type:'완료', title:'반도체 영역 — 공급망 지도 벡터화(무한 확대) (2026-05-31)', desc:'래스터 8K 위성 텍스처는 확대하면 깨져서, 공급망 지도를 벡터로 전면 교체 — Natural Earth 국가 폴리곤을 earcut 삼각분할(구면 적응 분할)해 단색 카툰색으로 채우고 국경·행정경계·위경도 격자를 라인으로. 벡터라 아무리 확대해도 선명. 회사 클릭 시 정확한 본사 좌표로 도시/마을 레벨까지 딥 줌(minDistance 0.02), 핀은 화면상 일정 크기 지도 마커. 8K 텍스처 제거로 번들↓. Playwright 검증·재배포. push 566c4ff.' },
      { type:'완료', title:'반도체 영역 — 지도 국가/주/도시 라벨 + 화살표 정리 (2026-05-31)', desc:'벡터 지도에 지명 표기 추가(troika 3D 텍스트) — 멀리선 국가명, 가까이 가면 주/도(예: California) + 주요 도시(점+이름, 예: San Francisco·Los Angeles). 카메라 거리 LOD + 전면 컬링 + 빌보드, 영문 표기. 공급망 화살표는 흐르는 입자 제거(정신사나움 해소) → 정적 아치+화살촉으로 깔끔하게. Playwright 검증·재배포. push 8090bf8.' },
      { type:'완료', title:'반도체 영역 — 라벨 폰트·크기 + 화살표 다듬기 (2026-05-31)', desc:'지도 국가 라벨을 Inter 폰트(로컬)로 교체 + 크기 축소(너무 컸음)·자간 보정. 공급망 화살표를 솟던 포물선 → 지표 밀착 대권(great-circle) 곡선 + 도착지 화살촉으로 재설계해 방향이 또렷·세련(항로 느낌). 회사 선택 시 지역 레벨로 프레이밍해 화살표가 보이게(더 깊은 줌은 휠). Playwright 검증·재배포. push 43a0c1e.' },
      { type:'완료', title:'반도체 영역 — 화살표 연계 기업명 라벨 (2026-05-31)', desc:'공급망 화살표 각각에 연계 기업명 라벨(관계 색상 매칭)을 표시 → 연계 회사 핀이 화면 밖이어도 그 화살표가 어느 기업과의 관계인지 즉시 식별. 화살표 끝을 핀과 정확히 일치. push 5171afd. (별개로 이 프로젝트 .claude/settings.local.json에 defaultMode:bypassPermissions를 넣어 배쉬 권한 프롬프트를 영구 차단 — 전역 bypass가 프로젝트 local에 덮이던 문제 해결.)' },
      { type:'이슈', title:'앞으로 — 다른 지식 영역 확장 예정', desc:'이 프로젝트는 상위 틀. 반도체 외 다양한 지식 분야를 같은 틀 안에서 새 영역으로 분류해 추가해 나갈 예정 (영역 2, 3, … 누적).' }
    ],
    milestones: [
      { isCore:true, date:'2026-05-29', title:'프로젝트 #8 신설 — 정보·지식 모음 (상위 틀)', desc:'다양한 지식을 한 틀 아래 영역별로 모으는 상위 프로젝트로 신설. 첫 영역 = 반도체. 박사 발화 "정보·지식 모음 같은 이름으로 #8에 추가, 반도체는 그 안의 한 영역으로 분류".' },
      { isCore:true, date:'2026-05-29', title:'영역 1 — 반도체 유니버스 등록', desc:'지구 배경 + 기업 앰블럼 + 한글화 완료한 3D 반도체 시각화 앱을 첫 영역으로 분류·등록. GitHub gmpark-creator/semiconductor-universe push 완료, HANDOFF.md 수정 체크리스트 동봉.' },
      { isCore:true, date:'2026-05-30', title:'영역 1 — 검수 체크리스트 수정·ESLint 0·재배포', desc:'집 데스크탑에서 HANDOFF 체크리스트 #1~#7 수정 마감(#8 로고 P3 보류), ESLint 14→0, tsc+vite build 통과. semiconductor-universe push(b8d6be7) + 대시보드 VIEW LIVE 미리보기를 새 빌드로 갱신(폰트 self-host 반영, 런타임 외부호출 0).' },
      { isCore:true, date:'2026-05-30', title:'영역 1 — 시각화 전면 재설계', desc:'디렉터 지시로 전면 재설계 — 반짝임/깨짐·자동회전·휠 고정 제거. 칩 분류는 자체 생성 카툰 회로 배경(chip-bg.svg) 위 패밀리별 그리드 정렬, 공급망은 회사 클릭 시 지구 위 본사 위치(COMPANY_HQ 28사 위경도)로 핀·확대 + 연계사·화살표(지구 위 호) 연동. Earth 정적화로 핀 정합. push e38ce50 + 미리보기 재배포.' },
      { isCore:true, date:'2026-05-30', title:'영역 1 — 수정 라운드 (UI/아이콘/지도)', desc:'디렉터 피드백 5건 — 칩분류 휠줌+깔끔 배경, 실사풍 3D 칩 아이콘(PBR+IBL), 공급망 클러스터 링 정렬·핀 축소, 지구 8K day/night(solarsystemscope CC-BY) 확대 디테일, 전체 조명·재질 폴리시. Playwright 헤드리스 검증(에러 0)·재배포. push 7519aa0.' },
      { isCore:true, date:'2026-05-30', title:'영역 1 — 좌측 목록 패널 + 세계시장 점유율', desc:'좌측 중단 클릭 목록(분류/기업, 클릭 시 아이콘 이동·선택) + 기업 28사 분야별 세계시장 점유율(COMPANY_SHARES)을 목록·우측 상세에 추가. push 5df1623.' },
      { isCore:true, date:'2026-05-30', title:'영역 1 — 공급망 도시 줌 + 화면이동(pan)', desc:'회사 선택 시 본사 도시까지 깊게 확대 + 정확한 본사 좌표에 작은 지도 핀. 드래그 화면 이동 추가 — 좌클릭=이동 / 우클릭=각도조절(휠=줌). push 9b20978 · c39afc5.' },
      { isCore:true, date:'2026-05-31', title:'영역 1 — 공급망 지도 벡터화(무한 확대)', desc:'래스터→벡터(단색 카툰 폴리곤) 지도로 전면 교체 — 무한 확대해도 선명. 회사 클릭 시 정확한 본사 주소까지 도시/마을 레벨 딥 줌, 핀은 화면상 일정 크기 마커. push 566c4ff.' },
      { isCore:true, date:'2026-05-31', title:'영역 1 — 지도 지명 라벨 + 화살표 정리', desc:'지도에 국가/주/도시 라벨(LOD: 멀리=국가, 가까이=주·도시) 추가, 공급망 화살표 입자 제거→정적 깔끔. push 8090bf8.' },
      { isCore:true, date:'2026-05-31', title:'영역 1 — 라벨 폰트/크기 + 화살표 great-circle', desc:'국가 라벨 Inter 폰트·축소, 화살표를 지표 밀착 대권 곡선+화살촉으로 재설계(방향 또렷). push 43a0c1e.' },
      { isCore:true, date:'2026-05-31', title:'영역 1 — 화살표 연계 기업명 라벨', desc:'공급망 화살표마다 연계 기업명 라벨(색 매칭) 표시 → 어느 기업과의 관계인지 식별. push 5171afd.' },
      { isCore:true, date:'2026-05-31', title:'영역 2 — 전력 유니버스 신설 + 멀티영역 구조·영역 선택기', desc:'반도체 전용 앱을 데이터 주도 멀티영역 Knowledge Atlas로 일반화(AtlasArea + AreaSelector 드롭다운). 두 번째 영역 「전력 유니버스」(대한민국 전력) 추가 — 발전원 14분류 + 전력 3D 아이콘 9종(원자로·냉각탑·태양광·풍력·댐·수소탱크·배터리·송전탑·계통허브) + 전력 기업/기관 23 + 공급망 33관계, 본사 한반도 핀. 데이터는 워크플로 5에이전트 수집·적대적 사실검증. tsc+vite·ESLint 0·Playwright 2영역×2모드 검증(콘솔 에러 0). semiconductor-universe push 08db798, 미리보기 재배포.' }
    ]
  }
];
/* ▲▲▲  데이터 끝  ▲▲▲ */

// ===== 상태 / 타입 메타 (밝은 테마) =====
const STATUS = {
  'completed':   { label:'완성',    en:'Completed',   dot:'bg-emerald-500',
    badge:'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', bar:'from-emerald-500 to-teal-400' },
  'in-progress': { label:'진행 중', en:'In Progress', dot:'bg-amber-500',
    badge:'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       bar:'from-amber-500 to-orange-400' },
  'paused':      { label:'보류',    en:'Paused',      dot:'bg-violet-500',
    badge:'bg-violet-50 text-violet-700 ring-1 ring-violet-200',    bar:'from-violet-500 to-fuchsia-400' }
};
const ITYPE = {
  '완료': { cls:'bg-emerald-50 text-emerald-700 ring-emerald-200',       icon:'check-circle-2' },
  '이슈': { cls:'bg-rose-50 text-rose-700 ring-rose-200',                icon:'alert-circle' },        // amber → rose
  '보류': { cls:'bg-slate-100 text-slate-600 ring-slate-300',            icon:'pause-circle' },        // violet → slate
  '핵심': { cls:'bg-gradient-to-br from-fuchsia-100 via-pink-100 to-rose-100 text-fuchsia-700 ring-fuchsia-300', icon:'sparkles' }  // 신규
};

/* ===== 기술 스택 총집합 데이터 (메인 홈 하단 .stack-atlas) =====
   워크플로 stack-atlas 산출(사용 스택 정규화·분류 + 미사용 카탈로그·추천)을
   적대적 검증(critUsed/critUnused) 반영해 확정. 사용처(어느 프로젝트·영역)는
   dashboard.js가 PROJECTS의 stack[]+stackDetail[]에서 라이브 집계한다(aliases로 매칭). */
const STACK_ATLAS = {
  // USED — 카테고리(표시 순서) + 정규화된 기술(원본 표기는 aliases로)
  categories: [
    { key: 'lang',       label: '프로그래밍 언어' },
    { key: 'frontend',   label: '프론트엔드 프레임워크·UI' },
    { key: 'graphics3d', label: '3D·그래픽·WebGL' },
    { key: 'maps',       label: '지도·지리 GIS' },
    { key: 'state',      label: '상태관리' },
    { key: 'animation',  label: '애니메이션·모션' },
    { key: 'backend',    label: '백엔드·서버' },
    { key: 'aiml',       label: 'AI·ML·데이터' },
    { key: 'build',      label: '빌드·번들·패키지' },
    { key: 'testing',    label: '테스트·품질' },
    { key: 'devops',     label: '배포·인프라·CI/CD' },
    { key: 'assets',     label: '폰트·아이콘·자산' }
  ],
  techs: [
    { canonical: 'HTML5', category: 'lang', aliases: ['HTML5'], note: '웹 페이지 구조를 정의하는 마크업 언어. 정적 사이트·앱 화면의 골격을 작성한다.' },
    { canonical: 'CSS3', category: 'lang', aliases: ['CSS3 (custom vars + Grid)', 'CSS3 (custom vars)', 'CSS3 (Grid)'], note: '스타일시트 언어. 커스텀 변수와 Grid 레이아웃으로 디자인 토큰·반응형 화면을 구성한다.' },
    { canonical: 'JavaScript', category: 'lang', aliases: ['JavaScript', 'Vanilla JS'], note: '웹 표준 스크립트 언어. 프레임워크 없이 인터랙션·재생 로직·DOM 제어를 직접 구현한다.' },
    { canonical: 'TypeScript', category: 'lang', aliases: ['TypeScript', 'TypeScript 5', 'TypeScript 6'], note: '정적 타입을 더한 JavaScript 상위 언어. 데이터 스키마·컴포넌트를 타입 기반으로 안전하게 작성한다.' },
    { canonical: 'Python', category: 'lang', aliases: ['Python 3.12'], note: '범용 프로그래밍 언어. ML 백엔드 서버와 오디오 처리 파이프라인을 작성한다.' },
    { canonical: 'GLSL', category: 'lang', aliases: ['GLSL'], note: 'OpenGL 셰이딩 언어. WebGL 셰이더에서 셀셰이딩·노이즈·프레넬 등 픽셀 단위 렌더링을 작성한다.' },
    { canonical: 'React', category: 'frontend', aliases: ['React', 'React 18'], note: '컴포넌트 기반 UI 라이브러리. 화면 전체를 선언적 컴포넌트로 구성한다.' },
    { canonical: 'Next.js', category: 'frontend', aliases: ['Next.js'], note: 'React 기반 풀스택 프레임워크. 라우팅·SSR을 포함한 웹앱 골격을 구성한다.' },
    { canonical: 'Tailwind CSS', category: 'frontend', aliases: ['Tailwind CSS', 'Tailwind'], note: '유틸리티-퍼스트 CSS 프레임워크. 클래스 조합으로 레이아웃·스타일을 빠르게 구성한다.' },
    { canonical: 'Three.js', category: 'graphics3d', aliases: ['Three.js', 'Three.js (R3F)'], note: 'WebGL 기반 3D 렌더링 라이브러리. 우주·지도·캐릭터 등 실시간 3D 씬을 그린다.' },
    { canonical: 'WebGL', category: 'graphics3d', aliases: ['WebGL'], note: '브라우저 GPU 그래픽 API. Three.js·셰이더가 화면을 하드웨어 가속으로 렌더링한다.' },
    { canonical: 'HTML5 Canvas', category: 'graphics3d', aliases: ['HTML5 Canvas'], note: '2D 픽셀 드로잉 API. 경기장 트래킹·태극기/조석 텍스처 등을 직접 그린다.' },
    { canonical: '@react-three/fiber', category: 'graphics3d', aliases: ['@react-three/fiber'], note: 'Three.js를 React 컴포넌트로 선언하는 렌더러. 3D 씬을 JSX로 구성한다.' },
    { canonical: '@react-three/drei', category: 'graphics3d', aliases: ['@react-three/drei'], note: 'react-three-fiber 헬퍼 모음. OrbitControls·Billboard·Environment 등 3D 유틸을 제공한다.' },
    { canonical: 'earcut', category: 'graphics3d', aliases: ['earcut'], note: '폴리곤 삼각분할 라이브러리. GeoJSON 영역을 3D 메시로 변환할 때 사용한다.' },
    { canonical: 'troika-three-text', category: 'graphics3d', aliases: ['troika-three-text'], note: 'Three.js용 고품질 SDF 텍스트 렌더러. 3D 씬 안의 라벨·문자를 선명하게 표시한다.' },
    { canonical: 'Leaflet', category: 'maps', aliases: ['Leaflet'], note: '경량 인터랙티브 지도 라이브러리. 지도 위에 선박 마커를 실시간 렌더링한다.' },
    { canonical: 'd3-geo', category: 'maps', aliases: ['d3-geo'], note: '지리 투영·좌표 변환 라이브러리. GeoJSON을 화면 좌표(Mercator 등)로 투영한다.' },
    { canonical: 'Natural Earth', category: 'maps', aliases: ['Natural Earth'], note: '퍼블릭 도메인 세계 지리 데이터셋. 실제 대륙·국가 형상 GeoJSON을 제공한다.' },
    { canonical: 'southkorea-maps', category: 'maps', aliases: ['southkorea-maps'], note: '대한민국 행정구역 GeoJSON 데이터셋. 17개 광역시도 실 경계를 렌더링한다.' },
    { canonical: 'Zustand', category: 'state', aliases: ['Zustand'], note: '경량 전역 상태관리 라이브러리. 게임 엔진의 단일 Ground Truth 스토어를 구축한다.' },
    { canonical: 'framer-motion', category: 'animation', aliases: ['framer-motion'], note: 'React 모션 라이브러리. 패널 슬라이드·스프링 트랜지션 등 UI 애니메이션을 구현한다.' },
    { canonical: 'FastAPI', category: 'backend', aliases: ['FastAPI'], note: 'Python 비동기 웹 프레임워크. 업로드·추출 API 엔드포인트와 라우팅을 제공한다.' },
    { canonical: 'Demucs', category: 'aiml', aliases: ['Demucs'], note: '음원 분리 딥러닝 모델. 곡에서 보컬을 제거하고 반주 스템을 추출한다.' },
    { canonical: 'PyTorch CUDA', category: 'aiml', aliases: ['PyTorch CUDA'], note: 'GPU 가속 딥러닝 프레임워크. Demucs 모델을 CUDA로 실행해 음원을 분리한다.' },
    { canonical: 'EPTS 트래킹 데이터', category: 'aiml', aliases: ['EPTS 트래킹 데이터'], note: '선수·공의 시계열 위치 추적 데이터 표준. 2D 매치 시각화의 입력 데이터로 쓴다.' },
    { canonical: 'Vite', category: 'build', aliases: ['Vite'], note: '빠른 프론트엔드 빌드·개발 서버. 번들링과 핫리로드 개발 환경을 제공한다.' },
    { canonical: 'ES Modules (importmap)', category: 'build', aliases: ['ES Modules (importmap)'], note: '브라우저 네이티브 모듈 로딩. importmap으로 CDN의 Three.js 등을 빌드 없이 로드한다.' },
    { canonical: 'Node ESM 스크립트', category: 'build', aliases: ['Node ESM 스크립트'], note: 'Node.js ESM(.mjs) 스크립트. 외부 공식 소스에서 데이터를 수집·생성하는 파이프라인을 돌린다.' },
    { canonical: 'Playwright', category: 'testing', aliases: ['Playwright'], note: '헤드리스 브라우저 자동화·테스트 도구. 렌더 결과 스크린샷·콘솔 에러를 검증한다.' },
    { canonical: 'Vercel', category: 'devops', aliases: ['Vercel'], note: '프론트엔드 호스팅·배포 플랫폼. 웹앱을 노선별 버전으로 배포·운영한다.' },
    { canonical: 'GitHub Pages', category: 'devops', aliases: ['GitHub Pages'], note: '정적 사이트 호스팅 서비스. 단일 HTML/빌드 산출물을 무료로 배포한다.' },
    { canonical: 'Pretendard', category: 'assets', aliases: ['Pretendard'], note: '한글 웹폰트. 한국어·영문 병기 본문·타이틀 타이포그래피에 적용한다.' },
    { canonical: 'SVG', category: 'assets', aliases: ['SVG'], note: '벡터 그래픽 포맷. 히어로 일러스트·아이콘·필터 효과를 해상도 독립적으로 그린다.' },
    { canonical: 'lucide-react', category: 'assets', aliases: ['lucide-react'], note: 'React용 오픈소스 아이콘 세트. 대시보드 UI의 시각 요소 아이콘을 제공한다.' },
    { canonical: 'simple-icons', category: 'assets', aliases: ['simple-icons'], note: '브랜드 로고 SVG 아이콘 모음. 기업 앰블럼 배지 텍스처로 활용한다.' },
    { canonical: '@fontsource', category: 'assets', aliases: ['@fontsource'], note: 'npm 기반 셀프호스트 폰트 패키지. Google Fonts 대신 Inter 등을 self-host한다.' }
  ],
  // NOT YET USED — 미사용 기술 + 디렉터 분야별 추천 (적대적 검증 반영)
  unused: [
    { key: 'lang', label: '언어 (Programming Languages)', items: [
      { name: 'Rust', recommendation: '고성능 네이티브/WASM 계산. 3번 Solar의 케플러·N체 섭동 계산이나 8번 반도체의 대규모 노드 레이아웃·force-directed 연산을 Rust→wasm-bindgen으로 빼면 메인스레드 프레임드랍을 없앤다. 4번 INST의 오디오 DSP 전처리도 후보.', fitProjects: ['Solar System Simulator', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Go', recommendation: '동시성·실시간 데이터 수집 백엔드. 1번 AIS 실시간 위치 폴링/스트리밍 게이트웨이, 7번 Premarket의 FRED·ECOS·시세 멀티소스 수집기를 단일 바이너리로 상주. 현재 7번은 빌드타임 스크립트뿐이라 상시 수집 데몬으로 격상하기 좋다.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'SQL', recommendation: '구조화 데이터 영속화·집계. 1번 AIS 항적 이력, 7번 Premarket 시계열 시세, 2번 DDUIM 트래킹 프레임을 테이블로 적재하고 시간 윈도우 집계. 현재 전 프로젝트가 mock/static이라 DB 도입 시 1순위.', fitProjects: ['US-KR Premarket Signal', 'AIS Ship Tracker', 'DDUIM'] },
      { name: 'WGSL (WebGPU Shading Language)', recommendation: '차세대 GPU 셰이더. 3번 Solar의 GLSL 셰이더 자산을 WebGPU/WGSL로 포팅하면 compute shader로 입자(카이퍼·트로이 2400×2) 시뮬을 GPU에서 직접. 8번 대량 노드 인스턴싱에도 유리.', fitProjects: ['Solar System Simulator', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Pandas / NumPy (데이터 분석)', recommendation: '데이터 분석 스택. 7번 Premarket의 매크로·테마 상관 분석, 2번 DDUIM 트래킹 통계(스프린트·점유율)를 Pandas/NumPy로. 4번 INST가 이미 Python 3.12라 분석 노트북 라인을 같은 생태계로 통일 가능. (GLSL·Python 자체는 이미 사용 중)', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] },
      { name: 'Swift / Kotlin', recommendation: '네이티브 모바일 앱. 1번 AIS를 현장 운영자용 iOS/Android 네이티브(백그라운드 위치·푸시)로, 3번 Solar를 ARKit/ARCore 천체 AR로. 웹 우선이면 React Native/Flutter가 더 현실적이라 보조 옵션.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'C++', recommendation: '초고성능 물리/렌더/DSP 코어. 단 3번 Solar는 importmap 단일 HTML 교육용이고 케플러를 이미 JS로 오차 0.22% 달성(WASM 불필요). 쓴다면 4번 INST의 DSP 병목(리샘플·STFT) 한정 PoC로 좁히되, PyTorch가 이미 C++ 커널을 쓰므로 torch.compile/ONNX 최적화가 먼저. (우선순위 최하)', fitProjects: ['INST Extractor'] },
      { name: 'C# / .NET', recommendation: '본격 게임/시뮬 확장 시 .NET·Unity 옵션이나 디렉터의 웹 릴레이 워크플로와 충돌해 적합도 낮음. 5번 PRESIDENT는 이미 Vite+React+Zustand 결정론 월루프(테스트 35/35)로 잘 도므로, C#보다 "엔진 로직을 순수 TS 모듈로 두고 Web Worker로 분리해 메인스레드 프레임 보호"가 같은 목표를 웹 안에서 달성하는 현실적 대안. (우선순위 최하)', fitProjects: ['2026 PRESIDENT KOREA'] }
    ]},
    { key: 'frontend', label: '프론트엔드 프레임워크·UI', items: [
      { name: 'Svelte / SvelteKit', recommendation: '가벼운 정적·콘텐츠 사이트. 6번 JP Global(현재 Vanilla JS)을 SvelteKit으로 재구축하면 번들이 작고 트랜지션 내장이라 디자인 톤 실험에 적합. 보일러플레이트가 적어 1인 워크플로에 효율적.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] },
      { name: 'Astro', recommendation: '콘텐츠 중심 정적 + Islands. 6번 JP Global과 이 대시보드 자체(보고서/포트폴리오)를 Astro로 만들면 기본 0-JS로 빠르고 필요한 위젯만 React island로. 8개 프로젝트 쇼케이스 허브에 이상적.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] },
      { name: 'shadcn/ui + Radix UI', recommendation: '접근성 갖춘 헤드리스 컴포넌트. 5·7·8번의 패널·다이얼로그·드로어·툴팁을 Radix 기반 shadcn으로 표준화하면 직접 만든 인터랙션 UI의 접근성·키보드 내비를 한 번에 확보. Tailwind를 이미 써 궁합 최상.', fitProjects: ['2026 PRESIDENT KOREA', 'Knowledge Atlas (반도체 유니버스)', 'US-KR Premarket Signal'] },
      { name: 'Vue 3 / Nuxt', recommendation: '대안 SPA/SSR. 신규 대시보드형 프로젝트에서 React 비교 실험용. 7번 Premarket을 Nuxt SSR로 만들면 SEO·초기 로딩 개선. (React 자산이 많아 신규 라인 한정)', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'Next.js App Router (RSC/SSR 본격)', recommendation: '1번 AIS는 이미 Next.js지만 단순 CSR 수준. App Router의 Server Components·Route Handler·streaming으로 선박 데이터 서버 패칭·SEO·엣지 캐싱까지 한 프레임워크로. 7번을 Next로 옮기면 수집 스크립트를 Route Handler로 흡수.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] }
    ]},
    { key: 'graphics3d', label: '3D·그래픽·WebGL/WebGPU', items: [
      { name: 'WebGPU (WebGPURenderer)', recommendation: 'Three.js 차세대 렌더 백엔드. 3번 Solar의 입자계(카이퍼·오르트·트로이)와 8번 반도체의 대량 노드/엣지를 compute shader로 가속. Three.js를 이미 써 WebGPURenderer 전환만으로 미래 대비.', fitProjects: ['Solar System Simulator', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Three.js 후처리 (postprocessing / EffectComposer)', recommendation: '후처리 파이프라인. 3·5·8번 3D 씬에 SMAA/FXAA 안티앨리어싱 + 톤매핑 + 절제된 약한 Bloom(임계값 가드)을 적용. 단 8번에서 Bloom 과다로 제거한 이력이 있으니 과다 글로우 금지 — 3번 Solar 태양/블랙홀 글로우를 통제된 후처리로 대체하는 수준.', fitProjects: ['Solar System Simulator', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Babylon.js', recommendation: '기능 풍부한 대안 3D 엔진. 5번 PRESIDENT의 3D 시네마틱이나 신규 인터랙티브 시뮬을 Babylon으로 시도하면 내장 GUI·물리·노드 머티리얼 에디터 활용. (Three.js 자산이 많아 신규 실험 한정)', fitProjects: ['2026 PRESIDENT KOREA'] },
      { name: 'PixiJS', recommendation: '고성능 2D WebGL 렌더러. 2번 DDUIM의 2D 매치 트래커(현재 Canvas 2D)를 PixiJS로 옮기면 선수22+공+잔상 다수를 WebGL 가속으로 25Hz 부드럽게·줌·히트맵. 1번 AIS 다중 마커에도.', fitProjects: ['DDUIM', 'AIS Ship Tracker'] },
      { name: 'Cesium / CesiumJS', recommendation: '사실적 3D 지구본 GIS. 1번 AIS를 진짜 3D 글로브(지형·해양·시간축)로, 8번 반도체 글로벌 공급망 지구를 실측 지구본으로. 위경도를 이미 다뤄 데이터 호환성 높음.', fitProjects: ['AIS Ship Tracker', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'deck.gl', recommendation: '대규모 지오데이터 GPU 시각화. 1번 AIS 수백~수천 척을 ScatterplotLayer/TripsLayer로, 8번 공급망 흐름을 ArcLayer로 그리면 수동 구현보다 성능·인터랙션 우수. MapLibre/Mapbox 위에 얹는 구조.', fitProjects: ['AIS Ship Tracker', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Blender', recommendation: '3D 에셋 제작 파이프라인. 3번 Solar의 탐사선 모델을 코드 프리미티브 대신 Blender→glTF로 만들면 디테일 비약. 5번 PRESIDENT 3D 카툰 시네마틱의 캐릭터·소품 제작에도 직결.', fitProjects: ['Solar System Simulator', '2026 PRESIDENT KOREA'] },
      { name: 'Spline', recommendation: '노코드 3D 디자인 툴. 6번 JP Global 히어로 3D 오브제나 이 대시보드 랜딩의 인터랙티브 3D 데코를 코드 없이 빠르게 임베드. 디자인 톤 실험 성격과 맞음.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] }
    ]},
    { key: 'dataviz', label: '데이터 시각화·차트', items: [
      { name: 'D3.js (full: scale·shape·force)', recommendation: '현재 d3-geo만 사용. 7번 Premarket 시세 라인·캔들·히트맵을 d3-scale/shape로, 8번 지식 그래프 평면 뷰를 d3-force로 그리면 풀 D3 역량 확보. 2번 DDUIM 궤적·점유율 차트에도.', fitProjects: ['US-KR Premarket Signal', 'Knowledge Atlas (반도체 유니버스)', 'DDUIM'] },
      { name: 'ECharts', recommendation: '고밀도 인터랙티브 차트. 7번 Premarket의 매크로/테마 히트맵·캔들·줌·브러시를 즉시 풍부하게. 2번 DDUIM 선수별 통계 대시보드에도. mock UI를 실제 분석 대시보드로 끌어올리는 핵심.', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] },
      { name: 'Recharts', recommendation: 'React 친화 선언형 차트. 7번 Premarket(React 18) 패널에 가장 빠르게 차트를 꽂는 옵션 — OvernightMacro·Theme Heatmap을 실데이터화. shadcn 차트 프리셋과 호환.', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'visx (airbnb)', recommendation: 'D3 + React 저수준 빌딩블록. 7번·8번에서 완전 커스텀 차트/그래프가 필요할 때 D3 수학과 React 렌더를 깔끔히 결합. Recharts로 부족한 맞춤 시각화에 단계적 도입.', fitProjects: ['US-KR Premarket Signal', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Observable Plot', recommendation: '탐색적 분석용 간결 그래머. 7번 데이터 파이프라인 단계의 빠른 EDA·리포트 차트에 적합. 2번 DDUIM 트래킹 데이터 탐색에도 한 줄 차트로 유용.', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] }
    ]},
    { key: 'maps', label: '지도·지리 GIS', items: [
      { name: 'MapLibre GL / Mapbox GL JS', recommendation: '벡터 타일 기반 GPU 지도. 1번 AIS의 Leaflet(래스터)을 MapLibre GL로 교체하면 부드러운 줌·회전·기울기·다크 베이스맵·실시간 선박 레이어. 오픈소스 MapLibre면 토큰 비용 0 — AIS 화면 격상 1순위.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'Turf.js', recommendation: '지오공간 연산. 1번 AIS에서 선박 간 거리·근접 경보(geofence)·항로 버퍼·교차 판정을 클라이언트에서. 위경도를 이미 다뤄 실시간 충돌/접근 알림 추가에 즉효.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'deck.gl + 지도 베이스', recommendation: '지도 위 대규모 데이터 레이어. 1번 AIS 선단 전체 항적(TripsLayer 애니메이션)과 밀집 마커를 MapLibre 베이스 위에 GPU로.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'OpenLayers', recommendation: '기능 방대한 오픈소스 지도 엔진. 1번 AIS에서 해상 차트(WMS/WMTS)·좌표계 변환·복잡 벡터 편집이 필요할 때 Leaflet 대안. 해도 오버레이가 중요하면 강점.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'Cesium 3D Tiles (글로브)', recommendation: '3D 지구본 GIS. 1번 AIS를 시간축 3D 글로브 항적 재생으로, 8번 공급망을 3D 지구 호(arc) 흐름으로, 5번 한반도 지도를 실측 지형 3D로.', fitProjects: ['AIS Ship Tracker', 'Knowledge Atlas (반도체 유니버스)'] }
    ]},
    { key: 'state', label: '상태관리·데이터 패칭', items: [
      { name: 'TanStack Query (React Query)', recommendation: '서버 상태 캐싱·동기화. 1번 AIS 실시간 폴링, 7번 Premarket 시세/매크로 패칭에 도입하면 캐시·재시도·폴링·stale이 자동화. mock→실API 전환 시 1순위. (Zustand=클라이언트 상태, Query=서버 상태로 역할 분리)', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'Redux Toolkit', recommendation: '복잡한 결정론 상태·타임트래블. 5번 PRESIDENT 선거 시뮬 턴처럼 액션 로그·되돌리기·리플레이가 중요한 게임 엔진에 적합. 디버깅·추적성이 Zustand보다 강함.', fitProjects: ['2026 PRESIDENT KOREA'] },
      { name: 'XState', recommendation: '상태 머신·시나리오 제어. 5번 게임 페이즈(유세→투표→개표→취임)와 3번 Solar의 시네마틱/투어 시퀀스를 명시적 FSM으로 모델링하면 엣지케이스가 줄고 흐름이 견고.', fitProjects: ['2026 PRESIDENT KOREA', 'Solar System Simulator'] },
      { name: 'Jotai', recommendation: '원자 단위 상태관리. 5번이 Zustand 단일 스토어인데 지역·정책 파생 상태가 많아지면 Jotai 아톰으로 세분화해 리렌더 범위를 좁힘. 8번 선택/하이라이트 상태에도 가벼움.', fitProjects: ['2026 PRESIDENT KOREA', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'SWR', recommendation: '경량 데이터 패칭 훅. 7번·1번에서 TanStack Query까지 무겁다 싶을 때 stale-while-revalidate만 가볍게. Next.js(1번)와 같은 Vercel 생태계라 궁합 좋음.', fitProjects: ['US-KR Premarket Signal', 'AIS Ship Tracker'] }
    ]},
    { key: 'animation', label: '애니메이션·모션', items: [
      { name: 'GSAP', recommendation: '고성능 타임라인 애니메이션. 6번 JP Global 스크롤 연출(ScrollTrigger)과 5번 취임 시네마틱의 정교한 카메라/UI 시퀀스를 프레임 단위로. framer-motion이 못 잡는 복잡 타임라인을 보완.', fitProjects: ['Frontend & Tone Atelier (JP Global)', '2026 PRESIDENT KOREA'] },
      { name: 'Lottie', recommendation: 'AE 기반 벡터 애니메이션 재생. 6번 JP Global·이 대시보드의 마이크로 인터랙션/로딩/아이콘 모션을 디자이너 제작 그대로 가볍게. 3번 Solar 로딩 스피너 고급화에도.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] },
      { name: 'Motion One / Web Animations API', recommendation: '경량 네이티브 애니메이션. 6번 JP Global의 Vanilla JS 인터랙션을 의존성 거의 없이 부드럽게. framer-motion을 안 쓰는 바닐라 프로젝트의 표준 모션 도구.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] }
    ]},
    { key: 'backend', label: '백엔드·서버', items: [
      { name: 'Node.js + Express / Fastify', recommendation: '범용 JS 백엔드. 1번 AIS 데이터 프록시/캐시 API, 7번 Premarket 시세 집계 API를 가볍게. 현재 7번은 빌드타임 스크립트뿐이라 런타임 API가 생기면 실시간 갱신 가능.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'Hono', recommendation: '엣지 우선 초경량 웹 프레임워크. 1번·7번 데이터 API를 Cloudflare Workers/Vercel Edge에 배포하면 글로벌 저지연. 번들이 작아 서버리스에 이상적이며 Cloudflare Workers와 직결.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'NestJS', recommendation: '구조화된 TS 백엔드. AIS·Premarket·DDUIM 데이터 API를 하나의 모듈러 백엔드로 통합 운영할 때. DI·모듈·가드 구조라 1인 운영에도 유지보수성 높음.', fitProjects: ['US-KR Premarket Signal', 'AIS Ship Tracker'] },
      { name: 'Django / DRF', recommendation: '관리 기능 포함 풀 백엔드(Python). 4번 INST가 이미 Python — FastAPI 단일 엔드포인트를 넘어 사용자·작업 이력·결과 관리가 필요해지면 Django Admin 유용. 7번 분석 결과 영속화에도.', fitProjects: ['INST Extractor', 'US-KR Premarket Signal'] }
    ]},
    { key: 'aiml', label: 'AI·ML·데이터', items: [
      { name: 'OpenCV', recommendation: '컴퓨터 비전. 2번 DDUIM 보류의 핵심 이유가 트래킹 데이터 수급 — OpenCV로 경기 영상에서 선수/공을 직접 검출·추적(호모그래피 좌표 변환)하면 유료 EPTS 없이 자체 트래킹 파이프라인을 만들 수 있다. 보류 해제의 열쇠.', fitProjects: ['DDUIM'] },
      { name: 'Whisper (faster-whisper)', recommendation: '음성 인식(STT). 4번 INST에 보컬 분리 후 자동 가사 추출/자막을 추가하면 "반주 추출 + 가사 싱크"까지 한 툴로. 이미 Demucs·PyTorch CUDA를 써 GPU 자원 그대로 활용.', fitProjects: ['INST Extractor'] },
      { name: 'Hugging Face Transformers', recommendation: '사전학습 모델 허브. 7번 Premarket에 뉴스/공시 감성분석·요약 모델을 붙여 매크로 시그널에 텍스트 신호 추가. 4번 INST(Python)와 통합해 오디오·텍스트 모델 실험 라인으로.', fitProjects: ['US-KR Premarket Signal', 'INST Extractor'] },
      { name: 'TensorFlow.js / MediaPipe', recommendation: '브라우저 내 ML 추론. 2번 DDUIM에 MediaPipe pose/object detection으로 클라이언트 선수 추적, 5번 PRESIDENT에 간단 정책 예측 모델을 온디바이스로. 서버 없이 추론하는 경량 라인.', fitProjects: ['DDUIM', '2026 PRESIDENT KOREA'] },
      { name: 'ONNX Runtime (Web)', recommendation: '프레임워크 중립 모델 실행. 4번 INST 분리 모델이나 7번 예측 모델을 ONNX로 변환해 웹/엣지에서 일관 추론. PyTorch 모델을 배포 환경에 맞춰 최적화 실행하는 표준 런타임.', fitProjects: ['INST Extractor', 'US-KR Premarket Signal'] },
      { name: 'LangChain / Vercel AI SDK', recommendation: 'LLM 오케스트레이션. 8번 반도체에 "자연어로 노드/관계 질문→그래프 하이라이트"하는 RAG 비서를, 7번 Premarket에 매크로 자연어 브리핑을. 디렉터의 지식 시각화 컨셉과 LLM이 직결.', fitProjects: ['Knowledge Atlas (반도체 유니버스)', 'US-KR Premarket Signal'] },
      { name: 'text-to-video (Runway / Sora / Veo)', recommendation: '실사풍 AI 영상 생성. 단 5번 취임 시네마틱은 의도적으로 "외부 AI 영상 대신 결정론·자산0·동적 Three.js 실시간 컷신"으로 설계(2026-05-31)됐으므로 핵심 라인 아님 — 보조 인서트 컷으로만. 더 적합한 확장은 그 PoC를 이벤트별(취임·위기·선거) Three.js 컷신 템플릿화 + (용량 이슈 시) Playwright headless로 MP4 프리렌더. 생성영상은 라이선스·결정성·동적 주입 한계.', fitProjects: ['2026 PRESIDENT KOREA'] }
    ]},
    { key: 'database', label: '데이터베이스·스토리지', items: [
      { name: 'PostgreSQL', recommendation: '관계형 주력 DB. 1번 AIS 항적, 7번 Premarket 시계열, 2번 DDUIM 트래킹 프레임의 영속 저장소. PostGIS 확장이면 AIS 지리 쿼리(반경/항로)까지 한 DB에서. 전 프로젝트가 무DB라 도입 1순위.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal', 'DDUIM'] },
      { name: 'SQLite / libSQL (Turso)', recommendation: '파일 기반 경량 DB. 4번 INST 작업 이력·캐시(어떤 파일을 어떤 모델로), 7번 로컬 시세 스냅샷에 적합. 집 데스크탑 상주 서버(INST)와 궁합 좋고 별도 DB 서버 불필요.', fitProjects: ['INST Extractor', 'US-KR Premarket Signal'] },
      { name: 'Supabase', recommendation: 'Postgres + Auth + Realtime + Storage BaaS. 1번 AIS 실시간 위치를 Realtime 채널로, 5번 PRESIDENT 멀티플레이/리더보드, 인증이 필요한 모든 프로젝트 백엔드를 한 번에. 1인 디렉터에게 가성비 최고.', fitProjects: ['AIS Ship Tracker', '2026 PRESIDENT KOREA'] },
      { name: 'DuckDB', recommendation: '분석용 임베디드 OLAP. 7번 Premarket 대량 시세/매크로 집계·조인을 인메모리로 초고속(브라우저용 DuckDB-Wasm도). 2번 DDUIM 트래킹 통계 집계에도 분석 엔진으로.', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] },
      { name: 'Redis', recommendation: '인메모리 캐시·pub/sub. 1번 AIS 최신 위치 캐시와 실시간 fan-out, 7번 시세 캐시·레이트리밋에. 외부 API 호출을 줄이고 실시간 응답을 빠르게 하는 계층.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'Firebase', recommendation: '실시간 DB·인증·호스팅 BaaS(NoSQL). 단 디렉터 스택이 Postgres 친화·React/TS·정적호스팅이라 정합도는 Supabase가 더 높고 중복됨 — 클라우드 동기화가 실제 필요해질 때 Supabase 단일 선택 권장(2번 DDUIM은 보류, 5번 세이브/로드는 이미 로컬). 모바일 SDK가 강해 추후 네이티브 확장 시에만 고려.', fitProjects: ['2026 PRESIDENT KOREA'] }
    ]},
    { key: 'realtime', label: '실시간·통신', items: [
      { name: 'WebSocket', recommendation: '양방향 실시간 스트림. 1번 AIS 위치를 폴링 대신 WebSocket 푸시로 받으면 갱신 지연·트래픽이 크게 준다. 7번 프리마켓 실시간 틱에도 핵심. 현재 실시간이 폴링 추정이라 1순위 업그레이드.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'SSE (Server-Sent Events)', recommendation: '단방향 서버 푸시(경량). 7번 시세/매크로 업데이트나 4번 INST 처리 진행률 스트리밍처럼 서버→클라이언트 단방향이면 WebSocket보다 단순. HTTP 위라 프록시·배포가 쉬움.', fitProjects: ['US-KR Premarket Signal', 'INST Extractor'] },
      { name: 'Socket.IO', recommendation: '재연결·룸 포함 실시간 레이어. 5번 PRESIDENT 멀티플레이 룸이나 2번 DDUIM 재생 동기 관전(여러 명이 같은 타임라인)에. 끊김 복원·폴백 내장으로 운영 안정성 높음.', fitProjects: ['2026 PRESIDENT KOREA', 'DDUIM'] },
      { name: 'WebRTC', recommendation: 'P2P 미디어·데이터 채널. 2번 DDUIM 영상 분석용 라이브 영상 송수신이나 5번 저지연 멀티플레이 데이터 채널에. 서버 부하 없이 직접 연결이 필요한 시나리오.', fitProjects: ['DDUIM', '2026 PRESIDENT KOREA'] }
    ]},
    { key: 'mobile', label: '모바일·크로스플랫폼', items: [
      { name: 'React Native + Expo', recommendation: 'React 자산 재사용 네이티브 앱. 1번 AIS를 현장 운영자용 모바일(백그라운드 위치·푸시)로 내는 데 최적 — React/TS를 이미 써 학습비용 최저. Expo로 빌드·배포 간소화.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'Capacitor / PWA', recommendation: '웹앱을 앱처럼 래핑. 기존 웹 자산(2번 DDUIM, 7번 Premarket, 이 대시보드)을 코드 거의 그대로 설치형 PWA/앱스토어 앱으로. 가장 적은 노력으로 모바일 배포를 얻는 현실적 1순위.', fitProjects: ['DDUIM', 'US-KR Premarket Signal'] },
      { name: 'Tauri', recommendation: '경량 데스크탑 앱(Rust+웹). 4번 INST 추출기를 로컬 GPU 서버 없이 설치형 데스크탑 앱으로 패키징(Electron보다 가볍고 빠름). 집 데스크탑 상주 구조를 일반 사용자용 앱으로 배포할 때.', fitProjects: ['INST Extractor'] },
      { name: 'Flutter', recommendation: '단일 코드 고성능 크로스플랫폼. 3번 Solar 모바일 천체 앱이나 5번 PRESIDENT 모바일 게임처럼 부드러운 커스텀 UI/애니메이션이 중요할 때. 웹과 별개 네이티브 라인을 팔 경우 후보.', fitProjects: ['Solar System Simulator', '2026 PRESIDENT KOREA'] }
    ]},
    { key: 'build', label: '빌드·번들·런타임·패키지', items: [
      { name: 'pnpm + 모노레포 workspace', recommendation: '디스크 효율·엄격한 의존성 + 워크스페이스. Vite/React 프로젝트가 다수(5·7·8)이고 공유 UI·타입이 생기면 pnpm workspace로 모노레포화해 중복 설치 제거·일괄 빌드. 멀티프로젝트 구조에 최적.', fitProjects: ['Knowledge Atlas (반도체 유니버스)', 'US-KR Premarket Signal', '2026 PRESIDENT KOREA'] },
      { name: 'Vite (바닐라 프로젝트로 확대)', recommendation: '3번 Solar(importmap+CDN, 빌드 없음)·6번 JP Global(Vanilla, 빌드 없음)에 Vite를 도입해 CDN importmap 의존(런타임 외부호출)을 self-host 번들로 전환. 8번에서 @fontsource self-host로 런타임 외부호출 0을 만든 선례와 동일 방향.', fitProjects: ['Solar System Simulator', 'Frontend & Tone Atelier (JP Global)'] },
      { name: 'Bun', recommendation: '올인원 초고속 런타임·패키지매니저·번들러. 7번 Premarket의 Node ESM 데이터 스크립트를 Bun으로 돌리면 실행·설치가 크게 빨라지고 신규 백엔드(Hono 등) 런타임으로도. 1인 반복 속도 향상.', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'Turborepo', recommendation: '모노레포 빌드 캐시·태스크 오케스트레이션. pnpm workspace와 함께 8개 프로젝트를 한 레포에서 증분 빌드·원격 캐시. 이 대시보드가 사실상 멀티프로젝트 허브이므로 빌드 파이프라인 통합에 직결.', fitProjects: ['Knowledge Atlas (반도체 유니버스)', 'US-KR Premarket Signal'] },
      { name: 'Deno', recommendation: '보안·TS 네이티브 런타임. 7번 외부 API 수집 스크립트를 권한 명시적 Deno로 실행하면 안전성이 높고 의존성 관리가 간결. Deno Deploy 엣지 배포와도 연결.', fitProjects: ['US-KR Premarket Signal'] }
    ]},
    { key: 'testing', label: '테스트·품질', items: [
      { name: 'Vitest', recommendation: 'Vite 네이티브 단위 테스트. 5번 PRESIDENT의 Zustand 게임 엔진(민심·예산·위기 로직)과 3번 Solar 케플러 계산처럼 결정론 순수 함수에 단위 테스트를 붙이면 회귀 방지. Vite를 이미 써 설정이 거의 없음.', fitProjects: ['2026 PRESIDENT KOREA', 'Solar System Simulator'] },
      { name: 'Testing Library (React)', recommendation: '컴포넌트 동작 테스트. 7번·8번의 React 패널/인터랙션을 사용자 관점으로 테스트. Vitest와 결합해 UI 회귀를 잡는 표준 조합.', fitProjects: ['US-KR Premarket Signal', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'Storybook', recommendation: '컴포넌트 카탈로그·시각 문서. 6번 JP Global의 디자인 톤 실험과 8·7번 UI 컴포넌트를 격리 환경에서 variant·톤별로 비교. 디렉터의 "톤 실험" 성격과 정확히 맞고 시각 회귀 테스트로도 확장.', fitProjects: ['Frontend & Tone Atelier (JP Global)', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'ESLint + Prettier / Biome', recommendation: '정적 분석·포맷 표준화. 8개 프로젝트 코드 스타일 통일. 특히 Biome는 ESLint+Prettier를 단일 고속 도구로 대체해 1인 멀티프로젝트 유지보수 부담을 줄임. 6번 Vanilla JS·신규 프로젝트 품질 기준선.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] }
    ]},
    { key: 'devops', label: '배포·인프라·CI/CD', items: [
      { name: 'GitHub Actions (CI/CD)', recommendation: '자동 빌드·테스트·배포. 가장 직접적 적용: ① 이 대시보드의 미리보기 빌드(dist→previews/) 자동 동기화 ② 7번 Premarket refresh-data.mjs(FRED·ECOS)를 일일 cron 자동 갱신 ③ lint·typecheck·build·Playwright 시각 회귀 게이트 + 자동 커밋·푸시. 디렉터의 "AI 릴레이 후 자동 커밋·푸시·배포" 루틴을 파이프라인화.', fitProjects: ['US-KR Premarket Signal', 'Solar System Simulator', 'DDUIM'] },
      { name: 'Docker', recommendation: '환경 재현·컨테이너 배포. 4번 INST의 Python 3.12 + PyTorch CUDA 환경을 Docker로 고정하면 다른 머신/서버에서도 동일 GPU 추론 재현. 신규 백엔드(Express/NestJS/Go) 표준 배포 단위로도.', fitProjects: ['INST Extractor'] },
      { name: 'Cloudflare Workers / Pages', recommendation: '엣지 서버리스 + 정적 호스팅. 1번·7번 데이터 프록시 API를 Workers로 글로벌 저지연 배포하고 Pages로 프론트 호스팅. Hono와 결합하면 비용 거의 0의 풀 엣지 스택.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'Fly.io / Railway / Render', recommendation: '상시 컨테이너 호스팅. 4번 INST의 GPU 서버나 신규 Node/Python 백엔드를 집 데스크탑 의존 없이 클라우드 상주. WebSocket 같은 장기 연결 서버 호스팅에 GitHub Pages/Vercel보다 적합.', fitProjects: ['INST Extractor', 'AIS Ship Tracker'] },
      { name: 'Sentry', recommendation: '런타임 에러·성능 모니터링. 3번 Solar처럼 복잡한 셰이더/런타임의 TDZ·WebGL 에러(실제 디버깅 이력 있음)를 배포 환경에서 자동 수집. 1인 운영에서 사용자 측 오류를 놓치지 않게.', fitProjects: ['Solar System Simulator', '2026 PRESIDENT KOREA'] }
    ]},
    { key: 'gamedev', label: '게임엔진·인터랙티브', items: [
      { name: 'Phaser', recommendation: '2D 웹 게임 프레임워크. 5번 PRESIDENT의 미니게임(유세·토론 이벤트)이나 2번 DDUIM을 인터랙티브 전술 보드로 확장할 때. 입력·씬·물리·스프라이트 내장으로 Canvas 수작업보다 빠른 게임화.', fitProjects: ['2026 PRESIDENT KOREA', 'DDUIM'] },
      { name: 'Godot (웹 export)', recommendation: '오픈소스 게임엔진. 5번 PRESIDENT를 본격 정치 시뮬 게임으로 키울 때 씬·노드·GDScript로 로직을 구조화하고 HTML5로 export. 웹 배포 워크플로를 유지하며 게임 깊이 확보.', fitProjects: ['2026 PRESIDENT KOREA'] },
      { name: 'Rapier (물리엔진, Rust/WASM)', recommendation: '고성능 물리 시뮬. 5번 PRESIDENT 인터랙션이나 3번 Solar에 충돌/물리 효과를 추가할 때 R3F와 결합(@react-three/rapier). WASM 기반이라 성능이 좋고 Rust 도입과 시너지.', fitProjects: ['2026 PRESIDENT KOREA', 'Solar System Simulator'] }
    ]},
    { key: 'audio', label: '오디오', items: [
      { name: 'Web Audio API', recommendation: '브라우저 오디오 처리·분석. 4번 INST에 분리 결과를 브라우저에서 실시간 재생·믹싱·파형/스펙트럼 시각화로 결과 확인 UX 강화. 3번 Solar·5번 PRESIDENT의 인터랙션 사운드/앰비언트에도. (현재 4번 오디오 처리는 전부 서버측이라 브라우저 Web Audio는 미사용)', fitProjects: ['INST Extractor', 'Solar System Simulator', '2026 PRESIDENT KOREA'] },
      { name: 'Tone.js', recommendation: '음악적 오디오 프레임워크. 4번 INST에서 추출한 반주에 메트로놈·키/템포 조절·간단 시퀀싱을 얹어 "반주 활용" 기능으로. Web Audio 위 음악 추상화라 노래방/연습 도구로 발전 가능.', fitProjects: ['INST Extractor'] },
      { name: 'WaveSurfer.js', recommendation: '파형 시각화·구간 편집 UI. 4번 INST 결과물(보컬/반주 스템)의 파형을 그려 구간 재생·비교·트리밍 UI를 빠르게. 오디오 툴 UX를 즉각 끌어올리는 실용 라이브러리.', fitProjects: ['INST Extractor'] },
      { name: 'librosa (Python)', recommendation: '오디오 분석 라이브러리. 4번 INST(Python)에서 분리 전후 BPM·키·온셋·스펙트럼 분석으로 메타데이터를 풍부하게. Whisper 가사 추출과 결합하면 종합 음원 분석 백엔드가 된다.', fitProjects: ['INST Extractor'] }
    ]},
    { key: 'assets', label: '폰트·아이콘·자산', items: [
      { name: 'Iconify (15만+ 통합 아이콘)', recommendation: '여러 아이콘 세트를 단일 API로 온디맨드 로드. 8개 프로젝트가 제각각 아이콘 라이브러리를 쓰는 것을 Iconify로 통일해 번들·관리 부담을 줄임.', fitProjects: ['US-KR Premarket Signal', 'Knowledge Atlas (반도체 유니버스)'] },
      { name: 'glTF 압축 (DRACO / KTX2)', recommendation: '3D 에셋 최적화 파이프라인. 8·3·5번에서 Blender로 만든 glTF 모델을 DRACO(지오메트리)·KTX2(텍스처)로 압축해 로딩 가속. 3D 프로젝트 다수라 자산 최적화 표준으로.', fitProjects: ['Knowledge Atlas (반도체 유니버스)', 'Solar System Simulator'] },
      { name: 'Variable Fonts (Noto Sans KR 등)', recommendation: '가변 폰트 타이포 자산. 6번 JP Global의 한·일·영 다국어 톤 실험과 5번 UI에 굵기/폭을 동적 제어. Pretendard 외 가변폰트·서브셋팅으로 로딩과 표현력을 동시에.', fitProjects: ['Frontend & Tone Atelier (JP Global)', '2026 PRESIDENT KOREA'] }
    ]}
  ]
};

window.PROJECTS = PROJECTS;
window.STATUS = STATUS;
window.ITYPE = ITYPE;
window.STACK_ATLAS = STACK_ATLAS;
