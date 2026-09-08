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
        <div class="cart-qty" data-modal-qty>
          <button type="button" data-qty-down aria-label="-">${ICONS.minus}</button>
          <span data-qty-value>1</span>
          <button type="button" data-qty-up aria-label="+">${ICONS.plus}</button>
        </div>
        <div class="modal-cta-row">
          <button class="btn btn-primary" type="button" data-modal-add-cart></button>
          <a class="btn btn-outline" data-modal-cta href="#"></a>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  backdrop.querySelector("[data-modal-close]").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  let qty = 1;
  const qtyValue = backdrop.querySelector("[data-qty-value]");
  backdrop.querySelector("[data-qty-down]").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  backdrop.querySelector("[data-qty-up]").addEventListener("click", () => {
    qty = qty + 1;
    qtyValue.textContent = qty;
  });
  backdrop.querySelector("[data-modal-add-cart]").addEventListener("click", () => {
    const slug = backdrop.getAttribute("data-current-slug");
    if (!slug) return;
    addToCart(slug, qty);
    flashAdded(backdrop.querySelector("[data-modal-add-cart]"));
    qty = 1;
    qtyValue.textContent = qty;
  });
  return backdrop;
}

function flashAdded(btn) {
  btn.classList.add("added");
  if (btn.classList.contains("quick-add")) {
    // Icon-only button: swap the icon itself, don't touch layout with text.
    const original = btn.innerHTML;
    btn.innerHTML = ICONS.check;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.classList.remove("added");
    }, 900);
  } else {
    const original = btn.textContent;
    btn.textContent = t("cart.added", getLang());
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("added");
    }, 1200);
  }
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

  backdrop.setAttribute("data-current-slug", p.slug);
  backdrop.querySelector("[data-qty-value]").textContent = "1";
  backdrop.querySelector("[data-modal-add-cart]").textContent = t("cart.addToCart", lang);

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
    const cartItems = getCartDetailed();
    const subjectLabel = cartItems.length
      ? (lang === "en" ? "Cart quote request" : "Yêu cầu báo giá giỏ hàng")
      : `${lang === "en" ? "Quote request" : "Yêu cầu báo giá"}${product ? " — " + product : ""}`;
    const subject = encodeURIComponent(`[Hoa Tay Viet] ${subjectLabel}`);
    const bodyLines = [
      `${lang === "en" ? "Name" : "Họ tên"}: ${name}`,
      `Email: ${email}`,
    ];
    if (product) bodyLines.push(`${lang === "en" ? "Product" : "Sản phẩm"}: ${product}`);
    bodyLines.push("", message);
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

/* ---------- cart: header badge (all pages) ---------- */
function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-badge]").forEach((el) => {
    el.textContent = count;
    el.setAttribute("data-empty", count === 0 ? "true" : "false");
  });
}

/* ---------- cart: quick-add button on every product card ---------- */
function wireQuickAdd() {
  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.getAttribute("data-add-to-cart"), 1);
      flashAdded(btn);
    });
  });
}

/* ---------- cart: slide-out drawer, built once on first open ---------- */
function ensureCartDrawer() {
  let backdrop = document.querySelector("[data-cart-drawer-backdrop]");
  if (backdrop) return backdrop;
  backdrop = document.createElement("div");
  backdrop.className = "cart-drawer-backdrop";
  backdrop.setAttribute("data-cart-drawer-backdrop", "");
  backdrop.innerHTML = `<div class="cart-drawer" role="dialog" aria-modal="true">
    <div class="cart-drawer-head">
      <h3 data-i18n="cart.title">Giỏ hàng</h3>
      <button class="cart-drawer-close" type="button" data-cart-close aria-label="Close">&times;</button>
    </div>
    <div class="cart-drawer-body" data-cart-body></div>
    <div class="cart-drawer-foot" data-cart-foot></div>
  </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeCartDrawer(); });
  backdrop.querySelector("[data-cart-close]").addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCartDrawer(); });
  return backdrop;
}

function closeCartDrawer() {
  document.querySelector("[data-cart-drawer-backdrop]")?.classList.remove("open");
  document.body.style.overflow = "";
}

function renderCartDrawer() {
  const backdrop = document.querySelector("[data-cart-drawer-backdrop]");
  if (!backdrop) return;
  const lang = getLang();
  backdrop.querySelector("[data-i18n='cart.title']").textContent = t("cart.title", lang);
  const items = getCartDetailed();
  const body = backdrop.querySelector("[data-cart-body]");
  const foot = backdrop.querySelector("[data-cart-foot]");

  if (!items.length) {
    body.innerHTML = `<p class="cart-empty">${t("cart.empty", lang)}</p>`;
    foot.innerHTML = "";
    return;
  }

  body.innerHTML = items
    .map(
      (i) => `<div class="cart-line" data-cart-line="${i.slug}">
        <img src="${i.product.image}" alt="${i.product.name}">
        <div>
          <div class="cart-line-name">${i.product.name}</div>
          <div class="cart-line-price">${formatUsd(i.product.price)}</div>
          <div class="cart-qty">
            <button type="button" data-cart-down="${i.slug}" aria-label="-">${ICONS.minus}</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-up="${i.slug}" aria-label="+">${ICONS.plus}</button>
          </div>
        </div>
        <button class="cart-line-remove" type="button" data-cart-remove="${i.slug}" aria-label="Remove">${ICONS.trash}</button>
      </div>`
    )
    .join("");

  foot.innerHTML = `<div class="cart-subtotal-row"><span>${t("cart.subtotal", lang)}</span><b>${formatUsd(getCartTotal())}</b></div>
    <a class="btn btn-primary" href="contact.html?cart=1">${t("cart.checkout", lang)}</a>
    <button class="cart-clear" type="button" data-cart-clear-drawer>${t("cart.clear", lang)}</button>`;

  body.querySelectorAll("[data-cart-down]").forEach((b) =>
    b.addEventListener("click", () => {
      const slug = b.getAttribute("data-cart-down");
      const item = getCartDetailed().find((i) => i.slug === slug);
      if (item) setCartQty(slug, item.qty - 1);
    })
  );
  body.querySelectorAll("[data-cart-up]").forEach((b) =>
    b.addEventListener("click", () => {
      const slug = b.getAttribute("data-cart-up");
      const item = getCartDetailed().find((i) => i.slug === slug);
      if (item) setCartQty(slug, item.qty + 1);
    })
  );
  body.querySelectorAll("[data-cart-remove]").forEach((b) =>
    b.addEventListener("click", () => removeFromCart(b.getAttribute("data-cart-remove")))
  );
  foot.querySelector("[data-cart-clear-drawer]")?.addEventListener("click", clearCart);
}

function openCartDrawer() {
  const backdrop = ensureCartDrawer();
  renderCartDrawer();
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function wireCartToggles() {
  document.querySelectorAll("[data-cart-toggle]").forEach((btn) => {
    btn.addEventListener("click", openCartDrawer);
  });
}

/* ---------- cart: summary block on the contact page ---------- */
function initCartSummary() {
  const box = document.querySelector("[data-cart-summary]");
  if (!box) return;

  function render() {
    const lang = getLang();
    const items = getCartDetailed();
    if (!items.length) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    box.querySelector("[data-cart-summary-lines]").innerHTML = items
      .map((i) => `<div class="cart-summary-line"><span>${i.qty} × ${i.product.name}</span><b>${formatUsd(i.qty * i.product.price)}</b></div>`)
      .join("");
    box.querySelector("[data-cart-summary-total]").textContent = formatUsd(getCartTotal());

    const message = document.querySelector("[name=message]");
    if (message && !message.value.trim()) message.value = cartSummaryText(lang);
  }

  box.querySelector("[data-cart-clear]")?.addEventListener("click", () => {
    clearCart();
    const message = document.querySelector("[name=message]");
    if (message && message.value.trim() === cartSummaryText(getLang())) message.value = "";
  });

  render();
  document.addEventListener("cartchange", render);
  document.addEventListener("langchange", render);
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
  wireQuickAdd();
  wireCartToggles();
  initCartSummary();
  updateCartBadges();

  document.addEventListener("cartchange", () => {
    updateCartBadges();
    renderCartDrawer();
  });

  document.addEventListener("langchange", () => {
    relabelCategoriesAndProducts();
    initProductSelect();
  });

  document.querySelectorAll("[data-blueprint]").forEach((el) => { el.innerHTML = BLUEPRINT_SVG; });
});
