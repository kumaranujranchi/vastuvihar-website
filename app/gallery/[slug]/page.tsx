
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/metadata';
import { GALLERY_ALBUM_SLUGS, getGalleryAlbumBySlug } from '@/lib/gallery';
import GalleryLightbox from '../GalleryLightbox';

import './GallerySlug.css';
import Cta from '../Cta';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Cached, and refreshed when an admin changes the photos (lib/revalidate.ts), or hourly.
export const revalidate = 3600;

// Only the configured albums have a page; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return GALLERY_ALBUM_SLUGS.map((slug) => ({ slug }));
}

function BackArrowIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);

  if (!album) {
    return {
      title: 'Gallery',
    };
  }

  return createPageMetadata({
    title: `${album.title} | Vastu Vihar`,
    description: `Explore photos from ${album.title} at Vastu Vihar.`,
    path: `/gallery/${slug}/`,
  });
}

export default async function GallerySlugPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const album = await getGalleryAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  return (
    <main className="vv-gallery-album-page">
      <BreadcrumbJsonLd items={[{ name: 'Gallery', path: '/gallery/' }, { name: album.title }]} />

      {/* GLASSMORPHISM HEADER */}
      <header className="vv-gallery-glass-header">

        {/* LEFT - BACK BUTTON */}
        <Link
          href="/gallery"
          className="vv-gallery-back-button"
          aria-label="Back to Gallery"
          title="Back to Gallery"
        >
          <BackArrowIcon />
        </Link>

        {/* RIGHT - ALBUM NAME */}
        <div className="vv-gallery-header-info">
          <h1 className="vv-gallery-folder-title">
            {album.title}
          </h1>
        </div>

      </header>

      {/* PHOTO BENTO GRID */}
      <section
        className="vv-gallery-album-content"
        aria-label={`${album.title} photos`}
      >
        {album.images.length > 0 ? (
          <GalleryLightbox
            images={album.images}
            albumTitle={album.title}
          />
        ) : (
          <div className="vv-gallery-album-empty">
            No photos available in this album.
          </div>
        )}
      </section>
      
    </main>
  );
}
