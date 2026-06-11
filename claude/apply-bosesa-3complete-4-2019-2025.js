#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('claude/previews/tradelogix-nexus/index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`[FAIL] index.html not found: ${indexPath}`);
  process.exit(1);
}
let html = fs.readFileSync(indexPath, 'utf8');
let changed = false;
const warnings = [];

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function hasScript(src) { return new RegExp(`<script\\s+src=["']${escapeRegExp(src)}["']\\s*><\\/script>`).test(html); }
function scriptTag(src) { return `<script src="${src}"></script>`; }
function insertAt(pos, snippet) { html = html.slice(0, pos) + snippet + html.slice(pos); changed = true; }
function findScriptTag(src) {
  const re = new RegExp(`<script\\s+src=["']${escapeRegExp(src)}["']\\s*><\\/script>`);
  const m = html.match(re);
  if (!m) return null;
  return { index: m.index, end: m.index + m[0].length, text: m[0] };
}
function ensureScript(src, afterSrc) {
  if (hasScript(src)) return;
  const tag = scriptTag(src);
  const after = afterSrc ? findScriptTag(afterSrc) : null;
  if (after) { insertAt(after.end, `\n${tag}`); return; }
  const custom = findScriptTag('customs-practice-data.js');
  if (custom) { insertAt(custom.index, `${tag}\n`); return; }
  warnings.push(`Could not place script ${src}; add ${tag} manually near existing bosesa-data scripts.`);
}

// Script tags. Keep 3과목 completion files and add 4과목 2019~2025.
ensureScript('bosesa-data-3-2022.js', 'bosesa-data-3-2023.js');
ensureScript('bosesa-data-3-2021.js', 'bosesa-data-3-2022.js');
ensureScript('bosesa-data-3-2020.js', 'bosesa-data-3-2021.js');
ensureScript('bosesa-data-3-2019.js', 'bosesa-data-3-2020.js');
ensureScript('bosesa-data-4-2025.js', 'bosesa-data-3-2019.js');
ensureScript('bosesa-data-4-2024.js', 'bosesa-data-4-2025.js');
ensureScript('bosesa-data-4-2023.js', 'bosesa-data-4-2024.js');
ensureScript('bosesa-data-4-2022.js', 'bosesa-data-4-2023.js');
ensureScript('bosesa-data-4-2021.js', 'bosesa-data-4-2022.js');
ensureScript('bosesa-data-4-2020.js', 'bosesa-data-4-2021.js');
ensureScript('bosesa-data-4-2019.js', 'bosesa-data-4-2020.js');

function yearButton(subject, year, label) {
  const display = label || `${year}년`;
  return `  <button class="sb-item sb-child2" id="sb-s${subject}-year-${year}" onclick="setState({view:'bosesa',bosesaView:'quiz',bosesaSubject:${subject},bosesaYear:${year}})">
  <i class="fa-solid fa-circle w-2 text-center text-violet-400"></i>${display}
  </button>`;
}
function subject4Block() {
  return `  <!-- 4과목 -->
  <button class="sb-item sb-child" onclick="toggleSubject4()">
  <i class="fa-solid fa-folder w-4 text-center text-slate-500"></i>4과목 수출입안전관리
  <i class="fa-solid fa-chevron-down ml-auto text-[10px] text-slate-500" id="sb-s4-chevron"></i>
  </button>
  <div id="sb-s4-menu" style="max-height:0;overflow:hidden;transition:max-height .2s ease;">
${yearButton(4,2025)}
${yearButton(4,2024)}
${yearButton(4,2023)}
${yearButton(4,2022)}
${yearButton(4,2021)}
${yearButton(4,2020)}
${yearButton(4,2019,'2019년 (자율·관세)')}
  </div>`;
}
function insertButtonAfter(subject, year, afterYear, label) {
  if (html.includes(`id="sb-s${subject}-year-${year}"`)) return true;
  const snippet = yearButton(subject, year, label);
  const rx = new RegExp(`(<button[^>]+id=["']sb-s${subject}-year-${afterYear}["'][\\s\\S]*?<\\/button>)`, 'm');
  if (rx.test(html)) { html = html.replace(rx, `$1\n${snippet}`); changed = true; return true; }
  return false;
}
function insertIntoSubjectMenu(subject, snippet) {
  const menuIdx = html.indexOf(`id="sb-s${subject}-menu"`);
  if (menuIdx < 0) return false;
  const closeIdx = html.indexOf('</div>', menuIdx);
  if (closeIdx < 0) return false;
  insertAt(closeIdx, `${snippet}\n`);
  return true;
}

// 3과목 2019~2022 보정까지 유지.
insertButtonAfter(3, 2022, 2023) || insertIntoSubjectMenu(3, yearButton(3, 2022));
insertButtonAfter(3, 2021, 2022) || insertIntoSubjectMenu(3, yearButton(3, 2021));
insertButtonAfter(3, 2020, 2021) || insertIntoSubjectMenu(3, yearButton(3, 2020));
insertButtonAfter(3, 2019, 2020) || insertIntoSubjectMenu(3, yearButton(3, 2019));

// 4과목 menu creation or augmentation.
if (!html.includes('id="sb-s4-menu"')) {
  const locked4 = /\s*<button class="sb-item sb-child" style="opacity:\.35;cursor:not-allowed;" disabled>\s*<i class="fa-solid fa-lock w-4 text-center text-slate-600"><\/i>4과목\s*<span class="ml-auto text-\[10px\] text-slate-600">준비중<\/span>\s*<\/button>/m;
  if (locked4.test(html)) {
    html = html.replace(locked4, `\n${subject4Block()}`);
    changed = true;
  } else {
    const locked5 = '<i class="fa-solid fa-lock w-4 text-center text-slate-600"></i>5과목';
    const idx = html.indexOf(locked5);
    if (idx >= 0) {
      const buttonStart = html.lastIndexOf('<button', idx);
      if (buttonStart >= 0) insertAt(buttonStart, `${subject4Block()}\n`);
    } else {
      warnings.push('Could not find 4과목 locked menu anchor. Apply PATCH_INDEX_3COMPLETE_4_2019_2025.diff manually.');
    }
  }
} else {
  if (!html.includes('id="sb-s4-year-2025"')) insertIntoSubjectMenu(4, yearButton(4, 2025));
  insertButtonAfter(4, 2024, 2025) || insertIntoSubjectMenu(4, yearButton(4, 2024));
  insertButtonAfter(4, 2023, 2024) || insertIntoSubjectMenu(4, yearButton(4, 2023));
  insertButtonAfter(4, 2022, 2023) || insertIntoSubjectMenu(4, yearButton(4, 2022));
  insertButtonAfter(4, 2021, 2022) || insertIntoSubjectMenu(4, yearButton(4, 2021));
  insertButtonAfter(4, 2020, 2021) || insertIntoSubjectMenu(4, yearButton(4, 2020));
  insertButtonAfter(4, 2019, 2020, '2019년 (자율·관세)') || insertIntoSubjectMenu(4, yearButton(4, 2019, '2019년 (자율·관세)'));
}

// Menu state variable.
if (!html.includes('_s4MenuOpen')) {
  const rx = /(let\s+_bosesaMenuOpen\s*=\s*false\s*,\s*_s1MenuOpen\s*=\s*false\s*,\s*_s2MenuOpen\s*=\s*false\s*,\s*_s3MenuOpen\s*=\s*false)(\s*;)/;
  if (rx.test(html)) { html = html.replace(rx, '$1, _s4MenuOpen = false$2'); changed = true; }
  else {
    const anchor = 'function toggleBosesaMenu(){';
    const pos = html.indexOf(anchor);
    if (pos >= 0) insertAt(pos, 'let _s4MenuOpen = false;\n');
    else warnings.push('Could not add _s4MenuOpen state variable.');
  }
}

// Toggle function.
if (!html.includes('function toggleSubject4()')) {
  const block = `function toggleSubject4(){

  _s4MenuOpen = !_s4MenuOpen;

  const menu = $('sb-s4-menu');
  const chev = $('sb-s4-chevron');
  if(!menu) return;

  menu.style.maxHeight = _s4MenuOpen ? menu.scrollHeight + 'px' : '0';

  if(chev) chev.style.transform = _s4MenuOpen ? 'rotate(180deg)' : '';

  if(_bosesaMenuOpen){

  const parent = $('sb-bosesa-quiz-menu');
  if(parent) parent.style.maxHeight = parent.scrollHeight + 440 + 'px';

  }

}

`;
  const anchor = 'function toggleQuizAnswer(no){';
  const pos = html.indexOf(anchor);
  if (pos >= 0) insertAt(pos, block);
  else warnings.push('Could not insert toggleSubject4(); add it near toggleSubject3().');
}

// Fix subject1 active checks so subject 3/4 same year does not highlight subject1.
for (const y of [2025,2024,2023,2022,2021,2020,2019]) {
  const old = `S.view==='bosesa'&&S.bosesaView==='quiz'&&S.bosesaYear===${y}`;
  const neu = `S.view==='bosesa'&&S.bosesaView==='quiz'&&S.bosesaSubject===1&&S.bosesaYear===${y}`;
  if (html.includes(old) && !html.includes(neu)) { html = html.split(old).join(neu); changed = true; }
}

// Active state loop for added subject/year buttons.
const activeMarker = '/* BOSSA_PATCH_ACTIVE_YEARS_3COMPLETE_4_2019_2025 */';
if (!html.includes(activeMarker)) {
  const activeBlock = `
  ${activeMarker}
  [[3,[2022,2021,2020,2019]],[4,[2025,2024,2023,2022,2021,2020,2019]]].forEach(([subject, years])=>{
    years.forEach(year=>{
      const el = $('sb-s' + subject + '-year-' + year);
      if(el) el.className = 'sb-item sb-child2' + (S.view==='bosesa'&&S.bosesaView==='quiz'&&S.bosesaSubject===subject&&S.bosesaYear===year?' sb-on-year':'');
    });
  });
`;
  const rs = html.indexOf('function renderSidebar(){');
  if (rs >= 0) {
    const close = html.indexOf('\n}', rs);
    if (close >= 0) insertAt(close, activeBlock);
    else warnings.push('Could not locate renderSidebar() closing brace for active-state patch.');
  } else warnings.push('Could not locate renderSidebar() for active-state patch.');
}

if (changed) fs.writeFileSync(indexPath, html, 'utf8');
for (const w of warnings) console.error('[WARN]', w);
console.log(changed ? `[OK] Patched ${indexPath}` : '[OK] No changes needed; index.html already appears patched.');
if (warnings.length) process.exitCode = 2;
