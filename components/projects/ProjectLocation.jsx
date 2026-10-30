import './ProjectLocation.css';
// The supplied models are house designs rather than geolocated projects.
// Replace the template's fake US location/map/transport with the real room data.
export default function ProjectLocation({ project }) {
  const categories = (project.modelTypes || []).flatMap(type =>
    (type.areaBreakdown || []).map(section => ({ ...section, modelName: type.modelName }))
  );
  const stats = (project.modelTypes || []).flatMap(type => type.stats || []);
  return (
    <div className="elementor-element elementor-element-0f1dfda e-flex e-con-boxed e-con e-parent" data-id="0f1dfda" data-element_type="container">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-ab8fd4c elementor-widget elementor-widget-heading" data-id="ab8fd4c" data-element_type="widget" data-widget_type="heading.default">
          <div className="elementor-widget-container"><h3 className="elementor-heading-title elementor-size-default">Layout & Area Breakdown</h3></div>
        </div>
        <div className="elementor-element elementor-element-9370c86 e-grid e-con-full e-con e-child" data-id="9370c86" data-element_type="container">
          <div className="elementor-element elementor-element-f6c19d9 e-con-full e-flex e-con e-child" data-id="f6c19d9" data-element_type="container">
            {categories.length > 0 ? categories.map((section, index) => (
              <div key={`${section.modelName}-${section.categoryName}-${index}`} className="elementor-element elementor-widget elementor-widget-text-editor" data-element_type="widget" data-widget_type="text-editor.default">
                <div className="elementor-widget-container">
                  <h5 className="elementor-heading-title elementor-size-default">{section.categoryName}</h5>
                  <ul className="elementor-icon-list-items">
                    {section.items.map((item, i) => (
                      <li className="elementor-icon-list-item" key={`${item.room}-${i}`}>
                        <span className="elementor-icon-list-text"><strong>{item.room}</strong>{item.dimensions ? ` — ${item.dimensions}` : ''}{item.features ? ` (${item.features})` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )) : (
              <div className="elementor-element elementor-widget elementor-widget-text-editor" data-widget_type="text-editor.default"><div className="elementor-widget-container"><p>Detailed room measurements are not provided for this model. Please refer to its floor plans above.</p></div></div>
            )}
          </div>
          <div className="elementor-element elementor-element-598f139 e-con-full e-flex e-con e-child" data-id="598f139" data-element_type="container">
            <div className="elementor-element elementor-element-e5017f0 elementor-widget elementor-widget-heading" data-id="e5017f0" data-element_type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container"><h6 className="elementor-heading-title elementor-size-default">Model Specifications</h6></div>
            </div>
            <div className="elementor-element elementor-element-50f596a e-grid e-con-full e-con e-child" data-id="50f596a" data-element_type="container">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="elementor-element elementor-widget elementor-widget-text-editor" data-element_type="widget" data-widget_type="text-editor.default">
                  <div className="elementor-widget-container"><p>{stat.label}<span style={{ color: '#000000', display: 'block' }}><strong>{stat.value}{stat.unit ? ` ${stat.unit}` : ''}</strong></span></p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
