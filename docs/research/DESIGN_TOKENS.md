# Design tokens — hoatayviet.net

Every value below was read out of the live site: either from the theme's
generated CSS block (Flatsome writes its theme-options into the tail of
`wp-content/litespeed/css/…css`) or from `getComputedStyle()` on the rendered
page at a 1440px viewport.

## Colour

| Token | Value | Where it is used |
|---|---|---|
| `--c-primary` | `#0056A8` | links, section rules, card border hover, cart badge outline |
| `--c-primary-dark` | `#003EAA` | header bottom bar, section-title chip |
| `--c-secondary` | `#E3411F` | "DANH MỤC SẢN PHẨM" block, footer file icon |
| `--c-accent` | `#FFEBA4` | bottom-nav hover / active link |
| `--c-cta` | `#EF4A0E` | add-to-cart, checkout, cart count bubble |
| `--c-success` | `#81D742` | — (declared, unused on the home page) |
| `--c-alert` | `#EA3A3C` | — (declared, unused on the home page) |
| `--c-text` | `#333` | body copy |
| `--c-heading` | `#111` | h1–h6, link hover |
| `--c-muted` | `#555` | top-bar links, section right-hand links |
| `--c-topbar-bg` | `#EEEEEE` | top bar |
| `--c-header-bg` | `#FFF` | header wrapper / main bar |
| `--c-footer-bg` | `#001A38` | footer widget area |
| `--c-footer-bottom` | `#00000A` | copyright strip and `html` background |
| `--c-ribbon-a` | `#001A38` | left edge of the section-title fold |
| `--c-ribbon-b` | `#0D3279` | bottom edge of the section-title fold |
| `--c-line` | `#ECECEC` | dropdown item rules |
| `--c-line-soft` | `#DDD` | mega-menu border |

Field chrome: border `1px solid rgba(0,0,0,.09)`, fill `rgba(0,0,0,.03)`.
Divider hairlines: `rgba(0,0,0,.1)` on light, `rgba(255,255,255,.1)` on dark.

## Type

| | Family | Notes |
|---|---|---|
| Body | `Roboto`, sans-serif | 16px / 1.6, colour `#333` |
| Headings, nav, buttons | `Roboto Condensed`, sans-serif | weight 700 |

Sizes actually in use: 13px (cart link), 14px (top bar, card text, section
links), 15px (bottom nav, mega-menu items), 16px (body, "Languages", header
phone), 17px (footer widget titles), 18px (section title), 24px (product H1).

Uppercase blocks carry `letter-spacing: .02em`; the footer widget titles use
`.05em` with `line-height: 1.05`.

> **Deviation.** The original declares both families but links no webfont, so a
> visitor without Roboto installed falls back to Arial — which is ~22% wider and
> visibly breaks the nav. The clone loads both from Google Fonts so the intended
> design renders everywhere.

## Layout

| Token | Value |
|---|---|
| `.container` / `.row` | max-width `1140px`, side padding `15px` |
| `.row-small` | max-width `1122.5px`, column padding `0 5px 10px` |
| `.row-collapse` | `1110px` |
| `.row-large` | `1170px` |
| Default column padding | `0 15px 30px` |

A row nested inside a column is pulled back over the gutter with
`margin-inline: -5px`, so nested grids align with the outer grid.

## Header metrics

| | Value |
|---|---|
| Top bar | `min-height: 30px`, renders **36px** (set by the 16px/25.6px "Languages" link) |
| Main bar | `100px` (`70px` below 550px) |
| Bottom bar | `min-height: 44px`, renders **45px** |
| Header wrapper total | **180px** |
| Logo | box `200px`, image `max-height: 100px` |
| Search block | `81%` of its column — 582px at 1140px container |
| Mega-menu column | `25%` of the row, `padding-right: 5px`, `margin-left: -2px` → 273px |

Right-hand tool cluster (162px total): account `20×44` + `7` margin +
`7.5|1px rule|7.5` divider + `7` margin + cart `112×44`.

## Breakpoints

Flatsome's three bands, used verbatim:

- **small** ≤ 549px
- **medium** 550 – 849px
- **large** ≥ 850px

`hide-for-medium` hides at ≤849; `show-for-medium` hides at ≥850.

## Motion

| | Value |
|---|---|
| Link / nav colour | `.2s` |
| Generic UI, dropdown fade | `.25s`–`.3s` |
| Card image cross-fade | `.6s` |
| Sticky header entry | `stuckMoveDown .6s` — `translateY(-100%)` → `0` |
| Hero slide | autoplay `6000ms`, wrap-around |
