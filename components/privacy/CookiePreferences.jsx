'use client';

import { useEffect, useState } from 'react';
import styles from './CookiePreferences.module.css';

const STORAGE_KEY = 'vastuvihar-cookie-preferences';
const defaults = { necessary: true, analytics: false, marketing: false };

export default function CookiePreferences() {
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (existing) {
        setChoices({
          ...defaults,
          analytics: existing.analytics === true,
          marketing: existing.marketing === true,
        });
      }
    } catch (_) {
      /* Keep safe defaults. */
    }
  }, []);

  function save(next) {
    const consent = {
      ...defaults,
      ...next,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (_) {
      /* Local preferences may be unavailable. */
    }
    window.dispatchEvent(new CustomEvent('vastuvihar:cookie-consent-updated', { detail: consent }));
    setChoices(consent);
    setSaved(true);
    setOpen(false);
  }

  return (
    <div className={styles.cookieArea}>
      <button
        type="button"
        className={styles.cookieButton}
        onClick={() => {
          setSaved(false);
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-controls="vastuvihar-cookie-options"
      >
        Manage Cookie Preferences <span aria-hidden="true">↗</span>
      </button>
      {saved && (
        <p className={styles.savedMessage} role="status">
          Your cookie preferences have been saved in this browser.
        </p>
      )}
      {open && (
        <div id="vastuvihar-cookie-options" className={styles.cookiePanel}>
          <h3>Cookie preferences</h3>
          <p>Choose which optional categories to allow. Necessary cookies stay enabled.</p>
          <label className={styles.cookieOption}>
            <span>
              <strong>Strictly necessary</strong>
              <small>Required for essential website functionality.</small>
            </span>
            <input type="checkbox" checked disabled readOnly />
          </label>
          <label className={styles.cookieOption}>
            <span>
              <strong>Analytics &amp; performance</strong>
              <small>Help us understand website usage.</small>
            </span>
            <input
              type="checkbox"
              checked={choices.analytics}
              onChange={(event) =>
                setChoices((prev) => ({ ...prev, analytics: event.target.checked }))
              }
            />
          </label>
          <label className={styles.cookieOption}>
            <span>
              <strong>Marketing &amp; personalization</strong>
              <small>Allow optional marketing-related features.</small>
            </span>
            <input
              type="checkbox"
              checked={choices.marketing}
              onChange={(event) =>
                setChoices((prev) => ({ ...prev, marketing: event.target.checked }))
              }
            />
          </label>
          <div className={styles.cookieActions}>
            <button type="button" onClick={() => save({ analytics: false, marketing: false })}>
              Reject optional
            </button>
            <button type="button" onClick={() => save(choices)}>
              Save choices
            </button>
            <button type="button" onClick={() => save({ analytics: true, marketing: true })}>
              Accept all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

