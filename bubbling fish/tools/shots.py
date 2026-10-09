import sys
from playwright.sync_api import sync_playwright

PAGES = sys.argv[1:] or ["index.html"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp, tag in [((1440, 900), "desktop"), ((390, 844), "mobile")]:
        page = browser.new_page(viewport={"width": vp[0], "height": vp[1]})
        for target in PAGES:
            page.goto(f"http://127.0.0.1:8123/{target}", wait_until="load", timeout=60000)
            page.wait_for_timeout(1200)
            page.evaluate("""async () => {
                document.documentElement.style.scrollBehavior = 'auto';
                const step = window.innerHeight / 2;
                for (let y = 0; y < document.body.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 140));
                }
                window.scrollTo(0, 0);
                await new Promise(r => setTimeout(r, 1600));
            }""")
            name = target.replace(".html", "").replace("index", "home")
            page.screenshot(path=f"_shot_{name}_{tag}.png", full_page=True)
            print(f"shot: _shot_{name}_{tag}.png")
        page.close()
    browser.close()
