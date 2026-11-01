import '../../styles/pages/careers.css';
import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import CareersHeader from '@/components/careers/CareersHeader';
import CareersOpportunities from '@/components/careers/CareersOpportunities';
import CareersShowcase from '@/components/careers/CareersShowcase';
import { createPageMetadata } from '@/lib/metadata';
import { prisma } from '@/lib/prisma'; // <-- Import Prisma

export const metadata = createPageMetadata({
  title: 'Careers | Vastu Vihar',
  description: 'Join our team shaping the future of affordable and quality living across Eastern India.',
  path: '/careers/',
});

export default async function CareersPage() {
  // Dynamically fetch active job vacancies directly from the database
  const activeJobs = await prisma.jobVacancy.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PageLayout route="careers">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
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
                    {/* Pass the fetched jobs to the showcase component */}
                    <CareersShowcase jobs={activeJobs} />
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