'use client';

import { useState } from 'react';
import ConsentFields from './ConsentFields';
import styles from './NewsletterSignup.module.css';

/** The notice and consent box appear when the visitor starts, before anything can be sent. */
export default function NewsletterSignup() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state.status === 'sending') return;
    setState({ status: 'sending', message: 'Sending…' });
    try {
      const values = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/newsletter/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || 'We could not add you to the list. Please try again.');
      form.reset();
      setOpen(false);
      setState({ status: 'success', message: result.message });
    } catch (error) {
      setState({ status: 'error', message: error.message });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Newsletter signup">
      <h3 className={styles.title}>Newsletter</h3>
      <p className={styles.intro}>Project news and updates from Vastu Vihar, by email.</p>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="Your email address"
          aria-label="Your email address"
          onFocus={() => setOpen(true)}
        />
        <button className={styles.button} type="submit" disabled={state.status === 'sending'}>Subscribe</button>
      </div>
      <input className={styles.honeypot} type="text" name="website_url" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {open && <ConsentFields form="newsletter" />}
      {state.message && (
        <p className={styles.message} role={state.status === 'error' ? 'alert' : 'status'}>{state.message}</p>
      )}
    </form>
  );
}
