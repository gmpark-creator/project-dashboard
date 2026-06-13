/* Polaris Market Intelligence — Market Ledger 렌더러
   data.js(window.LEDGER) 를 표·차트·캘린더로 렌더. 상승=빨강 / 하락=파랑(국내 관례). */
"use strict";
(function () {
  const D = window.LEDGER || {};
  const $ = s => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const WK = ['일','월','화','수','목','금','토'];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const safeUrl = u => (typeof u === 'string' && /^https?:\/\//i.test(u)) ? u.replace(/"/g, '%22') : '';
  const fmtKRW = v => v == null ? '—' : Number(v).toLocaleString('ko-KR');
  const fmtUSD = v => v == null ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const wd = ds => WK[new Date(ds + 'T00:00:00Z').getUTCDay()];
  const md = ds => ds.slice(5).replace('-', '.');

  function pct(p, big) {
    if (p == null) return '<span class="badge badge-flat">—</span>';
    const cls = p > 0 ? 'badge-up' : p < 0 ? 'badge-down' : 'badge-flat';
    const sign = p > 0 ? '+' : '';
    const arrow = p > 0 ? '▲' : p < 0 ? '▼' : '·';
    return `<span class="badge ${cls}" ${big ? 'style="font-size:14px;padding:3px 9px"' : ''}>${arrow} ${sign}${p.toFixed(2)}%</span>`;
  }
  const colorOf = p => p > 0 ? '#f6465d' : p < 0 ? '#3b82f6' : '#93a4c4';

  /* ---------- 헤더/푸터 메타 ---------- */
  if ($('#hdr-pp')) $('#hdr-pp').textContent = D.pricePeriod || '—';
  if ($('#hdr-cp')) $('#hdr-cp').textContent = D.calPeriod || '—';
  if ($('#hdr-asof')) $('#hdr-asof').textContent = D.asOf || '—';
  if ($('#ftr-src') && D.sources) $('#ftr-src').textContent = '출처: KOSPI — ' + D.sources.kospi + '  ·  US — ' + D.sources.us;

  /* ===================== 한국 ===================== */
  function krCard(meta, rows) {
    const last = rows[rows.length - 1], first = rows[0];
    const periodPct = +(((last.close - first.open) / first.open) * 100).toFixed(2);
    const hi = Math.max(...rows.map(r => r.high)), lo = Math.min(...rows.map(r => r.low));
    return el('div', 'card p-5', `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-[17px] font-extrabold text-white">${meta.name}</div>
          <div class="text-xs text-sub font-semibold tracking-wide">KOSPI · ${meta.code}</div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-extrabold tabular-nums" style="color:${colorOf(last.chgPct)}">₩${fmtKRW(last.close)}</div>
          <div class="mt-1">${pct(last.chgPct)} <span class="text-[11px] text-sub">6/12 종가</span></div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-2 mt-4 text-center">
        <div class="bg-panel2/60 rounded-lg py-2"><div class="text-[10px] text-sub">기간 등락(6/1시가→6/12종가)</div><div class="font-bold tabular-nums" style="color:${colorOf(periodPct)}">${periodPct > 0 ? '+' : ''}${periodPct}%</div></div>
        <div class="bg-panel2/60 rounded-lg py-2"><div class="text-[10px] text-sub">기간 최고</div><div class="font-bold tabular-nums text-up">₩${fmtKRW(hi)}</div></div>
        <div class="bg-panel2/60 rounded-lg py-2"><div class="text-[10px] text-sub">기간 최저</div><div class="font-bold tabular-nums text-down">₩${fmtKRW(lo)}</div></div>
      </div>`);
  }
  function krTable(meta, rows) {
    const body = rows.map(r => `<tr>
      <td class="text-muted font-semibold">${md(r.date)} <span class="text-sub text-[11px]">(${wd(r.date)})</span></td>
      <td class="text-right tabular-nums">₩${fmtKRW(r.open)}</td>
      <td class="text-right tabular-nums font-bold" style="color:${colorOf(r.chgPct)}">₩${fmtKRW(r.close)}</td>
      <td class="text-right">${pct(r.chgPct)}</td>
    </tr>`).join('');
    return el('div', 'card overflow-hidden', `
      <div class="px-4 py-3 border-b border-line flex items-center gap-2">
        <span class="font-bold text-white text-sm">${meta.name}</span><span class="text-xs text-sub">${meta.code}</span>
      </div>
      <div class="overflow-x-auto"><table>
        <thead><tr><th class="text-left">날짜</th><th class="text-right">시작가</th><th class="text-right">종가</th><th class="text-right">전일대비</th></tr></thead>
        <tbody>${body}</tbody>
      </table></div>`);
  }
  if (D.kospi) {
    const S = { name: '삼성전자', code: '005930' }, H = { name: 'SK하이닉스', code: '000660' };
    $('#kr-cards').append(krCard(S, D.kospi.samsung), krCard(H, D.kospi.hynix));
    $('#kr-tables').append(krTable(S, D.kospi.samsung), krTable(H, D.kospi.hynix));
  }

  /* ===================== 미국 ===================== */
  function usCard(meta, rows) {
    const last = rows[rows.length - 1], first = rows[0];
    const periodPct = +(((last.regClose - first.regOpen) / first.regOpen) * 100).toFixed(2);
    return el('div', 'card p-5', `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-[17px] font-extrabold text-white">${meta.ticker} <span class="text-[11px] font-bold ${meta.dir==='bull'?'text-up':'text-down'}">${meta.tag}</span></div>
          <div class="text-xs text-sub font-semibold">${meta.name}</div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-extrabold tabular-nums" style="color:${colorOf(last.regChgPct)}">$${fmtUSD(last.regClose)}</div>
          <div class="mt-1">${pct(last.regChgPct)} <span class="text-[11px] text-sub">6/12 본장</span></div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-4 text-center">
        <div class="bg-panel2/60 rounded-lg py-2"><div class="text-[10px] text-sub">기간 등락(6/1시가→6/12종가)</div><div class="font-bold tabular-nums" style="color:${colorOf(periodPct)}">${periodPct > 0 ? '+' : ''}${periodPct}%</div></div>
        <div class="bg-panel2/60 rounded-lg py-2"><div class="text-[10px] text-sub">6/12 시간외 종가</div><div class="font-bold tabular-nums text-ink">$${fmtUSD(last.extClose)}</div></div>
      </div>`);
  }
  function usTable(meta, rows) {
    const body = rows.map(r => `<tr>
      <td class="text-muted font-semibold">${md(r.date)} <span class="text-sub text-[11px]">(${wd(r.date)})</span></td>
      <td class="text-right tabular-nums">$${fmtUSD(r.regOpen)}</td>
      <td class="text-right tabular-nums font-bold" style="color:${colorOf(r.regChgPct)}">$${fmtUSD(r.regClose)}</td>
      <td class="text-right">${pct(r.regChgPct)}</td>
      <td class="text-right tabular-nums text-muted">$${fmtUSD(r.extOpen)}</td>
      <td class="text-right tabular-nums text-ink">$${fmtUSD(r.extClose)}</td>
      <td class="text-right">${pct(r.extChgPct)}</td>
    </tr>`).join('');
    return el('div', 'card overflow-hidden', `
      <div class="px-4 py-3 border-b border-line flex items-center gap-2">
        <span class="font-bold text-white text-sm">${meta.ticker}</span>
        <span class="text-[11px] font-bold ${meta.dir==='bull'?'text-up':'text-down'}">${meta.tag}</span>
        <span class="text-xs text-sub">${meta.name}</span>
      </div>
      <div class="overflow-x-auto"><table>
        <thead><tr>
          <th class="text-left">날짜</th>
          <th class="text-right" colspan="2" style="border-bottom:1px solid #243352">본장(정규장) 시가 · 종가</th>
          <th class="text-right">본장 전일比</th>
          <th class="text-right" colspan="2">시간외(야간) 시가 · 종가</th>
          <th class="text-right">시간외 전일比</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table></div>`);
  }
  if (D.us) {
    const L = { ticker: 'SOXL', name: 'Direxion 반도체 3배 롱', tag: '3× BULL', dir: 'bull' };
    const Sx = { ticker: 'SOXS', name: 'Direxion 반도체 3배 숏', tag: '3× BEAR', dir: 'bear' };
    $('#us-cards').append(usCard(L, D.us.soxl), usCard(Sx, D.us.soxs));
    $('#us-tables').append(usTable(L, D.us.soxl), usTable(Sx, D.us.soxs));
  }

  /* ===================== 차트 ===================== */
  function rebased(rows, key) { const b = rows[0][key]; return rows.map(r => +((r[key] / b) * 100).toFixed(2)); }
  function lineChart(id, labels, series) {
    const ctx = document.getElementById(id); if (!ctx || !window.Chart) return;
    new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: series.map(s => ({
        label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.color + '22',
        borderWidth: 2.2, pointRadius: 2.5, pointHoverRadius: 5, tension: .25, fill: false
      })) },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#93a4c4', font: { weight: 700 }, usePointStyle: true } },
          tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}` } } },
        scales: {
          x: { ticks: { color: '#64759a', font: { size: 11 } }, grid: { color: 'rgba(36,51,82,.4)' } },
          y: { ticks: { color: '#64759a', font: { size: 11 } }, grid: { color: 'rgba(36,51,82,.4)' } }
        }
      }
    });
  }
  if (D.kospi) {
    const labels = D.kospi.samsung.map(r => md(r.date));
    lineChart('krChart', labels, [
      { label: '삼성전자', data: rebased(D.kospi.samsung, 'close'), color: '#fbbf24' },
      { label: 'SK하이닉스', data: rebased(D.kospi.hynix, 'close'), color: '#38bdf8' }
    ]);
  }
  if (D.us) {
    const labels = D.us.soxl.map(r => md(r.date));
    lineChart('usChart', labels, [
      { label: 'SOXL (3× 롱)', data: rebased(D.us.soxl, 'regClose'), color: '#f6465d' },
      { label: 'SOXS (3× 숏)', data: rebased(D.us.soxs, 'regClose'), color: '#3b82f6' }
    ]);
  }

  /* ===================== 캘린더 ===================== */
  const IMP = { '최우선': 'imp-top', '높음': 'imp-high', '보통': 'imp-norm', '낮음': 'imp-norm' };
  const REGION_LABEL = { US: '🇺🇸 미국', KR: '🇰🇷 한국', GLOBAL: '🌐 글로벌' };
  function evChip(e) {
    const impCls = IMP[e.importance] || 'imp-norm';
    const statusCls = e.status === '예정' ? 'badge-flat' : (e.importance === '최우선' ? 'badge-up' : 'badge-down');
    const su = (e.sources && e.sources[0]) ? safeUrl(e.sources[0]) : '';
    const src = su ? `<a href="${su}" target="_blank" rel="noopener noreferrer" class="text-sub hover:text-sky text-[10px]"><i class="fa-solid fa-link"></i> 출처</a>` : '';
    const conf = e.confidence === 'low' ? '<span class="text-[10px] text-gold">· 확인필요</span>' : '';
    return `<div class="cal-cell ${impCls} p-2.5 mb-2">
      <div class="flex items-center gap-1.5 flex-wrap mb-1">
        <span class="badge ${statusCls}" style="font-size:10px;padding:1px 6px">${e.status}</span>
        <span class="text-[10px] font-bold text-sub uppercase tracking-wide">${esc(e.category || '')}</span>
        ${e.importance === '최우선' ? '<span class="text-[10px] font-bold text-up">★최우선</span>' : ''}
        ${conf}
      </div>
      <div class="text-[13px] font-bold text-ink leading-snug">${esc(e.title)}</div>
      ${e.detail ? `<div class="text-[11.5px] text-muted leading-snug mt-0.5">${esc(e.detail)}</div>` : ''}
      <div class="mt-1">${src}</div>
    </div>`;
  }
  function renderCalendar() {
    const cal = D.calendar || [];
    const status = $('#cal-status'), grid = $('#cal-grid');
    if (!cal.length) { if (status) status.textContent = '캘린더 데이터가 아직 준비되지 않았습니다.'; return; }
    if (status) status.style.display = 'none';
    // 날짜 그룹
    const byDate = {};
    cal.forEach(e => { (byDate[e.date] = byDate[e.date] || []).push(e); });
    const dates = [];
    for (let d = 1; d <= 30; d++) dates.push('2026-06-' + String(d).padStart(2, '0'));
    const impRank = { '최우선': 0, '높음': 1, '보통': 2 };
    const sortEv = a => a.sort((x, y) => (impRank[x.importance] ?? 3) - (impRank[y.importance] ?? 3));
    grid.innerHTML = dates.map(ds => {
      const evs = byDate[ds] || [];
      if (!evs.length) return '';
      const us = sortEv(evs.filter(e => e.region === 'US'));
      const kr = sortEv(evs.filter(e => e.region === 'KR'));
      const gl = sortEv(evs.filter(e => e.region === 'GLOBAL'));
      const isHoliday = evs.some(e => /휴장|공휴일|준틴스|Juneteenth|지방선거/.test((e.title + e.detail)));
      return `<div class="card p-4 ${isHoliday ? 'holiday' : ''}">
        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-line">
          <span class="text-lg font-extrabold text-white">6.${String(+ds.slice(8)).padStart(2,'0')}</span>
          <span class="text-xs text-sub font-semibold">(${wd(ds)})</span>
          <span class="text-[11px] text-sub ml-1">${evs.length}건</span>
        </div>
        ${gl.length ? `<div class="mb-3"><div class="text-[10px] font-bold text-violet uppercase tracking-wide mb-1">${REGION_LABEL.GLOBAL}</div>${gl.map(evChip).join('')}</div>` : ''}
        <div class="grid gap-x-4 md:grid-cols-2">
          <div><div class="text-[11px] font-bold text-emerald uppercase tracking-wide mb-1">${REGION_LABEL.US}</div>${us.length ? us.map(evChip).join('') : '<div class="text-[11px] text-sub py-2">—</div>'}</div>
          <div><div class="text-[11px] font-bold text-sky uppercase tracking-wide mb-1">${REGION_LABEL.KR}</div>${kr.length ? kr.map(evChip).join('') : '<div class="text-[11px] text-sub py-2">—</div>'}</div>
        </div>
      </div>`;
    }).join('');
  }
  renderCalendar();

  /* ===================== 탭 ===================== */
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const t = btn.dataset.tab;
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
    $('#sec-' + t).classList.add('on');
  }));
})();
