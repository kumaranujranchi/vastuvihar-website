import '../../../styles/pages/contact.css';
import '../../../components/contact/ContactHeader.css';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import SiteContactView from '@/components/contact/SiteContactView';
import { createPageMetadata } from '@/lib/metadata';
import styles from './site-contact.module.css';

export const metadata = createPageMetadata({
  title: 'Vastu Vihar Project Sites: Addresses & Phone Numbers',
  description: 'Find the address and phone number of Vastu Vihar project sites to plan a site visit, listed by state and city.',
  path: '/contact/site-contact/',
});

export default function SiteContactPage() {
  return (
    <PageLayout route="contact">
      {/* <Breadcrumb title="Site Contact" /> */}
      <div id="content" className={`site-content-page clear ${styles.page}`} tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="61" className="elementor elementor-61">
                <div className={`elementor-element elementor-element-dd4cc01 e-con-full e-flex e-con e-parent ${styles.banner}`}>
                  <div className={`elementor-element elementor-element-49de9ae e-flex e-con-boxed e-con e-child ${styles.bannerBox}`}>
                    <div className={`e-con-inner ${styles.bannerInner}`}>
                      <div className="elementor-element elementor-element-03bf66d elementor-widget elementor-widget-page-title">
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h1 className="elementor-heading-title elementor-size-default">Site Contact</h1>
                          </div>
                        </div>
                      </div>
                      <div className="elementor-element elementor-element-f99e958 e-con-full e-flex e-con e-child">
                        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
                          <Link href="/" prefetch={false}>Home</Link>
                          <span aria-hidden="true">/</span>
                          <Link href="/contact" prefetch={false}>Contact</Link>
                          <span aria-hidden="true">/</span>
                          <span aria-current="page">Site Contact</span>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SiteContactView />
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'Contact', path: '/contact/' }, { name: 'Site Contact' }]} />
    </PageLayout>
  );
}
