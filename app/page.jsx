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
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Vastu Vihar: Bungalows & Flats in Bihar & Eastern India',
  description:
    'Vastu Vihar has built homes since 1994. Explore bungalows, row houses and flats across Bihar and Eastern India, with floor plans, price lists and branch offices.',
  path: '/',
});

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
