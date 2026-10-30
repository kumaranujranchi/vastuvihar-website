import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { projects } from '@/data/projects';

function modelType(model) {
  if (model.type === 'Row House') return 'row-house';
  if (model.type === 'Apartment') return 'apartment';
  return 'bungalow';
}

function startingPriceLakhs(price) {
  const match = String(price).replace('₹', '').trim().match(/^(\d+(?:\.\d+)?)\s*(Cr|Lac)?/i);
  if (!match) return null;
  return Number(match[1]) * (/^cr$/i.test(match[2] || '') ? 100 : 1);
}

function isInStartingBudget(price, budget) {
  if (!budget) return true;
  const amount = startingPriceLakhs(price);
  if (amount === null) return false;
  switch (budget) {
    case 'under-20': return amount < 20;
    case '20-40': return amount >= 20 && amount < 40;
    case '40-60': return amount >= 40 && amount < 60;
    case '60-100': return amount >= 60 && amount < 100;
    case '100-plus': return amount >= 100;
    default: return true;
  }
}

function matchesMedia(project, filter) {
  if (!filter) return true;
  const layouts = (project.modelTypes || []).flatMap((type) => type.layouts || []);
  if (filter === 'with-video') return Boolean(project.youtubeId);
  if (filter === 'with-2d') return layouts.some((layout) => layout.type === '2D');
  if (filter === 'with-3d') return layouts.some((layout) => layout.type === '3D');
  return true;
}

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
  const filteredModels = projects.filter((model) =>
    matchesMedia(model, filters.status) &&
    (!filters.type || modelType(model) === filters.type) &&
    (!filters.beds || model.bedrooms === filters.beds) &&
    isInStartingBudget(model.priceRange, filters.budget)
  );
  return (
    <PageLayout route="projects">
      <div className="breadcrumb-wrap">
        <div className="breadcrumb-overlay"></div>{' '}
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
                      </div>{' '}
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
                          <span className="hfe-breadcrumbs-home-icon"></span>
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
                              <path d="M512 512H0V0h512v512z"></path>
                            </svg>
                          </span>
                        </li>
                        <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                          <span className="hfe-breadcrumbs-text" aria-current="page">
                            Home Models
                          </span>
                        </li>
                      </ul>
                    </nav>{' '}
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
                  <div className="elementor-spacer-inner"></div>
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
                  <div className="spaciaz-project-filter">
                    <form
                      className="project-form-filter spaciaz-project-has-filter-style-1"
                      data-next-project-filter=""
                      method="get"
                      action="/projects"
                    >
                      <h4 className="filter-title">Filter</h4>
                      <select name="status" aria-label="Available media" defaultValue={filters.status}>
                        <option value="">All Models</option>
                        <option value="with-video">With Video</option>
                        <option value="with-2d">With 2D Plans</option>
                        <option value="with-3d">With 3D Plans</option>
                      </select>
                      <select name="type" aria-label="Home type" defaultValue={filters.type}>
                        <option value="">Home Type</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="row-house">Row House</option>
                        <option value="apartment">Apartment</option>
                      </select>
                      <select name="beds" aria-label="Bedrooms" defaultValue={filters.beds}>
                        <option value="">Bedrooms</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5 BHK</option>
                        <option value="7">7 BHK</option>
                      </select>
                      <select name="budget" aria-label="Starting price" defaultValue={filters.budget}>
                        <option value="">Starting Price</option>
                        <option value="under-20">Under ₹20 Lac</option>
                        <option value="20-40">₹20 – 40 Lac</option>
                        <option value="40-60">₹40 – 60 Lac</option>
                        <option value="60-100">₹60 Lac – 1 Cr</option>
                        <option value="100-plus">₹1 Cr and Above</option>
                      </select>
                      <div className="filter-wrap filter-wrap-button">
                        <button type="submit">Search</button>
                      </div>
                    </form>{' '}
                  </div>
                  <div className="archive-content-inner">
                    <div
                      style={{ '--gutter-width': '30px' }}
                      className="d-grid grid-columns-desktop-3 grid-columns-tablet-2 grid-columns-1"
                    >
                      {filteredModels.map((model) => (
                        <div className="grid-item" key={model.slug}>
                          <div
                            className="project-item project-style-2"
                            data-budget={model.priceRange}
                            data-type={modelType(model)}
                            data-status={model.youtubeId ? 'walkthrough' : 'no-walkthrough'}
                            data-beds={model.bedrooms}
                            title={model.description}
                          >
                            <div className="project-post-thumbnail">
                              <img
                                width="1920"
                                height="1344"
                                src={model.image}
                                className="attachment-full size-full wp-post-image"
                                alt={model.title}
                                loading="lazy"
                                decoding="async"
                              />{' '}
                            </div>
                            <div className="project-content">
                              <div className="project-status">
                                <Link href={`/projects/${model.slug}/`} prefetch={false}>
                                  {model.priceRange}
                                </Link>
                              </div>{' '}
                              <div className="project-location">
                                <i className="spaciaz-icon-marker"></i>
                                <span>
                                  {model.bedrooms} BHK{model.builtUp !== 'Not specified' ? ` · ${model.builtUp}` : ''}
                                </span>
                              </div>{' '}
                              <h4 className="project-title delta">
                                <Link href={`/projects/${model.slug}/`} prefetch={false}>
                                  {model.title}
                                </Link>
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>{' '}
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
