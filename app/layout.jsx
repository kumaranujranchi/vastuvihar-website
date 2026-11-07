import '@/styles/globals.css';
import Script from 'next/script';
import { site } from '@/data/site';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import NavigationShell from '@/components/NavigationShell/NavigationShell';
import TrackingTags from '@/components/privacy/TrackingTags';
import MetaCtaTracker from '@/components/privacy/MetaCtaTracker';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/metadata';


const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: site.name,
      legalName: 'Technoculture Building Centre Pvt. Ltd.',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}${site.logo}`,
      foundingDate: '1994',
      email: site.email,
      telephone: site.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Old Jakkanpur, Lodipur',
        addressLocality: 'Patna',
        addressRegion: 'Bihar',
        postalCode: '800001',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://www.facebook.com/vastu-vihar',
        'https://www.instagram.com/vastuvihar_official',
        'https://www.youtube.com/@vastu_vihar',
        'https://in.linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: site.name,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: 'Discover our projects, people, values, and opportunities.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="theme-spaciaz elementor-default elementor-kit-4">
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4516919088573710');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=4516919088573710&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              if (window.location.pathname && window.location.pathname.startsWith('/admin')) return;
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "z9slby3c2m");
          `}
        </Script>
        <JsonLd data={siteJsonLd} />
        <NavigationShell
          cookieConsent={<CookieConsent />}
        >
          {children}
        </NavigationShell>
        <TrackingTags />
        <MetaCtaTracker />
      </body>
    </html>
  );
}
