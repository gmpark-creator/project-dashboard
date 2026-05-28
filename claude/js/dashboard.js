// ============================================================
// PROJECT DASHBOARD — v3.1 (sidebar + hash routing)
// 데이터(projects-data.js)는 100% 보존, 시각만 v3 Plus X 톤.
// 박사 발화: 기존 sidebar+main 틀 복귀 + 클릭 시 페이지 이동 느낌.
// ============================================================

(function () {
  const body = document.body;
  const $   = (s, r = document) => r.querySelector(s);
  const $$  = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function parseD(s) { return new Date(s + 'T00:00:00'); }
  function fmtD(s) {
    const d = parseD(s);
    return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0');
  }
  function durationText(a, b) {
    const days = Math.round((parseD(b) - parseD(a)) / 86400000);
    if (days < 1)  return '1일';
    if (days < 31) return days + '일';
    const m = Math.round(days / 30.44);
    return m < 12 ? '약 ' + m + '개월' : '약 ' + (days / 365.25).toFixed(1) + '년';
  }
  function statusLabel(st) {
    return st === 'completed' ? 'COMPLETED'
         : st === 'in-progress' ? 'IN PROGRESS'
         : st === 'paused' ? 'PAUSED' : st.toUpperCase();
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function pad3(n) { return String(n).padStart(3, '0'); }

  /* ---------- ICONS — 프로젝트별 앰블럼 (인라인 SVG, 직접 그림) ----------
     박사 발화 "각 프로젝트별 앰블럼 다시 복구. 뜀 = 트로피, Solar = 태양"
     viewBox 24x24, stroke 1.8px, currentColor (테마 색 자동 따름). */
  const ICONS = {
    // 컨테이너선 측면 — 박사 지적 "선박 모양으로 명확히"
    // hull(사다리꼴) + 컨테이너 3 stack + 후미 bridge + 물결
    'ship':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M2 16h20l-2 3.5H4z"/>' +
        '<rect x="5" y="11" width="3.5" height="5"/>' +
        '<rect x="9" y="11" width="3.5" height="5"/>' +
        '<rect x="13" y="11" width="3.5" height="5"/>' +
        '<rect x="17" y="8" width="3" height="8"/>' +
        '<path d="M2 21.5q1.5 1 3 0t3 0 t3 0t3 0t3 0t3 0"/>' +
      '</svg>',
    // 트로피: 컵 + 양 옆 손잡이 + 받침
    'trophy':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M7 4h10v6a5 5 0 0 1-10 0z"/>' +
        '<path d="M7 7H4a2 2 0 0 0 0 4h3"/>' +
        '<path d="M17 7h3a2 2 0 0 1 0 4h-3"/>' +
        '<path d="M12 15v3"/>' +
        '<path d="M8 21h8"/>' +
      '</svg>',
    // 우주 — 박사 재지시 "제대로 우주 모양". 토성형 ring 행성 클로즈업 + 별 2개
    // 큰 행성 disk + 기울어진 ring + 좌상/우상 작은 별. 눈 인식 차단.
    'orbit':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="13" r="5" fill="currentColor"/>' +
        '<ellipse cx="12" cy="13" rx="9.5" ry="2.4" transform="rotate(-22 12 13)" fill="none"/>' +
        '<circle cx="20" cy="4" r="0.9" fill="currentColor"/>' +
        '<path d="M3.5 6.5l.4-.4M3.5 5.7l.4.4"/>' +
        '<circle cx="4.2" cy="6.1" r="0.5" fill="currentColor"/>' +
      '</svg>',
    // 음표 (음원 추출기)
    'music':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M9 18V6l11-2v12"/>' +
        '<circle cx="6" cy="18" r="3"/>' +
        '<circle cx="17" cy="16" r="3"/>' +
      '</svg>',
    // 정부 건물 (Capitol)
    'landmark':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M3 21h18"/>' +
        '<path d="M3 10h18"/>' +
        '<path d="M5 10v11"/>' +
        '<path d="M9 10v11"/>' +
        '<path d="M15 10v11"/>' +
        '<path d="M19 10v11"/>' +
        '<path d="M12 3l9 7H3z"/>' +
      '</svg>',
    // 회사 본사 빌딩 — 박사 지적 "JP Global = 회사 모양"
    // 사각 office tower + 입구 + 창문 6 + 바닥선
    'building':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="5" y="3" width="14" height="18"/>' +
        '<rect x="10" y="15" width="4" height="6"/>' +
        '<path d="M8 7h2M14 7h2M8 11h2M14 11h2"/>' +
        '<path d="M3 21h18"/>' +
      '</svg>',
    // 닻 — anchor 기존 보존 (다른 용도용)
    'anchor':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="5" r="2.5"/>' +
        '<path d="M12 7.5V21"/>' +
        '<path d="M5 21a7 7 0 0 0 7-7"/>' +
        '<path d="M19 21a7 7 0 0 1-7-7"/>' +
        '<path d="M8 12h8"/>' +
      '</svg>',
    // 증권 상향 차트
    'trending-up':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M3 17l6-6 4 4 8-8"/>' +
        '<path d="M14 7h7v7"/>' +
      '</svg>',
    // fallback
    'box':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="4" y="4" width="16" height="16" rx="1"/>' +
      '</svg>'
  };
  function emblem(name) { return ICONS[name] || ICONS.box; }

  /* ---------- 1) KST primary clock + collapsible 11-city zones ----------
     박사 발화: "기본은 KST만, 시차 버튼 클릭 시 더 보이게.
     날짜·UTC offset도 표기. 노트북 화면에서 스크롤바 생기지 않게." */
  // 박사 발화: "0 → -큰값 → -1 → +1 → +큰값 순서, 런던 추가(GMT/BST 분기 표기),
  //            도시 옆 국가명, 오른쪽으로 더 튀어나와도 되게." 정렬 키 = STD UTC offset.
  // DST는 실시간 표시 offset에 자동 반영(shortOffset).
  // note: 계절성 DST 분기가 있는 도시는 메타로 표기.
  const CITIES = [
    { city: 'UTC',           country: '기준점 — 그리니치 천문대', note: 'GREENWICH OBSERVATORY', tz: 'Etc/UTC',                        std: 0, ref: true },
    { city: 'LONDON',        country: 'UK',           note: 'GMT/BST · 겨울 +0 / 여름 +1', tz: 'Europe/London',     std: 0    },
    { city: 'PAGO PAGO',     country: 'AMERICAN SAMOA',                          tz: 'Pacific/Pago_Pago', std: -11  },
    { city: 'HONOLULU',      country: 'USA · HAWAII',                            tz: 'Pacific/Honolulu',  std: -10  },
    { city: 'ANCHORAGE',     country: 'USA · ALASKA',  note: 'AKST/AKDT',        tz: 'America/Anchorage', std: -9   },
    { city: 'LOS ANGELES',   country: 'USA',           note: 'PST/PDT',          tz: 'America/Los_Angeles', std: -8 },
    { city: 'DENVER',        country: 'USA',           note: 'MST/MDT',          tz: 'America/Denver',    std: -7   },
    { city: 'MEXICO CITY',   country: 'MEXICO',                                  tz: 'America/Mexico_City', std: -6 },
    { city: 'NEW YORK',      country: 'USA',           note: 'EST/EDT',          tz: 'America/New_York',  std: -5   },
    { city: 'SANTIAGO',      country: 'CHILE',         note: 'DST 분기',          tz: 'America/Santiago',  std: -4   },
    { city: 'BUENOS AIRES',  country: 'ARGENTINA',                               tz: 'America/Argentina/Buenos_Aires', std: -3 },
    { city: 'AZORES',        country: 'PORTUGAL',      note: '여름 +0',           tz: 'Atlantic/Azores',   std: -1   },
    { city: 'LAGOS',         country: 'NIGERIA',                                 tz: 'Africa/Lagos',      std: 1    },
    { city: 'CAIRO',         country: 'EGYPT',                                   tz: 'Africa/Cairo',      std: 2    },
    { city: 'MOSCOW',        country: 'RUSSIA',                                  tz: 'Europe/Moscow',     std: 3    },
    { city: 'DUBAI',         country: 'UAE',                                     tz: 'Asia/Dubai',        std: 4    },
    { city: 'KARACHI',       country: 'PAKISTAN',                                tz: 'Asia/Karachi',      std: 5    },
    { city: 'NEW DELHI',     country: 'INDIA',                                   tz: 'Asia/Kolkata',      std: 5.5  },
    { city: 'DHAKA',         country: 'BANGLADESH',                              tz: 'Asia/Dhaka',        std: 6    },
    { city: 'BANGKOK',       country: 'THAILAND',                                tz: 'Asia/Bangkok',      std: 7    },
    { city: 'BEIJING',       country: 'CHINA',                                   tz: 'Asia/Shanghai',     std: 8    },
    { city: 'TOKYO',         country: 'JAPAN',                                   tz: 'Asia/Tokyo',        std: 9    },
    { city: 'VLADIVOSTOK',   country: 'RUSSIA',                                  tz: 'Asia/Vladivostok',  std: 10   },
    { city: 'SYDNEY',        country: 'AUSTRALIA',     note: 'AEST/AEDT',        tz: 'Australia/Sydney',  std: 10   },
    { city: 'NOUMEA',        country: 'NEW CALEDONIA',                           tz: 'Pacific/Noumea',    std: 11   },
    { city: 'AUCKLAND',      country: 'NEW ZEALAND',   note: 'NZST/NZDT',        tz: 'Pacific/Auckland',  std: 12   }
  ];

  function timeIn(tz) {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
      }).format(new Date());
    } catch (e) { return '--:--'; }
  }
  function secIn(tz) {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
    } catch (e) { return '--:--:--'; }
  }
  function utcOffset(tz) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, timeZoneName: 'shortOffset'
      }).formatToParts(new Date());
      const off = parts.find(p => p.type === 'timeZoneName');
      return off ? off.value.replace('GMT', 'UTC') : 'UTC';
    } catch (e) { return 'UTC'; }
  }
  function dateIn(tz) {
    try {
      const d = new Date();
      const p = new Intl.DateTimeFormat('en-CA', {
        timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(d);
      const y  = p.find(x => x.type === 'year').value;
      const m  = p.find(x => x.type === 'month').value;
      const dd = p.find(x => x.type === 'day').value;
      return { y, m, d: dd, full: y + '-' + m + '-' + dd, short: m + '-' + dd };
    } catch (e) { return { y:'', m:'', d:'', full:'----', short:'--' }; }
  }
  function dateInKST() {
    try {
      const obj = dateIn('Asia/Seoul');
      const wk = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', weekday: 'short' }).format(new Date());
      return obj.full + ' (' + wk + ')';
    } catch (e) { return '----'; }
  }

  function renderWorldClock() {
    const wrap = $('#world-clock');
    if (!wrap) return;
    // 박사 정렬: 0 기준점 → -11, -10, ..., -1 (절대값 큰 음수부터 0 수렴) →
    //          +1, +2, ..., +12 (양수 오름차순). 런던(std 0)은 기준점 바로 다음.
    const ref     = CITIES.filter(c => c.ref);
    const zeroOth = CITIES.filter(c => !c.ref && c.std === 0);   // LONDON 등
    const neg     = CITIES.filter(c => c.std < 0 && !c.ref)
                          .sort((a, b) => a.std - b.std);         // -11 → -1
    const pos     = CITIES.filter(c => c.std > 0 && !c.ref)
                          .sort((a, b) => a.std - b.std);         // +1 → +12
    const sorted  = [...ref, ...zeroOth, ...neg, ...pos];

    wrap.innerHTML = sorted.map(c => `
      <li data-tz="${escapeHtml(c.tz)}"${c.ref ? ' class="ref-row"' : ''}>
        <div class="loc">
          <span class="city">${escapeHtml(c.city)}</span>
          <span class="country">${escapeHtml(c.country || '')}${c.note ? ' <em>· ' + escapeHtml(c.note) + '</em>' : ''}</span>
        </div>
        <span class="time">${timeIn(c.tz)}</span>
        <span class="date">${dateIn(c.tz).short}</span>
        <span class="off">${utcOffset(c.tz)}</span>
      </li>
    `).join('');
  }

  function tickClock() {
    // KST primary
    const t = $('#kst-time');     if (t) t.textContent = secIn('Asia/Seoul');
    const d = $('#kst-date');     if (d) d.textContent = dateInKST();
    const o = $('#kst-offset');   if (o) o.textContent = utcOffset('Asia/Seoul');
    // world clock (always tick — time + date for each)
    document.querySelectorAll('#world-clock li').forEach(li => {
      const tz = li.dataset.tz;
      const tm = li.querySelector('.time');
      const dt = li.querySelector('.date');
      if (tm) tm.textContent = timeIn(tz);
      if (dt) dt.textContent = dateIn(tz).short;
    });
  }

  function setupTzToggle() {
    const btn = $('#tz-toggle');
    const list = $('#world-clock');
    if (!btn || !list) return;
    const KEY = 'tz-open';
    function isOpen() { return list.classList.contains('is-open'); }
    function setOpen(open) {
      list.classList.toggle('is-open', open);
      body.classList.toggle('is-tz-open', open);   // 박사 발화: sidebar 확장 + 프로젝트 list hide
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.tz-toggle-label').textContent = open ? '− HIDE ZONES' : '+ TIME ZONES';
      btn.querySelector('.tz-toggle-arrow').textContent = open ? '↑' : '↓';
      try { localStorage.setItem(KEY, open ? '1' : '0'); } catch (e) {}
    }
    let restored = '0';
    try { restored = localStorage.getItem(KEY) || '0'; } catch (e) {}
    setOpen(restored === '1');
    btn.addEventListener('click', () => setOpen(!isOpen()));
  }

  function startClock() {
    renderWorldClock();
    setupTzToggle();
    tickClock();
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();
    setTimeout(() => {
      tickClock();
      setInterval(tickClock, 1000);
    }, delay);
  }

  /* ---------- 1b) COLOR SWITCHER ---------- */
  // 9 themes — 박사 픽 default = violet (Midnight Violet) FINAL 2026-05-28
  const THEMES = [
    { id: 'violet',       name: 'Midnight Violet',     hex: '#130f26', accent: '#a78bfa', badge: 'Default ★',   mode: 'dark' },
    { id: 'navy',         name: 'Slate Navy',          hex: '#202738', accent: '#ff4f00', badge: 'Prev Canonical', mode: 'dark' },
    { id: 'black',        name: 'Original Black',      hex: '#0a0a0a', accent: '#ff4f00', badge: 'v3 Initial',  mode: 'dark' },
    { id: 'obsidian',     name: 'Obsidian Charcoal',   hex: '#121212', accent: '#ff6b6b', badge: 'A · Gemini',  mode: 'dark' },
    { id: 'cyber',        name: 'Cyber Punk Neon',     hex: '#0b0f19', accent: '#3b82f6', badge: 'B · Gemini',  mode: 'dark' },
    { id: 'emerald',      name: 'Emerald Forest',      hex: '#0f1715', accent: '#34d399', badge: 'E · Gemini',  mode: 'dark' },
    { id: 'light',        name: 'Light Indigo',        hex: '#ffffff', accent: '#6366f1', badge: 'Light',       mode: 'light' },
    { id: 'claude-warm',  name: 'Claude Warm Minimal', hex: '#fbf9f6', accent: '#d97706', badge: 'C · Gemini',  mode: 'light' },
    { id: 'nordic',       name: 'Nordic Clean White',  hex: '#fafafa', accent: '#0ea5e9', badge: 'D · Gemini',  mode: 'light' }
  ];

  function setupColorSwitcher() {
    const list   = $('#color-list');
    const toggle = $('#color-toggle');
    const close  = $('#color-close');
    const scrim  = $('#color-panel-scrim');
    const panel  = $('#color-panel');
    if (!list || !toggle) return;

    const STORAGE_KEY = 'dash-color';

    function currentColor() {
      return document.documentElement.dataset.color || 'violet';
    }

    function renderList() {
      const cur = currentColor();
      list.innerHTML = THEMES.map(t => `
        <button type="button" class="color-item ${t.id === cur ? 'is-active' : ''}" data-color="${t.id}"
                style="--swatch-accent:${t.accent}">
          <span class="swatch" style="background:${t.hex}"></span>
          <span class="meta">
            <span class="name">${t.name}</span>
            <span class="hex">${t.hex} · ${t.accent}</span>
          </span>
          <span class="badge ${t.mode === 'light' ? 'dim' : ''}">${t.badge}</span>
        </button>
      `).join('');
    }

    function applyColor(id) {
      if (!THEMES.find(t => t.id === id)) id = 'violet';
      document.documentElement.dataset.color = id;
      try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
      renderList();
    }

    function openPanel() {
      body.classList.add('is-color-open');
      toggle.setAttribute('aria-expanded', 'true');
      if (panel) panel.setAttribute('aria-hidden', 'false');
    }
    function closePanel() {
      body.classList.remove('is-color-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (panel) panel.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      body.classList.contains('is-color-open') ? closePanel() : openPanel();
    });
    if (close) close.addEventListener('click', closePanel);
    if (scrim) scrim.addEventListener('click', closePanel);

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.color-item');
      if (!btn) return;
      applyColor(btn.dataset.color);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('is-color-open')) closePanel();
    });

    renderList();
  }

  /* ---------- 2) sidebar toggle (mobile) ---------- */
  function setupSidebar() {
    const toggle = $('#menu-toggle');
    const close = $('#sidebar-close');
    const scrim = $('#sidebar-scrim');

    function open()  { body.classList.add('is-sidebar-open'); if (toggle) toggle.setAttribute('aria-expanded', 'true'); }
    function shut()  { body.classList.remove('is-sidebar-open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
    function tog()   { body.classList.contains('is-sidebar-open') ? shut() : open(); }

    if (toggle) toggle.addEventListener('click', tog);
    if (close)  close.addEventListener('click', shut);
    if (scrim)  scrim.addEventListener('click', shut);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('is-sidebar-open')) shut();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) shut();
    });
  }

  /* ---------- 3) text reveal ---------- */
  function splitRevealLines(root) {
    $$('.reveal-line', root || document).forEach(el => {
      if (el.dataset.split === '1') return;
      const text = el.textContent.trim();
      el.textContent = '';
      text.split(/\s+/).forEach(w => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w;
        el.appendChild(span);
      });
      el.dataset.split = '1';
    });
  }

  let _io = null;
  function setupReveal(root) {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal-line, .reveal-up', root || document).forEach(el => el.classList.add('is-in'));
      return;
    }
    if (!_io) {
      _io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            _io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }
    $$('.reveal-line, .reveal-up', root || document).forEach(el => _io.observe(el));
  }

  /* ---------- 4) section index in corner + scroll progress ---------- */
  function setupSectionIndex() {
    const sections = $$('section[data-index]');
    const indexEl = $('#section-index-current');
    const totalEl = $('#section-index-total');
    const progressEl = $('#scroll-progress');
    if (totalEl) totalEl.textContent = pad2(sections.length);

    let lastIdx = -1;
    function onScroll() {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let cur = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= probe) cur = i; else break;
      }
      if (cur !== lastIdx && indexEl && sections[cur]) {
        indexEl.textContent = sections[cur].getAttribute('data-index');
        lastIdx = cur;
      }
      if (progressEl) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressEl.style.width = p.toFixed(2) + '%';
      }
    }
    // strip old listeners
    if (window.__onScrollHandler) window.removeEventListener('scroll', window.__onScrollHandler);
    window.__onScrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- 5) cursor dot ---------- */
  function setupCursor() {
    const cursor = $('#cursor-dot');
    if (!cursor) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let mx = 0, my = 0, cx = 0, cy = 0, raf = null;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    function loop() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px) translate(-50%, -50%)';
      if (Math.abs(mx - cx) > 0.3 || Math.abs(my - cy) > 0.3) {
        raf = requestAnimationFrame(loop);
      } else raf = null;
    }
    function attachHover() {
      $$('a, button, .sidebar-link, .home-card, .preview-card, .issue, .timeline-row, .status-cell').forEach(el => {
        if (el.dataset.cursor === '1') return;
        el.addEventListener('mouseenter', () => cursor.classList.add('is-big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
        el.dataset.cursor = '1';
      });
    }
    attachHover();
    window.__attachCursorHover = attachHover;
  }

  /* ============================================================
     RENDER — sidebar (called once, no re-render on route change)
     ============================================================ */
  function renderSidebar(projects) {
    const list = $('#sidebar-list');
    const count = $('#sidebar-count');
    if (!list) return;
    if (count) count.textContent = pad2(projects.length);

    list.innerHTML = projects.map((p, i) => `
      <a class="sidebar-link" data-id="${escapeHtml(p.id)}" href="#/p/${escapeHtml(p.id)}">
        <span class="num">${pad2(i+1)}</span>
        <span class="emblem">${emblem(p.icon)}</span>
        <span class="name">${escapeHtml(p.name)}</span>
        <span class="dot" data-st="${escapeHtml(p.status)}" title="${statusLabel(p.status)}"></span>
      </a>
    `).join('');
  }

  function setSidebarActive(route) {
    $$('.sidebar-link').forEach(a => {
      a.classList.toggle('is-active', route.type === 'detail' && a.dataset.id === route.id);
    });
    const home = $('#sidebar-home-link');
    if (home) home.classList.toggle('is-active', route.type === 'home');
  }

  /* ============================================================
     RENDER — preview block
     ============================================================ */
  function renderPreview(p) {
    const pv = p.preview;
    if (!pv) return '';
    let body = '';
    let note = '';
    if (pv.type === 'embed') {
      const multi = pv.items.length > 1;
      const h = pv.height || (multi ? 380 : 460);
      body = `<div class="preview-embed">` + pv.items.map(it => `
        <div>
          <div class="preview-frame">
            <iframe src="${escapeHtml(it.url)}" loading="lazy" title="${escapeHtml(it.label)}" style="height:${h}px"></iframe>
          </div>
          <div class="preview-caption">
            <span>${escapeHtml(it.label)}</span>
            <a href="${escapeHtml(it.url)}" target="_blank" rel="noopener">새 탭에서 열기 ↗</a>
          </div>
        </div>
      `).join('') + `</div>`;
      note = '웹 앱이라 보고서 안에서 바로 실행됩니다';
    } else {
      body = `<div class="preview-grid">` + pv.items.map(it => {
        const fname = it.src.split('/').pop();
        return `
          <figure class="preview-card">
            <img src="${escapeHtml(it.src)}" alt="${escapeHtml(it.label)}"
                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="fallback">
              스크린샷 대기 중<br>
              <code>previews/${escapeHtml(fname)}</code>
            </div>
            <figcaption>${escapeHtml(it.label)}</figcaption>
          </figure>`;
      }).join('') + `</div>`;
      note = '개발용 앱이라 스크린샷으로 표시합니다';
    }
    return `
      <div class="proj-preview">
        <div class="preview-head">
          <strong>+ PREVIEW</strong>
          <span class="note">${escapeHtml(note)}</span>
        </div>
        ${body}
      </div>
    `;
  }

  /* ============================================================
     RENDER — single project detail page
     ============================================================ */
  function renderProjectDetail(p, idx) {
    const num = pad2(idx + 1);
    const meta = `
      <div class="proj-metarow">
        <div class="proj-meta-cell">
          <span class="k">Period</span>
          <span class="v">${fmtD(p.start)} <span class="small">→ ${fmtD(p.latest)}</span></span>
        </div>
        <div class="proj-meta-cell">
          <span class="k">Duration</span>
          <span class="v">${durationText(p.start, p.latest)}</span>
        </div>
        <div class="proj-meta-cell">
          <span class="k">Platform</span>
          <span class="v">${escapeHtml(p.platform || '—')}</span>
        </div>
        <div class="proj-meta-cell">
          <span class="k">Progress</span>
          <div class="v proj-progress">
            <span class="pct">${typeof p.progress === 'number' ? p.progress + '%' : '—'}</span>
            <div class="bar"><div class="fill" style="width:${typeof p.progress === 'number' ? p.progress : 0}%"></div></div>
          </div>
        </div>
      </div>
    `;

    const stack = (p.stack && p.stack.length)
      ? `<ul class="proj-stack">${p.stack.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
      : '';

    const issuesArr = (p.issues || []);
    const issues = issuesArr.length ? `
      <div class="proj-issues">
        <div class="issues-head">
          <strong>+ ISSUES &amp; PROGRESS</strong>
          <span class="count">${pad2(issuesArr.length)} ENTRIES</span>
        </div>
        <div class="issues-stack">
          ${issuesArr.map(it => `
            <div class="issue" data-tone="${escapeHtml(it.type || '')}">
              <span class="issue-type" data-tone="${escapeHtml(it.type || '')}">${escapeHtml(it.type || '')}</span>
              <div class="issue-body">
                <h4>${escapeHtml(it.title || '')}</h4>
                <p>${escapeHtml(it.desc || '')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const milestonesArr = (p.milestones || []);
    const milestones = milestonesArr.length ? `
      <div class="proj-timeline">
        <div class="timeline-head">
          <strong>+ TIMELINE</strong>
          <span class="count">${pad2(milestonesArr.length)} MILESTONES</span>
        </div>
        <div class="timeline-list">
          ${milestonesArr.map(m => `
            <div class="timeline-row" data-core="${m.isCore === true ? 'true' : 'false'}">
              <div class="timeline-date">
                <span class="d">${escapeHtml(m.date)}</span>
                ${m.isCore === true ? '<span class="badge">★ CORE</span>' : ''}
              </div>
              <div class="timeline-body">
                <h4>${escapeHtml(m.title || '')}</h4>
                <p>${escapeHtml(m.desc || '')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <section class="detail-back">
        <div class="container"><a href="#/">All Projects</a></div>
      </section>

      <section class="proj-page" data-index="${num}" data-theme="dark" id="p-${escapeHtml(p.id)}">
        <div class="container">
          <div class="proj-eyebrow">
            <div class="left">
              <span class="num">+ ${num}</span>
              <span class="tag">PROJECT · ${escapeHtml(p.id.toUpperCase())}</span>
              <span class="platform">${escapeHtml(p.platform || '')}</span>
            </div>
            <div class="right">
              <span class="proj-status" data-st="${escapeHtml(p.status)}">
                <span class="pulse" aria-hidden="true"></span>
                ${statusLabel(p.status)}
              </span>
              ${(function () {
                const pv = p.preview && p.preview.type === 'embed' && p.preview.items && p.preview.items[0] ? p.preview.items[0].url : '';
                const lk = p.link || '';
                const target = pv || lk;
                const isExternal = target && /^https?:\/\//i.test(target) && !/127\.0\.0\.1|localhost/.test(target);
                if (!isExternal) return '';
                return `<a class="proj-live" href="${escapeHtml(target)}" target="_blank" rel="noopener" title="새 탭에서 작업결과물 열기">
                  <span class="dot-anim" aria-hidden="true"></span>
                  View Live <span class="arr" aria-hidden="true">↗</span>
                </a>`;
              })()}
            </div>
          </div>

          <div class="proj-hero-row">
            <span class="proj-emblem-big" aria-hidden="true">${emblem(p.icon)}</span>
            <h2 class="proj-name reveal-line">${escapeHtml(p.name)}</h2>
          </div>
          <p class="proj-subtitle reveal-up">${escapeHtml(p.subtitle || '')}</p>

          ${meta}

          ${p.summary ? `<p class="proj-summary">${escapeHtml(p.summary)}</p>` : ''}
          ${p.method  ? `<p class="proj-method">${escapeHtml(p.method)}</p>`  : ''}

          ${stack}

          ${renderPreview(p)}

          ${issues}

          ${milestones}
        </div>
      </section>
    `;
  }

  /* ============================================================
     RENDER — home view (page hero + status summary + 6 card grid)
     ============================================================ */
  function renderHome(projects) {
    const total = projects.length;
    const done   = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'in-progress').length;
    const pause  = projects.filter(p => p.status === 'paused').length;

    const todayStr = (function () {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const kst = new Date(utcMs + 9 * 3600 * 1000);
      return kst.getFullYear() + '-' + pad2(kst.getMonth()+1) + '-' + pad2(kst.getDate());
    })();

    const cards = projects.map((p, i) => `
      <a class="home-card" href="#/p/${escapeHtml(p.id)}">
        <span class="card-emblem">${emblem(p.icon)}</span>
        <div class="card-row">
          <span class="card-num">+ ${pad2(i+1)} · ${escapeHtml(p.id.toUpperCase())}</span>
          <span class="card-status" data-st="${escapeHtml(p.status)}">${statusLabel(p.status)}</span>
        </div>
        <h4 class="card-name">${escapeHtml(p.name)}</h4>
        <p class="card-sub">${escapeHtml(p.subtitle || '')}</p>
        <p class="card-summary">${escapeHtml((p.summary || '').slice(0, 220))}${(p.summary || '').length > 220 ? '…' : ''}</p>
        <div class="card-progress">
          <span class="pct">${typeof p.progress === 'number' ? p.progress + '%' : '—'}</span>
          <div class="bar"><div class="fill" style="width:${typeof p.progress === 'number' ? p.progress : 0}%"></div></div>
        </div>
        <span class="card-cta">View Detail <span aria-hidden="true">→</span></span>
      </a>
    `).join('');

    return `
      <section class="page-hero" data-index="00" data-theme="dark" id="top">
        <div class="container">
          <div class="page-meta reveal-up">
            <div class="page-meta-item"><span class="label">Director</span><span class="value">G.M.PARK</span></div>
            <div class="page-meta-item"><span class="label">Scope</span><span class="value">06 Projects · Multi-Track</span></div>
            <div class="page-meta-item"><span class="label">Period</span><span class="value">2025 — Present</span></div>
            <div class="page-meta-item"><span class="label">Latest</span><span class="value"><strong>${todayStr}</strong> · KST</span></div>
          </div>

          <h1 class="page-h1">
            <span class="reveal-line">PROJECT</span>
            <span class="reveal-line"><em>REPORTS</em></span>
          </h1>

          <div class="page-lead">
            <p class="lead reveal-up">
              A consolidated report covering all <strong>${projects.length} projects</strong>, active and completed.
              Select a project from the left sidebar, or click a card below to navigate to its detail page.
            </p>
            <div class="marker reveal-up">
              <strong>+ G.M.PARK</strong>
              Director&nbsp;&middot;&nbsp;Creator&nbsp;&middot;&nbsp;Operator<br>
              Multi-Track Build
            </div>
          </div>

          <div class="status-summary reveal-up">
            <div class="status-cell tone-total"><span class="num">${pad2(total)}</span><span class="lbl">Total Projects</span></div>
            <div class="status-cell tone-done"><span class="num">${pad2(done)}</span><span class="lbl">Completed</span></div>
            <div class="status-cell tone-active"><span class="num">${pad2(active)}</span><span class="lbl">In Progress</span></div>
            <div class="status-cell tone-pause"><span class="num">${pad2(pause)}</span><span class="lbl">Paused</span></div>
          </div>
        </div>
      </section>

      <section class="s-home-grid" data-index="01" data-theme="light">
        <div class="container">
          <div class="home-grid-head">
            <h3>All Projects</h3>
            <p class="note"><strong>+ ${pad2(total)}</strong> · click a card to navigate</p>
          </div>
          <div class="home-grid">
            ${cards}
          </div>
        </div>
      </section>
    `;
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  function parseRoute() {
    const h = (window.location.hash || '#/').replace(/^#/, '');
    if (h === '/' || h === '' || h === '/home') return { type: 'home' };
    const m = h.match(/^\/p\/([\w\-]+)$/);
    if (m) return { type: 'detail', id: m[1] };
    return { type: 'home' };  // fallback
  }

  function renderRoute() {
    const projects = window.PROJECTS || [];
    const root = $('#main-content');
    if (!root || !projects.length) return;

    const route = parseRoute();
    setSidebarActive(route);

    if (route.type === 'detail') {
      const idx = projects.findIndex(p => p.id === route.id);
      if (idx >= 0) {
        root.innerHTML = renderProjectDetail(projects[idx], idx);
        document.title = projects[idx].name + ' — G.M.PARK';
      } else {
        // unknown id → fall back to home
        root.innerHTML = renderHome(projects);
        document.title = 'Project Reports — G.M.PARK';
      }
    } else {
      root.innerHTML = renderHome(projects);
      document.title = 'Project Reports — G.M.PARK';
    }

    // scroll to top on route change (instant)
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    // re-process injected DOM
    splitRevealLines(root);
    setupReveal(root);
    setupSectionIndex();
    if (typeof window.__attachCursorHover === 'function') window.__attachCursorHover();

    // close mobile sidebar on route change
    body.classList.remove('is-sidebar-open');
  }

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    startClock();
    setupSidebar();
    setupColorSwitcher();
    setupCursor();

    const projects = window.PROJECTS || [];
    renderSidebar(projects);

    // initial route
    renderRoute();

    // route change
    window.addEventListener('hashchange', renderRoute);

    // intercept sidebar / footer / home-card link clicks: smooth UX, default hashchange handles routing
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#/')) {
        // hashchange will fire — close mobile sidebar
        body.classList.remove('is-sidebar-open');
      }
    });
  });
})();
