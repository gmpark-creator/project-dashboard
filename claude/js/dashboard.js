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
    // 화물선: hull + 깃대/돛
    'ship':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M2 18.5l1.5 2.5h17L22 18.5"/>' +
        '<path d="M4 16.5l8-8.5 8 8.5"/>' +
        '<path d="M12 4v13"/>' +
        '<path d="M8 11h8"/>' +
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
    // 태양·궤도: 중심 sun-disk + orbit ring + planet dot
    'orbit':
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="3" fill="currentColor"/>' +
        '<ellipse cx="12" cy="12" rx="9" ry="4.5"/>' +
        '<circle cx="21" cy="12" r="1.4" fill="currentColor"/>' +
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
    // 닻 (anchor)
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

  /* ---------- 1) KST clock ---------- */
  function startClock() {
    const el = $('#clock-now');
    if (!el) return;
    const fmt = (n) => String(n).padStart(2, '0');
    function tick() {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const kst = new Date(utcMs + 9 * 3600 * 1000);
      el.textContent = fmt(kst.getHours()) + ':' + fmt(kst.getMinutes()) + ':' + fmt(kst.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
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
            <span class="reveal-line">Project</span>
            <span class="reveal-line"><em>Reports.</em></span>
          </h1>

          <div class="page-lead">
            <p class="lead reveal-up">
              A consolidated report covering all <strong>6 projects</strong>, active and completed.
              Select a project from the left sidebar, or click a card below to navigate to its detail page.
            </p>
            <div class="marker reveal-up">
              <strong>+ G.M.PARK</strong>
              Solo Director / Multi-Track Build
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
