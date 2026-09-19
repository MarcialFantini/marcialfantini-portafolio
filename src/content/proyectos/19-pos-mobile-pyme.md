---
title: "POS Mobile para PyME"
slug: "pos-mobile-pyme"
cliente: "Dietética La Esquina"
categoria: "panel"
descripcion: "Sistema POS mobile para dietética con facturación AFIP, control de stock y reportes de venta diarios."
problema: "Dietética con 2 sucursales y 600 SKUs. Gestionaban ventas con una caja registradora tradicional sin integración al stock ni facturación electrónica."
resultado: "POS mobile-first con facturación AFIP automática, control de stock en tiempo real y reporte de ventas diarias para el dueño."
stack: ["Astro", "TypeScript", "SQLite", "AFIP SDK", "PWA"]
fecha: 2026-02-02
duracion: "4 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/pos-mobile-dietetica"
tags: ["pos", "afip", "mobile", "pwa"]
featured: false
metricas:
  - { label: "SKUs administrados", value: "600" }
  - { label: "Sucursales integradas", value: "2" }
  - { label: "Facturación AFIP", value: "automática" }
  - { label: "Tiempo de venta", value: "<8s" }
---

Dietética de barrio con 2 sucursales y 600 SKUs (alimentos saludables, suplementos, cosmética natural). La dueña manejaba la caja registradora y la facturación AFIP en planillas separadas. AFIP le rechazó 8 facturas el primer mes por errores de carga.

## El problema

La caja registradora no hablaba con nada. Stock se actualizaba a ojo. AFIP se facturaba en otra pantalla, con datos que se copiaban a mano. Errores eran diarios. La dueña perdía 2 horas por día conciliando.

## La solución

POS mobile-first instalable como PWA:

- Catálogo de productos con búsqueda por nombre o código de barras
- Venta en menos de 8 segundos (búsqueda → cantidad → cobro)
- Facturación AFIP automática al confirmar venta
- Stock actualizado en tiempo real entre las 2 sucursales
- Reporte diario de ventas enviado por email al dueño

## Resultado

Errores AFIP: 0. Tiempo de venta bajó de 30s a 8s. Conciliación diaria pasó de 2 horas a 10 minutos de revisión. La dueña ahora consulta el reporte desde su celular en cualquier momento.