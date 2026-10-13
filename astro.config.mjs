// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://marcialfantini.com';

// Rutas fuera del sitemap: indices que hoy son estados vacios (noindex) y utilidades.
const EXCLUDED = new Set([
  `${SITE}/404`,
  `${SITE}/blog`,
  `${SITE}/blog/tags`,
  `${SITE}/proyectos`,
]);

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.has(page.replace(/\/$/, '')),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  trailingSlash: 'ignore',
  // Paginas despublicadas: se unificaron en /sobre-mi.
  redirects: {
    '/testimonios': '/sobre-mi',
    '/cv': '/sobre-mi',
    '/ahora': '/sobre-mi',
    '/recurso': '/sobre-mi',
    '/lectura': '/sobre-mi',
  }
});
