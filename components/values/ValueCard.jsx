export default function ValueCard({ value, index }) {
  const animationDelay = index > 0 ? (index % 4) * 100 : undefined;
  return (
    <div
      className={`elementor-element elementor-element-${value.id} e-con-full animated-fast e-flex elementor-invisible e-con e-child`}
      data-id={value.id}
      data-element_type="container"
      data-settings={JSON.stringify({ animation: 'opal-move-up', ...(animationDelay ? { animation_delay: animationDelay } : {}) })}
    >
      <div
        className="elementor-element elementor-view-default elementor-widget elementor-widget-icon"
        data-element_type="widget"
        data-widget_type="icon.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-icon-wrapper">
            <div
              className="elementor-icon"
              dangerouslySetInnerHTML={{ __html: value.svg }}
            />
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-widget-divider--view-line elementor-widget elementor-widget-divider"
        data-element_type="widget"
        data-widget_type="divider.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-divider">
            <span className="elementor-divider-separator" />
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-widget elementor-widget-heading"
        data-element_type="widget"
        data-widget_type="heading.default"
      >
        <div className="elementor-widget-container">
          <h5
            className="elementor-heading-title elementor-size-default"
            dangerouslySetInnerHTML={{ __html: value.title }}
          />
        </div>
      </div>
      <div
        className="elementor-element elementor-widget elementor-widget-heading"
        data-element_type="widget"
        data-widget_type="heading.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-heading-title elementor-size-default">
            {value.description}
          </div>
        </div>
      </div>
    </div>
  );
}

