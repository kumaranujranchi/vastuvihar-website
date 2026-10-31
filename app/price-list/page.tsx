'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import styles from './price-list.module.css';

type Phase = { name: string; link: string };
type City = { name: string; image?: string; phases: Phase[] };
type StateGroup = { state: string; cities: City[] };

const PRICE_LIST_DATA: StateGroup[] = [
  {
    state: 'Bihar',
    cities: [
      {
        name: 'Ara',
        image: '/cities/ara.webp',
        phases: [
          { name: 'Phase 02 Ext', link: '/price-list/ara-phase-02-ext' },
          { name: 'Phase 04', link: '/price-list/ara-phase-4' },
        ],
      },
      {
        name: 'Aurangabad',
        image: '/cities/aurangabad.webp',
        phases: [
          { name: 'Phase 02', link: '/price-list/aurangabad-project-2' },
          { name: 'Phase 04', link: '/price-list/aurangabad-project-4' },
        ],
      },
      {
        name: 'Dehri on Sone',
        image: '/cities/dehri-on-sone.webp',
        phases: [
          { name: 'Phase 03', link: '/price-list/dehri-on-sone-project-3' },
        ],
      },
      {
        name: 'Katihar',
        image: '/cities/katihar.png',
        phases: [{ name: 'Phase 02', link: '/price-list/katihar-phase-2' }],
      },
      {
        name: 'Purnea',
        image: '/cities/purnea.png',
        phases: [
          { name: 'Phase 2 & 3', link: '/price-list/purnea-phase-2-3' },
          { name: 'Phase 2 Flats', link: '/price-list/purnea-phase-2-flats' },
          { name: 'Phase 4 Flats (1 & 3 BHK)', link: '/price-list/purnea-phase-4-flats-1-3-bhk' },
          { name: 'Phase 4 Flats (2 BHK)', link: '/price-list/purnea-phase-4-flats-2-bhk' },
          { name: 'Phase 4 Bungalows', link: '/price-list/purnea-phase-4-bungalows' },
          { name: 'Phase 4 01 Ext Flats', link: '/price-list/purnea-phase-4-01-ext-flats' },
          { name: 'Phase 4 01 Ext Bungalows', link: '/price-list/purnea-phase-4-01-ext-bungalows' },
        ],
      },
    ],
  },
];

export default function PriceListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return PRICE_LIST_DATA;
    const lowerQuery = searchQuery.toLowerCase();

    return PRICE_LIST_DATA.map((group) => {
      const stateMatch = group.state.toLowerCase().includes(lowerQuery);

      const filteredCities = group.cities.filter((city) => {
        if (stateMatch) return true;
        if (city.name.toLowerCase().includes(lowerQuery)) return true;
        if (city.phases.some((p) => p.name.toLowerCase().includes(lowerQuery))) return true;
        return false;
      });

      return { ...group, cities: filteredCities };
    }).filter((group) => group.cities.length > 0);
  }, [searchQuery]);

  const cityCount = filteredData.reduce((n, group) => n + group.cities.length, 0);
  const projectCount = filteredData.reduce(
    (n, group) => n + group.cities.reduce((m, city) => m + city.phases.length, 0),
    0
  );

  return (
    <PageLayout route="price-list">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>Price List</h1>

            <div className={styles.heroBottom}>
              <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true" />
                <strong>Price List</strong>
              </nav>
            </div>
          </div>
          <div className={styles.heroCurve} />
        </section>

        <section className={styles.intro}>
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <div>
                <span className={styles.kicker}>Current availability</span>
                <h2>Choose your city and project phase</h2>
              </div>

              <div className={styles.introCopy}>
                <div className={styles.searchBox}>

                  <input
                    type="text"
                    placeholder="Search by city or project..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>

                <div className={styles.stats}>
                  <div><strong>{filteredData.length}</strong><span>State</span></div>
                  <div><strong>{cityCount}</strong><span>Cities</span></div>
                  <div><strong>{projectCount}</strong><span>Projects</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {filteredData.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No results found for &quot;{searchQuery}&quot;</h3>
            <p>Try searching for a different city or phase.</p>
          </div>
        ) : (
          filteredData.map((group) => (
            <section className={styles.projects} key={group.state}>
              <div className={styles.container}>
                <div className={styles.sectionHead}>
                  <div>
                    <span className={styles.kicker}>Region</span>
                    <h2>{group.state}</h2>
                  </div>
                  <span className={styles.count}>
                    {group.cities.length.toString().padStart(2, '0')} cities
                  </span>
                </div>

                <div className={styles.cityGrid}>
                  {group.cities.map((city, index) => (
                    <article className={styles.cityCard} key={city.name}>
                      <div
                        className={styles.cityImage}
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.7) 100%), url("${city.image || '/images/about-bc.jpeg'}")`,
                        }}
                      >
                        <span className={styles.cardNumber}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>

                        <div className={styles.cityHeader}>
                          <span className={styles.cityState}>{group.state}</span>
                          <h3>{city.name}</h3>
                        </div>
                      </div>

                      <div className={styles.phaseList}>
                        {city.phases.map((phase) => (
                          <Link key={phase.link} href={phase.link} className={styles.phaseLink}>
                            <span>{phase.name}</span>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 10L10 2M10 2H4M10 2V8"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}

        <section className={styles.notice}>
          <div className={styles.container}>
            <div className={styles.noticeBox}>
              <span className={styles.noticeIcon}>i</span>
              <div>
                <h3>Price information</h3>
                <p>
                  Prices, taxes, additional charges and availability are subject
                  to the terms shown on each individual project page.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}