/* ============================================================
   Tech Stack Architecture & Evolution Hub — Project #9
   - 데이터 소스: ../../js/projects-data.js (window.PROJECTS / window.STACK_ATLAS)  ← 읽기 전용 seed
   - 보강 데이터: tech-hub-data.js (window.TSH_DATA)                              ← role/what/withoutIt/example + 시나리오 + 조합
   - 본 파일: normalize(seed+보강) → 상태머신 → S1/S2/S3 렌더 (lazy, 활성 탭만 DOM)
   - 모든 UI 카피 한국어. 기술 고유명/URL/파일명만 영어.
   ============================================================ */
"use strict";
(function () {
  const PROJECTS = (window.PROJECTS || []);
  const ATLAS    = (window.STACK_ATLAS || { unused: [] });
  const D        = (window.TSH_DATA || { perProject: [], combos: [] });

  // 프로젝트별 액센트(시각 구분용 — 대시보드 색과 독립)
  const ACCENT = ['#38bdf8', '#34d6c0', '#f4b740', '#fb7185', '#a78bfa', '#4ade80', '#f472b6', '#facc15'];

  /* ---------- normalize: seed(stackDetail) + 보강(enrichment) → 7필드 ---------- */
  function buildModel() {
    const active = PROJECTS.filter(p => p.id !== 'tech-stack');
    return active.map((p, i) => {
      const pd = D.perProject.find(x => x.projectId === p.id) || { enrichment: [], scenarios: [] };
      const sd = p.stackDetail || [];
      const rmap = {}, order = [];
      (pd.enrichment || []).forEach(e => {
        const seed = sd.find(s => s.area === e.area);
        const how = seed ? seed.how : '';
        if (!rmap[e.area]) { rmap[e.area] = { region: e.area, sourceHow: how, stacks: [] }; order.push(e.area); }
        rmap[e.area].stacks.push({
          tech: e.tech || '', role: e.role || '', what: e.what || '',
          withoutIt: e.withoutIt || '', example: e.example || '',
          sourceArea: e.area, sourceHow: how
        });
      });
      return {
        id: p.id, name: p.name || p.id, subtitle: p.subtitle || '',
        accent: ACCENT[i % ACCENT.length],
        regions: order.map(a => rmap[a]),
        scenarios: pd.scenarios || []
      };
    });
  }

  const MODEL  = buildModel();
  const COMBOS = D.combos || [];
  const UNUSED_TOTAL = (ATLAS.unused || []).reduce((n, g) => n + ((g.items || []).length), 0);

  /* ---------- 상태머신 ---------- */
  const first = MODEL[0] ? MODEL[0].id : null;
  const state = { tab: 's1', s1: first, s1r: 0, s2: first, s2i: 0, s3: 0 };

  /* ---------- 유틸 ---------- */
  const $  = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const proj = id => MODEL.find(m => m.id === id) || MODEL[0];

  const METRIC_META = {
    perf:       { label: '렌더링 효율', hint: '높을수록 화면이 빠름' },
    complexity: { label: '구조 복잡도', hint: '높을수록 코드가 복잡', invert: true },
    maintain:   { label: '유지보수성', hint: '높을수록 고치기 쉬움' },
    bundle:     { label: '초기 가벼움', hint: '높을수록 처음 로딩이 가벼움' }
  };

  function gauge(key, val) {
    const m = METRIC_META[key] || { label: key, hint: '' };
    const v = Math.max(0, Math.min(100, Number(val) || 0));
    // complexity는 높을수록 나쁨 → 빨강 계열, 그 외 높을수록 좋음 → 민트 계열
    const good = m.invert ? (100 - v) : v;
    const col = good >= 66 ? '#34d6c0' : good >= 40 ? '#f4b740' : '#fb7185';
    return `
      <div class="rounded-lg border border-line bg-base/60 p-3">
        <div class="flex items-baseline justify-between">
          <span class="text-xs font-bold text-slate-200">${esc(m.label)}</span>
          <span class="text-sm font-black" style="color:${col}">${v}</span>
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-line/70">
          <div class="meter h-full rounded-full" style="width:${v}%;background:${col}"></div>
        </div>
        <p class="mt-1 text-[11px] leading-4 text-slate-500">${esc(m.hint)}</p>
      </div>`;
  }

  /* ============================================================ S1 ============================================================ */
  function renderS1() {
    // 프로젝트 리스트
    $('s1-projects').innerHTML = MODEL.map(m => `
      <button type="button" class="fr block w-full rounded-lg border px-3 py-2 text-left text-sm transition
        ${m.id === state.s1 ? 'border-mint/70 bg-mint/10 font-bold text-white' : 'border-line bg-base/50 text-slate-300 hover:border-mint/40'}"
        data-act="s1-proj" data-id="${esc(m.id)}">
        <span class="inline-block h-2 w-2 rounded-full align-middle" style="background:${m.accent}"></span>
        <span class="ml-2 align-middle">${esc(m.name)}</span>
        <span class="ml-1 align-middle text-[11px] text-slate-500">· ${m.regions.length}영역</span>
      </button>`).join('');

    const p = proj(state.s1);
    if (state.s1r >= p.regions.length) state.s1r = 0;

    // 청사진 (영역 카드)
    $('s1-blueprint').innerHTML = p.regions.length
      ? p.regions.map((r, i) => `
        <button type="button" class="tsh-cell fr rounded-xl border border-line bg-base/55 p-3 text-left ${i === state.s1r ? 'active' : ''}"
          data-act="s1-region" data-i="${i}">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-bold text-white">${esc(r.region)}</span>
            <span class="shrink-0 rounded-full bg-mint/15 px-2 py-0.5 text-[11px] font-bold text-mint">${r.stacks.length}기술</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            ${r.stacks.map(s => `<span class="rounded bg-cyan/10 px-1.5 py-0.5 text-[11px] text-cyan">${esc(s.tech)}</span>`).join('')}
          </div>
        </button>`).join('')
      : `<p class="text-sm text-slate-400">분해 데이터가 없습니다.</p>`;

    // 인스펙터
    const r = p.regions[state.s1r];
    $('s1-inspector').innerHTML = r ? `
      <div class="mb-1 text-xs font-bold text-mint">${esc(p.name)}</div>
      <h3 class="text-lg font-black text-white">${esc(r.region)}</h3>
      <details class="mt-2 rounded-lg border border-line bg-base/50 p-2 text-xs text-slate-300">
        <summary class="cursor-pointer font-bold text-slate-200">원본 설계(seed) 보기</summary>
        <p class="mt-2 leading-5">${esc(r.sourceHow || '원본 how 데이터 없음')}</p>
      </details>
      <div class="mt-3 max-h-[60vh] space-y-3 overflow-auto tsh-scroll pr-1">
        ${r.stacks.map(s => `
          <article class="rounded-xl border border-line bg-panel/70 p-3">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-cyan/15 px-2 py-1 text-xs font-black text-cyan">${esc(s.tech)}</span>
            </div>
            <dl class="mt-2 space-y-2 text-[13px] leading-5">
              <div><dt class="font-bold text-mint">무슨 역할?</dt><dd class="text-slate-200">${esc(s.role)}</dd></div>
              <div><dt class="font-bold text-mint">한마디로</dt><dd class="text-slate-300">${esc(s.what)}</dd></div>
              <div><dt class="font-bold text-gold">없으면?</dt><dd class="text-slate-300">${esc(s.withoutIt)}</dd></div>
              <div><dt class="font-bold text-cyan">예시</dt><dd class="text-slate-300">${esc(s.example)}</dd></div>
            </dl>
          </article>`).join('')}
      </div>` : `<p class="text-sm text-slate-400">영역을 선택하세요.</p>`;
  }

  /* ============================================================ S2 ============================================================ */
  function renderS2() {
    const p = proj(state.s2);
    if (state.s2i >= p.scenarios.length) state.s2i = 0;

    // 프로젝트 칩 + 시나리오 리스트
    $('s2-list').innerHTML = `
      <div class="flex flex-wrap gap-1">
        ${MODEL.map(m => `
          <button type="button" class="fr rounded-full border px-2.5 py-1 text-xs transition
            ${m.id === state.s2 ? 'border-cyan/70 bg-cyan/15 font-bold text-white' : 'border-line bg-base/50 text-slate-400 hover:border-cyan/40'}"
            data-act="s2-proj" data-id="${esc(m.id)}">${esc(m.name)}</button>`).join('')}
      </div>
      <div class="mt-3 space-y-2">
        ${p.scenarios.map((sc, i) => `
          <button type="button" class="fr block w-full rounded-lg border px-3 py-2 text-left transition
            ${i === state.s2i ? 'border-cyan/70 bg-cyan/10' : 'border-line bg-base/50 hover:border-cyan/40'}"
            data-act="s2-scen" data-i="${i}">
            <div class="flex items-center gap-2">
              <span class="rounded bg-gold/15 px-1.5 py-0.5 text-[11px] font-bold text-gold">${esc(sc.layer)}</span>
            </div>
            <div class="mt-1 text-sm font-bold text-white">
              ${esc(sc.currentTech)} <span class="text-slate-500">→</span> <span class="text-cyan">${esc(sc.altTech)}</span>
            </div>
          </button>`).join('')}
      </div>`;

    const sc = p.scenarios[state.s2i];
    $('s2-detail').innerHTML = sc ? `
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded bg-gold/15 px-2 py-1 text-xs font-bold text-gold">${esc(sc.layer)} 계층</span>
        <span class="text-xs text-slate-400">${esc(p.name)}</span>
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-line bg-base/55 p-3">
          <div class="text-xs font-bold text-slate-400">현재 (AS-IS)</div>
          <div class="mt-1 text-base font-black text-white">${esc(sc.currentTech)}</div>
          <p class="mt-2 text-[13px] leading-5 text-slate-300">${esc(sc.currentMethod)}</p>
        </div>
        <div class="rounded-xl border border-cyan/40 bg-cyan/5 p-3">
          <div class="text-xs font-bold text-cyan">대체안 (TO-BE)</div>
          <div class="mt-1 text-base font-black text-cyan">${esc(sc.altTech)}</div>
          <p class="mt-2 text-[13px] leading-5 text-slate-200">${esc(sc.methodChange)}</p>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-xs font-bold text-slate-400">영향받는 구성요소</div>
        <div class="mt-2 flex flex-wrap gap-1">
          ${(sc.affectedComponents || []).map(c => `<span class="rounded-md border border-line bg-base/60 px-2 py-1 text-xs text-slate-200">${esc(c)}</span>`).join('')}
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-line bg-base/40 p-3">
        <div class="text-xs font-bold text-mint">화면에서 달라지는 점</div>
        <p class="mt-1 text-[13px] leading-5 text-slate-200">${esc(sc.visualChange)}</p>
      </div>

      <div class="mt-4">
        <div class="flex items-center justify-between">
          <div class="text-xs font-bold text-slate-400">대체 시 지표 변화</div>
          <span class="text-[11px] text-slate-500">교육용 상대 추정 · 실측 아님</span>
        </div>
        <div class="mt-2 grid gap-2 grid-cols-2 lg:grid-cols-4">
          ${gauge('perf', sc.metrics && sc.metrics.perf)}
          ${gauge('complexity', sc.metrics && sc.metrics.complexity)}
          ${gauge('maintain', sc.metrics && sc.metrics.maintain)}
          ${gauge('bundle', sc.metrics && sc.metrics.bundle)}
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-gold/40 bg-gold/5 p-3">
        <div class="text-xs font-bold text-gold">트레이드오프 (얻는 것 / 잃는 것)</div>
        <p class="mt-1 text-[13px] leading-5 text-slate-100">${esc(sc.tradeoff)}</p>
      </div>` : `<p class="text-sm text-slate-400">시나리오를 선택하세요.</p>`;
  }

  /* ============================================================ S3 ============================================================ */
  function srcBadge(src) {
    return src === 'unused'
      ? `<span class="rounded bg-gold/15 px-1.5 py-0.5 text-[11px] font-bold text-gold">미사용 핵심</span>`
      : `<span class="rounded bg-line/60 px-1.5 py-0.5 text-[11px] text-slate-400">보조(사용중)</span>`;
  }

  function renderS3() {
    if (state.s3 >= COMBOS.length) state.s3 = 0;

    $('s3-list').innerHTML = COMBOS.map((c, i) => {
      const core = (c.stacks || []).filter(s => s.source === 'unused').length;
      return `
        <button type="button" class="fr block w-full rounded-lg border px-3 py-2 text-left transition
          ${i === state.s3 ? 'border-gold/70 bg-gold/10' : 'border-line bg-base/50 hover:border-gold/40'}"
          data-act="s3-combo" data-i="${i}">
          <div class="text-sm font-bold text-white">${esc(c.name)}</div>
          <div class="mt-1 text-[11px] text-slate-400">미사용 핵심 ${core}종</div>
        </button>`;
    }).join('');

    const c = COMBOS[state.s3];
    $('s3-detail').innerHTML = c ? `
      <h3 class="text-xl font-black text-white">${esc(c.name)}</h3>
      <div class="mt-3 rounded-xl border border-line bg-base/45 p-3">
        <div class="text-xs font-bold text-mint">해결하려는 문제</div>
        <p class="mt-1 text-[13px] leading-5 text-slate-200">${esc(c.problem)}</p>
      </div>

      <div class="mt-4">
        <div class="text-xs font-bold text-slate-400">사용 스택</div>
        <div class="mt-2 flex flex-wrap gap-2">
          ${(c.stacks || []).map(s => `
            <span class="inline-flex items-center gap-1.5 rounded-md border border-line bg-base/60 px-2 py-1 text-xs text-slate-100">
              ${esc(s.tech)} ${srcBadge(s.source)}
            </span>`).join('')}
        </div>
      </div>

      <div class="mt-4">
        <div class="text-xs font-bold text-slate-400">아키텍처 구성</div>
        <div class="mt-2 overflow-hidden rounded-xl border border-line">
          ${(c.architecture || []).map((a, i) => `
            <div class="grid grid-cols-[100px_1fr] gap-2 px-3 py-2 text-[13px] ${i % 2 ? 'bg-base/40' : 'bg-base/20'}">
              <div><div class="font-bold text-cyan">${esc(a.part)}</div><div class="text-[11px] text-slate-500">${esc(a.tech)}</div></div>
              <div class="text-slate-300">${esc(a.role)}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="mt-4">
        <div class="text-xs font-bold text-slate-400">데이터 흐름</div>
        <div class="mt-2 grid gap-2 sm:grid-cols-4">
          ${[['입력', c.flow && c.flow.input], ['처리', c.flow && c.flow.process], ['렌더', c.flow && c.flow.render], ['저장', c.flow && c.flow.store]]
            .map(([k, v], i) => `
            <div class="relative rounded-lg border border-line bg-base/55 p-2.5">
              <div class="text-[11px] font-bold text-mint">${i + 1}. ${k}</div>
              <p class="mt-1 text-[12px] leading-4 text-slate-300">${esc(v)}</p>
            </div>`).join('')}
        </div>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-mint/40 bg-mint/5 p-3">
          <div class="text-xs font-bold text-mint">가치 (왜 가치 있나)</div>
          <p class="mt-1 text-[13px] leading-5 text-slate-100">${esc(c.value)}</p>
        </div>
        <div class="rounded-xl border border-danger/40 bg-danger/5 p-3">
          <div class="text-xs font-bold text-danger">리스크 (주의점)</div>
          <p class="mt-1 text-[13px] leading-5 text-slate-100">${esc(c.risk)}</p>
        </div>
      </div>` : `<p class="text-sm text-slate-400">조합을 선택하세요.</p>`;
  }

  /* ---------- 탭 ---------- */
  function setTab(t) {
    state.tab = t;
    ['s1', 's2', 's3'].forEach(k => {
      const panel = $('p-' + k); if (panel) panel.classList.toggle('on', k === t);
    });
    document.querySelectorAll('.tsh-tab').forEach(b => {
      const on = b.dataset.tab === t;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('bg-mint/15', on);
      b.classList.toggle('text-white', on);
      b.classList.toggle('text-slate-400', !on);
    });
    if (t === 's1') renderS1();
    else if (t === 's2') renderS2();
    else renderS3();
  }

  /* ---------- 이벤트 위임 ---------- */
  function onClick(e) {
    const btn = e.target.closest('[data-act],[data-tab]');
    if (!btn) return;
    if (btn.dataset.tab) { setTab(btn.dataset.tab); return; }
    const act = btn.dataset.act;
    if (act === 's1-proj')   { state.s1 = btn.dataset.id; state.s1r = 0; renderS1(); }
    else if (act === 's1-region') { state.s1r = +btn.dataset.i; renderS1(); }
    else if (act === 's2-proj')   { state.s2 = btn.dataset.id; state.s2i = 0; renderS2(); }
    else if (act === 's2-scen')   { state.s2i = +btn.dataset.i; renderS2(); }
    else if (act === 's3-combo')  { state.s3 = +btn.dataset.i; renderS3(); }
  }

  /* ---------- init ---------- */
  function init() {
    $('cnt-proj').textContent   = MODEL.length;
    $('cnt-unused').textContent = UNUSED_TOTAL;
    $('cnt-future').textContent = COMBOS.length;
    document.addEventListener('click', onClick);
    setTab('s1'); // 활성 탭만 초기 렌더 (lazy)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
