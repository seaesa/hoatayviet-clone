# -*- coding: utf-8 -*-
import re, os, json, html, sys
sys.stdout.reconfigure(encoding='utf-8')

def txt(x):
    x = re.sub(r'<br\s*/?>', '\n', x)
    x = re.sub(r'<[^>]+>', '', x)
    return html.unescape(x).replace('\xa0', ' ').strip()

def norm(u):
    u = re.sub(r'^https?://web\.archive\.org/web/\d+(?:id_|im_)?/', '', u)
    u = u.replace('https://www.hoatayviet.net', 'https://hoatayviet.net')
    u = u.replace('http://hoatayviet.net', 'https://hoatayviet.net')
    u = u.replace('http://www.hoatayviet.net', 'https://hoatayviet.net')
    return u

HOME_IMG = {}
for _sec in json.load(open('_raw/home_sections.json', encoding='utf-8')):
    for _p in _sec['products']:
        if _p.get('url') and _p.get('image'):
            HOME_IMG[_p['url'].rstrip('/').rsplit('/', 1)[-1]] = _p['image']

RE_SKU  = re.compile(r'^\s*(?:mã sản phẩm|mã sp|ma sp|code)\s*[:：]\s*(.+)$', re.I)
RE_SIZE = re.compile(r'^\s*(?:kích thước|kich thuoc|size)\s*[:：]\s*(.+)$', re.I)
RE_PRICE= re.compile(r'^\s*(?:g[íi]á|g[íi]a|price)\s*[:：]\s*(.*)$', re.I)

products = []
for fn in sorted(os.listdir('_raw/products')):
    if not fn.endswith('.html'): continue
    slug = fn[:-5]
    s = open('_raw/products/' + fn, encoding='utf-8').read()

    t = re.search(r'<h1[^>]*class="product-title entry-title"[^>]*>(.*?)</h1>', s, re.S)
    name = txt(t.group(1)) if t else None

    # short description (itemprop) + long description tab
    blocks = []
    d = re.search(r'<div itemprop="description">(.*?)</div>', s, re.S)
    if d: blocks.append(d.group(1))
    tabm = re.search(r'<div class="panel entry-content active" id="tab-description">(.*?)</div>\s*</div>', s, re.S)
    long_html = tabm.group(1) if tabm else ''
    if long_html: blocks.append(long_html)

    lines = []
    for b in blocks:
        for p in re.findall(r'<p[^>]*>(.*?)</p>', b, re.S):
            for l in txt(p).split('\n'):
                l = l.strip()
                if l: lines.append(l)

    sku = size = price = None
    body = []
    for l in lines:
        m = RE_SKU.match(l)
        if m and not sku:   sku = m.group(1).strip(); continue
        m = RE_SIZE.match(l)
        if m and not size:  size = m.group(1).strip(); continue
        m = RE_PRICE.match(l)
        if m and price is None:
            price = m.group(1).strip().strip('.…: ') or 'Liên hệ'; continue
        body.append(l)

    cat = re.search(r'<span class="posted_in">.*?<a[^>]*>(.*?)</a>', s, re.S)
    cat_href = re.search(r'<span class="posted_in">.*?<a href="([^"]+)"', s, re.S)

    gal = []
    gsec = re.search(r'<div class="product-gallery-slider(.*?)<div class="product-thumbnails', s, re.S)
    if gsec:
        for m in re.finditer(r'<a href="([^"]+)"[^>]*class="woocommerce-main-image', gsec.group(1)):
            u = norm(m.group(1))
            if u not in gal: gal.append(u)
    if not gal:
        m = re.search(r'class="attachment-shop_single[^"]*"[^>]*src="([^"]+)"', s)
        if m: gal.append(norm(m.group(1)))
    if not gal and slug in HOME_IMG:
        gal.append(HOME_IMG[slug])

    # images embedded in the long description
    desc_imgs = []
    for m in re.finditer(r'<img[^>]*src="([^"]+)"', long_html):
        u = norm(m.group(1))
        if u not in desc_imgs: desc_imgs.append(u)

    pid = re.search(r'data-id="(\d+)"', s)

    products.append({
        'slug': slug,
        'id': pid.group(1) if pid else None,
        'name': name,
        'url': 'https://hoatayviet.net/sp/%s/' % slug,
        'sku': sku, 'size': size, 'price': price or 'Liên hệ',
        'body': body,
        'category': txt(cat.group(1)) if cat else None,
        'categorySlug': (norm(cat_href.group(1)).rstrip('/').rsplit('/', 1)[-1]) if cat_href else None,
        'gallery': gal,
        'descImages': desc_imgs,
        'thumb': HOME_IMG.get(slug) or (gal[0] if gal else None),
    })

json.dump(products, open('_raw/products.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('parsed', len(products))
for p in products:
    print(f"{p['slug'][:32]:33}| {str(p['name'])[:24]:25}| {str(p['categorySlug'])[:21]:22}| sku={str(p['sku'])[:10]:11}| size={str(p['size'])[:26]:27}| imgs={len(p['gallery'])}")
print('no sku :', [p['slug'] for p in products if not p['sku']])
print('no size:', [p['slug'] for p in products if not p['size']])
print('no img :', [p['slug'] for p in products if not p['gallery']])
