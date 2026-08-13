/* SKHY 관측 대시보드 — 검증 게이트
 * 실행: node skhy-tracker/tools/verify.mjs   (실패 시 비0 종료)
 *
 * 이 게이트가 지키는 것 (Codex 2026-08-13 적대검토 Q10 경계):
 *  - 확보하지 못한 지표를 만들어내지 않았는가 (Gap·추정 ADS·경로 배지·신뢰도 라벨 부재)
 *  - 결측을 0이나 직전값으로 채우지 않았는가
 *  - 프리미엄을 단일 수치로 제시하지 않고 두 시점 정의를 병기했는가
 *  - 거래 규모를 실제 체결대금인 것처럼 표기하지 않았는가(proxy 명시)
 *  - 확정 수치가 원문 대조값과 일치하는가
 *  - 차단된 소스가 화면 계약에 남아 있는가
 *  - 수집 receipt가 완전한가
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'data', 'public');

const errors = [];
const E = (cond, msg) => { if (!cond) errors.push(msg); };
const read = f => {
  const p = path.join(PUB, f);
  if (!fs.existsSync(p)) { errors.push(`${f} 없음 — collect.mjs를 먼저 실행할 것`); return null; }
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { errors.push(`${f} JSON 파싱 실패: ${e.message}`); return null; }
};

const ts = read('timeseries.json');
const st = read('status.json');
const fa = read('facts.json');
const ev = read('events.json');
const fi = fs.existsSync(path.join(PUB, 'filings.json')) ? read('filings.json') : null;

/* ── 1) 확정 수치 — 원문 대조값과 일치해야 한다 ── */
const EXPECT = {
  '공모 전 발행총수 (issued)': 712702365,
  'IPO 신주': 17790000,
  '공모 후 발행총수 (issued)': 730492365,
  '공모 후 outstanding (자기주식 제외)': 728865500,
  '자기주식 (파생)': 1626865,
};
if (fa) {
  const got = Object.fromEntries((fa.shareCounts?.rows || []).map(r => [r.key, r.value]));
  Object.entries(EXPECT).forEach(([k, v]) => E(got[k] === v, `facts.shareCounts '${k}': ${got[k]} ≠ 원문 대조값 ${v}`));
  E(got['공모 전 발행총수 (issued)'] + got['IPO 신주'] === got['공모 후 발행총수 (issued)'],
    'facts.shareCounts: 공모 전 + 신주 ≠ 공모 후 (산술 불일치)');
  const d = fa.denominatorSwitch;
  E(!!d, 'facts.denominatorSwitch 누락');
  if (d) {
    d.rows.forEach(r => E(r.held + r.buyable === r.sum, `denominatorSwitch ${r.date}: 보유+매수가능 ≠ 합`));
    E(d.rows[1].sum - d.rows[0].sum === d.delta, 'denominatorSwitch: 두 합의 차 ≠ delta');
    E(d.delta === EXPECT['IPO 신주'], 'denominatorSwitch.delta ≠ IPO 신주');
    E(/역산/.test(d.warning || ''), 'denominatorSwitch.warning에 지분율 역산 금지 경고 없음');
  }
  E(!!fa.blockedMetric, 'facts.blockedMetric(판정 불가 카드) 누락');
  E(/1\/10|one-tenth|1\s*ADS\s*=\s*보통주\s*1\/10/.test(JSON.stringify(fa.adsStructure)), 'ADS 비율 1/10 표기 누락');
  E(/10배|1억 7,790만/.test(JSON.stringify(fa.adsStructure)), '원 스펙의 ADS 수량 10배 오류 정정 표기 누락');
  E(/issuer CIK/.test(JSON.stringify(fa.issuer)), 'F-6 archive registrant CIK 주의 표기 누락');
}

/* ── 2) 시계열 — 결측 정책과 두 정의 병기 ── */
if (ts) {
  E(Array.isArray(ts.rows) && ts.rows.length > 0, 'timeseries.rows 비어있음');
  E(!!ts.premiumDefinitions?.premiumSameLabel && !!ts.premiumDefinitions?.premiumKnownAtKrClose,
    '프리미엄 두 시점 정의가 모두 문서화되지 않음');
  const a = ts.summary?.premiumSameLabel, b = ts.summary?.premiumKnownAtKrClose;
  E(a && a.n > 0, 'premiumSameLabel 관측 0건');
  E(b && b.n > 0, 'premiumKnownAtKrClose 관측 0건');

  let filled = 0, nulls = 0, mismatched = 0;
  ts.rows.forEach(r => {
    ['premiumSameLabel', 'premiumKnownAtKrClose', 'usClose', 'krClose', 'usTurnoverProxyUsd'].forEach(k => {
      if (r[k] === null) nulls++;
      else if (r[k] === 0) filled++;                       // 0 대체 흔적
    });
    // 프리미엄이 계산 가능한 입력이 없는데 값이 있으면 조작
    if (r.premiumSameLabel != null && (r.usClose == null || r.fxSameLabel == null || r.krClose == null)) mismatched++;
    if (r.premiumKnownAtKrClose != null && (r.usPrevClose == null || r.fxPrevUsDay == null || r.krClose == null)) mismatched++;
  });
  E(nulls > 0, '결측이 하나도 없다 — 양 시장 휴장일이 다르므로 비정상. 보간·forward-fill 의심');
  E(filled === 0, `가격·프리미엄 필드에 0 값 ${filled}건 — 결측 0 대체 금지`);
  E(mismatched === 0, `입력이 없는데 프리미엄이 산출된 행 ${mismatched}건`);
  E(/보간|forward-fill/.test(ts.missingPolicy || ''), 'timeseries.missingPolicy에 보간 금지 명시 없음');
  E(/proxy/i.test(JSON.stringify(Object.keys(ts.rows[0] || {}))), '거래 규모 필드명에 proxy 표기 없음');
  E(/1 ADS = 1\/10|× 10/.test(ts.premiumFormula || ''), 'premiumFormula에 ADS 비율 표기 없음');
}

/* ── 3) 상태 — 차단 소스와 receipt ── */
if (st) {
  E(Array.isArray(st.sources) && st.sources.length >= 4, 'status.sources 부족');
  E(Array.isArray(st.blocked) && st.blocked.length >= 1, 'status.blocked 누락 — 차단된 핵심 지표를 숨기면 안 됨');
  E(st.blocked.some(b => /Gap/.test(b.consequence || '')), 'blocked에 Gap 산출 불가 결과가 명시되지 않음');
  E(typeof st.stalenessTtlHours === 'number' && st.stalenessTtlHours > 0, 'status.stalenessTtlHours 누락 — stale 표시 불가');
  E(Array.isArray(st.receipts) && st.receipts.length >= 4, 'receipts 부족');
  (st.receipts || []).forEach((r, i) => {
    ['id', 'url', 'fetchedAtUtc'].forEach(k => E(r[k], `receipts[${i}]: ${k} 누락`));
    E(r.error || (r.httpStatus === 200 && r.sha256 && r.bytes > 0), `receipts[${i}] ${r.id}: 성공인데 sha256/bytes 누락`);
  });
  st.sources.forEach(s => E(s.ok ? !!s.lastSuccessUtc : true, `sources ${s.id}: 성공인데 lastSuccessUtc 없음`));
}

/* ── 4) 이벤트 — 확정/관측/예정 구분과 시나리오 표기 ── */
if (ev) {
  const kinds = new Set(ev.rows.map(r => r.kind));
  E(kinds.has('confirmed') && kinds.has('scheduled'), 'events에 confirmed/scheduled 구분이 없음');
  ev.rows.forEach(r => E(['confirmed', 'observed', 'scheduled'].includes(r.kind), `events ${r.date}: kind 값 오류 ${r.kind}`));
  E(!!ev.scenarioNote && /확정.*아니|시나리오/.test(JSON.stringify(ev.scenarioNote)),
    'events.scenarioNote에 "확정 아님" 표기 없음');
  const smh = ev.rows.filter(r => /MVIS|SMH/.test(r.title));
  E(smh.every(r => r.kind === 'scheduled'), '지수 정기변경 항목이 confirmed로 표기됨 — 편입은 미확정');
}

/* ── 5) 페이지 텍스트 — 금지 표현이 부정 문맥 밖에서 나오면 안 된다 ── */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const NEG = /(?:하지\s*않|아니|없다|없습니다|불가|금지|못했|미확정|아님)/;
const FORBIDDEN = [
  ['경로\\s*[AB]\\s*우세', '경로 우세 판정'],
  ['파이프가?\\s*(?:열렸|막혔|열림|막힘)', '파이프 개폐 단정'],
  ['신뢰도\\s*(?:높음|중간|낮음|중\\b)', '신뢰도 라벨'],
  ['편입\\s*확정', '편입 확정 단정'],
  ['확정\\s*필요\\s*매수', '확정 매수액'],
];
/* 태그만 제거하고 스크립트 본문은 남긴다 — 템플릿 리터럴을 조각내면 부정 문맥이 끊긴다.
 * facts.json·events.json의 화면 노출 문구도 함께 스캔한다(실제로 렌더되는 텍스트이므로). */
const scanTarget = (html.replace(/<[^>]+>/g, ' ') + ' ' + JSON.stringify(fa || {}) + ' ' + JSON.stringify(ev || {}) + ' ' + JSON.stringify(st || {}))
  .replace(/\\n/g, ' ').replace(/\s+/g, ' ');
FORBIDDEN.forEach(([re, name]) => {
  const rx = new RegExp(re, 'g');
  let m;
  while ((m = rx.exec(scanTarget))) {
    const ctx = scanTarget.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70);
    if (!NEG.test(ctx)) errors.push(`금지 표현 「${name}」이 부정 문맥 밖에서 사용됨 — …${ctx.trim()}…`);
  }
});
E(/판정\s*불가/.test(scanTarget), '"판정 불가" 표기 없음');
E(/투자자문이\s*아니/.test(scanTarget), '투자자문 아님 고지 없음');
E(/proxy/i.test(scanTarget), '거래 규모 proxy 표기 없음');
E(/data\/public\//.test(html), 'index.html이 산출 JSON을 읽지 않음');
E(!/Math\.random/.test(html), 'index.html에 난수 사용 — 결정론 위반');

/* ── 6) 원본 응답이 공개 저장소에 커밋되지 않도록 ── */
const gi = path.join(ROOT, '.gitignore');
E(fs.existsSync(gi) && /data\/raw\//.test(fs.readFileSync(gi, 'utf8')), '.gitignore에 data/raw/ 누락 — 원본 응답이 공개 저장소에 커밋될 위험');

/* ── 결과 ── */
console.log(`검증 대상: timeseries ${ts?.rows?.length ?? 0}행 · sources ${st?.sources?.length ?? 0} · blocked ${st?.blocked?.length ?? 0} · receipts ${st?.receipts?.length ?? 0} · events ${ev?.rows?.length ?? 0} · filings ${fi?.rows?.length ?? '(없음)'}`);
if (ts?.summary) {
  const a = ts.summary.premiumSameLabel, b = ts.summary.premiumKnownAtKrClose;
  if (a) console.log(`  괴리 ① 동일라벨 : ${(a.min * 100).toFixed(2)}% ~ ${(a.max * 100).toFixed(2)}% · 평균 ${(a.mean * 100).toFixed(2)}% (n=${a.n})`);
  if (b) console.log(`  괴리 ② 기지     : ${(b.min * 100).toFixed(2)}% ~ ${(b.max * 100).toFixed(2)}% · 평균 ${(b.mean * 100).toFixed(2)}% (n=${b.n})`);
}
if (errors.length) {
  console.error(`\n❌ 검증 실패 (${errors.length}건):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✅ 관측 대시보드 검증 통과 — 확보하지 못한 지표를 만들어내지 않았음');
