# Rediseño del blog — "Grotesk Suizo"

**Fecha:** 2026-08-08
**Estado:** Aprobado por Jorge (dirección validada con mockups interactivos; ver `.superpowers/brainstorm/` local)
**Alcance:** Identidad visual, presentación de posts, interacción de lectores y workflow, entregado en 5 fases como PRs independientes a `develop`.

## Objetivo

Pasar de la identidad actual (dark navy + light LinkedIn, cards glass uniformes, cero jerarquía visual) a una identidad editorial clara tipo revista de diseño: blanco, tipografía grotesk protagonista, terminales de código con presencia, y cada post representado por su OG image. Al mismo tiempo, activar la interacción real con lectores (newsletter, comentarios, reacciones) y endurecer el workflow.

## No-objetivos

- No se migra de framework ni de Tailwind v4. No se añade CMS.
- No se tocan las URLs ni la estructura de contenido (`content/posts/{es,en}/*.mdx`).
- No se rediseñan páginas secundarias (/uses, admin) más allá de heredar tokens nuevos.
- El publisher de redes sociales NO se reemplaza: se elimina (peso muerto).

## Decisiones de diseño validadas

### Identidad "Grotesk Suizo"

Tema claro por defecto; oscuro disponible con el toggle existente (`next-themes`, `defaultTheme` pasa de `dark` a `light`).

**Tokens de color** (reemplazan íntegramente los sets "Navy Pro" y "LinkedIn Professional" de `globals.css`):

| Token | Claro | Oscuro |
|---|---|---|
| `--bg-base` | `#ffffff` | `#0c0c0d` |
| `--bg-surface` | `#f4f4f4` | `#161618` |
| `--text-primary` | `#0a0a0a` | `#fafafa` |
| `--text-secondary` | `#4a4a4a` | `#a8a8a8` |
| `--text-muted` | `#8f8f8f` | `#7d7d7d` |
| `--brand` (azul eléctrico) | `#0d40f5` | `#6b8cff` |
| `--accent` (naranja señal) | `#ff5c39` | `#ff7857` |
| `--border` | `#e8e8e8` | `#232326` |

Uso del color: azul para enlaces, kickers y foco; naranja SOLO para señales pequeñas (reacciones ★, destacado, subrayados puntuales). Nada de glass ni glow genérico; hairlines y sombras suaves.

**Tipografía** (cargada con `next/font/google`, self-hosted en build):

- **Space Grotesk** (500/700) — display: h1-h3, titulares de cards. `letter-spacing: -0.02em`.
- **Archivo** (400/500/600) — cuerpo y UI.
- **JetBrains Mono** (400/500/700) — código, meta (fechas, reading time), kickers, tags.
- Escala tipográfica única definida en `@theme` (Tailwind v4), no tamaños ad-hoc por componente.

**Terminales de código:** todo bloque de código MDX se envuelve en ventana de terminal: barra oscura con semáforos macOS, nombre de archivo tomado del meta del code fence (` ```python title="worker.py" `), botón copiar. Cuerpo siempre oscuro (`#0f0f10`) con sombra pronunciada — el código es protagonista visual también en tema claro.

**OG images:** plantilla `next/og` en `opengraph-image.tsx` rediseñada: fondo `#0c0c0d` con grid sutil, glow radial azul o naranja (alternado por pilar temático), kicker `// {pilar}` en mono, título en Space Grotesk, marca `ochoajorge.me` en mono. La misma imagen sirve para compartir en redes y como thumbnail en las cards del sitio.

## Fases de entrega

Cada fase = un PR a `develop`. Jorge promociona `develop` → `main` cuando quiera publicar. Fases 0 y 4 no dependen del diseño; 1 → 2 → 3 en secuencia.

### Fase 0 — Base sana

1. Cargar Space Grotesk, Archivo y JetBrains Mono vía `next/font` en `app/[lang]/layout.tsx`; eliminar `body { font-family: var(--font-mono) }` (`globals.css:198`) que hoy renderiza TODO el sitio en monospace de sistema.
2. Eliminar `tailwind.config.ts` (nunca se carga en Tailwind v4); mover lo necesario a `@theme` en `globals.css`. Sustituir las 33 instancias de `font-display` por la utilidad real resultante.
3. ToC móvil: en <1280px, `TableOfContents` se renderiza como `<details>` colapsable arriba del artículo (hoy: `hidden xl:block`, inexistente en móvil/tablet). Reader mode visible en todas las pantallas.
4. `Comments.tsx:30`: usar `resolvedTheme` en lugar de `theme` (hoy Giscus recibe `"system"` y carga iframe claro sobre página oscura).
5. Proteger `app/api/upload/route.ts`: requerir header `Authorization: Bearer ${UPLOAD_SECRET}` (nueva env var); la página `admin/upload` pide el secreto y lo guarda en sessionStorage. Hoy el endpoint está abierto a internet.
6. Añadir `.superpowers/` a `.gitignore`.

### Fase 1 — Identidad

1. Reemplazar los dos sets de tokens de `globals.css` por el sistema Grotesk Suizo (tabla anterior). `defaultTheme="light"`.
2. Refactor de componentes que consumen tokens muertos o clases glass (`.card-glass`, `.glow-brand`, `.gradient-text`) hacia el nuevo sistema.
3. Componente `Terminal` para code blocks MDX (rehype: extraer `title` del fence meta) + estilos de syntax highlighting alineados (azul/naranja/verde sobre `#0f0f10`).
4. Nueva plantilla OG en `opengraph-image.tsx`; eliminar los scripts estáticos de OG que queden obsoletos (ver Fase 4).

### Fase 2 — Presentación de posts

1. **Home** (`app/[lang]/page.tsx`): hero `$ whoami` con titular Space Grotesk de impacto → post destacado (primer `featured: true`; fallback: más reciente) con su OG en grande + descripción → grid de recientes → newsletter. Eliminar stats hardcodeadas del about-teaser.
2. **PostCard**: OG image arriba (`/[lang]/blog/[slug]/opengraph-image`), título display, meta mono (fecha · min · ★). Sustituye al card-glass.
3. **Post page**: `PostHeader` con kicker `// {pilar o serie}` en mono, sin repetir cover dentro del post. `ShareButton` solo al final (quitar el del header).

### Fase 3 — Interacción

1. **Reacciones ★:** Upstash Redis (Vercel Marketplace, free tier). `GET/POST /api/reactions/[slug]`; POST incrementa (`INCR reactions:{lang}:{slug}`), sin autenticación pero con rate limit por IP (Upstash Ratelimit) y dedupe optimista por localStorage en el cliente. Componente `ReactionButton` en meta del post. En listados, los counts se leen server-side en un solo `MGET` batch con revalidación de 60 segundos (no por-card ni client-side), y se pasan a las cards como props.
2. **Newsletter:** quitar el "demo mode" de `lib/actions/newsletter.ts` (hoy devuelve éxito falso sin API key → error visible si falta config). Formulario `compact` al final de cada post y en el Footer. **Acción de Jorge:** crear API key + Audience en Resend y setear `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` en Vercel.
3. **Giscus:** carga diferida con IntersectionObserver al llegar al final del artículo. **Acción de Jorge:** crear categoría "Comments" (tipo Announcement) en GitHub Discussions y actualizar `data-category`/`categoryId` en `Comments.tsx` (hoy: "Show and tell", abierta a que terceros creen discusiones que aparecen como hilos de comentarios).
4. **Compartir:** `navigator.share` si existe (móvil), fallback a botones actuales; fallback de `navigator.clipboard` con `document.execCommand` para contextos no-secure.

### Fase 4 — Workflow y limpieza

1. **CI:** `.github/workflows/ci.yml` — en PRs y pushes a `develop`/`main`: `npm ci`, `lint`, `type-check`, `seo:audit`, `build`. Node 22.
2. **Pre-commit:** crear `.husky/pre-commit` con `npx lint-staged` (config ya existe en `package.json`, nunca corre por falta del hook).
3. **Limpieza:** eliminar `scripts/social_media_publisher.py`, `test_social_media.py`, `setup_social_media.sh`, `quick_test.sh`, `requirements.txt`, `README_SOCIAL_MEDIA.md`, `DEPLOYMENT_SUMMARY.md` (nada los referencia); consolidar/eliminar los 6 scripts de OG images (obsoletos con OG dinámica); eliminar `tailwind.config.ts` (fase 0 si no se hizo ya); borrar las 4 `.jpg` de la raíz del repo y `tyrion_test_marker.txt`.
4. **Docs:** actualizar `CLAUDE.md`, `README.md` y `.agent/workflows/new_post.md`: nueva identidad, tokens, componente Terminal, flujo worktree → PR a `develop` → promoción a `main`, y las env vars requeridas.

## Env vars requeridas (todas en Vercel + `.env.local` de ejemplo en `.env.example`)

| Var | Fase | Quién |
|---|---|---|
| `UPLOAD_SECRET` | 0 | Jorge genera |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | 3 | Jorge crea en Resend |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 3 | Auto al conectar Upstash en Vercel |

## Verificación por fase

- Cada PR: CI verde (desde fase 4 se adelanta a fase 0 si se prefiere — recomendado mergear CI primero).
- Fase 0: fuentes visibles en devtools (no fallback), ToC operable en viewport 390px, `curl` sin token a `/api/upload` devuelve 401.
- Fase 1: `npm run build` + revisión visual light/dark de home, post, listado; OG visible en validador de LinkedIn/X.
- Fase 2: Lighthouse ≥ 95 en performance/SEO en home y un post (las OG en cards añaden peso — verificar `sizes` correctos).
- Fase 3: reacción persiste tras recargar; newsletter con Resend en modo test; Giscus carga solo al hacer scroll al final.
- `npm run test:e2e` pasa en todas las fases.

## Riesgos

- **Peso de OG en cards:** 51 posts × imagen 1200×630. Mitigación: `next/image` con `sizes` estrictos y lazy loading (solo above-the-fold eager).
- **Upstash es dependencia externa nueva:** si el free tier cambia, las reacciones degradan a ocultarse (el componente tolera error del endpoint sin romper el post).
- **Cambio de categoría Giscus:** los hilos existentes en "Show and tell" no migran solos; los posts con comentarios activos los conservan si se mapea por pathname — verificar antes de cambiar `categoryId`.
