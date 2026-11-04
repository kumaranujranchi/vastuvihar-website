'use client';

import { saveChoices, useMediaConsent } from '@/lib/privacy/cookieChoices';
import styles from './ConsentEmbed.module.css';

/** Renders a third-party frame only after consent, and removes it on withdrawal. */
export default function ConsentEmbed({ provider, children, poster, className = '' }) {
  const allowed = useMediaConsent();
  if (allowed) return children;

  return (
    <div
      className={`${styles.placeholder} ${className}`}
      style={poster ? { backgroundImage: `linear-gradient(rgb(0 0 0 / 60%), rgb(0 0 0 / 60%)), url('${poster}')` } : undefined}
    >
      <p>This {provider} content is off. Loading it sends your IP address and browser details to {provider}.</p>
      <button type="button" onClick={() => saveChoices({ media: true }, 'embed')}>
        Allow videos and maps
      </button>
    </div>
  );
}
