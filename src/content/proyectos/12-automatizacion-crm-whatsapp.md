---
title: "Automatización CRM WhatsApp"
slug: "automatizacion-crm-whatsapp"
cliente: "Clínica San Martín"
categoria: "integracion"
descripcion: "Integración WhatsApp Business API + HubSpot CRM para seguimiento automático de leads y recordatorios de turnos."
problema: "Clínica con 12 especialidades y 40 profesionales. Gestionaban recordatorios de turnos y seguimiento de consultas por WhatsApp manual, con una recepcionista dedicada 8 horas al día a esa tarea."
resultado: "Integración WhatsApp Business API con HubSpot. Recordatorios automáticos 24h antes, confirmación con un click, y derivación de leads nuevos al especialista correcto en menos de 5 minutos."
stack: ["Node.js", "WhatsApp Business API", "HubSpot API", "PostgreSQL"]
fecha: 2025-12-20
duracion: "4 semanas"
role: "Integración + automatización"
repo: "https://github.com/MarcialFantini/clinica-whatsapp-crm"
tags: ["whatsapp", "crm", "automatizacion", "salud"]
featured: false
metricas:
  - { label: "Recordatorios automatizados", value: "1.200/mes" }
  - { label: "Tasa de confirmación", value: "78%" }
  - { label: "Horas recepcionista liberadas", value: "30/sem" }
  - { label: "Leads respondidos en <5min", value: "92%" }
---

Clínica privada en Rosario con 12 especialidades. La recepcionista dedicaba 8 horas diarias a mandar recordatorios de turnos por WhatsApp y responder consultas que llegaban por el mismo canal. El ausentismo a turnos era del 22%.

## El problema

El flujo era completamente manual. La recepcionista copiaba los turnos del sistema en un Excel, abría WhatsApp Web, mandaba cada mensaje uno por uno, esperaba respuesta, marcaba en una planilla. 8 horas, 40 profesionales, 1.200 turnos por mes.

## La solución

Integración completa WhatsApp Business API + HubSpot CRM:

- Templates pre-aprobados por Meta para recordatorios y confirmaciones
- Sincronización bidireccional con el sistema de turnos de la clínica
- Reglas de derivación: la especialidad del turno determina qué profesional recibe el lead
- Dashboard en HubSpot con métricas de confirmación y respuesta

## Resultado

Tasa de confirmación de turnos subió de 38% a 78%. La recepcionista pasó de 8 horas de WhatsApp a 30 horas semanales totales. Los leads nuevos se responden en menos de 5 minutos. El ausentismo bajó al 7%.