import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";

const BASE = "https://thebubblingfish.com";
const OUT = join(new URL("../scrape/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1").replaceAll("%20", " "));

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  console.error("FAIL", url);
  return null;
}

async function sitemapUrls(file) {
  const xml = await get(`${BASE}/${file}`);
  if (!xml) return [];
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function collectUrls() {
  const index = await get(`${BASE}/sitemap.xml`);
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.includes("sitemap-"));
  const urls = new Set();
  for (const c of children) for (const u of await sitemapUrls(c.split("/").pop())) urls.add(u);
  return [...urls].filter((u) => !/\/(users|tags)\//.test(u));
}

function extract(html, url) {
  const title =
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ||
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ||
    url;
  const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] || "";
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  const main =
    body.match(/<main[\s\S]*?<\/main>/i)?.[0] ||
    body.match(/<article[\s\S]*?<\/article>/i)?.[0] ||
    body.match(/<div[^>]+class="[^"]*(?:elementor-element|entry-content|site-content|page-content)[^"]*"[\s\S]*?(?=<footer)/i)?.[0] ||
    body;

  const images = [
    ...new Set(
      [...main.matchAll(/<img[^>]+src="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((s) => !/data:image|logo|icon|sprite/i.test(s))
    ),
  ];

  const text = main
    .replace(/<(h[1-6])[^>]*>/gi, "\n\n## ")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/p>|<br[^>]*>|<\/div>|<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&[a-z#0-9]+;/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, desc, images, text };
}

await mkdir(OUT, { recursive: true });
const urls = await collectUrls();
console.log(`${urls.length} pages`);

const manifest = [];
for (const url of urls) {
  const html = await get(url);
  if (!html) continue;
  const slug =
    url.replace(BASE, "").replace(/^\/$/, "home").replace(/\//g, "_").replace(/^_/, "") || "home";
  const page = extract(html, url);
  const md = `# ${page.title}\n\nURL: ${url}\n\n${page.desc ? `> ${page.desc}\n\n` : ""}${page.text}\n\n## Images (${page.images.length})\n${page.images.map((i) => `- ${i}`).join("\n")}\n`;
  await writeFile(join(OUT, `${slug}.md`), md, "utf8");
  manifest.push({ url, slug, title: page.title, images: page.images.length });
  console.log("ok", slug);
}

// theme: css files + inline palettes
const home = await readFile(join(OUT, "home.md"), "utf8").catch(() => "");
const cssUrls = [
  ...new Set(
    [...(await get(BASE) ?? "").matchAll(/href=["']([^"']+\.css[^"']*)["']/g)].map((m) =>
      m[1].startsWith("http") ? m[1] : BASE + m[1]
    )
  ),
];
await mkdir(join(OUT, "css"), { recursive: true });
for (const c of cssUrls) {
  const css = await get(c);
  if (css) await writeFile(join(OUT, "css", c.split("/").pop().split("?")[0]), css, "utf8");
}
await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`done: ${manifest.length} pages, ${cssUrls.length} css files`);
