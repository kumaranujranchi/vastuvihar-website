import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import TeamHeader from '@/components/team/TeamHeader';
import TeamGrid from '@/components/team/TeamGrid';
import TeamCTA from '@/components/team/TeamCTA';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = {
  ...createPageMetadata({
    title: 'Our Team | Vastu Vihar',
    description:
      'Meet our licensed contractors, engineers, architects, and real estate experts dedicated to building quality residential communities.',
    path: '/our-team/',
  }),
  // Placeholder team content: remove this, and add the page to app/sitemap.ts, once it is real.
  robots: { index: false },
};

export default function OurTeamPage() {
  return (
    <PageLayout route="our-team">
      {/* <Breadcrumb title="Our team" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="55" className="elementor elementor-55">
                <TeamHeader />
                <TeamGrid />
                <TeamCTA />
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
