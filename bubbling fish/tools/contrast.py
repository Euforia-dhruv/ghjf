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


# Electric cobalt theme — every text/UI pair actually used (AA >= 4.5, UI >= 3)
BG = "#0736bb"          # body / cream (electric cobalt canvas)
MIST = "#052ba0"        # .section.mist
WHITE = "#0f3fc4"       # .section.white
CARD = "#051e77"        # --bg-card rgba(3,20,92,.72) over #0736bb (computed)
FOOT = "#02123f"        # footer
GRAD_A = "#0736bb"      # --grad start (cobalt)
GRAD_B = "#8a3d00"      # --grad end (burnt tangerine)
INPUT = "#051968"       # form input bg rgba(4,20,90,.85) over BG (computed)
TINT = "#293375"        # tangerine-tinted pill bg over card (computed)
pairs = [
    ("ink on bg", "#f5e6cb", BG),
    ("ink-soft on bg", "#e4d3ac", BG),
    ("ink-soft on mist", "#e4d3ac", MIST),
    ("ink-soft on white-sec", "#e4d3ac", WHITE),
    ("ink-soft on card", "#e4d3ac", CARD),
    ("ink on card", "#f5e6cb", CARD),
    ("ink on mist", "#f5e6cb", MIST),
    ("ink on white-sec", "#f5e6cb", WHITE),
    ("orange eyebrow/links on bg", "#ffb366", BG),
    ("orange on card", "#ffb366", CARD),
    ("orange on mist", "#ffb366", MIST),
    ("orange on white-sec", "#ffb366", WHITE),
    ("orange on grad cobalt", "#ffb366", GRAD_A),
    ("orange on grad tangerine", "#ffb366", GRAD_B),
    ("dark CTA: dark on tangerine", "#160b09", "#ff7900"),
    ("dark CTA hover: dark on tangerine", "#160b09", "#ff9a33"),
    ("dark on tangerine age badge", "#160b09", "#ff7900"),
    ("white on grad start", "#ffffff", GRAD_A),
    ("white on grad end", "#ffffff", GRAD_B),
    ("white on footer", "#ffffff", FOOT),
    ("footer a 82% on footer", "#d1d1d1", FOOT),
    ("tangerine hover on footer", "#ffb366", FOOT),
    ("err text on card", "#ff8a80", CARD),
    ("req orange on card", "#ffb366", CARD),
    ("req orange on input", "#ffb366", INPUT),
    ("ink on input bg", "#f5e6cb", INPUT),
    ("ink outline btn over white-sec", "#f5e6cb", WHITE),
    ("tangerine stat num on card (large)", "#ffb366", CARD),
    ("skip: dark on tangerine", "#160b09", "#ff7900"),
    ("focus ring tangerine vs bg (UI 3:1)", "#ff7900", BG),
    ("focus ring tangerine vs card (UI 3:1)", "#ff7900", CARD),
    ("day-chip orange on tint", "#ffb366", TINT),
    ("slider-nav hover dark on tangerine", "#160b09", "#ff7900"),
    ("outline btn border vs bg (UI 3:1)", "#7793d3", BG),
]
for name, fg, bg in pairs:
    r = ratio(fg, bg)
    print(f"{'PASS' if r >= 4.5 else ('AA-large' if r >= 3 else 'FAIL'):8} {r:5}  {name}")
