import { AMENITIES_DATA } from '@/data/amenities';

// One shared amenities layout on every model detail page.
// Keep the existing Spaciaz/Elementor layout and card CSS classes.
const cardIds = ['c54cafa', '762d510', '2888386', '1425ebe', 'efa3ab5', 'ae5fa46', '9173697'];
const decorIds = ['8da92c2', '4207a49', '9e4845d', 'a696359', 'f85ef1e', '9e78cca', '1478ce6'];
const iconBoxIds = ['7d9c906', '5e4408d', '7b86c59', 'e70b34a', '671470e', 'b50b810', '95b71c2'];

export default function ProjectAmenities() {
  return (
    <div className="elementor-element elementor-element-30b0f85 e-flex e-con-boxed e-con e-parent" data-id="30b0f85" data-element_type="container">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-4ef38e2 elementor-widget elementor-widget-heading" data-id="4ef38e2" data-element_type="widget" data-widget_type="heading.default">
          <div className="elementor-widget-container"><h3 className="elementor-heading-title elementor-size-default">Township Amenities</h3></div>
        </div>
        <div className="elementor-element elementor-element-5a51ae4 e-grid e-con-full e-con e-child" data-id="5a51ae4" data-element_type="container">
          {AMENITIES_DATA.map((item, index) => (
            <div key={item.id} className={`elementor-element elementor-element-${cardIds[index]} e-con-full e-flex e-con e-child`} data-id={cardIds[index]} data-element_type="container" data-settings='{"background_background":"gradient"}'>
              <div className={`elementor-element elementor-element-${decorIds[index]} elementor-absolute elementor-view-default elementor-widget elementor-widget-icon`} data-id={decorIds[index]} data-element_type="widget" data-widget_type="icon.default">
                <div className="elementor-widget-container"><div className="elementor-icon-wrapper"><div className="elementor-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="320" height="104" viewBox="0 0 320 104" fill="none" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M0 0H320C290.545 0 267.772 24.6753 253.628 49.8666C235.516 82.1247 200.378 104 160 104C119.622 104 84.4835 82.1247 66.3718 49.8666C52.228 24.6753 29.4552 0 0 0Z" fill="white"/></svg>
                </div></div></div>
              </div>
              <div className={`elementor-element elementor-element-${iconBoxIds[index]} elementor-view-stacked elementor-shape-circle elementor-position-top elementor-mobile-position-top elementor-widget elementor-widget-icon-box`} data-id={iconBoxIds[index]} data-element_type="widget" data-widget_type="icon-box.default">
                <div className="elementor-widget-container"><div className="elementor-icon-box-wrapper">
                  <div className="elementor-icon-box-icon"><span className="elementor-icon elementor-animation-grow">{item.icon}</span></div>
                  <div className="elementor-icon-box-content"><h6 className="elementor-icon-box-title"><span>{item.name}</span></h6><p className="elementor-icon-box-description">{item.tag}</p></div>
                </div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
