// Re-splices a generated fragment into a container `<div ...>...</div>` that
// already holds a previous generation of that fragment (or is still the
// original empty placeholder) — finds the matching close tag by depth
// counting so it's safe regardless of how much markup is nested inside.
import fs from "node:fs";

function replaceContainer(html, openTagRegex, newInner) {
  const openMatch = html.match(openTagRegex);
  if (!openMatch) throw new Error("Open tag not found: " + openTagRegex);
  const start = openMatch.index;
  const afterOpen = start + openMatch[0].length;
  let depth = 1;
  let i = afterOpen;
  const tagRe = /<div\b|<\/div>/g;
  tagRe.lastIndex = afterOpen;
  let m;
  while ((m = tagRe.exec(html))) {
    if (m[0] === "<div") depth++;
    else depth--;
    if (depth === 0) {
      i = m.index;
      break;
    }
  }
  const before = html.slice(0, afterOpen);
  const after = html.slice(i);
  return before + "\n" + newInner + "\n    " + after;
}

function readFrag(name) {
  return fs.readFileSync(`scripts/out/${name}`, "utf8").trimEnd();
}

const [, , file, containerAttr, fragName] = process.argv;
if (!file || !containerAttr || !fragName) {
  console.error("Usage: node resplice-container.mjs <file.html> <data-attr> <fragment.html>");
  process.exit(1);
}

let html = fs.readFileSync(file, "utf8");
const openTagRegex = new RegExp(`<div[^>]*${containerAttr}[^>]*>`);
html = replaceContainer(html, openTagRegex, readFrag(fragName));
fs.writeFileSync(file, html);
console.log(`Re-spliced ${fragName} into ${file} (${containerAttr})`);
