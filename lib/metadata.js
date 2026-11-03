import { site } from '@/data/site';

/** Public origin of the site, without a trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vastuvihar.org').replace(/\/+$/, '');

// Sized 1200x630, so it is the only image whose dimensions can be declared up front.
const DEFAULT_SHARE_IMAGE = '/images/og-default.jpg';

/**
 * Standardized metadata generator for Next.js App Router pages.
 * Ensures uniform page titles, descriptions, OpenGraph, Twitter cards, and canonical links.
 *
 * @param {Object} params
 * @param {string} params.title - Page title
 * @param {string} [params.description] - Meta description
 * @param {string} [params.path] - Canonical route path (e.g. '/about-us/')
 * @param {string} [params.image] - OpenGraph preview image URL
 * @param {'website' | 'article'} [params.type] - OpenGraph object type
 * @returns {import('next').Metadata}
 */
export function createPageMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_SHARE_IMAGE,
  type = 'website',
}) {
  const formattedTitle = title.includes(site.name)
    ? title
    : `${title} | ${site.name}`;

  const metaDescription =
    description || `${site.name} — ${site.tagline}. Leading real estate and construction group across Eastern India.`;

  const metadata = {
    // Absolute, because the title already has the brand and the root layout's template would add it again.
    title: { absolute: formattedTitle },
    description: metaDescription,
    openGraph: {
      title: formattedTitle,
      description: metaDescription,
      siteName: site.name,
      ...(path ? { url: path } : {}),
      images: [
        {
          url: image,
          ...(image === DEFAULT_SHARE_IMAGE ? { width: 1200, height: 630 } : {}),
          alt: formattedTitle,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description: metaDescription,
      images: [image],
    },
  };

  if (path) {
    metadata.alternates = {
      canonical: path,
    };
  }

  return metadata;
}

export default createPageMetadata;

