import fs from 'node:fs';
import path from 'node:path';

// Lists public/gallery/<album>/ into data/gallery-manifest.json for lib/gallery.js.
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;
const root = path.join(process.cwd(), 'public', 'gallery');
const manifest = {};
for (const album of fs.readdirSync(root, { withFileTypes: true })) {
  if (!album.isDirectory()) continue;
  manifest[album.name] = fs
    .readdirSync(path.join(root, album.name), { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}
fs.writeFileSync(path.join(process.cwd(), 'data', 'gallery-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
