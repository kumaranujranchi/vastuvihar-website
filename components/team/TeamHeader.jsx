import './TeamHeader.css';
import Link from 'next/link';

export default function TeamHeader() {
  return (
    <div
      className="elementor-element elementor-element-5936bc9 e-con-full e-flex e-con e-parent"
      data-id="5936bc9"
      data-element_type="container"
      data-settings={'{"background_background":"classic"}'}
    >
      <div
        className="elementor-element elementor-element-87ad9ab e-flex e-con-boxed e-con e-child"
        data-id="87ad9ab"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-917b369 elementor-widget elementor-widget-page-title"
            data-id="917b369"
            data-element_type="widget"
            data-widget_type="page-title.default"
          >
            <div className="elementor-widget-container">
              <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                <h2 className="elementor-heading-title elementor-size-default">Our team</h2>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-6962f3f e-con-full e-flex e-con e-child"
            data-id="6962f3f"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-444a706 elementor-widget elementor-widget-hfe-breadcrumbs-widget"
              data-id="444a706"
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
                        Our team
                      </span>
                    </li>
                  </ul>
                </nav>{' '}
              </div>
            </div>
            <div
              className="elementor-element elementor-element-476b79c elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
              data-id="476b79c"
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-heading-title elementor-size-default">
                  Our team brings together licensed contractors and real estate experts who work
                  to help you achieve your goals.
                </div>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-0f4ab67 elementor-widget elementor-widget-spacer"
        data-id="0f4ab67"
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
  );
}
