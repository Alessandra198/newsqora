# newsqora.com

Website for the NewsQora AI platform, hosted on **GitHub Pages** with the
custom apex domain `newsqora.com`.

## How this repo is deployed

GitHub Pages serves these static files directly — **no build step**.

| File | Purpose |
|------|---------|
| `index.html` | Page shell: `<head>` meta, Open Graph tags, JSON-LD, font/style links |
| `styles.css` | Design tokens (light/dark themes) and base styles |
| `app.js` | Renders the three views, handles routing, theme toggle, scroll-spy |
| `privacy.html`, `terms.html` | Real pages for `/privacy` and `/terms` so those URLs return HTTP 200 (required for Google to index them) |
| `fonts.css` + `fonts/` | Self-hosted fonts (Newsreader, Hanken Grotesk, IBM Plex Mono) — GDPR: no Google Fonts CDN calls |
| `newsqora-mark.svg`, `logo.png`, `logo-square.png` | Brand assets (`logo-square.png` is used for JSON-LD / social cards) |
| `404.html` | Copy of `index.html` — SPA fallback for any genuinely unknown path |
| `CNAME` | Tells GitHub Pages the custom domain is `newsqora.com` |
| `.nojekyll` | Disables Jekyll processing |

### Routes

Client-side routing via the History API: `/` (landing), `/privacy`, `/terms`,
`/cookies`. Each is backed by a real file (`privacy.html`, `terms.html`,
`cookies.html`) that GitHub Pages serves at the clean URL with an **HTTP 200**
status — Google will not index a URL that responds 404, and the SPA fallback
alone returns 404. `app.js` reads `location.pathname` and renders the matching
view; each file also carries the correct static `<title>`/description.

`404.html` (a copy of `index.html`) remains the fallback for any other unknown
path.

### Pre-rendering (important)

The content is built by `app.js` at runtime, so the raw HTML would otherwise be
an empty `<div id="app">` shell — invisible to compliance scanners, archive
bots, and no-JS clients (and fragile for SEO). `prerender.py` fixes this: it
loads each route in headless Chrome and bakes the fully-rendered markup into the
static HTML files. `app.js` still loads and re-renders on top for interactivity
(progressive enhancement), so there is no duplication.

**The committed `index.html`, `privacy.html`, `terms.html`, `cookies.html`, and
`404.html` are generated artifacts.** After editing any content, copy, `<head>`,
or markup in `app.js`, regenerate them:

```sh
python3 prerender.py
```

Then commit the updated HTML files alongside your `app.js` change.

### Editing the site

- Copy / content lives in the data arrays at the top of `app.js`
  (`STEPS`, `PILLARS`, `PRIVACY`, `TERMS`, `COOKIES`, `SOCIALS`, …).
- Colours, fonts, spacing tokens live in `styles.css`.
- After any content edit, **run `python3 prerender.py`** (see above) so the
  static HTML stays in sync.

### Preview locally

Any static server works, e.g. from the repo root:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Enabling GitHub Pages (one-time)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the branch (e.g. `main`) and folder `/ (root)`, then **Save**.
5. Under **Custom domain**, `newsqora.com` should already be filled in from
   the `CNAME` file. Once DNS is verified, tick **Enforce HTTPS**.

## DNS setup at Namecheap (apex domain)

In Namecheap: **Domain List → Manage → Advanced DNS**. Remove any default
"parking" / URL-redirect records first, then add:

### A records (apex `@` → GitHub Pages IPv4)

| Type | Host | Value           |
|------|------|-----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

### AAAA records (optional, IPv6)

| Type | Host | Value                  |
|------|------|------------------------|
| AAAA | @    | 2606:50c0:8000::153    |
| AAAA | @    | 2606:50c0:8001::153    |
| AAAA | @    | 2606:50c0:8002::153    |
| AAAA | @    | 2606:50c0:8003::153    |

### CNAME for www → your GitHub Pages host

| Type  | Host | Value                       |
|-------|------|-----------------------------|
| CNAME | www  | <your-github-username>.github.io. |

> Replace `<your-github-username>` with the GitHub account (or org) that owns
> this repo. This makes `www.newsqora.com` redirect to the apex domain.

DNS changes can take from a few minutes up to 24–48 hours to propagate.
After propagation, enable **Enforce HTTPS** in GitHub Pages settings.
