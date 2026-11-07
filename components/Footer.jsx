import './layout/Footer.css';
import Link from 'next/link';
import { footerGroups } from '@/data/navigation';
import { site } from '@/data/site';
import CookieSettingsButton from '@/components/CookieConsent/CookieSettingsButton';

const ADDRESS = '417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Patna, Bihar 800001';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/VastuViharOfficial/',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/vastuvihar_official',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@vastu_vihar',
    icon: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://in.linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Your Data Rights', href: '/privacy-rights/' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions/' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="vv-footer">
      <div className="vv-footer-container">
        {/* Brand statement */}
        <div className="vv-footer-statement">
          <div>
            <span className="vv-footer-pill">Since 1994</span>
            <p className="vv-footer-motto">
              Shelter <span>for All.</span>
            </p>
          </div>
          <Link href="/contact/" prefetch={false} className="vv-footer-cta-button">
            Get in touch
            <svg {...iconProps} width={20} height={20}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Main grid */}
        <div className="vv-footer-main">
          <div className="vv-footer-brand">
            <Link href="/" prefetch={false} aria-label={`${site.name} home`} className="vv-footer-logo">
              <img src={site.logo} alt={site.name} width="1105" height="612" loading="lazy" />
            </Link>
            <p className="vv-footer-about">
              {site.tagline}. Building quality, affordable homes across Eastern India since 1994.
            </p>
            <div className="vv-footer-social">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="vv-footer-social-btn"
                >
                  <svg {...iconProps}>{social.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          <nav className="vv-footer-nav" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title} className="vv-footer-col">
                <h3 className="vv-footer-heading">{group.title}</h3>
                <ul className="vv-footer-links">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} prefetch={false}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="vv-footer-col vv-footer-contact">
            <h3 className="vv-footer-heading">Contact</h3>
            <ul className="vv-footer-contact-list">
              <li>
                <span className="vv-footer-contact-icon">
                  <svg {...iconProps}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <span className="vv-footer-contact-icon">
                  <svg {...iconProps}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span className="vv-footer-contact-icon">
                  <svg {...iconProps}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <address>{ADDRESS}</address>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="vv-footer-bottom">
          <p className="vv-footer-copy">
            © {currentYear}{' '}
            <Link href="/" prefetch={false}>
              {site.name}
            </Link>
            . All Rights Reserved.
          </p>
          <ul className="vv-footer-legal">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={false}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
