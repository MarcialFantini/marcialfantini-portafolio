# Muebles Río Luján — mejoras de marca y motion

Tienda online de una mueblería ficticia de Tucumán (Astro 7 estático + GSAP 3, en vivo en https://09-ecommerce-marca.vercel.app). El concepto ya está construido: el mueble se fabrica mientras lo elegís. Lo que falta es el momento que lo venda en una captura. **Idea wow:** al abrir la página, la Silla Tafí cae pieza por pieza y se encastra sola en 2,4 s sobre un tablón de madera, y apenas queda armada una veta de color la recorre y la cambia de madera mientras el precio rueda. El primer frame tiene que mostrar una silla terminada y hermosa, no palitos sueltos.

## Estado actual

- **Marca:** wordmark de solo texto "Río Luján" en Instrument Serif más una pastilla verde "Demo" (`src/layouts/Layout.astro:73-74`). No hay isotipo. En el footer, "Muebles Río Luján" en grande (`Layout.astro:132`).
- **Paleta** (`src/styles/global.css:29-41`): papel `#f4efe6`, `#ebe3d5`, `#e2d7c5`; madera `#dcc3a0`, `#cfb18a`; tinta `#1f1b16`, gris `#5b5247`; verde `#1f4a36` / `#173a2a`, verde suave `#d6e0d5`; noche `#1b2a22`.
- **Tipografía:** Instrument Serif 400 e Instrument Sans variable, locales en `public/fonts/`, con fallbacks ajustados por métricas. Escala `--step-0` a `--step-4` (14 px a clamp 7,5 rem).
- **Easing existente:** `--ease: cubic-bezier(0.2,0.7,0.1,1)` y `--ease-spring: cubic-bezier(0.34,1.4,0.5,1)`. Las duraciones están sueltas en cada regla (0.15 s a 0.9 s), sin tokens.
- **Layout del inicio** (`src/pages/index.astro`): split con texto a la izquierda y escenario isométrico a la derecha; abajo, habitación a escala, orden de taller, embalaje y mapa de envío.
- **Motion existente:** GSAP cargado bajo demanda (`src/lib/gsap.ts`: ScrollTrigger, Flip, Draggable, MotionPath). Armado de la silla con scroll vía la variable `--k` y ScrollTrigger con scrub 0.6 (`index.astro:116-145`). Precio con odómetro (`src/lib/odometer.ts`). Flip en el catálogo (`catalogo.astro:76`). Camión con MotionPath (`ShippingMap.astro`). Caja con timeline (`BoxScene.astro`). Taller con rAF que se pausa fuera de pantalla (`ProductionSlip.astro:184-208`). Keyframes CSS para sierra, lija, ticker y toasts (`scenes.css:285-298`, `shell.css`). `ClientRouter` de View Transitions (`Layout.astro:66`). Reveal por clase `.reveal.in`. Reduced motion global en `global.css:427`.
- **Modo vitrina:** `?showcase` existe (`src/scripts/showcase.ts`): loop de unos 24 s con scroll programado, cambio de madera, habitación, taller, caja y camión.
- **Puntos débiles (captura `capturas/ecommerce-marca.jpg`):** el primer frame muestra la silla **desarmada**: seis palos y dos placas flotando sobre un panel beige plano, y el asiento gris parece un error. El contador dice "0 de 9 piezas encastradas", que en una captura se lee como "no cargó". El panel derecho es un rectángulo `--wood` sin profundidad ni piso. El wordmark no tiene isotipo y pesa poco al lado del ticker oscuro. El hero no anima nada en la carga: todo depende del scroll.

## Marca

- **Isotipo:** una "L" de ensamble de caja y espiga en SVG de 24×24: dos barras de 4 px de grosor (vertical de 4×20 y horizontal de 16×4) que se encuentran en la esquina inferior izquierda; la horizontal termina en una espiga de 4×2 que entra en un hueco de la vertical. Relleno `--green` y la espiga en `--wood-2`. Va a la izquierda del wordmark con 8 px de separación. La pastilla "Demo" queda igual y visible.
- **Wordmark:** "Río Luján" en Instrument Serif con tracking -0.01em. La tilde de la "í" se reemplaza por un pequeño trazo de veta (path curvo de 1.5 px) solo en el SVG del logo, no en el texto del sitio.
- **Paleta refinada:** mantener todos los tokens actuales. Agregar `--wood-grain: #b8915f` (vetas y sombras del mueble), `--floor: #e9dcc6` (piso del escenario) y `--shadow-floor: rgba(31,27,22,.14)` (sombra de contacto). Un solo acento cálido para precios que cambian y la gota de "comprado": `--accent: #c2662d` (terracota), usado con moderación.
- **Escala tipográfica:** se conserva. Agregar `--step-5: clamp(4rem, 2rem + 8vw, 9.5rem)` solo para el número del contador de piezas en vitrina. Todos los números en `font-variant-numeric: tabular-nums`.
- **Iconografía:** trazo de 1.75 px, puntas redondeadas, 24 px, sin relleno (alineada con `Icon.astro`). Agregar íconos de serrucho, cepillo de carpintero y caja.
- **Microcopy:** tono de taller, en voseo. El contador del hero pasa a "9 de 9 piezas encastradas · lista para lijar" cuando termina el armado, y "Elegí la madera" durante el cambio. Nunca mostrar "0 de N" en el estado inicial.

## Motion

Herramientas: GSAP 3.15 ya está instalado con ScrollTrigger, Flip, Draggable y MotionPath (`src/lib/gsap.ts`). No instalar nada nuevo. Agregar los tokens a `global.css` y un espejo en `src/lib/motion.ts` para usarlos en GSAP.

- **Duraciones:** `--dur-instant: 120ms`, `--dur-fast: 200ms`, `--dur-base: 360ms`, `--dur-slow: 640ms`, `--dur-scene: 1200ms`.
- **Easings:** `--ease-out` = el `--ease` actual; `--ease-in-out: cubic-bezier(0.65,0,0.35,1)`; `--ease-spring` = el actual; `--ease-drop: cubic-bezier(0.5,0,0.75,0)` para piezas que caen. En GSAP: `power3.out`, `power2.inOut`, `back.out(1.6)`.

**Coreografía del hero (carga, sin scroll):**
- t=0.0 s: el panel derecho ya tiene piso (`--floor`) y sombra de contacto en elipse a opacidad 0. El texto está visible desde el SSR (no ocultar el h1).
- t=0.1 s: la sombra de contacto crece de scale 0.6 a 1 (`--dur-slow`).
- t=0.2–1.6 s: las 9 piezas caen desde y -40 px con opacidad 0→1, escalonadas cada 0.12 s, en orden patas → travesaños → asiento → respaldo, con `back.out(1.4)` al encastrar. El contador sube de "1 de 9" a "9 de 9" con cada pieza.
- t=1.7 s: un destello de veta (gradiente lineal enmascarado, translateX de -100 % a 100 %) recorre la silla en 0.6 s.
- t=2.4 s: el contador cambia a "lista para lijar" y aparece el precio con odómetro.
- Después, el ScrollTrigger actual **invierte** el sentido: al bajar, la silla se despieza levemente (k 0→0.35) para mostrar el ensamble y se vuelve a armar en el configurador. El estado inicial nunca es "desarmado".

**Momento en loop (firma):** cada 6 s, mientras el hero está en pantalla, la madera de la silla cambia en ciclo (algarrobo → petiribí → nogal → paraíso) con un barrido de clip-path de abajo hacia arriba (`--dur-scene`) y el precio rueda en el odómetro. Se pausa con IntersectionObserver fuera de pantalla y con la pestaña oculta.

**Escenas de scroll:** se mantienen las seis del brief original. Afinar: la habitación a escala entra con la regla en cm dibujándose (stroke-dashoffset); la orden de taller avanza un día por cada 8 % de scroll; el camión del mapa deja una estela punteada.

**Microinteracciones:** botones con press scale 0.97 en `--dur-instant`; hover de tarjeta de producto, la imagen sube 4 px y aparece la sombra de contacto; agregar al carrito, el ícono vuela al carrito con MotionPath (0.6 s) y el contador hace el `bump` existente; favoritos, el corazón se rellena con scale 0→1 y `back.out`.

**Datos:** precios siempre con el odómetro existente; stock y "personas viendo" interpolan el número en 0.4 s con tabular-nums; el ticker mantiene `feedIn`/`feedOut`.

**Rendimiento:** solo transform y opacity (el clip-path del barrido va en una capa con `will-change` durante la transición y se suelta al terminar). 60 fps en un portátil medio con DevTools en 4× CPU slowdown. CLS 0: el escenario reserva su aspect-ratio. Toda animación en loop se pausa fuera de pantalla. **Reduced motion:** la silla aparece armada en madera algarrobo, el contador dice "9 de 9", sin loop, sin barrido, sin scroll scrub, y el odómetro muestra el valor final sin rodar.

## Modo vitrina

Mantener `?showcase` y agregar el alias `?vitrina=1`. Loop determinista de 45 s, siempre con la semilla fija de `catalog.ts` y un `sim.ts` con reloj fijo (arranca en "Día 1 · 09:00", velocidad 2×).
- 0–4 s: intro del hero completa (silla cayendo y encastrando).
- 4–10 s: dos cambios de madera y uno de tela, con precio rodando.
- 10–16 s: el sillón se mueve en la habitación a escala y la regla marca la medida.
- 16–24 s: quince días del taller en 8 s.
- 24–30 s: la caja se cierra y se etiqueta.
- 30–40 s: el camión viaja a Santa Cruz y a Misiones.
- 40–45 s: fundido a papel con el isotipo y "Muebles Río Luján · Demo" centrados, y vuelta a empezar.
Legibilidad: en vitrina el texto base sube a 20 px, el ticker a 18 px y el contador de piezas usa `--step-5`. Cursor oculto (ya existe). Nunca escribe en `localStorage`.

## Entregables para el cliente

- **Captura 1440×900** del primer frame tras la intro (t=2.6 s): silla armada en nogal, piso y sombra, contador "9 de 9", precio visible. Reemplaza `11-marca-personal-marcial-fantini/src/assets/capturas/ecommerce-marca.jpg`.
- **Video 16:9, 10 s (1920×1080, 60 fps):** 0–2,4 s la silla se arma; 2,4–4 s barrido de madera a petiribí y precio rodando; 4–6 s scroll a la habitación y el sillón se arrastra; 6–8 s el taller avanza; 8–10 s el camión llega a Misiones y fundido al logo.
- **Corte vertical 9:16, 10 s (1080×1920)** grabado a 390 px de ancho: 0–3 s armado (la silla ocupa el 60 % superior); 3–6 s dos cambios de madera con el precio grande debajo; 6–10 s caja que se cierra y logo.
- **OG 1200×630:** silla armada a la derecha sobre su piso, "Hecho mientras lo elegís" en Instrument Serif a la izquierda, isotipo y pastilla Demo. Actualizar `scripts/poster.mjs` para generarla.
- **Específico:** un GIF de 4 s del cambio de madera (640 px de ancho) para mensajes de WhatsApp a prospectos.

## Criterios de aceptación

- [ ] El primer frame (captura sin scroll) muestra la silla armada; nunca "0 de N".
- [ ] CLS = 0 en Lighthouse móvil y escritorio; LCP < 2,0 s en escritorio y < 2,5 s en móvil.
- [ ] Sin errores ni warnings en consola en `/`, `/catalogo`, una ficha y `?vitrina=1`.
- [ ] A 390 px no hay scroll horizontal y la intro se ve completa.
- [ ] Con `prefers-reduced-motion: reduce` se ve el estado final armado, sin loop.
- [ ] El loop de madera se detiene con la pestaña oculta y con el hero fuera de pantalla (verificar en Performance).
- [ ] La pastilla "Demo" se ve en el header en todas las vistas y en la OG.
- [ ] `pnpm check` y `pnpm test:smoke` pasan.
- [ ] https://09-ecommerce-marca.vercel.app responde 200 y muestra la nueva intro tras el deploy.

## Plan en tramos

1. **Tokens (≤15 min):** agregar los tokens de duración y easing y `src/lib/motion.ts`; reemplazar 5 duraciones sueltas en `global.css`. Salida: `pnpm check` limpio.
2. **Estado inicial armado (≤15 min):** invertir la lógica de `--k` en `index.astro` para que la carga muestre la silla armada y el contador correcto. Salida: captura 1440×900.
3. **Piso y sombra (≤15 min):** `--floor` y la elipse de sombra en `.stage-panel`. Salida: captura comparada con la actual.
4. **Intro de caída (≤15 min):** timeline GSAP de las 9 piezas y el contador. Salida: clip de 3 s.
5. **Barrido de madera y loop (≤15 min):** clip-path, odómetro y pausa fuera de pantalla. Salida: clip de 8 s y un trace de Performance sin long tasks.
6. **Isotipo y wordmark (≤15 min):** SVG en `Layout.astro` y favicon. Salida: captura del header a 1440 y 390 px.
7. **Microinteracciones (≤15 min):** vuelo al carrito y press de botones. Salida: clip de 3 s.
8. **Vitrina 45 s (≤15 min):** alias `?vitrina=1`, reloj fijo, cierre con logo. Salida: grabación completa del loop.
9. **Reduced motion y medición (≤15 min):** emular reduce, correr Lighthouse. Salida: captura reduce más CLS y LCP anotados.
10. **Entregables (≤15 min):** captura, OG, 16:9 y 9:16. Salida: los archivos en `11-marca-personal-marcial-fantini/src/assets/`.
11. **Deploy y verificación (≤15 min):** pasar `pnpm test:smoke` y verificar la URL en vivo. Salida: captura de la URL en vivo.
