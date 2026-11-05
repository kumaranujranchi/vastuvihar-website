'use client';

import './ContactForm.css';
import { useId, useState } from 'react';

/** Keeps the theme's original field markup while replacing Contact Form 7. */
export default function ContactForm({ children, className = '', ...props }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const statusId = useId();
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim() || '/api/leads';

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || status === 'sending') return;
    setStatus('sending');
    setMessage('Sending your message…');
    try {
      const values = Object.fromEntries(new FormData(form).entries());
      // Multi-select/checkbox values are preserved when a name occurs more than once.
      for (const key of new Set(new FormData(form).keys())) {
        const all = new FormData(form).getAll(key);
        if (all.length > 1) values[key] = all;
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, page: window.location.pathname }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error('The receiving service could not accept the message.');
      const result = await response.json().catch(() => null);
      if (result?.success === false || result?.error || ['validation_failed', 'spam', 'mail_failed'].includes(result?.status)) {
        throw new Error('The receiving service did not confirm the message.');
      }
      setStatus('success');
      setMessage('Thank you. Your message has been submitted.');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Your message could not be sent. Please try again or use the contact details on this page.');
    }
  }

  return (
    <form {...props} className={`${className} next-contact-form`} onSubmit={handleSubmit} aria-describedby={statusId} aria-busy={status === 'sending'}>
      <fieldset disabled={status === 'sending'} className="next-form-fields">{children}</fieldset>
      <p id={statusId} role="status" aria-live="polite" className={`next-form-status next-form-status-${status}`}>
        {message || (!endpoint ? 'Preview form — messages are not sent.' : '')}
      </p>
    </form>
  );
}
