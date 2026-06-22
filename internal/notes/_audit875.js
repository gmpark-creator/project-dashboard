const fs = require('fs');
const vm = require('vm');
const subjects = [1,2,3,4,5];
const years = [2025,2024,2023,2022,2021,2020,2019];
const bannedRegex = [/TODO/i, /FIXME/i, /TBD/i, /placeholder/i, /해설\s*없음/, /미작성/];
function load(s, y){
  const p = `claude/previews/tradelogix-nexus/bosesa-data-${s}-${y}.js`;
  const src = fs.readFileSync(p, 'utf8') + '\n; BOSESA_DATA_' + s + '_' + y + ';';
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
    if (actualSubject !== s) issues.push(s + ' subject ' + y + ': subject=' + actualSubject);
    if (!Array.isArray(data.questions) || data.questions.length !== 25) issues.push(s + ' subject ' + y + ': question count ' + data.questions?.length);
    for (const [i, q] of data.questions.entries()) {
      const no = q.no ?? q.number ?? q.id ?? i + 1;
      const question = q.text ?? q.stemText ?? q.question ?? '';
      const answers = ans(q.answer);
      const basis = q.answerBasis ?? q.explanation ?? '';
      subjectTotal++; total++;
      if (!question.trim()) issues.push(s + ' subject ' + y + ' Q' + no + ': empty question');
      if (!Array.isArray(q.choices) || q.choices.length < 4) issues.push(s + ' subject ' + y + ' Q' + no + ': choices count ' + q.choices?.length);
      if (!answers.length) issues.push(s + ' subject ' + y + ' Q' + no + ': empty answer');
      for (const a of answers) {
        if (!Number.isInteger(a) || a < 1 || a > (q.choices?.length ?? 0)) issues.push(s + ' subject ' + y + ' Q' + no + ': invalid answer ' + a);
        const ca = Array.isArray(q.choiceAnalysis) ? txt(q.choiceAnalysis[a - 1]) : '';
        correctAnalysisChars += ca.length;
        if (ca.trim().length < 20) issues.push(s + ' subject ' + y + ' Q' + no + ': thin correct choice analysis (' + ca.length + ')');
      }
      basisChars += basis.length;
      if (basis.trim().length < 40) issues.push(s + ' subject ' + y + ' Q' + no + ': thin answerBasis (' + basis.length + ')');
      const joined = [basis, ...(Array.isArray(q.choiceAnalysis) ? q.choiceAnalysis.map(txt) : [])].join('\n');
      for (const re of bannedRegex) if (re.test(joined)) issues.push(s + ' subject ' + y + ' Q' + no + ': placeholder-like text ' + re);
      if (!Array.isArray(q.choiceAnalysis) || q.choiceAnalysis.length < q.choices.length) issues.push(s + ' subject ' + y + ' Q' + no + ': missing choiceAnalysis entries');
    }
  }
  summary.push({ subject: s, questions: subjectTotal, avgBasisChars: Math.round(basisChars / subjectTotal), avgCorrectAnalysisChars: Math.round(correctAnalysisChars / subjectTotal) });
}
console.log(JSON.stringify({ total, summary, issueCount: issues.length, issues: issues.slice(0, 30) }, null, 2));
if (issues.length) process.exit(1);
