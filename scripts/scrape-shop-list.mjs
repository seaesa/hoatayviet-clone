import { fetchSmart, loadCheerio } from './fetch-utils.mjs';
import fs from 'fs';

const pages = [
  'https://hoatayviet.net/shop/',
  'https://hoatayviet.net/shop/page/2/',
  'https://hoatayviet.net/shop/page/3/',
];

const products = [];
for (const url of pages) {
  const { html, source } = await fetchSmart(url);
  console.error(url, '->', source, html ? html.length : 0);
  if (!html) continue;
  const $ = loadCheerio(html);
  $('ul.products li.product, .products .product').each((i, el) => {
    const $el = $(el);
    const link = $el.find('a').first().attr('href');
    const title = $el.find('.woocommerce-loop-product__title, h2, h3, .product-title').first().text().trim() || $el.find('a').first().attr('aria-label') || '';
    const img = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src');
    const price = $el.find('.price').first().text().replace(/\s+/g,' ').trim();
    if (link) products.push({ title, link, img, price });
  });
}

// dedupe by link
const seen = new Set();
const uniq = products.filter(p => { if (seen.has(p.link)) return false; seen.add(p.link); return true; });
fs.writeFileSync('docs/research/products-list.json', JSON.stringify(uniq, null, 2));
console.error('TOTAL PRODUCTS', uniq.length);
console.log(JSON.stringify(uniq, null, 2));
