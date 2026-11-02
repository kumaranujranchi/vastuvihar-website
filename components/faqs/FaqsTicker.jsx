import './FaqsTicker.css';
import ScrollingTicker from '@/components/common/ScrollingTicker';
import StaticPill from '../common/StaticPill';


export default function FaqsTicker() {
  return (
    <div
      className="elementor-element elementor-element-9321a9a e-flex e-con-boxed e-con e-parent"
      data-id="9321a9a"
      data-element_type="container"
    >
      <div className="e-con-inner">
        <div
          className="elementor-element elementor-element-5a2202e e-con-full e-flex e-con e-child"
          data-id="5a2202e"
          data-element_type="container"
        >
           <StaticPill text="vastu vihar FAQs" />
          <div
            className="elementor-element elementor-element-a4c1de0 elementor-widget__width-initial elementor-widget-mobile_extra__width-inherit elementor-widget-mobile__width-inherit animated-fast elementor-invisible elementor-widget elementor-widget-heading"
            data-id="a4c1de0"
            data-element_type="widget"
            data-settings='{"_animation":"opal-move-up"}'
            data-widget_type="heading.default"
          >
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                Everything you need to know{' '}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

