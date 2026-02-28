---
name: blog-manager
description: Manage blog content, images via Vercel Blob, and i18n translations.
---

# Blog Manager Skill

Esta skill permite a un agente gestionar el ciclo de vida completo del contenido del blog de Jorge Ochoa, incluyendo la creación de posts, gestión de activos y soporte multi-idioma.

## 🗂️ Estructura de Contenido

Los posts se almacenan en formato MDX dentro de la carpeta `content/posts/`, divididos por idioma:
- `content/posts/es/`: Posts en Español (Idioma principal).
- `content/posts/en/`: Posts en Inglés.

### Frontmatter Requerido
Cada archivo `.mdx` debe incluir el siguiente encabezado:

```yaml
---
title: "Título del Post"
description: "Breve descripción para SEO y tarjetas."
date: "2024-02-28"
lang: "es" # o "en"
tags: ["Arquitectura", "Python"]
series:
  name: "Nombre de la Serie" # Opcional
  part: 1 # Opcional
---
```

## 🖼️ Gestión de Imágenes (Vercel Blob)

**IMPORTANTE:** No subir imágenes directamente al repositorio Git.

### Flujo de Trabajo para Imágenes:
1. Las imágenes deben subirse a través de la herramienta de administración: `https://ochoajorge.me/[lang]/admin/upload`.
2. El agente puede usar la herramienta local en desarrollo si `BLOB_READ_WRITE_TOKEN` está configurado.
3. Una vez obtenida la URL de Vercel Blob (ej. `https://...public.blob.vercel-storage.com/...`), usarla directamente en el MDX:

```markdown
![Descripción de la imagen](https://url-de-vercel-blob.jpg)
```

## 🌐 Internacionalización (i18n)

El blog utiliza un sistema de diccionarios para la interfaz y carpetas para el contenido.

1. **Interfaz**: Las traducciones de UI están en `lib/dictionary.ts`.
2. **Rutas**: Todas las rutas deben incluir el prefijo de idioma (ej. `/[lang]/blog`).
3. **Nuevos Idiomas**: Para añadir un idioma, registrarlo en `middleware.js` y `lib/dictionary.ts`.

## 🛠️ Comandos y Scripts Útiles

- **Crear nuevo post**: `npm run post:new` (Script interactivo para generar el scaffold).
- **Auditoría SEO**: `npm run seo:audit` (Verifica metadatos y estructura de encabezados).
- **Desarrollo**: `npm run dev` (Inicia servidor local con Turbopack).

## 💬 Comentarios y Discusión

El blog usa **Giscus**. Para que funcione en un post nuevo:
1. El repositorio debe ser **Público**.
2. Las **Discussions** deben estar habilitadas en GitHub.
3. El componente `Comments` en `app/[lang]/blog/[slug]/page.tsx` gestiona la carga automáticamente usando el `pathname` como clave.

## 🎨 Guía de Estilo

- **Tipografía**: JetBrains Mono (Monospace) para todo el sitio.
- **Colores**: Indigo (`--brand`) y Cyan (`--accent`) sobre fondo oscuro.
- **Layout**: Cuadrícula uniforme de 2 columnas para los posts (`PostCard`).

---
*Este documento actúa como la fuente de verdad para cualquier agente IA que colabore en este repositorio.*
