Crea desde cero un proyecto Astro llamado `08-leads-inmobiliaria`: una demo de portfolio de un portal de propiedades con captación de consultas para una inmobiliaria ficticia, **Inmobiliaria Buenavista** (zona norte del Gran Buenos Aires, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La casa se arma frente a vos: buscar es ver cómo las propiedades caen en el mapa y cómo cada plano se dibuja.

## Dirección visual
- **Paleta:** arena, verde oliva y terracota como acento.
- **Tipografía:** una serif para títulos y precios, y una sans clara para datos.
- **Planos y mapa:** dibujados a mano en SVG, con un trazo fino y coherente.

## Escenas
1. **Hero buscador:** filtros de operación, zona, precio y ambientes; las propiedades caen como fichas sobre un mapa SVG de zona norte y el contador de resultados rueda.
2. **Mapa:** las propiedades se agrupan en clusters que se separan al hacer zoom.
3. **Ficha:** el plano SVG de la unidad se dibuja trazo a trazo y se recorre ambiente por ambiente con transiciones.
4. **Comparador:** se arrastran hasta 3 propiedades a una bandeja y se comparan con barras animadas.
5. **Consulta con scoring:** a medida que el visitante responde (presupuesto, plazo, financiación), un medidor sube y clasifica la consulta como fría, tibia o caliente.
6. **Panel del agente:** las consultas entran solas y se ordenan por puntaje con Flip.

## Interacciones
- **Calculadora** de cuota y expensas con sliders.
- **Favoritos** que vuelan a un contador y se guardan en `localStorage`.
- **Cambio de vista** grilla / mapa con transición.

## Datos simulados
- 200 propiedades con operación, zona, precio, ambientes, superficie y un plano generado a partir de plantillas.
- Sin HubSpot ni CRM externo: el scoring y el panel viven en el navegador.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
