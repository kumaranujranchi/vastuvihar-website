import Link from 'next/link';

import './ProjectsSection.css';
import '../projects/ProjectCard.css';
import '../common/ScrollingTicker.css';


const tickerItems = ['selected projects', '·', 'selected projects', '·'];

const projects = [
  {
    name: 'Ananta Bungalow',
    type: 'bungalow',
    status: 'Premium',
    image: '/villa/ananta.webp',
    imageWidth: 1920,
    imageHeight: 1344,
    href: '/projects/ananta-bungalow/',
    details: 'BUA: 1800 Sqft, 50 - 70 Lac',
  },
  {
    name: 'CEO Bungalow',
    type: 'bungalow',
    status: 'Premium',
    image: '/villa/ceo.webp',
    imageWidth: 1920,
    imageHeight: 1280,
    href: '/projects/ceo-bungalow/',
    details: 'BUA: 2500 Sqft, 90 Lac - 1.80Cr',
  },
  {
    name: 'Simplex Bungalow',
    type: 'bungalow',
    status: '2-BHK',
    image: '/villa/simplex.webp',
    imageWidth: 1920,
    imageHeight: 1248,
    href: '/projects/simplex-bungalow/',
    details: 'BUA: 1000 Sqft, 30 - 35 Lac',
  },
  {
    name: 'Ganga',
    alt: 'Ganga Flat',
    type: 'flat',
    status: 'Flat',
    image: '/villa/ganga.webp',
    imageWidth: 1920,
    imageHeight: 1081,
    href: '/projects/ganga-new-2bhk/',
    details: 'BUA: 510 Sqft, 10 - 16 Lac',
  },
];

function ScrollingTicker() {
  return (
    <div className="elementor-scrolling">
      <div className="elementor-scrolling-wrapper">
        {Array.from({ length: 5 }).map((_, groupIndex) => (
          <div className="elementor-scrolling-inner" key={groupIndex}>
            {tickerItems.map((item, itemIndex) => (
              <div className="elementor-scrolling-item" key={`${groupIndex}-${itemIndex}`}>
                <div className="elementor-scrolling-item-inner">
                  <div
                    className={`scrolling-title ${
                      itemIndex % 2 === 0
                        ? itemIndex === 0
                          ? 'elementor-repeater-item-3eace46'
                          : 'elementor-repeater-item-18b9ba4'
                        : itemIndex === 1
                          ? 'elementor-repeater-item-9398599'
                          : 'elementor-repeater-item-194a249'
                    }`}
                  >
                    <span>{item}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="grid-item">
      <div
        className="project-item project-style-1"
        data-type={project.type}
      >
        <div className="project-post-thumbnail">
          <div className="project-status">
            <Link href="#" rel="tag" prefetch={false}>
              {project.status}
            </Link>
          </div>

          <img
            loading="lazy"
            decoding="async"
            width={project.imageWidth}
            height={project.imageHeight}
            src={project.image}
            className="attachment-full size-full wp-post-image"
            alt={project.alt || project.name}
          />
        </div>

        <div className="project-content">
          <div className="project-location">
            <Link href={project.href} rel="tag" prefetch={false}>
              {project.details}
            </Link>
          </div>

          <h4 className="project-title delta">
            <Link href={project.href} prefetch={false}>
              {project.name}
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <div
      className="elementor-element elementor-element-bdfd05f e-flex e-con-boxed e-con e-parent"
      data-id="bdfd05f"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-2df9746 e-con-full e-flex e-con e-child"
          data-id="2df9746"
          data-element_type="container"
          data-settings='{"background_background":"classic"}'
        >
          <div
            className="elementor-element elementor-element-3a54ef5 box-width-yes elementor-widget__width-initial animated-fast spaciaz-scrolling-ltr elementor-invisible elementor-widget elementor-widget-spaciaz-slide-scrolling"
            data-id="3a54ef5"
            data-element_type="widget"
            data-settings='{"_animation":"opal-helix"}'
            data-widget_type="spaciaz-slide-scrolling.default"
          >
            <div className="elementor-widget-container">
              <ScrollingTicker />
            </div>
          </div>

          <div
            className="elementor-element elementor-element-5791868 elementor-widget__width-initial animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="5791868"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-left"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Explore our recent project
              </h2>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-b1d967b e-con-full e-flex e-con e-child"
          data-id="b1d967b"
          data-element_type="container"
        >
          <div
            className="elementor-element elementor-element-f7665c2 enable-style-icon-yes animated-fast elementor-button-outline icon-spaciaz-right elementor-invisible elementor-widget elementor-widget-spaciaz-button"
            data-id="f7665c2"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-right"}'
            data-widget_type="spaciaz-button.default"
          >
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Link
                  href="/projects/"
                  className="elementor-button-link elementor-button elementor-size-sm"
                  prefetch={false}
                >
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <span className="btn-icon-wrap">
                        <span className="btn-icon">
                          <i
                            aria-hidden="true"
                            className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                          />
                        </span>

                        <span className="btn-icon-hover">
                          <i
                            aria-hidden="true"
                            className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                          />
                        </span>
                      </span>
                    </span>

                    <span
                      className="elementor-button-text"
                      data-name="view all projects"
                    >
                      <span>view all projects</span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="elementor-element elementor-element-c2dd8d4 elementor-widget__width-inherit elementor-project-style-1 overflow-to-none elementor-widget elementor-widget-spaciaz-projects"
          data-id="c2dd8d4"
          data-element_type="widget"
          data-settings='{"slides_to_show":3,"spaceBetween":{"unit":"px","size":30,"sizes":[]},"spaceBetween_laptop":{"unit":"px","size":"","sizes":[]},"spaceBetween_tablet_extra":{"unit":"px","size":"","sizes":[]},"spaceBetween_tablet":{"unit":"px","size":"","sizes":[]},"spaceBetween_mobile_extra":{"unit":"px","size":"","sizes":[]},"spaceBetween_mobile":{"unit":"px","size":"","sizes":[]},"swiper_overflow":"none","navigation":"none","enable_scrollbar":"no","autoplay":"yes","pause_on_hover":"yes","pause_on_interaction":"yes","autoplay_speed":5000,"infinite":"yes","loopAdditionalSlides":0,"speed":500}'
          data-widget_type="spaciaz-projects.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-project-wrapper">
              <div className="d-grid">
                {projects.map((project) => (
                  <ProjectCard key={project.href} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
