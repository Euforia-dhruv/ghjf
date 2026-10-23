import sys

src = open("index.html", encoding="utf-8").read()

# compressed hero + force-reveal so everything renders in one unscrolled capture
inject = ("<style>.hero{min-height:0!important}"
          "[data-reveal]{opacity:1!important;translate:none!important}</style></head>")
test = src.replace("</head>", inject, 1)
open("test.html", "w", encoding="utf-8").write(test)

frame_hero = """<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000}iframe{display:block;border:0;width:375px;height:812px}</style>
</head><body><iframe src="index.html" title="mhero"></iframe></body></html>"""
open("frame-mhero.html", "w", encoding="utf-8").write(frame_hero)

frame_full = """<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000}iframe{display:block;border:0;width:375px;height:3900px}</style>
</head><body><iframe src="test.html" title="mfull"></iframe></body></html>"""
open("frame-mfull.html", "w", encoding="utf-8").write(frame_full)
print("wrote test.html, frame-mhero.html, frame-mfull.html")
