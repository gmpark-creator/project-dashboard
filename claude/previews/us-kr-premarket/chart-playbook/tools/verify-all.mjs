/* 차트 교본 — 한 명령 전체 검증
 * 실행: node chart-playbook/tools/verify-all.mjs   (실패 시 비0 종료)
 *
 * 재현 범위 (Codex 2026-08-13 사후검수 요구):
 *  1) 스키마 게이트 + 음성/회귀 픽스처(별도 subprocess로 비정상 종료 확인)
 *  2) 합성 시나리오 바이트 동일 재생성(결정론)
 *  3) 짝 사례의 관측 컷오프 이전 봉 동일성
 *  4) RFC 8785 JCS → SHA-256 사전조건 해시 재계산 대조
 *  5) 산출 상태 분류 + 데이터 완전성 레벨(L1/L2/L3) + 입력 검증
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CP = path.join(__dirname, '..');          // chart-playbook/
const ROOT = path.join(CP, '..');               // us-kr-premarket/

let failed = 0;
const step = (title) => console.log(`\n── ${title} ──`);
const ok = (name, cond, extra) => { if (cond) console.log(`  ✅ ${name}`); else { failed++; console.log(`  ❌ ${name}${extra ? ' → ' + extra : ''}`); } };
const run = (file, args, cwd) => spawnSync(process.execPath, [file, ...(args || [])], { cwd: cwd || ROOT, encoding: 'utf8' });

/* 1) 스키마 게이트 */
step('1) 스키마 게이트 + 음성·회귀');
{
  const r = run(path.join(ROOT, 'data', 'schema-validate.mjs'), ['--selftest']);
  ok('schema-validate --selftest 종료 0', r.status === 0, `exit ${r.status}`);
  if (r.status !== 0) console.log((r.stdout || '') + (r.stderr || ''));
  else console.log('    ' + (r.stdout || '').trim().split('\n').filter(l => /검증 대상|통과/.test(l)).join('\n    '));
}

/* 2) 결정론 재생성 */
step('2) 합성 시나리오 결정론');
{
  const target = path.join(CP, 'data', 'scenarios.js');
  const before = crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex');
  const r = run(path.join(__dirname, 'gen-scenarios.mjs'));
  ok('생성기 종료 0', r.status === 0, (r.stderr || '').trim());
  const after = crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex');
  ok('재생성 바이트 동일', before === after, `${before.slice(0, 12)} vs ${after.slice(0, 12)}`);
  console.log(`    sha256 ${after.slice(0, 24)}…`);
}

/* 3~4) 짝 prefix 동일성 + JCS 재해시 */
step('3~4) 짝 사례 사전 구간 동일성 · JCS 재해시');
{
  const win = {};
  (new Function('window', fs.readFileSync(path.join(CP, 'data', 'scenarios.js'), 'utf8')))(win);
  const S = win.POLARIS_SCENARIOS;
  const jcs = v => {
    if (v === null) return 'null';
    const t = typeof v;
    if (t === 'boolean') return v ? 'true' : 'false';
    if (t === 'number') { if (!Number.isFinite(v)) throw new Error('non-finite'); return Object.is(v, -0) ? '0' : String(v); }
    if (t === 'string') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(jcs).join(',') + ']';
    return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + jcs(v[k])).join(',') + '}';
  };
  const byId = {}; S.scenarios.forEach(s => { byId[s.id] = s; });
  let pairsOk = 0, hashOk = 0;
  S.scenarios.forEach(s => {
    const mate = byId[s.pairedWithId];
    const n = s.cutoffIndex + 1;
    if (mate && JSON.stringify(s.ohlc.slice(0, n)) === JSON.stringify(mate.ohlc.slice(0, n))
      && mate.generationRuleId === s.generationRuleId && mate.outcomeRole !== s.outcomeRole) pairsOk++;
    const spec = S.preconditionSpecs[s.preconditionSpecId];
    if (spec && crypto.createHash('sha256').update(jcs(spec), 'utf8').digest('hex') === s.preconditionHash) hashOk++;
  });
  ok(`짝 사전 구간·규칙·역할 일치 ${pairsOk}/${S.scenarios.length}`, pairsOk === S.scenarios.length);
  ok(`JCS→SHA-256 재계산 일치 ${hashOk}/${S.scenarios.length}`, hashOk === S.scenarios.length);
  const ft = S.scenarios.filter(s => s.outcomeRole === 'followThrough').length;
  ok(`성공/실패 동수 (${ft}/${S.scenarios.length - ft})`, ft === S.scenarios.length - ft);
}

/* 5) 산출 상태·레벨·입력 검증 */
step('5) 산출 상태 분류 · 완전성 레벨 · 입력 검증');
{
  const r = run(path.join(__dirname, 'test-paths.mjs'));
  const last = (r.stdout || '').trim().split('\n').pop();
  ok('test-paths 종료 0', r.status === 0, last);
  console.log('    ' + last);
}

console.log(failed ? `\n❌ 전체 검증 실패 — ${failed}건` : '\n✅ 전체 검증 통과');
process.exit(failed ? 1 : 0);
