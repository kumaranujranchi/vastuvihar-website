'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
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
      { name: 'Banka', phases: [] },
      // { name: 'Begusarai', phases: [] },
      // { name: 'Bettiah', phases: [] },
      // { name: 'Bhagalpur', phases: [] },
      // { name: 'Buxor', phases: [] },
      // { name: 'Chhapra', phases: [] },
      // { name: 'Biharsarif', phases: [] },

      { name: 'Darbhanga', phases: [] },
      { name: 'Dehri on Sone', phases: [{ name: 'Phase 03', link: '/price-list/dehri-on-sone-project-3' }] },

      { name: 'Gaya', phases: [] },
      // { name: 'Hajipur', phases: [] },
      { name: 'Jehanabad', phases: [] },
      { name: 'Katihar', phases: [{ name: 'Phase 02', link: '/price-list/katihar-phase-2' }, { name: 'Phase 04', link: '/price-list/katihar-phase-4' }] },

      // { name: 'Madhubani', phases: [] },

      // { name: 'Motihari', phases: [] },
      // { name: 'Munger', phases: [] },
      // { name: 'Muzzafarpur', phases: [] },

      // { name: 'Patna', phases: [] },
      // { name: 'Purnea', phases: [] },
      // { name: 'Raxaul', phases: [] },
      // { name: 'Saharsa', phases: [] },
      // { name: 'Samastipur', phases: [] },
      // { name: 'Sasaram', phases: [] },
      // { name: 'Sitamarhi', phases: [] },
      // { name: 'Siwan', phases: [] },
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isSearching = searchQuery.trim().length > 0;

  const filteredData = useMemo(() => {
    if (!isSearching) return PRICE_LIST_DATA;
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
  }, [searchQuery, isSearching]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (filteredData.length === 0 || isSearching) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const sections = gsap.utils.toArray(`.${styles.projects}`);

      sections.forEach((section: any) => {
        const grid = section.querySelector(`.${styles.cityGrid}`);

        ScrollTrigger.create({
          trigger: section,
          pin: true,
          pinSpacing: false,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`,
          invalidateOnRefresh: true,
        });

        gsap.to(grid, {
          x: () => -(grid.scrollWidth * 0.25),
          y: () => -(grid.scrollHeight * 0.5),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, [filteredData, isSearching]);

  const cityCount = filteredData.reduce((n, group) => n + group.cities.length, 0);
  const projectCount = filteredData.reduce((n, group) => n + group.cities.reduce((m, city) => m + city.phases.length, 0), 0);

  const renderCard = (group: StateGroup, city: City) => (
    <article className={styles.cityCard} key={city.name}>
      <div className={styles.decorBorder}></div>
      <div className={styles.cardCircle}>{city.name.charAt(0).toUpperCase()}</div>

      <div className={styles.cardContent}>
        <h3 className={styles.cityName}>{city.name}</h3>

        {city.phases.length > 0 && (
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
        )}
      </div>
    </article>
  );

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
        ) : isSearching ? (
          <div className={styles.staticWrapper}>
            {filteredData.map((group) => (
              <section className={styles.staticProjects} key={group.state}>
                <div className={styles.container}>
                  <div className={styles.staticSectionHead}>
                    <div>
                      <span className={styles.kicker}>Region</span>
                      <h2>{group.state}</h2>
                    </div>
                    <span className={styles.count}>{group.cities.length.toString().padStart(2, '0')} cities</span>
                  </div>
                  <div className={styles.staticCityGrid}>
                    {group.cities.map((city) => renderCard(group, city))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div ref={wrapperRef} className={styles.stackingWrapper}>
            {filteredData.map((group, groupIndex) => (
              <section
                className={styles.projects}
                key={group.state}
                style={{ zIndex: groupIndex + 1 }}
              >
                <div className={styles.container}>
                  <div className={styles.sectionHead}>
                    <div>
                      <span className={styles.kicker}>Region</span>
                      <h2>{group.state}</h2>
                    </div>
                    <span className={styles.count}>{group.cities.length.toString().padStart(2, '0')} cities</span>
                  </div>

                  <div className={styles.cityGridWrapper}>
                    <div className={styles.cityGrid}>
                      {group.cities.map((city) => renderCard(group, city))}
                    </div>
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