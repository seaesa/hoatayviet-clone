# -*- coding: utf-8 -*-
import re, sys
sys.stdout.reconfigure(encoding='utf-8')
c = open('_raw/main.css', encoding='utf-8', errors='replace').read()
pat = sys.argv[1]
maxn = int(sys.argv[2]) if len(sys.argv) > 2 else 200
n = 0
# handle @media by tracking depth crudely: emit rule with nearest preceding @media
media = []
i = 0
out = []
for m in re.finditer(r'(@media[^{]*\{)|([^{}]+)\{([^{}]*)\}|(\})', c):
    if m.group(1):
        media.append(m.group(1).strip())
    elif m.group(4):
        if media: media.pop()
    elif m.group(2) is not None:
        sel = m.group(2).strip()
        if re.search(pat, sel):
            pre = ' '.join(media) + ' ' if media else ''
            out.append(pre + sel + ' {' + m.group(3) + '}')
            n += 1
            if n >= maxn: break
sys.stdout.write('\n'.join(out) + '\n')
