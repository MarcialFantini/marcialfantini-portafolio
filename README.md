# Marcial Fantini — Marca Personal

Landing personal de Marcial Fantini, desarrollador freelance full-stack argentino. Construcción estática con Astro 7.

## Stack

- **Astro 7** + **TypeScript** estricto
- **Tailwind CSS v4** vía `@tailwindcss/vite` con tokens en `@theme`
- **Content Collections** para blog y proyectos (markdown)
- **Bricolage Grotesque Variable** + **JetBrains Mono Variable** (self-hosted vía `@fontsource-variable/*`, sin Google Fonts)
- 100% estático. Sin backend. Form de contacto usa `mailto:`.

## Paleta

- Azul `#1E40AF` — primario, CTAs, links, headlines de acento
- Blanco humo `#F5F5F4` — fondo principal
- Blanco `#FFFFFF` — cards, contraste
- Dorado `#C8A24E` — acento, hover sutil, divisores finos
- Ink `#18181B` — texto principal
- Ink soft `#3F3F46` — texto secundario
- Mute `#71717A` — metadata
- Border `#E7E5E4` — bordes finos

## Estructura

```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── SobreMi.astro
│   ├── Servicios.astro
│   ├── Metricas.astro
│   ├── Proyectos.astro
│   ├── BlogPreview.astro
│   ├── Contacto.astro
│   ├── ProyectoCard.astro
│   ├── PostCard.astro
│   └── FormattedDate.astro
├── content/
│   ├── blog/         (5 posts .md)
│   └── proyectos/    (10 proyectos .md)
├── content.config.ts
├── data/
│   ├── site.json
│   ├── servicios.json
│   └── metricas.json
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── sobre-mi.astro
│   ├── contacto.astro
│   ├── 404.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── proyectos/
│       ├── index.astro
│       └── [slug].astro
└── styles/
    └── global.css
```

## Comandos

```bash
pnpm install
pnpm dev          # servidor de desarrollo en http://localhost:4321
pnpm build        # build de producción a ./dist
pnpm preview      # previsualiza el build
pnpm check        # astro check (TypeScript)
```

## Dónde editar el contenido

| Quiero cambiar…                       | Editar                              |
|---------------------------------------|-------------------------------------|
| Nombre, tagline, email, redes         | `src/data/site.json`                |
| Servicios y precios orientativos      | `src/data/servicios.json`           |
| KPIs destacadas del home              | `src/data/metricas.json`            |
| Agregar un post al blog               | Crear `src/content/blog/<slug>.md`  |
| Agregar un proyecto                   | Crear `src/content/proyectos/<slug>.md` |
| Colores o tipografías                 | `src/styles/global.css`             |
| Hero, secciones del home              | `src/components/*.astro`            |

## Deploy

El sitio es estático. Funciona en cualquier host estático.

- **Vercel**: `vercel deploy` o conectar el repo.
- **Netlify**: build command `pnpm build`, publish dir `dist`.
- **Cloudflare Pages**: build command `pnpm build`, output dir `dist`.
- **GitHub Pages**: `actions/deploy-pages.yml` con upload de `dist/`.

Sin variables de entorno. Sin funciones serverless.

## Aviso

Todos los proyectos, clientes y métricas son ficticios. El dominio `marcialfantini.com` no está
registrado a este proyecto al momento del build. Para deploy real: editar `astro.config.mjs`
campo `site` y los URLs en `src/data/site.json`.
