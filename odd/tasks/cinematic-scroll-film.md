# Feature: cinematic-scroll-film

## Objective
Home page behaves like a perfect cinematic motion-graphics film (Apple product-video feel, not Apple web page) where scroll is the timeline. Story: the client's heavy problem -> a website lifts it -> relief and better life.

## Decisions (user)
- Scroll-scrubbed pinned scenes (option A). Still static HTML/SSG, SEO intact.
- Palette: deep navy blue, ivory white, neon gold. Clean UI.
- Inspiration: Apple videos (slow eases, big type, light reveals, depth), not apple.com layout.

## Storyboard
1. El peso: navy, problem accumulates (clutter/noise).
2. El giro: neon gold flash, order appears.
3. La solucion: the website assembles piece by piece.
4. El alivio: ivory type on navy, KPIs rise.
5. Cierre: one line + gold CTA.

## Constraints
- Astro 7 + Tailwind v4, single rAF in src/scripts/motion.ts, no CSS vars on <html>.
- prefers-reduced-motion: static fallback, all content readable.
- Mobile-first, no horizontal overflow. UI copy in neutral Spanish (project language).
- ~400 authored changed lines per task is a planning heuristic only.

## Tasks
- [x] T1 Palette tokens: navy / ivory / neon gold in global.css (+ glow utilities)
- [x] T2 Film engine: pinned scene stage + progress (0..1) per scene in motion.ts, reduced-motion fallback
- [x] T3 Scenes 1-2 (El peso, El giro) in Hero/new Film components
- [ ] T4 Scenes 3-5 (La solucion, El alivio, Cierre) wired to existing data (servicios, metricas, contacto)
- [ ] T5 Polish: chapter rail, mobile pass, `pnpm check` + `pnpm build`

## Progress / evidence
T1-T3 (route: delegated writer, preparation + 3 non-trivial files): pnpm check 0 errors, pnpm build 80 pages OK; parent spot check of pnpm check OK. Not browser-tested. Seam navy -> light panels is abrupt (T4/T5). Hero.astro unmounted, left in place.

## Next step
Delegate one writer for T1-T2 after reading current Hero/Layout/motion.ts/global.css.
