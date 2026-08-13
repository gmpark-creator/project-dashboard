/* SKHY 관측 대시보드 — 데이터 수집기
 * 실행: node skhy-tracker/tools/collect.mjs
 *
 * 범위(Codex 2026-08-13 적대검토 Q10 허용 목록):
 *   SEC 제출 로그 · 프리미엄 관측(두 시점 정의 병기) · 거래량 turnover proxy · 소스 상태
 * 범위 밖(수집하지 않는다):
 *   외국인 보유주식수 / 외국인 순매수 → KRX 통계 API가 인증 뒤로 이동했고,
 *   자동수집·공개 재배포가 허용된 합법 경로가 확인되지 않았다. 추정·대체·보간하지 않는다.
 *
 * 규율:
 *  - 데이터를 지어내지 않는다. 실패는 null로 남기고 status에 기록한다(조용한 실패 금지).
 *  - 모든 외부 호출은 receipt(URL·수집시각 UTC·HTTP status·바이트수·SHA-256)를 남긴다.
 *  - 원본 응답은 data/raw/ 에 저장하되 공개 저장소에 커밋하지 않는다(.gitignore).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'data', 'public');
const RAW = path.join(ROOT, 'data', 'raw');
const NOW = new Date().toISOString();
const SEC_UA = 'SKHY-Tracker research (contact: matt.4lab@gmail.com)';

fs.mkdirSync(PUB, { recursive: true });
fs.mkdirSync(RAW, { recursive: true });

const receipts = [];
const sources = [];

async function grab({ id, label, url, headers, saveAs }) {
  const startedAt = new Date().toISOString();
  let status = null, body = null, err = null;
  try {
    const res = await fetch(url, { headers: headers || {} });
    status = res.status;
    body = await res.text();
    if (!res.ok) err = `HTTP ${status}`;
  } catch (e) {
    err = `${e.name}: ${e.message}`;
  }
  const bytes = body ? Buffer.byteLength(body, 'utf8') : 0;
  const sha = body ? crypto.createHash('sha256').update(body, 'utf8').digest('hex') : null;
  receipts.push({ id, url, fetchedAtUtc: startedAt, httpStatus: status, bytes, sha256: sha, error: err });
  if (body && saveAs) fs.writeFileSync(path.join(RAW, saveAs), body, 'utf8');
  sources.push({ id, label, ok: !err, httpStatus: status, lastSuccessUtc: err ? null : startedAt, error: err });
  if (err) console.error(`  ✗ ${id}: ${err}`);
  else console.log(`  ✓ ${id}: HTTP ${status} · ${bytes.toLocaleString()}B`);
  return err ? null : body;
}

const isoDay = sec => new Date(sec * 1000).toISOString().slice(0, 10);

/* ── Yahoo 일봉 ── */
async function yahooDaily(symbol, id, label) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=3mo&interval=1d`;
  const body = await grab({ id, label, url, headers: { 'User-Agent': 'Mozilla/5.0' }, saveAs: `${id}.json` });
  if (!body) return null;
  let j;
  try { j = JSON.parse(body); } catch { return null; }
  const r = j?.chart?.result?.[0];
  if (!r) return null;
  const q = r.indicators?.quote?.[0] || {};
  const out = new Map();
  (r.timestamp || []).forEach((ts, i) => {
    const c = q.close?.[i], v = q.volume?.[i];
    if (c == null) return;                       // 결측은 남긴다. 보간·forward-fill 금지
    out.set(isoDay(ts), { close: c, volume: v ?? null });
  });
  return { series: out, meta: { symbol: r.meta?.symbol, currency: r.meta?.currency, exchange: r.meta?.fullExchangeName } };
}

console.log('── 수집 ──');
const skhy = await yahooDaily('SKHY', 'yahoo-skhy', 'SKHY 일봉 (Yahoo)');
const kospi = await yahooDaily('000660.KS', 'yahoo-000660', '본주 000660 일봉 (Yahoo)');
const fx = await yahooDaily('KRW=X', 'yahoo-krwx', 'USD/KRW 일봉 (Yahoo KRW=X)');

/* ── 보조 FX (교차 확인용, 같은 as-of끼리 비교) ── */
const fxAltBody = await grab({
  id: 'frankfurter-fx', label: 'USD/KRW 교차확인 (Frankfurter/ECB)',
  url: 'https://api.frankfurter.dev/v1/2026-07-10..?base=USD&symbols=KRW', saveAs: 'frankfurter.json',
});
let fxAlt = null;
try { fxAlt = fxAltBody ? JSON.parse(fxAltBody).rates : null; } catch { fxAlt = null; }

/* ── SEC 제출 ── */
const secBody = await grab({
  id: 'sec-submissions', label: 'SEC EDGAR 제출 (CIK 0002120882)',
  url: 'https://data.sec.gov/submissions/CIK0002120882.json',
  headers: { 'User-Agent': SEC_UA }, saveAs: 'sec-submissions.json',
});

let filings = null;
if (secBody) {
  const d = JSON.parse(secBody);
  const rec = d.filings.recent;
  const rows = rec.form.map((form, i) => ({
    form,
    filingDate: rec.filingDate[i],
    accession: rec.accessionNumber[i],
    primaryDoc: rec.primaryDocument[i],
    description: rec.primaryDocDescription[i] || null,
    /* ⚠️ archive URL은 issuer CIK가 아니라 실제 archive 경로를 써야 한다.
       F-6는 archive registrant CIK(1472033)가 issuer CIK(2120882)와 다르다(Codex 지적).
       따라서 조립 대신 SEC 인덱스 페이지 링크만 제공한다. */
    indexUrl: `https://www.sec.gov/Archives/edgar/data/${Number(d.cik)}/${rec.accessionNumber[i].replace(/-/g, '')}/`,
  }));
  filings = {
    asOfUtc: NOW,
    issuer: { name: d.name, cik: d.cik, tickers: d.tickers, exchanges: d.exchanges },
    note: 'F-6 계열의 archive registrant CIK는 issuer CIK와 다를 수 있어 문서 직링크를 조립하지 않고 인덱스 링크만 제공한다.',
    f6Count: rows.filter(r => r.form.startsWith('F-6')).length,
    rows: rows.slice(0, 40),
  };
}

/* ── 프리미엄 — 두 시점 정의를 반드시 병기 ──
 * D1 "동일 날짜 라벨": 한국 D일 종가 ↔ 미국 D일 종가 (미국 종가는 한국시간 D+1 새벽)
 * D2 "한국 종가 시점 기지(旣知)": 한국 D일 종가 ↔ 그 시점에 이미 알려진 직전 미국 종가
 * 어느 쪽도 동시 가격이 아니다. 두 값을 함께 보여주고 차이를 비동시성 구간으로 표시한다.
 */
function buildTimeseries() {
  if (!skhy || !kospi || !fx) return null;
  const usDays = [...skhy.series.keys()].sort();
  const krDays = [...kospi.series.keys()].sort();
  const rows = [];
  for (const d of krDays) {
    const kr = kospi.series.get(d);
    const usSame = skhy.series.get(d) || null;
    const prevUs = usDays.filter(x => x < d).pop() || null;
    const usPrev = prevUs ? skhy.series.get(prevUs) : null;
    const fxSame = fx.series.get(d)?.close ?? null;
    const fxPrev = prevUs ? (fx.series.get(prevUs)?.close ?? null) : null;

    const p1 = (usSame && fxSame && kr?.close) ? (usSame.close * 10 * fxSame) / kr.close - 1 : null;
    const p2 = (usPrev && fxPrev && kr?.close) ? (usPrev.close * 10 * fxPrev) / kr.close - 1 : null;

    rows.push({
      date: d,
      krClose: kr?.close ?? null,
      krVolume: kr?.volume ?? null,
      usClose: usSame?.close ?? null,
      usVolume: usSame?.volume ?? null,
      usPrevDate: prevUs,
      usPrevClose: usPrev?.close ?? null,
      fxSameLabel: fxSame,
      fxPrevUsDay: fxPrev,
      premiumSameLabel: p1,
      premiumKnownAtKrClose: p2,
      /* turnover는 실제 체결대금이 아니라 종가×거래량 proxy임을 필드명에 박아둔다 */
      usTurnoverProxyUsd: (usSame?.close != null && usSame?.volume != null) ? usSame.close * usSame.volume : null,
    });
  }
  return rows;
}

const rows = buildTimeseries();
const prem = k => rows ? rows.map(r => r[k]).filter(v => v != null) : [];
const stat = a => a.length ? { n: a.length, min: Math.min(...a), max: Math.max(...a), mean: a.reduce((s, x) => s + x, 0) / a.length } : null;

const turn = rows ? rows.map(r => r.usTurnoverProxyUsd).filter(v => v != null) : [];

const timeseries = {
  asOfUtc: NOW,
  disclaimer: '연구·교육 전용. 투자자문이 아니며 추천·목표가·승률·자동주문을 제공하지 않습니다.',
  premiumFormula: 'premium = (SKHY종가 × 10 × USDKRW) / 본주종가 − 1   (1 ADS = 1/10 보통주)',
  premiumDefinitions: {
    premiumSameLabel: '한국 D일 종가 ↔ 미국 D일 종가(한국시간 D+1 새벽). 캘린더 라벨 조인이며 동시 가격이 아님.',
    premiumKnownAtKrClose: '한국 D일 종가 ↔ 그 시점에 이미 알려진 직전 미국 종가. 실시간으로 관측 가능한 조합.',
  },
  missingPolicy: '결측은 null로 남긴다. 보간·forward-fill·0 대체를 하지 않는다. 차트에서 선이 끊어져 보이는 것이 정상이다.',
  summary: {
    premiumSameLabel: stat(prem('premiumSameLabel')),
    premiumKnownAtKrClose: stat(prem('premiumKnownAtKrClose')),
    usTurnoverProxyUsd: stat(turn),
  },
  fxCrossCheck: (() => {
    if (!fxAlt || !fx) return null;
    const out = [];
    for (const [d, v] of Object.entries(fxAlt)) {
      const y = fx.series.get(d)?.close;
      if (y != null) out.push({ date: d, yahoo: y, frankfurter: v.KRW, diffPct: (y / v.KRW - 1) * 100 });
    }
    const last = out.slice(-5);
    return { note: '같은 as-of끼리만 비교한다.', rows: last };
  })(),
  rows: rows || [],
};

/* ── 상태 + receipt ── */
const status = {
  asOfUtc: NOW,
  stalenessTtlHours: 30,
  sources,
  receipts,
  blocked: [{
    id: 'krx-foreign-holdings',
    label: '외국인 보유주식수 · 외국인 순매수 (KRX)',
    state: 'BLOCKED',
    reason: 'data.krx.co.kr 통계 API가 인증 뒤로 이동(HTTP 400 · 본문 "LOGOUT"). 쿠키·Referer·AJAX 헤더 선행에도 동일. KRX OpenAPI 서비스 목록에 해당 필드가 없음.',
    consequence: 'Gap(Δ외국인보유 − 외국인순매수) 산출 불가 → 경로 A/B 판별 불가. 추정·대체 소스로 채우지 않는다.',
  }],
};

fs.writeFileSync(path.join(PUB, 'timeseries.json'), JSON.stringify(timeseries, null, 2), 'utf8');
if (filings) fs.writeFileSync(path.join(PUB, 'filings.json'), JSON.stringify(filings, null, 2), 'utf8');
fs.writeFileSync(path.join(PUB, 'status.json'), JSON.stringify(status, null, 2), 'utf8');

console.log('\n── 산출 ──');
console.log(`  timeseries.json  행 ${timeseries.rows.length} · 프리미엄(동일라벨) ${timeseries.summary.premiumSameLabel?.n ?? 0}건 · (기지) ${timeseries.summary.premiumKnownAtKrClose?.n ?? 0}건`);
if (timeseries.summary.premiumSameLabel) {
  const s = timeseries.summary.premiumSameLabel, k = timeseries.summary.premiumKnownAtKrClose;
  console.log(`    동일라벨 ${(s.min * 100).toFixed(2)}% ~ ${(s.max * 100).toFixed(2)}% · 평균 ${(s.mean * 100).toFixed(2)}%`);
  console.log(`    기 지     ${(k.min * 100).toFixed(2)}% ~ ${(k.max * 100).toFixed(2)}% · 평균 ${(k.mean * 100).toFixed(2)}%`);
}
if (filings) console.log(`  filings.json     ${filings.rows.length}건 (F-6 계열 ${filings.f6Count})`);
console.log(`  status.json      소스 ${sources.length} · 실패 ${sources.filter(s => !s.ok).length} · 차단 ${status.blocked.length}`);
