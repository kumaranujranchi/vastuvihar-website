import React from 'react';

// Shared township amenities for every Vastu Vihar model.
// Keep these in one place; individual model records do not duplicate them.
export const AMENITIES_DATA = [
  {
    id: 'security',
    name: '24/7 Security',
    tag: 'Guarded & CCTV',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    id: 'kids-play',
    name: 'Kids Play Area',
    tag: 'Safe & Vibrant',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 20h18" />
        <path d="M5 20l4-12h6l4 12" />
        <circle cx="12" cy="5" r="2.5" />
        <path d="M8 15h8" />
      </svg>
    ),
  },
  {
    id: 'multipurpose-hall',
    name: 'Multipurpose Hall',
    tag: 'Events & Club',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M5 21V9l7-5 7 5v12" />
        <path d="M9 21V13h6v8" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'shopping',
    name: 'Shopping Complex',
    tag: 'Daily Convenience',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'swimming-pool',
    name: 'Swimming Pool',
    tag: 'Crystal Clear',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 13c1.5-1 3.5-1 5 0 2 1.5 4 1.5 6 0 2-1.5 4-1.5 6 0 1.5 1 3.5 1 5 0" />
        <path d="M2 18c1.5-1 3.5-1 5 0 2 1.5 4 1.5 6 0 2-1.5 4-1.5 6 0 1.5 1 3.5 1 5 0" />
        <circle cx="16" cy="6" r="2.5" />
        <path d="M10 9.5l3-2 3.5 1.5-1.5 3" />
      </svg>
    ),
  },
  {
    id: 'water-supply',
    name: 'Water Supply',
    tag: '24/7 Treated Water',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        <path d="M12 9a3 3 0 0 1 3 3" />
      </svg>
    ),
  },
  {
    id: 'garden',
    name: 'Garden',
    tag: 'Landscaped Greens',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22v-8" />
        <path d="M12 14c-3.5 0-6-2.5-6-6 4 0 6 2.5 6 6z" />
        <path d="M12 14c3.5 0 6-2.5 6-6-4 0-6 2.5-6 6z" />
        <path d="M9 22h6" />
      </svg>
    ),
  },
  {
    id: 'temple',
    name: 'Temple',
    tag: 'Peace & Spirituality',
    icon: (
      <svg
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
        <path d="M4 21h16" />
        <path d="M6 21v-8h12v8" />
        <path d="M8 13V9h8v4" />
        <path d="M10 9V6h4v3" />
        <path d="M12 6V2" />
        <path d="M10 4h4" />
        <path d="M9 21v-5h6v5" />
      </svg>
    ),
  },
];
