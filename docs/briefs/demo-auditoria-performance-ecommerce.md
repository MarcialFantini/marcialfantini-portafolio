Crea desde cero un proyecto Astro llamado `13-auditoria-performance-ecommerce`: una demo de portfolio de una auditoría de velocidad para una tienda online ficticia, **Tienda Outdoor Patagonia** (Bariloche, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La radiografía de una tienda lenta: se ve por qué tarda, qué se arregla primero y cuánto mejora.

## Dirección visual
- **Paleta:** blanco nieve, gris piedra y un naranja de señal como único acento.
- **Tipografía:** una condensada técnica para métricas y una sans legible para las explicaciones.
- **Gráficos:** hechos a mano en SVG y canvas, con etiquetas grandes y sin sombras ni gradientes.

## Escenas
1. **Hero:** un medidor circular pasa de 38 a 96 con los dígitos rodando, y las métricas LCP, CLS e INP se acomodan debajo.
2. **Cascada de carga:** los recursos de la página se dibujan como barras en una cascada; después se dibuja la versión optimizada para comparar.
3. **Tira de cuadros:** una tienda ficticia hecha en HTML se pinta de a poco, cuadro por cuadro, antes y después.
4. **12 problemas:** tarjetas ordenadas por impacto (Flip); al abrir una aparece un diagrama de la causa y la solución.
5. **Plan en 3 sprints:** un tablero donde los problemas se mueven entre sprints y el LCP proyectado se recalcula.
6. **Medición real:** la demo mide su propia carga con la Performance API del navegador y la muestra en pantalla.

## Interacciones
- **Simulador:** interruptores de optimizaciones (imágenes, fuentes, JavaScript, caché) y el medidor y las métricas reaccionan.
- **Cambio de red** simulado (4G, 3G) que alarga o acorta las barras.
- **Reporte ejecutivo** imprimible desde el navegador.

## Datos simulados
- 12 problemas con impacto, esfuerzo y ganancia estimada; métricas de antes y después ficticias y rotuladas como tales.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
