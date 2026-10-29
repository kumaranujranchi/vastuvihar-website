
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
        <div
          className="elementor-element elementor-element-f89c08a e-con-full e-flex e-con e-child"
          data-id="f89c08a"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-400540f box-width-yes elementor-widget__width-initial animated-fast spaciaz-scrolling-ltr elementor-invisible elementor-widget elementor-widget-spaciaz-slide-scrolling"
            data-id="400540f"
            data-element_type="widget"
            data-settings={JSON.stringify({
              _animation: "opal-helix",
            })}
            data-widget_type="spaciaz-slide-scrolling.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-scrolling">
                <div className="elementor-scrolling-wrapper">
                  {Array.from({ length: 5 }).map(
                    (_, groupIndex) => (
                      <div
                        className="elementor-scrolling-inner"
                        key={groupIndex}
                      >
                        {scrollingItems.map((value, index) => (
                          <div
                            className="elementor-scrolling-item"
                            key={`${groupIndex}-${index}`}
                          >
                            <div className="elementor-scrolling-item-inner">
                              <div
                                className={`scrolling-title ${
                                  index % 2 === 0
                                    ? "elementor-repeater-item-3eace46"
                                    : "elementor-repeater-item-18b9ba4"
                                }`}
                              >
                                <span>{value}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
