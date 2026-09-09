// Shared HTML partials — used only at build time to assemble fully static pages.
// Nothing here runs in the browser; the output is plain pre-rendered HTML.

const SITE_NAME = 'Hoa Tay Việt';
const PHONE = '0908 062 685';
const PHONE_TEL = '0908062685';
const EMAIL = 'hoatayviet.modelship@gmail.com';

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
  up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>`,
};

export const CATEGORIES_NAV = [
  { name: 'Tàu Du Lịch – Du Thuyền', slug: 'tau-du-lich-du-thuyen' },
  { name: 'Tàu Chở Hàng', slug: 'tau-cho-hang' },
  { name: 'Thuyền Buồm', slug: 'thuyen-buom' },
  { name: 'Thuyền (Dùng đi dạo)', slug: 'thuyen-dung-di-dao' },
  { name: 'Du Thuyền Hiện Đại', slug: 'du-thuyen-hien-dai' },
  { name: 'Nội Thất', slug: 'noi-that' },
  { name: 'Sản Phẩm Khác', slug: 'san-pham-khac' },
];

const MAIN_MENU = [
  { name: 'TRANG CHỦ', url: '/', key: 'home' },
  { name: 'GIỚI THIỆU', url: '/gioi-thieu/', key: 'about' },
  { name: 'SẢN PHẨM', url: '/shop/', key: 'shop' },
  { name: 'TIN TỨC', url: '/category/chua-duoc-phan-loai/', key: 'news' },
  { name: 'LIÊN HỆ', url: '/lien-he/', key: 'contact' },
  { name: 'HƯỚNG DẪN', url: '/huong-dan/', key: 'guide', children: [
    { name: 'Hướng Dẫn Sử Dụng', url: '/phuong-thuc-van-chuyen/' },
    { name: 'Hướng dẫn mua hàng', url: '/huong-dan-mua-hang/' },
  ]},
];

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

export function head({ title, description }) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} - Xưởng Sản Xuất Thuyền Mỹ Nghệ Hoa Tay Việt</title>
<meta name="description" content="${esc(description || 'Xưởng sản xuất thuyền mô hình mỹ nghệ Hoa Tay Việt - chuyên chế tác tàu, thuyền, du thuyền mô hình bằng gỗ thủ công.')}">
<link rel="icon" href="/assets/images/site/cropped-logo-32x32.jpg" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/images/site/cropped-logo-180x180.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">`;
}

function navItem(item, activeKey) {
  const active = item.key === activeKey;
  if (item.children) {
    return `<li class="${active ? 'is-open' : ''}">
      <a href="${item.url}">${item.name} <span class="caret">▾</span></a>
      <ul class="dropdown">
        ${item.children.map(c => `<li><a href="${c.url}">${esc(c.name)}</a></li>`).join('')}
      </ul>
    </li>`;
  }
  return `<li><a href="${item.url}"${active ? ' style="background:rgba(255,255,255,.14)"' : ''}>${esc(item.name)}</a></li>`;
}

export function header(activeKey) {
  return `<header class="site-header">
  <a class="skip-link" href="#main">Bỏ qua đến nội dung</a>
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__left">
        <a href="tel:${PHONE_TEL}">${ICONS.phone} ${PHONE}</a>
        <a href="mailto:${EMAIL}">${ICONS.mail} ${EMAIL}</a>
      </div>
      <div class="top-bar__right">
        <a href="/huong-dan-mua-hang/">Hướng dẫn mua hàng</a>
      </div>
    </div>
  </div>

  <div class="header-main">
    <div class="container">
      <a class="logo" href="/">
        <img src="/assets/images/site/logo.jpg" alt="${SITE_NAME}" width="58" height="58">
        <span class="logo__text"><strong>HOA TAY VIỆT</strong><span>Xưởng thuyền mỹ nghệ</span></span>
      </a>

      <div class="header-search">
        <form action="/shop/" method="get" role="search">
          <select name="category" aria-label="Chọn danh mục">
            <option>Tất cả</option>
            ${CATEGORIES_NAV.map(c => `<option value="${c.slug}">${esc(c.name)}</option>`).join('')}
          </select>
          <input type="search" name="s" placeholder="Tìm kiếm sản phẩm">
          <button type="submit" aria-label="Tìm kiếm">🔍</button>
        </form>
      </div>

      <div class="header-actions">
        <a class="header-cart" href="/gio-hang/">${ICONS.cart}<span>Giỏ hàng</span><span class="header-cart__count">0</span></a>
        <a class="header-phone" href="tel:${PHONE_TEL}">${ICONS.phone}<span>${PHONE}</span></a>
        <button class="menu-toggle" aria-label="Mở menu" aria-expanded="false">${ICONS.menu}</button>
      </div>
    </div>
  </div>

  <nav class="header-bottom" aria-label="Danh mục và menu chính">
    <div class="container">
      <div class="cat-panel-wrap">
        <button class="cat-toggle">${ICONS.menu} Danh mục sản phẩm</button>
        <div class="cat-panel">
          ${CATEGORIES_NAV.map(c => `<a href="/danh-muc/${c.slug}/">${esc(c.name)} <span>›</span></a>`).join('')}
        </div>
      </div>
      <ul class="main-nav">
        ${MAIN_MENU.map(i => navItem(i, activeKey)).join('')}
      </ul>
      <a class="nav-phone" href="tel:${PHONE_TEL}">${ICONS.phone} ${PHONE}</a>
    </div>
  </nav>
</header>`;
}

export function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col footer-contact">
      <h3>Thông tin liên hệ</h3>
      <ul>
        <li>${ICONS.box}<span><strong>CÔNG TY TNHH HOA TAY VIỆT</strong></span></li>
        <li>${ICONS.pin}<span>199 ấp 1B, Phước Thái, Long Thành, Đồng Nai</span></li>
        <li>${ICONS.phone}<a href="tel:${PHONE_TEL}">${PHONE}</a></li>
        <li>${ICONS.phone}<span>84 35234 4343 – Contact (Ms Tram)</span></li>
        <li>${ICONS.mail}<a href="mailto:${EMAIL}">${EMAIL}</a></li>
        <li>${ICONS.mail}<a href="mailto:lywoodenmodelboat@gmail.com">lywoodenmodelboat@gmail.com</a></li>
      </ul>
    </div>
    <div class="footer-col footer-map">
      <h3>Google Map</h3>
      <div class="map-embed" style="border:none;">
        <iframe title="Bản đồ Hoa Tay Việt" loading="lazy" src="https://www.google.com/maps?q=199+%E1%BA%A5p+1B,+Ph%C6%B0%E1%BB%9Bc+Th%C3%A1i,+Long+Th%C3%A0nh,+%C4%90%E1%BB%93ng+Nai&output=embed"></iframe>
      </div>
    </div>
    <div class="footer-col">
      <h3>Giới thiệu</h3>
      <p>Chào mừng quý khách đến với đại gia đình HOA TAY VIỆT.</p>
      <p>Công ty chúng tôi chuyên xuất khẩu ngành hàng thủ công mỹ nghệ, có bề dày kinh nghiệm trong ngành thủ công làm bằng tay.</p>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>Copyright ${new Date().getFullYear()} © Hoa Tay Việt</span>
      <span>Thiết kế lại — bản tĩnh HTML/CSS/JS</span>
    </div>
  </div>
</footer>
<button class="back-to-top" aria-label="Lên đầu trang">${ICONS.up}</button>
<div class="mobile-call-bar"><a href="tel:${PHONE_TEL}" style="color:inherit;display:flex;align-items:center;gap:8px;">${ICONS.phone} HotLine: ${PHONE}</a></div>
<script src="/assets/js/main.js"></script>`;
}

export function breadcrumb(items) {
  return `<div class="breadcrumb"><div class="container">
    ${items.map((it, i) => i < items.length - 1
      ? `<a href="${it.url}">${esc(it.name)}</a><span class="sep">/</span>`
      : `<span>${esc(it.name)}</span>`).join('')}
  </div></div>`;
}

export function ribbonSection(title, links = []) {
  return `<div class="section-head">
    <h2 class="ribbon">${esc(title)}</h2>
    <div class="section-head__links">${links.map(l => `<a href="${l.url}">${esc(l.name)}</a>`).join('')}</div>
  </div>`;
}

export function productCard(p) {
  return `<div class="product-card">
    <a class="product-card__img" href="${p.url}">
      <img src="${p.thumb}" alt="${esc(p.title)}" loading="lazy">
      <span class="product-card__quick"><span>+</span></span>
    </a>
    <div class="product-card__body">
      <a class="product-card__title" href="${p.url}">${esc(p.title)}</a>
    </div>
  </div>`;
}

export function productGrid(products) {
  return `<div class="product-grid">${products.map(productCard).join('')}</div>`;
}

export function categorySidebar(activeSlug) {
  return `<div class="sidebar-widget">
    <p class="sidebar-widget__title">Danh mục sản phẩm</p>
    <ul>
      ${CATEGORIES_NAV.map(c => `<li><a class="${c.slug === activeSlug ? 'is-active' : ''}" href="/danh-muc/${c.slug}/">${esc(c.name)}</a></li>`).join('')}
    </ul>
  </div>`;
}

export function page({ title, description, activeKey, bodyClass = '', main }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
${head({ title, description })}
</head>
<body class="${bodyClass}">
${header(activeKey)}
<main id="main">
${main}
</main>
${footer()}
</body>
</html>`;
}
