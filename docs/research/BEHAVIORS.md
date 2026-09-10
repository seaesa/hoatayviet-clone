# Behaviours — hoatayviet.net

What moves on the page, what triggers it, and the exact before/after states.
Thresholds were read out of the original Flatsome JS bundle and then confirmed
by scrolling the live DOM.

## 1. Sticky header — scroll-driven

The source (`wp-content/litespeed/js/…js`) sets two waypoints:

```js
o = -jQuery('.header-wrapper').height() - 100;          // "down" offset
r = -jQuery('.header-top.hide-for-sticky').height() - 1; // "up" offset
```

which on this page evaluates to:

| | Threshold | Measured |
|---|---|---|
| Stick | `scrollY >= headerWrapper.height + 100` | **280px** |
| Release | `scrollY <= topBar.height + 1` | **37px** |

The gap between the two is deliberate hysteresis — the header does not
re-appear until you are almost back at the top, which is what makes the entry
animation read as a "jump" rather than a flicker.

| Property | Before | After |
|---|---|---|
| `position` | `relative` | `fixed`, `top: 0` |
| `box-shadow` | none | `1px 1px 10px rgba(0,0,0,.15)` |
| `.hide-for-sticky` (top bar + main bar) | visible | `display: none` |
| `#mega_menu` | `display: block` (home) | `display: none`, `margin-top: 0` |
| `z-index` | 30 | 30 |
| Entry animation | — | `stuckMoveDown .6s` |

On sticking, the script also writes the header's measured height onto `#header`
so the page below does not jump by 135px. The clone does the same.

Verified in the clone: `0:- 200:- 279:- 281:STUCK … 38:STUCK 36:- 0:-`.

## 2. Mega menu ("DANH MỤC SẢN PHẨM") — state-dependent

Three states, all from CSS plus one click handler:

- `#mega_menu` is `display: none` by default.
- `body.home #mega_menu { display: block }` — on the **home page it is
  permanently open**, sitting in the 25%-wide slot beside the hero slider.
- Once the header sticks — or on any inner page — it collapses back to a
  dropdown that the orange title button toggles (`#mega_menu.active`).

Item styling: `padding: 7px 15px`, 15px/700, colour `#0056A8`,
`background: #f5f5f5` on hover. Sub-menus (unused here) open to the right at
`left: 100%`, `width: 209%`.

## 3. Main-nav dropdown ("HƯỚNG DẪN") — hover

| Property | Closed | Open |
|---|---|---|
| `left` | `-99999px` | `-15px` |
| `opacity` | `0` | `1` (`transition: opacity .25s`) |
| `max-height` | `0` | `inherit` |

Panel: `min-width: 260px`, `padding: 20px`, `border: 2px solid #fff`,
`box-shadow: 1px 1px 15px rgba(0,0,0,.15)`; items separated by
`1px solid #ececec`. An 8px white triangle sits above the panel and fades in
with it.

The clone uses hover on pointer devices and tap on touch (`hover: hover`
media query), with a 120ms close delay so the pointer can cross the gap.

## 4. Product card — hover

Two things happen at once on `.product-card:hover`:

1. **Image swap.** A second photo (`.img-back`) sits on top at `opacity: 0` and
   fades to `1` over `.6s`.
2. **Basket button.** `.product-tools` slides up from `translateY(100%)` to `0`
   with `opacity 0 → 1` (`.5s` opacity, `.3s` transform). It is an outlined
   square badge, `2px solid #0056A8`, `2.2em` square, with a `::after` arc
   drawing the basket handle. Hovering the badge itself fills it
   (`background #0056A8`, white text) and grows the handle from 8px to 10px.

On touch (≤549px) the badge is shown permanently, since there is no hover.

## 5. Hero slider — time-driven + drag

Flickity options from the original markup:

```json
{ "autoPlay": 6000, "wrapAround": true, "pauseAutoPlayOnHover": true,
  "prevNextButtons": true, "pageDots": true, "draggable": true,
  "dragThreshold": 5, "cellAlign": "center", "adaptiveHeight": true }
```

Four slides, each a `padding-top: 300px` box with a `background-size: cover`
image at `background-position: 45% 68%` under a `rgba(190,190,190,.2)` overlay.

- **Arrows** — `opacity: 0` and nudged 20% outward; on slider hover they ease to
  `opacity .7` and `translateX(0)`. Circle style: `36px`, `2px solid` current
  colour, white (`slider-nav-light`). Hover fills with `#0056A8`.
- **Dots** — `12px`, `3px` white border, `opacity .4`; selected is filled white
  at `opacity 1`. Positioned `bottom: 15px`, inset 20% each side.
- Hidden below 550px.

The clone reimplements this in ~70 lines: autoplay, wrap-around, pause on
hover, pointer drag with a 50px commit threshold, dots, arrows, arrow keys, and
`visibilitychange` pausing.

## 6. Back to top

`opacity 0 → 1` and `translateY(30%) → 0` once `scrollY > 300`. Fixed at
`bottom: 20px; right: 20px`; hidden below 850px.

## 7. Responsive behaviour

| | ≥850px | 550–849px | ≤549px |
|---|---|---|---|
| Top bar | phone + email left, links right | phone only, centred | phone only |
| Main bar | logo, search, account + cart | burger, centred logo, cart | same, 70px tall |
| Bottom bar (blue) | visible | `display: none` | `display: none` |
| Hero | 25% menu + 75% slider | **25% empty + 75% slider** | stacked, full width |
| Product grid | 4 columns | 2 columns | 2 columns |
| Footer | 3 × 33.3% | stacked | stacked |

Two quirks are reproduced rather than fixed — see `KNOWN_ISSUES.md`.
