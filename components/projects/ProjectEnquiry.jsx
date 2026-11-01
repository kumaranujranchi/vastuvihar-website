import './ProjectEnquiry.css';
import ContactForm from '@/components/ContactForm';

const PREFERRED_CITIES = [
  'Ara', 'Buxar', 'Patna', 'Biharsharif', 'Jehanabad', 'Chapra', 'Hajipur', 'Siwan', 'Gaya',
  'Aurangabad', 'Dehri-On-Sone', 'Sasaram', 'Varanasi', 'Mirzapur', 'Gorakhpur', 'Alipurduar',
  'Begusarai', 'Munger', 'Samastipur', 'Bhagalpur', 'Katihar', 'Purnea', 'Saharsa', 'Siliguri',
  'Banka', 'BirtaMode', 'Birganj Nepal', 'Deoghar', 'Giridih', 'Asansol', 'Durgapur', 'Kolkata',
  'Rourkela', 'Bhubaneswar', 'Jamshedpur', 'Ranchi', 'Bokaro', 'Dhanbad', 'Hazaribagh', 'Bettiah',
  'Darbhanga', 'Madhubani', 'Motihari', 'Muzaffarpur', 'Sitamarhi', 'Raxaul',
];

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
            <h3 className="elementor-heading-title elementor-size-default">Request more information</h3>
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
              
              <ContactForm className="wpcf7-form init" aria-label="Contact form" data-status="init">
                
                {/* Hidden Fields for Backend Context & Spam Protection */}
                <input type="hidden" name="project" value={project?.title || ''} />
                <input type="hidden" name="source" value="project_enquiry_section" />
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="row">
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="firstName">
                        <input
                          size="40"
                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          placeholder="First Name*"
                          type="text"
                          name="firstName"
                          required={true}
                          aria-label="First Name*"
                        />
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="lastName">
                        <input
                          size="40"
                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          placeholder="Last Name*"
                          type="text"
                          name="lastName"
                          required={true}
                          aria-label="Last Name*"
                        />
                      </span>
                    </p>
                  </div>
                  
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="phone">
                        <input
                          size="40"
                          className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required"
                          placeholder="Phone Number*"
                          type="tel"
                          name="phone"
                          required={true}
                          aria-label="Phone Number*"
                        />
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="email">
                        <input
                          size="40"
                          className="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email"
                          placeholder="Email Address*"
                          type="email"
                          name="email"
                          required={true}
                          aria-label="Email*"
                        />
                      </span>
                    </p>
                  </div>

                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="city">
                        <select name="city" className="wpcf7-form-control wpcf7-select wpcf7-validates-as-required" required={true} aria-label="Preferred City*" defaultValue="">
                          <option value="" disabled>Preferred City*</option>
                          {PREFERRED_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </span>
                    </p>
                  </div>
                  <div className="column-50">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="budget">
                        <select name="budget" className="wpcf7-form-control wpcf7-select wpcf7-validates-as-required" required={true} aria-label="Budget Range*" defaultValue="">
                          <option value="" disabled>Budget Range*</option>
                          <option value="₹ 10 - 16 Lac">₹ 10 - 16 Lac (2 BHK Flat)</option>
                          <option value="₹ 16 - 24 Lac">₹ 16 - 24 Lac (2 & 3 BHK Flat)</option>
                          <option value="₹ 20 - 35 Lac">₹ 20 - 35 Lac (Simplex / Row House)</option>
                          <option value="₹ 35 - 50 Lac">₹ 35 - 50 Lac (Duplex Bungalow)</option>
                          <option value="₹ 50 - 70 Lac">₹ 50 - 70 Lac (Luxury Bungalow)</option>
                          <option value="₹ 90 - 95 Lac">₹ 90 - 95 Lac (Hybrid Homes)</option>
                          <option value="₹ 1.20 - 1.80 Cr">₹ 1.20 - 1.80 Cr (CEO Villa)</option>
                        </select>
                      </span>
                    </p>
                  </div>

                  <div className="column-100">
                    <p>
                      <span className="wpcf7-form-control-wrap" data-name="message">
                        <textarea
                          cols="40"
                          rows="6"
                          className="wpcf7-form-control wpcf7-textarea"
                          placeholder="Message..."
                          name="message"
                          aria-label="Message..."
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