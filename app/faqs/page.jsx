import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import FaqsHeader from '@/components/faqs/FaqsHeader';
import FaqsTicker from '@/components/faqs/FaqsTicker';
import FaqAccordion from '@/components/faqs/FaqAccordion';

import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Frequently Asked Questions | Vastu Vihar',
  description:
    'Find answers about Vastu Vihar bungalows and flats, land ownership, township amenities, home loans, project locations, and booking a site visit.',
  path: '/faqs/',
});

export default function FaqsPage() {
  return (
    <PageLayout route="faqs">
      {/* <Breadcrumb title="FAQs" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="59" className="elementor elementor-59">
                <FaqsHeader />
                <FaqsTicker />

                <FaqAccordion />
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'FAQs' }]} />
    </PageLayout>
  );
}
