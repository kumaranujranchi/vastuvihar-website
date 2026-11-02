import styles from './AwardsHeader.module.css';
import Link from 'next/link';
import StaticPill from '../common/StaticPill';
import ScrollingTicker from '@/components/common/ScrollingTicker';

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
          <h2>Founder Awards &amp; Recognitions</h2>
          <p>
            Vinay Kumar Tiwary, the founder of Vastu Vihar, is identified as a recipient of the Vishwesariya Award and Bharat Nirman Ratna Award in the company brochure.
          </p>
        </div>
      </div>
    </>
  );
}