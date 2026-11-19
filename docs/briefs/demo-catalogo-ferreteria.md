Crea desde cero un proyecto Astro llamado `02-catalogo-ferreteria`: una demo de portfolio de un catálogo mayorista para una ferretería ficticia, **Ferretería El Tornillo** (Once, CABA, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La pared de cajoncitos: cada categoría es un cajón de ferretería con su etiqueta, y el catálogo se recorre abriéndolos.

## Dirección visual
- **Paleta:** gris galvanizado claro, negro y un rojo esmalte como acento, con etiquetas amarillas.
- **Tipografía:** una condensada industrial para códigos y precios, y una sans legible para el texto.
- **Composición:** grillas rígidas como estanterías, sin sombras ni gradientes decorativos.

## Escenas
1. **Hero:** una pared de cajoncitos se abre en ola y de uno cae una lluvia de tornillos (física simple en canvas) que se apila en el piso.
2. **Buscador por código:** al escribir, el cajón correspondiente se ilumina y sale hacia el frente; los resultados se acomodan con Flip.
3. **Categorías:** 12 cajones; al abrir uno, sus productos salen en abanico con su código, medida y precio mayorista.
4. **Vista explosionada:** una herramienta dibujada en SVG (un taladro) se separa en piezas al hacer scroll, con el código de cada repuesto.
5. **Lista de pedido:** el pedido se arma como un ticket impreso que se alarga con cada producto y el total rueda.
6. **PDF filtrado:** una vista de impresión generada en el navegador con la categoría elegida, lista para guardar como PDF.

## Interacciones
- **Regla a escala real:** compara medidas de tornillos y mechas sobre la pantalla.
- **Calculadora de cantidades:** superficie o metros, y la cantidad de unidades o cajas que hacen falta.
- **Filtros combinados** (medida, material, marca, precio) con transición de la grilla.

## Datos simulados
- 200 productos en 12 categorías, con código, medida, material, precio minorista y mayorista.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
