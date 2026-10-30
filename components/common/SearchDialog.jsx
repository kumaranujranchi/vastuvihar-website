'use client';

import Link from 'next/link';

const localPath = (value) => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';

/** Search only the pages that actually ship in this website. */
export default function SearchDialog({ query, onQueryChange, searchIndex, onClose, fieldId }) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = terms.length ? searchIndex.filter((item) => terms.every((term) => `${item.title} ${item.type || ''} ${item.excerpt || ''}`.toLocaleLowerCase().includes(term))) : [];
  const results = matches.slice(0, 30);
  return (
    <>
      <label className="next-search-label" htmlFor={fieldId}>Search pages, projects and articles</label>
      <input id={fieldId} type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="What are you looking for?" autoComplete="off" />
      <p className="next-search-count" role="status">
        {!terms.length ? 'Type a title or keyword to search this site.' : matches.length ? `${matches.length} matching result${matches.length === 1 ? '' : 's'}${matches.length > 30 ? ' — showing the first 30' : ''}` : 'No matching results. Try a different keyword.'}
      </p>
      <ul className="next-search-results">
        {results.map((item) => (
          <li key={item.path}>
            <Link href={localPath(item.path)} onClick={onClose}>
              <span>{item.type || 'Page'}</span><strong>{item.title}</strong>
              {item.excerpt && <p>{item.excerpt.slice(0, 170)}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
