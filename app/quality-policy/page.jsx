import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import StaticPill from '@/components/common/StaticPill';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/metadata';
import styles from './quality.module.css';

export const metadata = createPageMetadata({
  title: 'Quality Policy | Vastu Vihar',
  description:
    'Vastu Vihar is committed to high standards of quality, safety, health and environment in all its construction and related activities.',
  path: '/quality-policy/',
});

const commitments = [
  'Customer satisfaction and a focus on client delight',
  'Superior business performance through the establishment, supervision, and periodic analysis of objectives',
  'Continuous progress in the company’s development, products, and systems, contributing to steady growth and a strong culture',
  'Commitment to society through adherence to relevant regulatory and legal requirements and support for community goals',
  'A unique and flexible system that enables Vastu Vihar to excel in a competitive and global environment',
];

const iconProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const pillars = [
  {
    title: 'Value of Customer',
    icon: (
      <svg {...iconProps}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    ),
    body: (
      <p>
        Established as industry leaders, our team is dedicated to providing our clients with results through service,
        cooperation, and technology. Vastu Vihar is firmly committed to helping its clients and partners achieve the
        short- and long-term strategic goals of every project it undertakes.
      </p>
    ),
  },
  {
    title: 'Research & Development',
    icon: (
      <svg {...iconProps}>
        <path d="M9 3h6M10 3v6.5L4.6 18.2A1.8 1.8 0 0 0 6.1 21h11.8a1.8 1.8 0 0 0 1.5-2.8L14 9.5V3" />
        <path d="M7.5 15h9" />
      </svg>
    ),
    body: (
      <p>
        We provide comprehensive management services throughout the development, design, and construction phases of
        diverse building projects. We believe in offering our clients the extensive resources they need, with a
        close-to-home focus. Armed with a strong, competent, and dedicated R&amp;D team, we constantly strive to develop
        new and improved construction methods by making the best use of locally available materials.
      </p>
    ),
  },
  {
    title: 'Employee Policy',
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
      </svg>
    ),
    body: (
      <>
        <ul>
          <li>Effective communication, ensuring that accurate and relevant information is available to all employees.</li>
          <li>A down-to-business working environment that results in the attraction and retention of high-caliber staff.</li>
        </ul>
        <p>
          We believe that each employee contributes directly to the organization’s growth and success, so they should
          be appropriately rewarded. We have made it a point to succeed in making this organization feel like a family.
        </p>
      </>
    ),
  },
];

const pad = (n) => String(n).padStart(2, '0');

export default function QualityPolicyPage() {
  return (
    <PageLayout route="quality-policy">
      <div className={styles.banner}>
        <Breadcrumb title="Quality Policy" items={[{ label: 'About', href: '/about-us/' }]} />
      </div>

      <main id="main" className={styles.page}>
        {/* Intro: headline on the left, policy statement on the right */}
        <section className={`${styles.container} ${styles.intro}`} aria-labelledby="qp-intro">
          <div className={styles.introHead}>
            <StaticPill text="Our commitment" />
            <h2 id="qp-intro" className={styles.title}>
              Quality, safety, health &amp; environment in everything we build
            </h2>
          </div>
          <div className={styles.introBody}>
            <p className={styles.lead}>
              Vastu Vihar (Technoculture Building Centre Pvt. Ltd.) is committed to achieving and continually improving
              high standards of quality, safety, health, and environment in all of its construction and related
              activities.
            </p>
            <p>
              The company aims to follow global principles of sustainability, integrating its social, economic, and
              environmental elements.
            </p>
          </div>
        </section>

        {/* The five policy commitments on the theme's navy panel */}
        <section className={styles.container} aria-labelledby="qp-policy">
          <div className={styles.policyPanel}>
            <div className={styles.policyHead}>
              <span className={styles.panelPill}>Vastu Vihar</span>
              <h2 id="qp-policy" className={styles.panelTitle}>Vastu Vihar Quality Policy</h2>
            </div>

            <ol className={styles.commitments}>
              {commitments.map((item, index) => (
                <li key={item} className={styles.commitment}>
                  <span className={styles.commitmentNo} aria-hidden="true">{pad(index + 1)}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>

            <div className={styles.motto}>
              <p>
                Through this advancement, Vastu Vihar aims to live up to its motto and achieve enhanced business
                performance and customer satisfaction.
              </p>
              <p className={styles.mottoText}>‘Shelter for All’</p>
            </div>
          </div>
        </section>

        {/* Leadership quote */}
        <section className={styles.container} aria-label="A message from our leadership">
          <figure className={styles.quote}>
            <svg className={styles.quoteMark} viewBox="0 0 48 36" aria-hidden="true">
              <path
                fill="currentColor"
                d="M0 36V21.6C0 9.6 6.6 2.4 19.2 0l2.4 4.8C14.4 7.2 10.8 11.4 10.8 16.8H19.2V36H0Zm26.4 0V21.6C26.4 9.6 33 2.4 45.6 0L48 4.8c-7.2 2.4-10.8 6.6-10.8 12h8.4V36H26.4Z"
              />
            </svg>
            <blockquote>
              <p>
                I have personally felt that what we value most is our invisible strength, determination, and the
                cooperation of our employees, who are actively encouraged to think, evolve, and act as individuals.
                Development is the key to our success and helps us scale new heights.
              </p>
            </blockquote>
          </figure>
        </section>

        {/* Customer, R&D and employee pillars */}
        <section className={`${styles.container} ${styles.pillarsWrap}`} aria-labelledby="qp-pillars">
          <div className={styles.pillarsHead}>
            <StaticPill text="What drives us" />
            <h2 id="qp-pillars" className={styles.title}>Built on people, partners and progress</h2>
          </div>
          <div className={styles.pillars}>
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className={styles.pillar}>
                <div className={styles.pillarTop}>
                  <span className={styles.pillarIcon}>{pillar.icon}</span>
                  <span className={styles.pillarNo} aria-hidden="true">{pad(index + 1)}</span>
                </div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <div className={styles.pillarBody}>{pillar.body}</div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd items={[{ name: 'About', path: '/about-us/' }, { name: 'Quality Policy' }]} />
    </PageLayout>
  );
}
