Crea desde cero un proyecto Astro llamado `inventario-distribuidora`: una demo de portfolio de un sistema de inventario para una distribuidora ficticia, **Distribuidora del Sur** (Córdoba, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin, SplitText). SVG y canvas permitidos.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El depósito como un plano vivo. Vista cenital o isométrica de un depósito con estanterías, cajas que se mueven y números que reaccionan.

## Dirección visual
- **Paleta industrial:** hormigón claro, negro y un amarillo de seguridad como único acento.
- **Tipografía:** una condensada grande para los números y una sans legible para el texto.
- **Composición:** planos limpios y mucho aire, sin sombras ni gradientes decorativos.

## Escenas
1. **Hero:** el plano del depósito se dibuja solo (trazos SVG que se trazan), las cajas caen a sus estanterías y el total de unidades sube como un contador.
2. **Mapa de stock:** cada estantería se colorea según su nivel (lleno, medio o crítico).
   - Al pasar el mouse aparece una ficha con producto, unidades y días de cobertura.
   - Al hacer click hay un zoom (Flip) a esa estantería con sus cajas.
3. **Movimientos en vivo:** cada 1–2 segundos se simula un ingreso o egreso. Una caja recorre el camino del muelle a su estantería (MotionPath) y un registro lateral de movimientos se actualiza animado.
4. **Alertas de reposición:**
   - Cuando un producto baja del mínimo, su estantería destella en amarillo una sola vez.
   - Aparece una tarjeta "Reponer 120 u.".
   - Su botón dispara un pedido simulado: un camión entra al muelle y la estantería se rellena.
5. **Rotación:** un treemap o gráfico ABC animado de productos según su rotación, con un control de tiempo que cambia de semana con transición.
6. **Depósitos:** un selector Norte / Sur / Centro hace un movimiento de cámara entre las plantas.

## Interacciones
- **Buscador de producto:** al buscar, resalta y hace zoom a su ubicación en el plano.
- **Filtros por categoría:** reordenan las estanterías con Flip.
- **Mover cajas:** se puede arrastrar una caja de una estantería a otra, y los contadores se actualizan.

## Datos simulados
- 3 depósitos, unas 40 estanterías y unos 60 productos de embalaje: cajas 30x40, film stretch, cinta, etiquetas, esquineros, etc.
- Mínimos, máximos e historial de 12 semanas.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity. Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
