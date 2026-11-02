'use client';

// src/components/CookieConsent/CookieConsent.tsx
// DPDP Act Compliant Cookie Consent & Preferences Manager
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

const STORAGE_KEY = 'vastu_dpdp_cookie_consent_v1';
const CURRENT_VERSION = '1.0';

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved consent on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: CookiePreferences = JSON.parse(saved);
        if (parsed.version === CURRENT_VERSION) {
          setAnalyticsEnabled(parsed.analytics);
          setMarketingEnabled(parsed.marketing);
          return; // Consent already given
        }
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing restrictions)
    }

    // If no valid consent is found, display after a short graceful delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Listen to global open event (for Footer "Cookie Settings" button or Privacy Policy links)
  useEffect(() => {
    const handleOpen = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: CookiePreferences = JSON.parse(saved);
          setAnalyticsEnabled(parsed.analytics);
          setMarketingEnabled(parsed.marketing);
        }
      } catch {
        // no-op
      }
      setIsOpen(true);
    };

    window.addEventListener('openCookieSettings', handleOpen);
    (window as unknown as { openCookiePreferences?: () => void }).openCookiePreferences = handleOpen;

    return () => {
      window.removeEventListener('openCookieSettings', handleOpen);
    };
  }, []);

  const saveConsent = useCallback((analytics: boolean, marketing: boolean) => {
    const consent: CookiePreferences = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // no-op
    }

    // Broadcast consent event for any tracking/analytics listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookieConsentUpdate', { detail: consent })
      );
    }

    setIsOpen(false);
  }, []);

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    saveConsent(true, true);
  };

  const handleSavePreferences = () => {
    saveConsent(analyticsEnabled, marketingEnabled);
  };

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

        {/* Description Body */}
        <p className={styles.description}>
          We use cookies to ensure optimal site functionality, analyze traffic, and personalize
          real estate inquiries in accordance with India&apos;s{' '}
          <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. You can
          accept all cookies or customize your preferences.
        </p>

        {/* Preferences Toggle List */}
        <div className={styles.preferencesList}>
          {/* Strictly Necessary Cookies */}
          <div className={styles.preferenceItem}>
            <div className={styles.prefText}>
              <div className={styles.prefTitleRow}>
                <span className={styles.prefName}>Strictly Necessary Cookies</span>
                <span className={styles.requiredBadge}>REQUIRED</span>
              </div>
              <p className={styles.prefDesc}>
                Essential for website security, page routing, and user session management.
                These cannot be turned off under applicable data protection laws.
              </p>
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

          {/* Analytics & Performance */}
          <div className={styles.preferenceItem}>
            <div className={styles.prefText}>
              <div className={styles.prefTitleRow}>
                <span className={styles.prefName}>Analytics &amp; Performance</span>
                <span className={styles.optionalBadge}>OPTIONAL</span>
              </div>
              <p className={styles.prefDesc}>
                Helps us understand aggregated user visits, page speeds, and township interest
                to improve our architectural and website services.
              </p>
            </div>
            <div className={styles.switchWrapper}>
              <input
                type="checkbox"
                id="pref-analytics"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className={styles.toggleInput}
                aria-label="Analytics & Performance Cookies"
              />
              <label htmlFor="pref-analytics" className={styles.toggleLabel}>
                <span className={styles.toggleThumb} />
              </label>
            </div>
          </div>

          {/* Marketing & Personalization */}
          <div className={styles.preferenceItem}>
            <div className={styles.prefText}>
              <div className={styles.prefTitleRow}>
                <span className={styles.prefName}>Marketing &amp; Personalization</span>
                <span className={styles.optionalBadge}>OPTIONAL</span>
              </div>
              <p className={styles.prefDesc}>
                Enables tailored property updates, social embeds (YouTube/Instagram), and
                customized communications based on your expressed interests.
              </p>
            </div>
            <div className={styles.switchWrapper}>
              <input
                type="checkbox"
                id="pref-marketing"
                checked={marketingEnabled}
                onChange={(e) => setMarketingEnabled(e.target.checked)}
                className={styles.toggleInput}
                aria-label="Marketing & Personalization Cookies"
              />
              <label htmlFor="pref-marketing" className={styles.toggleLabel}>
                <span className={styles.toggleThumb} />
              </label>
            </div>
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
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
            <button
              type="button"
              className={styles.acceptAllBtn}
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
