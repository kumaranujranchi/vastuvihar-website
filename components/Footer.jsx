import './layout/Footer.css';
import Link from 'next/link';
import { footerGroups } from '@/data/navigation';
import { site } from '@/data/site';
import CookieSettingsButton from '@/components/CookieConsent/CookieSettingsButton';
import NewsletterSignup from '@/components/privacy/NewsletterSignup';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="premium-footer">
      <div className="premium-footer-overlay"></div>
      
      <div className="premium-footer-container">
        
        {/* Top Section: Contact & Socials */}
        <div className="footer-top-section">
          <div className="footer-contact-block">
            <h3 className="footer-contact-label">Get In Touch</h3>
            <a href={site.phoneHref} className="footer-contact-link">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="footer-contact-link">{site.email}</a>
            
            <div className="footer-social-row">
              <a href="https://www.facebook.com/vastu-vihar" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.instagram.com/vastuvihar_official" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://www.youtube.com/@vastu_vihar" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              </a>
              <a href="https://in.linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="footer-nav-grid">
            {footerGroups.map((group) => (
              <div key={group.title} className="footer-nav-column">
                <h4 className="footer-nav-title">{group.title}</h4>
                <ul className="footer-nav-list">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} prefetch={false}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <NewsletterSignup />

        {/* Bottom Section: Copyright & Legal */}
        <div className="footer-bottom-section">
          <div className="footer-copyright">
            © {currentYear} <Link href="/" prefetch={false}>{site.name}</Link>. All Rights Reserved.
          </div>
          <div className="footer-legal-links">
            <Link href="/privacy-policy" prefetch={false}>Privacy Policy</Link>
            <span className="footer-divider"></span>
            <Link href="/privacy-rights" prefetch={false}>Your Data Rights</Link>
            <span className="footer-divider"></span>
            <Link href="/terms-and-conditions" prefetch={false}>Terms & Conditions</Link>
            <span className="footer-divider"></span>
            <CookieSettingsButton />
          </div>
        </div>
        
      </div>
    </footer>
  );
}