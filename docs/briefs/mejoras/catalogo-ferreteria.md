# Ferretería El Tornillo — mejoras de marca y motion

Catálogo online de una ferretería familiar ficticia de Ituzaingó (Astro 7, Tailwind 4, islas Preact con signals): 40 productos con stock y precio, carrito de presupuesto, favoritos y comparador, y salida a WhatsApp con el mensaje armado. **Idea wow, "el presupuesto se imprime":** el visitante suma productos, y a la derecha sale un ticket de mostrador renglón por renglón, como de una impresora térmica, con el total rodando. Al tocar "Enviar", el ticket se pliega y se convierte en una burbuja de WhatsApp verde con el mismo detalle. Esa transformación de ticket a mensaje es la captura y el video.

> **Antes de implementar:** el repo tiene 81 cambios sin commitear (77 modificados y 4 nuevos: `public/images/archivo/`, `src/components/PageHead.astro`, `src/components/ProductBuy.tsx`, `src/pages/404.astro`). `package.json` agrega `@fontsource-variable/albert-sans`, `@fontsource/imbue` y `sharp`, y el README todavía dice Bunny Fonts. Ese trabajo se commitea (o se descarta con el dueño) **antes** del primer tramo. Este brief describe el árbol de trabajo tal como está hoy.

## Estado actual

- **Marca:** isotipo de cabeza de tornillo hexagonal con ranura sobre un cuadrado plano (`src/components/Brand.astro`), wordmark "EL TORNILLO" en Imbue. Barra superior con dirección y horarios (`src/components/Header.astro:57`). **No hay marca "Demo" visible en el header**: solo aparece "Demo con datos ficticios" dentro del cajón del carrito (`CartDrawer.tsx:117`).
- **Paleta** (`src/styles/global.css:17-30`, `@theme` de Tailwind 4): tinta petróleo `#06525C`, `#0B6873`, `#043B43`; muted `#1F5C66`; papel `#F7F9F8`, `#FCFDFC`; superficie `#EBF0EE`, `#DCE6E3`; línea `#C3D4D0`; menta `#BFE0D8`, `#8FC5BA`; señal `#B3420A` / `#8A3207`. En las líneas 33-54 hay una docena de alias heredados (`--color-mustard`, `--color-navy`, `--color-kraft`…) que apuntan a esos mismos valores.
- **Tipografía:** Imbue 500/700 (display condensada) y Albert Sans variable, autoalojadas con fontsource (`global.css:2-6`).
- **Layout de la home** (`src/pages/index.astro:95-160`): hero petróleo con "PRECIO A LA VISTA" gigante y una pila de carpetas con solapas (Plomería, Electricidad, Pinturería, Herramientas, Catálogo) con conteo y precio desde; debajo, "La lista del mostrador" en hoja de papel.
- **Motion existente:** solo CSS. Keyframes `fadeUp`, `riseIn` (escalonado de 70 ms), `slideRight`, `toastIn`, `drift`, `pulseTone` y `shimmer` (`global.css:151-176`); reveal con IntersectionObserver en `src/layouts/Layout.astro:70` (`[data-reveal]`); hover de solapas `-translate-y-1.5`; subrayados con `scaleX`. Reduced motion global en `global.css:221`. No hay GSAP ni View Transitions, y no hay modo vitrina.
- **Diferencias con el brief original** (`docs/briefs/demo-catalogo-ferreteria.md`): pedía pared de cajoncitos, lluvia de tornillos en canvas, 200 productos y `?showcase`. Nada de eso existe: hay 40 productos y la metáfora es de carpetas.
- **Puntos débiles (captura `capturas/catalogo-ferreteria.jpg`):** las solapas se superponen al texto de su fila: "Herramientas" tapa "…s · desde $ 9.400" y "Catálogo" tapa "5 productos ·" (posiciones fijas en `left: 3/23/43/63/84%`, líneas 52-55 y 139). El hero es estático: solo tiene un fade-up. No hay ningún producto ni precio grande en la primera pantalla. Falta la marca Demo.

## Marca

- **Isotipo:** conservar la cabeza hexagonal y refinarla. Hexágono de 24 px de lado con esquinas redondeadas de 1.5 px, ranura de 14×3 px girada 0°, y un chaflán interior de 2 px en `--color-ink-soft` para dar volumen sin sombras. Variante animable: la ranura como `<rect>` separado, para poder girarla 90° como un destornillador.
- **Wordmark:** "EL TORNILLO" en Imbue 700 con tracking 0.02em, y debajo "Ferretería · Ituzaingó · 1985" en Albert Sans 600 a 11 px en mayúsculas espaciadas. Junto al wordmark, una pastilla **"Demo"** en `--color-signal` con texto papel, visible en todas las páginas.
- **Paleta:** mantener los tokens base y **borrar los alias heredados** de las líneas 33-54 (reemplazar sus usos). Un solo acento: `--color-signal: #B3420A` para precio, "agregado" y el sello del ticket. Agregar `--color-wa: #1F7A4D` (verde WhatsApp sobrio, no el oficial) solo para la burbuja final y `--color-thermal: #FBFAF5` para el papel del ticket.
- **Escala tipográfica:** 14 / 16 / 18 / 22 / 28 / 40 / 64 / clamp(96 px, 11vw, 176 px). Precios siempre en Imbue con tabular-nums.
- **Iconografía:** trazo de 2 px, puntas cuadradas (más ferretera que redondeada), 20 px. Íconos de llave, cinta métrica, gota de pintura, enchufe y caño para las cinco categorías.
- **Ticket:** ancho de 320 px, papel `--color-thermal`, borde inferior dentado (máscara SVG de zigzag de 8 px), texto en Albert Sans 500 a 15 px con puntos guía entre producto y precio, sello circular "EL TORNILLO · PRESUPUESTO" en `--color-signal` a 12° de giro.
- **Microcopy:** de mostrador y en voseo. "Sumá", "Te lo separamos", "Retiralo en dos horas". Botón final: "Mandar por WhatsApp".

## Motion

Herramientas: el proyecto no tiene librería de animación (`package.json`). Agregar **GSAP 3** (core y Flip, gratis) cargado con `import()` dinámico solo en la home y en el carrito, para no pesar en las fichas. Las animaciones simples siguen en CSS. Las islas Preact disparan la animación con un evento (`ticket:add`) y no manejan el tiempo.

- **Duraciones:** `--dur-press: 80ms`, `--dur-fast: 180ms`, `--dur-base: 320ms`, `--dur-slow: 600ms`, `--dur-print: 420ms` (un renglón del ticket).
- **Easings:** `--ease-out: cubic-bezier(.2,.7,.2,1)` (el que ya se usa, ahora con nombre), `--ease-in-out: cubic-bezier(.65,0,.35,1)`, `--ease-snap: cubic-bezier(.3,1.5,.6,1)`. En GSAP: `power3.out`, `power2.inOut`, `back.out(1.8)`, y `steps(6)` para el avance del papel.

**Coreografía del hero:**
- t=0.0 s: fondo petróleo y "PRECIO A LA VISTA" visibles desde el SSR, sin animación del h1 (es el LCP).
- t=0.15 s: las cinco carpetas suben desde y 40 px escalonadas cada 80 ms, de atrás hacia adelante (`--ease-snap`).
- t=0.7 s: cada solapa hace un pequeño rebote de 4 px al asentarse.
- t=0.9 s: en cada fila, el "desde $" cuenta de 0 al valor en 0,6 s.
- t=1.5 s: la ranura del isotipo gira 90° y vuelve (0,5 s), una sola vez.
- Arreglo previo obligatorio: las solapas pasan de `left` fijo a una columna propia de la grilla, y el conteo y precio se alinean en otra columna, sin superposición en ningún ancho.

**Momento en loop (firma), "el ticket":** en la home, un ticket de ejemplo a la derecha del hero (escritorio) o debajo (móvil) imprime tres renglones (cinta aisladora, llave térmica 25 A, cable 2,5 mm × 100 m) cada `--dur-print`, el papel avanza con `steps(6)`, el total rueda, cae el sello con `back.out`, espera 2 s, se pliega con scaleY 1→0.15 y se convierte en burbuja de WhatsApp (Flip entre ticket y burbuja), que muestra dos tildes que pasan a "leído". Se repite cada 9 s y se pausa fuera de pantalla.

**Escenas de scroll:** "La lista del mostrador" entra como una hoja que se apoya (rotate -1.5°→0°, y 24 px→0). Las filas con stock bajo hacen un `pulseTone` una sola vez al entrar.

**Microinteracciones:** "Sumar al presupuesto": el producto vuela al botón "Presupuesto" del header con Flip (0,5 s), el contador hace un rebote de escala 1→1.25→1, y en el cajón el renglón nuevo se imprime con el mismo efecto del ticket. Favorito: el ícono se rellena con scale 0→1. Comparar: la tarjeta baja a la bandeja de comparación. Botones con press scale 0.97 en `--dur-press`.

**Datos:** stock y precio interpolan en 300 ms con tabular-nums. Filtros del catálogo con Flip para el reacomodo de la grilla (máximo 40 ítems, así que es viable).

**Rendimiento:** solo transform y opacity (el pliegue usa scaleY, no height). CLS 0: el ticket reserva su caja. GSAP fuera del bundle inicial. Pausa fuera de pantalla con IntersectionObserver. **Reduced motion:** las carpetas aparecen en su lugar, el ticket se muestra completo con sello y burbuja al lado, sin loop, y "sumar" actualiza el contador sin vuelo.

## Modo vitrina

`?vitrina=1` (y `?showcase` como alias): loop de 40 s con carrito en memoria (nunca escribe `localStorage`) y precios fijos del content collection.
- 0–4 s: intro del hero.
- 4–13 s: el ticket imprime tres renglones, cae el sello y se convierte en WhatsApp.
- 13–22 s: scroll a "La lista del mostrador"; el cursor fantasma suma dos productos y vuelan al presupuesto.
- 22–30 s: el cajón del presupuesto se abre y muestra 5 renglones y el total.
- 30–36 s: comparador con dos llaves térmicas lado a lado.
- 36–40 s: fundido al isotipo, "Ferretería El Tornillo · Demo" y vuelta a empezar.
Legibilidad: texto base a 20 px y ticket a 1,25×. Cursor del sistema oculto; el cursor fantasma es un círculo de 24 px.

## Entregables para el cliente

- **Captura 1440×900:** hero sin superposiciones con el ticket en el instante del sello. Reemplaza `11-marca-personal-marcial-fantini/src/assets/capturas/catalogo-ferreteria.jpg`.
- **Video 16:9, 10 s:** 0–1,5 s las carpetas suben; 1,5–5 s el ticket imprime tres renglones y el total rueda; 5–6 s cae el sello; 6–8,5 s pliegue a burbuja de WhatsApp con los dos tildes; 8,5–10 s logo y "Demo".
- **Corte vertical 9:16, 10 s** a 390 px: el ticket ocupa el centro de la pantalla; 0–6 s imprime; 6–9 s se convierte en burbuja; 9–10 s logo.
- **OG 1200×630:** "PRECIO A LA VISTA" en Imbue sobre petróleo, el ticket con sello a la derecha y la pastilla Demo.
- **Específico:** PNG 1080×1080 del ticket con sello, para usar como ejemplo de "presupuesto por WhatsApp" en propuestas.

## Criterios de aceptación

- [ ] El árbol de trabajo estaba limpio (los 81 cambios commiteados o resueltos) antes del primer commit de este brief.
- [ ] Las solapas no tapan texto a 390, 768, 1024, 1440 y 1920 px.
- [ ] La pastilla "Demo" es visible en el header de todas las páginas y en la OG.
- [ ] CLS = 0; LCP < 2,0 s en escritorio y < 2,5 s en móvil; Lighthouse móvil de performance ≥ 90.
- [ ] GSAP no aparece en el bundle de `/productos/[slug]` hasta que se usa (verificar en Network).
- [ ] Con reduced motion se ve el ticket final completo, sin loop.
- [ ] Sin errores en consola en `/`, `/productos`, una ficha, `/comparar` y `?vitrina=1`.
- [ ] El mensaje de WhatsApp generado coincide renglón por renglón con el ticket.
- [ ] `pnpm build` y `astro check` pasan.

## Plan en tramos

0. **Resolver el WIP (≤15 min, con el dueño):** revisar el diff, commitear en unidades (fuentes, SVG de productos, componentes nuevos) y actualizar el README de fuentes. Salida: `git status` limpio.
1. **Arreglar las solapas (≤15 min):** grilla de dos columnas en el hero. Salida: capturas a 390 y 1440 px sin superposición.
2. **Pastilla Demo e isotipo refinado (≤15 min):** `Brand.astro` y `Header.astro`. Salida: captura del header.
3. **Tokens y limpieza de alias (≤15 min):** duraciones y easings nombrados, alias borrados. Salida: build limpio y captura sin cambios visuales.
4. **Ticket estático (≤15 min):** componente con papel dentado, renglones, total y sello. Salida: captura del ticket.
5. **GSAP y la impresión (≤15 min):** instalar `gsap`, carga dinámica, renglones con avance de papel. Salida: clip de 4 s.
6. **Ticket → WhatsApp (≤15 min):** pliegue, Flip a la burbuja, tildes y loop con pausa. Salida: clip de 9 s.
7. **Intro del hero (≤15 min):** carpetas y conteo de precios. Salida: clip de 2 s.
8. **Vuelo al presupuesto (≤15 min):** evento `ticket:add` desde la isla y Flip al header. Salida: clip de 3 s.
9. **Reduced motion y medición (≤15 min):** Salida: captura con reduce emulado, más CLS y LCP anotados.
10. **Vitrina 40 s (≤15 min):** Salida: grabación completa del loop.
11. **Entregables (≤15 min):** captura, OG, 16:9, 9:16 y PNG del ticket. Salida: los archivos en `11-marca-personal-marcial-fantini/src/assets/`.
