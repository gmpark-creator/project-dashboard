/* Polaris Core — 파생 통계 베이크 스크립트 (결정론·재현가능)
 *
 * 입력: ../market-ledger/data.js (window.LEDGER) — 6월 1~12 실측·이중검증 OHLC.
 * 출력: ./derived-stats.generated.js (window.POLARIS_DERIVED)
 *
 * 계산 항목(전부 실측 데이터에 대한 결정론적 수식 — 추정·환각 0):
 *  1) 일간 수익률 정렬 시계열
 *  2) 상관행렬 (Pearson, 겹치는 거래일만)
 *  3) 미국→한국 오버나잇 전이 (SOX/SOXL 미국세션 D → 한국 익일 시가 갭)
 *  4) 종목별 실현 변동성/일중폭/상승하락일/거래량
 *
 * ⚠ 표본 = 2026년 6월 8~10 거래일(소표본). 통계적 일반화·예측 보장 아님 — '관측 기록'.
 *   실행: node data/build-derived.mjs  (재현)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = path.join(__dirname, '..', 'market-ledger', 'data.js');

// window 셰임 후 data.js 평가
const src = fs.readFileSync(LEDGER_PATH, 'utf8');
const win = {};
(new Function('window', src))(win);
const L = win.LEDGER;
if (!L) { console.error('LEDGER 로드 실패'); process.exit(1); }

// ---- 유틸 ----
const round = (x, n = 4) => (x == null || Number.isNaN(x)) ? null : Math.round(x * 10 ** n) / 10 ** n;
function mean(a) { const v = a.filter(x => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; }
function std(a) { const v = a.filter(x => x != null); if (v.length < 2) return null; const m = mean(v); return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1)); }
function pearson(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null && !Number.isNaN(x) && !Number.isNaN(y));
  if (pairs.length < 3) return { r: null, n: pairs.length };
  const x = pairs.map(p => p[0]), y = pairs.map(p => p[1]);
  const mx = mean(x), my = mean(y);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < x.length; i++) { num += (x[i] - mx) * (y[i] - my); dx += (x[i] - mx) ** 2; dy += (y[i] - my) ** 2; }
  const den = Math.sqrt(dx * dy);
  return { r: den === 0 ? null : round(num / den, 3), n: pairs.length };
}
function quantile(arr, q) {
  const v = arr.filter(x => x != null && !Number.isNaN(x)).slice().sort((a, b) => a - b);
  if (!v.length) return null;
  const pos = (v.length - 1) * q, base = Math.floor(pos), rest = pos - base;
  return round(v[base] + (v[base + 1] !== undefined ? rest * (v[base + 1] - v[base]) : 0), 3);
}
function median(arr) { return quantile(arr, 0.5); }
// 단순회귀 기울기 y = a + b x (전이 베타)
function slope(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null);
  if (pairs.length < 3) return { b: null, n: pairs.length };
  const x = pairs.map(p => p[0]), y = pairs.map(p => p[1]);
  const mx = mean(x), my = mean(y);
  let num = 0, den = 0;
  for (let i = 0; i < x.length; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) ** 2; }
  return { b: den === 0 ? null : round(num / den, 3), n: pairs.length };
}

// ---- 1) 일간 수익률 시계열 (date -> pct) ----
function rowsToMap(rows, dateKey, pctKey) { const m = {}; rows.forEach(r => { m[r[dateKey]] = r[pctKey]; }); return m; }
const idx = L.indices.rows;
const series = {
  SOX: rowsToMap(idx.SOX, 'date', 'chgPct'),
  IXIC: rowsToMap(idx.IXIC, 'date', 'chgPct'),
  GSPC: rowsToMap(idx.GSPC, 'date', 'chgPct'),
  SOXL: rowsToMap(L.us.soxl, 'date', 'regChgPct'),
  SOXS: rowsToMap(L.us.soxs, 'date', 'regChgPct'),
  SAMSUNG: rowsToMap(L.kospi.samsung, 'date', 'chgPct'),
  HYNIX: rowsToMap(L.kospi.hynix, 'date', 'chgPct'),
};
const allDates = [...new Set(Object.values(series).flatMap(m => Object.keys(m)))].sort();
function alignedReturns(name) { return allDates.map(d => series[name][d] ?? null); }

// ---- 2) 상관행렬 ----
const corrKeys = ['SOX', 'SOXL', 'SAMSUNG', 'HYNIX', 'IXIC', 'GSPC', 'SOXS'];
const corrMatrix = {};
for (const a of corrKeys) {
  corrMatrix[a] = {};
  for (const b of corrKeys) {
    corrMatrix[a][b] = pearson(alignedReturns(a), alignedReturns(b));
  }
}

// ---- 3) 미국→한국 오버나잇 전이 ----
// 미국 세션 date D (SOX·SOXL regChgPct) -> 한국 '다음 거래일' 시가 갭.
// 한국 시가 갭 = (open[D+1] - close[D]) / close[D] * 100  (전일 종가 대비 시가)
function krOpenGapSeries(rows) {
  const byDate = {}; rows.forEach(r => byDate[r.date] = r);
  const dates = rows.map(r => r.date).sort();
  const gap = {}; // gapForUsDate: 미국세션 D에 매핑되는 한국 시가갭(=한국 D 다음 거래일 시가갭). 단순화: 한국 거래일 t의 시가갭을 직전 한국종가 대비로 계산하고, 그 t를 미국세션 t-? 로 매핑.
  for (let i = 1; i < dates.length; i++) {
    const cur = byDate[dates[i]], prev = byDate[dates[i - 1]];
    gap[dates[i]] = round((cur.open - prev.close) / prev.close * 100, 3);
  }
  return gap; // key = 한국 거래일, value = 그날 시가갭%
}
const samsungGap = krOpenGapSeries(L.kospi.samsung);
const hynixGap = krOpenGapSeries(L.kospi.hynix);
// 미국세션 date D -> 한국 시가갭은 '같은 날짜 D'의 한국 거래일 시가갭에 대응(미국 D-1 야간이 한국 D 새벽이므로,
// 엄밀히는 미국세션 D의 영향은 한국 D+1 시가에 나타남). 두 가지 모두 계산해 정직하게 병기.
function transmission(usMap, krGapMap, lag) {
  // lag=0: 미국 date D vs 한국 date D 시가갭(미국 D-1 야간 영향 근사)
  // lag=1: 미국 date D vs 한국 date D+1 시가갭(미국 D 세션이 한국 다음 거래일 시가에)
  const usDates = Object.keys(usMap).sort();
  const krDates = Object.keys(krGapMap).sort();
  const xs = [], ys = [];
  for (const d of usDates) {
    let target = d;
    if (lag === 1) {
      const after = krDates.filter(k => k > d).sort();
      target = after[0];
    }
    if (target && krGapMap[target] != null && usMap[d] != null) { xs.push(usMap[d]); ys.push(krGapMap[target]); }
  }
  const r = pearson(xs, ys), b = slope(xs, ys);
  // 부호 일치율(미국 상승 → 한국 시가 상승 갭)
  const signPairs = xs.map((x, i) => [x, ys[i]]);
  const agree = signPairs.filter(([x, y]) => Math.sign(x) === Math.sign(y)).length;
  return { r: r.r, n: r.n, slope: b.b, signHitRate: signPairs.length ? round(agree / signPairs.length, 3) : null };
}
const transmissionStats = {
  note: 'lag0=미국 date D vs 한국 같은날 시가갭(전야 영향 근사), lag1=미국 date D 세션 vs 한국 다음 거래일 시가갭. 소표본 주의.',
  SOX_to_SAMSUNG: { lag0: transmission(series.SOX, samsungGap, 0), lag1: transmission(series.SOX, samsungGap, 1) },
  SOX_to_HYNIX: { lag0: transmission(series.SOX, hynixGap, 0), lag1: transmission(series.SOX, hynixGap, 1) },
  SOXL_to_SAMSUNG: { lag0: transmission(series.SOXL, samsungGap, 0), lag1: transmission(series.SOXL, samsungGap, 1) },
  SOXL_to_HYNIX: { lag0: transmission(series.SOXL, hynixGap, 0), lag1: transmission(series.SOXL, hynixGap, 1) },
};

// ---- 4) 종목별 실현 통계 ----
function kospiStats(rows) {
  const chg = rows.map(r => r.chgPct);
  const rangePct = rows.map(r => round((r.high - r.low) / r.close * 100, 3)); // 일중폭/종가
  const gapMap = krOpenGapSeries(rows);
  const gaps = Object.values(gapMap);
  return {
    days: rows.length,
    meanChgPct: round(mean(chg), 3), stdChgPct: round(std(chg), 3),
    upDays: chg.filter(x => x > 0).length, downDays: chg.filter(x => x < 0).length,
    maxUpPct: round(Math.max(...chg), 2), maxDownPct: round(Math.min(...chg), 2),
    avgRangePct: round(mean(rangePct), 3), maxRangePct: round(Math.max(...rangePct), 3),
    avgGapPct: round(mean(gaps), 3), maxAbsGapPct: round(Math.max(...gaps.map(Math.abs)), 3),
    avgVolume: Math.round(mean(rows.map(r => r.volume))),
  };
}
function usStats(rows) {
  const chg = rows.map(r => r.regChgPct);
  const extVsReg = rows.map(r => r.extVsRegPct).filter(x => x != null);
  return {
    days: rows.length,
    meanRegChgPct: round(mean(chg), 3), stdRegChgPct: round(std(chg), 3),
    meanAbsRegChgPct: round(mean(chg.map(Math.abs)), 3),
    upDays: chg.filter(x => x > 0).length, downDays: chg.filter(x => x < 0).length,
    maxUpPct: round(Math.max(...chg), 2), maxDownPct: round(Math.min(...chg), 2),
    avgExtVsRegPct: round(mean(extVsReg), 3), // 시간외 종가 vs 본장 종가 (야간 반전 경향)
    avgVolume: Math.round(mean(rows.map(r => r.vol))),
  };
}
const perSymbol = {
  SAMSUNG: kospiStats(L.kospi.samsung),
  HYNIX: kospiStats(L.kospi.hynix),
  SOXL: usStats(L.us.soxl),
  SOXS: usStats(L.us.soxs),
};

// ---- 5) rules.json용 분위수 임계값 (실측 계산) ----
const soxChg = idx.SOX.map(r => r.chgPct);
const ixicChg = idx.IXIC.map(r => r.chgPct);
const soxlReg = L.us.soxl.map(r => r.regChgPct);
const soxsReg = L.us.soxs.map(r => r.regChgPct);
// inverseError = |SOXL+SOXS| (날짜 정렬)
const soxsByDate = {}; L.us.soxs.forEach(r => soxsByDate[r.date] = r);
const inverseError = L.us.soxl.map(r => { const s = soxsByDate[r.date]; return s ? Math.abs(r.regChgPct + s.regChgPct) : null; });
// 시간외 압력 |extVsRegPct| (SOXL·SOXS 풀)
const extAbs = [...L.us.soxl, ...L.us.soxs].map(r => r.extVsRegPct == null ? null : Math.abs(r.extVsRegPct));
// 한국 시가갭 |%| (삼성·하이닉스 풀)
const krGapAbs = [...Object.values(samsungGap), ...Object.values(hynixGap)].map(Math.abs);
// 반도체 리더십 lead = SOX - IXIC (날짜 정렬)
const ixicByDate = {}; idx.IXIC.forEach(r => ixicByDate[r.date] = r);
const lead = idx.SOX.map(r => { const x = ixicByDate[r.date]; return x ? round(r.chgPct - x.chgPct, 3) : null; });
// 일별 flip 총수 (US=soxl+soxs, KR=samsung+hynix)
const usFlipTotals = [...L.us.soxl, ...L.us.soxs].map(r => (r.flips?.totalUp || 0) + (r.flips?.totalDown || 0));
const krFlipTotals = [...L.kospi.samsung, ...L.kospi.hynix].map(r => (r.flips?.totalUp || 0) + (r.flips?.totalDown || 0));
// crossings |pct| 중앙값 (제로 근접도용)
const usCrossAbs = [...L.us.soxl, ...L.us.soxs].flatMap(r => (r.flips?.crossings || []).map(c => Math.abs(c.pct)));
const krCrossAbs = [...L.kospi.samsung, ...L.kospi.hynix].flatMap(r => (r.flips?.crossings || []).map(c => Math.abs(c.pct)));

const quantiles = {
  note: '임계값 산출용 실측 분위수. 각 항목 computedFrom·n 표기. 소표본(n<20) — exploratory.',
  SOX_chgPct: { p25: quantile(soxChg, .25), p50: quantile(soxChg, .5), p75: quantile(soxChg, .75), n: soxChg.length, computedFrom: 'LEDGER.indices.rows.SOX[].chgPct' },
  SOX_absChgPct: { p50: quantile(soxChg.map(Math.abs), .5), p75: quantile(soxChg.map(Math.abs), .75), n: soxChg.length, computedFrom: '|LEDGER.indices.rows.SOX[].chgPct|' },
  SOXL_regChgPct: { p25: quantile(soxlReg, .25), p75: quantile(soxlReg, .75), n: soxlReg.length, computedFrom: 'LEDGER.us.soxl[].regChgPct' },
  SOXS_regChgPct: { p25: quantile(soxsReg, .25), p75: quantile(soxsReg, .75), n: soxsReg.length, computedFrom: 'LEDGER.us.soxs[].regChgPct' },
  inverseError: { p75: quantile(inverseError, .75), p90: quantile(inverseError, .9), n: inverseError.filter(x => x != null).length, computedFrom: '|SOXL.regChgPct + SOXS.regChgPct|' },
  extVsRegAbs: { p50: quantile(extAbs, .5), p75: quantile(extAbs, .75), n: extAbs.filter(x => x != null).length, computedFrom: '|SOXL/SOXS extVsRegPct| 풀' },
  KR_gapAbs: { p50: quantile(krGapAbs, .5), p75: quantile(krGapAbs, .75), n: krGapAbs.length, computedFrom: '|(open-prevClose)/prevClose| 삼성·하이닉스 풀' },
  lead_SOX_minus_IXIC: { p25: quantile(lead, .25), p75: quantile(lead, .75), n: lead.filter(x => x != null).length, computedFrom: 'SOX.chgPct − IXIC.chgPct' },
  flipTotal_US: { p90: quantile(usFlipTotals, .9), n: usFlipTotals.length, computedFrom: 'soxl+soxs flips.totalUp+totalDown' },
  flipTotal_KR: { p90: quantile(krFlipTotals, .9), n: krFlipTotals.length, computedFrom: 'samsung+hynix flips.totalUp+totalDown' },
  crossAbsPct_US: { p50: median(usCrossAbs), n: usCrossAbs.length, computedFrom: '|crossings.pct| soxl+soxs' },
  crossAbsPct_KR: { p50: median(krCrossAbs), n: krCrossAbs.length, computedFrom: '|crossings.pct| samsung+hynix' },
};

// ---- 출력 ----
const out = {
  asOf: L.asOf,
  pricePeriod: L.pricePeriod,
  generatedFrom: 'market-ledger/data.js (window.LEDGER) — 실측·이중검증',
  formula: {
    correlation: 'Pearson r, 겹치는 거래일 일간수익률. SOX/IXIC/GSPC=지수 chgPct, SOXL/SOXS=regChgPct(본장), 삼성/하이닉스=chgPct.',
    transmission: 'krOpenGap%=(open-전일close)/전일close*100. 미국세션 vs 한국 시가갭의 Pearson r·회귀기울기·부호일치율.',
    rangePct: 'KOSPI 일중폭%=(high-low)/close*100 (ATR 근사). 미국 rows엔 일중 H/L 부재 → meanAbsRegChgPct를 변동성 프록시로.',
  },
  caveat: '표본=2026-06 8~10 거래일. 소표본 — 통계적 일반화/예측 보장 아님. 관측 기록 + 교육용. 투자자문 아님.',
  dates: allDates,
  correlationMatrix: corrMatrix,
  transmission: transmissionStats,
  perSymbol,
  quantiles,
};

const banner = `/* Polaris Core — 파생 통계 (자동생성, 수정 금지)\n   생성: data/build-derived.mjs · 입력: market-ledger/data.js(실측)\n   ${out.caveat} */\n`;
fs.writeFileSync(path.join(__dirname, 'derived-stats.generated.js'),
  banner + 'window.POLARIS_DERIVED = ' + JSON.stringify(out, null, 2) + ';\n', 'utf8');

// 콘솔 요약
console.log('=== POLARIS_DERIVED 생성 완료 ===');
console.log('dates:', allDates.join(', '));
console.log('\n-- 상관행렬 (r) --');
for (const a of corrKeys) console.log(a.padEnd(8), corrKeys.map(b => String(corrMatrix[a][b].r).padStart(7)).join(' '));
console.log('\n-- 전이 (SOX/SOXL 미국세션 → 한국 시가갭) --');
console.log(JSON.stringify(transmissionStats, null, 1));
console.log('\n-- 종목별 통계 --');
console.log(JSON.stringify(perSymbol, null, 1));
console.log('\n-- rules.json용 분위수 --');
console.log(JSON.stringify(quantiles, null, 1));
