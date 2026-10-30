import './ProjectLocation.css';

export default function ProjectLocation({ project }) {
  const modelTypes = project?.modelTypes || [];

  const stats = modelTypes.flatMap((type) =>
    (type.stats || []).map((stat) => ({
      ...stat,
      modelName: type.modelName,
    }))
  );

  const categories = modelTypes.flatMap((type) =>
    (type.areaBreakdown || []).map((section) => ({
      ...section,
      modelName: type.modelName,
    }))
  );

  return (
    <section className="project-layout-section">
      <div className="project-layout-container">

        {/* ==============================
            MODEL SPECIFICATIONS
        ============================== */}
        {stats.length > 0 && (
          <div className="project-specifications">
            <div className="section-heading">
              <span className="section-label">Overview</span>
              <h3>Model Specifications</h3>
            </div>

            <div className="spec-table-wrapper">
              <table className="spec-table">
                <tbody>
                  {stats.map((stat, index) => (
                    <tr key={`${stat.modelName}-${stat.label}-${index}`}>
                      <td className="spec-label">
                        {stat.label}
                      </td>

                      <td className="spec-value">
                        {stat.value}
                        {stat.unit ? ` ${stat.unit}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==============================
            AREA BREAKDOWN
        ============================== */}
        <div className="area-breakdown-section">
          <div className="section-heading">
            <span className="section-label">Floor Plan</span>
            <h3>Layout &amp; Area Breakdown</h3>
          </div>

          {categories.length > 0 ? (
            <div className="area-breakdown-list">
              {categories.map((section, index) => (
                <div
                  className="area-category"
                  key={`${section.modelName}-${section.categoryName}-${index}`}
                >
                  <div className="area-category-header">
                    <h4>{section.categoryName}</h4>

                    {modelTypes.length > 1 && section.modelName && (
                      <span className="model-name">
                        {section.modelName}
                      </span>
                    )}
                  </div>

                  <div className="area-table-wrapper">
                    <table className="area-table">
                      <thead>
                        <tr>
                          <th>Space</th>
                          <th>Dimensions</th>
                          <th>Details</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(section.items || []).map((item, itemIndex) => (
                          <tr key={`${item.room}-${itemIndex}`}>
                            <td className="room-name">
                              {item.room}
                            </td>

                            <td className="room-dimensions">
                              {item.dimensions || '—'}
                            </td>

                            <td className="room-features">
                              {item.features || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="layout-empty-state">
              <p>
                Detailed room measurements are not provided for this model.
                Please refer to the floor plans above.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}