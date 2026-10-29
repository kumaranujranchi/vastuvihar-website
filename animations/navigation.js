import { trapFocus, visibleFocusables } from './dom';

/** Mobile navigation, focus restoration and keyboard-operable submenus. */
export function initNavigation(context) {
  const { listen, cleanup, created } = context;
  const html = document.documentElement;
  const nav = document.querySelector('.spaciaz-mobile-nav');
  const page = document.getElementById('page');
  const buttons = [...document.querySelectorAll('.menu-mobile-nav-button, .menu-toggle')];
  let isOpen = false;
  let trigger = null;
  let pageWasInert = false;
  let previousOverflow = '';

  function toggle(open, source, restoreFocus = true) {
    if (!nav || open === isOpen) return;
    isOpen = open;
    html.classList.toggle('mobile-nav-active', open);
    nav.inert = !open;
    nav.setAttribute('aria-hidden', String(!open));
    buttons.forEach((button) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    if (open) {
      trigger = source || document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (page && !page.contains(nav)) { pageWasInert = page.inert; page.inert = true; }
      (visibleFocusables(nav)[0] || nav).focus();
    } else {
      document.body.style.overflow = previousOverflow;
      if (page && !page.contains(nav)) page.inert = pageWasInert;
      if (restoreFocus && trigger?.isConnected) trigger.focus();
    }
  }

  if (!nav) return { close() {}, isOpen: () => false };
  nav.id ||= 'site-mobile-navigation';
  nav.setAttribute('role', 'dialog');
  nav.setAttribute('aria-label', 'Site navigation');
  nav.setAttribute('aria-modal', 'true');
  nav.tabIndex = -1;
  nav.inert = true;
  nav.setAttribute('aria-hidden', 'true');
  buttons.forEach((button) => {
    button.setAttribute('aria-controls', nav.id);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
    if (button.tagName !== 'BUTTON') { button.setAttribute('role', 'button'); button.tabIndex = 0; }
  });
  const closeButton = nav.querySelector('.mobile-nav-close');
  closeButton?.setAttribute('aria-label', 'Close navigation');
  if (closeButton && closeButton.tagName !== 'BUTTON') { closeButton.setAttribute('role', 'button'); closeButton.tabIndex = 0; }

  nav.querySelectorAll('.menu-item-has-children, .page_item_has_children').forEach((item, index) => {
    const submenu = [...item.children].find((node) => node.matches('ul, .sub-menu'));
    const link = [...item.children].find((node) => node.tagName === 'A');
    if (!submenu || !link) return;
    submenu.id ||= `site-submenu-${index}`;
    submenu.hidden = true;
    let button = item.querySelector(':scope > .next-submenu-toggle');
    if (!button) {
      button = created(document.createElement('button'));
      button.type = 'button';
      button.className = 'dropdown-toggle next-submenu-toggle';
      link.after(button);
    }
    button.setAttribute('aria-label', `Expand ${link.textContent.trim()} submenu`);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', submenu.id);
    cleanup(() => { submenu.hidden = false; submenu.style.removeProperty('display'); });
  });

  listen(document, 'click', (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    const menu = target.closest('.menu-mobile-nav-button, .menu-toggle');
    if (menu) { event.preventDefault(); toggle(!isOpen, menu); return; }
    if (target.closest('.mobile-nav-close, .spaciaz-overlay')) { event.preventDefault(); toggle(false); return; }
    const dropdown = target.closest('.next-submenu-toggle');
    if (dropdown && nav.contains(dropdown)) {
      event.preventDefault();
      const open = dropdown.getAttribute('aria-expanded') !== 'true';
      dropdown.setAttribute('aria-expanded', String(open));
      dropdown.classList.toggle('toggled-on', open);
      const submenu = document.getElementById(dropdown.getAttribute('aria-controls'));
      if (submenu) { submenu.hidden = !open; submenu.style.display = open ? 'block' : ''; }
      return;
    }
    if (isOpen && target.closest('.spaciaz-mobile-nav a[href]')) toggle(false, null, false);
  });
  listen(document, 'keydown', (event) => {
    if (event.key === 'Escape' && isOpen) { event.preventDefault(); toggle(false); }
    if (event.key === 'Tab' && isOpen) trapFocus(event, nav);
    const target = event.target;
    if (target instanceof Element && target.matches('.menu-mobile-nav-button, .menu-toggle, .mobile-nav-close') && target.tagName !== 'BUTTON' && [' ', 'Enter'].includes(event.key)) {
      if (target.tagName === 'A' && event.key === 'Enter') return;
      event.preventDefault(); target.click();
    }
  });
  listen(window, 'resize', () => { if (isOpen && !buttons.some((button) => button.getClientRects().length)) toggle(false); }, { passive: true });
  cleanup(() => {
    if (isOpen) toggle(false, null, false);
    html.classList.remove('mobile-nav-active');
    nav.inert = false;
    nav.removeAttribute('aria-hidden');
  });
  return { close: () => toggle(false), isOpen: () => isOpen };
}
