import './ValuesGrid.css';
import { coreValues } from '@/data/core-values';
import ValueCard from './ValueCard';

export default function ValuesGrid() {
  return (
    <div
      className="elementor-element elementor-element-78047fa e-flex e-con-boxed e-con e-parent"
      data-id="78047fa"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-c67112f e-con-full e-flex e-con e-child"
          data-id="c67112f"
          data-element_type="container"
          data-settings='{"background_background":"classic"}'
        >
          <div
            className="elementor-element elementor-element-0ad3d2a e-con-full e-flex e-con e-child"
            data-id="0ad3d2a"
            data-element_type="container"
          >
            <div
              className="elementor-element elementor-element-d9ce843 elementor-widget__width-initial elementor-widget elementor-widget-spacer"
              data-id="d9ce843"
              data-element_type="widget"
              data-settings='{"spaciaz_decor_top_right":"yes","spaciaz_decor_bottom_left":"yes"}'
              data-widget_type="spacer.default"
            >
              <div className="elementor-widget-container">
                <div className="elementor-spacer">
                  <div className="elementor-spacer-inner" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="elementor-element elementor-element-c2224dc elementor-widget-spaciaz-iconbox e-grid e-con-full e-con e-child"
          data-id="c2224dc"
          data-element_type="container"
        >
          {coreValues.map((value, index) => (
            <ValueCard key={value.id} value={value} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

