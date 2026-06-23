# newsqora.com

Website for the NewsQora AI platform, hosted on **GitHub Pages** with the
custom apex domain `newsqora.com`.

## How this repo is deployed

- GitHub Pages serves the static files from this repository.
- `CNAME` tells GitHub Pages the custom domain is `newsqora.com`.
- `index.html` is the entry point (currently a placeholder — replace it with
  your design from Claude).
- `.nojekyll` disables Jekyll processing so files/folders starting with `_`
  are served as-is.

## Adding your design

Replace `index.html` (and add any CSS/JS/image folders) with your exported
design. Keep the `CNAME` and `.nojekyll` files in place. Commit and push —
GitHub Pages redeploys automatically.

If your design is a **React/Vite/Next** app, it must be built to static files
first (e.g. `npm run build`) and the build output published to Pages. Tell
Claude which framework it is and it can wire up a GitHub Actions build.

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
