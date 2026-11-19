# Plan de rediseño — formato tipo deltacafes.com

> Estado: **borrador, pendiente de respuestas** (ver §10; decisiones en §9).
> Fecha: 2026-11-18.
> Alcance de la referencia: se toma **solo el formato** (estructura, ritmo, composición, comportamiento al scroll). No se toma el copy, los colores, las texturas, las imágenes ni la marca de Delta.

---

## 1. Objetivo

Convertir el home en un **recorrido por capítulos**: cada pantalla usa un recurso distinto (video, collage, ciclo, tira horizontal, quiz) y el fondo cambia entre capítulos. Hoy el home es oscuro, plano y repite la misma composición; el objetivo es que sea llamativo y tenga estilo propio sin perder el mensaje comercial (diagnóstico gratis → contacto).

## 2. Diagnóstico del home actual

Medido con el inspector de tasteskill a 1440, 768 y 390 px (`pnpm preview`).

| Problema | Evidencia |
| --- | --- |
| La dirección elegida no se aplicó | `type-only-statement` pide titular de 9–14vw alineado a la izquierda; el hero real está centrado a 6.6vw. |
| Todo se funde | 6 fondos azul noche casi iguales (`#0a0d14`, `#0f1628`, `#11161e`, `#0d1322`, `#131824`, `#12171f`). El acento solo aparece en botones. |
| Composición repetida | 4 capítulos seguidos con el mismo esquema: título a la izquierda y panel gris a la derecha. Después, filas de tarjetas iguales en Casos. |
| Sin imágenes | 2 imágenes reales en toda la página. Delta tiene 157 y varios videos. |
| Titulares largos | El hero ocupa 4 líneas en mobile; hay titulares de 3 líneas en desktop. |
| Etiquetas sueltas | 2 etiquetas pequeñas encima de títulos (Casos y Dudas). |
| Material vacío | `demos.json`: las 19 `captura` están vacías. `sobre.json`: `foto` y los 3 `datos` están vacíos. `site.json`: `aboutPhoto` vacío. |

## 3. Anatomía del formato de Delta

Recorrido observado en desktop, de arriba hacia abajo:

1. **Intro de carga**: palabra + logo + palabra, que se revelan en secuencia sobre un fondo plano.
2. **Hero**: video a pantalla completa visto a través de la forma del logo (máscara) y un titular condensado gigante, con palabras conectoras chicas en otra familia.
3. **Collage de archivo**: fotos y objetos sueltos flotando con parallax, más fechas en chips.
4. **Ciclo**: un recorrido en loop dibujado sobre video, con las etapas del proceso.
5. **Tira horizontal de retratos** con un título grande debajo.
6. **Cambio a fondo claro**: bloque editorial en columnas con un botón.
7. **Quiz**: productos flotando alrededor de un botón central. Es lo interactivo de la página.
8. **Journal**: titular a la izquierda y carrusel de notas.
9. **Campo de color pleno** (otro tono): fotos que entran volando y título fijo.
10. **Cierre**: video a pantalla completa con un titular gigante fijo durante el scroll.

Recursos transversales: fondo que cambia por capítulo, mayúsculas condensadas mezcladas con palabras chicas, mucha imagen real, entradas al hacer scroll en todos los bloques.

**No se copia** (decisión inicial, revisable en §10):

- la barra flotante con blur (glass);
- la numeración decorativa 01 / 02 / 03;
- los textos de menos de 13 px;
- los títulos tapados por imágenes al hacer scroll.

## 4. Mapa de secciones propuesto

| # | Formato Delta | Capítulo en esta landing | Contenido existente que se reutiliza |
| --- | --- | --- | --- |
| 0 | Intro de carga | "Marcial [marca] Fantini" | `site.json` (nombre, shortName), `docs/brand/favicon-source.svg` |
| 1 | Hero con video en máscara | Promesa + video de una operación real dentro de la forma de la marca | Copy actual del `Hero.astro` (reescrito a 2 líneas) |
| 2 | Collage de archivo | **"Así trabajan hoy"**: el caos de Excel, chats de WhatsApp, post-its, facturas y planillas flotando | Nuevo (piezas dibujadas en HTML/SVG + capturas) |
| 3 | Ciclo sobre video | **Conectar → Crear → Informar → Respaldar** como un loop | `Capitulos.astro`, `Tablero.astro` |
| 4 | Tira horizontal | Los proyectos demo, con su captura y rubro | `demos.json`, `src/content/proyectos/*.md` |
| 5 | Editorial en fondo claro | Sobre mí + stack | `sobre.json`, `Sobre.astro` |
| 6 | Quiz | **Diagnóstico en 4 preguntas** que recomienda un servicio con precio orientativo y deja el mensaje armado para WhatsApp o el formulario | `servicios.json`, `site.json` (whatsapp) |
| 7 | Journal | Carrusel del blog | `src/content/blog/*.md` (14 posts) |
| 8 | Campo de color | Cómo trabajo, en 3 pasos | `Proceso.astro` |
| 9 | Cierre con video | Llamado a contacto con titular gigante fijo | `UnCampo.astro`, `Dudas.astro` (FAQ, a definir si se mantiene) |

## 5. Sistema visual

- **Tipografía**: se mantiene Barlow Condensed (display) + Barlow (texto). Las palabras conectoras chicas del estilo Delta ("el ciclo **de** tu negocio") se resuelven con Barlow en otro peso o tamaño, sin sumar una tercera familia (pendiente: §10, pregunta 8).
- **Escala**: display de 12–18vw para los titulares de capítulo, cuerpo de 18–20 px, máximo 5 tamaños.
- **Color**: paleta nueva propia (no la de Delta). Una tinta, un acento y **un fondo distinto por capítulo**, con al menos uno claro. Se define tras las respuestas de §10.
- **Botones**: planos, de un solo color y con una única forma (recta o redonda) para toda la página.
- **Navegación**: barra simple con marca, 4 links y un botón de acción (pendiente: §10, pregunta 19).

## 6. Arquitectura técnica

- **Astro SSG** igual que hoy. Cada capítulo es un componente en `src/components/home/` y se compone en `src/pages/index.astro`.
- **Animación al scroll**: GSAP + ScrollTrigger (gratuito desde 2025), cargado solo en el home y como script de isla. La alternativa sin dependencias son las animaciones CSS ligadas al scroll (`animation-timeline`), con soporte parcial en Safari (pendiente: §10, pregunta 17).
- **Video**: `<video muted loop playsinline preload="none">` con `poster`; se reproduce solo cuando entra en pantalla y se usa WebM + MP4 a 720p con un objetivo de ≤ 2 MB por clip.
- **Imágenes**: `astro:assets` (AVIF/WebP, `srcset`, carga diferida fuera del primer pantallazo).
- **Accesibilidad**:
  - `prefers-reduced-motion` desactiva los desplazamientos, los pins y el autoplay, sin ocultar contenido;
  - todo el contenido es legible si JS falla;
  - el quiz es un formulario real con `fieldset`/`legend`.
- **Mobile**: es una composición propia, no un desktop achicado. La tira horizontal pasa a deslizarse con el dedo, el collage se reduce a 4–5 piezas y los pins se acortan.
- **Datos**: el contenido nuevo (piezas del collage, preguntas del quiz, etapas del ciclo) se guarda en `src/data/*.json`, siguiendo la convención del proyecto.

## 7. Plan de trabajo

Cada tramo dura **15 minutos como máximo** y termina en algo visible: una captura del inspector o una página que se puede abrir.

### Fase 0 — Preparación
1. Resolver los 9 archivos modificados sin commitear en `main` (pendiente: §10, pregunta 21), crear la rama `feat/formato-capitulos` e instalar la dependencia de animación. → `pnpm build` en verde.
2. Armar el esqueleto: 10 secciones vacías con su fondo de capítulo y su titular. → captura del recorrido completo de colores.

### Fase 1 — Hero
3. Titular a 2 líneas en todos los anchos, botón principal y nota de la charla gratis. → inspector sin errores en el hero.
4. Máscara con la forma de la marca y video (o foto de reemplazo). → captura en desktop y mobile.

### Fase 2 — Collage "Así trabajan hoy"
5. 6–8 piezas (planilla, chat, post-it, factura) en HTML/SVG, ubicadas en el desktop. → captura.
6. Parallax al scroll y versión mobile reducida. → captura en mobile.

### Fase 3 — Ciclo
7. Recorrido en loop con las 4 etapas, en SVG. → captura.
8. Avance de etapa con el scroll y contenido de cada etapa (reutiliza `Tablero`). → captura de cada etapa.

### Fase 4 — Tira de demos
9. Tira horizontal con las capturas de `demos.json`, o con interfaces dibujadas mientras no haya capturas. → captura.
10. Scroll horizontal fijo en desktop y deslizamiento con el dedo en mobile. → captura en mobile.

### Fase 5 — Sobre mí editorial
11. Fondo claro, columnas, foto y stack. → captura.

### Fase 6 — Diagnóstico
12. Formulario de 4 preguntas con lógica de recomendación (datos en JSON). → funciona sin estilos.
13. Diseño con las piezas flotantes y resultado con precio y mensaje armado para WhatsApp. → captura con el resultado.

### Fase 7 — Blog, proceso y cierre
14. Carrusel del blog. → captura.
15. Proceso en 3 pasos en el campo de color. → captura.
16. Cierre con video y titular fijo, más la FAQ si se mantiene. → captura.

### Fase 8 — Intro y movimiento
17. Intro de carga (solo en la primera visita, ≤ 1.5 s, se puede saltear). → GIF o capturas.
18. Entradas escalonadas en todos los capítulos y feedback en los controles. → el inspector mide 16 o más elementos en movimiento.

### Fase 9 — Cierre de calidad
19. Revisar `prefers-reduced-motion`, sin JS y el foco con teclado. → checklist.
20. Correr el inspector en 3 anchos y `pnpm check`. → 0 errores.
21. Lighthouse en mobile. → objetivo ≥ 90 en Performance y ≥ 95 en Accesibilidad.

## 8. Criterios de aceptación

- Inspector de tasteskill: **0 FAIL** en 1440, 768 y 390 px.
- Cada titular ocupa como máximo 2 líneas en todos los anchos.
- Al menos 8 imágenes reales (fotos, capturas o video) en el home.
- Ningún par de capítulos vecinos comparte composición ni color de fondo.
- El home se lee completo sin JS y con movimiento reducido.
- `pnpm build` y `pnpm check` pasan, y el feed RSS sigue generándose.
- Ningún proyecto demo se presenta como cliente.

## 9. Decisiones tomadas

| Fecha | Pregunta | Decisión |
| --- | --- | --- |
| 2026-11-18 | 1–4 (material) | **Todo con fotos de stock gratis** como reemplazo provisorio; las imágenes definitivas se buscan después. Fuentes: StockSnap y Rawpixel vía Openverse, licencia **CC0** (uso comercial libre, sin atribución obligatoria). |
| 2026-11-18 | 6 (fondo) | **Fondo base claro.** Paleta **aprobada**: fondo hueso `#F2F1EC`, tinta `#0E1116`, acento `#2557D6` (de la familia del azul aciano actual), y campos de capítulo en aciano `#5A9BFC`, lima `#D7F25C`, niebla `#E3E9F6` y noche `#0E1116` (solo en el ciclo y el cierre, que van sobre foto). Todos los pares de color pasan el contraste AA (≥ 5.4:1). |
| 2026-11-18 | 9 (equipo) | Hay **un equipo de colaboradores**, pero **Marcial es la cara y quien arma todo**. El copy habla en primera persona ("yo diseño y armo, con colaboradores"); `sobre.json` ya va en esa línea. |

### Fotos de stock descargadas

- **36 fotos** en `src/assets/stock/`, con sus créditos, alt y el lugar asignado en `src/data/stock.json`. Todas llevan `placeholder: true` para encontrarlas fácil al reemplazarlas.
- **Lugares cubiertos**:
  - hero: 1 + 1 alternativa;
  - collage del caos: 7;
  - ciclo: 3;
  - equipo: 2;
  - sobre mí: 1;
  - proceso: 3;
  - un rubro por cada uno de los 17 demos con rubro;
  - cierre: 1.
- **Límite de resolución**: Rawpixel entrega como máximo 1300 px de ancho y StockSnap 960 px. Alcanza como reemplazo provisorio, pero se ve blando a pantalla completa en monitores grandes. Las definitivas deben tener ≥ 2400 px.
- **Unsplash (2026-11-18)**: 35 de los 36 lugares tienen además una foto de Unsplash elegida por palabra clave (la primera gratuita, sin Unsplash+). Se usa como enlace directo a 2400 px y está guardada en `stock.json` → `unsplash` (con `src`, el crédito y la página del fotógrafo). La CC0 local queda como respaldo. Pendientes:
  - `ciclo-escaneo` no tuvo resultado gratis y sigue con la CC0;
  - `rubro-pedidos` repite la foto de `ciclo-cajas`: hay que cambiarla;
  - quedan 21 registros de descarga de Unsplash sin enviar por el límite de 50 pedidos por hora.
- **La foto de Marcial es provisoria y sin cara** (manos en una laptop): no se presenta a una persona de stock como si fuera él.
- **Video**: no hay clips CC0 de calidad en los archivos abiertos (los de Wikimedia son CC BY y algunos tienen marcas, como Amazon). Por ahora los lugares de video usan foto con movimiento lento; los clips se buscan con las imágenes definitivas.

## 10. Preguntas abiertas

Ordenadas por impacto. **Las del bloque A frenan el arranque.**

### A. Material — ✅ respondido (ver §9)

1. ¿Tenés **fotos tuyas**, ya sea un retrato o trabajando? Hoy `sobre.json` → `foto` y `site.json` → `aboutPhoto` están vacíos.
2. ¿Tenés **capturas reales de los 19 demos**? Todas las `captura` de `demos.json` están vacías. ¿Están desplegados en algún lado para capturarlos?
3. ¿Tenés o podés grabar **videos**: grabaciones de pantalla de un sistema en uso, un depósito, un local? ¿O busco clips con licencia libre en archivos abiertos (Wikimedia, Openverse)?
4. ¿Hay **material de clientes reales** que se pueda mostrar con permiso, o todo debe seguir siendo demo?

### B. Marca

5. ¿Tenés un **símbolo o logo**? Delta usa su triángulo como máscara del hero. Existe `docs/brand/favicon-source.svg` ("MF"): ¿lo usamos como forma o diseño un símbolo nuevo?
6. **Fondo**: ¿preferís que la base sea clara, oscura o que alterne por capítulo, como Delta?
7. **Colores**: ¿hay alguno que te guste o que quieras evitar sí o sí?
8. **Tipografía**: ¿mantenemos Barlow / Barlow Condensed? Para las palabras conectoras chicas, ¿usamos Barlow (recomendado, 2 familias) o sumamos una serif (tercera familia, más parecida a Delta)?

### C. Contenido

9. ✅ *Respondido (ver §9).* `sobre.json` dice "Fundador" y "lo construyo con el equipo", pero el resto del sitio habla en primera persona como freelance. **¿Trabajás solo o con equipo?**
10. ¿Cuáles son los **números reales** para "años construyendo software", "sistemas en producción" y "rubros atendidos"? Si no hay, se quita el bloque.
11. **Diagnóstico**:
    - ¿Qué 4 preguntas harías en la primera charla?
    - ¿Mostramos el precio orientativo en el resultado?
    - ¿El resultado va a WhatsApp, al formulario o a los dos?
12. De las secciones actuales (**Dudas/FAQ, Proceso, Casos**), ¿cuáles se quedan?
13. **Los robots**: son lo más propio del sitio actual, pero no encajan con el formato Delta, que es fotográfico. ¿Se quedan como hilo conductor, como detalle chico, o se van?
14. **Intro de carga**: ¿sí o no? Le cuesta 1–1.5 s al visitante. Mi propuesta es mostrarla solo en la primera visita.
15. ¿Incluimos el **carrusel del blog** en el home?
16. ¿El sitio sigue **solo en español**?

### D. Alcance y técnica

17. **Animaciones**: ¿GSAP (≈ 70 KB, robusto, recomendado) o CSS sin dependencias (más liviano, soporte parcial en Safari)?
18. ¿Querés **scroll suavizado** (tipo Lenis)? Se siente más premium, pero altera el scroll nativo y puede molestar en trackpads y a usuarios de accesibilidad.
19. **Navegación**: ¿barra simple (recomendado) o la píldora flotante con el logo al centro, como Delta?
20. ¿El rediseño es **solo el home** o también las páginas internas (servicios, proyectos, sobre mí, contacto)?
21. Hay **9 archivos modificados sin commitear** en `main` (Hero, UnCampo, robots, `vivo.ts`, `global.css`). ¿Los commiteo antes de empezar, los descarto o los incorporo al rediseño?
22. ¿**Dónde se despliega** el sitio? Define si los videos van en `/public` o en un servicio externo.
23. ¿Hay una **fecha límite** o una prioridad (por ejemplo, tener el hero y el diagnóstico primero)?

## 11. Iteración 2 (2026-11-18): más detalle y menos bloqueo

Pedidos de Marcial después de ver la primera versión junto a Delta:

- **Faltan detalles en toda la página**: Delta tiene mucha más densidad de objetos, fotos y pequeños elementos.
- **Hero**: tiene que cambiar de imagen.
- **Videos**: faltan lugares para videos.
- **Proyectos demo**: el scroll fijo bloquea demasiado.
- **Quién lo arma**: es estático y aburrido; necesita dinámica.
- **¿Qué necesita tu PyME?**: se ve raro; necesita algo mejor.

Respuesta:

| Capítulo | Cambio |
| --- | --- |
| Video | Clips provisorios de **Mixkit** (licencia gratuita, uso comercial, sin atribución), enlazados a 720p en `src/data/media.json`. Se usan con el componente compartido `src/components/capitulos/Video.astro`, que reproduce solo en pantalla y usa el póster como respaldo. |
| Hero | Secuencia de imágenes y video dentro de la máscara, más una fila de los 4 servicios abajo (como la fila de productos de Delta). |
| Collage | Más piezas y chips con hora (como los chips de año de Delta). |
| Ciclo | Fondo de video, íconos en el recorrido, una mini interfaz por etapa y un scroll fijo más corto. |
| Demos | **Sin scroll fijo.** Carrusel nativo que se arrastra y tiene flechas, más una banda de fotos en movimiento. |
| Sobre mí | Lista del stack interactiva que cambia la imagen o el video, y una frase rotativa. |
| Diagnóstico | Rediseño al estilo del quiz de Delta: el campo lleno de piezas flotantes, el botón "Empezar" y el cuestionario con opciones visuales. |
| Proceso y cierre | Artefactos por paso, video de fondo en el cierre y la hora de Córdoba en vivo. |
