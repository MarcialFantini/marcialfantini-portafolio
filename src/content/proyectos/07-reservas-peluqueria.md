---
title: "Reservas Peluquería Las Tijeras"
slug: "reservas-peluqueria"
cliente: "Peluquería Las Tijeras"
descripcion: "Landing con sistema de reservas online, selección de servicio + profesional + horario, integrado a Google Calendar."
problema: "Peluquería de tres sucursales con sistema de reservas manual por WhatsApp. Saturación del canal, dobles turnos confirmados, clientes esperando 30 minutos en sucursal."
resultado: "Sistema de reservas online con disponibilidad real por profesional y sucursal, confirmación automática y recordatorio 24h antes."
stack: ["Astro", "TypeScript", "Tailwind CSS", "Cal.com API", "Google Calendar API"]
fecha: 2025-09-22
duracion: "3 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/reservas-peluqueria"
tags: ["reservas", "calendly", "peluqueria"]
featured: false
metricas:
  - { label: "Sucursales", value: "3" }
  - { label: "Servicios disponibles", value: "12" }
  - { label: "Profesionales", value: "8" }
  - { label: "Reservas online / total", value: "70%" }
---

Red de peluquerías de barrio con tres sucursales en CABA. Cada una con cuatro profesionales. La dueña manejaba turnos por WhatsApp Business, respondía entre 8 y 22hs, perdía mensajes, confirmaba turnos que después nadie respetaba.

## El problema

El sistema manual saturaba a la dueña, generaba dobles turnos confirmados (cliente reserva en una sucursal y otro en otra), y hacía que los clientes esperaran 30+ minutos en la silla.

## La solución

Integré un sistema de reservas online con:

- Catálogo de servicios con duración
- Selección de profesional por sucursal
- Disponibilidad en tiempo real vía Cal.com
- Confirmación automática con email + WhatsApp
- Recordatorio 24h antes
- Sync con Google Calendar de cada profesional

## Resultado

70% de las reservas ahora llegan online sin intervención humana. La dueña pasó de responder mensajes de WhatsApp a ocuparse de crecer el negocio. Los tiempos de espera en sucursal bajaron al promedio de la industria.
