# Distribuidora del Litoral — mejoras de marca y motion

Proyecto `18-integracion-mercadolibre-erp`: sistema central ficticio que alimenta tres canales de venta (Bazar Federal, Vitrina Plus, litoral.shop) para una distribuidora de limpieza de Santa Fe. Astro 7 + GSAP 3.15.1 (Flip, MotionPathPlugin), estático. **Hoy no está publicado:** https://18-integracion-mercadolibre-erp.vercel.app devuelve 404, así que arreglar el deploy es el primer tramo. **Idea wow:** "una venta, tres vidrieras, un segundo". Entra una venta por un canal, un pulso grueso viaja por el cable hasta el sistema central, el número central baja, y en el mismo instante salen tres pulsos que bajan el stock publicado de los tres canales con un sello "Sincronizado · 0,9 s". El cliente ve en 10 segundos que ningún canal vende lo que no hay.

## Estado actual

- **Marca:** isotipo en `src/components/shell/BrandMark.astro`: cuadrado cobalto `rx=7`, bloque amarillo (stock central) y tres líneas blancas que se ramifican (canales). Nombre "Distribuidora del Litoral" + bajada "Stock unificado · Santa Fe" en la sidebar (captura). Chip "Demo · datos ficticios" con borde punteado en la topbar.
- **Paleta** (`src/styles/global.css`): papel `#ffffff`, lienzo `#f3f5fa`, tinta `#0b1430` / `#39435f` / `#5f6885`, línea `#e3e7f1` / `#cdd4e4`, cobalto `#1739c9` (700 `#0f2a9c`), amarillo `#ffd43b`, estados ok `#0c7a52`, warn `#9a5b00`, error `#c0262d`. Canales: marketplace `#c2410c`, tienda `#0b8463`, sitio propio `#6d43e0`. Sombras `--shadow-1/2`, radios 10/16, `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Tipografías:** Archivo Narrow (display) y Archivo (texto), por Fontsource.
- **Layout** (captura `11-marca-personal-marcial-fantini/src/assets/capturas/integracion-mercadolibre-erp.jpg`): sidebar con nav y estado de canales; topbar con buscador, "EN VIVO 09:21", pausa/1x/4x/10x, "Adelantar un día", campana y chip Demo. Hero: titular "Un solo stock, tres vidrieras.", dos botones, leyenda de pulsos y, a la derecha, el hub (`src/components/home/Hub.astro`) con nodo central cobalto (61.770 u.) y tres tarjetas de canal. Debajo, 6 KPIs (`home/Kpis.astro`) y escenas (`home/Scenes.astro`): antes/después, ficha, registro, cola, reglas.
- **Motion existente:** pulsos por los cables con MotionPath en `src/scripts/scenes/hub.ts` (máx. 18 pulsos, duración según velocidad 0.9/0.62/0.42 s, pausa con IntersectionObserver), `countTo` y `bump` en `src/scripts/dom.ts`; escenas en `scenes/compare.ts`, `feed.ts`, `kpis.ts`, `product-sync.ts`, `queue.ts`, `rules-live.ts`. Plugins cargados después del primer paint (`src/scripts/plugins.ts`). Keyframes CSS en `src/styles/app.css` (`ping`, `drop`, `pop`, `toast-in`). `?showcase` en `src/scripts/showcase.ts`.
- **Deploy:** `astro.config.mjs` declara `site` en Vercel, pero el proyecto no tiene `.vercel/project.json` (el 03, que sí está publicado, lo tiene). Probablemente nunca se vinculó ni se desplegó; no pude confirmarlo desde el panel de Vercel.
- **Puntos débiles:**
  - En la captura, las tarjetas de canal pisan el nodo central y la de litoral.shop queda cortada por el borde inferior del panel.
  - Los cables son punteados finos casi invisibles: el pulso, que es la idea del producto, no se lee en una captura.
  - El botón "Vender 1" se parte en dos líneas.
  - Los tres colores de canal más cobalto y amarillo compiten en el hero (5 colores saturados).
  - No hay un momento de "sincronizado" visible: los números cambian pero no hay sello ni tiempo medido en el hub.

## Marca

- **Isotipo:** mantener la idea y precisarla. SVG 32×32, cuadrado `#1739c9` `rx=7`; bloque `#ffd43b` de 8×8 `rx=2` en (6,12); del borde derecho del bloque sale un trazo blanco de 2,2 px hasta x=19, donde se abre en tres ramas horizontales a y=9, 16, 23 que terminan en x=26 con un punto de 3 px (los canales). Variante monocroma en `currentColor`. Usar el mismo dibujo, en grande, como esqueleto del hub.
- **Wordmark:** "Distribuidora del Litoral" en Archivo Narrow 700, `letter-spacing: -0.01em`; bajada "Stock unificado · Santa Fe" en Archivo 500 12 px `--ink-3`. Versión corta "DL" para 390 px.
- **Paleta refinada:** cobalto es la marca, amarillo es el único acento (pedido entrante y CTA). Colores de canal solo en el avatar del canal y en su cable, desaturados en el resto: marketplace `#c2410c`, tienda `#0b8463`, sitio `#6d43e0` al 100 % solo en el pulso. Cables en reposo `--line-2` sólidos de 2 px, no punteados.
- **Escala tipográfica:** titular `clamp(40px, 5vw, 64px)`; número central 72 px; números de canal 40 px; display 32/24/20; texto 16/14/12; `tabular-nums` en todo número.
- **Iconografía:** trazo 1,75 px, terminaciones redondas, grilla 24. Íconos de canal: monogramas en cuadrado `rx=6` (ya existen: BF, VP, LS).
- **Visualización de datos:** tiempo de sincronización como dato de primera clase: "0,9 s" junto a cada canal tras cada pulso. Conflictos y sobreventas en rojo `--error` solo dentro de la escena antes/después. Gráficos de reportes con línea cobalto y área `--cobalt-50`.
- **Microcopy:** técnico y claro: "Venta en Bazar Federal · −1 Limpiador multiuso 900 ml", "Publicado en 3 canales · 0,9 s". Mantener chip "Demo · datos ficticios".

## Motion

Herramientas: GSAP 3.15.1 con Flip y MotionPathPlugin ya instalados. Se permite `DrawSVGPlugin` y `SplitText` (gratuitos, mismo paquete). Respetar la carga diferida de `plugins.ts`.

**Tokens** (`src/scripts/tokens.ts` + `:root`): `--d-tap: 120ms`, `--d-fast: 200ms`, `--d-base: 360ms`, `--d-pulse: 900ms` (a 1x; escalar por velocidad como hoy), `--d-slow: 700ms`, `--d-scene: 1200ms`. Easings: `--e-out: cubic-bezier(0.2,0.8,0.2,1)` (el actual), `--e-in-out: cubic-bezier(0.65,0,0.35,1)` (pulsos), `--e-pop` = `back.out(2.2)`.

**Intro del hero:**
- t=0.0–0.5 s: titular con SplitText por líneas, `yPercent 100 → 0` con máscara.
- t=0.2–0.6 s: nodo central `scale 0.92 → 1` + `opacity`, `--e-pop`; número central cuenta desde 0 hasta 61.770 en 1,2 s.
- t=0.5–1.1 s: los tres cables se trazan con DrawSVG desde el central hacia afuera, stagger 0.1.
- t=0.8–1.3 s: tarjetas de canal entran `y: 12 → 0` al final de cada cable, stagger 0.1; sus números cuentan.
- t=1.3–1.7 s: KPIs con stagger 0.06.
- t=2.0 s: primera venta (loop firma).

**Loop firma "una venta, tres vidrieras"** (cada 4 s a 1x, sobre la simulación): la tarjeta del canal vendedor hace `bump`; pulso amarillo de 10 px con estela (3 copias con opacidad 0,5/0,3/0,15) viaja al central (`--d-pulse`, `--e-in-out`); al llegar, el central baja 1 con roll de dígito y emite un anillo; salen tres pulsos cobalto a la vez hacia los tres canales; al llegar cada uno, su número baja y aparece el sello "Sincronizado · 0,9 s" (`opacity` + `y: 4 → 0`, se va a los 1,5 s). Si el stock llega a 0, el pulso de salida es rojo y la tarjeta muestra "Pausado en 3 canales": ese es el segundo momento wow (sobreventa evitada).

**Escenas con scroll** (ScrollTrigger, se permite registrarlo): antes/después con scrub, la mitad izquierda vende a ciegas (contador en rojo bajo cero) y la derecha sincroniza; registro y cola entran con Flip; reglas con un cambio de valor que se propaga en vivo (existente). Cada escena con `once: true` salvo la de scrub.

**Micro-interacciones:** "Vender 1" en una línea, press `scale(0.97)`; "Adelantar un día" con barra de progreso de `scaleX` en el botón; filas nuevas del registro con Flip y destello amarillo de 400 ms; cambio de velocidad: el pill activo se desliza con Flip.

**Rendimiento:** solo transform/opacity (y `stroke-dashoffset` en cables); pool fijo de 18 pulsos (ya existe el tope) reciclando nodos; pausar con IntersectionObserver (existe) y `visibilitychange`; reservar el alto del hub para CLS 0. **Reduced motion:** sin pulsos ni conteos; los números cambian directo y el sello "Sincronizado" aparece estático.

## Modo vitrina

`?vitrina=1` (alias de `?showcase`, que sigue andando). 40 s en loop con semilla fija y secuencia de ventas predefinida, sin cursor, tipografía +12 %:
1. 0–6 s: intro y dos ventas sincronizadas.
2. 6–12 s: venta del último producto: pulso rojo, "Pausado en 3 canales".
3. 12–20 s: scroll a antes/después con scrub automático.
4. 20–28 s: `/productos/[sku]` con stock por canal y contador de demora.
5. 28–34 s: `/sincronizacion`, cola procesándose con Flip.
6. 34–40 s: "Adelantar un día" y KPIs actualizados; vuelta al inicio.

## Entregables para el cliente

- **Captura 1440×900** de `/?vitrina=1` en t=3 s: hub completo sin solapes, un pulso en cada cable, sello "Sincronizado" visible en una tarjeta.
- **Video 10 s 16:9:** 0–1 s titular; 1–2 s cables se trazan y tarjetas aparecen; 2–4 s venta en Bazar Federal llega al central; 4–6 s tres pulsos y tres sellos; 6–9 s último producto, pulso rojo y "Pausado en 3 canales"; 9–10 s wordmark.
- **Corte 9:16:** hub vertical (central arriba, tres canales en columna), 0–3 s intro, 3–7 s venta y sincronización, 7–10 s sobreventa evitada.
- **OG 1200×630:** "Un solo stock, tres vidrieras." a la izquierda, hub esquemático con los tres cables a la derecha, chip "Demo".
- Regenerar `public/poster.jpg` con `scripts/poster.mjs`.

## Criterios de aceptación

- [ ] **Prerrequisito:** https://18-integracion-mercadolibre-erp.vercel.app responde 200 con la home, y `/productos/[sku]` de un SKU cualquiera también.
- [ ] En 1440×900 el hub entra completo, sin tarjetas solapadas ni cortadas; también a 1280 y 390 px.
- [ ] "Vender 1" en una línea en todas las tarjetas.
- [ ] Cada venta muestra pulso de entrada, tres de salida y sello con tiempo; nunca más de 18 pulsos en el DOM.
- [ ] CLS 0, LCP < 2,0 s, performance mobile ≥ 90; cero errores en consola en todas las vistas y en 2 vueltas de `?vitrina=1`.
- [ ] Reduced motion: estado final completo, sin pulsos.
- [ ] `scripts/audit.mjs` y los tests de `tests/` siguen pasando.

## Plan en tramos

1. Deploy: `pnpm build`, vincular con `vercel link` al proyecto `18-integracion-mercadolibre-erp` (crearlo si no existe), `vercel --prod`. Salida: la URL responde 200 (captura del navegador).
2. Arreglar solapes del hub y "Vender 1". Salida: capturas 1440, 1280 y 390.
3. Tokens de motion y reemplazo de duraciones en `hub.ts` y `dom.ts`. Salida: `rg` sin duraciones sueltas.
4. Isotipo precisado, wordmark y cables sólidos. Salida: captura del hero.
5. Intro temporizada con DrawSVG y SplitText. Salida: clip 2 s.
6. Loop firma con estela y sello "Sincronizado". Salida: clip 6 s.
7. Variante de sobreventa (pulso rojo, "Pausado en 3 canales"). Salida: clip 4 s.
8. Antes/después con scrub y pausa off-screen + reduced motion. Salida: clip + captura reduced.
9. `?vitrina=1` de 40 s con ventas predefinidas. Salida: grabación de una vuelta.
10. Entregables (captura, videos, OG, poster). Salida: archivos.
11. Lighthouse, consola, tests y redeploy. Salida: reporte + URL verificada.
