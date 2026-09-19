---
title: "Mi setup para auditar un sitio web en 30 minutos (y cobrar por eso)"
description: "El flujo exacto que uso cuando un cliente me paga una auditoría de performance: qué mido, en qué orden, qué herramientas uso y cómo entrego el reporte."
pubDate: 2026-02-18
category: "desarrollo"
readingTime: 6
tags: ["performance", "auditoria", "tools", "lighthouse"]
featured: true
---

La auditoría de 30 minutos es uno de mis servicios más rentables. Cuesta poco tiempo y le da al cliente una lectura concreta que justifica el proyecto siguiente. Si todavía no cobrás por esto, te dejo el flujo exacto que uso.

## Antes de la llamada

Tres cosas que preparo en 15 minutos antes de la reunión:

- Corro Lighthouse en mobile y desktop, lo descargo como JSON.
- Mido con GTmetrix desde un datacenter de la región (São Paulo para Latam).
- Abro Search Console si el cliente me pasó acceso.

Sin acceso a Search Console, no puedo hablar de CTR ni de keywords. Lo aclaro en la propuesta: la auditoría sin Search Console es limitada.

## Durante la llamada

Estructura de los 30 minutos:

- **5 min**: el cliente cuenta qué le duele. No interrumpo. Anoto.
- **10 min**: revisamos juntos el sitio en Lighthouse. Identifico los 3 quick wins.
- **10 min**: abrimos DevTools y miramos waterfall de network. Esto es donde aparece el problema real (terceros bloqueando, JS sync, imágenes sin optimizar).
- **5 min**: resumen verbal. Lo que entrego al día siguiente es lo que acabo de decir.

## Después de la llamada

Reporte PDF de 4 páginas:

1. Resumen ejecutivo con 3 problemas rankeados por impacto.
2. Métricas antes/después (si el cliente las tenía).
3. Plan de acción priorizado: quick wins (esta semana) vs estructurales (próximo sprint).
4. Cotización cerrada para arreglarlo, si el cliente quiere.

## Herramientas que uso

- **Lighthouse** + Chrome DevTools para Core Web Vitals.
- **GTmetrix** desde datacenter de la región (importa para TTFB).
- **PageSpeed Insights** para corroborar datos que da Lighthouse.
- **WebPageTest** para waterfall avanzado cuando hay JS bloqueante.
- **Search Console** + **Ahrefs Webmaster Tools** (gratis) para SEO técnico.

No pago por herramientas premium de auditoría. Las gratuitas me dan el 90% de la información que necesito.

## Lo que no hago

- No prometo posiciones en Google. Mido performance técnico, no SEO predictivo.
- No entrego reporte sin haber pasado por el sitio. La auditoría es humana.
- No audito sin reunión previa. El cliente que me manda "audita mi sitio y mandame un PDF" no es cliente, es ruido.

## Cobro

La auditoría express la cobro USD 280. Toma 1 hora efectiva más la reunión. Es el mejor ratio hora/ingreso que tengo porque el costo marginal es bajo y el cliente ve valor inmediato.

Si te interesa armar un servicio así, [escribime](/contacto) y te paso la plantilla del PDF.