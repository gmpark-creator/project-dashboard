/* Polaris Chart Playbook — 종목-스타일 구조적 마찰 관측기 (window.POLARIS_SUITABILITY)
 *
 * 무엇을 하는가: 이용자가 직접 관측해 입력한 값들 사이의 산술 관계만 계산한다.
 * 무엇을 하지 않는가:
 *  - 종목을 추천하지 않는다. 매수·매도 의견을 내지 않는다.
 *  - 밸류에이션·목표가·승률을 다루지 않는다.
 *  - 「낮음/높음」 같은 범주 판정을 하지 않는다. 임계값을 두지 않기로 했으므로
 *    출력은 관측값과 `산출 완료 / 부분 산출 / 산출 불가` 상태까지다.
 *  - 손절 가격을 정해 주지 않는다. 계획 손실거리는 이용자가 직접 입력하는 값이다.
 *
 * 2026-08-13 사후검수 반영:
 *  - 입력 검증 전면 추가(ISO 날짜·양수·유한수·호가 정렬·교차 호가·틱 정합·RS 분모).
 *    잘못된 입력은 해당 축을 `산출 불가`로 전파하며 어떤 경우에도 NaN을 반환하지 않는다.
 *  - A9에 `quoteSnapshotAt`·`tickSize`를 필수 입력으로 추가.
 *  - 데이터 완전성 레벨(L1/L2/L3)을 산출 상태와 분리해 함께 낸다.
 *  - dataKind(synthetic|measuredHistorical|userProvided)를 호출자가 넘기며 기본은 synthetic이다.
 */
(function (root) {
  'use strict';

  var STATUS = { DONE: '산출 완료', PARTIAL: '부분 산출', NONE: '산출 불가' };
  var AX = { OK: '산출', NONE: '산출 불가', OFF: '비활성 · 상품 구조' };
  var LEVEL = { L1: 'L1 · 입력 없음(합성 시연)', L2: 'L2 · 부분 입력', L3: 'L3 · 완전 입력' };
  var KINDS = { synthetic: '합성 · 교육용', measuredHistorical: '실측 과거', userProvided: '사용자 입력' };

  /* ── 입력 검증 원자 ── */
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function isPos(v) { return isNum(v) && v > 0; }
  function isIsoDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var p = s.split('-').map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return d.getUTCFullYear() === p[0] && d.getUTCMonth() === p[1] - 1 && d.getUTCDate() === p[2];
  }
  /* 호가 스냅샷은 「시각」이므로 시간대가 포함된 완전한 ISO datetime만 받는다.
   * 날짜만 있거나 뒤에 임의 문자열이 붙으면 거부한다(사후검수 지적 8). */
  function isIsoDateTimeTz(s) {
    if (typeof s !== 'string') return false;
    var m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|([+-])(\d{2}):(\d{2}))$/.exec(s);
    if (!m) return false;
    if (!isIsoDate(m[1])) return false;
    var hh = Number(m[2]), mm = Number(m[3]), ss = m[4] === undefined ? 0 : Number(m[4]);
    if (!(hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59 && ss >= 0 && ss <= 59)) return false;
    if (m[5] !== 'Z') {                     // 오프셋 시·분 범위도 검증한다(사후검수 R3 지적 8)
      var oh = Number(m[7]), om = Number(m[8]);
      if (!(oh >= 0 && oh <= 14 && om >= 0 && om <= 59)) return false;
      if (oh === 14 && om !== 0) return false;   // 실제 사용되는 최대 오프셋은 ±14:00
    }
    return true;
  }
  function allPos(arr) { return Array.isArray(arr) && arr.length > 0 && arr.every(isPos); }
  function allNum(arr) { return Array.isArray(arr) && arr.length > 0 && arr.every(isNum); }
  function nearMultiple(v, step) {
    if (!isPos(step)) return false;
    var q = v / step, r = Math.abs(q - Math.round(q));
    return r < 1e-6 || Math.abs(1 - r) < 1e-6;
  }
  function validSide(levels, ascending) {
    if (!Array.isArray(levels) || levels.length < 5) return '호가 레벨이 5단계 미만이다.';
    for (var i = 0; i < levels.length; i++) {
      var L = levels[i];
      if (!Array.isArray(L) || L.length < 2 || !isPos(L[0]) || !isPos(L[1])) return '호가 ' + (i + 1) + '단계의 가격 또는 수량이 양수가 아니다.';
      if (i > 0) {
        var prev = levels[i - 1][0], cur = L[0];
        if (ascending && !(cur > prev)) return '매도호가가 오름차순이 아니다(' + prev + ' → ' + cur + ').';
        if (!ascending && !(cur < prev)) return '매수호가가 내림차순이 아니다(' + prev + ' → ' + cur + ').';
      }
    }
    return null;
  }

  /* ── D0 데이터 품질 게이트 (전체 차단) ── */
  var D0_HARD = [
    { key: 'asOf', label: '시세 신선도', fail: function (m) { return !isIsoDate(m.asOf) || !isIsoDate(m.periodEnd) || m.asOf !== m.periodEnd; },
      why: 'asOf 또는 관측기간 종료일이 YYYY-MM-DD 형식의 실재 날짜가 아니거나 두 값이 다르다.' },
    { key: 'adjusted', label: '수정주가 적용', fail: function (m) { return m.adjusted !== true; },
      why: '수정주가 적용 여부가 true로 확인되지 않았다. 분할·배당 미반영 가격으로는 갭·이동평균·신고가가 다른 값이 된다.' },
    { key: 'corporateAction', label: '기업행사 유무', fail: function (m) { return m.corporateActionInPeriod !== false; },
      why: '관측기간 내 분할·역분할·병합·특별배당이 없음(false)으로 확인되지 않았다. 「모름」도 차단한다.' },
    { key: 'halt', label: '거래정지 유무', fail: function (m) { return m.tradingHaltInPeriod !== false; },
      why: '관측기간 내 거래정지가 없음(false)으로 확인되지 않았다.' },
    { key: 'session', label: '세션 구분', fail: function (m) { return !m.session; },
      why: '정규장만인지 시간외를 포함하는지 표기되지 않았다. 세션이 섞이면 관측치가 비교되지 않는다.' },
  ];

  var AXES = [
    { id: 'A1', label: '유동성', unit: '통화 금액', desc: '일평균 거래대금. 체결 마찰의 분모가 된다.' },
    { id: 'A2', label: '호가 스프레드', unit: '%', desc: '최우선 매도·매수 호가 차이. 왕복 비용의 하한.' },
    { id: 'A3', label: '변동성', unit: '%', desc: 'ATR을 종가 대비 비율로 환산한 값.' },
    { id: 'A4', label: '거래량 일관성', unit: '비율', desc: '거래량 변동계수와 최대일 집중도.' },
    { id: 'A5', label: '갭 분포', unit: '%', desc: '오버나잇 갭의 평균·최대 크기.' },
    { id: 'A6', label: '구조 명료성', unit: '비율', desc: 'SMA20/SMA60 배열 지속률과 방향 전환 빈도. 해석·등급 없이 값만 낸다.' },
    { id: 'A7', label: '상대강도', unit: '비율', desc: '종목·섹터·광역지수 20거래일 수익률 비교.' },
    { id: 'A9', label: '시장 깊이·가격충격', unit: '%', desc: '기준 주문금액을 정적 표시호가에 넣었을 때의 체결가중평균 이탈.' },
  ];

  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function stdev(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  function sma(arr, i, k) { if (i - k + 1 < 0) return null; var s = 0; for (var j = i - k + 1; j <= i; j++) s += arr[j]; return s / k; }
  function r(x, d) { if (!isNum(x)) return null; var p = Math.pow(10, d == null ? 4 : d); return Math.round(x * p) / p; }

  var IMPACT_LIMIT = '정적 표시호가 스냅샷 기준 추정치이며 실제 체결값의 상한도 하한도 아니다. 체결 중 호가 갱신·숨은 유동성·가격개선·다른 참여자의 반응에 따라 실제값은 더 크거나 더 작을 수 있다.';

  /* ── A9 정적 표시호가 소진 모델 ── */
  function priceImpact(quote, side, notional, tickSize, snapshotAt) {
    if (!isIsoDateTimeTz(snapshotAt)) return { status: AX.NONE, reason: '호가 스냅샷 시각이 시간대를 포함한 ISO datetime(예: 2026-08-12T14:30:00+09:00)이 아니다.' };
    if (!isPos(tickSize)) return { status: AX.NONE, reason: '틱 크기가 양수로 입력되지 않았다.' };
    if (!isPos(notional)) return { status: AX.NONE, reason: '기준 주문금액이 양수가 아니다.' };
    var askErr = validSide(quote.asks, true), bidErr = validSide(quote.bids, false);
    if (askErr) return { status: AX.NONE, reason: '매도호가 오류 — ' + askErr };
    if (bidErr) return { status: AX.NONE, reason: '매수호가 오류 — ' + bidErr };
    if (!(quote.bids[0][0] < quote.asks[0][0])) return { status: AX.NONE, reason: '최우선 매수호가가 최우선 매도호가보다 낮지 않다(교차 호가).' };
    var all = quote.asks.concat(quote.bids);
    for (var t = 0; t < all.length; t++) if (!nearMultiple(all[t][0], tickSize)) return { status: AX.NONE, reason: '호가 ' + all[t][0] + '이 틱 크기 ' + tickSize + '의 배수가 아니다.' };

    var levels = side === 'buy' ? quote.asks : quote.bids;
    var p0 = levels[0][0], remaining = notional, cost = 0, qty = 0;
    for (var i = 0; i < levels.length; i++) {
      var px = levels[i][0], sz = levels[i][1], cap = px * sz;
      if (remaining <= cap) { var q = remaining / px; cost += q * px; qty += q; remaining = 0; break; }
      cost += cap; qty += sz; remaining -= cap;
    }
    if (remaining > 0) return { status: AX.NONE, code: '호가 부족', reason: '제공된 표시호가를 모두 소진하고도 잔여 금액이 남았다. 외삽하지 않는다.' };
    if (!isPos(qty)) return { status: AX.NONE, reason: '체결 수량이 0이어서 평균 체결가를 정의할 수 없다.' };
    var fill = cost / qty;
    if (!isNum(fill) || !isPos(p0)) return { status: AX.NONE, reason: '체결가중평균가를 계산할 수 없다.' };
    return {
      status: AX.OK, value: r(Math.abs(fill - p0) / p0 * 100, 4),
      detail: { fillPrice: r(fill, 4), reference: p0, filledQty: r(qty, 4), snapshotAt: snapshotAt, tickSize: tickSize },
      formula: 'P_fill = Σ(가격ᵢ×체결수량ᵢ)/Σ체결수량ᵢ · 가격충격% = |P_fill − P0|/P0 × 100 (P0 = 반대편 최우선 호가)',
      note: IMPACT_LIMIT,
    };
  }

  /* ── 메인 ── */
  function compute(input) {
    input = input || {};
    var m = input.meta || {}, d = input.data || {}, risk = input.risk || {};
    var dataKind = KINDS[input.dataKind] ? input.dataKind : 'synthetic';
    var out = { status: null, level: null, dataKind: dataKind, dataKindLabel: KINDS[dataKind],
      asOf: m.asOf || null, enteredAt: input.enteredAt || null, sourceRefs: input.sourceRefs || [],
      gate: [], axes: [], derived: [], missing: [], notices: [], inputErrors: [] };

    /* 데이터 완전성 레벨 — 산출 상태와 분리 */
    var provided = ['dailyTurnover', 'quote', 'atr', 'lastClose', 'volumes', 'gaps', 'closes120', 'rsSeries', 'orderNotional']
      .filter(function (k) { var v = d[k]; return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0); });
    out.level = provided.length === 0 ? LEVEL.L1 : (provided.length === 9 ? LEVEL.L3 : LEVEL.L2);

    if (dataKind === 'measuredHistorical' && (!out.sourceRefs.length || !m.asOf)) {
      out.inputErrors.push('실측 과거 데이터는 출처(sourceRefs)와 asOf가 함께 있어야 한다.');
    }
    if (dataKind === 'userProvided' && !out.enteredAt) {
      out.inputErrors.push('사용자 입력 데이터는 입력 시각(enteredAt)이 함께 기록되어야 한다.');
    }

    /* 1) D0 하드 게이트 */
    var hardFail = [];
    D0_HARD.forEach(function (g) {
      var bad = g.fail(m);
      out.gate.push({ key: g.key, label: g.label, pass: !bad, why: bad ? g.why : null });
      if (bad) hardFail.push(g.label);
    });
    if (hardFail.length) {
      out.status = STATUS.NONE;
      out.missing = hardFail.map(function (x) { return 'D0 ' + x; });
      out.notices.push('데이터 품질 게이트를 통과하지 못해 어떤 축도 산출하지 않는다. 추정치로 채우지 않는다.');
      return out;
    }

    /* 2) A8 하드 플래그 */
    var leveraged = m.instrumentType === 'leveragedEtf';
    if (leveraged) out.notices.push('상품 구조가 일일 재설정형(레버리지·인버스)이다. 다일 구조 해석·기초지수 대비 누적 비교·장기 가격 레벨 해석에 별도 경고가 필요하므로 A5·A6·A7을 비활성화하고 완전성 집계에서 제외한다. 당일 축(A1·A2·A3·A4·A9)은 그대로 산출한다.');

    /* 3) 축별 산출 — 모든 분기에서 NaN을 만들지 않는다.
     * invalidFields[key]가 true면 그 입력은 해석 불가 토큰을 포함한 것이므로,
     * 걸러낸 값으로 계산을 이어가지 않고 해당 축을 산출 불가로 전파한다(사후검수 R3 지적 8). */
    var invalid = input.invalidFields || {};
    var INVALID_REASON = '입력에 해석할 수 없는 값이 있어 걸러낸 값으로 계산하지 않는다.';
    var res = {};
    var q = d.quote;
    var quoteErr = null;
    if (q && q.asks && q.bids) {
      quoteErr = validSide(q.asks, true) || validSide(q.bids, false)
        || (!(q.bids[0] && q.asks[0] && q.bids[0][0] < q.asks[0][0]) ? '최우선 매수호가가 최우선 매도호가보다 낮지 않다(교차 호가).' : null);
    }
    var hasQuote = !!(q && q.asks && q.bids && !quoteErr);

    res.A1 = isPos(d.dailyTurnover)
      ? { status: AX.OK, value: r(d.dailyTurnover, 0), formula: '입력값 · 일평균 거래대금' }
      : { status: AX.NONE, reason: d.dailyTurnover === undefined ? '일평균 거래대금이 입력되지 않았다.' : '일평균 거래대금이 양수·유한수가 아니다.' };

    res.A2 = hasQuote
      ? (function () { var a = q.asks[0][0], b = q.bids[0][0], mid = (a + b) / 2;
          if (!isPos(mid)) return { status: AX.NONE, reason: '중간가를 계산할 수 없다.' };
          return { status: AX.OK, value: r((a - b) / mid * 100, 4), formula: '(최우선매도 − 최우선매수) / 중간가 × 100', detail: { ask: a, bid: b, mid: r(mid, 4) } }; })()
      : { status: AX.NONE, reason: quoteErr ? ('호가 오류 — ' + quoteErr) : '호가 스냅샷이 없다.' };

    res.A3 = (isPos(d.atr) && isPos(d.lastClose))
      ? { status: AX.OK, value: r(d.atr / d.lastClose * 100, 4), formula: 'ATR(14, 사용 봉) / 종가 × 100', detail: { atr: d.atr, close: d.lastClose, timeframe: m.timeframe || '(미표기)' } }
      : { status: AX.NONE, reason: (d.atr === undefined || d.lastClose === undefined) ? 'ATR 또는 종가가 입력되지 않았다.' : 'ATR·종가가 양수·유한수가 아니다.' };

    res.A4 = (function () {
      var v = d.volumes;
      if (!Array.isArray(v) || v.length < 20) return { status: AX.NONE, reason: '거래량 배열이 20거래일 미만이다.' };
      if (!v.every(function (x) { return isNum(x) && x >= 0; })) return { status: AX.NONE, reason: '거래량에 음수 또는 수가 아닌 값이 있다.' };
      var sum = v.reduce(function (s, x) { return s + x; }, 0), mu = mean(v);
      if (!isPos(sum) || !isPos(mu)) return { status: AX.NONE, reason: '거래량 합계가 0이어서 변동계수·집중도를 정의할 수 없다.' };
      return { status: AX.OK, value: r(stdev(v) / mu, 4), formula: '변동계수 = 표준편차/평균 · 최대일 집중도 = 최대거래량/합계',
        detail: { cv: r(stdev(v) / mu, 4), maxShare: r(Math.max.apply(null, v) / sum, 4), n: v.length } };
    })();

    res.A5 = leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 다일 갭 해석을 비활성화한다.' }
      : (function () {
        if (!Array.isArray(d.gaps) || d.gaps.length < 20) return { status: AX.NONE, reason: '갭 배열이 20거래일 미만이다.' };
        if (!allNum(d.gaps)) return { status: AX.NONE, reason: '갭 배열에 수가 아닌 값이 있다.' };
        var g = d.gaps.map(Math.abs);
        return { status: AX.OK, value: r(mean(g), 4), formula: '갭%ᵢ = (시가ᵢ − 전일 정규장 종가ᵢ₋₁)/전일 종가ᵢ₋₁ × 100 · 평균·최대 |갭%|',
          detail: { meanAbs: r(mean(g), 4), maxAbs: r(Math.max.apply(null, g), 4), n: g.length } };
      })();

    res.A6 = leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 다일 구조 해석을 비활성화한다.' }
      : (function () {
        var c = d.closes120;
        if (!Array.isArray(c) || c.length < 120) return { status: AX.NONE, reason: '일봉 종가가 120개 미만이다(60거래일 창 + SMA60 워밍업).' };
        if (!allPos(c)) return { status: AX.NONE, reason: '종가 배열에 양수가 아닌 값이 있다.' };
        var N = c.length, hits = 0, flips = 0, prevSign = null, cnt = 0, prevS20 = null;
        for (var i = N - 60; i < N; i++) {
          var s20 = sma(c, i, 20), s60 = sma(c, i, 60);
          if (s20 == null || s60 == null) continue;
          cnt++; if (s20 > s60) hits++;
          if (prevS20 != null) { var sign = Math.sign(s20 - prevS20); if (prevSign !== null && sign !== 0 && sign !== prevSign) flips++; if (sign !== 0) prevSign = sign; }
          prevS20 = s20;
        }
        if (!cnt) return { status: AX.NONE, reason: '창을 채우지 못했다.' };
        return { status: AX.OK, value: r(hits / cnt, 4),
          formula: '배열지속률 = count(SMA20 > SMA60, 최근 60거래일)/60 · 방향전환빈도 = SMA20 기울기 부호 전환 횟수/60',
          detail: { alignmentRatio: r(hits / cnt, 4), flipRate: r(flips / cnt, 4), window: cnt },
          note: '해석·등급을 부여하지 않는다. 두 비율을 그대로 표시한다.' };
      })();

    res.A7 = leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 기초지수 대비 누적 비교를 비활성화한다.' }
      : (function () {
        var s = d.rsSeries;
        if (!s || !s.stock || !s.sector || !s.broad) return { status: AX.NONE, reason: '종목·섹터·광역지수 3계열이 모두 입력되지 않았다.' };
        if (![s.stock, s.sector, s.broad].every(allPos)) return { status: AX.NONE, reason: '세 시계열에 양수가 아닌 값이 있다.' };
        if (s.calendarAligned !== true) return { status: AX.NONE, reason: '세 시계열의 거래일 캘린더가 완전히 일치한다고 확인되지 않았다. 결측이 하루라도 있으면 산출하지 않는다.' };
        if (s.sameMarket !== true) return { status: AX.NONE, reason: '동일 시장·동일 통화 내 비교로 확인되지 않았다.' };
        if (s.stock.length !== s.sector.length || s.stock.length !== s.broad.length) return { status: AX.NONE, reason: '세 시계열의 길이가 다르다.' };
        if (s.stock.length < 21) return { status: AX.NONE, reason: '20거래일 수익률 계산에 필요한 21개 종가가 되지 않는다.' };
        var L = s.stock.length, k = 20, ret = function (a) { return a[L - 1] / a[L - 1 - k] - 1; };
        var rs = ret(s.stock), rSec = ret(s.sector), rBr = ret(s.broad);
        if (!(isNum(rs) && isNum(rSec) && isNum(rBr))) return { status: AX.NONE, reason: '수익률을 계산할 수 없다.' };
        if (Math.abs(1 + rSec) < 1e-12 || Math.abs(1 + rBr) < 1e-12) return { status: AX.NONE, reason: '비교집단 수익률이 −100%에 가까워 상대강도 분모가 0이 된다.' };
        return { status: AX.OK, value: r((1 + rs) / (1 + rSec) - 1, 4),
          formula: 'r_x = P[t]/P[t−20] − 1 · RS = (1+r_종목)/(1+r_비교집단) − 1',
          detail: { rStock: r(rs, 4), rSector: r(rSec, 4), rBroad: r(rBr, 4), rsSector: r((1 + rs) / (1 + rSec) - 1, 4), rsBroad: r((1 + rs) / (1 + rBr) - 1, 4) } };
      })();

    res.A9 = hasQuote
      ? ((m.side === 'buy' || m.side === 'sell')
        ? priceImpact(q, m.side, d.orderNotional, d.tickSize, m.quoteSnapshotAt)
        : { status: AX.NONE, reason: '주문 방향이 매수/매도로 입력되지 않았다.' })
      : { status: AX.NONE, reason: quoteErr ? ('호가 오류 — ' + quoteErr) : '호가 스냅샷이 없다.' };

    /* 4) 축 간 산술 */
    var plan = risk.plannedLossDistance, budget = risk.lossBudget;
    if (isPos(plan) && isPos(budget) && isPos(d.lastClose)) {
      var qty = budget / plan, notional = qty * d.lastClose;
      if (isPos(notional)) {
        out.derived.push({ id: 'D-POS', label: '계획 수량·명목금액', value: r(notional, 0), unit: '통화 금액',
          formula: '수량 = 감내 손실액 / 계획 손실거리 · 명목금액 = 수량 × 종가', detail: { qty: r(qty, 4), notional: r(notional, 0) } });
        if (res.A1.status === AX.OK && isPos(res.A1.value)) out.derived.push({ id: 'D-LIQ', label: '명목금액 ÷ 일평균 거래대금', value: r(notional / res.A1.value * 100, 4), unit: '%', formula: '명목금액 / 일평균 거래대금 × 100' });
        if (res.A2.status === AX.OK) { var sc = d.lastClose * (res.A2.value / 100);
          out.derived.push({ id: 'D-COST', label: '왕복 스프레드 비용 ÷ 계획 손실거리', value: r(sc / plan * 100, 4), unit: '%', formula: '왕복 스프레드 비용 = 종가 × 스프레드% · 그 값을 계획 손실거리로 나눈 비율', detail: { spreadCost: r(sc, 4), plannedLossDistance: plan } }); }
        if (res.A3.status === AX.OK && isPos(d.atr)) out.derived.push({ id: 'D-ATR', label: '계획 손실거리 ÷ ATR', value: r(plan / d.atr, 4), unit: '배', formula: '계획 손실거리 / ATR(사용 봉)', detail: { note: '이용자가 정한 손실거리가 변동성 대비 몇 배인지를 보여줄 뿐이며, 적정 배수를 제시하지 않는다.' } });
      }
    } else if (plan !== undefined || budget !== undefined) {
      out.inputErrors.push('계획 손실거리와 1회 감내 손실 금액은 둘 다 양수여야 한다.');
    } else {
      out.notices.push('계획 손실거리와 1회 감내 손실 금액이 모두 입력되어야 축 간 산술을 낼 수 있다. 앱은 ATR을 손실거리로 자동 대입하지 않는다.');
    }

    /* 4-b) 해석 불가 입력을 가진 축을 산출 불가로 덮어쓴다(상태 재계산 전에 적용) */
    var INVALID_MAP = { quote: ['A2', 'A9'], volumes: ['A4'], gaps: ['A5'], closes120: ['A6'], rsSeries: ['A7'], dailyTurnover: ['A1'] };
    Object.keys(INVALID_MAP).forEach(function (k) {
      if (!invalid[k]) return;
      INVALID_MAP[k].forEach(function (id) { if (res[id] && res[id].status !== AX.OFF) res[id] = { status: AX.NONE, reason: INVALID_REASON }; });
    });

    /* 5) 비유한값 방어를 「먼저」 적용한 뒤 상태·결손을 재계산한다.
     * (사후검수 지적 8: 방어를 상태 판정 뒤에 두면 축은 산출 불가인데 전체는 산출 완료로 남는다) */
    AXES.forEach(function (a) {
      var v = Object.assign({ id: a.id, label: a.label, unit: a.unit, desc: a.desc }, res[a.id]);
      if (v.value !== undefined && !isNum(v.value)) { v.status = AX.NONE; v.reason = '계산 결과가 유한수가 아니어서 산출하지 않는다.'; delete v.value; }
      out.axes.push(v);
    });
    out.derived = out.derived.filter(function (x) { return isNum(x.value); });
    out.missing = out.missing.concat(out.axes.filter(function (a) { return a.status === AX.NONE; })
      .map(function (a) { return a.id + ' ' + a.label + ' — ' + (a.reason || ''); }));
    var applicable = out.axes.filter(function (a) { return a.status !== AX.OFF; });
    var computed = applicable.filter(function (a) { return a.status === AX.OK; });
    out.status = computed.length === applicable.length ? STATUS.DONE : (computed.length === 0 ? STATUS.NONE : STATUS.PARTIAL);

    out.notices.push('출력은 관측값과 산출 상태까지다. 이 페이지는 임계값을 두지 않으므로 「낮음/높음」 같은 범주 판정이나 스타일 종합판정을 하지 않는다.');
    return out;
  }

  /* ── 입력 파서 — 잘못된 토큰을 조용히 버리지 않고 그대로 보고한다(사후검수 지적 8) ── */
  var NUM_TOKEN_RE = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/;
  function parseNumsStrict(s) {
    var toks = String(s == null ? '' : s).split(/[\s,]+/).filter(function (t) { return t !== ''; });
    var vals = [], bad = [];
    toks.forEach(function (t) {
      if (!NUM_TOKEN_RE.test(t)) { bad.push(t); return; }
      var v = Number(t);
      if (isFinite(v)) vals.push(v); else bad.push(t);
    });
    return { values: vals, bad: bad };
  }
  function parseLevelsStrict(s) {
    var toks = String(s == null ? '' : s).split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var vals = [], bad = [];
    toks.forEach(function (t) {
      var parts = t.split(':');
      /* 빈 가격·빈 수량("100:")을 0으로 보정하지 않고 bad로 처리한다(사후검수 R3 지적 8) */
      if (parts.length !== 2 || !NUM_TOKEN_RE.test(parts[0].trim()) || !NUM_TOKEN_RE.test(parts[1].trim())) { bad.push(t); return; }
      var p = Number(parts[0]), q = Number(parts[1]);
      if (isFinite(p) && isFinite(q)) vals.push([p, q]); else bad.push(t);
    });
    return { values: vals, bad: bad };
  }

  /* ── 결과 렌더러 — DOM 없이도 시험할 수 있도록 순수 문자열 함수로 분리(사후검수 지적 9) ── */
  function renderResultHTML(res, escFn) {
    var esc = escFn || function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
    var badge = res.status === STATUS.DONE ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
      : res.status === STATUS.PARTIAL ? 'bg-amber-500/15 text-amber-300 ring-amber-500/30' : 'bg-rose-500/15 text-rose-300 ring-rose-500/30';
    var kindCls = res.dataKind === 'synthetic' ? 'bg-slate-700/50 text-slate-300'
      : res.dataKind === 'measuredHistorical' ? 'bg-violet-500/15 text-violet-300' : 'bg-sky-500/15 text-sky-300';
    var prov = res.dataKind === 'synthetic' ? '출처: 앱이 넣은 합성 예시 · 실제 종목 판정 아님'
      : res.dataKind === 'measuredHistorical' ? ('출처: ' + ((res.sourceRefs || []).join(', ') || '(미기입)') + ' · asOf ' + (res.asOf || '(미기입)'))
      : ('출처: 사용자 직접 입력 · 입력 시각 ' + (res.enteredAt || '(미기록)') + ' · asOf ' + (res.asOf || '(미기입)'));
    var axCls = function (s) { return s === AX.OK ? 'text-emerald-300' : s === AX.OFF ? 'text-slate-500' : 'text-rose-300'; };
    var h = '<div class="flex items-center gap-2 flex-wrap">'
      + '<span class="rounded-full ring-1 px-3 py-1 text-[12px] font-extrabold ' + badge + '">' + esc(res.status) + '</span>'
      + '<span class="rounded-full ring-1 ring-slate-600 px-2.5 py-1 text-[11px] font-bold text-slate-300">' + esc(res.level) + '</span>'
      + '<span class="rounded px-2 py-0.5 text-[10px] font-bold ' + kindCls + '">' + esc(res.dataKindLabel) + '</span>'
      + '<span class="text-[10.5px] text-slate-500">' + esc(prov) + '</span></div>';
    if ((res.inputErrors || []).length) h += '<div class="mt-3 rounded-lg bg-rose-500/5 ring-1 ring-rose-500/25 p-3"><div class="text-[12px] font-bold text-rose-300">입력 오류</div><ul class="mt-1 text-[11.5px] text-slate-300 list-disc pl-5">' + res.inputErrors.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    var gfail = (res.gate || []).filter(function (g) { return !g.pass; });
    if (gfail.length) h += '<div class="mt-3 rounded-lg bg-rose-500/5 ring-1 ring-rose-500/25 p-3"><div class="text-[12px] font-bold text-rose-300">데이터 품질 게이트 미통과</div><ul class="mt-1 text-[11.5px] text-slate-300 list-disc pl-5">' + gfail.map(function (g) { return '<li><b>' + esc(g.label) + '</b> — ' + esc(g.why) + '</li>'; }).join('') + '</ul></div>';
    if ((res.axes || []).length) h += '<div class="mt-3 grid gap-2 md:grid-cols-2">' + res.axes.map(function (a) {
      var body = a.status === AX.OK
        ? '<div class="mt-1 text-[15px] font-extrabold text-sky-300 kv">' + esc(a.value) + '<span class="text-[11px] font-normal text-slate-500 ml-1">' + esc(a.unit) + '</span></div>'
          + '<div class="mt-1 text-[10.5px] font-mono text-slate-500 break-all">' + esc(a.formula || '') + '</div>'
          + (a.detail ? '<div class="mt-1 text-[10.5px] text-slate-500 kv">' + Object.keys(a.detail).map(function (k) { return esc(k) + ' ' + esc(a.detail[k]); }).join(' · ') + '</div>' : '')
          + (a.note ? '<div class="mt-1 text-[10.5px] text-amber-400/80">' + esc(a.note) + '</div>' : '')
        : '<div class="mt-1 text-[11.5px] text-slate-400">' + esc(a.reason || '') + '</div>';
      return '<div class="rounded-lg bg-slate-800/40 p-3"><div class="flex items-center justify-between gap-2">'
        + '<span class="text-[12.5px] font-bold text-white">' + esc(a.id) + ' ' + esc(a.label) + '</span>'
        + '<span class="text-[11px] font-bold ' + axCls(a.status) + '">' + esc(a.status) + (a.code ? ' · ' + esc(a.code) : '') + '</span></div>' + body + '</div>';
    }).join('') + '</div>';
    if ((res.derived || []).length) h += '<div class="mt-3"><div class="text-[12px] font-bold text-white mb-1.5">축 간 산술 <span class="font-normal text-slate-500 text-[11px]">— 입력값들 사이의 관계일 뿐 예측이 아닙니다</span></div><div class="grid gap-2 md:grid-cols-2">'
      + res.derived.map(function (d) {
        return '<div class="rounded-lg bg-slate-800/40 p-3"><div class="text-[12px] font-bold text-slate-200">' + esc(d.label) + '</div>'
          + '<div class="mt-0.5 text-[15px] font-extrabold text-amber-300 kv">' + esc(d.value) + '<span class="text-[11px] font-normal text-slate-500 ml-1">' + esc(d.unit) + '</span></div>'
          + '<div class="mt-1 text-[10.5px] font-mono text-slate-500 break-all">' + esc(d.formula) + '</div>'
          + (d.detail && d.detail.note ? '<div class="mt-1 text-[10.5px] text-amber-400/80">' + esc(d.detail.note) + '</div>' : '') + '</div>';
      }).join('') + '</div></div>';
    if ((res.missing || []).length) h += '<div class="mt-3 rounded-lg bg-amber-500/5 ring-1 ring-amber-500/25 p-3"><div class="text-[12px] font-bold text-amber-300">더 관측해야 하는 것</div><ul class="mt-1 text-[11.5px] text-slate-300 list-disc pl-5">' + res.missing.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    if ((res.notices || []).length) h += '<ul class="mt-3 text-[10.5px] text-slate-500 space-y-1 list-disc pl-5">' + res.notices.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    return h;
  }

  var STYLE_CONTEXT = [
    { style: '스캘핑 (수초~15분)', dominant: ['A1', 'A2', 'A9'], note: '왕복 비용과 체결 마찰이 목표 변동폭에 비해 커지기 쉬운 구간이다.' },
    { style: '인트라데이 (당일 청산)', dominant: ['A1', 'A3', 'A9'], note: '당일 변동폭과 체결 가능 규모가 함께 걸린다.' },
    { style: '스윙 (2~20거래일)', dominant: ['A3', 'A5', 'A6', 'A7'], note: '정규장 종가를 넘겨 보유하므로 갭 분포가 별도 항목으로 들어온다.' },
  ];

  root.POLARIS_SUITABILITY = {
    STATUS: STATUS, AXIS_STATUS: AX, LEVEL: LEVEL, DATA_KINDS: KINDS, AXES: AXES,
    D0_HARD: D0_HARD.map(function (g) { return { key: g.key, label: g.label }; }),
    STYLE_CONTEXT: STYLE_CONTEXT, compute: compute,
    parseNumsStrict: parseNumsStrict, parseLevelsStrict: parseLevelsStrict, renderResultHTML: renderResultHTML,
    _validators: { isIsoDate: isIsoDate, isIsoDateTimeTz: isIsoDateTimeTz, isPos: isPos, validSide: validSide, nearMultiple: nearMultiple },
  };
})(window);
