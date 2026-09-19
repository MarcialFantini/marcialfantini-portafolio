import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORIES = ["desarrollo", "productos", "carrera", "escritura", "ia"] as const;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(8).max(120),
    description: z.string().min(40).max(200),
    pubDate: z.coerce.date(),
    author: z.string().default("Marcial Fantini"),
    category: z.enum(CATEGORIES),
    readingTime: z.number().int().positive().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const PROYECTOS_CATEGORIES = ["ecommerce", "landing", "panel", "blog", "integracion", "dashboard", "reservas", "otro"] as const;

const proyectos = defineCollection({
  loader: glob({ base: './src/content/proyectos', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    cliente: z.string(),
    categoria: z.enum(PROYECTOS_CATEGORIES).default("otro"),
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
export { CATEGORIES, PROYECTOS_CATEGORIES };