/* chart-playbook/data/scenarios.js 원본 생성 — 순수 함수 (파일을 쓰지 않는다)
 *
 * 쓰기는 gen-scenarios.mjs가, 대조는 verify-all.mjs가 한다.
 * read-only 환경에서도 검증이 가능하도록 생성과 쓰기를 분리했다(사후검수 지적 11).
 *
 * 설계 요점 (Codex R5 체크리스트 15):
 *  - 짝(성공/실패)은 같은 LCG 시드로 「컷오프 이전 봉을 완전히 동일하게」 생성한다.
 *  - 컷오프 이후에만 분기한다. outcomeRole만 다르다.
 *  - Math.random 미사용. 시드 고정 LCG만 사용 → 재실행해도 바이트 동일.
 */
import crypto from 'node:crypto';

/* ── RFC 8785 JCS (검증기와 동일 구현) ── */
export function jcs(v) {
  if (v === null) return 'null';
  const t = typeof v;
  if (t === 'boolean') return v ? 'true' : 'false';
  if (t === 'number') { if (!Number.isFinite(v)) throw new Error('JCS non-finite'); return Object.is(v, -0) ? '0' : String(v); }
  if (t === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(jcs).join(',') + ']';
  if (t === 'object') return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + jcs(v[k])).join(',') + '}';
  throw new Error('JCS unsupported ' + t);
}
export const hash = o => crypto.createHash('sha256').update(jcs(o), 'utf8').digest('hex');

function lcg(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const r2 = x => Math.round(x * 100) / 100;

function toBars(closes, rnd, baseVol) {
  const bars = [];
  let prevClose = closes[0];
  for (let i = 0; i < closes.length; i++) {
    const c = closes[i];
    const o = i === 0 ? c * (1 - 0.002) : prevClose;
    const span = Math.abs(c - o) + c * (0.004 + rnd() * 0.006);
    const hi = Math.max(o, c) + span * (0.25 + rnd() * 0.5);
    const lo = Math.min(o, c) - span * (0.25 + rnd() * 0.5);
    const vol = Math.round(baseVol * (0.7 + rnd() * 0.6));
    bars.push([r2(o), r2(hi), r2(lo), r2(c), vol]);
    prevClose = c;
  }
  return bars;
}

const SHAPES = {
  'ma-pullback': { seed: 20260813, baseVol: 120000, cutoff: 17,
    pre(rnd) { const out = []; let p = 100;
      for (let i = 0; i < 10; i++) { p += 1.1 + rnd() * 0.7; out.push(p); }
      for (let i = 0; i < 8; i++) { p -= 0.55 + rnd() * 0.35; out.push(p); }
      return out; },
    post: {
      followThrough(rnd, last) { const out = []; let p = last; for (let i = 0; i < 10; i++) { p += 0.9 + rnd() * 0.8; out.push(p); } return out; },
      failure(rnd, last) { const out = []; let p = last; for (let i = 0; i < 10; i++) { p -= 0.85 + rnd() * 0.7; out.push(p); } return out; } } },
  'range-breakout': { seed: 20260814, baseVol: 95000, cutoff: 17,
    pre(rnd) { const out = []; const mid = 50;
      for (let i = 0; i < 18; i++) { const amp = 1.6 - i * 0.05; out.push(mid + Math.sin(i * 1.1) * amp + (rnd() - 0.5) * 0.35); }
      return out; },
    post: {
      followThrough(rnd, last) { const out = []; let p = last; for (let i = 0; i < 10; i++) { p += 0.7 + rnd() * 0.55; out.push(p); } return out; },
      failure(rnd, last) { const out = []; let p = last + 1.3; for (let i = 0; i < 10; i++) { p -= 0.45 + rnd() * 0.5; out.push(p); } return out; } } },
  'breakout-retest': { seed: 20260815, baseVol: 140000, cutoff: 17,
    pre(rnd) { const out = []; let p = 30;
      for (let i = 0; i < 8; i++) { p += (rnd() - 0.5) * 0.5; out.push(p); }
      for (let i = 0; i < 4; i++) { p += 1.0 + rnd() * 0.5; out.push(p); }
      for (let i = 0; i < 6; i++) { p -= 0.5 + rnd() * 0.3; out.push(p); }
      return out; },
    post: {
      followThrough(rnd, last) { const out = []; let p = last; for (let i = 0; i < 10; i++) { p += 0.75 + rnd() * 0.6; out.push(p); } return out; },
      failure(rnd, last) { const out = []; let p = last; for (let i = 0; i < 10; i++) { p -= 0.7 + rnd() * 0.55; out.push(p); } return out; } } },
  'opening-range': { seed: 20260816, baseVol: 260000, cutoff: 11,
    pre(rnd) { const out = []; const base = 75;
      for (let i = 0; i < 12; i++) out.push(base + Math.sin(i * 1.5) * 0.9 + (rnd() - 0.5) * 0.4);
      return out; },
    post: {
      followThrough(rnd, last) { const out = []; let p = last; for (let i = 0; i < 12; i++) { p += 0.42 + rnd() * 0.35; out.push(p); } return out; },
      failure(rnd, last) { const out = []; let p = last + 0.9; for (let i = 0; i < 12; i++) { p -= 0.3 + rnd() * 0.3; out.push(p); } return out; } } },
};

const SPECS = {
  'pc.ma-pullback': { id: 'pc.ma-pullback', observationCutoff: 17, timeframe: '1d', session: 'regular', market: 'anonymous', instrumentType: 'equity', adjustment: 'adjusted',
    priorTrend: 'up', levelContext: '단기 이동평균 부근까지 되밀림', volumeContext: '되밀림 구간에서 거래량 감소', barsBeforeCutoff: 18, notes: '컷오프 이전 관측만 기술한다. 이후 봉·결과를 참조하지 않는다.' },
  'pc.range-breakout': { id: 'pc.range-breakout', observationCutoff: 17, timeframe: '1d', session: 'regular', market: 'anonymous', instrumentType: 'equity', adjustment: 'adjusted',
    priorTrend: 'sideways', levelContext: '고점·저점이 비슷한 자리에서 반복 정지, 범위 축소', volumeContext: '구간 내부 거래량 축소', barsBeforeCutoff: 18, notes: '컷오프 이전 관측만 기술한다. 이후 봉·결과를 참조하지 않는다.' },
  'pc.breakout-retest': { id: 'pc.breakout-retest', observationCutoff: 17, timeframe: '1d', session: 'regular', market: 'anonymous', instrumentType: 'equity', adjustment: 'adjusted',
    priorTrend: 'up', levelContext: '구간 상단 이탈 후 경계 부근으로 회귀', volumeContext: '회귀 구간 거래량이 이탈 봉보다 적음', barsBeforeCutoff: 18, notes: '컷오프 이전 관측만 기술한다. 이후 봉·결과를 참조하지 않는다.' },
  'pc.opening-range': { id: 'pc.opening-range', observationCutoff: 11, timeframe: '5m', session: 'regular', market: 'anonymous', instrumentType: 'equity', adjustment: 'adjusted',
    priorTrend: 'none', levelContext: '개장 직후 구간의 고가·저가 확정', volumeContext: '개장 구간에 거래량 집중', barsBeforeCutoff: 12, notes: '컷오프 이전 관측만 기술한다. 이후 봉·결과를 참조하지 않는다.' },
};

const META = {
  'ma-pullback': { core: 'setup.ma-pullback', spec: 'pc.ma-pullback', rule: 'gr.pullback-v1', tf: '1d', label: '이동평균 되돌림' },
  'range-breakout': { core: 'setup.range-breakout', spec: 'pc.range-breakout', rule: 'gr.range-v1', tf: '1d', label: '박스권 이탈' },
  'breakout-retest': { core: 'setup.breakout-retest', spec: 'pc.breakout-retest', rule: 'gr.retest-v1', tf: '1d', label: '이탈 후 재확인' },
  'opening-range': { core: 'setup.opening-range', spec: 'pc.opening-range', rule: 'gr.openrange-v1', tf: '5m', label: '개장 레인지 이탈' },
};

/** 시나리오 배열과 파일 원본 문자열을 만든다. 부작용 없음. */
export function buildScenariosSource() {
  const scenarios = [];
  for (const [key, shape] of Object.entries(SHAPES)) {
    const m = META[key], specHash = hash(SPECS[m.spec]);
    for (const role of ['followThrough', 'failure']) {
      const rnd = lcg(shape.seed);                       // 짝마다 같은 시드 → pre 구간 동일
      const preCloses = shape.pre(rnd);
      const preBars = toBars(preCloses, rnd, shape.baseVol);
      const postCloses = shape.post[role](rnd, preCloses[preCloses.length - 1]);
      const postBars = toBars(postCloses, rnd, shape.baseVol);
      scenarios.push({
        id: `scn.${key}.${role === 'followThrough' ? 'follow' : 'fail'}`,
        label: `${m.label} — ${role === 'followThrough' ? '이어진 경우' : '이어지지 않은 경우'}`,
        dataKind: 'synthetic', timeframe: m.tf, session: 'regular', timezone: 'Asia/Seoul', adjustment: 'adjusted',
        generationRuleId: m.rule, preconditionSpecId: m.spec, preconditionHash: specHash,
        outcomeRole: role, pairedWithId: `scn.${key}.${role === 'followThrough' ? 'fail' : 'follow'}`,
        cutoffIndex: shape.cutoff, coreRefs: [m.core, 'limit.synthetic-not-evidence', 'limit.balanced-examples'],
        ohlc: preBars.concat(postBars),
      });
    }
  }

  /* 자체 확인: 짝의 컷오프 이전 봉이 실제로 동일한가 */
  for (const key of Object.keys(SHAPES)) {
    const a = scenarios.find(s => s.id === `scn.${key}.follow`);
    const b = scenarios.find(s => s.id === `scn.${key}.fail`);
    const n = SHAPES[key].cutoff + 1;
    if (JSON.stringify(a.ohlc.slice(0, n)) !== JSON.stringify(b.ohlc.slice(0, n))) {
      throw new Error(`${key}: 짝의 컷오프 이전 봉이 다름`);
    }
  }

  const fmtBar = b => `[${b[0]},${b[1]},${b[2]},${b[3]},${b[4]}]`;
  const source = `/* Polaris Chart Playbook — 합성 시나리오 (window.POLARIS_SCENARIOS)
 *
 * ⚠ 전부 합성 데이터다. 실제 시세가 아니며 성과·성공률의 근거가 아니다.
 * 생성: chart-playbook/tools/gen-scenarios.mjs (시드 고정 LCG, Math.random 미사용 → 재실행 시 바이트 동일)
 *
 * 짝(성공/실패)은 같은 생성 규칙·같은 시드로 「관측 컷오프 이전 봉을 완전히 동일하게」 만든다.
 * 컷오프 이후에만 분기하므로 동일 사전조건이 구조적으로 보장된다.
 * preconditionHash = RFC 8785 JCS → UTF-8 → SHA-256(lowercase hex). 검증기가 원본에서 재계산해 대조한다.
 *
 * ohlc 원소 = [시가, 고가, 저가, 종가, 거래량]
 */
window.POLARIS_SCENARIOS = {
  meta: {
    asOf: '2026-08-13',
    generator: 'chart-playbook/tools/gen-scenarios.mjs',
    hashSpec: 'RFC 8785 JCS -> UTF-8 -> SHA-256 (lowercase hex)',
    disclaimer: '합성 · 교육용. 실제 시세가 아니며 성과의 증거가 아닙니다.',
  },
  preconditionSpecs: {
${Object.entries(SPECS).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v, null, 6).replace(/\n/g, '\n    ')},`).join('\n')}
  },
  scenarios: [
${scenarios.map(s => `    {
      id: ${JSON.stringify(s.id)},
      label: ${JSON.stringify(s.label)},
      dataKind: ${JSON.stringify(s.dataKind)},
      timeframe: ${JSON.stringify(s.timeframe)}, session: ${JSON.stringify(s.session)}, timezone: ${JSON.stringify(s.timezone)}, adjustment: ${JSON.stringify(s.adjustment)},
      generationRuleId: ${JSON.stringify(s.generationRuleId)},
      preconditionSpecId: ${JSON.stringify(s.preconditionSpecId)},
      preconditionHash: ${JSON.stringify(s.preconditionHash)},
      outcomeRole: ${JSON.stringify(s.outcomeRole)},
      pairedWithId: ${JSON.stringify(s.pairedWithId)},
      cutoffIndex: ${s.cutoffIndex},
      coreRefs: ${JSON.stringify(s.coreRefs)},
      ohlc: [
        ${s.ohlc.map(fmtBar).join(', ')}
      ],
    },`).join('\n')}
  ],
};
`;
  return { source, scenarios };
}
