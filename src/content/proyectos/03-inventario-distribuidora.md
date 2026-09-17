---
title: "Inventario Distribuidora del Sur"
slug: "inventario-distribuidora"
cliente: "Distribuidora del Sur SRL"
descripcion: "Sistema de inventario interno con stock por depósito, alertas de reposición y reportes de rotación."
problema: "Distribuidora con tres depósitos físicos y doscientos clientes. Tenían stock en planillas separadas que se desactualizaban cada semana. Perdían ventas por no saber qué tenían disponible."
resultado: "Panel interno con stock consolidado por depósito, alertas automáticas de reposición, y reportes semanales de rotación descargables."
stack: ["Astro", "TypeScript", "SQLite", "Node API"]
fecha: 2025-05-25
duracion: "6 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/inventario-distribuidora"
tags: ["inventario", "b2b", "panel"]
featured: true
metricas:
  - { label: "Depósitos consolidados", value: "3" }
  - { label: "SKUs administrados", value: "850" }
  - { label: "Reportes automáticos", value: "4" }
  - { label: "Tiempo respuesta stock", value: "real-time" }
---

Distribuidora de artículos de librería y escolar con tres depósitos en CABA y GBA. Manejaban 850 SKUs y atendían 200+ colegios y librerías mayoristas. El problema clásico de muchas PyMEs en crecimiento: planillas que no se hablan entre sí.

## El problema

El dueño tenía cuatro planillas Excel abiertas en simultáneo: una por depósito y una consolidada que armaba los viernes a mano cruzando datos. Las cifras cambiaban entre el lunes y el jueves. Perdían ventas por cotizar stock que ya no tenían.

## La solución

Construí un panel interno con:

- Carga manual de movimientos (entrada / salida / transferencia)
- Consolidación automática por depósito y SKU
- Búsqueda rápida por código o descripción
- Alertas de reposición configurables por SKU
- Reportes semanales descargables (rotación, stock crítico, ventas por categoría)

## Resultado

Las decisiones de compra pasaron de "ir el viernes a contar" a "ver el reporte del lunes". Las ventas perdidas por cotizar stock inexistente bajaron cerca del 80%. El cliente consolidó todo en una sola fuente de verdad.
