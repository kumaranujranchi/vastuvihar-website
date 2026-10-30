import Link from 'next/link';

export default function TeamCTA() {
  return (
    <div
      className="elementor-element elementor-element-350c238 e-flex e-con-boxed e-con e-parent"
      data-id="350c238"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-8468b36 elementor-widget__width-initial animated-fast elementor-view-default elementor-position-top elementor-mobile-position-top elementor-invisible elementor-widget elementor-widget-icon-box"
          data-id="8468b36"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-down"}'}
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-people"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h6 className="elementor-icon-box-title">
                  <span>Join our team </span>
                </h6>
                <p className="elementor-icon-box-description">
                  Start a career with excellent benefits{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-ab1f96d enable-style-icon-yes animated-fast elementor-button-outline icon-spaciaz-right elementor-invisible elementor-widget elementor-widget-spaciaz-button"
          data-id="ab1f96d"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="spaciaz-button.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <Link
                href="/careers/"
                className="elementor-button-link elementor-button elementor-size-sm"
                role="button"
                prefetch={false}
              >
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-icon">
                    <span className="btn-icon-wrap">
                      <span className="btn-icon">
                        <i
                          aria-hidden="true"
                          className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                        ></i>{' '}
                      </span>
                      <span className="btn-icon-hover">
                        <i
                          aria-hidden="true"
                          className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                        ></i>{' '}
                      </span>
                    </span>
                  </span>
                  <span className="elementor-button-text" data-name="Current openings ">
                    <span>Current openings </span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-3eda1ac elementor-absolute animated-fast elementor-hidden-mobile elementor-invisible elementor-widget elementor-widget-image"
          data-id="3eda1ac"
          data-element_type="widget"
          data-settings={'{"_position":"absolute","_animation":"opal-scale-up"}'}
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <img
              loading="lazy"
              decoding="async"
              width="410"
              height="130"
              src="/images/page_team-1.png"
              className="attachment-full size-full wp-image-1782"
              alt=""
            />{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-01960c6 elementor-absolute animated-fast elementor-hidden-mobile elementor-invisible elementor-widget elementor-widget-image"
          data-id="01960c6"
          data-element_type="widget"
          data-settings={'{"_position":"absolute","_animation":"opal-scale-up"}'}
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <img
              loading="lazy"
              decoding="async"
              width="340"
              height="130"
              src="/images/page_team-4.png"
              className="attachment-full size-full wp-image-1789"
              alt=""
            />{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-fa5d61c elementor-absolute animated-fast elementor-hidden-mobile elementor-invisible elementor-widget elementor-widget-image"
          data-id="fa5d61c"
          data-element_type="widget"
          data-settings={'{"_position":"absolute","_animation":"opal-scale-up"}'}
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <img
              loading="lazy"
              decoding="async"
              width="340"
              height="130"
              src="/images/page_team-3.png"
              className="attachment-full size-full wp-image-1790"
              alt=""
            />{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-aa48ea5 elementor-absolute animated-fast elementor-hidden-mobile elementor-invisible elementor-widget elementor-widget-image"
          data-id="aa48ea5"
          data-element_type="widget"
          data-settings={'{"_position":"absolute","_animation":"opal-scale-up"}'}
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <img
              loading="lazy"
              decoding="async"
              width="270"
              height="130"
              src="/images/page_team-2.png"
              className="attachment-full size-full wp-image-1781"
              alt=""
            />{' '}
          </div>
        </div>
      </div>
    </div>
  );
}

