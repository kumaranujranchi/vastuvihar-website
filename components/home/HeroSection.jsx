import Link from 'next/link';

export default function HeroSection() {
  return (
    <div
      className="elementor-element elementor-element-71f6b7a e-con-full e-flex e-con e-parent"
      data-id="71f6b7a"
      data-element_type="container"
      id="tab_video"
      data-settings={'{"background_background":"classic"}'}
    >
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
                We developed landmark real estate projects that deliver lasting value to investors and
                communities.{' '}
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
                  Defining the standards of real estate development
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
                        <span>view all projects</span>
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
                  <div className="video-tabs-content">
                    <div className="video-tab-content active" id="video-tab-0">
                      <div className="video-container">
                        <iframe
                          className=""
                          src={
                            'https://player.vimeo.com/video/1190405141?loop=1&muted=1&controls=0&autoplay=1'
                          }
                          loading="lazy"
                          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                          referrerPolicy="strict-origin-when-cross-origin"
                          title="Video player"
                        ></iframe>
                      </div>{' '}
                    </div>
                    <div className="video-tab-content " id="video-tab-1">
                      <div className="video-container">
                        <video
                          width="100%"
                          height="auto"
                          loop={true}
                          autoPlay={true}
                          playsInline={true}
                          muted={true}
                          crossOrigin="anonymous"
                          preload="auto"
                        >
                          <source
                            src="https://videos.pexels.com/video-files/2818546/2818546-uhd_2560_1440_24fps.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>{' '}
                    </div>
                    <div className="video-tab-content " id="video-tab-2">
                      <div className="video-container">
                        <video
                          width="100%"
                          height="auto"
                          loop={true}
                          autoPlay={true}
                          playsInline={true}
                          muted={true}
                          crossOrigin="anonymous"
                          preload="auto"
                        >
                          <source
                            src="https://videos.pexels.com/video-files/3648257/3648257-uhd_2560_1440_30fps.mp4"
                            type="video/mp4"
                          />
                        </video>
                      </div>{' '}
                    </div>
                  </div>
                  <div className="video-tabs-nav">
                    <div className="video-tab-nav-item active" data-tab="video-tab-0">
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/images/h5_video-1.jpg"
                          className="attachment-full size-full wp-image-7480"
                          alt=""
                        />{' '}
                      </div>
                    </div>
                    <div className="video-tab-nav-item " data-tab="video-tab-1">
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/images/h5_video-2.jpg"
                          className="attachment-full size-full wp-image-7481"
                          alt=""
                        />{' '}
                      </div>
                    </div>
                    <div className="video-tab-nav-item " data-tab="video-tab-2">
                      <div className="elementor-video-tabs-image">
                        <img
                          decoding="async"
                          width="190"
                          height="80"
                          src="/images/h5_video-3.jpg"
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
            src="/images/h5_bg-1.jpg"
            className="attachment-full size-full wp-image-6383"
            alt=""
          />{' '}
        </div>
      </div>
    </div>
  );
}
