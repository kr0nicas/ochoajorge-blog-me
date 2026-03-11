---
description: Flujo estándar para corregir bugs en la aplicación Next.js/TypeScript del blog.
---

# Bug Fix Workflow

Este workflow es obligatorio siempre que se corrija un bug en la interfaz, los datos de contenido o el flujo de publicación. El objetivo es reproducir localmente, entender la causa raíz, aplicar el mínimo cambio necesario y verificar con linters y build.

## 1. Reproducción y diagnóstico

- **Levanta el entorno local**: `npm run dev` y navega a la ruta afectada (`app/[lang]/...`). Usa el log de la consola y el inspector del navegador para capturar errores de runtime o datos faltantes.
- **Identifica el origen**: revisa `app/`, `components/`, `lib/`, `content/` según corresponda. Confirma si el problema viene de datos (frontmatter), rutas (App Router), componentes MDX o utilidades compartidas (`lib/utils.ts`, `lib/posts.ts`, `lib/mdx.tsx`).
- **Registra pasos**: anota los pasos exactos, entradas y datos que exponen el bug, incluyendo idioma (`es` / `en`), series, etiquetas o filtros relevantes.

## 2. Implementación del fix

- **Crea branch descriptivo**: `git checkout -b fix/descripcion-breve`.
- **Haz el cambio mínimo necesario**: modifica sólo `app/`, `components/`, `lib/` o `scripts/` afectados. Evita refactors amplios a menos que sean parte del fix.
- **Actualiza tests-docs relacionados** (si aplica): archivos MDX, workflows o scripts que describan el comportamiento corregido (por ejemplo `.agent/workflows/*.md` si la doc cambió con el fix).

## 3. Verificación

- **Lint y type-check**: `npm run lint` y `npm run type-check`.
- **Build completo**: `npm run build` para garantizar que `next` y MDX compilan sin errores.
- **Chequeo específico** (según bug): `npm run seo:audit` si el problema estaba en metadata/frontmatter; o abre `npm run dev` y reproduce manualmente el flujo (switch idioma, series, tags).
- **Pruebas manuales adicionales**: navega a `[lang]/blog`, `[lang]/tags/[tag]`, `[lang]/series/[slug]`, y páginas del layout para confirmar que no aparecen regresiones visibles.

## 4. Commit y deploy

- **Mensaje convencional**: `fix(blog): descripción corta` o `fix(layout): ...` según la capa.
- **Describe el fix**: en el cuerpo del commit menciona el síntoma original, la causa raíz y cómo se verificó.
- **Documentación**: actualiza `.agent/workflows/` o `README.md` sólo si el bug reveló una laguna documental.
- **Push**: `git push origin fix/...` y crea PR. Vercel desplegará automáticamente al mergear a `main`.

## 5. Post-merge

- Verifica el fix en la preview/deploy de Vercel (si aplica) navegando a la ruta afectada y consultando Vercel Analytics si se trata de performance o metadata.
- Si el bug estaba en la metadata SEO, confirma con `https://validator.schema.org/` y la vista previa en `opengraph.xyz`.
