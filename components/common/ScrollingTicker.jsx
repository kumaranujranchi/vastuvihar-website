/**
 * Generic infinite scrolling marquee ribbon atom styled for the Spaciaz/Elementor theme.
 *
 * @param {Object} props
 * @param {string} props.text - The repeating text label (e.g. "meet the team", "core values")
 * @param {string} [props.separator] - Separator symbol between repeated labels (default "·")
 * @param {number} [props.repeat] - Number of repeating inner blocks (default 6)
 * @param {string} [props.widgetId] - Optional Elementor widget data-id
 * @param {string} [props.className] - Additional CSS class names
 */
export default function ScrollingTicker({
  text,
  separator = '·',
  repeat = 6,
  widgetId = 'scrolling-ticker',
  className = '',
}) {
  const items = Array.from({ length: repeat });

  return (
    <div
      className={`elementor-element elementor-element-${widgetId} box-width-yes elementor-widget__width-initial animated-fast spaciaz-scrolling-ltr elementor-invisible elementor-widget elementor-widget-spaciaz-slide-scrolling ${className}`}
      data-id={widgetId}
      data-element_type="widget"
      data-settings='{"_animation":"opal-helix"}'
      data-widget_type="spaciaz-slide-scrolling.default"
    >
      <div className="elementor-widget-container">
        <div className="elementor-scrolling">
          <div className="elementor-scrolling-wrapper">
            {items.map((_, i) => (
              <div className="elementor-scrolling-inner" key={i}>
                <div className="elementor-scrolling-item">
                  <div className="elementor-scrolling-item-inner">
                    <div className="scrolling-title">
                      <span>{text}</span>
                    </div>
                  </div>
                </div>
                <div className="elementor-scrolling-item">
                  <div className="elementor-scrolling-item-inner">
                    <div className="scrolling-title">
                      <span>{separator}</span>
                    </div>
                  </div>
                </div>
                <div className="elementor-scrolling-item">
                  <div className="elementor-scrolling-item-inner">
                    <div className="scrolling-title">
                      <span>{text}</span>
                    </div>
                  </div>
                </div>
                <div className="elementor-scrolling-item">
                  <div className="elementor-scrolling-item-inner">
                    <div className="scrolling-title">
                      <span>{separator}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

