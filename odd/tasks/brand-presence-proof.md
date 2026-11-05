# brand-presence-proof

Objective: after the Impeccable critique (22/32), make the home read as a company with Marcial's personal presence and add social proof before the first CTA.
Scope: P1 issues only (brand voice, proof beat) + data (WhatsApp +543533685147, email marcialfantinijs@gmail.com) + dead `.text-sunset` gradient cleanup. P2/P3 out of scope.
Source: .impeccable/critique/2026-10-13T08-31-56Z__src-pages-index-astro.md

## Tasks
- [x] T1 data: whatsapp + email in src/data/site.json (verify format used by components)
- [x] T2 clarify: title/description/copy -> company with personal presence ("yo" + "nosotros"), name near hero
- [ ] T3 BLOCKED (needs user decision): src/data/testimonios.json and metricas.json were deleted in 6fedcac (legacy content unpublished); all proyectos are draft:true. No verified real proof data exists. Original: layout: proof beat scene between Solucion and Cierre (testimonios.json / metricas.json)
- [x] T4 polish: remove unused .text-sunset, run `pnpm check` + build
- [x] T5 distill (P2): film too long/repetitive. Merge Giro+Cierre intent into one closing scene (Cierre.astro absorbs Alivio), drop Alivio generic bullets + duplicate process (Servicios owns the 4 steps), one primary CTA per moment, shorter scroll, skip link surfaced after hero. Route: delegated writer.
- [x] T6 quieter (P2): film toward Servicios editorial language: flat solid button, no glow/halo, JetBrains Mono for labels/prices, gold-on-ivory contrast >= 4.5:1. Route: delegated writer.
Strategy: delegated direct, one writer. Photo (aboutPhoto) pending from user.
T5/T6 (delegated writer): pnpm check 0 errors, pnpm build 13 pages OK. No visual/browser check (extension not connected). Alivio.astro left unreferenced (delete denied).
