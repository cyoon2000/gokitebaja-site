import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const places = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/places' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tags: z.array(z.string()).min(1),
    date: z.string().optional(),
    image: z.string().optional(),
    // "unverified" until someone confirms the business is still open
    status: z.enum(['open', 'closed', 'unverified']).default('unverified'),
    lastVerified: z.string().optional(),
    source: z.string().url().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    source: z.string().url().optional(),
  }),
});

export const collections = { places, pages };
