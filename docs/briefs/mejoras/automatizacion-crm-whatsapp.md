# Recepta para Clínica San Martín — mejoras de marca y motion

Landing más app de recordatorios y CRM por WhatsApp para una clínica ficticia de Rosario (Astro 7 estático, GSAP 3, motor de simulación en `src/lib/engine.ts`). Nada se envía: todo corre en el navegador. **Idea wow, "la ola de confirmaciones":** en el hero, una línea de envío barre la agenda de mañana de izquierda a derecha; detrás de ella cada turno pasa de petróleo a aqua a medida que los pacientes responden, y un contador grande sube de 0 % a 91 % confirmados en 8 s. En una captura se ve una agenda casi toda verde con el número enorme; en video, el día se confirma solo.

## Estado actual

- **Marca:** "Recepta" en Commissioner con un cuadrado redondeado petróleo con la letra "R" en aqua como isotipo (`src/layouts/AppLayout.astro:32`, `src/pages/index.astro:33-35`). Subtítulo "para Clínica San Martín" y pastilla ámbar "Demo · datos ficticios". La R es una letra en una caja: no tiene idea propia.
- **Paleta** (`src/styles/global.css:34-54`): fondo `#f6f9f9`, superficie `#ffffff`, `#edf3f3`, `#e1ebeb`; tinta `#0c2a33`, `#3c5860`, `#567077`; petróleo `#0b4f63` / `#073846`; aqua `#43c9aa` (soft `#d5f3ea`, ink `#0b7560`); ámbar `#b56a12`; rojo `#b2342a`; azul `#2a64b5`; línea `#d5e2e3`.
- **Tipografía:** Commissioner (display) y Source Sans 3 (texto), locales en `public/fonts/` con fallbacks por métricas.
- **Tokens de motion existentes** (`global.css:64-68`): `--ease-out: cubic-bezier(0.22,1,0.36,1)`, `--ease-spring: cubic-bezier(0.34,1.56,0.64,1)`, `--dur-1: 120ms`, `--dur-2: 220ms`, `--dur-3: 420ms`. Es una buena base.
- **Motion existente:** hero en `<canvas>` con rAF (`src/scripts/landing/hero.ts`): 40 profesionales × franjas horarias, colores `C_BOOKED #2f7a8d`, `C_SENT #8bb9ec`, `C_OK #43c9aa`, `C_REPRO #e3a653`, línea de hora y botón "Adelantar 24 h". Las escenas se cargan por IntersectionObserver (`src/scripts/landing/main.ts`). GSAP con MotionPath y Draggable bajo demanda (`src/scripts/landing/gsap.ts`) en la bandeja (`inbox.ts`: tickets que entran y etiquetas que vuelan), confirmaciones, editor de flujos y contadores (`counters.ts`). Keyframes CSS en la app (`app/index.astro:186 fire`, `bandeja.astro:318-356 msgpop/tagfly/dots`, `agenda.astro:188 apptpop`). Reduced motion en `global.css:263` y `app.css:1276`, y clase `.rm`.
- **Modo vitrina:** `?showcase` en la landing (`src/scripts/landing/showcase.ts`, loop de unos 27 s por seis escenas) y en la app (`src/scripts/app/showcase.ts`, tour por cinco vistas con `navigate()` a 10×).
- **Puntos débiles (captura `capturas/automatizacion-crm-whatsapp.jpg`):** la grilla del hero es ruido: unas 1.500 celdas petróleo casi iguales, sin leyenda, y no se lee qué significa cada color. Las burbujas de mensaje miden unos 12 px y no se distinguen. El dato del pie dice "**2** confirmados", el número más débil posible para vender confirmaciones. El fondo de la mitad izquierda queda plano, y el titular y el panel no comparten ningún elemento de marca.

## Marca

- **Isotipo nuevo:** cuadrado redondeado de 32×32 (radio 9) en `--petrol`. Adentro, una burbuja de chat de 18×14 con cola abajo a la izquierda, trazo de 2.5 px en `--petrol-ink`, y dentro un tilde (check) en `--aqua` de trazo de 3 px. La burbuja y el tilde se dibujan como paths separados para poder animarlos. Reemplaza la "R" en la landing, la app, el favicon y la OG.
- **Wordmark:** "Recepta" en Commissioner 700 con tracking -0.02em; "para Clínica San Martín" queda en Source Sans 3 a 0.8 em en `--ink-3`. La pastilla "Demo · datos ficticios" se mantiene.
- **Paleta:** mantener todos los tokens. Estados de turno con significado único en toda la marca: `--st-booked: #2f7a8d`, `--st-sent: #8bb9ec`, `--st-ok: #43c9aa`, `--st-moved: #e3a653`, `--st-cancel: #b2342a`. El único acento es `--aqua`, reservado para "confirmado" y CTAs secundarios. El ámbar queda solo para la pastilla Demo y "reprogramado".
- **Escala tipográfica:** 14 / 16 / 18 / 22 / 30 / 44 / clamp(48 px, 6vw, 88 px) para el titular, y `--num-hero: clamp(56px, 7vw, 112px)` para el contador de la ola, con tabular-nums.
- **Iconografía:** trazo de 2 px, puntas redondeadas, 20 px; burbujas, relojes y tildes como familia.
- **Visualización de datos:** el hero pasa de "mapa de calor" a **agenda legible**: filas agrupadas por especialidad (8 grupos de 5) con su etiqueta, celdas de 10×10 con 2 px de separación y una leyenda de 4 estados encima. Las burbujas pasan a 18 px y se dibujan solo en la columna de la línea de envío.
- **Microcopy:** concreto y en voseo. Pie del hero: "**412** de **466** turnos de mañana confirmados · **0** llamadas". Nunca mostrar un contador en 2.

## Motion

Herramientas: GSAP 3.15 ya está instalado (core, MotionPath y Draggable cargados en `src/scripts/landing/gsap.ts`). ScrollTrigger es gratis y está en el mismo paquete: agregarlo al loader solo si se usa en las escenas de scroll. El hero sigue en canvas con rAF.

- **Duraciones:** `--dur-1: 120ms` (press), `--dur-2: 220ms` (hover y toggles), `--dur-3: 420ms` (entradas), `--dur-4: 800ms` (cambios de escena), `--dur-wave: 8000ms` (barrido del hero).
- **Easings:** `--ease-out` y `--ease-spring` como están; agregar `--ease-in-out: cubic-bezier(0.65,0,0.35,1)` y `--ease-linear: linear` (solo para la línea de envío). En GSAP: `power3.out`, `power2.inOut`, `back.out(2)`.

**Coreografía del hero:**
- t=0.0 s: titular y botones visibles desde el SSR; el panel está en petróleo con la grilla pintada en `--st-booked` y la leyenda visible.
- t=0.2 s: el isotipo del header dibuja el tilde (stroke-dashoffset, `--dur-3`).
- t=0.4 s: las etiquetas de especialidad entran con opacidad escalonada cada 40 ms.
- t=0.8 s: aparece la línea de envío (aqua, 2 px, con halo) en las 8 h.
- t=0.8–8.8 s: la línea barre hasta las 20 h a velocidad constante. A su paso, cada celda pasa a `--st-sent` y, con una demora aleatoria (semilla fija) de 0,3 a 2,5 s, a `--st-ok` con un pulso de escala 1→1.3→1 de 220 ms; el 6 % pasa a `--st-moved` y el 2 % a `--st-cancel`. Junto a la línea aparecen tres burbujas de 18 px por segundo.
- En paralelo, el contador grande sube de 0 % a 91 % sincronizado con las celdas, y el pie sube a 412 de 466.
- t=9.2 s: la línea se desvanece y el tilde del isotipo hace un pulso.

**Momento en loop (firma):** al terminar, se mantienen 3 s en el estado final, un fundido de 0,6 s a "día siguiente" y se repite con otra semilla del día (lunes a viernes, rotando). Se pausa fuera de pantalla y con `document.hidden`.

**Escenas de scroll:** las seis existentes se mantienen. Agregar entrada uniforme con `--dur-3` y desplazamiento de 16 px; el editor de flujos de la landing hace correr un pulso aqua por los conectores (MotionPath) cuando entra al 50 % del viewport; los contadores del tablero (`Board.astro`) usan `data-count-to` con 1,2 s `power2.out`.

**Microinteracciones:** botones con press scale 0.97 en `--dur-1`; switch de flujo on/off con la perilla en `--ease-spring` y el mini mapa encendiéndose en 300 ms; mensaje nuevo en la bandeja con `msgpop` y la etiqueta de especialidad volando (ya existe), unificado a `--dur-3`; toasts desde abajo a la derecha.

**Datos:** todo número que cambia interpola en 400 ms con tabular-nums (helper en `src/scripts/app/dom.ts:87`); las barras de métricas crecen con `scaleX` desde 0, nunca con `width`.

**Rendimiento:** canvas a devicePixelRatio con tope 2; un solo rAF para el hero; en el DOM solo transform y opacity. CLS 0: el panel del hero tiene aspect-ratio fijo. Todo se pausa fuera de pantalla. **Reduced motion:** el hero se pinta directo en el estado final (91 %, 412 de 466) sin barrido ni loop; el tilde del isotipo aparece dibujado; los contadores muestran el valor final.

## Modo vitrina

Unificar la landing y la app bajo `?vitrina=1` (mantener `?showcase` como alias). Loop determinista de 50 s con semilla fija y reloj del motor clavado en "lunes 16, 10:20":
- 0–10 s: la ola de confirmaciones completa.
- 10–18 s: bandeja de la landing: entran cuatro consultas, se clasifican por especialidad y se responden solas.
- 18–26 s: un paciente responde "Confirmo" en un chat estilo WhatsApp y el turno pasa a aqua en la agenda.
- 26–36 s: editor de flujos: el pulso recorre "Recordatorio 24 h antes" nodo por nodo.
- 36–44 s: tablero del mes con contadores (112 h, 2.184, 1.391).
- 44–50 s: fundido a petróleo con el isotipo, "Recepta · Demo" y la URL.
Legibilidad: texto base a 20 px, burbujas a 24 px y contador de la ola a 120 px. Cursor oculto. No escribe en el almacenamiento del visitante.

## Entregables para el cliente

- **Captura 1440×900** en t=9.5 s del hero: agenda casi verde, contador "91 %", pie "412 de 466". Reemplaza `11-marca-personal-marcial-fantini/src/assets/capturas/automatizacion-crm-whatsapp.jpg`.
- **Video 16:9, 10 s:** 0–1 s el isotipo dibuja el tilde; 1–8 s la ola barre la agenda y el contador sube; 8–9 s zoom de 1,0 a 1,15 sobre una burbuja "Confirmo ✓"; 9–10 s logo y "Demo".
- **Corte vertical 9:16, 10 s** a 390 px: el contador arriba en grande, la agenda debajo con 20 filas visibles; 0–8 s la ola; 8–10 s un chat de WhatsApp a pantalla completa con el recordatorio y la respuesta.
- **OG 1200×630:** panel con la agenda verde a la derecha, "La recepción que trabaja sola" a la izquierda, isotipo y pastilla Demo. Generarla con `scripts/poster.mjs`.
- **Específico:** captura 1440×900 de `/app/flujos/editor/?id=F-REC` con el pulso a mitad de recorrido, para propuestas comerciales.

## Criterios de aceptación

- [ ] El hero muestra una leyenda de 4 estados y etiquetas de especialidad legibles a 1440 y a 390 px.
- [ ] Ningún contador visible en la primera pantalla muestra un valor menor a 100 en el estado final.
- [ ] CLS = 0; LCP < 2,0 s en escritorio y < 2,5 s en móvil (Lighthouse).
- [ ] El rAF del hero se detiene fuera de pantalla y con la pestaña oculta (verificar en Performance).
- [ ] 60 fps durante la ola con 4× CPU slowdown, o el hero baja a celdas sin pulso de escala.
- [ ] Con reduced motion se ve el estado final sin barrido.
- [ ] Sin errores en consola en `/`, `/app/` y `?vitrina=1`.
- [ ] La pastilla Demo es visible en la landing, la app y la OG.
- [ ] `pnpm check` y `pnpm test:e2e` pasan.

## Plan en tramos

1. **Isotipo (≤15 min):** SVG burbuja más tilde en landing, app y favicon. Salida: captura del header a 1440 y 390 px.
2. **Tokens (≤15 min):** `--dur-4`, `--dur-wave`, `--ease-in-out` y los estados `--st-*`; el canvas los lee con `getComputedStyle`. Salida: `pnpm check` limpio.
3. **Agenda legible (≤15 min):** agrupar filas por especialidad, leyenda y celdas más grandes en `hero.ts`. Salida: captura estática.
4. **Barrido (≤15 min):** línea de envío y transición sent → ok con semilla fija. Salida: clip de 10 s.
5. **Contador y pie (≤15 min):** número grande sincronizado y "412 de 466". Salida: captura en t=9,5 s.
6. **Loop y pausa (≤15 min):** día siguiente, IntersectionObserver y `visibilitychange`. Salida: trace de Performance.
7. **Reduced motion (≤15 min):** estado final directo. Salida: captura con reduce emulado.
8. **Vitrina 50 s (≤15 min):** unificar `?vitrina=1` en `landing/showcase.ts`. Salida: grabación completa.
9. **Microinteracciones de la app (≤15 min):** switch de flujo, press y números interpolados. Salida: clip de 5 s.
10. **Medición (≤15 min):** Lighthouse y consola. Salida: CLS, LCP y fps anotados.
11. **Entregables (≤15 min):** captura, OG, 16:9 y 9:16. Salida: los archivos en `11-marca-personal-marcial-fantini/src/assets/`.
