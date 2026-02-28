---
description: Auditoría SEO completa para posts y páginas antes de publicar
---

# SEO Audit Workflow

Ejecutar antes de cambiar `draft: false` en cualquier post, y periódicamente en páginas existentes.

## 1. Metadata Check

Verificar en `app/blog/[slug]/page.tsx` que `generateMetadata()` retorna:

```typescript
// ✅ Correcto
{
  title: "Post Title | Jorge Ochoa",   // 50-60 chars max
  description: "...",                   // 150-160 chars exact
  openGraph: {
    title: "Post Title",
    description: "...",
    type: "article",
    publishedTime: "2025-01-15",
    authors: ["Jorge Ochoa"],
    tags: ["tag1", "tag2"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Post Title",
    description: "...",
  }
}
```

## 2. Structured Data (JSON-LD)

Cada post debe incluir JSON-LD de tipo `Article`:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  author: {
    '@type': 'Person',
    name: 'Jorge Ochoa',
    url: 'https://jorgeochoa.dev'
  }
}
```

## 3. Content SEO Checklist

Para cada post:
- [ ] **Keyword en H1**: La keyword principal aparece en el título (H1)
- [ ] **Keyword en primer párrafo**: Mencionada en las primeras 100 palabras
- [ ] **H2s relevantes**: Keywords secundarias en subheadings
- [ ] **Alt text en imágenes**: Descriptivo, no "imagen1.png"
- [ ] **Links internos**: Al menos 1-2 links a otros posts relevantes
- [ ] **Links externos**: Fuentes autoritativas (documentación oficial, papers)
- [ ] **Slug limpio**: Kebab-case, sin stopwords innecesarias, max 50 chars

## 4. Performance Check

```bash
# Build local y verificar bundle size
npm run build

# Verificar que no hay imágenes sin optimizar
# Buscar tags <img> (deben ser next/image)
grep -r "<img " app/ components/
```

## 5. Herramientas Externas

- **OG Image preview**: https://opengraph.xyz/ — pegar URL del post
- **Title/description length**: https://moz.com/free-seo-tools/serp-preview
- **Structured data**: https://validator.schema.org/
- **Core Web Vitals**: Vercel Analytics dashboard post-deploy

## 6. Pre-publicación Final

```bash
# Cambiar draft status
# En content/posts/{slug}.mdx:
# draft: false

git add content/posts/{slug}.mdx
git commit -m "content(posts): publish {slug}"
git push origin main
```
