import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "..", "src");
const OUT = join(ROOT, "..");

const SITE = "https://thebubblingfish.com";
const LOGO = `assets/img/uploads-2025-03-no-10-residency-rd-shanthala-nagar-ashok-nagar-bengaluru-karnataka-560025-1.webp`;
const FOOTER_LOGO = `assets/img/uploads-2026-03-chatgpt-image-mar-30-2026-12-03-23-pm.webp`;

const nav = [
  ["index.html", "Home", "home"],
  ["about.html", "About", "about"],
  ["centres.html", "Our Centers", "centres"],
  ["elite-programs.html", "Elite Programs", "elite"],
  ["other-programs.html", "Other Programs", "other"],
  ["contact.html", "Contact", "contact"],
];

const aboutMenu = [
  ["about.html", "About Us", "about"],
  ["team.html", "Our Team", "team"],
  ["press-release.html", "Press & Features", "press"],
  ["testimonials.html", "Testimonials", "testimonials"],
];

function header(active) {
  const links = nav
    .map(([href, label, id]) => {
      if (id === "about") {
        const sub = aboutMenu
          .map(([h, l, a]) => `<a href="${h}" class="${a === active ? "is-active" : ""}">${l}</a>`)
          .join("");
        return `<div class="nav-item has-sub ${aboutMenu.some(([, , a]) => a === active) ? "is-active" : ""}">
          <a href="${href}" class="nav-link">About <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></a>
          <div class="submenu">${sub}</div>
        </div>`;
      }
      return `<a href="${href}" class="nav-link ${active === id ? "is-active" : ""}">${label}</a>`;
    })
    .join("");

  return `<header class="site-header" id="top">
  <div class="container nav-wrap">
    <a class="brand" href="index.html" aria-label="Bubbling Fish home">
      <img src="${LOGO}" alt="Bubbling Fish logo" width="52" height="52" fetchpriority="high">
      <span class="brand-text"><strong>Bubbling Fish</strong><small>Swim Academy</small></span>
    </a>
    <nav class="nav" id="nav" aria-label="Primary">
      ${links}
      <a href="book-a-class.html" class="btn btn-primary nav-cta ${active === "book" ? "is-active" : ""}">Book a Class</a>
    </nav>
    <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="nav" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

const footer = `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="${FOOTER_LOGO}" alt="Bubbling Fish" width="72" height="72" loading="lazy">
      <p>Safe, fear-free swim programs for every age — from first splash to advanced skills.</p>
      <p class="footer-contact"><a href="tel:+917635818339">+91 76358 18339</a><br><a href="tel:+919880444033">+91 9880444033</a><br><a href="mailto:info@thebubblingfish.com">info@thebubblingfish.com</a></p>
    </div>
    <div>
      <h2>Explore</h2>
      <ul>
        <li><a href="about.html">About Us</a></li>
        <li><a href="team.html">Our Team</a></li>
        <li><a href="centres.html">Our Centers</a></li>
        <li><a href="testimonials.html">Testimonials</a></li>
        <li><a href="press-release.html">Press &amp; Features</a></li>
      </ul>
    </div>
    <div>
      <h2>Programs</h2>
      <ul>
        <li><a href="book-a-class.html">Book a Class</a></li>
        <li><a href="elite-programs.html">Elite Programs</a></li>
        <li><a href="other-programs.html">Other Programs</a></li>
        <li><a href="other-programs.html#private">Private Lessons</a></li>
        <li><a href="other-programs.html#party">Swim Parties</a></li>
      </ul>
    </div>
    <div>
      <h2>Visit</h2>
      <ul>
        <li>Bengaluru, Karnataka, India</li>
        <li><a href="contact.html">Contact us</a></li>
        <li><a href="book-a-class.html">Book a Class</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>&copy; <span data-year></span> Bubbling Fish. All rights reserved.</p>
    <p><a href="#">Terms &amp; Conditions</a> · <a href="#">Privacy Policy</a></p>
  </div>
</footer>`;

function layout({ title, desc, active, body, out }) {
  const url = out === "index.html" ? `${SITE}/` : `${SITE}/${out.replace(/\.html$/, "")}`;
  const lcpPreload = out === "index.html"
    ? `\n<link rel="preload" as="image" href="assets/img/hero-poster.webp" fetchpriority="high">`
    : "";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SwimSchool",
        "@id": `${url}#org`,
        name: "Bubbling Fish Swim Academy",
        url: SITE + "/",
        logo: `${SITE}/assets/img/uploads-2025-03-no-10-residency-rd-shanthala-nagar-ashok-nagar-bengaluru-karnataka-560025-1.webp`,
        telephone: ["+917635818339", "+919880444033"],
        email: "info@thebubblingfish.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "No 10, Residency Rd, Shanthala Nagar, Ashok Nagar",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          postalCode: "560025",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}#site`,
        url: SITE + "/",
        name: "Bubbling Fish",
        publisher: { "@id": `${url}#org` },
      },
    ],
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#030a17">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Bubbling Fish Swim Academy">
<meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE}/assets/img/og-image.jpg">
<link rel="icon" href="assets/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preload" href="assets/fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/anton.woff2" as="font" type="font/woff2" crossorigin>${lcpPreload}
<link rel="stylesheet" href="assets/css/style.css">
<script>document.documentElement.classList.add("js")</script>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(active)}
<main id="main">
${body}
</main>
${footer}
<aside aria-label="Quick contact">
<a class="wa-fab" href="https://wa.me/917635818339?text=${encodeURIComponent("Hi Bubbling Fish! I'd like to know more about your swim programs.")}" target="_blank" rel="noopener" aria-label="Chat with Bubbling Fish on WhatsApp">
  <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.04 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.57-1.72a12.74 12.74 0 0 0 6.27 1.62h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05a12.71 12.71 0 0 0-9.06-3.65Zm0 23.32h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.01 1.05 1.07-3.91-.25-.4a10.57 10.57 0 0 1-1.62-5.65c0-5.87 4.78-10.65 10.65-10.65 2.84 0 5.51 1.11 7.52 3.12a10.58 10.58 0 0 1 3.12 7.54c0 5.87-4.78 10.65-10.66 10.61Zm5.84-7.98c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.53-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/></svg>
</a>
</aside>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

const pages = await readdir(SRC);
let count = 0;
for (const file of pages) {
  if (!file.endsWith(".html")) continue;
  const raw = await readFile(join(SRC, file), "utf8");
  const meta = raw.match(/^<!--meta\s+([\s\S]*?)-->/);
  const m = Object.fromEntries(
    [...meta[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]])
  );
  const body = raw.replace(meta[0], "").trim();
  const out = file === "home.html" ? "index.html" : file;
  await mkdir(dirname(join(OUT, out)), { recursive: true });
  await writeFile(join(OUT, out), layout({ ...m, body, out }), "utf8");
  count++;
}
console.log(`built ${count} pages`);
