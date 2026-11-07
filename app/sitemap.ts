import type { MetadataRoute } from 'next';
import cities from '@/data/cities.json';
import { priceLists } from '@/data/priceLists';
import { projects } from '@/data/projects';
import { BLOG_CATEGORIES } from '@/lib/blogCategories';
import { getGalleryAlbums } from '@/lib/gallery';
import { SITE_URL } from '@/lib/metadata';
import { databaseFallback, prisma } from '@/lib/prisma';

// Cached, and refreshed when a blog post or the gallery changes (lib/revalidate.ts), or hourly.
export const revalidate = 3600;

// Left out on purpose: /admin, /careers/apply (a form), and the /our-team and /our-team/<slug>
// pages, which still hold theme placeholder content.
const STATIC_PATHS = [
  '/',
  '/about-us/',
  '/projects/',
  '/price-list/',
  '/gallery/',
  '/blog/',
  '/contact/',
  '/contact/branch-contact/',
  '/contact/site-contact/',
  '/careers/',
  '/core-values/',
  '/our-awards/',
  '/faqs/',
  '/privacy-policy/',
  '/privacy-rights/',
  '/terms-and-conditions/',
];

const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap[number] => ({
  url: `${SITE_URL}${path}`,
  ...(lastModified ? { lastModified } : {}),
});

async function getBlogEntries(): Promise<MetadataRoute.Sitemap> {
  // In production a database error is rethrown, so the cached sitemap keeps its last
  // good copy rather than one without the blog (see databaseFallback).
  const posts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      select: { slug: true, category: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })
    .catch(databaseFallback('Sitemap blog posts', []));

  // Posts are newest first, so the first match is the category's latest change.
  // Categories with no published posts are skipped, as their pages would be empty.
  const categories = Object.entries(BLOG_CATEGORIES).flatMap(([slug, name]) => {
    const latest = posts.find((post) => post.category === name);
    return latest ? [entry(`/category/${slug}/`, latest.updatedAt)] : [];
  });

  return [
    ...posts.map((post) => entry(`/blog/${encodeURIComponent(post.slug)}/`, post.updatedAt)),
    ...categories,
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [albums, blogEntries] = await Promise.all([getGalleryAlbums(), getBlogEntries()]);

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...projects.map(({ slug }) => entry(`/projects/${slug}/`)),
    ...priceLists.map(({ slug }) => entry(`/price-list/${slug}/`)),
    // Same keys as app/cities/[slug]'s generateStaticParams.
    ...Object.keys(cities).map((slug) => entry(`/cities/${slug}/`)),
    ...albums.filter((album) => album.count > 0).map(({ slug }) => entry(`/gallery/${slug}/`)),
    ...blogEntries,
  ];
}
