import './ValueCard.css';

export default function ValueCard({ value, index }) {
  const animationDelay = index > 0 ? (index % 4) * 100 : undefined;

  // Remove accidental outer curly braces from SVG strings.
  const cleanSvg = String(value.svg || '')
    .trim()
    .replace(/^\{\s*/, '')
    .replace(/\s*\}$/, '');

  const settings = {
    animation: 'opal-move-up',
    ...(animationDelay ? { animation_delay: animationDelay } : {}),
  };

  return (
    <div
      className={`value-card elementor-element elementor-element-${value.id} e-con-full animated-fast e-flex elementor-invisible e-con e-child`}
      data-id={value.id}
      data-element_type="container"
      data-settings={JSON.stringify(settings)}
    >
      <div
        className="value-card__icon elementor-element elementor-view-default elementor-widget elementor-widget-icon"
        data-element_type="widget"
        data-widget_type="icon.default"
      >
        {/* <div className="elementor-widget-container">
          <div className="elementor-icon-wrapper">
            <div
              className="elementor-icon"
              dangerouslySetInnerHTML={{ __html: cleanSvg }}
            />
          </div>
        </div> */}
      </div>

      <div
        className="value-card__divider elementor-element elementor-widget-divider--view-line elementor-widget elementor-widget-divider"
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
        className="value-card__title elementor-element elementor-widget elementor-widget-heading"
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
        className="value-card__description elementor-element elementor-widget elementor-widget-heading"
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
