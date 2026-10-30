import { site } from '@/data/site';

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
  image = '/images/vastu-logo.webp',
  type = 'website',
}) {
  const formattedTitle = title.includes(site.name)
    ? title
    : `${title} | ${site.name}`;

  const metaDescription =
    description || `${site.name} — ${site.tagline}. Leading real estate and construction group across Eastern India.`;

  const metadata = {
    title: formattedTitle,
    description: metaDescription,
    openGraph: {
      title: formattedTitle,
      description: metaDescription,
      siteName: site.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
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

