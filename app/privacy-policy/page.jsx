import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';
import styles from './privacy.module.css';
import CookiePreferences from '@/components/privacy/CookiePreferences';
import { TAG_IDS, categoryText } from '@/lib/privacy/cookieConfig';
import { NOTICE_VERSION } from '@/lib/privacy/notices';
import Link from 'next/link';

import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Privacy Policy | Vastu Vihar',
  description:
    'Learn how Vastu Vihar collects, uses, and safeguards your personal data, and manage your cookie preferences.',
  path: '/privacy-policy/',
});

const Icon = ({ children }) => <span className={styles.icon} aria-hidden="true">{children}</span>;

// The policy only describes tags this deployment has switched on.
const hasAnalytics = Boolean(TAG_IDS.ga4);
const hasAdvertising = Boolean(TAG_IDS.googleAds || TAG_IDS.metaPixel);
const hasTags = hasAnalytics || hasAdvertising;

export default function PrivacyPage() {
  return (
    <PageLayout route="privacy-policy">
      <Breadcrumb title="Privacy Policy" titleAs="div" />
      <main className={styles.page} id="content">
        <div className={styles.container}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Digital Personal Data Protection (DPDP) Act, 2023</p>
            <h1>Privacy Notice &amp; Policy</h1>
            <p className={styles.lead}>Committed to safeguarding your privacy, personal data rights, and digital trust across India.</p>
            <p className={styles.revised}>Last Revised: November 2026 <span aria-hidden="true">|</span> Notice version: {NOTICE_VERSION}</p>
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
              <p>As per Section 5 of the DPDP Act, this is the personal data this website collects and why. Items marked as required on a form are needed for the purpose shown. The rest are optional.</p>
              <h3>A. Data You Give Us on This Website</h3>
              <ul>
                <li><strong>Contact and project enquiry forms:</strong> Name and phone number (required), email address, preferred city, budget range, the project you are viewing, and your message.<p><em>Purpose:</em> To respond to your enquiry and share the project, price or site visit information you asked for.</p></li>
                <li><strong>Marketing preference (optional, separate tick-box):</strong> Whether you want offers and new project updates, and the time you chose.<p><em>Purpose:</em> To send promotional calls, SMS, WhatsApp messages or emails, only if you opt in. An enquiry on its own is not treated as permission for marketing.</p></li>
                <li><strong>Job applications:</strong> Name, email, phone, the position, your resume (required), and any experience details or cover note.<p><em>Purpose:</em> To assess your application and contact you about it. Resumes are kept in private storage and only authorised HR staff can open them.</p></li>
                <li><strong>Blog comments:</strong> Name and comment (required), and email address (optional).<p><em>Purpose:</em> To review and publish your comment. Your name and comment become publicly visible if approved. Your email is never published.</p></li>
                <li><strong>Privacy requests and grievances:</strong> Name, phone or email, the details you give us, and any nominee's details.<p><em>Purpose:</em> To confirm your identity, act on your request and keep a record of how it was handled.</p></li>
              </ul>
              <h3>B. Data Collected Automatically</h3>
              <ul>
                <li><strong>Security data:</strong> Your IP address is converted to a keyed, one-way code and held briefly to limit repeated form submissions. We do not store your IP address or browser details with your enquiry.</li>
                <li><strong>Server logs:</strong> Our hosting provider may keep standard web server logs, including IP addresses, to run and secure the website.</li>
                <li><strong>Your privacy choice:</strong> Your browser stores your cookie choices with a random identifier. We keep a record of that identifier in coded form with each choice, the notice version and the time, so we can show what was chosen. This record holds no contact details or IP address.</li>
                {hasTags && <li><strong>Visitor activity (only if you allow analytics or advertising):</strong> Under that same coded identifier, we keep our own record of the pages you view, the names of the tag cookies present (not their contents) and when each tag ran. If you allow advertising, we also record the advert or campaign that brought you here, and save it with any enquiry you send. We use this to check our tags and see which adverts bring enquiries. Withdrawing a category deletes its visitor activity record.</li>}
              </ul>
              {hasTags
                ? <p>The only analytics or advertising tags on this website are those listed in section 07, and they run only if you allow them. This website does not use session recording or a chat widget.</p>
                : <p>This website does not use analytics, advertising or remarketing tags, session recording, or a chat widget.</p>}
              <h3>C. Data Collected Outside This Website</h3>
              <p>If you go on to book a property, our sales and legal teams separately collect documents such as PAN, Aadhaar (masked or offline verification as per UIDAI norms), address proof, bank details and a photograph, for agreement drafting, property registration, stamp duty, RERA reporting and Prevention of Money Laundering Act compliance. The website never asks for these.</p>
            </section>

            <section className={styles.section} id="processing">
              <h2><span>04</span> Lawful Grounds for Processing</h2>
              <p>Under Section 4 and Section 6 of the DPDP Act, Vastu Vihar processes personal data strictly based on:</p>
              <ul>
                <li><strong>Consent:</strong> Given by ticking an unticked box on each form, after seeing a notice in English or Hindi. Marketing has its own separate, optional box. We record the time, purpose, language and notice version. You can ask for this notice in another language listed in the Eighth Schedule to the Constitution by writing to <a href="mailto:privacy@vastuvihar.org">privacy@vastuvihar.org</a>.</li>
                <li><strong>Legitimate Uses (Section 7):</strong> Fulfilling obligations under property sale contracts, facilitating banking/home loan disbursements requested by you, complying with court orders, RERA directives, or tax authorities.</li>
              </ul>
              <h3>Who Receives Your Data</h3>
              <ul>
                <li><strong>Our hosting provider</strong> stores the website, database and resumes on our behalf as a Data Processor.</li>
                <li><strong>Google (YouTube, Google Maps) and Vimeo</strong> receive your IP address and browser details only after you allow videos and maps. They act independently under their own privacy policies, and may process data outside India.</li>
                <li><strong>WhatsApp (Meta):</strong> if our sales team replies to your enquiry on WhatsApp, your name and phone number are used on that service.</li>
                {hasAnalytics && <li><strong>Google Analytics</strong> receives the data described in section 07 only after you allow analytics, and may process it outside India.</li>}
                {hasAdvertising && <li><strong>Our advertising partners</strong> receive the data described in section 07 only after you allow advertising and remarketing, and may process it outside India.</li>}
              </ul>
              <p>We do not sell personal data. The website does not send what you type into its forms to a CRM, email or advertising platform. Authorities receive data only where the law requires it.</p>
            </section>

            <section className={styles.section} id="rights">
              <h2><span>05</span> Your Statutory Rights under the DPDP Act</h2>
              <p>You can use any of these rights on our <Link href="/privacy-rights/" prefetch={false}>Your Data Rights</Link> page, where you can also stop marketing straight away and track a request by its ticket number.</p>
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
                <li>Our website and real estate offerings are directed at adults (18 years and above), and each form asks you to confirm you are 18 or older.</li>
                <li>We <strong>do not knowingly collect personal data of children</strong> through this website, and it has no process for parental consent. If you are under 18, please do not submit a form. A parent or guardian who believes a child has done so can ask us to erase the data on our <Link href="/privacy-rights/" prefetch={false}>Your Data Rights</Link> page.</li>
                <li>We do not carry out tracking, behavioural monitoring or targeted advertising directed at children.</li>
              </ul>
            </section>

            <section className={styles.section} id="cookies">
              <h2><span>07</span> Cookie Policy &amp; Real-Time Consent Management</h2>
              <p>This website uses these categories only:</p>
              <ul>
                <li><strong>Strictly necessary:</strong> Browser storage that remembers your privacy choice, and a secure sign-in cookie for authorised staff in the admin area. Always active.</li>
                <li><strong>Third-party videos and maps:</strong> YouTube, Vimeo and Google Maps content. These services receive your IP address and browser details and may set their own cookies. Off until you allow them, with a local image or a placeholder shown instead.</li>
                {hasAnalytics && <li><strong>{categoryText('analytics').name}:</strong> {categoryText('analytics').description} Off until you allow it.</li>}
                {hasAdvertising && <li><strong>{categoryText('advertising').name}:</strong> {categoryText('advertising').description} Off until you allow it.</li>}
              </ul>
              <p>You can change your choices here or from Cookie Preferences in the footer. Turning off videos and maps removes them from the page straight away.{hasTags && ' Turning off analytics or advertising stops those tags and clears the cookies they set on this website. Cookies held on another company\'s own domain are controlled by that company.'}</p>
              <CookiePreferences />
            </section>

            <section className={styles.section} id="retention">
              <h2><span>08</span> Data Retention &amp; Purpose Limitation</h2>
              <p>In compliance with Section 8(7) of the DPDP Act, personal data is retained strictly as long as necessary to satisfy the purpose for which it was collected:</p>
              <ul>
                <li><strong>General Inquiry Data:</strong> Retained for a maximum of 24 months from the last date of interaction unless renewed by consent.</li>
                <li><strong>Property Booking, Agreement &amp; Financial Records:</strong> Retained for statutory periods mandated under Real Estate Regulatory Authority (RERA) regulations, the Companies Act 2013, and Indian Income Tax regulations (ordinarily 8 years following the completion of transaction).</li>
                <li><strong>Job Applications, Blog Comments and Privacy Requests:</strong> Kept for the period set in our approved retention schedule, then deleted.</li>
                {hasTags && <li><strong>Visitor Activity:</strong> Kept for the period set in our approved retention schedule, or until you withdraw the category it was collected under, then deleted. An advert or campaign saved with an enquiry is deleted with that enquiry.</li>}
                <li><strong>Marketing Opt-Outs and Consent Records:</strong> Kept in coded form, so we can honour your opt-out and show how consent was handled.</li>
                <li><strong>Secure Deletion:</strong> Upon expiry of the retention period or upon your valid erasure request, records in our website database and private storage are deleted, unless the law requires us to keep them. Copies in backups and server logs are removed as those backups and logs expire.</li>
              </ul>
            </section>

            <section className={styles.section} id="security">
              <h2><span>09</span> Technical &amp; Organizational Security Safeguards</h2>
              <p>We deploy robust, multi-layered security controls to protect against unauthorized access, loss, or personal data breach:</p>
              <ul>
                <li><strong>Transport Encryption:</strong> HTTPS encryption for data travelling between your browser and our servers.</li>
                <li><strong>Access Governance:</strong> Individual staff accounts with role-based permissions, and an audit log of administrative actions such as viewing privacy requests, exporting enquiries and downloading resumes.</li>
                <li><strong>Private Storage:</strong> Resumes are stored outside the public website and can be downloaded only by authorised staff.</li>
                <li><strong>Data Breach Protocol:</strong> In the unlikely event of a personal data breach affecting your information, we maintain an incident register and response procedure to notify the <strong>Data Protection Board of India</strong> and affected Data Principals in the manner prescribed by law.</li>
              </ul>
            </section>

            <section className={styles.section} id="grievance">
              <h2><span>10</span> Grievance Redressal &amp; Data Protection Officer</h2>
              <p>If you have questions, wish to exercise any of your statutory rights (Access, Correction, Erasure, Nomination, or Withdrawal of Consent), or have a grievance, use our <Link href="/privacy-rights/" prefetch={false}>Your Data Rights</Link> page to get a ticket number, or contact our dedicated officer:</p>
              <div className={styles.contactPanel}>
                <h3>Data Protection &amp; Grievance Redressal Officer</h3>
                <p className={styles.panelSub}>Designated under Section 8(9) &amp; Section 13 of the DPDP Act, 2023</p>
                <dl className={styles.contactGrid}>
                  <div><dt>Company Name</dt><dd>Technoculture Building Centre Pvt. Ltd. (Vastu Vihar)</dd></div>
                  <div><dt>Dedicated Email</dt><dd><a href="mailto:privacy@vastuvihar.org">privacy@vastuvihar.org</a></dd></div>
                  <div><dt>Escalation Email</dt><dd><a href="mailto:complaint.officer@vastuvihar.org">complaint.officer@vastuvihar.org</a></dd></div>
                  <div><dt>Phone Helpline</dt><dd><a href="tel:+919534095340">+91 - 95340-95340</a></dd></div>
                  <div><dt>Registered Address</dt><dd>417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Patna, Bihar - 800001</dd></div>
                  <div><dt>Our Response Commitment</dt><dd>Within 30 calendar days</dd></div>
                </dl>
              </div>
              <p><strong>Escalation to Data Protection Board of India (DPBI):</strong> If you do not receive a resolution from our Grievance Officer within 30 days, or if you are dissatisfied with the resolution provided, you hold the statutory right to file a complaint directly before the <strong>Data Protection Board of India</strong> in accordance with Section 13(3) of the DPDP Act.</p>
            </section>
          </div>
        </div>
      </main>
      <BreadcrumbJsonLd items={[{ name: 'Privacy Policy' }]} />
    </PageLayout>
  );
}
