import './CareersOpportunities.css';
import Link from 'next/link';

export default function CareersOpportunities() {
  return (
    <div
      className="elementor-element elementor-element-a2361a3 e-con-full e-flex e-con e-child"
      data-id="a2361a3"
      data-element_type="container"
    >
      <div
        className="elementor-element elementor-element-824200b e-con-full animated-fast e-flex elementor-invisible e-con e-child"
        data-id="824200b"
        data-element_type="container"
        data-settings='{"background_background":"classic","animation":"opal-move-right"}'
      >
        <div
          className="elementor-element elementor-element-e056540 elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-spacer"
          data-id="e056540"
          data-element_type="widget"
          data-settings='{"_position":"absolute","spaciaz_decor_top_left":"yes","spaciaz_decor_bottom_right":"yes"}'
          data-widget_type="spacer.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-spacer">
              <div className="elementor-spacer-inner" />
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-bb42b48 elementor-view-stacked elementor-shape-circle elementor-widget elementor-widget-icon"
          data-id="bb42b48"
          data-element_type="widget"
          data-widget_type="icon.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-wrapper">
              <div className="elementor-icon">
                <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-sms-tracking" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-c9065a7 elementor-widget__width-initial elementor-widget elementor-widget-heading"
          data-id="c9065a7"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h4 className="elementor-heading-title elementor-size-default">
              Opportunities with us
            </h4>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-3b1b6f1 elementor-widget elementor-widget-text-editor"
          data-id="3b1b6f1"
          data-element_type="widget"
          data-widget_type="text-editor.default"
        >
          <div className="elementor-widget-container">
            <p>
              We are always up to discover new talents, kindly mail us your resume and portfolio link to
            </p>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-6f263f1 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button"
          data-id="6f263f1"
          data-element_type="widget"
          data-widget_type="spaciaz-button.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <a
                href="mailto:hr@vastuvihar.org"
                className="elementor-button-link elementor-button elementor-size-sm"
                role="button"
              >
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-text" data-name="hr@vastuvihar.org">
                    <span>
                      <span>hr@vastuvihar.org</span>
                    </span>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-36cd356 enable-style-icon-yes elementor-button-default icon-spaciaz-right elementor-widget elementor-widget-spaciaz-button"
          data-id="36cd356"
          data-element_type="widget"
          data-widget_type="spaciaz-button.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <Link
                href="/contact/"
                className="elementor-button-link elementor-button elementor-size-sm"
                role="button"
                prefetch={false}
              >
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-icon">
                    <span className="btn-icon-wrap">
                      <span className="btn-icon">
                        <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-arrow-long-right" />
                      </span>
                      <span className="btn-icon-hover">
                        <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-arrow-long-right" />
                      </span>
                    </span>
                  </span>
                  <span className="elementor-button-text" data-name="contact us">
                    <span>contact us</span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

