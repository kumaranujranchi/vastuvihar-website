import './CareersShowcase.css';
import Link from 'next/link';
import { jobPositions } from '@/data/careers';

function JobSlide({ job }) {
  return (
    <div className="swiper-slide">
      <div className="careers-slide">
        <h2 className="careers-title">{job.title}</h2>
        <div className="careers-content">
          <div className="careers-description">
            <p> </p>
            <div
              data-elementor-type="container"
              data-elementor-id="6007"
              className="elementor elementor-6007"
            >
              <div
                className="elementor-element elementor-element-19ee7df e-flex e-con-boxed e-con e-parent"
                data-id="19ee7df"
                data-element_type="container"
              >
                <div className="e-con-inner">
                  <div
                    className="elementor-element elementor-element-352859b elementor-widget elementor-widget-text-editor"
                    data-id="352859b"
                    data-element_type="widget"
                    data-widget_type="text-editor.default"
                  >
                    <div className="elementor-widget-container">
                      <p>
                        We help transform the world’s most important businesses into vigorous, agile organizations that
                        anticipate the unpredictable, adapt rapidly to disruption and outcompete their opposition.
                      </p>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-81360d5 elementor-widget elementor-widget-heading"
                    data-id="81360d5"
                    data-element_type="widget"
                    data-widget_type="heading.default"
                  >
                    <div className="elementor-widget-container">
                      <h5 className="elementor-heading-title elementor-size-default">
                        Job description
                      </h5>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-8263e46 elementor-widget elementor-widget-text-editor"
                    data-id="8263e46"
                    data-element_type="widget"
                    data-widget_type="text-editor.default"
                  >
                    <div className="elementor-widget-container">
                      <p>
                        You’ll work closely with cross-functional teams including product managers, developers, and
                        marketing to create designs that align with user needs and business goals.
                      </p>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-5eebaeb elementor-widget elementor-widget-heading"
                    data-id="5eebaeb"
                    data-element_type="widget"
                    data-widget_type="heading.default"
                  >
                    <div className="elementor-widget-container">
                      <h5 className="elementor-heading-title elementor-size-default">
                        Key Responsibilities:
                      </h5>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-a6051cf elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list"
                    data-id="a6051cf"
                    data-element_type="widget"
                    data-widget_type="icon-list.default"
                  >
                    <div className="elementor-widget-container">
                      <ul className="elementor-icon-list-items">
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square"
                              viewBox="0 0 448 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Design and prototype user interfaces for web and mobile applications.
                          </span>
                        </li>
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square"
                              viewBox="0 0 448 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Conduct user research, create personas, and develop wireframes and user flows.
                          </span>
                        </li>
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square-full"
                              viewBox="0 0 512 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M512 512H0V0h512v512z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Collaborate with developers to ensure designs are implemented accurately.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-8774f76 elementor-widget elementor-widget-heading"
                    data-id="8774f76"
                    data-element_type="widget"
                    data-widget_type="heading.default"
                  >
                    <div className="elementor-widget-container">
                      <h5 className="elementor-heading-title elementor-size-default">
                        Requirements:
                      </h5>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-db95655 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list"
                    data-id="db95655"
                    data-element_type="widget"
                    data-widget_type="icon-list.default"
                  >
                    <div className="elementor-widget-container">
                      <ul className="elementor-icon-list-items">
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square"
                              viewBox="0 0 448 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Proven experience as a UI/UX Designer or similar role.
                          </span>
                        </li>
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square"
                              viewBox="0 0 448 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Proficiency with design tools like Figma, Sketch, or Adobe XD.
                          </span>
                        </li>
                        <li className="elementor-icon-list-item">
                          <span className="elementor-icon-list-icon">
                            <svg
                              aria-hidden="true"
                              className="e-font-icon-svg e-fas-square"
                              viewBox="0 0 448 512"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
                            </svg>
                          </span>
                          <span className="elementor-icon-list-text">
                            Attention to detail and a passion for creating excellent user experiences.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-7638691 elementor-widget elementor-widget-text-editor"
                    data-id="7638691"
                    data-element_type="widget"
                    data-widget_type="text-editor.default"
                  >
                    <div className="elementor-widget-container">
                      <p>
                        If you’re passionate about designing exceptional digital experiences, we’d love to hear from you!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="careers-infor-wrap elementor-button-outline">
            <div className="careers-infor">
              <div className="careers-time">
                <i className="spaciaz-icon-calendar" />{job.time}
              </div>
              <div className="careers-hours">
                <i className="spaciaz-icon-clock" />{job.hours}
              </div>
              <div className="careers-location">
                <i className="spaciaz-icon-marker-pin" />{job.location}
              </div>
            </div>
            <Link
              className="careers-button elementor-button"
              href="/contact/"
              prefetch={false}
            >
              <span className="elementor-button-content-wrapper">
                <span className="elementor-button-text">Apply Now</span>
                <span className="elementor-button-icon">
                  <span className="btn-icon-wrap">
                    <span className="btn-icon">
                      <i className="spaciaz-icon-arrow-long-right" />
                    </span>
                    <span className="btn-icon-hover">
                      <i className="spaciaz-icon-arrow-long-right" />
                    </span>
                  </span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareersShowcase() {
  return (
    <div
      className="elementor-element elementor-element-a143bee e-con-full e-flex e-con e-child"
      data-id="a143bee"
      data-element_type="container"
    >
      <div
        className="elementor-element elementor-element-1350eba elementor-widget elementor-widget-spaciaz-careers-showcase"
        data-id="1350eba"
        data-element_type="widget"
        data-widget_type="spaciaz-careers-showcase.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-careersshowcase-item-wrapper">
            <div className="elementor-careersshowcase-content">
              {jobPositions.map((job, index) => (
                <div
                  key={job.id}
                  id={`elementor-careersshowcase-title-${job.id}`}
                  className={`elementor-careersshowcase-item elementor-repeater-item-${job.repeaterId}${index === 0 ? ' elementor-active' : ''}`}
                  data-goto={index}
                  data-tab={index + 1}
                  role="tab"
                >
                  <div className="careers-content-wrap">
                    <div className="careers-content-header">
                      <div className="careers-time">
                        <span>{job.time}</span>
                      </div>
                      <h6 className="careers-title">{job.title}</h6>
                      <div className="careers-location">
                        <i className="spaciaz-icon-marker" />{job.location}
                      </div>
                    </div>
                    <div className="popup-icon">
                      <i className="spaciaz-icon-plus-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="careers-popup mfp-hide" id="careers-popup-1350eba">
              <div className="careers-popup-inner">
                <button className="careers-popup-close mfp-close">
                  <svg
                    className="close-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.691"
                    height="22.723"
                    viewBox="0 0 23.691 22.723"
                  >
                    <g transform="translate(-126.154 -143.139)">
                      <line
                        x2="23"
                        y2="22"
                        transform="translate(126.5 143.5)"
                        fill="none"
                        stroke="CurrentColor"
                        strokeWidth="5"
                      />
                      <path
                        d="M0,22,23,0"
                        transform="translate(126.5 143.5)"
                        fill="none"
                        stroke="CurrentColor"
                        strokeWidth="5"
                      />
                    </g>
                  </svg>
                </button>
                <div className="spaciaz-swiper-wrap">
                  <div className="spaciaz-swiper swiper swiper-careers-popup">
                    <div className="swiper-wrapper">
                      {jobPositions.map((job) => (
                        <JobSlide key={job.id} job={job} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

