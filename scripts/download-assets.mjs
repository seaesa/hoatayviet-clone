import fs from 'fs';
import path from 'path';

const IMG_DIR = 'assets/images/products';
const SITE_DIR = 'assets/images/site';
fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(SITE_DIR, { recursive: true });

const products = JSON.parse(fs.readFileSync('docs/research/products-full.json', 'utf8'));
const list = JSON.parse(fs.readFileSync('docs/research/products-list.json', 'utf8'));

const siteAssets = [
  'https://hoatayviet.net/wp-content/uploads/2023/06/logo.jpg',
  'https://hoatayviet.net/wp-content/uploads/2023/06/cropped-logo-32x32.jpg',
  'https://hoatayviet.net/wp-content/uploads/2023/06/cropped-logo-192x192.jpg',
  'https://hoatayviet.net/wp-content/uploads/2023/06/cropped-logo-180x180.jpg',
];

const allUrls = new Set(siteAssets);
for (const p of products) {
  (p.gallery || []).forEach(u => allUrls.add(u));
  if (p.listImg) allUrls.add(p.listImg);
}
for (const p of list) if (p.img) allUrls.add(p.img);

function localPathFor(url) {
  const u = new URL(url);
  const base = path.basename(u.pathname);
  if (siteAssets.includes(url)) return path.join(SITE_DIR, base);
  return path.join(IMG_DIR, base);
}

const urls = [...allUrls];
console.error('Total unique assets:', urls.length);

async function downloadOne(url) {
  const dest = localPathFor(url);
  if (fs.existsSync(dest)) return { url, dest, status: 'cached' };
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { url, dest, status: 'FAIL ' + res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return { url, dest, status: 'ok ' + buf.length };
  } catch (e) {
    return { url, dest, status: 'ERROR ' + e.message };
  }
}

const BATCH = 6;
const results = [];
for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const r = await Promise.all(batch.map(downloadOne));
  results.push(...r);
  r.forEach(x => console.error(x.status, x.url));
}

const fails = results.filter(r => r.status.startsWith('FAIL') || r.status.startsWith('ERROR'));
console.error('DONE. Failures:', fails.length);
fs.writeFileSync('docs/research/asset-download-log.json', JSON.stringify(results, null, 2));
