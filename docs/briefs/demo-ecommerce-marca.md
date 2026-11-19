Crea desde cero un proyecto Astro llamado `09-ecommerce-marca`: una demo de portfolio de tienda online para una marca de muebles ficticia, **Muebles Río Luján** (Tucumán, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin, Draggable), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El mueble se fabrica mientras lo elegís: cada pieza se arma, se pinta y se embala delante del visitante.

## Dirección visual
- **Paleta:** madera clara, blanco hueso y un verde bosque como acento.
- **Tipografía:** una serif elegante para nombres y precios, y una sans precisa para medidas.
- **Ilustración:** muebles en SVG isométrico o CSS 3D, con materiales planos y sin sombras decorativas.

## Escenas
1. **Hero:** una silla se ensambla pieza por pieza con el scroll, desde la vista explosionada hasta armada.
2. **Configurador:** madera, tela y medida; el mueble cambia de material con transición y el precio rueda.
3. **En tu ambiente:** el mueble se arrastra dentro de una habitación ilustrada a escala, con una regla en centímetros.
4. **Producción:** los 15 días de fabricación (corte, lijado, armado, laca) como una línea de etapas ilustradas con avance simulado.
5. **Carrito:** el mueble se embala en una caja que se cierra y se etiqueta.
6. **Envío:** un mapa de Argentina con un camión que viaja a la provincia elegida y los días estimados.

## Interacciones
- **Catálogo** con filtros por ambiente y material, reordenado con Flip.
- **Checkout simulado** con datos de prueba precargados. Sin Stripe ni pasarela real.
- **Comparar medidas** de dos muebles superpuestos.

## Datos simulados
- 60 productos con variantes de madera, tela y medida, precios y tiempos de producción.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
