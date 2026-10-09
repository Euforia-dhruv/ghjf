import re
from pathlib import Path

f = Path(__file__).resolve().parent.parent / "assets" / "css" / "style.css"
c = f.read_text(encoding="utf-8")

subs = [
    (r"background: linear-gradient\(135deg, var\(--blue\) 0%, var\(--teal-dark\) 55%, var\(--teal\) 100%\);", "background: var(--grad);"),
    (r"background: linear-gradient\(135deg, var\(--blue\) 0%, var\(--teal-dark\) 100%\);", "background: var(--grad);"),
    (r"background: linear-gradient\(120deg, var\(--blue\), var\(--teal-dark\)\);", "background: var(--grad);"),
    (r"box-shadow: 0 10px 22px rgba\(226, 131, 51, \.35\);", "box-shadow: 0 10px 22px rgba(180, 90, 18, .35);"),
    (r"box-shadow: 0 10px 22px rgba\(85, 173, 219, \.35\);", "box-shadow: 0 10px 22px rgba(30, 110, 159, .35);"),
    (r"color: rgba\(255, 255, 255, \.92\); margin-bottom: 1\.8rem;", "color: rgba(255, 255, 255, .95); margin-bottom: 1.8rem;"),
    (r"color: rgba\(255, 255, 255, \.9\); margin-bottom:", "color: rgba(255, 255, 255, .95); margin-bottom:"),
    (r"\.page-hero \.lead \{ color: rgba\(255, 255, 255, \.9\); \}", ".page-hero .lead { color: rgba(255, 255, 255, .95); }"),
    (r"background: rgba\(255, 255, 255, \.16\); border: 1px solid rgba\(255, 255, 255, \.35\);", "background: rgba(0, 0, 0, .25); border: 1px solid rgba(255, 255, 255, .4);"),
    (r"color: #fff; background: rgba\(255, 255, 255, \.18\);", "color: #fff; background: rgba(0, 0, 0, .22);"),
    (r"\.page-hero \.crumbs \{ font-size: \.85rem; opacity: \.85; margin-bottom: \.8rem; \}", ".page-hero .crumbs { font-size: \.85rem; color: rgba(255, 255, 255, .95); margin-bottom: \.8rem; }"),
    (r"color: rgba\(255, 255, 255, \.92\); max-width: 54ch", "color: rgba(255, 255, 255, .95); max-width: 54ch"),
    (r"\.btn-blue \{ background: var\(--blue\);", ".btn-blue { background: var(--blue-deep);"),
    (r"\.slider-nav button:hover \{ background: var\(--blue\);", ".slider-nav button:hover { background: var(--blue-deep);"),
    (r"color: var\(--teal-dark\); \}", "color: var(--teal-deep); }"),
    (r"background: rgba\(114, 199, 206, \.28\); color: var\(--teal-dark\);", "background: rgba(114, 199, 206, .28); color: var(--blue-deep);"),
    (r"\.site-footer h4 \{", ".site-footer h2 {"),
    (r"\.info-card h3 \{", ".info-card h3, .info-card h2 {"),
    (r"\.member small \{", ".member small {"),
]
for old, new in subs:
    c2 = re.sub(old, new, c)
    if c2 == c and "member small" not in old and "page-hero .crumbs" not in old and "page-hero .lead" not in old and "site-footer" not in old and "info-card" not in old:
        print("NO MATCH:", old[:70])
    c = c2

f.write_text(c, encoding="utf-8")
checks = ["var(--grad)", "rgba(0, 0, 0, .25)", ".btn-blue { background: var(--blue-deep)", ".site-footer h2", ".info-card h3, .info-card h2", "var(--teal-deep); }", "color: var(--blue-deep); }"]
for ch in checks:
    print(("OK  " if ch in c else "MISS") + " " + ch)
