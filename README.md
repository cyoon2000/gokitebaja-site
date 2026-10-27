# gokitebaja.com

Astro static site for GoKiteBaja, a local guide to kitesurfing in La Ventana, Baja California Sur.
Hosted as a Cloudflare Worker with static assets; photos are in the R2 bucket `gokitebaja-photos` and served at `/img/*`.

## Structure
- `src/content/places/*.md`: one file per business (title, tags, image, status). Edit these to update listings.
  Set `status: open` and `lastVerified: YYYY-MM-DD` after checking a place; `status: closed` hides it.
- `src/content/pages/*.md`: Plan your trip, Events.
- `src/lib/site.ts`: categories (tags), town-guide groups, site location for the wind forecast.
- `src/components/Wind.astro`: live wind from Open-Meteo (browser fetch, no key; free for non-commercial use).
- `worker/index.js`: serves the built site and `/img/<key>` from R2 (binding `PHOTOS`, see `wrangler.jsonc`).
- `public/_redirects`: old Ghost URLs (booking pages, pagination, author archives) → new pages.

## Develop
    npm install
    ln -s /path/to/unzipped/gokitebaja-photos public/img   # optional: local photos for previews
    npm run dev

## Deploy (Cloudflare Workers Builds)
Build command `npm run build`, deploy command `npx wrangler deploy`. Pushes to `main` deploy automatically.
The Worker name in Cloudflare must match `name` in `wrangler.jsonc` (`gokitebaja-site`).
