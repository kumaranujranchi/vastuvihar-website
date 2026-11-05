
// Workers have no project filesystem at runtime, so the folders are listed at build time.
// scripts/gallery-manifest.mjs regenerates this before every build.
import manifest from '@/data/gallery-manifest.json';
import { prisma } from '@/lib/prisma';

// ADD OR REMOVE GALLERY FOLDERS HERE
export const GALLERY_FOLDER_PATHS = [
  'gallery/event',
  'gallery/expo',
  'gallery/tournament',
  'gallery/press',
];

// Optional: custom display headings
const FOLDER_TITLES = {
  event: 'Company Events',
  expo: 'Property Expos',
};

const collator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

function formatTitle(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeFolder(folder) {
  const clean = folder
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/\/+$/, '');

  const parts = clean.split('/');

  if (
    parts.length !== 2 ||
    parts[0] !== 'gallery' ||
    !/^[a-zA-Z0-9_-]+$/.test(parts[1])
  ) {
    throw new Error(
      `Invalid gallery folder: "${folder}". Use "gallery/folder-name".`
    );
  }

  return parts[1];
}

const configuredAlbums = GALLERY_FOLDER_PATHS.map((folder) => {
  const slug = normalizeFolder(folder);

  return {
    slug,
    title: FOLDER_TITLES[slug] || formatTitle(slug),
    folder,
  };
});

// Admin changes are stored separately, so photos added to public/gallery still appear.
// If the database is unavailable, the built-in photos are shown instead of an empty gallery.
async function readChanges(where) {
  try {
    return await prisma.galleryImage.findMany({ where, orderBy: { createdAt: 'asc' } });
  } catch (error) {
    console.error('gallery: database unavailable.', error);
    return [];
  }
}

const uploadedSrc = (name) => `/uploads/gallery/${encodeURIComponent(name)}`;

function buildAlbum(album, changes) {
  const filenames = [...(manifest[album.slug] || [])].sort(collator.compare);
  const builtInChanges = new Map(
    changes.filter((change) => change.builtInName).map((change) => [change.builtInName, change])
  );

  const builtIn = filenames.flatMap((filename) => {
    const change = builtInChanges.get(filename);
    if (change && !change.storageKey) return [];
    return [{
      id: `${album.slug}-${filename}`,
      src: change
        ? uploadedSrc(change.storageKey)
        : `/gallery/${album.slug}/${encodeURIComponent(filename)}`,
      builtInName: filename,
      uploadId: null,
    }];
  });

  const added = changes
    .filter((change) => !change.builtInName && change.storageKey)
    .map((change) => ({
      id: change.id,
      src: uploadedSrc(change.storageKey),
      builtInName: null,
      uploadId: change.id,
    }));

  const images = [...builtIn, ...added].map((image, index) => ({
    ...image,
    alt: `${album.title} - Photo ${index + 1}`,
  }));

  return {
    ...album,
    images,
    count: images.length,
  };
}

export async function getGalleryAlbums() {
  const changes = await readChanges({});
  return configuredAlbums.map((album) =>
    buildAlbum(album, changes.filter((change) => change.album === album.slug))
  );
}

export async function getGalleryAlbumBySlug(slug) {
  const album = configuredAlbums.find(
    (item) => item.slug === slug
  );

  if (!album) return null;

  return buildAlbum(album, await readChanges({ album: slug }));
}

export const isGalleryAlbum = (slug) =>
  configuredAlbums.some((album) => album.slug === slug);

export const isBuiltInPhoto = (slug, filename) =>
  (manifest[slug] || []).includes(filename);
