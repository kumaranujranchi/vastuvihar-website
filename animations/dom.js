/** Shared lifecycle helpers for the site's small, dependency-free animations. */
export const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

export function visibleFocusables(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter((node) => !node.closest('[hidden], [inert]') && node.getClientRects().length);
}

export function readSettings(node) {
  try { return JSON.parse(node?.getAttribute('data-settings') || '{}'); }
  catch { return {}; }
}

export function trapFocus(event, root) {
  const nodes = visibleFocusables(root);
  if (!nodes.length) { event.preventDefault(); root.focus(); return; }
  const first = nodes[0], last = nodes.at(-1);
  if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
}

export function createAnimationContext() {
  const cleanups = [];
  const context = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    cleanup(callback) { cleanups.push(callback); },
    listen(target, type, callback, options) {
      target?.addEventListener(type, callback, options);
      cleanups.push(() => target?.removeEventListener(type, callback, options));
    },
    created(node) { cleanups.push(() => node.remove()); return node; },
    destroy() { cleanups.reverse().forEach((cleanup) => cleanup()); },
  };
  return context;
}
