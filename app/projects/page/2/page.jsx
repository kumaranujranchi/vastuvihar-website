import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
export const metadata = {
  title: 'Projects – Page 2',
  description:
    'FilterProject StatusCompletedUnder ConstructionProject TypeApartmentBuildingIndustrialOfficeResidentialVillaProject LocationBay Shore, NYChula Vista, CAHollywood, FloridaHuntsville, AlabamaNew York, NYPhoenix, AZSpotswood, NJSurprise, AZWoo',
};
export default function ProjectsPage2Page() {
  return (
    <PageLayout route="projects/page/2">
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
                            Projects
                          </span>
                        </span>
                      </div>{' '}
                      <h1 className="spaciaz-title">Our Projects</h1>
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
                            Projects
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
                    >
                      <h4 className="filter-title">Filter</h4>
                      <select name="status" aria-label="status" defaultValue="">
                        <option value="">Project Status</option>
                        <option value="completed">Completed</option>
                        <option value="under-construction">Under Construction</option>
                      </select>
                      <select name="type" aria-label="type" defaultValue="">
                        <option value="">Project Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="building">Building</option>
                        <option value="industrial">Industrial</option>
                        <option value="office">Office</option>
                        <option value="residential">Residential</option>
                        <option value="villa">Villa</option>
                      </select>
                      <select name="location" aria-label="location" defaultValue="">
                        <option value="">Project Location</option>
                        <option value="bay-shore-ny">Bay Shore, NY</option>
                        <option value="chula-vista-ca">Chula Vista, CA</option>
                        <option value="hollywood-florida">Hollywood, Florida</option>
                        <option value="huntsville-alabama">Huntsville, Alabama</option>
                        <option value="new-york-ny">New York, NY</option>
                        <option value="phoenix-az">Phoenix, AZ</option>
                        <option value="spotswood-nj">Spotswood, NJ</option>
                        <option value="surprise-az">Surprise, AZ</option>
                        <option value="woodbury-ny">Woodbury, NY</option>
                      </select>
                      <select name="budget" aria-label="budget" defaultValue="">
                        <option value="">Project Budget</option>
                        <option value="400k-1-2m">$400k – $1.2M</option>
                        <option value="500k-1-7m">$500k – $1.7M</option>
                        <option value="600k-1-9m">$600k – $1.9M</option>
                        <option value="700k-2m">$700k – $2M</option>
                        <option value="800k-2-2m">$800k – $2.2M</option>
                        <option value="900k-2-5m">$900k – $2.5M</option>
                      </select>
                      <div className="filter-wrap filter-wrap-button">
                        <button type="submit">Search</button>
                      </div>
                    </form>{' '}
                  </div>
                  <div className="archive-content-inner">
                    <div
                      style={{
                        '--gutter-width': '30px',
                      }}
                      className="d-grid grid-columns-desktop-3 grid-columns-tablet-2 grid-columns-1"
                    >
                      {' '}
                      <div className="grid-item">
                        <div
                          className="project-item project-style-2"
                          data-budget="500k-1-7m"
                          data-location="hollywood-florida"
                          data-type="industrial"
                          data-status="under-construction"
                        >
                          <div className="project-post-thumbnail">
                            <img
                              width="1920"
                              height="1430"
                              src="/images/project_1.jpg"
                              className="attachment-full size-full wp-post-image"
                              alt=""
                              decoding="async"
                            />{' '}
                          </div>
                          <div className="project-content">
                            <div className="project-status">
                              <Link href="/project-status/under-construction/" rel="tag" prefetch={false}>
                                Under Construction
                              </Link>
                            </div>{' '}
                            <div className="project-location">
                              <i className="spaciaz-icon-marker"></i>
                              <Link href="/project-location/hollywood-florida/" rel="tag" prefetch={false}>
                                Hollywood, Florida
                              </Link>
                            </div>{' '}
                            <h4 className="project-title delta">
                              <Link href="/projects/business-center/" prefetch={false}>
                                Business Center
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pagination">
                      <ul className="page-numbers">
                        <li>
                          <Link className="prev page-numbers" href="/projects/" prefetch={false}></Link>
                        </li>
                        <li>
                          <Link className="page-numbers" href="/projects/" prefetch={false}>
                            1
                          </Link>
                        </li>
                        <li>
                          <span aria-current="page" className="page-numbers current">
                            2
                          </span>
                        </li>
                      </ul>
                    </div>{' '}
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
