Crea desde cero un proyecto Astro llamado `18-integracion-mercadolibre-erp`: una demo de portfolio de stock unificado entre tres canales de venta para una distribuidora ficticia, **Distribuidora del Litoral** (Santa Fe, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Un solo stock, tres vidrieras: el sistema central alimenta a los tres canales y se ve cada pedido recorrerlo.

## Dirección visual
- **Paleta:** blanco, azul cobalto y un amarillo como acento.
- **Tipografía:** una condensada para cantidades y una sans legible para el texto.
- **Canales:** "Marketplace", "Tienda online" y "Sitio propio", con marcas inventadas. Sin logos de MercadoLibre, TiendaNube ni otras plataformas reales.

## Escenas
1. **Hero:** el sistema central en el medio y los tres canales alrededor; los pedidos entran como pulsos por los cables y el stock baja en los tres a la vez.
2. **Antes / después:** dos simulaciones lado a lado; sin sincronizar aparecen ventas sin stock y cancelaciones en rojo, sincronizado no.
3. **Ficha de producto:** el stock de cada canal se iguala en menos de 10 segundos, con un contador de demora simulado.
4. **Cola de pedidos:** cada pedido pasa por sistema central → factura simulada → etiqueta de envío generada en el navegador.
5. **Registro de eventos:** una lista animada de lo que pasa en cada momento.
6. **Reglas:** sliders para reservar un porcentaje del stock por canal y ver el efecto en vivo.

## Interacciones
- **Vender a mano** en un canal y ver cómo se sincronizan los otros dos.
- **Adelantar el tiempo** para ver un día de pedidos en segundos.
- **Buscador** de producto con su historial de movimientos.

## Datos simulados
- 300 productos de limpieza y 800 pedidos de un mes ficticio repartidos en los tres canales.
- Nada se conecta a plataformas reales ni a AFIP.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
