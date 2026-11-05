import fs from 'node:fs';
import path from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('[auto-compress] sharp not available, skipping auto-compression.');
  process.exit(0);
}

const PUBLIC_DIR = path.resolve('public');
const SKIP_FILES = new Set([
  path.join(PUBLIC_DIR, 'icon.png'),
  path.join(PUBLIC_DIR, 'apple-icon.png'),
  path.join(PUBLIC_DIR, 'favicon-for-app', 'icon1.png'),
  path.join(PUBLIC_DIR, 'favicon-for-app', 'apple-icon.png'),
]);

const isPlan = (file) => /(plan|2d|3d|layout|floor)/i.test(path.basename(file));
const isThumb = (file) => file.includes(path.sep + 'thumb' + path.sep);
const isEmployee = (file) => file.includes(path.sep + 'employee' + path.sep);
const isLogo = (file) => file.includes(path.sep + 'bank' + path.sep) || /logo/i.test(file);

function getAllFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function convertImage(filePath) {
  if (SKIP_FILES.has(filePath)) return null;

  const stat = fs.statSync(filePath);
  const oldSize = stat.size;
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  const targetPath = path.join(dir, `${base}.webp`);

  let maxW = 1920;
  let quality = 80;

  if (isThumb(filePath)) {
    maxW = 800;
    quality = 80;
  } else if (isEmployee(filePath)) {
    maxW = 600;
    quality = 82;
  } else if (isLogo(filePath)) {
    maxW = 800;
    quality = 85;
  } else if (isPlan(filePath)) {
    maxW = 2000;
    quality = 85;
  }

  const buffer = fs.readFileSync(filePath);
  const webpBuffer = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer();

  fs.writeFileSync(targetPath, webpBuffer);

  // Delete old non-webp file
  if (filePath !== targetPath) {
    fs.unlinkSync(filePath);
  }

  return {
    oldRelative: '/' + path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/'),
    newRelative: '/' + path.relative(PUBLIC_DIR, targetPath).replace(/\\/g, '/'),
    oldSize,
    newSize: webpBuffer.length,
  };
}

async function optimizeExistingWebp(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size < 350 * 1024) return null; // only optimize if > 350KB

  const buffer = fs.readFileSync(filePath);
  const webpBuffer = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer();

  if (webpBuffer.length < stat.size) {
    fs.writeFileSync(filePath, webpBuffer);
    return {
      path: filePath,
      oldSize: stat.size,
      newSize: webpBuffer.length,
    };
  }
  return null;
}

function updateCodebaseReferences(replacements) {
  if (!replacements.length) return;
  const TARGET_DIRS = ['app', 'components', 'data', 'styles', 'lib'];
  const EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'];

  function walk(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        files = files.concat(walk(full));
      } else if (EXTS.includes(path.extname(item))) {
        files.push(full);
      }
    }
    return files;
  }

  for (const dir of TARGET_DIRS) {
    const files = walk(dir);
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      for (const { oldRelative, newRelative } of replacements) {
        if (content.includes(oldRelative)) {
          content = content.replaceAll(oldRelative, newRelative);
          changed = true;
        }
        // Also check without leading slash
        const oldNoSlash = oldRelative.replace(/^\//, '');
        const newNoSlash = newRelative.replace(/^\//, '');
        if (content.includes(`"${oldNoSlash}"`) || content.includes(`'${oldNoSlash}'`)) {
          content = content.replaceAll(oldNoSlash, newNoSlash);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[auto-compress] Updated references in: ${file}`);
      }
    }
  }
}

async function main() {
  const rasterFiles = getAllFiles(PUBLIC_DIR, ['.jpg', '.jpeg', '.png']);
  const replacements = [];

  if (rasterFiles.length > 0) {
    console.log(`[auto-compress] Found ${rasterFiles.length} uncompressed image(s). Auto-converting to WebP...`);
    for (const file of rasterFiles) {
      try {
        const res = await convertImage(file);
        if (res) {
          replacements.push(res);
          console.log(`[auto-compress] Converted ${res.oldRelative} (${(res.oldSize/1024).toFixed(0)}KB) -> ${(res.newSize/1024).toFixed(0)}KB`);
        }
      } catch (err) {
        console.error(`[auto-compress] Error converting ${file}:`, err.message);
      }
    }

    if (replacements.length > 0) {
      updateCodebaseReferences(replacements);
    }
  }

  // Also optimize any oversized webp files
  const webpFiles = getAllFiles(PUBLIC_DIR, ['.webp']);
  for (const file of webpFiles) {
    try {
      const res = await optimizeExistingWebp(file);
      if (res) {
        console.log(`[auto-compress] Optimized ${path.relative(PUBLIC_DIR, res.path)} (${(res.oldSize/1024).toFixed(0)}KB -> ${(res.newSize/1024).toFixed(0)}KB)`);
      }
    } catch {}
  }
}

main().catch(console.error);
