Crea desde cero un proyecto Astro llamado `01-estudio-juridico-morales`: una demo de portfolio de la web institucional de un estudio jurídico ficticio, **Estudio Morales & Asociados** (CABA, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, SplitText), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
El expediente que se abre: la página se comporta como un legajo de papel, con carpetas, sellos y fichas que se despliegan.

## Dirección visual
- **Paleta:** papel marfil, tinta verde oscuro y un bordó lacre como único acento.
- **Tipografía:** una serif editorial grande para los títulos y una sans sobria para el texto.
- **Composición:** márgenes amplios, columnas de libro, sin sombras ni gradientes decorativos.

## Escenas
1. **Hero:** el nombre del estudio se compone letra por letra (SplitText), un sello se estampa con un pequeño rebote y una carpeta se abre para mostrar la propuesta.
2. **Áreas de práctica:** seis carpetas en un fichero con pestañas. Al pasar el mouse la carpeta se levanta; al hacer click se abre a pantalla completa (Flip) con casos tipo, plazos y el abogado responsable.
3. **Trayectoria:** 25 años en una línea de tiempo horizontal anclada al scroll, con los años en tipografía gigante que ruedan.
4. **Equipo:** fichas de 8 abogados con retratos ilustrados en SVG que giran para mostrar especialidad e idiomas.
5. **¿Tengo un caso?:** un asistente de 4 preguntas arma un memorando con el área sugerida y lo cierra con el sello del estudio.
6. **Contacto:** el formulario se pliega como un sobre y "se envía" con una animación. El envío es simulado.

## Interacciones
- **Calculadora de plazos:** se elige un tipo de trámite y una fecha, y el calendario marca los días hábiles hasta el vencimiento.
- **Filtro de casos tipo** por área, con reordenamiento animado.
- **Índice lateral** que sigue la lectura y salta entre secciones con transición.

## Datos simulados
- 6 áreas de práctica, 8 abogados, 12 casos tipo y 10 preguntas frecuentes.
- Feriados nacionales de Argentina del año en curso, cargados en un JSON local.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
