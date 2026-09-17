---
title: "Por qué tu PyME no necesita una app móvil"
description: "El 90% de las PyMEs argentinas que me piden 'una app' no la necesitan. Explico qué problema están tratando de resolver, y por qué un sitio web responsive bien hecho les resuelve más por menos."
pubDate: 2026-02-12
author: "Marcial Fantini"
category: "Producto"
readingTime: 6
tags: ["producto", "mobile", "pymes"]
featured: false
---

Aproximadamente el 60% de los clientes PyME que me llegan pidiendo "una app" no la necesitan. Lo que necesitan es otra cosa que están nombrando mal. Si trabajás en tech o vendés desarrollos, este número te va a resultar familiar.

## Las tres razones por las que te piden una app

En cinco años de conversar con dueños de PyMEs, las razones son casi siempre las mismas:

1. **"Mis clientes me piden una app"**. Análisis: el cliente final pidió instalar Instagram, no la app de la panadería de la esquina. Tu cliente está confundiendo la accesibilidad del celular con la necesidad de una app.
2. **"Quiero notificaciones push"**. Análisis: la necesidad real es retener la atención del cliente. Un newsletter bien segmentado por email o WhatsApp cubre eso y le llega al 80% de la base sin pedir permisos.
3. **"Tengo competidores que tienen app"**. Análisis: esos competidores probablemente gastaron USD 15.000 en algo que les da dos pedidos por mes. No es competidor que copiar, es pozo de dinero que evitar.

Casi nunca la necesidad real justifica el costo.

## Cuándo sí la necesitas

Hay casos donde una app nativa es la decisión correcta:

- Tu producto es un SaaS con interacción compleja diaria (Figma, Notion, etc.)
- Necesitás hardware del teléfono (cámara especializada, Bluetooth, NFC)
- Tu usuario abre la app 5+ veces al día y la fricción de un browser importa
- Venden dentro de stores que tienen comisión por transacciones y querés evadirla
- Necesitás datos offline con sync posterior

Si tu PyME no entra en estas categorías, una app probablemente no es lo que necesitás. Y si entra, te conviene una PWA antes de saltar a React Native.

## La alternativa que siempre funciona: sitio responsive

Un sitio web responsive hoy es prácticamente indistinguible de una app nativa en términos de UX. Lo que necesitás para que se sienta "app-like" en mobile:

- **Carga en menos de 2 segundos** (Astro + CDN te lo da casi gratis)
- **Add to home screen** (PWA con manifest, sin necesidad de app store)
- **Offline-first** (service worker básico cachea assets críticos)
- **Botones grandes**, taps cómodos, gestos nativos
- **Sin scroll horizontal**, sin popups invasivos

Costo de un sitio así bien hecho: USD 1.500 – USD 4.000. Mantenimiento anual: USD 200 – USD 600.

Costo de una app equivalente: USD 8.000 – USD 25.000 inicial, USD 1.500 – USD 5.000/mes de mantenimiento entre stores, push notifications, actualizaciones y soporte de devices.

La diferencia es enorme y el usuario promedio no la nota.

## Lo que cambia con un sitio mobile-first

Ejemplo real: un cliente con local de comida italiana me pidió una app "para que la gente pida delivery". Le propuse en cambio un sitio responsive con:

- Catálogo navegable en menos de 4 taps
- WhatsApp integrado con mensaje pre-armado por producto
- Form de pedido completo para clientes sin WhatsApp
- Add to home screen en iOS y Android
- Tiempo de carga: 1.1 segundos en 4G

Resultado a los 90 días:

- 60 pedidos/mes online (antes 0)
- 40 pedidos/mes por WhatsApp (mejor conversiones que la versión "llamar al local")
- Costo total USD 2.200

Si esa misma PyME hubiera encarado una app, habría gastado USD 12.000 en una que entregaría los mismos pedidos con 6 meses de delay. Y encima tendría que mantenerla actualizada cuando cambien iOS.

## Cuándo la PyME sí necesita la app

Si tu PyME tiene:

- Miles de pedidos diarios online
- Necesidad de geolocalización en tiempo real
- Tracking tipo "Uber" (cliente rastrea su pedido)
- Programa de fidelidad push orientado a retención agresiva
- Inversión publicitaria grande dirigida al app install

Ahí sí vale la pena. Para el resto, un sitio mobile-first bien hecho es la decisión correcta.

## Lo que le digo a un cliente que pide app

Si tu cliente entra a la reunión y dice "quiero una app", yo hago tres preguntas:

1. ¿Qué problema concreto querés resolver con la app?
2. ¿Cuánto estás gastando hoy en resolver ese problema?
3. ¿Qué indicador medirías para saber si la app funcionó?

Si las respuestas son vagas ("es lo que se usa", "no sé cuánto gasto"), casi siempre puedo resolverlo con un sitio web bien hecho a una fracción del costo. Si las respuestas son concretas y específicas, vale la pena hablar de PWA o app nativa con presupuesto serio.

No rechazo apps por capricho. Las rechazo porque la mayoría no las necesita. Y prefiero ser el freelance que recomienda lo que el cliente necesita, no lo que pidió emocionalmente.

Si querés discutir si tu PyME necesita (realmente) una app o le conviene otra cosa, [escribime](/contacto).
