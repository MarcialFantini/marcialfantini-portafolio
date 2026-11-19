Crea desde cero un proyecto Astro llamado `04-checkout-artesanal`: una demo de portfolio de tienda online y checkout para una panadería artesanal ficticia, **Lo de Marta — Panificados Artesanales** (Nordelta, Buenos Aires, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin, MorphSVGPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Del horno a tu mesa: comprar se siente como llenar una bolsa de papel en el mostrador.

## Dirección visual
- **Paleta:** crema harina, marrón tostado y un rosa frutilla como acento.
- **Tipografía:** una serif cálida y redondeada para títulos y precios, y una sans amable para el texto.
- **Ilustración:** panes, facturas y budines dibujados en SVG con un lenguaje plano y coherente.

## Escenas
1. **Hero:** una masa que leva (morph SVG) hasta convertirse en pan, con vapor en canvas y el titular que se acomoda encima.
2. **Catálogo:** 30 productos ilustrados. Al agregar uno, vuela hasta la bolsa de papel (MotionPath) y la bolsa se infla un poco.
3. **Armá tu caja:** una caja de docena en CSS 3D con 12 huecos donde se arrastran las facturas; al completarla, la tapa se cierra.
4. **Próxima horneada:** un reloj de horno con cuenta regresiva a la siguiente tanda (tiempo simulado) y los productos que salen en ella.
5. **Envío:** se escribe el código postal y un mapa ilustrado de CABA y GBA pinta la zona, con costo y día de entrega.
6. **Confirmación:** la bolsa se cierra con un sticker de la marca y sale un ticket con el resumen.

## Interacciones
- **Checkout en 2 pasos** con pago simulado: una tarjeta ficticia que gira en 3D. El formulario viene precargado con datos de prueba y avisa que no se ingresen datos reales. Sin pasarela de pago real.
- **Cantidades** con botones que hacen "saltar" el producto en la bolsa.
- **Filtros** por tipo (panes, facturas, budines, sin TACC) con Flip.

## Datos simulados
- 30 productos con precio, peso, ingredientes y etiquetas; zonas de envío por código postal.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
