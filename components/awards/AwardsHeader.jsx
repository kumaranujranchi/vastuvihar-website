import './AwardsHeader.css';
import Link from 'next/link';
import ScrollingTicker from '@/components/common/ScrollingTicker';

export default function AwardsHeader() {
  return (
    <>
      <div
        className="elementor-element elementor-element-552538a e-con-full e-flex e-con e-parent"
        data-id="552538a"
        data-element_type="container"
        data-settings='{"background_background":"classic"}'
      >
        <div
          className="elementor-element elementor-element-88278ca e-flex e-con-boxed e-con e-child"
          data-id="88278ca"
          data-element_type="container"
        >
          <div className="e-con-inner">
            <div
              className="elementor-element elementor-element-427c553 elementor-widget elementor-widget-page-title"
              data-id="427c553"
              data-element_type="widget"
              data-widget_type="page-title.default"
            >
              <div className="elementor-widget-container">
                <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                  <h2 className="elementor-heading-title elementor-size-default">Our awards</h2>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-90fa94b e-con-full e-flex e-con e-child"
              data-id="90fa94b"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-element-b5b8a6c elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                data-id="b5b8a6c"
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
                          Our awards
                        </span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div
                className="elementor-element elementor-element-c1baefc elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
                data-id="c1baefc"
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <div className="elementor-widget-container">
                  <div className="elementor-heading-title elementor-size-default">
                    Recognising the achievements and vision behind Vastu Vihar and its commitment to accessible homeownership.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-46a8626 elementor-widget elementor-widget-spacer"
          data-id="46a8626"
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
        className="elementor-element elementor-element-27154d7 e-flex e-con-boxed e-con e-parent"
        data-id="27154d7"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <ScrollingTicker text="awards" widgetId="f013c79" />
          <div
            className="elementor-element elementor-element-c5b640d elementor-widget__width-initial animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="c5b640d"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-up"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Founder Awards &amp; Recognitions
              </h2>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-3256b2f animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="3256b2f"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-up"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-heading-title elementor-size-default">
                Vinay Kumar Tiwary, the founder of Vastu Vihar, is identified as a recipient of the Vishwesariya Award and Bharat Nirman Ratna Award in the company brochure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

