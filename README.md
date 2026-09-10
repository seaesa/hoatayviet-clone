# hoatayviet.net — static clone

A hand-written HTML / CSS / JS clone of the **hoatayviet.net** home page, plus
generated category, product and search pages built from the site's full product
catalogue. No framework, no build step, no runtime dependencies.

## Run it

```bash
cd site
python -m http.server 8900
# http://127.0.0.1:8900/index.html
```

Any static host works — the output is plain files.

## Layout

```
site/                       the deliverable
  index.html                home page (the clone target)
  san-pham.html             all products, grouped by category
  tim-kiem.html             client-side search over products.json
  danh-muc/<slug>/          7 category listings
  sp/<slug>/                32 product pages
  gioi-thieu.html · lien-he.html · huong-dan*.html · gio-hang.html · tai-khoan.html
  assets/
    css/style.css           ~980 lines, tokens first, then components
    js/main.js              sticky header, slider, menus, search, gallery
    img/                    217 images, mirrored from the original CDN
    data/products.json      catalogue used by the search page

scripts/                    reproducible pipeline
  mirror.py                 mirrors the original page for reference
  parse_home.py             home page -> sections + product cards
  crawl_products.py         32 product pages from the Wayback Machine
  parse_products.py         product pages -> products.json
  download_product_images.py
  build_site.py             renders every page
  check_site.py             link / asset integrity check
  cssgrep.py                pulls rules out of the original 441KB stylesheet

docs/research/
  DESIGN_TOKENS.md          colours, type, layout, breakpoints, motion
  BEHAVIORS.md              every interaction with its exact trigger + states
  KNOWN_ISSUES.md           bugs in the original that are reproduced, and how to fix each

_raw/                       captured source + intermediate JSON (not served)
_mirror/                    local copy of the original, for side-by-side diffing
```

## Rebuild

```bash
python scripts/build_site.py     # regenerate all 50 pages from _raw/products.json
python scripts/check_site.py     # verify every href/src resolves
```

## Fidelity

Measured against the original at a 1440px viewport, same machine, same fonts:

| | Original | Clone |
|---|---|---|
| Logo | `off 0, 200×100` | `off 0, 200×100` |
| Search block | `off 230, 582×40` | `off 230, 582×40` |
| Account / divider / cart | `948 · 983 · 998`, `112×44` | `948 · 983 · 998`, `112×44` |
| Mega menu | `off -2, 273×44`, list `273×274` | identical |
| Main nav | `off 276, 557×44`, first link `291` | identical |
| Header phone | `off 997, 113×45` | identical |
| Top bar height | `36` | `36` |
| Hero row | `1123×310`, cols `281` / `842` | identical |
| Section header | `1113×52`, chip `197×35` | identical |
| Product grid column | `281×326` | identical |
| Product card | `271×316`, media `271×271`, body `271×45` | identical |
| Sticky thresholds | stick `280`, release `37` | stick `280`, release `37` |

Responsive was checked at 1440 / 768 / 390 and matches at all three, including
the original's empty hero column between 550 and 849px.

## Notes

- The origin server was returning **HTTP 500 for every URL except the cached
  home page** during capture. Product data came from the Wayback Machine;
  images came from the live CDN. See `docs/research/KNOWN_ISSUES.md` §6.
- Five rendering bugs in the original are reproduced deliberately, each with a
  one-line fix documented in `KNOWN_ISSUES.md`. The most consequential: the
  mobile hamburger is white on white, so it is invisible.
- The one intentional deviation is loading Roboto / Roboto Condensed as
  webfonts, which the original declares but never links.
