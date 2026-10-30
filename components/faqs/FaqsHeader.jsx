import Link from 'next/link';

export default function FaqsHeader() {
  return (
    <div
      className="elementor-element elementor-element-184cccf e-con-full e-flex e-con e-parent"
      data-id="184cccf"
      data-element_type="container"
      data-settings='{"background_background":"classic"}'
    >
      <div
        className="elementor-element elementor-element-514fb02 e-flex e-con-boxed e-con e-child"
        data-id="514fb02"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-3183bcf elementor-widget elementor-widget-page-title"
            data-id="3183bcf"
            data-element_type="widget"
            data-widget_type="page-title.default"
          >
            <div className="elementor-widget-container">
              <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                <h2 className="elementor-heading-title elementor-size-default">FAQs</h2>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-bd15d3b e-con-full e-flex e-con e-child"
            data-id="bd15d3b"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-21df135 elementor-widget elementor-widget-hfe-breadcrumbs-widget"
              data-id="21df135"
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
                        FAQs
                      </span>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d2639a9 elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
              data-id="d2639a9"
              data-element_type="widget"
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-heading-title elementor-size-default">
                  Find answers about Vastu Vihar homes, ownership, financing, and the journey to your dream home.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-da75665 elementor-widget elementor-widget-spacer"
        data-id="da75665"
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

