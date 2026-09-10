# Bugs in the original that the clone reproduces

The brief was a pixel-accurate clone, so these are copied as-is rather than
fixed. Each one lists the exact change that repairs it, if you want it repaired.

---

## 1. Header icons are white on a white bar

The Flatsome theme options paint every icon in the main header bar white:

```css
.header-main .social-icons,
.header-main .cart-icon strong,
.header-main .nav > li > a > i:not(.icon-angle-down) { color: #FFFFFF !important; }
```

The main bar's background is also `#FFF`, so the **account icon, the basket
icon, and — on tablet and phone — the hamburger button are invisible**. They
are still there and still clickable; you simply cannot see them.

This matters most on mobile, where the hamburger is the only way into the menu.

**Fix** — in `site/assets/css/style.css`, change the two colours:

```css
.header-main .account-link,
.header-main .cart-glyph { color: #fff; }   /* -> var(--c-heading) */

.burger, .cart-toggle { color: #fff; }      /* -> var(--c-heading) */
```

---

## 2. Empty 25% column beside the hero, 550–849px

The hero row is `medium-3 / medium-9`, so the split holds from 550px up. But
the category menu that fills the left column lives inside `#wide-nav`, which is
`hide-for-medium` and therefore hidden below 850px.

Result: between 550px and 849px the left quarter of the hero is **blank**, and
the slider is squeezed into the remaining 75%.

**Fix** — make the hero stack below 850 instead of 550:

```css
@media (min-width: 550px) { .col-3 { … } .col-9 { … } }
/*                ^^^ change to 850px */
```

---

## 3. The hotline widget never loads its stylesheet

The page ships the `quick-call-button` markup and the theme's *overrides* for
it (`left: 3%`, `background: #1e73be`, the green pulse colours), but the
plugin's own stylesheet — which supplies `position: fixed`, the circle sizes
and the pulse keyframes — is not in the bundle.

So the widget renders as a plain line of dark 16px text, full width, below the
footer: `HotLine:  0908 062 685`. That is what you see on the live site, and
that is the clone's default.

**Fix** — add one class in `scripts/build_site.py` (`<div class="quick-call">`
→ `class="quick-call is-floating"`) and rebuild. The complete floating button —
green pulsing circles, phone glyph, blue label — is already written and waiting
under `.quick-call.is-floating`.

---

## 4. Dark body text on the dark footer

The third footer widget's first paragraph has no inline colour, so it inherits
`color: #333` and sits nearly unreadable on the `#001A38` panel. The other
paragraphs carry `<span style="color:#ffffff">`.

Reproduced via `.footer-widgets .muted`. Delete that class from the markup to
fix.

---

## 5. No webfont is loaded

The theme declares `Roboto` and `Roboto Condensed` but links no font file.
Machines without them installed fall back to Arial, which is about 22% wider —
enough to visibly break the nav row.

**This one the clone does not reproduce**: it loads both families from Google
Fonts so the intended design renders everywhere. Remove the `<link>` in
`scripts/build_site.py` if you want byte-identical behaviour.

---

## 6. Origin server returns HTTP 500

At capture time (2026-09-10) `hoatayviet.net` served **200 only for the
CDN-cached home page**. Every other URL — `/shop/`, all `/danh-muc/…`, all
`/sp/…`, `/wp-json/`, the sitemaps — returned 500 from the origin.

The home page was captured live; all 32 product pages came from the Wayback
Machine. Images were still served fine by the CDN and were downloaded live.

Pages with no available source (`Tin tức`, `Hướng dẫn`, `Tài khoản`) are
generated as stubs that say so.
