---
title: "Migración WordPress → Astro Editorial"
slug: "migracion-wordpress-editorial"
cliente: "Revista La Vuelta"
categoria: "blog"
descripcion: "Migración completa de un magazine WordPress a Astro + Content Collections, con redirects 1:1 y SEO preservado."
problema: "Revista digital con 8 años de archivo en WordPress. El hosting se caía cada semana, el editor era lento, y el SEO técnico tenía 40 problemas críticos en Search Console."
resultado: "Sitio migrado a Astro con Content Collections, 100% de URLs redirigidas correctamente, 0 errores 404, y un editor que carga instantáneamente."
stack: ["Astro", "TypeScript", "MDX", "Vercel"]
fecha: 2026-01-15
duracion: "4 semanas"
role: "Migración + SEO + desarrollo"
repo: "https://github.com/MarcialFantini/revista-la-vuelta"
tags: ["migracion", "wordpress", "seo", "editorial"]
featured: false
metricas:
  - { label: "Posts migrados", value: "1.200" }
  - { label: "URLs redirigidas", value: "100%" }
  - { label: "Tiempo de carga", value: "0.6s" }
  - { label: "Errores 404 post-migración", value: "0" }
---

Revista digital argentina con 8 años de archivo y 1.200 posts publicados en WordPress. Su hosting compartido se caía cada vez que un post se viralizaba, el editor tardaba 8 segundos en guardar un borrador, y tenían 40 errores críticos en Search Console.

## El problema

WordPress era un lastre técnico. Cada deploy era manual vía FTP. El editor era lento. Las imágenes no estaban optimizadas. La base de datos tenía 800MB de comentarios spam. Migrar era un riesgo pero quedarse costaba más.

## La solución

Migración completa en 4 semanas:

- Exporté todos los posts vía WP-CLI + custom script que normalizó el markdown
- Convertí cada post a MDX con frontmatter consistente
- Mapeé las 1.200 URLs viejas a nuevas con redirects 301 en `vercel.json`
- Recreé las categorías y tags como colecciones derivadas
- Migré las imágenes a Vercel Blob Storage con srcset responsive

## Resultado

Tiempo de carga promedio: de 4.5s a 0.6s. Lighthouse: de 58 a 100. Errores 404 post-migración: 0 (verifiqué las 1.200 URLs con curl + grep). Tráfico orgánico creció 18% en 60 días por la mejora de Core Web Vitals.