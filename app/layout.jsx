import '@/styles/globals.css';
import { site } from '@/data/site';
import CookieConsent from '@/components/CookieConsent/CookieConsent';
import NavigationShell from '@/components/NavigationShell/NavigationShell';


export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vastuvihar.org'),
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
        <NavigationShell
          cookieConsent={<CookieConsent />}
        >
          {children}
        </NavigationShell>
      </body>
    </html>
  );
}
