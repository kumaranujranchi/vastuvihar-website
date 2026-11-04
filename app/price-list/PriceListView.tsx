
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import styles from './price-list.module.css';
import heroStyles from './hero.module.css';

type Phase = {
  name: string;
  link: string;
};

type City = {
  name: string;
  phases: Phase[];
};

type StateGroup = {
  state: string;
  cities: City[];
};

const PRICE_LIST_DATA: StateGroup[] = [
  {
    state: 'Bihar',
    cities: [
      { name: 'Ara', phases: [{ name: 'Phase 02 Ext', link: '/price-list/ara-phase-02-ext/' }, { name: 'Phase 04', link: '/price-list/ara-phase-4/' }] },
      { name: 'Aurangabad', phases: [{ name: 'Phase 02', link: '/price-list/aurangabad-project-2/' }, { name: 'Phase 04', link: '/price-list/aurangabad-project-4/' }] },
      { name: 'Dehri on Sone', phases: [{ name: 'Phase 03', link: '/price-list/dehri-on-sone-project-3/' }] },
      { name: 'Katihar', phases: [{ name: 'Phase 02', link: '/price-list/katihar-phase-2/' }] },
      { name: 'Purnea', phases: [{ name: 'Phase 2 & 3', link: '/price-list/purnea-phase-2-3/' }, { name: 'Phase 2 Flats', link: '/price-list/purnea-phase-2-flats/' }, { name: 'Phase 4 Flats (1 & 3 BHK)', link: '/price-list/purnea-phase-4-flats-1-3-bhk/' }, { name: 'Phase 4 Flats (2 BHK)', link: '/price-list/purnea-phase-4-flats-2-bhk/' }, { name: 'Phase 4 Bungalows', link: '/price-list/purnea-phase-4-bungalows/' }, { name: 'Phase 4, 01 Ext. Flats', link: '/price-list/purnea-phase-4-01-ext-flats/' }, { name: 'Phase 4, 01 Ext. Bungalows', link: '/price-list/purnea-phase-4-01-ext-bungalows/' }] },
      { name: 'Gaya', phases: [] },
      { name: 'Patna', phases: [] },
      { name: 'Muzaffarpur', phases: [] },
      { name: 'Banka', phases: [] },
      { name: 'Begusarai', phases: [] },
      { name: 'Bettiah', phases: [] },
      { name: 'Bhagalpur', phases: [] },
      { name: 'Buxar', phases: [] },
      { name: 'Chhapra', phases: [] },
      { name: 'Biharsarif', phases: [] },
      { name: 'Darbhanga', phases: [] },
      { name: 'Hajipur', phases: [] },
      { name: 'Jehanabad', phases: [] },
      { name: 'Madhubani', phases: [] },
      { name: 'Motihari', phases: [] },
      { name: 'Munger', phases: [] },
      { name: 'Saharsa', phases: [] },
      { name: 'Samastipur', phases: [] },
      { name: 'Sasaram', phases: [] },
      { name: 'Raxaul', phases: [] },
      { name: 'Siwan', phases: [] },
      { name: 'Sitamarhi', phases: [] },
    ],
  },
  {
    state: 'Jharkhand',
    cities: [
      { name: 'Bokaro', phases: [] },
      { name: 'Deoghar', phases: [] },
      { name: 'Dhanbad', phases: [] },
      { name: 'Giridih', phases: [] },
      { name: 'Hazaribagh', phases: [] },
      { name: 'Ranchi', phases: [] },
      { name: 'Jamshedpur', phases: [] },
    ],
  },
  {
    state: 'West Bengal',
    cities: [
      { name: 'Alipurduar', phases: [] },
      { name: 'Asansol', phases: [] },
      { name: 'Durgapur', phases: [] },
      { name: 'Kolkata', phases: [] },
      { name: 'Siliguri', phases: [] },
    ],
  },
  {
    state: 'Uttar Pradesh',
    cities: [
      { name: 'Gorakhpur', phases: [] },
      { name: 'Mirzapur', phases: [] },
      { name: 'Varanasi', phases: [] },
    ],
  },
  {
    state: 'Odisha',
    cities: [
      { name: 'Bhubaneshwar', phases: [] },
      { name: 'Rourkela', phases: [] },
    ],
  },
];

export default function PriceListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openState, setOpenState] = useState<string | null>('Bihar');

  // Filter states, cities and project phases.
  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (!lowerQuery) {
      return PRICE_LIST_DATA;
    }

    return PRICE_LIST_DATA.map((group) => {
      const stateMatch = group.state
        .toLowerCase()
        .includes(lowerQuery);

      const filteredCities = group.cities.filter((city) => {
        if (stateMatch) return true;

        if (city.name.toLowerCase().includes(lowerQuery)) {
          return true;
        }

        if (
          city.phases.some((phase) =>
            phase.name.toLowerCase().includes(lowerQuery)
          )
        ) {
          return true;
        }

        return false;
      });

      return {
        ...group,
        cities: filteredCities,
      };
    }).filter((group) => group.cities.length > 0);
  }, [searchQuery]);

  // Automatically open the first matching state when searching.
  useEffect(() => {
    if (searchQuery.trim()) {
      setOpenState(filteredData[0]?.state ?? null);
    } else {
      setOpenState('Bihar');
    }
  }, [searchQuery, filteredData]);

  // Keep only one accordion expanded at a time.
  const toggleState = (state: string) => {
    setOpenState((current) =>
      current === state ? null : state
    );
  };

  const cityCount = filteredData.reduce(
    (total, group) => total + group.cities.length,
    0
  );

  const renderCard = (
    group: StateGroup,
    city: City,
    cityIndex: number
  ) => {
    const countStr = (cityIndex + 1)
      .toString()
      .padStart(2, '0');

    return (
      <article
        className={styles.cityCard}
        key={`${group.state}-${cityIndex}-${city.name}`}
      >
        <div className={styles.decorBorder}></div>

        <div className={styles.cardCircle}>
          <span className={styles.circleNumber}>
            {countStr}
          </span>

          <svg
            className={styles.locationIcon}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>

        <div className={styles.cardContent}>
          <span className={styles.cityState}>
            {group.state}
          </span>

          <h3 className={styles.cityName}>
            {city.name}
          </h3>

          {city.phases.length > 0 ? (
            <div className={styles.phaseGrid}>
              {city.phases.map((phase) => (
                <Link
                  key={phase.link}
                  href={phase.link}
                  className={styles.phaseItem}
                >
                  <span>{phase.name}</span>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line
                      x1="7"
                      y1="17"
                      x2="17"
                      y2="7"
                    />
                    <polyline
                      points="7 7 17 7 17 17"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <Link href="/contact/" className={styles.phaseEmpty}>
              <span>Contact us for prices</span>
            </Link>
          )}
        </div>
      </article>
    );
  };

  return (
    <PageLayout route="price-list">
      <main className={styles.page}>

        {/* HERO SECTION */}
        <section className={heroStyles.hero}>
          <div className={heroStyles.heroInner}>
            <h1>Price List</h1>

            <div className={heroStyles.heroBottom}>
              <nav
                className={heroStyles.breadcrumbs}
                aria-label="Breadcrumb"
              >
                <Link href="/">Home</Link>

                <span aria-hidden="true" />

                <strong>Price List</strong>
              </nav>
            </div>
          </div>

          <div className={heroStyles.heroCurve} />
        </section>

        {/* INTRO SECTION */}
        <section className={styles.intro}>
          <div className={styles.container}>
            <div className={styles.introGrid}>

              <div>
                <span className={styles.kicker}>
                  Current availability
                </span>

                <h2>
                  Choose your city and project phase
                </h2>
              </div>

              <div className={styles.introCopy}>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Search by city or project..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    aria-label="Search cities and projects"
                  />

                  <svg
                    className={styles.searchIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                    />

                    <line
                      x1="21"
                      y1="21"
                      x2="16.65"
                      y2="16.65"
                    />
                  </svg>
                </div>

                <div className={styles.stats}>
                  <div>
                    <strong>
                      {filteredData.length}
                    </strong>
                    <span>State</span>
                  </div>

                  <div>
                    <strong>
                      {cityCount}
                    </strong>
                    <span>Cities</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* RESULTS */}
        {filteredData.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>
              No results found for &quot;
              {searchQuery}
              &quot;
            </h3>

            <p>
              Try searching for a different city or phase.
            </p>
          </div>
        ) : (
          <div className={styles.projectsWrapper}>

            {filteredData.map((group) => {
              const isOpen = openState === group.state;

              const accordionId = `state-${group.state
                .toLowerCase()
                .replace(/\s+/g, '-')}`;

              return (
                <section
                  className={`${styles.projects} ${
                    isOpen ? styles.projectsOpen : styles.projectsClosed
                  }`}
                  key={group.state}
                >
                  <div className={styles.container}>

                    {/* ACCORDION HEADER */}
                    <button
                      type="button"
                      className={`${styles.sectionHead} ${styles.accordionTrigger}`}
                      onClick={() =>
                        toggleState(group.state)
                      }
                      aria-expanded={isOpen}
                      aria-controls={accordionId}
                    >
                      <div className={styles.accordionTitle}>
                        <span className={styles.kicker}>
                          Region
                        </span>

                        <h2>{group.state}</h2>
                      </div>

                      <div className={styles.accordionRight}>
                        <span className={styles.count}>
                          {group.cities.length
                            .toString()
                            .padStart(2, '0')}{' '}
                          cities
                        </span>

                        <span
                          className={`${styles.accordionIcon} ${
                            isOpen
                              ? styles.accordionIconOpen
                              : ''
                          }`}
                          aria-hidden="true"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {/* ACCORDION CONTENT */}
                    <div
                      id={accordionId}
                      className={styles.accordionContent}
                      hidden={!isOpen}
                    >
                      <div className={styles.cityGrid}>
                        {group.cities.map((city, index) =>
                          renderCard(
                            group,
                            city,
                            index
                          )
                        )}
                      </div>
                    </div>

                  </div>
                </section>
              );
            })}

          </div>
        )}

      </main>
    </PageLayout>
  );
}
