# Mejoras de marca y motion — las 8 demos

> Fecha: 2026-11-19. Reemplaza el alcance de los briefs `docs/briefs/demo-*.md` (que eran para construir desde cero): estos parten de lo que ya existe y lo llevan a nivel de presentación a cliente.

## Objetivo

Cada demo tiene que provocar un "wow" en los primeros 10 segundos frente a un cliente B2B (dueño, gerente de operaciones), y sostenerlo cuando la recorre. El wow sale de dos cosas, en este orden:

1. **Marca creíble**: la empresa ficticia parece una empresa real con identidad propia (logo, paleta, tipografía, tono), no una plantilla.
2. **Motion profesional**: el sistema "se ve funcionar". Los datos se mueven con intención, cada animación explica algo (llega un pedido, baja el stock, se sincroniza un canal) y nada se mueve por decorar.

La utilidad real ya está validada; esta etapa es de presentación.

## Las 8 demos

| # | Carpeta | Empresa ficticia | Qué le muestra al cliente | En vivo | Brief |
|---|---|---|---|---|---|
| 03 | `03-inventario-distribuidora` | Distribuidora del Sur | Stock por depósito en un plano vivo | https://03-inventario-distribuidora.vercel.app | [inventario-distribuidora.md](inventario-distribuidora.md) |
| 10 | `10-dashboard-ventas` | Mayorista Central | Las ventas del mes en una pantalla | https://10-dashboard-ventas.vercel.app | [dashboard-ventas.md](dashboard-ventas.md) |
| 05 | `05-tracker-pedidos` | Logística Andina | El cliente sigue su pedido sin llamar | https://05-tracker-pedidos.vercel.app | [tracker-pedidos.md](tracker-pedidos.md) |
| 18 | `18-integracion-mercadolibre-erp` | Distribuidora del Litoral | Un solo stock para tres canales de venta | Deploy roto (404) | [integracion-mercadolibre-erp.md](integracion-mercadolibre-erp.md) |
| 12 | `12-automatizacion-crm-whatsapp` | Recepta · Clínica San Martín | La recepción que trabaja sola | Sin deploy (404) | [automatizacion-crm-whatsapp.md](automatizacion-crm-whatsapp.md) |
| 09 | `09-ecommerce-marca` | Río Luján | Tienda propia con stock y producción conectados | https://09-ecommerce-marca.vercel.app | [ecommerce-marca.md](ecommerce-marca.md) |
| 02 | `02-catalogo-ferreteria` | Ferretería El Tornillo | Catálogo con stock y presupuesto por WhatsApp | https://02-catalogo-ferreteria.vercel.app | [catalogo-ferreteria.md](catalogo-ferreteria.md) |
| 06 | `06-blog-consultora` | Consultora Norte | Contenido para industria, con calculadora de OEE | https://06-blog-consultora.vercel.app | [blog-consultora.md](blog-consultora.md) |

Orden de ejecución recomendado: 03 → 10 → 18 → 05 → 12 → 09 → 02 → 06. Primero los que venden "software de operación", que es lo que ofrece la landing.

## Prerrequisitos (antes del primer tramo)

- **02**: tiene unos 81 cambios sin commitear. Resolverlos (commit o descarte) antes de tocar nada.
- **18** y **12**: no tienen deploy (la URL de Vercel da 404). Desplegarlos es el primer tramo de sus planes.
- Cada demo se trabaja en su propia carpeta y su propio repo, en una rama `feat/brand-motion`.

## Estándar compartido

Cada demo conserva su identidad propia: no se unifican paletas ni tipografías entre demos (son "clientes" distintos). Lo que sí se comparte es el nivel y estas reglas.

### Marca
- Logo o wordmark propio en SVG, legible a 24 px de alto y en la pestaña del navegador (favicon).
- Un solo color de acento por demo; el resto, neutros de la misma familia (fríos o cálidos, no ambos).
- Escala tipográfica de 5 tamaños como máximo. Números con cifras tabulares.
- La marca "Demo" siempre visible, sin que tape contenido.
- Datos ficticios con aspecto real: cifras irregulares, nombres locales, formatos argentinos ($ 1.284.300, 18/11/2026).

### Motion
- **Tokens base** (cada brief puede ajustarlos, pero tiene que nombrarlos):
  - `--dur-micro: 160ms` para hover y press.
  - `--dur-ui: 280ms` para cambios de estado.
  - `--dur-scene: 700ms` para entradas de bloques.
  - `--dur-hero: 1600ms` como máximo para la intro completa.
  - `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`.
  - `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`.
- **Cada movimiento cuenta un dato.** Si al quitar una animación no se pierde información, sobra.
- **La intro termina en 1,6 s como máximo** y nunca bloquea la interacción.
- **Rendimiento**: solo `transform` y `opacity`, 60 fps, CLS 0. Los loops se pausan fuera de pantalla y con la pestaña oculta.
- **`prefers-reduced-motion`** muestra el estado final completo, sin animar.

### Modo vitrina
- Se activa con `?vitrina=1`. Donde ya existe `?showcase` (03, 05, 09, 10, 12, 18 según cada brief), `?vitrina=1` es un alias: no se quita lo que hay. Recorre los mejores momentos en un loop de 30 a 60 s, con datos deterministas (misma semilla en cada vuelta).
- Tipografía y contraste legibles a 2 metros de distancia: pensado para mostrar en una notebook o en una TV durante una reunión.
- Sin interacción requerida; cualquier click o tecla lo detiene y devuelve el control.

### Entregables por demo
- Captura de primera pantalla a 1440×900 (reemplaza la de `11-marca-personal-marcial-fantini/src/assets/capturas/<id>.jpg`).
- Video de 10 s en 16:9 y un corte vertical de 9:16, grabados desde el modo vitrina.
- Imagen OG de 1200×630.
- Todo lo de cada brief específico.

## Cómo vuelve a la landing

Cuando una demo cumple sus criterios de aceptación:

1. Se reemplaza su captura en `src/assets/capturas/<id>.jpg` (mismo nombre, 1440×900).
2. Si está desplegada, su URL va en `url:` del frontmatter de `src/content/proyectos/<nn>-<id>.md`.
3. El video de 10 s queda disponible para el capítulo Demos del home, cuando se decida reemplazar las interfaces dibujadas por videos reales.

## Criterios de aceptación comunes

- `pnpm build` y `pnpm astro check` sin errores.
- Sin errores de consola. CLS 0. LCP por debajo de 2,5 s en el deploy.
- Se ve bien a 1440, 1024 y 390 px, sin scroll horizontal.
- `prefers-reduced-motion` muestra todo el contenido en su estado final.
- El modo vitrina corre 3 vueltas seguidas sin degradarse (sin acumular listeners ni memoria).
- La URL en vivo responde 200, si la demo está desplegada.

## Forma de trabajo

- Tramos de 15 minutos como máximo, cada uno termina en algo visible o medible (una captura, un clip grabado, una métrica).
- Si un tramo llega a 15 minutos sin nada que mostrar, se corta, se reporta lo que hay y se cambia de enfoque.
