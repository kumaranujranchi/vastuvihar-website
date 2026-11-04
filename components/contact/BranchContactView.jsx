'use client';
import { useEffect, useMemo, useState } from 'react';
import { BRANCH_GROUPS, TOTAL_BRANCHES } from '@/data/branch-contacts';
import ConsentEmbed from '@/components/privacy/ConsentEmbed';
import styles from './BranchContactView.module.css';
function Icon({ name, size = 18 }) {
  const a = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  };
  switch (name) {
    case 'search': return <svg {...a}><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>;
    case 'chevron': return <svg {...a}><path d="m6 9 6 6 6-6"/></svg>;
    case 'pin': return <svg {...a}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'phone': return <svg {...a}><path d="M22 16.6v2.7a2.2 2.2 0 0 1-2.4 2.2A20.2 20.2 0 0 1 2.5 4.4 2.2 2.2 0 0 1 4.7 2h2.7a2 2 0 0 1 2 1.7l.5 2.9a2 2 0 0 1-.6 1.9L8 9.8a16.6 16.6 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 1.9-.6l2.9.5a2 2 0 0 1 1.7 2.2Z"/></svg>;
    case 'mail': return <svg {...a}><rect x="2.5" y="4" width="19" height="16" rx="1"/><path d="m3 6 9 7 9-7"/></svg>;
    case 'user': return <svg {...a}><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
    case 'arrow': return <svg {...a}><path d="M7 17 17 7M8 7h9v9"/></svg>;
    case 'x': return <svg {...a}><path d="M5 5 19 19M19 5 5 19"/></svg>;
  case 'copy': return <svg {...a}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>;
  case 'check': return <svg {...a}><path d="m5 12 4 4L19 6"/></svg>;
  default: return null;
  }
}
async function copyToClipboard(text) {

  if (navigator.clipboard?.writeText) {

    try {

      await navigator.clipboard.writeText(text);

      return;

    } catch {

      // Fall back to the selection-based copy method.

    }

  }
  // Fallback for browsers where Clipboard API is unavailable.

  const input = document.createElement('textarea');

  input.value = text;

  input.setAttribute('readonly', '');

  input.style.position = 'fixed';

  input.style.opacity = '0';

  document.body.appendChild(input);

  input.select();
  try {

    if (!document.execCommand('copy')) {

      throw new Error('Unable to copy');

    }

  } finally {

    input.remove();

  }

}
function Phones({ phones }) {
  if (!phones?.length) return null;
  return (
    <div className={styles.phoneList}>
      {phones.map((phone, index) => {
        const clean = String(phone).replace(/[^\d]/g, '');
        return clean.length === 10 ? (
          <a key={`${phone}-${index}`} href={`tel:+91${clean}`}>{phone}</a>
        ) : (
          <span key={`${phone}-${index}`}>{phone}</span>
        );
      })}
    </div>
  );
}
function SplitPerson({ person }) {
  const match = person.name.match(/^(.+?)\s*\(([^()]+)\)\s*$/);
  const displayName = match ? match[1] : person.name;
  const role = match ? match[2] : '';
  return (
    <div className={styles.person}>
      <span className={styles.detailIcon}><Icon name="user" size={17}/></span>
      <div className={styles.personInfo}>
        <strong>{displayName}</strong>
        {role && <small>{role}</small>}
        <Phones phones={person.phones}/>
      </div>
    </div>
  );
}
export function BranchCard({ branch, state }) {
  const [showMap, setShowMap] = useState(false);

  const [copyStatus, setCopyStatus] = useState('');
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [branch.name, branch.address, state, 'India'].join(', ')
  )}`;
  const handleCopyLocation = async () => {

    try {

      await copyToClipboard(mapSearch);

      setCopyStatus('Location link copied');

    } catch {

      setCopyStatus('Could not copy location');

    }

  };
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardEyebrow}>Vastu Vihar branch</span>
        <h3 className={styles.cardTitle}>{branch.name}</h3>
      </div>
      <div className={styles.cardDetails}>
        <div className={styles.detail}>
          <span className={styles.detailIcon}><Icon name="pin"/></span>
          <p>{branch.address}</p>
        </div>
        {branch.email && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="mail"/></span>
            <a href={`mailto:${branch.email}`}>{branch.email}</a>
          </div>
        )}
        {branch.phones?.length > 0 && (
          <div className={styles.detail}>
            <span className={styles.detailIcon}><Icon name="phone"/></span>
            <Phones phones={branch.phones}/>
          </div>
        )}
        {branch.people?.length > 0 && (
          <div className={styles.people}>
            <span className={styles.peopleTitle}>Branch contacts</span>
            {branch.people.map((person, index) => (
              <SplitPerson key={`${person.name}-${index}`} person={person}/>
            ))}
          </div>
        )}
      </div>
      <div className={styles.cardActions}>
        <button type="button" className={styles.mapButton}
          onClick={() => setShowMap((value) => !value)} aria-expanded={showMap}
          aria-label={`${showMap ? 'Hide' : 'Show'} map for ${branch.name}`}>
          {showMap ? 'Hide map' : 'Show map'} <Icon name="chevron" size={16}/>
        </button>
        <a className={styles.mapLink} href={mapSearch} target="_blank" rel="noopener noreferrer">
          Directions <Icon name="arrow" size={17}/>
        </a>
        <button

          type="button"

          className={styles.copyButton}

          onClick={handleCopyLocation}

          title="Copy location link"

          aria-label={`Copy location of ${branch.name}`}

        >

          <Icon name={copyStatus === 'Location link copied' ? 'check' : 'copy'} size={19}/>

        </button>
      </div>
      {copyStatus && (

        <span className={styles.copyFeedback} role="status" aria-live="polite">

          {copyStatus}

        </span>

      )}
      {showMap && (
        <div className={styles.mapPanel}>
          <ConsentEmbed provider="Google Maps">
            <iframe title={`${branch.name} Vastu Vihar map`}
              src={branch.mapUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen />
          </ConsentEmbed>
        </div>
      )}
    </article>
  );
}
export default function BranchContactView() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [openState, setOpenState] = useState(BRANCH_GROUPS[0]?.state ?? null);
  const cities = useMemo(() => {
    const allowed = BRANCH_GROUPS.filter((g) => !state || g.state === state);
    return [...new Set(allowed.flatMap((g) => g.branches.map((b) => b.name)))].sort();
  }, [state]);
  const groups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return BRANCH_GROUPS
      .filter((group) => !state || group.state === state)
      .map((group) => ({
        ...group,
        branches: group.branches.filter((branch) => {
          if (city && branch.name !== city) return false;
          if (!needle) return true;
          const searchable = [
            group.state, branch.name, branch.address, branch.email || '',
            ...(branch.phones || []),
            ...(branch.people || []).flatMap((p) => [p.name, ...(p.phones || [])]),
          ].join(' ').toLowerCase();
          return searchable.includes(needle);
        }),
      }))
      .filter((group) => group.branches.length > 0);
  }, [search, state, city]);
  // Automatically expand the first matching state whenever filters change.
  // Manual toggles do not trigger this effect.
  useEffect(() => {
    setOpenState(groups[0]?.state ?? null);
  }, [groups]);

  const toggleState = (stateName) => {
    setOpenState((current) => current === stateName ? null : stateName);
  };

  const count = groups.reduce((sum, group) => sum + group.branches.length, 0);
  const filtered = Boolean(search || state || city);
  const clear = () => { setSearch(''); setState(''); setCity(''); };
  return (
    <section className={styles.directory} aria-label="Vastu Vihar branch contacts">
      <div className={styles.filters} role="search" aria-label="Branch contact filters">
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-search">Search branches</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}><Icon name="search" size={19}/></span>
            <input id="branch-search" type="search" className={styles.input}
              placeholder="Search city, team member, phone or address" value={search}
              onChange={(e) => setSearch(e.target.value)}/>
            {search && <button type="button" className={styles.clearInput}
              onClick={() => setSearch('')} aria-label="Clear search"><Icon name="x" size={16}/></button>}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-state">State</label>
          <div className={styles.inputWrap}>
            <select id="branch-state" className={styles.select} value={state}
              onChange={(e) => { setState(e.target.value); setCity(''); }}>
              <option value="">All states</option>
              {BRANCH_GROUPS.map((group) => (
                <option value={group.state} key={group.state}>{group.state}</option>
              ))}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="branch-city">City</label>
          <div className={styles.inputWrap}>
            <select id="branch-city" className={styles.select} value={city}
              onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {cities.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
            <span className={styles.selectIcon}><Icon name="chevron" size={16}/></span>
          </div>
        </div>
      </div>
      <div className={styles.resultsInfo} aria-live="polite">
        <p>Showing <strong>{count}</strong> of {TOTAL_BRANCHES} branches</p>
        {filtered && <button type="button" className={styles.reset} onClick={clear}>
          Clear filters <Icon name="x" size={15}/>
        </button>}
      </div>
      {groups.length ? (
        <div className={styles.results}>
          {groups.map((group) => {
          const isOpen = openState === group.state;
          const panelId = `branch-state-${group.state.toLowerCase().replace(/\s+/g, '-')}`;

          return (
            <section key={group.state} className={styles.stateSection} aria-label={group.state}>
              <button
                type="button"
                className={`${styles.stateHeading} ${styles.accordionTrigger}`}
                onClick={() => toggleState(group.state)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <h2>{group.state}</h2>
                <span>
                  {group.branches.length} {group.branches.length === 1 ? 'branch' : 'branches'}
                </span>
                <span
                  className={`${styles.accordionIcon} ${isOpen ? styles.accordionIconOpen : ''}`}
                  aria-hidden="true"
                >
                  <Icon name="chevron" size={20} />
                </span>
              </button>
              <div id={panelId} className={styles.accordionContent} hidden={!isOpen}>
                <div className={styles.cardGrid}>
                  {group.branches.map((branch) => (
                    <BranchCard
                      key={`${group.state}-${branch.name}`}
                      state={group.state}
                      branch={branch}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          <Icon name="search" size={32}/>
          <h2>No matching branches found</h2>
          <p>Try another city, name, telephone number or state.</p>
          <button type="button" onClick={clear}>View all branches</button>
        </div>
      )}
    </section>
  );
}
