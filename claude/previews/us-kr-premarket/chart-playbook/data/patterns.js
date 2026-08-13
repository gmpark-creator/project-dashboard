/* Polaris Chart Playbook — 캔들 형태 도감용 합성 봉 (window.POLARIS_PATTERNS)
 *
 * ⚠ 전부 합성 데이터다. 실제 시세가 아니며 성과의 근거가 아니다.
 * 형태를 설명하기 위해 손으로 배치한 값이며, 어떤 종목·기간의 실측도 아니다.
 * bars 원소 = [시가, 고가, 저가, 종가]
 *
 * 각 레코드는 coreId로 POLARIS_CORE 엔터티를 참조한다(단일 원천).
 * dataKind:'synthetic'을 레코드마다 명시해 검증기의 수치 예외가 이 범위에만 적용되게 한다.
 */
window.POLARIS_PATTERNS = {
  meta: {
    asOf: '2026-08-13',
    dataKind: 'synthetic',
    disclaimer: '합성 · 교육용. 실제 시세가 아니며 성과의 증거가 아닙니다.',
    note: '봉 배치는 형태 설명을 위한 것이며 발생 빈도나 결과를 뜻하지 않습니다.',
  },
  patterns: [
    { coreId: 'term.hammer', dataKind: 'synthetic', bars: [[100, 101, 99.6, 100.4], [100.4, 100.7, 97.2, 100.2], [100.2, 101.4, 99.9, 101.1]] },
    { coreId: 'term.hanging-man', dataKind: 'synthetic', bars: [[100, 101.6, 99.8, 101.3], [101.3, 101.6, 98.4, 101.1], [101.1, 101.3, 99.6, 99.9]] },
    { coreId: 'term.inverted-hammer', dataKind: 'synthetic', bars: [[101, 101.2, 99.8, 100.1], [100.1, 103.1, 99.9, 100.4], [100.4, 101.6, 100.2, 101.4]] },
    { coreId: 'term.shooting-star', dataKind: 'synthetic', bars: [[100, 101.4, 99.8, 101.2], [101.2, 104.2, 101, 101.5], [101.5, 101.6, 99.9, 100.1]] },
    { coreId: 'term.doji', dataKind: 'synthetic', bars: [[100, 100.9, 99.2, 100.05], [100.05, 101.6, 98.5, 100.06], [100.06, 100.8, 99.4, 99.7]] },
    { coreId: 'term.dragonfly-doji', dataKind: 'synthetic', bars: [[100, 100.2, 99.4, 99.98], [99.98, 100.1, 97.4, 100.02], [100.02, 101, 99.8, 100.8]] },
    { coreId: 'term.gravestone-doji', dataKind: 'synthetic', bars: [[100, 100.6, 99.8, 100.02], [100.02, 102.6, 99.9, 99.98], [99.98, 100.2, 98.9, 99.1]] },
    { coreId: 'term.spinning-top', dataKind: 'synthetic', bars: [[100, 100.8, 99.4, 100.3], [100.3, 101.8, 98.9, 100.6], [100.6, 101.2, 99.9, 100.2]] },
    { coreId: 'term.marubozu', dataKind: 'synthetic', bars: [[99.5, 100.2, 99.4, 100.1], [100.1, 103.1, 100.1, 103.0], [103.0, 103.6, 102.4, 103.2]] },
    { coreId: 'term.bullish-engulfing', dataKind: 'synthetic', bars: [[101.5, 101.7, 100.4, 100.6], [100.4, 102.4, 100.2, 102.2], [102.2, 102.9, 101.8, 102.6]] },
    { coreId: 'term.bearish-engulfing', dataKind: 'synthetic', bars: [[100.6, 101.9, 100.4, 101.7], [101.9, 102.1, 100.2, 100.4], [100.4, 100.6, 99.4, 99.7]] },
    { coreId: 'term.piercing-line', dataKind: 'synthetic', bars: [[102, 102.2, 100.2, 100.4], [99.8, 101.7, 99.6, 101.5], [101.5, 102.2, 101.2, 101.9]] },
    { coreId: 'term.dark-cloud-cover', dataKind: 'synthetic', bars: [[100.4, 102.3, 100.2, 102.1], [102.7, 102.9, 100.7, 100.9], [100.9, 101.1, 99.8, 100.1]] },
    { coreId: 'term.morning-star', dataKind: 'synthetic', bars: [[102.4, 102.6, 100.2, 100.4], [100.1, 100.4, 99.6, 100.0], [100.2, 102.3, 100.1, 102.1]] },
    { coreId: 'term.evening-star', dataKind: 'synthetic', bars: [[100.2, 102.4, 100.1, 102.2], [102.5, 102.9, 102.1, 102.4], [102.3, 102.4, 100.2, 100.4]] },
    { coreId: 'term.three-white-soldiers', dataKind: 'synthetic', bars: [[100, 100.9, 99.8, 100.7], [100.7, 101.7, 100.6, 101.5], [101.5, 102.5, 101.4, 102.3]] },
    { coreId: 'term.three-black-crows', dataKind: 'synthetic', bars: [[102.3, 102.4, 101.4, 101.6], [101.6, 101.7, 100.6, 100.8], [100.8, 100.9, 99.8, 100.0]] },
    { coreId: 'term.harami', dataKind: 'synthetic', bars: [[102.4, 102.6, 100.1, 100.3], [100.8, 101.4, 100.6, 101.1], [101.1, 101.6, 100.7, 100.9]] },
    { coreId: 'term.candle-body', dataKind: 'synthetic', bars: [[100, 103.4, 97.2, 101.8]] },
  ],
};
