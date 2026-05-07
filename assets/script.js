(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Scroll progress bar + header shrink                                 */
  /* ------------------------------------------------------------------ */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const header = document.querySelector('.site-header');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 30);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Scroll reveal via IntersectionObserver                              */
  /* ------------------------------------------------------------------ */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const items = document.querySelectorAll(
      '.product-card, .b2b-card, .value-card, .story-item, .meta-card, .faq details, .legal-content, .shop-panel, .contact-card, .cta-band, .section-title, .section-lead, .eyebrow, .split-head, .story-visual'
    );
    items.forEach((el, i) => {
      el.classList.add('rv');
      el.style.setProperty('--rv-delay', `${(i % 4) * 60}ms`);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rv-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                         */
  /* ------------------------------------------------------------------ */
  const mobileBtn = document.querySelector('.mobile-menu');
  if (mobileBtn) {
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = `
      <div class="mobile-drawer-inner">
        <a href="produkte.html">Sortiment</a>
        <a href="manufaktur.html">Manufaktur</a>
        <a href="gastronomie.html">Gastronomie</a>
        <a href="kontakt.html">Kontakt</a>
        <a class="mobile-cta" href="kontakt.html">Anfrage senden &rarr;</a>
      </div>
    `;
    document.body.appendChild(drawer);

    const toggle = () => {
      const open = document.body.classList.toggle('menu-open');
      mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileBtn.textContent = open ? '✕' : '☰';
    };
    mobileBtn.addEventListener('click', toggle);
    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target === drawer) toggle();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) toggle();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Pause hero animations when hero scrolls out of view                 */
  /* ------------------------------------------------------------------ */
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    const heroIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle('hero-off', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroIo.observe(hero);
  }

  /* ------------------------------------------------------------------ */
  /* Smooth-scroll for in-page anchors                                   */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
