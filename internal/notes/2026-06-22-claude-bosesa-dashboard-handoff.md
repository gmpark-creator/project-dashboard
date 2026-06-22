# Claude Handoff: Bosesa Dashboard Update

Date: 2026-06-22
Owner request: update the project dashboard after independently verifying today's Bosesa work.

## Scope To Reflect In Dashboard

Two Bosesa study categories are now complete for subjects 1 through 5.

1. Important Concepts
   - UI label: `중요 개념 · 7개년 빈출`
   - Purpose: 2019-2025 frequently recurring concepts by subject.
   - Data files: `claude/previews/tradelogix-nexus/bosesa-concepts-1.js` through `bosesa-concepts-5.js`
   - Renderer: `renderBosesaConcepts()` in `claude/previews/tradelogix-nexus/index.html`

2. Answer Notes Fast Review
   - UI label: `정답 해설 · 빠른회독`
   - Purpose: fast review category showing only question, official correct answer, answer basis, and correct-choice explanation.
   - It intentionally hides wrong answer choices.
   - Data files: `claude/previews/tradelogix-nexus/bosesa-data-{1..5}-{2019..2025}.js`
   - Renderer: `renderBosesaAnswerNotes()` in `claude/previews/tradelogix-nexus/index.html`
   - Ready list: `const BOSESA_ANSWER_NOTES_READY = [1,2,3,4,5];`

## Relevant Commits

Important concepts:
- `e4878ca feat(tradelogix/bosesa): 1과목 「중요 개념」 7개년 빈출 정리 신설 (Claude·Codex 협업)`
- `33a0bab feat(tradelogix/bosesa): 2과목(보세구역관리) 「중요 개념」 7개년 빈출 정리 신설`
- `37d900f feat(tradelogix/bosesa): 3과목(화물관리) 「중요 개념」 7개년 빈출 정리 신설`
- `fd54263 fix(tradelogix/bosesa): 3과목 중요개념 보충 마무리 + 모바일 정답 배지 정렬`
- `085f321 feat(tradelogix/bosesa): 4과목 중요개념 7개년 빈출 정리 신설`
- `c485cbe feat(tradelogix/bosesa): 5과목 중요개념 7개년 빈출 정리 신설`

Answer notes fast review:
- `181738e feat(tradelogix/bosesa): 1과목 정답 해설 빠른회독 추가`
- `459d83c feat(tradelogix/bosesa): 2과목 정답 해설 빠른회독 추가`
- `ec6faa2 feat(tradelogix/bosesa): 3과목 정답 해설 빠른회독 추가`
- `8f5ee0c feat(tradelogix/bosesa): 4과목 정답 해설 빠른회독 추가`
- `db6d837 feat(tradelogix/bosesa): 5과목 정답 해설 빠른회독 추가`

Supporting verification correction:
- `2c99e8a fix(tradelogix/bosesa): PDF 직접검수 보정`

Current local state at handoff:
- Branch: `master`
- Status: clean
- Ahead of `origin/master`: 6 commits
- Local preview URL: `http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html`

## Required Claude Verification Before Updating Dashboard

Run from:

```powershell
cd "C:\Users\User A\Desktop\새 폴더\project-dashboard"
```

Use UTF-8 reads on this Windows machine when reading text files.

1. Confirm current state:

```powershell
git status --short --branch
git log --oneline -12
```

2. Check all Bosesa JS files parse:

```powershell
Get-ChildItem -Path claude/previews/tradelogix-nexus -Filter 'bosesa-*.js' | ForEach-Object { node --check $_.FullName }
```

3. Check the HTML inline script parses:

```powershell
@'
const fs = require('fs');
const html = fs.readFileSync('claude/previews/tradelogix-nexus/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
new Function(scripts[scripts.length - 1]);
console.log('inline script parse OK');
'@ | node -
```

4. Check answer-note data detail across all 875 questions:

```powershell
@'
const fs = require('fs');
const vm = require('vm');
const subjects = [1,2,3,4,5];
const years = [2025,2024,2023,2022,2021,2020,2019];
const bannedRegex = [/TODO/i, /FIXME/i, /TBD/i, /placeholder/i, new RegExp('\ud574\uc124\\s*\uc5c6\uc74c'), new RegExp('\ubbf8\uc791\uc131')];
function load(s, y){
  const p = `claude/previews/tradelogix-nexus/bosesa-data-${s}-${y}.js`;
  const src = fs.readFileSync(p, 'utf8') + `\n; BOSESA_DATA_${s}_${y};`;
  return vm.runInNewContext(src, {});
}
function ans(v){ return Array.isArray(v) ? v : (Number.isInteger(v) ? [v] : []); }
function txt(v){ return typeof v === 'string' ? v : (v?.reason ?? v?.text ?? ''); }
const issues = [];
const summary = [];
let total = 0;
for (const s of subjects) {
  let subjectTotal = 0, basisChars = 0, correctAnalysisChars = 0;
  for (const y of years) {
    const data = load(s, y);
    const actualSubject = data.subjectNo ?? data.subject;
    if (actualSubject !== s) issues.push(`${s} subject ${y}: subject=${actualSubject}`);
    if (!Array.isArray(data.questions) || data.questions.length !== 25) issues.push(`${s} subject ${y}: question count ${data.questions?.length}`);
    for (const [i, q] of data.questions.entries()) {
      const no = q.no ?? q.number ?? q.id ?? i + 1;
      const question = q.text ?? q.stemText ?? q.question ?? '';
      const answers = ans(q.answer);
      const basis = q.answerBasis ?? q.explanation ?? '';
      subjectTotal++; total++;
      if (!question.trim()) issues.push(`${s} subject ${y} Q${no}: empty question`);
      if (!Array.isArray(q.choices) || q.choices.length < 4) issues.push(`${s} subject ${y} Q${no}: choices count ${q.choices?.length}`);
      if (!answers.length) issues.push(`${s} subject ${y} Q${no}: empty answer`);
      for (const a of answers) {
        if (!Number.isInteger(a) || a < 1 || a > (q.choices?.length ?? 0)) issues.push(`${s} subject ${y} Q${no}: invalid answer ${a}`);
        const ca = Array.isArray(q.choiceAnalysis) ? txt(q.choiceAnalysis[a - 1]) : '';
        correctAnalysisChars += ca.length;
        if (ca.trim().length < 20) issues.push(`${s} subject ${y} Q${no}: thin correct choice analysis (${ca.length})`);
      }
      basisChars += basis.length;
      if (basis.trim().length < 40) issues.push(`${s} subject ${y} Q${no}: thin answerBasis (${basis.length})`);
      const joined = [basis, ...(Array.isArray(q.choiceAnalysis) ? q.choiceAnalysis.map(txt) : [])].join('\n');
      for (const re of bannedRegex) if (re.test(joined)) issues.push(`${s} subject ${y} Q${no}: placeholder-like text ${re}`);
      if (!Array.isArray(q.choiceAnalysis) || q.choiceAnalysis.length < q.choices.length) issues.push(`${s} subject ${y} Q${no}: missing choiceAnalysis entries`);
    }
  }
  summary.push({ subject: s, questions: subjectTotal, avgBasisChars: Math.round(basisChars / subjectTotal), avgCorrectAnalysisChars: Math.round(correctAnalysisChars / subjectTotal) });
}
console.log(JSON.stringify({ total, summary, issueCount: issues.length, issues: issues.slice(0, 30) }, null, 2));
if (issues.length) process.exit(1);
'@ | node -
```

Expected:
- `total`: 875
- each subject: 175 questions
- `issueCount`: 0

5. Check browser-rendered answer-note DOM:

```powershell
@'
const { execFileSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const subjects = [1,2,3,4,5];
const out = [];
for (const s of subjects) {
  const url = `http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=${s}`;
  const dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 40 });
  const visibleDom = dom.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  out.push({
    subject: s,
    cards: (visibleDom.match(/<article class="bq-card"/g) || []).length,
    basis: (visibleDom.match(/class="ba-basis"/g) || []).length,
    analysis: (visibleDom.match(/class="ba-analysis"/g) || []).length,
    wrong: (visibleDom.match(/bq-wrong/g) || []).length
  });
}
const issues = out.flatMap(r => [r.cards===175, r.basis===175, r.analysis===175, r.wrong===0].every(Boolean) ? [] : [`${r.subject}: ${JSON.stringify(r)}`]);
console.log(JSON.stringify({ out, issueCount: issues.length, issues }, null, 2));
if (issues.length) process.exit(1);
'@ | node -
```

Expected:
- each subject: `cards=175`, `basis=175`, `analysis=175`, `wrong=0`
- `issueCount=0`

6. Visual spot check:

Open the local preview and check the left sidebar under each subject:
- `중요 개념 7개년 빈출`
- `정답 해설 빠른회독`

Fast direct URLs:

```text
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=1
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=2
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=3
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=4
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=5
```

## Dashboard Update Guidance

After verification passes, update the project dashboard to state that Bosesa study material now has:

- 5/5 subjects completed for `중요 개념 · 7개년 빈출`
- 5/5 subjects completed for `정답 해설 · 빠른회독`
- Answer-note coverage: 2019-2025, 875 total questions
- Answer-note display contract: question + official answer + answer basis + correct-choice explanation only; wrong choices hidden
- Verification: JS parse, inline script parse, 875-question detail audit, browser DOM audit all PASS

Do not modify source study data while updating dashboard unless a verification failure is found. If a failure is found, stop and report the exact subject/year/question and the failing gate.
