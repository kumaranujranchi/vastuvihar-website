/** Job details expand in the document, with the selected role brought into view. */
export function initCareers(context, carousels) {
  const { listen, cleanup, reducedMotion } = context;
  document.querySelectorAll('.elementor-widget-spaciaz-careers-showcase').forEach((widget, index) => {
    const popup = widget.querySelector('.careers-popup');
    const roles = [...widget.querySelectorAll('.elementor-careersshowcase-item')];
    if (!popup || !roles.length) return;
    const slider = carousels.find(({ track }) => popup.contains(track));
    const closeButton = popup.querySelector('.careers-popup-close');
    let activeRole = null;
    popup.id ||= `site-career-details-${index}`;
    popup.hidden = true;
    popup.setAttribute('role', 'region');
    popup.setAttribute('aria-label', 'Job details');
    closeButton?.setAttribute('type', 'button');
    closeButton?.setAttribute('aria-label', 'Close job details');
    function close(restoreFocus = true) {
      popup.hidden = true; popup.classList.remove('next-careers-open');
      roles.forEach((role) => role.setAttribute('aria-expanded', 'false'));
      if (restoreFocus && activeRole?.isConnected) activeRole.focus();
    }
    function open(role) {
      if (!popup.hidden && activeRole === role) { close(); return; }
      activeRole = role;
      popup.hidden = false; popup.classList.add('next-careers-open');
      roles.forEach((item) => {
        item.setAttribute('aria-expanded', String(item === role));
        item.classList.toggle('elementor-active', item === role);
      });
      const index = Number(role.dataset.goto || 0);
      slider?.resize(); slider?.goTo(index, false);
      const heading = slider?.slides[index]?.querySelector('.careers-title');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      popup.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }
    roles.forEach((role) => {
      role.setAttribute('role', 'button'); role.tabIndex = 0;
      role.setAttribute('aria-expanded', 'false'); role.setAttribute('aria-controls', popup.id);
      listen(role, 'click', (event) => { event.preventDefault(); open(role); });
      listen(role, 'keydown', (event) => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); open(role); } });
    });
    listen(closeButton, 'click', (event) => { event.preventDefault(); close(); });
    listen(popup, 'keydown', (event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } });
    cleanup(() => close(false));
  });
}
