import './Header.css';
import Link from 'next/link';
import Navigation from './Navigation';
import { site } from '@/data/site';

/** The rounded, translucent header from the fifth homepage, shared by every page. */
export default function Header() {
  return (
    <header id="masthead" className="site-header-home" itemScope itemType="https://schema.org/WPHeader">
      <div className="elementor elementor-420 header-absolute">
        <div className="elementor-element elementor-element-cc178a3 e-flex e-con-boxed e-con e-parent">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-2e0de30 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-119b2fe elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-436cecf elementor-widget elementor-widget-spaciaz-menu-canvas">
                  <div className="elementor-widget-container">
                    <div className="elementor-canvas-menu-wrapper">
                      <button type="button" className="menu-mobile-nav-button" aria-label="Open navigation" aria-controls="site-mobile-navigation" aria-expanded="false">
                        <span className="spaciaz-icon"><i className="spaciaz-icon-bars" aria-hidden="true" /></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-1888629 e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-090dbea elementor-widget elementor-widget-site-logo">
                  <div className="elementor-widget-container">
                    <div className="hfe-site-logo">
                      <Link className="elementor-clickable" href="/" aria-label={`${site.name} home`} prefetch={false}>
                        <div className="hfe-site-logo-set"><div className="hfe-site-logo-container">
                          <img className="hfe-site-logo-img" src={site.logoLight} alt={site.name} width="174" height="40" />
                        </div></div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="elementor-element elementor-element-5d5b8a9 elementor-hidden-tablet elementor-hidden-mobile_extra elementor-hidden-mobile elementor-widget elementor-widget-spaciaz-nav-menu">
                  <div className="elementor-widget-container"><div className="elementor-nav-menu-wrapper"><Navigation /></div></div>
                </div>
              </div>
              <div className="elementor-element elementor-element-5173ec0 elementor-hidden-mobile e-con-full e-flex e-con e-child">
                <div className="elementor-element elementor-element-e370c20 elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile_extra elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container"><span className="elementor-heading-title elementor-size-default">Call us:</span></div>
                </div>
                <div className="elementor-element elementor-element-6094767 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                  <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                    <a href={site.phoneHref} className="elementor-button-link elementor-button elementor-size-sm">
                      <span className="elementor-button-content-wrapper"><span className="elementor-button-text" data-name={site.phone}><span>{site.phone}</span></span></span>
                    </a>
                  </div></div>
                </div>
                <div className="elementor-element elementor-element-edf6e12 elementor-widget elementor-widget-button">
                  <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                    <Link className="elementor-button elementor-button-link elementor-size-sm" href="/contact/" prefetch={false}>
                      <span className="elementor-button-content-wrapper"><span className="elementor-button-text">get in touch</span></span>
                    </Link>
                  </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}