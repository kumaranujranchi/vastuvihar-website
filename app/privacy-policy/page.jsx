import PageLayout from '@/components/PageLayout';
import Breadcrumb from '@/components/Breadcrumb';
import CookiePreferences from './CookiePreferences';
import styles from './privacy.module.css';

export const metadata = {
  title: 'Privacy Notice & Policy | Vastu Vihar',
  description: 'Privacy Notice and Policy of Technoculture Building Centre Private Limited (Vastu Vihar), including personal data rights, processing, security, and grievance contact details.',
};

const Icon = ({ children }) => <span className={styles.icon} aria-hidden="true">{children}</span>;

export default function PrivacyPage() {
  return (
    <PageLayout route="privacy-policy">
      <Breadcrumb title="Privacy Policy" />
      <main className={styles.page} id="content">
        <div className={styles.container}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Digital Personal Data Protection (DPDP) Act, 2023</p>
            <h1>Privacy Notice &amp; Policy</h1>
            <p className={styles.lead}>Committed to safeguarding your privacy, personal data rights, and digital trust across India.</p>
            <p className={styles.revised}>Last Revised: October 2026 <span aria-hidden="true">|</span> Effective Date: Under DPDP Rules (India)</p>
            <p>This Privacy Notice is issued by <strong>Technoculture Building Centre Private Limited</strong> (operating under the registered trade brand <strong>“Vastu Vihar”</strong>), as the <strong>Data Fiduciary</strong>, to all visitors, buyers, customers, and individuals (“<strong>Data Principals</strong>”) interacting with our website, projects, digital applications, and customer support channels.</p>
            <p>In compliance with the <strong>Digital Personal Data Protection Act, 2023 (“DPDP Act”)</strong> and applicable Information Technology rules of India, this document provides an itemized notice of the personal data we collect, the lawful purposes for processing, and the comprehensive statutory rights guaranteed to you.</p>
          </header>

          <div className={styles.sections}>
            <section className={styles.section} id="identity">
              <h2><span>01</span> Identity of the Data Fiduciary</h2>
              <p>Under the DPDP Act, the entity determining the purpose and means of processing your personal data is:</p>
              <ul>
                <li><strong>Data Fiduciary Name:</strong> Technoculture Building Centre Private Limited (Vastu Vihar)</li>
                <li><strong>Corporate Headquarters:</strong> 417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Old Jakkanpur, Lodipur, Patna, Bihar - 800001, India.</li>
                <li><strong>Official Email:</strong> <a href="mailto:info@vastuvihar.org">info@vastuvihar.org</a></li>
                <li><strong>Privacy &amp; Grievance Redressal Desk:</strong> <a href="mailto:privacy@vastuvihar.org">privacy@vastuvihar.org</a></li>
              </ul>
            </section>

            <section className={styles.section} id="definitions">
              <h2><span>02</span> Key Definitions in Plain Language</h2>
              <div className={styles.definitionGrid}>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Data Principal</h3><p>The individual to whom the personal data relates (i.e., you, as a home buyer, prospective customer, or website visitor).</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Data Fiduciary</h3><p>Vastu Vihar, which determines the purpose and means of processing personal data in accordance with the law.</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Personal Data</h3><p>Any data about an individual who is identifiable by or in relation to such data (e.g., name, phone number, national ID, digital footprint).</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Consent Manager</h3><p>An interoperable platform registered with the Data Protection Board through which a Data Principal may give, manage, review, or withdraw consent.</p></div>
              </div>
            </section>

            <section className={styles.section} id="data-collected">
              <h2><span>03</span> Itemized Notice of Personal Data Collected &amp; Purpose</h2>
              <p>As per Section 5 of the DPDP Act, we only collect personal data that is necessary for specified, explicit, and legitimate real estate purposes:</p>
              <h3>A. Data Provided Directly by You</h3>
              <ul>
                <li><strong>Inquiry &amp; Contact Details:</strong> Full name, mobile number, email address, current city of residence.<p><em>Purpose:</em> To respond to inquiries, send model brochures, share verified price lists, arrange site visits, and coordinate home buyer consultations.</p></li>
                <li><strong>Property Preferences &amp; Financial Range:</strong> Preferred project location, villa/apartment model preference, budget range, and loan assistance requests.<p><em>Purpose:</em> To recommend tailored township phases matching your housing requirements.</p></li>
                <li><strong>Booking &amp; Statutory KYC Documents:</strong> PAN card, Aadhaar card (masked/offline verification as per UIDAI norms), address proof, bank details, and photograph upon formal booking.<p><em>Purpose:</em> For legal agreement drafting, property registration, stamp duty, RERA statutory reporting, and Prevention of Money Laundering Act (PMLA) compliance.</p></li>
              </ul>
              <h3>B. Digital &amp; Technical Data Collected Automatically</h3>
              <ul>
                <li><strong>Device &amp; Network Identifiers:</strong> IP address, device type, operating system, browser version, and approximate location.</li>
                <li><strong>Usage Interactions:</strong> Pages viewed, interactive floor plans visited, session duration, and referral sources.<p><em>Purpose:</em> To maintain website security, prevent fraudulent bot traffic, and optimize load speeds across desktop and mobile devices.</p></li>
              </ul>
            </section>

            <section className={styles.section} id="processing">
              <h2><span>04</span> Lawful Grounds for Processing</h2>
              <p>Under Section 4 and Section 6 of the DPDP Act, Vastu Vihar processes personal data strictly based on:</p>
              <ul>
                <li><strong>Valid &amp; Explicit Consent:</strong> Obtained through affirmative, unambiguous action (such as submitting an inquiry form, booking request, or accepting cookie categories). You are never subjected to pre-ticked consent boxes or bundled non-essential permissions.</li>
                <li><strong>Legitimate Uses (Section 7):</strong> Fulfilling obligations under property sale contracts, facilitating banking/home loan disbursements requested by you, complying with court orders, RERA directives, or tax authorities.</li>
              </ul>
            </section>

            <section className={styles.section} id="rights">
              <h2><span>05</span> Your Statutory Rights under the DPDP Act</h2>
              <p>The DPDP Act endows you with unequivocal, enforceable rights regarding your personal data:</p>
              <div className={styles.definitionGrid}>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Right to Access Information</h3><p>You have the right to request a summary of the personal data being processed by us and the identities of all third-party Data Processors with whom it has been shared.</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Right to Correction &amp; Erasure</h3><p>You can request the correction of inaccurate personal data, completion of incomplete data, or complete erasure of data that is no longer necessary for its initial purpose.</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Right to Withdraw Consent</h3><p>You have the right to withdraw your consent at any time as easily as it was given. Upon withdrawal, we cease processing your personal data, subject to statutory retention laws.</p></div>
                <div className={styles.infoCard}><Icon>◇</Icon><h3>Right to Nominate</h3><p>You may designate an individual who will inherit the right to exercise your data rights in the unfortunate event of death or incapacity.</p></div>
              </div>
            </section>

            <section className={styles.section} id="children">
              <h2><span>06</span> Protection of Children &amp; Persons with Disabilities</h2>
              <p>In strict adherence to Section 9 of the DPDP Act, 2023:</p>
              <ul>
                <li>Our website, architectural models, and real estate offerings are directed exclusively at individuals of legal contracting age (18 years and above).</li>
                <li>We <strong>do not knowingly collect or process personal data of children</strong> (under 18 years) without prior verifiable consent from their parent or lawful guardian.</li>
                <li>We <strong>strictly refrain</strong> from tracking, behavioral monitoring, or targeted profiling directed at children.</li>
              </ul>
            </section>

            <section className={styles.section} id="cookies">
              <h2><span>07</span> Cookie Policy &amp; Real-Time Consent Management</h2>
              <p>We deploy cookies strictly in compliance with consent guidelines. Cookies are classified into three distinct categories:</p>
              <ul>
                <li><strong>Strictly Necessary Cookies:</strong> Essential for foundational website navigation, security, and responsive layouts. Always active and cannot be toggled off.</li>
                <li><strong>Analytics &amp; Performance Cookies:</strong> Help us measure anonymous visitor metrics and phase popularities to improve township planning. Optional and inactive by default.</li>
                <li><strong>Marketing &amp; Personalization Cookies:</strong> Enable relevant real estate recommendations and third-party media embeds (e.g. YouTube virtual walk-throughs). Optional and inactive by default.</li>
              </ul>
              <p>Need to review or change your cookie choices? You can update your preferences at any moment:</p>
              <CookiePreferences />
            </section>

            <section className={styles.section} id="retention">
              <h2><span>08</span> Data Retention &amp; Purpose Limitation</h2>
              <p>In compliance with Section 8(7) of the DPDP Act, personal data is retained strictly as long as necessary to satisfy the purpose for which it was collected:</p>
              <ul>
                <li><strong>General Inquiry Data:</strong> Retained for a maximum of 24 months from the last date of interaction unless renewed by consent.</li>
                <li><strong>Property Booking, Agreement &amp; Financial Records:</strong> Retained for statutory periods mandated under Real Estate Regulatory Authority (RERA) regulations, the Companies Act 2013, and Indian Income Tax regulations (ordinarily 8 years following the completion of transaction).</li>
                <li><strong>Secure Deletion:</strong> Upon expiry of the retention window or upon your valid erasure request, all digital records are securely deleted or irreversibly anonymized.</li>
              </ul>
            </section>

            <section className={styles.section} id="security">
              <h2><span>09</span> Technical &amp; Organizational Security Safeguards</h2>
              <p>We deploy robust, multi-layered security controls to protect against unauthorized access, loss, or personal data breach:</p>
              <ul>
                <li><strong>Transport Encryption:</strong> End-to-end TLS/HTTPS encryption across all data transmitted between your browser and our servers.</li>
                <li><strong>Access Governance:</strong> Role-based access control (RBAC), multi-factor authentication (MFA), and audit logging for administrative staff.</li>
                <li><strong>Data Breach Protocol:</strong> In the unlikely event of a personal data breach affecting your information, we maintain strict incident response procedures to notify the <strong>Data Protection Board of India</strong> and impacted Data Principals in the manner prescribed by law.</li>
              </ul>
            </section>

            <section className={styles.section} id="grievance">
              <h2><span>10</span> Grievance Redressal &amp; Data Protection Officer</h2>
              <p>If you have questions, wish to exercise any of your statutory rights (Access, Correction, Erasure, Nomination, or Withdrawal of Consent), or have a grievance, you can contact our dedicated officer:</p>
              <div className={styles.contactPanel}>
                <h3>Data Protection &amp; Grievance Redressal Officer</h3>
                <p className={styles.panelSub}>Designated under Section 8(9) &amp; Section 13 of the DPDP Act, 2023</p>
                <dl className={styles.contactGrid}>
                  <div><dt>Company Name</dt><dd>Technoculture Building Centre Pvt. Ltd. (Vastu Vihar)</dd></div>
                  <div><dt>Dedicated Email</dt><dd><a href="mailto:privacy@vastuvihar.org">privacy@vastuvihar.org</a></dd></div>
                  <div><dt>Escalation Email</dt><dd><a href="mailto:complaint.officer@vastuvihar.org">complaint.officer@vastuvihar.org</a></dd></div>
                  <div><dt>Phone Helpline</dt><dd><a href="tel:+919534095340">+91 - 95340-95340</a></dd></div>
                  <div><dt>Registered Address</dt><dd>417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Patna, Bihar - 800001</dd></div>
                  <div><dt>Statutory Response Timeline</dt><dd>Within 30 calendar days</dd></div>
                </dl>
              </div>
              <p><strong>Escalation to Data Protection Board of India (DPBI):</strong> If you do not receive a resolution from our Grievance Officer within 30 days, or if you are dissatisfied with the resolution provided, you hold the statutory right to file a complaint directly before the <strong>Data Protection Board of India</strong> in accordance with Section 13(3) of the DPDP Act.</p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
