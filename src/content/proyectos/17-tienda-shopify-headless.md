---
title: "Tienda Shopify → Headless"
slug: "tienda-shopify-headless"
cliente: "Moda Urbana BsAs"
categoria: "ecommerce"
descripcion: "Migración de tienda Shopify a headless con Astro + Shopify Storefront API, manteniendo el panel admin de Shopify."
problema: "Tienda de indumentaria urbana con 400 productos. Shopify les funcionaba pero querían velocidad sub-1s y un front que reflejara su marca sin las restricciones del tema."
resultado: "Headless: Shopify como backend (productos, stock, pedidos, checkout), Astro como front. Velocidad bajó a 0.7s, diseño 100% custom, checkout intacto."
stack: ["Astro", "TypeScript", "Shopify Storefront API", "Tailwind CSS", "Vercel"]
fecha: 2025-09-10
duracion: "6 semanas"
role: "Migración headless + desarrollo"
repo: "https://github.com/MarcialFantini/moda-urbana-headless"
tags: ["ecommerce", "shopify", "headless", "performance"]
featured: false
metricas:
  - { label: "Productos migrados", value: "400" }
  - { label: "Tiempo de carga antes", value: "2.8s" }
  - { label: "Tiempo de carga después", value: "0.7s" }
  - { label: "Conversión mobile", value: "+34%" }
---

Marca de indumentaria urbana con showroom en Palermo y tienda Shopify online. El tema que usaban tardaba 2.8s en cargar mobile. La dueña quería velocidad sub-1s sin perder la comodidad del panel admin de Shopify.

## El problema

Shopify es excelente como backend: productos, stock, checkout, fulfillment. Pero el front con temas de Shopify sufre: JS pesado, imágenes no optimizadas, fonts externas. Para mantener la marca necesitaban un front custom.

## La solución

Headless commerce con Astro + Shopify Storefront API:

- Shopify se mantiene como backend (productos, stock, pedidos, checkout nativo)
- Astro consume la Storefront API vía GraphQL con caché en build
- Imágenes servidas desde el CDN de Shopify con srcset automático
- Webhooks sincronizan el rebuild cuando hay cambios de producto
- Checkout sigue siendo Shopify (no reinventar la rueda)

## Resultado

Tiempo de carga mobile bajó de 2.8s a 0.7s. Lighthouse subió de 62 a 98. Conversión mobile subió 34%. La dueña sigue manejando productos desde el panel Shopify que ya conoce. Cero disrupción operativa.