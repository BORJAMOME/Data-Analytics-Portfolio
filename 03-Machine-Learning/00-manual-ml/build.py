#!/usr/bin/env python3
"""Genera el manual como UN único HTML autocontenido a partir de src/.

Uso:
  python3 build.py                 -> ml_manual_modelos.html
  python3 build.py --harness OUT   -> página mínima para probar los visuales (VIZ) sueltos
"""
import glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")

def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()

def scripts(files):
    return "\n".join("<script>\n/* ── %s ── */\n%s\n</script>" % (f, read(f)) for f in files)

def viz_files():
    return sorted(os.path.basename(p) for p in glob.glob(os.path.join(SRC, "viz-*.js")))

def content_files():
    pats = ("easy-*.js", "casos-*.js", "audit.js")
    out = []
    for p in pats:
        out += sorted(os.path.basename(x) for x in glob.glob(os.path.join(SRC, p)))
    return out

def build(out):
    files = ["core.js"] + viz_files() + content_files() + ["app.js"]
    html = read("template.html").replace("{{CSS}}", read("styles.css")) \
        .replace("{{BODY}}", read("body.html")).replace("{{SCRIPTS}}", scripts(files))
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("OK ->", out, "(%d KB)" % (len(html.encode()) // 1024), "·", ", ".join(files))

HARNESS_JS = r"""
var byId = {}, FAM = {}, MODELS = [];
function glossLink(){}
function harness(){
  var id = location.hash.slice(1), host = document.getElementById("h");
  labCleanupAll();
  if(!id){
    host.innerHTML = "<h1>Visuales VIZ (" + VIZ.length + ")</h1><ul>" + VIZ.map(function(v){
      return '<li><a href="#' + v.id + '">' + v.id + " · " + v.t + "</a></li>"; }).join("") + "</ul>";
    return;
  }
  host.innerHTML = '<p><a href="#">← índice</a></p><h1>' + id + '</h1><div id="hh"></div>';
  mountLab(id, document.getElementById("hh"), {compact: location.search.indexOf("compact") > -1});
}
window.addEventListener("hashchange", harness); harness();
"""

def harness(out):
    files = ["core.js"] + viz_files()
    html = read("template.html").replace("{{CSS}}", read("styles.css")) \
        .replace("{{BODY}}", '<div class="wrap" style="max-width:1100px;margin:0 auto"><div id="h"></div></div>') \
        .replace("{{SCRIPTS}}", scripts(files) + "<script>" + HARNESS_JS + "</script>")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("Harness ->", out)

if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--harness":
        harness(sys.argv[2])
    else:
        build(os.path.join(HERE, "ml_manual_modelos.html"))
