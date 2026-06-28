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
import http.server, socketserver, threading, os, subprocess, sys

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
PORT = 8155
ROUTES = [  # (static file, URL path)
    ("index.html", "/"),
    ("privacy.html", "/privacy"),
    ("terms.html", "/terms"),
    ("cookies.html", "/cookies"),
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
    out = subprocess.run(
        [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
         "--virtual-time-budget=4000", "--dump-dom", url],
        capture_output=True, text=True).stdout
    start = out.find('<div id="app"')
    end = out.find('<script src="app.js"')
    if start == -1 or end == -1 or end < start:
        raise RuntimeError("could not locate #app in render of " + url)
    return out[start:end].rstrip()


def main():
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
