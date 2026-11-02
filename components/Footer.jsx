import './layout/Footer.css';
import Link from 'next/link';
import { footerGroups } from '@/data/navigation';
import { site } from '@/data/site';
import CookieSettingsButton from '@/components/CookieConsent/CookieSettingsButton';

const columnStyles = [
  { column: '45c259f', heading: '9db1883', list: '5dc3fa0' },
  { column: '2a905f5', heading: 'c13e78a', list: '5bbbbf6' },
  { column: 'f1a7136', heading: '2099099', list: 'b28f28c' },
];

function FooterLinkGroup({ group, index }) {
  const ids = columnStyles[index];
  return (
    <div className={`elementor-element elementor-element-${ids.column} e-con-full e-flex e-con e-child`}>
      <div className={`elementor-element elementor-element-${ids.heading} elementor-widget elementor-widget-text-editor`}>
        <div className="elementor-widget-container"><p>{group.title}</p></div>
      </div>
      <div className={`elementor-element elementor-element-${ids.list} icon-list-style-spaciaz-yes elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list`}>
        <div className="elementor-widget-container">
          <ul className="elementor-icon-list-items">
            {group.links.map((link) => (
              <li className="elementor-icon-list-item" key={link.href}>
                <Link href={link.href} prefetch={false}><span className="elementor-icon-list-text">{link.label}</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="colophon" itemType="https://schema.org/WPFooter" itemScope>
      <div className="footer-width-fixer">
        <div className="elementor elementor-6350">
          <div
            className="elementor-element elementor-element-2979ffc e-con-full e-flex e-con e-parent"
            style={{
              backgroundImage: "url('/images/footer-bg.jpg')",
              backgroundPosition: 'center 30%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="elementor-element elementor-element-e376b42 elementor-widget elementor-widget-spacer" aria-hidden="true">
              <div className="elementor-widget-container"><div className="elementor-spacer"><div className="elementor-spacer-inner" /></div></div>
            </div>
            <div className="elementor-element elementor-element-027b0dc e-flex e-con-boxed e-con e-child">
              <div className="e-con-inner">
                <div className="elementor-element elementor-element-068eec6 e-con-full e-flex e-con e-child">
                  <div className="elementor-element elementor-element-2c3c48c elementor-widget elementor-widget-text-editor">
                    <div className="elementor-widget-container"><p>get in touch</p></div>
                  </div>
                  <div className="elementor-element elementor-element-9a8fa13 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                    <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                      <a href={site.phoneHref} className="elementor-button-link elementor-button elementor-size-sm">
                        <span className="elementor-button-content-wrapper"><span className="elementor-button-text" data-name={site.phone}><span>{site.phone}</span></span></span>
                      </a>
                    </div></div>
                  </div>
                  <div className="elementor-element elementor-element-9041218 elementor-button-link line-effect-yes elementor-widget elementor-widget-spaciaz-button">
                    <div className="elementor-widget-container"><div className="elementor-button-wrapper">
                      <a href={`mailto:${site.email}`} className="elementor-button-link elementor-button elementor-size-sm">
                        <span className="elementor-button-content-wrapper"><span className="elementor-button-text" data-name={site.email}><span>{site.email}</span></span></span>
                      </a>
                    </div></div>
                  </div>

                  {/* ===== SOCIAL LINKS ADDED HERE ===== */}
                  <div className="footer-social-row">
                    <a
                      href="https://www.facebook.com/vastu-vihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon-btn"
                      aria-label="Facebook"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>

                    <a
                      href="https://www.instagram.com/vastuvihar_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon-btn"
                      aria-label="Instagram"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>

                    <a
                      href="https://www.youtube.com/@vastu_vihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon-btn"
                      aria-label="YouTube"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                      </svg>
                    </a>

                    <a
                      href="https://in.linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon-btn"
                      aria-label="LinkedIn"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                  {/* ================================= */}
                  
                </div>
                <div className="elementor-element elementor-element-5026e2f e-con-full e-flex e-con e-child">
                  <div className="elementor-element elementor-element-9b14813 e-con-full e-flex e-con e-child">
                    {footerGroups.map((group, index) => <FooterLinkGroup key={group.title} group={group} index={index} />)}
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-aa7f6d2 elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                <p>
                  © {new Date().getFullYear()} <Link href="/" prefetch={false}><b>{site.name}</b></Link>. All Rights Reserved.
                  {' | '}
                  <Link href="/privacy-policy" prefetch={false}>Privacy Policy</Link>
                  {' | '}
                  <Link href="/terms-and-conditions" prefetch={false}>Terms & Conditions</Link>
                  {' | '}
                  <CookieSettingsButton />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}