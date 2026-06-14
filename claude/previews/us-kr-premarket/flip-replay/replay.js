/* 0%선 전환 리플레이어 (flip-replay) — Codex 아이디어, 변증법 R1~R2 사양
   소스: window.LEDGER flips.crossings (실측 5분봉 0%선 양전/음전 기록)
   목적: '방향이 맞아도 체결이 어려웠던 장'과 '깨끗하게 밀어준 장'을 구분(체결 난이도 복기).
   가드레일: 매수/매도 아님 → '이 과거 장은 체결 난이도가 높/낮았다'로만 표현. 사후 복기 전용. */
"use strict";
(function () {
  const L = window.LEDGER;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const round = (x, n = 0) => Math.round(x * 10 ** n) / 10 ** n;
  function median(arr) { const v = arr.filter(x => x != null).slice().sort((a, b) => a - b); if (!v.length) return null; const m = Math.floor(v.length / 2); return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2; }

  const SYMS = {
    samsung: { rows: L.kospi.samsung, name: '삼성전자', isUS: false },
    hynix: { rows: L.kospi.hynix, name: 'SK하이닉스', isUS: false },
    soxl: { rows: L.us.soxl, name: 'SOXL', isUS: true },
    soxs: { rows: L.us.soxs, name: 'SOXS', isUS: true },
  };

  // "HH:MM" (또는 "HH:MM(익일)") → 분. 익일 표기는 ET 기준 세션 판정엔 사용 안 함.
  function toMin(t) { if (!t) return null; const m = String(t).match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : null; }
  const stateOf = dir => dir === '양전' ? '양수' : '음수';

  function isLate(c, isUS) {
    if (!c) return false;
    if (isUS) return c.session === '애프터마켓' || (toMin(c.etTime) != null && toMin(c.etTime) >= 15 * 60);
    return toMin(c.kstTime) != null && toMin(c.kstTime) >= 14 * 60 + 30;
  }
  function isOpening(c, isUS) {
    if (!c) return false;
    if (isUS) { const m = toMin(c.etTime); return c.session === '본장' && m != null && m >= 9 * 60 + 30 && m <= 10 * 60 + 30; }
    const m = toMin(c.kstTime); return m != null && m >= 9 * 60 && m <= 10 * 60;
  }

  function analyze(row, isUS) {
    const f = row.flips || {};
    const cr = f.crossings || [];
    const total = (f.totalUp || 0) + (f.totalDown || 0);
    const regTotal = (f.reg?.up || 0) + (f.reg?.down || 0);
    const extTotal = (f.ext?.up || 0) + (f.ext?.down || 0);
    const balance = total === 0 ? 0 : Math.min(f.totalUp || 0, f.totalDown || 0) / Math.max(f.totalUp || 0, f.totalDown || 0);
    const first = cr[0], last = cr[cr.length - 1];
    const regCross = cr.filter(c => isUS ? c.session === '본장' : true);
    const firstRegular = regCross[0], lastRegular = regCross[regCross.length - 1];
    const endState = f.endState;
    // 군집수(방향 교차 횟수) · 종가 방향 정합(첫/마지막 전환 방향과 종가 일치 여부)
    let flipClusterCount = 0; for (let i = 1; i < cr.length; i++) if (cr[i].dir !== cr[i - 1].dir) flipClusterCount++;
    const closeMatchesFirst = first ? endState === stateOf(first.dir) : null;
    const closeMatchesLast = last ? endState === stateOf(last.dir) : null;

    // 라벨 (우선순위: 전환 0회=Clean → Zero-line chop → 후반/개장 반전 → Clean trend(fallback))
    let label, labelKo;
    if (total === 0) { label = 'Clean trend'; }
    else if ((total >= 4 && Math.min(f.totalUp || 0, f.totalDown || 0) >= 2) || regTotal >= 4 || extTotal >= 5) { label = 'Zero-line chop'; }
    else if (isLate(last, isUS) && last && endState === stateOf(last.dir)) { label = last.dir === '양전' ? 'Late reclaim' : 'Late fade'; }
    else if (firstRegular && isOpening(firstRegular, isUS) && regTotal >= 1 && regTotal <= 3 && lastRegular && endState === stateOf(lastRegular.dir)) { label = 'Opening reversal'; }
    else { label = 'Clean trend'; }
    labelKo = { 'Clean trend': '깨끗한 추세', 'Zero-line chop': '제로라인 휩쏘', 'Late reclaim': '후반 회복', 'Late fade': '후반 페이드', 'Opening reversal': '개장 반전' }[label];

    // 휩쏘 지수
    const marketTotalCap = isUS ? 8 : 4, regCap = 4, extCap = isUS ? 5 : 1;
    const medAbs = cr.length ? median(cr.map(c => Math.abs(c.pct))) : Infinity;
    const zeroProximity = 1 - Math.min((medAbs == null ? Infinity : medAbs) / 1.0, 1);
    const whipsawIndex = round(100 * clamp01(
      0.35 * Math.min(total / marketTotalCap, 1) +
      0.20 * Math.min(regTotal / regCap, 1) +
      0.15 * Math.min(extTotal / extCap, 1) +
      0.15 * balance +
      0.10 * zeroProximity +
      0.05 * (isLate(last, isUS) ? 1 : 0)
    ));
    return { total, regTotal, extTotal, balance, first, last, firstRegular, lastRegular, endState, label, labelKo, whipsawIndex, flipClusterCount, closeMatchesFirst, closeMatchesLast, crossings: cr };
  }

  function whipBand(w) {
    if (w <= 24) return { t: '낮음', c: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (w <= 49) return { t: '보통', c: 'text-sky-400', bg: 'bg-sky-500' };
    if (w <= 74) return { t: '높음', c: 'text-amber-400', bg: 'bg-amber-500' };
    return { t: '극단적', c: 'text-rose-400', bg: 'bg-rose-500' };
  }
  const LABEL_COLOR = { 'Clean trend': 'emerald', 'Opening reversal': 'amber', 'Zero-line chop': 'rose', 'Late reclaim': 'sky', 'Late fade': 'violet' };

  // ── 렌더 ──
  let cur = { sym: 'soxl', date: null, plan: 'none' };

  function renderControls() {
    const symBtns = Object.entries(SYMS).map(([k, v]) =>
      `<button data-sym="${k}" class="px-3 py-1.5 rounded-lg text-[13px] font-bold ${cur.sym === k ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40' : 'bg-slate-800/60 text-slate-400'}">${esc(v.name)}</button>`).join('');
    const rows = SYMS[cur.sym].rows;
    if (!cur.date || !rows.find(r => r.date === cur.date)) cur.date = rows[rows.length - 1].date;
    const dateOpts = rows.map(r => `<option value="${r.date}" ${r.date === cur.date ? 'selected' : ''}>${r.date}</option>`).join('');
    const planBtns = [['none', '계획 없음'], ['long', '롱 계획'], ['short', '숏 계획']].map(([k, t]) =>
      `<button data-plan="${k}" class="px-2.5 py-1.5 rounded-lg text-[12px] font-bold ${cur.plan === k ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/40' : 'bg-slate-800/60 text-slate-400'}">${t}</button>`).join('');
    $('#controls').innerHTML = `
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[11px] text-slate-500 w-full sm:w-auto">종목</span>${symBtns}
        <span class="text-[11px] text-slate-500 ml-2">날짜</span>
        <select id="dateSel" class="bg-slate-800/60 text-slate-200 text-[13px] rounded-lg px-2 py-1.5 ring-1 ring-slate-700">${dateOpts}</select>
        <span class="text-[11px] text-slate-500 ml-2">계획 스트레스</span>${planBtns}
      </div>`;
  }

  function timeStr(c, isUS) { return isUS ? `${esc(c.kstTime)} KST / ${esc(c.etTime)} ET` : `${esc(c.kstTime)} KST`; }

  function render() {
    renderControls();
    const S = SYMS[cur.sym], isUS = S.isUS;
    const row = S.rows.find(r => r.date === cur.date);
    const a = analyze(row, isUS);
    const wb = whipBand(a.whipsawIndex);
    const lc = LABEL_COLOR[a.label];

    // 전환 타임라인
    const timeline = a.crossings.length ? a.crossings.map(c => `
      <li class="flex items-center gap-2 text-[12px] py-1 border-b border-slate-800/60">
        <span class="w-12 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${c.dir === '양전' ? 'bg-rose-500/15 text-rose-400' : 'bg-sky-500/15 text-sky-400'}">${esc(c.dir)}</span>
        <span class="text-slate-400 w-40 shrink-0">${timeStr(c, isUS)}</span>
        <span class="text-slate-500">${esc(c.session)}</span>
        <span class="ml-auto font-mono ${c.pct > 0 ? 'text-rose-400' : 'text-sky-400'}">${c.pct > 0 ? '+' : ''}${c.pct}%</span>
        <span class="text-slate-500 font-mono w-20 text-right">${c.price?.toLocaleString?.() ?? c.price}</span>
      </li>`).join('') : '<li class="text-[12px] text-slate-500 py-2">0%선 전환 없음 — 한 방향 유지(체결 난이도 낮음).</li>';

    // 계획 스트레스 테스트
    let stress = '';
    if (cur.plan !== 'none') {
      const adverseDir = cur.plan === 'long' ? '음전' : '양전';
      const adverse = a.crossings.filter(c => c.dir === adverseDir);
      const firstAdv = adverse[0];
      stress = `<div class="rounded-xl bg-violet-500/5 ring-1 ring-violet-500/25 p-4">
        <div class="text-[13px] font-bold text-violet-300 mb-1"><i class="fa-solid fa-flask"></i> 계획 스트레스 테스트 — ${cur.plan === 'long' ? '롱' : '숏'} 가정</div>
        <p class="text-[12px] text-slate-300">이 과거 장에서 ${cur.plan === 'long' ? '롱' : '숏'} 방향에 <b>불리한 전환(${adverseDir})</b>은 <b class="text-rose-400">${adverse.length}회</b> 발생했습니다${firstAdv ? `, 첫 불리 전환은 <b>${timeStr(firstAdv, isUS)}</b> (${firstAdv.pct > 0 ? '+' : ''}${firstAdv.pct}%)` : ''}.</p>
        <p class="text-[11px] text-slate-500 mt-1">※ 과거 체결 난이도 복기일 뿐, 매매 권유가 아닙니다.</p>
      </div>`;
    }

    // 미·한 릴레이 비교: 선택일 기준, 미국이면 다음 한국 거래일 / 한국이면 직전 미국 거래일
    let relay = '';
    function miniSummary(label, rows, date, isUSx) {
      const r = rows.find(x => x.date === date); if (!r) return `<div class="text-[12px] text-slate-500">${label}: 데이터 없음</div>`;
      const aa = analyze(r, isUSx); const w = whipBand(aa.whipsawIndex);
      return `<div class="rounded-lg bg-slate-800/40 p-3">
        <div class="text-[11px] text-slate-500">${label} · ${date}</div>
        <div class="text-[13px] font-bold text-${LABEL_COLOR[aa.label]}-400">${aa.labelKo} <span class="text-slate-500 text-[11px]">${aa.label}</span></div>
        <div class="text-[11px] text-slate-400 mt-0.5">전환 ${aa.total}회 · 휩쏘 <b class="${w.c}">${aa.whipsawIndex}</b>(${w.t}) · 종가 ${esc(aa.endState)}</div>
      </div>`;
    }
    if (isUS) {
      const krDates = L.kospi.samsung.map(r => r.date).filter(d => d > cur.date).sort();
      const nd = krDates[0];
      relay = `<div class="grid md:grid-cols-3 gap-2">
        ${miniSummary(`${S.name}(미국 ${cur.date})`, S.rows, cur.date, true)}
        ${miniSummary('→ 다음 한국장 삼성전자', L.kospi.samsung, nd, false)}
        ${miniSummary('→ 다음 한국장 SK하이닉스', L.kospi.hynix, nd, false)}
      </div>`;
    } else {
      const usDates = L.us.soxl.map(r => r.date).filter(d => d < cur.date).sort();
      const pd = usDates[usDates.length - 1];
      relay = `<div class="grid md:grid-cols-3 gap-2">
        ${miniSummary(`직전 미국장 SOXL`, L.us.soxl, pd, true)}
        ${miniSummary(`직전 미국장 SOXS`, L.us.soxs, pd, true)}
        ${miniSummary(`${S.name}(한국 ${cur.date})`, S.rows, cur.date, false)}
      </div>`;
    }

    $('#out').innerHTML = `
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-4">
          <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h3 class="text-base font-bold text-white">${esc(S.name)} · ${cur.date} 전환 타임라인</h3>
              <span class="rounded-full px-3 py-1 text-[12px] font-bold bg-${lc}-500/15 text-${lc}-400 ring-1 ring-${lc}-500/30">${a.labelKo} · ${a.label}</span>
            </div>
            <div class="overflow-x-auto"><ul class="mt-3 min-w-[320px]">${timeline}</ul></div>
          </div>
          ${stress}
          <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
            <h3 class="text-base font-bold text-white mb-3"><i class="fa-solid fa-arrow-right-arrow-left text-sky-400"></i> 미·한 릴레이 비교</h3>
            ${relay}
            <p class="text-[11px] text-slate-500 mt-2">미국 세션의 0%선 전환과 인접 한국장 전환을 나란히 비교 — 전이 가설의 체결 난이도 관점 복기.</p>
          </div>
        </div>
        <div class="space-y-4">
          <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
            <h3 class="text-base font-bold text-white mb-2">휩쏘 지수</h3>
            <div class="text-4xl font-black ${wb.c}">${a.whipsawIndex}<span class="text-base text-slate-500 font-bold">/100</span></div>
            <div class="text-[13px] font-bold ${wb.c}">${wb.t}</div>
            <div class="h-2 rounded-full bg-slate-800 mt-2 overflow-hidden"><div class="h-full ${wb.bg}" style="width:${a.whipsawIndex}%"></div></div>
            <dl class="mt-3 grid grid-cols-2 gap-y-1 text-[12px]">
              <dt class="text-slate-500">총 전환</dt><dd class="text-right text-slate-200 font-semibold">${a.total}회</dd>
              <dt class="text-slate-500">본장 / 시간외</dt><dd class="text-right text-slate-200 font-semibold">${a.regTotal} / ${a.extTotal}</dd>
              <dt class="text-slate-500">첫 전환</dt><dd class="text-right text-slate-200 font-semibold">${a.first ? esc(a.first.dir) : '—'}</dd>
              <dt class="text-slate-500">마지막 전환</dt><dd class="text-right text-slate-200 font-semibold">${a.last ? esc(a.last.dir) : '—'}</dd>
              <dt class="text-slate-500">종가 상태</dt><dd class="text-right text-slate-200 font-semibold">${esc(a.endState)}</dd>
              <dt class="text-slate-500">균형도</dt><dd class="text-right text-slate-200 font-semibold">${a.balance.toFixed(2)}</dd>
              <dt class="text-slate-500">군집(교차)수</dt><dd class="text-right text-slate-200 font-semibold">${a.flipClusterCount}</dd>
              <dt class="text-slate-500">종가=첫 전환 방향</dt><dd class="text-right text-slate-200 font-semibold">${a.closeMatchesFirst == null ? '—' : a.closeMatchesFirst ? '일치' : '불일치'}</dd>
            </dl>
          </div>
          <div class="rounded-2xl bg-slate-900/50 ring-1 ring-slate-800 p-4 text-[12px] text-slate-400">
            <div class="font-bold text-slate-300 mb-1">실행 난이도 라벨이란?</div>
            <ul class="space-y-1 list-disc list-inside">
              <li><b class="text-emerald-400">깨끗한 추세</b>: 0%선 전환 거의 없음(체결 쉬움).</li>
              <li><b class="text-amber-400">개장 반전</b>: 초반 방향이 뒤집힘.</li>
              <li><b class="text-rose-400">제로라인 휩쏘</b>: 0%선 근처 잦은 전환(체결 어려움).</li>
              <li><b class="text-sky-400">후반 회복</b>(Late reclaim): 막판에 양(+)으로 회복.</li>
              <li><b class="text-violet-400">후반 페이드</b>(Late fade): 막판에 음(−)으로 페이드.</li>
            </ul>
          </div>
        </div>
      </div>`;
  }

  function init() {
    $('#asof').textContent = L.asOf;
    document.addEventListener('click', e => {
      const sb = e.target.closest('[data-sym]'); if (sb) { cur.sym = sb.dataset.sym; cur.date = null; render(); return; }
      const pb = e.target.closest('[data-plan]'); if (pb) { cur.plan = pb.dataset.plan; render(); return; }
    });
    document.addEventListener('change', e => { if (e.target.id === 'dateSel') { cur.date = e.target.value; render(); } });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
