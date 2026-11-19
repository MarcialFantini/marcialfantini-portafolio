Crea desde cero un proyecto Astro llamado `07-reservas-peluqueria`: una demo de portfolio de un sistema de turnos para una cadena de peluquerías ficticia, **Peluquería Las Tijeras** (CABA, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, Draggable, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Tu turno en tres toques: elegir servicio, profesional y hora se siente rápido, táctil y con ritmo.

## Dirección visual
- **Paleta:** blanco azulejo, negro y un verde menta como acento.
- **Tipografía:** una sans geométrica grande para horarios y una sans legible para el texto.
- **Textura:** la grilla de azulejos del salón como fondo de algunas escenas, sin sombras ni gradientes.

## Escenas
1. **Hero:** unas tijeras en SVG cortan la pantalla en dos y la parte de abajo cae para revelar el primer paso.
2. **Servicio:** 12 servicios con una microilustración animada y la duración dibujada como una barra.
3. **Profesional:** 8 fichas que giran para mostrar especialidad; su disponibilidad aparece como una agenda horizontal con huecos.
4. **Horario en vivo:** la grilla de turnos recibe reservas simuladas de otros clientes en tiempo real, y el turno elegido se "estampa".
5. **Sucursales:** un mapa SVG ilustrado con las 3 sucursales y un movimiento de cámara al cambiar de una a otra.
6. **Confirmación:** un ticket con código QR generado en el navegador, cuenta regresiva al turno y un archivo .ics descargable creado localmente.

## Interacciones
- **Panel de la dueña:** vista del día con una columna por profesional; los turnos se arrastran entre columnas y se detectan las superposiciones.
- **Reprogramar o cancelar** con una animación que libera el hueco en la grilla.
- **Cambio de vista** cliente / dueña con una transición fluida.

## Datos simulados
- 3 sucursales, 8 profesionales, 12 servicios con duración y precio, y dos semanas de turnos generados.
- Sin Google Calendar ni Cal.com: la agenda vive en memoria con persistencia opcional en `localStorage`.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
