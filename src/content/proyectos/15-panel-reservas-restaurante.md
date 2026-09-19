---
title: "Panel de Reservas Restaurante"
slug: "panel-reservas-restaurante"
cliente: "Restaurante Donde Marino"
categoria: "reservas"
descripcion: "Panel interno para gestionar reservas de un restaurante con 80 cubiertos por turno, integrado a su sistema de facturación."
problema: "Restaurante con 80 cubiertos por turno y 3 turnos por noche. Gestionaban reservas por planilla compartida en Google Sheets, con constantes duplicaciones y pérdida de turnos."
resultado: "Panel interno con mapa de mesas, gestión de turnos, lista de espera automática y check-in digital. Integrado con el sistema de facturación AFIP."
stack: ["Astro", "TypeScript", "SQLite", "Node API", "AFIP SDK"]
fecha: 2025-11-30
duracion: "5 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/donde-marino"
tags: ["reservas", "restaurante", "panel"]
featured: false
metricas:
  - { label: "Cubiertos gestionados", value: "240/día" }
  - { label: "Duplicaciones eliminadas", value: "100%" }
  - { label: "Tiempo de check-in", value: "<10s" }
  - { label: "Lista de espera automática", value: "Sí" }
---

Restaurante de cocina de mar en Mar del Plata con 80 cubiertos por turno, 3 turnos por noche (21h, 23h, 01h). Antes de mi panel, las reservas se anotaban en una planilla Google compartida entre 4 mozos y la dueña. Sobregulación, frecuentes duplicaciones.

## El problema

La planilla no tenía restricciones. Cualquiera podía escribir encima de cualquier turno. Una reserva confirmada se "borraba" porque alguien la pisaba. La lista de espera era mental — si un cliente cancelaba, el siguiente se enteraba 10 minutos tarde.

## La solución

Construí un panel interno con:

- Mapa visual de mesas (4 zonas, 18 mesas) con estado en tiempo real
- Gestión de turnos con validación anti-duplicación
- Lista de espera con orden FIFO y aviso automático al siguiente
- Check-in digital con QR
- Integración con AFIP para facturar automáticamente al confirmar check-in
- App móvil para mozos (PWA instalable)

## Resultado

Duplicaciones eliminadas 100%. Tiempo promedio de check-in: 10 segundos (antes 90 segundos). Lista de espera automática liberó a la dueña de coordinar manualmente. 240 cubiertos gestionados por día sin errores.