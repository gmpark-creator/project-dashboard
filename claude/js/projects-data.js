/* PROJECT DATA — 보존: 원본 dashboard에서 추출, 한 글자도 안 바뀜.
   STATUS/ITYPE의 Tailwind 클래스는 더 이상 사용 안 함 (vanilla CSS 토큰으로 대체).
   원본 보존 목적상 그대로 둠. */

const PROJECTS = [
  {
    id: 'ais',
    no: 1,
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
    summary: '관리 대상 선단의 선박들을 지도 위에 실시간으로 추적·표시하는 웹 앱.\n'
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
      { type:'완료', title:'협업 권한 확보 — gmpark 브랜치 작업 가능 (2026-06-05)', desc:'형(clavef)이 ship-ais-tracker 브랜치/배포 구조를 정비 — 박사(gmpark-creator)에게 WRITE 권한 + gmpark 전용 브랜치 부여. gmpark에 push하면 ais.vercel.co.kr에 자동 미리보기(public), railway-poller 백엔드도 gmpark-preview Railway 환경에 자동 재배포. main=production은 보호(직접 push 차단, PR→형 승인·CODEOWNERS 머지)라 실서비스와 완전 격리. 이제 막힘없이 수정 작업 가능 — 로컬 클론 ../ship-ais-tracker, gmpark 브랜치 셋업 완료.' }
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
    no: 2,
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
    summary: '경기 종료 후 확보되는 선수·공의 시계열 위치 데이터를\n'
           + '2D 경기장 위에 재생하는 매치 시뮬레이터.\n'
           + '이를 토대로 하이라이트 장면을 자동 추출하는 것이 최종 목표.',
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
    no: 3,
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
    summary: '실제 시각을 기준으로 태양·8행성·달이 케플러 궤도력대로 움직이는 3D 시뮬레이터.\n'
           + '초기엔 Claude·Codex 듀얼 트랙으로 동일 설계를 독립 구현해 비교 공개했으나,\n'
           + 'WebGL/GLSL 셰이더·프론트엔드 비주얼 분야에서 Claude 결과물이 더 우수하다고\n'
           + '디렉터가 판단해 Claude 단일 설계·구현 체제로 일원화.\n'
           + 'Codex는 런타임 오류·TDZ 진단 등 디버깅 서포트 역할로 전환.\n'
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
    no: 4,
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
    summary: '음원에서 보컬을 제거하고 고음질 반주(Inst) 트랙을 추출하는 4번째 프로젝트.\n'
           + '믹싱 콘솔 콘셉트 UI(Claude) + demucs AI 분리 엔진(Codex/GPT 주도)으로 구성된다.\n'
           + '디렉터 지시로 공개 웹 보고서(/inst-app/)에 드래그앤드롭 UI를 배포했고,\n'
           + '실제 GPU 추출은 백엔드가 필요해 구조상 외부인 실사용은 불가 —\n'
           + '디렉터 본인 데스크탑 전용 도구로 운영하기로 합의하고\n'
           + '디렉터 실음원 분리 확인까지 통과해 100% 마무리됐다.',
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
    id: 'jpglobal-web',
    no: 5,
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
    summary: 'G.M.PARK이 프론트엔드 웹사이트 디자인 + 색감 톤 구현 워크플로우를 점검하는 시범 프로젝트.\n'
           + '시범 대상으로 부산에 위치한 글로벌 해운 기업 JP GLOBAL CO.,LTD의 웹사이트(jpglobal.kr)를 채택 —\n'
           + 'G.M.PARK 본인이 소속된 회사가 아니라 외부 디자이너 입장에서 실사이트를 test subject로 사용.\n'
           + '같은 도메인의 동일 콘텐츠를 두고 코퍼레이트 톤(HMM21·COENS) → 라이트 클린 톤 →\n'
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
    no: 6,
    name: 'US-KR Premarket Signal',
    subtitle: '증권 — 미국 시장 종가가 한국 프리마켓에 미치는 영향 신호 대시보드',
    icon: 'trending-up',
    platform: '웹 앱 · Vite + React + TypeScript · Codex 트랙',
    status: 'in-progress',
    start: '2026-05-28',
    latest: '2026-06-11',
    progress: 30,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/us-kr-premarket/',
    preview: { type:'embed', height:600, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/us-kr-premarket/', label:'US-KR Premarket Signal — Phase 1 (Codex 빌드 dist, vite assets path 상대경로 변환)' },
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/us-kr-premarket/soxl-live/', label:'SOXL + 구성종목 30 실시간 시세 — 토스증권 스타일, 본장 마감/시간외 이원 시세 (Claude 트랙)' }
    ]},
    summary: '미국 증시의 종가·매크로·테마 신호가 한국 프리마켓 시간대(KST 새벽~오전)에 미치는 영향을\n'
           + '분석·시각화하는 연구용 대시보드.\n'
           + 'Codex가 단독 트랙으로 설계+Phase 1 mock UI 완성 후, official 매크로 데이터 refresh 파이프라인까지 추가 —\n'
           + 'GitHub repo 생성·push 완료 (gmpark-creator/us-to-kr-premarket-impact-dashboard).\n'
           + 'safety 가드레일 유지 — "For research only. Not investment advice."\n'
           + '자동 주문·브로커리지·라이브 단일종목 데이터 금지.\n'
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
      { type:'이슈', title:'박사 dashboard 등록 + 30% 픽스 (2026-05-28)', desc:'Claude가 폴더 발견 → 박사 "대시보드 7번으로 추가, 구현율은 30%로 고정" 발화로 정식 등록 + progress 1% → 30% 갱신. 향후 progress 변경은 박사 직접 발화 대기(standing).' },
      { type:'완료', title:'SOXL 핵심 구성종목 20 실시간 시세 대시보드 추가 (Claude, 2026-06-11)', desc:'박사 지시로 SOXL ETF 기초자산 20종목(NVDA·AVGO·AMD·TSM·ASML·MU 등) 전용 실시간 시세 화면을 단일 HTML로 신설, 본 프로젝트 하위 프리뷰(soxl-live/)로 편입. Chart.js + Tailwind CDN 다크 증권사 테마. 한국 증시 색 관례(상승 빨강/하락 파랑) + 전 UI 한국어. 0.7초 틱 가우시안 랜덤워크 시뮬레이션 엔진(종목별 변동성 차등 + 기준가 평균회귀) — 프로덕션 WebSocket 교체 지점 주석 명시, applyTick() 이후 렌더 파이프라인은 실데이터 전환 시 그대로 재사용. 행 클릭 차트 전환 + 최근 50틱 스크롤 윈도우 + 전일종가 점선 기준선. 트랙 분리 준수: Codex dist(index.html/assets) 무수정, 하위 폴더로만 추가.' },
      { type:'완료', title:'SOXL 시세 화면 20→30종목 전체 확장 (Claude, 2026-06-11)', desc:'1차 지시 프롬프트(Gemini 작성)에서 누락됐던 소수 종목 10개 보완 — SWKS 스카이웍스·QRVO 코보·LSCC 래티스·STM ST마이크로·UMC·ENTG 엔테그리스·RMBS 램버스·WOLF 울프스피드·COHR 코히런트·ALGM 알레그로. 박사가 SOXL 전체 구성종목 리스트를 새로 받아 재지시. 종목별 기준가·변동성 차등 부여, 헤더·테이블 라벨 30으로 갱신. 이로써 SOXL 기초자산 30종목 전량 수록.' },
      { type:'핵심', title:'SOXL 시세 화면 토스증권 스타일 전면 개편 + SOXL 본체 추가 (Claude, 2026-06-11)', desc:'박사가 토스증권(tossinvest.com) 실시간 차트 캡처를 레퍼런스로 제시 — 종목 하나씩이 아닌 전 종목 상시 노출 + SOXL ETF 자체를 맨 위 고정 요구. 다크 테마 → 토스풍 라이트 테마(흰 카드 + #f2f4f6 배경 + Pretendard) 전환. 좌측 = SOXL(★ 고정, 3x 배지) + 구성종목 30 전체 리스트(순위·원형 로고·종목명), 종목별 이원 시세: 본장 마감가(전일대비 % 배지, 고정) / 시간외·선물 현재가(전일대비 % 배지, 0.7초 실시간) + 시간외 거래대금. 등락률은 토스풍 배경 배지(상승 빨강/하락 파랑). 우측 = 클릭 종목 상세 패널(라이브 차트 + 전일종가·본장마감·시간외 거래대금) sticky. 본장 등락은 섹터 공통무브 + 종목별 개별무브로 상관 생성, SOXL = 섹터무브 3배(레버리지 재현).' },
      { type:'핵심', title:'SOXL 시세 화면 실측 데이터 베이크 + 등락 기준 토스 정합 (Claude, 2026-06-11)', desc:'박사 지적: 실제 토스에선 본장 폭락 후 야간시장 반등으로 빨간불인데 화면은 랜덤 시뮬이라 안 맞음 + 시간외 %가 전일대비로 계산돼 토스 기준(마감가 대비)과 상이. 정정 2건: ① 시간외·선물 등락률 기준을 전일대비 → 본장 마감가 대비로 변경(토스 동일 기준 — 폭락 후 반등 시 빨간불 재현). ② 31종목 전일종가·본장마감가(06-11 05:00 KST)·시간외 마지막 체결가(09:00 KST)를 Yahoo Finance에서 실측 수집(fetch-quotes.mjs)해 하드코딩 베이크 — 실제 06-11 반도체 폭락(SOXL 201.68→180.65, -10.4%) 그대로 반영. 틱은 실측가 중심 미세변동만. 한계 명시: 한국 낮시간(09~17시 KST) 토스 시세는 Blue Ocean ATS 체결가로 무료 공개 API 부재 → 화면 안내문에 영속 + 재베이크는 fetch-quotes.mjs 재실행.' }
    ],
    milestones: [
      { date:'2026-05-28', title:'Initial design — US-KR Premarket 컨셉 (Codex)', desc:'commit c613660. docs/DESIGN.md 영속. safety: 연구 전용 · 자동주문·브로커리지·라이브데이터 금지 명시.' },
      { date:'2026-05-28', title:'Phase 1 — static mock dashboard UI (Codex)', desc:'commit da2284a. Vite + React + TS 골격. mock fixture 데이터. typecheck/build/audit PASS.' },
      { isCore:true, date:'2026-05-28', title:'Phase 1 — Korean UI + help guide (Codex)', desc:'commit d62170c. 한국어 라벨 + 도움말 가이드. docs/PHASE1_RECEIPT.md 영속. G.M.PARK dashboard 톤 정렬.' },
      { isCore:true, date:'2026-05-28', title:'박사 dashboard #7 정식 등록', desc:'Claude가 폴더 발견 → 박사 발화 "대시보드 7번으로 추가" → projects-data.js에 등록. Codex 트랙 standing 유지.' },
      { isCore:true, date:'2026-05-28', title:'GitHub repo 생성 + push (Codex)', desc:'gmpark-creator/us-to-kr-premarket-impact-dashboard remote 등록 + master push. 박사 다른 프로젝트와 동일 패턴.' },
      { isCore:true, date:'2026-05-28', title:'Official 매크로 데이터 refresh (Codex, commit f218f32)', desc:'FRED + BoK ECOS 공식 소스 우선 + scripts/refresh-data.mjs + data.generated.ts + docs/DATA_SOURCES.md. 박사 "fake 데이터 금지" standing 준수 — missing/delayed 명시.' },
      { isCore:true, date:'2026-05-28', title:'박사 progress 30% 픽스', desc:'박사 발화 "구현율은 30퍼센트로 고정". 향후 갱신은 박사 직접 발화 대기.' },
      { isCore:true, date:'2026-06-11', title:'SOXL 구성종목 실시간 시세 화면 편입 + 30종목 전량 확장 (Claude)', desc:'박사 지시로 SOXL 기초자산 실시간 시세(시뮬레이션 스트리밍) 단일 HTML을 soxl-live/ 하위 프리뷰로 추가(1차 20종목). 같은 날 1차 프롬프트에서 누락됐던 10종목(SWKS·QRVO·LSCC·STM·UMC·ENTG·RMBS·WOLF·COHR·ALGM) 보완으로 30종목 전량 수록. 다크 증권사 테마 + 한국 색 관례(상승 빨강/하락 파랑) + 전 UI 한국어. Codex Phase 1 dist는 무수정(트랙 분리).' },
      { isCore:true, date:'2026-06-11', title:'토스증권 스타일 개편 — SOXL 본체 + 본장 마감/시간외 이원 시세 (Claude)', desc:'박사 토스증권 캡처 레퍼런스 반영. 라이트 테마 전환, 전 종목 상시 노출 리스트(SOXL ★ 맨 위 + 3x 배지), 종목별 본장 마감가(고정)/시간외·선물 현재가(실시간) 각각 전일대비 % 배지 표기. 우측 클릭 종목 상세 패널 + 라이브 차트.' },
      { isCore:true, date:'2026-06-11', title:'실측 데이터 베이크 + 시간외 등락 기준 토스 정합 (Claude)', desc:'시간외 % 기준을 본장 마감가 대비로 정정(토스 동일). 31종목 전일종가·본장마감·시간외 체결가 Yahoo 실측 수집 베이크 — 06-11 실제 반도체 폭락 반영. Blue Ocean ATS(한국 낮시간 토스 시세) 무료 API 부재 한계 화면 명시.' }
    ]
  },
  {
    id: 'knowledge',
    no: 7,
    name: 'Knowledgeverse',
    subtitle: '여러 분야의 지식을 묶어 시각화하는 상위 아카이브 — 대분류 2층(① 산업: 반도체·전력·2차전지·디스플레이·철강·제련 3D / ② 기초이론: 학교 과학) · A Curated Universe of Interactive Knowledge',
    icon: 'book',
    platform: '웹 · 지식 아카이브 (대분류: 산업 3D / 기초이론 학습자료)',
    status: 'in-progress',
    start: '2026-05-29',
    latest: '2026-06-05',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/semiconductor-universe/',
    preview: { type:'embed', height:620, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/semiconductor-universe/', label:'Knowledgeverse — 상단 대분류로 [산업](반도체 3모드[분류·공급망·8대공정] / 전력 / 2차전지 / 디스플레이 / 철강·제련 — 각 영역 분류·공급망을 한반도 지도에) ⇄ [기초이론](과학 133단원: 초28+중23+고78 + SF판별4, 도해 131종) 전환. 기초이론은 과학→학교급(초/중/고/SF)→학년·과목→단원 읽기형 학습자료. 고등은 선택군 네비게이션(공통·일반선택·진로선택·융합선택) 11과목, 신설 「SF 과학 판별」엔 소설 삼체의 과학을 상상력↔현실↔판정으로 분해한 4단원 (2026-06-01 삼체 + 전체 QA 통합)' }
    ]},
    // 박사 지정 줄바꿈/띄어쓰기 그대로 표시(\n=줄). 길면 dashboard.js fitSummaryLines가 폰트를 줄여 한 줄 유지.
    summary: '하나의 큰 틀 아래 여러 분야의 지식을 모아 시각화하는 8번째 프로젝트.\n'
           + '좌상단 「영역 선택기」로 지식 영역을 전환하며, 같은 3D 엔진(분류·공급망 두 모드)을 데이터만 바꿔 무한 확장한다 (영역을 수십·수백 개까지 누적 예정).\n'
           + '영역 1 「반도체 유니버스」 — 칩 분류(실사풍 3D 칩 모델)와 글로벌 공급망(기업 앰블럼 + 본사 지구 핀·관계 호), 8대 공정, 사업 모델(팹리스·파운드리·IDM 업체별 설계·제조).\n'
           + '영역 2 「전력 유니버스」(2026-05-31 추가) — 대한민국 전력 부문: 발전원 14분류 (원자력·석탄·LNG·태양광·풍력·수력·양수·ESS·연료전지·송배전·전력시장 등 전력 3D 아이콘)와\n'
           + '전력 공급망(KEPCO·한수원·발전5사·KPX·KOGAS·두산에너빌리티 등 23개 기업/기관을 본사 좌표로 한반도 지도에 핀하고 연료·발전·송배전·기자재 관계를 호로 연결). 전력 영역엔 「핵에너지」 모드(분류·공급망과 나란히 전환 — 핵분열↔핵융합 비교·석탄/우라늄/핵융합 연료질량 로그 차트·목표 GW 인터랙티브 계산기)를 추가(2026-06-05).\n'
           + '영역 3 「2차전지 유니버스」(2026-06-02 추가) — 셀 화학·폼팩터·4대 소재 13분류와 K-배터리 공급망(LG엔솔·삼성SDI·SK온 셀3사 + 양극·음극·전해질·분리막·장비·재활용 21개 기업).\n'
           + '영역 4 「디스플레이 유니버스」(2026-06-02 추가) — OLED(RGB·WOLED·QD-OLED)·폼팩터·소재 12분류와 K-디스플레이 공급망(삼성디스플레이·LGD 패널 + 발광재료·편광·UTG·장비·DDI 16개 기업).\n'
           + '영역 5 「철강·제련 유니버스」(2026-06-02 추가) — 제철공정·압연제품·비철제련 14분류와 K-철강/제련 공급망(포스코·현대제철 고로 + 전기로·강관·특수강 + 고려아연·LS MnM 비철제련 + 원료·수요 14개 기업).',
    method: '영역별로 독립된 인터랙티브 시각화를 만들고, 이 「Knowledgeverse」가 그것들을 한데 묶는 상위 분류 틀이 된다. '
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
      { area: '멀티영역 아키텍처 (Knowledgeverse)', tech: 'TypeScript, React', how: 'AtlasArea 인터페이스 하나로 한 지식 영역(분류·기업·공급망·라벨·색·본사좌표)을 표현하고, 3D 엔진/UI는 영역에 무관하게 area prop으로 구동된다(데이터 주도). data/areas/에 영역 모듈을 추가해 레지스트리(AREAS[])에 등록만 하면 영역이 늘어나며, 좌상단 AreaSelector 드롭다운으로 전환한다. companyLayout 좌표 계산은 영역 데이터를 인자로 받는 순수함수로 일반화했다. 현재 반도체·전력·2차전지·디스플레이·철강·제련 5영역.' },
      { area: '전력 유니버스 — 카툰 대한민국 지도 (세계지도 없음)', tech: 'react-spring, southkorea-maps, earcut, Three.js', how: '전력 영역 공급망은 지구본 대신 KoreaCartoonMap이 한반도만 그린다. southkorea-maps GeoJSON으로 17개 광역시도를 earcut 삼각분할해 파스텔 카툰색으로 채우고 다크 외곽선을 입힌다. 핵심은 react-spring(@react-three/three) — 각 시도가 자기 중심에서 아래→위로 통통 튀어 오르며(config.wobbly·스태거 delay) 지도가 조립되듯 등장하고, animated 머티리얼 opacity로 페이드인한다. 좌표는 본사 핀과 같은 좌표계라 기업이 시도 위 실제 위치에 박힌다.' },
      { area: '구글어스식 도시 딥줌 — 행정구(시군구) LOD', tech: 'Three.js, @react-three/fiber, southkorea-maps', how: '기업을 클릭하면 카메라가 본사 도시까지 깊게 날아들어가(구글어스식 줌인), 카메라 거리(LOD)에 따라 시군구(행정구, 251개) 경계가 페이드인한다(동 단위는 과밀해 생략, 구 단위까지). 경계는 피처 전체를 단일 라인 지오메트리로 병합해 한 번에 그리고, 시군구 영문 라벨은 화면 중앙 좁은 콘 안의 것만 거리 비례(화면 고정 크기)로 표시해 과밀을 막는다. near plane·minDistance를 낮춰 더 깊이 확대 가능. 멀리서는 시도만 보이는 깔끔한 개요, 줌인하면 어느 구에 있는지 드러난다.' },
      { area: '반도체 8대 공정 — 3D 웨이퍼 파이프라인 (공정 과정 모드)', tech: 'Three.js, @react-three/fiber, @react-three/drei', how: '「반도체 8대 공정」 인포그래픽을 프로젝트의 3D 스타일로 재구현한 세 번째 모드. ProcessFlow.tsx가 8단계(웨이퍼 제조·산화·포토·식각·증착·금속배선·테스트·패키징)를 뱀형(serpentine) 흐름으로 배치하고 단계 사이를 방향 화살표(TubeGeometry+cone)로 잇는다. 단계마다 고유한 절차적 3D 비주얼 — 실리콘 웨이퍼 다이격자, 투명 산화막+산소 분위기, 포토마스크 레티클+노광 콘, 식각 트렌치+플라즈마 글로우, 박막 적층 디스크 스택, 금속배선 격자+비아, 프로브 니들 검사, 완성 IC 패키지(기판+히트스프레더+골드핀). 단계를 클릭하면 카메라가 줌인하고 우측 패널에 「왜 중요한가·특징·국내 기업·해외 기업」이 열린다. AtlasArea.process 데이터(선택 필드)로 구동돼 다른 영역에는 영향 없음.' },
    ],
    issues: [
      { type:'핵심', title:'반도체 유니버스 — 「사업 모델」 모드 신설: 팹리스/파운드리/IDM 업체별 설계·제조 (2026-06-05)', desc:'박사 지시 — 반도체 영역에 사업모델별로 묶어 업체별 설계·제조 역할을 설명하는 모드 추가. ViewToggle에 분류·공급망·공정과 나란히 「사업 모델」 4번째 탭(반도체 전용). 팹리스 6(NVIDIA·Apple·AMD·Broadcom·Qualcomm·MediaTek, 설계O/제조X 위탁)·파운드리 5(TSMC·Samsung/Intel Foundry·GlobalFoundries·SMIC, 설계X/제조O)·IDM 8(Intel·Samsung·SK hynix·Micron·TI·Infineon·STMicro·ADI, 설계O/제조O) = 19개사를 「설계 vs 제조」 매트릭스 + 업체 카드(설계=초록/제조=파랑 + 보충)로 표시. 콘텐츠는 워크플로 6에이전트(초안 3 + 적대적 사실검증 3)로 생성·검증 — AMD의 GF 분사·I/O 위탁, Samsung 시스템LSI/메모리/파운드리 사업부 분리, GlobalFoundries 비선단(성숙·특화), SMIC EUV 제재 한계, Intel IDM 2.0(타일 TSMC 위탁), ADI 팹라이트 하이브리드, SK hynix HBM 베이스다이 TSMC 협력 등 디테일 반영. 핵에너지 모드와 동일한 데이터 주도 패턴(AtlasArea.businessModel). lint·build PASS(tsc 타입 통과), 데이터 빈값 0·회사수 일치·id 중복 0. newton 브랜치(40de6ec)·미리보기 재배포. ⚠️ main 미병합 — Codex 사후검수 대기.' },
      { type:'핵심', title:'전력 유니버스 — 핵에너지를 전력 전용 「모드」로 재구성 (2026-06-05)', desc:'박사 지시 — Codex 1차 구현이 좌하단 플로팅 버튼→모달이던 것을, 전력 카테고리 안에 분류·공급망과 동급으로 구분된 ViewToggle 모드로 편입. 데이터 주도(반도체 process 모드와 동일 패턴): AtlasArea.nuclear? 필드 + Mode "nuclear" + ViewToggle가 area.nuclear 있을 때만 「핵에너지」 버튼 노출(전력 전용, 타 영역 미노출). NuclearParadigmPanel을 모달(dialog/X/Escape)에서 role=region 전력 모드 뷰로 전환(상단 토글 아래 z-15·pt-78), 핵 모드에서 ItemList·Legend·InfoPanel·모드안내 숨김. 좌하단 런처·nuclearOpen 상태 제거, sr-only 접근성 라벨에 핵에너지 분기. 검증: npm run lint PASS, npm run build PASS(tsc -b 타입 통과, 기존 chunk-size warning만), 번들에 핵에너지 모드 라벨·hint 존재·런처 eyebrow 0 확인. newton 브랜치(db53d40, codex df133fb 위에 재구성)·미리보기 재배포. ⚠️ main 미병합 — Codex 사후검수·통합 대기.' },
      { type:'핵심', title:'전력 유니버스 — 「핵에너지 패러다임」 비교 패널 신설 (2026-06-05, Codex)', desc:'Codex가 전력 유니버스에 핵분열 vs 핵융합 비교 대시보드를 추가. 전력 영역 선택 시에만 노출되는 런처 버튼 → 모달 패널(NuclearParadigmPanel)로 ① 핵분열/핵융합 비교 그리드(NuclearParadigmGrid) ② 석탄 vs 우라늄 vs 핵융합 연료질량 로그 SVG 차트(FuelEfficiencyChart) ③ 목표 GW 슬라이더/숫자 입력 + count-up 값 갱신 인터랙티브 계산기(InteractiveCalculator) ④ 라우트 계약 프리뷰 카드. 백엔드 서버를 새로 띄우지 않기 위해 백엔드 요구는 타입드 컨트롤러/라우터 shim으로 구현(src/api/power/nuclear.ts: getNuclearSummary·postNuclearCalculate({targetGw})·nuclearRoutes — 후일 런타임 서버 추가 시 프런트 데이터 계약 변경 없이 마운트 가능). lucide-react 아이콘 도입, 영역 전환 시 패널 리셋. 검증: npm run lint PASS, npm run build PASS(기존 Vite chunk-size warning만), 브라우저 CDP desktop/390px — 패널 열림·버튼 aria「핵에너지 패러다임 비교 패널 열기」·다이얼로그 aria·배지·라우트·SVG 차트·슬라이더·계산값 변경·수평 오버플로 0·console error 0(기존 @react-three/fiber THREE.Clock·WebGL precision warning만 관찰). Claude 측 빌드 재현 확인(tsc -b 통과=타입 정상), 미리보기 재배포. ⚠️ 현재 origin/codex 브랜치(df133fb)에만 존재 — main 미병합, 상호 교차검수·통합 대기.' },
      { type:'핵심', title:'공급망(대한민국 지도) 가시성 개편 — 단색 지도+업체별 색 화살표+인과관계 패널 (2026-06-02)', desc:'박사 피드백 3건 반영(전력·2차전지·디스플레이·철강 등 한반도 지도 공급망 공통). ① 시도별 17색 파스텔 지도를 단일 색(#3c7a62)으로 통일해 위에 얹히는 기업 핀·화살표가 또렷하게. ② 기업 선택 시 화살표를 대폭 축소(화살촉·튜브·호 높이·최소값 하향)하고, 관계 타입색 대신 「업체별 고유색」으로 구분 + 한반도 지도에서도 방향 라벨(상대 기업명+화살표)을 부활해 어느 업체와 오가는지 표기. 또 선택 시 카메라를 본사 딥줌 대신 「선택+연결 업체」가 한 화면에 들어오도록 프레이밍해 화살표가 보이게 함(수동 휠 딥줌은 유지). ③ 좌하단에 「공급망 관계」 패널 신설(SupplyRelations) — 공급받음/공급·납품 방향별 정리 + 화살표와 같은 업체색 색칩 + 한 줄 인과(cause) 상시 노출 + 플러스(+) 버튼으로 상세 인과(detail) 펼침(데이터 없으면 회사 정보로 자동 구성). 전력 34개 엣지의 인과관계는 워크플로(7관계군 초안+적대적 사실검증, 14에이전트)로 생성·검증해 반영. tsc+vite build·ESLint 0(경고 0)·Playwright 헤드리스(단색 지도·업체색 화살표·방향 라벨·관계패널 + 확장·콘솔 에러 0, 4개 한반도 영역) 검증. semiconductor-universe push f1da9c4, 미리보기 재배포.' },
      { type:'핵심', title:'신규 3영역 제품별 3D 아이콘 신설 (2026-06-02)', desc:'박사 지적(제품↔이미지 불일치) 전면 교정 — 배터리·디스플레이·철강 영역이 반도체/전력용 3D 아이콘을 재사용해 양극재→메모리 DIMM, OLED→DIMM, 전기로→전력 트랜지스터, 아연제련→원자력 모형처럼 어긋났던 것을 바로잡음. CategoryNode에 제품별 절차적 3D 모델 24종 신설 — 원통/각형/파우치 셀·전극적층·분말·비커·분리막·동박롤·롤투롤·고체결정·재활용 / OLED 발광패널·폴더블·발광분자·마이크로LED·롤러블 / 고로·전기로·강판코일·후판·철근·선재·봉강·금속잉곳 — 후 39개 카테고리를 제품에 맞게 재매핑. 전 카테고리가 도메인 전용 아이콘으로 렌더(반도체 칩 폴백 0). tsc+vite build·ESLint 0, 미리보기 재배포(push db769c0). 동시에 오후작업 재검토 교정 30여 건(SK온 6위·도우인시스 2025상장·QD-OLED 청색5층·풍산 매출 등)도 반영.' },
      { type:'핵심', title:'산업 5번째 영역 — 철강·제련 추가 (2026-06-02)', desc:'박사 지시로 산업 대분류에 철강(제철)+비철금속 제련을 묶은 5번째 영역을 추가, 산업 5영역(반도체·전력·2차전지·디스플레이·철강·제련) 체제로 확장. 분류 14노드(고로-전로 BF-BOF·전기로 EAF / 열연·냉연·후판·철근·선재·특수강·STS·전기강판 / 아연·동·연귀금속 제련 / 수소환원제철 HyREX) + 공급망 14개 기업(포스코·현대제철 고로, 동국제강·세아베스틸·세아제강·KG스틸 전기로/강관/특수강, 고려아연·영풍·LS MnM·풍산 비철제련, 포스코인터내셔널 원료, 현대차·HD현대중공업 수요, 산업부 규제)을 한반도 지도에 핀. 6에이전트 웹검증 리서치 + 6차원 적대적 자가검수(런타임 CLEAN; BLOCK 3정정: HD현대중공업 매출 23→17.6조·최대주주 30%대→69%, 영풍 영업손실 정정; STS 마르텐사이트·아연 유도로 등 야금 보정; poscoint→현대제철·lsmnm→현대차 허위 edge 삭제). 고려아연-영풍 경영권 분쟁·HyREX·미국 50% 관세 등 최신이슈 반영. 신규 IconKey 0. newton→main FF 통합(충돌0) push 00364f2, 미리보기 재배포(backdrop 5종). 5영역은 영역 선택기에서 각자 독립.' },
      { type:'핵심', title:'산업 영역 2개 추가 — 2차전지·디스플레이 (2026-06-02)', desc:'박사 지시로 산업 대분류를 4영역(반도체·전력·2차전지·디스플레이) 체제로 확장. ▸2차전지: 분류 13노드(삼원계/LFP·원통46파이/각형/파우치·양극/음극/전해질/분리막·전고체·재활용) + K-배터리 공급망 21개 기업(셀3사 LG엔솔·삼성SDI·SK온 + 소재·장비·재활용·완성차·규제)을 한반도 지도에 핀. ▸디스플레이: 분류 12노드(RGB OLED/WOLED/QD-OLED·LCD·폴더블·발광재료·편광·TFE·UTG/CPI·MicroLED·투명롤러블) + K-디스플레이 공급망 16개 기업(삼성디스플레이·LGD 패널 + 소재·장비·DDI·세트·규제). 두 영역 모두 6에이전트 웹검증 리서치 + 6차원 적대적 자가검수(Codex 토큰 소진으로 Claude 대체 — 좌표·기업수치·과학·공급망 오류 다수 정정, 런타임 CLEAN). 신규 IconKey 0(기존 3D 아이콘 재사용). newton→main FF 통합(충돌0) push e8c8c35, 미리보기 재배포(백드롭 4종 포함). 4영역은 영역 선택기에서 각자 독립으로 전환 — 합쳐진 게 아님.' },
      { type:'완료', title:'브랜드 「Knowledgeverse」로 개명 + 공정 모드 대상 반도체 안내 (2026-06-01)', desc:'프로젝트 브랜드를 「Knowledgeverse(놀리지버스)」로 확정(영문 표기) — 「아틀라스」(가족 출판물명과 중복)를 빼고, 지식(Knowledge)+유니버스(-verse)로 각 영역=하나의 우주, 전체=Knowledgeverse 위계와 정합시킴. brand.ts 단일 소스로 상단 워드마크·기초이론 브레드크럼·페이지 타이틀·학습 콘텐츠 문구를 일괄 교체(사용자 노출 옛 명칭 잔존 0 검증). 산업>반도체 「공정 과정」 모드에는 이 8대 공정이 특정 제품 하나가 아니라 모든 실리콘 기반 반도체(메모리 DRAM·낸드 / 시스템반도체 CPU·AP·이미지센서)의 공통 제조 과정임을 알리는 안내 배너(ProcessGuide, 단계 선택 전 개요 상태에만 노출·우측 패널과 비충돌) + 8대 공정 목록 부제를 추가. 적대적 사실검증 반영으로 5공정을 「증착·이온주입」, 7공정을 「EDS(웨이퍼 테스트)」 정식 명칭으로 정렬하고 이미지센서 제품별 추가공정 주석을 보강. tsc+vite build PASS. push abc88a2, 미리보기 재배포. 더불어 대시보드 전 프로젝트(1~8) 설명란의 한글 줄바꿈을 어절(word) 단위로 교정(word-break:keep-all + 줄간격·자간 정리)해 「제대로 쓴 한글 글」처럼 보이도록 가독성을 일괄 정비.' },
      { type:'핵심', title:'반도체 영역 — 8대 공정 모드 추가 (2026-06-01)', desc:'「반도체 8대 공정」 인포그래픽을 프로젝트의 3D 스타일로 재구현해 산업>반도체에 세 번째 모드 「공정 과정」을 추가. 8단계(웨이퍼 제조·산화·포토·식각·증착·금속배선·테스트·패키징)를 뱀형 흐름 + 방향 화살표의 3D 웨이퍼 파이프라인으로 그리고, 단계마다 고유 비주얼(웨이퍼·산화막·포토마스크·식각 트렌치·박막 스택·금속 격자·프로브 니들·완성 IC 패키지)을 입혔다. 단계 클릭 시 줌인 + 「왜 중요한가·특징·국내/해외 기업」 패널. 데이터 주도(AtlasArea.process 선택 필드)라 전력·타 영역엔 무영향. tsc+vite build·ESLint 0·Playwright 헤드리스 검증(콘솔 에러 0). push db120a3, 미리보기 재배포.' },
      { type:'핵심', title:'「SF 과학 판별」 신설 — 소설 삼체 과학 4단원 + 전체 QA 통합 (2026-06-01)', desc:'기초이론 과학에 5번째 학교급(레벨) 「SF 과학 판별」 신설. Codex가 류츠신 소설 『삼체』의 과학 설정을 ① 세 태양과 혼돈 궤도(삼체 문제·다중성계·외계행성) ② 양자 통신과 소폰(양자 얽힘·no-communication) ③ 성간 항행과 우주 공학(핵추진·솔라세일·토퍼) ④ 우주 문명과 위험 상상(SETI·행성방어) 4단원으로 작성 — 각 단원을 "소설 상상력 / 현실 과학 / 판정" 3층으로 분해, NASA·Caltech 출처 명시, 저작권 산문 인용 0. Claude 내용 검수: 과학적으로 모범적(특히 양자 얽힘 초광속 통신 불가를 명확히 함). domain "SF 과학", 도해 4종(threebody-*). 동시에 본 통합 사이클에서 ▸Claude 과학 내용 최종 QA 20건(5e37fc1) ▸Codex 구현 최종 QA(스크롤바·부제·track 검증, 34f4571)도 함께 main 통합. newton+codex 머지 충돌 0(ort), build/lint PASS, figureId 133 refs/131 unique/누락0/고아0, SVG 131 깨짐0. main push a06e3dd, 프리뷰·대시보드 갱신. 기초이론 과학 누적 133단원·도해 131종.' },
      { type:'완료', title:'진로선택 Codex 교차검수 3건 반영 + 선택군 네비게이션 main 통합 (2026-06-01)', desc:'격리 worktree 체계 가동 후 첫 통합 사이클. ① Codex가 Claude 진로선택 물리·화학을 교차검수 — 3건 타당, newton 브랜치서 수정(총 반동: 총알+화약 가스 닫힌 계 운동량 보존으로 보정 / 충돌 운동량 보존: 외부 충격량 무시되는 닫힌 계 조건 추가 / 절대온도: "운동이 멈춘다"→0 K=열운동E 최소·양자역학적 잔여 운동 명시). Codex가 origin/newton PASS 확인. ② 박사 디렉팅으로 newton(검수 반영)→codex(7b7584c 심화파트 선택군 네비게이션: types.track 필드 + TheoryView 공통/일반선택/진로선택/융합선택 구분) 순서로 main 통합 — 충돌 0(ort auto-merge). build/lint PASS, figureId 129 누락0. main push 0830cf3. 검수노트 internal/notes 영속화(claude·codex 양측). → 격리 후 첫 양방향 검수+통합 성공.' },
      { type:'핵심', title:'고등 진로 선택 물리·화학 4과목 신설 — 24단원 + 도해 24종 (2026-06-01)', desc:'Claude가 2022 개정 「진로 선택」 과학 4과목 직접 구현 — ① 역학과 에너지(시공간·뉴턴·일에너지·운동량·중력장·열역학) ② 전자기와 양자(전기장·축전기·회로·자기장·전자기유도·광전효과/물질파) ③ 물질과 에너지(오비탈·주기성·결합에너지·분자간힘·상변화·엔탈피) ④ 화학 반응의 세계(반응속도·평형·산염기·전기화학·용액·산업환경). 각 6단원(총 24), strand "진로 선택 · 물리/화학", grade=3. 도해 advphys-*(12)·advchem-*(12) 신규 24종. 심화 프레이밍(복습 아닌 정량화·메커니즘 확장). 안전 준수: 산·염기 맛/촉감/의료 예시 전면 배제(지시약·pH로만 확인), 전자=행성궤도 부정·오비탈/확률로 일관. build/lint PASS, figureId 127/127 매칭. push fe3aed7. Codex 트랙(생물·지구·융합 7과목, 2bba6cf)과 파일·figureId 네임스페이스 완전 분리 — 충돌 0. → 검수 노트 internal/notes/claude-build-2026-06-01-high-career-physics-chemistry.md, Codex 교차검수 대기.' },
      { type:'완료', title:'화학 Codex 교차검수 4건 반영 (2026-06-01)', desc:'Codex가 Claude 고2 화학을 검수 — 4건 타당, 수정 완료. ① 산·염기 맛/촉감 판별 인상(안전 위험)→"실험에서는 절대 맛보거나 만지지 않고 지시약·pH로 확인" 경고 추가. ② 벌 쏘임 중화 예시(의학처치처럼 읽힘·부정확)→호수/토양/폐수 중화 등 안전한 환경 예시로 교체. ③ 전자 "돈다"(행성 모형 고착)→"원자핵 주위에 분포(현대 모형은 확률)"로 완화. ④ 1몰 모래알 "수십 미터" 과장→검증가능 비유로 교체. 검수 internal/notes 영속화. gate PASS. push f57c812. → 고등 5과목 전부 양방향 교차검수 완료(통합·물리·화학·생명·지구).' },
      { type:'완료', title:'Codex 고2 생명과학 Claude 교차검수 PASS (2026-06-01)', desc:'Claude가 Codex 생명과학(3단원 12레슨 + 도해 3종)을 교차검수. 과학 정확성(막전위·활동전위·역치·실무율·도약전도, 인슐린/글루카곤·음성 피드백, 선천/후천 면역·항체·기억세포, 감수분열·교차·유전적 부동·계통수)·교육과정 적합성·도해 일치·strand 컨벤션 전 차원 PASS. 내용 수정 0건 — Codex 작업 정확·양호(특히 "우열로 항상 설명되지 않음"·"표현형은 환경 영향" 신중한 보충). 검수 internal/notes 영속화. push d1df1be. → 이로써 기초이론 과학 전 학교급·고등 5과목(통합·물리·화학·생명·지구) 교차검수 1라운드 완료.' },
      { type:'핵심', title:'기초이론 고등 화학 신설 — 10단원 + 도해 10종 (2026-06-01)', desc:'Claude가 고2 「화학」(2022 개정) 직접 구현 — 화학의 언어(화학식·몰·농도)+물질의 구조와 성질(원자·주기성·결합·분자극성)+화학 반응(동적평형·산염기·산화환원) 10단원. 2에이전트 병렬 집필+검수, 도해 10종(분자·주기율표·pH·화학전지). 마지막 산화환원(화학전지)이 산업영역 전력으로 연결. strand "화학 · 영역"으로 배지 표시. (Codex는 고2 생명과학 병렬 진행 — 곧 Claude 검수 예정.) gate PASS, figureId 82/82. push 56c137a. → 기초이론 과학 누적: 초28+중23+고(통합6+물리10+화학10+생명+지구4).' },
      { type:'완료', title:'통합과학(고1) Codex 교차검수 3건 반영 (2026-06-01)', desc:'Codex가 통합과학 high1을 검수 — 3건 타당, 수정 완료. ① 통합 단원이 배지에서 단일 분야(물리/화학/지구과학)로 오인되던 문제 → unitLabel 일반화 + 6단원 strand "통합과학"으로 표시(도메인 색만 유지). 동시에 물리학 strand도 "물리 · 전기와 자기" 형태로 통일. ② 별의 원소 생성 "태양보다 무거운 별→철"을 "훨씬 무거운(질량 큰) 별"로 한정. ③ 산·염기 아레니우스 정의에 "이 단원 물속 반응 기준" 범위 표기 추가(화학 선택과목과 충돌 방지). 검수 internal/notes 영속화. gate PASS. push 55aae6f. → 기초이론 과학 전 학교급(초·중·고)에서 양방향 교차검수 1라운드 완료.' },
      { type:'완료', title:'물리학 Codex 교차검수 4건 반영 (2026-06-01)', desc:'Codex가 Claude 고2 물리학을 교차검수 — 4건 전부 타당, 수정 완료. ① 속도-시간 그래프 넓이=변위로 정정(이동거리 아님, 본문·용어·도해 일괄). ② 포물선 수직 속도 "점점 빨라진다"→상승 시 감소·꼭대기 0·하강 시 증가로 정정. ③ 운동량 보존 "힘 상쇄" 모순→"계 전체 운동량 변화 0"으로 정정(작용·반작용과 정합). ④ 전기·빛 단원이 전부 "운동과 에너지" 배지로 표시되던 문제→Unit.strand 필드 + unitLabel 추가로 "물리·전기와 자기"·"물리·빛과 물질" 구분 표시. +highPhysics id 추가, 물리학 단독 분리 커밋. 검수 internal/notes 영속화. typecheck/build/eslint PASS. push 4f2d55c.' },
      { type:'완료', title:'Codex 고2 지구과학 Claude 교차검수 PASS (2026-06-01)', desc:'초등편을 Codex가 검수했듯, 이번엔 Claude가 Codex 지구과학(4단원 12레슨 + 도해 4종)을 교차검수. 과학 정확성(열염순환·표준화석 삼엽충/암모나이트·H-R도 온도축·절대등급 10파섹·허블법칙·우주배경복사)·교육과정 적합성·도해-본문 일치·스키마 전 차원 PASS. 내용 수정 0건 — Codex 작업이 정확·양호(특히 화강암=심성암 구분을 올바르게 사용). 검수 내역 internal/notes/claude-review-2026-06-01-high2-earth-science.md 영속화. 선택적 하모나이즈(도해 in-SVG 제목 중복 제거)는 박사 결정 대기. push 3ce8c0d.' },
      { type:'핵심', title:'기초이론 고등학교 과학 신설 — 물리학 10단원 + 통합과학·지구과학 (2026-06-01)', desc:'고등 레벨 활성화(준비중→완료). 고등은 학년이 아니라 과목 단위라, Grade에 label을 추가해 칩을 "통합과학·물리학·지구과학" 과목명으로 표시(TheoryView gradeLabel). [Claude] 고2 「물리학」 10단원 직접 구현 — 2022 개정 물리학(힘과 에너지/전기와 자기/빛과 물질), 2에이전트 병렬 집필+검수, 도해 10종(그래프·벡터·관계식). 마지막 반도체 단원이 산업영역으로 연결. [Codex] 고1 통합과학·고2 지구과학 데이터+도해(병렬 트랙, 내용 cross-review 예정). 게이트 PASS, figureId 69/69. push f394932. 기초이론 과학 누적 = 초28+중23+고(통합6+물리10+지구4)=71단원·도해 69종.' },
      { type:'완료', title:'초등 과학 Codex 교차검수 5건 반영 (2026-06-01)', desc:'Codex(KA-ELEM-REVIEW-1)가 초등 과학편을 검수 — Claude가 5건 전부 타당 판단·수정. ① BLOCK 모바일 깨짐: useIsMobile 훅 + TheoryView 데스크탑/모바일 2-레이아웃(모바일=상단 컴팩트 네비+학년 가로스크롤+단원 select+본문 100%)+SectionNav compact. ② 볼록렌즈 근시 안경 오류→오목 렌즈로 정정. ③ 화강암을 화산암 문맥에서 분리(심성암). ④ 남중고도↔낮길이 인과 표현 완화·달 물공기 완화. ⑤ 이미지-단원 매칭: 전용 도해 4종 신규(물질의성질·혼합물분리·산과염기·물체의운동)+오타 수정. 검수내역 internal/notes 영속화. typecheck/build/eslint PASS, figureId 49/49. push 875aa9b.' },
      { type:'핵심', title:'기초이론 중학교 과학 신설 — 23단원 + 도해 23종 (2026-06-01)', desc:'기초이론 과학에 중학교 과정 추가(중등 탭 준비중→완료). 2022 개정 교육과정 기준 중1 8 + 중2 7 + 중3 8 = 23단원, 본문·핵심용어·흥미사실 집필(3에이전트 병렬+검수). 통합 단원(지속가능·재해·진로)을 위해 5번째 영역 "과학과 사회" 도메인 신설. 중학교 SVG 도해 23종은 입자 모형·그래프·법칙 관계를 강조해 신규 제작(전부 로컬). 출발점은 Codex가 만든 준비노트(KA-MIDSCI-PREP-1, ac95267) 명세 — Claude가 검토 후 실제 콘텐츠로 구현·통합. typecheck+build+eslint(0) PASS, figureId 45/45 매칭. push e299b00. (지금 기초이론 과학: 초등 28단원 + 중등 23단원 = 51단원, 도해 45종)' },
      { type:'핵심', title:'대분류 2층 구조 + 기초이론(초등 과학) 신설 (2026-06-01)', desc:'기존 평면 영역 위에 「대분류」 2층을 얹음 — 최상단 SectionNav로 ① 산업(반도체·전력 3D) ⇄ ② 기초이론 전환. 기초이론은 3D가 아닌 읽기형 학습자료 뷰(TheoryView): 과학 → 학교급(초/중/고) → 학년 → 단원 → 레슨(본문+핵심용어+흥미사실). 초등 과학 3~6학년 전 단원 28개를 교육과정(2015/2022 개정) 기준으로 집필(5에이전트 병렬 + 사실검증)하고, 단원별 SVG 도해 22종을 직접 제작(전부 로컬·외부호출 0). 중/고등은 "준비 중" 플레이스홀더(초등 우선). 산업 렌더링은 IndustryView로 분리. typecheck+build PASS. push 7ee3fbf.' },
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
      { isCore:true, date:'2026-06-01', title:'브랜드 「Knowledgeverse」로 개명 + 공정 모드 대상 반도체 안내', desc:'프로젝트명을 「Knowledgeverse(놀리지버스)」로 확정(영문 표기) — 「아틀라스」(가족 출판물명과 중복)를 빼고 지식+유니버스(-verse)로 각 영역=하나의 우주, 전체=Knowledgeverse 위계와 정합. brand.ts 단일 소스로 중앙화(워드마크·브레드크럼·타이틀·학습문구 일괄 교체, 옛 명칭 잔존 0). 산업>반도체 「공정 과정」에 8대 공정이 모든 실리콘 기반 반도체의 공통 제조 과정임을 알리는 안내 배너+목록 부제 추가, 5공정 「증착·이온주입」·7공정 「EDS」 정식 명칭 정렬. tsc+vite build PASS. push abc88a2, 미리보기 재배포.' },
      { isCore:true, date:'2026-06-01', title:'영역 1 — 반도체 8대 공정 모드 추가', desc:'「반도체 8대 공정」 인포그래픽을 3D로 재구현 — 산업>반도체에 세 번째 모드 「공정 과정」. 8단계(웨이퍼~패키징)를 뱀형 흐름+방향 화살표의 웨이퍼 파이프라인으로, 단계별 고유 3D 비주얼(웨이퍼·산화막·포토마스크·식각·박막 스택·금속배선·프로브·IC 패키지) + 단계 클릭 시 「왜 중요한가·특징·국내/해외 기업」 패널. tsc+vite·ESLint 0·Playwright 검증(콘솔 에러 0). push db120a3, 미리보기 재배포.' },
      { isCore:true, date:'2026-06-01', title:'「SF 과학 판별」 신설(소설 삼체 4단원) + 과학 파트 전체 QA 통합', desc:'기초이론 과학 5번째 레벨 「SF 과학 판별」 추가 — 소설 삼체의 과학을 상상력/현실/판정 3층으로 분해한 4단원(천체역학·양자정보·우주공학·문명윤리, 출처 명시). 같은 통합에서 Claude 과학 내용 최종 QA 20건 + Codex 구현 최종 QA를 main 통합(충돌 0). 기초이론 과학 누적 133단원·도해 131종. gate PASS, main push a06e3dd, 라이브 프리뷰·대시보드 동시 갱신.' },
      { isCore:true, date:'2026-06-01', title:'기초이론 고등 진로 선택 과학 신설 (물리·화학 4과목 + 도해 24종)', desc:'2022 개정 「진로 선택」 과학 진입. Claude=역학과 에너지·전자기와 양자·물질과 에너지·화학 반응의 세계 4과목 24단원+도해 24종(strand "진로 선택 · 물리/화학"), Codex=생물·지구·우주·융합 7과목(병렬 트랙, 네임스페이스 분리·충돌 0). 안전 준수(산·염기 맛/촉감 배제, 전자=오비탈/확률). 기초이론 과학 누적 129단원(초28+중23+고78), 도해 127종. gate PASS, push fe3aed7, 라이브 프리뷰 동시 갱신.' },
      { isCore:true, date:'2026-06-01', title:'기초이론 고등학교 과학 신설 (물리학 + 통합과학 + 지구과학)', desc:'고등 레벨 활성 — 과목 단위(label) 칩 구조 도입. Claude=고2 물리학 10단원+도해 10종(2022 개정), Codex=고1 통합과학·고2 지구과학(병렬 트랙). 기초이론 과학 누적 71단원(초28+중23+고20). gate PASS, 라이브 프리뷰 동시 갱신.' },
      { isCore:true, date:'2026-06-01', title:'기초이론 중학교 과학 신설 (23단원 + 도해 23종)', desc:'Codex 준비노트(23단원 명세)를 Claude가 검토·구현해 중등 과학 완성 — 중1·2·3 총 23단원 본문/핵심용어 + "과학과 사회" 도메인 추가 + 중학교 SVG 23종. 중등 탭 활성화. 기초이론 과학 누적 51단원(초28+중23). semiconductor-universe push e299b00, gate(typecheck/build/eslint) PASS, 대시보드 라이브 프리뷰 동시 갱신.' },
      { isCore:true, date:'2026-06-01', title:'대분류 2층 구조 + 기초이론(초등 과학) 신설', desc:'Knowledgeverse를 「산업 / 기초이론」 2개 대분류로 재편. 기초이론에 학교 과학을 신설하고 초등 3~6학년 전 단원 28개를 본문·핵심용어·흥미사실로 집필 + 단원별 SVG 도해 22종 제작(전부 로컬). 산업/기초이론 최상단 전환, 중·고등은 준비 중. semiconductor-universe push 7ee3fbf, typecheck+build PASS.' },
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
      { isCore:true, date:'2026-05-31', title:'영역 2 — 전력 유니버스 신설 + 멀티영역 구조·영역 선택기', desc:'반도체 전용 앱을 데이터 주도 멀티영역 Knowledgeverse로 일반화(AtlasArea + AreaSelector 드롭다운). 두 번째 영역 「전력 유니버스」(대한민국 전력) 추가 — 발전원 14분류 + 전력 3D 아이콘 9종(원자로·냉각탑·태양광·풍력·댐·수소탱크·배터리·송전탑·계통허브) + 전력 기업/기관 23 + 공급망 33관계, 본사 한반도 핀. 데이터는 워크플로 5에이전트 수집·적대적 사실검증. tsc+vite·ESLint 0·Playwright 2영역×2모드 검증(콘솔 에러 0). semiconductor-universe push 08db798, 미리보기 재배포.' }
    ]
  },
  {
    id: 'tradelogix',
    no: 8,
    name: 'TradeLogix Nexus',
    subtitle: '무역과 물류 — Part 1. 통관 마스터(Customs Clearance Core) · 부산항 북항/신항 통관 + Incoterms 2020 + 수입신고필증 / 선사 업무(MAGE 프로젝트 supply DB + 선박 증서 31종 도해) / 보세사 기출문제 뷰어(1과목 2025~2019년 · 2과목 2025~2019년 · 3과목 2025~2019년 · 4과목 2025~2021년 — 공식정답표 전수검증)',
    icon: 'trade-globe',
    platform: '웹 애플리케이션 (단일 HTML · Tailwind Play CDN · Vanilla JS)',
    status: 'in-progress',
    start: '2026-06-04',
    latest: '2026-06-10',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/tradelogix-hub/',
    preview: { type:'embed', height:660, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/tradelogix-hub/', label:'VIEW → 카테고리 선택: 「통관절차」(부산항 통관 + Incoterms 2020 + 수입신고필증)와 「선사업무」(MAGE 프로젝트 supply DB + 선박증서 31종)를 한 화면에서 선택·전환 — 선사업무는 다시 MAGE/증서 서브허브로 분기' }
    ]},
    summary: '지식 대시보드 시리즈 9번 — 무역·물류 「통관」을 인터랙티브하게 학습하는 단일 페이지 대시보드.\n'
           + '부산항 북항/신항을 기준으로 수입·수출·반송 통관 프로세스, Incoterms 2020 비용/위험 분기점, 한국 수입신고필증 10대 항목을 한 화면에서 탐색한다.\n'
           + '변증법 협업(Claude 제안 ↔ Codex 반박·검수) R1~R3 수렴 후 Codex 사후검수 PASS — Part 1 통관 마스터 구현 완료(라이브 프리뷰).\n'
           + '또한 #9의 또 다른 축인 「선사 업무」 자료로, 국제항해 컨테이너선의 선박 증서 31종을 8개 기능분류로 정리한 도해(종류·용도·근거협약)를 별도 단일 HTML로 추가했다 — 식별·상업·개인정보를 제거한 공개 마스킹본.',
    method: '단일 HTML5 + Tailwind(Play CDN) + Vanilla JS + FontAwesome로 구현. 중앙 상태머신(통관유형·항만·Incoterm·활성필드)을 '
          + '단방향 setState→render 루프로 돌리고, 인라인 SVG로 보세창고 플로우차트와 비용/위험 분기점 게이지를 그린다. 모든 텍스트 한국어, 실무급 통관·관세 콘텐츠.',
    stack: ['HTML5', 'Tailwind CSS', 'Vanilla JS', 'FontAwesome', 'SVG'],
    stackDetail: [
      { area: '상태머신·렌더 엔진', tech: 'Vanilla JS', how: '통관유형(수입·수출·반송)·항만(북항·신항)·선택 Incoterm·활성 신고필증 필드를 단일 상태 객체로 두고, setState→render 단방향 루프로 패널별 부분 렌더한다. 프레임워크 0, zero-latency 트랜지션.' },
      { area: '보세창고 프로세스 플로우차트', tech: 'SVG, Vanilla JS', how: '부산항 북항(세방·동방 우암물류·BPA 지정보세창고)·신항(HJNC 배후물류단지·세방부산신항물류센터·DWL글로벌·BIDC) 보세창고 노드를 인라인 SVG로 그리고, 노드 클릭 시 관세법 이론 vs 부산항 실무·리스크 스플릿 뷰포트를 렌더한다.' },
      { area: 'Incoterms 2020 매트릭스·분기점 게이지', tech: 'SVG, Vanilla JS', how: '11규칙(Multimodal 7 + Maritime 4)을 그리드로 배치하고, 클릭 시 매도인→매수인 축에 비용 분기점·위험 분기점을 마커로 표시하는 게이지를 그린다(C-텀 비용≠위험 분리 강조).' },
      { area: '수입신고필증 인스펙터', tech: 'Tailwind, Vanilla JS', how: '한국 수입신고필증 레이아웃을 Tailwind grid로 재현하고 10개 핵심 항목(신고번호·납세의무자·HS세번·과세가격·세액 등)을 핫스팟으로, 클릭 시 의미+실무 리스크 모달을 띄운다.' },
      { area: '디자인 시스템', tech: 'Tailwind CSS, FontAwesome', how: '다크 엔터프라이즈 SaaS(베이스 #0F172A, slate 컨테이너) + 재무/리스크 경계 그라데이션(비용 emerald·위험 rose·세액 violet). FontAwesome 아이콘.' },
    ],
    issues: [
      { type:'완료', title:'#9 워크스페이스·레포 신설 (변증법 협업 베이스 적용)', desc:'기존 프로젝트와 분리된 독립 레포 gmpark-creator/tradelogix-nexus(private) 생성 — master(박사 베이스라인)/newton(Claude)/codex(Codex) 3 worktree 물리 격리. AGENTS.md·CODEX_SYNC.md 변증법 규약 + Part 1 R1 Thesis 영속화.' },
      { type:'완료', title:'Part 1 통관 마스터 구현 완료 — 변증법 R1~R3 + Codex 검수 PASS', desc:'Claude 제안 ↔ Codex 반박 3라운드(R1·R2 BLOCK → R3 PASS·IMPLEMENTATION GO) 후 Claude 단독 구현(index.html 52KB): 상태머신 v2, 통관 3유형 동등 플로우(수입9/수출6/반송5), Incoterms 11 8필드 구조체+비용/위험 게이지, 수입신고필증 10필드 인스펙터+세액 read-only 카드(부가세 과표=과세가격+관세+내국세), desktop/mobile 이중렌더+lazy+접근성+fallback. Codex 사후검수 PASS(데이터계약 55 + Playwright headless + 390px overflow0 + 모달 생성/제거 + CDN fallback smoke). 라이브 프리뷰 배포.' },
      { type:'완료', title:'선사 업무 — 선박 증서 31종 도해 추가 (2026-06-05)', desc:'#9의 두 축(통관 / 선사 업무) 중 「선사 업무」 자료. 국제항해 컨테이너선 증서철 31종 PDF를 Claude 워크플로(32 에이전트 병렬)로 명칭·근거협약·용도·유효기간을 추출·교차감사해 8개 기능분류(등록·국적 / 선급·구조·안전·통신 / 해양환경 / 안전관리·보안 / 선원·노동 / 보험·재정보증 / 위험물 / 검역) 인터랙티브 도해(자급식 단일 HTML)로 작성. 각 증서의 정의·「선사 업무 용도」·미보유 시 결과·근거협약을 카드+분류 필터+검색으로 제공. 공개 게시 위해 선명·IMO·소유/관리회사·보험·선원·증서번호 등 식별·상업·개인정보를 마스킹(상세본은 로컬 비공개). Part 1 통관 마스터와 별개의 독립 단일 HTML로 previews/ship-certs/에 배치.' },
      { type:'완료', title:'VIEW 카테고리 선택 허브 신설 — 통관절차/선사업무 통합 (2026-06-05)', desc:'박사 지시 — VIEW 클릭 시 두 카테고리를 따로 분리하지 않고 한 화면에서 선택. previews/tradelogix-hub/ 신설(자급식 단일 HTML): 「통관절차」(통관 마스터 앱)·「선사업무」(선박 증서 31종 도해) 두 카드 선택 화면 + 카드 선택 시 동일 화면 내 임베드 뷰어(← 카테고리 복귀, 딥링크 #customs·#carrier). #9 프리뷰를 이 허브 하나로 통합(기존 2탭 분리 → 1 진입+카테고리 전환). 통관 앱·선사업무 도해 자체는 그대로 두고 허브가 둘을 연결.' },
      { type:'완료', title:'선사업무 서브허브화 — MAGE 프로젝트(supply DB) 통합 (2026-06-05)', desc:'박사 지시(집작업 선박증서 + Claude 정리 MAGE를 합쳐 정리) — #9 선사업무를 서브허브(previews/ship-ops-hub/)로 재편: ① MAGE 프로젝트 = 북극 탐사선단(NIKOLAY TRUBYATCHINSKY·AKADEMIK KAZANIN·SAPFIR) 선박 supply 조달 DB(raw 361→표준 199품목; A화학2·B식료품95·C기관예비품76[Cummins N14]·D전자전기15·E공구위생11)를 previews/mage-supply/에 marked.js 뷰어로 배치(batch-01, 50/215p, Codex 교차검수 대기). ② 선박증서 = 박사 작성 31종 도해(ship-certs) 그대로 연결. tradelogix-hub 선사업무 카드 → 서브허브 링크. 통관(Module1) + 선사(Module2: MAGE·증서) 통합 완성.' },
      { type:'완료', title:'MAGE supply — 214p 전량 종결 + \'부식\' 제외 + 누락배치 정리 (2026-06-09)', desc:'박사 지시 — 선박 supply 조달기록 PDF 4분할 중 남은 batch-02(p51~100)·batch-03(p101~160, 60p)·batch-04(p161~214, 54p)를 220DPI 비전 OCR + (b04는 텍스트레이어 병행) 2단 적대검증 워크플로로 정리해 214페이지 전량 종결. \'부식\'(식료품·식수)은 박사 지시로 제외 — batch-01의 식료품 95품목도 소급 삭제, 비식품(선용품·예비품·소모품·기술개념)만 수록. 신규 선박 ALMAZ·FEDOR KOVROV 식별, 신규 카테고리(배관·유압·탐사장비[Sound Oceanics·Trelleborg]·항해통신·안전구명). cross-batch 중복(주방·침구·디스차지밸브·TrioVing·시멘트 FFE) 재계상 제외. previews/mage-supply/ 뷰어를 4배치 탭+종합 인덱스로 갱신.' },
      { type:'완료', title:'MAGE supply 전배치 — Claude 2라운드 적대 자체검수 (2026-06-09)', desc:'Codex 토큰 부재로 변증법 검수 역할을 Claude가 대행 — 자기검수 sycophancy 차단 위해 독립 적대 에이전트 fan-out. R1 적발(25 감사관, 원본 PNG↔DB 재대조) 139건 → R2 독립 재대조(11, 검증8+완전성비평3) 오탐 0으로 확정 → 88건 정정. OCR 환각 적발(Epson→Kyocera·TV→토너·BLUE→GLUE GUN·DNPF→DMP333·Cummins 부품번호 \'1자리 차\' 환각 13건), 누락품목 복원(ALMAZ 연료필터·Sanding머신 등), 시멘트 cross-batch 이중계상 제거, b01 통계 104(미집계)→129행 교정. 정정후 누적 ~404행. 한계: Claude 단독이라 모델 공통 맹점 잔존 가능 → Codex 3자 검수 권장.' },
      { type:'완료', title:'보세사 기출문제 뷰어 + 좌측 사이드바 개편 (2026-06-10)', desc:'상단탭을 좌측 사이드바(통관/보세사업무 2섹션)로 전환. 보세사 1과목(수출입통관절차) 2025년 25문항 인터랙티브 뷰어 구현 — 공식 정답표(A형) 기반 전수검증(정답 25문 1:1 대조 PASS), 정답/오답 컬러 피드백, 정답 근거, 선지별 분석 아코디언. 2024~2019년·2~5과목은 준비중 잠금. bosesa-data-1-2025.js 별도 데이터 모듈화.' },
      { type:'완료', title:'보세사 1과목 2024년 기출 추가 (2026-06-10)', desc:'2024년 25문항 전수 분석(정답근거+선지별분석) 작성 — 공식 정답표(A형) 1차 검수 25/25 PASS. bosesa-data-1-2024.js 신규, 사이드바 2024년 버튼 활성화, renderBosesaQuiz/renderSidebar 2024 분기 추가. newton push 완료.' },
      { type:'완료', title:'보세사 1과목 2023년 기출 추가 (2026-06-10)', desc:'2023년 25문항 전수 분석 작성 — 공식 정답표(A형) 1차 검수 25/25 PASS. Q3 복수정답(④⑤) 처리 포함. bosesa-data-1-2023.js 신규, 사이드바 2023년 버튼 활성화. newton push 완료.' },
      { type:'완료', title:'보세사 1과목 2022년 기출 추가 (2026-06-10)', desc:'2022년 25문항 전수 분석 작성 — PDF 이미지(p03~p14) 직접 판독 + 공식 정답표(A형, 가나다라마→①②③④⑤) 1차 검수 25/25 PASS. Q11 복수정답(④⑤) 처리 포함. bosesa-data-1-2022.js 신규, 사이드바 2022년 버튼 활성화. newton push 완료.' },
      { type:'완료', title:'보세사 1과목 2021년 기출 추가 (2026-06-10)', desc:'2021년 25문항 전수 분석 작성 — PDF 이미지(p04~p16) 직접 판독 + 공식 정답표(A형) 1차 검수 25/25 PASS. Q19 모두정답([1,2,3,4,5]) 처리, Q22 소멸시효 정지사유 법령 기준 적용(관세법 제23조제4항), Q24 4지선다 확인. bosesa-data-1-2021.js 신규, 사이드바 2021년 버튼 활성화. newton push 완료.' },
      { type:'완료', title:'보세사 1과목 2020년 기출 추가 (2026-06-10)', desc:'2020년 25문항 전수 분석 작성 — PDF 이미지(p04~p13) 직접 판독 + 공식 정답표(A형) 1차 검수 25/25 PASS. Q21 모두정답([1,2,3,4,5]) 처리. bosesa-data-1-2020.js 신규, 사이드바 2020년 버튼 활성화. newton push 완료.' },
      { type:'완료', title:'보세사 1과목 2019년 기출 추가 (2026-06-10)', desc:'2019년 25문항 전수 분석 작성 — PDF 이미지(p04~p14) 직접 판독 + 공식 정답표(A형) 1차 검수 25/25 PASS. bosesa-data-1-2019.js 신규, 사이드바 2019년 버튼 활성화(준비중 버튼 교체). newton push 완료.' },
      { type:'완료', title:'보세사 2과목(보세구역관리) 2025년 기출 추가 (2026-06-10)', desc:'2025년 2과목 25문항 전수 분석(정답근거+선지별분석) 작성 — 공식 정답표(A형) 1차 검수 25/25 PASS. bosesa-data-2-2025.js 신규, 2과목 사이드바 섹션(toggleSubject2 + 접이식 메뉴) 신설, 라우팅(bosesaSubject===2) 추가. newton push 완료(aa3fe66).' },
      { type:'완료', title:'보세사 2과목(보세구역관리) 2024년 기출 추가 (2026-06-10)', desc:'2024년 2과목 25문항 전수 분석(정답근거+선지별분석) 작성 — 공식 정답표(A형) 1차 검수 25/25 PASS. bosesa-data-2-2024.js 신규, 사이드바 2024년 버튼 활성화(준비중→활성). newton push 완료(f973952).' },
      { type:'완료', title:'보세사 3과목(화물관리) 2024년 기출 추가 (2026-06-10)', desc:'2024년 3과목 25문항 전수 분석(정답근거+선지별분석) 작성 — 공식 정답표(A형) 1차 검수 25/25 PASS. bosesa-data-3-2024.js 신규, 사이드바 2024년 버튼 활성화. newton push 완료(9fabd4c).' },
      { type:'완료', title:'보세사 3과목(화물관리) 2023년 기출 추가 (2026-06-10)', desc:'2023년 3과목 25문항 전수 분석(정답근거+선지별분석) 작성 — 공식 정답표(A형) 대조 검증. bosesa-data-3-2023.js 신규, 사이드바 2023년 버튼 활성화. newton push 완료(9394168).' }
    ],
    milestones: [
      { date:'2026-06-04', title:'프로젝트 #9 신설 — TradeLogix Nexus (무역과 물류)', desc:'지식 대시보드 시리즈 9번으로 신설. Part 1 = 통관 마스터(부산항 북항/신항 통관 + Incoterms 2020 + 수입신고필증). 독립 레포·worktree 격리 셋업, 대시보드 등록.' },
      { date:'2026-06-04', title:'Part 1 통관 마스터 — R1 Thesis(설계) 작성', desc:'변증법 협업 베이스 첫 적용 — Claude가 설계 제안(R1 Thesis) 작성·영속화. 다음 = Codex R1 Antithesis(반박) → 라운드 무제한 → Codex 구현 승인 후 Claude 단독 구현.' },
      { date:'2026-06-04', title:'Part 1 구현 완료 + Codex 검수 PASS (변증법 1사이클 종료)', desc:'설계 변증법 R1~R3(R1·R2 Codex BLOCK → R3 PASS·IMPLEMENTATION GO) → Claude 단독 구현(index.html) → Codex 사후검수 PASS(데이터계약 55·Playwright headless·390px·fallback). 라이브 프리뷰 대시보드 임베드. master 통합은 박사 디렉팅 대기.' },
      { date:'2026-06-05', title:'「선사 업무」 선박 증서 31종 도해 추가 + 대시보드 #9 임베드', desc:'#9의 선사 업무 축으로 선박 증서 31종(등록·국적 / 선급·구조·안전·통신 / 해양환경 / 안전관리·보안 / 선원·노동 / 보험·재정보증 / 위험물 / 검역) 도해를 마스킹 공개본으로 작성해 previews/ship-certs/에 배치. 증서철 31종 PDF를 워크플로(32 에이전트)로 추출·교차감사. Edge 헤드리스 렌더 검증(데스크탑·모바일 리플로우 정상).' },
      { date:'2026-06-05', title:'VIEW 카테고리 선택 허브 — 통관절차/선사업무 통합 전환', desc:'#9 VIEW 진입을 카테고리 선택 허브(previews/tradelogix-hub/)로 전환 — 통관절차·선사업무를 한 화면에서 선택/전환(딥링크 #customs·#carrier). 기존 프리뷰 2탭 분리 → 허브 1개로 통합, 통관 앱·선사업무 도해는 그대로 연결.' },
      { date:'2026-06-05', title:'선사업무 서브허브화 — MAGE 프로젝트 supply DB 통합', desc:'박사 집작업(선박증서 허브)과 Claude 정리(MAGE)를 합침 — 선사업무를 서브허브(ship-ops-hub)로 재편: MAGE 프로젝트(북극 탐사선단 supply DB, raw361→표준199품목, mage-supply) + 선박증서(31종) 2분기. batch-01(50/215p) marked.js 뷰어 배치, Codex 교차검수 대기.' },
      { date:'2026-06-09', title:'MAGE supply 214p 전량 종결 + 부식 제외 (batch-02·03·04)', desc:'남은 3배치(p51~214)를 비전 OCR 2단 적대검증으로 정리해 214p 전량 처리 종결. \'부식\'(식료품·식수)은 박사 지시로 제외(b01 식료품 95품목 소급 삭제). 신규 선박 ALMAZ·FEDOR KOVROV, 신규 카테고리(탐사장비 Sound Oceanics·Trelleborg / 배관·유압 / 항해통신 / 안전구명). cross-batch 중복 재계상 제외. mage-supply 뷰어를 4배치 탭+종합 인덱스로 갱신.' },
      { date:'2026-06-09', title:'MAGE supply 전배치 Claude 2라운드 적대 자체검수 (88건 정정)', desc:'Codex 토큰 부재로 Claude가 검수 대행 — 독립 적대 에이전트로 R1 적발 139건 → R2 독립 재대조(오탐 0) → 확정 88건 정정. OCR 환각(Epson→Kyocera·TV→토너·글루건·DMP333·Cummins 부품번호 환각 13)·누락품목 복원·시멘트 cross-batch 이중계상 제거·b01 통계 104→129 교정. 누적 ~404행. 한계상 Codex 3자 검수 권장.' },
      { date:'2026-06-09', title:'데이터 범위 확정 — 현재 2026.4~5월분 종결 / 25.10~26.3월분 추후', desc:'박사 안내 — 지금까지 정리한 MAGE supply DB는 2026년 4~5월 조달분(PDF 214p 전량)이다. 2025년 10월~2026년 3월 조달분은 박사가 자료 준비되는 대로 추후 제공 → 동일 워크플로(비전 OCR 2단검증 + 부식 제외)로 이어 누적 예정. 현재는 자료 미수신 대기. \'부식\'(식료품·식수)은 batch-02~04에서 애초 미정리 → 그대로 미수록 확정(원본 PDF·git 178affa 커밋에 원천 보존).' },
      { date:'2026-06-10', title:'보세사 기출문제 뷰어 + 좌측 사이드바 레이아웃 개편', desc:'상단탭을 좌측 사이드바(통관/보세사업무)로 전환, 보세사 1과목 2025년 25문항 인터랙티브 뷰어 구현(공식 정답표 기반 전수검증 PASS). 정답/오답 피드백 + 정답 근거 + 선지별 분석. 데이터 모듈(bosesa-data-1-2025.js) newton push 완료.' },
      { date:'2026-06-10', title:'보세사 1과목 2024년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2024년 25문항 전수 분석(정답근거+선지별분석 125개) 작성. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-1-2024.js 신규, 사이드바 2024년 버튼 활성화, 대시보드 프리뷰 갱신.' },
      { date:'2026-06-10', title:'보세사 1과목 2023년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2023년 25문항 전수 분석 작성. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. Q3 복수정답(④⑤) 처리. bosesa-data-1-2023.js 신규, 사이드바 2023년 버튼 활성화. newton push 완료.' },
      { date:'2026-06-10', title:'보세사 1과목 2022년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2022년 25문항을 PDF 이미지(p03~p14) 직접 판독으로 추출, 공식 정답표(A형, 가→①나→②다→③라→④마→⑤ 변환) 대조 1차 검수 25/25 PASS. Q11 복수정답(④⑤) 처리. bosesa-data-1-2022.js 신규, 사이드바 2022년 버튼 활성화. newton push 완료.' },
      { date:'2026-06-10', title:'보세사 1과목 2021년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2021년 25문항을 PDF 이미지(p04~p16) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. Q19 모두정답([1,2,3,4,5]) 처리, Q22 소멸시효 정지사유 법령 기준 확정(관세법 제23조제4항), Q24 4지선다 확인. bosesa-data-1-2021.js 신규, 사이드바 2021년 버튼 활성화. newton push 완료.' },
      { date:'2026-06-10', title:'보세사 1과목 2020년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2020년 25문항을 PDF 이미지(p04~p13) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. Q21 모두정답([1,2,3,4,5]) 처리. bosesa-data-1-2020.js 신규, 사이드바 2020년 버튼 활성화. newton push 완료.' },
      { date:'2026-06-10', title:'보세사 1과목 2019년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2019년 25문항을 PDF 이미지(p04~p14) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-1-2019.js 신규, 사이드바 2019년 버튼 활성화. newton push 완료(ac0232f).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2025년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2025년 2과목 25문항을 PDF 이미지(bosesa_25_2) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-2-2025.js 신규, 2과목 사이드바 섹션 신설. newton push 완료(aa3fe66).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2024년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2024년 2과목 25문항을 PDF 이미지(bosesa_24_2) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-2-2024.js 신규, 사이드바 2024년 버튼 활성화. newton push 완료(f973952).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2023년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2023년 2과목 25문항을 PDF 이미지(bosesa_23_2, 13장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-2-2023.js 신규, 사이드바 2023년 버튼 활성화. newton push 완료(1305cf5).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2022년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2022년 2과목 25문항을 PDF 이미지(bosesa_22_2, 13장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. Q1 복수정답(①④) 처리. bosesa-data-2-2022.js 신규, 사이드바 2022년 버튼 활성화. newton push 완료(afbe965).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2021년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2021년 2과목 25문항을 PDF 이미지(bosesa_21_2, 13장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-2-2021.js 신규, 사이드바 2021년 버튼 활성화. newton push 완료(1623373).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2020년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2020년 2과목 25문항을 PDF 이미지(bosesa_20_2, 12장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. Q21 모두정답([1,2,3,4,5]) 처리. bosesa-data-2-2020.js 신규, 사이드바 2020년 버튼 활성화. newton push 완료(edc2913).' },
      { date:'2026-06-10', title:'보세사 2과목(보세구역관리) 2019년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2019년 2과목 25문항을 PDF 이미지(bosesa_19_2, 12장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. 2과목 전연도(2025~2019년) 완료. bosesa-data-2-2019.js 신규, 사이드바 2019년 버튼 활성화. newton push 완료(45fd2f3).' },
      { date:'2026-06-10', title:'보세사 3과목(화물관리) 2025년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2025년 3과목 25문항을 PDF 이미지(bosesa_25_3, 12장) 및 공식 최종정답표(전과목 통합) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. 3과목 사이드바 섹션 신설(toggleSubject3). bosesa-data-3-2025.js 신규. newton push 완료(e7725fa).' },
      { date:'2026-06-10', title:'보세사 3과목(화물관리) 2024년 — 25문항 전수 분석 + 1차 검수 PASS', desc:'2024년 3과목 25문항을 PDF 이미지(bosesa_24_3, 14장) 직접 판독으로 추출. 공식 정답표(A형) 대조 1차 검수 25/25 PASS. bosesa-data-3-2024.js 신규, 사이드바 2024년 버튼 활성화. newton push 완료(9fabd4c).' },
      { date:'2026-06-10', title:'보세사 3과목(화물관리) 2023년 — 25문항 전수 분석 완료', desc:'2023년 3과목 25문항을 PDF 이미지(bosesa_23_3, 13장) 직접 판독으로 추출. 공식 정답표(A형) 대조 검증. bosesa-data-3-2023.js 신규, 사이드바 2023년 버튼 활성화. newton push 완료(9394168).' },
      { date:'2026-06-10', title:'통관 실무 절차(현장) 추가 — 수입·수출·반송 (누가 누구에게 / 어디에 어떻게)', desc:'통관 마스터 뷰어(tradelogix-nexus)에 「실무 절차」 차원을 추가. 플로우 노드 클릭 시 ③실무 절차 카드(이 단계 주도 주체 + 누가→누구에게 연락 사슬 + 신고처/방식 + 현장 서류·전표 + 현장 팁)가 열리고, 통관유형별 연락체계 배너와 현장 등장인물·용어 사전(15개: 화주·포워더·선사·관세사·D/O·THC·UNI-PASS·적하목록 등)을 신설. 수입 9·수출 6·반송 5 노드 전부 채움. 핵심 검증사실: 적하목록 제출의무자=운항선사(포워더=혼재 작성책임자), 통관 신고수리(세관)와 D/O 화물인도(선사/포워더)는 별개 관문, 관세환급(관세청/관세사)≠부가세 영세율 환급(국세청/세무사) 주체 분리. 리서치+적대검증 워크플로(에이전트 7개)로 합성, customs-practice-data.js 모듈화. 헤드리스 렌더 검증 PASS(20개 노드 전부, page error 0).' },
      { date:'2026-06-10', title:'보세사 기출 17파일 425문항 정답·내용 전수 QA — 오류 76건 정정 + 렌더 버그 수정', desc:'손넷이 만든 보세사 데이터(1·2·3과목 × 연도, 425문항)를 공식정답표+관세법령 기준 리서치+적대검증(에이전트 34개)으로 전수 검토하고 정정. ①스키마 드리프트 수정: 파일마다 필드명이 제각각(번호 no/id/number, 지문 text/stemText/question, 정답 배열/숫자, 해설 answerBasis+choiceAnalysis / explanation)이라 2과목 2019~2024 등이 뷰어에서 q.answer.includes·choiceAnalysis.map TypeError로 렌더 깨지던 것을 렌더 정규화로 흡수(17조합 전부 PASS). ②확정 오류 76건 반영: 정답 자체 변경 26문항(예: 1-2019 Q24 ②→④·Q25 ③→⑤, 1-2025 Q4 단일→[④⑤]복수정답, 2-2024 Q4 ②→⑤·Q16 ②→③, 2-2022 Q21 ③→①, 2-2023 Q14 ②→④, 3-2024 Q22 ③→①), 전사오류 정정(재산관서→체신관서·동락→등락·국세청장→관세청장·킴벌리프로세스 등), 법령 근거조문 정정. 불확실 42건은 공식정답표 추가확인 필요로 보류(미수정). node 문법 17파일 + 17조합 헤드리스 렌더 에러0 검증. ⚠적대검증 기반이나 일부 정답변경은 KCLA 공식 최종정답표 교차확인 권장.' },
      { date:'2026-06-10', title:'보세사 3과목 화물관리 2022·2021·2020년 추가 (GPT 산출물 통합)', desc:'GPT(코덱스)가 웹에서 3과목 2020·2021·2022년 기출 25문항씩 분석·정답키와 함께 패키지로 전달 → Claude가 대시보드에 통합. bosesa-data-3-{2020,2021,2022}.js 3개 추가(공식 A형 정답키 기준, GPT 검증기 통과). index.html에 script 태그·사이드바 연도 버튼·active 처리는 GPT 자동패처로, GPT 패처/diff가 누락한 renderBosesaQuiz 데이터 매핑 분기(3개)는 Claude가 수동 보완. 3과목 이제 2019년만 빼고 2020~2025 완비. 헤드리스 검증: 3과목 6개 연도 전부 25문항 렌더·정답공개·사이드바 에러0, 2020 Q1 정답키(①) 하이라이트 일치. ⚠정답 정확도 적대QA는 미실시(GPT 자체 정답키 기준) — 필요시 별도 QA 가능.' },
      { date:'2026-06-11', title:'보세사 3과목 2020·2021·2022 정답 적대QA 완료 — 정답오류 0건', desc:'GPT 산출 3과목 75문항을 공식정답표+관세법령 기준 적대검증(에이전트 6개). 결과: 손넷 파일과 달리 정답 오류 0건(전부 정확). 적대검증이 1차 오판도 기각(예: 3-2021 Q22를 ④로 바꾸자던 1차 제안을 보세화물장치기간고시 제5조 원문으로 기각, 원본 ③ 유지)하고, 1차가 제안한 부정확한 해설값(자본금·기한 등)도 주입 차단. 확정 보강 1건만 반영: 3-2021 Q4 선지④ 해설을 관세법 제160조 제4항 기준으로 정정(정답 ② 불변 — ④가 틀린 진짜 이유는 "변질이 예상되는"이 폐기대상 "변질된"과 다른 점). node 문법·GPT 검증기·헤드리스 렌더(에러0) 재검증.' },
      { date:'2026-06-11', title:'보세사 4과목 수출입안전관리 2021~2025 신설 + 3과목 2019 보충 — 3·4과목 풀세트 (GPT 산출물 통합)', desc:'GPT 패키지(tradelogix_bosesa_3_complete_4_2021_2025) 통합. 신규 6파일: bosesa-data-4-{2021~2025}.js + bosesa-data-3-2019.js (각 25문항, GPT 검증기 9세트 전부 OK). 기존 3과목 2020~2022는 적대QA 통과본 보존(지시 7번 — 패키지 동봉본과 차이 있으나 미덮어씀). index.html: 4과목 사이드바 섹션(toggleSubject4+5개년)·script 태그·active 처리=GPT 자동패처, 데이터 조회 분기 6개=전례와 동일하게 패처 누락 → Claude 수동 보완. 2021년 4과목 정답키 25문항 지시문 대조 1:1 일치. 렌더러 스키마(번호/지문/선지/정답범위/해설) 6파일 전수 호환 검증 PASS. 보세사 뷰어 이제 1~3과목 2019~2025 + 4과목 2021~2025 = 총 26세트 650문항.' }
    ]
  },
  {
    id: 'tech-stack',
    no: 9,
    name: 'Tech Stack Collection',
    subtitle: '기술 스택 모음 — 대시보드 프로젝트들이 각 화면·기능에 어떤 기술을 쓰는지 분해하고, 다른 기술로 바꾸면 무엇이 달라지는지 시뮬레이션하며, 아직 안 쓴 기술로 만들 미래 프로젝트를 제안하는 3탭 아키텍처 진화 허브',
    icon: 'stack',
    platform: '웹 · 참고 시각화 (자급식 단일 페이지 + Tailwind)',
    status: 'completed',
    start: '2026-06-05',
    latest: '2026-06-05',
    progress: 100,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/tech-stack-architecture-hub/',
    preview: { type:'embed', height:640, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/tech-stack-architecture-hub/', label:'기술 스택 아키텍처 & 진화 허브 — ①현재 스택 정밀 분해(프로젝트 × 화면영역별 사용기술 인스펙터, 95개 스택을 역할·한마디·없으면·예시 5필드로 설명) ②기술 대체 시뮬레이션(22개 시나리오: UI·스타일·시각화·데이터·배포 계층 대체안 → 렌더링효율·구조복잡도·유지보수성·초기가벼움 4지표 + 트레이드오프) ③미래 스택 조합 엔진(미사용 88후보 기반 5종 조합)' },
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/future-stack-demos/', label:'미래 스택 데모 (프리마켓 콕핏) — ①프리마켓 콕핏: ECharts 매크로 히트맵·시그널 타임라인·Transformers 감성 시뮬·4시나리오·WebSocket 푸시 시뮬 ②프로젝트별 도입: StackForge 통합 — 프로젝트별 미사용 스택 도입 우선순위·커버리지·시너지(ECharts 게이지) ③노리지 그래프 비서: D3 force·WebGPU 감지 ④스택 사용 지도. 「이때까지 안 쓴 스택」을 실제로 사용해 만든 정적 교육용 데모(가상 데이터·투자자문 아님)' }
    ]},
    summary: '대시보드의 다른 프로젝트들이 각각 어느 화면·기능에 어떤 기술을 쓰는지 비개발자도 알 수 있게 분해하고, 그 스택을 다른 기술로 바꾸면 무엇이 달라지는지 시뮬레이션하며, 아직 안 쓴 기술로 만들 수 있는 미래 프로젝트를 제안한다.\n'
           + '데이터는 projects-data.js의 각 프로젝트 stackDetail(seed)을 단일 소스로 읽고, 모듈 내부 보강 레이어(역할·한마디·없으면·예시)를 normalize로 합쳐 화면에 띄운다 — 별도 카탈로그 중복 없음.\n'
           + '①현재 스택 정밀 분해(95스택) ②기술 대체 시뮬레이션(22시나리오) ③미래 스택 조합 엔진(미사용 핵심 기반 5조합)의 3탭 구성. 별도 프로젝트로 독립 운영.',
    method: 'HTML5 + Tailwind CSS(Play CDN) + Vanilla JS 자급식 단일 페이지(index.html + tech-hub.js + tech-hub-data.js). '
          + 'normalize(seed+enrichment)로 PROJECTS.filter(id!=="tech-stack")를 정규화 → 7필드(tech/role/what/withoutIt/example/sourceArea/sourceHow) 빈값 0. '
          + '상태머신(setTab→renderS1/S2/S3, lazy 활성탭만 DOM). 변증법 규약: Codex R2 IMPLEMENTATION GO 후 Claude 구현, node --check·6게이트(정규화·S2≥16·S3 unused≥2·언어·위치·렌더) 자동검수 PASS.',
    stack: ['HTML5', 'Tailwind CSS', 'Vanilla JS'],
    stackDetail: [
      { area: '데이터 소스 (단일 진실)', tech: 'Vanilla JS', how: 'projects-data.js의 window.PROJECTS(각 프로젝트 stackDetail)와 window.STACK_ATLAS를 읽어 단일 소스로 삼는다. 스냅샷 복사 없이 대시보드와 동일 데이터를 공유해 drift 0.' },
      { area: '정규화 레이어 (seed+보강)', tech: 'Vanilla JS', how: 'stackDetail(area/tech/how) seed에 보강 데이터(role/what/withoutIt/example)를 area 키로 합쳐 7필드로 normalize한다. 빈 문자열 0을 게이트로 검증.' },
      { area: '3탭 렌더·상태머신', tech: 'Vanilla JS', how: 'setTab→renderS1/S2/S3 상태머신으로 활성 탭만 렌더(lazy). S1 화면청사진·인스펙터, S2 대체 게이지·before/after, S3 조합 아키텍처·데이터흐름.' },
      { area: '스타일·반응형', tech: 'Tailwind CSS', how: 'Tailwind Play CDN + 커스텀 색 토큰(다크). lg 브레이크포인트로 390px 모바일에서 단일 컬럼 — 수평 오버플로 0.' },
    ],
    issues: [
      { type:'완료', title:'전면 재구축 — 「하나도 안 맞음」 폐기 후 변증법 재설계 (2026-06-05)', desc:'박사 피드백 「결과물이 처음 요구와 하나도 맞지 않는다」 → 기존 tech-stack-collection 폐기. Codex가 프롬프트(R2 계약)부터 재작성, Claude Thesis→Codex Antithesis R1 BLOCK 6→R2 GO. 핵심 정정: 분석 대상을 단일 프로젝트가 아니라 PROJECTS.filter(id!=="tech-stack") 전체로, stackDetail 3필드를 seed로 두고 보강 5필드를 normalize, S2 시나리오 프로젝트별≥2·전체≥16, S3 미사용은 STACK_ATLAS.unused 기준. previews/tech-stack-architecture-hub/에 구현, tech-stack-collection 삭제.' },
      { type:'완료', title:'6게이트 자동검수 PASS (2026-06-05)', desc:'정규화·스택 95개 빈필드 0·시나리오 22(≥16)·프로젝트별≥2·affectedComponents≥2·metrics 4수치·combos 5(≥4)·unused핵심 전부 STACK_ATLAS.unused 대조 통과·렌더 카피 한글 게이트 0·node --check PASS.' },
      { type:'완료', title:'별도 프로젝트로 복원 (2026-06-06)', desc:'박사 지시 — 기술 스택은 별도 프로젝트로 유지(TradeLogix에 끼워넣지 않음). 원래 영어 이름 Tech Stack Collection 그대로, 대시보드 9번 프로젝트로 독립 등록. (TradeLogix는 통관/선사 2축만 유지.)' }
    ],
    milestones: [
      { date:'2026-06-05', title:'기술 스택 아키텍처 & 진화 허브 — 재구축 완료', desc:'프로젝트 × 화면영역별 사용기술 정밀 분해(95스택 5필드 설명) + 22개 대체 시뮬레이션(4지표 게이지+트레이드오프) + 미사용 88후보 기반 5종 미래 조합 엔진. HTML5+Tailwind+Vanilla JS, normalize(seed+보강), 6게이트 PASS.' },
      { date:'2026-06-06', title:'별도 프로젝트 9번으로 복원', desc:'박사 지시로 TradeLogix와 분리 — Tech Stack Collection을 독립 프로젝트(9번)로 환원.' }
    ]
  },
  {
    id: 'health',
    no: 10,
    name: 'FitRx',
    subtitle: '헬스케어 · 근거기반 건강 도움 — ACSM 2026 저항성 운동 Position Stand(17년 만의 개정, 137편 체계적 문헌고찰·3만 명 종합)를 임상 가이드 톤으로 정리한 인터랙티브 운동 가이드. 목표별 근거기반 처방 + 신화 검증.',
    icon: 'vitality',
    platform: '웹 · 인터랙티브 건강 가이드 (자급식 단일 HTML · Vanilla JS · 라이트 임상 테마)',
    status: 'completed',
    start: '2026-06-06',
    latest: '2026-06-06',
    progress: 100,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/fitrx/',
    preview: { type:'embed', height:680, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/fitrx/', label:'FitRx — ACSM 2026 근거기반 저항운동 가이드. 개관 리뷰 3층 구조 도해 + 「목표별 처방」 인터랙티브(근력/근비대/파워/기능·낙상예방) + 무게-근비대 슬라이더 데모 + 2009 vs 2026 신화 검증 + 실전 6원칙. GRADE 근거수준 배지·교육목적 고지 포함.' }
    ]},
    summary: '지식 대시보드 시리즈 10번 — 「건강 도움(헬스케어)」 영역의 첫 모듈.\n'
           + '미국스포츠의학회(ACSM)가 2026년 발표한 저항성 운동 Position Stand를, 일반인이 임상 가이드라인 읽듯 이해하게 정리한 인터랙티브 단일 페이지.\n'
           + '2002·2009년에 이어 17년 만의 개정으로, 전문가 합의(편향 비판)를 버리고 개관 리뷰(umbrella review = 리뷰의 리뷰) 방식 채택 — 137편 체계적 문헌고찰·3만 명 이상 종합, AMSTAR·GRADE로 근거 수준 명시(Stuart Phillips/맥마스터대, MSSE 2026.04).\n'
           + '핵심 반전: 근비대 「8~12회 황금 범위」 폐기(무게보다 주간 총 세트), 실패 지점까지 불필요, 주기화 비필수. 목표별(근력=무게·근비대=주간세트·파워=속도) 처방을 클릭으로 안내. ※ 근거 대부분 초보자 대상 → 교육용, 상급자 미검증.',
    method: '자급식 단일 HTML5 + Vanilla JS + 인라인 SVG. 외부 의존 0(폰트 폴백). 라이트 임상 테마(teal/emerald). '
          + '인터랙션: 목표 선택(근력/근비대/파워/기능)→근거기반 처방 카드 렌더, 무게-근비대 슬라이더 데모(부하↔근력/근비대 막대), 앵커 내비. '
          + 'GRADE 근거수준(높음/중간/낮음) 배지로 결론별 신뢰도 표기. 상단·하단 교육목적·전문가 상담 고지. 모든 사용자 텍스트 한국어.',
    stack: ['HTML5', 'Vanilla JS', 'SVG', 'CSS3'],
    stackDetail: [
      { area: '목표별 처방 엔진', tech: 'Vanilla JS', how: '근력/근비대/파워/기능 4개 목표를 RX 데이터 객체로 두고, 선택 시 핵심변수·부하·볼륨·수행법·「신경 안 써도 되는 것」을 처방 카드로 렌더. 모델/외부 호출 없는 정적 상태머신.' },
      { area: '무게-근비대 데모', tech: 'Vanilla JS, CSS', how: '슬라이더(30~100% 1RM)에 따라 근력 막대는 비례 상승, 근비대 막대는 거의 일정하게 유지 — 「충분히 힘들게+주간 세트면 무게 무관」을 시각화. 부하별 반복수 캡션 동적 표시.' },
      { area: '근거 시각화', tech: 'SVG', how: '개관 리뷰 3층 구조(개별연구→체계적문헌고찰→개관리뷰) 피라미드를 인라인 SVG로. GRADE 배지(높음/중간/낮음)로 결론별 근거수준 표기.' },
      { area: '임상 디자인 시스템', tech: 'CSS3', how: '라이트 헬스케어 테마(teal #0e7490 / emerald) + 소프트 카드·그림자, 가독성 중심 타이포. 상단 sticky 앵커 내비, 모바일 단일 컬럼 반응형.' },
    ],
    issues: [
      { type:'완료', title:'#10 신설 — 헬스케어 「건강 도움」 영역 + FitRx 가이드 (2026-06-06)', desc:'박사 지시 「#10에 헬스케어 영역 언어로 예쁘게, 이 가이드를 바탕으로 건강 도움 쪽을 만들어」 — 폐지된 옛 #10(Tech Stack) 슬롯에 건강 도움 영역을 신설. ACSM 2026 저항성 운동 Position Stand를 임상 가이드 톤의 인터랙티브 단일 페이지로 구현(previews/fitrx/). 목표별 처방·무게-근비대 데모·2009vs2026 신화검증·실전 6원칙. teal 테마(구 #9 반납분) 재사용, vitality 아이콘 추가. 교육목적·전문가상담 고지 명시.' },
      { type:'완료', title:'근거 충실도 + 헤드리스 렌더 검증', desc:'본문은 박사 제공 ACSM 2026 요약을 충실히 반영(근비대 8리뷰·5천명, ROM 근거 낮음 2리뷰, 파워 reps×sets≤24, 빈도 주2회 등). GRADE 배지로 근거수준 구분. Edge 헤드리스로 4개 목표 처방 렌더·슬라이더·앵커 내비·콘솔에러 0 검증.' }
    ],
    milestones: [
      { date:'2026-06-06', title:'프로젝트 #10 신설 — FitRx (헬스케어 · 건강 도움)', desc:'대시보드 시리즈 10번으로 「건강 도움」 영역 신설. 첫 모듈 = ACSM 2026 저항성 운동 가이드(근거기반 목표별 처방 인터랙티브). teal 테마·vitality 아이콘 등록, 라이브 프리뷰 임베드.' }
    ]
  },
  {
    id: 'aivideo',
    no: 11,
    name: 'Cutpilot',
    subtitle: 'AI 영상 제작 — 아이디어 한 줄이면 스토리보드→컷별 후보 생성→비교 선택→자막/사운드/보이스→완성 MP4. Runway·Luma·Veo를 엔진으로 깔되 모델명 없이 「빠른 미리보기 / 게시용 품질」 티어로. 변증법 협업(Claude UX·프론트 ↔ Codex 아키텍처·백엔드). 정식명 미정(가칭 Cutpilot).',
    icon: 'film',
    platform: '웹 애플리케이션 (Next.js · TypeScript · 정적 mock vertical slice → 실 provider 연결 예정)',
    status: 'in-progress',
    start: '2026-06-06',
    latest: '2026-06-07',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/ai-video-studio/mock-app/',
    preview: { type:'embed', height:640, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/ai-video-studio/mock-app/', label:'기능 데모(mock vertical slice) — 새 영상→스토리보드→전체 생성→컷별 후보 비교/선택→실패 컷 재시도→게시용 품질로 다듬기→내보내기(6/15/30s 렌더). 정적 페이지에서 Project/Shot/Take/Job 상태머신이 도는 mock backend(실 provider 미연결).' },
      { url:'https://gmpark-creator.github.io/project-dashboard/ai-video-studio/prototype/', label:'설계 클릭형 목업 — 6화면(대시보드·새영상·스토리보드·비교선택·다듬기·내보내기) 프론트엔드 방향 시각화.' }
    ]},
    summary: '지식 대시보드 시리즈 11번 — Runway·Luma·Veo 등 영상 생성 엔진을 *직접 고르는 앱이 아니라*, 요구(의도·티어·샷 조건)를 받아 가능한 엔진을 자동 선택하는 오케스트레이션 레이어를 올려 비전문가가 "아이디어→완성 영상"을 끝까지 만들게 하는 앱.\n'
           + '사용자는 모델명을 모른 채 「빠른 미리보기 / 게시용 품질 / 저비용」 티어와 목적만 고르고, 컷별 후보를 비교·선택하며, 실패/불만 컷만 다시 시도(이전 후보 보존)한다.\n'
           + '클로드(UX/제품·프론트엔드 방향) ↔ 코덱스(아키텍처·백엔드·모델 어댑터·렌더/큐·검증) 변증법으로 진행: R1 설계·프로토타입 → Codex R1 계약(OpenAPI·schema·routing) → R2 UX보정 → Codex R2 mock vertical slice → R3 QA(23건) → Codex Next.js 앱화 + R3 UX 통합. 설계·계약 산출물은 ai-video-studio/.',
    method: '프론트는 엔진을 모른 채 (의도+티어+샷 요구플래그)만 보내고, 백엔드 라우팅 테이블(데이터)이 입력타입·길이·비율·지역·가용성 필터로 엔진을 결정. engineUsed는 디버그 전용·UI 비노출. 컷 단위 독립 잡(부분 실패 격리), 이전 Take 보존, 자막/BGM/보이스는 라이선스 확인 소스만. Next.js+TS 앱화 + mock provider→실 provider 단계 적용.',
    stack: ['Next.js', 'TypeScript', 'HTML5', 'Vanilla JS', 'Remotion', 'FFmpeg'],
    stackDetail: [
      { area: '사용자 경험·화면 흐름 (Claude)', tech: 'UX 설계', how: '아이디어→목적→스토리보드 자동분해→컷별 후보 비교/선택→대화형 다듬기→내보내기 7단계. 모델명 숨김·드래프트 후 「게시용 품질로 다듬기」·실패 컷만 재생성·버튼 위 ⚡비용. 6화면 클릭형 프로토타입.' },
      { area: '엔진 라우팅 (요구사항)', tech: 'routing config(데이터)', how: '(intent+tier+requirements)→provider 후보. 입력타입/길이/비율/지역/장애 필터, 폴백, 비교용 Take 분산은 예산 정책에 묶음. 엔진 스펙 변동은 config 교체.' },
      { area: 'mock vertical slice (Codex)', tech: 'Vanilla JS, localStorage', how: '실 provider 없이 전체 경로 통과 — Project/Shot/Take/Job 상태머신, 2/10컷 실패 주입으로 부분 격리 검증, 렌더 잡 6/15/30s.' },
      { area: '앱화·렌더 (Codex)', tech: 'Next.js, TypeScript, Remotion, FFmpeg', how: 'Next.js 앱(studio-app) + API route + TypeScript mock provider + R3 UX 통합 완료. 다음 단계는 provider adapter와 렌더(영상 자막 삽입·오디오 믹스·다중 길이컷) PoC.' },
    ],
    issues: [
      { type:'핵심', title:'Codex — Next.js 앱화 + R3 UX 통합 완료', desc:'studio-app(Next.js+TS)에 API route, TypeScript mock provider, 상태머신, 비용/렌더/재시도 UX를 통합. Claude R3 QA 중 P0/P1 핵심 항목을 반영하고 검증 완료. 다음은 렌더 PoC와 첫 provider adapter 연결.' },
      { type:'완료', title:'R1 — UX/제품 설계 + 클릭형 프로토타입 (Claude)', desc:'핵심 플로우·6화면 구성안·UX 규칙·프롬프트/스토리보드 템플릿 6종·품질 평가 기준·프론트↔백 계약(요구사항). 모델명 비노출·티어 추상화·완성본 우선·대화형 편집·실패컷만 재생성. ai-video-studio/design/ + prototype/.' },
      { type:'완료', title:'Codex R1 — 아키텍처 반박·계약 (OpenAPI·Schema·routing config)', desc:'벤더 기능 직접 약속 금지, capability snapshot+routing config로 "가능한 때만 실행". 열린질문 10개 1차 결정.' },
      { type:'완료', title:'R2 — Codex 피드백 반영 UX 보정 (Claude)', desc:'Veo 4K=내보내기/업스케일 옵션(보장X), Gen-4 Turbo=I2V 후보(text-fast 기본 아님), 부분재생성 capability-gated, 「게시용 품질로 다듬기」 카피, 품질검사 MVP=경고, 실패폴백 7상황·라이선스 helper.' },
      { type:'완료', title:'Codex R2 — mock backend vertical slice 구현·배포', desc:'정적 페이지 상태머신으로 전체 경로 통과. 라이브 mock-app.' },
      { type:'완료', title:'R3 — 라이브 mock-app QA (Claude)', desc:'헤드리스 실측+독립 3-렌즈 교차검증. 23건(P0×2·P1×13·P2×8) + 15컴포넌트 UX요구·11상태 문구·QA 체크리스트. 통과: 모델명누출0·부분실패격리·이전Take보존·모바일오버플로0(다듬기 제외).' }
    ],
    milestones: [
      { date:'2026-06-06', title:'프로젝트 착수 — 변증법 R1~R3', desc:'Claude R1 설계·프로토타입 → Codex R1 계약 → R2 UX보정 → Codex R2 mock slice → R3 QA. 모델명 비노출·티어 추상화·오케스트레이션 방향 확립.' },
      { date:'2026-06-07', title:'대시보드 #11 등록 + Next.js 앱화/R3 통합', desc:'박사 지시로 AI 영상 제작 앱(가칭 Cutpilot)을 프로젝트 11번으로 대시보드 등록(라이브 mock-app·프로토타입 프리뷰). Codex가 Next.js 앱(studio-app)에 Claude R3 QA 핵심 항목을 반영. rose 테마·film 아이콘 등록.' }
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
      { name: 'Rust', recommendation: '고성능 네이티브/WASM 계산. 3번 Solar의 케플러·N체 섭동 계산이나 8번 반도체의 대규모 노드 레이아웃·force-directed 연산을 Rust→wasm-bindgen으로 빼면 메인스레드 프레임드랍을 없앤다. 4번 INST의 오디오 DSP 전처리도 후보.', fitProjects: ['Solar System Simulator', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Go', recommendation: '동시성·실시간 데이터 수집 백엔드. 1번 AIS 실시간 위치 폴링/스트리밍 게이트웨이, 7번 Premarket의 FRED·ECOS·시세 멀티소스 수집기를 단일 바이너리로 상주. 현재 7번은 빌드타임 스크립트뿐이라 상시 수집 데몬으로 격상하기 좋다.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'SQL', recommendation: '구조화 데이터 영속화·집계. 1번 AIS 항적 이력, 7번 Premarket 시계열 시세, 2번 DDUIM 트래킹 프레임을 테이블로 적재하고 시간 윈도우 집계. 현재 전 프로젝트가 mock/static이라 DB 도입 시 1순위.', fitProjects: ['US-KR Premarket Signal', 'AIS Ship Tracker', 'DDUIM'] },
      { name: 'WGSL (WebGPU Shading Language)', recommendation: '차세대 GPU 셰이더. 3번 Solar의 GLSL 셰이더 자산을 WebGPU/WGSL로 포팅하면 compute shader로 입자(카이퍼·트로이 2400×2) 시뮬을 GPU에서 직접. 8번 대량 노드 인스턴싱에도 유리.', fitProjects: ['Solar System Simulator', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Pandas / NumPy (데이터 분석)', recommendation: '데이터 분석 스택. 7번 Premarket의 매크로·테마 상관 분석, 2번 DDUIM 트래킹 통계(스프린트·점유율)를 Pandas/NumPy로. 4번 INST가 이미 Python 3.12라 분석 노트북 라인을 같은 생태계로 통일 가능. (GLSL·Python 자체는 이미 사용 중)', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] },
      { name: 'Swift / Kotlin', recommendation: '네이티브 모바일 앱. 1번 AIS를 현장 운영자용 iOS/Android 네이티브(백그라운드 위치·푸시)로, 3번 Solar를 ARKit/ARCore 천체 AR로. 웹 우선이면 React Native/Flutter가 더 현실적이라 보조 옵션.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'C++', recommendation: '초고성능 물리/렌더/DSP 코어. 단 3번 Solar는 importmap 단일 HTML 교육용이고 케플러를 이미 JS로 오차 0.22% 달성(WASM 불필요). 쓴다면 4번 INST의 DSP 병목(리샘플·STFT) 한정 PoC로 좁히되, PyTorch가 이미 C++ 커널을 쓰므로 torch.compile/ONNX 최적화가 먼저. (우선순위 최하)', fitProjects: ['INST Extractor'] },
      { name: 'C# / .NET', recommendation: '본격 게임/시뮬 확장 시 .NET·Unity 옵션이나 디렉터의 웹 릴레이 워크플로와 충돌해 적합도 낮음. 5번 PRESIDENT는 이미 Vite+React+Zustand 결정론 월루프(테스트 35/35)로 잘 도므로, C#보다 "엔진 로직을 순수 TS 모듈로 두고 Web Worker로 분리해 메인스레드 프레임 보호"가 같은 목표를 웹 안에서 달성하는 현실적 대안. (우선순위 최하)', fitProjects: ['2026 PRESIDENT KOREA'] }
    ]},
    { key: 'frontend', label: '프론트엔드 프레임워크·UI', items: [
      { name: 'Svelte / SvelteKit', recommendation: '가벼운 정적·콘텐츠 사이트. 6번 JP Global(현재 Vanilla JS)을 SvelteKit으로 재구축하면 번들이 작고 트랜지션 내장이라 디자인 톤 실험에 적합. 보일러플레이트가 적어 1인 워크플로에 효율적.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] },
      { name: 'Astro', recommendation: '콘텐츠 중심 정적 + Islands. 6번 JP Global과 이 대시보드 자체(보고서/포트폴리오)를 Astro로 만들면 기본 0-JS로 빠르고 필요한 위젯만 React island로. 8개 프로젝트 쇼케이스 허브에 이상적.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] },
      { name: 'shadcn/ui + Radix UI', recommendation: '접근성 갖춘 헤드리스 컴포넌트. 5·7·8번의 패널·다이얼로그·드로어·툴팁을 Radix 기반 shadcn으로 표준화하면 직접 만든 인터랙션 UI의 접근성·키보드 내비를 한 번에 확보. Tailwind를 이미 써 궁합 최상.', fitProjects: ['2026 PRESIDENT KOREA', 'Knowledgeverse (반도체 유니버스)', 'US-KR Premarket Signal'] },
      { name: 'Vue 3 / Nuxt', recommendation: '대안 SPA/SSR. 신규 대시보드형 프로젝트에서 React 비교 실험용. 7번 Premarket을 Nuxt SSR로 만들면 SEO·초기 로딩 개선. (React 자산이 많아 신규 라인 한정)', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'Next.js App Router (RSC/SSR 본격)', recommendation: '1번 AIS는 이미 Next.js지만 단순 CSR 수준. App Router의 Server Components·Route Handler·streaming으로 선박 데이터 서버 패칭·SEO·엣지 캐싱까지 한 프레임워크로. 7번을 Next로 옮기면 수집 스크립트를 Route Handler로 흡수.', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] }
    ]},
    { key: 'graphics3d', label: '3D·그래픽·WebGL/WebGPU', items: [
      { name: 'WebGPU (WebGPURenderer)', recommendation: 'Three.js 차세대 렌더 백엔드. 3번 Solar의 입자계(카이퍼·오르트·트로이)와 8번 반도체의 대량 노드/엣지를 compute shader로 가속. Three.js를 이미 써 WebGPURenderer 전환만으로 미래 대비.', fitProjects: ['Solar System Simulator', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Three.js 후처리 (postprocessing / EffectComposer)', recommendation: '후처리 파이프라인. 3·5·8번 3D 씬에 SMAA/FXAA 안티앨리어싱 + 톤매핑 + 절제된 약한 Bloom(임계값 가드)을 적용. 단 8번에서 Bloom 과다로 제거한 이력이 있으니 과다 글로우 금지 — 3번 Solar 태양/블랙홀 글로우를 통제된 후처리로 대체하는 수준.', fitProjects: ['Solar System Simulator', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Babylon.js', recommendation: '기능 풍부한 대안 3D 엔진. 5번 PRESIDENT의 3D 시네마틱이나 신규 인터랙티브 시뮬을 Babylon으로 시도하면 내장 GUI·물리·노드 머티리얼 에디터 활용. (Three.js 자산이 많아 신규 실험 한정)', fitProjects: ['2026 PRESIDENT KOREA'] },
      { name: 'PixiJS', recommendation: '고성능 2D WebGL 렌더러. 2번 DDUIM의 2D 매치 트래커(현재 Canvas 2D)를 PixiJS로 옮기면 선수22+공+잔상 다수를 WebGL 가속으로 25Hz 부드럽게·줌·히트맵. 1번 AIS 다중 마커에도.', fitProjects: ['DDUIM', 'AIS Ship Tracker'] },
      { name: 'Cesium / CesiumJS', recommendation: '사실적 3D 지구본 GIS. 1번 AIS를 진짜 3D 글로브(지형·해양·시간축)로, 8번 반도체 글로벌 공급망 지구를 실측 지구본으로. 위경도를 이미 다뤄 데이터 호환성 높음.', fitProjects: ['AIS Ship Tracker', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'deck.gl', recommendation: '대규모 지오데이터 GPU 시각화. 1번 AIS 수백~수천 척을 ScatterplotLayer/TripsLayer로, 8번 공급망 흐름을 ArcLayer로 그리면 수동 구현보다 성능·인터랙션 우수. MapLibre/Mapbox 위에 얹는 구조.', fitProjects: ['AIS Ship Tracker', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Blender', recommendation: '3D 에셋 제작 파이프라인. 3번 Solar의 탐사선 모델을 코드 프리미티브 대신 Blender→glTF로 만들면 디테일 비약. 5번 PRESIDENT 3D 카툰 시네마틱의 캐릭터·소품 제작에도 직결.', fitProjects: ['Solar System Simulator', '2026 PRESIDENT KOREA'] },
      { name: 'Spline', recommendation: '노코드 3D 디자인 툴. 6번 JP Global 히어로 3D 오브제나 이 대시보드 랜딩의 인터랙티브 3D 데코를 코드 없이 빠르게 임베드. 디자인 톤 실험 성격과 맞음.', fitProjects: ['Frontend & Tone Atelier (JP Global)'] }
    ]},
    { key: 'dataviz', label: '데이터 시각화·차트', items: [
      { name: 'D3.js (full: scale·shape·force)', recommendation: '현재 d3-geo만 사용. 7번 Premarket 시세 라인·캔들·히트맵을 d3-scale/shape로, 8번 지식 그래프 평면 뷰를 d3-force로 그리면 풀 D3 역량 확보. 2번 DDUIM 궤적·점유율 차트에도.', fitProjects: ['US-KR Premarket Signal', 'Knowledgeverse (반도체 유니버스)', 'DDUIM'] },
      { name: 'ECharts', recommendation: '고밀도 인터랙티브 차트. 7번 Premarket의 매크로/테마 히트맵·캔들·줌·브러시를 즉시 풍부하게. 2번 DDUIM 선수별 통계 대시보드에도. mock UI를 실제 분석 대시보드로 끌어올리는 핵심.', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] },
      { name: 'Recharts', recommendation: 'React 친화 선언형 차트. 7번 Premarket(React 18) 패널에 가장 빠르게 차트를 꽂는 옵션 — OvernightMacro·Theme Heatmap을 실데이터화. shadcn 차트 프리셋과 호환.', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'visx (airbnb)', recommendation: 'D3 + React 저수준 빌딩블록. 7번·8번에서 완전 커스텀 차트/그래프가 필요할 때 D3 수학과 React 렌더를 깔끔히 결합. Recharts로 부족한 맞춤 시각화에 단계적 도입.', fitProjects: ['US-KR Premarket Signal', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Observable Plot', recommendation: '탐색적 분석용 간결 그래머. 7번 데이터 파이프라인 단계의 빠른 EDA·리포트 차트에 적합. 2번 DDUIM 트래킹 데이터 탐색에도 한 줄 차트로 유용.', fitProjects: ['US-KR Premarket Signal', 'DDUIM'] }
    ]},
    { key: 'maps', label: '지도·지리 GIS', items: [
      { name: 'MapLibre GL / Mapbox GL JS', recommendation: '벡터 타일 기반 GPU 지도. 1번 AIS의 Leaflet(래스터)을 MapLibre GL로 교체하면 부드러운 줌·회전·기울기·다크 베이스맵·실시간 선박 레이어. 오픈소스 MapLibre면 토큰 비용 0 — AIS 화면 격상 1순위.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'Turf.js', recommendation: '지오공간 연산. 1번 AIS에서 선박 간 거리·근접 경보(geofence)·항로 버퍼·교차 판정을 클라이언트에서. 위경도를 이미 다뤄 실시간 충돌/접근 알림 추가에 즉효.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'deck.gl + 지도 베이스', recommendation: '지도 위 대규모 데이터 레이어. 1번 AIS 선단 전체 항적(TripsLayer 애니메이션)과 밀집 마커를 MapLibre 베이스 위에 GPU로.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'OpenLayers', recommendation: '기능 방대한 오픈소스 지도 엔진. 1번 AIS에서 해상 차트(WMS/WMTS)·좌표계 변환·복잡 벡터 편집이 필요할 때 Leaflet 대안. 해도 오버레이가 중요하면 강점.', fitProjects: ['AIS Ship Tracker'] },
      { name: 'Cesium 3D Tiles (글로브)', recommendation: '3D 지구본 GIS. 1번 AIS를 시간축 3D 글로브 항적 재생으로, 8번 공급망을 3D 지구 호(arc) 흐름으로, 5번 한반도 지도를 실측 지형 3D로.', fitProjects: ['AIS Ship Tracker', 'Knowledgeverse (반도체 유니버스)'] }
    ]},
    { key: 'state', label: '상태관리·데이터 패칭', items: [
      { name: 'TanStack Query (React Query)', recommendation: '서버 상태 캐싱·동기화. 1번 AIS 실시간 폴링, 7번 Premarket 시세/매크로 패칭에 도입하면 캐시·재시도·폴링·stale이 자동화. mock→실API 전환 시 1순위. (Zustand=클라이언트 상태, Query=서버 상태로 역할 분리)', fitProjects: ['AIS Ship Tracker', 'US-KR Premarket Signal'] },
      { name: 'Redux Toolkit', recommendation: '복잡한 결정론 상태·타임트래블. 5번 PRESIDENT 선거 시뮬 턴처럼 액션 로그·되돌리기·리플레이가 중요한 게임 엔진에 적합. 디버깅·추적성이 Zustand보다 강함.', fitProjects: ['2026 PRESIDENT KOREA'] },
      { name: 'XState', recommendation: '상태 머신·시나리오 제어. 5번 게임 페이즈(유세→투표→개표→취임)와 3번 Solar의 시네마틱/투어 시퀀스를 명시적 FSM으로 모델링하면 엣지케이스가 줄고 흐름이 견고.', fitProjects: ['2026 PRESIDENT KOREA', 'Solar System Simulator'] },
      { name: 'Jotai', recommendation: '원자 단위 상태관리. 5번이 Zustand 단일 스토어인데 지역·정책 파생 상태가 많아지면 Jotai 아톰으로 세분화해 리렌더 범위를 좁힘. 8번 선택/하이라이트 상태에도 가벼움.', fitProjects: ['2026 PRESIDENT KOREA', 'Knowledgeverse (반도체 유니버스)'] },
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
      { name: 'LangChain / Vercel AI SDK', recommendation: 'LLM 오케스트레이션. 8번 반도체에 "자연어로 노드/관계 질문→그래프 하이라이트"하는 RAG 비서를, 7번 Premarket에 매크로 자연어 브리핑을. 디렉터의 지식 시각화 컨셉과 LLM이 직결.', fitProjects: ['Knowledgeverse (반도체 유니버스)', 'US-KR Premarket Signal'] },
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
      { name: 'pnpm + 모노레포 workspace', recommendation: '디스크 효율·엄격한 의존성 + 워크스페이스. Vite/React 프로젝트가 다수(5·7·8)이고 공유 UI·타입이 생기면 pnpm workspace로 모노레포화해 중복 설치 제거·일괄 빌드. 멀티프로젝트 구조에 최적.', fitProjects: ['Knowledgeverse (반도체 유니버스)', 'US-KR Premarket Signal', '2026 PRESIDENT KOREA'] },
      { name: 'Vite (바닐라 프로젝트로 확대)', recommendation: '3번 Solar(importmap+CDN, 빌드 없음)·6번 JP Global(Vanilla, 빌드 없음)에 Vite를 도입해 CDN importmap 의존(런타임 외부호출)을 self-host 번들로 전환. 8번에서 @fontsource self-host로 런타임 외부호출 0을 만든 선례와 동일 방향.', fitProjects: ['Solar System Simulator', 'Frontend & Tone Atelier (JP Global)'] },
      { name: 'Bun', recommendation: '올인원 초고속 런타임·패키지매니저·번들러. 7번 Premarket의 Node ESM 데이터 스크립트를 Bun으로 돌리면 실행·설치가 크게 빨라지고 신규 백엔드(Hono 등) 런타임으로도. 1인 반복 속도 향상.', fitProjects: ['US-KR Premarket Signal'] },
      { name: 'Turborepo', recommendation: '모노레포 빌드 캐시·태스크 오케스트레이션. pnpm workspace와 함께 8개 프로젝트를 한 레포에서 증분 빌드·원격 캐시. 이 대시보드가 사실상 멀티프로젝트 허브이므로 빌드 파이프라인 통합에 직결.', fitProjects: ['Knowledgeverse (반도체 유니버스)', 'US-KR Premarket Signal'] },
      { name: 'Deno', recommendation: '보안·TS 네이티브 런타임. 7번 외부 API 수집 스크립트를 권한 명시적 Deno로 실행하면 안전성이 높고 의존성 관리가 간결. Deno Deploy 엣지 배포와도 연결.', fitProjects: ['US-KR Premarket Signal'] }
    ]},
    { key: 'testing', label: '테스트·품질', items: [
      { name: 'Vitest', recommendation: 'Vite 네이티브 단위 테스트. 5번 PRESIDENT의 Zustand 게임 엔진(민심·예산·위기 로직)과 3번 Solar 케플러 계산처럼 결정론 순수 함수에 단위 테스트를 붙이면 회귀 방지. Vite를 이미 써 설정이 거의 없음.', fitProjects: ['2026 PRESIDENT KOREA', 'Solar System Simulator'] },
      { name: 'Testing Library (React)', recommendation: '컴포넌트 동작 테스트. 7번·8번의 React 패널/인터랙션을 사용자 관점으로 테스트. Vitest와 결합해 UI 회귀를 잡는 표준 조합.', fitProjects: ['US-KR Premarket Signal', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'Storybook', recommendation: '컴포넌트 카탈로그·시각 문서. 6번 JP Global의 디자인 톤 실험과 8·7번 UI 컴포넌트를 격리 환경에서 variant·톤별로 비교. 디렉터의 "톤 실험" 성격과 정확히 맞고 시각 회귀 테스트로도 확장.', fitProjects: ['Frontend & Tone Atelier (JP Global)', 'Knowledgeverse (반도체 유니버스)'] },
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
      { name: 'Iconify (15만+ 통합 아이콘)', recommendation: '여러 아이콘 세트를 단일 API로 온디맨드 로드. 8개 프로젝트가 제각각 아이콘 라이브러리를 쓰는 것을 Iconify로 통일해 번들·관리 부담을 줄임.', fitProjects: ['US-KR Premarket Signal', 'Knowledgeverse (반도체 유니버스)'] },
      { name: 'glTF 압축 (DRACO / KTX2)', recommendation: '3D 에셋 최적화 파이프라인. 8·3·5번에서 Blender로 만든 glTF 모델을 DRACO(지오메트리)·KTX2(텍스처)로 압축해 로딩 가속. 3D 프로젝트 다수라 자산 최적화 표준으로.', fitProjects: ['Knowledgeverse (반도체 유니버스)', 'Solar System Simulator'] },
      { name: 'Variable Fonts (Noto Sans KR 등)', recommendation: '가변 폰트 타이포 자산. 6번 JP Global의 한·일·영 다국어 톤 실험과 5번 UI에 굵기/폭을 동적 제어. Pretendard 외 가변폰트·서브셋팅으로 로딩과 표현력을 동시에.', fitProjects: ['Frontend & Tone Atelier (JP Global)', '2026 PRESIDENT KOREA'] }
    ]}
  ]
};

window.PROJECTS = PROJECTS;
window.STATUS = STATUS;
window.ITYPE = ITYPE;
window.STACK_ATLAS = STACK_ATLAS;
