// Confirms the Vietnamese text already baked into each page's data-i18n
// elements matches assets/js/i18n.js exactly — this must hold now that JS no
// longer rewrites the DOM on a default (vi) load.
import fs from "node:fs";
import vm from "node:vm";

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/i18n.js", "utf8").replace(/document\.addEventListener[\s\S]*$/, ""), sandbox);
const I18N = vm.runInContext("I18N", sandbox);

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&times;/g, "×")
    .replace(/&#8211;/g, "–");
}

const files = ["index.html", "catalog.html", "about.html", "contact.html", "news.html"].filter(fs.existsSync);
let mismatches = 0;
let checked = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const re = /data-i18n="([^"]+)"[^>]*>([^<]*)</g;
  let m;
  while ((m = re.exec(html))) {
    const key = m[1];
    if (!key) continue;
    const actual = decodeEntities(m[2]).trim();
    const entry = I18N[key];
    if (!entry) {
      console.log(`[${file}] UNKNOWN KEY: ${key}`);
      mismatches++;
      continue;
    }
    checked++;
    if (entry.vi.trim() !== actual) {
      console.log(`[${file}] MISMATCH for "${key}":\n  static: ${actual}\n  dict:   ${entry.vi}`);
      mismatches++;
    }
  }
}

console.log(`\nChecked ${checked} data-i18n text nodes across ${files.length} files. ${mismatches} mismatch(es).`);
process.exit(mismatches ? 1 : 0);
