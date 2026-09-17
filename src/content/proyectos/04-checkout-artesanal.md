---
title: "Checkout Artesanal Lo de Marta"
slug: "checkout-artesanal"
cliente: "Lo de Marta — Panificados Artesanales"
descripcion: "Sitio + checkout simple con Mercado Pago, catálogo de 30 productos y envíos a CABA y GBA."
problema: "Panificadora artesanal que vendía por Instagram y WhatsApp. Querían profesionalizar la venta online sin perder el trato personal que justifica el precio premium."
resultado: "Sitio institucional con catálogo navegable, checkout integrado a Mercado Pago, y cálculo de envíos por código postal."
stack: ["Astro", "TypeScript", "Tailwind CSS", "Mercado Pago SDK"]
fecha: 2025-06-12
duracion: "4 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/checkout-artesanal"
tags: ["ecommerce", "mercadopago", "artesanal"]
featured: false
metricas:
  - { label: "Productos en catálogo", value: "30" }
  - { label: "Pasarela integrada", value: "Mercado Pago" }
  - { label: "Pasos de checkout", value: "2" }
  - { label: "Tiempo de carga", value: "0.8s" }
---

Panificadora de Nordelta que vende facturas, panes de molde y budines artesanales. Hacen todo a mano, sin conservantes, y eso justifica un precio premium. Querían vender online sin perder la sensación de "compra a un negocio chico".

## El problema

Su canal era Instagram + WhatsApp. Funcionaba pero saturaba: respondían mensajes hasta las 22, perdían pedidos los fines de semana, no tenían métricas reales de qué se vendía. Querían profesionalizar sin volverse una "panificadora industrial con delivery".

## La solución

Construí un sitio sobrio con:

- Catálogo de 30 productos con fotos propias
- Checkout en 2 pasos (datos + pago)
- Integración directa con Mercado Pago (sin plugin)
- Cálculo de envíos por código postal via API propia
- Página de "Mi pedido" con link de seguimiento

## Resultado

El checkout carga en 0.8 segundos, pasa Core Web Vitals verdes, y la conversión mobile es 4.2% — bastante alta para e-commerce de nicho. La dueña me dijo que ahora cierra pedidos a las 3 de la mañana que antes se perdían.
