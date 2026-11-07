## Project: Marcial Fantini — Marca Personal (Landing)

Landing personal de **Marcial Fantini**, desarrollador freelance full-stack argentino. Mood indie hacker: directo, sin fluff, orientado a resultados.

**Stack**: Astro 7 + TypeScript + Tailwind v4 + Content Collections. Mobile-first. SSG puro.
**Tipografías**: Gambarino (display) + General Sans (texto), self-hosted en `public/fonts/` (Fontshare, licencia ITF Free Font). Sin CDNs ni Google Fonts. Sin monoespaciadas salvo en `<pre>`/`<code>`.
**Dirección visual**: tasteskill `type-only-statement` (seed 442660410), paleta Night and cornflower. Ficha en `.taste-skill/direction.json`; reglas en `src/styles/global.css`.

**Comandos**: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm check` (alias de `astro check`). Sin variables de entorno. Datos editables en `src/data/*.json`.

**Datos editables**:
- `src/data/site.json` — nombre, tagline, email, redes
- `src/data/servicios.json` — 4 servicios con precio orientativo
- `src/data/metricas.json` — KPIs destacados del home
- `src/data/demos.json` — nombre por rubro, orden y captura de cada proyecto demo
- `src/data/sobre.json` — foto, frase y stack de "Sobre mí"

**Contenido en colecciones**:
- `src/content/blog/*.md` — 14 posts en 5 categorías (`desarrollo`, `productos`, `carrera`, `escritura`, `ia`)
- `src/content/proyectos/*.md` — 19 proyectos demo (nunca presentarlos como clientes)
- Schemas validados con Zod en `src/content.config.ts`

**Páginas (`src/pages/`)**:
- Estáticas: `index`, `sobre-mi`, `contacto`, `privacidad`, `404` (las viejas `cv`, `ahora`, `testimonios`, `lectura`, `recurso` redirigen a `/sobre-mi`)
- Dinámicas: `blog/[slug]`, `blog/tags/[tag]`, `proyectos/[slug]`, `servicios/[slug]`
- API/endpoint: `rss.xml.ts` (requiere `export const prerender = true;` para SSG)

Toda la lógica de presentación está en componentes Astro (`src/components/`) y se compone en `src/pages/index.astro` y las páginas detalle.

## Nota técnica sobre el build

El proyecto compila a estático (`output: 'static'` implícito). El endpoint `src/pages/rss.xml.ts` declara `export const prerender = true;` al inicio del archivo — sin esa directiva, Astro 7 aborta el build y produce `dist/` vacío. Si el feed deja de generarse, revisar primero esa línea.
