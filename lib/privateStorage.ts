import { getCloudflareContext } from '@opennextjs/cloudflare';
import path from 'node:path';
import { randomToken } from '@/lib/security/crypto';

const PRIVATE_PREFIX = 'private:';
const RESUME_FOLDER = 'resumes';
const BLOG_FOLDER = 'blogs';
const GALLERY_FOLDER = 'gallery';

const privateFiles = () => getCloudflareContext().env.PRIVATE_FILES;
const media = () => getCloudflareContext().env.MEDIA;

const RESUME_TYPES: Record<string, { mime: string; matches: (b: Buffer) => boolean }> = {
  '.pdf': {
    mime: 'application/pdf',
    matches: (b) => b.subarray(0, 5).toString('latin1') === '%PDF-',
  },
  '.doc': {
    mime: 'application/msword',
    matches: (b) => b.subarray(0, 8).toString('hex') === 'd0cf11e0a1b11ae1',
  },
  '.docx': {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    matches: (b) => b.subarray(0, 4).toString('hex') === '504b0304',
  },
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Random file name, so the stored path reveals nothing about the applicant. */
export async function saveResume(file: File): Promise<{ path?: string; error?: string }> {
  if (file.size > MAX_RESUME_BYTES) return { error: 'Resume file size exceeds 5MB limit.' };
  const ext = path.extname(file.name).toLowerCase();
  const type = RESUME_TYPES[ext];
  if (!type) return { error: 'Only PDF or DOC/DOCX resume files are supported.' };

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!type.matches(buffer)) return { error: 'The file does not look like a valid PDF or Word document.' };

  const name = `${randomToken(24)}${ext}`;
  await privateFiles().put(`${RESUME_FOLDER}/${name}`, buffer, { httpMetadata: { contentType: type.mime } });
  return { path: `${PRIVATE_PREFIX}${name}` };
}

/** Maps a stored path to its object key, without allowing traversal. */
function resumeKey(stored: string): string | null {
  if (!stored.startsWith(PRIVATE_PREFIX)) return null;
  return `${RESUME_FOLDER}/${path.basename(stored.slice(PRIVATE_PREFIX.length))}`;
}

export async function readResume(stored: string): Promise<{ data: Buffer; mime: string; ext: string } | null> {
  const key = resumeKey(stored);
  if (!key) return null;
  const object = await privateFiles().get(key);
  if (!object) return null;
  const ext = path.extname(key).toLowerCase();
  return {
    data: Buffer.from(await object.arrayBuffer()),
    ext,
    mime: RESUME_TYPES[ext]?.mime || 'application/octet-stream',
  };
}

export async function deleteResume(stored: string | null | undefined): Promise<void> {
  if (!stored) return;
  const key = resumeKey(stored);
  if (key) await privateFiles().delete(key);
}

const IMAGE_TYPES: Record<string, (b: Buffer) => boolean> = {
  '.jpg': (b) => b.subarray(0, 3).toString('hex') === 'ffd8ff',
  '.jpeg': (b) => b.subarray(0, 3).toString('hex') === 'ffd8ff',
  '.png': (b) => b.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
  '.gif': (b) => b.subarray(0, 4).toString('latin1') === 'GIF8',
  '.webp': (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
};

const IMAGE_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Public images: raster formats only, so an upload cannot carry script (SVG/HTML). */
async function readImageUpload(file: File): Promise<{ buffer: Buffer; ext: string } | { error: string }> {
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Image exceeds the 8MB limit.' };
  const ext = path.extname(file.name).toLowerCase();
  const matches = IMAGE_TYPES[ext];
  if (!matches) return { error: 'Only JPG, PNG, GIF or WebP images are supported.' };
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matches(buffer)) return { error: 'The file is not a valid image.' };
  return { buffer, ext };
}

export async function saveBlogImage(file: File, baseName: string): Promise<{ url?: string; error?: string }> {
  const upload = await readImageUpload(file);
  if ('error' in upload) return { error: upload.error };
  const { buffer, ext } = upload;

  const safe = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'image';
  const name = `${Date.now()}_${safe}${ext}`;
  await media().put(`${BLOG_FOLDER}/${name}`, buffer, { httpMetadata: { contentType: IMAGE_MIME[ext] } });
  return { url: `/uploads/blogs/${name}` };
}

async function readMediaImage(folder: string, name: string): Promise<{ body: ReadableStream; contentType: string } | null> {
  const safe = path.basename(name);
  const contentType = IMAGE_MIME[path.extname(safe).toLowerCase()];
  if (!contentType) return null;
  const object = await media().get(`${folder}/${safe}`);
  return object ? { body: object.body as unknown as ReadableStream, contentType } : null;
}

export const readBlogImage = (name: string) => readMediaImage(BLOG_FOLDER, name);

/** Each upload gets a new random name, so its URL can be cached forever. */
export async function saveGalleryImage(file: File): Promise<{ name?: string; error?: string }> {
  const upload = await readImageUpload(file);
  if ('error' in upload) return { error: upload.error };
  const name = `${randomToken(24)}${upload.ext}`;
  await media().put(`${GALLERY_FOLDER}/${name}`, upload.buffer, { httpMetadata: { contentType: IMAGE_MIME[upload.ext] } });
  return { name };
}

export const readGalleryImage = (name: string) => readMediaImage(GALLERY_FOLDER, name);

export async function deleteGalleryImage(name: string | null | undefined): Promise<void> {
  if (name) await media().delete(`${GALLERY_FOLDER}/${path.basename(name)}`);
}
