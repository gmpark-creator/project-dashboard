/* Polaris 데이터·지식 베이스 렌더러
   소스: window.LEDGER(실측) · window.POLARIS_CORE(유니버스·플레이북 등) · window.POLARIS_DERIVED(파생통계)
   가드레일: referenceOnly엔 통계 없음 · 모든 통계에 n 표기 · n<20 '탐색용' · 매매 지시 표현 없음 */
"use strict";
(function () {
  const CORE = window.POLARIS_CORE, D = window.POLARIS_DERIVED, L = window.LEDGER;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // 한국 색 관례: 상승=빨강, 하락=파랑
  const upDown = v => v > 0 ? 'text-rose-400' : v < 0 ? 'text-sky-400' : 'text-slate-400';
  const pct = v => (v == null ? '—' : (v > 0 ? '+' : '') + v.toFixed(2) + '%');
  const NAMES = { SOX: '필라델피아반도체', SOXL: 'SOXL', SOXS: 'SOXS', SAMSUNG: '삼성전자', HYNIX: 'SK하이닉스', IXIC: '나스닥', GSPC: 'S&P500' };

  /* ── 유니버스 ── */
  function renderUniverse() {
    const m = CORE.universe.measured, ref = CORE.universe.referenceOnly;
    const measuredRows = m.map(s => {
      const d = D.perSymbol[s.derivedKey] || {};
      const volStat = d.avgRangePct != null ? `평균 일중폭 ${d.avgRangePct}%` : (d.meanAbsRegChgPct != null ? `평균 |일변동| ${d.meanAbsRegChgPct}%` : '—');
      return `<tr class="border-t border-slate-800">
        <td class="py-2 pr-3"><span class="font-bold text-white">${esc(s.name)}</span> <span class="text-[11px] text-slate-500">${esc(s.ticker)}</span></td>
        <td class="py-2 pr-3 text-slate-400">${esc(s.role)}</td>
        <td class="py-2 pr-3"><span class="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold">실측 연결</span></td>
        <td class="py-2 pr-3 text-slate-300">${volStat.replace('\\|','|').replace('\\|','|')}</td>
      </tr>`;
    }).join('');
    const refGroups = Object.entries(ref).map(([g, arr]) => `
      <div class="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 p-4">
        <div class="text-xs font-bold text-violet-300 mb-2">${esc(g)} <span class="text-slate-500">· ${arr.length}종</span></div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          ${arr.map(s => `<div class="rounded-md bg-slate-800/70 px-2 py-1.5 text-[12px]">
            <div><b class="text-white">${esc(s.ticker)}</b> <span class="text-slate-300">${esc(s.name)}</span></div>
            <div class="text-[10px] text-slate-500 leading-tight">${esc(s.role)}</div></div>`).join('')}
        </div>
      </div>`).join('');
    return `
      <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
        <h3 class="text-base font-bold text-white flex items-center gap-2"><i class="fa-solid fa-database text-emerald-400"></i> 실측 연결 종목 (measured · ${m.length})</h3>
        <p class="text-[12px] text-slate-500 mt-1">market-ledger 6월 실측 OHLC 보유 → 파생통계(변동성·상관·전이) 연결 가능.</p>
        <div class="overflow-x-auto mt-3"><table class="w-full text-[13px]">
          <thead><tr class="text-left text-[11px] text-slate-500"><th class="pb-1 pr-3">종목</th><th class="pb-1 pr-3">역할</th><th class="pb-1 pr-3">데이터</th><th class="pb-1 pr-3">실현 변동성(6월)</th></tr></thead>
          <tbody>${measuredRows}</tbody>
        </table></div>
      </div>
      <div class="mt-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2"><i class="fa-solid fa-layer-group text-violet-400"></i> 참조 유니버스 (referenceOnly)</h3>
        <p class="text-[12px] text-slate-500 mt-1 mb-3">메타데이터(티커·역할·테마)만 — <b class="text-amber-400">파생통계 없음</b>(실측 OHLC 미보유 → 환각 통계 방지). 라이브 차트는 「트레이딩 데스크」에서 외부 위젯으로 제공.</p>
        <div class="grid gap-3 md:grid-cols-2">${refGroups}</div>
      </div>`;
  }

  /* ── 파생통계 ── */
  function nBadge(n) {
    const small = n < 20;
    return `<span class="rounded px-1.5 py-0.5 text-[10px] font-bold ${small ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}">n=${n}${small ? ' · 탐색용' : ''}</span>`;
  }
  function corrColor(r) {
    if (r == null) return 'background:#1e293b;color:#64748b';
    const a = Math.min(Math.abs(r), 1);
    // 정상관=teal, 역상관=violet (등락색 rose/sky와 의미 충돌 방지). n 작으므로 채도 낮춤(0.5배).
    const col = r >= 0 ? `45,212,191` : `167,139,250`;
    return `background:rgba(${col},${(a * 0.5).toFixed(2)});color:#e2e8f0`;
  }
  function renderDerived() {
    const keys = ['SOX', 'SOXL', 'SOXS', 'SAMSUNG', 'HYNIX', 'IXIC', 'GSPC'];
    const cm = D.correlationMatrix;
    const head = `<th class="p-1"></th>` + keys.map(k => `<th class="p-1 text-[10px] text-slate-400">${esc(NAMES[k] || k)}</th>`).join('');
    const rows = keys.map(a => `<tr><td class="p-1 text-[10px] text-slate-400 text-right pr-2">${esc(NAMES[a] || a)}</td>${keys.map(b => {
      const c = cm[a][b]; return `<td class="p-1 text-center text-[11px] font-bold rounded" style="${corrColor(c.r)}" title="r=${c.r}, n=${c.n}">${c.r == null ? '—' : c.r}</td>`;
    }).join('')}</tr>`).join('');

    const t = D.transmission;
    function transCard(title, o) {
      return `<div class="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 p-4">
        <div class="text-[13px] font-bold text-white mb-2">${esc(title)}</div>
        <div class="grid grid-cols-2 gap-2 text-[12px]">
          <div class="rounded bg-slate-800/50 p-2">
            <div class="text-slate-500 text-[10px]">같은날(lag0) <span class="text-slate-600">전야 근사</span></div>
            <div class="text-lg font-black text-slate-300">r=${o.lag0.r}</div>
            <div class="text-[10px] text-slate-500">기울기 ${o.lag0.slope} · 부호일치 ${(o.lag0.signHitRate*100).toFixed(0)}% · ${nBadge(o.lag0.n)}</div>
          </div>
          <div class="rounded bg-emerald-500/5 ring-1 ring-emerald-500/20 p-2">
            <div class="text-emerald-400 text-[10px] font-bold">다음거래일(lag1) ★</div>
            <div class="text-lg font-black text-emerald-300">r=${o.lag1.r}</div>
            <div class="text-[10px] text-slate-500">기울기 ${o.lag1.slope} · 부호일치 ${(o.lag1.signHitRate*100).toFixed(0)}% · ${nBadge(o.lag1.n)}</div>
          </div>
        </div>
      </div>`;
    }
    function symStat(key) {
      const d = D.perSymbol[key], kr = key === 'SAMSUNG' || key === 'HYNIX';
      const items = kr ? [
        ['상승/하락일', `${d.upDays}/${d.downDays}`], ['평균 일변동', pct(d.meanChgPct)], ['변동성(σ)', d.stdChgPct + '%'],
        ['평균 일중폭', d.avgRangePct + '%'], ['최대 일중폭', d.maxRangePct + '%'], ['평균 시가갭', pct(d.avgGapPct)],
        ['최고/최저일', `${pct(d.maxUpPct)} / ${pct(d.maxDownPct)}`], ['평균 거래량', d.avgVolume.toLocaleString()],
      ] : [
        ['상승/하락일', `${d.upDays}/${d.downDays}`], ['평균 일변동(본장)', pct(d.meanRegChgPct)], ['변동성(σ)', d.stdRegChgPct + '%'],
        ['평균 |일변동|', d.meanAbsRegChgPct + '%'], ['최고/최저일', `${pct(d.maxUpPct)} / ${pct(d.maxDownPct)}`],
        ['시간외 vs 본장종가', pct(d.avgExtVsRegPct)], ['평균 거래량', d.avgVolume.toLocaleString()],
      ];
      return `<div class="rounded-xl bg-slate-900/50 ring-1 ring-slate-800 p-4">
        <div class="text-[13px] font-bold text-white mb-2">${esc(NAMES[key])} <span class="text-[10px] text-slate-500">${nBadge(d.days)}</span></div>
        <div class="grid grid-cols-2 gap-y-1 text-[12px]">
          ${items.map(([k, v]) => `<div class="text-slate-500">${k}</div><div class="text-right text-slate-200 font-semibold">${v}</div>`).join('')}
        </div></div>`;
    }
    return `
      <div class="rounded-2xl bg-amber-500/5 ring-1 ring-amber-500/30 p-3 mb-4 text-[12px] text-amber-300/90 flex items-start gap-2">
        <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
        <span>아래 통계는 <b>2026년 6월 8~10 거래일</b>이라는 <b>소표본</b> 관측 기록입니다. 통계적 일반화·예측이 아니며, n과 표본기간을 함께 표기합니다. <b>투자자문 아님.</b></span>
      </div>
      <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
        <h3 class="text-base font-bold text-white"><i class="fa-solid fa-table-cells text-sky-400"></i> 상관행렬 (일간수익률 Pearson r)</h3>
        <p class="text-[12px] text-slate-500 mt-1 mb-3">겹치는 거래일 기준. <span class="text-teal-400">정상관</span>/<span class="text-violet-400">역상관</span> <b>(상승/하락 등락색이 아니라 상관 방향 색)</b>. 소표본이라 채도 낮춤.</p>
        <div class="overflow-x-auto"><table class="border-separate" style="border-spacing:3px"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
        <p class="text-[11px] text-slate-500 mt-2">관측: SOX↔SOXL ${cm.SOX.SOXL.r}(레버리지 정합) · SOXL↔SOXS ${cm.SOXL.SOXS.r}(역방향 정합) · 삼성↔하이닉스 ${cm.SAMSUNG.HYNIX.r} · <b>SOX↔삼성 같은날 ${cm.SOX.SAMSUNG.r}(동행성 낮음)</b>.</p>
      </div>
      <div class="mt-4">
        <h3 class="text-base font-bold text-white mb-1"><i class="fa-solid fa-arrow-right-arrow-left text-violet-400"></i> 미국 → 한국 오버나잇 전이</h3>
        <p class="text-[12px] text-slate-500 mb-3">미국 반도체 세션이 한국 <b>같은날</b> 시가갭(lag0)과 <b>다음 거래일</b> 시가갭(lag1)에 미치는 동행성. <b class="text-emerald-400">관측상 lag1이 뚜렷</b> — 미국 세션 영향은 당일이 아니라 다음 한국 개장에 나타나는 경향(소표본).</p>
        <div class="grid gap-3 md:grid-cols-2">
          ${transCard('SOX → 삼성전자 시가갭', t.SOX_to_SAMSUNG)}
          ${transCard('SOX → SK하이닉스 시가갭', t.SOX_to_HYNIX)}
          ${transCard('SOXL → 삼성전자 시가갭', t.SOXL_to_SAMSUNG)}
          ${transCard('SOXL → SK하이닉스 시가갭', t.SOXL_to_HYNIX)}
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-base font-bold text-white mb-3"><i class="fa-solid fa-chart-simple text-emerald-400"></i> 종목별 실현 통계 (6월)</h3>
        <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          ${['SAMSUNG', 'HYNIX', 'SOXL', 'SOXS'].map(symStat).join('')}
        </div>
      </div>`;
  }

  /* ── 플레이북 ── */
  function renderPlaybook() {
    return `<div class="rounded-xl bg-amber-500/5 ring-1 ring-amber-500/25 p-3 mb-3 text-[12px] text-amber-300/90"><i class="fa-solid fa-circle-info"></i> 아래는 2026년 6월 실측 데이터에서 <b>관측된 과거 패턴 기록</b>입니다. 진입·손절·매매 지시가 아니며 성과·승률을 제시하지 않습니다.</div><div class="grid gap-3 md:grid-cols-2">` + CORE.playbook.map(p => `
      <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-white">${esc(p.name)} <span class="text-[11px] text-slate-500">${esc(p.nameEn)}</span></h3>
        </div>
        <p class="text-[13px] text-slate-300 mt-1">${esc(p.idea)}</p>
        <div class="mt-2 rounded-lg bg-slate-800/50 p-3 text-[12px] text-slate-300"><b class="text-sky-300">규칙</b> · ${esc(p.rule)}</div>
        <div class="mt-2 text-[12px]"><b class="text-emerald-300">6월 실측 예시</b>
          <ul class="mt-1 space-y-1">${p.examples.map(ex => `<li class="text-slate-400"><span class="text-slate-200 font-semibold">${esc(ex.date)} ${esc(ex.symbol)}</span> — ${esc(ex.what)} <span class="text-[10px] text-slate-600">(${esc(ex.ledgerRef)})</span></li>`).join('')}</ul></div>
        <p class="mt-2 text-[11px] text-amber-400/80"><i class="fa-solid fa-circle-exclamation"></i> ${esc(p.caution)}</p>
      </div>`).join('') + `</div>`;
  }

  /* ── 리스크규칙 ── */
  function renderRisk() {
    return `<div class="grid gap-3 md:grid-cols-2">` + CORE.riskRules.map(r => `
      <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
        <h3 class="text-base font-bold text-white"><i class="fa-solid fa-shield-halved text-rose-400"></i> ${esc(r.title)}</h3>
        <p class="text-[13px] text-slate-300 mt-1">${esc(r.detail)}</p>
        ${r.formula ? `<div class="mt-2 rounded bg-slate-800/60 px-3 py-2 text-[12px] font-mono text-sky-300">${esc(r.formula)}</div>` : ''}
      </div>`).join('') + `</div>`;
  }

  /* ── 용어집 ── */
  function renderGlossary() {
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5"><dl class="grid gap-3 md:grid-cols-2">` +
      CORE.glossary.map(g => `<div class="rounded-lg bg-slate-800/40 p-3">
        <dt class="font-bold text-white text-[14px]">${esc(g.term)} <span class="text-[11px] text-slate-500">${esc(g.termEn || '')}</span></dt>
        <dd class="text-[12px] text-slate-400 mt-0.5">${esc(g.def)}</dd></div>`).join('') + `</dl></div>`;
  }

  const TABS = {
    universe: { label: '유니버스', render: renderUniverse },
    derived: { label: '파생통계', render: renderDerived },
    playbook: { label: '플레이북', render: renderPlaybook },
    risk: { label: '리스크 규칙', render: renderRisk },
    glossary: { label: '용어집', render: renderGlossary },
  };
  function setTab(t) {
    $('#content').innerHTML = TABS[t].render();
    document.querySelectorAll('[data-tab]').forEach(b => {
      const on = b.dataset.tab === t;
      b.className = 'data-tab px-3 py-2 rounded-lg text-[13px] font-bold transition ' + (on ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40' : 'text-slate-400 hover:text-slate-200');
    });
  }
  function init() {
    $('#asof').textContent = CORE.meta.asOf;
    $('#nav').innerHTML = Object.entries(TABS).map(([k, v]) => `<button data-tab="${k}" class="data-tab px-3 py-2 rounded-lg text-[13px] font-bold text-slate-400">${v.label}</button>`).join('');
    document.addEventListener('click', e => { const el = e.target.closest('[data-tab]'); if (el) setTab(el.dataset.tab); });
    setTab('universe');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
