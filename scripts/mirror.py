# -*- coding: utf-8 -*-
"""Build a local mirror of the original homepage for visual reference."""
import os, re, sys, time, urllib.request, urllib.parse, hashlib
sys.stdout.reconfigure(encoding='utf-8')

ROOT = '_mirror'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

def fetch(url, dest, tries=3):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return True
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for t in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://hoatayviet.net/'})
            with urllib.request.urlopen(req, timeout=45) as r:
                data = r.read()
            if not data:
                raise IOError('empty')
            with open(dest, 'wb') as f:
                f.write(data)
            return True
        except Exception as e:
            if t == tries - 1:
                print('  FAIL', url, e)
                return False
            time.sleep(2 + t * 3)
    return False

def local_path(url):
    """Map an absolute hoatayviet URL to a local mirror path."""
    p = urllib.parse.urlparse(url)
    path = p.path.lstrip('/')
    if not path:
        path = 'index.html'
    return os.path.join(ROOT, path.replace('/', os.sep))

html = open('_raw/home.html', encoding='utf-8').read()

# ---- collect asset URLs from HTML ----
assets = set()
for m in re.finditer(r'https://hoatayviet\.net/wp-content/uploads/[^"\'\s)]+?\.(?:jpg|jpeg|png|webp|gif|svg)', html, re.I):
    assets.add(m.group(0))

print('uploads found in html:', len(assets))

ok = fail = 0
for i, u in enumerate(sorted(assets), 1):
    d = local_path(u)
    if fetch(u, d): ok += 1
    else: fail += 1
    if i % 10 == 0:
        print(f'  {i}/{len(assets)} ok={ok} fail={fail}')
    time.sleep(0.35)          # throttle: origin rate-limits bursts
print('images ok=%d fail=%d' % (ok, fail))

# ---- css / js ----
os.makedirs(ROOT + '/assets', exist_ok=True)
import shutil
shutil.copy('_raw/main.css', ROOT + '/assets/main.css')
shutil.copy('_raw/main.js', ROOT + '/assets/main.js')
shutil.copy('_raw/jquery.js', ROOT + '/assets/jquery.js')

# theme static assets referenced by css
for rel in ['wp-content/themes/flatsome/assets/img/shadow@2x.png',
            'wp-content/themes/flatsome/assets/img/underline.png',
            'wp-content/plugins/quick-call-button/images/quick-call-button.png',
            'wp-content/plugins/quick-call-button/images/quick-call-button-phone.png',
            'wp-content/themes/flatsome/assets/img/missing.jpg']:
    fetch('https://hoatayviet.net/' + rel, os.path.join(ROOT, rel.replace('/', os.sep)))
    time.sleep(0.3)

# ---- rewrite html ----
out = html
out = out.replace('https://hoatayviet.net/wp-content/litespeed/css/9afb8dbcea0378f75114aeb76156947d.css?ver=effb1', 'assets/main.css')
out = out.replace('https://hoatayviet.net/wp-content/litespeed/js/c6fa2d3182661631217d5dc7d2a84f5d.js?ver=effb1', 'assets/main.js')
out = out.replace('https://hoatayviet.net/wp-includes/js/jquery/jquery.min.js?ver=3.7.1', 'assets/jquery.js')
out = re.sub(r'https://hoatayviet\.net/', '', out)
# strip external ad / analytics scripts
out = re.sub(r'<script[^>]*googlesyndication[^>]*>.*?</script>', '', out, flags=re.S)
out = re.sub(r'<script[^>]*html5shim[^>]*>.*?</script>', '', out, flags=re.S)
out = out.replace('https://maxcdn.bootstrapcdn.com', 'https://maxcdn.bootstrapcdn.com')  # keep FA cdn
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(out)
print('mirror written ->', ROOT)
