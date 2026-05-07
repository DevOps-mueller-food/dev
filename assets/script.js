(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Scroll progress bar                                                 */
  /* ------------------------------------------------------------------ */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
  };

  /* ------------------------------------------------------------------ */
  /* Header shrink on scroll                                             */
  /* ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    updateProgress();
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Scroll reveal via IntersectionObserver                              */
  /* ------------------------------------------------------------------ */
  if (!prefersReduced) {
    const items = document.querySelectorAll(
      '.product-card, .b2b-card, .value-card, .story-item, .meta-card, .faq details, .legal-content, .shop-panel, .contact-card, .cta-band, .section-title, .section-lead, .eyebrow, .split-head, .story-visual'
    );
    items.forEach((el, i) => {
      el.classList.add('rv');
      el.style.setProperty('--rv-delay', `${(i % 6) * 60}ms`);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rv-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

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
        <a class="mobile-cta" href="produkte.html">Zum Shop &rarr;</a>
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
  /* Magnetic primary buttons                                            */
  /* ------------------------------------------------------------------ */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    const magnets = document.querySelectorAll('.btn-primary, .btn-light, .cart-pill');
    magnets.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
        el.style.transform = `translate(${x}px, ${y - 2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hero parallax (plate + floating card + stamp)                       */
  /* ------------------------------------------------------------------ */
  const visual = document.querySelector('.hero-visual');
  if (visual && !prefersReduced) {
    const plate = visual.querySelector('.plate');
    const card = visual.querySelector('.floating-card');
    const stamp = visual.querySelector('.stamp');

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = visual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (plate) plate.style.transform = `rotate(${-2 + x * 4}deg) translate(${x * 14}px, ${y * 10}px)`;
        if (card) card.style.transform = `translate(${x * -22}px, ${y * -16}px)`;
        if (stamp) stamp.style.setProperty('--tilt', `${y * 6}px`);
      });
    };
    visual.addEventListener('mousemove', onMove);
    visual.addEventListener('mouseleave', () => {
      if (plate) plate.style.transform = '';
      if (card) card.style.transform = '';
      if (stamp) stamp.style.removeProperty('--tilt');
    });
  }

  /* ------------------------------------------------------------------ */
  /* Tilt on product cards                                               */
  /* ------------------------------------------------------------------ */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.product-card').forEach((card) => {
      const img = card.querySelector('.product-img');
      const shape = card.querySelector('.pasta-shape');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${y * -4}deg) rotateY(${x * 6}deg)`;
        if (shape) shape.style.transform = `rotate(${18 + x * 10}deg) scale(${1 + Math.abs(y) * 0.04})`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (shape) shape.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Number / price counter                                              */
  /* ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseFloat(el.getAttribute('data-count'));
        const decimals = (el.getAttribute('data-decimals') || '0') | 0;
        const dur = 1400;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (eased * end).toFixed(decimals);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => countObserver.observe(c));
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
