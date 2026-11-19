Crea desde cero un proyecto Astro llamado `19-pos-mobile-pyme`: una demo de portfolio de un punto de venta móvil para una dietética ficticia, **Dietética La Esquina** (Buenos Aires, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Vender en 8 segundos: una caja en el celular que cobra, factura y descuenta stock sin esperas.

## Dirección visual
- **Paleta:** crema, verde hoja y un mostaza como acento.
- **Tipografía:** una sans redondeada grande para totales y una sans legible para el resto.
- **Formato:** en escritorio, la app dentro de un teléfono dibujado con explicaciones alrededor; en mobile, a pantalla completa.

## Escenas
1. **Hero:** el teléfono hace una venta completa con un cronómetro de 0 a 8 segundos.
2. **Venta:** se tocan productos en una estantería ilustrada (escaneo simulado), caen en una bolsa kraft y el total rueda.
3. **Granel:** una balanza animada cuyo peso oscila y se estabiliza antes de calcular el precio.
4. **Cobro:** medios de pago simulados y el vuelto calculado con billetes ilustrados que se apilan.
5. **Ticket:** la factura simulada sale de una impresora en CSS.
6. **Cierre del día:** caja, horas pico y comparación entre las 2 sucursales con gráficos animados.

## Interacciones
- **Stock:** la estantería se vacía al vender y aparece una alerta de reposición.
- **Modo sin conexión** con un service worker: la venta sigue funcionando y se marca para sincronizar.
- **Búsqueda** por nombre o código con resultados instantáneos.

## Datos simulados
- 600 productos (alimentos, suplementos y cosmética natural), 2 sucursales y una semana de ventas generadas.
- Sin AFIP: el CAE y la factura son ficticios y se rotulan como tales.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
