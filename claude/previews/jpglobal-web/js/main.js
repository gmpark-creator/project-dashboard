// JPGLOBAL v3 — Plus X 톤 인터프리테이션
// clock / menu / reveal / section index / cursor

(function () {
  const body = document.body;

  /* ---------- 1) KST live clock ---------- */
  const clockEl = document.getElementById('clock-now');
  if (clockEl) {
    const fmt = (n) => String(n).padStart(2, '0');
    function tick() {
      // KST = UTC+9 regardless of viewer's timezone
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const kst = new Date(utcMs + 9 * 3600 * 1000);
      clockEl.textContent =
        fmt(kst.getHours()) + ':' + fmt(kst.getMinutes()) + ':' + fmt(kst.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 2) menu toggle ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const overlayNav = document.getElementById('overlay-nav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => body.classList.toggle('is-menu-open'));
    menuToggle.setAttribute('aria-label', 'Toggle menu');
  }
  if (overlayNav) {
    overlayNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) body.classList.remove('is-menu-open');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('is-menu-open')) {
      body.classList.remove('is-menu-open');
    }
  });

  /* ---------- 3) text reveal — split headlines into words ---------- */
  document.querySelectorAll('.reveal-line').forEach(el => {
    // skip if already processed
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

  /* ---------- 4) reveal observers ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal-line, .reveal-up').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal-line, .reveal-up').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- 5) section index in corner ---------- */
  const sections = Array.from(document.querySelectorAll('section[data-index]'));
  const indexEl  = document.getElementById('section-index-current');
  const totalEl  = document.getElementById('section-index-total');
  if (totalEl && sections.length) {
    totalEl.textContent = String(sections.length).padStart(2, '0');
  }
  if (sections.length && indexEl) {
    let lastIdx = -1;
    function onScroll() {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let cur = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= probe) cur = i; else break;
      }
      if (cur !== lastIdx) {
        indexEl.textContent = sections[cur].getAttribute('data-index');
        lastIdx = cur;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- 6) cursor dot (desktop pointer only) ---------- */
  const cursor = document.getElementById('cursor-dot');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursor && hasFinePointer) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    let raf = null;
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
      } else {
        raf = null;
      }
    }
    // expand on interactive elements via class
    const big = 'is-big';
    document.querySelectorAll('a, button, .ww-card, .partner, .svc-row, .proj-row, .promise, .value-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add(big));
      el.addEventListener('mouseleave', () => cursor.classList.remove(big));
    });
  }
})();
