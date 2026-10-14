def lum(hex_or_rgba, base="#ffffff"):
    def parse(c):
        c = c.lstrip("#")
        if len(c) == 3:
            c = "".join(ch * 2 for ch in c)
        return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
    def over(fg, bg, alpha):
        return tuple(round(fg[i] * alpha + bg[i] * (1 - alpha)) for i in range(3))

    if isinstance(hex_or_rgba, tuple) and len(hex_or_rgba) == 4:
        rgb = over(hex_or_rgba[:3], parse(base), hex_or_rgba[3])
    else:
        rgb = parse(hex_or_rgba)
    def lin(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg="#ffffff"):
    a, b = lum(fg, bg), lum(bg)
    hi, lo = max(a, b), min(a, b)
    return round((hi + 0.05) / (lo + 0.05), 2)


# Teal-blue palette (#086288/#4D8DBA/#97D7FF/#FFEFC4) — every pair used (AA >= 4.5, UI >= 3)
BG = "#086288"          # body / cream
MIST = "#064f6e"        # .section.mist
WHITE = "#076489"       # .section.white
CARD = "#053850"        # --bg-card rgba(2,30,45,.75) over #086288 (computed)
FOOT = "#04303f"        # footer
GRAD_A = "#086288"      # --grad start
GRAD_B = "#04344b"      # --grad end
INPUT = "#052d47"       # form input bg rgba(4,40,60,.85) over BG (computed)
TINT = "#275260"        # cream-tinted pill bg over card (computed)
pairs = [
    ("ink on bg", "#ffefc4", BG),
    ("ink-soft on bg", "#f3e9cb", BG),
    ("ink-soft on mist", "#f3e9cb", MIST),
    ("ink-soft on white-sec", "#f3e9cb", WHITE),
    ("ink-soft on card", "#f3e9cb", CARD),
    ("ink on card", "#ffefc4", CARD),
    ("ink on mist", "#ffefc4", MIST),
    ("ink on white-sec", "#ffefc4", WHITE),
    ("sky eyebrow/links on bg", "#bfe6ff", BG),
    ("sky on card", "#bfe6ff", CARD),
    ("sky on mist", "#bfe6ff", MIST),
    ("sky on white-sec", "#bfe6ff", WHITE),
    ("sky on grad start", "#bfe6ff", GRAD_A),
    ("sky on grad end", "#bfe6ff", GRAD_B),
    ("links on bg", "#e0f4ff", BG),
    ("links on white-sec", "#e0f4ff", WHITE),
    ("dark CTA: dark on cream", "#04344b", "#ffefc4"),
    ("dark CTA hover: dark on sky", "#04344b", "#97d7ff"),
    ("dark on cream age badge", "#04344b", "#ffefc4"),
    ("white on grad start", "#ffffff", GRAD_A),
    ("white on grad end", "#ffffff", GRAD_B),
    ("white on footer", "#ffffff", FOOT),
    ("footer a 82% on footer", "#d1d1d1", FOOT),
    ("sky hover on footer", "#bfe6ff", FOOT),
    ("err text on card", "#ff8a80", CARD),
    ("req sky on card", "#bfe6ff", CARD),
    ("req sky on input", "#bfe6ff", INPUT),
    ("ink on input bg", "#ffefc4", INPUT),
    ("ink outline btn over white-sec", "#ffefc4", WHITE),
    ("sky stat num on card (large)", "#97d7ff", CARD),
    ("skip: dark on cream", "#04344b", "#ffefc4"),
    ("focus ring cream vs bg (UI 3:1)", "#ffefc4", BG),
    ("focus ring cream vs card (UI 3:1)", "#ffefc4", CARD),
    ("day-chip sky on tint", "#bfe6ff", TINT),
    ("slider-nav hover dark on cream", "#04344b", "#ffefc4"),
    ("outline btn border vs bg (UI 3:1)", "#8fb7cb", BG),
]
for name, fg, bg in pairs:
    r = ratio(fg, bg)
    print(f"{'PASS' if r >= 4.5 else ('AA-large' if r >= 3 else 'FAIL'):8} {r:5}  {name}")
