'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FORM_NOTICES,
  LANGUAGES,
  MARKETING_CONSENT,
  NOTICE_LABELS,
  NOTICE_VERSION,
} from '@/lib/privacy/notices';
import styles from './ConsentFields.module.css';

/**
 * The notice and consent controls for any form. Both boxes start unticked. Values
 * reach the server through FormData as consentPrimary, consentMarketing and noticeLanguage.
 */
export default function ConsentFields({ form, marketing = false, compact = false }) {
  const [language, setLanguage] = useState('en');
  const notice = FORM_NOTICES[form][language];
  const labels = NOTICE_LABELS[language];

  const fullNotice = (
    <>
      <div className={styles.languages} role="group" aria-label="Notice language">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            lang={code}
            className={code === language ? styles.languageActive : styles.language}
            aria-pressed={code === language}
            onClick={() => setLanguage(code)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className={styles.notice} lang={language}>
        {notice.notice}{' '}
        <Link href="/privacy-policy/" prefetch={false} target="_blank">{labels.policy}</Link>
        {' · '}
        <Link href="/privacy-rights/" prefetch={false} target="_blank">{labels.rights}</Link>
      </p>
      <p className={styles.other} lang={language}>{labels.other}</p>
    </>
  );

  return (
    <div className={styles.consent}>
      <input type="hidden" name="noticeLanguage" value={language} />
      <input type="hidden" name="noticeVersion" value={NOTICE_VERSION} />

      {compact ? (
        // The full notice stays one click away, ahead of the consent box.
        <details className={styles.details}>
          <summary className={styles.summary}>
            How we use your details · <span className={styles.summaryLink}>Read full notice</span>
          </summary>
          <div className={styles.detailsBody}>{fullNotice}</div>
        </details>
      ) : (
        fullNotice
      )}

      <label className={styles.check} lang={language}>
        <input type="checkbox" name="consentPrimary" value="true" required />
        <span>{notice.consent}</span>
      </label>

      {marketing && (
        <label className={styles.check} lang={language}>
          <input type="checkbox" name="consentMarketing" value="true" />
          <span>{MARKETING_CONSENT[language]}</span>
        </label>
      )}
    </div>
  );
}
