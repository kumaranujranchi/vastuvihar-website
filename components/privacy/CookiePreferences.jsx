'use client';

import { useState } from 'react';
import { COOKIE_INVENTORY, OFFERED_CATEGORIES, categoryText } from '@/lib/privacy/cookieConfig';
import { saveChoices, useCookieChoice } from '@/lib/privacy/cookieChoices';
import styles from './CookiePreferences.module.css';

export default function CookiePreferences() {
  const choice = useCookieChoice();
  const [saved, setSaved] = useState(false);
  const necessary = categoryText('necessary');

  function change(category, allowed) {
    saveChoices({ [category]: allowed }, 'privacy_policy');
    setSaved(true);
  }

  return (
    <div className={styles.cookieArea}>
      <div className={styles.cookiePanel}>
        <h3>Your choices on this browser</h3>
        <label className={styles.cookieOption}>
          <span>
            <strong>{necessary.name}</strong>
            <small>{necessary.description}</small>
          </span>
          <input type="checkbox" checked disabled readOnly />
        </label>
        {OFFERED_CATEGORIES.map((category) => {
          const { name, description } = categoryText(category);
          return (
            <label key={category} className={styles.cookieOption}>
              <span>
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
              <input
                type="checkbox"
                checked={choice?.[category] === true}
                onChange={(event) => change(category, event.target.checked)}
              />
            </label>
          );
        })}
        {saved && <p className={styles.savedMessage} role="status">Saved.</p>}
        {choice?.browserId && (
          <p className={styles.consentId}>
            Your consent ID: <code>{choice.browserId}</code>. Quote this if you ask us about the choices made on this browser.
          </p>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.cookieTable}>
          <caption>Cookies and browser storage used on this website</caption>
          <thead>
            <tr><th scope="col">Name</th><th scope="col">Provider</th><th scope="col">Category</th><th scope="col">Purpose</th><th scope="col">Lasts</th></tr>
          </thead>
          <tbody>
            {COOKIE_INVENTORY.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.provider}</td>
                <td>{categoryText(item.category).name}</td>
                <td>{item.purpose}</td>
                <td>{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
