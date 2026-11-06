'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import styles from './CityProjects.module.css';

export type CityModel = {
  slug: string;
  image: string;
  title: string;
  price: string;
  bhk: number;
  area?: string;
};

export type CityPhase = {
  id: string;
  label: string;
  location: string;
  heading: string;
  description: string;
  siteAddress: string;
  email: string;
  phone: string;
  rera: string;
  masterPlan: string | null;
  models: CityModel[];
};

export type CityData = {
  slug: string;
  name: string;
  state: string;
  phases: CityPhase[];
};

function LocationIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.7" />
    </svg>
  );
}

function HomeIcon({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 22 20-16 20 16v20H4V22Z" />
      <path d="M17 42V28h14v14M11 25h5m16 0h5" />
    </svg>
  );
}

function ArrowIcon({ left = false }: { left?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={left ? 'M19 12H5m7-7-7 7 7 7' : 'M5 12h14m-7-7 7 7-7 7'} />
    </svg>
  );
}

function ModelCard({ model }: { model: CityModel }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className={styles.modelCard}>
      <Link
        href={`/projects/${model.slug}/`}
        prefetch={false}
        className={styles.modelLink}
        aria-label={`View ${model.title}`}
      >
        {/* Project-style-2 thumbnail: card height is 122% of its width. */}
        <div className={styles.modelMedia}>
          {model.image && !imageFailed ? (
            <Image
              src={model.image}
              alt={model.title}
              fill
              sizes="(max-width: 560px) 76vw, (max-width: 820px) 46vw, (max-width: 1060px) 29vw, 23vw"
              className={styles.modelPhoto}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={styles.modelFallback} aria-hidden="true">
              <HomeIcon size={54} />
              <span>VASTU VIHAR</span>
            </div>
          )}

          {/* Price pill in the upper-left corner, as in /projects/. */}
          <span className={styles.modelPriceBadge}>{model.price}</span>

          {/* Bottom gradient overlay: pin, BHK/area, rule and title. */}
          <div className={styles.modelContent}>
            <div className={styles.modelMeta}>
              <LocationIcon size={18} />
              <span>{model.bhk} BHK</span>
              {model.area && (
                <>
                  <span className={styles.modelMetaDot} aria-hidden="true">·</span>
                  <span>{model.area}</span>
                </>
              )}
            </div>
            <span className={styles.modelDivider} aria-hidden="true" />
            <h4 className={styles.modelTitle}>{model.title}</h4>
          </div>
        </div>
      </Link>
    </article>
  );
}

function MasterPlan({ phase, city }: { phase: CityPhase; city: CityData }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPlan = Boolean(phase.masterPlan) && !imageFailed;

  return (
    <aside className={styles.planCard} aria-label={`${phase.label} master plan`}>
      <div className={styles.planTop}>
        <h3>Master Plan</h3>
        {showPlan && (
          <a
            href={phase.masterPlan!}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewPlan}
          >
            Full view <span aria-hidden="true">&#8599;</span>
          </a>
        )}
      </div>

      {showPlan ? (
        <a
          className={styles.planImage}
          href={phase.masterPlan!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${city.name} ${phase.label} master plan`}
        >
          <Image
            src={phase.masterPlan!}
            alt={`${city.name} ${phase.label} master plan`}
            fill
            sizes="(max-width: 850px) 92vw, 520px"
            className={styles.planPhoto}
            onError={() => setImageFailed(true)}
          />
        </a>
      ) : (
        <div className={styles.planEmpty}>
          <HomeIcon size={52} />
          <strong>Master plan coming soon</strong>
          <p>The plan for this phase has not been uploaded yet.</p>
        </div>
      )}
    </aside>
  );
}

export default function CityProjects({ city }: { city: CityData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>(
    'forward'
  );
  const [hasChangedPhase, setHasChangedPhase] = useState(false);
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const phaseScroller = useRef<HTMLDivElement>(null);
  const phaseTrack = useRef<HTMLDivElement>(null);
  const phaseButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const modelsScroller = useRef<HTMLDivElement>(null);

  const activePhase = city.phases[activeIndex];
  const panelId = `city-phase-panel-${city.slug}`;

  // Only the light active-tab background moves. The panel background never moves.
  useEffect(() => {
    const button = phaseButtons.current[activeIndex];
    const track = phaseTrack.current;
    if (!button || !track) return;

    const measure = () => {
      setIndicator({
        x: button.offsetLeft,
        width: button.offsetWidth,
        ready: true,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(button);
    observer.observe(track);
    return () => observer.disconnect();
  }, [activeIndex, city.slug]);

  const measureCarousel = useCallback(() => {
    const scroller = modelsScroller.current;
    if (!scroller) return;

    const left = scroller.scrollLeft > 2;
    const right =
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2;

    setCanScroll((old) =>
      old.left === left && old.right === right ? old : { left, right }
    );
  }, []);

  useEffect(() => {
    const scroller = modelsScroller.current;
    if (!scroller) return;

    measureCarousel();
    const observer = new ResizeObserver(measureCarousel);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [activeIndex, measureCarousel]);

  if (!activePhase) return null;

  const selectPhase = (next: number) => {
    if (next === activeIndex || next < 0 || next >= city.phases.length) return;

    setSlideDirection(next > activeIndex ? 'forward' : 'backward');
    setHasChangedPhase(true);
    setActiveIndex(next);

    // Only scroll the tab strip if the selected tab is clipped on mobile.
    // There is no scroll animation on the page/window.
    const viewport = phaseScroller.current;
    const button = phaseButtons.current[next];
    if (viewport && button) {
      const buttonStart = button.offsetLeft;
      const buttonEnd = buttonStart + button.offsetWidth;
      const visibleStart = viewport.scrollLeft;
      const visibleEnd = visibleStart + viewport.clientWidth;

      if (buttonStart < visibleStart || buttonEnd > visibleEnd) {
        viewport.scrollTo({
          left: Math.max(
            0,
            buttonStart - (viewport.clientWidth - button.offsetWidth) / 2
          ),
          behavior: 'smooth',
        });
      }
    }
  };

  const onTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = city.phases.length - 1;
    let next = activeIndex;

    if (event.key === 'ArrowRight') {
      next = activeIndex === last ? 0 : activeIndex + 1;
    } else if (event.key === 'ArrowLeft') {
      next = activeIndex === 0 ? last : activeIndex - 1;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    selectPhase(next);
    phaseButtons.current[next]?.focus();
  };

  const scrollModels = (direction: -1 | 1) => {
    const scroller = modelsScroller.current;
    if (!scroller) return;

    const firstCard = scroller.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 285;
    const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 18;

    scroller.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  return (
    <section className={styles.section} aria-label={`${city.name} projects`}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.locationHeading}>
            <span className={styles.locationIcon}>
              <LocationIcon />
            </span>
            <div>
              <span className={styles.eyebrow}>OUR PROJECT LOCATIONS</span>
              <h2>
                {city.name}, {city.state}
              </h2>
            </div>
          </div>
          <p>{city.phases.length} project phases</p>
        </div>

        {/* No background for inactive tabs; active background connects to panel. */}
        <div className={styles.tabsSticky}>
          <div className={styles.tabsViewport} ref={phaseScroller}>
            <div
              className={styles.tabsTrack}
              ref={phaseTrack}
              role="tablist"
              aria-label={`${city.name} project phases`}
              onKeyDown={onTabKeys}
            >
              <span
                className={styles.activeIndicator}
                aria-hidden="true"
                style={{
                  width: indicator.width,
                  transform: `translate3d(${indicator.x}px, 0, 0)`,
                  opacity: indicator.ready ? 1 : 0,
                }}
              />
              {city.phases.map((phase, index) => (
                <button
                  key={phase.id}
                  ref={(node) => {
                    phaseButtons.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`city-tab-${city.slug}-${phase.id}`}
                  aria-selected={index === activeIndex}
                  aria-controls={panelId}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={`${styles.tabButton} ${index === activeIndex ? styles.tabActive : ''
                    }`}
                  onClick={() => selectPhase(index)}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The background remains fixed when changing phases. */}
        <div
          id={panelId}
          className={styles.phaseSurface}
          role="tabpanel"
          aria-labelledby={`city-tab-${city.slug}-${activePhase.id}`}
          tabIndex={0}
        >
          {/* ONLY the phase content slides, after a user clicks a new tab. */}
          <div
            key={`${city.slug}-${activePhase.id}`}
            className={styles.phaseContent}
            data-direction={slideDirection}
            data-animate={hasChangedPhase ? 'true' : 'false'}
          >
            <div className={styles.contentGrid}>
              <div className={styles.details}>
                {/* <span className={styles.eyebrow}>
                  PROJECT OVERVIEW / {activePhase.label}
                </span> */}
                <div className={styles.phaseLocality}>
                  <LocationIcon size={16} />
                  <span>{activePhase.location}</span>
                </div>
                <h2 className={styles.phaseTitle}>{activePhase.heading}</h2>
                <p className={styles.description}>{activePhase.description}</p>

                <div className={styles.locationCard}>
                  <span className={styles.addressIcon}>
                    <LocationIcon size={21} />
                  </span>
                  <div>
                    <span className={styles.detailLabel}>Project location</span>
                    <address>{activePhase.siteAddress}</address>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.detailLabel}>Email</span>
                    <a href={`mailto:${activePhase.email}`}>
                      {activePhase.email}
                    </a>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.detailLabel}>Contact</span>
                    <span>{activePhase.phone}</span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.infoWide}`}>
                    <span className={styles.detailLabel}>RERA / Approval</span>
                    <span>{activePhase.rera}</span>
                  </div>
                </div>
              </div>

              <MasterPlan
                key={`${city.slug}-${activePhase.id}`}
                phase={activePhase}
                city={city}
              />
            </div>

            <div className={styles.modelsHeading}>
              <div>
                <span className={styles.eyebrow}>EXPLORE OUR HOMES</span>
                <h3>Models in {activePhase.label}</h3>
                <p>{activePhase.models.length} residential models</p>
              </div>
              {activePhase.models.length > 0 && (
                <div className={styles.carouselButtons}>
                  <button
                    type="button"
                    className={styles.carouselArrow}
                    disabled={!canScroll.left}
                    onClick={() => scrollModels(-1)}
                    aria-label="Scroll models left"
                  >
                    <ArrowIcon left />
                  </button>
                  <button
                    type="button"
                    className={styles.carouselArrow}
                    disabled={!canScroll.right}
                    onClick={() => scrollModels(1)}
                    aria-label="Scroll models right"
                  >
                    <ArrowIcon />
                  </button>
                </div>
              )}
            </div>

            {activePhase.models.length > 0 ? (
              <div
                ref={modelsScroller}
                className={styles.modelScroller}
                onScroll={measureCarousel}
                role="region"
                tabIndex={0}
                aria-label={`${activePhase.label} model carousel`}
              >
                {activePhase.models.map((model, index) => (
                  <ModelCard
                    key={`${activePhase.id}-${model.slug}-${index}`}
                    model={model}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.noModels}>Models will be added soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
