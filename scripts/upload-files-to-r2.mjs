// Copies the Lightsail upload folders into R2, under the keys lib/privateStorage.ts reads.
//
//   node scripts/upload-files-to-r2.mjs <lightsail-copy-dir> [--env uat] [--dry-run]
//
// <lightsail-copy-dir> is a local copy of /var/www/vastuvihar-website containing:
//   storage/private/resumes/*   -> PRIVATE_FILES bucket, key resumes/<name>
//   public/uploads/blogs/*      -> MEDIA bucket,         key blogs/<name>
//   public/uploads/gallery/*    -> MEDIA bucket,         key gallery/<name>
// Bucket names come from wrangler.jsonc for the chosen environment. Existing objects
// with the same key are overwritten, so re-running after a partial copy is safe.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const envIndex = args.indexOf('--env');
const wranglerEnv = envIndex >= 0 ? args.splice(envIndex, 2)[1] : null;
const dryRun = args.includes('--dry-run');
const base = args.find((arg) => !arg.startsWith('--'));
if (!base || !fs.existsSync(base)) {
  console.error('Usage: node scripts/upload-files-to-r2.mjs <lightsail-copy-dir> [--env uat] [--dry-run]');
  process.exit(1);
}

const { unstable_readConfig: readConfig } = await import('wrangler');
const config = readConfig({ config: 'wrangler.jsonc', env: wranglerEnv ?? undefined }, { hideWarnings: true });
const bucketFor = (binding) => {
  const bucket = (config.r2_buckets || []).find((entry) => entry.binding === binding)?.bucket_name;
  if (!bucket) throw new Error(`No R2 bucket bound as ${binding} in wrangler.jsonc.`);
  return bucket;
};

const CONTENT_TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};
const sets = [
  { dir: 'storage/private/resumes', binding: 'PRIVATE_FILES', prefix: 'resumes' },
  { dir: 'public/uploads/blogs', binding: 'MEDIA', prefix: 'blogs' },
  { dir: 'public/uploads/gallery', binding: 'MEDIA', prefix: 'gallery' },
];

let copied = 0;
let failed = 0;
for (const { dir, binding, prefix } of sets) {
  const folder = path.join(base, dir);
  if (!fs.existsSync(folder)) {
    console.log(`skip  ${dir} (not present)`);
    continue;
  }
  const bucket = bucketFor(binding);
  for (const name of fs.readdirSync(folder)) {
    const file = path.join(folder, name);
    if (!fs.statSync(file).isFile()) continue;
    const contentType = CONTENT_TYPES[path.extname(name).toLowerCase()];
    if (!contentType) {
      console.warn(`skip  ${dir}/${name} (type not served by the site)`);
      continue;
    }
    const key = `${bucket}/${prefix}/${name}`;
    if (dryRun) {
      console.log(`would copy ${dir}/${name} -> ${key}`);
      copied += 1;
      continue;
    }
    const result = spawnSync(
      process.execPath,
      ['node_modules/wrangler/bin/wrangler.js', 'r2', 'object', 'put', key, '--file', file, '--content-type', contentType, '--remote'],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    );
    if (result.status === 0) copied += 1;
    else {
      failed += 1;
      console.error(`FAIL  ${dir}/${name}`);
    }
  }
}
console.log(`${dryRun ? 'Would copy' : 'Copied'} ${copied} file(s)${failed ? `, ${failed} failed` : ''}.`);
process.exit(failed ? 1 : 0);
