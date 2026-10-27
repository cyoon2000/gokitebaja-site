// Cloudflare Worker: serves the built Astro site from static assets (./dist)
// and photos at /img/<key> from the R2 bucket bound as PHOTOS.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/img/')) return servePhoto(request, url, env, ctx);
    return env.ASSETS.fetch(request);
  },
};

async function servePhoto(request, url, env, ctx) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const key = decodeURIComponent(url.pathname.slice('/img/'.length));
  if (!key) return new Response('Not found', { status: 404 });

  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return hit;

  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  const res = new Response(request.method === 'HEAD' ? null : obj.body, { headers });
  ctx.waitUntil(cache.put(request, res.clone()));
  return res;
}
