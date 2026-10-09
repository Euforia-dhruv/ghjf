from playwright.sync_api import sync_playwright

PAGES = [
    "index.html", "about.html", "team.html", "centres.html", "elite-programs.html",
    "other-programs.html", "book-a-class.html", "contact.html", "press-release.html",
    "testimonials.html",
]

with sync_playwright() as p:
    b = p.chromium.launch()
    problems = []
    for target in PAGES:
        pg = b.new_page(viewport={"width": 1440, "height": 900})
        errors, failed = [], []
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.on("requestfailed", lambda r: failed.append(f"{r.failure} {r.url}"))
        pg.goto(f"http://127.0.0.1:8123/{target}", wait_until="load")
        pg.wait_for_timeout(1500)
        info = pg.evaluate("""() => ({
            h1: document.querySelector('h1')?.textContent.trim().slice(0, 50),
            brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
            overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        })""")
        real_failed = [f for f in failed if "ERR_ABORTED" not in f]
        issues = errors + real_failed + info["brokenImgs"] + (["H-OVERFLOW"] if info["overflow"] else [])
        print(f"{'OK' if not issues else 'ISSUES':6} {target:24} h1={info['h1']!r}")
        for i in issues[:5]:
            print("      -", i[:140])
        if issues:
            problems.append(target)
        pg.close()
    b.close()
    print("\nRESULT:", "ALL CLEAN" if not problems else f"problems in {problems}")
