import './ProjectFacts.css';
// Shared project section. Its layout is reused for every project.

export default function ProjectFacts({ project }) {
  return (
    <div
      className="elementor-element elementor-element-90a9903 e-flex e-con-boxed e-con e-parent"
      data-id="90a9903"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-5f7ae70 elementor-view-framed elementor-position-left elementor-widget-tablet_extra__width-initial elementor-shape-circle elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
          data-id="5f7ae70"
          data-element_type="widget"
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-layer-2"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h3 className="elementor-icon-box-title">
                  <span>Bedrooms </span>
                </h3>
                <p className="elementor-icon-box-description">{project.bedrooms}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-1eb671a elementor-view-framed elementor-position-left elementor-widget-tablet_extra__width-initial elementor-shape-circle elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
          data-id="1eb671a"
          data-element_type="widget"
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-buliding-2"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h3 className="elementor-icon-box-title">
                  <span>Home Type </span>
                </h3>
                <p className="elementor-icon-box-description">{project.type}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-e1e3df4 elementor-view-framed elementor-position-left elementor-widget-tablet_extra__width-initial elementor-shape-circle elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
          data-id="e1e3df4"
          data-element_type="widget"
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-format-square"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h3 className="elementor-icon-box-title">
                  <span>Built-up Area </span>
                </h3>
                <p className="elementor-icon-box-description">{project.builtUp}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-82967ef elementor-view-framed elementor-position-left elementor-widget-tablet_extra__width-initial elementor-shape-circle elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
          data-id="82967ef"
          data-element_type="widget"
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-calendar-2"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h3 className="elementor-icon-box-title">
                  <span>Plot / Land Area </span>
                </h3>
                <p className="elementor-icon-box-description">{project.plotArea}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-ea7b111 elementor-view-framed elementor-position-left elementor-widget-tablet_extra__width-initial elementor-shape-circle elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
          data-id="ea7b111"
          data-element_type="widget"
          data-widget_type="icon-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-icon-box-wrapper">
              <div className="elementor-icon-box-icon">
                <span className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-dollar-circle"></i>{' '}
                </span>
              </div>
              <div className="elementor-icon-box-content">
                <h3 className="elementor-icon-box-title">
                  <span>Price Range </span>
                </h3>
                <p className="elementor-icon-box-description">{project.priceRange}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
