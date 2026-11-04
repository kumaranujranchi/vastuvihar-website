"use client";

import './ImageSection.css';
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Deepak",
    initials: "DK",
    job: "Patna • Ananta Bungalow",
    review: "Buying a home with Vastu Vihar was the absolute right decision. They built such a magnificent bungalow within our budget that the whole family is thrilled. The construction quality and finishing are top-notch.",
    color: "#1E293B",
  },
  {
    name: "Jayanti",
    initials: "JY",
    job: "Ranchi • Jayanti Bungalow",
    review: "Our dream home was handed over right on time. The society atmosphere is very peaceful, and there is ample open space for kids to play. The team provided full support at every step.",
    color: "#7C2D12",
  },
  {
    name: "Rehan",
    initials: "RH",
    job: "Jamshedpur • Simplex Bungalow",
    review: "Working with the Vastu Vihar team was a truly smooth experience. From booking to registry and handover, there was zero tension. Everything was transparent, and the staff's behavior was very helpful.",
    color: "#0F5338",
  },
  {
    name: "Manish",
    initials: "MN",
    job: "Gaya • Kaveri Bungalow",
    review: "Finding an independent bungalow at such an affordable price was difficult. Vastu Vihar made a middle-class family's dream of owning a home come true. The room layout and ventilation are amazing.",
    color: "#3B0764",
  },
  {
    name: "Manoj",
    initials: "MJ",
    job: "Dhanbad • Godawari Bungalow",
    review: "The team really helped with the paperwork and loan process. When we came for the first site visit, we decided right then that we would buy a house here. Today, we are living here very peacefully.",
    color: "#1E3A8A",
  },
  {
    name: "Niranjan",
    initials: "NR",
    job: "Muzaffarpur • 2 & 3 BHK Flat",
    review: "Both the Vastu and design of the house touched our hearts. There is natural light in every room, and the parking facility is also good. I highly recommend Vastu Vihar to my friends.",
    color: "#701A75",
  },
  {
    name: "AK Pathak",
    initials: "AP",
    job: "Bhagalpur • CEO Bungalow",
    review: "After retirement, I wanted a quiet and safe township. The security, roads, and water arrangements in Vastu Vihar are excellent. Coming here, I feel I invested in the right place.",
    color: "#14532D",
  },
  {
    name: "Ragvendra",
    initials: "RG",
    job: "Darbhanga • Ganga New 2BHK",
    review: "Getting such a beautiful and sturdy home on a low budget is a big deal. Moving from a rented house to our own home was the happiest moment for our family.",
    color: "#7F1D1D",
  },
  {
    name: "Mithlesh",
    initials: "MT",
    job: "Begusarai • Ananta Bungalow",
    review: "The name Vastu Vihar is synonymous with trust. They went above and beyond the commitment they made at the time of booking. A heartfelt thank you to the entire team!",
    color: "#312E81",
  },
];

export default function ImageSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Start autoplay as soon as the component mounts. Keep the timer independent
  // of pointer hover, which otherwise makes the carousel appear permanently paused
  // when the mouse happens to rest over the section.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div
      className="elementor-element elementor-element-4b0bf33 e-flex e-con-boxed e-con e-parent"
      data-id="4b0bf33"
      data-element_type="container"
      data-settings={'{"background_background":"classic"}'}
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-9f847e0 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list"
          data-id="9f847e0"
          data-element_type="widget"
          data-widget_type="icon-list.default"
        >
          <div className="elementor-widget-container">
            <ul className="elementor-icon-list-items">
              <li className="elementor-icon-list-item">
                <span className="elementor-icon-list-icon">
                  <i
                    aria-hidden="true"
                    className="spaciaz-icon- spaciaz-icon-star"
                  ></i>{" "}
                </span>
                <span className="elementor-icon-list-text">
                  What Our Homeowners Say
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-84ecd1a elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-spacer"
          data-id="84ecd1a"
          data-element_type="widget"
          data-settings={
            '{"spaciaz_decor_top_right":"yes","_position":"absolute","spaciaz_decor_top_left":"yes"}'
          }
          data-widget_type="spacer.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-spacer">
              <div className="elementor-spacer-inner"></div>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-7445366 alignment-center elementor-swiper-button-next-horizontal-right elementor-swiper-button-prev-horizontal-left elementor-swiper-button-next-vertical-top elementor-swiper-button-prev-vertical-top testimonial-layout-1 overflow-to-none elementor-widget elementor-widget-spaciaz-testimonials"
          data-id="7445366"
          data-element_type="widget"
          data-widget_type="spaciaz-testimonials.default"
        >
          <div className="elementor-widget-container">
            <div
              className="elementor-testimonial-item-wrapper vv-testimonial-viewport"
              dir="ltr"
              style={{ overflow: "hidden", width: "100%" }}
            >
              {/* Render all reviews on the server. The first is visible immediately;
                  React only changes the active class during autoplay. */}
              <div className="layout-1 vv-testimonial-track">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`grid-item elementor-testimonial-item ${
                      index === activeIndex ? "vv-testimonial-active" : ""
                    }`}
                    aria-hidden={index !== activeIndex}
                  >
                    <div className="testimonial-content">
                      <div className="wrap_content">
                        <div className="content-head">
                          <div className="content">
                            <p>“{testimonial.review}”</p>
                          </div>
                        </div>

                        <div className="details">
                          <div className="elementor-testimonial-image">
                            <div
                              role="img"
                              aria-label={testimonial.name}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                backgroundColor: testimonial.color,
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {testimonial.initials}
                            </div>
                          </div>

                          <div className="details-info">
                            <span className="name">
                              {testimonial.name}
                            </span>{" "}
                            <span className="job">
                              {testimonial.job}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restore the theme's original Previous/Next controls. */}
            <div
              className="elementor-swiper-button elementor-swiper-button-prev"
              onClick={prevSlide}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  prevSlide();
                }
              }}
            >
              <i className="spaciaz-icon-chevron-left" aria-hidden="true"></i>
              <span className="elementor-screen-only">Previous</span>
            </div>

            <div
              className="elementor-swiper-button elementor-swiper-button-next"
              onClick={nextSlide}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  nextSlide();
                }
              }}
            >
              <i className="spaciaz-icon-chevron-right" aria-hidden="true"></i>
              <span className="elementor-screen-only">Next</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}