# -*- coding: utf-8 -*-
import re, json, html, io, sys
sys.stdout.reconfigure(encoding='utf-8')
s = open('_raw/content.html', encoding='utf-8').read()

def txt(x):
    x = re.sub(r'<br\s*/?>', ' ', x)
    x = re.sub(r'<[^>]+>', '', x)
    return html.unescape(x).strip()

# split into "row-small" section blocks by id
starts = [(m.start(), m.group(1)) for m in re.finditer(r'<div class="row row-small"\s+id="(row-\d+)">', s)]
starts.append((len(s), None))

sections = []
for k in range(len(starts) - 1):
    a, rid = starts[k]
    b = starts[k+1][0]
    blk = s[a:b]
    h = re.search(r'<h3 class="vi-left-title pull-left"><a href="([^"]*)">(.*?)</a></h3>', blk, re.S)
    right = re.search(r'<div class="vi-right-link pull-right">(.*?)</div>', blk, re.S)
    rlinks = []
    if right:
        for m in re.finditer(r'href="([^"]+)"[^>]*>(.*?)</a>', right.group(1), re.S):
            t = txt(m.group(2))
            if t:
                rlinks.append({'href': m.group(1), 'text': t})
    prods = []
    for pm in re.finditer(r'<div class="product-small box has-hover box-normal box-text-bottom">(.*?)<div class="price-wrapper">', blk, re.S):
        p = pm.group(1)
        link = re.search(r'<a href="(https://hoatayviet\.net/sp/[^"]+)">', p)
        imgs = re.findall(r'<img[^>]*src="([^"]+)"[^>]*class="([^"]*)"', p)
        imgs2 = re.findall(r'<img[^>]*?(?:class="([^"]*)")?[^>]*?src="([^"]+)"', p)
        back = main = None
        for im in re.finditer(r'<img([^>]+)>', p):
            attrs = im.group(1)
            src = re.search(r'src="([^"]+)"', attrs)
            cls = re.search(r'class="([^"]*)"', attrs)
            w = re.search(r'width="(\d+)"', attrs); hh = re.search(r'height="(\d+)"', attrs)
            if not src: continue
            rec = {'src': src.group(1), 'w': w.group(1) if w else None, 'h': hh.group(1) if hh else None}
            if cls and 'back-image' in cls.group(1): back = rec
            else: main = rec
        name = re.search(r'<p class="name product-title"><a href="[^"]*">(.*?)</a></p>', p, re.S)
        pid = re.search(r'data-product_id="(\d+)"', p)
        prods.append({
            'id': pid.group(1) if pid else None,
            'name': txt(name.group(1)) if name else None,
            'url': link.group(1) if link else None,
            'image': main['src'] if main else None,
            'imageW': main['w'] if main else None,
            'imageH': main['h'] if main else None,
            'hoverImage': back['src'] if back else None,
        })
    if h or prods:
        sections.append({
            'rowId': rid,
            'title': txt(h.group(2)) if h else None,
            'titleHref': h.group(1) if h else None,
            'rightLinks': rlinks,
            'products': prods,
        })

json.dump(sections, open('_raw/home_sections.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
tot = 0
for sec in sections:
    print(f"{sec['rowId']}  {sec['title']!r}  products={len(sec['products'])}  rightLinks={[r['text'] for r in sec['rightLinks']]}")
    tot += len(sec['products'])
print('TOTAL PRODUCTS ON HOME:', tot)
uniq = {p['url'] for sec in sections for p in sec['products']}
print('UNIQUE:', len(uniq))
