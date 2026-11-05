
import './AboutLeadership.css';
import '../common/ScrollingTicker.css';
import Link from 'next/link';
import StaticPill from '../common/StaticPill';

const cards = [
  {
    number: '01.',
    cardClass: '2f48502',
    animation: 'opal-move-right',
    headingId: '750a5a8',
    textId: 'fe9dd2d',
    buttonId: '2843d54',
    spacerId: '4403892',
    arrowId: '285fb28',
    contentContainerId: 'e6bcb83',
    numberId: 'd2c9c89',
    title: 'What we do',
    text:
      'We offer bungalows, flats and thoughtfully planned townships with a focus on affordable, quality living for families across Eastern India.',
    buttonText: 'Our Projects',
    buttonHref: '/projects/',
    arrowHref: '/projects/',
    theme: 'dark',
    image: '/png/nano.png',
  },
  {
    number: '02.',
    cardClass: '318224b',
    animation: 'opal-move-up',
    headingId: '7a80bb9',
    textId: '6702428',
    buttonId: '10ec5e1',
    spacerId: 'd1072fe',
    arrowId: '2047598',
    contentContainerId: '595e4d0',
    numberId: 'eba95be',
    title: 'Our impact',
    text:
      'Our communities bring homes, parks, play areas and everyday conveniences together to support a better way of life.',
    buttonText: 'See Projects',
    buttonHref: '/projects/',
    arrowHref: '/projects/',
    theme: 'primary',
    image: '/png/rainbow.png',
  },
  {
    number: '03.',
    cardClass: '8a5070f',
    animation: 'opal-move-left',
    headingId: '80c2fe4',
    textId: '6bafc88',
    buttonId: '66f0891',
    spacerId: 'ad73de3',
    arrowId: '45827df',
    contentContainerId: 'ae1db45',
    numberId: '09eae54',
    title: 'Core values',
    text:
      'We value trust, transparent communication, quality engineering and accessible housing that makes long-term homeownership possible.',
    buttonText: 'Discover more',
    buttonHref: '/core-values/',
    arrowHref: '/core-values/',
    theme: 'dark',
    image: '/png/ganga.png',
  },
];

function ArrowButton({ id, href }) {
  return (
    <div
      className={`elementor-element elementor-element-${id} elementor-button-default enable-style-icon-yes elementor-absolute icon-spaciaz-right elementor-widget elementor-widget-spaciaz-button`}
      data-id={id}
      data-element_type="widget"
      data-settings='{"_position":"absolute"}'
      data-widget_type="spaciaz-button.default"
    >
      <div className="elementor-widget-container">
        <div className="elementor-button-wrapper">
          <Link
            href={href}
            className="elementor-button-link elementor-button elementor-size-sm"
            prefetch={false}
            aria-label="Open section"
          >
            <span className="elementor-button-content-wrapper">
              <span className="elementor-button-icon">
                <span className="btn-icon-wrap">
                  <span className="btn-icon">
                    <i
                      aria-hidden="true"
                      className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                    />
                  </span>

                  <span className="btn-icon-hover">
                    <i
                      aria-hidden="true"
                      className="spaciaz-icon- spaciaz-icon-arrow-long-right"
                    />
                  </span>
                </span>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({ card }) {
  const numberId = card.numberId || 'd2c9c89';

  return (
    <div
      className={`elementor-element elementor-element-${card.cardClass} about-leadership-card e-con-full animated-fast e-flex elementor-invisible e-con e-child`}
      data-id={card.cardClass}
      data-element_type="container"
      data-settings={JSON.stringify({
        background_background: 'classic',
        animation: card.animation,
      })}
    >
      {/* CARD NUMBER */}
      <div
        className={`elementor-element elementor-element-${numberId} elementor-widget elementor-widget-heading`}
        data-id={numberId}
        data-element_type="widget"
        data-widget_type="heading.default"
      >
        <div className="elementor-widget-container">
          <h6 className="elementor-heading-title elementor-size-default">
            {card.number}
          </h6>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div
        className={`elementor-element elementor-element-${card.contentContainerId} e-con-full e-flex e-con e-child`}
        data-id={card.contentContainerId}
        data-element_type="container"
      >
        {/* HEADING */}
        <div
          className={`elementor-element elementor-element-${card.headingId} elementor-widget elementor-widget-heading`}
          data-id={card.headingId}
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h4 className="elementor-heading-title elementor-size-default">
              {card.title}
            </h4>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div
          className={`elementor-element elementor-element-${card.textId} elementor-widget elementor-widget-text-editor`}
          data-id={card.textId}
          data-element_type="widget"
          data-widget_type="text-editor.default"
        >
          <div className="elementor-widget-container">
            <p>{card.text}</p>
          </div>
        </div>

        {/* TEXT BUTTON */}
        <div
          className={`elementor-element elementor-element-${card.buttonId} elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button`}
          data-id={card.buttonId}
          data_element_type="widget"
          data-widget_type="spaciaz-button.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <Link
                href={card.buttonHref}
                className="elementor-button-link elementor-button elementor-size-sm"
                prefetch={false}
              >
                <span className="elementor-button-content-wrapper">
                  <span
                    className="elementor-button-text"
                    data-name={card.buttonText}
                  >
                    <span>{card.buttonText}</span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL BOTTOM PNG IMAGE */}
      {card.image && (
        <div
          className="about-card-decoration"
          aria-hidden="true"
        >
          <img
            src={card.image}
            alt=""
            width="351"
            height="272"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      {/* BOTTOM CORNER SPACER */}
      <div
        className={`elementor-element elementor-element-${card.spacerId} elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-spacer`}
        data-id={card.spacerId}
        data-element_type="widget"
        data-settings='{"_position":"absolute","spaciaz_decor_top_right":"yes","spaciaz_decor_bottom_left":"yes"}'
        data-widget_type="spacer.default"
      >
        <div className="elementor-widget-container">
          <div className="elementor-spacer">
            <div className="elementor-spacer-inner" />
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT ARROW */}
      <ArrowButton
        id={card.arrowId}
        href={card.arrowHref}
      />
    </div>
  );
}

export default function AboutLeadership() {
  return (
    <div
      className="elementor-element elementor-element-6d74395 e-flex e-con-boxed e-con e-parent"
      data-id="6d74395"
      data-element_type="container"
    >
      <div className="e-con-inner">

        <StaticPill text="Explore Company" />

        {/* SECTION HEADING */}
        <div
          className="elementor-element elementor-element-5a7e392 elementor-widget__width-initial elementor-widget-mobile__width-inherit animated-fast elementor-invisible elementor-widget elementor-widget-heading"
          data-id="5a7e392"
          data-element_type="widget"
          data-settings='{"_animation":"opal-move-up"}'
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">
              Discover <br /> Vastu Vihar
            </h2>
          </div>
        </div>

        {/* THREE CARDS */}
        <div
          className="elementor-element elementor-element-b70fc5d e-grid e-con-full e-con e-child"
          data-id="b70fc5d"
          data-element_type="container"
        >
          {cards.map((card) => (
            <Card
              key={card.number}
              card={card}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
