import fs from 'fs';
import path from 'path';
import { page, breadcrumb, ribbonSection, productGrid, categorySidebar, esc, CATEGORIES_NAV } from './templates.mjs';

const data = JSON.parse(fs.readFileSync('docs/research/site-data.json', 'utf8'));
const { categories, products } = data;

function write(outPath, html) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

const ROOT = '.';

/* ---------------- Home page ---------------- */
function homePage() {
  const HERO_SLIDES = [
    { img: '/assets/images/site/z3487042728597_daf745f2e9f46dcaf6295ec7df19df7d-768x579-1.jpg', alt: 'Xưởng chế tác mô hình thuyền Hoa Tay Việt' },
    { img: '/assets/images/site/z3150831024697_8d7e0c59a1b1af27a544a517bb227612.jpg', alt: 'Mô hình thuyền gỗ thủ công' },
    { img: '/assets/images/site/366219_n-768x613-1.gif', alt: 'Mô hình tàu thuyền mỹ nghệ' },
    { img: '/assets/images/site/VV3.gif', alt: 'Sản phẩm thuyền mô hình Hoa Tay Việt' },
  ];

  const hero = `<div class="home-top">
    <ul class="home-cats">
      ${CATEGORIES_NAV.map(c => `<li><a href="/danh-muc/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
    </ul>
    <section class="hero-slider">
      <div class="hero-slider__track">
        ${HERO_SLIDES.map(s => `<div class="hero-slider__slide"><img src="${s.img}" alt="${esc(s.alt)}"></div>`).join('')}
      </div>
      <button class="hero-slider__arrow prev" aria-label="Slide trước">‹</button>
      <button class="hero-slider__arrow next" aria-label="Slide sau">›</button>
      <div class="hero-slider__dots"></div>
    </section>
  </div>`;

  const sections = categories.map(cat => {
    const others = CATEGORIES_NAV.filter(c => c.slug !== cat.slug).slice(0, 4);
    return `<section>
      ${ribbonSection(cat.name, others.map(o => ({ name: o.name, url: `/danh-muc/${o.slug}/` })))}
      ${productGrid(cat.products.slice(0, 8))}
    </section>`;
  }).join('');

  return page({
    title: 'Trang Chủ',
    activeKey: 'home',
    bodyClass: 'page-home',
    main: `<div class="container">${hero}${sections}</div>`,
  });
}
write(`${ROOT}/index.html`, homePage());

/* ---------------- Shop pages (paginated, all 35 products) ---------------- */
const PAGE_SIZE = 12;
const totalPages = Math.ceil(products.length / PAGE_SIZE);

function paginationHtml(current, total, base) {
  let html = '<nav class="pagination" aria-label="Phân trang">';
  for (let i = 1; i <= total; i++) {
    const url = i === 1 ? base : `${base}page/${i}/`;
    html += i === current ? `<span class="is-active">${i}</span>` : `<a href="${url}">${i}</a>`;
  }
  html += '</nav>';
  return html;
}

for (let i = 1; i <= totalPages; i++) {
  const slice = products.slice((i - 1) * PAGE_SIZE, i * PAGE_SIZE);
  const main = `
    ${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Sản phẩm', url: '/shop/' }])}
    <div class="container page-layout">
      <aside>${categorySidebar(null)}</aside>
      <div>
        ${ribbonSection('Tất cả sản phẩm')}
        <p class="sr-status">Hiển thị ${(i - 1) * PAGE_SIZE + 1}–${Math.min(i * PAGE_SIZE, products.length)} trong ${products.length} kết quả</p>
        ${productGrid(slice)}
        ${paginationHtml(i, totalPages, '/shop/')}
      </div>
    </div>`;
  const html = page({ title: i === 1 ? 'Sản Phẩm' : `Sản Phẩm - Trang ${i}`, activeKey: 'shop', main });
  const outPath = i === 1 ? `${ROOT}/shop/index.html` : `${ROOT}/shop/page/${i}/index.html`;
  write(outPath, html);
}

/* ---------------- Category pages ---------------- */
for (const cat of categories) {
  const others = CATEGORIES_NAV.filter(c => c.slug !== cat.slug);
  const main = `
    ${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: cat.name, url: cat.url }])}
    <div class="container page-layout">
      <aside>${categorySidebar(cat.slug)}</aside>
      <div>
        ${ribbonSection(cat.name, others.slice(0, 4).map(o => ({ name: o.name, url: `/danh-muc/${o.slug}/` })))}
        <p class="sr-status">${cat.products.length} sản phẩm</p>
        ${cat.products.length ? productGrid(cat.products) : `<div class="empty-state"><p>Chưa có sản phẩm trong danh mục này.</p></div>`}
      </div>
    </div>`;
  write(`${ROOT}/danh-muc/${cat.slug}/index.html`, page({ title: cat.name, activeKey: 'shop', main }));
}

/* ---------------- Product detail pages ---------------- */
for (const p of products) {
  const cat = categories.find(c => c.slug === p.categorySlugs[0]);
  const related = (cat ? cat.products : products).filter(x => x.slug !== p.slug).slice(0, 4);
  const spec = p.spec || {};
  const priceRows = [
    spec.ma ? `<div class="price-row"><span>Mã sản phẩm</span><strong>${esc(spec.ma)}</strong></div>` : '',
    spec.kichThuoc ? `<div class="price-row"><span>Kích thước</span><strong>${esc(spec.kichThuoc)}</strong></div>` : '',
    spec.giaSi ? `<div class="price-row"><span>Giá sỉ</span><strong>${esc(spec.giaSi)}</strong></div>` : '',
    `<div class="price-row"><span>Giá bán lẻ</span><strong>${esc(spec.giaBanLe || 'Liên hệ')}</strong></div>`,
  ].filter(Boolean).join('');

  const gallery = p.gallery.length ? p.gallery : ['/assets/images/site/logo.jpg'];

  const main = `
    ${breadcrumb([
      { name: 'Trang chủ', url: '/' },
      ...(cat ? [{ name: cat.name, url: cat.url }] : []),
      { name: p.title, url: p.url },
    ])}
    <div class="container">
      <div class="product-detail">
        <div class="gallery">
          <div class="gallery__main"><img src="${gallery[0]}" alt="${esc(p.title)}" id="mainImg"></div>
          ${gallery.length > 1 ? `<div class="gallery__thumbs">
            ${gallery.map((g, i) => `<img src="${g}" data-full="${g}" alt="${esc(p.title)} ${i + 1}" class="${i === 0 ? 'is-active' : ''}">`).join('')}
          </div>` : ''}
        </div>
        <div class="product-summary">
          <h1>${esc(p.title)}</h1>
          ${p.categories.length ? `<p class="sku">Danh mục: ${p.categories.map(c => esc(c)).join(', ')}</p>` : ''}
          <div class="price-block">${priceRows}</div>
          <div class="actions">
            <a class="btn btn-primary" href="tel:0908062685">Gọi đặt hàng ngay</a>
            <a class="btn btn-outline" href="mailto:hoatayviet.modelship@gmail.com">Yêu cầu báo giá</a>
          </div>
          <p class="meta">Miễn phí tư vấn thiết kế theo yêu cầu. Xem thêm <a href="/huong-dan-mua-hang/">hướng dẫn mua hàng</a>.</p>
        </div>
      </div>

      <div class="tabs">
        <div class="tabs__nav">
          <button class="is-active">Mô tả sản phẩm</button>
          <button>Thông tin vận chuyển</button>
        </div>
        <div class="tabs__panel is-active">
          <p>${esc(spec.raw || 'Sản phẩm mô hình thuyền mỹ nghệ được chế tác thủ công tỉ mỉ từ gỗ tự nhiên.')}</p>
        </div>
        <div class="tabs__panel">
          <p>Sản phẩm được đóng gói cẩn thận trong hộp gỗ và thùng carton, đảm bảo an toàn khi vận chuyển đi xa. Xem chi tiết tại trang <a href="/phuong-thuc-van-chuyen/">hướng dẫn sử dụng &amp; vận chuyển</a>.</p>
        </div>
      </div>

      ${related.length ? `<section>
        <h3 class="related-title">Sản phẩm liên quan</h3>
        ${productGrid(related)}
      </section>` : ''}
    </div>`;

  write(`${ROOT}/sp/${p.slug}/index.html`, page({ title: p.title, description: spec.raw, activeKey: 'shop', main }));
}

console.error('Built: 1 home, ' + totalPages + ' shop pages, ' + categories.length + ' category pages, ' + products.length + ' product pages.');
