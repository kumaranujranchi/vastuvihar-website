import '../../styles/pages/contact.css';
import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import ContactHeader from '@/components/contact/ContactHeader';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactSection from '@/components/contact/ContactSection';

import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Get in Touch | Vastu Vihar',
  description:
    'Get in touch with our team of real estate experts for consultations, model inquiries, site visits, and support across Eastern India.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageLayout route="contact">
      {/* <Breadcrumb title="Get in touch" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="61" className="elementor elementor-61">
                <ContactHeader />
                <div
                  className="elementor-element elementor-element-e645870 e-flex e-con-boxed e-con e-parent"
                  data-id="e645870"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <ContactInfoCards />
                    <ContactSection />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'Contact' }]} />
    </PageLayout>
  );
}
