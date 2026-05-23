export const reportData = {
  generatedAt: '2026-05-22 KST',
  projects: [
    {
      id: 'ship',
      order: '01',
      name: 'AIS Ship Tracker',
      label: '선박 위치 추적 운영판',
      state: '운영 공개',
      health: 'strong',
      progress: 100,
      stack: ['Next.js', 'React', 'TypeScript', 'Leaflet', 'Vercel'],
      summary: '관리 대상 선단을 지도 위에서 실시간으로 확인하는 선박 위치 추적 웹앱.',
      verdict: '실제 운영 화면과 공개 URL이 갖춰져 있어 현재 프로젝트군에서 제품 표면이 가장 분명하다.',
      links: [
        {
          label: 'ops-main',
          url: 'https://ais.vercel.co.kr/ops-main',
          probe: 'HTTP 200',
          note: 'PEL / MAGE / OCEAN ACE 운영 화면',
        },
        {
          label: 'kyowa-line-ops',
          url: 'https://ais.vercel.co.kr/kyowa-line-ops',
          probe: 'HTTP 200',
          note: 'KYOWA LINE 분리 운영 화면',
        },
      ],
      review: [
        '지도 기반 선박 추적이라는 목적이 분명하고, 선박별 URL 분리도 운영 업무에 맞다.',
        '다음 단계는 기능 추가보다 AIS 데이터 공급원, 갱신 주기, 장애 fallback 정책을 고정하는 쪽이 우선이다.',
        '노선과 선사별 버전이 늘어날수록 공통 코드와 설정 파일을 분리해서 drift를 줄여야 한다.',
      ],
      risks: [
        { level: 'medium', text: 'AIS 데이터 공급 방식과 장애 시 표시 정책이 명확하지 않으면 운영 신뢰도가 흔들릴 수 있다.' },
        { level: 'low', text: '노선별 배포가 늘어날수록 설정 차이를 추적하는 configuration matrix가 필요하다.' },
      ],
      next: [
        'AIS 데이터 공급원, 갱신 주기, 실패 fallback을 운영 문서로 고정.',
        '노선별 차이를 설정 파일로 분리하고 공통 컴포넌트 변경을 한 번에 반영.',
      ],
    },
    {
      id: 'sports',
      order: '02',
      name: 'Sports Highlight Generator',
      label: '스포츠 하이라이트 생성기',
      state: '데이터 경로 보류',
      health: 'paused',
      progress: 78,
      stack: ['HTML5 Canvas', 'JavaScript', 'Tailwind CSS', 'Metrica sample data'],
      summary: '선수와 공의 위치 데이터를 2D 경기장에 재생하고, 장면 분석과 하이라이트 자동화를 목표로 하는 프로젝트.',
      verdict: '기술 데모로는 가치가 있지만 제품 판단은 멈추는 것이 맞다. 최신 경기의 연속 트래킹 데이터 확보가 핵심 병목이다.',
      links: [
        {
          label: '2D Match Tracker',
          url: 'https://gmpark-creator.github.io/project-dashboard/match-tracker/',
          probe: 'HTTP 200',
          note: 'Metrica 공개 샘플 기반 미리보기',
        },
      ],
      review: [
        '현재 구현은 하이라이트 생성기라기보다 트래킹 데이터 리플레이어에 가깝다.',
        'Metrica 공개 샘플 기반 데모로는 충분하지만, 최신 실경기 자동 생성으로 부르기에는 데이터 라이선스가 먼저 해결되어야 한다.',
        '제품 방향은 유료 optical tracking 라이선스 확보 또는 공개 이벤트 데이터 기반 분석 도구로 범위를 줄이는 두 갈래가 현실적이다.',
      ],
      risks: [
        { level: 'high', text: '최신 경기의 연속 선수/공 트래킹 데이터는 공개 웹에서 합법적으로 확보하기 어렵다.' },
        { level: 'high', text: '방송 영상 CV 추출 경로는 정확도, 저작권, 비용 문제가 동시에 커진다.' },
        { level: 'medium', text: '현재 데모가 공개 샘플 기반임을 계속 표시하지 않으면 사용자가 범위를 오해할 수 있다.' },
      ],
      next: [
        '개발 상태를 보류로 유지하고 데이터 확보 의사결정부터 진행.',
        '대안으로 이벤트 데이터 기반 하이라이트 후보 탐색기 범위를 검토.',
      ],
    },
    {
      id: 'solar',
      order: '03',
      name: 'Solar System Simulator',
      label: '태양계 3D 시뮬레이터',
      state: '공개 비교본 개선 완료',
      health: 'active',
      progress: 96,
      stack: ['HTML5', 'JavaScript', 'Three.js', 'WebGL', 'GitHub Pages'],
      summary: '현재 날짜 기준으로 태양, 행성, 달을 배치하고 타임머신, 카메라 포커싱, 행성 정보 패널을 제공하는 3D 천체 시뮬레이터.',
      verdict: 'Codex와 Claude 버전을 각각 공개 주소로 분리했고, 1년 전후 이동은 즉시 점프가 아니라 시간 흐름처럼 재생되도록 바뀌었다. Codex 버전은 지구와 행성 확대 품질도 개선했다.',
      links: [
        {
          label: 'Solar Project - Codex',
          url: '../solar-project-codex/',
          probe: 'GitHub Pages 200',
          note: '시간 흐름형 연도 이동, 실제 지구 텍스처, 행성 디테일 개선',
        },
        {
          label: 'Solar Project - Claude',
          url: '../solar-project-claude/',
          probe: 'GitHub Pages 200',
          note: '단일 HTML 기반 비교 버전',
        },
      ],
      review: [
        '두 버전을 `solar-project-codex`와 `solar-project-claude` 공개 경로로 분리해 다른 사람에게 바로 공유할 수 있게 했다.',
        '연도 이동 버튼은 현재 위치 대비 즉시 점프가 아니라, 목표 날짜까지 중간 날짜를 거치며 재생되는 방식으로 수정했다.',
        'Codex 버전은 실제 지구 텍스처, 구름층, 야간 조명, 달 텍스처, 목성 대적점, 화성/수성 표면 디테일, 토성 고리 결을 추가했다.',
      ],
      risks: [
        { level: 'medium', text: '천체 위치는 간소화된 궤도요소 기반이므로 실제 항법·관측용 정밀 천문력으로 오해하지 않게 안내가 필요하다.' },
        { level: 'medium', text: '조석/물때 기능으로 확장할 경우 관측 지점, 조화상수, 예측 모델의 출처를 별도로 고정해야 한다.' },
        { level: 'low', text: '고해상도 텍스처와 WebGL 효과가 늘어났으므로 저사양 모바일 성능 검증은 계속 필요하다.' },
      ],
      next: [
        '정확도 출처와 모델 한계 고지 패널 추가.',
        '왕먀오 박사 피드백 기준으로 UI 문구, 모바일 배치, 행성 확대 카메라 거리를 한 번 더 조정.',
      ],
    },
    {
      id: 'inst',
      order: '04',
      name: 'INST EXTRACTOR',
      label: '음원 보컬 제거 / Inst 추출기',
      state: '집 데스크탑 검증 대기',
      health: 'active',
      progress: 68,
      stack: ['Python 3.11', 'FastAPI', 'Demucs', 'PyTorch CUDA', 'HTML5 UI'],
      summary: '사용자가 업로드한 음원에서 보컬 stem을 제거하고 반주용 inst WAV 파일을 생성하는 변환 프로그램.',
      verdict: 'Demucs 기반 백엔드 분리 로직과 집 데스크탑 실행 인수인계 문서가 준비됐다. 다음 판단은 RTX 4060 Ti 환경에서 실제 음원 품질과 처리 시간을 확인한 뒤 가능하다.',
      links: [
        {
          label: 'INST EXTRACTOR 브리핑',
          url: './inst-extractor/',
          probe: 'GitHub Pages 200',
          note: '실행 절차와 검증 대기 항목',
        },
        {
          label: 'GitHub 저장소',
          url: 'https://github.com/gmpark-creator/inst-extractor',
          probe: 'Repo',
          note: 'NEXT_DESKTOP_STEPS.md / CODEX_TO_CLAUDE.md 포함',
        },
      ],
      review: [
        '`separate_instrumental()`은 모델 로드, CUDA/CPU 자동 분기, stem 분리, vocals 제외 합산, WAV 저장까지 구현되어 있다.',
        '집 데스크탑에서 긴 명령을 다시 칠 필요가 없도록 `NEXT_DESKTOP_STEPS.md`, `CODEX_TO_CLAUDE.md`, PowerShell 스크립트를 저장했다.',
        '현재 남은 핵심은 실제 음원 테스트다. 보컬 제거 품질, 처리 시간, VRAM 사용량을 확인해야 다음 UI/옵션 개선 방향이 정해진다.',
      ],
      risks: [
        { level: 'high', text: 'PyTorch CUDA wheel이 CPU 빌드로 잘못 설치되면 RTX 4060 Ti를 쓰지 못하고 처리 속도가 크게 떨어진다.' },
        { level: 'medium', text: '긴 음원은 처리 시간이 길어 브라우저 요청 타임아웃이나 진행률 부재 문제가 드러날 수 있다.' },
        { level: 'medium', text: '모델별 결과 품질 차이가 있어 htdemucs, htdemucs_ft, htdemucs_6s, mdx_extra를 실제 샘플로 비교해야 한다.' },
      ],
      next: [
        '집 데스크탑에서 `scripts/setup_windows_desktop.ps1` 실행 후 CUDA 인식 확인.',
        '`scripts/run_server.ps1`로 FastAPI 서버 실행 후 실제 음원 업로드 테스트.',
        '결과 WAV 품질과 처리 시간을 기록하고, 필요하면 모델 선택/진행률/긴 작업 큐를 다음 단계로 구현.',
      ],
    },
  ],
  improvements: [
    {
      title: '태양계 공개 공유본 완성',
      body: 'Codex와 Claude 태양계 버전을 각각 공개 경로로 분리했고, 왕먀오 박사에게 바로 보낼 수 있는 URL 두 개를 확보했다.',
    },
    {
      title: '시간 이동 방식 개선',
      body: '1년 전후 이동은 즉시 날짜 점프가 아니라 현재 시점에서 목표 시점까지 시간이 흐르듯 재생되도록 바뀌었다.',
    },
    {
      title: 'Codex 행성 비주얼 보강',
      body: '지구 실제 텍스처, 구름, 야간 조명, 달 텍스처, 목성 대적점, 화성/수성 표면 디테일, 토성 고리 디테일을 추가했다.',
    },
    {
      title: '4번 프로젝트 인수인계 완료',
      body: 'INST EXTRACTOR는 집 데스크탑에서 바로 이어 실행할 수 있도록 안내 문서와 PowerShell 자동화 스크립트를 저장했다.',
    },
  ],
  actions: [
    '태양계 Codex/Claude 공개 링크를 왕먀오 박사에게 공유하고 비주얼·조작감 피드백을 받는다.',
    'INST EXTRACTOR는 집 데스크탑 RTX 4060 Ti에서 실제 음원 분리 테스트를 먼저 진행한다.',
    'AIS 프로젝트는 데이터 공급원과 갱신 실패 정책을 운영 문서로 고정한다.',
    '스포츠 프로젝트는 트래킹 데이터 라이선스 경로가 결정될 때까지 신규 기능 개발을 멈춘다.',
  ],
};
