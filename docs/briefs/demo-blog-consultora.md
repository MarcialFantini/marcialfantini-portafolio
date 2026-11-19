Crea desde cero un proyecto Astro llamado `06-blog-consultora`: una demo de portfolio del blog editorial de una consultora ficticia, **Consultora Estrada & Cía** (Buenos Aires, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, SplitText), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Una revista de ideas: cada visita abre una edición, con portada, índice y lectura cuidada como en papel.

## Dirección visual
- **Paleta:** blanco papel, negro tinta y un rojo editorial como único acento.
- **Tipografía:** una serif display alta para titulares, una serif de lectura para el cuerpo y una sans para datos.
- **Composición:** grilla editorial de 12 columnas con cambios de escala fuertes, sin sombras ni gradientes.

## Escenas
1. **Portada:** los titulares se componen como tipos móviles (SplitText) y la grilla de notas se acomoda en su lugar.
2. **Índice:** 24 artículos que se reordenan por área de consultoría con Flip.
3. **Lectura:** barra de progreso, citas destacadas que crecen al entrar y gráficos dentro del texto que se dibujan con el scroll.
4. **Autores:** 12 perfiles con retratos ilustrados en trazo. Al pasar el mouse, sus artículos se abren en abanico.
5. **Temas:** un mapa de etiquetas conectadas en SVG; al elegir una, las notas relacionadas se iluminan.
6. **Newsletter:** la suscripción (simulada) muestra la próxima edición plegándose dentro de un sobre.

## Interacciones
- **Buscador instantáneo** en el navegador, con resultados que resaltan la coincidencia.
- **Ajustes de lectura:** tamaño de letra y tema claro u oscuro con transición suave.
- **Tiempo de lectura** y "seguir leyendo" recordado en `localStorage`.

## Datos simulados
- 24 artículos en Content Collections (MDX), 12 autores y 5 áreas; textos de muestra de buena calidad, no lorem ipsum.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
