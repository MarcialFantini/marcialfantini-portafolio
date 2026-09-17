## Project: Marcial Fantini — Marca Personal (Landing)

Landing personal de **Marcial Fantini**, desarrollador freelance full-stack argentino. Mood indie hacker: directo, sin fluff, orientado a resultados.

**Stack**: Astro 7 + TypeScript + Tailwind v4 + Content Collections. Mobile-first. SSG puro.
**Tipografías**: Bricolage Grotesque (display variable) + JetBrains Mono (números, KPIs), ambas self-hosted vía `@fontsource-variable/*`. Sin Google Fonts.

**Comandos**: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm check` (alias de `astro check`). Sin variables de entorno. Datos editables en `src/data/site.json`.

**Datos editables**:
- `src/data/site.json` — nombre, tagline, email, redes
- `src/data/servicios.json` — 4 servicios con precio orientativo
- `src/data/metricas.json` — KPIs destacados del home

**Contenido en colecciones**:
- `src/content/blog/*.md` — 5 posts (5 categorías)
- `src/content/proyectos/*.md` — 10 casos

Toda la lógica de presentación está en componentes Astro (`src/components/`) y se compone en `src/pages/index.astro` y las páginas detalle.
