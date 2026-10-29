/** Filter the retained project grid in place; no WordPress/AJAX endpoint needed. */
export function initProjectFilters(context) {
  const { listen, created } = context;
  const allowed = new Set(['status', 'type', 'location', 'budget', 's']);
  function filter(form) {
    const values = [...new FormData(form).entries()].filter(([key, value]) => value && allowed.has(key));
    const container = form.closest('.project-archive-content') || document.querySelector('.project-archive-content') || document.getElementById('main');
    if (!container) return;
    const cards = [...container.querySelectorAll('.project-item')];
    if (!cards.length) return;
    let count = 0;
    cards.forEach((card) => {
      const parent = card.closest('article, .grid-item') || card;
      const text = `${card.textContent} ${JSON.stringify(card.dataset)}`.toLowerCase().replace(/[_-]+/g, ' ');
      const show = values.every(([key, value]) => {
        const explicit = card.dataset[key] || parent.dataset[key];
        return explicit ? explicit.split(',').includes(value) : text.includes(String(value).toLowerCase().replace(/[_-]+/g, ' '));
      });
      parent.hidden = !show;
      if (show) count++;
    });
    let message = form.querySelector('.next-filter-result');
    if (!message) {
      message = created(document.createElement('p'));
      message.className = 'next-filter-result'; message.setAttribute('role', 'status'); form.append(message);
    }
    message.textContent = count ? `${count} project${count === 1 ? '' : 's'} shown.` : 'No projects match these filters. Try another selection.';
  }
  document.querySelectorAll('.project-form-filter').forEach((form) => {
    listen(form, 'submit', (event) => { event.preventDefault(); filter(form); });
    listen(form, 'change', () => filter(form));
    listen(form, 'reset', () => { queueMicrotask(() => { if (form.isConnected) filter(form); }); });
  });
}
