import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("assets/img");

const products = JSON.parse(fs.readFileSync("scratch_products2.json", "utf8"));

const hero = [
  "https://hoatayviet.net/wp-content/uploads/2022/11/z3487042728597_daf745f2e9f46dcaf6295ec7df19df7d-768x579-1.jpg",
  "https://hoatayviet.net/wp-content/uploads/2022/11/z3150831024697_8d7e0c59a1b1af27a544a517bb227612.jpg",
  "https://hoatayviet.net/wp-content/uploads/2022/11/366219_n-768x613-1.gif",
  "https://hoatayviet.net/wp-content/uploads/2022/11/VV3.gif",
];

// Try to recover a higher-resolution original by stripping the WP "-WIDTHxHEIGHT(-N)?" resize suffix.
function candidateUrls(url) {
  const stripped = url.replace(/-\d{2,4}x\d{2,4}(-\d+)?(\.\w+)$/, "$2");
  return stripped !== url ? [stripped, url] : [url];
}

async function fetchBest(urls) {
  let best = null;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (!best || buf.length > best.buf.length) best = { buf, url: u };
    } catch {
      /* skip */
    }
  }
  return best;
}

function extOf(url, contentGuess) {
  const m = url.match(/\.(jpe?g|png|gif|webp)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : contentGuess || "jpg";
}

function slugify(name, seen) {
  let slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (seen.has(slug)) {
    let i = 2;
    while (seen.has(`${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }
  seen.add(slug);
  return slug;
}

async function run() {
  fs.mkdirSync(path.join(OUT, "products"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "hero"), { recursive: true });

  const seen = new Set();
  const manifest = [];

  // Batch of 4 concurrent downloads at a time.
  const queue = products.map((p) => ({ ...p, slug: slugify(p.name + "-" + p.href.split("/").filter(Boolean).pop(), seen) }));

  for (let i = 0; i < queue.length; i += 4) {
    const batch = queue.slice(i, i + 4);
    await Promise.all(
      batch.map(async (p) => {
        const urls = p.imgs.flatMap(candidateUrls);
        const best = await fetchBest(urls);
        if (!best) {
          console.error("FAILED:", p.name, p.href);
          manifest.push({ ...p, file: null });
          return;
        }
        const ext = extOf(best.url);
        const file = `products/${p.slug}.${ext}`;
        fs.writeFileSync(path.join(OUT, file), best.buf);
        manifest.push({ ...p, file, bytes: best.buf.length, sourceUrl: best.url });
        console.log("OK", p.name, "->", file, best.buf.length, "bytes");
      })
    );
  }

  for (let i = 0; i < hero.length; i++) {
    const url = hero[i];
    const best = await fetchBest(candidateUrls(url));
    if (!best) {
      console.error("FAILED hero:", url);
      continue;
    }
    const ext = extOf(best.url);
    const file = `hero/hero-${i + 1}.${ext}`;
    fs.writeFileSync(path.join(OUT, file), best.buf);
    console.log("OK hero", i + 1, "->", file, best.buf.length, "bytes");
  }

  fs.writeFileSync("scratch_manifest.json", JSON.stringify(manifest, null, 1));
  console.log("Done. Manifest written to scratch_manifest.json");
}

run();
