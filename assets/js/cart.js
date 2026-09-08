/* Hoa Tay Viet — client-side cart. No backend: the cart is a localStorage
   list of {slug, qty}; product name/price/image are always looked up fresh
   from PRODUCTS (single source of truth) rather than snapshotted. Checkout
   is a "request a quote for these items" flow into the existing mailto
   contact form, matching how a single-product inquiry already works. */

const CART_KEY = "htv-cart";

function getCartItems() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("cartchange"));
}

function addToCart(slug, qty) {
  qty = qty || 1;
  const items = getCartItems();
  const existing = items.find((i) => i.slug === slug);
  if (existing) existing.qty += qty;
  else items.push({ slug, qty });
  saveCartItems(items);
}

function setCartQty(slug, qty) {
  let items = getCartItems();
  if (qty <= 0) {
    items = items.filter((i) => i.slug !== slug);
  } else {
    const existing = items.find((i) => i.slug === slug);
    if (existing) existing.qty = qty;
  }
  saveCartItems(items);
}

function removeFromCart(slug) {
  saveCartItems(getCartItems().filter((i) => i.slug !== slug));
}

function clearCart() {
  saveCartItems([]);
}

function getCartDetailed() {
  return getCartItems()
    .map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug);
      return product ? { slug: i.slug, qty: i.qty, product } : null;
    })
    .filter(Boolean);
}

function getCartCount() {
  return getCartItems().reduce((sum, i) => sum + i.qty, 0);
}

function getCartTotal() {
  return getCartDetailed().reduce((sum, i) => sum + i.qty * i.product.price, 0);
}

function cartSummaryText(lang) {
  const lines = getCartDetailed().map(
    (i) => `${i.qty} × ${i.product.name} — ${formatUsd(i.product.price * i.qty)}`
  );
  const total = `${lang === "en" ? "Total" : "Tổng cộng"}: ${formatUsd(getCartTotal())}`;
  return lines.length ? lines.join("\n") + "\n\n" + total : "";
}
