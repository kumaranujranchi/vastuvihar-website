import './ValuesSection.css';
import StaticPill from '../common/StaticPill';

export default function ValuesSection() {
  const scrollingItems = [
    "Trust & Transparency",
    "Quality Construction",
    "Affordable Homes",
    "Customer Commitment",
    "Integrity & Excellence",
  ];

  return (
    <div
      className="elementor-element elementor-element-c640da1 e-flex e-con-boxed e-con e-parent"
      data-id="c640da1"
      data-element_type="container"
    >
      <div className="e-con-inner">


        <StaticPill text="Our values" />
        <div
          className="elementor-element elementor-element-dccf6a4 e-con-full e-flex e-con e-child"
          data-id="dccf6a4"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-feccd93 animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="feccd93"
            data-element_type="widget"
            data-settings={JSON.stringify({
              _animation: "opal-move-up",
            })}
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Built on Trust, Driven by Quality,
                Committed to Affordable Homes.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
