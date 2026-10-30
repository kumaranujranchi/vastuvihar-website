import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export default function ContactSection() {
  return (
    <div
      className="elementor-element elementor-element-b6aa9a7 e-con-full e-flex e-con e-child"
      data-id="b6aa9a7"
      data-element_type="container"
    >
      <div
        className="elementor-element elementor-element-b969834 e-con-full e-flex e-con e-child"
        data-id="b969834"
        data-element_type="container"
      >
        <div
          className="elementor-element elementor-element-efdd0df elementor-widget elementor-widget-heading"
          data-id="efdd0df"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h3 className="elementor-heading-title elementor-size-default">
              Send us a message
            </h3>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-8a5bc95 elementor-widget elementor-widget-spaciaz-contactform"
          data-id="8a5bc95"
          data-element_type="widget"
          data-widget_type="spaciaz-contactform.default"
        >
          <div className="elementor-widget-container">
            <div
              className="wpcf7 no-js"
              id="wpcf7-f892-p61-o1"
              lang="en-US"
              dir="ltr"
              data-wpcf7-id="892"
            >
              <div className="screen-reader-response">
                <p role="status" aria-live="polite" aria-atomic="true" />
                <ul />
              </div>
              <ContactForm
                className="wpcf7-form init"
                aria-label="Contact form"
                data-status="init"
              >
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
                          required
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
                          required
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
                          required
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
                        />
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
                                  <i className="spaciaz-icon- spaciaz-icon-arrow-long-right" />
                                </span>
                                <span className="btn-icon-hover">
                                  <i className="spaciaz-icon- spaciaz-icon-arrow-long-right" />
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
      <div
        className="elementor-element elementor-element-67b88a0 e-con-full e-flex e-con e-child"
        data-id="67b88a0"
        data-element_type="container"
      >
        <div
          className="elementor-element elementor-element-01f1958 animated-fast elementor-invisible elementor-widget elementor-widget-image"
          data-id="01f1958"
          data-element_type="widget"
          data-settings='{"_animation":"opal-move-right"}'
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <Link
              href="/contact/site-contact"
              prefetch={false}
              className="vv-contact-image-link"
              aria-label="Go to Site Contact"
            >
              <img
                decoding="async"
                width="190"
                height="80"
                src="/images/h3_img-3.jpg"
                className="attachment-full bimg size-full wp-image-852"
                alt="Site Contact"
              />
              <span className="vv-contact-image-link-label">
                Site Contact
                <svg
                  className="vv-contact-external-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-f3e0a68 animated-fast elementor-invisible elementor-widget elementor-widget-image"
          data-id="f3e0a68"
          data-element_type="widget"
          data-settings='{"_animation":"opal-move-left"}'
          data-widget_type="image.default"
        >
          <div className="elementor-widget-container">
            <Link
              href="/contact/branch-contact"
              prefetch={false}
              className="vv-contact-image-link"
              aria-label="Go to Branch Contact"
            >
              <img
                decoding="async"
                width="190"
                height="80"
                src="/images/h3_img-4.jpg"
                className="attachment-full bimg size-full wp-image-850"
                alt="Branch Contact"
              />
              <span className="vv-contact-image-link-label">
                Branch Contact
                <svg
                  className="vv-contact-external-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-e070db1 e-con-full e-flex e-con e-child"
        data-id="e070db1"
        data-element_type="container"
      >
        <div
          className="elementor-element elementor-element-00b0c2a elementor-widget elementor-widget-google_maps"
          data-id="00b0c2a"
          data-element_type="widget"
          data-widget_type="google_maps.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-custom-embed">
              <iframe
                loading="lazy"
                src="https://maps.google.com/maps?q=417%2C%20419%2C%204th%20Floor%2C%20Aashiana%20Tower%2C%20Exhibition%20Road%2C%20Old%20Jakkanpur%2C%20Lodipur%2C%20Patna%2C%20Bihar%20800001&t=m&z=15&output=embed&iwloc=near"
                title="Vastu Vihar Corporate Office, Patna"
                aria-label="Vastu Vihar Corporate Office, Patna"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

