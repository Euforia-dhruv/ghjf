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


# StringTune-inspired dark theme — every text/UI pair actually used (AA >= 4.5, UI >= 3)
BG = "#030a17"          # body / cream
MIST = "#06152d"        # .section.mist
WHITE = "#0a192f"       # .section.white
CARD = "#081428"        # --bg-card rgba(10,25,47,.7) over #030a17 (computed)
FOOT = "#02060d"        # footer
GRAD_A = "#0b1b33"      # --grad start (navy)
GRAD_B = "#241016"      # --grad end (dark maroon)
INPUT = "#071019"       # form input bg
TINT = "#051e26"        # cyan-tinted pill bg over card/bg
pairs = [
    ("ink on bg", "#f8fafc", BG),
    ("ink-soft on bg", "#bfcadb", BG),
    ("ink-soft on mist", "#bfcadb", MIST),
    ("ink-soft on white-sec", "#bfcadb", WHITE),
    ("ink-soft on card", "#bfcadb", CARD),
    ("ink on card", "#f8fafc", CARD),
    ("ink on mist", "#f8fafc", MIST),
    ("ink on white-sec", "#f8fafc", WHITE),
    ("cyan eyebrow/links on bg", "#00f0ff", BG),
    ("cyan on card", "#00f0ff", CARD),
    ("cyan on mist", "#00f0ff", MIST),
    ("cyan on grad navy", "#00f0ff", GRAD_A),
    ("cyan on grad maroon", "#00f0ff", GRAD_B),
    ("coral CTA: dark on coral", "#160b09", "#ff4f36"),
    ("coral CTA hover: dark on coral", "#160b09", "#ff6a54"),
    ("dark on cyan age badge", "#030a17", "#00f0ff"),
    ("white on grad start", "#ffffff", GRAD_A),
    ("white on grad end", "#ffffff", GRAD_B),
    ("white on footer", "#ffffff", FOOT),
    ("footer a 82% on footer", "#d1d1d1", FOOT),
    ("teal hover on footer", "#7bfbff", FOOT),
    ("err text on card", "#ff8a80", CARD),
    ("req orange on card", "#ff9d66", CARD),
    ("req orange on input", "#ff9d66", INPUT),
    ("ink on input bg", "#f8fafc", INPUT),
    ("ink on outline btn over white-sec", "#f8fafc", WHITE),
    ("cyan stat num on card (large)", "#00f0ff", CARD),
    ("skip: dark on cyan", "#030a17", "#00f0ff"),
    ("focus ring cyan vs bg (UI 3:1)", "#00f0ff", BG),
    ("focus ring cyan vs card (UI 3:1)", "#00f0ff", CARD),
    ("day-chip cyan on tint", "#00f0ff", TINT),
    ("slider-nav hover dark on cyan", "#030a17", "#00f0ff"),
    ("outline btn border vs bg (UI 3:1)", "#75787f", BG),
]
for name, fg, bg in pairs:
    r = ratio(fg, bg)
    print(f"{'PASS' if r >= 4.5 else ('AA-large' if r >= 3 else 'FAIL'):8} {r:5}  {name}")
