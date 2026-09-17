---
title: "El error de USD 15k que cometí con un cliente PyME (y cómo lo arreglé)"
description: "Historia real de un proyecto en el que la codicia me ganó y entregué un sitio con un plugin de pago que terminó costándome dinero, tiempo y una relación. Lecciones y herramientas para no repetirlo."
pubDate: 2026-02-05
author: "Marcial Fantini"
category: "Casos"
readingTime: 8
tags: ["lecciones", "freelance", "casos"]
featured: false
---

Hice un sitio que me costó USD 15.000 aprender a no repetir. No fue el proyecto más caro que entregué ese año. Fue el más caro en plata. Y la cifra incluyó plata que perdió el cliente, plata que perdí yo, y horas que ninguno nos olvidamos. Cuento la historia porque es la mejor clase de negocios que pagué.

## El setup

Cliente: distribuidor de artículos de ferretería en el conurbano bonaerense. Venden hace 30 años, principal canal son los pedidos telefónicos. Tienen 2.000 SKUs en una planilla Excel compartida.

Venden USD 35.000/mes promedio, alto en temporada. Querían un sitio web para "vender online". Cotización pactada: USD 4.800, anticipo 40%, 60% al entregar.

Mi error número uno: no escribí un alcance detallado. Firmamos un PDF de cuatro párrafos con la palabra "catálogo online con pasarela de pago". Ambiguo.

## Lo que entregué

Construí un e-commerce con:

- Astro para el front (decisión correcta)
- WordPress como headless CMS porque el cliente "quería poder editar fácil"
- WooCommerce para el carrito porque tenía Pragma pasado con WooCommerce
- Pasarela de Mercado Pago con el plugin oficial de WooCommerce
- Un popup de descuentos con un plugin de los muchos

Lo entregué a tiempo. Cobré el saldo. El cliente estaba contento. Lo recuerdo porque es el momento exacto en que dejé de cuidar el proyecto.

## Lo que pasó tres meses después

El cliente me llama una noche de domingo:

> "Marcial, las ventas no funcionan. No llega ningún pedido y me están cobrando cosas raras en Mercado Pago."

Entro a mirar. El plugin de "descuentos popup" se había actualizado solo y había desactivado el checkout. El plugin de Mercado Pago había cambiado su versión de API y las llamadas devolvían 401. El headless setup requería actualizar el frontend cada vez que tocaban un producto en WordPress, y no lo estaban haciendo porque no sabían.

Resultado:

- 11 pedidos pagados pero no entregados (porque el checkout se rompía justo antes del confirm)
- 4 clientes que llamaron enojados
- El cliente tuvo que devolver USD 1.250 en pagos
- Yo tuve que dedicar 40 horas extra arreglando todo lo que se rompió
- Mi margen final fue negativo: USD 4.800 cobrados, USD 6.300 de costo real en horas y refuerzos

Si saco el costo hundido, el proyecto me dejó USD -1.500.

## Por qué pasó (las tres causas)

### 1. No fui yo quien eligió el stack, fue "lo que ya conocía"

WordPress + WooCommerce no era la herramienta correcta para ese cliente. Era la herramienta que yo había visto en proyectos anteriores. La diferencia es grande: para un cliente no técnico con 2.000 SKUs y cero intención de aprender a mantener un CMS, lo correcto habría sido un catálogo administrado vía JSON o un Sanity.

Me dejé llevar por la inercia en vez de pensar qué era mejor para el caso.

### 2. La palabra "fácil" en el contrato

"Editar fácil" es un espejismo. Editar fácil es una habilidad, no una función del CMS. Para el dueño, "fácil" significa "no necesito a Marcial para agregar un producto". Para mí, debería haber significado "no le vendo un CMS, le vendo un servicio administrado".

### 3. No avisé sobre plugins de terceros

Cualquier proyecto serio debe hablar explícitamente sobre dependencias de terceros. Yo sabía que los plugins podían romperse. No lo dije. No lo escribí en ningún lado. El cliente no tenía por qué saber.

## Lo que arreglé (y lo que dejé)

Lo que arreglé gratis:

- Reescribí el catálogo en Astro + archivo JSON versionado
- Migré la pasarela a una integración directa con Mercado Pago (SDK propia)
- Eliminé el popup de descuentos
- Le di al cliente un panel simple con la planilla Google Sheets como única fuente de verdad

Lo que no arreglé:

- Las 40 horas que pasé arreglando el sitio roto se cobraron, eventualmente, en proyectos futuros
- La confianza del cliente la reconstruí con un nuevo proyecto más pequeño, USD 1.200, ejecutado impecablemente

Total recuperado al final del año: USD 2.500 facturados extra en proyectos derivados. Pérdida neta histórica: USD 12.500 entre plata y horas.

## Lo que hago distinto hoy

Tres cambios obligatorios en mi proceso:

1. **Alcance escrito y firmado en planilla, no PDF**. Cada pantalla, cada integración, cada dependencia externa con nombre y versión.
2. **Stack locked en la propuesta**. Si digo Astro + Sanity, voy a Astro + Sanity. Si el cliente quiere otra cosa, se cotiza aparte.
3. **Disclaimer de plugins externos**. Una sección obligatoria del contrato: "Cero mantenimiento de plugins de terceros después de los 90 días. El cliente contrata mantenimiento o asume el riesgo".

Desde entonces entregué 14 proyectos con cero fallos similares. Nada garantiza el futuro, pero el sistema funciona.

## La lección

El peor cliente que tengas va a ser uno al que le vendiste algo que no entendías del todo. La mejor lección que puedas llevarte es perder plata una vez, escribir por qué la perdiste, y nunca repetir la cadena que te llevó hasta ahí.

Hoy firmaría ese mismo proyecto por USD 9.000 entregado impecablemente, no por USD 4.800 con la palabra "fácil" metida adentro.

¿Querés que audite tu proyecto freelance actual y te marque dónde están los riesgos? [Conversemos](/contacto).
