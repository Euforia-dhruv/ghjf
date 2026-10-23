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


# Deep lagoon palette (#07506F/#042E44/#5FE3E0/#FF7A5A/#FFEFC4) — every pair used (AA >= 4.5, UI >= 3)
BG = "#07506f"          # body / lagoon
MIST = "#05405c"        # .section.mist
WHITE = "#042e44"       # .section.white (deep band)
CARD = "#032334"        # --bg-card rgba(1,20,32,.75) over #07506f (computed)
FOOT = "#03212f"        # footer
GRAD_A = "#07506f"      # --grad start
GRAD_B = "#042e44"      # --grad end
INPUT = "#042536"       # form input bg rgba(3,31,46,.88) over BG (computed)
TINT = "#264048"        # cream-tinted pill bg over card (computed)
CORAL = "#ff7a5a"       # --accent (actions)
CORAL_H = "#ff9a7d"     # --accent-hover
ON_ACCENT = "#04222f"   # text on coral
OUTLINE = "#8fb0be"     # white .55 border over BG (computed)
pairs = [
    ("ink on bg", "#ffefc4", BG),
    ("ink-soft on bg", "#f3e9cb", BG),
    ("ink-soft on mist", "#f3e9cb", MIST),
    ("ink-soft on white-sec", "#f3e9cb", WHITE),
    ("ink-soft on card", "#f3e9cb", CARD),
    ("ink on card", "#ffefc4", CARD),
    ("ink on mist", "#ffefc4", MIST),
    ("ink on white-sec", "#ffefc4", WHITE),
    ("sky eyebrow/links on bg", "#9febff", BG),
    ("sky on card", "#9febff", CARD),
    ("sky on mist", "#9febff", MIST),
    ("sky on white-sec", "#9febff", WHITE),
    ("sky on grad start", "#9febff", GRAD_A),
    ("sky on grad end", "#9febff", GRAD_B),
    ("links on bg", "#e0f4ff", BG),
    ("links on white-sec", "#e0f4ff", WHITE),
    ("dark on coral CTA", ON_ACCENT, CORAL),
    ("dark on coral hover", ON_ACCENT, CORAL_H),
    ("dark on coral age badge", ON_ACCENT, CORAL),
    ("white on grad start", "#ffffff", GRAD_A),
    ("white on grad end", "#ffffff", GRAD_B),
    ("white on footer", "#ffffff", FOOT),
    ("footer a 82% on footer", "#d1d1d1", FOOT),
    ("sky hover on footer", "#9febff", FOOT),
    ("err text on card", "#ff8a80", CARD),
    ("req sky on card", "#9febff", CARD),
    ("req sky on input", "#9febff", INPUT),
    ("ink on input bg", "#ffefc4", INPUT),
    ("ink outline btn over white-sec", "#ffefc4", WHITE),
    ("aqua stat num on card (large)", "#5fe3e0", CARD),
    ("skip: lagoon on cream", BG, "#ffefc4"),
    ("focus ring cream vs bg (UI 3:1)", "#ffefc4", BG),
    ("focus ring cream vs card (UI 3:1)", "#ffefc4", CARD),
    ("day-chip sky on tint", "#9febff", TINT),
    ("slider-nav hover dark on coral", ON_ACCENT, CORAL),
    ("coral vs bg (UI 3:1)", CORAL, BG),
    ("outline btn border vs bg (UI 3:1)", OUTLINE, BG),
]
for name, fg, bg in pairs:
    r = ratio(fg, bg)
    print(f"{'PASS' if r >= 4.5 else ('AA-large' if r >= 3 else 'FAIL'):8} {r:5}  {name}")
