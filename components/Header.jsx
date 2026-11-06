
'use client';

import './layout/Header.css';
import './layout/HeaderScroll.css';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import { site } from '@/data/site';

const TOP_TOLERANCE = 2;
const SCROLL_START = 110;
const SCROLL_TOLERANCE = 18;
const ANIMATION_DURATION = 700;

const FULL = 'inset(0px 0px 0px 0%)';
const HIDDEN = 'inset(0px 0px 0px 100%)';

/**
 * Original Vastu Vihar header with animated
 * scroll collapse and expansion.
 *
 * Original layout and elements remain unchanged.
 */
export default function Header() {
  const [compact, setCompact] = useState(false);
  const [isAwayFromTop, setIsAwayFromTop] = useState(false);

  const originalHeaderRef = useRef(null);
  const compactRef = useRef(false);
  const animationRef = useRef(null);

  /* ====================================================
     EXPAND / COLLAPSE ORIGINAL HEADER
     ==================================================== */

  const changeHeader = useCallback((nextCompact, instant = false) => {
    if (compactRef.current === nextCompact) return;

    const element = originalHeaderRef.current;
    if (!element) return;

    const runningAnimation = animationRef.current;

    let from = runningAnimation
      ? window.getComputedStyle(element).clipPath
      : compactRef.current
        ? HIDDEN
        : FULL;

    if (!from || from === 'none') {
      from = FULL;
    }

    // Cancel an unfinished transition before reversing.
    if (runningAnimation) {
      runningAnimation.onfinish = null;
      runningAnimation.cancel();
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

    // Animate only visibility.
    // Never change original width, height or flex layout.
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
        // Restore original styling and dropdown behavior.
        element.style.removeProperty('clip-path');
      }

      animationRef.current = null;
      animation.cancel();
    };
  }, []);

  /* ====================================================
     SCROLL BEHAVIOR
     ==================================================== */

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let downwardDistance = 0;
    let frame = 0;

    // Set correct background on initial page load.
    setIsAwayFromTop(previousY > TOP_TOLERANCE);

    // Restore compact header when loading a scrolled page.
    if (previousY > SCROLL_START) {
      changeHeader(true, true);
    }

    const update = () => {
      frame = 0;

      const y = Math.max(0, window.scrollY);
      const delta = y - previousY;

      previousY = y;

      // IMPORTANT:
      // Away from top -> #00000057
      // At top -> original Header.css background
      setIsAwayFromTop(y > TOP_TOLERANCE);

      // At the very top, expand automatically.
      if (y <= TOP_TOLERANCE) {
        downwardDistance = 0;
        changeHeader(false);
        return;
      }

      // Do not expand automatically when scrolling up.
      if (y <= SCROLL_START || delta <= 0) {
        downwardDistance = 0;
        return;
      }

      // Collapse when scrolling down sufficiently.
      downwardDistance += delta;

      if (downwardDistance >= SCROLL_TOLERANCE) {
        downwardDistance = 0;
        changeHeader(true);
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

      if (frame) {
        cancelAnimationFrame(frame);
      }

      if (animationRef.current) {
        animationRef.current.onfinish = null;
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [changeHeader]);

  /* ====================================================
     FLOATING HAMBURGER CLICK
     ==================================================== */

  const handleFloatingHamburgerClick = () => {
    const isMobile = window.matchMedia(
      '(max-width: 1100px)'
    ).matches;

    // FIX: Update background state even without scrolling.
    // React preserves this class during the header expansion.
    setIsAwayFromTop(window.scrollY > TOP_TOLERANCE);

    // Expand the ORIGINAL header.
    changeHeader(false);

    // Mobile/tablet:
    // Also activate the existing mobile navigation.
    if (isMobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          originalHeaderRef.current
            ?.querySelector('.menu-mobile-nav-button')
            ?.click();
        });
      });
    }
  };

  /* ====================================================
     ORIGINAL HEADER JSX
     ==================================================== */

  return (
    <header
      id="masthead"
      className={[
        'site-header-home',
        'vv-scroll-header',
        compact ? 'vv-scroll-compact' : '',
        isAwayFromTop ? 'vv-scroll-away' : '',
      ].filter(Boolean).join(' ')}
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      <div className="elementor elementor-420 header-absolute">
        <div className="elementor-element elementor-element-cc178a3 e-flex e-con-boxed e-con e-parent">
          <div className="e-con-inner vv-scroll-anchor">

            {/* ORIGINAL HEADER */}
            <div
              ref={originalHeaderRef}
              id="vv-original-header"
              className="elementor-element elementor-element-2e0de30 e-con-full e-flex e-con e-child vv-scroll-original"
              aria-hidden={compact}
              inert={compact}
            >

              {/* Original mobile hamburger */}
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

              {/* ORIGINAL LOGO AND NAVIGATION */}
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

              {/* ORIGINAL CONTACT SECTION */}
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

            {/* FLOATING HAMBURGER ADD-ON */}
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
