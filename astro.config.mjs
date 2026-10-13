// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://marcialfantini.com',
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
