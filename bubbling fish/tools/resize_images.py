"""Right-size images for display: logos 160, team 400, programmes 500, centres 700, reels 480, rest cap 800."""
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
SRC = ROOT / "src"

team_imgs = set(re.findall(r'src="(assets/img/[^"]+)"', (SRC / "team.html").read_text(encoding="utf-8")))
centre_imgs = set(re.findall(r'src="(assets/img/[^"]+)"', (SRC / "centres.html").read_text(encoding="utf-8")))

programme_imgs = set()
for p in ("home.html", "elite-programs.html", "other-programs.html"):
    html = (SRC / p).read_text(encoding="utf-8")
    for m in re.finditer(r'<img src="(assets/img/[^"]+)"', html):
        programme_imgs.add(m.group(1))

def cap_for(rel, name):
    if "residency-rd" in name or "chatgpt-image" in name:
        return 160
    if rel in team_imgs:
        return 400
    if rel in centre_imgs:
        return 700
    if rel in programme_imgs:
        return 500
    if name.startswith("reel-"):
        return 480
    return 800

total_saved = 0
for p in sorted(IMG.glob("*")):
    rel = f"assets/img/{p.name}"
    im = Image.open(p)
    w, h = im.size
    cap = cap_for(rel, p.name)
    before = p.stat().st_size
    changed = False
    if w > cap:
        im = im.resize((cap, round(h * cap / w)), Image.LANCZOS)
        changed = True
    if p.suffix == ".jpg":
        im.save(p, quality=72, optimize=True)
        changed = True
    elif changed or before > 60_000:
        im.save(p, "WEBP", quality=82, method=6)
        changed = True
    after = p.stat().st_size
    if after < before:
        total_saved += before - after
        print(f"{w}x{h} -> {im.size[0]}x{im.size[1]}  {before//1024}KB -> {after//1024}KB  {p.name}")
print(f"saved ~{total_saved // 1024}KB")
