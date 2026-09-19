---
title: "Tracker Pedidos Mayoristas"
slug: "tracker-pedidos"
cliente: "Logística Patagónica"
categoria: "panel"
descripcion: "App interna para que clientes mayoristas rastreen el estado de sus pedidos en tiempo real."
problema: "Operador logístico con 80 clientes mayoristas. El call center recibía 200 llamadas por día preguntando 'dónde está mi pedido'."
resultado: "App web con login por cliente, listado de pedidos activos, estado por etapa (preparado, despachado, en tránsito, entregado) y notificación automática al cambiar estado."
stack: ["Astro", "TypeScript", "Node API", "SQLite", "WebSockets"]
fecha: 2025-07-08
duracion: "5 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/tracker-pedidos"
tags: ["logistica", "tracker", "b2b"]
featured: false
metricas:
  - { label: "Clientes con login", value: "80" }
  - { label: "Estados por pedido", value: "5" }
  - { label: "Llamadas al call center", value: "-60%" }
  - { label: "Actualización", value: "tiempo real" }
---

Operador logístico de la Patagonia que mueve mercadería entre Trelew, Comodoro y Bariloche. Antes de la app, el call center era la única forma de saber dónde estaba un envío. Llegaban 200 llamadas diarias y la mitad eran exactamente la misma pregunta.

## El problema

El call center estaba saturado con preguntas repetitivas. Los clientes mayoristas perdían paciencia esperando respuestas, y los operadores perdían tiempo subiendo planillas que nadie leía.

## La solución

Construí una app web con:

- Login por cliente (token + magic link)
- Listado de pedidos activos con estado por color
- Cambio de estado desde panel admin disparado por la operación
- Notificación email automática al transicionar
- Histórico de cada pedido con timestamps

## Resultado

Las llamadas al call center bajaron 60% en 90 días. Los clientes consultan ellos mismos desde su oficina o celular. La operación invirtió las horas liberadas del call center en crecer la flota.