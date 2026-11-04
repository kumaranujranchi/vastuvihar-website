'use client';

import './common/ContactForm.css'; // Adjust path if needed
import { useId, useState } from 'react';
import { adSourceFields } from '@/lib/privacy/adSource';
import { trackLead } from '@/lib/privacy/tags';

/** Keeps the theme's original field markup while replacing Contact Form 7. */
export default function ContactForm({ children, className = '', ...props }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const statusId = useId();
  
  // Point directly to your Next.js route
  const endpoint = '/api/leads'; 

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || status === 'sending') return;
    
    setStatus('sending');
    setMessage('Sending your message…');
    
    try {
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      
      // Map the HTML form fields to match your backend Prisma schema requirements
      const payload = {
        fullName: `${values.firstName || ''} ${values.lastName || ''}`.trim(),
        phone: values.phone || '',
        email: values.email || '',
        city: values.city || '',
        budget: values.budget || '',
        project: values.project || '',
        message: values.message || '',
        website_url: values.website_url || '', // Honeypot
        source: values.source || 'contact_section',
        consentPrimary: values.consentPrimary === 'true',
        consentMarketing: values.consentMarketing === 'true',
        noticeLanguage: values.noticeLanguage || 'en',
        ...adSourceFields(),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || 'The receiving service could not accept the message.');
      
      if (result?.success === false || result?.error) {
        throw new Error(result?.error || 'The receiving service did not confirm the message.');
      }
      
      setStatus('success');
      setMessage(result?.message || 'Thank you. Your message has been submitted.');
      form.reset();
      trackLead();
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Your message could not be sent. Please try again.');
    }
  }

  return (
    <form {...props} className={`${className} next-contact-form`} onSubmit={handleSubmit} aria-describedby={statusId} aria-busy={status === 'sending'}>
      <fieldset disabled={status === 'sending'} className="next-form-fields" style={{ border: 'none', padding: 0, margin: 0 }}>
        {children}
      </fieldset>
      <p id={statusId} role="status" aria-live="polite" className={`next-form-status next-form-status-${status}`}>
        {message}
      </p>
    </form>
  );
}