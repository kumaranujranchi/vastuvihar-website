import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency-free checks for the refactored website's routes, imports and assets.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = new Set();
let assetCount = 0;
let linkCount = 0;
const read = (file) => fs.readFileSync(file, 'utf8');
const relative = (file) => path.relative(root, file).split(path.sep).join('/');
const walk = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
  const file = path.join(dir, item.name);
  return item.isDirectory() ? walk(file) : [file];
}) : [];
const key = (url) => url.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
const pages = JSON.parse(read(path.join(root, 'data/pages.json')));
const routes = new Set(pages.map((page) => key(page.path)));
const removed = /^(?:home-\d+(?:\/|$)|services(?:\/|-|$)|projects-list(?:\/|$)|all-pages(?:\/|$))/;
const problem = (file, text) => errors.add(`${relative(file)}: ${text}`);

for (const required of ['', 'about-us', 'projects', 'contact', 'careers', 'core-values', 'our-awards', 'our-team', 'faqs']) {
  if (!routes.has(required)) errors.add(`Missing required route: /${required}`);
}
if (routes.size !== pages.length) errors.add('Duplicate route in data/pages.json.');
for (const page of pages) {
  if (removed.test(key(page.path))) errors.add(`Removed route remains: ${page.path}`);
  const routeFile = path.join(root, 'app', key(page.path), 'page.jsx');
  const dynamicFile = page.path.startsWith('/projects/') && !page.path.startsWith('/projects/page/')
    ? path.join(root, 'app/projects/[slug]/page.jsx')
    : page.path.startsWith('/our-team/') ? path.join(root, 'app/our-team/[slug]/page.jsx') : null;
  if (!fs.existsSync(routeFile) && !(dynamicFile && fs.existsSync(dynamicFile))) errors.add(`No page component for ${page.path}`);
}

function checkReference(raw, file, kind = 'asset') {
  const value = raw.trim().replace(/&amp;/g, '&').replace(/\\(["'])/g, '$1');
  if (!value || /^(?:#|data:|blob:|mailto:|tel:)/i.test(value)) return;
  if (/^(?:https?:)?\/\//i.test(value)) {
    if (/demo2\.wpopal\.com|\/wp-admin|\/wp-json/i.test(value)) problem(file, `Legacy runtime URL: ${value}`);
    return;
  }
  if (/^javascript:/i.test(value)) { problem(file, 'Executable URL remains.'); return; }
  if (value.includes('${')) return;
  if (kind === 'link' && !/\.[a-z0-9]{2,5}(?:[?#]|$)/i.test(value)) {
    linkCount++;
    if (removed.test(key(value)) || !routes.has(key(value))) problem(file, `Unknown/removed route: ${value}`);
    return;
  }
  const bare = value.split(/[?#]/)[0];
  const target = bare.startsWith('/') ? path.join(root, 'public', bare) : path.resolve(path.dirname(file), bare);
  assetCount++;
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) problem(file, `Missing asset: ${value}`);
}

const files = ['app', 'components', 'animations', 'data', 'styles'].flatMap((dir) => walk(path.join(root, dir)));
for (const file of files) {
  const text = read(file);
  if (file.endsWith('.css')) {
    const css = text.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gs)) checkReference(match[2], file);
    for (const match of css.matchAll(/@import\s+(['"])(.*?)\1/g)) checkReference(match[2], file);
  }
  if (/\.[jm]sx?$/.test(file)) {
    for (const match of text.matchAll(/(?:from\s+|import\s*)(['"])(@\/[^'"\n]+|\.[^'"\n]+)\1/g)) {
      const ref = match[2].startsWith('@/') ? path.join(root, match[2].slice(2)) : path.resolve(path.dirname(file), match[2]);
      if (![ref, ...['.jsx', '.js', '.json', '.css', '/index.jsx', '/index.js'].map((suffix) => ref + suffix)].some(fs.existsSync)) problem(file, `Missing import: ${match[2]}`);
    }
    for (const match of text.matchAll(/(?<![\w-])(src|href|poster|action|xlinkHref)\s*=\s*(?:\{\s*)?(["'])((?:\\.|(?!\2)[^\\])*)\2/g)) checkReference(match[3], file, (match[1] === 'href' || match[1] === 'action') ? 'link' : 'asset');
    // Asset paths and navigation config held in ordinary JS data objects.
    if (relative(file).startsWith('data/')) for (const match of text.matchAll(/(['"])(\/[^'"\n]+)\1/g)) checkReference(match[2], file, /\.(?:svg|png|jpe?g|webp|woff2?)(?:[?#]|$)/.test(match[2]) ? 'asset' : 'link');
  }
}
for (const item of JSON.parse(read(path.join(root, 'data/search-index.json')))) {
  if (!routes.has(key(item.path)) || removed.test(key(item.path))) errors.add(`Search points to removed page: ${item.path}`);
}
for (const file of walk(path.join(root, 'app'))) {
  const route = relative(file).replace(/^app\//, '').replace(/\/page\.jsx$/, '');
  if (removed.test(route)) problem(file, 'Removed page is still present.');
}
console.log(`Checked ${pages.length} website routes, ${files.length} source files, ${assetCount} asset references, and ${linkCount} links.`);
if (errors.size) {
  console.error([...errors].join('\n'));
  process.exit(1);
}
console.log('PASS — required pages, shared components, imports, assets, navigation and search are consistent.');
