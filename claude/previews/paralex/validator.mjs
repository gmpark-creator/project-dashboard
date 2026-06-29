/* Paralex 세트 검수 validator — 라우팅 계약 + 6게이트 + documents[]/multi-passage + official/practice.
   사용: node validator.mjs   (data/sets/*.js 전부 로드, issueCount 0 목표) */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const setsDir = join(__dir, 'data', 'sets');
const LAB = ['A','B','C','D','E'];
const GATES = ['legal','originality','answerability','distractor','toeicLikeness','human'];
const QUALITY_GATES = ['legal','originality','answerability','distractor','toeicLikeness']; // practice도 강제 (R3 보정2)
const DR_TYPES = ['too_broad','opposite','not_mentioned','wrong_referent','chronology','partial_truth','extreme_word','same_word'];
const BANDS = ['750-800','800-850','850-900','900-950','950+'];
const SKILLS = ['paraphrase','inference','multi_passage','collocation','purpose','referent','scanning'];
const TRAPS = ['same_word','partial_truth','extreme_word','wrong_referent','chronology','opposite','not_mentioned','too_broad'];
const VBANDS = ['NGSL2k','TSL','BSL','NAWL'];
const KINDS = ['set','ladder_capsule'];
const NEWS_GENRES = ['news_report','feature','interview'];
const BIZ_GENRES = ['email','memo','notice','invoice','ad','form','chat','letter','article_business','multi'];
const BANNED = /\b(TODO|FIXME|TBD|placeholder|미작성|해설\s*없음|작성예정)\b/i;

const issues = [], warns = [];
const add = (id, msg)=> issues.push(`[${id}] ${msg}`);
const warn = (id, msg)=> warns.push(`[${id}] ${msg}`);
const subset = (arr, allowed)=> Array.isArray(arr) && arr.length && arr.every(x=>allowed.includes(x));

// load
const reg = {};
for(const f of readdirSync(setsDir).filter(n=>n.endsWith('.js'))){
  const src = readFileSync(join(setsDir, f), 'utf8');
  try { new Function('window', src)({ PARALEX_SETS: reg }); }
  catch(e){ add(f, `파싱 실패: ${e.message}`); }
}
const sets = Object.values(reg);
console.log(`로드된 세트: ${sets.length}개`);

function docsOf(s){
  const p = s.passage || {};
  if(Array.isArray(p.documents) && p.documents.length) return p.documents;
  if(Array.isArray(p.paragraphs)) return [{ id:'d1', label:'', paragraphs:p.paragraphs }]; // 레거시 호환
  return [];
}

for(const s of sets){
  const id = s.id || '(no-id)';
  // 필수 필드 (본문 + 라우팅)
  for(const k of ['id','setKind','track','genre','scoreBandTarget','difficultyRank','partFocus','skillFocus','trapFocus','vocabBand','targetTimeSec','title','source','license','wordCount','passage','questions']){
    if(s[k]===undefined || s[k]===null) add(id, `필수 필드 누락: ${k}`);
  }
  if(s.setKind!==undefined && !KINDS.includes(s.setKind)) add(id, `setKind 무효: ${s.setKind}`);
  if(!['news','business'].includes(s.track)) add(id, `track은 news|business: ${s.track}`);
  if(s.track==='news+business' || /\+/.test(String(s.track))) add(id, `track 혼합표기 금지(단일 enum) — genre:"multi"+documents.label 사용`);
  // 라우팅 enum
  if(s.scoreBandTarget!==undefined && !BANDS.includes(s.scoreBandTarget)) add(id, `scoreBandTarget 무효: ${s.scoreBandTarget}`);
  if(s.difficultyRank!==undefined && !(s.difficultyRank>=1 && s.difficultyRank<=5)) add(id, `difficultyRank 1..5 아님: ${s.difficultyRank}`);
  if(s.skillFocus!==undefined && !subset(s.skillFocus, SKILLS)) add(id, `skillFocus 무효/빈값: ${JSON.stringify(s.skillFocus)}`);
  if(s.trapFocus!==undefined && !subset(s.trapFocus, TRAPS)) add(id, `trapFocus 무효/빈값: ${JSON.stringify(s.trapFocus)}`);
  if(s.vocabBand!==undefined && !VBANDS.includes(s.vocabBand)) add(id, `vocabBand 무효: ${s.vocabBand}`);
  if(s.timeBudgetSec!==undefined) warn(id, `timeBudgetSec 잔존 — targetTimeSec로 단일화`);
  if(s.track==='news' && !NEWS_GENRES.includes(s.genre) && s.genre!=='multi') warn(id, `news 트랙 genre=${s.genre}`);
  if(s.track==='business' && !BIZ_GENRES.includes(s.genre)) warn(id, `business 트랙 genre=${s.genre}`);

  // passage documents
  const docs = docsOf(s);
  if(!docs.length) add(id, `passage.documents/paragraphs 비어있음`);
  const multi = docs.length >= 2;
  const spanIds = new Set();
  for(const d of docs){
    if(!d.id) add(id, `document id 누락`);
    if(multi && !d.label) warn(id, `multi-passage 문서 ${d.id} label 없음`);
    for(const p of (d.paragraphs||[])){
      if(!p.id) add(id, `문단 id 누락(doc ${d.id})`);
      spanIds.add(p.id);
      if(multi && !/^d\d/.test(String(p.id))) add(id, `multi-passage 문단 id '${p.id}' 문서prefix(d1*/d2*) 아님`);
      const cks = p.chunks || [];
      if(!cks.length) add(id, `문단 ${p.id} chunks(직독직해) 비어있음`);
      for(const c of cks){
        if(!c.en) add(id, `문단 ${p.id} chunk en 비어있음`);
        if(!c.ko) add(id, `문단 ${p.id} chunk ko(직독직해) 비어있음`);
        if(BANNED.test(c.en||'')||BANNED.test(c.ko||'')) add(id, `문단 ${p.id} chunk placeholder/금칙어`);
      }
      if(!p.functionLabel) warn(id, `문단 ${p.id} functionLabel 없음`);
    }
  }

  // questions
  for(const q of (s.questions||[])){
    const qid = `Q${q.no}`;
    if(!q.stem) add(id, `${qid} stem 없음`);
    const ch = q.choices || [];
    if(ch.length < 3) add(id, `${qid} 선지 ${ch.length}개 (<3)`);
    const labels = ch.map((c,i)=> c.label || LAB[i]);
    const ans = (q.answer||[]).map(a=> typeof a==='number'?LAB[a-1]:a);
    if(!ans.length) add(id, `${qid} answer 없음`);
    for(const a of ans) if(!labels.includes(a)) add(id, `${qid} answer '${a}' 선지에 없음`);
    const ev = q.evidenceSpanIds || [];
    if(!ev.length) add(id, `${qid} evidenceSpanIds 없음(answerability)`);
    for(const e of ev) if(!spanIds.has(e)) add(id, `${qid} evidenceSpanId '${e}' 지문에 없음`);
    // 문항별 skill/trap (통계 파생용)
    if(!subset(q.skillFocus, SKILLS)) add(id, `${qid} skillFocus 무효/빈값`);
    if(q.trapFocus!==undefined && !subset(q.trapFocus, TRAPS)) add(id, `${qid} trapFocus 무효`);
    // distractor
    const wrongs = labels.filter(l=> !ans.includes(l));
    const drMap = new Map((q.distractorRationales||[]).map(d=>[d.label,d]));
    for(const w of wrongs){
      const d = drMap.get(w);
      if(!d){ add(id, `${qid} 오답 '${w}' distractorRationale 없음`); continue; }
      if(!DR_TYPES.includes(d.type)) add(id, `${qid} 오답 '${w}' type='${d.type}' 미정의`);
      if(!d.note) add(id, `${qid} 오답 '${w}' note 없음`);
    }
    if(!q.explanation) add(id, `${qid} explanation 없음`);
    if(BANNED.test(q.explanation||'')) add(id, `${qid} explanation placeholder/금칙어`);
  }

  // 게이트 (R3 보정2: practice도 품질 5게이트 강제, human만 false 허용)
  const g = s.reviewGates || {};
  const officialClaim = g.human && g.human.pass === true;
  for(const name of GATES){
    const gate = g[name];
    if(gate===undefined){ add(id, `reviewGates.${name} 누락`); continue; }
    if(typeof gate !== 'object'){ add(id, `reviewGates.${name} 객체여야 함(boolean 금지)`); continue; }
    if(!('pass' in gate)) add(id, `reviewGates.${name}.pass 없음`);
    if(QUALITY_GATES.includes(name) && gate.pass !== true) add(id, `reviewGates.${name} 는 official/practice 무관 pass 강제(품질·저작권 게이트)`);
    if(gate.pass && !gate.note) add(id, `reviewGates.${name} pass인데 note 근거 없음`);
    if(gate.pass && !gate.reviewer) warn(id, `reviewGates.${name} reviewer 미기재`);
  }
  if(!officialClaim) warn(id, `bucket=practice (human 미통과) → 진단·추천 미반영`);
  // legal 메타
  if(s.thirdPartyContentExcluded !== true) add(id, `thirdPartyContentExcluded false/누락(legal)`);
}

console.log('');
if(warns.length){ console.log(`⚠️  경고 ${warns.length}건:`); warns.forEach(w=>console.log('  '+w)); console.log(''); }
if(issues.length){ console.log(`❌ issueCount: ${issues.length}`); issues.forEach(i=>console.log('  '+i)); process.exit(1); }
else { console.log(`✅ issueCount: 0 — 라우팅·게이트·answerability·distractor·multi-passage PASS`); process.exit(0); }
