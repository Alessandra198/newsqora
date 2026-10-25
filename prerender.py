#!/usr/bin/env python3
"""Pre-render the JS-built views into each page's static HTML.

The site renders its content client-side (app.js). That means the raw HTML a
crawler downloads is an empty <div id="app"></div> shell, so compliance
scanners, no-JS clients, and archive bots can't see the policy text or links.

This script loads each route in headless Chrome, captures the fully-rendered
<div id="app"> ... </div>, and splices it into the matching static file. app.js
still loads and re-renders on top for interactivity (progressive enhancement).

Re-run this after editing content in app.js:  python3 prerender.py
"""
import http.server, socketserver, threading, os, subprocess, sys, glob

def _find_chrome():
    # Playwright's bundled Chromium path changes with each version bump, so
    # resolve it dynamically instead of hard-coding it.
    pats = [
        "/opt/pw-browsers/chromium-*/chrome-linux*/chrome",
        "/opt/pw-browsers/chromium-*/chrome-linux*/headless_shell",
    ]
    hits = []
    for p in pats:
        hits += glob.glob(p)
    if not hits:
        raise FileNotFoundError("no bundled Chromium found under /opt/pw-browsers")
    # pick the highest version directory
    hits.sort(key=lambda x: int("".join(c for c in x.split("chromium-")[1].split("/")[0] if c.isdigit()) or 0))
    return hits[-1]

CHROME = _find_chrome()
PORT = 8196
ROUTES = [  # (static file, URL path)
    ("index.html", "/"),
    ("privacy.html", "/privacy"),
    ("terms.html", "/terms"),
    ("cookies.html", "/cookies"),
    ("beta.html", "/beta"),
    ("beta-terms.html", "/beta-terms"),
    ("delete-account.html", "/delete-account"),
]
EMPTY_APP = '<div id="app" data-theme="light"></div>'


class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = self.path.split("?")[0].lstrip("/")
        if p in ("", "index.html"):
            p = "index.html"
        elif os.path.exists(p):
            pass
        elif os.path.exists(p + ".html"):
            p = p + ".html"
        else:
            p = "404.html"
        try:
            data = open(p, "rb").read()
        except OSError:
            self.send_error(404); return
        self.send_response(200)
        ext = p.rsplit(".", 1)[-1]
        ct = {"html": "text/html", "js": "application/javascript",
              "css": "text/css", "svg": "image/svg+xml"}.get(ext, "application/octet-stream")
        self.send_header("Content-Type", ct); self.end_headers(); self.wfile.write(data)

    def log_message(self, *a):
        pass


def rendered_app(url):
    # Block external hosts (e.g. the GoatCounter analytics script) so they can't
    # hang the headless load during pre-render; all first-party assets are local.
    out = subprocess.run(
        [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
         "--host-resolver-rules=MAP gc.zgo.at 127.0.0.1:1,MAP *.goatcounter.com 127.0.0.1:1",
         "--virtual-time-budget=4000", "--dump-dom", url],
        capture_output=True, text=True, timeout=45).stdout
    start = out.find('<div id="app"')
    end = out.find('<script src="app.js"')
    if start == -1 or end == -1 or end < start:
        raise RuntimeError("could not locate #app in render of " + url)
    return out[start:end].rstrip()


def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(("127.0.0.1", PORT), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        snapshots = {}
        for fname, path in ROUTES:
            app_html = rendered_app(f"http://127.0.0.1:{PORT}{path}")
            snapshots[fname] = app_html
        for fname, _ in ROUTES:
            s = open(fname).read()
            if EMPTY_APP not in s:
                # already pre-rendered: reset to a clean shell first
                import re
                s = re.sub(r'<div id="app"[\s\S]*?</div>\s*(?=<script src="app\.js")',
                           EMPTY_APP + "\n  ", s, count=1)
            s = s.replace(EMPTY_APP, snapshots[fname], 1)
            open(fname, "w").write(s)
            print(f"pre-rendered {fname} ({len(snapshots[fname])} bytes of content)")
    finally:
        srv.shutdown()
    # keep the SPA fallback identical to the pre-rendered homepage
    import shutil
    shutil.copyfile("index.html", "404.html")
    print("404.html refreshed from index.html")


if __name__ == "__main__":
    main()
