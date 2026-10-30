'use client';

import './ProjectMedia.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import carouselStyles from './MediaCarousel.module.css';
import mediaStyles from './ProjectMedia.module.css';


/* =========================================================
   TAB ICONS
========================================================= */

function TabIcon({ name }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'photos') {
    return (
      <svg {...props}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
        <circle cx="8.4" cy="8.4" r="1.8" />
        <path d="m3.5 17 5.8-5.3 4.3 3.6 3.4-3.2 3.5 3.4" />
      </svg>
    );
  }

  if (name === 'plans') {
    return (
      <svg {...props}>
        <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
        <path d="m3 3 6 6M21 3l-6 6M3 21l6-6M21 21l-6-6" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect x="2" y="3" width="20" height="18" rx="5" />
      <path d="m10 8 6 4-6 4V8Z" />
    </svg>
  );
}


/* =========================================================
   LIGHTBOX
========================================================= */

function MediaLightbox({
  items,
  index,
  title,
  isPlan = false,
  onClose,
  onChange,
}) {
  const item = items[index];

  const previous = useCallback(() => {
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);


  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleKeyboard(event) {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft' && items.length > 1) {
        previous();
      }

      if (event.key === 'ArrowRight' && items.length > 1) {
        next();
      }
    }

    window.addEventListener('keydown', handleKeyboard);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [items.length, next, onClose, previous]);


  if (!item) return null;


  return (
    <div
      className={carouselStyles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} ${isPlan ? 'floor plan' : 'photo'} preview`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        className={carouselStyles.lightboxClose}
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>


      {items.length > 1 && (
        <button
          type="button"
          className={`${carouselStyles.lightboxArrow} ${carouselStyles.lightboxPrev}`}
          onClick={previous}
          aria-label="Previous image"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}


      <div
        className={`${carouselStyles.lightboxContent} ${
          isPlan ? carouselStyles.lightboxPlan : ''
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={item.url}
          alt={
            item.alt ||
            `${title} ${isPlan ? 'floor plan' : 'photo'}`
          }
          draggable="false"
        />

        {isPlan && item.label && (
          <div className={carouselStyles.lightboxLabel}>
            {item.label}
          </div>
        )}
      </div>


      {items.length > 1 && (
        <button
          type="button"
          className={`${carouselStyles.lightboxArrow} ${carouselStyles.lightboxNext}`}
          onClick={next}
          aria-label="Next image"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}


      <div className={carouselStyles.lightboxCounter}>
        {String(index + 1).padStart(2, '0')}
        <span>/</span>
        {String(items.length).padStart(2, '0')}
      </div>
    </div>
  );
}


/* =========================================================
   MEDIA CAROUSEL
========================================================= */

function MediaCarousel({
  items = [],
  title,
  isPlan = false,
}) {
  const viewportRef = useRef(null);

  const slideIndexRef = useRef(0);

  const endTimerRef = useRef(null);

  const dragRef = useRef(null);

  const preventClickRef = useRef(false);

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const count = items.length;

  const loop = count > 1;

  const slides = loop
    ? [...items, ...items, ...items]
    : items;

  const [activeSlide, setActiveSlide] = useState(
    loop ? count : 0
  );


  /* =======================================================
     CENTER SLIDE
  ======================================================= */

  function centerSlide(index, animate = true) {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const allSlides = viewport.querySelectorAll(
      '[data-media-slide]'
    );

    const slide = allSlides[index];

    if (!slide) return;


    const viewportRect = viewport.getBoundingClientRect();

    const slideRect = slide.getBoundingClientRect();


    const left =
      viewport.scrollLeft +
      slideRect.left -
      viewportRect.left -
      (viewport.clientWidth - slide.clientWidth) / 2;


    if (!animate) {
      viewport.style.scrollBehavior = 'auto';
    }


    viewport.scrollTo({
      left,
      behavior: animate ? 'smooth' : 'auto',
    });


    if (!animate) {
      requestAnimationFrame(() => {
        viewport.style.scrollBehavior = '';
      });
    }


    slideIndexRef.current = index;

    setActiveSlide(index);
  }


  /* =======================================================
     INITIAL POSITION
  ======================================================= */

  useEffect(() => {
    if (!count) return undefined;

    const start = loop ? count : 0;

    slideIndexRef.current = start;

    setActiveSlide(start);


    const frame = requestAnimationFrame(() => {
      centerSlide(start, false);
    });


    function handleResize() {
      centerSlide(
        slideIndexRef.current,
        false
      );
    }


    window.addEventListener('resize', handleResize);


    return () => {
      cancelAnimationFrame(frame);

      clearTimeout(endTimerRef.current);

      window.removeEventListener(
        'resize',
        handleResize
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    count,
    isPlan,
    items[0]?.url,
  ]);


  /* =======================================================
     SCROLL
  ======================================================= */

  function onScroll() {
    const viewport = viewportRef.current;

    if (!viewport) return;


    const viewportRect =
      viewport.getBoundingClientRect();


    const middle =
      viewportRect.left +
      viewport.clientWidth / 2;


    let nearest = 0;

    let distance = Infinity;


    viewport
      .querySelectorAll('[data-media-slide]')
      .forEach((slide, index) => {
        const rect =
          slide.getBoundingClientRect();

        const slideMiddle =
          rect.left +
          rect.width / 2;

        const delta =
          Math.abs(
            slideMiddle -
            middle
          );


        if (delta < distance) {
          distance = delta;

          nearest = index;
        }
      });


    slideIndexRef.current = nearest;

    setActiveSlide(nearest);


    clearTimeout(endTimerRef.current);


    endTimerRef.current = setTimeout(() => {
      if (!loop) return;


      const current =
        slideIndexRef.current;


      if (
        current < count ||
        current >= count * 2
      ) {
        const realIndex =
          ((current % count) + count) %
          count;


        centerSlide(
          count + realIndex,
          false
        );
      }
    }, 160);
  }


  /* =======================================================
     DESKTOP MOUSE DRAG
  ======================================================= */

  function startDrag(event) {
    if (
      event.pointerType !== 'mouse' ||
      event.button !== 0
    ) {
      return;
    }


    const viewport =
      event.currentTarget;


    dragRef.current = {
      startX: event.clientX,

      scrollLeft:
        viewport.scrollLeft,

      moved: false,

      distance: 0,
    };


    preventClickRef.current = false;


    viewport.style.scrollSnapType =
      'none';
  }


  function moveDrag(event) {
    const drag =
      dragRef.current;

    if (!drag) return;


    const distance =
      event.clientX -
      drag.startX;


    drag.distance =
      Math.abs(distance);


    /*
     * IMPORTANT:
     * mouse jitter does NOT count as dragging.
     */

    if (drag.distance > 12) {
      drag.moved = true;


      event.currentTarget.scrollLeft =
        drag.scrollLeft -
        distance;
    }
  }


  function stopDrag(event) {
    const drag =
      dragRef.current;

    if (!drag) return;


    const wasDragging =
      drag.moved &&
      drag.distance > 12;


    dragRef.current = null;


    event.currentTarget.style.scrollSnapType =
      '';


    /*
     * Block only the browser-generated click
     * immediately after a real drag.
     */

    preventClickRef.current =
      wasDragging;


    if (wasDragging) {
      setTimeout(() => {
        preventClickRef.current =
          false;
      }, 80);
    }
  }


  /* =======================================================
     CLICK → LIGHTBOX
  ======================================================= */

  function handleMediaClick(
    event,
    slideIndex
  ) {
    event.preventDefault();

    event.stopPropagation();


    /*
     * Only cancel click if the user genuinely dragged.
     */

    if (preventClickRef.current) {
      preventClickRef.current =
        false;

      return;
    }


    const realIndex =
      ((slideIndex % count) +
        count) %
      count;


    setLightboxIndex(realIndex);
  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (!count) {
    return (
      <div
        className={
          mediaStyles.mediaScope +
          ' vv-media-empty'
        }
      >
        {isPlan
          ? 'Floor plans not available'
          : 'Photos not available'}
      </div>
    );
  }


  return (
    <>
      <div
        className={
          carouselStyles.carouselScope +
          ' ' +
          'elementor-element elementor-element-37fe374 enable-title-yes overflow-to-both elementor-widget__width-initial elementor-widget elementor-widget-spaciaz-image-carousel vv-media-carousel'
        }
      >

        <div
          className={
            carouselStyles.carouselScope +
            ' elementor-widget-container'
          }
        >

          <div
            className={
              carouselStyles.carouselScope +
              ' spaciaz-swiper vv-media-slider'
            }
          >

            {/* TRACK */}

            <div
              ref={viewportRef}
              className={
                carouselStyles.carouselScope +
                ' vv-media-track'
              }
              onScroll={onScroll}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              aria-label={`${title} ${
                isPlan
                  ? 'floor plans'
                  : 'photo gallery'
              }`}
            >

              {slides.map(
                (item, index) => (
                  <div
                    key={`${item.url}-${index}`}
                    data-media-slide
                    className={
                      carouselStyles.carouselScope +
                      ' ' +
                      `image-carousel-item vv-media-slide ${
                        index === activeSlide
                          ? 'vv-media-current'
                          : ''
                      }`
                    }
                  >

                    <button
                      type="button"
                      className={
                        carouselStyles.mediaButton
                      }
                      onClick={(event) =>
                        handleMediaClick(
                          event,
                          index
                        )
                      }
                      aria-label={`Open ${
                        isPlan
                          ? 'floor plan'
                          : 'photo'
                      } ${
                        (index % count) + 1
                      }`}
                    >

                      <img
                        src={item.url}
                        loading={
                          Math.abs(
                            index -
                              activeSlide
                          ) > 2
                            ? 'lazy'
                            : 'eager'
                        }
                        decoding="async"
                        alt={
                          item.alt ||
                          `${title} ${
                            isPlan
                              ? 'floor plan'
                              : 'photo'
                          }`
                        }
                        className={
                          isPlan
                            ? carouselStyles.planImage
                            : ''
                        }
                        draggable="false"
                      />


                      {isPlan && (
                        <span
                          className={
                            carouselStyles.planLabel
                          }
                        >
                          {item.label ||
                            'Floor Plan'}
                        </span>
                      )}


                      <span
                        className={
                          carouselStyles.zoomIcon
                        }
                        aria-hidden="true"
                      >
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                          />

                          <path d="m20 20-4-4" />

                          <path d="M11 8v6M8 11h6" />
                        </svg>
                      </span>

                    </button>

                  </div>
                )
              )}

            </div>


            {/* CAROUSEL ARROWS */}

            {loop && (
              <>
                <button
                  type="button"
                  className={
                    carouselStyles.carouselScope +
                    ' vv-media-arrow vv-media-prev'
                  }
                  aria-label="Previous image"
                  onClick={() =>
                    centerSlide(
                      slideIndexRef.current -
                        1
                    )
                  }
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m14 5-7 7 7 7" />
                  </svg>
                </button>


                <button
                  type="button"
                  className={
                    carouselStyles.carouselScope +
                    ' vv-media-arrow vv-media-next'
                  }
                  aria-label="Next image"
                  onClick={() =>
                    centerSlide(
                      slideIndexRef.current +
                        1
                    )
                  }
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m10 5 7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

          </div>
        </div>
      </div>


      {/* LIGHTBOX */}

      {lightboxIndex !== null && (
        <MediaLightbox
          items={items}
          index={lightboxIndex}
          title={title}
          isPlan={isPlan}
          onClose={() =>
            setLightboxIndex(null)
          }
          onChange={
            setLightboxIndex
          }
        />
      )}

    </>
  );
}


/* =========================================================
   PROJECT MEDIA
========================================================= */

export default function ProjectMedia({
  project,
}) {
  const [active, setActive] =
    useState('photos');


  const photos = (
    project?.gallery || []
  )
    .filter(Boolean)
    .map((url, index) => ({
      url,

      alt: `${project.title} — Photo ${
        index + 1
      }`,
    }));


  const plans = (
    project?.modelTypes || []
  ).flatMap((type) =>
    (type.layouts || [])
      .filter(
        (layout) =>
          layout?.url
      )
      .map((layout) => ({
        url: layout.url,

        label: [
          layout.type,

          layout.label ||
            type.modelName,
        ]
          .filter(Boolean)
          .join(' — '),

        alt: `${project.title} ${
          layout.type || ''
        } ${
          layout.label ||
          type.modelName ||
          'Floor Plan'
        }`,
      }))
  );


  const hasVideo =
    /^[a-zA-Z0-9_-]{11}$/.test(
      project?.youtubeId || ''
    );


  const tabs = [
    {
      id: 'photos',
      label: 'Photos',
    },

    {
      id: 'plans',
      label: 'Plans',
    },

    {
      id: 'video',
      label: 'Video',
    },
  ];


  return (
    <div
      className={
        mediaStyles.mediaScope +
        ' ' +
        'elementor-element elementor-element-886b5dc e-flex e-con-boxed e-con e-parent vv-project-media'
      }
      data-id="886b5dc"
      data-element_type="container"
    >

      <div
        className={
          mediaStyles.mediaScope +
          ' e-con-inner'
        }
      >

        <div
          className={
            mediaStyles.mediaScope +
            ' ' +
            'elementor-element elementor-element-e125a3f elementor-tabs-style-default e-n-tabs-mobile elementor-widget elementor-widget-n-tabs vv-media-widget'
          }
          data-id="e125a3f"
          data-element_type="widget"
          data-widget_type="nested-tabs.default"
        >

          <div
            className={
              mediaStyles.mediaScope +
              ' elementor-widget-container'
            }
          >

            <div
              className={
                mediaStyles.mediaScope +
                ' e-n-tabs vv-media-tabs'
              }
              aria-label={`Media for ${project.title}`}
            >

              {/* HEADER */}

              <div
                className={
                  mediaStyles.mediaScope +
                  ' vv-media-toolbar'
                }
              >

                <div
                  className={
                    mediaStyles.mediaScope +
                    ' ' +
                    'elementor-element elementor-element-9458c68 elementor-widget elementor-widget-heading'
                  }
                  data-id="9458c68"
                  data-element_type="widget"
                  data-widget_type="heading.default"
                >
                  <div
                    className={
                      mediaStyles.mediaScope +
                      ' elementor-widget-container'
                    }
                  >
                    <h3
                      className={
                        mediaStyles.mediaScope +
                        ' elementor-heading-title elementor-size-default'
                      }
                    >
                      Media
                    </h3>
                  </div>
                </div>


                {/* TABS */}

                <div
                  className={
                    mediaStyles.mediaScope +
                    ' e-n-tabs-heading vv-media-buttons'
                  }
                  role="tablist"
                  aria-label="Media type"
                >

                  {tabs.map(
                    (
                      tab,
                      index
                    ) => (
                      <button
                        type="button"
                        key={tab.id}
                        id={`model-media-${project.slug}-${tab.id}`}
                        className={
                          mediaStyles.mediaScope +
                          ' ' +
                          `e-n-tab-title vv-media-tab ${
                            active ===
                            tab.id
                              ? 'e-active'
                              : ''
                          }`
                        }
                        aria-selected={
                          active ===
                          tab.id
                        }
                        role="tab"
                        tabIndex={
                          active ===
                          tab.id
                            ? 0
                            : -1
                        }
                        aria-controls={`model-panel-${project.slug}-${tab.id}`}
                        onClick={() =>
                          setActive(
                            tab.id
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          const direction =
                            event.key ===
                            'ArrowRight'
                              ? 1
                              : event.key ===
                                'ArrowLeft'
                              ? -1
                              : 0;


                          if (!direction) {
                            return;
                          }


                          event.preventDefault();


                          const next =
                            tabs[
                              (
                                index +
                                direction +
                                tabs.length
                              ) %
                                tabs.length
                            ].id;


                          setActive(next);


                          requestAnimationFrame(
                            () => {
                              document
                                .getElementById(
                                  `model-media-${project.slug}-${next}`
                                )
                                ?.focus();
                            }
                          );
                        }}
                      >

                        <span
                          className={
                            mediaStyles.mediaScope +
                            ' vv-media-tab-svg'
                          }
                          aria-hidden="true"
                        >
                          <TabIcon
                            name={tab.id}
                          />
                        </span>


                        <span
                          className={
                            mediaStyles.mediaScope +
                            ' e-n-tab-title-text'
                          }
                        >
                          {tab.label}
                        </span>

                      </button>
                    )
                  )}

                </div>
              </div>


              {/* CONTENT */}

              <div
                className={
                  mediaStyles.mediaScope +
                  ' e-n-tabs-content vv-media-content'
                }
              >

                <div
                  id={`model-panel-${project.slug}-${active}`}
                  role="tabpanel"
                  aria-labelledby={`model-media-${project.slug}-${active}`}
                  className={
                    mediaStyles.mediaScope +
                    ' elementor-element e-active e-con-full e-flex e-con e-child'
                  }
                >

                  {active ===
                    'photos' && (
                    <MediaCarousel
                      key={`${project.slug}-photos`}
                      items={photos}
                      title={
                        project.title
                      }
                    />
                  )}


                  {active ===
                    'plans' && (
                    <MediaCarousel
                      key={`${project.slug}-plans`}
                      items={plans}
                      title={
                        project.title
                      }
                      isPlan
                    />
                  )}


                  {active ===
                    'video' &&
                    (
                      hasVideo ? (
                        <div
                          className={
                            mediaStyles.mediaScope +
                            ' ' +
                            'elementor-element elementor-element-df017db elementor-widget elementor-widget-video vv-video-frame'
                          }
                        >

                          <div
                            className={
                              mediaStyles.mediaScope +
                              ' elementor-widget-container'
                            }
                          >

                            <div
                              className={
                                mediaStyles.mediaScope +
                                ' elementor-wrapper elementor-open-inline'
                              }
                            >

                              <iframe
                                className={
                                  mediaStyles.mediaScope
                                }
                                key={
                                  project.youtubeId
                                }
                                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0&modestbranding=1`}
                                title={`${project.title} video`}
                                loading="lazy"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                              />

                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={
                            mediaStyles.mediaScope +
                            ' vv-media-empty'
                          }
                        >
                          Video not available
                        </div>
                      )
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