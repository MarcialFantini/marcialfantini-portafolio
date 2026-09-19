---
title: "Astro vs Next.js para PyMEs: por qué elijo Astro en 2026"
description: "Comparación honesta entre Astro y Next.js para proyectos chicos y medianos. Cuándo cada uno tiene sentido, y por qué para el 90% de mis clientes elijo Astro."
pubDate: 2026-01-22
author: "Marcial Fantini"
category: "desarrollo"
readingTime: 7
tags: ["astro", "next", "performance", "stack"]
featured: true
---

Trabajo con ambos. Para mí, Next.js es excelente; para la mayoría de mis clientes (PyMEs argentinas con sitios de marketing, catálogos y SaaS incipientes), Astro es la decisión correcta. Explico por qué con números reales de proyectos entregados.

## TL;DR

| Criterio | Astro | Next.js |
|----------|-------|---------|
| Bundle inicial típico | 15-40 KB | 90-180 KB |
| TTFB promedio | 80-200 ms | 200-450 ms |
| Lighthouse mobile promedio | 95-100 | 75-92 |
| Hosting más barato posible | Cloudflare Pages (gratis) | Vercel free tier con límites |
| Curva de aprendizaje | Baja si venís de HTML | Media-alta |

## Qué cambió para mí

Vengo de Next.js. Lo usé en seis proyectos. El framework es extraordinario: SSR, ISR, RSC, ruteo anidado, una de las mejores DX que existen. Pero empecé a notar un patrón preocupante.

Los proyectos Next.js de mis clientes pequeños tenían tres problemas recurrentes:

1. **Build times largos** que se comían el free tier de Vercel en 6 meses.
2. **Cold starts** en funciones serverless que afectaban la conversión de formularios.
3. **Dependencias grandes** (`next/image`, `next/router`, `next/head`) que pesaban innecesariamente en sitios donde el 80% del contenido es estático.

Probé Astro en un proyecto mediano y la diferencia fue notoria desde el día uno. Bundle inicial de 28 KB contra 174 KB. TTFB debajo de 100 ms en Cloudflare Pages. Cero JavaScript del framework, solo el de los componentes interactivos puntuales (formulario, menú móvil).

No era fanboy-ismo. Eran números que mi cliente podía ver en su Search Console.

## Cuándo elijo Next.js

Sigo recomendando Next.js para:

- Aplicaciones con mucha interactividad de cliente (dashboards complejos, editores, SaaS)
- Equipos grandes que ya estandarizaron React en su stack
- Proyectos con autenticación compleja + APIs internas densas
- Casos donde necesitás SSR con datos por usuario en cada request

Si tu producto es esencialmente una **aplicación** (no un sitio), Next.js sigue siendo la mejor opción del ecosistema React. No compite con Astro, apunta a cosas distintas.

## Cuándo elijo Astro

Astro gana cuando:

- El 80%+ del contenido es marketing, blog, catálogo, documentación
- SEO y rendimiento son un KPI (no un nice-to-have)
- El equipo del cliente no es técnico y necesita un sitio que puedan actualizar sin mí
- El presupuesto de hosting es ajust (Cloudflare Pages free tier aguanta tráfico alto)
- Hay pocas superficies interactivas que justifiquen hidratación

El último punto es clave. La hidratación parcial de Astro (`client:load`, `client:idle`, `client:visible`) te permite mandar **cero JS** por defecto y solo hidratar lo que necesita interactividad. Una landing institucional con un formulario y un mapa puede pesar menos de 30 KB.

## Lo que mis clientes notan

La diferencia para un dueño de PyME no es teórica. Tres cosas concretas que aparecen en mi diálogo con ellos:

1. **"Mi página carga rápido"**: feedback literal de un cliente de ferretería después de migrar de WordPress a Astro. Antes 6 segundos, ahora 1.2.
2. **"Mi factura de hosting bajó a cero"**: pasé de pagar USD 25/mes a pagar cero gracias al free tier de Cloudflare.
3. **"Recibo consultas por WhatsApp"**: mejora de posicionamiento por Core Web Vitals verdes + SEO técnico bien hecho.

Para una PyME, estos wins son concretos. Para una startup con producto de producto, son irrelevantes. Por eso la decisión es contextual.

## Qué me hizo cambiar de opinión

El honest answer: pasé 14 meses con Next.js, entregué sitios técnicamente impecables, y noté que los clientes no diferenciaban "Next.js" de cualquier otra cosa. Me pedían cosas que solo puedo describir como "mágica": "que aparezca en Google", "que no tarde en cargar". Astro me dio una herramienta concreta para entregar eso sin pelearme con la herramienta.

Hoy, si me preguntás para tu estudio, tu marca o tu catálogo PyME: Astro. Si me preguntás para una app con login y CRUD pesado: Next.js.

Si querés discutir el stack de tu próximo proyecto, [escribime](/contacto).
