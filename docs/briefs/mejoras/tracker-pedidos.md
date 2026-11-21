# Logística Andina — mejoras de marca y motion

Proyecto `05-tracker-pedidos`: TMS ficticio de un mayorista de Córdoba, con vista de cliente (seguir un pedido) y centro de control (flota, pedidos, depósito, repartidores, métricas, incidencias). Astro 7 + GSAP 3 (Flip, MotionPathPlugin, ScrollToPlugin) + View Transitions. Está vinculado a Vercel (`.vercel/project.json`, proyecto `05-tracker-pedidos`), pero no declara `site` en `astro.config.mjs` ni URL en el README. La paleta de 5 estados ya es memorable, pero la primera pantalla es solo un titular con media pantalla vacía. **Idea wow:** "el pedido cambia de color mientras viaja". En el hero, a la derecha del titular, un mapa de Córdoba donde un camión recorre la ruta y, a medida que pasa cada parada, una barra de 5 etapas se llena y todo el acento de la página (titular, botón, chip) cambia al color de la etapa: azul → amarillo → naranja → magenta → verde. Al tipear un número, ese número vuela hasta la ficha del pedido.

## Estado actual

- **Marca:** "Logística Andina" en Manrope semibold con un ícono de cubo isométrico negro y chip "DEMO" amarillo con borde negro (captura). Favicon `public/favicon.svg`: cuadrado amarillo `#f3b419` con un cubo negro.
- **Paleta** (`src/styles/global.css`): papel `#f3efe6` / `#ebe5d8`, tarjeta `#fffcf6`, tinta `#16130f`, `#3a342c`, gris `#635c52`, línea `#d9d1c1`. Estados: recibido `#2e5be8`, preparando `#f3b419`, despachado `#f06a2c`, en camino `#d6336c`, entregado `#137a4b`, cada uno con su color de texto (`--on-*`). Radio 14 px, sombras duras desplazadas (tarjeta del buscador).
- **Tipografías:** Oswald Variable (display) y Manrope Variable (texto), por `@fontsource-variable`.
- **Layout** (captura `11-marca-personal-marcial-fantini/src/assets/capturas/tracker-pedidos.jpg`): topbar con marca, "EN VIVO" + reloj 10:03, pausa, 1x/4x/10x, "+1 h", buscador y campana; tabs de vistas; hero con kicker, titular "¿DÓNDE ESTÁ / TU PEDIDO?" (segunda línea en magenta), lead, tarjeta con input "LA-2129" y botón "Seguir pedido"; abajo, franja de 5 bloques de color numerados 01–05 cortada por el pliegue.
- **Motion existente:** entrada del hero en `src/scripts/entry.ts` (líneas 86-93: `gsap.from` del titular, lead, buscador y pasos del recorrido); sacudida elástica del input si el número no existe (línea 53). Ficha del pedido: camión por MotionPath con `autoRotate` en `scenes/livemap.ts`, línea de etapas en loop en `scenes/timeline.ts`, caja 3D con `rotationX` en `scenes/packing.ts`, firma y calificación en `scenes/receipt.ts`. Una animación CSS en `global.css`, varias en `warehouse.ts`. Modo `?showcase` de ~30 s en `src/scripts/showcase.ts` que maneja el reloj simulado.
- **Puntos débiles:**
  - En la captura, la tilde de "ESTÁ" se monta sobre el kicker "Seguimiento de pedidos · Córdoba" (se lee "Cór_ba"): falta espacio sobre el titular (`line-height` y margen en `src/pages/index.astro`).
  - La mitad derecha del hero está vacía; el producto (mapa, camión) no aparece en la primera pantalla.
  - El placeholder "LA-2129" en gris claro parece deshabilitado.
  - La franja 01–05 queda cortada por el pliegue y no se explica.
  - El cubo isométrico es un ícono genérico de "paquete".
  - Duraciones sueltas (0.3, 0.4, 0.5, 0.6, 0.8) y easings distintos por archivo.

## Marca

- **Isotipo:** una "A" construida como ruta. SVG 32×32 sobre cuadrado `#16130f` con `rx=7`: dos trazos de 3 px con terminación redonda que forman una montaña/A (de (8,24) a (16,8) a (24,24)), y el travesaño reemplazado por un punto de 4 px de diámetro en (16,19) en el color de la etapa activa (por defecto `#f3b419`). Lectura: cordillera + ruta + parada. Monocromo: trazos y punto en `currentColor`.
- **Wordmark:** "Logística Andina" en Oswald 600, mayúsculas, tracking `0.02em`; "ANDINA" en el color de estado activo. Chip "DEMO" se mantiene igual.
- **Paleta refinada:** mantener los 5 estados (son la marca). Definir `--accent` como variable viva que toma el estado actual (`--accent: var(--st-en-camino)` por defecto en el hero). Agregar `--alert: #b42318` solo para incidencias (hoy se usa el naranja de "despachado", que se confunde).
- **Escala tipográfica:** titular `clamp(56px, 9vw, 132px)` con `line-height: 0.92` y `margin-top` ≥ 0,3em para la tilde; display 48/32/24/20; texto 18/16/14/12. Números de pedido y horas siempre Oswald con `tabular-nums`.
- **Iconografía:** trazo 2 px, terminaciones redondas (coherente con el radio 14), grilla 24. Íconos de etapa = las microilustraciones de `StageArt.astro`, unificadas a 2 colores (tinta + estado).
- **Visualización de datos:** la barra de 5 etapas es el elemento gráfico central: segmentos de igual ancho, el actual con relleno animado, los pasados sólidos, los futuros con contorno. Métricas con barras horizontales en color de estado, nunca más de un color por barra.
- **Microcopy:** segunda persona, cálido y concreto: "Tu pedido salió del depósito a las 10:41", "Llega entre 12:10 y 12:30". Placeholder del input: "Ej. LA-2129" en `--muted` (no gris claro).

## Motion

Herramientas: `gsap ^3.15.1` con Flip, MotionPathPlugin y ScrollToPlugin ya en uso; se permite `SplitText` y `DrawSVGPlugin` (gratuitos, mismo paquete). View Transitions de Astro ya activas.

**Tokens** (`src/scripts/tokens.ts` + `:root`): `--d-tap: 120ms`, `--d-fast: 220ms`, `--d-base: 400ms`, `--d-slow: 700ms`, `--d-stage: 1200ms`. Easings: `--e-out: cubic-bezier(0.22,1,0.36,1)` (el actual), `--e-in-out: cubic-bezier(0.65,0,0.35,1)`, `--e-pop` = `back.out(2)`, `--e-road` = `none` (camión, velocidad constante).

**Intro del hero** (nuevo layout: titular y buscador a la izquierda 6/12, mapa de la ruta a la derecha 6/12, barra de etapas debajo dentro del pliegue):
- t=0.0–0.6 s: titular con SplitText por líneas, `yPercent: 100 → 0` con máscara, stagger 0.12.
- t=0.3–1.1 s: ruta del mapa se traza con DrawSVG (`--e-in-out`); paradas aparecen con `--e-pop`.
- t=0.6 s: lead y buscador `y: 16 → 0`, `--d-base`.
- t=1.0 s: camión aparece en el depósito; barra de etapas en "Recibido" (azul).
- t=1.2 s: empieza el loop firma.

**Loop firma "el pedido cambia de color"** (12 s, repeat): el camión recorre la ruta por MotionPath (`--e-road`); en cada una de 4 paradas, el segmento de la barra se completa (`scaleX`), el punto del isotipo, "TU PEDIDO?" y el botón cruzan al color de la etapa (transición de `color`/`background` de 400 ms: único caso permitido fuera de transform/opacity, sobre pocos nodos), y la hora de la etapa entra con roll de dígitos. En "Entregado" aparece un tilde dibujado con DrawSVG y el loop reinicia con fundido.

**Transición número → ficha:** al enviar, el número del input (`transition:name="order-number"`) vuela al encabezado de `/pedido/LA-xxxx` con View Transition de 500 ms `--e-out`; la barra de etapas también comparte `transition:name`.

**Micro-interacciones:** botones press `scale(0.97)` `--d-tap`; sombra dura de la tarjeta se reduce de 6 a 2 px con `translate` al presionar (efecto tecla); número inválido: sacudida (existe) con `--e-pop` en lugar de elastic; filas nuevas en `/pedidos` con Flip; cambio de estado en tablas con chip que hace cross-fade de color.

**Rendimiento:** transform/opacity salvo la excepción de color descrita; pausar el loop del hero y los camiones de `/flota` fuera de viewport y con pestaña oculta; reservar alto del mapa (CLS 0). **Reduced motion:** camión en la parada "En camino", barra en 4/5, colores fijos, sin loop; la View Transition se reemplaza por navegación directa.

## Modo vitrina

`?vitrina=1` (alias de `?showcase`, que sigue andando). 45 s en loop con pedido fijo `LA-2074` y reloj simulado determinista, sin cursor, tipografía +12 %:
1. 0–8 s: intro del hero y una vuelta del loop de colores a velocidad 2x.
2. 8–12 s: se tipea "2074" letra por letra y el número vuela a la ficha.
3. 12–22 s: ficha: camión avanza, caja 3D se cierra, firma y 5 estrellas.
4. 22–30 s: `/flota`, todos los camiones en ruta; se toca uno y abre su panel.
5. 30–38 s: `/metricas` con barras por estado.
6. 38–45 s: `/incidencias`, se resuelve una, y vuelta al hero.

## Entregables para el cliente

- **Captura 1440×900** de `/?vitrina=1` en t=6 s: titular con "TU PEDIDO?" en magenta, camión entre paradas, barra en 4/5.
- **Video 10 s 16:9:** 0–1 s titular entra; 1–2 s la ruta se dibuja; 2–7 s el camión recorre y la página cambia azul → amarillo → naranja → magenta; 7–8 s "Entregado" en verde con tilde; 8–10 s el número vuela a la ficha.
- **Corte 9:16** (390 px, el caso real del cliente final): 0–3 s titular y buscador; 3–5 s número vuela; 5–10 s ficha con camión y caja 3D.
- **OG 1200×630:** titular en dos líneas, barra de 5 etapas a todo el ancho abajo, isotipo y chip "DEMO".
- `public/poster.jpg` regenerado con `scripts/poster.mjs` (y la ruta `/poster`) con la marca nueva.

## Criterios de aceptación

- [ ] La tilde de "ESTÁ" no toca el kicker en 1440, 1024 y 390 px.
- [ ] En 1440×900 se ven titular, buscador, mapa con camión y barra de etapas completa sin scroll.
- [ ] El acento cambia por etapa sin parpadeos y vuelve a azul al reiniciar el loop.
- [ ] Isotipo nuevo en topbar, favicon, poster y OG; chip "DEMO" visible a 390 px.
- [ ] CLS 0, LCP < 2,0 s, performance mobile ≥ 90; cero errores en consola en todas las vistas y en 2 vueltas de `?vitrina=1`.
- [ ] Reduced motion: estado final legible, sin loop ni View Transition animada.
- [ ] La URL de producción del proyecto Vercel `05-tracker-pedidos` responde 200 con la versión nueva; agregar `site` en `astro.config.mjs` y la URL al README.

## Plan en tramos

1. Arreglar el choque tilde/kicker y el placeholder. Salida: captura 1440 y 390.
2. Tokens de motion y reemplazo en `entry.ts` y `scenes/*`. Salida: `rg` sin duraciones sueltas.
3. Isotipo, wordmark y favicon. Salida: captura de la topbar.
4. Layout del hero en dos columnas con mapa y barra de etapas estáticos. Salida: captura 1440×900.
5. Intro temporizada (SplitText + DrawSVG). Salida: clip 2 s.
6. Loop firma de colores por etapa. Salida: clip 12 s.
7. View Transition número → ficha con `transition:name`. Salida: clip 3 s.
8. Pausa off-screen y reduced motion. Salida: captura reduced + trace 60 fps.
9. `?vitrina=1` de 45 s. Salida: grabación de una vuelta.
10. Entregables (captura, videos, OG, poster). Salida: archivos.
11. Lighthouse, consola, 390 px y deploy. Salida: reporte + URL live.
