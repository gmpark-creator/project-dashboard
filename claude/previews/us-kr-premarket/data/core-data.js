/* Polaris Core v2 — 지식·데이터 단일 원천 (window.POLARIS_CORE)
 *
 * 2026-08-13 슬라이스 A 마이그레이션 (Codex 변증법 R1~R5 → IMPLEMENTATION GO)
 *  - 전 엔터티에 네임스페이스 안정 ID 부여(term./indicator./setup./risk./limit./claim.)
 *  - Q16 공통 스키마: label·aliases·category·scope·definition·evidenceStatus·sourceRefs·asOf·limitations·relatedIds·status
 *  - sourceRegistry 분리(자유문자열 출처 폐지) + 개별 asOf
 *  - 명령형 처방 문구 → 관찰 서술형 이관 (_lab/R3-claude-lock.md 규율)
 *  - 사실오류 정정: SOXL/SOXS 기초지수 PHLX SOX → NYSE Semiconductor Index (ICESEMIT)
 *  - legacyView(): 기존 소비자(data/data-hub.js)가 쓰는 playbook/riskRules/glossary 배열을
 *    엔터티에서 파생 생성. 소비자 무수정 통과. @deprecated — 별도 슬라이스에서 제거 예정.
 *
 * 원칙(레포 standing 준수):
 *  - 실측 OHLC가 있는 종목(measured)에만 파생통계(POLARIS_DERIVED)를 연결한다.
 *  - referenceOnly 종목은 메타데이터만. ATR/상관/베타 등 수치를 절대 부여하지 않는다(환각 방지).
 *  - 수치를 가진 항목은 sourceRefs 필수. 출처를 특정하지 못하는 관행 수치는 표시하지 않고 삭제한다.
 *  - 연구·교육 전용. 투자자문이 아니며 추천·목표가·승률·자동주문을 제공하지 않는다.
 *
 * 소비처: data/index.html(지식 브라우저), desk/, chart-playbook/.
 */
(function (root) {
  'use strict';

  /* ── 출처 레지스트리 ───────────────────────────────────────────
   * 웹 확인분은 Codex(EXEC gpt-5.6-sol) R1·R2 라운드에서 원문 대조한 것이며 accessedAt에 확인일을 둔다.
   */
  const SOURCE_REGISTRY = [
    { id: 'src.direxion-index-change-2021', publisher: 'Direxion', title: 'Direxion Changes Index for Semiconductor ETFs', url: 'https://www.direxion.com/uploads/Direxion-Changes-Index-for-Semiconductor-ETFs.pdf', publishedAt: '2021-06-21', accessedAt: '2026-08-13', locator: '기초지수 PHLX → ICE Semiconductor Index 변경 공지(효력 2021-08-25 개장)', verifiedBy: 'Codex EXEC gpt-5.6-sol R2' },
    { id: 'src.nysearca-rb-21-075', publisher: 'NYSE Arca', title: 'NYSE Arca Equities Regulatory Bulletin RB-21-075', url: 'https://www.nyse.com/publicdocs/nyse/markets/nyse-arca/rule-interpretations/2021/NYSE%20Arca%20Equities%20RB-21-075.pdf', publishedAt: '2021-08', accessedAt: '2026-08-13', locator: '기초지수 변경 효력 확인', verifiedBy: 'Codex EXEC gpt-5.6-sol R2' },
    { id: 'src.ice-index-name-change-2023', publisher: 'ICE Data Indices', title: 'ICEBIO / ICESEMI Index Name Changes', url: 'https://www.ice.com/publicdocs/ice/notifications/adhoc/110000725074/ICEBIO_ICESEMI_Index_Name_Changes_20231013.pdf', publishedAt: '2023-10-13', accessedAt: '2026-08-13', locator: 'ICE Semiconductor Index → NYSE Semiconductor Index 명칭 변경(효력 2023-11-03, 심볼 불변)', verifiedBy: 'Codex EXEC gpt-5.6-sol R2' },
    { id: 'src.direxion-497-2023', publisher: 'U.S. SEC (EDGAR)', title: 'Direxion Shares ETF Trust — 497 Supplement', url: 'https://www.sec.gov/Archives/edgar/data/1424958/000119312523269546/d573704d497.htm', publishedAt: '2023-10', accessedAt: '2026-08-13', locator: '지수 명칭 변경 보충서', verifiedBy: 'Codex EXEC gpt-5.6-sol R2' },
    { id: 'src.direxion-soxl-soxs-product', publisher: 'Direxion', title: 'Daily Semiconductor Bull & Bear 3X ETFs', url: 'https://www.direxion.com/product/daily-semiconductor-bull-bear-3x-etfs', publishedAt: null, accessedAt: '2026-08-13', locator: '상품 개요 · 일일 목표 · 하루 초과 누적수익의 배수 괴리 고지', verifiedBy: 'Codex EXEC gpt-5.6-sol R1·R2' },
    { id: 'src.direxion-soxl-soxs-factsheet', publisher: 'Direxion', title: 'SOXL / SOXS Fact Sheet', url: 'https://www.direxion.com/uploads/SOXL-SOXS-Fact-Sheet.pdf', publishedAt: null, accessedAt: '2026-08-13', locator: 'Bloomberg Index Symbol = ICESEMIT', verifiedBy: 'Codex EXEC gpt-5.6-sol R2' },
    { id: 'src.krx-listing', publisher: '한국거래소(KRX)', title: '상장종목 코드(공개정보)', url: null, publishedAt: null, accessedAt: '2026-06-15', locator: '종목코드·종목명' },
    { id: 'src.tradingview-symbols', publisher: 'TradingView', title: '심볼 표기(공개)', url: null, publishedAt: null, accessedAt: '2026-06-15', locator: 'tvSymbol 표기 규칙' },
    { id: 'src.polaris-market-ledger', publisher: 'Polaris Market Intelligence', title: 'market-ledger — 2026년 6월 실측·이중검증 OHLC', url: null, publishedAt: '2026-06-15', accessedAt: '2026-06-15', locator: 'us-kr-premarket/market-ledger/data.js' },
    { id: 'src.polaris-flip-definition', publisher: 'Polaris Market Intelligence', title: 'market-ledger flips 정의', url: null, publishedAt: '2026-06-15', accessedAt: '2026-06-15', locator: '0%선 교차 카운트 정의' },
  ];

  /* ── 엔터티 (단일 원천) ─────────────────────────────────────── */
  const ENTITIES = [

    /* ---- 용어·지표 (legacySlot: glossary) ---- */
    {
      id: 'term.day-trading', kind: 'term', legacySlot: 'glossary',
      label: { ko: '단타(데이트레이딩)', en: 'Day Trading' },
      aliases: ['데이트레이딩', '인트라데이'], category: '스타일',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m', '15m', '60m'], sessions: ['regular'] },
      definition: '당일 진입·청산으로 정규장 종가를 넘기지 않아 오버나잇 보유 위험을 지지 않는 매매 스타일.',
      evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['보유기간의 경계에는 업계 통일 정의가 없다. 이 값은 Polaris 운영 분류다.'],
      relatedIds: ['term.leveraged-etf'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'term.gap', kind: 'term', legacySlot: 'glossary',
      label: { ko: '갭', en: 'Gap' },
      aliases: ['갭업', '갭다운'], category: '가격 구조',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['intraday', 'overnight', 'swing'], timeframes: ['1d'], sessions: ['regular'] },
      definition: '전일 종가 대비 당일 시가가 벌어진 차이(%). 시가가 위면 갭업, 아래면 갭다운.',
      evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['기준 종가를 정규장 종가로 볼지 시간외 마지막 체결가로 볼지에 따라 값이 달라진다. 이 자료는 정규장 종가 기준이다.'],
      relatedIds: ['setup.gap-and-go', 'setup.gap-fade'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'indicator.pivot-point', kind: 'indicator', legacySlot: 'glossary',
      label: { ko: '피벗 포인트', en: 'Pivot Point' },
      aliases: ['플로어 피벗'], category: '레벨',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m', '15m'], sessions: ['regular'] },
      definition: '전일 고·저·종가로 계산한 당일 기준선(P)과 그 위아래 파생 레벨(R1~R3, S1~S3).',
      observationSpec: { inputs: ['전일 고가', '전일 저가', '전일 종가'], formula: 'P = (H + L + C) / 3 · R1 = 2P − L · S1 = 2P − H', unit: '가격', window: '전일 1거래일', timeframe: '1d 입력 → 당일 적용', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['레벨이 계산된다는 것과 그 레벨에서 가격이 반응한다는 것은 별개다. 이 자료에는 반응률 검증이 없다.'],
      relatedIds: ['indicator.atr'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'indicator.atr', kind: 'indicator', legacySlot: 'glossary',
      label: { ko: 'ATR', en: 'Average True Range' },
      aliases: ['평균 진폭', '평균 실질 범위'], category: '변동성',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday', 'overnight', 'swing'], timeframes: ['5m', '15m', '60m', '1d'], sessions: ['regular'] },
      definition: '한 봉의 실질 범위(True Range)를 일정 기간 평균한 변동성 크기. 종목·봉·상품이 달라도 변동폭을 같은 단위로 비교할 수 있게 한다.',
      observationSpec: { inputs: ['고가', '저가', '전봉 종가'], formula: 'TR = max(H−L, |H−C_prev|, |L−C_prev|) · ATR(n) = TR의 n봉 평균', unit: '가격(또는 종가 대비 %)', window: 'n = 14봉', timeframe: '사용 봉을 반드시 병기', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['ATR은 변동성의 크기만 나타내며 방향·진입 신호가 아니다.', '사용한 봉과 세션을 병기하지 않은 ATR 값은 서로 비교할 수 없다.'],
      relatedIds: ['risk.r-multiple'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'indicator.session-vwap', kind: 'indicator', legacySlot: 'glossary',
      label: { ko: 'VWAP(세션)', en: 'Volume Weighted Average Price' },
      aliases: ['거래량 가중평균가'], category: '기준선',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m', '15m'], sessions: ['regular'] },
      definition: '당일 세션 시작부터 누적된 거래량 가중평균가. 세션이 바뀌면 초기화되므로 하루를 넘는 구간에는 그대로 쓰이지 않는다.',
      observationSpec: { inputs: ['체결가', '체결량'], formula: 'VWAP = Σ(가격 × 거래량) / Σ거래량 (세션 시작부터 누적)', unit: '가격', window: '세션 시작~현재', timeframe: '틱 또는 분봉', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['본 프로젝트의 6월 실측 데이터는 틱이 없어 VWAP을 산출하지 않았다.', '주·월·실적 등 다른 앵커를 쓰는 앵커드 VWAP은 별개 도구다.'],
      relatedIds: ['indicator.atr'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'term.orb', kind: 'term', legacySlot: 'glossary',
      label: { ko: 'ORB(개장 레인지 돌파)', en: 'Opening Range Breakout' },
      aliases: ['오프닝 레인지'], category: '셋업 용어',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m', '15m'], sessions: ['regular'] },
      definition: '개장 직후 일정 시간 동안 형성된 고가·저가 범위를 이후에 벗어나는 움직임을 가리키는 용어.',
      evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['레인지 형성 시간(몇 분)과 확인 조건에 검증된 표준값은 이 자료에 없다.'],
      relatedIds: ['term.gap'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'indicator.relative-strength', kind: 'indicator', legacySlot: 'glossary',
      label: { ko: '상대강도(RS)', en: 'Relative Strength' },
      aliases: ['섹터 대비 강도'], category: '비교',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['intraday', 'overnight', 'swing'], timeframes: ['1d'], sessions: ['regular'] },
      definition: '같은 기간 개별 종목의 수익률을 섹터·광역지수 수익률과 비교해 상대적 강약을 보는 관측치.',
      observationSpec: { inputs: ['종목 종가', '섹터 프록시 종가', '광역지수 종가'], formula: 'r_x = P_x[t]/P_x[t−n] − 1 · RS = (1+r_종목)/(1+r_비교집단) − 1', unit: '비율', window: 'n = 20거래일(보조 60거래일)', timeframe: '1d', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['세 시계열의 거래일 캘린더가 완전히 일치해야 하며, 결측이 하나라도 있으면 산출할 수 없다.', '거래 캘린더가 다른 시장 간(예: 한국과 미국) 비교에는 쓰지 않는다.'],
      relatedIds: ['indicator.atr'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'term.zero-line-cross', kind: 'term', legacySlot: 'glossary',
      label: { ko: '양전/음전', en: 'Zero-line Cross' },
      aliases: ['제로라인 교차'], category: '가격 구조',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m'], sessions: ['regular'] },
      definition: '전일 종가(0%선)를 위아래로 통과해 당일 등락 부호가 바뀌는 것. 반복이 잦은 구간을 휩쏘라 부른다.',
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-flip-definition'], asOf: '2026-06-15',
      limitations: ['교차 횟수는 사후에 세는 값이며 장중 실시간 판정과 다르다.'],
      relatedIds: ['setup.zeroline-chop'], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'term.hbm', kind: 'term', legacySlot: 'glossary',
      label: { ko: 'HBM', en: 'High Bandwidth Memory' },
      aliases: ['고대역폭 메모리'], category: '산업',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity'], styles: [], timeframes: [], sessions: [] },
      definition: '적층 구조로 대역폭을 높인 메모리. AI 가속기의 핵심 부품이며 삼성전자·SK하이닉스·마이크론이 공급한다.',
      evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-06-15',
      limitations: ['산업 배경 설명이며 개별 종목의 밸류에이션 판단을 담지 않는다.'],
      relatedIds: [], status: 'active', replacementId: null, legacyId: null,
    },
    {
      id: 'term.leveraged-etf', kind: 'term', legacySlot: 'glossary',
      label: { ko: '레버리지 ETF', en: 'Leveraged ETF' },
      aliases: ['인버스 레버리지', '3배 ETF'], category: '상품 구조',
      scope: { markets: ['US'], instrumentTypes: ['leveragedEtf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m', '15m', '1d'], sessions: ['regular', 'extended'] },
      definition: '기초지수의 일일 변동에 배수(2x·3x 등)를 적용하는 것을 하루 단위 목표로 삼는 상품. 하루를 넘는 기간의 누적 수익은 기초지수 누적 변동의 같은 배수와 달라질 수 있다.',
      evidenceStatus: 'official', sourceRefs: ['src.direxion-soxl-soxs-product'], asOf: '2026-08-13',
      limitations: ['다일 구조 해석·기초지수 대비 누적 비교·장기 가격 레벨 해석에는 별도 경고가 필요하다.', '역분할이 있었던 상품은 과거 가격 레벨이 현재와 직접 비교되지 않는다.'],
      relatedIds: ['risk.leverage-daily-reset'], status: 'active', replacementId: null, legacyId: null,
    },

    /* ---- 플레이북 패턴 (legacySlot: playbook · 사후 관찰 기록) ---- */
    {
      id: 'setup.gap-and-go', kind: 'setup', legacySlot: 'playbook', legacyId: 'gap-and-go',
      label: { ko: '갭앤고', en: 'Gap-and-Go' },
      aliases: [], category: '갭',
      scope: { markets: ['US', 'KR'], instrumentTypes: ['etf', 'equity'], styles: ['intraday'], timeframes: ['5m', '15m'], sessions: ['regular'] },
      definition: '큰 갭 상승 후 시가 부근을 유지하며 같은 방향으로 이어진 흐름이 관측되는 패턴.',
      setupSpec: {
        idea: '큰 갭 상승 후 시가 부근을 유지하며 같은 방향으로 이어진 흐름이 관측되는 패턴.',
        rule: '오버나잇 미국 강세로 갭업한 뒤 시가 부근을 지키며 한 방향으로 이어진 사례로 분류되는 흐름(사후 관찰).',
        examples: [{ date: '2026-06-02', symbol: 'SOXL', what: '본장 +17.31%(regChgPct) 강한 추세일 — 갭업 후 지속', ledgerRef: 'us.soxl[2026-06-02]' }],
        caution: '레버리지 ETF는 갭이 과대해 되돌림 폭도 컸음. 표본 적음, 패턴 일반화 주의.',
      },
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger'], asOf: '2026-06-15',
      limitations: ['2026년 6월 소표본 관찰 기록이며 일반 종목의 판정 기준이 아니다.'],
      relatedIds: ['term.gap', 'setup.gap-fade'], status: 'active', replacementId: null,
    },
    {
      id: 'setup.gap-fade', kind: 'setup', legacySlot: 'playbook', legacyId: 'gap-fade',
      label: { ko: '갭 소진/반전', en: 'Gap Fade / Reversal' },
      aliases: [], category: '갭',
      scope: { markets: ['US'], instrumentTypes: ['etf'], styles: ['intraday'], timeframes: ['5m', '15m'], sessions: ['regular', 'extended'] },
      definition: '갭 상승이 시간외·장중 되밀리며 갭이 축소된 흐름이 관측되는 패턴.',
      setupSpec: {
        idea: '갭 상승이 시간외·장중 되밀리며 갭이 축소된 흐름이 관측되는 패턴.',
        rule: '본장에서 강했으나 시간외(ext)에서 되밀려 갭이 줄어든 사례로 분류되는 흐름(사후 관찰).',
        examples: [{ date: '2026-06-03', symbol: 'SOXL', what: '본장 +5.34%였으나 시간외 −3.38%(extChgPct)로 되밀림', ledgerRef: 'us.soxl[2026-06-03]' }],
        caution: '단순 조정과 구분이 어려웠고 0%선 휩쏘가 자주 동반됨(flip-replay 참조).',
      },
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger'], asOf: '2026-06-15',
      limitations: ['2026년 6월 소표본 관찰 기록이며 갭이 채워진다는 기대의 근거가 아니다.'],
      relatedIds: ['term.gap', 'setup.gap-and-go'], status: 'active', replacementId: null,
    },
    {
      id: 'setup.panic-flush', kind: 'setup', legacySlot: 'playbook', legacyId: 'panic-flush',
      label: { ko: '패닉 투매·변동성 폭발', en: 'Volatility Flush' },
      aliases: [], category: '변동성',
      scope: { markets: ['US', 'KR'], instrumentTypes: ['etf', 'equity'], styles: ['intraday'], timeframes: ['5m', '15m', '1d'], sessions: ['regular'] },
      definition: '악재로 지수·종목이 동반 급락하며 변동성이 극단적으로 컸던 구간으로 분류되는 패턴.',
      setupSpec: {
        idea: '악재로 지수·종목이 동반 급락하며 변동성이 극단적으로 컸던 구간으로 분류되는 패턴.',
        rule: '거시·실적 쇼크로 지수·종목이 동반 급락해 변동성이 지배적이었던 날로 관측되는 흐름(사후 분류).',
        examples: [
          { date: '2026-06-05', symbol: 'SOXL', what: '본장 −30.51% 패닉(브로드컴 가이던스 쇼크 등 SOX −10.26%)', ledgerRef: 'us.soxl[2026-06-05]' },
          { date: '2026-06-08', symbol: '005930', what: '삼성 −10.18% 동반 급락(전일 미국 급락 전이)', ledgerRef: 'kospi.samsung[2026-06-08]' },
        ],
        caution: '이런 날은 방향성보다 변동성이 지배적이었음. signal-engine은 이벤트 게이트로 경고를 우선 표시.',
      },
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger'], asOf: '2026-06-15',
      limitations: ['2026년 6월 소표본 관찰 기록이다.'],
      relatedIds: ['risk.event-volatility'], status: 'active', replacementId: null,
    },
    {
      id: 'setup.rebound-trend', kind: 'setup', legacySlot: 'playbook', legacyId: 'rebound-trend',
      label: { ko: '낙폭 과대 반등', en: 'Rebound' },
      aliases: [], category: '추세',
      scope: { markets: ['US', 'KR'], instrumentTypes: ['etf', 'equity', 'index'], styles: ['intraday', 'overnight'], timeframes: ['1d'], sessions: ['regular'] },
      definition: '급락 후 강한 반등으로 방향이 되돌아온 흐름이 관측되는 패턴.',
      setupSpec: {
        idea: '급락 후 강한 반등으로 방향이 되돌아온 흐름이 관측되는 패턴.',
        rule: '직전 미국 반도체 강반등 다음 한국장에서 갭업으로 이어진 사례가 관측됨(전이 관측). 단 n 작음.',
        examples: [
          { date: '2026-06-11', symbol: 'SOX', what: 'SOX +7.91% 강반등', ledgerRef: 'indices.SOX[2026-06-11]' },
          { date: '2026-06-12', symbol: '005930', what: '삼성 +7.86%(전일 미국 반등 전이 갭업)', ledgerRef: 'kospi.samsung[2026-06-12]' },
        ],
        caution: '데드캣 바운스로 되밀린 사례도 있어 추세 지속 여부는 사후에만 확인됨.',
      },
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger'], asOf: '2026-06-15',
      limitations: ['표본이 작아(n=10 수준) 전이 관계를 일반화할 수 없다.'],
      relatedIds: ['setup.panic-flush'], status: 'active', replacementId: null,
    },
    {
      id: 'setup.zeroline-chop', kind: 'setup', legacySlot: 'playbook', legacyId: 'zeroline-chop',
      label: { ko: '제로라인 휩쏘', en: 'Zero-line Chop' },
      aliases: [], category: '체결 난이도',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: ['1m', '5m'], sessions: ['regular'] },
      definition: '전일 종가(0%선) 부근에서 양전·음전을 반복해 체결 난이도가 높았던 흐름으로 분류되는 패턴.',
      setupSpec: {
        idea: '전일 종가(0%선) 부근에서 양전·음전을 반복해 체결 난이도가 높았던 흐름으로 분류되는 패턴.',
        rule: '0%선 근처에서 방향이 자주 뒤집혀 체결 난이도가 높았던 사례로 분류되는 흐름(사후 관찰).',
        examples: [{ date: '2026-06-02', symbol: '005930', what: '삼성 본장 양전·음전 4회 반복(flips.crossings)', ledgerRef: 'kospi.samsung[2026-06-02].flips' }],
        caution: 'flip-replay로 사후 체결 난이도를 복기할 수 있음. 휩쏘 구간은 방향 베팅의 체결이 어려웠음.',
      },
      evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger', 'src.polaris-flip-definition'], asOf: '2026-06-15',
      limitations: ['교차 횟수는 사후 집계이며 장중 실시간 판정과 다르다.'],
      relatedIds: ['term.zero-line-cross'], status: 'active', replacementId: null,
    },

    /* ---- 리스크 개념 (legacySlot: riskRules · 2026-08-13 관찰 서술형 이관) ---- */
    {
      id: 'risk.r-multiple', kind: 'risk', legacySlot: 'riskRules', legacyId: 'r-multiple',
      label: { ko: 'R-멀티플 표기', en: 'R-Multiple Notation' },
      aliases: ['1R', 'R 단위'], category: '척도',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday', 'overnight', 'swing'], timeframes: [], sessions: [] },
      definition: 'R은 진입가와 손절가의 거리를 1단위로 삼는 표기 방식이다. 가격 목표를 R의 배수로 환산하면 가격대가 다른 종목들의 손익비를 같은 척도에서 비교할 수 있다.',
      observationSpec: { inputs: ['진입가', '손절가'], formula: 'R = |진입가 − 손절가| · nR 지점 = 진입가 ± n × R', unit: '가격', window: '단일 트레이드', timeframe: '해당 트레이드의 봉', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-08-13',
      limitations: ['R 배수를 몇으로 두는지에 대한 검증된 표준값은 이 자료에 없다.', 'R 표기는 비교를 위한 척도이며 목표·청산 정책이 아니다.'],
      relatedIds: ['indicator.atr', 'risk.risk-per-trade'], status: 'active', replacementId: null,
    },
    {
      id: 'risk.risk-per-trade', kind: 'risk', legacySlot: 'riskRules', legacyId: 'risk-per-trade',
      label: { ko: '트레이드당 감내 손실', en: 'Risk per Trade' },
      aliases: ['포지션 사이징'], category: '척도',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday', 'overnight', 'swing'], timeframes: [], sessions: [] },
      definition: '한 번의 매매에서 감내할 손실 금액을 계좌 금액의 비율로 미리 정의하는 방식. 감내 손실액을 1R로 나누면 수량이 산출된다.',
      observationSpec: { inputs: ['계좌금액', '감내비율', '진입가', '손절가'], formula: '수량 = (계좌금액 × 감내비율) ÷ |진입가 − 손절가|', unit: '주(계약) 수', window: '단일 트레이드', timeframe: '해당 트레이드의 봉', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-08-13',
      limitations: ['감내비율의 구체적 수치는 원출처를 특정하지 못해 이 자료에서 제시하지 않는다.', '산식은 산술 관계일 뿐이며 어떤 비율이 적절한지를 말하지 않는다.'],
      relatedIds: ['risk.r-multiple'], status: 'active', replacementId: null,
    },
    {
      id: 'risk.daily-loss-limit', kind: 'risk', legacySlot: 'riskRules', legacyId: 'daily-loss-limit',
      label: { ko: '일일 손실 한도', en: 'Daily Loss Limit' },
      aliases: [], category: '운용 규율',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday'], timeframes: [], sessions: ['regular'] },
      definition: '하루 누적 손실의 상한을 미리 정해 두고, 그 상한에 닿으면 그날 더 이상 신규 포지션을 열지 않는 운용 방식을 가리키는 용어.',
      parameters: [], evidenceStatus: 'polaris-convention', sourceRefs: [], asOf: '2026-08-13',
      limitations: ['한도 수치의 검증된 표준값은 이 자료에 없다.', '이 항목은 용어 설명이며 특정 운용을 권하지 않는다.'],
      relatedIds: ['risk.risk-per-trade'], status: 'active', replacementId: null,
    },
    {
      id: 'risk.leverage-daily-reset', kind: 'risk', legacySlot: 'riskRules', legacyId: 'leverage-decay',
      label: { ko: '레버리지 ETF 일일 재설정과 경로 의존', en: 'Leveraged ETF Daily Reset & Path Dependency' },
      aliases: ['복리 괴리'], category: '상품 구조',
      scope: { markets: ['US'], instrumentTypes: ['leveragedEtf'], styles: ['scalping', 'intraday'], timeframes: ['1d'], sessions: ['regular'] },
      definition: 'SOXL·SOXS는 기초지수 일일 변동의 3배를 하루 단위 목표로 삼는다. 하루를 넘는 기간의 누적 수익은 기초지수 누적 변동의 3배와 달라질 수 있고, 등락이 반복되는 경로일수록 그 차이가 커지는 경로 의존성이 나타난다.',
      observationSpec: { inputs: ['기초지수 일별 수익률'], formula: '누적배수수익 = Π(1 + 3 × r_i) − 1 (일별 재설정) ≠ 3 × (Π(1 + r_i) − 1)', unit: '비율', window: '보유 일수', timeframe: '1d', session: 'regular', adjustment: 'adjusted' },
      parameters: [], evidenceStatus: 'official', sourceRefs: ['src.direxion-soxl-soxs-product', 'src.direxion-soxl-soxs-factsheet'], asOf: '2026-08-13',
      limitations: ['다일 구조 해석·기초지수 대비 누적 비교·장기 가격 레벨 해석에는 별도 경고가 필요하다.', '역분할 이력이 있으면 과거 가격 레벨이 현재와 직접 비교되지 않는다.'],
      relatedIds: ['term.leveraged-etf'], status: 'active', replacementId: null,
    },
    {
      id: 'risk.event-volatility', kind: 'risk', legacySlot: 'riskRules', legacyId: 'event-risk',
      label: { ko: '예정 이벤트와 변동성 확대', en: 'Scheduled Event Volatility' },
      aliases: ['이벤트 게이트'], category: '이벤트',
      scope: { markets: ['KR', 'US'], instrumentTypes: ['equity', 'etf'], styles: ['scalping', 'intraday', 'overnight', 'swing'], timeframes: ['1d'], sessions: ['regular'] },
      definition: '통화정책·물가·고용 발표일과 주요 실적 발표일에는 변동성이 확대되는 경향이 관측된다. signal-engine의 이벤트 게이트가 이 날짜들을 하드 게이트로 표시한다.',
      parameters: [], evidenceStatus: 'measured', sourceRefs: ['src.polaris-market-ledger'], asOf: '2026-08-13',
      limitations: ['어떤 대응이 적절한지는 이 자료가 제시하지 않는다.', '2026년 6월 소표본 관찰이다.'],
      relatedIds: ['setup.panic-flush'], status: 'active', replacementId: null,
    },
  ];

  /* ── 유니버스 ───────────────────────────────────────────────
   * measured: LEDGER에 실측 OHLC가 있어 파생통계 연결 가능(derivedKey로 POLARIS_DERIVED.perSymbol 참조).
   * referenceOnly: 메타데이터만. 파생통계 없음.
   */
  const UNIVERSE = {
    measured: [
      { ticker: '005930', name: '삼성전자', market: 'KR', code: '005930', role: '메모리/종합 반도체(IDM)', theme: 'KOSPI 반도체', tvSymbol: 'KRX:005930', derivedKey: 'SAMSUNG', source: 'KRX·market-ledger', sourceRefs: ['src.krx-listing', 'src.polaris-market-ledger'], note: 'DRAM·NAND·파운드리·시스템LSI. 코스피 시총 1위, 외국인·기관 수급 핵심.' },
      { ticker: '000660', name: 'SK하이닉스', market: 'KR', code: '000660', role: '메모리(DRAM·HBM·NAND)', theme: 'KOSPI 반도체', tvSymbol: 'KRX:000660', derivedKey: 'HYNIX', source: 'KRX·market-ledger', sourceRefs: ['src.krx-listing', 'src.polaris-market-ledger'], note: 'HBM(고대역폭메모리) 선두. AI 메모리 사이클의 한국 대표 베타.' },
      {
        ticker: 'SOXL', name: 'Direxion 데일리 반도체 강세 3X', market: 'US',
        role: 'ETF · NYSE Semiconductor Index(ICESEMIT) 일일 3배 롱(레버리지)',
        theme: '미국 반도체 ETF', tvSymbol: 'AMEX:SOXL', leverage: 3, derivedKey: 'SOXL',
        source: 'Direxion·market-ledger', sourceRefs: ['src.direxion-soxl-soxs-product', 'src.direxion-soxl-soxs-factsheet', 'src.polaris-market-ledger'],
        indexRef: { name: 'NYSE Semiconductor Index', bloombergSymbol: 'ICESEMIT', history: ['2021-08-25 개장부터 PHLX Semiconductor Sector Index → ICE Semiconductor Index로 기초지수 교체(발표 2021-06-21)', '2023-11-03 ICE Semiconductor Index → NYSE Semiconductor Index 명칭 변경(심볼 불변, 지수 교체 아님)'] },
        note: '기초지수 일일 변동의 +3배를 하루 단위 목표로 한다. 하루를 넘는 누적 수익은 기초지수 누적 변동의 3배와 달라질 수 있다(경로 의존).',
      },
      {
        ticker: 'SOXS', name: 'Direxion 데일리 반도체 약세 3X', market: 'US',
        role: 'ETF · NYSE Semiconductor Index(ICESEMIT) 일일 3배 숏(인버스 레버리지)',
        theme: '미국 반도체 ETF', tvSymbol: 'AMEX:SOXS', leverage: -3, derivedKey: 'SOXS',
        source: 'Direxion·market-ledger', sourceRefs: ['src.direxion-soxl-soxs-product', 'src.direxion-soxl-soxs-factsheet', 'src.polaris-market-ledger'],
        indexRef: { name: 'NYSE Semiconductor Index', bloombergSymbol: 'ICESEMIT', history: ['2021-08-25 개장부터 PHLX Semiconductor Sector Index → ICE Semiconductor Index로 기초지수 교체(발표 2021-06-21)', '2023-11-03 ICE Semiconductor Index → NYSE Semiconductor Index 명칭 변경(심볼 불변, 지수 교체 아님)'] },
        note: 'SOXL의 역방향(6월 실측 상관 −1.0). 기초지수 일일 변동의 −3배를 하루 단위 목표로 한다.',
      },
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
        { ticker: 'SOX', name: 'PHLX 반도체지수', market: 'US', role: '필라델피아 반도체지수(PHLX SOX) — 비교용 섹터 지수. SOXL/SOXS의 현재 기초지수가 아님(2021-08-25 ICE 지수로 교체)', tvSymbol: 'NASDAQ:SOX' },
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
  };

  /* ── 레거시 ID 매핑 (구 term 문자열 / 구 playbook·riskRules id → 새 네임스페이스 ID) ── */
  const LEGACY_ID_MAP = {
    '단타(데이트레이딩)': 'term.day-trading',
    '갭': 'term.gap',
    '피벗 포인트': 'indicator.pivot-point',
    'ATR': 'indicator.atr',
    'VWAP': 'indicator.session-vwap',
    'ORB': 'term.orb',
    '상대강도(RS)': 'indicator.relative-strength',
    '양전/음전': 'term.zero-line-cross',
    'HBM': 'term.hbm',
    '레버리지 ETF': 'term.leveraged-etf',
    'gap-and-go': 'setup.gap-and-go',
    'gap-fade': 'setup.gap-fade',
    'panic-flush': 'setup.panic-flush',
    'rebound-trend': 'setup.rebound-trend',
    'zeroline-chop': 'setup.zeroline-chop',
    'r-multiple': 'risk.r-multiple',
    'risk-per-trade': 'risk.risk-per-trade',
    'daily-loss-limit': 'risk.daily-loss-limit',
    'leverage-decay': 'risk.leverage-daily-reset',
    'event-risk': 'risk.event-volatility',
  };

  const META = {
    asOf: '2026-08-13',
    dataAsOf: '2026-06-15',
    version: '2.0.0',
    schemaVersion: '2.0.0',
    builtBy: 'Claude(Opus 5) Thesis + Codex(gpt-5.6-sol, EXEC xhigh) Antithesis 변증법 R1~R5 → IMPLEMENTATION GO',
    disclaimer: '연구·교육용 참고 자료입니다. 투자자문이 아니며 매매 결정·결과의 책임은 이용자 본인에게 있습니다. 추천·목표가·승률을 제공하지 않고 자동주문을 사용하지 않습니다. 종목코드·티커·역할은 공개정보 기반이나 거래 전 원출처(거래소·증권사)에서 반드시 재확인하세요.',
    scopeNotice: '2026-08-13 정정: 이 코어는 종목 중립 프레임을 지향합니다. 6월 실측 기록(market-ledger 연동 항목)은 반도체·소표본 레거시 슬라이스이며 신규 종목 판정의 일반 임계값이 아닙니다.',
    sources: [
      'KRX 한국거래소 상장종목 코드(공개)',
      'TradingView 심볼 표기(공개)',
      'Direxion SOXL/SOXS 펀드 개요(일일 3배 목표 · 기초지수 NYSE Semiconductor Index, Bloomberg 심볼 ICESEMIT)',
      'us-kr-premarket/market-ledger/data.js — 6월 실측·이중검증 OHLC',
    ],
  };

  /* ── 파생: 레거시 호환 뷰 (@deprecated) ────────────────────────
   * data/data-hub.js가 소비하는 playbook/riskRules/glossary 배열을 엔터티에서 생성한다.
   * 단일 원천 유지를 위해 여기서 복제 저장하지 않고 매번 파생한다.
   */
  const srcById = SOURCE_REGISTRY.reduce(function (m, s) { m[s.id] = s; return m; }, {});
  function legacySourceText(e) {
    if (!e.sourceRefs || !e.sourceRefs.length) return '일반 용어';
    return e.sourceRefs.map(function (id) { return (srcById[id] && srcById[id].publisher) || id; }).join('·');
  }
  function legacyView(entities) {
    const bySlot = function (slot) { return entities.filter(function (e) { return e.legacySlot === slot && e.status === 'active'; }); };
    return {
      playbook: bySlot('playbook').map(function (e) {
        return {
          id: e.legacyId, name: e.label.ko, nameEn: e.label.en,
          idea: e.setupSpec.idea, rule: e.setupSpec.rule,
          examples: e.setupSpec.examples, caution: e.setupSpec.caution,
          source: legacySourceText(e), coreId: e.id,
        };
      }),
      riskRules: bySlot('riskRules').map(function (e) {
        return {
          id: e.legacyId, title: e.label.ko, detail: e.definition,
          formula: (e.observationSpec && e.observationSpec.formula) || undefined,
          source: legacySourceText(e), coreId: e.id,
        };
      }),
      glossary: bySlot('glossary').map(function (e) {
        return { term: e.label.ko, termEn: e.label.en, def: e.definition, source: legacySourceText(e), coreId: e.id };
      }),
    };
  }

  const byId = ENTITIES.reduce(function (m, e) { m[e.id] = e; return m; }, {});

  root.POLARIS_CORE = Object.assign({
    meta: META,
    schemaVersion: META.schemaVersion,
    sourceRegistry: SOURCE_REGISTRY,
    entities: ENTITIES,
    universe: UNIVERSE,
    legacyIdMap: LEGACY_ID_MAP,
    byId: byId,
    /* fail-closed 해석기: 미해석 ID는 null을 반환한다(별칭·제목 추측 금지, 로컬 정의 폴백 금지). */
    resolve: function (id) { return Object.prototype.hasOwnProperty.call(byId, id) ? byId[id] : null; },
    resolveLegacy: function (legacyKey) {
      const mapped = Object.prototype.hasOwnProperty.call(LEGACY_ID_MAP, legacyKey) ? LEGACY_ID_MAP[legacyKey] : null;
      return mapped ? (byId[mapped] || null) : null;
    },
    source: function (id) { return Object.prototype.hasOwnProperty.call(srcById, id) ? srcById[id] : null; },
  }, legacyView(ENTITIES));
})(window);
