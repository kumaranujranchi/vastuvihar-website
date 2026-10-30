import './ProjectHero.css';
// Shared project section. Its layout is reused for every project.

export default function ProjectHero({ project }) {
  return (
    <div
      className="elementor-element elementor-element-c7f6b67 e-flex e-con-boxed e-con e-parent"
      data-id="c7f6b67"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-0019a3b elementor-widget elementor-widget-spaciaz-post-thumbnails"
          data-id="0019a3b"
          data-element_type="widget"
          data-widget_type="spaciaz-post-thumbnails.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-post-thumbnail">
              <img
                fetchPriority="high"
                decoding="async"
                width="1290"
                height="600"
                src={project.image}
                className="attachment-post-thumbnail size-post-thumbnail wp-image-2179"
                alt={project.title}
              />
            </div>{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
