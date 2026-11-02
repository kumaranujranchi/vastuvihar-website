'use client';

import './common/ThemeRuntime.css';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SearchDialog from './SearchDialog';
import ConsentEmbed from './privacy/ConsentEmbed';
import { createAnimationContext, trapFocus, visibleFocusables } from '@/animations/dom';
import { initNavigation } from '@/animations/navigation';
import { initReveals } from '@/animations/reveal';
import { initCarousels } from '@/animations/carousels';
import { initTabs } from '@/animations/tabs';
import { initScrollEffects } from '@/animations/scroll';
import { initProjectFilters } from '@/animations/project-filter';
import { initCareers } from '@/animations/careers';
import { initMedia } from '@/animations/media';

/** Wires shared interactions to each route; the page markup stays server-rendered. */
export default function ThemeRuntime({ route = '', bodyClass = '', searchIndex = [] }) {
  const [dialog, setDialog] = useState(null);
  const [query, setQuery] = useState('');
  const dialogRef = useRef(null);
  const returnFocus = useRef(null);
  const id = useId();
  const titleId = `${id}-title`;
  const fieldId = `${id}-search`;

  useEffect(() => {
    setDialog(null);
    const context = createAnimationContext();
    const addedClasses = bodyClass.split(/\s+/).filter((name) => name && !document.body.classList.contains(name));
    document.body.classList.add('next-theme-ready', ...addedClasses);
    const navigation = initNavigation(context);
    const carousels = initCarousels(context);
    initTabs(context);
    initReveals(context);
    initScrollEffects(context);
    initProjectFilters(context);
    initCareers(context, carousels);

    function openDialog(value, trigger) {
      navigation.close();
      returnFocus.current = trigger || document.activeElement;
      setDialog(value);
    }
    initMedia(context, openDialog);
    context.listen(document, 'click', (event) => {
      if (!(event.target instanceof Element)) return;
      const search = event.target.closest('.button-search-popup, [data-open-search]');
      if (search) { event.preventDefault(); setQuery(''); openDialog({ kind: 'search', title: 'Search the site' }, search); }
    });
    context.listen(window, 'spaciaz:search', (event) => {
      setQuery(String(event.detail?.query || ''));
      openDialog({ kind: 'search', title: 'Search the site' });
    });
    context.listen(document, 'submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches('.search-form') || form.matches('.next-search-form, [data-next-search]')) return;
      event.preventDefault();
      setQuery(String(new FormData(form).get('s') || ''));
      openDialog({ kind: 'search', title: 'Search the site' }, form.querySelector('input[type="search"]'));
    });
    return () => {
      context.destroy();
      document.body.classList.remove('next-theme-ready', ...addedClasses);
    };
  }, [route, bodyClass]);

  useEffect(() => {
    if (!dialog || !dialogRef.current) return;
    const node = dialogRef.current;
    const backdrop = node.parentElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [...document.body.children].filter((element) => element !== backdrop && element.tagName !== 'SCRIPT');
    const originalInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    (node.querySelector('input[type="search"]') || visibleFocusables(node)[0] || node).focus();
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); setDialog(null); }
      if (event.key === 'Tab') trapFocus(event, node);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = originalInert[index]; });
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
    };
  }, [dialog]);

  if (!dialog) return null;
  return createPortal(
    <div className="next-dialog-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
      <section ref={dialogRef} className={`next-dialog next-dialog-${dialog.kind}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="next-dialog-heading">
          <h2 id={titleId}>{dialog.title}</h2>
          <button className="next-dialog-close" type="button" aria-label="Close dialog" onClick={() => setDialog(null)}>×</button>
        </div>
        {dialog.kind === 'search' ? (
          <SearchDialog query={query} onQueryChange={setQuery} searchIndex={searchIndex} onClose={() => setDialog(null)} fieldId={fieldId} />
        ) : dialog.kind === 'image' ? (
          <img className="next-lightbox-image" src={dialog.src} alt="Enlarged project image" />
        ) : dialog.kind === 'file-video' ? (
          <video src={dialog.src} controls autoPlay playsInline className="next-lightbox-video" />
        ) : (
          <ConsentEmbed provider="the video host">
            <iframe className="next-lightbox-video" src={dialog.src} title="Video player" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </ConsentEmbed>
        )}
      </section>
    </div>, document.body,
  );
}
