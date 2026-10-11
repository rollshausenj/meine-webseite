import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog. Beiträge liegen als Markdown unter src/content/blog/<sprache>/<slug>.md,
 * Bilder in einem gleichnamigen Ordner daneben. Der Dateiname wird zur URL.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string().default('Smiles Africa'),
      description: z.string().default(''),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      /** Alte WordPress-URL, für Weiterleitungen beim Relaunch */
      legacyUrl: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Abschnitt des kenianischen Teams auf der Team-Seite – wird vom Team in Nairobi selbst gepflegt. */
const teamKenya = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/team-kenya' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
    members: z
      .array(z.object({ name: z.string(), role: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { blog, teamKenya };
