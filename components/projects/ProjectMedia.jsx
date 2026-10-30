'use client';

import './ProjectMedia.css';
import { useEffect, useRef, useState } from 'react';
import carouselStyles from './MediaCarousel.module.css';
import mediaStyles from './ProjectMedia.module.css';

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
    <div className={carouselStyles.carouselScope + " " + "elementor-element elementor-element-37fe374 enable-title-yes overflow-to-both elementor-widget__width-initial elementor-widget elementor-widget-spaciaz-image-carousel vv-media-carousel"}>
      <div className={carouselStyles.carouselScope + " " + "elementor-widget-container"}>
        <div className={carouselStyles.carouselScope + " " + "spaciaz-swiper vv-media-slider"}>
          <div
            ref={viewportRef}
            className={carouselStyles.carouselScope + " " + "swiper-wrapper vv-media-track"}
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
                className={carouselStyles.carouselScope + " " + `image-carousel-item swiper-slide vv-media-slide ${index === activeSlide ? 'vv-media-current' : ''}`}
                aria-hidden={index !== activeSlide}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={index === activeSlide ? 0 : -1} className={carouselStyles.carouselScope + " " + "photo__bounce-wrap"}>
                  <img
                    src={item.url} loading={Math.abs(index - activeSlide) > 2 ? 'lazy' : 'eager'}
                    decoding="async"
                    alt={item.alt || `${title} ${isPlan ? 'floor plan' : 'photo'}`}
                    className={carouselStyles.carouselScope + " " + ((isPlan ? 'vv-plan-image' : '') || "")}
                    draggable="false"
                  />
                  {isPlan && <span className={carouselStyles.carouselScope + " " + "vv-plan-label"}>{item.label || 'Floor Plan'}</span>}
                </a>
              </div>
            ))}
          </div>
          {loop && (
            <>
              <button type="button" className={carouselStyles.carouselScope + " " + "vv-media-arrow vv-media-prev"} aria-label="Previous image" onClick={() => centerSlide(slideIndexRef.current - 1)}>
                <svg className={carouselStyles.carouselScope} width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className={carouselStyles.carouselScope} d="m14 5-7 7 7 7" /></svg>
              </button>
              <button type="button" className={carouselStyles.carouselScope + " " + "vv-media-arrow vv-media-next"} aria-label="Next image" onClick={() => centerSlide(slideIndexRef.current + 1)}>
                <svg className={carouselStyles.carouselScope} width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className={carouselStyles.carouselScope} d="m10 5 7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
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
    <div className={mediaStyles.mediaScope + " " + "elementor-element elementor-element-886b5dc e-flex e-con-boxed e-con e-parent vv-project-media"} data-id="886b5dc" data-element_type="container">
      <div className={mediaStyles.mediaScope + " " + "e-con-inner"}>
        <div className={mediaStyles.mediaScope + " " + "elementor-element elementor-element-e125a3f elementor-tabs-style-default e-n-tabs-mobile elementor-widget elementor-widget-n-tabs vv-media-widget"} data-id="e125a3f" data-element_type="widget" data-widget_type="nested-tabs.default">
          <div className={mediaStyles.mediaScope + " " + "elementor-widget-container"}>
            <div className={mediaStyles.mediaScope + " " + "e-n-tabs vv-media-tabs"} aria-label={`Media for ${project.title}`}>
              <div className={mediaStyles.mediaScope + " " + "vv-media-toolbar"}>
                <div className={mediaStyles.mediaScope + " " + "elementor-element elementor-element-9458c68 elementor-widget elementor-widget-heading"} data-id="9458c68" data-element_type="widget" data-widget_type="heading.default">
                  <div className={mediaStyles.mediaScope + " " + "elementor-widget-container"}><h3 className={mediaStyles.mediaScope + " " + "elementor-heading-title elementor-size-default"}>Media</h3></div>
                </div>
                <div className={mediaStyles.mediaScope + " " + "e-n-tabs-heading vv-media-buttons"} role="tablist" aria-label="Media type">
                  {tabs.map((tab, index) => (
                    <button
                      type="button" key={tab.id} id={`model-media-${project.slug}-${tab.id}`}
                      className={mediaStyles.mediaScope + " " + `e-n-tab-title vv-media-tab ${active === tab.id ? 'e-active' : ''}`}
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
                      <span className={mediaStyles.mediaScope + " " + "vv-media-tab-svg"} aria-hidden="true"><TabIcon name={tab.id} /></span>
                      <span className={mediaStyles.mediaScope + " " + "e-n-tab-title-text"}>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={mediaStyles.mediaScope + " " + "e-n-tabs-content vv-media-content"}>
                <div id={`model-panel-${project.slug}-${active}`} role="tabpanel" aria-labelledby={`model-media-${project.slug}-${active}`} className={mediaStyles.mediaScope + " " + "elementor-element e-active e-con-full e-flex e-con e-child"}>
                  {active === 'photos' && <MediaCarousel key={`${project.slug}-photos`} items={photos} title={project.title} />}
                  {active === 'plans' && <MediaCarousel key={`${project.slug}-plans`} items={plans} title={project.title} isPlan />}
                  {active === 'video' && (
                    hasVideo ? (
                      <div className={mediaStyles.mediaScope + " " + "elementor-element elementor-element-df017db elementor-widget elementor-widget-video vv-video-frame"}>
                        <div className={mediaStyles.mediaScope + " " + "elementor-widget-container"}>
                          <div className={mediaStyles.mediaScope + " " + "elementor-wrapper elementor-open-inline"}>
                            <iframe className={mediaStyles.mediaScope}
                              key={project.youtubeId}
                              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0`}
                              title={`${project.title} video`} loading="lazy" allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          </div>
                        </div>
                      </div>
                    ) : <div className={mediaStyles.mediaScope + " " + "vv-media-empty"}>Video not available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
