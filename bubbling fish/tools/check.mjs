import { readFileSync, readdirSync, existsSync } from "node:fs";

const files = readdirSync(".").filter((f) => f.endsWith(".html"));
const bad = [];
for (const f of files) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|#|mailto:|tel:|data:)/.test(u)) continue;
    const path = u.split(/[?#]/)[0];
    if (path && !existsSync(path)) bad.push(`${f} -> ${u}`);
  }
}
if (bad.length) {
  console.error("BROKEN LINKS:\n" + bad.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} pages, all internal links resolve`);
