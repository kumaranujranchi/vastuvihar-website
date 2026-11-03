
'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createPortal } from 'react-dom';
import styles from './GalleryLightbox.module.css';

interface ImageProps {
  id: string | number;
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: ImageProps[];
  albumTitle?: string;
}

interface BentoTile extends ImageProps {
  cols: number;
  rows: number;
  index: number;
}

/* ========================================
   DYNAMIC BENTO LAYOUTS
======================================== */

const LAYOUTS: Record<number, [number, number][]> = {
  1: [[12, 2]],

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

function createImageGroups(
  images: ImageProps[]
): BentoTile[][] {
  if (!images.length) return [];

  const groupCount = Math.ceil(images.length / 5);
  const baseSize = Math.floor(images.length / groupCount);
  const remainder = images.length % groupCount;

  let offset = 0;

  return Array.from({ length: groupCount }, (_, groupIndex) => {
    const size = baseSize + (groupIndex < remainder ? 1 : 0);
    const layout = LAYOUTS[size];

    const group = images
      .slice(offset, offset + size)
      .map((image, index) => ({
        ...image,
        cols: layout[index][0],
        rows: layout[index][1],
        index: offset + index,
      }));

    offset += size;
    return group;
  });
}

/* ========================================
   SVG ICONS
======================================== */

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({
  direction,
}: {
  direction: 'left' | 'right';
}) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'left' ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}

/* ========================================
   COMPONENT
======================================== */

export default function GalleryLightbox({
  images,
  albumTitle = 'Gallery',
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] =
    useState<number | null>(null);

  const [mounted, setMounted] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs =
    useRef<Record<number, HTMLButtonElement | null>>({});

  const touchStartX = useRef<number | null>(null);

  const groups = useMemo(
    () => createImageGroups(images),
    [images]
  );

  const isOpen = currentIndex !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  /* OPEN IMAGE */
  const openLightbox = (
    index: number,
    element: HTMLButtonElement
  ) => {
    openerRef.current = element;
    setCurrentIndex(index);
  };

  /* CLOSE IMAGE */
  const closeLightbox = useCallback(() => {
    setCurrentIndex(null);

    requestAnimationFrame(() => {
      openerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  /* PREVIOUS */
  const showPrevious = useCallback(() => {
    setCurrentIndex((current) => {
      if (current === null || images.length === 0) {
        return null;
      }

      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  /* NEXT */
  const showNext = useCallback(() => {
    setCurrentIndex((current) => {
      if (current === null || images.length === 0) {
        return null;
      }

      return (current + 1) % images.length;
    });
  }, [images.length]);

  /* ========================================
     KEYBOARD NAVIGATION + SCROLL LOCK
  ======================================== */

  useEffect(() => {
    if (!isOpen) return;

    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      }

      if (event.key === 'Tab') {
        const buttons = Array.from(
          dialogRef.current?.querySelectorAll<HTMLButtonElement>(
            'button:not([disabled])'
          ) ?? []
        );

        if (!buttons.length) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [
    isOpen,
    closeLightbox,
    showPrevious,
    showNext,
  ]);

  /* ========================================
     AUTO SCROLL ACTIVE THUMBNAIL
  ======================================== */

  useEffect(() => {
    if (currentIndex === null) return;

    thumbnailRefs.current[currentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [currentIndex]);

  const activeImage =
    currentIndex === null ? null : images[currentIndex];

  /* ========================================
     LIGHTBOX PORTAL
  ======================================== */

  const lightbox =
    mounted && activeImage ? (
      <div
        ref={dialogRef}
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-label={`${albumTitle} image viewer`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeLightbox();
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current =
            event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;

          const endX =
            event.changedTouches[0]?.clientX;

          if (endX === undefined) return;

          const distance = endX - touchStartX.current;

          if (Math.abs(distance) > 65) {
            if (distance > 0) {
              showPrevious();
            } else {
              showNext();
            }
          }

          touchStartX.current = null;
        }}
      >
        {/* CLOSE - CIRCULAR SVG */}
        <button
          ref={closeButtonRef}
          type="button"
          className={`${styles.control} ${styles.close}`}
          onClick={closeLightbox}
          aria-label="Close gallery"
        >
          <CloseIcon />
        </button>

        {/* PREVIOUS - CIRCULAR SVG */}
        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.control} ${styles.previous}`}
            onClick={showPrevious}
            aria-label="Previous image"
          >
            <ChevronIcon direction="left" />
          </button>
        )}

        {/* MAIN FULLSCREEN IMAGE */}
        <div className={styles.stage}>
          <img
            key={activeImage.id}
            src={activeImage.src}
            alt={activeImage.alt}
            className={styles.fullImage}
            draggable={false}
          />
        </div>

        {/* NEXT - CIRCULAR SVG */}
        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            onClick={showNext}
            aria-label="Next image"
          >
            <ChevronIcon direction="right" />
          </button>
        )}

        {/* BOTTOM PREVIEW PANEL */}
        <div className={styles.previewPanel}>
          <div className={styles.previewInfo}>
            <span className={styles.albumName}>
              {albumTitle}
            </span>

            <span className={styles.counter}>
              {currentIndex !== null
                ? currentIndex + 1
                : 0}
              <span className={styles.counterTotal}>
                {' / '}{images.length}
              </span>
            </span>
          </div>

          {/* CLICKABLE THUMBNAIL STRIP */}
          <div
            className={styles.thumbnailStrip}
            role="group"
            aria-label="Image previews"
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                className={`${styles.thumbnail} ${
                  index === currentIndex
                    ? styles.thumbnailActive
                    : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === currentIndex}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* RESPONSIVE BENTO PHOTO GRID */}
      <div className={styles.groupList}>
        {groups.map((group, groupIndex) => (
          <div
            className={styles.grid}
            key={`gallery-group-${groupIndex}`}
          >
            {group.map((image) => (
              <button
                key={image.id}
                type="button"
                className={styles.tile}
                data-cols={image.cols}
                data-rows={image.rows}
                style={{
                  animationDelay: `${
                    Math.min(image.index, 12) * 60
                  }ms`,
                }}
                onClick={(event) =>
                  openLightbox(
                    image.index,
                    event.currentTarget
                  )
                }
                aria-label={`Open ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={
                    image.index < 3 ? 'eager' : 'lazy'
                  }
                />

                <span
                  className={styles.expand}
                  aria-hidden="true"
                >
                  <ExpandIcon />
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* RENDER ABOVE ALL WEBSITE ELEMENTS */}
      {mounted && lightbox
        ? createPortal(lightbox, document.body)
        : null}
    </>
  );
}
