# CLAUDE.md — Personal Blog

This file provides guidance to Claude Code when working with this repository.
All code identifiers must be in **English**. Comments and user-facing strings may be in Spanish or English.

## Project Overview

A personal blog built with Next.js 15 (App Router), Tailwind CSS v4, and MDX. No database — content lives as `.mdx` files in `content/posts/`. Hosted on Vercel.

**Stack:**
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: MDX (`.mdx` files in `content/posts/`)
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Build & Run Commands

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # tsc --noEmit
```

## Architecture

### Content Layer: MDX Files
- All blog posts live in `content/posts/*.mdx`
- Frontmatter contains: `title`, `description`, `date`, `tags`, `draft`, `coverImage`
- `lib/posts.ts` handles all file parsing, sorting, and filtering
- `lib/mdx.ts` configures the MDX processor (remark/rehype plugins)

### Routing (App Router)
- `/` — Homepage: hero + featured posts
- `/blog` — All posts listing with search/filter
- `/blog/[slug]` — Individual post (SSG with `generateStaticParams`)
- `/about` — About page
- `/projects` — Projects showcase

### Frontend Pattern: Server Components First
- **Server Components by default** — fetch data in the component directly
- **Client Components** (`'use client'`) — only for interactive UI (search, theme toggle, animations)
- **No custom hooks for data fetching** — use RSC and `async/await` directly
- **Hooks allowed** for client-side state (theme, search, UI state)

### Component Structure
```
components/
├── ui/           # shadcn/ui primitives (generated)
├── blog/         # PostCard, PostHeader, TableOfContents, CodeBlock, ReadingProgress
├── layout/       # Header, Footer, ThemeToggle, MobileMenu
└── shared/       # Tag, AnimatedSection, GradientText
```

## Critical Rules

### MDX Posts Frontmatter Schema
Every post MUST have this frontmatter:
```yaml
---
title: "Post Title"
description: "Brief description for SEO and cards (150-160 chars)"
date: "2025-01-15"
tags: ["nextjs", "architecture", "python"]
draft: false
coverImage: "/images/posts/post-slug.jpg"  # optional
---
```

### SEO (mandatory on every page)
- Every `page.tsx` must export `generateMetadata()` or a static `metadata` object
- Use descriptive `title` with site name suffix: `"Post Title | Jorge Ochoa"`
- `description` must be 150-160 characters
- OG image defined via `opengraph-image.tsx` or metadata API

### Code Quality
- TypeScript strict mode — no `any`, no `@ts-ignore` without comment
- `eslint` clean — no warnings in CI
- Images: always use `next/image` with proper `width/height` or `fill`
- Fonts: always use `next/font` — never Google Fonts CDN link

### Performance Targets
- Core Web Vitals > 90 on all pages
- Images: WebP format, lazy loading by default
- Code splitting: dynamic imports for heavy components

### Styling
- Tailwind CSS v4 utility classes
- Design tokens defined in `app/globals.css` via `@theme`
- Dark mode: `class` strategy via `next-themes`
- No inline styles unless absolutely necessary

## Agent Skills Available

See `.agent/skills/` for detailed guidance:
- `nextjs-developer` — App Router, RSC, data fetching
- `next-best-practices` — Conventions, async APIs, error boundaries
- `ui-ux-pro-max` — Glassmorphism, dark mode, animations
- `shadcn-ui` — Component library usage
- `tailwind-design-system` — Design tokens, component patterns
- `security_audit` — Security scanning
- `documentation_architect` — README and docs generation
- `python-best-practices` — For build scripts and tooling

## Agent Personas

See `.agent/personas/` for role definitions:
- `architect.md` — System design, architectural decisions
- `frontend_expert.md` — UI/UX implementation
- `security_officer.md` — Security review
- `content_strategist.md` — Post structure, SEO, audience

## Workflows

See `.agent/workflows/`:
- `/new_post` — Create a new MDX blog post with proper structure
- `/deploy` — Deploy to Vercel production
- `/seo_audit` — SEO checklist before publishing
- `/fix_bug` — Standard debugging process

## Quick Navigation (for AI agents)

| Task | File |
|------|------|
| Add a new post | `content/posts/new-post.mdx` |
| Post parser logic | `lib/posts.ts` |
| MDX configuration | `lib/mdx.ts` (or `next.config.ts`) |
| Design tokens | `app/globals.css` — `@theme` block |
| Homepage layout | `app/page.tsx` |
| Blog listing page | `app/blog/page.tsx` |
| Individual post | `app/blog/[slug]/page.tsx` |
| Site metadata | `app/layout.tsx` — `metadata` export |
| Tailwind config | `tailwind.config.ts` |
| Next.js config | `next.config.ts` |
