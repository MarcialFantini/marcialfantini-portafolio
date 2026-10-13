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
- [x] T4 Scenes 3-5 (La solucion, El alivio, Cierre) wired to existing data (servicios, metricas, contacto)
- [x] T6 Single-stage film: one sticky stage with all 5 scenes as stacked layers crossfading by global progress (fixes duplicated chips / double motion at scene seams; user-reported)
- [x] T7 Sell-focused cut: shorten film 1500 -> ~730 svh, offer-first copy, real proof (data files only) inside the film, persistent CTA, skip link (user goal: sell)
- [x] T8 Agency voice: commercial copy in warm plural ("te ayudamos", "te damos", "hablamos"), brand name stays Marcial Fantini; no invented team claims (user: it's his agency page)
- [x] T9 Rebuild services offer: web productos/servicios desde USD 300, web empresarial/institucional desde USD 400, ecommerce desde USD 800, software a medida (iniciar conversación); secondary background color on services blocks; update every services touchpoint (data, film, pages, forms, FAQ, content refs)
- [x] T10 Newsletter via Apps Script -> Google Sheet (commit 368ef54); block hidden until site.json newsletterEndpoint is set
- [x] T11 (done; leftovers moved to T12: Proyectos.astro/ProyectoCard still show +180% style `metricas` from project content, footer links "Testimonios") Content truth: no unverifiable metrics/testimonials, no years shown, no guarantees beyond 2 revision rounds, fix "hacerpor" spacing typo, delete Hero.astro, tagline/availability in site.json, SobreMi avatar aria-label, footer leftovers (Twitter->X, "Construido con Astro", "Cero newsletters"), remove section numbering, no duplicated KPI blocks, 404 in plural voice, free-license placeholder images (Unsplash/Pexels license only) until real photos/video
- [x] T12 (done: 12 pages built; blog/proyectos drafts via src/lib/content.ts; redirects to /sobre-mi) Pages: merge sobre-mi + testimonios into one agency "Sobre nosotros"; despublish/noindex cv, ahora, recurso, lectura, old blog posts and contradicting projects; remove CV/Ahora from nav/footer menus
- [x] T13 (done; dormant until site.json whatsapp/formEndpoint filled; Web3Forms would need access_key field) Contact: WhatsApp (config in site.json, pending number) + form via Formspree/Web3Forms (config in site.json, pending endpoint), remove Gmail/Outlook buttons, unify 15 min audit + 24 h business-day reply, prices note "no incluye hosting ni dominio" + dollar note, /privacidad page (no cookie banner) + footer link
- [x] T14 (done: 500svh; hero CTA + mobile header CTA; floating CTA from 40% of Peso; noscript fallback; AT tradeoff: Alivio text not repeated elsewhere) Film: CTA visible from hero + mobile header CTA, shorten to ~5 screens (~500svh) keeping persistent skip link, no-JS/noscript static fallback, minimal hero (H1 + lead + CTA), single neon halo, remove eyebrow pill/scroll hint clutter
- [x] T15 (done: effects removed, dark mode via tokens, radii/borders unified, z-scale; needs eyes list in report) Effects + dark mode: remove cursor ring, tilt, animated grain; keep spotlight + magnetic; shorten/remove intro curtain; SUPPORT dark mode (audit panels/gold panel contrast); unify borders and radii; blur/height/box-shadow animated by scroll -> transform/opacity
- [ ] T16 SEO + brand: @astrojs/sitemap, robots.txt, OG PNG 1200x630 navy/ivory/neon, favicon refresh, JSON-LD ProfessionalService (areaServed Cordoba/Argentina), title "Marcial Fantini | Páginas web, ecommerce y software a medida en Córdoba"
- [ ] T5 Polish: chapter rail, mobile pass, `pnpm check` + `pnpm build`

## Decisions (user, 2026-10-13, via selector)
No verifiable metrics/testimonials -> remove; no years; merge useful pages, despublish rest; WhatsApp + form; free-license images for now (own photos/videos later); 2 revision rounds only; Formspree/Web3Forms; 15 min audit + 24 h reply; CTA from hero + header mobile; no-JS static fallback; newsletter real via Apps Script; simple privacy page; full SEO set; USD "desde" + hosting/domain note; remove CV/Ahora from nav; remove Gmail/Outlook; shorten film to ~5 screens; brand: only OG + favicon now; single neon halo; support dark mode; remove cursor/tilt/animated grain.
Defaults I applied (not asked): unify borders/radii only; measure Lighthouse/LCP before more motion work; keep own rAF (no GSAP).
Pending inputs from user: WhatsApp number, Formspree/Web3Forms endpoint, Apps Script URL, real photos/video.

## Progress / evidence
T1-T3 (route: delegated writer, preparation + 3 non-trivial files): pnpm check 0 errors, pnpm build 80 pages OK; parent spot check of pnpm check OK. Not browser-tested. Seam navy -> light panels is abrupt (T4/T5). Hero.astro unmounted, left in place.

## Next step
Delegate one writer for T1-T2 after reading current Hero/Layout/motion.ts/global.css.
