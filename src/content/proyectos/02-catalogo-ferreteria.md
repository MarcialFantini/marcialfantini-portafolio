---
title: "Catálogo Ferretería El Tornillo"
slug: "catalogo-ferreteria"
cliente: "Ferretería El Tornillo"
descripcion: "Catálogo navegable con 200+ SKUs, búsqueda por categoría y descarga de lista en PDF para pedidos mayoristas."
problema: "Ferretería de tres generaciones con clientela mayorista que necesitaba pedir por código sin llamar a la tienda. El catálogo en PDF era un solo archivo gigante de 80MB."
resultado: "Catálogo web navegable con búsqueda por categoría y código, exportable a PDF filtrado, optimizado para imprimir y consultar desde el celular en el depósito."
stack: ["Astro", "TypeScript", "Tailwind CSS", "SheetJS"]
fecha: 2025-04-18
duracion: "4 semanas"
role: "Diseño + desarrollo full-stack"
repo: "https://github.com/MarcialFantini/catalogo-ferreteria"
tags: ["catalogo", "ferreteria", "mayorista"]
featured: true
metricas:
  - { label: "SKUs cargados", value: "200" }
  - { label: "Categorías", value: "12" }
  - { label: "Filtros de búsqueda", value: "8" }
  - { label: "PDF exportable", value: "Sí" }
---

Ferretería familiar del barrio de Once. Venden a corralones y constructoras hace tres generaciones. El dueño quería que sus clientes mayoristas pudieran consultar el catálogo desde el celular mientras caminaban el depósito, y bajar un PDF filtrado por categoría para hacer pedidos semanales.

## El problema

Tenían un PDF único de 80MB que se rompía al abrirlo en mobile. Los clientes mayoristas llamaban para preguntar el código de productos básicos. El tiempo perdido en llamadas era un costo directo.

## La solución

Construí un catálogo navegable con:

- 200 productos cargados desde una planilla Google Sheets que el cliente mantiene
- Búsqueda por nombre, código o categoría
- Filtros combinados (categoría + marca + disponibilidad)
- Botón "Exportar PDF filtrado" por categoría, listo para imprimir
- Vista mobile-first con imágenes de cada producto

## Resultado

A los dos meses, el 70% de los pedidos mayoristas llegaban con códigos exactos en vez de descripciones. Llamadas bajaron a la mitad. El cliente me dijo textualmente: "Ya no tengo que explicar por teléfono qué es un tirafondo de 3/8".
