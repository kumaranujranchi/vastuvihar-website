import { SITE_URL } from '@/lib/metadata';

/** Renders structured data. `<` is escaped so a stored value cannot close the script tag. */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
    />
  );
}

/**
 * @param {{ items: Array<{ name: string, path?: string }> }} props
 * Crumbs after Home, in order. Leave `path` off the current page, as Google allows.
 */
export function BreadcrumbJsonLd({ items }) {
  const crumbs = [{ name: 'Home', path: '/' }, ...items];
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map(({ name, path }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          ...(path ? { item: `${SITE_URL}${path}` } : {}),
        })),
      }}
    />
  );
}
