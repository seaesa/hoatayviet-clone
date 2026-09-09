import { fetchSmart, loadCheerio } from './fetch-utils.mjs';
import fs from 'fs';

const pages = {
  about: 'https://hoatayviet.net/gioi-thieu/',
  huongDanIndex: 'https://hoatayviet.net/huong-dan/',
  huongDanSuDung: 'https://hoatayviet.net/phuong-thuc-van-chuyen/',
  huongDanMuaHang: 'https://hoatayviet.net/huong-dan-mua-hang/',
  newsCategory: 'https://hoatayviet.net/category/chua-duoc-phan-loai/',
  cart: 'https://hoatayviet.net/gio-hang/',
  catTauDuLich: 'https://hoatayviet.net/danh-muc/tau-du-lich-du-thuyen/',
  catTauChoHang: 'https://hoatayviet.net/danh-muc/tau-cho-hang/',
  catThuyenBuom: 'https://hoatayviet.net/danh-muc/thuyen-buom/',
  catThuyenDiDao: 'https://hoatayviet.net/danh-muc/thuyen-dung-di-dao/',
  catDuThuyenHienDai: 'https://hoatayviet.net/danh-muc/du-thuyen-hien-dai/',
  catNoiThat: 'https://hoatayviet.net/danh-muc/noi-that/',
  catSanPhamKhac: 'https://hoatayviet.net/danh-muc/san-pham-khac/',
};

const out = {};
for (const [key, url] of Object.entries(pages)) {
  const { html, source } = await fetchSmart(url);
  console.error(key, url, '->', source, html ? html.length : 0);
  if (!html) { out[key] = { url, error: 'no html' }; continue; }
  const $ = loadCheerio(html);
  const title = $('h1').first().text().trim();
  const mainText = $('#main, main, .content-area').first().text().replace(/\s+/g,' ').trim().slice(0, 3000);
  const images = [...new Set($('#main img, main img, .content-area img').map((i,el)=>$(el).attr('src')||$(el).attr('data-src')).get().filter(Boolean))];
  const productLinks = [...new Set($('.products .product a').map((i,el)=>$(el).attr('href')).get().filter(Boolean))];
  out[key] = { url, source, title, mainText, images, productLinks };
}

fs.writeFileSync('docs/research/misc-pages.json', JSON.stringify(out, null, 2));
console.error('DONE');
