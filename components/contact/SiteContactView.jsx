'use client';

import { useMemo, useState } from 'react';
import { SITE_CONTACT_DATA, TOTAL_SITES } from '@/data/site-contacts';
import styles from './SiteContactView.module.css';

function Icon({ name, size = 18 }) {
  const attrs = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round',
    strokeLinejoin: 'round', 'aria-hidden': true,
  };
  if (name === 'search') return <svg {...attrs}><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>;
  if (name === 'chevron') return <svg {...attrs}><path d="m6 9 6 6 6-6"/></svg>;
  if (name === 'pin') return <svg {...attrs}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  if (name === 'phone') return <svg {...attrs}><path d="M22 16.6v2.7a2.2 2.2 0 0 1-2.4 2.2A20.2 20.2 0 0 1 2.5 4.4 2.2 2.2 0 0 1 4.7 2h2.7a2 2 0 0 1 1.7l.5 2.9a2 2 0 0 1-.6 1.9L8 9.8a16.6 16.6 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 1.9-.6l2.9.5a2 2 0 0 1 1.7 2.2Z"/></svg>;
  if (name === 'mail') return <svg {...attrs}><rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="m3 6 9 7 9-7"/></svg>;
  if (name === 'user') return <svg {...attrs}><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
  if (name === 'arrow') return <svg {...attrs}><path d="M7 17 17 7M8 7h9v9"/></svg>;
  if (name === 'x') return <svg {...attrs}><path d="M5 5 19 19M19 5 5 19"/></svg>;
  return null;
}

function Phones({ value }) {
  if (!value) return null;
  const numbers = String(value).split(',').map((item) => item.trim()).filter(Boolean);
  return (
    <div className={styles.phoneList}>
      {numbers.map((display, index) => {
        const match = display.match(/^(\d{10})(?:\s*\/.*)?$/);
        return match ? (
          <a key={`${display}-${index}`} href={`tel:+91${match[1]}`}>{display}</a>
        ) : (
          <span key={`${display}-${index}`}>{display}</span>
        );
      })}
    </div>
  );
}

export function SiteCard({ site, city, state }) {
  const mapQuery = [site.address, city, state, 'India'].filter(Boolean).join(', ');
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardEyebrow}>Vastu Vihar project</span>
        <h4 className={styles.cardTitle}>{site.phase_name}</h4>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <span className={styles.detailIcon}><Icon name="pin"/></span>
          <p>{site.address}</p>
        </div>
        {site.phone && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="phone"/></span>
            <Phones value={site.phone}/>
          </div>
        )}
        {site.email && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="mail"/></span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        )}
        {site.contacts?.length > 0 && (
          <div className={styles.people}>
            {site.contacts.map((person, index) => (
              <div className={styles.person} key={`${person.name}-${index}`}>
                <span className={styles.detailIcon}><Icon name="user"/></span>
                <div>
                  <strong>{person.name}</strong>
                  <small>{person.role}</small>
                  {/^[0-9]{10}$/.test(person.phone)
                    ? <a href={`tel:+91${person.phone}`}>{person.phone}</a>
                    : <span>{person.phone}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <a className={styles.mapLink} href={mapUrl} target="_blank" rel="noopener noreferrer">
        View location <Icon name="arrow" size={17}/>
      </a>
    </article>
  );
}

export default function SiteContactView() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const cities = useMemo(() => {
    const matchingStates = SITE_CONTACT_DATA.filter((group) => !state || group.state === state);
    return [...new Set(matchingStates.flatMap((group) => group.branches.map((item) => item.city)))].sort();
  }, [state]);

  const groups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return SITE_CONTACT_DATA
      .filter((group) => !state || group.state === state)
      .map((group) => ({
        ...group,
        branches: group.branches
          .filter((branch) => !city || branch.city === city)
          .map((branch) => ({
            ...branch,
            phases: branch.phases.filter((site) => {
              if (!needle) return true;
              const text = [
                group.state, branch.city, site.phase_name, site.address,
                site.phone || '', site.email || '',
                ...(site.contacts || []).flatMap((person) => [person.name, person.role, person.phone]),
              ].join(' ').toLowerCase();
              return text.includes(needle);
            }),
          }))
          .filter((branch) => branch.phases.length > 0),
      }))
      .filter((group) => group.branches.length > 0);
  }, [search, state, city]);

  const results = groups.reduce((total, group) =>
    total + group.branches.reduce((sum, branch) => sum + branch.phases.length, 0), 0);
  const hasFilter = Boolean(search || state || city);
  const clearAll = () => { setSearch(''); setState(''); setCity(''); };

  return (
    <section className={styles.directory} aria-label="Search Vastu Vihar site contacts">
      <div className={styles.filters} role="search" aria-label="Site contact filters">
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-query">Search sites</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><Icon name="search" size={19}/></span>
            <input id="site-contact-query" className={styles.input} type="search"
              placeholder="Search project, location or contact"
              value={search} onChange={(event) => setSearch(event.target.value)}/>
            {search && <button className={styles.clearInput} type="button" aria-label="Clear search" onClick={() => setSearch('')}><Icon name="x" size={16}/></button>}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-state">State</label>
          <div className={styles.inputWrap}>
            <select id="site-contact-state" className={styles.select} value={state}
              onChange={(event) => { setState(event.target.value); setCity(''); }}>
              <option value="">All states</option>
              {SITE_CONTACT_DATA.map((group) => <option key={group.state} value={group.state}>{group.state}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="site-contact-city">City</label>
          <div className={styles.inputWrap}>
            <select id="site-contact-city" className={styles.select} value={city}
              onChange={(event) => setCity(event.target.value)}>
              <option value="">All cities</option>
              {cities.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
      </div>

      <div className={styles.resultsInfo} aria-live="polite">
        <p>Showing <strong>{results}</strong> of {TOTAL_SITES} sites</p>
        {hasFilter && <button type="button" className={styles.reset} onClick={clearAll}>Clear filters <Icon name="x" size={15}/></button>}
      </div>

      {groups.length > 0 ? (
        <div className={styles.results}>
          {groups.map((group) => (
            <section className={styles.stateSection} key={group.state} aria-label={group.state}>
              <div className={styles.stateHeading}>
                <h2>{group.state}</h2>
                <span>{group.branches.reduce((count, branch) => count + branch.phases.length, 0)} sites</span>
              </div>
              {group.branches.map((branch) => (
                <section className={styles.citySection} key={`${group.state}-${branch.city}`} aria-label={branch.city}>
                  <div className={styles.cityHeading}>
                    <h3>{branch.city}</h3>
                    <span>{branch.phases.length} {branch.phases.length === 1 ? 'project' : 'projects'}</span>
                  </div>
                  <div className={styles.cardGrid}>
                    {branch.phases.map((site, index) => (
                      <SiteCard key={`${site.phase_name}-${index}`} site={site} city={branch.city} state={group.state}/>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <Icon name="search" size={32}/>
          <h2>No matching sites found</h2>
          <p>Try another project name, city or state.</p>
          <button type="button" onClick={clearAll}>View all sites</button>
        </div>
      )}
    </section>
  );
}

