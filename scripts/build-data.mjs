import fs from 'fs';
import path from 'path';

const full = JSON.parse(fs.readFileSync('docs/research/products-full.json', 'utf8'));
const misc = JSON.parse(fs.readFileSync('docs/research/misc-pages.json', 'utf8'));

const CATEGORIES = [
  { name: 'Tàu Du Lịch – Du Thuyền', slug: 'tau-du-lich-du-thuyen' },
  { name: 'Tàu Chở Hàng',            slug: 'tau-cho-hang' },
  { name: 'Thuyền Buồm',             slug: 'thuyen-buom' },
  { name: 'Thuyền (Dùng đi dạo)',    slug: 'thuyen-dung-di-dao' },
  { name: 'Du Thuyền Hiện Đại',      slug: 'du-thuyen-hien-dai' },
  { name: 'Nội Thất',                slug: 'noi-that' },
  { name: 'Sản Phẩm Khác',           slug: 'san-pham-khac' },
];
const nameToSlug = Object.fromEntries(CATEGORIES.map(c => [c.name, c.slug]));

// Manual category fill-in for the 6 products whose live+wayback page was unreachable
// (inferred from their name / from homepage category widget groupings captured during recon)
const FALLBACK_CATEGORIES = {
  'bali-catamaran': ['Du Thuyền Hiện Đại'],
  'aquila-36-2': ['Du Thuyền Hiện Đại'],
  'reserved-cruise': ['Du Thuyền Hiện Đại'],
  'noi-that-go-tram': ['Nội Thất'],
  'tranh-thuyen': ['Sản Phẩm Khác'],
  'mo-hinh-thuyen-batavia': ['Thuyền Buồm'],
};

function localImg(url, kind) {
  if (!url) return null;
  const base = path.basename(new URL(url).pathname);
  return `/assets/images/${kind}/${base}`;
}

function parseDescription(text) {
  if (!text) return {};
  const get = (re) => { const m = text.match(re); return m ? m[1].trim() : null; };
  return {
    ma: get(/MÃ SP:\s*([^\s][^K]*?)(?=KÍCH THƯỚC:|$)/i),
    kichThuoc: get(/KÍCH THƯỚC:\s*(.*?)(?=GIÁ S[ÌỈ]:|GIÁ BÁN|$)/i),
    giaSi: get(/GIÁ S[ÌỈ]:\s*(.*?)(?=GIÁ BÁN|$)/i),
    giaBanLe: get(/GIÁ BÁN L[ẼẺ]:\s*(.*)$/i),
    raw: text,
  };
}

const products = full.map(p => {
  const categories = (p.categories && p.categories.length) ? p.categories : (FALLBACK_CATEGORIES[p.slug] || []);
  const fallbackImg = p.listImg || p.img;
  const gallery = (p.gallery && p.gallery.length ? p.gallery : (fallbackImg ? [fallbackImg] : []))
    .map(u => localImg(u, 'products'))
    .filter(Boolean);
  if (gallery.length === 0 && fallbackImg) gallery.push(localImg(fallbackImg, 'products'));
  return {
    title: p.title,
    slug: p.slug,
    url: `/sp/${p.slug}/`,
    categories,
    categorySlugs: categories.map(c => nameToSlug[c]).filter(Boolean),
    breadcrumbCategory: categories[0] || null,
    gallery: gallery.length ? gallery : ['/assets/images/site/logo.jpg'],
    thumb: gallery[0] || '/assets/images/site/logo.jpg',
    spec: parseDescription(p.descFull),
  };
});

const productsBySlug = Object.fromEntries(products.map(p => [p.slug, p]));

const categories = CATEGORIES.map(c => ({
  ...c,
  url: `/danh-muc/${c.slug}/`,
  products: products.filter(p => p.categorySlugs.includes(c.slug)),
}));

const data = {
  categories,
  products,
  productsBySlug,
  misc,
};

fs.writeFileSync('docs/research/site-data.json', JSON.stringify(data, null, 2));
console.error('Products:', products.length, ' Categories:', categories.map(c => `${c.name}(${c.products.length})`).join(', '));
