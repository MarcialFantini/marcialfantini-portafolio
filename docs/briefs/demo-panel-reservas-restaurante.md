Crea desde cero un proyecto Astro llamado `15-panel-reservas-restaurante`: una demo de portfolio de un panel de reservas para un restaurante ficticio, **Restaurante Donde Marino** (Mar del Plata, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, Draggable), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El salón visto desde arriba: la noche entera se maneja sobre el plano de mesas.

## Dirección visual
- **Paleta:** azul marino profundo, blanco mantel y un coral como acento.
- **Tipografía:** una serif con aire náutico para títulos y una sans tabular para horarios y cubiertos.
- **Plano:** el salón dibujado en SVG, con un color plano por estado de mesa.

## Escenas
1. **Hero:** el plano del salón se dibuja con sus 80 cubiertos y las mesas se encienden a medida que entran las reservas; arriba, los tres turnos (21, 23 y 01 h).
2. **Mapa de mesas:** estados libre, reservada, sentada y pidiendo la cuenta; las reservas se arrastran a una mesa y las mesas se pueden unir.
3. **Línea de la noche:** un diagrama de mesas por hora que muestra la rotación y los huecos.
4. **Lista de espera:** la cola avanza sola y avisa cuando se libera una mesa compatible.
5. **Check-in:** se busca la reserva, la mesa pulsa y queda "sentada" con un cronómetro que muestra menos de 10 segundos.
6. **Cierre:** el resumen de la noche con cubiertos, rotación y una factura simulada.

## Interacciones
- **Adelantar el tiempo** de la noche con todas las piezas sincronizadas.
- **Nueva reserva** con un selector de cubiertos y turno que sugiere mesas.
- **Cambio de vista** salón / agenda con transición.

## Datos simulados
- 80 cubiertos, 24 mesas, 3 turnos por noche y una semana de reservas generadas.
- Sin AFIP ni sistema de facturación real.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
