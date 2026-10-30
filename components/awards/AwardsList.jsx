import { awards } from '@/data/awards';

export default function AwardsList() {
  return (
    <div
      className="elementor-element elementor-element-f354a83 animated-fast e-flex e-con-boxed elementor-invisible e-con e-parent"
      data-id="f354a83"
      data-element_type="container"
      data-settings='{"animation":"opal-move-up"}'
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-60db682 e-con-full e-flex e-con e-child"
          data-id="60db682"
          data-element_type="container"
        >
          {awards.map((award) => (
            <div
              key={award.id}
              className="elementor-element e-con-full box-img-hover e-flex e-con e-child"
              data-element_type="container"
            >
              <div
                className="elementor-element elementor-widget elementor-widget-image"
                data-element_type="widget"
                data-widget_type="image.default"
              >
                <div className="elementor-widget-container">
                  <img
                    decoding="async"
                    width={award.width}
                    height={award.height}
                    src={award.image}
                    className="attachment-full size-full"
                    alt={award.alt}
                  />
                </div>
              </div>
              <div
                className="elementor-element elementor-widget__width-initial elementor-widget elementor-widget-heading"
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <div className="elementor-widget-container">
                  <h5 className="elementor-heading-title elementor-size-default">
                    {award.title}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

