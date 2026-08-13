/* chart-playbook/data/scenarios.js 쓰기 전용 명령
 * 실행: node chart-playbook/tools/gen-scenarios.mjs
 *
 * 생성 로직은 build-scenarios.mjs(순수 함수)에 있다. 이 파일은 그 결과를 디스크에 쓴다.
 * 검증(verify-all.mjs)은 쓰기 없이 메모리 대조만 하므로 read-only 환경에서도 재현된다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildScenariosSource } from './build-scenarios.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, '..', 'data', 'scenarios.js');

const { source, scenarios } = buildScenariosSource();
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, source, 'utf8');

console.log(`✅ scenarios.js 기록 — 시나리오 ${scenarios.length}건 (짝 ${scenarios.length / 2}쌍), 컷오프 이전 봉 동일성 확인 완료`);
scenarios.forEach(s => console.log(`   ${s.id} · ${s.ohlc.length}봉 · cutoff ${s.cutoffIndex} · hash ${s.preconditionHash.slice(0, 12)}…`));
