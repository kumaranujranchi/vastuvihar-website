import './ValuesHeader.css';
import Link from 'next/link';
import ScrollingTicker from '@/components/common/ScrollingTicker';

export default function ValuesHeader() {
  return (
    <>
      <div
        className="elementor-element elementor-element-844e8d9 e-con-full e-flex e-con e-parent"
        data-id="844e8d9"
        data-element_type="container"
        data-settings='{"background_background":"classic"}'
      >
        <div
          className="elementor-element elementor-element-98c2727 e-flex e-con-boxed e-con e-child"
          data-id="98c2727"
          data-element_type="container"
        >
          <div className="e-con-inner">
            <div
              className="elementor-element elementor-element-56f1e89 elementor-widget elementor-widget-page-title"
              data-id="56f1e89"
              data-element_type="widget"
              data-widget_type="page-title.default"
            >
              <div className="elementor-widget-container">
                <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h2 className="elementor-heading-title elementor-size-default">Core values</h2>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-b7d6c2f e-con-full e-flex e-con e-child"
              data-id="b7d6c2f"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-element-8fde12d elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                data-id="8fde12d"
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
                          Core values
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div
                className="elementor-element elementor-element-af073b2 elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
                data-id="af073b2"
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <div className="elementor-widget-container">
                  <div className="elementor-heading-title elementor-size-default">
                    Whether you’re building, remodeling, buying, or selling, we bring seamless project execution under one roof.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-4ffbccd elementor-widget elementor-widget-spacer"
          data-id="4ffbccd"
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
        className="elementor-element elementor-element-78ae68a e-flex e-con-boxed e-con e-parent"
        data-id="78ae68a"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-88d7663 e-con-full e-flex e-con e-child"
            data-id="88d7663"
            data-element_type="container"
          >
            <ScrollingTicker text="core values" widgetId="e9885a3" />
          </div>
          <div
            className="elementor-element elementor-element-a040cf8 e-con-full e-flex e-con e-child"
            data-id="a040cf8"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-6dc7d84 animated-fast elementor-invisible elementor-widget elementor-widget-heading"
              data-id="6dc7d84"
              data-element_type="widget"
              data-settings='{"_animation":"opal-move-up"}'
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h2 className="elementor-heading-title elementor-size-default">
                  An exceptional quality that can’t be beaten
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

