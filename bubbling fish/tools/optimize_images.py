import io
import re
import urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}
URL_RE = re.compile(r"https://thebubblingfish\.com/wp-content/[^\"'\s\)]+?\.(?:png|jpe?g|avif|webp|svg)", re.I)


def slug(url: str) -> str:
    path = url.split("/wp-content/", 1)[1]
    path = re.sub(r"\.[a-z0-9]+$", "", path, flags=re.I)
    return re.sub(r"[^a-zA-Z0-9]+", "-", path).strip("-").lower()


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def to_webp(url: str, max_side: int = 1400) -> str | None:
    name = slug(url) + ".webp"
    dest = OUT / name
    if dest.exists():
        return f"assets/img/{name}"
    try:
        im = Image.open(io.BytesIO(fetch(url)))
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        scale = min(1.0, max_side / max(im.size))
        if scale < 1.0:
            im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
        im.save(dest, "WEBP", quality=82, method=6)
        print(f"ok {name} ({im.width}x{im.height})")
        return f"assets/img/{name}"
    except Exception as e:
        print(f"FAIL {url}: {e}")
        return None


urls = set()
for f in list(SRC.glob("*.html")) + [ROOT / "tools" / "build.mjs"]:
    txt = f.read_text(encoding="utf-8").replace("${SITE}", "https://thebubblingfish.com")
    urls |= set(URL_RE.findall(txt))
urls = {u for u in urls if not u.endswith(".svg") or "GettyImages" not in u}

# about page hero: swap the decorative SVG (renders poorly) for a real photo
SVG = "https://thebubblingfish.com/wp-content/uploads/2025/03/GettyImages-1958747481.svg"
REPL = "https://thebubblingfish.com/wp-content/uploads/2026/04/BF220_edited_edited.avif"
about = SRC / "about.html"
if SVG in about.read_text(encoding="utf-8"):
    about.write_text(about.read_text(encoding="utf-8").replace(SVG, REPL), encoding="utf-8")
    urls.discard(SVG)
    urls.add(REPL)

mapping = {}
for u in sorted(urls):
    local = to_webp(u)
    if local:
        mapping[u] = local

for f in SRC.glob("*.html"):
    txt = f.read_text(encoding="utf-8")
    for old, new in mapping.items():
        txt = txt.replace(old, new)
    f.write_text(txt, encoding="utf-8")

# build layout references (logo / footer logo use ${SITE}-prefixed URLs)
build = ROOT / "tools" / "build.mjs"
btxt = build.read_text(encoding="utf-8")
for old, new in mapping.items():
    btxt = btxt.replace(old, new).replace(old.replace("https://thebubblingfish.com", "${SITE}"), new)
build.write_text(btxt, encoding="utf-8")

# favicon + og image from the logo and hero
def find(sub: str) -> Path | None:
    hits = list(OUT.glob(f"*{sub}*.webp"))
    return hits[0] if hits else None


logo = find("no-10-residency-rd")
hero = find("bi6a9563")
if logo:
    im = Image.open(logo).convert("RGBA")
    im.resize((180, 180), Image.LANCZOS).save(OUT.parent / "apple-touch-icon.png")
    im.resize((32, 32), Image.LANCZOS).save(OUT.parent / "favicon-32.png")
    im.resize((16, 16), Image.LANCZOS).save(OUT.parent / "favicon-16.png")
    im.resize((48, 48), Image.LANCZOS).save(OUT.parent / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("favicons ok")
if hero:
    im = Image.open(hero).convert("RGB")
    w, h = im.size
    tw, th = 1200, 630
    crop = max(tw / w, th / h)
    im = im.resize((round(w * crop), round(h * crop)), Image.LANCZOS)
    left, top = (im.width - tw) // 2, (im.height - th) // 2
    im.crop((left, top, left + tw, top + th)).save(OUT / "og-image.jpg", quality=85)
    print("og image ok")

print(f"\n{len(mapping)}/{len(urls)} images localized")
