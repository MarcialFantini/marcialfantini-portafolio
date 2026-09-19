---
title: "Integración MercadoLibre → ERP"
slug: "integracion-mercadolibre-erp"
cliente: "Distribuidora del Litoral"
categoria: "integracion"
descripcion: "Sincronización bidireccional entre MercadoLibre, TiendaNube y el ERP propio del cliente."
problema: "Distribuidora con 3 canales de venta online (MercadoLibre, TiendaNube, propio). Gestionaban stock manualmente en cada plataforma, con sobreventa constante."
resultado: "Integración bidireccional: stock unificado en tiempo real, pedidos sincronizados al ERP, facturación automática en AFIP."
stack: ["Node.js", "MercadoLibre API", "TiendaNube API", "PostgreSQL", "AFIP SDK"]
fecha: 2025-08-30
duracion: "7 semanas"
role: "Integración + backend"
repo: "https://github.com/MarcialFantini/mercadolibre-erp"
tags: ["integracion", "mercadolibre", "erp", "stock"]
featured: false
metricas:
  - { label: "Canales integrados", value: "3" }
  - { label: "Sobreventa eliminada", value: "100%" }
  - { label: "Tiempo sync stock", value: "<10s" }
  - { label: "Pedidos automatizados / mes", value: "800" }
---

Distribuidora de artículos de limpieza con 3 canales online: MercadoLibre, TiendaNube, sitio propio. Tenían 4 personas dedicadas a mover stock entre plataformas. La sobreventa era del 8% (un cliente compraba, descubrían que no había stock, había que avisar y cancelar).

## El problema

Cada plataforma tenía su propio inventario. Las actualizaciones manuales tardaban 2 horas por turno. Cuando dos clientes compraban al mismo tiempo el último producto, el sistema no se enteraba hasta horas después. Reclamos, cancelaciones, mala reputación.

## La solución

Construí una capa de integración con el ERP del cliente como fuente única de verdad:

- Webhooks de MercadoLibre + TiendaNube que disparan actualización en el ERP
- Worker que consulta stock cada 5 minutos y ajusta precios/publicaciones
- Sincronización de pedidos al ERP para facturación automática
- AFIP SDK integrado para emisión de facturas al confirmar despacho

## Resultado

Sobreventa eliminada completamente. Stock sincronizado en menos de 10 segundos. 4 personas reasignadas a atención al cliente. Pedidos automatizados 800/mes con cero intervención manual.