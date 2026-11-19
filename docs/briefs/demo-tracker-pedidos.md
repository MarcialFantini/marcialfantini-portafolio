Crea desde cero un proyecto Astro llamado `tracker-pedidos`: una demo de portfolio de seguimiento de pedidos para un mayorista ficticio, **Logística Andina** (Córdoba, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos, sin mapas de terceros.** Todo corre en el navegador.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El tiempo es simulado y acelerado. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El viaje del pedido, contado como una animación: desde que se arma la caja hasta que llega a la puerta.

## Dirección visual
- **Fondo y estados:** fondo claro con un color plano por estado (recibido, preparando, despachado, en camino, entregado).
- **Mapa:** de Córdoba, estilizado y dibujado a mano en SVG (avenidas principales y barrios como formas simples).
- **Tipografía:** una condensada grande para el número de pedido y la hora estimada de llegada.

## Escenas
1. **Ingreso:** el cliente escribe un número de pedido (o elige uno de una lista de ejemplo). La pantalla se transforma en la ficha del pedido con una View Transition y el número viaja a su lugar.
2. **Línea de tiempo:** las etapas Recibido → Preparando → Despachado → En camino → Entregado, con la etapa actual animada. Cada etapa tiene una microilustración animada en SVG: cajas que se arman, cinta que cierra, camión que sale.
3. **Mapa en vivo:** un camión avanza por la ruta (MotionPath), la hora estimada cuenta hacia atrás y las paradas anteriores se van tachando.
4. **Contenido del pedido:** la lista de productos. Al hacer click, cada producto se "empaca" dentro de una caja en CSS 3D que se cierra al final.
5. **Panel del depósito:** un kanban de pedidos que pasan solos de columna (Flip) mientras entran pedidos nuevos simulados, con contadores por estado.
6. **Avisos:** cuando cambia un estado aparece un aviso que se desliza dentro de la propia interfaz. No hay notificaciones push reales.

## Interacciones
- **Avance del tiempo:** un botón "Adelantar 1 hora" hace avanzar la simulación con todas las piezas sincronizadas.
- **Firma de recepción:** se firma con el dedo o el mouse sobre un canvas.
- **Calificación:** al calificar la entrega hay una animación de cierre.
- **Cambio de vista:** cliente / depósito, con una transición fluida.

## Datos simulados
- 30 pedidos con su historial de estados, sus productos y una ruta por pedido sobre el mapa SVG.
- Horarios coherentes dentro de la simulación.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia. El seguimiento es mobile first, porque el cliente lo mira desde el celular.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
