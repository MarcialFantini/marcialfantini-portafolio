Crea desde cero un proyecto Astro llamado `11-migracion-wordpress-editorial`: una demo de portfolio que muestra la migración de una revista digital ficticia a un sitio nuevo, **Revista La Vuelta** (Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, SplitText), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La mudanza del archivo: 1.200 notas viajan de un sitio viejo y pesado a uno nuevo y rápido, y se ve cómo pasa.

## Dirección visual
- **Paleta:** papel de diario, negro y un amarillo resaltador como acento.
- **Tipografía:** una serif de periódico para titulares y una sans técnica para los datos de la migración.
- **Composición:** portada de revista con columnas, sin sombras ni gradientes.

## Escenas
1. **Hero:** 1.200 cuadraditos (uno por nota) vuelan desde una pila desordenada hasta una grilla ordenada (canvas), y el contador sube.
2. **Antes / después:** un slider compara la portada vieja, recargada, con la nueva; dos medidores de carga simulados corren en paralelo.
3. **Redirecciones:** las URL viejas se conectan con las nuevas con líneas que se trazan, y el contador de errores 404 baja a 0.
4. **Archivo:** 8 años como un heatmap de notas por mes; al hacer click en un mes se abre su lista con Flip.
5. **Errores técnicos:** 40 problemas de SEO en una lista que se van tachando uno por uno.
6. **Lectura:** una nota de ejemplo con tipografía cuidada, imagen principal y notas relacionadas.

## Interacciones
- **Buscador** de URL vieja que muestra a qué URL nueva redirige, con animación.
- **Filtro del archivo** por sección y año.
- **Modo lectura** con ajuste de tamaño de letra.

## Datos simulados
- 1.200 notas generadas con título, sección, fecha y URL vieja y nueva, repartidas en 8 años.
- Las métricas de antes y después son ficticias y se rotulan como tales.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
