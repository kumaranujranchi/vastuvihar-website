import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import AwardsHeader from '@/components/awards/AwardsHeader';
import AwardsList from '@/components/awards/AwardsList';

import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Awards & Recognition | Vastu Vihar',
  description:
    'Discover recognitions associated with Vastu Vihar founder Vinay Kumar Tiwary, including the Vishwesariya Award and Bharat Nirman Ratna Award.',
  path: '/our-awards/',
});

export default function OurAwardsPage() {
  return (
    <PageLayout route="our-awards">
      {/* <Breadcrumb title="Our awards" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="53" className="elementor elementor-53">
                <AwardsHeader />
                <AwardsList />
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'Awards & Recognition' }]} />
    </PageLayout>
  );
}
