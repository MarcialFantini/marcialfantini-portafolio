# Mayorista Central — mejoras de marca y motion

Proyecto `10-dashboard-ventas`: plataforma de ventas ficticia de un mayorista de Córdoba (Astro 7 + GSAP 3 + SVG con `d3-scale`/`d3-shape`, estático, live en https://10-dashboard-ventas.vercel.app). El odómetro gigante ya impacta, pero está solo en una pantalla negra con aire muerto arriba y el mapa queda abajo. **Idea wow:** "cada pedido suma a la cifra". En la primera pantalla, el número del mes y un mapa de Argentina conviven: cada pedido en vivo cae como un punto lima sobre su ciudad, viaja en un arco corto hasta el odómetro y los dígitos de la derecha ruedan. La relación causa → número se entiende en 10 segundos sin explicar nada.

## Estado actual

- **Marca:** "Mayorista Central" en Barlow Condensed + chip "DEMO" con borde lima en la sidebar (captura). Favicon `public/favicon.svg`: cuadrado `#07090e` con una "M" lima en path. Título de página `… · Mayorista Central (Demo)` (`src/layouts/AppLayout.astro` línea 28).
- **Paleta** (`src/styles/global.css`): vista noche `--bg #07090e`, `--surface #0f131c`, `--surface-2 #161b27`, `--ink #eef1f6`, `--muted #8a93a8`, `--line #222938`, acento `--accent #d4ff3f`. Vista papel: `--bg #f1ede4`, `--ink #111318`, acento `#2433ff`. Un easing: `--ease: cubic-bezier(0.2, 0.7, 0.1, 1)`.
- **Tipografías:** Barlow Condensed (números, títulos) y Barlow (texto), por Fontsource.
- **Layout** (captura `11-marca-personal-marcial-fantini/src/assets/capturas/dashboard-ventas.jpg`): sidebar con nav, vistas guardadas y widget "EN VIVO" con reloj y 1x/4x/10x; topbar con Mes/Trimestre/Año, vendedor, provincia, "Hoy $ 4.237.350", buscador, notificaciones, tema, exportar y pantalla completa. Hero: kicker, odómetro `$ 482.918.941` de ~150 px, tres KPIs (+8,3 %, 2.927 pedidos, 112 clientes) y sparkline diaria con pico marcado. Escenas siguientes en `src/components/Scene*.astro` (mapa, interanual, carrera, cohortes).
- **Motion existente:** `src/scripts/motion.ts` (helper `dur()` que devuelve 0 con reduced motion, interfaz `Scene` con `enter/reset/showcase`). Odómetro por "reels" con `yPercent` (`src/render/odometer.ts`, `src/scripts/scenes/hero.ts`): los dígitos de la derecha giran más. Sparkline revelada con una cortina `scaleX`. ScrollTrigger: `once` por escena en `views/resumen.ts` y scrub de curvas en `scenes/yoy.ts`. Keyframes CSS en `src/styles/shell.css` (`live-pulse`, `bump`, `ring`, `row-in`, `shimmer`, `pal-in`) y en páginas (`feed-in`, `head-pulse`, `grow`, `fired`). Modo presentación (`is-presenting`) y `?showcase` de ~24 s (`src/scripts/showcase.ts`).
- **Puntos débiles:**
  - Unos 200 px vacíos entre la topbar y el kicker; el link "Ver el mapa de ventas ↓" queda huérfano arriba a la derecha.
  - El hero no tiene nada "vivo" a la vista: el pulso en vivo está en la sidebar, chico.
  - La sparkline diaria con caídas de fin de semana se lee como ruido.
  - Los separadores de miles del odómetro son puntos grises gruesos que cortan el número.
  - El isotipo "M" es genérico y no dice nada del negocio.
  - Duraciones dispersas (1.6, 1.8, 0.5, stagger 0.04...) sin tokens.

## Marca

- **Isotipo:** "M" construida con tres barras verticales de ancho 4 sobre grilla 24: barra izquierda alto 14, central alto 9 alineada arriba (forma la V de la M), derecha alto 14; esquinas rectas. Las bases de las barras se apoyan en una línea de 2 px que sobresale 2 px a cada lado (un "mostrador"). Color: lima `#d4ff3f` sobre `#07090e`; en papel, `#2433ff` sobre `#f1ede4`. Reemplaza al path actual del favicon y de la sidebar.
- **Wordmark:** "MAYORISTA CENTRAL" Barlow Condensed 700, mayúsculas, tracking `0.03em`; "CENTRAL" en `--muted`. Chip "DEMO" se mantiene, alineado a la línea base.
- **Paleta refinada:** conservar las dos vistas. Agregar `--positive: #d4ff3f` (igual al acento en noche), `--negative: #ff6b4a` y `--neutral: #8a93a8` para deltas; en papel `--negative: #c2410c`. Cambiar `--line` noche a `#1b2130` para que las grillas no compitan. Prohibido usar más de un color saturado por gráfico.
- **Escala tipográfica:** odómetro `clamp(72px, 10vw, 168px)`; display 56/40/28/20; texto 16/14/12; todos los números `tabular-nums`. Separador de miles del odómetro: punto de 0,12em de diámetro en `--muted`, alineado a la línea base, no al centro.
- **Iconografía:** trazo 1,5 px, terminaciones rectas, grilla 24. Los íconos de la sidebar ya son de línea: unificar grosor.
- **Visualización de datos:** sparkline del hero pasa a barras semanales finas (ancho 6, gap 3) con la semana actual en lima y las anteriores en `--surface-2`; tooltip con mini gráfico ya existente. Mapa: provincias en escala secuencial de 5 pasos de `--map-base` a lima al 70 %. Deltas siempre con signo y flecha.
- **Microcopy:** corto, con cifras concretas: "Ferretería Roca · Córdoba · $ 184.200", "+8,3 % contra octubre 2025". Sin adjetivos.

## Motion

Herramientas: `gsap ^3.15.1` con ScrollTrigger ya en uso. Se permite sumar `Flip`, `MotionPathPlugin` y `SplitText` (gratuitos, mismo paquete). Mantener `dur()` como único punto de reduced motion.

**Tokens** (`src/scripts/tokens.ts` + `:root`): `--d-tick: 160ms`, `--d-fast: 240ms`, `--d-base: 420ms`, `--d-slow: 800ms`, `--d-roll: 1600ms`, `--d-scene: 2000ms`. Easings: `--e-out: cubic-bezier(0.2,0.7,0.1,1)` (el actual), `--e-in-out: cubic-bezier(0.65,0,0.35,1)`, `--e-pop` = `back.out(2)`, `--e-roll` = `power3.out`. Stagger reels: 0.04 s; KPIs: 0.08 s.

**Intro del hero** (nuevo layout: odómetro y KPIs a la izquierda 7/12, mapa compacto a la derecha 5/12, sin hueco superior):
- t=0.0 s: kicker entra con SplitText por palabras, `y: 8 → 0`, `--d-fast`, stagger 0.05.
- t=0.2–1.8 s: reels del odómetro desde 0 (como hoy), signo `$` con `--e-pop` en t=0.2.
- t=0.4–1.2 s: provincias del mapa se encienden con stagger por ventas (de menor a mayor), solo `opacity`.
- t=1.0–1.6 s: KPIs con stagger 0.08; el +8,3 % cuenta de 0.
- t=1.2–2.0 s: barras semanales crecen con `scaleY` desde la base, stagger 0.02.
- t=2.2 s: primer pedido en vivo (arranca el loop firma).

**Loop firma "el pedido que suma"** (cada pedido del engine, máx. 1 por segundo en pantalla): punto lima de 6 px aparece sobre la ciudad con `scale 0 → 1` + anillo que se expande y desvanece (`--d-slow`); un segundo punto viaja por MotionPath en arco hasta el último dígito del odómetro (`--d-base`, `--e-in-out`); al llegar, solo los reels que cambian ruedan un paso (`--d-tick`) y "Hoy $" en la topbar hace `bump`. La barra de la semana actual crece por `scaleY`.

**Escenas con scroll** (mantener las existentes, ordenar timing): mapa con zoom de provincia por `transform` del grupo SVG en `--d-scene`; interanual con scrub (ya existe) y etiqueta del cruce que aparece al pasar el punto de cruce; carrera de barras con Flip entre semanas a `--d-base`; cohortes celda por celda en diagonal, stagger 0.006.

**Micro-interacciones:** cambio de período (Mes/Trimestre/Año): pill activo se desliza con Flip y el odómetro rueda desde el valor anterior (ya soportado por `buildReels(target, previous)`); hover de provincia: `opacity` de las demás a 0,4 en `--d-fast`; press `scale(0.97)` `--d-tick`; cambio de tema noche/papel con View Transition de fundido cruzado de 300 ms.

**Rendimiento:** solo transform/opacity (más `stroke-dashoffset` en curvas); máx. 12 puntos vivos en el mapa (pool reciclado, sin crear nodos); pausar el loop con IntersectionObserver y `visibilitychange`; reservar el alto del odómetro (CLS 0). **Reduced motion:** `dur()` a 0, odómetro en valor final, pedidos nuevos aparecen sin viaje, sin anillos.

## Modo vitrina

`?vitrina=1` (alias de `?showcase`, que sigue andando). 40 s en loop, semilla fija, velocidad 4x, sin cursor, tipografía +12 %:
1. 0–5 s: intro del hero completa y 3 pedidos que suman.
2. 5–12 s: cambio Mes → Año → Mes con odómetro rodando.
3. 12–18 s: mapa, drill-down a Córdoba con sus clientes.
4. 18–24 s: interanual dibujándose con el cruce marcado.
5. 24–30 s: carrera de productos, 4 semanas.
6. 30–36 s: `/en-vivo` a 10x, curva hoy contra ayer.
7. 36–40 s: vuelta al hero con fundido.

Los pedidos de la vitrina salen de una lista fija (no del azar del engine) para que dos grabaciones sean idénticas.

## Entregables para el cliente

- **Captura 1440×900** de `/?vitrina=1` en t=3 s: odómetro completo, mapa encendido con 3 puntos lima, un pedido a mitad del arco.
- **Video 10 s 16:9:** 0–2 s odómetro desde 0; 2–3 s mapa se enciende; 3–6 s tres pedidos caen y suman; 6–8 s cambio a "Año" con todos los reels girando; 8–10 s zoom a Córdoba y wordmark.
- **Corte 9:16:** odómetro arriba a todo el ancho (72 px), mapa abajo; 0–3 s cuenta, 3–7 s pedidos suman, 7–10 s carrera de barras.
- **OG 1200×630:** fondo noche, wordmark, "$ 482.918.941" en 120 px, mapa en lima a la derecha, chip "DEMO".
- Exportación de un gráfico (función existente) para usar como imagen en propuestas.

## Criterios de aceptación

- [ ] En 1440×900 se ven odómetro, KPIs y mapa sin scroll; sin hueco superior > 48 px.
- [ ] Cada pedido en vivo produce punto + arco + roll de dígitos, sin acumular nodos (contar `circle` en el SVG tras 2 minutos).
- [ ] Isotipo nuevo en sidebar, favicon y OG; chip "DEMO" visible a 390 px.
- [ ] CLS 0, LCP < 2,0 s, performance mobile ≥ 90.
- [ ] Cero errores en consola en todas las vistas y en `?vitrina=1` durante 2 vueltas.
- [ ] Reduced motion: estado final completo, sin arcos ni anillos.
- [ ] 60 fps en el hero con 4x CPU throttle.
- [ ] https://10-dashboard-ventas.vercel.app sirve la versión nueva.

## Plan en tramos

1. Tokens de motion y reemplazo de duraciones en `hero.ts`. Salida: `rg "duration: dur\(\d" src/scripts` vacío.
2. Isotipo y wordmark en sidebar + favicon. Salida: captura de la sidebar.
3. Nuevo layout del hero (odómetro + mapa compacto, sin hueco). Salida: captura 1440×900.
4. Barras semanales en lugar de sparkline + separadores del odómetro. Salida: captura del hero.
5. Intro temporizada con SplitText y encendido del mapa. Salida: clip 3 s.
6. Loop firma "el pedido que suma" con pool de puntos. Salida: clip 6 s + conteo de nodos.
7. Micro-interacciones de período y tema. Salida: clip 4 s.
8. Pausa off-screen y reduced motion. Salida: captura reduced + trace a 60 fps.
9. `?vitrina=1` de 40 s con pedidos fijos. Salida: grabación de una vuelta.
10. Entregables (captura, videos, OG). Salida: archivos exportados.
11. Lighthouse, 390 px, consola y deploy. Salida: reporte y URL verificada.
