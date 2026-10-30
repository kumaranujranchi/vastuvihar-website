import './ProjectDescription.css';
// Keeps the existing Spaciaz description + key-details layout, with real model data.
export default function ProjectDescription({ project }) {
  const modelType = project.modelTypes?.[0];
  const detailRows = [
    ['Configuration', modelType?.modelName || project.type],
    ['Built-up Area', project.builtUp],
    ['Bedrooms', project.bedrooms],
    ['Bathrooms', project.bathrooms],
    ['Special Features', project.features?.slice(0, 3).join(' • ') || 'Contact us for details'],
  ];
  return (
    <div className="elementor-element elementor-element-168ca58 e-flex e-con-boxed e-con e-parent" data-id="168ca58" data-element_type="container">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-e01536b e-con-full e-flex e-con e-child" data-id="e01536b" data-element_type="container">
          <div className="elementor-element elementor-element-701fe10 elementor-widget elementor-widget-heading" data-id="701fe10" data-element_type="widget" data-widget_type="heading.default">
            <div className="elementor-widget-container"><h3 className="elementor-heading-title elementor-size-default">About {project.title}</h3></div>
          </div>
          <div className="elementor-element elementor-element-37d1674 elementor-widget elementor-widget-text-editor" data-id="37d1674" data-element_type="widget" data-widget_type="text-editor.default">
            <div className="elementor-widget-container"><p>{project.description}</p></div>
          </div>
          <div className="elementor-element elementor-element-328792e elementor-widget elementor-widget-text-editor" data-id="328792e" data-element_type="widget" data-widget_type="text-editor.default">
            <div className="elementor-widget-container">
              {project.features?.length > 0 && <p>{project.features.join(' · ')}</p>}
              {project.benefits?.filter(item => !/^please contact/i.test(item)).length > 0 && (
                <p>{project.benefits.filter(item => !/^please contact/i.test(item)).join(' · ')}</p>
              )}
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-268e4a4 e-con-full e-flex e-con e-child" data-id="268e4a4" data-element_type="container">
          <div className="elementor-element elementor-element-ee9c39f elementor-widget elementor-widget-heading" data-id="ee9c39f" data-element_type="widget" data-widget_type="heading.default">
            <div className="elementor-widget-container"><h6 className="elementor-heading-title elementor-size-default">Key Details</h6></div>
          </div>
          <div className="elementor-element elementor-element-9991a6a elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="9991a6a" data-element_type="widget" data-widget_type="icon-list.default">
            <div className="elementor-widget-container">
              <ul className="elementor-icon-list-items">
                {detailRows.map(([label, value]) => (
                  <li className="elementor-icon-list-item" key={label}>
                    <span className="elementor-icon-list-icon">
                      <svg aria-hidden="true" className="e-font-icon-svg e-fas-circle" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" /></svg>
                    </span>
                    <span className="elementor-icon-list-text"><b>{label}:</b> {value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
