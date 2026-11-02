import fs from 'node:fs/promises';
import path from 'node:path';
import { randomToken } from '@/lib/security/crypto';

const PRIVATE_PREFIX = 'private:';

function resumeDir(): string {
  const base = process.env.PRIVATE_STORAGE_DIR || path.join(process.cwd(), 'storage', 'private');
  return path.join(base, 'resumes');
}

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

  const dir = resumeDir();
  await fs.mkdir(dir, { recursive: true });
  const name = `${randomToken(24)}${ext}`;
  await fs.writeFile(path.join(dir, name), buffer, { mode: 0o600 });
  return { path: `${PRIVATE_PREFIX}${name}` };
}

/** Resolves stored paths, including legacy public ones, without allowing traversal. */
function resolveResume(stored: string): string | null {
  if (stored.startsWith(PRIVATE_PREFIX)) {
    return path.join(resumeDir(), path.basename(stored.slice(PRIVATE_PREFIX.length)));
  }
  if (stored.startsWith('/uploads/resumes/')) {
    return path.join(process.cwd(), 'public', 'uploads', 'resumes', path.basename(stored));
  }
  return null;
}

export async function readResume(stored: string): Promise<{ data: Buffer; mime: string; ext: string } | null> {
  const file = resolveResume(stored);
  if (!file) return null;
  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file).toLowerCase();
    return { data, ext, mime: RESUME_TYPES[ext]?.mime || 'application/octet-stream' };
  } catch {
    return null;
  }
}

export async function deleteResume(stored: string | null | undefined): Promise<void> {
  if (!stored) return;
  const file = resolveResume(stored);
  if (!file) return;
  await fs.rm(file, { force: true });
}

const IMAGE_TYPES: Record<string, (b: Buffer) => boolean> = {
  '.jpg': (b) => b.subarray(0, 3).toString('hex') === 'ffd8ff',
  '.jpeg': (b) => b.subarray(0, 3).toString('hex') === 'ffd8ff',
  '.png': (b) => b.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
  '.gif': (b) => b.subarray(0, 4).toString('latin1') === 'GIF8',
  '.webp': (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Public blog images: raster formats only, so an upload cannot carry script (SVG/HTML). */
export async function saveBlogImage(file: File, baseName: string): Promise<{ url?: string; error?: string }> {
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Image exceeds the 8MB limit.' };
  const ext = path.extname(file.name).toLowerCase();
  const matches = IMAGE_TYPES[ext];
  if (!matches) return { error: 'Only JPG, PNG, GIF or WebP images are supported.' };
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matches(buffer)) return { error: 'The file is not a valid image.' };

  const dir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
  await fs.mkdir(dir, { recursive: true });
  const safe = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'image';
  const name = `${Date.now()}_${safe}${ext}`;
  await fs.writeFile(path.join(dir, name), buffer);
  return { url: `/uploads/blogs/${name}` };
}
