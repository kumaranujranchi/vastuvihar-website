'use client';

import './HeroSection.css';
import { useState } from 'react';

import Link from 'next/link';

const YOUTUBE_IDS = [
  'z23qYKxkkiU',
  'w_x03DkwmOY',
  'x52x2VKPUcg',
];

export default function HeroSection() {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <div
      className="elementor-element elementor-element-71f6b7a e-con-full e-flex e-con e-parent"
      data-id="71f6b7a"
      data-element_type="container"
      id="tab_video"
      data-settings={'{"background_background":"classic"}'}
    >
      {/* Direct child of the outer hero: covers the entire hero, not an inner column. */}
      <div className="vv-hero-background" aria-hidden="true">
        <iframe
          key={YOUTUBE_IDS[activeVideo]}
          className="vv-hero-background-player"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_IDS[activeVideo]}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_IDS[activeVideo]}&controls=0&playsinline=1&rel=0`}
          title="Vastu Vihar background video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          allowFullScreen
        />
      </div>
      <div
        className="elementor-element elementor-element-ec08bea e-flex e-con-boxed e-con e-child"
        data-id="ec08bea"
        data-element_type="container"
      >
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-9593ae9 e-con-full e-flex e-con e-child"
            data-id="9593ae9"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-ee6dccb elementor-widget__width-initial animated-fast elementor-invisible elementor-widget elementor-widget-text-editor"
              data-id="ee6dccb"
              data-element_type="widget"
              data-settings={'{"_animation":"opal-move-right"}'}
              data-widget_type="text-editor.default"
            >
              <div className="elementor-widget-container">
                Discover homes that bring together modern living, smart design and a brighter tomorrow.
                {' '}
              </div>
            </div>
          </div>
          <div
            className="elementor-element elementor-element-d8f80a9 e-con-full e-flex e-con e-child"
            data-id="d8f80a9"
            data-element_type="container"
            data-settings={'{"background_background":"video"}'}
          >
            <div
              className="elementor-element elementor-element-49eaa0f elementor-widget__width-initial elementor-invisible elementor-widget elementor-widget-heading"
              data-id="49eaa0f"
              data-element_type="widget"
              data-settings={'{"_animation":"opal-move-up"}'}
              data-widget_type="heading.default"
            >
              <div className="elementor-widget-container">
                <h1 className="elementor-heading-title elementor-size-default">
                  Your Dream Home, Our Commitment.
                </h1>{' '}
              </div>
            </div>
            <div
              className="elementor-element elementor-element-d452400 enable-style-icon-yes animated-fast elementor-button-default icon-spaciaz-right elementor-invisible elementor-widget elementor-widget-spaciaz-button"
              data-id="d452400"
              data-element_type="widget"
              data-settings={'{"_animation":"opal-move-up"}'}
              data-widget_type="spaciaz-button.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <Link
                    href="/projects/"
                    className="elementor-button-link elementor-button elementor-size-sm"
                    role="button"
                    prefetch={false}
                  >
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-icon">
                        <span className="btn-icon-wrap">
                          <span className="btn-icon">
                            <i
                              aria-hidden="true"
                              className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                            ></i>{' '}
                          </span>
                          <span className="btn-icon-hover">
                            <i
                              aria-hidden="true"
                              className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                            ></i>{' '}
                          </span>
                        </span>
                      </span>
                      <span className="elementor-button-text" data-name="view all projects">
                        <span>View all Models</span>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="elementor-element elementor-element-3b2477b elementor-video-style-container elementor-widget elementor-widget-spaciaz-video-tabs"
              data-id="3b2477b"
              data-element_type="widget"
              data-widget_type="spaciaz-video-tabs.default"
            >
              <div className="elementor-widget-container">
                <div className="video-tabs-element" data-relative="#tab_video">
                  <div className="video-tabs-nav">
                    <div className={`video-tab-nav-item ${activeVideo === 0 ? "active" : ""}`} data-tab="video-tab-0" role="button" tabIndex={0} aria-label="Play video 1" aria-pressed={activeVideo === 0} onClick={() => setActiveVideo(0)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveVideo(0); } }}>
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/villa/yamuna.webp"
                          className="attachment-full size-full wp-image-7480"
                          alt=""
                        />{' '}
                      </div>
                    </div>
                    <div className={`video-tab-nav-item ${activeVideo === 1 ? "active" : ""}`} data-tab="video-tab-1" role="button" tabIndex={0} aria-label="Play video 2" aria-pressed={activeVideo === 1} onClick={() => setActiveVideo(1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveVideo(1); } }}>
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/villa/simplex.webp"
                          className="attachment-full size-full wp-image-7481"
                          alt=""
                        />{' '}
                      </div>
                    </div>
                    <div className={`video-tab-nav-item ${activeVideo === 2 ? "active" : ""}`} data-tab="video-tab-2" role="button" tabIndex={0} aria-label="Play video 3" aria-pressed={activeVideo === 2} onClick={() => setActiveVideo(2)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveVideo(2); } }}>
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/villa/ceo.webp"
                          className="attachment-full size-full wp-image-7479"
                          alt=""
                        />{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-1e6e2a6 elementor-widget elementor-widget-spacer"
        data-id="1e6e2a6"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-spacer">
            <div className="elementor-spacer-inner"></div>
          </div>
        </div>
      </div>
      <div
        className="elementor-element elementor-element-88c322d elementor-absolute elementor-widget elementor-widget-image"
        data-id="88c322d"
        data-element_type="widget"
        data-settings={'{"_position":"absolute"}'}
        data-widget_type="image.default"
      >
        <div className="elementor-widget-container">
          <img
            loading="lazy"
            decoding="async"
            width="1920"
            height="1000"
            src="/villa/yamuna.webp"
            className="attachment-full size-full wp-image-6383"
            alt=""
          />{' '}
        </div>
      </div>
    </div>
  );
}
