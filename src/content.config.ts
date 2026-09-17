import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(8).max(120),
    description: z.string().min(40).max(200),
    pubDate: z.coerce.date(),
    author: z.string(),
    category: z.enum(['Estrategia', 'Código', 'Producto', 'Casos']),
    readingTime: z.number().int().positive(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const proyectos = defineCollection({
  loader: glob({ base: './src/content/proyectos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    cliente: z.string(),
    descripcion: z.string(),
    problema: z.string(),
    resultado: z.string(),
    stack: z.array(z.string()),
    fecha: z.coerce.date(),
    duracion: z.string(),
    role: z.string(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    metricas: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
  }),
});

export const collections = { blog, proyectos };
