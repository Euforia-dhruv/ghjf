import { readFileSync, writeFileSync } from "node:fs";
const h = readFileSync(new URL("../_scrape_home.html", import.meta.url), "utf8");
const v = [...h.matchAll(/src="([^"]+\.mp4)"/g)].map((m) => m[1]);
writeFileSync(new URL("../scrape/videos.json", import.meta.url), JSON.stringify(v, null, 2));
console.log(v.join("\n"));
