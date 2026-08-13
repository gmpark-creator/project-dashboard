/* 산출 상태 분류 · 데이터 완전성 레벨 · 입력 검증 테스트
 * 실행: node chart-playbook/tools/test-paths.mjs
 *
 * 계약(Codex R5 체크리스트 20 + 2026-08-13 사후검수):
 *  - 산출 상태(산출 완료/부분 산출/산출 불가)는 데이터 완전성 레벨(L1/L2/L3)과 분리해 시험한다.
 *  - 잘못된 입력은 반드시 `산출 불가`로 전파되고 어떤 경우에도 NaN을 반환하지 않는다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const win = {};
(new Function('window', fs.readFileSync(path.join(__dirname, '..', 'data', 'suitability.js'), 'utf8')))(win);
const S = win.POLARIS_SUITABILITY;

const seq = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const closes120 = seq(130, i => +(100 + i * 0.35 + Math.sin(i / 4) * 1.2).toFixed(4));
const volumes = seq(30, i => 100000 + (i % 7) * 8000);
const gaps = seq(30, i => +(((i % 5) - 2) * 0.7).toFixed(4));
const rsBase = { stock: seq(30, i => +(50 + i * 0.4).toFixed(4)), sector: seq(30, i => +(80 + i * 0.3).toFixed(4)), broad: seq(30, i => 3000 + i * 9), calendarAligned: true, sameMarket: true };
const quote = {
  asks: [[100.10, 900], [100.11, 1200], [100.12, 1500], [100.13, 1800], [100.14, 2200]],
  bids: [[100.08, 1000], [100.07, 1300], [100.06, 1600], [100.05, 1900], [100.04, 2400]],
};
const thinQuote = { asks: quote.asks.map(([p]) => [p, 2]), bids: quote.bids.map(([p]) => [p, 2]) };

const okMeta = {
  asOf: '2026-08-12', periodEnd: '2026-08-12', adjusted: true,
  corporateActionInPeriod: false, tradingHaltInPeriod: false,
  session: 'regular', timeframe: '1d', instrumentType: 'equity', side: 'buy',
  quoteSnapshotAt: '2026-08-12',
};
const okData = { dailyTurnover: 4.2e10, quote, atr: 2.4, lastClose: 100.09, volumes, gaps, closes120, rsSeries: rsBase, orderNotional: 4.0e5, tickSize: 0.01 };
const okRisk = { plannedLossDistance: 3.0, lossBudget: 300000 };
const full = () => ({ dataKind: 'userProvided', enteredAt: '2026-08-13T00:00:00Z', meta: { ...okMeta }, data: JSON.parse(JSON.stringify(okData)), risk: { ...okRisk } });

const DONE = S.STATUS.DONE, PARTIAL = S.STATUS.PARTIAL, NONE = S.STATUS.NONE;
const ax = (res, id) => res.axes.find(a => a.id === id);
const hasNaN = o => JSON.stringify(o, (k, v) => (typeof v === 'number' && !isFinite(v)) ? '__NONFINITE__' : v).includes('__NONFINITE__');

let pass = 0, fail = 0;
const check = (name, cond, extra) => { if (cond) { pass++; console.log(`  ✅ ${name}`); } else { fail++; console.log(`  ❌ ${name}${extra ? ' → ' + extra : ''}`); } };

console.log('── 1) 전체 산출 불가 — D0 하드 게이트 5종 ──');
[['신선도', i => { i.meta.asOf = '2026-08-01'; }],
 ['수정주가', i => { i.meta.adjusted = false; }],
 ['기업행사', i => { i.meta.corporateActionInPeriod = null; }],
 ['거래정지', i => { i.meta.tradingHaltInPeriod = true; }],
 ['세션 미기입', i => { i.meta.session = ''; }]].forEach(([name, mut]) => {
  const inp = full(); mut(inp); const res = S.compute(inp);
  check(`${name} → 전체 ${NONE}`, res.status === NONE && res.axes.length === 0, `실제 ${res.status}`);
});

console.log('── 2) 전 축 결손 → 전체 산출 불가 ──');
{ const inp = full(); inp.data = {}; const res = S.compute(inp);
  check(`전 축 결손 → ${NONE}`, res.status === NONE, `실제 ${res.status}`); }

console.log('── 3) 일부 축 창 미달 → 부분 산출 ──');
{ const inp = full(); inp.data.closes120 = closes120.slice(0, 90); const res = S.compute(inp);
  check(`A6만 ${NONE}`, ax(res, 'A6').status === S.AXIS_STATUS.NONE);
  check(`전체 ${PARTIAL}`, res.status === PARTIAL, `실제 ${res.status}`); }

console.log('── 4) A7 캘린더 불일치 → 부분 산출 ──');
{ const inp = full(); inp.data.rsSeries = { ...rsBase, calendarAligned: false }; const res = S.compute(inp);
  check(`A7만 ${NONE}`, ax(res, 'A7').status === S.AXIS_STATUS.NONE);
  check(`전체 ${PARTIAL}`, res.status === PARTIAL, `실제 ${res.status}`); }

console.log('── 5) A9 호가 부족 → 부분 산출 ──');
{ const inp = full(); inp.data.quote = thinQuote; const res = S.compute(inp); const a9 = ax(res, 'A9');
  check('호가 부족 코드', a9.status === S.AXIS_STATUS.NONE && a9.code === '호가 부족', `실제 ${a9.status}/${a9.code}`);
  check('외삽 없음', a9.value === undefined);
  check(`전체 ${PARTIAL}`, res.status === PARTIAL, `실제 ${res.status}`); }

console.log('── 6) 호가 스냅샷 없음 → A2·A9만 산출 불가 ──');
{ const inp = full(); delete inp.data.quote; const res = S.compute(inp);
  check('A2·A9 산출 불가', ax(res, 'A2').status === S.AXIS_STATUS.NONE && ax(res, 'A9').status === S.AXIS_STATUS.NONE);
  check('나머지 유지', ['A1', 'A3', 'A4', 'A5', 'A6', 'A7'].every(id => ax(res, id).status === S.AXIS_STATUS.OK));
  check(`전체 ${PARTIAL}`, res.status === PARTIAL, `실제 ${res.status}`); }

console.log('── 7) A8 하드 플래그(레버리지) → 다일 축 비활성·집계 제외 ──');
{ const inp = full(); inp.meta.instrumentType = 'leveragedEtf'; const res = S.compute(inp);
  check('A5·A6·A7 비활성', ['A5', 'A6', 'A7'].every(id => ax(res, id).status === S.AXIS_STATUS.OFF));
  check('당일 축 산출', ['A1', 'A2', 'A3', 'A4', 'A9'].every(id => ax(res, id).status === S.AXIS_STATUS.OK));
  check(`전체 ${DONE}`, res.status === DONE, `실제 ${res.status}`); }

console.log('── 8) 완전 입력 → 산출 완료 ──');
{ const res = S.compute(full());
  check(`전체 ${DONE}`, res.status === DONE, `실제 ${res.status}`);
  check('8축 전부 산출', res.axes.filter(a => a.status === S.AXIS_STATUS.OK).length === 8);
  check('축 간 산술 4종', res.derived.length === 4, `실제 ${res.derived.length}`);
  check('A9 스냅샷·틱 기록', !!ax(res, 'A9').detail.snapshotAt && !!ax(res, 'A9').detail.tickSize);
  check('A9 한계 문구가 "하한" 단정을 하지 않음', /상한도 하한도 아니다/.test(ax(res, 'A9').note || ''));
  console.log(`     · A2 ${ax(res, 'A2').value}% · A3 ${ax(res, 'A3').value}% · A9 ${ax(res, 'A9').value}%`); }

console.log('── 9) 데이터 완전성 레벨 L1/L2/L3 (산출 상태와 분리) ──');
{ const l1 = S.compute({ dataKind: 'synthetic', meta: { ...okMeta }, data: {}, risk: {} });
  check('L1 · 입력 없음', /^L1/.test(l1.level), `실제 ${l1.level}`);
  const l2i = full(); delete l2i.data.gaps; delete l2i.data.closes120;
  const l2 = S.compute(l2i);
  check('L2 · 부분 입력', /^L2/.test(l2.level), `실제 ${l2.level}`);
  const l3 = S.compute(full());
  check('L3 · 완전 입력', /^L3/.test(l3.level), `실제 ${l3.level}`);
  check('레벨과 상태가 독립', /^L2/.test(l2.level) && l2.status === PARTIAL && /^L3/.test(l3.level) && l3.status === DONE); }

console.log('── 10) dataKind 계약 ──');
{ const syn = S.compute({ dataKind: 'synthetic', meta: { ...okMeta }, data: JSON.parse(JSON.stringify(okData)), risk: { ...okRisk } });
  check('synthetic 라벨', syn.dataKind === 'synthetic' && /합성/.test(syn.dataKindLabel));
  const usr = S.compute(full());
  check('userProvided + enteredAt', usr.dataKind === 'userProvided' && !!usr.enteredAt);
  const usrNoTime = S.compute({ ...full(), enteredAt: null });
  check('userProvided인데 enteredAt 없으면 입력오류', usrNoTime.inputErrors.some(e => /입력 시각/.test(e)));
  const meas = S.compute({ dataKind: 'measuredHistorical', sourceRefs: [], meta: { ...okMeta }, data: JSON.parse(JSON.stringify(okData)), risk: { ...okRisk } });
  check('measuredHistorical인데 출처 없으면 입력오류', meas.inputErrors.some(e => /출처/.test(e))); }

console.log('── 11) 입력 검증 — 잘못된 값이 산출 완료로 통과하지 않는가 ──');
[['음수 거래대금', i => { i.data.dailyTurnover = -1; }, 'A1'],
 ['음수 ATR', i => { i.data.atr = -2.4; }, 'A3'],
 ['0 종가', i => { i.data.lastClose = 0; }, 'A3'],
 ['교차 호가', i => { i.data.quote = { asks: [[99.9, 900], [99.91, 1200], [99.92, 1500], [99.93, 1800], [99.94, 2200]], bids: quote.bids }; }, 'A2'],
 ['매도호가 역순', i => { i.data.quote = { asks: [...quote.asks].reverse(), bids: quote.bids }; }, 'A2'],
 ['0 주문금액', i => { i.data.orderNotional = 0; }, 'A9'],
 ['틱 배수 아님', i => { i.data.tickSize = 0.07; }, 'A9'],
 ['호가 스냅샷 시각 없음', i => { i.meta.quoteSnapshotAt = ''; }, 'A9'],
 ['0 거래량 전량', i => { i.data.volumes = seq(30, () => 0); }, 'A4'],
 ['음수 종가 배열', i => { i.data.closes120 = closes120.map((v, k) => k === 5 ? -v : v); }, 'A6'],
 ['RS 분모 −100%', i => { i.data.rsSeries = { ...rsBase, sector: rsBase.sector.map((v, k) => k === rsBase.sector.length - 1 ? 1e-18 : v) }; }, 'A7'],
].forEach(([name, mut, axis]) => {
  const inp = full(); mut(inp); const res = S.compute(inp);
  const a = ax(res, axis);
  check(`${name} → ${axis} 산출 불가`, a && a.status === S.AXIS_STATUS.NONE, `실제 ${a && a.status}`);
  check(`${name} → 전체가 ${DONE}가 아님`, res.status !== DONE, `실제 ${res.status}`);
  check(`${name} → NaN 없음`, !hasNaN(res));
});

console.log('── 12) 가짜 날짜 문자열 차단 ──');
[['존재하지 않는 날짜', '2026-02-30'], ['형식 위반', '2026/08/12'], ['빈 문자열', '']].forEach(([name, v]) => {
  const inp = full(); inp.meta.asOf = v; inp.meta.periodEnd = v; const res = S.compute(inp);
  check(`${name} → 전체 ${NONE}`, res.status === NONE, `실제 ${res.status}`);
});

console.log('── 13) 범주 판정·자동 대입 부재 ──');
{ const res = S.compute(full());
  const blob = JSON.stringify(res);
  check('낮음/높음·적합/부적합 없음', !/"낮음"|"높음"|적합|부적합/.test(blob));
  check('NaN 없음(완전 입력)', !hasNaN(res));
  const noPlan = full(); delete noPlan.risk.plannedLossDistance; delete noPlan.risk.lossBudget;
  const r2 = S.compute(noPlan);
  check('손실거리 없으면 축 간 산술 0', r2.derived.length === 0);
  check('ATR 자동 대입 안 함 고지', r2.notices.some(x => /자동 대입/.test(x))); }

console.log(`\n결과: 통과 ${pass} · 실패 ${fail}`);
process.exit(fail ? 1 : 0);
