'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import styles from './price-list.module.css';
import heroStyles from './hero.module.css';

type Phase = { name: string; link: string };
type City = { name: string; phases: Phase[] };
type StateGroup = { state: string; cities: City[] };

const PRICE_LIST_DATA: StateGroup[] = [
  {
    state: 'Bihar',
    cities: [
      { name: 'Ara', phases: [{ name: 'Phase 02 Ext', link: '/price-list/ara-phase-02-ext' }, { name: 'Phase 04', link: '/price-list/ara-phase-4' }] },
      { name: 'Aurangabad', phases: [{ name: 'Phase 02', link: '/price-list/aurangabad-project-2' }, { name: 'Phase 04', link: '/price-list/aurangabad-project-4' }] },
      { name: 'Dehri on Sone', phases: [{ name: 'Phase 03', link: '/price-list/dehri-on-sone-project-3' }] },
      { name: 'Katihar', phases: [{ name: 'Phase 02', link: '/price-list/katihar-phase-2' }] },
      { name: 'Purnea', phases: [{ name: 'Phase 2 & 3', link: '/price-list/purnea-phase-2-3' }, { name: 'Phase 2 Flats', link: '/price-list/purnea-phase-2-flats' }, { name: 'Phase 4 Flats', link: '/price-list/purnea-phase-4-flats-1-3-bhk' }] },
      { name: 'Gaya', phases: [{ name: 'Phase 01', link: '/price-list/gaya-1' }] },
      { name: 'Patna', phases: [{ name: 'Phase 05', link: '/price-list/patna-5' }] },
      { name: 'Muzaffarpur', phases: [{ name: 'Phase 02', link: '/price-list/muz-2' }] },
    ],
  },
  {
    state: 'Jharkhand',
    cities: [
      { name: 'Bokaro', phases: [] },
      { name: 'Deoghar', phases: [] },
      { name: 'Dhanbad', phases: [] },
      { name: 'Ranchi', phases: [] },
    ],
  },
  {
    state: 'Odisha',
    cities: [
      { name: 'Bhubaneshwar', phases: [] },
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
  const projectCount = filteredData.reduce((n, group) => n + group.cities.reduce((m, city) => m + city.phases.length, 0), 0);

  const renderCard = (group: StateGroup, city: City, cityIndex: number) => {
    // Number resets to 01 for each state group
    const countStr = (cityIndex + 1).toString().padStart(2, '0');

    return (
      <article className={styles.cityCard} key={city.name}>
        <div className={styles.decorBorder}></div>
        {/* <div className={styles.cardCircle}>{countStr}</div> */}
        <div className={styles.cardCircle}>
          <span className={styles.circleNumber}>{countStr}</span>

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
          <span className={styles.cityState}>{group.state}</span>
          <h3 className={styles.cityName}>{city.name}</h3>

          {city.phases.length > 0 ? (
            <div className={styles.phaseGrid}>
              {city.phases.map((phase) => (
                <Link key={phase.link} href={phase.link} className={styles.phaseItem}>
                  <span>{phase.name}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.phaseEmpty}>
              <span>Upcoming Projects</span>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <PageLayout route="price-list">
      <main className={styles.page}>
        <section className={heroStyles.hero}>
          <div className={heroStyles.heroInner}>
            <h1>Price List</h1>
            <div className={heroStyles.heroBottom}>
              <nav className={heroStyles.breadcrumbs} aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true" />
                <strong>Price List</strong>
              </nav>
            </div>
          </div>
          <div className={heroStyles.heroCurve} />
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
          <div className={styles.projectsWrapper}>
            {filteredData.map((group) => (
              <section className={styles.projects} key={group.state}>
                <div className={styles.container}>
                  <div className={styles.sectionHead}>
                    <div>
                      <span className={styles.kicker}>Region</span>
                      <h2>{group.state}</h2>
                    </div>
                    <span className={styles.count}>{group.cities.length.toString().padStart(2, '0')} cities</span>
                  </div>

                  <div className={styles.cityGrid}>
                    {group.cities.map((city, index) => renderCard(group, city, index))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </PageLayout>
  );
}