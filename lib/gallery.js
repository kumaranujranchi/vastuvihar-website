
import { readdir } from 'node:fs/promises';
import path from 'node:path';

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

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
]);

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

async function readAlbum(album) {
  const directory = path.join(
    process.cwd(),
    'public',
    'gallery',
    album.slug
  );

  let entries;

  try {
    entries = await readdir(directory, {
      withFileTypes: true,
    });
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      return {
        ...album,
        images: [],
        count: 0,
      };
    }

    throw error;
  }

  const filenames = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        IMAGE_EXTENSIONS.has(
          path.extname(entry.name).toLowerCase()
        )
    )
    .map((entry) => entry.name)
    .sort(collator.compare);

  const images = filenames.map((filename, index) => ({
    id: `${album.slug}-${filename}`,
    src: `/gallery/${album.slug}/${encodeURIComponent(filename)}`,
    alt: `${album.title} - Photo ${index + 1}`,
  }));

  return {
    ...album,
    images,
    count: images.length,
  };
}

export async function getGalleryAlbums() {
  return Promise.all(configuredAlbums.map(readAlbum));
}

export async function getGalleryAlbumBySlug(slug) {
  const album = configuredAlbums.find(
    (item) => item.slug === slug
  );

  if (!album) return null;

  return readAlbum(album);
}
