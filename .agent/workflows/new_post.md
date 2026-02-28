---
description: Crear un nuevo post MDX con estructura correcta, frontmatter, SEO y ubicación
---

# New Post Workflow

Este workflow garantiza que cada post nuevo tenga la estructura, SEO y calidad correcta desde el inicio.

## 1. Definir el post

Antes de crear el archivo, responder:
- **Slug**: nombre del archivo (kebab-case, sin fecha, ej: `hexagonal-arch-python`)
- **Título**: descriptivo y con keyword principal al inicio
- **Descripción**: 150-160 caracteres exactos para SEO
- **Tags**: 2-5 tags relevantes del pillar content del blog
- **Audiencia objetivo**: ¿Para quién es este post?

## 2. Crear el archivo MDX

Crear en `content/posts/{slug}.mdx` con este frontmatter exacto:

```yaml
---
title: "Título del Post Aquí"
description: "Descripción de exactamente 150-160 caracteres que será usada en SEO y en las cards del listado."
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3"]
draft: true
readingTime: true
coverImage: "/images/posts/{slug}.jpg"
---
```

> Nota: `draft: true` hasta que esté listo para publicar. Cambia a `false` para publicar.

## 3. Estructura del Post

Usar esta estructura como base:

```mdx
# Título del Post

Párrafo introductorio que engancha al lector. Explica el problema o la pregunta central en 2-3 oraciones.

## El Problema

Describe el contexto y por qué este tema importa.

## La Solución (o: Concepto Central)

Desarrollo del tema principal.

### Sub-sección 1

### Sub-sección 2

## Código / Implementación

```python
# Ejemplo de código con syntax highlighting
```

## Lecciones Aprendidas

Bullet points concisos de los takeaways principales.

## Conclusión

Cierre con call-to-action suave (¿qué sigue? ¿Tienes preguntas? → comentarios Giscus).
```

## 4. SEO Checklist Pre-publicación

Antes de cambiar `draft: false`:
- [ ] Título tiene keyword principal en los primeros 3 palabras
- [ ] Description tiene entre 150-160 caracteres
- [ ] Al menos un `h2` con keyword secundaria
- [ ] Imágenes tienen `alt` descriptivo
- [ ] Links internos a otros posts relevantes (si existen)
- [ ] Tags son consistentes con los usados en otros posts
- [ ] Código tiene syntax highlighting correcto (lenguaje especificado)

## 5. Publicar

```bash
# Cambiar draft: false en el frontmatter, luego:
git add content/posts/{slug}.mdx
git commit -m "content(posts): add {slug} post"
git push origin main  # Vercel despliega automáticamente
```
