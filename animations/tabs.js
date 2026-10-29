import { readSettings } from './dom';

const TAB_GROUP = '.e-n-tabs, .elementor-tabs, .video-tabs-element, .elementor-widget-spaciaz-iconboxs-tab';
const TAB_BUTTON = '.e-n-tab-title, .elementor-tabs .elementor-tab-title, .video-tab-nav-item, .details-tab-info';

/** Tabs and FAQ accordions, with arrow-key navigation and ARIA state. */
export function initTabs(context) {
  const { listen } = context;
  function activate(button) {
    const group = button.closest(TAB_GROUP);
    if (!group) return;
    if (button.classList.contains('video-tab-nav-item')) {
      group.querySelectorAll('.video-tab-nav-item').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      });
      group.querySelectorAll('.video-tab-content').forEach((panel) => {
        const active = panel.id === button.dataset.tab;
        panel.classList.toggle('active', active); panel.hidden = !active; panel.setAttribute('aria-hidden', String(!active));
        panel.querySelectorAll('video').forEach((video) => {
          if (!active) video.pause();
          else if (!context.reducedMotion) video.play()?.catch(() => {});
        });
      });
      return;
    }
    if (button.classList.contains('details-tab-info')) {
      const tabs = [...group.querySelectorAll('.details-tab-info')];
      const index = tabs.indexOf(button);
      tabs.forEach((tab, i) => { tab.classList.toggle('active', i === index); tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      group.querySelectorAll('.iconbox-tab-item').forEach((panel, i) => { panel.classList.toggle('active', i === index); panel.hidden = i !== index; });
      return;
    }
    const index = button.dataset.tabIndex || button.dataset.tab;
    const controls = button.getAttribute('aria-controls');
    group.querySelectorAll('.e-n-tab-title, .elementor-tab-title').forEach((tab) => {
      if (tab.closest('.e-n-tabs, .elementor-tabs') !== group) return;
      const active = (tab.dataset.tabIndex || tab.dataset.tab) === index;
      tab.classList.toggle('elementor-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    group.querySelectorAll('.e-n-tabs-content > [role="tabpanel"], .elementor-tab-content').forEach((panel) => {
      if (panel.closest('.e-n-tabs, .elementor-tabs') !== group) return;
      const active = panel.id === controls || (!!index && (panel.dataset.tabIndex || panel.dataset.tab) === index);
      panel.classList.toggle('e-active', active); panel.classList.toggle('elementor-active', active);
      panel.hidden = !active; panel.setAttribute('aria-hidden', String(!active));
    });
    window.dispatchEvent(new Event('resize'));
  }

  document.querySelectorAll('.e-n-tabs, .elementor-tabs').forEach((group) => {
    const first = group.querySelector('.e-n-tab-title[aria-selected="true"], .elementor-tab-title.elementor-active') || group.querySelector('.e-n-tab-title, .elementor-tab-title');
    if (first) activate(first);
  });
  document.querySelectorAll('.video-tabs-element, .elementor-widget-spaciaz-iconboxs-tab').forEach((group, index) => {
    const buttons = [...group.querySelectorAll('.video-tab-nav-item, .details-tab-info')];
    const panels = [...group.querySelectorAll('.video-tab-content, .iconbox-tab-item')];
    const list = group.querySelector('.video-tabs-nav, .elementor-iconbox-tab-title-wrapper');
    list?.setAttribute('role', 'tablist');
    list?.setAttribute('aria-label', group.classList.contains('video-tabs-element') ? 'Featured videos' : 'Explore our expertise');
    buttons.forEach((button, i) => {
      button.id ||= `site-tab-${index}-${i}`;
      button.setAttribute('role', 'tab');
      const panel = panels[i];
      if (panel) {
        panel.id ||= `site-panel-${index}-${i}`;
        button.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', button.id);
      }
    });
    const first = buttons.find((button) => button.classList.contains('active')) || buttons[0];
    if (first) activate(first);
  });

  function toggleAccordion(button) {
    const open = !button.classList.contains('elementor-active');
    const group = button.closest('.elementor-accordion, .elementor-toggle');
    if (!group) return;
    if (group.classList.contains('elementor-accordion')) group.querySelectorAll('.elementor-tab-title').forEach((title) => {
      title.classList.remove('elementor-active'); title.setAttribute('aria-expanded', 'false');
      const content = document.getElementById(title.getAttribute('aria-controls')) || title.nextElementSibling;
      if (content) { content.hidden = true; content.classList.remove('elementor-active'); }
    });
    button.classList.toggle('elementor-active', open); button.setAttribute('aria-expanded', String(open));
    const content = document.getElementById(button.getAttribute('aria-controls')) || button.nextElementSibling;
    if (content) { content.hidden = !open; content.classList.toggle('elementor-active', open); content.style.display = open ? 'block' : ''; }
  }
  document.querySelectorAll('.elementor-accordion .elementor-tab-title, .elementor-toggle .elementor-tab-title').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls')) || button.nextElementSibling;
    const open = button.classList.contains('elementor-active');
    button.setAttribute('role', 'button'); button.tabIndex = 0; button.setAttribute('aria-expanded', String(open));
    if (panel) panel.hidden = !open;
  });
  document.querySelectorAll('.e-n-accordion details').forEach((details) => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    summary.tabIndex = 0;
    const sync = () => {
      summary.setAttribute('aria-expanded', String(details.open));
      if (details.open && readSettings(details.closest('.elementor-widget')).max_items_expended === 'one') {
        details.parentElement.querySelectorAll(':scope > details[open]').forEach((other) => { if (other !== details) other.open = false; });
      }
    };
    listen(details, 'toggle', sync); sync();
    listen(summary, 'keydown', (event) => {
      if (event.key === 'Escape') { details.open = false; event.preventDefault(); }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const summaries = [...details.closest('.e-n-accordion').querySelectorAll(':scope > details > summary')];
      const old = summaries.indexOf(summary);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? summaries.length - 1 : (old + (event.key === 'ArrowDown' ? 1 : -1) + summaries.length) % summaries.length;
      summaries[index]?.focus(); event.preventDefault();
    });
  });

  listen(document, 'click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest(TAB_BUTTON);
    if (button) { event.preventDefault(); activate(button); return; }
    const accordion = event.target.closest('.elementor-accordion .elementor-tab-title, .elementor-toggle .elementor-tab-title');
    if (accordion) { event.preventDefault(); toggleAccordion(accordion); }
  });
  listen(document, 'keydown', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.matches('.elementor-accordion .elementor-tab-title, .elementor-toggle .elementor-tab-title') && ['Enter', ' '].includes(event.key) && target.tagName !== 'BUTTON') {
      event.preventDefault(); toggleAccordion(target); return;
    }
    if (!target.matches(TAB_BUTTON)) return;
    if (['Enter', ' '].includes(event.key) && target.tagName !== 'BUTTON') { event.preventDefault(); activate(target); return; }
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const group = target.closest(TAB_GROUP);
    const tabs = group ? [...group.querySelectorAll(TAB_BUTTON)].filter((tab) => tab.closest(TAB_GROUP) === group && tab.getClientRects().length) : [];
    if (!tabs.length) return;
    const old = tabs.indexOf(target);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (old + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
    event.preventDefault(); tabs[index].focus(); activate(tabs[index]);
  });
}
