/* Hoa Tay Viet — behavior only. All product/category/nav markup already exists
   in the page HTML (see scripts/generate-static-markup.mjs) — this file never
   builds or injects listing content, it only reacts to clicks/typing/scroll
   and toggles visibility or text on nodes that are already in the DOM. */

(function mobileNav() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  const scrim = document.querySelector("[data-scrim]");
  const close = document.querySelector("[data-mobile-close]");
  if (!toggle || !nav) return;
  const open = () => { nav.classList.add("open"); scrim.classList.add("open"); };
  const shut = () => { nav.classList.remove("open"); scrim.classList.remove("open"); };
  toggle.addEventListener("click", open);
  close?.addEventListener("click", shut);
  scrim?.addEventListener("click", shut);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", shut));
})();

(function headerSearchToggle() {
  document.querySelectorAll("[data-header-search]").forEach((wrap) => {
    const toggle = wrap.querySelector("[data-search-toggle]");
    const input = wrap.querySelector("input[name=q]");
    toggle?.addEventListener("click", () => {
      wrap.classList.toggle("open");
      if (wrap.classList.contains("open")) input?.focus();
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove("open");
    });
  });
})();

(function activeNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });
})();

/* ---------- category & product labels follow the language toggle ---------- */
function relabelCategoriesAndProducts() {
  const lang = getLang();
  document.querySelectorAll("[data-cat-name]").forEach((el) => {
    const c = CATEGORIES.find((c) => c.slug === el.getAttribute("data-cat-name"));
    if (c) el.textContent = c.name[lang];
  });
  document.querySelectorAll("[data-cat-blurb]").forEach((el) => {
    const c = CATEGORIES.find((c) => c.slug === el.getAttribute("data-cat-blurb"));
    if (c) el.textContent = c.blurb[lang];
  });
  document.querySelectorAll("[data-cat-label]").forEach((el) => {
    const c = CATEGORIES.find((c) => c.slug === el.getAttribute("data-cat-label"));
    if (c) el.textContent = c.name[lang];
  });
  document.querySelectorAll("[data-cat-chip-name]").forEach((el) => {
    const c = CATEGORIES.find((c) => c.slug === el.getAttribute("data-cat-chip-name"));
    if (c) el.textContent = c.name[lang];
  });
}

/* ---------- catalog filtering: shows/hides existing static cards ---------- */
function initCatalogFilter() {
  const grid = document.querySelector("[data-catalog-grid]");
  const chipBar = document.querySelector("[data-filter-chips]");
  if (!grid || !chipBar) return;

  const cards = [...grid.querySelectorAll(".product-card")];
  const countEl = document.querySelector("[data-catalog-count]");
  const emptyEl = document.querySelector("[data-catalog-empty]");
  const params = new URLSearchParams(location.search);
  let active = params.get("cat") || "all";
  let query = (params.get("q") || "").trim().toLowerCase();

  function apply() {
    let visible = 0;
    cards.forEach((card) => {
      const cats = (card.getAttribute("data-cat") || "").split(" ");
      const matchesCat = active === "all" || cats.includes(active);
      const matchesQuery = !query || card.querySelector(".product-name").textContent.toLowerCase().includes(query);
      const show = matchesCat && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    if (countEl) countEl.textContent = visible;
    if (emptyEl) emptyEl.style.display = visible ? "none" : "block";
    chipBar.querySelectorAll(".chip").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-cat") === active);
    });
  }

  chipBar.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      active = btn.getAttribute("data-cat");
      query = ""; // picking a category starts a fresh browse, clearing any prior search
      const searchInput = document.querySelector('input[name=q]');
      if (searchInput) searchInput.value = "";
      const url = new URL(location.href);
      if (active === "all") url.searchParams.delete("cat");
      else url.searchParams.set("cat", active);
      url.searchParams.delete("q");
      history.replaceState(null, "", url);
      apply();
    });
  });

  apply();
}

/* ---------- header search: filters the catalog grid if present, else redirects ---------- */
function initSearch() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const input = form.querySelector("[name=q]");
      const grid = document.querySelector("[data-catalog-grid]");
      if (grid) {
        e.preventDefault();
        const url = new URL(location.href);
        if (input.value.trim()) url.searchParams.set("q", input.value.trim());
        else url.searchParams.delete("q");
        history.replaceState(null, "", url);
        initCatalogFilter();
      }
      // else: let the form submit normally to catalog.html?q=...
    });
  });
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if (q) document.querySelectorAll("[name=q]").forEach((i) => (i.value = q));
}

/* ---------- product modal: supplementary detail, base info already visible in the card ---------- */
function ensureModal() {
  let backdrop = document.querySelector("[data-modal-backdrop]");
  if (backdrop) return backdrop;
  backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.setAttribute("data-modal-backdrop", "");
  backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true">
    <button class="modal-close" data-modal-close aria-label="Close">&times;</button>
    <div class="modal-photo"><img data-modal-img alt=""></div>
    <div class="modal-body">
      <span class="modal-cat" data-modal-cat></span>
      <h3 data-modal-name></h3>
      <p data-modal-desc></p>
      <div class="modal-specs" data-modal-specs></div>
      <div class="modal-price-row">
        <span class="modal-price" data-modal-price></span>
        <span class="modal-price-vnd" data-modal-price-vnd></span>
        <p class="form-note" data-modal-note></p>
        <a class="btn btn-primary" data-modal-cta href="#"></a>
      </div>
    </div>
  </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  backdrop.querySelector("[data-modal-close]").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  return backdrop;
}

function closeModal() {
  const backdrop = document.querySelector("[data-modal-backdrop]");
  backdrop?.classList.remove("open");
  document.body.style.overflow = "";
}

function openProductModal(slug) {
  const p = PRODUCTS.find((p) => p.slug === slug);
  if (!p) return;
  const lang = getLang();
  const backdrop = ensureModal();
  backdrop.querySelector("[data-modal-img]").src = p.image;
  backdrop.querySelector("[data-modal-img]").alt = p.name;
  backdrop.querySelector("[data-modal-cat]").textContent = p.categories.map((s) => CATEGORIES.find((c) => c.slug === s)?.name[lang]).filter(Boolean).join(" / ");
  backdrop.querySelector("[data-modal-name]").textContent = p.name;
  backdrop.querySelector("[data-modal-desc]").textContent = p.desc[lang];
  backdrop.querySelector("[data-modal-price]").textContent = formatUsd(p.price);
  backdrop.querySelector("[data-modal-price-vnd]").textContent = formatVnd(p.price);
  backdrop.querySelector("[data-modal-note]").textContent = t("catalog.priceNote", lang);

  const specs = p.spec.size
    ? [["", p.spec.size]]
    : [
        [lang === "en" ? "Length" : "Chiều dài", p.spec.length],
        [lang === "en" ? "Scale" : "Tỉ lệ", p.spec.scale],
      ];
  specs.push([t("catalog.material", lang), t("catalog.materialValue", lang)]);
  backdrop.querySelector("[data-modal-specs]").innerHTML = specs
    .map(([label, val]) => `<div class="modal-spec-item">${label ? `<span>${label}</span>` : ""}<b>${val}</b></div>`)
    .join("");

  const cta = backdrop.querySelector("[data-modal-cta]");
  cta.textContent = t("catalog.quote", lang);
  cta.href = `contact.html?product=${encodeURIComponent(p.name)}`;

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function wireProductCards() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const open = () => openProductModal(card.getAttribute("data-slug"));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
  });
}

/* ---------- contact form (mailto — no backend) ---------- */
function wireContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const params = new URLSearchParams(location.search);
  const productField = form.querySelector("[name=product]");
  const preset = params.get("product");
  if (preset && productField) {
    const opt = [...productField.options].find((o) => o.value === preset);
    if (opt) opt.selected = true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lang = getLang();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const product = form.product.value;
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`[Hoa Tay Viet] ${lang === "en" ? "Quote request" : "Yêu cầu báo giá"} — ${product}`);
    const bodyLines = [
      `${lang === "en" ? "Name" : "Họ tên"}: ${name}`,
      `Email: ${email}`,
      `${lang === "en" ? "Product" : "Sản phẩm"}: ${product}`,
      "",
      message,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:hoatayviet.modelship@gmail.com?subject=${subject}&body=${body}`;
    const success = document.querySelector("[data-form-success]");
    if (success) success.classList.add("show");
  });
}

/* The product <option> list itself is static markup already in contact.html
   (see scripts/out/product-options.html) — this only pre-selects one from a
   query param and relabels the placeholder option for the current language. */
function initProductSelect() {
  const select = document.querySelector("[name=product]");
  if (!select) return;
  const anyOpt = select.querySelector('option[value=""]');
  if (anyOpt) anyOpt.textContent = t("contact.formProductAny", getLang());
  const params = new URLSearchParams(location.search);
  const preset = params.get("product");
  if (preset) select.value = preset;
}

document.addEventListener("DOMContentLoaded", () => {
  // Same rule as i18n.js: the static markup already reads correctly in
  // Vietnamese, so these two relabeling passes only run once the visitor
  // has actually switched to English — never on a plain default load.
  if (getLang() === "en") {
    relabelCategoriesAndProducts();
    initProductSelect();
  }
  initCatalogFilter();
  initSearch();
  wireProductCards();
  wireContactForm();

  document.addEventListener("langchange", () => {
    relabelCategoriesAndProducts();
    initProductSelect();
  });

  document.querySelectorAll("[data-blueprint]").forEach((el) => { el.innerHTML = BLUEPRINT_SVG; });
});
