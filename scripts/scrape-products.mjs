import { fetchSmart, loadCheerio } from './fetch-utils.mjs';
import fs from 'fs';

const list = JSON.parse(fs.readFileSync('docs/research/products-list.json', 'utf8'));
const results = [];

function slugFromUrl(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return parts[parts.length - 1];
}

for (const p of list) {
  const { html, source } = await fetchSmart(p.link);
  if (!html) { console.error('MISSING', p.link); results.push({ ...p, slug: slugFromUrl(p.link), error: 'no html' }); continue; }
  const $ = loadCheerio(html);
  const title = $('h1').first().text().trim() || p.title;
  const breadcrumb = $('.woocommerce-breadcrumb, nav.woocommerce-breadcrumb').first().text().replace(/\s+/g,' ').trim();
  const descFull = $('#tab-description').text().replace(/\s+/g,' ').trim();
  const categories = [...new Set($('.posted_in a').map((i,el)=>$(el).text().trim()).get())];
  const gallery = [...new Set($('img.attachment-shop_single').map((i,el)=>$(el).attr('src')||$(el).attr('data-src')).get().filter(Boolean))];
  if (gallery.length === 0) {
    // fallback: try woocommerce-product-gallery
    $('.woocommerce-product-gallery img').each((i,el)=>{ const s=$(el).attr('data-src')||$(el).attr('src'); if(s) gallery.push(s); });
  }
  results.push({
    title, slug: slugFromUrl(p.link), link: p.link, source, breadcrumb, categories, gallery, descFull, listImg: p.img, listPrice: p.price
  });
  console.error('OK', source, title, gallery.length, 'images');
}

fs.writeFileSync('docs/research/products-full.json', JSON.stringify(results, null, 2));
console.error('DONE', results.length);
