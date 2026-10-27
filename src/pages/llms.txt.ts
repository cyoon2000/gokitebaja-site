import type { APIRoute } from 'astro';
import { getPlaces, tagLabel, SITE } from '../lib/site';

export const GET: APIRoute = async () => {
  const places = await getPlaces();
  const lines = [
    `# ${SITE.name}`,
    `> ${SITE.tagline}. Kitesurfing guide: wind forecast, kite schools, restaurants, lodging and practical info for La Ventana, Baja California Sur, Mexico.`,
    '',
    '## Guides',
    '- [Planning your trip](https://gokitebaja.com/plan/): season, getting there, rental cars, money',
    '- [Wind forecast](https://gokitebaja.com/wind/): live hourly forecast for Ventana Bay',
    '- [Town guide](https://gokitebaja.com/info/): every listing by category',
    '- [Events](https://gokitebaja.com/events/)',
    '',
    '## Places',
    ...places.map((p) => `- [${p.data.title}](https://gokitebaja.com/${p.data.slug}/): ${p.data.tags.map(tagLabel).join(', ')}`),
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
