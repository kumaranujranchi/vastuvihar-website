
"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Deepak",
    initials: "DK",
    job: "Patna • Ananta Bungalow",
    review: "Vastu Vihar ke saath apna ghar lena ekdum sahi decision tha. Unhone budget ke andar itna shandaar bungalow bana ke diya ki poori family khush hai. Construction quality aur finishing top-notch hai.",
    color: "#1E293B",
  },
  {
    name: "Jayanti",
    initials: "JY",
    job: "Ranchi • Jayanti Bungalow",
    review: "Hamara sapno ka ghar bilkul time par ready hoke mil gaya. Society ka mahaul bahut peaceful hai aur bacchon ke khelne ke liye kaafi open space hai. Team ne har step par poora support kiya.",
    color: "#7C2D12",
  },
  {
    name: "Rehan",
    initials: "RH",
    job: "Jamshedpur • Simplex Bungalow",
    review: "Working with the Vastu Vihar team was a truly smooth experience. Booking se lekar registry aur handover tak koi tension nahi hui, sab kuch transparent tha aur staff ka behaviour bahut helpful raha.",
    color: "#0F5338",
  },
  {
    name: "Manish",
    initials: "MN",
    job: "Gaya • Kaveri Bungalow",
    review: "Itne affordable price mein apna independent bungalow milna mushkil tha. Vastu Vihar ne middle-class family ka apna ghar hone ka sapna sach kar dikhaya. Room layout aur ventilation kamaal ka hai.",
    color: "#3B0764",
  },
  {
    name: "Manoj",
    initials: "MJ",
    job: "Dhanbad • Godawari Bungalow",
    review: "Paperwork aur loan process mein team ne bahut help ki. Jab hum pehli baar site visit par aaye the tabhi decide kar liya tha ki ghar yahin lena hai. Aaj hum yahan bahut sukoon se reh rahe hain.",
    color: "#1E3A8A",
  },
  {
    name: "Niranjan",
    initials: "NR",
    job: "Muzaffarpur • 2 & 3 BHK Flat",
    review: "Ghar ka Vastu aur design dono hi dil ko chhoo gaye. Har kamre mein natural roshni aati hai aur parking ki bhi acchhi suvidha hai. Main apne doston ko bhi Vastu Vihar recommend karta hoon.",
    color: "#701A75",
  },
  {
    name: "AK Pathak",
    initials: "AP",
    job: "Bhagalpur • CEO Bungalow",
    review: "Retirement ke baad ek shant aur safe township chahiye thi. Vastu Vihar mein security, sadak aur paani ki vyavastha bahut badhiya hai. Yahan aakar lagta hai sahi jagah invest kiya.",
    color: "#14532D",
  },
  {
    name: "Ragvendra",
    initials: "RG",
    job: "Darbhanga • Ganga New 2BHK",
    review: "Kam budget mein itna sundar aur majboot ghar milna badi baat hai. Kiraye ke makaan se nikal kar apne khud ke ghar mein shift hona hamare parivaar ke liye sabse badi khushi ka pal tha.",
    color: "#7F1D1D",
  },
  {
    name: "Mithlesh",
    initials: "MT",
    job: "Begusarai • Ananta Bungalow",
    review: "Vastu Vihar ka naam bharose ka doosra naam hai. Jo commitment unhone booking ke waqt kiya tha, usse badhkar kaam karke dikhaya. Poori team ko dil se dhanyavaad!",
    color: "#312E81",
  },
];

export default function ImageSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
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
          className="elementor-element elementor-element-9f847e0 animated-fast elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-invisible elementor-widget elementor-widget-icon-list"
          data-id="9f847e0"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-scale-up"}'}
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
          className="elementor-element elementor-element-7445366 alignment-center elementor-swiper-button-next-horizontal-right elementor-swiper-button-prev-horizontal-left elementor-swiper-button-next-vertical-top elementor-swiper-button-prev-vertical-top animated-fast testimonial-layout-1 overflow-to-none elementor-widget elementor-widget-spaciaz-testimonials"
          data-id="7445366"
          data-element_type="widget"
          data-settings={
            '{"slides_to_show":"1","navigation":"arrows","_animation":"opal-move-up","testimonial_layout":"1","spaceBetween":{"unit":"px","size":30,"sizes":[]},"autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes","autoplay_speed":5000,"infinite":"yes","loopAdditionalSlides":0,"effect":"slide","speed":500}'
          }
          data-widget_type="spaciaz-testimonials.default"
        >
          <div className="elementor-widget-container">
            <div
              className="elementor-testimonial-item-wrapper spaciaz-swiper swiper"
              dir="ltr"
            >
              <div className="layout-1 swiper-wrapper">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`grid-item swiper-slide elementor-testimonial-item ${
                      index === activeIndex ? "swiper-slide-active" : ""
                    }`}
                    style={{
                      display: index === activeIndex ? "block" : "none",
                    }}
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
              <i
                className="spaciaz-icon-chevron-left"
                aria-hidden="true"
              ></i>
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
              <i
                className="spaciaz-icon-chevron-right"
                aria-hidden="true"
              ></i>
              <span className="elementor-screen-only">Next</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
