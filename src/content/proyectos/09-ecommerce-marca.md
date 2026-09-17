---
title: "E-commerce Marca Propia"
slug: "ecommerce-marca"
cliente: "Muebles Río Luján"
descripcion: "E-commerce full-stack con catálogo administrable, checkout Stripe, gestión de stock y envíos a todo el país."
problema: "Marca de muebles de diseño que fabricaba a pedido. Querían vender directo al público sin pasar por showroom, manteniendo el control del stock por unidad de producción."
resultado: "E-commerce completo con catálogo navegable, variantes por producto, checkout Stripe, gestión de stock sincronizada con producción y panel de envíos."
stack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Vercel"]
fecha: 2025-11-18
duracion: "10 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/ecommerce-marca"
tags: ["ecommerce", "stripe", "nextjs"]
featured: false
metricas:
  - { label: "Productos en catálogo", value: "60" }
  - { label: "Pasarela integrada", value: "Stripe" }
  - { label: "Tiempo de producción", value: "15 días" }
  - { label: "Conversión mobile", value: "3.1%" }
---

Marca de muebles de diseño fabricada en Tucumán. Vendían exclusivamente por showroom en Buenos Aires. Querían expandir a todo el país sin abrir locales físicos y manteniendo el control sobre qué se produce y cuándo (fabricación a pedido, sin stock).

## El problema

Su modelo de negocio es fabricación bajo pedido: cada mueble toma 15 días en producirse. Necesitaban un e-commerce que respetara eso, no que vendiera stock que después no podían cumplir.

## La solución

Construí un e-commerce en Next.js con:

- Catálogo administrable con variantes (color, tela, tamaño)
- Checkout Stripe en 2 pasos
- Sistema de preventa: cliente paga 50% al confirmar, 50% antes de despachar
- Panel admin para gestión de pedidos y stock de materia prima
- Cálculo de envío por código postal

## Resultado

60 productos en catálogo, conversión mobile de 3.1%, ticket promedio USD 1.200. La marca pasó de 8 ventas/mes en showroom a 24 ventas/mes sumando el canal online. Sin abrir locales nuevos.
