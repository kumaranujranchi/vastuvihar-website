
import Link from 'next/link';

import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { createPageMetadata } from '@/lib/metadata';
import { getGalleryAlbums } from '@/lib/gallery';
import ArrowUpRightIcon from './ArrowUpRightIcon';
import Cta from './Cta';
import FramesOfTrust from './FramesOfTrust';

import heroStyles from './hero.module.css';
import './GalleryPage.css';

export const metadata = createPageMetadata({
  title: 'Gallery | Vastu Vihar',
  description:
    'Explore Vastu Vihar events, projects, expos and memorable moments.',
  path: '/gallery/',
});

// Cached, and refreshed when an admin changes the photos (lib/revalidate.ts), or hourly.
export const revalidate = 3600;

/* =========================================
   TYPES
========================================= */

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

type GalleryAlbum = {
  slug: string;
  title: string;
  count: number;
  images: GalleryImage[];
};

type BentoTile = GalleryAlbum & {
  cols: number;
  rows: number;
  order: number;
};

/* =========================================
   DYNAMIC BENTO LAYOUTS
========================================= */

const BENTO_LAYOUTS: Record<number, [number, number][]> = {
  1: [
    [12, 2],
  ],

  2: [
    [8, 2],
    [4, 2],
  ],

  3: [
    [6, 2],
    [3, 2],
    [3, 2],
  ],

  4: [
    [6, 2],
    [3, 1],
    [3, 2],
    [3, 1],
  ],

  5: [
    [6, 2],
    [3, 1],
    [3, 1],
    [3, 1],
    [3, 1],
  ],
};

/*
 * Creates balanced groups automatically.
 * Supports any number of gallery folders.
 */
function createBentoGroups(
  albums: GalleryAlbum[]
): BentoTile[][] {
  if (albums.length === 0) return [];

  const groupCount = Math.ceil(albums.length / 5);

  const baseSize = Math.floor(
    albums.length / groupCount
  );

  const remainder = albums.length % groupCount;

  let offset = 0;

  return Array.from(
    { length: groupCount },
    (_, groupIndex) => {
      const size =
        baseSize + (groupIndex < remainder ? 1 : 0);

      const layout = BENTO_LAYOUTS[size];

      const group = albums
        .slice(offset, offset + size)
        .map((album, index) => ({
          ...album,
          cols: layout[index][0],
          rows: layout[index][1],
          order: offset + index,
        }));

      offset += size;

      return group;
    }
  );
}

/* =========================================
   MAIN PAGE
========================================= */

export default async function GalleryMainPage() {
  const albums =
    (await getGalleryAlbums()) as GalleryAlbum[];

  const categories = albums.filter(
    (album) => album.count > 0
  );

  const bentoGroups = createBentoGroups(categories);

  // Only what Frames of Trust needs, which picks random photos from every folder.
  const framesAlbums = categories.map(({ slug, title, images }) => ({
    slug,
    title,
    images: images.map(({ id, src, alt }) => ({ id, src, alt })),
  }));

  return (
    <PageLayout route="gallery">

      {/* =================================
          EXISTING HERO
      ================================= */}

      <section className={heroStyles.hero}>
        <div className={heroStyles.heroInner}>
          {/* <h1>Gallery</h1> */}

          <div className={heroStyles.heroBottom}>
            <nav
              className={heroStyles.breadcrumbs}
              aria-label="Breadcrumb"
            >
              <Link href="/">Home</Link>

              <span aria-hidden="true" />

              <strong>Gallery</strong>
            </nav>
          </div>
        </div>

        <div className={heroStyles.heroCurve} />
      </section>

      {/* =================================
          FULL WIDTH GALLERY
      ================================= */}

      <main
        id="main"
        className="vv-gallery-fullwidth"
      >

        <section
          className="vv-gallery-bento-section"
          aria-labelledby="vv-gallery-heading"
        >

          {/* SECTION INTRO */}
          <div className="vv-gallery-bento-intro">

            <div className="vv-gallery-intro-left">
              <h1
                id="vv-gallery-heading"
                className="vv-gallery-intro-title"
              >
                Our Gallery
              </h1>
            </div>

            <div className="vv-gallery-intro-right">
              <p className="vv-gallery-intro-description">
                Every frame tells a story of trust,
                togetherness, and the joy of coming home.
              </p>
            </div>

          </div>

          {/* DYNAMIC BENTO GRID */}
          {bentoGroups.length > 0 ? (
            <div className="vv-gallery-bento-groups">

              {bentoGroups.map((group, groupIndex) => (
                <div
                  className="vv-gallery-bento-grid"
                  key={`group-${groupIndex}`}
                >

                  {group.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/gallery/${category.slug}`}
                      className="vv-gallery-bento-card"
                      data-cols={category.cols}
                      data-rows={category.rows}
                      style={{
                        animationDelay: `${Math.min(category.order, 12) * 75
                          }ms`,
                      }}
                    >

                      {/* COVER IMAGE */}
                      <img
                        src={category.images[0].src}
                        alt={category.title}
                        loading={
                          category.order === 0
                            ? 'eager'
                            : 'lazy'
                        }
                      />

                      {/* DARK FADE OVERLAY */}
                      <div className="vv-gallery-bento-overlay">

                        <div className="vv-gallery-bento-content">

                          <h3>{category.title}</h3>

                          <div className="vv-gallery-bento-bottom">

                            <span className="vv-gallery-photo-count">
                              {category.count}{' '}
                              {category.count === 1
                                ? 'Photo'
                                : 'Photos'}
                            </span>

                            <span
                              className="vv-gallery-card-icon"
                              aria-hidden="true"
                            >
                              <ArrowUpRightIcon />
                            </span>

                          </div>

                        </div>

                      </div>

                    </Link>
                  ))}

                </div>
              ))}

            </div>
          ) : (
            <div className="vv-gallery-empty">
              <p>
                No gallery images available.
              </p>
            </div>
          )}

        </section>

        {/* =================================
            FRAMES OF TRUST
        ================================= */}

        <FramesOfTrust albums={framesAlbums} />

        <Cta />

      </main>

      <BreadcrumbJsonLd items={[{ name: 'Gallery' }]} />
    </PageLayout>
  );
}
