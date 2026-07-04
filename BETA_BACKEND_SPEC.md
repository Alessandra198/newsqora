# Beta waitlist backend — spec for the Firebase agent

The Newsqora website (`/beta`) collects beta signups. The site is **static
(GitHub Pages) and cannot write to Firestore or send email itself**, so it needs
one small **EU-region serverless endpoint** to POST to. This document is the
contract. Build the endpoint, then give the website its URL — the website side is
already written and just needs `BETA_ENDPOINT` set (see "Wiring it up" below).

## Endpoint

- **One HTTPS endpoint** accepting `POST` with a JSON body.
- **Region: `europe-west1`** (EU), same as the rest of Newsqora's data.
- Suggested: a **Firebase Cloud Function (2nd gen)** or Cloud Run service.
- Must return permissive **CORS** for the browser call:
  - `Access-Control-Allow-Origin: https://newsqora.com`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`
  - Handle the `OPTIONS` preflight.

## Request body (JSON)

```json
{
  "name": "Jane Tester",
  "googleEmail": "jane@gmail.com",
  "country": "Italy",
  "language": "Italian",
  "useCase": "Checking political claims",
  "referral": "A friend shared a fact-check",
  "consent": true,
  "consentTimestamp": "2026-07-04T18:40:00.000Z",
  "policyVersion": "2026-06-24",
  "source": "website",
  "createdAt": "2026-07-04T18:40:00.000Z"
}
```

Only `name`, `googleEmail`, and `consent` are guaranteed present; the rest may be
empty strings. The client already validates email format, requires consent, and
drops honeypot hits — but **re-validate server-side** (never trust the client):
require `consent === true` and a syntactically valid email; reject otherwise.

## What to do

1. **Store** in a Firestore collection **`betaWaitlist`** (`europe-west1`) with
   fields: `name, googleEmail, country, language, useCase, referral, consent,
   consentTimestamp, policyVersion, source, createdAt, status`.
   - Set `status: "new"` on first insert.
   - Store `googleEmail` lowercased for reliable dedup.
2. **De-duplicate by `googleEmail`.** If a doc with that email exists, **update**
   it (refresh the fields + a `updatedAt`) rather than creating a duplicate.
3. **Notify** `hello@newsqora.com` on each new signup (or a batched digest) so the
   founder can add the tester to the Play closed-testing list and send the invite.
4. **Respond** with JSON:
   - New signup: `200 { "status": "new" }`
   - Already on the list: `200 { "status": "exists" }`
   - Bad input: `400 { "error": "..." }`

   The website shows a different confirmation for `new` vs `exists`, so returning
   the right `status` matters.

## Abuse / safety

- The site includes a **honeypot** field named `company`; real submissions leave
  it empty (the client already discards filled ones, but you may also drop any
  request where `company` is non-empty if you choose to forward it).
- Add basic **rate limiting** (e.g. per IP) to avoid spam floods.
- No CAPTCHA / third-party anti-bot scripts on the page — keep the site's
  "no third-party scripts / no trackers" promise intact.

## Data protection (already disclosed on the site)

- Purpose: contacting testers and managing the waitlist only. No marketing, no
  sharing, no ad trackers. The `/beta` page states this and links the Privacy
  Policy; `consentTimestamp` + `policyVersion` are recorded with each submission.
- Support **erasure on request** (`hello@newsqora.com`): be able to delete a
  waitlist entry by email.
- Keep everything in the EU.

## Wiring it up (website side — small, someone with repo access does this)

Once the endpoint is live:

1. In `app.js`, set the constant:
   ```js
   var BETA_ENDPOINT = 'https://europe-west1-<project>.cloudfunctions.net/betaWaitlist';
   ```
   (Until it is set, the form gracefully falls back to a prefilled email to
   `hello@newsqora.com`, so the page already works today.)
2. Add the endpoint's **origin** to the `Content-Security-Policy` `connect-src`
   in the `<head>` of **every** page (`index.html`, `beta.html`, `beta-terms.html`,
   `privacy.html`, `terms.html`, `cookies.html`, `404.html`), e.g.:
   ```
   connect-src 'self' https://europe-west1-<project>.cloudfunctions.net;
   ```
   Without this, the browser's CSP will block the `fetch`.
3. Re-run `python3 prerender.py` and commit. (The website agent can do all three.)
