Crea desde cero un proyecto Astro llamado `12-automatizacion-crm-whatsapp`: una demo de portfolio de recordatorios y seguimiento automático para una clínica ficticia, **Clínica San Martín** (Rosario, Argentina). La prioridad es el impacto visual: tiene que vender por imagen, verse espectacular en una captura y en un video de 10 segundos. La utilidad real se valida después.

## Reglas técnicas
- Astro (última versión estable) + TypeScript estricto, salida 100% estática (`astro build`).
- CSS con variables (o Tailwind v4). Animación con GSAP 3 y sus plugins gratuitos (ScrollTrigger, Flip, MotionPathPlugin, Draggable), View Transitions de Astro, SVG, CSS 3D y canvas.
- **Sin backend, sin APIs, sin base de datos, sin servicios externos.** Todo corre en el navegador. Cualquier integración (pagos, mensajes, facturación, plataformas) se simula dentro de la interfaz.
- Datos ficticios generados con una semilla fija (generador pseudoaleatorio determinista) en `src/data/`. El estado vive en memoria, con persistencia opcional en `localStorage`.
- Marca y datos ficticios. La interfaz muestra siempre una marca visible "Demo".

## Concepto
La recepción que trabaja sola: recordatorios, confirmaciones y consultas se mueven sin que nadie las toque.

## Dirección visual
- **Paleta:** blanco clínico, azul petróleo y un verde agua como acento.
- **Tipografía:** una sans humanista grande para números y una sans legible para el texto.
- **Mensajería propia:** una bandeja de chat genérica diseñada para la demo, sin logos ni estética de WhatsApp ni de ninguna app real.

## Escenas
1. **Hero:** la agenda de 40 profesionales se llena con un reloj acelerado; los recordatorios salen volando como burbujas hacia los pacientes.
2. **Bandeja de consultas:** llegan mensajes simulados; el sistema los clasifica por especialidad (la etiqueta vuela al mensaje) y los deriva a su profesional (MotionPath).
3. **Confirmaciones:** el paciente toca "Confirmo" o "Reprogramo" en el chat simulado y la tasa de confirmación rueda.
4. **Editor de flujo:** un diagrama de nodos (disparador → espera 24 h → mensaje → si no responde…) que se edita arrastrando y se "ejecuta" con pulsos que viajan por las conexiones.
5. **Tablero:** horas de recepción liberadas, recordatorios del mes y consultas respondidas en menos de 5 minutos, con contadores animados.
6. **Antes / después:** el día de la recepcionista con y sin automatización, en dos líneas de tiempo paralelas.

## Interacciones
- **Simular paciente:** el visitante escribe como si fuera un paciente y ve cómo se clasifica y deriva su consulta.
- **Adelantar el tiempo** para ver salir los recordatorios del día siguiente.
- **Filtro** por especialidad en la bandeja.

## Datos simulados
- 12 especialidades, 40 profesionales, una semana de turnos y 60 conversaciones de ejemplo.
- Nada se envía de verdad: no hay WhatsApp, HubSpot ni ningún servicio de mensajería.

## Modo vitrina
`?showcase` recorre solo todas las escenas en un loop de unos 20 segundos, sin cursor, para grabar el video del portfolio. Además, agrega un póster de 1600x900 en `public/poster.jpg`.

## Calidad
- **Rendimiento:** 60 fps animando solo transform y opacity (más SVG y canvas). Lighthouse en mobile ≥ 90 de performance. Cero errores en consola.
- **Movimiento reducido:** con `prefers-reduced-motion`, una versión estática completa.
- **Mobile:** a 390 px, una composición propia, no la de desktop achicada.
- **Accesibilidad:** navegable con teclado y foco visible.
- **README:** cómo correr el proyecto y cómo grabar el modo vitrina.
