/* 단타 트레이딩 데스크 (desk) — C1, 현업 인트라데이 콕핏 유사
   소스: window.LEDGER(실측 OHLC) · window.POLARIS_CORE(유니버스) · window.POLARIS_DERIVED(상관·전이·변동성)
   가드레일: 피벗/ATR은 H/L 있는 KOSPI만(미국 ETF는 비활성 명시). 리스크 계산기는 사용자 가정 입력만(기본값·매매지시 없음).
   라이브 차트는 외부 참고(계산 미사용). 상관·전이는 n·탐색용 배지. */
"use strict";
(function () {
  const L = window.LEDGER, C = window.POLARIS_CORE, D = window.POLARIS_DERIVED;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const won = n => n == null ? '—' : Math.round(n).toLocaleString();
  const fx = (v, n = 2) => v == null || Number.isNaN(v) ? '—' : (v > 0 ? '+' : '') + (+v).toFixed(n);
  const up = v => v > 0 ? 'text-rose-400' : v < 0 ? 'text-sky-400' : 'text-slate-400'; // 한국 관례: 상승 빨강/하락 파랑

  /* ── 1) 오버나잇 릴레이 브리핑 ── */
  function relayBrief() {
    const usDates = L.us.soxl.map(r => r.date).sort();
    const Dt = usDates[usDates.length - 1];
    const sox = L.indices.rows.SOX.find(r => r.date === Dt);
    const soxl = L.us.soxl.find(r => r.date === Dt), soxs = L.us.soxs.find(r => r.date === Dt);
    const tr = D.transmission.SOX_to_SAMSUNG.lag1, trh = D.transmission.SOX_to_HYNIX.lag1;
    const lean = sox.chgPct >= D.quantiles.SOX_chgPct.p75 ? ['상승형 조건', 'rose'] : sox.chgPct <= D.quantiles.SOX_chgPct.p25 ? ['하락형 조건', 'sky'] : ['중립 구간', 'slate'];
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <h3 class="text-base font-bold text-white"><i class="fa-solid fa-moon text-violet-400"></i> 오버나잇 릴레이 브리핑 <span class="text-[11px] text-slate-500">최근 미국세션 ${esc(Dt)} → 다음 한국 개장</span></h3>
      <div class="grid sm:grid-cols-3 gap-3 mt-3">
        <div class="rounded-lg bg-slate-800/40 p-3"><div class="text-[11px] text-slate-500">필라델피아반도체(SOX)</div><div class="text-xl font-black ${up(sox.chgPct)}">${fx(sox.chgPct)}%</div></div>
        <div class="rounded-lg bg-slate-800/40 p-3"><div class="text-[11px] text-slate-500">SOXL / SOXS 본장</div><div class="text-xl font-black"><span class="${up(soxl.regChgPct)}">${fx(soxl.regChgPct)}%</span> <span class="text-slate-600 text-sm">/</span> <span class="${up(soxs.regChgPct)} text-base">${fx(soxs.regChgPct)}%</span></div></div>
        <div class="rounded-lg bg-${lean[1]}-500/10 ring-1 ring-${lean[1]}-500/25 p-3"><div class="text-[11px] text-slate-500">전이 시사 (다음 한국 개장)</div><div class="text-xl font-black text-${lean[1]}-300">${lean[0]}</div></div>
      </div>
      <p class="text-[12px] text-slate-400 mt-3">관측: 미국 반도체 세션은 한국 <b>같은날</b>이 아니라 <b>다음 거래일 시가</b>와 동행성이 높았습니다 — SOX→삼성 lag1 r=<b>${tr.r}</b>, SOX→하이닉스 lag1 r=<b>${trh.r}</b> <span class="rounded bg-amber-500/15 text-amber-400 px-1.5 py-0.5 text-[10px] font-bold">n=${tr.n} · 탐색용</span>. lag0(같은날)은 r≈0.02로 근거 없음.</p>
      <p class="text-[11px] text-slate-500 mt-1">※ 소표본 관측. 방향 단정·매매 신호가 아니라 <b>다음 개장 편향 참고</b>입니다.</p>
    </div>`;
  }

  /* ── 2) 핵심 레벨 (KOSPI 피벗/ATR) ── */
  function pivots(h, l, c) { const P = (h + l + c) / 3; return { P, R1: 2 * P - l, S1: 2 * P - h, R2: P + (h - l), S2: P - (h - l), R3: h + 2 * (P - l), S3: l - 2 * (h - P) }; }
  let levelSym = 'samsung';
  function levelsPanel() {
    const S = levelSym === 'samsung' ? { rows: L.kospi.samsung, name: '삼성전자', dk: 'SAMSUNG' } : { rows: L.kospi.hynix, name: 'SK하이닉스', dk: 'HYNIX' };
    const last = S.rows[S.rows.length - 1];
    const pv = pivots(last.high, last.low, last.close);
    const atrPct = D.perSymbol[S.dk].avgRangePct;
    const order = [['R3', pv.R3], ['R2', pv.R2], ['R1', pv.R1], ['P', pv.P], ['S1', pv.S1], ['S2', pv.S2], ['S3', pv.S3]];
    const symBtns = [['samsung', '삼성전자'], ['hynix', 'SK하이닉스']].map(([k, t]) => `<button data-lvl="${k}" class="px-2.5 py-1 rounded-lg text-[12px] font-bold ${levelSym === k ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40' : 'bg-slate-800/60 text-slate-400'}">${t}</button>`).join('');
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <div class="flex items-center justify-between flex-wrap gap-2"><h3 class="text-base font-bold text-white"><i class="fa-solid fa-ruler-horizontal text-emerald-400"></i> 핵심 레벨 (플로어 피벗)</h3><div class="flex gap-1.5">${symBtns}</div></div>
      <p class="text-[12px] text-slate-500 mt-1">${esc(S.name)} · ${esc(last.date)} 고/저/종(${won(last.high)}/${won(last.low)}/${won(last.close)})으로 산출한 <b>다음장 지지/저항</b>.</p>
      <div class="mt-3 space-y-1">${order.map(([k, v]) => {
        const isR = k[0] === 'R', isP = k === 'P';
        return `<div class="flex items-center gap-2"><span class="w-7 text-[11px] font-bold ${isP ? 'text-amber-400' : isR ? 'text-rose-400' : 'text-sky-400'}">${k}</span>
          <div class="flex-1 h-6 rounded ${isP ? 'bg-amber-500/10' : 'bg-slate-800/40'} relative"><span class="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-mono text-slate-200">${won(v)}</span></div></div>`;
      }).join('')}</div>
      <div class="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div class="rounded bg-slate-800/40 p-2"><span class="text-slate-500">평균 일중폭(ATR 근사)</span> <b class="text-slate-200">${atrPct}%</b> <span class="rounded bg-amber-500/15 text-amber-400 px-1 text-[10px]">n=${D.perSymbol[S.dk].days}</span></div>
        <div class="rounded bg-slate-800/40 p-2"><span class="text-slate-500">전일 종가</span> <b class="text-slate-200">${won(last.close)}</b></div>
      </div>
      <div class="mt-3 rounded-lg bg-slate-800/30 ring-1 ring-dashed ring-slate-700 p-3 text-[11px] text-slate-500">
        <b class="text-slate-400">미국 ETF(SOXL/SOXS):</b> market-ledger에 일중 고가/저가가 없어 <b class="text-amber-400">피벗·ATR 비활성</b>. 본장 시/종가와 실현 변동성(평균 |일변동| SOXL ${D.perSymbol.SOXL.meanAbsRegChgPct}%, SOXS ${D.perSymbol.SOXS.meanAbsRegChgPct}%)만 참고하세요.
      </div>
    </div>`;
  }

  /* ── 3) 리스크 계산기 (사용자 가정 입력만) ── */
  function riskCalc() {
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <h3 class="text-base font-bold text-white"><i class="fa-solid fa-calculator text-sky-400"></i> 리스크 계산기 <span class="text-[11px] text-slate-500">(가정 입력 · 매매 지시 아님)</span></h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        ${[['rc_acct', '계좌금액(원/USD)', '10000000'], ['rc_risk', '트레이드당 리스크 %', '1'], ['rc_entry', '가정 진입가', ''], ['rc_stop', '가정 손절가', '']].map(([id, lab, v]) =>
          `<label class="text-[11px] text-slate-500">${lab}<input id="${id}" type="number" step="any" value="${v}" class="mt-0.5 w-full bg-slate-800/60 text-slate-200 text-[13px] rounded px-2 py-1 ring-1 ring-slate-700"></label>`).join('')}
      </div>
      <div id="rc_out" class="mt-3"></div>
      <p class="text-[11px] text-slate-500 mt-2">1R = |진입가−손절가|. 수량 = (계좌×리스크%)÷1R. 입력한 가정값에 대한 리스크 산술일 뿐 <b>매수·매도·목표가 권유가 아닙니다.</b></p>
    </div>`;
  }
  function computeRisk() {
    const g = id => parseFloat($('#' + id)?.value);
    const acct = g('rc_acct'), riskPct = g('rc_risk'), entry = g('rc_entry'), stop = g('rc_stop');
    const out = $('#rc_out'); if (!out) return;
    if (![acct, riskPct, entry, stop].every(x => x != null && !Number.isNaN(x)) || entry === stop) { out.innerHTML = '<div class="text-[12px] text-slate-500">계좌·리스크%·진입·손절을 입력하면 R배수·수량을 계산합니다.</div>'; return; }
    const oneR = Math.abs(entry - stop), riskAmt = acct * riskPct / 100, shares = riskAmt / oneR;
    out.innerHTML = `<div class="grid grid-cols-3 gap-2 text-[13px]">
      <div class="rounded bg-slate-800/50 p-2"><div class="text-[11px] text-slate-500">1R (손절폭)</div><div class="font-bold text-slate-100">${oneR.toLocaleString(undefined,{maximumFractionDigits:2})}</div></div>
      <div class="rounded bg-slate-800/50 p-2"><div class="text-[11px] text-slate-500">위험금액</div><div class="font-bold text-slate-100">${won(riskAmt)}</div></div>
      <div class="rounded bg-slate-800/50 p-2"><div class="text-[11px] text-slate-500">가정 수량</div><div class="font-bold text-slate-100">${shares.toLocaleString(undefined,{maximumFractionDigits:2})}</div></div>
    </div>
    <p class="text-[11px] text-slate-500 mt-2">손익비는 1R·2R·3R 비율로 사전 계획에 참고하되, 구체적 목표가·방향은 본 도구가 제시하지 않습니다(매매 지시 아님).</p>`;
  }

  /* ── 4) 섹터 히트맵 (실측 일간 등락) ── */
  function heatmap() {
    const dates = [...new Set([...L.indices.rows.SOX.map(r => r.date), ...L.kospi.samsung.map(r => r.date)])].sort();
    const rowsDef = [
      ['SOX', L.indices.rows.SOX, 'chgPct'], ['나스닥', L.indices.rows.IXIC, 'chgPct'],
      ['SOXL', L.us.soxl, 'regChgPct'], ['SOXS', L.us.soxs, 'regChgPct'],
      ['삼성전자', L.kospi.samsung, 'chgPct'], ['SK하이닉스', L.kospi.hynix, 'chgPct'],
    ];
    function cell(v) {
      if (v == null) return `<td class="p-0.5"><div class="h-7 rounded bg-slate-800/30"></div></td>`;
      const a = Math.min(Math.abs(v) / 12, 1); const col = v > 0 ? '244,63,94' : '56,189,248';
      return `<td class="p-0.5"><div class="h-7 rounded flex items-center justify-center text-[10px] font-bold" style="background:rgba(${col},${(0.15 + a * 0.6).toFixed(2)});color:#e2e8f0">${fx(v, 1)}</div></td>`;
    }
    const head = `<th class="text-[10px] text-slate-500 pr-2 text-left">종목</th>` + dates.map(d => `<th class="text-[9px] text-slate-600 p-0.5">${d.slice(5)}</th>`).join('');
    const body = rowsDef.map(([name, rows, key]) => {
      const m = {}; rows.forEach(r => m[r.date] = r[key]);
      return `<tr><td class="text-[11px] text-slate-300 pr-2 font-semibold whitespace-nowrap">${esc(name)}</td>${dates.map(d => cell(m[d])).join('')}</tr>`;
    }).join('');
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <h3 class="text-base font-bold text-white"><i class="fa-solid fa-fire text-amber-400"></i> 섹터 히트맵 <span class="text-[11px] text-slate-500">6월 일간 등락(실측) · 상승 <span class="text-rose-400">빨강</span>/하락 <span class="text-sky-400">파랑</span></span></h3>
      <div class="overflow-x-auto mt-3"><table class="w-full border-separate" style="border-spacing:1px"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
    </div>`;
  }

  /* ── 5) 상관 스냅샷 ── */
  function corrSnap() {
    const cm = D.correlationMatrix;
    const pairs = [['SOX↔SOXL', cm.SOX.SOXL], ['SOXL↔SOXS', cm.SOXL.SOXS], ['삼성↔하이닉스', cm.SAMSUNG.HYNIX], ['SOX↔삼성(같은날)', cm.SOX.SAMSUNG], ['SOX↔하이닉스(같은날)', cm.SOX.HYNIX]];
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <h3 class="text-base font-bold text-white"><i class="fa-solid fa-diagram-project text-violet-400"></i> 상관 스냅샷 <span class="rounded bg-amber-500/15 text-amber-400 px-1.5 py-0.5 text-[10px] font-bold">n<20 · 탐색용</span></h3>
      <div class="mt-3 space-y-1.5">${pairs.map(([lab, o]) => `<div class="flex items-center gap-2 text-[12px]"><span class="w-44 text-slate-400">${esc(lab)}</span>
        <div class="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full ${o.r >= 0 ? 'bg-teal-500' : 'bg-violet-500'}" style="width:${Math.abs(o.r) * 100}%"></div></div>
        <span class="w-12 text-right font-mono ${o.r >= 0 ? 'text-teal-400' : 'text-violet-400'}">${o.r}</span></div>`).join('')}</div>
      <p class="text-[11px] text-slate-500 mt-2">막대 색은 <b>상관 방향</b>(정상관 <span class="text-teal-400">teal</span>·역상관 <span class="text-violet-400">violet</span>)이며 위 히트맵의 등락색(상승 빨강/하락 파랑)과 다릅니다. 같은 날짜 기준 SOX↔삼성/하이닉스 동행성은 낮습니다 — 전이는 다음 개장(릴레이 브리핑) 참조.</p>
    </div>`;
  }

  /* ── 6) 라이브 차트 (외부 참고) ── */
  function liveCharts() {
    const wl = [
      { s: 'AMEX:SOXL', n: 'SOXL' }, { s: 'AMEX:SOXS', n: 'SOXS' }, { s: 'NASDAQ:NVDA', n: '엔비디아' },
      { s: 'KRX:005930', n: '삼성전자' }, { s: 'KRX:000660', n: 'SK하이닉스' }, { s: 'NASDAQ:SMH', n: 'SMH(섹터)' },
    ];
    return `<div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
      <h3 class="text-base font-bold text-white"><i class="fa-solid fa-chart-line text-sky-400"></i> 라이브 차트 <span class="rounded bg-slate-700 text-slate-400 px-1.5 py-0.5 text-[10px] font-bold">외부(TradingView) · 계산 미사용</span></h3>
      <p class="text-[12px] text-slate-500 mt-1">아래 위젯은 TradingView 외부 제공 실시간 차트로, 본 데스크의 계산(피벗·통계)에는 쓰이지 않습니다.</p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">${wl.map(w => `<div class="rounded-lg border border-slate-800 bg-slate-950/40 p-1"><div class="text-[11px] text-slate-400 px-1 py-0.5">${esc(w.n)}</div><div class="tvmini" data-sym="${w.s}" style="height:150px"></div></div>`).join('')}</div>
    </div>`;
  }
  function injectTV() {
    document.querySelectorAll('.tvmini').forEach(el => {
      if (el.dataset.done) return; el.dataset.done = '1';
      const wrap = document.createElement('div'); wrap.className = 'tradingview-widget-container';
      const w = document.createElement('div'); w.className = 'tradingview-widget-container__widget'; wrap.appendChild(w);
      const s = document.createElement('script'); s.async = true;
      s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      s.textContent = JSON.stringify({ symbol: el.dataset.sym, width: '100%', height: 150, locale: 'kr', dateRange: '1M', colorTheme: 'dark', isTransparent: true, autosize: false, chartOnly: true });
      wrap.appendChild(s); el.appendChild(wrap);
    });
  }

  /* ── 7) 실행 품질 요약 ── */
  function execSummary() {
    return `<div class="rounded-2xl bg-slate-900/50 ring-1 ring-slate-800 p-4 flex items-center justify-between gap-3 flex-wrap">
      <div class="text-[12px] text-slate-400"><b class="text-slate-200"><i class="fa-solid fa-wave-square text-violet-400"></i> 체결 품질(휩쏘) 점검</b> — 방향이 맞아도 0%선 휩쏘가 잦으면 체결이 어려웠습니다. 종목·날짜별 체결 난이도를 사후 복기할 수 있습니다.</div>
      <a href="../flip-replay/" class="shrink-0 px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/40 text-[12px] font-bold">0%선 전환 리플레이어 열기 <i class="fa-solid fa-arrow-right"></i></a>
    </div>`;
  }

  function render() {
    $('#out').innerHTML = `
      ${relayBrief()}
      <div class="grid lg:grid-cols-2 gap-4 mt-4">${levelsPanel()}${riskCalc()}</div>
      <div class="mt-4">${heatmap()}</div>
      <div class="grid lg:grid-cols-2 gap-4 mt-4">${corrSnap()}${execSummary()}</div>
      <div class="mt-4">${liveCharts()}</div>`;
    computeRisk(); injectTV();
  }

  function init() {
    $('#asof').textContent = L.asOf;
    document.addEventListener('input', e => { if (e.target.id && e.target.id.startsWith('rc_')) computeRisk(); });
    document.addEventListener('click', e => { const b = e.target.closest('[data-lvl]'); if (b) { levelSym = b.dataset.lvl; render(); } });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
