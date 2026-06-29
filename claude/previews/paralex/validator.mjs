/* Paralex 세트 검수 validator — 라우팅 계약 + 6게이트 + documents[]/multi-passage + official/practice.
   사용: node validator.mjs   (data/sets/*.js 전부 로드, issueCount 0 목표) */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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
      // functionLabel 제거됨(디렉터 지시: 구조 힌트 차단) — 검사 안 함
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

// --- Grammar Lab 검사 ---
const GPOINTS = ['word_form','tense_aspect','voice','subject_verb_agreement','gerund_infinitive','participle','relative_clause','noun_clause','pronoun_reference','preposition','conjunction_connector','modifier_adverb','comparison','parallelism','determiner_quantifier','condition_subjunctive','collocation','vocabulary_in_context','part6_cohesion','part6_sentence_insertion'];
const GDR = ['wrong_form','wrong_tense','wrong_preposition','wrong_connector','agreement_error','register_mismatch','close_meaning'];
const glabReg = {};
const glabDir = join(__dir,'data','grammar');
if(existsSync(glabDir)){
  for(const f of readdirSync(glabDir).filter(n=>n.endsWith('.js'))){
    try { new Function('window', readFileSync(join(glabDir,f),'utf8'))({ PARALEX_GLAB: glabReg }); }
    catch(e){ add(f, `파싱 실패: ${e.message}`); }
  }
}
for(const g of Object.values(glabReg)){
  const id = g.id || '(glab)';
  for(const k of ['id','title','partFocus']) if(g[k]==null) add(id, `glab 필수 ${k} 누락`);
  const items = g.items || (g.passages||[]).flatMap(p=>(p.items||[]).map(it=>({...it,_part6:true})));
  if(!items.length) add(id, 'glab items 없음');
  for(const it of items){
    const q = `item${it.no}`;
    const ch = it.choices||[]; if(ch.length<4) add(id, `${q} 선지<4`);
    const labels = ch.map((c,i)=>c.label||LAB[i]);
    const ans = (it.answer||[]).map(a=> typeof a==='number'?LAB[a-1]:a);
    if(!ans.length) add(id, `${q} answer 없음`);
    for(const a of ans) if(!labels.includes(a)) add(id, `${q} answer '${a}' 선지에 없음`);
    if(it.part==='Part5' && it.questionType==='sentence_insertion') add(id, `${q} sentence_insertion은 Part6 전용`);
    if(it.questionType!=='sentence_insertion' && it.sentence){ const b=(String(it.sentence).match(/_{2,}/g)||[]).length; if(b!==1) add(id, `${q} 빈칸 ${b}개(1개 필요)`); }
    if(it.grammarPoint && !GPOINTS.includes(it.grammarPoint)) add(id, `${q} grammarPoint 무효: ${it.grammarPoint}`);
    const wrongs = labels.filter(l=>!ans.includes(l));
    const drMap = new Map((it.distractorRationales||[]).map(d=>[d.label,d]));
    for(const w of wrongs){ const dr=drMap.get(w); if(!dr){ add(id, `${q} 오답 ${w} rationale 없음`); continue; } if(!GDR.includes(dr.type)) add(id, `${q} 오답 ${w} type 무효: ${dr.type}`); }
    if(!it.explanation) add(id, `${q} explanation 없음`);
    if(BANNED.test(it.explanation||'')||BANNED.test(it.sentence||'')) add(id, `${q} placeholder`);
  }
  const gg = g.reviewGates||{};
  for(const nm of ['legal','originality','answerability','grammarAccuracy','distractor','human']){
    const gt = gg[nm];
    if(!gt){ add(id, `glab reviewGates.${nm} 누락`); continue; }
    if(['legal','originality','answerability','grammarAccuracy','distractor'].includes(nm) && gt.pass!==true) add(id, `glab ${nm} pass 강제`);
  }
}
console.log(`로드된 Grammar Lab: ${Object.values(glabReg).length}개`);

// --- Vocab Day 검사 ---
const vw = { PARALEX_VOCAB_DAYS: [], PARALEX_SETS: {} };
const vdFiles = ['vocab-days.js'].concat(readdirSync(join(__dir,'data')).filter(n=>/^vocab-day-.*\.js$/.test(n)));
for(const vf of vdFiles){ const pth=join(__dir,'data',vf); if(!existsSync(pth)) continue; try { new Function('window', readFileSync(pth,'utf8'))(vw); } catch(e){ add(vf, `파싱 실패: ${e.message}`); } }
let vdList = vw.PARALEX_VOCAB_DAYS||[];
const seenLemma = new Set(); let vCount=0;
for(const d of vdList){ for(const c of (d.cards||[])){ vCount++;
  for(const k of ['id','lemma','glossKo','collocation','example','exampleKo']) if(!c[k]) add('vocab-days', `Day${d.day} 카드 ${c.id||'?'} ${k} 빈값`);
  const lk = String(c.lemma||'').toLowerCase().trim(); if(lk && seenLemma.has(lk)) add('vocab-days', `중복 lemma: ${c.lemma}`); seenLemma.add(lk);
  if(BANNED.test(c.glossKo||'')||BANNED.test(c.example||'')) add('vocab-days', `카드 ${c.id} placeholder`);
} }
console.log(`로드된 Vocab Day: ${vdList.length}일 / ${vCount}카드`);

// --- manifest + listening 검사 (Codex R3 락: 단일 소스·역참조·합법성·coverage) ---
const mfPath = join(__dir,'data','manifest.js');
if(existsSync(mfPath)){
  const mw={};
  try{ new Function('window', readFileSync(mfPath,'utf8'))(mw); }catch(e){ add('manifest', `파싱 실패: ${e.message}`); }
  const M=mw.PARALEX_MANIFEST;
  if(!M){ add('manifest','PARALEX_MANIFEST 전역 없음'); }
  else {
    const ids=new Set();
    for(const c of (M.content||[])){
      if(!c.id||!c.kind||!c.file){ add('manifest', `content 필드 누락: ${JSON.stringify(c)}`); continue; }
      if(ids.has(c.id)) add('manifest', `content id 중복: ${c.id}`);
      ids.add(c.id);
      if(!existsSync(join(__dir, c.file))) add('manifest', `content.file 없음: ${c.file}`);
      if(c.kind==='reading' && !reg[c.id]) add('manifest', `reading '${c.id}' 레지스트리 미등록(키 불일치?)`);
      if(c.kind==='grammar' && !glabReg[c.id]) add('manifest', `grammar '${c.id}' 레지스트리 미등록`);
    }
    for(const sid of Object.keys(reg)) if(!ids.has(sid)) warn('manifest', `세트 '${sid}' manifest.content 누락 → 로더가 안 띄움`);
    for(const gid of Object.keys(glabReg)) if(!ids.has(gid)) warn('manifest', `glab '${gid}' manifest.content 누락`);
    const sb=M.standardBatch, prof=(M.today&&M.today.minutesProfiles&&M.today.minutesProfiles['35'])||{grammar:6,vocabNew:10};
    if(sb){
      const covR=sb.readingSets||0, covG=(sb.grammarLabs*sb.grammarQuestionsPerLab)/(prof.grammar||6), covV=(sb.vocabDays*sb.vocabWordsPerDay)/(prof.vocabNew||10);
      console.log(`standardBatch coverageDays ≈ reading ${covR.toFixed(1)} / grammar ${covG.toFixed(1)} / vocab ${covV.toFixed(1)}`);
      const imb=Math.max(covR,covG,covV)-Math.min(covR,covG,covV);
      if(imb>2.5) warn('manifest', `standardBatch coverage 불균형(${imb.toFixed(1)}일차) — 공급 비율 조정 권장`);
    }
  }
} else { warn('manifest','data/manifest.js 없음'); }
// listening 합법성/분량
const lcPath = join(__dir,'data','listening.js');
if(existsSync(lcPath)){
  const lcw={}; try{ new Function('window', readFileSync(lcPath,'utf8'))(lcw); }catch(e){ add('listening', `파싱 실패: ${e.message}`); }
  const LC=lcw.PARALEX_LC;
  for(const q of ((LC&&LC.queue)||[])){
    if(!q.url) add('listening', `LC '${q.id}' url 없음`);
    if(q.embedAllowed!==false) add('listening', `LC '${q.id}' embedAllowed!==false (합법성: 외부 링크만 허용)`);
    if(q.license && q.license!=='link-only') warn('listening', `LC '${q.id}' license≠link-only`);
    if(q.durationMinutes>15) warn('listening', `LC '${q.id}' duration>15분(분량 경고)`);
  }
}

console.log('');
if(warns.length){ console.log(`⚠️  경고 ${warns.length}건:`); warns.forEach(w=>console.log('  '+w)); console.log(''); }
if(issues.length){ console.log(`❌ issueCount: ${issues.length}`); issues.forEach(i=>console.log('  '+i)); process.exit(1); }
else { console.log(`✅ issueCount: 0 — 라우팅·게이트·answerability·distractor·multi-passage PASS`); process.exit(0); }
