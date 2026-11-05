import './ContactSection.css';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm'; // Adjust path if needed
import ConsentEmbed from '@/components/privacy/ConsentEmbed';
import ConsentFields from '@/components/privacy/ConsentFields';

export default function ContactSection() {
  return (
    <div className="elementor-element elementor-element-b6aa9a7 e-con-full e-flex e-con e-child" data-id="b6aa9a7" data-element_type="container">
      <div className="elementor-element elementor-element-b969834 e-con-full e-flex e-con e-child" data-id="b969834" data-element_type="container">
        
        <div className="elementor-element elementor-element-efdd0df elementor-widget elementor-widget-heading" data-id="efdd0df" data-element_type="widget" data-widget_type="heading.default">
          <div className="elementor-widget-container">
            <h3 className="elementor-heading-title elementor-size-default">
              Send us a message
            </h3>
          </div>
        </div>

        <div className="elementor-element elementor-element-8a5bc95 elementor-widget elementor-widget-spaciaz-contactform" data-id="8a5bc95" data-element_type="widget" data-widget_type="spaciaz-contactform.default">
          <div className="elementor-widget-container">
            <div className="wpcf7 no-js" id="wpcf7-f892-p61-o1" lang="en-US" dir="ltr" data-wpcf7-id="892">
              
              <ContactForm className="wpcf7-form init" aria-label="Contact form">
                {/* Hidden Honeypot Field for Bot Spam Trap */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="row">
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap">
                        <input size={40} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" placeholder="First Name *" type="text" name="firstName" required />
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap">
                        <input size={40} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" placeholder="Last Name *" type="text" name="lastName" required />
                      </span>
                    </p>
                  </div>
                  
                  {/* Phone is required by the backend */}
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap">
                        <input size={40} className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" placeholder="Phone Number *" type="tel" name="phone" required />
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap">
                        <input size={40} className="wpcf7-form-control wpcf7-email wpcf7-text wpcf7-validates-as-email" placeholder="Email (optional)" type="email" name="email" />
                      </span>
                    </p>
                  </div>

                  <div className="column-100">
                    <p>
                      <span className="wpcf7-form-control-wrap">
                        <textarea cols={40} rows={6} className="wpcf7-form-control wpcf7-textarea" placeholder="Message..." name="message" />
                      </span>
                    </p>
                  </div>

                  <div className="column-100">
                    <ConsentFields form="enquiry" marketing />
                  </div>

                  <div className="column-100 wpcf7-button elementor-button-outline">
                    <div className="submit-btn enable-style-icon-yes">
                      <p>
                        <button type="submit" className="elementor-button">
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
      
      {/* Existing Map & Contact Image Links Container Below */}
      <div className="elementor-element elementor-element-67b88a0 e-con-full e-flex e-con e-child" data-id="67b88a0" data-element_type="container">
        <div className="elementor-element elementor-element-01f1958 animated-fast elementor-invisible elementor-widget elementor-widget-image" data-id="01f1958" data-element_type="widget" data-settings='{"_animation":"opal-move-right"}' data-widget_type="image.default">
          <div className="elementor-widget-container">
            <Link href="/contact/site-contact" prefetch={false} className="vv-contact-image-link" aria-label="Go to Site Contact">
              <img loading="lazy" decoding="async" width="1672" height="941" src="/site-contact.png" className="attachment-full bimg size-full wp-image-852" alt="" />
              <span className="vv-contact-image-link-label">
                Site Contact
                <svg className="vv-contact-external-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
              </span>
            </Link>
          </div>
        </div>
        <div className="elementor-element elementor-element-f3e0a68 animated-fast elementor-invisible elementor-widget elementor-widget-image" data-id="f3e0a68" data-element_type="widget" data-settings='{"_animation":"opal-move-left"}' data-widget_type="image.default">
          <div className="elementor-widget-container">
            <Link href="/contact/branch-contact" prefetch={false} className="vv-contact-image-link" aria-label="Go to Branch Contact">
              <img loading="lazy" decoding="async" width="1672" height="941" src="/branch-contact.png" className="attachment-full bimg size-full wp-image-850" alt="" />
              <span className="vv-contact-image-link-label">
                Branch Contact
                <svg className="vv-contact-external-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-e070db1 e-con-full e-flex e-con e-child" data-id="e070db1" data-element_type="container">
        <div className="elementor-element elementor-element-00b0c2a elementor-widget elementor-widget-google_maps" data-id="00b0c2a" data-element_type="widget" data-widget_type="google_maps.default">
          <div className="elementor-widget-container">
            <div className="elementor-custom-embed">
              <ConsentEmbed provider="Google Maps">
                <iframe loading="lazy" src="https://maps.google.com/maps?q=417%2C%20419%2C%204th%20Floor%2C%20Aashiana%20Tower%2C%20Exhibition%20Road%2C%20Old%20Jakkanpur%2C%20Lodipur%2C%20Patna%2C%20Bihar%20800001&t=m&z=15&output=embed&iwloc=near" title="Vastu Vihar Corporate Office, Patna" aria-label="Vastu Vihar Corporate Office, Patna" />
              </ConsentEmbed>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}