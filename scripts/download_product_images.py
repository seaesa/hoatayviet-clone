# -*- coding: utf-8 -*-
import os, json, time, sys, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
OUT = 'site/assets/img'

products = json.load(open('_raw/products.json', encoding='utf-8'))
urls = set()
for p in products:
    for u in p['gallery'] + p['descImages']:
        if u.startswith('https://hoatayviet.net/wp-content/uploads/'): urls.add(u)
    if p['thumb'] and p['thumb'].startswith('https://hoatayviet.net/wp-content/uploads/'):
        urls.add(p['thumb'])
# homepage images too
for line in open('_raw/home_imgs.txt', encoding='utf-8'):
    line = line.strip()
    if line: urls.add(line)

print('unique images to fetch:', len(urls))

def rel(u):
    return urllib.parse.urlparse(u).path.split('/wp-content/uploads/', 1)[-1]

def fetch(u, dest, wb_ok=True):
    if os.path.exists(dest) and os.path.getsize(dest) > 0: return 'cached'
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for attempt, src in enumerate([u, 'https://web.archive.org/web/2025id_/' + u] if wb_ok else [u]):
        for t in range(2):
            try:
                req = urllib.request.Request(src, headers={'User-Agent': UA, 'Referer': 'https://hoatayviet.net/'})
                with urllib.request.urlopen(req, timeout=50) as r:
                    data = r.read()
                if len(data) < 100: raise IOError('too small')
                open(dest, 'wb').write(data)
                return 'live' if attempt == 0 else 'wayback'
            except Exception as e:
                err = e
                time.sleep(2 + t * 3)
    print('   FAIL', u, err)
    return 'fail'

# reuse anything already mirrored
stats = {}
for i, u in enumerate(sorted(urls), 1):
    dest = os.path.join(OUT, rel(u).replace('/', os.sep))
    mirrored = os.path.join('_mirror', 'wp-content', 'uploads', rel(u).replace('/', os.sep))
    if not os.path.exists(dest) and os.path.exists(mirrored) and os.path.getsize(mirrored) > 0:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, 'wb').write(open(mirrored, 'rb').read())
        r = 'mirror'
    else:
        r = fetch(u, dest)
        if r not in ('cached',): time.sleep(0.35)
    stats[r] = stats.get(r, 0) + 1
    if i % 25 == 0: print(f'  {i}/{len(urls)} {stats}')
print('DONE', stats)
