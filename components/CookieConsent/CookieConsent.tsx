'use client';

// src/components/CookieConsent/CookieConsent.tsx
// DPDP Act Compliant Cookie Consent & Preferences Manager
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { needsChoice, readChoice, saveChoices } from '@/lib/privacy/cookieChoices';
import { OFFERED_CATEGORIES, categoryText } from '@/lib/privacy/cookieConfig';
import { COOKIE_NOTICE, LANGUAGES } from '@/lib/privacy/notices';
import styles from './CookieConsent.module.css';

type Choices = Record<string, boolean>;
type Language = 'en' | 'hi';

/** Every offered category set to one value, or to what was saved. Never on by default. */
const allCategories = (value: (category: string) => boolean): Choices =>
  Object.fromEntries(OFFERED_CATEGORIES.map((category) => [category, value(category)]));

const savedCategories = (): Choices => {
  const saved = readChoice() as Choices | null;
  return allCategories((category) => saved?.[category] === true);
};

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [choices, setChoices] = useState<Choices>(() => allCategories(() => false));
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  // Load saved consent on client mount
  useEffect(() => {
    setIsMounted(true);
    setChoices(savedCategories());
    if (!needsChoice()) return; // Every category on offer has been answered

    // Otherwise display after a short graceful delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Listen to global open event (for Footer "Cookie Settings" button or Privacy Policy links)
  useEffect(() => {
    const handleOpen = () => {
      setChoices(savedCategories());
      setIsOpen(true);
    };

    window.addEventListener('openCookieSettings', handleOpen);
    (window as unknown as { openCookiePreferences?: () => void }).openCookiePreferences = handleOpen;

    return () => {
      window.removeEventListener('openCookieSettings', handleOpen);
    };
  }, []);

  const saveConsent = useCallback((next: Choices) => {
    setChoices(next);
    saveChoices(next, 'cookie_banner', language);
    setIsOpen(false);
  }, [language]);

  const necessary = categoryText('necessary', language);

  if (!isMounted || !isOpen) {
    return null;
  }

  return (
    <div
      className={styles.bannerWrapper}
      role="dialog"
      aria-modal="true"
      aria-label="Your Privacy & Cookie Choices"
      onClick={(e) => {
        // Clicking backdrop closes the dialog
        if (e.target === e.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <div className={styles.bannerCard}>
        {/* Header with Title and Close Button */}
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Your Privacy &amp; Cookie Choices</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close cookie choices"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Only this part scrolls, so the buttons below are always on screen */}
        <div className={styles.scrollBody}>
        {/* Description Body */}
        <p className={styles.description} lang={language}>
          {COOKIE_NOTICE[language]}
        </p>
        <div role="group" aria-label="Notice language" style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              lang={code}
              aria-pressed={code === language}
              onClick={() => setLanguage(code as Language)}
              style={{
                background: 'none',
                border: 0,
                color: 'inherit',
                cursor: 'pointer',
                font: 'inherit',
                fontWeight: code === language ? 700 : 400,
                padding: 0,
                textDecoration: code === language ? 'none' : 'underline',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Preferences Toggle List */}
        <div className={styles.preferencesList}>
          {/* Strictly Necessary Cookies */}
          <div className={styles.preferenceItem}>
            <div className={styles.prefText}>
              <div className={styles.prefTitleRow}>
                <span className={styles.prefName} lang={language}>{necessary.name}</span>
                <span className={styles.requiredBadge}>REQUIRED</span>
              </div>
              <p className={styles.prefDesc} lang={language}>{necessary.description}</p>
            </div>
            <div className={styles.switchWrapper}>
              <input
                type="checkbox"
                checked
                disabled
                id="pref-necessary"
                className={styles.toggleInput}
                aria-label="Strictly Necessary Cookies (Required)"
              />
              <label
                htmlFor="pref-necessary"
                className={`${styles.toggleLabel} ${styles.toggleDisabled}`}
              >
                <span className={styles.toggleThumb} />
              </label>
            </div>
          </div>

          {/* Only the categories this deployment has switched on */}
          {OFFERED_CATEGORIES.map((category) => {
            const { name, description } = categoryText(category, language);
            return (
              <div key={category} className={styles.preferenceItem}>
                <div className={styles.prefText}>
                  <div className={styles.prefTitleRow}>
                    <span className={styles.prefName} lang={language}>{name}</span>
                    <span className={styles.optionalBadge}>OPTIONAL</span>
                  </div>
                  <p className={styles.prefDesc} lang={language}>{description}</p>
                </div>
                <div className={styles.switchWrapper}>
                  <input
                    type="checkbox"
                    id={`pref-${category}`}
                    checked={choices[category] === true}
                    onChange={(e) => setChoices({ ...choices, [category]: e.target.checked })}
                    className={styles.toggleInput}
                    aria-label={name}
                  />
                  <label htmlFor={`pref-${category}`} className={styles.toggleLabel}>
                    <span className={styles.toggleThumb} />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.actionRow}>
          <Link href="/privacy-policy" className={styles.policyLink}>
            Read DPDP Privacy Policy
          </Link>

          <div className={styles.buttonsGroup}>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={() => saveConsent(allCategories(() => false))}
            >
              Reject Optional
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={() => saveConsent(choices)}
            >
              Save Preferences
            </button>
            <button
              type="button"
              className={styles.acceptAllBtn}
              onClick={() => saveConsent(allCategories(() => true))}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
