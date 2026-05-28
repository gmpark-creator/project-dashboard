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
    link: 'https://gmpark-creator.github.io/project-dashboard/solar-project-claude/?v=moon2',
    preview: { type:'embed', height:520, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/solar-project-claude/?v=moon2', label:'태양계 시뮬레이터' }
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
    latest: '2026-05-27',
    progress: 1,
    link: 'https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?variant=nano&lang=ko&v=kgs2',
    preview: { type:'embed', height:640, items:[
      { url:'https://gmpark-creator.github.io/project-dashboard/claude/previews/korea-gov-sim/?variant=nano&lang=ko&v=kgs2', label:'2026 PRESIDENT KOREA — Three.js 2.5D 미니어처 한국 (Nano Banana variant, 한국어 라벨)' }
    ]},
    summary: '대한민국 대통령으로 5년 단임을 사는 정치 시뮬레이션 게임의 5번째 프로젝트. '
           + '메뉴가 아니라 살아있는 지도가 통치판 — 어두운 세계 위에 따뜻한 한지색 한국이 떠오르고, '
           + '플레이어는 지도 위에 정책을 찍고 민심·예산·위기·외교를 굴린다. '
           + '월 단위 결정론 엔진(60개월)을 LLM이 자연어 이벤트로 감싸는 구조로 설계되어 있으며, '
           + 'KGS-MAP-15까지 진행 — 다국어 라벨(6 locale) · 북한·MDL · 44 entity dataset · '
           + '정부·공공기관 건물 oid 게임 오브젝트화 완료. 현재 박사 Nano Banana 전면 미학 전환 설계 결정 대기.',
    method: '설계 v0.1(20+ 섹션) + 구현 계획 v0.1(M1~M11) 박사 승인 후 M0 vertical slice 완성. '
          + 'Vite + React + Zustand로 단일 Ground Truth 스토어 구축, '
          + 'd3-geo Mercator projection으로 Natural Earth 1:110m(세계) + southkorea-maps(한국 17 광역시도) 실 GeoJSON 렌더링. '
          + '디자인 언어 「슬레이트 위의 한지」 — 한지·먹·단청 13색 자체 팔레트 + 인장형 POI 아이콘 + 명조 디스플레이/sans 본문/mono 수치 3계층 타이포. '
          + 'Paradox · Geopolitical Simulator · Google Earth 등 기존 게임/지도 서비스 모방 0건 검증.',
    stack: ['Vite', 'React 18', 'TypeScript 5', 'Zustand', 'd3-geo', 'SVG', 'Natural Earth', 'southkorea-maps'],
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
      { type:'핵심', title:'KGS-MAP-3: 카툰 3D 미니어처 지도판 (2026-05-26)', desc:'박사+Codex 명세 전면 반영. 7개 신규/수정 파일. (1) koreaLayer 입체화 — ShapeGeometry → ExtrudeGeometry depth 0.8 (제주 0.4) + bevel + top/side dual MeshLambertMaterial + 두꺼운 해안선 + 얇은 내부 경계. (2) terrainLayer 신규 — 태백/소백/차령/노령 4 산맥 ConeGeometry InstancedMesh ~60 + 내륙 14 hill SphereGeometry InstancedMesh (실제 위경도 spine 기반). (3) routeLayer 신규 — 4 도로 회랑(서울-부산/서울-인천/서울-춘천/대전-광주) + 한강 cyan curve + 8 도시 130 buildings InstancedMesh deterministic 시드. (4) landmarkLayer 신규 — 9 POI 각각 procedural 3D silhouette: 대통령실(dome+wing+gold marker) / 국회(반구) / 세종(blocks chain) / 부산항(pier+컨테이너+크레인 3개) / 인천공항(활주로 2개+터미널+관제탑) / 삼성수원(campus+chip blocks) / 현대울산(sheds 4) / KEPCO(송전탑 3) / 대덕(blocks+dome+antenna). (5) mapLod 신규 — zoom 3 silhouette / 4 terrain+route / 5 buildings / 6 landmarks. (6) cartoonMaterials 신규 — Lambert + ambient 0.65 + directional key 0.95 + fill 0.35. (7) ThreeMapStage 통합 + URL ?zoom/cx/cy override 검증용. 빌드 PASS 2.09s 220 modules JS gzip 219KB. Headless 5 screenshot 캡처 — zoom 4 미니어처 효과 분명. internal/notes/screenshots-map3/. 알려진 마이너: ortho 카메라 정사 시점이라 zoom 11 initial에서 plate 입체감 약함 (다음 슬라이스 카메라 살짝 기울이기 권장) / zoom 6 카메라 clamp 필요.' }
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
      { isCore:true, date:'2026-05-27', title:'KGS-MAP-15 — Codex 건물 inspector 연결 (게임 오브젝트화)', desc:'Codex 직접 patch (commit 8bf55fa). 진단: #14에서 building이 scene에 보였지만 region/POI picker와 inspector contract에 미연결 → 장식처럼 보였음. entity-sites.ts 신설(44건을 complexId 또는 개별 site로 정규화 + label/priority/kind/기관목록 공유). entityBuildingLayer body/roof/window/trim/courtyard/shadow 디테일 보강 + hover/selected focus ring + 실제 mesh hit 우선(invisible hit padding fallback). picking.ts entitySite type 추가, building layer를 region/POI 앞단에 연결. ThreeMapStage hover cursor/tooltip/click selection/ESC clear/store subscription을 entity site까지 확장. HoverTooltip entity site tooltip(hub/기관수/priority/배치방식). RegionInspectorPanel entity site 전용 inspector(배치 계약/geocode 대기수/소속 기관/gameplay role/sector). schemas/map-state selection type에 entitySite 추가.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-2 — 최종 통합 지도 (외부 음영 + 북한·MDL + entity 데이터)', desc:'박사 발화 "최근에 만든 녹색 바탕 지도 느낌에다가 전세계 지도 어두운 색으로 대비 음영, 북한·군사분계선, 공공기관 데이터 넣어서 최종 완성". NANO manifest worldLand 0xC8D89E→0x4A5C40 짙은 sage (한반도 라임과 강한 명도 대비). worldLayer clay early return 제거, 외부 land 정상 렌더(outline만 hide 유지). 박사 4요구 매트릭스: ✅ 녹색 라임 한반도 hero ✅ 전세계 외부 land 짙은 sage 음영 ✅ 북한 distinct + MDL 군사분계선 ✅ 44 entity record + 25 자치구 + 청와대 GROUND-LEVEL 버튼. screenshot: final-2-far-with-world (시야 멀리 한반도 + 외부 음영 + cloud), final-3-seoul-deep (Seoul 라임 + MDL + 중국 음영), final-5-seoul-buildings (25 자치구 + GROUND-LEVEL). 롤백 = ?variant=situation 또는 git checkout pre-nano-banana.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-1b — Nano Banana reference 정합 강화 (4영역)', desc:'박사 발화: "이미지 파일 예시용처럼 만들라니까? 그게 어려워?" v1 약점 즉시 보강. commit afe571b. ① worldLayer clay 모드 early return → 외부 land 완전 hide (한반도 isolated). ② cloud scale 42~60→95~130 (2배 prominent) + LOD fade 임계 0.30/0.50→0.55/0.75 (더 오래 visible). ③ koreaLayer clay 모드 drop shadow plane 2단(메인+컨택, opacity 0.22/0.30). ④ halo line opacity 0 (부드러운 클레이는 outline 없음). 시도하고 롤백: koreaLayer.group.rotation.x=-0.22 (한반도 화면 밖 사라짐). 남은 약점: 카메라 정수직 두께 표현 / HUD 라이트 모드 / silhouette simplification.' },
      { isCore:true, date:'2026-05-27', title:'KGS-ENGINE-2 — Codex 게임 엔진 realtime clock hardening', desc:'Codex 직접 patch (commit 19f1a41). src/game/tests/clock.test.ts 신규(105줄, 9 tests) — paused initial state, pause/resume, valid/invalid timeScale, paused tick blocking, forced tick, day advancement, daily/weekly/monthly/quarterly hooks, term finish, full 5-year accelerated simulation 검증. ScheduledUpdateSystem.ts weekly trigger deterministic 7-day interval 보정 (calendar rollover 아닌 누적 days). shared/validation.ts GameClockState 검증 범위 확장 — elapsedDays/remainingDays/termProgress + 5 last update dates. scripts/run-game-tests.mjs 신규 — esbuild + Node test runner. package.json npm run test:game 추가. 검증: 9/9 PASS + 5-year accelerated 완주 term_finished.' },
      { isCore:true, date:'2026-05-27', title:'KGS-NANO-1 — Gemini Nano Banana variant 신설 (롤백 안전망)', desc:'박사 발화 "지금 지도 모습으로 롤백할 수 있게 준비해놓고, 설계대로 만들어서 보여줘". commit cd63af6 + tag pre-nano-banana(e1d891a) 롤백 baseline push. 신규 NANO manifest(5번째 variant): 라임 #A5C946 land / 청록 #9CD8E8 bg / 옅은 라임 외부 land / koreaEdgeWidth 0 / koreaTextureMode "clay". koreaLayer textureMode 분기 — clay 모드는 depth 0.55 + bevel 0.18 두꺼운 클레이, outline LineSegments / innerEdge 제거. worldLayer 외곽선 hide. cartoonMaterials setupCartoonLighting clay 분기 — ambient 0xE8F4F8 0.85, keyLight 0xFFF5DC 0.55 (soft sun), HemisphereLight 0xE8F4F8↔0xA5C946 추가. cloudLayer 신규(296줄) — 6개 미소 cloud sprite(canvas texture: 흰body+얼굴+pink cheek+smile), descentT < 0.30 visible / 0.30~0.50 fade / >0.50 invisible, gentle drift. 백엔드 영향 없음 — KGS-ENGINE / entity dataset 44건 / labelLayer / picker 모두 그대로 작동. 롤백 = ?variant=situation 또는 git reset --hard pre-nano-banana.' },
      { isCore:true, date:'2026-05-27', title:'KGS-ENGINE-1 — Codex 게임 엔진 backend foundation', desc:'Codex 직접 patch (commit 4b81f0e). src/game/ 독립 엔진 계층 신설(1646 lines, 13 파일). core/GameState.ts: 2026 PRESIDENT KOREA Ground Truth 계약(대통령·clock·approval·economy·budget·media·liveFeed·cabinet·ministries·국회·judiciary·local governments·policies·events·crises·diplomacy·security·social metrics·election·notifications·schedule). core/GameInitializer.ts: createInitialGameState/cloneGameState/getGamePhase/isGameOver/migrateGameStateIfNeeded. core/GameClock.ts: pauseGame/resumeGame/setTimeScale/advanceClockByDays + term progress selectors. shared/* engine constants·types·utils·validation. selectors/* dashboard·map view-model. api/gameApi.ts in-memory facade(frontend 직접 engine state 조작 금지). 박사 standing: Phase 1은 UI 비침습 엔진 골격 — 정책 30개, 이벤트 40개, region/ministry dataset, full simulation loop는 후속 Phase.' },
      { type:'핵심', title:'Nano Banana Korea — 전면 미학 전환 설계 + mockup 2종 (2026-05-27)', desc:'박사 발화: "지금 구현된 한반도 지도가 아닌, 이 느낌의 이미지대로 한반도 지도를 싸그리 뜯어 고쳐서 구현. 구현에는 박사 오더 전까지 실행하지마. 설계 진행한 다음에 결과물부터 보여줘." 박사 reference: Gemini Nano Banana 10 시야 한반도 (라임 #A5C946 + 청록 #5CB0CC + 미소 cloud + 클레이 토이). internal/notes/REDESIGN_NANO_BANANA.md 영속화 — 10 시야 분석, 현 구현 충돌 매트릭스, 결정 트리 A(variant 신설) / B(default 교체, 권장) / C(별도 mode), 변경 영향 영역, KGS-NANO-1~8 단계. sample-nano-1-national.html(한반도 클레이 3D + 4 미소 cloud) + sample-nano-10-street.html(isometric 카툰 도시 + ranch 집 + 강 + 다리). production 코드 미수정 (박사 standing 명시). 박사 결정 트리 발화 대기.' },
      { type:'완료', title:'세션 종료 — Codex 핸드오프 영속화 (2026-05-27)', desc:'박사 발화 "멈추고 했던곳까지 저장, 코덱스가 확인할 수 있게 준비". internal/notes/HANDOFF_TO_CODEX_2026-05-27.md 신설 — 현재 위치(KGS-NANO-3 HEAD, 박사 만족 미확인) / standing rules 8건 인덱스 / Vite+React+Three.js+Engine 스택 cheat-sheet / receipt 인덱스 / screenshots-map14 untracked dir 플래그 / 박사 결정 대기 4건(NANO-3 OK여부, nano default 여부, NANO-4~8 우선순위, ENGINE Phase 3) / 트랙 분리(engine=Codex, map=Claude) / 로컬 검증 명령. commit b800cb8 push. Codex가 git pull 한 번이면 컨텍스트 잡힘.' }
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

window.PROJECTS = PROJECTS;
window.STATUS = STATUS;
window.ITYPE = ITYPE;
