# -*- coding: utf-8 -*-
"""Crawl every archived product page from the Wayback Machine."""
import os, re, sys, time, json, html, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
os.makedirs('_raw/products', exist_ok=True)

rows = []
for line in open('_raw/cdx_sp.txt', encoding='utf-8'):
    parts = line.split()
    if len(parts) >= 2:
        rows.append((parts[0], parts[1]))

# de-dupe by slug, keep newest timestamp
best = {}
for url, ts in rows:
    slug = url.rstrip('/').rsplit('/', 1)[-1]
    if slug not in best or ts > best[slug][1]:
        best[slug] = (url, ts)

print('unique product slugs:', len(best))

def get(u, tries=3):
    for t in range(tries):
        try:
            req = urllib.request.Request(u, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode('utf-8', 'replace')
        except Exception as e:
            if t == tries - 1:
                print('   FAIL', e)
                return None
            time.sleep(4 + t * 5)

for i, (slug, (url, ts)) in enumerate(sorted(best.items()), 1):
    dest = f'_raw/products/{slug}.html'
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        print(f'{i}/{len(best)} {slug} (cached)')
        continue
    wb = f'https://web.archive.org/web/{ts}id_/{url}'
    print(f'{i}/{len(best)} {slug} ...', end=' ')
    h = get(wb)
    if h:
        open(dest, 'w', encoding='utf-8').write(h)
        print('ok', len(h))
    time.sleep(2.0)
