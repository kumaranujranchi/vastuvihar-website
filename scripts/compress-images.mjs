// Shrinks oversized images in public/ in place, keeping each file's name and format so no
// reference changes. A file is only replaced when the result is smaller.
//
//   node scripts/compress-images.mjs          Report what would change
//   node scripts/compress-images.mjs --write  Replace the files
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'public';
const MIN_BYTES = 500 * 1024;
const MAX_WIDTH = 2000;
const write = process.argv.includes('--write');

// Floor plans hold small text and lines, so they keep more detail.
const isPlan = (file) => /(plan|2d|3d)/i.test(path.basename(file));

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield full;
  }
}

async function compress(file, input) {
  const plan = isPlan(file);
  const image = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const ext = path.extname(file).toLowerCase();

  if (ext === '.webp') return image.webp({ quality: plan ? 88 : 78, effort: 5 }).toBuffer();
  if (ext === '.png') return image.png({ palette: true, quality: plan ? 90 : 75, compressionLevel: 9, effort: 8 }).toBuffer();
  return image.jpeg({ quality: plan ? 88 : 78, mozjpeg: true }).toBuffer();
}

let count = 0;
let before = 0;
let after = 0;
const rows = [];

for await (const file of walk(ROOT)) {
  const { size } = await stat(file);
  if (size < MIN_BYTES) continue;

  const input = await readFile(file);
  const output = await compress(file, input);
  if (output.length >= size) continue;

  count += 1;
  before += size;
  after += output.length;
  rows.push({ file, size, out: output.length });
  if (write) await writeFile(file, output);
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
rows.sort((a, b) => b.size - a.size);
for (const { file, size, out } of rows.slice(0, 15)) console.log(`${mb(size).padStart(9)} -> ${mb(out).padStart(8)}  ${file}`);
console.log(`\n${write ? 'Compressed' : 'Would compress'} ${count} files: ${mb(before)} -> ${mb(after)}`);
