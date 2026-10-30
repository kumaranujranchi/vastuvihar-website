'use client';

import { useEffect, useRef, useState } from 'react';

function TabIcon({ name }) {
  const props = {
    width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
    style: { display: 'block', width: 22, height: 22, flexShrink: 0, color: 'inherit', visibility: 'visible', opacity: 1 },
    stroke: 'currentColor', strokeWidth: 1.9,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  };
  if (name === 'photos') return (
    <svg {...props}><rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <circle cx="8.4" cy="8.4" r="1.8" />
      <path d="m3.5 17 5.8-5.3 4.3 3.6 3.4-3.2 3.5 3.4" />
    </svg>
  );
  if (name === 'plans') return (
    <svg {...props}><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
      <path d="m3 3 6 6M21 3l-6 6M3 21l6-6M21 21l-6-6" />
    </svg>
  );
  return (
    <svg {...props}><rect x="2" y="3" width="20" height="18" rx="5" />
      <path d="m10 8 6 4-6 4V8Z" /><path d="M2 8h20" />
    </svg>
  );
}

function MediaCarousel({ items, title, isPlan = false }) {
  const viewportRef = useRef(null);
  const slideIndexRef = useRef(0);
  const endTimerRef = useRef(null);
  const dragRef = useRef(null);
  const preventClickRef = useRef(false);
  const [activeSlide, setActiveSlide] = useState(items.length > 1 ? items.length : 0);
  const count = items.length;
  const loop = count > 1;
  // Three copies make the previous AND next image visible from the first slide.
  const slides = loop ? [...items, ...items, ...items] : items;

  function centerSlide(index, animate = true) {
    const viewport = viewportRef.current;
    const slide = viewport?.querySelectorAll('[data-media-slide]')[index];
    if (!viewport || !slide) return;
    const left = viewport.scrollLeft + slide.getBoundingClientRect().left
      - viewport.getBoundingClientRect().left - (viewport.clientWidth - slide.clientWidth) / 2;
    if (!animate) viewport.style.scrollBehavior = 'auto';
    viewport.scrollTo({ left, behavior: animate ? 'smooth' : 'instant' });
    if (!animate) viewport.style.scrollBehavior = '';
    slideIndexRef.current = index;
    setActiveSlide(index);
  }

  useEffect(() => {
    const start = loop ? count : 0;
    const frame = requestAnimationFrame(() => centerSlide(start, false));
    const handleResize = () => centerSlide(slideIndexRef.current, false);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(endTimerRef.current);
      window.removeEventListener('resize', handleResize);
    };
    // Re-center only when the gallery itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, isPlan, items[0]?.url]);

  function onScroll() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const middle = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    viewport.querySelectorAll('[data-media-slide]').forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const delta = Math.abs(rect.left + rect.width / 2 - middle);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    slideIndexRef.current = nearest;
    setActiveSlide(nearest);
    clearTimeout(endTimerRef.current);
    endTimerRef.current = setTimeout(() => {
      if (loop && (slideIndexRef.current < count || slideIndexRef.current >= count * 2)) {
        centerSlide(count + (slideIndexRef.current % count), false);
      }
    }, 180);
  }

  function startDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const viewport = event.currentTarget;
    dragRef.current = { startX: event.clientX, scrollLeft: viewport.scrollLeft, moved: false };
    viewport.style.scrollSnapType = 'none';
    viewport.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.moved = true;
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  }

  function stopDrag(event) {
    if (!dragRef.current) return;
    preventClickRef.current = dragRef.current.moved;
    dragRef.current = null;
    event.currentTarget.style.scrollSnapType = '';
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => { preventClickRef.current = false; }, 120);
  }

  if (!count) return (
    <div className="vv-media-empty">{isPlan ? 'Floor plans not available' : 'Photos not available'}</div>
  );

  return (
    <div className="elementor-element elementor-element-37fe374 enable-title-yes overflow-to-both elementor-widget__width-initial elementor-widget elementor-widget-spaciaz-image-carousel vv-media-carousel">
      <div className="elementor-widget-container">
        <div className="spaciaz-swiper vv-media-slider">
          <div
            ref={viewportRef}
            className="swiper-wrapper vv-media-track"
            onScroll={onScroll}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onClickCapture={(event) => {
              if (preventClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                preventClickRef.current = false;
              }
            }}
            aria-label={`${title} ${isPlan ? 'floor plans' : 'photo gallery'}`}
          >
            {slides.map((item, index) => (
              <div
                key={`${item.url}-${index}`}
                data-media-slide
                className={`image-carousel-item swiper-slide vv-media-slide ${index === activeSlide ? 'vv-media-current' : ''}`}
                aria-hidden={index !== activeSlide}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={index === activeSlide ? 0 : -1} className="photo__bounce-wrap">
                  <img
                    src={item.url} loading={Math.abs(index - activeSlide) > 2 ? 'lazy' : 'eager'}
                    decoding="async"
                    alt={item.alt || `${title} ${isPlan ? 'floor plan' : 'photo'}`}
                    className={isPlan ? 'vv-plan-image' : ''}
                    draggable="false"
                  />
                  {isPlan && <span className="vv-plan-label">{item.label || 'Floor Plan'}</span>}
                </a>
              </div>
            ))}
          </div>
          {loop && (
            <>
              <button type="button" className="vv-media-arrow vv-media-prev" aria-label="Previous image" onClick={() => centerSlide(slideIndexRef.current - 1)}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg>
              </button>
              <button type="button" className="vv-media-arrow vv-media-next" aria-label="Next image" onClick={() => centerSlide(slideIndexRef.current + 1)}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 5 7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .vv-media-carousel { width: min(100vw, 1500px); max-width: none; position: relative; left: 50%; transform: translateX(-50%); }
        .vv-media-slider { position: relative; width: 100%; overflow: visible; }
        .vv-media-track { --slide-width: min(82%, 980px); display: flex; align-items: stretch; gap: 28px; overflow-x: auto; overflow-y: hidden; padding-inline: max(16px, calc((100% - var(--slide-width)) / 2)); scroll-snap-type: x mandatory; scroll-behavior: smooth; transform: none !important; scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-x pan-y; cursor: grab; }
        .vv-media-track:active { cursor: grabbing; }
        .vv-media-track::-webkit-scrollbar { display: none; }
        .vv-media-slide { flex: 0 0 var(--slide-width) !important; width: var(--slide-width) !important; height: auto; overflow: hidden; border-radius: 28px; scroll-snap-align: center; opacity: .24; transform: scale(.985); transition: opacity .48s ease, transform .48s ease; background: #f6f6f6; }
        .vv-media-current { opacity: 1; transform: scale(1); }
        .vv-media-slide .photo__bounce-wrap { display: block; position: relative; width: 100%; aspect-ratio: 1.38 / 1; overflow: hidden; border-radius: inherit; }
        .vv-media-slide img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .vv-media-slide img.vv-plan-image { object-fit: contain; background: #fff; }
        .vv-plan-label { position: absolute; left: 18px; bottom: 18px; padding: 9px 14px; border-radius: 999px; background: rgba(255,255,255,.92); color: #111; font-size: 13px; font-weight: 600; }
        .vv-media-arrow { position: absolute; z-index: 2; top: 50%; transform: translateY(-50%); display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid #eee; border-radius: 50%; color: #111; background: rgba(255,255,255,.94); box-shadow: 0 2px 12px rgba(0,0,0,.08); cursor: pointer; }
        .vv-media-prev { left: max(20px, calc((100% - min(82%, 980px)) / 2 + 18px)); }
        .vv-media-next { right: max(20px, calc((100% - min(82%, 980px)) / 2 + 18px)); }
        .vv-media-arrow:hover { opacity: .9; }
        @media (max-width: 700px) {
          .vv-media-track { --slide-width: 88%; gap: 14px; }
          .vv-media-slide { border-radius: 18px; }
          .vv-media-slide .photo__bounce-wrap { aspect-ratio: 4 / 3; }
          .vv-media-arrow { width: 36px; height: 36px; }
          .vv-media-prev { left: 7%; } .vv-media-next { right: 7%; }
          .vv-media-arrow { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { .vv-media-track { scroll-behavior: auto; } .vv-media-slide { transition: none; } }
      `}</style>
    </div>
  );
}

export default function ProjectMedia({ project }) {
  const [active, setActive] = useState('photos');
  const photos = (project.gallery || []).filter(Boolean).map((url, index) => ({
    url, alt: `${project.title} — Photo ${index + 1}`,
  }));
  const plans = (project.modelTypes || []).flatMap((type) => (type.layouts || [])
    .filter((layout) => layout.url)
    .map((layout) => ({
      url: layout.url,
      label: `${layout.type} — ${layout.label || type.modelName || 'Floor Plan'}`,
      alt: `${project.title} ${layout.type} ${layout.label || 'floor plan'}`,
    })));
  const hasVideo = /^[a-zA-Z0-9_-]{11}$/.test(project.youtubeId || '');
  const tabs = [
    { id: 'photos', label: 'Photos' },
    { id: 'plans', label: 'Plans' },
    { id: 'video', label: 'Video' },
  ];

  return (
    <div className="elementor-element elementor-element-886b5dc e-flex e-con-boxed e-con e-parent vv-project-media" data-id="886b5dc" data-element_type="container">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-e125a3f elementor-tabs-style-default e-n-tabs-mobile elementor-widget elementor-widget-n-tabs vv-media-widget" data-id="e125a3f" data-element_type="widget" data-widget_type="nested-tabs.default">
          <div className="elementor-widget-container">
            <div className="e-n-tabs vv-media-tabs" aria-label={`Media for ${project.title}`}>
              <div className="vv-media-toolbar">
                <div className="elementor-element elementor-element-9458c68 elementor-widget elementor-widget-heading" data-id="9458c68" data-element_type="widget" data-widget_type="heading.default">
                  <div className="elementor-widget-container"><h3 className="elementor-heading-title elementor-size-default">Media</h3></div>
                </div>
                <div className="e-n-tabs-heading vv-media-buttons" role="tablist" aria-label="Media type">
                  {tabs.map((tab, index) => (
                    <button
                      type="button" key={tab.id} id={`model-media-${project.slug}-${tab.id}`}
                      className={`e-n-tab-title vv-media-tab ${active === tab.id ? 'e-active' : ''}`}
                      aria-selected={active === tab.id} role="tab" tabIndex={active === tab.id ? 0 : -1}
                      aria-controls={`model-panel-${project.slug}-${tab.id}`}
                      onClick={() => setActive(tab.id)}
                      onKeyDown={(event) => {
                        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
                        if (direction) {
                          event.preventDefault();
                          const next = tabs[(index + direction + tabs.length) % tabs.length].id;
                          setActive(next);
                          document.getElementById(`model-media-${project.slug}-${next}`)?.focus();
                        }
                      }}
                      style={{ '--n-tabs-title-order': String(index + 1) }}
                    >
                      <span className="vv-media-tab-svg" aria-hidden="true"><TabIcon name={tab.id} /></span>
                      <span className="e-n-tab-title-text">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="e-n-tabs-content vv-media-content">
                <div id={`model-panel-${project.slug}-${active}`} role="tabpanel" aria-labelledby={`model-media-${project.slug}-${active}`} className="elementor-element e-active e-con-full e-flex e-con e-child">
                  {active === 'photos' && <MediaCarousel key={`${project.slug}-photos`} items={photos} title={project.title} />}
                  {active === 'plans' && <MediaCarousel key={`${project.slug}-plans`} items={plans} title={project.title} isPlan />}
                  {active === 'video' && (
                    hasVideo ? (
                      <div className="elementor-element elementor-element-df017db elementor-widget elementor-widget-video vv-video-frame">
                        <div className="elementor-widget-container">
                          <div className="elementor-wrapper elementor-open-inline">
                            <iframe
                              key={project.youtubeId}
                              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0`}
                              title={`${project.title} video`} loading="lazy" allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          </div>
                        </div>
                      </div>
                    ) : <div className="vv-media-empty">Video not available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .vv-project-media { overflow: visible; }
        .vv-project-media > .e-con-inner { display: block; }
        .vv-media-widget, .vv-media-widget > .elementor-widget-container, .vv-media-tabs, .vv-media-content { width: 100%; overflow: visible; }
        .vv-media-tabs { display: block; }

.vv-media-buttons .vv-media-tab.e-active,
.vv-media-buttons .vv-media-tab[aria-selected="true"] {
  background-color: var(
    --primary,
    var(--e-global-color-accent, #e3ec64)
  ) !important;
  border-color: var(
    --primary,
    var(--e-global-color-accent, #e3ec64)
  ) !important;
  color: #111 !important;
}

        .vv-media-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 42px; }
        .vv-media-toolbar h3 { margin: 0; color: #080808; font-size: clamp(36px, 5vw, 54px); line-height: 1.08; font-weight: 650; letter-spacing: -.04em; }
        .vv-media-buttons { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .vv-media-tab { display: inline-flex; align-items: center; justify-content: center; gap: 11px; min-height: 51px; padding: 11px 26px; border-radius: 999px; font-size: 16px; line-height: 1; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .25s ease, border-color .25s ease; }
        /* Colors, borders and active tab backgrounds come from the existing Spaciaz/Elementor theme. */
        .vv-media-tab-svg { display: inline-flex !important; visibility: visible !important; opacity: 1 !important; align-items: center; justify-content: center; flex: 0 0 22px; width: 22px; height: 22px; color: inherit; }
        .vv-media-tab-svg :global(svg) { display: block !important; visibility: visible !important; opacity: 1 !important; width: 22px !important; height: 22px !important; fill: none !important; stroke: currentColor !important; }
        .vv-media-content { display: block; }
        .vv-media-empty { display: grid; place-items: center; min-height: 340px; text-align: center; font-size: 20px; font-weight: 500; color: #555; background: #f7f7f7; border-radius: 24px; }
        .vv-video-frame { max-width: 1080px; margin: 0 auto; }
        .vv-video-frame iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 22px; }
        @media (max-width: 767px) { .vv-media-arrow { display: none !important; } }
        @media (max-width: 700px) { .vv-media-toolbar { align-items: flex-start; margin-bottom: 28px; } .vv-media-buttons { width: 100%; gap: 8px; } .vv-media-tab { padding: 10px 16px; font-size: 14px; min-height: 45px; gap: 7px; } .vv-media-empty { min-height: 230px; } }
      `}</style>
    </div>
  );
}
