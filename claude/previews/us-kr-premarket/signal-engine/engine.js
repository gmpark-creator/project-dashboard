/* 단타 시그널 엔진 (signal-engine) — Claude 아이디어, 변증법 R1~R2 사양
   투명·규칙기반 '조건 일치 그레이더'. 블랙박스/매매신호 아님.
   - 규칙: ../data/rules.json (외부화 · 화면에 수식·임계값·근거 노출)
   - 데이터: window.LEDGER(실측) + window.POLARIS_DERIVED(분위수·평균일중폭)
   - 기본 = LEDGER 리플레이 모드(과거 한국일 선택 → 요인 분해). 수동 모드는 '검증 안 됨' 워터마크.
   - 룩어헤드 금지: preOpen 점수는 당일 한국 결과(close/chgPct/flips) 미사용. 당일 결과는 '사후 복기' 전용.
   - 출력: 상승형 조건 일치 / 하락형 조건 일치 / 혼합 / 데이터 부족 (확률·승률·매매지시 없음). */
"use strict";
(function () {
  const L = window.LEDGER, D = window.POLARIS_DERIVED;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sgn = x => x > 0 ? 1 : x < 0 ? -1 : 0;
  const fx = (v, n = 2) => v == null ? '—' : (v > 0 ? '+' : '') + (+v).toFixed(n);
  const SYM = { samsung: { rows: L.kospi.samsung, name: '삼성전자', derived: 'SAMSUNG' }, hynix: { rows: L.kospi.hynix, name: 'SK하이닉스', derived: 'HYNIX' } };
  let RULES = null;
  let cur = { mode: 'replay', sym: 'samsung', date: null };

  // 직전 미국 세션(D) 찾기
  function prevUsDate(krDate) { const ds = L.us.soxl.map(r => r.date).filter(d => d < krDate).sort(); return ds[ds.length - 1]; }
  const rowAt = (rows, date) => rows.find(r => r.date === date);

  // 컨텍스트 구성 (replay: LEDGER에서, manual: 입력에서)
  function buildContext() {
    if (cur.mode === 'manual') {
      const g = id => parseFloat($('#' + id)?.value);
      return { source: 'manual', sym: cur.sym, krDate: '(수동)', usDate: '(수동)',
        sox: g('m_sox'), ixic: g('m_ixic'), soxl: g('m_soxl'), soxs: g('m_soxs'),
        soxlExt: g('m_soxlext'), soxsExt: g('m_soxsext'), gapPct: g('m_gap'),
        avgRange: D.perSymbol[SYM[cur.sym].derived].avgRangePct, krResult: null, events: [] };
    }
    const S = SYM[cur.sym];
    if (!cur.date || !rowAt(S.rows, cur.date)) cur.date = S.rows[S.rows.length - 1].date;
    const T = cur.date, krRow = rowAt(S.rows, T);
    const Dt = prevUsDate(T);
    const soxR = rowAt(L.indices.rows.SOX, Dt), ixicR = rowAt(L.indices.rows.IXIC, Dt);
    const soxlR = rowAt(L.us.soxl, Dt), soxsR = rowAt(L.us.soxs, Dt);
    const prevClose = krRow.flips?.prevClose, gapPct = prevClose ? (krRow.open - prevClose) / prevClose * 100 : null;
    const events = (L.calendar || []).filter(e => e.date === T || e.date === Dt);
    return { source: 'replay', sym: cur.sym, krDate: T, usDate: Dt,
      sox: soxR?.chgPct, ixic: ixicR?.chgPct, soxl: soxlR?.regChgPct, soxs: soxsR?.regChgPct,
      soxlExt: soxlR?.extVsRegPct, soxsExt: soxsR?.extVsRegPct, gapPct,
      avgRange: D.perSymbol[S.derived].avgRangePct,
      krResult: { chgPct: krRow.chgPct, endState: krRow.flips?.endState, flips: (krRow.flips?.totalUp || 0) + (krRow.flips?.totalDown || 0) },
      events };
  }

  // 게이트 (임계값·카테고리 전부 rules.json에서 — 단일 출처)
  function gateById(id) { return (RULES.gates || []).find(g => g.id === id); }
  function evalGates(ctx) {
    const out = { hard: false, reason: '', warns: [] };
    // SOXL/SOXS sanity — 부호 역전 또는 명백한 데이터 오류만 차단(고변동 정상일은 통과). 임계값 rules.json.
    const sg = gateById('soxl_soxs_sanity_gate'), st = sg?.threshold || {};
    if (ctx.soxl != null && ctx.soxs != null) {
      const invErr = Math.abs(ctx.soxl + ctx.soxs), signOk = sgn(ctx.soxl) === -sgn(ctx.soxs);
      if (!signOk || invErr > (st.failValue ?? 2.0)) { out.hard = true; out.reason = `SOXL/SOXS 역방향 정합 실패(부호 ${signOk ? 'OK' : '불일치'}, 괴리 ${invErr.toFixed(3)} > ${st.failValue ?? 2.0}) → 데이터 신뢰 불가`; }
      else if (invErr > (st.warnValue ?? 0.985)) out.warns.push(`SOXL/SOXS 괴리 ${invErr.toFixed(3)} (>${st.warnValue ?? 0.985}) — 고변동/데이터 경고(점수 유지)`);
    }
    // 이벤트 하드게이트 — '예정 촉매'(개장 전 알 수 있는)만. 사후 시장묘사(status=발생, 지수/수급 등) 제외(룩어헤드 방지). rules.json 단일 출처.
    const eg = gateById('event_hard_gate');
    const SCHEDULED = eg?.scheduledCategories || ['통화정책', '물가', '고용', '실적', '지표'];
    const EXCLUDED = eg?.excludedPostHocCategories || ['지수', '수급', '지정학', '거시', '원자재', '심리'];
    // 카테고리 화이트리스트(예정 촉매) ∩ 블록리스트(사후 시장묘사) 로 판정. 게이트는 점수를 '억제'만 하고 결과값을 읽지 않으므로 수치 룩어헤드 누출은 없음. (status는 과거 데이터가 전부 '발생'이라 하드조건으로 부적합)
    const hardEv = (ctx.events || []).filter(e =>
      e.importance === '최우선' &&
      SCHEDULED.some(c => (e.category || '').includes(c)) &&
      !EXCLUDED.some(c => (e.category || '').includes(c)));
    if (hardEv.length) { out.hard = true; out.reason = `이벤트 하드 게이트(예정 촉매): ${hardEv.map(e => `[${e.category}] ${e.title.slice(0, 40)}`).join(' · ')} → 방향성보다 변동성·근거 부족 우선`; }
    const noteEv = (ctx.events || []).filter(e => !hardEv.includes(e) && (e.importance === '최우선' || e.importance === '높음'));
    if (noteEv.length) out.warns.push(`참고 이벤트 ${noteEv.length}건(${noteEv.slice(0, 3).map(e => e.category).join('·')}…) — 점수 미반영`);
    return out;
  }

  // 요인 평가 — 모든 임계값을 rules.json에서 읽음(단일 출처, 하드코딩 0). 각 요인에 phase 부여.
  function factorById(id) { return RULES.factors.find(f => f.id === id); }
  function evalFactors(ctx) {
    const res = [];
    const push = (id, side, valStr, note) => { const f = factorById(id); res.push({ id, f, side, valStr, note }); };

    { const t = factorById('us_semis_lag1_relay').threshold; let side = 'neutral';
      if (ctx.sox != null) side = ctx.sox >= t.bull.value ? 'bull' : ctx.sox <= t.bear.value ? 'bear' : 'neutral';
      push('us_semis_lag1_relay', ctx.sox == null ? 'na' : side, `직전 미국세션 SOX ${fx(ctx.sox)}% (bull≥${t.bull.value} / bear≤${t.bear.value})`); }
    { const t = factorById('semi_leadership').threshold; const lead = (ctx.sox != null && ctx.ixic != null) ? ctx.sox - ctx.ixic : null; let side = 'neutral';
      if (lead != null) side = lead >= t.bull.value ? 'bull' : lead <= t.bear.value ? 'bear' : 'neutral';
      push('semi_leadership', lead == null ? 'na' : side, `SOX−나스닥 ${fx(lead)} (bull≥${t.bull.value} / bear≤${t.bear.value})`); }
    { const t = factorById('levered_etf_confirm').threshold; let side = 'neutral'; const sl = ctx.soxl, ss = ctx.soxs;
      if (sl != null && ss != null) { if (sl >= t.bull.value && ss <= t.bull.soxs) side = 'bull'; else if (sl <= t.bear.value && ss >= t.bear.soxs) side = 'bear'; }
      push('levered_etf_confirm', (sl == null || ss == null) ? 'na' : side, `SOXL ${fx(sl)}% / SOXS ${fx(ss)}% (확인: bull SOXL≥${t.bull.value}&SOXS≤${t.bull.soxs})`); }
    { const t = factorById('afterhours_reclaim_fade').threshold; let side = 'neutral', note = ''; const ep = (ctx.soxlExt != null && ctx.soxsExt != null) ? (ctx.soxlExt - ctx.soxsExt) / 2 : null;
      if (ep != null) { side = ep >= t.bull.value ? 'bull' : ep <= t.bear.value ? 'bear' : 'neutral'; if (Math.abs(ep) >= t.volatilityWarnAbs) note = `시간외 변동성 경고(|ext|≥${t.volatilityWarnAbs} p75)`; }
      push('afterhours_reclaim_fade', ep == null ? 'na' : side, `시간외 압력 ${fx(ep)} (bull≥+${t.bull.value} / bear≤${t.bear.value})`, note); }
    { const t = factorById('kr_open_gap_vs_range').threshold; let side = 'neutral', note = ''; const gr = (ctx.gapPct != null && ctx.avgRange) ? ctx.gapPct / ctx.avgRange : null;
      if (gr != null) { side = gr >= t.bull.value ? 'bull' : gr <= t.bear.value ? 'bear' : 'neutral'; if (Math.abs(gr) >= t.hardWarnAbs) note = `갭 과대 경고(|gapRatio|≥${t.hardWarnAbs})`; }
      push('kr_open_gap_vs_range', gr == null ? 'na' : side, `시가갭 ${fx(ctx.gapPct)}% / 평균일중폭 ${ctx.avgRange}% = ${gr == null ? '—' : gr.toFixed(2)} (bull≥+${t.bull.value} / bear≤${t.bear.value})`, note); }
    { const t = factorById('relay_gap_alignment').threshold; let side = 'neutral', note = ''; const active = (ctx.sox != null && Math.abs(ctx.sox) >= t.activeSoxAbs) && (ctx.gapPct != null && Math.abs(ctx.gapPct) >= t.activeGapAbs);
      if (active) { const aligned = sgn(ctx.sox) === sgn(ctx.gapPct); if (!aligned) { side = 'conflict'; note = '전이-시가갭 방향 충돌'; } else side = ctx.sox > 0 ? 'bull' : 'bear'; }
      push('relay_gap_alignment', active ? side : 'na', `미국 ${fx(ctx.sox)}% vs 한국갭 ${fx(ctx.gapPct)}% (활성: |미국|≥${t.activeSoxAbs} & |갭|≥${t.activeGapAbs})`, note); }
    return res;
  }
  const preOpenF = factors => factors.filter(r => r.f.phase === 'preOpen');
  const openKnownF = factors => factors.filter(r => r.f.phase === 'openKnown');

  function decide(ctx, gates, factors) {
    if (gates.hard) return { label: '데이터 부족', reason: gates.reason, bull: 0, bear: 0, active: 0, gated: true };
    let bull = 0, bear = 0, active = 0, conflict = false;
    factors.forEach(r => { const w = r.f.weight; if (r.side === 'bull') { bull += w; active += w; } else if (r.side === 'bear') { bear += w; active += w; } else if (r.side === 'conflict') { conflict = true; } });
    if (active < RULES.scoring.minActiveWeight) return { label: '데이터 부족', reason: `활성 가중치 ${active} < 최소 ${RULES.scoring.minActiveWeight}`, bull, bear, active, conflict };
    if (Math.abs(bull - bear) <= RULES.scoring.mixedBand) return { label: '혼합', bull, bear, active, conflict };
    return { label: bull > bear ? '상승형 조건 일치' : '하락형 조건 일치', bull, bear, active, conflict };
  }

  // 유사 셋업 날짜(사실만 — 승률/확률 없음)
  function similarDates(ctx) {
    if (cur.mode !== 'replay' || ctx.sox == null) return [];
    const t = factorById('us_semis_lag1_relay').threshold;
    const myBucket = ctx.sox >= t.bull.value ? 'bull' : ctx.sox <= t.bear.value ? 'bear' : 'mid';
    const S = SYM[cur.sym];
    return S.rows.filter(r => r.date !== ctx.krDate).map(r => {
      const Dt = prevUsDate(r.date); const sx = rowAt(L.indices.rows.SOX, Dt)?.chgPct;
      if (sx == null) return null;
      const b = sx >= t.bull.value ? 'bull' : sx <= t.bear.value ? 'bear' : 'mid';
      return b === myBucket ? { date: r.date, usDate: Dt, sox: sx, krChg: r.chgPct, endState: r.flips?.endState } : null;
    }).filter(Boolean);
  }

  const SIDE_CHIP = { bull: '<span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-rose-500/15 text-rose-400">상승형</span>', bear: '<span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-sky-500/15 text-sky-400">하락형</span>', neutral: '<span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-700 text-slate-400">중립</span>', conflict: '<span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-400">충돌</span>', na: '<span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-600">비활성</span>' };
  const LABEL_STYLE = { '상승형 조건 일치': ['rose', 'fa-arrow-trend-up'], '하락형 조건 일치': ['sky', 'fa-arrow-trend-down'], '혼합': ['amber', 'fa-shuffle'], '데이터 부족': ['slate', 'fa-ban'] };

  function render() {
    const ctx = buildContext();
    const gates = evalGates(ctx);
    const factors = evalFactors(ctx);
    const pre = preOpenF(factors), open = openKnownF(factors);
    const dec = decide(ctx, gates, pre);          // 헤드라인 = 개장 전(preOpen) 전용 — 룩어헤드 차단
    const decOpen = decide(ctx, gates, factors);  // 개장 후 종합(preOpen + openKnown 시가갭)
    const [col, icon] = LABEL_STYLE[dec.label];
    const [ocol] = LABEL_STYLE[decOpen.label];
    const rowsHtml = arr => arr.map(r => `
      <tr class="border-t border-slate-800/70">
        <td class="py-2 pr-2"><div class="text-[13px] font-semibold text-slate-200">${esc(r.f.label)}</div>
          <div class="text-[10px] text-slate-500">${esc(r.f.phase)} · 가중치 ${r.f.weight} · ${esc(r.f.threshold.sampleCaveat || '')}</div></td>
        <td class="py-2 pr-2 text-[12px] text-slate-400">${esc(r.valStr)}${r.note ? `<div class="text-[10px] text-amber-400 mt-0.5">⚠ ${esc(r.note)}</div>` : ''}</td>
        <td class="py-2 text-right">${SIDE_CHIP[r.side]}</td>
      </tr>`).join('');
    const factorRows = rowsHtml(pre);

    const sims = similarDates(ctx);
    const simPanel = cur.mode === 'replay' ? `
      <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
        <h3 class="text-base font-bold text-white"><i class="fa-solid fa-clock-rotate-left text-violet-400"></i> 유사 셋업 날짜 <span class="text-[11px] text-slate-500">(사실 기록 — 승률·확률 없음)</span></h3>
        <p class="text-[12px] text-slate-500 mt-1">직전 미국세션 SOX 구간이 유사했던 다른 ${esc(SYM[cur.sym].name)} 날들과 <b>그날 실제 등락(사실)</b>.</p>
        ${sims.length ? `<div class="overflow-x-auto mt-2"><table class="w-full text-[12px]"><thead><tr class="text-left text-[10px] text-slate-500"><th class="pb-1 pr-2">한국일</th><th class="pb-1 pr-2">직전 미국 SOX</th><th class="pb-1 pr-2">그날 실제 등락</th><th class="pb-1">종가상태</th></tr></thead><tbody>
          ${sims.map(s => `<tr class="border-t border-slate-800/60"><td class="py-1 pr-2 text-slate-300">${s.date}</td><td class="py-1 pr-2 ${s.sox > 0 ? 'text-rose-400' : 'text-sky-400'}">${fx(s.sox)}%</td><td class="py-1 pr-2 font-semibold ${s.krChg > 0 ? 'text-rose-400' : 'text-sky-400'}">${fx(s.krChg)}%</td><td class="py-1 text-slate-400">${esc(s.endState || '')}</td></tr>`).join('')}
        </tbody></table></div>` : '<p class="text-[12px] text-slate-500 mt-2">유사 구간 날짜 없음.</p>'}
      </div>` : '';

    // 사후 복기(점수 미사용)
    const reviewPanel = (cur.mode === 'replay' && ctx.krResult) ? `
      <div class="rounded-2xl bg-slate-800/40 ring-1 ring-dashed ring-slate-700 p-5 relative overflow-hidden">
        <span class="absolute top-2 right-3 text-[10px] font-bold text-slate-600 rotate-6">사후 데이터 · 점수 미사용</span>
        <h3 class="text-base font-bold text-slate-300"><i class="fa-solid fa-eye-slash"></i> 사후 복기 (룩어헤드 차단)</h3>
        <p class="text-[12px] text-slate-500 mt-1">아래는 ${esc(ctx.krDate)} <b>당일 실제 결과</b>로, 위 조건 점수 계산에는 일절 쓰이지 않았습니다(복기 전용).</p>
        <div class="mt-2 flex flex-wrap gap-4 text-[13px]">
          <div>당일 등락 <b class="${ctx.krResult.chgPct > 0 ? 'text-rose-400' : 'text-sky-400'}">${fx(ctx.krResult.chgPct)}%</b></div>
          <div>종가상태 <b class="text-slate-300">${esc(ctx.krResult.endState || '—')}</b></div>
          <div>0%선 전환 <b class="text-slate-300">${ctx.krResult.flips}회</b></div>
        </div>
      </div>` : '';

    const manualWatermark = cur.mode === 'manual' ? `<div class="rounded-lg bg-amber-500/10 ring-1 ring-amber-500/40 px-3 py-2 text-[12px] text-amber-300 mb-3"><i class="fa-solid fa-triangle-exclamation"></i> 수동 입력 모드 — <b>사용자 입력·검증 안 됨</b>. 재현성 보장 없음.</div>` : '';

    $('#out').innerHTML = `
      ${manualWatermark}
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-4">
          <div class="rounded-2xl bg-${col}-500/5 ring-1 ring-${col}-500/30 p-5">
            <div class="text-[11px] text-slate-500">${cur.mode === 'replay' ? `한국일 ${esc(ctx.krDate)} · 직전 미국세션 ${esc(ctx.usDate)} · ${esc(SYM[cur.sym].name)}` : '수동 입력'}</div>
            <div class="text-[10px] font-bold text-slate-500 mt-1">개장 전(preOpen) 조건 — 당일 한국 결과 미사용(룩어헤드 차단)</div>
            <div class="flex items-center gap-3 mt-1">
              <i class="fa-solid ${icon} text-2xl text-${col}-400"></i>
              <div class="text-2xl font-black text-${col}-300">${esc(dec.label)}</div>
            </div>
            <div class="text-[12px] text-slate-400 mt-2">상승형 가중 <b class="text-rose-400">${dec.bull}</b> · 하락형 가중 <b class="text-sky-400">${dec.bear}</b> · 활성 가중 <b>${dec.active}</b> (최소 ${RULES.scoring.minActiveWeight}, 혼합대역 ±${RULES.scoring.mixedBand})</div>
            ${dec.reason ? `<div class="text-[12px] text-amber-400 mt-1">사유: ${esc(dec.reason)}</div>` : ''}
            ${dec.conflict ? `<div class="text-[12px] text-amber-400 mt-1">⚠ 전이-시가갭 방향 충돌 감지</div>` : ''}
            ${gates.warns.map(w => `<div class="text-[11px] text-amber-400/80 mt-1">· ${esc(w)}</div>`).join('')}
          </div>
          <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
            <h3 class="text-base font-bold text-white mb-1"><i class="fa-solid fa-list-check text-sky-400"></i> 요인 분해 <span class="text-[11px] text-slate-500">(rules.json 투명 공개)</span></h3>
            <table class="w-full"><thead><tr class="text-left text-[10px] text-slate-500"><th class="pb-1 pr-2">요인 · 임계값</th><th class="pb-1 pr-2">값</th><th class="pb-1 text-right">판정</th></tr></thead><tbody>${factorRows}</tbody></table>
          </div>
          <div class="rounded-2xl bg-slate-900/70 ring-1 ring-slate-800 p-5">
            <h3 class="text-base font-bold text-white mb-1"><i class="fa-solid fa-door-open text-emerald-400"></i> 개장 후 확인 (openKnown) <span class="text-[11px] text-slate-500">시가갭 반영 — 개장 시점에 알 수 있는 추가 요인</span></h3>
            <p class="text-[12px] text-slate-500 mb-2">아래 요인은 한국 개장(09:00)의 시가갭을 쓰므로 <b>개장 전 헤드라인과 분리</b>합니다. 개장 전+후 종합: <b class="text-${ocol}-300">${esc(decOpen.label)}</b> <span class="text-slate-500">(상승 ${decOpen.bull}/하락 ${decOpen.bear}/활성 ${decOpen.active})</span></p>
            <table class="w-full"><thead><tr class="text-left text-[10px] text-slate-500"><th class="pb-1 pr-2">요인 · 임계값</th><th class="pb-1 pr-2">값</th><th class="pb-1 text-right">판정</th></tr></thead><tbody>${rowsHtml(open)}</tbody></table>
          </div>
          ${reviewPanel}
        </div>
        <div class="space-y-4">
          ${simPanel}
          <div class="rounded-2xl bg-slate-900/50 ring-1 ring-slate-800 p-4 text-[12px] text-slate-400">
            <div class="font-bold text-slate-300 mb-1">읽는 법</div>
            <p>이 엔진은 <b>확률·승률·매매 신호가 아닙니다.</b> 미리 정한 규칙(rules.json)에 현재(또는 과거) 조건이 몇 개나 일치하는지를 투명하게 합산해 <b>조건 일치 유형</b>만 알려줍니다.</p>
            <p class="mt-1">임계값은 2026년 6월 실측 분위수(n&lt;20, 탐색용)이며, 일반화·예측을 보장하지 않습니다.</p>
          </div>
        </div>
      </div>`;
  }

  function renderControls() {
    const modeBtns = [['replay', 'LEDGER 리플레이(기본)'], ['manual', '수동 입력']].map(([k, t]) =>
      `<button data-mode="${k}" class="px-3 py-1.5 rounded-lg text-[12px] font-bold ${cur.mode === k ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40' : 'bg-slate-800/60 text-slate-400'}">${t}</button>`).join('');
    const symBtns = Object.entries(SYM).map(([k, v]) => `<button data-sym="${k}" class="px-3 py-1.5 rounded-lg text-[12px] font-bold ${cur.sym === k ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/40' : 'bg-slate-800/60 text-slate-400'}">${esc(v.name)}</button>`).join('');
    let body = '';
    if (cur.mode === 'replay') {
      const rows = SYM[cur.sym].rows;
      if (!cur.date || !rowAt(rows, cur.date)) cur.date = rows[rows.length - 1].date;
      const opts = rows.map(r => `<option value="${r.date}" ${r.date === cur.date ? 'selected' : ''}>${r.date}</option>`).join('');
      body = `<div class="flex flex-wrap items-center gap-2 mt-2"><span class="text-[11px] text-slate-500">종목</span>${symBtns}<span class="text-[11px] text-slate-500 ml-2">한국일</span><select id="dateSel" class="bg-slate-800/60 text-slate-200 text-[13px] rounded-lg px-2 py-1.5 ring-1 ring-slate-700">${opts}</select></div>`;
    } else {
      const pre = D.perSymbol[SYM[cur.sym].derived].avgRangePct;
      const inp = (id, lab, val = '') => `<label class="text-[11px] text-slate-500">${lab}<input id="${id}" type="number" step="0.01" value="${val}" class="mt-0.5 w-full bg-slate-800/60 text-slate-200 text-[13px] rounded px-2 py-1 ring-1 ring-slate-700"></label>`;
      body = `<div class="mt-2"><div class="flex flex-wrap items-center gap-2 mb-2"><span class="text-[11px] text-slate-500">종목</span>${symBtns}</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          ${inp('m_sox', '직전 SOX %')}${inp('m_ixic', '직전 나스닥 %')}${inp('m_soxl', 'SOXL 본장 %')}${inp('m_soxs', 'SOXS 본장 %')}
          ${inp('m_soxlext', 'SOXL 시간외 %')}${inp('m_soxsext', 'SOXS 시간외 %')}${inp('m_gap', '한국 시가갭 %')}
          <label class="text-[11px] text-slate-500">평균 일중폭 %<input id="m_range" type="number" value="${pre}" disabled class="mt-0.5 w-full bg-slate-800/40 text-slate-500 text-[13px] rounded px-2 py-1 ring-1 ring-slate-800"></label>
        </div>
        <button id="m_run" class="mt-2 px-4 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40 text-[13px] font-bold">평가</button></div>`;
    }
    $('#controls').innerHTML = `<div class="flex flex-wrap items-center gap-2">${modeBtns}</div>${body}`;
  }

  function rerender() { renderControls(); render(); }

  function init() {
    $('#asof').textContent = (RULES.meta.asOf || L.asOf);
    document.addEventListener('click', e => {
      const mb = e.target.closest('[data-mode]'); if (mb) { cur.mode = mb.dataset.mode; rerender(); return; }
      const sb = e.target.closest('[data-sym]'); if (sb) { cur.sym = sb.dataset.sym; if (cur.mode === 'replay') cur.date = null; rerender(); return; }
      if (e.target.id === 'm_run') { render(); return; }
    });
    document.addEventListener('change', e => { if (e.target.id === 'dateSel') { cur.date = e.target.value; render(); } });
    rerender();
  }

  fetch('../data/rules.json?v=20260615').then(r => r.json()).then(j => { RULES = j; init(); })
    .catch(() => { $('#out').innerHTML = '<div class="rounded-xl bg-rose-500/10 ring-1 ring-rose-500/40 p-4 text-[13px] text-rose-300">rules.json 로딩 실패 — GitHub Pages(https)에서 열어주세요.</div>'; $('#asof').textContent = L.asOf; });
})();
