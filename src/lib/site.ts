import { getCollection, type CollectionEntry } from 'astro:content';

export const SITE = {
  name: 'GoKiteBaja',
  tagline: 'Your local guide to La Ventana, Baja California Sur',
  email: 'gokitebaja@gmail.com',
  // Ventana Bay, roughly in front of the main kite beach
  lat: 24.047,
  lon: -109.99,
  tz: 'America/Mazatlan',
};

export const TAGS: Record<string, { label: string; plural: string }> = {
  'kite-school': { label: 'Kite school', plural: 'Kite schools' },
  hangout: { label: 'Restaurant', plural: 'Restaurants & hangouts' },
  coffee: { label: 'Coffee', plural: 'Coffee' },
  bar: { label: 'Bar', plural: 'Bars' },
  hotel: { label: 'Hotel', plural: 'Hotels & resorts' },
  'vacation-rental': { label: 'Vacation rental', plural: 'Vacation rentals' },
  'real-estate': { label: 'Real estate', plural: 'Real estate' },
  yoga: { label: 'Yoga', plural: 'Yoga' },
  massage: { label: 'Massage', plural: 'Massage' },
  daycare: { label: 'Daycare', plural: 'Daycare' },
  grocery: { label: 'Shop', plural: 'Groceries & shops' },
  gas: { label: 'Gas', plural: 'Gas stations' },
  atm: { label: 'ATM', plural: 'ATMs' },
  event: { label: 'Event', plural: 'Events' },
};

export const GROUPS: { title: string; tags: string[] }[] = [
  { title: 'On the water', tags: ['kite-school'] },
  { title: 'Eat & drink', tags: ['hangout', 'coffee', 'bar'] },
  { title: 'Stay', tags: ['hotel', 'vacation-rental', 'real-estate'] },
  { title: 'Body & family', tags: ['yoga', 'massage', 'daycare'] },
  { title: 'Errands', tags: ['grocery', 'gas', 'atm'] },
];

export const tagLabel = (t: string) => TAGS[t]?.label ?? t;
export const tagPlural = (t: string) => TAGS[t]?.plural ?? t;

export type Place = CollectionEntry<'places'>;

export async function getPlaces(): Promise<Place[]> {
  const all = await getCollection('places', (p) => p.data.status !== 'closed');
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function placesByTag(places: Place[], tag: string) {
  return places.filter((p) => p.data.tags.includes(tag));
}

/** Thumbnails live in image-256; full-size in image. Works for /img/ paths from R2. */
export function thumb(src?: string) {
  return src ? src.replace('/image/', '/image-256/') : undefined;
}

export function firstImage(p: Place): string | undefined {
  if (p.data.image) return p.data.image;
  const m = (p.body ?? '').match(/src="(\/img\/[^"]+)"/);
  return m ? thumb(m[1]) : undefined;
}

const clean = (h: string) =>
  h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const NOISE = /google map|scroll down|phone|tel[:.]|cel[:.]|whats ?app|@|https?:|www\.|\d{3}[- ]?\d{3,4}/i;

/** Short description for list rows: the listing's bullet points, else its first plain sentence. */
export function excerpt(p: Place, n = 110) {
  const body = (p.body ?? '').replace(/<iframe[\s\S]*?<\/iframe>/g, '');
  const items = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => clean(m[1])).filter((t) => t && !NOISE.test(t));
  let text = items.slice(0, 4).join(', ');
  if (!text) {
    const paras = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => clean(m[1]));
    text = paras.find((t) => t.length > 20 && !NOISE.test(t)) ?? '';
  }
  return text.length > n ? text.slice(0, n).replace(/[\s,]\S*$/, '') + '…' : text;
}

/** All numbered La Ventana photos present in the archive (0–368, a few gaps). */
export const GALLERY_OLGA = [
  'olga_kite_9525', 'olga_air_9624', 'olga_kite_9783', 'olga_air_0461', 'olga_ppl_9642',
  'olga_nature_7963', 'olga_ppl_8169',
];
