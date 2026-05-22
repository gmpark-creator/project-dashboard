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
        '목적이 분명하다. 선박 마커, 상태 패널, 노선별 URL이 반복 사용 업무에 맞게 잡혀 있다.',
        '다음 고도화는 기능 추가보다 AIS 데이터 공급원, 갱신 주기, 장애 fallback 정책을 문서화하는 쪽이 우선이다.',
        '여러 선사 버전은 같은 코드군으로 묶고 설정 차이만 분리하는 구조를 유지하는 것이 보수에 유리하다.',
      ],
      risks: [
        { level: 'medium', text: 'AIS 데이터 공급 방식과 장애 시 표시 정책이 명확하지 않으면 운영 신뢰도가 흔들릴 수 있다.' },
        { level: 'low', text: '노선별 배포가 늘어날수록 설정 drift를 막는 configuration matrix가 필요하다.' },
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
        'Metrica 공개 샘플 기반 데모로는 충분한 설득력이 있지만, 최신 실경기 자동 생성으로 부르기에는 데이터 라이선스가 먼저 해결되어야 한다.',
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
      state: '비교 개발 중',
      health: 'active',
      progress: 88,
      stack: ['HTML5', 'JavaScript', 'Three.js', 'WebGL', 'GitHub Pages'],
      summary: '현재 날짜를 기준으로 태양, 행성, 달을 배치하고 타임머신과 포커싱 인터랙션을 제공하는 3D 천체 시뮬레이터.',
      verdict: '비주얼 임팩트가 강하다. 날짜 기반 위치 계산과 UI 제어가 붙으면서 단순 데모에서 비교 가능한 웹앱으로 올라왔다.',
      links: [
        {
          label: 'Codex 버전',
          url: './solar-codex/index.html',
          probe: 'Local build',
          note: '모듈 구조와 날짜 기반 UI',
        },
        {
          label: '비교 버전',
          url: 'https://gmpark-creator.github.io/solar-system/',
          probe: 'HTTP 200',
          note: '단일 HTML 배포 버전',
        },
      ],
      review: [
        'Codex 버전은 코드 분리, 날짜 조작, 카메라 포커싱, 정보 패널을 중심으로 확장성이 좋다.',
        '비교 버전은 단일 HTML 배포 속도와 즉시 실행성이 강점이다.',
        '조석/물때 기능으로 확장하려면 시각화용 천체 위치와 실제 예측 모델의 경계를 화면에서 분명히 해야 한다.',
      ],
      risks: [
        { level: 'medium', text: '사용자가 조석 패널을 실제 물때 예측으로 오해하지 않도록 출처와 한계를 표시해야 한다.' },
        { level: 'medium', text: '천체 위치가 간소화된 궤도요소 기반임을 날짜 이동 UI 옆에 고정 안내로 남기는 편이 안전하다.' },
        { level: 'low', text: '모바일 프레임 성능과 UI 겹침 검증을 계속 유지해야 한다.' },
      ],
      next: [
        '정확도 출처 패널과 모델 한계 고지를 추가.',
        '조석 기능은 관측 지점 정의와 조화상수 확보 전까지 데모 단계로 분리.',
      ],
    },
    {
      id: 'inst',
      order: '04',
      name: 'INST EXTRACTOR',
      label: '음원 보컬 제거 / Inst 추출기',
      state: '실음원 검증 대기',
      health: 'active',
      progress: 64,
      stack: ['Python 3.11', 'FastAPI', 'Demucs', 'PyTorch CUDA', 'HTML5 UI'],
      summary: '사용자가 업로드한 음원에서 보컬 stem을 제거하고 반주용 inst WAV 파일을 생성하는 변환 프로그램.',
      verdict: '백엔드 분리 로직은 Demucs 기반으로 들어갔다. 다음 판단은 집 데스크탑 RTX 4060 Ti에서 실제 음원 품질과 처리 시간을 확인한 뒤 가능하다.',
      links: [
        {
          label: 'Codex 작업 브리핑',
          url: './inst-extractor/index.html',
          probe: 'Static report',
          note: '실행 절차와 검증 대기 항목',
        },
      ],
      review: [
        '`separate_instrumental()`은 모델 로드, CUDA/CPU 자동 분기, stem 분리, vocals 제외 합산, WAV 저장까지 구현되어 있다.',
        '집 데스크탑에서 긴 명령을 다시 칠 필요가 없도록 `NEXT_DESKTOP_STEPS.md`와 PowerShell 스크립트를 저장했다.',
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
      title: '4개 프로젝트 통합 보기',
      body: '선박, 스포츠, 태양계, inst 추출기를 같은 기준으로 정리했다. 각 프로젝트마다 결과물, 현재 판단, 위험, 다음 액션을 한 화면에서 비교한다.',
    },
    {
      title: '결과물 우선 구성',
      body: '설명보다 실행 가능한 링크와 미리보기를 먼저 배치했다. 프로젝트가 어디까지 실제로 작동하는지 빠르게 판별할 수 있다.',
    },
    {
      title: '로컬 실행 인수인계',
      body: 'inst 추출기는 집 데스크탑에서 바로 이어갈 수 있도록 실행 안내 문서와 PowerShell 스크립트를 저장소에 추가했다.',
    },
    {
      title: '다음 판단 고정',
      body: '각 프로젝트의 다음 단계가 기능 욕심이 아니라 검증 가능한 판단 단위로 정리되도록 범위를 좁혔다.',
    },
  ],
  actions: [
    'INST EXTRACTOR는 집 데스크탑 RTX 4060 Ti에서 실제 음원 분리 테스트를 먼저 진행한다.',
    '태양계 프로젝트는 정확도 출처와 조석 모델 경계 안내를 추가한다.',
    'AIS 프로젝트는 데이터 공급원과 갱신 실패 정책을 운영 문서로 고정한다.',
    '스포츠 프로젝트는 트래킹 데이터 라이선스 경로가 결정될 때까지 신규 기능 개발을 멈춘다.',
  ],
};
