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
