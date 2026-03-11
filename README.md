# Jorge Ochoa Personal Blog

Personal technical blog built with Next.js App Router and MDX.  
Content is file-based (no CMS, no database), and localized in Spanish and English.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- MDX for posts
- Vercel deployment

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000` and middleware redirects to `/es` by default.

## Content Structure

Posts live in language folders:

- `content/posts/es/*.mdx`
- `content/posts/en/*.mdx`

Each post is served at `/{lang}/blog/{slug}`.

## Referencias rápidas

Cada `post` ahora puede incluir una sección `resources` en el frontmatter:

```yaml
resources:
  - label: "Documentación oficial de Turbopack"
    url: "https://nextjs.org/docs/messages/turbopack"
```

Ese bloque se refleja en la UI del artículo, donde se repiten las etiquetas, la serie y los recursos extra para que un lector o editor vea rápidamente qué enlaza el contenido.

## API de resumen

Para alimentar widgets o agentes, el endpoint `GET /api/posts/summary` devuelve los posts por idioma con `slug`, `title`, `description`, `tags`, `readingTime` y `featured`. Los agentes pueden consultarlo antes de generar prompts o dashboards.

## Pruebas end-to-end

El comando `npm run test:e2e` arranca `npm run dev` en `localhost:3000`, espera a la home, lee `/api/posts/summary` y valida las rutas `/es`, `/es/blog` y la primera entrada. Se puede añadir a pipelines ligeros antes del deploy.

## Create a New Post

Use the scaffold script:

```bash
npm run post:new -- "My Post Title"
npm run post:new -- "My Post Title" en
```

Frontmatter expected by the app:

```yaml
---
title: "Post title"
description: "150-160 character summary for SEO."
date: "2026-03-05"
tags: ["architecture", "nextjs"]
lang: "es"
draft: true
featured: false
series:
  name: "Optional series name"
  part: 1
coverImage: "https://... (optional)"
---
```

After writing content:

```bash
npm run seo:audit
npm run build
```

## Agent Onboarding

- Start with [CLAUDE.md](./CLAUDE.md) for implementation rules and file map.
- Strategic and content direction lives in [GEMINI.md](./GEMINI.md).
- Operational writing workflow: `.agent/workflows/new_post.md`.

## License

Source code is open. Post content remains copyright of Jorge Ochoa unless stated otherwise.
