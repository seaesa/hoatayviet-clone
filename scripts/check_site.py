# -*- coding: utf-8 -*-
"""Verify every internal href/src in the generated site resolves to a real file."""
import os, re, sys, urllib.parse
sys.stdout.reconfigure(encoding='utf-8')

ROOT = 'site'
pages, bad_links, bad_assets, ext = [], [], [], set()

for dirpath, _dirs, files in os.walk(ROOT):
    for f in files:
        if f.endswith('.html'):
            pages.append(os.path.join(dirpath, f))

def resolve(page, ref):
    ref = ref.split('#')[0].split('?')[0]
    if not ref:
        return None
    if re.match(r'^(https?:)?//|^(mailto|tel|javascript|data):', ref):
        ext.add(ref.split('?')[0][:70])
        return None
    base = os.path.dirname(page)
    return os.path.normpath(os.path.join(base, urllib.parse.unquote(ref)))

for page in pages:
    s = open(page, encoding='utf-8').read()
    for m in re.finditer(r'\shref="([^"]+)"', s):
        t = resolve(page, m.group(1))
        if t and not os.path.exists(t):
            bad_links.append((page, m.group(1)))
    for m in re.finditer(r'\ssrc="([^"]+)"', s):
        t = resolve(page, m.group(1))
        if t and not os.path.exists(t):
            bad_assets.append((page, m.group(1)))
    # background-image url() in inline styles
    for m in re.finditer(r'background-image:url\(&quot;([^&]+)&quot;\)', s):
        t = resolve(page, m.group(1))
        if t and not os.path.exists(t):
            bad_assets.append((page, m.group(1)))

print('pages           :', len(pages))
print('broken links    :', len(bad_links))
for p, r in bad_links[:15]:
    print('   ', p, '->', r)
print('broken assets   :', len(bad_assets))
for p, r in bad_assets[:15]:
    print('   ', p, '->', r)
print('external refs   :', len(ext))
for x in sorted(ext):
    print('   ', x)

imgs = sum(len(fs) for _d, _s, fs in os.walk(os.path.join(ROOT, 'assets', 'img')))
print('local images    :', imgs)
