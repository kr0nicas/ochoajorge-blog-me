# CLAUDE.md - Personal Blog Implementation Guide

This file provides practical guidance for AI coding agents working in this repository.
All code identifiers must be in English.

## Project Snapshot

- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict)
- Content model: MDX files in `content/posts/{lang}/`
- Locales: `es` and `en`
- Default locale redirect: `/` -> `/es` (see `middleware.js`)

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run type-check
npm run post:new -- "Post Title" [es|en]
npm run seo:audit [es|en]
```

## Content Architecture

### Post Location

- Spanish posts: `content/posts/es/*.mdx`
- English posts: `content/posts/en/*.mdx`

### Parsed By

- `lib/posts.ts` handles slug discovery, frontmatter parsing, sorting, tags, and series.
- `lib/mdx.tsx` compiles MDX and registers MDX components.

### Frontmatter Contract

Required in practice:

```yaml
---
title: "Post title"
description: "150-160 char SEO description"
date: "YYYY-MM-DD"
tags: ["tag-1", "tag-2"]
draft: true
---
```

Optional and supported:

```yaml
lang: "es"          # optional; folder is source of truth
featured: false
coverImage: "https://..."
series:
  name: "Series Name"
  part: 1
```

## Routing

- `/{lang}`: home
- `/{lang}/blog`: post list
- `/{lang}/blog/{slug}`: post page
- `/{lang}/tags/{tag}`: filtered posts by tag
- `/{lang}/series/{slug}`: series page
- `/{lang}/feed.xml`: RSS feed

## File Map

| Task | File |
|---|---|
| Add/edit posts | `content/posts/{es|en}/*.mdx` |
| Post parser and metadata | `lib/posts.ts` |
| MDX compiler/components | `lib/mdx.tsx`, `components/mdx/MDXComponents.tsx` |
| Post page layout | `app/[lang]/blog/[slug]/page.tsx` |
| Blog listing | `app/[lang]/blog/page.tsx` |
| Site metadata/config | `lib/utils.ts`, `app/[lang]/layout.tsx` |
| Locale behavior | `middleware.js`, `lib/dictionary.ts` |

## Agent Workflow

For new entries, follow this sequence:

1. Create scaffold with `npm run post:new`.
2. Write MDX content in the correct locale folder.
3. Keep `draft: true` until content is ready.
4. Run `npm run seo:audit` and `npm run build`.
5. Set `draft: false` only when publishing.

Detailed writing workflow lives at `.agent/workflows/new_post.md`.

## Quality Rules

- Prefer Server Components; use client components only for interactivity.
- Do not introduce `any` unless absolutely unavoidable.
- Keep metadata complete for every page.
- Use existing design tokens and component patterns.
- Do not add external runtime dependencies unless necessary.
