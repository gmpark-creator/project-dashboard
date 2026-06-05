/* ============================================================
   Future Stack Demos — 프리마켓 콕핏 · 노리지 그래프 비서 · 스택 사용 지도
   - 데이터: future-demos-data.js (window.FUTURE_STACK_DEMOS)  ← 전부 교육용 가상
   - 런타임: Tailwind Play CDN + ECharts + D3 + Vanilla JS (정적, GitHub Pages)
   - ECharts/D3 미로드 시 폴백 렌더 (console error 0 유지)
   - 모든 UI 카피 한국어. 기술 고유명만 영어.
   ============================================================ */
"use strict";
(function () {
  const D = (window.FUTURE_STACK_DEMOS || { premarket: {}, knowledge: {}, stackMap: [] });
  const PM = D.premarket || {};
  const KG = D.knowledge || {};
  const SM = D.stackMap || [];

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

  const NODE_COLORS = { '공정': '#38bdf8', '소재': '#34d6c0', '장비': '#f4b740', '기업': '#a78bfa', '항만·물류': '#a3e635', '리스크': '#fb7185', '수요': '#f472b6' };
  const STATUS_COLOR = { '실제 동작': 'text-mint', '정적 시뮬레이션': 'text-gold', '제품화 필요': 'text-rose' };

  const state = {
    tab: 'premarket',
    pm: { scenario: (PM.scenarios && PM.scenarios[0] && PM.scenarios[0].id) || null, inspect: null },
    kg: { question: null, inspect: null, built: false }
  };

  /* ---------- 공통 인스펙터 ---------- */
  function stackCard(s) {
    return `
      <div class="rounded-md border border-line bg-base/50 p-2.5">
        <div class="text-sm font-black text-cyan">${esc(s.tech)}</div>
        <dl class="mt-1.5 space-y-1.5 text-[12px] leading-5">
          <div><dt class="font-bold text-mint">어디에</dt><dd class="text-slate-200">${esc(s.where)}</dd></div>
          <div><dt class="font-bold text-mint">무엇이 달라지나</dt><dd class="text-slate-300">${esc(s.whatChanges)}</dd></div>
          <div><dt class="font-bold text-gold">왜 골랐나</dt><dd class="text-slate-300">${esc(s.whyChosen)}</dd></div>
          <div><dt class="font-bold text-rose">이 프리뷰에선</dt><dd class="text-slate-400">${esc(s.simulated)}</dd></div>
        </dl>
      </div>`;
  }
  function findStack(stacks, label) {
    return (stacks || []).find(s => label && label.indexOf(s.tech.split(' ')[0]) !== -1)
      || (stacks || []).find(s => label && label.toLowerCase().indexOf((s.tech.split(' ')[0] || '').toLowerCase()) !== -1);
  }

  /* ============================================================ PREMARKET ============================================================ */
  let pmHeat = null, pmTime = null;
  const curScenario = () => (PM.scenarios || []).find(s => s.id === state.pm.scenario) || (PM.scenarios || [])[0] || { biases: [], priceShift: 0, macroShift: 0, newsShift: 0, sentimentShift: 0, summary: '' };
  const biasFor = (sc, cat) => { const b = (sc.biases || []).find(x => x.category === cat); return b ? b.bias : 0; };
  const cellValue = cell => Math.round(clamp(cell.base + biasFor(curScenario(), cell.category)));
  const headlineSent = h => Math.round(clamp(h.sentiment + curScenario().sentimentShift, -100, 100));

  function renderPmScenarios() {
    const box = $('pm-scenarios'); if (!box) return;
    box.innerHTML = (PM.scenarios || []).map(s => `
      <button type="button" class="chip fr rounded-md border border-line bg-base/50 px-3 py-1.5 text-xs font-bold ${s.id === state.pm.scenario ? 'active' : 'text-slate-300'}"
        data-act="pm-scenario" data-id="${esc(s.id)}" aria-label="시나리오 ${esc(s.name)}" aria-pressed="${s.id === state.pm.scenario}">${esc(s.name)}</button>`).join('');
    const sc = curScenario();
    const sm = $('pm-scenario-summary'); if (sm) sm.textContent = sc.summary || '';
  }

  function heatColor(v) {
    // 20=cool(rose) .. 50=neutral(slate) .. 80=hot(mint)
    if (v >= 62) return '#1f6f64'; if (v >= 55) return '#235c54';
    if (v >= 48) return '#2a3a52'; if (v >= 40) return '#4a2f43'; return '#5c2740';
  }
  function renderHeatmap() {
    const box = $('pm-heatmap'); if (!box) return;
    const cells = PM.heatmap || [];
    const cats = ['미국 지수', '한국 지수', '금리', '환율', '원자재', '반도체 테마'];
    const engLabel = $('pm-heatmap-eng');
    if (window.echarts) {
      if (engLabel) engLabel.textContent = '(ECharts)';
      try {
        if (pmHeat) { pmHeat.dispose(); pmHeat = null; }
        pmHeat = window.echarts.init(box, null, { renderer: 'canvas', height: 240 });
        const data = cells.map((c, i) => [i, cats.indexOf(c.category), cellValue(c)]);
        pmHeat.setOption({
          backgroundColor: 'transparent',
          grid: { left: 84, right: 14, top: 8, bottom: 64 },
          tooltip: {
            backgroundColor: '#0e1626', borderColor: '#243352', textStyle: { color: '#e8eefb', fontSize: 12 },
            formatter: p => { const c = cells[p.dataIndex]; return `${esc(c.label)}<br/>${esc(c.category)} · 압력 ${cellValue(c)}`; }
          },
          xAxis: { type: 'category', data: cells.map(c => c.label), axisLabel: { color: '#8aa0c6', fontSize: 9, rotate: 52, interval: 0 }, axisLine: { lineStyle: { color: '#243352' } }, splitArea: { show: false } },
          yAxis: { type: 'category', data: cats, axisLabel: { color: '#cdd9f0', fontSize: 11 }, axisLine: { lineStyle: { color: '#243352' } } },
          visualMap: { min: 25, max: 75, calculable: false, show: false, inRange: { color: ['#5c2740', '#4a2f43', '#2a3a52', '#235c54', '#1f8f7e'] } },
          series: [{
            type: 'heatmap', data, label: { show: true, color: '#dfe9fb', fontSize: 9, formatter: p => cellValue(cells[p.dataIndex]) },
            itemStyle: { borderColor: '#0a0f1c', borderWidth: 2, borderRadius: 4 },
            emphasis: { itemStyle: { borderColor: '#34d6c0', borderWidth: 2 } }
          }]
        });
        pmHeat.off('click'); pmHeat.on('click', p => { const c = cells[p.dataIndex]; if (c) setPmInspect({ kind: 'cell', cell: c }); });
        return;
      } catch (e) { /* fall through to CSS */ }
    }
    // 폴백: CSS 그리드
    if (engLabel) engLabel.textContent = '(폴백 그리드)';
    box.innerHTML = `<div class="space-y-2">${cats.map(cat => {
      const cs = cells.filter(c => c.category === cat);
      return `<div><div class="text-[11px] font-bold text-muted">${esc(cat)}</div>
        <div class="mt-1 flex flex-wrap gap-1.5">${cs.map(c => { const v = cellValue(c); return `
          <button type="button" class="fr rounded-md border border-line px-2 py-1 text-[11px] text-ink" style="background:${heatColor(v)}" data-act="pm-cell" data-id="${esc(c.id)}" aria-label="${esc(c.label)} 압력 ${v}">${esc(c.label)} <b>${v}</b></button>`; }).join('')}</div></div>`;
    }).join('')}</div>`;
  }

  function renderTimeline() {
    const box = $('pm-timeline'); if (!box) return;
    const sc = curScenario();
    const tl = (PM.timeline || []).map(p => ({ t: p.t, price: Math.round(clamp(p.price + sc.priceShift)), macro: Math.round(clamp(p.macro + sc.macroShift)), news: Math.round(clamp(p.news + sc.newsShift)) }));
    if (window.echarts) {
      try {
        if (pmTime) { pmTime.dispose(); pmTime = null; }
        pmTime = window.echarts.init(box, null, { renderer: 'canvas', height: 240 });
        const lane = (name, key, color) => ({ name, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2, color }, areaStyle: { color, opacity: 0.06 }, data: tl.map(p => p[key]) });
        pmTime.setOption({
          backgroundColor: 'transparent', grid: { left: 36, right: 14, top: 12, bottom: 40 },
          tooltip: { trigger: 'axis', backgroundColor: '#0e1626', borderColor: '#243352', textStyle: { color: '#e8eefb', fontSize: 12 } },
          legend: { show: false },
          xAxis: { type: 'category', data: tl.map(p => p.t), axisLabel: { color: '#8aa0c6', fontSize: 9, rotate: 40 }, axisLine: { lineStyle: { color: '#243352' } } },
          yAxis: { type: 'value', min: 0, max: 100, splitLine: { lineStyle: { color: '#1a2740' } }, axisLabel: { color: '#8aa0c6', fontSize: 10 } },
          series: [lane('가격 압력', 'price', '#38bdf8'), lane('매크로 압력', 'macro', '#a78bfa'), lane('뉴스 감성', 'news', '#34d6c0')]
        });
        return;
      } catch (e) { /* fall through */ }
    }
    // 폴백 SVG
    const W = Math.max(320, box.clientWidth || 320), H = 220, pad = 28, n = tl.length;
    const X = i => pad + (W - pad - 12) * (i / Math.max(1, n - 1));
    const Y = v => H - pad - (H - pad - 12) * (v / 100);
    const poly = (key, color) => `<polyline fill="none" stroke="${color}" stroke-width="2" points="${tl.map((p, i) => X(i).toFixed(1) + ',' + Y(p[key]).toFixed(1)).join(' ')}"/>`;
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="시그널 타임라인 폴백">
      <line x1="${pad}" y1="${Y(50)}" x2="${W - 12}" y2="${Y(50)}" stroke="#1a2740"/>
      ${poly('price', '#38bdf8')}${poly('macro', '#a78bfa')}${poly('news', '#34d6c0')}</svg>`;
  }

  function renderHeadlines() {
    const box = $('pm-headlines'); if (!box) return;
    box.innerHTML = (PM.headlines || []).map(h => {
      const v = headlineSent(h);
      const col = v >= 20 ? '#34d6c0' : v <= -20 ? '#fb7185' : '#8aa0c6';
      let t = esc(h.text);
      (h.tokens || []).forEach(tok => { const e = esc(tok); t = t.split(e).join(`<mark class="rounded bg-gold/20 px-0.5 text-gold">${e}</mark>`); });
      return `<button type="button" class="fr block w-full rounded-md border border-line bg-base/50 p-2.5 text-left" data-act="pm-headline" data-id="${esc(h.id)}" aria-label="헤드라인 ${esc(h.text)}">
        <div class="flex items-start justify-between gap-2">
          <p class="text-[13px] leading-5 text-slate-100">${t}</p>
          <span class="shrink-0 text-sm font-black" style="color:${col}">${v > 0 ? '+' : ''}${v}</span>
        </div>
        <div class="mt-1 text-[10px] text-muted">영향 요인: ${esc(h.factor)}</div></button>`;
    }).join('');
  }

  function pipelineHTML(pipeline, act) {
    return `<div class="flex items-stretch gap-2 pb-1" style="min-width:max-content">
      ${(pipeline || []).map((p, i) => `
        ${i ? '<div class="flex items-center text-muted">→</div>' : ''}
        <button type="button" class="fr w-[150px] shrink-0 rounded-md border border-line bg-base/50 p-2.5 text-left" data-act="${act}" data-id="${esc(p.id)}" aria-label="${esc(p.label)}">
          <div class="text-[10px] font-bold text-cyan">${String(i + 1).padStart(2, '0')}</div>
          <div class="mt-0.5 text-[12px] font-bold text-white leading-4">${esc(p.label)}</div>
        </button>`).join('')}
    </div>`;
  }
  function renderPmPipeline() { const b = $('pm-pipeline'); if (b) b.innerHTML = pipelineHTML(PM.pipeline, 'pm-pipe'); }

  function stackChips(stacks, act) {
    return (stacks || []).map(s => `<button type="button" class="chip fr rounded-md border border-line bg-base/50 px-2 py-1 text-[11px] text-cyan" data-act="${act}" data-id="${esc(s.tech)}" aria-label="${esc(s.tech)} 설명">${esc(s.tech)}</button>`).join('');
  }
  function renderPmStacks() { const b = $('pm-stacks'); if (b) b.innerHTML = stackChips(PM.stacks, 'pm-stack'); }

  function setPmInspect(ins) { state.pm.inspect = ins; renderPmInspector(); }
  function renderPmInspector() {
    const box = $('pm-inspector'); if (!box) return;
    const ins = state.pm.inspect;
    if (!ins) { box.innerHTML = `<p class="text-[12px] leading-5 text-muted">히트맵 셀 · 헤드라인 · 파이프라인 노드 · 스택 칩을 누르면 여기에 상세가 표시됩니다.</p>`; return; }
    if (ins.kind === 'cell') {
      const c = ins.cell, v = cellValue(c), bias = biasFor(curScenario(), c.category);
      box.innerHTML = `<div class="text-xs font-bold text-mint">${esc(c.category)}</div>
        <h3 class="text-base font-black text-white">${esc(c.label)}</h3>
        <div class="mt-2 flex items-end gap-2"><span class="text-2xl font-black" style="color:${v >= 55 ? '#34d6c0' : v <= 45 ? '#fb7185' : '#cdd9f0'}">${v}</span><span class="text-[11px] text-muted">압력 지수(50=중립)</span></div>
        <div class="mt-2 text-[12px] leading-5 text-slate-300">기본값 ${c.base} · 시나리오 「${esc(curScenario().name)}」 보정 ${bias >= 0 ? '+' : ''}${bias}</div>
        <p class="mt-2 text-[11px] text-slate-500">※ 가상 수치이며 실시간 시세가 아닙니다.</p>`;
    } else if (ins.kind === 'headline') {
      const h = ins.h, v = headlineSent(h);
      box.innerHTML = `<div class="text-xs font-bold text-violet">텍스트 신호 (시뮬레이션)</div>
        <p class="mt-1 text-[13px] leading-5 text-slate-100">${esc(h.text)}</p>
        <div class="mt-2 text-sm font-black" style="color:${v >= 0 ? '#34d6c0' : '#fb7185'}">감성 ${v > 0 ? '+' : ''}${v}</div>
        <div class="mt-1 text-[12px] text-slate-300">영향 요인: ${esc(h.factor)}</div>
        <div class="mt-1 flex flex-wrap gap-1">${(h.tokens || []).map(t => `<span class="rounded bg-gold/15 px-1.5 py-0.5 text-[11px] text-gold">${esc(t)}</span>`).join('')}</div>
        <p class="mt-2 text-[11px] text-slate-500">※ 실제 모델 추론이 아니라 미리 라벨링된 가상 점수입니다.</p>`;
    } else if (ins.kind === 'stack') {
      box.innerHTML = stackCard(ins.s);
    } else if (ins.kind === 'pipe') {
      const p = ins.p, s = findStack(PM.stacks, p.label);
      box.innerHTML = `<div class="text-xs font-bold text-cyan">파이프라인 단계</div><h3 class="text-base font-black text-white">${esc(p.label)}</h3>
        <p class="mt-1 text-[12px] leading-5 text-slate-300">${esc(p.detail)}</p>${s ? '<div class="mt-2">' + stackCard(s) + '</div>' : ''}`;
    }
  }

  function applyScenario(id) { state.pm.scenario = id; renderPmScenarios(); renderHeatmap(); renderTimeline(); renderHeadlines(); renderPmInspector(); }

  function renderPremarket() {
    renderPmScenarios(); renderHeatmap(); renderTimeline(); renderHeadlines(); renderPmPipeline(); renderPmStacks(); renderPmInspector(); renderPulse();
  }

  /* ---------- 마켓 펄스 (가상 틱) ---------- */
  const PULSE = [
    { k: 'ny', label: '뉴욕 프리마켓', kind: 'phase' },
    { k: 'kst', label: '한국 시각', kind: 'clock' },
    { k: 'usdkrw', label: 'USD/KRW', base: 1378.4, step: 1.1, fmt: v => v.toFixed(1) },
    { k: 'ust10', label: '미 10년물', base: 4.318, step: 0.011, fmt: v => v.toFixed(3) + '%' },
    { k: 'nq', label: '나스닥 선물', base: 0.42, step: 0.07, signed: true, fmt: v => (v >= 0 ? '+' : '') + v.toFixed(2) + '%' },
    { k: 'kospi', label: 'KOSPI 야간', base: 0.12, step: 0.06, signed: true, fmt: v => (v >= 0 ? '+' : '') + v.toFixed(2) + '%' }
  ];
  const pulseVal = {};
  PULSE.forEach(p => { if (typeof p.base === 'number') pulseVal[p.k] = p.base; });
  function kstNow() { const d = new Date(); const u = d.getTime() + d.getTimezoneOffset() * 60000; return new Date(u + 9 * 3600000); }
  function nyPhase(h) { return (h >= 17 && h < 23) ? '프리마켓 진행' : (h >= 23 || h < 6) ? '정규장 시간' : '장 마감 후'; }
  function renderPulse() {
    const box = $('pm-pulse'); if (!box) return;
    const k = kstNow(), hh = k.getHours();
    box.innerHTML = PULSE.map(p => {
      let val, sub = '';
      if (p.kind === 'clock') { val = String(hh).padStart(2, '0') + ':' + String(k.getMinutes()).padStart(2, '0') + ':' + String(k.getSeconds()).padStart(2, '0'); sub = 'KST'; }
      else if (p.kind === 'phase') { val = nyPhase(hh); sub = '단계'; }
      else { const v = pulseVal[p.k]; val = p.fmt(v); sub = p.signed ? (v >= 0 ? '상승' : '하락') : ''; }
      const col = p.signed ? (pulseVal[p.k] >= 0 ? 'text-mint' : 'text-rose') : 'text-ink';
      return `<div class="rounded-md border border-line bg-base/50 p-2"><div class="text-[10px] text-muted">${esc(p.label)}</div>
        <div class="mt-0.5 text-sm font-black ${col}" data-pulse="${p.k}">${esc(val)}</div>
        <div class="text-[9px] text-slate-500">${esc(sub)}</div></div>`;
    }).join('');
  }
  function tickPulse() {
    // 가상 random-walk (브라우저 Math.random — 정적 데모 연출)
    PULSE.forEach(p => { if (typeof p.base !== 'number') return; const drift = (Math.random() - 0.5) * 2 * p.step; pulseVal[p.k] = p.signed ? pulseVal[p.k] + drift : Math.max(0, pulseVal[p.k] + drift); });
    if (state.tab === 'premarket') {
      const k = kstNow();
      PULSE.forEach(p => { const el = document.querySelector(`[data-pulse="${p.k}"]`); if (!el) return;
        if (p.kind === 'clock') el.textContent = String(k.getHours()).padStart(2, '0') + ':' + String(k.getMinutes()).padStart(2, '0') + ':' + String(k.getSeconds()).padStart(2, '0');
        else if (p.kind !== 'phase') { el.textContent = p.fmt(pulseVal[p.k]); el.classList.remove('tick-flash'); void el.offsetWidth; el.classList.add('tick-flash'); el.className = el.className.replace(/text-(mint|rose|ink)/, '') + ' ' + (p.signed ? (pulseVal[p.k] >= 0 ? 'text-mint' : 'text-rose') : 'text-ink'); }
      });
    }
    const st = $('status-tick'); if (st) { const k = kstNow(); st.textContent = String(k.getHours()).padStart(2, '0') + ':' + String(k.getMinutes()).padStart(2, '0') + ':' + String(k.getSeconds()).padStart(2, '0'); }
    scheduleTick();
  }
  function scheduleTick() { setTimeout(tickPulse, 1500 + Math.random() * 1000); }

  /* ============================================================ KNOWLEDGE ============================================================ */
  const nodeById = {}; (KG.nodes || []).forEach(n => nodeById[n.id] = n);
  const nodeByLabel = {}; (KG.nodes || []).forEach(n => nodeByLabel[n.label] = n);
  let kgNodeSel = {}; // id -> dom group

  function curQuestion() { return (KG.questions || []).find(q => q.id === state.kg.question); }

  function renderKgChips() {
    const box = $('kg-chips'); if (!box) return;
    box.innerHTML = (KG.questions || []).map(q => `<button type="button" class="chip fr rounded-full border border-line bg-base/50 px-3 py-1.5 text-[12px] ${q.id === state.kg.question ? 'active' : 'text-slate-300'}"
      data-act="kg-q" data-id="${esc(q.id)}" aria-label="질문 ${esc(q.q)}">${esc(q.q)}</button>`).join('');
  }

  function highlightGraph(ids) {
    const set = new Set(ids || []);
    Object.keys(kgNodeSel).forEach(id => {
      const g = kgNodeSel[id]; if (!g) return;
      g.classList.toggle('hl', set.has(id));
      g.classList.toggle('dim', set.size > 0 && !set.has(id));
    });
    const svg = $('kg-graph').querySelector('svg'); if (!svg) return;
    svg.querySelectorAll('.kg-link').forEach(l => {
      const s = l.getAttribute('data-s'), t = l.getAttribute('data-t');
      l.classList.toggle('hl', set.size > 0 && set.has(s) && set.has(t));
    });
  }

  function buildGraph() {
    const box = $('kg-graph'); if (!box) return;
    const eng = $('kg-graph-eng');
    const W = Math.max(300, box.clientWidth || 320), H = 360;
    const nodes = (KG.nodes || []).map(n => Object.assign({}, n));
    const links = (KG.edges || []).map(e => Object.assign({}, e));
    box.innerHTML = '';
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', '100%'); svg.setAttribute('height', H);
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', '반도체·공급망 지식 그래프');
    box.appendChild(svg);
    const gLink = document.createElementNS(svgns, 'g'), gNode = document.createElementNS(svgns, 'g');
    svg.appendChild(gLink); svg.appendChild(gNode);
    kgNodeSel = {};
    const linkEls = links.map(l => { const ln = document.createElementNS(svgns, 'line'); ln.setAttribute('class', 'kg-link'); ln.setAttribute('data-s', l.source); ln.setAttribute('data-t', l.target); gLink.appendChild(ln); return ln; });

    nodes.forEach(n => {
      const g = document.createElementNS(svgns, 'g'); g.setAttribute('class', 'kg-node'); g.style.cursor = 'pointer';
      const c = document.createElementNS(svgns, 'circle'); c.setAttribute('r', 9); c.setAttribute('fill', NODE_COLORS[n.category] || '#8aa0c6'); c.setAttribute('stroke', '#0a0f1c'); c.setAttribute('stroke-width', '1.5');
      const t = document.createElementNS(svgns, 'text'); t.textContent = n.label; t.setAttribute('font-size', '9'); t.setAttribute('fill', '#cdd9f0'); t.setAttribute('dx', 12); t.setAttribute('dy', 3);
      g.appendChild(c); g.appendChild(t);
      g.addEventListener('click', () => setKgInspect({ kind: 'node', n }));
      gNode.appendChild(g); kgNodeSel[n.id] = g; n._g = g; n._c = c; n._t = t;
    });

    if (eng) eng.textContent = window.d3 ? '(D3 포스 레이아웃)' : '(폴백 SVG)';

    if (window.d3) {
      const sim = window.d3.forceSimulation(nodes)
        .force('link', window.d3.forceLink(links).id(d => d.id).distance(64).strength(0.6))
        .force('charge', window.d3.forceManyBody().strength(-130))
        .force('center', window.d3.forceCenter(W / 2, H / 2))
        .force('collide', window.d3.forceCollide(22));
      sim.on('tick', () => {
        nodes.forEach(n => { n.x = Math.max(14, Math.min(W - 14, n.x)); n.y = Math.max(14, Math.min(H - 14, n.y)); n._g.setAttribute('transform', `translate(${n.x},${n.y})`); });
        linkEls.forEach((ln, i) => { const s = links[i].source, t = links[i].target; ln.setAttribute('x1', s.x); ln.setAttribute('y1', s.y); ln.setAttribute('x2', t.x); ln.setAttribute('y2', t.y); });
      });
      // 빠른 안정화
      for (let i = 0; i < 160; i++) sim.tick();
      sim.alpha(0.2).restart(); setTimeout(() => sim.stop(), 1600);
    } else {
      // 폴백: 원형 배치
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 26;
      nodes.forEach((n, i) => { const a = (i / nodes.length) * Math.PI * 2; n.x = cx + R * Math.cos(a); n.y = cy + R * Math.sin(a); n._g.setAttribute('transform', `translate(${n.x},${n.y})`); });
      const pos = {}; nodes.forEach(n => pos[n.id] = n);
      linkEls.forEach((ln, i) => { const s = pos[links[i].source], t = pos[links[i].target]; if (s && t) { ln.setAttribute('x1', s.x); ln.setAttribute('y1', s.y); ln.setAttribute('x2', t.x); ln.setAttribute('y2', t.y); } });
    }
    state.kg.built = true;
  }

  function selectQuestion(id) {
    state.kg.question = id; renderKgChips();
    const q = curQuestion(); if (!q) return;
    highlightGraph(q.highlightedNodeIds);
    renderKgAnswer();
    const inp = $('kg-qinput'); if (inp) inp.value = q.q;
  }

  function renderKgAnswer() {
    const box = $('kg-answer'); if (!box) return;
    const q = curQuestion();
    if (!q) { box.innerHTML = `<p class="text-[12px] leading-5 text-muted">질문 칩을 누르면 RAG식 가상 답변과 추론 경로가 표시됩니다.</p>`; return; }
    const conf = clamp(54 + q.highlightedNodeIds.length * 6 + q.pathSteps.length * 3, 0, 96);
    const retrieved = q.highlightedNodeIds.map(id => nodeById[id]).filter(Boolean);
    box.innerHTML = `
      <p class="text-[13px] leading-5 text-slate-100">${esc(q.answer)}</p>
      <div class="mt-2"><div class="text-[11px] font-bold text-muted">검색된 노드</div>
        <div class="mt-1 flex flex-wrap gap-1">${retrieved.map(n => `<span class="rounded border border-line px-1.5 py-0.5 text-[11px]" style="color:${NODE_COLORS[n.category] || '#cdd9f0'}">${esc(n.label)}</span>`).join('')}</div></div>
      <div class="mt-2"><div class="text-[11px] font-bold text-muted">추론 경로</div>
        <div class="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-slate-300">${q.pathSteps.map((s, i) => `${i ? '<span class="text-muted">›</span>' : ''}<span class="rounded bg-gold/10 px-1.5 py-0.5 text-gold">${esc(s)}</span>`).join('')}</div></div>
      <div class="mt-2"><div class="flex items-center justify-between text-[11px]"><span class="font-bold text-muted">확신도</span><span class="font-black text-mint">${conf}</span></div>
        <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-line/70"><div class="h-full rounded-full" style="width:${conf}%;background:#34d6c0"></div></div></div>
      <p class="mt-2 text-[11px] text-slate-500">※ 실제 LLM API를 호출하지 않습니다. 그래프 위 미리 정의된 경로를 보여 주는 시뮬레이션입니다.</p>`;
  }

  function setKgInspect(ins) { state.kg.inspect = ins; renderKgInspector(); }
  function renderKgInspector() {
    const box = $('kg-inspector'); if (!box) return;
    const ins = state.kg.inspect;
    if (!ins) { box.innerHTML = `<p class="text-[12px] leading-5 text-muted">그래프 노드 · 공급망 호 · 파이프라인 노드 · 스택 칩을 누르면 상세가 표시됩니다.</p>`; return; }
    if (ins.kind === 'node') {
      const n = ins.n;
      const deg = (KG.edges || []).filter(e => e.source === n.id || e.target === n.id);
      const rel = deg.slice(0, 8).map(e => { const other = e.source === n.id ? e.target : e.source; const on = nodeById[other]; return on ? `<li class="text-[12px] text-slate-300">${esc(e.label)} · <b class="text-ink">${esc(on.label)}</b></li>` : ''; }).join('');
      box.innerHTML = `<div class="text-xs font-bold" style="color:${NODE_COLORS[n.category] || '#cdd9f0'}">${esc(n.category)}</div>
        <h3 class="text-base font-black text-white">${esc(n.label)}</h3>
        <div class="mt-1 text-[11px] text-muted">연결 ${deg.length}개</div>
        <ul class="mt-2 space-y-1 list-disc pl-4">${rel}</ul>`;
    } else if (ins.kind === 'arc') {
      const a = ins.a;
      box.innerHTML = `<div class="text-xs font-bold text-lime">공급망 흐름</div>
        <h3 class="text-base font-black text-white">${esc(a.from)} → ${esc(a.to)}</h3>
        <div class="mt-1 text-[13px] text-cyan font-bold">${esc(a.label)}</div>
        <p class="mt-1 text-[12px] leading-5 text-slate-300">${esc(a.detail)}</p>
        <p class="mt-2 text-[11px] text-slate-500">※ Cesium 3D 지구를 정적 SVG로 대체한 표현입니다.</p>`;
    } else if (ins.kind === 'stack') { box.innerHTML = stackCard(ins.s); }
    else if (ins.kind === 'pipe') { const p = ins.p, s = findStack(KG.stacks, p.label); box.innerHTML = `<div class="text-xs font-bold text-cyan">파이프라인 단계</div><h3 class="text-base font-black text-white">${esc(p.label)}</h3><p class="mt-1 text-[12px] leading-5 text-slate-300">${esc(p.detail)}</p>${s ? '<div class="mt-2">' + stackCard(s) + '</div>' : ''}`; }
  }

  /* ---------- WebGPU 패널 ---------- */
  let gpuRAF = null;
  function renderWebGPU() {
    const status = $('kg-gpu-status'), note = $('kg-webgpu-note'), pre = $('kg-wgsl');
    const supported = !!(navigator.gpu);
    if (status) { status.textContent = supported ? '· navigator.gpu 지원' : '· navigator.gpu 미지원(Canvas 폴백)'; status.className = 'ml-1 text-[10px] font-bold ' + (supported ? 'text-mint' : 'text-muted'); }
    if (note) note.textContent = supported
      ? '이 브라우저는 WebGPU를 지원합니다. 제품화 시 Rust로 계산한 레이아웃을 WebGPU/WGSL 셰이더로 올리면 수천 개 노드·엣지도 GPU에서 병렬 렌더해 끊김 없이 확대·이동할 수 있습니다. 아래 캔버스는 그 느낌을 보여 주는 가벼운 Canvas 시뮬레이션입니다.'
      : '이 브라우저에는 WebGPU가 없어 Canvas 폴백으로 표시합니다. 제품화 시 WebGPU/WGSL을 쓰면 대규모 그래프를 GPU에서 병렬 렌더해 메인 스레드 부담 없이 부드럽게 다룰 수 있습니다.';
    if (pre) pre.textContent = KG.wgsl || '// WGSL 참고용 의사 코드 (데이터 없음)';
    // Canvas 파티클 (항상 동작)
    const cv = $('kg-webgpu-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const fit = () => { cv.width = cv.clientWidth || 300; };
    fit();
    const N = 70, parts = [];
    for (let i = 0; i < N; i++) parts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 });
    if (gpuRAF) cancelAnimationFrame(gpuRAF);
    function frame() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > cv.width) p.vx *= -1; if (p.y < 0 || p.y > cv.height) p.vy *= -1;
      }
      ctx.strokeStyle = 'rgba(56,189,248,0.16)';
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = parts[i], b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy; if (d < 2600) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
      ctx.fillStyle = '#34d6c0'; for (const p of parts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill(); }
      gpuRAF = requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- 공급망 글로브 (SVG 호) ---------- */
  const GEO = { '한국': [128, 37], '대만': [121, 24], '일본': [139, 36], '미국': [-98, 39], '중국': [104, 36], '싱가포르': [104, 1], '네덜란드': [5, 52], '독일': [10, 51], '대만(TSMC)': [121, 24] };
  function renderGlobe() {
    const box = $('kg-globe'); if (!box) return;
    const W = 320, H = 230, cx = W / 2, cy = H / 2, R = 96;
    const proj = (lon, lat) => [cx + (lon / 180) * (W / 2 - 14), cy - (lat / 90) * (H / 2 - 14)];
    const arcs = KG.supplyChainArcs || [];
    const arcPath = (a) => {
      const f = GEO[a.from] || [0, 0], t = GEO[a.to] || [0, 0];
      const [x1, y1] = proj(f[0], f[1]), [x2, y2] = proj(t[0], t[1]);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 38;
      return { d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, p1: [x1, y1], p2: [x2, y2] };
    };
    const dots = {};
    arcs.forEach(a => { [a.from, a.to].forEach(c => { const g = GEO[c]; if (g) dots[c] = proj(g[0], g[1]); }); });
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="글로벌 공급망 호">
      <ellipse cx="${cx}" cy="${cy}" rx="${W / 2 - 8}" ry="${H / 2 - 8}" fill="#0c1830" stroke="#243352"/>
      <line x1="8" y1="${cy}" x2="${W - 8}" y2="${cy}" stroke="#1a2740"/>
      ${arcs.map((a, i) => { const ap = arcPath(a); return `<path class="kg-arc fr" data-act="kg-arc" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="${esc(a.from)}에서 ${esc(a.to)} ${esc(a.label)}" d="${ap.d}" fill="none" stroke="#38bdf8" stroke-opacity="0.6" stroke-width="1.6" style="cursor:pointer"/>`; }).join('')}
      ${Object.keys(dots).map(c => `<g><circle cx="${dots[c][0].toFixed(1)}" cy="${dots[c][1].toFixed(1)}" r="3.2" fill="#f4b740"/><text x="${(dots[c][0] + 5).toFixed(1)}" y="${(dots[c][1] + 3).toFixed(1)}" font-size="9" fill="#cdd9f0">${esc(c)}</text></g>`).join('')}
    </svg>`;
  }
  function renderKgPipeline() { const b = $('kg-pipeline'); if (b) b.innerHTML = pipelineHTML(KG.pipeline, 'kg-pipe'); }
  function renderKgStacks() { const b = $('kg-stacks'); if (b) b.innerHTML = stackChips(KG.stacks, 'kg-stack'); }

  function renderKnowledge() {
    renderKgChips(); buildGraph(); renderWebGPU(); renderGlobe(); renderKgPipeline(); renderKgStacks(); renderKgAnswer(); renderKgInspector();
    if (state.kg.question) highlightGraph((curQuestion() || {}).highlightedNodeIds || []);
  }

  /* ============================================================ STACK MAP ============================================================ */
  function renderStackmap() {
    const box = $('sm-table'); if (!box) return;
    box.innerHTML = `<table class="w-full border-collapse text-[12px]" style="min-width:680px">
      <thead><tr class="text-left text-muted">
        <th class="border-b border-line px-2 py-2">항목</th>
        <th class="border-b border-line px-2 py-2 text-cyan">프리마켓 콕핏</th>
        <th class="border-b border-line px-2 py-2 text-violet">노리지 그래프 비서</th>
        <th class="border-b border-line px-2 py-2">설명</th>
        <th class="border-b border-line px-2 py-2">상태</th>
      </tr></thead>
      <tbody>${(SM || []).map((r, i) => `
        <tr class="${i % 2 ? 'bg-base/30' : ''}">
          <td class="border-b border-line/60 px-2 py-2 font-bold text-white align-top">${esc(r.row)}</td>
          <td class="border-b border-line/60 px-2 py-2 text-slate-200 align-top">${esc(r.premarket)}</td>
          <td class="border-b border-line/60 px-2 py-2 text-slate-200 align-top">${esc(r.knowledge)}</td>
          <td class="border-b border-line/60 px-2 py-2 text-slate-400 align-top">${esc(r.explain)}</td>
          <td class="border-b border-line/60 px-2 py-2 align-top"><span class="whitespace-nowrap font-bold ${STATUS_COLOR[r.status] || 'text-slate-300'}">${esc(r.status)}</span></td>
        </tr>`).join('')}</tbody></table>`;
  }

  /* ============================================================ 탭/이벤트/init ============================================================ */
  function setTab(t) {
    state.tab = t;
    ['premarket', 'knowledge', 'stackmap'].forEach(k => { const p = $('p-' + k); if (p) p.classList.toggle('on', k === t); });
    document.querySelectorAll('.seg').forEach(b => { const on = b.dataset.tab === t; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('active', on); });
    if (t === 'premarket') renderPremarket();
    else if (t === 'knowledge') renderKnowledge();
    else renderStackmap();
  }

  function onClick(e) {
    const el = e.target.closest('[data-act],[data-tab]'); if (!el) return;
    if (el.dataset.tab) { setTab(el.dataset.tab); return; }
    const act = el.dataset.act, id = el.dataset.id;
    if (act === 'pm-scenario') applyScenario(id);
    else if (act === 'pm-cell') { const c = (PM.heatmap || []).find(x => x.id === id); if (c) setPmInspect({ kind: 'cell', cell: c }); }
    else if (act === 'pm-headline') { const h = (PM.headlines || []).find(x => x.id === id); if (h) setPmInspect({ kind: 'headline', h }); }
    else if (act === 'pm-pipe') { const p = (PM.pipeline || []).find(x => x.id === id); if (p) setPmInspect({ kind: 'pipe', p }); }
    else if (act === 'pm-stack') { const s = (PM.stacks || []).find(x => x.tech === id); if (s) setPmInspect({ kind: 'stack', s }); }
    else if (act === 'kg-q') selectQuestion(id);
    else if (act === 'kg-arc') { const a = (KG.supplyChainArcs || []).find(x => x.id === id); if (a) setKgInspect({ kind: 'arc', a }); }
    else if (act === 'kg-pipe') { const p = (KG.pipeline || []).find(x => x.id === id); if (p) setKgInspect({ kind: 'pipe', p }); }
    else if (act === 'kg-stack') { const s = (KG.stacks || []).find(x => x.tech === id); if (s) setKgInspect({ kind: 'stack', s }); }
  }
  function onKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = e.target.closest && e.target.closest('[data-act="kg-arc"]'); if (el) { e.preventDefault(); onClick({ target: el }); }
  }
  function onQInput(e) {
    if (e.key !== 'Enter') return;
    const v = (e.target.value || '').trim(); if (!v) return;
    // 가장 비슷한 프리셋 질문으로 매칭(부분 포함)
    const qs = KG.questions || [];
    let hit = qs.find(q => q.q === v) || qs.find(q => v.length >= 2 && (q.q.indexOf(v) !== -1 || v.indexOf(q.q.slice(0, 6)) !== -1));
    if (!hit) { // 키워드 점수
      hit = qs.map(q => ({ q, n: v.split(/\s+/).filter(w => w.length > 1 && q.q.indexOf(w) !== -1).length })).sort((a, b) => b.n - a.n)[0];
      hit = hit && hit.n > 0 ? hit.q : null;
    }
    if (hit) selectQuestion(hit.id);
  }

  function renderStatusStrip() {
    const box = $('status-strip'); if (!box) return;
    box.innerHTML = `
      <span class="rounded bg-rose/10 px-2 py-1 font-bold text-rose">교육용 시뮬레이션</span>
      <span class="rounded bg-base/60 px-2 py-1 text-muted">데이터 <b class="text-ink">가상</b></span>
      <span class="rounded bg-base/60 px-2 py-1 text-muted">런타임 <b class="text-ink">정적 프리뷰</b></span>
      <span class="rounded bg-base/60 px-2 py-1 text-muted">틱 <b id="status-tick" class="text-mint">--:--:--</b></span>`;
  }

  function init() {
    renderStatusStrip();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    const inp = $('kg-qinput'); if (inp) inp.addEventListener('keydown', onQInput);
    let rT = null;
    window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => {
      try { if (pmHeat) pmHeat.resize(); if (pmTime) pmTime.resize(); } catch (e) {}
      if (state.tab === 'knowledge') { buildGraph(); if (state.kg.question) highlightGraph((curQuestion() || {}).highlightedNodeIds || []); renderWebGPU(); }
    }, 220); });
    setTab('premarket');     // 초기 = 보이는 탭 (차트 정상 사이징)
    scheduleTick();          // 가상 틱 루프 시작
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
