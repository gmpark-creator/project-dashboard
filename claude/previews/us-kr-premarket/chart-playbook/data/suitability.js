/* Polaris Chart Playbook — 종목-스타일 구조적 마찰 관측기 (window.POLARIS_SUITABILITY)
 *
 * 무엇을 하는가: 이용자가 직접 관측해 입력한 값들 사이의 산술 관계만 계산한다.
 * 무엇을 하지 않는가:
 *  - 종목을 추천하지 않는다. 매수·매도 의견을 내지 않는다.
 *  - 밸류에이션·목표가·승률을 다루지 않는다.
 *  - 「낮음/높음」 같은 범주 판정을 하지 않는다. 임계값을 두지 않기로 했으므로
 *    출력은 관측값과 `산출 완료 / 부분 산출 / 산출 불가` 상태까지다. (Codex R3 조정① 판정)
 *  - 손절 가격을 정해 주지 않는다. 계획 손실거리는 이용자가 직접 입력하는 값이다.
 *
 * 데이터 출처: 전부 `userProvided`. 앱은 값을 보정하거나 추정하지 않는다.
 * 입력이 없으면 계산하지 않고 `산출 불가`로 두고, 무엇을 더 관측해야 하는지 알려준다.
 */
(function (root) {
  'use strict';

  var STATUS = { DONE: '산출 완료', PARTIAL: '부분 산출', NONE: '산출 불가' };
  var AX = { OK: '산출', NONE: '산출 불가', OFF: '비활성 · 상품 구조' };

  /* ── D0 데이터 품질 게이트 ──
   * 전체 차단(hard): 신선도 · 수정주가 · 기업행사 · 거래정지 · 세션
   * 축 단위: 창 미달 · 호가 데이터 없음
   */
  var D0_HARD = [
    { key: 'asOf', label: '시세 신선도', fail: function (m) { return !m.asOf || !m.periodEnd || m.asOf !== m.periodEnd; },
      why: '입력 asOf가 비었거나 관측기간 종료 거래일과 다르다.' },
    { key: 'adjusted', label: '수정주가 적용', fail: function (m) { return m.adjusted !== true; },
      why: '수정주가 적용 여부가 true로 확인되지 않았다. 분할·배당 미반영 가격으로는 갭·이동평균·신고가가 다른 값이 된다.' },
    { key: 'corporateAction', label: '기업행사 유무', fail: function (m) { return m.corporateActionInPeriod !== false; },
      why: '관측기간 내 분할·역분할·병합·특별배당이 없음(false)으로 확인되지 않았다. 「모름」도 차단한다.' },
    { key: 'halt', label: '거래정지 유무', fail: function (m) { return m.tradingHaltInPeriod !== false; },
      why: '관측기간 내 거래정지가 없음(false)으로 확인되지 않았다.' },
    { key: 'session', label: '세션 구분', fail: function (m) { return !m.session; },
      why: '정규장만인지 시간외를 포함하는지 표기되지 않았다. 세션이 섞이면 관측치가 비교되지 않는다.' },
  ];

  /* ── 축 메타데이터 ── */
  var AXES = [
    { id: 'A1', label: '유동성', unit: '통화 금액', needs: ['dailyTurnover'], multiDay: false,
      desc: '일평균 거래대금. 체결 마찰의 분모가 된다.' },
    { id: 'A2', label: '호가 스프레드', unit: '%', needs: ['quote'], multiDay: false,
      desc: '최우선 매도·매수 호가 차이. 왕복 비용의 하한.' },
    { id: 'A3', label: '변동성', unit: '%', needs: ['atr', 'lastClose'], multiDay: false,
      desc: 'ATR을 종가 대비 비율로 환산한 값.' },
    { id: 'A4', label: '거래량 일관성', unit: '비율', needs: ['volumes'], multiDay: false,
      desc: '거래량 변동계수와 최대일 집중도.' },
    { id: 'A5', label: '갭 분포', unit: '%', needs: ['gaps'], multiDay: true,
      desc: '오버나잇 갭의 평균·최대 크기.' },
    { id: 'A6', label: '구조 명료성', unit: '비율', needs: ['closes120'], multiDay: true,
      desc: 'SMA20/SMA60 배열 지속률과 방향 전환 빈도. 해석·등급 없이 값만 낸다.' },
    { id: 'A7', label: '상대강도', unit: '비율', needs: ['rsSeries'], multiDay: true,
      desc: '종목·섹터·광역지수 20거래일 수익률 비교.' },
    { id: 'A9', label: '시장 깊이·가격충격', unit: '%', needs: ['quote', 'orderNotional'], multiDay: false,
      desc: '기준 주문금액을 정적 호가에 넣었을 때의 체결가중평균 이탈.' },
  ];

  function n(v) { return typeof v === 'number' && isFinite(v); }
  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function stdev(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  function sma(arr, i, k) {
    if (i - k + 1 < 0) return null;
    var s = 0; for (var j = i - k + 1; j <= i; j++) s += arr[j];
    return s / k;
  }
  function r(x, d) { var p = Math.pow(10, d == null ? 4 : d); return Math.round(x * p) / p; }

  /* ── A9 정적 호가 소진 모델 ── */
  function priceImpact(quote, side, notional) {
    var levels = side === 'buy' ? quote.asks : quote.bids;
    if (!levels || levels.length < 5) return { status: AX.NONE, reason: '호가 레벨이 5단계 미만이다.' };
    var p0 = levels[0][0];
    var remaining = notional, cost = 0, qty = 0;
    for (var i = 0; i < levels.length; i++) {
      var px = levels[i][0], sz = levels[i][1];
      var cap = px * sz;
      if (remaining <= cap) { var q = remaining / px; cost += q * px; qty += q; remaining = 0; break; }
      cost += cap; qty += sz; remaining -= cap;
    }
    if (remaining > 0) return { status: AX.NONE, reason: '제공된 호가를 모두 소진하고도 잔여 금액이 남았다. 외삽하지 않는다.', code: '호가 부족' };
    var fill = cost / qty;
    return {
      status: AX.OK,
      value: r(Math.abs(fill - p0) / p0 * 100, 4),
      detail: { fillPrice: r(fill, 4), reference: p0, filledQty: r(qty, 4) },
      formula: 'P_fill = Σ(가격ᵢ×체결수량ᵢ)/Σ체결수량ᵢ · 가격충격% = |P_fill − P0|/P0 × 100 (P0 = 반대편 최우선 호가)',
    };
  }

  /* ── 메인 ── */
  function compute(input) {
    input = input || {};
    var m = input.meta || {};
    var d = input.data || {};
    var risk = input.risk || {};
    var out = { status: null, gate: [], axes: [], derived: [], missing: [], notices: [], dataKind: 'userProvided' };

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

    /* 2) A8 하드 플래그 — 레버리지·인버스는 다일 해석 축을 비활성화 */
    var leveraged = m.instrumentType === 'leveragedEtf';
    if (leveraged) {
      out.notices.push('상품 구조가 일일 재설정형(레버리지·인버스)이다. 다일 구조 해석·기초지수 대비 누적 비교·장기 가격 레벨 해석에 별도 경고가 필요하므로 A5·A6·A7을 비활성화하고 완전성 집계에서 제외한다. 당일 축(A1·A2·A3·A4·A9)은 그대로 산출한다.');
    }

    /* 3) 축별 산출 */
    var res = {};
    var add = function (id, o) { res[id] = o; };

    // A1 유동성
    add('A1', n(d.dailyTurnover)
      ? { status: AX.OK, value: r(d.dailyTurnover, 0), formula: '입력값 · 일평균 거래대금' }
      : { status: AX.NONE, reason: '일평균 거래대금이 입력되지 않았다.' });

    // A2 스프레드
    var q = d.quote;
    var hasQuote = !!(q && q.asks && q.bids && q.asks.length && q.bids.length);
    add('A2', hasQuote
      ? (function () {
        var ask = q.asks[0][0], bid = q.bids[0][0], mid = (ask + bid) / 2;
        return { status: AX.OK, value: r((ask - bid) / mid * 100, 4), formula: '(최우선매도 − 최우선매수) / 중간가 × 100', detail: { ask: ask, bid: bid, mid: r(mid, 4) } };
      })()
      : { status: AX.NONE, reason: '호가 스냅샷이 없다.' });

    // A3 변동성
    add('A3', (n(d.atr) && n(d.lastClose) && d.lastClose > 0)
      ? { status: AX.OK, value: r(d.atr / d.lastClose * 100, 4), formula: 'ATR(14, 사용 봉) / 종가 × 100', detail: { atr: d.atr, close: d.lastClose, timeframe: m.timeframe || '(미표기)' } }
      : { status: AX.NONE, reason: 'ATR 또는 종가가 입력되지 않았다.' });

    // A4 거래량 일관성
    add('A4', (Array.isArray(d.volumes) && d.volumes.length >= 20)
      ? (function () {
        var v = d.volumes, mu = mean(v), sd = stdev(v), sum = v.reduce(function (s, x) { return s + x; }, 0);
        return { status: AX.OK, value: r(sd / mu, 4), formula: '변동계수 = 표준편차/평균 · 최대일 집중도 = 최대거래량/합계', detail: { cv: r(sd / mu, 4), maxShare: r(Math.max.apply(null, v) / sum, 4), n: v.length } };
      })()
      : { status: AX.NONE, reason: '거래량 배열이 20거래일 미만이다.' });

    // A5 갭 분포
    add('A5', leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 다일 갭 해석을 비활성화한다.' }
      : (Array.isArray(d.gaps) && d.gaps.length >= 20)
        ? (function () {
          var g = d.gaps.map(Math.abs);
          return { status: AX.OK, value: r(mean(g), 4), formula: '갭%ᵢ = (시가ᵢ − 전일 정규장 종가ᵢ₋₁)/전일 종가ᵢ₋₁ × 100 · 평균·최대 |갭%|', detail: { meanAbs: r(mean(g), 4), maxAbs: r(Math.max.apply(null, g), 4), n: g.length } };
        })()
        : { status: AX.NONE, reason: '갭 배열이 20거래일 미만이다.' });

    // A6 구조 명료성 (일봉 60거래일 창 + SMA60 워밍업 → 종가 120개 필요)
    add('A6', leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 다일 구조 해석을 비활성화한다.' }
      : (Array.isArray(d.closes120) && d.closes120.length >= 120)
        ? (function () {
          var c = d.closes120, N = c.length, hits = 0, flips = 0, prevSign = null, cnt = 0, prevS20 = null;
          for (var i = N - 60; i < N; i++) {
            var s20 = sma(c, i, 20), s60 = sma(c, i, 60);
            if (s20 == null || s60 == null) continue;
            cnt++;
            if (s20 > s60) hits++;
            if (prevS20 != null) {
              var sign = Math.sign(s20 - prevS20);
              if (prevSign !== null && sign !== 0 && sign !== prevSign) flips++;
              if (sign !== 0) prevSign = sign;
            }
            prevS20 = s20;
          }
          return {
            status: AX.OK, value: r(hits / cnt, 4),
            formula: '배열지속률 = count(SMA20 > SMA60, 최근 60거래일)/60 · 방향전환빈도 = SMA20 기울기 부호 전환 횟수/60',
            detail: { alignmentRatio: r(hits / cnt, 4), flipRate: r(flips / cnt, 4), window: cnt },
            note: '해석·등급을 부여하지 않는다. 두 비율을 그대로 표시한다.',
          };
        })()
        : { status: AX.NONE, reason: '일봉 종가가 120개 미만이다(60거래일 창 + SMA60 워밍업).' });

    // A7 상대강도 — 캘린더 완전 일치 필수
    add('A7', leveraged ? { status: AX.OFF, reason: '일일 재설정형 상품이라 기초지수 대비 누적 비교를 비활성화한다.' }
      : (function () {
        var s = d.rsSeries;
        if (!s || !s.stock || !s.sector || !s.broad) return { status: AX.NONE, reason: '종목·섹터·광역지수 3계열이 모두 입력되지 않았다.' };
        if (s.calendarAligned !== true) return { status: AX.NONE, reason: '세 시계열의 거래일 캘린더가 완전히 일치한다고 확인되지 않았다. 결측이 하루라도 있으면 산출하지 않는다.' };
        if (s.stock.length !== s.sector.length || s.stock.length !== s.broad.length) return { status: AX.NONE, reason: '세 시계열의 길이가 다르다.' };
        if (s.stock.length < 21) return { status: AX.NONE, reason: '20거래일 수익률 계산에 필요한 21개 종가가 되지 않는다.' };
        if (s.sameMarket !== true) return { status: AX.NONE, reason: '동일 시장·동일 통화 내 비교로 확인되지 않았다. 거래 캘린더가 다른 시장 간 비교는 하지 않는다.' };
        var L = s.stock.length, k = 20;
        var ret = function (a) { return a[L - 1] / a[L - 1 - k] - 1; };
        var rs = ret(s.stock), rSec = ret(s.sector), rBr = ret(s.broad);
        return {
          status: AX.OK, value: r((1 + rs) / (1 + rSec) - 1, 4),
          formula: 'r_x = P[t]/P[t−20] − 1 · RS = (1+r_종목)/(1+r_비교집단) − 1',
          detail: { rStock: r(rs, 4), rSector: r(rSec, 4), rBroad: r(rBr, 4), rsSector: r((1 + rs) / (1 + rSec) - 1, 4), rsBroad: r((1 + rs) / (1 + rBr) - 1, 4) },
        };
      })());

    // A9 가격충격
    add('A9', hasQuote
      ? (n(d.orderNotional) && (m.side === 'buy' || m.side === 'sell')
        ? priceImpact(q, m.side, d.orderNotional)
        : { status: AX.NONE, reason: '기준 주문금액 또는 주문 방향이 입력되지 않았다.' })
      : { status: AX.NONE, reason: '호가 스냅샷이 없다.' });

    /* 4) 축 간 산술 (예측 아님 — 입력값들 사이의 관계) */
    var plan = risk.plannedLossDistance;   // 이용자가 직접 정한 계획 손실거리(가격)
    var budget = risk.lossBudget;          // 1회 감내 손실 금액
    if (n(plan) && plan > 0 && n(budget) && budget > 0 && n(d.lastClose)) {
      var qty = budget / plan;
      var notional = qty * d.lastClose;
      out.derived.push({ id: 'D-POS', label: '계획 수량·명목금액', value: r(notional, 0), unit: '통화 금액',
        formula: '수량 = 감내 손실액 / 계획 손실거리 · 명목금액 = 수량 × 종가', detail: { qty: r(qty, 4), notional: r(notional, 0) } });
      if (res.A1.status === AX.OK && res.A1.value > 0) {
        out.derived.push({ id: 'D-LIQ', label: '명목금액 ÷ 일평균 거래대금', value: r(notional / res.A1.value * 100, 4), unit: '%',
          formula: '명목금액 / 일평균 거래대금 × 100' });
      }
      if (res.A2.status === AX.OK && n(d.lastClose)) {
        var spreadCost = d.lastClose * (res.A2.value / 100);
        out.derived.push({ id: 'D-COST', label: '왕복 스프레드 비용 ÷ 계획 손실거리', value: r(spreadCost / plan * 100, 4), unit: '%',
          formula: '왕복 스프레드 비용 = 종가 × 스프레드% · 그 값을 계획 손실거리로 나눈 비율', detail: { spreadCost: r(spreadCost, 4), plannedLossDistance: plan } });
      }
      if (res.A3.status === AX.OK && n(d.atr) && d.atr > 0) {
        out.derived.push({ id: 'D-ATR', label: '계획 손실거리 ÷ ATR', value: r(plan / d.atr, 4), unit: '배',
          formula: '계획 손실거리 / ATR(사용 봉)', detail: { note: '이 값은 이용자가 정한 손실거리가 변동성 대비 몇 배인지를 보여줄 뿐이며, 적정 배수를 제시하지 않는다.' } });
      }
    } else {
      out.notices.push('계획 손실거리와 1회 감내 손실 금액이 모두 입력되어야 축 간 산술을 낼 수 있다. 앱은 ATR을 손실거리로 자동 대입하지 않는다.');
    }

    /* 5) 상태 판정 — 완전성 집계(비활성 축 제외) */
    AXES.forEach(function (a) {
      var v = res[a.id];
      out.axes.push(Object.assign({ id: a.id, label: a.label, unit: a.unit, desc: a.desc }, v));
      if (v.status === AX.NONE) out.missing.push(a.id + ' ' + a.label + ' — ' + (v.reason || ''));
    });
    var applicable = out.axes.filter(function (a) { return a.status !== AX.OFF; });
    var computed = applicable.filter(function (a) { return a.status === AX.OK; });
    if (computed.length === applicable.length) out.status = STATUS.DONE;
    else if (computed.length === 0) out.status = STATUS.NONE;
    else out.status = STATUS.PARTIAL;

    out.notices.push('출력은 관측값과 산출 상태까지다. 이 페이지는 임계값을 두지 않으므로 「낮음/높음」 같은 범주 판정이나 스타일 종합판정을 하지 않는다.');
    return out;
  }

  /* 스타일별로 어떤 축이 지배적인지 — 설명용 문맥이며 판정 라벨이 아니다 */
  var STYLE_CONTEXT = [
    { style: '스캘핑 (수초~15분)', dominant: ['A1', 'A2', 'A9'], note: '왕복 비용과 체결 마찰이 목표 변동폭에 비해 커지기 쉬운 구간이다.' },
    { style: '인트라데이 (당일 청산)', dominant: ['A1', 'A3', 'A9'], note: '당일 변동폭과 체결 가능 규모가 함께 걸린다.' },
    { style: '스윙 (2~20거래일)', dominant: ['A3', 'A5', 'A6', 'A7'], note: '정규장 종가를 넘겨 보유하므로 갭 분포가 별도 항목으로 들어온다.' },
  ];

  root.POLARIS_SUITABILITY = {
    STATUS: STATUS, AXIS_STATUS: AX, AXES: AXES, D0_HARD: D0_HARD.map(function (g) { return { key: g.key, label: g.label }; }),
    STYLE_CONTEXT: STYLE_CONTEXT, compute: compute,
  };
})(window);
