import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import ValuesHeader from '@/components/values/ValuesHeader';
import ValuesGrid from '@/components/values/ValuesGrid';

import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Core Values | Vastu Vihar',
  description:
    'Explore the core values driving Vastu Vihar: high quality, community focus, environmental sustainability, innovation, and genuine partnership.',
  path: '/core-values/',
});

export default function CoreValuesPage() {
  return (
    <PageLayout route="core-values">
      {/* <Breadcrumb title="Core values" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="51" className="elementor elementor-51">
                <ValuesHeader />
                <ValuesGrid />
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'Core Values' }]} />
    </PageLayout>
  );
}
