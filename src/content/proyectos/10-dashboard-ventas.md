---
title: "Dashboard de Ventas Mayoristas"
slug: "dashboard-ventas"
cliente: "Distribuidora Cuyo"
descripcion: "Dashboard interno con KPIs de ventas, cohortes de clientes, productos más vendidos y comparativa interanual."
problema: "Distribuidora con 30 vendedores en ruta. Tomaban decisiones con datos del día anterior en Excel, sin poder cruzar cohortes ni comparativas."
resultado: "Dashboard en tiempo real con KPIs por vendedor, top productos, cohortes y comparativa YoY. Accesible desde mobile."
stack: ["Astro", "TypeScript", "D3.js", "SQLite", "Node API"]
fecha: 2025-12-12
duracion: "8 semanas"
role: "Diseño + desarrollo full-stack + data viz"
repo: "https://github.com/MarcialFantini/dashboard-ventas"
tags: ["dashboard", "data-viz", "b2b"]
featured: true
metricas:
  - { label: "Vendedores en ruta", value: "30" }
  - { label: "KPIs en tiempo real", value: "12" }
  - { label: "Fuentes de datos integradas", value: "3" }
  - { label: "Latencia de actualización", value: "<5min" }
---

Distribuidora mayorista de bebidas con 30 vendedores en ruta por Mendoza y San Juan. La gerencia comercial tomaba decisiones con datos de hasta 48 horas de atraso, en planillas que cada vendedor cargaba distinto.

## El problema

Los datos llegaban tarde y desorganizados. No se podía cruzar información de vendedores (¿quién vendió más vino?, ¿quién atendió mejor al cliente X?). Las decisiones de premio, stock y cobertura eran a ojo.

## La solución

Construí un dashboard interno con:

- KPIs principales: ventas hoy, mes, comparativa YoY
- Tabla de vendedores con ranking y métricas individuales
- Top productos por línea y zona
- Gráficos de cohortes de clientes
- Integración con su sistema de facturación + planilla de vendedores
- Mobile-first para que el gerente consulte desde el auto

## Resultado

Los vendedores recibieron feedback basado en datos en vez de intuición. La gerencia detectó tres cohortes de clientes con potencial no atendido, lo que generó USD 18.000 de revenue incremental en 90 días.
