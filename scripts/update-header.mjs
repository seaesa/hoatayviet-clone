import fs from "node:fs";

const OLD = `<div class="topbar">
  <div class="container">
    <div class="topbar-left">
      <a href="tel:+84908062685">0908 062 685</a>
      <span>hoatayviet.modelship@gmail.com</span>
    </div>
    <div class="topbar-right">
      <a href="contact.html" data-i18n="top.guide">Hướng dẫn đặt hàng</a>
      <button class="lang-btn" data-lang-toggle type="button">EN</button>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="container header-main">
    <a class="brand" href="index.html">
      <span class="brand-mark" style="color:var(--teak)">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 27h28l-3 6H9l-3-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M20 27V8" stroke="currentColor" stroke-width="1.6"/>
          <path d="M20 10c5 1 8 4 9 8h-9v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M20 13c-3.5 1-6 3.5-7 6h7v-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="brand-name">Hoa Tay Việt<small>MODEL SHIP WORKSHOP</small></span>
    </a>
    <nav class="main-nav">
      <a href="index.html" data-nav-link data-i18n="nav.home">Trang chủ</a>
      <a href="about.html" data-nav-link data-i18n="nav.about">Giới thiệu</a>
      <a href="catalog.html" data-nav-link data-i18n="nav.catalog">Sản phẩm</a>
      <a href="contact.html" data-nav-link data-i18n="nav.contact">Liên hệ</a>
    </nav>
    <div class="header-actions">
      <a class="btn btn-primary btn-sm" href="contact.html" data-i18n="nav.cta">Yêu cầu báo giá</a>
      <button class="menu-toggle" data-menu-toggle aria-label="Mở menu" type="button"><span></span></button>
    </div>
  </div>
</header>
<div class="scrim" data-scrim></div>
<nav class="mobile-nav" data-mobile-nav>
  <button class="mobile-nav-close" data-mobile-close aria-label="Đóng" type="button">&times;</button>
  <a href="index.html" data-i18n="nav.home">Trang chủ</a>
  <a href="about.html" data-i18n="nav.about">Giới thiệu</a>
  <a href="catalog.html" data-i18n="nav.catalog">Sản phẩm</a>
  <a href="contact.html" data-i18n="nav.contact">Liên hệ</a>
</nav>`;

const SEARCH_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="m19.5 19.5-4.2-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

const NEW = `<div class="topbar">
  <div class="container">
    <div class="topbar-left">
      <a href="tel:+84908062685">0908 062 685</a>
      <span>hoatayviet.modelship@gmail.com</span>
    </div>
    <div class="topbar-right">
      <a href="contact.html#ordering" data-i18n="top.guide">Hướng dẫn đặt hàng</a>
      <button class="lang-btn" data-lang-toggle type="button">EN</button>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="container header-main">
    <a class="brand" href="index.html">
      <span class="brand-mark" style="color:var(--teak)">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 27h28l-3 6H9l-3-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M20 27V8" stroke="currentColor" stroke-width="1.6"/>
          <path d="M20 10c5 1 8 4 9 8h-9v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M20 13c-3.5 1-6 3.5-7 6h7v-6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="brand-name">Hoa Tay Việt<small>MODEL SHIP WORKSHOP</small></span>
    </a>
    <nav class="main-nav">
      <a href="index.html" data-nav-link data-i18n="nav.home">Trang chủ</a>
      <a href="about.html" data-nav-link data-i18n="nav.about">Giới thiệu</a>
      <a href="catalog.html" data-nav-link data-i18n="nav.catalog">Sản phẩm</a>
      <a href="news.html" data-nav-link data-i18n="nav.news">Tin tức</a>
      <a href="contact.html" data-nav-link data-i18n="nav.contact">Liên hệ</a>
      <div class="nav-item">
        <button class="nav-trigger" type="button" data-i18n="nav.guide">Hướng dẫn<svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.4"/></svg></button>
        <div class="nav-dropdown">
          <a href="contact.html#care" data-i18n="nav.guide.care">Hướng Dẫn Sử Dụng</a>
          <a href="contact.html#ordering" data-i18n="nav.guide.order">Hướng dẫn mua hàng</a>
        </div>
      </div>
    </nav>
    <div class="header-actions">
      <div class="header-search" data-header-search>
        <button class="search-toggle" type="button" data-search-toggle data-i18n-aria="search.label" aria-label="Tìm kiếm">${SEARCH_ICON}</button>
        <form class="search-panel" data-search-form action="catalog.html" method="get">
          <input type="search" name="q" data-i18n-placeholder="search.placeholder" placeholder="Tìm kiếm sản phẩm...">
          <button type="submit" data-i18n-aria="search.label" aria-label="Tìm kiếm">${SEARCH_ICON}</button>
        </form>
      </div>
      <a class="btn btn-primary btn-sm" href="contact.html" data-i18n="nav.cta">Yêu cầu báo giá</a>
      <button class="menu-toggle" data-menu-toggle aria-label="Mở menu" type="button"><span></span></button>
    </div>
  </div>
</header>
<div class="scrim" data-scrim></div>
<nav class="mobile-nav" data-mobile-nav>
  <button class="mobile-nav-close" data-mobile-close aria-label="Đóng" type="button">&times;</button>
  <div class="mobile-search">
    <form class="mobile-search-row" data-search-form action="catalog.html" method="get">
      <input type="search" name="q" data-i18n-placeholder="search.placeholder" placeholder="Tìm kiếm sản phẩm...">
      <button type="submit" data-i18n-aria="search.label" aria-label="Tìm kiếm">${SEARCH_ICON}</button>
    </form>
  </div>
  <a href="index.html" data-i18n="nav.home">Trang chủ</a>
  <a href="about.html" data-i18n="nav.about">Giới thiệu</a>
  <a href="catalog.html" data-i18n="nav.catalog">Sản phẩm</a>
  <a href="news.html" data-i18n="nav.news">Tin tức</a>
  <a href="contact.html" data-i18n="nav.contact">Liên hệ</a>
  <div class="mobile-nav-guides">
    <span data-i18n="nav.guide">Hướng dẫn</span>
    <a href="contact.html#care" data-i18n="nav.guide.care">Hướng Dẫn Sử Dụng</a>
    <a href="contact.html#ordering" data-i18n="nav.guide.order">Hướng dẫn mua hàng</a>
  </div>
</nav>`;

const FLOATING_CALL = `<a class="floating-call" href="tel:+84908062685" aria-label="Gọi 0908 062 685">
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h3l2 5-2.5 2A11 11 0 0 0 14 15.5l2-2.5 5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2Z"/></svg>
</a>`;

const files = ["index.html", "catalog.html", "about.html", "contact.html"];
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  if (!s.includes(OLD)) {
    console.error("HEADER MISMATCH in", f);
    continue;
  }
  s = s.replace(OLD, NEW);
  // Insert floating call button just before the closing </body>, after the script tags is fine too.
  s = s.replace("</body>", `${FLOATING_CALL}\n</body>`);
  fs.writeFileSync(f, s);
  console.log("Updated header + floating call in", f);
}
