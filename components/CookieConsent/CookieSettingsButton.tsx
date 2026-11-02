'use client';

// src/components/CookieConsent/CookieSettingsButton.tsx
import React from 'react';

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CookieSettingsButton({
  className,
  children = 'Cookie Preferences',
}: CookieSettingsButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openCookieSettings'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        color: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
