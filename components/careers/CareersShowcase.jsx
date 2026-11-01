'use client'; // Required for interactive tabs/popups

import './CareersShowcase.css';
import Link from 'next/link';

function JobSlide({ job }) {
  return (
    <div className="swiper-slide">
      <div className="careers-slide">
        <h2 className="careers-title">{job.title}</h2>
        <div className="careers-content">
          <div className="careers-description">
            <p> </p>
            <div data-elementor-type="container" className="elementor elementor-6007">
              <div className="elementor-element elementor-element-19ee7df e-flex e-con-boxed e-con e-parent" data-element_type="container">
                <div className="e-con-inner">
                  
                  {/* Dynamic Job Description */}
                  <div className="elementor-element elementor-widget elementor-widget-heading">
                    <div className="elementor-widget-container">
                      <h5 className="elementor-heading-title elementor-size-default">Job Description</h5>
                    </div>
                  </div>
                  <div className="elementor-element elementor-widget elementor-widget-text-editor">
                    <div className="elementor-widget-container" style={{ whiteSpace: 'pre-wrap' }}>
                      <p>{job.description}</p>
                    </div>
                  </div>

                  {/* Dynamic Requirements (if they exist) */}
                  {job.requirements && (
                    <>
                      <div className="elementor-element elementor-widget elementor-widget-heading" style={{ marginTop: '24px' }}>
                        <div className="elementor-widget-container">
                          <h5 className="elementor-heading-title elementor-size-default">Key Requirements</h5>
                        </div>
                      </div>
                      <div className="elementor-element elementor-widget elementor-widget-text-editor">
                        <div className="elementor-widget-container" style={{ whiteSpace: 'pre-wrap' }}>
                          <p>{job.requirements}</p>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Metadata & Apply Button */}
          <div className="careers-infor-wrap elementor-button-outline">
            <div className="careers-infor">
              {job.department && (
                <div className="careers-time">
                  <i className="spaciaz-icon-calendar" />{job.department}
                </div>
              )}
              <div className="careers-hours">
                <i className="spaciaz-icon-clock" />{job.type}
              </div>
              <div className="careers-location">
                <i className="spaciaz-icon-marker-pin" />{job.location}
              </div>
            </div>
            
            {/* Routes to the new application form with the job title pre-filled */}
            <Link
              className="careers-button elementor-button"
              href={`/careers/apply?title=${encodeURIComponent(job.title)}`}
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

export default function CareersShowcase({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <h3>No open positions at the moment.</h3>
        <p>Please check back later for new career opportunities.</p>
      </div>
    );
  }

  return (
    <div className="elementor-element elementor-element-a143bee e-con-full e-flex e-con e-child" data-element_type="container">
      <div className="elementor-element elementor-element-1350eba elementor-widget elementor-widget-spaciaz-careers-showcase">
        <div className="elementor-widget-container">
          <div className="elementor-careersshowcase-item-wrapper">
            
            {/* Left Side: List of Jobs */}
            <div className="elementor-careersshowcase-content">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`elementor-careersshowcase-item ${index === 0 ? 'elementor-active' : ''}`}
                  data-goto={index}
                >
                  <div className="careers-content-wrap">
                    <div className="careers-content-header">
                      <div className="careers-time">
                        <span>{job.type}</span>
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

            {/* Right Side / Popup: Job Details Swiper */}
            <div className="careers-popup mfp-hide" id="careers-popup-1350eba">
              <div className="careers-popup-inner">
                <button className="careers-popup-close mfp-close">
                   {/* Close SVG logic remains the same */}
                  <svg className="close-icon" xmlns="http://www.w3.org/2000/svg" width="23.691" height="22.723" viewBox="0 0 23.691 22.723">
                    <g transform="translate(-126.154 -143.139)">
                      <line x2="23" y2="22" transform="translate(126.5 143.5)" fill="none" stroke="CurrentColor" strokeWidth="5"/>
                      <path d="M0,22,23,0" transform="translate(126.5 143.5)" fill="none" stroke="CurrentColor" strokeWidth="5"/>
                    </g>
                  </svg>
                </button>
                <div className="spaciaz-swiper-wrap">
                  <div className="spaciaz-swiper swiper swiper-careers-popup">
                    <div className="swiper-wrapper">
                      {jobs.map((job) => (
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