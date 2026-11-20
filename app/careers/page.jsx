import './careers.css';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import CareersHeader from '@/components/careers/CareersHeader';
import CareersOpportunities from '@/components/careers/CareersOpportunities';
import CareersShowcase from '@/components/careers/CareersShowcase';
import { createPageMetadata } from '@/lib/metadata';
import { orEmpty, prisma } from '@/lib/prisma';

export const metadata = createPageMetadata({
  title: 'Careers | Vastu Vihar',
  description: 'Join our team shaping the future of affordable and quality living across Eastern India.',
  path: '/careers/',
});

// Rendered on each request, because it reads the database. The Cloudflare build has no
// writable page cache (open-next.config.ts), so a cached copy would never refresh.
export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const activeJobs = await prisma.jobVacancy.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      requirements: true,
      department: true,
      type: true,
      location: true,
    },
  }).catch(orEmpty('Careers'));

  return (
    <PageLayout route="careers">
      <div id="content" className="site-content-page clear" tabIndex={-1}>
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div className="vv-careers-page">
                <CareersHeader />

                <div className="vv-careers-page__content">
                  <CareersOpportunities />
                  <CareersShowcase jobs={activeJobs} />
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
