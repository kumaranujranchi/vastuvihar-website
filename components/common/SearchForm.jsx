'use client';

import './SearchForm.css';
export default function SearchForm({ children, className = '', ...props }) {
  return (
    <form {...props} className={`${className} next-search-form`} role="search" onSubmit={(event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const query = String(data.get('s') || data.get('search') || data.get('q') || '').trim();
      window.dispatchEvent(new CustomEvent('spaciaz:search', { detail: { query } }));
    }}>{children}</form>
  );
}
