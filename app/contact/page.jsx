import Breadcrumb from '@/components/Breadcrumb';
import PageLayout from '@/components/PageLayout';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
export const metadata = {
  title: 'Contact Vastu Vihar | Get in Touch',
  description:
    'Contact Vastu Vihar for bungalow and home enquiries, project details, site visits and customer support. Call +91 95340 95340 or email info@vastuvihar.org.',
};
export default function ContactPage() {
  return (
    <PageLayout route="contact">
      <Breadcrumb title="Get in touch" />
      <div id="content" className="site-content-page clear" tabIndex="-1">
        <div className="col-fluid">
          <div id="primary" className="content-area">
            <main id="main" className="site-main">
              <div data-elementor-type="wp-page" data-elementor-id="61" className="elementor elementor-61">
                <div
                  className="elementor-element elementor-element-dd4cc01 e-con-full e-flex e-con e-parent"
                  data-id="dd4cc01"
                  data-element_type="container"
                  data-settings={'{"background_background":"classic"}'}
                >
                  <div
                    className="elementor-element elementor-element-49de9ae e-flex e-con-boxed e-con e-child"
                    data-id="49de9ae"
                    data-element_type="container"
                  >
                    <div className="e-con-inner">
                      <div
                        className="elementor-element elementor-element-03bf66d elementor-widget elementor-widget-page-title"
                        data-id="03bf66d"
                        data-element_type="widget"
                        data-widget_type="page-title.default"
                      >
                        <div className="elementor-widget-container">
                          <div className="hfe-page-title hfe-page-title-wrapper elementor-widget-heading">
                            <h2 className="elementor-heading-title elementor-size-default">Get in touch</h2>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-f99e958 e-con-full e-flex e-con e-child"
                        data-id="f99e958"
                        data-element_type="container"
                      >
                        <div
                          className="elementor-element elementor-element-d07b84b elementor-widget elementor-widget-hfe-breadcrumbs-widget"
                          data-id="d07b84b"
                          data-element_type="widget"
                          data-widget_type="hfe-breadcrumbs-widget.default"
                        >
                          <div className="elementor-widget-container">
                            <nav aria-label="Breadcrumb">
                              <ul className="hfe-breadcrumbs hfe-breadcrumbs-show-home">
                                <li className="hfe-breadcrumbs-item hfe-breadcrumbs-first">
                                  <span className="hfe-breadcrumbs-home-icon"></span>
                                  <Link href="/" prefetch={false}>
                                    <span className="hfe-breadcrumbs-text">Home</span>
                                  </Link>
                                </li>
                                <li className="hfe-breadcrumbs-separator">
                                  <span className="hfe-breadcrumbs-separator-icon">
                                    <svg
                                      aria-hidden="true"
                                      className="e-font-icon-svg e-fas-square-full"
                                      viewBox="0 0 512 512"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M512 512H0V0h512v512z"></path>
                                    </svg>
                                  </span>
                                </li>
                                <li className="hfe-breadcrumbs-item hfe-breadcrumbs-last">
                                  <span className="hfe-breadcrumbs-text" aria-current="page">
                                    Get in touch
                                  </span>
                                </li>
                              </ul>
                            </nav>{' '}
                          </div>
                        </div>
                        <div
                          className="elementor-element elementor-element-0af00e4 elementor-widget__width-initial elementor-hidden-mobile elementor-widget elementor-widget-heading"
                          data-id="0af00e4"
                          data-element_type="widget"
                          data-widget_type="heading.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-heading-title elementor-size-default">
                              The Vastu Vihar team is here to help you explore homes and bungalows,
                              arrange site visits, and answer your property enquiries.
                            </div>{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="elementor-element elementor-element-6e1c396 elementor-widget elementor-widget-spacer"
                    data-id="6e1c396"
                    data-element_type="widget"
                    data-widget_type="spacer.default"
                  >
                    <div className="elementor-widget-container">
                      <div className="elementor-spacer">
                        <div className="elementor-spacer-inner"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="elementor-element elementor-element-e645870 e-flex e-con-boxed e-con e-parent"
                  data-id="e645870"
                  data-element_type="container"
                >
                  <div className="e-con-inner">
                    <div
                      className="elementor-element elementor-element-57c1499 e-grid e-con-full e-con e-child"
                      data-id="57c1499"
                      data-element_type="container"
                    >
                      <div
                        className="elementor-element elementor-element-2783a18 e-con-full animated-fast e-flex elementor-invisible e-con e-child"
                        data-id="2783a18"
                        data-element_type="container"
                        data-settings={'{"animation":"opal-move-up"}'}
                      >
                        <div
                          className="elementor-element elementor-element-fbcd262 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                          data-id="fbcd262"
                          data-element_type="widget"
                          data-widget_type="icon-box.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-icon-box-wrapper">
                              <div className="elementor-icon-box-icon">
                                <span className="elementor-icon">
                                  <i
                                    aria-hidden="true"
                                    className="spaciaz-icon- spaciaz-icon-envelope-open"
                                  ></i>{' '}
                                </span>
                              </div>
                              <div className="elementor-icon-box-content">
                                <h5 className="elementor-icon-box-title">
                                  <span>Enquiry email </span>
                                </h5>
                                <p className="elementor-icon-box-description">
                                  <a href="mailto:info@vastuvihar.org" className="">
                                    info@vastuvihar.org
                                  </a>{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="elementor-element elementor-element-5594504 elementor-button-default elementor-align-justify elementor-widget elementor-widget-spaciaz-button"
                          data-id="5594504"
                          data-element_type="widget"
                          data-widget_type="spaciaz-button.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-button-wrapper">
                              <a
                                href="mailto:info@vastuvihar.org"
                                className="elementor-button-link elementor-button elementor-size-sm"
                                role="button"
                              >
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text" data-name="Email us">
                                    <span>Email us</span>
                                  </span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-67ea3e2 e-con-full animated-fast e-flex elementor-invisible e-con e-child"
                        data-id="67ea3e2"
                        data-element_type="container"
                        data-settings={'{"animation":"opal-move-up","animation_delay":100}'}
                      >
                        <div
                          className="elementor-element elementor-element-833a981 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                          data-id="833a981"
                          data-element_type="widget"
                          data-widget_type="icon-box.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-icon-box-wrapper">
                              <div className="elementor-icon-box-icon">
                                <span className="elementor-icon">
                                  <i
                                    aria-hidden="true"
                                    className="spaciaz-icon- spaciaz-icon-call-out"
                                  ></i>{' '}
                                </span>
                              </div>
                              <div className="elementor-icon-box-content">
                                <h5 className="elementor-icon-box-title">
                                  <span>Phone number </span>
                                </h5>
                                <p className="elementor-icon-box-description">+91 95340 95340 </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="elementor-element elementor-element-02ad47c elementor-button-default elementor-align-justify elementor-widget elementor-widget-spaciaz-button"
                          data-id="02ad47c"
                          data-element_type="widget"
                          data-widget_type="spaciaz-button.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-button-wrapper">
                              <a
                                href="tel:+919534095340"
                                className="elementor-button-link elementor-button elementor-size-sm"
                                role="button"
                              >
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text" data-name="Call us">
                                    <span>Call us</span>
                                  </span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-element elementor-element-8f52242 e-con-full e-flex elementor-invisible e-con e-child"
                        data-id="8f52242"
                        data-element_type="container"
                        data-settings={'{"animation":"opal-move-up","animation_delay":200}'}
                      >
                        <div
                          className="elementor-element elementor-element-6869bc9 elementor-view-default elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box"
                          data-id="6869bc9"
                          data-element_type="widget"
                          data-widget_type="icon-box.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-icon-box-wrapper">
                              <div className="elementor-icon-box-icon">
                                <span className="elementor-icon">
                                  <i
                                    aria-hidden="true"
                                    className="spaciaz-icon- spaciaz-icon-marker-pin"
                                  ></i>{' '}
                                </span>
                              </div>
                              <div className="elementor-icon-box-content">
                                <h5 className="elementor-icon-box-title">
                                  <span>Location </span>
                                </h5>
                                <p className="elementor-icon-box-description">
                                  417, 419, 4th Floor, Aashiana Tower, Exhibition Road,
                                  Old Jakkanpur, Lodipur, Patna, Bihar - 800001{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="elementor-element elementor-element-7c2ea73 elementor-button-default elementor-align-justify elementor-widget elementor-widget-spaciaz-button"
                          data-id="7c2ea73"
                          data-element_type="widget"
                          data-widget_type="spaciaz-button.default"
                        >
                          <div className="elementor-widget-container">
                            <div className="elementor-button-wrapper">
                              <a
                                href="https://www.google.com/maps/search/?api=1&query=417%2C%20419%2C%204th%20Floor%2C%20Aashiana%20Tower%2C%20Exhibition%20Road%2C%20Old%20Jakkanpur%2C%20Lodipur%2C%20Patna%2C%20Bihar%20800001"
                                className="elementor-button-link elementor-button elementor-size-sm"
                                role="button"
                              >
                                <span className="elementor-button-content-wrapper">
                                  <span className="elementor-button-text" data-name="Visit us">
                                    <span>Visit us</span>
                                  </span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                            </h3>{' '}
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
                                <p role="status" aria-live="polite" aria-atomic="true"></p> <ul></ul>
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
                      <div
                        className="elementor-element elementor-element-67b88a0 e-con-full e-flex e-con e-child"
                        data-id="67b88a0"
                        data-element_type="container"
                      >
                        <div
                          className="elementor-element elementor-element-01f1958 animated-fast elementor-invisible elementor-widget elementor-widget-image"
                          data-id="01f1958"
                          data-element_type="widget"
                          data-settings={'{"_animation":"opal-move-right"}'}
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
                                alt=""
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
                          data-settings={'{"_animation":"opal-move-left"}'}
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
                                alt=""
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
                              src={
                                'https://maps.google.com/maps?q=417%2C%20419%2C%204th%20Floor%2C%20Aashiana%20Tower%2C%20Exhibition%20Road%2C%20Old%20Jakkanpur%2C%20Lodipur%2C%20Patna%2C%20Bihar%20800001&t=m&z=15&output=embed&iwloc=near'
                              }
                              title="Vastu Vihar Corporate Office, Patna"
                              aria-label="Vastu Vihar Corporate Office, Patna"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <style>{`
        /* Only the existing image-links: no added card spacing or padding. */
        .vv-contact-image-link {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          vertical-align: top;
          width: auto;
          max-width: 100%;
          margin: 0;
          padding: 0;
          gap: 0;
          border: 0;
          background: transparent;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }
        .vv-contact-image-link img {
          display: block;
          margin: 0;
          padding: 0;
        }
        .vv-contact-image-link-label {
          display: block;
          position: relative;
          width: 100%;
          margin: 0;
          padding: 0;
          font: inherit;
          font-weight: 600;
          line-height: 1.25;
          text-align: center;
        }
        .vv-contact-external-icon {
          position: absolute;
          top: 50%;
          right: 0;
          opacity: 0;
          transform: translate(-4px, calc(-50% + 4px));
          transition: opacity 200ms ease, transform 200ms ease;
          pointer-events: none;
        }
        .vv-contact-image-link:hover .vv-contact-external-icon,
        .vv-contact-image-link:focus-visible .vv-contact-external-icon {
          opacity: 1;
          transform: translate(0, -50%);
        }
        .vv-contact-image-link:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
          

        @media (max-width: 767px) {
        .elementor-61 .elementor-element.elementor-element-67b88a0 {
        margin-top: 50px !important;}

        .bimg{height: 80px; width: 150px;}
          .elementor-element-67b88a0 {
            display: flex !important;
            visibility: visible !important;
          }
          .elementor-element-67b88a0 .elementor-invisible {
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
        @media (hover: none) {
          .vv-contact-external-icon {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vv-contact-external-icon { transition: none; }
        }
      `}</style>
    </PageLayout>
  );
}
