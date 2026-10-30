import './AboutTestimonials.css';
import '../common/ScrollingTicker.css';

const testimonials = [
  {
    id: '8c5d7ed',
    text: '“Discover homes designed to bring together comfort, modern living and affordability across our growing communities.”',
    job: 'Our commitment',
  },
  {
    id: '7232e71',
    text: '"Explore thoughtfully planned bungalows and flats supported by community amenities and convenient locations."',
    job: 'Our communities',
  },
  {
    id: 'f3f5cd8',
    text: '"From your first enquiry to your site visit, our team can help you compare home options that suit your requirements."',
    job: 'Our approach',
  },
  {
    id: '2d49c77',
    text: '“At Vastu Vihar, we focus on quality homes, lasting relationships and more accessible homeownership.”',
    job: 'Our approach',
  },
];

const partnerGroups = [
  [
    ['union-bank-of-india.svg', 'Union Bank of India'],
    ['state-bank-of-india.svg', 'State Bank of India'],
    ['punjab-national-bank.svg', 'Punjab National Bank'],
    ['lic-housing-finance.svg', 'LIC Housing Finance'],
    ['jharkhand-gramin-bank.svg', 'Jharkhand Gramin Bank'],
    ['indian-bank.svg', 'Indian Bank'],
  ],
  [
    ['idbi-bank.svg', 'IDBI Bank'],
    ['hdfc-bank.svg', 'HDFC Bank'],
    ['central-bank-of-india.svg', 'Central Bank of India'],
    ['canara-bank.svg', 'Canara Bank'],
    ['bank-of-maharashtra.svg', 'Bank of Maharashtra'],
    ['bank-of-india.svg', 'Bank of India'],
  ],
  [
    ['bank-of-baroda.svg', 'Bank of Baroda'],
    ['axis-bank.svg', 'Axis Bank'],
    ['union-bank-of-india.svg', 'Union Bank of India'],
    ['state-bank-of-india.svg', 'State Bank of India'],
    ['punjab-national-bank.svg', 'Punjab National Bank'],
    ['lic-housing-finance.svg', 'LIC Housing Finance'],
  ],
  [
    ['jharkhand-gramin-bank.svg', 'Jharkhand Gramin Bank'],
    ['indian-bank.svg', 'Indian Bank'],
    ['idbi-bank.svg', 'IDBI Bank'],
    ['hdfc-bank.svg', 'HDFC Bank'],
    ['central-bank-of-india.svg', 'Central Bank of India'],
    ['canara-bank.svg', 'Canara Bank'],
  ],
  [
    ['bank-of-maharashtra.svg', 'Bank of Maharashtra'],
    ['bank-of-india.svg', 'Bank of India'],
    ['bank-of-baroda.svg', 'Bank of Baroda'],
    ['axis-bank.svg', 'Axis Bank'],
    ['union-bank-of-india.svg', 'Union Bank of India'],
    ['state-bank-of-india.svg', 'State Bank of India'],
  ],
];

export default function AboutTestimonials() {
  return (
    <div
      className="elementor-element elementor-element-f78d434 e-flex e-con-boxed e-con e-parent"
      data-id="f78d434"
      data-element_type="container"
      data-settings='{"background_background":"gradient"}'
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-69ea2b3 e-con-full e-flex e-con e-child"
          data-id="69ea2b3"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-2e05536 elementor-absolute elementor-widget elementor-widget-image"
            data-id="2e05536"
            data-element_type="widget"
            data-settings='{"_position":"absolute"}'
            data-widget_type="image.default"
          >
            <div className="elementor-widget-container">
              <img
                loading="lazy"
                decoding="async"
                width="140"
                height="140"
                src="/villa/yamuna2.webp"
                className="attachment-full size-full wp-image-510"
                alt=""
              />
            </div>
          </div>

          <div
            className="elementor-element elementor-element-8aa9af9 elementor-absolute elementor-view-default elementor-widget elementor-widget-icon"
            data-id="8aa9af9"
            data-element_type="widget"
            data-settings='{"_position":"absolute"}'
            data-widget_type="icon.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-icon-wrapper">
                <div className="elementor-icon">
                  <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-quote-1" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="elementor-element elementor-element-cc3d78d rotate elementor-widget elementor-widget-text-path"
            data-id="cc3d78d"
            data-element_type="widget"
            data-settings='{"text":"the vastu vihar promise · the vastu vihar promise · ","align":"center","link":{"url":"","is_external":"","nofollow":"","custom_attributes":""},"start_point":{"unit":"%","size":0,"sizes":[]}}'
            data-widget_type="text-path.default"
          >
            <div className="elementor-widget-container">
              <div
                className="e-text-path"
                data-text="the vastu vihar promise · the vastu vihar promise · "
                data-link-url=""
              />
            </div>
          </div>

          <div
            className="elementor-element elementor-element-b8a5f5f elementor-absolute elementor-view-default elementor-widget elementor-widget-icon"
            data-id="b8a5f5f"
            data-element_type="widget"
            data-settings='{"_position":"absolute"}'
            data-widget_type="icon.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-icon-wrapper">
                <div className="elementor-icon">
                  {/* <svg
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
                  </svg> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-8ee7234 alignment-center elementor-swiper-button-next-horizontal-right elementor-swiper-button-prev-horizontal-left elementor-swiper-button-next-vertical-top elementor-swiper-button-prev-vertical-top animated-fast testimonial-layout-1 overflow-to-none elementor-invisible elementor-widget elementor-widget-spaciaz-testimonials"
          data-id="8ee7234"
          data-element_type="widget"
          data-settings='{"slides_to_show":"1","navigation":"arrows","_animation":"opal-move-up","testimonial_layout":"1","spaceBetween":{"unit":"px","size":30,"sizes":[]},"spaceBetween_laptop":{"unit":"px","size":"","sizes":[]},"spaceBetween_tablet_extra":{"unit":"px","size":"","sizes":[]},"spaceBetween_tablet":{"unit":"px","size":"","sizes":[]},"spaceBetween_mobile_extra":{"unit":"px","size":"","sizes":[]},"spaceBetween_mobile":{"unit":"px","size":"","sizes":[]},"swiper_overflow":"none","enable_scrollbar":"no","autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes","autoplay_speed":5000,"infinite":"yes","loopAdditionalSlides":0,"effect":"slide","speed":500}'
          data-widget_type="spaciaz-testimonials.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-testimonial-item-wrapper spaciaz-swiper swiper" dir="ltr">
              <div className="layout-1 swiper-wrapper">
                {testimonials.map(({ id, text, job }) => (
                  <div className="grid-item swiper-slide elementor-testimonial-item" key={id}>
                    <div className={`testimonial-content elementor-repeater-item-${id}`}>
                      <div className="wrap_content">
                        <div className="content-head">
                          <div className="content">
                            <p>{text}</p>
                          </div>
                        </div>
                        <div className="details">
                          <div className="details-info">
                            <span className="name">Vastu Vihar</span>
                            <span className="job">{job}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="elementor-swiper-button elementor-swiper-button-prev">
              <i className="spaciaz-icon-chevron-left" aria-hidden="true" />
              <span className="elementor-screen-only">Previous</span>
            </div>
            <div className="elementor-swiper-button elementor-swiper-button-next">
              <i className="spaciaz-icon-chevron-right" aria-hidden="true" />
              <span className="elementor-screen-only">Next</span>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-1e442f7 e-con-full e-flex e-con e-child"
          data-id="1e442f7"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-76152b0 animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="76152b0"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-up"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Our home financing partners
              </h2>
            </div>
          </div>

          <div
            className="elementor-element elementor-element-801eddd box-width-yes spaciaz-scrolling-ltr elementor-widget elementor-widget-spaciaz-slide-scrolling"
            data-id="801eddd"
            data-element_type="widget"
            data-widget_type="spaciaz-slide-scrolling.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-scrolling">
                <div className="elementor-scrolling-wrapper">
                  {partnerGroups.map((group, groupIndex) => (
                    <div className="elementor-scrolling-inner" key={groupIndex}>
                      {group.map(([file, name], itemIndex) => (
                        <div className="elementor-scrolling-item" key={`${file}-${groupIndex}-${itemIndex}`}>
                          <div className="elementor-scrolling-item-inner">
                            <div className="elementor-icon">
                              <img
                                src={`/bank-svg/${file}`}
                                width="111"
                                height="87"
                                alt={name}
                                className="partner-logo"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
