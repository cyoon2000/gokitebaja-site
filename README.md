# gokitebaja.com

Astro static site for GoKiteBaja, a local guide to kitesurfing in La Ventana, Baja California Sur.
Hosted on Cloudflare Pages; photos are in the R2 bucket `gokitebaja-photos` and served at `/img/*`.

## Structure
- `src/content/places/*.md`: one file per business (title, tags, image, status). Edit these to update listings.
  Set `status: open` and `lastVerified: YYYY-MM-DD` after checking a place; `status: closed` hides it.
- `src/content/pages/*.md`: Plan your trip, Events.
- `src/lib/site.ts`: categories (tags), town-guide groups, site location for the wind forecast.
- `src/components/Wind.astro`: live wind from Open-Meteo (browser fetch, no key; free for non-commercial use).
- `functions/img/[[path]].js`: Pages Function that serves `/img/<key>` from R2 (binding `PHOTOS`, see `wrangler.toml`).
- `public/_redirects`: old Ghost URLs (booking pages, pagination, author archives) → new pages.

## Develop
    npm install
    ln -s /path/to/unzipped/gokitebaja-photos public/img   # optional: local photos for previews
    npm run dev

## Deploy (Cloudflare Pages)
Build command `npm run build`, output `dist`, Node 22. R2 binding `PHOTOS` → `gokitebaja-photos`.
