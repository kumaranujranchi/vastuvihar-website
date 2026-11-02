import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import RightsCentre from '@/components/privacy/RightsCentre';
import { createPageMetadata } from '@/lib/metadata';
import { PRIVACY_CONTACT } from '@/data/privacy/processors';
import styles from '../privacy-policy/privacy.module.css';

export const metadata = createPageMetadata({
  title: 'Your Data Rights | Vastu Vihar',
  description:
    'Opt out of marketing, ask to see, correct or erase your personal data, nominate someone, or raise a privacy grievance with Vastu Vihar.',
  path: '/privacy-rights/',
});

export default function PrivacyRightsPage() {
  return (
    <PageLayout route="privacy-rights">
      <Breadcrumb title="Your Data Rights" />
      <main className={styles.page} id="content">
        <div className={styles.container}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Digital Personal Data Protection Act, 2023</p>
            <h1>Your Data Rights</h1>
            <p className={styles.lead}>
              Stop marketing, see or change what we hold about you, or tell us if something has gone wrong.
            </p>
          </header>

          <div className={styles.sections}>
            <RightsCentre responseDays={PRIVACY_CONTACT.grievanceResponseDays} />

            <section className={styles.section} id="privacy-contact">
              <h2>Privacy contact</h2>
              <p>You can also write or call instead of using these forms.</p>
              <div className={styles.contactPanel}>
                <h3>{PRIVACY_CONTACT.officerName || PRIVACY_CONTACT.officerTitle}</h3>
                {PRIVACY_CONTACT.officerName && <p className={styles.panelSub}>{PRIVACY_CONTACT.officerTitle}</p>}
                <dl className={styles.contactGrid}>
                  <div><dt>Company</dt><dd>{PRIVACY_CONTACT.company}</dd></div>
                  <div><dt>Email</dt><dd><a href={`mailto:${PRIVACY_CONTACT.email}`}>{PRIVACY_CONTACT.email}</a></dd></div>
                  <div><dt>Escalation</dt><dd><a href={`mailto:${PRIVACY_CONTACT.escalationEmail}`}>{PRIVACY_CONTACT.escalationEmail}</a></dd></div>
                  <div><dt>Phone</dt><dd><a href={PRIVACY_CONTACT.phoneHref}>{PRIVACY_CONTACT.phone}</a></dd></div>
                  <div><dt>Address</dt><dd>{PRIVACY_CONTACT.address}</dd></div>
                </dl>
              </div>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
