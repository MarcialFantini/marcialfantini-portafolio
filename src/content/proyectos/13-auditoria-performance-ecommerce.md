---
title: "Auditoría Performance E-commerce"
slug: "auditoria-performance-ecommerce"
cliente: "Tienda Outdoor Patagonia"
categoria: "otro"
descripcion: "Auditoría técnica completa + plan de remediación priorizado para un e-commerce con 4s de tiempo de carga mobile."
problema: "E-commerce de indumentaria outdoor con catálogo de 800 productos. Lighthouse mobile en 38, tasa de rebote 71%, conversión mobile 0.4%. Sabían que algo andaba mal pero no qué."
resultado: "Reporte ejecutivo con 12 problemas rankeados por impacto, plan de remediación en 3 sprints, y un quick win que mejoró LCP de 4s a 1.5s en la primera semana."
stack: ["Astro", "Lighthouse", "WebPageTest", "Cloudflare"]
fecha: 2026-01-08
duracion: "2 semanas"
role: "Auditoría + consultoría técnica"
tags: ["auditoria", "performance", "ecommerce", "consultoria"]
featured: false
metricas:
  - { label: "Lighthouse mobile antes", value: "38" }
  - { label: "LCP después quick win", value: "1.5s" }
  - { label: "Problemas rankeados", value: "12" }
  - { label: "Sprints de remediación", value: "3" }
---

Tienda de indumentaria outdoor con sede en Bariloche y envíos a todo el país. 800 productos, 6 años online, facturando USD 60k/mes. Sabían que el sitio cargaba lento pero no sabían por dónde empezar.

## El problema

Lighthouse mobile 38. LCP 4.2s. Tasa de rebote 71%. Conversión mobile 0.4%. El cliente sentía que perdía ventas pero no tenía diagnóstico concreto. El equipo técnico anterior había tirado la toalla.

## La solución

Auditoría de 2 semanas con metodología propia:

- Semana 1: profiling con WebPageTest + GTmetrix + DevTools. Mapa de issues rankeados por impacto.
- Semana 2: remediación del quick win #1 (imágenes sin lazy load + CSS crítico bloqueando).
- Entrega: reporte ejecutivo + roadmap priorizado + cotización para los 3 sprints siguientes.

## Resultado

Quick win: LCP bajó de 4.2s a 1.5s en 5 días. Conversión mobile subió a 0.9%. El cliente contrató los 3 sprints siguientes por USD 8.400. Lighthouse final después de remediación completa: 94.