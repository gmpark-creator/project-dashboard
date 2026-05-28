// ============================================================
// PROJECT DASHBOARD — v3 renderer
// 기존 PROJECTS / STATUS / ITYPE 데이터(projects-data.js)는 100% 보존,
// 시각만 v3 Plus X 톤(검정/오렌지/극대형 타이포)으로 재구성.
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

  /* ---------- 2) menu toggle ---------- */
  function setupMenu() {
    const t = $('#menu-toggle');
    const ov = $('#overlay-nav');
    if (t) t.addEventListener('click', () => body.classList.toggle('is-menu-open'));
    if (ov) ov.addEventListener('click', (e) => {
      if (e.target.closest('a')) body.classList.remove('is-menu-open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('is-menu-open')) {
        body.classList.remove('is-menu-open');
      }
    });
  }

  /* ---------- 3) split reveal-line into words ---------- */
  function splitRevealLines() {
    $$('.reveal-line').forEach(el => {
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

  /* ---------- 4) reveal observer ---------- */
  function setupReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal-line, .reveal-up').forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal-line, .reveal-up').forEach(el => io.observe(el));
  }

  /* ---------- 5) section index in corner + scroll progress ---------- */
  function setupSectionIndex() {
    const sections = $$('section[data-index]');
    const indexEl = $('#section-index-current');
    const totalEl = $('#section-index-total');
    const progressEl = $('#scroll-progress');
    if (totalEl) totalEl.textContent = pad2(sections.length);

    let lastIdx = -1;
    function onScroll() {
      // section index
      const probe = window.scrollY + window.innerHeight * 0.35;
      let cur = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= probe) cur = i; else break;
      }
      if (cur !== lastIdx && indexEl) {
        indexEl.textContent = sections[cur].getAttribute('data-index');
        lastIdx = cur;
      }
      // progress
      if (progressEl) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressEl.style.width = p.toFixed(2) + '%';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- 6) cursor dot ---------- */
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
    // re-attach handlers AFTER project rendering populates DOM
    function attachHover() {
      $$('a, button, .proj-page, .preview-card, .issue, .timeline-row, .status-cell').forEach(el => {
        if (el.dataset.cursor === '1') return;
        el.addEventListener('mouseenter', () => cursor.classList.add('is-big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
        el.dataset.cursor = '1';
      });
    }
    attachHover();
    // expose for re-call after re-render
    window.__attachCursorHover = attachHover;
  }

  /* ============================================================
     RENDER — overlay nav
     ============================================================ */
  function renderOverlayNav(projects) {
    const ul = $('#nav-list');
    if (!ul) return;
    ul.innerHTML = projects.map((p, i) => `
      <li>
        <a href="#p-${escapeHtml(p.id)}">
          <span>${escapeHtml(p.name)}<span class="nav-status" data-st="${escapeHtml(p.status)}">${statusLabel(p.status)}</span></span>
          <span class="nav-num">${String(i+1).padStart(3,'0')}</span>
        </a>
      </li>
    `).join('');
  }

  /* ============================================================
     RENDER — page hero status summary
     ============================================================ */
  function renderStatusSummary(projects) {
    const wrap = $('#status-summary');
    if (!wrap) return;
    const total = projects.length;
    const done   = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'in-progress').length;
    const pause  = projects.filter(p => p.status === 'paused').length;
    wrap.innerHTML = `
      <div class="status-cell tone-total">
        <span class="num">${pad2(total)}</span>
        <span class="lbl">Total Projects</span>
      </div>
      <div class="status-cell tone-done">
        <span class="num">${pad2(done)}</span>
        <span class="lbl">Completed</span>
      </div>
      <div class="status-cell tone-active">
        <span class="num">${pad2(active)}</span>
        <span class="lbl">In Progress</span>
      </div>
      <div class="status-cell tone-pause">
        <span class="num">${pad2(pause)}</span>
        <span class="lbl">Paused</span>
      </div>
    `;
  }

  /* ============================================================
     RENDER — preview block (embed iframe OR image grid)
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
     RENDER — single project (full-bleed section)
     ============================================================ */
  function renderProject(p, idx) {
    const num = pad2(idx + 1);
    const theme = idx % 2 === 0 ? 'dark' : 'light';

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
      <section class="proj-page" data-index="${num}" data-theme="${theme}" id="p-${escapeHtml(p.id)}">
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

          <h2 class="proj-name reveal-line">${escapeHtml(p.name)}</h2>
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
     RENDER — all projects into #projects-root
     ============================================================ */
  function renderAll() {
    const projects = window.PROJECTS || [];
    if (!projects.length) return;

    renderStatusSummary(projects);
    renderOverlayNav(projects);

    const root = $('#projects-root');
    if (root) {
      root.innerHTML = projects.map(renderProject).join('');
    }

    // re-process new DOM
    splitRevealLines();
    setupReveal();
    setupSectionIndex();
    if (typeof window.__attachCursorHover === 'function') {
      window.__attachCursorHover();
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    startClock();
    setupMenu();
    setupCursor();
    // process the shell first (page hero reveal lines)
    splitRevealLines();
    setupReveal();
    // render projects (which adds more reveal targets, then re-process)
    renderAll();
  });
})();
