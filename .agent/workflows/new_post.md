---
description: Crear un nuevo post MDX con estructura correcta, frontmatter, SEO, MDX components y ubicación
---

# /new_post Workflow

Workflow completo para crear un post nuevo. Garantiza estructura, SEO, localización correcta y uso de los MDX components interactivos desde el inicio.

---

## Paso 1 — Definir el Post

Responder antes de escribir una línea:

| Campo | Decisión |
|---|---|
| **Slug** | kebab-case, sin fecha: `hexagonal-arch-python` |
| **Idioma** | `es` (principal) o `en` |
| **Título** | Keyword principal en las primeras 3 palabras |
| **Descripción** | Exactamente 150-160 caracteres |
| **Tags** | 2-5 tags en el idioma del post. Tag slug: `arquitectura-limpia` |
| **Serie** | ¿Pertenece a una serie existente? Verificar con `getAllSeries(lang)` en `lib/posts.ts` |
| **Pillar** | Uno de los 4 canónicos: `construir-con-ia`, `agentes-en-produccion`, `arquitectura`, `seguridad` (ver `lib/pillars.ts`) |

---

## Paso 2 — Crear el Archivo MDX

**Ruta correcta:**
- Español: `content/posts/es/{slug}.mdx`
- Inglés: `content/posts/en/{slug}.mdx`

**Frontmatter completo:**

```yaml
---
title: "Título con Keyword al Inicio"
description: "Descripción de exactamente 150-160 caracteres optimizada para SEO y legible para humanos. Revisa el contador."
date: "2026-03-04"
tags: ["arquitectura", "python", "fastapi"]
pillar: "arquitectura"
lang: "es"
draft: true
featured: false
series:
  name: "Arquitectura de Software Avanzada"  # solo si aplica
  part: 1
resources:
  - label: "Documentación oficial"
    url: "https://nextjs.org/docs"
---
```

> `draft: true` siempre hasta que esté listo. Deploy no lo incluirá en producción.

---

## Paso 3 — Estructura Base del Post

```mdx
# Título del Post

Párrafo de apertura: engancha en 2-3 oraciones. Nombra el problema y por qué importa al lector.

## El Problema

Contexto. ¿Cuándo te topas con esto en la práctica?

## La Solución

Desarrollo principal del tema.

### Sub-tema 1

<Callout type="tip" title="Tip clave">
  Insight directo que el lector puede aplicar ahora mismo.
</Callout>

### Sub-tema 2

<ComparisonTable
  headers={["Opción A", "Opción B"]}
  highlight={0}
  rows={[
    ["Ventaja 1", "Desventaja 1"],
    ["Ventaja 2", "Desventaja 2"],
  ]}
/>

## Implementación Paso a Paso

<Steps>
  <Step title="Primer paso">
    Descripción del paso con código si aplica.
    ```python
    # Código aquí
    ```
  </Step>
  <Step title="Segundo paso">
    ...
  </Step>
</Steps>

## Estructura de Archivos

<FileTree title="Estructura del proyecto">
{`
  src/
    domain/
      entities/
        entity.py  [highlight]
      ports/
    infrastructure/
      adapters/
`}
</FileTree>

## Antes y Después (Opcional)

<CodeComparison
  before={{ label: "❌ Sin patrón", code: `código acoplado aquí` }}
  after={{ label: "✅ Con patrón", code: `código limpio aquí` }}
/>

## Lecciones Aprendidas

- Bullet conciso #1
- Bullet conciso #2
- Bullet conciso #3

## Conclusión

Cierre directo. ¿Qué sigue? ¿Hay otro post de la serie? → link.
¿Dudas? → invitar a comentar (Giscus se carga automáticamente).
```

---

## Paso 4 — MDX Components Disponibles

> Estos no necesitan import. Están registrados globalmente en `lib/mdx.tsx`.

| Componente | Uso |
|---|---|
| `<Callout type="tip/warning/danger/note/success">` | Alertas y notas destacadas |
| `<FileTree>` | Árbol de archivos interactivo con `[highlight]` |
| `<Steps> + <Step title="">` | Guía numerada paso a paso |
| `<ComparisonTable headers rows highlight>` | Tabla comparativa con columna ganadora |
| `<CodeComparison before after>` | Antes/Después con tabs y copy |

---

## Paso 5 — Imágenes

**NUNCA** subir imágenes al repo Git.

1. Ir a `https://ochoajorge.me/es/admin/upload`
2. Subir → copiar URL de Vercel Blob
3. Usar en MDX:
```mdx
![Alt descriptivo](https://6pxof7rpjdk6gkca.public.blob.vercel-storage.com/imagen.webp)
```

---

## Paso 6 — Checklist SEO Pre-Publicación

Antes de cambiar `draft: false`, verificar:

- [ ] `title` tiene keyword principal en las primeras 3 palabras
- [ ] `description` tiene entre 150-160 caracteres exactos
- [ ] `tags` están en el idioma del post (ES/EN)  
- [ ] `date` es correcta en formato `YYYY-MM-DD`
- [ ] Al menos 1 `h2` con keyword secundaria
- [ ] Hay al menos un link interno a otro post del blog
- [ ] Imágenes (si las hay) tienen `alt` descriptivo
- [ ] Post tiene entre 1,500-3,000 palabras para máximo impacto SEO
- [ ] Si es parte de una serie: `series.name` es idéntico a los otros posts

---

## Paso 7 — Publicar

> ⛔ **NUNCA `git push origin main`.** Publicar = PR con base `develop`
> (ver `AGENTS.md`). El post llega a producción con el PR de release
> `develop` → `main`.

```bash
# 1. Cambiar draft: false en el frontmatter
# 2. Verificar build limpio
npm run seo:audit && npm run build

# 3. Rama desde develop, commit y PR
git fetch origin
git switch -c content/{slug} origin/develop
git add content/posts/es/{slug}.mdx
git commit -m "content(posts): add {slug} post"
git push -u origin HEAD
gh pr create --base develop --fill
```

---

## Tips para Agentes IA

- **Los posts relacionados** se calculan automáticamente por tags y series — no hace falta linkear manualmente en el código
- **El sitemap** se regenera en cada build — el post aparece automáticamente
- **La ToC** se genera desde los headings `h2`, `h3`, `h4` del post — usa buenos headings descriptivos
- **Los tags** de la misma serie deben solapar para que `RelatedPosts` surfacee los posts correctamente
- **La serialización de series** requiere `series.name` EXACTO — copia/pega del frontmatter del primer post
