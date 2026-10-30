import '../styles/pages/home.css';
import NewsSection from '@/components/home/NewsSection';
import ImageSection from '@/components/home/ImageSection';
import StatsSection from '@/components/home/StatsSection';
import ValuesSection from '@/components/home/ValuesSection';
import CareersSection from '@/components/home/CareersSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import CompanySection from '@/components/home/CompanySection';
import PartnersSection from '@/components/home/PartnersSection';
import HeroSection from '@/components/home/HeroSection';
import PageLayout from '@/components/PageLayout';
export const metadata = {
  title: 'Home',
  description:
    'We developed landmark real estate projects that deliver lasting value to investors and communities. Defining the standards of real estate development view all projects we’re proud to partner with best-in-class clients who we are · who we ar',
};
export default function HomePage() {
  return (
    <PageLayout route="home">
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div
                data-elementor-type="wp-page"
                data-elementor-id="6353"
                className="elementor elementor-6353"
              >
                <HeroSection />
                <PartnersSection />
                <CompanySection />

                <ProjectsSection />
                <CareersSection />
                <div
                  className="custom-elementor-parallax"
                  data-id="1659d28"
                  data-settings={
                    '{"type":"scroll","speed":"1.2","keepImg":"true","imgSize":"cover","imgPosition":"50% 0%","noAndroid":"false","noIos":"false"}'
                  }
                ></div>
                <ValuesSection />
                <StatsSection />
                <ImageSection />
                <NewsSection />
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
