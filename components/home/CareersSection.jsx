import './CareersSection.css';
import Link from 'next/link';

export default function CareersSection() {
  return (
    <div
      className="elementor-element elementor-element-1659d28 e-flex e-con-boxed e-con e-parent"
      data-id="1659d28"
      data-element_type="container"
      data-settings={'{"background_background":"classic"}'}
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-8f3e9a0 animated-fast elementor-invisible elementor-widget elementor-widget-heading"
          data-id="8f3e9a0"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">Make your next</h2>{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-a1ce5d1 e-con-full animated-fast e-flex elementor-invisible e-con e-child"
          data-id="a1ce5d1"
          data-element_type="container"
          data-settings={'{"animation":"opal-move-up"}'}
        >
          <div
            className="elementor-element elementor-element-6eb9c40 elementor-widget elementor-widget-heading"
            data-id="6eb9c40"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">career </h2>{' '}
            </div>
          </div>
          <div
            className="elementor-element elementor-element-0635422 e-con-full e-flex e-con e-child"
            data-id="0635422"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-b4d2ae9 elementor-widget elementor-widget-image"
              data-id="b4d2ae9"
              data-element_type="widget"
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <img
                  loading="lazy"
                  decoding="async"
                  width="120"
                  height="120"
                  src="/employee/neeraj.jpeg"
                  className="attachment-full size-full wp-image-441"
                  alt=""
                />{' '}
              </div>
            </div>
            <div
              className="elementor-element elementor-element-7685f0a elementor-widget elementor-widget-image"
              data-id="7685f0a"
              data-element_type="widget"
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <img
                  loading="lazy"
                  decoding="async"
                  width="120"
                  height="120"
                  src="/employee/brijmohan.jpeg"
                  className="attachment-full size-full wp-image-439"
                  alt=""
                />{' '}
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d90fca2 elementor-widget elementor-widget-image"
              data-id="d90fca2"
              data-element_type="widget"
              data-widget_type="image.default"
            >
              <div className="elementor-widget-container">
                <img
                  loading="lazy"
                  decoding="async"
                  width="120"
                  height="120"
                  src="/employee/anuj.jpeg"
                  className="attachment-full size-full wp-image-440"
                  alt=""
                />{' '}
              </div>
            </div>
            <div
              className="elementor-element elementor-element-ed9c45f elementor-view-stacked elementor-shape-circle elementor-widget elementor-widget-icon"
              data-id="ed9c45f"
              data-element_type="widget"
              data-widget_type="icon.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-icon-wrapper">
                  <div className="elementor-icon">
                    <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-plus"></i>{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-0fb0e07 elementor-widget elementor-widget-heading"
            data-id="0fb0e07"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">move</h2>{' '}
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-991911a e-con-full e-flex e-con e-child"
          data-id="991911a"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-dd790e5 elementor-widget-mobile_extra__width-initial elementor-widget-mobile__width-inherit elementor-invisible elementor-widget elementor-widget-text-editor"
            data-id="dd790e5"
            data-element_type="widget"
            data-settings={'{"_animation":"opal-move-left"}'}
            data-widget_type="text-editor.default"
          >
            <div className="elementor-widget-container">
              Shape your future with us, building careers, developing communities.{' '}
            </div>
          </div>
          <div
            className="elementor-element elementor-element-d700979 enable-style-icon-yes animated-fast elementor-button-default icon-spaciaz-right elementor-invisible elementor-widget elementor-widget-spaciaz-button"
            data-id="d700979"
            data-element_type="widget"
            data-settings={'{"_animation":"opal-move-right"}'}
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
                    <span className="elementor-button-text" data-name="join our team">
                      <span>join our team</span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
