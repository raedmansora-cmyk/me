(() => {
  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const viewport = carousel.querySelector('.services-viewport');
    const track = carousel.querySelector('.services-track');
    const slides = [...carousel.querySelectorAll('.service-card')];
    const dots = [...carousel.querySelectorAll('.carousel-dot')];
    const counter = carousel.querySelector('.carousel-counter');
    let current = 0;
    let timer;
    let startX = 0;
    let isDragging = false;

    const visibleSlides = () => window.innerWidth <= 620 ? 1 : (window.innerWidth <= 900 ? 2 : 3);
    const update = (index, animate = true) => {
      const visible = visibleSlides();
      const max = Math.max(0, slides.length - visible);
      current = Math.max(0, Math.min(index, max));
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const width = slides[0]?.getBoundingClientRect().width || 0;
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(-${current * (width + gap)}px)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === Math.min(current, dots.length - 1)));
      if (counter) counter.textContent = `${Math.min(current + 1, slides.length)} / ${slides.length}`;
    };
    const next = () => update(current >= slides.length - visibleSlides() ? 0 : current + 1);
    const previous = () => update(current <= 0 ? slides.length - visibleSlides() : current - 1);
    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(next, 4200);
    };
    carousel.querySelector('.carousel-next')?.addEventListener('click', () => { next(); restart(); });
    carousel.querySelector('.carousel-prev')?.addEventListener('click', () => { previous(); restart(); });
    dots.forEach((dot, index) => dot.addEventListener('click', () => { update(Math.min(index, slides.length - visibleSlides())); restart(); }));
    viewport.addEventListener('pointerdown', (event) => { isDragging = true; startX = event.clientX; viewport.setPointerCapture?.(event.pointerId); });
    viewport.addEventListener('pointerup', (event) => {
      if (!isDragging) return;
      isDragging = false;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 35) distance < 0 ? next() : previous();
      restart();
    });
    viewport.addEventListener('pointercancel', () => { isDragging = false; });
    window.addEventListener('resize', () => update(current, false), { passive: true });
    update(0, false);
    restart();
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();