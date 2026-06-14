/* Polaris Core — 반도체 단타 지식·데이터 베이스 (window.POLARIS_CORE)
 *
 * 원칙(레포 standing 준수):
 *  - 실측 OHLC가 있는 종목(measured)에만 파생통계(POLARIS_DERIVED)를 연결한다.
 *  - referenceOnly 종목은 메타데이터(티커·역할·테마·tvSymbol)만. ATR/상관/베타 등 수치를 절대 부여하지 않는다(환각 방지).
 *  - 모든 항목은 source·asOf를 가진다. 통계 항목은 computedFrom·sampleSize를 가진다(없으면 schema-validate.mjs가 빌드 실패).
 *  - 연구·교육 전용. 투자자문 아님. 종목코드·티커는 공개정보지만 거래 전 원출처에서 재확인할 것.
 *
 * 시각화 소비처: data/index.html(지식 브라우저), desk/, signal-engine/, flip-replay/.
 */
window.POLARIS_CORE = {
  meta: {
    asOf: '2026-06-15',
    version: '1.0.0',
    builtBy: 'Claude(Opus 4.8) Thesis + Codex(GPT-5.5) Antithesis 변증법 R1~R3',
    disclaimer: '연구·교육용 참고 자료입니다. 투자자문이 아니며 매매 결정·결과의 책임은 이용자 본인에게 있습니다. 종목코드·티커·역할은 공개정보 기반이나 거래 전 원출처(거래소·증권사)에서 반드시 재확인하세요.',
    sources: [
      'KRX 한국거래소 상장종목 코드(공개)',
      'TradingView 심볼 표기(공개)',
      'Direxion SOXL/SOXS 펀드 개요(레버리지·기초지수 PHLX Semiconductor)',
      'us-kr-premarket/market-ledger/data.js — 6월 실측·이중검증 OHLC',
    ],
  },

  /* ── 유니버스 ───────────────────────────────────────────────
   * measured: LEDGER에 실측 OHLC가 있어 파생통계 연결 가능(derivedKey로 POLARIS_DERIVED.perSymbol 참조).
   * referenceOnly: 메타데이터만. 파생통계 없음.
   */
  universe: {
    measured: [
      { ticker: '005930', name: '삼성전자', market: 'KR', code: '005930', role: '메모리/종합 반도체(IDM)', theme: 'KOSPI 반도체', tvSymbol: 'KRX:005930', derivedKey: 'SAMSUNG', source: 'KRX·market-ledger', note: 'DRAM·NAND·파운드리·시스템LSI. 코스피 시총 1위, 외국인·기관 수급 핵심.' },
      { ticker: '000660', name: 'SK하이닉스', market: 'KR', code: '000660', role: '메모리(DRAM·HBM·NAND)', theme: 'KOSPI 반도체', tvSymbol: 'KRX:000660', derivedKey: 'HYNIX', source: 'KRX·market-ledger', note: 'HBM(고대역폭메모리) 선두. AI 메모리 사이클의 한국 대표 베타.' },
      { ticker: 'SOXL', name: 'Direxion 데일리 반도체 강세 3X', market: 'US', role: 'ETF · PHLX 반도체지수 3배 롱(레버리지)', theme: '미국 반도체 ETF', tvSymbol: 'AMEX:SOXL', leverage: 3, derivedKey: 'SOXL', source: 'Direxion·market-ledger', note: '일일 +3배(강세) 변동을 추종. 복리·괴리로 장기보유 부적합, 단타 전용 성격.' },
      { ticker: 'SOXS', name: 'Direxion 데일리 반도체 약세 3X', market: 'US', role: 'ETF · PHLX 반도체지수 3배 숏(인버스 레버리지)', theme: '미국 반도체 ETF', tvSymbol: 'AMEX:SOXS', leverage: -3, derivedKey: 'SOXS', source: 'Direxion·market-ledger', note: 'SOXL의 역방향(실측 상관 −1.0). 하락장 헤지/숏 대용.' },
    ],
    referenceOnly: {
      'AI가속기·설계': [
        { ticker: 'NVDA', name: '엔비디아', market: 'US', role: 'AI GPU 설계(팹리스)', tvSymbol: 'NASDAQ:NVDA' },
        { ticker: 'AMD', name: '어드밴스드 마이크로 디바이스', market: 'US', role: 'CPU/GPU 설계(팹리스)', tvSymbol: 'NASDAQ:AMD' },
        { ticker: 'AVGO', name: '브로드컴', market: 'US', role: 'AI ASIC·네트워킹 설계', tvSymbol: 'NASDAQ:AVGO' },
        { ticker: 'QCOM', name: '퀄컴', market: 'US', role: '모바일 SoC 설계', tvSymbol: 'NASDAQ:QCOM' },
        { ticker: 'MRVL', name: '마벨 테크놀로지', market: 'US', role: '데이터센터·커스텀 실리콘', tvSymbol: 'NASDAQ:MRVL' },
        { ticker: 'ALAB', name: '아스테라랩스', market: 'US', role: 'AI 연결성 반도체', tvSymbol: 'NASDAQ:ALAB' },
      ],
      '메모리': [
        { ticker: 'MU', name: '마이크론 테크놀로지', market: 'US', role: 'DRAM·NAND·HBM 메모리', tvSymbol: 'NASDAQ:MU' },
      ],
      '파운드리': [
        { ticker: 'TSM', name: 'TSMC', market: 'US', role: '파운드리(세계 1위, ADR)', tvSymbol: 'NYSE:TSM' },
        { ticker: 'UMC', name: '유나이티드 마이크로일렉트로닉스', market: 'US', role: '파운드리(대만, ADR)', tvSymbol: 'NYSE:UMC' },
        { ticker: 'INTC', name: '인텔', market: 'US', role: 'IDM·파운드리 전환 중', tvSymbol: 'NASDAQ:INTC' },
        { ticker: 'STM', name: 'ST마이크로일렉트로닉스', market: 'US', role: 'IDM(유럽, ADR)', tvSymbol: 'NYSE:STM' },
      ],
      '장비(WFE)': [
        { ticker: 'ASML', name: 'ASML 홀딩', market: 'US', role: 'EUV 노광장비 독점(ADR)', tvSymbol: 'NASDAQ:ASML' },
        { ticker: 'AMAT', name: '어플라이드 머티어리얼즈', market: 'US', role: '증착·식각 등 종합장비', tvSymbol: 'NASDAQ:AMAT' },
        { ticker: 'LRCX', name: '램리서치', market: 'US', role: '식각·증착 장비', tvSymbol: 'NASDAQ:LRCX' },
        { ticker: 'KLAC', name: 'KLA 코포레이션', market: 'US', role: '검사·계측 장비', tvSymbol: 'NASDAQ:KLAC' },
        { ticker: 'TER', name: '테라다인', market: 'US', role: '테스트 장비', tvSymbol: 'NASDAQ:TER' },
      ],
      '아날로그·전력·기타': [
        { ticker: 'TXN', name: '텍사스 인스트루먼트', market: 'US', role: '아날로그·임베디드', tvSymbol: 'NASDAQ:TXN' },
        { ticker: 'ADI', name: '아날로그 디바이스', market: 'US', role: '아날로그', tvSymbol: 'NASDAQ:ADI' },
        { ticker: 'NXPI', name: 'NXP 세미콘덕터', market: 'US', role: '차량용·임베디드', tvSymbol: 'NASDAQ:NXPI' },
        { ticker: 'MCHP', name: '마이크로칩 테크놀로지', market: 'US', role: 'MCU·아날로그', tvSymbol: 'NASDAQ:MCHP' },
        { ticker: 'ON', name: '온세미컨덕터', market: 'US', role: '전력·차량용', tvSymbol: 'NASDAQ:ON' },
        { ticker: 'MPWR', name: '모놀리식 파워 시스템즈', market: 'US', role: '전력관리 IC', tvSymbol: 'NASDAQ:MPWR' },
        { ticker: 'SWKS', name: '스카이웍스 솔루션즈', market: 'US', role: 'RF 프론트엔드', tvSymbol: 'NASDAQ:SWKS' },
        { ticker: 'QRVO', name: '코보', market: 'US', role: 'RF', tvSymbol: 'NASDAQ:QRVO' },
        { ticker: 'LSCC', name: '래티스 세미컨덕터', market: 'US', role: 'FPGA', tvSymbol: 'NASDAQ:LSCC' },
        { ticker: 'RMBS', name: '램버스', market: 'US', role: '메모리 인터페이스 IP', tvSymbol: 'NASDAQ:RMBS' },
        { ticker: 'ENTG', name: '엔테그리스', market: 'US', role: '소재·공정 소모품', tvSymbol: 'NASDAQ:ENTG' },
        { ticker: 'COHR', name: '코히런트', market: 'US', role: '광통신·레이저', tvSymbol: 'NYSE:COHR' },
        { ticker: 'WOLF', name: '울프스피드', market: 'US', role: 'SiC 전력반도체', tvSymbol: 'NYSE:WOLF' },
        { ticker: 'ALGM', name: '알레그로 마이크로시스템즈', market: 'US', role: '센서·전력', tvSymbol: 'NASDAQ:ALGM' },
      ],
      '미국 ETF·지수': [
        { ticker: 'SMH', name: 'VanEck 반도체 ETF', market: 'US', role: '반도체 ETF(비레버리지·상대강도 비교 기준)', tvSymbol: 'NASDAQ:SMH' },
        { ticker: 'SOXX', name: 'iShares 반도체 ETF', market: 'US', role: '반도체 ETF(비레버리지)', tvSymbol: 'NASDAQ:SOXX' },
        { ticker: 'SOX', name: 'PHLX 반도체지수', market: 'US', role: '필라델피아 반도체지수(SOXL/SOXS 기초지수)', tvSymbol: 'NASDAQ:SOX' },
      ],
      'KOSPI/KOSDAQ 반도체': [
        { ticker: '042700', name: '한미반도체', market: 'KR', code: '042700', role: 'HBM 본더(TC본더) 장비', tvSymbol: 'KRX:042700' },
        { ticker: '000990', name: 'DB하이텍', market: 'KR', code: '000990', role: '파운드리(8인치)', tvSymbol: 'KRX:000990' },
        { ticker: '058470', name: '리노공업', market: 'KR', code: '058470', role: '테스트 핀·소켓', tvSymbol: 'KRX:058470' },
        { ticker: '039030', name: '이오테크닉스', market: 'KR', code: '039030', role: '레이저 장비', tvSymbol: 'KRX:039030' },
        { ticker: '036930', name: '주성엔지니어링', market: 'KR', code: '036930', role: '증착(ALD) 장비', tvSymbol: 'KRX:036930' },
        { ticker: '403870', name: 'HPSP', market: 'KR', code: '403870', role: '고압 수소 어닐링 장비', tvSymbol: 'KRX:403870' },
        { ticker: '240810', name: '원익IPS', market: 'KR', code: '240810', role: '증착·식각 장비', tvSymbol: 'KRX:240810' },
        { ticker: '089030', name: '테크윙', market: 'KR', code: '089030', role: '테스트 핸들러', tvSymbol: 'KRX:089030' },
        { ticker: '005290', name: '동진쎄미켐', market: 'KR', code: '005290', role: '포토레지스트 소재', tvSymbol: 'KRX:005290' },
        { ticker: '067310', name: '하나마이크론', market: 'KR', code: '067310', role: '후공정(패키징)', tvSymbol: 'KRX:067310' },
        { ticker: '064760', name: '티씨케이', market: 'KR', code: '064760', role: '식각 소모품(SiC 부품)', tvSymbol: 'KRX:064760' },
        { ticker: '101490', name: '에스앤에스텍', market: 'KR', code: '101490', role: '블랭크마스크·EUV 펠리클', tvSymbol: 'KRX:101490' },
      ],
    },
  },

  /* ── 플레이북 패턴 (교육용 · 실제 6월 LEDGER 날짜 예시 연결 · 성과/승률 표현 금지) ── */
  playbook: [
    { id: 'gap-and-go', name: '갭앤고', nameEn: 'Gap-and-Go', idea: '큰 갭 상승 후 시가 부근을 유지하며 같은 방향으로 이어진 흐름이 관측되는 패턴.',
      rule: '오버나잇 미국 강세로 갭업한 뒤 시가 부근을 지키며 한 방향으로 이어진 사례로 분류되는 흐름(사후 관찰).',
      examples: [{ date: '2026-06-02', symbol: 'SOXL', what: '본장 +17.31%(regChgPct) 강한 추세일 — 갭업 후 지속', ledgerRef: 'us.soxl[2026-06-02]' }],
      caution: '레버리지 ETF는 갭이 과대해 되돌림 폭도 컸음. 표본 적음, 패턴 일반화 주의.', source: 'market-ledger 실측 예시' },
    { id: 'gap-fade', name: '갭 소진/반전', nameEn: 'Gap Fade / Reversal', idea: '갭 상승이 시간외·장중 되밀리며 갭이 축소된 흐름이 관측되는 패턴.',
      rule: '본장에서 강했으나 시간외(ext)에서 되밀려 갭이 줄어든 사례로 분류되는 흐름(사후 관찰).',
      examples: [{ date: '2026-06-03', symbol: 'SOXL', what: '본장 +5.34%였으나 시간외 −3.38%(extChgPct)로 되밀림', ledgerRef: 'us.soxl[2026-06-03]' }],
      caution: '단순 조정과 구분이 어려웠고 0%선 휩쏘가 자주 동반됨(flip-replay 참조).', source: 'market-ledger 실측 예시' },
    { id: 'panic-flush', name: '패닉 투매·변동성 폭발', nameEn: 'Volatility Flush', idea: '악재로 지수·종목이 동반 급락하며 변동성이 극단적으로 컸던 구간으로 분류되는 패턴.',
      rule: '거시·실적 쇼크로 지수·종목이 동반 급락해 변동성이 지배적이었던 날로 관측되는 흐름(사후 분류).',
      examples: [
        { date: '2026-06-05', symbol: 'SOXL', what: '본장 −30.51% 패닉(브로드컴 가이던스 쇼크 등 SOX −10.26%)', ledgerRef: 'us.soxl[2026-06-05]' },
        { date: '2026-06-08', symbol: '005930', what: '삼성 −10.18% 동반 급락(전일 미국 급락 전이)', ledgerRef: 'kospi.samsung[2026-06-08]' },
      ],
      caution: '이런 날은 방향성보다 변동성이 지배적이었음. signal-engine은 이벤트 게이트로 경고를 우선 표시.', source: 'market-ledger 실측 예시' },
    { id: 'rebound-trend', name: '낙폭 과대 반등', nameEn: 'Rebound', idea: '급락 후 강한 반등으로 방향이 되돌아온 흐름이 관측되는 패턴.',
      rule: '직전 미국 반도체 강반등 다음 한국장에서 갭업으로 이어진 사례가 관측됨(전이 관측). 단 n 작음.',
      examples: [
        { date: '2026-06-11', symbol: 'SOX', what: 'SOX +7.91% 강반등', ledgerRef: 'indices.SOX[2026-06-11]' },
        { date: '2026-06-12', symbol: '005930', what: '삼성 +7.86%(전일 미국 반등 전이 갭업)', ledgerRef: 'kospi.samsung[2026-06-12]' },
      ],
      caution: '데드캣 바운스로 되밀린 사례도 있어 추세 지속 여부는 사후에만 확인됨.', source: 'market-ledger 실측 예시' },
    { id: 'zeroline-chop', name: '제로라인 휩쏘', nameEn: 'Zero-line Chop', idea: '전일 종가(0%선) 부근에서 양전·음전을 반복해 체결 난이도가 높았던 흐름으로 분류되는 패턴.',
      rule: '0%선 근처에서 방향이 자주 뒤집혀 체결 난이도가 높았던 사례로 분류되는 흐름(사후 관찰).',
      examples: [{ date: '2026-06-02', symbol: '005930', what: '삼성 본장 양전·음전 4회 반복(flips.crossings)', ledgerRef: 'kospi.samsung[2026-06-02].flips' }],
      caution: 'flip-replay로 사후 체결 난이도를 복기할 수 있음. 휩쏘 구간은 방향 베팅의 체결이 어려웠음.', source: 'market-ledger 실측 예시' },
  ],

  /* ── 리스크 규칙 (교육용 표준 원칙) ── */
  riskRules: [
    { id: 'r-multiple', title: 'R-멀티플 사고', detail: '1R = 진입가와 손절가의 거리(1트레이드 최대 손실). 목표를 1R·2R·3R로 환산해 손익비를 사전에 고정한다.', formula: 'R = |진입가 − 손절가|, 목표가 = 진입가 ± nR', source: '표준 리스크 관리 원칙' },
    { id: 'risk-per-trade', title: '트레이드당 리스크 한도', detail: '계좌의 일정 비율(예: 0.5~1%)만 1트레이드에 위험. 수량 = (계좌×리스크%) ÷ 1R.', formula: '수량 = (계좌금액 × 리스크%) ÷ |진입가 − 손절가|', source: '표준 리스크 관리 원칙' },
    { id: 'daily-loss-limit', title: '일일 손실 한도', detail: '하루 누적 손실이 한도(예: 2R 또는 계좌 2%)에 닿으면 당일 매매 중단. 단타 파산 방지의 핵심.', source: '표준 리스크 관리 원칙' },
    { id: 'leverage-decay', title: '레버리지 ETF 괴리·복리', detail: 'SOXL/SOXS는 일일 3배. 변동성 누적 시 기초지수 대비 복리 괴리가 커져 장기보유 부적합 — 단타 한정 도구로 본다.', source: 'Direxion 펀드 개요' },
    { id: 'event-risk', title: '이벤트 리스크 회피', detail: 'FOMC·CPI·주요 실적(예: 마이크론) 발표일은 변동성 폭발 가능 — 사이즈 축소 또는 관망. signal-engine 이벤트 게이트와 연동.', source: '표준 리스크 관리 원칙' },
  ],

  /* ── 용어집 ── */
  glossary: [
    { term: '단타(데이트레이딩)', termEn: 'Day Trading', def: '당일 진입·청산으로 오버나잇 리스크를 지지 않는 매매 스타일.', source: '일반 용어' },
    { term: '갭', termEn: 'Gap', def: '전일 종가 대비 당일 시가가 벌어진 차이(%). 갭업/갭다운.', source: '일반 용어' },
    { term: '피벗 포인트', termEn: 'Pivot Point', def: '전일 고·저·종으로 계산한 당일 지지/저항 기준선(P, R1~R3, S1~S3).', source: '플로어 트레이더 피벗' },
    { term: 'ATR', termEn: 'Average True Range', def: '평균 진폭. 변동성 크기 측정. 손절폭·목표폭 설정에 활용.', source: '일반 용어' },
    { term: 'VWAP', termEn: 'Volume Weighted Average Price', def: '거래량 가중평균가. 장중 매수/매도 우위 기준선(본 데이터는 틱 부재로 미산출).', source: '일반 용어' },
    { term: 'ORB', termEn: 'Opening Range Breakout', def: '개장 초 일정 시간 고저 레인지 돌파 전략.', source: '일반 용어' },
    { term: '상대강도(RS)', termEn: 'Relative Strength', def: '개별 종목이 SMH/SOXX 등 섹터 대비 강한지 약한지. 단타 종목선정 핵심.', source: '일반 용어' },
    { term: '양전/음전', termEn: 'Zero-line cross', def: '전일 종가(0%선)를 상향/하향 돌파해 등락 부호가 바뀌는 것. 잦으면 휩쏘.', source: 'market-ledger flips 정의' },
    { term: 'HBM', termEn: 'High Bandwidth Memory', def: '고대역폭 메모리. AI 가속기 핵심 부품, 삼성·하이닉스·마이크론이 공급.', source: '일반 용어' },
    { term: '레버리지 ETF', termEn: 'Leveraged ETF', def: '기초지수 일일 변동의 배수(2x·3x)를 추종. 복리 괴리로 단타 전용.', source: 'Direxion 펀드 개요' },
  ],
};
