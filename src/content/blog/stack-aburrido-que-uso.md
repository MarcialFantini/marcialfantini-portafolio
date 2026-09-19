---
title: "El stack aburrido que uso en 9 de cada 10 proyectos"
description: "Por qué la mayoría de mis proyectos son Astro + TypeScript + Tailwind + SQLite + Vercel/Cloudflare. La decisión de elegir lo aburrido, y cómo me ahorra horas cada mes."
pubDate: 2026-02-25
category: "desarrollo"
readingTime: 5
tags: ["stack", "astro", "typescript", "tailwind", "sqlite"]
featured: false
---

Tengo una regla que me cambió la vida profesional: si una herramienta más nueva no resuelve un problema concreto que ya tengo, no la adopto. El resultado es que el 90% de mis proyectos terminan siendo la misma combinación aburrida.

## El stack aburrido

- **Astro** para frontend
- **TypeScript** estricto en todo el código
- **Tailwind v4** para estilos
- **SQLite** vía libSQL para datos chicos
- **Vercel o Cloudflare Pages** para deploy
- **pnpm** como package manager

Eso es. Sin GraphQL, sin Docker, sin Redis, sin Kubernetes, sin microservicios, sin frameworks que aparecieron la semana pasada.

## Por qué aburrido es bueno

Cuando tenés 6 clientes con sitios similares y todos usan el mismo stack, tu tiempo de soporte cae a la mitad. Reconozco el bug porque lo arreglé tres veces. Sé dónde mirar porque ya miré cien veces. No tengo que pensar en qué versión de qué dependencia rompió qué cosa.

El aburrimiento libera atención para lo que importa: el problema del cliente.

## Cuándo rompo la regla

Rompo la regla cuando el problema del cliente no entra en mi stack estándar. Tres ejemplos recientes:

- **e-commerce con 60 productos y variantes**: usé Next.js con Stripe porque el cliente quería panel admin complejo. Astro hubiera sido posible pero la fricción era alta.
- **Tracker de pedidos con WebSockets**: usé Node + SQLite + Astro híbrido porque necesitaba push en tiempo real. Astro puro se quedó corto.
- **Migración de WordPress a headless**: mantuve WordPress como CMS y Astro como front. Decisión del cliente, no mía.

En esos tres casos el costo fue mayor y aprendí algo. Pero la decisión la tomé después de descartar el stack aburrido por escrito, no por instinto.

## El precio de la diversidad

En 2024 me tenté con Astro + tRPC + Drizzle + Turso + Cloudflare Workers. Lo armé en un side. Lo pagué caro en horas de setup que no pude facturar. Lo tiré a la basura y volví a Astro + SQLite + Vercel. Resultado: 30% más rápido en promedio, menos bugs, cliente más feliz.

## Lo que le digo a un cliente que quiere tecnología exótica

"Si querés pagarme 30% más para aprender una herramienta en tu proyecto, podemos. Pero si tu problema entra en mi stack estándar, te conviene pagarme menos y entregar más rápido. Decidí vos."

La mayoría elige pagar menos y entregar más rápido.

## La decisión es operativa, no filosófica

No es que sea un purista del minimalismo. Es que el costo de oportunidad de aprender algo nuevo en un proyecto pago es plata que el cliente me paga para resolver SU problema, no el mío.

Si querés discutir el stack de tu próximo proyecto, [escribime](/contacto). Probablemente la respuesta sea "Astro + lo aburrido de siempre", y eso es una buena noticia para tu presupuesto.