import styles from './AwardsHeader.module.css';
import Link from 'next/link';
export default function AwardsHeader() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Our awards</h1>

          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/" prefetch={false}>Home</Link>
            <span className={styles.separator} aria-hidden="true" />
            <strong>Our awards</strong>
          </nav>
        </div>
        <div className={styles.curve} />
      </div>

      <div className={styles.introContainer}>

        <div className={styles.introContent}>
          <h2>Awards &amp; Recognitions</h2>
          <p>
            Vastu Vihar’s dedication to quality construction, innovation, and affordable homeownership has earned prestigious recognition through its founder, Vinay Kumar Tiwary, reflecting the company’s vision, commitment to excellence, and contribution to the real estate sector.
          </p>
        </div>
      </div>
    </>
  );
}