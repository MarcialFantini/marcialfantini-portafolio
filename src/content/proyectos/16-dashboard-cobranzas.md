---
title: "Dashboard de Cobranzas"
slug: "dashboard-cobranzas"
cliente: "Servicios Financieros del Plata"
categoria: "dashboard"
descripcion: "Dashboard interno con métricas de cobranzas, mora por tramo, ranking de gestores y proyección de recupero."
problema: "Empresa de gestión de cobranzas con 25 gestores. Reportaban manualmente en Excel cada viernes. El directorio no tenía visibilidad diaria de la mora ni del rendimiento por gestor."
resultado: "Dashboard diario con KPIs por gestor, distribución de mora por tramo, proyección de recupero y alertas automáticas. Acceso desde mobile para el directorio."
stack: ["Astro", "TypeScript", "PostgreSQL", "D3.js", "Node API"]
fecha: 2025-10-12
duracion: "6 semanas"
role: "Diseño + desarrollo full-stack + data viz"
repo: "https://github.com/MarcialFantini/cobranzas-dashboard"
tags: ["dashboard", "data-viz", "finanzas", "b2b"]
featured: false
metricas:
  - { label: "Gestores trackeados", value: "25" }
  - { label: "Tramos de mora", value: "6" }
  - { label: "Proyección recupero", value: "diaria" }
  - { label: "Reducción mora 30+", value: "-22%" }
---

Empresa de gestión de cobranzas con 25 gestores y cartera de USD 80M. Cada viernes armaban un reporte en Excel que el directorio leía el lunes — tarde para tomar decisiones. La mora a 30+ días estaba en 18%, el doble del benchmark del sector.

## El problema

Visibilidad tardía. Cada gestor trabajaba con un Excel distinto. Los datos se reconciliaban a mano los viernes. La gerencia no podía detectar gestores bajo rendimiento hasta 7 días después. La mora seguía subiendo.

## La solución

Construí un dashboard diario con:

- KPIs por gestor: gestión del día, recupero, ratio de contacto efectivo
- Distribución de mora por tramo (0-30, 30-60, 60-90, 90+)
- Proyección de recupero a 30/60/90 días basada en histórico
- Alertas automáticas cuando un gestor cae bajo umbral de gestión
- Acceso mobile para el directorio

## Resultado

Visibilidad diaria en vez de semanal. Detectaron 3 gestores bajo rendimiento que reubicaron. La mora 30+ bajó de 18% a 14% en 6 meses. El directorio ahora consulta el dashboard desde el auto cuando va a una reunión.