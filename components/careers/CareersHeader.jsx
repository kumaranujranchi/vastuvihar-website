import './CareersHeader.css';
import Link from 'next/link';
import ScrollingTicker from '@/components/common/ScrollingTicker';

export default function CareersHeader() {
  return (
    <>
      <div
        className="elementor-element elementor-element-b227e97 e-con-full e-flex e-con e-parent"
        data-id="b227e97"
        data-element_type="container"
        data-settings='{"background_background":"classic"}'
      >
        <div
          className="elementor-element elementor-element-2c355f9 e-flex e-con-boxed e-con e-child"
          data-id="2c355f9"
          data-element_type="container"
        >
          <div className="e-con-inner">
            {/* <div
              className="elementor-element elementor-element-b86a822 elementor-widget elementor-widget-page-title"
              data-id="b86a822"
              data-element_type="widget"
              data-widget_type="page-title.default"
            >
              <div className="elementor-widget-container">
                <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h2 className="elementor-heading-title elementor-size-default">Careers</h2>
                </div>
              </div>
            </div> */}
            <div
              className="elementor-element elementor-element-9e12080 e-con-full e-flex e-con e-child"
              data-id="9e12080"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-element-a5fc0ea elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                data-id="a5fc0ea"
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
                          Careers
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              {/* <div
                className="elementor-element elementor-element-b529949 elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
                data-id="b529949"
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <div className="elementor-widget-container">
                  <div className="elementor-heading-title elementor-size-default">
                    We’re a team of designers, engineers, and real estate professionals who believe in creating exceptional spaces.
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-b1db6a2 elementor-widget elementor-widget-spacer"
          data-id="b1db6a2"
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

      <div
        className="elementor-element elementor-element-2fe4001 e-flex e-con-boxed e-con e-parent"
        data-id="2fe4001"
        data-element_type="container"
        data-settings='{"background_background":"classic"}'
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-2244a03 e-con-full e-flex e-con e-child"
            data-id="2244a03"
            data-element_type="container"
          >
            {/* <ScrollingTicker text="Join our team" widgetId="a2bf2a4" /> */}
          </div>
        </div>
      </div>
    </>
  );
}

