import './ProjectBreadcrumb.css';
// Shared project section. Its layout is reused for every project.
import Link from 'next/link';
export default function ProjectBreadcrumb({ project }) {
  return (
    <div className="breadcrumb-wrap">
      <div className="breadcrumb-overlay"></div>{' '}
      <div data-elementor-type="wp-post" data-elementor-id="2399" className="elementor elementor-2399">
        <div
          className="elementor-element elementor-element-2e5eb79 e-con-full e-flex e-con e-parent"
          data-id="2e5eb79"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-1b51338 e-flex e-con-boxed e-con e-child"
            data-id="1b51338"
            data-element_type="container"
          >
            <div className="e-con-inner">
              <div
                className="elementor-element elementor-element-17a4b8a elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                data-id="17a4b8a"
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
                      <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                        <span className="hfe-breadcrumbs-home-icon"></span>
                        <Link href="/projects" prefetch={false}>
                          <span className="hfe-breadcrumbs-text">Models</span>
                        </Link>
                      </li>
                      <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                        <span className="hfe-breadcrumbs-text" aria-current="page">
                          {project.title}
                        </span>
                      </li>
                    </ul>
                  </nav>{' '}
                </div>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-c50fdb1 elementor-widget elementor-widget-spacer"
            data-id="c50fdb1"
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
  );
}
