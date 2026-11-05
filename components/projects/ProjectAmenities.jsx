import './ProjectAmenities.css';
import { AMENITIES_DATA } from '@/data/amenities';

export default function ProjectAmenities() {
  return (
    <div
      className="elementor-element elementor-element-30b0f85 e-flex e-con-boxed e-con e-parent"
      data-id="30b0f85"
      data-element_type="container"
    >
      <div className="e-con-inner">

        <div
          className="elementor-element elementor-element-4ef38e2 elementor-widget elementor-widget-heading"
          data-id="4ef38e2"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h3 style={{ color: '#000', fontSize: '2rem'}} className="elementor-heading-title elementor-size-default">
              Township Amenities
            </h3>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-5a51ae4 amenities-grid e-grid e-con-full e-con e-child"
          data-id="5a51ae4"
          data-element_type="container"
        >
          {AMENITIES_DATA.map((item) => (
            <div
              key={item.id}
              className="amenity-card e-con-full e-flex e-con e-child"
            >

              {/* decorative white shape */}
              <div className="amenity-card-decor">
                <div className="elementor-icon-wrapper">
                  <div className="elementor-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="320"
                      height="104"
                      viewBox="0 0 320 104"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 0H320C290.545 0 267.772 24.6753 253.628 49.8666C235.516 82.1247 200.378 104 160 104C119.622 104 84.4835 82.1247 66.3718 49.8666C52.228 24.6753 29.4552 0 0 0Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* amenity content */}
              <div className="amenity-icon-box">
                <div className="elementor-icon-box-wrapper">

                  <div className="elementor-icon-box-icon">
                    <span className="elementor-icon elementor-animation-grow">
                      {item.icon}
                    </span>
                  </div>

                  <div className="elementor-icon-box-content">
                    <h6 className="elementor-icon-box-title">
                      <span>{item.name}</span>
                    </h6>

                    <p className="elementor-icon-box-description">
                      {item.tag}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}