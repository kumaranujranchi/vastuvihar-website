import { faqs } from '@/data/faqs';

export default function FaqAccordion() {
  return (
    <div
      className="elementor-element elementor-element-062102f elementor-widget__width-inherit animated-fast elementor-invisible elementor-widget elementor-widget-n-accordion"
      data-id="062102f"
      data-element_type="widget"
      data-settings='{"_animation":"opal-move-up","default_state":"expanded","max_items_expended":"one","n_accordion_animation_duration":{"unit":"ms","size":400,"sizes":[]}}'
      data-widget_type="nested-accordion.default"
    >
      <div className="elementor-widget-container">
        <div
          className="e-n-accordion"
          aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys"
        >
          {faqs.map((faq, index) => (
            <details
              key={faq.id}
              id={faq.id}
              className="e-n-accordion-item"
              open={index === 0}
            >
              <summary
                className="e-n-accordion-item-title"
                data-accordion-index={faq.index}
                tabIndex={index === 0 ? 0 : -1}
                aria-expanded={index === 0 ? 'true' : 'false'}
                aria-controls={faq.id}
              >
                <span className="e-n-accordion-item-title-header">
                  <h6 className="e-n-accordion-item-title-text">{faq.question}</h6>
                </span>
                <span className="e-n-accordion-item-title-icon">
                  <span className="e-opened">
                    <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-chevron-up" />
                  </span>
                  <span className="e-closed">
                    <i aria-hidden="true" className="spaciaz-icon- spaciaz-icon-chevron-down" />
                  </span>
                </span>
              </summary>
              <div
                role="region"
                aria-labelledby={faq.id}
                className="elementor-element elementor-element-8af5d05 e-con-full e-flex e-con e-child"
                data-id="8af5d05"
                data-element_type="container"
              >
                <div
                  className="elementor-element elementor-element-bd48e85 elementor-widget__width-initial elementor-widget elementor-widget-text-editor"
                  data-id="bd48e85"
                  data-element_type="widget"
                  data-widget_type="text-editor.default"
                >
                  <div className="elementor-widget-container">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

