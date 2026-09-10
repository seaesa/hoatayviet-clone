# -*- coding: utf-8 -*-
"""Generate the static clone (home, category pages, product pages, search)."""
import os, re, json, html, shutil, sys, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')

ROOT = 'site'
IMG_BASE = 'assets/img/'

PRODUCTS = json.load(open('_raw/products.json', encoding='utf-8'))
SECTIONS = json.load(open('_raw/home_sections.json', encoding='utf-8'))

CATEGORIES = [
    ('tau-du-lich-du-thuyen', 'Tàu Du Lịch – Du Thuyền'),
    ('tau-cho-hang',          'Tàu Chở Hàng'),
    ('thuyen-buom',           'Thuyền Buồm'),
    ('thuyen-dung-di-dao',    'Thuyền (Dùng đi dạo)'),
    ('du-thuyen-hien-dai',    'Du Thuyền Hiện Đại'),
    ('noi-that',              'Nội Thất'),
    ('san-pham-khac',         'Sản Phẩm Khác'),
]
CAT_NAME = dict(CATEGORIES)

MAIN_NAV = [
    ('',                       'Trang chủ',  'index.html',       False),
    ('gioi-thieu',             'Giới thiệu', 'gioi-thieu.html',  False),
    ('shop',                   'Sản phẩm',   'san-pham.html',    False),
    ('tin-tuc',                'Tin tức',    'tin-tuc.html',     False),
    ('lien-he',                'Liên hê',    'lien-he.html',     False),
    ('huong-dan',              'Hướng dẫn',  'huong-dan.html',   True),
]
GUIDE_SUB = [
    ('Hướng Dẫn Sử Dụng', 'huong-dan-su-dung.html'),
    ('Hướng dẫn mua hàng', 'huong-dan-mua-hang.html'),
]

PHONE = '0908 062 685'
EMAIL = 'hoatayviet.modelship@gmail.com'

# --------------------------------------------------------------------------
# icons (inline SVG, shapes traced from FontAwesome 4.7 / Flatsome fl-icons)
# --------------------------------------------------------------------------
ICONS = {
 'phone':  '<path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z"/>',
 'mail':   '<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>',
 'pin':    '<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
 'bars':   '<path d="M3 6h18v2.4H3V6zm0 4.8h18v2.4H3v-2.4zM3 15.6h18V18H3v-2.4z"/>',
 'search': '<path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>',
 'user':   '<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>',
 'basket': '<path d="M17 8V6A5 5 0 0 0 7 6v2H3.6a1 1 0 0 0-1 1.1l1.3 10.4a2 2 0 0 0 2 1.75h12.2a2 2 0 0 0 2-1.75l1.3-10.4a1 1 0 0 0-1-1.1zM9 6a3 3 0 0 1 6 0v2H9z"/>',
 'down':   '<path d="M12 15.5 5.5 9l1.4-1.4 5.1 5.1 5.1-5.1L18.5 9z"/>',
 'up':     '<path d="m12 8.5 6.5 6.5-1.4 1.4-5.1-5.1-5.1 5.1L5.5 15z"/>',
 'left':   '<path d="M14.5 18.5 8 12l6.5-6.5L15.9 6.9 10.8 12l5.1 5.1z"/>',
 'right':  '<path d="M9.5 5.5 16 12l-6.5 6.5L8.1 17.1 13.2 12 8.1 6.9z"/>',
 'close':  '<path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 6.3 17.7 4.9 16.3 11.2 10 4.9 3.7 6.3 2.3l4.3 4.3L16.9 4.3z"/>',
 'file':   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7V3.5L18.5 9z"/>',
}

def icon(name, cls='icon'):
    return ('<svg class="%s" viewBox="0 0 24 24" aria-hidden="true" focusable="false">%s</svg>'
            % (cls, ICONS[name]))

def e(s):
    return html.escape(s or '', quote=True)

def img_path(url, prefix=''):
    """Map an original uploads URL to the local copy."""
    if not url:
        return prefix + IMG_BASE + 'placeholder.png'
    p = urllib.parse.urlparse(url).path
    if '/wp-content/uploads/' in p:
        return prefix + IMG_BASE + p.split('/wp-content/uploads/', 1)[1]
    return url

# --------------------------------------------------------------------------
# shared chrome
# --------------------------------------------------------------------------
def search_form(prefix, extra_class=''):
    opts = ['<option value="">Tất cả</option>']
    for slug, name in sorted(CATEGORIES, key=lambda c: c[1]):
        opts.append('<option value="%s">%s</option>' % (slug, e(name)))
    return '''<form class="searchform %s" role="search" data-base="%s" action="%stim-kiem.html" method="get">
            <label class="sr-only" for="search-cat-%s">Danh mục</label>
            <select class="search-cats" name="cat" id="search-cat-%s">%s</select>
            <label class="sr-only" for="search-q-%s">Tìm kiếm sản phẩm</label>
            <input class="search-field" type="search" name="s" id="search-q-%s" placeholder="Tìm kiếm sản phẩm" autocomplete="off">
            <button class="search-submit" type="submit" aria-label="Tìm kiếm">%s</button>
          </form>''' % (extra_class, prefix, prefix, extra_class or 'main', extra_class or 'main',
                        ''.join(opts), extra_class or 'main', extra_class or 'main', icon('search'))

def cart_badge(cls=''):
    return '<span class="cart-icon %s"><strong>0</strong></span>' % cls

def header(prefix, active_href=None):
    cat_items = ''.join(
        '<li><a href="%sdanh-muc/%s/index.html">%s</a></li>' % (prefix, slug, e(name))
        for slug, name in CATEGORIES)

    nav_items = []
    for _key, label, href, has_sub in MAIN_NAV:
        cls = []
        if has_sub: cls.append('has-dropdown')
        if href == active_href: cls.append('is-active')
        sub = ''
        caret = ''
        if has_sub:
            caret = icon('down')
            sub = '<ul class="nav-dropdown">%s</ul>' % ''.join(
                '<li><a href="%s%s">%s</a></li>' % (prefix, h, e(t)) for t, h in GUIDE_SUB)
        nav_items.append(
            '<li class="%s"><a href="%s%s"%s>%s%s</a>%s</li>'
            % (' '.join(cls), prefix, href,
               ' aria-expanded="false" aria-haspopup="true"' if has_sub else '',
               e(label), caret, sub))

    return '''<header class="header" id="header">
  <div class="header-wrapper">

    <!-- top bar -->
    <div class="header-top hide-for-sticky" id="top-bar">
      <div class="container header-row">
        <ul class="topbar-nav hide-for-medium">
          <li><span class="topbar-text">{phone_icon} {phone}</span></li>
          <li><a href="mailto:{email}">{mail_icon} {email}</a></li>
        </ul>
        <ul class="topbar-nav show-for-medium">
          <li><span class="topbar-text">{phone_icon} {phone}</span></li>
        </ul>
        <ul class="topbar-nav hide-for-medium">
          <li><a href="{prefix}huong-dan-mua-hang.html">Hướng dẫn mua hàng</a></li>
          <li><button class="lang-toggle" type="button" aria-expanded="false">Languages {down}</button></li>
        </ul>
      </div>
    </div>

    <!-- main bar -->
    <div class="header-main hide-for-sticky" id="masthead">
      <div class="container header-row">
        <div class="header-col show-for-medium">
          <button class="burger" type="button" data-open-menu aria-label="Mở menu" aria-controls="mobile-menu" aria-expanded="false">{bars}</button>
        </div>

        <div class="header-col logo">
          <a href="{prefix}index.html" rel="home" title="Xưởng Sản Xuất Thuyền Mỹ Nghệ Hoa Tay Việt">
            <img src="{logo}" width="200" height="100" alt="Xưởng Sản Xuất Thuyền Mỹ Nghệ Hoa Tay Việt">
          </a>
        </div>

        <div class="header-col header-search hide-for-medium">
          {search}
        </div>

        <ul class="header-tools hide-for-medium">
          <li class="account-item"><a class="account-link" href="{prefix}tai-khoan.html" aria-label="Tài khoản">{user}</a></li>
          <li class="header-divider" aria-hidden="true"></li>
          <li class="cart-item">
            <a class="cart-link" href="{prefix}gio-hang.html" title="Giỏ hàng">
              <span class="cart-title">Giỏ hàng&nbsp;/&nbsp;<span class="cart-price">0&nbsp;₫</span></span>
              <span class="cart-glyph" data-icon-label="0">{basket}</span>
            </a>
          </li>
        </ul>

        <div class="header-col show-for-medium">
          <a class="cart-toggle header-icon" href="{prefix}gio-hang.html" aria-label="Giỏ hàng">{basket}</a>
        </div>
      </div>
    </div>

    <!-- bottom bar -->
    <div class="header-bottom hide-for-medium" id="wide-nav">
      <div class="container header-row">
        <div class="header-col nav-left">
          <div class="mega-menu">
            <button class="mega-menu-title" type="button" aria-expanded="false" aria-controls="mega-menu-list">
              {bars} Danh mục sản phẩm
            </button>
            <ul class="mega-menu-list" id="mega-menu-list">{cats}</ul>
          </div>
        </div>

        <nav class="header-col nav-center" aria-label="Menu chính">
          <ul class="main-nav">{nav}</ul>
        </nav>

        <div class="header-col nav-right">
          <a class="header-phone" href="tel:{phone_raw}">{phone_icon} {phone}</a>
        </div>
      </div>
    </div>

  </div>
</header>'''.format(
        prefix=prefix, phone=PHONE, phone_raw=PHONE.replace(' ', ''), email=EMAIL,
        phone_icon=icon('phone'), mail_icon=icon('mail'), down=icon('down'),
        bars=icon('bars'), user=icon('user'), basket=icon('basket'),
        logo=prefix + IMG_BASE + '2023/06/logo.jpg',
        search=search_form(prefix),
        cats=cat_items, nav=''.join(nav_items))


def offcanvas(prefix):
    items = []
    items.append('<li><a href="%sindex.html">Trang chủ</a></li>' % prefix)
    items.append('<li><a href="%sgioi-thieu.html">Giới thiệu</a></li>' % prefix)
    sub = ''.join('<li><a href="%sdanh-muc/%s/index.html">%s</a></li>' % (prefix, s, e(n))
                  for s, n in CATEGORIES)
    items.append(
        '<li><a href="%ssan-pham.html">Sản phẩm'
        '<button class="toggle-sub" type="button" aria-expanded="false" aria-label="Mở danh mục">%s</button>'
        '</a><ul class="sub">%s</ul></li>' % (prefix, icon('down'), sub))
    items.append('<li><a href="%stin-tuc.html">Tin tức</a></li>' % prefix)
    items.append('<li><a href="%slien-he.html">Liên hê</a></li>' % prefix)
    gsub = ''.join('<li><a href="%s%s">%s</a></li>' % (prefix, h, e(t)) for t, h in GUIDE_SUB)
    items.append(
        '<li><a href="%shuong-dan.html">Hướng dẫn'
        '<button class="toggle-sub" type="button" aria-expanded="false" aria-label="Mở mục con">%s</button>'
        '</a><ul class="sub">%s</ul></li>' % (prefix, icon('down'), gsub))
    items.append('<li><a href="%stai-khoan.html">Đăng nhập</a></li>' % prefix)

    return '''<div class="offcanvas-backdrop" hidden-aria></div>
<aside class="offcanvas" id="mobile-menu" aria-hidden="true" aria-label="Menu">
  <div class="offcanvas-head">
    <strong>Menu</strong>
    <button class="offcanvas-close" type="button" data-close-menu aria-label="Đóng menu">%s</button>
  </div>
  %s
  <ul class="offcanvas-nav">%s</ul>
</aside>''' % (icon('close'), search_form(prefix, 'in-offcanvas'), ''.join(items))


def footer(prefix):
    return '''<footer class="footer-wrapper">
  <div class="footer-widgets">
    <div class="row">

      <div class="widget">
        <h3 class="widget-title">Thông tin liên hệ</h3>
        <div class="is-divider"></div>
        <div class="textwidget">
          <p><strong>CÔNG TY TNHH HOA TAY VIỆT</strong></p>
          <p>{pin} <span>199 ấp 1B, Phước Thái, Long Thành, Đồng Nai</span></p>
          <p>{phone_icon} <a href="tel:0908062685">0908 062 685</a></p>
          <p>{phone_icon} <span>84 35234 4343 – Contact (Ms Tram)</span></p>
          <p>{mail} <a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a></p>
          <p>{mail} <a href="mailto:lywoodenmodelboat@gmail.com">lywoodenmodelboat@gmail.com</a></p>
        </div>
      </div>

      <div class="widget">
        <h3 class="widget-title">Google Map</h3>
        <div class="is-divider"></div>
        <div class="textwidget">
          <iframe class="footer-map" title="Bản đồ Hoa Tay Việt" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" allowfullscreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.626500441101!2d107.03891671474814!3d10.686071692382871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31751a77768c1d45%3A0xcb63f98a4ce9af9a!2zSzYwIOG6pHAgMSwgVMOibiBIaeG7h3AsIExvbmcgVGjDoG5oLCDEkOG7k25nIE5haSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2sus!4v1669172546397!5m2!1svi!2sus"></iframe>
        </div>
      </div>

      <div class="widget">
        <h3 class="widget-title">Giới thiệu</h3>
        <div class="is-divider"></div>
        <div class="textwidget">
          <p class="muted">Chào mừng quý khách đến với đại gia đình HOA TAY VIỆT.</p>
          <p><span>Công ty chúng tôi chuyên xuất khẩu ngành hàng thủ công mỹ nghệ có bề dày kinh nghiệm trong ngành thủ công làm bằng tay</span></p>
        </div>
      </div>

    </div>
  </div>

  <div class="footer-bottom">
    <div class="container">Copyright 2026 © <strong>duongit</strong></div>
  </div>

  <a class="back-to-top" href="#top" aria-label="Lên đầu trang">{up}</a>

  <div class="quick-call">
    <div class="quick-call-inner">
      <p class="quick-call-text">HotLine: {phone}</p>
      <span class="ph-circle" aria-hidden="true"></span>
      <span class="ph-circle-fill" aria-hidden="true"></span>
      <span class="ph-img-circle" aria-hidden="true">{phone_icon}</span>
      <a href="tel:0908062685" aria-label="Gọi ngay {phone}"></a>
    </div>
  </div>
</footer>'''.format(pin=icon('pin'), phone_icon=icon('phone'), mail=icon('mail'),
                    up=icon('up'), phone=PHONE)


def page(title, body_class, content, prefix, desc='', active=None):
    return '''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="{prefix}{img}2023/06/cropped-logo-32x32.jpg" sizes="32x32">
<link rel="apple-touch-icon" href="{prefix}{img}2023/06/cropped-logo-180x180.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap">
<link rel="stylesheet" href="{prefix}assets/css/style.css">
</head>
<body class="{body_class}" id="top">
{header}
<main id="main">
{content}
</main>
{footer}
{offcanvas}
<script src="{prefix}assets/js/main.js"></script>
</body>
</html>
'''.format(title=e(title), desc=e(desc), prefix=prefix, img=IMG_BASE,
           body_class=body_class, header=header(prefix, active),
           content=content, footer=footer(prefix), offcanvas=offcanvas(prefix))


# --------------------------------------------------------------------------
# product card
# --------------------------------------------------------------------------
BY_SLUG = {p['slug']: p for p in PRODUCTS}

def card(slug, name=None, image=None, hover=None, prefix=''):
    p = BY_SLUG.get(slug, {})
    name  = name  or p.get('name') or slug
    image = image or p.get('thumb') or (p.get('gallery') or [None])[0]
    gal   = p.get('gallery') or []
    if not hover:
        hover = next((g for g in gal if g != image), None)

    href = '%ssp/%s/index.html' % (prefix, slug)
    back = ''
    if hover:
        back = ('<img class="img-back" src="%s" alt="" loading="lazy" decoding="async">'
                % img_path(hover, prefix))
    return '''<div class="col">
  <article class="product-card">
    <div class="product-media">
      <a href="{href}" aria-label="{alt}">
        <img src="{img}" alt="{alt}" loading="lazy" decoding="async">
        {back}
      </a>
      <div class="product-tools">
        <a class="cart-icon" href="{href}" aria-label="Xem {alt}"><strong>+</strong></a>
      </div>
    </div>
    <div class="product-body">
      <p class="product-name"><a href="{href}">{name}</a></p>
    </div>
  </article>
</div>'''.format(href=href, img=img_path(image, prefix), alt=e(name), name=e(name), back=back)


# --------------------------------------------------------------------------
# home
# --------------------------------------------------------------------------
HERO_SLIDES = [
    ('2022/11/z3487042728597_daf745f2e9f46dcaf6295ec7df19df7d-768x579-1.jpg', 'Mô hình tàu Caledonian MacBrayne'),
    ('2022/11/z3150831024697_8d7e0c59a1b1af27a544a517bb227612.jpg',           'Mô hình du thuyền Hoa Tay Việt'),
    ('2022/11/366219_n-768x613-1.gif',                                        'Mô hình thuyền buồm thủ công'),
    ('2022/11/VV3.gif',                                                       'Xưởng sản xuất thuyền mỹ nghệ'),
]

def build_home():
    slides, dots = [], []
    for i, (src, alt) in enumerate(HERO_SLIDES):
        slides.append(
            '<div class="slide" role="group" aria-roledescription="slide" aria-label="%d / %d" aria-hidden="%s">'
            '<div class="slide-bg" style="background-image:url(&quot;%s%s&quot;)" role="img" aria-label="%s"></div>'
            '<div class="slide-overlay"></div></div>'
            % (i + 1, len(HERO_SLIDES), 'false' if i == 0 else 'true',
               IMG_BASE, src, e(alt)))
        dots.append('<button type="button" role="tab" aria-selected="%s" aria-label="Ảnh %d"></button>'
                    % ('true' if i == 0 else 'false', i + 1))

    hero = '''<div class="gap"></div>
<div class="row row-small hero-row">
  <div class="col col-3"><!-- the category list sits here, rendered in the header --></div>
  <div class="col col-9">
    <div class="slider" data-slider data-autoplay="6000" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Ảnh nổi bật">
      <div class="slider-track">%s</div>
      <button class="slider-arrow prev" type="button" aria-label="Ảnh trước">%s</button>
      <button class="slider-arrow next" type="button" aria-label="Ảnh sau">%s</button>
      <div class="slider-dots" role="tablist" aria-label="Chọn ảnh">%s</div>
    </div>
  </div>
</div>''' % (''.join(slides), icon('left'), icon('right'), ''.join(dots))

    blocks = [hero]
    for sec in SECTIONS:
        title = sec['title'] or ''
        # map the section heading to its category page where one exists
        cat_slug = next((s for s, n in CATEGORIES if n == title), None)
        title_href = 'danh-muc/%s/index.html' % cat_slug if cat_slug else 'san-pham.html'

        links = []
        for rl in sec['rightLinks']:
            h = rl['href']
            m = re.search(r'/danh-muc/([^/]+)/', h)
            links.append('<a href="%s">%s</a>' %
                         ('danh-muc/%s/index.html' % m.group(1) if m else 'san-pham.html',
                          e(rl['text'])))

        cards = []
        for pr in sec['products']:
            slug = (pr['url'] or '').rstrip('/').rsplit('/', 1)[-1]
            cards.append(card(slug, pr['name'], pr['image'], pr['hoverImage']))

        blocks.append('''<section class="row row-small">
  <div class="col">
    <div class="section-head">
      <h2 class="section-title"><a href="{th}">{title}</a></h2>
      <div class="section-links">{links}</div>
    </div>
  </div>
  <div class="col">
    <div class="row row-small grid-products">{cards}</div>
  </div>
</section>'''.format(th=title_href, title=e(title),
                     links=' – '.join(links), cards=''.join(cards)))

    return page('Trang Chủ - Xưởng Sản Xuất Thuyền Mỹ Nghệ Hoa Tay Việt',
                'is-home', '\n'.join(blocks), '',
                desc='Xưởng sản xuất thuyền mỹ nghệ Hoa Tay Việt — mô hình tàu, du thuyền, thuyền buồm và nội thất gỗ thủ công.',
                active='index.html')


# --------------------------------------------------------------------------
# category + product + listing pages
# --------------------------------------------------------------------------
def build_category(slug, name):
    prefix = '../../'
    items = [p for p in PRODUCTS if p['categorySlug'] == slug]
    cards = ''.join(card(p['slug'], prefix=prefix) for p in items)
    body = '' if items else '<p class="empty-note">Chưa có sản phẩm trong danh mục này.</p>'

    content = '''<div class="page-wrap">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="{p}index.html">Trang chủ</a><span>/</span>
      <a href="{p}san-pham.html">Sản phẩm</a><span>/</span>{name}
    </nav>
  </div>
  <section class="row row-small">
    <div class="col">
      <div class="section-head">
        <h1 class="section-title">{name}</h1>
        <div class="section-links">{count} sản phẩm</div>
      </div>
    </div>
    <div class="col">
      <div class="row row-small grid-products">{cards}</div>
      {body}
    </div>
  </section>
</div>'''.format(p=prefix, name=e(name), count=len(items), cards=cards, body=body)

    return page('%s - Hoa Tay Việt' % name, 'is-category', content, prefix,
                desc='Danh mục %s tại Hoa Tay Việt.' % name, active='san-pham.html')


def build_product(p):
    prefix = '../../'
    gal = p['gallery'] or []
    main = gal[0] if gal else p['thumb']

    thumbs = ''.join(
        '<button type="button" role="tab" aria-selected="%s" data-full="%s" data-alt="%s">'
        '<img src="%s" alt="" loading="lazy"></button>'
        % ('true' if i == 0 else 'false', img_path(g, prefix), e(p['name']), img_path(g, prefix))
        for i, g in enumerate(gal)) if len(gal) > 1 else ''

    specs = []
    if p['sku']:   specs.append(('Mã sản phẩm', p['sku']))
    if p['size']:  specs.append(('Kích thước',  p['size']))
    specs.append(('Giá', p['price'] or 'Liên hệ'))
    spec_html = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (e(k), e(v)) for k, v in specs)

    body_txt = ''.join('<p>%s</p>' % e(l) for l in p['body'])
    desc_imgs = ''.join('<img src="%s" alt="" loading="lazy">' % img_path(u, prefix)
                        for u in p['descImages'])
    desc_block = ''
    if body_txt or desc_imgs:
        desc_block = ('<div class="product-desc"><h2 class="section-title" style="display:inline-block">Mô tả</h2>'
                      '<div style="margin-top:16px">%s%s</div></div>' % (body_txt, desc_imgs))

    cat_slug = p['categorySlug']
    cat_name = CAT_NAME.get(cat_slug, p['category'] or '')

    related = [q for q in PRODUCTS if q['categorySlug'] == cat_slug and q['slug'] != p['slug']][:4]
    rel_html = ''
    if related:
        rel_html = '''<section class="row row-small" style="margin-top:30px">
  <div class="col">
    <div class="section-head"><h2 class="section-title">Sản phẩm tương tự</h2></div>
  </div>
  <div class="col"><div class="row row-small grid-products">%s</div></div>
</section>''' % ''.join(card(q['slug'], prefix=prefix) for q in related)

    content = '''<div class="page-wrap">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="{p}index.html">Trang chủ</a><span>/</span>
      <a href="{p}danh-muc/{cslug}/index.html">{cname}</a><span>/</span>{name}
    </nav>

    <div class="row product-detail">
      <div class="gallery-col">
        <div class="gallery-main"><img src="{main}" alt="{name}"></div>
        <div class="gallery-thumbs" role="tablist" aria-label="Ảnh sản phẩm">{thumbs}</div>
      </div>

      <div class="info-col">
        <h1>{name}</h1>
        <div class="is-divider"></div>
        <dl class="spec-list">{specs}</dl>
        <a class="btn-buy" href="tel:0908062685">
          <strong>Mua ngay</strong>
          <span>Gọi điện xác nhận và giao hàng tận nơi</span>
        </a>
        <p class="product-meta">Danh mục: <a href="{p}danh-muc/{cslug}/index.html">{cname}</a></p>
        {desc}
      </div>
    </div>
  </div>
  {rel}
</div>'''.format(p=prefix, cslug=cat_slug, cname=e(cat_name), name=e(p['name']),
                 main=img_path(main, prefix), thumbs=thumbs, specs=spec_html,
                 desc=desc_block, rel=rel_html)

    return page('%s - Hoa Tay Việt' % p['name'], 'is-product', content, prefix,
                desc='%s — %s. %s' % (p['name'], cat_name, p['size'] or ''),
                active='san-pham.html')


def build_all_products():
    prefix = ''
    blocks = []
    for slug, name in CATEGORIES:
        items = [p for p in PRODUCTS if p['categorySlug'] == slug]
        if not items:
            continue
        blocks.append('''<section class="row row-small">
  <div class="col">
    <div class="section-head">
      <h2 class="section-title"><a href="danh-muc/{s}/index.html">{n}</a></h2>
      <div class="section-links"><a href="danh-muc/{s}/index.html">Xem tất cả ({c})</a></div>
    </div>
  </div>
  <div class="col"><div class="row row-small grid-products">{cards}</div></div>
</section>'''.format(s=slug, n=e(name), c=len(items),
                     cards=''.join(card(p['slug']) for p in items)))

    content = ('<div class="page-wrap"><div class="container"><nav class="breadcrumb">'
               '<a href="index.html">Trang chủ</a><span>/</span>Sản phẩm</nav></div>'
               + '\n'.join(blocks) + '</div>')
    return page('Sản phẩm - Hoa Tay Việt', 'is-shop', content, prefix,
                desc='Toàn bộ %d sản phẩm của Hoa Tay Việt.' % len(PRODUCTS),
                active='san-pham.html')


def build_search():
    content = '''<div class="page-wrap"><div class="container">
  <nav class="breadcrumb"><a href="index.html">Trang chủ</a><span>/</span>Tìm kiếm</nav>
  <h1 id="search-heading">Kết quả tìm kiếm</h1>
  <div class="is-divider" style="margin-left:0"></div>
</div>
<section class="row row-small">
  <div class="col"><div class="row row-small grid-products" id="search-results"></div>
  <p class="empty-note" id="search-empty" hidden>Không tìm thấy sản phẩm phù hợp.</p></div>
</section></div>
<script>
(function () {
  var q = new URLSearchParams(location.search);
  var term = (q.get('s') || '').trim().toLowerCase();
  var cat  = q.get('cat') || '';
  var head = document.getElementById('search-heading');
  head.textContent = term ? 'Kết quả cho “' + term + '”' : 'Tất cả sản phẩm';

  function strip(s) {
    return (s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  }

  fetch('assets/data/products.json').then(function (r) { return r.json(); }).then(function (items) {
    var t = strip(term);
    var out = items.filter(function (p) {
      if (cat && p.categorySlug !== cat) return false;
      if (!t) return true;
      return strip(p.name).indexOf(t) > -1 || strip(p.sku).indexOf(t) > -1 || strip(p.category).indexOf(t) > -1;
    });
    var box = document.getElementById('search-results');
    if (!out.length) { document.getElementById('search-empty').hidden = false; return; }
    box.innerHTML = out.map(function (p) {
      var href = 'sp/' + p.slug + '/index.html';
      return '<div class="col"><article class="product-card"><div class="product-media">'
        + '<a href="' + href + '"><img src="' + p.thumb + '" alt="' + p.name + '" loading="lazy"></a>'
        + '<div class="product-tools"><a class="cart-icon" href="' + href + '"><strong>+</strong></a></div>'
        + '</div><div class="product-body"><p class="product-name"><a href="' + href + '">'
        + p.name + '</a></p></div></article></div>';
    }).join('');
  });
})();
</script>'''
    return page('Tìm kiếm - Hoa Tay Việt', 'is-search', content, '', active='san-pham.html')


def build_stub(title, heading, body, filename, active=None):
    content = '''<div class="page-wrap"><div class="container">
  <nav class="breadcrumb"><a href="index.html">Trang chủ</a><span>/</span>{h}</nav>
  <h1>{h}</h1>
  <div class="is-divider" style="margin-left:0"></div>
  {b}
</div></div>'''.format(h=e(heading), b=body)
    return page(title, 'is-page', content, '', active=active)


# --------------------------------------------------------------------------
def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(text)

def main():
    n = 0
    write('index.html', build_home()); n += 1

    for slug, name in CATEGORIES:
        write('danh-muc/%s/index.html' % slug, build_category(slug, name)); n += 1

    for p in PRODUCTS:
        write('sp/%s/index.html' % p['slug'], build_product(p)); n += 1

    write('san-pham.html', build_all_products()); n += 1
    write('tim-kiem.html', build_search()); n += 1

    contact = '''<p><strong>CÔNG TY TNHH HOA TAY VIỆT</strong></p>
<p>Địa chỉ: 199 ấp 1B, Phước Thái, Long Thành, Đồng Nai</p>
<p>Điện thoại: <a href="tel:0908062685">0908 062 685</a> — 84 35234 4343 (Ms Tram)</p>
<p>Email: <a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a></p>'''
    intro = '''<p>Hoa Tay Việt là xưởng sản xuất thuyền mỹ nghệ, chuyên xuất khẩu ngành hàng thủ công mỹ nghệ
với bề dày kinh nghiệm trong ngành thủ công làm bằng tay.</p>
<p>Sản phẩm gồm mô hình tàu du lịch, du thuyền, tàu chở hàng, thuyền buồm, thuyền dùng đi dạo và nội thất gỗ.</p>'''
    todo = '<p>Nội dung trang này chưa được thu thập (máy chủ gốc đang trả về lỗi 500).</p>'

    for title, heading, body, fn in [
        ('Giới thiệu - Hoa Tay Việt',        'Giới thiệu',          intro,   'gioi-thieu.html'),
        ('Liên hệ - Hoa Tay Việt',           'Liên hê',             contact, 'lien-he.html'),
        ('Tin tức - Hoa Tay Việt',           'Tin tức',             todo,    'tin-tuc.html'),
        ('Hướng dẫn - Hoa Tay Việt',         'Hướng dẫn',           todo,    'huong-dan.html'),
        ('Hướng dẫn sử dụng - Hoa Tay Việt', 'Hướng Dẫn Sử Dụng',   todo,    'huong-dan-su-dung.html'),
        ('Hướng dẫn mua hàng - Hoa Tay Việt','Hướng dẫn mua hàng',  todo,    'huong-dan-mua-hang.html'),
        ('Giỏ hàng - Hoa Tay Việt',          'Giỏ hàng',            '<p>Chưa có sản phẩm trong giỏ hàng.</p>', 'gio-hang.html'),
        ('Tài khoản - Hoa Tay Việt',         'Đăng nhập',           todo,    'tai-khoan.html'),
    ]:
        write(fn, build_stub(title, heading, body, fn)); n += 1

    # product data for the search page
    slim = [{'slug': p['slug'], 'name': p['name'], 'sku': p['sku'] or '',
             'size': p['size'] or '', 'price': p['price'],
             'category': p['category'] or '', 'categorySlug': p['categorySlug'] or '',
             'thumb': img_path(p['thumb'])} for p in PRODUCTS]
    write('assets/data/products.json', json.dumps(slim, ensure_ascii=False, indent=1))

    print('pages written:', n)
    print('products     :', len(PRODUCTS))
    print('categories   :', len(CATEGORIES))

main()
