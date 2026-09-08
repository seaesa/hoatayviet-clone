import fs from "node:fs";

const CART_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="21" r="1.4" fill="currentColor"/><circle cx="18" cy="21" r="1.4" fill="currentColor"/></svg>`;

const HEADER_CART_BTN = `<button class="cart-toggle" type="button" data-cart-toggle data-i18n-aria="nav.cart" aria-label="Giỏ hàng">${CART_ICON}<span class="cart-badge" data-cart-badge data-empty="true">0</span></button>
      `;

const MOBILE_CART_BTN = `<button class="mobile-cart-link" type="button" data-cart-toggle>
    <span data-i18n="nav.cart">Giỏ hàng</span>
    <span class="cart-badge" data-cart-badge data-empty="true">0</span>
  </button>
  `;

const HEADER_MARKER = `<a class="btn btn-primary btn-sm" href="contact.html" data-i18n="nav.cta">Yêu cầu báo giá</a>`;
const MOBILE_MARKER = `<a href="index.html" data-i18n="nav.home">Trang chủ</a>`;

const files = ["index.html", "catalog.html", "about.html", "contact.html", "news.html"];
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");

  if (!s.includes(HEADER_MARKER)) throw new Error("header marker missing in " + f);
  s = s.replace(HEADER_MARKER, HEADER_CART_BTN + HEADER_MARKER);

  if (!s.includes(MOBILE_MARKER)) throw new Error("mobile marker missing in " + f);
  s = s.replace(MOBILE_MARKER, MOBILE_CART_BTN + MOBILE_MARKER);

  // load cart.js before main.js
  const scriptMarker = `<script src="assets/js/main.js"></script>`;
  if (!s.includes(scriptMarker)) throw new Error("script marker missing in " + f);
  s = s.replace(scriptMarker, `<script src="assets/js/cart.js"></script>\n<script src="assets/js/main.js"></script>`);

  fs.writeFileSync(f, s);
  console.log("Added cart UI to", f);
}
