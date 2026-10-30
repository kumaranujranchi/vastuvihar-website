import './MobileNavigation.css';
import Link from 'next/link';
import Navigation from './Navigation';
import { site } from '@/data/site';

export default function MobileNavigation() {
  return (
    <div id="site-mobile-navigation" className="spaciaz-mobile-nav" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden="true" inert tabIndex={-1}>
      <div className="menu-scroll-mobile">
        <div className="site-branding">
          <Link href="/" className="custom-logo-link" aria-label={`${site.name} home`} prefetch={false}>
            <img width="174" height="40" src={site.logo} className="custom-logo" alt={site.name} decoding="async" />
          </Link>
        </div>
        <button type="button" className="mobile-nav-close" aria-label="Close navigation"><i className="spaciaz-icon-times" aria-hidden="true" /></button>
        <Navigation mobile />
      </div>
    </div>
  );
}
