import '../../styles/pages/projects.css';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { filterProjects } from '@/data/project-filters';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';

export const metadata = {
  title: 'Homes & Bungalow Models | Vastu Vihar',
  description: 'Explore Vastu Vihar bungalow, row house and apartment designs, floor plans and indicative prices.',
};

export default async function ProjectsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const filters = {
    status: typeof params.status === 'string' ? params.status : '',
    type: typeof params.type === 'string' ? params.type : '',
    beds: typeof params.beds === 'string' ? params.beds : '',
    budget: typeof params.budget === 'string' ? params.budget : '',
  };

  const filteredModels = filterProjects(projects, filters);

  return (
    <PageLayout route="projects">
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-overlay" />
        <div data-elementor-type="wp-post" data-elementor-id="4326" className="elementor elementor-4326">
          <div
            className="elementor-element elementor-element-01909e9 e-con-full e-flex e-con e-parent"
            data-id="01909e9"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-c4ae009 e-flex e-con-boxed e-con e-child"
              data-id="c4ae009"
              data-element_type="container"
            >
              <div className="e-con-inner">
                <div
                  className="elementor-element elementor-element-295b751 hidden-spaciaz-list-item-yes elementor-widget elementor-widget-spaciaz-breadcrumb"
                  data-id="295b751"
                  data-element_type="widget"
                  data-widget_type="spaciaz-breadcrumb.default"
                >
                  <div className="elementor-widget-container">
                    <div className="breadcrumb" typeof="BreadcrumbList" vocab="https://schema.org/">
                      <div className="breadcrumb-listItem">
                        <span property="itemListElement" typeof="ListItem">
                          <Link
                            property="item"
                            typeof="WebPage"
                            title="Go to Home."
                            href="/"
                            className="home"
                            prefetch={false}
                          >
                            <span property="name">Home</span>
                          </Link>
                        </span>{' '}
                        &gt;{' '}
                        <span property="itemListElement" typeof="ListItem">
                          <span property="name" className="archive post-spaciaz_project-archive current-item">
                            Home Models
                          </span>
                        </span>
                      </div>
                      <h1 className="spaciaz-title">Our Home Models</h1>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-element elementor-element-5b44ace elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                  data-id="5b44ace"
                  data-element_type="widget"
                  data-widget_type="hfe-breadcrumbs-widget.default"
                >
                  <div className="elementor-widget-container">
                    <nav aria-label="Breadcrumb">
                      <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                          <span className="hfe-breadcrumbs-home-icon" />
                          <Link href="/" prefetch={false}>
                            <span className="hfe-breadcrumbs-text">Home</span>
                          </Link>
                        </li>
                        <li className="hfe-breadcrumbs-separator">
                          <span className="hfe-breadcrumbs-separator-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square-full"
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 512H0V0h512v512z" />
                            </svg>
                          </span>
                        </li>
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                          <span className="hfe-breadcrumbs-text" aria-current="page">
                            Home Models
                          </span>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-2638992 elementor-widget elementor-widget-spacer"
              data-id="2638992"
              data-element_type="widget"
              data-widget_type="spacer.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-spacer">
                  <div className="elementor-spacer-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="content" className="site-content clear" tabIndex="-1">
        <div className="col-fluid">
          <div className="project-archive-style-2 col-full">
            <div id="primary" className="content-area">
              <main id="main" className="site-main" role="main">
                <div className="project-archive-content has-filter-style-1">
                  <ProjectFilters filters={filters} />
                  <div className="archive-content-inner">
                    <div
                      style={{ '--gutter-width': '30px' }}
                      className="d-grid grid-columns-desktop-3 grid-columns-tablet-2 grid-columns-1"
                    >
                      {filteredModels.map((model) => (
                        <ProjectCard key={model.slug} model={model} />
                      ))}
                    </div>
                    {filteredModels.length === 0 && (
                      <p>No models match your filters. Please change your selection and try again.</p>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
