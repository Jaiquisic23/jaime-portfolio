import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    homeSummary: z.string().optional(),
    relatedWork: z.object({
      title: z.string(),
      href: z.string().startsWith('/en/'),
      summary: z.string(),
    }).optional(),
  }),
});

export const collections = {
  articles,
};
