import { readSettings } from './dom';

/** Responsive CSS scroll-snap galleries: mouse, keyboard, touch and trackpad. */
export function initCarousels(context) {
  const { listen, cleanup, created, reducedMotion } = context;
  const carousels = [];
  document.querySelectorAll('.swiper-wrapper').forEach((track) => {
    const slides = [...track.children].filter((node) => node.classList.contains('swiper-slide'));
    if (!slides.length) return;
    const host = track.parentElement;
    const widget = track.closest('.elementor-widget') || host;
    const settings = readSettings(widget);
    const originalStyle = track.getAttribute('style');
    host.classList.add('next-carousel');
    track.classList.add('next-carousel-track');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');
    track.setAttribute('aria-label', widget.classList.contains('elementor-widget-spaciaz-testimonials') ? 'Testimonials' : 'Slide gallery');
    const baseCount = Number(settings.slides_to_show || settings.slides_per_view || 1) || 1;
    const baseGap = Number(settings.spaceBetween?.size ?? settings.space_between?.size ?? 30);
    let currentCount = 1;
    let gap = baseGap;
    let userPaused = false;
    let hovering = false;
    let focused = false;
    let interval;
    let dots;
    const getIndex = () => Math.round(track.scrollLeft / Math.max(1, slides[0].getBoundingClientRect().width + gap));

    function updateActiveSlides() {
      const index = getIndex();
      slides.forEach((slide, i) => {
        slide.classList.toggle('swiper-slide-active', i === index);
        slide.classList.toggle('swiper-slide-visible', i >= index && i < index + currentCount);
      });
      if (dots) [...dots.children].forEach((dot, i) => {
        dot.classList.toggle('swiper-pagination-bullet-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }
    function resize() {
      let count = baseCount;
      gap = baseGap;
      for (const [width, suffix, fallback] of [[1440, 'laptop', 3], [1200, 'tablet_extra', 3], [1024, 'tablet', 2], [880, 'mobile_extra', 2], [767, 'mobile', 1]]) {
        if (window.innerWidth <= width) {
          count = Number(settings[`slides_to_show_${suffix}`] || settings[`slides_per_view_${suffix}`]) || Math.min(count, fallback);
          gap = Number(settings[`spaceBetween_${suffix}`]?.size ?? settings[`space_between_${suffix}`]?.size ?? gap);
        }
      }
      gap = Math.max(0, gap);
      currentCount = Math.max(1, Math.min(count, slides.length));
      track.style.setProperty('--next-gap', `${gap}px`);
      track.style.setProperty('--next-slides', String(currentCount));
      track.style.setProperty('--next-slide-width', `calc((100% - ${gap * (currentCount - 1)}px) / ${currentCount})`);
      updateActiveSlides();
    }
    function goTo(index, smooth = true) {
      const slide = slides[Math.max(0, Math.min(slides.length - 1, index))];
      const left = slide.offsetLeft - slides[0].offsetLeft;
      track.scrollTo({ left, behavior: reducedMotion || !smooth ? 'instant' : 'smooth' });
    }
    function step(direction) {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      let position = track.scrollLeft + direction * (slides[0].getBoundingClientRect().width + gap);
      if (settings.infinite === 'yes') {
        if (direction > 0 && track.scrollLeft >= max - 2) position = 0;
        if (direction < 0 && track.scrollLeft <= 2) position = max;
      }
      track.scrollTo({ left: Math.max(0, Math.min(max, position)), behavior: reducedMotion ? 'instant' : 'smooth' });
    }
    resize();
    listen(window, 'resize', resize, { passive: true });
    listen(track, 'scroll', updateActiveSlides, { passive: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(updateActiveSlides);
      observer.observe(track);
      cleanup(() => observer.disconnect());
    }

    const prev = widget.querySelector('.elementor-swiper-button-prev, .swiper-button-prev');
    const next = widget.querySelector('.elementor-swiper-button-next, .swiper-button-next');
    for (const [control, direction, label] of [[prev, -1, 'Previous slide'], [next, 1, 'Next slide']]) {
      if (!control) continue;
      control.setAttribute('role', 'button');
      control.setAttribute('aria-label', label);
      control.tabIndex = 0;
      listen(control, 'click', (event) => { event.preventDefault(); step(direction); });
      if (control.tagName !== 'BUTTON') listen(control, 'keydown', (event) => {
        if (['Enter', ' '].includes(event.key)) { event.preventDefault(); step(direction); }
      });
    }
    let controls;
    if (slides.length > 1 && !prev && !next) {
      controls = created(document.createElement('div'));
      controls.className = 'next-carousel-controls';
      for (const [direction, label, glyph] of [[-1, 'Previous slide', '←'], [1, 'Next slide', '→']]) {
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = glyph; button.setAttribute('aria-label', label);
        listen(button, 'click', () => step(direction));
        controls.append(button);
      }
      host.after(controls);
    }
    dots = widget.querySelector('.swiper-pagination');
    if (dots && !dots.children.length && slides.length > 1) {
      slides.forEach((slide, index) => {
        const dot = created(document.createElement('button'));
        dot.type = 'button'; dot.className = 'swiper-pagination-bullet';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        listen(dot, 'click', () => goTo(index));
        dots.append(dot);
      });
      updateActiveSlides();
    }
    listen(track, 'keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') goTo(0);
      else if (event.key === 'End') goTo(slides.length - 1);
      else step(event.key === 'ArrowRight' ? 1 : -1);
    });

    // Autoplay is opt-in in page data. It pauses for keyboard, pointer and reduced motion.
    if (!reducedMotion && settings.autoplay === 'yes' && slides.length > 1) {
      if (!controls) { controls = created(document.createElement('div')); controls.className = 'next-carousel-controls'; host.after(controls); }
      const pause = document.createElement('button');
      pause.type = 'button'; pause.textContent = 'Ⅱ'; pause.setAttribute('aria-label', 'Pause slideshow');
      pause.setAttribute('aria-pressed', 'false'); controls.append(pause);
      listen(pause, 'click', () => {
        userPaused = !userPaused;
        pause.textContent = userPaused ? '▶' : 'Ⅱ';
        pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        pause.setAttribute('aria-pressed', String(userPaused));
      });
      listen(widget, 'mouseenter', () => { hovering = true; });
      listen(widget, 'mouseleave', () => { hovering = false; });
      listen(widget, 'focusin', () => { focused = true; });
      listen(widget, 'focusout', (event) => { focused = !!event.relatedTarget && widget.contains(event.relatedTarget); });
      listen(track, 'pointerdown', () => { if (settings.pause_on_interaction !== 'no') { userPaused = true; pause.textContent = '▶'; pause.setAttribute('aria-label', 'Play slideshow'); pause.setAttribute('aria-pressed', 'true'); } });
      interval = window.setInterval(() => {
        const bounds = track.getBoundingClientRect();
        if (!userPaused && !hovering && !focused && !document.hidden && bounds.width > 0 && bounds.bottom > 0 && bounds.top < window.innerHeight) step(1);
      }, Math.max(2000, Number(settings.autoplay_speed || 5000)));
      cleanup(() => window.clearInterval(interval));
    }
    carousels.push({ track, widget, slides, step, goTo, resize });
    cleanup(() => {
      host.classList.remove('next-carousel');
      track.classList.remove('next-carousel-track');
      if (originalStyle == null) track.removeAttribute('style'); else track.setAttribute('style', originalStyle);
    });
  });
  return carousels;
}
