import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = 'docs/research/cache';
fs.mkdirSync(CACHE_DIR, { recursive: true });

function cacheKey(url) {
  return path.join(CACHE_DIR, encodeURIComponent(url) + '.html');
}

export async function fetchSmart(url, { forceWayback = false } = {}) {
  const key = cacheKey(url);
  if (fs.existsSync(key)) {
    return { html: fs.readFileSync(key, 'utf8'), source: 'cache' };
  }
  if (!forceWayback) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36' } });
      if (res.ok) {
        const html = await res.text();
        fs.writeFileSync(key, html);
        return { html, source: 'live' };
      }
    } catch (e) { /* fall through to wayback */ }
  }
  // fallback to wayback machine
  const availRes = await fetch('https://archive.org/wayback/available?url=' + encodeURIComponent(url));
  const avail = await availRes.json();
  const snap = avail.archived_snapshots && avail.archived_snapshots.closest;
  if (!snap || !snap.available) {
    return { html: null, source: 'none' };
  }
  const rawUrl = snap.url.replace(/(\/web\/\d+)/, '$1id_');
  const res2 = await fetch(rawUrl);
  const html = await res2.text();
  fs.writeFileSync(key, html);
  return { html, source: 'wayback:' + snap.timestamp };
}

export function loadCheerio(html) {
  return cheerio.load(html);
}
