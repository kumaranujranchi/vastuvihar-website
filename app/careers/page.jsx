import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import CareersHeader from '@/components/careers/CareersHeader';
import CareersOpportunities from '@/components/careers/CareersOpportunities';
import CareersShowcase from '@/components/careers/CareersShowcase';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Careers | Vastu Vihar',
  description:
    'Join our team of architects, engineers, project managers, and property specialists shaping the future of affordable and quality living across Eastern India.',
  path: '/careers/',
});

export default function CareersPage() {
  return (
    <PageLayout route="careers">
      <Breadcrumb title="Careers" />
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="57" className="elementor elementor-57">
                <CareersHeader />
                <div
                  className="elementor-element elementor-element-7235bdb e-flex e-con-boxed e-con e-parent"
                  data-id="7235bdb"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <CareersOpportunities />
                    <CareersShowcase />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
