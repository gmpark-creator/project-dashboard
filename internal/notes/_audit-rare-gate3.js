const fs = require('fs');
const html = fs.readFileSync('claude/previews/tradelogix-nexus/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
new Function(scripts[scripts.length - 1]);
console.log('inline script parse OK');
