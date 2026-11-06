
'use client';

import './layout/Header.css';
import './layout/HeaderScroll.css';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import { site } from '@/data/site';

const SCROLL_START = 110;
const SCROLL_TOLERANCE = 18;
const ANIMATION_DURATION = 700;

const FULL = 'inset(0px 0px 0px 0%)';
const HIDDEN = 'inset(0px 0px 0px 100%)';

export default function Header() {
  const [compact, setCompact] = useState(false);

  const originalHeaderRef = useRef(null);
  const compactRef = useRef(false);
  const animationRef = useRef(null);

  const changeHeader = useCallback((nextCompact, instant = false) => {
    if (compactRef.current === nextCompact) return;

    const element = originalHeaderRef.current;
    if (!element) return;

    const running = animationRef.current;

    let from = running
      ? window.getComputedStyle(element).clipPath
      : compactRef.current
        ? HIDDEN
        : FULL;

    if (!from || from === 'none') from = FULL;

    if (running) {
      running.onfinish = null;
      running.cancel();
      animationRef.current = null;
    }

    compactRef.current = nextCompact;
    setCompact(nextCompact);

    const to = nextCompact ? HIDDEN : FULL;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (instant || reduceMotion || !element.animate) {
      if (nextCompact) {
        element.style.clipPath = HIDDEN;
      } else {
        element.style.removeProperty('clip-path');
      }
      return;
    }

    element.style.clipPath = from;

    const animation = element.animate(
      [
        { clipPath: from },
        { clipPath: to },
      ],
      {
        duration: ANIMATION_DURATION,
        easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
        fill: 'forwards',
      }
    );

    animationRef.current = animation;

    animation.onfinish = () => {
      if (animationRef.current !== animation) return;

      if (nextCompact) {
        element.style.clipPath = HIDDEN;
      } else {
        element.style.removeProperty('clip-path');
      }

      animationRef.current = null;
      animation.cancel();
    };
  }, []);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let previousDirection = 0;
    let distance = 0;
    let frame = 0;

    if (previousY > SCROLL_START) {
      changeHeader(true, true);
    }

    const update = () => {
      frame = 0;

      const y = Math.max(0, window.scrollY);
      const delta = y - previousY;

      previousY = y;

      if (y <= SCROLL_START) {
        previousDirection = 0;
        distance = 0;
        changeHeader(false);
        return;
      }

      if (Math.abs(delta) < 1) return;

      const direction = delta > 0 ? 1 : -1;

      if (direction !== previousDirection) {
        previousDirection = direction;
        distance = 0;
      }

      distance += Math.abs(delta);

      if (distance >= SCROLL_TOLERANCE) {
        changeHeader(direction === 1);
        distance = 0;
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);

      if (frame) cancelAnimationFrame(frame);

      if (animationRef.current) {
        animationRef.current.onfinish = null;
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [changeHeader]);

  // Floating hamburger:
  // Desktop -> expand original header.
  // Mobile/tablet -> expand original header + open mobile menu.
  const handleFloatingHamburgerClick = () => {
    const mobile = window.matchMedia(
      '(max-width: 1100px)'
    ).matches;

    changeHeader(false);

    if (mobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          originalHeaderRef.current
            ?.querySelector('.menu-mobile-nav-button')
            ?.click();
        });
      });
    }
  };

  return (
    <header
      id="masthead"
      className={`site-header-home vv-scroll-header ${
        compact ? 'vv-scroll-compact' : ''
      }`}
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      <div className="elementor elementor-420 header-absolute">
        <div className="elementor-element elementor-element-cc178a3 e-flex e-con-boxed e-con e-parent">
          <div className="e-con-inner vv-scroll-anchor">

            {/* Original header layout */}
            <div
              ref={originalHeaderRef}
              id="vv-original-header"
              className="elementor-element elementor-element-2e0de30 e-con-full e-flex e-con e-child vv-scroll-original"
              aria-hidden={compact}
              inert={compact}
            >

              {/* Original mobile menu button */}
              <div className="elementor-element elementor-element-119b2fe elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-436cecf elementor-widget elementor-widget-spaciaz-menu-canvas">
                  <div className="elementor-widget-container">
                    <div className="elementor-canvas-menu-wrapper">
                      <button
                        type="button"
                        className="menu-mobile-nav-button"
                        aria-label="Open navigation"
                        aria-controls="site-mobile-navigation"
                        aria-expanded="false"
                      >
                        <span className="spaciaz-icon">
                          <i
                            className="spaciaz-icon-bars"
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original logo and navigation */}
              <div className="elementor-element elementor-element-1888629 e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-090dbea elementor-widget elementor-widget-site-logo">
                  <div className="elementor-widget-container">
                    <div className="hfe-site-logo">
                      <Link
                        className="elementor-clickable"
                        href="/"
                        aria-label={`${site.name} home`}
                        prefetch={false}
                      >
                        <div className="hfe-site-logo-set">
                          <div className="hfe-site-logo-container">
                            <img
                              className="hfe-site-logo-img"
                              src={site.logoLight}
                              alt={site.name}
                              width="174"
                              height="40"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="elementor-element elementor-element-5d5b8a9 elementor-hidden-tablet elementor-hidden-mobile_extra elementor-hidden-mobile elementor-widget elementor-widget-spaciaz-nav-menu">
                  <div className="elementor-widget-container">
                    <div className="elementor-nav-menu-wrapper">
                      <Navigation />
                    </div>
                  </div>
                </div>
              </div>

              {/* Original contact and CTA */}
              <div className="elementor-element elementor-element-5173ec0 elementor-hidden-mobile e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-e370c20 elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile_extra elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <span className="elementor-heading-title elementor-size-default">
                      Call us:
                    </span>
                  </div>
                </div>

                <div className="elementor-element elementor-element-6094767 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                  <div className="elementor-widget-container">
                    <div className="elementor-button-wrapper">
                      <a
                        href={site.phoneHref}
                        className="elementor-button-link elementor-button elementor-size-sm"
                      >
                        <span className="elementor-button-content-wrapper">
                          <span
                            className="elementor-button-text"
                            data-name={site.phone}
                          >
                            <span>{site.phone}</span>
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="elementor-element elementor-element-edf6e12 elementor-widget elementor-widget-button">
                  <div className="elementor-widget-container">
                    <div className="elementor-button-wrapper">
                      <Link
                        className="elementor-button elementor-button-link elementor-size-sm"
                        href="/contact/"
                        prefetch={false}
                      >
                        <span className="elementor-button-content-wrapper">
                          <span className="elementor-button-text">
                            get in touch
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New floating hamburger add-on */}
            <button
              type="button"
              className="vv-scroll-fab"
              onClick={handleFloatingHamburgerClick}
              aria-label="Expand header and open navigation"
              aria-controls="vv-original-header"
              aria-expanded={!compact}
              aria-hidden={!compact}
              tabIndex={compact ? 0 : -1}
            >
              <span
                className="vv-scroll-fab-lines"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
