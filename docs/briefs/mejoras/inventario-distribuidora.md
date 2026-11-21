# Distribuidora del Sur — mejoras de marca y motion

Proyecto `03-inventario-distribuidora`: WMS ficticio de una distribuidora de embalaje de Córdoba (Astro 7 + GSAP 3, estático, live en https://03-inventario-distribuidora.vercel.app). Ya funciona y ya se mueve; el problema es que lo mejor (el plano) queda abajo del pliegue y la intro pasa una sola vez. **Idea wow:** "el depósito se arma solo y después respira". En la primera pantalla el plano ocupa el protagonismo: se traza, las cajas caen, el contador de unidades sube, y enseguida una caja amarilla viaja del camión en el muelle a su estantería dejando una estela, la estantería se llena y el KPI hace tick. Eso tiene que leerse en una captura y en 10 segundos de video.

## Estado actual

- **Marca:** nombre "Distribuidora del Sur" en Barlow Condensed junto a un isotipo de dos barras sobre cuadrado negro (`src/components/shell/Shell.astro` líneas 13-18, igual a `public/favicon.svg`). No hay wordmark propio ni variante horizontal/monocroma.
- **Paleta** (`src/styles/global.css`): hormigón `#e7e4de` / `#dcd8d0` / `#c3beb4`, línea `#a9a398`, tinta `#111110`, gris `#5b5852`, papel `#f3f1ec`, acento único amarillo seguridad `#ffc400`. Sin sombras ni gradientes (regla escrita en el CSS).
- **Tipografías:** `@fontsource/barlow-condensed` (display y números) y `@fontsource/barlow` (texto). Un solo easing tokenizado: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`.
- **Layout** (captura `11-marca-personal-marcial-fantini/src/assets/capturas/inventario-distribuidora.jpg`): sidebar negra con nav y operarios, topbar con buscador, "EN VIVO" + reloj, velocidad 1x/4x/10x, campana y chip "Demo · datos ficticios". En el contenido: título "Plano en vivo", 4 KPIs con sparkline, selector Norte/Sur/Centro, buscador, chips de categoría y recién ahí, desde y≈550 px, el plano del depósito.
- **Motion existente:** GSAP 3.15.1 (`package.json`), Flip, MotionPathPlugin, Draggable y ScrollTrigger cargados bajo demanda (`src/scripts/plugins.ts`, `rotation.ts`). Intro en `src/scripts/views/plano.ts` (`playIntro`): trazado del contorno con `strokeDashoffset`, estanterías que suben con stagger, cajas con `bounce.out`, puertas del muelle con `scaleX`, contador a `totalUnits()` en 1,8 s. Micro-animaciones WAAPI en `src/scripts/pulse.ts` (`tick`, `bump`, `blink`). Keyframes CSS en `src/styles/app.css` (`flash`, `shimmer`, `pop-in`, `toast-in/out`, `grow`). Navegación con `<ClientRouter />` y `transition:persist` en el shell. Modo `?showcase` de ~26 s en `src/scripts/showcase.ts`.
- **Puntos débiles:**
  - La intro se dispara con IntersectionObserver al 30 % del plano: en 1440×900 el plano casi no se ve y la intro pasa fuera de cuadro.
  - `introPlayed` la limita a una vez por sesión: al volver al plano no hay entrada.
  - Las sparklines de KPIs son grises y planas; la de "Ritmo de movimientos" es un serrucho que se lee como ruido.
  - No hay un momento firma en loop: el viaje de caja (MotionPath) existe pero es chico y no tiene jerarquía.
  - Las duraciones están hardcodeadas en cada archivo (0.2, 0.35, 0.45, 0.6...), sin sistema.
  - El isotipo se confunde con un ícono genérico de "gráfico de barras".

## Marca

- **Isotipo:** vista cenital de una estantería con carga. SVG 32×32: cuadrado `#111110` con `rx=3`; dentro, tres "estantes" horizontales de 20×3 en x=6, y=9/15/21, color `#e7e4de`; sobre el estante del medio, una caja `#ffc400` de 6×5 en x=17, y=10, y en el de abajo dos cajas de 5×5 en x=7 y x=13, y=16, en `#ffc400`. Lectura: "estante con mercadería", no "gráfico". Mantener versión monocroma (todo `currentColor`, cajas recortadas en negativo).
- **Wordmark:** "DISTRIBUIDORA DEL SUR" en Barlow Condensed 700, mayúsculas, tracking `0.04em`, con "DEL SUR" en peso 500. Variante compacta para mobile y favicon: "DS" en una celda 1:1 con el isotipo. Línea de descriptor debajo en Barlow 500 12 px: "Embalaje · Córdoba".
- **Paleta refinada:** mantener todo y agregar estados de stock explícitos: lleno `#111110`, medio `#5b5852`, crítico `#ffc400` con rayado (ya existe), y **un solo acento adicional para error/bloqueo** `#d9480f` (naranja óxido), usado solo en críticos sin pedido. El amarillo sigue siendo el acento de marca.
- **Escala tipográfica** (display condensada, ratio 1,25): 64/52/40/32/24/20; texto 16/14/12. Números siempre `font-variant-numeric: tabular-nums`. KPIs a 52 px en desktop, 40 px a 390 px.
- **Iconografía:** trazo 1,75 px, esquinas rectas, grilla 24, sin rellenos salvo el estado activo. Íconos de dominio propios: pallet, caja, film, camión, muelle.
- **Visualización de datos:** sparklines con línea tinta 1,5 px y área `#dcd8d0`; el último punto como un cuadrado de 4 px amarillo. "Ritmo" pasa a barras verticales (una por muestra), no línea. Cambios de valor: delta en pill negro con flecha (▲/▼) y color solo si cruza mínimo.
- **Microcopy:** operativo y seco, en voseo. "Ubicadas 576 u. en N-A07", "Bajo mínimo: reponé 120 u.", nada de "¡Genial!". Mantener el chip "Demo · datos ficticios" visible en topbar y en mobile.

## Motion

Herramientas: GSAP 3.15.1 ya instalado con Flip, MotionPathPlugin, Draggable, ScrollTrigger. Se permite sumar `DrawSVGPlugin` y `SplitText` (gratuitos desde GSAP 3.13, vienen en el mismo paquete `gsap`). No agregar otras librerías.

**Tokens** (crear `src/scripts/tokens.ts` y espejarlos en `:root`):
- Duraciones: `--d-instant: 120ms`, `--d-fast: 200ms`, `--d-base: 350ms`, `--d-slow: 600ms`, `--d-scene: 1200ms`.
- Easings: `--e-out: cubic-bezier(0.22,1,0.36,1)` (entradas), `--e-in-out: cubic-bezier(0.65,0,0.35,1)` (cámara, trazos), `--e-drop` = GSAP `back.out(1.6)` (cajas, reemplaza `bounce.out` que rebota demasiado), `--e-linear` para estelas.
- Stagger: `0.012s` para cajas, `0.04s` para estanterías, `0.06s` para KPIs.

**Intro de primera pantalla** (reescribir `playIntro`; disparar en `astro:page-load` cuando el plano está en viewport, y en cada visita al plano en versión corta de 1,2 s):
- t=0.0 s: KPIs y plano en estado vacío (opacidad 0, contador en 0).
- t=0.0–0.8 s: contorno del depósito con DrawSVG, `--e-in-out`.
- t=0.3–0.9 s: estanterías entran con `y: 12 → 0`, stagger 0.04.
- t=0.6–1.6 s: cajas caen `y: -24 → 0` con `back.out(1.6)`, stagger aleatorio 0.012.
- t=0.6–1.0 s: puertas del muelle `scaleX 0 → 1`.
- t=0.2–2.0 s: contador de unidades 0 → total, `power2.out`; KPIs restantes con stagger 0.06 y su sparkline trazándose.
- t=2.2 s: arranca el loop firma.

**Loop firma "la caja que llega"** (cada 6 s, sobre la simulación): camión entra al muelle (`x: -60 → 0`, 0.6 s), una caja amarilla sale por MotionPath hasta la estantería destino (1,1 s, `--e-in-out`) dejando una estela de 3 cuadrados que se desvanecen; al llegar, `bump` en la estantería, el número de la estantería hace tick y el KPI de unidades suma con roll de dígitos. Si la estantería estaba crítica, el rayado amarillo se retira con `clip-path` de abajo hacia arriba.

**Micro-interacciones:** hover de estantería `translateY(-2px)` + borde amarillo (`--d-fast`); press de botones `scale(0.97)` en `--d-instant`; chips de categoría con Flip (ya existe) a `--d-base`; cambio de depósito: cámara con `x` y `scale` a `--d-scene`; toasts entran desde la derecha en `--d-base`.

**Transiciones de datos:** números con roll por dígito (cada dígito en un span con `translateY`), nunca reemplazo seco; sparklines desplazan `x` una muestra en vez de redibujar; treemap de `/reportes` con Flip entre semanas.

**Rendimiento:** solo `transform` y `opacity` (y `clip-path` en el rayado); 60 fps con 6x CPU throttle en DevTools; reservar alto del plano para CLS 0; pausar loop y `gsap.ticker` con `IntersectionObserver` y `visibilitychange`. **Movimiento reducido:** con `.reduced`, todo en estado final, contadores con el valor real, loop firma desactivado, simulación en pausa hasta play (ya es así en `app.ts`).

## Modo vitrina

`?vitrina=1` (alias de `?showcase`, que debe seguir funcionando). Reusar `runShowcase` y reducirlo a 45 s en loop con semilla fija y velocidad 4x:
1. 0–6 s: intro completa del plano + primer loop firma.
2. 6–12 s: cambio de cámara Norte → Sur → Centro, filtro "Cintas" con Flip.
3. 12–18 s: hover y zoom Flip a una estantería crítica; "Reponer 120 u."; camión y llenado.
4. 18–26 s: `/productos` ordenado por unidades con destellos de stock en vivo.
5. 26–34 s: `/reposicion`, un pedido cruza las columnas con Flip.
6. 34–45 s: `/reportes`, treemap cambiando de semana, y vuelta al plano.

En vitrina: tipografía base +12 % (`html.is-showcase { font-size: 112.5% }`), cursor oculto, toasts más largos (4 s), sin localStorage (ya existe `freezePersistence`). Debe verse igual en dos corridas (sin `Math.random` fuera del PRNG).

## Entregables para el cliente

- **Captura 1440×900** de `/?vitrina=1` en t=2,4 s: plano completo arriba del pliegue, una caja en mitad del recorrido, KPI de unidades en su valor final.
- **Video 10 s 16:9** (1920×1080, 60 fps): 0–2 s plano se traza y caen las cajas; 2–4 s contador llega al total; 4–6 s camión y caja viajan a la estantería; 6–8 s cambio de cámara a Sur; 8–10 s zoom Flip a estantería con su ficha y el wordmark en la esquina.
- **Corte 9:16** (1080×1920, layout de 390 px): 0–3 s plano mobile se arma; 3–6 s caja viaja y KPI hace tick; 6–10 s ficha de producto con historial de 12 semanas.
- **OG 1200×630:** wordmark arriba a la izquierda, plano en vista cenital con 2 estanterías amarillas, "28.025 u. en 3 depósitos" en 64 px, chip "Demo".
- Regenerar `public/poster.jpg` con `pnpm poster` usando la nueva marca.

## Criterios de aceptación

- [ ] En 1440×900 el plano completo de un depósito es visible sin scroll.
- [ ] La intro se ve en la primera carga y en cada vuelta al plano (versión corta).
- [ ] Isotipo nuevo en sidebar, favicon y poster; chip "Demo" visible en desktop y a 390 px.
- [ ] Todas las duraciones y easings salen de los tokens (`rg "duration: 0\." src/scripts` sin resultados fuera de `tokens.ts`).
- [ ] CLS 0 y LCP < 2,0 s en Lighthouse mobile; performance ≥ 90.
- [ ] Cero errores en consola en las 6 vistas y en `?vitrina=1` durante 2 vueltas.
- [ ] Con `prefers-reduced-motion` se ve el estado final completo, sin animaciones.
- [ ] Loop firma pausado cuando el plano sale del viewport o la pestaña está oculta.
- [ ] https://03-inventario-distribuidora.vercel.app sirve la versión nueva.

## Plan en tramos

1. Tokens de motion en `tokens.ts` + `:root`; reemplazar duraciones hardcodeadas en `plano.ts` y `pulse.ts`. Salida: `rg` limpio.
2. Isotipo y wordmark nuevos en `Shell.astro` y `favicon.svg`. Salida: captura de la sidebar.
3. Compactar encabezado y KPIs para subir el plano arriba del pliegue. Salida: captura 1440×900.
4. Reescribir `playIntro` con la secuencia temporizada y DrawSVG. Salida: clip de 3 s.
5. Loop firma "la caja que llega" con estela y roll de dígitos. Salida: clip de 6 s.
6. Sparklines nuevas (barras para "Ritmo", último punto amarillo). Salida: captura de KPIs.
7. Pausa off-screen y modo reducido completo. Salida: captura con reduced motion + Performance panel a 60 fps.
8. `?vitrina=1` de 45 s. Salida: grabación de una vuelta completa.
9. Entregables: captura, video 16:9, corte 9:16, OG, poster. Salida: archivos exportados.
10. Lighthouse, consola, 390 px y deploy. Salida: reporte Lighthouse y URL live verificada.
