export const reportData = {
  generatedAt: '2026-05-22 KST',
  sourceReport: {
    title: 'Claude project dashboard',
    localPath: '../index.html',
    liveUrl: 'https://gmpark-creator.github.io/project-dashboard/',
    commit: '8df4b86 스포츠 프로젝트 — 디렉터 총평 추가 + 데이터 수급 장벽으로 개발 잠정 보류',
  },
  projects: [
    {
      id: 'ship',
      order: '01',
      name: 'AIS Ship Tracker',
      label: '선박 트래킹',
      state: '운영 공개',
      health: 'strong',
      progress: 100,
      stack: ['Next.js', 'React', 'TypeScript', 'Leaflet', 'Vercel'],
      summary: '관리 대상 선단을 지도 위에서 실시간 확인하는 운영형 선박 위치 추적 웹 앱.',
      verdict: '현재 3개 중 제품 표면이 가장 명확하다. 실제 운영자가 반복해서 열어볼 목적이 분명하고, 두 노선 URL도 공개 상태다.',
      links: [
        {
          label: 'ops-main · PEL/MAGE/OCEAN ACE',
          url: 'https://ais.vercel.co.kr/ops-main',
          probe: 'HTTP 200',
          note: '주요 선단 운영 화면',
        },
        {
          label: 'kyowa-line-ops · KYOWA LINE',
          url: 'https://ais.vercel.co.kr/kyowa-line-ops',
          probe: 'HTTP 200',
          note: '노선 분리 배포 화면',
        },
      ],
      review: [
        '클로드 보고서의 장점은 live embed를 통해 결과물을 바로 열어볼 수 있게 한 점이다.',
        'Codex 기준으로는 “실시간”이라는 표현의 데이터 원천과 갱신 주기를 더 명시해야 운영 리스크가 줄어든다.',
        '프로젝트 목적은 명확하다. 보고서에서는 기능 설명보다 운영 대상, 데이터 신뢰도, 장애 대응 기준을 더 앞에 두는 편이 낫다.',
      ],
      risks: [
        { level: 'medium', text: 'AIS 데이터 공급원이 정식 API/계약 기반인지 보고서에서 충분히 분리되어 있지 않다.' },
        { level: 'low', text: '두 버전이 별도 URL로 존재하므로 공통 코드/설정 drift를 관리할 기준이 필요하다.' },
      ],
      next: [
        'AIS 데이터 공급원, 갱신 주기, 실패 시 fallback 정책을 보고서에 고정 항목으로 추가.',
        'ops-main과 kyowa-line-ops의 차이를 configuration matrix로 관리.',
      ],
    },
    {
      id: 'sports',
      order: '02',
      name: 'Sports Highlight Generator',
      label: '스포츠 하이라이트 생성기',
      state: '데이터 장벽으로 보류',
      health: 'paused',
      progress: 78,
      stack: ['HTML5 Canvas', 'JavaScript', 'Tailwind CSS', 'Metrica sample data'],
      summary: '선수·공 위치 데이터를 2D 경기장에 재생하고, 장면 분석/하이라이트 자동화로 확장하려는 프로젝트.',
      verdict: '기술 데모는 의미가 있지만 제품화 판단은 정확히 멈춰야 한다. 데이터 라이선스가 풀리지 않으면 “임의 최신 경기 자동 생성기”로 부르면 안 된다.',
      links: [
        {
          label: '2D Match Tracker',
          url: 'https://gmpark-creator.github.io/project-dashboard/match-tracker/',
          probe: 'HTTP 200',
          note: 'Metrica 공개 샘플 기반 웹 프리뷰',
        },
      ],
      review: [
        '클로드 보고서가 데이터 수급 장벽을 보류 사유로 명시한 판단은 타당하다.',
        'Codex 관점에서는 이 프로젝트명을 “하이라이트 생성기”보다 “트래킹 데이터 리뷰어”로 낮춰 부르는 편이 현재 구현과 맞다.',
        '제품 방향은 두 갈래다. 유료 optical tracking 라이선스를 사거나, 공개 이벤트 데이터 기반의 저정밀 하이라이트 도구로 재설계해야 한다.',
      ],
      risks: [
        { level: 'high', text: '임의 최신 경기의 연속 선수/공 트래킹 데이터는 공개 웹에서 합법적으로 확보하기 어렵다.' },
        { level: 'high', text: '방송 영상 CV 추출 경로는 저작권·정확도·엔지니어링 비용이 동시에 커진다.' },
        { level: 'medium', text: '현재 데모가 “실측 샘플”임을 계속 드러내지 않으면 사용자가 범위를 오해할 수 있다.' },
      ],
      next: [
        '프로젝트 문구를 “보류”로 유지하고, 새 기능보다 데이터 확보 의사결정부터 진행.',
        '대안 설계안: 이벤트 데이터 기반 하이라이트 후보 탐색기로 scope를 축소.',
      ],
    },
    {
      id: 'solar',
      order: '03',
      name: 'Solar System Simulator',
      label: '태양계 프로젝트',
      state: '진행 중',
      health: 'active',
      progress: 82,
      stack: ['HTML5', 'JavaScript', 'Three.js', 'WebGL', 'GitHub Pages'],
      summary: '현재 날짜를 기준으로 태양·행성·달을 배치하고, 타임머신과 인터랙션을 제공하는 3D 천체 시뮬레이터.',
      verdict: '비주얼 임팩트가 가장 크다. 다만 “물때표”로 가려면 천문 시각화와 조석 예측의 정확도 경계를 엄격히 나눠야 한다.',
      links: [
        {
          label: 'Solar System Simulator',
          url: 'https://gmpark-creator.github.io/solar-system/',
          probe: 'HTTP 200',
          note: 'Three.js 태양계 시뮬레이터',
        },
      ],
      review: [
        '클로드 결과물은 웹 배포와 3D 인터랙션을 빠르게 보여주는 데 강하다.',
        'Codex 기준으로는 천체력 계산식, 조석 모델, 실제 물때표 가능 범위를 별도 accuracy panel로 분리해야 한다.',
        '경쟁형 비교에는 좋다. 클로드 버전은 단일 HTML 속도가 강점이고, Codex 버전은 모듈화와 자동 검증을 강점으로 가져갈 수 있다.',
      ],
      risks: [
        { level: 'medium', text: '조석 패널이 실제 항만 물때 예측으로 오해되지 않도록 경고와 출처가 필요하다.' },
        { level: 'medium', text: '천체 위치는 간소화 궤도요소 기반이므로 장기 날짜 이동 시 오차 설명이 필요하다.' },
        { level: 'low', text: '비주얼이 강한 만큼 모바일 프레임 성능과 UI 겹침 검증을 계속 유지해야 한다.' },
      ],
      next: [
        'Step 5는 “정확도/출처 패널 + 고정밀 달 모듈 설계”로 잡는 것이 합리적.',
        '물때표 기능은 조화상수와 관측 지점 정의 전까지 데모로만 표기.',
      ],
    },
  ],
  improvements: [
    {
      title: '보고서가 결과물과 리뷰를 분리한다',
      body: '클로드 보고서는 프로젝트 설명과 iframe 미리보기가 강점이다. Codex판은 결과물, 검증 상태, 판단, 리스크를 각기 다른 행으로 분리해 비교 가능성을 높였다.',
    },
    {
      title: '보류 사유를 더 앞에 둔다',
      body: '스포츠 프로젝트는 기능 구현보다 데이터 권리 문제가 더 중요하다. 그래서 진행률보다 “왜 멈춰야 하는지”를 상단 판단에 반영했다.',
    },
    {
      title: '증거 기준을 명시한다',
      body: '각 라이브 결과물은 HTTP 200 확인 대상이며, 보고서에는 원본 Claude dashboard commit과 public URL을 함께 남긴다.',
    },
    {
      title: '다음 액션을 프로젝트별로 좁힌다',
      body: '선박은 데이터 SLA, 스포츠는 데이터 라이선스 결정, 태양계는 정확도/조석 경계 설정으로 다음 작업을 분리했다.',
    },
  ],
  actions: [
    '선박 트래킹: AIS 데이터 공급원과 갱신 실패 정책을 문서화한다.',
    '스포츠: 유료 트래킹 라이선스 또는 이벤트 데이터 기반 재설계 중 하나를 선택하기 전까지 신규 기능 개발을 멈춘다.',
    '태양계: 물때표 확장 전에 천체력 정확도, 달 모델, 조화상수 출처를 화면에 표시한다.',
    '통합 보고서: 앞으로는 각 프로젝트마다 live URL, repo/source, 검증 방식, red-team 결론을 필수 항목으로 둔다.',
  ],
};
