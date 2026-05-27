// JPGLOBAL — main.js
// 1) sticky header shadow on scroll
// 2) mobile nav clone + toggle
// 3) IntersectionObserver reveal

(function () {
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const body = document.body;

  /* ---------- sticky header shadow ---------- */
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav: clone GNB into overlay ---------- */
  const gnb = document.querySelector('.gnb');
  let mobileNav = null;

  function buildMobileNav() {
    if (mobileNav || !gnb) return;
    mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = gnb.innerHTML;
    document.body.appendChild(mobileNav);
    // close on link tap
    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  function openMenu() {
    buildMobileNav();
    requestAnimationFrame(() => {
      mobileNav.classList.add('is-open');
      body.classList.add('is-menu-open');
      hamburger.setAttribute('aria-expanded', 'true');
    });
  }
  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    body.classList.remove('is-menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    if (body.classList.contains('is-menu-open')) closeMenu();
    else openMenu();
  });

  // close on resize up to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ---------- reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .about-text, .about-image, .service-card, .project-card, .band-inner, .contact-left, .contact-right'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger when multiple siblings
          const delay = entry.target.matches('.service-card, .project-card')
            ? (Array.from(entry.target.parentNode.children).indexOf(entry.target) * 90)
            : 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.08 });

    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }
})();
