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
          <th class="text-right" colspan="2" style="border-bottom:1px solid #243352">본장(정규장) 시가 · 종가<br><span class="text-sub font-normal" style="font-size:9px;text-transform:none;letter-spacing:0">ET 09:30·16:00 / KST 22:30·05:00(익일)</span></th>
          <th class="text-right">본장 전일比</th>
          <th class="text-right" colspan="2">시간외(야간) 시가 · 종가<br><span class="text-sub font-normal" style="font-size:9px;text-transform:none;letter-spacing:0">ET 04:00·20:00 / KST 17:00·09:00(익일)</span></th>
          <th class="text-right">시간외 전일比</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table></div>`);
  }
  function flipsCard(meta, rows, opts) {
    opts = opts || {};
    const krw = opts.ccy === 'KRW', showET = !!opts.showET;
    const px = v => v == null ? '—' : (krw ? '₩' + fmtKRW(Math.round(v)) : '$' + (Math.abs(v) >= 20 ? Number(v).toFixed(2) : Number(v).toFixed(4)));
    const days = rows.filter(r => r.flips);
    const body = !days.length ? '<div class="text-[12px] text-sub p-2">장중 전환 데이터 없음.</div>' : days.map(r => {
      const f = r.flips, total = f.totalUp + f.totalDown;
      const stateCls = f.endState === '양수' ? 'badge-up' : f.endState === '음수' ? 'badge-down' : 'badge-flat';
      const cross = (f.crossings || []).map(c => {
        const dc = c.dir === '양전' ? 'up' : 'down';
        const tstr = (showET && c.etTime) ? `${esc(c.etTime)} ET · ${esc(c.kstTime)} KST` : `${esc(c.kstTime)} KST`;
        return `<div class="flex flex-wrap items-center gap-x-2 text-[11px] py-1 border-b" style="border-color:rgba(36,51,82,.45)">
          <span class="text-sub tabular-nums" style="min-width:${showET ? 128 : 64}px">${tstr}</span>
          <span class="text-sub" style="min-width:54px">${esc(c.session)}</span>
          <span class="${dc} font-bold" style="min-width:34px">${esc(c.dir)}</span>
          <span class="tabular-nums text-muted">${px(c.price)} <span class="${dc} font-semibold">(${c.pct > 0 ? '+' : ''}${c.pct}%)</span></span>
        </div>`;
      }).join('');
      const brk = krw
        ? `<div class="text-[10.5px] text-sub mt-1 mb-1">정규장 <span class="up font-bold">양${f.reg.up}</span>·<span class="down font-bold">음${f.reg.down}</span> · 기준 전일종가 ${px(f.prevClose)}</div>`
        : `<div class="text-[10.5px] text-sub mt-1 mb-1">본장 <span class="up font-bold">양${f.reg.up}</span>·<span class="down font-bold">음${f.reg.down}</span> / 시간외 <span class="up font-bold">양${f.ext.up}</span>·<span class="down font-bold">음${f.ext.down}</span> · 기준 전일종가 ${px(f.prevClose)}</div>`;
      const detail = total ? brk + cross
        : `<div class="text-[11px] text-sub mt-1">전환 0회 — 장 시작부터 마감까지 전일종가 한쪽(${f.endState})만 유지(교차 없음).</div>`;
      return `<details class="scn" style="border-bottom:1px solid #243352;padding-bottom:6px">
        <summary><i class="fa-solid fa-chevron-right chev text-[9px]"></i>
          <span class="font-bold text-ink">${md(r.date)} <span class="text-sub font-normal">(${wd(r.date)})</span></span>
          <span class="badge badge-up" style="font-size:10px">양전 ${f.totalUp}</span>
          <span class="badge badge-down" style="font-size:10px">음전 ${f.totalDown}</span>
          <span class="text-sub text-[10px]">총 ${total}회</span>
          <span class="badge ${stateCls}" style="font-size:10px">${esc(f.endState)} 마감</span>
        </summary>
        <div class="mt-1 pl-1">${detail}</div>
      </details>`;
    }).join('');
    const tag = meta.tag ? `<span class="text-[11px] font-bold ${meta.dir === 'bear' ? 'text-down' : 'text-up'}">${esc(meta.tag)}</span>` : '';
    return el('div', 'card overflow-hidden', `
      <div class="px-4 py-3 border-b border-line flex items-center gap-2">
        <span class="font-bold text-white text-sm">${esc(meta.ticker)}</span>${tag}
        <span class="text-xs text-sub">${esc(meta.sub || '장중 양전·음전 전환')}</span>
      </div>
      <div class="p-3 space-y-1.5">${body}</div>`);
  }
  if (D.us) {
    const L = { ticker: 'SOXL', name: 'Direxion 반도체 3배 롱', tag: '3× BULL', dir: 'bull' };
    const Sx = { ticker: 'SOXS', name: 'Direxion 반도체 3배 숏', tag: '3× BEAR', dir: 'bear' };
    $('#us-cards').append(usCard(L, D.us.soxl), usCard(Sx, D.us.soxs));
    $('#us-tables').append(usTable(L, D.us.soxl), usTable(Sx, D.us.soxs));
    if ($('#us-flips')) $('#us-flips').append(flipsCard(L, D.us.soxl, { ccy: 'USD', showET: true }), flipsCard(Sx, D.us.soxs, { ccy: 'USD', showET: true }));
  }
  if (D.kospi && $('#kr-flips')) {
    $('#kr-flips').append(
      flipsCard({ ticker: '삼성전자', sub: '005930' }, D.kospi.samsung, { ccy: 'KRW', showET: false }),
      flipsCard({ ticker: 'SK하이닉스', sub: '000660' }, D.kospi.hynix, { ccy: 'KRW', showET: false }));
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

  /* ---------- 미국 지수 영향 레이어 ---------- */
  const IDX_ORDER = ['나스닥종합', 'S&P500', '다우', '필라델피아반도체', '러셀2000'];
  const IDX_SHORT = { '나스닥종합': '나스닥', 'S&P500': 'S&P', '다우': '다우', '필라델피아반도체': '필반', '러셀2000': '러셀' };
  function rangeDir(s) {
    const nums = (String(s).match(/[-+]?\d+\.?\d*/g) || []).map(Number);
    if (!nums.length) return 'flat';
    const lo = Math.min(...nums), hi = Math.max(...nums);
    if (hi <= 0 && lo < 0) return 'down';
    if (lo >= 0 && hi > 0) return 'up';
    return 'flat';
  }
  const dirBadge = { up: 'badge-up', down: 'badge-down', flat: 'badge-flat' };
  function realizedRow(realized) {
    if (!realized) return '';
    const cells = IDX_ORDER.filter(k => realized[k] != null).map(k => {
      const v = realized[k];
      const cls = v > 0 ? 'badge-up' : v < 0 ? 'badge-down' : 'badge-flat';
      const sign = v > 0 ? '+' : '';
      return `<span class="ibadge ${cls}">${esc(IDX_SHORT[k])} ${sign}${v}%</span>`;
    }).join(' ');
    return `<div class="mt-1.5 flex flex-wrap gap-1 items-center">
      <span class="text-[9.5px] font-bold text-emerald uppercase tracking-wide mr-0.5">당일 실측</span>${cells}</div>`;
  }
  function probPills(rt) {
    if (!rt) return '';
    const cmap = { '동결': 'background:rgba(147,164,196,.16);color:#cbd5e1', '인하': 'background:rgba(52,211,153,.15);color:#34d399', '인상': 'background:rgba(246,70,93,.15);color:#f6465d' };
    const pills = (rt.probs || []).map(p => `<span class="prob-pill" style="${cmap[p.label] || ''}">${esc(p.label)} ${p.pct}%</span>`).join(' ');
    return `<div class="mt-1.5"><div class="text-[10px] font-bold text-gold mb-1">${esc(rt.title || '금리 결정 확률')}</div>
      <div class="flex flex-wrap gap-1">${pills}</div>
      ${rt.note ? `<div class="text-[10px] text-sub mt-1 leading-snug">${esc(rt.note)}</div>` : ''}</div>`;
  }
  function idxCells(indices) {
    return IDX_ORDER.map(k => {
      const v = (indices || {})[k] || '—';
      const d = rangeDir(v);
      const col = d === 'up' ? '#f6465d' : d === 'down' ? '#3b82f6' : '#93a4c4';
      return `<td style="color:${col};font-weight:700">${esc(v)}</td>`;
    }).join('');
  }
  function branchesTable(branches) {
    if (!branches || !branches.length) return '';
    const head = `<tr><th>시나리오 · 모델</th>${IDX_ORDER.map(k => `<th>${esc(IDX_SHORT[k])}</th>`).join('')}</tr>`;
    const rows = branches.map(b => {
      const occ = b.occurred ? ' scn-row-occ' : '';
      const star = b.occurred ? ' <span class="text-up font-bold">★실제</span>' : '';
      const op = b.opus, gp = b.gpt;
      let html = '';
      if (op) html += `<tr class="${occ}" style="border-top:1px solid #2c3c5e">
        <td><div class="text-ink font-bold leading-tight">${esc(b.name)}${star}</div>
            <div class="mt-0.5"><span class="m-opus">오푸스 4.8 · ${op.prob != null ? op.prob + '%' : '—'}</span></div></td>
        ${idxCells(op.indices)}</tr>`;
      if (gp) html += `<tr class="${occ}">
        <td style="padding-top:1px"><span class="m-gpt">지피티 5.5 · ${gp.prob != null ? gp.prob + '%' : '—'}</span></td>
        ${idxCells(gp.indices)}</tr>`;
      return html;
    }).join('');
    return `<div style="overflow-x:auto"><table class="scn-tbl"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
  }
  function impactHtml(u) {
    if (!u) return '';
    const sc = u.scenario;
    let inner = realizedRow(u.realized);
    if (!u.realized && u.realizedNA) {
      inner += `<div class="mt-1.5 text-[10px] text-sub"><i class="fa-regular fa-circle-pause mr-1"></i>${esc(u.realizedNA)}</div>`;
    }
    if (sc) {
      let body = '';
      if (sc.basis) body += `<div class="text-[10.5px] text-muted leading-snug mt-1">${esc(sc.basis)}</div>`;
      body += probPills(sc.rateTree);
      if (sc.noDirectional || sc.krSide) {
        // 표 없음 — basis로 충분
      } else {
        body += branchesTable(sc.branches);
        body += `<div class="text-[9.5px] text-sub mt-1.5">※ 각 분기의 <b class="text-muted">확률·지수 영향 %</b>는 <span class="m-opus">오푸스 4.8</span>·<span class="m-gpt">지피티 5.5</span> 두 모델의 <b class="text-muted">독립 예측(추정·범위, 실측 아님)</b>. 금리 동결/인하/인상 확률만 시장 내재확률(실측). 투자자문 아님.</div>`;
      }
      const tag = sc.centerpiece ? '<span class="text-[9px] font-bold text-up ml-1">핵심</span>' : '';
      inner += `<details class="scn"><summary><i class="fa-solid fa-chevron-right chev text-[9px]"></i>📊 미 지수 영향 예측 · ${esc(sc.kind || '시나리오')}${tag}</summary>${body}</details>`;
    }
    return inner ? `<div class="impact">${inner}</div>` : '';
  }
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
      ${impactHtml(e.usImpact)}
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
  function renderRatePanel() {
    const rp = D.ratePath, host = $('#rate-panel');
    if (!rp || !host) return;
    const mt = ds => { const p = (ds || '').split('-'); return p.length === 3 ? `${+p[1]}/${+p[2]}` : ds; };
    const cards = (rp.fedPath || []).map(m => {
      const cells = [['동결', m.hold, '#cbd5e1'], ['인하', m.cut, '#34d399'], ['인상', m.hike, '#f6465d']].map(([lab, v, c]) =>
        `<div class="flex items-center justify-between"><span class="text-[11px] text-sub">${lab}</span><span class="font-extrabold tabular-nums text-[13px]" style="color:${c}">${v}%</span></div>`).join('');
      return `<div class="bg-panel2/60 rounded-xl p-3 ring-1 ring-line">
        <div class="text-[11px] font-bold text-white mb-1.5">FOMC ${mt(m.meeting)}</div>${cells}</div>`;
    }).join('');
    const betas = D.betas ? Object.entries(D.betas).map(([k, v]) => `${IDX_SHORT[k] || k} ×${v}`).join(' · ') : '';
    host.innerHTML = `<div class="card p-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h3 class="font-bold text-white text-[15px]"><i class="fa-solid fa-landmark text-gold mr-1.5"></i>미국 금리 경로 — 시장 내재확률 <span class="text-sub text-xs font-medium">(CME FedWatch·선물, ${esc(rp.asOf || '')} 기준)</span></h3>
        <span class="text-[11px] text-sub">현 기준금리 <b class="text-muted">${esc(rp.currentRange || '')}</b></span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">${cards}</div>
      ${rp.note ? `<div class="text-[11.5px] text-muted leading-relaxed mt-3"><b class="text-gold">맥락</b> ${esc(rp.note)}</div>` : ''}
      ${rp.cuts2026 ? `<div class="text-[11px] text-sub leading-relaxed mt-1.5">${esc(rp.cuts2026)}</div>` : ''}
      <div class="text-[10.5px] text-sub leading-relaxed mt-3 pt-3 border-t border-line">
        <b class="text-muted"><i class="fa-solid fa-flask mr-1"></i>예측 방법론</b> — 각 이벤트에 <b class="text-emerald">당일 실측</b>(발생, 사실)과 <b class="text-violet">시나리오 예측</b>(모델 추정)을 함께 표기.
        시나리오별 지수 영향 %는 6월 실측 민감도(베타, S&P500 기준 ${esc(betas)})로 보정한 <b class="text-muted">추정 범위</b>이며 <b class="text-up">실측·확정이 아닙니다</b>.
        금리 동결/인하/인상 확률만 시장 내재확률(실측)입니다. <span class="text-sub">연구용 — 투자자문 아님.</span>
      </div>
    </div>`;
  }
  renderRatePanel();
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
