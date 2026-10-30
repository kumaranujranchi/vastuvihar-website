import '@/styles/globals.css';
import { site } from '@/data/site';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vastuvihar.org'),
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: 'Discover our projects, people, values, and opportunities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="theme-spaciaz elementor-default elementor-kit-4">{children}</body>
    </html>
  );
}
