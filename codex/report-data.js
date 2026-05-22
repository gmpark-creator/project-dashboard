export const reportData = {
  generatedAt: '2026-05-22 KST',
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
      verdict: '현재 3개 프로젝트 중 제품 표면이 가장 분명하다. 실제 운영자가 반복해서 열어볼 이유가 있고, 두 노선 URL도 공개 상태다.',
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
        '운영 목적이 명확하다. 지도, 선박 마커, 상태 패널이라는 사용 흐름이 짧고 반복 사용에 맞다.',
        '보고서에서는 기능 나열보다 데이터 원천, 갱신 주기, 장애 대응 기준을 더 앞에 두는 편이 좋다.',
        '두 노선 버전은 같은 제품군으로 묶고, 설정 차이만 분리 관리하는 구조가 장기 유지보수에 유리하다.',
      ],
      risks: [
        { level: 'medium', text: 'AIS 데이터 공급원이 정식 API/계약 기반인지 서비스 설명에서 더 명확히 분리해야 한다.' },
        { level: 'low', text: 'ops-main과 kyowa-line-ops가 별도 URL로 운영되므로 공통 코드와 설정 drift를 관리해야 한다.' },
      ],
      next: [
        'AIS 데이터 공급원, 갱신 주기, 실패 시 fallback 정책을 고정 문서화.',
        '노선별 차이를 configuration matrix로 관리.',
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
      summary: '선수·공 위치 데이터를 2D 경기장에 재생하고, 장면 분석과 하이라이트 자동화로 확장하려는 프로젝트.',
      verdict: '기술 데모는 의미가 있지만 제품화 판단은 멈추는 편이 맞다. 데이터 라이선스가 풀리지 않으면 “임의 최신 경기 자동 생성기”로 부르면 안 된다.',
      links: [
        {
          label: '2D Match Tracker',
          url: 'https://gmpark-creator.github.io/project-dashboard/match-tracker/',
          probe: 'HTTP 200',
          note: 'Metrica 공개 샘플 기반 웹 프리뷰',
        },
      ],
      review: [
        '현재 구현은 “하이라이트 생성기”보다는 “트래킹 데이터 리뷰어”에 가깝다.',
        'Metrica 공개 샘플 기반 데모로는 충분히 설득력이 있다. 다만 임의 경기 자동화 범위는 별도 의사결정이 필요하다.',
        '제품 방향은 두 갈래다. 유료 optical tracking 라이선스를 확보하거나, 공개 이벤트 데이터 기반 저정밀 하이라이트 도구로 재설계해야 한다.',
      ],
      risks: [
        { level: 'high', text: '임의 최신 경기의 연속 선수/공 트래킹 데이터는 공개 웹에서 합법적으로 확보하기 어렵다.' },
        { level: 'high', text: '방송 영상 CV 추출 경로는 저작권, 정확도, 엔지니어링 비용이 동시에 커진다.' },
        { level: 'medium', text: '현재 데모가 실측 공개 샘플 기반임을 계속 드러내지 않으면 사용자가 범위를 오해할 수 있다.' },
      ],
      next: [
        '프로젝트 상태는 보류로 유지하고, 새 기능보다 데이터 확보 의사결정부터 진행.',
        '대안 설계안: 이벤트 데이터 기반 하이라이트 후보 탐색기로 scope 축소.',
      ],
    },
    {
      id: 'solar',
      order: '03',
      name: 'Solar System Simulator',
      label: '태양계 프로젝트',
      state: '비교 개발 중',
      health: 'active',
      progress: 88,
      stack: ['HTML5', 'JavaScript', 'Three.js', 'WebGL', 'GitHub Pages'],
      summary: '현재 날짜를 기준으로 태양·행성·달을 배치하고, 타임머신과 인터랙션을 제공하는 3D 천체 시뮬레이터.',
      verdict: '비주얼 임팩트가 가장 크다. Codex 버전과 Claude 버전을 나란히 열어보면서 모듈화, 검증, 단일 HTML 속도, 3D 연출을 비교할 수 있게 했다.',
      links: [
        {
          label: 'Codex 제작 버전',
          url: './solar-codex/index.html',
          probe: 'Local build',
          note: '모듈화·Playwright 검증 기반',
        },
        {
          label: 'Claude 제작 버전',
          url: 'https://gmpark-creator.github.io/solar-system/',
          probe: 'HTTP 200',
          note: '단일 HTML·GitHub Pages 배포',
        },
      ],
      review: [
        'Codex 버전은 코드 분리, 자동 검증, 날짜 조작 UI의 회귀 테스트를 강점으로 가져간다.',
        'Claude 버전은 단일 HTML 배포 속도와 3D 연출을 빠르게 보여주는 장점이 있다.',
        '두 버전 모두 조석/물때표로 확장하려면 천체 시각화와 실제 항만 조석 예측의 경계를 화면에서 분명히 나눠야 한다.',
      ],
      risks: [
        { level: 'medium', text: '조석 패널이 실제 항만 물때 예측으로 오해되지 않도록 경고와 출처가 필요하다.' },
        { level: 'medium', text: '천체 위치는 간소화 궤도요소 기반이므로 장기 날짜 이동 시 오차 설명이 필요하다.' },
        { level: 'low', text: '비주얼이 강한 만큼 모바일 프레임 성능과 UI 겹침 검증을 계속 유지해야 한다.' },
      ],
      next: [
        'Step 5는 정확도/출처 패널과 고정밀 달 모듈 설계로 잡는 것이 합리적.',
        '물때표 기능은 조화상수와 관측 지점 정의 전까지 데모로만 표기.',
      ],
    },
  ],
  improvements: [
    {
      title: '결과물 중심 구성',
      body: '각 프로젝트를 설명보다 먼저 실제 실행 화면, 접근 상태, 현재 판단으로 정리했다. 보고서를 열면 “무엇을 볼 수 있는지”가 바로 드러난다.',
    },
    {
      title: '판단과 리스크 분리',
      body: '진행률, 기술 스택, 리뷰, 리스크를 분리해 프로젝트 상태를 과장하지 않도록 구성했다.',
    },
    {
      title: '태양계 이중 비교',
      body: '태양계 프로젝트는 Codex 제작 버전과 Claude 제작 버전을 각각 프리뷰로 열 수 있게 구성했다.',
    },
    {
      title: '다음 액션 고정',
      body: '선박은 데이터 운영 정책, 스포츠는 데이터 라이선스 결정, 태양계는 정확도/조석 경계 설정으로 다음 작업을 좁혔다.',
    },
  ],
  actions: [
    '선박 트래킹: AIS 데이터 공급원과 갱신 실패 정책을 문서화한다.',
    '스포츠: 유료 트래킹 라이선스 또는 이벤트 데이터 기반 재설계 중 하나를 선택하기 전까지 신규 기능 개발을 멈춘다.',
    '태양계: Codex/Claude 버전을 계속 비교하면서 정확도 패널과 조석 모델을 다음 단계로 분리한다.',
    '통합 보고서: 각 프로젝트마다 live URL, source, 검증 방식, red-team 결론을 필수 항목으로 둔다.',
  ],
};
