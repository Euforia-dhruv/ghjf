"""axe-core audit: fails (exit 1) on any WCAG violation, reports best-practice separately."""
import subprocess, sys, threading, time, functools
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["index.html", "about.html", "team.html", "centres.html", "elite-programs.html",
         "other-programs.html", "book-a-class.html", "contact.html", "press-release.html",
         "testimonials.html", "404.html"]
AXE = (ROOT / "tools" / "axe.min.js").read_text(encoding="utf-8")
PORT = 8124

srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)], cwd=str(ROOT),
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)

wcag_fail, practice_fail = 0, 0
try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        for name in PAGES:
            url = f"http://127.0.0.1:{PORT}/{'' if name == 'index.html' else name}"
            page.goto(url, wait_until="networkidle")
            page.add_script_tag(content=AXE)
            res = page.evaluate("""async () => {
                const r = await axe.run(document, {
                    runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] }
                });
                return r.violations.map(v => ({
                    id: v.id, impact: v.impact, help: v.help, tags: v.tags,
                    nodes: v.nodes.slice(0, 4).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary||'').split('\\n')[1])
                }));
            }""")
            if not res:
                print(f"PASS {name}")
                continue
            for v in res:
                wcag_tags = any(t.startswith("wcag") for t in (v.get("tags") or []))
                tag = "WCAG " if wcag_tags else "PRACTICE "
                if wcag_tags:
                    wcag_fail += 1
                else:
                    practice_fail += 1
                print(f"{tag} {name} [{v['impact']}] {v['id']}: {v['help']}")
                for n in v["nodes"]:
                    print(f"      {n[:220]}")
        browser.close()
finally:
    srv.terminate()

print(f"\nWCAG violations: {wcag_fail} | best-practice: {practice_fail}")
sys.exit(1 if wcag_fail else 0)
