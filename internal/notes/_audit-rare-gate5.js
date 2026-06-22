const { execFileSync } = require('child_process');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = [];
for (const s of [1,2,3,4,5]) {
  const url = `http://127.0.0.1:4173/claude/previews/tradelogix-nexus/index.html?rare=1&subject=${s}`;
  let dom;
  try {
    dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--dump-dom', url], { encoding: 'utf8', maxBuffer: 1024 * 1024 * 40, timeout: 20000 });
  } catch(e) {
    out.push({ subject: s, error: String(e.message).slice(0, 120) });
    continue;
  }
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
const issues = out.flatMap(r => {
  if (r.error) return [`${r.subject}: error: ${r.error}`];
  return [r.cards===8, r.rareMeta===8, r.source===8, r.basis===8, r.analysis===8, r.wrong===0, r.sourceButtons===8].every(Boolean) ? [] : [`${r.subject}: ${JSON.stringify(r)}`];
});
console.log(JSON.stringify({ out, issueCount: issues.length, issues }, null, 2));
if (issues.length) process.exit(1);
