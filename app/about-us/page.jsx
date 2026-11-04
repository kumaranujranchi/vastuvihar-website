import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import AboutHeader from '@/components/about/AboutHeader';
import AboutStats from '@/components/about/AboutStats';
import AboutMilestones from '@/components/about/AboutMilestones';
import AboutLeadership from '@/components/about/AboutLeadership';
import AboutTestimonials from '@/components/about/AboutTestimonials';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'About Vastu Vihar | Trusted Homes Since 1994',
  description:
    'Discover Vastu Vihar: over three decades of trusted, affordable homes, bungalows and integrated townships across Eastern India and Nepal.',
  path: '/about-us/',
});

export default function AboutUsPage() {
  return (
    <PageLayout route="about-us">
      {/* <Breadcrumb title="About us" /> */}
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="49" className="elementor elementor-49">
                <AboutHeader />
                <AboutStats />
                <AboutMilestones />
                <AboutLeadership />
                <AboutTestimonials />
              </div>
            </main>
          </div>
        </div>
      </div>
      <BreadcrumbJsonLd items={[{ name: 'About Us' }]} />
    </PageLayout>
  );
}
