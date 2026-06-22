const { execFileSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const subjects = [1,2,3,4,5];
const out = [];
for (const s of subjects) {
  const url = `http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?answers=1&subject=${s}`;
  let dom;
  try {
    dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 40, timeout: 20000 });
  } catch(e) {
    out.push({ subject: s, error: String(e.message).slice(0,100) });
    continue;
  }
  const visibleDom = dom.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  out.push({
    subject: s,
    cards: (visibleDom.match(/<article class="bq-card"/g) || []).length,
    basis: (visibleDom.match(/class="ba-basis"/g) || []).length,
    analysis: (visibleDom.match(/class="ba-analysis"/g) || []).length,
    wrong: (visibleDom.match(/bq-wrong/g) || []).length
  });
}
const issues = out.flatMap(r => {
  if (r.error) return [`${r.subject}: error: ${r.error}`];
  return [r.cards===175, r.basis===175, r.analysis===175, r.wrong===0].every(Boolean) ? [] : [`${r.subject}: ${JSON.stringify(r)}`];
});
console.log(JSON.stringify({ out, issueCount: issues.length, issues }, null, 2));
if (issues.length) process.exit(1);
