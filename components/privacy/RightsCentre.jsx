'use client';

import { useState } from 'react';
import pageStyles from '@/app/privacy-policy/privacy.module.css';
import styles from './RightsCentre.module.css';

const REQUEST_TYPES = [
  { value: 'ACCESS', label: 'See the personal data you hold about me', help: 'We will send a summary of your data, how it is used and who it has been shared with.' },
  { value: 'CORRECTION', label: 'Correct or update my details', help: 'Tell us what is wrong. Fill in only the details that need to change.' },
  { value: 'ERASURE', label: 'Erase my personal data', help: 'We erase your data unless the law requires us to keep it. If so, we will tell you what was kept and why.' },
  { value: 'CONSENT_WITHDRAWAL', label: 'Withdraw my consent', help: 'We stop processing your data for the purposes you consented to, unless the law permits or requires otherwise. To stop marketing only, use the form above.' },
  { value: 'NOMINATION', label: 'Nominate someone to act for me', help: 'This person can exercise your rights if you die or become unable to act.' },
  { value: 'GRIEVANCE', label: 'Raise a privacy grievance', help: 'Tell us what went wrong. You will get a ticket number to follow it up.' },
];

const GRIEVANCE_CATEGORIES = [
  ['CONSENT', 'Consent or notice'],
  ['MARKETING', 'Unwanted marketing'],
  ['ACCURACY', 'Incorrect data'],
  ['SECURITY', 'Security or misuse of data'],
  ['REQUEST_HANDLING', 'How a request was handled'],
  ['OTHER', 'Something else'],
];

async function post(url, body, method = 'POST') {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function OptOut() {
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setState({ status: 'sending', message: '' });
    try {
      const result = await post('/api/privacy/marketing-opt-out', values);
      setState({ status: 'success', message: result.message });
      form.reset();
    } catch (error) {
      setState({ status: 'error', message: error.message });
    }
  }

  return (
    <section className={pageStyles.section} id="opt-out">
      <h2>Stop marketing</h2>
      <p>Enter the phone number or email you gave us. This takes effect straight away and needs no other details.</p>
      <form className={styles.inline} onSubmit={submit}>
        <input type="text" name="website_url" className={styles.trap} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label className={styles.field}>
          <span>Phone number or email</span>
          <input type="text" name="contact" required maxLength={254} autoComplete="email" />
        </label>
        <button type="submit" className={styles.button} disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Sending…' : 'Stop marketing'}
        </button>
      </form>
      {state.message && <p role="status" className={state.status === 'error' ? styles.error : styles.success}>{state.message}</p>}
    </section>
  );
}

function RequestForm({ responseDays }) {
  const [type, setType] = useState('ACCESS');
  const [state, setState] = useState({ status: 'idle', message: '', ticketNo: null, dueAt: null });
  const selected = REQUEST_TYPES.find((option) => option.value === type);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setState({ status: 'sending', message: '', ticketNo: null, dueAt: null });
    try {
      const result = await post('/api/privacy/requests', values);
      setState({ status: 'success', message: '', ticketNo: result.ticketNo, dueAt: result.dueAt });
      form.reset();
      setType('ACCESS');
    } catch (error) {
      setState({ status: 'error', message: error.message, ticketNo: null, dueAt: null });
    }
  }

  return (
    <section className={pageStyles.section} id="request">
      <h2>Make a request or raise a grievance</h2>
      <p>
        To protect your data, we confirm your identity before acting on a request, usually by contacting you on the
        phone or email we hold. We use what you enter here only to handle this request. We aim to respond within {responseDays} days.
      </p>

      {state.ticketNo ? (
        <div className={styles.ticket} role="status">
          <strong>Your request has been received.</strong>
          <p>Your ticket number is <code>{state.ticketNo}</code>. Please save it. You can use it below to check progress.</p>
          {state.dueAt && <p>We aim to respond by {formatDate(state.dueAt)}.</p>}
          <button type="button" className={styles.linkButton} onClick={() => setState({ status: 'idle', message: '', ticketNo: null, dueAt: null })}>
            Make another request
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <input type="text" name="website_url" className={styles.trap} tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <label className={styles.field}>
            <span>What would you like to do? *</span>
            <select name="type" value={type} onChange={(event) => setType(event.target.value)}>
              {REQUEST_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <p className={styles.help}>{selected.help}</p>

          {type === 'GRIEVANCE' && (
            <label className={styles.field}>
              <span>What is it about? *</span>
              <select name="category" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {GRIEVANCE_CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          )}

          <label className={styles.field}>
            <span>Your full name *</span>
            <input type="text" name="requesterName" required maxLength={120} autoComplete="name" />
          </label>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Email you used with us</span>
              <input type="email" name="email" maxLength={254} autoComplete="email" />
            </label>
            <label className={styles.field}>
              <span>Phone you used with us</span>
              <input type="tel" name="phone" maxLength={32} autoComplete="tel" />
            </label>
          </div>
          <p className={styles.help}>Give at least one of these, so we can find your records and contact you.</p>

          {type !== 'NOMINATION' && (
            <label className={styles.field}>
              <span>Who is making this request?</span>
              <select name="actingAs" defaultValue="SELF">
                <option value="SELF">I am the person the data is about</option>
                <option value="NOMINEE">I am a nominee acting for that person</option>
              </select>
            </label>
          )}

          {type === 'CORRECTION' && (
            <div className={styles.row3}>
              <label className={styles.field}><span>Correct name</span><input type="text" name="newName" maxLength={120} /></label>
              <label className={styles.field}><span>Correct email</span><input type="email" name="newEmail" maxLength={254} /></label>
              <label className={styles.field}><span>Correct phone</span><input type="tel" name="newPhone" maxLength={32} /></label>
            </div>
          )}

          {type === 'NOMINATION' && (
            <div className={styles.row3}>
              <label className={styles.field}><span>Nominee's name *</span><input type="text" name="nomineeName" required maxLength={120} /></label>
              <label className={styles.field}><span>Nominee's phone or email *</span><input type="text" name="nomineeContact" required maxLength={254} /></label>
              <label className={styles.field}><span>Relationship to you</span><input type="text" name="nomineeRelation" maxLength={80} /></label>
            </div>
          )}

          <label className={styles.field}>
            <span>Details *</span>
            <textarea name="details" rows={5} required maxLength={4000} />
          </label>

          {state.status === 'error' && <p role="alert" className={styles.error}>{state.message}</p>}
          <button type="submit" className={styles.button} disabled={state.status === 'sending'}>
            {state.status === 'sending' ? 'Sending…' : 'Submit'}
          </button>
        </form>
      )}
    </section>
  );
}

const STATUS_LABELS = {
  RECEIVED: 'Received',
  VERIFYING: 'Confirming your identity',
  IN_PROGRESS: 'In progress',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  REJECTED: 'Closed without action',
};

function StatusCheck() {
  const [state, setState] = useState({ status: 'idle', message: '', result: null });

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState({ status: 'sending', message: '', result: null });
    try {
      const result = await post('/api/privacy/requests', values, 'PUT');
      setState({ status: 'success', message: '', result });
    } catch (error) {
      setState({ status: 'error', message: error.message, result: null });
    }
  }

  return (
    <section className={pageStyles.section} id="status">
      <h2>Check a request</h2>
      <form className={styles.inline} onSubmit={submit}>
        <label className={styles.field}>
          <span>Ticket number</span>
          <input type="text" name="ticketNo" required maxLength={40} />
        </label>
        <label className={styles.field}>
          <span>Phone or email on the request</span>
          <input type="text" name="contact" required maxLength={254} />
        </label>
        <button type="submit" className={styles.button} disabled={state.status === 'sending'}>Check</button>
      </form>
      {state.status === 'error' && <p role="alert" className={styles.error}>{state.message}</p>}
      {state.result && (
        <p role="status" className={styles.success}>
          {state.result.ticketNo}: {STATUS_LABELS[state.result.status] || state.result.status}.
          {state.result.resolvedAt
            ? ` Closed on ${formatDate(state.result.resolvedAt)}.`
            : ` We aim to respond by ${formatDate(state.result.dueAt)}.`}
        </p>
      )}
      <p>
        If you are not satisfied with our response, you can complain to the Data Protection Board of India after
        using this process.
      </p>
    </section>
  );
}

export default function RightsCentre({ responseDays }) {
  return (
    <>
      <OptOut />
      <RequestForm responseDays={responseDays} />
      <StatusCheck />
    </>
  );
}
