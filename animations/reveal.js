import { readSettings } from './dom';

const easeOutCubic = (value) => 1 - (1 - value) ** 3;

/** Entrance reveals and number counters. Content stays readable without JS. */
export function initReveals(context) {
  const { reducedMotion, cleanup } = context;
  const activeAnimations = new Set();
  const frames = new Set();
  const observe = (nodes, run) => {
    if (!('IntersectionObserver' in window) || reducedMotion) { nodes.forEach(run); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) { observer.unobserve(target); run(target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    nodes.forEach((node) => observer.observe(node));
    cleanup(() => observer.disconnect());
  };

  const reveals = [...document.querySelectorAll('.elementor-invisible, [data-reveal]')];
  reveals.forEach((node) => node.classList.remove('elementor-invisible'));
  if (!reducedMotion) observe(reveals, (node) => {
    if (typeof node.animate !== 'function') return;
    const settings = readSettings(node);
    const name = settings._animation || node.dataset.reveal || 'opal-move-up';
    if (name === 'none') return;
    const start = name.includes('left') ? 'translate3d(28px,0,0)' : name.includes('right') ? 'translate3d(-28px,0,0)' : name.includes('down') ? 'translate3d(0,-28px,0)' : name.includes('zoom') ? 'scale(.96)' : 'translate3d(0,28px,0)';
    const animation = node.animate([
      { opacity: 0, transform: start },
      { opacity: 1, transform: 'none' },
    ], { duration: node.classList.contains('animated-fast') ? 550 : 800, delay: Math.min(500, Number(settings._animation_delay || 0)), easing: 'cubic-bezier(.22,1,.36,1)' });
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  });

  const counters = [...document.querySelectorAll('.elementor-counter-number[data-to-value]')];
  const formatCounter = (node, value) => {
    const decimals = (String(node.dataset.toValue).split('.')[1] || '').length;
    node.textContent = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: !!node.dataset.delimiter });
  };
  // Put the real figures in the DOM immediately; scrolling optionally animates them.
  counters.forEach((node) => { const end = Number(node.dataset.toValue); if (Number.isFinite(end)) formatCounter(node, end); });
  observe(counters, (node) => {
    const end = Number(node.dataset.toValue);
    if (!Number.isFinite(end) || reducedMotion) return;
    const start = Number(node.dataset.fromValue || 0);
    const duration = Math.min(2500, Math.max(300, Number(node.dataset.duration || 1500)));
    let began;
    const tick = (time) => {
      began ??= time;
      const progress = Math.min(1, (time - began) / duration);
      formatCounter(node, start + (end - start) * easeOutCubic(progress));
      if (progress < 1) {
        const frame = requestAnimationFrame((nextTime) => { frames.delete(frame); tick(nextTime); });
        frames.add(frame);
      }
    };
    const frame = requestAnimationFrame((time) => { frames.delete(frame); tick(time); });
    frames.add(frame);
  });
  cleanup(() => { activeAnimations.forEach((animation) => animation.cancel()); frames.forEach(cancelAnimationFrame); });
}
