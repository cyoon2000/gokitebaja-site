// Serves /img/<key> from the R2 bucket bound as PHOTOS (see wrangler.toml).
// e.g. /img/gokitebaja/image/la-ventana-23.jpg -> R2 key gokitebaja/image/la-ventana-23.jpg
export async function onRequestGet({ request, params, env, waitUntil }) {
  const key = (Array.isArray(params.path) ? params.path : [params.path]).map(decodeURIComponent).join('/');
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
  const res = new Response(obj.body, { headers });
  waitUntil(cache.put(request, res.clone()));
  return res;
}
