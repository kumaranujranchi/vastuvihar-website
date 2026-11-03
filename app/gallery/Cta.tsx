
import Link from 'next/link';
import styles from './Cta.module.css';

interface GalleryCTAProps {
  className?: string;
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function GalleryCTA({
  className = '',
}: GalleryCTAProps) {
  return (
    <section
      className={`${styles.ctaSection} ${className}`}
      aria-labelledby="gallery-cta-heading"
    >
      <div className={styles.ctaInner}>
        <span className={styles.eyebrow}>
          DISCOVER VASTU VIHAR
        </span>

        <h2
          id="gallery-cta-heading"
          className={styles.heading}
        >
          The Next Frame Could Be Yours.
        </h2>

        <p className={styles.description}>
          You've seen our journey. Now discover the bungalows
          and townships where your own story can begin.
        </p>

        <div className={styles.actions}>
          <Link
            href="/projects"
            className={`${styles.button} ${styles.primary}`}
          >
            <span>Explore Our Projects</span>
            <ArrowUpRightIcon />
          </Link>

          <Link
            href="/contact"
            className={`${styles.button} ${styles.secondary}`}
          >
            <span>Book a Site Visit</span>
            <ArrowUpRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Also supports named imports.
export { GalleryCTA };
