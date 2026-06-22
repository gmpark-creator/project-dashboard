# Claude Handoff: Bosesa Rare Types Dashboard Update

Date: 2026-06-22
Owner request: verify Codex's new Bosesa rare-types category and update the project dashboard.

## What Changed

Codex added a third Bosesa study category in addition to the already completed:

1. `중요 개념 · 7개년 빈출`
2. `정답 해설 · 빠른회독`
3. `희소 유형 · 낯선·저빈출` ← new

The new category is designed as the inverse of `중요 개념`.

- `중요 개념`: repeated/frequent concepts and recurring question patterns.
- `희소 유형`: non-repeated, low-frequency, unfamiliar question types from 2019-2025.

## Files

Primary files:

- `claude/previews/tradelogix-nexus/bosesa-rare-types.js`
- `claude/previews/tradelogix-nexus/index.html`

New data contract:

- `BOSESA_RARE_TYPES.subjects[subject].items[]`
- Each item stores selected `year` and `questionNo`.
- The renderer pulls the real question, official answer, answer basis, and correct-choice explanation from existing `bosesa-data-{subject}-{year}.js`.
- This avoids duplicating official answer data.

## Coverage

- Subjects: 1-5 complete
- Items: 8 rare types per subject
- Total: 40 rare/low-frequency types
- Years covered: 2019-2025

Direct URLs:

```text
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=1
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=2
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=3
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=4
http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=5
```

## Commit To Review

```text
369295c feat(tradelogix/bosesa): 희소 유형 학습 카테고리 추가
```

This commit is on top of:

```text
ba12278 feat(dashboard): 보세사 중요개념·빠른회독 완성 대시보드 반영 — 5중 검수 PASS
```

Current expected repo state at handoff:

- Branch: `master`
- `master...origin/master [ahead 1]`
- Ahead commit: `369295c`

## Required Verification Before Dashboard Update

Run from:

```powershell
cd "C:\Users\User A\Desktop\새 폴더\project-dashboard"
```

Reminder for this Windows machine: read text files as UTF-8.

1. Confirm state:

```powershell
git status --short --branch
git log --oneline -5
```

2. Check all Bosesa JS files parse:

```powershell
Get-ChildItem -Path claude/previews/tradelogix-nexus -Filter 'bosesa-*.js' | ForEach-Object { node --check $_.FullName }
```

3. Check HTML inline script parses:

```powershell
@'
const fs = require('fs');
const html = fs.readFileSync('claude/previews/tradelogix-nexus/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
new Function(scripts[scripts.length - 1]);
console.log('inline script parse OK');
'@ | node -
```

4. Verify rare-type data references source questions correctly:

```powershell
@'
const fs = require('fs');
const vm = require('vm');
const rare = vm.runInNewContext(fs.readFileSync('claude/previews/tradelogix-nexus/bosesa-rare-types.js','utf8') + '\n; BOSESA_RARE_TYPES;', {});
function loadData(s, y){
  const p = `claude/previews/tradelogix-nexus/bosesa-data-${s}-${y}.js`;
  const src = fs.readFileSync(p, 'utf8') + `\n; BOSESA_DATA_${s}_${y};`;
  return vm.runInNewContext(src, {});
}
function qNo(q,i){ return q.no ?? q.number ?? q.id ?? i+1; }
function ans(v){ return Array.isArray(v) ? v : (Number.isInteger(v) ? [v] : []); }
const issues = [];
const summary = [];
for(const s of [1,2,3,4,5]){
  const data = rare.subjects[String(s)] || rare.subjects[s];
  if(!data) { issues.push(`${s}: missing subject data`); continue; }
  if(!Array.isArray(data.items) || data.items.length !== 8) issues.push(`${s}: item count ${data.items?.length}`);
  for(const [i,item] of (data.items||[]).entries()){
    for(const key of ['title','year','questionNo','rarity','reason','studyFocus','ifReappears']){
      if(!String(item[key] ?? '').trim()) issues.push(`${s} item ${i+1}: missing ${key}`);
    }
    if(!Array.isArray(item.watch) || item.watch.length < 3) issues.push(`${s} item ${i+1}: thin watch list`);
    const src = loadData(s, item.year);
    const q = src.questions.find((q,idx)=>qNo(q,idx)===item.questionNo);
    if(!q) { issues.push(`${s} item ${i+1}: missing source ${item.year} Q${item.questionNo}`); continue; }
    if(!ans(q.answer).length) issues.push(`${s} item ${i+1}: source has no answer`);
    if(!(q.answerBasis ?? q.explanation ?? '').trim()) issues.push(`${s} item ${i+1}: source has no basis`);
  }
  summary.push({subject:s, items:data.items?.length || 0});
}
console.log(JSON.stringify({summary, issueCount: issues.length, issues}, null, 2));
if(issues.length) process.exit(1);
'@ | node -
```

Expected:

- 5 subjects
- 8 items per subject
- `issueCount: 0`

5. Verify browser-rendered DOM:

```powershell
@'
const { execFileSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = [];
for (const s of [1,2,3,4,5]) {
  const url = `http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=${s}`;
  const dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 40 });
  const visibleDom = dom.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  out.push({
    subject: s,
    cards: (visibleDom.match(/id="br-/g) || []).length,
    rareMeta: (visibleDom.match(/class="br-meta"/g) || []).length,
    source: (visibleDom.match(/class="br-source"/g) || []).length,
    basis: (visibleDom.match(/class="ba-basis"/g) || []).length,
    analysis: (visibleDom.match(/class="ba-analysis"/g) || []).length,
    wrong: (visibleDom.match(/bq-wrong/g) || []).length,
    sourceButtons: (visibleDom.match(/fa-arrow-up-right-from-square/g) || []).length
  });
}
const issues = out.flatMap(r => [r.cards===8, r.rareMeta===8, r.source===8, r.basis===8, r.analysis===8, r.wrong===0, r.sourceButtons===8].every(Boolean) ? [] : [`${r.subject}: ${JSON.stringify(r)}`]);
console.log(JSON.stringify({ out, issueCount: issues.length, issues }, null, 2));
if (issues.length) process.exit(1);
'@ | node -
```

Expected for each subject:

- `cards: 8`
- `rareMeta: 8`
- `source: 8`
- `basis: 8`
- `analysis: 8`
- `wrong: 0`
- `sourceButtons: 8`
- `issueCount: 0`

## Dashboard Update Guidance

If verification passes, update the project dashboard to include this new completed Bosesa study category:

```text
희소 유형 · 낯선·저빈출
```

Suggested dashboard status text:

- `희소 유형`: 5/5 subjects complete
- Coverage: 2019-2025
- Total: 40 selected rare/low-frequency problem types
- Per subject: 8 selected types
- Study purpose: inverse of important concepts; captures low-frequency, non-repeated, unfamiliar procedural/exception/institution/period-matching question types
- Verification: JS parse PASS, inline script parse PASS, source-question reference audit PASS, browser DOM audit PASS

Do not edit `bosesa-data-*` or `bosesa-concepts-*` while updating the dashboard unless a verification failure is found. If a failure is found, stop and report the exact subject, selected item, year, question number, and failed gate.
