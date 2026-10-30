/**
 * Standard Elementor counter widget atom for displaying animated / formatted statistics.
 *
 * @param {Object} props
 * @param {string} props.title - Label for the statistic (e.g. "homes built")
 * @param {string | number} props.value - Numeric display value (e.g. "20,000" or 20000)
 * @param {string} [props.prefix] - Optional prefix (e.g. "$", "₹")
 * @param {string} [props.suffix] - Optional suffix (e.g. "+", "%")
 * @param {number} [props.duration] - Animation duration in ms (default 2000)
 * @param {string} [props.widgetId] - Optional elementor widget ID
 * @param {string} [props.className] - Optional extra class names
 */
export default function StatCounter({
  title,
  value,
  prefix = '',
  suffix = '+',
  duration = 2000,
  widgetId = 'counter',
  className = '',
}) {
  const numericValue = String(value).replace(/[^0-9]/g, '');

  return (
    <div
      className={`elementor-element elementor-element-${widgetId} elementor-widget elementor-widget-counter ${className}`}
      data-id={widgetId}
      data-element_type="widget"
      data-widget_type="counter.default"
    >
      <div className="elementor-widget-container">
        <div className="elementor-counter">
          <div className="elementor-counter-title">{title}</div>
          <div className="elementor-counter-number-wrapper">
            {prefix ? (
              <span className="elementor-counter-number-prefix">{prefix}</span>
            ) : (
              <span className="elementor-counter-number-prefix"></span>
            )}
            <span
              className="elementor-counter-number"
              data-duration={duration}
              data-to-value={numericValue}
              data-from-value="0"
              data-delimiter=","
            >
              {value}
            </span>
            {suffix ? (
              <span className="elementor-counter-number-suffix">
                <sup>{suffix}</sup>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

