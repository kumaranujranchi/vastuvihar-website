/** Timeline scrolling, project hover transitions, hero positioning and back-to-top. */
export function initScrollEffects(context) {
  const { listen, cleanup, reducedMotion } = context;
  document.querySelectorAll('.horizontal-scroll-inner').forEach((track) => {
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Company history timeline; scroll horizontally to explore');
    listen(track, 'keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      track.scrollBy({ left: track.clientWidth * (event.key === 'ArrowRight' ? .75 : -.75), behavior: reducedMotion ? 'instant' : 'smooth' });
    });
  });

  // The original Demo 5 video stretches behind the complete hero section.
  document.querySelectorAll('.video-tabs-element[data-relative]').forEach((widget) => {
    let relative;
    try { relative = document.querySelector(widget.dataset.relative); } catch { return; }
    const content = widget.querySelector('.video-tabs-content');
    if (!relative || !content) return;
    const originalStyle = content.getAttribute('style');
    const position = () => {
      const target = relative.getBoundingClientRect();
      const origin = (content.offsetParent || widget).getBoundingClientRect();
      Object.assign(content.style, { position: 'absolute', left: `${target.left - origin.left}px`, top: `${target.top - origin.top}px`, width: `${target.width}px`, height: `${target.height}px` });
    };
    listen(window, 'resize', position, { passive: true }); position();
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(position);
      observer.observe(relative);
      cleanup(() => observer.disconnect());
    }
    cleanup(() => { if (originalStyle == null) content.removeAttribute('style'); else content.setAttribute('style', originalStyle); });
  });

  function activateMatching(item, itemSelector, panelSelector, scopeSelector) {
    const scope = item.closest(scopeSelector);
    if (!scope) return;
    const items = [...scope.querySelectorAll(itemSelector)];
    const index = items.indexOf(item);
    items.forEach((node, i) => node.classList.toggle('active', i === index));
    scope.querySelectorAll(panelSelector).forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
      if (panelSelector === '.project-image-inner') {
        const image = panel.querySelector('.project-post-thumbnail');
        if (image) image.style.transform = `translateY(${(i - index) * 100}%)`;
      }
    });
  }
  const groups = [
    ['.elementor-project-expand-wrapper .project-inner', '.project-inner', '.project-inner', '.elementor-project-expand-wrapper'],
    ['.elementor-project-scroll-wrapper .project-content-inner', '.project-content-inner', '.project-image-inner', '.elementor-project-scroll-wrapper'],
  ];
  groups.forEach(([selector, items, panels, scope]) => {
    const seen = new Set();
    document.querySelectorAll(selector).forEach((node) => {
      const group = node.closest(scope);
      if (!seen.has(group)) { activateMatching(node, items, panels, scope); seen.add(group); }
      listen(node, 'mouseenter', () => activateMatching(node, items, panels, scope));
      listen(node, 'focusin', () => activateMatching(node, items, panels, scope));
      listen(node, 'click', () => activateMatching(node, items, panels, scope));
    });
  });

  const buttons = [...document.querySelectorAll('.scrollup')];
  buttons.forEach((button) => { button.setAttribute('aria-label', 'Back to top'); button.setAttribute('role', 'button'); button.tabIndex = 0; });
  const onScroll = () => buttons.forEach((button) => button.classList.toggle('activate', window.scrollY > 250));
  listen(window, 'scroll', onScroll, { passive: true }); onScroll();
  buttons.forEach((button) => {
    listen(button, 'click', (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }); });
    if (button.tagName !== 'BUTTON') listen(button, 'keydown', (event) => { if (event.key === ' ') { event.preventDefault(); button.click(); } });
  });
  if (reducedMotion) document.querySelectorAll('video[autoplay]').forEach((video) => video.pause());
}
