// Shared project section. Its layout is reused for every project.
import ContactForm from '@/components/ContactForm';
export default function ProjectEnquiry({ project }) {
  return (
    <div
      className="elementor-element elementor-element-c8a32ef e-flex e-con-boxed e-con e-parent"
      data-id="c8a32ef"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-2c32b85 elementor-widget__width-initial elementor-widget elementor-widget-heading"
          data-id="2c32b85"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h3 className="elementor-heading-title elementor-size-default">Request more information</h3>{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-981758f elementor-widget__width-initial elementor-widget elementor-widget-spaciaz-contactform"
          data-id="981758f"
          data-element_type="widget"
          data-widget_type="spaciaz-contactform.default"
        >
          <div className="elementor-widget-container">
            <div className="wpcf7 no-js" id="wpcf7-f892-p2178-o1" lang="en-US" dir="ltr" data-wpcf7-id="892">
              <div className="screen-reader-response">
                <p role="status" aria-live="polite" aria-atomic="true"></p> <ul></ul>
              </div>
              <ContactForm className="wpcf7-form init" aria-label="Contact form" data-status="init">
                <input type="hidden" name="project" value={project.title} />
                <div className="row">
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="first-name">
                        <input
                          size="40"
                          maxLength="400"
                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="First Name*"
                          defaultValue=""
                          type="text"
                          name="first-name"
                          required={true}
                          aria-label="First Name*"
                        />
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="last-name">
                        <input
                          size="40"
                          maxLength="400"
                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="Last Name*"
                          defaultValue=""
                          type="text"
                          name="last-name"
                          required={true}
                          aria-label="Last Name*"
                        />
                      </span>
                    </p>
                  </div>
                  <div className="column-100">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="your-email">
                        <input
                          size="40"
                          maxLength="400"
                          className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email"
                          aria-required="true"
                          aria-invalid="false"
                          placeholder="Email*"
                          defaultValue=""
                          type="email"
                          name="your-email"
                          required={true}
                          aria-label="Email*"
                        />
                      </span>
                    </p>
                  </div>
                  <div className="column-100">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="textarea-366">
                        <textarea
                          cols="40"
                          rows="6"
                          maxLength="2000"
                          className="wpcf7-form-control wpcf7-textarea"
                          aria-invalid="false"
                          placeholder="Message..."
                          name="textarea-366"
                          aria-label="Message..."
                          defaultValue=""
                        ></textarea>
                      </span>
                    </p>
                  </div>
                  <div className="column-100 wpcf7-button elementor-button-outline">
                    <div className="submit-btn enable-style-icon-yes">
                      <p>
                        <button type="submit" value="submit" className="elementor-button">
                          <span className="elementor-button-content-wrapper">
                            <span className="elementor-button-text">submit</span>
                            <span className="elementor-button-icon">
                              <span className="btn-icon-wrap">
                                <span className="btn-icon">
                                  <i className="spaciaz-icon- spaciaz-icon-arrow-long-right"></i>
                                </span>
                                <span className="btn-icon-hover">
                                  <i className="spaciaz-icon- spaciaz-icon-arrow-long-right"></i>
                                </span>
                              </span>
                            </span>
                          </span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </ContactForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
