import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './terms.module.css';

export const metadata = {
  title: 'Terms & Conditions | Vastu Vihar',
  description: 'Terms and Conditions of the Vastu Vihar website. Last updated October 2026.',
};

export default function TermsAndConditionsPage() {
  return (
    <PageLayout route="privacy-policy">
      <Breadcrumb title="Terms & Conditions" />
      <main id="main" className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.heading}>Terms &amp; Conditions</h1>
            <p className={styles.date}>Last Updated: October 2026</p>
            <p className={styles.intro}>
              Welcome to vastuvihar.org. By accessing or using this website, you agree to comply with and be bound by the following Terms &amp; Conditions. If you do not agree, please do not use the website.
            </p>
          </header>

          <div className={styles.sections}>
            <section className={styles.section}>
              <h2>1. Website Use</h2>
              <ul>
                <li>You agree to use this website only for lawful purposes.</li>
                <li>You must not attempt to disrupt, damage, or gain unauthorized access to the website or its systems.</li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2>2. Information Accuracy</h2>
              <ul>
                <li>Website content is for general informational purposes and may change without notice.</li>
                <li>Project details, pricing, availability, specifications, and timelines are subject to revisions and approvals.</li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2>3. Intellectual Property</h2>
              <p>All content on this website (text, images, logos, graphics, layout, and design) is the property of Vastu Vihar / Technoculture and may not be copied, reproduced, or distributed without written permission.</p>
            </section>
            <section className={styles.section}>
              <h2>4. Third-Party Links</h2>
              <p>This website may contain links to third-party websites. Vastu Vihar is not responsible for the content, policies, or practices of external sites.</p>
            </section>
            <section className={styles.section}>
              <h2>5. Limitation of Liability</h2>
              <p>Vastu Vihar shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website. Use of the website is at your own risk.</p>
            </section>
            <section className={styles.section}>
              <h2>6. Governing Law</h2>
              <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in India.</p>
            </section>
            <section className={styles.section}>
              <h2>7. Contact</h2>
              <p>For questions about these Terms &amp; Conditions, contact: <a href="mailto:info@vastuvihar.org">info@vastuvihar.org</a></p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
