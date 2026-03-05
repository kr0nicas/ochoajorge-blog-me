---
name: blog-manager
description: Manage blog content, images via Vercel Blob, and i18n translations.
---

# Blog Manager Skill

Esta skill permite a un agente gestionar el ciclo de vida completo del contenido del blog de Jorge Ochoa, incluyendo la creación de posts, gestión de activos, MDX components interactivos y soporte multi-idioma.

**Última actualización:** Marzo 2026

---

## 🗂️ Estructura de Contenido

Los posts se almacenan en formato MDX dentro de la carpeta `content/posts/`, divididos por idioma:

- `content/posts/es/` — Posts en Español (idioma principal)
- `content/posts/en/` — Posts en Inglés

### Frontmatter Completo

Cada archivo `.mdx` debe incluir el siguiente encabezado:

```yaml
---
title: "Título del Post"
description: "Breve descripción para SEO (150-160 caracteres)."
date: "2026-03-04"
tags: ["arquitectura", "python", "next.js"]     # siempre en minúsculas y en el idioma del post
lang: "es"                                       # "es" o "en"
draft: true                                      # true = no se publica en producción
featured: false                                  # true = aparece primero en home
coverImage: "https://url-de-vercel-blob..."      # Opcional. SIEMPRE Vercel Blob, nunca ruta local
series:
  name: "Arquitectura de Software Avanzada"      # Opcional. Debe coincidir exactamente en todos los posts de la serie
  part: 1                                        # Número de parte dentro de la serie
---
```

**Reglas críticas de tags:**
- Tags en **español** para posts en `/es/`, en **inglés** para posts en `/en/`
- Usar kebab-case para tags multi-palabra: `"arquitectura-limpia"`, `"clean-architecture"`
- Reutilizar tags existentes siempre que sea posible (ver `lib/posts.ts → getAllTags()`)

**Reglas de series:**
- El campo `series.name` debe ser **idéntico** en todos los posts de la misma serie (sensible a mayúsculas)
- Los posts de la serie se ordenan automáticamente por `series.part`
- La serie aparece en `SeriesBanner` dentro del post y en `RelatedPosts`

---

## 🎨 MDX Components Interactivos

Estos componentes están disponibles **globalmente** en todos los posts, sin necesidad de importarlos. Definidos en `lib/mdx.tsx`.

### `<Callout>` — Notas y Alertas

```mdx
<Callout type="tip" title="Regla de oro">
  Las dependencias siempre apuntan hacia adentro en la Arquitectura Hexagonal.
</Callout>
```

**Tipos disponibles:** `note` | `tip` | `warning` | `danger` | `success`
- `note` → azul/indigo (info general)
- `tip` → verde (buenas prácticas)
- `warning` → amarillo (cuidado)
- `danger` → rojo (no hacer esto)
- `success` → verde brillante (resultado ideal)

---

### `<FileTree>` — Árbol de Archivos Interactivo

Añade `[highlight]` para resaltar archivos clave.

```mdx
<FileTree title="src/">
{`
  src/
    domain/
      entities/
        user.py  [highlight]
      ports/
        user_repo.py  [highlight]
    infrastructure/
      db/
        postgres_user_repo.py
    application/
      use_cases/
        create_user.py
`}
</FileTree>
```

---

### `<Steps>` y `<Step>` — Guía Paso a Paso

```mdx
<Steps>
  <Step title="Instala FastAPI y Uvicorn">
    ```bash
    pip install fastapi uvicorn
    ```
  </Step>
  <Step title="Define tu primer endpoint">
    Crea un archivo `main.py` con tu primer route handler.
  </Step>
  <Step title="Arranca el servidor">
    ```bash
    uvicorn main:app --reload
    ```
  </Step>
</Steps>
```

---

### `<ComparisonTable>` — Tabla Comparativa

El parámetro `highlight` indica el índice de la columna ganadora (0-indexed).

```mdx
<ComparisonTable
  headers={["Arquitectura Hexagonal", "MVC Tradicional"]}
  highlight={0}
  rows={[
    ["Testable sin base de datos", "Tests lentos con DB"],
    ["Swappable infrastructure", "Acoplado al ORM"],
    ["Más archivos/directorios", "Menos boilerplate inicial"],
    ["Ideal para proyectos >6 meses", "Ideal para prototipos rápidos"],
  ]}
/>
```

---

### `<CodeComparison>` — Código Antes/Después

```mdx
<CodeComparison
  before={{
    label: "❌ Acoplado a la DB",
    code: `def get_user(user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user`
  }}
  after={{
    label: "✅ Puerto + Adaptador",
    code: `def get_user(user_id: UserId, repo: UserRepository) -> User:
    return repo.find_by_id(user_id)`
  }}
/>
```

---

## 🖼️ Gestión de Imágenes (Vercel Blob)

**IMPORTANTE:** Nunca subir imágenes directamente al repositorio Git.

### Flujo de Trabajo:
1. Ve a `https://ochoajorge.me/es/admin/upload` (o `/en/admin/upload`)
2. Sube la imagen → obtienes una URL pública de Vercel Blob
3. Usa esa URL directamente en el MDX:

```mdx
![Diagrama de Arquitectura Hexagonal](https://6pxof7rpjdk6gkca.public.blob.vercel-storage.com/tu-imagen.webp)
```

**Formatos recomendados:** `.webp` preferido, luego `.png` para diagramas, `.jpg` para fotos.

---

## 🌐 Internacionalización (i18n)

El blog soporta `es` y `en` como locales.

### Dónde están las traducciones:
- **UI (nav, labels):** `lib/dictionary.ts` — claves: `nav`, `blog`, `footer`, `newsletter`
- **Contenido posts:** carpetas `content/posts/es/` y `content/posts/en/`
- **Rutas:** siempre llevan prefijo de idioma → `/{lang}/blog/{slug}`

### Nav actual (ambos idiomas):
| Ruta | ES | EN |
|---|---|---|
| `/{lang}/blog` | Blog | Blog |
| `/{lang}/projects` | Proyectos | Projects |
| `/{lang}/uses` | Stack | Uses |
| `/{lang}/about` | Sobre mí | About |

---

## ✉️ Newsletter (Resend)

El sistema de newsletter usa **Resend** con Server Actions.

- **Server Action:** `lib/actions/newsletter.ts`
- **Componente:** `components/shared/NewsletterForm.tsx`
- **Variantes:** `variant="full"` (card con descripción) o `variant="compact"` (inline)
- **Variables requeridas en entorno:** `RESEND_API_KEY` y `RESEND_AUDIENCE_ID`
- En local sin API key → funciona en **modo demo** (no falla, muestra mensaje)

Uso en cualquier página:
```tsx
<NewsletterForm lang={lang} variant="full" />
```

---

## 📖 Modo Lector (Reader Mode)

El botón `<ReaderMode />` aparece en posts (floating, desktop only):
- Oculta header, footer y sidebar
- Aumenta font-size y line-height del prose
- Se activa con `body.reader-mode` class → `Escape` para salir
- Persiste en `localStorage`

No requiere acción del creador de posts — es automático en el layout.

---

## 🎡 Sistema de Temas

El blog tiene dos temas controlados por `next-themes`:
- **Dark (default):** Navy Pro oscuro con acentos indigo/cyan
- **Light:** Inspirado en LinkedIn (azul profesional, fondos blancos)

**Regla crítica para cualquier componente nuevo:** Usar SIEMPRE CSS variables, nunca colores hardcodeados.

```tsx
// ✅ Correcto
<div className="bg-[var(--bg-surface)] text-[var(--text-primary)]">

// ❌ Incorrecto
<div className="bg-gray-900 text-white">
```

Variables principales:
| Variable | Uso |
|---|---|
| `--bg-base` | Fondo principal de la página |
| `--bg-surface` | Cards y contenedores |
| `--bg-elevated` | Elementos elevados, inputs |
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |
| `--text-muted` | Texto de apoyo, labels |
| `--brand` | Color de acento principal (indigo) |
| `--brand-light` | Variante clara del brand |
| `--border` | Bordes estándar |
| `--border-brand` | Bordes con acento |

---

## 💬 Comentarios (Giscus)

El blog usa **Giscus** para comentarios vinculados a GitHub Discussions.

Requisitos para que funcione en cada post:
1. El repo debe ser **público**
2. **Discussions** habilitadas en GitHub Settings
3. El componente `<Comments lang={lang} />` ya está en el post layout — no requiere acción

---

## 🗺️ Sitemap y SEO

El sitemap dinámico en `app/sitemap.ts` indexa automáticamente:
- Páginas estáticas (home, blog, about, projects, uses)
- Todos los posts publicados (`draft: false`) en ambos idiomas
- Páginas de tags y series

**Para cada post nuevo, el agente DEBE verificar:**
- [ ] `title` — keyword principal en las primeras 3 palabras
- [ ] `description` — 150-160 caracteres exactos
- [ ] `tags` — 2-5 tags en el idioma del post
- [ ] `date` — formato `YYYY-MM-DD`
- [ ] `draft: false` — solo cuando está listo
- [ ] Links internos a posts relacionados dentro del contenido (mejora internal linking)

---

## 🏗️ Estructura de Archivos Clave

```
app/
  [lang]/
    blog/[slug]/
      page.tsx            ← Post layout (ToC, ReadingProgress, RelatedPosts, ReaderMode)
      opengraph-image.tsx ← OG dinámica por post (auto)
    uses/page.tsx         ← Página /uses (hardware, stack, herramientas)
    about/page.tsx        ← Página sobre Jorge
    layout.tsx            ← Root layout con Analytics, SpeedInsights, ThemeProvider
  sitemap.ts              ← Sitemap dinámico (auto-generado)
  globals.css             ← Design tokens (CSS variables), Reader Mode CSS

components/
  blog/
    PostCard.tsx          ← Card de post en listados
    PostHeader.tsx        ← Header interno del post
    RelatedPosts.tsx      ← Posts relacionados (prioridad: serie > tags)
    TableOfContents.tsx   ← ToC sticky con IntersectionObserver activo
    ReadingProgress.tsx   ← Barra de progreso de lectura
    ReaderMode.tsx        ← Toggle modo lector (Esc para salir)
    SeriesBanner.tsx      ← Banner de serie dentro de post
    Search.tsx            ← Búsqueda con modal
    Comments.tsx          ← Giscus
  mdx/
    FileTree.tsx          ← Árbol interactivo collapsible
    MDXComponents.tsx     ← Callout, ComparisonTable, Steps, CodeComparison
  shared/
    NewsletterForm.tsx    ← Formulario Resend (compact | full)
    AnimatedSection.tsx   ← Wrapper con animación de entrada
    Tag.tsx               ← Badge de tag linkeable

lib/
  mdx.tsx                 ← Compilador MDX + registro global de components
  posts.ts                ← getAllPosts, getPostBySlug, getPostsByTag, etc.
  dictionary.ts           ← Traducciones de UI (nav, blog, newsletter)
  utils.ts                ← siteConfig (URLs, nombre, redes sociales)
  actions/
    newsletter.ts         ← Server Action para Resend

content/posts/
  es/                     ← Posts en español
  en/                     ← Posts en inglés
```

---

## 🔗 Links del Autor (`lib/utils.ts → siteConfig`)

```ts
author: {
  name: "Jorge Ochoa",
  twitter: "@kr0nicas",           // x.com/kr0nicas
  github: "https://github.com/kr0nicas",
  linkedin: "https://www.linkedin.com/in/jorge-ochoa-rebollo/",
  bluesky: "https://bsky.app/profile/kr0nicas.bsky.social",
}
```

---

## 🛠️ Comandos Útiles

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Build de producción — verificar antes de deploy
npx tsc --noEmit    # Type check sin compilar
git push origin main # Deploy automático a Vercel
```

---

*Fuente de verdad para agentes IA que colaboren en este repositorio. Actualizado: Marzo 2026.*
