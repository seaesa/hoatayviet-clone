import fs from "node:fs";

function readFrag(name) {
  return fs.readFileSync(`scripts/out/${name}`, "utf8").trimEnd();
}

const categoryGrid = readFrag("category-grid.html");
const featuredGrid = readFrag("featured-grid.html");
const catalogGrid = readFrag("catalog-grid.html");
const filterChips = readFrag("filter-chips.html");
const productOptions = readFrag("product-options.html");

function replaceOrThrow(s, marker, build, file) {
  if (!s.includes(marker)) throw new Error(`Marker not found in ${file}: ${marker}`);
  return s.replace(marker, build);
}

// index.html
{
  let s = fs.readFileSync("index.html", "utf8");
  s = replaceOrThrow(s, `<div class="cat-grid" data-category-grid></div>`, `<div class="cat-grid" data-category-grid>\n${categoryGrid}\n    </div>`, "index.html");
  s = replaceOrThrow(s, `<div class="product-grid" data-featured-grid></div>`, `<div class="product-grid" data-featured-grid>\n${featuredGrid}\n    </div>`, "index.html");
  fs.writeFileSync("index.html", s);
  console.log("Spliced index.html");
}

// catalog.html
{
  let s = fs.readFileSync("catalog.html", "utf8");
  s = replaceOrThrow(s, `<div class="filter-chips" data-filter-chips></div>`, `<div class="filter-chips" data-filter-chips>\n${filterChips}\n    </div>`, "catalog.html");
  s = replaceOrThrow(s, `<div class="product-grid" data-catalog-grid></div>`, `<div class="product-grid" data-catalog-grid>\n${catalogGrid}\n    </div>`, "catalog.html");
  fs.writeFileSync("catalog.html", s);
  console.log("Spliced catalog.html");
}

// contact.html — static <select> options
{
  let s = fs.readFileSync("contact.html", "utf8");
  const marker = `<select id="f-product" name="product"></select>`;
  const build = `<select id="f-product" name="product">\n        <option value="" data-i18n="contact.formProductAny">Chưa xác định / tư vấn chung</option>\n${productOptions}\n      </select>`;
  s = replaceOrThrow(s, marker, build, "contact.html");
  fs.writeFileSync("contact.html", s);
  console.log("Spliced contact.html");
}
