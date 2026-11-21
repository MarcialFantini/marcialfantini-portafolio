# Consultora Norte — mejoras de marca y motion

Blog editorial de una consultora ficticia de Córdoba para PyMEs industriales (Astro 7 estático, Tailwind 4, sin JS de framework): portada monumental con la palabra NORTE, calculadora de OEE, artículos con índice y progreso de lectura, socios, biblioteca y RSS. **Idea wow, "la brújula se vuelve indicador":** la "O" de NORTE es una brújula. Al cargar, la aguja oscila y se asienta en el norte; al bajar, esa misma brújula se desprende del titular, viaja hasta la banda verde de la calculadora y se convierte en el cuadrante del OEE, donde la aguja marca 71,7 % y se mueve con cada slider. Una sola pieza de marca que pasa de símbolo a instrumento de medición.

## Estado actual

- **Marca:** en el header, un punto más "Norte" en Instrument Serif (`src/components/SiteHeader.astro:18-19`, `.brand-dot`). En el hero, "NORTE" como monumento con la "O" reemplazada por un SVG de brújula (`src/pages/index.astro:43-45`, `.mon .compass`). La marca de demo solo está en el footer (`SiteFooter.astro:63`), en Comentarios, Contacto y Biblioteca; **no se ve en la primera pantalla**.
- **Paleta** (`src/styles/global.css:16-27`): arena `#ddd6c6`, `#d2cab8`, `#c7bfaa`; tinta `#2a2a26`, `#3b3a33`; musgo `#45572f` (acento) y campo `#3f5a2a` con texto `#f3f3ef`; inversos `#2a2a26` / `#e3e1d9` / `#c4bfb0`; scrim `rgba(24,24,21,.4)`.
- **Tipografía:** Instrument Serif (display) y Source Serif 4 variable (lectura), con fontsource. Escala fluida `--step-small` a `--step-poster` (`global.css:33-38`). Un solo easing, `--ease: cubic-bezier(0.22,0.8,0.2,1)`.
- **Motion existente:** crossfade de 4 fotos cada 6,5 s con drift de 16 s (`global.css:190-194`, script en `index.astro:238-262`), con pausa por `visibilitychange`. Aguja de la brújula con la keyframe `swing` de 3,2 s, una vez (`global.css:204-208`). Reveal por IntersectionObserver en `src/layouts/BaseLayout.astro:62-66`. Barra de lectura con rAF (`ReadingProgress.astro`). Calculadora de OEE: sliders que actualizan número, barra `scaleX` y lectura en texto, sin interpolación (`index.astro:263-290`; valores por defecto `disp 88, perf 84, cal 97` → 71,7 %). Reduced motion en `global.css:552`. No hay GSAP ni View Transitions, y no hay modo vitrina.
- **Puntos débiles (captura `capturas/blog-consultora.jpg`):** la bajada "Notas de estrategia…" queda sobre el metal fundido más brillante y "finanzas para" casi no se lee (el scrim es 0,05 / 0,16). La brújula es gris plano, con una aguja que no se distingue del fondo naranja. No hay marca "Demo" en la primera pantalla. Los cuatro guiones del carrusel sugieren un slider genérico. El número del OEE salta de valor sin transición, y el momento más vendedor (la calculadora) está bajo el pliegue y desconectado del hero.

## Marca

- **Isotipo:** la brújula del hero pasa a ser el logo. Círculo de 100×100 con trazo de 8, aguja en rombo de 14×64 partida en dos mitades: norte en `--signal` (nuevo, ver abajo) y sur en `--inverse-ink` al 60 %, eje central de 8 px en `--ink`. Cuatro marcas cardinales de 2×8 px en el interior; la del norte es más larga (2×12). La versión chica (24 px) reemplaza al `.brand-dot` del header.
- **Wordmark:** "Norte" en Instrument Serif con tracking -0.02em y, debajo, "Consultora · Córdoba · 2014" en Source Serif 4 600, 11 px, mayúsculas con tracking 0.12em. Al lado, una pastilla **"Demo"** en `--surface` con texto `--ink`, visible en el header de todas las páginas, también sobre el hero (versión invertida).
- **Paleta:** mantener arena, tinta y musgo. Agregar un único acento: `--signal: #c8532a` (óxido, en diálogo con las fotos de acería), solo para la punta norte de la aguja, el valor del OEE y el estado activo de los sliders. Subir el scrim del hero a un degradado de `rgba(20,20,17,.55)` a la izquierda (0–45 % del ancho) hacia transparente.
- **Escala tipográfica:** se conserva. Agregar `--step-dial: clamp(3rem, 2rem + 4vw, 5.5rem)` para el número dentro del cuadrante.
- **Iconografía:** trazo de 1.5 px, puntas cuadradas, estilo instrumento de medición (reglas, marcas, ejes), sin rellenos.
- **Visualización de datos:** el cuadrante del OEE es un arco de 240° con marcas cada 5 % y etiquetas en 0, 40, 60 y 85 ("clase mundial"); zonas de fondo en tres tonos de musgo (crítica < 40, habitual 40–60, competitiva 60–85) y una franja de 85–100 en `--field-ink` al 30 %. Debajo, las tres pérdidas como barras horizontales (ya existen con `scaleX`).
- **Microcopy:** de consultor sobrio, sin promesas. "Tu línea produce 71,7 de cada 100 piezas posibles." "La mayor pérdida está en el rendimiento: 16 puntos."

## Motion

Herramientas: el proyecto no tiene librería de animación (`package.json`). Agregar **GSAP 3** con ScrollTrigger (gratis), cargado con `import()` solo en la portada. El resto del sitio sigue en CSS. Para la navegación entre artículos se pueden usar las View Transitions nativas de Astro (`<ClientRouter />`), con la imagen de la nota como elemento compartido.

- **Duraciones:** `--dur-fast: 180ms`, `--dur-base: 360ms`, `--dur-slow: 700ms`, `--dur-swing: 2400ms`, `--dur-fade: 1800ms` (crossfade de fotos, ya existe).
- **Easings:** `--ease-out` = el `--ease` actual; `--ease-in-out: cubic-bezier(0.65,0,0.35,1)`; `--ease-needle: cubic-bezier(0.2,0.9,0.3,1)`. En GSAP: `power3.out`, `power2.inOut` y `elastic.out(1,0.45)` solo para la aguja.

**Coreografía del hero:**
- t=0.0 s: foto 1 y "NORTE" visibles desde el SSR (el h1 es el LCP; no se oculta).
- t=0.1 s: el scrim izquierdo entra de opacidad 0,3 a 1 en `--dur-slow` y la bajada queda legible.
- t=0.3 s: las letras N, R, T, E suben 0,08 em con opacidad 0,6→1, escalonadas cada 60 ms (solo transform).
- t=0.5–2.9 s: la aguja gira desde 118° y se asienta en 0° con `elastic.out` (reemplaza la keyframe `swing`).
- t=2.9 s: la punta norte destella (opacidad 1→0,6→1, 300 ms) y la pastilla Demo y "Leer los artículos" aparecen con un fade.

**Momento en loop (firma):** cada 6,5 s, junto con el cambio de foto, la aguja hace una corrección mínima (±6° y vuelta a 0 en 900 ms), como una brújula real. Se pausa con la pestaña oculta (ya existe) y fuera de pantalla.

**Escena de scroll (la clave):** ScrollTrigger con `scrub: 0.5` entre el final del hero y la banda `.band-field`. La brújula se clona a una capa fija (la del h1 se oculta con opacidad), se traslada y escala hasta la posición del cuadrante, el círculo se abre en un arco de 240° (`stroke-dashoffset`) y la aguja gira de 0° al ángulo de 71,7 %. Al terminar, la capa se oculta y queda el cuadrante real de la banda. El resto de las secciones entran con el reveal existente.

**Microinteracciones:** sliders con el pulgar escalando 1→1.15 al tomarlo; el número del OEE interpola en 400 ms con tabular-nums y la aguja lo sigue con `power3.out`; la lectura en texto hace un fundido cruzado de 200 ms al cambiar de zona. Tarjetas de artículo: la foto escala 1→1.03 en `--dur-slow` y el título subraya con `scaleX`. Botones con press scale 0.98.

**Datos:** todos los números de la calculadora interpolan; las barras de pérdida mantienen `scaleX`. En artículos, la barra de progreso de lectura existente se mantiene.

**Rendimiento:** solo transform, opacity y `stroke-dashoffset` en SVG chico. CLS 0: el cuadrante reserva su caja y la capa del viaje es `position: fixed`. GSAP no carga en artículos. Fotos del hero con `fetchpriority="high"` solo la primera. **Reduced motion:** sin crossfade (primera foto fija), aguja en 0° sin oscilar, sin viaje de la brújula (el cuadrante ya está en su lugar con la aguja en 71,7 %), y los números cambian sin interpolar.

## Modo vitrina

`?vitrina=1`: loop de 40 s en la portada con valores fijos.
- 0–4 s: intro del hero con la aguja asentándose.
- 4–8 s: cambio a la foto 2 y corrección de la aguja.
- 8–14 s: scroll automático y la brújula viaja hasta convertirse en el cuadrante (71,7 %).
- 14–26 s: los sliders se mueven solos: rendimiento de 84 a 62 (el OEE baja a 52,9 %, zona "habitual"), después disponibilidad a 95 y rendimiento a 92 (el OEE sube a 84,8 %), con la aguja y la lectura acompañando.
- 26–34 s: scroll a las notas destacadas, con hover simulado sobre dos tarjetas.
- 34–40 s: fundido a arena con el isotipo, "Consultora Norte · Demo" y vuelta a empezar.
Legibilidad: número del cuadrante a 120 px y lectura a 24 px. Sin cursor. No guarda nada.

## Entregables para el cliente

- **Captura 1440×900** del hero en t=3 s, con scrim nuevo, aguja asentada y pastilla Demo. Reemplaza `11-marca-personal-marcial-fantini/src/assets/capturas/blog-consultora.jpg`.
- **Captura 1440×900 adicional** de la banda del OEE con el cuadrante en 71,7 %.
- **Video 16:9, 10 s:** 0–3 s la aguja oscila y se asienta; 3–6 s la brújula viaja y se abre en cuadrante; 6–9 s un slider baja y la aguja cae a 52,9 %; 9–10 s isotipo y "Demo".
- **Corte vertical 9:16, 10 s** a 390 px: "NORTE" apilado en dos líneas con la brújula grande; 0–3 s aguja; 3–6 s viaje al cuadrante (centrado); 6–10 s sliders y aguja.
- **OG 1200×630:** foto de acería con scrim, "NORTE" con la brújula, pastilla Demo. Variante por artículo: título de la nota sobre arena con el isotipo chico.

## Criterios de aceptación

- [ ] La bajada del hero cumple contraste ≥ 4,5:1 sobre las cuatro fotos (medir en el punto más claro).
- [ ] La pastilla "Demo" es visible en la primera pantalla y en el header de todas las páginas.
- [ ] CLS = 0; LCP < 2,5 s en móvil (la foto del hero es el LCP) y < 1,8 s en escritorio.
- [ ] La aguja del cuadrante indica el mismo valor que el número en todo momento (probar 10 combinaciones de sliders).
- [ ] GSAP no se descarga en `/blog/[slug]`.
- [ ] Con reduced motion: foto fija, aguja quieta y cuadrante en su estado final.
- [ ] Sin errores en consola en `/`, una nota, `/blog/buscar` y `?vitrina=1`; funciona a 390 px sin scroll horizontal.
- [ ] `astro build` y `astro check` pasan; RSS y sitemap se siguen generando.

## Plan en tramos

1. **Scrim y legibilidad (≤15 min):** degradado izquierdo. Salida: capturas de las 4 fotos con contraste medido.
2. **Pastilla Demo e isotipo (≤15 min):** SVG de la brújula en el header. Salida: captura del header claro y sobre el hero.
3. **Tokens (≤15 min):** duraciones, easings y `--signal`. Salida: build limpio.
4. **Brújula de marca (≤15 min):** aguja bicolor y marcas cardinales en el hero. Salida: captura 1440×900.
5. **Intro con GSAP (≤15 min):** instalar `gsap`, cargarlo en la portada, letras y aguja elástica. Salida: clip de 3 s.
6. **Cuadrante estático (≤15 min):** arco de 240°, zonas y aguja ligada a los sliders con interpolación. Salida: captura de la banda y clip de 3 s moviendo un slider.
7. **Viaje brújula → cuadrante (≤15 min):** ScrollTrigger con scrub. Salida: clip de 4 s.
8. **Loop y pausa (≤15 min):** corrección de la aguja con el crossfade, IntersectionObserver. Salida: trace de Performance.
9. **Reduced motion (≤15 min):** Salida: captura con reduce emulado de hero y banda.
10. **Vitrina 40 s (≤15 min):** Salida: grabación completa.
11. **Medición y entregables (≤15 min):** Lighthouse, OG y videos. Salida: CLS y LCP anotados y archivos en `11-marca-personal-marcial-fantini/src/assets/`.
