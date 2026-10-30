import './SiteLayout.css';
import Header from './Header';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';

/** One consistent layout for the homepage and every retained inner page. */
export default function SiteLayout({ children, isHome = false }) {
  return (
    <>
      <a className="site-skip-link" href="#main">Skip to content</a>
      <div id="page" className="hfeed site">
        <Header isHome={isHome} />
        {children}
        <Footer />
      </div>
      <MobileNavigation />
      <div className="spaciaz-overlay" aria-hidden="true" />
      <button type="button" className="scrollup" aria-label="Scroll to top"><i className="spaciaz-icon-arrow-up" aria-hidden="true" /></button>
    </>
  );
}
