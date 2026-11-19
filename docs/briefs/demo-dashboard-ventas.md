Crea desde cero un proyecto Astro llamado `dashboard-ventas`: una demo de portfolio de un tablero de ventas para un mayorista ficticio, **Mayorista Central** (Córdoba, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, SplitText).
- Gráficos hechos a mano en SVG o canvas. D3 está permitido solo para escalas y formas; nada de librerías de gráficos genéricas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
Los números como espectáculo: un centro de mando editorial donde cada cifra entra en escena.

## Dirección visual
- **Paleta:** un fondo profundo (noche) con un solo acento eléctrico, y una segunda vista en papel claro.
- **Números:** gigantes, en una tipografía condensada con cifras tabulares.
- **Gráficos:** con carácter propio y etiquetas grandes. Sin sombras ni gradientes decorativos.

## Escenas
1. **Hero:** la facturación del mes cuenta desde cero con dígitos que ruedan como un odómetro, y una sparkline se dibuja debajo.
2. **Mapa de Argentina (SVG):** las provincias se encienden según sus ventas y los puntos de pedidos "llueven" sobre las ciudades.
3. **Interanual:** las curvas de este año y del anterior se dibujan y se cruzan. Se recorren con el scroll o con un slider de meses.
4. **Ranking de productos:** una carrera de barras semana a semana, con play y pausa.
5. **Cohortes de clientes:** un heatmap que se revela celda por celda. Al pasar el mouse muestra el detalle de la celda.
6. **Filtros globales:** los selectores de período (mes, trimestre o año) y de vendedor cambian todas las piezas con transiciones coordinadas, sin recargar la página.

## Interacciones
- **Tooltips:** detallados, con un mini gráfico adentro.
- **Drill-down:** de una provincia a sus clientes, con zoom.
- **Modo presentación:** pantalla completa, avanzando entre escenas con las flechas del teclado.
- **Exportar:** permite descargar una imagen del gráfico activo, generada en canvas dentro del navegador.

## Datos simulados
- 24 meses con estacionalidad y tendencia.
- 200 clientes repartidos por provincia, 80 productos y 6 vendedores.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform, opacity y SVG/canvas. Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, con los gráficos rediseñados para el dedo.
- **Accesibilidad:** navegable con teclado, foco visible y tablas accesibles como alternativa a cada gráfico.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
