import '../home/StatsSection.css';
import './ValueCard.css';

export default function ValueCard({ value, index }) {
  const animationDelay = index > 0 ? (index % 4) * 100 : undefined;

  const settings = {
    animation: 'opal-move-up',
    ...(animationDelay ? { animation_delay: animationDelay } : {}),
  };

  return (
    <div
      className={`value-card grid-item elementor-iconbox-item elementor-element elementor-element-${value.id} animated-fast elementor-invisible`}
      data-id={value.id}
      data-element_type="container"
      data-settings={JSON.stringify(settings)}
      data-count={String(index + 1).padStart(2, '0')}
    >
      <div className="iconbox-wrapper">
        <div
          className="iconbox-icon"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: value.svg }}
        />
        <div className="iconbox-content">
          <div className="decor_border"> </div>
          <h5 className="iconbox-title">{value.title}</h5>
          <div className="iconbox-desc">
            <p>{value.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
