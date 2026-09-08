// Generates static HTML fragments (category grid, featured grid, catalog grid,
// filter chips) from assets/js/{icons,data}.js so the pages ship real markup —
// JS is only used for behavior (filtering, modal, nav, i18n text-swap), never
// to construct the product/category listings themselves.
import fs from "node:fs";
import vm from "node:vm";

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/icons.js", "utf8"), sandbox);
vm.runInContext(fs.readFileSync("assets/js/data.js", "utf8"), sandbox);
// `const`/`let` top-level bindings don't attach to the sandbox object itself,
// so pull each value back out via a follow-up expression in the same context.
const ICONS = vm.runInContext("ICONS", sandbox);
const CATEGORIES = vm.runInContext("CATEGORIES", sandbox);
const PRODUCTS = vm.runInContext("PRODUCTS", sandbox);
const formatUsd = vm.runInContext("formatUsd", sandbox);
const formatVnd = vm.runInContext("formatVnd", sandbox);

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function specLine(p) {
  return p.spec.size ? p.spec.size : `${p.spec.length} · ${p.spec.scale}`;
}

function categoryNames(catSlugs, lang) {
  return catSlugs
    .map((s) => CATEGORIES.find((c) => c.slug === s)?.name[lang])
    .filter(Boolean)
    .join(" / ");
}

function productCard(p) {
  return `      <article class="product-card" data-slug="${p.slug}" data-cat="${p.categories.join(" ")}" tabindex="0" role="button" aria-haspopup="dialog">
        <div class="product-photo">
          <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="400" height="300">
          <button class="quick-add" type="button" data-add-to-cart="${p.slug}" data-i18n-aria="cart.addToCart" aria-label="Thêm vào giỏ">${ICONS.plus}</button>
        </div>
        <div class="product-body">
          <span class="product-cat" data-cat-label="${p.categories[0]}">${esc(categoryNames([p.categories[0]], "vi"))}</span>
          <span class="product-name">${esc(p.name)}</span>
          <span class="product-spec mono">${specLine(p)}</span>
          <div class="product-foot">
            <span class="product-price mono">${formatUsd(p.price)}</span>
            <span class="product-view" data-i18n="catalog.viewDetail">Xem chi tiết</span>
          </div>
        </div>
      </article>`;
}

function categoryCard(c) {
  const count = PRODUCTS.filter((p) => p.categories.includes(c.slug)).length;
  return `      <a class="cat-card" href="catalog.html?cat=${c.slug}">
        <span class="cat-icon">${ICONS[c.icon]}</span>
        <h3 data-cat-name="${c.slug}">${esc(c.name.vi)}</h3>
        <p data-cat-blurb="${c.slug}">${esc(c.blurb.vi)}</p>
        <span class="cat-count"><span data-cat-count="${c.slug}">${count}</span> <span data-i18n="cats.count">mẫu</span></span>
      </a>`;
}

function filterChip(slug, labelVi) {
  const i18nAttr = slug === "all" ? ` data-i18n="catalog.filter.all"` : ` data-cat-chip-name="${slug}"`;
  return `    <button class="chip${slug === "all" ? " active" : ""}" data-cat="${slug}"${i18nAttr}>${esc(labelVi)}</button>`;
}

const FEATURED_SLUGS = ["victory", "asuka-ii", "batavia", "hull-bar-counter", "wasa", "lagoon-450", "christian-radich", "mississippi"];

const categoryGridHtml = CATEGORIES.map(categoryCard).join("\n");
const featuredGridHtml = FEATURED_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean).map(productCard).join("\n");
const catalogGridHtml = PRODUCTS.map(productCard).join("\n");
const filterChipsHtml = [filterChip("all", "Tất cả")].concat(CATEGORIES.map((c) => filterChip(c.slug, c.name.vi))).join("\n");

const productOptionsHtml = PRODUCTS.map((p) => `        <option value="${esc(p.name)}">${esc(p.name)}</option>`).join("\n");

fs.mkdirSync("scripts/out", { recursive: true });
fs.writeFileSync("scripts/out/category-grid.html", categoryGridHtml);
fs.writeFileSync("scripts/out/featured-grid.html", featuredGridHtml);
fs.writeFileSync("scripts/out/catalog-grid.html", catalogGridHtml);
fs.writeFileSync("scripts/out/filter-chips.html", filterChipsHtml);
fs.writeFileSync("scripts/out/product-options.html", productOptionsHtml);
console.log("Generated:", CATEGORIES.length, "categories,", PRODUCTS.length, "products,", FEATURED_SLUGS.length, "featured");
