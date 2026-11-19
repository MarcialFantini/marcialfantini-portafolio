Crea desde cero un proyecto Astro llamado `17-tienda-shopify-headless`: una demo de portfolio de una tienda de moda ultrarrápida para una marca ficticia, **Moda Urbana BsAs** (Palermo, CABA, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, Draggable, SplitText), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La vidriera de Palermo: un lookbook que se mueve como un video de street style y se compra al instante.

## Dirección visual
- **Paleta:** blanco, negro y un naranja flúor como único acento.
- **Tipografía:** una grotesca extendida gigante que cruza la pantalla y una sans neutra para precios.
- **Composición:** cortes de imagen fuertes, grilla asimétrica, sin sombras ni gradientes.

## Escenas
1. **Hero:** un lookbook a pantalla completa con cortes rápidos, tipografía gigante en marquee y prendas recortadas que flotan.
2. **Catálogo:** 400 productos con filtros instantáneos (Flip) y una grilla virtualizada que no se traba.
3. **Producto:** cambio de color con transición y una guía de talles con una silueta que se ajusta.
4. **Armá tu look:** se arrastran prendas sobre una silueta y el total se suma.
5. **Carrito:** un panel lateral al que las prendas vuelan; checkout simulado.
6. **Velocidad:** la página muestra cuánto tardó en cargar, medido de verdad con la Performance API del navegador.

## Interacciones
- **Vista rápida** de producto sin salir del catálogo.
- **Favoritos** guardados en `localStorage`.
- **Ordenar** por precio o novedad con transición.

## Datos simulados
- 400 productos generados en 8 categorías, con colores, talles, stock y precio.
- Sin Shopify ni ninguna API: el catálogo es un JSON local.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
