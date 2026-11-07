'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ArrowUpRightIcon from './ArrowUpRightIcon';

type FramesAlbum = {
  slug: string;
  title: string;
  images: Array<{ id: string; src: string; alt: string }>;
};

type Shot = FramesAlbum['images'][number] & {
  folderName: string;
  folderSlug: string;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

const keepOrder = <T,>(items: T[]) => items;

/** Up to 3 photos from every album, mixed together. */
function pickShots(albums: FramesAlbum[], order: <T>(items: T[]) => T[]): Shot[] {
  return order(
    albums.flatMap((album) =>
      order(album.images)
        .slice(0, 3)
        .map((image) => ({
          ...image,
          folderName: album.title,
          folderSlug: album.slug,
        }))
    )
  );
}

/**
 * The gallery page is cached, so the server renders a fixed selection (which crawlers
 * and the first paint see), and each visit then reshuffles it in the browser.
 */
export default function FramesOfTrust({ albums }: { albums: FramesAlbum[] }) {
  const [shots, setShots] = useState(() => pickShots(albums, keepOrder));

  useEffect(() => {
    setShots(pickShots(albums, shuffle));
  }, [albums]);

  if (shots.length === 0) return null;

  return (
    <section
      className="vv-gallery-best-section"
      aria-labelledby="vv-frames-heading"
    >

      <div className="vv-gallery-best-header">
        <h2 id="vv-frames-heading">
          Frames of Trust
        </h2>
      </div>

      <div className="vv-gallery-best-grid">

        {shots.map((shot, index) => (
          <Link
            key={shot.id}
            href={`/gallery/${shot.folderSlug}`}
            className="vv-gallery-best-card"
            style={{
              animationDelay: `${Math.min(index, 12) * 65
                }ms`,
            }}
          >

            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
            />

            <div className="vv-gallery-best-overlay">

              <span className="vv-gallery-best-folder">
                {shot.folderName}
              </span>

              <span
                className="vv-gallery-best-arrow"
                aria-hidden="true"
              >
                <ArrowUpRightIcon />
              </span>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}
