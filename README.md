# FirstCompile — firstcompile.com

Production site for FirstCompile. The visual design is frozen in
[`contract/firstcompilefinal.html`](contract/firstcompilefinal.html) — the
design contract. This app is a pixel-parity port of that file plus the pages,
integrations, and machine layer around it. **Do not restyle the home page by
hand**; if the contract changes, change the contract file and re-run the
extractor (below).

## Stack

- Next.js 15 (App Router, TypeScript strict, static-first — every content page
  is prerendered; only `/admin` and the API routes are dynamic)
- CSS: the contract's stylesheet, extracted verbatim to
  `styles/contract.css`. Interior-page additions live in `styles/site.css`
  and reuse the contract's tokens only. No Tailwind by design — Tailwind's
  preflight would alter the contract's rendering.
- Fonts: Geist + Geist Mono self-hosted from the `geist` npm package via
  `next/font` variables. No Google Fonts request at runtime.
- Theme: `next-themes`, `data-theme` attribute, storage key `fc-theme`,
  system preference as the default — identical behaviour to the contract.
- Blog: MDX files in `content/blog/` (frontmatter + markdown), no CMS.
  Write a file, push, live.
- Enquiries: Zod-validated API → Prisma/PostgreSQL (Neon) → Resend email →
  protected admin table. Honeypot + 5/hour/IP rate limit.
- Booking: Cal.com inline embed (30/15-minute toggle, theme-synced). Booking
  data lives in your Cal.com dashboard, not in this app.
- Tests: Playwright acceptance suite asserting pixel parity against the
  contract file at 1366/1536/1920/2560/390, plus the full enquiry pipeline.

## Local development

```bash
npm install            # also runs prisma generate
npm run dev            # http://localhost:3000
```

With no env vars set, the site runs fully: the booking panel shows the
design-preview calendar and the enquiry endpoint returns a clear 501. Copy
`.env.example` to `.env` and fill in what you have.

## Environment variables

See [`.env.example`](.env.example). Summary:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (metadata, sitemap, JSON-LD) |
| `DATABASE_URL` | Neon Postgres — stores enquiries |
| `RESEND_API_KEY` | Resend key scoped to sending on `notify.firstcompile.com` |
| `ENQUIRY_FROM` | Always a `notify.firstcompile.com` address — the app refuses a root-domain From |
| `ENQUIRY_TO` | Founders' real Workspace inbox (`hello@firstcompile.com`) |
| `SEND_ACK` | `true` → plain-text acknowledgement to the enquirer (≤70 words, one link) |
| `ADMIN_USER`, `ADMIN_PASSWORD` | HTTP Basic Auth for `/admin/enquiries` |
| `NEXT_PUBLIC_CAL_LINK_30`, `NEXT_PUBLIC_CAL_LINK_15` | Cal.com event links (e.g. `firstcompile/intro-30`) |

Degradation is graceful: no `DATABASE_URL` → email only; no `RESEND_API_KEY`
→ store only; neither → 501 with a clear message. The enquiry is stored
**before** any email is attempted, so a mail failure can never lose a lead.
`NEXT_PUBLIC_*` values are inlined at build time — changing them on Vercel
requires a redeploy.

## Deliverability

The email architecture is deliberate — do not change it:

- **Two domains, strictly separated.** The root `firstcompile.com` is for
  human mail only (Google Workspace: client replies, founder outreach). All
  programmatic mail signs as **`notify.firstcompile.com`** (Resend,
  us-east-1, return-path `send`, open/click tracking OFF). Email reputation
  is ledgered per sending domain, so nothing this app does can ever touch the
  root domain's reputation. The code enforces this: a root-domain
  `ENQUIRY_FROM` is refused at runtime, and the test suite grep-guards the
  codebase for it.
- **DNS**: Resend's three records live under `notify.` (`send.notify`,
  `resend._domainkey.notify`); Google Workspace records live on the root;
  they never conflict. Add one DMARC record on the root —
  `_dmarc` → `v=DMARC1; p=none; rua=mailto:hello@firstcompile.com; fo=1` —
  which covers both. Tighten to `p=quarantine` after ~4 clean weeks.
- **What the app sends**: (1) an internal notification to `ENQUIRY_TO` with
  Reply-To set to the enquirer, zero links; (2) if `SEND_ACK=true`, a
  plain-text acknowledgement to the enquirer, under 70 words, exactly one
  link, Reply-To `hello@firstcompile.com`. Both are plain text — no HTML, no
  images, no tracking pixels, no shorteners. One send attempt plus one retry
  on 5xx; Resend message IDs are logged next to the DB row id.
- **First-run checks**: because notifications go *to* your own Workspace
  inbox *from* your own subdomain, Google may quarantine the first few —
  check Admin console → Spam quarantine after your first test and allowlist
  if needed. Before launch, submit a real enquiry with the form using a
  mail-tester.com address to score the ack path — require **9/10 or better**
  and fix its findings first.
- **Never**: Resend Broadcasts/Audiences, newsletters, drip sequences, bulk
  sends, tracking of any kind. This codebase has no such capability on
  purpose. Programmatic = notify. Root = human. Forever.

## Database

One table (`Enquiry`). First-time setup against Neon:

```bash
npx prisma db push     # creates the table from prisma/schema.prisma
```

## Tests

```bash
npm run build          # required first — tests run the production build
npm test               # 22 acceptance tests (parity, pipeline, SEO layer)
```

The suite boots the built site with an in-memory store (`TEST_STORE=memory`)
and serves the contract file next to it, then asserts: zero horizontal
overflow; symmetric margins of 88/88/240/560/20 at the five audited widths;
the single alignment column; the 64px-tile grid anchor (H1 exactly 32px into
a tile); H1 type and color tokens matching the contract in both themes; belt
animation/hover/reduced-motion behaviour; theme toggle persistence; one `h1`
per route; all four JSON-LD blocks; FAQPage/visible-FAQ equality; the enquiry
pipeline including honeypot and the 429 rate limit; admin auth; per-service
schemas; sitemap coverage; and byte-identical `robots.txt` / `llms.txt`.

Manual eyeball check (§11): `node scripts/side-by-side.mjs 1536 dark` with the
site on :4610 and `node scripts/serve-contract.mjs 4611` running writes
full-page screenshots of both to `test-results/`.

## Regenerating derived assets

```bash
npm run extract        # contract → styles/contract.css, belt chips, JSON-LD
npm run og             # renders public/og.png (1200×630) in headless Chromium
node scripts/check-copy.mjs   # voice/structure gate over generated copy
```

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel. Framework preset:
   Next.js. No special build settings — `postinstall` runs `prisma generate`.
2. Add the env vars above in Vercel → Project → Settings → Environment
   Variables (production).
3. Add the `firstcompile.com` domain, set the apex as primary.
4. After the first deploy: submit `https://firstcompile.com/sitemap.xml` in
   [Google Search Console](https://search.google.com/search-console) (verify
   the domain via the DNS TXT record Vercel shows you) and in
   [Bing Webmaster Tools](https://www.bing.com/webmasters) (imports from GSC
   in one click).

## Founder launch checklist

- [ ] **Cal.com**: create the account → connect Google Calendar (this is what
      makes Meet links appear on invites automatically) → create two event
      types (30 min, 15 min) → put their links in `NEXT_PUBLIC_CAL_LINK_30/15`.
- [ ] **Resend**: the domain is `notify.firstcompile.com` (already decided —
      subdomain, us-east-1, tracking off). Create its 3 DNS records under
      `notify.`, verify, create a sending-scope API key. `ENQUIRY_FROM` stays
      `FirstCompile <hello@notify.firstcompile.com>`. Add the root DMARC
      record (see Deliverability). Then run one live enquiry to a
      mail-tester.com address and require 9/10+.
- [ ] **Neon**: create a project, copy the pooled connection string into
      `DATABASE_URL`, run `npx prisma db push` once.
- [ ] **Mailboxes**: `hello@firstcompile.com` live; `careers@` optional.
- [ ] **Admin**: set a long `ADMIN_PASSWORD`; enquiries are at
      `/admin/enquiries` (also emailed, also in Neon).
- [ ] **Work screenshots** — highest-impact item on the site: drop real
      product screenshots at `public/work/shipflow.png` and
      `public/work/nexus.png` (1600×1040, dark UI, realistic data). The
      placeholder disappears automatically.
- [ ] **Search**: submit sitemap to Google Search Console + Bing (above).
- [ ] **og.png**: approve `public/og.png`; regenerate with `npm run og` after
      any change.
- [ ] **Monthly**: update the availability line in
      `components/site/Footer.tsx` ("Taking new projects — …").
- [ ] **Weekly**: publish one post — add `content/blog/<slug>.mdx` with
      `title`, `date`, `excerpt` frontmatter and push. The home Writing
      section and sitemap update themselves.
- [ ] **Honour the commitments** the site now promises: fixed quotes in 48
      hours, NDA same day, repo from commit one, 30-day fix window.
#   f i r s t c o m p i l e _ v 2  
 