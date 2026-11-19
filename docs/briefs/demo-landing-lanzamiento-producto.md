Crea desde cero un proyecto Astro llamado `14-landing-lanzamiento-producto`: una demo de portfolio de la landing de preventa de un producto agtech ficticio, **AgroIA** (Córdoba, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, SplitText, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El campo que se planifica solo: una vista cenital de lotes que se siembran, crecen y se cosechan con el scroll.

## Dirección visual
- **Paleta:** verde brote, tierra y cielo pálido, con un amarillo trigo como acento.
- **Tipografía:** una grotesca grande y firme para titulares y una sans legible para el texto.
- **Ilustración:** lotes, surcos y capas de mapa en SVG plano.

## Escenas
1. **Hero:** un campo visto desde arriba se divide en lotes y se siembra en filas (trazos SVG) mientras el titular entra con SplitText.
2. **Estaciones:** el scroll recorre siembra, crecimiento y cosecha, y el campo cambia de color por lote.
3. **Cómo funciona:** capas de satélite, suelo y clima se apilan en isométrico y se separan para explicarse.
4. **Simulador de siembra:** cultivo, fecha y lote; el lote crece en animación y muestra un rinde estimado con fórmulas ficticias.
5. **Segmentos:** productor chico, mediano o empresa; toda la propuesta cambia con una transición.
6. **Lista de espera:** un formulario segmentado (simulado) que muestra el lugar en la fila con un contador.

## Interacciones
- **Embudo** de la preventa en un gráfico animado con datos simulados.
- **Comparar cultivos** en dos lotes vecinos.
- **Precio de preventa** con cuenta regresiva simulada.

## Datos simulados
- 3 segmentos, 6 cultivos con rindes de referencia ficticios y un campo de 12 lotes.
- Sin Beehiiv ni analytics externos.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
