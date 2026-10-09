import json
lh = json.load(open("lighthouse.json", encoding="utf-8"))
for k, v in sorted(lh["audits"].items()):
    s = v.get("score")
    if s is not None and s < 0.9 and v.get("scoreDisplayMode") not in ("notApplicable", "informative"):
        print(f"{s:>5} {k}: {v.get('title')} | {v.get('displayValue') or ''}")
        for it in (v.get("details") or {}).get("items", [])[:4]:
            print("      ", str(it)[:200])
metrics = {k: lh["audits"][k]["numericValue"] for k in
           ("first-contentful-paint", "largest-contentful-paint", "speed-index",
            "interactive", "total-blocking-time", "cumulative-layout-shift")
           if k in lh["audits"]}
print({k: round(v) for k, v in metrics.items()})
