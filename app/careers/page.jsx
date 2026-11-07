import '../../styles/pages/careers.css';
import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import CareersHeader from '@/components/careers/CareersHeader';
import CareersOpportunities from '@/components/careers/CareersOpportunities';
import CareersShowcase from '@/components/careers/CareersShowcase';
import { createPageMetadata } from '@/lib/metadata';
import { orEmpty, prisma } from '@/lib/prisma'; // <-- Import Prisma

export const metadata = createPageMetadata({
  title: 'Careers | Vastu Vihar',
  description: 'Join our team shaping the future of affordable and quality living across Eastern India.',
  path: '/careers/',
});

// Cached, and refreshed when a vacancy changes (lib/revalidate.ts), or hourly.
export const revalidate = 3600;

export default async function CareersPage() {
  // Dynamically fetch active job vacancies directly from the database
  const activeJobs = await prisma.jobVacancy.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }).catch(orEmpty('Careers'));

  return (
    <PageLayout route="careers">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              {/* The careers banner has no visible title, so the page heading is for assistive tech and crawlers. */}
              <h1 className="screen-reader-text">Careers at Vastu Vihar</h1>
              <div data-elementor-type="wp-page" data-elementor-id="57" className="elementor elementor-57">
                <CareersHeader />
                <div
                  className="elementor-element elementor-element-7235bdb e-flex e-con-boxed e-con e-parent"
                  data-id="7235bdb"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <CareersOpportunities />
                    {/* Pass the fetched jobs to the showcase component */}
                    <CareersShowcase jobs={activeJobs} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'Careers' }]} />
    </PageLayout>
  );
}