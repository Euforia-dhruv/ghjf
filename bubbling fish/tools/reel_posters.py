"""Extract poster frames for the 3 reels and add poster= attrs."""
import re, subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
f = root / "src" / "home.html"
html = f.read_text(encoding="utf-8")

urls = re.findall(r'<video src="([^"]+)"', html)
for i, url in enumerate(urls, 1):
    out = root / "assets" / "img" / f"reel-{i}.jpg"
    if not out.exists():
        r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", "0.5", "-i", url,
                            "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "4", str(out)])
        print(("ok " if r.returncode == 0 else f"fail({r.returncode}) ") + out.name)
    html = html.replace(f'<video src="{url}"', f'<video src="{url}" poster="assets/img/reel-{i}.jpg"', 1)

f.write_text(html, encoding="utf-8")
print("poster attrs:", html.count("poster="))
