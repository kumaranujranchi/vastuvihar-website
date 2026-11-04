import './ContactHeader.css';
import Link from 'next/link';

export default function ContactHeader() {
  return (
    <div
      className="elementor-element elementor-element-dd4cc01 e-con-full e-flex e-con e-parent"
      data-id="dd4cc01"
      data-element_type="container"
      data-settings='{"background_background":"classic"}'
    >
      <div
        className="elementor-element elementor-element-49de9ae e-flex e-con-boxed e-con e-child"
        data-id="49de9ae"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-03bf66d elementor-widget elementor-widget-page-title"
            data-id="03bf66d"
            data-element_type="widget"
            data-widget_type="page-title.default"
          >
            <div className="elementor-widget-container">
              <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                <h1 className="elementor-heading-title elementor-size-default">Get in touch</h1>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-f99e958 e-con-full e-flex e-con e-child"
            data-id="f99e958"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-d07b84b elementor-widget elementor-widget-hfe-breadcrumbs-widget"
              data-id="d07b84b"
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
                        Get in touch
                      </span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-0af00e4 elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
              data-id="0af00e4"
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-heading-title elementor-size-default">
                  The Vastu Vihar team is here to help you explore homes and bungalows,
                  arrange site visits, and answer your property enquiries.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-6e1c396 elementor-widget elementor-widget-spacer"
        data-id="6e1c396"
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
  );
}

