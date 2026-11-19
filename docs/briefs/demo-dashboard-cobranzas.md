Crea desde cero un proyecto Astro llamado `16-dashboard-cobranzas`: una demo de portfolio de un tablero de cobranzas para una empresa ficticia, **Servicios Financieros del Plata** (Buenos Aires, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La mora como un río: la cartera fluye entre tramos y se ve hacia dónde se mueve el dinero.

## Dirección visual
- **Paleta:** papel claro, verde dinero oscuro y un rojo alerta como acento.
- **Números:** grandes, en una condensada con cifras tabulares.
- **Gráficos:** hechos a mano en SVG o canvas (D3 solo para escalas y formas), sin sombras ni gradientes.

## Escenas
1. **Hero:** la cartera total y la mora en números gigantes; debajo, un diagrama de flujo (Sankey) entre tramos con partículas que viajan.
2. **Tramos:** al día, 1–30, 31–60, 61–90, 91–180 y 180+ en una barra apilada que se reacomoda día a día con un slider de 90 días.
3. **Gestores:** un ranking de 25 que corre como carrera; al hacer click, la ficha muestra su embudo (llamadas → promesas → pagos).
4. **Proyección:** la curva de recupero con una banda de incertidumbre y escenarios que se eligen con un slider.
5. **Alertas:** tarjetas que entran cuando un cliente pasa de tramo.
6. **Directorio en el celular:** a 390 px, el resumen se ve como tarjetas que se pasan con el dedo.

## Interacciones
- **Filtros globales** por período y equipo que cambian todas las piezas con transiciones coordinadas.
- **Tooltips** detallados con un mini gráfico.
- **Tablas accesibles** como alternativa a cada gráfico.

## Datos simulados
- 25 gestores, 6 tramos, 2.000 deudores y 90 días de historia con una cartera ficticia.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
