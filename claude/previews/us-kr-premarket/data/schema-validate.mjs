/* Polaris Core — 스키마/필수필드 검증 (CI 게이트)
 * 실행: node data/schema-validate.mjs   (실패 시 비0 종료)
 * 목적: 손편집으로 인한 스키마 드리프트·출처 누락·환각 통계 혼입을 빌드 단계에서 차단.
 *
 * 규칙(레포 standing 반영):
 *  - 모든 universe 항목: ticker·name·market·role·tvSymbol·(KR이면 code) 필수.
 *  - measured 항목: derivedKey 필수 + 그 키가 POLARIS_DERIVED.perSymbol에 실재해야 함.
 *  - referenceOnly 항목: 파생통계 수치 필드(beta·atr·corr 등) 보유 금지(환각 방지).
 *  - playbook 항목: id·name·rule·examples(≥1, 각 ledgerRef)·source 필수.
 *  - riskRules/glossary: 필수 텍스트+source.
 *  - 모든 통계성 산출(POLARIS_DERIVED)은 caveat·formula·sampleSize(n) 동반.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadWindow(file) {
  const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const win = {};
  (new Function('window', src))(win);
  return win;
}

const errors = [];
const E = (cond, msg) => { if (!cond) errors.push(msg); };

// ── core-data.js ──
const core = loadWindow('core-data.js').POLARIS_CORE;
E(core, 'POLARIS_CORE 로드 실패');
E(core?.meta?.asOf, 'meta.asOf 누락');
E(core?.meta?.disclaimer, 'meta.disclaimer 누락');

const FORBIDDEN_STAT_KEYS = ['beta', 'atr', 'atrPct', 'corr', 'correlation', 'vol30', 'volatility', 'stdChgPct', 'avgRangePct', 'scoreWeight', 'derivedKey'];
const derived = loadWindow('derived-stats.generated.js').POLARIS_DERIVED;
E(derived, 'POLARIS_DERIVED 로드 실패');
E(derived?.caveat, 'POLARIS_DERIVED.caveat(소표본 고지) 누락');
E(derived?.formula, 'POLARIS_DERIVED.formula 누락');
E(derived?.perSymbol && Object.keys(derived.perSymbol).length > 0, 'POLARIS_DERIVED.perSymbol 비어있음');

// universe.measured
const measured = core?.universe?.measured || [];
E(measured.length >= 1, 'universe.measured 비어있음');
measured.forEach((s, i) => {
  const tag = `measured[${i}] ${s.ticker || '?'}`;
  ['ticker', 'name', 'market', 'role', 'tvSymbol', 'derivedKey', 'source'].forEach(k => E(s[k], `${tag}: ${k} 누락`));
  if (s.market === 'KR') E(s.code, `${tag}: KR 종목인데 code 누락`);
  E(derived?.perSymbol?.[s.derivedKey], `${tag}: derivedKey '${s.derivedKey}'가 POLARIS_DERIVED.perSymbol에 없음(실측 연결 깨짐)`);
});

// universe.referenceOnly — 그룹별 배열, 통계 수치 보유 금지
const ref = core?.universe?.referenceOnly || {};
let refCount = 0;
Object.entries(ref).forEach(([group, arr]) => {
  E(Array.isArray(arr), `referenceOnly['${group}']가 배열이 아님`);
  (arr || []).forEach((s, i) => {
    refCount++;
    const tag = `referenceOnly['${group}'][${i}] ${s.ticker || '?'}`;
    ['ticker', 'name', 'market', 'role', 'tvSymbol'].forEach(k => E(s[k], `${tag}: ${k} 누락`));
    if (s.market === 'KR') E(s.code, `${tag}: KR 종목인데 code 누락`);
    FORBIDDEN_STAT_KEYS.forEach(k => E(!(k in s), `${tag}: referenceOnly에 통계 필드 '${k}' 혼입(환각 위험) — 제거`));
    E(!('derivedKey' in s), `${tag}: referenceOnly에 derivedKey 부여 금지`);
  });
});

// playbook
const pb = core?.playbook || [];
E(pb.length >= 3, 'playbook 항목 3개 미만');
pb.forEach((p, i) => {
  const tag = `playbook[${i}] ${p.id || '?'}`;
  ['id', 'name', 'idea', 'rule', 'source'].forEach(k => E(p[k], `${tag}: ${k} 누락`));
  E(Array.isArray(p.examples) && p.examples.length >= 1, `${tag}: examples(≥1) 누락`);
  (p.examples || []).forEach((ex, j) => {
    ['date', 'symbol', 'what', 'ledgerRef'].forEach(k => E(ex[k], `${tag}.examples[${j}]: ${k} 누락(실데이터 연결 강제)`));
  });
  // 성과/승률 표현 금지(가드레일)
  const blob = JSON.stringify(p);
  E(!/승률|수익률|기대값|수익\s*\d/.test(blob), `${tag}: 성과·승률 표현 감지(플레이북 금지)`);
});

// riskRules / glossary
(core?.riskRules || []).forEach((r, i) => ['id', 'title', 'detail', 'source'].forEach(k => E(r[k], `riskRules[${i}]: ${k} 누락`)));
E((core?.riskRules || []).length >= 3, 'riskRules 3개 미만');
(core?.glossary || []).forEach((g, i) => ['term', 'def', 'source'].forEach(k => E(g[k], `glossary[${i}]: ${k} 누락`)));
E((core?.glossary || []).length >= 5, 'glossary 5개 미만');

// ── rules.json (signal-engine 규칙 — Codex R2 체크리스트) ──
const rulesPath = path.join(__dirname, 'rules.json');
if (fs.existsSync(rulesPath)) {
  let rules;
  try { rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8')); }
  catch (e) { errors.push('rules.json JSON 파싱 실패: ' + e.message); }
  if (rules) {
    ['version', 'asOf', 'source', 'computedFrom', 'sampleSize', 'disclaimer'].forEach(k => E(rules.meta?.[k] !== undefined, `rules.json meta.${k} 누락`));
    // labels 정확 일치
    const LABELS = ['상승형 조건 일치', '하락형 조건 일치', '혼합', '데이터 부족'];
    E(JSON.stringify(rules.labels) === JSON.stringify(LABELS), `rules.json labels는 정확히 ${JSON.stringify(LABELS)} 여야 함`);
    // scoring
    E(rules.scoring?.minActiveWeight != null && rules.scoring?.mixedBand != null, 'rules.json scoring.minActiveWeight/mixedBand 누락');
    // gates 필수 2종
    const gateIds = (rules.gates || []).map(g => g.id);
    E(gateIds.includes('soxl_soxs_sanity_gate'), 'rules.json gates: soxl_soxs_sanity_gate 누락');
    E(gateIds.includes('event_hard_gate'), 'rules.json gates: event_hard_gate 누락');
    // factors
    E(Array.isArray(rules.factors) && rules.factors.length >= 3, 'rules.json factors 3개 미만');
    const LOOKAHEAD = /flips|\.close\b|\.high\b|\.low\b|\.volume\b|usImpact\.realized/;
    (rules.factors || []).forEach((f, i) => {
      const tag = `rules.factors[${i}] ${f.id || '?'}`;
      ['id', 'label', 'phase', 'ledgerFields', 'formula', 'threshold', 'weight', 'sideMapping', 'missingPolicy', 'rationale'].forEach(k => E(f[k] !== undefined, `${tag}: ${k} 누락`));
      E(Array.isArray(f.ledgerFields), `${tag}: ledgerFields 배열 아님`);
      // weight: 0~2 정수
      E(Number.isInteger(f.weight) && f.weight >= 0 && f.weight <= 2, `${tag}: weight는 0~2 정수만(숨은 가중치/동적최적화 금지)`);
      // threshold.type
      E(['ledgerQuantile', 'fixed'].includes(f.threshold?.type), `${tag}: threshold.type은 ledgerQuantile|fixed`);
      ['value', 'sampleSize', 'computedFrom'].forEach(k => E(f.threshold?.[k] !== undefined, `${tag}: threshold.${k} 누락`));
      if (f.threshold?.sampleSize < 20) {
        E(f.threshold?.sampleCaveat, `${tag}: sampleSize<20인데 sampleCaveat 누락`);
        E(f.threshold?.exploratory === true, `${tag}: sampleSize<20인데 exploratory:true 누락`);
      }
      // 룩어헤드: preOpen 요인은 당일 결과 필드 참조 금지
      if (f.phase === 'preOpen') {
        const joined = (f.ledgerFields || []).join(' ');
        E(!LOOKAHEAD.test(joined), `${tag}: preOpen 요인이 룩어헤드 필드(flips/high/low/close/volume/usImpact.realized) 참조 — 금지`);
      }
    });
    // modelScenario/opus/gpt/prob가 scoring factor에 혼입 금지
    E(!/modelScenario|"opus"|"gpt"|"prob"/.test(JSON.stringify(rules.factors)), 'rules.json factors: modelScenario/opus/gpt/prob 혼입 금지');
    // 사용자 출력 문구(labels + gate.onFail + sideMapping)에 매매지시/확률 표현 금지
    const userText = JSON.stringify([rules.labels, (rules.gates || []).map(g => g.onFail), (rules.factors || []).map(f => f.sideMapping)]);
    E(!/매수|매도|진입|청산|목표가|손절\s*추천|승률|확률/.test(userText), 'rules.json: 사용자 출력 문구에 매매지시·승률·확률 표현 감지(금지)');
  }
} else {
  console.warn('· rules.json 아직 없음 — 경고만.');
}

// ── 결과 ──
console.log(`검증 대상: measured ${measured.length} · referenceOnly ${refCount} · playbook ${pb.length} · riskRules ${(core?.riskRules||[]).length} · glossary ${(core?.glossary||[]).length}`);
if (errors.length) {
  console.error(`\n❌ 검증 실패 (${errors.length}건):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✅ 스키마 검증 통과');
